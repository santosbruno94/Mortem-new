// =====================================================================
// QA estático (§18): traça os três perfis de jogador pelos dados e pelo
// motor, sem playtest interativo. Executar com: node scripts/qa.mjs
// =====================================================================

import { useJogo } from '../src/store/jogo.js';
import { SEED_TUTORIAL } from '../src/data/seed.js';
import { calcularJanelaMorte } from '../src/logic/cronos.js';
import {
  HIPOTESES_MECANISMO,
  HIPOTESES_CENA,
  validarHipoteseMecanismo,
  validarHipoteseCena,
} from '../src/logic/aitiov.js';
import { HIPOTESES_NEXO, validarHipoteseNexo } from '../src/logic/nexo.js';
import { formatJanela, formatRelogio } from '../src/logic/tempo.js';
import { gerarMonologo } from '../src/logic/monologo.js';

const monologos = [];

const estadoInicial = { ...useJogo.getState() };

function reiniciar() {
  useJogo.setState(estadoInicial, true);
  useJogo.getState().escolherDetective('harlan');
  useJogo.getState().iniciarInvestigacao();
}

function s() {
  return useJogo.getState();
}

function cartas(...ids) {
  return s().cartasRegistradas.filter((c) => ids.includes(c.id));
}

function hip(lista, id) {
  return lista.find((h) => h.id === id);
}

// Cronos por triangulação: a janela é a interseção dos indicadores
// reunidos (sem menu de horas). `idsCartas` opcional restringe os sinais.
function registrarCronos(idsCartas) {
  const temporais = idsCartas
    ? s().cartasRegistradas.filter((c) => idsCartas.includes(c.id))
    : s().cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'temporal');
  const { janela, motivo } = calcularJanelaMorte(temporais);
  if (!janela) return { erro: motivo };
  return s().registrarConclusao({
    origem: 'cronos',
    titulo: 'Janela da Morte',
    resumo: formatJanela(janela),
    tagsOcultas: { tipo: 'janela', inicio: janela.inicio, fim: janela.fim },
  });
}

function registrarMecanismo(idHipotese, idsCartas) {
  const r = validarHipoteseMecanismo(hip(HIPOTESES_MECANISMO, idHipotese), cartas(...idsCartas));
  if (!r.consistente) return { erro: r.motivo };
  return s().registrarConclusao({
    origem: 'aitiov',
    titulo: 'Mecanismo do Óbito',
    resumo: r.mecanismo,
    tagsOcultas: { tipo: 'mecanismo', mecanismo: r.mecanismo, instrumento: r.instrumento },
  });
}

function registrarCena(idHipotese, idsCartas) {
  const janelaC = s().conclusoes.find((c) => c.tagsOcultas.tipo === 'janela');
  const janela = janelaC ? { inicio: janelaC.tagsOcultas.inicio, fim: janelaC.tagsOcultas.fim } : null;
  const r = validarHipoteseCena(hip(HIPOTESES_CENA, idHipotese), cartas(...idsCartas), janela);
  if (!r.consistente) return { erro: r.motivo };
  return s().registrarConclusao({
    origem: 'aitiov',
    titulo: 'Estado da Cena',
    resumo: r.estado,
    tagsOcultas: { tipo: 'estado_cena', estado: r.estado, horaForjada: r.horaForjada },
  });
}

function registrarNexo(idHipotese, idVestigio, idConclusaoApoio) {
  const vestigio = cartas(idVestigio)[0];
  const apoio = s().conclusoes.find((c) => c.id === idConclusaoApoio);
  const r = validarHipoteseNexo(hip(HIPOTESES_NEXO, idHipotese), vestigio, apoio);
  if (!r.consistente) return { erro: r.motivo };
  return s().registrarConclusao({
    origem: 'nexo',
    titulo: 'Nexo de Presença',
    resumo: r.tipo,
    tagsOcultas: { tipo: r.tipo, suspeitoId: r.suspeitoId, instrumento: r.instrumento || null },
  });
}

function relatar(rotulo, veredicto) {
  console.log(`\n=== ${rotulo} ===`);
  console.log(`Relógio final: ${formatRelogio(s().horasJogo)}`);
  console.log(`Desfecho: ${veredicto.tipo}`);
  console.log(`Falhas: ${veredicto.falhas.map((f) => f.codigo + (f.suspeitoId ? `(${f.suspeitoId})` : '')).join(', ') || '—'}`);
  monologos.push({ rotulo, monologo: gerarMonologo(veredicto, s().detective) });
}

// ============================================================
// (a) METÓDICO — corpo primeiro, três gavetas, libelo completo
// ============================================================
reiniciar();
s().medirTemperatura(); // 11h → 24°C → IPM 11–15
['ev_rigor', 'ev_livores', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'].forEach((id) => s().extrairCarta(id));
['ev_relogio', 'ev_gavetas', 'ev_fechadura', 'ev_fio_la'].forEach((id) => s().extrairCarta(id));
['dep_testamento'].forEach((id) => s().extrairCarta(id));
['alibi_edgar', 'ev_fibras_manga', 'alibi_hudson', 'ev_xale', 'alibi_blackwood'].forEach((id) =>
  s().extrairCarta(id)
);

console.log('--- Metódico: estados extraídos ---');
console.log('algor:', cartas('ev_algor')[0].tagsOcultas);
console.log('rigor:', cartas('ev_rigor')[0].tagsOcultas, 'registrado às', cartas('ev_rigor')[0].horaRegistro);

const janelaM = registrarCronos(['ev_rigor', 'ev_livores', 'ev_algor']);
console.log('Janela calculada por triangulação:', janelaM.resumo, janelaM.tagsOcultas);
const mecanismoM = registrarMecanismo('estrangulamento_ligadura', ['ev_sulco', 'ev_petequias', 'ev_fibras_sulco']);
console.log('Mecanismo:', mecanismoM.resumo, mecanismoM.tagsOcultas);
const cenaM = registrarCena('cena_encenada', ['ev_relogio', 'ev_gavetas', 'ev_fechadura']);
console.log('Estado da cena:', cenaM.resumo);
const nexoHudson = registrarNexo('liga_sra_hudson', 'ev_fio_la', mecanismoM.id);
console.log('Nexo com fio de lã (Hudson):', nexoHudson.erro ? `rejeitado — ${nexoHudson.erro}` : 'ACEITO (FURO!)');
const nexoM = registrarNexo('liga_edgar_arthurs', 'ev_fibras_manga', mecanismoM.id);
console.log('Nexo Edgar:', nexoM.resumo, nexoM.tagsOcultas);

s().atualizarLibelo({
  reuId: 'edgar_arthurs',
  evidenciasCorpoIds: ['ev_rigor', 'ev_livores', 'ev_algor', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'],
  conclusaoCronosId: janelaM.id,
  conclusaoMecanismoId: mecanismoM.id,
  conclusaoNexoId: nexoM.id,
  descuidosIds: [cenaM.id, 'ev_relogio'],
  motivacaoId: 'dep_testamento',
  perifericos: {
    thomas_blackwood: { tipo: 'inocente_alibi', cartaId: 'alibi_blackwood' },
    sra_hudson: { tipo: 'inocente_segredo', cartaId: 'ev_xale' },
  },
});
s().submeterLibelo();
relatar('(a) METÓDICO — esperado: vitoria_absoluta', s().veredicto);

// ============================================================
// (b) APRESSADO — cena e interrogatórios antes do corpo;
// cai nas armadilhas 1 (degradação), 2 (Hudson) e 3 (Blackwood é
// descartado por ninguém: ele acusa a mentirosa nervosa)
// ============================================================
reiniciar();
['ev_relogio', 'ev_gavetas', 'ev_fechadura', 'ev_fio_la'].forEach((id) => s().extrairCarta(id));
['alibi_edgar', 'comp_edgar', 'ev_fibras_manga'].forEach((id) => s().extrairCarta(id));
['alibi_hudson', 'comp_hudson', 'ev_xale'].forEach((id) => s().extrairCarta(id));
['alibi_blackwood', 'comp_blackwood'].forEach((id) => s().extrairCarta(id));
console.log('\n--- Apressado: chega ao corpo às', formatRelogio(s().horasJogo), '---');
s().extrairCarta('ev_rigor');
s().extrairCarta('ev_livores');
s().medirTemperatura();
console.log('rigor degradado:', cartas('ev_rigor')[0].textoDisplay, cartas('ev_rigor')[0].tagsOcultas);
console.log('algor degradado:', cartas('ev_algor')[0].textoDisplay, cartas('ev_algor')[0].tagsOcultas);

const janelaA = registrarCronos();
console.log(
  'Janela com sinais degradados:',
  janelaA.erro ? `(${janelaA.erro})` : `${janelaA.resumo}`,
  janelaA.tagsOcultas || ''
);

// Acusa a governanta nervosa que mentiu (armadilha 2), sem mecanismo nem nexo
s().atualizarLibelo({
  reuId: 'sra_hudson',
  evidenciasCorpoIds: ['ev_rigor', 'ev_livores'],
  conclusaoCronosId: janelaA.id,
  motivacaoId: null,
  descuidosIds: [],
  perifericos: {
    thomas_blackwood: { tipo: 'inocente_alibi', cartaId: 'alibi_blackwood' },
  },
});
s().submeterLibelo();
relatar('(b) APRESSADO — esperado: erro_judiciario', s().veredicto);

// ============================================================
// (c) INTUITIVO — acusa Edgar de imediato, sem materialidade
// ============================================================
reiniciar();
s().extrairCarta('ev_rigor');
s().extrairCarta('ev_livores');
s().extrairCarta('dep_testamento');
s().atualizarLibelo({
  reuId: 'edgar_arthurs',
  evidenciasCorpoIds: ['ev_rigor', 'ev_livores'],
  motivacaoId: 'dep_testamento',
  perifericos: {},
});
s().submeterLibelo();
relatar('(c) INTUITIVO — esperado: impunidade', s().veredicto);

// ============================================================
// (d) PERICIAL DESATENTO — tripé completo, mas libelo lacunoso
// (sem motivação, sem descuidos, sem juízo periférico)
// ============================================================
reiniciar();
s().medirTemperatura();
['ev_rigor', 'ev_livores', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'].forEach((id) => s().extrairCarta(id));
s().extrairCarta('ev_fibras_manga');
const janelaD = registrarCronos(['ev_rigor', 'ev_livores', 'ev_algor']);
const mecanismoD = registrarMecanismo('estrangulamento_ligadura', ['ev_sulco', 'ev_petequias', 'ev_fibras_sulco']);
const nexoD = registrarNexo('liga_edgar_arthurs', 'ev_fibras_manga', mecanismoD.id);
s().atualizarLibelo({
  reuId: 'edgar_arthurs',
  evidenciasCorpoIds: ['ev_rigor', 'ev_sulco'],
  conclusaoCronosId: janelaD.id,
  conclusaoMecanismoId: mecanismoD.id,
  conclusaoNexoId: nexoD.id,
  descuidosIds: [],
  motivacaoId: null,
  perifericos: {},
});
s().submeterLibelo();
relatar('(d) PERICIAL DESATENTO — esperado: sucesso_gafes', s().veredicto);

// ============================================================
// Fumaça do monólogo: todos os 4 desfechos geram texto sem falha
// ============================================================
console.log('\n=== Monólogos gerados (fumaça) ===');
for (const { rotulo, monologo } of monologos) {
  console.log(`\n· ${rotulo} → "${monologo.titulo}", ${monologo.blocos.length} blocos`);
  console.log(`  Abertura: ${monologo.blocos[0].slice(0, 90)}…`);
  console.log(`  Fecho: ${monologo.blocos[monologo.blocos.length - 1].slice(0, 90)}…`);
}
