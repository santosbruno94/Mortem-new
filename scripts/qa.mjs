// =====================================================================
// QA estático (§18): traça os perfis de jogador pelos dados e pelo motor,
// sem playtest interativo. Executar com: node scripts/qa.mjs
//
// Novo loop (redesign do core):
//   • o relógio só anda ao VIAJAR (viajarPara); examinar congela o relógio;
//   • o MESTRE/legista FALA a leitura de quando/como — consolidada
//     automaticamente em conclusões de id estável (leitura_mestre_janela e
//     leitura_mestre_mecanismo). Não há mais gavetas Cronos/Aitiov;
//   • o jogador ainda crava o NEXO (até a Fase 4 virar Confronto);
//   • só o tribunal (calcularVeredicto) julga o afirmado vs. Verdade de Ouro.
// =====================================================================

import { useJogo } from '../src/store/jogo.js';
import { HIPOTESES_NEXO } from '../src/logic/nexo.js';
import { formatRelogio } from '../src/logic/tempo.js';
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

function leitura(id) {
  return s().conclusoes.find((c) => c.id === id) || null;
}

// Nexo: liga vestígio a suspeito (livro-caixa). Ainda manual até a Fase 4.
// Apoia-se na leitura de mecanismo do mestre para herdar o instrumento.
function registrarNexo(idHipotese, idVestigio, idConclusaoApoio) {
  const apoio = leitura(idConclusaoApoio);
  const instrumento = apoio && apoio.tagsOcultas.tipo === 'mecanismo' ? apoio.tagsOcultas.instrumento : null;
  const h = HIPOTESES_NEXO.find((x) => x.id === idHipotese);
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
// (a) METÓDICO — corpo primeiro (fresco), ouve a leitura do mestre, crava o
// nexo e redige libelo completo. Esperado: vitoria_absoluta.
// ============================================================
reiniciar();
s().viajarPara('corpo'); // 0h a partir da cena — corpo fresco às 11h
s().medirTemperatura();
['ev_rigor', 'ev_livores', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'].forEach((id) => s().extrairCarta(id));
s().viajarPara('cena');
['ev_relogio', 'ev_gavetas', 'ev_fechadura', 'ev_fio_la'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia'); // +1h
['dep_testamento', 'dep_visto_vivo'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_edgar'); // +1h
['alibi_edgar', 'ev_fibras_manga'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_hudson'); // +1h
['alibi_hudson', 'ev_xale'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_blackwood'); // +1h
['alibi_blackwood'].forEach((id) => s().extrairCarta(id));

// O mestre já consolidou quando/como ao longo dos exames:
console.log('Mestre — janela:', leitura('leitura_mestre_janela')?.resumo || '(—)');
console.log('Mestre — mecanismo:', leitura('leitura_mestre_mecanismo')?.resumo || '(—)');
const nexoM = registrarNexo('liga_edgar_arthurs', 'ev_fibras_manga', 'leitura_mestre_mecanismo');

s().atualizarLibelo({
  reuId: 'edgar_arthurs',
  evidenciasCorpoIds: ['ev_rigor', 'ev_livores', 'ev_algor', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'],
  conclusaoCronosId: 'leitura_mestre_janela',
  conclusaoMecanismoId: 'leitura_mestre_mecanismo',
  conclusaoNexoId: nexoM.id,
  descuidosIds: ['ev_relogio'], // a carta ambiental já carrega encenado:true
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
// (b) APRESSADO — persegue iscas (cena, interrogatórios e Moorford) e só
// então chega ao corpo; acusa a governanta nervosa SEM materialidade
// (ouve o "quando" do mestre, mas não tem mecanismo nem nexo).
// Esperado: erro_judiciario.
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
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().medirTemperatura();
console.log('rigor:', cartas('ev_rigor')[0].textoDisplay, '| algor:', cartas('ev_algor')[0].textoDisplay);
console.log('Mestre — janela:', leitura('leitura_mestre_janela')?.resumo || '(—)');

s().atualizarLibelo({
  reuId: 'sra_hudson',
  evidenciasCorpoIds: ['ev_rigor', 'ev_livores'],
  conclusaoCronosId: 'leitura_mestre_janela',
  perifericos: {
    thomas_blackwood: { tipo: 'inocente_alibi', cartaId: 'alibi_blackwood' },
  },
});
s().submeterLibelo();
const vApressado = s().veredicto;
relatar('(b) APRESSADO — esperado: erro_judiciario', vApressado);

// ============================================================
// (c) INTUITIVO — acusa Edgar de imediato. O mestre lhe deu o "quando",
// mas falta TODA a materialidade (mecanismo e nexo). Esperado: impunidade.
// ============================================================
reiniciar();
s().viajarPara('corpo');
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia');
s().extrairCarta('dep_testamento');
s().atualizarLibelo({
  reuId: 'edgar_arthurs',
  evidenciasCorpoIds: ['ev_rigor', 'ev_livores'],
  conclusaoCronosId: 'leitura_mestre_janela', // o mestre deu o tempo; falta o resto
  motivacaoId: 'dep_testamento',
  perifericos: {},
});
s().submeterLibelo();
const vIntuitivo = s().veredicto;
relatar('(c) INTUITIVO — esperado: impunidade', vIntuitivo);

// ============================================================
// (d) PERICIAL DESATENTO — tripé completo (mestre dá quando/como + nexo),
// mas libelo lacunoso (sem motivação, descuidos, juízo periférico).
// Esperado: sucesso_gafes.
// ============================================================
reiniciar();
s().viajarPara('corpo');
s().medirTemperatura();
['ev_rigor', 'ev_livores', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_edgar');
s().extrairCarta('ev_fibras_manga');
const nexoD = registrarNexo('liga_edgar_arthurs', 'ev_fibras_manga', 'leitura_mestre_mecanismo');
s().atualizarLibelo({
  reuId: 'edgar_arthurs',
  evidenciasCorpoIds: ['ev_rigor', 'ev_sulco'],
  conclusaoCronosId: 'leitura_mestre_janela',
  conclusaoMecanismoId: 'leitura_mestre_mecanismo',
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
// uma leitura VAGA — mas não nula —, e a leitura do mestre (apoiada no
// livor fixo + visto-vivo) ainda COBRE a hora real da morte.
// ============================================================
reiniciar();
useJogo.setState({ horasJogo: 52 }); // perito muito lento: IPM ~54h
s().viajarPara('corpo');
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().medirTemperatura();
s().viajarPara('delegacia');
s().extrairCarta('dep_visto_vivo');
const rigorTardio = cartas('ev_rigor')[0];
const janelaTardia = leitura('leitura_mestre_janela');
const jt = janelaTardia ? janelaTardia.tagsOcultas : null;
const morte = SEED_TUTORIAL.horaMorteAbsoluta;
const degradadoValido = !rigorTardio.tagsOcultas.inconclusiva && rigorTardio.textoDisplay === 'Corpo Flácido';
const cobreVerdade = !!jt && jt.inicio <= morte && morte <= jt.fim;
console.log('\n=== (e) DEGRADAÇÃO POR PRECISÃO ===');
console.log('rigor tardio:', rigorTardio.textoDisplay, '| janela do mestre:', janelaTardia ? janelaTardia.resumo : '(—)');
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
