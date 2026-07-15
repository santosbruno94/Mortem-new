// =====================================================================
// A frase do LEMBRETE DE VISITA, montada a partir do resumo — partilhada
// pelo rótulo 3D e pela carta 2D para não divergirem. Pura formatação de
// apresentação: quem recebeu o perito e quantas observações ficaram.
// =====================================================================
export function textoLembreteVisita({ personagemNome, nCartas }) {
  const partes = [];
  if (personagemNome) partes.push(personagemNome);
  if (nCartas > 0) partes.push(nCartas === 1 ? '1 observação' : `${nCartas} observações`);
  return partes.join(' · ');
}
