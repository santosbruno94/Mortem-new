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
import { SEED_TUTORIAL } from '../data/seed.js';
import { obterDefinicaoCarta, resolverEstadoCarta } from '../data/cartas.js';
import { NOS_MAPA, LEADS_DESBLOQUEIO, custoViagem, obterNo } from '../data/mapa.js';
import { HORAS_CHEGADA_CENA, ipmAtual, formatDuracao, formatTemperatura } from '../logic/tempo.js';
import { temperaturaPorIpm, AMBIENTE_PADRAO, CONSTANTES_FORENSES } from '../logic/tempo_morte.js';
import { calcularVeredictoCadeia } from '../logic/veredicto.js';
import { conclusoesDoMestre } from '../logic/falaDoMestre.js';

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
  return {
    // ---------------- Fases e personagem ----------------
    faseJogo: 'selecao', // 'selecao' → 'abertura' → 'investigacao'
    detective: null,
    passoAbertura: 0,

    // ---------------- Relógio ----------------
    horasJogo: HORAS_CHEGADA_CENA,
    horasChegadaCena: HORAS_CHEGADA_CENA,

    // ---------------- Mapa (o "dia do perito") ----------------
    // O relógio só avança ao VIAJAR entre nós; dentro do local, congela.
    localidadeAtual: null, // definido ao iniciar a investigação
    nosDesbloqueados: NOS_MAPA.filter((n) => n.desbloqueadoInicio).map((n) => n.id),
    nosNovos: [], // nós revelados por lead e ainda não visitados (destaque na mesa)

    // ---------------- Mesa e registros ----------------
    cartasRegistradas: [],
    conclusoes: [],
    log: [],
    temperaturaMedida: null,
    posicoesCartas: {},
    nosVisitados: [], // para o retrato da investigação (epílogo)
    // Estado de navegação dos interrogatórios em diálogo (§7.1): por suspeito,
    // os nós de fala já visitados. Dado PURO serializável (só marca "já
    // perguntado" na UI) — não move o relógio e o motor jamais o lê. Reler nós
    // já visitados é livre (relógio mole).
    nosVisitadosDialogo: {}, // { [suspeitoId]: [noId, ...] }
    nSubmissoes: 0, // acusações levadas a julgamento (a retentativa custa horas)
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

  // =====================================================================
  // Ações
  // =====================================================================

  // "Recomeçar do zero" / "Fechar o caderno": apaga o save e devolve a mesa
  // ao estado de arranque. As ações permanecem (o set é merge, não replace).
  reiniciarCaso: () => {
    useJogo.persist.clearStorage();
    set(estadoInicialCaso());
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
      log: [
        ...s.log,
        { hora: s.horasJogo, texto: 'Investigação iniciada na cena, às 11h00 de 14 de outubro.' },
      ],
    })),

  alternarSom: () => set((s) => ({ somAtivo: !s.somAtivo })),

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
  },

  // Extração (§6): clicar no negrito registra a carta. Examinar é de graça
  // (relógio mole) — o tempo só anda ao VIAJAR. O estado da evidência
  // (degradação) é o do IPM no momento do clique.
  extrairCarta: (cartaId, opcoes = {}) => {
    const s = get();
    if (s.cartasRegistradas.some((c) => c.id === cartaId)) return;
    const definicao = obterDefinicaoCarta(cartaId);
    if (!definicao) return;
    const ipm = ipmAtual(s.horasJogo, SEED_TUTORIAL.horasMorteAntesChegada);
    const estado = resolverEstadoCarta(definicao, ipm);
    const carta = {
      id: definicao.id,
      localidade: definicao.localidade,
      textoDisplay: estado.textoDisplay,
      termoCarimbo: estado.carimboPadrao,
      descricao: estado.descricao,
      vozMestre: estado.vozMestre, // fala do mestre sobre esta observação (só na campanha)
      tagsOcultas: estado.tagsOcultas,
      horaRegistro: s.horasJogo,
    };
    // Examinar é de graça e CONGELA o relógio (relógio mole): o tempo só
    // corre ao viajar. Aqui apenas registramos a carta — sem custo de tempo.
    // Leads: certas cartas revelam novos nós no mapa ao serem extraídas.
    // O desbloqueio é anunciado no diário e destacado na mesa (nosNovos),
    // para o jogador não perder o mapa crescendo enquanto lê um overlay.
    const lead = LEADS_DESBLOQUEIO.find((l) => l.cartaId === definicao.id);
    const revelou = lead && !s.nosDesbloqueados.includes(lead.revelaNo);
    const nosDesbloqueados = revelou ? [...s.nosDesbloqueados, lead.revelaNo] : s.nosDesbloqueados;
    const log = [...s.log, { hora: s.horasJogo, texto: `Registrado: ${estado.carimboPadrao}.` }];
    if (revelou) {
      const noRevelado = obterNo(lead.revelaNo);
      log.push({
        hora: s.horasJogo,
        texto: `Novo destino no mapa: ${noRevelado ? noRevelado.rotulo : lead.revelaNo}. ${lead.nota || ''}`.trim(),
      });
    }
    set({
      cartasRegistradas: [...s.cartasRegistradas, carta],
      nosDesbloqueados,
      nosNovos: revelou ? [...s.nosNovos, lead.revelaNo] : s.nosNovos,
      log,
      // A evidência se apresenta no ato: a ficha de coleta abre sobre o
      // local (§6.2). Fechá-la ("Arquivar na mesa") devolve a carta à mesa.
      fichaAberta: carta.id,
    });
    // O mestre relê o corpo e atualiza, de cabeça, a leitura de quando/como.
    get().consolidarLeituraMestre();
  },

  // Ação especial do Termômetro: gera a carta de algor mortis a partir da
  // temperatura corrente. O modelo (37°C, ~1°C/h, ambiente) mora INTEIRO em
  // src/logic/tempo_morte.js — aqui só se consome temperaturaPorIpm e
  // AMBIENTE_PADRAO, nunca números repetidos (§15: ajuste num ponto só).
  medirTemperatura: () => {
    const s = get();
    if (s.temperaturaMedida !== null) return;
    const ipm = ipmAtual(s.horasJogo, SEED_TUTORIAL.horasMorteAntesChegada);
    const temperatura = temperaturaPorIpm(ipm, AMBIENTE_PADRAO);
    let carta;
    if (temperatura <= AMBIENTE_PADRAO) {
      carta = {
        id: 'ev_algor',
        localidade: 'corpo',
        textoDisplay: 'Corpo Frio como a Sala',
        termoCarimbo: 'Corpo tão frio quanto a sala',
        descricao: `O termômetro marca os ${formatTemperatura(AMBIENTE_PADRAO)} do próprio escritório: o corpo esfriou até igualar a sala. Isso já não aperta a hora — diz só que a morte foi há mais de um dia.`,
        vozMestre: 'Frio como a sala. O calor já não conta as horas — só diz que faz tempo.',
        // Equilíbrio: leitura VAGA, não nula. Carrega a temperatura medida
        // (== ambiente); o modelo devolve um piso largo (perde precisão).
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'algor_mortis',
          temperaturaCorpo: temperatura,
          temperaturaAmbiente: AMBIENTE_PADRAO,
        },
        horaRegistro: s.horasJogo,
      };
    } else {
      carta = {
        id: 'ev_algor',
        localidade: 'corpo',
        textoDisplay: `Corpo Ainda Morno: ${formatTemperatura(temperatura)}`,
        termoCarimbo: `Corpo a ${formatTemperatura(temperatura)} (sala a ${formatTemperatura(AMBIENTE_PADRAO)})`,
        // A carta entrega só a LEITURA (temperaturas); a aritmética do
        // resfriamento é do jogador, com o verbete de algor do Glossário (Q9).
        descricao: `O mercúrio detém-se nos ${formatTemperatura(temperatura)}, contra ${formatTemperatura(AMBIENTE_PADRAO)} do escritório. Um corpo vivo marcaria ${CONSTANTES_FORENSES.temperaturaInicial}.`,
        vozMestre: 'Ainda morno. O calor que perdeu conta as horas — um grau a cada uma delas.',
        // Carrega a leitura BRUTA (temperatura medida + ambiente); a janela
        // é calculada pelo modelo forense universal na gaveta Cronos.
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'algor_mortis',
          temperaturaCorpo: temperatura,
          temperaturaAmbiente: AMBIENTE_PADRAO,
        },
        horaRegistro: s.horasJogo,
      };
    }
    // Medir a temperatura é exame, não viagem: não custa tempo (relógio mole).
    set({
      temperaturaMedida: temperatura,
      cartasRegistradas: [...s.cartasRegistradas, carta],
      log: [...s.log, { hora: s.horasJogo, texto: `Registrado: ${carta.termoCarimbo}.` }],
      // A leitura do algor também se apresenta em ficha (§6.2).
      fichaAberta: carta.id,
    });
    get().consolidarLeituraMestre();
  },

  // O legista relê o corpo e FALA a leitura de quando/como (a "dica"): faz
  // upsert de duas conclusões de id estável (origem 'mestre'), exibidas na
  // Caderneta. NÃO vincula o veredicto — quem afirma a cadeia é o jogador.
  consolidarLeituraMestre: () => {
    const s = get();
    const base = s.conclusoes.filter((c) => c.origem !== 'mestre');
    set({ conclusoes: [...base, ...conclusoesDoMestre(s.cartasRegistradas)] });
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
    const veredicto = calcularVeredictoCadeia(s.acusacao, s.cartasRegistradas, SEED_TUTORIAL);
    set({
      veredicto,
      nSubmissoes: s.nSubmissoes + 1,
      overlay: { tipo: 'monologo', id: null },
      log: [...s.log, { hora: s.horasJogo, texto: 'Acusação levada a julgamento.' }],
    });
  },

  fecharVeredicto: () => set({ veredicto: null, overlay: null }),

  // Retentativa do caso-escola (Q2): revisar a acusação depois de um desfecho
  // custa horas — a audiência adia-se. A mesa fica intacta; o relógio, não.
  // O perecível ainda não colhido continua degradando nesse intervalo.
  revisarAcusacao: () => {
    const s = get();
    set({
      veredicto: null,
      overlay: { tipo: 'acusacao', id: null },
      horasJogo: s.horasJogo + CUSTO_REVISAO,
      log: [
        ...s.log,
        {
          hora: s.horasJogo + CUSTO_REVISAO,
          texto: `A audiência adiou-se em ${formatDuracao(CUSTO_REVISAO)} para a revisão da acusação.`,
        },
      ],
    });
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
