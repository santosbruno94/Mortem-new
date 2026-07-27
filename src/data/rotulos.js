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
  envenenamento_laudano: 'envenenamento por láudano',
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
  travesseiro_ou_pano: 'pano de abafo',
  frasco_de_laudano: 'frasco de láudano',
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
  // OS-S1: as três classes novas do caso-escola.
  pegada_argila: 'meia pegada de argila da estrada',
  cera_de_bancada: 'cera de encerar cabo de ferramenta',
  maco_de_cartas: 'maço de cartas atadas',
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
  // Vocabulário do palco em anéis e do autobattler v2 (src/gerador/vestigios.js
  // + ponte da E2): classes que o banco já emite como tipoVestigio.
  bilhete_de_suplica: 'bilhete de súplica',
  nota_por_assinar: 'nota de trato por assinar',
  travesseiro_ou_pano: 'pano de abafo',
  frasco_de_laudano: 'frasco de láudano',
  acumulacao_frestas: 'sangue nas frestas do assoalho',
  peca_deslocada: 'peça fora do lugar',
  residuo_na_peca: 'resíduo na peça improvisada',
  peca_limpa_fora_de_hora: 'peça limpa fora de hora',
  fibra_na_aresta: 'fibra na aresta da peça',
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
  // OS-S1: o móbil do sexto homem. Não é a dívida em si (essa meia vila
  // tinha): é o que ficou em penhor por ela.
  divida_penhor: 'a dívida com o penhor tomado',
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
  // F4 da OS priors compostos (src/gerador/arquetipos.js §2.5).
  hipoteca_ou_arrendo: 'a hipoteca que não se paga',
  propriedade_da_esposa: 'o dinheiro que a lei deu à esposa',
  divida_de_jogo: 'a dívida de jogo',
  caridade_negada: 'o socorro negado',
};

export const ROTULOS_PERIFERICO = {
  inocente_alibi: 'Inocente — paradeiro firmado',
  inocente_segredo: 'Inocente — mas guarda um segredo',
  inocente_acesso: 'Inocente — teve o instrumento à mão',
  sem_info: 'Sem juízo a declarar',
};

// Rótulo do domínio na tarja das fichas (etiqueta de exposição). Fonte
// única — as fichas de evidência e de pessoa importam daqui. `testemunho`
// existe só no banco gerado (não tem aba no Glossário: sem verbetes).
export const ROTULOS_DOMINIO = {
  temporal: 'Temporal',
  causal: 'Causal',
  ambiental: 'Ambiental',
  comportamental: 'Comportamental',
  vestigio: 'Vestígio',
  testemunho: 'Testemunho',
};

// A explicação que o ENCERRAMENTO paga quando a alegação-isca correspondente
// foi refutada (tag `explicacao` na carta; coletada pelo veredicto). É o
// parágrafo do epílogo que conta o fato verdadeiro por trás da leitura falsa
// — nunca aparece durante a investigação.
export const ROTULOS_EXPLICACAO = {
  luz_esquecida:
    'A luz vista de madrugada teve explicação mais simples que um homem vivo: o lampião da bancada, aceso desde a véspera, queimou sozinho até secar o depósito. Era essa a claridade que o moço do padeiro tomou pelo velho a trabalhar.',
  // OS-S1 (PD-06): a segunda verdade por baixo da mesma leitura falsa. O
  // rapaz do padeiro errou o morador da sala, e não a sala.
  homem_da_madrugada:
    'Houve mesmo gente naquela sala antes de o dia nascer, e não era o relojoeiro. O recoveiro voltou à vila para a corrida das sacas que devia ao moinho, achou a porta do beco já mordida no batente, entrou pela claridade, e saiu levando da gaveta puxada o relógio de prata que empenhara em setembro. Chegou quase oito horas depois do buril, e foi preso por isso.',
};
