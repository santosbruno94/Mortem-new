// =====================================================================
// RESOLVEDOR DE ASSET com FALLBACK — a ponte de runtime do "asset sob
// contrato" (FASE 2). Camada de APRESENTAÇÃO: o motor de veredicto jamais
// importa isto (nenhuma regra lê asset). Determinístico e sem rede.
//
//   resolverAsset(slot, chave) →
//     • URL empacotada, quando existe entrada no manifesto para
//       (slot, chave) E o arquivo declarado está de fato embarcado;
//     • null, caso contrário — e o componente renderiza o procedural atual.
//
// COMO O ASSET ENTRA NO BUNDLE (zero rede em runtime): import.meta.glob do
// Vite mapeia, em BUILD TIME, todo arquivo de DIR_BASE_ASSETS para a sua
// URL final empacotada. É por isso que este módulo mora fora do qa.mjs: o
// glob é do Vite. O qa.mjs valida o manifesto por fs puro (node), sem
// importar este arquivo. Arquivo ausente ⇒ não entra no mapa ⇒ resolvedor
// devolve null ⇒ fallback — o mesmo caminho de quando não há arte alguma.
// =====================================================================

import { entradaManifesto } from '../data/manifesto_assets.js';
import { DIR_BASE_ASSETS } from '../data/slots_assets.js';

// Mapa { caminhoRelativoAoModulo → URL empacotada } de tudo em
// src/assets/gravuras/**. `eager` resolve na carga do módulo; `?url`
// devolve a string da URL final (não o conteúdo). Com o diretório
// inexistente ou vazio, o mapa é {} e todo resolverAsset devolve null.
const MAPA_URLS = import.meta.glob('../assets/gravuras/**/*.{svg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// As chaves do glob são relativas a ESTE módulo (ex.:
// '../assets/gravuras/retrato/teste.svg'); o manifesto guarda o caminho
// relativo à RAIZ do repositório (ex.: 'src/assets/gravuras/retrato/teste.svg').
// Reindexamos por sufixo comum — o trecho a partir de DIR_BASE_ASSETS — para
// casar os dois sem depender de quão fundo cada um começa.
const URLS_POR_SUFIXO = {};
for (const [chave, url] of Object.entries(MAPA_URLS)) {
  const corte = chave.indexOf(DIR_BASE_ASSETS);
  const sufixo = corte >= 0 ? chave.slice(corte) : chave.replace(/^(\.\.\/)+/, '');
  URLS_POR_SUFIXO[sufixo] = url;
}

// A URL empacotada de um caminho de manifesto, ou undefined se o arquivo
// não está embarcado (removido, renomeado, nunca existiu).
function urlEmbarcada(caminho) {
  return URLS_POR_SUFIXO[caminho];
}

// Resolve o slot+chave para uma URL utilizável, ou null (fallback).
export function resolverAsset(slot, chave) {
  const entrada = entradaManifesto(slot, chave);
  if (!entrada) return null;
  const url = urlEmbarcada(entrada.caminho);
  return url || null;
}
