// =====================================================================
// Estado global do jogo (Zustand) — §16 do contexto.
//
// O relógio só avança com ações periciais (extrair, interrogar, medir
// temperatura). Gavetas, glossário, caderneta, painel de álibis e o
// Quadro custam zero. A degradação das evidências do corpo é resolvida
// no momento da extração, a partir do IPM corrente (armadilha 1).
// =====================================================================

import { create } from 'zustand';
import { SEED_TUTORIAL } from '../data/seed.js';
import { obterDefinicaoCarta, resolverEstadoCarta } from '../data/cartas.js';
import { HORAS_CHEGADA_CENA, ipmAtual } from '../logic/tempo.js';
import { calcularVeredicto } from '../logic/veredicto.js';

// Constrói o objeto detective do §12 a partir da escolha na tela inicial.
export function buildDetective(opcao) {
  if (opcao === 'lenore') {
    return { name: 'Lenore', surname: 'Blackwell', pronoun: 'ela', treatment: 'Sra.', title: 'Dr.ª' };
  }
  return { name: 'Harlan', surname: 'Blackwell', pronoun: 'ele', treatment: 'Sr.', title: 'Dr.' };
}

let proximoIdConclusao = 1;

export const useJogo = create((set, get) => ({
  // ---------------- Fases e personagem ----------------
  faseJogo: 'selecao', // 'selecao' → 'abertura' → 'investigacao'
  detective: null,
  passoAbertura: 0,

  // ---------------- Relógio ----------------
  horasJogo: HORAS_CHEGADA_CENA,
  horasChegadaCena: HORAS_CHEGADA_CENA,

  // ---------------- Mesa e registros ----------------
  cartasRegistradas: [],
  conclusoes: [],
  log: [],
  temperaturaMedida: null,
  gavetasDesbloqueadas: ['cronos'], // desbloqueio progressivo no tutorial
  posicoesCartas: {},

  // ---------------- Overlay ativo (a mesa nunca sai do DOM) ----------------
  overlay: null, // { tipo: 'localidade'|'gaveta'|'caderneta'|'glossario'|'alibis'|'quadro'|'monologo', id }

  // ---------------- Libelo e tribunal ----------------
  libelo: {
    reuId: null,
    evidenciasCorpoIds: [],
    conclusaoCronosId: null,
    conclusaoMecanismoId: null,
    conclusaoNexoId: null,
    descuidosIds: [],
    motivacaoId: null,
    perifericos: {},
  },
  veredicto: null,

  // =====================================================================
  // Ações
  // =====================================================================

  escolherDetective: (opcao) =>
    set({ detective: buildDetective(opcao), faseJogo: 'abertura', passoAbertura: 0 }),

  avancarAbertura: () => set((s) => ({ passoAbertura: s.passoAbertura + 1 })),

  iniciarInvestigacao: () =>
    set((s) => ({
      faseJogo: 'investigacao',
      log: [
        ...s.log,
        { hora: s.horasJogo, texto: 'Investigação iniciada na cena, às 11h00 de 14 de outubro.' },
      ],
    })),

  registrarLog: (texto) =>
    set((s) => ({ log: [...s.log, { hora: s.horasJogo, texto }] })),

  moverCarta: (id, x, y) =>
    set((s) => ({ posicoesCartas: { ...s.posicoesCartas, [id]: { x, y } } })),

  abrirOverlay: (tipo, id = null) => set({ overlay: { tipo, id } }),
  fecharOverlay: () => set({ overlay: null }),

  // Extração com carimbo integrado (§6): clicar no negrito avança o
  // relógio pelo custoTempo e a carta nasce registrada. O estado da
  // evidência (degradação) é o do IPM no momento do clique.
  extrairCarta: (cartaId, opcoes = {}) => {
    const s = get();
    if (s.cartasRegistradas.some((c) => c.id === cartaId)) return;
    const definicao = obterDefinicaoCarta(cartaId);
    if (!definicao) return;
    const ipm = ipmAtual(s.horasJogo, SEED_TUTORIAL.horasMorteAntesChegada);
    const estado = resolverEstadoCarta(definicao, ipm);
    const custo = opcoes.custoZero ? 0 : definicao.custoTempo;
    const carta = {
      id: definicao.id,
      localidade: definicao.localidade,
      textoDisplay: estado.textoDisplay,
      termoCarimbo: estado.carimboPadrao,
      descricao: estado.descricao,
      tagsOcultas: estado.tagsOcultas,
      horaRegistro: s.horasJogo,
    };
    set({
      cartasRegistradas: [...s.cartasRegistradas, carta],
      horasJogo: s.horasJogo + custo,
      log: [
        ...s.log,
        { hora: s.horasJogo, texto: `Registrado: ${estado.carimboPadrao}.` },
      ],
    });
  },

  // Ação especial do Termômetro: gera a carta de algor mortis a partir
  // da temperatura corrente (resfriamento ~1°C/h até o ambiente de 11°C).
  medirTemperatura: () => {
    const s = get();
    if (s.temperaturaMedida !== null) return;
    const ipm = ipmAtual(s.horasJogo, SEED_TUTORIAL.horasMorteAntesChegada);
    const temperatura = Math.max(11, 37 - ipm);
    let carta;
    if (temperatura <= 11) {
      carta = {
        id: 'ev_algor',
        localidade: 'corpo',
        textoDisplay: 'Corpo em Equilíbrio Térmico',
        termoCarimbo: 'Algor Inconclusivo',
        descricao:
          'O termômetro marca a temperatura do próprio escritório: 11°C. O corpo nada mais tem a dizer sobre horas.',
        tagsOcultas: { dominio: 'temporal', subDominio: 'algor_mortis', inconclusiva: true },
        horaRegistro: s.horasJogo,
      };
    } else {
      const horasEstimadas = 37 - temperatura;
      carta = {
        id: 'ev_algor',
        localidade: 'corpo',
        textoDisplay: `Temperatura Corporal: ${temperatura}°C`,
        termoCarimbo: `Algor Mortis: ${temperatura}°C (ambiente 11°C)`,
        descricao: `O mercúrio detém-se nos ${temperatura}°C, contra 11°C do escritório. A perda de calor, a um grau por hora, fala de ${horasEstimadas - 2} a ${horasEstimadas + 2} horas decorridas.`,
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'algor_mortis',
          valorMinimoHoras: horasEstimadas - 2,
          valorMaximoHoras: horasEstimadas + 2,
        },
        horaRegistro: s.horasJogo,
      };
    }
    set({
      temperaturaMedida: temperatura,
      cartasRegistradas: [...s.cartasRegistradas, carta],
      horasJogo: s.horasJogo + 1,
      log: [...s.log, { hora: s.horasJogo, texto: `Registrado: ${carta.termoCarimbo}.` }],
    });
  },

  // Conclusões de gaveta (custo zero). O desbloqueio progressivo do
  // tutorial acompanha o avanço: Cronos → Aitiov → Nexo.
  registrarConclusao: (conclusao) => {
    const s = get();
    const nova = { ...conclusao, id: `conclusao_${proximoIdConclusao++}` };
    const desbloqueadas = new Set(s.gavetasDesbloqueadas);
    if (nova.origem === 'cronos') desbloqueadas.add('aitiov');
    if (nova.origem === 'aitiov') desbloqueadas.add('nexo');
    set({
      conclusoes: [...s.conclusoes, nova],
      gavetasDesbloqueadas: [...desbloqueadas],
      log: [...s.log, { hora: s.horasJogo, texto: `Conclusão registrada: ${nova.titulo}.` }],
    });
    return nova;
  },

  desfazerConclusao: (id) => {
    const s = get();
    const conclusao = s.conclusoes.find((c) => c.id === id);
    if (!conclusao) return;
    // Limpa referências da conclusão desfeita no Libelo
    const libelo = { ...s.libelo };
    if (libelo.conclusaoCronosId === id) libelo.conclusaoCronosId = null;
    if (libelo.conclusaoMecanismoId === id) libelo.conclusaoMecanismoId = null;
    if (libelo.conclusaoNexoId === id) libelo.conclusaoNexoId = null;
    libelo.descuidosIds = libelo.descuidosIds.filter((d) => d !== id);
    set({
      conclusoes: s.conclusoes.filter((c) => c.id !== id),
      libelo,
      log: [...s.log, { hora: s.horasJogo, texto: `Conclusão desfeita: ${conclusao.titulo}.` }],
    });
  },

  atualizarLibelo: (parcial) => set((s) => ({ libelo: { ...s.libelo, ...parcial } })),

  // Submete o Libelo ao tribunal. No tutorial a resubmissão é permitida:
  // fechar o monólogo devolve o jogador à escrivaninha.
  submeterLibelo: () => {
    const s = get();
    const veredicto = calcularVeredicto(s.libelo, s.conclusoes, s.cartasRegistradas, SEED_TUTORIAL);
    set({
      veredicto,
      overlay: { tipo: 'monologo', id: null },
      log: [...s.log, { hora: s.horasJogo, texto: 'Libelo submetido ao tribunal.' }],
    });
  },

  fecharVeredicto: () => set({ veredicto: null, overlay: null }),
}));
