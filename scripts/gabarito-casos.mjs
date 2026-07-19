// GABARITO DOS CASOS DA COMARCA — só para o facilitador do playtest.
//
// Imprime, para cada caso do banco procedural, a "verdade de ouro" em linguagem
// legível (nome do réu, vítima, mecanismo, móbil, encenação). Serve para conferir
// o desempenho do jogador SEM que ele veja a resposta. NÃO abra isto na frente de
// quem vai jogar.
//
//   node scripts/gabarito-casos.mjs            → todos os casos
//   node scripts/gabarito-casos.mjs comarca_3  → só o caso cujo id contém "comarca_3"
//
// Para forçar um caso específico no jogo: abra a URL com ?caso=<id>
// (ex.: ?caso=gerado_comarca_3). O id de cada caso aparece abaixo.

import { CASOS_POOL } from '../src/data/casos_gerados.js';

const filtro = process.argv[2] || '';
const casos = CASOS_POOL.filter((c) => c.id.includes(filtro));

const nomeDoPapel = (caso, papelId) => {
  const s = (caso.suspeitos || []).find((x) => x.id === papelId);
  return s ? `${s.nome} (${s.relacao || papelId})` : papelId;
};

console.log(`\nGABARITO — ${casos.length} caso(s) da comarca\n${'='.repeat(60)}`);

for (const caso of casos) {
  const v = caso.verdadeDeOuro || {};
  const reu = nomeDoPapel(caso, v.reuCorreto);
  const inocentes = Object.entries(v.perifericos || {}).map(
    ([id, p]) => `      - ${nomeDoPapel(caso, id)} → ${p.veredictoEsperado}${p.segredo ? ` [segredo: ${p.segredo}]` : ''}`
  );
  console.log(`
CASO: ${caso.id}   (jogar com ?caso=${caso.id})
  Vítima .......... ${v.vitima}
  Réu correto ..... ${reu}
  Mecanismo ....... ${v.mecanismoCorreto}${v.instrumentoCorreto ? `  (instrumento: ${v.instrumentoCorreto})` : ''}
  Móbil ........... ${v.motivacaoCorreta}
  Cena encenada ... ${v.cenaEncenada ? 'SIM' : 'não'}${v.horaForjada ? `  (hora forjada: ${v.horaForjada})` : ''}
  Morte ........... ${v.horasMorteAntesChegada}h antes da chegada do perito
  Inocentes (juízo esperado):
${inocentes.join('\n') || '      (nenhum registrado)'}`);
}

console.log(`\n${'='.repeat(60)}\nSUCESSO = o jogador acusa o "Réu correto", crava o mecanismo/móbil e`);
console.log('julga cada inocente como acima, sem ter visto este arquivo.\n');
