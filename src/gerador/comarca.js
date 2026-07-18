// =====================================================================
// A COMARCA — Anel 2 da OS "Palco em anéis" (E3; dossiê com fonte por
// item em docs/os-palco-em-aneis-e3-dossie.md, decisões do autor de
// 18/07/2026).
//
// Módulo GERADOR-FACING (o runtime jamais o importa; guarda no qa.mjs).
//
// Por seed, 2–3 SATÉLITES: a vila-mercado (sempre — toda vila de 1893
// orbita uma market town a 4–8 milhas; KB centros-urbanos/urbanismo §6),
// a granja isolada (sempre; o satélite barato e mudo) e o entroncamento
// ferroviário (só em seeds cuja vila tem estação — a opcionalidade da
// estação vira estrutural, §4.2 da OS).
//
// SATÉLITE É FACHADA por padrão: nome + distância + funções. Vira NÓ de
// mapa somente quando o caso o referencia (LOD por relevância; satélite
// referenciado sem função = lint GE-E3 no qa.mjs). Toda carta que mora
// num satélite é da classe DURÁVEL (registro/documento — GE7); nenhum
// interrogável reside fora da vila (GE8): o guardião do livro entrega o
// registro em prosa de localidade, nunca entra em `suspeitos`.
//
// Distâncias em horas de trecho (o relógio mole precifica a viagem):
// vila-mercado 1,5h (o precedente Moorford do caso-escola, mapa.js);
// granja 0,5h; entroncamento 1h por trilho. Chutes calibráveis lastreados
// nas milhas da KB — dossiê E3 §1(d).
// =====================================================================

import { hashDecisao } from './hash_gerador.js';

// Nomes fictícios no MESMO padrão -field/-brook/-mere dos topônimos do
// jogo (NOMES_DE_VILA em pacote_gerado.js), em pools DISJUNTOS dos nomes
// de vila — a town nunca colide com a própria vila do caso.
const NOMES_VILA_MERCADO = ['Ashmere', 'Netherfield', 'Thornbrook', 'Weldmere'];
const NOMES_GRANJA_ISOLADA = ['Harefield', 'Oakbrook', 'Redmere'];
const NOMES_ENTRONCAMENTO = ['Cobfield', 'Draymere', 'Stanbrook'];

function salDaSeed(seed) {
  return typeof seed === 'string' ? seed : seed?.id || 'caso';
}

// A comarca de uma seed. JSON puro; mesma seed → mesma comarca.
export function gerarComarca(seed, cidade) {
  const sal = `${salDaSeed(seed)}|comarca`;
  // hashDecisao: o hash decorrelacionado (achado B✱) — hashString repetia
  // nome entre seeds de dígito congruente (bits baixos fracos).
  const escolher = (pool, chave) => pool[hashDecisao(chave) % pool.length];

  const satelites = [
    {
      id: 'vila_mercado',
      tipo: 'vila_mercado',
      rotulo: escolher(NOMES_VILA_MERCADO, `${sal}|vila_mercado|nome`),
      distanciaHoras: 1.5,
      meio: 'estrada',
      // Funções investigáveis = registros duráveis (GE7): dossiê E3 §1(b).
      funcoes: ['gabinete_do_procurador', 'penhorista', 'estalagem', 'agencia_de_fio'],
    },
    {
      id: 'granja_isolada',
      tipo: 'granja_isolada',
      rotulo: `Granja de ${escolher(NOMES_GRANJA_ISOLADA, `${sal}|granja_isolada|nome`)}`,
      distanciaHoras: 0.5,
      meio: 'estrada',
      funcoes: [],
    },
  ];
  if (cidade.predios.some((p) => p.tipo === 'estacao')) {
    satelites.push({
      id: 'entroncamento',
      tipo: 'entroncamento',
      rotulo: `Entroncamento de ${escolher(NOMES_ENTRONCAMENTO, `${sal}|entroncamento|nome`)}`,
      distanciaHoras: 1,
      meio: 'trilho',
      funcoes: ['bilheteria', 'telegrafo'],
    });
  }
  return { satelites };
}

export function obterSatelite(comarca, id) {
  return comarca.satelites.find((s) => s.id === id) || null;
}
