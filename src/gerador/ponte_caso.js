// =====================================================================
// PONTE PARA O PACOTE DE CASO — a FATIA FORENSE da FASE 3 (design em
// docs/game-design-simulacao.md §2; entrega 4 da ordem de serviço).
//
// Módulo GERADOR-FACING (o runtime jamais o importa; guarda no qa.mjs).
//
// O RegistroDoCrime vira aqui o que o pacote de caso consome: a Verdade
// de Ouro e as CARTAS de evidência — no MESMO vocabulário de tagsOcultas
// que o motor forense existente já lê (src/logic/cronos.js,
// src/data/catalogo_causas.js, src/logic/acusacao.js), sem alterar uma
// linha do motor. A prova de consumo vive no qa.mjs: a janela calculada
// pelo motor sobre as cartas temporais COBRE a hora real da morte; os
// sinais causais CRAVAM o mecanismo; presença e móbil apontam o réu.
//
// As cartas nascem pela via DIRETA do modelo forense (para frente,
// tempo_morte.js): dado o IPM real, o estado observado — e portanto a
// janela reversa cobre a verdade por construção, não por ajuste.
//
// PROSA: textoDisplay/carimboPadrao/descricao aqui são RÓTULOS TÉCNICOS
// de camada de dado (como os rótulos de mobília da Fase 2) — a prosa
// jogável do caso gerado nasce nas fases seguintes, pelo pipeline
// `redigir-prosa`/`revisar-prosa`. Nenhum destes textos entra em tela
// nesta fase.
//
// Contradição embutida (o motor a expõe sem mudar): quando o registro
// tem arrasto (cenaEncenada), a carta de livor sai com
// `posicaoCompativel: false` — o corpo movido contradiz as manchas.
//
// FASE 4 (interferência): cada carta ganha `suporteFisico` (metadado do
// gerador — o motor jamais o lê): 'corpo' | 'cena' | 'registro' |
// 'testemunho' | 'pertences_do_reu'. É o vocabulário que a R2 usa para
// saber o que é fisicamente destrutível (só 'cena') e o que interferência
// nenhuma alcança (o corpo está com o perito; o registro, com a polícia).
// E a fatia passa a emitir as cartas de REDUNDÂNCIA que o crime deixou:
// sangue alheio e pegadas (segunda e terceira vias de presença) e o
// depoimento de ruído (a testemunha da vizinhança — `origemTestemunha`
// identifica a pessoa por trás da carta, alvo possível de interferência).
// =====================================================================

import { METODOS } from './metodos.js';

// Hora de chegada do perito à cena (mesma convenção do caso-escola:
// 11h00 do dia 14/out na escala absoluta — src/logic/tempo.js).
const HORAS_CHEGADA = 11;

// A fatia forense de um crime resolvido: { verdadeDeOuro, cartas }.
// JSON puro, serializável — o mesmo contrato do pacote de caso.
// `testemunhaVistoVivoId` (FASE 4, opcional): a pessoa por trás do
// avistamento gen_visto_vivo, derivada da rotina pela Fase 4 (caso.js).
export function fatiaForenseDoCrime({ seed, mundo, crime, testemunhaVistoVivoId = null }) {
  const metodo = METODOS[crime.metodoId];
  const vitima = mundo.elenco.find((p) => p.id === crime.vitimaId);
  const assassino = mundo.elenco.find((p) => p.id === crime.assassinoId);
  const horaMorte = crime.hora.morte;
  const ipmChegada = HORAS_CHEGADA - horaMorte;

  const verdadeDeOuro = {
    id: `gerado_${crime.seed}`,
    vitima: vitima.nome,
    reuCorreto: assassino.id,
    horasMorteAntesChegada: ipmChegada,
    horaMorteAbsoluta: horaMorte,
    mecanismoCorreto: metodo.mecanismo,
    instrumentoCorreto: metodo.instrumento,
    motivacaoCorreta: assassino.motivoPotencial,
    cenaEncenada: crime.cenaEncenada,
    horaForjada: null,
    perifericos: {},
  };

  const cartas = [];

  // ---- Temporais do corpo (degradam por IPM, como no caso-escola) ----
  // O rigor com os QUATRO estados do modelo universal: o motor resolve o
  // estado pelo IPM do exame (resolverEstadoCarta) e converte na janela.
  cartas.push({
    id: 'gen_rigor',
    localidade: 'corpo',
    suporteFisico: 'corpo',
    estados: [
      {
        ipmAte: 12,
        textoDisplay: 'Rigidez Parcial',
        carimboPadrao: 'Maxilar duro; membros ainda cedem',
        descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
        tagsOcultas: { dominio: 'temporal', subDominio: 'rigor_mortis', estadoRigor: 'instalando', estadoDegradacao: 'ativo' },
      },
      {
        ipmAte: 24,
        textoDisplay: 'Corpo Endurecido',
        carimboPadrao: 'Duro dos maxilares aos joelhos',
        descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
        tagsOcultas: { dominio: 'temporal', subDominio: 'rigor_mortis', estadoRigor: 'pleno', estadoDegradacao: 'ativo' },
      },
      {
        ipmAte: 36,
        textoDisplay: 'Rigidez Cedendo',
        carimboPadrao: 'Maxilar solto; joelhos rígidos',
        descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
        tagsOcultas: { dominio: 'temporal', subDominio: 'rigor_mortis', estadoRigor: 'resolucao', estadoDegradacao: 'degradado' },
      },
      {
        ipmAte: null,
        textoDisplay: 'Corpo Flácido',
        carimboPadrao: 'Corpo mole, sem rigidez',
        descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
        tagsOcultas: { dominio: 'temporal', subDominio: 'rigor_mortis', estadoRigor: 'resolvido', estadoDegradacao: 'resolvido' },
      },
    ],
  });

  // Livor: móvel antes das 12h de IPM, fixo depois. A posição só é
  // compatível se o corpo NÃO foi movido (contradição do arrasto).
  const posicaoCompativel = !crime.cenaEncenada;
  cartas.push({
    id: 'gen_livores',
    localidade: 'corpo',
    suporteFisico: 'corpo',
    estados: [
      {
        ipmAte: 12,
        textoDisplay: 'Manchas que Cedem ao Polegar',
        carimboPadrao: 'Manchas que empalidecem à pressão',
        descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
        tagsOcultas: { dominio: 'temporal', subDominio: 'livor_mortis', estadoLivor: 'movel', posicaoCompativel },
      },
      {
        ipmAte: null,
        textoDisplay: 'Manchas Fixas',
        carimboPadrao: 'Manchas fixas, sem empalidecer',
        descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
        tagsOcultas: { dominio: 'temporal', subDominio: 'livor_mortis', estadoLivor: 'fixo', posicaoCompativel },
      },
    ],
  });

  // ---- Causal: a lesão fatal carrega o sinal de ASSINATURA do método ----
  cartas.push({
    id: 'gen_lesao_fatal',
    localidade: 'corpo',
    suporteFisico: 'corpo',
    textoDisplay: 'A Lesão Fatal',
    carimboPadrao: `Sinal de ${metodo.rotulo.toLowerCase()}`,
    descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
    tagsOcultas: { dominio: 'causal', subDominio: 'ferida', sinal: metodo.sinalAssinatura },
  });

  // Modificador de reação vital: só quando houve confronto em vida.
  if ((crime.variaveis.ferimentos_vitima || 0) > 0) {
    cartas.push({
      id: 'gen_reacao_vital',
      localidade: 'corpo',
      suporteFisico: 'corpo',
      textoDisplay: 'Bordas Vivas',
      carimboPadrao: 'Lesões sofridas em vida',
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: { dominio: 'causal', subDominio: 'reacao_vital', sinal: 'reacao_vital' },
    });
  }

  // ---- Temporal de testemunho: a última vez visto com vida ----
  // Piso durável da janela: quem partilhou a FAIXA ANTERIOR com a vítima
  // (grafo de avistamentos) a viu viva 1–2h antes do crime.
  cartas.push({
    id: 'gen_visto_vivo',
    localidade: 'delegacia',
    suporteFisico: 'testemunho',
    origemTestemunha: testemunhaVistoVivoId,
    textoDisplay: 'Última Vez com Vida',
    carimboPadrao: 'Avistamento da vítima antes do crime',
    descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
    tagsOcultas: {
      dominio: 'temporal',
      subDominio: 'ultima_vez_visto',
      horaAvistamento: horaMorte - 1 - (Math.abs(horaMorte) % 2),
    },
  });

  // ---- Presença: o vestígio do réu na cadeia do instrumento ----
  // O vestígio de instrumento do registro (abandonado, faltando ou
  // guardado úmido — o eixo WIS decide qual) vira a carta de nexo.
  const vestigioInstrumento = crime.vestigios.find((v) =>
    ['instrumento_abandonado', 'instrumento_faltando', 'instrumento_guardado_umido'].includes(v.classe)
  );
  if (vestigioInstrumento) {
    cartas.push({
      id: 'gen_instrumento',
      localidade: vestigioInstrumento.classe === 'instrumento_abandonado' ? 'cena' : 'oficio_do_reu',
      suporteFisico: vestigioInstrumento.classe === 'instrumento_abandonado' ? 'cena' : 'pertences_do_reu',
      textoDisplay: 'O Instrumento',
      carimboPadrao: vestigioInstrumento.detalhe,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: {
        dominio: 'vestigio',
        subDominio: 'instrumento_oficio',
        tipoVestigio: metodo.instrumento,
        pertenceA: assassino.id,
      },
    });
  } else {
    // Método sem instrumento (as mãos): a presença vem do pertence que a
    // luta arrancou do assassino (depositado pelo autobattler).
    const pertence = crime.vestigios.find((v) => v.classe === 'pertence_do_assassino');
    cartas.push({
      id: 'gen_pertence',
      localidade: 'cena',
      suporteFisico: 'cena',
      textoDisplay: 'Pertence Arrancado',
      carimboPadrao: pertence ? pertence.detalhe : 'Pertence do agressor na cena',
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: {
        dominio: 'vestigio',
        subDominio: 'objeto_pessoal',
        tipoVestigio: 'pertence_arrancado',
        pertenceA: assassino.id,
      },
    });
  }

  // ---- Redundância que o crime deixou (FASE 4) ----
  // Sangue que não é da vítima e pegadas de fuga: segunda e terceira vias
  // de PRESENÇA (pertenceA), fisicamente destrutíveis ('cena') — é sobre
  // elas que a R2 admite `destruir_evidencia` (a via instrumental fica).
  const vSangueAlheio = crime.vestigios.find((v) => v.classe === 'sangue_alheio' && !v.removido);
  if (vSangueAlheio) {
    cartas.push({
      id: 'gen_sangue_alheio',
      localidade: 'cena',
      suporteFisico: 'cena',
      textoDisplay: 'Sangue que Não É da Vítima',
      carimboPadrao: vSangueAlheio.detalhe,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: {
        dominio: 'vestigio',
        subDominio: 'sangue_do_agressor',
        tipoVestigio: 'sangue_alheio',
        pertenceA: assassino.id,
      },
    });
  }
  const vPegadas = crime.vestigios.find((v) => v.classe === 'pegada_ensanguentada' && !v.removido);
  if (vPegadas) {
    cartas.push({
      id: 'gen_pegadas',
      localidade: 'cena',
      suporteFisico: 'cena',
      textoDisplay: 'Pegadas Rumo à Porta',
      carimboPadrao: vPegadas.detalhe,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: {
        dominio: 'vestigio',
        subDominio: 'pegadas',
        tipoVestigio: 'pegada_ensanguentada',
        pertenceA: assassino.id,
      },
    });
  }
  // O depoimento do ruído: a testemunha da vizinhança que ouviu a luta
  // (grafo de avistamentos via autobattler). Alvo possível de
  // interferência (intimidar/subornar/silenciar) — por isso identifica a
  // pessoa em `origemTestemunha` (metadado do gerador; o motor não lê).
  const vRuido = crime.vestigios.find((v) => v.classe === 'ruido_ouvido' && !v.removido);
  if (vRuido && vRuido.ouvintes && vRuido.ouvintes.length > 0) {
    cartas.push({
      id: 'gen_ruido_ouvido',
      localidade: 'vizinhanca',
      suporteFisico: 'testemunho',
      origemTestemunha: vRuido.ouvintes[0],
      textoDisplay: 'O Barulho na Vizinhança',
      carimboPadrao: vRuido.detalhe,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: { dominio: 'testemunho', subDominio: 'ruido_ouvido', faixa: crime.local.faixa },
    });
  }

  // ---- Móbil: o motivo potencial da Fase 1 promovido a móbil do caso ----
  cartas.push({
    id: 'gen_motivo',
    localidade: 'delegacia',
    suporteFisico: 'registro',
    textoDisplay: 'O Móbil',
    carimboPadrao: `Motivo de ${assassino.nome} contra a vítima`,
    descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'motivo',
      motivo: assassino.motivoPotencial,
      ligadoA: assassino.id,
    },
  });

  return { verdadeDeOuro, cartas };
}
