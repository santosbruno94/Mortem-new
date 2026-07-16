// =====================================================================
// MONTADOR DO PACOTE JOGÁVEL — o caso GERADO vira um pacote de caso
// completo (o contrato de src/data/pacote_caso.js), pronto para o motor
// carregar via carregarCaso().
//
// Módulo GERADOR-FACING (ilha de build time; o runtime JAMAIS o importa —
// guarda no qa.mjs). Quem o consome é scripts/gerar-casos.mjs, que grava
// os pacotes prontos como DADO versionado em src/data/casos_gerados.js:
// zero geração em runtime, zero import de gerador no bundle jogável.
//
// O QUE ESTE MÓDULO FAZ:
//   • toma gerarCasoBruto(seed, opts) (Fases 1–5) e AGREGA a fatia
//     forense + as cartas de interferência num pacote serializável;
//   • REALIZA a prosa: os rótulos técnicos das cartas viram texto jogável
//     por TEMPLATES versionados (determinísticos — nenhum LLM, nenhum
//     sorteio fora de hashString), com nomes de pessoas e lugares do
//     próprio mundo gerado no lugar dos ids;
//   • deriva o mapa do caso (nós, grupos, custos) da cidade da Fase 2;
//   • escreve as localidades com os marcadores [[id]] de TODAS as cartas
//     extraíveis, mais os blocos CONTINGENTES da interferência (prosa que
//     aparece/some conforme o evento dispara — camada de UI; o motor não
//     a lê);
//   • monta abertura de 6 passos no MESMO shape do caso-escola (o rótulo
//     final "Entrar — iniciar a investigação" é contrato do qa-ui).
//
// REGRAS QUE NÃO CEDEM AQUI:
//   • tagsOcultas das cartas passam INTACTAS da fatia — a camada lógica
//     não se toca; este módulo só escreve apresentação.
//   • verdadeDeOuro: cenaEncenada vira false no PACOTE (o gerador v1 não
//     produz encenação de HORA — o arrasto do autobattler é contradição
//     narrativa via livor, não peça refutável; sem peça, exigir descuidos
//     tornaria a Vitória Absoluta inalcançável). instrumentoCorreto passa
//     a nomear o tipoVestigio da carta de nexo (métodos sem instrumento —
//     esganadura — apontam o pertence arrancado).
//   • NB de prosa: os templates abaixo são redação FUNCIONAL da Fase 6
//     (mecânica primeiro), no mesmo regime declarado em dialogos.js — a
//     lapidação final passa pelo pipeline `revisar-prosa` em passo
//     próprio. O lint-prosa mecânico já fiscaliza este arquivo.
// =====================================================================

import { hashString } from '../logic/hash.js';
import { formatHora, formatHoraComDia, CALENDARIO_PADRAO } from '../logic/tempo.js';
import { AMBIENTE_PADRAO } from '../logic/tempo_morte.js';
import { gerarCasoBruto } from './caso.js';
import { derivarDialogos } from './dialogos_gerados.js';
import { ECOS_INTERFERENCIA_PADRAO } from '../data/ecos_interferencia.js';

// ---------------------------------------------------------------------
// A RÉPLICA do caso-escola (modo 2): seed fixa + variáveis dirigidas que
// aproximam o caso gerado d'"A Hora Emprestada". A busca de seed (240
// candidatas, placar de aproximação em scripts/gerar-casos.mjs) escolheu
// a_hora_emprestada_replica_96: lojista morto na própria loja às 21h de
// 13/out, arma branca premeditada, a criada da casa com a referência
// negada como móbil (o empregado contra o patrão), INT4/WIS4 (o quadrante
// de Silas) e corpo movido. O catálogo v1 não alcança: encenação de hora,
// móbil "silenciamento de fraude", periféricos com segredo.
// ---------------------------------------------------------------------
export const SEED_REPLICA = 'a_hora_emprestada_replica_96';
export const DIRIGIDO_REPLICA = {
  cenario: 'premeditado',
  faixa: 'noite',
  metodoId: 'laminada',
  vitimaArquetipo: 'merceeiro',
  assassinoMotivo: 'character_negado',
};

// ---------------------------------------------------------------------
// Nomes de vila (camada narrativa; ingleses fictícios plausíveis, no
// padrão -field/-brook/-mere dos topônimos rurais — cf. docs/
// kb-mundo-vitoriano/vida-cotidiana.md, aldeias de condado).
// ---------------------------------------------------------------------
const NOMES_DE_VILA = ['Wrenfield', 'Dunmere', 'Colbrook', 'Haversham', 'Aldergate', 'Marlow Green'];
const SOBRENOMES_DELEGADO = ['Fenwick', 'Harrow', 'Quill', 'Bexley', 'Stanmore', 'Roderick'];

// Rótulo humano da faixa do crime, no calendário do caso (13–14/out).
function rotuloDaFaixa(faixa) {
  if (faixa === 'noite') return 'na noite de 13';
  if (faixa === 'madrugada') return 'na madrugada de 14';
  return 'à tarde de 13';
}

// Frases de móbil por catálogo (mesmas chaves de MOTIVOS_POTENCIAIS —
// arquetipos.js; guarda de cobertura no qa.mjs).
const PROSA_MOTIVO = {
  divida_caderneta: (reu, vitima) =>
    `Uma caderneta de fiado soma a dívida de ${reu} para com ${vitima}, vencida e cobrada por carta.`,
  seguro_de_enterro: (reu, vitima) =>
    `Uma apólice de enterro em nome de ${vitima} paga a ${reu} quando a morte vier.`,
  heranca: (reu, vitima) =>
    `Papéis de partilha: com a morte de ${vitima}, o que era dele passa às mãos de ${reu}.`,
  dote: (reu, vitima) =>
    `Cartas sobre um dote prometido e não pago atam ${reu} a ${vitima}, com somas e datas.`,
  salario_atrasado: (reu, vitima) =>
    `Consta queixa de paga retida: ${vitima} devia a ${reu} semanas de salário.`,
  escandalo_gravidez: (reu, vitima) =>
    `Corre na vila o falatório que ${reu} queria enterrado — e ${vitima} era quem o repetia.`,
  character_negado: (reu, vitima) =>
    `${vitima} negou a ${reu} a carta de referência; sem ela, casa nenhuma o toma a serviço.`,
  despejo: (reu, vitima) =>
    `A ordem de despejo do cottage de ${reu} leva a assinatura de ${vitima}.`,
  rivalidade_capela_taverna: (reu, vitima) =>
    `A queixa pública entre ${reu} e ${vitima} — a capela contra a taverna — está lavrada em ata.`,
  recasamento_vigiado: (reu, vitima) =>
    `O recasamento de ${reu} corria sob a língua da vila, e ${vitima} era quem mais falava dele.`,
};

// A lesão fatal por método: nome de carta e laudo de exame próximo.
const PROSA_LESAO = {
  laminada: {
    textoDisplay: 'A Ferida Incisa',
    descricao:
      'Corte de bordas regulares, mais fundo onde começa e raso onde termina. As margens são limpas, sem ponte de pele entre elas.',
  },
  garrote: {
    textoDisplay: 'O Sulco no Pescoço',
    descricao:
      'Um sulco uniforme corre horizontal em volta do pescoço, na mesma profundidade de ponta a ponta, sem subir rumo à nuca.',
  },
  esganadura: {
    textoDisplay: 'As Marcas no Pescoço',
    descricao:
      'Equimoses do tamanho de polpas de dedo dos dois lados da traqueia, e meias-luas de unha impressas na pele.',
  },
  contundente: {
    textoDisplay: 'A Fratura no Crânio',
    descricao:
      'Sob o cabelo, o couro cede ao tato num afundamento de bordas irregulares; o osso acompanha a depressão.',
  },
  veneno_arsenico: {
    textoDisplay: 'O Hálito de Alho',
    descricao:
      'O hálito do morto guarda um cheiro de alho que não é de mesa; na boca, um resto de vômito seco.',
  },
};

// Descrições dos estados temporais (universais — o modelo forense é o
// mesmo de tempo_morte.js; validar contra docs/kb-medicina-legal/).
const PROSA_RIGOR = {
  instalando:
    'O maxilar não cede ao polegar; os cotovelos ainda dobram ao peso da mão. A rigidez sobe pelo corpo e não o tomou inteiro.',
  pleno: 'Duro do maxilar aos joelhos. O corpo fixou-se na postura em que a morte o encontrou.',
  resolucao: 'O maxilar volta a ceder; os joelhos seguem presos. A rigidez que o tomou começa a desfazer-se.',
  resolvido: 'Junta nenhuma resiste ao exame. A rigidez veio e já passou por inteiro.',
};
const PROSA_LIVOR = {
  movel: 'As manchas de sangue assentado empalidecem sob o polegar e tornam à cor quando a pressão cessa.',
  fixo: 'As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou.',
};
const NOTA_LIVOR_CONTRADITORIO =
  ' As manchas, porém, guardam o desenho de outra postura: assentaram do lado que ora fica para cima.';

// ---------------------------------------------------------------------
// Auxiliares sobre o mundo gerado.
// ---------------------------------------------------------------------
function indicePorId(lista) {
  const m = new Map();
  for (const item of lista) m.set(item.id, item);
  return m;
}

function nomeDoPredio(cidade, predioId) {
  const p = cidade.predios.find((x) => x.id === predioId);
  return p ? p.rotulo : predioId;
}

// Uma frase de retrato comportamental por trait/comportamento — nota de
// observação (gesto), nunca veredicto (guia §2).
const FRASE_TRAIT = {
  medroso: 'Fala baixo e mede a porta antes de responder.',
  tagarela: 'Responde o perguntado e emenda três coisas que ninguém perguntou.',
  preciso: 'Dá horas e quantias de um fôlego, sem procurá-las.',
  linha_tempo_nao_confiavel: 'Conta a noite por canecas, e as horas não fecham entre si.',
};
const FRASE_COMPORTAMENTO = {
  revela_facil: 'Recebe de porta aberta e adianta-se às perguntas.',
  revela_sob_custo: 'Cada resposta sai ao preço de duas perguntas.',
  observacao_precisa: 'Descreve o que viu com hora e lugar.',
  observacao_vaga: 'Do que viu, guarda o vulto e perde o resto.',
};

function descricaoDePessoa(p) {
  const frases = [];
  for (const t of p.traits) {
    if (FRASE_TRAIT[t]) frases.push(FRASE_TRAIT[t]);
    if (frases.length) break;
  }
  if (!frases.length) {
    for (const c of p.comportamentos) {
      if (FRASE_COMPORTAMENTO[c]) {
        frases.push(FRASE_COMPORTAMENTO[c]);
        break;
      }
    }
  }
  return frases.join(' ') || 'Responde o que se pergunta e volta ao trabalho.';
}

// ---------------------------------------------------------------------
// Realização de prosa das CARTAS da fatia forense (tagsOcultas intactas).
// ---------------------------------------------------------------------
function realizarCartas(bruto) {
  const { crime, escolha, fatiaForense, interferencia } = bruto;
  const pessoas = indicePorId(bruto.mundo.elenco);
  const nome = (id) => (pessoas.get(id) ? pessoas.get(id).nome : id);
  const vitima = pessoas.get(crime.vitimaId);
  const reu = pessoas.get(crime.assassinoId);

  const cartas = [];
  for (const c of fatiaForense.cartas) {
    const nova = JSON.parse(JSON.stringify(c));
    switch (c.id) {
      case 'gen_rigor':
        for (const estado of nova.estados) {
          estado.descricao = PROSA_RIGOR[estado.tagsOcultas.estadoRigor];
        }
        break;
      case 'gen_livores':
        for (const estado of nova.estados) {
          estado.descricao =
            PROSA_LIVOR[estado.tagsOcultas.estadoLivor] +
            (estado.tagsOcultas.posicaoCompativel === false ? NOTA_LIVOR_CONTRADITORIO : '');
        }
        break;
      case 'gen_lesao_fatal': {
        const p = PROSA_LESAO[escolha.metodoId];
        nova.textoDisplay = p.textoDisplay;
        nova.descricao = p.descricao;
        break;
      }
      case 'gen_reacao_vital':
        nova.descricao =
          'As lesões mostram bordas inchadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.';
        break;
      case 'gen_visto_vivo': {
        const quando = formatHoraComDia(c.tagsOcultas.horaAvistamento);
        const quem = c.origemTestemunha ? nome(c.origemTestemunha) : null;
        nova.carimboPadrao = `Vítima com vida às ${quando}`;
        nova.descricao = quem
          ? `${quem} esteve com ${vitima.nome} às ${quando}, e o declara à ronda. Depois dessa hora, ninguém mais o encontrou em pé.`
          : `Do registro da ronda consta ${vitima.nome} com vida às ${quando}. Depois dessa hora, ninguém mais o encontrou em pé.`;
        break;
      }
      case 'gen_instrumento': {
        const v = crime.vestigios.find((x) =>
          ['instrumento_abandonado', 'instrumento_faltando', 'instrumento_guardado_umido'].includes(x.classe)
        );
        const classe = v ? v.classe : 'instrumento_abandonado';
        if (classe === 'instrumento_abandonado') {
          nova.textoDisplay = 'O Instrumento Abandonado';
          nova.carimboPadrao = 'Instrumento deixado na cena';
          nova.descricao = `Ficou onde a mão o largou. O feitio casa com a lesão do morto, e o dono tem nome na vila: ${reu.nome}.`;
        } else if (classe === 'instrumento_faltando') {
          nova.textoDisplay = 'O Lugar Vazio';
          nova.carimboPadrao = 'Instrumento que falta no seu lugar';
          nova.descricao = `Entre as coisas de ofício de ${reu.nome}, um vão limpo no meio do pó: falta ali a peça cujo feitio casa com a lesão do morto.`;
        } else {
          nova.textoDisplay = 'O Instrumento Úmido';
          nova.carimboPadrao = 'Instrumento guardado ainda úmido';
          nova.descricao = `Entre os pertences de ${reu.nome}, a peça guardada lavada — e a junta do cabo ainda úmida. O feitio casa com a lesão do morto.`;
        }
        break;
      }
      case 'gen_pertence': {
        const houvePertence = crime.vestigios.some((x) => x.classe === 'pertence_do_assassino');
        nova.textoDisplay = 'O Pertence Arrancado';
        nova.carimboPadrao = houvePertence ? 'Botão com fio na mão da vítima' : 'Objeto alheio junto ao corpo';
        nova.descricao = houvePertence
          ? `Na mão fechada do morto, um botão de casaco com fio e um triângulo de pano. O casaco de ${reu.nome} perdeu o segundo botão.`
          : `Junto ao corpo, um objeto que não é do morto nem da casa. O par dele está entre as coisas de ${reu.nome}.`;
        break;
      }
      case 'gen_sangue_alheio':
        nova.carimboPadrao = 'Sangue afastado do corpo';
        nova.descricao =
          'Gotas de sangue a passos do corpo, num caminho que o morto não fez. Alguém saiu dali ferido, e andando.';
        break;
      case 'gen_pegadas':
        nova.carimboPadrao = 'Meias-solas impressas em sangue';
        nova.descricao = 'Meias-solas impressas em sangue, espaçadas rumo à porta. O passo é de saída, e é um só.';
        break;
      case 'gen_ruido_ouvido': {
        const quem = c.origemTestemunha ? nome(c.origemTestemunha) : 'A vizinhança';
        nova.carimboPadrao = `Barulho ouvido ${rotuloDaFaixa(c.tagsOcultas.faixa)}`;
        nova.descricao = `${quem} conta o que a parede deixou passar ${rotuloDaFaixa(
          c.tagsOcultas.faixa
        )}: "Pancada, e móvel no chão, e depois mais nada."`;
        break;
      }
      case 'gen_motivo': {
        const frase = PROSA_MOTIVO[c.tagsOcultas.motivo];
        nova.textoDisplay = 'Os Papéis do Móbil';
        nova.carimboPadrao = `Móbil de ${reu.nome}`;
        nova.descricao = frase ? frase(reu.nome, vitima.nome) : `Papéis da delegacia ligam ${reu.nome} ao morto.`;
        break;
      }
      default:
        break;
    }
    cartas.push(nova);
  }

  // Cartas da interferência: o prenúncio conserva o TEXTO EXATO do evento
  // (contrato R4/Fase 5); as demais trocam o rótulo técnico por prosa.
  for (const c of interferencia.cartasExtra) {
    const nova = JSON.parse(JSON.stringify(c));
    const t = c.tagsOcultas || {};
    if (t.subDominio === 'recusa_subita') {
      nova.descricao = `${nome(t.testemunha)} não abre a porta mais que um palmo. O que declarou antes, nega agora ter declarado.`;
    } else if (t.subDominio === 'pressao_sobre_testemunha') {
      nova.descricao = `Uma visita fora de hora, notada da rua, e uma voz baixa à porta. Mais de um vizinho dá o nome de quem veio: ${nome(
        t.pertenceA
      )}.`;
    } else if (t.subDominio === 'retratacao') {
      nova.descricao = `${nome(t.testemunha)} conta agora outra versão da mesma noite — palavra nova contra o que consta do primeiro registro.`;
    } else if (t.subDominio === 'rastro_de_dinheiro' && t.pertenceA) {
      nova.descricao = `Soberanos novos, contados à vista de todos. Moeda graúda tem caminho — e o caminho sobe até ${nome(
        t.pertenceA
      )}.`;
    } else if (t.subDominio === 'rastro_de_dinheiro') {
      nova.descricao = 'A caderneta de fiado amanheceu quitada, na mesma semana da nova versão. Dívida velha não se paga sozinha.';
    } else if (t.subDominio === 'segunda_morte') {
      nova.descricao =
        'O segundo corpo tem rigor e manchas de poucas horas: morte posterior à primeira perícia, e de mão mais grosseira que a primeira.';
    } else if (t.subDominio === 'fuga_apressada') {
      nova.descricao = `No batente da porta, um retalho de casaco rasgado na saída. O rasgo encaixa, fio a fio, no casaco de ${nome(
        t.pertenceA
      )}.`;
    } else if (t.subDominio === 'limpeza_fresca' && t.tipoVestigio === 'esfrega_fresca') {
      nova.descricao = 'A madeira da cena, esfregada de fresco — ainda úmida ao tato, dias depois do crime e horas depois da primeira perícia.';
    } else if (t.subDominio === 'limpeza_fresca') {
      nova.descricao = 'A esfrega para no meio do gesto: a mancha arrastada até a metade e abandonada ali.';
    }
    // subDominio 'prenuncio': descricao fica INTACTA (texto exato do evento).
    cartas.push(nova);
  }

  return cartas;
}

// ---------------------------------------------------------------------
// Localidades: prosa com os marcadores [[id]] de todas as cartas, mais os
// blocos contingentes da interferência ({ eventoId, quando, paragrafos }).
// ---------------------------------------------------------------------
function montarLocalidades(bruto, cartas) {
  const { mundo, crime, escolha, interferencia } = bruto;
  const pessoas = indicePorId(mundo.elenco);
  const nome = (id) => (pessoas.get(id) ? pessoas.get(id).nome : id);
  const vitima = pessoas.get(crime.vitimaId);
  const predioCena = nomeDoPredio(mundo.cidade, escolha.localId);
  const interior = mundo.interiores[escolha.localId];
  const comodoCrime = interior.comodos.find((c) => c.id === crime.posicaoCorpo.comodo);
  const rotuloComodo = comodoCrime ? comodoCrime.rotulo || comodoCrime.id : escolha.comodoId;

  const temCarta = (id) => cartas.some((c) => c.id === id);
  const eventos = interferencia.eventos;
  const eventoQueDestroi = (cartaId) => eventos.find((e) => e.efeito.cartaDestruida === cartaId) || null;

  // Distribui os marcadores das cartas novas de interferência pela
  // localidade em que vivem, como blocos contingentes do evento.
  const blocosPorLocalidade = {};
  for (const ev of eventos) {
    const novasAqui = {};
    for (const idCarta of ev.efeito.cartasNovas) {
      const carta = cartas.find((c) => c.id === idCarta);
      if (!carta) continue;
      (novasAqui[carta.localidade] ??= []).push(idCarta);
    }
    for (const [loc, ids] of Object.entries(novasAqui)) {
      (blocosPorLocalidade[loc] ??= []).push({
        eventoId: ev.id,
        quando: 'disparado',
        paragrafos: [
          `Desde a última visita, alguma coisa mudou por aqui. ${ids.map((id) => `[[${id}]]`).join(' ')}`,
        ],
      });
    }
  }

  // ---- O corpo ----
  const pFerida = temCarta('gen_reacao_vital')
    ? 'O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].'
    : 'O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]].';
  const corpo = {
    id: 'corpo',
    rotuloMesa: 'O Corpo',
    titulo: `O Corpo — ${predioCena}`,
    subtitulo: `${vitima.nome}, ${vitima.profissao}, ${vitima.idade} anos`,
    acoesEspeciais: ['termometro'],
    gestos: [{ id: 'gesto_voltar_corpo', rotulo: 'Voltar o corpo', cartaId: 'gen_livores' }],
    prosa: [
      `O morto jaz no chão do cômodo a que a vila chama ${rotuloComodo.toLowerCase()}, vestido como andava em casa. O delegado mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.`,
      'Ao primeiro exame do tronco e dos membros, [[gen_rigor]].',
      pFerida,
      'A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar de medir a temperatura do corpo.',
    ],
  };

  // ---- A cena ----
  const mobilias = (interior.mobilia || []).slice(0, 3).map((m) => m.rotulo || m.id);
  const texturaVestigios = [];
  for (const v of crime.vestigios) {
    if (v.removido) continue;
    if (v.classe === 'assoalho_esfregado') texturaVestigios.push('a madeira do assoalho cheira a soda cáustica');
    if (v.classe === 'mobilia_recomposta') texturaVestigios.push('uma peça de mobília repousa sobre o próprio arranhão');
    if (v.classe === 'mobilia_revirada') texturaVestigios.push('há mobília por erguer do chão');
    if (v.classe === 'rastro_da_luta') texturaVestigios.push('o desarrumado corre de um canto a outro');
  }
  const prosaCena = [
    `${predioCena} guarda o dia em que o acharam. ${
      mobilias.length ? `No cômodo, ${mobilias.join(', ')}` : 'O cômodo é o de sempre'
    }${texturaVestigios.length ? `; ${texturaVestigios.join('; ')}.` : '.'}`,
  ];
  const marcadoresCena = [];
  for (const id of ['gen_instrumento', 'gen_pertence', 'gen_sangue_alheio', 'gen_pegadas']) {
    const carta = cartas.find((c) => c.id === id && c.localidade === 'cena');
    if (!carta) continue;
    const ev = eventoQueDestroi(id);
    const frase = {
      gen_instrumento: `Junto do corpo, deixado onde caiu, o achado que a vila inteira comenta: [[gen_instrumento]].`,
      gen_pertence: 'Na mão fechada do morto, por abrir desde ontem: [[gen_pertence]].',
      gen_sangue_alheio: 'A passos do corpo, fora do caminho dele: [[gen_sangue_alheio]].',
      gen_pegadas: 'Do meio do cômodo até a porta: [[gen_pegadas]].',
    }[id];
    if (ev) {
      (blocosPorLocalidade.cena ??= []).push({ eventoId: ev.id, quando: 'nao_disparado', paragrafos: [frase] });
    } else {
      marcadoresCena.push(frase);
    }
  }
  const cena = {
    id: 'cena',
    rotuloMesa: 'A Cena do Crime',
    titulo: `A Cena — ${predioCena}`,
    subtitulo: `Onde ${vitima.nome} foi achado`,
    acoesEspeciais: [],
    prosa: [...prosaCena, ...marcadoresCena],
    blocosContingentes: blocosPorLocalidade.cena || [],
  };

  // ---- A delegacia ----
  const evVisto = eventoQueDestroi('gen_visto_vivo');
  const fraseVisto = 'No registro da ronda, na letra do guarda: [[gen_visto_vivo]].';
  const delegacia = {
    id: 'delegacia',
    rotuloMesa: 'A Delegacia',
    titulo: 'A Delegacia',
    subtitulo: 'Os papéis do caso',
    acoesEspeciais: [],
    prosa: [
      'A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam do morto e da vila, e deixa {g:o senhor|a senhora} ler por si.',
      ...(evVisto ? [] : temCarta('gen_visto_vivo') ? [fraseVisto] : []),
      'Entre os papéis recolhidos por precaução: [[gen_motivo]].',
      // A árvore de diálogo procedural (OS própria): os interrogatórios
      // vivem aqui — a sala do expediente serve de sala de inquérito.
      'Um a um, ao chamado do delegado, os nomes dos papéis vêm sentar-se à sala do expediente; a cadeira do interrogado espera de frente para a janela.',
    ],
    blocosContingentes: [
      ...(evVisto
        ? [
            { eventoId: evVisto.id, quando: 'nao_disparado', paragrafos: [fraseVisto] },
            {
              eventoId: evVisto.id,
              quando: 'disparado',
              paragrafos: ['A folha do avistamento sumiu do registro, e quem a ditou nega agora tê-la ditado.'],
            },
          ]
        : []),
      ...(blocosPorLocalidade.delegacia || []),
    ],
  };

  // ---- A vizinhança ----
  const evRuido = eventoQueDestroi('gen_ruido_ouvido');
  const fraseRuido = 'De uma janela vizinha, quem ouviu conta: [[gen_ruido_ouvido]].';
  const cartaPrenuncio = cartas.find((c) => (c.tagsOcultas || {}).subDominio === 'prenuncio');
  const vizinhanca = {
    id: 'vizinhanca',
    rotuloMesa: 'A Vizinhança',
    titulo: 'A Vizinhança da Cena',
    subtitulo: 'As casas em volta, as janelas que dão para a rua',
    acoesEspeciais: [],
    prosa: [
      'As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua. O que uma noite faz de barulho, a vizinhança guarda de memória.',
      ...(evRuido ? [] : temCarta('gen_ruido_ouvido') ? [fraseRuido] : []),
      ...(cartaPrenuncio ? [`Uma porta se entreabre à passagem {g:do perito|da perita}: [[${cartaPrenuncio.id}]].`] : []),
    ],
    blocosContingentes: [
      ...(evRuido ? [{ eventoId: evRuido.id, quando: 'nao_disparado', paragrafos: [fraseRuido] }] : []),
      ...(blocosPorLocalidade.vizinhanca || []),
    ],
  };

  // ---- Os pertences do réu (só quando a carta de nexo vive lá) ----
  const cartaOficio = cartas.find((c) => c.localidade === 'oficio_do_reu');
  const localidades = [corpo, cena, delegacia, vizinhanca];
  if (cartaOficio) {
    const reu = pessoas.get(crime.assassinoId);
    const predioOficio = nomeDoPredio(
      mundo.cidade,
      reu.pacoteEspacial.trabalho || reu.pacoteEspacial.moradia
    );
    localidades.push({
      id: 'oficio_do_reu',
      rotuloMesa: predioOficio,
      titulo: `${predioOficio} — a diligência`,
      subtitulo: 'Busca autorizada pelo delegado',
      acoesEspeciais: [],
      prosa: [
        `A diligência corre com o delegado à porta e o dono das coisas a um canto. Entre bancada e caixas, o que a busca encontra: [[${cartaOficio.id}]].`,
      ],
      blocosContingentes: blocosPorLocalidade.oficio_do_reu || [],
    });
  }
  return localidades;
}

// ---------------------------------------------------------------------
// Mapa do caso: o prédio da cena é um grupo (corpo + cena, 0h entre si);
// o resto da vila é outro (1h por trecho).
// ---------------------------------------------------------------------
function montarMapa(localidades) {
  const nosMapa = localidades.map((loc) => ({
    id: loc.id,
    rotulo: loc.rotuloMesa,
    grupo: loc.id === 'corpo' || loc.id === 'cena' ? 'cena_predio' : 'vila',
    desbloqueadoInicio: true,
  }));
  const custos = {
    'cena_predio|cena_predio': 0,
    'cena_predio|vila': 1,
    'vila|cena_predio': 1,
    'vila|vila': 1,
  };
  return { nosMapa, custos, leads: [] };
}

// ---------------------------------------------------------------------
// Elenco de suspeitos do caso: o réu + as testemunhas com carta + quem
// partilha rotina com a vítima, até 5 nomes. Ordem estável (replay).
// ---------------------------------------------------------------------
function montarSuspeitos(bruto) {
  const { mundo, crime, interferencia } = bruto;
  const pessoas = indicePorId(mundo.elenco);
  const vitima = pessoas.get(crime.vitimaId);
  const ids = [];
  const incluir = (id) => {
    if (id && id !== crime.vitimaId && !ids.includes(id) && pessoas.has(id)) ids.push(id);
  };
  incluir(crime.assassinoId);
  incluir(interferencia.esqueleto.testemunhaVistoVivoId);
  incluir(interferencia.esqueleto.testemunhaRuidoId);
  for (const p of mundo.elenco) {
    if (ids.length >= 5) break;
    const partilha = ['dia', 'noite', 'madrugada'].some(
      (fx) => p.pacoteEspacial.rotina[fx] === vitima.pacoteEspacial.rotina[fx]
    );
    if (partilha) incluir(p.id);
  }
  for (const p of mundo.elenco) {
    if (ids.length >= 5) break;
    incluir(p.id);
  }
  // Ordem de apresentação estável e cega ao papel: alfabética por nome —
  // o réu não pode ser sempre o primeiro da lista.
  ids.sort((a, b) => (pessoas.get(a).nome < pessoas.get(b).nome ? -1 : 1));
  return ids.map((id) => {
    const p = pessoas.get(id);
    return {
      id: p.id,
      nome: p.nome,
      idade: p.idade,
      relacao: `${p.profissao.charAt(0).toUpperCase()}${p.profissao.slice(1)}; mora em ${nomeDoPredio(
        mundo.cidade,
        p.pacoteEspacial.moradia
      )}`,
      descricao: descricaoDePessoa(p),
    };
  });
}

// ---------------------------------------------------------------------
// Abertura de 6 passos, no shape do caso-escola. O rótulo final do botão
// é contrato do qa-ui e NÃO muda: "Entrar — iniciar a investigação".
// ---------------------------------------------------------------------
function montarAbertura(bruto, sal, suspeitos) {
  const { mundo, crime } = bruto;
  const pessoas = indicePorId(mundo.elenco);
  const vitima = pessoas.get(crime.vitimaId);
  const vila = NOMES_DE_VILA[hashString(`${sal}|vila`) % NOMES_DE_VILA.length];
  const delegado = SOBRENOMES_DELEGADO[hashString(`${sal}|delegado`) % SOBRENOMES_DELEGADO.length];
  const coabitantes = suspeitos
    .filter((s) =>
      ['dia', 'noite', 'madrugada'].some(
        (fx) =>
          pessoas.get(s.id) &&
          pessoas.get(s.id).pacoteEspacial.rotina[fx] === vitima.pacoteEspacial.rotina[fx]
      )
    )
    .map((s) => s.nome);

  const passos = [
    {
      id: 'caulfield',
      titulo: 'Caulfield, 14 de outubro de 1893',
      paragrafos: [
        'A pensão da Sra. Potts amanhece como sempre: o quarto estreito, a meia vela, o jornal de anteontem dobrado sobre a mesa.',
        'Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio, e abre a caderneta na primeira página em branco.',
      ],
      rotuloBotao: 'A vela queima',
    },
    {
      id: 'chamado',
      titulo: 'Batem à porta',
      paragrafos: [
        `A Sra. Potts entra com o castiçal numa mão e um envelope na outra. "Veio a cavalo, de ${vila}. O rapaz disse que o delegado de lá manda dizer que é urgente."`,
      ],
      rotuloBotao: 'Abrir o envelope',
    },
    {
      id: 'carta',
      titulo: 'A carta do Delegado',
      carta: true,
      paragrafos: [
        'O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.',
        `"{detective.title} {detective.surname} — Escrevo-lhe como delegado de ${vila}, e como homem que sabe o tamanho do que não sabe. ${vitima.nome}, ${vitima.profissao} desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários."`,
        `"${delegado}, Delegado."`,
      ],
      rotuloBotao: 'Aceitar o chamado',
    },
    {
      id: 'transformacao',
      titulo: 'A mesa se transforma',
      paragrafos: [
        'A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta.',
        '{detective.title} {detective.surname} desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer.',
      ],
      rotuloBotao: 'Tomar o trem',
    },
    {
      id: 'chegada',
      titulo: vila,
      paragrafos: [
        `A plataforma cheira a carvão e palha molhada. ${vila} estende-se além dos trilhos, e a luz de outubro alonga as sombras rua adentro.`,
        `O delegado ${delegado} espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. "Agradeço a presteza. Venha; explico-me pelo caminho."`,
      ],
      rotuloBotao: 'Ouvir o delegado',
    },
    {
      id: 'briefing',
      titulo: `O relato do delegado ${delegado}`,
      briefing: true,
      paragrafos: [
        `"O essencial é isto: ${vitima.nome}, ${vitima.idade} anos, ${vitima.profissao}. Achado morto em ${nomeDoPredio(
          mundo.cidade,
          bruto.escolha.localId
        )}. Não toquei em nada e não prendi ninguém."`,
        'Detém-se à porta e baixa a voz. "Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}."',
      ],
      rotuloBotao: 'Entrar — iniciar a investigação',
    },
  ];

  const perguntas = [
    {
      id: 'sobre_a_hora',
      pergunta: 'O que se sabe da hora da morte?',
      resposta:
        '"De horas não me arrisco: papel meu não data defunto. O corpo está como o achamos; {g:o senhor|a senhora} dirá por ele."',
    },
    {
      id: 'quem_convive',
      pergunta: 'Quem convivia com a vítima?',
      resposta: coabitantes.length
        ? `"Do dia a dia dele? ${coabitantes.join(', ')} — gente que partilhava teto ou trabalho. Os nomes estão nos meus papéis."`
        : '"Homem de poucas companhias. O que a vila souber, a vila conta melhor que eu."',
    },
    {
      id: 'desafetos',
      pergunta: 'O morto tinha desafetos declarados?',
      resposta:
        '"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si — a vizinhança fala mais comigo fora do expediente que dentro dele."',
    },
  ];

  return { passos, perguntas, opcoesPersonagem: OPCOES_PERSONAGEM_GERADO };
}

// A mesma opção única do caso-escola (perito universal, §12).
const OPCOES_PERSONAGEM_GERADO = [
  {
    id: 'harlan',
    nome: 'Dr. Harlan Blackwell',
    descricao:
      'Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem.',
  },
];

// ---------------------------------------------------------------------
// O MONTADOR: gerarCasoBruto → pacote de caso completo e serializável.
// ---------------------------------------------------------------------
export function montarPacoteGerado(seed, opts = {}) {
  const bruto = gerarCasoBruto(seed, opts);
  const sal = bruto.seed;
  const cartas = realizarCartas(bruto);
  const localidades = montarLocalidades(bruto, cartas);
  const { nosMapa, custos, leads } = montarMapa(localidades);
  const suspeitos = montarSuspeitos(bruto);
  const abertura = montarAbertura(bruto, sal, suspeitos);
  // A árvore de diálogo procedural (OS própria): uma árvore por suspeito,
  // embutida na delegacia, + as cartas de álibi que os beats sustentam.
  // As cartas de álibi entram no FIM do catálogo (ordem estável, replay);
  // o marcador delas vive nas falas da árvore, não na prosa de localidade.
  const { dialogos, cartasAlibi } = derivarDialogos({ bruto, cartas, suspeitos });
  cartas.push(...cartasAlibi);

  // A carta de NEXO define o instrumento que o veredicto cobra: o método
  // com instrumento aponta o próprio; o sem instrumento (esganadura), o
  // pertence arrancado — sem isto, a Vitória Absoluta seria impossível.
  const cartaNexo = cartas.find(
    (c) => (c.tagsOcultas || {}).dominio === 'vestigio' && c.tagsOcultas.pertenceA === bruto.crime.assassinoId
  );
  const verdadeDeOuro = {
    ...bruto.fatiaForense.verdadeDeOuro,
    id: `gerado_${sal}`,
    instrumentoCorreto: cartaNexo ? cartaNexo.tagsOcultas.tipoVestigio : bruto.fatiaForense.verdadeDeOuro.instrumentoCorreto,
    // v1: o gerador não produz encenação de HORA (peça refutável); sem a
    // peça, o pilar de descuidos não pode ser exigido (ver cabeçalho).
    cenaEncenada: false,
    horaForjada: null,
  };

  return {
    id: `gerado_${sal}`,
    verdadeDeOuro,
    suspeitos,
    cartas,
    localidades,
    nosMapa,
    leads,
    custos,
    dialogos,
    confrontos: { estadoInicial: 'presente', consequencias: {} },
    abertura,
    parametrosCena: {
      horasChegada: 11,
      ambiente: AMBIENTE_PADRAO,
      calendario: { ...CALENDARIO_PADRAO },
    },
    ...(bruto.interferencia.eventos.length
      ? {
          interferencias: { eventos: bruto.interferencia.eventos },
          ecosInterferencia: ECOS_INTERFERENCIA_PADRAO,
        }
      : {}),
  };
}

// Hora legível do crime (para o script de geração relatar; nada de runtime).
export function resumoDoCasoGerado(seed, opts = {}) {
  const bruto = gerarCasoBruto(seed, opts);
  const pessoas = indicePorId(bruto.mundo.elenco);
  return {
    seed: bruto.seed,
    vitima: pessoas.get(bruto.crime.vitimaId).nome,
    reu: pessoas.get(bruto.crime.assassinoId).nome,
    metodo: bruto.escolha.metodoId,
    cenario: bruto.escolha.cenario,
    hora: formatHora(bruto.escolha.hora),
    local: bruto.escolha.localId,
    eventos: bruto.interferencia.eventos.map((e) => e.tipo),
  };
}
