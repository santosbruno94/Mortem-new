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
import { comArtigo, ComArtigo, deQuem } from './monologo.js';
import { escolherDeterministico, hashString } from './hash.js';

function nome(suspeitoId) {
  const s = obterSuspeito(suspeitoId);
  return s ? s.nome : 'pessoa incerta';
}

// Escolha determinística de variante: a fonte única mora em hash.js.
const escolher = escolherDeterministico;

// ---------------- O destino do réu apontado, por desfecho ----------------
// NENHUMA frase daqui flexiona o particípio pelo réu. O dado não carrega
// gênero: `artigoDe` só o deduz do TÍTULO ("Sr."/"Sra."), e os 153 nomes
// dos casos gerados vêm todos sem título — muitos deles de mulher, e vários
// papéis de ré são femininos (lavadeira, costureira, parteira, criada).
// "Amy Ellis foi condenado" era o que saía. A saída é pôr o JÚRI como
// sujeito ("o júri condenou X") ou dar ao réu um predicado invariável
// ("ouviu a condenação"): as duas construções valem para qualquer gênero,
// e a folha de 1893 escrevia mesmo assim. Enquanto a seed não trouxer
// gênero, é aqui que a concordância se resolve — não em `flex`.
function blocoReu(veredicto) {
  const dados = veredicto.dadosMonologo;
  const reu = nome(dados.reuId);
  switch (veredicto.tipo) {
    case 'vitoria_absoluta':
      return `O júri ouviu a cadeia inteira sem pedir que se repetisse um elo, e condenou ${comArtigo(reu)} na primeira sessão do tribunal de circuito do condado. A pena foi a que a lei reserva ao homicídio doloso: a forca.`;
    case 'sucesso_gafes':
      return `${ComArtigo(reu)} ouviu a condenação, mas não sem custo: a defesa leu em voz alta, um por um, os pontos frouxos da cadeia, e o júri deliberou até a madrugada antes de acompanhar o laudo.`;
    case 'impunidade':
      return `Sem cadeia que o sustentasse, o caso não chegou a julgamento. O inquérito encerrou-se com a fórmula de costume — homicídio doloso por pessoa ou pessoas desconhecidas — e ${comArtigo(reu)} continua onde sempre esteve, com a vida que essa morte lhe deixou mais larga.`;
    case 'erro_judiciario':
      return `O processo correu sem tropeço: o júri condenou ${comArtigo(reu)} sobre o meu laudo, e não houve, na sala, voz que soubesse o bastante para se levantar.`;
    default:
      return null;
  }
}

// A MESMA notícia, na voz que a folha pode ter — e só com o que a folha
// pode saber. Dois desfechos precisam de retoque:
//   • Erro Judiciário — `blocoReu` o escreve pela boca do perito ("o meu
//     laudo"), e impresso naquela coluna seria confissão pública. A folha
//     diz o que a sala viu: um laudo, e ninguém arrolado contra ele.
//   • Impunidade — a frase termina numa insinuação sobre quem o inquérito
//     NÃO acusou ("com a vida que essa morte lhe deixou mais larga"). Em
//     1893 isso é libelo criminal, e nenhum semanário do condado o imprime
//     sobre pessoa nomeada. O juízo é do perito: vai para a margem.
function blocoReuImprensa(veredicto) {
  const reu = nome(veredicto.dadosMonologo.reuId);
  switch (veredicto.tipo) {
    case 'impunidade':
      return 'Sem cadeia que o sustentasse, o caso não chegou a julgamento. O inquérito encerrou-se com a fórmula de costume: homicídio doloso por pessoa ou pessoas desconhecidas.';
    case 'erro_judiciario':
      return `O processo correu sem tropeço: o júri condenou ${comArtigo(reu)} sobre o laudo do perito, e a defesa não arrolou quem o contestasse.`;
    default:
      return blocoReu(veredicto);
  }
}

// O que fica de fora da coluna e passa à margem: a primeira pessoa do
// perito e o que ele pensa de quem o processo não alcançou. No Erro
// Judiciário é a frase inteira do `blocoReu` — a mais dura do desfecho, e
// que sem isto deixaria de alcançar o jogador, já que a tela só rende
// `colunas` e `margem`.
function blocoReuMargem(veredicto) {
  const reu = nome(veredicto.dadosMonologo.reuId);
  switch (veredicto.tipo) {
    case 'impunidade':
      return `${ComArtigo(reu)} continua onde sempre esteve, com a vida que essa morte lhe deixou mais larga.`;
    case 'erro_judiciario':
      return blocoReu(veredicto);
    default:
      return null;
  }
}

// Eco único do tema do caso: quando a cena foi encenada para mentir a hora —
// movendo um mostrador ou mexendo na temperatura do corpo (Lote 3) —, o corpo,
// que não se adianta nem se atrasa, devolve a hora verdadeira. Um verso, sem
// citação e sem nomear culpado, pago só quando há peça forjada E o jogador a
// derrubou (descuidosOk): sem isso, a hora emprestada nunca foi cobrada, e o
// verso seria falso. Serve à peça adiantada ou recuada para falsear o óbito.
function blocoHoraTomada(veredicto) {
  const dados = veredicto.dadosMonologo;
  if (!dados.cenaEncenada || typeof dados.horaForjada !== 'number' || !dados.descuidosOk) return null;
  // A peça pode ser o mostrador (caso-escola) ou a temperatura do corpo (Lote 3):
  // de onde a hora foi tomada muda; o corpo cobrando-a de volta, não.
  if (dados.encenacaoInstrumento === 'corpo') {
    return 'A hora que a mentira tomou emprestada do termômetro, o corpo cobrou de volta.';
  }
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
// Estes vão à COLUNA do jornal, sobre gente que o inquérito não acusou:
// dizem que a mentira ficou sem explicação — fato dos autos —, e param aí.
// O juízo moral sobre o que há de pesar a quem mentiu era do perito, não da
// folha; imprimi-lo com o nome ao lado seria libelo.
const EPILOGO_SEGREDO_OCULTO = [
  (n) => `A mentira ${deQuem(n)} ficou nos autos sem explicação: o inquérito não a desfez, e também não a tomou por crime.`,
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
  // Outubro na Inglaterra: sol pleno das 7h às 17h (o crepúsculo de ~06h30
  // fica com os lampiões). Fora da faixa, a variante diurna não pode
  // afirmar luz do dia (fiscal, A1).
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

// ---------------- A folha do jornal: cabeça de página ----------------
// O epílogo sai impresso, e o semanário do condado só sabe o que os autos
// dizem: a manchete fala pelo processo, nunca pelo que o perito descobriu
// por fora. Por isso o Erro Judiciário estampa a condenação com a mesma
// segurança das outras — o desmentido fica na margem, no lápis de quem
// leu a folha depois.
//
// FORMA de 1893, não de hoje: a cabeça é um sintagma NOMINAL em caixa
// alta, seguida de DECKS empilhados e separados por filetes curtos — cada
// um um fato, não uma frase. A manchete verbal ("fulano vai a
// julgamento") e o olho em itálico minúsculo são convenção do século XX.
//
// TEMPO: tudo no passado, porque a coluna abaixo já narra a sessão
// cumprida. O tribunal de circuito visitava o condado semanas depois do
// inquérito; a folha que noticia o julgamento é a de então, não a da
// manhã seguinte à cena.
//
// O `credito` fecha a cabeça: linha de procedência, que é o que a
// imprensa provincial de fato imprimia. Um olho, aqui, só teria a coluna
// para resumir — e resumir um parágrafo é repeti-lo.
function manchetario(veredicto) {
  const dados = veredicto.dadosMonologo;
  const reu = nome(dados.reuId);
  // Invariável de propósito, como toda a prosa do réu: "Veredicto de culpa
  // contra X" serve a qualquer gênero, e é a forma que a folha usava. Um
  // particípio flexionado aqui sairia errado em caixa alta, no maior tipo
  // da página — que é onde o erro menos se perdoa.
  const culpa = `Veredicto de culpa contra ${reu}`;
  const cabeca = `A morte ${deQuem(dados.vitima)}`;
  switch (veredicto.tipo) {
    case 'vitoria_absoluta':
      return {
        manchete: cabeca,
        decks: [culpa, 'Sentença de morte no tribunal de circuito'],
        credito: 'Do nosso correspondente',
      };
    case 'sucesso_gafes':
      return {
        manchete: cabeca,
        decks: [culpa, 'Sentença de morte, sob protesto da defesa'],
        credito: 'Do nosso correspondente na sala do tribunal',
      };
    case 'impunidade':
      return {
        manchete: cabeca,
        decks: ['Inquérito encerrado', 'Homicídio doloso por pessoa ou pessoas desconhecidas'],
        credito: 'Do nosso correspondente na comarca',
      };
    // A cabeça do Erro Judiciário é a mesma da Vitória Absoluta, palavra
    // por palavra — inclusive a linha de procedência. A folha não tem como
    // distinguir as duas, e é esse o ponto: quem lê o jornal lê a mesma
    // notícia nos dois casos. Qualquer diferença aqui seria uma pista que
    // a imprensa não tinha como dar.
    case 'erro_judiciario':
      return {
        manchete: cabeca,
        decks: [culpa, 'Sentença de morte no tribunal de circuito'],
        credito: 'Do nosso correspondente',
      };
    default:
      return null;
  }
}

// Número da edição: enfeite de cabeça de página, determinístico pela seed
// (nenhuma regra o lê). Entre a 1.400 e a 1.799 — de vinte e sete a trinta
// e cinco anos de semanário, a 52 folhas por ano.
function numeroDaEdicao(veredicto) {
  const seedId = veredicto.dadosMonologo.seedId || '';
  return 1400 + (hashString(`${seedId}|edicao`) % 400);
}

export function gerarEpilogo(veredicto, opcoes = {}) {
  // As COLUNAS do jornal: o que o processo tornou público, em terceira
  // pessoa — a única voz que a imprensa pode ter.
  const colunas = [
    blocoReuImprensa(veredicto),
    ...blocosPerifericos(veredicto),
    ...blocosExplicacoes(veredicto),
  ].filter(Boolean);
  // A MARGEM: o que o perito sabe e a folha não podia imprimir — o que
  // sobrou do destino do réu, a hora que o corpo cobrou, o autor a quem o
  // processo nunca chegou, a conta dos honorários. Primeira pessoa, a
  // lápis, ao lado da coluna.
  const margem = [
    blocoReuMargem(veredicto),
    blocoHoraTomada(veredicto),
    blocoRevelacao(veredicto),
    blocoPerito(veredicto, opcoes.horasSelo),
  ].filter(Boolean);
  const cabeca = manchetario(veredicto);
  return {
    titulo: 'Epílogo',
    // `blocos` segue sendo o epílogo inteiro na ordem de sempre: quem só
    // quer o texto (o QA, uma leitura futura) não precisa saber da folha.
    blocos: [
      blocoReu(veredicto),
      blocoRevelacao(veredicto),
      blocoHoraTomada(veredicto),
      ...blocosPerifericos(veredicto),
      ...blocosExplicacoes(veredicto),
      blocoPerito(veredicto, opcoes.horasSelo),
    ].filter(Boolean),
    colunas,
    margem,
    manchete: cabeca ? cabeca.manchete : null,
    decks: cabeca ? cabeca.decks : [],
    credito: cabeca ? cabeca.credito : null,
    numeroEdicao: numeroDaEdicao(veredicto),
  };
}
