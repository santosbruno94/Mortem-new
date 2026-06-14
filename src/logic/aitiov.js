// =====================================================================
// Gaveta Aitiov — o pilar "Como", em duas seções (§7):
//   Seção 1: Mecanismo do Óbito — deduzido por ELIMINAÇÃO contra o
//            catálogo universal de causas (ver src/data/catalogo_causas.js
//            e o componente GavetaAitiov). Não há mais lista de mecanismos
//            por caso aqui.
//   Seção 2: cartas ambientais (+ Janela da Morte) → Estado da Cena.
// Funções puras: leem SOMENTE tagsOcultas e conclusões já registradas.
// =====================================================================

// ------------------------- Seção 2: Estado da Cena -------------------------
// As leituras de cena são um pequeno conjunto UNIVERSAL (servem a qualquer
// caso, não são alternativas escritas para este). A gaveta apenas registra
// a leitura que o jogador AFIRMA (ETAPA 1, livro-caixa); o cotejo da
// cronologia aparente com a Janela da Morte é raciocínio do jogador e o
// julgamento final cabe ao tribunal.
export const HIPOTESES_CENA = [
  {
    id: 'roubo_interrompido',
    rotulo: 'Roubo que terminou em homicídio: o ladrão foi surpreendido pela vítima.',
  },
  {
    id: 'cena_encenada',
    rotulo: 'Cena encenada: a desordem e a cronologia aparente foram forjadas.',
  },
  {
    id: 'crime_passional',
    rotulo: 'Discussão violenta: o crime irrompeu numa luta não premeditada.',
  },
];
