import { PERSONAGEM_POR_LOCALIDADE } from '../data/aparencias.js';
import { SUSPEITOS } from '../data/seed.js';

const NOMES_PERSONAGEM = Object.fromEntries(SUSPEITOS.map((s) => [s.id, s.nome]));
NOMES_PERSONAGEM['delegado_wycliffe'] = 'Delegado Wycliffe';

export function resumoVisita(localidadeId, cartasRegistradas) {
  const nCartas = cartasRegistradas.filter((c) => c.localidade === localidadeId).length;
  const personagemId = PERSONAGEM_POR_LOCALIDADE[localidadeId];
  const personagemNome = personagemId ? NOMES_PERSONAGEM[personagemId] || null : null;
  return { personagemNome, nCartas };
}
