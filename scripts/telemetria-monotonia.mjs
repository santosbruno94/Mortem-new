// =====================================================================
// TELEMETRIA DA MONOTONIA — OS Prosa Viva, Fase 0 (relatório de mesa).
//
// Executar:
//   node scripts/telemetria-monotonia.mjs            → mede os 31 casos embarcados
//   node scripts/telemetria-monotonia.mjs 20000      → + amostra o gerador (teto do pool)
//   node scripts/telemetria-monotonia.mjs --verbose  → mostra o esqueleto mais repetido
//
// O núcleo da medição vive em scripts/lib/monotonia.mjs (compartilhado com a
// guarda anti-regressão do qa.mjs). Aqui fica só a apresentação. Ver o
// relatório e o método em docs/os-prosa-viva-fase-0-telemetria.md.
//
// Build time puro: jamais importado pelo runtime. Só LÊ os casos embarcados.
// =====================================================================

import { CASO_REPLICA, CASOS_POOL, CASOS_LUTA } from '../src/data/casos_gerados.js';
import { medir, extrairSuperficies, construirMascara, guardaMonotonia } from './lib/monotonia.mjs';

const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const N_AMOSTRA = Number(args.find((a) => /^\d+$/.test(a)) || 0);

const CASOS = [CASO_REPLICA, ...CASOS_POOL, ...CASOS_LUTA];

function classificar(reusoMedio) {
  if (reusoMedio >= 12) return 'MUITO REPETIDO';
  if (reusoMedio >= 5) return 'repetido';
  if (reusoMedio >= 2.5) return 'moderado';
  return 'variado';
}

const MIN_INST = 3;

function imprimirTabela(titulo, { linhas, totalTextos }, nCasos) {
  const principais = linhas.filter((l) => l.instancias >= MIN_INST);
  const cauda = linhas.length - principais.length;
  console.log(`\n${'='.repeat(90)}`);
  console.log(`${titulo}  (${nCasos} casos · ${totalTextos} textos medidos)`);
  console.log('='.repeat(90));
  console.log(
    'SUPERFÍCIE'.padEnd(26) +
    'slots'.padStart(7) +
    'inst'.padStart(9) +
    'dist'.padStart(7) +
    'var/slot'.padStart(10) +
    'pior'.padStart(6) +
    'reúso'.padStart(9) +
    '  diagnóstico'
  );
  console.log('-'.repeat(90));
  for (const l of principais) {
    console.log(
      l.superficie.padEnd(26) +
      String(l.slots).padStart(7) +
      String(l.instancias).padStart(9) +
      String(l.distintas).padStart(7) +
      l.varPorSlot.toFixed(1).padStart(10) +
      String(l.piorSlot).padStart(6) +
      l.reusoMedio.toFixed(1).padStart(9) +
      '  ' + classificar(l.reusoMedio)
    );
    if (verbose && l.reusoMedio >= 5) {
      const amostra = l.topEsq.length > 100 ? l.topEsq.slice(0, 100) + '…' : l.topEsq;
      console.log('    ↳ esqueleto campeão (' + l.reusoMax + '×): ' + amostra);
    }
  }
  console.log('-'.repeat(90));
  console.log(`(+${cauda} superfícies de cauda com <${MIN_INST} instâncias — baixa exposição, omitidas)`);
  console.log('Colunas: pior = variantes no slot mais congelado · reúso = instâncias ÷ distintas.');
}

function detalharAbertura(casos) {
  const porPasso = new Map();
  for (const caso of casos) {
    const mascarar = construirMascara(caso);
    for (const passo of caso.abertura?.passos || []) {
      const esq = mascarar((passo.paragrafos || []).join(' '));
      if (!porPasso.has(passo.id)) porPasso.set(passo.id, new Map());
      const m = porPasso.get(passo.id);
      m.set(esq, (m.get(esq) || 0) + 1);
    }
  }
  console.log(`\n${'-'.repeat(90)}`);
  console.log('DETALHE — a abertura passo a passo (E1):');
  for (const [passo, m] of porPasso) {
    const distintas = m.size;
    const reusoMax = Math.max(...m.values());
    const tag = distintas === 1 ? 'CONGELADO (todo caso lê igual)' : `${distintas} variantes de esqueleto`;
    console.log(`  ${passo.padEnd(14)} ${String(distintas).padStart(2)} dist · campeão ${reusoMax}× · ${tag}`);
  }
}

console.log('\nTELEMETRIA DA MONOTONIA — OS Prosa Viva');
console.log('Legenda: var/slot = esqueletos distintos por slot (≈1 = molde único).');
console.log('         reúso = instâncias ÷ distintas (quantas vezes cada frase é relida).');

const embarcados = medir(CASOS);
imprimirTabela('CASOS EMBARCADOS (o que o jogador de fato recebe)', embarcados, CASOS.length);
detalharAbertura(CASOS);

// Guarda anti-monotonia (E5): o mesmo piso que o qa.mjs trava.
const g = guardaMonotonia(embarcados.linhas);
console.log(`\n${'-'.repeat(90)}`);
console.log(`GUARDA ANTI-MONOTONIA (E5): ${g.ok ? 'VERDE' : 'REPROVA'} — ${g.pisos} pisos de superfície (E1–E4).`);
if (!g.ok) g.violacoes.forEach((v) => console.log('  ✖ ' + v));

if (N_AMOSTRA > 0) {
  console.log(`\n… gerando ${N_AMOSTRA} casos para medir o teto do pool (aguarde) …`);
  const { montarPacoteGerado } = await import('../src/gerador/pacote_gerado.js');
  const amostra = [];
  for (let i = 1; i <= N_AMOSTRA; i++) amostra.push(montarPacoteGerado(`mc_${i}`));
  imprimirTabela(`TETO DO POOL (amostra de ${N_AMOSTRA} casos do gerador)`, medir(amostra), N_AMOSTRA);
  console.log('\nLeitura da 2ª tabela: teto baixo = banco raso na fonte (escrever mais);');
  console.log('teto alto mas embarcados baixos = faltou sorteio (decorrelação, E5).');
}

console.log('');
