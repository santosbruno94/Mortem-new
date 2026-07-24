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
// (src/logic/aparencia.js, derivarAparenciaDeSeed). No caso do vertical
// slice (seed fixa) os valores são CURADOS à mão, entrada por entrada.
// =====================================================================

// Vocabulários fechados do genótipo. Acrescentar valor novo aqui exige
// desenhar a camada correspondente no RetratoPersonagem (e, para a
// vítima, na Prancha do corpo).
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
// Aparências CURADAS do caso (seed fixa — sem randomização).
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
  // Silas Crane, 47 — primeiro-oficial da relojoaria.
  silas_crane: {
    corpo: 'medio',
    pele: 'clara',
    cabelo: { cor: 'grisalho', estilo: 'repartido' },
    pelosFaciais: 'liso',
    idadeAparente: 'madura',
    traje: 'servico',
  },
  // Walter Arthurs, 44 — sobrinho herdeiro, negociante quebrado.
  walter_arthurs: {
    corpo: 'magro',
    pele: 'clara',
    cabelo: { cor: 'castanho', estilo: 'repartido' },
    pelosFaciais: 'bigode',
    idadeAparente: 'madura',
    traje: 'burgues',
  },
  // Sra. Agnes Rooke, 58 — viúva, dona da loja e correio.
  agnes_rooke: {
    corpo: 'magro',
    pele: 'palida',
    cabelo: { cor: 'grisalho', estilo: 'coque' },
    pelosFaciais: 'liso',
    idadeAparente: 'idosa',
    traje: 'luto',
  },
  // Caleb Grey, 46 — moleiro.
  caleb_grey: {
    corpo: 'sobrepeso',
    pele: 'corada',
    cabelo: { cor: 'castanho', estilo: 'despenteado' },
    pelosFaciais: 'barba',
    idadeAparente: 'madura',
    traje: 'modesto',
  },
  // Davey Tull, 15 — aprendiz.
  davey_tull: {
    corpo: 'magro',
    pele: 'clara',
    cabelo: { cor: 'castanho', estilo: 'curto' },
    pelosFaciais: 'liso',
    idadeAparente: 'jovem',
    traje: 'modesto',
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
  // Testemunhas do caderno de ocorrências (Painel de Álibis / registros).
  moco_padeiro: {
    corpo: 'magro',
    pele: 'clara',
    cabelo: { cor: 'preto', estilo: 'curto' },
    pelosFaciais: 'liso',
    idadeAparente: 'jovem',
    traje: 'modesto',
  },
  sra_wick: {
    corpo: 'magro',
    pele: 'palida',
    cabelo: { cor: 'branco', estilo: 'coque' },
    pelosFaciais: 'liso',
    idadeAparente: 'idosa',
    traje: 'modesto',
  },
};

// Nomes de exibição dos personagens que NÃO são suspeitos (não vivem em
// SUSPEITOS, mas recebem o perito e aparecem em lembretes/retratos).
// Camada narrativa — nenhuma regra lê isto; o pacote a embarca e a lógica
// de apresentação resolve nomes por obterNomePersonagem (pacote_caso.js).
export const NOMES_NAO_SUSPEITOS = {
  delegado_wycliffe: 'Delegado Wycliffe',
};

// Quem recebe o perito em cada localidade (para o retrato no overlay).
// Camada visual — nenhuma regra lê isto.
export const PERSONAGEM_POR_LOCALIDADE = {
  interrogatorio_silas: 'silas_crane',
  oficina: 'davey_tull',
  estalagem: 'walter_arthurs',
  papelaria: 'agnes_rooke',
  moinho: 'caleb_grey',
  delegacia: 'delegado_wycliffe',
};
