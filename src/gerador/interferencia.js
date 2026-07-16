// =====================================================================
// SISTEMA DE INTERFERÊNCIA — FASE 4 do gerador por simulação (design em
// docs/game-design-simulacao.md §5: as Regras de Justiça R1–R6).
//
// Módulo GERADOR-FACING (o runtime jamais o importa; guarda no qa.mjs).
// Interferência = ação do assassino (ou cúmplice) contra a investigação,
// PRÉ-COMPUTADA aqui como evento contingente ("se o jogador fizer X,
// ocorre Z"). Nada é decidido em runtime: o motor apenas verifica o
// gatilho já materializado no pacote e aplica o efeito (store/jogo.js).
//
// As Regras de Justiça, na implementação:
//   R1 — segundo crime sob pressão: rolagem contra WIS do ator COM
//        penalidade fixa; a falha deposita vestígio extra, mais grosseiro.
//        Todo vestígio de interferência é FRESCO (posterior à 1ª perícia).
//   R2 — saldo informacional ≥ 0: só se destrói carta REDUNDANTE (a fatia
//        forense ainda resolve sem ela — janela cobre, mecanismo crava,
//        presença e móbil apontam o réu — computado com as MESMAS funções
//        do motor) e todo evento deposita ≥ 1 carta nova.
//   R3 — causalidade diegética: o gatilho referencia ação OBSERVÁVEL do
//        jogador (extração de carta pública — o depoimento tomado em
//        público corre a vila) e o ator tem ROTA espacial sustentada por
//        rotina/adjacência/frequentados até o alvo. Cada evento carrega
//        `comoSoube` e `comoChegou` reconstituíveis.
//   R4 — prenúncio: todo `silenciar` publica ANTES uma carta de sinal
//        legível (a testemunha nervosa), com prosa real (pipeline).
//   R5 — orçamento: 0–3 eventos por caso, sorteados na geração; a
//        materialização só pode DIMINUIR o sorteado (elegibilidade).
//   R6 — catálogo fechado v1 (4 tipos, abaixo).
//
// Determinismo: toda escolha sai de hashString sobre chave salgada,
// convenção `${seed}|interferencia|<decisao>`. Mesma seed → mesmos
// eventos, byte a byte (o replay do caso bruto no qa.mjs cobre isto).
// =====================================================================

import { hashString } from '../logic/hash.js';
import { janelaDaCarta } from '../logic/cronos.js';
import { intersecaoJanelas } from '../logic/tempo_morte.js';
import { mecanismoCravado } from '../data/catalogo_causas.js';
import { resolverEstadoCarta } from '../data/cartas.js';
import { saoAdjacentes } from './cidade.js';
import { sortearPonderado } from './amostragem.js';

// R1 — a penalidade fixa do improviso: a interferência rola contra
// (WIS do ator − PENALIDADE), nunca contra o WIS pleno do crime planejado.
export const PENALIDADE_WIS_INTERFERENCIA = 2;

// Hora de chegada do perito (mesma convenção da ponte, ponte_caso.js).
const HORAS_CHEGADA = 11;

function salDaSeed(seed) {
  return typeof seed === 'string' ? seed : seed?.id || 'caso';
}

// ---------------------------------------------------------------------
// R6 — CATÁLOGO FECHADO v1. Cada tipo declara gatilho observável, rolagem
// WIS penalizada, vestígios depositados (sucesso/falha) e delta
// informacional. `plantar_evidencia_falsa` segue rejeitado (v2 — ver
// docs/game-design-simulacao.md §6).
// ---------------------------------------------------------------------
export const CATALOGO_INTERFERENCIA = {
  destruir_evidencia: {
    rotulo: 'Destruir evidência',
    descricao: 'O ator volta à cena e remove um vestígio físico redundante.',
    gatilhoObservavel: 'extracao_carta_publica', // o móbil aberto na delegacia corre a vila
    penalidadeWis: PENALIDADE_WIS_INTERFERENCIA,
    vestigios: { sucesso: ['esfrega_fresca_pos_pericia'], falha: ['limpeza_interrompida'] },
    deltaInformacional:
      'perde-se um vestígio redundante da cena; ganha-se a limpeza fresca (posterior à 1ª perícia), que data e denuncia o retorno.',
    altoImpacto: false,
    proveniencia:
      'KB silente — proposta de verbete para docs/kb-medicina-legal/vestigios.md: "vestígio negativo — limpeza recente e datável (madeira úmida, cheiro de soda); observação, não instrumento"',
  },
  intimidar_testemunha: {
    rotulo: 'Intimidar testemunha',
    descricao: 'O ator pressiona a testemunha do visto-com-vida; a boca fecha antes do depoimento.',
    gatilhoObservavel: 'extracao_carta_publica',
    penalidadeWis: PENALIDADE_WIS_INTERFERENCIA,
    // A falha deposita a ameaça ouvida (se o grafo dá um ouvinte) ou a
    // visita notada na rua (regra de existência: ameaça sem ouvinte não
    // existe para o jogo — resta o rastro físico da visita).
    vestigios: { sucesso: ['testemunha_amedrontada'], falha: ['ameaca_ouvida', 'visita_fora_de_hora'] },
    deltaInformacional:
      'perde-se o avistamento redundante; ganha-se a recusa súbita (quem calou, calou DEPOIS de alguém saber das perguntas).',
    altoImpacto: false,
    proveniencia:
      'docs/kb-medicina-legal/inquerito-e-policia.md §4 (o depoimento é a espinha da prova; a sua retirada/contradição é fato investigável)',
  },
  subornar_testemunha: {
    rotulo: 'Subornar testemunha',
    descricao: 'O ator compra um depoimento novo de testemunha endividada; nada se destrói.',
    gatilhoObservavel: 'extracao_carta_da_testemunha', // o depoimento tomado em público
    penalidadeWis: PENALIDADE_WIS_INTERFERENCIA,
    vestigios: { sucesso: ['depoimento_contraditorio', 'dividas_quitadas'], falha: ['soberanos_novos'] },
    deltaInformacional:
      'nada se perde (o registro anterior fica no caderno do perito); ganha-se a contradição detectável (depoimento novo × registro anterior × evidência física) e o rastro de dinheiro de época.',
    altoImpacto: false,
    proveniencia: 'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §4 (dívida de caderneta; a quitação súbita lê-se na vila)',
  },
  silenciar: {
    rotulo: 'Silenciar (matar a testemunha)',
    descricao: 'O ator mata a testemunha do ruído antes que ela deponha — o segundo crime.',
    gatilhoObservavel: 'extracao_carta_publica',
    penalidadeWis: PENALIDADE_WIS_INTERFERENCIA,
    vestigios: { sucesso: ['segunda_morte'], falha: ['retalho_de_tecido'] },
    deltaInformacional:
      'perde-se o depoimento do ruído (se ainda não colhido); ganha-se um segundo corpo com vestígios de crime apressado — mais frescos e mais grosseiros que os do primeiro.',
    altoImpacto: true, // R4: exige prenúncio legível
    proveniencia: 'docs/kb-medicina-legal/tanatologia.md (datação relativa de duas mortes; o crime de horas × o de dias)',
  },
};

// ---------------------------------------------------------------------
// CLASSES DE VESTÍGIO DE INTERFERÊNCIA — extensão da tabela viva (§3.1)
// para o segundo crime. Todas governadas por WIS (R1) e todas FRESCAS:
// depositadas DEPOIS da primeira perícia, datáveis por isso. `evidenciaDe`
// aponta o TIPO de evento que a deposita (o análogo das variáveis de
// batalha da Fase 3). `pertenceAoAtor` marca o erro grosseiro que aponta
// quem interferiu.
// ---------------------------------------------------------------------
export const CLASSES_VESTIGIO_INTERFERENCIA = {
  esfrega_fresca_pos_pericia: {
    rotulo: 'Esfrega fresca, posterior à primeira perícia',
    atributo: 'WIS',
    frescor: 'fresco',
    evidenciaDe: ['destruir_evidencia'],
    semCelula: false,
    pertenceAoAtor: false,
    proveniencia:
      'KB silente — proposta de verbete para docs/kb-medicina-legal/vestigios.md: "limpeza recente sobre madeira é datável a olho e nariz (umidade, cheiro de soda)"',
  },
  limpeza_interrompida: {
    rotulo: 'Serviço de limpeza pela metade',
    atributo: 'WIS',
    frescor: 'fresco',
    evidenciaDe: ['destruir_evidencia'],
    semCelula: false,
    pertenceAoAtor: false,
    proveniencia:
      'KB silente — proposta de verbete para docs/kb-medicina-legal/vestigios.md: "a mancha meio esfregada e abandonada lê-se como serviço interrompido"',
  },
  testemunha_amedrontada: {
    rotulo: 'Recusa súbita da testemunha',
    atributo: 'WIS',
    frescor: 'fresco',
    evidenciaDe: ['intimidar_testemunha'],
    semCelula: true, // vive na conduta da pessoa, não numa célula da cena
    pertenceAoAtor: false,
    proveniencia:
      'docs/kb-medicina-legal/inquerito-e-policia.md §4 (a retirada de depoimento é fato investigável; o "silêncio datado" é inferência do desenho, não da KB)',
  },
  ameaca_ouvida: {
    rotulo: 'Ameaça ouvida por terceiro',
    atributo: 'WIS',
    frescor: 'fresco',
    evidenciaDe: ['intimidar_testemunha'],
    semCelula: true,
    pertenceAoAtor: true, // quem ameaçou foi visto/ouvido — o erro do improviso
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md §6 (a rede de fofoca; quem entra e sai é assunto da rua)',
  },
  visita_fora_de_hora: {
    rotulo: 'Visita fora de hora notada na vizinhança',
    atributo: 'WIS',
    frescor: 'fresco',
    evidenciaDe: ['intimidar_testemunha', 'silenciar'],
    semCelula: true,
    pertenceAoAtor: true,
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md §6 (a rede de fofoca; a hora estranha de quem entra e sai fica na rua)',
  },
  depoimento_contraditorio: {
    rotulo: 'Depoimento novo que desmente o anterior',
    atributo: 'WIS',
    frescor: 'fresco',
    evidenciaDe: ['subornar_testemunha'],
    semCelula: true,
    pertenceAoAtor: false,
    proveniencia: 'docs/kb-medicina-legal/inquerito-e-policia.md (retratação em inquérito: o par de versões é prova por si)',
  },
  dividas_quitadas: {
    rotulo: 'Dívidas quitadas na mesma semana',
    atributo: 'WIS',
    frescor: 'fresco',
    evidenciaDe: ['subornar_testemunha'],
    semCelula: true,
    pertenceAoAtor: false,
    proveniencia: 'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §4 (caderneta do merceeiro: £2–5 não se pagam sem origem)',
  },
  soberanos_novos: {
    rotulo: 'Soberanos novos, contados à vista de todos',
    atributo: 'WIS',
    frescor: 'fresco',
    evidenciaDe: ['subornar_testemunha'],
    semCelula: true,
    pertenceAoAtor: true, // o dinheiro rastreável até quem pagou — o erro do improviso
    proveniencia: 'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §4 (moeda graúda em mão miúda chama o olho da vila)',
  },
  segunda_morte: {
    rotulo: 'Corpo da testemunha (morte de horas, não de dias)',
    atributo: 'WIS',
    frescor: 'fresco',
    evidenciaDe: ['silenciar'],
    semCelula: false,
    pertenceAoAtor: false,
    proveniencia: 'docs/kb-medicina-legal/tanatologia.md (rigor e livor datam a segunda morte como posterior à primeira)',
  },
  retalho_de_tecido: {
    rotulo: 'Retalho de tecido preso no batente',
    atributo: 'WIS',
    frescor: 'fresco',
    evidenciaDe: ['silenciar'],
    semCelula: false,
    pertenceAoAtor: true, // individualiza pelo ENCAIXE do rasgo, jamais por classe de fibra
    proveniencia:
      'docs/kb-medicina-legal/vestigios.md (encaixe físico: o rasgo do retalho casa com o buraco na peça — a única individualização que a lente de 1893 admite)',
  },
};

// ---------------------------------------------------------------------
// R4 — PROSA DO PRENÚNCIO (a testemunha nervosa). Estas variantes são
// PROSA REAL (não rótulo técnico): entram na carta de prenúncio do caso
// gerado e passam pelo pipeline `revisar-prosa`. `{nome}` é interpolado
// pelo gerador no build (nunca em runtime).
// ---------------------------------------------------------------------
export const PROSA_PRENUNCIO = [
  '{nome} recebe à soleira e não faz entrar. Fala baixo, o olho na rua: "Não devia estar falando com o senhor. Aqui todo mundo sabe quem abre a porta para quem." Despede-se antes da terceira pergunta.',
  'Enquanto fala, {nome} torce as mãos, uma na outra, e olha por cima do ombro do visitante, para a rua vazia. Pede que o próprio nome fique fora do caderno.',
  '{nome} diz que não viu nada; depois, que viu pouco; depois, que era tarde. Na despedida, segura a manga do perito: "O senhor vai embora quando isso acabar. Eu fico."',
];

// ---------------------------------------------------------------------
// R2 — a fatia forense ainda resolve sem estas cartas? Computado com as
// MESMAS funções do motor (janelaDaCarta/intersecaoJanelas/mecanismo-
// Cravado): a janela cobre a morte, os sinais cravam o mecanismo, a
// presença e o móbil apontam o réu. Redundante = o que se pode perder
// sem quebrar nenhum dos quatro.
// ---------------------------------------------------------------------
export function fatiaResolveSem(fatia, idsRemovidos, horaExame = HORAS_CHEGADA) {
  const removidos = new Set(idsRemovidos);
  const cartas = fatia.cartas.filter((c) => !removidos.has(c.id));
  const verdade = fatia.verdadeDeOuro;
  const ipm = horaExame - verdade.horaMorteAbsoluta;

  const temporais = cartas
    .map((def) => ({ id: def.id, horaRegistro: horaExame, tagsOcultas: resolverEstadoCarta(def, ipm).tagsOcultas }))
    .filter((c) => c.tagsOcultas.dominio === 'temporal');
  const janela = intersecaoJanelas(temporais.map(janelaDaCarta).filter(Boolean));
  if (!janela || !(janela.inicio <= verdade.horaMorteAbsoluta && verdade.horaMorteAbsoluta <= janela.fim)) return false;

  const sinais = cartas.filter((c) => c.tagsOcultas?.dominio === 'causal').map((c) => c.tagsOcultas.sinal);
  if (mecanismoCravado(sinais)?.id !== verdade.mecanismoCorreto) return false;

  if (!cartas.some((c) => c.tagsOcultas?.dominio === 'vestigio' && c.tagsOcultas.pertenceA === verdade.reuCorreto)) return false;
  if (!cartas.some((c) => c.tagsOcultas?.subDominio === 'motivo' && c.tagsOcultas.ligadoA === verdade.reuCorreto)) return false;
  return true;
}

// ---------------------------------------------------------------------
// Testemunhas potenciais (pré-crime — derivadas de rotina, nunca do
// resultado da batalha):
//   • visto-com-vida: quem partilhou o local da vítima na FAIXA ANTERIOR
//     à do crime (a pessoa por trás da carta gen_visto_vivo da ponte);
//   • ruído: o primeiro ouvinte potencial (mesmo teto antes de vizinho) —
//     candidato; a carta gen_ruido_ouvido só existe se a batalha soou.
// ---------------------------------------------------------------------
export function faixaAnterior(faixa) {
  return { dia: 'madrugada', noite: 'dia', madrugada: 'noite' }[faixa];
}

export function escolherTestemunhaVistoVivo({ elenco, vitimaId, assassinoId, faixaCrime, sal }) {
  const vitima = elenco.find((p) => p.id === vitimaId);
  const anterior = faixaAnterior(faixaCrime);
  const localAnterior = vitima.pacoteEspacial.rotina[anterior];
  const candidatos = elenco.filter(
    (p) => p.id !== vitimaId && p.id !== assassinoId && p.pacoteEspacial.rotina[anterior] === localAnterior
  );
  if (candidatos.length === 0) return null;
  return candidatos[hashString(`${sal}|vistoVivo`) % candidatos.length].id;
}

export function escolherTestemunhaRuido(ouvintes) {
  return ouvintes?.mesmoLocal?.[0] ?? ouvintes?.adjacentes?.[0] ?? null;
}

// ---------------------------------------------------------------------
// R3 — rota espacial plausível do ator até o alvo, sustentada por
// rotina/adjacência/frequentados. Tenta a faixa de ação sorteada e, se
// nada sustenta, a outra faixa noturna. `retorno_a_cena` só vale para o
// ASSASSINO voltando à cena do próprio crime (o trajeto que sustentou o
// crime sustenta o retorno).
// ---------------------------------------------------------------------
export function rotaPlausivel({ ator, localAlvo, faixaPreferida, cidade, cenaDoCrimeId = null, assassinoId = null }) {
  const faixas = faixaPreferida === 'noite' ? ['noite', 'madrugada'] : ['madrugada', 'noite'];
  for (const faixa of faixas) {
    const origem = ator.pacoteEspacial.rotina[faixa];
    if (origem === localAlvo) {
      return { de: origem, para: localAlvo, faixa, sustentacao: 'mesmo_local' };
    }
    if (saoAdjacentes(cidade, origem, localAlvo)) {
      return { de: origem, para: localAlvo, faixa, sustentacao: 'adjacente' };
    }
    if (ator.pacoteEspacial.frequentados.includes(localAlvo)) {
      return { de: origem, para: localAlvo, faixa, sustentacao: 'frequentado' };
    }
  }
  if (cenaDoCrimeId && localAlvo === cenaDoCrimeId && ator.id === assassinoId) {
    return {
      de: ator.pacoteEspacial.rotina[faixaPreferida],
      para: localAlvo,
      faixa: faixaPreferida,
      sustentacao: 'retorno_a_cena',
    };
  }
  return null;
}

function comoChegouDaRota(rota) {
  const textos = {
    mesmo_local: `a rotina da faixa ${rota.faixa} já o punha em ${rota.para} — não precisou de trajeto`,
    adjacente: `saiu de ${rota.de}, prédio vizinho de ${rota.para}, na faixa ${rota.faixa} (adjacência do grafo)`,
    frequentado: `${rota.para} é parada habitual dele (frequentados da ficha); foi na faixa ${rota.faixa} sem chamar atenção`,
    retorno_a_cena: `refez, na faixa ${rota.faixa}, o caminho do próprio crime até ${rota.para}`,
  };
  return textos[rota.sustentacao];
}

// ---------------------------------------------------------------------
// R5 — o esqueleto do sorteio (PRÉ-CRIME): orçamento 0–3, tipos em
// rotação determinística, ator (assassino; cúmplice com probabilidade
// menor), faixa de ação e — para `silenciar` — o local do alvo, que
// PRECISA entrar em locaisElegiveis (LOD: local de interferência tem
// interior). Só decisões computáveis antes do autobattler.
// ---------------------------------------------------------------------
export function sortearEsqueletoInterferencia({ seed, mundoBase, vitimaId, assassinoId, faixaCrime, localCrimeId, ouvintes }) {
  const sal = `${salDaSeed(seed)}|interferencia`;
  const elenco = mundoBase.elenco;
  const cidade = mundoBase.cidade;
  const assassino = elenco.find((p) => p.id === assassinoId);

  const orcamento = sortearPonderado(
    [
      { valor: 0, peso: 1 },
      { valor: 1, peso: 3 },
      { valor: 2, peso: 2 },
      { valor: 3, peso: 1 },
    ],
    `${sal}|orcamento`
  );

  // Cúmplice: coabitante do assassino (partilha lugar em alguma faixa),
  // nunca a vítima — a rota do cúmplice nasce da mesma convivência.
  const coabitantes = elenco.filter(
    (p) =>
      p.id !== assassinoId &&
      p.id !== vitimaId &&
      ['dia', 'noite', 'madrugada'].some((f) => p.pacoteEspacial.rotina[f] === assassino.pacoteEspacial.rotina[f])
  );
  const cumpliceId = coabitantes.length > 0 ? coabitantes[hashString(`${sal}|cumplice`) % coabitantes.length].id : null;

  const testemunhaVistoVivoId = escolherTestemunhaVistoVivo({ elenco, vitimaId, assassinoId, faixaCrime, sal });
  const testemunhaRuidoId = escolherTestemunhaRuido(ouvintes);

  // Tipos em rotação determinística; aceita-se pedido a pedido até o
  // orçamento (a pré-elegibilidade barra silenciar sem testemunha/rota).
  const tipos = Object.keys(CATALOGO_INTERFERENCIA);
  const inicio = hashString(`${sal}|tipos`) % tipos.length;
  const pedidos = [];
  const locaisExtras = [];
  for (let i = 0; i < tipos.length && pedidos.length < orcamento; i++) {
    const tipo = tipos[(inicio + i) % tipos.length];
    const salPedido = `${sal}|pedido|${tipo}`;
    const atorId =
      cumpliceId && hashString(`${salPedido}|ator`) % 4 === 0 ? cumpliceId : assassinoId; // cúmplice com probabilidade menor
    const faixaAcao = hashString(`${salPedido}|faixa`) % 2 === 0 ? 'noite' : 'madrugada';

    if (tipo === 'silenciar') {
      if (!testemunhaRuidoId) continue; // sem ouvinte potencial, sem alvo
      const testemunha = elenco.find((p) => p.id === testemunhaRuidoId);
      const localAlvo = testemunha.pacoteEspacial.rotina[faixaAcao];
      const ator = elenco.find((p) => p.id === atorId);
      if (!rotaPlausivel({ ator, localAlvo, faixaPreferida: faixaAcao, cidade })) continue;
      locaisExtras.push(localAlvo); // LOD: o local do silenciamento ganha interior
    }
    pedidos.push({ tipo, atorId, faixaAcao });
  }

  return { orcamento, pedidos, cumpliceId, testemunhaVistoVivoId, testemunhaRuidoId, locaisExtras };
}

// ---------------------------------------------------------------------
// Materialização (PÓS-CRIME): cada pedido vira evento completo — ou é
// descartado com motivo registrado. Aqui entram as checagens que
// dependem do RegistroDoCrime e da fatia (R2) e a rolagem WIS (R1).
// ---------------------------------------------------------------------

// Testemunha "desonesta" (alvo de suborno): quem tem preço — motivo
// potencial econômico da Fase 1 (dinheiro fala) ou CHA de quem cede.
const MOTIVOS_COMPRAVEIS = ['divida_caderneta', 'salario_atrasado', 'seguro_de_enterro', 'dote', 'heranca'];
export function testemunhaCompravel(personagem) {
  return MOTIVOS_COMPRAVEIS.includes(personagem.motivoPotencial) || personagem.atributos.CHA <= 2;
}

// Rótulos técnicos de carta (o mesmo regime da ponte da Fase 3: a prosa
// jogável nasce nas fases seguintes — EXCETO o prenúncio, que é prosa
// real por exigência da R4).
function cartaDeVestigio({ id, classe, localidade, rotuloCurto, detalhe, tags, ancora = null }) {
  const def = CLASSES_VESTIGIO_INTERFERENCIA[classe];
  return {
    id,
    localidade,
    textoDisplay: rotuloCurto,
    carimboPadrao: def.rotulo,
    descricao: `Rótulo técnico da fase 4 — prosa nasce no pipeline. ${detalhe}`,
    tagsOcultas: tags,
    // Metadados do gerador (o motor jamais os lê):
    vestigioInterferencia: {
      classe,
      frescor: def.frescor,
      localId: ancora?.localId ?? null,
      comodo: ancora?.comodo ?? null,
      celula: ancora?.celula ? { ...ancora.celula } : null,
      mobilia: ancora?.mobilia ?? null,
    },
  };
}

// Âncora determinística num interior: a primeira peça de mobília (senão,
// o centro do primeiro cômodo) — o mesmo gesto do serviço do veneno.
function ancoraNoInterior(interior) {
  const peca = interior.mobilia[0] || null;
  if (peca) {
    return { localId: interior.predioId, comodo: peca.comodo, celula: { ...peca.celula }, mobilia: peca.id };
  }
  const c = interior.comodos[0];
  return {
    localId: interior.predioId,
    comodo: c.id,
    celula: { col: c.ret.col + Math.floor(c.ret.colunas / 2), fila: c.ret.fila + Math.floor(c.ret.filas / 2) },
    mobilia: null,
  };
}

export function gerarInterferencias({ seed, mundo, crime, fatiaForense, escolha, esqueleto }) {
  const sal = `${salDaSeed(seed)}|interferencia`;
  const elenco = mundo.elenco;
  const cidade = mundo.cidade;
  const eventos = [];
  const cartasExtra = [];
  const descartes = [];
  const testemunhasUsadas = new Set();
  let proximo = 1;

  const pessoa = (id) => elenco.find((p) => p.id === id);
  const idsFatia = new Set(fatiaForense.cartas.map((c) => c.id));

  for (const pedido of esqueleto.pedidos) {
    const { tipo, atorId, faixaAcao } = pedido;
    const catalogo = CATALOGO_INTERFERENCIA[tipo];
    const ator = pessoa(atorId);
    const salEvento = `${sal}|evento|${tipo}`;
    const idEvento = `intf_${proximo}`;

    // R1 — a rolagem: WIS do ator com penalidade; a falha deposita o
    // vestígio extra, mais grosseiro (que aponta o ator).
    const alvoRolagem = Math.max(0, ator.atributos.WIS - catalogo.penalidadeWis);
    const dado = hashString(`${salEvento}|rolagem`) % 6;
    const rolagem = { wis: ator.atributos.WIS, penalidade: catalogo.penalidadeWis, alvo: alvoRolagem, dado, sucesso: dado < alvoRolagem };

    let materializado = null;

    if (tipo === 'destruir_evidencia') {
      // Alvo: carta FÍSICA da cena, redundante (R2). Rotação determinística.
      const fisicas = fatiaForense.cartas.filter((c) => c.suporteFisico === 'cena');
      const inicioAlvo = fisicas.length > 0 ? hashString(`${salEvento}|alvo`) % fisicas.length : 0;
      let alvoCarta = null;
      for (let i = 0; i < fisicas.length; i++) {
        const candidata = fisicas[(inicioAlvo + i) % fisicas.length];
        if (fatiaResolveSem(fatiaForense, [candidata.id])) {
          alvoCarta = candidata;
          break;
        }
      }
      if (!alvoCarta) {
        descartes.push({ tipo, motivo: 'nenhuma carta física redundante na cena (R2)' });
        continue;
      }
      const rota = rotaPlausivel({
        ator, localAlvo: escolha.localId, faixaPreferida: faixaAcao, cidade,
        cenaDoCrimeId: escolha.localId, assassinoId: crime.assassinoId,
      });
      if (!rota) {
        descartes.push({ tipo, motivo: 'sem rota plausível do ator até a cena (R3)' });
        continue;
      }
      const interior = mundo.interiores[escolha.localId];
      const ancora = alvoCarta.id === 'gen_sangue_alheio' || alvoCarta.id === 'gen_pegadas'
        ? { localId: escolha.localId, comodo: crime.posicaoCorpo.comodo, celula: { ...crime.posicaoCorpo.celula }, mobilia: null }
        : ancoraNoInterior(interior);
      const novas = [
        cartaDeVestigio({
          id: `gen_intf_${idEvento}_limpeza`,
          classe: 'esfrega_fresca_pos_pericia',
          localidade: 'cena',
          rotuloCurto: 'Esfrega Fresca na Cena',
          detalhe: `a madeira ainda úmida quando o perito voltou; a limpeza é POSTERIOR à primeira perícia e remove ${alvoCarta.id}.`,
          tags: { dominio: 'vestigio', subDominio: 'limpeza_fresca', tipoVestigio: 'esfrega_fresca' },
          ancora,
        }),
      ];
      if (!rolagem.sucesso) {
        novas.push(
          cartaDeVestigio({
            id: `gen_intf_${idEvento}_meia_obra`,
            classe: 'limpeza_interrompida',
            localidade: 'cena',
            rotuloCurto: 'Serviço pela Metade',
            detalhe: 'a mancha arrastada e abandonada no meio do gesto — o improviso interrompido.',
            tags: { dominio: 'vestigio', subDominio: 'limpeza_fresca', tipoVestigio: 'limpeza_interrompida' },
            ancora,
          })
        );
      }
      materializado = {
        alvo: { tipo: 'carta', cartaId: alvoCarta.id, localId: escolha.localId },
        gatilho: {
          tipo: 'extracao_carta',
          cartaId: 'gen_motivo',
          comoSoube: 'o perito abriu o móbil do réu na delegacia (extração de gen_motivo); o inquérito em público correu a vila até o ator',
        },
        rota,
        efeito: { cartaDestruida: alvoCarta.id, cartasNovas: novas.map((c) => c.id) },
        prenuncio: null,
        anuncio: 'Há sinais de que alguém esteve na cena desde a última visita.',
        cartas: novas,
      };
    }

    if (tipo === 'intimidar_testemunha') {
      const testemunhaId = esqueleto.testemunhaVistoVivoId;
      if (!testemunhaId || testemunhasUsadas.has(testemunhaId)) {
        descartes.push({ tipo, motivo: 'sem testemunha do visto-com-vida disponível' });
        continue;
      }
      if (!fatiaResolveSem(fatiaForense, ['gen_visto_vivo'])) {
        descartes.push({ tipo, motivo: 'gen_visto_vivo não é redundante neste caso (R2)' });
        continue;
      }
      const testemunha = pessoa(testemunhaId);
      const localAlvo = testemunha.pacoteEspacial.rotina[faixaAcao];
      const rota = rotaPlausivel({ ator, localAlvo, faixaPreferida: faixaAcao, cidade });
      if (!rota) {
        descartes.push({ tipo, motivo: 'sem rota plausível do ator até a testemunha (R3)' });
        continue;
      }
      // O terceiro que ouve a ameaça (falha da rolagem): alguém cuja
      // rotina na faixa da ação partilha ou vizinha o local do alvo.
      const ouvinteAmeaca = elenco.find(
        (p) =>
          p.id !== atorId &&
          p.id !== testemunhaId &&
          p.id !== crime.vitimaId &&
          (p.pacoteEspacial.rotina[rota.faixa] === localAlvo ||
            saoAdjacentes(cidade, p.pacoteEspacial.rotina[rota.faixa], localAlvo))
      );
      const novas = [
        cartaDeVestigio({
          id: `gen_intf_${idEvento}_recusa`,
          classe: 'testemunha_amedrontada',
          localidade: 'vizinhanca',
          rotuloCurto: 'A Boca que Fechou',
          detalhe: `a testemunha ${testemunhaId} recusou depor DEPOIS das perguntas públicas do perito — o silêncio tem data.`,
          tags: { dominio: 'testemunho', subDominio: 'recusa_subita', testemunha: testemunhaId },
        }),
      ];
      if (!rolagem.sucesso) {
        novas.push(
          cartaDeVestigio({
            id: `gen_intf_${idEvento}_ameaca`,
            classe: ouvinteAmeaca ? 'ameaca_ouvida' : 'visita_fora_de_hora',
            localidade: 'vizinhanca',
            rotuloCurto: ouvinteAmeaca ? 'A Ameaça Ouvida' : 'A Visita Fora de Hora',
            detalhe: ouvinteAmeaca
              ? `a ameaça ouvida por ${ouvinteAmeaca.id} (rotina × adjacência na faixa ${rota.faixa}) — aponta ${atorId}.`
              : `a visita de ${atorId} à porta da testemunha, notada na rua em hora imprópria.`,
            tags: { dominio: 'vestigio', subDominio: 'pressao_sobre_testemunha', pertenceA: atorId },
          })
        );
      }
      testemunhasUsadas.add(testemunhaId);
      materializado = {
        alvo: { tipo: 'testemunha', testemunhaId, cartaId: 'gen_visto_vivo', localId: localAlvo },
        gatilho: {
          tipo: 'extracao_carta',
          cartaId: 'gen_motivo',
          comoSoube: 'o perito abriu o móbil na delegacia (extração de gen_motivo); a vila comentou, e o ator soube que o cerco fechava',
        },
        rota,
        efeito: { cartaDestruida: 'gen_visto_vivo', cartasNovas: novas.map((c) => c.id) },
        prenuncio: null,
        anuncio: 'Uma testemunha que falava deixou de falar.',
        cartas: novas,
      };
    }

    if (tipo === 'subornar_testemunha') {
      // Alvo: testemunha com carta no caso E com preço (desonesta).
      const candidatos = [
        { id: esqueleto.testemunhaRuidoId, cartaId: 'gen_ruido_ouvido' },
        { id: esqueleto.testemunhaVistoVivoId, cartaId: 'gen_visto_vivo' },
      ].filter(
        (c) => c.id && !testemunhasUsadas.has(c.id) && idsFatia.has(c.cartaId) && testemunhaCompravel(pessoa(c.id))
      );
      if (candidatos.length === 0) {
        descartes.push({ tipo, motivo: 'nenhuma testemunha comprável com carta no caso' });
        continue;
      }
      const alvo = candidatos[hashString(`${salEvento}|alvo`) % candidatos.length];
      const testemunha = pessoa(alvo.id);
      const localAlvo = testemunha.pacoteEspacial.rotina[faixaAcao];
      const rota = rotaPlausivel({ ator, localAlvo, faixaPreferida: faixaAcao, cidade });
      if (!rota) {
        descartes.push({ tipo, motivo: 'sem rota plausível do ator até a testemunha (R3)' });
        continue;
      }
      const novas = [
        cartaDeVestigio({
          id: `gen_intf_${idEvento}_retratacao`,
          classe: 'depoimento_contraditorio',
          localidade: 'vizinhanca',
          rotuloCurto: 'O Depoimento que Mudou',
          detalhe: `a testemunha ${alvo.id} agora conta OUTRA versão — desmente ${alvo.cartaId}, já registrado, e briga com a leitura física do corpo.`,
          tags: { dominio: 'testemunho', subDominio: 'retratacao', testemunha: alvo.id, desmente: alvo.cartaId },
        }),
        cartaDeVestigio({
          id: `gen_intf_${idEvento}_dividas`,
          classe: 'dividas_quitadas',
          localidade: 'vizinhanca',
          rotuloCurto: 'A Caderneta Quitada',
          detalhe: `as dívidas de ${alvo.id} quitadas de repente, na mesma semana da retratação — o rastro do dinheiro.`,
          tags: { dominio: 'vestigio', subDominio: 'rastro_de_dinheiro', tipoVestigio: 'dividas_quitadas' },
        }),
      ];
      if (!rolagem.sucesso) {
        novas.push(
          cartaDeVestigio({
            id: `gen_intf_${idEvento}_soberanos`,
            classe: 'soberanos_novos',
            localidade: 'vizinhanca',
            rotuloCurto: 'Soberanos Novos',
            detalhe: `moeda graúda contada à vista de todos — rastreável até ${atorId}.`,
            tags: { dominio: 'vestigio', subDominio: 'rastro_de_dinheiro', pertenceA: atorId },
          })
        );
      }
      testemunhasUsadas.add(alvo.id);
      materializado = {
        alvo: { tipo: 'testemunha', testemunhaId: alvo.id, cartaId: alvo.cartaId, localId: localAlvo },
        gatilho: {
          tipo: 'extracao_carta',
          cartaId: alvo.cartaId,
          comoSoube: `o depoimento de ${alvo.id} foi tomado em público (extração de ${alvo.cartaId}); o ator soube o que a testemunha contou`,
        },
        rota,
        efeito: { cartaDestruida: null, cartasNovas: novas.map((c) => c.id) }, // nada se destrói: a contradição exige o par
        prenuncio: null,
        anuncio: 'Uma testemunha mudou a própria história.',
        cartas: novas,
      };
    }

    if (tipo === 'silenciar') {
      const testemunhaId = esqueleto.testemunhaRuidoId;
      if (!testemunhaId || testemunhasUsadas.has(testemunhaId) || !idsFatia.has('gen_ruido_ouvido')) {
        descartes.push({ tipo, motivo: 'sem testemunha de ruído com carta no caso' });
        continue;
      }
      if (!fatiaResolveSem(fatiaForense, ['gen_ruido_ouvido'])) {
        descartes.push({ tipo, motivo: 'gen_ruido_ouvido não é redundante neste caso (R2)' });
        continue;
      }
      const testemunha = pessoa(testemunhaId);
      const localAlvo = testemunha.pacoteEspacial.rotina[faixaAcao];
      const rota = rotaPlausivel({ ator, localAlvo, faixaPreferida: faixaAcao, cidade });
      if (!rota) {
        descartes.push({ tipo, motivo: 'sem rota plausível do ator até a testemunha (R3)' });
        continue;
      }
      const interior = mundo.interiores[localAlvo] || null;
      const ancora = interior ? ancoraNoInterior(interior) : { localId: localAlvo };
      // R4 — o prenúncio: prosa REAL, disponível desde o início do caso.
      const variante = PROSA_PRENUNCIO[hashString(`${salEvento}|prenuncio`) % PROSA_PRENUNCIO.length];
      const textoPrenuncio = variante.replaceAll('{nome}', testemunha.nome);
      const cartaPrenuncio = {
        id: `gen_intf_${idEvento}_prenuncio`,
        localidade: 'vizinhanca',
        textoDisplay: 'A Testemunha Inquieta',
        carimboPadrao: 'Testemunha que pede sigilo',
        descricao: textoPrenuncio,
        tagsOcultas: { dominio: 'testemunho', subDominio: 'prenuncio', testemunha: testemunhaId },
      };
      const novas = [
        cartaDeVestigio({
          id: `gen_intf_${idEvento}_corpo`,
          classe: 'segunda_morte',
          localidade: 'vizinhanca',
          rotuloCurto: 'O Segundo Corpo',
          detalhe: `a testemunha ${testemunhaId} morta em ${localAlvo}; rigor e livor dizem morte DE HORAS — posterior à primeira perícia; execução mais grosseira que a do primeiro crime.`,
          tags: { dominio: 'vestigio', subDominio: 'segunda_morte', tipoVestigio: 'corpo_da_testemunha' },
          ancora,
        }),
      ];
      if (!rolagem.sucesso) {
        novas.push(
          cartaDeVestigio({
            id: `gen_intf_${idEvento}_retalho`,
            classe: 'retalho_de_tecido',
            localidade: 'vizinhanca',
            rotuloCurto: 'O Retalho no Batente',
            detalhe: `pano preso no batente da porta na fuga; o rasgo do retalho encaixa no buraco do casaco de ${atorId} (encaixe físico, não classe de fibra).`,
            tags: { dominio: 'vestigio', subDominio: 'fuga_apressada', pertenceA: atorId },
            ancora,
          })
        );
      }
      testemunhasUsadas.add(testemunhaId);
      cartasExtra.push(cartaPrenuncio);
      materializado = {
        alvo: { tipo: 'testemunha', testemunhaId, cartaId: 'gen_ruido_ouvido', localId: localAlvo },
        gatilho: {
          tipo: 'extracao_carta',
          cartaId: 'gen_visto_vivo',
          comoSoube:
            'o perito perguntou em público quem viu a vítima por última vez (extração de gen_visto_vivo); o ator entendeu que a vizinhança seria ouvida em seguida',
        },
        rota,
        efeito: { cartaDestruida: 'gen_ruido_ouvido', cartasNovas: novas.map((c) => c.id) },
        prenuncio: { cartaId: cartaPrenuncio.id, texto: textoPrenuncio },
        anuncio: 'A testemunha que tinha o que contar foi encontrada morta.',
        cartas: novas,
      };
    }

    if (!materializado) continue;

    eventos.push({
      id: idEvento,
      tipo,
      ator: atorId,
      atorPapel: atorId === crime.assassinoId ? 'assassino' : 'cumplice',
      alvo: materializado.alvo,
      gatilho: materializado.gatilho,
      rota: { ...materializado.rota, comoChegou: comoChegouDaRota(materializado.rota) },
      rolagem,
      efeito: materializado.efeito,
      prenuncio: materializado.prenuncio,
      anuncio: materializado.anuncio,
    });
    cartasExtra.push(...materializado.cartas);
    proximo += 1;
  }

  // R2 (ramo pior): a fatia tem de resolver mesmo com TODAS as destruições
  // aplicadas. Se não resolve, descartam-se eventos do fim para o começo
  // (os ramos parciais são supraconjuntos de cartas — resolvem a fortiori).
  const destruidasDe = (evs) => evs.map((e) => e.efeito.cartaDestruida).filter(Boolean);
  while (eventos.length > 0 && !fatiaResolveSem(fatiaForense, destruidasDe(eventos))) {
    const removido = eventos.pop();
    descartes.push({ tipo: removido.tipo, motivo: 'ramo com todas as destruições não resolvia (R2)' });
  }
  const idsEventos = new Set(eventos.map((e) => e.id));
  const cartasFinais = cartasExtra.filter((c) => {
    const dono = c.id.match(/^gen_intf_(intf_\d+)_/);
    return !dono || idsEventos.has(dono[1]);
  });

  return { esqueleto, eventos, cartasExtra: cartasFinais, descartes };
}
