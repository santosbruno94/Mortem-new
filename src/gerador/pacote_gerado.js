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
//   • verdadeDeOuro (v2, correção do playtest de 16/jul): cenaEncenada é
//     CONDICIONAL no pacote — true somente quando o montador produz a
//     peça de hora forjada (cartaHoraForjada: premeditado + INT alta do
//     assassino), refutável pelos indicadores do corpo; sem a peça,
//     segue false (exigir descuidos sem peça tornaria a Vitória Absoluta
//     inalcançável). perifericos é POPULADO (derivarPerifericos): cada
//     não-acusado tem veredicto esperado, e os segredos ganham rastro
//     revelador — os dois pilares que o v1 deixava inertes (bugs B7/B8
//     do relatório de playtest). instrumentoCorreto passa a nomear o
//     tipoVestigio da carta de nexo (métodos sem instrumento —
//     esganadura — apontam o pertence arrancado).
//   • NB de prosa: os templates abaixo passaram pela OS de lapidação
//     editorial (docs/os-lapidacao-prosa-gerada.md): pipeline
//     `revisar-prosa` sobre o corpus realizado dos 9 casos, correção
//     sempre AQUI (na fonte) e regeneração no mesmo commit. O lint-prosa
//     mecânico segue fiscalizando este arquivo.
// =====================================================================

import { hashString } from '../logic/hash.js';
import { hashDecisao } from './hash_gerador.js';
import { formatHora, formatHoraComDia, CALENDARIO_PADRAO } from '../logic/tempo.js';
import { AMBIENTE_PADRAO } from '../logic/tempo_morte.js';
import { gerarCasoBruto } from './caso.js';
import { SEDE_LEGIVEL } from './vestigios.js';
import { METODOS } from './metodos.js';
import { HORAS_CHEGADA_INTERNO } from './ponte_caso.js';
import { derivarDialogos, formasDoLugar, profissaoExibida, FAIXA_CURTA, variante } from './dialogos_gerados.js';
import { ECOS_INTERFERENCIA_PADRAO } from '../data/ecos_interferencia.js';
import { obterPredio, saoAdjacentes } from './cidade.js';
import { VOCABULARIO_DA_CLASSE } from './espaco.js';

// ---------------------------------------------------------------------
// A RÉPLICA do caso-escola (modo 2): seed fixa + variáveis dirigidas que
// aproximam o caso gerado d'"A Hora Emprestada". A busca de seed (240
// candidatas, placar de aproximação em scripts/gerar-casos.mjs) escolheu
// a_hora_emprestada_replica_96: lojista morto na própria loja às 21h de
// 13/out, arma branca premeditada, a criada da casa com a referência
// negada como móbil (o empregado contra o patrão), INT4/WIS4 (o quadrante
// de Silas) e corpo movido. O catálogo v2 alcança a encenação de hora
// (INT4 premeditado produz a peça) e os periféricos com segredo; segue
// fora do alcance apenas o móbil "silenciamento de fraude".
// ---------------------------------------------------------------------
// B3.4 da OS autobattler v2: o resolvedor novo quebrou o replay (fim
// declarado); nova seleção sobre 240 candidatas pelo placar de
// identidade de fatos (scripts/buscar-replica.mjs, D5/GB7) escolheu
// _105: corpo movido, quadrante INT4+/WIS4+ (Silas), palco interno,
// trava de fuga íntegra.
export const SEED_REPLICA = 'a_hora_emprestada_replica_105';
export const DIRIGIDO_REPLICA = {
  cenario: 'premeditado',
  faixa: 'noite',
  metodoId: 'laminada',
  vitimaArquetipo: 'merceeiro',
  assassinoMotivo: 'character_negado',
  // OS confronto estendido §4.8: a réplica cala a fuga da vítima para o
  // RegistroDoCrime permanecer idêntico em fatos ao roteiro canônico (a
  // laminada não prende — sem esta trava, a vítima poderia fugir).
  fugaVitima: 'suprimida',
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
  // P15 (playtest 19/07 r2): genérico pode, ininteligível não — a frase
  // diz DO QUE trata o falatório, sem detalhe fino.
  escandalo_gravidez: (reu, vitima) =>
    `Corre na vila um falatório sobre ${reu.nome}: criança por vir, e o nome ${reu.genero === 'feminino' ? 'dela' : 'dele'} atado ao caso. Quem o repetia, de porta em porta, era ${vitima.nome}.`,
  character_negado: (reu, vitima) =>
    `${vitima.nome} negou a ${reu.nome} a carta de referência; sem ela, casa nenhuma ${reu.genero === 'feminino' ? 'a' : 'o'} toma a serviço.`,
  despejo: (reu, vitima) =>
    `A ordem de despejo do cottage de ${reu.nome} veio no rasto de queixa que ${vitima.nome} levou ao senhorio.`,
  rivalidade_capela_taverna: (reu, vitima) =>
    `A queixa pública entre ${reu.nome} e ${vitima.nome}, a capela contra a taverna, está lavrada em ata.`,
  recasamento_vigiado: (reu, vitima) =>
    `O recasamento de ${reu.nome} andava na boca da vila, e ${vitima.nome} era quem mais falava dele.`,
  // F4 da OS priors compostos: os quatro motivos novos ganharam frase
  // (P18 do playtest 19/07 r2 — sem frase, a carta caía no fallback mudo).
  hipoteca_ou_arrendo: (reu, vitima) =>
    `Os papéis do arrendo somam o que ${reu.nome} deve pela terra, prazo vencido; quem cobrava, com o despejo à mão, era ${vitima.nome}.`,
  propriedade_da_esposa: (reu, vitima) =>
    `Os papéis do banco põem a soma em nome de ${vitima.nome}, e só dela por lei; a ${reu.nome} a lei não dá alcance enquanto ${vitima.genero === 'feminino' ? 'ela' : 'ele'} viver.`,
  divida_de_jogo: (reu, vitima) =>
    `Vales de aposta guardados por ${vitima.nome}, com a soma e a rubrica de ${reu.nome}. Dívida de jogo não vai a juízo: cobra-se, ou se apaga.`,
  caridade_negada: (reu, vitima) =>
    `Consta o pedido de socorro de ${reu.nome}, e consta a recusa; a palavra que abria ou fechava essa porta era a de ${vitima.nome}, e atrás da recusa espera a workhouse.`,
};

// ---------------------------------------------------------------------
// ENCENAÇÃO DE HORA (v2 — bug B8 do playtest; Lote 3 — fraude de tempo
// pelo corpo): o assassino de INT alta, no premeditado, deixa uma peça de
// cronologia aparente que o corpo desmente. Espelha o pilar de descuidos
// do caso-escola: a Verdade de Ouro só exige a encenação exposta quando a
// peça existe. Quatro variantes, sorteadas por hash — mesmas tags, mesma
// refutação (o jogador liga os fatos temporais duráveis do corpo à peça):
//   • duas de RELÓGIO (o mostrador parado numa hora da manhã) — o vetor
//     clássico do caso-escola;
//   • duas de CORPO (Lote 3, dossiê "manipulação do resfriamento"): o
//     agressor mexe na temperatura, e os sinais tanatológicos não
//     conspiram. Corpo AQUECIDO junto à lareira parece morto há pouco
//     (hora tardia da manhã); corpo RESFRIADO parece morto há muito (hora
//     bem cedo). O rigor e o livor, que o calor e o frio não desfazem,
//     continuam dizendo a verdade e refutam a hora aparente.
// As horas forjadas caem, por construção, FORA da janela que os
// indicadores do corpo sustentam à chegada (11h00): a da manhã (09h15–
// 10h45) acima do teto (a morte gerada é sempre anterior às 3h, e o rigor
// mais brando fecha a janela em 9); a bem cedo (13h–14h30 do dia anterior)
// abaixo do piso (o visto-com-vida e o algor honesto nunca descem tanto).
// ---------------------------------------------------------------------
function cartaHoraForjada(bruto) {
  const { mundo, escolha, crime } = bruto;
  // E2: a encenação de hora é do palco INTERNO na v1 — as quatro variantes
  // pressupõem lareira, janela e relógio doméstico. Peça de encenação para
  // logradouro fica registrada para OS futura (dossiê E2).
  if (escolha.palco?.externo) return null;
  const assassino = mundo.elenco.find((p) => p.id === crime.assassinoId);
  if (escolha.cenario !== 'premeditado' || assassino.atributos.INT < 4) return null;
  const sal = `${bruto.seed}|encenacao`;
  const vitima = mundo.elenco.find((p) => p.id === crime.vitimaId);
  const femV = vitima.genero === 'feminino';
  const doMorto = femV ? 'a morta' : 'o morto';
  const variante = hashString(`${sal}|peca`) % 4;
  // Aquecido/relógio → hora tardia da manhã (acima do teto); resfriado →
  // hora do início da tarde da véspera (abaixo do piso).
  const resfriado = variante === 3;
  const horaForjada = resfriado
    ? -11 + (hashString(`${sal}|hora`) % 7) * 0.25
    : 9.25 + (hashString(`${sal}|hora`) % 7) * 0.25;
  const rotuloHora = resfriado ? formatHoraComDia(horaForjada) : formatHora(horaForjada);
  const base = {
    id: 'gen_hora_forjada',
    localidade: 'cena',
    suporteFisico: 'cena',
    // E1: a peça encenada arma-se no cômodo onde o corpo ficou (as
    // variantes de corpo o descrevem ali; o mostrador é vistoso à vista
    // dele). Metadado gerador-facing — o motor jamais lê.
    comodo: crime.posicaoCorpo.comodo,
    celula: { ...crime.posicaoCorpo.celula },
    mobilia: null,
    tagsOcultas: {
      dominio: 'ambiental',
      subDominio: 'cronologia_aparente',
      horaAparente: horaForjada,
      encenado: true,
      isca: true,
    },
  };
  const variantes = [
    {
      ...base,
      textoDisplay: 'O Relógio Parado',
      carimboPadrao: `Relógio de parede parado às ${rotuloHora}`,
      descricao: `O vidro cedeu em raios a partir de um canto, e a caixa guarda os cacos por dentro. Os ponteiros descansam em ${rotuloHora}; a corda, provada pela chave, ainda tem volta.`,
    },
    {
      ...base,
      textoDisplay: 'O Relógio Tombado',
      carimboPadrao: `Relógio de mesa parado às ${rotuloHora}`,
      descricao: `Tombado de bruços no assoalho, a caixa aberta de um lado. Erguido, o vidro estrelado segue inteiro no aro, e os ponteiros marcam ${rotuloHora} debaixo da rachadura.`,
    },
    {
      ...base,
      textoDisplay: 'O Corpo Junto à Lareira',
      carimboPadrao: `Corpo aquecido; leitura de morte às ${rotuloHora}`,
      descricao: `O corpo jaz rente à lareira, e a grelha ainda guarda brasa morna. Ao termômetro, ${doMorto} está bem mais quente do que a sala; por essa temperatura, a morte teria sido por volta das ${rotuloHora}.`,
    },
    {
      ...base,
      textoDisplay: 'O Corpo na Corrente de Ar',
      carimboPadrao: `Corpo resfriado; leitura de morte às ${rotuloHora}`,
      descricao: `O corpo jaz junto à janela aberta, na corrente da noite, frio como a pedra da soleira. Por essa frieza, a morte teria recuado para as ${rotuloHora}.`,
    },
  ];
  // O instrumento da encenação distingue a fala do desfecho (monologo.js /
  // epilogo.js): o mostrador é 'relogio'; a temperatura do corpo, 'corpo'.
  const instrumento = variante <= 1 ? 'relogio' : 'corpo';
  return { carta: variantes[variante], horaForjada, instrumento };
}

// ---------------------------------------------------------------------
// PERIFÉRICOS (v2 — bug B7 do playtest): o pilar de julgar os
// não-acusados, ativado na geração. Cada suspeito que não é o réu
// recebe um veredicto esperado na Verdade de Ouro:
//   • inocente_alibi — o paradeiro declarado é verdadeiro (nasce da
//     rotina) e ganha uma carta de CORROBORAÇÃO na vizinhança
//     (informativa; sem hora observada, não refuta nada);
//   • inocente_segredo — a armadilha do jogo: o suspeito esteve à porta
//     da vítima por razão inocente, MENTE o paradeiro por vergonha e
//     deixa na cena um rastro (pertenceA + revelaSegredo). Quebrar-lhe
//     o álibi com o rastro revela o segredo — mentiu, mas por outra
//     razão que a do crime.
// Elegível a segredo: quem não é testemunha de carta (a pessoa não pode
// jurar duas versões da mesma noite) nem tem a cena por rotina na faixa
// (o paradeiro real já seria a cena). Com dois segredos, os tipos nunca
// se repetem. O PRIMEIRO segredo ganha também um MÓBIL-ISCA na
// delegacia (o motivoPotencial da Fase 1 do próprio suspeito): papel
// mais mentira é a armadilha completa do "mentiu, logo matou".
// Determinístico por hashString salgado; ordem estável = a ordem
// alfabética dos suspeitos do pacote (replay byte a byte).
// ---------------------------------------------------------------------
const SEGREDOS_GERADOS = ['pedido_recusado', 'acerto_reservado'];

const PROSA_SEGREDO = {
  pedido_recusado: {
    textoDisplay: 'O Bilhete Amassado',
    tipoVestigio: 'bilhete_de_suplica',
    carimbo: (nome) => `Bilhete na letra de ${nome}`,
    // P14/P15: o bilhete diz do que trata o pedido (socorro em dinheiro) —
    // coerente com a admissão no confronto ("saí com a recusa e a vergonha").
    descricao: (nome) =>
      `Papel amassado em bola e desfeito depois, as quebras ainda marcadas. Meia dúzia de linhas na letra de ${nome}: um pedido de socorro em dinheiro, a palavra "desta vez" sublinhada, e nenhuma resposta no verso.`,
  },
  acerto_reservado: {
    textoDisplay: 'A Nota por Assinar',
    tipoVestigio: 'nota_por_assinar',
    carimbo: (nome) => `Nota de trato com o nome de ${nome}`,
    // P13/P15: a nota diz do que trata (acerto de dinheiro em reserva) —
    // coerente com a admissão no confronto ("trato para se fechar calado").
    descricao: (nome) =>
      `Meia folha pautada com soma, prazo e o nome de ${nome} por extenso: um acerto de dinheiro para correr em reserva. Falta a segunda assinatura, e o vinco da dobra ainda não assentou.`,
  },
};

// A janela citada na corroboração espelha JANELA_DECLARADA do derivador
// de diálogos — as mesmas horas do álibi declarado, dita em palavras.
const FRASE_JANELA_CORROBORACAO = {
  noite: 'das oito ao clarear',
  madrugada: 'das oito ao clarear',
  dia: 'do meio-dia às seis',
};

function derivarPerifericos({ bruto, suspeitos, cartas, ausenteId = null }) {
  const { mundo, crime, escolha } = bruto;
  const pessoas = indicePorId(mundo.elenco);
  const vitima = pessoas.get(crime.vitimaId);
  const sal = `${bruto.seed}|perifericos`;
  // E1: o rastro da visita inocente fica junto da entrada — o cômodo da
  // frente do grid (quem esteve à porta não anda a casa toda).
  const comodoVisita = comodoDaFrente(mundo.interiores[escolha.localId]);
  const testemunhas = new Set(cartas.map((c) => c.origemTestemunha).filter(Boolean));

  const candidatos = suspeitos.filter((s) => s.id !== crime.assassinoId);
  const elegiveis = candidatos.filter((s) => {
    const p = pessoas.get(s.id);
    // E3 §4.5: o AUSENTE não guarda segredo — o paradeiro dele é a town,
    // e a mentira de vergonha declararia a moradia (contradição).
    return p && s.id !== ausenteId && !testemunhas.has(s.id) && p.pacoteEspacial.rotina[escolha.faixa] !== escolha.localId;
  });
  const nSegredos =
    elegiveis.length === 0 ? 0 : 1 + (hashString(`${sal}|n`) % Math.min(2, elegiveis.length));
  const inicio = elegiveis.length ? hashString(`${sal}|quem`) % elegiveis.length : 0;
  const comSegredo = [];
  // OS da camada psíquica (§8.3.4): o falso-destoante, quando elegível,
  // tem preferência ao PRIMEIRO segredo — é o inocente_segredo + móbil-isca
  // que faz o destoante enganar de fato ("mentiu, logo matou").
  const destoanteId = bruto.psique?.log?.falsoDestoanteId;
  if (nSegredos > 0 && destoanteId && elegiveis.some((s) => s.id === destoanteId)) {
    comSegredo.push(destoanteId);
  }
  for (let i = 0; comSegredo.length < nSegredos && i < elegiveis.length * 2; i += 1) {
    const candidato = elegiveis[(inicio + i) % elegiveis.length].id;
    if (!comSegredo.includes(candidato)) comSegredo.push(candidato);
  }
  const tipoBase = hashString(`${sal}|tipo`) % SEGREDOS_GERADOS.length;

  const perifericos = {};
  const cartasNovas = [];
  const segredos = {};
  for (const s of candidatos) {
    const pessoa = pessoas.get(s.id);
    if (comSegredo.includes(s.id)) {
      // Os tipos alternam a partir do sorteio: dois segredos, dois papéis.
      const tipo = SEGREDOS_GERADOS[(tipoBase + comSegredo.indexOf(s.id)) % SEGREDOS_GERADOS.length];
      perifericos[s.id] = { veredictoEsperado: 'inocente_segredo', segredo: tipo };
      segredos[s.id] = tipo;
      const p = PROSA_SEGREDO[tipo];
      cartasNovas.push({
        id: `gen_segredo_${s.id}`,
        localidade: 'cena',
        suporteFisico: 'cena',
        comodo: comodoVisita,
        celula: null,
        mobilia: null,
        textoDisplay: p.textoDisplay,
        carimboPadrao: p.carimbo(pessoa.nome),
        descricao: p.descricao(pessoa.nome),
        tagsOcultas: {
          dominio: 'vestigio',
          subDominio: 'rastro_de_visita',
          tipoVestigio: p.tipoVestigio,
          pertenceA: s.id,
          revelaSegredo: tipo,
        },
      });
    } else if (s.id === ausenteId) {
      // E3 §4.5 — a AUSÊNCIA declarada: o paradeiro é a vila-mercado,
      // INVERIFICÁVEL pelo grafo da vila (nenhuma corroboração grátis na
      // vizinhança); a confirmação verdadeira mora no livro de hóspedes a
      // hora e meia de estrada (derivarComarcaDoCaso) — a assimetria é o
      // dilema: confiar, viajar ou telegrafar.
      perifericos[s.id] = { veredictoEsperado: 'inocente_alibi', segredo: null };
    } else {
      perifericos[s.id] = { veredictoEsperado: 'inocente_alibi', segredo: null };
      const lugarId = pessoa.pacoteEspacial.rotina[escolha.faixa];
      const forma = formasDoLugar(nomeDoPredio(mundo.cidade, lugarId));
      const confirmante = mundo.elenco.find(
        (o) =>
          o.id !== s.id &&
          o.id !== crime.vitimaId &&
          o.id !== crime.assassinoId &&
          o.id !== ausenteId &&
          o.pacoteEspacial.rotina[escolha.faixa] === lugarId
      );
      const fraseJanela = FRASE_JANELA_CORROBORACAO[escolha.faixa];
      cartasNovas.push({
        id: `gen_corrobora_${s.id}`,
        localidade: 'vizinhanca',
        suporteFisico: 'testemunho',
        textoDisplay: `Quem Responde por ${pessoa.nome}`,
        carimboPadrao: `Paradeiro de ${pessoa.nome}, confirmado`,
        descricao: confirmante
          ? `${confirmante.nome} esteve ${forma.em} ${FAIXA_CURTA[escolha.faixa]} e dá ${pessoa.nome} por presente, ${fraseJanela}. Mais de uma boca diz o mesmo.`
          : `A rua dá ${pessoa.nome} ${forma.em} ${FAIXA_CURTA[escolha.faixa]}, ${fraseJanela}, por mais de uma janela.`,
        tagsOcultas: { dominio: 'comportamental', subDominio: 'corroboracao', ligadoA: s.id },
      });
    }
  }

  // O móbil-isca do primeiro segredo: o papel que faz o mentiroso parecer
  // culpado. Mesmo shape do móbil verdadeiro — a simetria é a armadilha.
  if (comSegredo.length > 0) {
    const alvo = pessoas.get(comSegredo[0]);
    const frase = PROSA_MOTIVO[alvo.motivoPotencial];
    cartasNovas.push({
      id: `gen_movel_${alvo.id}`,
      localidade: 'delegacia',
      suporteFisico: 'registro',
      textoDisplay: `Papéis de ${alvo.nome}`,
      carimboPadrao: `Móbil de ${alvo.nome}`,
      descricao: frase
        ? frase(alvo, vitima)
        : `Do arquivo: queixa registrada entre ${alvo.nome} e ${vitima.nome}, retirada dias depois sem explicação; o papel ficou.`,
      tagsOcultas: {
        dominio: 'comportamental',
        subDominio: 'motivo',
        motivo: alvo.motivoPotencial,
        ligadoA: alvo.id,
      },
    });
  }

  // P9 Via B — contra-hipótese jogável: identificar o ACESSOR, o inocente
  // com acesso plausível ao instrumento do crime. O acessor fica entre os
  // inocente_alibi (nunca segredo — já tem mecânica própria) e deve
  // frequentar o prédio onde o instrumento vivia (o ofício/moradia do réu).
  // Se existe, o veredicto cobra que o jogador tenha o álibi dele na mesa
  // para cravar "inocente" (o gesto a mais que fecha a contra-hipótese).
  const metodo = METODOS[crime.metodoId];
  let acessorId = null;
  if (metodo?.instrumento) {
    const assassino = pessoas.get(crime.assassinoId);
    const predioInstrumento = assassino.pacoteEspacial.trabalho || assassino.pacoteEspacial.moradia;
    const candidatosAcesso = candidatos.filter((s) => {
      if (comSegredo.includes(s.id)) return false;
      if (s.id === ausenteId) return false;
      const pe = pessoas.get(s.id)?.pacoteEspacial;
      if (!pe) return false;
      return (
        pe.moradia === predioInstrumento ||
        pe.trabalho === predioInstrumento ||
        pe.frequentados.includes(predioInstrumento)
      );
    });
    if (candidatosAcesso.length > 0) {
      const escolhido = candidatosAcesso[hashString(`${sal}|acessor`) % candidatosAcesso.length];
      acessorId = escolhido.id;
      perifericos[acessorId] = { ...perifericos[acessorId], veredictoEsperado: 'inocente_acesso' };
    }
  }

  return { perifericos, cartasNovas, segredos, acessorId };
}

// ---------------------------------------------------------------------
// E3: A COMARCA NO CASO — moeda de função (sal `seed|caso|comarca-funcao`,
// via decorrelacionada, calibrada com a fração medida de móbeis com
// papel, ~43%): ~20% dos casos têm o registro CORROBORATIVO da vítima
// (o penhor de dias antes — enriquece a cronologia, não aponta ninguém);
// ~26% o rastro durável do MÓBIL — e só quando o móbil deixa papel
// (cobrança ou partilha; parecer E3, B1); o resto fica sem referência
// (o satélite é fachada e nó nenhum nasce). Entre os casos COM nó, a
// função corroborativa fica em ~44% — o Z=40% do autor (GE9).
// O nó nasce OCULTO e entra por lead (o recibo nos pertences; a citação
// nos papéis) — norma do atalho opcional: o caso SEMPRE fecha sem viajar
// (GE7: só registro durável mora a distância; GE8: o guardião do livro é
// prosa de localidade, nunca suspeito).
// ---------------------------------------------------------------------
function derivarComarcaDoCaso({ bruto, ausenteId = null }) {
  const sat = bruto.mundo.comarca.satelites.find((s) => s.id === 'vila_mercado');
  if (!sat) return null;
  const moeda = hashDecisao(`${bruto.seed}|caso|comarca-funcao`) % 10;
  const pessoas = indicePorId(bruto.mundo.elenco);
  const vitima = pessoas.get(bruto.crime.vitimaId);
  const reu = pessoas.get(bruto.crime.assassinoId);
  const femV = vitima.genero === 'feminino';
  const aoMorto = femV ? 'à morta' : 'ao morto';
  const daMorta = femV ? 'da morta' : 'do morto';
  // Fair play (parecer E3, B1): o registro do procurador só existe para
  // móbil COM PAPEL — cobrança (dívida, dote, salário) ou partilha
  // (herança). Falatório e referência negada não deixam soma em livro.
  const MOTIVOS_COBRANCA = ['divida_caderneta', 'dote', 'salario_atrasado'];
  const temCobranca = MOTIVOS_COBRANCA.includes(reu.motivoPotencial);
  const temPartilha = reu.motivoPotencial === 'heranca';
  // Pousada (vítima-forasteiro): a comarca vira a ORIGEM do morto — "quem
  // era este homem" (§4.5): a guia de carga nos pertences leva ao pátio
  // da estalagem de onde a rota partia. Sobrepõe a moeda de função.
  const ramoOrigem = !!bruto.escolha.palco?.pousada;
  // moeda 0 = penhor da vítima; 1 = AUSÊNCIA de um periférico (§4.5;
  // recai no penhor quando ninguém é elegível); 2–7 = móbil com papel.
  const ramoAusencia = !ramoOrigem && moeda === 1 && !!ausenteId;
  const corroborativa = !ramoOrigem && moeda <= 1 && !ramoAusencia;
  const ramoMobil = !ramoOrigem && moeda >= 2 && moeda <= 7 && (temCobranca || temPartilha);
  if (!ramoOrigem && !corroborativa && !ramoAusencia && !ramoMobil) return null;
  const localidadeId = `comarca_${sat.id}`;
  const cartasNovas = [];
  let lead;
  let localidade;
  if (ramoOrigem) {
    cartasNovas.push({
      id: 'gen_papeis_forasteiro',
      localidade: 'corpo',
      suporteFisico: 'corpo',
      textoDisplay: 'Os Papéis do Morto',
      carimboPadrao: `Guia de carga de ${sat.rotulo}`,
      descricao: `A guia de carga, cabeçalho impresso: o nome do carroceiro por extenso e a partida do pátio da estalagem de ${sat.rotulo}; abaixo, à mão, os volumes do dia e as aldeias de entrega.`,
      tagsOcultas: { dominio: 'comportamental', subDominio: 'corroboracao', ligadoA: bruto.crime.vitimaId },
    });
    cartasNovas.push({
      id: 'gen_registro_comarca',
      localidade: localidadeId,
      suporteFisico: 'registro',
      textoDisplay: 'A Lista dos Carroceiros',
      carimboPadrao: `Diretório do condado, em ${sat.rotulo}`,
      descricao: `No diretório do condado, atrás do balcão, a lista dos que partem do pátio: a rota no nome do morto, com os dias da semana; o estalajadeiro dá a aldeia dele e os anos que o homem fazia a estrada.`,
      tagsOcultas: { dominio: 'comportamental', subDominio: 'corroboracao', ligadoA: bruto.crime.vitimaId },
    });
    lead = {
      cartaId: 'gen_papeis_forasteiro',
      revelaNo: localidadeId,
      nota: 'A guia de carga dá a estalagem de partida.',
    };
    localidade = {
      id: localidadeId,
      rotuloMesa: sat.rotulo,
      titulo: `O Pátio da Estalagem — ${sat.rotulo}`,
      subtitulo: `${sat.rotulo}, hora e meia de estrada`,
      acoesEspeciais: [],
      prosa: [
        'Hora e meia de estrada. No pátio da estalagem, volumes rotulados esperam junto ao portão; atrás do balcão, o estalajadeiro abre o diretório do condado na página pedida: [[gen_registro_comarca]].',
      ],
    };
  } else if (ramoAusencia) {
    const ausente = pessoas.get(ausenteId);
    cartasNovas.push({
      id: 'gen_registro_comarca',
      localidade: localidadeId,
      suporteFisico: 'registro',
      textoDisplay: 'O Livro de Hóspedes',
      carimboPadrao: `Livro da estalagem de ${sat.rotulo}`,
      descricao: `O assento de punho próprio: o nome de ${ausente.nome}, com a data; no borrador da casa, cama e ceia lançadas em conta.`,
      tagsOcultas: { dominio: 'comportamental', subDominio: 'corroboracao', ligadoA: ausenteId },
    });
    lead = {
      cartaId: `gen_alibi_${ausenteId}`,
      revelaNo: localidadeId,
      nota: 'O paradeiro declarado remete ao livro de hóspedes da estalagem.',
    };
    localidade = {
      id: localidadeId,
      rotuloMesa: sat.rotulo,
      titulo: `A Estalagem de ${sat.rotulo}`,
      subtitulo: `${sat.rotulo}, hora e meia de estrada`,
      acoesEspeciais: [],
      prosa: [
        'Hora e meia de estrada. Na estalagem, o estalajadeiro traz o livro de hóspedes ao balcão, molha o polegar e o abre pela noite pedida: [[gen_registro_comarca]].',
      ],
    };
  } else if (corroborativa) {
    cartasNovas.push({
      id: 'gen_recibo_comarca',
      localidade: 'corpo',
      suporteFisico: 'corpo',
      textoDisplay: 'O Bilhete de Penhor',
      carimboPadrao: `Bilhete de penhor de ${sat.rotulo}`,
      descricao: `Bilhete impresso da casa de penhores de ${sat.rotulo}: a data da semana passada, a soma por resgatar, o número de ordem.`,
      tagsOcultas: { dominio: 'comportamental', subDominio: 'corroboracao', ligadoA: bruto.crime.vitimaId },
    });
    cartasNovas.push({
      id: 'gen_registro_comarca',
      localidade: localidadeId,
      suporteFisico: 'registro',
      textoDisplay: 'O Assento do Penhorista',
      carimboPadrao: `Livro de penhores de ${sat.rotulo}`,
      descricao: `No livro, o assento: o número, o dia, a soma e o nome ${daMorta} por extenso.`,
      tagsOcultas: { dominio: 'comportamental', subDominio: 'corroboracao', ligadoA: bruto.crime.vitimaId },
    });
    lead = {
      cartaId: 'gen_recibo_comarca',
      revelaNo: localidadeId,
      nota: 'O bilhete dá o endereço da casa de penhores.',
    };
    localidade = {
      id: localidadeId,
      rotuloMesa: sat.rotulo,
      titulo: `Casa de Penhores de ${sat.rotulo}`,
      subtitulo: `${sat.rotulo}, hora e meia de estrada`,
      acoesEspeciais: [],
      prosa: [
        'Hora e meia de estrada. Na casa de penhores, o balcão dividido em boxes de madeira; o penhorista abre o livro pela data pedida e o vira para {g:o senhor|a senhora}: [[gen_registro_comarca]].',
      ],
    };
  } else {
    cartasNovas.push({
      id: 'gen_citacao_comarca',
      localidade: 'delegacia',
      suporteFisico: 'registro',
      textoDisplay: 'A Nota do Procurador',
      carimboPadrao: `Nota do procurador de ${sat.rotulo}`,
      descricao: temCobranca
        ? `Meia folha de ofício: a cobrança correu pelas mãos do procurador, em ${sat.rotulo}, com data e número de folha.`
        : `Meia folha de ofício: a partilha foi lavrada no gabinete do procurador, em ${sat.rotulo}, com data e número de livro.`,
      tagsOcultas: { dominio: 'ambiental', subDominio: 'referencia_comarca' },
    });
    cartasNovas.push({
      id: 'gen_registro_comarca',
      localidade: localidadeId,
      suporteFisico: 'registro',
      textoDisplay: temCobranca ? 'A Carta de Cobrança Copiada' : 'A Partilha Lavrada',
      carimboPadrao: `Livro do procurador de ${sat.rotulo}`,
      descricao: temCobranca
        ? `No copiador do procurador que servia ${aoMorto}, a carta de cobrança, com data e soma; nela, o nome de ${reu.nome}.`
        : `No livro do procurador que servia ${aoMorto}, a partilha: com data, os bens ${daMorta} e o nome de ${reu.nome} entre os que herdam.`,
      tagsOcultas: { dominio: 'comportamental', subDominio: 'motivo', motivo: reu.motivoPotencial, ligadoA: reu.id },
    });
    lead = {
      cartaId: 'gen_citacao_comarca',
      revelaNo: localidadeId,
      nota: 'A nota aponta o gabinete do procurador.',
    };
    localidade = {
      id: localidadeId,
      rotuloMesa: sat.rotulo,
      titulo: `O Gabinete do Procurador — ${sat.rotulo}`,
      subtitulo: `${sat.rotulo}, hora e meia de estrada`,
      acoesEspeciais: [],
      prosa: [
        `Hora e meia de estrada. No gabinete, o procurador que servia ${aoMorto} pesa a carta do constable, corre o dedo pelo ${temCobranca ? 'copiador de cartas' : 'livro do gabinete'} e o deixa aberto sobre a mesa: [[gen_registro_comarca]].`,
      ],
    };
  }
  // E3 §4.6 — o TELEGRAMA (aprovado pelo autor): consulta por fio ao
  // registro distante. Só fatos de registro; a resposta é carta de
  // RUNTIME (o store a materializa, como faz com o algor — nunca entra no
  // catálogo nem nos marcadores). Latência: 2h com estação na vila; 4h
  // sem fio (o portador leva a consulta à agência da town).
  const temEstacao = bruto.mundo.cidade.predios.some((p) => p.tipo === 'estacao');
  const telegrama = {
    destino: sat.rotulo,
    via: temEstacao ? 'estacao' : 'portador',
    latencia: temEstacao ? 2 : 4,
    resposta: ramoOrigem
      ? {
          textoDisplay: 'A Resposta por Fio',
          termoCarimbo: `Telegrama de ${sat.rotulo}: a rota do carroceiro`,
          descricao: `No formulário pardo, na letra do telegrafista, hora de expedição e de chegada ao minuto: a rota no nome do morto, com os dias da semana conforme o diretório.`,
          tagsOcultas: { dominio: 'comportamental', subDominio: 'corroboracao', ligadoA: bruto.crime.vitimaId },
        }
      : ramoAusencia
      ? {
          textoDisplay: 'A Resposta por Fio',
          termoCarimbo: `Telegrama de ${sat.rotulo}: o livro de hóspedes`,
          descricao: `No formulário pardo, na letra do telegrafista, hora de expedição e de chegada ao minuto: o assento no nome de ${pessoas.get(ausenteId)?.nome}, e a conta de cama e ceia conforme o borrador.`,
          tagsOcultas: { dominio: 'comportamental', subDominio: 'corroboracao', ligadoA: ausenteId },
        }
      : corroborativa
      ? {
          textoDisplay: 'A Resposta por Fio',
          termoCarimbo: `Telegrama de ${sat.rotulo}: o assento do penhorista`,
          descricao: `No formulário pardo, na letra do telegrafista, hora de expedição e de chegada ao minuto: o número do assento, o dia, a soma e o nome ${daMorta} por extenso.`,
          tagsOcultas: { dominio: 'comportamental', subDominio: 'corroboracao', ligadoA: bruto.crime.vitimaId },
        }
      : {
          textoDisplay: 'A Resposta por Fio',
          termoCarimbo: `Telegrama de ${sat.rotulo}: o livro do procurador`,
          descricao: `No formulário pardo, na letra do telegrafista, hora de expedição e de chegada ao minuto: a data, a soma e o nome de ${reu.nome}; o procurador responde o que o livro consigna, e nada além.`,
          tagsOcultas: { dominio: 'comportamental', subDominio: 'motivo', motivo: reu.motivoPotencial, ligadoA: reu.id },
        },
  };
  return { satelite: sat, corroborativa, cartasNovas, localidade, lead, telegrama };
}

// E2: a superfície plausível do respingo alto, por tipo de logradouro
// (parecer do perito, A1 — o adro tem muro; a vereda, cerca; o pátio,
// madeirame; "parede" só existe dentro de casa).
const SUPERFICIE_RESPINGO = {
  adro_da_igreja: 'na pedra do muro',
  patio_da_granja: 'na tábua do alpendre',
  caminho_do_acude: 'no mourão da cerca',
  travessa_dos_fundos: 'na aduela de um barril encostado',
};

// O instrumento à vista, com artigo (P12 do playtest 19/07 r2: a carta diz
// O QUE ficou na cena, não só "instrumento"). Chaves = METODOS[..].instrumento.
const INSTRUMENTO_A_VISTA = {
  lamina_de_oficio: 'uma lâmina de ofício',
  cordao_torcido: 'um cordão torcido',
  arma_de_ocasiao: 'uma peça pesada, de ocasião',
  papel_de_arsenico: 'um papel de arsênico dobrado',
  travesseiro_ou_pano: 'um pano de abafo',
  frasco_de_laudano: 'um frasco de láudano',
};

// Âncora de autoria dos métodos SEM lesão moldável — veneno (láudano/arsênico)
// e sufocação (pano de abafo). A peça que liga o réu NÃO é uma arma que "casa
// com a lesão" (fair play + KB medicina-legal); é o VASO do veneno ou o pano.
// O tell durável é físico e específico do método — resíduo no frasco, pó nas
// dobras, o fiapo que a trama larga (igual ao preso no canto da boca do corpo,
// carta do corpo) —, análogo à "crosta sob o rebite" da lâmina. O "comum"
// preserva a paridade da deflexão (láudano/arsênico de venda livre; pano em
// todo leito). Chaves = METODOS[..].instrumento; ausente ⇒ método de lesão,
// prosa de arma.
const ANCORA_SEM_LESAO = {
  frasco_de_laudano: {
    aVista: 'um frasco de láudano de vidro escuro',
    abandono: 'a rolha de fora e o resto secando no gargalo',
    vao: 'do frasco',
    abandonadoDisplay: 'O Frasco Abandonado',
    abandonadoCarimbo: 'Frasco de láudano deixado na cena',
    faltandoDisplay: 'O Vidro que Falta',
    faltandoCarimbo: 'Frasco que falta no seu lugar',
    guardadoDisplay: 'O Frasco Lavado',
    guardadoCarimbo: 'Frasco lavado, resto no gargalo',
    guardadoIntro: 'o frasco de láudano lavado e reposto',
    guardadoResto: 'No fundo do gargalo, onde a água não alcança, resta um fio escuro da tintura',
    comum: 'A botica da vila vende o igual, e mais de uma casa tem o seu para a dor e o sono.',
  },
  papel_de_arsenico: {
    aVista: 'um papel de arsênico dobrado',
    abandono: 'aberto, o pó branco preso na dobra',
    vao: 'do papel dobrado',
    abandonadoDisplay: 'O Papel Abandonado',
    abandonadoCarimbo: 'Papel de arsênico deixado na cena',
    faltandoDisplay: 'O Lugar Vazio',
    faltandoCarimbo: 'Papel que falta no seu lugar',
    guardadoDisplay: 'O Papel Sacudido',
    guardadoCarimbo: 'Papel sacudido, pó nas dobras',
    guardadoIntro: 'o papel de arsênico sacudido e dobrado de novo',
    guardadoResto: 'Nas dobras, onde a sacudida não desce, resta um pó branco',
    comum: 'Papel assim compra-se para o rato e a mosca, em qualquer venda.',
  },
  travesseiro_ou_pano: {
    aVista: 'um pano de abafo',
    abandono: 'a trama largando um fiapo claro',
    vao: 'do pano',
    abandonadoDisplay: 'O Pano de Abafo',
    abandonadoCarimbo: 'Pano de abafo deixado na cena',
    faltandoDisplay: 'O Lugar Vazio',
    faltandoCarimbo: 'Pano que falta no seu lugar',
    guardadoDisplay: 'O Pano Lavado',
    guardadoCarimbo: 'Pano lavado, fiapo na trama',
    guardadoIntro: 'o pano lavado e reposto',
    guardadoResto: 'Na trama, onde a água não desfaz o urdume, ficou um fiapo claro',
    comum: 'Roupa de cama assim há em toda casa da vila.',
  },
};

// A lesão fatal por método: nome de carta, carimbo e laudo de exame próximo.
// Playtest de 19/07 (P2): o carimbo é OBSERVAÇÃO, nunca conclusão — descreve
// a morfologia e a sede; nomear o instrumento/meio ("arma branca") é dedução
// do jogador, via glossário. Termos validados contra docs/kb-medicina-legal/.
const PROSA_LESAO = {
  laminada: {
    // Parecer do perito (19/07): lesão FATAL no tórax é perfuro-incisa (a
    // punctura que mata em profundidade), não a incisa de superfície — a
    // descrição segue o trajeto fundo, sem a "cauda rasa" do talho.
    textoDisplay: 'A Ferida no Tórax',
    carimbo: 'Ferida perfuro-incisa; sede: tórax',
    descricao:
      'Uma fenda estreita, de bordas limpas e regulares, mais comprida que larga. A sonda desce fundo; o trajeto encerra mais do que a fenda aparenta. Sem ponte de pele entre as margens, e a pele ao redor não traz outros riscos rasos.',
  },
  garrote: {
    textoDisplay: 'O Sulco no Pescoço',
    carimbo: 'Sulco horizontal; sede: pescoço',
    descricao:
      'Um vinco uniforme corre horizontal em volta do pescoço, na mesma profundidade de ponta a ponta, sem subir rumo à nuca.',
  },
  esganadura: {
    textoDisplay: 'As Marcas no Pescoço',
    carimbo: 'Equimoses digitais; sede: pescoço',
    descricao:
      'Manchas roxas do tamanho de polpas de dedo dos dois lados da garganta, e meias-luas de unha impressas na pele.',
  },
  contundente: {
    textoDisplay: 'A Fratura no Crânio',
    carimbo: 'Fratura com afundamento; sede: têmpora',
    descricao:
      'Sob o cabelo, o couro cede ao tato num afundamento de bordas irregulares; o osso acompanha a depressão.',
  },
  veneno_arsenico: {
    textoDisplay: 'O Vômito Seco',
    carimbo: 'Resto de vômito ressecado; odor de alho à chama',
    descricao:
      'Na boca e no queixo, um resto de vômito seco. Levada à chama, a amostra solta cheiro de alho; da ceia, prato nenhum o levava.',
  },
  sufocacao: {
    textoDisplay: 'Os Sinais em Volta da Boca',
    carimbo: 'Escoriações em volta da boca e das narinas',
    descricao:
      'Pequenas marcas em torno dos lábios e das narinas, e um fiapo claro preso ao canto da boca. No pescoço, vinco nenhum.',
  },
  afogamento: {
    textoDisplay: 'A Espuma na Boca',
    carimbo: 'Espuma fina à boca e às narinas',
    descricao:
      'Um cogumelo de espuma fina assoma à boca e às narinas; enxugado, torna a formar-se. A pele das mãos está branca e enrugada.',
  },
  laudano: {
    textoDisplay: 'As Pupilas Fechadas',
    carimbo: 'Pupilas em ponta de alfinete',
    descricao:
      'No corpo, marca de luta nenhuma. As pupilas estão contraídas em ponta de alfinete, e um resquício de amargor fica no hálito.',
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

// E1 (OS palco em anéis): geometria mínima para ancorar as cartas do
// próprio montador (hora forjada, rastros de visita) a cômodos do grid —
// mesma convenção de crime.js. Metadado gerador-facing: o motor jamais lê.
function comodoDaCelulaDe(interior, celula) {
  const c = interior.comodos.find(
    (k) =>
      celula.col >= k.ret.col &&
      celula.col < k.ret.col + k.ret.colunas &&
      celula.fila >= k.ret.fila &&
      celula.fila < k.ret.fila + k.ret.filas
  );
  return c ? c.id : null;
}

// O cômodo da frente: o que contém a porta externa (célula frente-centro,
// a mesma convenção da pegada do desleixado e do arrasto em crime.js).
function comodoDaFrente(interior) {
  return comodoDaCelulaDe(interior, {
    col: Math.floor(interior.grid.colunas / 2),
    fila: interior.grid.filas - 1,
  });
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

// Rótulo de quarteirão em VOZ DE PROSA, como sintagma de lugar (OS Vila
// Viva E2): "A orla de trabalho" → "na orla de trabalho"; "O adro da
// igreja" → "no adro da igreja"; "High Street — lado norte" → "na High
// Street". Lê o ROTULOS_QUARTEIRAO de cidade.js — trocar lá não quebra aqui.
function quarteiraoEmFala(rotulo) {
  if (/^High Street/.test(rotulo)) return 'na High Street';
  const artigo = /^O /.test(rotulo) ? 'no' : 'na';
  const resto = rotulo.replace(/^[OA] /, '');
  return `${artigo} ${resto.charAt(0).toLowerCase()}${resto.slice(1)}`;
}

// O feitio da vila em VOZ DE PROSA (OS Vila Viva E4): a vizinhança lê a
// morfologia que o gerador desenhou. Observação pura — descreve o traçado,
// não conclui. A nucleada é o padrão e dispensa a nota (a prosa em volta já
// pressupõe casario aglomerado).
function descricaoMorfologia(morfologia) {
  if (morfologia === 'linear') return 'A vila é uma rua só, e os fundos dos lotes dão para o campo aberto.';
  if (morfologia === 'de_green') return 'As casas fazem anel em torno do gramado comunal, todas voltadas para o meio.';
  return '';
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
  // E2: palco externo — as realizações de chão e porta ramificam.
  const externo = !!escolha.palco?.externo;

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
        nova.carimboPadrao = p.carimbo;
        nova.descricao = p.descricao;
        break;
      }
      case 'gen_reacao_vital':
        // P3 (playtest 19/07): observação pura — a conclusão ("em vida",
        // reação vital) é dedução do jogador, via glossário.
        nova.descricao =
          'As lesões mostram bordas afastadas e retraídas; por dentro, o sangue está coagulado e preso à carne. Lavado o corte, o coágulo não se desprende.';
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
        // Métodos SEM lesão moldável (veneno, sufocação): a âncora é o VASO /
        // o pano, nunca "casa com a lesão" (não há ferida a moldar).
        const anc = ANCORA_SEM_LESAO[METODOS[escolha.metodoId]?.instrumento];
        if (anc) {
          if (classe === 'instrumento_abandonado') {
            nova.textoDisplay = anc.abandonadoDisplay;
            nova.carimboPadrao = anc.abandonadoCarimbo;
            nova.descricao = `No chão, junto ao corpo, ${anc.aVista}, ${anc.abandono}. Mais de uma boca reconhece a peça, e a vila dá ${reu.genero === 'feminino' ? 'a dona' : 'o dono'} pelo nome: ${reu.nome}.`;
          } else if (classe === 'instrumento_faltando') {
            nova.textoDisplay = anc.faltandoDisplay;
            nova.carimboPadrao = anc.faltandoCarimbo;
            nova.descricao = `Entre as coisas de ${reu.nome}, um vão limpo no pó da prateleira, do feitio ${anc.vao} que ali esteve.`;
          } else {
            nova.textoDisplay = anc.guardadoDisplay;
            nova.carimboPadrao = anc.guardadoCarimbo;
            nova.descricao = `Entre os pertences de ${reu.nome}, ${anc.guardadoIntro}. ${anc.guardadoResto}. ${anc.comum}`;
          }
          break;
        }
        if (classe === 'instrumento_abandonado') {
          nova.textoDisplay = 'O Instrumento Abandonado';
          nova.carimboPadrao = 'Instrumento deixado na cena';
          // Parecer do perito (E1): o instrumento fica na célula da queda e
          // o corpo pode ter sido arrastado — a descrição não jura vizinhança.
          // P12: a carta nomeia a peça e diz POR QUE a vila conhece o dono.
          const aVista = INSTRUMENTO_A_VISTA[METODOS[escolha.metodoId]?.instrumento];
          nova.descricao = aVista
            ? `No chão, onde a mão o largou: ${aVista}. O feitio casa com a lesão ${doMorto}. Mais de uma boca reconhece a peça de uso, e a vila dá ${reu.genero === 'feminino' ? 'a dona' : 'o dono'} pelo nome: ${reu.nome}.`
            : `Ficou no chão, onde a mão o largou. O feitio casa com a lesão ${doMorto}, e a vila dá ${reu.genero === 'feminino' ? 'a dona' : 'o dono'} pelo nome: ${reu.nome}.`;
        } else if (classe === 'instrumento_faltando') {
          nova.textoDisplay = 'O Lugar Vazio';
          nova.carimboPadrao = 'Instrumento que falta no seu lugar';
          nova.descricao = `Entre as coisas de ofício de ${reu.nome}, um vão limpo no meio do pó, do comprimento e do desenho da lesão ${doMorto}.`;
        } else {
          nova.textoDisplay = 'O Instrumento Lavado';
          nova.carimboPadrao = 'Instrumento lavado, crosta sob o rebite';
          nova.descricao = `Entre os pertences de ${reu.nome}, a peça lavada e reposta. A lâmina brilha, mas sob o rebite do cabo, onde a água não entra, há uma crosta escura alojada. O feitio casa com a lesão ${doMorto}.`;
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
      // Parecer do perito (E1): o vestígio depositado é "respingo alto,
      // fora do alcance da poça" (crime.js; removivel: false POR ISSO —
      // a esfrega do assoalho não o apanha). A prosa descreve o mesmo
      // fato, não uma trilha de gotas no chão que o dado não sustenta.
      case 'gen_sangue_alheio':
        if (externo) {
          // Parecer do perito (E2, A1): a superfície do respingo existe no
          // palco — muro no adro, madeirame no pátio, cerca no açude.
          nova.textoDisplay = 'O Respingo Alto';
          nova.carimboPadrao = 'Respingo alto, fora do alcance da poça';
          nova.descricao = `Um borrifo fino, de gotas miúdas, ${SUPERFICIE_RESPINGO[escolha.palco.logradouroId] || 'na superfície mais próxima'}, à altura do peito, fora do alcance da poça. As feridas ${doMorto} não alcançariam tão alto.`;
        } else {
          nova.textoDisplay = 'O Respingo na Parede';
          nova.carimboPadrao = 'Respingo alto, fora do alcance da poça';
          nova.descricao = `Um borrifo fino na parede, à altura do peito, fora do alcance da poça. As feridas ${doMorto} não alcançariam tão alto.`;
        }
        break;
      // Parecer do perito (E2, A2): o guaiaco só fecha em substrato de
      // laje (adro); em terra, os óxidos de ferro e as peroxidases
      // vegetais coram igual — o teste é dito inconclusivo e o tell
      // legítimo é a geometria da raspagem sob luz oblíqua (Gross).
      case 'gen_frestas':
        if (externo) {
          const cenaNoAdro = escolha.palco.logradouroId === 'adro_da_igreja';
          nova.textoDisplay = cenaNoAdro ? 'Sangue no Sulco' : 'A Faixa Raspada';
          nova.carimboPadrao = cenaNoAdro
            ? 'Chão raspado; guaiaco positivo no sulco'
            : 'Chão de terra raspado e varrido';
          nova.descricao = cenaNoAdro
            ? 'A luz rasteira segue a faixa varrida. No sulco entre as lajes, onde a vassoura não desce, o papel de filtro comprimido cora de azul.'
            : 'A luz rasteira segue a faixa raspada e varrida no chão de terra. O papel de filtro cora de azul no sulco; é cor que a terra de ferro também dá, e não fecha sozinha.';
        } else {
          nova.descricao =
            'A luz rente ao chão mostra a zona baça onde a esfrega passou: a madeira sem cera, a fibra levantada. Nas frestas entre as tábuas e no pé do rodapé, onde o esfregão não alcança, o papel de filtro comprimido cora de azul.';
        }
        break;
      case 'gen_pegadas':
        if (externo) nova.textoDisplay = 'Pegadas Rumo à Saída';
        nova.carimboPadrao = 'Meias-solas impressas em sangue';
        nova.descricao = externo
          ? 'Impressas em sangue, meias-solas do mesmo par, as pontas voltadas para a saída; entre uma e outra, um passo largo.'
          : 'Impressas em sangue, meias-solas do mesmo par, as pontas voltadas para a porta; entre uma e outra, um passo largo.';
        break;
      // ---- OS autobattler v2 (B3): as superfícies das doutrinas ----
      // Prosa sóbria de observação (lapidação fina fica com a OS de
      // prosa); a sede sai em língua legível, nunca em id.
      case 'gen_ungueais':
        nova.carimboPadrao = 'Escoriações ungueais no pescoço; fibra e pele sob as unhas';
        nova.descricao = `Sob a linha do queixo, escoriações curvas, em meia-lua, rasas. Sob as unhas ${doMorto}, fibra de cordoaria e um vestígio de pele. As marcas apontam para dentro: foi a própria mão que arranhou, puxando o que apertava o pescoço.`;
        break;
      case 'gen_incidental': {
        const vInc = crime.vestigios.find((x) => x.classe === 'lesao_incidental');
        const sedeInc = SEDE_LEGIVEL[vInc?.sede] || 'têmpora';
        nova.carimboPadrao = `Contusão com padrão de quina (${sedeInc})`;
        nova.descricao = `Fora do desenho das outras lesões, uma contusão de borda reta, na ${sedeInc}. O padrão é de aresta parada — canto de peça no caminho do corpo, não mão armada.`;
        break;
      }
      case 'gen_peca_deslocada': {
        const vPd = crime.vestigios.find((x) => x.classe === 'peca_deslocada' && !x.removido);
        const interpostaPd = Boolean(vPd?.detalhe && vPd.detalhe.includes('girada'));
        nova.carimboPadrao = interpostaPd ? 'Peça girada fora do seu assento' : 'Peça fora do seu lugar';
        nova.descricao = interpostaPd
          ? 'A peça está fora do esquadro do seu lugar, girada e arrastada; os pés riscaram o chão no sentido do vão da sala.'
          : 'A peça não está no seu assento. O vazio no arranjo tem o feitio dela, e ninguém da casa a moveu.';
        break;
      }
      case 'gen_fibra_aresta':
        nova.carimboPadrao = 'Fibra e cabelo presos na aresta';
        nova.descricao = 'Presos na aresta da peça, uma fibra de tecido e um fio de cabelo. A altura casa com um corpo em movimento, não com pancada de mão.';
        break;
      case 'gen_peca_limpa':
        nova.carimboPadrao = 'A única peça limpa da sala';
        nova.descricao = 'Entre superfícies com o pó de todos os dias, uma única peça limpa, passada a pano de fresco. A limpeza é a exceção — e a exceção se lê.';
        break;
      case 'gen_residuo_peca':
        nova.carimboPadrao = 'Crosta escura no relevo da peça';
        nova.descricao = `Na peça, uma crosta escura secou no relevo, onde o pano não desce. O feitio do relevo casa com uma lesão que não está ${femV ? 'na morta' : 'no morto'}.`;
        break;
      case 'gen_ferimento_reu': {
        const vFr = crime.vestigios.find((x) => x.classe === 'ferimento_do_agressor');
        const sedeFr = SEDE_LEGIVEL[vFr?.sede] || 'antebraços';
        nova.carimboPadrao = `Ferimento recente no suspeito (${sedeFr})`;
        nova.descricao = `De manga arregaçada por ordem do constable, ${reu.nome} mostra o que a roupa cobria: a marca recente de luta, ${sedeFr === 'fronte' || sedeFr === 'têmpora' ? 'na' : 'nos'} ${sedeFr}. A lesão tem os dias do crime, e a explicação doméstica não vem.`;
        break;
      }
      case 'gen_sinal_exigivel': {
        const sinalTag = nova.tagsOcultas;
        const sedeSinal = SEDE_LEGIVEL[sinalTag.sede] || sinalTag.sede;
        nova.carimboPadrao = `Marca-espelho esperada (${sedeSinal})`;
        nova.descricao = nova.carimboPadrao;
        break;
      }
      case 'gen_engodo': {
        if (nova.tagsOcultas.tipoEngodo === 'bilhete_sem_assinatura') {
          // "não casa com": exclusão por cotejo, nunca certeza instantânea
          // (parecer do perito, M1).
          nova.descricao = `Dobrado em quatro, um papel sem assinatura: lugar e hora marcados, em letra que não casa com a ${femV ? 'da morta' : 'do morto'}.`;
        } else {
          const portador = nova.origemTestemunha ? nome(nova.origemTestemunha) : null;
          const lugarEngodo = formasDoLugar(nomeDoPredio(bruto.mundo.cidade, escolha.localId));
          nova.descricao = portador
            ? `${portador} conta o recado que levou a ${vitima.nome}: que fosse ${lugarEngodo.a} sem falta. Quem lho pediu ficou fora da luz e não deixou nome.`
            : `Correu recado chamando ${vitima.nome} ${lugarEngodo.a}; de quem partiu, ninguém dá o nome.`;
        }
        break;
      }
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
        // Vítima-forasteiro (E3 §4.5): a caderneta vira o livro de fretes
        // do próprio morto; as dívidas de jogo e de paga falam da taverna
        // e da carga (parecer do perito, M4).
        const fraseForasteiro = vitima.forasteiro
          ? {
              divida_caderneta: `O livro de fretes do morto soma o que ${reu.nome} lhe devia, adiantado do bolso e cobrado na volta.`,
              divida_de_jogo: `A vila dá as noites de cartas na taverna; quem mais perdeu para o morto, e ficou a dever, foi ${reu.nome}.`,
              salario_atrasado: `Consta queixa de paga retida: o morto devia a ${reu.nome} as semanas de carga.`,
            }[c.tagsOcultas.motivo]
          : null;
        if (fraseForasteiro) {
          nova.textoDisplay = 'Os Papéis do Móbil';
          nova.carimboPadrao = `Móbil de ${reu.nome}`;
          nova.descricao = fraseForasteiro;
          break;
        }
        const frase = PROSA_MOTIVO[c.tagsOcultas.motivo];
        nova.textoDisplay = 'Os Papéis do Móbil';
        nova.carimboPadrao = `Móbil de ${reu.nome}`;
        nova.descricao = frase
          ? frase(reu, vitima)
          : `Do arquivo: queixa registrada entre ${reu.nome} e ${vitima.nome}, retirada dias depois sem explicação; o papel ficou.`;
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
// RETRATO DA VILA (OS Vila Viva E2): fatos geográficos da cidade gerada
// que a prosa das localidades passa a MOSTRAR — a ruela da vítima, os
// vizinhos parede-meia, as distâncias reais, o que fica ao alcance. Deriva
// de mundo.cidade × pacoteEspacial (o MESMO dado que o motor usa como
// ouvintes/álibis): a prosa exibe o que a mecânica já computou, sem
// inventar informação nem ler tagsOcultas. Endereço e quarteirão são fato
// público (não são tagsOcultas) — nomeá-los é observação, não vazamento.
// ---------------------------------------------------------------------

function retratoDaVila(bruto, cartas, pessoas) {
  const { mundo, crime, escolha } = bruto;
  const cidade = mundo.cidade;
  const cenaId = escolha.localId;
  const cenaPredio = obterPredio(cidade, cenaId);
  const quarteiraoCena = cidade.quarteiroes.find((q) => q.id === cenaPredio?.quarteirao) || null;
  // Vizinhos parede-meia: quem MORA em lote adjacente à cena. Priorizamos
  // os que a mecânica já nomeia (testemunha do ruído/corroboração) — a
  // prosa nomeia exatamente quem o motor conta como ouvinte —, depois o
  // resto do elenco adjacente. Ordem estável (sem sorteio): replay intacto.
  const nomeadosEmCartas = new Set(cartas.map((c) => c.origemTestemunha).filter(Boolean));
  const adjacentes = mundo.elenco.filter(
    (p) =>
      p.id !== crime.vitimaId &&
      p.pacoteEspacial &&
      p.pacoteEspacial.moradia &&
      saoAdjacentes(cidade, p.pacoteEspacial.moradia, cenaId)
  );
  adjacentes.sort(
    (a, b) => (nomeadosEmCartas.has(b.id) ? 1 : 0) - (nomeadosEmCartas.has(a.id) ? 1 : 0)
  );
  return { cidade, cenaId, cenaPredio, quarteiraoCena, adjacentes, nomeadosEmCartas };
}

// ---------------------------------------------------------------------
// ASSIMETRIA DE MOBÍLIA (OS Vila Viva E3): "o cômodo conta quem a pessoa
// era". Uma frase de LEITURA SOCIAL da casa da vítima, escolhida no build
// deterministicamente e ancorada em flags que o gerador já computou — a
// CLASSE da vítima (o degrau de mobília, via VOCABULARIO_DA_CLASSE) e, só
// quando o móbil do caso é de HERANÇA (a vítima tinha o que herdar), uma
// peça de melhor feitio. É OBSERVAÇÃO PURA (guia §2): descreve o objeto,
// não conclui. Camada narrativa — sem carta, sem [[id]], sem tagsOcultas:
// o motor jamais a lê (mesma cegueira das aparências). Corrobora textura,
// nunca prova, e nunca é a única via para uma dedução (fair play E3).
// Fonte do vocabulário: docs/kb-mundo-vitoriano/mobiliario-por-classe.md.
// ---------------------------------------------------------------------
const MOTIVO_DE_HERANCA = new Set(['heranca', 'dote', 'propriedade_da_esposa', 'recasamento_vigiado']);
const ASSIMETRIA_MOBILIA = {
  trabalhadora: {
    classe: [
      'Os retratos emoldurados e as flores de cera sob a redoma ocupam a parede principal da sala.',
      'A boa sala dá para a rua e fica fechada; as cadeiras de uso estão ao pé do fogão de ferro.',
      'O tapete de retalhos e o castiçal de latão lustrado ficam na sala da frente.',
    ],
    heranca: [
      'Entre a mobília gasta está um relógio de caixa alta, de feitio melhor que tudo à volta.',
      'A cama é de armação boa, lavrada, no meio do resto surrado.',
    ],
  },
  media: {
    classe: [
      'A louça boa fica no aparador da sala da frente, e os retratos, na mesma parede.',
      'O piano ocupa a sala, de tampa fechada e sem partituras à vista.',
      'O relógio da família e a estante de livros dividem a sala com as cadeiras do serão.',
    ],
    heranca: [
      'Sobre o aparador, a prataria traz um monograma de outra família.',
      'A cômoda do quarto é de mogno lavrado, de fatura acima do resto da casa.',
    ],
  },
  alta: {
    classe: [
      'A régua de sinos etiquetados ordena a cozinha; cada aposento tem a sua chamada.',
      'A prataria e a louça ficam no aparador de mogno da sala comprida, sob o puxador de sino.',
      'Os retratos da linhagem cobrem a parede da sala, do teto à altura do ombro.',
    ],
    heranca: [
      'A prataria do aparador traz o brasão de outra casa.',
      'O relógio de pé do hall e a cama de dossel curto guardam-se intactos, de outra geração.',
    ],
  },
};

function assimetriaDaMobilia(bruto) {
  const { crime, escolha, mundo } = bruto;
  if (escolha.palco && escolha.palco.externo) return null; // palco a céu aberto não lê morador
  const pessoas = indicePorId(mundo.elenco);
  const vitima = pessoas.get(crime.vitimaId);
  // Só a CASA da vítima lê a vítima (no serviço/loja a mobília é de outrem).
  if (!vitima || !vitima.pacoteEspacial || vitima.pacoteEspacial.moradia !== escolha.localId) return null;
  const tier = VOCABULARIO_DA_CLASSE[vitima.classeSocial] || 'trabalhadora';
  const assassino = pessoas.get(crime.assassinoId);
  const categoria = assassino && MOTIVO_DE_HERANCA.has(assassino.motivoPotencial) ? 'heranca' : 'classe';
  const pool = ASSIMETRIA_MOBILIA[tier][categoria];
  return pool[hashString(`${bruto.seed}|assimetria|mobilia`) % pool.length];
}

// ---------------------------------------------------------------------
// OS DA VILA NA MESA — as casas do interrogatório e o ponto de encontro.
//
// (a) Cada MORADIA de suspeito vira nó do mapa (`casa_<predioId>`): o
//     interrogatório corre à porta da pessoa, com o constable um passo
//     atrás — o mesmo desenho do caso-escola (a saleta, a loja, o moinho),
//     e o procedimento plausível de 1893 (o inquérito de vila anda de
//     porta em porta; a "sala de interrogatório" é anacronismo). Quem
//     partilha teto partilha nó: uma casa, um nó, os moradores dentro.
// (b) O nó de testemunhos difusos deixa de ser "A Vizinhança" abstrata e
//     ganha parede: o PRÉDIO DE ENCONTRO da vila (a taverna; a mercearia
//     ou a forja quando a taverna é a própria cena). O ID 'vizinhanca'
//     FICA — é encanamento lógico (cartas, interferência e QA o
//     referenciam; camada narrativa ≠ camada lógica); muda a apresentação.
// Casos especiais: morador do prédio de encontro é interrogado ali mesmo
// (origemLocalidade 'vizinhanca'); morador da delegacia, no posto; morador
// do prédio da cena ganha nó próprio no grupo 'cena_predio' (0h da cena).
// Tudo camada narrativa — o motor segue cego a moradia/rotina.
// ---------------------------------------------------------------------
const PREDIOS_DE_ENCONTRO = ['pub', 'mercearia', 'forja'];

function derivarCasasDoCaso(bruto, suspeitos) {
  const { mundo, escolha } = bruto;
  const pessoas = indicePorId(mundo.elenco);
  const venuePredioId =
    PREDIOS_DE_ENCONTRO.find(
      (id) => id !== escolha.localId && mundo.cidade.predios.some((p) => p.id === id)
    ) || 'pub';
  const porSuspeito = {};
  const casas = [];
  for (const s of suspeitos) {
    const pessoa = pessoas.get(s.id);
    if (!pessoa) continue;
    const moradia = pessoa.pacoteEspacial.moradia;
    let noId;
    if (moradia === venuePredioId) {
      noId = 'vizinhanca';
    } else if (moradia === 'delegacia') {
      noId = 'delegacia';
    } else {
      noId = `casa_${moradia}`;
      let casa = casas.find((c) => c.noId === noId);
      if (!casa) {
        casa = {
          noId,
          predioId: moradia,
          rotulo: nomeDoPredio(mundo.cidade, moradia),
          grupo: moradia === escolha.localId ? 'cena_predio' : 'vila',
          moradores: [],
        };
        casas.push(casa);
      }
      casa.moradores.push(pessoa);
    }
    porSuspeito[s.id] = noId;
  }
  return { venuePredioId, porSuspeito, casas };
}

// ---------------------------------------------------------------------
// Localidades: prosa com os marcadores [[id]] de todas as cartas, mais os
// blocos contingentes da interferência ({ eventoId, quando, paragrafos }).
// ---------------------------------------------------------------------
function montarLocalidades(bruto, cartas, casasDoCaso) {
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
  // E2: palco externo — o vocabulário troca (cômodo → canto), a cena ganha
  // a frase da descoberta e a vizinhança fala de muro e sebe, não de
  // parede-meia.
  const palco = escolha.palco || { externo: false };
  const externo = !!palco.externo;
  // OS Vila Viva E2: os fatos da vila gerada que a prosa das localidades
  // passa a mostrar (ruela, vizinhos parede-meia, distâncias).
  const retrato = retratoDaVila(bruto, cartas, pessoas);
  // OS Vila Viva E3: a leitura social da casa da vítima (null fora da casa
  // dela ou em palco externo). Camada narrativa — o motor jamais a lê.
  const leituraDaMobilia = assimetriaDaMobilia(bruto);
  const fraseDescoberta =
    externo && palco.descoberta
      ? `${palco.descoberta.descobridorId ? nome(palco.descoberta.descobridorId) : 'Um transeunte'} deu com ${
          femV ? 'ela' : 'ele'
        } às ${formatHora(palco.descoberta.hora)}; o alarme tomou a vila.`
      : null;

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
      externo
        ? `${femV ? 'A morta jaz' : 'O morto jaz'} ao relento, no canto a que a vila chama ${comodoEmFala(rotuloComodo)}, ${femV ? 'vestida' : 'vestido'} de sair. O constable pôs guarda à entrada; até a chegada {g:do perito|da perita}, nada se tocou.`
        : palco.pousada
          ? `${femV ? 'A morta jaz' : 'O morto jaz'} no chão do cômodo a que a vila chama ${comodoEmFala(rotuloComodo)}, ${femV ? 'vestida' : 'vestido'} como quem se recolheu para a noite. A rota seguia de manhã para as aldeias de além; a cama na taverna era a de sempre. O constable pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.`
          : `${femV ? 'A morta jaz' : 'O morto jaz'} no chão do cômodo a que a vila chama ${comodoEmFala(rotuloComodo)}, ${femV ? 'vestida' : 'vestido'} como andava em casa. O constable pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.`,
      'Ao primeiro exame do tronco e dos membros, [[gen_rigor]].',
      pFerida,
      // OS autobattler v2 (B3): as superfícies novas do laudo, em rótulo
      // técnico até a OS de prosa.
      ...(temCarta('gen_ungueais') ? ['No pescoço, sob a linha do queixo, o exame de perto acha: [[gen_ungueais]].'] : []),
      ...(temCarta('gen_incidental') ? ['Fora do desenho da lesão principal, em sítio próprio: [[gen_incidental]].'] : []),
      ...(temCarta('gen_sinal_exigivel') ? ['Na pele da vítima, o exame apura outro sinal: [[gen_sinal_exigivel]].'] : []),
      ...(cartas.some((c) => c.id === 'gen_engodo' && c.localidade === 'corpo')
        ? [
            femV
              ? 'Do bolso costurado à saia, a busca recolhe: [[gen_engodo]].'
              : 'Do bolso do colete, a busca recolhe: [[gen_engodo]].',
          ]
        : []),
      ...(cartas.some((c) => c.id === 'gen_recibo_comarca')
        ? ['Entre os pertences arrolados: [[gen_recibo_comarca]].']
        : []),
      ...(cartas.some((c) => c.id === 'gen_papeis_forasteiro')
        ? ['Entre os pertences arrolados: [[gen_papeis_forasteiro]].']
        : []),
      externo
        ? 'A maleta de instrumentos espera aberta no chão, ao pé do corpo; o termômetro de mercúrio fica à mão, se {detective.treatment} {detective.surname} houver por bem medir a temperatura do corpo.'
        : 'A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.treatment} {detective.surname} houver por bem medir a temperatura do corpo.',
    ],
  };

  // ---- A cena (E1, OS palco em anéis — D1, a última milha) ----
  // O acordeão do caso-escola chega ao gerado: introdução que ambienta sem
  // carta + UM PONTO POR CÔMODO do grid. Cada carta de cena vive no ponto
  // do seu cômodo (metadado `comodo` da ponte); cômodo sem carta é ponto
  // de AMBIÊNCIA (anti-telégrafo, GE2) — mobília nomeada, observação pura.
  // Cartas destrutíveis por interferência seguem em bloco contingente (um
  // ponto estático não saberia escondê-las quando o evento dispara).
  const comodoDoCorpo = crime.posicaoCorpo.comodo;
  const comodoValido = (id) => id && interior.comodos.some((k) => k.id === id);
  // As NASCIDAS de evento (cartasNovas da interferência) já vivem nos
  // blocos `disparado` distribuídos acima — não entram em ponto algum.
  const nascidasDeEvento = new Set(eventos.flatMap((e) => e.efeito.cartasNovas));
  const cartasCena = cartas.filter((c) => c.localidade === 'cena' && !nascidasDeEvento.has(c.id));
  const cartasPorComodo = {};
  for (const c of cartasCena) {
    if (eventoQueDestroi(c.id)) continue; // vai a bloco contingente, abaixo
    const chave = comodoValido(c.comodo) ? c.comodo : comodoDoCorpo;
    (cartasPorComodo[chave] ??= []).push(c);
  }
  // Textura de vestígio sem carta própria, no cômodo onde o autobattler a
  // deixou. Set de CLASSES: repetidas não empilham a mesma frase, e a
  // abertura de mobília lê a desordem antes de afirmar ordem (parecer E1).
  const TEXTURA_POR_CLASSE = {
    assoalho_esfregado: 'A madeira do assoalho cheira à esfrega de sabão e soda e perdeu a cera numa área baça.',
    mobilia_recomposta: 'Um arranhão escapa de sob o pé de uma peça de mobília.',
    mobilia_revirada: 'Há mobília por erguer do chão.',
    rastro_da_luta: 'De um canto a outro, nada guarda o seu lugar.',
  };
  const TEXTURAS_QUE_PEDEM_MOBILIA = ['mobilia_revirada', 'mobilia_recomposta', 'rastro_da_luta'];
  const texturaPorComodo = {};
  for (const v of crime.vestigios) {
    if (v.removido) continue;
    if (!TEXTURA_POR_CLASSE[v.classe]) continue;
    const chave = comodoValido(v.comodo) ? v.comodo : comodoDoCorpo;
    (texturaPorComodo[chave] ??= new Set()).add(v.classe);
  }
  // Frase de cada carta no seu ponto. As de sítio ("junto do corpo") só
  // valem no cômodo do corpo; fora dele, a variante neutra de cômodo.
  const frasesSegredo = externo
    ? [
        (id) => `Fora do caminho das pisadas, junto à borda: [[${id}]].`,
        (id) => `Sob a beira do mato, onde a foice não passou: [[${id}]].`,
      ]
    : [
        (id) => `Junto ao rodapé, fora do caminho das pisadas: [[${id}]].`,
        (id) => `A vassoura não alcança a beira de um móvel; ali, [[${id}]].`,
      ];
  let iSegredo = 0;
  const fraseDaCartaNaCena = (c, noComodoDoCorpo) => {
    if (c.id === 'gen_hora_forjada') return 'À vista, sem procura: [[gen_hora_forjada]].';
    if (c.id === 'gen_instrumento')
      return noComodoDoCorpo ? 'Junto do corpo, no chão: [[gen_instrumento]].' : 'No chão, à vista: [[gen_instrumento]].';
    if (c.id === 'gen_pertence')
      return `Por abrir desde a morte, a mão fechada ${femV ? 'da morta' : 'do morto'}: [[gen_pertence]].`;
    if (c.id === 'gen_sangue_alheio') {
      if (externo)
        return noComodoDoCorpo
          ? 'No muro mais próximo, fora do alcance da poça: [[gen_sangue_alheio]].'
          : 'Na pedra do muro, à altura do peito: [[gen_sangue_alheio]].';
      return noComodoDoCorpo
        ? 'Na parede, fora do alcance da poça: [[gen_sangue_alheio]].'
        : 'Na parede, à altura do peito: [[gen_sangue_alheio]].';
    }
    if (c.id === 'gen_pegadas')
      return externo ? 'Do chão até a saída: [[gen_pegadas]].' : 'Do meio do vão até a porta: [[gen_pegadas]].';
    if (c.id === 'gen_frestas')
      return externo ? 'Na faixa raspada do chão: [[gen_frestas]].' : 'Rente ao rodapé, onde a esfrega passou: [[gen_frestas]].';
    if ((c.tagsOcultas || {}).subDominio === 'rastro_de_visita') {
      const frase = frasesSegredo[iSegredo % frasesSegredo.length](c.id);
      iSegredo += 1;
      return frase;
    }
    return `Ao exame: [[${c.id}]].`;
  };
  // A isca vistosa (hora forjada) abre o ponto; os rastros de visita vão
  // ao miolo (plantio — a pista foge das posições de acento).
  const ORDEM_NA_CENA = ['gen_hora_forjada', 'gen_instrumento', 'gen_pertence', 'gen_sangue_alheio', 'gen_pegadas', 'gen_frestas'];
  const pesoNaCena = (c) => {
    const i = ORDEM_NA_CENA.indexOf(c.id);
    return i === -1 ? 1.5 : i;
  };
  const pontosCena = interior.comodos.map((k) => {
    const doComodo = (cartasPorComodo[k.id] || []).slice().sort((a, b) => pesoNaCena(a) - pesoNaCena(b));
    const pecas = (interior.mobilia || []).filter((m) => m.comodo === k.id).map((m) => m.rotulo || m.id);
    // Textura sem referente é suprimida: cômodo vazio não tem "mobília por
    // erguer" nem "nada guarda o seu lugar" (parecer E1, B2).
    const classesTextura = [...(texturaPorComodo[k.id] || [])].filter(
      (cl) => pecas.length > 0 || !TEXTURAS_QUE_PEDEM_MOBILIA.includes(cl)
    );
    // Cômodo em desordem não abre afirmando ordem (parecer E1, B1): a
    // variante de perímetro cede à listagem neutra.
    const temDesordem = classesTextura.some((cl) => cl === 'rastro_da_luta' || cl === 'mobilia_revirada');
    const frases = [];
    if (k.id === comodoDoCorpo)
      frases.push(`No chão deste ${externo ? 'canto' : 'cômodo'}, ${femV ? 'a morta' : 'o morto'}.`);
    // No palco externo o sorteio de variante usa hashDecisao (o hash
    // decorrelacionado do achado B✱): hashString preserva a paridade da
    // chave e travava TODOS os cantos de um caso na mesma variante
    // (parecer E2, A1). Nos internos, variante() fica — trocá-la mudaria
    // bytes do golden interno, vedado pelo critério de aceite 2 da OS;
    // a migração integral está registrada no PR como bump futuro.
    const escolherVariante = (pool, chave) =>
      externo ? pool[hashDecisao(chave) % pool.length] : variante(pool, chave);
    frases.push(
      pecas.length
        ? temDesordem
          ? externo
            ? `Do que ali está: ${pecas.join(', ')}.`
            : `Do mobiliário, ${pecas.join(', ')}.`
          : escolherVariante(
              externo
                ? [`No canto, ${pecas.join(', ')}.`, `Do que ali está: ${pecas.join(', ')}.`]
                : [`No cômodo, ${pecas.join(', ')}.`, `Do mobiliário, ${pecas.join(', ')}.`],
              `${bruto.seed}|prosa|ponto|${k.id}`
            )
        : escolherVariante(
            externo
              ? ['Canto sem coisa que o ocupe.', 'Ali, chão nu e mais nada.']
              : ['Cômodo de paredes nuas; mobília, nenhuma.', 'Vão sem mobília; sobra o assoalho nu.'],
            `${bruto.seed}|prosa|ponto|${k.id}`
          )
    );
    // Textura externa: vocabulário de relento (sem assoalho, sem mobília
    // de casa, sem "canto a canto" dentro de um ponto que já é canto).
    const TEXTURA_EXTERNA = {
      assoalho_esfregado: 'Uma faixa do chão está raspada e varrida; em volta, o piso guarda folha e pó.',
      mobilia_recomposta: 'Um vinco no chão escapa de sob o pé de uma das peças.',
      mobilia_revirada: 'O que ali tinha prumo está tombado.',
      rastro_da_luta: 'De uma borda a outra, nada guarda o seu lugar.',
    };
    for (const cl of classesTextura) frases.push((externo && TEXTURA_EXTERNA[cl]) || TEXTURA_POR_CLASSE[cl]);
    for (const c of doComodo) frases.push(fraseDaCartaNaCena(c, k.id === comodoDoCorpo));
    return {
      id: `pt_cena_${k.id}`,
      rotulo: k.rotulo || k.id,
      // Metadado gerador-facing (guarda GE1): o cômodo do grid de que este
      // ponto deriva. O componente o ignora; o motor jamais o lê.
      comodo: k.id,
      prosa: [frases.join(' ')],
    };
  });
  // As destrutíveis por interferência: bloco contingente com o cômodo dito
  // por extenso (fora do acordeão, a frase precisa dizer onde).
  for (const c of cartasCena) {
    const ev = eventoQueDestroi(c.id);
    if (!ev) continue;
    const k = interior.comodos.find((x) => x.id === (comodoValido(c.comodo) ? c.comodo : comodoDoCorpo));
    const frase = fraseDaCartaNaCena(c, k.id === comodoDoCorpo);
    const contextualizada = `No ${externo ? 'canto' : 'cômodo'} chamado ${comodoEmFala(k.rotulo || k.id)}, ${
      frase.charAt(0).toLowerCase() + frase.slice(1)
    }`;
    (blocosPorLocalidade.cena ??= []).push({ eventoId: ev.id, quando: 'nao_disparado', paragrafos: [contextualizada] });
  }
  const cena = {
    id: 'cena',
    rotuloMesa: 'A Cena do Crime',
    titulo: `A Cena — ${predioCena}`,
    subtitulo: `Onde ${vitima.nome} foi ${femV ? 'achada' : 'achado'}`,
    acoesEspeciais: [],
    introducao: [
      `${sujeitoDoLugar(predioCena)} guarda o dia em que ${femV ? 'a' : 'o'} acharam; o exame corre ${
        externo ? 'canto a canto' : 'cômodo a cômodo'
      }.`,
      ...(fraseDescoberta ? [fraseDescoberta] : []),
      // E3: a casa da vítima lida pela mobília (leitura social, não pista).
      ...(leituraDaMobilia ? [leituraDaMobilia] : []),
    ],
    pontos: pontosCena,
    // E1 (OS Vila Viva): a planta projetada do grid (mesmo schema de
    // PLANTA_RELOJOARIA) viaja no pacote para o componente desenhá-la. Cada
    // cômodo da planta tem o mesmo `id` do cômodo de que o ponto deriva
    // (pontosCena[].comodo), o que liga a planta ao acordeão sem que regra
    // alguma a leia. Camada VISUAL — o motor jamais toca aqui.
    planta: interior.planta,
    blocosContingentes: blocosPorLocalidade.cena || [],
  };

  // ---- A delegacia ----
  const evVisto = eventoQueDestroi('gen_visto_vivo');
  const fraseVisto = 'No registro da ronda, na letra do guarda: [[gen_visto_vivo]].';
  const delegacia = {
    id: 'delegacia',
    rotuloMesa: 'O Posto do Constable',
    titulo: 'O Posto do Constable',
    subtitulo: 'Os papéis do caso',
    acoesEspeciais: [],
    prosa: [
      variante(
        [
          `O posto do constable é um cômodo só, de armário e mesa de tábua. O constable põe à vista o que os papéis guardam ${femV ? 'da morta' : 'do morto'} e da vila, e deixa {g:o senhor|a senhora} ler por si; o que passar daqui segue às petty sessions, a audiência dos magistrados, na vila maior.`,
          `No posto do constable cheira a tinta e a poeira de papel. O constable abre o armário sem que se peça e afasta a própria cadeira: o que a vila lavrou sobre ${femV ? 'a morta' : 'o morto'} está aí para quem leia.`,
        ],
        `${bruto.seed}|prosa|delegacia`
      ),
      ...(evVisto ? [] : temCarta('gen_visto_vivo') ? [fraseVisto] : []),
      // Com móbil-isca, os dois papéis dividem a mesma frase e o mesmo
      // peso; a isca fica no acento do fim (o chamariz honesto), e o
      // móbil verdadeiro, no miolo.
      (() => {
        const isca = cartas.find((c) => c.id.startsWith('gen_movel_'));
        return isca
          ? `Entre os papéis recolhidos por precaução: [[gen_motivo]] e [[${isca.id}]].`
          : 'Entre os papéis recolhidos por precaução: [[gen_motivo]].';
      })(),
      ...(cartas.some((c) => c.id === 'gen_citacao_comarca')
        ? ['Presa por alfinete ao maço, a folha de praxe: [[gen_citacao_comarca]].']
        : []),
      // OS da vila na mesa: os interrogatórios saíram do posto — correm à
      // porta de cada morada (nós `casa_*`); o constable dá os endereços.
      // Ressalva do morador do posto (o guarda do condado): ele responde
      // aqui mesmo — sem ela, a frase mentiria nesses casos (fiscal, furo 4).
      Object.values(casasDoCaso.porSuspeito).includes('delegacia')
        ? 'Dos nomes que os papéis guardam, o constable dá as moradas, uma a uma; os interrogatórios correm à porta de cada casa — salvo o de quem mora sob o teto do posto, ouvido aqui mesmo.'
        : 'Dos nomes que os papéis guardam, o constable dá as moradas, uma a uma; os interrogatórios correm à porta de cada casa.',
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

  // ---- O ponto de encontro (id 'vizinhanca' — ver derivarCasasDoCaso) ----
  const evRuido = eventoQueDestroi('gen_ruido_ouvido');
  // Moldura do ruído conforme o posto de escuta: quem mora (ou passava a
  // faixa do crime) no próprio prédio da cena não ouve "de uma janela
  // vizinha" (parecer Fase 1, fiscal 3). Quem só FREQUENTAVA o prédio não
  // "dormia parede-meia" — o álibi dele diz que foi dormir em casa
  // (parecer Fase 3, N2): a moldura da rotina é neutra de pernoite. A fala
  // agora corre no prédio de encontro — o dizente está presente, contando.
  const cartaRuido = cartas.find((c) => c.id === 'gen_ruido_ouvido');
  const tRuido = cartaRuido && cartaRuido.origemTestemunha ? pessoas.get(cartaRuido.origemTestemunha) : null;
  const moraNoPredio = !!tRuido && tRuido.pacoteEspacial.moradia === escolha.localId;
  const frequentavaOPredio = !!tRuido && tRuido.pacoteEspacial.rotina[escolha.faixa] === escolha.localId;
  const fraseRuido = externo
    ? 'Quem mora mais perto do lugar conta: [[gen_ruido_ouvido]].'
    : moraNoPredio
      ? 'Quem dormia sob o teto da própria cena conta, a meia-voz: [[gen_ruido_ouvido]].'
      : frequentavaOPredio
        ? 'Quem lá estava àquela hora conta: [[gen_ruido_ouvido]].'
        : 'Quem tem janela para a cena conta: [[gen_ruido_ouvido]].';
  const cartaPrenuncio = cartas.find((c) => (c.tagsOcultas || {}).subDominio === 'prenuncio');
  const rotuloEncontro = nomeDoPredio(mundo.cidade, casasDoCaso.venuePredioId);
  // A cor do lugar, por tipo de prédio de encontro (observação pura; o
  // falatório é costume de 1893 — pub/loja/forja como praças de conversa,
  // KB vida-cotidiana). Duas variantes por prédio, sorteio decorrelacionado.
  const INTRO_ENCONTRO = {
    pub: [
      'Na taverna, serragem no chão e canecas que descem devagar; a conversa não espera pergunta.',
      'A taverna junta a vila ao fim da lida: bancos corridos, o balcão úmido, e quem chega ouve antes de sentar.',
    ],
    mercearia: [
      'Na mercearia, a fila da tarde anda devagar: cada freguês deixa a compra e leva o falatório.',
      'No balcão da mercearia pesa-se farinha e conversa; a fila da tarde vai até a porta.',
    ],
    forja: [
      'Na forja, a bigorna bate o dia inteiro; quem espera ferradura conversa, e espera-se bastante.',
      'O fole da forja não abafa as vozes: quem traz ferro a consertar traz junto o que ouviu.',
    ],
  };
  const vizinhanca = {
    id: 'vizinhanca',
    rotuloMesa: rotuloEncontro,
    titulo: rotuloEncontro,
    subtitulo: 'Onde a vila conta o que sabe',
    acoesEspeciais: [],
    prosa: [
      (INTRO_ENCONTRO[casasDoCaso.venuePredioId] || INTRO_ENCONTRO.pub)[
        hashDecisao(`${bruto.seed}|prosa|encontro`) % 2
      ],
      // E4 (OS Vila Viva): a nota de morfologia da vila (linear/de green;
      // nucleada dispensa). Observação pura — vale em qualquer palco: quem
      // descreve o traçado agora é a conversa do prédio de encontro.
      ...(descricaoMorfologia(retrato.cidade.morfologia)
        ? [descricaoMorfologia(retrato.cidade.morfologia)]
        : []),
      // E2 (OS Vila Viva): a geografia pública da cena — o quarteirão e
      // quem mora parede-meia (o mesmo elenco que o motor conta como
      // ouvinte/álibi). Fair play: nenhum dado novo, nenhuma tagsOculta.
      externo
        ? [
            'A cena fica a céu aberto; as casas mais próximas olham-na de longe, por cima de muro e sebe.',
            'Em volta da cena, campo e muro baixo; até a primeira casa vai um bom pedaço de caminho.',
          ][hashDecisao(`${bruto.seed}|prosa|vizinhanca|externa`) % 2]
        : retrato.adjacentes.length > 0
          ? `${sujeitoDoLugar(predioCena)} fica ${
              retrato.quarteiraoCena ? quarteiraoEmFala(retrato.quarteiraoCena.rotulo) : 'no miolo da vila'
            }; ${retrato.adjacentes[0].nome}, ${profissaoExibida(retrato.adjacentes[0].profissao)}, ${
              // Evita o eco de "parede-meia" quando a linha do ruído (adiante)
              // já o usa (testemunha que mora no próprio prédio da cena).
              moraNoPredio ? 'mora porta com porta' : 'mora parede-meia'
            }, e da janela de uma casa se alcança a soleira da outra.`
          : `${sujeitoDoLugar(predioCena)} fica ${
              retrato.quarteiraoCena ? quarteiraoEmFala(retrato.quarteiraoCena.rotulo) : 'no miolo da vila'
            }, à parte das casas de morada; até a porta mais próxima vai um bom pedaço de caminho.`,
      ...(cartas.some((c) => c.id === 'gen_engodo' && c.localidade === 'vizinhanca')
        ? ['Do recado que correu na véspera: [[gen_engodo]].']
        : []),
      ...(evRuido ? [] : temCarta('gen_ruido_ouvido') ? [fraseRuido] : []),
      ...(() => {
        const corroboracoes = cartas.filter((c) => c.id.startsWith('gen_corrobora_'));
        return corroboracoes.length
          ? [`Um e outro, ali mesmo, respondem pelos seus: ${corroboracoes.map((c) => `[[${c.id}]]`).join(', ')}.`]
          : [];
      })(),
      ...(cartaPrenuncio ? [`Alguém se chega, sem convite, ao lado {g:do perito|da perita}: [[${cartaPrenuncio.id}]].`] : []),
    ],
    blocosContingentes: [
      ...(evRuido ? [{ eventoId: evRuido.id, quando: 'nao_disparado', paragrafos: [fraseRuido] }] : []),
      ...(blocosPorLocalidade.vizinhanca || []),
    ],
  };

  // ---- As casas do interrogatório (OS da vila na mesa) ----
  // Um nó por moradia de suspeito; a árvore de diálogo embute-se aqui
  // (origemLocalidade = o nó da casa). A prosa é moldura de visita —
  // nenhuma carta mora na prosa (o álibi nasce na fala do interrogado).
  const casasLocalidades = casasDoCaso.casas.map((casa) => {
    const nomes = casa.moradores.map((m) => m.nome);
    const predioCasa = obterPredio(mundo.cidade, casa.predioId);
    const quarteiraoCasa = predioCasa
      ? mundo.cidade.quarteiroes.find((q) => q.id === predioCasa.quarteirao)
      : null;
    const ondeFica = quarteiraoCasa ? quarteiraoEmFala(quarteiraoCasa.rotulo) : 'na vila';
    const mesmaDaCena = casa.predioId === escolha.localId;
    return {
      id: casa.noId,
      rotuloMesa: casa.rotulo,
      titulo: `${casa.rotulo} — à porta`,
      subtitulo:
        nomes.length > 1
          ? `A morada de ${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`
          : `A morada de ${nomes[0]}`,
      acoesEspeciais: [],
      prosa: [
        mesmaDaCena
          ? 'A casa é a mesma do achado; o guarda de sentinela dá passagem, e a conversa corre no batente.'
          : [
              `${sujeitoDoLugar(casa.rotulo)} fica ${ondeFica}. O constable acompanha até a soleira e fica um passo atrás.`,
              `${sujeitoDoLugar(casa.rotulo)} fica ${ondeFica}. O constable bate, anuncia o inquérito e cede a vez.`,
              `${sujeitoDoLugar(casa.rotulo)} fica ${ondeFica}. O constable vai adiante, bate com o nó dos dedos e recua um passo.`,
            ][hashDecisao(`${bruto.seed}|prosa|casa|${casa.noId}`) % 3],
      ],
    };
  });

  // ---- Os pertences do réu (só quando a carta de nexo vive lá) ----
  // OS autobattler v2 (B3): a localidade pode carregar mais de uma carta
  // (o instrumento levado E o ferimento no corpo do suspeito) — toda
  // carta daqui ganha marcador próprio.
  const cartasOficio = cartas.filter((c) => c.localidade === 'oficio_do_reu');
  const cartaOficio = cartasOficio.find((c) => c.id !== 'gen_ferimento_reu') || cartasOficio[0];
  const localidades = [corpo, cena, delegacia, vizinhanca, ...casasLocalidades];
  if (cartaOficio) {
    const reu = pessoas.get(crime.assassinoId);
    const predioOficio = nomeDoPredio(
      mundo.cidade,
      reu.pacoteEspacial.trabalho || reu.pacoteEspacial.moradia
    );
    localidades.push({
      id: 'oficio_do_reu',
      // OS da vila na mesa: a casa do réu agora é nó próprio (casa_*) — o
      // rótulo da diligência distingue as duas cartas na mesa.
      rotuloMesa: `${predioOficio} — a busca`,
      titulo: `${predioOficio} — a diligência`,
      subtitulo: 'Busca com o constable à porta',
      acoesEspeciais: [],
      prosa: [
        cartaOficio.id === 'gen_ferimento_reu'
          ? `A diligência corre com o constable à porta e ${reu.genero === 'feminino' ? 'a dona' : 'o dono'} das coisas a um canto. O constable manda arregaçar as mangas: [[gen_ferimento_reu]].`
          : `A diligência corre com o constable à porta e ${reu.genero === 'feminino' ? 'a dona' : 'o dono'} das coisas a um canto. Entre bancada e caixas, o que a busca encontra: [[${cartaOficio.id}]].`,
        ...(cartaOficio.id !== 'gen_ferimento_reu' && cartasOficio.some((c) => c.id === 'gen_ferimento_reu')
          ? [`Antes de liberar ${reu.genero === 'feminino' ? 'a dona' : 'o dono'} das coisas, o constable manda arregaçar as mangas: [[gen_ferimento_reu]].`]
          : []),
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
function montarMapa(localidades, comarcaDoCaso = null, casasDoCaso = null) {
  // O nó da diligência (v2 — lacuna D6 do playtest) nasce OCULTO: só o
  // móbil lavrado nos papéis dá causa à busca nos pertences de alguém.
  // Extrair gen_motivo revela o nó — a progressão de mapa do caso-escola
  // (o gabinete Pettigrew), emulada com o que o caso gerado tem.
  // E3: o nó de comarca (comarca_<satelite>) nasce oculto e caro — o
  // grupo próprio carrega a distância real do satélite (relógio mole).
  // OS da vila na mesa: os nós `casa_*` entram no grupo 'vila' (1h por
  // trecho), salvo a casa que É o prédio da cena — grupo 'cena_predio'
  // (andar dentro do mesmo prédio custa 0h, como corpo↔cena).
  const grupoDaCasa = (noId) =>
    (casasDoCaso && casasDoCaso.casas.find((c) => c.noId === noId)?.grupo) || 'vila';
  const nosMapa = localidades.map((loc) => ({
    id: loc.id,
    rotulo: loc.rotuloMesa,
    grupo:
      loc.id === 'corpo' || loc.id === 'cena'
        ? 'cena_predio'
        : loc.id.startsWith('comarca_')
          ? loc.id
          : loc.id.startsWith('casa_')
            ? grupoDaCasa(loc.id)
            : 'vila',
    desbloqueadoInicio: loc.id !== 'oficio_do_reu' && !loc.id.startsWith('comarca_'),
  }));
  const leads = localidades.some((l) => l.id === 'oficio_do_reu')
    ? [{ cartaId: 'gen_motivo', revelaNo: 'oficio_do_reu', nota: 'O nome nos papéis dá causa à diligência.' }]
    : [];
  const custos = {
    'cena_predio|cena_predio': 0,
    'cena_predio|vila': 1,
    'vila|cena_predio': 1,
    'vila|vila': 1,
  };
  if (comarcaDoCaso) {
    leads.push(comarcaDoCaso.lead);
    const grupo = `comarca_${comarcaDoCaso.satelite.id}`;
    const dist = comarcaDoCaso.satelite.distanciaHoras;
    custos[`${grupo}|${grupo}`] = 0;
    custos[`${grupo}|vila`] = dist;
    custos[`vila|${grupo}`] = dist;
    custos[`${grupo}|cena_predio`] = dist;
    custos[`cena_predio|${grupo}`] = dist;
  }
  return { nosMapa, custos, leads };
}

// ---------------------------------------------------------------------
// A MAQUETE DA VILA (OS da vila na mesa — a etapa E6 do plano Vila Viva):
// o diorama 3D do caso gerado, derivado da cidade da Fase 2 no MESMO
// schema que o DioramaVila consome (posicoes por nó {x,z,predio} + formas
// por prédio). Camada 100% VISUAL do pacote (linhagem do campo `planta`):
// o motor jamais a lê (guarda GE3 no qa.mjs); ausente ou incompleta, a
// Escrivaninha cai na grade 2D — o jogo joga idêntico (fallback ?flat=1).
//   posicoes : { [noId]: { x, z, predio, distante? } } — um por nó do mapa;
//   formas   : { [chave]: silhueta } — a do prédio da cidade, ou a do
//              ANEXO (nós que dividem prédio: corpo↔cena, busca na casa);
//   cenario  : [{ predio, x, z, logradouro? }] — o casario SEM nó (as
//              casas da vila que faltavam à maquete), não clicável;
//   tabua    : { centroX, largura, fundo } — a peça sob a vila;
//   estrada  : polilinha até o nó de comarca (só quando o caso o tem).
// Tudo determinístico: coordenadas da cidade seedada, zero sorteio novo.
// ---------------------------------------------------------------------
const FORMA_ANEXO = {
  w: 0.62, d: 0.52, h: 0.42, corParede: '#7d684c', corTelhado: '#443328',
  telhadoAltura: 0.28, beiral: 0.07, ristela: true, chamines: [],
};
// Deslocamentos dos anexos de um MESMO prédio, na ordem de chegada: o
// segundo e o terceiro nó no mesmo lote não podem nascer no mesmo ponto
// (z-fighting) nem à mesma altura de etiqueta (uma interceptaria a outra
// — parecer do fiscal, furo 2: até 3 nós num prédio quando a cena, a casa
// do réu e a busca coincidem). `rotuloAlto` é numérico: o Predio soma-o à
// altura da etiqueta, escalonando-as.
const DESLOC_ANEXO = [
  { dx: 0.12, dz: -0.62, rotuloAlto: 1.3 },
  { dx: -0.66, dz: -0.44, rotuloAlto: 1.75 },
  { dx: 0.78, dz: -0.44, rotuloAlto: 2.1 },
];
const FORMA_COMARCA = {
  w: 1.3, d: 1.0, h: 1.05, corParede: '#77705f', corTelhado: '#3a352d',
  telhadoAltura: 0.56, beiral: 0.12, ristela: true,
  chamines: [{ x: 0.45, z: -0.25, alt: 0.55 }],
};

function derivarMaquete({ bruto, nosMapa, casasDoCaso }) {
  const cidade = bruto.mundo.cidade;
  const arred = (v) => Math.round(v * 100) / 100;
  const predioDoNo = (noId) => {
    if (noId === 'cena' || noId === 'corpo') return bruto.escolha.localId;
    if (noId === 'delegacia') return 'delegacia';
    if (noId === 'vizinhanca') return casasDoCaso.venuePredioId;
    if (noId.startsWith('casa_')) return noId.slice('casa_'.length);
    if (noId === 'oficio_do_reu') {
      const reu = bruto.mundo.elenco.find((p) => p.id === bruto.crime.assassinoId);
      return reu.pacoteEspacial.trabalho || reu.pacoteEspacial.moradia;
    }
    return null; // comarca_*: fora da vila, tratado adiante
  };
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const p of cidade.predios) {
    minX = Math.min(minX, p.pos.x);
    maxX = Math.max(maxX, p.pos.x);
    minZ = Math.min(minZ, p.pos.z);
    maxZ = Math.max(maxZ, p.pos.z);
  }
  const posicoes = {};
  const formas = {};
  const reivindicados = new Set();
  const anexosPorPredio = new Map();
  for (const no of nosMapa) {
    if (no.id.startsWith('comarca_')) continue;
    const predioId = predioDoNo(no.id);
    const predio = predioId ? obterPredio(cidade, predioId) : null;
    if (!predio) continue; // defensivo: nó sem prédio cai no fallback 2D
    if (!reivindicados.has(predioId)) {
      reivindicados.add(predioId);
      posicoes[no.id] = { x: predio.pos.x, z: predio.pos.z, predio: predioId };
      formas[predioId] = predio.forma;
    } else {
      // O ANEXO: nó subsequente no mesmo prédio (o corpo nos fundos da
      // cena, a casa que é a cena, a diligência na casa já mapeada) —
      // telheiro pequeno ATRÁS do prédio-mãe, na linhagem da
      // relojoaria_fundos. Atrás (−z), a etiqueta sobe na tela e não
      // intercepta o clique da etiqueta da frente; anexos IRMÃOS do mesmo
      // prédio escalonam posição e altura de etiqueta (DESLOC_ANEXO).
      const n = anexosPorPredio.get(predioId) || 0;
      anexosPorPredio.set(predioId, n + 1);
      const d = DESLOC_ANEXO[Math.min(n, DESLOC_ANEXO.length - 1)];
      const chave = `anexo_${no.id}`;
      posicoes[no.id] = { x: arred(predio.pos.x + d.dx), z: arred(predio.pos.z + d.dz), predio: chave };
      formas[chave] = { ...FORMA_ANEXO, rotuloAlto: d.rotuloAlto };
    }
  }
  // O nó de comarca: na ponta da estrada, além da borda nascente da vila
  // (linhagem do gabinete Pettigrew — o mapa CRESCE quando o lead abre).
  let estrada = null;
  for (const no of nosMapa) {
    if (!no.id.startsWith('comarca_')) continue;
    const x = arred(maxX + 2.1);
    const z = -1.7;
    const chave = `predio_${no.id}`;
    posicoes[no.id] = { x, z, predio: chave, distante: true };
    formas[chave] = { ...FORMA_COMARCA, chamines: FORMA_COMARCA.chamines.map((c) => ({ ...c })) };
    estrada = [
      { x: arred(maxX + 0.4), z: -0.7 },
      { x: arred(maxX + 1.1), z: -1.15 },
      { x: arred(maxX + 1.7), z: -1.45 },
      { x, z },
    ];
  }
  // O casario sem nó: TODA a vila gerada entra na maquete como cenário
  // (era a lacuna do diorama órfão — a vila existia no dado e não na mesa).
  const cenario = [];
  for (const p of cidade.predios) {
    if (reivindicados.has(p.id)) continue;
    cenario.push({ predio: p.id, x: p.pos.x, z: p.pos.z, ...(p.logradouro ? { logradouro: true } : {}) });
    formas[p.id] = p.forma;
  }
  const tabua = {
    centroX: arred((minX + maxX) / 2),
    largura: arred(maxX - minX + 3.4),
    fundo: arred(maxZ - minZ + 2.6),
  };
  return {
    morfologia: cidade.morfologia,
    tabua,
    posicoes,
    formas,
    cenario,
    ...(estrada ? { estrada } : {}),
  };
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

  // ---------------------------------------------------------------------
  // Abertura procedural — cold open da descoberta (OS Prosa Viva E1).
  // A pensão da Sra. Potts é abertura SÓ do tutorial (src/data/abertura.js);
  // o caso gerado abre nos olhos de quem achou o corpo. Cada passo compõe-se
  // por SLOTS escolhidos por hashDecisao (decorrelação — o hashString cru
  // trava os slots numa coluna), poucos fragmentos explodindo em combinações.
  // CERCA DE FAIR-PLAY: o cold open é observação pura de leigo — nunca revela
  // mecanismo, hora da morte ou culpado, e jamais confirma ou desmente a
  // encenação. Os fatos duros (nome, ofício, "nada se tocou") ficam na carta
  // e no briefing. A assinatura recorrente do perito é o MÉTODO (a maleta, a
  // caderneta em branco), não um lugar fixo (D1).
  // ---------------------------------------------------------------------
  const palco = bruto.escolha.palco || {};
  const palcoChave = palco.externo ? 'externo' : palco.pousada ? 'pousada' : 'interno';
  const predioEm = formasDoLugar(nomeDoPredio(mundo.cidade, bruto.escolha.localId)).em;
  const escolher = (pool, chave) => pool[hashDecisao(`${sal}|abertura|${chave}`) % pool.length];

  // Passo 1 — a descoberta (ramifica com o palco, como a prosa do corpo).
  // Regra da cerca (perito-forense, E1): os pools de DESCOBERTA só contêm
  // CIRCUNSTÂNCIA DO DESCOBRIDOR (quem, quando chegou, o que fez), nunca
  // ESTADO FÍSICO DA CENA (porta trancada/aberta, posição do corpo, sangue,
  // temperatura, desordem) — a escolha é decorrelada da cena e mentiria.
  const DESCOBERTA = {
    interno: [
      'De manhã cedo, o leite ficou à porta, intacto. A vizinha bateu, chamou pelo nome; a casa não devolveu voz.',
      'O cão preso ao mourão ganiu desde a primeira luz. Um vizinho a caminho da lida parou à cerca, chamou, e não teve resposta.',
      'Vieram trazer um recado e ninguém veio à porta. Chamaram da soleira, sem resposta, e foram buscar o constable.',
    ],
    externo: [
      'Ao romper do dia, um carroceiro deu com o corpo caído à beira do caminho e susteve a parelha.',
      'No descampado, à saída da vila, o corpo jazia caído na relva. Um lavrador a caminho da lida foi quem primeiro passou.',
      'Quem cruzava a ponte de manhã cedo estacou diante da forma caída na margem e voltou correndo para chamar o constable.',
    ],
    pousada: [
      'O hóspede não desceu para o desjejum nem à hora do almoço. O taverneiro bateu, não obteve resposta e mandou chamar o constable.',
      'Foi a criada da taverna, subindo com a água quente, quem achou o quarto em silêncio. Largou o jarro e desceu aos gritos.',
      'Na taverna, o quarto do fundo não abriu à hora do costume. O taverneiro subiu, não obteve resposta e recuou até a escada para mandar recado ao posto.',
    ],
  };

  // Passo 2 — o constable assume e manda chamar o perito.
  const ALARME = [
    `O constable ${delegado} pôs guarda à porta antes das nove e mandou que nada se tocasse. O caso passava do seu ofício, e ele foi o primeiro a dizê-lo.`,
    `${delegado}, o constable da vila, chegou, olhou o que havia para olhar e recuou um passo. Fechou a cena, deixou um homem de guarda e sentou-se a escrever ao condado.`,
    `Constable de uma vila que raramente lhe pedia mais que apartar uma bebedeira, ${delegado} pôs guarda, lavrou a ocorrência e chamou quem soubesse ler um corpo.`,
  ];

  // Passo 3 — a carta chega ao perito. Duas camadas: a linha de narrador que
  // abre o envelope (varia) e o corpo do constable (moldura varia; os FATOS
  // são estáveis — é o portador fair-play da informação).
  const CARTA_LACRE = [
    'O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.',
    'O envelope traz o carimbo do condado e a caligrafia aplicada, letra a letra desenhada.',
    'O papel é o do posto, pautado e barato; a tinta borra numa palavra ou outra, onde a mão pesou.',
  ];
  const CARTA_MOLDURA = [
    `"{detective.treatment} {detective.surname} — Escrevo-lhe como constable de ${vila}; isto é, o que faz as vezes de constable, que para tanto a vila não tem senão um homem. Escrevo do que não entendo.`,
    `"{detective.treatment} {detective.surname} — Perdoe a letra. Sou o constable de ${vila}, e isto passa do meu ofício.`,
    `"{detective.treatment} {detective.surname} — Vai o meu recado de ${vila}, à pressa. O que aqui houve pede olho de perito, não de guarda.`,
  ];
  const cartaFatos = `${vitima.nome}, ${profissaoExibida(vitima.profissao)}${vitima.forasteiro ? ', de passagem pela vila' : ' desta vila'}, foi ${femV ? 'achada morta' : 'achado morto'}. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; os que respondem pela vila pagam os seus honorários."`;

  // Passo 4 — a assinatura: o método. O perito itinerante arruma a maleta.
  const METODO = [
    'Onde quer que a carta o alcance, {detective.treatment} {detective.surname} arruma a maleta na ordem de sempre: a lente e a caderneta em cima, o termômetro de mercúrio embrulhado no lenço. A primeira página abre em branco.',
    'A caderneta abre numa página limpa antes de o trem partir. {detective.treatment} {detective.surname} confere a maleta e encaixa no lugar o termômetro de vidro trincado.',
    'Fechada a fivela, {detective.treatment} {detective.surname} desce para a estação. A maleta numa mão, a caderneta na outra, aberta na página ainda limpa.',
  ];

  // Passo 5 — a chegada à vila (primeira vista varia; não antecipa fato).
  const CHEGADA = [
    `A plataforma cheira a carvão e palha molhada. ${vila} estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados. O constable ${delegado} espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos.`,
    `O trem larga {detective.treatment} {detective.surname} num apeadeiro de tábua, e ${vila} começa logo ali, numa rua de lama e fachadas baixas. ${delegado} vem ao encontro, de chapéu na mão. "Agradeço a presteza. Explico-me pelo caminho."`,
    `Chove fino sobre ${vila} quando o trem chega. ${delegado} espera sob o beiral da estação e adianta-se assim que reconhece a maleta na mão {g:do perito|da perita}. "Venha comigo; falo enquanto andamos."`,
  ];

  // Passo 6 — o briefing à porta. A moldura varia; os fatos e as perguntas
  // (que plantam os coabitantes) são estáveis — portadores fair-play.
  const BRIEFING_FECHO = [
    'Detém-se à porta e baixa a voz. "Pergunte o que quiser antes de entrarmos; lá dentro, a perícia é {g:do senhor|da senhora}."',
    'Remexe o chapéu nas mãos e não avança. "O que eu puder dizer, digo aqui fora; confesso que lá dentro mais atrapalho do que ajudo."',
    'Fica um passo atrás da porta e faz sinal ao guarda que se afaste. "Pergunte-me o que precisar; depois eu saio da frente."',
  ];

  const passos = [
    {
      id: 'descoberta',
      titulo: `${vila}, 14 de outubro de 1893`,
      paragrafos: [escolher(DESCOBERTA[palcoChave], `descoberta|${palcoChave}`)],
      rotuloBotao: 'O constable é chamado',
    },
    {
      id: 'alarme',
      titulo: 'O constable manda chamar',
      paragrafos: [escolher(ALARME, 'alarme')],
      rotuloBotao: 'Ler a carta',
    },
    {
      id: 'carta',
      titulo: 'A carta do Constable',
      carta: true,
      paragrafos: [
        escolher(CARTA_LACRE, 'carta-lacre'),
        `${escolher(CARTA_MOLDURA, 'carta-moldura')} ${cartaFatos}`,
        `"${delegado}, Constable."`,
      ],
      rotuloBotao: 'Aceitar o chamado',
    },
    {
      id: 'metodo',
      titulo: 'A maleta pronta',
      paragrafos: [escolher(METODO, 'metodo')],
      rotuloBotao: 'Tomar o trem',
    },
    {
      id: 'chegada',
      titulo: vila,
      paragrafos: [escolher(CHEGADA, 'chegada')],
      rotuloBotao: 'Ouvir o constable',
    },
    {
      id: 'briefing',
      titulo: `O relato do constable ${delegado}`,
      briefing: true,
      paragrafos: [
        `"O essencial é isto: ${vitima.nome}, ${vitima.idade} anos, ${profissaoExibida(vitima.profissao)}. ${femV ? 'Achada morta' : 'Achado morto'} ${predioEm}. Não toquei em nada e não prendi ninguém."`,
        escolher(BRIEFING_FECHO, 'briefing-fecho'),
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
    nome: 'Harlan Blackwell',
    descricao:
      'Assistente de perito há dois anos; sem registro, sem laudo próprio. O que tem é o olho treinado do mestre e um termômetro emprestado com uma trinca que "não afeta a leitura".',
  },
];

// ---------------------------------------------------------------------
// O MONTADOR: gerarCasoBruto → pacote de caso completo e serializável.
// ---------------------------------------------------------------------
export function montarPacoteGerado(seed, opts = {}) {
  const bruto = gerarCasoBruto(seed, opts);
  const sal = bruto.seed;
  const cartas = realizarCartas(bruto);
  const suspeitos = montarSuspeitos(bruto);
  // v2 (playtest 16/jul): a peça de hora forjada e a camada de
  // periféricos entram no catálogo ANTES das localidades — a prosa
  // precisa dos ids para plantar os marcadores.
  const encenacao = cartaHoraForjada(bruto);
  if (encenacao) cartas.push(encenacao.carta);
  // E3 §4.5 — a AUSÊNCIA declarada nasce ANTES dos periféricos (o ausente
  // perde a corroboração grátis da vizinhança e não recebe segredo). A
  // elegibilidade espelha a do segredo: não é o réu, não é testemunha de
  // carta, não tem a cena por rotina na faixa.
  let ausenteId = null;
  // Veto do ramo diurno (parecer E3-2, A1): o livro de hóspedes corrobora
  // uma NOITE — a fala de dia não pernoita e o registro contradiria um
  // inocente. Criadagem residente também não pernoita fora (recolher da
  // casa; parecer do perito) — recai no penhor, como previsto na moeda.
  if (bruto.escolha.faixa !== 'dia' && hashDecisao(`${bruto.seed}|caso|comarca-funcao`) % 10 === 1) {
    const pessoasAus = indicePorId(bruto.mundo.elenco);
    const testemunhasAus = new Set(cartas.map((c) => c.origemTestemunha).filter(Boolean));
    const candidatosAus = suspeitos.filter((s) => {
      const p = pessoasAus.get(s.id);
      return (
        p &&
        s.id !== bruto.crime.assassinoId &&
        p.classeSocial !== 'criadagem' &&
        !testemunhasAus.has(s.id) &&
        p.pacoteEspacial.rotina[bruto.escolha.faixa] !== bruto.escolha.localId
      );
    });
    if (candidatosAus.length > 0)
      ausenteId = candidatosAus[hashDecisao(`${bruto.seed}|caso|comarca-ausente`) % candidatosAus.length].id;
  }
  const perif = derivarPerifericos({ bruto, suspeitos, cartas, ausenteId });
  cartas.push(...perif.cartasNovas);
  // E3: a comarca do caso — o registro durável a distância e o seu lead.
  const comarcaDoCaso = derivarComarcaDoCaso({ bruto, ausenteId });
  if (comarcaDoCaso) cartas.push(...comarcaDoCaso.cartasNovas);
  // OS da vila na mesa: as casas do interrogatório e o ponto de encontro.
  const casasDoCaso = derivarCasasDoCaso(bruto, suspeitos);
  const localidades = montarLocalidades(bruto, cartas, casasDoCaso);
  if (comarcaDoCaso) {
    localidades.push(comarcaDoCaso.localidade);
    // O fio despacha da delegacia (o expediente pede à estação): a ação
    // especial segue o mesmo canal do termômetro — camada de UI.
    const delegaciaLoc = localidades.find((l) => l.id === 'delegacia');
    if (delegaciaLoc) delegaciaLoc.acoesEspeciais = [...delegaciaLoc.acoesEspeciais, 'telegrafo'];
  }
  const { nosMapa, custos, leads } = montarMapa(localidades, comarcaDoCaso, casasDoCaso);
  const maquete = derivarMaquete({ bruto, nosMapa, casasDoCaso });
  const abertura = montarAbertura(bruto, sal, suspeitos);
  // A árvore de diálogo procedural (OS própria): uma árvore por suspeito,
  // embutida na delegacia, + as cartas de álibi que os beats sustentam.
  // As cartas de álibi entram no FIM do catálogo (ordem estável, replay);
  // o marcador delas vive nas falas da árvore, não na prosa de localidade.
  // Os segredos dos periféricos chegam ao derivador: quem os guarda
  // declara a moradia (a mentira de vergonha que o rastro desmente).
  const ausencias =
    ausenteId && comarcaDoCaso ? { [ausenteId]: comarcaDoCaso.satelite.rotulo } : {};
  const instrumentoDoMetodo = METODOS[bruto.crime.metodoId]?.instrumento || null;
  const { dialogos, cartasAlibi } = derivarDialogos({ bruto, cartas, suspeitos, segredos: perif.segredos, ausencias, acessorId: perif.acessorId, instrumento: instrumentoDoMetodo, marcasCorporais: bruto.marcasCorporais || {}, localidadeInterrogatorio: casasDoCaso.porSuspeito });
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
    // v2: o pilar de descuidos só é exigido quando a peça de hora forjada
    // existe (ver cabeçalho); o de julgar inocentes, sempre que há
    // não-acusados — os dois pilares do caso-escola, de volta ao gerado.
    cenaEncenada: !!encenacao,
    horaForjada: encenacao ? encenacao.horaForjada : null,
    // Lote 3: distingue a peça encenada (mostrador vs temperatura do corpo)
    // para a fala do desfecho ramificar sem cravar "relógio".
    encenacaoInstrumento: encenacao ? encenacao.instrumento : null,
    perifericos: perif.perifericos,
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
      // E2: palco externo tem descoberta própria e chegada mais cedo
      // (caso.js §4.6); o interno usa a fonte única da ponte (A3).
      horasChegada: bruto.escolha.palco?.externo ? bruto.escolha.palco.descoberta.chegadaPerito : HORAS_CHEGADA_INTERNO,
      ambiente: AMBIENTE_PADRAO,
      calendario: { ...CALENDARIO_PADRAO },
    },
    // Camada VISUAL opcional (o motor jamais a lê — guarda GE3): a maquete
    // da vila gerada, no schema do DioramaVila. Sem ela, grade 2D.
    maquete,
    ...(comarcaDoCaso ? { telegrama: comarcaDoCaso.telegrama } : {}),
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
    encena: !!cartaHoraForjada(bruto),
  };
}
