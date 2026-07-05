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
import { calcularVeredictoCadeia } from '../logic/veredicto.js';
import { conclusoesDoMestre } from '../logic/falaDoMestre.js';

// Constrói o objeto detective do §12 a partir da escolha na tela inicial.
export function buildDetective(opcao) {
  if (opcao === 'lenore') {
    return { name: 'Lenore', surname: 'Blackwell', pronoun: 'ela', treatment: 'Sra.', title: 'Dr.ª' };
  }
  return { name: 'Harlan', surname: 'Blackwell', pronoun: 'ele', treatment: 'Sr.', title: 'Dr.' };
}

let proximoIdLigacao = 1;

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
  overlay: null, // { tipo: 'localidade'|'caderneta'|'glossario'|'alibis'|'acusacao'|'monologo', id }

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
        textoDisplay: 'Corpo Frio como a Sala',
        termoCarimbo: 'Corpo tão frio quanto a sala',
        descricao:
          'O termômetro marca os 11°C do próprio escritório: o corpo esfriou até igualar a sala. Isso já não aperta a hora — diz só que a morte foi há mais de um dia.',
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
        textoDisplay: `Corpo Ainda Morno: ${temperatura}°C`,
        termoCarimbo: `Corpo a ${temperatura}°C (sala a 11°C)`,
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
  adicionarLigacao: (de, para) => {
    const s = get();
    const jaExiste = s.acusacao.ligacoes.find(
      (l) => (l.de === de && l.para === para) || (l.de === para && l.para === de)
    );
    if (jaExiste) return jaExiste;
    const nova = { id: `ligacao_${proximoIdLigacao++}`, de, para };
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
      overlay: { tipo: 'monologo', id: null },
      log: [...s.log, { hora: s.horasJogo, texto: 'Acusação levada a julgamento.' }],
    });
  },

  fecharVeredicto: () => set({ veredicto: null, overlay: null }),
}));
