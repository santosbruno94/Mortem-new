// =====================================================================
// Agregação de dados por pessoa para a ficha de dossiê na mesa (P11).
//
// Camada de APRESENTAÇÃO: o motor jamais lê nada daqui. As ligações são
// derivadas das tagsOcultas das cartas já registradas (pertenceA, ligadoA,
// declaranteId) e do histórico de diálogo (nosVisitadosDialogo). Nenhuma
// conclusão é entregue — a ficha é QOL (organização de material colhido).
// =====================================================================

import { obterDialogos, obterSuspeitos, obterSuspeito } from '../data/pacote_caso.js';

// Quais suspeitos possuem árvore de diálogo (o elenco interrogável).
export function suspeitosComDialogo() {
  const dialogos = obterDialogos();
  const ids = new Set();
  for (const chave of Object.keys(dialogos)) {
    const d = dialogos[chave];
    if (d?.suspeitoId) ids.add(d.suspeitoId);
  }
  return obterSuspeitos().filter((s) => ids.has(s.id));
}

// Cartas que PERTENCEM a esta pessoa (posse física: pertenceA).
export function cartasDaPessoa(suspeitoId, cartasRegistradas) {
  return cartasRegistradas.filter((c) => c.tagsOcultas?.pertenceA === suspeitoId);
}

// Cartas que MENCIONAM/LIGAM esta pessoa (ligadoA).
export function cartasQueMencionam(suspeitoId, cartasRegistradas) {
  return cartasRegistradas.filter((c) => c.tagsOcultas?.ligadoA === suspeitoId);
}

// Cartas declaradas POR esta pessoa (depoimentos: declaranteId).
export function cartasDeclaradas(suspeitoId, cartasRegistradas) {
  return cartasRegistradas.filter((c) => c.tagsOcultas?.declaranteId === suspeitoId);
}

// Cartas com potencial de MOTIVO ligadas a esta pessoa (subDominio de motivação).
export function cartasDeMotivo(suspeitoId, cartasRegistradas) {
  return cartasRegistradas.filter(
    (c) =>
      c.tagsOcultas?.dominio === 'comportamental' &&
      (c.tagsOcultas?.pertenceA === suspeitoId || c.tagsOcultas?.ligadoA === suspeitoId)
  );
}

// Todas as cartas que tocam esta pessoa (união sem duplicatas, por id).
export function todasCartasDaPessoa(suspeitoId, cartasRegistradas) {
  const vistas = new Set();
  const resultado = [];
  for (const c of cartasRegistradas) {
    if (vistas.has(c.id)) continue;
    const t = c.tagsOcultas || {};
    if (
      t.pertenceA === suspeitoId ||
      t.ligadoA === suspeitoId ||
      t.declaranteId === suspeitoId
    ) {
      vistas.add(c.id);
      resultado.push(c);
    }
  }
  return resultado;
}

// Falas visitadas de um diálogo de suspeito (trechos do interrogatório).
// Devolve os nós visitados com o texto da fala (para exibição resumida).
export function falasVisitadas(suspeitoId, nosVisitadosDialogo, dialogos) {
  const visitados = nosVisitadosDialogo[suspeitoId] || [];
  if (visitados.length === 0) return [];
  const dl = dialogos || obterDialogos();
  let arvore = null;
  for (const chave of Object.keys(dl)) {
    if (dl[chave]?.suspeitoId === suspeitoId) { arvore = dl[chave]; break; }
  }
  if (!arvore) return [];
  const nosReacao = new Set([
    ...Object.values(arvore.reacoesProva || {}),
    arvore.noEvasiva,
  ].filter(Boolean));
  return visitados
    .filter((id) => !nosReacao.has(id) && arvore.nos[id])
    .map((id) => ({ noId: id, fala: arvore.nos[id].fala }));
}

// O que OUTROS suspeitos dizem sobre esta pessoa nas falas visitadas.
// Percorre os nós visitados de cada OUTRO suspeito e procura o nome.
export function oQueOutrosDizem(suspeitoId, nosVisitadosDialogo) {
  const alvo = obterSuspeito(suspeitoId);
  if (!alvo) return [];
  const nome = alvo.nome;
  const partes = nome.split(' ');
  const termosBusca = partes.length > 1
    ? [nome, partes[partes.length - 1]]
    : [nome];
  const dialogos = obterDialogos();
  const resultado = [];
  for (const chave of Object.keys(dialogos)) {
    const d = dialogos[chave];
    if (!d?.suspeitoId || d.suspeitoId === suspeitoId) continue;
    const autor = obterSuspeito(d.suspeitoId);
    const visitados = nosVisitadosDialogo[d.suspeitoId] || [];
    const nosReacao = new Set([
      ...Object.values(d.reacoesProva || {}),
      d.noEvasiva,
    ].filter(Boolean));
    for (const noId of visitados) {
      if (nosReacao.has(noId) || !d.nos[noId]) continue;
      const fala = d.nos[noId].fala || [];
      const menciona = fala.some((p) =>
        termosBusca.some((t) => p.includes(t))
      );
      if (menciona) {
        resultado.push({
          autorId: d.suspeitoId,
          autorNome: autor?.nome || d.suspeitoId,
          noId,
          fala,
        });
      }
    }
  }
  return resultado;
}

// Álibi declarado: carta com declaranteId === suspeitoId e subDominio
// 'alibi' (ou tags que indiquem paradeiro).
export function alibiDeclarado(suspeitoId, cartasRegistradas) {
  return cartasRegistradas.find(
    (c) =>
      c.tagsOcultas?.declaranteId === suspeitoId &&
      c.tagsOcultas?.subDominio === 'alibi'
  ) || null;
}
