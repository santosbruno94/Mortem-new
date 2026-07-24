// =====================================================================
// RELATÓRIO ESPACIAL — Monte Carlo da OS "Palco em anéis" (E4 §5.2).
//
// Executar: node scripts/relatorio-espacial.mjs [N]   (padrão 200000)
//
// Gera N pacotes COMPLETOS (montarPacoteGerado — o nível que o jogador
// recebe; os fallbacks e gates de apresentação contam de verdade) e
// imprime as distribuições que o relatório espacial v1 consome:
//   • regime-palco REALIZADO (interno / logradouro / pousada), com as
//     vias (rotina × chamariz) e os tipos de logradouro;
//   • conjunta palco × regime-magnitude (as duas moedas são ortogonais
//     por desenho — a conjunta prova que nenhuma célula degenera);
//   • famílias de método por palco (GE5 em população);
//   • descoberta e IPM à chegada no palco externo;
//   • funções de satélite REALIZADAS (sem nó / penhor / ausência /
//     móbil / origem) e a fração corroborativa (GE9 em população);
//   • pontos de ambiência da cena (GE2 em população);
//   • cenário × palco.
//
// Build time puro (nunca importado pelo runtime). Determinístico: seeds
// mc_1..mc_N — reexecutar reproduz byte a byte.
// =====================================================================

import { montarPacoteGerado } from '../src/gerador/pacote_gerado.js';
import { gerarCasoBruto } from '../src/gerador/caso.js';
import { FAMILIA_DO_METODO } from './lib/familias.mjs';

const N = Number(process.argv[2] || 200000);


const conta = (obj, chave) => { obj[chave] = (obj[chave] || 0) + 1; };
const pct = (x, total) => `${((100 * x) / total).toFixed(1)}%`;

const t = {
  palco: {}, via: {}, tipoLog: {}, cenario: {}, conjunta: {},
  famPorPalco: {}, comarca: {}, ipmExterno: {}, horaDescoberta: {},
  pontos: { total: 0, semCarta: 0 }, engodo: {}, magnitude: {},
};

const t0 = Date.now();
for (let i = 1; i <= N; i++) {
  const seed = `mc_${i}`;
  const bruto = gerarCasoBruto(seed);
  const pacote = montarPacoteGerado(seed);

  const p = bruto.escolha.palco;
  const palco = p.externo ? 'logradouro' : p.pousada ? 'pousada' : 'interno';
  conta(t.palco, palco);
  conta(t.cenario, `${palco}|${bruto.escolha.cenario}`);
  const regime = bruto.psique.log.regime;
  conta(t.magnitude, `r${regime}`);
  conta(t.conjunta, `${palco}|r${regime}`);
  conta(t.famPorPalco, `${palco}|${FAMILIA_DO_METODO[bruto.escolha.metodoId] || bruto.escolha.metodoId}`);

  if (p.externo) {
    conta(t.via, p.via);
    conta(t.tipoLog, p.logradouroId);
    const ipm = p.descoberta.chegadaPerito - bruto.escolha.hora;
    conta(t.ipmExterno, `${Math.floor(ipm / 2) * 2}–${Math.floor(ipm / 2) * 2 + 2}h`);
    conta(t.horaDescoberta, `${Math.floor(p.descoberta.hora)}h`);
    if (p.chamariz) conta(t.engodo, p.chamariz.engodo);
  }

  // Funções de satélite REALIZADAS (o que o pacote entrega, gates inclusos).
  const noComarca = pacote.nosMapa.some((no) => no.id.startsWith('comarca_'));
  if (!noComarca) conta(t.comarca, 'sem_no');
  else if (pacote.cartas.some((c) => c.id === 'gen_papeis_forasteiro')) conta(t.comarca, 'origem');
  else if (pacote.leads.some((l) => l.cartaId.startsWith('gen_alibi_'))) conta(t.comarca, 'ausencia');
  else if (pacote.cartas.some((c) => c.id === 'gen_recibo_comarca')) conta(t.comarca, 'penhor');
  else conta(t.comarca, 'mobil');

  // GE2 em população: pontos de ambiência da cena.
  const cena = pacote.localidades.find((l) => l.id === 'cena');
  for (const pt of cena.pontos) {
    t.pontos.total += 1;
    if (!pt.prosa.some((x) => x.includes('[['))) t.pontos.semCarta += 1;
  }

  if (i % 20000 === 0)
    console.error(`… ${i}/${N} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}

const dt = ((Date.now() - t0) / 1000).toFixed(0);
console.log(`\n=== RELATÓRIO ESPACIAL — ${N} casos em ${dt}s (seeds mc_1..mc_${N}) ===`);

console.log('\n— Regime de palco REALIZADO —');
for (const [k, v] of Object.entries(t.palco)) console.log(`  ${k}: ${v} (${pct(v, N)})`);
console.log('\n— Vias do palco externo —');
for (const [k, v] of Object.entries(t.via)) console.log(`  ${k}: ${v} (${pct(v, t.palco.logradouro || 1)})`);
console.log('\n— Tipos de logradouro —');
for (const [k, v] of Object.entries(t.tipoLog)) console.log(`  ${k}: ${v} (${pct(v, t.palco.logradouro || 1)})`);
console.log('\n— Engodo do chamariz —');
for (const [k, v] of Object.entries(t.engodo)) console.log(`  ${k}: ${v}`);
console.log('\n— Cenário × palco —');
for (const [k, v] of Object.entries(t.cenario).sort()) console.log(`  ${k}: ${v} (${pct(v, N)})`);
console.log('\n— Regime de magnitude —');
for (const [k, v] of Object.entries(t.magnitude)) console.log(`  ${k}: ${v} (${pct(v, N)})`);
console.log('\n— Conjunta palco × magnitude —');
for (const [k, v] of Object.entries(t.conjunta).sort()) console.log(`  ${k}: ${v} (${pct(v, N)})`);
console.log('\n— Famílias de método por palco —');
for (const [k, v] of Object.entries(t.famPorPalco).sort()) {
  const palcoK = k.split('|')[0];
  console.log(`  ${k}: ${v} (${pct(v, t.palco[palcoK])} do palco)`);
}
console.log('\n— Descoberta externa (hora cheia) —');
for (const [k, v] of Object.entries(t.horaDescoberta).sort()) console.log(`  ${k}: ${v}`);
console.log('\n— IPM à chegada, palco externo (faixas de 2h) —');
for (const [k, v] of Object.entries(t.ipmExterno).sort((a, b) => parseInt(a[0]) - parseInt(b[0])))
  console.log(`  ${k}: ${v}`);
console.log('\n— Funções de satélite REALIZADAS —');
const comNo = N - (t.comarca.sem_no || 0);
for (const [k, v] of Object.entries(t.comarca))
  console.log(`  ${k}: ${v} (${pct(v, N)} dos casos${k === 'sem_no' ? '' : `; ${pct(v, comNo)} dos com nó`})`);
const corroborativas = (t.comarca.penhor || 0) + (t.comarca.ausencia || 0) + (t.comarca.origem || 0);
console.log(`  → corroborativas (penhor+ausência+origem): ${pct(corroborativas, comNo)} dos com nó (GE9)`);
console.log('\n— Pontos da cena (GE2 em população) —');
console.log(`  pontos: ${t.pontos.total}; sem carta: ${t.pontos.semCarta} (${pct(t.pontos.semCarta, t.pontos.total)})`);
