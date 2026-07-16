// =====================================================================
// GERADOR DE CIDADE SEEDADO — FASE 2 do gerador por simulação
// (design em docs/game-design-simulacao.md §4.2: a cidade nasce PRIMEIRO,
// antes do elenco).
//
// Este módulo é GERADOR-FACING: vive em src/gerador/ e o runtime JAMAIS o
// importa (guarda no qa.mjs). Toda decisão sai de hashString sobre chave
// salgada — mesma seed → mesma cidade, byte a byte. Convenção de sal:
//   `${seed}|cidade|<predio>|<decisao>`
//
// A cidade é uma vila inglesa de 1893 na linhagem de Briarstone: uma High
// Street com as lojas e a delegacia, o adro da igreja num extremo, o solar
// recuado, a ruela dos cottages, e a orla de trabalho (forja, granja,
// moinho) na borda. A geometria sai no MESMO schema que o diorama consome
// (POSICOES_DIORAMA/FORMAS_PREDIO em src/data/mapa_espacial.js): quando o
// pacote de caso gerado chegar ao runtime (Fase 3+), a maquete de papel
// renderiza a cidade sem que o motor mude uma linha.
//
// Saída: JSON puro (nenhuma função) — a regra de ouro do pacote de caso.
// =====================================================================

import { hashString } from '../logic/hash.js';
import { TIPOS_PREDIO } from './espaco.js';

// Amostra um valor numa faixa [mín, máx] em passos de 0,05 (duas casas —
// estável em JSON e suficiente para silhueta de maquete).
function amostrarFaixa(faixa, chave) {
  if (!Array.isArray(faixa)) return faixa;
  const [minimo, maximo] = faixa;
  const passos = Math.round((maximo - minimo) / 0.05);
  const v = minimo + (hashString(chave) % (passos + 1)) * 0.05;
  return Math.round(v * 100) / 100;
}

// Jitter determinístico em ±amplitude, passos de 0,02 (a vila não é régua).
function jitter(chave, amplitude) {
  const passos = Math.round((amplitude * 2) / 0.02);
  const v = -amplitude + (hashString(chave) % (passos + 1)) * 0.02;
  return Math.round(v * 100) / 100;
}

// A forma de maquete de um prédio, amostrada da silhueta paramétrica do
// tipo — campo a campo, cada um com o seu sal (nunca reusar chave).
function amostrarForma(tipo, sal) {
  const s = TIPOS_PREDIO[tipo].silhueta;
  const w = amostrarFaixa(s.w, `${sal}|w`);
  const d = amostrarFaixa(s.d, `${sal}|d`);
  const h = amostrarFaixa(s.h, `${sal}|h`);
  const forma = {
    w,
    d,
    h,
    corParede: s.paletaParede[hashString(`${sal}|corParede`) % s.paletaParede.length],
    corTelhado: s.paletaTelhado[hashString(`${sal}|corTelhado`) % s.paletaTelhado.length],
    telhadoAltura: amostrarFaixa(s.telhadoAltura, `${sal}|telhadoAltura`),
    beiral: s.beiral,
    ristela: s.ristela,
    chamines: [],
  };
  for (let i = 0; i < s.chamines; i++) {
    forma.chamines.push({
      x: Math.round((w * 0.3 - i * w * 0.55) * 100) / 100,
      z: Math.round((i % 2 === 0 ? -0.2 : 0.16) * d * 100) / 100,
      alt: Math.round((0.34 + 0.16 * h) * 100) / 100,
    });
  }
  if (s.marquise) forma.marquise = true;
  if (s.moinho) forma.moinho = true;
  return forma;
}

// ---------------------------------------------------------------------
// O TRAÇADO DA VILA: quarteirões com slots de posição-base. O sorteio
// por seed decide (a) quais prédios opcionais existem, (b) quantos
// cottages a ruela tem, (c) o jitter de cada lote e a silhueta de cada
// prédio. Coordenadas em unidades de maquete (linhagem da tábua do
// tutorial: x ±5,6 / z ±2,4).
// ---------------------------------------------------------------------
const TRACADO = [
  // O adro, no extremo poente: igreja, presbitério e — se a seed a der —
  // a capela rival do outro lado do caminho (Church × Chapel).
  { quarteirao: 'adro', tipo: 'igreja', x: -4.9, z: -1.5 },
  { quarteirao: 'adro', tipo: 'vicarage', x: -4.7, z: 0.3 },
  { quarteirao: 'adro', tipo: 'capela', x: -3.7, z: 1.7 },
  // O solar, recuado do burburinho.
  { quarteirao: 'parque_do_solar', tipo: 'solar', x: -3.3, z: -2.0 },
  // A High Street, lado norte: a autoridade e as lojas.
  { quarteirao: 'high_street_norte', tipo: 'delegacia', x: -1.7, z: -1.3 },
  { quarteirao: 'high_street_norte', tipo: 'botica', x: -0.4, z: -1.4 },
  { quarteirao: 'high_street_norte', tipo: 'mercearia', x: 0.9, z: -1.3 },
  { quarteirao: 'high_street_norte', tipo: 'escola', x: 2.2, z: -1.4 },
  // A High Street, lado sul: a taverna e o médico.
  { quarteirao: 'high_street_sul', tipo: 'pub', x: -1.9, z: 0.4 },
  { quarteirao: 'high_street_sul', tipo: 'casa_do_medico', x: -0.3, z: 0.5 },
  // A orla de trabalho, no nascente: forja, granja e o moinho ao longe.
  { quarteirao: 'orla', tipo: 'forja', x: 3.6, z: -0.9 },
  { quarteirao: 'orla', tipo: 'granja', x: 4.6, z: 0.6 },
  { quarteirao: 'orla', tipo: 'moinho', x: 5.3, z: -1.9 },
  { quarteirao: 'orla', tipo: 'estacao', x: 5.4, z: 1.7 },
];

// A ruela dos cottages, ao sul da High Street: a fileira de casas de
// trabalhador, de 4 a 6 conforme a seed.
const RUELA = { quarteirao: 'ruela_dos_cottages', z: 1.8, x0: -0.6, passo: 0.9, minimo: 4, maximo: 6 };

const ROTULOS_QUARTEIRAO = {
  adro: 'O adro da igreja',
  parque_do_solar: 'O parque do solar',
  high_street_norte: 'High Street — lado norte',
  high_street_sul: 'High Street — lado sul',
  orla: 'A orla de trabalho',
  ruela_dos_cottages: 'A ruela dos cottages',
};

// Distância grosseira sob a qual dois lotes se OUVEM/AVISTAM (alimenta o
// grafo de avistamentos da inserção). Em unidades de maquete.
const LIMIAR_ADJACENCIA = 1.9;

function salDaSeed(seed) {
  return typeof seed === 'string' ? seed : seed?.id || 'caso';
}

// A cidade de uma seed. Mesma seed → mesmo objeto, byte a byte.
export function gerarCidade(seed) {
  const sal = `${salDaSeed(seed)}|cidade`;
  const predios = [];

  for (const lote of TRACADO) {
    const tipo = TIPOS_PREDIO[lote.tipo];
    // Prédio opcional: metade das seeds o tem (sorteio por prédio).
    if (tipo.opcional && hashString(`${sal}|${lote.tipo}|existe`) % 2 !== 0) continue;
    predios.push({
      id: lote.tipo,
      tipo: lote.tipo,
      rotulo: tipo.rotulo,
      quarteirao: lote.quarteirao,
      pos: {
        x: Math.round((lote.x + jitter(`${sal}|${lote.tipo}|jx`, 0.16)) * 100) / 100,
        z: Math.round((lote.z + jitter(`${sal}|${lote.tipo}|jz`, 0.12)) * 100) / 100,
      },
      forma: amostrarForma(lote.tipo, `${sal}|${lote.tipo}|forma`),
    });
  }

  // A ruela dos cottages.
  const nCottages = RUELA.minimo + (hashString(`${sal}|cottages|n`) % (RUELA.maximo - RUELA.minimo + 1));
  for (let i = 0; i < nCottages; i++) {
    const id = `cottage_${i + 1}`;
    predios.push({
      id,
      tipo: 'cottage',
      rotulo: `Cottage nº ${i + 1}`,
      quarteirao: RUELA.quarteirao,
      pos: {
        x: Math.round((RUELA.x0 + i * RUELA.passo + jitter(`${sal}|${id}|jx`, 0.12)) * 100) / 100,
        z: Math.round((RUELA.z + jitter(`${sal}|${id}|jz`, 0.14)) * 100) / 100,
      },
      forma: amostrarForma('cottage', `${sal}|${id}|forma`),
    });
  }

  // Adjacência grosseira por distância entre lotes (pares ordenados uma
  // vez, a < b): quem pode OUVIR quem — insumo do grafo de avistamentos.
  const adjacencias = [];
  for (let i = 0; i < predios.length; i++) {
    for (let j = i + 1; j < predios.length; j++) {
      const a = predios[i];
      const b = predios[j];
      const dist = Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z);
      if (dist <= LIMIAR_ADJACENCIA) adjacencias.push([a.id, b.id]);
    }
  }

  // Quarteirões presentes (na ordem do traçado).
  const quarteiroes = [];
  for (const p of predios) {
    let q = quarteiroes.find((x) => x.id === p.quarteirao);
    if (!q) {
      q = { id: p.quarteirao, rotulo: ROTULOS_QUARTEIRAO[p.quarteirao], predios: [] };
      quarteiroes.push(q);
    }
    q.predios.push(p.id);
  }

  // Projeção para o diorama — o MESMO schema de POSICOES_DIORAMA e
  // FORMAS_PREDIO: posicoes[id] = { x, z, predio } e formas[predio] = a
  // silhueta. A camada visual futura consome isto sem tocar o motor.
  const diorama = { posicoes: {}, formas: {} };
  for (const p of predios) {
    diorama.posicoes[p.id] = { x: p.pos.x, z: p.pos.z, predio: p.id };
    diorama.formas[p.id] = p.forma;
  }

  return { seed: salDaSeed(seed), quarteiroes, predios, adjacencias, diorama };
}

// Acessores de consulta (leitura de dado, sem regra).
export function obterPredio(cidade, id) {
  return cidade.predios.find((p) => p.id === id) || null;
}

export function prediosDoTipo(cidade, tipo) {
  return cidade.predios.filter((p) => p.tipo === tipo);
}

export function saoAdjacentes(cidade, idA, idB) {
  if (idA === idB) return false;
  return cidade.adjacencias.some(([a, b]) => (a === idA && b === idB) || (a === idB && b === idA));
}
