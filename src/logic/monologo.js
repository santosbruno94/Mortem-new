// =====================================================================
// Monólogo Final por BLOCOS de template universais (§11).
// Nenhum texto é exclusivo do caso: os mesmos blocos servem ao tutorial
// e a qualquer caso procedural. As variáveis (nomes, janela, mecanismo,
// motivo) são injetadas a partir do veredicto e do libelo. Nunca LLM.
// =====================================================================

import { obterSuspeito } from '../data/seed.js';
import {
  ROTULOS_MECANISMO,
  ROTULOS_INSTRUMENTO,
  ROTULOS_MOTIVO,
} from '../data/rotulos.js';
import { formatJanela, formatHora } from './tempo.js';

const TITULOS = {
  vitoria_absoluta: 'Vitória Absoluta',
  sucesso_gafes: 'Sucesso, com Gafes',
  impunidade: 'Impunidade',
  erro_judiciario: 'Erro Judiciário',
};

// Mapeia cada código de falha para a frase universal com que a defesa
// (ou a história) a explora. Recebe os dados para injetar variáveis.
function textoDaFalha(falha, dados) {
  const nomeReu = nome(dados.reuId);
  switch (falha.codigo) {
    case 'corpo_sem_substancia':
      return 'O libelo subiu ao tribunal sem evidência de corpo com substância pericial — laudo sem cadáver é boato com selo.';
    case 'sem_janela':
      return 'A acusação não soube dizer quando a vítima morreu. A defesa fez desse silêncio um álibi universal.';
    case 'janela_nao_cobre':
      return `A janela da morte sustentada não contém a hora verdadeira do óbito (${formatHora(dados.horaMorteAbsoluta)}). A perícia que erra o relógio perde o júri.`;
    case 'janela_imprecisa':
      return 'A janela sustentada era larga demais. "Estimativa de almanaque", chamou-a a defesa — e o júri sorriu.';
    case 'sem_mecanismo':
      return 'O libelo não afirmou como a vítima morreu. Acusar sem mecanismo é apontar sem dedo.';
    case 'mecanismo_errado':
      return 'O mecanismo sustentado não resistiu aos sinais do corpo, e a defesa o desmontou peça por peça.';
    case 'sem_nexo':
      return `Nada no libelo colocou ${nomeReu} junto ao instrumento do crime. Sem materialidade, a intuição mais certeira morre na porta do júri.`;
    case 'nexo_errado':
      return 'O vestígio invocado não liga o acusado ao instrumento do óbito — a corrente da prova partiu no elo central.';
    case 'sem_motivacao':
      return 'O libelo calou sobre o móbil. O júri condena com mais gosto quando entende por quê.';
    case 'motivacao_erronea':
      return 'O móbil sustentado não pertencia ao acusado, e a defesa agradeceu o presente.';
    case 'sem_descuidos':
      return 'Os descuidos do assassino — a cena arranjada para mentir — passaram sem menção, e a mentira ficou de pé no tribunal.';
    case 'periferico':
      return `Sobre ${nome(falha.suspeitoId)}, o juízo do libelo não correspondeu ao que os autos provaram, e a defesa cobrou o engano em dobro.`;
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

// Bloco da tese: reconstrói, em prosa, exatamente o que o jogador
// sustentou — apenas os campos que ele de fato preencheu.
function blocoTese(dados, detective) {
  let frase = `Sustentou ${detective.title} ${detective.surname} que ${nome(dados.reuId)} deu morte a ${dados.vitima}`;
  if (dados.janela) frase += `, ${formatJanela(dados.janela)}`;
  if (dados.mecanismoDeclarado) {
    frase += `, mediante ${ROTULOS_MECANISMO[dados.mecanismoDeclarado] || dados.mecanismoDeclarado}`;
    if (dados.instrumentoDeclarado) {
      frase += ` (${ROTULOS_INSTRUMENTO[dados.instrumentoDeclarado] || dados.instrumentoDeclarado})`;
    }
  }
  frase += '.';
  if (dados.motivacaoOk) {
    frase += ` Como móbil, apontou ${ROTULOS_MOTIVO[dados.motivoCorreto] || 'interesse próprio'}.`;
  }
  if (dados.descuidosOk && dados.cenaEncenada) {
    frase += ` E expôs, um a um, os descuidos da encenação: a cena arrumada para apontar ${formatHora(dados.horaForjada)} — hora em que o morto já era morto havia muito.`;
  }
  return frase;
}

export function gerarMonologo(veredicto, detective) {
  const dados = veredicto.dadosMonologo;
  const blocos = [];

  // ---------------- Abertura, por tipo de desfecho ----------------
  if (veredicto.tipo === 'vitoria_absoluta') {
    blocos.push(
      'O tribunal ouviu o libelo em silêncio — aquele silêncio raro que os juízes do condado reservam às provas que não deixam por onde. A defesa levantou-se duas vezes; sentou-se duas vezes sem nada dizer.'
    );
  } else if (veredicto.tipo === 'sucesso_gafes') {
    blocos.push(
      'O tribunal condenou. Mas a condenação saiu da sala com a gola levantada, como quem evita olhares: a defesa marcou seus pontos, e cada um deles tem o nome de um descuido da perícia.'
    );
  } else if (veredicto.tipo === 'impunidade') {
    blocos.push(
      'O júri demorou menos para absolver do que o oficial para ler o libelo. A intuição apontava — mas tribunal não condena por dedo: condena por corrente, e a corrente veio com elos faltando.'
    );
  } else {
    blocos.push(
      'O tribunal condenou quem o libelo mandou condenar. A justiça dos homens é uma máquina obediente: dá exatamente o veredicto que a perícia lhe pede — inclusive o errado.'
    );
  }

  // ---------------- A tese sustentada ----------------
  blocos.push(blocoTese(dados, detective));

  // ---------------- Lacunas e descuidos expostos pela defesa ----------------
  const frasesFalhas = veredicto.falhas
    .map((f) => textoDaFalha(f, dados))
    .filter(Boolean);
  blocos.push(...frasesFalhas);

  // ---------------- Periféricos ----------------
  for (const [suspeitoId, p] of Object.entries(veredicto.perifericos)) {
    if (p.ok && p.esperado === 'inocente_alibi') {
      blocos.push(
        `Quanto a ${nome(suspeitoId)}, o libelo o devolveu à vida comum com o paradeiro firmado — motivo sem oportunidade não é prova, e o tribunal registrou a lição.`
      );
    } else if (p.ok && p.esperado === 'inocente_segredo') {
      blocos.push(
        `Quanto a ${nome(suspeitoId)}, o libelo soube separar a mentira do crime: quem mente por vergonha responde à própria consciência, não ao carrasco.`
      );
    }
  }

  // ---------------- Fecho, por tipo ----------------
  if (veredicto.tipo === 'vitoria_absoluta') {
    blocos.push(
      `${nome(dados.reuId)} ouviu a sentença de pé. Ao deixar a sala, o delegado apertou a mão de ${detective.title} ${detective.surname} sem dizer palavra — entre profissionais, é o maior dos elogios.`
    );
  } else if (veredicto.tipo === 'sucesso_gafes') {
    blocos.push(
      `${nome(dados.reuId)} foi condenado assim mesmo. Mas nos corredores comentou-se menos a forca que as gafes — e a fama de uma perícia se faz nos corredores.`
    );
  } else if (veredicto.tipo === 'impunidade') {
    blocos.push(
      `${nome(dados.reuId)} desceu os degraus do tribunal em liberdade, parou diante de ${detective.title} ${detective.surname}, e agradeceu — com toda a polidez do mundo — pela lição de direito. Há agradecimentos que pesam mais que sentenças.`
    );
  } else {
    blocos.push(
      `E enquanto a sentença era lida, ${nome(dados.reuCorretoId)} assistia da galeria, de luto correto e mãos limpas — limpas como só as mãos lavadas a tempo conseguem ser. A forca de um inocente tem dois carrascos: quem arma o nó, e quem assina o laudo.`
    );
  }

  return { titulo: TITULOS[veredicto.tipo], blocos };
}
