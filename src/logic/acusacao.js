// =====================================================================
// A CONSTRUÇÃO DA ACUSAÇÃO — gramática das ligações (puro; só lê tags).
//
// Substitui o ato final do jogo: em vez de preencher um formulário (o
// Libelo) e deixar o motor/legista deduzir, o JOGADOR afirma a cadeia e a
// sustenta LIGANDO cartas. Há dois verbos atômicos, e o SIGNIFICADO de
// cada ligação é DERIVADO das tags dos seus extremos — nunca escrito à mão
// por caso:
//
//   • SUSTENTAÇÃO: um fato físico apoia uma afirmação positiva.
//       carta temporal  → âncora "Quando"   (a janela afirmada)
//       carta causal     → âncora "Como"      (a causa afirmada)
//       carta vestígio/ambiental → âncora "Presença" (o réu na cena)
//
//   • REFUTAÇÃO: um depoimento desmentido por um ou mais fatos físicos.
//       fato temporal → carta de hora (avistamento / relógio encenado)
//          ⇒ a hora alegada cai FORA da janela que os fatos sustentam:
//            a mentira/encenação fica exposta.
//       vestígio → carta de álibi
//          ⇒ o vestígio do próprio declarante o põe onde jurou não estar.
//            Se o vestígio revela um segredo, a mentira é de vergonha
//            (inocente), não do crime. (Esta é a armadilha do jogo.)
//
// As ligações vivem em `acusacao.ligacoes` como pares { id, de, para } de
// ids de nó (id de carta OU uma das âncoras). A direção não importa.
// =====================================================================

import { janelaDaCarta } from './cronos.js';
import { intersecaoJanelas } from './tempo_morte.js';

// Âncoras: os nós fixos da mesa de construção (as afirmações positivas).
export const ANCORAS = {
  quando: 'ancora_quando',
  como: 'ancora_como',
  presenca: 'ancora_presenca',
};

const IDS_ANCORA = new Set(Object.values(ANCORAS));
export function ehAncora(id) {
  return IDS_ANCORA.has(id);
}

// ---------------------------------------------------------------------
// Predicados de tag (a única coisa que o motor lê numa carta)
// ---------------------------------------------------------------------

// A hora que uma carta de depoimento/cena ALEGA (relógio aparente ou
// avistamento declarado), ou null se não alega hora alguma.
export function horaAlegada(carta) {
  const t = (carta && carta.tagsOcultas) || {};
  if (typeof t.horaAparente === 'number') return t.horaAparente;
  if (typeof t.horaAvistamentoDeclarada === 'number') return t.horaAvistamentoDeclarada;
  return null;
}
export function ehAlegacaoDeHora(carta) {
  return horaAlegada(carta) !== null;
}

function ehIndicadorTemporal(carta) {
  const t = (carta && carta.tagsOcultas) || {};
  return t.dominio === 'temporal' && !t.inconclusiva;
}
function ehSinalCausal(carta) {
  const t = (carta && carta.tagsOcultas) || {};
  // Sustenta o "Como" quem traz um SINAL discriminante ou o INSTRUMENTO
  // (a fibra no fundo do sulco): o mecanismoCravado só consome os sinais
  // (filter(Boolean)), e o instrumento dá nome ao meio no monólogo.
  return t.dominio === 'causal' && (!!t.sinal || !!t.instrumento);
}
function ehVestigio(carta) {
  return ((carta && carta.tagsOcultas) || {}).dominio === 'vestigio';
}
function ehAmbiental(carta) {
  return ((carta && carta.tagsOcultas) || {}).dominio === 'ambiental';
}
function ehAlibi(carta) {
  const t = (carta && carta.tagsOcultas) || {};
  return t.dominio === 'comportamental' && t.subDominio === 'alibi';
}
function ehCorroboracao(carta) {
  const t = (carta && carta.tagsOcultas) || {};
  return t.dominio === 'comportamental' && t.subDominio === 'corroboracao';
}

// ---------------------------------------------------------------------
// Classificação de uma ligação a partir das tags dos seus extremos.
// Devolve { tipo, fato, alvo } | null. `alvo` é a âncora (string) ou a
// carta-depoimento refutada; `fato` é a carta física invocada.
// ---------------------------------------------------------------------
export function classificarLigacao(ligacao, mapaCartas) {
  const ids = [ligacao.de, ligacao.para];
  const ancora = ids.find(ehAncora) || null;
  const cartas = ids.filter((id) => !ehAncora(id)).map((id) => mapaCartas[id]).filter(Boolean);

  // Sustentação: carta física → âncora positiva.
  if (ancora) {
    const carta = cartas[0];
    if (!carta) return null;
    if (ancora === ANCORAS.quando && ehIndicadorTemporal(carta)) {
      return { tipo: 'sustenta_quando', fato: carta, alvo: ancora };
    }
    if (ancora === ANCORAS.como && ehSinalCausal(carta)) {
      return { tipo: 'sustenta_como', fato: carta, alvo: ancora };
    }
    if (ancora === ANCORAS.presenca && (ehVestigio(carta) || ehAmbiental(carta))) {
      return { tipo: 'sustenta_presenca', fato: carta, alvo: ancora };
    }
    return null;
  }

  // Refutação: carta física → carta-depoimento.
  if (cartas.length < 2) return null;
  const [c1, c2] = cartas;
  const alegacao = [c1, c2].find(ehAlegacaoDeHora);
  const indicador = [c1, c2].find(ehIndicadorTemporal);
  if (alegacao && indicador && alegacao !== indicador) {
    return { tipo: 'refuta_hora', alvo: alegacao, fato: indicador };
  }
  const alibi = [c1, c2].find(ehAlibi);
  const vestigio = [c1, c2].find(ehVestigio);
  if (alibi && vestigio) {
    return { tipo: 'refuta_alibi', alvo: alibi, fato: vestigio };
  }
  // Um álibi também pode cair por TESTEMUNHO: a corroboração que registra o
  // declarante saindo antes da hora que jurou (o livro de presença do clube).
  const corroboracao = [c1, c2].find(ehCorroboracao);
  if (alibi && corroboracao) {
    return { tipo: 'refuta_alibi', alvo: alibi, fato: corroboracao };
  }
  return null;
}

// ---------------------------------------------------------------------
// O confronto em cena (Onda 5): apresentar ao declarante, no interrogatório,
// a carta que desmente o seu paradeiro equivale ao barbante vestígio→álibi
// do mural — devolve o par [fatoId, alibiId] que a apresentação estabelece,
// ou null quando a carta não toca o paradeiro do interrogado (evasiva).
// SÓ TAGS (regra do motor): vestígio com pertenceA, ou corroboração com
// ligadoA, contra o álibi cujo declaranteId é o interrogado. A ligação
// resultante nasce visível e removível no mural — a autoria fica no jogador.
// ---------------------------------------------------------------------
export function ligacaoDeConfrontoEmCena(carta, suspeitoId, cartasRegistradas) {
  if (!carta) return null;
  const t = carta.tagsOcultas || {};
  const desmentePorRastro = ehVestigio(carta) && t.pertenceA === suspeitoId;
  const desmentePorRegistro = ehCorroboracao(carta) && t.ligadoA === suspeitoId;
  if (!desmentePorRastro && !desmentePorRegistro) return null;
  const alibi = cartasRegistradas.find(
    (c) => ehAlibi(c) && c.tagsOcultas.declaranteId === suspeitoId
  );
  return alibi ? [carta.id, alibi.id] : null;
}

// ---------------------------------------------------------------------
// Análise de TODAS as ligações de uma acusação. Agrupa o que o veredicto
// precisa, tudo derivado das tags.
// ---------------------------------------------------------------------
export function analisarLigacoes(acusacao, cartasRegistradas) {
  const mapa = {};
  for (const c of cartasRegistradas || []) mapa[c.id] = c;
  const classificadas = ((acusacao && acusacao.ligacoes) || [])
    .map((l) => classificarLigacao(l, mapa))
    .filter(Boolean);

  const porTipo = (t) => classificadas.filter((c) => c.tipo === t).map((c) => c.fato);

  // Refutações de hora agrupadas pela carta-alegação (uma alegação pode ser
  // desmentida por VÁRIOS fatos combinados — é o que aperta a janela).
  const refutaHora = new Map();
  for (const c of classificadas.filter((x) => x.tipo === 'refuta_hora')) {
    const acc = refutaHora.get(c.alvo.id) || { alegacao: c.alvo, fatos: [] };
    acc.fatos.push(c.fato);
    refutaHora.set(c.alvo.id, acc);
  }
  // Refutações de álibi agrupadas pelo álibi.
  const refutaAlibi = new Map();
  for (const c of classificadas.filter((x) => x.tipo === 'refuta_alibi')) {
    const acc = refutaAlibi.get(c.alvo.id) || { alibi: c.alvo, vestigios: [] };
    acc.vestigios.push(c.fato);
    refutaAlibi.set(c.alvo.id, acc);
  }

  return {
    sustentaQuando: porTipo('sustenta_quando'),
    sustentaComo: porTipo('sustenta_como'),
    sustentaPresenca: porTipo('sustenta_presenca'),
    refutaHora,
    refutaAlibi,
  };
}

// ---------------------------------------------------------------------
// Estabelecimento das refutações (o "não-X" de fato comprovado)
// ---------------------------------------------------------------------

// Hora: a alegação cai fora da janela que os fatos físicos sustentam.
export function refutacaoDeHoraEstabelecida(alegacao, fatos) {
  const hora = horaAlegada(alegacao);
  if (hora === null) return false;
  const janela = intersecaoJanelas((fatos || []).map(janelaDaCarta).filter(Boolean));
  if (!janela) return false;
  return hora < janela.inicio || hora > janela.fim;
}

// Álibi: cai por VESTÍGIO (um traço do próprio declarante o põe onde jurou
// não estar — a presença física basta, sem hora) ou por TESTEMUNHO (uma
// corroboração sobre o declarante registra que ele deixou o lugar antes da
// hora que declarou: `horaFimObservada` < fim declarado).
export function refutacaoDeAlibiEstabelecida(alibi, fatos) {
  const t = ((alibi && alibi.tagsOcultas) || {});
  const decl = t.declaranteId;
  return (fatos || []).some((f) => {
    const ft = f.tagsOcultas || {};
    if (ft.pertenceA === decl) return true;
    return (
      ft.subDominio === 'corroboracao' &&
      ft.ligadoA === decl &&
      typeof ft.horaFimObservada === 'number' &&
      typeof t.horaFimDeclarada === 'number' &&
      ft.horaFimObservada < t.horaFimDeclarada
    );
  });
}

// Segredo revelado ao quebrar o álibi (ou null). É o que distingue a
// mentira de vergonha (inocente) da mentira do crime.
export function segredoRevelado(alibi, vestigios) {
  const decl = ((alibi && alibi.tagsOcultas) || {}).declaranteId;
  const v = (vestigios || []).find(
    (x) => x.tagsOcultas.pertenceA === decl && x.tagsOcultas.revelaSegredo
  );
  return v ? v.tagsOcultas.revelaSegredo : null;
}
