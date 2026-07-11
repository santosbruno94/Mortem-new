// =====================================================================
// QA estático (§17 do contexto): traça os perfis de jogador pelos dados e pelo motor,
// sem playtest interativo. Executar com: node scripts/qa.mjs
//
// ETAPA 1 (Construção da Acusação): o jogador não preenche mais um Libelo —
// ele CONSTRÓI a cadeia, afirmando réu/janela/causa/motivo/juízos e LIGANDO
// cartas (os "barbantes"). O julgamento é calcularVeredictoCadeia, lendo a
// cadeia construída contra a Verdade de Ouro. Continua valendo:
//   • o relógio só anda ao VIAJAR (viajarPara); examinar congela o relógio;
//   • o legista ainda FALA a leitura (dica), mas é a AFIRMAÇÃO do jogador
//     que o veredicto lê — não a conclusão do mestre;
//   • nada valida durante a investigação; só o julgamento final.
//
// As cinco checagens garantem o critério de validação do caso: solúvel pelo
// Metódico, ≥1 armadilha para o Apressado, Impunidade para o Intuitivo, e o
// perecível degrada perdendo precisão (não valor), com o durável resolvendo.
// =====================================================================

import { useJogo } from '../src/store/jogo.js';
import { ANCORAS, analisarLigacoes, refutacaoDeHoraEstabelecida } from '../src/logic/acusacao.js';
import { janelaDaCarta } from '../src/logic/cronos.js';
import { intersecaoJanelas } from '../src/logic/tempo_morte.js';
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

// Desenhar um barbante entre dois nós (cartas ou âncoras).
function ligar(de, para) {
  return s().adicionarLigacao(de, para);
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
// (a) METÓDICO — corpo primeiro (fresco), reúne tudo, AFIRMA a janela e a
// causa, liga as sustentações, refuta o avistamento falso, DERRUBA O
// RELÓGIO ENCENADO (Q1: só a peça forjada expõe a encenação), fura o
// álibi do réu pela corroboração de Moorford (Q4) e expõe a mentira
// da governanta (mentiu, mas é inocente). Esperado: vitoria_absoluta.
// ============================================================
reiniciar();
s().viajarPara('corpo'); // 0h — corpo fresco às 11h
s().medirTemperatura();
['ev_rigor', 'ev_livores', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'].forEach((id) => s().extrairCarta(id));
s().viajarPara('cena');
['ev_relogio', 'ev_gavetas', 'ev_fechadura', 'ev_fio_la'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia'); // +1h
['dep_testamento', 'dep_visto_vivo', 'dep_avistamento_falso'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_edgar'); // +1h
['alibi_edgar', 'ev_fibras_manga'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_hudson'); // +1h
['alibi_hudson', 'ev_xale'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_blackwood'); // +1h
['alibi_blackwood'].forEach((id) => s().extrairCarta(id));
s().viajarPara('clube_moorford'); // +1h30 — a contraprova do álibi do réu
s().extrairCarta('corrob_moorford');

// Afirmações estruturadas:
s().definirReu('edgar_arthurs');
s().definirJanela({ inicio: -4, fim: -1 }); // 20h–23h de 13/out: contém a verdade (-2), ≤6h
s().definirCausa('estrangulamento_ligadura');
s().definirMotivacao('dep_testamento');
// Sustentações (barbantes para as âncoras):
['ev_rigor', 'ev_livores', 'ev_algor', 'dep_visto_vivo'].forEach((id) => ligar(id, ANCORAS.quando));
['ev_sulco', 'ev_petequias'].forEach((id) => ligar(id, ANCORAS.como));
ligar('ev_fibras_manga', ANCORAS.presenca); // fibra de cânhamo no punho de Edgar
// Refutações de hora: a vizinha (08h) e o RELÓGIO FORJADO (09h) caem pelo corpo.
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, 'dep_avistamento_falso'));
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, 'ev_relogio'));
// O paradeiro do réu cai pelo registro do clube (Q4 — opcional, nunca pilar).
ligar('corrob_moorford', 'alibi_edgar');
// Juízo sobre os não-acusados:
s().definirJuizo('thomas_blackwood', 'inocente');
s().definirJuizo('sra_hudson', 'inocente');
// Expõe a mentira-segredo da governanta (lã na gaveta): mentiu, mas por vergonha.
ligar('ev_xale', 'alibi_hudson');

s().submeterAcusacao();
const vMetodico = s().veredicto;
relatar('(a) METÓDICO — esperado: vitoria_absoluta', vMetodico);

// ============================================================
// (b) APRESSADO — persegue iscas, chega tarde ao corpo e acusa a governanta
// nervosa: quebra a mentira dela e conclui "mentiu, logo matou". Réu errado.
// Esperado: erro_judiciario.
// ============================================================
reiniciar();
s().viajarPara('cena');
['ev_relogio', 'ev_gavetas', 'ev_fechadura', 'ev_fio_la'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_edgar'); // extrai o álibi → desbloqueia Moorford
['alibi_edgar', 'comp_edgar', 'ev_fibras_manga'].forEach((id) => s().extrairCarta(id));
s().viajarPara('clube_moorford'); // +1h30 atrás da isca de Moorford
s().viajarPara('interrogatorio_hudson'); // +1h30 de volta à vila
['alibi_hudson', 'comp_hudson', 'ev_xale'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_blackwood'); // +1h
['alibi_blackwood', 'comp_blackwood'].forEach((id) => s().extrairCarta(id));
s().viajarPara('corpo'); // +1h: só agora chega ao corpo
console.log('\n--- Apressado: chega ao corpo às', formatRelogio(s().horasJogo), '---');
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().medirTemperatura();

s().definirReu('sra_hudson');
s().definirJanela({ inicio: -13, fim: 16 }); // larga (chegou tarde)
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, ANCORAS.quando));
ligar('ev_xale', 'alibi_hudson'); // quebra a mentira dela...
s().definirJuizo('sra_hudson', 'culpado'); // ...e conclui errado (a armadilha)
s().submeterAcusacao();
const vApressado = s().veredicto;
relatar('(b) APRESSADO — esperado: erro_judiciario', vApressado);

// ============================================================
// (c) INTUITIVO — acusa Edgar de imediato, com a janela larga e o móbil,
// mas SEM materialidade (sem causa cravada, sem presença). Réu certo, tese
// furada. Esperado: impunidade.
// ============================================================
reiniciar();
s().viajarPara('corpo');
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia');
s().extrairCarta('dep_testamento');
s().definirReu('edgar_arthurs');
s().definirJanela({ inicio: -13, fim: -1 }); // cobre a verdade, mas larga
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, ANCORAS.quando));
s().definirMotivacao('dep_testamento');
s().submeterAcusacao();
const vIntuitivo = s().veredicto;
relatar('(c) INTUITIVO — esperado: impunidade', vIntuitivo);

// ============================================================
// (d) PERICIAL DESATENTO — tripé completo (janela precisa + causa cravada +
// presença), mas cadeia lacunosa (sem móbil, sem encenação, sem juízos).
// Esperado: sucesso_gafes.
// ============================================================
reiniciar();
s().viajarPara('corpo');
s().medirTemperatura();
['ev_rigor', 'ev_livores', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_edgar');
s().extrairCarta('ev_fibras_manga');
s().definirReu('edgar_arthurs');
s().definirJanela({ inicio: -4, fim: -1 });
s().definirCausa('estrangulamento_ligadura');
['ev_rigor', 'ev_livores', 'ev_algor'].forEach((id) => ligar(id, ANCORAS.quando));
ligar('ev_sulco', ANCORAS.como);
ligar('ev_fibras_manga', ANCORAS.presenca);
// sem móbil, sem refutação da encenação, sem juízos → gafes
s().submeterAcusacao();
const vDesatento = s().veredicto;
relatar('(d) PERICIAL DESATENTO — esperado: sucesso_gafes', vDesatento);

// ============================================================
// (e) DEGRADAÇÃO POR PRECISÃO + SOLVABILIDADE DURÁVEL (relógio mole).
// Um perito que andou tempo demais (IPM bem alto): o rigor degrada para uma
// leitura VAGA — mas não nula —, e a âncora durável (livor fixo + visto-vivo)
// ainda fecha uma janela que COBRE a hora real da morte.
// ============================================================
reiniciar();
useJogo.setState({ horasJogo: 52 }); // perito muito lento: IPM ~54h
s().viajarPara('corpo');
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().medirTemperatura();
s().viajarPara('delegacia');
s().extrairCarta('dep_visto_vivo');
const rigorTardio = cartas('ev_rigor')[0];
const duraveis = cartas('ev_rigor', 'ev_livores', 'dep_visto_vivo');
const janelaDuravel = intersecaoJanelas(duraveis.map(janelaDaCarta).filter(Boolean));
const morte = SEED_TUTORIAL.horaMorteAbsoluta;
const degradadoValido = !rigorTardio.tagsOcultas.inconclusiva && rigorTardio.textoDisplay === 'Corpo Flácido';
const cobreVerdade = !!janelaDuravel && janelaDuravel.inicio <= morte && morte <= janelaDuravel.fim;
console.log('\n=== (e) DEGRADAÇÃO POR PRECISÃO ===');
console.log('rigor tardio:', rigorTardio.textoDisplay, '| janela durável:', JSON.stringify(janelaDuravel));
console.log('rigor degradado ainda é válido (não nulo):', degradadoValido);
console.log('janela durável cobre a verdade:', cobreVerdade);

// ============================================================
// (f) TESTEMUNHO FALSO + CONTRATO DE JUSTIÇA (Estágio 4).
// O caseiro Pruitt jura ter visto a governanta matar à meia-noite (00h). O
// corpo diz 22h: a janela que rigor+livor sustentam fecha por volta das 23h
// e exclui a meia-noite. O metódico REFUTA pela janela (fato físico); o
// crente que acredita e acusa a Hudson cai em erro judiciário (réu errado).
// ============================================================
reiniciar();
s().viajarPara('corpo');
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia');
s().extrairCarta('dep_acusa_hudson');
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, 'dep_acusa_hudson'));
const refFalso = analisarLigacoes(s().acusacao, s().cartasRegistradas).refutaHora.get('dep_acusa_hudson');
const testemunhoRefutavel = !!refFalso && refutacaoDeHoraEstabelecida(refFalso.alegacao, refFalso.fatos);

reiniciar();
s().viajarPara('delegacia');
s().extrairCarta('dep_acusa_hudson');
s().definirReu('sra_hudson'); // acredita no relato e acusa a governanta
s().submeterAcusacao();
const vCrente = s().veredicto;
console.log('\n=== (f) TESTEMUNHO FALSO ===');
console.log('falso testemunho refutável pela janela do corpo:', testemunhoRefutavel);
console.log('crente que acusa a Hudson:', vCrente.tipo);

// ============================================================
// (g) SEGUNDO RASTRO DO RÉU (presença). Um vestígio do próprio réu (o lenço
// monogramado, na cena) reforça a presença SEM gafe quando ligado junto ao
// instrumental (o cânhamo no punho); sozinho, porém, não basta — o nexo
// continua exigindo o vestígio instrumental.
// ============================================================
reiniciar();
s().viajarPara('cena');
s().extrairCarta('ev_lenco');
s().viajarPara('interrogatorio_edgar');
s().extrairCarta('ev_fibras_manga');
s().definirReu('edgar_arthurs');
ligar('ev_fibras_manga', ANCORAS.presenca);
ligar('ev_lenco', ANCORAS.presenca);
s().submeterAcusacao();
const reforcoSemGafe = s().veredicto.falhas.every(
  (f) => f.codigo !== 'nexo_acessorio' && f.codigo !== 'nexo_errado' && f.codigo !== 'sem_nexo'
);

reiniciar();
s().viajarPara('cena');
s().extrairCarta('ev_lenco');
s().definirReu('edgar_arthurs');
ligar('ev_lenco', ANCORAS.presenca);
s().submeterAcusacao();
const soLencoFalha = s().veredicto.falhas.some((f) => f.codigo === 'nexo_errado');
console.log('\n=== (g) SEGUNDO RASTRO DO RÉU ===');
console.log('lenço + cânhamo reforça sem gafe:', reforcoSemGafe);
console.log('lenço sozinho falha o nexo (instrumental exigido):', soLencoFalha);

// ============================================================
// (h) CONTRATO DO DESFECHO (Q1): derrubar SÓ a testemunha equivocada não
// expõe a encenação — o crédito exige a peça forjada (o relógio).
// ============================================================
reiniciar();
s().viajarPara('corpo');
s().medirTemperatura();
['ev_rigor', 'ev_livores', 'ev_sulco', 'ev_petequias', 'ev_fibras_sulco'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia');
['dep_testamento', 'dep_avistamento_falso'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_edgar');
s().extrairCarta('ev_fibras_manga');
s().definirReu('edgar_arthurs');
s().definirJanela({ inicio: -4, fim: -1 });
s().definirCausa('estrangulamento_ligadura');
['ev_rigor', 'ev_livores', 'ev_algor'].forEach((id) => ligar(id, ANCORAS.quando));
['ev_sulco', 'ev_petequias'].forEach((id) => ligar(id, ANCORAS.como));
ligar('ev_fibras_manga', ANCORAS.presenca);
s().definirMotivacao('dep_testamento');
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, 'dep_avistamento_falso')); // só a vizinha
s().submeterAcusacao();
const vSoTestemunha = s().veredicto;
const encenacaoNaoCreditada =
  vSoTestemunha.falhas.some((f) => f.codigo === 'sem_descuidos') &&
  vSoTestemunha.dadosMonologo.descuidosOk === false &&
  vSoTestemunha.dadosMonologo.testemunhasDesmentidas === 1;
console.log('\n=== (h) CONTRATO DO DESFECHO ===');
console.log('refutar só a vizinha NÃO credita a encenação:', encenacaoNaoCreditada);

// ============================================================
// (i) O ÁLIBI DO RÉU CAI PELO REGISTRO (Q4): a corroboração de Moorford
// refuta o paradeiro declarado de Edgar — opcional, nunca pilar.
// ============================================================
reiniciar();
s().viajarPara('interrogatorio_edgar');
s().extrairCarta('alibi_edgar'); // desbloqueia Moorford
s().viajarPara('clube_moorford');
s().extrairCarta('corrob_moorford');
s().definirReu('edgar_arthurs');
ligar('corrob_moorford', 'alibi_edgar');
s().submeterAcusacao();
const vAlibiReu = s().veredicto;
const alibiReuCai = vAlibiReu.dadosMonologo.alibiReuExposto === true;
console.log('\n=== (i) ÁLIBI DO RÉU ===');
console.log('registro de Moorford derruba o paradeiro do réu:', alibiReuCai);

// ============================================================
// Fumaça do monólogo: todos os desfechos geram texto.
// ============================================================
console.log('\n=== Monólogos gerados (fumaça) ===');
for (const { rotulo, monologo } of monologos) {
  console.log(`· ${rotulo} → "${monologo.titulo}", ${monologo.blocos.length} blocos`);
}

// ============================================================
// Critério de validação do caso (§17 do contexto)
// ============================================================
const apressadoCaiEmArmadilha = vApressado.falhas.length >= 1 && vApressado.tipo !== 'vitoria_absoluta';
const checagens = [
  ['Metódico resolve (vitoria_absoluta)', vMetodico.tipo === 'vitoria_absoluta'],
  ['Apressado cai em ≥1 armadilha (réu errado)', apressadoCaiEmArmadilha && vApressado.tipo === 'erro_judiciario'],
  ['Intuitivo alcança Impunidade (réu certo, provas furadas)', vIntuitivo.tipo === 'impunidade'],
  ['Pericial desatento condena com gafes (sucesso_gafes)', vDesatento.tipo === 'sucesso_gafes'],
  ['Degradado perde precisão, não some (rigor resolvido válido)', degradadoValido],
  ['Durável sempre resolve (janela cobre a verdade mesmo tarde)', cobreVerdade],
  ['Testemunho falso é refutável pela janela do corpo', testemunhoRefutavel],
  ['Crente no testemunho falso acusa a Hudson → erro_judiciario', vCrente.tipo === 'erro_judiciario'],
  ['Segundo rastro do réu reforça sem gafe; sozinho não basta', reforcoSemGafe && soLencoFalha],
  ['Refutar só a testemunha não credita a encenação (contrato do desfecho)', encenacaoNaoCreditada],
  ['O registro de Moorford derruba o paradeiro do réu (opcional, nunca pilar)', alibiReuCai],
];
console.log('\n=== Critério de validação ===');
let todasOk = true;
for (const [rotulo, ok] of checagens) {
  console.log(`${ok ? 'OK ' : 'FALHA'} — ${rotulo}`);
  if (!ok) todasOk = false;
}
console.log(todasOk ? '\nCASO VÁLIDO.' : '\nCASO INVÁLIDO.');
process.exit(todasOk ? 0 : 1);
