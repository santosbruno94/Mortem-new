// =====================================================================
// Rótulos de apresentação (camada narrativa) para valores da camada
// lógica. Usados por gavetas, Quadro de Revelações e monólogo — nunca
// pelas regras, que leem somente tags.
// =====================================================================

// Cobre todo o catálogo universal de causas (src/data/catalogo_causas.js),
// pois o jogador pode cravar qualquer uma delas.
export const ROTULOS_MECANISMO = {
  estrangulamento_ligadura: 'estrangulamento por ligadura',
  enforcamento: 'enforcamento',
  estrangulamento_manual: 'estrangulamento manual (esganadura)',
  sufocacao: 'sufocação',
  afogamento: 'afogamento',
  envenenamento_cianeto: 'envenenamento por cianeto',
  envenenamento_arsenico: 'envenenamento por arsênico',
  trauma_contuso: 'trauma contuso',
  ferida_arma_branca: 'ferida por arma branca',
  arma_de_fogo: 'ferida por arma de fogo',
};

export const ROTULOS_INSTRUMENTO = {
  fibra_canhamo: 'corda de cânhamo',
};

export const ROTULOS_ESTADO_CENA = {
  cena_encenada: 'cena encenada',
  roubo_interrompido: 'roubo interrompido',
  crime_passional: 'discussão violenta',
};

export const ROTULOS_MOTIVO = {
  heranca: 'a herança',
  dividas: 'as dívidas',
  rancor: 'o rancor',
};

export const ROTULOS_PERIFERICO = {
  inocente_alibi: 'Inocente — paradeiro firmado',
  inocente_segredo: 'Inocente — mas guarda um segredo',
  sem_info: 'Sem juízo a declarar',
};
