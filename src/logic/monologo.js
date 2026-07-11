// =====================================================================
// O MONÓLOGO DO DETETIVE por BLOCOS de template universais (§11).
//
// O desfecho não é mais um tribunal com advogado de defesa: é o detetive
// recolhendo a cadeia que CONSTRUIU e medindo o seu peso. Cada elo que o
// jogador ligou vira uma frase da tese; cada elo que faltou ou saiu torto
// vira o buraco que a narração expõe. Os quatro desfechos continuam, agora
// medindo a QUALIDADE DA CADEIA.
//
// Nenhum texto é exclusivo do caso: os mesmos blocos servem ao tutorial e a
// qualquer caso procedural. As variáveis (nomes, janela, mecanismo, motivo)
// vêm do veredicto. Nunca LLM. Voz em primeira pessoa — é o monólogo dele.
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

// Mapeia cada código de falha para a frase universal — o buraco que o próprio
// detetive reconhece na cadeia que montou.
function textoDaFalha(falha, dados) {
  const nomeReu = nome(dados.reuId);
  switch (falha.codigo) {
    case 'corpo_sem_substancia':
      return 'Levei a acusação adiante sem uma leitura do corpo com substância pericial — e laudo sem cadáver é boato com selo.';
    case 'sem_janela':
      return 'Não soube dizer quando a vítima morreu; e sem a hora, qualquer álibi serve a qualquer um.';
    case 'janela_nao_cobre':
      return `A janela que afirmei não contém a hora verdadeira do óbito (${formatHora(dados.horaMorteAbsoluta)}). Quem erra o relógio perde o caso antes de abri-lo.`;
    case 'janela_imprecisa':
      return 'A janela que afirmei era larga demais — estimativa de almanaque, não de perícia.';
    case 'sem_mecanismo':
      return 'Não afirmei como a vítima morreu. Acusar sem o meio é apontar sem dedo.';
    case 'mecanismo_errado':
      return 'A causa que sustentei não se firma nos sinais do corpo — o pescoço dizia outra coisa, e eu não a ouvi.';
    case 'sem_nexo':
      return `Nada na minha cadeia pôs ${nomeReu} junto ao instrumento do crime. Sem materialidade, a certeza mais firme morre na soleira.`;
    case 'nexo_errado':
      return 'O vestígio que invoquei não liga o acusado ao instrumento do óbito — a corrente partiu justo no elo do meio.';
    case 'sem_motivacao':
      return 'Calei sobre o móbil. Condena-se com mais firmeza quando se entende o porquê.';
    case 'motivacao_erronea':
      return 'O móbil que sustentei não pertencia ao acusado.';
    case 'sem_descuidos':
      return 'Os descuidos do assassino — a cena arrumada para mentir — ficaram sem ser apontados, e a mentira seguiu de pé.';
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
    frase += ` E expus, um a um, os descuidos da encenação: a cena arrumada para apontar ${formatHora(dados.horaForjada)} — hora em que o morto já era morto havia muito.`;
  }
  return frase;
}

export function gerarMonologo(veredicto, detective) {
  void detective; // a fala é em primeira pessoa; o nome do perito não é preciso aqui
  const dados = veredicto.dadosMonologo;
  const blocos = [];

  // ---------------- Abertura, por tipo de desfecho ----------------
  if (veredicto.tipo === 'vitoria_absoluta') {
    blocos.push(
      'Recolho as cartas em silêncio. A cadeia fechou-se elo a elo, e cada elo carrega atrás de si o peso do corpo.'
    );
  } else if (veredicto.tipo === 'sucesso_gafes') {
    blocos.push(
      'A cadeia prendeu o acusado, mas não sem ranger. Há elos que amarrei com mais pressa do que perícia, e quem entende do ofício há de notá-los.'
    );
  } else if (veredicto.tipo === 'impunidade') {
    blocos.push(
      'Tenho o nome certo e as mãos vazias. A intuição aponta — mas o que aponta não prende: faltaram à cadeia os elos que punham o homem no lugar do crime.'
    );
  } else {
    blocos.push(
      'Montei uma cadeia coerente — e errada. Apertei o nó no pescoço de quem mentia por outra razão, e deixei o verdadeiro morto sem quem o respondesse.'
    );
  }

  // ---------------- A tese sustentada ----------------
  blocos.push(blocoTese(dados));

  // ---------------- Os buracos da cadeia ----------------
  const frasesFalhas = veredicto.falhas.map((f) => textoDaFalha(f, dados)).filter(Boolean);
  blocos.push(...frasesFalhas);

  // ---------------- Juízo sobre os não-acusados ----------------
  for (const [suspeitoId, p] of Object.entries(veredicto.perifericos)) {
    if (p.ok && p.esperado === 'inocente_alibi') {
      blocos.push(
        `Quanto a ${nome(suspeitoId)}, devolvi-o à vida comum com o paradeiro firmado — motivo sem oportunidade não é prova, e a perícia que confunde os dois condena às cegas.`
      );
    } else if (p.ok && p.esperado === 'inocente_segredo') {
      blocos.push(
        `Quanto a ${nome(suspeitoId)}, soube separar a mentira do crime: quem mente por vergonha responde à própria consciência, não ao carrasco.`
      );
    }
  }

  // ---------------- Fecho, por tipo ----------------
  if (veredicto.tipo === 'vitoria_absoluta') {
    blocos.push(
      `Guardo os instrumentos sem pressa. ${nome(dados.reuId)} responderá pelo que fez, e um caso bem lido dispensa o aplauso.`
    );
  } else if (veredicto.tipo === 'sucesso_gafes') {
    blocos.push(
      `${nome(dados.reuId)} responderá assim mesmo. Mas fica o travo das gafes — e a fama de um perito faz-se justamente nelas.`
    );
  } else if (veredicto.tipo === 'impunidade') {
    blocos.push(
      `${nome(dados.reuId)} sairá livre, e há de me agradecer a lição de direito com toda a polidez do mundo. Há agradecimentos que pesam mais que sentenças.`
    );
  } else {
    blocos.push(
      `Enquanto se lê a sentença, ${nome(dados.reuCorretoId)} observa de longe, de luto correto e mãos limpas — limpas como só as mãos lavadas a tempo. A forca de um inocente tem dois carrascos: quem ata o nó, e quem assina o laudo.`
    );
  }

  return { titulo: TITULOS[veredicto.tipo], blocos };
}
