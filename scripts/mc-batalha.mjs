// =====================================================================
// MC-BATALHA — Monte Carlo do confronto (OS "Autobattler v2" B0/§6).
//
// Executar: node scripts/mc-batalha.mjs [N]   (padrão 20000; o parecer
// B0 e as guardas GB8/B5 rodam 200000)
//
// Gera N casos brutos (gerarCasoBruto — o nível do RegistroDoCrime; a
// fatia forense entra só para a checagem de cartas) e imprime a linha
// de base do confronto que o parecer B0 consome e que as bandas D3
// medirão depois da reescrita:
//   • batalha suprimida (veneno) × travada; desespero; rodadas da aceita;
//   • reamostragem: tentativas médias e motivos de rejeição;
//   • ação da vítima realizada (fuga × resistir), evidenciada × inerte;
//   • grito rolado × ouvido; mobília revirada;
//   • réu ferido: fração com ferimento do assassino e cobertura da única
//     via observável de hoje (a carta gen_sangue_alheio — respingo de
//     CENA; nenhum observável no CORPO do réu existe no v1);
//   • recortes por método e por palco (interno × logradouro).
//
// Build time puro (nunca importado pelo runtime). Determinístico: seeds
// mc_1..mc_N — reexecutar reproduz byte a byte. (Date.now só cronometra
// a impressão de progresso, como no relatorio-espacial.mjs — nada do
// resultado depende dele.)
// =====================================================================

import { gerarCasoBruto } from '../src/gerador/caso.js';

const N = Number(process.argv[2] || 20000);

const conta = (obj, chave, inc = 1) => { obj[chave] = (obj[chave] || 0) + inc; };
const pct = (x, total) => (total > 0 ? `${((100 * x) / total).toFixed(1)}%` : '—');
const media = (soma, n) => (n > 0 ? (soma / n).toFixed(2) : '—');

const t = {
  casos: 0,
  suprimidas: 0,          // veneno/láudano: sem batalha
  travadas: 0,            // batalhas de fato
  desespero: 0,
  rodadasAceita: 0,       // soma (só travadas)
  tentativas: 0,          // soma de tentativaAceita (só travadas)
  motivosRejeicao: {},    // agregado sobre todas as tentativasDescartadas
  casosComRejeicao: 0,
  fugaRealizada: 0,       // acao_vitima='fugir' (evidenciada OU inerte)
  fugaEvidenciada: 0,
  gritoRolado: 0,         // vestígio grito_ouvido OU inerte 'grito'
  gritoOuvido: 0,
  mobiliaCasos: 0,        // casos com ≥1 peça revirada
  mobiliaPecas: 0,
  ferimVitima: 0,         // soma (só travadas)
  reuFerido: 0,           // ferimentos do assassino > 0 na batalha aceita
  reuFeridoSemCarta: 0,   // ... e sem gen_sangue_alheio na fatia forense
  reuFeridoDesespero: 0,
  porMetodo: {},          // metodoId -> { n, desespero, fuga, tentativas }
  porPalco: {},           // interno|logradouro|pousada -> { n, fuga, escapou }
  inertes: {},            // variaveisInertes por rótulo-raiz
};

const t0 = Date.now();
for (let i = 1; i <= N; i++) {
  const seed = `mc_${i}`;
  const bruto = gerarCasoBruto(seed);
  const crime = bruto.crime;
  const { batalha, variaveis, vestigios, metadados } = crime;
  t.casos += 1;

  const p = bruto.escolha.palco;
  const palco = p.externo ? 'logradouro' : p.pousada ? 'pousada' : 'interno';
  t.porPalco[palco] = t.porPalco[palco] || { n: 0, fuga: 0, escapou: 0 };
  t.porPalco[palco].n += 1;

  for (const rotulo of metadados.variaveisInertes) conta(t.inertes, rotulo.split(' ')[0]);

  if (batalha.suprimida) {
    t.suprimidas += 1;
    continue;
  }
  t.travadas += 1;
  t.rodadasAceita += batalha.rodadas;
  t.tentativas += batalha.tentativaAceita;
  if (batalha.desespero) t.desespero += 1;
  if (batalha.tentativasDescartadas.length > 0) t.casosComRejeicao += 1;
  for (const d of batalha.tentativasDescartadas) {
    conta(t.motivosRejeicao, d.motivo);
    if (d.motivo === 'vitima_escapou') t.porPalco[palco].escapou += 1;
  }

  const m = t.porMetodo[bruto.escolha.metodoId] || (t.porMetodo[bruto.escolha.metodoId] = { n: 0, desespero: 0, fuga: 0, tentativas: 0 });
  m.n += 1;
  m.tentativas += batalha.tentativaAceita;
  if (batalha.desespero) m.desespero += 1;

  // Fuga realizada: evidenciada (variaveis) ou órfã (variaveisInertes).
  const fugiu = variaveis.acao_vitima === 'fugir' || metadados.variaveisInertes.includes('acao_vitima');
  if (fugiu) {
    t.fugaRealizada += 1;
    m.fuga += 1;
    t.porPalco[palco].fuga += 1;
    if (variaveis.acao_vitima === 'fugir') t.fugaEvidenciada += 1;
  }

  // Grito: rolou (vestígio ou inerte) × foi ouvido (vestígio).
  const gritoVest = vestigios.some((v) => v.classe === 'grito_ouvido');
  const gritoInerte = metadados.variaveisInertes.some((x) => x.startsWith('grito'));
  if (gritoVest || gritoInerte) t.gritoRolado += 1;
  if (gritoVest) t.gritoOuvido += 1;

  // Mobília revirada (inclui a que a higiene recompôs — o evento existiu).
  const pecas = vestigios.filter((v) => v.classe === 'mobilia_revirada').length;
  if (pecas > 0) { t.mobiliaCasos += 1; t.mobiliaPecas += pecas; }

  if (typeof variaveis.ferimentos_vitima === 'number') t.ferimVitima += variaveis.ferimentos_vitima;

  // Réu ferido (a remedição do B0): a batalha aceita feriu o assassino?
  // Única via observável no v1: o respingo de CENA (sangue_alheio →
  // carta gen_sangue_alheio). NENHUM observável no corpo do réu existe.
  const reuFerido = typeof variaveis.ferimentos_assassino === 'number' && variaveis.ferimentos_assassino > 0;
  if (reuFerido) {
    t.reuFerido += 1;
    if (batalha.desespero) t.reuFeridoDesespero += 1;
    const temCarta = bruto.fatiaForense.cartas.some((c) => c.id === 'gen_sangue_alheio');
    if (!temCarta) t.reuFeridoSemCarta += 1;
  }

  if (i % 20000 === 0)
    console.error(`… ${i}/${N} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}

const dt = ((Date.now() - t0) / 1000).toFixed(0);
console.log(`\n=== MC-BATALHA — ${N} casos em ${dt}s (seeds mc_1..mc_${N}) ===`);

console.log('\n— População —');
console.log(`  casos: ${t.casos}; batalha suprimida (veneno): ${t.suprimidas} (${pct(t.suprimidas, t.casos)}); travadas: ${t.travadas}`);

console.log('\n— Desfecho da batalha (sobre as travadas) —');
console.log(`  desespero: ${t.desespero} (${pct(t.desespero, t.travadas)})`);
console.log(`  rodadas da aceita (média): ${media(t.rodadasAceita, t.travadas)}`);
console.log(`  ferimentos da vítima (média): ${media(t.ferimVitima, t.travadas)}`);

console.log('\n— Reamostragem por rejeição —');
console.log(`  tentativas até aceitar (média): ${media(t.tentativas, t.travadas)}`);
console.log(`  casos com ≥1 rejeição: ${t.casosComRejeicao} (${pct(t.casosComRejeicao, t.travadas)})`);
for (const [k, v] of Object.entries(t.motivosRejeicao).sort((a, b) => b[1] - a[1]))
  console.log(`  motivo ${k}: ${v} rejeições`);

console.log('\n— Ação da vítima —');
console.log(`  fuga realizada: ${t.fugaRealizada} (${pct(t.fugaRealizada, t.travadas)}); evidenciada: ${t.fugaEvidenciada} (${pct(t.fugaEvidenciada, t.travadas)})`);
console.log(`  grito rolado: ${t.gritoRolado} (${pct(t.gritoRolado, t.travadas)}); ouvido: ${t.gritoOuvido} (${pct(t.gritoOuvido, t.travadas)})`);

console.log('\n— Ambiente —');
console.log(`  casos com mobília revirada: ${t.mobiliaCasos} (${pct(t.mobiliaCasos, t.travadas)}); peças/caso com dano: ${media(t.mobiliaPecas, t.mobiliaCasos)}`);

console.log('\n— Réu ferido (a remedição) —');
console.log(`  batalhas aceitas que feriram o assassino: ${t.reuFerido} (${pct(t.reuFerido, t.travadas)}; ${t.reuFeridoDesespero} em desespero)`);
console.log(`  … sem a carta gen_sangue_alheio (cena): ${t.reuFeridoSemCarta} (${pct(t.reuFeridoSemCarta, t.reuFerido)})`);
console.log(`  … com observável no CORPO do réu: 0 (0.0%) — a classe não existe no v1`);

console.log('\n— Por método (n · desespero · fuga · tentativas médias) —');
for (const [k, m] of Object.entries(t.porMetodo).sort((a, b) => b[1].n - a[1].n))
  console.log(`  ${k}: ${m.n} · ${pct(m.desespero, m.n)} · ${pct(m.fuga, m.n)} · ${media(m.tentativas, m.n)}`);

console.log('\n— Por palco (n · fuga da vítima · rejeições vitima_escapou) —');
for (const [k, m] of Object.entries(t.porPalco))
  console.log(`  ${k}: ${m.n} · ${pct(m.fuga, m.n)} · ${m.escapou}`);

console.log('\n— Variáveis inertes (regra de existência; por raiz) —');
for (const [k, v] of Object.entries(t.inertes).sort((a, b) => b[1] - a[1]))
  console.log(`  ${k}: ${v}`);
