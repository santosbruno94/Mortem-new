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
//   aparencias        : objeto (visual, OPCIONAL). { curadas, porLocalidade }.
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
import { CARTAS, resolverEstadoCarta as resolverEstadoCartaCru } from './cartas.js';
import { LOCALIDADES } from './localidades.js';
import { NOS_MAPA, LEADS_DESBLOQUEIO, CUSTO_ENTRE_GRUPOS } from './mapa.js';
import { DIALOGOS } from './dialogos.js';
import { ESTADO_SUSPEITO_INICIAL, CONSEQUENCIAS_CONFRONTO } from './confrontos.js';
import { PASSOS_ABERTURA, PERGUNTAS_BRIEFING, OPCOES_PERSONAGEM } from './abertura.js';
import { PLANTA_RELOJOARIA } from './planta_relojoaria.js';
import { APARENCIAS_CURADAS, PERSONAGEM_POR_LOCALIDADE } from './aparencias.js';
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
// (chegada às 11h, ambiente a 11°C, calendário 14/out/1893) entram como
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
    },
    // Camadas visuais opcionais — o motor jamais as lê. Ausentes, o jogo
    // cai no procedural (contrato de assets, FASE 2 em diante).
    plantas: { relojoaria: PLANTA_RELOJOARIA },
    aparencias: { curadas: APARENCIAS_CURADAS, porLocalidade: PERSONAGEM_POR_LOCALIDADE },
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

// Resolvedor de estado da carta em função do IPM. É função PURA (opera sobre
// uma definição já obtida) — re-exportada aqui para que o consumidor não
// precise tocar cartas.js diretamente.
export const resolverEstadoCarta = resolverEstadoCartaCru;
