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
import { useJogo } from '../src/store/jogo.js';
import { ANCORAS } from '../src/logic/acusacao.js';
import { gerarMonologo } from '../src/logic/monologo.js';

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
// Validação interativa: os 4 perfis dirigindo o store, como no qa.mjs.
// Garante que o caso é jogável de ponta a ponta (a validação estática
// sozinha não cobre diferenças de localidade/extração no runtime).
// ---------------------------------------------------------------------
function perfilInterativoOk(pacote) {
  const s = () => useJogo.getState();
  const ligar = (de, para) => s().adicionarLigacao(de, para);
  const verdade = pacote.verdadeDeOuro;
  const idsCartas = new Set(pacote.cartas.map((c) => c.id));

  const arrancar = () => {
    s().carregarCaso(pacote);
    s().escolherDetective();
    s().iniciarInvestigacao();
  };
  const extrairTudo = () => {
    s().viajarPara('corpo');
    s().medirTemperatura();
    ['gen_rigor', 'gen_livores', 'gen_lesao_fatal', 'gen_reacao_vital'].forEach(
      (id) => idsCartas.has(id) && s().extrairCarta(id)
    );
    s().viajarPara('cena');
    ['gen_instrumento', 'gen_pertence', 'gen_sangue_alheio', 'gen_pegadas', 'gen_hora_forjada'].forEach((id) => {
      const c = pacote.cartas.find((x) => x.id === id);
      if (c && c.localidade === 'cena') s().extrairCarta(id);
    });
    pacote.cartas
      .filter((c) => c.localidade === 'cena' && (c.tagsOcultas || {}).subDominio === 'rastro_de_visita')
      .forEach((c) => s().extrairCarta(c.id));
    s().viajarPara('vizinhanca');
    if (idsCartas.has('gen_ruido_ouvido')) s().extrairCarta('gen_ruido_ouvido');
    s().viajarPara('delegacia');
    ['gen_visto_vivo', 'gen_motivo'].forEach((id) => idsCartas.has(id) && s().extrairCarta(id));
    for (const susp of pacote.suspeitos) {
      if (idsCartas.has(`gen_alibi_${susp.id}`)) s().extrairCarta(`gen_alibi_${susp.id}`);
    }
    if (pacote.cartas.some((c) => c.localidade === 'oficio_do_reu')) {
      s().viajarPara('oficio_do_reu');
      s().extrairCarta('gen_instrumento');
    }
  };

  // Metódico → vitoria_absoluta
  arrancar();
  extrairTudo();
  const reg = s().cartasRegistradas;
  const jan = intersecaoJanelas(
    reg.filter((c) => c.tagsOcultas.dominio === 'temporal').map(janelaDaCarta).filter(Boolean)
  );
  const sinais = reg.filter((c) => c.tagsOcultas.dominio === 'causal').map((c) => c.tagsOcultas.sinal).filter(Boolean);
  const causa = mecanismoCravado(sinais);
  s().definirReu(verdade.reuCorreto);
  s().definirJanela({ inicio: jan.inicio, fim: jan.fim });
  s().definirCausa(causa ? causa.id : null);
  s().definirMotivacao('gen_motivo');
  for (const c of reg.filter((x) => x.tagsOcultas.dominio === 'temporal')) ligar(c.id, ANCORAS.quando);
  for (const c of reg.filter((x) => x.tagsOcultas.dominio === 'causal')) ligar(c.id, ANCORAS.como);
  const nexo = reg.find((c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.pertenceA === verdade.reuCorreto);
  if (nexo) ligar(nexo.id, ANCORAS.presenca);
  if (verdade.cenaEncenada) {
    for (const c of reg.filter((x) => x.tagsOcultas.dominio === 'temporal')) ligar(c.id, 'gen_hora_forjada');
  }
  for (const [sid, p] of Object.entries(verdade.perifericos || {})) {
    s().definirJuizo(sid, 'inocente');
    if (p.veredictoEsperado === 'inocente_segredo') ligar(`gen_segredo_${sid}`, `gen_alibi_${sid}`);
  }
  s().submeterAcusacao();
  if (s().veredicto.tipo !== 'vitoria_absoluta') return false;
  s().fecharVeredicto();

  // Apressado → erro_judiciario
  arrancar();
  s().viajarPara('corpo');
  ['gen_rigor', 'gen_livores'].forEach((id) => s().extrairCarta(id));
  const outro = pacote.suspeitos.find((x) => x.id !== verdade.reuCorreto);
  s().definirReu(outro.id);
  s().definirJanela({ inicio: -24, fim: 10 });
  for (const c of s().cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'temporal')) ligar(c.id, ANCORAS.quando);
  s().submeterAcusacao();
  if (s().veredicto.tipo !== 'erro_judiciario') return false;
  s().fecharVeredicto();

  // Intuitivo → impunidade
  arrancar();
  s().viajarPara('corpo');
  ['gen_rigor', 'gen_livores'].forEach((id) => s().extrairCarta(id));
  s().definirReu(verdade.reuCorreto);
  s().definirJanela({ inicio: -24, fim: 10 });
  for (const c of s().cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'temporal')) ligar(c.id, ANCORAS.quando);
  s().submeterAcusacao();
  if (s().veredicto.tipo !== 'impunidade') return false;
  s().fecharVeredicto();

  // Desatento → sucesso_gafes
  arrancar();
  extrairTudo();
  const regs2 = s().cartasRegistradas;
  const jRigor = janelaDaCarta(regs2.find((c) => c.id === 'gen_rigor'));
  const sinais2 = regs2.filter((c) => c.tagsOcultas.dominio === 'causal').map((c) => c.tagsOcultas.sinal).filter(Boolean);
  const causa2 = mecanismoCravado(sinais2);
  s().definirReu(verdade.reuCorreto);
  s().definirJanela({ inicio: Math.max(jRigor.inicio, -48), fim: jRigor.fim });
  s().definirCausa(causa2 ? causa2.id : null);
  ligar('gen_rigor', ANCORAS.quando);
  for (const c of regs2.filter((x) => x.tagsOcultas.dominio === 'causal')) ligar(c.id, ANCORAS.como);
  const nexo2 = regs2.find((c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.pertenceA === verdade.reuCorreto);
  if (nexo2) ligar(nexo2.id, ANCORAS.presenca);
  s().submeterAcusacao();
  if (s().veredicto.tipo !== 'sucesso_gafes') return false;
  s().fecharVeredicto();

  return true;
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
