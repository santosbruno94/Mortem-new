// =====================================================================
// RESOLVEDOR DE CRIME — o autobattler rudimentar de BUILD TIME da FASE 3
// (design em docs/game-design-simulacao.md §2).
//
// Módulo GERADOR-FACING (o runtime jamais o importa; guarda no qa.mjs).
// O crime é COMETIDO aqui, na geração: uma simulação simples de
// confronto, rodada por rodada, sobre o GRID da cena (o interior da Fase
// 2 — fonte única de verdade espacial), com RNG derivado exclusivamente
// de hashString salgado sobre a seed. O jogo jamais vê a simulação: só o
// RegistroDoCrime resultante.
//
// REAMOSTRAGEM POR REJEIÇÃO (§2.1): se a batalha termina com o assassino
// derrotado (ferido demais ou vítima que resiste até o fim), ela é
// descartada e reamostrada com sal incrementado, até produzir vitória.
// Mesma seed → mesma sequência de descartes e mesma batalha aceita. As
// vitórias que sobrevivem contra vítima de FOR alta são estatisticamente
// as CUSTOSAS — o assassino sempre vence, mas carrega o preço. Esgotadas
// as tentativas (probabilidade desprezível), a última batalha é forçada
// à vitória com custo MÁXIMO (`desespero: true`) — o determinismo da
// vitória não pode depender de sorte.
//
// REGRA DE EXISTÊNCIA (§2.3): toda variável da simulação só entra em
// `registro.variaveis` se depositou vestígio diferencial observável que
// SOBREVIVE no registro. O que não deixou rastro vai a
// `metadados.variaveisInertes` (fato da simulação sem testemunha física
// — não existe para o jogo). Lint no qa.mjs.
//
// CONSERVAÇÃO DA EVIDÊNCIA (§3.3): toda ação de limpeza REMOVE um
// vestígio removível e DEPOSITA um de segunda ordem no mesmo ato — o
// óbvio vira sutil, nunca zero. Lint no qa.mjs.
//
// SCHEMA DO RegistroDoCrime (JSON puro, nenhuma função):
//   seed, cenario, metodoId, assassinoId, vitimaId
//   local        : { predioId, comodoInicial, faixa }
//   hora         : { crime, morte }        (escala absoluta do jogo)
//   batalha      : { suprimida, tentativaAceita, rodadas, desespero,
//                    tentativasDescartadas: [{ tentativa, motivo, rodadas }] }
//   eventos      : [{ ordem, ator, acao, comodo, celula, mobilia, hora,
//                     vestigiosDepositados: [id], vestigiosRemovidos: [id],
//                     detalhe }]
//   vestigios    : [{ id, classe, ordem, comodo, celula, celulas?, mobilia,
//                     evidenciaDe, removido, removidoPorEvento, detalhe }]
//   variaveis    : { <id de VARIAVEIS_BATALHA>: valor } (só as evidenciadas)
//   posicaoCorpo : { comodo, celula }
//   cenaEncenada : bool (corpo movido/encenação)
//   metadados    : { quadrante, ruidoBruto, ouvintes, variaveisInertes }
// =====================================================================

import { hashString } from '../logic/hash.js';
import { METODOS } from './metodos.js';
import { CLASSES_VESTIGIO } from './vestigios.js';

const MAX_RODADAS = 6; // além disto a vítima resiste até o teto — batalha rejeitada
const MAX_FERIMENTOS_ASSASSINO = 2; // ferido a este ponto, o assassino foge
const MAX_TENTATIVAS = 24; // teto da reamostragem antes do desespero

// Multiplicador de mobilidade da fuga por mobilidadeResidual do método,
// indexado por ferimentosVitima (1º, 2º, 3º+) — OS confronto estendido §8.2.
// A fuga decai conforme a vítima é ferida: laminada (2) não decai; contuso
// (0) some após o 1º golpe.
const MULT_MOBILIDADE = {
  2: [1, 1, 1],
  1: [1, 1, 0],
  0: [1, 0, 0],
};

function salDaSeed(seed) {
  return typeof seed === 'string' ? seed : seed?.id || 'caso';
}

// ---------------------------------------------------------------------
// Geometria do grid (o interior da Fase 2 particiona o grid em cômodos).
// ---------------------------------------------------------------------
function comodoDaCelula(interior, celula) {
  const c = interior.comodos.find(
    (k) =>
      celula.col >= k.ret.col &&
      celula.col < k.ret.col + k.ret.colunas &&
      celula.fila >= k.ret.fila &&
      celula.fila < k.ret.fila + k.ret.filas
  );
  return c ? c.id : null;
}

function centroDoComodo(comodo) {
  return {
    col: comodo.ret.col + Math.floor(comodo.ret.colunas / 2),
    fila: comodo.ret.fila + Math.floor(comodo.ret.filas / 2),
  };
}

// Vizinhas ortogonais dentro do grid, em ordem determinística fixa.
function vizinhasDaCelula(interior, celula) {
  const candidatas = [
    { col: celula.col + 1, fila: celula.fila },
    { col: celula.col - 1, fila: celula.fila },
    { col: celula.col, fila: celula.fila + 1 },
    { col: celula.col, fila: celula.fila - 1 },
  ];
  return candidatas.filter(
    (c) => c.col >= 0 && c.fila >= 0 && c.col < interior.grid.colunas && c.fila < interior.grid.filas
  );
}

// Mobílias do interior a distância de Chebyshev ≤ 1 da célula (o alcance
// de um corpo que cambaleia contra a parede).
function mobiliasAoAlcance(interior, celula) {
  return interior.mobilia.filter(
    (m) => Math.max(Math.abs(m.celula.col - celula.col), Math.abs(m.celula.fila - celula.fila)) <= 1
  );
}

// Caminho em L entre duas células (colunas primeiro, depois filas):
// passos ortogonais de 1 — contíguo por construção (lint de coerência).
function caminhoEmL(de, para) {
  const celulas = [{ col: de.col, fila: de.fila }];
  let { col, fila } = de;
  while (col !== para.col) {
    col += col < para.col ? 1 : -1;
    celulas.push({ col, fila });
  }
  while (fila !== para.fila) {
    fila += fila < para.fila ? 1 : -1;
    celulas.push({ col, fila });
  }
  return celulas;
}

// ---------------------------------------------------------------------
// UMA batalha simulada (uma tentativa da reamostragem). Pura: tudo sai
// do sal. `forcarVitoria` é o modo desespero — ignora as condições de
// derrota e mata na última rodada, com o custo máximo que a simulação
// normal poderia produzir.
// ---------------------------------------------------------------------
function simularBatalha(
  sal,
  { assassino, vitima, metodo, cenario, interior, comodoId, forcarVitoria = false, portaoPsiquico = null, fugaSuprimida = false }
) {
  const comodo = interior.comodos.find((c) => c.id === comodoId);
  const forA = assassino.atributos.FOR;
  const forV = vitima.atributos.FOR;
  const surpresa = cenario === 'premeditado' ? metodo.surpresa : 0;

  // Portão psíquico da vítima (OS confronto estendido §4.4): pesos de
  // afinidade de ação, jamais regra dura.
  const sobAtaque = portaoPsiquico?.sobAtaque || { resistir: 0, fugir: 0, gritar: 0 };
  const polaridade = portaoPsiquico?.polaridade || 'ativa';

  // Porta externa: a célula frente-centro (última fila = rua) — a mesma
  // convenção já usada pela pegada do desleixado e pelo arrasto (§4.5/§8.3).
  const portaExterna = { col: Math.floor(interior.grid.colunas / 2), fila: interior.grid.filas - 1 };

  let pontosVida = 2 + 2 * forV; // FOR da vítima governa a resistência (§3.1)
  let celulaAtual = centroDoComodo(comodo);
  const caminho = [celulaAtual]; // deslocamento do RESISTIR (vigente)
  const rotaFuga = []; // células ganhas na FUGA dirigida (novo)
  const limiaresFuga = []; // cruzamentos de cômodo na fuga (novo)
  const rodadasLog = [];
  const mobiliaDanificada = [];
  let ferimentosVitima = 0;
  let ferimentosDefensivos = 0;
  let ferimentosAssassino = 0;
  let lesoesSitioPosterior = 0; // golpes recebidos em fuga (novo)
  let ruido = 0;
  let gritou = false; // no máximo 1× por batalha (novo)
  let inicioFuga = null; // célula de onde a vítima começou a fugir (novo)
  let acaoDominante = null; // 'resistir' | 'fugir' (novo)

  const danificarAoAlcance = (celula) => {
    for (const m of mobiliasAoAlcance(interior, celula)) {
      if (!mobiliaDanificada.includes(m.id)) {
        mobiliaDanificada.push(m.id);
        ruido += 2; // a peça que tomba soa mais que o golpe
      }
    }
  };

  const resultadoVitoria = (r) => ({
    vitoria: true,
    rodadas: r,
    caminho,
    celulaQueda: { ...celulaAtual },
    ferimentosVitima,
    ferimentosDefensivos,
    ferimentosAssassino,
    lesoesSitioPosterior,
    mobiliaDanificada,
    ruido,
    rotaFuga,
    limiaresFuga,
    inicioFuga,
    gritou,
    acaoDominante,
    rodadasLog,
  });

  for (let r = 1; r <= MAX_RODADAS; r++) {
    const salR = `${sal}|r${r}`;
    const log = { rodada: r, celula: { ...celulaAtual } };

    // Golpe do assassino (sempre acerta; o que varia é o dano).
    const dano =
      metodo.danoBase + (forA >= 4 ? 1 : 0) + (hashString(`${salR}|dano`) % 2) + (r === 1 ? surpresa : 0);
    pontosVida -= dano;
    ferimentosVitima += 1;
    ruido += metodo.ruidoPorRodada;
    log.dano = dano;

    const morta = pontosVida <= 0 || (forcarVitoria && r === MAX_RODADAS);
    if (morta) {
      rodadasLog.push(log);
      return resultadoVitoria(r);
    }

    // Rodada 1 premeditada: a surpresa suprime a AÇÃO da vítima (reagir,
    // fugir, gritar) — §4.4. O DESLOCAMENTO do confronto (o drift) NÃO é
    // ação da vítima: é a luta que anda, e segue rodando toda rodada como
    // no comportamento vigente (fora deste guard, abaixo).
    let fugiuNestaRodada = false;
    if (!(r === 1 && surpresa > 0)) {
      // ===== AÇÃO DA VÍTIMA: resistir × fugir (§8.2) =====
      // fugir só é possível se o método não prende, não suprime a batalha,
      // não é réplica suprimida e não é o golpe de desespero.
      const idxFer = Math.min(ferimentosVitima, 3) - 1; // 0,1,2
      const multMob = metodo.seguraAVitima ? 0 : MULT_MOBILIDADE[metodo.mobilidadeResidual ?? 0]?.[idxFer] ?? 0;
      const pesoResistir = 1 + forV + sobAtaque.resistir + (polaridade === 'ativa' ? 1 : 0);
      const podeFugir = !forcarVitoria && !fugaSuprimida && !metodo.seguraAVitima;
      const pesoFugir = podeFugir ? (1 + sobAtaque.fugir + (polaridade === 'passiva' ? 1 : 0)) * multMob : 0;
      // Só consome o sal |acao quando a fuga é possível — assim os métodos
      // que prendem/suprimem mantêm a sequência de hashes vigente (réplica
      // byte-idêntica).
      const querFugir = pesoFugir > 0 && hashString(`${salR}|acao`) % (pesoResistir + pesoFugir) >= pesoResistir;

      if (querFugir) {
        acaoDominante = 'fugir';
        fugiuNestaRodada = true;
        lesoesSitioPosterior += 1; // o golpe desta rodada foi recebido de costas
        if (!inicioFuga) inicioFuga = { ...celulaAtual };
        const comodoAntes = comodoDaCelula(interior, celulaAtual);
        const passo = caminhoEmL(celulaAtual, portaExterna);
        celulaAtual = passo[Math.min(1, passo.length - 1)];
        rotaFuga.push({ ...celulaAtual });
        ruido += 1;
        log.fugiu = true;
        log.moveuPara = { ...celulaAtual };
        if (comodoDaCelula(interior, celulaAtual) !== comodoAntes) {
          limiaresFuga.push({ ...celulaAtual });
          log.cruzouLimiar = true;
        }
        // Alcançar a porta externa ⇒ a vítima escapa: batalha rejeitada.
        if (celulaAtual.col === portaExterna.col && celulaAtual.fila === portaExterna.fila) {
          rodadasLog.push(log);
          return { vitoria: false, motivo: 'vitima_escapou', rodadas: r };
        }
      } else {
        // ===== RESISTIR = reação vigente (mesmos sais |reage/|fere) =====
        if (!acaoDominante) acaoDominante = 'resistir';
        if (hashString(`${salR}|reage`) % 6 < forV) {
          ferimentosDefensivos += 1;
          log.reagiu = true;
          if (hashString(`${salR}|fere`) % 8 < forV) {
            ferimentosAssassino += 1;
            log.feriuAssassino = true;
            if (!forcarVitoria && ferimentosAssassino >= MAX_FERIMENTOS_ASSASSINO) {
              rodadasLog.push(log);
              return { vitoria: false, motivo: 'assassino_ferido', rodadas: r };
            }
          }
        }
      }

      // ===== GRITO: rolagem independente, no máximo 1× (§8.2) =====
      // Gated por seguraAVitima (a mão/laço abafa), réplica suprimida e
      // desespero — nenhum deles consome o sal |grito.
      if (!gritou && !metodo.seguraAVitima && !fugaSuprimida && !forcarVitoria) {
        let limiar = 1; // base 1/8
        if (sobAtaque.gritar >= 1) limiar += 1; // +1/8 pela afinidade do vetor
        if (pontosVida <= 2) limiar += 1; // +1/8 pelo desespero
        if (hashString(`${salR}|grito`) % 8 < limiar) {
          gritou = true;
          ruido += 4;
          log.gritou = true;
        }
      }
    }

    // ===== DESLOCAMENTO do confronto (o drift vigente, incondicional) =====
    // Como no comportamento original, roda TODA rodada (inclusive a rodada
    // 1 premeditada) e usa os mesmos sais |desloca/|para. Só é pulado
    // quando a vítima já se moveu na fuga dirigida desta rodada.
    if (!fugiuNestaRodada && hashString(`${salR}|desloca`) % 4 < Math.min(forV, 3)) {
      const vizinhas = vizinhasDaCelula(interior, celulaAtual);
      celulaAtual = vizinhas[hashString(`${salR}|para`) % vizinhas.length];
      caminho.push({ ...celulaAtual });
      ruido += 1;
      danificarAoAlcance(celulaAtual);
      log.moveuPara = { ...celulaAtual };
    }

    rodadasLog.push(log);
  }

  return { vitoria: false, motivo: 'vitima_resistiu', rodadas: MAX_RODADAS };
}

// ---------------------------------------------------------------------
// resolverCrime — a API da fase (§2.1):
//   resolverCrime({ assassino, vitima, metodoId, cenario, interior,
//                   comodoId, hora, faixa, ouvintes, seed })
// `ouvintes` = { mesmoLocal: [ids], adjacentes: [ids] } — quem PODERIA
// ouvir (derivado da rotina × adjacência pelo chamador, caso.js). Quem
// partilha o teto ouve o ruído abafado; o vizinho, só o audível.
// ---------------------------------------------------------------------
export function resolverCrime({ assassino, vitima, metodoId, cenario, interior, comodoId, hora, faixa, ouvintes, seed, portaoPsiquico = null, fugaSuprimida = false }) {
  const metodo = METODOS[metodoId];
  const sal = `${salDaSeed(seed)}|crime`;
  const vestigios = [];
  const eventos = [];
  let proximoVestigio = 1;
  let proximoEvento = 1;

  const depositar = (classe, ancora = {}, detalhe = null) => {
    const def = CLASSES_VESTIGIO[classe];
    const v = {
      id: `v${proximoVestigio++}`,
      classe,
      ordem: def.ordem,
      comodo: ancora.celula ? comodoDaCelula(interior, ancora.celula) : null,
      celula: ancora.celula ? { ...ancora.celula } : null,
      celulas: ancora.celulas ? ancora.celulas.map((c) => ({ ...c })) : null,
      mobilia: ancora.mobilia ?? null,
      evidenciaDe: [...def.evidenciaDe],
      removido: false,
      removidoPorEvento: null,
      detalhe,
    };
    vestigios.push(v);
    return v.id;
  };

  const registrarEvento = (ator, acao, ancora = {}, extras = {}) => {
    const e = {
      ordem: proximoEvento++,
      ator,
      acao,
      comodo: ancora.celula ? comodoDaCelula(interior, ancora.celula) : ancora.comodo ?? null,
      celula: ancora.celula ? { ...ancora.celula } : null,
      mobilia: ancora.mobilia ?? null,
      hora,
      vestigiosDepositados: extras.depositados || [],
      vestigiosRemovidos: extras.removidos || [],
      detalhe: extras.detalhe ?? null,
    };
    eventos.push(e);
    return e;
  };

  const comodo = interior.comodos.find((c) => c.id === comodoId);
  const intA = assassino.atributos.INT;
  const wisA = assassino.atributos.WIS;
  const forA = assassino.atributos.FOR;
  const quadrante = `${intA >= 4 ? 'int_alta' : 'int_baixa'}|${wisA >= 4 ? 'wis_alta' : 'wis_baixa'}`;

  // ===================== A BATALHA (ou a sua supressão) =====================
  let batalha;
  let resultado = null;
  if (metodo.suprimeBatalha) {
    batalha = { suprimida: true, tentativaAceita: 0, rodadas: 0, desespero: false, tentativasDescartadas: [] };
  } else {
    const tentativasDescartadas = [];
    let aceita = null;
    let tentativaAceita = -1;
    for (let t = 0; t < MAX_TENTATIVAS; t++) {
      const r = simularBatalha(`${sal}|batalha|${t}`, {
        assassino, vitima, metodo, cenario, interior, comodoId, portaoPsiquico, fugaSuprimida,
      });
      if (r.vitoria) {
        aceita = r;
        tentativaAceita = t;
        break;
      }
      tentativasDescartadas.push({ tentativa: t, motivo: r.motivo, rodadas: r.rodadas });
    }
    let desespero = false;
    if (!aceita) {
      // Golpe de desespero: vitória forçada com custo máximo — o
      // determinismo da âncora não pode depender da sorte da amostragem.
      aceita = simularBatalha(`${sal}|batalha|desespero`, {
        assassino, vitima, metodo, cenario, interior, comodoId, forcarVitoria: true, portaoPsiquico, fugaSuprimida,
      });
      tentativaAceita = MAX_TENTATIVAS;
      desespero = true;
    }
    resultado = aceita;
    batalha = { suprimida: false, tentativaAceita, rodadas: aceita.rodadas, desespero, tentativasDescartadas };
  }

  // ===================== DEPOSIÇÃO: O CONFRONTO =====================
  const variaveis = {};
  const variaveisInertes = [];
  let posicaoCorpo;

  registrarEvento(assassino.id, cenario === 'premeditado' ? 'emboscada' : 'provocacao', {
    celula: centroDoComodo(comodo),
  });

  if (metodo.suprimeBatalha) {
    // Veneno: a vítima serve-se e colapsa. O serviço fica na mobília do
    // cômodo (a mesa, o aparador — a primeira peça, determinístico) ou,
    // sem mobília, na própria célula central.
    const pecaServico = interior.mobilia.find((m) => m.comodo === comodoId) || null;
    const celulaServico = pecaServico ? pecaServico.celula : centroDoComodo(comodo);
    posicaoCorpo = { comodo: comodoId, celula: { ...celulaServico } };
    const vResiduo = depositar(
      'residuo_do_veneno',
      { celula: celulaServico, mobilia: pecaServico?.id ?? null },
      'resíduo no serviço de chá da vítima'
    );
    registrarEvento(vitima.id, 'colapso', { celula: celulaServico, mobilia: pecaServico?.id ?? null }, {
      depositados: [vResiduo],
    });
  } else {
    const r = resultado;
    posicaoCorpo = { comodo: comodoDaCelula(interior, r.celulaQueda), celula: { ...r.celulaQueda } };

    // Golpes e reações, rodada a rodada (eventos sem vestígio próprio;
    // a deposição consolidada entra na queda e nos ferimentos).
    for (const log of r.rodadasLog) {
      registrarEvento(assassino.id, 'golpe', { celula: log.celula }, { detalhe: `dano ${log.dano}` });
      if (log.reagiu) registrarEvento(vitima.id, 'reacao', { celula: log.celula }, { detalhe: log.feriuAssassino ? 'feriu o assassino' : null });
      if (log.moveuPara) registrarEvento(vitima.id, 'recuo', { celula: log.moveuPara });
    }

    // A queda: a lesão fatal e o que ela derramou.
    const depositadosNaQueda = [];
    depositadosNaQueda.push(
      depositar('ferida_fatal', { celula: r.celulaQueda }, `${metodo.rotulo.toLowerCase()}; ${r.ferimentosVitima} golpe(s); profundidade lê FOR ${forA}`)
    );
    if (metodo.sangra) {
      depositadosNaQueda.push(depositar('poca_sangue', { celula: r.celulaQueda }, 'poça sob o corpo'));
    }
    if (r.ferimentosDefensivos > 0) {
      depositadosNaQueda.push(
        depositar('ferimentos_defensivos', { celula: r.celulaQueda }, `${r.ferimentosDefensivos} ferimento(s) de aparar`)
      );
    }
    registrarEvento(vitima.id, 'queda', { celula: r.celulaQueda }, { depositados: depositadosNaQueda });

    // Método sem instrumento (as mãos): a luta arranca um pertence do
    // assassino — a âncora de presença não pode depender de arma.
    if (!metodo.instrumento) {
      const vPertence = depositar('pertence_do_assassino', { celula: r.celulaQueda }, 'botão de casaco na mão fechada da vítima');
      registrarEvento(vitima.id, 'agarrao', { celula: r.celulaQueda }, { depositados: [vPertence] });
    }

    // Sangue que não é da vítima: onde o assassino foi ferido.
    if (r.ferimentosAssassino > 0) {
      const log = r.rodadasLog.find((l) => l.feriuAssassino);
      const vSangue = depositar('sangue_alheio', { celula: log.celula }, 'respingo alto, fora do alcance da poça');
      registrarEvento(assassino.id, 'ferimento_sofrido', { celula: log.celula }, { depositados: [vSangue] });
    }

    // A luta que andou: rastro em mais de um ponto.
    if (r.caminho.length > 1) {
      const comodos = [...new Set(r.caminho.map((c) => comodoDaCelula(interior, c)))];
      const vRastro = depositar(
        'rastro_da_luta',
        { celula: r.caminho[r.caminho.length - 1], celulas: r.caminho },
        `a luta atravessou ${r.caminho.length} célula(s) em ${comodos.length} cômodo(s)`
      );
      registrarEvento(vitima.id, 'luta_deslocada', { celula: r.caminho[r.caminho.length - 1] }, { depositados: [vRastro] });
    }

    // Mobília que a luta derrubou.
    for (const mobiliaId of r.mobiliaDanificada) {
      const peca = interior.mobilia.find((m) => m.id === mobiliaId);
      const vPeca = depositar('mobilia_revirada', { celula: peca.celula, mobilia: peca.id }, peca.rotulo);
      registrarEvento(vitima.id, 'mobilia_derrubada', { celula: peca.celula, mobilia: peca.id }, { depositados: [vPeca] });
    }

    // ===================== O PREÇO DA FUGA (§4.6, §8.4) =====================
    // A vítima que fugiu deixa trilha, esfregaço de limiar, lesões de sítio
    // posterior e — se houve — o grito com hora. A trilha só existe se o
    // método sangra e houve ferimento (regra de existência §4.6).
    if (r.rotaFuga && r.rotaFuga.length > 0) {
      if (metodo.sangra && r.ferimentosVitima >= 1) {
        // Trilha contígua por construção (caminhoEmL do início da fuga à queda).
        const celulasTrilha = caminhoEmL(r.inicioFuga || r.celulaQueda, r.celulaQueda);
        const comodosTrilha = [...new Set(celulasTrilha.map((c) => comodoDaCelula(interior, c)))];
        const vTrilha = depositar(
          'trilha_gotejamento',
          { celula: r.celulaQueda, celulas: celulasTrilha },
          `gotas espaçadas rumo à porta; ${celulasTrilha.length} célula(s) em ${comodosTrilha.length} cômodo(s)`
        );
        registrarEvento(vitima.id, 'fuga_dirigida', { celula: r.celulaQueda }, {
          depositados: [vTrilha],
          detalhe: `fuga por ${r.rotaFuga.length} célula(s)`,
        });
        // Esfregaço em cada limiar cruzado (na altura da mão que se apoia).
        for (const cel of r.limiaresFuga) {
          const vLim = depositar('esfregaco_de_limiar', { celula: cel }, 'borrão de sangue na altura da mão, no batente');
          registrarEvento(vitima.id, 'cruzou_limiar', { celula: cel }, { depositados: [vLim] });
        }
      }
    }
    // Lesões de sítio posterior: contagem no registro, canal de laudo.
    if (r.lesoesSitioPosterior > 0) {
      const vSitio = depositar(
        'lesao_sitio_posterior',
        { celula: r.celulaQueda },
        `${r.lesoesSitioPosterior} golpe(s) alcançando o dorso, recebidos em fuga`
      );
      registrarEvento(vitima.id, 'golpe_de_costas', { celula: r.celulaQueda }, { depositados: [vSitio] });
    }
    // Grito: pico de ruído com hora própria, audível aos ADJACENTES (o
    // grito atravessa a parede que o ruído de luta não atravessa). Só existe
    // se há adjacente que o ouça (regra de existência).
    if (r.gritou) {
      const ouvintesGrito = ouvintes?.adjacentes || [];
      if (ouvintesGrito.length > 0) {
        const vGrito = depositar('grito_ouvido', {}, `grito às ${hora}h, ouvido por ${ouvintesGrito.join(', ')}`);
        vestigios[vestigios.length - 1].ouvintes = [...ouvintesGrito];
        vestigios[vestigios.length - 1].horaGrito = hora;
        registrarEvento(vitima.id, 'grito', { comodo: comodoId }, { depositados: [vGrito], detalhe: `hora ${hora}` });
        variaveis.grito = true;
      } else {
        variaveisInertes.push(`grito (sem adjacente que ouça na faixa ${faixa})`);
      }
    }

    // Ruído: só existe se alguém PODERIA tê-lo ouvido (regra de existência).
    const nivel = r.ruido >= 6 ? 'audivel' : r.ruido >= 3 ? 'abafado' : 'silencioso';
    const ouvintesEfetivos = [
      ...(nivel !== 'silencioso' ? ouvintes?.mesmoLocal || [] : []),
      ...(nivel === 'audivel' ? ouvintes?.adjacentes || [] : []),
    ];
    if (ouvintesEfetivos.length > 0) {
      const vRuido = depositar('ruido_ouvido', {}, `nível ${nivel}; ouvido por ${ouvintesEfetivos.join(', ')} na faixa ${faixa}`);
      vestigios[vestigios.length - 1].ouvintes = [...ouvintesEfetivos];
      registrarEvento(assassino.id, 'ruido_propagado', { comodo: comodoId }, { depositados: [vRuido] });
      variaveis.ruido = nivel;
    } else if (nivel !== 'silencioso') {
      variaveisInertes.push(`ruido (${nivel}, sem ouvinte na faixa ${faixa})`);
    }
  }

  // ===================== PÓS-FATO: PLANEJAMENTO (INT) =====================
  // A elaboração do método deixa rastro nos MEIOS (§3.1): INT alta prepara
  // o acesso; o veneno sempre deixa a aquisição registrada fora da cena.
  const depositadosPlanejamento = [];
  if (cenario === 'premeditado' && metodo.suprimeBatalha) {
    depositadosPlanejamento.push(depositar('aquisicao_do_meio', {}, `compra de ${metodo.rotulo.toLowerCase()} em registro de botica`));
  }
  if (cenario === 'premeditado' && intA >= 4) {
    const celulaPorta = { col: Math.floor(interior.grid.colunas / 2), fila: interior.grid.filas - 1 };
    depositadosPlanejamento.push(depositar('acesso_preparado', { celula: celulaPorta }, 'fechadura sem arrombamento; entrada preparada'));
  }
  if (depositadosPlanejamento.length > 0) {
    registrarEvento(assassino.id, 'planejamento_legivel', { comodo: comodoId }, { depositados: depositadosPlanejamento });
  }

  // ===================== PÓS-FATO: HIGIENE (WIS) =====================
  // WIS alta limpa (toda remoção CONVERTE em 2ª ordem — conservação §3.3);
  // WIS baixa deixa erro grosseiro; WIS mediana lava por alto.
  if (wisA >= 4) {
    const alvos = vestigios.filter((v) => CLASSES_VESTIGIO[v.classe].removivel && !v.removido);
    for (const alvo of alvos) {
      let deposito;
      if (alvo.classe === 'poca_sangue') {
        deposito = depositar('assoalho_esfregado', { celula: alvo.celula }, 'cheiro de soda cáustica na madeira');
      } else if (alvo.classe === 'mobilia_revirada') {
        deposito = depositar('mobilia_recomposta', { celula: alvo.celula, mobilia: alvo.mobilia }, 'peça reposta sobre o próprio arranhão');
      } else if (alvo.classe === 'residuo_do_veneno') {
        deposito = depositar('louca_lavada_fora_de_hora', { celula: alvo.celula, mobilia: alvo.mobilia }, 'o serviço lavado antes da criada');
      } else if (alvo.classe === 'trilha_gotejamento') {
        deposito = depositar('assoalho_esfregado_faixa', { celula: alvo.celula, celulas: alvo.celulas }, 'faixa lavada no sentido da trilha');
      } else if (alvo.classe === 'esfregaco_de_limiar') {
        deposito = depositar('batente_lavado', { celula: alvo.celula }, 'batente lavado, ainda úmido');
      } else {
        continue;
      }
      const evento = registrarEvento(assassino.id, 'limpeza', { celula: alvo.celula, mobilia: alvo.mobilia }, {
        depositados: [deposito],
        removidos: [alvo.id],
        detalhe: `remove ${alvo.classe}; deposita ${vestigios[vestigios.length - 1].classe}`,
      });
      alvo.removido = true;
      alvo.removidoPorEvento = evento.ordem;
    }
    if (metodo.instrumento) {
      const vFalta = depositar('instrumento_faltando', {}, `${metodo.instrumento} levado da cena; a ausência lê-se no seu lugar`);
      registrarEvento(assassino.id, 'instrumento_levado', { comodo: comodoId }, { depositados: [vFalta] });
    }
  } else if (wisA <= 2) {
    const depositadosErro = [];
    if (metodo.instrumento) {
      depositadosErro.push(depositar('instrumento_abandonado', { celula: posicaoCorpo.celula }, `${metodo.instrumento} deixado junto ao corpo`));
    }
    if (metodo.sangra && !metodo.suprimeBatalha) {
      const celulaPorta = { col: Math.floor(interior.grid.colunas / 2), fila: interior.grid.filas - 1 };
      const fuga = caminhoEmL(posicaoCorpo.celula, celulaPorta);
      depositadosErro.push(depositar('pegada_ensanguentada', { celula: fuga[Math.min(1, fuga.length - 1)], celulas: fuga }, 'pegadas rumo à porta, esmaecendo'));
    }
    if (depositadosErro.length > 0) {
      registrarEvento(assassino.id, 'fuga_desleixada', { celula: posicaoCorpo.celula }, { depositados: depositadosErro });
    }
  } else if (metodo.instrumento) {
    const vUmido = depositar('instrumento_guardado_umido', {}, `${metodo.instrumento} mal limpo e reposto às pressas entre os pertences`);
    registrarEvento(assassino.id, 'instrumento_reposto', { comodo: comodoId }, { depositados: [vUmido] });
  }

  // ===================== PÓS-FATO: ENCENAÇÃO (arrasto) =====================
  // Premeditado + INT alta (a mente que encena) + FOR para carregar: o
  // corpo é movido — e o próprio movimento é vestígio de 2ª ordem (trilha
  // + livor contraditório), jamais gratuito.
  let cenaEncenada = false;
  if (!metodo.suprimeBatalha && cenario === 'premeditado' && intA >= 4 && forA >= 3) {
    const outroComodo = interior.comodos.find((c) => c.id !== posicaoCorpo.comodo);
    if (outroComodo) {
      const destino = centroDoComodo(outroComodo);
      const trilha = caminhoEmL(posicaoCorpo.celula, destino);
      const vTrilha = depositar('trilha_arrasto', { celula: destino, celulas: trilha }, 'sulco de calcanhares entre os cômodos');
      const vLivor = depositar('livor_contraditorio', { celula: destino }, 'as manchas fixaram-se do lado que não toca o chão');
      registrarEvento(assassino.id, 'arrasto_do_corpo', { celula: destino }, {
        depositados: [vTrilha, vLivor],
        detalhe: `corpo movido de ${posicaoCorpo.comodo} para ${outroComodo.id}`,
      });
      posicaoCorpo = { comodo: outroComodo.id, celula: destino };
      cenaEncenada = true;
    }
  }

  // ===================== VARIÁVEIS (regra de existência) =====================
  // Uma variável só entra se um vestígio SOBREVIVENTE a evidencia.
  const sobreviventes = vestigios.filter((v) => !v.removido);
  const evidenciada = (id) => sobreviventes.some((v) => v.evidenciaDe.includes(id));
  const candidatas = {
    duracao: batalha.rodadas > 0 ? batalha.rodadas : null,
    deslocamento: resultado && resultado.caminho.length > 1 ? resultado.caminho.length : null,
    ferimentos_vitima: resultado ? resultado.ferimentosVitima : null,
    ferimentos_assassino: resultado && resultado.ferimentosAssassino > 0 ? resultado.ferimentosAssassino : null,
    mobilia_danificada: resultado && resultado.mobiliaDanificada.length > 0 ? resultado.mobiliaDanificada.length : null,
    arrasto: cenaEncenada ? true : null,
    higiene: wisA >= 4 ? 'limpa' : wisA <= 2 ? 'desleixada' : 'neutra',
    planejamento: depositadosPlanejamento.length > 0 ? true : null,
    // OS confronto estendido (§4.6): ação/rota/grito só existem se um
    // vestígio sobrevivente as evidencia (a conservação garante que a
    // limpeza total ainda deixa 2ª ordem). 'resistir' é coberto pelas
    // variáveis vigentes; só 'fugir' é diferencial novo.
    acao_vitima: resultado && resultado.acaoDominante === 'fugir' ? 'fugir' : null,
    rota_fuga: resultado && resultado.rotaFuga && resultado.rotaFuga.length > 0 ? resultado.rotaFuga.length : null,
    lesoes_sitio_posterior: resultado && resultado.lesoesSitioPosterior > 0 ? resultado.lesoesSitioPosterior : null,
  };
  for (const [id, valor] of Object.entries(candidatas)) {
    if (valor === null) continue;
    if (evidenciada(id)) variaveis[id] = valor;
    else variaveisInertes.push(id);
  }

  return {
    seed: salDaSeed(seed),
    cenario,
    metodoId,
    assassinoId: assassino.id,
    vitimaId: vitima.id,
    local: { predioId: interior.predioId, comodoInicial: comodoId, faixa },
    hora: { crime: hora, morte: hora },
    batalha,
    eventos,
    vestigios,
    variaveis,
    posicaoCorpo,
    cenaEncenada,
    metadados: {
      quadrante,
      ruidoBruto: resultado ? resultado.ruido : 0,
      ouvintes: { mesmoLocal: [...(ouvintes?.mesmoLocal || [])], adjacentes: [...(ouvintes?.adjacentes || [])] },
      variaveisInertes,
    },
  };
}
