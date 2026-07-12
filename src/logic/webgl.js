// =====================================================================
// Sondagem de WebGL — camada de apresentação. Decide apenas SE o 3D
// pode ser desenhado; nenhuma regra de jogo lê isto. O resultado é
// memoizado (a sondagem cria um canvas descartável, sem sujar console).
// =====================================================================

let resultado = null;

export function webglDisponivel() {
  if (resultado !== null) return resultado;
  try {
    const canvas = document.createElement('canvas');
    resultado = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    resultado = false;
  }
  return resultado;
}

// Rota de escape 2D: `?flat=1` força a mesa sem diorama/corpo 3D.
// Usada pelo QA de fumaça e por quem preferir (ou precisar) da grade.
export function modoFlat() {
  try {
    return new URLSearchParams(window.location.search).has('flat');
  } catch {
    return false;
  }
}
