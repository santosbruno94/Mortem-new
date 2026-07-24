// =====================================================================
// O MONÓLOGO DO DETETIVE por BLOCOS de template universais (§11).
//
// O desfecho é o detetive recolhendo a cadeia que CONSTRUIU e medindo o seu
// peso. Cada elo que o jogador ligou vira uma frase da tese; cada elo que
// faltou ou saiu torto vira o buraco que a narração expõe. Os quatro desfechos
// medem a QUALIDADE DA CADEIA.
//
// Nenhum texto é exclusivo do caso: os mesmos blocos servem ao tutorial e a
// qualquer caso procedural. As variáveis (nomes, janela, mecanismo, motivo)
// vêm do veredicto. Nunca LLM. Voz em primeira pessoa — é o monólogo dele.
//
// VARIAÇÃO DETERMINÍSTICA: aberturas e fechos têm variantes; a escolha é
// função de um HASH da identidade do caso (dados.seedId) SALGADO com o nome
// do perito — nunca de Math.random. A mesma partida (caso + perito) escolhe
// sempre a mesma variante (reprodutível); casos de seed diferente tendem a
// ler desfechos diferentes. Tom regido por docs/guia-de-estilo.md (§3–4):
// brilho racionado, NO MÁXIMO UMA MÁXIMA POR DESFECHO — garantido por
// construção: cada variante declara se é máxima (`maxima: true`) e, quando a
// abertura sorteada é máxima, só fechos sem máxima entram no sorteio.
// =====================================================================

import { obterSuspeito } from '../data/pacote_caso.js';
import { ROTULOS_MECANISMO, ROTULOS_INSTRUMENTO, ROTULOS_VESTIGIO, ROTULOS_MOTIVO } from '../data/rotulos.js';
import { formatJanela, formatHora, formatHoraComDia } from './tempo.js';
import { escolherDeterministico } from './hash.js';

// Os quatro desfechos, NA ORDEM em que a interface os carimba (do fechado
// ao falho). A ordem das chaves é a ordem de exibição — a fileira de
// carimbos do fim de caso percorre este objeto e não mantém lista própria.
export const TITULOS = {
  vitoria_absoluta: 'Vitória Absoluta',
  sucesso_gafes: 'Sucesso, com Gafes',
  impunidade: 'Impunidade',
  erro_judiciario: 'Erro Judiciário',
};

// Escolha determinística de variante: a fonte única mora em hash.js.
const escolher = escolherDeterministico;

// Sorteia abertura e fecho respeitando o teto do guia §3: quando a abertura
// sorteada é máxima, só concorrem fechos sem máxima (e vice-versa é
// naturalmente permitido — a máxima do desfecho mora no fecho).
function escolherAberturaEFecho(aberturas, fechos, chave) {
  const abertura = escolher(aberturas, `${chave}|abertura`);
  const candidatos = abertura && abertura.maxima ? fechos.filter((f) => !f.maxima) : fechos;
  const fecho = escolher(candidatos.length ? candidatos : fechos, `${chave}|fecho`);
  return { abertura, fecho };
}

// ---------------- Aberturas, por tipo de desfecho ----------------
// Cada variante declara `maxima` quando carrega uma frase de efeito.
const ABERTURAS = {
  vitoria_absoluta: [
    { texto: 'Recolho as cartas em silêncio. A cadeia fechou-se elo a elo, e cada elo carrega atrás de si o peso do corpo.', maxima: true },
    { texto: 'Ponho a última carta sobre a mesa e recuo um passo. A cadeia está inteira: começa no corpo e não se solta em nenhum ponto.', maxima: false },
    { texto: 'Fecho a caderneta devagar. Do primeiro sinal ao último nó, a acusação sustenta o próprio peso.', maxima: false },
  ],
  sucesso_gafes: [
    { texto: 'A cadeia prendeu o acusado, mas não sem ranger. Amarrei alguns elos com mais pressa do que perícia, e quem é do ofício há de notá-los.', maxima: false },
    { texto: 'A acusação segura, embora eu mesmo lhe veja os pontos frouxos. Prende — só não prende limpo.', maxima: true },
    { texto: 'O nó fechou-se sobre o culpado; ficaram, no caminho, alguns cabos mal atados que eu preferiria não ter deixado.', maxima: false },
  ],
  impunidade: [
    { texto: 'Tenho o nome certo e as mãos vazias. O faro aponta o nome; a cadeia não o alcança.', maxima: true },
    { texto: 'Sei quem foi. Não provei que foi. Levo o nome na caderneta e nada com que o sustentar diante de um júri.', maxima: true },
    { texto: 'Aponto o culpado e não tenho com que o segurar: faltaram à cadeia os elos que o punham no lugar do crime.', maxima: false },
  ],
  erro_judiciario: [
    { texto: 'Montei uma cadeia coerente, e errada. Condenei quem não devia, e deixei o verdadeiro sem quem lhe pedisse contas.', maxima: false },
    { texto: 'A acusação era firme e apontava para o lado errado. Condenei um nome que o corpo não acusava.', maxima: false },
    { texto: 'Tudo se encaixava, menos o essencial: o nome. Levei à forca quem não cometeu o crime.', maxima: false },
  ],
};

// ---------------- Fechos, por tipo de desfecho ----------------
// (Aqui mora a única máxima permitida por desfecho — guia §3.)
const FECHOS = {
  vitoria_absoluta: [
    { molde: (reu) => `Guardo os instrumentos sem pressa. ${ComArtigo(reu)} responderá pelo que fez, e um caso bem lido dispensa o aplauso.`, maxima: true },
    { molde: (reu) => `${ComArtigo(reu)} responderá pelo que fez. Fecho a maleta: o corpo disse tudo o que tinha a dizer, e foi ouvido.`, maxima: true },
    { molde: (reu) => `Não há mais o que somar. ${ComArtigo(reu)} vai a julgamento, e a cadeia inteira vai junto.`, maxima: false },
  ],
  sucesso_gafes: [
    { molde: (reu) => `${ComArtigo(reu)} responderá assim mesmo. Mas fica o travo das gafes, e é nelas que se faz ou se perde a fama de um perito.`, maxima: true },
    { molde: (reu) => `A condenação ${deQuem(reu)} está de pé. Guardo, para mim, a lista do que faria melhor numa segunda vez.`, maxima: false },
    { molde: (reu) => `${ComArtigo(reu)} vai a julgamento. Levo comigo os pontos frouxos, que ninguém viu senão eu — por ora.`, maxima: false },
  ],
  impunidade: [
    { molde: (reu) => `${ComArtigo(reu)} sairá livre, e a lei nada terá a lhe dizer. Um culpado solto é um erro que continua a trabalhar.`, maxima: true },
    { molde: (reu) => `${ComArtigo(reu)} deixa a sala pela porta da frente. A certeza sem prova não prende ninguém, e eu que o diga.`, maxima: true },
    { molde: (reu) => `${ComArtigo(reu)} fica em liberdade por falta do que só eu deveria ter trazido. A intuição não assina laudo.`, maxima: true },
    { molde: (reu) => `${ComArtigo(reu)} sai da sala sem pressa, e ninguém lhe barra a porta. Fecho a caderneta sobre o nome que não pude sustentar.`, maxima: false },
  ],
  erro_judiciario: [
    { molde: (correto) => `Enquanto se lê a sentença, ${comArtigo(correto)} observa de longe, de mãos limpas. A forca de um inocente tem dois carrascos: quem ata o nó e quem assina o laudo.`, maxima: true },
    { molde: (correto) => `A sentença cai sobre o nome errado, e ${comArtigo(correto)} assiste sem pestanejar. O verdadeiro erro foi meu, e leva a minha assinatura.`, maxima: false },
    { molde: (correto) => `${ComArtigo(correto)} sai da sala como quem cumpriu uma formalidade. Condenei a pessoa errada, e é isso que ficará no meu nome.`, maxima: false },
  ],
};

// Fechos do Erro Judiciário SEM nomear o culpado (enquanto a retentativa do
// caso-escola está de pé, o nome do verdadeiro autor é trabalho do jogador —
// só o encerramento definitivo o revela).
const FECHOS_ERRO_ANONIMOS = [
  { molde: () => 'A sentença cai sobre o nome errado, e o verdadeiro autor a escuta de onde quer que esteja, calado. O erro leva a minha assinatura.', maxima: false },
  { molde: () => 'Condenei quem não devia. Quem de fato matou segue à solta, sem nome na minha caderneta — e o meu laudo é hoje o seu melhor abrigo.', maxima: true },
  { molde: () => 'Assino uma cadeia coerente sobre um nome errado. O certo, esse, ainda está por escrever.', maxima: true },
];

// Mapeia cada código de falha para a frase universal — o buraco que o próprio
// detetive reconhece na cadeia que montou. Registro sóbrio, sem aforismo.
function textoDaFalha(falha, dados) {
  const nomeReu = nome(dados.reuId);
  switch (falha.codigo) {
    case 'corpo_sem_substancia':
      return 'Levei a acusação adiante sem uma leitura do corpo que a sustentasse.';
    case 'sem_janela':
      // O código cobre DOIS gestos (veredicto.js): não afirmar a janela e
      // afirmá-la sem prendê-la a carta alguma — a frase vale para ambos,
      // sem negar um gesto que o jogador fez (diagnóstico 21/07, M5).
      return 'Não firmei a hora da morte em sinal algum do corpo, e sem ela não havia como medir os álibis.';
    case 'janela_nao_cobre':
      // Sem revelar a hora verdadeira: o perito que errou a janela não a
      // conhece — e, na retentativa, ela não pode sair de graça (Q1/Q2).
      return 'A janela que afirmei erra a hora do óbito. Errei o relógio, e com ele o caso.';
    case 'janela_sem_sustentacao':
      // Contradição interna (afirmei X, provei Y) — não é imprecisão, e a
      // frase não pode revelar a hora verdadeira (Q1/Q2, como acima).
      return 'A janela que afirmei não é a que os meus próprios sinais sustentam: reuni provas de uma faixa de horas e assinei outra.';
    case 'janela_imprecisa':
      return 'A janela que afirmei ficou larga demais para acusar alguém com ela.';
    case 'sem_mecanismo':
      return 'Não afirmei como a vítima morreu.';
    case 'mecanismo_errado':
      return 'A causa que sustentei não se firma nos sinais do corpo; as lesões dizem outra coisa.';
    case 'sem_nexo':
      return `Nada na minha cadeia pôs ${comArtigo(nomeReu)} junto ao instrumento do crime.`;
    case 'nexo_errado':
      return 'O vestígio que invoquei não liga o acusado ao instrumento do óbito.';
    case 'nexo_acessorio':
      // A gafe que sozinha nega a Vitória Absoluta merecia frase própria:
      // sem ela, um Sucesso com Gafes saía sem explicação (M6).
      return 'Entre os vestígios que atei à presença há traço que não é do réu; carreguei a cadeia com marca de terceiro.';
    case 'sem_motivacao':
      return 'Não apontei o móbil; apresentei uma acusação sem porquê.';
    case 'motivacao_erronea':
      return 'O móbil que sustentei não é o que a cadeia prova.';
    case 'sem_descuidos':
      return 'Não apontei os descuidos da encenação, e a cena arrumada para mentir seguiu de pé.';
    case 'periferico':
      return `Sobre ${comArtigo(nome(falha.suspeitoId))}, o meu juízo não correspondeu ao que as cartas de fato provam.`;
    case 'reu_errado':
      return null; // tratado pela abertura e pelo fecho do erro judiciário
    default:
      return null;
  }
}

function nome(suspeitoId) {
  const s = obterSuspeito(suspeitoId);
  return s ? s.nome : 'pessoa incerta';
}

// ---------------------------------------------------------------------
// Artigo diante de nome com título ("a Sra. Hudson", "ao Sr. Arthurs").
// Nome sem título segue sem artigo ("Sustento que Edgar Arthurs...").
// O título feminino testa primeiro: "Dr.ª" contém "Dr.".
// ---------------------------------------------------------------------
const TITULO_FEM = /^(Sra\.|Srta\.|Dr\.ª|Dra\.|Lady)\s/;
const TITULO_MASC = /^(Sr\.|Dr\.|Rev\.|Lord)\s/;

export function artigoDe(nomeCompleto) {
  if (TITULO_FEM.test(nomeCompleto)) return 'a';
  if (TITULO_MASC.test(nomeCompleto)) return 'o';
  return null;
}

// "a Sra. Hudson" / "o Sr. Arthurs" / "Edgar Arthurs" (meio de frase)
export function comArtigo(nomeCompleto) {
  const art = artigoDe(nomeCompleto);
  return art ? `${art} ${nomeCompleto}` : nomeCompleto;
}

// Início de frase: "A Sra. Hudson..." / "Edgar Arthurs..."
export function ComArtigo(nomeCompleto) {
  const art = artigoDe(nomeCompleto);
  return art ? `${art.toUpperCase()} ${nomeCompleto}` : nomeCompleto;
}

// Preposição "a" + nome: "ao Sr. Arthurs" / "à Sra. Hudson" / "a Edgar Arthurs"
export function aQuem(nomeCompleto) {
  const art = artigoDe(nomeCompleto);
  if (art === 'o') return `ao ${nomeCompleto}`;
  if (art === 'a') return `à ${nomeCompleto}`;
  return `a ${nomeCompleto}`;
}

// Preposição "de" + nome: "do Sr. Arthurs" / "da Sra. Hudson" / "de Edgar Arthurs"
export function deQuem(nomeCompleto) {
  const art = artigoDe(nomeCompleto);
  if (art === 'o') return `do ${nomeCompleto}`;
  if (art === 'a') return `da ${nomeCompleto}`;
  return `de ${nomeCompleto}`;
}

// Bloco da tese: reconstrói, em prosa, exatamente o que o jogador ligou —
// apenas os elos que ele de fato sustentou. O CONTRATO do desfecho: nenhuma
// frase afirma gesto que o jogador não fez.
function blocoTese(dados) {
  let frase = `Sustento que ${comArtigo(nome(dados.reuId))} deu morte ${aQuem(dados.vitima)}`;
  if (dados.janela) frase += `, ${formatJanela(dados.janela)}`;
  if (dados.mecanismoDeclarado) {
    frase += `, mediante ${ROTULOS_MECANISMO[dados.mecanismoDeclarado] || dados.mecanismoDeclarado}`;
    if (dados.instrumentoDeclarado) {
      // O instrumento narrado vem do sinal que cravou a causa (veredicto.js) —
      // nunca de um vestígio avulso que a contradiga. Sem rótulo próprio,
      // cai no rótulo de vestígio; jamais no id interno.
      const rotulo =
        ROTULOS_INSTRUMENTO[dados.instrumentoDeclarado] ||
        ROTULOS_VESTIGIO[dados.instrumentoDeclarado] ||
        'material não identificado';
      frase += ` (${rotulo})`;
    }
  }
  frase += '.';
  if (dados.motivacaoOk) {
    frase += ` Como móbil, ${ROTULOS_MOTIVO[dados.motivoCorreto] || 'interesse próprio'}.`;
  }
  // A encenação só entra na tese se o jogador refutou a PRÓPRIA peça forjada
  // (veredicto.js exige a tag `encenado` na alegação derrubada). A peça pode ser
  // o mostrador (caso-escola e variantes de relógio) ou a temperatura do corpo
  // (Lote 3); e a hora forjada pode ser adiantada (a vítima já estava morta) ou
  // recuada para antes da morte (ainda estava viva). A hora recuada é sempre
  // negativa (dia anterior) — leva o dia junto (formatHoraComDia).
  // Mesmo guard do epílogo (blocoHoraTomada): seed com cenaEncenada e sem
  // horaForjada numérica não pode render "arranjada para dar NaNhNaN".
  if (dados.descuidosOk && dados.cenaEncenada && typeof dados.horaForjada === 'number') {
    const antesDaMorte = dados.horaForjada < dados.horaMorteAbsoluta;
    const quando = antesDaMorte ? formatHoraComDia(dados.horaForjada) : formatHora(dados.horaForjada);
    const estado = antesDaMorte ? 'ainda estava viva' : 'já estava morta';
    if (dados.encenacaoInstrumento === 'corpo') {
      frase += ` E a encenação caiu pelo próprio corpo: a temperatura, arranjada para dar ${quando}, não moveu o rigor nem os livores — a essa hora a vítima ${estado}.`;
    } else {
      frase += ` E a encenação caiu pelo próprio relógio: arrumado para marcar ${quando}, hora em que a vítima ${estado}.`;
    }
  }
  return frase;
}

// Bloco das testemunhas desmentidas (só quando houve refutação estabelecida
// de alegação de hora que NÃO era a peça encenada).
function blocoTestemunhas(n) {
  if (!n || n < 1) return null;
  if (n === 1) return 'Uma testemunha jurava contra a hora que o corpo dá; o corpo prevaleceu.';
  if (n === 2) return 'Duas testemunhas juravam contra a hora que o corpo dá; o corpo prevaleceu sobre ambas.';
  return 'As testemunhas juravam contra a hora que o corpo dá; o corpo prevaleceu sobre todas.';
}

// ---------------- Juízo sobre os não-acusados (variantes) ----------------
// Uma frase fixa por tipo repetia-se palavra por palavra quando dois
// periféricos caíam no mesmo tipo (playtest de 13/07/2026, achado A2). Cada
// situação tem variantes: o hash é salgado com o POOL e a escolha desloca
// pela ordem de ocorrência (vizinhos do mesmo tipo nunca repetem); e o
// molde só menciona "razões contra a vítima" quando uma carta de móbil
// apontando o suspeito está na mesa (contrato do desfecho).
const PERIFERICO_ALIBI_COM_MOTIVO = [
  (q) => `Quanto ${q}, o paradeiro que firmei não cruza a janela da morte: razões contra a vítima não faltavam; faltou a ocasião de agir.`,
  (q) => `Quanto ${q}, motivo havia, e eu o li nos papéis; o paradeiro que firmei, porém, cobre a janela inteira. Ficou-lhe o rancor, e nada além dele.`,
  (q) => `Quanto ${q}, pesei as razões que tinha contra a vítima e pesei o paradeiro que firmei. O paradeiro venceu: cobre a hora da morte de ponta a ponta.`,
];
const PERIFERICO_ALIBI_SEM_MOTIVO = [
  (q) => `Quanto ${q}, o paradeiro que firmei não cruza a janela da morte, e nada mais prendia esse nome ao caso.`,
  (q) => `Quanto ${q}, o paradeiro que firmei fecha a questão: na hora da morte, estava onde disse estar.`,
  (q) => `Quanto ${q}, conferi o paradeiro contra a janela da morte e dei o assunto por encerrado.`,
];
const PERIFERICO_ALIBI_CONVICCAO = [
  (q) => `Quanto ${q}, não colhi o paradeiro que alegava: dei-lhe a inocência por convicção, não por perícia, e a convicção acertou.`,
  (q) => `Quanto ${q}, a inocência que lhe dei saiu sem paradeiro colhido. Desta vez serviu; não é método que eu assine duas vezes.`,
];
const PERIFERICO_SEGREDO = [
  (q) => `Quanto ${q}, a mentira que quebrei encobria uma vergonha, e não o homicídio. Provei-o com o que estava na mesa; não é vitória expor o que um inocente calava.`,
  (q) => `Quanto ${q}, o que a mentira cobria era assunto da própria vida, sem parte na morte. Inocentei esse nome com a prova diante de mim, ciente do custo de ter de mostrá-la.`,
  (q) => `Quanto ${q}, o depoimento caiu, e o que escondia era vergonha própria. Fica provada a inocência; fica também, comigo, o peso de ter aberto o que não me cabia.`,
];

// `opcoes.nomearCulpado`: no Erro Judiciário com retentativa de pé, o fecho
// não entrega o nome do verdadeiro autor (default: nomeia — encerramento).
export function gerarMonologo(veredicto, detective, opcoes = {}) {
  const nomearCulpado = opcoes.nomearCulpado !== false;
  const dados = veredicto.dadosMonologo;
  // A chave de variação é o caso SALGADO com o perito: a mesma partida repete
  // o texto (reprodutível); trocar de perito troca a leitura do desfecho.
  const chave = `${dados.seedId || dados.vitima || ''}|${(detective && detective.name) || ''}|${veredicto.tipo}`;
  const blocos = [];

  // ---------------- Abertura + fecho (variantes determinísticas, ≤1 máxima) ----------------
  const fechosDoTipo =
    veredicto.tipo === 'erro_judiciario' && !nomearCulpado ? FECHOS_ERRO_ANONIMOS : FECHOS[veredicto.tipo];
  const { abertura, fecho } = escolherAberturaEFecho(ABERTURAS[veredicto.tipo], fechosDoTipo, chave);
  blocos.push(abertura.texto);

  // ---------------- A tese sustentada ----------------
  blocos.push(blocoTese(dados));

  // ---------------- O álibi do próprio réu, desmentido (se o jogador o fez) ----------------
  // A frase narra a BASE da queda: registro (hora observada) ou rastro
  // (vestígio do réu) — nunca se afirma um registro que não está na mesa.
  if (dados.alibiReuExposto) {
    blocos.push(
      dados.alibiReuPorRegistro
        ? `O registro desmente o paradeiro que ${comArtigo(nome(dados.reuId))} jurou: a saída está lançada antes da hora que declarou.`
        : `O próprio rastro desmente o paradeiro que ${comArtigo(nome(dados.reuId))} jurou: um vestígio seu está onde declarou não ter estado.`
    );
  }

  // ---------------- As testemunhas desmentidas (se houve) ----------------
  const testemunhas = blocoTestemunhas(dados.testemunhasDesmentidas);
  if (testemunhas) blocos.push(testemunhas);

  // ---------------- Os buracos da cadeia ----------------
  // Juízos periféricos errados em série: a partir do segundo, frase abreviada,
  // para o monólogo não repetir a mesma sentença palavra por palavra.
  let perifericosErrados = 0;
  const frasesFalhas = veredicto.falhas
    .map((f) => {
      if (f.codigo === 'periferico') {
        perifericosErrados += 1;
        if (perifericosErrados > 1) return `O mesmo vale para ${comArtigo(nome(f.suspeitoId))}.`;
      }
      return textoDaFalha(f, dados);
    })
    .filter(Boolean);
  blocos.push(...frasesFalhas);

  // ---------------- Juízo sobre os não-acusados ----------------
  // Contrato do desfecho: "o paradeiro que firmei" só se o paradeiro está na
  // mesa; sem a carta do álibi, o juízo é dito como convicção, não perícia; e
  // "razões contra a vítima" só com carta de móbil do suspeito na mesa.
  const POOLS_PERIFERICO = {
    alibi_com_motivo: PERIFERICO_ALIBI_COM_MOTIVO,
    alibi_sem_motivo: PERIFERICO_ALIBI_SEM_MOTIVO,
    alibi_conviccao: PERIFERICO_ALIBI_CONVICCAO,
    segredo: PERIFERICO_SEGREDO,
  };
  const ocorrenciasPeriferico = new Map();
  for (const [suspeitoId, p] of Object.entries(veredicto.perifericos)) {
    let nomePool = null;
    if (p.ok && p.esperado === 'inocente_alibi') {
      nomePool = !p.alibiNaMesa
        ? 'alibi_conviccao'
        : p.temMotivoNaMesa
          ? 'alibi_com_motivo'
          : 'alibi_sem_motivo';
    } else if (p.ok && p.esperado === 'inocente_segredo') {
      nomePool = 'segredo';
    }
    if (nomePool) {
      // Chave do POOL + deslocamento por ocorrência: dois periféricos do
      // mesmo tipo em sequência nunca saem com a mesma frase.
      const nOcorrencia = ocorrenciasPeriferico.get(nomePool) || 0;
      ocorrenciasPeriferico.set(nomePool, nOcorrencia + 1);
      const molde = escolher(POOLS_PERIFERICO[nomePool], `${chave}|periferico|${nomePool}`, nOcorrencia);
      blocos.push(molde(aQuem(nome(suspeitoId))));
    }
  }

  // ---------------- Fecho (variante determinística) ----------------
  const alvo = veredicto.tipo === 'erro_judiciario' ? nome(dados.reuCorretoId) : nome(dados.reuId);
  blocos.push(fecho.molde(alvo));

  return { titulo: TITULOS[veredicto.tipo], blocos };
}
