// =====================================================================
// INSERÇÃO ESPACIAL DO ELENCO + GRAFO DE AVISTAMENTOS — FASE 2
// (design em docs/game-design-simulacao.md §4.2: cidade → elenco →
// inserção → grafo).
//
// Módulo GERADOR-FACING (o runtime jamais o importa; guarda no qa.mjs).
// Determinismo: toda decisão sai de hashString sobre chave salgada,
// convenção `${seed}|insercao|${personagem.id}|<decisao>`.
//
// A inserção concretiza o pacote espacial do ARQUÉTIPO (padrões em
// vocabulário fechado) em ENDEREÇOS da cidade gerada: onde o NPC mora,
// onde trabalha, o que frequenta — e a rotina GROSSEIRA em três faixas
// (dia / noite / madrugada), suficiente para ancorar álibis e
// quem-ouviu-o-quê. Sem agenda por hora (rejeição registrada no
// histórico de decisões).
//
// O GRAFO DE AVISTAMENTOS deriva de rotina × adjacência espacial: quem
// pode ter visto (mesmo prédio) ou ouvido (prédio adjacente) quem, em
// que faixa. Álibis e depoimentos de ruído das fases seguintes nascem
// DESTE grafo, nunca de texto solto.
// =====================================================================

import { hashString } from '../logic/hash.js';
import { ARQUETIPOS } from './arquetipos.js';
import { prediosDoTipo, saoAdjacentes } from './cidade.js';

export const FAIXAS_ROTINA = ['dia', 'noite', 'madrugada'];

// Casas que sustentam criadagem interna (destino de 'no_servico' e
// 'casa_com_criadagem') — KB arquitetura §3: sótão da criada.
const TIPOS_CASA_COM_CRIADAGEM = ['solar', 'vicarage', 'casa_do_medico', 'pub'];

function salDaSeed(seed) {
  return typeof seed === 'string' ? seed : seed?.id || 'caso';
}

function escolher(lista, chave) {
  return lista[hashString(chave) % lista.length];
}

// Resolve um TIPO de prédio em um id concreto da cidade (para tipos
// únicos, o próprio; para vários — cottages —, sorteio pela chave).
function resolverTipo(cidade, tipo, chave) {
  const candidatos = prediosDoTipo(cidade, tipo);
  if (candidatos.length === 0) return null;
  return escolher(candidatos, chave).id;
}

// Insere o elenco na cidade. NÃO muta o elenco de entrada: devolve novos
// personagens com `pacoteEspacial` preenchido (o slot que a amostragem da
// Fase 1 entrega null — a cidade nasce primeiro, a inserção vem depois).
export function inserirElenco(cidade, elenco, seed) {
  const salBase = `${salDaSeed(seed)}|insercao`;
  // Ocupação dos cottages: moradores sucessivos ocupam cottages
  // sucessivos a partir de um início sorteado — casas únicas enquanto
  // houver cottage vago; divide teto só quando a ruela lota (hóspede é
  // plausível na época).
  const cottages = prediosDoTipo(cidade, 'cottage').map((p) => p.id);
  const inicioCottages = hashString(`${salBase}|cottages|inicio`) % cottages.length;
  let proximoCottage = 0;

  return elenco.map((personagem) => {
    const sal = `${salBase}|${personagem.id}`;
    const pacote = ARQUETIPOS[personagem.arquetipo].pacoteEspacial;

    // 1. Trabalho (pode condicionar a moradia, por isso vem primeiro).
    let trabalho;
    if (pacote.trabalho === 'casa_com_criadagem') {
      const casas = TIPOS_CASA_COM_CRIADAGEM.flatMap((t) => prediosDoTipo(cidade, t).map((p) => p.id));
      trabalho = escolher(casas, `${sal}|casaServida`);
    } else if (pacote.trabalho === 'em_casa') {
      trabalho = null; // resolvido após a moradia
    } else {
      trabalho = resolverTipo(cidade, pacote.trabalho, `${sal}|trabalho`);
    }

    // 2. Moradia, pelo padrão de acomodação do arquétipo.
    let moradia;
    if (pacote.acomodacao === 'sobre_a_loja' || pacote.acomodacao === 'no_servico') {
      moradia = trabalho;
    } else if (pacote.acomodacao === 'cottage') {
      moradia = cottages[(inicioCottages + proximoCottage) % cottages.length];
      proximoCottage += 1;
    } else {
      moradia = resolverTipo(cidade, pacote.acomodacao, `${sal}|moradia`);
    }
    if (trabalho === null) trabalho = moradia; // 'em_casa'

    // 3. Frequentados: 2–3 do pool do arquétipo, resolvidos na cidade.
    //    Church × Chapel: onde a capela existe, parte da vila dissente —
    //    o frequentado 'igreja' vira capela para ~1/3 dos personagens.
    const pool = pacote.frequentados;
    const quantos = Math.min(pool.length, 2 + (hashString(`${sal}|nFrequentados`) % 2));
    const inicio = hashString(`${sal}|frequentados|inicio`) % pool.length;
    const frequentados = [];
    for (let i = 0; i < quantos; i++) {
      let tipo = pool[(inicio + i) % pool.length];
      if (
        tipo === 'igreja' &&
        prediosDoTipo(cidade, 'capela').length > 0 &&
        hashString(`${sal}|dissidente`) % 3 === 0
      ) {
        tipo = 'capela';
      }
      const id = resolverTipo(cidade, tipo, `${sal}|frequentado|${i}`);
      if (id && id !== moradia && id !== trabalho && !frequentados.includes(id)) frequentados.push(id);
    }

    // 4. Rotina grosseira em TRÊS FAIXAS. Dia no trabalho; madrugada em
    //    casa; a noite é o único grau de liberdade — 2/3 num frequentado,
    //    1/3 em casa. Quem mora onde trabalha (taverneiro, criada,
    //    constable) tem noite presa à casa: o serviço não solta.
    const moraOndeTrabalha = moradia === trabalho;
    let noite;
    if (moraOndeTrabalha || frequentados.length === 0) {
      noite = moradia;
    } else {
      noite =
        hashString(`${sal}|rotina|noite`) % 3 === 0
          ? moradia
          : escolher(frequentados, `${sal}|rotina|qualFrequentado`);
    }
    const rotina = { dia: trabalho, noite, madrugada: moradia };

    return {
      ...personagem,
      pacoteEspacial: { moradia, trabalho, frequentados, rotina },
    };
  });
}

// ---------------------------------------------------------------------
// GRAFO DE AVISTAMENTOS: de rotina × adjacência deriva quem pode ter
// visto/ouvido quem, onde e em que faixa. Arestas em pares ordenados
// (índice a < b no elenco), uma vez cada:
//   modo 'mesmo_local' — os dois na mesma casa naquela faixa (viram-se);
//   modo 'adjacencia'  — em prédios vizinhos (um OUVE o barulho do outro).
// Derivação PURA dos dados (nenhum sorteio): o grafo é consequência da
// cidade e das rotinas, não fonte nova de aleatoriedade.
// ---------------------------------------------------------------------
export function derivarGrafoAvistamentos(cidade, elencoInserido) {
  const arestas = [];
  for (const faixa of FAIXAS_ROTINA) {
    for (let i = 0; i < elencoInserido.length; i++) {
      for (let j = i + 1; j < elencoInserido.length; j++) {
        const a = elencoInserido[i];
        const b = elencoInserido[j];
        const localA = a.pacoteEspacial.rotina[faixa];
        const localB = b.pacoteEspacial.rotina[faixa];
        if (localA === localB) {
          arestas.push({ faixa, modo: 'mesmo_local', entre: [a.id, b.id], locais: [localA, localB] });
        } else if (saoAdjacentes(cidade, localA, localB)) {
          arestas.push({ faixa, modo: 'adjacencia', entre: [a.id, b.id], locais: [localA, localB] });
        }
      }
    }
  }
  return arestas;
}
