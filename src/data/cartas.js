// =====================================================================
// Catálogo de cartas do caso tutorial "O Álibi de Corda".
//
// Toda carta tem duas camadas (§6 do contexto):
//   - camada narrativa: textoDisplay, carimboPadrao, descricao (o jogador vê)
//   - camada lógica: tagsOcultas (somente o motor lê)
//
// Cartas do corpo podem degradar: o campo `estados` lista os estados
// possíveis em função do IPM (intervalo post-mortem) no momento da
// extração. `ipmAte: null` significa "daqui em diante".
//
// Horas declaradas em álibis usam a escala absoluta do jogo
// (negativas = 13/out; ver src/data/seed.js).
// =====================================================================

export const CARTAS = [
  // ===================== O CORPO =====================
  {
    id: 'ev_rigor',
    localidade: 'corpo',
    custoTempo: 2,
    estados: [
      {
        ipmAte: 24,
        textoDisplay: 'Articulações Rígidas',
        carimboPadrao: 'Rigor Mortis Pleno',
        descricao:
          'Mandíbula, pescoço e membros oferecem resistência total à flexão. A rigidez tomou o corpo inteiro.',
        // A carta carrega o ESTADO observado bruto; quem o converte numa
        // janela é o modelo forense universal (src/logic/tempo_morte.js).
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'rigor_mortis',
          estadoRigor: 'pleno',
          estadoDegradacao: 'ativo',
        },
      },
      {
        ipmAte: 36,
        textoDisplay: 'Rigidez em Dissolução',
        carimboPadrao: 'Rigor Mortis em Resolução',
        descricao:
          'A mandíbula já cede; os joelhos ainda resistem. A rigidez se desfaz na mesma ordem em que veio.',
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'rigor_mortis',
          estadoRigor: 'resolucao',
          estadoDegradacao: 'degradado',
        },
      },
      {
        ipmAte: null,
        textoDisplay: 'Corpo Flácido',
        carimboPadrao: 'Sinal Inconclusivo',
        descricao:
          'Nenhuma resistência articular. O que o rigor tinha a dizer, já não diz mais.',
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'rigor_mortis',
          inconclusiva: true,
          estadoDegradacao: 'perdido',
        },
      },
    ],
  },
  {
    id: 'ev_livores',
    localidade: 'corpo',
    custoTempo: 1,
    textoDisplay: 'Manchas Violáceas no Dorso',
    carimboPadrao: 'Livores Fixos',
    descricao:
      'Manchas vinhosas cobrem as costas e a face posterior das pernas. Não esmaecem sob a pressão do polegar: estão fixas.',
    tagsOcultas: {
      dominio: 'temporal',
      subDominio: 'livor_mortis',
      estadoLivor: 'fixo', // não esmaece sob pressão: morte de ≥12h (sem teto)
      posicaoCompativel: true,
    },
  },
  {
    id: 'ev_sulco',
    localidade: 'corpo',
    custoTempo: 1,
    textoDisplay: 'Sulco Horizontal no Pescoço',
    carimboPadrao: 'Sulco Cervical Horizontal',
    descricao:
      'Um sulco uniforme circunda o pescoço em plano horizontal, sem o trajeto ascendente que a suspensão de um corpo desenharia.',
    tagsOcultas: {
      dominio: 'causal',
      subDominio: 'sulco_cervical',
      indicaMecanismo: 'estrangulamento_ligadura',
    },
  },
  {
    id: 'ev_petequias',
    localidade: 'corpo',
    custoTempo: 1,
    textoDisplay: 'Pontos Vermelhos nas Conjuntivas',
    carimboPadrao: 'Petéquias Conjuntivais',
    descricao:
      'Hemorragias puntiformes salpicam o branco dos olhos. A face guarda um tom azulado.',
    tagsOcultas: {
      dominio: 'causal',
      subDominio: 'asfixia',
      indicaMecanismo: 'asfixia_generica',
    },
  },
  {
    id: 'ev_fibras_sulco',
    localidade: 'corpo',
    custoTempo: 1,
    textoDisplay: 'Fibras Claras Incrustadas no Sulco',
    carimboPadrao: 'Fibras de Cânhamo no Sulco',
    descricao:
      'Sob a lente, filamentos vegetais claros, torcidos, presos à pele do sulco. Cânhamo de corda comum.',
    tagsOcultas: {
      dominio: 'causal',
      subDominio: 'instrumento',
      instrumento: 'fibra_canhamo',
    },
  },

  // ===================== A CENA DO CRIME =====================
  {
    id: 'ev_relogio',
    localidade: 'cena',
    custoTempo: 1,
    textoDisplay: 'Relógio de Lareira Esmagado',
    carimboPadrao: 'Relógio Parado às 09h00',
    descricao:
      'O relógio jaz no tapete, a caixa partida como por um pisão. Os ponteiros pararam exatamente às nove horas.',
    tagsOcultas: {
      dominio: 'ambiental',
      subDominio: 'cronologia_aparente',
      horaAparente: 9, // 09h00 de 14/out, na escala absoluta
      encenado: true,
      isca: true,
    },
  },
  {
    id: 'ev_gavetas',
    localidade: 'cena',
    custoTempo: 1,
    textoDisplay: 'Gavetas Reviradas',
    carimboPadrao: 'Desordem Seletiva',
    descricao:
      'Papéis ao chão, gavetas abertas — mas o relógio de ouro da vítima segue na corrente, e a caixa de soberanos, intacta na escrivaninha.',
    tagsOcultas: {
      dominio: 'ambiental',
      subDominio: 'desordem',
      aparentaRoubo: true,
      valoresIntactos: true,
      encenado: true,
    },
  },
  {
    id: 'ev_fechadura',
    localidade: 'cena',
    custoTempo: 1,
    textoDisplay: 'Fechadura dos Fundos Forçada',
    carimboPadrao: 'Arrombamento pelo Exterior',
    descricao:
      'A madeira do batente está lascada por alavanca, do lado de fora. Os riscos são rasos, hesitantes, de quem não tinha pressa — ou não precisava entrar.',
    tagsOcultas: {
      dominio: 'ambiental',
      subDominio: 'arrombamento',
      encenado: true,
    },
  },
  {
    id: 'ev_fio_la',
    localidade: 'cena',
    custoTempo: 1,
    textoDisplay: 'Fio de Lã Cinzenta na Gaveta',
    carimboPadrao: 'Fio de Lã Cinzenta',
    descricao:
      'Preso à fechadura da gaveta do escritório, um único fio de lã cinzenta, fina, de xale doméstico.',
    tagsOcultas: {
      dominio: 'vestigio',
      subDominio: 'fibra_tecido',
      tipoVestigio: 'la_cinzenta',
      pertenceA: 'sra_hudson',
      revelaSegredo: 'mentira_alibi',
    },
  },

  // ===================== A DELEGACIA =====================
  {
    id: 'dep_testamento',
    localidade: 'delegacia',
    custoTempo: 1,
    textoDisplay: 'Testamento do Relojoeiro',
    carimboPadrao: 'Herdeiro Único: Edgar Arthurs',
    descricao:
      'Lavrado há dois anos: a relojoaria, a casa e as economias do Sr. Arthurs passam integralmente ao sobrinho, Edgar.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'heranca',
      ligadoA: 'edgar_arthurs',
    },
  },
  {
    id: 'dep_dividas',
    localidade: 'delegacia',
    custoTempo: 1,
    textoDisplay: 'Cartas de Cobrança',
    carimboPadrao: 'Dívidas de Jogo de Edgar',
    descricao:
      'Três cartas de um clube de Moorford cobrando de Edgar Arthurs somas que um escrevente não junta em dez anos.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'dividas',
      ligadoA: 'edgar_arthurs',
    },
  },
  {
    id: 'dep_briga',
    localidade: 'delegacia',
    custoTempo: 1,
    textoDisplay: 'Queixa Registrada na Delegacia',
    carimboPadrao: 'Briga Pública com Blackwood',
    descricao:
      'Há três semanas, Thomas Blackwood e a vítima trocaram ameaças diante de meia taverna, por causa de uma dívida antiga.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'rancor',
      ligadoA: 'thomas_blackwood',
      isca: true,
    },
  },

  // ===================== INTERROGATÓRIO: EDGAR ARTHURS =====================
  {
    id: 'alibi_edgar',
    localidade: 'interrogatorio_edgar',
    custoTempo: 2,
    textoDisplay: 'Jantar no Clube Comercial de Moorford',
    carimboPadrao: 'Paradeiro Declarado: 20h–23h (13/out)',
    descricao:
      'Edgar declara ter jantado no Clube Comercial de Moorford na noite de 13, das oito às onze, voltando tarde para seus aposentos.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'alibi',
      declaranteId: 'edgar_arthurs',
      horaInicioDeclarada: -4, // 20h00 de 13/out
      horaFimDeclarada: -1, // 23h00 de 13/out
      corroborado: false,
    },
  },
  {
    id: 'ev_fibras_manga',
    localidade: 'interrogatorio_edgar',
    custoTempo: 2,
    textoDisplay: 'Fibras Claras no Punho do Casaco',
    carimboPadrao: 'Fibras de Cânhamo na Manga',
    descricao:
      'No punho direito do casaco de Edgar, filamentos vegetais claros, torcidos — idênticos, à lente, aos de corda de cânhamo.',
    tagsOcultas: {
      dominio: 'vestigio',
      subDominio: 'fibra_tecido',
      tipoVestigio: 'fibra_canhamo',
      pertenceA: 'edgar_arthurs',
    },
  },
  {
    id: 'comp_edgar',
    localidade: 'interrogatorio_edgar',
    custoTempo: 1,
    textoDisplay: 'Polidez Inabalável',
    carimboPadrao: 'Cooperação Estudada',
    descricao:
      'Edgar responde antes da pergunta terminar, oferece chá, lamenta o tio com frases prontas. Nada nele hesita — nem o luto.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'comportamento',
      ligadoA: 'edgar_arthurs',
    },
  },

  // ===================== INTERROGATÓRIO: SRA. HUDSON =====================
  {
    id: 'alibi_hudson',
    localidade: 'interrogatorio_hudson',
    custoTempo: 2,
    textoDisplay: 'No Quarto a Noite Toda',
    carimboPadrao: 'Paradeiro Declarado: 21h–07h (manhã seguinte)',
    descricao:
      'A Sra. Hudson declara ter-se recolhido às nove da noite de 13 e só deixado o quarto às sete da manhã seguinte.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'alibi',
      declaranteId: 'sra_hudson',
      horaInicioDeclarada: -3, // 21h00 de 13/out
      horaFimDeclarada: 7, // 07h00 de 14/out — a manhã seguinte
      corroborado: false,
    },
  },
  {
    id: 'comp_hudson',
    localidade: 'interrogatorio_hudson',
    custoTempo: 1,
    textoDisplay: 'Mãos Trêmulas e Respostas Curtas',
    carimboPadrao: 'Nervosismo Acentuado',
    descricao:
      'A governanta torce o avental, evita o olhar, responde em monossílabos. Algo nela treme que não é luto.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'comportamento',
      ligadoA: 'sra_hudson',
      isca: true,
    },
  },
  {
    id: 'ev_xale',
    localidade: 'interrogatorio_hudson',
    custoTempo: 1,
    textoDisplay: 'Xale de Lã Cinzenta com Fio Puxado',
    carimboPadrao: 'Xale Cinzento Danificado',
    descricao:
      'Sobre os ombros da Sra. Hudson, um xale de lã cinzenta com um fio puxado na barra — a mesma lã fina do fio achado na gaveta.',
    tagsOcultas: {
      dominio: 'vestigio',
      subDominio: 'fibra_tecido',
      tipoVestigio: 'la_cinzenta',
      pertenceA: 'sra_hudson',
      revelaSegredo: 'mentira_alibi',
    },
  },

  // ===================== INTERROGATÓRIO: THOMAS BLACKWOOD =====================
  {
    id: 'alibi_blackwood',
    localidade: 'interrogatorio_blackwood',
    custoTempo: 2,
    textoDisplay: 'Noite Inteira no The Crossed Keys',
    carimboPadrao: 'Paradeiro Declarado: 20h–00h (13/out)',
    descricao:
      'Blackwood serviu o próprio balcão das oito à meia-noite de 13, diante de uma taverna cheia. Dá os nomes de doze fregueses sem respirar.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'alibi',
      declaranteId: 'thomas_blackwood',
      horaInicioDeclarada: -4, // 20h00 de 13/out
      horaFimDeclarada: 0, // meia-noite
      corroborado: true,
    },
  },
  {
    id: 'comp_blackwood',
    localidade: 'interrogatorio_blackwood',
    custoTempo: 1,
    textoDisplay: 'Rancor Declarado sem Rodeios',
    carimboPadrao: 'Hostilidade Aberta',
    descricao:
      '"Não choro por ele, e o senhor não vai me fazer chorar." Blackwood odeia o morto com a franqueza de quem nada esconde.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'comportamento',
      ligadoA: 'thomas_blackwood',
    },
  },
];

// ---------------------------------------------------------------------
// Utilitários de catálogo (sem lógica de regra — apenas consulta)
// ---------------------------------------------------------------------

export function obterDefinicaoCarta(id) {
  return CARTAS.find((c) => c.id === id) || null;
}

// Resolve o estado narrativo/lógico atual de uma definição de carta em
// função do IPM (horas desde a morte) no momento da consulta. Cartas sem
// `estados` são imutáveis.
export function resolverEstadoCarta(definicao, ipmAtual) {
  if (!definicao.estados) {
    return {
      textoDisplay: definicao.textoDisplay,
      carimboPadrao: definicao.carimboPadrao,
      descricao: definicao.descricao,
      tagsOcultas: definicao.tagsOcultas,
    };
  }
  for (const estado of definicao.estados) {
    if (estado.ipmAte === null || ipmAtual <= estado.ipmAte) return estado;
  }
  return definicao.estados[definicao.estados.length - 1];
}
