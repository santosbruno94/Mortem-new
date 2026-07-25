// =====================================================================
// PACOTE DE CASO — o contrato de saída do (futuro) gerador procedural.
//
// Um caso deixa de ser um espalhamento por módulos importados e passa a
// ser UM objeto serializável que o motor carrega. Isto é a prova viva da
// alegação "trocar a narrativa não toca o motor": o veredicto lê tagsOcultas
// + a Verdade de Ouro (`verdadeDeOuro`); tudo o mais aqui é camada narrativa
// ou visual, que o motor jamais consulta.
//
// Este módulo é o ÚNICO (fora do QA) autorizado a importar seed.js/cartas.js:
// ele AGREGA os módulos de dados atuais num pacote. Todo o resto do código
// (store, logic de apresentação, componentes) lê daqui — nunca dos módulos
// de dados crus. Os arquivos de dados podem permanecer onde estão; o pacote
// é a agregação, não a mudança de lugar.
//
// ---------------------------------------------------------------------
// SCHEMA DO PACOTE (JSON-serializável — só dado, nenhuma função):
// ---------------------------------------------------------------------
//   id                : string. Identificador do caso ('a_hora_emprestada').
//   verdadeDeOuro     : objeto. A SEED do caso — lida SÓ pelo motor de
//                       veredicto. É a única parte que o motor consulta.
//   suspeitos         : array. Elenco (camada narrativa; o motor só usa ids).
//   cartas            : array. Catálogo de evidências (definições).
//   localidades       : array. Prosa dos lugares (pontos, gestos, diálogos).
//   nosMapa           : array. Topologia do mapa (nós, grupos, desbloqueio).
//   leads             : array. Cartas que revelam novos nós ao serem extraídas.
//   custos            : objeto. Custo de viagem (horas) entre grupos do mapa.
//   dialogos          : objeto. Árvores de interrogatório (camada de UI).
//   confrontos        : objeto. { estadoInicial, consequencias } — semente §7.3.
//   abertura          : objeto. { passos, perguntas, opcoesPersonagem }.
//   parametrosCena    : objeto. Parâmetros ANTES cravados no motor:
//                         horasChegada : hora absoluta de chegada do perito.
//                         ambiente     : °C do ambiente da cena.
//                         calendario   : { diaBase, mesAbrev, mesExtenso, ano }.
//   plantas           : objeto (visual, OPCIONAL). { relojoaria: PLANTA }.
//   maquete           : objeto (visual, OPCIONAL — casos gerados). O diorama
//                       da vila gerada: { morfologia, tabua, posicoes,
//                       formas, cenario, estrada? } no schema que o
//                       DioramaVila consome (posicoes por nó {x,z,predio};
//                       formas por prédio; cenario = casario sem nó, não
//                       clicável). O motor JAMAIS a lê (guarda GE3);
//                       ausente/incompleta ⇒ grade 2D (fallback ?flat=1).
//   aparencias        : objeto (visual, OPCIONAL). { curadas, porLocalidade }.
//   papeisDramaticos  : objeto (metadado do gerador, OPCIONAL). Mapa de id de
//                       entidade → id de papel (src/data/papeis.js). O motor
//                       jamais o lê; é o casting que o gerador escala (FASE 5).
//   ecosDoMestre      : objeto (prosa do tutorial, OPCIONAL). A fala do legista
//                       na retentativa, por código de falha (src/data/
//                       ecos_mestre.js). { titulo, porCodigo:{ [codigo]:[…] } }.
//                       O motor jamais o lê; ausente ⇒ sem mestre, sem eco
//                       (modo procedural, FASE 6).
//   interferencias    : objeto (FASE 4 do gerador por simulação, OPCIONAL).
//                       { eventos: […] } — eventos CONTINGENTES pré-computados
//                       na geração (Regras de Justiça R1–R6 em docs/
//                       game-design-simulacao.md §5). Cada evento declara
//                       gatilho observável ({ tipo, cartaId|noId|suspeitoId }),
//                       efeito ({ cartaDestruida, cartasNovas: [ids] }) e
//                       anuncio (linha de diário). As DEFINIÇÕES das cartas
//                       novas já vivem em `cartas` — o evento só referencia
//                       ids; a disponibilidade é o gate (store). O runtime
//                       NÃO decide nada: verifica o gatilho e aplica. O motor
//                       de veredicto jamais lê este campo (guarda no qa.mjs).
//                       Ausente ⇒ caso sem interferência (o tutorial).
//   ecosInterferencia : objeto (FASE 4, OPCIONAL). Prosa do comentário
//                       pós-caso do legista sobre interferências ocorridas/
//                       evitadas: { titulo, porChave:{ [tipo_desfecho]:[…] } }
//                       (src/data/ecos_interferencia.js). Mesmo mecanismo dos
//                       códigos de falha (FASE 6). O motor jamais o lê.
//   contradicaoHoras  : objeto (#5, OPCIONAL — o caso-escola). Ids do par
//                       contraditório e a prosa do ponto a decidir da
//                       Caderneta (src/data/cartas.js, CONTRADICAO_HORAS).
//                       O motor jamais a lê; ausente ⇒ sem ponto a decidir.
//   telegrama         : objeto (Comarca E3 §4.6, OPCIONAL — casos gerados
//                       com nó satélite). O registro durável a distância:
//                       { destino, via, latencia, resposta }. `latencia` em
//                       horas de jogo; `resposta` é a DEFINIÇÃO da carta que
//                       o fio entrega ({ textoDisplay, termoCarimbo,
//                       descricao, tagsOcultas }) — o store a registra quando
//                       o relógio vence a latência (expedir + viajar). As
//                       tags da resposta são as do registro (o motor as lê
//                       como qualquer carta; o campo em si não é regra).
//
// Regra de ouro do schema: NADA de funções no pacote — só dado. Os acessores
// (obterSuspeito, obterDefinicaoCarta, resolverEstadoCarta…) vivem NESTE
// módulo, operando sobre o caso carregado; nunca dentro do objeto serializado.
//
// ---------------------------------------------------------------------
// VOCABULÁRIO DE SLOTS (resource binding — FASE 4):
// ---------------------------------------------------------------------
// A prosa das cartas/depoimentos pode injetar SUBSTANTIVOS de entidade a
// partir deste pacote (nunca frases livres — o guia de estilo rege a prosa).
// A resolução vive em src/logic/interpolar.js; a guarda do qa.mjs valida que
// todo slot presente no pacote resolve. Vocabulário fechado:
//
//   {suspeito:ID.CAMPO}  → suspeitos[id=ID][CAMPO]  (ex.: .nome → "Silas Crane")
//   {vitima.nome}        → verdadeDeOuro.vitima      (string; único campo: nome)
//   {hora:CAMPO}         → formatHora(parametrosCena[CAMPO] ?? verdadeDeOuro[CAMPO])
//   {instrumento.nome}   → rótulo de verdadeDeOuro.instrumentoCorreto
//
// Convenção de conversão: um literal só vira slot se o texto renderizado
// ficar byte-idêntico ao atual (critério duro da FASE 4).
// =====================================================================

import { SEED_TUTORIAL, SUSPEITOS } from './seed.js';
import { CARTAS, CONTRADICAO_HORAS, resolverEstadoCarta as resolverEstadoCartaCru } from './cartas.js';
import { LOCALIDADES } from './localidades.js';
import { NOS_MAPA, LEADS_DESBLOQUEIO, CUSTO_ENTRE_GRUPOS } from './mapa.js';
import { DIALOGOS } from './dialogos.js';
import { ESTADO_SUSPEITO_INICIAL, CONSEQUENCIAS_CONFRONTO } from './confrontos.js';
import { PASSOS_ABERTURA, PERGUNTAS_BRIEFING, OPCOES_PERSONAGEM } from './abertura.js';
import { PLANTA_RELOJOARIA } from './planta_relojoaria.js';
import { APARENCIAS_CURADAS, PERSONAGEM_POR_LOCALIDADE, NOMES_NAO_SUSPEITOS } from './aparencias.js';
import { ELENCO_TUTORIAL } from './papeis.js';
import { ECOS_MESTRE_TUTORIAL } from './ecos_mestre.js';
import { HORAS_CHEGADA_CENA, CALENDARIO_PADRAO } from '../logic/tempo.js';
import { AMBIENTE_PADRAO } from '../logic/tempo_morte.js';

// Campos obrigatórios de um pacote válido (usados pela guarda do qa.mjs).
export const CAMPOS_OBRIGATORIOS_PACOTE = [
  'id',
  'verdadeDeOuro',
  'suspeitos',
  'cartas',
  'localidades',
  'nosMapa',
  'leads',
  'custos',
  'dialogos',
  'confrontos',
  'abertura',
  'parametrosCena',
];

// ---------------------------------------------------------------------
// Montador do caso-escola "A Hora Emprestada": agrega os módulos atuais
// num único objeto serializável. Os valores ANTES cravados no motor
// (chegada às 13h, ambiente a 11°C, calendário 14/out/1893) entram como
// parametrosCena, com os valores de hoje como default — o motor deixa de
// os supor e passa a lê-los do pacote.
// ---------------------------------------------------------------------
export function montarPacoteTutorial() {
  return {
    id: SEED_TUTORIAL.id,
    verdadeDeOuro: SEED_TUTORIAL,
    suspeitos: SUSPEITOS,
    cartas: CARTAS,
    localidades: LOCALIDADES,
    nosMapa: NOS_MAPA,
    leads: LEADS_DESBLOQUEIO,
    custos: CUSTO_ENTRE_GRUPOS,
    dialogos: DIALOGOS,
    confrontos: {
      estadoInicial: ESTADO_SUSPEITO_INICIAL,
      consequencias: CONSEQUENCIAS_CONFRONTO,
    },
    abertura: {
      passos: PASSOS_ABERTURA,
      perguntas: PERGUNTAS_BRIEFING,
      opcoesPersonagem: OPCOES_PERSONAGEM,
    },
    parametrosCena: {
      horasChegada: HORAS_CHEGADA_CENA,
      ambiente: AMBIENTE_PADRAO,
      calendario: { ...CALENDARIO_PADRAO },
      // OS-R2: o nó onde o perito põe o pé. Desde a cena única, a relojoaria
      // inteira é um nó só — e é nele que a manhã começa. Os casos gerados
      // não declaram o campo e continuam a chegar ao seu nó `cena`.
      noChegada: 'relojoaria',
    },
    // Camadas visuais opcionais — o motor jamais as lê. Ausentes, o jogo
    // cai no procedural (contrato de assets, FASE 2 em diante).
    plantas: { relojoaria: PLANTA_RELOJOARIA },
    aparencias: { curadas: APARENCIAS_CURADAS, porLocalidade: PERSONAGEM_POR_LOCALIDADE, nomes: NOMES_NAO_SUSPEITOS },
    // Metadado do gerador (FASE 5), OPCIONAL — o motor jamais o lê. Mapa de
    // id de entidade → id de papel dramático (src/data/papeis.js). É o casting
    // que o futuro gerador escalará; aqui, o casting anotado do caso-escola.
    papeisDramaticos: { ...ELENCO_TUTORIAL },
    // Prosa do tutorial (FASE 6), OPCIONAL — o motor jamais a lê. A fala do
    // legista na retentativa, por código de falha. Ausente ⇒ sem mestre, sem
    // eco (modo procedural).
    ecosDoMestre: ECOS_MESTRE_TUTORIAL,
    // #5 (OPCIONAL) — a contradição de horas: ids do par e prosa do ponto a
    // decidir (src/data/cartas.js). O motor jamais a lê; ausente ⇒ o caso não
    // tem o ponto a decidir (os gerados, hoje).
    contradicaoHoras: CONTRADICAO_HORAS,
  };
}

// ---------------------------------------------------------------------
// O CASO CARREGADO no módulo. Nasce com o caso-escola (default), para que
// a importação de qualquer consumidor já encontre um caso pronto. O store
// e o gerador futuro trocam-no por `carregarCaso`. Determinístico: nenhum
// sorteio, nenhuma data de relógio — pura agregação de dados versionados.
// ---------------------------------------------------------------------
let casoCarregado = montarPacoteTutorial();

// Substitui o caso corrente. Todas as leituras subsequentes (accessors,
// estadoInicialCaso do store) passam a sair deste pacote.
export function carregarCaso(pacote) {
  casoCarregado = pacote;
  return casoCarregado;
}

// O pacote do caso corrente (nunca nulo: default = tutorial).
export function obterCaso() {
  return casoCarregado;
}

// ---------------------------------------------------------------------
// Acessores de consulta sobre o caso carregado (só leitura de dado). São a
// porta única para suspeitos e cartas — nenhum outro módulo importa
// seed.js/cartas.js.
// ---------------------------------------------------------------------

export function obterVerdadeDeOuro() {
  return casoCarregado.verdadeDeOuro;
}

export function obterSuspeitos() {
  return casoCarregado.suspeitos;
}

export function obterSuspeito(id) {
  return casoCarregado.suspeitos.find((s) => s.id === id) || null;
}

export function obterCartas() {
  return casoCarregado.cartas;
}

export function obterDefinicaoCarta(id) {
  return casoCarregado.cartas.find((c) => c.id === id) || null;
}

export function obterParametrosCena() {
  return casoCarregado.parametrosCena;
}

// Casting do caso (metadado do gerador, FASE 5): id de entidade → id de papel.
// Objeto vazio quando o pacote não traz papéis (modo procedural sem anotação).
export function obterPapeisDramaticos() {
  return casoCarregado.papeisDramaticos || {};
}

// Prosa do eco do legista (FASE 6, OPCIONAL): { titulo, porCodigo } ou null
// quando o pacote não a traz (modo procedural — sem mestre, sem eco).
export function obterEcosDoMestre() {
  return casoCarregado.ecosDoMestre || null;
}

// Eventos de interferência do caso (FASE 4, OPCIONAL): a lista de eventos
// contingentes pré-computados, ou [] quando o pacote não traz interferência
// (o tutorial). O runtime só VERIFICA gatilhos e aplica — nenhuma decisão.
export function obterInterferencias() {
  return casoCarregado.interferencias?.eventos || [];
}

// ---------------------------------------------------------------------
// Acessores de MAPA, LOCALIDADES, DIÁLOGOS e ABERTURA do caso carregado
// (FASE 6 do gerador): o runtime deixa de importar mapa.js/localidades.js/
// dialogos.js/abertura.js diretamente — todo caso (tutorial ou gerado) é
// lido daqui. Com o pacote default (o caso-escola), o comportamento é
// byte-idêntico ao anterior.
// ---------------------------------------------------------------------

export function obterNosMapa() {
  return casoCarregado.nosMapa;
}

export function obterNo(id) {
  return casoCarregado.nosMapa.find((n) => n.id === id) || null;
}

// Custo em horas para viajar de um nó a outro (tabela `custos` do pacote,
// chaveada por "grupoOrigem|grupoDestino").
export function custoViagem(idOrigem, idDestino) {
  const origem = obterNo(idOrigem);
  const destino = obterNo(idDestino);
  if (!origem || !destino) return 0;
  return casoCarregado.custos[`${origem.grupo}|${destino.grupo}`] ?? 0;
}

export function obterLocalidades() {
  return casoCarregado.localidades;
}

export function obterLocalidade(id) {
  return casoCarregado.localidades.find((l) => l.id === id) || null;
}

// Árvores de interrogatório do caso. Os casos gerados também as trazem
// (OS da árvore procedural: uma árvore por suspeito, embutida na
// delegacia); {} fica só como fallback defensivo de pacote sem diálogo.
export function obterDialogos() {
  return casoCarregado.dialogos || {};
}

export function obterDialogo(id) {
  return (casoCarregado.dialogos || {})[id] || null;
}

// A abertura do caso: { passos, perguntas, opcoesPersonagem }.
export function obterAbertura() {
  return casoCarregado.abertura;
}

// Quem recebe o perito em cada localidade (camada VISUAL opcional do
// pacote — retrato decorativo; o motor jamais lê).
export function obterPersonagemDaLocalidade(localidadeId) {
  return casoCarregado.aparencias?.porLocalidade?.[localidadeId] || null;
}

// #5 — a contradição de horas do caso (ids do par + prosa do ponto a
// decidir), ou null quando o caso não a tem. Camada narrativa/UI.
export function obterContradicaoHoras() {
  return casoCarregado.contradicaoHoras || null;
}

// Nome de exibição de QUALQUER personagem do caso: suspeito (elenco) ou
// não-suspeito (aparencias.nomes — o guarda que recebe no posto).
// Camada narrativa; devolve null quando o pacote não conhece o id.
export function obterNomePersonagem(id) {
  if (!id) return null;
  const suspeito = obterSuspeito(id);
  if (suspeito) return suspeito.nome;
  return casoCarregado.aparencias?.nomes?.[id] || null;
}

// A maquete da vila do caso (camada VISUAL opcional — casos gerados; o
// motor jamais a lê). Null no tutorial: lá o diorama vem do mapa espacial
// estático (src/data/mapa_espacial.js).
export function obterMaquete() {
  return casoCarregado.maquete || null;
}

// Prosa do eco pós-caso sobre interferências (FASE 4, OPCIONAL):
// { titulo, porChave } ou null. O motor jamais a lê.
export function obterEcosInterferencia() {
  return casoCarregado.ecosInterferencia || null;
}

// Resolvedor de estado da carta em função do IPM. É função PURA (opera sobre
// uma definição já obtida) — re-exportada aqui para que o consumidor não
// precise tocar cartas.js diretamente.
export const resolverEstadoCarta = resolverEstadoCartaCru;
