// =====================================================================
// AMOSTRAGEM DETERMINÍSTICA DE ELENCO — o coração da FASE 1 do gerador
// (design em docs/game-design-simulacao.md §4.1).
//
// Este módulo é GERADOR-FACING: vive em src/gerador/ e o runtime JAMAIS o
// importa (guarda no qa.mjs). A importação de src/logic/hash.js é no
// sentido permitido (o gerador lê a lógica; a lógica nunca lê o gerador).
//
// DETERMINISMO: toda decisão sai de hashString sobre uma CHAVE SALGADA.
// Regra de ouro: NUNCA reusar a mesma chave para duas decisões distintas
// (produziria correlações fantasmas entre campos). Convenção de sal:
//   `${salBase}|elenco|${indice}|<decisao>[|<tentativa>]`
// Mesma seed → mesmo elenco, byte a byte (checado no qa.mjs).
//
// Viés conhecido e aceito: `hashString % total` favorece os primeiros
// itens quando `total` não divide 2^31 — com somas de peso pequenas o
// desvio é da ordem de 10^-8, irrelevante para o design.
//
// ORDEM DE AMOSTRAGEM (a composição de arquétipos pesa mais que o ruído
// fino de atributos — §4.1): arquétipo → gênero → faixa etária → idade →
// nome → atributos → traits → motivo potencial → quantização.
// =====================================================================

import { hashString } from '../logic/hash.js';
import { ARQUETIPOS, FAIXAS_IDADE, NOMES, SOBRENOMES } from './arquetipos.js';
import { quantizarComportamentos } from './quantizacao.js';

// Sorteia de uma lista ponderada [{ valor, peso }] de forma determinística.
// Pesos inteiros ≥ 0; soma zero devolve null.
export function sortearPonderado(opcoes, chave) {
  const total = (opcoes || []).reduce((soma, o) => soma + o.peso, 0);
  if (total <= 0) return null;
  let alvo = hashString(chave) % total;
  for (const opcao of opcoes) {
    alvo -= opcao.peso;
    if (alvo < 0) return opcao.valor;
  }
  return opcoes[opcoes.length - 1].valor; // inalcançável; cinto de segurança
}

// Açúcar para priors de atributo: [p1..p5] → valor inteiro 1..5.
export function sortearAtributo(pesos, chave) {
  return sortearPonderado(
    pesos.map((peso, i) => ({ valor: i + 1, peso })),
    chave
  );
}

// Sal-base da seed: aceita string ('vila_do_moinho') ou objeto com id.
function salDaSeed(seed) {
  return typeof seed === 'string' ? seed : seed?.id || 'caso';
}

// Coorte de nascimento para o batismo (KB §6): nascido até 1850
// (idade ≥ 43 em 1893) usa os nomes velhos; senão, os jovens.
function coorteDeNomes(idade) {
  return idade >= 43 ? 'coorte_1820_50' : 'coorte_1860_75';
}

// Nome completo ÚNICO no elenco. Sobrenome repetido é permitido e até
// desejado (KB §6); só o par nome+sobrenome não pode repetir — e evita-se
// nome igual ao sobrenome ("Thomas Thomas": real na época, cômico no
// jogo). Primeiro tenta por hash com sal de tentativa; esgotadas as
// tentativas, faz uma varredura determinística FINITA por todos os pares
// (jamais laço aberto).
function amostrarNomeUnico(sal, genero, idade, nomesUsados) {
  const nomes = NOMES[genero][coorteDeNomes(idade)];
  const MAX_TENTATIVAS = 50;
  for (let tentativa = 0; tentativa < MAX_TENTATIVAS; tentativa++) {
    const nome = nomes[hashString(`${sal}|nome|${tentativa}`) % nomes.length];
    const sobrenome = SOBRENOMES[hashString(`${sal}|sobrenome|${tentativa}`) % SOBRENOMES.length];
    const completo = `${nome} ${sobrenome}`;
    if (nome !== sobrenome && !nomesUsados.has(completo)) return completo;
  }
  // Varredura de fallback: percorre todos os pares a partir de um ponto
  // derivado do sal — encontra combinação livre se alguma existir.
  const base = hashString(`${sal}|nome|varredura`);
  const totalPares = nomes.length * SOBRENOMES.length;
  for (let i = 0; i < totalPares; i++) {
    const indice = (base + i) % totalPares;
    const nome = nomes[indice % nomes.length];
    const sobrenome = SOBRENOMES[Math.floor(indice / nomes.length)];
    const completo = `${nome} ${sobrenome}`;
    if (nome !== sobrenome && !nomesUsados.has(completo)) return completo;
  }
  // Pool esgotado (elenco maior que os pares possíveis): numerar é o
  // último recurso determinístico — nunca acontece com elencos de vila.
  return `${nomes[base % nomes.length]} ${SOBRENOMES[base % SOBRENOMES.length]} ${nomesUsados.size}`;
}

// Amostra o personagem de índice `indice` do elenco da seed. `contexto` é
// o estado interno do elenco em construção (gerido por gerarElenco):
//   { nomesUsados: Set<string>, unicosUsados: Set<string> }
export function amostrarPersonagem(seed, indice, contexto) {
  const sal = `${salDaSeed(seed)}|elenco|${indice}`;

  // 1. Arquétipo, pela frequência demográfica — excluindo os únicos-na-vila
  // já escalados (a trava é parte da amostragem, não pós-processamento).
  const elegiveis = Object.values(ARQUETIPOS).filter(
    (a) => !(a.unicoNaVila && contexto.unicosUsados.has(a.id))
  );
  const arquetipoId = sortearPonderado(
    elegiveis.map((a) => ({ valor: a.id, peso: a.frequencia })),
    `${sal}|arquetipo`
  );
  const arquetipo = ARQUETIPOS[arquetipoId];
  if (arquetipo.unicoNaVila) contexto.unicosUsados.add(arquetipoId);

  // 2. Gênero, faixa etária e idade exata.
  const genero = sortearPonderado(
    Object.entries(arquetipo.generos).map(([valor, peso]) => ({ valor, peso })),
    `${sal}|genero`
  );
  const faixa = sortearPonderado(
    arquetipo.faixasIdade.map((f) => ({ valor: f.faixa, peso: f.peso })),
    `${sal}|faixaIdade`
  );
  const [idadeMinima, idadeMaxima] = FAIXAS_IDADE[faixa];
  const idade = idadeMinima + (hashString(`${sal}|idade`) % (idadeMaxima - idadeMinima + 1));

  // 3. Nome completo único (coorte de batismo depende da idade).
  const nome = amostrarNomeUnico(sal, genero, idade, contexto.nomesUsados);
  contexto.nomesUsados.add(nome);

  // 4. Atributos, dos priors do arquétipo (o ruído fino, por último).
  const atributos = {
    FOR: sortearAtributo(arquetipo.priors.FOR, `${sal}|atributo|FOR`),
    INT: sortearAtributo(arquetipo.priors.INT, `${sal}|atributo|INT`),
    WIS: sortearAtributo(arquetipo.priors.WIS, `${sal}|atributo|WIS`),
    CHA: sortearAtributo(arquetipo.priors.CHA, `${sal}|atributo|CHA`),
  };

  // 5. Traits do pool: o primeiro sempre; um segundo (distinto) em ~1/3
  // dos personagens, se o pool comportar.
  const pool = arquetipo.traits;
  const traits = [pool[hashString(`${sal}|trait|1`) % pool.length]];
  if (pool.length >= 2 && hashString(`${sal}|temSegundoTrait`) % 3 === 0) {
    const restantes = pool.filter((t) => t !== traits[0]);
    traits.push(restantes[hashString(`${sal}|trait|2`) % restantes.length]);
  }

  // 6. Motivo potencial (semente para o gerador de casos promover a móbil).
  const motivoPotencial =
    arquetipo.motivosPotenciais[hashString(`${sal}|motivo`) % arquetipo.motivosPotenciais.length];

  // 7. Personagem: JSON puro, nenhuma função (mesma regra de ouro do
  // pacote de caso). `pacoteEspacial` é slot da Fase 2.
  return {
    id: `gen_${indice}_${arquetipoId}`,
    arquetipo: arquetipoId,
    profissao: arquetipo.profissoes[genero],
    classeSocial: arquetipo.classeSocial,
    nome,
    genero,
    idade,
    atributos,
    traits,
    motivoPotencial,
    comportamentos: quantizarComportamentos(atributos, traits),
    pacoteEspacial: null,
  };
}

// API principal da fase: o elenco completo de uma seed, ordenado por
// índice. Mesma seed e mesmo n → mesmo array, byte a byte.
export function gerarElenco(seed, n = 8) {
  const contexto = { nomesUsados: new Set(), unicosUsados: new Set() };
  const elenco = [];
  for (let indice = 0; indice < n; indice++) {
    elenco.push(amostrarPersonagem(seed, indice, contexto));
  }
  return elenco;
}
