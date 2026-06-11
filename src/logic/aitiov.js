// =====================================================================
// Gaveta Aitiov — o pilar "Como", em duas seções (§7):
//   Seção 1: cartas causais  → Mecanismo do Óbito
//   Seção 2: cartas ambientais (+ Janela da Morte) → Estado da Cena
// Funções puras: leem SOMENTE tagsOcultas e conclusões já registradas.
// =====================================================================

// ------------------------- Seção 1: Mecanismo -------------------------

export const HIPOTESES_MECANISMO = [
  {
    id: 'enforcamento',
    rotulo: 'Enforcamento — suspensão do corpo por laço (compatível com suicídio).',
  },
  {
    id: 'estrangulamento_ligadura',
    rotulo: 'Estrangulamento por ligadura — laço apertado por mãos alheias.',
  },
  {
    id: 'estrangulamento_manual',
    rotulo: 'Estrangulamento manual — pressão direta das mãos no pescoço.',
  },
  {
    id: 'envenenamento',
    rotulo: 'Envenenamento — administração de substância letal.',
  },
];

// Mecanismos específicos apontados por cartas; 'asfixia_generica' apoia
// qualquer asfixia, mas não basta para especificar o meio.
const MECANISMOS_ESPECIFICOS = ['enforcamento', 'estrangulamento_ligadura', 'estrangulamento_manual', 'envenenamento'];

export function validarHipoteseMecanismo(hipotese, cartas) {
  const causais = cartas.filter((c) => c.tagsOcultas.dominio === 'causal');
  if (causais.length === 0) {
    return { consistente: false, motivo: 'Nenhuma evidência causal foi inserida.' };
  }
  const indicados = causais.map((c) => c.tagsOcultas.indicaMecanismo).filter(Boolean);
  const especificos = indicados.filter((m) => MECANISMOS_ESPECIFICOS.includes(m));

  // Alguma carta inserida deve apontar especificamente o mecanismo da hipótese…
  if (!especificos.includes(hipotese.id)) {
    return {
      consistente: false,
      motivo: 'Nenhuma evidência inserida especifica esse mecanismo.',
    };
  }
  // …e nenhuma pode apontar especificamente outro mecanismo.
  if (especificos.some((m) => m !== hipotese.id)) {
    return {
      consistente: false,
      motivo: 'Evidências inseridas apontam mecanismo diverso do declarado.',
    };
  }
  // O instrumento (se identificado por alguma carta) integra a conclusão.
  const cartaInstrumento = causais.find((c) => c.tagsOcultas.instrumento);
  return {
    consistente: true,
    motivo: null,
    mecanismo: hipotese.id,
    instrumento: cartaInstrumento ? cartaInstrumento.tagsOcultas.instrumento : null,
  };
}

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
