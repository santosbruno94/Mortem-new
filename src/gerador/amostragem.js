// =====================================================================
// AMOSTRAGEM DETERMINÍSTICA DE ELENCO — o coração da FASE 1 do gerador
// (design em docs/game-design-simulacao.md §4.1), reformada pela OS
// priors compostos (docs/os-priors-compostos-e-variedade-do-elenco.md,
// F2): o corpo é do ofício; o acesso é do berço; a mente é da psique
// dentro do acesso.
//
// Este módulo é GERADOR-FACING: vive em src/gerador/ e o runtime JAMAIS o
// importa (guarda no qa.mjs). A importação de src/logic/hash.js é no
// sentido permitido (o gerador lê a lógica; a lógica nunca lê o gerador).
//
// DETERMINISMO: toda decisão sai de hashDecisao (hash_gerador.js — o
// re-hash que DECORRELACIONA chaves-irmãs; achado B✱ da triagem F0)
// sobre uma CHAVE SALGADA. Regra de ouro: NUNCA reusar a mesma chave
// para duas decisões distintas. Convenção de sal:
//   `${salBase}|elenco|${indice}|<decisao>[|<tentativa>]`
// Mesma seed → mesmo elenco, byte a byte (checado no qa.mjs).
//
// ORDEM DE AMOSTRAGEM (OS priors compostos §3.3, normativa): arquétipo →
// gênero → faixa etária → idade → nome → VETOR (+ polaridade) →
// atributos COMPOSTOS → traits → motivo potencial → quantização.
// A polaridade não influencia atributos e permanece derivada na psique
// (vetores_psiquicos.js) sobre o MESMO sal — ordem-equivalente.
//
// ATRIBUTO COMPOSTO (§3.2): peso efetivo do valor i =
// peso_arquetipo[i] × tilt_vetor[i]. FOR fica FORA do composto (N2 — o
// corpo não é da psique): sorteia só do prior do arquétipo e NUNCA entra
// na cascata de forçamento. Quando o caso força o vetor de alguém
// (réu/isca, caso.js), INT/WIS/CHA e a quantização são RE-derivados com
// o sufixo de sal `|forcado|t<k>` — a cascata (§3.3, guarda G3).
// =====================================================================

import { hashDecisao } from './hash_gerador.js';
import { ARQUETIPOS, FAIXAS_IDADE, NOMES, SOBRENOMES } from './arquetipos.js';
import { VETORES_PSIQUICOS, TILT_NEUTRO, sortearVetor } from './vetores_psiquicos.js';
import { quantizarComportamentos } from './quantizacao.js';

// Sorteia de uma lista ponderada [{ valor, peso }] de forma determinística.
// Pesos inteiros ≥ 0; soma zero devolve null.
export function sortearPonderado(opcoes, chave) {
  const total = (opcoes || []).reduce((soma, o) => soma + o.peso, 0);
  if (total <= 0) return null;
  let alvo = hashDecisao(chave) % total;
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

// ---------------------------------------------------------------------
// ATRIBUTOS COMPOSTOS (OS priors compostos §3.2–§3.3). Função PURA — é a
// via única de derivação de INT/WIS/CHA, na amostragem normal
// (sufixoForcado = '') e na cascata de forçamento de vetor
// (sufixoForcado = '|forcado|t<k>', chamada por caso.js; guarda G3).
// FOR não passa por aqui: não é jusante do vetor (N2).
// ---------------------------------------------------------------------
export function derivarAtributosCompostos(salBase, indice, arquetipoId, vetorId, sufixoForcado = '') {
  const arquetipo = ARQUETIPOS[arquetipoId];
  const tilt = VETORES_PSIQUICOS[vetorId]?.tiltAtributos || {};
  const compor = (attr) => {
    const pesos = arquetipo.priors[attr];
    const multiplicadores = tilt[attr] || TILT_NEUTRO;
    const efetivos = pesos.map((p, i) => p * multiplicadores[i]);
    return sortearAtributo(
      efetivos,
      `${salBase}|elenco|${indice}|atributo-composto:${attr}${sufixoForcado}`
    );
  };
  return { INT: compor('INT'), WIS: compor('WIS'), CHA: compor('CHA') };
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
  // v3 (F4 da OS priors compostos §2.6): prenome PONDERADO por frequência
  // de batismo (Galbi 2002 — o sorteio uniforme era o anacronismo);
  // sobrenome segue uniforme por decisão registrada em arquetipos.js.
  const nomes = NOMES[genero][coorteDeNomes(idade)];
  const MAX_TENTATIVAS = 50;
  for (let tentativa = 0; tentativa < MAX_TENTATIVAS; tentativa++) {
    const nome = sortearPonderado(
      nomes.map((n) => ({ valor: n.nome, peso: n.peso })),
      `${sal}|nome|${tentativa}`
    );
    const sobrenome = SOBRENOMES[hashDecisao(`${sal}|sobrenome|${tentativa}`) % SOBRENOMES.length];
    const completo = `${nome} ${sobrenome}`;
    if (nome !== sobrenome && !nomesUsados.has(completo)) return completo;
  }
  // Varredura de fallback: percorre todos os pares a partir de um ponto
  // derivado do sal — encontra combinação livre se alguma existir.
  const base = hashDecisao(`${sal}|nome|varredura`);
  const totalPares = nomes.length * SOBRENOMES.length;
  for (let i = 0; i < totalPares; i++) {
    const indice = (base + i) % totalPares;
    const nome = nomes[indice % nomes.length].nome;
    const sobrenome = SOBRENOMES[Math.floor(indice / nomes.length)];
    const completo = `${nome} ${sobrenome}`;
    if (nome !== sobrenome && !nomesUsados.has(completo)) return completo;
  }
  // Pool esgotado (elenco maior que os pares possíveis): numerar é o
  // último recurso determinístico — nunca acontece com elencos de vila.
  return `${nomes[base % nomes.length].nome} ${SOBRENOMES[base % SOBRENOMES.length]} ${nomesUsados.size}`;
}

// Amostra o personagem de índice `indice` do elenco da seed. `contexto` é
// o estado interno do elenco em construção (gerido por gerarElenco):
//   { nomesUsados: Set<string>, unicosUsados: Set<string> }
export function amostrarPersonagem(seed, indice, contexto) {
  const salBase = salDaSeed(seed);
  const sal = `${salBase}|elenco|${indice}`;

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
  const idade = idadeMinima + (hashDecisao(`${sal}|idade`) % (idadeMaxima - idadeMinima + 1));

  // 3. Nome completo único (coorte de batismo depende da idade).
  const nome = amostrarNomeUnico(sal, genero, idade, contexto.nomesUsados);
  contexto.nomesUsados.add(nome);

  // 4. VETOR-BASE do personagem (OS priors compostos §3.3): o sorteio da
  // psique (sal `|psique|vet_<indice>`, vetores_psiquicos.js) sobe para
  // ANTES dos atributos, porque a mente é da psique dentro do acesso do
  // ofício. O RÓTULO não entra no personagem (morre no log de build da
  // psique, que re-deriva este mesmo sorteio pelo mesmo sal); aqui ele
  // só dá o tilt.
  const vetorBaseId = sortearVetor(salBase, indice, arquetipoId);

  // 5. Atributos: FOR do prior puro do ofício (N2 — fora do composto e
  // da cascata); INT/WIS/CHA compostos (prior do arquétipo × tilt do
  // vetor), pela via única derivarAtributosCompostos.
  const atributos = {
    FOR: sortearAtributo(arquetipo.priors.FOR, `${sal}|atributo-composto:FOR`),
    ...derivarAtributosCompostos(salBase, indice, arquetipoId, vetorBaseId),
  };

  // 6. Traits do pool: o primeiro sempre; um segundo (distinto) com
  // chance POR ARQUÉTIPO (F4 §2.4: tagarelas de balcão 3/6, taciturnos
  // de ofício 1/6, o resto 2/6 — a moeda universal 1/3 aposentou-se).
  // Sal NOVO `segundoTrait-v2` (a decisão mudou de forma; regra de ouro).
  const pool = arquetipo.traits;
  const traits = [pool[hashDecisao(`${sal}|trait|1`) % pool.length]];
  const chanceSegundo = arquetipo.chanceSegundoTrait ?? 2;
  if (pool.length >= 2 && hashDecisao(`${sal}|segundoTrait-v2`) % 6 < chanceSegundo) {
    const restantes = pool.filter((t) => t !== traits[0]);
    traits.push(restantes[hashDecisao(`${sal}|trait|2`) % restantes.length]);
  }

  // 7. Motivo potencial (semente para o gerador de casos promover a móbil).
  const motivoPotencial =
    arquetipo.motivosPotenciais[hashDecisao(`${sal}|motivo`) % arquetipo.motivosPotenciais.length];

  // 8. Personagem: JSON puro, nenhuma função (mesma regra de ouro do
  // pacote de caso) e NENHUM rótulo de psique. `pacoteEspacial` é slot
  // da Fase 2.
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
