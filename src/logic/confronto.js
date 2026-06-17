// =====================================================================
// O CONFRONTO — cravar a mentira e o nexo, com a própria mão.
//
// É o ato dedutivo do jogador (§6): ele LIGA, por conta própria, uma fala
// ao fato físico que lhe dá sentido — sem o jogo revelar se acertou. Só o
// tribunal (veredicto.js) julga, no desfecho. Duas ligações produtivas:
//
//   • CONTRADIÇÃO: uma fala sobre a hora (relógio aparente, avistamento)
//     que a janela da morte desmente. Cravá-la expõe a ENCENAÇÃO — a
//     mentira foi plantada por alguém. (Reintroduz, como ATO do jogador, o
//     antigo "Confronto" que o Playtest 6 havia automatizado/removido.)
//
//   • NEXO: o vestígio cujo material casa com a arma do óbito liga seu dono
//     ao crime. A perícia é escolher o vestígio CERTO (o material que bate
//     com o instrumento que o legista cravou).
//
// Puro: produz as mesmas conclusões {tipo:'estado_cena'} e {tipo:'nexo'} que
// o tribunal e o Libelo já consomem — por isso veredicto.js não muda.
// =====================================================================

import { obterSuspeito } from '../data/seed.js';
import { ROTULOS_VESTIGIO } from '../data/rotulos.js';
import { formatHora } from './tempo.js';

// É uma "alegação sobre a hora" (passível de confronto com a janela)?
// Vale para o relógio aparente (horaAparente) e o avistamento (horaAvistamentoDeclarada).
export function ehAlegacaoDeHora(carta) {
  const t = carta.tagsOcultas || {};
  return (
    typeof t.horaAparente === 'number' ||
    (t.subDominio === 'avistamento' && typeof t.horaAvistamentoDeclarada === 'number')
  );
}

export function horaDaAlegacao(carta) {
  const t = carta.tagsOcultas || {};
  if (typeof t.horaAparente === 'number') return t.horaAparente;
  if (typeof t.horaAvistamentoDeclarada === 'number') return t.horaAvistamentoDeclarada;
  return null;
}

// Cravar a contradição: a fala não cabe na janela → a cena foi encenada.
export function contradicaoDeAlegacao(alegacao) {
  if (!alegacao) return null;
  const horaForjada = horaDaAlegacao(alegacao);
  if (horaForjada === null) return null;
  return {
    origem: 'confronto',
    titulo: 'Contradição na Hora',
    resumo: `A hora alegada (${formatHora(horaForjada)}) não cabe na janela da morte — a cena foi encenada.`,
    tagsOcultas: { tipo: 'estado_cena', estado: 'cena_encenada', horaForjada },
  };
}

// Cravar o nexo: o vestígio liga seu dono à arma, pelo material.
export function nexoDeVestigio(vestige) {
  if (!vestige || vestige.tagsOcultas.dominio !== 'vestigio') return null;
  const material = vestige.tagsOcultas.tipoVestigio;
  const suspeito = obterSuspeito(vestige.tagsOcultas.pertenceA);
  const rotuloMaterial = ROTULOS_VESTIGIO[material] || material;
  return {
    origem: 'confronto',
    titulo: 'Nexo de Presença',
    resumo: `O vestígio de ${rotuloMaterial} liga ${suspeito ? suspeito.nome : 'pessoa incerta'} à arma do óbito.`,
    // O motor compara este instrumento (o material do vestígio) com a arma
    // real: só casa se o jogador escolheu o vestígio certo.
    tagsOcultas: { tipo: 'nexo', suspeitoId: vestige.tagsOcultas.pertenceA, instrumento: material },
  };
}
