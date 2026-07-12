// =====================================================================
// APARÊNCIA DOS PERSONAGENS — camada 100% NARRATIVA/VISUAL.
//
// Regra inviolável: nada daqui entra em `tagsOcultas` nem é lido por
// veredicto.js/acusacao.js (guarda automática no scripts/qa.mjs). A
// aparência alimenta apenas a apresentação: os retratos 2D (gravura em
// SVG) e os parâmetros do corpo 3D da vítima.
//
// O GENÓTIPO usa vocabulários FECHADOS (abaixo): é isso que torna a
// derivação procedural trivial no futuro — cada campo de um personagem
// gerado sai de `vocabulario[hashString(seedSalgada) % n]`
// (src/logic/aparencia.js, derivarAparenciaDeSeed). No caso tutorial
// (seed fixa) os valores são CURADOS à mão, entrada por entrada.
// =====================================================================

// Vocabulários fechados do genótipo. Acrescentar valor novo aqui exige
// desenhar a camada correspondente no RetratoPersonagem (e, para a
// vítima, no CorpoModelo 3D).
export const VOCABULARIO_APARENCIA = {
  corpo: ['magro', 'medio', 'sobrepeso'],
  pele: ['palida', 'clara', 'corada', 'morena'],
  cabeloCor: ['preto', 'castanho', 'ruivo', 'grisalho', 'branco'],
  cabeloEstilo: ['curto', 'curto_ralo', 'repartido', 'despenteado', 'coque', 'calvo'],
  pelosFaciais: ['liso', 'bigode', 'barba', 'costeletas'],
  idadeAparente: ['jovem', 'madura', 'idosa'],
  traje: ['burgues', 'luto', 'servico', 'taverneiro', 'uniforme', 'modesto'],
};

// Amostras de cor (tons sépia, coerentes com a mesa à luz de vela).
export const CORES_PELE = {
  palida: '#e2d3bd',
  clara: '#d9bfa0',
  corada: '#d2a583',
  morena: '#b08a63',
};
export const CORES_CABELO = {
  preto: '#211c18',
  castanho: '#4a3520',
  ruivo: '#8a4a22',
  grisalho: '#98918a',
  branco: '#d0c9be',
};
export const CORES_TRAJE = {
  burgues: '#2e2418',
  luto: '#191410',
  servico: '#3a332a',
  taverneiro: '#4a3826',
  uniforme: '#252b36',
  modesto: '#332a20',
};

// -----------------------------------------------------------------
// Aparências CURADAS do caso tutorial (seed fixa — sem randomização).
// A descrição comportamental continua em seed.js; aqui é só o físico.
// -----------------------------------------------------------------
export const APARENCIAS_CURADAS = {
  // Sr. Geoffrey Arthurs, relojoeiro, 61 anos — a vítima.
  vitima: {
    corpo: 'medio',
    pele: 'palida',
    cabelo: { cor: 'grisalho', estilo: 'curto_ralo' },
    pelosFaciais: 'costeletas',
    idadeAparente: 'idosa',
    traje: 'burgues',
  },
  // Edgar Arthurs, 38 — sobrinho de luto impecável.
  edgar_arthurs: {
    corpo: 'magro',
    pele: 'clara',
    cabelo: { cor: 'castanho', estilo: 'repartido' },
    pelosFaciais: 'bigode',
    idadeAparente: 'madura',
    traje: 'luto',
  },
  // Sra. Mabel Hudson, 55 — governanta há dezessete anos.
  sra_hudson: {
    corpo: 'medio',
    pele: 'clara',
    cabelo: { cor: 'grisalho', estilo: 'coque' },
    pelosFaciais: 'liso',
    idadeAparente: 'idosa',
    traje: 'servico',
  },
  // Thomas Blackwood, 42 — taverneiro do The Crossed Keys.
  thomas_blackwood: {
    corpo: 'sobrepeso',
    pele: 'corada',
    cabelo: { cor: 'ruivo', estilo: 'despenteado' },
    pelosFaciais: 'barba',
    idadeAparente: 'madura',
    traje: 'taverneiro',
  },
  // Delegado Lemuel Wycliffe — fonte de informação, não suspeito.
  delegado_wycliffe: {
    corpo: 'sobrepeso',
    pele: 'corada',
    cabelo: { cor: 'grisalho', estilo: 'calvo' },
    pelosFaciais: 'bigode',
    idadeAparente: 'idosa',
    traje: 'uniforme',
  },
  // Testemunhas do caderno de ocorrências (aparecem no Painel de Álibis).
  sra_gale: {
    corpo: 'magro',
    pele: 'palida',
    cabelo: { cor: 'branco', estilo: 'coque' },
    pelosFaciais: 'liso',
    idadeAparente: 'idosa',
    traje: 'modesto',
  },
  sr_pruitt: {
    corpo: 'magro',
    pele: 'clara',
    cabelo: { cor: 'grisalho', estilo: 'curto' },
    pelosFaciais: 'costeletas',
    idadeAparente: 'idosa',
    traje: 'modesto',
  },
};

// Quem recebe o perito em cada localidade (para o retrato no overlay).
// Camada visual — nenhuma regra lê isto.
export const PERSONAGEM_POR_LOCALIDADE = {
  interrogatorio_edgar: 'edgar_arthurs',
  interrogatorio_hudson: 'sra_hudson',
  interrogatorio_blackwood: 'thomas_blackwood',
  delegacia: 'delegado_wycliffe',
};
