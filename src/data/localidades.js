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
    prosa: [
      'O morto jaz de costas entre a escrivaninha e a estante, o colete abotoado, a gola dura manchada de escuro. O Delegado Wycliffe mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.',
      'Ao primeiro exame do tronco e dos membros, [[ev_rigor]]. Voltado o corpo com o auxílio do guarda, veem-se [[ev_livores]], espalhadas também pela face posterior das pernas.',
      'Sob o ângulo esquerdo do maxilar abre-se uma [[ev_ferida]]. Afastado o colarinho, mostram-se [[ev_reacao_vital]]; à lente, no fundo do canal, [[ev_residuo_ferida]].',
      'Na corrente do colete pende um [[ev_relogio_bolso]]. A maleta de instrumentos está aberta sobre a cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar oportuno medir a temperatura do corpo.',
    ],
  },
  {
    id: 'cena',
    rotuloMesa: 'A Cena do Crime',
    titulo: 'A Cena — Escritório dos Fundos da Relojoaria',
    subtitulo: 'Briarstone, High Street, nº 7',
    acoesEspeciais: [],
    prosa: [
      'O escritório guarda o revirado em que o acharam: papéis pelo assoalho, a poltrona fora do lugar. Sobre a lareira, um retângulo sem poeira marca onde o relógio ficava.',
      'O próprio [[ev_relogio_lareira]] está no tapete, de borco. Wycliffe aponta-o da porta, sem entrar: é a peça de que a vila inteira já fala. Pela caixa partida, à lente, vê-se a [[ev_maquinismo]].',
      'Na loja da frente, [[ev_vitrine]]. Na porta que dá para o beco, uma [[ev_fechadura]].',
      'Na copa ao lado, entre a chaleira e a pia, uma [[ev_cesta_rooke]]. No cesto de papéis da escrivaninha, uma [[ev_suplica_cesto]].',
    ],
  },
  {
    id: 'oficina',
    rotuloMesa: 'A Oficina',
    titulo: 'A Oficina de Consertos',
    subtitulo: 'Os fundos da loja; Davey Tull, aprendiz, 15 anos',
    acoesEspeciais: [],
    prosa: [
      'Duas bancadas, um torno pequeno, a parede de ferramentas em ordem de tamanho. O lampião da bancada grande segue no gancho: o depósito seco, a chaminé de vidro fumada até a boca.',
      'Davey Tull varre um chão já varrido. Na bancada pequena, aberto para conserto, um relógio de lareira igual ao da cena mostra o trem das badaladas: a cada hora vencida, a alavanca salta um entalhe da roda de contagem.',
      'No púlpito de cortiça, o [[ev_livro_ordens]]. Na prateleira das ferramentas de gravar, o [[ev_estojo_buril]]. Numa gaveta funda, sob camurça, um [[ev_anel_encomenda]].',
      'Perguntado pelos costumes do patrão, o rapaz conta [[dep_habito_corda]]. Sobre a noite de sexta, dá [[alibi_davey]], e torna a varrer.',
    ],
  },
  {
    id: 'interrogatorio_silas',
    rotuloMesa: 'Silas Crane',
    titulo: 'Interrogatório — Silas Crane',
    subtitulo: 'Primeiro-oficial da relojoaria, 47 anos',
    acoesEspeciais: [],
    prosa: [
      'Silas Crane recebe na saleta, o avental de couro dobrado sobre o braço. Traz chá sem que se peça e senta-se na beira da cadeira, as mãos quietas sobre os joelhos.',
      '"Doze anos nesta casa. Fui eu que o achei, esta manhã, às nove e vinte, e mandei o rapaz correr à delegacia." Sobre a noite de sexta: [[alibi_silas]].',
      'Em tudo o mais, [[comp_silas]].',
      'Ao cruzar as pernas, deixa ver, presa à bainha esquerda, uma lasca que a luz do lampião acende: [[ev_vidro_dobra]].',
    ],
    // Prosa condicional: entra quando TODAS as cartas exigidas já estão na
    // mesa. Aqui, o confronto da segunda visita — o perito voltou da
    // estalagem sabendo do quarto às escuras, e a vila reage à investigação.
    // Reação observável, nunca confissão: o veredicto continua no mural.
    prosaCondicional: [
      {
        requerCartas: ['alibi_silas', 'corrob_estalajadeiro'],
        paragrafos: [
          'Posto diante do que se conta na estalagem — o quarto às escuras, o portão passado das dez —, Silas Crane pousa o bule sem ruído. "O estalajadeiro terá contado os quartos errados. A casa é grande, e a noite foi de movimento." Dá a resposta no mesmo passo das outras e torna a erguer o bule.',
        ],
      },
    ],
  },
  {
    id: 'delegacia',
    rotuloMesa: 'A Delegacia',
    titulo: 'Arquivos da Delegacia de Briarstone',
    subtitulo: 'Delegado Lemuel Wycliffe',
    acoesEspeciais: [],
    prosa: [
      'A delegacia é uma sala única, com cheiro de tinta e turfa. Wycliffe abre os armários sem cerimônia: "O que é meu é {g:do senhor|da senhora}, {detective.title} {detective.surname}. Papel, aqui, nunca faltou; imaginação é que não temos."',
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
    prosa: [
      'The Wheatsheaf tem pátio de carroças, escada que range e um livro de hóspedes gordo de anos. Walter Arthurs desce à sala sem casaco, a barba de ontem por fazer.',
      '"Os meus negócios vão mal, e disso nunca fiz segredo. Da herança falem os outros." Sobre a véspera, dá o seu álibi: [[alibi_walter]].',
      'O estalajadeiro empresta o [[ev_registro_estalagem]] sem fazer perguntas, e responde às que lhe fazem: [[corrob_estalajadeiro]].',
    ],
  },
  {
    id: 'papelaria',
    rotuloMesa: 'Sra. Agnes Rooke',
    titulo: 'A Papelaria da High Street',
    subtitulo: 'Sra. Agnes Rooke, viúva, 58 anos',
    acoesEspeciais: [],
    prosa: [
      'A papelaria cheira a goma e a papel novo; o balcão reluz de cera. Sobre o mostrador, separado do resto, papel de carta com tarja de luto.',
      'A Sra. Rooke atende de pé. Sobre a noite de sexta, a resposta vem curta: [[alibi_agnes]].',
      'Em toda a visita, [[comp_agnes]].',
    ],
  },
  {
    id: 'moinho',
    rotuloMesa: 'O Moinho',
    titulo: 'O Moinho de Briarstone',
    subtitulo: 'Caleb Grey, moleiro, 46 anos',
    acoesEspeciais: [],
    prosa: [
      'O moinho trabalha mesmo em sábado de luto alheio: sacas na rampa, o carroceiro do Finch à espera. Caleb Grey fala sem parar o serviço.',
      'A sexta, ele a dá sem parar as sacas: [[alibi_grey]].',
      'Sobre o morto, [[comp_grey]].',
    ],
  },
  {
    id: 'gabinete_pettigrew',
    rotuloMesa: 'Gabinete Pettigrew',
    titulo: 'Gabinete do Procurador Pettigrew',
    subtitulo: 'Moorford — hora e meia de estrada',
    acoesEspeciais: [],
    prosa: [
      'Hora e meia de estrada, e o gabinete cheira a couro e lacre. O procurador Pettigrew já soube da morte; pousa os óculos e espera as perguntas de mãos cruzadas.',
      'Sobre o relojoeiro, entrega o que tem: [[corrob_pettigrew]]. "Guardo papéis, {detective.title}; opiniões, procuro não guardar."',
    ],
  },
];

export function obterLocalidade(id) {
  return LOCALIDADES.find((l) => l.id === id) || null;
}
