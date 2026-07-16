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
//   • NB de prosa: os templates abaixo passaram pela OS de lapidação
//     editorial (docs/os-lapidacao-prosa-gerada.md): pipeline
//     `revisar-prosa` sobre o corpus realizado dos 9 casos, correção
//     sempre AQUI (na fonte) e regeneração no mesmo commit. O lint-prosa
//     mecânico segue fiscalizando este arquivo.
// =====================================================================

import { hashString } from '../logic/hash.js';
import { formatHora, formatHoraComDia, CALENDARIO_PADRAO } from '../logic/tempo.js';
import { AMBIENTE_PADRAO } from '../logic/tempo_morte.js';
import { gerarCasoBruto } from './caso.js';
import { derivarDialogos, formasDoLugar, profissaoExibida } from './dialogos_gerados.js';
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
  return 'na tarde de 13';
}

// Frases de móbil por catálogo (mesmas chaves de MOTIVOS_POTENCIAIS —
// arquetipos.js; guarda de cobertura no qa.mjs). Recebem as PESSOAS (réu e
// vítima), não só os nomes: a concordância de gênero sai da ficha.
const PROSA_MOTIVO = {
  divida_caderneta: (reu, vitima) =>
    `Uma caderneta de dívidas soma o que ${reu.nome} deve a ${vitima.nome}, vencido e cobrado por carta.`,
  seguro_de_enterro: (reu, vitima) =>
    `Uma apólice de enterro em nome de ${vitima.nome} paga a ${reu.nome} quando a morte vier.`,
  heranca: (reu, vitima) =>
    `Papéis de partilha: com a morte de ${vitima.nome}, o que era ${vitima.genero === 'feminino' ? 'dela' : 'dele'} passa às mãos de ${reu.nome}.`,
  dote: (reu, vitima) =>
    `Cartas sobre um dote prometido e não pago atam ${reu.nome} a ${vitima.nome}, com somas e datas.`,
  salario_atrasado: (reu, vitima) =>
    `Consta queixa de paga retida: ${vitima.nome} devia a ${reu.nome} semanas de salário.`,
  escandalo_gravidez: (reu, vitima) =>
    `Corre na vila um falatório em nome de ${reu.nome}; quem o repetia, de porta em porta, era ${vitima.nome}.`,
  character_negado: (reu, vitima) =>
    `${vitima.nome} negou a ${reu.nome} a carta de referência; sem ela, casa nenhuma ${reu.genero === 'feminino' ? 'a' : 'o'} toma a serviço.`,
  despejo: (reu, vitima) =>
    `A ordem de despejo do cottage de ${reu.nome} veio no rasto de queixa que ${vitima.nome} levou ao senhorio.`,
  rivalidade_capela_taverna: (reu, vitima) =>
    `A queixa pública entre ${reu.nome} e ${vitima.nome} — a capela contra a taverna — está lavrada em ata.`,
  recasamento_vigiado: (reu, vitima) =>
    `O recasamento de ${reu.nome} andava na boca da vila, e ${vitima.nome} era quem mais falava dele.`,
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
      'Um vinco uniforme corre horizontal em volta do pescoço, na mesma profundidade de ponta a ponta, sem subir rumo à nuca.',
  },
  esganadura: {
    textoDisplay: 'As Marcas no Pescoço',
    descricao:
      'Manchas roxas do tamanho de polpas de dedo dos dois lados da garganta, e meias-luas de unha impressas na pele.',
  },
  contundente: {
    textoDisplay: 'A Fratura no Crânio',
    descricao:
      'Sob o cabelo, o couro cede ao tato num afundamento de bordas irregulares; o osso acompanha a depressão.',
  },
  veneno_arsenico: {
    textoDisplay: 'O Vômito Seco',
    descricao:
      'Na boca e no queixo, um resto de vômito seco. Levada à chama, a amostra solta cheiro de alho; da ceia, prato nenhum o levava.',
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
// Só o livor FIXO testemunha postura anterior (tanatologia §3): o móvel
// migra com o corpo e não guarda contradição. Sem conectivo adversativo —
// os dois fatos se justapõem e o curto-circuito é do jogador (guia §2).
const NOTA_LIVOR_CONTRADITORIO = ' As manchas assentaram do lado que ora fica para cima.';

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

// Forma de SUJEITO do rótulo de prédio (irmã de formasDoLugar, que só dá
// as contrações): "A Mercearia" fica; "Casa do Médico" ganha o artigo.
function sujeitoDoLugar(rotulo) {
  if (rotulo.startsWith('O ') || rotulo.startsWith('A ')) return rotulo;
  if (/^Casa\b/.test(rotulo)) return `A ${rotulo}`;
  return `O ${rotulo}`;
}

// Rótulo de cômodo em voz de prosa: minúsculas, sem parêntese técnico e
// no singular — a moldura fala de UM cômodo ("Quartos (sobrado)" →
// "quarto do sobrado"; parecer Fase 3, N3).
function comodoEmFala(rotulo) {
  return rotulo
    .toLowerCase()
    .replace(/\s*\((.+)\)$/, ' do $1')
    .replace(/^quartos\b/, 'quarto');
}

// Frases de retrato comportamental por trait/comportamento — nota de
// observação (gesto), nunca veredicto (guia §2). Três variantes por trait,
// de armação variada, para a MESMA tela de suspeitos não repetir retrato
// (parecer Fase 1, A12); a escolha sai de hashString salgado, como toda
// variação do jogo.
const FRASE_TRAIT = {
  medroso: [
    'Fala baixo e mede a porta antes de responder.',
    'Espera a pergunta acabar de todo antes de abrir a boca.',
    'Responde de olhos no chão, uma palavra por vez.',
  ],
  tagarela: [
    'Responde o perguntado e emenda três coisas que ninguém perguntou.',
    'Começa pela resposta e acaba na vida alheia.',
    'Não há pergunta curta que devolva curta.',
  ],
  preciso: [
    'Dá horas e quantias de um fôlego, sem procurá-las.',
    'Cita dia e hora como quem lê de um livro de assentos.',
    'Antes de assinar o termo, corrige nele uma miudeza.',
  ],
  linha_tempo_nao_confiavel: [
    'Conta a noite por canecas, não por horas.',
    'Mede a noite por sinos e canecas, nunca pelo relógio.',
    'Do serão, lembra a ordem das coisas; das horas, não se prende.',
  ],
};
const FRASE_COMPORTAMENTO = {
  revela_facil: 'Recebe de porta aberta e adianta-se às perguntas.',
  revela_sob_custo: 'Cada resposta sai ao preço de duas perguntas.',
  observacao_precisa: 'Descreve o que viu com hora e lugar.',
  observacao_vaga: 'Descreve por alto o que viu; miudeza não lhe ficou.',
};

// `usadas` é o conjunto de frases já gastas NA MESMA tela de suspeitos:
// colisão de hash avança para a variante seguinte (ordem estável — replay
// intacto); pool esgotado (4+ do mesmo trait) cai no comportamento
// (parecer Fase 3, N-2 — retrato repetido lado a lado é defeito visível).
function descricaoDePessoa(p, sal, usadas) {
  for (const t of p.traits) {
    const pool = FRASE_TRAIT[t];
    if (!pool) continue;
    const base = hashString(`${sal}|retrato|${p.id}`) % pool.length;
    for (let i = 0; i < pool.length; i++) {
      const frase = pool[(base + i) % pool.length];
      if (!usadas.has(frase)) {
        usadas.add(frase);
        return frase;
      }
    }
    break;
  }
  for (const c of p.comportamentos) {
    const frase = FRASE_COMPORTAMENTO[c];
    if (frase && !usadas.has(frase)) {
      usadas.add(frase);
      return frase;
    }
  }
  return 'Responde o que se pergunta e volta ao trabalho.';
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

  // Concordância pelo gênero da vítima (o elenco pode dar merceeira,
  // taverneira…): a prosa realizada nunca fixa "o morto" de fábrica.
  const femV = vitima.genero === 'feminino';
  const doMorto = femV ? 'da morta' : 'do morto';

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
            (estado.tagsOcultas.posicaoCompativel === false && estado.tagsOcultas.estadoLivor === 'fixo'
              ? NOTA_LIVOR_CONTRADITORIO
              : '');
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
          'As lesões mostram bordas afastadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.';
        break;
      case 'gen_visto_vivo': {
        const quando = formatHoraComDia(c.tagsOcultas.horaAvistamento);
        const quem = c.origemTestemunha ? nome(c.origemTestemunha) : null;
        nova.carimboPadrao = `Vítima com vida às ${quando}`;
        nova.descricao = quem
          ? `${quem} esteve com ${vitima.nome} às ${quando}, e o declara à ronda. Depois dessa hora, avistamento nenhum consta do registro.`
          : `Do registro da ronda consta ${vitima.nome} com vida às ${quando}; depois dessa hora, linha nenhuma torna a ${femV ? 'nomeá-la' : 'nomeá-lo'}.`;
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
          nova.descricao = `Ficou no chão, ao alcance do corpo. O feitio casa com a lesão ${doMorto}, e a vila dá o dono pelo nome: ${reu.nome}.`;
        } else if (classe === 'instrumento_faltando') {
          nova.textoDisplay = 'O Lugar Vazio';
          nova.carimboPadrao = 'Instrumento que falta no seu lugar';
          nova.descricao = `Entre as coisas de ofício de ${reu.nome}, um vão limpo no meio do pó, do comprimento e do desenho da lesão ${doMorto}.`;
        } else {
          nova.textoDisplay = 'O Instrumento Úmido';
          nova.carimboPadrao = 'Instrumento guardado ainda úmido';
          nova.descricao = `Entre os pertences de ${reu.nome}, a peça guardada lavada — e a junta do cabo ainda úmida. O feitio casa com a lesão ${doMorto}.`;
        }
        break;
      }
      case 'gen_pertence': {
        const houvePertence = crime.vestigios.some((x) => x.classe === 'pertence_do_assassino');
        nova.textoDisplay = houvePertence ? 'O Pertence Arrancado' : 'A Luva Desirmanada';
        nova.carimboPadrao = houvePertence ? 'Botão com fio na mão da vítima' : 'Luva desirmanada junto ao corpo';
        nova.descricao = houvePertence
          ? `Presos entre os dedos ${doMorto}, um botão de casaco com fio e um triângulo de pano. O casaco de ${reu.nome} perdeu o segundo botão.`
          : `Junto ao corpo, uma luva sem par. O par está entre as coisas de ${reu.nome}.`;
        break;
      }
      case 'gen_sangue_alheio':
        nova.textoDisplay = 'O Rastro de Gotas';
        nova.carimboPadrao = 'Sangue afastado do corpo';
        nova.descricao = `Gotas redondas, a passos do corpo, espaçadas em fila até a porta. As feridas ${doMorto} não sangraram nesse caminho.`;
        break;
      case 'gen_pegadas':
        nova.carimboPadrao = 'Meias-solas impressas em sangue';
        nova.descricao =
          'Impressas em sangue, meias-solas do mesmo par, as pontas voltadas para a porta; entre uma e outra, um passo largo.';
        break;
      case 'gen_ruido_ouvido': {
        nova.carimboPadrao = `Barulho ouvido ${rotuloDaFaixa(c.tagsOcultas.faixa)}`;
        // Testemunha nomeada depõe entre aspas; o ramo coletivo relata sem
        // aspas (a vizinhança não cita em uma voz só — parecer A25).
        nova.descricao = c.origemTestemunha
          ? `${nome(c.origemTestemunha)} conta o que a parede deixou passar ${rotuloDaFaixa(
              c.tagsOcultas.faixa
            )}: "Pancada, e móvel no chão, e depois mais nada."`
          : `A vizinhança conta o que a parede deixou passar ${rotuloDaFaixa(
              c.tagsOcultas.faixa
            )}: pancada, móvel no chão, e depois mais nada.`;
        break;
      }
      case 'gen_motivo': {
        const frase = PROSA_MOTIVO[c.tagsOcultas.motivo];
        nova.textoDisplay = 'Os Papéis do Móbil';
        nova.carimboPadrao = `Móbil de ${reu.nome}`;
        nova.descricao = frase
          ? frase(reu, vitima)
          : `Nos papéis ${doMorto}, o nome de ${reu.nome} aparece mais de uma vez, e em mais de uma folha.`;
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
      nova.descricao = `Uma visita depois de escurecido, notada da rua, e uma voz baixa à porta. Mais de um vizinho dá o nome de quem veio: ${nome(
        t.pertenceA
      )}.`;
    } else if (t.subDominio === 'retratacao') {
      nova.descricao = `${nome(t.testemunha)} conta agora outra versão da mesma noite — palavra nova contra o que consta do primeiro registro.`;
    } else if (t.subDominio === 'rastro_de_dinheiro' && t.pertenceA) {
      nova.descricao = `Soberanos novos, contados à vista de todos, em mão que na semana passada comprava fiado. À pergunta de onde vieram, a resposta é sempre o mesmo nome: ${nome(
        t.pertenceA
      )}.`;
    } else if (t.subDominio === 'rastro_de_dinheiro') {
      nova.descricao = 'A caderneta de fiado amanheceu quitada, a soma cheia de uma vez, na mesma semana da nova versão.';
    } else if (t.subDominio === 'segunda_morte') {
      nova.descricao = `O segundo corpo tem rigor e manchas de poucas horas: morte posterior à primeira perícia. As lesões são largas, de bordas rasgadas, sem o desenho das que ${
        femV ? 'a primeira morta' : 'o primeiro morto'
      } levou.`;
    } else if (t.subDominio === 'fuga_apressada') {
      nova.descricao = `No batente da porta, preso na farpa, um retalho de casaco. O rasgo encaixa, fio a fio, no casaco de ${nome(
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

  const femV = vitima.genero === 'feminino';
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
        paragrafos: [`Na volta, o que a primeira visita não viu: ${ids.map((id) => `[[${id}]]`).join(' ')}.`],
      });
    }
  }

  // ---- O corpo ----
  const porQuem = femV ? 'por ela' : 'por ele';
  const pFerida = temCarta('gen_reacao_vital')
    ? `O exame de perto encontra a lesão que respondeu ${porQuem}: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].`
    : `O exame de perto encontra a lesão que respondeu ${porQuem}: [[gen_lesao_fatal]].`;
  const corpo = {
    id: 'corpo',
    rotuloMesa: 'O Corpo',
    titulo: `O Corpo — ${predioCena}`,
    subtitulo: `${vitima.nome}, ${profissaoExibida(vitima.profissao)}, ${vitima.idade} anos`,
    acoesEspeciais: ['termometro'],
    gestos: [{ id: 'gesto_voltar_corpo', rotulo: 'Voltar o corpo', cartaId: 'gen_livores' }],
    prosa: [
      `${femV ? 'A morta jaz' : 'O morto jaz'} no chão do cômodo a que a vila chama ${comodoEmFala(rotuloComodo)}, ${femV ? 'vestida' : 'vestido'} como andava em casa. O delegado pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.`,
      'Ao primeiro exame do tronco e dos membros, [[gen_rigor]].',
      pFerida,
      'A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} houver por bem medir a temperatura do corpo.',
    ],
  };

  // ---- A cena ----
  // A mobília citada é a do CÔMODO do crime (a lista do interior cobre o
  // prédio inteiro — sem o filtro, o quarto ganhava pia da copa).
  const mobilias = (interior.mobilia || [])
    .filter((m) => m.comodo === crime.posicaoCorpo.comodo)
    .slice(0, 3)
    .map((m) => m.rotulo || m.id);
  // Set: vestígios repetidos da mesma classe não empilham a mesma frase.
  const texturaVestigios = new Set();
  for (const v of crime.vestigios) {
    if (v.removido) continue;
    if (v.classe === 'assoalho_esfregado') texturaVestigios.add('a madeira do assoalho cheira a soda cáustica');
    if (v.classe === 'mobilia_recomposta')
      texturaVestigios.add('sob o pé de uma peça de mobília, um arranhão que escapa para fora dela');
    if (v.classe === 'mobilia_revirada') texturaVestigios.add('há mobília por erguer do chão');
    if (v.classe === 'rastro_da_luta') texturaVestigios.add('de um canto a outro, nada guarda o seu lugar');
  }
  const prosaCena = [
    `${sujeitoDoLugar(predioCena)} guarda o dia em que ${femV ? 'a' : 'o'} acharam. ${
      mobilias.length ? `No cômodo, ${mobilias.join(', ')}` : 'O cômodo é o de sempre'
    }${texturaVestigios.size ? `; ${[...texturaVestigios].join('; ')}.` : '.'}`,
  ];
  const marcadoresCena = [];
  for (const id of ['gen_instrumento', 'gen_pertence', 'gen_sangue_alheio', 'gen_pegadas']) {
    const carta = cartas.find((c) => c.id === id && c.localidade === 'cena');
    if (!carta) continue;
    const ev = eventoQueDestroi(id);
    const frase = {
      gen_instrumento: `Junto do corpo, no chão: [[gen_instrumento]].`,
      gen_pertence: `Por abrir desde ontem, a mão fechada ${femV ? 'da morta' : 'do morto'}: [[gen_pertence]].`,
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
    subtitulo: `Onde ${vitima.nome} foi ${femV ? 'achada' : 'achado'}`,
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
      `A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam ${femV ? 'da morta' : 'do morto'} e da vila, e deixa {g:o senhor|a senhora} ler por si.`,
      ...(evVisto ? [] : temCarta('gen_visto_vivo') ? [fraseVisto] : []),
      'Entre os papéis recolhidos por precaução: [[gen_motivo]].',
      // A árvore de diálogo procedural (OS própria): os interrogatórios
      // vivem aqui — a sala do expediente serve de sala de inquérito.
      'Um a um, ao chamado do delegado, os nomes dos papéis vêm à sala do expediente; a cadeira do interrogado espera de frente para a janela.',
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
  // Moldura do ruído conforme o posto de escuta: quem mora (ou passava a
  // faixa do crime) no próprio prédio da cena não ouve "de uma janela
  // vizinha" (parecer Fase 1, fiscal 3). Quem só FREQUENTAVA o prédio não
  // "dormia parede-meia" — o álibi dele diz que foi dormir em casa
  // (parecer Fase 3, N2): a moldura da rotina é neutra de pernoite.
  const cartaRuido = cartas.find((c) => c.id === 'gen_ruido_ouvido');
  const tRuido = cartaRuido && cartaRuido.origemTestemunha ? pessoas.get(cartaRuido.origemTestemunha) : null;
  const moraNoPredio = !!tRuido && tRuido.pacoteEspacial.moradia === escolha.localId;
  const frequentavaOPredio = !!tRuido && tRuido.pacoteEspacial.rotina[escolha.faixa] === escolha.localId;
  const fraseRuido = moraNoPredio
    ? 'De dentro do próprio prédio, quem dormia parede-meia conta: [[gen_ruido_ouvido]].'
    : frequentavaOPredio
      ? 'De dentro do próprio prédio, quem lá estava àquela hora conta: [[gen_ruido_ouvido]].'
      : 'De uma janela vizinha, quem ouviu conta: [[gen_ruido_ouvido]].';
  const cartaPrenuncio = cartas.find((c) => (c.tagsOcultas || {}).subDominio === 'prenuncio');
  const vizinhanca = {
    id: 'vizinhanca',
    rotuloMesa: 'A Vizinhança',
    titulo: 'A Vizinhança da Cena',
    subtitulo: 'As casas em volta, as janelas que dão para a rua',
    acoesEspeciais: [],
    prosa: [
      'As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua; entre uma casa e outra, um braço de distância.',
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
  const frasesUsadas = new Set();
  return ids.map((id) => {
    const p = pessoas.get(id);
    const prof = profissaoExibida(p.profissao);
    return {
      id: p.id,
      nome: p.nome,
      idade: p.idade,
      relacao: `${prof.charAt(0).toUpperCase()}${prof.slice(1)}; mora ${formasDoLugar(
        nomeDoPredio(mundo.cidade, p.pacoteEspacial.moradia)
      ).em}`,
      descricao: descricaoDePessoa(p, bruto.seed, frasesUsadas),
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
  const femV = vitima.genero === 'feminino';
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
        'Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio. A caderneta abre na primeira página em branco.',
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
        `"{detective.title} {detective.surname} — Escrevo-lhe como delegado de ${vila}. Isto passa do meu ofício, e não fingirei o contrário. ${vitima.nome}, ${profissaoExibida(vitima.profissao)} desta vila, foi ${femV ? 'achada morta' : 'achado morto'}. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários."`,
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
        `A plataforma cheira a carvão e palha molhada. ${vila} estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados.`,
        `O delegado ${delegado} espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. "Agradeço a presteza. Venha; explico-me pelo caminho."`,
      ],
      rotuloBotao: 'Ouvir o delegado',
    },
    {
      id: 'briefing',
      titulo: `O relato do delegado ${delegado}`,
      briefing: true,
      paragrafos: [
        `"O essencial é isto: ${vitima.nome}, ${vitima.idade} anos, ${profissaoExibida(vitima.profissao)}. ${femV ? 'Achada morta' : 'Achado morto'} ${formasDoLugar(nomeDoPredio(mundo.cidade, bruto.escolha.localId)).em}. Não toquei em nada e não prendi ninguém."`,
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
        ? `"Do dia a dia ${femV ? 'dela' : 'dele'}? ${coabitantes.join(', ')} — gente que partilhava teto, trabalho ou as mesmas noites. Os nomes estão nos meus papéis."`
        : `"${femV ? 'Mulher' : 'Homem'} de poucas companhias. O que houver, a vila sabe antes de mim."`,
    },
    {
      id: 'desafetos',
      pergunta: femV ? 'A morta tinha desafetos declarados?' : 'O morto tinha desafetos declarados?',
      resposta: `"Queixa lavrada contra ${femV ? 'ela' : 'ele'} não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si."`,
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
