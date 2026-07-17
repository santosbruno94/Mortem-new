// =====================================================================
// GERA OS CASOS EMBARCADOS — escreve src/data/casos_gerados.js.
//
// Executar: node scripts/gerar-casos.mjs   (ou npm run gerar:casos)
//
// POR QUE UM SCRIPT DE BUILD: o gerador é ILHA de build time (o runtime
// jamais importa src/gerador — guarda no qa.mjs). Os modos procedurais
// jogáveis carregam, portanto, PACOTES PRÉ-GERADOS e versionados como
// dado. Determinismo preservado: mesma seed → mesmo pacote, byte a byte
// (o qa.mjs regenera e compara com o arquivo commitado).
//
// O QUE SAI:
//   • CASO_REPLICA — a tentativa de recriar "A Hora Emprestada" pela
//     mecânica procedural: seed fixa + variáveis dirigidas (documentadas
//     em DIRIGIDO_REPLICA). A busca de seed (240 candidatas, placar de
//     aproximação) escolheu a_hora_emprestada_replica_96: lojista morto
//     na própria loja às 21h de 13/out, arma branca premeditada, a criada
//     da casa com a referência negada como móbil, INT4/WIS4 (o quadrante
//     de Silas), corpo movido. O catálogo v2 (correções B7/B8 do playtest
//     de 16/jul) alcança a encenação de hora (o relógio parado, refutável
//     pelo corpo) e os periféricos com segredo; segue fora do alcance
//     apenas o móbil "silenciamento de fraude".
//   • CASOS_POOL — o banco do modo "caso da comarca" (procedural
//     aleatório): as primeiras N seeds da série comarca_* cujo caso
//     resolve com Vitória Absoluta pelo caminho Metódico (validação
//     abaixo, com as MESMAS funções do motor — agora inclusive os pilares
//     de descuidos e de julgar inocentes).
// =====================================================================

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { montarPacoteGerado, SEED_REPLICA, DIRIGIDO_REPLICA } from '../src/gerador/pacote_gerado.js';
import { janelaDaCarta } from '../src/logic/cronos.js';
import { intersecaoJanelas, temperaturaPorIpm } from '../src/logic/tempo_morte.js';
import { mecanismoCravado } from '../src/data/catalogo_causas.js';
import { resolverEstadoCarta } from '../src/data/cartas.js';

// A seed e as variáveis dirigidas da réplica vivem no gerador
// (src/gerador/pacote_gerado.js), para o qa.mjs regenerar e comparar sem
// importar este script (que grava arquivo ao rodar).

// v2 (playtest 16/jul, P6/M8): o pool sobe de 8 para 20 casos.
const N_POOL = 20;
const CANDIDATAS_POOL = Array.from({ length: 120 }, (_, i) => `comarca_${i + 1}`);

// ---------------------------------------------------------------------
// Validação de solvabilidade pelo caminho Metódico, com as funções do
// motor: extração de tudo às 11h → janela precisa (≤6h) cobrindo a hora
// real; mecanismo cravado = o da verdade; nexo instrumental do réu; móbil.
// ---------------------------------------------------------------------
function metodicoResolve(pacote) {
  const v = pacote.verdadeDeOuro;
  const chegada = pacote.parametrosCena.horasChegada;
  const ipm = v.horasMorteAntesChegada;
  const registradas = pacote.cartas.map((def) => ({
    ...resolverEstadoCarta(def, ipm),
    id: def.id,
    horaRegistro: chegada,
  }));
  // A carta de algor não vive no catálogo: nasce da medição de temperatura
  // (store.medirTemperatura). O Metódico a colhe às 11h — replicamos aqui.
  registradas.push({
    id: 'ev_algor',
    horaRegistro: chegada,
    tagsOcultas: {
      dominio: 'temporal',
      subDominio: 'algor_mortis',
      temperaturaCorpo: temperaturaPorIpm(ipm, pacote.parametrosCena.ambiente),
      temperaturaAmbiente: pacote.parametrosCena.ambiente,
    },
  });
  const temporais = registradas.filter((c) => c.tagsOcultas.dominio === 'temporal');
  const janela = intersecaoJanelas(temporais.map(janelaDaCarta).filter(Boolean));
  const janelaOk =
    !!janela &&
    janela.inicio <= v.horaMorteAbsoluta &&
    v.horaMorteAbsoluta <= janela.fim &&
    janela.inicio !== -Infinity &&
    janela.fim !== Infinity &&
    janela.fim - janela.inicio <= 6;
  const sinais = registradas
    .filter((c) => c.tagsOcultas.dominio === 'causal')
    .map((c) => c.tagsOcultas.sinal)
    .filter(Boolean);
  const cravado = mecanismoCravado(sinais);
  const mecanismoOk = !!cravado && cravado.id === v.mecanismoCorreto;
  const nexoOk = registradas.some(
    (c) =>
      c.tagsOcultas.dominio === 'vestigio' &&
      c.tagsOcultas.tipoVestigio === v.instrumentoCorreto &&
      c.tagsOcultas.pertenceA === v.reuCorreto
  );
  const motivoOk = registradas.some(
    (c) => c.tagsOcultas.motivo === v.motivacaoCorreta && c.tagsOcultas.ligadoA === v.reuCorreto
  );
  // Descuidos (v2): se a verdade exige a encenação exposta, a peça existe
  // no catálogo e a janela do corpo a EXCLUI (refutável por construção).
  const forjada = pacote.cartas.find((c) => c.tagsOcultas?.encenado);
  const descuidosOk =
    !v.cenaEncenada ||
    (!!forjada &&
      !!janela &&
      (forjada.tagsOcultas.horaAparente < janela.inicio || forjada.tagsOcultas.horaAparente > janela.fim));
  // Periféricos (v2): todo não-acusado tem álibi no catálogo; todo
  // segredo esperado tem o rastro revelador (pertenceA + revelaSegredo).
  const perifericosOk = Object.entries(v.perifericos).every(([sid, p]) => {
    const alibi = pacote.cartas.some(
      (c) => c.tagsOcultas?.subDominio === 'alibi' && c.tagsOcultas.declaranteId === sid
    );
    if (!alibi) return false;
    if (p.veredictoEsperado !== 'inocente_segredo') return true;
    return pacote.cartas.some(
      (c) => c.tagsOcultas?.pertenceA === sid && c.tagsOcultas?.revelaSegredo === p.segredo
    );
  });
  return {
    ok: janelaOk && mecanismoOk && nexoOk && motivoOk && descuidosOk && perifericosOk,
    janela,
    janelaOk,
    mecanismoOk,
    nexoOk,
    motivoOk,
    descuidosOk,
    perifericosOk,
  };
}

// Higiene do pacote: todo marcador aponta carta, toda carta tem marcador.
// Fala de diálogo é caminho de extração como a prosa de localidade (a OS
// da árvore procedural põe as cartas de álibi nascendo nos beats).
function marcadoresFecham(pacote) {
  const ids = new Set(pacote.cartas.map((c) => c.id));
  const marcados = new Set();
  for (const l of pacote.localidades) {
    const textos = [
      ...(l.prosa || []),
      ...(l.introducao || []),
      ...(l.pontos || []).flatMap((p) => p.prosa),
      ...(l.blocosContingentes || []).flatMap((b) => b.paragrafos),
    ];
    for (const t of textos) for (const m of t.matchAll(/\[\[(\w+)\]\]/g)) marcados.add(m[1]);
    for (const g of l.gestos || []) marcados.add(g.cartaId);
  }
  for (const d of Object.values(pacote.dialogos || {})) {
    for (const no of Object.values(d.nos)) {
      for (const t of no.fala || []) for (const m of t.matchAll(/\[\[(\w+)\]\]/g)) marcados.add(m[1]);
    }
  }
  const orfaos = [...marcados].filter((id) => !ids.has(id));
  const inalcancaveis = [...ids].filter((id) => !marcados.has(id));
  return { ok: orfaos.length === 0 && inalcancaveis.length === 0, orfaos, inalcancaveis };
}

// ---------------------------------------------------------------------
// Monta, valida e escreve.
// ---------------------------------------------------------------------
const replica = montarPacoteGerado(SEED_REPLICA, { dirigido: DIRIGIDO_REPLICA });
{
  const m = metodicoResolve(replica);
  const h = marcadoresFecham(replica);
  if (!m.ok || !h.ok) {
    console.error('RÉPLICA INVÁLIDA:', JSON.stringify({ m, h }));
    process.exit(1);
  }
}

const pool = [];
const recusadas = [];
for (const seed of CANDIDATAS_POOL) {
  if (pool.length >= N_POOL) break;
  const pacote = montarPacoteGerado(seed);
  const m = metodicoResolve(pacote);
  const h = marcadoresFecham(pacote);
  if (m.ok && h.ok) pool.push({ seed, pacote });
  else recusadas.push({ seed, motivo: !m.ok ? 'metódico não fecha' : 'marcadores não fecham' });
}
if (pool.length < N_POOL) {
  console.error(`POOL INSUFICIENTE: ${pool.length}/${N_POOL}.`, JSON.stringify(recusadas));
  process.exit(1);
}

const cab = `// =====================================================================
// CASOS GERADOS — ARQUIVO ESCRITO POR scripts/gerar-casos.mjs. NÃO EDITAR
// À MÃO: qualquer ajuste se faz no gerador (src/gerador/) ou no script, e
// regenera-se com \`npm run gerar:casos\`. O qa.mjs regenera e compara
// byte a byte (guarda de replay da FASE 6).
//
// DADO PURO de runtime: pacotes de caso completos (contrato de
// src/data/pacote_caso.js), pré-gerados em build time porque o gerador é
// ilha (o runtime jamais importa src/gerador).
//   • CASO_REPLICA: seed ${SEED_REPLICA} + variáveis dirigidas
//     (a tentativa procedural de recriar "A Hora Emprestada").
//   • CASOS_POOL: o banco do modo "caso da comarca" (aleatório).
// =====================================================================

`;
const corpo =
  `export const CASO_REPLICA = ${JSON.stringify(replica, null, 1)};\n\n` +
  `export const CASOS_POOL = [\n${pool.map((p) => JSON.stringify(p.pacote, null, 1)).join(',\n')}\n];\n`;

const destino = fileURLToPath(new URL('../src/data/casos_gerados.js', import.meta.url));
writeFileSync(destino, cab + corpo);

console.log(`gerar-casos: réplica ${SEED_REPLICA} + pool de ${pool.length} casos (${pool.map((p) => p.seed).join(', ')}).`);
const encenados = pool.filter((p) => p.pacote.verdadeDeOuro.cenaEncenada).length;
const comSegredo = pool.filter((p) =>
  Object.values(p.pacote.verdadeDeOuro.perifericos).some((x) => x.veredictoEsperado === 'inocente_segredo')
).length;
console.log(
  `gerar-casos: pilares v2 — ${encenados}/${pool.length} com encenação de hora; ${comSegredo}/${pool.length} com periférico de segredo (réplica: encenação=${replica.verdadeDeOuro.cenaEncenada}, segredos=${Object.values(replica.verdadeDeOuro.perifericos).filter((x) => x.segredo).length}).`
);
if (recusadas.length) console.log(`gerar-casos: recusadas ${recusadas.map((r) => `${r.seed} (${r.motivo})`).join('; ')}.`);
console.log(`gerar-casos: escrito em src/data/casos_gerados.js (${(cab.length + corpo.length) / 1024 | 0} KiB).`);
