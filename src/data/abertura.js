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
      'Sobre essa mesa, {detective.title} {detective.surname} dispõe os instrumentos do ofício: a lente e o termômetro de mercúrio, e a caderneta de capa rachada onde há três semanas não se anota um caso. Os mortos da Inglaterra andam morrendo de causas que qualquer médico de aldeia sabe assinar.',
    ],
    rotuloBotao: 'A vela queima',
  },
  {
    id: 'sra_potts',
    titulo: 'Batem à porta',
    paragrafos: [
      'A Sra. Potts não espera resposta: entra com o castiçal numa mão e um envelope na outra, e pousa o envelope sobre a mesa.',
      '"Veio a cavalo, de Briarstone. O rapaz disse que era para entregar em mãos, e que o delegado de lá manda dizer que é urgente." Fica onde está, o olhar no lacre, na cara {g:do hóspede|da hóspede}. "Briarstone. Então mataram alguém por lá."',
    ],
    rotuloBotao: 'Abrir o envelope',
  },
  {
    id: 'carta',
    titulo: 'A carta do Delegado',
    carta: true,
    paragrafos: [
      '"{detective.title} {detective.surname} — Escrevo na qualidade de delegado de Briarstone e na condição, que não me envergonho de confessar, de homem fora da sua profundidade. O Sr. Geoffrey Arthurs, relojoeiro desta vila, foi achado morto esta manhã no escritório dos fundos da sua loja. Do estado em que o achamos, não sei dizer mais do que isto sem me arriscar a dizer tolice."',
      '"Deixei tudo como estava; mandei que nada se tocasse. Peço-lhe que venha pelo primeiro trem. Briarstone paga os seus honorários e, se for o caso, o seu silêncio. — Lemuel Wycliffe, Delegado."',
    ],
    rotuloBotao: 'Aceitar o chamado',
  },
  {
    id: 'transformacao',
    titulo: 'A mesa se transforma',
    paragrafos: [
      'A garrafa vai para o chão, o jornal para o fogo. A mesa estreita da pensão fica sendo, pelo tempo que durar a verdade, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta na primeira página em branco.',
      '{detective.title} {detective.surname} veste o casaco ainda úmido da véspera e desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer.',
    ],
    rotuloBotao: 'Tomar o trem',
  },
  {
    id: 'briarstone',
    titulo: 'Briarstone',
    paragrafos: [
      'Briarstone é uma rua comprida com pretensões a vila: a igreja num extremo, a taverna no meio, a relojoaria de cortina cerrada, e à porta dela um guarda moço, pálido como quem viu o primeiro morto da carreira.',
      'O Delegado Wycliffe espera na plataforma e aperta a mão {g:do perito|da perita} com um alívio que não disfarça. "{detective.title} {detective.surname}. Agradeço a presteza. O Sr. Arthurs está como o encontramos ontem de manhã… esta manhã, quero dizer. Venha. Explico-me pelo caminho, que andando me saio melhor."',
    ],
    rotuloBotao: 'Ouvir o delegado',
  },
  {
    id: 'briefing',
    titulo: 'O briefing do Delegado Wycliffe',
    briefing: true,
    paragrafos: [
      '"O essencial é isto: Sr. Geoffrey Arthurs, sessenta e um anos, relojoeiro. Achado morto esta manhã no escritório dos fundos. Quem o achou foi o sobrinho, Edgar, às nove e meia. A loja estava fechada desde a noite de sexta, dia 13."',
      'Detém-se diante da relojoaria e baixa a voz. "Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}; aqui fora, ainda posso ser útil."',
    ],
    rotuloBotao: 'Entrar — iniciar a investigação',
  },
];

// Perguntas do briefing (custo zero). As respostas plantam dados e
// iscas: o relógio das 09h00, o testamento, as dívidas, a briga.
export const PERGUNTAS_BRIEFING = [
  {
    id: 'sobre_a_morte',
    pergunta: 'O que se sabe sobre a hora da morte?',
    resposta:
      '"Aí é que está a sorte: o escritório foi revirado, e na confusão o relógio da lareira caiu e parou. Nove em ponto. O sobrinho achou o corpo às nove e meia — o assassino mal teria virado a esquina. É o que eu penso, veja bem. O que o senhor pensa, com o corpo à frente, é que vale."',
  },
  {
    id: 'quem_herda',
    pergunta: 'Quem herda com essa morte?',
    resposta:
      '"O sobrinho, Edgar Arthurs. Parente único, herdeiro único. O testamento está nos meus arquivos, e junto dele umas cartas de cobrança que o senhor talvez queira ler. Digo só isso; não me cabe temperar a sopa antes do cozinheiro."',
  },
  {
    id: 'inimigos',
    pergunta: 'O morto tinha inimigos declarados?',
    resposta:
      '"Um, e dos que gritam: Thomas Blackwood, taverneiro do The Crossed Keys. Devia ao velho e, há três semanas, trocaram ameaças diante de meia taverna. Está no meu livro de ocorrências. Se ódio bastasse para matar, eu já teria prendido o homem e ido dormir."',
  },
  {
    id: 'quem_vive',
    pergunta: 'Quem mais vivia com a vítima?',
    resposta:
      '"Só a governanta, a Sra. Mabel Hudson. Dezessete anos na casa, mulher de igreja. Anda abalada, coitada, mal alinha duas palavras. A casa é grande; ela dormia no quarto dos fundos, lá em cima."',
  },
];

// Descrições da tela de seleção (§12)
export const OPCOES_PERSONAGEM = [
  {
    id: 'harlan',
    nome: 'Dr. Harlan Blackwell',
    descricao:
      'Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem. Trata os delegados com a cortesia exata de quem preferia não precisar deles.',
  },
  {
    id: 'lenore',
    nome: 'Dr.ª Lenore Blackwell',
    descricao:
      'A primeira perita licenciada da Inglaterra — licença que três condados ainda se recusam a reconhecer. Aprendeu cedo que cada prova sua precisa ser três vezes mais sólida quando o nome assinado no laudo é de mulher. Assina assim mesmo.',
  },
];
