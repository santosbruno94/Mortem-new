// =====================================================================
// MÉTODOS DE CRIME E TIPOS DE CENÁRIO — catálogo fechado da FASE 3 do
// gerador por simulação (design em docs/game-design-simulacao.md §2).
//
// Este arquivo é DADO PURO e GERADOR-FACING: vive em src/gerador/ e o
// runtime JAMAIS o importa (guarda no qa.mjs). Cada método declara os
// parâmetros que o autobattler consome (surpresa, dano, ruído) e o SINAL
// de assinatura do catálogo universal de causas
// (src/data/catalogo_causas.js) que a ferida fatal deposita — é por esse
// sinal que o motor forense existente, sem uma linha alterada, crava o
// mecanismo. Proveniência por linha, como nas tabelas das Fases 1–2.
//
// Iniciativa e surpresa (§2.2): premeditação × método definem o primeiro
// golpe. Veneno SUPRIME a batalha; garrote/faca pelas costas dá golpe
// esmagador; a briga que escalou é confronto simétrico sem surpresa — e
// um TIPO DE CENÁRIO próprio, sem vestígios de planejamento.
// =====================================================================

// Os dois tipos de cenário do design (§2.2). A briga escalada não admite
// método que exija preparo e não gera vestígio de planejamento.
export const CENARIOS = {
  premeditado: {
    rotulo: 'Crime premeditado',
    descricao: 'Método escolhido com antecedência; a surpresa é do assassino.',
  },
  briga_escalada: {
    rotulo: 'Briga que escalou',
    descricao:
      'Confronto simétrico, sem surpresa nem planejamento; a arma é de ocasião e o motivo, imediato.',
  },
};

// ---------------------------------------------------------------------
// MÉTODOS v1. Campos lidos pelo autobattler:
//   surpresa        : dano extra do 1º golpe quando premeditado (0 = nenhum).
//   danoBase        : dano por golpe (a vítima tem 2 + 2×FOR pontos de vida).
//   ruidoPorRodada  : ruído somado a cada rodada de confronto.
//   suprimeBatalha  : true = não há confronto (veneno) — vitória sem rodadas.
//   sangra          : o método derrama sangue (governa poça, pegada, esfrega).
//   exigePremeditacao : método impossível numa briga escalada.
//   intMinima       : INT mínima do assassino para o método ser elegível
//                     (elaboração do método é INT, §3.1 — nunca higiene).
//   instrumento     : id do instrumento típico (vira vestígio de presença).
//   sinalAssinatura : sinal do catálogo universal depositado pela lesão fatal.
//   mecanismo       : causa correspondente (verdadeDeOuro.mecanismoCorreto).
// ---------------------------------------------------------------------
export const METODOS = {
  laminada: {
    rotulo: 'Arma branca',
    surpresa: 3,
    danoBase: 2,
    ruidoPorRodada: 1,
    suprimeBatalha: false,
    sangra: true,
    exigePremeditacao: false,
    intMinima: 1,
    instrumento: 'lamina_de_oficio',
    sinalAssinatura: 'ferida_incisa',
    mecanismo: 'ferida_arma_branca',
    proveniencia: 'docs/kb-medicina-legal/traumas.md (feridas incisas e perfuro-cortantes; ferimentos defensivos)',
  },
  garrote: {
    rotulo: 'Garrote (ligadura)',
    surpresa: 3,
    danoBase: 2,
    ruidoPorRodada: 0, // o laço cala; o ruído de garrote é só o da luta
    suprimeBatalha: false,
    sangra: false,
    exigePremeditacao: true, // laço preparado = premeditação
    intMinima: 2,
    instrumento: 'cordao_torcido',
    sinalAssinatura: 'sulco_horizontal',
    mecanismo: 'estrangulamento_ligadura',
    proveniencia: 'docs/kb-medicina-legal/asfixias.md (sulco horizontal de ligadura × sulco oblíquo)',
  },
  esganadura: {
    rotulo: 'Estrangulamento manual',
    surpresa: 2,
    danoBase: 1, // matar com as mãos é lento: a briga longa é do método
    ruidoPorRodada: 1,
    suprimeBatalha: false,
    sangra: false,
    exigePremeditacao: false,
    intMinima: 1,
    instrumento: null, // as mãos não se abandonam na cena
    sinalAssinatura: 'equimoses_digitais',
    mecanismo: 'estrangulamento_manual',
    proveniencia: 'docs/kb-medicina-legal/asfixias.md (equimoses digitais e marcas ungueais da esganadura)',
  },
  contundente: {
    rotulo: 'Golpe contuso',
    surpresa: 2,
    danoBase: 2,
    ruidoPorRodada: 2, // pancada e queda: o método barulhento
    suprimeBatalha: false,
    sangra: true,
    exigePremeditacao: false,
    intMinima: 1,
    instrumento: 'arma_de_ocasiao', // castiçal, atiçador — o que a mão achou
    sinalAssinatura: 'ferida_contusa',
    mecanismo: 'trauma_contuso',
    proveniencia: 'docs/kb-medicina-legal/traumas.md (ferida contusa e fratura por instrumento rombo)',
  },
  veneno_arsenico: {
    rotulo: 'Envenenamento por arsênico',
    surpresa: 0,
    danoBase: 0,
    ruidoPorRodada: 0,
    suprimeBatalha: true, // não há confronto: a batalha é suprimida (§2.2)
    sangra: false,
    exigePremeditacao: true,
    intMinima: 3, // aquisição e dosagem pedem método elaborado
    instrumento: 'papel_de_arsenico',
    sinalAssinatura: 'odor_alho',
    mecanismo: 'envenenamento_arsenico',
    proveniencia: 'docs/kb-medicina-legal/venenos.md (arsênico: aquisição registrada em livro de venenos, odor aliáceo)',
  },
};

// Métodos possíveis por cenário e INT do assassino (elegibilidade pura;
// o sorteio em caso.js escolhe entre os elegíveis). Ordem estável de
// declaração — o replay depende dela.
export function metodosElegiveis(cenario, intAssassino) {
  return Object.keys(METODOS).filter((id) => {
    const m = METODOS[id];
    if (cenario === 'briga_escalada' && m.exigePremeditacao) return false;
    return intAssassino >= m.intMinima;
  });
}

export const PROVENIENCIA_METODOS = {
  cenarios:
    'docs/kb-medicina-legal/inquerito-e-policia.md (crime doméstico e briga de ocasião × crime planejado no inquérito de 1893)',
  parametrosBatalha:
    'docs/kb-medicina-legal/traumas.md e asfixias.md (duração e ruído relativos dos meios; a esganadura é lenta, a pancada é ruidosa)',
};
