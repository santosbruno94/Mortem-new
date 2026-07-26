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

import { apontadaPor } from '../data/procedencia.js';
import { obterProcedencia } from '../data/pacote_caso.js';

/**
 * Agrupa as cartas pela boca de onde a alegação saiu.
 *
 * O MAPA VEM DO CASO CARREGADO (OS-R9 Fase 1). Até aqui vinha cravado do
 * caso-escola, e por isso os 31 casos gerados caíam todos no *fallback* de
 * `contarVozes`. O parâmetro fica exposto para a auditoria poder correr a
 * mesma régua sobre um pacote que não é o carregado.
 *
 * @param {Iterable<string>} idsNaMesa
 * @param {object} mapa mapa de procedência do caso; default = o do pacote
 * @returns {Array<{ origem: string, ids: string[] }>} em ordem estável
 */
export function agruparPorOrigem(idsNaMesa, mapa = obterProcedencia()) {
  const grupos = new Map();
  for (const id of idsNaMesa || []) {
    const origem = apontadaPor(id, mapa);
    if (!origem) continue;
    if (!grupos.has(origem)) grupos.set(origem, []);
    grupos.get(origem).push(id);
  }
  // Ordem estável: pela origem, e os ids pela ordem do registro de procedência.
  const ordemDoRegistro = Object.keys(mapa || {});
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
export function contarVozesIndependentes(idsNaMesa, mapa = obterProcedencia()) {
  return agruparPorOrigem(idsNaMesa, mapa).length;
}

/**
 * A conta que a PROSA usa, e ela difere da de cima numa regra só: alegação
 * sem procedência registrada conta como voz PRÓPRIA.
 *
 * A de cima é a conta de auditoria — só sabe somar o que o mapa conhece, e
 * é assim que tem de ser para provar um feixe. Esta é a do desfecho, e a
 * regra existe por uma razão prática: um papel de boca desconhecida não se
 * soma a boca nenhuma — vale por si, e só por si.
 *
 * OS-R9: a regra fica, e deixa de ser o *fallback* de 31 casos em 31. Ela
 * continua a valer para o que o mapa honestamente não sabe — a corroboração
 * que vem «por mais de uma janela» não tem boca única, e registá-la numa
 * seria inventar uma testemunha.
 */
export function contarVozes(idsNaMesa, mapa = obterProcedencia()) {
  const ids = [...(idsNaMesa || [])];
  const comRegistro = ids.filter((id) => apontadaPor(id, mapa));
  return contarVozesIndependentes(comRegistro, mapa) + (ids.length - comRegistro.length);
}

/**
 * Os feixes contaminados: origens que respondem por mais de uma alegação na
 * mesa. Cada feixe é uma corroboração aparente que não existe.
 */
export function feixesContaminados(idsNaMesa, mapa = obterProcedencia()) {
  return agruparPorOrigem(idsNaMesa, mapa).filter((g) => g.ids.length > 1);
}
