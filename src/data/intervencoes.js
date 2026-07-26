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
//   • `exige` são as cartas que TÊM DE ESTAR NA MESA para que o gesto se
//     desfaça em cena. Não basta uma: a arrumação só cede quando o par que
//     a denuncia está colhido. Sem elas, o gesto não entra na cena — não
//     entra encoberto, não entra insinuado, não entra de modo nenhum. Quem
//     não colheu não vê, e a intervenção fica de pé (martelo (c) da OS-R7).
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
// A ordem do array é a ordem da noite, e depois a dos dias que se seguiram.
// A cena percorre-a de cima a baixo; não há sorteio de ordem.
// =====================================================================

export const INTERVENCOES_NOITE = [
  {
    id: 'saida_ensaiada',
    hora: 'Às sete e meia',
    rubrica: 'a hora de sair, dada duas vezes com as mesmas palavras',
    exige: ['alibi_silas', 'alibi_davey'],
    prosa:
      'A oficina fecha-se com dois do lado de fora. A hora de sair sai depois pela boca de um e pela do outro, nas mesmas palavras e na mesma ordem, e uma das duas foi ensaiada antes de ser dita.',
  },
  {
    id: 'quarto_recolhido',
    hora: 'Às oito, na estalagem',
    rubrica: 'o recolhimento ao quarto, contra o quarto às escuras às nove',
    exige: ['alibi_silas', 'corrob_estalajadeiro'],
    prosa:
      'O quarto cinco recebe quem declarou recolher-se às oito e não tornar a sair. Às nove, com a água quente a subir ao três, o cinco está às escuras e a cama por desfazer; o portão do pátio bate passado das dez.',
  },
  {
    id: 'mostrador_posto',
    hora: 'No escritório, passadas as nove',
    rubrica: 'os ponteiros do relógio de lareira num quarto para as nove',
    exige: ['ev_relogio_lareira', 'ev_maquinismo'],
    prosa:
      'O relógio de lareira vem ao chão com a alavanca das badaladas pousada no nono entalhe da roda, e dali a roda não passa. Uma mão abre depois a caixa pelo lado que cedeu e leva os ponteiros a um quarto para as nove.',
  },
  {
    id: 'assalto_encenado',
    hora: 'Na loja, na mesma noite',
    rubrica: 'as gavetas puxadas e a fechadura forçada pelo lado de fora',
    exige: ['ev_vitrine', 'ev_fechadura'],
    prosa:
      'As gavetas do balcão saem uma a uma e a caixa do troco esvazia-se. A vitrine dos dez relógios de ouro fica com as tampas corridas e as etiquetas voltadas para cima. Na porta dos fundos a alavanca morde o batente pelo lado de fora, e as lascas de tinta caem para o degrau do beco.',
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
    hora: 'Antes de a porta dos fundos se fechar',
    rubrica: 'a bainha que saiu da sala sem ser sacudida',
    exige: ['ev_vidro_dobra'],
    prosa:
      'A sala fica arrumada para ser lida. A bainha de calça que sai por aquela porta leva presa uma lasca de vidro de mostrador do tamanho de meia unha, abaulada, com um fio de tinta dourada na borda.',
  },
  {
    id: 'teoria_do_estranho',
    hora: 'No sábado',
    rubrica: 'a teoria do ladrão de fora, oferecida sem que se pergunte',
    exige: ['comp_silas'],
    prosa:
      'A explicação já está pronta antes de alguém a pedir: gente de fora, da estrada, atrás do troco do caixa. Volta três vezes na mesma conversa, com variações, e nenhuma das três responde a pergunta que se fez.',
  },
  {
    id: 'janela_fechada',
    hora: 'Ao meio-dia de sábado',
    rubrica: 'a senhora da viela retratada, e a janela fechada',
    exige: ['dep_mulher_viela'],
    prosa:
      'A senhora dos fundos do nº 9 pôs uma mulher de escuro na viela, pouco antes das nove da noite de sexta. Procurada outra vez ao meio-dia, diz não ter visto nada, e fecha a janela.',
  },
];

/**
 * As intervenções que a mesa do jogador desfaz, na ordem da noite. Toda
 * carta de `exige` tem de estar na mesa — é a GR7-3 escrita na função que
 * a cena consome, e não numa promessa de prosa.
 *
 * @param {Iterable<string>} idsNaMesa
 * @returns {Array<object>} subconjunto de INTERVENCOES_NOITE, em ordem
 */
export function intervencoesRebatidas(idsNaMesa) {
  const mesa = new Set(idsNaMesa || []);
  return INTERVENCOES_NOITE.filter((i) => i.exige.every((id) => mesa.has(id)));
}
