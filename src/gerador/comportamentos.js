// =====================================================================
// COMPORTAMENTOS DE DIÁLOGO — catálogo fechado do gerador (FASE 1 do
// gerador por simulação; design em docs/game-design-simulacao.md §3.1).
//
// Este arquivo é DADO PURO e GERADOR-FACING: vive em src/gerador/ e o
// runtime JAMAIS o importa (guarda no qa.mjs). Um comportamento é a forma
// QUANTIZADA de um atributo ou trait — nada de modificador contínuo
// invisível: cada entrada declara um efeito autorável e testável sobre o
// depoimento, que as fases futuras (3+) consumirão ao redigir prosa e
// montar contradições. A fantasia-alvo: o jogador aprende a tratar
// pessoas como instrumentos de medição com margens de erro diferentes.
//
// `efeitoDepoimento` é especificação declarativa (JSON puro), não código:
// descreve O QUE o comportamento faz com a informação, para o autor da
// prosa e para os lints — nunca é lido pelo motor de veredicto.
// =====================================================================

export const CATALOGO_COMPORTAMENTOS = {
  // --- nascidos de TRAIT (um para um, via MAPA_TRAIT_COMPORTAMENTO) ---
  omite_ate_confianca: {
    descricao: 'Medroso: retém o que sabe até ganhar confiança ou proteção.',
    efeitoDepoimento: { tipo: 'omissao_condicional', condicaoLiberacao: 'confianca_ou_protecao' },
  },
  ruido_com_pepitas: {
    descricao: 'Tagarela: depoimento longo, com pepitas verdadeiras enterradas em irrelevância.',
    efeitoDepoimento: { tipo: 'ruido', pepitasVerdadeiras: true },
  },
  instrumento_confiavel: {
    descricao: 'Preciso: horários e detalhes exatos — instrumento de medição confiável.',
    efeitoDepoimento: { tipo: 'precisao_de_detalhe', margemErroMinutos: 5 },
  },
  erro_sistematico_tempo: {
    descricao:
      'Linha do tempo não confiável (ex.: embriaguez): erra sempre na mesma direção — refutável por cruzamento.',
    efeitoDepoimento: { tipo: 'vies_temporal', desvio: 'sistematico' },
  },

  // --- nascidos de LIMIAR de atributo (quantizacao.js) ---
  observacao_precisa: {
    descricao: 'WIS alta: o que observou é fiável, margem de erro estreita.',
    efeitoDepoimento: { tipo: 'acuracia', margem: 'estreita' },
  },
  observacao_vaga: {
    descricao: 'WIS baixa: observou por alto — margem de erro larga.',
    efeitoDepoimento: { tipo: 'acuracia', margem: 'larga' },
  },
  revela_facil: {
    descricao: 'CHA alta: disposto a falar — revela muito, cedo e barato.',
    efeitoDepoimento: { tipo: 'disposicao', custoRevelacao: 'baixo' },
  },
  revela_sob_custo: {
    descricao: 'CHA baixa: cada informação tem preço — resistência ao interlocutor.',
    efeitoDepoimento: { tipo: 'disposicao', custoRevelacao: 'alto' },
  },
};

// Ordem canônica (ordem de declaração do catálogo): a quantização devolve
// os comportamentos SEMPRE nesta ordem, para replay estável byte a byte.
export const ORDEM_COMPORTAMENTOS = Object.keys(CATALOGO_COMPORTAMENTOS);

// ---------------------------------------------------------------------
// TRAITS — os quatro traits canônicos de NPC periférico (§3.1 do design).
// Todo trait DEVE mapear a um comportamento do catálogo fechado: trait
// sem comportamento = trait órfão = falha de lint no qa.mjs.
// ---------------------------------------------------------------------
export const TRAITS = {
  medroso: { descricao: 'Omite informação até ganhar confiança ou proteção.' },
  tagarela: { descricao: 'Mistura ruído com pepitas verdadeiras.' },
  preciso: { descricao: 'Horários e detalhes exatos; memória de registro.' },
  linha_tempo_nao_confiavel: { descricao: 'Depoimento com erro sistemático de tempo (ex.: bebida).' },
};

export const MAPA_TRAIT_COMPORTAMENTO = {
  medroso: 'omite_ate_confianca',
  tagarela: 'ruido_com_pepitas',
  preciso: 'instrumento_confiavel',
  linha_tempo_nao_confiavel: 'erro_sistematico_tempo',
};
