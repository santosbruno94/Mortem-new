// =====================================================================
// QUANTIZAÇÃO — atributos e traits viram comportamentos discretos de
// diálogo (FASE 1; design em docs/game-design-simulacao.md §3.1).
//
// Função PURA e SEM HASH: toda a variação já entrou na amostragem
// (amostragem.js); aqui só há limiares determinísticos. É a materialização
// da regra "nada de modificador contínuo invisível" — o que um atributo
// faz no diálogo é um comportamento nomeado do catálogo fechado, autorável
// e testável.
//
// FOR e INT NÃO geram comportamento de diálogo: pela tabela viva do §3.1,
// eles mapeiam à coluna de VESTÍGIO (resistência/ferimentos; elaboração do
// método) — consumidos pelo autobattler da Fase 3, não pelo depoimento.
// O lint de atributo órfão pleno (atributo sem vestígio E sem
// comportamento) é da Fase 3, quando a deposição de vestígios existir.
// =====================================================================

import { MAPA_TRAIT_COMPORTAMENTO, ORDEM_COMPORTAMENTOS } from './comportamentos.js';

// Converte { FOR, INT, WIS, CHA } (1–5) + traits em lista de ids de
// comportamento, deduplicada e na ordem canônica do catálogo (replay
// estável byte a byte). Valor 3 é neutro: não gera comportamento.
export function quantizarComportamentos(atributos, traits) {
  const conjunto = new Set();

  const wis = atributos?.WIS ?? 3;
  if (wis >= 4) conjunto.add('observacao_precisa');
  if (wis <= 2) conjunto.add('observacao_vaga');

  const cha = atributos?.CHA ?? 3;
  if (cha >= 4) conjunto.add('revela_facil');
  if (cha <= 2) conjunto.add('revela_sob_custo');

  for (const trait of traits || []) {
    const comportamento = MAPA_TRAIT_COMPORTAMENTO[trait];
    if (comportamento) conjunto.add(comportamento);
  }

  return ORDEM_COMPORTAMENTOS.filter((id) => conjunto.has(id));
}
