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
import { doutrina } from './doutrinas.js';
import { FISICA_DA_MOBILIA, CALIBRACAO_MOBILIA } from './espaco.js';

// ===== OS autobattler v2 (B3) — constantes do resolvedor =====
// A ESCOLHA de ação é doutrina pura (doutrinas.js, zero sal); os números
// abaixo governam só a RESOLUÇÃO e são chutes calibráveis declarados
// (B5 os itera por Monte Carlo contra as bandas D3).
const MAX_RODADAS = 8; // v2: perseguição + armar-se pedem fôlego (era 6); teto duro — terminação por construção
const MAX_FERIMENTOS_ASSASSINO = 2; // ferido a este ponto, o assassino foge (rejeição)
const MAX_TENTATIVAS = 24; // teto da reamostragem antes do desespero
const PASSO_PERSEGUICAO = 2; // o predador fecha 2 células/rodada; a presa foge 1 (chute calibrável)
const ACERTO_METODO_OITAVOS = 7; // golpe do método acerta em 7/8 fora da surpresa (chute calibrável; B5: 6→7 pela banda de desespero)
const CHANCE_INCIDENTAL = 11; // lesão incidental: 1/11 por exposição a quina perigosa (chute calibrável; B5: 16→12→11 pela banda D3)

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

// Saídas do palco (E2, OS palco em anéis): o interior de prédio declara
// UMA saída (a porta frente-centro que este módulo sempre computou); o
// logradouro declara 2–4 células de borda. Fallback = a fórmula antiga —
// replay byte a byte dos casos internos por construção.
function saidasDoPalco(interior) {
  return interior.saidas && interior.saidas.length
    ? interior.saidas
    : [{ col: Math.floor(interior.grid.colunas / 2), fila: interior.grid.filas - 1 }];
}

// A saída mais próxima de uma célula (Manhattan; empate = ordem da lista).
function saidaMaisProxima(interior, celula) {
  const saidas = saidasDoPalco(interior);
  let melhor = saidas[0];
  let melhorDist = Math.abs(melhor.col - celula.col) + Math.abs(melhor.fila - celula.fila);
  for (const s of saidas) {
    const d = Math.abs(s.col - celula.col) + Math.abs(s.fila - celula.fila);
    if (d < melhorDist) {
      melhor = s;
      melhorDist = d;
    }
  }
  return melhor;
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
// Topologia da cena (OS autobattler v2, D1=a): mobília com
// `fisica.bloqueia` barra a célula; em prédio, a fronteira entre
// cômodos só se cruza pela PORTA DERIVADA (o par de células do meio da
// fronteira compartilhada — não há portas modeladas na Fase 2, então a
// parede ganha a sua passagem por derivação determinística). Logradouro
// é céu aberto: sem paredes, sem portas. Pura função do interior.
// ---------------------------------------------------------------------
const chaveCel = (c) => `${c.col},${c.fila}`;

function topologiaDaCena(interior) {
  const bloqueadas = new Set(
    interior.mobilia.filter((m) => FISICA_DA_MOBILIA[m.item]?.bloqueia).map((m) => chaveCel(m.celula))
  );
  const portas = new Set(); // 'colA,filaA>colB,filaB' nos dois sentidos
  if (!interior.logradouro) {
    for (let i = 0; i < interior.comodos.length; i++) {
      for (let j = i + 1; j < interior.comodos.length; j++) {
        const a = interior.comodos[i].id;
        const b = interior.comodos[j].id;
        const pares = [];
        for (let col = 0; col < interior.grid.colunas; col++) {
          for (let fila = 0; fila < interior.grid.filas; fila++) {
            const de = { col, fila };
            if (comodoDaCelula(interior, de) !== a) continue;
            for (const para of vizinhasDaCelula(interior, de)) {
              if (comodoDaCelula(interior, para) === b) pares.push([de, para]);
            }
          }
        }
        if (pares.length > 0) {
          const [de, para] = pares[Math.floor(pares.length / 2)]; // a célula média da fronteira
          portas.add(`${chaveCel(de)}>${chaveCel(para)}`);
          portas.add(`${chaveCel(para)}>${chaveCel(de)}`);
        }
      }
    }
  }
  return { bloqueadas, portas };
}

// Passo permitido no grid v2: dentro do cômodo livremente; entre cômodos
// só pela porta derivada (prédio); célula bloqueada não se pisa.
function passoPermitido(interior, topo, de, para) {
  if (topo.bloqueadas.has(chaveCel(para))) return false;
  if (interior.logradouro) return true;
  const cDe = comodoDaCelula(interior, de);
  const cPara = comodoDaCelula(interior, para);
  if (cDe === cPara) return true;
  return topo.portas.has(`${chaveCel(de)}>${chaveCel(para)}`);
}

// BFS ortogonal (≤ 48 células) ciente de bloqueio e portas. Devolve o
// caminho contíguo de `de` a `para` (inclusive as pontas) ou null.
function caminhoBfs(interior, topo, de, para) {
  if (de.col === para.col && de.fila === para.fila) return [{ ...de }];
  const anterior = new Map([[chaveCel(de), null]]);
  const fila = [de];
  while (fila.length > 0) {
    const atual = fila.shift();
    for (const viz of vizinhasDaCelula(interior, atual)) {
      const k = chaveCel(viz);
      if (anterior.has(k) || !passoPermitido(interior, topo, atual, viz)) continue;
      anterior.set(k, atual);
      if (viz.col === para.col && viz.fila === para.fila) {
        const caminho = [{ ...viz }];
        let volta = atual;
        while (volta) {
          caminho.unshift({ ...volta });
          volta = anterior.get(chaveCel(volta));
        }
        return caminho;
      }
      fila.push(viz);
    }
  }
  return null;
}

const chebyshev = (a, b) => Math.max(Math.abs(a.col - b.col), Math.abs(a.fila - b.fila));

// A saída alcançável mais próxima (comprimento BFS real; null = nenhuma).
function rotaDeFuga(interior, topo, celula) {
  let melhor = null;
  for (const s of saidasDoPalco(interior)) {
    const caminho = caminhoBfs(interior, topo, celula, s);
    if (caminho && (!melhor || caminho.length < melhor.length)) melhor = caminho;
  }
  return melhor;
}

// ---------------------------------------------------------------------
// UMA batalha simulada (uma tentativa da reamostragem). Pura: tudo sai
// do sal. `forcarVitoria` é o modo desespero — ignora as condições de
// derrota e mata na última rodada, com o custo máximo que a simulação
// normal poderia produzir.
// ---------------------------------------------------------------------
function simularBatalha(
  sal,
  { assassino, vitima, metodo, cenario, interior, comodoId, forcarVitoria = false, portaoPsiquico = null, fugaSuprimida = false, trocaHabilitada = false }
) {
  const comodo = interior.comodos.find((c) => c.id === comodoId);
  const forA = assassino.atributos.FOR;
  const forV = vitima.atributos.FOR;
  const surpresa = cenario === 'premeditado' ? metodo.surpresa : 0;

  // Portão psíquico da vítima — promovido de peso a regra de DESEMPATE
  // CAUSAL dentro da doutrina (OS autobattler v2 §3.4); aqui só é
  // repassado ao estado e lido pela rolagem paralela do grito.
  const portao = portaoPsiquico || { sobAtaque: { resistir: 0, fugir: 0, gritar: 0 }, polaridade: 'ativa' };
  const topo = topologiaDaCena(interior);

  // Posições iniciais (v2): a vítima no centro do cômodo (empurrada à
  // vizinha livre se o centro estiver bloqueado); o assassino na célula
  // do primeiro passo dela rumo à saída — a emboscada corta a retirada.
  let celV = centroDoComodo(comodo);
  if (topo.bloqueadas.has(chaveCel(celV))) {
    celV = vizinhasDaCelula(interior, celV).find((c) => !topo.bloqueadas.has(chaveCel(c))) || celV;
  }
  const rota0 = rotaDeFuga(interior, topo, celV);
  let celA =
    rota0 && rota0.length > 1
      ? { ...rota0[1] }
      : { ...(vizinhasDaCelula(interior, celV).find((c) => !topo.bloqueadas.has(chaveCel(c))) || celV) };

  // Estado v2 (B2): o PV letal vigente + condições por região (D2=b) +
  // agarre dinâmico + arma em mãos. Nenhum HP novo.
  let pontosVida = 2 + 2 * forV; // FOR da vítima governa a resistência (§3.1)
  const regioesV = { bracos: 'integro', maos: 'integro', pernas: 'integro', cabeca: 'integro', tronco: 'integro' };
  const regioesA = { bracos: 'integro', maos: 'integro', pernas: 'integro', cabeca: 'integro', tronco: 'integro' };
  let agarre = 'livre'; // 'presa' quando o método que segura acerta; o desvencilhar solta
  let armaV = null;
  let armaA = { tipo: 'metodo' };
  let interposta = false;
  let metodoFalhouRodadas = 0; // alimenta a troca de método (B4, gated)
  let desvencilhou = false;
  let vitimaEmFuga = false; // a última ação da vítima foi fugir (o alvo muda: a caçada derruba)

  const caminho = [{ ...celV }]; // a deriva da luta travada (o rastro vigente)
  const trilhaV = [{ ...celV }]; // TODA posição da vítima, em ordem — contígua por construção
  let idxInicioFuga = null; // índice de trilhaV onde a fuga começou (a trilha de gotejamento real)
  const rotaFuga = [];
  const limiaresFuga = [];
  const rodadasLog = [];
  const mobiliaDanificada = [];
  const pecasDeslocadas = []; // { mobiliaId, item, rotulo, celula, modo: 'tomada'|'interposta', porQuem }
  const incidentais = []; // { celula, mobiliaId, item, rotulo, regiao, sede }
  const regioesFeridasA = []; // { regiao, sede, arma: 'maos'|'peca', pecaId?, item? }
  let ferimentosVitima = 0;
  let ferimentosDefensivos = 0;
  let ferimentosAssassino = 0;
  let lesoesSitioPosterior = 0;
  let ruido = 0;
  let gritou = false;
  let inicioFuga = null;
  let acaoDominante = null; // 'resistir' | 'fugir'

  const danificarAoAlcance = (celula) => {
    for (const m of mobiliasAoAlcance(interior, celula)) {
      if (!mobiliaDanificada.includes(m.id)) {
        mobiliaDanificada.push(m.id);
        ruido += 2; // a peça que tomba soa mais que o golpe
      }
    }
  };

  // Lesão incidental de ambiente (B2 §3.3): o corpo que passa/cai contra
  // quina perigosa. No máximo UMA por batalha (assinatura de caso, não
  // rotina) e jamais sinal de mecanismo (trava naoCausal na classe).
  const exporAQuina = (salIncidental, celula, emFuga) => {
    if (incidentais.length > 0) return;
    const quina = mobiliasAoAlcance(interior, celula).find((m) => FISICA_DA_MOBILIA[m.item]?.quinaPerigosa);
    if (!quina) return;
    if (hashString(salIncidental) % CHANCE_INCIDENTAL !== 0) return;
    incidentais.push({
      celula: { ...celula },
      mobiliaId: quina.id,
      item: quina.item,
      rotulo: quina.rotulo,
      regiao: emFuga ? 'pernas' : 'cabeca',
      sede: emFuga ? 'canelas' : 'tempora',
    });
  };

  const pecaEmpunhavelMaisProxima = (celula) => {
    let melhor = null;
    for (const m of interior.mobilia) {
      if (!FISICA_DA_MOBILIA[m.item]?.empunhavel) continue;
      if (pecasDeslocadas.some((p) => p.mobiliaId === m.id && p.modo === 'tomada')) continue;
      const d = chebyshev(celula, m.celula);
      if (!melhor || d < melhor.dist) melhor = { peca: m, dist: d };
    }
    return melhor;
  };

  const pecaBloqueadoraEntre = () => {
    if (interposta) return null;
    return (
      interior.mobilia.find(
        (m) => FISICA_DA_MOBILIA[m.item]?.bloqueia && chebyshev(m.celula, celV) <= 1 && chebyshev(m.celula, celA) <= 1
      ) || null
    );
  };

  // A topologia que a VÍTIMA enxerga: o corpo do assassino bloqueia o
  // passo (a emboscada corta a retirada de fato — a fuga contorna ou a
  // doutrina muda sozinha para armar-se/interpor/aparar quando encurrala).
  const topoParaVitima = () => ({
    bloqueadas: new Set([...topo.bloqueadas, chaveCel(celA)]),
    portas: topo.portas,
  });

  // O estado que a doutrina lê (contrato de doutrinas.js).
  const estadoPara = (papel, r) => {
    const minha = papel === 'vitima' ? celV : celA;
    const maisProxima = pecaEmpunhavelMaisProxima(minha);
    const rotaSaida = papel === 'vitima' ? rotaDeFuga(interior, topoParaVitima(), celV) : null;
    return {
      rodada: r,
      eu:
        papel === 'vitima'
          ? { regioes: regioesV, agarre, arma: armaV, celula: celV }
          : { regioes: regioesA, agarre: 'livre', arma: armaA, celula: celA },
      outro:
        papel === 'vitima'
          ? { regioes: regioesA, arma: armaA, celula: celA }
          : { regioes: regioesV, arma: armaV, celula: celV },
      forPropria: papel === 'vitima' ? forV : forA,
      forOutro: papel === 'vitima' ? forA : forV,
      portao: papel === 'vitima' ? portao : null,
      metodo: { seguraAVitima: metodo.seguraAVitima, sangra: metodo.sangra },
      dist: {
        aoOutro: chebyshev(celV, celA),
        aSaida: rotaSaida ? rotaSaida.length - 1 : Infinity,
        aPeca: maisProxima ? maisProxima.dist : Infinity,
      },
      pecaBloqueiaEntreNos: pecaBloqueadoraEntre() != null,
      gritou,
      trocaElegivel:
        papel === 'assassino' &&
        trocaHabilitada &&
        metodoFalhouRodadas >= 2 &&
        Object.values(regioesA).some((x) => x !== 'integro') &&
        maisProxima != null &&
        maisProxima.dist <= 1,
      flags: { forcarVitoria, fugaSuprimida },
    };
  };

  const resultadoVitoria = (r) => ({
    vitoria: true,
    rodadas: r,
    caminho,
    celulaQueda: { ...celV },
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
    regioesV: { ...regioesV },
    regioesA: { ...regioesA },
    pecasDeslocadas,
    incidentais,
    regioesFeridasA,
    desvencilhou,
    armaV,
    armaA,
    trilhaFuga: idxInicioFuga != null ? trilhaV.slice(idxInicioFuga).map((c) => ({ ...c })) : [],
  });

  const ferirRegiao = (regioes, regiao) => {
    regioes[regiao] = regioes[regiao] === 'integro' ? 'ferido' : 'inutilizado';
  };

  // Rejeição por dano ao assassino: o teto vigente + os motivos novos do
  // v2 (a vítima que vence ARMADA é rejeição nova e legítima; o braço do
  // assassino inutilizado o incapacita).
  const rejeicaoPorFerirAssassino = (comPeca) => {
    if (forcarVitoria) return null;
    if (regioesA.bracos === 'inutilizado' || regioesA.maos === 'inutilizado') {
      return comPeca ? 'vitima_venceu_armada' : 'assassino_incapacitado';
    }
    if (ferimentosAssassino >= MAX_FERIMENTOS_ASSASSINO) {
      return regioesFeridasA.some((f) => f.arma === 'peca') ? 'vitima_venceu_armada' : 'assassino_ferido';
    }
    return null;
  };

  // Iniciativa: premeditado abre com o assassino (a emboscada não rola
  // dado); briga escalada rola |iniciativa uma vez por tentativa.
  const assassinoPrimeiro = cenario === 'premeditado' ? true : hashString(`${sal}|iniciativa`) % 2 === 0;

  for (let r = 1; r <= MAX_RODADAS; r++) {
    const salR = `${sal}|r${r}`;
    const log = { rodada: r, celulaVitima: { ...celV }, celulaAssassino: { ...celA } };
    let fugiuNestaRodada = false;
    let golpeAcertou = false;
    let morta = false;
    let rejeicao = null;

    // ===== O turno do ASSASSINO: doutrina pura + resolução salgada =====
    const turnoAssassino = () => {
      const acao = doutrina('assassino', estadoPara('assassino', r));
      log.acaoAssassino = acao;
      if (acao === 'perseguir') {
        if (interposta) {
          interposta = false; // a rodada gasta contornando a peça interposta
          log.contornouInterposicao = true;
          return;
        }
        const rotaAte = caminhoBfs(interior, topo, celA, celV);
        if (rotaAte && rotaAte.length > 2) {
          const passos = Math.min(PASSO_PERSEGUICAO, rotaAte.length - 2);
          celA = { ...rotaAte[passos] };
        }
        ruido += 1;
        log.perseguiuPara = { ...celA };
        return;
      }
      if (acao === 'armar_se') {
        // B4 (gated pela flag): a troca de método em luta.
        const alvo = pecaEmpunhavelMaisProxima(celA);
        if (!alvo) return;
        armaA = { tipo: 'peca', pecaId: alvo.peca.id, itemId: alvo.peca.item, rotulo: alvo.peca.rotulo };
        pecasDeslocadas.push({ mobiliaId: alvo.peca.id, item: alvo.peca.item, rotulo: alvo.peca.rotulo, celula: { ...alvo.peca.celula }, modo: 'tomada', porQuem: 'assassino' });
        if (hashString(`${sal}|arma|${alvo.peca.id}`) % 2 === 0) danificarAoAlcance(alvo.peca.celula);
        ruido += 1;
        log.armouSe = alvo.peca.id;
        return;
      }
      if (acao === 'golpear_metodo' || acao === 'golpear_improvisado') {
        const comPeca = acao === 'golpear_improvisado';
        const acertou = (r === 1 && surpresa > 0) || hashString(`${salR}|acerto-a`) % 8 < ACERTO_METODO_OITAVOS;
        ruido += comPeca ? 2 : metodo.ruidoPorRodada;
        if (!acertou) {
          metodoFalhouRodadas += 1; // o garrote que falha — alimenta B4
          log.golpeErrou = true;
          return;
        }
        if (!comPeca && metodo.seguraAVitima) agarre = 'presa'; // o laço/mão prende ao acertar
        const dano =
          (comPeca
            ? 1 + (CALIBRACAO_MOBILIA[armaA.itemId]?.bonusDano ?? 1) + (forA >= 4 ? 1 : 0)
            : metodo.danoBase + (forA >= 4 ? 1 : 0) + (hashString(`${salR}|dano`) % 2) + (r === 1 ? surpresa : 0)) +
          (vitimaEmFuga ? 1 : 0); // o dorso não apara (chute calibrável, B5)
        pontosVida -= dano;
        ferimentosVitima += 1;
        golpeAcertou = true;
        const sorteRegiao = hashString(`${salR}|alvo`) % 4;
        // Em quem foge, o golpe alcança o que a caçada alcança: pernas e
        // dorso (traumas.md, sítio posterior) — a fuga sustentada derruba.
        const regiao = vitimaEmFuga
          ? sorteRegiao < 2
            ? 'pernas'
            : 'tronco'
          : sorteRegiao < 2
            ? (comPeca ? 'cabeca' : metodo.regiaoAlvo || 'tronco')
            : sorteRegiao === 2
              ? 'bracos'
              : 'tronco';
        ferirRegiao(regioesV, regiao);
        log.dano = dano;
        log.regiaoAtingida = regiao;
        if (comPeca) log.golpeComPeca = armaA.pecaId;
        if (pontosVida <= 0 || (forcarVitoria && r === MAX_RODADAS)) morta = true;
      }
    };

    // ===== O turno da VÍTIMA: doutrina pura + resolução salgada =====
    const turnoVitima = () => {
      if (r === 1 && surpresa > 0) {
        log.surpresa = true; // a surpresa suprime a AÇÃO da vítima (§4.4)
        return;
      }
      const acao = doutrina('vitima', estadoPara('vitima', r));
      log.acaoVitima = acao;
      if (acao == null) return; // inação: nada legal (não é ação do catálogo)
      vitimaEmFuga = acao === 'fugir';
      if (acao !== 'fugir' && !acaoDominante) acaoDominante = 'resistir';
      if (acao === 'desvencilhar') {
        if (hashString(`${salR}|acerto-v`) % (forV + forA) < forV) {
          agarre = 'livre';
          desvencilhou = true;
          metodoFalhouRodadas += 1;
          log.desvencilhou = true;
        }
        return;
      }
      if (acao === 'armar_se') {
        const alvo = pecaEmpunhavelMaisProxima(celV);
        if (!alvo) return;
        armaV = { tipo: 'peca', pecaId: alvo.peca.id, itemId: alvo.peca.item, rotulo: alvo.peca.rotulo };
        pecasDeslocadas.push({ mobiliaId: alvo.peca.id, item: alvo.peca.item, rotulo: alvo.peca.rotulo, celula: { ...alvo.peca.celula }, modo: 'tomada', porQuem: 'vitima' });
        if (hashString(`${sal}|arma|${alvo.peca.id}`) % 2 === 0) danificarAoAlcance(alvo.peca.celula);
        ruido += 1;
        log.armouSe = alvo.peca.id;
        return;
      }
      if (acao === 'golpear_improvisado') {
        const bonus = CALIBRACAO_MOBILIA[armaV.itemId]?.bonusDano ?? 1;
        if (hashString(`${salR}|acerto-v`) % 8 < 2 + forV + bonus) {
          ferimentosAssassino += 1;
          const sorte = hashString(`${salR}|alvo-reu`) % 4;
          const regiao = sorte < 2 ? 'cabeca' : sorte === 2 ? 'bracos' : 'tronco';
          const sede = regiao === 'cabeca' ? 'fronte' : regiao === 'bracos' ? 'antebracos' : 'torax';
          ferirRegiao(regioesA, regiao);
          regioesFeridasA.push({ regiao, sede, arma: 'peca', pecaId: armaV.pecaId, item: armaV.itemId });
          ruido += 2;
          log.feriuAssassino = true;
          log.feriuComPeca = armaV.pecaId;
          rejeicao = rejeicaoPorFerirAssassino(true);
        }
        return;
      }
      if (acao === 'interpor') {
        const peca = pecaBloqueadoraEntre();
        if (!peca) return;
        interposta = true;
        pecasDeslocadas.push({ mobiliaId: peca.id, item: peca.item, rotulo: peca.rotulo, celula: { ...peca.celula }, modo: 'interposta', porQuem: 'vitima' });
        ruido += 2;
        log.interpos = peca.id;
        return;
      }
      if (acao === 'aparar') {
        if (hashString(`${salR}|acerto-v`) % 6 < forV) {
          ferimentosDefensivos += 1;
          log.reagiu = true;
          if (hashString(`${salR}|contra`) % 8 < forV) {
            ferimentosAssassino += 1;
            const sorte = hashString(`${salR}|alvo-reu`) % 4;
            const regiao = sorte < 3 ? 'bracos' : 'maos';
            ferirRegiao(regioesA, regiao);
            regioesFeridasA.push({ regiao, sede: regiao === 'bracos' ? 'antebracos' : 'dorso_das_maos', arma: 'maos' });
            log.feriuAssassino = true;
            rejeicao = rejeicaoPorFerirAssassino(false);
          }
        }
        return;
      }
      if (acao === 'fugir') {
        acaoDominante = 'fugir';
        fugiuNestaRodada = true;
        if (!inicioFuga) {
          inicioFuga = { ...celV };
          idxInicioFuga = trilhaV.length - 1;
        }
        const rotaSaida = rotaDeFuga(interior, topoParaVitima(), celV);
        if (rotaSaida && rotaSaida.length > 1) {
          const anterior = { ...celV };
          celV = { ...rotaSaida[1] };
          rotaFuga.push({ ...celV });
          trilhaV.push({ ...celV });
          ruido += 1;
          log.fugiuPara = { ...celV };
          if (comodoDaCelula(interior, celV) !== comodoDaCelula(interior, anterior)) {
            limiaresFuga.push({ ...celV });
            log.cruzouLimiar = true;
          }
          exporAQuina(`${salR}|incidental`, celV, true);
          if (!forcarVitoria && saidasDoPalco(interior).some((s) => s.col === celV.col && s.fila === celV.fila)) {
            rejeicao = 'vitima_escapou';
          }
        }
      }
    };

    const turnos = assassinoPrimeiro ? [turnoAssassino, turnoVitima] : [turnoVitima, turnoAssassino];
    for (const turno of turnos) {
      turno();
      if (morta || rejeicao) break;
    }

    // O golpe da rodada em quem fugia alcançou o dorso (sítio posterior).
    if (golpeAcertou && fugiuNestaRodada && !morta) lesoesSitioPosterior += 1;

    // ===== GRITO: rolagem paralela vigente (não é escolha da doutrina).
    // Gated pelo agarre DINÂMICO (a mão/laço abafa enquanto prende — e a
    // vítima desvencilhada grita), réplica suprimida e desespero.
    if (!morta && !rejeicao && !(r === 1 && surpresa > 0) && !gritou && agarre === 'livre' && !fugaSuprimida && !forcarVitoria) {
      let limiar = 1; // base 1/8
      if (portao.sobAtaque.gritar >= 1) limiar += 1;
      if (pontosVida <= 2) limiar += 1;
      if (hashString(`${salR}|grito`) % 8 < limiar) {
        gritou = true;
        ruido += 4;
        log.gritou = true;
      }
    }

    // ===== A DERIVA da luta travada (o rastro vigente): o par que dança.
    // Só quando adjacentes e a vítima não fugiu — ela cede uma célula
    // livre e o assassino ocupa o vão (o par continua adjacente).
    if (!morta && !rejeicao && !fugiuNestaRodada && chebyshev(celV, celA) <= 1 && hashString(`${salR}|deriva`) % 4 < Math.min(forV, 3)) {
      const livres = vizinhasDaCelula(interior, celV).filter(
        (c) => passoPermitido(interior, topo, celV, c) && !(c.col === celA.col && c.fila === celA.fila)
      );
      if (livres.length > 0) {
        const anterior = { ...celV };
        celV = { ...livres[hashString(`${salR}|deriva-para`) % livres.length] };
        celA = anterior;
        caminho.push({ ...celV });
        trilhaV.push({ ...celV });
        ruido += 1;
        danificarAoAlcance(celV);
        exporAQuina(`${salR}|incidental-d`, celV, false);
        log.derivouPara = { ...celV };
      }
    }

    // Desespero: a vitória forçada não depende de acerto nem de alcance —
    // na rodada-teto o golpe final SEMPRE consuma (o determinismo da
    // âncora não pode depender da sorte da amostragem).
    if (forcarVitoria && r === MAX_RODADAS && !morta) {
      pontosVida = 0;
      ferimentosVitima += 1;
      ferirRegiao(regioesV, metodo.regiaoAlvo || 'tronco');
      log.dano = metodo.danoBase + surpresa;
      log.regiaoAtingida = metodo.regiaoAlvo || 'tronco';
      log.golpeDeDesespero = true;
      morta = true;
    }

    rodadasLog.push(log);
    if (morta) return resultadoVitoria(r);
    if (rejeicao) return { vitoria: false, motivo: rejeicao, rodadas: r };
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

  const depositar = (classe, ancora = {}, detalhe = null, extras = {}) => {
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
      ...extras, // OS autobattler v2 (B3): sede anatômica e afins
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
      interior.logradouro ? 'resíduo no que a vítima levava consigo' : 'resíduo no serviço de chá da vítima'
    );
    registrarEvento(vitima.id, 'colapso', { celula: celulaServico, mobilia: pecaServico?.id ?? null }, {
      depositados: [vResiduo],
    });
  } else {
    const r = resultado;
    posicaoCorpo = { comodo: comodoDaCelula(interior, r.celulaQueda), celula: { ...r.celulaQueda } };

    // Golpes, doutrinas e reações, rodada a rodada (eventos sem vestígio
    // próprio; a deposição consolidada entra na queda e nos ferimentos).
    for (const log of r.rodadasLog) {
      if (log.dano != null)
        registrarEvento(assassino.id, 'golpe', { celula: log.celulaAssassino }, { detalhe: `dano ${log.dano} em ${log.regiaoAtingida}${log.golpeComPeca ? `; com ${log.golpeComPeca}` : ''}` });
      if (log.golpeErrou) registrarEvento(assassino.id, 'golpe_falho', { celula: log.celulaAssassino });
      if (log.perseguiuPara) registrarEvento(assassino.id, 'perseguicao', { celula: log.perseguiuPara });
      if (log.contornouInterposicao) registrarEvento(assassino.id, 'contornou_interposicao', { celula: log.celulaAssassino });
      if (log.desvencilhou) registrarEvento(vitima.id, 'desvencilhou_se', { celula: log.celulaVitima });
      if (log.armouSe) registrarEvento(log.acaoVitima === 'armar_se' ? vitima.id : assassino.id, 'armou_se', { celula: log.celulaVitima, mobilia: log.armouSe });
      if (log.interpos) registrarEvento(vitima.id, 'interpos_peca', { celula: log.celulaVitima, mobilia: log.interpos });
      if (log.reagiu) registrarEvento(vitima.id, 'reacao', { celula: log.celulaVitima }, { detalhe: log.feriuAssassino ? 'feriu o assassino' : null });
      if (log.feriuComPeca) registrarEvento(vitima.id, 'golpe_com_peca', { celula: log.celulaVitima, mobilia: log.feriuComPeca });
      if (log.derivouPara) registrarEvento(vitima.id, 'recuo', { celula: log.derivouPara });
    }

    // A queda: a lesão fatal e o que ela derramou.
    const depositadosNaQueda = [];
    depositadosNaQueda.push(
      depositar(
        'ferida_fatal',
        { celula: r.celulaQueda },
        `${metodo.rotulo.toLowerCase()}; ${r.ferimentosVitima} golpe(s); sede ${metodo.sedeFatal}; profundidade lê FOR ${forA}`,
        { sede: metodo.sedeFatal }
      )
    );
    if (metodo.sangra) {
      depositadosNaQueda.push(depositar('poca_sangue', { celula: r.celulaQueda }, 'poça sob o corpo'));
    }
    if (r.ferimentosDefensivos > 0) {
      // D2=b: o aparar de antebraço distingue-se do agarrar a lâmina (palmas).
      const sedeDefensiva = metodoId === 'laminada' ? 'palmas' : 'antebracos';
      depositadosNaQueda.push(
        depositar(
          'ferimentos_defensivos',
          { celula: r.celulaQueda },
          `${r.ferimentosDefensivos} ferimento(s) de aparar; sede ${sedeDefensiva}`,
          { sede: sedeDefensiva }
        )
      );
    }
    registrarEvento(vitima.id, 'queda', { celula: r.celulaQueda }, { depositados: depositadosNaQueda });

    // Método sem instrumento (as mãos): a luta arranca um pertence do
    // assassino — a âncora de presença não pode depender de arma.
    if (!metodo.instrumento) {
      const vPertence = depositar('pertence_do_assassino', { celula: r.celulaQueda }, 'botão de casaco na mão fechada da vítima');
      registrarEvento(vitima.id, 'agarrao', { celula: r.celulaQueda }, { depositados: [vPertence] });
    }

    // Sangue que não é da vítima (o respingo de CENA) + o observável no
    // CORPO do réu (B3 — fecha a remedição do B0: um vestígio com sede
    // por região ferida, fora da cena, ao alcance do exame do agressor).
    if (r.ferimentosAssassino > 0) {
      const log = r.rodadasLog.find((l) => l.feriuAssassino);
      const vSangue = depositar('sangue_alheio', { celula: log.celulaVitima }, 'respingo alto, fora do alcance da poça');
      registrarEvento(assassino.id, 'ferimento_sofrido', { celula: log.celulaVitima }, { depositados: [vSangue] });
      const regioesUnicas = [...new Set(r.regioesFeridasA.map((f) => f.regiao))];
      for (const regiao of regioesUnicas) {
        const ferida = r.regioesFeridasA.find((f) => f.regiao === regiao);
        const assinatura = ferida.arma === 'peca' ? FISICA_DA_MOBILIA[ferida.item]?.assinatura?.id : null;
        const vFerimento = depositar(
          'ferimento_do_agressor',
          {},
          `${ferida.arma === 'peca' ? `lesão com o padrão da peça (${assinatura})` : 'escoriações e contusão de luta'}; sede ${ferida.sede}`,
          { sede: ferida.sede, regiao }
        );
        registrarEvento(assassino.id, 'ferimento_no_corpo', {}, { depositados: [vFerimento], detalhe: `região ${regiao}` });
      }
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

    // ===== OS autobattler v2 (B3): a deposição das doutrinas =====
    // A peça fora do lugar (tomada como arma ou interposta entre os dois).
    for (const p of r.pecasDeslocadas) {
      const vPeca = depositar(
        'peca_deslocada',
        { celula: p.celula, mobilia: p.mobiliaId },
        p.modo === 'interposta'
          ? `${p.rotulo} girada/arrastada entre os dois`
          : `${p.rotulo} fora do seu assento, tomada como arma (${p.porQuem === 'vitima' ? 'pela vítima' : 'pelo assassino'})`
      );
      registrarEvento(
        p.porQuem === 'vitima' ? vitima.id : assassino.id,
        p.modo === 'interposta' ? 'interposicao_da_peca' : 'peca_tomada',
        { celula: p.celula, mobilia: p.mobiliaId },
        { depositados: [vPeca] }
      );
    }
    // O resíduo na peça que feriu (o sangue no castiçal).
    if (r.regioesFeridasA.some((f) => f.arma === 'peca')) {
      const golpe = r.regioesFeridasA.find((f) => f.arma === 'peca');
      const peca = interior.mobilia.find((m) => m.id === r.armaV?.pecaId) || interior.mobilia.find((m) => m.item === golpe.item);
      if (peca) {
        const assinatura = FISICA_DA_MOBILIA[golpe.item]?.assinatura?.id;
        const vResiduo = depositar(
          'residuo_na_peca',
          { celula: peca.celula, mobilia: peca.id },
          `sangue seco na ${peca.rotulo}; o padrão casa com a lesão (${assinatura})`
        );
        registrarEvento(vitima.id, 'residuo_na_peca', { celula: peca.celula, mobilia: peca.id }, { depositados: [vResiduo] });
      }
    }
    // O desvencilhar (o caso-escola do garrote falho): o par honesto —
    // escoriações no próprio pescoço + fibras/pele sob as unhas.
    if (r.desvencilhou) {
      const vUngueais = depositar(
        'ungueais_de_desvencilhamento',
        { celula: r.celulaQueda },
        'escoriações ungueais em meia-lua no próprio pescoço; fibras do laço e pele sob as unhas da vítima',
        { sede: 'pescoco' }
      );
      registrarEvento(vitima.id, 'desvencilhamento_marcado', { celula: r.celulaQueda }, { depositados: [vUngueais] });
    }
    // A lesão incidental de ambiente + a fibra na aresta (par do mesmo
    // evento; jamais sinal de mecanismo — trava naoCausal).
    for (const inc of r.incidentais) {
      const vLesao = depositar(
        'lesao_incidental',
        { celula: r.celulaQueda },
        `contusão com o padrão da quina (${inc.rotulo}); sede ${inc.sede} — queda ou golpe? a quina responde`,
        { sede: inc.sede, regiao: inc.regiao }
      );
      const vFibra = depositar(
        'fibra_na_aresta',
        { celula: inc.celula, mobilia: inc.mobiliaId },
        `cabelo/fibra de tecido preso na aresta da ${inc.rotulo}`
      );
      registrarEvento(vitima.id, 'lesao_incidental', { celula: inc.celula, mobilia: inc.mobiliaId }, { depositados: [vLesao, vFibra] });
    }

    // ===================== O PREÇO DA FUGA (§4.6, §8.4) =====================
    // A vítima que fugiu deixa trilha, esfregaço de limiar, lesões de sítio
    // posterior e — se houve — o grito com hora. A trilha só existe se o
    // método sangra e houve ferimento (regra de existência §4.6).
    if (r.rotaFuga && r.rotaFuga.length > 0) {
      if (metodo.sangra && r.ferimentosVitima >= 1) {
        // v2: a trilha é o CAMINHO REAL da vítima do início da fuga à
        // queda (BFS ciente de porta e bloqueio) — contígua por construção.
        const celulasTrilha = r.trilhaFuga && r.trilhaFuga.length > 0 ? r.trilhaFuga : caminhoEmL(r.inicioFuga || r.celulaQueda, r.celulaQueda);
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
          const vLim = depositar(
            'esfregaco_de_limiar',
            { celula: cel },
            interior.logradouro
              ? 'borrão de sangue na altura da mão, no madeiro da passagem'
              : 'borrão de sangue na altura da mão, no batente'
          );
          registrarEvento(vitima.id, 'cruzou_limiar', { celula: cel }, { depositados: [vLim] });
        }
      }
    }
    // Lesões de sítio posterior: contagem no registro, canal de laudo.
    if (r.lesoesSitioPosterior > 0) {
      const vSitio = depositar(
        'lesao_sitio_posterior',
        { celula: r.celulaQueda },
        `${r.lesoesSitioPosterior} golpe(s) alcançando o dorso, recebidos em fuga`,
        { sede: 'dorso' }
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
  // E2: logradouro não tem fechadura — o acesso preparado é vestígio de
  // porta, só existe em interior de prédio (regra de existência).
  if (cenario === 'premeditado' && intA >= 4 && !interior.logradouro) {
    const celulaPorta = saidaMaisProxima(interior, centroDoComodo(comodo));
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
      } else if (alvo.classe === 'peca_deslocada') {
        deposito = depositar('mobilia_recomposta', { celula: alvo.celula, mobilia: alvo.mobilia }, 'peça reposta no seu assento, sobre o próprio arranhão');
      } else if (alvo.classe === 'residuo_na_peca') {
        deposito = depositar('peca_limpa_fora_de_hora', { celula: alvo.celula, mobilia: alvo.mobilia }, 'a única peça sem poeira da sala — limpa onde nada mais foi limpo');
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
      const celulaPorta = saidaMaisProxima(interior, posicaoCorpo.celula);
      // v2: a pegada segue o caminho REAL (portas e bloqueio); o L antigo
      // fica de fallback quando a porta está inalcançável.
      const fuga = caminhoBfs(interior, topologiaDaCena(interior), posicaoCorpo.celula, celulaPorta) || caminhoEmL(posicaoCorpo.celula, celulaPorta);
      depositadosErro.push(depositar('pegada_ensanguentada', { celula: fuga[Math.min(1, fuga.length - 1)], celulas: fuga }, 'pegadas rumo à porta, esmaecendo'));
    }
    if (depositadosErro.length > 0) {
      registrarEvento(assassino.id, 'fuga_desleixada', { celula: posicaoCorpo.celula }, { depositados: depositadosErro });
    }
  } else if (metodo.instrumento) {
    const vUmido = depositar('instrumento_guardado_umido', {}, `${metodo.instrumento} lavado por alto e reposto; coágulo escuro alojado sob o rebite do cabo, onde a água não entrou`);
    registrarEvento(assassino.id, 'instrumento_reposto', { comodo: comodoId }, { depositados: [vUmido] });
  }

  // ===================== PÓS-FATO: ENCENAÇÃO (arrasto) =====================
  // Premeditado + INT alta (a mente que encena) + FOR para carregar: o
  // corpo é movido — e o próprio movimento é vestígio de 2ª ordem (trilha
  // + livor contraditório), jamais gratuito.
  let cenaEncenada = false;
  if (!metodo.suprimeBatalha && cenario === 'premeditado' && intA >= 4 && forA >= 3) {
    const outroComodo = interior.comodos.find((c) => c.id !== posicaoCorpo.comodo);
    const topoArrasto = outroComodo ? topologiaDaCena(interior) : null;
    const destinoArrasto = outroComodo ? centroDoComodo(outroComodo) : null;
    const trilhaBfs = outroComodo ? caminhoBfs(interior, topoArrasto, posicaoCorpo.celula, destinoArrasto) : null;
    if (outroComodo && trilhaBfs) {
      const destino = destinoArrasto;
      const trilha = trilhaBfs; // v2: o arrasto passa pela porta derivada
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
    // OS autobattler v2 (B3): as variáveis das doutrinas.
    arma_improvisada:
      resultado && resultado.pecasDeslocadas.some((p) => p.modo === 'tomada')
        ? resultado.pecasDeslocadas
            .filter((p) => p.modo === 'tomada')
            .map((p) => `${p.porQuem}:${p.item}`)
            .join('+')
        : null,
    desvencilhamento: resultado && resultado.desvencilhou ? true : null,
    lesao_incidental: resultado && resultado.incidentais.length > 0 ? resultado.incidentais.length : null,
    interposicao: resultado && resultado.pecasDeslocadas.some((p) => p.modo === 'interposta') ? true : null,
    ferimento_reu_regiao:
      resultado && resultado.regioesFeridasA.length > 0
        ? [...new Set(resultado.regioesFeridasA.map((f) => f.regiao))].join('+')
        : null,
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
