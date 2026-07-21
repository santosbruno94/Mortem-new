// =====================================================================
// Sequência de abertura em 7 passos: da pensão em Caulfield ao briefing
// do Delegado Wycliffe. O Dr. Alcott recebe o chamado de Briarstone e
// despacha Harlan por telegrama, julgando o caso rotineiro; quem chega
// na vila é o aprendiz, não o mestre.
// Toda a prosa admite {detective.campo} e {g:masc|fem}.
//
// Prosa regida por docs/guia-de-estilo.md e docs/biblia-de-vozes.md:
// observação pura, vozes diferenciadas, brilho racionado.
// O campo `pensamento` (array) é monólogo interno de Harlan em primeira
// pessoa — renderizado em itálico pelo componente Abertura.jsx.
// =====================================================================

export const PASSOS_ABERTURA = [
  {
    id: 'caulfield',
    titulo: 'Caulfield, 14 de outubro de 1893',
    paragrafos: [
      'A pensão da Sra. Potts cobra dois xelins por semana e entrega dois xelins: um quarto estreito, meia vela, uma garrafa vazia e o jornal de anteontem dobrado sobre a mesa.',
      'Sobre essa mesa, {detective.surname} dispõe os instrumentos do Dr. Alcott: a lente e o termômetro de mercúrio com a trinca no vidro. A caderneta de capa rachada, essa é {g:dele|dela}; vem por último, aberta na última página usada: "Sra. Ellen Parry, 71 anos. Queda na escada. Fratura cervical. Morte natural." Fechada.',
    ],
    pensamento: [
      'Já imagino o velho dizendo: "Não era isso que queria, jovem?" E tenho de admitir, a raposa tem razão. Se soubesse jogar cartas como sabe fugir de usurários e de trabalho, não precisaria mandar aprendizes examinar mortos de aldeia.',
    ],
    rotuloBotao: 'A vela queima',
  },
  {
    id: 'sra_potts',
    titulo: 'Batem à porta',
    paragrafos: [
      'A Sra. Potts não espera resposta: entra com o castiçal numa mão e, na outra, um formulário pardo dobrado sobre uma carta lacrada. Pousa os dois sobre a mesa.',
      '"Veio da estação agora mesmo. O rapaz disse que era do Dr. Alcott para {g:o senhor|a senhora}, urgente." Fica onde está, o olhar no formulário, no rosto {g:do hóspede|da hóspede}. Vira a carta entre os dedos, lendo o remetente. "Briarstone. Então mataram alguém por lá."',
    ],
    rotuloBotao: 'Ler o telegrama',
  },
  {
    id: 'telegrama',
    titulo: 'O telegrama do Dr. Alcott',
    paragrafos: [
      'O formulário pardo traz a letra do telegrafista da estação, copiada do fio: maiúsculas apertadas, o selo do Post Office no canto.',
      '"SR BLACKWELL PENSAO POTTS CAULFIELD. CHAMADO DE BRIARSTONE. RELOJOEIRO MORTO LOJA REVIRADA. PROVAVELMENTE BRIGA DE TABERNA OU GATUNO. VA OLHE O CORPO MANDE RESUMO PELO PRIMEIRO CORREIO. NAO ASSINE NADA. ALCOTT"',
    ],
    pensamento: [
      'Provavelmente. A palavra preferida do Dr. Alcott para tudo que lhe dá trabalho. Provavelmente não é nada, provavelmente é morte natural, provavelmente o rapaz resolve. A vila fica a uma estação daqui; ele, a quatro condados de distância, onde nenhum usurário o procure. Não era isto que eu queria, mas era o que estava no preço.',
    ],
    rotuloBotao: 'Ler a carta do delegado',
  },
  {
    id: 'carta',
    titulo: 'A carta do Delegado',
    carta: true,
    paragrafos: [
      'A carta lacrada traz o brasão gasto de uma repartição, prensado torto no lacre de cera vermelha. A cera racha sob o polegar. O papel é grosso, de bom fornecedor; a letra inclina-se para a direita, firme no começo de cada linha e mais corrida ao fim dela.',
      '"Dr. Alcott — Escrevo-lhe na qualidade de delegado de Briarstone e na condição, que não me envergonho de confessar, de homem posto fora da sua profundidade. O Sr. Geoffrey Arthurs, relojoeiro desta vila e homem que nunca deu trabalho a esta delegacia, foi achado morto esta manhã no escritório dos fundos da sua loja, com a garganta aberta e a casa toda revirada."',
      '"Não toquei em nada; mandei que nem uma cadeira saísse do lugar, e pus um guarda à porta até que o senhor chegue. Venha, peço-lhe, pelo primeiro trem que o traga a nós. Briarstone paga os seus honorários e, se o caso assim pedir, o seu silêncio; disso trataremos melhor com um copo na mão. Perdoe a letra: escrevo de pé, e a mão ainda não me voltou ao sossego. — Lemuel Wycliffe, Delegado."',
    ],
    pensamento: [
      'A garganta aberta. Não é queda na escada, não é bêbado de taberna. O delegado escreveu ao Dr. Alcott, e o Dr. Alcott mandou a mim.',
    ],
    rotuloBotao: 'Aceitar o chamado',
  },
  {
    id: 'transformacao',
    titulo: 'A mesa se transforma',
    paragrafos: [
      'A garrafa vai para o chão, o jornal para o fogo. A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta na primeira página em branco.',
      '{detective.surname} veste o casaco ainda úmido da véspera e desce para a estação.',
    ],
    pensamento: [
      'O Dr. Alcott mandou não assinar nada. A garganta aberta, a loja revirada, o guarda à porta: e o Dr. Alcott mandou não assinar nada. O trem não espera, e o velho não virá.',
    ],
    rotuloBotao: 'Tomar o trem',
  },
  {
    id: 'briarstone',
    titulo: 'Briarstone',
    paragrafos: [
      'A plataforma cheira a carvão e a palha molhada de chuva. Além dos trilhos, Briarstone estende-se numa única rua, e a luz de outubro bate rasa nos telhados e deixa a calçada meio na sombra, meio no sol.',
      'Os sinos da igreja dão a hora num extremo da rua; um cão responde do outro. A meia rua, uma vitrine tem a cortina corrida por dentro, e à porta dela um guarda moço mantém-se de mãos cruzadas às costas, o rosto sem cor.',
      'O Delegado Wycliffe espera junto ao portão. Os olhos vão do rosto de {detective.surname} ao trem que se afasta, à plataforma que se esvazia. Ninguém mais desceu.',
      '"O Dr. Alcott não pôde vir, então." "{g:O senhor|A senhora} é…"',
      '"{detective.surname}. Assistente do Dr. Alcott."',
      'Wycliffe mede {g:o rapaz|a moça} dos sapatos ao colarinho. Mas o corpo não espera. Aperta a mão com uma só, breve. "Pois bem, {detective.treatment} {detective.surname}. O Sr. Arthurs está como o encontramos ontem… esta manhã, quero dizer. Venha; explico-me pelo caminho, que a andar me saio melhor."',
    ],
    rotuloBotao: 'Ouvir o delegado',
  },
  {
    id: 'briefing',
    titulo: 'O relato do Delegado Wycliffe',
    briefing: true,
    paragrafos: [
      '"O essencial é isto: Sr. Geoffrey Arthurs, sessenta e um anos, relojoeiro. Achado morto no escritório dos fundos, sábado às nove e vinte da manhã, por Silas Crane — o oficial dele, homem de doze anos de casa. A porta do beco forçada, o troco do caixa levado, a loja fechada desde a noite de sexta, dia 13."',
      'Detém-se diante da relojoaria e baixa a voz. "Pergunte o que quiser antes de entrarmos. O Dr. Alcott haveria de querer ver a cena primeiro; suponho que {g:o senhor|a senhora} saiba o que procurar."',
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
      '"Aí é que a sorte nos ajuda: na confusão, o relógio da lareira veio ao chão e parou num quarto para as nove. E o moço do padeiro viu luz na oficina às cinco e pouco da madrugada. Vivo às cinco, morto antes das nove e vinte — o ladrão mal teria virado a esquina. É o que eu penso, veja bem. O que {g:o senhor|a senhora} pensar, com o corpo à frente… bom, o que o Dr. Alcott pensaria."',
  },
  {
    id: 'quem_herda',
    pergunta: 'Quem herda com essa morte?',
    resposta:
      '"O sobrinho, Walter Arthurs, negociante em Moorford — parente único, herdeiro único. O testamento está nos meus arquivos, e junto dele umas cartas de cobrança que {g:o senhor|a senhora} talvez queira ler. Digo só isso; não me cabe temperar a sopa antes do cozinheiro. Ou do ajudante do cozinheiro, no caso."',
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
      'Assistente do Dr. Alcott há dois anos; sem registro, sem laudo próprio. O que tem é o olho treinado do mestre e um termômetro emprestado com uma trinca que "não afeta a leitura".',
  },
];
