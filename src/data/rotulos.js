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
  buril_gravador: 'buril de gravador',
  // Vocabulário do gerador (src/gerador/metodos.js + ponte da Fase 3).
  lamina_de_oficio: 'lâmina de ofício',
  cordao_torcido: 'cordão torcido',
  arma_de_ocasiao: 'arma de ocasião',
  papel_de_arsenico: 'papel de arsênico',
  pertence_arrancado: 'pertence arrancado na luta',
};

// Rótulos dos vestígios (material), usados no Confronto ao cravar o nexo
// e como fallback do monólogo quando o vestígio ligado não é o instrumento.
export const ROTULOS_VESTIGIO = {
  fibra_canhamo: 'fibra de cânhamo',
  buril_gravador: 'buril de gravador',
  vidro_mostrador: 'vidro de mostrador',
  cesta_ceia: 'cesta de ceia',
  carta_suplica: 'carta de súplica',
  assinatura_registro: 'assinatura no registro da estalagem',
  // Vocabulário do gerador (ponte da Fase 3 + interferência da Fase 4).
  lamina_de_oficio: 'lâmina de ofício',
  cordao_torcido: 'cordão torcido',
  arma_de_ocasiao: 'arma de ocasião',
  papel_de_arsenico: 'papel de arsênico',
  pertence_arrancado: 'pertence arrancado na luta',
  sangue_alheio: 'sangue que não é da vítima',
  pegada_ensanguentada: 'pegada ensanguentada',
  dividas_quitadas: 'dívidas quitadas de repente',
  corpo_da_testemunha: 'o corpo da testemunha',
  esfrega_fresca: 'esfrega fresca na cena',
  limpeza_interrompida: 'limpeza interrompida',
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
  silenciamento: 'o silêncio sobre a fraude descoberta',
  // Vocabulário do gerador (MOTIVOS_POTENCIAIS de src/gerador/arquetipos.js).
  divida_caderneta: 'a dívida de caderneta',
  seguro_de_enterro: 'a apólice de enterro',
  dote: 'o dote disputado',
  salario_atrasado: 'o salário retido',
  escandalo_gravidez: 'o falatório que queria calado',
  character_negado: 'a referência negada',
  despejo: 'o despejo assinado',
  rivalidade_capela_taverna: 'a rixa da capela com a taverna',
  recasamento_vigiado: 'o recasamento vigiado pela vila',
};

export const ROTULOS_PERIFERICO = {
  inocente_alibi: 'Inocente — paradeiro firmado',
  inocente_segredo: 'Inocente — mas guarda um segredo',
  sem_info: 'Sem juízo a declarar',
};

// A explicação que o ENCERRAMENTO paga quando a alegação-isca correspondente
// foi refutada (tag `explicacao` na carta; coletada pelo veredicto). É o
// parágrafo do epílogo que conta o fato verdadeiro por trás da leitura falsa
// — nunca aparece durante a investigação.
export const ROTULOS_EXPLICACAO = {
  luz_esquecida:
    'A luz vista de madrugada teve explicação mais simples que um homem vivo: o lampião da bancada, aceso desde a véspera, queimou sozinho até secar o depósito. Era essa a claridade que o moço do padeiro tomou pelo velho a trabalhar.',
};
