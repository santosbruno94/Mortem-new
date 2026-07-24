// =====================================================================
// O BEAT DA VIAGEM — a duração do gesto, num lugar só.
//
// A viagem com custo real ganha um beat antes de o local abrir: na
// maquete 3D o pino desliza o trajeto; na prancha, a tacha de cera corre
// a estrada desenhada. As DUAS superfícies e o hub que abre o overlay
// leem a mesma constante daqui — antes o número vivia em dois lugares
// (0,7s no PinoPerito, 720ms na Escrivaninha) e podia divergir em
// silêncio.
//
// O beat NÃO decide nada: quem paga a hora é o motor, no ato do clique.
// Cortar o beat (um toque) só antecipa a abertura do local — o estado
// final é idêntico ao de deixá-lo terminar.
// =====================================================================

// Segundos do deslize (a peça que anda) e o mesmo valor em milissegundos
// (o adiamento da abertura do local). Um número, duas unidades.
export const BEAT_VIAGEM_S = 0.72;
export const BEAT_VIAGEM_MS = BEAT_VIAGEM_S * 1000;

// Sob prefers-reduced-motion não há deslize: a peça aparece no destino e o
// relógio salta. A leitura do preço continua a mesma (é texto, não gesto).
export function movimentoReduzido() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}
