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
// Street com as lojas, a delegacia e a forja no seu coração, o adro da
// igreja num extremo, o solar recuado, a ruela dos cottages, e a orla de
// trabalho (granja, moinho) na borda. A geometria sai no MESMO schema que o diorama consome
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
  // A High Street, lado sul: a taverna, o médico e a forja no coração da vila
  // (tolerada no miolo — fogo controlado, castanheira ao lado; a bigorna é o
  // relógio sonoro central da vila — urbanismo-e-morfologia.md §2/§7).
  { quarteirao: 'high_street_sul', tipo: 'pub', x: -1.9, z: 0.4 },
  { quarteirao: 'high_street_sul', tipo: 'casa_do_medico', x: -0.3, z: 0.5 },
  { quarteirao: 'high_street_sul', tipo: 'forja', x: 1.1, z: 0.5 },
  // A orla de trabalho, no nascente: a granja e o moinho ao longe.
  { quarteirao: 'orla', tipo: 'granja', x: 4.6, z: 0.6 },
  { quarteirao: 'orla', tipo: 'moinho', x: 5.3, z: -1.9 },
  { quarteirao: 'orla', tipo: 'estacao', x: 5.4, z: 1.7 },
  // LOGRADOUROS (E2, Anel 1): lotes de chão que entram na adjacência como
  // qualquer prédio — palco externo anexo ao prédio da rotina (dossiê §1:
  // adro adjacente a igreja/vicarage; pátio à granja e à ponta da ruela;
  // açude só ao moinho, o palco mais surdo da vila). Jitter mínimo: chão
  // murado não dança de seed a seed como um lote construído.
  { quarteirao: 'adro', tipo: 'adro_da_igreja', x: -4.3, z: -0.6, logradouro: true },
  { quarteirao: 'orla', tipo: 'patio_da_granja', x: 3.95, z: 1.05, logradouro: true },
  { quarteirao: 'orla', tipo: 'caminho_do_acude', x: 4.6, z: -1.6, logradouro: true },
];

// A ruela dos cottages, ao sul da High Street: a fileira de casas de
// trabalhador, de 4 a 6 conforme a seed.
const RUELA = { quarteirao: 'ruela_dos_cottages', z: 1.8, x0: -0.6, passo: 0.9, minimo: 4, maximo: 6 };

// ---------------------------------------------------------------------
// MORFOLOGIAS DA VILA (OS Vila Viva E4) — a mesma vila (mesmos prédios,
// mesmos quarteirões, mesmos logradouros ancorados) desenhada em três
// traçados da KB (urbanismo-e-morfologia.md §1), escolhidos por seed:
//   • nucleada — o casario aglomerado do TRACADO acima (padrão histórico);
//   • linear   — a "street village": tudo esticado ao longo de UMA rua,
//                em duas fileiras que se encaram; a orla no extremo, após
//                o vão de campo (fundo de lote dá no campo);
//   • de_green — casas em anel em torno do gramado comunal vazio (o vazio
//                central É o centro; igreja e pub se encaram por cima dele).
// Só as COORDENADAS mudam: tipo, quarteirão e ancoragem de logradouro são
// invariantes, então o regime-palco (moeda 70/20/10 + tipo do prédio da
// rotina) não se move. O que muda é a `adjacencias` por distância — a
// malha de avistamentos, que a E2 lê. Densidade calibrada para a banda da
// nucleada (relatório espacial v1). Logradouros colados ao prédio-mãe.
// ---------------------------------------------------------------------
export const MORFOLOGIAS = ['nucleada', 'linear', 'de_green'];

// LINEAR: fita poente→nascente. Fileira norte (z≈−0,85) e sul (z≈+0,95),
// rua larga (o casario se encara mas a rua real afasta as fileiras),
// passo ~1,2 na rua; a orla no nascente após o vão de campo.
const POS_LINEAR = {
  igreja: { x: -5.3, z: -0.85 }, vicarage: { x: -4.1, z: -0.85 }, delegacia: { x: -2.9, z: -0.85 },
  botica: { x: -1.7, z: -0.85 }, mercearia: { x: -0.5, z: -0.85 }, escola: { x: 0.7, z: -0.85 },
  solar: { x: -5.1, z: 0.95 }, capela: { x: -3.9, z: 0.95 }, pub: { x: -2.7, z: 0.95 },
  casa_do_medico: { x: -1.5, z: 0.95 }, forja: { x: -0.3, z: 0.95 },
  granja: { x: 4.0, z: 0.95 }, moinho: { x: 4.9, z: -0.85 }, estacao: { x: 5.4, z: 0.95 },
  adro_da_igreja: { x: -4.7, z: 0.05 }, patio_da_granja: { x: 4.0, z: 1.9 }, caminho_do_acude: { x: 4.9, z: -1.85 },
};
const RUELA_LINEAR = { quarteirao: 'ruela_dos_cottages', z: 1.9, x0: -4.0, passo: 0.8, minimo: 4, maximo: 6 };

// DE GREEN: anel elíptico em torno do gramado (centro vazio). Prédios
// ordenados pela borda; igreja (poente-norte) e pub (poente-sul) se
// encaram por cima do green; a orla ocupa o arco nascente.
const POS_GREEN = {
  solar: { x: -3.8, z: -1.6 }, igreja: { x: -2.6, z: -2.0 }, vicarage: { x: -1.3, z: -2.05 },
  delegacia: { x: 0.0, z: -2.05 }, botica: { x: 1.3, z: -1.95 }, escola: { x: 2.5, z: -1.6 },
  granja: { x: 3.6, z: -0.9 }, moinho: { x: 4.3, z: 0.2 }, estacao: { x: 4.0, z: 1.3 },
  mercearia: { x: 2.7, z: 1.75 }, forja: { x: 1.4, z: 2.0 }, casa_do_medico: { x: 0.1, z: 2.05 },
  pub: { x: -1.2, z: 2.0 }, capela: { x: -2.6, z: 1.7 },
  adro_da_igreja: { x: -2.6, z: -1.35 }, patio_da_granja: { x: 4.3, z: -1.0 }, caminho_do_acude: { x: 4.95, z: -0.5 },
};
const RUELA_GREEN = { quarteirao: 'ruela_dos_cottages', z: 0.9, x0: -3.4, passo: 0.9, minimo: 4, maximo: 6 };

// Posição-base de um lote na morfologia dada (nucleada = o próprio TRACADO).
function posDoLote(morfologia, lote) {
  if (morfologia === 'linear') return POS_LINEAR[lote.tipo] || { x: lote.x, z: lote.z };
  if (morfologia === 'de_green') return POS_GREEN[lote.tipo] || { x: lote.x, z: lote.z };
  return { x: lote.x, z: lote.z };
}
function ruelaDaMorfologia(morfologia) {
  if (morfologia === 'linear') return RUELA_LINEAR;
  if (morfologia === 'de_green') return RUELA_GREEN;
  return RUELA;
}

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
// `morfForcada` (opcional) fixa a morfologia — só para medição/QA; em
// produção a seed escolhe (nenhuma regra de runtime chama isto).
export function gerarCidade(seed, morfForcada = null) {
  const sal = `${salDaSeed(seed)}|cidade`;
  const morfologia = morfForcada || MORFOLOGIAS[hashString(`${sal}|morfologia`) % MORFOLOGIAS.length];
  const predios = [];

  for (const lote of TRACADO) {
    const tipo = TIPOS_PREDIO[lote.tipo];
    // Prédio opcional: metade das seeds o tem (sorteio por prédio).
    if (tipo.opcional && hashString(`${sal}|${lote.tipo}|existe`) % 2 !== 0) continue;
    const base = posDoLote(morfologia, lote);
    predios.push({
      id: lote.tipo,
      tipo: lote.tipo,
      rotulo: tipo.rotulo,
      quarteirao: lote.quarteirao,
      ...(lote.logradouro ? { logradouro: true } : {}),
      pos: {
        x: Math.round((base.x + jitter(`${sal}|${lote.tipo}|jx`, lote.logradouro ? 0.02 : 0.16)) * 100) / 100,
        z: Math.round((base.z + jitter(`${sal}|${lote.tipo}|jz`, lote.logradouro ? 0.02 : 0.12)) * 100) / 100,
      },
      forma: amostrarForma(lote.tipo, `${sal}|${lote.tipo}|forma`),
    });
  }

  // A ruela dos cottages (fileira própria à morfologia).
  const ruela = ruelaDaMorfologia(morfologia);
  const nCottages = ruela.minimo + (hashString(`${sal}|cottages|n`) % (ruela.maximo - ruela.minimo + 1));
  for (let i = 0; i < nCottages; i++) {
    const id = `cottage_${i + 1}`;
    predios.push({
      id,
      tipo: 'cottage',
      rotulo: `Cottage nº ${i + 1}`,
      quarteirao: ruela.quarteirao,
      pos: {
        x: Math.round((ruela.x0 + i * ruela.passo + jitter(`${sal}|${id}|jx`, 0.12)) * 100) / 100,
        z: Math.round((ruela.z + jitter(`${sal}|${id}|jz`, 0.14)) * 100) / 100,
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

  return { seed: salDaSeed(seed), morfologia, quarteiroes, predios, adjacencias, diorama };
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
