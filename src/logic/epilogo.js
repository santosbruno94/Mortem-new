// =====================================================================
// O EPÍLOGO — o encerramento do caso, depois do monólogo (Q5).
//
// Quando o jogador SELA o caso ("Encerrar o caso"), o jogo paga o
// investimento com consequência: o destino do réu, dos periféricos e do
// perito, em 2–4 parágrafos. Como o monólogo, é feito de BLOCOS de
// template universais parametrizados pelo veredicto — nenhum texto é
// exclusivo do caso; os mesmos moldes servem ao tutorial e ao procedural.
// Zero LLM. Os blocos de periféricos têm VARIANTES (hash salgado com o
// POOL, deslocado pela ordem de ocorrência — a frase fixa repetia-se em
// pares, achado A2 do playtest de 13/07/2026); a conta do perito flexiona
// pela hora do selo; e as alegações-isca refutadas pagam aqui a
// explicação do fato verdadeiro (tag `explicacao` → ROTULOS_EXPLICACAO).
//
// Convenções de época (1893): homicídio doloso julga-se no tribunal de
// circuito do condado (as assizes — vocabulário conforme a KB) e a
// condenação leva à forca (pena obrigatória, OAPA 1861); inquérito sem réu
// encerra pela fórmula do coroner — "homicídio doloso por pessoa ou
// pessoas desconhecidas". Validado com o perito-forense.
//
// NOTA (gênero dos particípios): o particípio flexiona pelo artigo que o
// título do nome dá ("Sra." → condenada). Suspeito sem título flexiona no
// masculino — quando o gerador procedural trouxer suspeitas sem título,
// a seed deverá carregar o gênero.
// =====================================================================

import { obterSuspeito } from '../data/pacote_caso.js';
import { ROTULOS_EXPLICACAO } from '../data/rotulos.js';
import { artigoDe, comArtigo, ComArtigo, deQuem } from './monologo.js';
import { hashString } from './hash.js';

function nome(suspeitoId) {
  const s = obterSuspeito(suspeitoId);
  return s ? s.nome : 'pessoa incerta';
}

function flex(nomeCompleto, masc, fem) {
  return artigoDe(nomeCompleto) === 'a' ? fem : masc;
}

// Variante determinística (mesma fonte de sorteio do monólogo: hash salgado).
// `nOcorrencia` desloca a escolha pela ordem dentro do MESMO tipo de bloco:
// dois periféricos vizinhos do mesmo tipo nunca repetem a variante — a
// garantia é por construção, não por sorte do hash.
function escolher(variantes, chave, nOcorrencia = 0) {
  return variantes[(hashString(chave) + nOcorrencia) % variantes.length];
}

// ---------------- O destino do réu apontado, por desfecho ----------------
function blocoReu(veredicto) {
  const dados = veredicto.dadosMonologo;
  const reu = nome(dados.reuId);
  switch (veredicto.tipo) {
    case 'vitoria_absoluta':
      return `O júri ouviu a cadeia inteira sem pedir que se repetisse um elo. ${ComArtigo(reu)} foi ${flex(reu, 'condenado', 'condenada')} na primeira sessão do tribunal de circuito do condado, e a pena foi a que a lei reserva ao homicídio doloso: a forca.`;
    case 'sucesso_gafes':
      return `${ComArtigo(reu)} foi ${flex(reu, 'condenado', 'condenada')}, mas não sem custo: a defesa leu em voz alta, um por um, os pontos frouxos da cadeia, e o júri deliberou até a madrugada antes de acompanhar o laudo.`;
    case 'impunidade':
      return `Sem cadeia que o sustentasse, o caso não chegou a julgamento. O inquérito encerrou-se com a fórmula de costume — homicídio doloso por pessoa ou pessoas desconhecidas — e ${comArtigo(reu)} continua onde sempre esteve, com a vida que essa morte lhe deixou mais larga.`;
    case 'erro_judiciario':
      return `O processo correu sem tropeço: ${comArtigo(reu)} foi ${flex(reu, 'condenado', 'condenada')} sobre o meu laudo, e não houve, na sala, voz que soubesse o bastante para se levantar.`;
    default:
      return null;
  }
}

// Eco único do tema do caso: quando a cena foi encenada MOVENDO um relógio
// para mentir a hora, o corpo — que não se adianta nem se atrasa — devolve a
// hora verdadeira. Um verso, sem citação e sem nomear culpado, pago só quando
// há relógio forjado E o jogador o derrubou (descuidosOk): sem isso, a hora
// emprestada nunca foi cobrada, e o verso seria falso. Genérico: serve a
// qualquer mostrador adiantado ou recuado para falsear o óbito.
function blocoHoraTomada(veredicto) {
  const dados = veredicto.dadosMonologo;
  if (!dados.cenaEncenada || typeof dados.horaForjada !== 'number' || !dados.descuidosOk) return null;
  return 'A hora que a mentira tomou emprestada de um relógio, o corpo cobrou de volta.';
}

// No encerramento do Erro Judiciário, o nome do verdadeiro autor é enfim
// revelado (a retentativa acabou; a conta se apresenta inteira).
function blocoRevelacao(veredicto) {
  if (veredicto.tipo !== 'erro_judiciario') return null;
  const correto = nome(veredicto.dadosMonologo.reuCorretoId);
  return `Ao verdadeiro autor, o processo nunca chegou: ${comArtigo(correto)} acompanhou a sentença de fora dos autos.`;
}

// ---------------- O destino dos não-acusados ----------------
const EPILOGO_SEGREDO_EXPOSTO = [
  (n) => `A mentira ${deQuem(n)} ficou nos autos pelo que era: vergonha, não sangue. Provou-se inocente, e o preço foi ter posto à vista, diante de estranhos, o que guardava para si.`,
  (n) => `O que ${comArtigo(n)} escondia entrou nos autos já explicado, e ninguém o tomou por crime. A inocência ficou provada; ficou também, escrito e público, aquilo que só a vergonha guardava.`,
];
const EPILOGO_SEGREDO_OCULTO = [
  (n) => `A mentira ${deQuem(n)} ficou por entender, e há de pesar-lhe mais tempo do que pesaria a verdade.`,
  (n) => `Ninguém soube dizer por que ${comArtigo(n)} mentiu; o segredo ficou inteiro, e a mentira, no arquivo.`,
];
const EPILOGO_ALIBI = [
  (n) => `O processo guardou ${deQuem(n)} apenas o paradeiro confirmado.`,
  (n) => `${ComArtigo(n)} voltou ao próprio ofício; os autos não tornaram a citar esse nome.`,
];

function blocosPerifericos(veredicto) {
  const blocos = [];
  const seedId = veredicto.dadosMonologo.seedId || '';
  const POOLS = {
    segredo_exposto: EPILOGO_SEGREDO_EXPOSTO,
    segredo_oculto: EPILOGO_SEGREDO_OCULTO,
    alibi: EPILOGO_ALIBI,
  };
  const ocorrencias = new Map(); // quantas vezes cada pool de variantes já falou
  for (const [suspeitoId, p] of Object.entries(veredicto.perifericos || {})) {
    const n = nome(suspeitoId);
    let nomePool = null;
    if (p.esperado === 'inocente_segredo') {
      nomePool = p.ok ? 'segredo_exposto' : 'segredo_oculto';
    } else if (p.esperado === 'inocente_alibi' && p.ok && p.alibiNaMesa) {
      nomePool = 'alibi';
    }
    if (!nomePool) continue;
    // A chave é do POOL (não do suspeito): o deslocamento por ocorrência
    // percorre as variantes a partir do MESMO hash — dois periféricos
    // vizinhos do mesmo tipo nunca repetem a frase, por construção.
    const nOcorrencia = ocorrencias.get(nomePool) || 0;
    ocorrencias.set(nomePool, nOcorrencia + 1);
    blocos.push(escolher(POOLS[nomePool], `${seedId}|epilogo|${nomePool}`, nOcorrencia)(n));
  }
  return blocos;
}

// ---------------- As explicações pagas (o "aha" do encerramento) ----------------
// Cada alegação-isca refutada com tag `explicacao` vira aqui o parágrafo que
// conta o fato verdadeiro por trás da leitura falsa — só depois do caso
// selado, nunca durante a investigação.
function blocosExplicacoes(veredicto) {
  return (veredicto.dadosMonologo.explicacoesPagas || [])
    .map((e) => ROTULOS_EXPLICACAO[e])
    .filter(Boolean);
}

// ---------------- O perito fecha a conta ----------------
// A frase flexiona pela hora em que o caso foi SELADO (estado do relógio,
// determinístico): quem fecha com o dia aberto lê uma conta; quem fecha à
// luz de lampião, outra. `horasSelo` chega em escala absoluta do caso.
function blocoPerito(veredicto, horasSelo) {
  const horaDoDia = typeof horasSelo === 'number' ? ((horasSelo % 24) + 24) % 24 : null;
  // Outubro na Inglaterra: sol ~06h30–17h00. Fora disso, a vila está a
  // lampiões — a variante diurna não pode afirmar luz do dia (fiscal, A1).
  const deDia = horaDoDia === null || (horaDoDia >= 7 && horaDoDia < 17);
  switch (veredicto.tipo) {
    case 'vitoria_absoluta':
      return deDia
        ? 'Os honorários foram pagos sem discussão da conta, com o dia ainda aberto sobre a vila. O próximo chamado, quando vier, virá mais cedo.'
        : 'Os honorários foram pagos sem discussão da conta, já à luz dos lampiões. O próximo chamado, quando vier, virá mais cedo.';
    case 'sucesso_gafes':
      return deDia
        ? 'Pagaram-me os honorários e pouparam-me os cumprimentos. Há de haver outro chamado, e menos pressa.'
        : 'Pagaram-me os honorários a horas em que a vila já dormia, e pouparam-me os cumprimentos. Há de haver outro chamado, e menos pressa.';
    case 'impunidade':
      return deDia
        ? 'Não se pagam honorários por um caso em aberto. Deixei os laudos em ordem: algum dia alguém os relerá.'
        : 'Não se pagam honorários por um caso em aberto. Deixei os laudos em ordem e saí para a rua às escuras: algum dia alguém os relerá.';
    case 'erro_judiciario':
      return deDia
        ? 'Os honorários, recusei-os. O laudo, esse, não há como devolver.'
        : 'Os honorários, recusei-os já de noite. O laudo, esse, não há como devolver.';
    default:
      return null;
  }
}

export function gerarEpilogo(veredicto, opcoes = {}) {
  return {
    titulo: 'Epílogo',
    blocos: [
      blocoReu(veredicto),
      blocoRevelacao(veredicto),
      blocoHoraTomada(veredicto),
      ...blocosPerifericos(veredicto),
      ...blocosExplicacoes(veredicto),
      blocoPerito(veredicto, opcoes.horasSelo),
    ].filter(Boolean),
  };
}
