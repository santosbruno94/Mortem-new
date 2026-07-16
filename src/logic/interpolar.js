// =====================================================================
// Interpolação de textos narrativos (§12) + resource binding (FASE 4).
//
//   {detective.campo}            → valor do campo (name, surname, title…)
//   {g:texto masc.|texto fem.}   → flexão pelo pronome do detective
//
// SLOTS DE CASO (resource binding, técnica Starfreighter): substantivos de
// entidade injetados a partir do PACOTE DE CASO (FASE 1), nunca composição
// livre de frase — o guia de estilo rege a prosa; o slot só troca o nome.
// Vocabulário fechado (o mesmo documentado no schema de src/data/pacote_caso.js):
//
//   {suspeito:ID.CAMPO}  → caso.suspeitos, entidade de id ID, campo CAMPO
//                          (ex.: {suspeito:silas_crane.nome} → "Silas Crane")
//   {vitima.nome}        → caso.verdadeDeOuro.vitima (a vítima é uma string)
//   {hora:CAMPO}         → formatHora de caso.parametrosCena[CAMPO] ou, na
//                          falta, caso.verdadeDeOuro[CAMPO] (hora absoluta →
//                          "HHhMM", pelo calendário do pacote)
//   {instrumento.nome}   → rótulo de caso.verdadeDeOuro.instrumentoCorreto
//
// Esta é camada de APRESENTAÇÃO: lê a camada narrativa/visual do pacote (como
// já faz ProsaComTermos). Não é função de lógica/veredicto — jamais lê
// tagsOcultas. Determinística: nenhum sorteio, nenhuma data de relógio.
// =====================================================================

import { obterCaso } from '../data/pacote_caso.js';
import { formatHora } from './tempo.js';
import { ROTULOS_INSTRUMENTO } from '../data/rotulos.js';

// Fonte (string) do padrão de slot de caso. Grupos de captura, em ordem:
//   1 = id do suspeito     2 = campo do suspeito
//   3 = campo da vítima
//   4 = campo de hora
//   5 = campo do instrumento
const SLOT_CASO_SRC =
  '\\{(?:suspeito:(\\w+)\\.(\\w+)|vitima\\.(\\w+)|hora:(\\w+)|instrumento\\.(\\w+))\\}';

// Resolve UM slot contra um pacote. Devolve string (valor) ou null (não
// resolve: entidade ou campo inexistente). Nunca lança.
function valorSlotCaso(caso, g) {
  if (!caso) return null;
  const { suspeitoId, suspeitoCampo, vitimaCampo, horaCampo, instrCampo } = g;

  if (suspeitoId != null) {
    const suspeito = (caso.suspeitos || []).find((x) => x.id === suspeitoId);
    if (!suspeito) return null;
    const valor = suspeito[suspeitoCampo];
    return valor == null ? null : String(valor);
  }

  if (vitimaCampo != null) {
    // A vítima é uma string no pacote (verdadeDeOuro.vitima). O único campo
    // narrativo dela é o nome.
    const vitima = caso.verdadeDeOuro && caso.verdadeDeOuro.vitima;
    if (vitima == null || vitimaCampo !== 'nome') return null;
    return String(vitima);
  }

  if (horaCampo != null) {
    const pc = caso.parametrosCena || {};
    const vo = caso.verdadeDeOuro || {};
    const fonte = horaCampo in pc ? pc[horaCampo] : vo[horaCampo];
    if (typeof fonte !== 'number') return null;
    return formatHora(fonte, pc.calendario);
  }

  if (instrCampo != null) {
    if (instrCampo !== 'nome') return null;
    const inst = caso.verdadeDeOuro && caso.verdadeDeOuro.instrumentoCorreto;
    const nome = ROTULOS_INSTRUMENTO[inst];
    return nome == null ? null : nome;
  }

  return null;
}

// Substitui todos os slots de caso de um texto. Slot que não resolve fica
// LITERAL (não vira ''): a falha é visível e a guarda do qa.mjs a barra antes
// de qualquer commit — melhor um "{suspeito:x.nome}" gritando na tela do que
// um buraco mudo.
export function substituirSlotsCaso(texto, caso) {
  if (!texto) return texto;
  const re = new RegExp(SLOT_CASO_SRC, 'g');
  return texto.replace(re, (bruto, suspeitoId, suspeitoCampo, vitimaCampo, horaCampo, instrCampo) => {
    const valor = valorSlotCaso(caso, { suspeitoId, suspeitoCampo, vitimaCampo, horaCampo, instrCampo });
    return valor == null ? bruto : valor;
  });
}

// Lista os slots de caso de um texto que NÃO resolvem contra o pacote dado
// (usada pela guarda estática do qa.mjs). Devolve os marcadores brutos.
export function slotsNaoResolvidos(texto, caso) {
  const faltas = [];
  if (!texto) return faltas;
  const re = new RegExp(SLOT_CASO_SRC, 'g');
  let m;
  while ((m = re.exec(texto)) !== null) {
    const [bruto, suspeitoId, suspeitoCampo, vitimaCampo, horaCampo, instrCampo] = m;
    const valor = valorSlotCaso(caso, { suspeitoId, suspeitoCampo, vitimaCampo, horaCampo, instrCampo });
    if (valor == null) faltas.push(bruto);
  }
  return faltas;
}

export function interpolar(texto, detective) {
  if (!texto) return '';
  let resultado = texto.replace(/\{detective\.(\w+)\}/g, (_, campo) =>
    detective && detective[campo] != null ? detective[campo] : ''
  );
  resultado = resultado.replace(/\{g:([^|}]*)\|([^}]*)\}/g, (_, masculino, feminino) =>
    detective && detective.pronoun === 'ela' ? feminino : masculino
  );
  // Slots de caso por último: leem o pacote carregado (nunca dependem do
  // detective). A ordem não importa — as sintaxes não se sobrepõem.
  resultado = substituirSlotsCaso(resultado, obterCaso());
  return resultado;
}
