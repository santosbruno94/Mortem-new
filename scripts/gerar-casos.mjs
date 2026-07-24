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
//   • CASOS_LUTA — o banco do modo "A Marca do Agressor": sementes do
//     namespace luta_* filtradas por luta corporal (gen_sinal_exigivel
//     presente), validadas tanto estática (metodicoResolve) quanto
//     interativamente (perfilInterativoOk, os 4 perfis pelo store).
// =====================================================================

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { montarPacoteGerado, SEED_REPLICA, DIRIGIDO_REPLICA } from '../src/gerador/pacote_gerado.js';
import { janelaDaCarta } from '../src/logic/cronos.js';
import { intersecaoJanelas, temperaturaPorIpm } from '../src/logic/tempo_morte.js';
import { mecanismoCravado } from '../src/data/catalogo_causas.js';
import { resolverEstadoCarta } from '../src/data/cartas.js';
import { perfisDoCasoGerado, quatroDesfechos } from './lib/perfis.mjs';
import { marcadoresDoTexto } from './lib/marcadores.mjs';
import { nucleoDaFatia } from './lib/fatia.mjs';

// A seed e as variáveis dirigidas da réplica vivem no gerador
// (src/gerador/pacote_gerado.js), para o qa.mjs regenerar e comparar sem
// importar este script (que grava arquivo ao rodar).

// v2 (playtest 16/jul, P6/M8): o pool sobe de 8 para 20 casos.
const N_POOL = 20;
const CANDIDATAS_POOL = Array.from({ length: 120 }, (_, i) => `comarca_${i + 1}`);

// Pool do modo "A Marca do Agressor": só sementes com luta corporal que
// deixa marca-espelho (gen_sinal_exigivel presente no pacote). Namespace
// próprio para não colidir com o pool da comarca.
const N_POOL_LUTA = 10;
const CANDIDATAS_LUTA = Array.from({ length: 300 }, (_, i) => `luta_${i + 1}`);

// ---------------------------------------------------------------------
// Validação de solvabilidade pelo caminho Metódico, com as funções do
// motor: extração de tudo às 13h → janela precisa (≤6h) cobrindo a hora
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
  // (store.medirTemperatura). O Metódico a colhe às 13h — replicamos aqui.
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
  // Os quatro pilares medem-se pelo NÚCLEO único (scripts/lib/fatia.mjs);
  // as réguas de embarque ficam locais DE PROPÓSITO: janela PRECISA
  // (finita, ≤ 6h) e nexo INSTRUMENTAL (tipoVestigio casa com a arma).
  const n = nucleoDaFatia(registradas, v);
  const { janela } = n;
  const janelaOk =
    n.janelaCobre && janela.inicio !== -Infinity && janela.fim !== Infinity && janela.fim - janela.inicio <= 6;
  const mecanismoOk = n.mecanismoCrava;
  const nexoOk = registradas.some(
    (c) =>
      c.tagsOcultas.dominio === 'vestigio' &&
      c.tagsOcultas.tipoVestigio === v.instrumentoCorreto &&
      c.tagsOcultas.pertenceA === v.reuCorreto
  );
  const motivoOk = n.motivoOk;
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
    for (const t of textos) for (const id of marcadoresDoTexto(t)) marcados.add(id);
    for (const g of l.gestos || []) marcados.add(g.cartaId);
  }
  for (const d of Object.values(pacote.dialogos || {})) {
    for (const no of Object.values(d.nos)) {
      for (const t of no.fala || []) for (const id of marcadoresDoTexto(t)) marcados.add(id);
    }
  }
  const orfaos = [...marcados].filter((id) => !ids.has(id));
  const inalcancaveis = [...ids].filter((id) => !marcados.has(id));
  return { ok: orfaos.length === 0 && inalcancaveis.length === 0, orfaos, inalcancaveis };
}

// ---------------------------------------------------------------------
// Validação interativa: os 4 perfis dirigindo o store, como no qa.mjs —
// a coreografia ÚNICA mora em scripts/lib/perfis.mjs (fonte única).
// Garante que o caso é jogável de ponta a ponta (a validação estática
// sozinha não cobre diferenças de localidade/extração no runtime).
// ---------------------------------------------------------------------
function perfilInterativoOk(pacote) {
  return quatroDesfechos(perfisDoCasoGerado(pacote));
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
  if (m.ok && h.ok && perfilInterativoOk(pacote)) pool.push({ seed, pacote });
  else recusadas.push({ seed, motivo: !m.ok ? 'metódico não fecha' : !h.ok ? 'marcadores não fecham' : 'perfil interativo falha' });
}
if (pool.length < N_POOL) {
  console.error(`POOL INSUFICIENTE: ${pool.length}/${N_POOL}.`, JSON.stringify(recusadas));
  process.exit(1);
}

const poolLuta = [];
const recusadasLuta = [];
for (const seed of CANDIDATAS_LUTA) {
  if (poolLuta.length >= N_POOL_LUTA) break;
  const pacote = montarPacoteGerado(seed);
  const m = metodicoResolve(pacote);
  const h = marcadoresFecham(pacote);
  const temLuta = pacote.cartas.some((c) => c.id === 'gen_sinal_exigivel');
  if (m.ok && h.ok && temLuta && perfilInterativoOk(pacote)) poolLuta.push({ seed, pacote });
  else recusadasLuta.push({ seed, motivo: !temLuta ? 'sem luta corporal' : !m.ok ? 'metódico não fecha' : !h.ok ? 'marcadores não fecham' : 'perfil interativo falha' });
}
if (poolLuta.length < N_POOL_LUTA) {
  console.error(`POOL LUTA INSUFICIENTE: ${poolLuta.length}/${N_POOL_LUTA}.`, JSON.stringify(recusadasLuta));
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
//   • CASOS_LUTA: o banco do modo "A Marca do Agressor" (luta forçada).
// =====================================================================

`;
const corpo =
  `export const CASO_REPLICA = ${JSON.stringify(replica, null, 1)};\n\n` +
  `export const CASOS_POOL = [\n${pool.map((p) => JSON.stringify(p.pacote, null, 1)).join(',\n')}\n];\n\n` +
  `export const CASOS_LUTA = [\n${poolLuta.map((p) => JSON.stringify(p.pacote, null, 1)).join(',\n')}\n];\n`;

const destino = fileURLToPath(new URL('../src/data/casos_gerados.js', import.meta.url));
writeFileSync(destino, cab + corpo);

// O ÍNDICE LEVE do banco (diagnóstico 21/07, Lote 5): ids por modo, para a
// camada síncrona (modoDoCaso, tamanhos de pool) decidir sem carregar os
// pacotes — o banco pesado (~1,8 MB) chega por import() dinâmico em
// src/data/casos.js. Guarda de paridade índice × banco no qa.mjs.
const destinoIndice = fileURLToPath(new URL('../src/data/casos_indice.js', import.meta.url));
writeFileSync(
  destinoIndice,
  '// GERADO por scripts/gerar-casos.mjs — NÃO EDITAR À MÃO.\n' +
    '// Índice leve de casos_gerados.js (ids por modo): permite à camada\n' +
    '// síncrona responder "de que modo é este caso?" sem puxar o banco\n' +
    '// pesado para o chunk de arranque.\n' +
    `export const REPLICA_ID = ${JSON.stringify(replica.id)};\n` +
    `export const IDS_POOL = ${JSON.stringify(pool.map((p) => p.pacote.id))};\n` +
    `export const IDS_LUTA = ${JSON.stringify(poolLuta.map((p) => p.pacote.id))};\n`
);

console.log(`gerar-casos: réplica ${SEED_REPLICA} + pool de ${pool.length} casos (${pool.map((p) => p.seed).join(', ')}).`);
console.log(`gerar-casos: pool luta de ${poolLuta.length} casos (${poolLuta.map((p) => p.seed).join(', ')}).`);
const encenados = pool.filter((p) => p.pacote.verdadeDeOuro.cenaEncenada).length;
const comSegredo = pool.filter((p) =>
  Object.values(p.pacote.verdadeDeOuro.perifericos).some((x) => x.veredictoEsperado === 'inocente_segredo')
).length;
console.log(
  `gerar-casos: pilares v2 — ${encenados}/${pool.length} com encenação de hora; ${comSegredo}/${pool.length} com periférico de segredo (réplica: encenação=${replica.verdadeDeOuro.cenaEncenada}, segredos=${Object.values(replica.verdadeDeOuro.perifericos).filter((x) => x.segredo).length}).`
);
if (recusadas.length) console.log(`gerar-casos: recusadas ${recusadas.map((r) => `${r.seed} (${r.motivo})`).join('; ')}.`);
if (recusadasLuta.length) console.log(`gerar-casos: recusadas luta ${recusadasLuta.length} sementes (maioria sem luta corporal).`);
console.log(`gerar-casos: escrito em src/data/casos_gerados.js (${(cab.length + corpo.length) / 1024 | 0} KiB).`);
