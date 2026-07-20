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
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { useJogo } from '../src/store/jogo.js';
import { hashDecisao as hashDecisaoQa } from '../src/gerador/hash_gerador.js';
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
  FISICA_DA_MOBILIA,
  CALIBRACAO_MOBILIA,
  ITENS_COM_AGUA,
} from '../src/gerador/espaco.js';
import { gerarCasoBruto } from '../src/gerador/caso.js';
import { METODOS, PROVENIENCIA_METODOS } from '../src/gerador/metodos.js';
import { CLASSES_VESTIGIO, VARIAVEIS_BATALHA, PROVENIENCIA_VESTIGIOS, SEDES_POR_REGIAO } from '../src/gerador/vestigios.js';
import { CATALOGO_ACOES, DOUTRINA_VITIMA, DOUTRINA_ASSASSINO, doutrina, acoesLegais } from '../src/gerador/doutrinas.js';
import { hashString } from '../src/logic/hash.js';
import {
  CATALOGO_INTERFERENCIA,
  CLASSES_VESTIGIO_INTERFERENCIA,
  PROSA_PRENUNCIO,
} from '../src/gerador/interferencia.js';
import { ECOS_INTERFERENCIA_PADRAO } from '../src/data/ecos_interferencia.js';

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
// veredicto — o motor repousa no corpo/cena). VAZIO desde 18/07/2026: a
// lasca na bainha de Silas (ev_vidro_dobra) foi democratizada para os
// quatro tons (historico-decisoes.md) e a guarda voltou a ser estrita —
// toda carta da árvore sai em TODA descida. A categoria fica registrada
// para um retorno consciente, se o tom um dia virar mecânica (Opção B).
const CARTAS_PRECISAO = new Set([]);
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
  // FASE 4 — interferência, OPCIONAL: ausente ⇒ passa (o tutorial). Presente,
  // todo evento referencia cartas que EXISTEM em `cartas` (o runtime aplica
  // por id) e traz gatilho/efeito/anúncio bem-formados.
  if (p.interferencias != null) {
    const eventos = p.interferencias.eventos;
    if (!Array.isArray(eventos)) {
      problemas.push('interferencias.eventos ausente');
    } else {
      const idsCartasPacote = new Set((p.cartas || []).map((c) => c.id));
      for (const ev of eventos) {
        if (!ev.id || !ev.tipo) problemas.push('interferencias: evento sem id/tipo');
        if (!ev.gatilho?.tipo) problemas.push(`interferencias.${ev.id}: sem gatilho`);
        if (ev.gatilho?.tipo === 'extracao_carta' && !idsCartasPacote.has(ev.gatilho.cartaId))
          problemas.push(`interferencias.${ev.id}: gatilho aponta carta fora do pacote`);
        if (ev.efeito?.cartaDestruida && !idsCartasPacote.has(ev.efeito.cartaDestruida))
          problemas.push(`interferencias.${ev.id}: cartaDestruida fora do pacote`);
        for (const id of ev.efeito?.cartasNovas || []) {
          if (!idsCartasPacote.has(id)) problemas.push(`interferencias.${ev.id}: carta nova sem definição no pacote (${id})`);
        }
        if (typeof ev.anuncio !== 'string' || !ev.anuncio.trim()) problemas.push(`interferencias.${ev.id}: sem anúncio`);
      }
    }
  }
  // FASE 4 — ecosInterferencia, OPCIONAL: mesmo shape dos ecos do mestre.
  if (p.ecosInterferencia != null) {
    const e = p.ecosInterferencia;
    if (typeof e.titulo !== 'string' || !e.titulo.trim()) problemas.push('ecosInterferencia.titulo ausente ou vazio');
    if (!e.porChave || typeof e.porChave !== 'object') {
      problemas.push('ecosInterferencia.porChave ausente');
    } else {
      for (const [chave, variantes] of Object.entries(e.porChave)) {
        if (!Array.isArray(variantes) || variantes.length === 0 || !variantes.every((v) => typeof v === 'string' && v.trim())) {
          problemas.push(`ecosInterferencia.porChave.${chave}: variantes inválidas`);
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
    b.tentativasDescartadas.every(
      (t, i) =>
        t.tentativa === i &&
        ['assassino_ferido', 'vitima_resistiu', 'vitima_escapou', 'vitima_venceu_armada', 'assassino_incapacitado'].includes(t.motivo)
    ) &&
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
  // E2: no palco externo a chegada é variável (descoberta + 2–4h, teto
  // 13h); no interno, a convenção das 13h do caso-escola.
  const horaExame = caso.escolha.palco?.externo ? caso.escolha.palco.descoberta.chegadaPerito : 13;
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

// ============================================================
// GUARDAS DO GERADOR (FASE 4 do gerador por simulação): o sistema de
// interferência — eventos contingentes sob as Regras de Justiça R1–R6
// (docs/game-design-simulacao.md §5). Provas:
// (1) catálogo fechado v1 íntegro: exatamente os 4 tipos; cada um declara
// gatilho observável, penalidade WIS > 0, vestígios de sucesso/falha no
// catálogo de classes, delta informacional e proveniência na KB; toda
// classe de vestígio de interferência é governada por WIS (R1), é FRESCA
// e cita proveniência; a prosa do prenúncio existe (R4) e os ecos
// pós-caso cobrem todas as chaves alcançáveis;
// (2) integridade dos eventos, caso a caso: orçamento ≤ 3 e ≤ sorteado
// (R5); tipo do catálogo, sem repetição; ator do elenco com papel
// coerente (assassino/cúmplice); rolagem com a penalidade do catálogo,
// alvo e sucesso coerentes com o WIS do ator (R1); ≥ 1 carta nova por
// evento com definição presente e classe que evidencia o tipo (R2);
// evidência destruída EXISTE no caso, nunca é do corpo, e é REDUNDANTE —
// recomputado AQUI com as funções do motor (janela cobre, mecanismo
// crava, presença e móbil apontam o réu) — inclusive no RAMO PIOR, com
// todas as destruições do caso juntas (R2); gatilho referencia carta
// existente, traz comoSoube e não destrói o próprio gatilho (R3 —
// gatilho órfão = falha); rota com sustentação recomputada contra
// rotina/adjacência/frequentados do mundo e comoChegou (R3 — rota órfã
// = falha); todo silenciar tem prenúncio com prosa, carta FORA do gate
// e interior no local do alvo (R4 + LOD);
// (3) cobertura: nas seeds fixas de interferência, cada um dos 4 tipos
// materializa ao menos uma vez e o ator-cúmplice ocorre;
// (4) runtime mínimo sobre pacote SINTÉTICO (clone do tutorial +
// eventos): carta nova gated até o disparo; evidência destruída perdida
// após o disparo e preservada quando o perito chega primeiro (evitada);
// eco pós-caso derivado por chave; e o TUTORIAL segue sem interferência
// (nada dispara — regressão zero);
// (5) cegueira do motor: veredicto/acusação não citam interferência.
// ============================================================

// Réplica independente do predicado R2 (mesmas funções do motor).
function fatiaResolveSemQa(fatia, idsRemovidos) {
  const verdade = fatia.verdadeDeOuro;
  const horaExame = verdade.horaMorteAbsoluta + verdade.horasMorteAntesChegada;
  const removidos = new Set(idsRemovidos);
  const cartasFatia = fatia.cartas.filter((c) => !removidos.has(c.id));
  const ipm = horaExame - verdade.horaMorteAbsoluta;
  const temporais = cartasFatia
    .map((def) => ({ id: def.id, horaRegistro: horaExame, tagsOcultas: resolverEstadoCarta(def, ipm).tagsOcultas }))
    .filter((c) => c.tagsOcultas.dominio === 'temporal');
  const janela = intersecaoJanelas(temporais.map(janelaDaCarta).filter(Boolean));
  if (!janela || !(janela.inicio <= verdade.horaMorteAbsoluta && verdade.horaMorteAbsoluta <= janela.fim)) return false;
  const sinais = cartasFatia.filter((c) => c.tagsOcultas?.dominio === 'causal').map((c) => c.tagsOcultas.sinal);
  if (mecanismoCravado(sinais)?.id !== verdade.mecanismoCorreto) return false;
  if (!cartasFatia.some((c) => c.tagsOcultas?.dominio === 'vestigio' && c.tagsOcultas.pertenceA === verdade.reuCorreto)) return false;
  if (!cartasFatia.some((c) => c.tagsOcultas?.subDominio === 'motivo' && c.tagsOcultas.ligadoA === verdade.reuCorreto)) return false;
  return true;
}

// (1) Catálogo fechado íntegro + prosa do prenúncio + chaves dos ecos.
const TIPOS_INTERFERENCIA_V1 = ['destruir_evidencia', 'intimidar_testemunha', 'silenciar', 'subornar_testemunha'];
const CHAVES_ECO_INTERFERENCIA = [
  'destruir_evidencia_ocorrida', 'destruir_evidencia_evitada',
  'intimidar_testemunha_ocorrida', 'intimidar_testemunha_evitada',
  'subornar_testemunha_ocorrida', // suborno não destrói nada: nunca há 'evitada'
  'silenciar_ocorrida', 'silenciar_evitada',
];
const catalogoInterferenciaIntegro =
  JSON.stringify(Object.keys(CATALOGO_INTERFERENCIA).sort()) === JSON.stringify([...TIPOS_INTERFERENCIA_V1].sort()) &&
  Object.values(CATALOGO_INTERFERENCIA).every(
    (t) =>
      typeof t.gatilhoObservavel === 'string' &&
      t.penalidadeWis > 0 &&
      typeof t.deltaInformacional === 'string' &&
      [...t.vestigios.sucesso, ...t.vestigios.falha].every((c) => CLASSES_VESTIGIO_INTERFERENCIA[c] != null) &&
      citaKbForense(t.proveniencia)
  ) &&
  Object.values(CLASSES_VESTIGIO_INTERFERENCIA).every(
    (c) =>
      c.atributo === 'WIS' &&
      c.frescor === 'fresco' &&
      c.evidenciaDe.length > 0 &&
      c.evidenciaDe.every((t) => CATALOGO_INTERFERENCIA[t] != null) &&
      citaKbForense(c.proveniencia)
  ) &&
  PROSA_PRENUNCIO.length > 0 &&
  PROSA_PRENUNCIO.every((v) => typeof v === 'string' && v.trim().length > 0) &&
  CHAVES_ECO_INTERFERENCIA.every(
    (ch) =>
      Array.isArray(ECOS_INTERFERENCIA_PADRAO.porChave[ch]) &&
      ECOS_INTERFERENCIA_PADRAO.porChave[ch].length > 0 &&
      ECOS_INTERFERENCIA_PADRAO.porChave[ch].every((v) => typeof v === 'string' && v.trim())
  );

// (2) Integridade dos eventos, caso a caso.
function problemasDaInterferencia(caso) {
  const problemas = [];
  const { interferencia, mundo, fatiaForense, crime, escolha } = caso;
  if (!interferencia) return ['caso sem bloco de interferência'];
  const { eventos, cartasExtra, esqueleto } = interferencia;
  if (eventos.length > 3) problemas.push('orçamento estourado (R5)');
  if (eventos.length > esqueleto.orcamento) problemas.push('materializou mais que o orçamento sorteado (R5)');
  const idsCartasCaso = new Set([...fatiaForense.cartas.map((c) => c.id), ...cartasExtra.map((c) => c.id)]);
  if (idsCartasCaso.size !== fatiaForense.cartas.length + cartasExtra.length) problemas.push('id de carta repetido no caso');
  const idsExtra = new Set(cartasExtra.map((c) => c.id));
  const adjIntf = new Set(mundo.cidade.adjacencias.map(([a, b]) => `${a}|${b}`));
  const saoAdjIntf = (a, b) => a !== b && (adjIntf.has(`${a}|${b}`) || adjIntf.has(`${b}|${a}`));
  const tiposVistos = new Set();

  for (const ev of eventos) {
    const cat = CATALOGO_INTERFERENCIA[ev.tipo];
    if (!cat) {
      problemas.push(`${ev.id}: tipo fora do catálogo (R6)`);
      continue;
    }
    if (tiposVistos.has(ev.tipo)) problemas.push(`${ev.id}: tipo repetido no caso`);
    tiposVistos.add(ev.tipo);
    const ator = mundo.elenco.find((p) => p.id === ev.ator);
    if (!ator) problemas.push(`${ev.id}: ator fora do elenco`);
    if (ev.atorPapel === 'assassino' && ev.ator !== crime.assassinoId) problemas.push(`${ev.id}: papel de assassino com outro ator`);
    if (ev.atorPapel === 'cumplice' && ev.ator === crime.assassinoId) problemas.push(`${ev.id}: cúmplice é o próprio assassino`);

    // R1 — rolagem penalizada e coerente.
    if (ev.rolagem.penalidade !== cat.penalidadeWis) problemas.push(`${ev.id}: penalidade ≠ catálogo (R1)`);
    if (ator && (ev.rolagem.wis !== ator.atributos.WIS || ev.rolagem.alvo !== Math.max(0, ator.atributos.WIS - cat.penalidadeWis)))
      problemas.push(`${ev.id}: rolagem incoerente com o WIS do ator (R1)`);
    if (ev.rolagem.sucesso !== ev.rolagem.dado < ev.rolagem.alvo) problemas.push(`${ev.id}: sucesso ≠ dado × alvo (R1)`);

    // R2 — vestígio novo obrigatório, classes do catálogo e do tipo.
    const novas = ev.efeito?.cartasNovas || [];
    if (novas.length < 1) problemas.push(`${ev.id}: sem vestígio novo (R2)`);
    const classesDoTipo = new Set([...cat.vestigios.sucesso, ...cat.vestigios.falha]);
    for (const id of novas) {
      const def = cartasExtra.find((c) => c.id === id);
      if (!def) {
        problemas.push(`${ev.id}: carta nova sem definição (${id})`);
        continue;
      }
      const classe = def.vestigioInterferencia?.classe;
      if (!CLASSES_VESTIGIO_INTERFERENCIA[classe]) problemas.push(`${ev.id}: classe fora do catálogo (${id})`);
      else if (!CLASSES_VESTIGIO_INTERFERENCIA[classe].evidenciaDe.includes(ev.tipo))
        problemas.push(`${ev.id}: classe não evidencia o tipo (${id})`);
      if (classe && !classesDoTipo.has(classe)) problemas.push(`${ev.id}: classe fora do declarado pelo tipo (${id})`);
    }

    // R2 — evidência destruída: do caso, nunca do corpo, redundante.
    if (ev.efeito?.cartaDestruida) {
      const destruida = ev.efeito.cartaDestruida;
      if (!idsCartasCaso.has(destruida)) problemas.push(`${ev.id}: evidência destruída fora do caso`);
      const defDestruida = fatiaForense.cartas.find((c) => c.id === destruida);
      if (defDestruida?.suporteFisico === 'corpo') problemas.push(`${ev.id}: interferência alcançou o corpo (proibido)`);
      if (!fatiaResolveSemQa(fatiaForense, [destruida])) problemas.push(`${ev.id}: evidência destruída não é redundante (R2)`);
    }

    // R3 — gatilho observável, não-órfão, que não destrói a si mesmo.
    const g = ev.gatilho || {};
    if (g.tipo !== 'extracao_carta' || !idsCartasCaso.has(g.cartaId)) problemas.push(`${ev.id}: gatilho órfão (R3)`);
    if (typeof g.comoSoube !== 'string' || !g.comoSoube.trim()) problemas.push(`${ev.id}: sem comoSoube (R3)`);
    if (g.cartaId && g.cartaId === ev.efeito?.cartaDestruida) problemas.push(`${ev.id}: gatilho destruiria a si mesmo`);

    // R3 — rota recomputada contra o mundo.
    const r = ev.rota || {};
    if (typeof r.comoChegou !== 'string' || !r.comoChegou.trim()) problemas.push(`${ev.id}: sem comoChegou (R3)`);
    if (ator) {
      const origem = ator.pacoteEspacial.rotina[r.faixa];
      const sustenta =
        (r.sustentacao === 'mesmo_local' && origem === r.para) ||
        (r.sustentacao === 'adjacente' && saoAdjIntf(origem, r.para)) ||
        (r.sustentacao === 'frequentado' && ator.pacoteEspacial.frequentados.includes(r.para)) ||
        (r.sustentacao === 'retorno_a_cena' && ev.ator === crime.assassinoId && r.para === escolha.localId);
      if (!sustenta || r.de !== origem) problemas.push(`${ev.id}: rota órfã (R3)`);
    }

    // R4 — prenúncio do silenciar: prosa presente, carta fora do gate,
    // interior no local do alvo (LOD por relevância).
    if (ev.tipo === 'silenciar') {
      if (!ev.prenuncio || typeof ev.prenuncio.texto !== 'string' || !ev.prenuncio.texto.trim() || !idsExtra.has(ev.prenuncio.cartaId))
        problemas.push(`${ev.id}: silenciar sem prenúncio legível (R4)`);
      if (ev.prenuncio && novas.includes(ev.prenuncio.cartaId)) problemas.push(`${ev.id}: prenúncio atrás do gate`);
      if (!mundo.interiores[ev.alvo?.localId]) problemas.push(`${ev.id}: local do silenciamento sem interior (LOD)`);
    }
    if (typeof ev.anuncio !== 'string' || !ev.anuncio.trim()) problemas.push(`${ev.id}: sem anúncio de diário`);
  }

  // R2 — ramo pior: todas as destruições do caso juntas.
  const destruidas = eventos.map((e) => e.efeito?.cartaDestruida).filter(Boolean);
  if (destruidas.length > 0 && !fatiaResolveSemQa(fatiaForense, destruidas))
    problemas.push('ramo com todas as destruições não resolve (R2)');

  // Nenhuma carta extra órfã (toda def pertence a um evento ou prenúncio).
  const referenciadas = new Set(
    eventos.flatMap((e) => [...(e.efeito?.cartasNovas || []), ...(e.prenuncio ? [e.prenuncio.cartaId] : [])])
  );
  for (const c of cartasExtra) {
    if (!referenciadas.has(c.id)) problemas.push(`carta extra órfã: ${c.id}`);
  }
  return problemas;
}

// (3) Cobertura: seeds fixas onde os 4 tipos materializam (e o cúmplice
// ocorre) — varridas deterministicamente na Fase 4; mudar o gerador pode
// exigir nova varredura (o objetivo é nunca deixar os lints vazios).
// Varredura refeita na F2 da OS priors compostos (o prior composto +
// hashDecisao mudaram a amostragem; regra desta guarda) e na B3 da OS
// autobattler v2 (o resolvedor novo mudou o replay; cúmplice em _130).
const SEEDS_QA_INTERFERENCIA = ['intf_qa_0', 'intf_qa_4', 'intf_qa_5', 'intf_qa_130'];
const casosInterferencia = SEEDS_QA_INTERFERENCIA.map((sd) => gerarCasoBruto(sd));
const problemasInterferencia = [...casosGeradosPrimeira, ...casosInterferencia].flatMap((caso) =>
  problemasDaInterferencia(caso).map((p) => `${caso.seed}: ${p}`)
);
const interferenciaIntegra = problemasInterferencia.length === 0;
if (!interferenciaIntegra) {
  console.log('\nGERADOR (FASE 4) — interferência com problemas:', problemasInterferencia.join(' | '));
}
const tiposCobertos = new Set(casosInterferencia.flatMap((c) => c.interferencia.eventos.map((e) => e.tipo)));
const coberturaInterferencia =
  TIPOS_INTERFERENCIA_V1.every((t) => tiposCobertos.has(t)) &&
  casosInterferencia.some((c) => c.interferencia.eventos.some((e) => e.atorPapel === 'cumplice'));

// (5) Cegueira do motor: veredicto/acusação não citam interferência.
const motorSemInterferencia = ['logic/veredicto.js', 'logic/acusacao.js'].every(
  (f) => !/interferenc/i.test(semComentarios(readFileSync(path.join(raizSrc, f), 'utf8')))
);

// (4) Runtime mínimo sobre pacote sintético (clone do tutorial + eventos).
function pacoteSinteticoInterferencia() {
  const p = JSON.parse(JSON.stringify(montarPacoteTutorial()));
  p.id = 'sintetico_interferencia';
  p.cartas.push({
    id: 'sint_intf_cinzas',
    localidade: 'cena',
    textoDisplay: 'Cinzas Frescas',
    carimboPadrao: 'Cinzas frescas na lareira',
    descricao: 'Carta sintética de QA (contrato do runtime, não do caso corrente).',
    tagsOcultas: { dominio: 'vestigio', subDominio: 'limpeza_fresca' },
  });
  p.interferencias = {
    eventos: [
      {
        id: 'intf_sint_1',
        tipo: 'destruir_evidencia',
        ator: 'silas_crane',
        atorPapel: 'assassino',
        gatilho: { tipo: 'extracao_carta', cartaId: 'dep_testamento', comoSoube: 'sintético' },
        rota: { de: 'oficina', para: 'cena', faixa: 'noite', sustentacao: 'retorno_a_cena', comoChegou: 'sintético' },
        rolagem: { wis: 3, penalidade: 2, alvo: 1, dado: 4, sucesso: false },
        efeito: { cartaDestruida: 'ev_suplica_cesto', cartasNovas: ['sint_intf_cinzas'] },
        prenuncio: null,
        anuncio: 'Sinais de mexida na cena.',
      },
    ],
  };
  p.ecosInterferencia = ECOS_INTERFERENCIA_PADRAO;
  return p;
}

// Caminho OCORRIDA: gate antes do disparo; perda depois; eco por chave.
useJogo.getState().carregarCaso(pacoteSinteticoInterferencia());
useJogo.getState().escolherDetective();
useJogo.getState().iniciarInvestigacao();
useJogo.getState().extrairCarta('sint_intf_cinzas');
const gateAntesDoDisparo = !s().cartasRegistradas.some((c) => c.id === 'sint_intf_cinzas');
useJogo.getState().extrairCarta('dep_testamento'); // o gatilho observável
const disparoRegistrado = s().interferenciasDisparadas.length === 1 && s().interferenciasDisparadas[0].evitada === false;
useJogo.getState().extrairCarta('ev_suplica_cesto');
const evidenciaPerdida = !s().cartasRegistradas.some((c) => c.id === 'ev_suplica_cesto');
useJogo.getState().extrairCarta('sint_intf_cinzas');
const vestigioNovoDisponivel = s().cartasRegistradas.some((c) => c.id === 'sint_intf_cinzas');
useJogo.getState().definirReu('silas_crane');
useJogo.getState().submeterAcusacao();
const ecoOcorrida = s().conclusoes.find((c) => c.tagsOcultas?.tipo === 'eco_interferencia');
const ecoOcorridaOk = ecoOcorrida?.tagsOcultas.chave === 'destruir_evidencia_ocorrida' && !!ecoOcorrida.resumo;

// Caminho EVITADA: quem chega primeiro não perde a peça (R4).
useJogo.getState().carregarCaso(pacoteSinteticoInterferencia());
useJogo.getState().escolherDetective();
useJogo.getState().iniciarInvestigacao();
useJogo.getState().extrairCarta('ev_suplica_cesto'); // o perito chega primeiro
useJogo.getState().extrairCarta('dep_testamento');
const evitadaRegistrada = s().interferenciasDisparadas[0]?.evitada === true;
const evidenciaSalva = s().cartasRegistradas.some((c) => c.id === 'ev_suplica_cesto');
useJogo.getState().definirReu('silas_crane');
useJogo.getState().submeterAcusacao();
const ecoEvitada = s().conclusoes.find((c) => c.tagsOcultas?.tipo === 'eco_interferencia');
const ecoEvitadaOk = ecoEvitada?.tagsOcultas.chave === 'destruir_evidencia_evitada';

// Regressão zero: o tutorial (sem `interferencias`) segue inerte.
useJogo.getState().carregarCaso(montarPacoteTutorial());
useJogo.getState().escolherDetective();
useJogo.getState().iniciarInvestigacao();
useJogo.getState().extrairCarta('dep_testamento');
useJogo.getState().extrairCarta('ev_suplica_cesto');
const tutorialInerte = s().interferenciasDisparadas.length === 0 && s().cartasRegistradas.length === 2;

// Restaura o pacote do caso-escola para as checagens/estado seguintes.
carregarCaso(pacote);
const runtimeInterferenciaOk =
  gateAntesDoDisparo &&
  disparoRegistrado &&
  evidenciaPerdida &&
  vestigioNovoDisponivel &&
  ecoOcorridaOk &&
  evitadaRegistrada &&
  evidenciaSalva &&
  ecoEvitadaOk &&
  tutorialInerte;

// ============================================================
// GUARDAS DO GERADOR (FASE 5 do gerador por simulação): QA DA
// SOLVABILIDADE SOB INTERFERÊNCIA — as Regras de Justiça promovidas a
// INVARIANTES verificados por máquina (docs/game-design-simulacao.md §5).
// Provas:
// (1) PROVA DA ÂNCORA SOB TODOS OS RAMOS: a árvore de combinações de
// eventos do caso é ENUMERADA (orçamento ≤ 3 ⇒ ≤ 8 ramos — a enumeração
// é trivial por construção, R5) e, em CADA ramo, a fatia ainda resolve
// com as MESMAS funções do motor (janela cobre a morte, mecanismo
// cravado, presença e móbil do réu): a âncora durável e ao menos um
// caminho completo até ela sobrevivem SEMPRE — não só no ramo pior;
// (2) SALDO INFORMACIONAL EXPLÍCITO (R2): o conjunto redundante é
// computado carta a carta (remoção isolada ainda resolve) e todo evento
// destrói DENTRO dele — além de depositar ≥ 1 carta nova;
// (3) CAUSALIDADE (R3): gatilho órfão e rota órfã já são falha na guarda
// da FASE 4 (recomputados contra carta existente e rotina/adjacência/
// frequentados do mundo); a prova da FASE 5 é ADVERSARIAL — as
// armadilhas de (6) mostram que a guarda CAI quando deve;
// (4) PRENÚNCIO NA PROSA (R4): todo silenciar publica carta de sinal com
// prosa REAL — idêntica ao texto do evento, interpolada (sem {slot}
// residual), nomeando a testemunha-alvo e FORA do gate do disparo;
// (5) REPLAY: mesma seed → mesmo caso INTEIRO byte a byte (cidade,
// inserções, crime, fatia E eventos contingentes) — estende o replay da
// FASE 3 às seeds fixas de interferência;
// (6) ARMADILHAS (aceite da fase): casos deliberadamente quebrados —
// âncora destruível, gatilho órfão, rota órfã, silenciar sem prenúncio,
// evento sem vestígio novo — TÊM de ser detectados pelas guardas; e o
// caso válido passa nas mesmas provas (sem falso positivo).
// ============================================================

// (1) A árvore de ramos: em runtime, QUALQUER subconjunto dos eventos
// pode ter disparado (o jogador controla os gatilhos pela ordem em que
// investiga) — todo subconjunto é um estado alcançável do caso.
function ramosDeEventos(eventos) {
  const ramos = [];
  for (let mascara = 0; mascara < 2 ** eventos.length; mascara++) {
    ramos.push(eventos.filter((_, i) => mascara & (2 ** i)));
  }
  return ramos;
}

function problemasDaSolvabilidade(caso) {
  const problemas = [];
  const { interferencia, fatiaForense } = caso;
  const eventos = interferencia?.eventos || [];
  if (eventos.length > 3) {
    // R5 é o que mantém a enumeração trivial; sem ela, esta prova não escala.
    return ['mais de 3 eventos: enumeração de ramos deixou de ser trivial (R5 furada)'];
  }
  for (const ramo of ramosDeEventos(eventos)) {
    const destruidas = ramo.map((e) => e.efeito?.cartaDestruida).filter(Boolean);
    if (!fatiaResolveSemQa(fatiaForense, destruidas)) {
      const rotulo = ramo.map((e) => e.id).join('+') || 'nenhum evento';
      problemas.push(`ramo {${rotulo}}: a âncora perde o último caminho completo`);
    }
  }
  // (2) Conjunto redundante explícito: pertencer a ele é a definição de
  // "destrutível" — o evento nunca decide sozinho o que é redundante.
  const conjuntoRedundante = new Set(
    fatiaForense.cartas.filter((c) => fatiaResolveSemQa(fatiaForense, [c.id])).map((c) => c.id)
  );
  for (const ev of eventos) {
    if ((ev.efeito?.cartasNovas || []).length < 1)
      problemas.push(`${ev.id}: saldo informacional negativo — sem carta nova (R2)`);
    if (ev.efeito?.cartaDestruida && !conjuntoRedundante.has(ev.efeito.cartaDestruida))
      problemas.push(`${ev.id}: destrói fora do conjunto redundante (${ev.efeito.cartaDestruida}) (R2)`);
  }
  return problemas;
}

// (4) O prenúncio é prosa DO CASO, não rótulo técnico: a carta existe,
// carrega o texto exato do evento, está interpolada e nomeia o alvo.
function problemasDoPrenuncio(caso) {
  const problemas = [];
  const { interferencia, mundo } = caso;
  for (const ev of (interferencia?.eventos || []).filter((e) => e.tipo === 'silenciar')) {
    const carta = (interferencia.cartasExtra || []).find((c) => c.id === ev.prenuncio?.cartaId);
    if (!carta) {
      problemas.push(`${ev.id}: silenciar sem carta de prenúncio no caso (R4)`);
      continue;
    }
    if (carta.descricao !== ev.prenuncio.texto) problemas.push(`${ev.id}: prosa da carta ≠ texto do prenúncio (R4)`);
    if (/\{[^}]*\}/.test(carta.descricao)) problemas.push(`${ev.id}: prenúncio com slot não interpolado (R4)`);
    const testemunha = mundo.elenco.find((p) => p.id === ev.alvo?.testemunhaId);
    if (!testemunha || !carta.descricao.includes(testemunha.nome))
      problemas.push(`${ev.id}: prenúncio não nomeia a testemunha-alvo (R4)`);
    if ((ev.efeito?.cartasNovas || []).includes(carta.id))
      problemas.push(`${ev.id}: prenúncio atrás do gate do disparo — chegaria tarde (R4)`);
  }
  return problemas;
}

const casosSobProva = [...casosGeradosPrimeira, ...casosInterferencia];
const problemasSolvabilidade = casosSobProva.flatMap((caso) =>
  problemasDaSolvabilidade(caso).map((p) => `${caso.seed}: ${p}`)
);
const solvabilidadeSobRamos = problemasSolvabilidade.length === 0;
if (!solvabilidadeSobRamos) {
  console.log('\nGERADOR (FASE 5) — solvabilidade sob interferência:', problemasSolvabilidade.join(' | '));
}

const problemasPrenuncio = casosSobProva.flatMap((caso) =>
  problemasDoPrenuncio(caso).map((p) => `${caso.seed}: ${p}`)
);
const prenuncioNaProsaOk = problemasPrenuncio.length === 0;
if (!prenuncioNaProsaOk) {
  console.log('\nGERADOR (FASE 5) — prenúncio fora da prosa:', problemasPrenuncio.join(' | '));
}

// (5) Replay das seeds de interferência: o caso INTEIRO, byte a byte —
// mesma cidade, mesmas inserções, mesmo crime, mesma fatia e OS MESMOS
// eventos contingentes (gatilhos, rotas, rolagens, cartas extra).
const casosInterferenciaReplay = SEEDS_QA_INTERFERENCIA.map((sd) => gerarCasoBruto(sd));
const replayInterferenciaOk = casosInterferencia.every(
  (c, i) => JSON.stringify(c) === JSON.stringify(casosInterferenciaReplay[i])
);

// (6) ARMADILHAS — o aceite da fase: o QA tem de CAIR nos casos
// deliberadamente quebrados e PASSAR no caso válido. Cada armadilha é um
// clone de caso real com UMA violação injetada.
const clonarCaso = (caso) => JSON.parse(JSON.stringify(caso));
const casoComDestruicao = casosSobProva.find((c) => c.interferencia.eventos.some((e) => e.efeito?.cartaDestruida));
const casoComEvento = casosSobProva.find((c) => c.interferencia.eventos.length > 0);
const casoComSilenciar = casosSobProva.find((c) => c.interferencia.eventos.some((e) => e.tipo === 'silenciar'));

let armadilhasDetectadas = false;
if (casoComDestruicao && casoComEvento && casoComSilenciar) {
  // Armadilha (a) — ÂNCORA DESTRUÍVEL: o evento passa a destruir o móbil
  // (gen_motivo é caminho único até o réu; removê-lo quebra a fatia). O
  // ramo com o evento perde o caminho completo E a carta sai do conjunto
  // redundante — as duas provas têm de acusar.
  const armadilhaAncora = clonarCaso(casoComDestruicao);
  armadilhaAncora.interferencia.eventos.find((e) => e.efeito?.cartaDestruida).efeito.cartaDestruida = 'gen_motivo';
  const acusacoesAncora = problemasDaSolvabilidade(armadilhaAncora);
  const detectaAncoraDestrutivel =
    acusacoesAncora.some((p) => p.includes('último caminho completo')) &&
    acusacoesAncora.some((p) => p.includes('conjunto redundante'));

  // Armadilha (b) — GATILHO ÓRFÃO: o gatilho aponta carta que não existe
  // no caso (deixa de ser ação observável do jogador — R3).
  const armadilhaGatilho = clonarCaso(casoComEvento);
  armadilhaGatilho.interferencia.eventos[0].gatilho.cartaId = 'carta_que_nao_existe';
  const detectaGatilhoOrfao = problemasDaInterferencia(armadilhaGatilho).some((p) => p.includes('gatilho órfão (R3)'));

  // Armadilha (c) — ROTA ÓRFÃ: a origem declarada desmente a rotina do
  // ator (o trajeto perde a sustentação espacial — R3).
  const armadilhaRota = clonarCaso(casoComEvento);
  armadilhaRota.interferencia.eventos[0].rota.de = 'predio_que_nao_existe';
  const detectaRotaOrfa = problemasDaInterferencia(armadilhaRota).some((p) => p.includes('rota órfã (R3)'));

  // Armadilha (d) — SILENCIAR SEM PRENÚNCIO: a morte da testemunha sem
  // sinal prévio legível (R4) — as duas guardas (Fase 4 e Fase 5) acusam.
  const armadilhaPrenuncio = clonarCaso(casoComSilenciar);
  armadilhaPrenuncio.interferencia.eventos.find((e) => e.tipo === 'silenciar').prenuncio = null;
  const detectaSemPrenuncio =
    problemasDaInterferencia(armadilhaPrenuncio).some((p) => p.includes('R4')) &&
    problemasDoPrenuncio(armadilhaPrenuncio).some((p) => p.includes('R4'));

  // Armadilha (e) — SALDO NEGATIVO: evento que só destrói, sem depositar
  // carta nova (o roubo sem troca — R2).
  const armadilhaSaldo = clonarCaso(casoComEvento);
  armadilhaSaldo.interferencia.eventos[0].efeito.cartasNovas = [];
  const detectaSaldoNegativo = problemasDaSolvabilidade(armadilhaSaldo).some((p) =>
    p.includes('saldo informacional negativo')
  );

  // O caso VÁLIDO passa nas mesmas provas — armadilha sem falso positivo.
  const casoValidoPassa =
    problemasDaSolvabilidade(casoComDestruicao).length === 0 &&
    problemasDaInterferencia(casoComEvento).length === 0 &&
    problemasDoPrenuncio(casoComSilenciar).length === 0;

  armadilhasDetectadas =
    detectaAncoraDestrutivel && detectaGatilhoOrfao && detectaRotaOrfa && detectaSemPrenuncio && detectaSaldoNegativo && casoValidoPassa;
  if (!armadilhasDetectadas) {
    console.log(
      '\nGERADOR (FASE 5) — armadilhas não detectadas:',
      JSON.stringify({
        detectaAncoraDestrutivel,
        detectaGatilhoOrfao,
        detectaRotaOrfa,
        detectaSemPrenuncio,
        detectaSaldoNegativo,
        casoValidoPassa,
      })
    );
  }
} else {
  console.log('\nGERADOR (FASE 5) — seeds sob prova sem os três casos-base das armadilhas (cobertura furada).');
}

// ============================================================
// GERADOR (FASE 6) — O CASO GERADO É JOGÁVEL. Três provas:
//   (a) REPLAY DO EMBARCADO: os pacotes commitados em src/data/
//       casos_gerados.js são exatamente o que o montador produz hoje das
//       mesmas seeds (réplica com as variáveis dirigidas; pool pelas
//       seeds dos próprios ids) — byte a byte via JSON.
//   (b) HIGIENE DE TODO PACOTE EMBARCADO: campos obrigatórios; todo
//       marcador [[id]] aponta carta e toda carta tem caminho de extração
//       (prosa, gesto ou bloco contingente); blocos contingentes apontam
//       eventos existentes; slots resolvem.
//   (c) OS 4 PERFIS NOS CASOS GERADOS: o mesmo critério de validação do
//       caso-escola (§18), dirigindo o STORE com o pacote gerado — a
//       réplica e um caso do pool produzem os 4 desfechos.
// ============================================================
const { montarPacoteGerado, SEED_REPLICA, DIRIGIDO_REPLICA } = await import(
  '../src/gerador/pacote_gerado.js'
);
const { CASO_REPLICA, CASOS_POOL } = await import('../src/data/casos_gerados.js');

// (a) Replay byte a byte do arquivo embarcado. A regeneração fica à mão
// para o cheque (f) da árvore de diálogo (replay chamada a chamada).
const regenReplica = montarPacoteGerado(SEED_REPLICA, { dirigido: DIRIGIDO_REPLICA });
const replayReplicaOk = JSON.stringify(regenReplica) === JSON.stringify(CASO_REPLICA);
const replayPoolOk = CASOS_POOL.every(
  (p) => JSON.stringify(montarPacoteGerado(p.id.replace(/^gerado_/, ''))) === JSON.stringify(p)
);
const casosEmbarcadosReplay = replayReplicaOk && replayPoolOk;
if (!casosEmbarcadosReplay) {
  console.log('\nGERADOR (FASE 6) — casos_gerados.js DIVERGE do montador (rodar npm run gerar:casos).');
}

// ============================================================
// P9 — FASE 0: TELEMETRIA DA ÂNCORA DUPLA (só mede; não falha)
// ------------------------------------------------------------
// Antes de tocar o gerador, medir quanto do pool JÁ tem uma segunda âncora
// de autoria de espécie INDEPENDENTE do "traço na cena" (o defeito P9). A
// espécie 2 é o traço do CORPO do agressor: `ferimento_do_agressor` (no
// corpo do réu, suporteFisico 'corpo_do_reu' — durável, fora do alcance da
// R2) e `sangue_do_agressor` (na cena — de espécie 2, mas destrutível). O
// número calibra a Via A (docs/os-p9-ancora-hibrida.md, Fase 0). Proxy de
// durabilidade: suporteFisico !== 'cena' (o mesmo critério da R2).
// ============================================================
function telemetriaP9DuplaAncora(casos) {
  let duravel = 0; // 2ª âncora durável independente (ferimento_do_agressor)
  let fragil = 0; // 2ª âncora de espécie 2, mas destrutível (sangue na cena)
  let soInstrumental = 0; // só a espécie 1 → cairia na Via B (contra-hipótese)
  const linhas = [];
  for (const caso of casos) {
    const cartas = caso.cartas || [];
    const reu = caso.verdadeDeOuro?.reuCorreto;
    const vestigiosReu = cartas.filter(
      (c) => c.tagsOcultas?.dominio === 'vestigio' && c.tagsOcultas.pertenceA === reu
    );
    const temFerimentoDuravel = vestigiosReu.some(
      (c) => c.tagsOcultas.subDominio === 'ferimento_do_agressor' && c.suporteFisico !== 'cena'
    );
    const temSangueAgressor = vestigiosReu.some((c) => c.tagsOcultas.subDominio === 'sangue_do_agressor');
    let classe;
    if (temFerimentoDuravel) {
      duravel++;
      classe = 'DUPLA-DURÁVEL (ferimento_do_agressor)';
    } else if (temSangueAgressor) {
      fragil++;
      classe = 'espécie-2 frágil (sangue na cena)';
    } else {
      soInstrumental++;
      classe = 'só instrumental → Via B';
    }
    linhas.push(`  ${caso.id}: ${classe}`);
  }
  return { total: casos.length, duravel, fragil, soInstrumental, linhas };
}
const p9Telemetria = telemetriaP9DuplaAncora([CASO_REPLICA, ...CASOS_POOL]);
console.log('\nP9 — FASE 0 (telemetria da âncora dupla; risco zero, só mede):');
console.log(
  `  ${p9Telemetria.duravel}/${p9Telemetria.total} casos com 2ª âncora DURÁVEL independente (ferimento_do_agressor)`
);
console.log(`  ${p9Telemetria.fragil}/${p9Telemetria.total} com espécie-2 só FRÁGIL (sangue na cena, destrutível)`);
console.log(`  ${p9Telemetria.soInstrumental}/${p9Telemetria.total} SÓ com a âncora instrumental → cairiam na Via B`);
console.log(p9Telemetria.linhas.join('\n'));
const p9Fase0Ok = p9Telemetria.total === 21;

// (b) Higiene de todos os pacotes embarcados.
function problemasDoPacoteGerado(pacote) {
  const problemas = [];
  for (const campo of CAMPOS_OBRIGATORIOS_PACOTE) {
    if (pacote[campo] == null) problemas.push(`campo obrigatório ausente: ${campo}`);
  }
  const ids = new Set(pacote.cartas.map((c) => c.id));
  const marcados = new Set();
  const textos = [];
  for (const l of pacote.localidades) {
    textos.push(...(l.prosa || []), ...(l.introducao || []));
    for (const pt of l.pontos || []) textos.push(...pt.prosa);
    for (const b of l.blocosContingentes || []) {
      textos.push(...b.paragrafos);
      const eventos = pacote.interferencias?.eventos || [];
      if (!eventos.some((e) => e.id === b.eventoId)) {
        problemas.push(`${l.id}: bloco contingente aponta evento inexistente ${b.eventoId}`);
      }
      if (b.quando !== 'disparado' && b.quando !== 'nao_disparado') {
        problemas.push(`${l.id}: bloco contingente com "quando" inválido (${b.quando})`);
      }
    }
    for (const g of l.gestos || []) marcados.add(g.cartaId);
  }
  // Fala de diálogo é caminho de extração como a prosa de localidade (OS
  // da árvore procedural: as cartas de álibi nascem nos beats).
  for (const d of Object.values(pacote.dialogos || {})) {
    for (const no of Object.values(d.nos)) textos.push(...(no.fala || []));
  }
  for (const t of textos) {
    for (const m of t.matchAll(/\[\[(\w+)\]\]/g)) marcados.add(m[1]);
    for (const falta of slotsNaoResolvidos(t, pacote)) problemas.push(`slot não resolve: ${falta}`);
  }
  for (const id of marcados) if (!ids.has(id)) problemas.push(`marcador órfão: ${id}`);
  for (const id of ids) if (!marcados.has(id)) problemas.push(`carta inalcançável: ${id}`);
  // Prosa de carta gerada não pode vazar id interno (gen_...) nem rótulo cru.
  for (const c of pacote.cartas) {
    const camposTexto = [c.textoDisplay, c.carimboPadrao, c.descricao]
      .concat((c.estados || []).flatMap((e) => [e.textoDisplay, e.carimboPadrao, e.descricao]))
      .filter(Boolean);
    for (const txt of camposTexto) {
      if (/\bgen_\w+/.test(txt)) problemas.push(`${c.id}: id interno vazando na prosa ("${txt.slice(0, 40)}…")`);
      if (txt.includes('Rótulo técnico')) problemas.push(`${c.id}: rótulo técnico sem prosa realizada`);
    }
  }
  return problemas;
}
const problemasEmbarcados = [CASO_REPLICA, ...CASOS_POOL].flatMap((p) =>
  problemasDoPacoteGerado(p).map((x) => `${p.id}: ${x}`)
);
const casosEmbarcadosIntegros = problemasEmbarcados.length === 0;
if (!casosEmbarcadosIntegros) {
  console.log('\nGERADOR (FASE 6) — pacotes embarcados com problemas:');
  for (const p of problemasEmbarcados.slice(0, 12)) console.log('  ·', p);
}

// (c) Os 4 perfis nos casos gerados (dirigindo o store, como no §18).
function perfisDoCasoGerado(pacote) {
  const verdade = pacote.verdadeDeOuro;
  const idsCartas = new Set(pacote.cartas.map((c) => c.id));
  const resultados = {};
  const arrancar = () => {
    s().carregarCaso(pacote);
    s().escolherDetective();
    s().iniciarInvestigacao();
  };
  const extrairTudoDoMetodico = () => {
    s().viajarPara('corpo');
    s().medirTemperatura();
    ['gen_rigor', 'gen_livores', 'gen_lesao_fatal', 'gen_reacao_vital'].forEach(
      (id) => idsCartas.has(id) && s().extrairCarta(id)
    );
    s().viajarPara('cena');
    // v2: a peça de hora forjada e os rastros de visita dos periféricos
    // com segredo também vivem na cena — o Metódico recolhe tudo.
    ['gen_instrumento', 'gen_pertence', 'gen_sangue_alheio', 'gen_pegadas', 'gen_hora_forjada'].forEach((id) => {
      const c = pacote.cartas.find((x) => x.id === id);
      if (c && c.localidade === 'cena') s().extrairCarta(id);
    });
    pacote.cartas
      .filter((c) => c.localidade === 'cena' && (c.tagsOcultas || {}).subDominio === 'rastro_de_visita')
      .forEach((c) => s().extrairCarta(c.id));
    s().viajarPara('vizinhanca'); // antes do móbil: extração do móbil é gatilho comum
    if (idsCartas.has('gen_ruido_ouvido')) s().extrairCarta('gen_ruido_ouvido');
    s().viajarPara('delegacia');
    ['gen_visto_vivo', 'gen_motivo'].forEach((id) => idsCartas.has(id) && s().extrairCarta(id));
    // v2: os álibis (cartas dos beats de diálogo) entram na mesa — o juízo
    // periférico do Metódico é perícia, não convicção.
    for (const susp of pacote.suspeitos) {
      if (idsCartas.has(`gen_alibi_${susp.id}`)) s().extrairCarta(`gen_alibi_${susp.id}`);
    }
    if (pacote.cartas.some((c) => c.localidade === 'oficio_do_reu')) {
      s().viajarPara('oficio_do_reu');
      s().extrairCarta('gen_instrumento');
    }
  };
  const ligarTripe = (registradas) => {
    for (const c of registradas.filter((x) => x.tagsOcultas.dominio === 'temporal')) ligar(c.id, ANCORAS.quando);
    for (const c of registradas.filter((x) => x.tagsOcultas.dominio === 'causal')) ligar(c.id, ANCORAS.como);
    const nexo = registradas.find(
      (c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.pertenceA === verdade.reuCorreto
    );
    if (nexo) ligar(nexo.id, ANCORAS.presenca);
  };

  // METÓDICO → vitoria_absoluta.
  arrancar();
  extrairTudoDoMetodico();
  const registradas = s().cartasRegistradas;
  const janelaGerada = intersecaoJanelas(
    registradas.filter((c) => c.tagsOcultas.dominio === 'temporal').map(janelaDaCarta).filter(Boolean)
  );
  const sinaisGerados = registradas
    .filter((c) => c.tagsOcultas.dominio === 'causal')
    .map((c) => c.tagsOcultas.sinal)
    .filter(Boolean);
  const causaGerada = mecanismoCravado(sinaisGerados);
  s().definirReu(verdade.reuCorreto);
  s().definirJanela({ inicio: janelaGerada.inicio, fim: janelaGerada.fim });
  s().definirCausa(causaGerada ? causaGerada.id : null);
  s().definirMotivacao('gen_motivo');
  ligarTripe(registradas);
  // v2 — os dois pilares reativados no gerado:
  // (a) descuidos: fatos temporais do corpo refutam a peça encenada;
  if (verdade.cenaEncenada) {
    for (const c of registradas.filter((x) => x.tagsOcultas.dominio === 'temporal')) {
      ligar(c.id, 'gen_hora_forjada');
    }
  }
  // (b) juízos: todo periférico declarado inocente; o de segredo, com o
  // álibi quebrado pelo próprio rastro (a mentira de vergonha exposta).
  for (const [suspeitoId, p] of Object.entries(verdade.perifericos || {})) {
    s().definirJuizo(suspeitoId, 'inocente');
    if (p.veredictoEsperado === 'inocente_segredo') {
      ligar(`gen_segredo_${suspeitoId}`, `gen_alibi_${suspeitoId}`);
    }
  }
  s().submeterAcusacao();
  resultados.metodico = s().veredicto.tipo;
  resultados.monologoGeradoOk = gerarMonologo(s().veredicto, s().detective).blocos.length > 0;
  s().fecharVeredicto();

  // APRESSADO (réu errado) → erro_judiciario.
  arrancar();
  s().viajarPara('corpo');
  ['gen_rigor', 'gen_livores'].forEach((id) => s().extrairCarta(id));
  const outro = pacote.suspeitos.find((x) => x.id !== verdade.reuCorreto);
  s().definirReu(outro.id);
  s().definirJanela({ inicio: -24, fim: 10 });
  for (const c of s().cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'temporal')) {
    ligar(c.id, ANCORAS.quando);
  }
  s().submeterAcusacao();
  resultados.apressado = s().veredicto.tipo;
  s().fecharVeredicto();

  // INTUITIVO (réu certo, sem materialidade) → impunidade.
  arrancar();
  s().viajarPara('corpo');
  ['gen_rigor', 'gen_livores'].forEach((id) => s().extrairCarta(id));
  s().definirReu(verdade.reuCorreto);
  s().definirJanela({ inicio: -24, fim: 10 });
  for (const c of s().cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'temporal')) {
    ligar(c.id, ANCORAS.quando);
  }
  s().submeterAcusacao();
  resultados.intuitivo = s().veredicto.tipo;
  s().fecharVeredicto();

  // PERICIAL DESATENTO (tripé ok, janela larga só pelo rigor, sem móbil)
  // → sucesso_gafes.
  arrancar();
  extrairTudoDoMetodico();
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
  resultados.desatento = s().veredicto.tipo;
  s().fecharVeredicto();

  return resultados;
}

const perfisReplica = perfisDoCasoGerado(CASO_REPLICA);
const perfisPool = perfisDoCasoGerado(CASOS_POOL[0]);
const quatroDesfechos = (r) =>
  r.metodico === 'vitoria_absoluta' &&
  r.apressado === 'erro_judiciario' &&
  r.intuitivo === 'impunidade' &&
  r.desatento === 'sucesso_gafes' &&
  r.monologoGeradoOk !== false;
const casosGeradosJogaveis = quatroDesfechos(perfisReplica) && quatroDesfechos(perfisPool);
console.log('\n=== GERADOR (FASE 6) — perfis nos casos gerados ===');
console.log('réplica:', JSON.stringify(perfisReplica));
console.log('pool[0]:', JSON.stringify(perfisPool));

// ============================================================
// ÁRVORES DE DIÁLOGO GERADAS (OS árvore procedural — spec §8.7 em
// docs/os-arvore-dialogo-procedural.md). Três provas sobre TODOS os
// pacotes embarcados:
//   (d) ESTRUTURA: árvore por suspeito; noInicial/noEvasiva existem;
//       toda vaiPara existe; nenhum nó órfão; todo beat tem os 4 tons;
//       bijeção confrontos↔reacoesProva; requerCarta e destino de reação
//       existem; o beat de paradeiro sustenta a MESMA carta nos 4 tons;
//       fala e rótulo não vazam id interno (fora dos marcadores). Gatilho
//       de complexo: nó terminal, reação sem carta (biografia ≠ prova), e
//       o anti-tell do portão dos ≥2 por caso (0 ou ≥2, nunca 1).
//   (e) ARMADILHAS SINTÉTICAS (lição da Fase 5): beat de 3 tons,
//       confronto sem reação, nó órfão e requerCarta fantasma TÊM de
//       falhar — e o caso válido passa. `--self-test` verboseia.
//   (f) REPLAY chamada a chamada: mesma seed → mesma árvore, byte a byte
//       (o cheque (a) já cobre regeneração × arquivo commitado).
// ============================================================
const TONS_DIALOGO = ['firme', 'cordial', 'tecnico', 'obliquo'];
function problemasDosDialogosGerados(pacote) {
  const problemas = [];
  const idsCartas = new Set(pacote.cartas.map((c) => c.id));
  const dialogos = pacote.dialogos || {};
  for (const s of pacote.suspeitos) {
    if (!Object.values(dialogos).some((d) => d.suspeitoId === s.id)) {
      problemas.push(`suspeito sem árvore: ${s.id}`);
    }
  }
  for (const [id, d] of Object.entries(dialogos)) {
    const nos = d.nos || {};
    const idsNos = new Set(Object.keys(nos));
    if (!idsNos.has(d.noInicial)) problemas.push(`${id}: noInicial inexistente`);
    if (!idsNos.has(d.noEvasiva)) problemas.push(`${id}: noEvasiva inexistente`);
    if (d.origemLocalidade && !pacote.localidades.some((l) => l.id === d.origemLocalidade)) {
      problemas.push(`${id}: origemLocalidade órfã (${d.origemLocalidade})`);
    }
    for (const [noId, no] of Object.entries(nos)) {
      for (const op of no.opcoes || []) {
        if (!idsNos.has(op.vaiPara)) problemas.push(`${id}:${noId}: vaiPara órfão (${op.vaiPara})`);
      }
      if ((no.opcoes || []).length > 0) {
        const tons = (no.opcoes || []).map((o) => o.tom);
        if (tons.length !== 4 || TONS_DIALOGO.some((t) => !tons.includes(t))) {
          problemas.push(`${id}:${noId}: beat sem os 4 tons (${tons.join(',') || 'nenhum'})`);
        }
      }
    }
    // Alcançabilidade: a descida desde noInicial, mais os nós de reação, a
    // evasiva e os destinos de gatilho (canal lateral), tem de cobrir TODOS
    // os nós da árvore.
    const alcancados = new Set([
      d.noEvasiva,
      ...Object.values(d.reacoesProva || {}),
      ...(d.gatilhos || []).map((g) => g.vaiPara),
    ]);
    const descer = (noId) => {
      if (!noId || alcancados.has(noId) || !nos[noId]) return;
      alcancados.add(noId);
      for (const op of nos[noId].opcoes || []) descer(op.vaiPara);
    };
    descer(d.noInicial);
    for (const noId of idsNos) if (!alcancados.has(noId)) problemas.push(`${id}: nó órfão (${noId})`);
    // Bijeção confrontos ↔ reacoesProva; cartas e destinos existem.
    const chavesReacao = new Set(Object.keys(d.reacoesProva || {}));
    const chavesConfronto = new Set((d.confrontos || []).map((c) => c.requerCarta));
    for (const c of chavesConfronto) {
      if (!chavesReacao.has(c)) problemas.push(`${id}: confronto sem reação (${c})`);
      if (!idsCartas.has(c)) problemas.push(`${id}: requerCarta fantasma (${c})`);
    }
    for (const c of chavesReacao) if (!chavesConfronto.has(c)) problemas.push(`${id}: reação sem confronto (${c})`);
    for (const [cartaId, destino] of Object.entries(d.reacoesProva || {})) {
      if (!idsNos.has(destino)) problemas.push(`${id}: reação de ${cartaId} aponta nó inexistente (${destino})`);
    }
    // Sustentação: os 4 nós do beat de paradeiro rendem a MESMA carta em
    // qualquer tom (solubilidade — spec §8.2).
    const primeirosBeats = (nos[d.noInicial]?.opcoes || []).map((op) => op.vaiPara);
    const marcadoresDoNo = (noId) =>
      new Set((nos[noId]?.fala || []).flatMap((t) => [...t.matchAll(/\[\[(\w+)\]\]/g)].map((m) => m[1])));
    if (primeirosBeats.length === 4) {
      const comum = [...marcadoresDoNo(primeirosBeats[0])].filter(
        (mk) => primeirosBeats.every((b) => marcadoresDoNo(b).has(mk)) && idsCartas.has(mk)
      );
      if (comum.length === 0) problemas.push(`${id}: beat de paradeiro sem sustentação comum nos 4 tons`);
    }
    // Gatilho de complexo (OS os-flags-psiquicas-no-dialogo.md, Fase 1):
    // confronto SEM carta, canal lateral. Cada entrada aponta um nó real,
    // TERMINAL (opcoes: [] — não desce a árvore), com rótulo não-vazio; e a
    // reação é BIOGRAFIA, nunca prova — nenhum marcador [[carta]] na fala do
    // nó de gatilho (o fair play que separa biografia de caso, §3 da OS).
    for (const g of d.gatilhos || []) {
      if (!g || typeof g.rotulo !== 'string' || g.rotulo.trim() === '') {
        problemas.push(`${id}: gatilho com rótulo vazio`);
      }
      if (!idsNos.has(g?.vaiPara)) {
        problemas.push(`${id}: gatilho aponta nó inexistente (${g?.vaiPara})`);
      } else {
        const alvo = nos[g.vaiPara];
        if ((alvo.opcoes || []).length !== 0) problemas.push(`${id}: nó de gatilho não é terminal (${g.vaiPara})`);
        if (marcadoresDoNo(g.vaiPara).size > 0) {
          problemas.push(`${id}: gatilho cita carta na reação (biografia ≠ prova) (${g.vaiPara})`);
        }
      }
    }
    // Fala e rótulo não vazam id interno (fora dos marcadores [[…]]).
    const textos = [
      ...Object.values(nos).flatMap((n) => n.fala || []),
      ...Object.values(nos).flatMap((n) => (n.opcoes || []).map((o) => o.rotulo)),
      ...(d.confrontos || []).map((c) => c.rotulo),
      ...(d.gatilhos || []).map((g) => g.rotulo),
      d.chamada,
      d.titulo,
      d.subtitulo,
    ].filter(Boolean);
    for (const t of textos) {
      if (/\bgen_\w+/.test(t.replace(/\[\[\w+\]\]/g, ''))) {
        problemas.push(`${id}: id interno vazando em fala/rótulo ("${t.slice(0, 40)}…")`);
      }
    }
  }
  // Anti-tell do gatilho (§3 da OS): por caso, o número de árvores com
  // gatilho é 0 ou ≥ 2 — nunca 1. Se o réu fosse o único a "perder a linha",
  // a compostura desmontada viraria tell. O portão dos ≥2 vive no derivador;
  // aqui ele é FISCALIZADO no pacote embarcado.
  const comGatilho = Object.values(dialogos).filter((d) => (d.gatilhos || []).length > 0).length;
  if (comGatilho === 1) {
    problemas.push(`gatilho solitário (${comGatilho}): o portão dos ≥2 falhou — viraria tell`);
  }
  // Fase 2 — fair play da projeção (acusa_com_fervor): a projeção do b2 firme
  // nomeia sempre um INOCENTE, NUNCA o réu (apontá-lo "resolveria" o caso —
  // Knox nº6). O derivador escolhe o alvo excluindo o assassino; aqui é
  // FISCALIZADO no pacote embarcado. Nas árvores dos OUTROS suspeitos, a única
  // fala que nomeia um suspeito é a projeção (as demais citam a vítima ou a si
  // mesmo em 3ª pessoa); logo o nome do réu ausente delas prova que ninguém o
  // acusa. A árvore do PRÓPRIO réu é excluída — lá o nome dele consta das
  // rubricas de reação, sem quebra de fair play.
  const reuId = pacote.verdadeDeOuro?.reuCorreto;
  const reuNome = (pacote.suspeitos || []).find((s) => s.id === reuId)?.nome;
  if (reuNome) {
    for (const [id, d] of Object.entries(dialogos)) {
      if (d.suspeitoId === reuId) continue;
      for (const no of Object.values(d.nos || {})) {
        for (const f of no.fala || []) {
          if (f.includes(reuNome)) {
            problemas.push(`${id}: nome do réu em fala de outro suspeito — a projeção acusaria o culpado ("${f.slice(0, 40)}…")`);
          }
        }
      }
    }
  }
  return problemas;
}

// (d) Estrutura em todos os pacotes embarcados.
const problemasDialogosGerados = [CASO_REPLICA, ...CASOS_POOL].flatMap((p) =>
  problemasDosDialogosGerados(p).map((x) => `${p.id}: ${x}`)
);
const dialogosGeradosIntegros = problemasDialogosGerados.length === 0;
if (!dialogosGeradosIntegros) {
  console.log('\nÁRVORE DE DIÁLOGO — problemas de estrutura:');
  for (const p of problemasDialogosGerados.slice(0, 12)) console.log('  ·', p);
}

// (e) Armadilhas sintéticas: cada clone quebrado TEM de acusar.
const selfTestVerboso = process.argv.includes('--self-test');
const armadilhaDialogo = (nome, mutar, esperado) => {
  const clone = JSON.parse(JSON.stringify(CASO_REPLICA));
  mutar(clone);
  const caiu = problemasDosDialogosGerados(clone).some((p) => p.includes(esperado));
  if (selfTestVerboso) console.log(`self-test árvore de diálogo — ${nome}: ${caiu ? 'DETECTADA' : 'PASSOU SEM CAIR'}`);
  return caiu;
};
const detectaTresTons = armadilhaDialogo(
  'beat de 3 tons',
  (c) => {
    const d = Object.values(c.dialogos)[0];
    d.nos[d.noInicial].opcoes.pop();
  },
  'beat sem os 4 tons'
);
const detectaConfrontoSemReacao = armadilhaDialogo(
  'confronto sem reação',
  (c) => {
    const d = Object.values(c.dialogos).find((x) => (x.confrontos || []).length > 0);
    delete d.reacoesProva[d.confrontos[0].requerCarta];
  },
  'confronto sem reação'
);
const detectaNoOrfao = armadilhaDialogo(
  'nó órfão',
  (c) => {
    const d = Object.values(c.dialogos)[0];
    d.nos.no_perdido = { fala: ['(nó sintético da armadilha)'], opcoes: [] };
  },
  'nó órfão'
);
const detectaRequerCartaFantasma = armadilhaDialogo(
  'requerCarta fantasma',
  (c) => {
    const d = Object.values(c.dialogos).find((x) => (x.confrontos || []).length > 0);
    const alvo = d.confrontos[0].requerCarta;
    d.reacoesProva.carta_fantasma = d.reacoesProva[alvo];
    delete d.reacoesProva[alvo];
    d.confrontos[0].requerCarta = 'carta_fantasma';
  },
  'requerCarta fantasma'
);
const armadilhasDialogoDetectadas =
  detectaTresTons && detectaConfrontoSemReacao && detectaNoOrfao && detectaRequerCartaFantasma && dialogosGeradosIntegros;
if (!armadilhasDialogoDetectadas) {
  console.log(
    '\nÁRVORE DE DIÁLOGO — armadilhas não detectadas:',
    JSON.stringify({ detectaTresTons, detectaConfrontoSemReacao, detectaNoOrfao, detectaRequerCartaFantasma })
  );
}

// (f) Replay chamada a chamada: a MESMA seed regenera a MESMA árvore.
const replayArvoreOk =
  JSON.stringify(montarPacoteGerado(SEED_REPLICA, { dirigido: DIRIGIDO_REPLICA }).dialogos) ===
  JSON.stringify(regenReplica.dialogos);
if (!replayArvoreOk) console.log('\nÁRVORE DE DIÁLOGO — replay chamada a chamada DIVERGIU.');

// ============================================================
// GUARDAS DA OS DA CAMADA PSÍQUICA (docs/os-camada-psiquica-do-elenco.md
// §5): a segunda coluna do elenco (vetores psíquicos, desencaixe,
// consequências) é ilha de build time — a guarda de ilha da FASE 1 já
// cobre src/gerador/vetores_psiquicos.js (runtime jamais o importa).
// Provas próprias:
// (1) catálogo v1 íntegro: 11 vetores com o vetor completo (§8.1),
//     afinidades TOTAIS (14 demográficos em degrau válido; 6 papéis),
//     degrau raro alcançável em todo arquétipo (a reamostragem do réu
//     sempre termina), matriz de encenação com proveniência por item;
// (2) lint léxico L1: nosologia/jargão pós-1893 banidos de QUALQUER
//     superfície do jogo (código vivo de data/logic/store/components);
//     exceção: "Psychopathia Sexualis" como título de obra;
// (3) lint léxico L2: sombra/persona/vetor/desencaixe/complexo banidos
//     de IDENTIFICADORES e CHAVES do runtime (livres como palavra comum
//     na prosa — a checagem olha declarações e posições de chave, por
//     segmento de identificador, para não acusar "personagem");
// (4) não-vazamento: nos pacotes embarcados, L1 em campo NENHUM; L2 e
//     "psique" em chave/id nenhum (o rótulo morre no log de build);
// (5) determinismo: mesma seed → mesma psique (vetores, polaridades,
//     magnitudes, flags), byte a byte;
// (6) anti-tell (§4.3): num lote de 50 seeds, 100% dos casos têm réu com
//     desencaixe ≥ T E ≥1 não-assassino com desencaixe ≥ T.
// ============================================================
const {
  VETORES_PSIQUICOS,
  DEMOGRAFICOS,
  MAGNITUDE_POR_DEGRAU,
  LIMIAR_DESENCAIXE,
  MATRIZ_ENCENACAO,
} = await import('../src/gerador/vetores_psiquicos.js');

// (1) Catálogo íntegro — v2 desde a F4 da OS priors compostos: 13
// vetores × 18 demográficos; afinidadePapeis REMOVIDA (decisão 12,
// registro em historico-decisoes.md).
const degrausValidos = new Set(Object.keys(MAGNITUDE_POR_DEGRAU));
const vetoresLista = Object.values(VETORES_PSIQUICOS);
const psiqueCatalogoIntegro =
  vetoresLista.length === 13 &&
  DEMOGRAFICOS.length === 18 &&
  vetoresLista.every(
    (v) =>
      ['id', 'valor', 'medo', 'sombraAtiva', 'sombraPassiva', 'autoJustificacao', 'temaGatilho'].every(
        (campo) => typeof v[campo] === 'string' && v[campo].length > 0
      ) &&
      DEMOGRAFICOS.every((d) => degrausValidos.has(v.afinidadeDemografica[d])) &&
      Object.keys(v.afinidadeDemografica).length === DEMOGRAFICOS.length &&
      v.afinidadePapeis === undefined &&
      typeof v.proveniencia === 'string' &&
      v.proveniencia.includes('sistemas-arquetipicos-alem-dos-12')
  ) &&
  DEMOGRAFICOS.every((d) => ARQUETIPOS[d] != null) &&
  DEMOGRAFICOS.every((d) =>
    vetoresLista.some((v) => MAGNITUDE_POR_DEGRAU[v.afinidadeDemografica[d]] >= LIMIAR_DESENCAIXE)
  ) &&
  Object.values(MATRIZ_ENCENACAO).every((m) =>
    m.pool.every((item) => typeof item.proveniencia === 'string' && item.proveniencia.includes('kb-medicina-legal'))
  );
if (!psiqueCatalogoIntegro) console.log('\nPSIQUE — catálogo v1 com falha de integridade.');

// (2) Lint L1 — banida em qualquer superfície do jogo (código vivo).
const L1_REGEX =
  /\bparafil\w*|\bpsicopat\w*|\bPCL\b|big\s*five|tri[aá]rquic\w*|McAdams|arqu[eé]tip\w*|\bPearson\b/iu;
const lintL1Violacoes = arquivosRuntime.filter((f) => {
  const codigoVivo = semComentarios(readFileSync(f, 'utf8')).replace(/Psychopathia Sexualis/g, '');
  return L1_REGEX.test(codigoVivo);
});
const lintL1Ok = lintL1Violacoes.length === 0;
if (!lintL1Ok) console.log('\nPSIQUE — L1 (nosologia pós-1893) em superfície do jogo:', lintL1Violacoes.join(', '));

// (3) Lint L2 — banida em identificadores e chaves do runtime. A checagem
// divide o identificador em segmentos (snake e camel) e acusa só o
// segmento EXATO — "personagem" passa, "vetorPsiquico"/"tema_sombra" não.
const L2_TOKENS = new Set(['sombra', 'sombras', 'persona', 'personas', 'vetor', 'vetores', 'desencaixe', 'desencaixes', 'complexo', 'complexos']);
const temSegmentoL2 = (identificador) =>
  identificador
    .split(/[^A-Za-z]+|(?=[A-Z])/)
    .filter(Boolean)
    .some((seg) => L2_TOKENS.has(seg.toLowerCase()));
const lintL2Violacoes = [];
for (const f of arquivosRuntime) {
  const codigoVivo = semComentarios(readFileSync(f, 'utf8'));
  const candidatos = [
    ...[...codigoVivo.matchAll(/\b(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g)].map((m) => m[1]),
    ...[...codigoVivo.matchAll(/(?:^|[,{(]\s*)['"]?([A-Za-z_$][\w$]*)['"]?\s*:/gm)].map((m) => m[1]),
  ];
  for (const nome of candidatos) {
    if (temSegmentoL2(nome)) lintL2Violacoes.push(`${path.relative(raizSrc, f)}: ${nome}`);
  }
}
const lintL2Ok = lintL2Violacoes.length === 0;
if (!lintL2Ok) console.log('\nPSIQUE — L2 em identificador/chave do runtime:', lintL2Violacoes.slice(0, 10).join('; '));

// (4) Não-vazamento nos pacotes embarcados (a réplica + o pool inteiro).
const pacotesEmbarcados = [CASO_REPLICA, ...CASOS_POOL];
const chavesEIdsDoPacote = (valor, colhidas = []) => {
  if (Array.isArray(valor)) {
    valor.forEach((v) => chavesEIdsDoPacote(v, colhidas));
  } else if (valor && typeof valor === 'object') {
    for (const [chave, filho] of Object.entries(valor)) {
      colhidas.push(chave);
      if (chave === 'id' && typeof filho === 'string') colhidas.push(filho);
      chavesEIdsDoPacote(filho, colhidas);
    }
  }
  return colhidas;
};
const psiqueNaoVaza = pacotesEmbarcados.every((p) => {
  const texto = JSON.stringify(p).replace(/Psychopathia Sexualis/g, '');
  if (L1_REGEX.test(texto)) return false;
  return chavesEIdsDoPacote(p).every((nome) => !temSegmentoL2(nome) && !/(^|[_\W])psique([_\W]|$)/i.test(nome));
});
if (!psiqueNaoVaza) console.log('\nPSIQUE — vazamento de rótulo/L1/L2 em pacote embarcado.');

// (5) Determinismo da psique.
const psiqueDeterminista = ['comarca_1', 'comarca_7'].every(
  (seed) => JSON.stringify(gerarCasoBruto(seed).psique) === JSON.stringify(gerarCasoBruto(seed).psique)
);
if (!psiqueDeterminista) console.log('\nPSIQUE — replay divergiu (mesma seed, psique diferente).');

// (6) Anti-tell em 50 seeds: o desencaixe nunca é prova. REGIME-CIENTE
// desde a F3 da OS priors compostos (§4.6-G6): a exigência integral
// (réu ≥ T + ≥1 inocente destoante registrado) vale SÓ no regime 2; no
// regime 1 a exigência é a inversa — réu no degrau modal e NENHUMA isca
// forçada.
const SEEDS_ANTI_TELL = Array.from({ length: 50 }, (_, i) => `comarca_${i + 1}`);
const antiTellFalhas = [];
for (const seed of SEEDS_ANTI_TELL) {
  const bruto = gerarCasoBruto(seed);
  const { log } = bruto.psique;
  const reu = log.porPessoa[bruto.escolha.assassinoId];
  const inocentesDestoantes = Object.entries(log.porPessoa).filter(
    ([id, p]) =>
      id !== bruto.escolha.assassinoId && id !== bruto.escolha.vitimaId && p.magnitude >= LIMIAR_DESENCAIXE
  );
  if (log.regime === 2) {
    const destoanteRegistrado = log.falsoDestoanteId && inocentesDestoantes.some(([id]) => id === log.falsoDestoanteId);
    if (reu.magnitude < LIMIAR_DESENCAIXE || inocentesDestoantes.length < 1 || !destoanteRegistrado) {
      antiTellFalhas.push(seed);
    }
  } else {
    const forcouIsca = log.reamostragens.some((r) => r.motivo === 'falso_destoante');
    if (reu.magnitude !== 1 || log.falsoDestoanteId !== null || forcouIsca) antiTellFalhas.push(seed);
  }
}
const antiTellOk = antiTellFalhas.length === 0;
if (!antiTellOk) console.log('\nPSIQUE — anti-tell falhou nas seeds:', antiTellFalhas.join(', '));

// ============================================================
// OS CONFRONTO ESTENDIDO (§5) — guardas da fuga, do grito e das trilhas.
// (A) determinismo byte a byte com fuga/grito/trilhas; (B) anti-bicondicional
// (§4.7): no lote fixo coexistem premeditado COM fuga e briga escalada SEM
// fuga (a fuga não é sinônimo de briga); (C) coerência (trilha contígua) +
// existência (ação/rota/grito só entram se um vestígio sobrevivente as
// evidencia; grito tem hora e ouvinte); (D) léxico ("overdose" banida das
// superfícies do jogo). Lote versionado: confronto_1..80.
// ============================================================
const { CLASSES_VESTIGIO: CLASSES_VESTIGIO_CONF } = await import('../src/gerador/vestigios.js');
const FUGA_CLASSES = [
  'trilha_gotejamento', 'assoalho_esfregado_faixa', 'esfregaco_de_limiar', 'batente_lavado', 'lesao_sitio_posterior',
];
const SEEDS_CONFRONTO = Array.from({ length: 80 }, (_, i) => `confronto_${i + 1}`);
const casosConfronto = SEEDS_CONFRONTO.map((s) => gerarCasoBruto(s));
const fugiuNoCaso = (c) => c.crime.variaveis?.acao_vitima === 'fugir';

// (A) determinismo: mesma seed → mesmo registro (inclui fuga/grito/trilhas).
const confrontoDeterminista = SEEDS_CONFRONTO.every(
  (s, i) => JSON.stringify(gerarCasoBruto(s).crime) === JSON.stringify(casosConfronto[i].crime)
);

// (B) anti-bicondicional (§4.7). Premeditado-com-fuga é raríssimo
// (~1/200 no lote — estreiteza PRÉ-EXISTENTE ao anel, registrada no PR
// da E3 §4.5 para triagem futura); com o braço da pousada a testemunha
// do lote de 80 flipou de seed, então a prova estende a varredura até
// achar as duas testemunhas, com saída antecipada (custo ~0 quando o
// lote curto já as tem).
let premeditadoComFuga = casosConfronto.some((c) => c.escolha.cenario === 'premeditado' && fugiuNoCaso(c));
let brigaSemFuga = casosConfronto.some((c) => c.escolha.cenario === 'briga_escalada' && !fugiuNoCaso(c));
for (let iB = 81; iB <= 260 && !(premeditadoComFuga && brigaSemFuga); iB += 1) {
  const cB = gerarCasoBruto(`confronto_${iB}`);
  const fugiuB = fugiuNoCaso(cB);
  if (cB.escolha.cenario === 'premeditado' && fugiuB) premeditadoComFuga = true;
  if (cB.escolha.cenario === 'briga_escalada' && !fugiuB) brigaSemFuga = true;
}
const antiBicondicional = premeditadoComFuga && brigaSemFuga;
if (!antiBicondicional)
  console.log('\nCONFRONTO — anti-bicondicional: premeditadoComFuga=', premeditadoComFuga, 'brigaSemFuga=', brigaSemFuga);

// (C) coerência + existência.
const varEvidenciada = (reg, varId) => {
  const vivos = reg.vestigios.filter((v) => !v.removido);
  return vivos.some((v) => (CLASSES_VESTIGIO_CONF[v.classe]?.evidenciaDe || []).includes(varId));
};
const trilhaContigua = (celulas) =>
  Array.isArray(celulas) &&
  celulas.every(
    (c, k) => k === 0 || Math.abs(c.col - celulas[k - 1].col) + Math.abs(c.fila - celulas[k - 1].fila) === 1
  );
const fugaFalhas = [];
for (const c of casosConfronto) {
  const reg = c.crime;
  for (const v of reg.vestigios) {
    if ((v.classe === 'trilha_gotejamento' || v.classe === 'assoalho_esfregado_faixa') && !trilhaContigua(v.celulas)) {
      fugaFalhas.push(`${c.seed}: trilha não contígua`);
    }
  }
  for (const varId of ['acao_vitima', 'rota_fuga', 'lesoes_sitio_posterior', 'grito']) {
    if (reg.variaveis[varId] !== undefined && !varEvidenciada(reg, varId)) {
      fugaFalhas.push(`${c.seed}: variável ${varId} sem vestígio sobrevivente`);
    }
  }
  if (fugiuNoCaso(c)) {
    const temVestigioFuga = reg.vestigios.some((v) => !v.removido && FUGA_CLASSES.includes(v.classe));
    if (!temVestigioFuga) fugaFalhas.push(`${c.seed}: fuga sem vestígio sobrevivente`);
  }
  if (reg.variaveis.grito) {
    const g = reg.vestigios.find((v) => v.classe === 'grito_ouvido');
    if (!g || g.horaGrito === undefined || !(g.ouvintes && g.ouvintes.length > 0)) {
      fugaFalhas.push(`${c.seed}: grito sem hora/ouvinte`);
    }
  }
}
const fugaCoerenteEExistente = fugaFalhas.length === 0;
if (!fugaCoerenteEExistente) console.log('\nCONFRONTO — coerência/existência da fuga:', fugaFalhas.slice(0, 6).join('; '));

// (D) léxico: "overdose" banida das superfícies do jogo (dados + prosa
// embarcada + templates); a língua diz "dose excessiva".
const lerSeguro = (rel) => {
  try {
    return readFileSync(fileURLToPath(new URL(`../${rel}`, import.meta.url)), 'utf8');
  } catch {
    return '';
  }
};
const superficiesLexico = [
  'src/data/casos_gerados.js', 'src/data/catalogo_causas.js', 'src/data/glossario.js', 'src/gerador/pacote_gerado.js',
];
const overdoseHits = superficiesLexico.filter((rel) => /overdose/i.test(lerSeguro(rel)));
const lexicoConfronto = overdoseHits.length === 0;
if (!lexicoConfronto) console.log('\nCONFRONTO — "overdose" em superfície do jogo:', overdoseHits.join(', '));

// (E) réplica (§4.8): fugaVitima 'suprimida' ⇒ o registro não ganha fuga
// nem grito — a base da identidade de fatos com o roteiro canônico.
const { SEED_REPLICA: SEED_REPLICA_CONF, DIRIGIDO_REPLICA: DIRIGIDO_REPLICA_CONF } = await import(
  '../src/gerador/pacote_gerado.js'
);
const regReplicaConf = gerarCasoBruto(SEED_REPLICA_CONF, { dirigido: DIRIGIDO_REPLICA_CONF }).crime;
const replicaFugaSuprimida =
  regReplicaConf.variaveis?.acao_vitima !== 'fugir' &&
  regReplicaConf.variaveis?.grito === undefined &&
  !regReplicaConf.vestigios.some((v) => FUGA_CLASSES.includes(v.classe));
if (!replicaFugaSuprimida) console.log('\nCONFRONTO — réplica não suprimiu a fuga (§4.8).');

// Devolve o módulo de dados ao caso-escola: as checagens e o linter
// abaixo leem o pacote do tutorial, como sempre.
carregarCaso(pacote);
useJogo.setState(estadoInicial, true);

// ============================================================
// LINTER DE PROSA (regressão da norma de texto): scripts/lint-prosa.mjs
// roda como parte do QA — cheques mecânicos do guia de estilo e da skill
// anti-padrao-ia (fórmula "não X — é Y", densidade de travessão, léxico
// banido, exclamações, filtro sensorial, monotonia de abertura e vocativo
// repetido) sobre os módulos de dados e os templates. O autoteste do
// linter (armadilhas sintéticas dos cheques 5–7) roda embutido em toda
// execução. O relatório do linter sai inteiro aqui (stdio herdado).
// ============================================================
console.log('\n=== Linter de prosa (scripts/lint-prosa.mjs) ===');
const lintProsa = spawnSync(process.execPath, [fileURLToPath(new URL('./lint-prosa.mjs', import.meta.url))], {
  stdio: 'inherit',
});
const prosaSemRegressao = lintProsa.status === 0;

const apressadoCaiEmArmadilha = vApressado.falhas.length >= 1 && vApressado.tipo !== 'vitoria_absoluta';

// ============================================================
// OS PRIORS COMPOSTOS (F2) — guardas G1–G4 do prior composto
// (docs/os-priors-compostos-e-variedade-do-elenco.md §3.4) + guarda de
// decorrelação do hash do gerador (achado B✱ da triagem F0).
// (G1) pré-tilt: para todo arquétipo, INT/WIS/CHA sem peso 0 nas bandas
//      1–2 e 4–5 E com os extremos 1 e 5 alcançáveis (leitura estrita de
//      N1 — o caso-teste: a lavadeira pode ser gênio). FOR isento.
// (G2) pós-tilt: para todo par arquétipo × vetor, a distribuição
//      composta respeita N1 (decorre de N3; verificado mesmo assim),
//      N2 (tilt jamais declara FOR) e N3 (multiplicadores ≥ 1).
// (G3) cascata: o forçamento de vetor re-deriva INT/WIS/CHA e a
//      quantização pela função PURA derivarAtributosCompostos com o
//      sufixo `|forcado|t<k>`; FOR permanece o do arquétipo (N2); o
//      elenco do caso bruto carrega o resultado patchado (sem resíduo).
// (G4) simetria réu × isca: em lote de 200 seeds, |P(INT≥4 | réu) −
//      P(INT≥4 | destoante inocente)| ≤ 10 p.p. (banda aprovada em F1,
//      DECISÃO 4) — atributo não vira tell fraco do réu.
// (B✱) decorrelação: nos lavradores de 300 elencos, os pares (INT, WIS)
//      cobrem ≥ 20 das 25 células e a correlação fica ≤ 0,15 em módulo
//      (o acoplamento de chaves-irmãs do hashString linear não volta).
// ============================================================
const { CURVAS_DE_ACESSO } = await import('../src/gerador/arquetipos.js');
const { derivarAtributosCompostos, gerarElenco: gerarElencoF2 } = await import('../src/gerador/amostragem.js');
const { quantizarComportamentos: quantizarF2 } = await import('../src/gerador/quantizacao.js');

// (G1) pré-tilt.
const g1Falhas = [];
for (const a of Object.values(ARQUETIPOS)) {
  for (const attr of ['INT', 'WIS', 'CHA']) {
    const p = a.priors[attr];
    const ok =
      Array.isArray(p) && p.length === 5 && p.every((x) => Number.isInteger(x) && x >= 0) &&
      p[0] + p[1] > 0 && p[3] + p[4] > 0 && p[0] > 0 && p[4] > 0;
    if (!ok) g1Falhas.push(`${a.id}.${attr}=[${p}]`);
  }
}
const g1PreTiltOk =
  g1Falhas.length === 0 &&
  Object.values(CURVAS_DE_ACESSO).every((c) => c.length === 5 && c.every((x) => x >= 1));
if (!g1PreTiltOk) console.log('\nPRIORS F2 — G1 (N1 pré-tilt) falhou:', g1Falhas.join('; '));

// (G2) pós-tilt (+ N2/N3 sobre o próprio tilt).
const g2Falhas = [];
for (const v of Object.values(VETORES_PSIQUICOS)) {
  const tilt = v.tiltAtributos || {};
  if ('FOR' in tilt) g2Falhas.push(`${v.id}: tilt declara FOR (N2)`);
  for (const attr of ['INT', 'WIS', 'CHA']) {
    const m = tilt[attr];
    if (!Array.isArray(m) || m.length !== 5 || !m.every((x) => Number.isInteger(x) && x >= 1)) {
      g2Falhas.push(`${v.id}.${attr}: tilt inválido (N3)`);
      continue;
    }
    for (const a of Object.values(ARQUETIPOS)) {
      const composto = a.priors[attr].map((p, i) => p * m[i]);
      if (!(composto[0] + composto[1] > 0 && composto[3] + composto[4] > 0 && composto[0] > 0 && composto[4] > 0)) {
        g2Falhas.push(`${a.id}×${v.id}.${attr}`);
      }
    }
  }
}
const g2PosTiltOk = g2Falhas.length === 0;
if (!g2PosTiltOk) console.log('\nPRIORS F2 — G2 (N1 pós-tilt) falhou:', g2Falhas.slice(0, 8).join('; '));

// (G3) cascata: nas seeds do lote psíquico com reamostragem, o elenco do
// caso carrega EXATAMENTE a re-derivação pura (e FOR intacto do elenco base).
let g3CascataOk = true;
{
  const seedsComForcamento = [];
  for (const seed of SEEDS_ANTI_TELL.slice(0, 12)) {
    const bruto = gerarCasoBruto(seed);
    if (bruto.psique.log.reamostragens.length > 0) seedsComForcamento.push({ seed, bruto });
  }
  if (seedsComForcamento.length === 0) g3CascataOk = false; // o lote sempre força o réu em parte das seeds
  for (const { seed, bruto } of seedsComForcamento) {
    const base = gerarElencoF2(seed, bruto.mundo.elenco.length);
    for (const r of bruto.psique.log.reamostragens) {
      const pessoa = bruto.mundo.elenco.find((p) => p.id === r.pessoaId);
      const dele = bruto.psique.log.porPessoa[r.pessoaId];
      const esperado = derivarAtributosCompostos(
        seed, dele.indice, pessoa.arquetipo, dele.vetorId, `|forcado|t${r.tentativas}`
      );
      const forBase = base[dele.indice].atributos.FOR;
      if (
        pessoa.atributos.INT !== esperado.INT ||
        pessoa.atributos.WIS !== esperado.WIS ||
        pessoa.atributos.CHA !== esperado.CHA ||
        pessoa.atributos.FOR !== forBase ||
        JSON.stringify(pessoa.comportamentos) !==
          JSON.stringify(quantizarF2(pessoa.atributos, pessoa.traits))
      ) {
        g3CascataOk = false;
      }
    }
  }
}
if (!g3CascataOk) console.log('\nPRIORS F2 — G3 (cascata de forçamento) falhou.');

// Lote fixo compartilhado de F2/F3 (200 casos brutos, comarca_1..200).
const loteF2 = [];
for (let i = 1; i <= 200; i++) loteF2.push(gerarCasoBruto(`comarca_${i}`));

// (G4) simetria réu × isca no lote. Desde a F3, réus de regime 1 vivem
// no degrau modal por desenho — a comparação justa (forçado × forçado)
// é réu de REGIME 2 × isca.
let g4SimetriaOk = true;
{
  let reusIntAlto = 0, reusTotal = 0, iscasIntAlto = 0, iscasTotal = 0;
  for (const bruto of loteF2) {
    const reu = bruto.mundo.elenco.find((p) => p.id === bruto.escolha.assassinoId);
    if (bruto.psique.log.regime === 2) {
      reusTotal++;
      if (reu.atributos.INT >= 4) reusIntAlto++;
    }
    const iscaId = bruto.psique.log.falsoDestoanteId;
    const isca = iscaId && bruto.mundo.elenco.find((p) => p.id === iscaId);
    if (isca) {
      iscasTotal++;
      if (isca.atributos.INT >= 4) iscasIntAlto++;
    }
  }
  const delta = Math.abs(reusIntAlto / reusTotal - iscasIntAlto / iscasTotal);
  g4SimetriaOk = iscasTotal > 0 && reusTotal > 0 && delta <= 0.10;
  if (!g4SimetriaOk) {
    console.log(
      `\nPRIORS F2 — G4 (simetria réu × isca) falhou: réu ${(100 * reusIntAlto / Math.max(1, reusTotal)).toFixed(1)}% × isca ${(100 * iscasIntAlto / Math.max(1, iscasTotal)).toFixed(1)}% de INT≥4.`
    );
  }
}

// ============================================================
// OS PRIORS COMPOSTOS (F3) — regimes e anti-tell estendido (§4.6).
// (G5) precisão do tell calmo: entre TODOS os portadores de mentira
//      calma do lote (mente_com_calma do réu + mente_com_calma_
//      periferica:* de inocentes), a fração de inocentes ≥ 60%
//      (decisão 11) — "mentira serena ⇒ réu" deixou de ser lei.
// (G6) regimes: fração de regime 1 dentro da banda 30% ± 10 p.p. no
//      lote de 200; em TODO caso regime 1: réu no degrau modal
//      (magnitude 1), nenhuma isca forçada (falsoDestoanteId nulo, sem
//      reamostragem falso_destoante) e móbil material promovido presente
//      na fatia (gen_motivo do réu). A guarda anti-tell integral vale só
//      no regime 2 (regra aplicada na guarda (6) da OS psíquica, acima).
// ============================================================
let g5TellCalmoOk = true;
let g6RegimesOk = true;
{
  let calmosReus = 0, calmosInocentes = 0, casosRegime1 = 0;
  const g6Falhas = [];
  for (const bruto of loteF2) {
    const { log: logPsi } = bruto.psique;
    for (const [pid, c] of Object.entries(bruto.psique.consequencias.porPessoa)) {
      if (pid === bruto.escolha.assassinoId) {
        if (c.flags.includes('mente_com_calma')) calmosReus++;
      } else if (c.flags.some((f) => f.startsWith('mente_com_calma_periferica:'))) {
        calmosInocentes++;
      }
    }
    if (logPsi.regime === 1) {
      casosRegime1++;
      const reu = logPsi.porPessoa[bruto.escolha.assassinoId];
      const forcouIsca = logPsi.reamostragens.some((r) => r.motivo === 'falso_destoante');
      const mobilMaterial = bruto.fatiaForense.cartas.some(
        (c) => c.tagsOcultas?.motivo && c.tagsOcultas?.ligadoA === bruto.escolha.assassinoId
      );
      if (reu.magnitude !== 1 || logPsi.falsoDestoanteId !== null || forcouIsca || !mobilMaterial) {
        g6Falhas.push(bruto.seed);
      }
    } else if (logPsi.regime !== 2) {
      g6Falhas.push(`${bruto.seed} (regime inválido)`);
    }
  }
  const fracaoInocente = calmosInocentes / Math.max(1, calmosInocentes + calmosReus);
  g5TellCalmoOk = calmosInocentes + calmosReus > 0 && fracaoInocente >= 0.6;
  if (!g5TellCalmoOk) {
    console.log(
      `\nPRIORS F3 — G5 (tell calmo) falhou: ${calmosInocentes} inocentes × ${calmosReus} réus calmos (${(100 * fracaoInocente).toFixed(1)}% inocentes).`
    );
  }
  const fracaoRegime1 = casosRegime1 / loteF2.length;
  g6RegimesOk = g6Falhas.length === 0 && fracaoRegime1 >= 0.2 && fracaoRegime1 <= 0.4;
  if (!g6RegimesOk) {
    console.log(
      `\nPRIORS F3 — G6 (regimes) falhou: regime 1 em ${(100 * fracaoRegime1).toFixed(1)}% do lote; violações: ${g6Falhas.slice(0, 6).join(', ')}`
    );
  }
}

// ============================================================
// TELEMETRIA + GUARDA DE PARIDADE — flags psíquicas no diálogo (OS
// `docs/os-flags-psiquicas-no-dialogo.md`, S1 Ramo A). Mede quanto de cada
// flag o gerador compila e quais já ganharam boca (Fase 1: gatilho_de_complexo;
// Fase 2: acusa_com_fervor + omite_por_decoro; Fase 3: têmpera calma/tensão que
// modula o tento de trait no b1 + defende_demais_o_morto no b2 cordial). A
// telemetria é leitura pura; a GUARDA (fase3ParidadeOk) exige presença cruzada
// de cada têmpera nos dois papéis — nenhuma pode ser assinatura de papel. As
// flags vivem em `bruto.psique.consequencias.porPessoa[id].flags` (build time;
// fora do pacote), disponíveis ao derivador via o `bruto` que ele já recebe.
// ============================================================
let fase3ParidadeOk = true;
{
  const conta = {
    reuCalma: 0, reuTensao: 0, inocenteCalmaPeriferica: 0,
    acusaComFervor: 0, omitePorDecoro: 0, defendeDemaisOMorto: 0,
    defendeReu: 0, defendeInocente: 0,
    iscaMenteSobPressao: 0, gatilhoReu: 0, gatilhoInocente: 0,
    pessoas: 0, flagsTotais: 0, casosComGatilhoInocente: 0,
  };
  for (const bruto of loteF2) {
    const reuId = bruto.escolha.assassinoId;
    let gatilhoInocenteNesteCaso = 0;
    for (const [pid, c] of Object.entries(bruto.psique.consequencias.porPessoa)) {
      conta.pessoas++;
      conta.flagsTotais += c.flags.length;
      const ehReu = pid === reuId;
      for (const f of c.flags) {
        if (f === 'mente_com_calma') conta.reuCalma++;
        else if (f === 'mente_sob_pressao') ehReu ? conta.reuTensao++ : conta.iscaMenteSobPressao++;
        else if (f.startsWith('mente_com_calma_periferica:')) conta.inocenteCalmaPeriferica++;
        else if (f === 'acusa_com_fervor') conta.acusaComFervor++;
        else if (f === 'omite_por_decoro') conta.omitePorDecoro++;
        else if (f === 'defende_demais_o_morto') {
          conta.defendeDemaisOMorto++;
          ehReu ? conta.defendeReu++ : conta.defendeInocente++;
        } else if (f.startsWith('gatilho_de_complexo:')) {
          if (ehReu) conta.gatilhoReu++;
          else { conta.gatilhoInocente++; gatilhoInocenteNesteCaso++; }
        }
      }
    }
    if (gatilhoInocenteNesteCaso > 0) conta.casosComGatilhoInocente++;
  }
  const nCasos = loteF2.length;
  const calmaTotal = conta.reuCalma + conta.inocenteCalmaPeriferica;
  const fracInocenteCalma = calmaTotal > 0 ? (100 * conta.inocenteCalmaPeriferica / calmaTotal) : 0;
  // Fase 3 — o anti-tell das têmperas. Para o PAR calma/tensão, a garantia é a
  // presença cruzada (paridade §3): calma no réu E no inocente; tensão no réu E
  // na isca — nenhuma é assinatura de papel. Para defende_demais_o_morto, a
  // telemetria mostra que o RÉU nunca o porta (vetor de vínculo não recai no
  // assassino): é inocente-only, um REVERSE-TELL como o acusa_com_fervor ("quem
  // super-defende é inocente"), mitigado porque NÃO-super-defender é o partilhado
  // (réu + maioria dos inocentes). Logo a guarda exige o par cruzado e o defende
  // realizado (não cruzado). A paridade PERCEPTUAL do par (indistinguir calma de
  // réu e de inocente na leitura) é o que o playtest de tell dirigido fecha.
  fase3ParidadeOk =
    conta.reuCalma > 0 && conta.inocenteCalmaPeriferica > 0 &&
    conta.reuTensao > 0 && conta.iscaMenteSobPressao > 0 &&
    conta.defendeReu === 0 && conta.defendeInocente > 0;
  console.log(`\nTELEMETRIA — flags psíquicas no diálogo (lote de ${nCasos} casos; bocas: Fase 1+2+3 lidas):`);
  console.log(`  réu mente_com_calma: ${conta.reuCalma}  ×  réu mente_sob_pressao: ${conta.reuTensao}`);
  console.log(`  inocente mente_com_calma_periferica: ${conta.inocenteCalmaPeriferica}  (paridade do tell calmo: ${fracInocenteCalma.toFixed(1)}% dos calmos são inocentes)`);
  console.log(`  acusa_com_fervor: ${conta.acusaComFervor}  |  omite_por_decoro: ${conta.omitePorDecoro}  |  isca mente_sob_pressao: ${conta.iscaMenteSobPressao}`);
  console.log(`  defende_demais_o_morto — réu: ${conta.defendeReu}  |  inocente: ${conta.defendeInocente}  (inocente-only ⇒ reverse-tell, como o fervor)`);
  console.log(`  gatilho_de_complexo — réu: ${conta.gatilhoReu}  |  inocente: ${conta.gatilhoInocente}  (${conta.casosComGatilhoInocente}/${nCasos} casos têm ≥1 gatilho inocente)`);
  console.log(`  total: ${conta.flagsTotais} flags compiladas em ${conta.pessoas} pessoas — lidas por dialogos_gerados.js: gatilho (Fase 1), fervor+decoro (Fase 2), têmpera calma/tensão + defende_demais (Fase 3).`);
}

// (G7) integridade de pools (F4 §5.3): todo prior é array de 5 com soma
// > 0; traits ≥ 3 e todos no catálogo (com comportamento mapeado);
// motivos 4–6 e todos no catálogo; chanceSegundoTrait inteira 1–5;
// nomes ponderados válidos (peso inteiro ≥ 1) e sobrenomes únicos;
// motivo novo com proveniência (lint de fonte).
let g7PoolsOk = true;
{
  const { MOTIVOS_POTENCIAIS, NOMES: NOMES_F4, SOBRENOMES: SOBRENOMES_F4 } = await import(
    '../src/gerador/arquetipos.js'
  );
  const { TRAITS: TRAITS_F4, MAPA_TRAIT_COMPORTAMENTO: MAPA_F4, CATALOGO_COMPORTAMENTOS: CAT_F4 } =
    await import('../src/gerador/comportamentos.js');
  const g7Falhas = [];
  for (const a of Object.values(ARQUETIPOS)) {
    for (const attr of ['FOR', 'INT', 'WIS', 'CHA']) {
      const p = a.priors[attr];
      if (!Array.isArray(p) || p.length !== 5 || p.reduce((s, x) => s + x, 0) <= 0) {
        g7Falhas.push(`${a.id}.${attr}: prior inválido`);
      }
    }
    if (!Array.isArray(a.traits) || a.traits.length < 3) g7Falhas.push(`${a.id}: pool de traits < 3`);
    for (const t of a.traits) {
      if (!TRAITS_F4[t] || !MAPA_F4[t] || !CAT_F4[MAPA_F4[t]]) g7Falhas.push(`${a.id}: trait órfão (${t})`);
    }
    if (a.motivosPotenciais.length < 4 || a.motivosPotenciais.length > 6) {
      g7Falhas.push(`${a.id}: motivos fora de 4–6 (${a.motivosPotenciais.length})`);
    }
    for (const m of a.motivosPotenciais) {
      if (!MOTIVOS_POTENCIAIS[m]) g7Falhas.push(`${a.id}: motivo fora do catálogo (${m})`);
    }
    if (!Number.isInteger(a.chanceSegundoTrait) || a.chanceSegundoTrait < 1 || a.chanceSegundoTrait > 5) {
      g7Falhas.push(`${a.id}: chanceSegundoTrait inválida`);
    }
  }
  const motivosNovos = ['hipoteca_ou_arrendo', 'propriedade_da_esposa', 'divida_de_jogo', 'caridade_negada'];
  for (const m of motivosNovos) {
    if (!MOTIVOS_POTENCIAIS[m]?.proveniencia) g7Falhas.push(`motivo novo sem proveniência: ${m}`);
  }
  for (const genero of ['masculino', 'feminino']) {
    for (const coorte of ['coorte_1820_50', 'coorte_1860_75']) {
      const lista = NOMES_F4[genero][coorte];
      if (lista.length < 40) g7Falhas.push(`nomes ${genero}/${coorte}: pool < 40`);
      if (!lista.every((n) => typeof n.nome === 'string' && Number.isInteger(n.peso) && n.peso >= 1)) {
        g7Falhas.push(`nomes ${genero}/${coorte}: entrada inválida`);
      }
      if (new Set(lista.map((n) => n.nome)).size !== lista.length) {
        g7Falhas.push(`nomes ${genero}/${coorte}: nome duplicado`);
      }
    }
  }
  if (new Set(SOBRENOMES_F4).size !== SOBRENOMES_F4.length || SOBRENOMES_F4.length < 50) {
    g7Falhas.push('sobrenomes: duplicata ou pool < 50');
  }
  g7PoolsOk = g7Falhas.length === 0;
  if (!g7PoolsOk) console.log('\nPRIORS F4 — G7 (integridade de pools) falhou:', g7Falhas.slice(0, 10).join('; '));
}

// (B✱) decorrelação INT × WIS no arquétipo mais numeroso.
let decorrelacaoOk = true;
{
  const pares = new Set();
  const xs = [], ys = [];
  for (let i = 1; i <= 300; i++) {
    for (const p of gerarElencoF2(`decorrelacao_${i}`, 8)) {
      if (p.arquetipo !== 'lavrador') continue;
      pares.add(`${p.atributos.INT}-${p.atributos.WIS}`);
      xs.push(p.atributos.INT);
      ys.push(p.atributos.WIS);
    }
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let cov = 0, vx = 0, vy = 0;
  for (let i = 0; i < n; i++) {
    cov += (xs[i] - mx) * (ys[i] - my);
    vx += (xs[i] - mx) ** 2;
    vy += (ys[i] - my) ** 2;
  }
  const corr = cov / Math.sqrt(vx * vy);
  decorrelacaoOk = pares.size >= 20 && Math.abs(corr) <= 0.15;
  if (!decorrelacaoOk) {
    console.log(`\nPRIORS F2 — decorrelação falhou: ${pares.size}/25 pares, corr=${corr.toFixed(3)} (n=${n}).`);
  }
}

// ============================================================
// OS PALCO EM ANÉIS (E1) — pontos da cena no caso gerado (caixa D1,
// docs/os-palco-em-aneis-e0-triagem.md). Três guardas:
// (GE1) integridade: a cena gerada tem UM ponto por cômodo do grid
//       (id/comodo em bijeção com interior.comodos); toda carta de cena
//       vive em exatamente um caminho (um ponto, ou um bloco contingente
//       quando a interferência pode destruí-la/criá-la); carta ancorada
//       (metadado `comodo` da ponte) aparece no ponto do próprio cômodo.
// (GE2) anti-telégrafo: em lote de 50 seeds, a fração de pontos SEM
//       carta (ambiência pura) fica na banda 40–60% (decisão do autor,
//       18/07) — o acordeão não pode virar mapa de pistas.
// (GE3) cegueira do motor: nenhuma função de src/logic lê
//       pontos/comodo/celula/mobilia — dado de palco é apresentação.
// ============================================================
const SEEDS_E1 = Array.from({ length: 50 }, (_, i) => `comarca_${i + 1}`);
const ge1Falhas = [];
const engodoInalcancavel = []; // GE6 (E2): alcançabilidade do engodo no pacote
const e3Falhas = []; // GE7/GE8 + satélite órfão (E3), colhidas no mesmo lote de pacotes
let ge2Total = 0;
let ge2SemCarta = 0;
const marcadoresDoPonto = (pt) => [
  ...new Set(pt.prosa.flatMap((t) => [...t.matchAll(/\[\[(\w+)\]\]/g)].map((m) => m[1]))),
];
for (const seedE1 of SEEDS_E1) {
  const brutoE1 = gerarCasoBruto(seedE1);
  const pacoteE1 = montarPacoteGerado(seedE1);
  const interiorE1 = brutoE1.mundo.interiores[brutoE1.escolha.localId];
  const cenaE1 = pacoteE1.localidades.find((l) => l.id === 'cena');
  if (!cenaE1 || !Array.isArray(cenaE1.pontos) || cenaE1.pontos.length === 0) {
    ge1Falhas.push(`${seedE1}: cena sem pontos`);
    continue;
  }
  const idsComodos = interiorE1.comodos.map((k) => k.id);
  if (
    cenaE1.pontos.length !== idsComodos.length ||
    !cenaE1.pontos.every((pt, i) => pt.comodo === idsComodos[i] && pt.id === `pt_cena_${idsComodos[i]}`)
  ) {
    ge1Falhas.push(`${seedE1}: pontos fora de bijeção com os cômodos do grid`);
  }
  const contagem = new Map();
  for (const pt of cenaE1.pontos)
    for (const id of marcadoresDoPonto(pt)) contagem.set(id, (contagem.get(id) || 0) + 1);
  const emBloco = new Set(
    (cenaE1.blocosContingentes || []).flatMap((b) =>
      b.paragrafos.flatMap((t) => [...t.matchAll(/\[\[(\w+)\]\]/g)].map((m) => m[1]))
    )
  );
  for (const c of pacoteE1.cartas.filter((x) => x.localidade === 'cena')) {
    const nPontos = contagem.get(c.id) || 0;
    if (nPontos > 1) ge1Falhas.push(`${seedE1}: ${c.id} em ${nPontos} pontos`);
    if (nPontos === 1 && emBloco.has(c.id)) ge1Falhas.push(`${seedE1}: ${c.id} em ponto E bloco`);
    if (nPontos === 0 && !emBloco.has(c.id)) ge1Falhas.push(`${seedE1}: ${c.id} inalcançável na cena`);
    if (nPontos === 1 && c.comodo != null && idsComodos.includes(c.comodo)) {
      const pt = cenaE1.pontos.find((p) => marcadoresDoPonto(p).includes(c.id));
      if (pt.comodo !== c.comodo)
        ge1Falhas.push(`${seedE1}: ${c.id} no ponto de ${pt.comodo}, ancorada em ${c.comodo}`);
    }
  }
  ge2Total += cenaE1.pontos.length;
  ge2SemCarta += cenaE1.pontos.filter((pt) => marcadoresDoPonto(pt).length === 0).length;
  // GE6 (E2): no pacote de caso com chamariz, o vestígio do engodo é
  // alcançável pelo jogador — [[gen_engodo]] vive em alguma prosa.
  if (brutoE1.escolha.palco?.via === 'chamariz') {
    const textosE1 = pacoteE1.localidades.flatMap((l) => [
      ...(l.prosa || []),
      ...(l.introducao || []),
      ...(l.pontos || []).flatMap((pt) => pt.prosa),
      ...(l.blocosContingentes || []).flatMap((b) => b.paragrafos),
    ]);
    if (!textosE1.some((t) => t.includes('[[gen_engodo]]'))) engodoInalcancavel.push(seedE1);
  }
  // E3 — GE7 (só registro durável a distância; nunca essencial), GE8 (sem
  // interrogável fora da vila) e lint de satélite órfão de função.
  const locsComarca = pacoteE1.localidades.filter((l) => l.id.startsWith('comarca_'));
  const cartasComarca = pacoteE1.cartas.filter((c) => (c.localidade || '').startsWith('comarca_'));
  for (const l of locsComarca) {
    if (!cartasComarca.some((c) => c.localidade === l.id))
      e3Falhas.push(`${seedE1}: satélite ${l.id} referenciado sem função`);
    const no = pacoteE1.nosMapa.find((n) => n.id === l.id);
    if (!no || no.desbloqueadoInicio) e3Falhas.push(`${seedE1}: nó de comarca visível de início`);
    if (!pacoteE1.leads.some((ld) => ld.revelaNo === l.id)) e3Falhas.push(`${seedE1}: nó de comarca sem lead`);
    if (!(pacoteE1.custos[`${l.id}|vila`] > 0)) e3Falhas.push(`${seedE1}: custo de comarca ausente`);
  }
  for (const c of cartasComarca) {
    if (c.suporteFisico !== 'registro') e3Falhas.push(`${seedE1}: ${c.id} a distância sem ser registro (GE7)`);
    if (['temporal', 'causal', 'vestigio'].includes((c.tagsOcultas || {}).dominio))
      e3Falhas.push(`${seedE1}: ${c.id} de classe essencial a distância (GE7)`);
    if (c.origemTestemunha) e3Falhas.push(`${seedE1}: testemunha a distância (GE8)`);
  }
  if (Object.values(pacoteE1.dialogos || {}).some((d) => (d.origemLocalidade || '').startsWith('comarca_')))
    e3Falhas.push(`${seedE1}: interrogatório a distância (GE8)`);
  // E3 §4.6 — telegrama acoplado ao nó: com nó, o pacote leva os dados da
  // consulta (destino = rótulo do satélite, latência 2h/4h, resposta com
  // tags espelhando o registro) e a delegacia ganha a ação 'telegrafo';
  // sem nó, campo nenhum.
  if (locsComarca.length > 0) {
    const t = pacoteE1.telegrama;
    const registroT = pacoteE1.cartas.find((c) => c.id === 'gen_registro_comarca');
    const delegaciaT = pacoteE1.localidades.find((l) => l.id === 'delegacia');
    if (
      !t ||
      ![2, 4].includes(t.latencia) ||
      t.destino !== locsComarca[0].rotuloMesa ||
      !t.resposta ||
      JSON.stringify(t.resposta.tagsOcultas) !== JSON.stringify(registroT.tagsOcultas) ||
      !delegaciaT.acoesEspeciais.includes('telegrafo')
    )
      e3Falhas.push(`${seedE1}: telegrama malformado ou desacoplado do nó`);
  } else if (pacoteE1.telegrama) {
    e3Falhas.push(`${seedE1}: telegrama sem nó de comarca`);
  }
  // E3 §4.5 — POUSADA (vítima-forasteiro): o forasteiro é SEMPRE a vítima
  // (réu-forasteiro vetado), nunca entra em suspeitos, e a comarca vira a
  // origem dele (papéis nos pertences → nó → rota confirmada).
  if (brutoE1.escolha.palco?.pousada) {
    const vitimaP = brutoE1.mundo.elenco.find((x) => x.id === brutoE1.crime.vitimaId);
    if (!vitimaP?.forasteiro) e3Falhas.push(`${seedE1}: pousada sem vítima-forasteiro`);
    if (pacoteE1.verdadeDeOuro.reuCorreto === 'gen_forasteiro_carroceiro')
      e3Falhas.push(`${seedE1}: réu-forasteiro (vetado)`);
    if (pacoteE1.suspeitos.some((su) => su.id === 'gen_forasteiro_carroceiro'))
      e3Falhas.push(`${seedE1}: forasteiro entre os suspeitos`);
    if (!pacoteE1.cartas.some((c) => c.id === 'gen_papeis_forasteiro'))
      e3Falhas.push(`${seedE1}: pousada sem os papéis do morto`);
    if (locsComarca.length === 0) e3Falhas.push(`${seedE1}: pousada sem nó de origem`);
  }
  // E3 §4.5 — ASSIMETRIA da ausência: quando o lead do nó é um álibi
  // (gen_alibi_<id>), o declarante é o AUSENTE — ele não pode ter a
  // corroboração grátis da vizinhança, o registro distante deve ligá-lo
  // (ligadoA) e o álibi declarado deve citar o satélite, não um prédio.
  const leadAusencia = pacoteE1.leads.find(
    (ld) => ld.revelaNo.startsWith('comarca_') && ld.cartaId.startsWith('gen_alibi_')
  );
  if (leadAusencia) {
    const idAusente = leadAusencia.cartaId.replace('gen_alibi_', '');
    if (pacoteE1.cartas.some((c) => c.id === `gen_corrobora_${idAusente}`))
      e3Falhas.push(`${seedE1}: ausente com corroboração grátis na vizinhança`);
    const registroAus = pacoteE1.cartas.find((c) => c.id === 'gen_registro_comarca');
    if (!registroAus || registroAus.tagsOcultas.ligadoA !== idAusente)
      e3Falhas.push(`${seedE1}: registro distante não liga o ausente`);
    const alibiAus = pacoteE1.cartas.find((c) => c.id === leadAusencia.cartaId);
    const rotuloSat = pacoteE1.localidades.find((l) => l.id.startsWith('comarca_')).rotuloMesa;
    if (!alibiAus || !alibiAus.carimboPadrao.includes(rotuloSat))
      e3Falhas.push(`${seedE1}: álibi do ausente não declara o satélite`);
  }
}
const ge1IntegridadeOk = ge1Falhas.length === 0;
if (!ge1IntegridadeOk) console.log('\nPALCO E1 — GE1 falhou:', ge1Falhas.slice(0, 8).join('; '));
const ge2Fracao = ge2Total > 0 ? ge2SemCarta / ge2Total : 0;
const ge2AntiTelegrafoOk = ge2Fracao >= 0.4 && ge2Fracao <= 0.6;
if (!ge2AntiTelegrafoOk)
  console.log(`\nPALCO E1 — GE2 fora da banda 40–60%: ${(ge2Fracao * 100).toFixed(1)}% (${ge2SemCarta}/${ge2Total}).`);
const ge3Violacoes = arquivosJs(path.join(raizSrc, 'logic')).filter((arquivo) =>
  /\.(pontos|comodo|celula|mobilia|saidas|palco)\b/.test(semComentarios(readFileSync(arquivo, 'utf8')))
);
const ge3MotorCegoOk = ge3Violacoes.length === 0;
if (!ge3MotorCegoOk) console.log('\nPALCO E1 — GE3: src/logic lê dado de palco em:', ge3Violacoes.join(', '));

// ============================================================
// OS PALCO EM ANÉIS (E2) — logradouros da vila (Anel 1). Guardas:
// (GE4) integridade externa: toda saída ⊂ borda do grid; vestígio de cena
//       externa ancorado dentro do grid; cena externa roda num
//       pseudo-interior de logradouro (planta derivada pela MESMA função
//       — coberto pela guarda de planta da FASE 2).
// (GE5) métodos externos: no lote, cenas externas cobrem ≥ 2 famílias e
//       nenhuma família passa de 40% (Y aprovado pelo autor, 18/07).
// (GE6) chamariz: interceptação ⇒ a carta do engodo existe na fatia (a
//       alcançabilidade no pacote é coberta por marcadoresFecham do
//       gerar-casos + checagem direta no lote de pacotes da E1).
// (banda) regime-palco: externos em 10–30% do lote (moeda 20% menos a
//       salvaguarda de fallback — §3.6).
// ============================================================
const SEEDS_E2 = Array.from({ length: 150 }, (_, i) => `comarca_${i + 1}`);
const FAMILIA_DO_METODO = {
  laminada: 'lamina', garrote: 'asfixia', esganadura: 'asfixia', sufocacao: 'asfixia',
  contundente: 'contuso', afogamento: 'afogamento', veneno_arsenico: 'veneno', laudano: 'veneno',
};
const ge4Falhas = [];
const ge6Falhas = [];
let e2Externos = 0;
const e2Familias = {};
let e3ComNo = 0;
let e3Corroborativas = 0;
const MOTIVOS_COM_PAPEL_E3 = ['divida_caderneta', 'dote', 'salario_atrasado', 'heranca'];
for (const seedE2 of SEEDS_E2) {
  const brutoE2 = gerarCasoBruto(seedE2);
  const interiorE2 = brutoE2.mundo.interiores[brutoE2.escolha.localId];
  for (const sd of interiorE2.saidas || []) {
    const dentro =
      sd.col >= 0 && sd.fila >= 0 && sd.col < interiorE2.grid.colunas && sd.fila < interiorE2.grid.filas;
    const naBorda =
      sd.col === 0 || sd.fila === 0 || sd.col === interiorE2.grid.colunas - 1 || sd.fila === interiorE2.grid.filas - 1;
    if (!dentro || !naBorda) ge4Falhas.push(`${seedE2}: saída fora da borda do grid`);
  }
  // E3 — GE9: espelho da moeda do montador (corroborativa ≤1; móbil 2–7
  // só com móbil de papel; senão, sem nó).
  const moedaComarca = hashDecisaoQa(`${seedE2}|caso|comarca-funcao`) % 10;
  const reuE3 = brutoE2.mundo.elenco.find((p) => p.id === brutoE2.crime.assassinoId);
  if (moedaComarca <= 1) {
    e3ComNo += 1;
    e3Corroborativas += 1;
  } else if (moedaComarca <= 7 && MOTIVOS_COM_PAPEL_E3.includes(reuE3.motivoPotencial)) {
    e3ComNo += 1;
  }
  const palcoE2 = brutoE2.escolha.palco;
  if (!palcoE2 || !palcoE2.externo) continue;
  e2Externos += 1;
  const fam = FAMILIA_DO_METODO[brutoE2.escolha.metodoId] || brutoE2.escolha.metodoId;
  e2Familias[fam] = (e2Familias[fam] || 0) + 1;
  if (!interiorE2.logradouro) ge4Falhas.push(`${seedE2}: cena externa sem pseudo-interior de logradouro`);
  for (const v of brutoE2.crime.vestigios) {
    if (
      v.celula &&
      (v.celula.col < 0 || v.celula.fila < 0 || v.celula.col >= interiorE2.grid.colunas || v.celula.fila >= interiorE2.grid.filas)
    )
      ge4Falhas.push(`${seedE2}: vestígio ${v.id} fora do grid`);
  }
  if (!palcoE2.descoberta || palcoE2.descoberta.chegadaPerito > 13 || palcoE2.descoberta.hora < 6)
    ge4Falhas.push(`${seedE2}: descoberta externa fora das bandas`);
  if (palcoE2.via === 'chamariz' && !brutoE2.fatiaForense.cartas.some((c) => c.id === 'gen_engodo'))
    ge6Falhas.push(`${seedE2}: chamariz sem vestígio do engodo`);
}
const ge4IntegridadeExternaOk = ge4Falhas.length === 0;
if (!ge4IntegridadeExternaOk) console.log('\nPALCO E2 — GE4 falhou:', ge4Falhas.slice(0, 8).join('; '));
const e2FamiliasN = Object.values(e2Familias);
const ge5MetodosOk =
  e2Externos > 0 && e2FamiliasN.length >= 2 && Math.max(...e2FamiliasN) / e2Externos <= 0.4;
if (!ge5MetodosOk)
  console.log(`\nPALCO E2 — GE5 falhou: famílias externas ${JSON.stringify(e2Familias)} em ${e2Externos} cenas.`);
const ge6ChamarizOk = ge6Falhas.length === 0 && engodoInalcancavel.length === 0;
if (!ge6ChamarizOk)
  console.log(
    '\nPALCO E2 — GE6 falhou:',
    [...ge6Falhas, ...engodoInalcancavel.map((s) => `${s}: engodo inalcançável no pacote`)].slice(0, 8).join('; ')
  );
const bandaPalcoOk = e2Externos / SEEDS_E2.length >= 0.1 && e2Externos / SEEDS_E2.length <= 0.3;
if (!bandaPalcoOk)
  console.log(`\nPALCO E2 — regime-palco fora da banda: ${e2Externos}/${SEEDS_E2.length} externos.`);

// ============================================================
// OS PALCO EM ANÉIS (E3) — a comarca. GE7/GE8 e o lint de satélite órfão
// correm no lote de pacotes da E1 (acima, e3Falhas); aqui:
// (GE9) anti-tell: entre os casos COM nó de comarca, a fração cuja função
//       é meramente corroborativa (da vítima, sem apontar ninguém) fica
//       na banda 30–50% em torno do Z=40% do autor — "há satélite ⇒ o
//       segredo mora lá" não vira lei aprendível. A moeda é recomputada
//       da própria seed (sal `seed|caso|comarca-funcao`, determinístico).
// ============================================================
const ge7e8Ok = e3Falhas.length === 0;
if (!ge7e8Ok) console.log('\nCOMARCA E3 — GE7/GE8 falhou:', e3Falhas.slice(0, 8).join('; '));
const ge9AntiTellOk = e3ComNo > 0 && e3Corroborativas / e3ComNo >= 0.3 && e3Corroborativas / e3ComNo <= 0.5;
if (!ge9AntiTellOk)
  console.log(`\nCOMARCA E3 — GE9 fora da banda: ${e3Corroborativas}/${e3ComNo} corroborativas.`);

// E3 §4.6 — RUNTIME do telegrama: num caso do pool COM nó de comarca,
// revelar o lead, telegrafar e viajar entrega a carta ev_telegrama com as
// tags do registro distante (a consulta por fio substitui a viagem).
let telegramaRuntimeOk = true;
{
  const casoComNo = CASOS_POOL.find((p) => p.telegrama);
  if (!casoComNo) telegramaRuntimeOk = false;
  else {
    useJogo.getState().carregarCaso(casoComNo);
    useJogo.getState().escolherDetective();
    useJogo.getState().iniciarInvestigacao();
    const leadT = casoComNo.leads.find((l) => l.revelaNo.startsWith('comarca_'));
    useJogo.getState().extrairCarta(leadT.cartaId);
    const antes = useJogo.getState();
    telegramaRuntimeOk = antes.nosDesbloqueados.includes(leadT.revelaNo);
    useJogo.getState().telegrafar();
    // duas pernas de viagem na vila (1h cada) cobrem a latência de 2h.
    useJogo.getState().viajarPara('delegacia');
    useJogo.getState().viajarPara('vizinhanca');
    useJogo.getState().viajarPara('delegacia');
    useJogo.getState().viajarPara('vizinhanca');
    const depois = useJogo.getState();
    const cartaT = depois.cartasRegistradas.find((c) => c.id === 'ev_telegrama');
    telegramaRuntimeOk =
      telegramaRuntimeOk &&
      !!cartaT &&
      JSON.stringify(cartaT.tagsOcultas) === JSON.stringify(casoComNo.telegrama.resposta.tagsOcultas);
    if (!telegramaRuntimeOk) console.log('\nCOMARCA E3 — telegrama runtime falhou.');
  }
}

// ============================================================
// GUARDAS DA OS AUTOBATTLER V2 — B1 (física da mobília). Provas:
// GB1 — proveniência: toda assinatura de peça empunhável cita ARQUIVO
// EXISTENTE da KB (a fonte resolve no disco); todo número de eficácia
// vive em CALIBRACAO_MOBILIA marcado chute-calibrável (`chute: true`),
// jamais disfarçado de fato de KB.
// GB2 — integridade do schema: todo id usado em qualquer vocabulário
// (classe, ofício, logradouro) tem entrada de física; empunhável exige
// classeGolpe + assinatura e massa móvel (leve, ou media com duasMaos);
// peça fixa jamais empunhável; calibração só de peça empunhável; âncora
// d'água DERIVADA idêntica ao conjunto canônico do E2 (a elegibilidade
// do afogamento não muda um byte).
// ============================================================
const idsDeVocabulario = new Set([
  ...Object.values(MOBILIA_POR_CLASSE).flatMap((v) => v.itens.map((i) => i.id)),
  ...Object.values(MOBILIA_DE_OFICIO).flatMap((v) => v.itens.map((i) => i.id)),
]);
const fonteResolveNoDisco = (fonte) => {
  if (typeof fonte !== 'string' || !fonte.includes('docs/kb-')) return false;
  const arquivo = fonte.split(/ [§("]/)[0].trim();
  try {
    return statSync(path.join(raizRepo, arquivo)).isFile();
  } catch {
    return false;
  }
};
const empunhaveis = Object.entries(FISICA_DA_MOBILIA).filter(([, f]) => f.empunhavel);
const gb1ProvenienciaFisicaOk =
  empunhaveis.every(
    ([, f]) => f.assinatura && typeof f.assinatura.id === 'string' && fonteResolveNoDisco(f.assinatura.fonte)
  ) &&
  Object.values(CALIBRACAO_MOBILIA).every((c) => c.chute === true) &&
  fonteResolveNoDisco(PROVENIENCIA_ESPACO.fisicaDaMobilia);
const CLASSES_GOLPE_VALIDAS = ['contundente', 'cortante', 'perfurante'];
const MASSAS_VALIDAS = ['leve', 'media', 'fixa'];
const ANCORAS_AGUA_CANONICAS = ['cocho_dagua', 'lamina_do_acude', 'poco_com_tampa', 'cocho_de_gado'];
const gb2IntegridadeFisicaOk =
  [...idsDeVocabulario].every((id) => FISICA_DA_MOBILIA[id] != null) &&
  Object.values(FISICA_DA_MOBILIA).every(
    (f) =>
      MASSAS_VALIDAS.includes(f.massa) &&
      typeof f.bloqueia === 'boolean' &&
      typeof f.quinaPerigosa === 'boolean' &&
      (!f.empunhavel ||
        (CLASSES_GOLPE_VALIDAS.includes(f.classeGolpe) &&
          f.assinatura != null &&
          f.massa !== 'fixa' &&
          (f.massa === 'leve' || f.duasMaos === true)))
  ) &&
  Object.keys(CALIBRACAO_MOBILIA).every((id) => FISICA_DA_MOBILIA[id]?.empunhavel) &&
  empunhaveis.every(([id]) => CALIBRACAO_MOBILIA[id] != null) &&
  ITENS_COM_AGUA.length === ANCORAS_AGUA_CANONICAS.length &&
  ANCORAS_AGUA_CANONICAS.every((id) => ITENS_COM_AGUA.includes(id));

// ============================================================
// GUARDAS DA OS AUTOBATTLER V2 — B2 (doutrinas). Provas:
// GB3 — pureza da política: fuzz de ≥10⁴ estados sintéticos (derivados
// de hashString sob sal fixo de QA) — mesma entrada, construída duas
// vezes, ⇒ mesma ação, para os dois papéis; toda ação devolvida é
// legal; e o lint estático prova que doutrinas.js não importa hash
// nenhum (a escolha não consome sal — só a resolução, em B3).
// GB4 — matriz ação→vestígio completa: toda ação do catálogo declara
// classe EXISTENTE em CLASSES_VESTIGIO; toda linha de doutrina aponta
// ação do catálogo compatível com o papel; a rolagem paralela (grito)
// fica fora das tabelas. (A parte estatística — rastro sobrevivente em
// ≥ X% das ações realizadas — mede-se em B3, no lote.)
// ============================================================
const REGIOES_FUZZ = ['integro', 'ferido', 'inutilizado'];
const estadoDeFuzz = (i, papel) => {
  const h = (campo, mod) => hashString(`qa|doutrina|fuzz|${i}|${campo}`) % mod;
  const regioes = (p) => ({
    bracos: REGIOES_FUZZ[h(`${p}|bracos`, 3)],
    maos: REGIOES_FUZZ[h(`${p}|maos`, 3)],
    pernas: REGIOES_FUZZ[h(`${p}|pernas`, 3)],
    cabeca: REGIOES_FUZZ[h(`${p}|cabeca`, 3)],
    tronco: REGIOES_FUZZ[h(`${p}|tronco`, 3)],
  });
  const aPecaBruta = h('aPeca', 6);
  const armaVitima = h('armaV', 2) === 0 ? null : { tipo: 'peca', pecaId: 'aticador' };
  const armaAssassino = h('armaA', 3) === 0 ? { tipo: 'peca', pecaId: 'castical_de_latao' } : { tipo: 'metodo' };
  const eu = papel === 'vitima'
    ? { regioes: regioes('v'), agarre: h('agarre', 3) === 0 ? 'presa' : 'livre', arma: armaVitima, celula: { col: h('vc', 6), fila: h('vf', 5) } }
    : { regioes: regioes('a'), agarre: 'livre', arma: armaAssassino, celula: { col: h('ac', 6), fila: h('af', 5) } };
  const outro = papel === 'vitima'
    ? { regioes: regioes('a'), arma: armaAssassino, celula: { col: h('ac', 6), fila: h('af', 5) } }
    : { regioes: regioes('v'), arma: armaVitima, celula: { col: h('vc', 6), fila: h('vf', 5) } };
  return {
    rodada: 1 + h('rodada', 8),
    eu,
    outro,
    forPropria: 1 + h('forP', 5),
    forOutro: 1 + h('forO', 5),
    portao: papel === 'vitima'
      ? {
          sobAtaque: { resistir: h('sar', 2), fugir: h('saf', 2), gritar: h('sag', 2) },
          polaridade: h('pol', 2) === 0 ? 'ativa' : 'passiva',
        }
      : null,
    metodo: { seguraAVitima: h('seg', 2) === 0, sangra: h('sang', 2) === 0 },
    dist: { aoOutro: h('aoOutro', 4), aSaida: h('aSaida', 8), aPeca: aPecaBruta === 5 ? Infinity : aPecaBruta },
    pecaBloqueiaEntreNos: h('bloq', 2) === 0,
    gritou: h('gritou', 2) === 0,
    trocaElegivel: h('troca', 4) === 0,
    flags: { forcarVitoria: h('fv', 8) === 0, fugaSuprimida: h('fs', 8) === 0 },
  };
};
let gb3Falhas = 0;
for (let i = 0; i < 10000 && gb3Falhas === 0; i++) {
  for (const papel of ['vitima', 'assassino']) {
    const a1 = doutrina(papel, estadoDeFuzz(i, papel));
    const a2 = doutrina(papel, estadoDeFuzz(i, papel));
    const legais = acoesLegais(papel, estadoDeFuzz(i, papel));
    if (a1 !== a2) gb3Falhas += 1;
    else if (a1 !== null && !legais.includes(a1)) gb3Falhas += 1;
    else if (a1 === null && legais.length > 0 && papel === 'assassino') gb3Falhas += 1; // assassino sempre age quando pode
  }
}
const fonteDoutrinas = readFileSync(path.join(raizRepo, 'src/gerador/doutrinas.js'), 'utf8');
const gb3PurezaDoutrinaOk =
  gb3Falhas === 0 && !/hash/i.test(fonteDoutrinas.replace(/\/\/[^\n]*/g, '').match(/^import[^;]+;/gm)?.join('\n') ?? '') &&
  !fonteDoutrinas.includes('hashString');
const PAPEIS_ACAO_VALIDOS = ['vitima', 'assassino', 'ambos'];
const linhaCompativel = (linha, papel) => {
  const acao = CATALOGO_ACOES[linha.acao];
  return acao != null && !acao.rolagemParalela && (acao.papel === 'ambos' || acao.papel === papel);
};
const gb4MatrizCompletaOk =
  Object.values(CATALOGO_ACOES).every(
    (a) => PAPEIS_ACAO_VALIDOS.includes(a.papel) && CLASSES_VESTIGIO[a.classeVestigio] != null && typeof a.precondicao === 'function'
  ) &&
  DOUTRINA_VITIMA.every((l) => linhaCompativel(l, 'vitima')) &&
  DOUTRINA_ASSASSINO.every((l) => linhaCompativel(l, 'assassino')) &&
  ['peca_deslocada', 'lesao_padrao_de_peca', 'residuo_na_peca', 'ungueais_de_desvencilhamento', 'lesao_incidental', 'fibra_na_aresta', 'ferimento_do_agressor'].every(
    (c) => CLASSES_VESTIGIO[c] != null && CLASSES_VESTIGIO[c].evidenciaDe.every((v) => VARIAVEIS_BATALHA[v] != null)
  ) &&
  Object.values(CLASSES_VESTIGIO).every((c) => !c.naoCausal || c.ordem === 1) &&
  Object.keys(SEDES_POR_REGIAO).length === 5 &&
  ['bracos', 'maos', 'pernas', 'cabeca', 'tronco'].every((r) => Array.isArray(SEDES_POR_REGIAO[r]) && SEDES_POR_REGIAO[r].length > 0);

// ============================================================
// GUARDA DA OS AUTOBATTLER V2 — B3. GB6 (procedência total): todo
// vestígio aponta evento de origem; toda sede estampada pertence a
// SEDES_POR_REGIAO; a lesão incidental só nasce de peça com quina
// perigosa; peça deslocada só com evento de armar-se/interpor; as
// classes naoCausal jamais carregam `sinal` em carta (a incidental não
// concorre no cravar).
// ============================================================
const SEDES_VALIDAS = new Set(Object.values(SEDES_POR_REGIAO).flat());
const gb6Falhas = [];
for (const caso of casosGeradosPrimeira) {
  const { crime, fatiaForense } = caso;
  const depositados = new Set(crime.eventos.flatMap((e) => e.vestigiosDepositados));
  for (const v of crime.vestigios) {
    if (!depositados.has(v.id)) gb6Falhas.push(`${caso.seed}: ${v.id} (${v.classe}) sem evento de origem`);
    if (v.sede != null && !SEDES_VALIDAS.has(v.sede)) gb6Falhas.push(`${caso.seed}: ${v.id} sede inválida (${v.sede})`);
    if (CLASSES_VESTIGIO[v.classe]?.temSede && v.sede == null) gb6Falhas.push(`${caso.seed}: ${v.id} (${v.classe}) exige sede`);
  }
  for (const e of crime.eventos.filter((x) => x.acao === 'lesao_incidental')) {
    const peca = e.mobilia ? caso.mundo.interiores[caso.escolha.localId].mobilia.find((m) => m.id === e.mobilia) : null;
    if (!peca || !FISICA_DA_MOBILIA[peca.item]?.quinaPerigosa)
      gb6Falhas.push(`${caso.seed}: incidental fora de quina perigosa`);
  }
  for (const v of crime.vestigios.filter((x) => x.classe === 'peca_deslocada')) {
    const tem = crime.eventos.some(
      (e) => ['peca_tomada', 'interposicao_da_peca'].includes(e.acao) && e.vestigiosDepositados.includes(v.id)
    );
    if (!tem) gb6Falhas.push(`${caso.seed}: peca_deslocada sem evento de armar-se/interpor`);
  }
  for (const carta of fatiaForense.cartas) {
    if (['gen_incidental', 'gen_fibra_aresta'].includes(carta.id) && carta.tagsOcultas.sinal != null)
      gb6Falhas.push(`${caso.seed}: carta naoCausal com sinal (${carta.id})`);
  }
}
const gb6ProcedenciaOk = gb6Falhas.length === 0;
if (!gb6ProcedenciaOk) console.log('\nAUTOBATTLER V2 — GB6:', gb6Falhas.slice(0, 8).join(' | '));

// ============================================================
// GUARDAS DA OS AUTOBATTLER V2 — B4 (a troca de método, gated).
// GB9 — cravar intacto: nas seeds com troca (varridas até achar ≥3), os
// sinais causais das cartas cravam o mecanismo FATAL do registro.
// GB10 — anti-ambiguidade: nenhum sinal de tentativa crava sozinho (nem
// o par tentativa+reacao_vital); o motor é cego a metodoIniciado; a
// frequência da troca fica medida (banda D4: rara — assinatura de caso).
// ============================================================
const casosComTroca = [];
let varridosTroca = 0;
for (let i = 1; i <= 4000 && casosComTroca.length < 3; i++) {
  varridosTroca = i;
  const c = gerarCasoBruto(`mc_${i}`);
  if (c.crime.metodoIniciadoId != null) casosComTroca.push(c);
}
const gb9CravarIntacto =
  casosComTroca.length >= 3 &&
  casosComTroca.every((c) => {
    const sinais = c.fatiaForense.cartas
      .filter((k) => k.tagsOcultas?.dominio === 'causal' && k.tagsOcultas.sinal)
      .map((k) => k.tagsOcultas.sinal);
    return mecanismoCravado(sinais)?.id === METODOS[c.crime.metodoId].mecanismo;
  });
const sinaisTentativa = ['sulco_interrompido', 'preensao_cervical_incompleta'];
const gb10AntiAmbiguidade =
  sinaisTentativa.every((s) => mecanismoCravado([s]) === null && mecanismoCravado([s, 'reacao_vital']) === null) &&
  ['logic/veredicto.js', 'logic/acusacao.js'].every(
    (f) => !/metodoIniciado/.test(readFileSync(path.join(raizSrc, f), 'utf8'))
  ) &&
  casosComTroca.length / varridosTroca < 0.05; // rara: assinatura, não rotina

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
  ['Interferência: catálogo fechado v1 íntegro (R6/R1), prosa do prenúncio e ecos por chave (FASE 4)', catalogoInterferenciaIntegro],
  ['Interferência: eventos íntegros — orçamento (R5), rolagem (R1), saldo e redundância inclusive no ramo pior (R2), gatilho e rota não-órfãos (R3), prenúncio do silenciar (R4) (FASE 4)', interferenciaIntegra],
  ['Interferência: cobertura — os 4 tipos materializam nas seeds fixas e o cúmplice ocorre (FASE 4)', coberturaInterferencia],
  ['Interferência: runtime mínimo — gate, perda, evitada, eco pós-caso; tutorial inerte (regressão zero) (FASE 4)', runtimeInterferenciaOk],
  ['Interferência fora do motor: veredicto/acusação não leem eventos (FASE 4)', motorSemInterferencia],
  ['Solvabilidade sob interferência: âncora e caminho completo sobrevivem em TODOS os ramos; destruição só no conjunto redundante, ≥1 carta nova por evento (FASE 5)', solvabilidadeSobRamos],
  ['Prenúncio na prosa: todo silenciar publica sinal legível — texto exato, interpolado, nomeia a testemunha, fora do gate (FASE 5)', prenuncioNaProsaOk],
  ['Replay das seeds de interferência: mesma seed → mesmo caso com os mesmos eventos contingentes, byte a byte (FASE 5)', replayInterferenciaOk],
  ['Armadilhas detectadas: âncora destruível, gatilho órfão, rota órfã, silenciar sem prenúncio, saldo negativo — e o caso válido passa (FASE 5)', armadilhasDetectadas],
  ['Prosa sem regressão mecânica (lint-prosa): fórmula, travessões, léxico, exclamações, filtro sensorial, abertura repetida, vocativo', prosaSemRegressao],
  ['Casos embarcados = montador de hoje, byte a byte (réplica dirigida + pool) (FASE 6)', casosEmbarcadosReplay],
  ['Pacotes gerados íntegros: campos, marcadores↔cartas, blocos contingentes, slots, sem id/rótulo cru (FASE 6)', casosEmbarcadosIntegros],
  ['Casos gerados jogáveis: os 4 perfis produzem os 4 desfechos na réplica e no pool (FASE 6)', casosGeradosJogaveis],
  ['Árvores de diálogo geradas íntegras: árvore por suspeito, 4 tons por beat, sem nó órfão, bijeção confrontos↔reacoesProva, sustentação comum (OS diálogo)', dialogosGeradosIntegros],
  ['Armadilhas da árvore detectadas: beat de 3 tons, confronto sem reação, nó órfão, requerCarta fantasma (OS diálogo)', armadilhasDialogoDetectadas],
  ['Replay da árvore: mesma seed → mesma árvore, chamada a chamada (OS diálogo)', replayArvoreOk],
  [
    `P9 Fase 0 — telemetria da âncora dupla (só mede): ${p9Telemetria.duravel}/${p9Telemetria.total} já têm 2ª âncora durável independente; ${p9Telemetria.soInstrumental} cairiam na Via B (OS P9 §6)`,
    p9Fase0Ok,
  ],
  ['Psique: catálogo v2 íntegro — 13 vetores completos × 18 demográficos, degrau raro alcançável, sem afinidadePapeis (decisão 12), matriz de encenação com proveniência (OS psíquica + priors F4)', psiqueCatalogoIntegro],
  ['Lint léxico L1: nosologia/jargão pós-1893 fora de toda superfície do jogo (OS psíquica §5)', lintL1Ok],
  ['Lint léxico L2: sombra/persona/vetor/desencaixe/complexo fora de identificadores e chaves do runtime (OS psíquica §5)', lintL2Ok],
  ['Psique não vaza: pacotes embarcados sem L1 em campo algum, sem L2/psique em chave ou id (OS psíquica §5)', psiqueNaoVaza],
  ['Psique determinista: mesma seed → mesmos vetores, polaridades, magnitudes e flags (OS psíquica §5)', psiqueDeterminista],
  ['Anti-tell: em 50 seeds, todo caso tem réu com desencaixe ≥ T e ≥1 inocente destoante (OS psíquica §4.3)', antiTellOk],
  ['Confronto: determinismo byte a byte com fuga/grito/trilhas (mesma seed → mesmo registro) (OS confronto §5)', confrontoDeterminista],
  ['Confronto anti-bicondicional: há premeditado COM fuga e briga escalada SEM fuga no lote fixo (OS confronto §4.7)', antiBicondicional],
  ['Confronto: trilha contígua; ação/rota/grito só existem com vestígio sobrevivente; grito com hora e ouvinte (OS confronto §5)', fugaCoerenteEExistente],
  ['Confronto: "overdose" fora das superfícies do jogo — a língua diz "dose excessiva" (OS confronto §5)', lexicoConfronto],
  ['Confronto: réplica com fuga suprimida — registro sem fuga/grito (identidade de fatos §4.8)', replicaFugaSuprimida],
  ['Priors F2 — G1 pré-tilt: N1 em todo arquétipo (INT/WIS/CHA com extremos alcançáveis; a lavadeira pode ser gênio) (OS priors compostos §3.4)', g1PreTiltOk],
  ['Priors F2 — G2 pós-tilt: N1 em todo par arquétipo × vetor; tilt sem FOR (N2) e ≥ 1 (N3) (OS priors compostos §3.4)', g2PosTiltOk],
  ['Priors F2 — G3 cascata: forçamento de vetor re-deriva INT/WIS/CHA + quantização pela via pura; FOR intacto (OS priors compostos §3.3)', g3CascataOk],
  ['Priors F2 — G4 simetria: INT alto não é tell fraco do réu (Δ ≤ 10 p.p. vs destoante inocente, 200 seeds) (OS priors compostos §3.4)', g4SimetriaOk],
  ['Priors F2 — decorrelação: hashDecisao quebra o acoplamento de chaves-irmãs (≥20/25 pares INT×WIS, |corr| ≤ 0,15) (achado B✱)', decorrelacaoOk],
  ['Priors F3 — G5 tell calmo: ≥ 60% dos mentirosos-calmos do lote são inocentes ("serena ⇒ réu" morreu) (OS priors compostos §4.6)', g5TellCalmoOk],
  ['Priors F3 — G6 regimes: regime 1 em 30% ± 10 p.p.; nele o réu é modal, sem isca forçada, com móbil material na fatia (OS priors compostos §4.6)', g6RegimesOk],
  ['Flags Fase 3 — anti-tell das têmperas: par calma/tensão com presença cruzada (calma réu+inocente; tensão réu+isca) e defende_demais inocente-only (réu nunca super-defende ⇒ reverse-tell, como o fervor) (OS flags psíquicas §3)', fase3ParidadeOk],
  ['Priors F4 — G7 integridade de pools: priors válidos, traits ≥ 3 mapeados, motivos 4–6 no catálogo, nomes ponderados, sobrenomes 50 únicos, fonte nos itens novos (OS priors compostos §5.3)', g7PoolsOk],
  ['Palco E1 — GE1 integridade: um ponto por cômodo do grid; toda carta de cena num único caminho; carta ancorada no ponto do próprio cômodo (OS palco em anéis §2)', ge1IntegridadeOk],
  ['Palco E1 — GE2 anti-telégrafo: pontos de ambiência em 40–60% do lote de 50 seeds (OS palco em anéis §2)', ge2AntiTelegrafoOk],
  ['Palco E1 — GE3 motor cego ao palco: src/logic não lê pontos/comodo/celula/mobilia/saidas/palco (OS palco em anéis §2)', ge3MotorCegoOk],
  ['Palco E2 — GE4 integridade externa: saídas na borda do grid, vestígio externo dentro do grid, cena externa em logradouro, descoberta nas bandas (OS palco em anéis §3)', ge4IntegridadeExternaOk],
  ['Palco E2 — GE5 métodos externos: ≥ 2 famílias e nenhuma acima de 40% das cenas externas do lote (OS palco em anéis §3.3)', ge5MetodosOk],
  ['Palco E2 — GE6 chamariz: toda interceptação deposita vestígio do engodo, alcançável no pacote (OS palco em anéis §3.4b)', ge6ChamarizOk],
  ['Palco E2 — regime-palco na banda: cenas externas em 10–30% do lote de 150 seeds (OS palco em anéis §3.6)', bandaPalcoOk],
  ['Comarca E3 — GE7/GE8 + LOD: só registro durável a distância, nunca essencial; sem interrogável fora da vila; satélite referenciado tem função, nó oculto, lead e custo (OS palco em anéis §4)', ge7e8Ok],
  ['Comarca E3 — GE9 anti-tell: função meramente corroborativa em 30–50% dos casos com nó (Z=40% do autor) (OS palco em anéis §4.4)', ge9AntiTellOk],
  ['Comarca E3 — telegrama (§4.6): dados acoplados ao nó no pacote e, em runtime, expedir + viajar entrega a resposta com as tags do registro', telegramaRuntimeOk],
  ['Autobattler v2 — GB1 proveniência da física: assinatura de empunhável com fonte que resolve no disco; eficácia só em calibração chute-declarada (OS autobattler v2 B1)', gb1ProvenienciaFisicaOk],
  ['Autobattler v2 — GB2 integridade da física: todo item de vocabulário com física; empunhável bem-formado; fixa jamais empunhável; âncora d\'água derivada == canônica do E2 (OS autobattler v2 B1)', gb2IntegridadeFisicaOk],
  ['Autobattler v2 — GB3 pureza da doutrina: 10⁴ estados de fuzz ⇒ mesma ação; toda ação devolvida é legal; doutrinas.js sem hash (OS autobattler v2 B2)', gb3PurezaDoutrinaOk],
  ['Autobattler v2 — GB4 matriz ação→vestígio: toda ação com classe existente; linhas de doutrina compatíveis com papel; classes novas bem-formadas; SEDES_POR_REGIAO com as 5 regiões (OS autobattler v2 B2/D2)', gb4MatrizCompletaOk],
  ['Autobattler v2 — GB6 procedência total: vestígio com evento de origem; sede ∈ SEDES_POR_REGIAO; incidental só em quina perigosa; peça deslocada só por armar-se/interpor; naoCausal sem sinal (OS autobattler v2 B3)', gb6ProcedenciaOk],
  ['Autobattler v2 — GB9 cravar intacto: nas seeds com troca, o mecanismo FATAL crava pelos sinais das cartas (OS autobattler v2 B4)', gb9CravarIntacto],
  ['Autobattler v2 — GB10 anti-ambiguidade: sinal de tentativa não crava sozinho; motor cego a metodoIniciado; troca rara (<5%) (OS autobattler v2 B4)', gb10AntiAmbiguidade],
];
console.log('\n=== Critério de validação ===');
let todasOk = true;
for (const [rotulo, ok] of checagens) {
  console.log(`${ok ? 'OK ' : 'FALHA'} — ${rotulo}`);
  if (!ok) todasOk = false;
}
console.log(todasOk ? '\nCASO VÁLIDO.' : '\nCASO INVÁLIDO.');
process.exit(todasOk ? 0 : 1);
