// =====================================================================
// OS 4 PERFIS DE JOGADOR NOS CASOS GERADOS — coreografia ÚNICA, dirigindo
// o store de verdade (a mesma régua do §18 para o caso-escola):
//   Metódico  → vitoria_absoluta   Apressado → erro_judiciario
//   Intuitivo → impunidade         Desatento → sucesso_gafes
//
// FONTE ÚNICA: o qa.mjs (guarda dos embarcados) e o gerar-casos.mjs
// (filtro de candidatas) importam DAQUI. As duas cópias quase idênticas
// que existiam divergiam em silêncio — cada correção precisava ser feita
// duas vezes (revisão de 24/07).
//
// O nexo do Metódico é o vestígio INSTRUMENTAL (tipoVestigio casa com a
// arma E pertence ao réu): o find ingênuo pelo primeiro vestígio do réu
// apanhava, em certos casos, o sangue/pegada registrado antes do
// instrumento, e o veredicto (corretamente) falhava o nexo — foi o furo
// que escondeu gerado_comarca_12 até a guarda cobrir o pool inteiro.
// =====================================================================

import { useJogo } from '../../src/store/jogo.js';
import { ANCORAS } from '../../src/logic/acusacao.js';
import { janelaDaCarta } from '../../src/logic/cronos.js';
import { intersecaoJanelas } from '../../src/logic/tempo_morte.js';
import { mecanismoCravado } from '../../src/data/catalogo_causas.js';

const s = () => useJogo.getState();
const ligar = (de, para) => s().adicionarLigacao(de, para);

// Joga os 4 perfis num pacote gerado. Devolve { metodico, apressado,
// intuitivo, desatento } (os tipos de desfecho). `aoVeredito(perfil)` roda
// com o veredicto ainda em pé (o qa.mjs o usa para provar o monólogo).
export function perfisDoCasoGerado(pacote, { aoVeredito } = {}) {
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
    // periférico do Metódico é perícia, não convicção. OS da vila na mesa:
    // o interrogatório corre à porta de cada suspeito — o Metódico viaja
    // ao nó da carta (a casa; a delegacia só como fallback).
    for (const susp of pacote.suspeitos) {
      const alibi = pacote.cartas.find((c) => c.id === `gen_alibi_${susp.id}`);
      if (!alibi) continue;
      s().viajarPara(alibi.localidade || 'delegacia');
      s().extrairCarta(alibi.id);
    }
    if (pacote.cartas.some((c) => c.localidade === 'oficio_do_reu')) {
      s().viajarPara('oficio_do_reu');
      s().extrairCarta('gen_instrumento');
    }
  };
  const nexoDoMetodico = (registradas) =>
    registradas.find(
      (c) =>
        c.tagsOcultas.dominio === 'vestigio' &&
        c.tagsOcultas.pertenceA === verdade.reuCorreto &&
        c.tagsOcultas.tipoVestigio === verdade.instrumentoCorreto
    ) ||
    registradas.find(
      (c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.pertenceA === verdade.reuCorreto
    );

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
  for (const c of registradas.filter((x) => x.tagsOcultas.dominio === 'temporal')) ligar(c.id, ANCORAS.quando);
  for (const c of registradas.filter((x) => x.tagsOcultas.dominio === 'causal')) ligar(c.id, ANCORAS.como);
  const nexo = nexoDoMetodico(registradas);
  if (nexo) ligar(nexo.id, ANCORAS.presenca);
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
  if (aoVeredito) aoVeredito('metodico', resultados);
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
  const nexo2 = nexoDoMetodico(regs2);
  if (nexo2) ligar(nexo2.id, ANCORAS.presenca);
  s().submeterAcusacao();
  resultados.desatento = s().veredicto.tipo;
  s().fecharVeredicto();

  return resultados;
}

// Os 4 desfechos canônicos saíram? (extras como monologoGeradoOk, gravados
// pelo aoVeredito, só reprovam se explicitamente falsos.)
export function quatroDesfechos(r) {
  return (
    r.metodico === 'vitoria_absoluta' &&
    r.apressado === 'erro_judiciario' &&
    r.intuitivo === 'impunidade' &&
    r.desatento === 'sucesso_gafes' &&
    r.monologoGeradoOk !== false
  );
}
