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
// VARIAÇÃO DETERMINÍSTICA: aberturas e fechos têm 2–3 variantes; a escolha é
// função de um HASH da identidade do caso (dados.seedId), nunca de Math.random.
// O mesmo caso escolhe sempre a mesma variante (reprodutível); casos diferentes
// tendem a variar. Tom regido por docs/guia-de-estilo.md (§3–4): brilho
// racionado, no máximo uma máxima por desfecho, guardada para o fecho.
// =====================================================================

import { obterSuspeito } from '../data/seed.js';
import { ROTULOS_MECANISMO, ROTULOS_INSTRUMENTO, ROTULOS_MOTIVO } from '../data/rotulos.js';
import { formatJanela, formatHora } from './tempo.js';

const TITULOS = {
  vitoria_absoluta: 'Vitória Absoluta',
  sucesso_gafes: 'Sucesso, com Gafes',
  impunidade: 'Impunidade',
  erro_judiciario: 'Erro Judiciário',
};

// Hash de string estável e determinístico (sem Math.random/Date).
function hashString(s) {
  let h = 0;
  const str = String(s || '');
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Escolhe uma variante de forma determinística a partir de uma chave.
function escolher(variantes, chave) {
  if (!variantes || variantes.length === 0) return '';
  return variantes[hashString(chave) % variantes.length];
}

// ---------------- Aberturas, por tipo de desfecho ----------------
const ABERTURAS = {
  vitoria_absoluta: [
    'Recolho as cartas em silêncio. A cadeia fechou-se elo a elo, e cada elo carrega atrás de si o peso do corpo.',
    'Ponho a última carta sobre a mesa e recuo um passo. A cadeia está inteira: começa no corpo e não se solta em nenhum ponto.',
    'Fecho a caderneta devagar. Do primeiro sinal ao último nó, a acusação sustenta o próprio peso.',
  ],
  sucesso_gafes: [
    'A cadeia prendeu o acusado, mas não sem ranger. Amarrei alguns elos com mais pressa do que perícia, e quem é do ofício há de notá-los.',
    'A acusação segura, embora eu mesmo lhe veja os pontos frouxos. Prende — só não prende limpo.',
    'O nó fechou-se sobre o culpado; ficaram, no caminho, alguns cabos mal atados que eu preferiria não ter deixado.',
  ],
  impunidade: [
    'Tenho o nome certo e as mãos vazias. A intuição aponta o homem; a cadeia não o alcança.',
    'Sei quem foi. Não provei que foi. Entre uma coisa e outra corre a distância que solta um assassino.',
    'Aponto o culpado e não tenho com que o segurar: faltaram à cadeia os elos que o punham no lugar do crime.',
  ],
  erro_judiciario: [
    'Montei uma cadeia coerente, e errada. Condenei quem mentia por outra razão, e deixei o verdadeiro sem quem lhe pedisse contas.',
    'A acusação era firme e apontava para o lado errado. Condenei uma mentira que não era a do crime.',
    'Tudo se encaixava, menos o essencial: o nome. Levei à forca quem escondia uma vergonha, não um homicídio.',
  ],
};

// ---------------- Fechos, por tipo de desfecho ----------------
// (Aqui mora a única máxima permitida por desfecho — guia §3.)
const FECHOS = {
  vitoria_absoluta: [
    (reu) => `Guardo os instrumentos sem pressa. ${reu} responderá pelo que fez, e um caso bem lido dispensa o aplauso.`,
    (reu) => `${reu} responderá pelo que fez. Fecho a maleta: o corpo disse tudo o que tinha a dizer, e foi ouvido.`,
    (reu) => `Não há mais o que somar. ${reu} vai a julgamento, e a cadeia inteira vai junto.`,
  ],
  sucesso_gafes: [
    (reu) => `${reu} responderá assim mesmo. Mas fica o travo das gafes, e é nelas que se faz ou se perde a fama de um perito.`,
    (reu) => `A condenação de ${reu} está de pé. Guardo, para mim, a lista do que faria melhor numa segunda vez.`,
    (reu) => `${reu} vai a julgamento. Levo comigo os pontos frouxos, que ninguém viu senão eu — por ora.`,
  ],
  impunidade: [
    (reu) => `${reu} sairá livre, e há de me agradecer a lição com toda a polidez do mundo. Há agradecimentos que pesam mais que sentenças.`,
    (reu) => `${reu} deixa a sala pela porta da frente. A certeza sem prova não prende ninguém, e eu que o diga.`,
    (reu) => `Solto ${reu} por falta do que só eu deveria ter trazido. A intuição não assina laudo.`,
  ],
  erro_judiciario: [
    (correto) => `Enquanto se lê a sentença, ${correto} observa de longe, de luto correto e mãos limpas. A forca de um inocente tem dois carrascos: quem ata o nó e quem assina o laudo.`,
    (correto) => `A sentença cai sobre o nome errado, e ${correto} assiste sem pestanejar. O verdadeiro erro não foi dele; foi meu, e leva a minha assinatura.`,
    (correto) => `${correto} sai da sala como quem cumpriu uma formalidade. Condenei a pessoa errada, e é isso que ficará no meu nome, não no dele.`,
  ],
};

// Mapeia cada código de falha para a frase universal — o buraco que o próprio
// detetive reconhece na cadeia que montou. Registro sóbrio, sem aforismo.
function textoDaFalha(falha, dados) {
  const nomeReu = nome(dados.reuId);
  switch (falha.codigo) {
    case 'corpo_sem_substancia':
      return 'Levei a acusação adiante sem uma leitura do corpo que a sustentasse.';
    case 'sem_janela':
      return 'Não afirmei quando a vítima morreu; e, sem a hora, nenhum álibi se pode medir.';
    case 'janela_nao_cobre':
      return `A janela que afirmei não contém a hora verdadeira do óbito, ${formatHora(dados.horaMorteAbsoluta)}. Errei o relógio, e com ele o caso.`;
    case 'janela_imprecisa':
      return 'A janela que afirmei ficou larga demais para acusar alguém com ela.';
    case 'sem_mecanismo':
      return 'Não afirmei como a vítima morreu.';
    case 'mecanismo_errado':
      return 'A causa que sustentei não se firma nos sinais do corpo; o pescoço dizia outra coisa.';
    case 'sem_nexo':
      return `Nada na minha cadeia pôs ${nomeReu} junto ao instrumento do crime.`;
    case 'nexo_errado':
      return 'O vestígio que invoquei não liga o acusado ao instrumento do óbito.';
    case 'sem_motivacao':
      return 'Não apontei o móbil, e uma acusação sem porquê convence menos.';
    case 'motivacao_erronea':
      return 'O móbil que sustentei não pertencia ao acusado.';
    case 'sem_descuidos':
      return 'Não apontei os descuidos da encenação, e a cena arrumada para mentir seguiu de pé.';
    case 'periferico':
      return `Sobre ${nome(falha.suspeitoId)}, o meu juízo não correspondeu ao que as cartas de fato provam.`;
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

// Bloco da tese: reconstrói, em prosa, exatamente o que o jogador ligou —
// apenas os elos que ele de fato sustentou.
function blocoTese(dados) {
  let frase = `Sustento que ${nome(dados.reuId)} deu morte a ${dados.vitima}`;
  if (dados.janela) frase += `, ${formatJanela(dados.janela)}`;
  if (dados.mecanismoDeclarado) {
    frase += `, mediante ${ROTULOS_MECANISMO[dados.mecanismoDeclarado] || dados.mecanismoDeclarado}`;
    if (dados.instrumentoDeclarado) {
      frase += ` (${ROTULOS_INSTRUMENTO[dados.instrumentoDeclarado] || dados.instrumentoDeclarado})`;
    }
  }
  frase += '.';
  if (dados.motivacaoOk) {
    frase += ` Como móbil, ${ROTULOS_MOTIVO[dados.motivoCorreto] || 'interesse próprio'}.`;
  }
  if (dados.descuidosOk && dados.cenaEncenada) {
    frase += ` E apontei, um a um, os descuidos da encenação: a cena arrumada para marcar ${formatHora(dados.horaForjada)}, hora em que a vítima já estava morta havia muito.`;
  }
  return frase;
}

export function gerarMonologo(veredicto, detective) {
  void detective; // a fala é em primeira pessoa; o nome do perito não é preciso aqui
  const dados = veredicto.dadosMonologo;
  const chave = dados.seedId || dados.vitima || '';
  const blocos = [];

  // ---------------- Abertura (variante determinística) ----------------
  blocos.push(escolher(ABERTURAS[veredicto.tipo], `${chave}|abertura|${veredicto.tipo}`));

  // ---------------- A tese sustentada ----------------
  blocos.push(blocoTese(dados));

  // ---------------- Os buracos da cadeia ----------------
  const frasesFalhas = veredicto.falhas.map((f) => textoDaFalha(f, dados)).filter(Boolean);
  blocos.push(...frasesFalhas);

  // ---------------- Juízo sobre os não-acusados ----------------
  for (const [suspeitoId, p] of Object.entries(veredicto.perifericos)) {
    if (p.ok && p.esperado === 'inocente_alibi') {
      blocos.push(
        `Quanto a ${nome(suspeitoId)}, o paradeiro que firmei o mantém fora da janela da morte: tinha razões contra a vítima, faltou-lhe a ocasião de agir.`
      );
    } else if (p.ok && p.esperado === 'inocente_segredo') {
      blocos.push(
        `Quanto a ${nome(suspeitoId)}, a mentira que expus encobria uma vergonha, não o homicídio: mentiu para se proteger, não para matar.`
      );
    }
  }

  // ---------------- Fecho (variante determinística) ----------------
  const molde = escolher(FECHOS[veredicto.tipo], `${chave}|fecho|${veredicto.tipo}`);
  const alvo = veredicto.tipo === 'erro_judiciario' ? nome(dados.reuCorretoId) : nome(dados.reuId);
  blocos.push(molde(alvo));

  return { titulo: TITULOS[veredicto.tipo], blocos };
}
