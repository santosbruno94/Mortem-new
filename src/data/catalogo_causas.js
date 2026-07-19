// =====================================================================
// CATÁLOGO UNIVERSAL DE CAUSAS DE MORTE — igual para todo caso.
//
// O caso (seed) NÃO traz lista de causas: ele só espalha pistas físicas
// (cartas) que carregam um SINAL nas tagsOcultas. Este catálogo é o
// espaço completo de causas que o jogo conhece; o jogador crava a causa
// por ELIMINAÇÃO, conforme os sinais discriminantes que extraiu.
//
// REGRA DE DEDUÇÃO (universal, lida pelo motor — ver causasCompativeis):
//   • Um sinal de FAMÍLIA (ex.: petéquias → asfixia) descarta as causas
//     de outras famílias, mas não diz QUAL causa dentro da família.
//   • Um sinal de ASSINATURA (ex.: sulco horizontal → ligadura) confirma
//     uma única causa e descarta todas as demais.
//   • Um sinal MODIFICADOR (ex.: reação vital) não elimina nada.
// Juntar sinais estreita o leque; uma pista só o deixa aberto.
//
// Os nomes/textos são camada narrativa. O motor só lê os ids (§6).
// =====================================================================

// ---------------------------------------------------------------------
// 1) Vocabulário de SINAIS que o jogo reconhece.
//    Cada carta causal de qualquer caso carrega `tagsOcultas.sinal` = um id daqui.
//    - familia: presente nos sinais que apenas apontam a família (não a causa).
//    - confirmaCausa: presente nos sinais-assinatura (apontam uma única causa).
//    - modificador: true nos sinais que não eliminam causa alguma.
// ---------------------------------------------------------------------
export const SINAIS = [
  {
    id: 'petequias_cianose',
    rotulo: 'Petéquias e cianose',
    descricao: 'Pontos vermelhos nas conjuntivas e face azulada: morte por asfixia, sem dizer o meio.',
    familia: 'asfixia',
  },
  {
    id: 'sulco_horizontal',
    rotulo: 'Sulco cervical horizontal',
    descricao: 'Marca uniforme e horizontal no pescoço: laço apertado por mãos alheias.',
    confirmaCausa: 'estrangulamento_ligadura',
  },
  {
    id: 'sulco_obliquo',
    rotulo: 'Sulco cervical oblíquo ascendente',
    descricao: 'Marca que sobe em diagonal rumo ao nó: peso do corpo suspenso.',
    confirmaCausa: 'enforcamento',
  },
  {
    id: 'equimoses_digitais',
    rotulo: 'Equimoses digitais e marcas ungueais',
    descricao: 'Dedadas e unhadas no pescoço: pressão direta das mãos.',
    confirmaCausa: 'estrangulamento_manual',
  },
  {
    id: 'oclusao_vias',
    rotulo: 'Oclusão de boca e narinas',
    descricao: 'Sinais de obstrução das vias respiratórias por mão, pano ou travesseiro.',
    confirmaCausa: 'sufocacao',
  },
  {
    id: 'agua_pulmoes',
    rotulo: 'Espuma nas vias aéreas / água nos pulmões',
    descricao: 'Cogumelo de espuma e líquido aspirado: submersão em vida.',
    confirmaCausa: 'afogamento',
  },
  {
    id: 'odor_amendoas',
    rotulo: 'Odor de amêndoas amargas',
    descricao: 'Exalação característica do envenenamento por cianeto.',
    confirmaCausa: 'envenenamento_cianeto',
  },
  {
    id: 'odor_alho',
    rotulo: 'Odor aliáceo (de alho)',
    descricao: 'Hálito de alho próprio do envenenamento por arsênico.',
    confirmaCausa: 'envenenamento_arsenico',
  },
  {
    id: 'miose_opiacea',
    rotulo: 'Pupilas em ponta de alfinete',
    descricao: 'Pupilas contraídas ao extremo e respiração deprimida: o sono do ópio que afunda em coma.',
    confirmaCausa: 'envenenamento_laudano',
  },
  {
    id: 'ferida_contusa',
    rotulo: 'Ferida contusa / fratura craniana',
    descricao: 'Afundamento ou fratura por objeto rombo.',
    confirmaCausa: 'trauma_contuso',
  },
  {
    id: 'ferida_incisa',
    rotulo: 'Ferida incisa ou perfuro-cortante',
    descricao: 'Corte ou perfuração por lâmina.',
    confirmaCausa: 'ferida_arma_branca',
  },
  {
    id: 'orificio_projetil',
    rotulo: 'Orifício de projétil',
    descricao: 'Orifício de entrada (e por vezes de saída) de arma de fogo.',
    confirmaCausa: 'arma_de_fogo',
  },
  {
    id: 'reacao_vital',
    rotulo: 'Reação vital',
    descricao: 'Escoriação/equimose viva nas bordas de uma lesão: ferimento sofrido ainda em vida.',
    modificador: true,
  },
  // ---- B4 da OS autobattler v2: sinais de TENTATIVA (domínio próprio).
  // `modificador` os mantém fora do cravar (causasCompativeis os salta);
  // `tentativa` marca o subdomínio: o método abortado colore o caso, o
  // fatal crava sozinho. Fonte: kb-medicina-legal/asfixias.md (tentativa
  // × consumação — Taylor).
  {
    id: 'sulco_interrompido',
    rotulo: 'Sulco cervical interrompido',
    descricao:
      'Sulco raso e horizontal que não fecha a volta do pescoço, sem os sinais gerais da asfixia consumada (face sem congestão, sem petéquias). Marca de estrangulamento TENTADO — não é causa de morte.',
    modificador: true,
    tentativa: true,
  },
  {
    id: 'preensao_cervical_incompleta',
    rotulo: 'Preensão cervical incompleta',
    descricao:
      'Equimoses digitais esparsas no pescoço, sem o fechamento da preensão nem os sinais da asfixia consumada. Marca de esganadura TENTADA — não é causa de morte.',
    modificador: true,
    tentativa: true,
  },
];

export function obterSinal(id) {
  return SINAIS.find((s) => s.id === id) || null;
}

// ---------------------------------------------------------------------
// 2) Catálogo de CAUSAS, agrupadas por família.
//    sinalAssinatura: o sinal que a confirma isoladamente.
//    Os ids de mecanismo coincidem com os usados pela Verdade de Ouro
//    (seed.mecanismoCorreto) sempre que se sobrepõem.
// ---------------------------------------------------------------------
export const CATALOGO_CAUSAS = [
  // ----- Família: ASFIXIA -----
  {
    id: 'estrangulamento_ligadura',
    nome: 'Estrangulamento por ligadura',
    familia: 'asfixia',
    sinalAssinatura: 'sulco_horizontal',
    descricao: 'Laço (corda, cinto, cordão) apertado em torno do pescoço por mãos alheias.',
  },
  {
    id: 'enforcamento',
    nome: 'Enforcamento',
    familia: 'asfixia',
    sinalAssinatura: 'sulco_obliquo',
    descricao: 'Suspensão do corpo por um laço; frequentemente voluntário.',
  },
  {
    id: 'estrangulamento_manual',
    nome: 'Estrangulamento manual (esganadura)',
    familia: 'asfixia',
    sinalAssinatura: 'equimoses_digitais',
    descricao: 'Pressão direta das mãos sobre o pescoço.',
  },
  {
    id: 'sufocacao',
    nome: 'Sufocação',
    familia: 'asfixia',
    sinalAssinatura: 'oclusao_vias',
    descricao: 'Obstrução mecânica das vias respiratórias.',
  },
  {
    id: 'afogamento',
    nome: 'Afogamento',
    familia: 'asfixia',
    sinalAssinatura: 'agua_pulmoes',
    descricao: 'Asfixia por submersão em meio líquido.',
  },

  // ----- Família: INTOXICAÇÃO -----
  {
    id: 'envenenamento_cianeto',
    nome: 'Envenenamento por cianeto',
    familia: 'intoxicacao',
    sinalAssinatura: 'odor_amendoas',
    descricao: 'Veneno de ação rápida; deixa odor de amêndoas amargas.',
  },
  {
    id: 'envenenamento_arsenico',
    nome: 'Envenenamento por arsênico',
    familia: 'intoxicacao',
    sinalAssinatura: 'odor_alho',
    descricao: 'Veneno de ação lenta; deixa hálito de alho.',
  },
  {
    id: 'envenenamento_laudano',
    nome: 'Envenenamento por láudano (dose excessiva)',
    familia: 'intoxicacao',
    sinalAssinatura: 'miose_opiacea',
    descricao: 'Tintura de ópio em dose excessiva; pupilas em ponta de alfinete e depressão respiratória.',
  },

  // ----- Família: TRAUMA -----
  {
    id: 'trauma_contuso',
    nome: 'Trauma contuso',
    familia: 'trauma',
    sinalAssinatura: 'ferida_contusa',
    descricao: 'Golpe por objeto rombo; fraturas e afundamentos.',
  },
  {
    id: 'ferida_arma_branca',
    nome: 'Ferida por arma branca',
    familia: 'trauma',
    sinalAssinatura: 'ferida_incisa',
    descricao: 'Lesão por instrumento cortante ou perfurante.',
  },
  {
    id: 'arma_de_fogo',
    nome: 'Ferida por arma de fogo',
    familia: 'trauma',
    sinalAssinatura: 'orificio_projetil',
    descricao: 'Lesão por projétil de arma de fogo.',
  },
];

export function obterCausa(id) {
  return CATALOGO_CAUSAS.find((c) => c.id === id) || null;
}

// ---------------------------------------------------------------------
// 3) Motor de dedução por eliminação (puro; lê apenas ids de sinais).
// ---------------------------------------------------------------------

// Dada a lista de sinais observados (ids), devolve as causas do catálogo
// que AINDA são compatíveis. Uma causa permanece se, e somente se:
//   • todo sinal de família observado pertence à SUA família; e
//   • todo sinal de assinatura observado confirma justamente ELA.
// Sinais modificadores são ignorados.
export function causasCompativeis(sinaisObservados) {
  const sinais = (sinaisObservados || []).map(obterSinal).filter(Boolean);
  return CATALOGO_CAUSAS.filter((causa) => {
    for (const sinal of sinais) {
      if (sinal.modificador) continue;
      if (sinal.confirmaCausa && sinal.confirmaCausa !== causa.id) return false;
      if (sinal.familia && sinal.familia !== causa.familia) return false;
    }
    return true;
  });
}

// Conveniência: se a eliminação deixou exatamente uma causa, ela está
// cravada; caso contrário, devolve null (o leque ainda está aberto).
export function mecanismoCravado(sinaisObservados) {
  const restantes = causasCompativeis(sinaisObservados);
  return restantes.length === 1 ? restantes[0] : null;
}
