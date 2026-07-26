// =====================================================================
// A RECONSTITUIÇÃO (D24) — domingo à noite, na relojoaria, sem inquérito
// em cena. Peça de LEITURA entre o mural de acusação e o monólogo.
//
// O contrato inteiro é a G9 e cabe numa linha: **a cena dramatiza; não
// prova.** Três consequências, e nenhuma delas é de gosto:
//
//   1. A cena não introduz carta, vestígio nem nó. Quando ela roda, o
//      veredicto já está calculado, e ela não o lê nem o toca.
//   2. Só se desfaz o gesto cujas cartas estão NA MESA. Sem elas o gesto
//      não entra — nem encoberto, nem insinuado. É o inverso exato de uma
//      cena de revelação: aqui, quem não colheu não vê, e a intervenção
//      fica de pé (martelo (c) da OS-R7, 26/07/2026). Uma cena curta é
//      consequência da colheita, e o custo dela reaparece nos graus de
//      falha do monólogo, que é onde já mora.
//   3. Nenhum gesto tem nome de autor (ver `src/data/intervencoes.js`).
//      Como não há nome, não há como a prosa ramificar no bit `culpado`:
//      a G3 vale aqui por construção, e não por vigilância.
//
// VARIAÇÃO DETERMINÍSTICA: a abertura vem do mesmo hash salgado do resto
// do jogo, no namespace `reforma:r7:intervencao` reservado na OS-R0 §6.
// Nunca Math.random. O fecho NÃO se sorteia — ele é função de quantos
// gestos caíram, porque é a única coisa que a cena tem a dizer sobre si.
//
// DÍVIDA REGISTRADA PARA A OS-R9: as três aberturas cravam a geografia do
// caso-escola (a relojoaria, o balcão, a oficina, o escritório, a vila que
// dorme cedo), e o irmão `monologo.js` declara o contrato oposto — nenhum
// texto exclusivo do caso. Hoje não vaza, porque sem catálogo de gestos
// esta função devolve null e só o caso-escola tem catálogo. No dia em que o
// gerador produzir intervenções, estas três frases vão para o pacote, como
// as próprias `intervencoes` já foram.
//
// BRILHO: zero frases de efeito, com UMA exceção deliberada — o «Saio como
// entrei.» da faixa `nenhuma`. O guia §3 dá uma máxima por desfecho, e ela
// pertence ao fecho do monólogo, que vem logo a seguir; uma cena que também
// brilhasse poria duas na mesma tela. A faixa vazia é o caso em que o texto
// tem de comunicar CONSEQUÊNCIA («foi curta por culpa tua») sem comunicar
// CONTEÚDO («eis o que te escapou»), e um fecho plano ali corre o risco
// maior — o de se ler como defeito, que é o próprio aviso do martelo (c).
// Fica sob medição no próximo playtest humano: se o jogador não ler a cena
// curta como culpa própria, o remédio é desta frase.
// =====================================================================

import { intervencoesRebatidas } from '../data/intervencoes.js';
import { obterIntervencoes } from '../data/pacote_caso.js';
import { escolherDeterministico } from './hash.js';

export const TITULO_RECONSTITUICAO = 'A Reconstituição';
export const SUBTITULO_RECONSTITUICAO = 'Domingo à noite, na relojoaria';

// O sal desta OS. Trocar esta string troca a leitura de todas as partidas.
const SAL = 'reforma:r7:intervencao';

export const ABERTURAS_RECONSTITUICAO = [
  'Domingo à noite. A loja está fechada e o lume apagado; o lampião de mão vai à frente, do balcão à oficina e da oficina ao escritório. Sobre a bancada, em fila, o que trouxe comigo.',
  'Domingo, passada a hora da ceia. O homem de guarda ficou à porta da rua e a relojoaria é minha por uma hora. Refaço a noite de sexta com o que a mesa sustenta, e paro onde ela parar.',
  'Domingo à noite, e a vila dorme cedo. Ando pela sala com o lampião baixo, e não há ninguém a quem perguntar. A sexta-feira volta em pedaços, e só nos pedaços que colhi.',
];

// O fecho é FUNÇÃO DA COLHEITA, não sorteio: quatro faixas, do nada ao
// quase tudo. A faixa vazia diz que a sala ficou como estava — e não diz
// que havia mais, porque dizê-lo seria provar de graça o que o jogador não
// provou. Se um dia o playtest mostrar que a cena vazia se lê como defeito
// em vez de consequência, o remédio é desta prosa, e nunca da mecânica.
//
// NENHUM FECHO DECLARA PROPORÇÃO ("metade", "quase toda"), e a razão é de
// epistemologia, não de gosto: o perito sabe quantos gestos desfez e NÃO
// sabe quantos lhe escaparam. Um fecho que dissesse a fração entregaria,
// de graça, o tamanho do que ele não provou.
export const FECHOS_RECONSTITUICAO = {
  nenhuma:
    'Apago o lampião. Percorri a sala inteira e ela ficou como estava: nada do que trouxe moveu coisa alguma aqui dentro. Saio como entrei.',
  poucas:
    'Ponho o lampião na bancada. A sala cedeu nos pontos em que eu tinha com que a pressionar, e ficou inteira no resto.',
  varias:
    'Ponho o lampião na bancada. A noite refez-se diante de mim na ordem em que foi feita, e parou onde a minha mesa parou.',
  quase_toda:
    'Ponho o lampião na bancada e fico olhando a sala. A noite de sexta voltou diante de mim uma arrumação de cada vez, e nenhuma delas se desfez sem papel meu por baixo.',
};

// O corte é RELATIVO ao tamanho do catálogo, e não absoluto — é a lição da
// Fase 1 da OS-R6, onde o corte absoluto de exposição fazia o nível delatar
// o réu. Um catálogo que cresça não empurra todas as partidas para a faixa
// magra sem que ninguém repare.
function faixaDoFecho(quantas, total) {
  if (quantas === 0) return 'nenhuma';
  if (quantas / total <= 1 / 3) return 'poucas';
  if (quantas / total <= 2 / 3) return 'varias';
  return 'quase_toda';
}

/**
 * A faixa da colheita da noite para uma mesa — a mesma que gradua o fecho
 * da cena, exportada para que o monólogo cite a noite sem refazer a conta.
 * Devolve null quando o caso não tem catálogo de gestos.
 *
 * @param {Iterable<string>} idsNaMesa
 * @returns {'nenhuma'|'poucas'|'varias'|'quase_toda'|null}
 */
export function faixaDaColheita(idsNaMesa) {
  const catalogo = obterIntervencoes();
  if (!catalogo.length) return null;
  return faixaDoFecho(intervencoesRebatidas(idsNaMesa, catalogo).length, catalogo.length);
}

/**
 * Monta a reconstituição para uma mesa de cartas.
 *
 * FUNÇÃO PURA e cega ao veredicto: não recebe réu, não recebe desfecho,
 * não recebe acusação. Recebe a mesa, e a mesa é tudo o que a G9 lhe
 * permite consultar.
 *
 * @param {Iterable<string>} idsNaMesa ids das cartas registradas
 * @param {string} chave chave de variação (caso + perito), para a abertura
 * @returns {{titulo, subtitulo, abertura, passos, fecho, blocos, rebatidas, total}}
 */
export function montarReconstituicao(idsNaMesa, chave = '') {
  // Caso sem catálogo de gestos NÃO TEM reconstituição, e a diferença entre
  // isso e a cena vazia é de natureza, não de grau: a cena vazia é a
  // colheita magra do jogador (martelo (c), e mostra-se); a ausência de
  // catálogo é o caso não a suportar, e aí o fim de caso vai direto ao
  // monólogo. Os gerados estão no segundo caso até a OS-R9.
  const catalogo = obterIntervencoes();
  if (!catalogo.length) return null;
  const rebatidas = intervencoesRebatidas(idsNaMesa, catalogo);
  const abertura = escolherDeterministico(ABERTURAS_RECONSTITUICAO, `${SAL}|${chave}|abertura`);
  const fecho = FECHOS_RECONSTITUICAO[faixaDoFecho(rebatidas.length, catalogo.length)];
  const passos = rebatidas.map((i) => ({ id: i.id, hora: i.hora, prosa: i.prosa }));
  return {
    titulo: TITULO_RECONSTITUICAO,
    subtitulo: SUBTITULO_RECONSTITUICAO,
    abertura,
    passos,
    fecho,
    // A cena inteira em texto corrido, na ordem de leitura: é o que as
    // guardas varrem à procura de marcador de carta e de nome de suspeito.
    blocos: [abertura, ...passos.map((p) => p.prosa), fecho],
    rebatidas: rebatidas.length,
    total: catalogo.length,
  };
}
