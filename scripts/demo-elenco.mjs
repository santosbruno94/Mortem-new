// =====================================================================
// DEMONSTRAÇÃO DE ELENCO (FASE 1 do gerador por simulação).
//
// Imprime, legível, o elenco que o gerador amostra para uma seed — a
// inspeção de plausibilidade do portão da fase ("3 seeds → 3 elencos
// distintos e plausíveis"). Nada aqui entra no jogo: é vitrine do
// build time.
//
// Uso:
//   npm run demo:elenco                → as 3 seeds padrão do QA
//   node scripts/demo-elenco.mjs xyz   → só a seed "xyz"
// =====================================================================

import { gerarElenco } from '../src/gerador/amostragem.js';
import { ARQUETIPOS, MOTIVOS_POTENCIAIS } from '../src/gerador/arquetipos.js';
import { CATALOGO_COMPORTAMENTOS, TRAITS } from '../src/gerador/comportamentos.js';

const CLASSES_LEGIVEIS = {
  gentry: 'gentry',
  clero: 'clero',
  profissional: 'profissional',
  comerciante: 'comerciante',
  artesao: 'artesão',
  lavrador: 'lavrador',
  criadagem: 'criadagem',
  servico_do_condado: 'serviço do condado',
};

const seeds = process.argv[2]
  ? [process.argv[2]]
  : ['a_hora_emprestada', 'vila_do_moinho', 'caso_do_charco'];

for (const seed of seeds) {
  const elenco = gerarElenco(seed, 8);
  console.log(`\n=== ELENCO DA SEED "${seed}" (${elenco.length} personagens) ===`);
  elenco.forEach((p, i) => {
    const a = p.atributos;
    const tracos = p.traits.map((t) => `${t.replace(/_/g, ' ')} (${TRAITS[t].descricao.toLowerCase()})`);
    const comportamentos = p.comportamentos.map((c) => CATALOGO_COMPORTAMENTOS[c].descricao);
    console.log(
      `\n${i + 1}. ${p.nome}, ${p.idade} anos — ${p.profissao} (${CLASSES_LEGIVEIS[p.classeSocial]})`
    );
    console.log(`   FOR ${a.FOR} · INT ${a.INT} · WIS ${a.WIS} · CHA ${a.CHA}`);
    console.log(`   traços: ${tracos.join('; ')}`);
    console.log(`   motivo latente: ${MOTIVOS_POTENCIAIS[p.motivoPotencial].descricao}`);
    console.log(
      comportamentos.length
        ? `   no depoimento: ${comportamentos.join(' | ')}`
        : '   no depoimento: sem viés marcado (atributos medianos)'
    );
  });
  const unicos = elenco.filter((p) => ARQUETIPOS[p.arquetipo].unicoNaVila).length;
  console.log(`\n   [${unicos} personagem(ns) de arquétipo único-na-vila neste elenco]`);
}
console.log('');
