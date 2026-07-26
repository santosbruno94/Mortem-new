// =====================================================================
// PROCEDÊNCIA GERADA (OS-R9 · Fase 1) — o `apontadaPor` da D17 para os
// casos do banco, e o feixe da D16 onde a ficção já o tinha e o jogo não
// sabia ligar.
//
// Módulo GERADOR-FACING: o runtime jamais o importa (guarda no qa.mjs). O
// que ele produz é DADO — o campo `procedencia` do pacote —, e quem o
// consome é `src/logic/contaminacao.js`, fora do motor.
//
// ---------------------------------------------------------------------
// POR QUE ISTO EXISTE
//
// A R7 escreveu `contarVozes` com a regra «alegação sem procedência
// registada é voz própria» porque a conta estrita teria apagado o bloco das
// testemunhas de todo o banco. A regra é honesta e fica. O que não podia
// ficar é ela ser o *fallback* de 31 casos em 31: sem mapa, o desfecho
// contava PAPÉIS onde devia contar BOCAS, e a Fase 0 mediu que em 20 dos 31
// casos há uma boca respondendo por duas alegações — corroborações
// aparentes que o perito somava duas vezes na própria voz, no fecho.
//
// ---------------------------------------------------------------------
// A REGRA DE OURO DESTE MÓDULO: O MAPA NÃO SABE MAIS DO QUE O CASO MOSTRA
//
// Um mapa que registasse a verdade da simulação seria prova de graça pela
// porta dos fundos (GR9-3). Por isso cada entrada abaixo cita o lugar do
// caso de onde a boca sai, e as três recusas são tão deliberadas quanto as
// inclusões:
//
//   • a CORROBORAÇÃO ANÓNIMA («a rua dá fulano por presente, por mais de
//     uma janela») fica FORA do mapa. Ela não tem boca única, e pô-la numa
//     seria inventar uma testemunha para poder descontá-la;
//   • e a corroboração de boca que o CASO NÃO SABE NOMEAR fica fora pela
//     mesma razão, por outro caminho. O confirmante sai do elenco do mundo,
//     que é maior do que o elenco do caso: quando ele não é suspeito nem
//     testemunha de carta, o pacote não tem por onde resolver o nome dele.
//     Uma boca que o caso não nomeia não é, para a aritmética do perito,
//     melhor do que «a rua» — ninguém repara que dois papéis saíram do
//     mesmo homem quando o caso nunca disse quem ele é;
//   • o ENGODO entra pelo PORTADOR, nunca por quem o mandou. A própria
//     carta diz que quem pediu o recado «ficou fora da luz e não deixou
//     nome» — o mapa que apontasse o réu ali saberia o que o caso esconde;
//   • o SEGREDO, o MÓBIL e o VESTÍGIO não são alegações. Ninguém os disse:
//     são coisa achada, e coisa achada não tem boca.
//
// ---------------------------------------------------------------------
// O FEIXE DA D16, E ONDE ELE JÁ ESTAVA
//
// A D16 fixou a cumplicidade como POSTERIOR: a mesma mentira posta em mais
// de uma boca depois do fato. O gerador já produzia exatamente isso e não o
// registava — o sistema de interferência (Regras de Justiça R1–R6) faz o
// ator subornar, intimidar ou silenciar uma testemunha, e a carta de
// RETRATAÇÃO que nasce dali é, literalmente, a versão que o ator pôs na
// boca dela. Registada, ela junta-se ao álibi do próprio ator num feixe de
// duas alegações e uma boca — o mesmo desenho de Silas com Davey e a Sra.
// Wick, produzido pela simulação em vez de escrito à mão.
//
// A `forma` distingue o preço: comprada é `ensaio` (repete o que lhe
// puseram na boca); arrancada por medo é `coacao` (e recua quando pode).
//
// E ISTO NÃO ENTREGA O RÉU. A ficção já aponta para lá sozinha, e mais
// alto: a retratação anuncia-se em diário («Uma testemunha mudou a própria
// história»), e as cartas irmãs — a caderneta quitada, os soberanos novos —
// já traçam o dinheiro até o ator, com nome. O mapa não acrescenta
// conhecimento nenhum ao jogador; acrescenta ARITMÉTICA ao perito, que é
// outra coisa: ele deixa de somar duas vezes o mesmo homem.
// =====================================================================

// As formas registáveis (o vocabulário é o de `src/data/procedencia.js`).
const PROPRIA = 'propria';
const ENSAIO = 'ensaio';
const COACAO = 'coacao';

// Que forma cada espécie de interferência sobre testemunha imprime na
// alegação que dela resulta. O que não está aqui não produz alegação nova:
// `destruir_evidencia` mexe em coisa, não em boca.
const FORMA_POR_INTERFERENCIA = {
  subornar_testemunha: ENSAIO,
  intimidar_testemunha: COACAO,
  silenciar: COACAO,
};

/**
 * O mapa de procedência de um caso gerado.
 *
 * Determinístico e sem sorteio: cada entrada é leitura de um campo que já
 * existe no caso. Não há `hashString` aqui de propósito — procedência não é
 * variação, é registro, e um registro sorteado seria um registro falso.
 *
 * @param {object} p
 * @param {Array<object>} p.cartas catálogo já realizado do caso
 * @param {Array<object>} p.suspeitos elenco do caso (as bocas que o pacote
 *        sabe nomear por si)
 * @param {Array<object>} p.eventos eventos de interferência pré-computados
 * @param {Object<string,string>} p.bocasDeCorroboracao cartaId → id de quem
 *        confirma, só para as corroborações de boca NOMEADA
 * @returns {Object<string,{apontadaPor:string,forma:string}>} em ordem
 *          estável (a do catálogo, e depois a dos eventos)
 */
export function derivarProcedencia({ cartas, suspeitos = [], eventos = [], bocasDeCorroboracao = {} }) {
  const mapa = {};
  // Quem o pacote sabe nomear: o elenco de suspeitos, mais quem já assina
  // um testemunho ou um paradeiro no catálogo. É a MESMA definição que a
  // guarda GR9-1 usa para cobrar lastro — de propósito: gerador e guarda
  // discordarem sobre quem é gente do caso seria a pior espécie de furo.
  const nomeaveis = new Set((suspeitos || []).map((s) => s.id));
  for (const carta of cartas || []) {
    if (carta.origemTestemunha) nomeaveis.add(carta.origemTestemunha);
    const declarante = (carta.tagsOcultas || {}).declaranteId;
    if (declarante) nomeaveis.add(declarante);
  }
  for (const evento of eventos || []) if (evento?.ator) nomeaveis.add(evento.ator);
  const registrar = (id, apontadaPor, forma) => {
    if (!id || !apontadaPor || mapa[id]) return;
    if (!nomeaveis.has(apontadaPor)) return;
    mapa[id] = { apontadaPor, forma };
  };

  for (const carta of cartas || []) {
    const tags = carta.tagsOcultas || {};

    // O paradeiro que a pessoa declara de si. É a alegação mais própria que
    // existe, e é a que forma feixe com tudo o mais que saia da mesma boca.
    if (tags.subDominio === 'alibi' && tags.declaranteId) {
      registrar(carta.id, tags.declaranteId, PROPRIA);
      continue;
    }

    // O testemunho de boca nomeada: quem viu com vida, quem ouviu a parede,
    // quem levou o recado. O campo já existe no catálogo desde o gerador v1.
    if (carta.origemTestemunha) {
      registrar(carta.id, carta.origemTestemunha, PROPRIA);
      continue;
    }

    // A corroboração de vizinhança, e SÓ quando ela tem boca. O ramo
    // coletivo («por mais de uma janela») não entra — ver o cabeçalho.
    if (tags.subDominio === 'corroboracao' && bocasDeCorroboracao[carta.id]) {
      registrar(carta.id, bocasDeCorroboracao[carta.id], PROPRIA);
    }
  }

  // O feixe da D16: a versão que o ator pôs na boca da testemunha. Corre
  // depois do catálogo para que a ordem do mapa seja estável (catálogo,
  // depois eventos) e para que nada aqui sobrescreva uma boca própria.
  for (const evento of eventos || []) {
    const forma = FORMA_POR_INTERFERENCIA[evento?.tipo];
    if (!forma || !evento.ator) continue;
    for (const id of evento.efeito?.cartasNovas || []) {
      // Só a alegação — o rastro do dinheiro é coisa achada, não fala.
      if (!id.endsWith('_retratacao')) continue;
      registrar(id, evento.ator, forma);
    }
  }

  return mapa;
}
