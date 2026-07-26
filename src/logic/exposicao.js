// =====================================================================
// EXPOSIÇÃO (E0/E1/E2) — OS-R6, guarda G5.
//
// O contrato da G5 é a especificação inteira: «os níveis de exposição são
// função pura das cartas possuídas; determinístico, auditável, sem flag
// escondida». Aqui não há estado, não há `Math.random`, não há `Date.now`:
// mesmas cartas na mesa ⇒ mesmo nível, sempre.
//
// CAMADA NARRATIVA. O nível muda o que a conversa RENDE a mais — uma
// hesitação, um detalhe a mais, um deslize. Nunca o que ela deixa de dar:
// nenhum nó abre ou fecha por nível, nenhuma carta nasce atrás dele. É a
// G4 (solubilidade) satisfeita por construção, e não por vigilância.
// `veredicto.js` e `acusacao.js` não importam este arquivo (GR6-6).
//
// ---------------------------------------------------------------------
// POR QUE O NÍVEL É RELATIVO, E NÃO UM CORTE ABSOLUTO
//
// A Fase 0 mediu antes de se arbitrar coisa nenhuma, e o que ela achou
// reprova o corte absoluto por duas vias independentes:
//
//   • O réu tem o maior dossiê do caso (8 cartas o apontam, 5 achráveis
//     fora da conversa dele). Num corte absoluto ele sobe de nível antes
//     dos inocentes, e quem contar níveis acha o réu sem raciocinar. É a
//     GR6-5 a cair — o mesmo defeito da paridade dos móbeis, noutra roupa.
//   • Grey e Davey têm um punhado pequeno (2 e 3). Num corte alto nunca o
//     alcançariam: beco de exposição, contra a G10.
//
// Medir a FRAÇÃO do dossiê de cada um resolve as duas de uma vez. Material
// equivalente dá nível equivalente, seja o suspeito o réu ou não — que é
// exatamente o que a GR6-5 pede, e agora por construção.
//
// ---------------------------------------------------------------------
// O QUE É O DOSSIÊ DE UM SUSPEITO
//
// O que o perito pode trazer DE FORA sobre ele. Três somas e uma subtração:
//
//   (+) as cartas que o apontam — `ligadoA`, `pertenceA`, `declaranteId`;
//   (+) as cartas que a árvore dele está escrita para reagir (as chaves de
//       `reacoesProva`) — é a definição autoral de «o que importa a este
//       suspeito», e já está nos dados;
//   (−) as cartas que nascem da boca dele, marcadas `[[id]]` na própria
//       árvore. Álibi e caracterização não são o perito chegando sabendo:
//       são a conversa a pagar-se a si mesma, e todo jogador as tem no
//       beat 3 por construção. Contá-las era dar nível de graça.
//
// A definição deriva-se dos dados a cada chamada e não pode envelhecer:
// carta nova que aponte um suspeito entra no dossiê dele sozinha.
// =====================================================================

export const NIVEIS = ['E0', 'E1', 'E2'];

// Os marcadores [[id]] da prosa (mesma família de src/data e do qa.mjs).
function marcadosEm(textos) {
  const achados = new Set();
  for (const texto of textos || []) {
    for (const m of String(texto ?? '').matchAll(/\[\[(\w+)\]\]/g)) achados.add(m[1]);
  }
  return achados;
}

// As cartas que apontam um suspeito, pelos três campos que o catálogo usa.
function aponta(carta, suspeitoId) {
  const t = carta?.tagsOcultas || {};
  return t.ligadoA === suspeitoId || t.pertenceA === suspeitoId || t.declaranteId === suspeitoId;
}

/**
 * O dossiê externo de cada suspeito, derivado do catálogo e da árvore.
 * Devolve `{ [suspeitoId]: string[] }`, com os ids em ordem estável (a do
 * catálogo) para que a auditoria compare listas e não conjuntos.
 */
export function montarDossies(cartas, dialogos) {
  const dossies = {};
  for (const arvore of Object.values(dialogos || {})) {
    const suspeitoId = arvore?.suspeitoId;
    if (!suspeitoId) continue;

    const nascemAqui = marcadosEm(Object.values(arvore.nos || {}).flatMap((n) => n.fala || []));
    const reagidas = new Set(Object.keys(arvore.reacoesProva || {}));

    const ids = [];
    for (const carta of cartas || []) {
      if (nascemAqui.has(carta.id)) continue;
      if (aponta(carta, suspeitoId) || reagidas.has(carta.id)) ids.push(carta.id);
    }
    dossies[suspeitoId] = ids;
  }
  return dossies;
}

/**
 * O corte, e é uma linha: dois terços do dossiê do próprio suspeito,
 * arredondados para cima. Abaixo de tudo e acima de zero, E1.
 */
export function corteDeE2(tamanhoDoDossie) {
  return Math.ceil((2 * tamanhoDoDossie) / 3);
}

/**
 * A exposição do perito diante de um suspeito. Função pura: as cartas na
 * mesa e o dossiê entram, o nível sai.
 *
 * @param {Iterable<string>} idsNaMesa ids das cartas registradas
 * @param {string[]} dossie ids do dossiê externo daquele suspeito
 * @returns {{ nivel: 'E0'|'E1'|'E2', tem: number, total: number, ids: string[] }}
 */
export function exposicaoDiante(idsNaMesa, dossie) {
  const mesa = idsNaMesa instanceof Set ? idsNaMesa : new Set(idsNaMesa || []);
  const ids = (dossie || []).filter((id) => mesa.has(id));
  const tem = ids.length;
  const total = (dossie || []).length;

  let nivel = 'E1';
  if (tem === 0 || total === 0) nivel = 'E0';
  else if (tem >= corteDeE2(total)) nivel = 'E2';

  return { nivel, tem, total, ids };
}

/**
 * Atalho de leitura para a camada de apresentação: o nível diante de um
 * suspeito, dados a mesa, o catálogo e a árvore.
 */
export function nivelDeExposicao(idsNaMesa, suspeitoId, cartas, dialogos) {
  const dossies = montarDossies(cartas, dialogos);
  return exposicaoDiante(idsNaMesa, dossies[suspeitoId] || []).nivel;
}
