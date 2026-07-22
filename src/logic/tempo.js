// =====================================================================
// Utilitários puros de tempo.
//
// Escala absoluta do jogo: horas a partir da meia-noite de 14/out/1893.
// Valores negativos pertencem a 13/out (ex.: -2 = 22h00 de 13/out).
// =====================================================================

// Hora absoluta de chegada do perito à cena — valor DEFAULT do caso-escola.
// Deixou de ser cravado no motor: é parâmetro do pacote (parametrosCena.
// horasChegada), e este constante é apenas o default preservado (§10).
export const HORAS_CHEGADA_CENA = 13; // 13h00 de 14/out

// Calendário-base do relógio — DEFAULT do caso-escola. Antes cravado dentro
// de decompor/formatHora ("14", "out", "outubro"); agora é parâmetro do
// pacote (parametrosCena.calendario), com estes valores como default. Um
// caso futuro pode passar outra data sem tocar estas funções.
export const CALENDARIO_PADRAO = { diaBase: 14, mesAbrev: 'out', mesExtenso: 'outubro', ano: 1893 };

// Intervalo post-mortem (horas desde a morte) num dado momento do relógio.
// Usado pela degradação de evidências e pela geração da carta de algor.
// `horasChegada` é opcional (default = o caso-escola): a assinatura antiga
// de dois argumentos segue válida em todos os call-sites.
export function ipmAtual(horasJogo, horasMorteAntesChegada, horasChegada = HORAS_CHEGADA_CENA) {
  return horasMorteAntesChegada + (horasJogo - horasChegada);
}

// ---------------------------------------------------------------------
// Formatação de horas (apresentação; nenhuma regra depende disto).
// Cada função aceita um `cal` opcional (default = o calendário do caso-
// escola): sem argumento extra, a saída é byte-idêntica à de sempre.
// ---------------------------------------------------------------------

function decompor(horaAbsoluta, cal = CALENDARIO_PADRAO) {
  const dia = cal.diaBase + Math.floor(horaAbsoluta / 24);
  const hora = ((horaAbsoluta % 24) + 24) % 24;
  return { dia, hora };
}

export function formatHora(horaAbsoluta, cal = CALENDARIO_PADRAO) {
  const { hora } = decompor(horaAbsoluta, cal);
  let inteiro = Math.floor(hora);
  let minutos = Math.round((hora - inteiro) * 60);
  // Fração ≥ 0,9917 arredonda a 60 minutos — carrega na hora ("14h00",
  // nunca "13h60"). Inalcançável com dados em meias horas; blindado.
  if (minutos === 60) { inteiro = (inteiro + 1) % 24; minutos = 0; }
  return `${String(inteiro).padStart(2, '0')}h${String(minutos).padStart(2, '0')}`;
}

export function formatHoraComDia(horaAbsoluta, cal = CALENDARIO_PADRAO) {
  const { dia } = decompor(horaAbsoluta, cal);
  return `${formatHora(horaAbsoluta, cal)} de ${dia}/${cal.mesAbrev}`;
}

// Mostrador do relógio de bolso: "14 de outubro, 15h00"
export function formatRelogio(horasJogo, cal = CALENDARIO_PADRAO) {
  const { dia } = decompor(horasJogo, cal);
  return `${dia} de ${cal.mesExtenso}, ${formatHora(horasJogo, cal)}`;
}

// Duração em horas para exibição: 1 → "1h"; 1.5 → "1h30" (nunca decimal).
export function formatDuracao(horas) {
  let h = Math.floor(horas);
  let m = Math.round((horas - h) * 60);
  if (m === 60) { h += 1; m = 0; } // mesma blindagem do formatHora
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
export function formatJanela(janela, cal = CALENDARIO_PADRAO) {
  if (!janela) return 'janela indeterminada';
  if (janela.inicio === -Infinity && janela.fim === Infinity) return 'janela indeterminada';
  if (janela.inicio === -Infinity) return `antes de ${formatHoraComDia(janela.fim, cal)}`;
  if (janela.fim === Infinity) return `depois de ${formatHoraComDia(janela.inicio, cal)}`;
  const a = decompor(janela.inicio, cal);
  const b = decompor(janela.fim, cal);
  if (a.dia === b.dia) {
    return `entre ${formatHora(janela.inicio, cal)} e ${formatHora(janela.fim, cal)} de ${a.dia}/${cal.mesAbrev}`;
  }
  return `entre ${formatHoraComDia(janela.inicio, cal)} e ${formatHoraComDia(janela.fim, cal)}`;
}

// Faixa declarada num álibi, com a fórmula "manhã seguinte" quando a
// declaração atravessa a meia-noite (ex.: 21h00 de 13/out às 07h00 da
// manhã seguinte).
export function formatDeclaracao(horaInicio, horaFim, cal = CALENDARIO_PADRAO) {
  const a = decompor(horaInicio, cal);
  const b = decompor(horaFim, cal);
  if (a.dia === b.dia) {
    return `das ${formatHora(horaInicio, cal)} às ${formatHora(horaFim, cal)} de ${a.dia}/${cal.mesAbrev}`;
  }
  return `das ${formatHora(horaInicio, cal)} de ${a.dia}/${cal.mesAbrev} às ${formatHora(horaFim, cal)} da manhã seguinte`;
}
