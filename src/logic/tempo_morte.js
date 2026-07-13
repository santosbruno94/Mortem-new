// =====================================================================
// MODELO FORENSE DE TEMPO — universal, igual para todo caso.
//
// Converte cada INDICADOR observado no corpo numa JANELA de horas em que
// a morte pode ter ocorrido. A Janela da Morte de um caso é a INTERSEÇÃO
// das janelas de todos os indicadores colhidos.
//
// É DETERMINÍSTICO NOS DOIS SENTIDOS:
//   • Para frente  (estado*PorIpm / temperaturaPorIpm): dada a hora real
//     da morte e o momento do exame, diz em que estado o corpo se acha.
//     É o que produz a DEGRADAÇÃO (chegar tarde ao corpo perde o sinal).
//   • Para trás    (janela*): dado o estado observado, devolve a faixa de
//     horas que ele admite.
//
// Escala de tempo: a do jogo inteiro (ver src/logic/tempo.js). IPM = horas
// decorridas desde a morte. A janela é devolvida na ESCALA ABSOLUTA, a
// partir da hora do exame: se o indicador admite a morte entre `min` e
// `max` horas atrás, então a morte ocorreu entre (exame - max) e
// (exame - min).
//
// Valores invioláveis (§15 do MORTEM_CONTEXTO.md) — ajustáveis aqui sem
// tocar em lógica:
// =====================================================================

export const CONSTANTES_FORENSES = {
  // Algor mortis: o corpo perde ~1°C por hora a partir de 37°C até o ambiente.
  temperaturaInicial: 37, // °C ao morrer
  resfriamentoPorHora: 1, // °C por hora
  margemAlgorHoras: 2, // incerteza: ±2h em torno da estimativa por temperatura

  // Rigor mortis: surge 2–4h, pleno ~12h, desfaz-se entre 24–36h.
  rigor: {
    instalando: { ipmAte: 12, janelaIpm: [2, 12] }, // rigidez parcial, ainda subindo
    pleno: { ipmAte: 24, janelaIpm: [12, 24] }, // rigidez generalizada
    resolucao: { ipmAte: 36, janelaIpm: [24, 36] }, // rigidez já cedendo
    // Acima de 36h o rigor já se desfez. O sinal NÃO some: vira uma leitura
    // VAGA porém ainda válida ("morto há mais de um dia") — perde precisão,
    // não valor (relógio mole). Janela larga, sem teto: [36, +∞).
    resolvido: { ipmAte: null, janelaIpm: [36, Infinity] },
  },

  // Livor mortis: surge 1–2h; fixa-se (não esmaece sob pressão) após ~12h.
  livor: {
    horasFixacao: 12,
    movelJanelaIpm: [1, 12], // ainda esmaece sob o polegar → morte recente
    // fixo: piso de 12h, sem teto → [12, +∞)
  },
};

const AMBIENTE_PADRAO = 11; // °C — temperatura típica de um escritório vitoriano

// ---------------------------------------------------------------------
// Auxiliar: converte uma faixa de IPM [min, max] na janela absoluta de
// morte, à luz da hora em que o indicador foi observado (exame).
// `max` pode ser Infinity (sem teto): a morte pode ter sido arbitrariamente
// antes, então o início da janela fica em -Infinity.
// ---------------------------------------------------------------------
export function janelaIpmParaAbsoluta([ipmMin, ipmMax], horaExame) {
  const fim = horaExame - ipmMin;
  const inicio = ipmMax === Infinity ? -Infinity : horaExame - ipmMax;
  return { inicio, fim };
}

// =====================================================================
// PARA FRENTE — geração dos estados observados a partir do IPM
// =====================================================================

// Temperatura corporal esperada para um dado IPM (nunca abaixo do ambiente).
export function temperaturaPorIpm(ipm, ambiente = AMBIENTE_PADRAO) {
  const { temperaturaInicial, resfriamentoPorHora } = CONSTANTES_FORENSES;
  return Math.max(ambiente, temperaturaInicial - resfriamentoPorHora * ipm);
}

// Estado do rigor mortis esperado para um dado IPM.
export function estadoRigorPorIpm(ipm) {
  const { rigor } = CONSTANTES_FORENSES;
  if (ipm <= rigor.instalando.ipmAte) return 'instalando';
  if (ipm <= rigor.pleno.ipmAte) return 'pleno';
  if (ipm <= rigor.resolucao.ipmAte) return 'resolucao';
  return 'resolvido'; // rigor já desfeito: leitura vaga, porém ainda válida
}

// Estado do livor mortis esperado para um dado IPM.
export function estadoLivorPorIpm(ipm) {
  return ipm >= CONSTANTES_FORENSES.livor.horasFixacao ? 'fixo' : 'movel';
}

// =====================================================================
// PARA TRÁS — janela de morte a partir de cada indicador observado
// =====================================================================

// Algor: a diferença para 37°C, em graus, aproxima as horas decorridas,
// com margem de ±2h. Se o corpo já igualou o ambiente, nada informa.
export function janelaAlgor(temperaturaCorpo, ambiente, horaExame) {
  const amb = typeof ambiente === 'number' ? ambiente : AMBIENTE_PADRAO;
  const { temperaturaInicial, resfriamentoPorHora, margemAlgorHoras } = CONSTANTES_FORENSES;
  if (temperaturaCorpo <= amb) {
    // Equilíbrio térmico: o algor perdeu a PRECISÃO, mas não some — ainda
    // diz um piso. O corpo leva ~(37 - ambiente) horas para esfriar até
    // aqui, logo a morte foi há PELO MENOS esse tanto. Janela larga (sem
    // teto de recência), nunca nula. (Perecível perde precisão, não valor.)
    const horasAteEquilibrio = (temperaturaInicial - amb) / resfriamentoPorHora;
    return janelaIpmParaAbsoluta([horasAteEquilibrio, Infinity], horaExame);
  }
  const horas = (temperaturaInicial - temperaturaCorpo) / resfriamentoPorHora;
  return janelaIpmParaAbsoluta([horas - margemAlgorHoras, horas + margemAlgorHoras], horaExame);
}

// Rigor: cada estado é uma faixa de IPM. 'inconclusivo' não informa nada.
export function janelaRigor(estado, horaExame) {
  const { rigor } = CONSTANTES_FORENSES;
  const faixa = rigor[estado] ? rigor[estado].janelaIpm : null;
  if (!faixa) return null;
  return janelaIpmParaAbsoluta(faixa, horaExame);
}

// Livor: móvel → morte recente (≤12h); fixo → piso de 12h, sem teto.
export function janelaLivor(estado, horaExame) {
  const { livor } = CONSTANTES_FORENSES;
  if (estado === 'movel') return janelaIpmParaAbsoluta(livor.movelJanelaIpm, horaExame);
  if (estado === 'fixo') return janelaIpmParaAbsoluta([livor.horasFixacao, Infinity], horaExame);
  return null;
}

// Última vez visto com vida: a morte não pode anteceder esse instante.
// Trava o INÍCIO da janela (sem mexer no fim).
export function travaUltimaVezVisto(horaAvistamento) {
  if (typeof horaAvistamento !== 'number') return null;
  return { inicio: horaAvistamento, fim: Infinity };
}

// Rotina interrompida: um hábito invariável do morto (dar corda ao relógio,
// apagar o lampião, trancar a porta) que NÃO foi cumprido no horário de
// costume. O morto não chegou vivo a essa hora — trava o FIM da janela.
// É o espelho durável de travaUltimaVezVisto: aquele dá piso, este dá teto.
export function travaRotinaInterrompida(horaRotina) {
  if (typeof horaRotina !== 'number') return null;
  return { inicio: -Infinity, fim: horaRotina };
}

// Registro mecânico: um maquinismo (roda de contagem de relógio de badalar, contador
// de fábrica) que grava fisicamente uma faixa de horas para um evento da
// morte. Não depende do exame nem degrada — a janela é a que o mecanismo
// registrou.
export function janelaRegistroMecanico(janelaInicio, janelaFim) {
  if (typeof janelaInicio !== 'number' || typeof janelaFim !== 'number') return null;
  if (janelaInicio > janelaFim) return null;
  return { inicio: janelaInicio, fim: janelaFim };
}

// =====================================================================
// Interseção das janelas — a Janela da Morte propriamente dita
// =====================================================================

// Recebe uma lista de janelas { inicio, fim } (descarta nulos/inconclusivos)
// e devolve a sobreposição comum a todas. Retorna null se não há janela
// válida ou se os indicadores se contradizem (início > fim).
export function intersecaoJanelas(janelas) {
  const validas = (janelas || []).filter((j) => j && typeof j.inicio === 'number' && typeof j.fim === 'number');
  if (validas.length === 0) return null;
  const inicio = Math.max(...validas.map((j) => j.inicio));
  const fim = Math.min(...validas.map((j) => j.fim));
  if (inicio > fim) return null; // contradição entre os sinais
  return { inicio, fim };
}
