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
  // ===================== A RELOJOARIA · O CORPO =====================
  {
    id: 'ev_rigor',
    localidade: 'relojoaria',
    subLocal: 'corpo',
    estados: [
      {
        ipmAte: 24,
        textoDisplay: 'Corpo Endurecido',
        carimboPadrao: 'Rígido por inteiro; extremidades começando a ceder',
        descricao:
          'Maxilar, pescoço e membros não cedem quando se tenta dobrá-los: o corpo enrijeceu por inteiro. Nos dedos e na mandíbula, porém, a resistência cede um ponto sob pressão firme.',
        vozMestre: 'Rígido por inteiro, mas repare nas mãos e na mandíbula: já cedem um ponto. Dezesseis horas, talvez dezoito; não menos de doze. Perto disto, o termômetro mente por omissão: cruze com o rigor antes de cravar a faixa.',
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
    localidade: 'relojoaria',
    subLocal: 'corpo',
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
    localidade: 'relojoaria',
    subLocal: 'corpo',
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
    localidade: 'relojoaria',
    subLocal: 'corpo',
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
    localidade: 'relojoaria',
    subLocal: 'corpo',
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
    localidade: 'relojoaria',
    subLocal: 'corpo',
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

  {
    // OS-R4, Fase 2 — A CIFRA (D19). Segunda camada do objeto que o jogador
    // já tem na mão: a cuvette (o guarda-pó; `dome`, para o ofício inglês) é
    // a tampa interna da caixa, que se levanta pela unha num entalhe. A
    // legenda particular esconde-se ENTRE as de fábrica — a um leigo, e a
    // quem revistou o corpo, lê-se como mais jargão de relojoaria.
    // O texto da D19 sai daqui byte a byte.
    // Guarda de época (perito-forense, 25/07/2026): o corte fresco brilha
    // contra a pátina, e isso vê-se; o que NÃO se pode dizer, em 1893, é que
    // um buril seja O buril — comparar estrias de ferramenta é ciência do
    // século XX. Lê-se o gênero do instrumento, nunca o exemplar. Por isso
    // esta carta não tem `vozMestre`: a licença do mestre é forense, e aqui
    // não há sinal do corpo a ler.
    id: 'ev_cuvette',
    localidade: 'relojoaria',
    subLocal: 'corpo',
    textoDisplay: 'Gravação na Tampa de Dentro',
    carimboPadrao: 'Gravado no relógio do morto: S. MIGUEL · IV · MEIA-VOLTA À ESQUERDA',
    descricao:
      'Sob a tampa do fundo há ainda uma segunda tampa, de metal dourado, que se levanta pela unha num entalhe da borda. Por dentro correm as legendas da casa que a fez, gravadas em arco: 15 RUBIS, ANCRE LIGNE DROITE. Entre elas, na mesma altura de letra, três linhas curtas: S. MIGUEL · IV · MEIA-VOLTA À ESQUERDA. Os sulcos destas três estão claros e limpos; os das outras, carregados de escuro.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'inscricao',
    },
  },

  // ===================== A RELOJOARIA · A CENA DO CRIME =====================
  {
    id: 'ev_relogio_lareira',
    localidade: 'relojoaria',
    subLocal: 'escritorio',
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
    localidade: 'relojoaria',
    subLocal: 'escritorio',
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
    // OS-R4, Fase 1 — O LIVRO I. Nasce onde a prosa já apontava desde antes da
    // reforma («a cinza por raspar na grelha»). A carta NÃO prova: acusa a
    // destruição, e a fome do que ardeu é o que manda o perito à torre.
    // Parecer do perito-forense (25/07/2026): livro fechado não arde numa
    // grelha doméstica — o miolo sobrevive legível. O que se destrói assim é
    // livro DESMANCHADO e alimentado ao fogo aos punhados, e a prova fica na
    // carcaça (costura, lombada, capas, ferragem), nunca nas folhas. O que
    // 1893 lê em papel carbonizado é a GEOMETRIA da pauta sob luz rasante —
    // nunca uma sílaba: decifrar carbonizado é ciência de 1941 em diante.
    id: 'ev_cinza_livro',
    localidade: 'relojoaria',
    subLocal: 'escritorio',
    textoDisplay: 'Cinza de Papel Queimado',
    carimboPadrao: 'Cinza de papel, fio de costura e fecho de latão',
    descricao:
      'A cinza sobe acima das barras: cinza pálida que se levanta ao mínimo sopro, lâminas negras encurvadas que estilhaçam em vez de vincar, uma crosta espessa em camadas. Posta a vela ao rés da grelha, as lâminas devolvem um brilho de linhas paralelas, e entre as linhas outras marcas de brilho, sem forma que se leia. No resto do leito, um fecho de latão com a sua chapa, escurecido e torto, um fio de linho preso a uma dobra de folhas queimadas e, de encontro à grade, um pedaço de pasta empenada com a pele torrada, ainda com o vinco das nervuras.',
    // Domínio `comportamental` por ordem da G1: a cadeia física do crime não
    // recebe carta nova. Sub-domínio próprio, que o motor não lê — esta carta
    // não sustenta âncora nenhuma, e é esse o desenho.
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'destruicao',
    },
  },
  {
    id: 'ev_vitrine',
    localidade: 'relojoaria',
    subLocal: 'loja',
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
    localidade: 'relojoaria',
    subLocal: 'loja',
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
    localidade: 'relojoaria',
    subLocal: 'copa',
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
    localidade: 'relojoaria',
    subLocal: 'escritorio',
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
  {
    // OS-R5 (D5): o móbil de Agnes Rooke. A decisão manda que seja AMBÍGUO e
    // decidido pelas cartas que o jogador colhe — por isso a carta traz o
    // fato datado e mais nada. Ao lado da cesta de ceia e do aro por gravar,
    // o bilhete lê-se como o noivado que ia ser anunciado; sozinho, lê-se
    // como o que a vila ia saber no domingo. A escolha é do jogador.
    id: 'ev_bilhete_vigario',
    localidade: 'relojoaria',
    subLocal: 'escritorio',
    textoDisplay: 'Bilhete do Vigário de S. Miguel',
    carimboPadrao: 'Proclamas de G. Arthurs e de {suspeito:agnes_rooke.nome}; o primeiro em 15 de outubro',
    descricao:
      'Meia folha com o timbre de S. Miguel, dobrada em três e ainda com o vinco do sobrescrito. O vigário dá por recebida a nota do princípio do mês e marca os proclamas de Geoffrey Arthurs, viúvo, e de {suspeito:agnes_rooke.nome}, viúva, ambos desta paróquia: o primeiro no domingo, 15 de outubro; os outros dois nos dois domingos seguintes. Ao pé, pede que os nomes se confiram antes do ofício.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'recasamento_vigiado',
      ligadoA: 'agnes_rooke',
      isca: true,
    },
  },

  // ===================== A RELOJOARIA · A OFICINA =====================
  {
    id: 'ev_livro_ordens',
    localidade: 'relojoaria',
    subLocal: 'oficina',
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
    // OS-R5 (D6, G7): o móbil de Davey Tull, quinze anos. É ECONÓMICO E SÓ, e
    // chega por documento — o rapaz não precisa de se queixar do patrão para
    // o jogo ter a razão dele. A carta mostra dinheiro retido e a conta que
    // não fecha; a palavra que a explica é do jogador, não da prosa (D1).
    id: 'ev_livro_pagamentos',
    localidade: 'relojoaria',
    subLocal: 'oficina',
    textoDisplay: 'Livro de Pagamentos da Oficina',
    carimboPadrao: 'Jornal de D. Tull descontado por inteiro desde março',
    descricao:
      'Livro de meia-folha, três colunas: o jornal da semana, o desconto e o saldo. Na linha de {suspeito:davey_tull.nome}, quatro xelins entram e quatro xelins saem, semana após semana, desde a última de março; vinte e nove ao todo. Na margem daquele mês, a letra do morto anotou "adiantado à Sra. Tull, 2 £". Ao pé de setembro, a mesma letra soma o saldo: 2 £ 4 s.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'salario_atrasado',
      ligadoA: 'davey_tull',
      isca: true,
    },
  },
  {
    id: 'ev_estojo_buril',
    localidade: 'relojoaria',
    subLocal: 'oficina',
    textoDisplay: 'Buril Claro no Estojo',
    carimboPadrao: 'Buril limpo entre ferramentas enceradas',
    descricao:
      'O estojo traz o nome de {suspeito:silas_crane.nome} a fogo na tampa. Os cabos vestem a mesma cera parda de uso; um único buril está claro, sem a cera dos outros, e a junta entre o aço e o cabo guarda uma linha escura de umidade.',
    tagsOcultas: {
      dominio: 'vestigio',
      subDominio: 'instrumento_oficio',
      tipoVestigio: 'buril_gravador',
      pertenceA: 'silas_crane',
    },
  },
  {
    id: 'ev_anel_encomenda',
    localidade: 'relojoaria',
    subLocal: 'oficina',
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
    localidade: 'relojoaria',
    subLocal: 'oficina',
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
    localidade: 'relojoaria',
    subLocal: 'oficina',
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

  // ===================== O POSTO DO GUARDA =====================
  {
    id: 'dep_testamento',
    localidade: 'posto_do_guarda',
    textoDisplay: 'Testamento do Relojoeiro',
    carimboPadrao: 'Herdeiro Único: {suspeito:walter_arthurs.nome}',
    descricao:
      'Cópia lavrada há dois anos no gabinete do procurador Pettigrew, de Moorford: a loja, a casa e as economias do Sr. Arthurs passam por inteiro ao sobrinho, {suspeito:walter_arthurs.nome}, "na falta de outros herdeiros".',
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
    localidade: 'posto_do_guarda',
    textoDisplay: 'Cartas de Cobrança',
    carimboPadrao: 'Dívidas de praça de {suspeito:walter_arthurs.nome}',
    descricao:
      'Três cobranças com timbre de casas de Moorford, endereçadas a {suspeito:walter_arthurs.nome}: fazendas por pagar, um armazém em juízo, e a soma crescendo de carta em carta.',
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
    localidade: 'posto_do_guarda',
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
    localidade: 'posto_do_guarda',
    textoDisplay: 'Queixa do Relógio Mais Leve',
    carimboPadrao: 'Queixa formal de {suspeito:caleb_grey.nome}, sexta à tarde',
    descricao:
      'Termo lavrado na sexta: {suspeito:caleb_grey.nome}, moleiro, declara que o relógio caçador do pai, saído de conserto na loja de Arthurs, "voltou mais leve do que entrou", e exige pesagem diante de testemunhas. Anexa a soma do prejuízo: quatro libras e dez xelins.',
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
    localidade: 'posto_do_guarda',
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
    localidade: 'posto_do_guarda',
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
    localidade: 'posto_do_guarda',
    textoDisplay: 'Uma Senhora na Viela',
    carimboPadrao: 'Relato: senhora deixou a viela ao anoitecer',
    descricao:
      'A Sra. Wick, dos fundos do nº 9, declarou ter visto uma senhora de escuro deixar a viela da relojoaria "pouco antes das nove" da noite de sexta. Não lhe viu o rosto; conhece o passo, diz, mas não jura. Abaixo, em tinta mais nova: procurada outra vez ao meio-dia, disse não ter visto nada e fechou a janela.',
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

  // ===================== A TORRE DE S. MIGUEL =====================
  // OS-R4. Duas cartas, e nenhuma delas entra em `temporal` ou `causal`
  // (G1/GR4-2): a cadeia física do crime sai desta OS byte a byte.
  {
    id: 'dep_sineiro_beco',
    localidade: 'torre_sino',
    textoDisplay: 'Um Homem na Boca do Beco',
    carimboPadrao: 'Avistamento declarado: depois das nove (13/out); fora do registro',
    descricao:
      '"Dou corda ao relógio da torre nas sextas, depois das nove, que é quando fecho o adro. Desci com a lanterna e, do portão, vi sair um homem pela boca do beco da relojoaria. Subiu a rua. Conheço o andar do Sr. Crane: são doze anos de vê-lo passar." Espera que a pena pare. "O guarda perguntou-me primeiro quanto eu tinha bebido. Depois já não perguntou mais nada, e não escreveu."',
    // G6 — O VERAZ SEM CRÉDITO. O sineiro diz a verdade, e a marca de
    // insuficiência nas tags faz o motor recusá-lo como sustentação de
    // qualquer âncora e como fato de qualquer refutação (acusacao.js,
    // ehInsuficiente). Aponta; não prova. A hora declarada é a verdadeira —
    // por isso o par corpo × sineiro nunca fecha refutação nenhuma.
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'avistamento',
      declaranteId: 'amos_kell',
      // 21h45 de 13/out. A morte é às 21h e o portão da estalagem bate
      // "passado das dez": entre uma coisa e outra o réu encena a cena e
      // desmancha o Livro I na grelha, e isso não cabe num quarto de hora
      // (achado do `fiscal-continuidade` no gate da R4). O jogador não vê
      // este número — o carimbo diz o que Amos diz, "depois das nove".
      horaAvistamentoDeclarada: -2.25,
      insuficiente: true,
    },
  },
  {
    id: 'ev_livro_ii',
    localidade: 'torre_sino',
    textoDisplay: 'Caderno de Pesos do Relojoeiro',
    carimboPadrao: 'Ouro pesado à entrada e à saída; diferença somada ao fim de cada mês',
    descricao:
      'Um caderno de capa de oleado, do tamanho da palma. Cada linha traz a data, a peça, o peso do ouro à entrada e o peso à saída, e a coluna do executor rubricada. Ao pé de cada mês, a diferença somada na letra miúda do morto, e a soma do ano por baixo, sublinhada duas vezes.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: 'silenciamento',
      ligadoA: 'silas_crane',
    },
  },

  // ===================== A ESTALAGEM =====================
  {
    id: 'alibi_walter',
    localidade: 'estalagem',
    textoDisplay: 'O Carro das Seis',
    carimboPadrao: 'Paradeiro declarado: Moorford, a noite inteira',
    descricao:
      '"Tomei o carro das seis para Moorford e dormi no Station. Soube da desgraça esta manhã e vim no primeiro trem; tomei este quarto porque a casa do meu tio está lacrada." Alisa o colarinho ao dar as horas.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'alibi',
      declaranteId: 'walter_arthurs',
      horaInicioDeclarada: -6, // 18h00 de 13/out, o carro que diz ter tomado
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

/**
 * @deprecated Lê SÓ o catálogo do caso-escola. Em runtime use o acessor
 * homônimo de pacote_caso.js, que responde pelo caso CARREGADO (inclusive
 * os gerados). Este fica para o gerador/QA (ilhas de build).
 */
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

// ---------------------------------------------------------------------
// #5 — A CONTRADIÇÃO DE HORAS do caso-escola (o corpo × o avistamento do
// padeiro). Camada narrativa/UI: o store e a Caderneta leem DAQUI (via
// pacote) os ids do par e toda a prosa do ponto a decidir — nenhum id de
// carta do caso-escola fica cravado em código genérico. Um caso gerado
// sem este campo simplesmente não tem o ponto a decidir (no-op).
// A decisão NÃO rege o veredicto (o mural decide) — dado de UI.
// ---------------------------------------------------------------------
export const CONTRADICAO_HORAS = {
  // A alegação de hora (o depoimento) e as cartas do corpo que a contradizem.
  alegacaoId: 'dep_avistamento_padeiro',
  corpoIds: ['ev_rigor', 'ev_livores'],
  // Linha do diário quando o par se completa na mesa.
  avisoDiario:
    'Duas horas se contradizem: o corpo e o moço do padeiro. Há um ponto a decidir na caderneta.',
  // O enunciado do ponto a decidir, na Caderneta.
  apresentacao:
    'O moço do padeiro jura o Sr. Arthurs vivo e à bancada às cinco e um quarto da madrugada de sábado. O corpo já esfriara: o rigor e o livor põem a morte na véspera, antes da meia-noite. Só uma das duas horas pode reger a minha conta, e de qual parto muda o caminho daqui em diante.',
  // Rótulos dos dois botões de decisão.
  botoes: { relato: 'Parto do relato do moço', corpo: 'Parto do que o corpo diz' },
  // A decisão firmada: a frase da Caderneta e a linha do diário, por escolha.
  firmadoCaderneta: {
    corpo:
      'Firmei-me no corpo: parto do rigor e do livor; ao relato que os contrarie compete o ônus da prova.',
    relato:
      'Firmei-me no relato do moço: parto da luz e da vida que ele jura ter visto na oficina; ao corpo compete então o ônus da prova.',
  },
  firmadoDiario: {
    corpo: 'Firmei-me: parto do que o corpo diz; o relato que o desminta que se explique.',
    relato: 'Firmei-me: parto do relato do moço do padeiro; que o corpo se explique depois.',
  },
};
