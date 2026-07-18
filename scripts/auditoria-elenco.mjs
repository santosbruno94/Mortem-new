// =====================================================================
// AUDITORIA ESTATÍSTICA DO ELENCO — item (a) dos dossiês de F1 da OS
// "Priors compostos, anti-tell estendido e expansão de variedade do
// elenco" (docs/os-priors-compostos-e-variedade-do-elenco.md §2).
//
// Ferramenta de BUILD TIME (nunca importada pelo runtime): reproduz por
// Monte Carlo determinístico o método do relatório de 18/07 — N elencos
// de 8 sobre seeds `auditoria_<i>`, usando os módulos REAIS do gerador
// (amostragem.js, vetores_psiquicos.js), sem cópia de lógica.
//
// Determinismo: as seeds são a série fixa `auditoria_0..N-1`; zero
// Math.random/Date.now. Rodar duas vezes produz o mesmo relatório.
//
// Uso: node scripts/auditoria-elenco.mjs [N]   (default 200000)
// =====================================================================

import { hashString } from '../src/logic/hash.js';
import { gerarElenco, sortearPonderado } from '../src/gerador/amostragem.js';
import { ARQUETIPOS } from '../src/gerador/arquetipos.js';
import {
  VETORES_PSIQUICOS,
  DEGRAU_PESO,
  MAGNITUDE_POR_DEGRAU,
  LIMIAR_DESENCAIXE,
  derivarPsiqueDoCaso,
} from '../src/gerador/vetores_psiquicos.js';

const N = Number(process.argv[2]) || 200000;
const IDS = Object.keys(ARQUETIPOS);
const VETS = Object.keys(VETORES_PSIQUICOS);

// Peso de vítima por classe — cópia declarada da tabela de caso.js (o
// módulo não a exporta; manter em sincronia é responsabilidade da
// auditoria, não do gerador).
const PESO_VITIMA_POR_CLASSE = {
  gentry: 5, comerciante: 4, profissional: 3, clero: 2,
  artesao: 2, lavrador: 1, criadagem: 1, servico_do_condado: 1,
};

const pct = (x, d = 1) => `${(100 * x).toFixed(d)}%`;
const media = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

// ---------------------------------------------------------------------
// PARTE ANALÍTICA (independe do Monte Carlo)
// ---------------------------------------------------------------------

console.log('=====================================================================');
console.log(`AUDITORIA DO ELENCO — estado atual, ${N} elencos (seeds auditoria_*)`);
console.log('=====================================================================\n');

console.log('--- A. Norma N1 (§3.2 da OS): zeros nos extremos de INT/WIS/CHA ---');
console.log('(bandas 1–2 e 4–5 com peso 0 = quadrante inalcançável; FOR isento)\n');
for (const id of IDS) {
  const a = ARQUETIPOS[id];
  const violacoes = [];
  for (const attr of ['INT', 'WIS', 'CHA']) {
    const p = a.priors[attr];
    const baixa = p[0] + p[1];
    const alta = p[3] + p[4];
    if (baixa === 0) violacoes.push(`${attr}: banda 1–2 zerada [${p}]`);
    if (alta === 0) violacoes.push(`${attr}: banda 4–5 zerada [${p}]`);
    if (p[4] === 0) violacoes.push(`${attr}: valor 5 impossível [${p}]`);
    if (p[0] === 0) violacoes.push(`${attr}: valor 1 impossível [${p}]`);
  }
  if (violacoes.length) console.log(`  ${id}: ${violacoes.join('; ')}`);
}

console.log('\n--- B. Matriz de afinidade: degraus raros por arquétipo (réu → móbil íntimo) ---\n');
for (const id of IDS) {
  const raras = VETS.filter((v) => VETORES_PSIQUICOS[v].afinidadeDemografica[id] === 'rara');
  const pesoTotal = VETS.reduce(
    (s, v) => s + DEGRAU_PESO[VETORES_PSIQUICOS[v].afinidadeDemografica[id] ?? 'media'], 0
  );
  const pNato = raras.length * DEGRAU_PESO.rara / pesoTotal;
  console.log(
    `  ${id.padEnd(11)} raras: ${String(raras.length)} [${raras.join(', ')}]  P(destoante nato)=${pct(pNato)}`
  );
}

// ---------------------------------------------------------------------
// MONTE CARLO
// ---------------------------------------------------------------------

const compArquetipo = Object.fromEntries(IDS.map((k) => [k, 0]));
const presenca = Object.fromEntries(IDS.map((k) => [k, 0]));
const generoTotal = { masculino: 0, feminino: 0 };
const quadrantes = Object.fromEntries(
  IDS.map((k) => [k, { altoAlto: 0, altoBaixo: 0, baixoAlto: 0, baixoBaixo: 0, n: 0 }])
);
const distTraits = { um: 0, dois: 0 };
const prenomesVistos = new Map();
const sobrenomesVistos = new Map();
let paresNomeSobrenome = new Set();
let sobrenomeRepetidoNoElenco = 0;

// psique / caso
let casos = 0;
let reuForcado = 0;
let iscaForcada = 0;
let destoantesNatosTotais = [];
let mentiuComCalma = 0;
let omiteDecoro = 0, naoAssassinos = 0;
const reuVetorPorArquetipo = {};
const reuPorArquetipo = Object.fromEntries(IDS.map((k) => [k, 0]));

for (let i = 0; i < N; i++) {
  const seed = `auditoria_${i}`;
  const elenco = gerarElenco(seed, 8);

  const contagem = {};
  const sobrenomesElenco = new Map();
  for (const p of elenco) {
    compArquetipo[p.arquetipo]++;
    contagem[p.arquetipo] = (contagem[p.arquetipo] || 0) + 1;
    generoTotal[p.genero]++;
    const q = quadrantes[p.arquetipo];
    q.n++;
    if (p.atributos.INT >= 4 && p.atributos.WIS >= 4) q.altoAlto++;
    else if (p.atributos.INT >= 4 && p.atributos.WIS <= 2) q.altoBaixo++;
    else if (p.atributos.INT <= 2 && p.atributos.WIS >= 4) q.baixoAlto++;
    else if (p.atributos.INT <= 2 && p.atributos.WIS <= 2) q.baixoBaixo++;
    if (p.traits.length >= 2) distTraits.dois++; else distTraits.um++;
    const [pre, ...resto] = p.nome.split(' ');
    const sob = resto.join(' ');
    prenomesVistos.set(pre, (prenomesVistos.get(pre) || 0) + 1);
    sobrenomesVistos.set(sob, (sobrenomesVistos.get(sob) || 0) + 1);
    sobrenomesElenco.set(sob, (sobrenomesElenco.get(sob) || 0) + 1);
    if (i < 2000) paresNomeSobrenome.add(p.nome);
  }
  for (const k of Object.keys(contagem)) presenca[k]++;
  if ([...sobrenomesElenco.values()].some((c) => c >= 2)) sobrenomeRepetidoNoElenco++;

  // Seleção mínima de vítima/assassino (via premeditada de caso.js §2–3;
  // a briga escalada exige rotina espacial — fora do escopo da auditoria).
  const vitimaId = sortearPonderado(
    elenco.map((p) => ({ valor: p.id, peso: PESO_VITIMA_POR_CLASSE[p.classeSocial] ?? 1 })),
    `${seed}|caso|vitima`
  );
  const vitima = elenco.find((p) => p.id === vitimaId);
  const candidatos = elenco.filter((p) => p.id !== vitima.id);
  const assassino = candidatos[hashString(`${seed}|caso|assassino`) % candidatos.length];

  const psique = derivarPsiqueDoCaso({
    seed, elenco, assassinoId: assassino.id, vitimaId: vitima.id,
    cenario: 'premeditado', coabitantesVitimaIds: [],
  });
  casos++;
  reuPorArquetipo[assassino.arquetipo]++;
  const reamostrouReu = psique.log.reamostragens.some((r) => r.motivo === 'reu_sob_limiar');
  const reamostrouIsca = psique.log.reamostragens.some((r) => r.motivo === 'falso_destoante');
  if (reamostrouReu) reuForcado++;
  if (reamostrouIsca) iscaForcada++;

  const vetReu = psique.log.porPessoa[assassino.id].vetorId;
  reuVetorPorArquetipo[assassino.arquetipo] = reuVetorPorArquetipo[assassino.arquetipo] || {};
  reuVetorPorArquetipo[assassino.arquetipo][vetReu] =
    (reuVetorPorArquetipo[assassino.arquetipo][vetReu] || 0) + 1;

  // destoantes natos ENTRE INOCENTES (pré-forçamento não é observável aqui;
  // aproximamos: natos = destoantes finais menos o forçado, se houve)
  const inocentes = elenco.filter((p) => p.id !== assassino.id && p.id !== vitima.id);
  let natos = 0;
  for (const p of inocentes) {
    if (psique.log.porPessoa[p.id].magnitude >= LIMIAR_DESENCAIXE) natos++;
  }
  if (reamostrouIsca) natos -= 1;
  destoantesNatosTotais.push(natos);

  const flagsReu = psique.consequencias.porPessoa[assassino.id].flags;
  if (flagsReu.includes('mente_com_calma')) mentiuComCalma++;
  for (const p of inocentes) {
    naoAssassinos++;
    if (psique.consequencias.porPessoa[p.id].flags.includes('omite_por_decoro')) omiteDecoro++;
  }
}

console.log('\n--- C. Composição do elenco (Tabela 1 regenerada) ---\n');
console.log('  arquétipo    média/elenco   presença em ≥1 vaga');
for (const id of IDS) {
  console.log(
    `  ${id.padEnd(11)}  ${(compArquetipo[id] / N).toFixed(2).padStart(6)}        ${pct(presenca[id] / N)}`
  );
}
console.log(`\n  gênero: masculino ${pct(generoTotal.masculino / (N * 8))} × feminino ${pct(generoTotal.feminino / (N * 8))}`);

console.log('\n--- D. Quadrantes INT × WIS por arquétipo (alcançados no MC) ---');
console.log('  (altoAlto = INT≥4 & WIS≥4; 0,0% = quadrante morto)\n');
for (const id of IDS) {
  const q = quadrantes[id];
  if (!q.n) continue;
  console.log(
    `  ${id.padEnd(11)} n=${String(q.n).padStart(7)}  A/A ${pct(q.altoAlto / q.n).padStart(6)}  A/B ${pct(q.altoBaixo / q.n).padStart(6)}  B/A ${pct(q.baixoAlto / q.n).padStart(6)}  B/B ${pct(q.baixoBaixo / q.n).padStart(6)}`
  );
}

console.log('\n--- E. Traits, nomes ---\n');
console.log(`  segundo trait: ${pct(distTraits.dois / (N * 8))} (alvo do código: ~33% quando o pool comporta)`);
console.log(`  prenomes distintos usados: ${prenomesVistos.size}; sobrenomes distintos: ${sobrenomesVistos.size}`);
const topPre = [...prenomesVistos.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
console.log(`  top-5 prenomes (ponderado por frequência desde F4): ${topPre.map(([n, c]) => `${n} ${pct(c / (N * 8))}`).join(', ')}`);
console.log(`  elencos com sobrenome repetido internamente: ${pct(sobrenomeRepetidoNoElenco / N)}`);
console.log(`  pares nome+sobrenome distintos nos primeiros 2000 elencos: ${paresNomeSobrenome.size} de ${2000 * 8}`);

console.log('\n--- F. Psique do caso (via premeditada; vítima por classe, réu uniforme) ---\n');
console.log(`  casos auditados: ${casos}`);
console.log(`  réu FORÇADO ao desencaixe (não era destoante nato): ${pct(reuForcado / casos)}`);
console.log(`  isca FORÇADA (nenhum inocente destoante nato): ${pct(iscaForcada / casos)}`);
console.log(`  destoantes natos por caso (entre ~6 inocentes): média ${media(destoantesNatosTotais).toFixed(2)}`);
const dist = {};
for (const d of destoantesNatosTotais) dist[d] = (dist[d] || 0) + 1;
console.log(`  distribuição: ${Object.entries(dist).sort().map(([k, v]) => `${k}: ${pct(v / casos)}`).join('  ')}`);
console.log(`  mente_com_calma no réu: ${pct(mentiuComCalma / casos)} (desde F3: acoplada ao cenário — aqui tudo premeditado, alvo 2/6)`);
console.log(`  omite_por_decoro em não-assassinos: ${pct(omiteDecoro / naoAssassinos)} (desde F3: passiva 1/2 × decoro por classe)`);

console.log('\n--- G. Mapa ofício-do-réu → vetor do réu (a quase-determinização) ---\n');
for (const id of IDS) {
  const m = reuVetorPorArquetipo[id];
  if (!m) continue;
  const total = Object.values(m).reduce((a, b) => a + b, 0);
  const linhas = Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => `${v} ${pct(c / total)}`)
    .join(', ');
  console.log(`  ${id.padEnd(11)} (réu em ${reuPorArquetipo[id]} casos): ${linhas}`);
}

console.log('\n=== fim da auditoria ===');
