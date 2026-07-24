// =====================================================================
// O REGISTRO DE UM DESTINO ACRESCIDO — uma string, uma fonte.
//
// Quando um lead revela um nó, o diário da Caderneta anota a linha; a
// prancha carimba o adendo a bico de pena com a HORA daquela anotação
// ("Acrescido 13h00"). As duas leituras nascem do mesmo texto: o store
// escreve por `textoNovoDestino`, e a prancha reencontra a hora pelo
// mesmo prefixo. Trocar a frase num lugar troca nos dois.
//
// Puro e determinístico; nada aqui é lido pelo motor.
// =====================================================================

// O prefixo estável da anotação (o que não depende da nota do lead).
export function prefixoNovoDestino(rotulo) {
  return `Novo destino no mapa: ${rotulo}.`;
}

// A linha inteira, como o diário a registra.
export function textoNovoDestino(rotulo, nota) {
  return `${prefixoNovoDestino(rotulo)} ${nota || ''}`.trim();
}

// A hora em que o lead chegou, lida do próprio diário. Devolve null quando
// o nó não foi acrescido por lead (nasceu com o caso) ou quando o save é
// anterior a esta anotação.
export function horaDoAcrescimo(log, rotulo) {
  const prefixo = prefixoNovoDestino(rotulo);
  const linha = (log || []).find((e) => typeof e.texto === 'string' && e.texto.startsWith(prefixo));
  return linha ? linha.hora : null;
}
