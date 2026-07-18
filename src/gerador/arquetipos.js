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
// ---------------------------------------------------------------------
export const NOMES = {
  masculino: {
    coorte_1820_50: [
      'John', 'William', 'Thomas', 'George', 'Henry', 'Joseph', 'James', 'Charles',
      'Edward', 'Samuel', 'Richard', 'Robert', 'David', 'Daniel',
    ],
    coorte_1860_75: [
      'John', 'William', 'Thomas', 'George', 'Henry', 'Joseph', 'James', 'Charles',
      'Arthur', 'Frederick', 'Albert', 'Ernest', 'Walter', 'Harry', 'Frank',
      'Herbert', 'Alfred', 'Sidney', 'Percy', 'Edwin',
    ],
  },
  feminino: {
    coorte_1820_50: [
      'Mary', 'Elizabeth', 'Sarah', 'Hannah', 'Jane', 'Emma', 'Eliza', 'Martha',
      'Ann', 'Margaret', 'Harriet', 'Charlotte', 'Susan', 'Caroline',
    ],
    coorte_1860_75: [
      'Mary', 'Florence', 'Annie', 'Edith', 'Alice', 'Ethel', 'Ada', 'Emily', 'Rose',
      'Beatrice', 'Clara', 'Lily', 'Gertrude', 'Agnes', 'Nellie', 'Louisa',
    ],
  },
};

// v2 (playtest 16/jul, R2): pool ampliado de 10 para 30 — com elencos de
// ~8 pessoas por caso e 21 casos embarcados, 10 sobrenomes produziam
// homônimos entre casos vizinhos (dois "Wilson" em comarcas seguidas).
// Fonte inalterada: sobrenomes mais frequentes do censo de 1881
// (Inglaterra e País de Gales), grafias de época.
export const SOBRENOMES = [
  'Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Wilson', 'Evans', 'Thomas', 'Roberts', 'Walker',
  'Davies', 'Robinson', 'Wood', 'Thompson', 'White', 'Watson', 'Jackson', 'Wright', 'Green', 'Harris',
  'Cooper', 'Turner', 'Hill', 'Ward', 'Clarke', 'Hall', 'Morris', 'Moore', 'Baker', 'King',
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
};

// Proveniência das tabelas auxiliares (uma linha por tabela).
export const PROVENIENCIA_TABELAS = {
  faixasIdade:
    'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §2 (casamento ~25–27; criada de 14 banal; patriarca de 70 verossímil)',
  nomes: 'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §6 (nomes de batismo por coorte, E&W 1890)',
  sobrenomes: 'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §6 (faixa alta do censo de 1881, topo ~40; 2–3 sobrenomes repetem na vila)',
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
    traits: ['preciso', 'tagarela'],
    motivosPotenciais: ['heranca', 'dote', 'recasamento_vigiado'],
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
    traits: ['preciso', 'tagarela'],
    motivosPotenciais: ['rivalidade_capela_taverna', 'heranca', 'escandalo_gravidez'],
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
    traits: ['preciso'],
    motivosPotenciais: ['divida_caderneta', 'heranca'],
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
    traits: ['preciso', 'medroso'],
    motivosPotenciais: ['divida_caderneta', 'heranca'],
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
    traits: ['tagarela', 'preciso'],
    motivosPotenciais: ['heranca', 'divida_caderneta', 'rivalidade_capela_taverna'],
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
    traits: ['preciso', 'linha_tempo_nao_confiavel'],
    motivosPotenciais: ['divida_caderneta', 'salario_atrasado', 'despejo'],
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
    traits: ['preciso', 'tagarela'],
    motivosPotenciais: ['heranca', 'divida_caderneta'],
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
    traits: ['preciso', 'tagarela'],
    motivosPotenciais: ['divida_caderneta', 'heranca'],
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
    traits: ['preciso', 'medroso'],
    motivosPotenciais: ['salario_atrasado', 'escandalo_gravidez', 'dote'],
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
    traits: ['tagarela', 'preciso', 'medroso'],
    motivosPotenciais: ['dote', 'salario_atrasado', 'escandalo_gravidez'],
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
    traits: ['tagarela', 'linha_tempo_nao_confiavel'],
    motivosPotenciais: ['seguro_de_enterro', 'divida_caderneta', 'despejo'],
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
    frequencia: 12,
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
    traits: ['medroso', 'tagarela', 'linha_tempo_nao_confiavel'],
    motivosPotenciais: ['divida_caderneta', 'despejo', 'salario_atrasado', 'seguro_de_enterro'],
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
    frequencia: 8,
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
    traits: ['medroso', 'preciso'],
    motivosPotenciais: ['salario_atrasado', 'character_negado', 'escandalo_gravidez', 'dote'],
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
    traits: ['preciso'],
    motivosPotenciais: ['divida_caderneta', 'seguro_de_enterro'],
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
};

export function obterArquetipo(id) {
  return ARQUETIPOS[id] || null;
}
