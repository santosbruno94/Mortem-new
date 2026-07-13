// =====================================================================
// Utilitários puros de tempo.
//
// Escala absoluta do jogo: horas a partir da meia-noite de 14/out/1893.
// Valores negativos pertencem a 13/out (ex.: -2 = 22h00 de 13/out).
// =====================================================================

export const HORAS_CHEGADA_CENA = 11; // 11h00 de 14/out — imutável (§10)

// Intervalo post-mortem (horas desde a morte) num dado momento do relógio.
// Usado pela degradação de evidências e pela geração da carta de algor.
export function ipmAtual(horasJogo, horasMorteAntesChegada) {
  return horasMorteAntesChegada + (horasJogo - HORAS_CHEGADA_CENA);
}

// ---------------------------------------------------------------------
// Formatação de horas (apresentação; nenhuma regra depende disto)
// ---------------------------------------------------------------------

function decompor(horaAbsoluta) {
  const dia = 14 + Math.floor(horaAbsoluta / 24);
  const hora = ((horaAbsoluta % 24) + 24) % 24;
  return { dia, hora };
}

export function formatHora(horaAbsoluta) {
  const { hora } = decompor(horaAbsoluta);
  const inteiro = Math.floor(hora);
  const minutos = Math.round((hora - inteiro) * 60);
  return `${String(inteiro).padStart(2, '0')}h${String(minutos).padStart(2, '0')}`;
}

export function formatHoraComDia(horaAbsoluta) {
  const { dia } = decompor(horaAbsoluta);
  return `${formatHora(horaAbsoluta)} de ${dia}/out`;
}

// Mostrador do relógio de bolso: "14 de outubro, 15h00"
export function formatRelogio(horasJogo) {
  const { dia } = decompor(horasJogo);
  return `${dia} de outubro, ${formatHora(horasJogo)}`;
}

// Duração em horas para exibição: 1 → "1h"; 1.5 → "1h30" (nunca decimal).
export function formatDuracao(horas) {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

// Temperatura em prosa: inteiro ("22°C") ou meio grau por extenso ("22°C e
// meio") — nunca ponto decimal, anacrônico na prosa de 1893. Leituras que o
// relógio fracionário produza (viagens de 1h30) arredondam ao meio grau,
// o limite honesto de leitura de um termômetro de mercúrio.
export function formatTemperatura(graus) {
  const meiosGraus = Math.round(graus * 2) / 2;
  const inteiro = Math.floor(meiosGraus);
  return meiosGraus > inteiro ? `${inteiro}°C e meio` : `${inteiro}°C`;
}

// Janela da morte: "entre 20h00 e 23h00 de 13/out"
export function formatJanela(janela) {
  if (!janela) return 'janela indeterminada';
  if (janela.inicio === -Infinity && janela.fim === Infinity) return 'janela indeterminada';
  if (janela.inicio === -Infinity) return `antes de ${formatHoraComDia(janela.fim)}`;
  if (janela.fim === Infinity) return `depois de ${formatHoraComDia(janela.inicio)}`;
  const a = decompor(janela.inicio);
  const b = decompor(janela.fim);
  if (a.dia === b.dia) {
    return `entre ${formatHora(janela.inicio)} e ${formatHora(janela.fim)} de ${a.dia}/out`;
  }
  return `entre ${formatHoraComDia(janela.inicio)} e ${formatHoraComDia(janela.fim)}`;
}

// Faixa declarada num álibi, com a fórmula "manhã seguinte" quando a
// declaração atravessa a meia-noite (ex.: 21h00 de 13/out às 07h00 da
// manhã seguinte).
export function formatDeclaracao(horaInicio, horaFim) {
  const a = decompor(horaInicio);
  const b = decompor(horaFim);
  if (a.dia === b.dia) {
    return `das ${formatHora(horaInicio)} às ${formatHora(horaFim)} de ${a.dia}/out`;
  }
  return `das ${formatHora(horaInicio)} de ${a.dia}/out às ${formatHora(horaFim)} da manhã seguinte`;
}
