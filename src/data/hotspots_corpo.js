// =====================================================================
// HOTSPOTS DO EXAME 3D DO CORPO — camada VISUAL.
//
// Cada região clicável do cadáver aponta para a MESMA carta que o termo
// em negrito da prosa ([[id]] em localidades.js): clicar na região ou
// no texto é o mesmo gesto (extrairCarta), e o estado "já registrada"
// vem de uma única fonte (cartasRegistradas, no store). Nenhuma regra
// lê este arquivo.
//
// Posições no espaço local do corpo (deitado de costas, cabeça à
// esquerda em x negativo), em unidades de maquete.
// =====================================================================

export const HOTSPOTS_CORPO = [
  {
    cartaId: 'ev_rigor',
    regiao: 'membros',
    posicao: [0.45, 0.14, 0],
    raio: 0.3,
  },
  {
    cartaId: 'ev_livores',
    regiao: 'dorso',
    posicao: [-0.12, 0.06, 0],
    raio: 0.26,
  },
  {
    cartaId: 'ev_ferida',
    regiao: 'pescoço',
    posicao: [-0.62, 0.14, 0.12],
    raio: 0.13,
  },
  {
    cartaId: 'ev_reacao_vital',
    regiao: 'bordas da ferida (à lente)',
    posicao: [-0.62, 0.14, -0.14],
    raio: 0.11,
  },
  {
    cartaId: 'ev_residuo_ferida',
    regiao: 'canal da ferida (à lente)',
    posicao: [-0.52, 0.2, 0.02],
    raio: 0.1,
  },
  {
    cartaId: 'ev_relogio_bolso',
    regiao: 'colete (corrente do relógio)',
    posicao: [-0.2, 0.18, 0.1],
    raio: 0.12,
  },
];
