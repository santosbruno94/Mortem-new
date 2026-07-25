import { hashString } from '../logic/hash.js';

// =====================================================================
// MAPA ESPACIAL DO DIORAMA — camada 100% VISUAL.
//
// Onde cada nó do mapa fica na maquete 3D sobre a mesa, que forma tem o
// prédio que o representa, e como a luz da maquete muda com a hora.
// NENHUMA regra lê este arquivo: a topologia e os custos continuam em
// src/data/mapa.js (o motor), e os ids são os MESMOS de NOS_MAPA — trocar
// a maquete nunca toca o jogo. Sem Math.random/Date.now: a luz por hora é
// pura (interpola keyframes fixos), lida da apresentação a partir do
// relógio (estado derivado) — nunca do motor.
//
// Coordenadas em "metros de maquete" (unidades do three): x cresce para
// a direita, z para a frente. A vila fica ao centro-esquerda; Moorford
// (o gabinete do procurador), na ponta direita da estrada (longe — 1h30
// de viagem por trecho).
// =====================================================================

export const POSICOES_DIORAMA = {
  // O quarteirão da relojoaria (mesmo prédio — andar entre eles é 0h).
  // Os rótulos são <Html center> no topo de cada prédio: a câmera isométrica
  // separa na vertical da tela quem tem z diferente. O playtest de 13/07/2026
  // (achado A7) apontou o aglomerado central atropelando etiquetas — as
  // posições abaixo abriram o z entre vizinhos e afastaram a cena do corpo.
  // OS-R2: onde havia três prédios de maquete para o mesmo endereço, há um.
  relojoaria: { x: -3.5, z: -1.7, predio: 'relojoaria' },
  interrogatorio_silas: { x: -1.2, z: -0.4, predio: 'saleta' },
  // A vila de Briarstone (espaçada para os rótulos não colidirem).
  posto_do_guarda: { x: 0.5, z: -2.2, predio: 'civico' },
  estalagem: { x: 2.9, z: -0.2, predio: 'estalagem' },
  papelaria: { x: 0.6, z: 2.2, predio: 'papelaria' },
  moinho: { x: 4.6, z: 2.0, predio: 'moinho' },
  // Fora da vila, na ponta da estrada.
  gabinete_pettigrew: { x: 6.0, z: -1.9, predio: 'gabinete' },
};

// A estrada para Moorford (polilinha sobre a maquete). Só aparece quando
// o nó distante é desbloqueado — o mapa CRESCE diante do jogador.
export const ESTRADA_MOORFORD = [
  { x: 2.8, z: -0.6 },
  { x: 3.8, z: -1.1 },
  { x: 5.0, z: -1.5 },
  { x: 6.0, z: -1.9 },
];

// Formas dos prédios da maquete de papel. Sempre primitivas compostas
// (proibido GLTF/textura externa): caixa + telhado de DUAS ÁGUAS com
// beiral + chaminés, e os acentos de silhueta de cada prédio (a marquise
// da relojoaria, as pás do moinho). Dimensões em unidades de maquete;
// cores na paleta sépia dos tokens.
//
//   telhadoAltura : altura do vão do telhado (do beiral à cumeeira)
//   beiral        : quanto o telhado avança além da parede (sombra na fachada)
//   ristela       : true → a cumeeira corre no eixo X (fachada nas faces Z)
//   chamines      : [{ x, z, alt }] posições relativas (0 = centro da planta)
//   marquise      : toldo de loja sobre a vitrine (só a relojoaria)
//   moinho        : roda de pás estática na fachada (só o moinho)
export const FORMAS_PREDIO = {
  relojoaria: {
    w: 1.55, d: 1.15, h: 1.05, corParede: '#8a7355', corTelhado: '#4a3626',
    telhadoAltura: 0.62, beiral: 0.12, ristela: true,
    chamines: [{ x: 0.4, z: -0.25, alt: 0.5 }], marquise: true,
  },
  relojoaria_fundos: {
    w: 0.95, d: 0.85, h: 0.66, corParede: '#7d684c', corTelhado: '#443328',
    telhadoAltura: 0.4, beiral: 0.09, ristela: true, chamines: [],
  },
  oficina: {
    w: 1.0, d: 0.8, h: 0.6, corParede: '#83704e', corTelhado: '#463527',
    telhadoAltura: 0.4, beiral: 0.1, ristela: false,
    chamines: [{ x: -0.28, z: 0.15, alt: 0.42 }],
  },
  saleta: {
    w: 0.85, d: 0.75, h: 0.58, corParede: '#84704f', corTelhado: '#4a3626',
    telhadoAltura: 0.36, beiral: 0.09, ristela: true,
    chamines: [{ x: 0.24, z: -0.16, alt: 0.36 }],
  },
  civico: {
    w: 1.3, d: 0.95, h: 0.98, corParede: '#7b7468', corTelhado: '#3e3a34',
    telhadoAltura: 0.5, beiral: 0.13, ristela: true, chamines: [],
  },
  estalagem: {
    w: 1.45, d: 1.05, h: 0.92, corParede: '#8d7a5a', corTelhado: '#4d3a29',
    telhadoAltura: 0.58, beiral: 0.13, ristela: true,
    chamines: [{ x: 0.5, z: -0.25, alt: 0.55 }, { x: -0.45, z: 0.2, alt: 0.45 }],
  },
  papelaria: {
    w: 0.95, d: 0.8, h: 0.72, corParede: '#96825e', corTelhado: '#523c28',
    telhadoAltura: 0.46, beiral: 0.1, ristela: true,
    chamines: [{ x: 0.26, z: -0.18, alt: 0.44 }],
  },
  moinho: {
    w: 0.9, d: 0.9, h: 1.35, corParede: '#8a8272', corTelhado: '#3e3a34',
    telhadoAltura: 0.5, beiral: 0.08, ristela: false, chamines: [], moinho: true,
  },
  gabinete: {
    w: 1.35, d: 1.05, h: 1.1, corParede: '#77705f', corTelhado: '#3a352d',
    telhadoAltura: 0.6, beiral: 0.13, ristela: true,
    chamines: [{ x: 0.5, z: -0.28, alt: 0.6 }],
  },
};

// A tábua da maquete (a peça pousada sobre a mesa) e o seu centro ótico.
export const MAQUETE = {
  centroX: 1.1,
  larguraTabua: 11.6,
  fundoTabua: 5.4,
  corTabua: '#2c2213',
  corTerreno: '#3d301a',
  corEstrada: '#4a3c26',
};

// =====================================================================
// CICLO DE LUZ DA MAQUETE — a hora do relógio pintada na maquete.
//
// Keyframes por hora absoluta do jogo (11 = 11h00 de 14/out). A tarde
// dourada cede ao crepúsculo e à noite, quando os lampiões das janelas
// tomam a frente e a névoa baixa de outubro fecha. "Perceptível e
// contido": a noite escurece sem apagar a leitura das etiquetas.
//
//   luz/amb/fog : cor em hex (parede/luz direcional, ambiente, névoa)
//   iLuz/iAmb   : intensidade das luzes
//   fogNear/Far : distância da névoa linear (noite = mais fechada)
//   lamp        : 0..1 quanto os lampiões das janelas queimam (noite = 1)
// =====================================================================
export const CICLO_LUZ = [
  { hora: 13, luz: '#ffe9c2', iLuz: 2.05, amb: '#8a8172', iAmb: 1.12, fog: '#b9a888', fogNear: 9.5, fogFar: 27, lamp: 0.12 },
  { hora: 15, luz: '#ffd79a', iLuz: 2.0, amb: '#8c8070', iAmb: 1.06, fog: '#ad977a', fogNear: 9, fogFar: 25, lamp: 0.22 },
  { hora: 17.5, luz: '#f2b06a', iLuz: 1.95, amb: '#847462', iAmb: 1.0, fog: '#93795b', fogNear: 8, fogFar: 23, lamp: 0.5 },
  { hora: 19, luz: '#e0904e', iLuz: 1.6, amb: '#6e6250', iAmb: 0.95, fog: '#544a3a', fogNear: 7.5, fogFar: 22, lamp: 0.82 },
  { hora: 21, luz: '#9a86a0', iLuz: 1.25, amb: '#4f4a58', iAmb: 0.9, fog: '#2e2c3a', fogNear: 7, fogFar: 21, lamp: 1.0 },
  { hora: 24, luz: '#7d7598', iLuz: 1.1, amb: '#454153', iAmb: 0.85, fog: '#242232', fogNear: 6.5, fogFar: 20, lamp: 1.0 },
];

// hex '#rrggbb' → { r, g, b } em 0..1 (puro; sem three neste arquivo de dados).
function hexParaRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
const lerp = (a, b, t) => a + (b - a) * t;
const lerpRgb = (a, b, t) => ({ r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) });

// A luz da maquete numa dada hora do relógio. Interpola os keyframes; fora
// da faixa, prende no extremo. Devolve cores em rgb 0..1 (o componente
// constrói o THREE.Color) e os escalares de intensidade/névoa/lampião.
export function interpolarLuz(horasJogo) {
  const ks = CICLO_LUZ;
  let a = ks[0];
  let b = ks[ks.length - 1];
  let t = 0;
  if (horasJogo <= ks[0].hora) {
    a = b = ks[0];
  } else if (horasJogo >= ks[ks.length - 1].hora) {
    a = b = ks[ks.length - 1];
  } else {
    for (let i = 0; i < ks.length - 1; i++) {
      if (horasJogo >= ks[i].hora && horasJogo <= ks[i + 1].hora) {
        a = ks[i];
        b = ks[i + 1];
        t = (horasJogo - a.hora) / (b.hora - a.hora);
        break;
      }
    }
  }
  return {
    luz: lerpRgb(hexParaRgb(a.luz), hexParaRgb(b.luz), t),
    iLuz: lerp(a.iLuz, b.iLuz, t),
    amb: lerpRgb(hexParaRgb(a.amb), hexParaRgb(b.amb), t),
    iAmb: lerp(a.iAmb, b.iAmb, t),
    fog: lerpRgb(hexParaRgb(a.fog), hexParaRgb(b.fog), t),
    fogNear: lerp(a.fogNear, b.fogNear, t),
    fogFar: lerp(a.fogFar, b.fogFar, t),
    lamp: lerp(a.lamp, b.lamp, t),
  };
}

// ---------------------------------------------------------------------
// A VILA QUE RESPIRA COM A HORA (Onda 9) — camada visual pura, nada aqui
// é lido pelo motor. Toda variação é determinística (hashString; nunca
// Math.random): a mesma janela acende sempre à mesma hora, em qualquer
// máquina, em qualquer sessão.
// ---------------------------------------------------------------------

// Uma janela está acesa a esta hora? Dia claro: apagadas. Do crepúsculo em
// diante, cada janela acende numa hora própria (entre 17h e 19h, sorteio
// determinístico por prédio+índice). Madrugada alta (23h em diante): a vila
// dorme — só o posto do guarda e a estalagem conservam luz. Os dois ids do
// posto convivem: `posto_do_guarda` é o do caso-escola desde a OS-R2, e
// `delegacia` continua a ser o dos casos gerados.
export function janelaAcesa(locId, indice, horasJogo) {
  const hora = ((horasJogo % 24) + 24) % 24;
  if (hora >= 7 && hora < 17) return false;
  if (hora >= 23 || hora < 7) return locId === 'posto_do_guarda' || locId === 'delegacia' || locId === 'estalagem';
  const acendeAs = 17 + (hashString(`janela_${locId}_${indice}`) % 120) / 60;
  return hora >= acendeAs;
}

// A chaminé fumega nas horas frias (manhã cedo e do fim da tarde em diante)
// — só nas casas com fogo aceso de ofício ou de cozinha. `relojoaria` é o
// prédio do caso-escola desde a OS-R2; `cena`, o dos casos gerados.
export function chamineFumega(locId, horasJogo) {
  const hora = ((horasJogo % 24) + 24) % 24;
  if (locId !== 'relojoaria' && locId !== 'cena' && locId !== 'estalagem') return false;
  return hora < 9 || hora >= 17;
}

// O guarda está à porta do posto? Turno de dia (8h–20h); à noite a
// porta fica com a lanterna.
export function guardaNaPorta(horasJogo) {
  const hora = ((horasJogo % 24) + 24) % 24;
  return hora >= 8 && hora < 20;
}
