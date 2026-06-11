// =====================================================================
// Gaveta Cronos — o pilar "Quando".
// Calcula a Janela da Morte por sobreposição (interseção) dos
// intervalos temporais das cartas inseridas. Funções puras: leem
// SOMENTE tagsOcultas e a hora de registro de cada carta.
// =====================================================================

// Hipóteses oferecidas ao jogador (tese-primeiro, §7), incluindo a isca
// do relógio parado. Intervalos na escala absoluta do jogo.
export const HIPOTESES_CRONOS = [
  {
    id: 'manha_14',
    rotulo: 'A morte ocorreu na manhã do dia 14, por volta das 09h00.',
    inicio: 8,
    fim: 10,
  },
  {
    id: 'noite_13',
    rotulo: 'A morte ocorreu na noite de 13 de outubro, entre as 18h00 e a meia-noite.',
    inicio: -6,
    fim: 0,
  },
  {
    id: 'tarde_13',
    rotulo: 'A morte ocorreu na tarde de 13 de outubro, entre o meio-dia e as 18h00.',
    inicio: -12,
    fim: -6,
  },
  {
    id: 'janela_ampla',
    rotulo: 'Só é possível afirmar uma janela ampla: entre a tarde de 13 e a madrugada de 14.',
    inicio: -12,
    fim: 4,
  },
];

// Converte uma carta temporal registrada no intervalo absoluto de morte
// que ela admite: a morte ocorreu entre (registro - máximo) e
// (registro - mínimo) horas. Cartas inconclusivas não informam nada.
export function intervaloDaCarta(carta) {
  const tags = carta.tagsOcultas;
  if (tags.dominio !== 'temporal' || tags.inconclusiva) return null;
  if (typeof tags.valorMinimoHoras !== 'number') return null;
  const fim = carta.horaRegistro - tags.valorMinimoHoras;
  const inicio =
    typeof tags.valorMaximoHoras === 'number' ? carta.horaRegistro - tags.valorMaximoHoras : -Infinity;
  return { inicio, fim };
}

// Interseção dos intervalos de 2+ cartas temporais.
// Retorna { janela, motivo } — janela é null quando não há convergência.
export function calcularJanelaMorte(cartas) {
  const temporais = cartas.filter((c) => c.tagsOcultas.dominio === 'temporal');
  if (temporais.length < 2) {
    return { janela: null, motivo: 'A convergência exige ao menos dois sinais temporais.' };
  }
  const intervalos = temporais.map(intervaloDaCarta).filter(Boolean);
  if (intervalos.length < 2) {
    return { janela: null, motivo: 'Sinais inconclusivos demais para estabelecer convergência.' };
  }
  const inicio = Math.max(...intervalos.map((i) => i.inicio));
  const fim = Math.min(...intervalos.map((i) => i.fim));
  if (inicio > fim) {
    return { janela: null, motivo: 'Os sinais temporais inseridos contradizem-se entre si.' };
  }
  return { janela: { inicio, fim }, motivo: null };
}

// Tese-primeiro: a hipótese é consistente se a convergência das
// evidências couber inteiramente dentro dela. Nunca se revela se a
// hipótese é "a verdadeira" — apenas a consistência com o inserido.
export function validarHipoteseCronos(hipotese, cartas) {
  const { janela, motivo } = calcularJanelaMorte(cartas);
  if (!janela) return { consistente: false, janela: null, motivo };
  const cabe = hipotese.inicio <= janela.inicio && janela.fim <= hipotese.fim;
  if (!cabe) {
    return {
      consistente: false,
      janela: null,
      motivo: 'A hipótese declarada não acomoda a convergência dos sinais inseridos.',
    };
  }
  // A conclusão registra a CONVERGÊNCIA (interseção), não o rótulo da hipótese.
  return { consistente: true, janela, motivo: null };
}
