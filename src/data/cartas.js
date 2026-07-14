// =====================================================================
// Catálogo de cartas do caso "A Hora Emprestada".
//
// Toda carta tem duas camadas (§6 do contexto):
//   - camada narrativa: textoDisplay, carimboPadrao, descricao (o jogador vê)
//   - camada lógica: tagsOcultas (somente o motor lê)
//
// Cartas do corpo podem degradar: o campo `estados` lista os estados
// possíveis em função do IPM (intervalo post-mortem) no momento da
// extração. `ipmAte: null` significa "daqui em diante".
//
// O campo opcional `vozMestre` é a fala do legista sobre aquela observação
// (cartas do corpo e, por exceção de fair play, dep_dividas_walter) —
// omitido no procedural.
//
// Horas declaradas em álibis usam a escala absoluta do jogo
// (negativas = 13/out; ver src/data/seed.js).
// =====================================================================

export const CARTAS = [
  // ===================== O CORPO =====================
  {
    id: 'ev_rigor',
    localidade: 'corpo',
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
        carimboPadrao: 'Maxilar já solto; joelhos ainda rígidos',
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
          'Os membros dobram sem nenhuma resistência: a dureza passou por completo. O rigor, neste ponto, já não aponta a hora.',
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
    textoDisplay: 'Manchas Arroxeadas nas Costas',
    carimboPadrao: 'Manchas fixas, sem empalidecer à pressão',
    descricao:
      'Sob o polegar, as manchas não empalidecem; voltado o corpo, não migram. Onde ele pressiona o assoalho, a pele ficou pálida.',
    vozMestre: 'As manchas fixaram-se e não cedem ao polegar: morto há meia jornada, ao menos. E fixaram-se do lado em que ele está deitado.',
    tagsOcultas: {
      dominio: 'temporal',
      subDominio: 'livor_mortis',
      estadoLivor: 'fixo', // não esmaece sob pressão: morte de ≥12h (sem teto)
      posicaoCompativel: true,
    },
  },
  {
    id: 'ev_ferida',
    localidade: 'corpo',
    textoDisplay: 'Ferida Estreita no Pescoço',
    carimboPadrao: 'Ferida funda, de boca em losango, no pescoço',
    descricao:
      'À esquerda do pescoço, abaixo do ângulo do maxilar, uma abertura de meia polegada escassa, de bordas nítidas, sem ponte de tecido. A sonda desce mais fundo do que a boca é comprida; as duas extremidades da fenda fecham em ângulo.',
    vozMestre:
      'Bordas limpas, sem ponte de tecido: lâmina, não pancada. E mais funda que comprida — entrou de ponta e achou os vasos. Boca em losango é de haste de quatro faces; faca comum deixa uma ponta aguda e outra romba.',
    // Sinal de ASSINATURA do catálogo universal: crava a ferida por arma
    // branca e descarta as demais causas (ver src/data/catalogo_causas.js).
    tagsOcultas: {
      dominio: 'causal',
      subDominio: 'ferida',
      sinal: 'ferida_incisa',
    },
  },
  {
    id: 'ev_reacao_vital',
    localidade: 'corpo',
    textoDisplay: 'Bordas Vivas na Ferida',
    carimboPadrao: 'Sangue infiltrado nas bordas da ferida',
    descricao:
      'As bordas da fenda estão retraídas, afastadas uma da outra. O tecido em volta está empapado de sangue coagulado, que a esponja não desfaz.',
    vozMestre:
      'O tecido reagiu: retraiu e deixou o sangue infiltrar os planos. Ferida de homem vivo. Sobre um morto, a mesma lâmina abriria uma boca frouxa e pálida.',
    // Sinal MODIFICADOR: prova lesão em vida; não elimina causa alguma.
    tagsOcultas: {
      dominio: 'causal',
      subDominio: 'reacao_vital',
      sinal: 'reacao_vital',
    },
  },
  {
    id: 'ev_residuo_ferida',
    localidade: 'corpo',
    textoDisplay: 'Pó Vermelho na Ferida',
    carimboPadrao: 'Resíduo vermelho no canal da ferida',
    descricao:
      'Na borda inferior do canal, a lente acha um traço de pó vermelho-tijolo, fino como poeira de lápis, preso ao coágulo.',
    vozMestre:
      'Vermelho-de-polir. Pó de bancada de relojoeiro e de ourives: dá lustro ao ouro e ao aço. Estava dentro do canal, sob o coágulo.',
    tagsOcultas: {
      dominio: 'causal',
      subDominio: 'instrumento',
      instrumento: 'buril_gravador',
    },
  },
  {
    id: 'ev_relogio_bolso',
    localidade: 'corpo',
    textoDisplay: 'Relógio de Bolso Parado',
    carimboPadrao: 'Relógio do morto parado às 05h05, corda no fim',
    descricao:
      'Na corrente do colete, o relógio do morto: aberta a tampa, vidro inteiro, máquina sã, os ponteiros nas cinco e cinco — anotados antes de se tocar na coroa. A coroa resiste e vai-se enchendo; a poucas voltas, o tique retoma.',
    vozMestre:
      'Mola vazia, não partida: parou por falta de corda. Estes guardam trinta horas de marcha — a hora do mostrador fica a trinta horas da última vez que uma mão lhe deu corda.',
    // Âncora DURÁVEL de teto (rotina interrompida): o hábito da corda às 23h
    // não foi cumprido na sexta — a morte não pode ser posterior a ele. O
    // espelho do visto-com-vida; não degrada com o passar do relógio.
    tagsOcultas: {
      dominio: 'temporal',
      subDominio: 'rotina_interrompida',
      horaRotina: -1, // 23h00 de 13/out: a corda que não se deu
    },
  },

  // ===================== A CENA DO CRIME =====================
  {
    id: 'ev_relogio_lareira',
    localidade: 'cena',
    textoDisplay: 'Relógio de Lareira Esmagado',
    carimboPadrao: 'Relógio Parado às 08h45',
    descricao:
      'De perto, o vidro cedeu para dentro e a caixa abriu de um lado só; o rebordo do vidro leva um filete dourado, meio comido do uso. Os ponteiros descansam num quarto para as nove, sobre algarismos pintados a ouro.',
    tagsOcultas: {
      dominio: 'ambiental',
      subDominio: 'cronologia_aparente',
      horaAparente: 8.75, // 08h45 de 14/out, na escala absoluta
      encenado: true,
      isca: true,
    },
  },
  {
    id: 'ev_maquinismo',
    localidade: 'cena',
    textoDisplay: 'Roda de Contagem das Badaladas',
    carimboPadrao: 'Roda de contagem pousada na nona batida',
    descricao:
      'Pela caixa partida vê-se o trem das badaladas. A alavanca repousa no nono entalhe da roda de contagem; dali a roda não passou. O martelo está caído sobre a campainha, em descanso.',
    // Registro MECÂNICO: a roda de contagem data o esmagamento entre a nona
    // batida (21h) e a décima (22h) — a segunda leitura da mesma peça. O
    // saber que a converte está plantado no relógio irmão da oficina e no
    // verbete do Glossário; a conversão é do jogador.
    tagsOcultas: {
      dominio: 'temporal',
      subDominio: 'registro_mecanico',
      janelaInicio: -3, // 21h00 de 13/out
      janelaFim: -2, // 22h00 de 13/out
    },
  },
  {
    id: 'ev_vitrine',
    localidade: 'cena',
    textoDisplay: 'Balcão Revirado, Vitrine Fechada',
    carimboPadrao: 'Gavetas do balcão abertas; vitrine intacta',
    descricao:
      'As gavetas do balcão estão puxadas e a caixa do troco, vazia. Na vitrine ao lado, sob tampas fechadas, dez relógios de ouro em fila, as etiquetas de preço voltadas para cima.',
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
    textoDisplay: 'Fechadura dos Fundos Forçada',
    carimboPadrao: 'Marcas de alavanca no batente externo',
    descricao:
      'Os riscos na madeira são rasos e curtos, e param onde a lingueta cede. As lascas de tinta caíram para fora, sobre o degrau do beco.',
    tagsOcultas: {
      dominio: 'ambiental',
      subDominio: 'arrombamento',
      encenado: true,
    },
  },
  {
    id: 'ev_cesta_rooke',
    localidade: 'cena',
    textoDisplay: 'Cesta de Ceia para Dois',
    carimboPadrao: 'Cesta de vime com louça para dois',
    descricao:
      'Sob o guardanapo de cambraia, bordado a um canto com as iniciais A.R., dois cálices lavados e um bilhete a lápis: "Sexta, às oito, como sempre. — A."',
    tagsOcultas: {
      dominio: 'vestigio',
      subDominio: 'objeto_pessoal',
      tipoVestigio: 'cesta_ceia',
      pertenceA: 'agnes_rooke',
      revelaSegredo: 'noivado_secreto',
    },
  },
  {
    id: 'ev_suplica_cesto',
    localidade: 'cena',
    textoDisplay: 'Carta Amassada em Bola',
    carimboPadrao: 'Carta de súplica na letra de Walter Arthurs',
    descricao:
      'Uma folha amassada em bola, sem envelope nem selo. A letra pede "um adiantamento sobre o que há de ser meu", promete juros de praça e fecha com "seu sobrinho, que espera à porta". Datada de sexta-feira, 13.',
    tagsOcultas: {
      dominio: 'vestigio',
      subDominio: 'documento',
      tipoVestigio: 'carta_suplica',
      pertenceA: 'walter_arthurs',
      revelaSegredo: 'suplica_recusada',
    },
  },

  // ===================== A OFICINA =====================
  {
    id: 'ev_livro_ordens',
    localidade: 'oficina',
    textoDisplay: 'Livro de Ordens de Serviço',
    carimboPadrao: 'Consertos reclamados na coluna de S.C.',
    descricao:
      'O livro da bancada, aberto na semana. Três consertos reentrados com queixa no mesmo outono, todos rubricados "S.C." na coluna do executor. A letra do morto atravessa anos de páginas, miúda e firme, cada preço somado à margem e sublinhado. Na última entrada, a mesma letra, mais apertada: "pesar as caixas. Pettigrew, segunda."',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'silenciamento',
      ligadoA: 'silas_crane',
    },
  },
  {
    id: 'ev_estojo_buril',
    localidade: 'oficina',
    textoDisplay: 'Buril Claro no Estojo',
    carimboPadrao: 'Buril limpo entre ferramentas enceradas',
    descricao:
      'O estojo traz o nome de Silas Crane a fogo na tampa. Os cabos vestem a mesma cera parda de uso; um único buril está claro, sem a cera dos outros, e a junta entre o aço e o cabo guarda uma linha escura de umidade.',
    tagsOcultas: {
      dominio: 'vestigio',
      subDominio: 'instrumento_oficio',
      tipoVestigio: 'buril_gravador',
      pertenceA: 'silas_crane',
    },
  },
  {
    id: 'ev_anel_encomenda',
    localidade: 'oficina',
    textoDisplay: 'Aro de Ouro por Gravar',
    carimboPadrao: 'Encomenda particular do relojoeiro',
    descricao:
      'Sob o pano, um aro de ouro liso, estreito e ainda sem uso. A ordem de serviço vem presa a ele, no punho do morto e na mesma letra miúda: "gravar por dentro — G.A. & A.R. — pronto até 30 de outubro. Particular."',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'comportamento',
      ligadoA: 'agnes_rooke',
    },
  },
  {
    id: 'dep_habito_corda',
    localidade: 'oficina',
    textoDisplay: 'O Hábito da Corda',
    carimboPadrao: 'Corda ao relógio de bolso todas as noites, às 23h',
    descricao:
      'Davey, os olhos erguidos do serviço: "O patrão dava corda no relógio do bolso às onze, antes de subir pra deitar. Todas as noites, sem faltar uma. Deixava eu ouvir o tique depois, dizia que o de bolso guarda trinta horas e que homem que deixa a corda acabar não merece o ofício."',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'comportamento',
      ligadoA: 'davey_tull',
    },
  },
  {
    id: 'alibi_davey',
    localidade: 'oficina',
    textoDisplay: 'A Mesma Resposta Duas Vezes',
    carimboPadrao: 'Paradeiro declarado: saiu às 19h30; em casa às 20h',
    descricao:
      '"Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem, eu para casa. Minha mãe serviu a sopa às oito." Perguntado de novo ao fim da visita, repete as mesmas palavras, na mesma ordem.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'alibi',
      declaranteId: 'davey_tull',
      horaInicioDeclarada: -4.5, // 19h30 de 13/out
      horaFimDeclarada: 9, // manhã seguinte, quando abriu a loja com Silas
      corroborado: true, // a mãe e o inquilino o têm em casa desde as 20h
    },
  },

  // ===================== INTERROGATÓRIO: SILAS CRANE =====================
  {
    id: 'alibi_silas',
    localidade: 'interrogatorio_silas',
    textoDisplay: 'Recolhido à Estalagem às Oito',
    carimboPadrao: 'Paradeiro declarado: 20h–manhã (estalagem)',
    descricao:
      '"Fechei a oficina às sete e meia e saí com o rapaz. Ceei pouco, recolhi-me ao quarto às oito e não tornei a sair. De manhã abri a loja, como sempre." Dá as horas de um fôlego, sem pausa entre elas.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'alibi',
      declaranteId: 'silas_crane',
      horaInicioDeclarada: -4, // 20h00 de 13/out
      horaFimDeclarada: 7, // 07h00 de 14/out
      corroborado: false,
    },
  },
  {
    id: 'comp_silas',
    localidade: 'interrogatorio_silas',
    textoDisplay: 'Teorias sobre o Ladrão',
    carimboPadrao: 'Solicitude constante',
    descricao:
      'Oferece a cadeira melhor, chega o lampião, e oferece também uma teoria: gente de fora, da estrada, atrás do troco do caixa. Volta a ela três vezes durante a conversa, com variações, sem que ninguém pergunte.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'comportamento',
      ligadoA: 'silas_crane',
    },
  },
  {
    id: 'ev_vidro_dobra',
    localidade: 'interrogatorio_silas',
    textoDisplay: 'Vidro na Dobra da Calça',
    carimboPadrao: 'Lasca de vidro abaulado na bainha',
    descricao:
      'Na bainha da calça de Silas, uma lasca de vidro do tamanho de meia unha. À lente, o caco é abaulado, fino como papel, e traz na borda um fio de tinta dourada.',
    // Segundo vestígio de PRESENÇA do réu: não casa com a arma, mas pertence
    // a ele — ligado junto ao instrumental, reforça sem gafe; sozinho não
    // firma o nexo (o instrumental continua obrigatório).
    tagsOcultas: {
      dominio: 'vestigio',
      subDominio: 'fragmento',
      tipoVestigio: 'vidro_mostrador',
      pertenceA: 'silas_crane',
    },
  },

  // ===================== A DELEGACIA =====================
  {
    id: 'dep_testamento',
    localidade: 'delegacia',
    textoDisplay: 'Testamento do Relojoeiro',
    carimboPadrao: 'Herdeiro Único: Walter Arthurs',
    descricao:
      'Cópia lavrada há dois anos no gabinete do procurador Pettigrew, de Moorford: a loja, a casa e as economias do Sr. Arthurs passam por inteiro ao sobrinho, Walter Arthurs, "na falta de outros herdeiros".',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'heranca',
      ligadoA: 'walter_arthurs',
      isca: true,
    },
  },
  {
    id: 'dep_dividas_walter',
    localidade: 'delegacia',
    textoDisplay: 'Cartas de Cobrança',
    carimboPadrao: 'Dívidas de praça de Walter Arthurs',
    descricao:
      'Três cobranças com timbre de casas de Moorford, endereçadas a Walter Arthurs: fazendas por pagar, um armazém em juízo, e a soma crescendo de carta em carta.',
    // Plantio (fair play): o mestre enuncia a relação dívida → herança sem
    // nomear ninguém — a hierarquia dos motivos fica ao alcance do jogador.
    vozMestre: 'Dívida vencida diz o aperto. De onde sairia o pagamento, isso a cobrança não diz.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'dividas',
      ligadoA: 'walter_arthurs',
      isca: true,
    },
  },
  {
    id: 'dep_briga_walter',
    localidade: 'delegacia',
    textoDisplay: 'Gritos Ouvidos da Rua',
    carimboPadrao: 'Altercação na loja, sexta ao anoitecer',
    descricao:
      'Ocorrência tomada no sábado: um carroceiro que passava ouviu, pela porta da loja, vozes de homem em altura de briga — "prefere ver-me na miséria", e o resto perdido. Dá a hora por volta das sete da tarde de sexta.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'comportamento',
      ligadoA: 'walter_arthurs',
      isca: true,
    },
  },
  {
    id: 'dep_queixa_grey',
    localidade: 'delegacia',
    textoDisplay: 'Queixa do Relógio Mais Leve',
    carimboPadrao: 'Queixa formal de Caleb Grey, sexta à tarde',
    descricao:
      'Termo lavrado na sexta: Caleb Grey, moleiro, declara que o relógio caçador do pai, saído de conserto na loja de Arthurs, "voltou mais leve do que entrou", e exige pesagem diante de testemunhas. Anexa a soma do prejuízo: quatro libras e dez xelins.',
    // A pista dupla: o rancor mais barulhento do caso é, lido de perto, o
    // registro da fraude descoberta — o móbil de outro homem.
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'rancor',
      ligadoA: 'caleb_grey',
      isca: true,
    },
  },
  {
    id: 'dep_visto_vivo',
    localidade: 'delegacia',
    textoDisplay: 'Vitrine Fechada às Oito',
    carimboPadrao: 'Visto com Vida às 20h (13/out)',
    descricao:
      'Do registro da ronda: às oito em ponto da noite de sexta, o guarda Tobin viu o relojoeiro, de dentro da loja, correr as tampas da vitrine e acenar-lhe pelo vidro, como todas as noites.',
    // Âncora DURÁVEL de piso: a morte não pode anteceder as 20h. Junto do
    // relógio de bolso (teto durável), fecha janela finita em qualquer rota.
    tagsOcultas: {
      dominio: 'temporal',
      subDominio: 'ultima_vez_visto',
      horaAvistamento: -4, // 20h00 de 13/out na escala absoluta
    },
  },
  {
    id: 'dep_avistamento_padeiro',
    localidade: 'delegacia',
    textoDisplay: 'Luz Vista de Madrugada',
    carimboPadrao: 'Avistamento declarado: 05h15 (14/out)',
    descricao:
      'O moço do padeiro, ao registro: passou pela High Street às cinco e um quarto da madrugada de sábado e viu claridade na oficina do relojoeiro. "A luz do velho", disse. Jura que o Sr. Arthurs amanheceu vivo e trabalhando.',
    // Alegação sobre a HORA, a confrontar com a janela da morte. A claridade
    // era real (um lampião ficou aceso na oficina); a leitura "vivo às 5h" é
    // do rapaz. O motor não revela isto — quem percebe a impossibilidade é o
    // jogador, e o desfecho paga a explicação da luz.
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'avistamento',
      declaranteId: 'moco_padeiro',
      horaAvistamentoDeclarada: 5.25, // 05h15 de 14/out
      isca: true,
      // Refutada, esta alegação dá ao epílogo o direito de explicar a luz
      // (ROTULOS_EXPLICACAO.luz_esquecida) — o encerramento paga o "aha".
      explicacao: 'luz_esquecida',
    },
  },
  {
    id: 'dep_mulher_viela',
    localidade: 'delegacia',
    textoDisplay: 'Uma Senhora na Viela',
    carimboPadrao: 'Relato: senhora deixou a viela ao anoitecer',
    descricao:
      'A Sra. Wick, dos fundos do nº 9, declarou ter visto uma senhora de escuro deixar a viela da relojoaria "pouco antes das nove" da noite de sexta. Não lhe viu o rosto; conhece o passo, diz, mas não jura.',
    // Testemunho VERDADEIRO (e sem hora nas tags: não há o que refutar).
    // A lição inversa do padeiro: nem todo depoimento é falso — este apenas
    // pede o nome que a cesta e o aro de ouro sabem dar.
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'avistamento',
      declaranteId: 'sra_wick',
      isca: true,
    },
  },

  // ===================== A ESTALAGEM =====================
  {
    id: 'alibi_walter',
    localidade: 'estalagem',
    textoDisplay: 'A Diligência das Seis',
    carimboPadrao: 'Paradeiro declarado: Moorford, a noite inteira',
    descricao:
      '"Tomei a diligência das seis para Moorford e dormi no Station. Soube da desgraça esta manhã e vim no primeiro carro; tomei este quarto porque a casa do meu tio está lacrada." Alisa o colarinho ao dar as horas.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'alibi',
      declaranteId: 'walter_arthurs',
      horaInicioDeclarada: -6, // 18h00 de 13/out, a diligência que diz ter tomado
      horaFimDeclarada: 9, // manhã de 14/out, quando diz ter voltado
      corroborado: false,
    },
  },
  {
    id: 'ev_registro_estalagem',
    localidade: 'estalagem',
    textoDisplay: 'Registro da Estalagem',
    carimboPadrao: 'Assinatura de sexta, 19h40, quarto nº 3',
    descricao:
      'Na página de sexta-feira, 13: "W. Arthurs, nº 3", na linha das sete e quarenta da noite. Na coluna dos serviços, a letra do caseiro: água quente ao nº 3 às nove; vela nova à meia-noite.',
    tagsOcultas: {
      dominio: 'vestigio',
      subDominio: 'documento',
      tipoVestigio: 'assinatura_registro',
      pertenceA: 'walter_arthurs',
      revelaSegredo: 'suplica_recusada',
    },
  },
  {
    id: 'corrob_estalajadeiro',
    localidade: 'estalagem',
    textoDisplay: 'O Quarto Cinco às Escuras',
    carimboPadrao: 'Hóspede ausente às 21h; portão passado das 22h',
    descricao:
      'O estalajadeiro conta pelos dedos: o Sr. Crane não desceu para a ceia; às nove, subindo água quente ao três, viu o cinco às escuras, a cama por desfazer; e o portão do pátio, só o ouviu bater "passado das dez".',
    // Corroboração sobre o paradeiro do RÉU: o quarto vazio às 21h desmente
    // o "recolhi-me às oito" — refutação por REGISTRO/testemunho, o análogo
    // do livro do clube no caso anterior. Opcional: o caso fecha pelo corpo.
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'corroboracao',
      ligadoA: 'silas_crane',
      horaFimObservada: -3, // às 21h00 o paradeiro declarado já não se sustenta
    },
  },

  // ===================== A PAPELARIA =====================
  {
    id: 'alibi_agnes',
    localidade: 'papelaria',
    textoDisplay: 'Em Casa desde as Seis',
    carimboPadrao: 'Paradeiro declarado: em casa desde as 18h',
    descricao:
      '"Fechei a loja às seis e recolhi-me. Uma viúva não tem serões." Diz e volta a alinhar os cadernos da prateleira, o lombo de cada um à mesma altura.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'alibi',
      declaranteId: 'agnes_rooke',
      horaInicioDeclarada: -6, // 18h00 de 13/out
      horaFimDeclarada: 7, // manhã de 14/out
      corroborado: false,
    },
  },
  {
    id: 'comp_agnes',
    localidade: 'papelaria',
    textoDisplay: 'Meio-Luto e Azeviche',
    carimboPadrao: 'Reserva constante',
    descricao:
      'Veste cinza-escuro com broche de azeviche, o meio-luto de quem já cumpriu o inteiro. Ao nome do morto, a mão esquerda procura a beira do balcão; a voz não muda.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'comportamento',
      ligadoA: 'agnes_rooke',
    },
  },

  // ===================== O MOINHO =====================
  {
    id: 'alibi_grey',
    localidade: 'moinho',
    textoDisplay: 'Véspera de Feira no Moinho',
    carimboPadrao: 'Paradeiro declarado: moinho, 19h–23h, com três homens',
    descricao:
      '"Sexta é véspera de feira. Das sete às onze carreguei o moinho com dois jornaleiros e o carroceiro do Finch; os nomes, anote aí." Os três, ouvidos em separado, dão as mesmas horas.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'alibi',
      declaranteId: 'caleb_grey',
      horaInicioDeclarada: -5, // 19h00 de 13/out
      horaFimDeclarada: -1, // 23h00 de 13/out
      corroborado: true,
    },
  },
  {
    id: 'comp_grey',
    localidade: 'moinho',
    textoDisplay: 'Rancor Sem Rodeios',
    carimboPadrao: 'Hostilidade aberta',
    descricao:
      '"Fui roubado dentro da loja dele e ainda paguei o conserto adiantado. Se me perguntam se choro, não choro." Bate a farinha do avental e volta às sacas.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'comportamento',
      ligadoA: 'caleb_grey',
    },
  },

  // ===================== GABINETE PETTIGREW (nó distante, por lead) =====================
  {
    id: 'corrob_pettigrew',
    localidade: 'gabinete_pettigrew',
    textoDisplay: 'Consulta ao Procurador',
    carimboPadrao: 'Carta do morto: denúncia com discrição',
    descricao:
      'O procurador estende a carta, datada de quinta: "Preciso do seu conselho sobre como se lavra queixa contra pessoa a meu serviço, com a discrição que o caso pede. Vou-lhe segunda-feira." E acrescenta, de memória: na mesma carta, o relojoeiro pedia hora para tratar de mudanças no testamento, por razão de matrimônio.',
    // Segunda carta de móbil (a mesma tag da fraude do livro de ordens) e o
    // reforço das duas iscas: o casamento que revogaria o testamento parece
    // dar pressa ao herdeiro — e prova o que a viúva perdia com essa morte.
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'silenciamento',
      ligadoA: 'silas_crane',
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
