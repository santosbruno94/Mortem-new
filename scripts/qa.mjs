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
import { gerarEpilogo } from '../src/logic/epilogo.js';
import { SEED_TUTORIAL } from '../src/data/seed.js';
import { obterAparencia, derivarAparenciaDeSeed } from '../src/logic/aparencia.js';
import { NOS_MAPA } from '../src/data/mapa.js';
import { POSICOES_DIORAMA, FORMAS_PREDIO } from '../src/data/mapa_espacial.js';
import { HOTSPOTS_CORPO } from '../src/data/hotspots_corpo.js';
import { obterDefinicaoCarta } from '../src/data/cartas.js';

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
// Fumaça do monólogo: todos os desfechos geram texto.
// ============================================================
console.log('\n=== Monólogos gerados (fumaça) ===');
for (const { rotulo, monologo } of monologos) {
  console.log(`· ${rotulo} → "${monologo.titulo}", ${monologo.blocos.length} blocos`);
}

// ============================================================
// GUARDA DE DETERMINISMO (regra inviolável do CLAUDE.md): nenhum
// Math.random()/Date.now() em src/logic, src/data e src/store. A camada
// de APRESENTAÇÃO (componentes, three.js — que usa Math.random em uuids
// internos) fica fora da guarda: a proibição é da lógica de jogo.
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
const violacoesDeterminismo = ['logic', 'data', 'store'].flatMap((pasta) =>
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

const apressadoCaiEmArmadilha = vApressado.falhas.length >= 1 && vApressado.tipo !== 'vitoria_absoluta';
const checagens = [
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
  ['Periférico sem móbil na mesa não ganha "razões contra a vítima"', daveySemMotivoInventado],
  ['Blocos de periféricos sem eco verbatim (monólogo e epílogo)', perifericosSemEco && epilogoSemEco],
  ['A explicação da luz é paga no epílogo, e só com a refutação', luzPagaSoComRefutacao],
  ['Epílogo determinístico; a conta do perito lê a hora do selo', epilogoDeterministico],
  ['Determinismo: sem Math.random/Date.now em logic/data/store', violacoesDeterminismo.length === 0],
  ['Aparência: genótipo completo (curadoria + derivação determinística)', aparenciasOk],
  ['Aparência fora do motor: veredicto/acusação não leem a camada', motorSemAparencia],
  ['Diorama: todo nó do mapa tem posição e forma na maquete', dioramaCompleto],
  ['Corpo 3D: todo hotspot aponta para carta real do corpo', hotspotsValidos],
];
console.log('\n=== Critério de validação ===');
let todasOk = true;
for (const [rotulo, ok] of checagens) {
  console.log(`${ok ? 'OK ' : 'FALHA'} — ${rotulo}`);
  if (!ok) todasOk = false;
}
console.log(todasOk ? '\nCASO VÁLIDO.' : '\nCASO INVÁLIDO.');
process.exit(todasOk ? 0 : 1);
