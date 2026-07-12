// =====================================================================
// MAPA ESPACIAL DO DIORAMA — camada 100% VISUAL.
//
// Onde cada nó do mapa fica na maquete 3D sobre a mesa, e que forma tem
// o prédio que o representa. NENHUMA regra lê este arquivo: a topologia
// e os custos continuam em src/data/mapa.js (o motor), e os ids são os
// MESMOS de NOS_MAPA — trocar a maquete nunca toca o jogo.
//
// Coordenadas em "metros de maquete" (unidades do three): x cresce para
// a direita, z para a frente. A vila fica ao centro-esquerda; Moorford,
// na ponta direita da estrada (longe — 1h30 de viagem por trecho).
// =====================================================================

export const POSICOES_DIORAMA = {
  // O quarteirão da relojoaria (mesmo prédio — andar entre eles é 0h).
  cena: { x: -2.7, z: -1.0, predio: 'relojoaria' },
  corpo: { x: -3.5, z: 0.4, predio: 'relojoaria_fundos' },
  interrogatorio_edgar: { x: -1.8, z: 0.7, predio: 'saleta' },
  // A vila de Briarstone.
  delegacia: { x: 0.5, z: -1.2, predio: 'civico' },
  interrogatorio_hudson: { x: 1.6, z: 0.4, predio: 'casa_grande' },
  interrogatorio_blackwood: { x: -0.1, z: 1.4, predio: 'taverna' },
  // Fora da vila, na ponta da estrada.
  clube_moorford: { x: 5.3, z: -1.5, predio: 'clube' },
};

// A estrada de Moorford (polilinha sobre a maquete). Só aparece quando
// o nó é desbloqueado — o mapa CRESCE diante do jogador.
export const ESTRADA_MOORFORD = [
  { x: 1.9, z: -0.3 },
  { x: 3.1, z: -0.9 },
  { x: 4.4, z: -1.3 },
  { x: 5.3, z: -1.5 },
];

// Formas dos prédios (caixa + telhado de 4 águas + chaminé opcional).
// Dimensões em unidades de maquete; cores na paleta sépia dos tokens.
export const FORMAS_PREDIO = {
  relojoaria: { w: 1.55, d: 1.15, h: 1.05, telhado: 0.6, chamine: true, corParede: '#8a7355', corTelhado: '#4a3626' },
  relojoaria_fundos: { w: 0.95, d: 0.85, h: 0.66, telhado: 0.4, chamine: false, corParede: '#7d684c', corTelhado: '#443328' },
  saleta: { w: 0.85, d: 0.75, h: 0.58, telhado: 0.36, chamine: true, corParede: '#84704f', corTelhado: '#4a3626' },
  civico: { w: 1.3, d: 0.95, h: 0.98, telhado: 0.52, chamine: false, corParede: '#7b7468', corTelhado: '#3e3a34' },
  casa_grande: { w: 1.4, d: 1.05, h: 0.9, telhado: 0.56, chamine: true, corParede: '#8d7a5a', corTelhado: '#4d3a29' },
  taverna: { w: 1.25, d: 0.95, h: 0.78, telhado: 0.5, chamine: true, corParede: '#967a4e', corTelhado: '#523c28' },
  clube: { w: 1.35, d: 1.05, h: 1.1, telhado: 0.6, chamine: true, corParede: '#77705f', corTelhado: '#3a352d' },
};

// A tábua da maquete (a peça pousada sobre a mesa) e o seu centro ótico.
export const MAQUETE = {
  centroX: 1.1,
  larguraTabua: 11.2,
  fundoTabua: 5.2,
  corTabua: '#2c2213',
  corTerreno: '#3d301a',
  corEstrada: '#584730',
};
