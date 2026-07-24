import { obterPersonagemDaLocalidade, obterNomePersonagem } from '../data/pacote_caso.js';

// =====================================================================
// LEMBRETE DE VISITA — o que o mapa recorda de um local JÁ VISITADO:
// quem recebeu o perito ali e quantas observações foram colhidas, para
// o jogador decidir se vale voltar. Camada de APRESENTAÇÃO pura: deriva
// de dados narrativos/UI (aparências, nomes, cartas registradas) e
// JAMAIS lê tagsOcultas — o motor de veredicto não participa.
// =====================================================================

export function resumoVisita(localidadeId, cartasRegistradas) {
  const nCartas = cartasRegistradas.filter((c) => c.localidade === localidadeId).length;
  const personagemId = obterPersonagemDaLocalidade(localidadeId);
  // Nome resolvido pelo PACOTE (suspeitos + não-suspeitos): nada de id
  // cravado aqui — num caso gerado, quem recebe é outro e o nome acompanha.
  const personagemNome = personagemId ? obterNomePersonagem(personagemId) : null;
  return { personagemNome, nCartas };
}
