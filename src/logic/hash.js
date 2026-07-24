// =====================================================================
// HASH DETERMINÍSTICO — a única fonte de "sorteio" do jogo (§11).
//
// O jogo é proibido de usar Math.random()/Date.now() na lógica: toda
// variação (variantes do monólogo, hachura dos retratos, e, no futuro,
// a aparência procedural derivada de seed) sai deste hash de string,
// salgado com a chave que se quiser (id do caso, nome do perito, id do
// personagem). A mesma entrada produz sempre a mesma saída.
// =====================================================================

// Hash de string estável e determinístico (sem Math.random/Date).
export function hashString(s) {
  let h = 0;
  const str = String(s || '');
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Escolhe um item de uma lista de forma determinística a partir de uma chave.
// `nOcorrencia` desloca a escolha pela ordem dentro do mesmo pool: blocos
// vizinhos do mesmo tipo nunca repetem a variante, por construção. FONTE
// ÚNICA do sorteio de variantes — monólogo, epílogo e eco do mestre usam
// esta função (não reimplementar o padrão hash % length em cada módulo).
export function escolherDeterministico(itens, chave, nOcorrencia = 0) {
  if (!itens || itens.length === 0) return null;
  return itens[(hashString(chave) + nOcorrencia) % itens.length];
}
