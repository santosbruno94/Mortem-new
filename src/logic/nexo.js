// =====================================================================
// Gaveta Nexo — o pilar "Presença".
// Entrada: 1 carta de vestígio + 1 Conclusão já registrada.
// Liga uma pessoa ao instrumento/circunstância do óbito.
// Funções puras: leem SOMENTE tagsOcultas das cartas e das conclusões.
// =====================================================================

import { SUSPEITOS } from '../data/seed.js';

// Hipóteses: uma por suspeito (o elenco do caso) + a hipótese de vestígio
// alheio ao crime. O conjunto deriva do elenco, não é uma lista de
// distratores escrita à mão. A gaveta apenas registra a ligação que o
// jogador AFIRMA (ETAPA 1, livro-caixa); a materialidade é julgada pelo
// tribunal (calcularVeredicto), que exige vestígio do réu igual ao
// instrumento real do óbito.
export const HIPOTESES_NEXO = [
  ...SUSPEITOS.map((s) => ({
    id: `liga_${s.id}`,
    suspeitoId: s.id,
    rotulo: `O vestígio liga ${s.nome} ao instrumento do óbito.`,
  })),
  {
    id: 'alheio',
    suspeitoId: null,
    rotulo: 'O vestígio é estranho ao mecanismo do óbito.',
  },
];
