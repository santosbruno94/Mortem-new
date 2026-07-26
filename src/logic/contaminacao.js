// =====================================================================
// CONTAMINAÇÃO — o sistema que a D16 pedia, sobre o campo da D17.
//
// CAMADA NARRATIVA, e o motor é cego a ela: `veredicto.js` e `acusacao.js`
// não importam este arquivo, e a guarda GR6-6 do `qa.mjs` cobra por leitura
// de fonte. O que se decide aqui não muda desfecho nenhum; serve à prosa,
// ao monólogo (OS-R7) e à auditoria.
//
// A conta que ele faz é uma só, e é a do §3.3 da OS-R6: **duas alegações
// que saem da mesma boca valem uma.** Quem soma papéis conta duas
// corroborações onde há um homem repetido.
// =====================================================================

import { PROCEDENCIA_ALEGACOES, apontadaPor } from '../data/procedencia.js';

/**
 * Agrupa as cartas pela boca de onde a alegação saiu.
 * @param {Iterable<string>} idsNaMesa
 * @returns {Array<{ origem: string, ids: string[] }>} em ordem estável
 */
export function agruparPorOrigem(idsNaMesa) {
  const grupos = new Map();
  for (const id of idsNaMesa || []) {
    const origem = apontadaPor(id);
    if (!origem) continue;
    if (!grupos.has(origem)) grupos.set(origem, []);
    grupos.get(origem).push(id);
  }
  // Ordem estável: pela origem, e os ids pela ordem do registro de procedência.
  const ordemDoRegistro = Object.keys(PROCEDENCIA_ALEGACOES);
  return [...grupos.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([origem, ids]) => ({
      origem,
      ids: ids.slice().sort((x, y) => ordemDoRegistro.indexOf(x) - ordemDoRegistro.indexOf(y)),
    }));
}

/**
 * Quantas vozes INDEPENDENTES sustentam este punhado de alegações. É a
 * conta honesta: papéis somam-se, bocas é que corroboram.
 */
export function contarVozesIndependentes(idsNaMesa) {
  return agruparPorOrigem(idsNaMesa).length;
}

/**
 * A conta que a PROSA usa, e ela difere da de cima numa regra só: alegação
 * sem procedência registrada conta como voz PRÓPRIA.
 *
 * A de cima é a conta de auditoria — só sabe somar o que o mapa conhece, e
 * é assim que tem de ser para provar um feixe. Esta é a do desfecho, e a
 * regra existe por uma razão prática: os casos gerados não têm mapa de
 * procedência nenhum, e uma conta que devolvesse zero para eles apagaria o
 * bloco das testemunhas de todos os casos do banco. Um papel de boca
 * desconhecida não se soma a boca nenhuma — vale por si, e só por si.
 */
export function contarVozes(idsNaMesa) {
  const ids = [...(idsNaMesa || [])];
  const comRegistro = ids.filter((id) => apontadaPor(id));
  return contarVozesIndependentes(comRegistro) + (ids.length - comRegistro.length);
}

/**
 * Os feixes contaminados: origens que respondem por mais de uma alegação na
 * mesa. Cada feixe é uma corroboração aparente que não existe.
 */
export function feixesContaminados(idsNaMesa) {
  return agruparPorOrigem(idsNaMesa).filter((g) => g.ids.length > 1);
}
