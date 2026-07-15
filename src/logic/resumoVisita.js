import { PERSONAGEM_POR_LOCALIDADE } from '../data/aparencias.js';
import { SUSPEITOS } from '../data/seed.js';

// =====================================================================
// LEMBRETE DE VISITA — o que o mapa recorda de um local JÁ VISITADO:
// quem recebeu o perito ali e quantas observações foram colhidas, para
// o jogador decidir se vale voltar. Camada de APRESENTAÇÃO pura: deriva
// de dados narrativos/UI (aparências, nomes, cartas registradas) e
// JAMAIS lê tagsOcultas — o motor de veredicto não participa.
// =====================================================================

const NOMES_PERSONAGEM = Object.fromEntries(SUSPEITOS.map((s) => [s.id, s.nome]));
// O delegado recebe na delegacia mas não é suspeito (não está em SUSPEITOS).
NOMES_PERSONAGEM['delegado_wycliffe'] = 'Delegado Wycliffe';

export function resumoVisita(localidadeId, cartasRegistradas) {
  const nCartas = cartasRegistradas.filter((c) => c.localidade === localidadeId).length;
  const personagemId = PERSONAGEM_POR_LOCALIDADE[localidadeId];
  const personagemNome = personagemId ? NOMES_PERSONAGEM[personagemId] || null : null;
  return { personagemNome, nCartas };
}
