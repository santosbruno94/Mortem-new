// =====================================================================
// AS INTERVENÇÕES DA NOITE — o catálogo que a reconstituição (D24) lê.
//
// Uma intervenção é um GESTO com que a noite foi arrumada para ser lida de
// outra maneira: a hora posta no mostrador, o assalto que não levou nada, a
// resposta ensaiada na boca do rapaz. Não é a lista do que aconteceu; é a
// lista do que se fez para que o que aconteceu não se visse.
//
// CAMADA NARRATIVA. `veredicto.js` e `acusacao.js` não importam este
// arquivo, e a GR6-6 do `qa.mjs` cobra por leitura de fonte. Nada aqui
// muda desfecho nenhum: quando a cena roda, o veredicto já está calculado.
//
// O CONTRATO É A G9, E CABE NUMA LINHA: **a cena dramatiza; não prova.**
// Do que decorrem as três regras deste catálogo:
//
//   • `exige` são TODAS as cartas que têm de estar na mesa para que o gesto
//     se desfaça em cena — às vezes um par, às vezes uma só, conforme o que
//     a arrumação precisa para ceder. Faltando qualquer uma, o gesto não
//     entra na cena — não entra encoberto, não entra insinuado, não entra
//     de modo nenhum. Quem não colheu não vê, e a intervenção fica de pé
//     (martelo (c) da OS-R7).
//   • A PROSA DE UM GESTO NÃO AFIRMA O QUE OUTRO GESTO PROVA. Cada texto
//     fica dentro do que as suas próprias cartas de `exige` sustentam: dizer
//     na lasca de vidro que a sala foi arrumada para ser lida entregaria a
//     encenação inteira a quem pagou só pela lasca. É o furo de G9 que
//     nenhuma guarda apanha — as guardas veem marcador e nome, não excesso
//     de tese —, e por isso fica escrito aqui.
//   • NENHUM GESTO TEM AUTOR. A prosa diz a mão, nunca o nome: nomear quem
//     pôs os ponteiros seria provar por conta do jogador, e é exatamente o
//     que a G9 proíbe. Quem nomeia é o monólogo, depois, e só até onde a
//     cadeia dele alcança. É também o que faz a G3 valer por construção —
//     sem nome na cena, não há como o texto ramificar no bit `culpado`.
//   • A `hora` de cada gesto É AUTOSSUFICIENTE, e nunca afirma relógio que
//     as cartas de `exige` não deem. As três da noite fechada trazem hora
//     porque as cartas a trazem (a declaração das sete e meia, a das oito,
//     a roda de contagem pousada na nona badalada); as outras dizem o
//     cômodo, que é o que se sabe. Marcador relativo ("depois disso") fica
//     proibido por construção: a cena é uma lista FILTRADA, e o gesto de
//     cima pode não estar lá.
//
// A ordem do array é a ordem em que os GESTOS foram feitos — a noite, e
// depois os dias que se seguiram. Não é a ordem dos factos que os desfazem:
// o quarto às escuras às nove e o portão passado das dez derrubam um gesto
// das oito, e chegam mais longe na noite do que o gesto seguinte. A cena
// percorre o array de cima a baixo; não há sorteio de ordem.
// =====================================================================

// `rubrica` NÃO vai à tela (a cena renderiza só `hora` e `prosa`): é o
// rótulo de auditoria com que a telemetria da Fase 0 imprime o catálogo.
// Por isso pode nomear o gesto pelo que ele é, sem ferir a observação pura.
export const INTERVENCOES_NOITE = [
  {
    id: 'saida_ensaiada',
    hora: 'Às sete e meia',
    rubrica: 'a hora de sair, dada duas vezes com as mesmas palavras',
    exige: ['alibi_silas', 'alibi_davey'],
    prosa:
      'A oficina fecha-se com dois do lado de fora. A hora de sair sai depois pela boca de um e pela do outro, a mesma hora e a mesma ordem de gestos. Uma das duas, perguntada segunda vez, volta com as mesmas palavras na mesma ordem, e foi ensaiada antes de ser dita.',
  },
  {
    id: 'quarto_recolhido',
    hora: 'Às oito, na estalagem',
    rubrica: 'o recolhimento ao quarto, contra o quarto às escuras às nove',
    exige: ['alibi_silas', 'corrob_estalajadeiro'],
    prosa:
      'O quarto cinco é o de quem declarou recolher-se às oito e não tornar a sair. Às nove, com a água quente subindo ao três, o cinco está às escuras e a cama por desfazer; o portão do pátio bate passado das dez.',
  },
  {
    id: 'mostrador_posto',
    hora: 'No escritório, passadas as nove',
    rubrica: 'os ponteiros recuados a um quarto para as nove, e só então o esmagamento',
    exige: ['ev_relogio_lareira', 'ev_maquinismo'],
    // A ORDEM AQUI É O PIVÔ DO CASO, e não detalhe de prosa: os ponteiros
    // recuam com a máquina ainda viva, e a peça só vem ao chão depois. Uma
    // cena que esmagasse primeiro tornaria a direção indiferente — num
    // relógio morto, adiantar seria tão silencioso quanto recuar — e o
    // «08h45» perderia a razão de ser. As duas cartas de `exige` bastam
    // para a derivar: a roda parou na nona badalada, logo os ponteiros não
    // atravessaram as dez, as onze e o meio-dia sem que o carrilhão desse
    // sinal.
    prosa:
      'Os ponteiros do relógio de lareira recuam até um quarto para as nove, e a máquina ainda está viva quando isso se faz: adiantá-los teria feito o carrilhão bater na rua vazia. Só depois a peça vem ao chão, e a alavanca das badaladas fica pousada no nono entalhe da roda, de onde não passou.',
  },
  {
    id: 'assalto_encenado',
    hora: 'Na loja, na mesma noite',
    rubrica: 'as gavetas puxadas e a fechadura forçada pelo lado de fora',
    exige: ['ev_vitrine', 'ev_fechadura'],
    prosa:
      'As gavetas do balcão saem uma a uma e a caixa do troco esvazia-se. A vitrine dos dez relógios de ouro fica com as tampas por abrir e as etiquetas voltadas para cima. Na porta dos fundos a alavanca morde o batente pelo lado de fora, e as lascas de tinta caem para o degrau do beco.',
  },
  {
    id: 'buril_lavado',
    hora: 'Na oficina, na mesma noite',
    rubrica: 'o buril lavado e recolhido à cera dos outros',
    exige: ['ev_estojo_buril', 'ev_residuo_ferida'],
    prosa:
      'Um buril passa pela água e volta ao estojo, entre os cabos vestidos da mesma cera parda. A umidade entra na junta do aço com o cabo e fica lá; o vermelho-de-polir que o canal da ferida guarda sob o coágulo ficou onde a água não chegava.',
  },
  {
    id: 'livro_desmanchado',
    hora: 'Na grelha do escritório',
    rubrica: 'o livro desmanchado e alimentado à grelha aos punhados',
    exige: ['ev_cinza_livro'],
    prosa:
      'O livro é desmanchado antes de ir ao lume: a costura cede, e as folhas descem à grelha aos punhados. Fica entre as barras o que o fogo não come — o fecho de latão com a sua chapa, um fio de linho preso à dobra e um pedaço de pasta empenada com o vinco das nervuras.',
  },
  {
    id: 'bainha_por_sacudir',
    hora: 'Ao sair da sala',
    rubrica: 'a bainha que saiu da sala sem ser sacudida',
    exige: ['ev_vidro_dobra'],
    prosa:
      'A bainha de calça que sai daquela sala leva presa uma lasca de vidro de mostrador do tamanho de meia unha, abaulada, com um fio de tinta dourada na borda.',
  },
  {
    id: 'janela_fechada',
    hora: 'Ao meio-dia de sábado',
    rubrica: 'o avistamento da viela retirado, e a janela fechada',
    exige: ['dep_mulher_viela'],
    prosa:
      'Dos fundos do nº 9 saiu o relato de uma senhora de escuro deixando a viela pouco antes das nove da noite de sexta. Procurada outra vez ao meio-dia, a testemunha diz não ter visto nada, e fecha a janela.',
  },
  {
    // A `hora` diz o cômodo, e não o dia: `comp_silas` não traz data, e o
    // relógio do jogo corre — quem gastar a tarde na estrada chega à saleta
    // já no domingo. Rótulo de dia que a mesa não dá é rótulo falsificável
    // em jogo.
    id: 'teoria_do_estranho',
    hora: 'Na saleta, depois do achado',
    rubrica: 'a teoria do ladrão de fora, oferecida sem que se pergunte',
    exige: ['comp_silas'],
    prosa:
      'A explicação já está pronta antes de alguém a pedir: gente de fora, da estrada, atrás do troco do caixa. Volta três vezes na mesma conversa, com variações, e nenhuma das três vem de pergunta que se tenha feito.',
  },
];

/**
 * As intervenções que a mesa do jogador desfaz, na ordem da noite. Toda
 * carta de `exige` tem de estar na mesa — é a GR7-3 escrita na função que
 * a cena consome, e não numa promessa de prosa.
 *
 * O catálogo entra por parâmetro porque ele é DO CASO, não do motor: o
 * caso-escola declara o seu no pacote (`intervencoes`), e os gerados não
 * declaram nenhum enquanto a OS-R9 não lhes ensinar a produzi-lo. Catálogo
 * vazio devolve lista vazia, e é a camada de cima que decide o que fazer
 * com isso (ver `montarReconstituicao`).
 *
 * @param {Iterable<string>} idsNaMesa
 * @param {Array<object>} catalogo
 * @returns {Array<object>} subconjunto do catálogo, na ordem dele
 */
export function intervencoesRebatidas(idsNaMesa, catalogo = INTERVENCOES_NOITE) {
  const mesa = new Set(idsNaMesa || []);
  return (catalogo || []).filter((i) => i.exige.every((id) => mesa.has(id)));
}
