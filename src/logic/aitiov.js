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

// `janela` é a conclusão Cronos já registrada (ou null). A seção 2 só
// produz leitura confiável da cena à luz do "quando" estabelecido.
export function validarHipoteseCena(hipotese, cartas, janela) {
  const ambientais = cartas.filter((c) => c.tagsOcultas.dominio === 'ambiental');
  if (ambientais.length === 0) {
    return { consistente: false, motivo: 'Nenhuma evidência ambiental foi inserida.' };
  }

  if (hipotese.id === 'cena_encenada') {
    if (!janela) {
      return {
        consistente: false,
        motivo: 'Sem uma Janela da Morte registrada, a cronologia da cena não pode ser confrontada.',
      };
    }
    const cartaHoraForjada = ambientais.find(
      (c) =>
        typeof c.tagsOcultas.horaAparente === 'number' &&
        (c.tagsOcultas.horaAparente < janela.inicio || c.tagsOcultas.horaAparente > janela.fim)
    );
    if (!cartaHoraForjada) {
      return {
        consistente: false,
        motivo: 'Nada na cena inserida contradiz a cronologia estabelecida.',
      };
    }
    return {
      consistente: true,
      motivo: null,
      estado: 'cena_encenada',
      horaForjada: cartaHoraForjada.tagsOcultas.horaAparente,
    };
  }

  if (hipotese.id === 'roubo_interrompido') {
    const haRoubo = ambientais.some((c) => c.tagsOcultas.aparentaRoubo);
    const valoresIntactos = ambientais.some((c) => c.tagsOcultas.valoresIntactos);
    if (!haRoubo) {
      return { consistente: false, motivo: 'Nada inserido sugere subtração de bens.' };
    }
    if (valoresIntactos) {
      return {
        consistente: false,
        motivo: 'A desordem inserida poupa os objetos de valor — inconsistente com roubo.',
      };
    }
    return { consistente: true, motivo: null, estado: 'roubo_interrompido', horaForjada: null };
  }

  if (hipotese.id === 'crime_passional') {
    const haLuta = ambientais.some((c) => c.tagsOcultas.sinaisLuta);
    if (!haLuta) {
      return { consistente: false, motivo: 'Nenhum sinal de luta consta das evidências inseridas.' };
    }
    return { consistente: true, motivo: null, estado: 'crime_passional', horaForjada: null };
  }

  return { consistente: false, motivo: 'Hipótese desconhecida.' };
}
