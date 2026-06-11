// =====================================================================
// Sequência de abertura em 6 passos (§4.1–4.2): da pensão em Caulfield
// ao briefing do Delegado Wycliffe — que planta informações e iscas.
// Toda a prosa admite {detective.campo} e {g:masc|fem}.
// =====================================================================

export const PASSOS_ABERTURA = [
  {
    id: 'caulfield',
    titulo: 'Caulfield, 14 de outubro de 1893',
    paragrafos: [
      'A pensão da Sra. Potts cobra dois xelins por semana e entrega exatamente isso: um quarto estreito, uma vela pela metade, uma garrafa que já não engana ninguém e o jornal de anteontem dobrado sobre a mesa.',
      'Sobre essa mesa, {detective.title} {detective.surname} estende os instrumentos do ofício como quem põe flores num túmulo: a lente, o termômetro de mercúrio, a caderneta de capa rachada. Há três semanas nenhuma carta chega. Os mortos da Inglaterra andam morrendo de causas que qualquer médico de aldeia sabe assinar.',
    ],
    rotuloBotao: 'A vela queima',
  },
  {
    id: 'sra_potts',
    titulo: 'Batem à porta',
    paragrafos: [
      'A Sra. Potts não espera resposta: entra com o castiçal numa mão e um envelope na outra, e o pousa sobre a mesa com a cerimônia de quem entrega uma intimação.',
      '"Veio a cavalo, de Briarstone. O rapaz disse que era para entregar em mãos {g:ao senhor|à senhora}, e que o delegado de lá manda dizer que é urgente." Demora-se um instante além do necessário, medindo o envelope, o lacre, a cara {g:do hóspede|da hóspede}. "Briarstone. Lá mataram alguém, então."',
    ],
    rotuloBotao: 'Abrir o envelope',
  },
  {
    id: 'carta',
    titulo: 'A carta do Delegado',
    carta: true,
    paragrafos: [
      '"{detective.title} {detective.surname} — Escrevo na qualidade de delegado de Briarstone e na condição, que não me envergonho de confessar, de homem fora de sua profundidade. O Sr. Geoffrey Arthurs, relojoeiro desta vila, foi encontrado morto esta manhã no escritório dos fundos de sua loja, em circunstâncias que a minha experiência não alcança."',
      '"O corpo permanece como foi achado; mandei que nada se tocasse. Rogo-lhe que venha pelo primeiro trem. Briarstone pagará seus honorários e seu silêncio sobre o estado em que nos encontrar. — Lemuel Wycliffe, Delegado."',
    ],
    rotuloBotao: 'Aceitar o chamado',
  },
  {
    id: 'transformacao',
    titulo: 'A mesa se transforma',
    paragrafos: [
      'Aceitar um caso é um gesto físico: a garrafa vai para o chão, o jornal para o fogo, e a mesa estreita da pensão torna-se, pelo tempo que durar a verdade, uma escrivaninha de perícia.',
      'A lente à esquerda. O termômetro à direita. A caderneta aberta na primeira página em branco. {detective.title} {detective.surname} veste o casaco ainda úmido da véspera e desce para a estação antes que a Sra. Potts invente uma pergunta.',
    ],
    rotuloBotao: 'Tomar o trem',
  },
  {
    id: 'briarstone',
    titulo: 'Briarstone',
    paragrafos: [
      'Briarstone é uma rua comprida com pretensões a vila: a igreja, a taverna, a relojoaria com a cortina cerrada e um guarda jovem demais à porta, pálido como quem viu o primeiro morto da carreira.',
      'O Delegado Wycliffe espera na plataforma. Aperta a mão {g:do perito|da perita} com alívio mal disfarçado: "{detective.title} {detective.surname}. Agradeço a presteza. O senhor Arthurs está como o encontramos ontem… isto é, como o encontraram esta manhã. Eu me explico mal. Venha: explico-me andando."',
    ],
    rotuloBotao: 'Ouvir o delegado',
  },
  {
    id: 'briefing',
    titulo: 'O briefing do Delegado Wycliffe',
    briefing: true,
    paragrafos: [
      '"O essencial é o seguinte: o Sr. Geoffrey Arthurs, sessenta e um anos, relojoeiro, foi achado morto esta manhã no escritório dos fundos. Quem o achou foi o sobrinho, Edgar, às nove e meia. A loja estava fechada desde a noite de sábado, dia 13."',
      'Wycliffe detém-se diante da relojoaria e baixa a voz: "Pergunte o que quiser antes de entrar. Depois, a casa é {g:sua|sua}… a perícia é {g:do senhor|da senhora}, quero dizer."',
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
      '"Ah, quanto a isso a sorte nos sorriu: o escritório foi revirado e o relógio da lareira caiu na confusão — parado às nove em ponto. O sobrinho o achou às nove e meia. O assassino mal tinha esfriado o lugar, se me permite o palpite. Mas o palpite é meu, e a perícia é {g:sua|sua}."',
  },
  {
    id: 'quem_herda',
    pergunta: 'Quem herda com essa morte?',
    resposta:
      '"O sobrinho, Edgar Arthurs. Único parente, único herdeiro — o testamento está nos meus arquivos, junto com umas cartas de cobrança que talvez {g:o senhor|a senhora} queira ler. Não digo mais para não temperar a sopa antes do cozinheiro."',
  },
  {
    id: 'inimigos',
    pergunta: 'O morto tinha inimigos declarados?',
    resposta:
      '"Um, e dos barulhentos: Thomas Blackwood, o taverneiro do The Crossed Keys. Devia dinheiro ao velho e há três semanas trocaram ameaças diante de meia taverna — está no meu livro de ocorrências. Se o ódio matasse sozinho, eu já teria meu homem."',
  },
  {
    id: 'quem_vive',
    pergunta: 'Quem mais vivia com a vítima?',
    resposta:
      '"Só a governanta, a Sra. Mabel Hudson, há dezessete anos na casa. Mulher séria, de igreja. Anda abalada — mal consegue responder duas palavras seguidas, coitada. A casa é grande e ela dormia no quarto dos fundos do andar de cima."',
  },
];

// Descrições da tela de seleção (§12)
export const OPCOES_PERSONAGEM = [
  {
    id: 'harlan',
    nome: 'Dr. Harlan Blackwell',
    descricao:
      'Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, célebre nos tribunais do condado pela precisão com que estabelece o intervalo post-mortem. Diz-se que nunca apertou a mão de um delegado sem antes olhar-lhe as unhas.',
  },
  {
    id: 'lenore',
    nome: 'Dr.ª Lenore Blackwell',
    descricao:
      'A primeira perita licenciada da Inglaterra — licença que três condados ainda se recusam a reconhecer. Sabe, porque a vida a fez saber, que cada prova sua precisa ser três vezes mais sólida quando o nome assinado no libelo é feminino. Assina mesmo assim.',
  },
];
