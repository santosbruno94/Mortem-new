// =====================================================================
// QA estático (§17 do contexto): traça os perfis de jogador pelos dados e pelo motor,
// sem playtest interativo. Executar com: node scripts/qa.mjs
//
// Caso corrente: "A Hora Emprestada" (src/data/seed.js). O jogador não
// preenche um formulário — ele CONSTRÓI a cadeia, afirmando réu/janela/
// causa/motivo/juízos e LIGANDO cartas (os "barbantes"). O julgamento é
// calcularVeredictoCadeia, lendo a cadeia construída contra a Verdade de
// Ouro. Continua valendo:
//   • o relógio só anda ao VIAJAR (viajarPara); examinar congela o relógio;
//   • o legista ainda FALA a leitura (dica), mas é a AFIRMAÇÃO do jogador
//     que o veredicto lê — não a conclusão do mestre;
//   • nada valida durante a investigação; só o julgamento final.
//
// As checagens garantem o critério de validação do caso: solúvel pelo
// Metódico, ≥1 armadilha para o Apressado, Impunidade para o Intuitivo, e o
// perecível degrada perdendo precisão (não valor), com o durável resolvendo.
// =====================================================================

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { useJogo } from '../src/store/jogo.js';
import { ANCORAS, analisarLigacoes, refutacaoDeHoraEstabelecida } from '../src/logic/acusacao.js';
import { janelaDaCarta } from '../src/logic/cronos.js';
import { intersecaoJanelas } from '../src/logic/tempo_morte.js';
import { formatRelogio } from '../src/logic/tempo.js';
import { gerarMonologo } from '../src/logic/monologo.js';
import { slotsNaoResolvidos } from '../src/logic/interpolar.js';
import { PAPEIS } from '../src/data/papeis.js';
import { HABITOS } from '../src/data/curriculo.js';
import { gerarEpilogo } from '../src/logic/epilogo.js';
import { obterAparencia, derivarAparenciaDeSeed } from '../src/logic/aparencia.js';
import { POSICOES_DIORAMA, FORMAS_PREDIO } from '../src/data/mapa_espacial.js';
import { HOTSPOTS_CORPO } from '../src/data/hotspots_corpo.js';
import {
  montarPacoteTutorial,
  carregarCaso,
  obterDefinicaoCarta,
  resolverEstadoCarta,
  CAMPOS_OBRIGATORIOS_PACOTE,
} from '../src/data/pacote_caso.js';
import { causasCompativeis, mecanismoCravado } from '../src/data/catalogo_causas.js';
import { MANIFESTO_ASSETS } from '../src/data/manifesto_assets.js';
import { SLOTS_ASSETS, DIR_BASE_ASSETS } from '../src/data/slots_assets.js';
import { CAMADAS_RETRATO } from '../src/data/camadas_retrato.js';
import { gerarElenco } from '../src/gerador/amostragem.js';
import {
  ARQUETIPOS,
  FAIXAS_IDADE,
  MOTIVOS_POTENCIAIS,
  PROVENIENCIA_TABELAS,
  CLASSES_SOCIAIS,
} from '../src/gerador/arquetipos.js';
import {
  CATALOGO_COMPORTAMENTOS,
  TRAITS,
  MAPA_TRAIT_COMPORTAMENTO,
} from '../src/gerador/comportamentos.js';
import { gerarMundo } from '../src/gerador/mundo.js';
import {
  TIPOS_PREDIO,
  MOBILIA_POR_CLASSE,
  MOBILIA_DE_OFICIO,
  VOCABULARIO_DA_CLASSE,
  PROVENIENCIA_ESPACO,
} from '../src/gerador/espaco.js';
import { gerarCasoBruto } from '../src/gerador/caso.js';
import { METODOS, PROVENIENCIA_METODOS } from '../src/gerador/metodos.js';
import { CLASSES_VESTIGIO, VARIAVEIS_BATALHA, PROVENIENCIA_VESTIGIOS } from '../src/gerador/vestigios.js';

// ============================================================
// O CASO SOB TESTE É UM PACOTE. As guardas estáticas rodam contra o pacote
// do caso-escola (montarPacoteTutorial), não mais contra os módulos crus:
// é o mesmo contrato que o futuro gerador terá de satisfazer. `carregarCaso`
// fixa este pacote no módulo, para que os perfis (que dirigem o store) e as
// guardas leiam exatamente o mesmo caso.
// ============================================================
const pacote = montarPacoteTutorial();
carregarCaso(pacote);
const {
  verdadeDeOuro: SEED_TUTORIAL,
  cartas: CARTAS,
  localidades: LOCALIDADES,
  dialogos: DIALOGOS,
  nosMapa: NOS_MAPA,
} = pacote;

const monologos = [];
const estadoInicial = { ...useJogo.getState() };

function reiniciar() {
  useJogo.setState(estadoInicial, true);
  useJogo.getState().escolherDetective();
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
// causa, liga as sustentações, derruba o MOSTRADOR FORJADO pela própria
// roda de contagem (a encenação exposta), desmente o padeiro, fura o
// paradeiro do réu pelo registro da estalagem e expõe as mentiras de
// vergonha de Walter e Agnes. Esperado: vitoria_absoluta.
// ============================================================
reiniciar();
s().viajarPara('corpo'); // 0h — corpo fresco às 11h
s().medirTemperatura();
['ev_rigor', 'ev_livores', 'ev_ferida', 'ev_reacao_vital', 'ev_residuo_ferida', 'ev_relogio_bolso'].forEach((id) =>
  s().extrairCarta(id)
);
s().viajarPara('cena'); // 0h — mesmo prédio
['ev_relogio_lareira', 'ev_maquinismo', 'ev_vitrine', 'ev_fechadura', 'ev_cesta_rooke', 'ev_suplica_cesto'].forEach(
  (id) => s().extrairCarta(id)
);
s().viajarPara('oficina'); // 0h
['ev_livro_ordens', 'ev_estojo_buril', 'dep_habito_corda', 'alibi_davey'].forEach((id) => s().extrairCarta(id));
s().viajarPara('interrogatorio_silas'); // 0h
['alibi_silas', 'comp_silas', 'ev_vidro_dobra'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia'); // +1h
['dep_testamento', 'dep_visto_vivo', 'dep_avistamento_padeiro'].forEach((id) => s().extrairCarta(id));
s().viajarPara('estalagem'); // +1h
['alibi_walter', 'ev_registro_estalagem', 'corrob_estalajadeiro'].forEach((id) => s().extrairCarta(id));
s().viajarPara('papelaria'); // +1h
['alibi_agnes'].forEach((id) => s().extrairCarta(id));
s().viajarPara('moinho'); // +1h
['alibi_grey'].forEach((id) => s().extrairCarta(id));

// Afirmações estruturadas:
s().definirReu('silas_crane');
s().definirJanela({ inicio: -3, fim: -2 }); // 21h–22h de 13/out: contém a verdade (-3), ≤6h
s().definirCausa('ferida_arma_branca');
s().definirMotivacao('ev_livro_ordens');
// Sustentações (barbantes para as âncoras):
['ev_rigor', 'ev_livores', 'ev_algor', 'ev_relogio_bolso', 'ev_maquinismo', 'dep_visto_vivo'].forEach((id) =>
  ligar(id, ANCORAS.quando)
);
['ev_ferida', 'ev_reacao_vital', 'ev_residuo_ferida'].forEach((id) => ligar(id, ANCORAS.como));
ligar('ev_estojo_buril', ANCORAS.presenca); // o buril lavado, no estojo de Silas
ligar('ev_vidro_dobra', ANCORAS.presenca); // reforço: vidro do mostrador na bainha dele
// Refutações de hora: o padeiro (05h15) e o MOSTRADOR FORJADO (08h45) caem
// pelo corpo e pela roda de contagem.
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, 'dep_avistamento_padeiro'));
['ev_rigor', 'ev_livores', 'ev_maquinismo'].forEach((id) => ligar(id, 'ev_relogio_lareira'));
// O paradeiro do réu cai pelo registro da estalagem (opcional, nunca pilar).
ligar('corrob_estalajadeiro', 'alibi_silas');
ligar('ev_vidro_dobra', 'alibi_silas');
// Juízo sobre os não-acusados:
s().definirJuizo('walter_arthurs', 'inocente');
s().definirJuizo('agnes_rooke', 'inocente');
s().definirJuizo('caleb_grey', 'inocente');
s().definirJuizo('davey_tull', 'inocente');
// Expõe as mentiras-segredo: a assinatura de sexta na estalagem (Walter) e
// a cesta de ceia na copa (Agnes) — mentiram, mas por outra razão.
ligar('ev_registro_estalagem', 'alibi_walter');
ligar('ev_cesta_rooke', 'alibi_agnes');

s().submeterAcusacao();
const vMetodico = s().veredicto;
relatar('(a) METÓDICO — esperado: vitoria_absoluta', vMetodico);

// ============================================================
// (b) APRESSADO — persegue iscas (testamento, dívidas, briga), gasta a
// tarde na estrada de Moorford, quebra a mentira do herdeiro e conclui
// "mentiu, logo matou". Réu errado. Esperado: erro_judiciario.
// ============================================================
reiniciar();
s().viajarPara('cena');
['ev_relogio_lareira', 'ev_vitrine', 'ev_fechadura', 'ev_suplica_cesto'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia'); // +1h — extrai o testamento → desbloqueia o gabinete
['dep_testamento', 'dep_dividas_walter', 'dep_briga_walter'].forEach((id) => s().extrairCarta(id));
s().viajarPara('gabinete_pettigrew'); // +1h30 atrás da isca (volta mais convencido)
s().extrairCarta('corrob_pettigrew');
s().viajarPara('estalagem'); // +1h30 de volta à vila
['alibi_walter', 'ev_registro_estalagem'].forEach((id) => s().extrairCarta(id));
s().viajarPara('corpo'); // +1h: só agora chega ao corpo
console.log('\n--- Apressado: chega ao corpo às', formatRelogio(s().horasJogo), '---');
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().medirTemperatura();

s().definirReu('walter_arthurs');
s().definirJanela({ inicio: -13, fim: 16 }); // larga (chegou tarde)
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, ANCORAS.quando));
ligar('ev_suplica_cesto', ANCORAS.presenca); // o rastro dele na cena (de outra hora)
ligar('ev_registro_estalagem', 'alibi_walter'); // quebra a mentira dele...
s().definirMotivacao('dep_testamento'); // ...e cola o móbil da herança (a armadilha)
s().submeterAcusacao();
const vApressado = s().veredicto;
relatar('(b) APRESSADO — esperado: erro_judiciario', vApressado);

// ============================================================
// (c) INTUITIVO — "quem acha o corpo": acusa Silas de imediato, com a
// janela larga, mas SEM materialidade (sem causa cravada, sem presença).
// Réu certo, tese furada. Esperado: impunidade.
// ============================================================
reiniciar();
s().viajarPara('corpo');
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia');
s().extrairCarta('dep_visto_vivo');
s().definirReu('silas_crane');
s().definirJanela({ inicio: -13, fim: -1 }); // cobre a verdade, mas larga
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, ANCORAS.quando));
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
['ev_rigor', 'ev_livores', 'ev_ferida', 'ev_relogio_bolso'].forEach((id) => s().extrairCarta(id));
s().viajarPara('cena');
s().extrairCarta('ev_maquinismo');
s().viajarPara('oficina');
s().extrairCarta('ev_estojo_buril');
s().definirReu('silas_crane');
s().definirJanela({ inicio: -3, fim: -2 });
s().definirCausa('ferida_arma_branca');
['ev_rigor', 'ev_livores', 'ev_algor', 'ev_relogio_bolso', 'ev_maquinismo'].forEach((id) => ligar(id, ANCORAS.quando));
ligar('ev_ferida', ANCORAS.como);
ligar('ev_estojo_buril', ANCORAS.presenca);
// sem móbil, sem refutação da encenação, sem juízos → gafes
s().submeterAcusacao();
const vDesatento = s().veredicto;
relatar('(d) PERICIAL DESATENTO — esperado: sucesso_gafes', vDesatento);

// ============================================================
// (e) DEGRADAÇÃO POR PRECISÃO + SOLVABILIDADE DURÁVEL (relógio mole).
// Um perito que andou tempo demais (IPM bem alto): o rigor degrada para uma
// leitura VAGA — mas não nula —, e a âncora durável (livor fixo + visto-vivo
// + relógio de bolso) ainda fecha uma janela que COBRE a hora real da morte.
// O relógio de bolso é o único teto que NÃO afrouxa com o passar das horas.
// ============================================================
reiniciar();
useJogo.setState({ horasJogo: 52 }); // perito muito lento: IPM ~55h
s().viajarPara('corpo');
['ev_rigor', 'ev_livores', 'ev_relogio_bolso'].forEach((id) => s().extrairCarta(id));
s().medirTemperatura();
s().viajarPara('delegacia');
s().extrairCarta('dep_visto_vivo');
const rigorTardio = cartas('ev_rigor')[0];
const duraveis = cartas('ev_livores', 'dep_visto_vivo', 'ev_relogio_bolso');
const janelaDuravel = intersecaoJanelas(duraveis.map(janelaDaCarta).filter(Boolean));
const morte = SEED_TUTORIAL.horaMorteAbsoluta;
const degradadoValido = !rigorTardio.tagsOcultas.inconclusiva && rigorTardio.textoDisplay === 'Corpo Flácido';
const cobreVerdade = !!janelaDuravel && janelaDuravel.inicio <= morte && morte <= janelaDuravel.fim;
const janelaDuravelFinita = !!janelaDuravel && Number.isFinite(janelaDuravel.fim - janelaDuravel.inicio);
console.log('\n=== (e) DEGRADAÇÃO POR PRECISÃO ===');
console.log('rigor tardio:', rigorTardio.textoDisplay, '| janela durável:', JSON.stringify(janelaDuravel));
console.log('rigor degradado ainda é válido (não nulo):', degradadoValido);
console.log('janela durável cobre a verdade e é finita:', cobreVerdade && janelaDuravelFinita);

// ============================================================
// (f) TESTEMUNHO FALSO + CONTRATO DE JUSTIÇA.
// O moço do padeiro jura o morto "vivo e trabalhando" às 05h15 (viu a luz
// do lampião esquecido). O corpo diz outra coisa: a janela que rigor+livor
// sustentam fecha antes da meia-noite e exclui as 05h15. O metódico REFUTA
// pela janela (fato físico); o crente que segue a última visita conhecida
// e acusa a Sra. Rooke cai em erro judiciário (réu errado).
// ============================================================
reiniciar();
s().viajarPara('corpo');
['ev_rigor', 'ev_livores'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia');
s().extrairCarta('dep_avistamento_padeiro');
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, 'dep_avistamento_padeiro'));
const refFalso = analisarLigacoes(s().acusacao, s().cartasRegistradas).refutaHora.get('dep_avistamento_padeiro');
const testemunhoRefutavel = !!refFalso && refutacaoDeHoraEstabelecida(refFalso.alegacao, refFalso.fatos);

reiniciar();
s().viajarPara('delegacia');
s().extrairCarta('dep_mulher_viela');
s().viajarPara('cena');
s().extrairCarta('ev_cesta_rooke');
s().definirReu('agnes_rooke'); // "a última com o morto" — acredita e acusa
s().submeterAcusacao();
const vCrente = s().veredicto;
console.log('\n=== (f) TESTEMUNHO FALSO ===');
console.log('avistamento do padeiro refutável pela janela do corpo:', testemunhoRefutavel);
console.log('crente que acusa a Sra. Rooke:', vCrente.tipo);

// ============================================================
// (g) SEGUNDO RASTRO DO RÉU (presença). Um vestígio do próprio réu (o vidro
// do mostrador na bainha) reforça a presença SEM gafe quando ligado junto
// ao instrumental (o buril lavado); sozinho, porém, não basta — o nexo
// continua exigindo o vestígio instrumental.
// ============================================================
reiniciar();
s().viajarPara('interrogatorio_silas');
s().extrairCarta('ev_vidro_dobra');
s().viajarPara('oficina');
s().extrairCarta('ev_estojo_buril');
s().definirReu('silas_crane');
ligar('ev_estojo_buril', ANCORAS.presenca);
ligar('ev_vidro_dobra', ANCORAS.presenca);
s().submeterAcusacao();
const reforcoSemGafe = s().veredicto.falhas.every(
  (f) => f.codigo !== 'nexo_acessorio' && f.codigo !== 'nexo_errado' && f.codigo !== 'sem_nexo'
);

reiniciar();
s().viajarPara('interrogatorio_silas');
s().extrairCarta('ev_vidro_dobra');
s().definirReu('silas_crane');
ligar('ev_vidro_dobra', ANCORAS.presenca);
s().submeterAcusacao();
const soVidroFalha = s().veredicto.falhas.some((f) => f.codigo === 'nexo_errado');
console.log('\n=== (g) SEGUNDO RASTRO DO RÉU ===');
console.log('vidro + buril reforça sem gafe:', reforcoSemGafe);
console.log('vidro sozinho falha o nexo (instrumental exigido):', soVidroFalha);

// ============================================================
// (h) CONTRATO DO DESFECHO: derrubar SÓ a testemunha equivocada não expõe
// a encenação — o crédito exige a peça forjada (o mostrador da lareira).
// ============================================================
reiniciar();
s().viajarPara('corpo');
s().medirTemperatura();
['ev_rigor', 'ev_livores', 'ev_ferida', 'ev_relogio_bolso'].forEach((id) => s().extrairCarta(id));
s().viajarPara('oficina');
['ev_livro_ordens', 'ev_estojo_buril'].forEach((id) => s().extrairCarta(id));
s().viajarPara('delegacia');
s().extrairCarta('dep_avistamento_padeiro');
s().definirReu('silas_crane');
s().definirJanela({ inicio: -4, fim: -1 });
s().definirCausa('ferida_arma_branca');
['ev_rigor', 'ev_livores', 'ev_algor', 'ev_relogio_bolso'].forEach((id) => ligar(id, ANCORAS.quando));
ligar('ev_ferida', ANCORAS.como);
ligar('ev_estojo_buril', ANCORAS.presenca);
s().definirMotivacao('ev_livro_ordens');
['ev_rigor', 'ev_livores'].forEach((id) => ligar(id, 'dep_avistamento_padeiro')); // só o padeiro
s().submeterAcusacao();
const vSoTestemunha = s().veredicto;
const encenacaoNaoCreditada =
  vSoTestemunha.falhas.some((f) => f.codigo === 'sem_descuidos') &&
  vSoTestemunha.dadosMonologo.descuidosOk === false &&
  vSoTestemunha.dadosMonologo.testemunhasDesmentidas === 1;
console.log('\n=== (h) CONTRATO DO DESFECHO ===');
console.log('refutar só o padeiro NÃO credita a encenação:', encenacaoNaoCreditada);

// ============================================================
// (i) O ÁLIBI DO RÉU CAI PELO REGISTRO: o estalajadeiro (quarto às escuras
// às 21h, portão passado das 22h) refuta o paradeiro declarado de Silas —
// opcional, nunca pilar. E cai por REGISTRO, não por rastro.
// ============================================================
reiniciar();
s().viajarPara('interrogatorio_silas');
s().extrairCarta('alibi_silas');
s().viajarPara('estalagem');
s().extrairCarta('corrob_estalajadeiro');
s().definirReu('silas_crane');
ligar('corrob_estalajadeiro', 'alibi_silas');
s().submeterAcusacao();
const vAlibiReu = s().veredicto;
const alibiReuCai =
  vAlibiReu.dadosMonologo.alibiReuExposto === true && vAlibiReu.dadosMonologo.alibiReuPorRegistro === true;
console.log('\n=== (i) ÁLIBI DO RÉU ===');
console.log('o registro da estalagem derruba o paradeiro do réu:', alibiReuCai);

// ============================================================
// (j) ROTINA INTERROMPIDA dá TETO durável: o hábito não cumprido do morto
// (dar corda ao relógio de bolso às 23h) trava o FIM da janela — espelho
// do visto-com-vida, que trava o início. Juntos fecham janela FINITA.
// Cartas sintéticas: o contrato é do MOTOR, não do caso corrente.
// ============================================================
const cartaRotina = {
  id: 'sint_rotina',
  horaRegistro: 11,
  tagsOcultas: { dominio: 'temporal', subDominio: 'rotina_interrompida', horaRotina: -1 },
};
const cartaVistoVivo = {
  id: 'sint_visto',
  horaRegistro: 11,
  tagsOcultas: { dominio: 'temporal', subDominio: 'ultima_vez_visto', horaAvistamento: -4 },
};
const jRotina = janelaDaCarta(cartaRotina);
const rotinaDaTeto = !!jRotina && jRotina.inicio === -Infinity && jRotina.fim === -1;
const jDuravelFinita = intersecaoJanelas([jRotina, janelaDaCarta(cartaVistoVivo)]);
const pisoMaisTetoFecham =
  !!jDuravelFinita &&
  jDuravelFinita.inicio === -4 &&
  jDuravelFinita.fim === -1 &&
  Number.isFinite(jDuravelFinita.fim - jDuravelFinita.inicio);
console.log('\n=== (j) ROTINA INTERROMPIDA ===');
console.log('rotina não cumprida trava o teto da janela:', rotinaDaTeto);
console.log('piso (visto-vivo) + teto (rotina) fecham janela finita:', pisoMaisTetoFecham);

// ============================================================
// (k) REGISTRO MECÂNICO: o maquinismo grava uma faixa fixa de horas
// (independe do exame e não degrada) e, como fato temporal, REFUTA uma
// alegação de hora que caia fora dela — o mostrador forjado cai pela
// própria máquina.
// ============================================================
const cartaMaquinismo = {
  id: 'sint_maquinismo',
  horaRegistro: 30, // exame tardio: a janela mecânica não depende do exame
  tagsOcultas: { dominio: 'temporal', subDominio: 'registro_mecanico', janelaInicio: -3, janelaFim: -2 },
};
const cartaMostradorForjado = {
  id: 'sint_mostrador',
  horaRegistro: 11,
  tagsOcultas: { dominio: 'ambiental', horaAparente: 8.75, encenado: true, isca: true },
};
const jMecanica = janelaDaCarta(cartaMaquinismo);
const registroMecanicoFixo = !!jMecanica && jMecanica.inicio === -3 && jMecanica.fim === -2;
const mostradorCaiPelaMaquina = refutacaoDeHoraEstabelecida(cartaMostradorForjado, [cartaMaquinismo]);
console.log('\n=== (k) REGISTRO MECÂNICO ===');
console.log('janela mecânica fixa, alheia à hora do exame:', registroMecanicoFixo);
console.log('mostrador forjado refutado pelo próprio maquinismo:', mostradorCaiPelaMaquina);

// ============================================================
// (l) BLOCOS DE PERIFÉRICOS E EXPLICAÇÕES PAGAS (playtest 13/07/2026, A2/A3):
// o monólogo só afirma "razões contra a vítima" com carta de móbil do
// periférico na mesa; dois periféricos do mesmo tipo nunca repetem a frase
// (anti-eco por construção); e a alegação-isca refutada paga a explicação
// no epílogo — nunca sem refutação.
// ============================================================
const monMetodico = monologos[0].monologo;
const nucleoBloco = (b) => (b || '').replace(/Quanto [^,]+,/, '');
const blocoDe = (mon, nomeParte) => mon.blocos.find((b) => b.includes(nomeParte));
const daveySemMotivoInventado =
  vMetodico.perifericos.davey_tull.temMotivoNaMesa === false &&
  !!blocoDe(monMetodico, 'Davey Tull') &&
  !blocoDe(monMetodico, 'Davey Tull').includes('razões contra a vítima');
const perifericosSemEco =
  nucleoBloco(blocoDe(monMetodico, 'Walter Arthurs')) !== nucleoBloco(blocoDe(monMetodico, 'Agnes Rooke')) &&
  nucleoBloco(blocoDe(monMetodico, 'Caleb Grey')) !== nucleoBloco(blocoDe(monMetodico, 'Davey Tull'));
const epMetodico = gerarEpilogo(vMetodico, { horasSelo: 16 });
const epIntuitivo = gerarEpilogo(vIntuitivo, { horasSelo: 16 });
const luzPagaSoComRefutacao =
  vMetodico.dadosMonologo.explicacoesPagas.includes('luz_esquecida') &&
  epMetodico.blocos.some((b) => b.includes('lampião')) &&
  !epIntuitivo.blocos.some((b) => b.includes('lampião'));
const epilogoSemEco = new Set(epMetodico.blocos).size === epMetodico.blocos.length;
const epilogoDeterministico =
  JSON.stringify(gerarEpilogo(vMetodico, { horasSelo: 16 })) === JSON.stringify(epMetodico) &&
  JSON.stringify(gerarMonologo(vMetodico, s().detective)) !== '' &&
  JSON.stringify(gerarEpilogo(vMetodico, { horasSelo: 16 })) !== JSON.stringify(gerarEpilogo(vMetodico, { horasSelo: 22 }));
console.log('\n=== (l) PERIFÉRICOS E EXPLICAÇÕES ===');
console.log('Davey sem móbil na mesa não ganha "razões contra a vítima":', daveySemMotivoInventado);
console.log('pares de periféricos sem eco verbatim:', perifericosSemEco);
console.log('a luz do padeiro é paga no epílogo, e só com a refutação:', luzPagaSoComRefutacao);
console.log('epílogo sem blocos duplicados; conta do perito lê a hora do selo:', epilogoSemEco && epilogoDeterministico);

// ============================================================
// (m) JANELA SEM SUSTENTAÇÃO (código próprio): a janela afirmada COBRE a
// hora real da morte, mas as cartas ligadas à âncora Quando sustentam OUTRA
// faixa — contradição interna da cadeia, não imprecisão. O código não pode
// cair em janela_imprecisa (era o comportamento enganoso). Carta sintética:
// o contrato é do MOTOR, não do caso corrente.
// ============================================================
reiniciar();
const cartaSuporteAlheio = {
  id: 'sint_suporte_alheio',
  localidade: 'cena',
  horaRegistro: 11,
  // Registro mecânico com faixa que NÃO toca a janela afirmada abaixo.
  tagsOcultas: { dominio: 'temporal', subDominio: 'registro_mecanico', janelaInicio: 1, janelaFim: 2 },
};
useJogo.setState({ cartasRegistradas: [...s().cartasRegistradas, cartaSuporteAlheio] });
s().definirReu('silas_crane');
s().definirJanela({ inicio: -4, fim: -2 }); // cobre a verdade (-3)...
ligar('sint_suporte_alheio', ANCORAS.quando); // ...mas o suporte diz [1, 2]
s().submeterAcusacao();
const vSemSustentacao = s().veredicto;
const codigoProprioContradicao =
  vSemSustentacao.falhas.some((f) => f.codigo === 'janela_sem_sustentacao') &&
  vSemSustentacao.falhas.every((f) => f.codigo !== 'janela_imprecisa' && f.codigo !== 'janela_nao_cobre');
const monologoExpoeContradicao = gerarMonologo(vSemSustentacao, s().detective).blocos.some((b) =>
  b.includes('não é a que os meus próprios sinais sustentam')
);
console.log('\n=== (m) JANELA SEM SUSTENTAÇÃO ===');
console.log('janela que cobre mas contradiz o suporte tem código próprio:', codigoProprioContradicao);
console.log('monólogo expõe contradição, não imprecisão:', monologoExpoeContradicao);

// ============================================================
// Fumaça do monólogo: todos os desfechos geram texto.
// ============================================================
console.log('\n=== Monólogos gerados (fumaça) ===');
for (const { rotulo, monologo } of monologos) {
  console.log(`· ${rotulo} → "${monologo.titulo}", ${monologo.blocos.length} blocos`);
}

// ============================================================
// GUARDA DE DETERMINISMO (regra inviolável do CLAUDE.md): nenhum
// Math.random()/Date.now() em src/logic, src/data, src/store e
// src/gerador (FASE 1: o gerador é build time, mas o determinismo é o
// mesmo — toda variação sai de hashString). A camada de APRESENTAÇÃO
// (componentes, three.js — que usa Math.random em uuids internos) fica
// fora da guarda: a proibição é da lógica de jogo.
// ============================================================
function arquivosJs(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const p = path.join(dir, nome);
    return statSync(p).isDirectory() ? arquivosJs(p) : /\.jsx?$/.test(nome) ? [p] : [];
  });
}
// Comentários podem CITAR a proibição; a guarda olha só o código vivo.
function semComentarios(codigo) {
  return codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}
const raizSrc = fileURLToPath(new URL('../src', import.meta.url));
const violacoesDeterminismo = ['logic', 'data', 'store', 'gerador'].flatMap((pasta) =>
  arquivosJs(path.join(raizSrc, pasta)).filter((arquivo) =>
    /Math\.random\s*\(|Date\.now\s*\(/.test(semComentarios(readFileSync(arquivo, 'utf8')))
  )
);
if (violacoesDeterminismo.length) {
  console.log('\nVIOLAÇÃO DE DETERMINISMO em:', violacoesDeterminismo.join(', '));
}

// ============================================================
// GUARDA DE APARÊNCIA: o genótipo tem shape completo para o elenco do
// caso (curadoria + derivação procedural), e o MOTOR nunca lê aparência
// (veredicto.js/acusacao.js proibidos de importar/citar a camada).
// ============================================================
const CAMPOS_APARENCIA = ['corpo', 'pele', 'cabelo', 'pelosFaciais', 'idadeAparente', 'traje'];
const shapeAparencia = (a) =>
  a && CAMPOS_APARENCIA.every((c) => a[c] != null) && a.cabelo.cor != null && a.cabelo.estilo != null;
const aparenciasOk =
  ['vitima', 'silas_crane', 'walter_arthurs', 'agnes_rooke', 'caleb_grey', 'davey_tull'].every((id) =>
    shapeAparencia(obterAparencia(id))
  ) &&
  shapeAparencia(derivarAparenciaDeSeed(SEED_TUTORIAL, 'personagem_gerado_qualquer')) &&
  JSON.stringify(derivarAparenciaDeSeed(SEED_TUTORIAL, 'x')) === JSON.stringify(derivarAparenciaDeSeed(SEED_TUTORIAL, 'x'));
const motorSemAparencia = ['logic/veredicto.js', 'logic/acusacao.js'].every(
  (f) => !/aparencia/i.test(semComentarios(readFileSync(path.join(raizSrc, f), 'utf8')))
);
// Onda 8: o modo purista é flag de UI — o motor jamais a lê.
const motorSemPurista = ['logic/veredicto.js', 'logic/acusacao.js'].every(
  (f) => !/modoPurista/.test(semComentarios(readFileSync(path.join(raizSrc, f), 'utf8')))
);

// ============================================================
// GUARDA DE PAPÉIS DRAMÁTICOS (FASE 5): a taxonomia de casting é metadado do
// gerador. Duas provas: (1) o MOTOR é cego a ela — veredicto.js/acusacao.js
// não citam papel/papéis; (2) o casting e a taxonomia são íntegros — todo id
// do elenco mapeia a um papel conhecido, os 5 suspeitos + Wycliffe têm papel,
// e todo hábito pressuposto por um papel existe no currículo.
// ============================================================
const motorSemPapeis = ['logic/veredicto.js', 'logic/acusacao.js'].every(
  (f) => !/pap[eé]is|papelDramatico/i.test(semComentarios(readFileSync(path.join(raizSrc, f), 'utf8')))
);
// FASE 6: o eco do mestre é camada de apresentação — o motor jamais o lê.
const motorSemEco = ['logic/veredicto.js', 'logic/acusacao.js'].every(
  (f) => !/ecoMestre|ecosDoMestre|eco_mestre/i.test(semComentarios(readFileSync(path.join(raizSrc, f), 'utf8')))
);
const elenco = pacote.papeisDramaticos || {};
const idsHabito = new Set(HABITOS.map((h) => h.id));
const elencoValido =
  Object.values(elenco).every((papelId) => PAPEIS[papelId] != null) &&
  ['silas_crane', 'walter_arthurs', 'agnes_rooke', 'caleb_grey', 'davey_tull', 'delegado_wycliffe'].every(
    (id) => elenco[id] != null
  );
const papeisReferenciamHabitosReais = Object.values(PAPEIS).every((p) =>
  (p.habitosPressupostos || []).every((h) => idsHabito.has(h))
);
const papeisIntegros = elencoValido && papeisReferenciamHabitosReais;
if (!papeisIntegros) {
  console.log('\nPAPÉIS — casting ou taxonomia inválidos (elenco incompleto ou hábito inexistente).');
}

// ============================================================
// GUARDA DO CONTRATO DE ASSETS (FASE 2): todo asset do manifesto existe no
// caminho declarado, mede-se e casa com as dimensões do seu slot, e traz
// os quatro campos de licença. Além disso, NENHUM componente/lógica importa
// arte (.svg/.png) direto — toda arte passa pelo manifesto (invariante "o
// asset é invisível ao motor e registrado"). Manifesto vazio ⇒ guarda passa.
// ============================================================
const raizRepo = fileURLToPath(new URL('..', import.meta.url));
// Mede um SVG pela caixa intrínseca: width/height do <svg>, ou o viewBox.
function medirSvg(txt) {
  const tag = (txt.match(/<svg[^>]*>/i) || [''])[0];
  const w = tag.match(/\bwidth\s*=\s*["']([\d.]+)/i);
  const h = tag.match(/\bheight\s*=\s*["']([\d.]+)/i);
  if (w && h) return { largura: Math.round(+w[1]), altura: Math.round(+h[1]) };
  const vb = tag.match(/viewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/i);
  if (vb) return { largura: Math.round(+vb[1]), altura: Math.round(+vb[2]) };
  return null;
}
// Mede um PNG pelo IHDR (assinatura + largura/altura big-endian).
function medirPng(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { largura: buf.readUInt32BE(16), altura: buf.readUInt32BE(20) };
}
function verificarManifesto() {
  const problemas = [];
  const ids = MANIFESTO_ASSETS.map((a) => a.id);
  const dup = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (dup.length) problemas.push(`ids duplicados no manifesto: ${dup.join(', ')}`);
  for (const a of MANIFESTO_ASSETS) {
    const slot = SLOTS_ASSETS[a.slot];
    if (!slot) {
      problemas.push(`${a.id}: slot inexistente (${a.slot})`);
      continue;
    }
    if (!a.caminho || !a.caminho.startsWith(DIR_BASE_ASSETS)) {
      problemas.push(`${a.id}: caminho fora de ${DIR_BASE_ASSETS}/`);
      continue;
    }
    const ext = (a.caminho.split('.').pop() || '').toLowerCase();
    if (!slot.formatos.includes(ext)) {
      problemas.push(`${a.id}: formato .${ext} não aceito pelo slot ${a.slot}`);
    }
    let buf;
    try {
      buf = readFileSync(path.join(raizRepo, a.caminho));
    } catch {
      problemas.push(`${a.id}: arquivo ausente (${a.caminho})`);
      continue;
    }
    const medida = ext === 'svg' ? medirSvg(buf.toString('utf8')) : ext === 'png' ? medirPng(buf) : null;
    if (!medida) {
      problemas.push(`${a.id}: não foi possível medir o arquivo (.${ext})`);
    } else {
      if (a.dimensoes?.largura !== slot.dimensoes.largura || a.dimensoes?.altura !== slot.dimensoes.altura) {
        problemas.push(`${a.id}: dimensoes declaradas ≠ slot ${a.slot}`);
      }
      if (medida.largura !== slot.dimensoes.largura || medida.altura !== slot.dimensoes.altura) {
        problemas.push(
          `${a.id}: arquivo ${medida.largura}×${medida.altura} ≠ slot ${slot.dimensoes.largura}×${slot.dimensoes.altura}`
        );
      }
    }
    const L = a.licenca || {};
    for (const campo of ['tipo', 'fonte', 'url', 'autor']) {
      if (!L[campo]) problemas.push(`${a.id}: licenca.${campo} ausente`);
    }
  }
  return problemas;
}
const problemasManifesto = verificarManifesto();
// Nenhuma arte importada por fora do manifesto: sem `import … from '…svg'` nem
// `new URL('…png', …)` em componentes/lógica. O resolvedor usa import.meta.glob
// (não casa com estes padrões), então só um bypass real acende esta guarda.
const arteImportadaDireto = ['components', 'logic'].flatMap((pasta) =>
  arquivosJs(path.join(raizSrc, pasta)).filter((arquivo) => {
    const src = semComentarios(readFileSync(arquivo, 'utf8'));
    return (
      /from\s*["'][^"']*\.(svg|png)["']/i.test(src) ||
      /new\s+URL\(\s*["'][^"']*\.(svg|png)["']/i.test(src)
    );
  })
);
const manifestoValido = problemasManifesto.length === 0 && arteImportadaDireto.length === 0;
if (problemasManifesto.length) {
  console.log('\nMANIFESTO — problemas:', problemasManifesto.join(' | '));
}
if (arteImportadaDireto.length) {
  console.log('\nARTE FORA DO MANIFESTO em:', arteImportadaDireto.join(', '));
}

// ============================================================
// GUARDA DO RETRATO EM CAMADAS (FASE 3): todo molde de camada resolve uma
// chave de asset BEM-FORMADA para o genótipo de qualquer personagem — sem
// {campo} residual, sem 'undefined', sem segmento vazio (ex.: 'cabelo/_x').
// O compositor (import.meta.glob, só Vite) NÃO é importado aqui; a chave é
// reimplementada em node e testada como dado. E o MOTOR não lê o compositor.
// A aparência segue fora do motor (guarda motorSemAparencia acima).
// ============================================================
const chaveDaCamadaLocal = (ap, molde) =>
  molde.replace(/\{([^}]+)\}/g, (_, campo) => campo.split('.').reduce((o, k) => (o == null ? o : o[k]), ap) ?? '');
const genotiposParaGuarda = [
  'vitima',
  'silas_crane',
  'walter_arthurs',
  'agnes_rooke',
  'caleb_grey',
  'davey_tull',
  'delegado_wycliffe',
  'moco_padeiro',
  'sra_wick',
]
  .map((id) => obterAparencia(id))
  .concat([derivarAparenciaDeSeed(SEED_TUTORIAL, 'gerado_a'), derivarAparenciaDeSeed(SEED_TUTORIAL, 'gerado_b')]);
const camadasBemFormadas =
  CAMADAS_RETRATO.length > 0 &&
  genotiposParaGuarda.every((ap) =>
    CAMADAS_RETRATO.every((c) => {
      const k = chaveDaCamadaLocal(ap, c.chave);
      return !/[{}]/.test(k) && !/undefined/.test(k) && !/\/_|_$|\/$|^\//.test(k);
    })
  );
const motorSemCompositorRetrato = ['logic/veredicto.js', 'logic/acusacao.js'].every(
  (f) => !/comporRetrato|logic\/retrato|camadas_retrato/.test(semComentarios(readFileSync(path.join(raizSrc, f), 'utf8')))
);
const retratoEmCamadasOk = camadasBemFormadas && motorSemCompositorRetrato;

// ============================================================
// GUARDA DA CAMADA VISUAL 3D: todo nó do mapa tem lugar e forma na
// maquete (senão o nó desbloqueado não aparece no diorama), e todo
// hotspot do corpo aponta para uma carta que EXISTE no catálogo.
// ============================================================
const dioramaCompleto = NOS_MAPA.every((no) => {
  const pos = POSICOES_DIORAMA[no.id];
  return pos && FORMAS_PREDIO[pos.predio];
});
const hotspotsValidos =
  HOTSPOTS_CORPO.every((h) => obterDefinicaoCarta(h.cartaId)) &&
  HOTSPOTS_CORPO.every((h) => obterDefinicaoCarta(h.cartaId).localidade === 'corpo');

// ============================================================
// GUARDA DOS PONTOS DE INTERESSE (§5.1): ao dividir a prosa de uma
// localidade em pontos, NENHUMA carta pode ficar inalcançável. Compara a
// união dos [[id]] de todos os pontos com as cartas cujo `localidade`
// aponta para o nó. E, na volta, todo [[id]] de um ponto tem de ser carta
// real (nada de marcador solto). Prova a restrição dura da Fase 2.
// ============================================================
const marcadoresDe = (paragrafos) =>
  new Set(paragrafos.flatMap((p) => [...p.matchAll(/\[\[(\w+)\]\]/g)].map((m) => m[1])));
const localidadesComPontos = LOCALIDADES.filter((l) => Array.isArray(l.pontos) && l.pontos.length);
// Onda 6: cartas cobertas por um diálogo EMBUTIDO no lugar (origemLocalidade)
// não são órfãs do ponto — nascem na fala (ex.: alibi_davey na conversa com
// o aprendiz, dentro da oficina).
const idsEmDialogosEmbutidos = (locId) => {
  const ids = new Set();
  for (const d of Object.values(DIALOGOS)) {
    if (d.origemLocalidade !== locId) continue;
    for (const id of marcadoresDe(Object.values(d.nos).flatMap((n) => n.fala || []))) ids.add(id);
  }
  return ids;
};
const cartasOrfasNosPontos = localidadesComPontos.flatMap((loc) => {
  // Onda 7: micro-gestos também extraem — a carta de um gesto (do ponto ou
  // da localidade) não é órfã.
  const idsNosPontos = new Set([
    ...marcadoresDe(loc.pontos.flatMap((p) => p.prosa)),
    ...loc.pontos.flatMap((p) => (p.gestos || []).map((g) => g.cartaId)),
    ...(loc.gestos || []).map((g) => g.cartaId),
  ]);
  const idsEmbutidos = idsEmDialogosEmbutidos(loc.id);
  return CARTAS.filter((c) => c.localidade === loc.id)
    .map((c) => c.id)
    .filter((id) => !idsNosPontos.has(id) && !idsEmbutidos.has(id))
    .map((id) => `${loc.id}:${id}`);
});
const marcadoresOrfaosNosPontos = localidadesComPontos.flatMap((loc) =>
  [...marcadoresDe(loc.pontos.flatMap((p) => p.prosa))]
    .filter((id) => !obterDefinicaoCarta(id))
    .map((id) => `${loc.id}:${id}`)
);
const pontosCobremCartas = cartasOrfasNosPontos.length === 0 && marcadoresOrfaosNosPontos.length === 0;
if (!pontosCobremCartas) {
  console.log('\nPONTOS DE INTERESSE — cartas inalcançáveis:', cartasOrfasNosPontos.join(', ') || '—');
  console.log('PONTOS DE INTERESSE — marcadores sem carta:', marcadoresOrfaosNosPontos.join(', ') || '—');
}

// ============================================================
// GUARDA DOS INTERROGATÓRIOS EM DIÁLOGO (§7.1): a árvore é camada
// narrativa (o motor não a lê), mas precisa ser íntegra —
//   • toda `requerCarta` de confronto referencia carta existente;
//   • todo `vaiPara` aponta para um nó real da MESMA árvore;
//   • todo `[[id]]` de fala é carta real E nenhuma carta com
//     `localidade === nó` fica órfã (inalcançável em fala alguma),
//     espelho da guarda dos pontos de interesse (a extração pelo
//     motor continua valendo — o diálogo é só a superfície de UI).
// ============================================================
const requerCartasInvalidas = [];
const vaiParaInvalidos = [];
const marcadoresDialogoInvalidos = [];
const cartasOrfasNoDialogo = [];
const reacoesProvaInvalidas = [];
const evasivasFaltando = [];
const confrontosInvalidos = [];
for (const [localidadeId, dialogo] of Object.entries(DIALOGOS)) {
  const idsNos = new Set(Object.keys(dialogo.nos));
  for (const [noId, no] of Object.entries(dialogo.nos)) {
    for (const op of no.opcoes || []) {
      if (op.requerCarta && !obterDefinicaoCarta(op.requerCarta))
        requerCartasInvalidas.push(`${localidadeId}:${noId}:${op.requerCarta}`);
      if (!idsNos.has(op.vaiPara)) vaiParaInvalidos.push(`${localidadeId}:${noId}→${op.vaiPara}`);
    }
  }
  // Onda 5: toda reação de prova referencia carta existente e nó da MESMA
  // árvore; quem tem reacoesProva precisa de um nó de evasiva válido (é a
  // rede que apara qualquer carta sem reação própria).
  for (const [cartaId, noDestino] of Object.entries(dialogo.reacoesProva || {})) {
    if (!obterDefinicaoCarta(cartaId)) reacoesProvaInvalidas.push(`${localidadeId}:${cartaId}`);
    if (!idsNos.has(noDestino)) reacoesProvaInvalidas.push(`${localidadeId}:${cartaId}→${noDestino}`);
  }
  if (dialogo.reacoesProva && !idsNos.has(dialogo.noEvasiva)) evasivasFaltando.push(localidadeId);
  // Confronto gated: bijeção `confrontos` ↔ `reacoesProva`. Cada entrada de
  // `confrontos` referencia carta existente E chave de `reacoesProva` (o
  // destino da reação vem de reacoesProva — fonte única cartaId→noId; confrontos
  // só carrega rótulo autoral + ordem); toda chave de `reacoesProva` tem
  // exatamente uma entrada em `confrontos`; rótulo não-vazio; sem duplicata.
  const chavesReacao = new Set(Object.keys(dialogo.reacoesProva || {}));
  const requeridasConfronto = new Set();
  for (const c of dialogo.confrontos || []) {
    if (!c || typeof c.rotulo !== 'string' || c.rotulo.trim() === '')
      confrontosInvalidos.push(`${localidadeId}:${c?.requerCarta || '?'} (rótulo vazio)`);
    if (!obterDefinicaoCarta(c?.requerCarta))
      confrontosInvalidos.push(`${localidadeId}:${c?.requerCarta} (carta inexistente)`);
    else if (!chavesReacao.has(c.requerCarta))
      confrontosInvalidos.push(`${localidadeId}:${c.requerCarta} (sem reação)`);
    if (requeridasConfronto.has(c?.requerCarta))
      confrontosInvalidos.push(`${localidadeId}:${c.requerCarta} (duplicado)`);
    requeridasConfronto.add(c?.requerCarta);
  }
  for (const cartaId of chavesReacao) {
    if (!requeridasConfronto.has(cartaId))
      confrontosInvalidos.push(`${localidadeId}:${cartaId} (reação sem confronto)`);
  }
  const marcadoresArvore = marcadoresDe(Object.values(dialogo.nos).flatMap((n) => n.fala || []));
  for (const id of marcadoresArvore) {
    if (!obterDefinicaoCarta(id)) marcadoresDialogoInvalidos.push(`${localidadeId}:${id}`);
  }
  for (const c of CARTAS.filter((c) => c.localidade === localidadeId)) {
    if (!marcadoresArvore.has(c.id)) cartasOrfasNoDialogo.push(`${localidadeId}:${c.id}`);
  }
}
const dialogosIntegros =
  requerCartasInvalidas.length === 0 &&
  vaiParaInvalidos.length === 0 &&
  marcadoresDialogoInvalidos.length === 0 &&
  cartasOrfasNoDialogo.length === 0 &&
  reacoesProvaInvalidas.length === 0 &&
  evasivasFaltando.length === 0 &&
  confrontosInvalidos.length === 0;
if (!dialogosIntegros) {
  console.log('\nDIÁLOGOS — requerCarta inexistente:', requerCartasInvalidas.join(', ') || '—');
  console.log('DIÁLOGOS — vaiPara sem nó:', vaiParaInvalidos.join(', ') || '—');
  console.log('DIÁLOGOS — marcador sem carta:', marcadoresDialogoInvalidos.join(', ') || '—');
  console.log('DIÁLOGOS — cartas inalcançáveis na árvore:', cartasOrfasNoDialogo.join(', ') || '—');
  console.log('DIÁLOGOS — reacoesProva inválidas:', reacoesProvaInvalidas.join(', ') || '—');
  console.log('DIÁLOGOS — árvore com reações sem nó de evasiva:', evasivasFaltando.join(', ') || '—');
  console.log('DIÁLOGOS — confrontos ↔ reacoesProva (bijeção quebrada):', confrontosInvalidos.join(', ') || '—');
}

// ============================================================
// GUARDA §7.2 — A CONVERSA DESCE E NÃO VOLTA + SOLUBILIDADE EM DOIS NÍVEIS.
// A árvore de pergunta (só as `opcoes`) é um DAG que só desce: nenhuma
// opção reaponta para o nó inicial (sem hub, sem "outro assunto"). E, em
// TODA descida da raiz a um terminal, as cartas de SUSTENTAÇÃO saem — só
// as de PRECISÃO (tom-dependentes) podem faltar. Prova que o caso é sempre
// acusável (solubilidade) e que a Vitória Absoluta segue possível pelo tom
// certo (a precisão é alcançável em ALGUM caminho). O motor não lê nada
// disto — é contrato da CAMADA de UI do interrogatório.
// ============================================================
// Cartas cujo [[id]] pode faltar conforme o tom (peso NARRATIVO, nunca do
// veredicto — o motor repousa no corpo/cena). Hoje: a lasca na bainha de
// Silas, que só se apanha de esguelha (tom oblíquo).
const CARTAS_PRECISAO = new Set(['ev_vidro_dobra']);
const semVoltaAoHub = [];
const sustentacaoPodeFaltar = [];
const precisaoInalcancavel = [];
for (const [localidadeId, dialogo] of Object.entries(DIALOGOS)) {
  // Nenhuma opção reaponta ao nó inicial (irreversibilidade estrutural).
  for (const [noId, no] of Object.entries(dialogo.nos)) {
    for (const op of no.opcoes || []) {
      if (op.vaiPara === dialogo.noInicial) semVoltaAoHub.push(`${localidadeId}:${noId}→${op.vaiPara}`);
    }
  }
  // Enumera os caminhos raiz→terminal seguindo só as `opcoes` (o confronto
  // por prova é canal lateral, fora da descida). Coleta os [[id]] de cada
  // caminho; a interseção é o que sai em TODA descida (sustentação).
  const marcadoresDoNo = (noId) => marcadoresDe(dialogo.nos[noId]?.fala || []);
  const caminhos = [];
  const descer = (noId, visitados, acumulado) => {
    if (visitados.has(noId)) return; // ciclo — o DAG não deveria ter
    const marcs = new Set([...acumulado, ...marcadoresDoNo(noId)]);
    const opcoes = dialogo.nos[noId]?.opcoes || [];
    if (opcoes.length === 0) {
      caminhos.push(marcs);
      return;
    }
    for (const op of opcoes) descer(op.vaiPara, new Set([...visitados, noId]), marcs);
  };
  descer(dialogo.noInicial, new Set(), new Set());
  const uniao = new Set(caminhos.flatMap((c) => [...c]));
  const interseccao = [...uniao].filter((id) => caminhos.every((c) => c.has(id)));
  const interSet = new Set(interseccao);
  // Sustentação = tudo o que a árvore produz, menos a precisão tom-dependente.
  for (const id of uniao) {
    if (CARTAS_PRECISAO.has(id)) continue;
    if (!interSet.has(id)) sustentacaoPodeFaltar.push(`${localidadeId}:${id}`);
  }
  // Precisão declarada precisa ser alcançável em ALGUM caminho (senão a
  // Vitória Absoluta ficaria impossível pela UI).
  for (const id of CARTAS_PRECISAO) {
    const nasceNaArvore = marcadoresDe(Object.values(dialogo.nos).flatMap((n) => n.fala || [])).has(id);
    if (nasceNaArvore && !uniao.has(id)) precisaoInalcancavel.push(`${localidadeId}:${id}`);
  }
}
const dialogosDescemESolvem =
  semVoltaAoHub.length === 0 && sustentacaoPodeFaltar.length === 0 && precisaoInalcancavel.length === 0;
if (!dialogosDescemESolvem) {
  console.log('\n§7.2 — opção que volta ao hub:', semVoltaAoHub.join(', ') || '—');
  console.log('§7.2 — sustentação que pode faltar num caminho:', sustentacaoPodeFaltar.join(', ') || '—');
  console.log('§7.2 — precisão inalcançável em todo caminho:', precisaoInalcancavel.join(', ') || '—');
}

// ============================================================
// GUARDA GLOBAL DE ALCANÇABILIDADE (Onda 6): toda carta do catálogo
// nasce de algum [[id]] — prosa/introdução/pontos de localidade ou fala
// de árvore de diálogo. Mover prosa entre camadas (localidade → árvore)
// não pode deixar carta inalcançável. (ev_algor não está no catálogo:
// nasce da medição de temperatura.)
// ============================================================
const todosMarcadores = new Set([
  ...LOCALIDADES.flatMap((l) => [
    ...marcadoresDe(l.prosa || []),
    ...marcadoresDe(l.introducao || []),
    ...marcadoresDe((l.pontos || []).flatMap((p) => p.prosa)),
    ...marcadoresDe((l.prosaCondicional || []).flatMap((b) => b.paragrafos)),
    // Onda 7: cartas extraídas por micro-gesto (da localidade ou de ponto).
    ...(l.gestos || []).map((g) => g.cartaId),
    ...(l.pontos || []).flatMap((p) => (p.gestos || []).map((g) => g.cartaId)),
  ]),
  ...Object.values(DIALOGOS).flatMap((d) => [
    ...marcadoresDe(Object.values(d.nos).flatMap((n) => n.fala || [])),
  ]),
]);
const cartasInalcancaveis = CARTAS.map((c) => c.id).filter((id) => !todosMarcadores.has(id));
if (cartasInalcancaveis.length) {
  console.log('\nALCANÇABILIDADE — cartas sem [[id]] em lugar algum:', cartasInalcancaveis.join(', '));
}

// ============================================================
// GUARDA DA APRESENTAÇÃO EM CENA (Onda 5): apresentar ao declarante a
// carta que o desmente ANOTA no mural a mesma ligação do barbante
// (classificada refuta_alibi pelo motor intocado); carta alheia não
// anota nada (cai na evasiva) — e ambas marcam o "já apresentada".
// ============================================================
reiniciar();
s().viajarPara('interrogatorio_silas');
s().extrairCarta('alibi_silas');
s().viajarPara('estalagem');
s().extrairCarta('corrob_estalajadeiro');
s().extrairCarta('ev_registro_estalagem'); // vestígio de WALTER — não toca Silas
s().apresentarProva('silas_crane', 'corrob_estalajadeiro'); // desmente o paradeiro dele
s().apresentarProva('silas_crane', 'ev_registro_estalagem'); // evasiva: nada anotado
const ligacoesCena = s().acusacao.ligacoes;
const parCena = ligacoesCena.some(
  (l) =>
    [l.de, l.para].includes('alibi_silas') && [l.de, l.para].includes('corrob_estalajadeiro')
);
const soUmaLigacaoCena = ligacoesCena.length === 1;
const analiseCena = analisarLigacoes(s().acusacao, s().cartasRegistradas);
const confrontoClassificado = [...analiseCena.refutaAlibi.values()].some(
  (v) => v.alibi.id === 'alibi_silas'
);
const apresentadasMarcadas = (s().provasApresentadas.silas_crane || []).length === 2;

// ============================================================
// GUARDA DO PACOTE (FASE 1): o pacote de caso é SERIALIZÁVEL e COMPLETO.
// É a prova do contrato de saída do gerador — um pacote emitido tem de
// passar aqui antes de o motor o aceitar. Checa: (1) todos os campos
// obrigatórios presentes; (2) round-trip JSON preserva o pacote (nenhuma
// função, nenhum valor não-serializável); (3) ids únicos nas coleções que
// o exigem; (4) parametrosCena completo (chegada, ambiente, calendário).
// ============================================================
function verificarPacote(p) {
  const problemas = [];
  for (const campo of CAMPOS_OBRIGATORIOS_PACOTE) {
    if (p[campo] == null) problemas.push(`campo obrigatório ausente: ${campo}`);
  }
  let serializavel = false;
  try {
    serializavel = JSON.stringify(JSON.parse(JSON.stringify(p))) === JSON.stringify(p);
  } catch {
    serializavel = false;
  }
  if (!serializavel) problemas.push('não é serializável (round-trip JSON diverge)');
  const idsUnicos = (lista, rotulo) => {
    const ids = (lista || []).map((x) => x.id);
    const dup = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    if (dup.length) problemas.push(`${rotulo}: ids duplicados (${dup.join(', ')})`);
  };
  idsUnicos(p.suspeitos, 'suspeitos');
  idsUnicos(p.cartas, 'cartas');
  idsUnicos(p.nosMapa, 'nosMapa');
  idsUnicos(p.localidades, 'localidades');
  const pc = p.parametrosCena || {};
  if (typeof pc.horasChegada !== 'number') problemas.push('parametrosCena.horasChegada ausente');
  if (typeof pc.ambiente !== 'number') problemas.push('parametrosCena.ambiente ausente');
  if (!pc.calendario) problemas.push('parametrosCena.calendario ausente');
  // FASE 6 — eco do mestre, OPCIONAL: ausente ⇒ passa (procedural). Presente,
  // é { titulo: string, porCodigo: { [codigo]: [strings não-vazias] } }.
  if (p.ecosDoMestre != null) {
    const e = p.ecosDoMestre;
    if (typeof e.titulo !== 'string' || !e.titulo.trim()) problemas.push('ecosDoMestre.titulo ausente ou vazio');
    if (!e.porCodigo || typeof e.porCodigo !== 'object') {
      problemas.push('ecosDoMestre.porCodigo ausente');
    } else {
      for (const [codigo, variantes] of Object.entries(e.porCodigo)) {
        if (!Array.isArray(variantes) || variantes.length === 0) {
          problemas.push(`ecosDoMestre.porCodigo.${codigo}: array de variantes vazio`);
        } else if (!variantes.every((v) => typeof v === 'string' && v.trim())) {
          problemas.push(`ecosDoMestre.porCodigo.${codigo}: variante não-string ou vazia`);
        }
      }
    }
  }
  return problemas;
}
const problemasPacote = verificarPacote(pacote);
const pacoteSerializavelCompleto = problemasPacote.length === 0;
if (!pacoteSerializavelCompleto) {
  console.log('\nPACOTE — problemas:', problemasPacote.join(' | '));
}

// ============================================================
// GUARDA DE SLOTS (FASE 4): todo slot de caso presente em QUALQUER prosa do
// pacote resolve contra o próprio pacote (entidade e campo existem). Um slot
// que não resolve renderizaria literal na tela — falha. Varre recursivamente
// todas as strings do pacote (ids/tags não têm chaves, sem falso positivo).
// ============================================================
function todasAsStrings(no, acc = []) {
  if (typeof no === 'string') acc.push(no);
  else if (Array.isArray(no)) for (const x of no) todasAsStrings(x, acc);
  else if (no && typeof no === 'object') for (const k of Object.keys(no)) todasAsStrings(no[k], acc);
  return acc;
}
const slotsPendentes = [];
for (const texto of todasAsStrings(pacote)) {
  for (const falta of slotsNaoResolvidos(texto, pacote)) slotsPendentes.push(falta);
}
const slotsResolvem = slotsPendentes.length === 0;
if (!slotsResolvem) {
  console.log('\nSLOTS — não resolvem contra o pacote:', [...new Set(slotsPendentes)].join(', '));
}

// ============================================================
// GUARDAS DO GERADOR (FASE 1 do gerador por simulação): o modelo de
// personagem vive em src/gerador/ — uma ilha de BUILD TIME que o runtime
// jamais importa. Provas: (1) replay — mesma seed produz o mesmo elenco,
// byte a byte, e seeds distintas produzem elencos distintos; (2) o elenco
// é plausível e íntegro (nomes únicos, idade na faixa, atributos 1–5,
// único-na-vila respeitado, JSON puro); (3) o MOTOR é cego a atributos/
// arquétipos/traits (mesma cegueira de aparências e papéis); (4) nenhum
// código de runtime importa src/gerador/; (5) todo trait mapeia a
// comportamento do catálogo fechado (trait órfão = falha); (6) toda linha
// de prior cita a proveniência na KB; (7) priors bem-formados.
// ============================================================
const SEEDS_QA_GERADOR = ['a_hora_emprestada', 'vila_do_moinho', 'caso_do_charco'];
// Gera todos, depois gera TUDO de novo e compara — prova que não há
// estado escondido entre chamadas (o replay não depende da ordem).
const elencosPrimeiraGeracao = SEEDS_QA_GERADOR.map((sd) => gerarElenco(sd, 8));
const elencosSegundaGeracao = SEEDS_QA_GERADOR.map((sd) => gerarElenco(sd, 8));
const jsonElencos = elencosPrimeiraGeracao.map((e) => JSON.stringify(e));
const geradorReplayOk = jsonElencos.every(
  (json, i) => json === JSON.stringify(elencosSegundaGeracao[i])
);
const geradorSeedsDistintas = new Set(jsonElencos).size === SEEDS_QA_GERADOR.length;

const ATRIBUTOS_GERADOR = ['FOR', 'INT', 'WIS', 'CHA'];
function problemasDoElenco(elenco) {
  const problemas = [];
  const nomes = elenco.map((p) => p.nome);
  if (new Set(nomes).size !== nomes.length) problemas.push('nome completo repetido');
  const unicos = elenco.filter((p) => ARQUETIPOS[p.arquetipo]?.unicoNaVila).map((p) => p.arquetipo);
  if (new Set(unicos).size !== unicos.length) problemas.push('arquétipo único-na-vila duplicado');
  for (const p of elenco) {
    const arq = ARQUETIPOS[p.arquetipo];
    if (!arq) {
      problemas.push(`${p.id}: arquétipo desconhecido`);
      continue;
    }
    const idadeNaFaixa = arq.faixasIdade.some(({ faixa }) => {
      const [minima, maxima] = FAIXAS_IDADE[faixa];
      return p.idade >= minima && p.idade <= maxima;
    });
    if (!idadeNaFaixa) problemas.push(`${p.id}: idade ${p.idade} fora das faixas do arquétipo`);
    if (!ATRIBUTOS_GERADOR.every((a) => Number.isInteger(p.atributos[a]) && p.atributos[a] >= 1 && p.atributos[a] <= 5))
      problemas.push(`${p.id}: atributo fora de 1–5`);
    if (typeof p.profissao !== 'string' || !p.profissao) problemas.push(`${p.id}: profissão vazia`);
    if (!p.traits.length || !p.traits.every((t) => TRAITS[t])) problemas.push(`${p.id}: trait fora do catálogo`);
    if (!p.comportamentos.every((c) => CATALOGO_COMPORTAMENTOS[c]))
      problemas.push(`${p.id}: comportamento fora do catálogo`);
    if (MOTIVOS_POTENCIAIS[p.motivoPotencial] == null) problemas.push(`${p.id}: motivo fora do catálogo`);
    if (p.pacoteEspacial !== null)
      problemas.push(`${p.id}: pacoteEspacial deveria ser null no elenco cru (a cidade nasce primeiro; a INSERÇÃO da Fase 2 o preenche)`);
  }
  try {
    if (JSON.stringify(JSON.parse(JSON.stringify(elenco))) !== JSON.stringify(elenco))
      problemas.push('não sobrevive a round-trip JSON');
  } catch {
    problemas.push('não é serializável');
  }
  return problemas;
}
const problemasElencos = elencosPrimeiraGeracao.flatMap((e, i) =>
  problemasDoElenco(e).map((p) => `${SEEDS_QA_GERADOR[i]}: ${p}`)
);
const geradorElencosPlausiveis = problemasElencos.length === 0;
if (!geradorElencosPlausiveis) {
  console.log('\nGERADOR — elencos implausíveis:', problemasElencos.join(' | '));
}

// (3) Cegueira do motor: veredicto/acusação não citam nada da camada de
// atributos (regex calibrada: zero ocorrências no motor atual).
const motorSemAtributos = ['logic/veredicto.js', 'logic/acusacao.js'].every(
  (f) =>
    !/arquet[ií]p|\btraits?\b|atributos|quantiza|comportamentos|\b(FOR|INT|WIS|CHA)\b/.test(
      semComentarios(readFileSync(path.join(raizSrc, f), 'utf8'))
    )
);

// (4) O gerador é ilha: nenhum arquivo de src/ fora de src/gerador/ o importa.
const arquivosRuntime = [
  ...['logic', 'store', 'components', 'data'].flatMap((pasta) => arquivosJs(path.join(raizSrc, pasta))),
  path.join(raizSrc, 'App.jsx'),
  path.join(raizSrc, 'main.jsx'),
  path.join(raizSrc, 'som.js'),
];
const geradorForaDoRuntime = arquivosRuntime.every(
  (f) => !/from\s+['"][^'"]*gerador\//.test(semComentarios(readFileSync(f, 'utf8')))
);

// (5) Trait órfão: todo trait mapeia a comportamento existente, e todo
// pool de arquétipo só usa traits do catálogo.
const traitsSemOrfao =
  Object.keys(TRAITS).every((t) => CATALOGO_COMPORTAMENTOS[MAPA_TRAIT_COMPORTAMENTO[t]] != null) &&
  Object.values(ARQUETIPOS).every((a) => a.traits.every((t) => TRAITS[t] != null));

// (6) Proveniência por linha (regra do design §4.1 e de fontes.md).
const citaKb = (s) => typeof s === 'string' && s.includes('kb-mundo-vitoriano');
const provenienciaCompleta =
  Object.values(ARQUETIPOS).every((a) => citaKb(a.proveniencia)) &&
  Object.values(PROVENIENCIA_TABELAS).every(citaKb);

// (7) Priors bem-formados: 4 atributos × 5 pesos inteiros com soma > 0;
// gênero e idade com peso; classe e motivos dos catálogos; profissão
// definida para todo gênero com peso.
const priorsBemFormados = Object.values(ARQUETIPOS).every(
  (a) =>
    ATRIBUTOS_GERADOR.every(
      (attr) =>
        Array.isArray(a.priors[attr]) &&
        a.priors[attr].length === 5 &&
        a.priors[attr].every((peso) => Number.isInteger(peso) && peso >= 0) &&
        a.priors[attr].reduce((soma, peso) => soma + peso, 0) > 0
    ) &&
    Number.isInteger(a.frequencia) &&
    a.frequencia > 0 &&
    CLASSES_SOCIAIS.includes(a.classeSocial) &&
    Object.values(a.generos).reduce((soma, peso) => soma + peso, 0) > 0 &&
    a.faixasIdade.length > 0 &&
    a.faixasIdade.every((f) => FAIXAS_IDADE[f.faixa] != null && Number.isInteger(f.peso) && f.peso >= 0) &&
    a.faixasIdade.reduce((soma, f) => soma + f.peso, 0) > 0 &&
    a.motivosPotenciais.length > 0 &&
    a.motivosPotenciais.every((m) => MOTIVOS_POTENCIAIS[m] != null) &&
    Object.entries(a.generos).every(([genero, peso]) => peso === 0 || typeof a.profissoes[genero] === 'string')
);

// ============================================================
// GUARDAS DO GERADOR (FASE 2 do gerador por simulação): a geração
// espacial — cidade seedada, inserção do elenco, grafo de avistamentos e
// interiores LOD — também é ilha de build time (a guarda de ilha da FASE
// 1 já cobre os módulos novos, que vivem em src/gerador/). Provas:
// (1) replay — mesma seed → mesmo MUNDO (cidade + inserções + grafo +
// interiores), byte a byte; seeds distintas → mundos distintos;
// (2) cidade plausível (obrigatórios presentes, ids únicos, lotes sem
// sobreposição, dentro da tábua) e diorama compatível (toda posição tem
// forma completa no schema de FORMAS_PREDIO);
// (3) inserção íntegra (moradia/trabalho/frequentados/rotina apontam
// para prédios existentes; dia = trabalho; madrugada = moradia);
// (4) grafo de avistamentos DERIVADO (recomputado no QA a partir de
// rotina × adjacência, tem de bater byte a byte — nada de aresta solta);
// (5) LOD: interior órfão = falha (interiores ⊆ locais elegíveis) e todo
// elegível tem interior;
// (6) interiores íntegros: cômodos disjuntos dentro do grid; toda peça
// de mobília em célula do próprio cômodo, sem célula repetida, item do
// vocabulário fechado (classe do morador ∪ ofício do cômodo); planta SVG
// é PROJEÇÃO 1:1 do grid (fonte única — sem representação paralela);
// (7) pacote espacial de TODO arquétipo completo, em vocabulário
// fechado, com proveniência por linha citando a KB.
// ============================================================
const mundosPrimeiraGeracao = SEEDS_QA_GERADOR.map((sd) => gerarMundo(sd));
const mundosSegundaGeracao = SEEDS_QA_GERADOR.map((sd) => gerarMundo(sd));
const jsonMundos = mundosPrimeiraGeracao.map((m) => JSON.stringify(m));
const mundoReplayOk = jsonMundos.every((json, i) => json === JSON.stringify(mundosSegundaGeracao[i]));
const mundosDistintos = new Set(jsonMundos).size === SEEDS_QA_GERADOR.length;

// (2) Cidade plausível + diorama compatível.
const TIPOS_OBRIGATORIOS = [
  'igreja', 'vicarage', 'solar', 'pub', 'botica', 'mercearia', 'escola',
  'delegacia', 'casa_do_medico', 'forja', 'granja', 'moinho',
];
const CAMPOS_FORMA = ['w', 'd', 'h', 'telhadoAltura', 'beiral'];
function problemasDaCidade(cidade) {
  const problemas = [];
  const ids = cidade.predios.map((p) => p.id);
  if (new Set(ids).size !== ids.length) problemas.push('id de prédio repetido');
  for (const tipo of TIPOS_OBRIGATORIOS) {
    if (!cidade.predios.some((p) => p.tipo === tipo)) problemas.push(`sem ${tipo}`);
  }
  if (cidade.predios.filter((p) => p.tipo === 'cottage').length < 4) problemas.push('menos de 4 cottages');
  for (const p of cidade.predios) {
    if (Math.abs(p.pos.x) > 5.8 || Math.abs(p.pos.z) > 2.6) problemas.push(`${p.id}: fora da tábua`);
    if (TIPOS_PREDIO[p.tipo] == null) problemas.push(`${p.id}: tipo fora do catálogo`);
  }
  for (let i = 0; i < cidade.predios.length; i++) {
    for (let j = i + 1; j < cidade.predios.length; j++) {
      const a = cidade.predios[i];
      const b = cidade.predios[j];
      if (Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) < 0.5)
        problemas.push(`${a.id} e ${b.id}: lotes sobrepostos`);
    }
  }
  // Diorama: mesmo contrato de POSICOES_DIORAMA/FORMAS_PREDIO.
  for (const [id, pos] of Object.entries(cidade.diorama.posicoes)) {
    const forma = cidade.diorama.formas[pos.predio];
    if (!forma) {
      problemas.push(`${id}: posição sem forma na maquete`);
      continue;
    }
    if (!CAMPOS_FORMA.every((c) => Number.isFinite(forma[c]))) problemas.push(`${id}: forma incompleta`);
    if (typeof forma.corParede !== 'string' || typeof forma.corTelhado !== 'string')
      problemas.push(`${id}: forma sem cores`);
    if (typeof forma.ristela !== 'boolean' || !Array.isArray(forma.chamines))
      problemas.push(`${id}: forma sem ristela/chaminés`);
  }
  return problemas;
}

// (3) Inserção íntegra.
function problemasDaInsercao(mundo) {
  const problemas = [];
  const idsPredio = new Set(mundo.cidade.predios.map((p) => p.id));
  for (const p of mundo.elenco) {
    const e = p.pacoteEspacial;
    if (!e) {
      problemas.push(`${p.id}: sem pacote espacial após a inserção`);
      continue;
    }
    if (!idsPredio.has(e.moradia)) problemas.push(`${p.id}: moradia inexistente`);
    if (!idsPredio.has(e.trabalho)) problemas.push(`${p.id}: trabalho inexistente`);
    if (!e.frequentados.every((f) => idsPredio.has(f))) problemas.push(`${p.id}: frequentado inexistente`);
    if (e.frequentados.length < 1 || e.frequentados.length > 3) problemas.push(`${p.id}: frequentados fora de 1–3`);
    for (const faixa of ['dia', 'noite', 'madrugada']) {
      if (!idsPredio.has(e.rotina[faixa])) problemas.push(`${p.id}: rotina de ${faixa} sem endereço`);
    }
    if (e.rotina.dia !== e.trabalho) problemas.push(`${p.id}: o dia não está no trabalho`);
    if (e.rotina.madrugada !== e.moradia) problemas.push(`${p.id}: a madrugada não está na moradia`);
  }
  return problemas;
}

// (4) O grafo é DERIVADO: recomputa de rotina × adjacência e compara.
function grafoEsperado(mundo) {
  const adj = new Set(mundo.cidade.adjacencias.map(([a, b]) => `${a}|${b}`));
  const saoAdj = (a, b) => a !== b && (adj.has(`${a}|${b}`) || adj.has(`${b}|${a}`));
  const arestas = [];
  for (const faixa of ['dia', 'noite', 'madrugada']) {
    for (let i = 0; i < mundo.elenco.length; i++) {
      for (let j = i + 1; j < mundo.elenco.length; j++) {
        const a = mundo.elenco[i];
        const b = mundo.elenco[j];
        const la = a.pacoteEspacial.rotina[faixa];
        const lb = b.pacoteEspacial.rotina[faixa];
        if (la === lb) arestas.push({ faixa, modo: 'mesmo_local', entre: [a.id, b.id], locais: [la, lb] });
        else if (saoAdj(la, lb)) arestas.push({ faixa, modo: 'adjacencia', entre: [a.id, b.id], locais: [la, lb] });
      }
    }
  }
  return arestas;
}

// (5) + (6) Interiores: LOD sem órfão e integridade de grid/mobília/planta.
function problemasDosInteriores(mundo) {
  const problemas = [];
  const chaves = Object.keys(mundo.interiores).sort();
  const elegiveis = [...mundo.locaisElegiveis].sort();
  if (JSON.stringify(chaves) !== JSON.stringify(elegiveis))
    problemas.push('interior órfão ou elegível sem interior (LOD violado)');
  for (const [id, interior] of Object.entries(mundo.interiores)) {
    if (!interior) {
      problemas.push(`${id}: interior nulo`);
      continue;
    }
    const { grid, comodos, mobilia, planta } = interior;
    const ocupadas = new Set();
    for (const c of comodos) {
      const r = c.ret;
      if (r.col < 0 || r.fila < 0 || r.col + r.colunas > grid.colunas || r.fila + r.filas > grid.filas)
        problemas.push(`${id}/${c.id}: cômodo fora do grid`);
      for (let col = r.col; col < r.col + r.colunas; col++) {
        for (let fila = r.fila; fila < r.fila + r.filas; fila++) {
          const chave = `${col}|${fila}`;
          if (ocupadas.has(chave)) problemas.push(`${id}/${c.id}: cômodos sobrepostos em ${chave}`);
          ocupadas.add(chave);
        }
      }
    }
    const celulasDeMobilia = new Set();
    for (const m of mobilia) {
      const comodo = comodos.find((c) => c.id === m.comodo);
      if (!comodo) {
        problemas.push(`${id}: mobília em cômodo inexistente (${m.id})`);
        continue;
      }
      const r = comodo.ret;
      const dentro =
        m.celula.col >= r.col && m.celula.col < r.col + r.colunas &&
        m.celula.fila >= r.fila && m.celula.fila < r.fila + r.filas;
      if (!dentro) problemas.push(`${id}/${m.id}: mobília fora do cômodo`);
      const chave = `${m.celula.col}|${m.celula.fila}`;
      if (celulasDeMobilia.has(chave)) problemas.push(`${id}/${m.id}: duas peças na mesma célula`);
      celulasDeMobilia.add(chave);
      // Vocabulário fechado: doméstico da classe do morador ∪ ofício do cômodo.
      const degrau = VOCABULARIO_DA_CLASSE[interior.classeSocialDoMorador];
      const permitidos = new Set([
        ...(MOBILIA_DE_OFICIO[comodo.tipoComodo]?.itens || []).map((i) => i.id),
        ...(MOBILIA_POR_CLASSE[degrau]?.itens || [])
          .filter((i) => i.comodos.includes(comodo.tipoComodo))
          .map((i) => i.id),
      ]);
      if (!permitidos.has(m.item)) problemas.push(`${id}/${m.id}: item fora do vocabulário fechado`);
    }
    // Planta SVG = projeção 1:1 do grid (fonte única de verdade espacial).
    const viewBoxEsperado = `0 0 ${48 + grid.colunas * 26} ${48 + grid.filas * 26}`;
    if (planta.viewBox !== viewBoxEsperado) problemas.push(`${id}: viewBox não deriva do grid`);
    if (JSON.stringify(planta.comodos.map((c) => c.id)) !== JSON.stringify(comodos.map((c) => c.id)))
      problemas.push(`${id}: cômodos da planta ≠ cômodos do grid`);
    if (planta.tracos.length !== mobilia.length) problemas.push(`${id}: traços da planta ≠ mobílias do grid`);
    if (!planta.comodos.every((c) => Array.isArray(c.alvos) && c.alvos.length === 0))
      problemas.push(`${id}: alvos deveriam nascer vazios (a montagem do pacote jogável, Fase 4+, liga os nós)`);
  }
  return problemas;
}

const problemasFase2 = mundosPrimeiraGeracao.flatMap((mundo, i) => {
  const seedRotulo = SEEDS_QA_GERADOR[i];
  return [
    ...problemasDaCidade(mundo.cidade),
    ...problemasDaInsercao(mundo),
    ...(JSON.stringify(grafoEsperado(mundo)) === JSON.stringify(mundo.grafoAvistamentos)
      ? []
      : ['grafo de avistamentos não deriva de rotina × adjacência']),
    ...problemasDosInteriores(mundo),
  ].map((p) => `${seedRotulo}: ${p}`);
});
const geracaoEspacialIntegra = problemasFase2.length === 0;
if (!geracaoEspacialIntegra) {
  console.log('\nGERADOR (FASE 2) — geração espacial com problemas:', problemasFase2.join(' | '));
}

// (7) Pacote espacial por arquétipo: completo, em vocabulário fechado,
// com proveniência por linha; tabelas de espaco.js idem.
const ACOMODACOES_ESPECIAIS = ['sobre_a_loja', 'no_servico', 'cottage'];
const TRABALHOS_ESPECIAIS = ['em_casa', 'casa_com_criadagem'];
const pacotesEspaciaisCompletos =
  Object.values(ARQUETIPOS).every((a) => {
    const e = a.pacoteEspacial;
    return (
      e != null &&
      (TIPOS_PREDIO[e.acomodacao] != null || ACOMODACOES_ESPECIAIS.includes(e.acomodacao)) &&
      (TIPOS_PREDIO[e.trabalho] != null || TRABALHOS_ESPECIAIS.includes(e.trabalho)) &&
      Array.isArray(e.frequentados) &&
      e.frequentados.length >= 2 &&
      e.frequentados.every((t) => TIPOS_PREDIO[t] != null) &&
      citaKb(e.proveniencia)
    );
  }) &&
  Object.values(TIPOS_PREDIO).every((t) => citaKb(t.proveniencia)) &&
  Object.values(MOBILIA_POR_CLASSE).every((v) => citaKb(v.proveniencia)) &&
  Object.values(MOBILIA_DE_OFICIO).every((v) => citaKb(v.proveniencia)) &&
  Object.values(PROVENIENCIA_ESPACO).every(citaKb) &&
  CLASSES_SOCIAIS.every((c) => MOBILIA_POR_CLASSE[VOCABULARIO_DA_CLASSE[c]] != null);

// ============================================================
// GUARDAS DO GERADOR (FASE 3 do gerador por simulação): o resolvedor de
// crime — autobattler de build time sobre o grid da cena — e a ponte
// forense para o pacote de caso. Provas:
// (1) replay — mesma seed → mesmo caso bruto byte a byte, INCLUÍDA a
// sequência de batalhas rejeitadas (§2.1); seeds distintas → crimes
// distintos;
// (2) reamostragem por rejeição íntegra: o assassino sempre vence (há
// posição de corpo e hora de morte), os descartes ficam registrados em
// ordem, e a vitória aceita vem logo após o último descarte (ou do modo
// desespero, sinalizado);
// (3) tabela viva sem atributo órfão (§3.1): FOR/INT/WIS mapeiam a
// classe de vestígio, CHA a comportamento de diálogo (Fase 1); toda
// classe de vestígio evidencia variável do catálogo fechado e cita
// proveniência na KB, como métodos e cenários;
// (4) RegistroDoCrime íntegro — os lints da fase: variável de batalha
// órfã = falha (toda variável ativa tem vestígio SOBREVIVENTE que a
// evidencia); limpeza sem 2ª ordem = falha (todo evento que remove
// vestígio deposita ao menos um de ordem 2 — conservação da evidência
// §3.3); coerência espacial = falha (todo vestígio referencia célula/
// cômodo/mobília existentes na cena; trilhas contíguas; o arrasto
// termina na posição final do corpo; livor da ponte contradiz a posição
// se e só se houve arrasto);
// (5) ponte consumível pelo MOTOR INTOCADO: a janela calculada por
// janelaDaCarta/intersecaoJanelas sobre as cartas temporais geradas
// cobre a hora real da morte; os sinais causais cravam o mecanismo por
// causasCompativeis/mecanismoCravado; presença (pertenceA) e móbil
// apontam o réu; a fatia é serializável.
// ============================================================
const casosGeradosPrimeira = SEEDS_QA_GERADOR.map((sd) => gerarCasoBruto(sd));
const casosGeradosSegunda = SEEDS_QA_GERADOR.map((sd) => gerarCasoBruto(sd));
const jsonCasosGerados = casosGeradosPrimeira.map((c) => JSON.stringify(c));
const crimeReplayOk = jsonCasosGerados.every((json, i) => json === JSON.stringify(casosGeradosSegunda[i]));
const crimesDistintos = new Set(casosGeradosPrimeira.map((c) => JSON.stringify(c.crime))).size === SEEDS_QA_GERADOR.length;

// (2) O assassino sempre vence; a rejeição fica registrada em ordem.
const rejeicaoIntegra = casosGeradosPrimeira.every((caso) => {
  const b = caso.crime.batalha;
  return (
    caso.crime.posicaoCorpo != null &&
    typeof caso.crime.hora.morte === 'number' &&
    b.tentativasDescartadas.every((t, i) => t.tentativa === i && ['assassino_ferido', 'vitima_resistiu'].includes(t.motivo)) &&
    (b.suprimida ? b.rodadas === 0 : b.rodadas >= 1) &&
    (b.desespero || b.tentativaAceita === b.tentativasDescartadas.length)
  );
});

// (3) Tabela viva: atributo órfão = falha; catálogos com proveniência.
const citaKbForense = (s) => typeof s === 'string' && /docs\/kb-(medicina-legal|mundo-vitoriano)\//.test(s);
const atributosComVestigio = new Set(Object.values(CLASSES_VESTIGIO).map((c) => c.atributo).filter(Boolean));
const tabelaVivaSemOrfao =
  ['FOR', 'INT', 'WIS'].every((a) => atributosComVestigio.has(a)) &&
  ['revela_facil', 'revela_sob_custo'].every((c) => CATALOGO_COMPORTAMENTOS[c] != null) &&
  Object.values(CLASSES_VESTIGIO).every(
    (c) =>
      c.evidenciaDe.length > 0 &&
      c.evidenciaDe.every((v) => VARIAVEIS_BATALHA[v] != null) &&
      [1, 2].includes(c.ordem) &&
      citaKbForense(c.proveniencia)
  ) &&
  Object.values(METODOS).every((m) => citaKbForense(m.proveniencia)) &&
  Object.values(PROVENIENCIA_METODOS).every(citaKbForense) &&
  Object.values(PROVENIENCIA_VESTIGIOS).every(citaKbForense);

// (4) Integridade do RegistroDoCrime — os lints da fase, caso a caso.
function problemasDoCrime(caso) {
  const problemas = [];
  const { crime, mundo, escolha } = caso;
  const interior = mundo.interiores[escolha.localId];
  const dentroDoGrid = (cel) =>
    cel.col >= 0 && cel.fila >= 0 && cel.col < interior.grid.colunas && cel.fila < interior.grid.filas;
  const comodoDe = (cel) => {
    const c = interior.comodos.find(
      (k) => cel.col >= k.ret.col && cel.col < k.ret.col + k.ret.colunas && cel.fila >= k.ret.fila && cel.fila < k.ret.fila + k.ret.filas
    );
    return c ? c.id : null;
  };
  const contigua = (celulas) =>
    celulas.every(
      (cel, i) => i === 0 || Math.abs(cel.col - celulas[i - 1].col) + Math.abs(cel.fila - celulas[i - 1].fila) === 1
    );

  // Vestígios: classe do catálogo, âncora espacial coerente, remoção legal.
  for (const v of crime.vestigios) {
    const def = CLASSES_VESTIGIO[v.classe];
    if (!def) {
      problemas.push(`${v.id}: classe fora do catálogo (${v.classe})`);
      continue;
    }
    if (v.ordem !== def.ordem) problemas.push(`${v.id}: ordem ≠ da classe`);
    if (!def.semCelula && !v.celula) problemas.push(`${v.id}: sem célula (classe exige âncora na cena)`);
    if (v.celula) {
      if (!dentroDoGrid(v.celula)) problemas.push(`${v.id}: célula fora do grid`);
      else if (v.comodo !== comodoDe(v.celula)) problemas.push(`${v.id}: cômodo ≠ da célula`);
    }
    if (v.celulas) {
      if (!v.celulas.every(dentroDoGrid)) problemas.push(`${v.id}: trilha sai do grid`);
      if (!contigua(v.celulas)) problemas.push(`${v.id}: trilha não contígua`);
    }
    if (v.mobilia && !interior.mobilia.some((m) => m.id === v.mobilia))
      problemas.push(`${v.id}: mobília inexistente (${v.mobilia})`);
    if (v.removido) {
      if (!def.removivel) problemas.push(`${v.id}: classe irremovível foi removida`);
      if (def.noCorpo) problemas.push(`${v.id}: vestígio do corpo foi removido`);
      if (!crime.eventos.some((e) => e.ordem === v.removidoPorEvento && e.vestigiosRemovidos.includes(v.id)))
        problemas.push(`${v.id}: remoção sem evento correspondente`);
    }
  }

  // Trilha de arrasto termina na posição final do corpo.
  for (const v of crime.vestigios.filter((x) => x.classe === 'trilha_arrasto')) {
    const fim = v.celulas[v.celulas.length - 1];
    if (fim.col !== crime.posicaoCorpo.celula.col || fim.fila !== crime.posicaoCorpo.celula.fila)
      problemas.push(`${v.id}: arrasto não termina no corpo`);
  }
  if (!dentroDoGrid(crime.posicaoCorpo.celula) || comodoDe(crime.posicaoCorpo.celula) !== crime.posicaoCorpo.comodo)
    problemas.push('posição do corpo incoerente com o grid');

  // Lint (b): variável de batalha órfã = falha.
  const sobreviventes = crime.vestigios.filter((v) => !v.removido);
  for (const [variavel] of Object.entries(crime.variaveis)) {
    if (VARIAVEIS_BATALHA[variavel] == null) problemas.push(`variável fora do catálogo: ${variavel}`);
    else if (!sobreviventes.some((v) => v.evidenciaDe.includes(variavel)))
      problemas.push(`variável órfã (sem vestígio sobrevivente): ${variavel}`);
  }

  // Lint (c): limpeza sem 2ª ordem = falha (conservação da evidência).
  for (const e of crime.eventos.filter((x) => x.vestigiosRemovidos.length > 0)) {
    const depositouSegunda = e.vestigiosDepositados.some(
      (id) => crime.vestigios.find((v) => v.id === id)?.ordem === 2
    );
    if (!depositouSegunda) problemas.push(`evento ${e.ordem} (${e.acao}): remove sem depositar 2ª ordem`);
  }

  // Eventos referenciam vestígios existentes; atores são do elenco.
  const idsVestigio = new Set(crime.vestigios.map((v) => v.id));
  const idsElenco = new Set(mundo.elenco.map((p) => p.id));
  for (const e of crime.eventos) {
    for (const id of [...e.vestigiosDepositados, ...e.vestigiosRemovidos]) {
      if (!idsVestigio.has(id)) problemas.push(`evento ${e.ordem}: vestígio inexistente (${id})`);
    }
    if (!idsElenco.has(e.ator)) problemas.push(`evento ${e.ordem}: ator fora do elenco (${e.ator})`);
    if (e.celula && !dentroDoGrid(e.celula)) problemas.push(`evento ${e.ordem}: célula fora do grid`);
  }

  // Contradição do arrasto na ponte: livor compatível ⇔ corpo não movido.
  const livor = caso.fatiaForense.cartas.find((c) => c.id === 'gen_livores');
  if (!livor.estados.every((s) => s.tagsOcultas.posicaoCompativel === !crime.cenaEncenada))
    problemas.push('livor da ponte não reflete o arrasto do registro');

  return problemas;
}
const problemasCrimes = casosGeradosPrimeira.flatMap((caso, i) =>
  problemasDoCrime(caso).map((p) => `${SEEDS_QA_GERADOR[i]}: ${p}`)
);
const crimesIntegros = problemasCrimes.length === 0;
if (!crimesIntegros) {
  console.log('\nGERADOR (FASE 3) — registro do crime com problemas:', problemasCrimes.join(' | '));
}

// (5) A ponte é consumível pelo motor forense EXISTENTE, sem alterá-lo.
function problemasDaPonte(caso) {
  const problemas = [];
  const { fatiaForense: fatia, crime } = caso;
  const verdade = fatia.verdadeDeOuro;
  const horaMorte = crime.hora.morte;
  const horaExame = 11; // chegada do perito, como no caso-escola
  const ipm = horaExame - horaMorte;

  if (verdade.reuCorreto !== crime.assassinoId) problemas.push('réu da verdade ≠ assassino do registro');
  if (verdade.horaMorteAbsoluta !== horaMorte) problemas.push('hora da verdade ≠ hora do registro');
  if (verdade.horasMorteAntesChegada !== ipm) problemas.push('IPM da verdade incoerente');
  if (verdade.cenaEncenada !== crime.cenaEncenada) problemas.push('encenação da verdade ≠ registro');

  // Janela do motor: cartas temporais resolvidas pelo IPM real do exame.
  const cartasTemporais = fatia.cartas
    .map((def) => ({ id: def.id, horaRegistro: horaExame, tagsOcultas: resolverEstadoCarta(def, ipm).tagsOcultas }))
    .filter((c) => c.tagsOcultas.dominio === 'temporal');
  const janelas = cartasTemporais.map(janelaDaCarta).filter(Boolean);
  const janela = intersecaoJanelas(janelas);
  if (!janela) problemas.push('cartas temporais da ponte se contradizem (interseção nula)');
  else if (!(janela.inicio <= horaMorte && horaMorte <= janela.fim))
    problemas.push(`janela do motor [${janela.inicio}, ${janela.fim}] não cobre a morte (${horaMorte})`);

  // Causa: os sinais causais cravam o mecanismo no catálogo universal.
  const sinais = fatia.cartas.filter((c) => c.tagsOcultas?.dominio === 'causal').map((c) => c.tagsOcultas.sinal);
  if (!causasCompativeis(sinais).some((c) => c.id === verdade.mecanismoCorreto))
    problemas.push('mecanismo correto incompatível com os sinais da ponte');
  if (mecanismoCravado(sinais)?.id !== verdade.mecanismoCorreto)
    problemas.push('sinais da ponte não cravam o mecanismo (assinatura ausente)');

  // Presença e móbil apontam o réu.
  if (!fatia.cartas.some((c) => c.tagsOcultas?.dominio === 'vestigio' && c.tagsOcultas.pertenceA === verdade.reuCorreto))
    problemas.push('nenhum vestígio de presença pertence ao réu');
  const motivo = fatia.cartas.find((c) => c.tagsOcultas?.subDominio === 'motivo');
  if (!motivo || motivo.tagsOcultas.motivo !== verdade.motivacaoCorreta || motivo.tagsOcultas.ligadoA !== verdade.reuCorreto)
    problemas.push('móbil da ponte não aponta o réu');

  // Ids únicos e fatia serializável (contrato do pacote).
  const ids = fatia.cartas.map((c) => c.id);
  if (new Set(ids).size !== ids.length) problemas.push('ids de carta duplicados na fatia');
  try {
    if (JSON.stringify(JSON.parse(JSON.stringify(fatia))) !== JSON.stringify(fatia))
      problemas.push('fatia não sobrevive a round-trip JSON');
  } catch {
    problemas.push('fatia não é serializável');
  }
  return problemas;
}
const problemasPonte = casosGeradosPrimeira.flatMap((caso, i) =>
  problemasDaPonte(caso).map((p) => `${SEEDS_QA_GERADOR[i]}: ${p}`)
);
const ponteConsumivel = problemasPonte.length === 0;
if (!ponteConsumivel) {
  console.log('\nGERADOR (FASE 3) — ponte forense com problemas:', problemasPonte.join(' | '));
}

const apressadoCaiEmArmadilha = vApressado.falhas.length >= 1 && vApressado.tipo !== 'vitoria_absoluta';
const checagens = [
  ['Pacote de caso serializável e completo (campos obrigatórios, ids únicos)', pacoteSerializavelCompleto],
  ['Slots de caso resolvem contra o pacote (entidade e campo existem)', slotsResolvem],
  ['Metódico resolve (vitoria_absoluta)', vMetodico.tipo === 'vitoria_absoluta'],
  ['Apressado cai em ≥1 armadilha (réu errado)', apressadoCaiEmArmadilha && vApressado.tipo === 'erro_judiciario'],
  ['Intuitivo alcança Impunidade (réu certo, provas furadas)', vIntuitivo.tipo === 'impunidade'],
  ['Pericial desatento condena com gafes (sucesso_gafes)', vDesatento.tipo === 'sucesso_gafes'],
  ['Degradado perde precisão, não some (rigor resolvido válido)', degradadoValido],
  ['Durável sempre resolve (janela finita cobre a verdade mesmo tarde)', cobreVerdade && janelaDuravelFinita],
  ['Avistamento falso é refutável pela janela do corpo', testemunhoRefutavel],
  ['Crente na última visita acusa a Sra. Rooke → erro_judiciario', vCrente.tipo === 'erro_judiciario'],
  ['Segundo rastro do réu reforça sem gafe; sozinho não basta', reforcoSemGafe && soVidroFalha],
  ['Refutar só a testemunha não credita a encenação (contrato do desfecho)', encenacaoNaoCreditada],
  ['O registro da estalagem derruba o paradeiro do réu (opcional, nunca pilar)', alibiReuCai],
  ['Rotina interrompida trava o teto; com o piso fecha janela finita', rotinaDaTeto && pisoMaisTetoFecham],
  ['Registro mecânico: janela fixa e refutação do mostrador forjado', registroMecanicoFixo && mostradorCaiPelaMaquina],
  ['Janela que cobre mas contradiz o suporte: código próprio e monólogo de contradição', codigoProprioContradicao && monologoExpoeContradicao],
  ['Periférico sem móbil na mesa não ganha "razões contra a vítima"', daveySemMotivoInventado],
  ['Blocos de periféricos sem eco verbatim (monólogo e epílogo)', perifericosSemEco && epilogoSemEco],
  ['A explicação da luz é paga no epílogo, e só com a refutação', luzPagaSoComRefutacao],
  ['Epílogo determinístico; a conta do perito lê a hora do selo', epilogoDeterministico],
  ['Determinismo: sem Math.random/Date.now em logic/data/store/gerador', violacoesDeterminismo.length === 0],
  ['Contrato de assets: manifesto válido (arquivo, dimensão, licença) e sem arte fora do manifesto', manifestoValido],
  ['Retrato em camadas: moldes bem-formados e compositor fora do motor', retratoEmCamadasOk],
  ['Aparência: genótipo completo (curadoria + derivação determinística)', aparenciasOk],
  ['Aparência fora do motor: veredicto/acusação não leem a camada', motorSemAparencia],
  ['Modo purista fora do motor: veredicto/acusação não leem a flag (Onda 8)', motorSemPurista],
  ['Papéis fora do motor: veredicto/acusação não leem o casting (FASE 5)', motorSemPapeis],
  ['Eco do mestre fora do motor: veredicto/acusação não leem a fala da falha (FASE 6)', motorSemEco],
  ['Casting íntegro: elenco completo e papéis pressupõem hábitos reais (FASE 5)', papeisIntegros],
  ['Diorama: todo nó do mapa tem posição e forma na maquete', dioramaCompleto],
  ['Corpo 3D: todo hotspot aponta para carta real do corpo', hotspotsValidos],
  ['Pontos de interesse: nenhuma carta órfã ao dividir a prosa (§5.1)', pontosCobremCartas],
  ['Interrogatórios em diálogo íntegros (§7.1): requerCarta/vaiPara/[[id]]/confrontos↔reacoesProva válidos, sem carta órfã', dialogosIntegros],
  ['Diálogo desce e não volta; toda descida rende a sustentação, precisão possível (§7.2)', dialogosDescemESolvem],
  ['Alcançabilidade global (Onda 6): toda carta nasce de algum [[id]]', cartasInalcancaveis.length === 0],
  ['Apresentação em cena anota refuta_alibi no mural (Onda 5)', parCena && confrontoClassificado],
  ['Prova alheia apresentada cai na evasiva sem anotar nada (Onda 5)', soUmaLigacaoCena && apresentadasMarcadas],
  ['Gerador: replay byte a byte (mesma seed → mesmo elenco) (FASE 1)', geradorReplayOk],
  ['Gerador: 3 seeds → 3 elencos distintos (FASE 1)', geradorSeedsDistintas],
  ['Gerador: elencos plausíveis e íntegros (nomes únicos, idade na faixa, atributos 1–5, único-na-vila, JSON puro)', geradorElencosPlausiveis],
  ['Atributos fora do motor: veredicto/acusação não leem FOR/INT/WIS/CHA/arquétipo/trait (FASE 1)', motorSemAtributos],
  ['Gerador é ilha: nenhum código de runtime importa src/gerador (FASE 1)', geradorForaDoRuntime],
  ['Trait sem órfão: todo trait de todo pool mapeia a comportamento do catálogo fechado (FASE 1)', traitsSemOrfao],
  ['Proveniência por linha: todo arquétipo e tabela auxiliar citam a KB (FASE 1)', provenienciaCompleta],
  ['Priors bem-formados: pesos, gêneros, faixas, classes e motivos íntegros (FASE 1)', priorsBemFormados],
  ['Gerador: replay do mundo byte a byte (mesma seed → mesma cidade/inserções/grafo/interiores) (FASE 2)', mundoReplayOk],
  ['Gerador: 3 seeds → 3 mundos distintos (FASE 2)', mundosDistintos],
  ['Geração espacial íntegra: cidade plausível, diorama compatível, inserção válida, grafo derivado, interiores sem órfão e no vocabulário (FASE 2)', geracaoEspacialIntegra],
  ['Pacote espacial por arquétipo completo, em vocabulário fechado e com proveniência (FASE 2)', pacotesEspaciaisCompletos],
  ['Gerador: replay do caso bruto byte a byte, incluída a sequência de batalhas rejeitadas (FASE 3)', crimeReplayOk],
  ['Gerador: 3 seeds → 3 crimes distintos (FASE 3)', crimesDistintos],
  ['Reamostragem por rejeição: o assassino sempre vence e os descartes ficam registrados (FASE 3)', rejeicaoIntegra],
  ['Tabela viva sem atributo órfão: FOR/INT/WIS → vestígio, CHA → comportamento; proveniência nos catálogos (FASE 3)', tabelaVivaSemOrfao],
  ['RegistroDoCrime íntegro: variável órfã, limpeza sem 2ª ordem e incoerência espacial = falha (FASE 3)', crimesIntegros],
  ['Ponte consumível: o motor intocado cobre a hora real, crava o mecanismo e acha presença e móbil do réu (FASE 3)', ponteConsumivel],
];
console.log('\n=== Critério de validação ===');
let todasOk = true;
for (const [rotulo, ok] of checagens) {
  console.log(`${ok ? 'OK ' : 'FALHA'} — ${rotulo}`);
  if (!ok) todasOk = false;
}
console.log(todasOk ? '\nCASO VÁLIDO.' : '\nCASO INVÁLIDO.');
process.exit(todasOk ? 0 : 1);
