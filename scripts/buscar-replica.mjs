// =====================================================================
// BUSCA DE SEED DA RÉPLICA DIRIGIDA — OS autobattler v2, B3.4 (GB7/D5).
//
// O v2 quebrou o replay das batalhas (finalidade declarada da OS); o
// contrato de conteúdo manda a réplica ganhar NOVA seleção de seed
// entre ≥ 200 candidatas, pelo placar de IDENTIDADE DE FATOS (D5,
// herdando o precedente §4.8 da OS confronto + encenação por corpo):
// mesmo perfil de vilão, mesma família de método (dirigida), encenação
// equivalente, sem fuga (trava dirigida). A escolha final é do AUTOR
// (GB7) — este script só ordena e apresenta.
//
// Executar: node scripts/buscar-replica.mjs   (varre _1.._240)
// =====================================================================

import { gerarCasoBruto } from '../src/gerador/caso.js';
import { DIRIGIDO_REPLICA } from '../src/gerador/pacote_gerado.js';

const N = Number(process.argv[2] || 240);
const resultados = [];

for (let i = 1; i <= N; i++) {
  const seed = `a_hora_emprestada_replica_${i}`;
  let bruto;
  try {
    bruto = gerarCasoBruto(seed, { dirigido: DIRIGIDO_REPLICA });
  } catch {
    continue;
  }
  const { crime, mundo, escolha } = bruto;
  const reu = mundo.elenco.find((p) => p.id === crime.assassinoId);
  const vitima = mundo.elenco.find((p) => p.id === crime.vitimaId);
  const interior = mundo.interiores[escolha.localId];
  const comodoCorpo = interior.comodos.find((c) => c.id === crime.posicaoCorpo.comodo);

  // O placar de identidade de fatos (D5). Método/cenário/faixa/móbil já
  // vêm dirigidos; pontua o que a seed tem de dar por conta própria.
  let placar = 0;
  const criterios = [];
  const marca = (pts, ok, rotulo) => {
    if (ok) {
      placar += pts;
      criterios.push(rotulo);
    }
  };
  marca(3, crime.cenaEncenada === true, 'corpo movido');
  marca(2, reu.atributos.INT >= 4 && reu.atributos.WIS >= 4, 'quadrante INT4+/WIS4+ (Silas)');
  marca(2, escolha.hora === 21, 'morte às 21h');
  marca(2, ['loja', 'botica'].includes(comodoCorpo?.tipoComodo), 'corpo na loja');
  marca(1, !escolha.palco.externo && !escolha.palco.pousada, 'palco interno');
  marca(1, reu.genero === 'f', 'ré mulher (a criada)');
  marca(1, vitima.genero === 'm', 'vítima homem (o lojista)');
  marca(1, crime.variaveis.grito === undefined && crime.variaveis.acao_vitima !== 'fugir', 'sem fuga/grito (trava íntegra)');

  resultados.push({ seed, placar, criterios, metodo: escolha.metodoId, desespero: crime.batalha.desespero });
}

resultados.sort((a, b) => b.placar - a.placar || a.seed.localeCompare(b.seed));
console.log(`buscar-replica: ${resultados.length}/${N} candidatas geradas.`);
console.log('\nTop 8 pelo placar de identidade de fatos (D5):');
for (const r of resultados.slice(0, 8)) {
  console.log(`  ${r.seed} — ${r.placar} pt(s) [${r.criterios.join('; ')}]${r.desespero ? ' · DESESPERO' : ''}`);
}
const atual = resultados.find((r) => r.seed === 'a_hora_emprestada_replica_96');
console.log(`\nSeed vigente (_96): ${atual ? `${atual.placar} pt(s) [${atual.criterios.join('; ')}]` : 'não gerou'}`);
