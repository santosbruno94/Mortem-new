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
import { NOS_MAPA, LEADS_DESBLOQUEIO, custoViagem, obterNo } from '../data/mapa.js';
import { HORAS_CHEGADA_CENA, ipmAtual } from '../logic/tempo.js';
import { calcularVeredicto } from '../logic/veredicto.js';
import { conclusoesDoMestre } from '../logic/falaDoMestre.js';

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

  // ---------------- Mapa (o "dia do perito") ----------------
  // O relógio só avança ao VIAJAR entre nós; dentro do local, congela.
  localidadeAtual: null, // definido ao iniciar a investigação
  nosDesbloqueados: NOS_MAPA.filter((n) => n.desbloqueadoInicio).map((n) => n.id),

  // ---------------- Mesa e registros ----------------
  cartasRegistradas: [],
  conclusoes: [],
  log: [],
  temperaturaMedida: null,
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
      localidadeAtual: 'cena', // o perito chega à cena (a relojoaria) às 11h
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

  // Viagem entre nós do mapa: a ÚNICA ação que avança o relógio. Dentro de
  // um local o tempo congela. O custo (horas) vem de src/data/mapa.js.
  // Reabrir o local onde já se está custa 0.
  viajarPara: (noId) => {
    const s = get();
    if (!s.nosDesbloqueados.includes(noId)) return;
    const custo = s.localidadeAtual ? custoViagem(s.localidadeAtual, noId) : 0;
    if (noId === s.localidadeAtual || custo === 0) {
      set({ localidadeAtual: noId });
      return;
    }
    const no = obterNo(noId);
    set({
      localidadeAtual: noId,
      horasJogo: s.horasJogo + custo,
      log: [
        ...s.log,
        { hora: s.horasJogo + custo, texto: `Deslocou-se para ${no ? no.rotulo : noId} (${custo}h de viagem).` },
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
    const lead = LEADS_DESBLOQUEIO.find((l) => l.cartaId === definicao.id);
    const nosDesbloqueados =
      lead && !s.nosDesbloqueados.includes(lead.revelaNo)
        ? [...s.nosDesbloqueados, lead.revelaNo]
        : s.nosDesbloqueados;
    set({
      cartasRegistradas: [...s.cartasRegistradas, carta],
      nosDesbloqueados,
      log: [...s.log, { hora: s.horasJogo, texto: `Registrado: ${estado.carimboPadrao}.` }],
    });
    // O mestre relê o corpo e atualiza, de cabeça, a leitura de quando/como.
    get().consolidarLeituraMestre();
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
        termoCarimbo: 'Algor: equilíbrio térmico (≥26h)',
        descricao:
          'O termômetro marca os 11°C do próprio escritório: o corpo já igualou a sala. O algor perdeu a precisão — agora só diz que a morte foi há mais de um dia. Não some, mas pouco aperta.',
        vozMestre: 'Frio como a sala. O calor já não conta as horas — só diz que faz tempo.',
        // Equilíbrio: leitura VAGA, não nula. Carrega a temperatura medida
        // (== ambiente); o modelo devolve um piso largo (perde precisão).
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'algor_mortis',
          temperaturaCorpo: temperatura,
          temperaturaAmbiente: 11,
        },
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
        vozMestre: 'Ainda morno. O calor que perdeu conta as horas — um grau a cada uma delas.',
        // Carrega a leitura BRUTA (temperatura medida + ambiente); a janela
        // é calculada pelo modelo forense universal na gaveta Cronos.
        tagsOcultas: {
          dominio: 'temporal',
          subDominio: 'algor_mortis',
          temperaturaCorpo: temperatura,
          temperaturaAmbiente: 11,
        },
        horaRegistro: s.horasJogo,
      };
    }
    // Medir a temperatura é exame, não viagem: não custa tempo (relógio mole).
    set({
      temperaturaMedida: temperatura,
      cartasRegistradas: [...s.cartasRegistradas, carta],
      log: [...s.log, { hora: s.horasJogo, texto: `Registrado: ${carta.termoCarimbo}.` }],
    });
    get().consolidarLeituraMestre();
  },

  // O mestre/legista relê o corpo e FALA a leitura de quando/como. Faz upsert
  // de duas conclusões de id estável (origem 'mestre'), preservando o que o
  // jogador registrou por conta própria (ex.: o Nexo). Substitui as antigas
  // gavetas Cronos/Aitiov: a conta é a mesma, mas agora dada por um personagem.
  consolidarLeituraMestre: () => {
    const s = get();
    const base = s.conclusoes.filter((c) => c.origem !== 'mestre');
    set({ conclusoes: [...base, ...conclusoesDoMestre(s.cartasRegistradas)] });
  },

  // Conclusão registrada pelo próprio jogador (hoje, o Nexo; custo zero).
  registrarConclusao: (conclusao) => {
    const s = get();
    const nova = { ...conclusao, id: `conclusao_${proximoIdConclusao++}` };
    set({
      conclusoes: [...s.conclusoes, nova],
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
