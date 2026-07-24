// =====================================================================
// FAMÍLIAS DE MÉTODO — taxonomia de AGRUPAMENTO usada pelas medições
// (banda GE5 do qa.mjs e relatório espacial). Não vive no gerador porque
// não é regra de jogo: é régua de telemetria. FONTE ÚNICA — as duas
// cópias que existiam divergiriam sem aviso ao entrar um método novo.
// =====================================================================
export const FAMILIA_DO_METODO = {
  laminada: 'lamina', garrote: 'asfixia', esganadura: 'asfixia', sufocacao: 'asfixia',
  contundente: 'contuso', afogamento: 'afogamento', veneno_arsenico: 'veneno', laudano: 'veneno',
};
