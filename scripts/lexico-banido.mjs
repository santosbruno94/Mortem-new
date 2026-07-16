// =====================================================================
// LÉXICO BANIDO DA PROSA — espelho mecânico da skill anti-padrao-ia.
//
// A FONTE NARRATIVA continua sendo a skill (.claude/skills/anti-padrao-ia/
// SKILL.md, catálogo nº 9 "dedução vazada") e o guia de estilo §2.2
// (adjetivos que embutem veredicto). Este módulo só espelha aquela lista
// para consumo do linter (scripts/lint-prosa.mjs) — nada de duplicar a
// norma em prosa aqui. Alterou o grep da skill? Atualize este arquivo no
// MESMO commit, ou o linter fiscaliza uma norma defasada.
//
// Cada entrada: `id` (usado na allowlist do linter), `padrao` (fonte de
// RegExp, aplicada com flags 'giu') e `motivo` (a regra que a proíbe).
// Os padrões cobrem as flexões (gênero/número) dos termos do grep da skill:
//   demais|hesitante|estudad|decorad|conveniente|curios|estranh|forjad|
//   encenad|às pressas|sem pressa
// =====================================================================

export const LEXICO_BANIDO = [
  { id: 'demais', padrao: '\\bdemais\\b', motivo: 'juízo de medida do narrador (skill nº 9)' },
  { id: 'hesitante', padrao: '\\bhesitant\\w*', motivo: 'adjetivo de intenção (guia §2.2)' },
  { id: 'estudado', padrao: '\\bestudad[oa]s?\\b', motivo: 'adjetivo de intenção (guia §2.2)' },
  { id: 'decorado', padrao: '\\bdecorad[oa]s?\\b', motivo: 'adjetivo de intenção (guia §2.2)' },
  { id: 'conveniente', padrao: '\\bconvenient\\w*', motivo: 'adjetivo de juízo (guia §2.2)' },
  { id: 'curioso', padrao: '\\bcurios\\w*', motivo: 'o narrador estranhando pelo jogador (guia §2.2)' },
  { id: 'estranho', padrao: '\\bestranh\\w*', motivo: 'o narrador estranhando pelo jogador (guia §2.2)' },
  { id: 'forjado', padrao: '\\bforjad\\w*', motivo: 'conclusão de encenação vazada (guia §2.2)' },
  { id: 'encenado', padrao: '\\bencenad\\w*', motivo: 'conclusão de encenação vazada (guia §2.2)' },
  { id: 'as_pressas', padrao: 'às pressas', motivo: 'juízo de pressa de quem não está em cena (skill nº 9)' },
  { id: 'sem_pressa', padrao: 'sem pressa\\b', motivo: 'juízo de pressa de quem não está em cena (skill nº 9)' },
];
