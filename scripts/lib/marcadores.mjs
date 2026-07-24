// =====================================================================
// MARCADORES [[id_da_carta]] — a regex e os coletores, num lugar só.
// A família /\[\[(\w+)\]\]/ estava reimplementada em ~8 pontos do qa.mjs
// e do gerar-casos.mjs (revisão 24/07): uma mudança de sintaxe do
// marcador teria de acertar todos — agora acerta um.
// =====================================================================

// A regex crua (nova a cada chamada — matchAll exige lastIndex limpo).
export const reMarcador = () => /\[\[(\w+)\]\]/g;

// Ids marcados num texto (array, na ordem em que aparecem).
export function marcadoresDoTexto(texto) {
  return [...String(texto ?? '').matchAll(reMarcador())].map((m) => m[1]);
}

// Ids marcados numa LISTA de textos (Set, sem duplicatas).
export function marcadoresDosTextos(textos) {
  return new Set((textos || []).flatMap((t) => marcadoresDoTexto(t)));
}

// O texto com os marcadores removidos (para checagens de vazamento de id).
export function semMarcadores(texto) {
  return String(texto ?? '').replace(/\[\[\w+\]\]/g, '');
}
