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
//
// E1 (OS palco em anéis, D1 — a última milha): toda carta nascida de
// vestígio carrega `comodo`, `celula` e `mobilia` — a âncora espacial que
// o RegistroDoCrime sempre soube e a ponte descartava. Metadado
// gerador-facing na linhagem de `suporteFisico`: o motor jamais o lê
// (guarda GE3 no qa.mjs); quem o consome é o montador do pacote, para
// dividir a cena em pontos de interesse (um por cômodo do grid).
// =====================================================================

import { METODOS } from './metodos.js';
import { SEDE_LEGIVEL } from './vestigios.js';
import { SINAL_POR_METODO } from './marcas_exigiveis.js';

// Hora de chegada do perito ao palco INTERNO — FONTE ÚNICA (diagnóstico
// 21/07, A3): é o MESMO valor gravado em parametrosCena.horasChegada do
// pacote (pacote_gerado.js) e usado pelo juízo R2 da interferência. Antes
// havia três valores divergentes (13 aqui, 11 no pacote, 11 na
// interferência), o que inflava horasMorteAntesChegada em 2h no interno e
// fazia o runtime obter dois IPMs para o mesmo instante. E2: o palco
// EXTERNO tem descoberta própria e chegada variável (caso.js §4.6) — vem
// por parâmetro.
export const HORAS_CHEGADA_INTERNO = 11;

// A fatia forense de um crime resolvido: { verdadeDeOuro, cartas }.
// JSON puro, serializável — o mesmo contrato do pacote de caso.
// `testemunhaVistoVivoId` (FASE 4, opcional): a pessoa por trás do
// avistamento gen_visto_vivo, derivada da rotina pela Fase 4 (caso.js).
// `chamariz` (E2, opcional): o engodo que levou a vítima ao palco externo
// — deposita a carta gen_engodo (conservação da evidência, GE6).
export function fatiaForenseDoCrime({
  seed,
  mundo,
  crime,
  testemunhaVistoVivoId = null,
  horasChegada = HORAS_CHEGADA_INTERNO,
  chamariz = null,
}) {
  const metodo = METODOS[crime.metodoId];
  const vitima = mundo.elenco.find((p) => p.id === crime.vitimaId);
  const assassino = mundo.elenco.find((p) => p.id === crime.assassinoId);
  const horaMorte = crime.hora.morte;
  const ipmChegada = horasChegada - horaMorte;

  const verdadeDeOuro = {
    id: `gerado_${crime.seed}`,
    vitima: vitima.nome,
    reuCorreto: assassino.id,
    horasMorteAntesChegada: ipmChegada,
    horaMorteAbsoluta: horaMorte,
    mecanismoCorreto: metodo.mecanismo,
    instrumentoCorreto: metodo.instrumento,
    // B4 (OS autobattler v2): o método que a luta abortou — o fatal
    // crava sozinho; a tentativa colore. null quando não houve troca.
    // O motor é cego a este campo (guarda no qa.mjs).
    metodoIniciado: crime.metodoIniciadoId ?? null,
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
    // OS autobattler v2 (B3): o laudo ganha a sede anatômica (M1 absorvido).
    // Rótulo TÉCNICO de build: o pipeline de prosa o substitui pelo carimbo
    // descritivo de PROSA_LESAO (P2 do playtest de 19/07 — descrever, não
    // concluir; o nome do meio é dedução do jogador).
    carimboPadrao: `Sinal de ${metodo.rotulo.toLowerCase()}${metodo.sedeFatal ? `; sede: ${SEDE_LEGIVEL[metodo.sedeFatal] || metodo.sedeFatal}` : ''}`,
    descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
    tagsOcultas: { dominio: 'causal', subDominio: 'ferida', sinal: metodo.sinalAssinatura },
  });

  // B4: o sinal de TENTATIVA do método abortado — incompleto e marcado
  // (sulco interrompido SEM os sinais gerais de asfixia consumada). Vive
  // em domínio próprio no catálogo (`modificador` + `tentativa`): jamais
  // concorre no mecanismoCravado — o fatal crava sozinho (GB10).
  const SINAL_TENTATIVA = { garrote: 'sulco_interrompido', esganadura: 'preensao_cervical_incompleta' };
  const sinalTentativa = crime.metodoIniciadoId ? SINAL_TENTATIVA[crime.metodoIniciadoId] : null;
  if (sinalTentativa) {
    cartas.push({
      id: 'gen_tentativa',
      localidade: 'corpo',
      suporteFisico: 'corpo',
      textoDisplay: 'A Marca da Tentativa',
      carimboPadrao: `Sinal de ${METODOS[crime.metodoIniciadoId].rotulo.toLowerCase()} interrompido`,
      descricao:
        sinalTentativa === 'sulco_interrompido'
          ? 'No pescoço, um sulco raso, horizontal, que se interrompe antes de fechar a volta. Faltam-lhe os sinais do estrangulamento consumado: a face não congestionou, as petéquias não vieram. O laço apertou em vida — e foi arrancado.'
          : 'No pescoço, equimoses digitais esparsas, sem o fechamento da preensão. Faltam os sinais da asfixia consumada. A mão esteve ali, e foi desfeita.',
      tagsOcultas: { dominio: 'causal', subDominio: 'tentativa', sinal: sinalTentativa },
    });
  }

  // Modificador de reação vital: só quando houve confronto em vida.
  if ((crime.variaveis.ferimentos_vitima || 0) > 0) {
    cartas.push({
      id: 'gen_reacao_vital',
      localidade: 'corpo',
      suporteFisico: 'corpo',
      // P3 (playtest 19/07): título e carimbo descrevem, não concluem — a
      // leitura "em vida" é dedução do jogador (verbete de reação vital).
      textoDisplay: 'As Bordas da Ferida',
      carimboPadrao: 'Bordas afastadas, coágulo aderido',
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
    // OS-R9 §2.8 — o instrumento LAVADO passa a ter dois tempos de leitura,
    // e é a única das três classes que os tem. A umidade da junta é sinal
    // PERECÍVEL: seca em cerca de um dia, e o perito que chegue depois disso
    // não a acha. O coágulo sob a virola é o DURÁVEL, e é o que Teichmann
    // ainda revela décadas depois.
    //
    // AS TAGS SÃO AS MESMAS NOS DOIS ESTADOS, e isto é deliberado: o nexo do
    // veredicto não pode depender de o perito ter sido rápido. É o contrato
    // do caso-escola — «o perecível degrada perdendo PRECISÃO, não valor; o
    // durável sempre resolve» — cumprido aqui pela primeira vez no gerado.
    // O que muda é o que a carta MOSTRA, e a diferença é de leitura.
    const tagsInstrumento = {
      dominio: 'vestigio',
      subDominio: 'instrumento_oficio',
      tipoVestigio: metodo.instrumento,
      pertenceA: assassino.id,
    };
    const lavado = vestigioInstrumento.classe === 'instrumento_guardado_umido';
    const vCoagulo = crime.vestigios.find((v) => v.classe === 'instrumento_lavado_coagulo');
    cartas.push({
      id: 'gen_instrumento',
      localidade: vestigioInstrumento.classe === 'instrumento_abandonado' ? 'cena' : 'oficio_do_reu',
      suporteFisico: vestigioInstrumento.classe === 'instrumento_abandonado' ? 'cena' : 'pertences_do_reu',
      comodo: vestigioInstrumento.comodo ?? null,
      celula: vestigioInstrumento.celula ? { ...vestigioInstrumento.celula } : null,
      mobilia: vestigioInstrumento.mobilia ?? null,
      textoDisplay: 'O Instrumento',
      carimboPadrao: vestigioInstrumento.detalhe,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: tagsInstrumento,
      ...(lavado && vCoagulo
        ? {
            estados: [
              {
                // A janela de secagem da junta: um dia. Fonte do número, e
                // são duas independentes na KB — supressao-de-vestigios.md:141-142
                // (a arma lavada «de véspera» ainda guarda a umidade na junta,
                // logo o sinal atravessa a noite) e :504 («que seca em um dia»).
                ipmAte: 24,
                textoDisplay: 'O Instrumento, a Junta Úmida',
                carimboPadrao: vestigioInstrumento.detalhe,
                descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
                tagsOcultas: { ...tagsInstrumento },
              },
              {
                ipmAte: null,
                textoDisplay: 'O Instrumento, a Crosta sob a Virola',
                carimboPadrao: vCoagulo.detalhe,
                descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
                tagsOcultas: { ...tagsInstrumento },
              },
            ],
          }
        : {}),
    });
  } else {
    // Método sem instrumento (as mãos): a presença vem do pertence que a
    // luta arrancou do assassino (depositado pelo autobattler).
    const pertence = crime.vestigios.find((v) => v.classe === 'pertence_do_assassino');
    // A âncora é a POSIÇÃO FINAL do corpo (não a célula da queda): o
    // pertence está na mão da vítima e viaja com ela no arrasto.
    cartas.push({
      id: 'gen_pertence',
      localidade: 'cena',
      suporteFisico: 'cena',
      comodo: crime.posicaoCorpo.comodo,
      celula: { ...crime.posicaoCorpo.celula },
      mobilia: null,
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
      comodo: vSangueAlheio.comodo ?? null,
      celula: vSangueAlheio.celula ? { ...vSangueAlheio.celula } : null,
      mobilia: vSangueAlheio.mobilia ?? null,
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
      comodo: vPegadas.comodo ?? null,
      celula: vPegadas.celula ? { ...vPegadas.celula } : null,
      mobilia: vPegadas.mobilia ?? null,
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
  // ---- OS autobattler v2 (B3): as superfícies das doutrinas ----
  // Cartas ambientais (a peça fora do lugar, a fibra na aresta, a peça
  // limpa): observação de cena SEM pertenceA e SEM sinal — o motor não as
  // lê como nexo nem como causa (a incidental é naoCausal por lei).
  const CARTAS_AMBIENTAIS_V2 = [
    ['peca_deslocada', 'gen_peca_deslocada', 'Peça Fora do Lugar'],
    ['fibra_na_aresta', 'gen_fibra_aresta', 'Fibra na Aresta'],
    ['peca_limpa_fora_de_hora', 'gen_peca_limpa', 'A Peça Limpa Fora de Hora'],
  ];
  for (const [classe, idCarta, rotuloCarta] of CARTAS_AMBIENTAIS_V2) {
    const v = crime.vestigios.find((x) => x.classe === classe && !x.removido);
    if (!v) continue;
    cartas.push({
      id: idCarta,
      localidade: 'cena',
      suporteFisico: 'cena',
      comodo: v.comodo ?? null,
      celula: v.celula ? { ...v.celula } : null,
      mobilia: v.mobilia ?? null,
      textoDisplay: rotuloCarta,
      carimboPadrao: v.detalhe,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: { dominio: 'vestigio', subDominio: 'ambiente_da_luta', tipoVestigio: classe },
    });
  }
  // O resíduo na peça improvisada: sangue do agressor na peça — segunda
  // via de presença (pertenceA), fisicamente destrutível como o respingo.
  const vResiduoPeca = crime.vestigios.find((v) => v.classe === 'residuo_na_peca' && !v.removido);
  if (vResiduoPeca) {
    cartas.push({
      id: 'gen_residuo_peca',
      localidade: 'cena',
      suporteFisico: 'cena',
      comodo: vResiduoPeca.comodo ?? null,
      celula: vResiduoPeca.celula ? { ...vResiduoPeca.celula } : null,
      mobilia: vResiduoPeca.mobilia ?? null,
      textoDisplay: 'Resíduo na Peça',
      carimboPadrao: vResiduoPeca.detalhe,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: { dominio: 'vestigio', subDominio: 'sangue_do_agressor', tipoVestigio: 'residuo_na_peca', pertenceA: assassino.id },
    });
  }
  // Cartas de corpo (o laudo lê): ungueais do desvencilhar e a lesão
  // incidental — a incidental SEM sinal causal (trava naoCausal).
  const vUngueais = crime.vestigios.find((v) => v.classe === 'ungueais_de_desvencilhamento');
  if (vUngueais) {
    cartas.push({
      id: 'gen_ungueais',
      localidade: 'corpo',
      suporteFisico: 'corpo',
      textoDisplay: 'Escoriações Ungueais',
      carimboPadrao: vUngueais.detalhe,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: { dominio: 'vestigio', subDominio: 'desvencilhamento', sede: vUngueais.sede ?? null },
    });
  }
  const vIncidental = crime.vestigios.find((v) => v.classe === 'lesao_incidental');
  if (vIncidental) {
    cartas.push({
      id: 'gen_incidental',
      localidade: 'corpo',
      suporteFisico: 'corpo',
      textoDisplay: 'Contusão com Padrão de Quina',
      carimboPadrao: vIncidental.detalhe,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: { dominio: 'vestigio', subDominio: 'lesao_ambiental', sede: vIncidental.sede ?? null },
    });
  }
  // O ferimento no CORPO do réu (fecha a remedição do B0): vive fora da
  // cena, no exame do agressor — fora do alcance da R2 (não é 'cena').
  const vFerimentoReu = crime.vestigios.find((v) => v.classe === 'ferimento_do_agressor');
  if (vFerimentoReu) {
    cartas.push({
      id: 'gen_ferimento_reu',
      localidade: 'oficio_do_reu',
      suporteFisico: 'corpo_do_reu',
      textoDisplay: 'Ferimento no Suspeito',
      carimboPadrao: vFerimentoReu.detalhe,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: { dominio: 'vestigio', subDominio: 'ferimento_do_agressor', pertenceA: assassino.id, sede: vFerimentoReu.sede ?? null },
    });
  }

  // O SINAL EXIGÍVEL: carta de corpo que anuncia a marca-espelho do agressor
  // (Inc. 6 do pivô Gabinete Ilustrado — docs/os-exigir-que-mostre.md). Gate
  // do verbo "Exigir que mostre" no interrogatório. Só quando há ferimento
  // no agressor E o método tem sinal definido (venenos não têm).
  if (vFerimentoReu && SINAL_POR_METODO[crime.metodoId]) {
    const sinal = SINAL_POR_METODO[crime.metodoId];
    cartas.push({
      id: 'gen_sinal_exigivel',
      localidade: 'corpo',
      suporteFisico: 'corpo',
      textoDisplay: 'Sinal no Corpo da Vítima',
      carimboPadrao: sinal.sinal,
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: {
        dominio: 'vestigio',
        subDominio: 'sinal_exigivel',
        regiao: sinal.regiao,
        sede: sinal.sede,
        metodoOrigem: crime.metodoId,
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

  // ---- Supressão: o que a esfrega do assoalho não tirou da fresta (Lote 1) ----
  // Quando a limpeza (WIS alta) esfregou a poça, o pigmento foi empurrado para
  // o vão entre as tábuas e sob o rodapé (Gross): a área baça à luz oblíqua e o
  // guaiaco positivo na fresta. Observação ambiental — o motor não a lê como
  // refutação nem como nexo (sem pertenceA); é a supressão tornada visível.
  const vEsfrega = crime.vestigios.find((v) => v.classe === 'assoalho_esfregado' && !v.removido);
  if (vEsfrega) {
    cartas.push({
      id: 'gen_frestas',
      localidade: 'cena',
      suporteFisico: 'cena',
      comodo: vEsfrega.comodo ?? null,
      celula: vEsfrega.celula ? { ...vEsfrega.celula } : null,
      mobilia: vEsfrega.mobilia ?? null,
      textoDisplay: 'Sangue nas Frestas',
      carimboPadrao: 'Assoalho esfregado; guaiaco positivo na fresta',
      descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
      tagsOcultas: {
        dominio: 'ambiental',
        subDominio: 'limpeza_fresca',
        tipoVestigio: 'acumulacao_frestas',
      },
    });
  }

  // ---- E2: o vestígio do engodo (todo chamariz deixa trilha — GE6) ----
  // O bilhete viaja com o corpo (suporte que interferência nenhuma
  // alcança); o recado vira testemunho do portador. Tags motor-inertes
  // (subDominio 'engodo' não é lido por regra alguma): a carta responde
  // "por que ela estava ali?", nunca crava o réu.
  if (chamariz) {
    if (chamariz.engodo === 'bilhete') {
      cartas.push({
        id: 'gen_engodo',
        localidade: 'corpo',
        suporteFisico: 'corpo',
        textoDisplay: 'O Bilhete no Bolso',
        carimboPadrao: 'Bilhete de encontro, sem assinatura',
        descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
        tagsOcultas: { dominio: 'ambiental', subDominio: 'engodo', tipoEngodo: 'bilhete_sem_assinatura' },
      });
    } else {
      cartas.push({
        id: 'gen_engodo',
        localidade: 'vizinhanca',
        suporteFisico: 'testemunho',
        origemTestemunha: chamariz.portadorId,
        textoDisplay: 'O Recado Levado',
        carimboPadrao: 'Recado que chamou a vítima',
        descricao: 'Rótulo técnico da fase 3 — prosa nasce no pipeline.',
        tagsOcultas: { dominio: 'testemunho', subDominio: 'engodo', tipoEngodo: 'recado_por_terceiro' },
      });
    }
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
