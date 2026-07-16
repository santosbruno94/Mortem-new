// =====================================================================
// CAMADAS DO RETRATO — a especificação (dado visual puro) do paper-doll
// de gravura (FASE 3). O retrato composto empilha, NESTA ordem, uma camada
// de asset por valor do genótipo fechado de src/data/aparencias.js. Cada
// asset é uma entrada do slot `retrato` no manifesto; ausente, a camada é
// pulada; TODAS ausentes, o RetratoPersonagem cai no SVG procedural atual
// (fallback integral). Nenhuma regra do motor lê isto — apresentação pura.
//
// A `chave` é um molde: o compositor (src/logic/retrato.js) substitui
// {campo} e {campo.subcampo} pelo valor do genótipo, produzindo a chave do
// asset no slot `retrato` (ex.: 'cabelo/grisalho_repartido'). O molde é
// dado; a substituição é lógica de apresentação — não há função aqui.
//
// Ordem de composição (de baixo para cima):
//   corpo → pele → traje → cabelo → pelosFaciais → (idade, modificador).
// A idade entra por último como camada MODIFICADORA (ex.: rugas sobre o
// rosto já montado); como toda camada, é opcional e some no fallback.
// =====================================================================

export const CAMADAS_RETRATO = [
  { nome: 'corpo', chave: 'corpo/{corpo}' },
  { nome: 'pele', chave: 'pele/{pele}' },
  { nome: 'traje', chave: 'traje/{traje}' },
  { nome: 'cabelo', chave: 'cabelo/{cabelo.cor}_{cabelo.estilo}' },
  { nome: 'pelosFaciais', chave: 'pelosFaciais/{pelosFaciais}' },
  { nome: 'idade', chave: 'idade/{idadeAparente}', modificador: true },
];
