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
// NOTA: o campo `custoTempo` está DORMENTE desde o redesign (relógio mole):
// examinar não custa mais tempo — o relógio só anda ao VIAJAR (ver mapa.js).
// Mantido nos dados por ora; nenhuma lógica o lê.
//
// O campo opcional `vozMestre` (nas cartas do corpo) é a fala do legista
// sobre aquela observação, na campanha — omitido no procedural.
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
        textoDisplay: 'Corpo Endurecido',
        carimboPadrao: 'Duro dos maxilares aos joelhos',
        descricao:
          'Maxilar, pescoço e membros não cedem quando se tenta dobrá-los: o corpo enrijeceu por inteiro.',
        vozMestre: 'Rígido dos maxilares aos joelhos — isto é de horas, não de minutos. Entre doze e vinte e quatro, eu diria.',
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
        textoDisplay: 'Rigidez Cedendo',
        carimboPadrao: 'O maxilar já dobra; os joelhos ainda não',
        descricao:
          'O maxilar já dobra; os joelhos ainda resistem. A dureza some na mesma ordem em que chegou.',
        vozMestre: 'A rigidez já cede. Passou da véspera — e a hora exata começa a escapar entre os dedos.',
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
        carimboPadrao: 'Corpo mole, sem nenhuma rigidez',
        descricao:
          'Os membros dobram sem nenhuma resistência: a dureza já passou por completo. Isso já não marca a hora exata — diz apenas que faz mais de um dia.',
        vozMestre: 'Frouxo de todo. O rigor já não me serve: só posso jurar que faz mais de um dia.',
        // Degradado, porém AINDA VÁLIDO (relógio mole): o modelo o lê como
        // janela larga [36h, +∞), jamais nula. Ver tempo_morte.js (rigor.resolvido).
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'rigor_mortis',
          estadoRigor: 'resolvido',
          estadoDegradacao: 'resolvido',
        },
      },
    ],
  },
  {
    id: 'ev_livores',
    localidade: 'corpo',
    custoTempo: 1,
    textoDisplay: 'Manchas Arroxeadas nas Costas',
    carimboPadrao: 'Manchas que não empalidecem ao apertar',
    descricao:
      'Manchas vinhosas cobrem as costas e a parte de trás das pernas. Não empalidecem quando se aperta com o polegar.',
    vozMestre: 'As manchas fixaram-se nas costas e não cedem ao polegar — morto há meia jornada ao menos. E deitado assim desde então: ninguém o virou.',
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
    textoDisplay: 'Marca Reta em Volta do Pescoço',
    carimboPadrao: 'Marca funda e reta dando a volta no pescoço',
    descricao:
      'Uma marca funda e pareja dá a volta no pescoço na horizontal, sem subir em diagonal como deixaria um corpo pendurado.',
    vozMestre: 'Repare no sulco: reto, horizontal. Não é de forca — é de laço apertado por trás, por mãos alheias.',
    // Sinal de ASSINATURA do catálogo universal: crava a ligadura e
    // descarta as demais causas (ver src/data/catalogo_causas.js).
    tagsOcultas: {
      dominio: 'causal',
      subDominio: 'sulco_cervical',
      sinal: 'sulco_horizontal',
    },
  },
  {
    id: 'ev_petequias',
    localidade: 'corpo',
    custoTempo: 1,
    textoDisplay: 'Pontinhos Vermelhos no Branco dos Olhos',
    carimboPadrao: 'Pontinhos de sangue nos olhos; face azulada',
    descricao:
      'Pontinhos de sangue salpicam o branco dos olhos. A face e os lábios guardam um tom azulado.',
    vozMestre: 'Esses pontos nos olhos, esse azul na face — asfixia. Sufocou. De que modo, é o sulco que dirá.',
    // Sinal de FAMÍLIA: aponta asfixia (descarta veneno e trauma), mas não
    // diz qual asfixia — é preciso o sinal de assinatura para cravar.
    tagsOcultas: {
      dominio: 'causal',
      subDominio: 'asfixia',
      sinal: 'petequias_cianose',
    },
  },
  {
    id: 'ev_fibras_sulco',
    localidade: 'corpo',
    custoTempo: 1,
    textoDisplay: 'Fibras Claras Presas na Marca do Pescoço',
    carimboPadrao: 'Fibras de Cânhamo na Marca do Pescoço',
    descricao:
      'Sob a lente, filamentos vegetais claros e torcidos, presos à pele da marca. Cânhamo de corda comum.',
    vozMestre: 'Cânhamo, preso no sulco. A corda que o matou era de cânhamo comum — guarde isso.',
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
  {
    id: 'dep_visto_vivo',
    localidade: 'delegacia',
    custoTempo: 1,
    textoDisplay: 'Última Ceia Servida às Oito',
    carimboPadrao: 'Visto com Vida às 20h (13/out)',
    descricao:
      'No registro de Wycliffe, a governanta declara ter servido a ceia ao patrão às oito da noite de 13 e recolhido a louça em seguida — a última a vê-lo com vida.',
    // Âncora DURÁVEL de tempo: "última vez visto com vida" trava o INÍCIO da
    // janela (a morte não pode anteceder as 20h). Não degrada. Junto do livor
    // fixo (que dá o teto), o corpo sozinho fecha uma janela finita, em
    // qualquer rota — é o que garante "o durável sempre resolve".
    tagsOcultas: {
      dominio: 'temporal',
      subDominio: 'ultima_vez_visto',
      horaAvistamento: -4, // 20h00 de 13/out na escala absoluta
    },
  },
  {
    id: 'dep_avistamento_falso',
    localidade: 'delegacia',
    custoTempo: 1,
    textoDisplay: 'Vizinha Jura Tê-lo Visto à Janela',
    carimboPadrao: 'Avistamento Declarado: 08h (14/out)',
    descricao:
      'A Sra. Gale, da casa em frente, afirma à polícia ter visto o Sr. Arthurs à janela, vivo, "lá pelas oito" da manhã do dia 14 — pouco antes de o sobrinho dar o alarme.',
    // Alegação sobre a HORA, a ser confrontada com a janela da morte: jura a
    // vítima viva na manhã do dia 14, quando o corpo diz que ela morreu na
    // noite anterior. É a mentira a cravar no Confronto (Opção B). O motor
    // não revela isto ao jogador — quem percebe a impossibilidade é ele.
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'avistamento',
      declaranteId: 'sra_gale',
      horaAvistamentoDeclarada: 8, // 08h00 de 14/out na escala absoluta
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

  // ===================== CLUBE DE MOORFORD (nó distante, por lead) =====================
  {
    id: 'corrob_moorford',
    localidade: 'clube_moorford',
    custoTempo: 1,
    textoDisplay: 'Edgar Saiu do Clube Antes das Nove',
    carimboPadrao: 'Álibi de Edgar Furado',
    descricao:
      'O porteiro é categórico: o Sr. Arthurs deixou o jantar "lá pelas oito e meia", muito antes das onze que declarou. Hora de sobra para a estrada de volta.',
    // Corroboração OPCIONAL (nó distante, desbloqueado por lead): reforça que
    // Edgar teve oportunidade, mas NÃO é pilar do veredicto — o caso já fecha
    // pelo corpo. É atalho/reforço, jamais a chave (relógio mole).
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'corroboracao',
      ligadoA: 'edgar_arthurs',
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
      vozMestre: definicao.vozMestre,
      tagsOcultas: definicao.tagsOcultas,
    };
  }
  for (const estado of definicao.estados) {
    if (estado.ipmAte === null || ipmAtual <= estado.ipmAte) return estado;
  }
  return definicao.estados[definicao.estados.length - 1];
}
