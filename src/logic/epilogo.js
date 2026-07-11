// =====================================================================
// O EPÍLOGO — o encerramento do caso, depois do monólogo (Q5).
//
// Quando o jogador SELA o caso ("Encerrar o caso"), o jogo paga o
// investimento com consequência: o destino do réu, dos periféricos e do
// perito, em 2–4 parágrafos. Como o monólogo, é feito de BLOCOS de
// template universais parametrizados pelo veredicto — nenhum texto é
// exclusivo do caso; os mesmos moldes servem ao tutorial e ao procedural.
// Zero LLM; um molde por situação (sem variantes, por ora).
//
// Convenções de época (1893): homicídio doloso julga-se nas assises do
// condado e a condenação leva à forca (pena obrigatória, OAPA 1861);
// inquérito sem réu encerra pela fórmula do coroner — "homicídio doloso
// por pessoa ou pessoas desconhecidas". Validado com o perito-forense.
//
// NOTA (gênero dos particípios): o particípio flexiona pelo artigo que o
// título do nome dá ("Sra." → condenada). Suspeito sem título flexiona no
// masculino — quando o gerador procedural trouxer suspeitas sem título,
// a seed deverá carregar o gênero.
// =====================================================================

import { obterSuspeito } from '../data/seed.js';
import { artigoDe, comArtigo, ComArtigo, deQuem } from './monologo.js';

function nome(suspeitoId) {
  const s = obterSuspeito(suspeitoId);
  return s ? s.nome : 'pessoa incerta';
}

function flex(nomeCompleto, masc, fem) {
  return artigoDe(nomeCompleto) === 'a' ? fem : masc;
}

// ---------------- O destino do réu apontado, por desfecho ----------------
function blocoReu(veredicto) {
  const dados = veredicto.dadosMonologo;
  const reu = nome(dados.reuId);
  switch (veredicto.tipo) {
    case 'vitoria_absoluta':
      return `O júri ouviu a cadeia inteira sem pedir que se repetisse um elo. ${ComArtigo(reu)} foi ${flex(reu, 'condenado', 'condenada')} na primeira sessão das assises do condado, e a pena foi a que a lei reserva ao homicídio doloso: a forca.`;
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

// No encerramento do Erro Judiciário, o nome do verdadeiro autor é enfim
// revelado (a retentativa acabou; a conta se apresenta inteira).
function blocoRevelacao(veredicto) {
  if (veredicto.tipo !== 'erro_judiciario') return null;
  const correto = nome(veredicto.dadosMonologo.reuCorretoId);
  return `Ao verdadeiro autor, o processo nunca chegou: ${comArtigo(correto)} acompanhou a sentença de fora dos autos.`;
}

// ---------------- O destino dos não-acusados ----------------
function blocosPerifericos(veredicto) {
  const blocos = [];
  for (const [suspeitoId, p] of Object.entries(veredicto.perifericos || {})) {
    const n = nome(suspeitoId);
    if (p.esperado === 'inocente_segredo') {
      blocos.push(
        p.ok
          ? `A mentira ${deQuem(n)} ficou nos autos pelo que era: vergonha, não sangue. Respondeu por ela diante de quem devia.`
          : `A mentira ${deQuem(n)} ficou por entender, e há de pesar-lhe mais tempo do que pesaria a verdade.`
      );
    } else if (p.esperado === 'inocente_alibi' && p.ok && p.alibiNaMesa) {
      blocos.push(`De ${n} o processo guardou apenas o paradeiro confirmado.`);
    }
  }
  return blocos;
}

// ---------------- O perito fecha a conta ----------------
function blocoPerito(veredicto) {
  switch (veredicto.tipo) {
    case 'vitoria_absoluta':
      return 'Os honorários foram pagos sem discussão da conta. O próximo chamado, quando vier, virá mais cedo.';
    case 'sucesso_gafes':
      return 'Pagaram-me os honorários e pouparam-me os cumprimentos. Há de haver outro chamado, e menos pressa.';
    case 'impunidade':
      return 'Não se pagam honorários por um caso em aberto. Deixei os laudos em ordem: algum dia alguém os relerá.';
    case 'erro_judiciario':
      return 'Os honorários, recusei-os. O laudo, esse, não há como devolver.';
    default:
      return null;
  }
}

export function gerarEpilogo(veredicto) {
  return {
    titulo: 'Epílogo',
    blocos: [blocoReu(veredicto), blocoRevelacao(veredicto), ...blocosPerifericos(veredicto), blocoPerito(veredicto)].filter(Boolean),
  };
}
