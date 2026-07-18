// =====================================================================
// ARQUÉTIPOS E PRIORS DEMOGRÁFICOS DE 1893 — dados do gerador (FASE 1;
// design em docs/game-design-simulacao.md §4.1).
//
// Este arquivo é DADO PURO e GERADOR-FACING: vive em src/gerador/ e o
// runtime JAMAIS o importa (guarda no qa.mjs). O arquétipo é a unidade
// estrutural de geração de personagem — a MATÉRIA SOCIAL da pessoa
// (profissão, classe, atributos prováveis) —, distinto do PAPEL dramático
// (src/data/papeis.js), que é a função no drama. O gerador futuro escala
// papéis EM personagens nascidos de arquétipos.
//
// REPRESENTAÇÃO DOS PRIORS: cada atributo é um array de 5 pesos inteiros;
// o índice i é o peso do valor i+1. Ex.: FOR: [0, 1, 4, 4, 1] = nunca 1,
// raramente 2, quase sempre 3–4. Pesos explícitos são auditáveis linha a
// linha e permitem qualquer forma de distribuição.
//
// PROVENIÊNCIA POR LINHA (regra do design §4.1, modelo do manifesto de
// assets): todo arquétipo e toda tabela auxiliar citam a fonte na KB
// (docs/kb-mundo-vitoriano/), sob a regra de fontes.md: nenhum dado
// quantitativo sem fonte. Priors de ATRIBUTO são estimativa de design
// grosseira (refináveis — problema de dados, não de sistema); frequências,
// gêneros, idades, nomes e motivos vêm do censo/da KB.
//
// NOTA DE DESIGN (§3.2): INT e WIS nunca são rigidamente acoplados em
// nenhum prior — os quatro quadrantes INT × WIS (fenótipos de assassino)
// precisam ser alcançáveis em qualquer arquétipo.
//
// NORMA N1 (OS priors compostos, §3.2): nenhum arquétipo tem peso 0 nos
// extremos de INT, WIS ou CHA — o prior codifica ACESSO (modo deslocado
// pela instrução/vida do ofício, cauda jamais zerada). FOR fica FORA da
// norma: os pisos duros por peso 0 permanecem onde o ofício forja o
// corpo. INT/WIS/CHA usam as CURVAS_DE_ACESSO canônicas abaixo (dossiê
// F1 §2.3 da OS; guarda G1 no qa.mjs).
// =====================================================================

// ---------------------------------------------------------------------
// CURVAS DE ACESSO (OS priors compostos, F2): 4 formas canônicas para
// INT/WIS/CHA, soma 12, cauda nunca zerada — a lavadeira PODE ser gênio
// (raro por peso, jamais impossível por zero). A atribuição por
// arquétipo é estimativa de design com direção documentada na KB
// (instrução formal, aritmética de balcão, ofício de corpo); refinável
// sem tocar sistema.
// ---------------------------------------------------------------------
export const CURVAS_DE_ACESSO = {
  baixo: [2, 4, 3, 2, 1], // modo 2 — a vida não deu porta
  medio: [1, 3, 4, 3, 1], // modo 3 — o comum
  alto: [1, 2, 3, 4, 2], // modo 4 — instrução/vida puxa para cima
  muito_alto: [1, 1, 3, 4, 3], // modo 4–5 — instrução formal plena
};

// Degraus da pirâmide social (KB demografia-e-sociedade.md §1).
export const CLASSES_SOCIAIS = [
  'gentry',
  'clero',
  'profissional',
  'comerciante',
  'artesao',
  'lavrador',
  'criadagem',
  'servico_do_condado', // o constable: uniforme do condado, fora dos oito degraus clássicos
];

// Faixas etárias fechadas usadas nos arquétipos: id → [mínima, máxima].
export const FAIXAS_IDADE = {
  '14_19': [14, 19],
  '20_29': [20, 29],
  '30_44': [30, 44],
  '45_59': [45, 59],
  '60_74': [60, 74],
};

// ---------------------------------------------------------------------
// NOMES por gênero × coorte de nascimento e SOBRENOMES do censo de 1881.
// Regra de coorte (amostragem.js): nascido até 1850 (idade ≥ 43 em 1893)
// usa a coorte velha; senão, a coorte jovem.
//
// v3 (F4 da OS priors compostos, dossiê §2.6): listas PONDERADAS — o
// sorteio uniforme era o anacronismo (Galbi 2002: em 1840, Mary = 18,7%
// de todas as meninas; top-3 ≈ 40%; top-10 = 75%). Pesos em 4 faixas:
// A (top-3) = 8; B (4º–10º) = 4; C (11º–30º) = 2; D (cauda) = 1 —
// top-3 ≈ 30% e top-10 ≈ 60%, entre a coorte 1840 e a 1880 (calibragem
// exata das faixas: chute calibrável registrado). Coorte jovem expandida
// pelo top-60 do ONS 1904 PODADO dos modismos pós-1885 (Doris, Gladys,
// Reginald, Stanley…, que nomeiam crianças, não adultos de 1893); coorte
// velha por Galbi c.1825 + clássicos bíblicos rurais. Diminutivos (Bess,
// Polly, Nell) são variação de PROSA, não batismo sorteável.
// ---------------------------------------------------------------------
const N = (nome, peso) => ({ nome, peso });
export const NOMES = {
  masculino: {
    coorte_1820_50: [
      N('William', 8), N('John', 8), N('Thomas', 8),
      N('George', 4), N('James', 4), N('Henry', 4), N('Charles', 4), N('Joseph', 4), N('Edward', 4), N('Samuel', 4),
      N('Richard', 2), N('Robert', 2), N('David', 2), N('Daniel', 2), N('Benjamin', 2), N('Isaac', 2),
      N('Francis', 2), N('Stephen', 2), N('Peter', 2), N('Matthew', 2), N('Andrew', 2), N('Philip', 2),
      N('Alfred', 2), N('Walter', 2), N('Edwin', 2), N('Josiah', 1), N('Jesse', 1), N('Levi', 1),
      N('Reuben', 1), N('Amos', 1), N('Caleb', 1), N('Eli', 1), N('Enoch', 1), N('Noah', 1),
      N('Seth', 1), N('Solomon', 1), N('Abraham', 1), N('Jacob', 1), N('Aaron', 1), N('Moses', 1),
      N('Luke', 1), N('Mark', 1), N('Simon', 1), N('Nathaniel', 1), N('Jonas', 1), N('Ezra', 1),
      N('Gideon', 1), N('Tobias', 1), N('Barnaby', 1), N('Giles', 1),
    ],
    coorte_1860_75: [
      N('William', 8), N('John', 8), N('Thomas', 8),
      N('George', 4), N('James', 4), N('Charles', 4), N('Henry', 4), N('Arthur', 4), N('Frederick', 4), N('Albert', 4),
      N('Ernest', 2), N('Walter', 2), N('Harry', 2), N('Frank', 2), N('Herbert', 2), N('Alfred', 2),
      N('Sidney', 2), N('Percy', 2), N('Edwin', 2), N('Joseph', 2), N('Edward', 2), N('Robert', 2),
      N('Samuel', 2), N('Richard', 2), N('Fred', 2), N('Jack', 2), N('Harold', 2), N('Leonard', 2),
      N('Horace', 1), N('Victor', 1), N('Bernard', 1), N('Francis', 1), N('Hugh', 1), N('Lawrence', 1),
      N('David', 1), N('Daniel', 1), N('Alexander', 1), N('Edgar', 1), N('Oliver', 1), N('Ralph', 1),
      N('Stephen', 1), N('Benjamin', 1), N('Philip', 1), N('Peter', 1), N('Wilfred', 1), N('Cecil', 1),
      N('Sydney', 1), N('Michael', 1), N('Patrick', 1), N('Maurice', 1),
    ],
  },
  feminino: {
    coorte_1820_50: [
      N('Mary', 8), N('Elizabeth', 8), N('Sarah', 8),
      N('Ann', 4), N('Jane', 4), N('Hannah', 4), N('Margaret', 4), N('Emma', 4), N('Eliza', 4), N('Martha', 4),
      N('Harriet', 2), N('Charlotte', 2), N('Susan', 2), N('Caroline', 2), N('Ellen', 2), N('Frances', 2),
      N('Maria', 2), N('Louisa', 2), N('Lucy', 2), N('Esther', 2), N('Rebecca', 2), N('Rachel', 2),
      N('Fanny', 2), N('Sophia', 2), N('Amelia', 2), N('Ruth', 1), N('Naomi', 1), N('Phoebe', 1),
      N('Deborah', 1), N('Jemima', 1), N('Selina', 1), N('Betsy', 1), N('Priscilla', 1), N('Dinah', 1),
      N('Keziah', 1), N('Tabitha', 1), N('Rhoda', 1), N('Miriam', 1), N('Leah', 1), N('Abigail', 1),
      N('Dorcas', 1), N('Honor', 1), N('Patience', 1), N('Prudence', 1), N('Constance', 1),
      N('Matilda', 1), N('Henrietta', 1), N('Georgiana', 1), N('Rosanna', 1), N('Lydia', 1),
    ],
    coorte_1860_75: [
      N('Mary', 8), N('Florence', 8), N('Annie', 8),
      N('Edith', 4), N('Alice', 4), N('Ethel', 4), N('Emily', 4), N('Elizabeth', 4), N('Sarah', 4), N('Ada', 4),
      N('Rose', 2), N('Beatrice', 2), N('Clara', 2), N('Lily', 2), N('Gertrude', 2), N('Agnes', 2),
      N('Nellie', 2), N('Louisa', 2), N('Emma', 2), N('Jane', 2), N('Ellen', 2), N('Kate', 2),
      N('Minnie', 2), N('Maud', 2), N('Amy', 2), N('Eva', 2), N('Bertha', 2), N('Laura', 2),
      N('Lucy', 2), N('Grace', 2), N('Jessie', 1), N('Hannah', 1), N('Fanny', 1), N('Harriet', 1),
      N('Martha', 1), N('Margaret', 1), N('Catherine', 1), N('Frances', 1), N('Eleanor', 1), N('Mabel', 1),
      N('May', 1), N('Daisy', 1), N('Lilian', 1), N('Winifred', 1), N('Nora', 1), N('Violet', 1),
      N('Olive', 1), N('Evelyn', 1), N('Helen', 1), N('Dora', 1),
    ],
  },
};

// v2 (playtest 16/jul, R2): pool ampliado de 10 para 30 — com elencos de
// ~8 pessoas por caso e 21 casos embarcados, 10 sobrenomes produziam
// homônimos entre casos vizinhos (dois "Wilson" em comarcas seguidas).
// Fonte inalterada: sobrenomes mais frequentes do censo de 1881
// (Inglaterra e País de Gales), grafias de época.
// v3 (F4 da OS priors compostos, dossiê §2.6, decisão 6): 30 → 50. Os 30
// originais ficam (contrato mínimo); os 20 novos vêm do topo nacional na
// ordem-proxy ONS 2002 com VIÉS SUL RURAL por Schürer 2004 (*Local
// Population Studies* 72): sem patronímicos em -son além dos já
// presentes (marcador do norte — "raros ao sul da linha Mersey–Tâmisa"),
// sem o bloco galês; topográficos/ocupacionais do sul, incluído Fuller
// (o dialetal do sudeste). Sorteio segue UNIFORME por decisão registrada
// (a concentração de sobrenome numa vila é familiar e local — a política
// de repetição 2–3 por vila já a produz; ponderar pelo censo nacional só
// engordaria Smith/Jones).
export const SOBRENOMES = [
  'Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Wilson', 'Evans', 'Thomas', 'Roberts', 'Walker',
  'Davies', 'Robinson', 'Wood', 'Thompson', 'White', 'Watson', 'Jackson', 'Wright', 'Green', 'Harris',
  'Cooper', 'Turner', 'Hill', 'Ward', 'Clarke', 'Hall', 'Morris', 'Moore', 'Baker', 'King',
  'Martin', 'Lee', 'Bennett', 'Webb', 'Chapman', 'Carter', 'Palmer', 'Mills', 'Barnes', 'Fuller',
  'Read', 'Andrews', 'Gray', 'Marsh', 'Page', 'Parsons', 'Ellis', 'Knight', 'Saunders', 'Field',
];

// ---------------------------------------------------------------------
// MOTIVOS POTENCIAIS — catálogo fechado, calibrado pela aritmética da KB
// (§4: £20 são meio ano de suor de um lavrador; £500 são fortuna).
// "Potencial" = semente que o gerador de casos (fases futuras) pode ou
// não promover a móbil; aqui é só o pool plausível por arquétipo.
// ---------------------------------------------------------------------
export const MOTIVOS_POTENCIAIS = {
  divida_caderneta: { descricao: 'Dívida de caderneta com merceeiro/boticário — £2–5 já sufocam um lavrador.' },
  seguro_de_enterro: { descricao: 'Seguro de enterro/vida (penny policy): a soma que muda uma vida.' },
  heranca: { descricao: 'Herança de taverna, cottage ou terra.' },
  dote: { descricao: 'Dote prometido, negado ou disputado.' },
  salario_atrasado: { descricao: 'Salário atrasado — a criada e o lavrador vivem sem reserva.' },
  escandalo_gravidez: { descricao: 'Gravidez solteira: estigma que expulsa da vila.' },
  character_negado: { descricao: 'Referência (character) negada pelo patrão: ruína da criadagem.' },
  despejo: { descricao: 'Despejo do cottage atado ao patrão — o squire dita quem tem casa.' },
  rivalidade_capela_taverna: { descricao: 'Church × Chapel: temperança contra o pub, ódio devoto.' },
  recasamento_vigiado: { descricao: 'Viúva(o) que recasa rápido, sob suspeita da vila inteira.' },
  // F4 da OS priors compostos (dossiê §2.5): quatro motivos novos, cada
  // um com a aritmética de época e a fonte na KB (regra de proveniência).
  hipoteca_ou_arrendo: {
    descricao: 'A fazenda ou oficina que não paga mais a hipoteca; a renda que o senhorio não baixa com o trigo a 22s o quarter — ruína lenta e documentada.',
    proveniencia: 'docs/kb-mundo-vitoriano/economia-e-estrutura-social.md §1 (depressão agrícola; trigo 46s→22s)',
  },
  propriedade_da_esposa: {
    descricao: 'Desde 1882 a mulher casada possui e dispõe; o marido que perdeu o domínio legal sobre £100–500 da esposa — dinheiro que mudou de mãos por lei há onze anos.',
    proveniencia: 'docs/kb-mundo-vitoriano/economia-e-estrutura-social.md §5 (Married Women’s Property Act 1882)',
  },
  divida_de_jogo: {
    descricao: 'Apostas do pub: 10–20s perdidos são semanas de salário; a dívida de jogo não tem instância — cobra-se ou apaga-se.',
    proveniencia: 'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §5 (o pub: fofoca, crédito, apostas, brigas; somas: chute calibrável)',
  },
  caridade_negada: {
    descricao: 'A esmola, o socorro da paróquia ou o character dependem de quem dá; negado o socorro, a workhouse é o degrau seguinte.',
    proveniencia: 'docs/kb-mundo-vitoriano/economia-e-estrutura-social.md §6 (a caridade como coleira) e demografia-e-sociedade.md §1 (Poor Law/workhouse)',
  },
};

// Proveniência das tabelas auxiliares (uma linha por tabela).
export const PROVENIENCIA_TABELAS = {
  faixasIdade:
    'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §2 (casamento ~25–27; criada de 14 banal; patriarca de 70 verossímil)',
  nomes:
    'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §6 + dossiê F1 §2.6 da OS priors compostos (pesos: Galbi 2002, arXiv physics/0511021 — Mary 18,7% em 1840, top-10 = 75%; coorte jovem: ONS 1904 podado dos modismos pós-1885; faixas A8/B4/C2/D1: chute calibrável)',
  sobrenomes:
    'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §6 (topo do censo de 1881) + dossiê F1 §2.6 (acréscimo v3: ordem-proxy ONS 2002, viés sul rural por Schürer 2004 — sem -son nortista, sem bloco galês; 2–3 repetem na vila)',
  motivos:
    'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §4 (renda e preços), §5 (reputação, Church × Chapel) e "Implicações para o jogo" (motivações economicamente calibradas)',
};

// ---------------------------------------------------------------------
// OS 14 ARQUÉTIPOS v1 — a lista-semente que o censo autoriza sem esforço
// (KB "Implicações para o jogo"). `frequencia` é o peso demográfico no
// sorteio do elenco; a soma dos pesos reproduz ~75% de classe
// trabalhadora (KB §1). `unicoNaVila: true` = no máximo 1 por elenco.
// `profissoes` dá a forma da profissão por gênero (peso 0 ⇒ null).
//
// `pacoteEspacial` (preenchido na FASE 2, design §4.2): o padrão espacial
// do arquétipo, em VOCABULÁRIO FECHADO (tipos de src/gerador/espaco.js).
//   acomodacao   : tipo de prédio onde mora, ou os padrões especiais
//                  'sobre_a_loja' (mora no prédio do trabalho) /
//                  'no_servico' (mora na casa que serve) / 'cottage'
//   trabalho     : tipo de prédio do ofício, ou 'em_casa' (trabalha na
//                  moradia) / 'casa_com_criadagem' (sorteia a casa servida)
//   frequentados : POOL de tipos frequentados (a inserção amostra 2–3)
// A mobília NÃO é listada aqui: vem do vocabulário por classe
// (MOBILIA_POR_CLASSE/VOCABULARIO_DA_CLASSE em espaco.js) — o arquétipo
// já carrega a classe. Proveniência por linha, como o resto da ficha.
// ---------------------------------------------------------------------
export const ARQUETIPOS = {
  squire: {
    id: 'squire',
    profissoes: { masculino: 'squire', feminino: 'senhora da propriedade (viúva do squire)' },
    classeSocial: 'gentry',
    frequencia: 1,
    unicoNaVila: true,
    generos: { masculino: 3, feminino: 1 },
    faixasIdade: [
      { faixa: '30_44', peso: 2 },
      { faixa: '45_59', peso: 5 },
      { faixa: '60_74', peso: 3 },
    ],
    priors: {
      FOR: [1, 2, 3, 2, 1],
      INT: CURVAS_DE_ACESSO.alto, // educado por tutor
      WIS: CURVAS_DE_ACESSO.medio,
      CHA: CURVAS_DE_ACESSO.alto, // comando social
    },
    traits: ['preciso', 'tagarela', 'rancoroso'],
    chanceSegundoTrait: 2, // em sextos (F4 §2.4)
    motivosPotenciais: ['heranca', 'dote', 'recasamento_vigiado', 'propriedade_da_esposa', 'hipoteca_ou_arrendo'],
    pacoteEspacial: {
      acomodacao: 'solar',
      trabalho: 'solar',
      frequentados: ['igreja', 'pub'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3/§5 (a casa grande: eixo social e de serviço) e demografia-e-sociedade.md §1 (o squire rege da propriedade)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (gentry, £1.000+, juiz de paz; ~2 mil squires), §2 (viuvez) e "Implicações" (squire ou sua viúva)',
  },

  paroco: {
    id: 'paroco',
    profissoes: { masculino: 'pároco', feminino: null },
    classeSocial: 'clero',
    frequencia: 1,
    unicoNaVila: true,
    generos: { masculino: 1, feminino: 0 },
    faixasIdade: [
      { faixa: '30_44', peso: 3 },
      { faixa: '45_59', peso: 4 },
      { faixa: '60_74', peso: 2 },
    ],
    priors: {
      FOR: [1, 3, 3, 2, 0],
      INT: CURVAS_DE_ACESSO.muito_alto, // Oxford/Cambridge
      WIS: CURVAS_DE_ACESSO.medio,
      CHA: CURVAS_DE_ACESSO.alto, // púlpito
    },
    traits: ['preciso', 'tagarela', 'medroso'],
    chanceSegundoTrait: 2,
    motivosPotenciais: ['rivalidade_capela_taverna', 'heranca', 'escandalo_gravidez', 'caridade_negada'],
    pacoteEspacial: {
      acomodacao: 'vicarage',
      trabalho: 'igreja',
      frequentados: ['escola', 'solar', 'mercearia'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (vicarage junto à igreja, com estudo) e demografia-e-sociedade.md §1 (registros e escola)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (clero, £300–400, registros e escola) e §5 (Church × Chapel; sabe dos batismos ilegítimos)',
  },

  medico: {
    id: 'medico',
    profissoes: { masculino: 'médico rural', feminino: null },
    classeSocial: 'profissional',
    frequencia: 1,
    unicoNaVila: true,
    generos: { masculino: 1, feminino: 0 },
    faixasIdade: [
      { faixa: '30_44', peso: 4 },
      { faixa: '45_59', peso: 4 },
      { faixa: '60_74', peso: 1 },
    ],
    priors: {
      FOR: [1, 3, 3, 2, 0],
      INT: CURVAS_DE_ACESSO.muito_alto, // formação médica
      WIS: CURVAS_DE_ACESSO.alto, // olho clínico
      CHA: CURVAS_DE_ACESSO.medio,
    },
    traits: ['preciso', 'tagarela', 'linha_tempo_nao_confiavel'], // o médico rural que bebe é figura de época
    chanceSegundoTrait: 2,
    motivosPotenciais: ['divida_caderneta', 'heranca', 'propriedade_da_esposa', 'divida_de_jogo'],
    pacoteEspacial: {
      acomodacao: 'casa_do_medico',
      trabalho: 'casa_do_medico',
      frequentados: ['botica', 'pub', 'igreja'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1/§3 (casa de classe média; o médico rural atende em casa) e demografia-e-sociedade.md §4',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (profissionais; o médico assina atestados) e §4 (médico rural £200–500, muitos fiados)',
  },

  boticario: {
    id: 'boticario',
    profissoes: { masculino: 'boticário', feminino: null },
    classeSocial: 'comerciante',
    frequencia: 1,
    unicoNaVila: true,
    generos: { masculino: 1, feminino: 0 },
    faixasIdade: [
      { faixa: '30_44', peso: 4 },
      { faixa: '45_59', peso: 4 },
      { faixa: '60_74', peso: 1 },
    ],
    priors: {
      FOR: [1, 3, 3, 1, 0],
      INT: CURVAS_DE_ACESSO.alto, // farmacopeia
      WIS: CURVAS_DE_ACESSO.alto, // balcão metódico
      CHA: CURVAS_DE_ACESSO.medio,
    },
    traits: ['preciso', 'medroso', 'servil'],
    chanceSegundoTrait: 2,
    motivosPotenciais: ['divida_caderneta', 'heranca', 'hipoteca_ou_arrendo', 'divida_de_jogo'],
    pacoteEspacial: {
      acomodacao: 'sobre_a_loja',
      trabalho: 'botica',
      frequentados: ['igreja', 'pub', 'mercearia'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (loja com moradia em cima) e §5 (a botica: drug run, armário de venenos)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (comerciantes, £80–300; crédito de caderneta) e "Implicações" (o boticário vende fiado e anota tudo)',
  },

  taverneiro: {
    id: 'taverneiro',
    profissoes: { masculino: 'taverneiro', feminino: 'taverneira' },
    classeSocial: 'comerciante',
    frequencia: 2,
    unicoNaVila: true,
    generos: { masculino: 3, feminino: 1 },
    faixasIdade: [
      { faixa: '30_44', peso: 4 },
      { faixa: '45_59', peso: 4 },
      { faixa: '60_74', peso: 2 },
    ],
    priors: {
      FOR: [0, 2, 4, 3, 1],
      INT: CURVAS_DE_ACESSO.medio,
      WIS: CURVAS_DE_ACESSO.alto, // o balcão lê gente
      CHA: CURVAS_DE_ACESSO.alto,
    },
    traits: ['tagarela', 'preciso', 'supersticioso'],
    chanceSegundoTrait: 3, // o balcão fala — segundo traço mais provável
    motivosPotenciais: ['heranca', 'divida_caderneta', 'rivalidade_capela_taverna', 'divida_de_jogo', 'propriedade_da_esposa'],
    pacoteEspacial: {
      acomodacao: 'sobre_a_loja',
      trabalho: 'pub',
      frequentados: ['mercearia', 'igreja'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1/§5 (coaching inn/public house: mora sobre o negócio; taproom, quartos, pátio)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (comerciantes), §3 (muitas viúvas tocam o pub do falecido) e §5 (o pub: fofoca, crédito, brigas)',
  },

  ferreiro: {
    id: 'ferreiro',
    profissoes: { masculino: 'ferreiro', feminino: null },
    classeSocial: 'artesao',
    frequencia: 3,
    unicoNaVila: false,
    generos: { masculino: 1, feminino: 0 },
    faixasIdade: [
      { faixa: '20_29', peso: 2 },
      { faixa: '30_44', peso: 5 },
      { faixa: '45_59', peso: 3 },
    ],
    priors: {
      FOR: [0, 0, 2, 4, 3], // o ofício forja o corpo — piso duro intacto
      INT: CURVAS_DE_ACESSO.medio,
      WIS: CURVAS_DE_ACESSO.medio,
      CHA: CURVAS_DE_ACESSO.baixo, // pouco verbo
    },
    traits: ['preciso', 'linha_tempo_nao_confiavel', 'rancoroso'],
    chanceSegundoTrait: 1, // taciturno de ofício — uma nota, não duas
    motivosPotenciais: ['divida_caderneta', 'salario_atrasado', 'despejo', 'hipoteca_ou_arrendo'],
    pacoteEspacial: {
      acomodacao: 'cottage',
      trabalho: 'forja',
      frequentados: ['pub', 'mercearia'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (forja: galpão no coração da vila, tolerada no miolo; o ferreiro mora à parte, em cottage)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (artesãos, 20–35s/semana, oficina própria) e §3 (ocupações masculinas do censo de 1891)',
  },

  moleiro: {
    id: 'moleiro',
    profissoes: { masculino: 'moleiro', feminino: null },
    classeSocial: 'comerciante',
    frequencia: 1,
    unicoNaVila: true,
    generos: { masculino: 1, feminino: 0 },
    faixasIdade: [
      { faixa: '30_44', peso: 4 },
      { faixa: '45_59', peso: 4 },
      { faixa: '60_74', peso: 2 },
    ],
    priors: {
      FOR: [0, 1, 3, 4, 1],
      INT: CURVAS_DE_ACESSO.medio,
      WIS: CURVAS_DE_ACESSO.medio,
      CHA: CURVAS_DE_ACESSO.medio,
    },
    traits: ['preciso', 'tagarela', 'rancoroso'],
    chanceSegundoTrait: 2,
    motivosPotenciais: ['heranca', 'divida_caderneta', 'hipoteca_ou_arrendo', 'propriedade_da_esposa'],
    pacoteEspacial: {
      acomodacao: 'moinho',
      trabalho: 'moinho',
      frequentados: ['pub', 'mercearia', 'igreja'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (moinho: o volume mais alto fora a igreja; a casa do moleiro é anexa ao ofício)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (comerciantes) e §3 (moleiro nas ocupações masculinas do censo de 1891)',
  },

  merceeiro: {
    id: 'merceeiro',
    profissoes: { masculino: 'merceeiro', feminino: 'merceeira' },
    classeSocial: 'comerciante',
    frequencia: 2,
    unicoNaVila: true,
    generos: { masculino: 2, feminino: 1 },
    faixasIdade: [
      { faixa: '30_44', peso: 4 },
      { faixa: '45_59', peso: 4 },
      { faixa: '60_74', peso: 1 },
    ],
    priors: {
      FOR: [1, 3, 3, 1, 0],
      INT: CURVAS_DE_ACESSO.medio,
      WIS: CURVAS_DE_ACESSO.alto, // a caderneta: miudeza atenta
      CHA: CURVAS_DE_ACESSO.medio,
    },
    traits: ['preciso', 'tagarela', 'servil'],
    chanceSegundoTrait: 3, // a caderneta ouve a vila inteira
    motivosPotenciais: ['divida_caderneta', 'heranca', 'caridade_negada', 'divida_de_jogo'],
    pacoteEspacial: {
      acomodacao: 'sobre_a_loja',
      trabalho: 'mercearia',
      frequentados: ['igreja', 'pub'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1/§5 (loja com moradia: sineta, balcão, escada interna para a moradia)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (comerciantes: crédito de caderneta — sabem quem deve a quem) e "Implicações" (dívida de £2–5)',
  },

  professora: {
    id: 'professora',
    profissoes: { masculino: 'professor de vila', feminino: 'professora de vila' },
    classeSocial: 'profissional',
    frequencia: 1,
    unicoNaVila: true,
    generos: { masculino: 1, feminino: 3 },
    faixasIdade: [
      { faixa: '20_29', peso: 4 },
      { faixa: '30_44', peso: 3 },
      { faixa: '45_59', peso: 2 },
    ],
    priors: {
      FOR: [2, 3, 3, 1, 0],
      INT: CURVAS_DE_ACESSO.alto, // instrução como ofício
      WIS: CURVAS_DE_ACESSO.medio,
      CHA: CURVAS_DE_ACESSO.medio,
    },
    traits: ['preciso', 'medroso', 'tagarela'],
    chanceSegundoTrait: 2,
    motivosPotenciais: ['salario_atrasado', 'escandalo_gravidez', 'dote', 'caridade_negada'],
    pacoteEspacial: {
      acomodacao: 'escola',
      trabalho: 'escola',
      frequentados: ['igreja', 'mercearia'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (alojamento anexo ao edifício de ofício, como a casa do chefe na estação) e demografia-e-sociedade.md §4',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (professora entre as ocupações femininas) e §4 (professora de vila £30–80/ano)',
  },

  costureira: {
    id: 'costureira',
    profissoes: { masculino: 'alfaiate', feminino: 'costureira' },
    classeSocial: 'artesao',
    frequencia: 3,
    unicoNaVila: false,
    generos: { masculino: 1, feminino: 5 },
    faixasIdade: [
      { faixa: '20_29', peso: 4 },
      { faixa: '30_44', peso: 4 },
      { faixa: '45_59', peso: 2 },
    ],
    priors: {
      FOR: [2, 4, 2, 1, 0],
      INT: CURVAS_DE_ACESSO.medio,
      WIS: CURVAS_DE_ACESSO.medio,
      CHA: CURVAS_DE_ACESSO.medio,
    },
    traits: ['tagarela', 'preciso', 'medroso', 'servil'],
    chanceSegundoTrait: 2,
    motivosPotenciais: ['dote', 'salario_atrasado', 'escandalo_gravidez', 'propriedade_da_esposa'],
    pacoteEspacial: {
      acomodacao: 'cottage',
      trabalho: 'em_casa',
      frequentados: ['mercearia', 'igreja', 'pub'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (o trabalho de agulha acontece na cozinha do cottage, junto à luz e ao range)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (dressmaker: ao menos uma em cada vila; alfaiate nas ocupações masculinas)',
  },

  lavadeira: {
    id: 'lavadeira',
    profissoes: { masculino: null, feminino: 'lavadeira' },
    classeSocial: 'criadagem',
    frequencia: 3,
    unicoNaVila: false,
    generos: { masculino: 0, feminino: 1 },
    faixasIdade: [
      { faixa: '30_44', peso: 4 },
      { faixa: '45_59', peso: 4 },
      { faixa: '60_74', peso: 2 },
    ],
    priors: {
      FOR: [0, 2, 4, 3, 1],
      INT: CURVAS_DE_ACESSO.baixo, // instrução negada — mas o gênio é POSSÍVEL (o caso-teste da OS)
      WIS: CURVAS_DE_ACESSO.medio,
      CHA: CURVAS_DE_ACESSO.baixo,
    },
    traits: ['tagarela', 'linha_tempo_nao_confiavel', 'rancoroso', 'supersticioso'],
    chanceSegundoTrait: 3, // a roupa das casas conta segredos — e ela conta adiante
    motivosPotenciais: ['seguro_de_enterro', 'divida_caderneta', 'despejo', 'caridade_negada'],
    pacoteEspacial: {
      acomodacao: 'cottage',
      trabalho: 'em_casa',
      frequentados: ['mercearia', 'pub'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (a copa: copper de ferver, tina e tábua — a roupa das casas lava-se no cottage)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (lavadeira/charwoman nas ocupações femininas) e §2 (viúvas: 11–14% das mulheres adultas)',
  },

  lavrador: {
    id: 'lavrador',
    profissoes: { masculino: 'lavrador', feminino: null },
    classeSocial: 'lavrador',
    frequencia: 10, // F4 §2.1: 12 → 10 (o elenco é círculo social, não amostra do censo)
    unicoNaVila: false,
    generos: { masculino: 1, feminino: 0 },
    faixasIdade: [
      { faixa: '14_19', peso: 2 },
      { faixa: '20_29', peso: 4 },
      { faixa: '30_44', peso: 4 },
      { faixa: '45_59', peso: 3 },
      { faixa: '60_74', peso: 1 },
    ],
    priors: {
      FOR: [0, 1, 3, 4, 2],
      INT: CURVAS_DE_ACESSO.baixo, // escola até os 10
      WIS: CURVAS_DE_ACESSO.medio,
      CHA: CURVAS_DE_ACESSO.baixo,
    },
    traits: ['medroso', 'tagarela', 'linha_tempo_nao_confiavel', 'rancoroso', 'supersticioso'],
    chanceSegundoTrait: 1, // o lavrador de poucas palavras
    motivosPotenciais: ['divida_caderneta', 'despejo', 'salario_atrasado', 'seguro_de_enterro', 'divida_de_jogo'],
    pacoteEspacial: {
      acomodacao: 'cottage',
      trabalho: 'granja',
      frequentados: ['pub', 'igreja', 'mercearia'],
      proveniencia:
        'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (cottage atado ao patrão) e arquitetura-e-espacos.md §1 (cottage de trabalhador)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (lavrador ~£35/ano, cottage atado ao patrão), §3 (756.557 no censo) e §4 (13s 9d/semana em 1893)',
  },

  criada: {
    id: 'criada',
    profissoes: { masculino: 'moço de lavoura', feminino: 'criada' },
    classeSocial: 'criadagem',
    frequencia: 7, // F4 §2.1: 8 → 7
    unicoNaVila: false,
    generos: { masculino: 1, feminino: 5 },
    faixasIdade: [
      { faixa: '14_19', peso: 5 },
      { faixa: '20_29', peso: 4 },
      { faixa: '30_44', peso: 2 },
    ],
    priors: {
      FOR: [1, 3, 3, 2, 0],
      INT: CURVAS_DE_ACESSO.medio,
      WIS: CURVAS_DE_ACESSO.medio,
      CHA: CURVAS_DE_ACESSO.baixo, // jovem, subordinada
    },
    traits: ['medroso', 'preciso', 'servil', 'rancoroso'],
    chanceSegundoTrait: 2,
    motivosPotenciais: ['salario_atrasado', 'character_negado', 'escandalo_gravidez', 'dote', 'caridade_negada'],
    pacoteEspacial: {
      acomodacao: 'no_servico',
      trabalho: 'casa_com_criadagem',
      frequentados: ['igreja', 'mercearia'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (cama e mesa na casa servida: a criada no sótão, quartinho frio de janela pequena)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (criadagem £10–30 + cama e mesa; demissível sem character), §3 (~1,5 mi de servos domésticos; criada de 13–14 banal)',
  },

  constable: {
    id: 'constable',
    profissoes: { masculino: 'constable do condado', feminino: null },
    classeSocial: 'servico_do_condado',
    frequencia: 1,
    unicoNaVila: true,
    generos: { masculino: 1, feminino: 0 },
    faixasIdade: [
      { faixa: '20_29', peso: 3 },
      { faixa: '30_44', peso: 5 },
      { faixa: '45_59', peso: 2 },
    ],
    priors: {
      FOR: [0, 1, 3, 4, 1],
      INT: CURVAS_DE_ACESSO.medio,
      WIS: CURVAS_DE_ACESSO.alto, // o ofício treina o olho
      CHA: CURVAS_DE_ACESSO.medio,
    },
    traits: ['preciso', 'rancoroso', 'servil'], // o rancor do caçador furtivo de sempre; a deferência ao squire
    chanceSegundoTrait: 2,
    motivosPotenciais: ['divida_caderneta', 'seguro_de_enterro', 'divida_de_jogo', 'caridade_negada'],
    pacoteEspacial: {
      acomodacao: 'delegacia',
      trabalho: 'delegacia',
      frequentados: ['pub', 'igreja'],
      proveniencia:
        'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (delegacia de vila: o policial mora onde trabalha — casa, expediente e cela sob o mesmo teto)',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (policial rural: o "delegado" de vila é um constable do condado) e "Implicações" (elenco padrão)',
  },

  // -------------------------------------------------------------------
  // F4 DA OS PRIORS COMPOSTOS (dossiê §2.1, decisão 1 aprovada): os
  // quatro arquétipos novos que o censo de 1891 sustenta. Frequências
  // relativas: chute calibrável com presença documentada (fontes no
  // dossiê, docs/os-priors-compostos-f1-dossies.md §2.1).
  // -------------------------------------------------------------------
  carroceiro: {
    id: 'carroceiro',
    profissoes: { masculino: 'carroceiro de frete', feminino: 'carroceira de frete' },
    classeSocial: 'artesao',
    frequencia: 2,
    unicoNaVila: true, // 1 por aldeia é o padrão crível (Everitt 1976)
    generos: { masculino: 8, feminino: 1 }, // mulheres carriers existiam, raras (Nottingham: 3–5)
    faixasIdade: [
      { faixa: '20_29', peso: 2 },
      { faixa: '30_44', peso: 5 },
      { faixa: '45_59', peso: 3 },
    ],
    priors: {
      FOR: [0, 1, 3, 4, 1], // carrega volumes toda semana
      INT: CURVAS_DE_ACESSO.medio, // a estrada ensina gente
      WIS: CURVAS_DE_ACESSO.medio,
      CHA: CURVAS_DE_ACESSO.medio,
    },
    traits: ['tagarela', 'preciso', 'linha_tempo_nao_confiavel'],
    chanceSegundoTrait: 2,
    motivosPotenciais: ['divida_caderneta', 'divida_de_jogo', 'hipoteca_ou_arrendo', 'salario_atrasado'],
    pacoteEspacial: {
      acomodacao: 'cottage',
      trabalho: 'em_casa', // o pátio e a carroça junto ao cottage; o ofício é a estrada
      frequentados: ['pub', 'mercearia'],
      proveniencia:
        'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (carroceiro nas ocupações do censo) + Everitt 1976 (country carriers: parte da própria aldeia nos dias de mercado; "estação" numa estalagem) — dossiê F1 §2.1; a mercearia despacha volumes',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (carroceiro entre as ocupações masculinas do censo de 1891) + Everitt 1976, J. Transport History (Norwich servida por carriers de 363 aldeias) — dossiê F1 §2.1; rotina de dias de mercado = álibis prontos',
  },

  guarda_caca: {
    id: 'guarda_caca',
    profissoes: { masculino: 'guarda-caça', feminino: null },
    classeSocial: 'criadagem', // serviço da propriedade: casa, carvão e terno do patrão
    frequencia: 1,
    unicoNaVila: true,
    generos: { masculino: 1, feminino: 0 }, // ~100% masculino (Cambridge Rural History)
    faixasIdade: [
      { faixa: '20_29', peso: 2 },
      { faixa: '30_44', peso: 4 },
      { faixa: '45_59', peso: 3 },
    ],
    priors: {
      FOR: [0, 1, 3, 4, 2], // vida inteira no mato
      INT: CURVAS_DE_ACESSO.medio,
      WIS: CURVAS_DE_ACESSO.alto, // o mato treina o olho
      CHA: CURVAS_DE_ACESSO.baixo, // vive só
    },
    traits: ['preciso', 'rancoroso', 'medroso'],
    chanceSegundoTrait: 2,
    motivosPotenciais: ['salario_atrasado', 'character_negado', 'despejo', 'caridade_negada'],
    pacoteEspacial: {
      acomodacao: 'cottage', // a lodge na borda da mata
      trabalho: 'solar', // serve a propriedade; o ofício é o bosque dela
      frequentados: ['pub', 'igreja'],
      proveniencia:
        'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (guarda-caça nas ocupações do censo) + Edwardian Promenade (casa isenta, carvão, terno anual; ~£1/semana) — dossiê F1 §2.1; o isolamento é a textura',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (guarda-caça entre as ocupações masculinas do censo) + Cambridge Rural History (série 1851–1921: 1891 ≈ 13.800 na Inglaterra) — dossiê F1 §2.1',
  },

  parteira: {
    id: 'parteira',
    profissoes: { masculino: null, feminino: 'parteira' },
    classeSocial: 'criadagem', // renda baixa e irregular (~5s por parto, em prestações)
    frequencia: 1,
    unicoNaVila: true,
    generos: { masculino: 0, feminino: 1 },
    faixasIdade: [
      { faixa: '30_44', peso: 2 },
      { faixa: '45_59', peso: 5 },
      { faixa: '60_74', peso: 3 }, // mulher madura/viúva com prática, pré-Midwives Act 1902
    ],
    priors: {
      FOR: [1, 3, 3, 2, 0],
      INT: CURVAS_DE_ACESSO.medio,
      WIS: CURVAS_DE_ACESSO.alto, // ofício de mão e de olho
      CHA: CURVAS_DE_ACESSO.alto, // entra em toda casa pela confiança
    },
    traits: ['preciso', 'medroso', 'tagarela', 'supersticioso'],
    chanceSegundoTrait: 2,
    motivosPotenciais: ['seguro_de_enterro', 'caridade_negada', 'escandalo_gravidez', 'divida_caderneta'],
    pacoteEspacial: {
      acomodacao: 'cottage',
      trabalho: 'em_casa', // e a vila inteira, quando chamam
      frequentados: ['mercearia', 'igreja'],
      proveniencia:
        'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (parteira nas ocupações femininas) + Victorian Web / RCM (parteira prática pré-1902; também amortalhava os mortos) — dossiê F1 §2.1: entra na cena do crime pela porta da frente',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (parteira entre as ocupações femininas) + censo de 1891 (>53.000 "nurses and midwives"; 50–90% dos partos pobres com parteira prática) — dossiê F1 §2.1',
  },

  pastor_de_ovelhas: {
    id: 'pastor_de_ovelhas',
    profissoes: { masculino: 'pastor de ovelhas', feminino: null },
    classeSocial: 'lavrador',
    frequencia: 2,
    unicoNaVila: false,
    generos: { masculino: 1, feminino: 0 },
    faixasIdade: [
      { faixa: '14_19', peso: 1 },
      { faixa: '20_29', peso: 3 },
      { faixa: '30_44', peso: 4 },
      { faixa: '45_59', peso: 3 },
      { faixa: '60_74', peso: 1 },
    ],
    priors: {
      FOR: [0, 2, 3, 4, 1], // andarilho resistente, menos braçal que o lavrador de enxada
      INT: CURVAS_DE_ACESSO.baixo,
      WIS: CURVAS_DE_ACESSO.alto, // solidão atenta: lê o tempo, o rebanho e a estrada
      CHA: CURVAS_DE_ACESSO.baixo,
    },
    traits: ['supersticioso', 'preciso', 'linha_tempo_nao_confiavel'],
    chanceSegundoTrait: 1, // o mais taciturno da vila
    motivosPotenciais: ['salario_atrasado', 'despejo', 'seguro_de_enterro', 'divida_de_jogo'],
    pacoteEspacial: {
      acomodacao: 'cottage',
      trabalho: 'granja',
      frequentados: ['pub', 'igreja'],
      proveniencia:
        'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (censo de 1891 agrupa shepherds aos 756.557) — dossiê F1 §2.1',
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §3 (censo de 1891: "agricultural labourers, shepherds, or carters" = 756.557; categoria superior do trabalho agrícola, extras por cordeiro) — dossiê F1 §2.1',
  },
};

export function obterArquetipo(id) {
  return ARQUETIPOS[id] || null;
}
