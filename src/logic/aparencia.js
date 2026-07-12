// =====================================================================
// API DE APARÊNCIA (camada narrativa/visual — o motor nunca lê isto).
//
// Hoje: o caso tutorial usa a curadoria de src/data/aparencias.js
// (seed fixa, sem randomização). Amanhã: o modo procedural deriva o
// genótipo inteiro do hash da seed, campo a campo, dos MESMOS
// vocabulários fechados — a assinatura já está fixada aqui.
// =====================================================================

import { APARENCIAS_CURADAS, VOCABULARIO_APARENCIA } from '../data/aparencias.js';
import { SEED_TUTORIAL } from '../data/seed.js';
import { hashString } from './hash.js';

// Aparência de um personagem: primeiro a curadoria do caso; na falta
// dela (personagem gerado), a derivação determinística pela seed.
export function obterAparencia(personagemId, seed = SEED_TUTORIAL) {
  return APARENCIAS_CURADAS[personagemId] || derivarAparenciaDeSeed(seed, personagemId);
}

// Deriva um genótipo completo do hash da seed salgado com o personagem
// e o nome do campo. Determinístico: a mesma seed + o mesmo personagem
// produzem sempre a mesma aparência (nunca Math.random — regra do §11).
export function derivarAparenciaDeSeed(seed, personagemId) {
  const sorteio = (campo, lista) =>
    lista[hashString(`${seed?.id || 'caso'}|${personagemId}|${campo}`) % lista.length];
  const V = VOCABULARIO_APARENCIA;
  return {
    corpo: sorteio('corpo', V.corpo),
    pele: sorteio('pele', V.pele),
    cabelo: { cor: sorteio('cabeloCor', V.cabeloCor), estilo: sorteio('cabeloEstilo', V.cabeloEstilo) },
    pelosFaciais: sorteio('pelosFaciais', V.pelosFaciais),
    idadeAparente: sorteio('idadeAparente', V.idadeAparente),
    traje: sorteio('traje', V.traje),
  };
}
