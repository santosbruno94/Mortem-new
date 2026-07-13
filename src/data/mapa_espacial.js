// =====================================================================
// MAPA ESPACIAL DO DIORAMA — camada 100% VISUAL.
//
// Onde cada nó do mapa fica na maquete 3D sobre a mesa, e que forma tem
// o prédio que o representa. NENHUMA regra lê este arquivo: a topologia
// e os custos continuam em src/data/mapa.js (o motor), e os ids são os
// MESMOS de NOS_MAPA — trocar a maquete nunca toca o jogo.
//
// Coordenadas em "metros de maquete" (unidades do three): x cresce para
// a direita, z para a frente. A vila fica ao centro-esquerda; Moorford
// (o gabinete do procurador), na ponta direita da estrada (longe — 1h30
// de viagem por trecho).
// =====================================================================

export const POSICOES_DIORAMA = {
  // O quarteirão da relojoaria (mesmo prédio — andar entre eles é 0h).
  // Os rótulos são <Html center> no topo de cada prédio: manter ≥1,4u de
  // afastamento horizontal entre vizinhos OU ≥1,6u de profundidade (o z
  // separa as etiquetas na vertical da tela) — no playtest de 13/07/2026
  // (achado A7) o aglomerado central atropelava os rótulos.
  cena: { x: -3.2, z: -1.45, predio: 'relojoaria' },
  corpo: { x: -4.3, z: 1.0, predio: 'relojoaria_fundos' },
  oficina: { x: -2.5, z: 1.9, predio: 'oficina' },
  interrogatorio_silas: { x: -1.0, z: 0.0, predio: 'saleta' },
  // A vila de Briarstone.
  delegacia: { x: 0.7, z: -1.9, predio: 'civico' },
  estalagem: { x: 2.5, z: 0.1, predio: 'estalagem' },
  papelaria: { x: 0.0, z: 1.9, predio: 'papelaria' },
  moinho: { x: 4.2, z: 1.7, predio: 'moinho' },
  // Fora da vila, na ponta da estrada.
  gabinete_pettigrew: { x: 5.7, z: -1.7, predio: 'gabinete' },
};

// A estrada para Moorford (polilinha sobre a maquete). Só aparece quando
// o nó distante é desbloqueado — o mapa CRESCE diante do jogador.
export const ESTRADA_MOORFORD = [
  { x: 2.4, z: -0.4 },
  { x: 3.5, z: -1.0 },
  { x: 4.8, z: -1.4 },
  { x: 5.7, z: -1.7 },
];

// Formas dos prédios (caixa + telhado de 4 águas + chaminé opcional).
// Dimensões em unidades de maquete; cores na paleta sépia dos tokens.
export const FORMAS_PREDIO = {
  relojoaria: { w: 1.55, d: 1.15, h: 1.05, telhado: 0.6, chamine: true, corParede: '#8a7355', corTelhado: '#4a3626' },
  relojoaria_fundos: { w: 0.95, d: 0.85, h: 0.66, telhado: 0.4, chamine: false, corParede: '#7d684c', corTelhado: '#443328' },
  oficina: { w: 1.0, d: 0.8, h: 0.6, telhado: 0.38, chamine: true, corParede: '#83704e', corTelhado: '#463527' },
  saleta: { w: 0.85, d: 0.75, h: 0.58, telhado: 0.36, chamine: true, corParede: '#84704f', corTelhado: '#4a3626' },
  civico: { w: 1.3, d: 0.95, h: 0.98, telhado: 0.52, chamine: false, corParede: '#7b7468', corTelhado: '#3e3a34' },
  estalagem: { w: 1.45, d: 1.05, h: 0.92, telhado: 0.56, chamine: true, corParede: '#8d7a5a', corTelhado: '#4d3a29' },
  papelaria: { w: 0.95, d: 0.8, h: 0.72, telhado: 0.44, chamine: true, corParede: '#96825e', corTelhado: '#523c28' },
  moinho: { w: 0.9, d: 0.9, h: 1.35, telhado: 0.5, chamine: false, corParede: '#8a8272', corTelhado: '#3e3a34' },
  gabinete: { w: 1.35, d: 1.05, h: 1.1, telhado: 0.6, chamine: true, corParede: '#77705f', corTelhado: '#3a352d' },
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
