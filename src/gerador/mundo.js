// =====================================================================
// O MUNDO DE UMA SEED — orquestrador da FASE 2 (design em
// docs/game-design-simulacao.md §4.2).
//
// Módulo GERADOR-FACING (o runtime jamais o importa; guarda no qa.mjs).
//
// ORDEM DE GERAÇÃO (normativa): cidade → elenco (arquétipos × demografia,
// Fase 1) → inserção espacial → grafo de avistamentos → interiores dos
// locais ELEGÍVEIS a cena (LOD por relevância). As fases seguintes
// consomem este mundo: a Fase 3 escolhe a cena do crime entre os prédios
// e roda o autobattler no grid do interior correspondente.
//
// Saída: JSON puro, serializável — o mesmo contrato do pacote de caso.
// Mesma seed → mesmo mundo, byte a byte (guarda de replay no qa.mjs).
// =====================================================================

import { gerarElenco } from './amostragem.js';
import { gerarCidade } from './cidade.js';
import { inserirElenco, derivarGrafoAvistamentos } from './insercao.js';
import { gerarInterior } from './interiores.js';

// Gera o mundo completo de uma seed.
//   opts.n              : tamanho do elenco (padrão 8, como na Fase 1).
//   opts.locaisElegiveis: ids de prédios elegíveis a cena — o chamador da
//     Fase 3 passará cena do crime / interferência / interrogatório. Até
//     lá, o padrão demonstra o LOD com dois locais deterministas do
//     próprio elenco: a moradia do primeiro personagem e o trabalho do
//     segundo (endereços que sempre existem).
export function gerarMundo(seed, opts = {}) {
  const n = opts.n ?? 8;
  const cidade = gerarCidade(seed);
  const elenco = inserirElenco(cidade, gerarElenco(seed, n), seed);
  const grafoAvistamentos = derivarGrafoAvistamentos(cidade, elenco);

  const locaisElegiveis =
    opts.locaisElegiveis ??
    [...new Set([elenco[0]?.pacoteEspacial.moradia, elenco[1]?.pacoteEspacial.trabalho].filter(Boolean))];

  // REGRA DE EXISTÊNCIA ESPACIAL: interior SÓ para local elegível — o QA
  // acusa interior órfão. A classe do morador (primeiro que ali mora;
  // senão, quem ali trabalha) dá a leitura social da mobília.
  const interiores = {};
  for (const predioId of locaisElegiveis) {
    const morador =
      elenco.find((p) => p.pacoteEspacial.moradia === predioId) ||
      elenco.find((p) => p.pacoteEspacial.trabalho === predioId);
    interiores[predioId] = gerarInterior(cidade, predioId, seed, morador?.classeSocial ?? null);
  }

  return {
    seed: cidade.seed,
    cidade,
    elenco,
    grafoAvistamentos,
    locaisElegiveis,
    interiores,
  };
}
