// =====================================================================
// Sequência de abertura em 9 passos: da manhã de sábado em Briarstone à
// porta da relojoaria, passando pela pensão em Caulfield. O guarda
// Wycliffe dá notícia da morte ao coroner do condado e escreve ao Dr.
// Abbot; o Dr. Abbot despacha Harlan por telegrama, julgando o caso
// rotineiro. Quem chega na vila é o aprendiz, não o mestre — com uma
// ordem de exame que traz o nome do mestre, e não o dele.
// Toda a prosa admite {detective.campo} e {g:masc|fem}.
//
// OS-R3 — A ABERTURA. Três coisas mudaram aqui, e por quê:
//   • O jogo abre pelos olhos de quem achou o corpo (D13), e não mais na
//     pensão. CERCA DE FAIR-PLAY, e ela é dura porque quem acha o corpo
//     é o réu: o cold open é observação pura de leigo — a hora da
//     DESCOBERTA (fato público), nunca a da morte; nada do estado da
//     cena; nem uma palavra sobre o relógio da lareira. E a regra que
//     rege cada gesto de Silas neste passo: se o texto admite "este
//     homem está a fingir", tem de admitir igualmente "este homem está
//     em choque". Se só admite uma leitura, está errado (G3).
//   • O coroner entra, fora de cena (D12): é ele quem ORDENA o exame e
//     quem o PAGA — £2 2s, Medical Witnesses Act 1836 —, e é a ordem
//     dele que traz a data do inquérito. O constable é coroner's
//     officer, o intermediário que notifica; nunca o contratante
//     (docs/kb-medicina-legal/inquerito-e-policia.md §1–§2).
//   • A carta do guarda perdeu a autoridade que um constable não tinha e
//     ganhou a forma epistolar de 1893 ("Senhor —", subscrição).
// O prazo do inquérito (segunda, 16/out, 10h, no Wheatsheaf) é FICÇÃO:
// nenhuma regra o lê, nenhum desfecho muda por ele.
//
// Prosa regida por docs/guia-de-estilo.md e docs/biblia-de-vozes.md:
// observação pura, vozes diferenciadas, brilho racionado.
// O campo `pensamento` (array) é monólogo interno de Harlan em primeira
// pessoa — renderizado em itálico pelo componente Abertura.jsx.
// =====================================================================

export const PASSOS_ABERTURA = [
  {
    id: 'descoberta',
    titulo: 'Briarstone, sábado, 14 de outubro de 1893',
    paragrafos: [
      'A relojoaria Arthurs esteve fechada desde a noite de sexta. Na manhã de sábado é Silas Crane, o oficial da casa, quem abre: tira as tábuas da vitrine com o aprendiz, acende o fogo da bancada e põe-se ao serviço na oficina, como faz todas as manhãs. O Sr. Arthurs não desce.',
      'Às nove e vinte, o oficial deixa a bancada e vai ao escritório dos fundos. Dá dois passos para dentro e para. Fica ali.',
      'Volta ao corredor e diz, da soleira da rua: "Corre ao posto. Diz ao guarda Wycliffe que venha já."',
      'O rapaz corre. O oficial senta-se no degrau da loja, de costas para dentro, as mãos sobre os joelhos, e ali fica até o guarda dobrar a esquina.',
    ],
    rotuloBotao: 'Caulfield, na mesma manhã',
  },
  {
    id: 'caulfield',
    titulo: 'Caulfield, sábado, 14 de outubro de 1893',
    paragrafos: [
      'A pensão da Sra. Potts cobra dois xelins por semana e entrega dois xelins: um quarto estreito, meia vela, uma garrafa vazia e o jornal de anteontem dobrado sobre a mesa.',
      'Sobre essa mesa, {detective.surname} dispõe os instrumentos do Dr. Abbot: a lente e o termômetro de mercúrio com a trinca no vidro. A caderneta de capa rachada, essa é {g:dele|dela}; vem por último, aberta na última página usada: "Sra. Ellen Parry, 71 anos. Queda na escada. Fratura cervical. Morte natural." Fechada.',
    ],
    pensamento: [
      'Já imagino o velho dizendo: "Não era isso que queria, jovem?" E tenho de admitir, a raposa tem razão. Se soubesse jogar cartas como sabe fugir de usurários e de trabalho, não precisaria mandar aprendizes examinar mortos de aldeia.',
    ],
    rotuloBotao: 'A manhã avança',
  },
  {
    id: 'sra_potts',
    titulo: 'Batem à porta',
    paragrafos: [
      'A Sra. Potts não espera resposta: entra a limpar as mãos ao avental e, na outra, um formulário pardo dobrado sobre um envelope gordo. Pousa os dois sobre a mesa.',
      '"Este veio da estação agora mesmo, do Dr. Abbot para {g:o senhor|a senhora}, urgente, disse o rapaz. O outro veio a cavalo, e o homem perguntou pelo Dr. Abbot na estação; mandaram-no cá." Fica onde está, o olhar nos dois papéis, no rosto {g:do hóspede|da hóspede}. Vira o de baixo entre os dedos, lendo o remetente. "Briarstone. Então mataram alguém por lá."',
    ],
    rotuloBotao: 'Ler o telegrama',
  },
  {
    id: 'telegrama',
    titulo: 'O telegrama do Dr. Abbot',
    // Este passo se apresenta no impresso do Post Office (Form A1): o
    // primeiro parágrafo é a olhada de fora, e o que vem depois é a cópia
    // do fio, na letra do balcão. Bandeira de APRESENTAÇÃO — nenhuma regra
    // a lê; sem ela, o passo volta a ser prosa corrida e o jogo é o mesmo.
    telegrama: true,
    paragrafos: [
      'O formulário pardo traz a letra do telegrafista da estação, copiada do fio: maiúsculas apertadas, o selo do Post Office no canto.',
      '"SR BLACKWELL PENSAO POTTS CAULFIELD. CHAMADO DE BRIARSTONE. RELOJOEIRO MORTO LOJA REVIRADA. PROVAVELMENTE BRIGA DE TABERNA OU GATUNO. O CORONER HA DE ORDENAR O EXAME EM MEU NOME. VA OLHE O CORPO MANDE RESUMO PELO PRIMEIRO CORREIO. NAO ASSINE NADA. ABBOT"',
    ],
    pensamento: [
      'Provavelmente. A palavra preferida do Dr. Abbot para tudo que lhe dá trabalho. Provavelmente não é nada, provavelmente é morte natural, provavelmente o rapaz resolve. A vila fica a uma estação daqui; ele, a quatro condados de distância, onde nenhum usurário o procure. Não era isto que eu queria, mas era o que estava no preço.',
    ],
    rotuloBotao: 'Abrir o envelope de Briarstone',
  },
  {
    id: 'ordem_do_coroner',
    titulo: 'A ordem do coroner',
    // Impresso do condado: texto de fôrma com os claros preenchidos à mão.
    // Bandeira de APRESENTAÇÃO — nenhuma regra a lê; sem ela, o passo volta a
    // ser prosa corrida e o jogo é o mesmo.
    ordem: true,
    paragrafos: [
      'O envelope traz dois papéis. O de cima é impresso, do condado: texto de fôrma com claros deixados em branco, e os claros preenchidos à mão, na letra que virá a assinar o outro papel.',
      'CONDADO DE ——. INQUÉRITO SOBRE A MORTE DE Geoffrey Arthurs, relojoeiro, da vila de Briarstone.',
      'Havendo eu, Bramwell Foy, coroner de Sua Majestade para este condado, recebido notícia de morte violenta ou não natural, e sendo meu ofício inquirir dela na forma do Ato dos Coroners de 1887, fica o Dr. Abbot, praticante legalmente habilitado e inscrito, requisitado a examinar o dito corpo e a comparecer perante mim e o júri para depor do que apurar.',
      'Pelo exame e pelo depoimento serão pagas duas libras e dois xelins, na forma do mesmo Ato.',
      'O inquérito abre na segunda-feira, dia dezesseis de outubro, às dez horas da manhã, na estalagem The Wheatsheaf, em Briarstone.',
      '(assinado) Bramwell Foy, coroner. Cópia do telegrama, lavrada no posto de Briarstone.',
    ],
    pensamento: [
      'Duas libras e dois xelins pelo exame e pelo depoimento. Quem paga é o coroner, e o coroner requisita o médico que lhe consta em lista: o Dr. Abbot, legalmente habilitado e inscrito. Quem vai pôr as mãos no corpo sou eu.',
    ],
    rotuloBotao: 'Ler a carta do guarda',
  },
  {
    id: 'carta',
    titulo: 'A carta do Guarda',
    carta: true,
    paragrafos: [
      'O segundo papel vem lacrado, com o brasão gasto de uma repartição prensado torto na cera vermelha. A cera racha sob o polegar. O papel é grosso, de bom fornecedor; a letra inclina-se para a direita, firme no começo de cada linha e mais corrida ao fim dela.',
      '"Senhor — Escrevo-lhe na qualidade de guarda de Briarstone e na condição, que não me envergonho de confessar, de homem posto fora da sua profundidade. O Sr. Geoffrey Arthurs, relojoeiro desta vila e homem que nunca me deu trabalho, foi achado morto esta manhã no escritório dos fundos da sua loja, com a garganta aberta e a casa toda revirada."',
      '"Cumpri o que me toca cumprir: não toquei em nada, mandei que nem uma cadeira saísse do lugar, pus um homem à porta e dei notícia da morte ao senhor coroner do condado, pelo telégrafo, na primeira hora. Ao senhor telegrafei também, e teve a bondade de me responder onde parava o seu assistente."',
      '"O senhor coroner nomeou-o da lista dos médicos e baixou a ordem antes do meio-dia; a mim tocou lavrá-la no impresso e pô-la a caminho. O original virá por mão dele. É por isso que mando homem a cavalo a Caulfield, e não pelo correio de segunda-feira. Venha, peço-lhe, pelo primeiro trem que o traga a nós. Perdoe a letra: escrevo de pé, e a mão ainda não me voltou ao sossego."',
      '"Sou, senhor, seu criado obediente. Obedientíssimo, devia eu escrever, que é o que se deve a um médico. — Lemuel Wycliffe, guarda de Briarstone."',
    ],
    pensamento: [
      'A garganta aberta. Não é queda na escada, não é bêbado de taberna. O guarda escreveu ao Dr. Abbot, e o Dr. Abbot mandou a mim.',
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
      'Segunda-feira às dez, no salão de uma estalagem, doze homens jurados hão de dizer de que morreu o Sr. Arthurs. Entre hoje e segunda há o resto de um sábado e um domingo.',
      'O Dr. Abbot mandou não assinar nada. A garganta aberta, a loja revirada, o homem à porta: e o Dr. Abbot mandou não assinar nada. O trem não espera, e o velho não virá.',
    ],
    rotuloBotao: 'Tomar o trem',
  },
  {
    id: 'briarstone',
    titulo: 'Briarstone',
    paragrafos: [
      'A plataforma cheira a carvão e a palha molhada de chuva. Além dos trilhos, Briarstone estende-se numa única rua, e a luz de outubro bate rasa nos telhados e deixa a calçada meio na sombra, meio no sol.',
      'Os sinos da igreja dão a hora num extremo da rua; um cão responde do outro. A meia rua, uma vitrine tem a cortina corrida por dentro, e à porta dela um homem moço mantém-se de mãos cruzadas às costas, o rosto sem cor.',
      'O guarda Wycliffe espera junto ao portão. Os olhos vão do rosto de {detective.surname} ao trem que se afasta, à plataforma que se esvazia. Ninguém mais desceu.',
      '"O Dr. Abbot não pôde vir, então." "{g:O senhor|A senhora} é…"',
      '"{detective.surname}. Assistente do Dr. Abbot."',
      'Wycliffe mede {g:o rapaz|a moça} dos sapatos ao colarinho. Mas o corpo não espera. Aperta a mão com uma só, breve. "Pois bem, {detective.treatment} {detective.surname}. O Sr. Arthurs está como o encontramos ontem… esta manhã, quero dizer. Venha; explico-me pelo caminho, que a andar me saio melhor."',
    ],
    rotuloBotao: 'Ouvir o guarda',
  },
  {
    id: 'briefing',
    titulo: 'O relato do guarda Wycliffe',
    briefing: true,
    paragrafos: [
      '"O essencial é isto: Sr. Geoffrey Arthurs, sessenta e um anos, relojoeiro. Achado morto no escritório dos fundos, sábado às nove e vinte da manhã, por Silas Crane — o oficial dele, homem de doze anos de casa. A porta do beco forçada, o troco do caixa levado, a loja fechada desde a noite de sexta, dia 13."',
      'Detém-se diante da relojoaria e baixa a voz. "Pergunte o que quiser antes de entrarmos. O Dr. Abbot haveria de querer ver a cena primeiro; suponho que {g:o senhor|a senhora} saiba o que procurar."',
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
      '"Aí é que a sorte nos ajuda: na confusão, o relógio da lareira veio ao chão e parou num quarto para as nove. E o moço do padeiro viu luz na oficina às cinco e pouco da madrugada. Vivo às cinco, morto antes das nove e vinte — o ladrão mal teria virado a esquina. É o que eu penso, veja bem. O que {g:o senhor|a senhora} pensar, com o corpo à frente… bom, o que o Dr. Abbot pensaria."',
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
      '"De véspera, por sinal: Caleb Grey, o moleiro, esteve na loja sexta à tarde devolvendo um conserto, aos brados, e ainda me bateu à porta para lavrar queixa. E um carroceiro veio me contar de outros gritos na loja, ao cair da mesma tarde. Sexta movimentada, para um homem que morreu nela… isto é, que pode ter morrido no sábado, como diz o relógio. {g:O senhor|A senhora} me entende."',
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
      'Assistente do Dr. Abbot há dois anos; sem registro, sem laudo próprio. O que tem é o olho treinado do mestre e um termômetro emprestado com uma trinca que "não afeta a leitura".',
  },
];
