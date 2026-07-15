// =====================================================================
// COMPOSITOR DE RETRATO — o paper-doll de gravura (FASE 3). Camada de
// APRESENTAÇÃO: o motor de veredicto jamais importa isto (nenhuma regra lê
// aparência nem retrato). Determinístico — a mesma aparência produz sempre
// a mesma pilha; zero Math.random, zero rede (o asset já vem embarcado).
//
//   comporRetrato(personagemId) →
//     lista ordenada de { nome, url } das camadas PRESENTES no manifesto,
//     de baixo para cima (src/data/camadas_retrato.js). Camada ausente é
//     pulada; se NENHUMA resolve, devolve [] — e o RetratoPersonagem
//     renderiza o SVG procedural atual (fallback integral).
// =====================================================================

import { obterAparencia } from './aparencia.js';
import { resolverAsset } from './assets.js';
import { CAMADAS_RETRATO } from '../data/camadas_retrato.js';

// Valor de um campo do genótipo por caminho pontilhado ('cabelo.cor').
function valorCampo(ap, caminho) {
  return caminho.split('.').reduce((o, k) => (o == null ? o : o[k]), ap);
}

// Resolve o molde de chave de uma camada contra o genótipo. Exportada para
// a guarda estática do qa.mjs verificar que todo molde fica bem-formado.
export function chaveDaCamada(ap, molde) {
  return molde.replace(/\{([^}]+)\}/g, (_, campo) => valorCampo(ap, campo) ?? '');
}

// Empilha as camadas presentes no manifesto para o personagem.
export function comporRetrato(personagemId) {
  const ap = obterAparencia(personagemId);
  const camadas = [];
  for (const c of CAMADAS_RETRATO) {
    const url = resolverAsset('retrato', chaveDaCamada(ap, c.chave));
    if (url) camadas.push({ nome: c.nome, url });
  }
  return camadas; // vazio => fallback procedural integral
}
