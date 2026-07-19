// =====================================================================
// Sequência de abertura em 6 passos (§4): da pensão em Caulfield ao
// briefing do Delegado Wycliffe — que planta informações e iscas.
// Toda a prosa admite {detective.campo} e {g:masc|fem}.
//
// Prosa regida por docs/guia-de-estilo.md e docs/biblia-de-vozes.md:
// observação pura, vozes diferenciadas, brilho racionado.
// =====================================================================

export const PASSOS_ABERTURA = [
  {
    id: 'caulfield',
    titulo: 'Caulfield, 14 de outubro de 1893',
    paragrafos: [
      'A pensão da Sra. Potts cobra dois xelins por semana e entrega dois xelins: um quarto estreito, meia vela, uma garrafa vazia e o jornal de anteontem dobrado sobre a mesa.',
      'Sobre essa mesa, {detective.treatment} {detective.surname} dispõe os instrumentos emprestados do mestre: a lente e o termômetro de mercúrio com a trinca no vidro. A caderneta de capa rachada vem por último, quase cheia de dois anos de anotações em letra miúda; o afogado de Dunbury, registrado esta manhã, ocupa a penúltima página.',
    ],
    rotuloBotao: 'A vela queima',
  },
  {
    id: 'sra_potts',
    titulo: 'Batem à porta',
    paragrafos: [
      'A Sra. Potts não espera resposta: entra com o castiçal numa mão e um embrulho de papel pardo na outra, e pousa-o sobre a mesa.',
      '"Veio a cavalo. O rapaz disse que era para entregar em mãos, e que o assunto era de Briarstone, urgente." Fica onde está, o olhar no embrulho, no rosto {g:do hóspede|da hóspede}. "Briarstone. Então mataram alguém por lá."',
      'O barbante cede ao primeiro puxão. Dentro, duas peças: uma carta lacrada com brasão de repartição e, dobrado por cima dela, um bilhete em letra familiar.',
      '"Harlan — O delegado de Briarstone me procurou para um caso de homicídio; a carta dele segue anexa. Estou em St. Albans até quinta-feira e não posso ir. Vá no meu lugar, faça o exame como lhe ensinei e não mexa no corpo antes de ler a carta inteira. Não era isso que queria, jovem? — A."',
      'O endereço no embrulho era Caulfield, não Londres. Alcott sabia onde encontrá-lo e sabia que a assinatura dispensava resposta.',
    ],
    rotuloBotao: 'Abrir o envelope',
  },
  {
    id: 'carta',
    titulo: 'A carta do Delegado',
    carta: true,
    paragrafos: [
      'O lacre de cera vermelha traz o brasão gasto de uma repartição, prensado torto. A cera racha sob o polegar. O papel é grosso, de bom fornecedor; a letra que o cobre inclina-se para a direita, firme no começo de cada linha e mais corrida ao fim dela.',
      '"Dr. Alcott — Escrevo-lhe na qualidade de delegado de Briarstone e na condição, que não me envergonho de confessar, de homem posto fora da sua profundidade. O Sr. Geoffrey Arthurs, relojoeiro desta vila e homem que nunca deu trabalho a esta delegacia, foi achado morto esta manhã no escritório dos fundos da sua loja, com a garganta aberta e a casa toda revirada."',
      '"Não toquei em nada; mandei que nem uma cadeira saísse do lugar, e pus um guarda à porta até que o senhor chegue. Venha, peço-lhe, pelo primeiro trem que o traga a nós. Briarstone paga os seus honorários e, se o caso assim pedir, o seu silêncio; disso trataremos melhor com um copo na mão. Perdoe a letra: escrevo de pé, e a mão ainda não me voltou ao sossego. — Lemuel Wycliffe, Delegado."',
    ],
    rotuloBotao: 'Aceitar o chamado',
  },
  {
    id: 'transformacao',
    titulo: 'A mesa se transforma',
    paragrafos: [
      'A garrafa vai para o chão, o jornal para o fogo. A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta na próxima página em branco.',
      '{detective.treatment} {detective.surname} veste o casaco ainda úmido da véspera e desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer.',
    ],
    rotuloBotao: 'Tomar o trem',
  },
  {
    id: 'briarstone',
    titulo: 'Briarstone',
    paragrafos: [
      'A plataforma cheira a carvão e a palha molhada de chuva. Além dos trilhos, Briarstone estende-se numa única rua, e a luz de outubro bate rasa nos telhados e deixa a calçada meio na sombra, meio no sol.',
      'Os sinos da igreja dão a hora num extremo da rua; um cão responde do outro. A meia rua, uma vitrine tem a cortina corrida por dentro, e à porta dela um guarda moço mantém-se de mãos cruzadas às costas, o rosto sem cor.',
      'O Delegado Wycliffe espera junto ao portão. {detective.treatment} {detective.surname} desce do trem, e Wycliffe olha-{g:o|a} uma vez de alto a baixo antes de estender a mão. "O Dr. Alcott não pôde vir, então." A voz é plana; não espera resposta. Aperta a mão com as duas e não a solta logo. "Pois bem. O Sr. Arthurs está como o encontramos ontem… esta manhã, quero dizer. Venha; explico-me pelo caminho, que a andar me saio melhor."',
    ],
    rotuloBotao: 'Ouvir o delegado',
  },
  {
    id: 'briefing',
    titulo: 'O relato do Delegado Wycliffe',
    briefing: true,
    paragrafos: [
      '"O essencial é isto: Sr. Geoffrey Arthurs, sessenta e um anos, relojoeiro. Achado morto no escritório dos fundos, sábado às nove e vinte da manhã, por Silas Crane — o oficial dele, homem de doze anos de casa. A porta do beco forçada, o troco do caixa levado, a loja fechada desde a noite de sexta, dia 13."',
      'Detém-se diante da relojoaria e baixa a voz. "Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}; aqui fora, ainda posso ser útil."',
    ],
    rotuloBotao: 'Entrar — iniciar a investigação',
  },
];

// Perguntas do briefing (custo zero). As respostas plantam dados e
// iscas: o relógio das 08h45, a luz da madrugada, o testamento, a queixa.
export const PERGUNTAS_BRIEFING = [
  {
    id: 'sobre_a_morte',
    pergunta: 'O que se sabe sobre a hora da morte?',
    resposta:
      '"Aí é que a sorte nos ajuda: na confusão, o relógio da lareira veio ao chão e parou num quarto para as nove. E o moço do padeiro viu luz na oficina às cinco e pouco da madrugada. Vivo às cinco, morto antes das nove e vinte — o ladrão mal teria virado a esquina. É o que eu penso, veja bem. O que {g:o senhor|a senhora} pensar, com o corpo à frente, é que vale."',
  },
  {
    id: 'quem_herda',
    pergunta: 'Quem herda com essa morte?',
    resposta:
      '"O sobrinho, Walter Arthurs, negociante em Moorford — parente único, herdeiro único. O testamento está nos meus arquivos, e junto dele umas cartas de cobrança que {g:o senhor|a senhora} talvez queira ler. Digo só isso; não me cabe temperar a sopa antes do cozinheiro."',
  },
  {
    id: 'inimigos',
    pergunta: 'O morto tinha desafetos declarados?',
    resposta:
      '"De véspera, por sinal: Caleb Grey, o moleiro, esteve na loja sexta à tarde devolvendo um conserto, aos brados, e ainda passou na delegacia para lavrar queixa. E um carroceiro veio me contar de outros gritos na loja, ao cair da mesma tarde. Sexta movimentada, para um homem que morreu nela… isto é, que pode ter morrido no sábado, como diz o relógio. {g:O senhor|A senhora} me entende."',
  },
  {
    id: 'quem_vive',
    pergunta: 'Quem vivia ou trabalhava com a vítima?',
    resposta:
      '"Viúvo, sem filhos; morava sobre a própria loja. Na oficina, dois: Silas Crane, o oficial que o achou, e o aprendiz, o rapazinho Tull. Fora isso, a vila — e a Sra. Rooke, da loja e correio em frente, que era das poucas visitas que o velho recebia."',
  },
];

// Descrição da tela de seleção (§12): um único perito atende ao chamado.
export const OPCOES_PERSONAGEM = [
  {
    id: 'harlan',
    nome: 'Harlan Blackwell',
    descricao:
      'Assistente de perito há dois anos; sem registro, sem laudo próprio. O que tem é o olho treinado do mestre e um termômetro emprestado com uma trinca que "não afeta a leitura".',
  },
];
