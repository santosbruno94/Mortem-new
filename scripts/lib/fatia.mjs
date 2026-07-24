// =====================================================================
// O NÚCLEO DE SOLVÊNCIA DE UMA FATIA FORENSE — o miolo comum às três
// réguas que existiam copiadas (problemasDaPonte e fatiaResolveSemQa no
// qa.mjs; metodicoResolve no gerar-casos.mjs): dada a lista de cartas JÁ
// RESOLVIDAS (estado por IPM aplicado) e a verdade de ouro, responde se
//   • a interseção das janelas temporais COBRE a hora da morte;
//   • os sinais causais CRAVAM o mecanismo correto;
//   • algum vestígio de presença PERTENCE ao réu;
//   • algum móbil correto APONTA o réu.
// Os refinamentos ficam em cada consumidor DE PROPÓSITO (não achatar):
// o gerar-casos exige janela PRECISA e nexo INSTRUMENTAL (réguas de
// embarque); a ponte confere também compatibilidade e serialização; o
// espelho da R2 aceita presença por pertenceA simples. Um endurecimento
// de régua é decisão local — o núcleo só garante que os quatro pilares
// são medidos com AS MESMAS funções do motor em todo lugar.
// =====================================================================

import { janelaDaCarta } from '../../src/logic/cronos.js';
import { intersecaoJanelas } from '../../src/logic/tempo_morte.js';
import { mecanismoCravado } from '../../src/data/catalogo_causas.js';

export function nucleoDaFatia(cartasResolvidas, verdade) {
  const temporais = cartasResolvidas.filter((c) => c.tagsOcultas?.dominio === 'temporal');
  const janela = intersecaoJanelas(temporais.map(janelaDaCarta).filter(Boolean));
  const janelaCobre =
    !!janela && janela.inicio <= verdade.horaMorteAbsoluta && verdade.horaMorteAbsoluta <= janela.fim;
  const sinais = cartasResolvidas
    .filter((c) => c.tagsOcultas?.dominio === 'causal')
    .map((c) => c.tagsOcultas.sinal)
    .filter(Boolean);
  const cravado = mecanismoCravado(sinais);
  const mecanismoCrava = !!cravado && cravado.id === verdade.mecanismoCorreto;
  const presencaOk = cartasResolvidas.some(
    (c) => c.tagsOcultas?.dominio === 'vestigio' && c.tagsOcultas.pertenceA === verdade.reuCorreto
  );
  const motivoOk = cartasResolvidas.some(
    (c) => c.tagsOcultas?.motivo === verdade.motivacaoCorreta && c.tagsOcultas?.ligadoA === verdade.reuCorreto
  );
  return { janela, janelaCobre, sinais, cravado, mecanismoCrava, presencaOk, motivoOk };
}
