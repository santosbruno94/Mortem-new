// =====================================================================
// Interpolação de textos narrativos (§12).
//   {detective.campo}            → valor do campo (name, surname, title…)
//   {g:texto masc.|texto fem.}   → flexão pelo pronome do detective
// =====================================================================

export function interpolar(texto, detective) {
  if (!texto) return '';
  let resultado = texto.replace(/\{detective\.(\w+)\}/g, (_, campo) =>
    detective && detective[campo] != null ? detective[campo] : ''
  );
  resultado = resultado.replace(/\{g:([^|}]*)\|([^}]*)\}/g, (_, masculino, feminino) =>
    detective && detective.pronoun === 'ela' ? feminino : masculino
  );
  return resultado;
}
