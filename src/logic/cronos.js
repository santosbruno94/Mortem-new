// =====================================================================
// Gaveta Cronos — o pilar "Quando".
// O jogador NÃO escolhe a hora de um menu: ele a CALCULA. Cada indicador
// temporal coletado (algor, rigor, livor, última-vez-visto, rotina
// interrompida, registro mecânico) vira uma
// janela pelo modelo forense universal (src/logic/tempo_morte.js); a hora
// da morte é a INTERSEÇÃO dessas janelas. Funções puras: leem SOMENTE
// tagsOcultas e a hora de registro de cada carta.
// =====================================================================

import {
  janelaAlgor,
  janelaRigor,
  janelaLivor,
  travaUltimaVezVisto,
  travaRotinaInterrompida,
  janelaRegistroMecanico,
  intersecaoJanelas,
} from './tempo_morte.js';

// Converte uma carta temporal registrada na janela absoluta de morte que
// ela admite, à luz do modelo universal. Cartas inconclusivas (sinais já
// degradados) não informam nada e retornam null.
export function janelaDaCarta(carta) {
  const t = carta.tagsOcultas;
  if (t.dominio !== 'temporal' || t.inconclusiva) return null;
  const exame = carta.horaRegistro;
  switch (t.subDominio) {
    case 'algor_mortis':
      return janelaAlgor(t.temperaturaCorpo, t.temperaturaAmbiente, exame);
    case 'rigor_mortis':
      return janelaRigor(t.estadoRigor, exame);
    case 'livor_mortis':
      return janelaLivor(t.estadoLivor, exame);
    case 'ultima_vez_visto':
      return travaUltimaVezVisto(t.horaAvistamento);
    case 'rotina_interrompida':
      return travaRotinaInterrompida(t.horaRotina);
    case 'registro_mecanico':
      return janelaRegistroMecanico(t.janelaInicio, t.janelaFim);
    default:
      return null;
  }
}

// Janela da Morte = interseção das janelas dos indicadores reunidos.
// Quanto mais sinais conclusivos, mais estreita a janela; um sinal só a
// deixa larga. Retorna { janela, motivo } — janela é null quando não há
// indicador conclusivo ou quando os sinais se contradizem.
export function calcularJanelaMorte(cartas) {
  const temporais = (cartas || []).filter((c) => c.tagsOcultas.dominio === 'temporal');
  const janelas = temporais.map(janelaDaCarta).filter(Boolean);
  if (janelas.length === 0) {
    return { janela: null, motivo: 'Nenhum sinal temporal conclusivo foi reunido.' };
  }
  const janela = intersecaoJanelas(janelas);
  if (!janela) {
    return { janela: null, motivo: 'Os sinais temporais reunidos contradizem-se entre si.' };
  }
  return { janela, motivo: null };
}
