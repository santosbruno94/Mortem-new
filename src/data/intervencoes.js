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
// Do que decorrem as duas regras deste catálogo:
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
//
// A ordem do array é a ordem da noite, e depois a dos dias que se seguiram.
// A cena percorre-a de cima a baixo; não há sorteio de ordem.
// =====================================================================

export const INTERVENCOES_NOITE = [
  {
    id: 'saida_ensaiada',
    // 19h30 de sexta, 13 de outubro.
    hora: 'Às sete e meia',
    rubrica: 'a hora de sair, dada duas vezes com as mesmas palavras',
    exige: ['alibi_silas', 'alibi_davey'],
  },
  {
    id: 'quarto_recolhido',
    hora: 'Às oito',
    rubrica: 'o recolhimento ao quarto, contra o quarto às escuras às nove',
    exige: ['alibi_silas', 'corrob_estalajadeiro'],
  },
  {
    id: 'mostrador_posto',
    hora: 'Passadas as nove',
    rubrica: 'os ponteiros do relógio de lareira num quarto para as nove',
    exige: ['ev_relogio_lareira', 'ev_maquinismo'],
  },
  {
    id: 'assalto_encenado',
    hora: 'Passadas as nove',
    rubrica: 'as gavetas puxadas e a fechadura forçada pelo lado de fora',
    exige: ['ev_vitrine', 'ev_fechadura'],
  },
  {
    id: 'buril_lavado',
    hora: 'Passadas as nove',
    rubrica: 'o buril lavado e recolhido à cera dos outros',
    exige: ['ev_estojo_buril', 'ev_residuo_ferida'],
  },
  {
    id: 'livro_desmanchado',
    hora: 'Passadas as nove',
    rubrica: 'o livro desmanchado e alimentado à grelha aos punhados',
    exige: ['ev_cinza_livro'],
  },
  {
    id: 'bainha_por_sacudir',
    hora: 'Antes das dez',
    rubrica: 'a bainha que saiu da sala sem ser sacudida',
    exige: ['ev_vidro_dobra'],
  },
  {
    id: 'teoria_do_estranho',
    hora: 'No sábado',
    rubrica: 'a teoria do ladrão de fora, oferecida sem que se pergunte',
    exige: ['comp_silas'],
  },
  {
    id: 'janela_fechada',
    hora: 'Ao meio-dia de sábado',
    rubrica: 'a senhora da viela retratada, e a janela fechada',
    exige: ['dep_mulher_viela'],
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
