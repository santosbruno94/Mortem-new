// =====================================================================
// O ECO DO MESTRE SOBRE A FALHA (FASE 6 — hook Hades sobre falhasVistas).
//
// Quando o jogador erra a acusação e pede para revê-la, o legista ganha UMA
// fala curta na Caderneta, escolhida a partir do CÓDIGO de falha do veredicto
// anterior. É a voz do tutorial reagindo ao método do jogador — nunca à
// autoria. Determinístico: a variante sai de hashString salgado (a mesma
// gramática de sorteio do monólogo), sem Math.random/Date.now.
//
// Módulo de APRESENTAÇÃO, puro. Consome só `veredicto.tipo` e os `codigo` de
// `veredicto.falhas` (nunca id, textoDisplay ou tag de carta) e as variantes
// de prosa do pacote. NÃO vincula o veredicto — o motor jamais o lê (guarda
// no qa.mjs). Sem `ecosDoMestre` no pacote (modo procedural), não há eco.
//
// Limite §2.4 do guia de estilo: a fala aponta ATENÇÃO ao método ("a janela
// que o senhor firmou brigou com as próprias cartas"), nunca conclusão. Em
// erro_judiciario jamais nomeia nem sugere o culpado — a prosa das variantes
// (src/data/ecos_mestre.js) é quem sustenta esse limite, sob o pipeline
// revisar-prosa.
// =====================================================================

import { escolherDeterministico } from './hash.js';

// Prioridade: uma fala por vez. Diante de várias falhas, o legista comenta a
// mais central para o método do tutorial — a JANELA (a mecânica-assinatura, e
// a leitura mais segura sob o §2.4). O réu vem por último e sempre em leitura
// de método (a prosa nunca nomeia ninguém). Códigos fora desta lista não
// geram eco (ficam com o detetive ou fora do domínio técnico do legista).
const PRIORIDADE_CODIGOS = [
  'sem_janela',
  'janela_nao_cobre',
  'janela_sem_sustentacao',
  'janela_imprecisa',
  'sem_nexo',
  'nexo_errado',
  'nexo_acessorio',
  'sem_descuidos',
  'reu_errado',
];

// Escolha determinística de variante: a fonte única mora em hash.js.
const escolher = escolherDeterministico;

// Deriva a fala do legista a partir do veredicto que acabou de cair.
//   veredicto : { tipo, falhas: [{ codigo }] } — o desfecho anterior.
//   ecos      : { titulo, porCodigo: { [codigo]: string[] } } — do pacote (ou
//               null/omitido no procedural).
//   salga     : prefixo da chave de sorteio (ex.: `${casoId}|${perito}`), para
//               que a variante varie por caso e por perito, como o monólogo.
// Devolve uma conclusão de id ESTÁVEL (origem 'mestre') para a Caderneta, ou
// null quando não há eco a dar (sem ecos no pacote, ou falha fora do escopo).
export function derivarEcoDoMestre(veredicto, ecos, salga = '') {
  if (!veredicto || !ecos || !ecos.porCodigo) return null;
  const codigos = new Set((veredicto.falhas || []).map((f) => f.codigo));
  const codigo = PRIORIDADE_CODIGOS.find(
    (c) => codigos.has(c) && (ecos.porCodigo[c] || []).length > 0
  );
  if (!codigo) return null;
  const resumo = escolher(ecos.porCodigo[codigo], `${salga}|mestre_eco|${codigo}|${veredicto.tipo}`);
  if (!resumo) return null;
  return {
    id: 'eco_mestre_falha',
    origem: 'mestre',
    titulo: ecos.titulo,
    resumo,
    tagsOcultas: { tipo: 'eco_falha', codigo },
  };
}
