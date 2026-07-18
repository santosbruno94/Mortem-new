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
//
// PORTÃO FÍSICO DA FUGA (OS confronto estendido §4.4):
//   seguraAVitima      : bool — o método PRENDE a vítima enquanto aplicado
//                        (laço, mão, cabeça sob água). Enquanto prende,
//                        fugir e gritar têm peso 0; resta resistir.
//   mobilidadeResidual : 0–2 — fator de decaimento do peso de fugir
//                        conforme ferimentosVitima (só nos métodos que
//                        NÃO seguram e NÃO suprimem a batalha). null quando
//                        irrelevante (segura a vítima ou suprime a batalha).
//   exigeAncora        : id de âncora espacial exigida ('agua' p/ afogamento)
//                        ou null. A elegibilidade por âncora é checada em
//                        caso.js (D2: afogamento só na cena com água).
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
    seguraAVitima: false,
    mobilidadeResidual: 2, // sangra, mas não prende: a fuga decai devagar
    regiaoAlvo: 'tronco', // OS autobattler v2 (B3): a região que o método busca
    sedeFatal: 'torax', // a sede do laudo (∈ SEDES_POR_REGIAO da regiaoAlvo)
    exigeAncora: null,
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
    seguraAVitima: true, // o laço cala e prende: fugir e gritar peso 0
    mobilidadeResidual: null,
    regiaoAlvo: 'cabeca',
    sedeFatal: 'pescoco',
    exigeAncora: null,
    proveniencia: 'docs/kb-medicina-legal/asfixias.md (sulco horizontal de ligadura × sulco oblíquo; a ligadura mantida anula a ação — capacidade de ação pós-lesão)',
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
    seguraAVitima: true, // a mão no pescoço prende: fugir e gritar peso 0
    mobilidadeResidual: null,
    regiaoAlvo: 'cabeca',
    sedeFatal: 'pescoco',
    exigeAncora: null,
    proveniencia: 'docs/kb-medicina-legal/asfixias.md (equimoses digitais e marcas ungueais da esganadura; a compressão cervical mantida anula a ação)',
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
    seguraAVitima: false,
    mobilidadeResidual: 0, // trauma craniano: a fuga decai rápido após o 1º golpe
    regiaoAlvo: 'cabeca',
    sedeFatal: 'tempora',
    exigeAncora: null,
    proveniencia: 'docs/kb-medicina-legal/traumas.md (ferida contusa e fratura por instrumento rombo; trauma craniano com inconsciência suprime a ação)',
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
    seguraAVitima: false,
    mobilidadeResidual: null, // suprimeBatalha: não há ação a decair
    regiaoAlvo: null,
    sedeFatal: null,
    exigeAncora: null,
    proveniencia: 'docs/kb-medicina-legal/venenos.md (arsênico: aquisição registrada em livro de venenos, odor aliáceo)',
  },

  // ============ MÉTODOS NOVOS — OS confronto estendido (§4.2, §8.1) ============
  sufocacao: {
    rotulo: 'Sufocação',
    surpresa: 2, // arma de ocasião: sem o golpe esmagador do garrote preparado
    danoBase: 1, // abafar é lento, como a esganadura
    ruidoPorRodada: 1,
    suprimeBatalha: false,
    sangra: false,
    exigePremeditacao: false, // travesseiro/pano à mão: arma de ocasião doméstica
    intMinima: 1,
    instrumento: 'travesseiro_ou_pano', // abandonável na cena
    sinalAssinatura: 'oclusao_vias',
    mecanismo: 'sufocacao',
    seguraAVitima: true, // a mão/pano abafa: fugir e gritar peso 0 enquanto aplicado
    mobilidadeResidual: 1, // intermediária (só conta se a vítima se solta entre aplicações)
    regiaoAlvo: 'cabeca',
    sedeFatal: 'face',
    exigeAncora: null,
    proveniencia: 'docs/kb-medicina-legal/asfixias.md (sufocação: escoriações periorais, sem sulco; a asfixia mais pobre em sinais — Taylor)',
  },
  afogamento: {
    rotulo: 'Afogamento',
    surpresa: 3, // a cabeça empurrada sob a água de súbito
    danoBase: 2, // golpe único contextual: resolve depressa
    ruidoPorRodada: 1,
    suprimeBatalha: false,
    sangra: false,
    exigePremeditacao: false, // pode escalar de uma briga junto à água
    intMinima: 1,
    instrumento: null, // a água/cocho não se leva da cena
    sinalAssinatura: 'agua_pulmoes',
    mecanismo: 'afogamento',
    seguraAVitima: true, // a cabeça sob a água prende: fugir e gritar peso 0
    mobilidadeResidual: null,
    regiaoAlvo: 'tronco',
    sedeFatal: 'torax',
    exigeAncora: 'agua', // D2: só na cena com água alcançável (o cocho da forja)
    proveniencia: 'docs/kb-medicina-legal/asfixias.md (afogamento: cogumelo de espuma, enfisema aquoso de Casper; submersão em vida)',
  },
  laudano: {
    rotulo: 'Láudano em dose excessiva',
    surpresa: 0,
    danoBase: 0,
    ruidoPorRodada: 0,
    suprimeBatalha: true, // veneno: não há confronto (§2.2)
    sangra: false,
    exigePremeditacao: true, // preparar a dose no soporífero = premeditação
    intMinima: 2, // venda livre na botica: menos elaborado que o arsênico
    instrumento: 'frasco_de_laudano',
    sinalAssinatura: 'miose_opiacea',
    mecanismo: 'envenenamento_laudano',
    seguraAVitima: false,
    mobilidadeResidual: null, // suprimeBatalha
    regiaoAlvo: null,
    sedeFatal: null,
    exigeAncora: null,
    proveniencia: 'docs/kb-medicina-legal/venenos.md (ópio e láudano: miose em ponta de alfinete, depressão respiratória; venda livre em 1893) — D1 do usuário',
  },
};

// Métodos possíveis por cenário, INT do assassino e ÂNCORAS espaciais
// disponíveis na cena (elegibilidade pura; o sorteio em caso.js escolhe
// entre os elegíveis). Ordem estável de declaração — o replay depende dela.
// `ancorasDisponiveis` é um Set de ids de âncora presentes no interior da
// cena (ex.: 'agua' quando há cocho/tanque alcançável — D2). Método com
// `exigeAncora` só entra se a âncora estiver presente; sem o argumento,
// o comportamento é o de sempre para os métodos sem âncora.
export function metodosElegiveis(cenario, intAssassino, ancorasDisponiveis = null) {
  return Object.keys(METODOS).filter((id) => {
    const m = METODOS[id];
    if (cenario === 'briga_escalada' && m.exigePremeditacao) return false;
    if (m.exigeAncora && !(ancorasDisponiveis && ancorasDisponiveis.has(m.exigeAncora))) return false;
    return intAssassino >= m.intMinima;
  });
}

export const PROVENIENCIA_METODOS = {
  cenarios:
    'docs/kb-medicina-legal/inquerito-e-policia.md (crime doméstico e briga de ocasião × crime planejado no inquérito de 1893)',
  parametrosBatalha:
    'docs/kb-medicina-legal/traumas.md e asfixias.md (duração e ruído relativos dos meios; a esganadura é lenta, a pancada é ruidosa)',
};
