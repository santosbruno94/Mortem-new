// =====================================================================
// QA estático (§18): traça os perfis de jogador pelos dados e pelo motor,
// sem playtest interativo. Executar com: node scripts/qa.mjs
//
// Tudo passa pela GRAMÁTICA UNIVERSAL:
//   • Cronos calcula a janela por triangulação (interseção dos sinais);
//   • Aitiov crava o mecanismo por eliminação no catálogo universal;
//   • as gavetas são livro-caixa (registram a afirmação; não validam);
//   • só o tribunal (calcularVeredicto) julga o afirmado vs. Verdade de Ouro.
// =====================================================================

import { useJogo } from '../src/store/jogo.js';
import { calcularJanelaMorte } from '../src/logic/cronos.js';
import { causasCompativeis } from '../src/data/catalogo_causas.js';
import { HIPOTESES_NEXO } from '../src/logic/nexo.js';
import { formatJanela, formatRelogio } from '../src/logic/tempo.js';
import { gerarMonologo } from '../src/logic/monologo.js';
import { SEED_TUTORIAL } from '../src/data/seed.js';

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

// --- Cronos: janela = interseção dos indicadores reunidos (sem menu) ---
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

// --- Aitiov §1: mecanismo por eliminação no catálogo universal ---
function registrarMecanismo(idMecanismo, idsCartas) {
  const causais = cartas(...idsCartas);
  const sinais = causais.map((c) => c.tagsOcultas.sinal).filter(Boolean);
  const compativeis = causasCompativeis(sinais).map((c) => c.id);
  if (!compativeis.includes(idMecanismo)) {
    return { erro: `causa eliminada pelos sinais (restam: ${compativeis.join(', ')})` };
  }
  const cartaInstr = causais.find((c) => c.tagsOcultas.instrumento);
  return s().registrarConclusao({
    origem: 'aitiov',
    titulo: 'Mecanismo do Óbito',
    resumo: idMecanismo,
    tagsOcultas: {
      tipo: 'mecanismo',
      mecanismo: idMecanismo,
      instrumento: cartaInstr ? cartaInstr.tagsOcultas.instrumento : null,
    },
  });
}

// --- Aitiov §2: Estado da Cena (livro-caixa: registra a afirmação) ---
function registrarCena(idEstado, idsCartas) {
  const cartaHora = cartas(...idsCartas).find((c) => typeof c.tagsOcultas.horaAparente === 'number');
  const horaForjada = idEstado === 'cena_encenada' && cartaHora ? cartaHora.tagsOcultas.horaAparente : null;
  return s().registrarConclusao({
    origem: 'aitiov',
    titulo: 'Estado da Cena',
    resumo: idEstado,
    tagsOcultas: { tipo: 'estado_cena', estado: idEstado, horaForjada },
  });
}

// --- Nexo: liga vestígio a suspeito (livro-caixa) ---
function registrarNexo(idHipotese, idVestigio, idConclusaoApoio) {
  const vestigio = cartas(idVestigio)[0] || null;
  const apoio = s().conclusoes.find((c) => c.id === idConclusaoApoio);
  const instrumento = apoio && apoio.tagsOcultas.tipo === 'mecanismo' ? apoio.tagsOcultas.instrumento : null;
  const h = HIPOTESES_NEXO.find((x) => x.id === idHipotese);
  if (h.id === 'alheio') {
    return s().registrarConclusao({
      origem: 'nexo',
      titulo: 'Vestígio Alheio',
      resumo: 'alheio',
      tagsOcultas: { tipo: 'nexo_alheio', suspeitoId: vestigio ? vestigio.tagsOcultas.pertenceA || null : null },
    });
  }
  return s().registrarConclusao({
    origem: 'nexo',
    titulo: 'Nexo de Presença',
    resumo: 'nexo',
    tagsOcultas: { tipo: 'nexo', suspeitoId: h.suspeitoId, instrumento },
  });
}

function relatar(rotulo, veredicto) {
  console.log(`\n=== ${rotulo} ===`);
  console.log(`Relógio final: ${formatRelogio(s().horasJogo)}`);
  console.log(`Desfecho: ${veredicto.tipo}`);
  console.log(
    `Falhas: ${veredicto.falhas.map((f) => f.codigo + (f.suspeitoId ? `(${f.suspeitoId})` : '')).join(', ') || '—'}`
  );
  monologos.push({ rotulo, monologo: gerarMonologo(veredicto, s().detective) });
}

// ============================================================
// (a) METÓDICO — corpo primeiro, triangula, crava por eliminação,
// libelo completo. Esperado: vitoria_absoluta.
// ============================================================
reiniciar();
s().viajarPara('corpo'); // a relojoaria: 0h a partir da cena — corpo fresco às 11h
s().medirTemperatura(); // 11h → 24°C → algor [-4, 0]
['ev_rigor', 'ev_livores', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'].forEach((id) => s().extrairCarta(id));
s().viajarPara('cena'); // 0h (mesmo prédio)
['ev_relogio', 'ev_gavetas', 'ev_fechadura', 'ev_fio_la'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia'); // +1h
['dep_testamento', 'dep_visto_vivo'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_edgar'); // +1h
['alibi_edgar', 'ev_fibras_manga'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_hudson'); // +1h
['alibi_hudson', 'ev_xale'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_blackwood'); // +1h
['alibi_blackwood'].forEach((id) => s().extrairCarta(id));

const janelaM = registrarCronos(['ev_rigor', 'ev_livores', 'ev_algor', 'dep_visto_vivo']);
console.log('Janela por triangulação:', janelaM.resumo, janelaM.tagsOcultas);
console.log('Catálogo após petéquias+sulco:', causasCompativeis(['petequias_cianose', 'sulco_horizontal']).map((c) => c.id).join(', '));
const mecanismoM = registrarMecanismo('estrangulamento_ligadura', ['ev_sulco', 'ev_petequias', 'ev_fibras_sulco']);
console.log('Mecanismo cravado:', mecanismoM.resumo, mecanismoM.tagsOcultas);
const cenaM = registrarCena('cena_encenada', ['ev_relogio', 'ev_gavetas', 'ev_fechadura']);
const nexoM = registrarNexo('liga_edgar_arthurs', 'ev_fibras_manga', mecanismoM.id);

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
const vMetodico = s().veredicto;
relatar('(a) METÓDICO — esperado: vitoria_absoluta', vMetodico);

// ============================================================
// (b) APRESSADO — persegue iscas (cena, interrogatórios e até Moorford)
// e só então chega ao corpo, acusando a governanta nervosa SEM
// materialidade. Esperado: erro_judiciario. (Sob o relógio mole e estas
// distâncias, o corpo mal degrada nessa rota — a falha do apressado é de
// PERÍCIA, não de relógio.)
// ============================================================
reiniciar();
s().viajarPara('cena');
['ev_relogio', 'ev_gavetas', 'ev_fechadura', 'ev_fio_la'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_edgar'); // extrai o álibi → desbloqueia Moorford
['alibi_edgar', 'comp_edgar', 'ev_fibras_manga'].forEach((id) => s().extrairCarta(id));
s().viajarPara('clube_moorford'); // 3h atrás da isca de Moorford
s().viajarPara('interrogatorio_hudson'); // 3h de volta à vila
['alibi_hudson', 'comp_hudson', 'ev_xale'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_blackwood'); // +1h
['alibi_blackwood', 'comp_blackwood'].forEach((id) => s().extrairCarta(id));
s().viajarPara('corpo'); // +1h: só agora chega ao corpo
console.log('\n--- Apressado: chega ao corpo às', formatRelogio(s().horasJogo), '---');
s().extrairCarta('ev_rigor');
s().extrairCarta('ev_livores');
s().medirTemperatura();
console.log('rigor:', cartas('ev_rigor')[0].textoDisplay, '| algor:', cartas('ev_algor')[0].textoDisplay);
const janelaA = registrarCronos(['ev_rigor', 'ev_livores', 'ev_algor']);
console.log('Janela:', janelaA.erro ? `(${janelaA.erro})` : janelaA.resumo, janelaA.tagsOcultas || '');

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
const vApressado = s().veredicto;
relatar('(b) APRESSADO — esperado: erro_judiciario', vApressado);

// ============================================================
// (c) INTUITIVO — acusa Edgar de imediato, sem materialidade.
// Esperado: impunidade (réu certo, provas furadas).
// ============================================================
reiniciar();
s().viajarPara('corpo');
s().extrairCarta('ev_rigor');
s().extrairCarta('ev_livores');
s().viajarPara('delegacia');
s().extrairCarta('dep_testamento');
s().atualizarLibelo({
  reuId: 'edgar_arthurs',
  evidenciasCorpoIds: ['ev_rigor', 'ev_livores'],
  motivacaoId: 'dep_testamento',
  perifericos: {},
});
s().submeterLibelo();
const vIntuitivo = s().veredicto;
relatar('(c) INTUITIVO — esperado: impunidade', vIntuitivo);

// ============================================================
// (d) PERICIAL DESATENTO — tripé completo, mas libelo lacunoso
// (sem motivação, sem descuidos, sem juízo periférico). Esperado: sucesso_gafes.
// ============================================================
reiniciar();
s().viajarPara('corpo');
s().medirTemperatura();
['ev_rigor', 'ev_livores', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_edgar');
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
// (e) DEGRADAÇÃO POR PRECISÃO + SOLVABILIDADE DURÁVEL (relógio mole).
// Um perito que andou tempo demais (IPM bem alto): o rigor degrada para
// uma leitura VAGA — mas não nula —, e a âncora durável (livor fixo +
// visto-vivo) ainda fecha uma janela que COBRE a hora real da morte.
// ============================================================
reiniciar();
useJogo.setState({ horasJogo: 52 }); // perito muito lento: IPM ~54h
s().viajarPara('corpo');
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().medirTemperatura();
s().viajarPara('delegacia');
s().extrairCarta('dep_visto_vivo');
const rigorTardio = cartas('ev_rigor')[0];
const janelaTardia = registrarCronos(['ev_rigor', 'ev_livores', 'ev_algor', 'dep_visto_vivo']);
const jt = janelaTardia.tagsOcultas;
const morte = SEED_TUTORIAL.horaMorteAbsoluta;
const degradadoValido = !rigorTardio.tagsOcultas.inconclusiva && rigorTardio.textoDisplay === 'Corpo Flácido';
const cobreVerdade = !!jt && jt.inicio <= morte && morte <= jt.fim;
console.log('\n=== (e) DEGRADAÇÃO POR PRECISÃO ===');
console.log('rigor tardio:', rigorTardio.textoDisplay, '| janela durável:', janelaTardia.resumo || janelaTardia.erro);
console.log('rigor degradado ainda é válido (não nulo):', degradadoValido);
console.log('janela durável cobre a verdade:', cobreVerdade);

// ============================================================
// Fumaça do monólogo: todos os desfechos geram texto.
// ============================================================
console.log('\n=== Monólogos gerados (fumaça) ===');
for (const { rotulo, monologo } of monologos) {
  console.log(`· ${rotulo} → "${monologo.titulo}", ${monologo.blocos.length} blocos`);
}

// ============================================================
// Critério de validação do caso (§18 / ETAPA 5)
// ============================================================
const apressadoCaiEmArmadilha = vApressado.falhas.length >= 1 && vApressado.tipo !== 'vitoria_absoluta';
const checagens = [
  ['Metódico resolve (vitoria_absoluta)', vMetodico.tipo === 'vitoria_absoluta'],
  ['Apressado cai em ≥1 armadilha', apressadoCaiEmArmadilha],
  ['Intuitivo alcança Impunidade (réu certo, provas furadas)', vIntuitivo.tipo === 'impunidade'],
  ['Degradado perde precisão, não some (rigor resolvido válido)', degradadoValido],
  ['Durável sempre resolve (janela cobre a verdade mesmo tarde)', cobreVerdade],
];
console.log('\n=== Critério de validação ===');
let todasOk = true;
for (const [rotulo, ok] of checagens) {
  console.log(`${ok ? 'OK ' : 'FALHA'} — ${rotulo}`);
  if (!ok) todasOk = false;
}
console.log(todasOk ? '\nCASO VÁLIDO.' : '\nCASO INVÁLIDO.');
process.exit(todasOk ? 0 : 1);
