// =====================================================================
// Estado global do jogo (Zustand) — §16 do contexto.
//
// O relógio só avança com ações periciais (extrair, interrogar, medir
// temperatura). Gavetas, glossário, caderneta, painel de álibis e o
// Quadro custam zero. A degradação das evidências do corpo é resolvida
// no momento da extração, a partir do IPM corrente (armadilha 1).
// =====================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  obterCaso,
  carregarCaso as aplicarCasoNoModulo,
  obterDefinicaoCarta,
  resolverEstadoCarta,
  obterEcosDoMestre,
  obterInterferencias,
  obterEcosInterferencia,
  custoViagem,
  obterNo,
} from '../data/pacote_caso.js';
import { ipmAtual, formatDuracao, formatTemperatura } from '../logic/tempo.js';
import { temperaturaPorIpm, CONSTANTES_FORENSES } from '../logic/tempo_morte.js';
import { calcularVeredictoCadeia } from '../logic/veredicto.js';
import { ligacaoDeConfrontoEmCena } from '../logic/acusacao.js';
import { conclusoesDoMestre } from '../logic/falaDoMestre.js';
import { derivarEcoDoMestre } from '../logic/ecoMestre.js';
import { derivarEcosInterferencia } from '../logic/ecoInterferencia.js';
import { interpolar } from '../logic/interpolar.js';

// Constrói o objeto detective do §12. Há um único perito jogável; o shape
// (pronoun etc.) permanece porque as interpolações {g:...} são estruturais.
export function buildDetective() {
  return { name: 'Harlan', surname: 'Blackwell', pronoun: 'ele', treatment: 'Sr.', title: 'Dr.' };
}

// Custo (horas) de revisar a acusação após um desfecho (Q2): a regalia do
// caso-escola deixa de ser grátis — a audiência adia-se a cada retentativa.
export const CUSTO_REVISAO = 2;

// ---------------------------------------------------------------------
// O estado de dado de UM caso, num factory: é a fonte única tanto do
// arranque quanto do "Recomeçar do zero" (reiniciarCaso). Só dado puro,
// JSON-serializável — as ações vivem fora, no create.
// ---------------------------------------------------------------------
export function estadoInicialCaso() {
  // Todas as leituras de caso saem do pacote carregado (default = o caso-
  // escola): a hora de chegada e os nós iniciais deixam de ser cravados aqui.
  const caso = obterCaso();
  const horasChegada = caso.parametrosCena.horasChegada;
  return {
    // ---------------- Fases e personagem ----------------
    faseJogo: 'selecao', // 'selecao' → 'abertura' → 'investigacao'
    detective: null,
    passoAbertura: 0,

    // ---------------- Relógio ----------------
    horasJogo: horasChegada,
    horasChegadaCena: horasChegada,

    // ---------------- Mapa (o "dia do perito") ----------------
    // O relógio só avança ao VIAJAR entre nós; dentro do local, congela.
    localidadeAtual: null, // definido ao iniciar a investigação
    nosDesbloqueados: caso.nosMapa.filter((n) => n.desbloqueadoInicio).map((n) => n.id),
    nosNovos: [], // nós revelados por lead e ainda não visitados (destaque na mesa)

    // ---------------- Mesa e registros ----------------
    cartasRegistradas: [],
    conclusoes: [],
    // Eco do legista sobre a falha (FASE 6): conclusão de id estável (origem
    // 'mestre') derivada do veredicto que caiu, na retentativa. null enquanto
    // não houve queda a comentar. Reanexada a `conclusoes` a cada exame para
    // sobreviver ao registro de novas cartas. Dado de UI — o motor não lê.
    ecoMestreFalha: null,
    log: [],
    temperaturaMedida: null,
    posicoesCartas: {},
    nosVisitados: [], // para o retrato da investigação (epílogo)
    // Estado de navegação dos interrogatórios em diálogo (§7.1): por suspeito,
    // os nós de fala já visitados. Dado PURO serializável (só marca "já
    // perguntado" na UI) — não move o relógio e o motor jamais o lê. Reler nós
    // já visitados é livre (relógio mole).
    nosVisitadosDialogo: {}, // { [suspeitoId]: [noId, ...] }
    // Nó de fala CORRENTE de cada interrogatório (§7.2): a árvore agora é
    // SEQUENCIAL e sem volta — o perito escolhe um dos quatro tons e a
    // conversa desce, sem reoferecer os irmãos. Por isso o nó corrente
    // PRECISA persistir (reabrir retoma onde parou, não recomeça): a
    // escolha é definitiva. Dado puro de UI — o motor jamais o lê.
    noAtualDialogo: {}, // { [suspeitoId]: noId }
    // Provas já apresentadas em cena, por interrogado (Onda 5): estado
    // "feito" do seletor "Apresentar uma prova…". Dado puro de UI —
    // o motor não lê. { [suspeitoId]: [cartaId, ...] }
    provasApresentadas: {},
    // SEMENTE §7.3 (INERTE): a mecânica futura de "confrontar faz o personagem
    // AGIR" — mexer com as provas no mapa, fora do olhar do perito, ou chegar
    // à cena ao mesmo tempo que ele (concomitância). HOJE nada disto executa:
    // registrarConfronto só anota o evento; estadosSuspeito fica em 'presente';
    // o relógio não anda e nenhum nó do mapa muda. Fica pronta para ligar
    // quando o design amadurecer (ver MORTEM_CONTEXTO.md §7.3 e CONSEQUENCIAS_
    // CONFRONTO em src/data/confrontos.js). O motor de veredicto jamais lê.
    estadosSuspeito: {}, // { [suspeitoId]: 'presente'|'agitado'|'ausente' }
    eventosConfronto: [], // [{ suspeitoId, cartaId, consequencia, hora }]
    // #5 — a escolha ATIVA do meio da investigação: duas horas se
    // contradizem (o corpo × o avistamento do padeiro) e o perito firma de
    // qual partir ANTES de seguir. Irreversível e narrativa: registra a
    // hipótese de trabalho, mas NÃO toca o veredicto (o mural decide). Dado
    // puro de UI — o motor não lê. null | 'relato' | 'corpo'.
    escolhaContradicao: null,
    // FASE 4 (interferência): eventos contingentes do pacote JÁ DISPARADOS.
    // O runtime não decide nada — verifica gatilhos materializados no pacote
    // (dispararInterferencias) e aplica o efeito. `evitada` = o gatilho
    // disparou com a evidência-alvo já registrada (quem chega primeiro não a
    // perde). Sem `interferencias` no pacote (o tutorial), fica sempre [].
    // O motor de veredicto jamais lê. [{ id, hora, evitada }]
    interferenciasDisparadas: [],
    // FASE 4: o eco do legista PÓS-CASO sobre interferências ocorridas/
    // evitadas (mesmo mecanismo do eco de falha, FASE 6). Derivado em
    // submeterAcusacao; reanexado às conclusões a cada consolidação.
    ecoInterferencias: [],
    nSubmissoes: 0, // acusações levadas a julgamento (a retentativa custa horas)
    // Reincidência POR CÓDIGO de falha do veredicto (dado de UI: a cortesia
    // do tutorial escala a dica na segunda queda no MESMO ponto; o motor
    // não lê). { [codigo]: vezes }
    falhasVistas: {},
    // Modo purista (Onda 8): cala a SÍNTESE do legista (janela/mecanismo) na
    // Caderneta e no exame — o jogador purista chega sozinho à leitura. Flag
    // de UI, persistida; o motor jamais a lê (guarda no qa.mjs). Os apartes
    // vozMestre por carta ficam (são observação diegética, não conclusão).
    modoPurista: false,
    somAtivo: true, // efeitos sonoros da mesa (papel, sino, barbante, lacre, pena)

    // ---------------- Overlay ativo (a mesa nunca sai do DOM) ----------------
    overlay: null, // { tipo: 'localidade'|'caderneta'|'glossario'|'alibis'|'acusacao'|'monologo', id }

    // ---------------- A Ficha de Coleta (§6.2) ----------------
    // Camada de UI separada do overlay: a ficha da evidência se sobrepõe ao
    // local/mesa/caderneta/mural (empilha por cima). Guarda só o id da carta —
    // dado puro; a ficha lê a carta já registrada em cartasRegistradas.
    fichaAberta: null, // cartaId | null

    veredicto: null,

    // ---------------- A Construção da Acusação (a cadeia) ----------------
    // O jogador AFIRMA (réu, janela, causa, motivo, juízos) e SUSTENTA ligando
    // cartas (os "barbantes"). O significado de cada ligação é derivado das tags
    // (ver src/logic/acusacao.js).
    acusacao: {
      reuId: null,
      janela: { inicio: null, fim: null }, // afirmada pelo jogador (escala absoluta)
      causaId: null, // id do catálogo universal de causas
      motivacaoId: null, // carta de móbil ligada ao réu
      juizos: {}, // { [suspeitoId]: 'culpado' | 'inocente' | 'sem_juizo' }
      ligacoes: [], // [{ id, de, para }] — de/para são id de carta OU âncora
    },
  };
}

// Whitelist do que vai ao save (partialize): exatamente as chaves do factory.
// Campos transientes futuros ficam fora por construção — só entra no save o
// que nasce em estadoInicialCaso().
const CAMPOS_SALVOS = Object.keys(estadoInicialCaso());

// O qa.mjs importa este módulo em Node, onde não há localStorage: o save
// cai num armazenamento nulo (nada persiste, nada quebra). No navegador,
// localStorage é síncrono — a hidratação acontece antes do primeiro render.
const armazenamentoNulo = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

export const useJogo = create(
  persist(
    (set, get) => ({
  ...estadoInicialCaso(),

  // Última carta que POUSOU sem abrir ficha (Onda 4): alimenta o aviso de
  // pouso e o destaque da carta na mesa. Transiente de UI — declarado fora
  // do factory de propósito, para ficar FORA do save (partialize).
  ultimaCartaPousada: null,

  // =====================================================================
  // Ações
  // =====================================================================

  // "Recomeçar do princípio" / "Fechar o caderno": apaga o save e devolve a
  // mesa ao estado de arranque. As ações permanecem (o set é merge).
  reiniciarCaso: () => {
    useJogo.persist.clearStorage();
    set({ ...estadoInicialCaso(), ultimaCartaPousada: null });
  },

  // Carrega um pacote de caso (o contrato de saída do gerador): troca o caso
  // corrente no módulo de dados e devolve a mesa ao arranque desse caso. Toda
  // leitura de caso (estadoInicialCaso, extração, exame, veredicto) passa a
  // sair do pacote carregado. Hoje só o caso-escola existe; a ação já deixa a
  // porta pronta para o procedural (FASE 7). Apaga o save (o caso mudou).
  carregarCaso: (pacote) => {
    aplicarCasoNoModulo(pacote);
    useJogo.persist.clearStorage();
    set({ ...estadoInicialCaso(), ultimaCartaPousada: null });
  },

  escolherDetective: () =>
    set({ detective: buildDetective(), faseJogo: 'abertura', passoAbertura: 0 }),

  avancarAbertura: () => set((s) => ({ passoAbertura: s.passoAbertura + 1 })),

  iniciarInvestigacao: () =>
    set((s) => ({
      faseJogo: 'investigacao',
      localidadeAtual: 'cena', // o perito chega à cena (a relojoaria) às 11h
      nosVisitados: ['cena'],
      nosVisitadosDialogo: {},
      noAtualDialogo: {},
      estadosSuspeito: {},
      eventosConfronto: [],
      escolhaContradicao: null,
      interferenciasDisparadas: [],
      ecoInterferencias: [],
      log: [
        ...s.log,
        { hora: s.horasJogo, texto: 'Investigação iniciada na cena, às 11h00 de 14 de outubro.' },
      ],
    })),

  alternarSom: () => set((s) => ({ somAtivo: !s.somAtivo })),

  // Liga/desliga o modo purista. A leitura do mestre CONTINUA consolidando
  // por baixo (dado fica) — desligar o modo religa tudo sem estado perdido.
  alternarModoPurista: () => set((s) => ({ modoPurista: !s.modoPurista })),

  registrarLog: (texto) =>
    set((s) => ({ log: [...s.log, { hora: s.horasJogo, texto }] })),

  moverCarta: (id, x, y) =>
    set((s) => ({ posicoesCartas: { ...s.posicoesCartas, [id]: { x, y } } })),

  abrirOverlay: (tipo, id = null) => set({ overlay: { tipo, id } }),
  fecharOverlay: () => set({ overlay: null }),

  // A ficha de coleta (§6.2): abre a evidência já registrada em leitura,
  // por cima de onde o jogador estiver. Custa zero (é consulta).
  abrirFicha: (cartaId) => set({ fichaAberta: cartaId }),
  fecharFicha: () => set({ fichaAberta: null }),

  // Marca um nó de fala como visitado num interrogatório em diálogo (§7.1).
  // Custo zero (navegar dentro do local congela o relógio, como examinar):
  // só registra o "já perguntado" para a UI. Idempotente e determinístico.
  visitarNoDialogo: (suspeitoId, noId) =>
    set((s) => {
      const jaVistos = s.nosVisitadosDialogo[suspeitoId] || [];
      if (jaVistos.includes(noId)) return {};
      return {
        nosVisitadosDialogo: { ...s.nosVisitadosDialogo, [suspeitoId]: [...jaVistos, noId] },
      };
    }),

  // Fixa o nó de fala corrente de um interrogatório (§7.2). A árvore é
  // sequencial e sem volta: gravar o nó torna a escolha definitiva entre
  // sessões (reabrir retoma aqui). Custo zero (relógio mole); o motor não lê.
  definirNoDialogo: (suspeitoId, noId) =>
    set((s) => ({ noAtualDialogo: { ...s.noAtualDialogo, [suspeitoId]: noId } })),

  // Apresentar uma prova em cena (§7.1, Onda 5). Custo zero (interrogar é
  // relógio mole). Registra o "já apresentada" e, quando a carta desmente o
  // paradeiro do PRÓPRIO interrogado (função pura ligacaoDeConfrontoEmCena,
  // só tags), ANOTA a ligação ao mural — a mesma refuta_alibi que o barbante
  // criaria, nascendo visível e removível; juízos seguem 100% manuais.
  apresentarProva: (suspeitoId, cartaId) => {
    const s = get();
    const ja = s.provasApresentadas[suspeitoId] || [];
    if (!ja.includes(cartaId)) {
      set({
        provasApresentadas: { ...s.provasApresentadas, [suspeitoId]: [...ja, cartaId] },
      });
    }
    const carta = s.cartasRegistradas.find((c) => c.id === cartaId);
    const par = ligacaoDeConfrontoEmCena(carta, suspeitoId, s.cartasRegistradas);
    if (!par) return;
    const jaLigada = s.acusacao.ligacoes.some(
      (l) => (l.de === par[0] && l.para === par[1]) || (l.de === par[1] && l.para === par[0])
    );
    get().adicionarLigacao(par[0], par[1]);
    if (!jaLigada) get().registrarLog('O confronto ficou anotado ao mural.');
    // FASE 4: o confronto em cena é ação observável (gatilho possível).
    get().dispararInterferencias();
  },

  // #5 — firma a escolha da contradição de horas (irreversível). Registra a
  // hipótese de trabalho e anota o diário; NÃO toca o veredicto (o mural
  // decide). Custo zero (reflexão, não viagem). Idempotente: uma vez firmada,
  // não se refaz — a decisão é para valer.
  resolverContradicao: (escolha) =>
    set((s) => {
      if (s.escolhaContradicao || (escolha !== 'relato' && escolha !== 'corpo')) return {};
      const texto =
        escolha === 'corpo'
          ? 'Firmei-me: parto do que o corpo diz; o relato que o desminta que se explique.'
          : 'Firmei-me: parto do relato do moço do padeiro; que o corpo se explique depois.';
      return {
        escolhaContradicao: escolha,
        log: [...s.log, { hora: s.horasJogo, texto }],
      };
    }),

  // SEMENTE §7.3 (STUB, INERTE): registra que um confronto PODERIA fazer o
  // suspeito agir (consequencia vem de CONSEQUENCIAS_CONFRONTO, enum). HOJE
  // apenas ANOTA o evento — não muda estadosSuspeito, não move o relógio, não
  // altera a disponibilidade de nós. Ninguém a chama ainda (nem apresentarProva):
  // é a estrutura pronta para o executor futuro (ver MORTEM_CONTEXTO.md §7.3). A
  // hora gravada é o relógio do jogo (determinístico) — nunca Date.now().
  registrarConfronto: (suspeitoId, cartaId, consequencia) =>
    set((s) => ({
      eventosConfronto: [
        ...s.eventosConfronto,
        { suspeitoId, cartaId, consequencia, hora: s.horasJogo },
      ],
    })),

  // Viagem entre nós do mapa: a ÚNICA ação que avança o relógio. Dentro de
  // um local o tempo congela. O custo (horas) vem de src/data/mapa.js.
  // Reabrir o local onde já se está custa 0.
  viajarPara: (noId) => {
    const s = get();
    if (!s.nosDesbloqueados.includes(noId)) return;
    const custo = s.localidadeAtual ? custoViagem(s.localidadeAtual, noId) : 0;
    const visitados = s.nosVisitados.includes(noId) ? s.nosVisitados : [...s.nosVisitados, noId];
    if (noId === s.localidadeAtual || custo === 0) {
      // Mesmo sem custo, visitar o nó consome o destaque "novo" — um nó
      // revelado por lead no mesmo grupo não pode continuar aceso após visto.
      set({
        localidadeAtual: noId,
        nosVisitados: visitados,
        nosNovos: s.nosNovos.filter((id) => id !== noId),
      });
      // FASE 4: visitar um nó também é ação observável (gatilho possível).
      get().dispararInterferencias();
      return;
    }
    const no = obterNo(noId);
    set({
      localidadeAtual: noId,
      nosVisitados: visitados,
      horasJogo: s.horasJogo + custo,
      nosNovos: s.nosNovos.filter((id) => id !== noId),
      log: [
        ...s.log,
        {
          hora: s.horasJogo + custo,
          texto: `Deslocou-se para ${no ? no.rotulo : noId} (${formatDuracao(custo)} de viagem).`,
        },
      ],
    });
    // FASE 4: a viagem em público é ação observável (gatilho possível).
    get().dispararInterferencias();
  },

  // Extração (§6): clicar no negrito registra a carta. Examinar é de graça
  // (relógio mole) — o tempo só anda ao VIAJAR. O estado da evidência
  // (degradação) é o do IPM no momento do clique.
  extrairCarta: (cartaId, opcoes = {}) => {
    const s = get();
    if (s.cartasRegistradas.some((c) => c.id === cartaId)) return;
    const definicao = obterDefinicaoCarta(cartaId);
    if (!definicao) return;
    // FASE 4 — os dois gates da interferência (inertes sem `interferencias`
    // no pacote, como no tutorial):
    //   • vestígio NOVO de evento ainda não disparado não existe na cena;
    //   • evidência destruída por evento disparado (e não evitado) perdeu-se.
    const eventosIntf = obterInterferencias();
    if (eventosIntf.length > 0) {
      const disparadas = new Map(s.interferenciasDisparadas.map((d) => [d.id, d]));
      const aindaNaoExiste = eventosIntf.some(
        (ev) => !disparadas.has(ev.id) && (ev.efeito?.cartasNovas || []).includes(cartaId)
      );
      const perdida = eventosIntf.some((ev) => {
        const disparo = disparadas.get(ev.id);
        return disparo && !disparo.evitada && ev.efeito?.cartaDestruida === cartaId;
      });
      if (aindaNaoExiste || perdida) return;
    }
    const caso = obterCaso();
    const ipm = ipmAtual(s.horasJogo, caso.verdadeDeOuro.horasMorteAntesChegada, caso.parametrosCena.horasChegada);
    const estado = resolverEstadoCarta(definicao, ipm);
    // Resource binding (FASE 4): os campos de texto da carta passam por
    // interpolar no ato da extração — é o ponto de resolução único da carta
    // registrada (Ficha, Mural e log leem daqui). Sem slots, byte-idêntico.
    const carta = {
      id: definicao.id,
      localidade: definicao.localidade,
      textoDisplay: interpolar(estado.textoDisplay, s.detective),
      termoCarimbo: interpolar(estado.carimboPadrao, s.detective),
      descricao: interpolar(estado.descricao, s.detective),
      vozMestre: estado.vozMestre, // fala do mestre sobre esta observação (só na campanha)
      tagsOcultas: estado.tagsOcultas,
      horaRegistro: s.horasJogo,
    };
    // Examinar é de graça e CONGELA o relógio (relógio mole): o tempo só
    // corre ao viajar. Aqui apenas registramos a carta — sem custo de tempo.
    // Leads: certas cartas revelam novos nós no mapa ao serem extraídas.
    // O desbloqueio é anunciado no diário e destacado na mesa (nosNovos),
    // para o jogador não perder o mapa crescendo enquanto lê um overlay.
    const lead = caso.leads.find((l) => l.cartaId === definicao.id);
    const revelou = lead && !s.nosDesbloqueados.includes(lead.revelaNo);
    const nosDesbloqueados = revelou ? [...s.nosDesbloqueados, lead.revelaNo] : s.nosDesbloqueados;
    const log = [...s.log, { hora: s.horasJogo, texto: `Registrado: ${carta.termoCarimbo}.` }];
    if (revelou) {
      const noRevelado = obterNo(lead.revelaNo);
      log.push({
        hora: s.horasJogo,
        texto: `Novo destino no mapa: ${noRevelado ? noRevelado.rotulo : lead.revelaNo}. ${lead.nota || ''}`.trim(),
      });
    }
    // #5 — a contradição de horas (o corpo × o avistamento do padeiro):
    // quando o par se completa na mesa, o diário aponta o ponto a decidir na
    // caderneta (o perito ainda não escolheu). Dispara UMA vez, na transição.
    const idsDepois = [...s.cartasRegistradas.map((c) => c.id), carta.id];
    const CORPO_HORA = ['ev_rigor', 'ev_livores'];
    const parCompletoAgora =
      idsDepois.includes('dep_avistamento_padeiro') && idsDepois.some((id) => CORPO_HORA.includes(id));
    const parCompletoAntes =
      s.cartasRegistradas.some((c) => c.id === 'dep_avistamento_padeiro') &&
      s.cartasRegistradas.some((c) => CORPO_HORA.includes(c.id));
    if (parCompletoAgora && !parCompletoAntes && !s.escolhaContradicao) {
      log.push({
        hora: s.horasJogo,
        texto: 'Duas horas se contradizem: o corpo e o moço do padeiro. Há um ponto a decidir na caderneta.',
      });
    }
    // Só a PRIMEIRA evidência do caso se apresenta em ficha (aprende-se o
    // gesto); as demais pousam sozinhas na mesa, anunciadas pelo aviso de
    // pouso — o arquivamento deixou de ser um clique obrigatório (Onda 4;
    // o playtest contou ~72 cliques mortos de "Arquivar").
    const primeiraDoCaso = s.cartasRegistradas.length === 0;
    set({
      cartasRegistradas: [...s.cartasRegistradas, carta],
      nosDesbloqueados,
      nosNovos: revelou ? [...s.nosNovos, lead.revelaNo] : s.nosNovos,
      log,
      fichaAberta: primeiraDoCaso ? carta.id : s.fichaAberta,
      ultimaCartaPousada: primeiraDoCaso ? null : carta.id,
    });
    // O mestre relê o corpo e atualiza, de cabeça, a leitura de quando/como.
    get().consolidarLeituraMestre();
    // FASE 4: a extração é ação OBSERVÁVEL (o depoimento tomado em público,
    // o registro consultado) — verifica gatilhos de interferência do pacote.
    get().dispararInterferencias();
  },

  // FASE 4 — runtime MÍNIMO da interferência: nenhuma decisão nova aqui.
  // Percorre os eventos contingentes do pacote e, para os ainda não
  // disparados, verifica se o gatilho JÁ MATERIALIZADO se cumpriu no estado
  // (carta extraída / nó visitado / prova apresentada — sempre ações
  // observáveis do jogador, R3). Ao disparar, apenas ANOTA: o efeito
  // (evidência destruída indisponível; vestígios novos disponíveis) é
  // aplicado pelos gates de extrairCarta. `evitada` = a evidência-alvo já
  // estava registrada quando o gatilho caiu. Sem eventos no pacote, no-op.
  dispararInterferencias: () => {
    const s = get();
    const eventos = obterInterferencias();
    if (eventos.length === 0) return;
    const ja = new Set(s.interferenciasDisparadas.map((d) => d.id));
    const registradas = new Set(s.cartasRegistradas.map((c) => c.id));
    const novas = [];
    const logs = [];
    for (const ev of eventos) {
      if (ja.has(ev.id)) continue;
      const g = ev.gatilho || {};
      const disparou =
        (g.tipo === 'extracao_carta' && registradas.has(g.cartaId)) ||
        (g.tipo === 'visita_local' && s.nosVisitados.includes(g.noId)) ||
        (g.tipo === 'prova_apresentada' && (s.provasApresentadas[g.suspeitoId] || []).length > 0);
      if (!disparou) continue;
      const evitada = !!ev.efeito?.cartaDestruida && registradas.has(ev.efeito.cartaDestruida);
      novas.push({ id: ev.id, hora: s.horasJogo, evitada });
      logs.push({
        hora: s.horasJogo,
        texto: ev.anuncio || 'Alguma coisa se moveu na vila desde a última visita.',
      });
    }
    if (novas.length === 0) return;
    set({
      interferenciasDisparadas: [...s.interferenciasDisparadas, ...novas],
      log: [...s.log, ...logs],
    });
  },

  // Ação especial do Termômetro: gera a carta de algor mortis a partir da
  // temperatura corrente. O modelo (37°C, ~1°C/h, ambiente) mora INTEIRO em
  // src/logic/tempo_morte.js — aqui só se consome temperaturaPorIpm e o
  // ambiente do pacote (parametrosCena.ambiente), nunca números repetidos
  // (§15: ajuste num ponto só).
  medirTemperatura: () => {
    const s = get();
    if (s.temperaturaMedida !== null) return;
    const caso = obterCaso();
    const ambiente = caso.parametrosCena.ambiente;
    const ipm = ipmAtual(s.horasJogo, caso.verdadeDeOuro.horasMorteAntesChegada, caso.parametrosCena.horasChegada);
    const temperatura = temperaturaPorIpm(ipm, ambiente);
    let carta;
    if (temperatura <= ambiente) {
      carta = {
        id: 'ev_algor',
        localidade: 'corpo',
        textoDisplay: 'Corpo Frio como a Sala',
        termoCarimbo: 'Corpo tão frio quanto a sala',
        descricao: `O termômetro marca os ${formatTemperatura(ambiente)} do próprio escritório: o corpo esfriou até igualar a sala. Isso já não aperta a hora — diz só que a morte foi há mais de um dia.`,
        vozMestre: 'Frio como a sala. O calor já não conta as horas — só diz que faz tempo.',
        // Equilíbrio: leitura VAGA, não nula. Carrega a temperatura medida
        // (== ambiente); o modelo devolve um piso largo (perde precisão).
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'algor_mortis',
          temperaturaCorpo: temperatura,
          temperaturaAmbiente: ambiente,
        },
        horaRegistro: s.horasJogo,
      };
    } else {
      carta = {
        id: 'ev_algor',
        localidade: 'corpo',
        textoDisplay: `Corpo Ainda Morno: ${formatTemperatura(temperatura)}`,
        termoCarimbo: `Corpo a ${formatTemperatura(temperatura)} (sala a ${formatTemperatura(ambiente)})`,
        // A carta entrega só a LEITURA (temperaturas); a aritmética do
        // resfriamento é do jogador, com o verbete de algor do Glossário (Q9).
        descricao: `O mercúrio detém-se nos ${formatTemperatura(temperatura)}, contra ${formatTemperatura(ambiente)} do escritório. Um corpo vivo marcaria ${CONSTANTES_FORENSES.temperaturaInicial}.`,
        vozMestre: 'Ainda morno. O calor que perdeu conta as horas — um grau a cada uma delas.',
        // Carrega a leitura BRUTA (temperatura medida + ambiente); a janela
        // é calculada pelo modelo forense universal na gaveta Cronos.
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'algor_mortis',
          temperaturaCorpo: temperatura,
          temperaturaAmbiente: ambiente,
        },
        horaRegistro: s.horasJogo,
      };
    }
    // Medir a temperatura é exame, não viagem: não custa tempo (relógio mole).
    // Mesma regra de pouso da extração (Onda 4): ficha só na primeira do caso.
    const primeiraDoCaso = s.cartasRegistradas.length === 0;
    set({
      temperaturaMedida: temperatura,
      cartasRegistradas: [...s.cartasRegistradas, carta],
      log: [...s.log, { hora: s.horasJogo, texto: `Registrado: ${carta.termoCarimbo}.` }],
      fichaAberta: primeiraDoCaso ? carta.id : s.fichaAberta,
      ultimaCartaPousada: primeiraDoCaso ? null : carta.id,
    });
    get().consolidarLeituraMestre();
    get().dispararInterferencias();
  },

  // O legista relê o corpo e FALA a leitura de quando/como (a "dica"): faz
  // upsert de duas conclusões de id estável (origem 'mestre'), exibidas na
  // Caderneta. NÃO vincula o veredicto — quem afirma a cadeia é o jogador.
  consolidarLeituraMestre: () => {
    const s = get();
    const base = s.conclusoes.filter((c) => c.origem !== 'mestre');
    // O eco da falha (FASE 6) também é conclusão do mestre: reanexa-se aqui
    // para que registrar nova carta não o apague junto com a síntese. O eco
    // de interferência (FASE 4) segue a mesma regra.
    const eco = s.ecoMestreFalha ? [s.ecoMestreFalha] : [];
    set({
      conclusoes: [...base, ...conclusoesDoMestre(s.cartasRegistradas), ...eco, ...(s.ecoInterferencias || [])],
    });
  },

  // ---------------- Ações da Construção da Acusação ----------------
  // As afirmações estruturadas são campos diretos; as sustentações e
  // refutações são ligações (os "barbantes"). Nada valida até o commit.
  definirReu: (id) =>
    set((s) => ({
      acusacao: { ...s.acusacao, reuId: s.acusacao.reuId === id ? null : id, motivacaoId: null },
    })),

  definirJanela: (janela) =>
    set((s) => ({ acusacao: { ...s.acusacao, janela: { ...s.acusacao.janela, ...janela } } })),

  definirCausa: (id) =>
    set((s) => ({ acusacao: { ...s.acusacao, causaId: s.acusacao.causaId === id ? null : id } })),

  definirMotivacao: (id) =>
    set((s) => ({
      acusacao: { ...s.acusacao, motivacaoId: s.acusacao.motivacaoId === id ? null : id },
    })),

  definirJuizo: (suspeitoId, valor) =>
    set((s) => ({
      acusacao: { ...s.acusacao, juizos: { ...s.acusacao.juizos, [suspeitoId]: valor } },
    })),

  // Desenhar um barbante entre dois nós (cartas ou âncoras). Ignora duplicatas
  // (o mesmo par, em qualquer ordem). Devolve a ligação (ou a já existente).
  // O id é derivado do PAR NORMALIZADO (extremos em ordem lexicográfica):
  // determinístico, sem estado de módulo — sobrevive a um futuro "novo caso".
  adicionarLigacao: (de, para) => {
    const s = get();
    const jaExiste = s.acusacao.ligacoes.find(
      (l) => (l.de === de && l.para === para) || (l.de === para && l.para === de)
    );
    if (jaExiste) return jaExiste;
    const [menor, maior] = [de, para].sort();
    const nova = { id: `ligacao_${menor}__${maior}`, de, para };
    set({ acusacao: { ...s.acusacao, ligacoes: [...s.acusacao.ligacoes, nova] } });
    return nova;
  },

  removerLigacao: (id) =>
    set((s) => ({
      acusacao: { ...s.acusacao, ligacoes: s.acusacao.ligacoes.filter((l) => l.id !== id) },
    })),

  // Levar a acusação construída a julgamento. Só aqui o motor julga a cadeia
  // contra a Verdade de Ouro (calcularVeredictoCadeia).
  submeterAcusacao: () => {
    const s = get();
    const veredicto = calcularVeredictoCadeia(s.acusacao, s.cartasRegistradas, obterCaso().verdadeDeOuro);
    // Conta a queda em cada ponto (código único por submissão): na segunda
    // queda no mesmo ponto, a dica do tutorial fica mais específica.
    const falhasVistas = { ...s.falhasVistas };
    for (const codigo of new Set(veredicto.falhas.map((f) => f.codigo))) {
      falhasVistas[codigo] = (falhasVistas[codigo] || 0) + 1;
    }
    // FASE 4 — o eco PÓS-CASO sobre interferências ocorridas/evitadas
    // (mesmo mecanismo dos códigos de falha). Determinístico; sem
    // `ecosInterferencia` no pacote (o tutorial), devolve [] e nada muda.
    const ecoInterferencias = derivarEcosInterferencia(
      obterInterferencias(),
      s.interferenciasDisparadas,
      obterEcosInterferencia(),
      `${obterCaso().id}|${(s.detective && s.detective.name) || ''}`
    );
    set({
      veredicto,
      falhasVistas,
      ecoInterferencias,
      nSubmissoes: s.nSubmissoes + 1,
      overlay: { tipo: 'monologo', id: null },
      log: [...s.log, { hora: s.horasJogo, texto: 'Acusação levada a julgamento.' }],
    });
    // Reanexa o eco às conclusões do mestre na Caderneta.
    get().consolidarLeituraMestre();
  },

  fecharVeredicto: () => set({ veredicto: null, overlay: null }),

  // Retentativa do caso-escola (Q2): revisar a acusação depois de um desfecho
  // custa horas — a audiência adia-se. A mesa fica intacta; o relógio, não.
  // O perecível ainda não colhido continua degradando nesse intervalo.
  revisarAcusacao: () => {
    const s = get();
    // FASE 6 — o eco do mestre: da falha que acabou de cair, o legista ganha
    // UMA fala na Caderneta (leitura de método, nunca autoria). Determinístico:
    // varia por caso e por perito, como o monólogo. Sem `ecosDoMestre` no
    // pacote (procedural), derivarEcoDoMestre devolve null e não há eco.
    const eco = derivarEcoDoMestre(
      s.veredicto,
      obterEcosDoMestre(),
      `${obterCaso().id}|${(s.detective && s.detective.name) || ''}`
    );
    set({
      veredicto: null,
      overlay: { tipo: 'acusacao', id: null },
      horasJogo: s.horasJogo + CUSTO_REVISAO,
      ecoMestreFalha: eco,
      log: [
        ...s.log,
        {
          hora: s.horasJogo + CUSTO_REVISAO,
          texto: `A audiência adiou-se em ${formatDuracao(CUSTO_REVISAO)} para a revisão da acusação.`,
        },
      ],
    });
    // Reanexa o eco às conclusões do mestre na Caderneta.
    get().consolidarLeituraMestre();
  },
    }),
    {
      // Auto-save contínuo (P0 do playtest): cada set grava o caso inteiro.
      // Um F5, uma queda de bateria ou a aba descartada não perdem a partida.
      name: 'mortem-caso-tutorial',
      version: 1,
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' && window.localStorage ? window.localStorage : armazenamentoNulo
      ),
      partialize: (s) => Object.fromEntries(CAMPOS_SALVOS.map((k) => [k, s[k]])),
      // Save de versão estranha é descartado (o caso-escola recomeça limpo);
      // devolver undefined faz o persist ignorar o armazenado.
      migrate: (estado, versao) => (versao === 1 ? estado : undefined),
    }
  )
);
