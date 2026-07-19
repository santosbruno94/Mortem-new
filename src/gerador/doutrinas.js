// =====================================================================
// DOUTRINAS DE BATALHA — OS autobattler v2, B2 (o coração do pedido).
//
// "Cada parte toma sempre a mesma escolha": a política de ação por
// estado é DETERMINÍSTICA E PURA — função só do estado da rodada, sem
// UM sal de hash (lint GB3: este arquivo não importa hash.js; fuzz de
// ≥10⁴ estados prova mesma entrada ⇒ mesma ação). Só a RESOLUÇÃO da
// ação rola dados (crime.js, B3: acerto, dano, alvo-região,
// incidental). Consequência de design: a escolha é reconstruível de
// trás para frente pelo jogador — "ferida, porta longe, atiçador ao
// alcance: ela fez o que faria".
//
// Este arquivo é DADO+FUNÇÃO PURA e GERADOR-FACING: vive em
// src/gerador/ e o runtime JAMAIS o importa (guarda no qa.mjs).
//
// A tabela legível (entregável-portão de B2, aprovação do autor antes
// de B3) é GERADA deste dado: scripts/gerar-tabela-doutrinas.mjs →
// docs/os-autobattler-v2-doutrinas-tabela.md — identidade código↔doc.
//
// ---------------------------------------------------------------------
// O ESTADO (contrato com o resolvedor de B3; JSON puro):
//   {
//     rodada,
//     eu:    { regioes, agarre, arma, celula },
//     outro: { regioes, arma, celula },
//     forPropria, forOutro,             // FOR 1–5 (relativa, não absoluta)
//     portao,                            // vítima: {sobAtaque, polaridade}; assassino: null
//     metodo,                            // o método do assassino (dados de metodos.js)
//     dist:  { aoOutro, aSaida, aPeca }, // distâncias JÁ cientes de bloqueio (BFS, D1=a);
//                                        //   Infinity = inalcançável
//     pecaBloqueiaEntreNos,              // há peça `bloqueia` interponível (D1=a)
//     gritou,                            // o grito já foi gasto (1× por batalha)
//     trocaElegivel,                     // B4 (gated): o método falhou e a doutrina
//                                        //   do assassino pode trocar
//     flags: { forcarVitoria, fugaSuprimida }, // gates de LEGALIDADE — as
//                                        //   pré-condições os leem; as linhas de
//                                        //   doutrina JAMAIS (pureza doutrinária)
//   }
// Regiões (D2=b, cinco): bracos | maos | pernas | cabeca | tronco,
// cada uma 'integro' | 'ferido' | 'inutilizado'. Consequências duras:
// braços OU mãos inutilizados ⇒ não apara nem se arma; pernas
// inutilizadas ⇒ não foge. O agarre ('presa' | 'livre') substitui o
// seguraAVitima-como-sentença: o desvencilhar existe, e a vítima que se
// solta do garrote FOGE ou SE ARMA como qualquer outra.
// =====================================================================

// ---------------------------------------------------------------------
// Predicados auxiliares (puros; vocabulário das pré-condições e linhas).
// ---------------------------------------------------------------------
const adjacente = (e) => e.dist.aoOutro <= 1;
const armadaDePeca = (e) => e.eu.arma?.tipo === 'peca';
const bracosServem = (e) => e.eu.regioes.bracos !== 'inutilizado' && e.eu.regioes.maos !== 'inutilizado';
const pernasServem = (e) => e.eu.regioes.pernas !== 'inutilizado';
const pecaAoAlcance = (e) => e.dist.aPeca <= 1;
const ferida = (e) => Object.values(e.eu.regioes).some((r) => r !== 'integro');

// O canal `sobAtaque` do vetor psíquico, promovido de peso a REGRA DE
// DESEMPATE CAUSAL (a OS §3.4): decide qual linha da tabela captura o
// estado ambíguo — nunca rola dado. A polaridade desempata o vetor
// neutro; o vetor explícito vence a polaridade.
const prefereResistir = (e) =>
  (e.portao?.sobAtaque?.resistir ?? 0) >= 1 ||
  (e.portao?.polaridade === 'ativa' && (e.portao?.sobAtaque?.fugir ?? 0) < 1);
const prefereFugir = (e) =>
  (e.portao?.sobAtaque?.fugir ?? 0) >= 1 ||
  (e.portao?.polaridade === 'passiva' && (e.portao?.sobAtaque?.resistir ?? 0) < 1);
const forRelativaAlta = (e) => e.forPropria >= e.forOutro;
const saidaMaisPertoQuePeca = (e) => e.dist.aSaida <= e.dist.aPeca;

// ---------------------------------------------------------------------
// CATÁLOGO FECHADO DE AÇÕES — cada ação declara pré-condições e a sua
// CLASSE DE VESTÍGIO diferencial (a matriz ação→vestígio é este dado;
// ação sem rastro não entra — regra de existência §2.3, lint GB4).
// `papel`: quem pode tomá-la. `rolagemParalela`: não é escolha da
// doutrina — rolagem independente do resolvedor (o grito de sempre).
// ---------------------------------------------------------------------
export const CATALOGO_ACOES = {
  golpear_metodo: {
    papel: 'assassino',
    rotulo: 'Golpear com o método',
    precondicao: (e) => adjacente(e) && e.eu.arma?.tipo === 'metodo',
    classeVestigio: 'ferida_fatal',
    rastro: 'a lesão do método, com sede na região-alvo (B3)',
  },
  golpear_improvisado: {
    papel: 'ambos',
    rotulo: 'Golpear com a peça improvisada',
    precondicao: (e) => armadaDePeca(e) && adjacente(e) && bracosServem(e),
    classeVestigio: 'lesao_padrao_de_peca',
    rastro: 'a lesão com o padrão da peça no atingido + resíduo na peça (o sangue no castiçal)',
  },
  armar_se: {
    papel: 'ambos',
    rotulo: 'Armar-se (tomar a peça)',
    precondicao: (e) => !armadaDePeca(e) && pecaAoAlcance(e) && bracosServem(e),
    classeVestigio: 'peca_deslocada',
    rastro: 'a peça fora do lugar (o atiçador fora do jogo de ferros) + a assinatura dela em quem apanhar',
  },
  desvencilhar: {
    papel: 'vitima',
    rotulo: 'Desvencilhar-se do agarre',
    precondicao: (e) => e.eu.agarre === 'presa' && bracosServem(e),
    classeVestigio: 'ungueais_de_desvencilhamento',
    rastro: 'escoriações ungueais no próprio pescoço + fibras/pele sob as unhas (o caso-escola do garrote falho)',
  },
  aparar: {
    papel: 'vitima',
    rotulo: 'Aparar o golpe',
    precondicao: (e) => e.eu.agarre === 'livre' && adjacente(e) && bracosServem(e),
    classeVestigio: 'ferimentos_defensivos',
    rastro: 'ferimentos defensivos com sede: antebraços (aparar) e palmas (agarrar a lâmina) — D2=b',
  },
  interpor: {
    papel: 'vitima',
    rotulo: 'Interpor a peça (a mesa entre os dois)',
    precondicao: (e) => e.eu.agarre === 'livre' && e.pecaBloqueiaEntreNos && bracosServem(e),
    classeVestigio: 'peca_deslocada',
    rastro: 'a peça girada/arrastada fora do seu assento (detalhe: interposta)',
  },
  fugir: {
    papel: 'vitima',
    rotulo: 'Fugir rumo à saída',
    precondicao: (e) =>
      e.eu.agarre === 'livre' && pernasServem(e) && Number.isFinite(e.dist.aSaida) && !e.flags.forcarVitoria && !e.flags.fugaSuprimida,
    classeVestigio: 'trilha_gotejamento',
    rastro: 'trilha de gotejamento + esfregaço de limiar + lesões de sítio posterior (o preço da fuga, vigente)',
  },
  gritar: {
    papel: 'vitima',
    rolagemParalela: true, // resolução de alcance de voz, não escolha (desenho vigente)
    rotulo: 'Gritar (rolagem paralela)',
    precondicao: (e) =>
      !e.gritou && e.eu.agarre === 'livre' && !e.flags.forcarVitoria && !e.flags.fugaSuprimida,
    classeVestigio: 'grito_ouvido',
    rastro: 'grito com hora própria, audível aos adjacentes (regra de existência vigente)',
  },
  perseguir: {
    papel: 'assassino',
    rotulo: 'Perseguir / reposicionar',
    precondicao: (e) => !adjacente(e),
    classeVestigio: 'rastro_da_luta',
    rastro: 'a luta que anda: rastro em mais de um ponto, mobília tombada no caminho',
  },
};

// ---------------------------------------------------------------------
// AÇÕES LEGAIS: filtra o catálogo por papel + pré-condição. As flags de
// réplica/desespero agem AQUI (legalidade), nunca nas linhas de doutrina.
// ---------------------------------------------------------------------
export function acoesLegais(papel, estado) {
  return Object.entries(CATALOGO_ACOES)
    .filter(([, a]) => (a.papel === 'ambos' || a.papel === papel) && !a.rolagemParalela)
    .filter(([, a]) => a.precondicao(estado))
    .map(([id]) => id);
}

// ---------------------------------------------------------------------
// AS DOUTRINAS — tabela de prioridades por papel: a PRIMEIRA linha cuja
// condição casa E cuja ação é legal vence. Campo `porque` alimenta o
// doc-tabela (a explicação que o jogador reconstruirá de trás para
// frente). Exemplo normativo do autor (garrote premeditado, FOR da
// vítima alta): sobrevive à surpresa → presa → v1 desvencilhar →
// sucesso → livre/ferida/ativa/atiçador a 1 célula → v4 armar-se →
// v2 golpear — não fugir.
// ---------------------------------------------------------------------
export const DOUTRINA_VITIMA = [
  { id: 'v1', acao: 'desvencilhar', se: () => true,
    porque: 'presa: soltar-se é a única ação que muda o estado — o desvencilhar existe' },
  { id: 'v2', acao: 'golpear_improvisado', se: () => true,
    porque: 'armada e ao alcance: quem tomou a peça usa a peça' },
  { id: 'v3', acao: 'fugir', se: (e) => armadaDePeca(e) && !adjacente(e) && prefereFugir(e),
    porque: 'armada mas longe, e o corpo pede a porta: corre armada' },
  { id: 'v4', acao: 'armar_se', se: (e) => prefereResistir(e),
    porque: 'o vetor psíquico resolve o empate: quem resiste toma a peça (sobAtaque.resistir / polaridade ativa)' },
  { id: 'v5', acao: 'armar_se', se: (e) => forRelativaAlta(e) && !prefereFugir(e),
    porque: 'FOR relativa alta sem pendor de fuga: enfrenta com o que a sala oferece' },
  { id: 'v6', acao: 'fugir', se: (e) => prefereFugir(e),
    porque: 'o vetor psíquico resolve o empate: quem foge corre à saída (sobAtaque.fugir / polaridade passiva)' },
  { id: 'v7', acao: 'fugir', se: (e) => saidaMaisPertoQuePeca(e),
    porque: 'a porta está mais perto que a peça: o corpo neutro escolhe o mais próximo' },
  { id: 'v8', acao: 'armar_se', se: () => true,
    porque: 'porta longe, atiçador ao alcance: ela fez o que faria — arma-se (o exemplo normativo)' },
  { id: 'v9', acao: 'fugir', se: () => true,
    porque: 'default do corpo livre sem peça alcançável: a saída' },
  { id: 'v10', acao: 'interpor', se: (e) => ferida(e),
    porque: 'não alcança a porta nem peça de mão, mas há a mesa: interpõe e ganha rodadas' },
  { id: 'v11', acao: 'aparar', se: () => true,
    porque: 'resta resistir: apara com antebraços e palmas' },
];

export const DOUTRINA_ASSASSINO = [
  { id: 'a1', acao: 'golpear_improvisado', se: () => true,
    porque: 'trocou de arma (B4): termina com o que tem na mão' },
  { id: 'a2', acao: 'armar_se', se: (e) => e.trocaElegivel === true,
    porque: 'B4 (gated): o método falhou, ele está ferido e a peça está ao alcance — troca' },
  { id: 'a3', acao: 'perseguir', se: () => true,
    porque: 'fora de alcance: fecha a distância (a perseguição curta cabe no grid)' },
  { id: 'a4', acao: 'golpear_metodo', se: () => true,
    porque: 'ao alcance, com o método na mão: golpeia' },
];

// ---------------------------------------------------------------------
// A DOUTRINA — pura, total, zero sal. Percorre a tabela do papel;
// devolve a primeira ação LEGAL cuja condição casa; null quando nenhuma
// ação é legal (a rodada de surpresa, o corpo sem braços: o resolvedor
// registra a inação, que não é ação do catálogo).
// ---------------------------------------------------------------------
export function doutrina(papel, estado) {
  const legais = new Set(acoesLegais(papel, estado));
  if (legais.size === 0) return null;
  const tabela = papel === 'vitima' ? DOUTRINA_VITIMA : DOUTRINA_ASSASSINO;
  for (const linha of tabela) {
    if (legais.has(linha.acao) && linha.se(estado)) return linha.acao;
  }
  return null;
}

// Proveniência das decisões desta tabela (modelo das tabelas irmãs).
export const PROVENIENCIA_DOUTRINAS = {
  politicaPura:
    'docs/os-autobattler-v2-doutrinas.md §3 (escolha é função pura do estado; só a resolução rola dados; sobAtaque promovido de peso a causa)',
  capacidadeResidual:
    'docs/kb-medicina-legal/traumas.md ("capacidade de ação depois da lesão": a tese de Taylor licencia a vítima ferida que ainda age)',
  regioes:
    'docs/kb-medicina-legal/traumas.md (feridas de aparar em antebraços e palmas; lesões de sítio posterior) — D2=b, cinco regiões',
};
