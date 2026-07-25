// =====================================================================
// Localidades do caso (§5 do contexto): cartas na superfície da mesa
// que, clicadas, abrem como overlay de prosa imersiva sobre a
// escrivaninha. Os marcadores [[id_da_carta]] são substituídos, na
// renderização, pelo termo clicável em negrito cujo clique extrai a
// carta correspondente (carimbo integrado, §6).
//
// A prosa admite interpolação {detective.campo} e a flexão de gênero
// {g:texto no masculino|texto no feminino} (resolvida pelo pronome).
// =====================================================================

export const LOCALIDADES = [
  {
    id: 'corpo',
    rotuloMesa: 'O Corpo',
    titulo: 'O Corpo — Escritório dos Fundos',
    subtitulo: 'Sr. Geoffrey Arthurs, relojoeiro, 61 anos',
    acoesEspeciais: ['termometro'],
    // Micro-gestos periciais (Onda 7): o input coincide com o gesto do perito
    // — voltar o corpo e dar corda ao relógio extraem as MESMAS cartas que os
    // antigos termos em negrito (os hotspots do corpo 3D seguem redundantes).
    gestos: [
      { id: 'gesto_voltar_corpo', rotulo: 'Voltar o corpo', cartaId: 'ev_livores' },
      { id: 'gesto_corda_relogio', rotulo: 'Dar corda ao relógio do morto', cartaId: 'ev_relogio_bolso' },
    ],
    prosa: [
      'O morto jaz de costas entre a escrivaninha e a estante, o colete abotoado, a gola dura manchada de escuro. O Condestável Wycliffe mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.',
      'Ao primeiro exame do tronco e dos membros, [[ev_rigor]]. O guarda espera a ordem para voltar o corpo.',
      'Sob o ângulo esquerdo do maxilar abre-se uma [[ev_ferida]]. Afastado o colarinho, mostram-se [[ev_reacao_vital]]; à lente, no fundo do canal, [[ev_residuo_ferida]].',
      'Na corrente do colete pende um relógio de bolso de tampa fechada, mudo. A maleta de instrumentos está aberta sobre a cadeira; o termômetro de mercúrio fica à mão, se {detective.treatment} {detective.surname} julgar oportuno medir a temperatura do corpo.',
    ],
  },
  {
    id: 'cena',
    rotuloMesa: 'A Cena do Crime',
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
          'No tapete, a meio caminho da lareira, o [[ev_relogio_lareira]] jaz de borco. Da porta, sem pôr o pé para dentro, Wycliffe aponta-o com o queixo: "A peça, {detective.treatment}. É dela que a vila inteira fala." A caixa cedeu de um lado e escancarou o mecanismo até a roda de contagem. Na repisa, um cachimbo de barro pousado de lado e a cinza por raspar na grelha.',
        ],
      },
      {
        id: 'pt_cena_escrivaninha',
        rotulo: 'A escrivaninha',
        prosa: [
          'A escrivaninha está de través, uma gaveta meio puxada, o tinteiro seco e a pena atravessada no mata-borrão. Um par de óculos de aros finos repousa dobrado sobre o livro-razão aberto, ao lado de uma lupa de relojoeiro presa a um cordão. Ao pé dela, no cesto de vime, entre aparas e um sobrescrito rasgado, uma [[ev_suplica_cesto]].',
        ],
      },
      {
        id: 'pt_cena_vitrine',
        rotulo: 'A vitrine e a porta do beco',
        prosa: [
          'A loja da frente fica para além do vão do escritório. Ali, contra a parede, [[ev_vitrine]]. Junto à porta acanhada que dá para o beco, na moldura do trinco, [[ev_fechadura]].',
        ],
      },
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
    rotuloMesa: 'A Oficina',
    titulo: 'A Oficina de Consertos',
    subtitulo: 'Os fundos da loja; Davey Tull, aprendiz, 15 anos',
    acoesEspeciais: [],
    // §5.1: pontos de interesse. A intro planta de graça o relógio irmão (a
    // roda de contagem à vista) — fair play; cada ponto revela as suas cartas.
    introducao: [
      'A oficina ocupa os fundos da loja: duas bancadas de tampo raspado, um torno pequeno aparafusado à ponta de uma delas, a parede coberta de ferramentas penduradas em ordem de tamanho. A limalha de latão presa ao tampo e o gume das limas penduradas guardam o brilho raso da janela alta. Junto à porta dos fundos, um cesto de vime guarda encomendas embrulhadas em papel pardo, cada uma com etiqueta de nome e vila de fora, para o carreteiro da semana. Um pêndulo comprido e rodas de mecanismo maior que os de sala esperam numa tábua à parte, ao lado de um bilhete da conserva anual do relógio da torre da paróquia. No gancho da bancada grande, o lampião de bancada está apagado. O depósito, seco; a chaminé de vidro, fumada até a boca. Na bancada menor, aberto para conserto, um relógio de lareira irmão do da cena mostra o trem das badaladas a descoberto; a cada hora que a máquina bate, a alavanca salta um entalhe da roda de contagem. Cheira a óleo e ao carvão frio do fogareiro.',
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
          'A um canto, um púlpito de escrever forrado de cortiça gasta, com um tinteiro de bancada e um prego de espetar recibos. No prego, uma pilha de recibos furados, o de cima datado de sexta na mesma letra miúda. Aberto sobre a inclinação, o [[ev_livro_ordens]].',
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
    // OS-R1: o id fica `delegacia` até a OS-R2 renomeá-lo (matriz de
    // colisão da OS-R0 §5). Aqui muda-se só o que o jogador lê.
    id: 'delegacia',
    rotuloMesa: 'A Casa do Condestável',
    titulo: 'A Casa do Condestável — A Sala da Frente',
    subtitulo: 'Condestável Lemuel Wycliffe',
    acoesEspeciais: [],
    prosa: [
      'O posto de Briarstone é a sala da frente da casa de Wycliffe: mesa de tábua, duas cadeiras e uma cômoda de cozinha em que o arquivo da vila ocupa as gavetas da roupa. Cheira a tinta e a turfa. Wycliffe abre-as sem cerimônia: "O que é meu é {g:do senhor|da senhora}, {detective.treatment} {detective.surname}. Papel, aqui, nunca faltou; imaginação é que não temos."',
      'Entre os papéis do morto, recolhidos por precaução, está o [[dep_testamento]] e, presas a ele por um alfinete, [[dep_dividas_walter]].',
      'No livro de ocorrências, com a tinta de ontem, uma [[dep_queixa_grey]]; na página de sábado, os [[dep_briga_walter]] que um carroceiro veio contar por conta própria.',
      'Do registro da ronda consta a [[dep_visto_vivo]], na letra redonda do guarda Tobin.',
      'Wycliffe guarda para o fim os relatos da manhã: a [[dep_avistamento_padeiro]] — "se havia luz àquela hora, havia homem aceso dentro dela, digo eu" — e o de uma vizinha, [[dep_mulher_viela]]. "A senhora da viela não me tira o sono. A luz das cinco, essa me arruma o caso: ladrão de madrugada, relógio parado nas quase nove, caixa vazada. O palpite é meu; a perícia, essa, é {g:do senhor|da senhora}."',
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
