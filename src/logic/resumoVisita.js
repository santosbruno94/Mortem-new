import { obterSuspeitos, obterPersonagemDaLocalidade } from '../data/pacote_caso.js';

// =====================================================================
// LEMBRETE DE VISITA — o que o mapa recorda de um local JÁ VISITADO:
// quem recebeu o perito ali e quantas observações foram colhidas, para
// o jogador decidir se vale voltar. Camada de APRESENTAÇÃO pura: deriva
// de dados narrativos/UI (aparências, nomes, cartas registradas) e
// JAMAIS lê tagsOcultas — o motor de veredicto não participa.
// =====================================================================

export function resumoVisita(localidadeId, cartasRegistradas) {
  const nomes = Object.fromEntries(obterSuspeitos().map((s) => [s.id, s.nome]));
  // O delegado recebe na delegacia mas não é suspeito (não está em SUSPEITOS).
  nomes['delegado_wycliffe'] = 'Delegado Wycliffe';
  const nCartas = cartasRegistradas.filter((c) => c.localidade === localidadeId).length;
  const personagemId = obterPersonagemDaLocalidade(localidadeId);
  const personagemNome = personagemId ? nomes[personagemId] || null : null;
  return { personagemNome, nCartas };
}
