// =====================================================================
// DEMONSTRAÇÃO DE CIDADE E INSERÇÃO (FASE 2 do gerador por simulação).
//
// Imprime, legível, o mundo que o gerador monta para uma seed: a cidade
// (quarteirões e prédios), a inserção do elenco (moradia, trabalho,
// rotina em três faixas), o grafo de avistamentos e os interiores dos
// locais elegíveis (mapa ASCII do grid). É a inspeção de plausibilidade
// do portão da fase ("3 seeds → 3 cidades distintas e plausíveis").
// Nada aqui entra no jogo: é vitrine do build time.
//
// Uso:
//   npm run demo:cidade                → as 3 seeds padrão do QA
//   node scripts/demo-cidade.mjs xyz   → só a seed "xyz"
// =====================================================================

import { gerarMundo } from '../src/gerador/mundo.js';

const seeds = process.argv[2]
  ? [process.argv[2]]
  : ['a_hora_emprestada', 'vila_do_moinho', 'caso_do_charco'];

// Mapa ASCII do interior: letra do cômodo por célula; '■' onde há mobília.
function asciiDoInterior(interior) {
  const letras = {};
  interior.comodos.forEach((c, i) => {
    letras[c.id] = String.fromCharCode(97 + i);
  });
  const linhas = [];
  for (let fila = 0; fila < interior.grid.filas; fila++) {
    let linha = '';
    for (let col = 0; col < interior.grid.colunas; col++) {
      const comodo = interior.comodos.find(
        (c) =>
          col >= c.ret.col && col < c.ret.col + c.ret.colunas && fila >= c.ret.fila && fila < c.ret.fila + c.ret.filas
      );
      const peca = interior.mobilia.some((m) => m.celula.col === col && m.celula.fila === fila);
      linha += peca ? '■' : comodo ? letras[comodo.id] : '·';
    }
    linhas.push(`      ${linha}`);
  }
  return linhas.join('\n');
}

for (const seed of seeds) {
  const mundo = gerarMundo(seed);
  const { cidade, elenco, grafoAvistamentos, interiores } = mundo;

  console.log(`\n=== A VILA DA SEED "${seed}" (${cidade.predios.length} prédios) ===`);
  for (const q of cidade.quarteiroes) {
    console.log(`\n· ${q.rotulo}:`);
    for (const id of q.predios) {
      const p = cidade.predios.find((x) => x.id === id);
      console.log(`    ${p.rotulo} — (${p.pos.x}, ${p.pos.z})`);
    }
  }

  console.log(`\n· Inserção do elenco (moradia ⌂ / trabalho ⚒ / noite ☾):`);
  for (const p of elenco) {
    const e = p.pacoteEspacial;
    console.log(
      `    ${p.nome} (${p.profissao}) — ⌂ ${e.moradia} · ⚒ ${e.trabalho} · ☾ ${e.rotina.noite}` +
        (e.frequentados.length ? ` · frequenta: ${e.frequentados.join(', ')}` : '')
    );
  }

  const porFaixa = { dia: 0, noite: 0, madrugada: 0 };
  for (const a of grafoAvistamentos) porFaixa[a.faixa] += 1;
  console.log(
    `\n· Grafo de avistamentos: ${grafoAvistamentos.length} arestas ` +
      `(dia ${porFaixa.dia}, noite ${porFaixa.noite}, madrugada ${porFaixa.madrugada})`
  );
  for (const a of grafoAvistamentos.slice(0, 5)) {
    const [p1, p2] = a.entre.map((id) => elenco.find((p) => p.id === id).nome.split(' ')[0]);
    console.log(
      a.modo === 'mesmo_local'
        ? `    ${a.faixa}: ${p1} e ${p2} no mesmo teto (${a.locais[0]})`
        : `    ${a.faixa}: ${p1} (${a.locais[0]}) ouve o lado de ${p2} (${a.locais[1]})`
    );
  }
  if (grafoAvistamentos.length > 5) console.log(`    … e mais ${grafoAvistamentos.length - 5}.`);

  console.log(`\n· Interiores elegíveis (LOD por relevância):`);
  for (const [id, interior] of Object.entries(interiores)) {
    console.log(`\n    ${interior.planta.titulo} (${id}) — grid ${interior.grid.colunas}×${interior.grid.filas}:`);
    console.log(asciiDoInterior(interior));
    for (const c of interior.comodos) {
      const pecas = interior.mobilia.filter((m) => m.comodo === c.id).map((m) => m.rotulo);
      console.log(`      ${c.rotulo}: ${pecas.join('; ') || '—'}`);
    }
  }
}
console.log('');
