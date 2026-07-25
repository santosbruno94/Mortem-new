// =====================================================================
// Localidades do caso (§5 do contexto): cartas na superfície da mesa
// que, clicadas, abrem como overlay de prosa imersiva sobre a
// escrivaninha. Os marcadores [[id_da_carta]] são substituídos, na
// renderização, pelo termo clicável em negrito cujo clique extrai a
// carta correspondente (carimbo integrado, §6).
//
// A prosa admite interpolação {detective.campo} e a flexão de gênero
// {g:texto no masculino|texto no feminino} (resolvida pelo pronome).
//
// CONTRATO DE SUB-LOCAIS (OS-R2, Fase 1). Uma carta resolve-se por
// `localidade` + `subLocal`; `subLocal` ausente significa "raiz da
// localidade" e continua válido para todas as localidades que não se
// fundiram. Uma localidade que se divide declara `subLocais: [...]`, e cada
// sub-local carrega o que a sua antiga localidade carregava (título,
// subtítulo, ações especiais, introdução, prosa, gestos e pontos quentes);
// cada ponto quente pertence ao sub-local em que está declarado.
// =====================================================================

export const LOCALIDADES = [
  {
    // OS-R2 — CENA ÚNICA: `corpo`, `cena` e `oficina` eram três nós de mapa
    // para o MESMO prédio (High Street, nº 7). Passam a ser sub-locais desta
    // localidade; a planta baixa (src/data/planta_relojoaria.js) é a
    // navegação entre eles, a custo zero. A saleta de Silas fica de fora,
    // como nó próprio — anomalia registrada, aberta para a OS-R6.
    id: 'relojoaria',
    rotuloMesa: 'A Relojoaria',
    titulo: 'A Relojoaria Arthurs — High Street, nº 7',
    subtitulo: 'Sr. Geoffrey Arthurs, relojoeiro, 61 anos',
    acoesEspeciais: [],
    subLocais: [
      {
        id: 'corpo',
        rotulo: 'O Corpo',
        titulo: 'O Corpo — Escritório dos Fundos',
        subtitulo: 'Sr. Geoffrey Arthurs, relojoeiro, 61 anos',
        acoesEspeciais: ['termometro'],
        // Micro-gestos periciais (Onda 7): o input coincide com o gesto do perito
        // — voltar o corpo e dar corda ao relógio extraem as MESMAS cartas que os
        // antigos termos em negrito (os hotspots do corpo 3D seguem redundantes).
        gestos: [
          { id: 'gesto_voltar_corpo', rotulo: 'Voltar o corpo', cartaId: 'ev_livores' },
          { id: 'gesto_corda_relogio', rotulo: 'Dar corda ao relógio do morto', cartaId: 'ev_relogio_bolso' },
          // OS-R4: o gesto que abre a segunda camada do mesmo objeto. Nasce
          // sempre visível — a cifra não pode depender de tom, de conversa
          // nem de ordem de visita (G4, G10).
          { id: 'gesto_abrir_fundo', rotulo: 'Abrir o fundo da caixa do relógio', cartaId: 'ev_cuvette' },
        ],
        prosa: [
          'O morto jaz de costas entre a escrivaninha e a estante, o colete abotoado, a gola dura manchada de escuro. O guarda Wycliffe mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.',
          'Ao primeiro exame do tronco e dos membros, [[ev_rigor]]. O homem de guarda espera a ordem para voltar o corpo.',
          'Sob o ângulo esquerdo do maxilar abre-se uma [[ev_ferida]]. Afastado o colarinho, mostram-se [[ev_reacao_vital]]; à lente, no fundo do canal, [[ev_residuo_ferida]].',
          'Na corrente do colete pende um relógio de bolso de tampa fechada, mudo. A maleta de instrumentos está aberta sobre a cadeira; o termômetro de mercúrio fica à mão, se {detective.treatment} {detective.surname} julgar oportuno medir a temperatura do corpo.',
        ],
      },
      {
        id: 'escritorio',
        rotulo: 'A Cena do Crime',
        titulo: 'A Cena — Escritório dos Fundos da Relojoaria',
        subtitulo: 'Briarstone, High Street, nº 7',
        acoesEspeciais: [],
        // §5.1: a prosa monolítica se divide em pontos de interesse — coleta em
        // camadas. A introdução ambienta sem carta; cada ponto revela as suas.
        introducao: [
          'O escritório dos fundos guarda o revirado da manhã em que o acharam: papéis pelo assoalho, a poltrona de couro empurrada para longe da escrivaninha. A luz de outubro entra de esguelha pela janela alta e assenta na poeira em suspensão; cheira a óleo fino de relojoeiro e à cinza fria da lareira. Num cabide atrás da porta estão pendurados um sobretudo escuro e um chapéu-coco. Sobre a repisa, um retângulo sem poeira marca o lugar onde alguma coisa esteve.',
        ],
        pontos: [
          {
            id: 'pt_cena_lareira',
            rotulo: 'A lareira',
            // Micro-gesto (Onda 7): contar os entalhes da roda é gesto de perito,
            // não leitura — o botão extrai ev_maquinismo.
            gestos: [
              { id: 'gesto_contar_entalhes', rotulo: 'Contar os entalhes da roda', cartaId: 'ev_maquinismo' },
            ],
            prosa: [
              'No tapete, a meio caminho da lareira, o [[ev_relogio_lareira]] jaz de borco. Da porta, sem pôr o pé para dentro, Wycliffe aponta-o com o queixo: "A peça, {detective.treatment}. É dela que a vila inteira fala." A caixa cedeu de um lado e escancarou o mecanismo até a roda de contagem. Na repisa, um cachimbo de barro pousado de lado; na grelha por raspar, [[ev_cinza_livro]].',
            ],
          },
          {
            id: 'pt_cena_escrivaninha',
            rotulo: 'A escrivaninha',
            prosa: [
              'A escrivaninha está de través, uma gaveta meio puxada, o tinteiro seco e a pena atravessada no mata-borrão. Um par de óculos de aros finos repousa dobrado sobre o livro-razão aberto, ao lado de uma lupa de relojoeiro presa a um cordão. Entre as folhas, a servir de marca, um [[ev_bilhete_vigario]]. Ao pé dela, no cesto de vime, entre aparas e um sobrescrito rasgado, uma [[ev_suplica_cesto]].',
            ],
          },
        ],
      },
      {
        // Martelo do utilizador (25/07/2026, OS-R2 §5 opção a): a vitrine é a
        // da rua. Separá-la dos fundos torna navegável — e legível — a
        // distância entre o que o ladrão teria levado e o que está revirado.
        id: 'loja',
        rotulo: 'A Loja da Frente',
        titulo: 'A Loja da Frente — Relojoaria Arthurs',
        subtitulo: 'Briarstone, High Street, nº 7',
        acoesEspeciais: [],
        pontos: [
          {
            id: 'pt_cena_vitrine',
            rotulo: 'A vitrine e a porta do beco',
            prosa: [
              'A loja da frente fica para além do vão do escritório. Ali, contra a parede, [[ev_vitrine]]. Junto à porta acanhada que dá para o beco, na moldura do trinco, [[ev_fechadura]].',
            ],
          },
        ],
      },
      {
        id: 'copa',
        rotulo: 'A Copa',
        titulo: 'A Copa — Fundos da Relojoaria',
        subtitulo: 'Briarstone, High Street, nº 7',
        acoesEspeciais: [],
        pontos: [
          {
            id: 'pt_cena_copa',
            rotulo: 'A copa',
            prosa: [
              'Nos fundos, uma copa apertada: a chaleira fria no fogareiro, a pia com um resto de água parada, um pano de prato no gancho. Na bandeja estão duas xícaras: uma com o fundo de chá seco, a outra emborcada e limpa; a lata de chá aberta, a colher ainda dentro. Sobre a bancada de pedra, encostada à parede, uma [[ev_cesta_rooke]].',
            ],
          },
        ],
      },
      {
        id: 'oficina',
        rotulo: 'A Oficina',
        titulo: 'A Oficina de Consertos',
        subtitulo: 'Os fundos da loja; Davey Tull, aprendiz, 15 anos',
        acoesEspeciais: [],
        // §5.1: pontos de interesse. A intro planta de graça o relógio irmão (a
        // roda de contagem à vista) — fair play; cada ponto revela as suas cartas.
        introducao: [
          'A oficina ocupa os fundos da loja: duas bancadas de tampo raspado, um torno pequeno aparafusado à ponta de uma delas, a parede coberta de ferramentas penduradas em ordem de tamanho. Sob a redoma, ao canto da bancada grande, a balança de fiel do ouro, com a caixinha dos pesos ao lado. A limalha de latão presa ao tampo e o gume das limas penduradas guardam o brilho raso da janela alta. Junto à porta dos fundos, um cesto de vime guarda encomendas embrulhadas em papel pardo, cada uma com etiqueta de nome e vila de fora, para o carreteiro da semana. Um pêndulo comprido e rodas de mecanismo maior que os de sala esperam numa tábua à parte, ao lado de um bilhete da conserva anual do relógio da torre da paróquia. No gancho da bancada grande, o lampião de bancada está apagado. O depósito, seco; a chaminé de vidro, fumada até a boca. Na bancada menor, aberto para conserto, um relógio de lareira irmão do da cena mostra o trem das badaladas a descoberto; a cada hora que a máquina bate, a alavanca salta um entalhe da roda de contagem. Cheira a óleo e ao carvão frio do fogareiro.',
        ],
        pontos: [
          {
            id: 'pt_oficina_prateleira',
            rotulo: 'A prateleira de gravar',
            prosa: [
              'A prateleira das ferramentas de gravar corre sobre a bancada menor: buris de vários feitios, dois punções de letra, um vidro tampado de pó de polir. Ao canto, um frasco de óleo fino pela metade, a rolha ao lado e um pano de linho manchado de dedadas. No meio deles, de tampa fechada, o [[ev_estojo_buril]].',
            ],
          },
          {
            id: 'pt_oficina_pulpito',
            rotulo: 'O púlpito de ordens',
            prosa: [
              'A um canto, um púlpito de escrever forrado de cortiça gasta, com um tinteiro de bancada e um prego de espetar recibos. No prego, uma pilha de recibos furados, o de cima datado de sexta na mesma letra miúda. Aberto sobre a inclinação, o [[ev_livro_ordens]]. Na prateleira de baixo, entre o mata-borrão e a caixa de bicos de pena, o [[ev_livro_pagamentos]].',
            ],
          },
          {
            id: 'pt_oficina_gaveta',
            rotulo: 'A gaveta funda',
            prosa: [
              'Sob a bancada grande corre uma fileira de gavetas; a mais funda range ao abrir e cheira a metal e a graxa velha. Dentro, sob um retalho de camurça, junto a molas soltas e a um envelope de peças, um [[ev_anel_encomenda]].',
            ],
          },
        ],
        // Onda 6: Davey conversa em diálogo próprio (dialogo_davey, botão ao pé
        // da prosa) — o hábito da corda e o álibi dele nascem lá, não num ponto.
      },
      {
        // Declarado pela OS-R2 §1, sem cartas próprias e sem sala clicável na
        // planta: a soleira do beco existe para a topologia e para o pivô
        // visual. Dar-lhe sala exigiria prosa nova, que esta OS proíbe —
        // registrado na ata como aberto para o passe editorial (OS-R8).
        id: 'porta_beco',
        rotulo: 'A Porta do Beco',
        acoesEspeciais: [],
      },
    ],
  },
  {
    id: 'interrogatorio_silas',
    rotuloMesa: 'A Saleta',
    titulo: 'Interrogatório — Silas Crane',
    subtitulo: 'Primeiro-oficial da relojoaria, 47 anos',
    acoesEspeciais: [],
    // §7.1: este nó é INTERROGATÓRIO EM DIÁLOGO — a prosa (falas, confrontos,
    // termos extraíveis) vive em src/data/dialogos.js. O dispatch da
    // Escrivaninha abre InterrogatorioDialogo quando há árvore para o nó.
  },
  {
    // OS-R2: o id herdado da OS-R1 muda aqui. A D11 revista chama o policial
    // de `guarda` e o lugar de «O Posto do Guarda» — `posto_do_guarda` é o id
    // que deixa de contradizer o que o jogador lê (martelo de 25/07/2026).
    id: 'posto_do_guarda',
    rotuloMesa: 'O Posto do Guarda',
    titulo: 'O Posto do Guarda — A Sala da Frente',
    subtitulo: 'Guarda Lemuel Wycliffe',
    acoesEspeciais: [],
    prosa: [
      'O posto de Briarstone é a sala da frente da casa do guarda: mesa de tábua, duas cadeiras e uma cômoda de cozinha em que o arquivo da vila ocupa as gavetas da roupa. Cheira a tinta e a turfa. Wycliffe abre-as sem cerimônia: "O que é meu é {g:do senhor|da senhora}, {detective.treatment} {detective.surname}. Papel, aqui, nunca faltou; imaginação é que não temos."',
      'Entre os papéis do morto, recolhidos por precaução, está o [[dep_testamento]] e, presas a ele por um alfinete, [[dep_dividas_walter]].',
      'No livro de ocorrências, com a tinta de ontem, uma [[dep_queixa_grey]]; na página de sábado, os [[dep_briga_walter]] que um carroceiro veio contar por conta própria.',
      'Do registro da ronda consta a [[dep_visto_vivo]], na letra redonda do guarda Tobin. "Tobin faz a ronda de Caulfield e desce a nossa rua às oito, que é onde as duas se encontram… isto é, onde a dele acaba e a minha ainda não começou. Passa e segue. O que vê pelo caminho lavra no livro dele e copia no meu, e eu faço o mesmo com o que vejo do meu."',
      'Wycliffe guarda para o fim os relatos da manhã: a [[dep_avistamento_padeiro]] — "se havia luz àquela hora, havia homem aceso dentro dela, digo eu" — e o de uma vizinha, [[dep_mulher_viela]]. "A senhora da viela não me tira o sono. A luz das cinco, essa me arruma o caso: ladrão de madrugada, relógio parado nas quase nove, caixa vazada. O palpite é meu; a perícia, essa, é {g:do senhor|da senhora}."',
    ],
  },
  {
    // OS-R4 — A TORRE. Nó novo, aberto desde o início (G10: Amos é sempre
    // alcançável). O que a cifra abre não é o nó: é o parágrafo condicional
    // da câmara dos sinos, que só entra com `ev_cuvette` na mesa. Sem a
    // cifra, o perito sobe, conta seis sinos e desce de mãos vazias.
    id: 'torre_sino',
    rotuloMesa: 'A Torre de S. Miguel',
    titulo: 'A Torre de S. Miguel',
    subtitulo: 'Amos Kell, sineiro da paróquia, 63 anos',
    acoesEspeciais: [],
    prosa: [
      'S. Miguel fecha o extremo da rua, do lado oposto à estrada de Moorford. A porta da torre dá na câmara dos toques, caiada e de teto baixo: seis cordas descem por buracos no forro e ficam enroladas nos ganchos até domingo, as manoplas de lã ao alcance da mão. Num prego, o registro dos toques; ao lado, a tabela da conserva do relógio, assinada de ano em ano em letra miúda. Amos Kell passa breu na ponta de uma corda e não ergue os olhos.',
      'Perguntado da noite de sexta, prende a corda ao gancho e conta: [[dep_sineiro_beco]].',
      'Da câmara sobe uma escada de caracol, primeiro ao maquinismo do relógio, com os pesos pendurados no poço, e depois à câmara dos sinos. São seis, na armação de carvalho, e Amos numera-os sem se voltar para a escada: "Do mais leve ao mais pesado, senhor, que é como se contam. O primeiro abre o repique; o sexto dá a hora à rua. Os do meio, só quem toca os separa. Estão todos de boca para baixo até amanhã; amanhã é domingo, e estes seis trabalham desde as oito." A corda volta às mãos.',
    ],
    // OS-R4 — O QUE A CIFRA ABRE. Sem `ev_cuvette` na mesa, o perito sobe,
    // conta seis sinos e desce de mãos vazias: o esconderijo existe e não se
    // encontra por tropeço. A condição é de PROSA (camada narrativa); o motor
    // não a lê, e a carta continua a extrair-se pelo caminho de sempre.
    prosaCondicional: [
      {
        requerCartas: ['ev_cuvette'],
        paragrafos: [
          'Sobre a armação, de quatro sobre as vigas, alcança-se o quarto cabeçote. No barrote fronteiro, de frente para o vão que o cabeçote de olmo deixa livre, uma chapa de latão de charneira fecha um vazio do tamanho de uma mão, presa por uma trava de cabeça serrilhada. A trava não cede para a direita. Meia-volta para a esquerda, e a chapa gira; dentro, embrulhado em oleado, o [[ev_livro_ii]].',
        ],
      },
    ],
  },
  {
    id: 'estalagem',
    rotuloMesa: 'A Estalagem',
    titulo: 'A Estalagem — The Wheatsheaf',
    subtitulo: 'Walter Arthurs, hóspede do quarto nº 3',
    acoesEspeciais: [],
    // Onda 6: Walter conversa em diálogo próprio (dialogo_walter, botão ao pé
    // da prosa) — o álibi dele nasce lá. A casa e o estalajadeiro ficam aqui.
    prosa: [
      'The Wheatsheaf tem pátio de carroças e um livro de hóspedes gordo de anos. Walter Arthurs está hospedado no quarto nº 3; desce à sala a um recado.',
      'O estalajadeiro empresta o [[ev_registro_estalagem]] sem fazer perguntas, e responde às que lhe fazem: [[corrob_estalajadeiro]].',
    ],
  },
  {
    id: 'papelaria',
    rotuloMesa: 'A Loja da Sra. Rooke',
    titulo: 'A Loja e Correio da High Street',
    subtitulo: 'Sra. Agnes Rooke, viúva, 58 anos',
    acoesEspeciais: [],
    // Onda 6: este nó é INTERROGATÓRIO EM DIÁLOGO — a prosa (falas, reações,
    // termos extraíveis) vive em src/data/dialogos.js, key `papelaria`.
  },
  {
    id: 'moinho',
    rotuloMesa: 'O Moinho',
    titulo: 'O Moinho de Briarstone',
    subtitulo: 'Caleb Grey, moleiro, 46 anos',
    acoesEspeciais: [],
    // Onda 6: este nó é INTERROGATÓRIO EM DIÁLOGO — a prosa vive em
    // src/data/dialogos.js, key `moinho`.
  },
  {
    id: 'gabinete_pettigrew',
    rotuloMesa: 'Gabinete Pettigrew',
    titulo: 'Gabinete do Procurador Pettigrew',
    subtitulo: 'Moorford — hora e meia de estrada',
    acoesEspeciais: [],
    prosa: [
      'Hora e meia de estrada, e o gabinete cheira a couro e lacre. O procurador Pettigrew já soube da morte; pousa os óculos e espera as perguntas de mãos cruzadas.',
      'Sobre o relojoeiro, entrega o que tem: [[corrob_pettigrew]]. "Guardo papéis, {detective.treatment}; opiniões, procuro não guardar."',
    ],
  },
];

/**
 * @deprecated Lê SÓ as localidades do caso-escola. Em runtime use o acessor
 * homônimo de pacote_caso.js, que responde pelo caso CARREGADO (inclusive
 * os gerados). Este fica para o gerador/QA (ilhas de build).
 */
export function obterLocalidade(id) {
  return LOCALIDADES.find((l) => l.id === id) || null;
}
