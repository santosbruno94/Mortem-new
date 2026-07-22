// =====================================================================
// DADOS ESPACIAIS DO GERADOR — tipos de prédio, mobília por classe e
// mobília de ofício (FASE 2; design em docs/game-design-simulacao.md §4.2).
//
// Este arquivo é DADO PURO e GERADOR-FACING: vive em src/gerador/ e o
// runtime JAMAIS o importa (guarda no qa.mjs). Ele fecha os vocabulários
// que a cidade (cidade.js), a inserção (insercao.js) e os interiores
// (interiores.js) consomem: nada de tipo de prédio ou peça de mobília
// inventado fora destas tabelas.
//
// PROVENIÊNCIA POR LINHA (mesma regra dos arquétipos): toda tabela cita a
// fonte na KB (docs/kb-mundo-vitoriano/arquitetura-e-espacos.md). As
// dimensões de silhueta são estimativa de design (unidades de maquete,
// calibradas pela tábua do tutorial em src/data/mapa_espacial.js); a
// FORMA de cada silhueta segue a KB ("Silhuetas para o 3D procedural").
// =====================================================================

// ---------------------------------------------------------------------
// TIPOS DE PRÉDIO. Cada tipo declara a silhueta paramétrica no MESMO
// schema que FORMAS_PREDIO (src/data/mapa_espacial.js) consome no
// diorama: w/d/h, telhadoAltura, beiral, ristela, chaminés, marquise,
// moinho. Campos em [mín, máx] são amostrados por seed (passo de 0,05);
// `paletaParede`/`paletaTelhado` são listas fechadas (sépia da maquete).
// `unico: true` = no máximo um por cidade; `opcional: true` = presença
// sorteada por seed (variedade entre cidades).
// ---------------------------------------------------------------------
export const TIPOS_PREDIO = {
  igreja: {
    id: 'igreja',
    rotulo: 'A Igreja',
    unico: true,
    silhueta: {
      w: [0.9, 1.05], d: [1.5, 1.7], h: [1.25, 1.45], telhadoAltura: [0.5, 0.6],
      beiral: 0.08, ristela: false, chamines: 0,
      paletaParede: ['#8a8272', '#7b7468'], paletaTelhado: ['#3e3a34', '#3a352d'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (torre medieval, a única pedra aparelhada) e "Implicações" (igreja = torre; aqui, o volume mais alto após o moinho)',
  },
  capela: {
    id: 'capela',
    rotulo: 'A Capela',
    unico: true,
    opcional: true,
    silhueta: {
      w: [0.8, 0.95], d: [1.0, 1.15], h: [0.85, 0.95], telhadoAltura: [0.42, 0.5],
      beiral: 0.08, ristela: false, chamines: 0,
      paletaParede: ['#96825e', '#8d7a5a'], paletaTelhado: ['#3e3a34', '#463527'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §5 (Church × Chapel: a capela metodista rivaliza com a paróquia) e arquitetura-e-espacos.md §2 (edifício novo = tijolo + ardósia)',
  },
  vicarage: {
    id: 'vicarage',
    rotulo: 'O Presbitério',
    unico: true,
    silhueta: {
      w: [1.15, 1.3], d: [0.95, 1.05], h: [0.95, 1.05], telhadoAltura: [0.52, 0.6],
      beiral: 0.12, ristela: true, chamines: 2,
      paletaParede: ['#8a7355', '#84704f'], paletaTelhado: ['#4a3626', '#443328'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (vicarage: casa sólida recuada num jardim, junto à igreja, com estudo e criadagem)',
  },
  solar: {
    id: 'solar',
    rotulo: 'O Solar',
    unico: true,
    silhueta: {
      w: [1.5, 1.7], d: [1.1, 1.25], h: [1.05, 1.2], telhadoAltura: [0.58, 0.66],
      beiral: 0.14, ristela: true, chamines: 2,
      paletaParede: ['#8d7a5a', '#8a7355'], paletaTelhado: ['#4d3a29', '#4a3626'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (gentry: a casa grande da vila) e arquitetura-e-espacos.md §3/§5 (eixo social × eixo de serviço; criada no sótão; sinos de criados)',
  },
  pub: {
    id: 'pub',
    rotulo: 'A Taverna',
    unico: true,
    silhueta: {
      w: [1.4, 1.6], d: [1.0, 1.1], h: [0.88, 0.98], telhadoAltura: [0.54, 0.62],
      beiral: 0.13, ristela: true, chamines: 2,
      paletaParede: ['#8d7a5a', '#96825e'], paletaTelhado: ['#4d3a29', '#523c28'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (public house: volume comprido de frente para a rua) e §5 (taproom, parlour, snug, duas escadas)',
  },
  botica: {
    id: 'botica',
    rotulo: 'A Botica',
    unico: true,
    silhueta: {
      w: [0.9, 1.0], d: [0.78, 0.88], h: [0.7, 0.8], telhadoAltura: [0.44, 0.5],
      beiral: 0.1, ristela: true, chamines: 1, marquise: true,
      paletaParede: ['#96825e', '#8a7355'], paletaTelhado: ['#523c28', '#4a3626'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (loja com moradia em cima: vitrine no térreo) e §5 (botica: carboys, drug run, armário de venenos)',
  },
  mercearia: {
    id: 'mercearia',
    rotulo: 'A Mercearia',
    unico: true,
    silhueta: {
      w: [0.9, 1.05], d: [0.78, 0.9], h: [0.7, 0.8], telhadoAltura: [0.44, 0.52],
      beiral: 0.1, ristela: true, chamines: 1, marquise: true,
      paletaParede: ['#96825e', '#8d7a5a'], paletaTelhado: ['#523c28', '#4d3a29'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 e §5 (loja com moradia: sineta, balcão que barra o cliente, estoque atrás, escada interna para a moradia)',
  },
  escola: {
    id: 'escola',
    rotulo: 'A Escola',
    unico: true,
    silhueta: {
      w: [1.0, 1.15], d: [0.8, 0.9], h: [0.72, 0.82], telhadoAltura: [0.46, 0.54],
      beiral: 0.1, ristela: true, chamines: 1,
      paletaParede: ['#83704e', '#84704f'], paletaTelhado: ['#463527', '#4a3626'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §4 (professora de vila) e arquitetura-e-espacos.md §2 (edifício vitoriano novo = tijolo + ardósia; alojamento anexo, como a casa do chefe na estação, §1)',
  },
  delegacia: {
    id: 'delegacia',
    rotulo: 'O Posto do Constable',
    unico: true,
    silhueta: {
      w: [1.2, 1.35], d: [0.9, 1.0], h: [0.92, 1.0], telhadoAltura: [0.48, 0.54],
      beiral: 0.13, ristela: true, chamines: 1,
      paletaParede: ['#7b7468', '#77705f'], paletaTelhado: ['#3e3a34', '#3a352d'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (delegacia de vila: posição proeminente, feita para ser vista; casa do policial + expediente + cela sob o mesmo teto)',
  },
  casa_do_medico: {
    id: 'casa_do_medico',
    rotulo: 'Casa do Médico',
    unico: true,
    silhueta: {
      w: [1.1, 1.25], d: [0.9, 1.0], h: [0.9, 1.0], telhadoAltura: [0.5, 0.58],
      beiral: 0.12, ristela: true, chamines: 2,
      paletaParede: ['#8a7355', '#8d7a5a'], paletaTelhado: ['#4a3626', '#4d3a29'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1/§3 (casa de classe média: fachada simétrica, hall, parlour; o médico rural atende em casa — demografia-e-sociedade.md §4)',
  },
  forja: {
    id: 'forja',
    rotulo: 'A Forja',
    unico: true,
    silhueta: {
      w: [1.0, 1.15], d: [0.75, 0.85], h: [0.5, 0.58], telhadoAltura: [0.34, 0.4],
      beiral: 0.1, ristela: false, chamines: 1,
      paletaParede: ['#77705f', '#7d684c'], paletaTelhado: ['#3a352d', '#443328'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (forja: galpão baixo no coração da vila — tolerada no miolo, fogo controlado —, porta larga, chaminé grande, cocho d’água à frente)',
  },
  moinho: {
    id: 'moinho',
    rotulo: 'O Moinho',
    unico: true,
    silhueta: {
      w: [0.85, 0.95], d: [0.85, 0.95], h: [1.3, 1.45], telhadoAltura: [0.48, 0.54],
      beiral: 0.08, ristela: false, chamines: 0, moinho: true,
      paletaParede: ['#8a8272', '#7b7468'], paletaTelhado: ['#3e3a34', '#3a352d'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (moinho: o volume mais alto fora a igreja; torre com velas ou bloco sobre o açude)',
  },
  granja: {
    id: 'granja',
    rotulo: 'A Granja',
    unico: true,
    silhueta: {
      w: [1.3, 1.5], d: [0.95, 1.1], h: [0.75, 0.85], telhadoAltura: [0.5, 0.58],
      beiral: 0.12, ristela: true, chamines: 1,
      paletaParede: ['#7d684c', '#83704e'], paletaTelhado: ['#443328', '#463527'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §1 (o fazendeiro-patrão dos lavradores) e arquitetura-e-espacos.md §6 (quintais ativos: poço, celeiro, privada externa)',
  },
  estacao: {
    id: 'estacao',
    rotulo: 'A Estação',
    unico: true,
    opcional: true,
    silhueta: {
      w: [1.2, 1.35], d: [0.7, 0.8], h: [0.52, 0.6], telhadoAltura: [0.36, 0.42],
      beiral: 0.14, ristela: true, chamines: 1,
      paletaParede: ['#8a7355', '#96825e'], paletaTelhado: ['#3e3a34', '#523c28'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (estação rural: bloco térreo padronizado com beiral fundo; trazida pela ferrovia dos anos 1870, §"palimpsesto")',
  },
  cottage: {
    id: 'cottage',
    rotulo: 'Cottage',
    unico: false,
    silhueta: {
      w: [0.72, 0.88], d: [0.6, 0.72], h: [0.5, 0.62], telhadoAltura: [0.36, 0.44],
      beiral: 0.09, ristela: true, chamines: 1,
      paletaParede: ['#7d684c', '#83704e', '#84704f'], paletaTelhado: ['#443328', '#463527', '#4a3626'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (cottage de trabalhador: 1–2 pavimentos, chaminé robusta na empena, janelas pequenas e irregulares)',
  },
  // ----- LOGRADOUROS (OS palco em anéis, E2 — Anel 1; dossiê em -----
  // docs/os-palco-em-aneis-e2-dossie.md §1). Lote raso no traçado:
  // `logradouro: true` marca o tipo como palco EXTERNO — silhueta de
  // chão murado (h mínimo), sem chaminé; o "interior" é pseudo-interior
  // no mesmo schema, com `saidas` (interiores.js).
  adro_da_igreja: {
    id: 'adro_da_igreja',
    rotulo: 'O Adro da Igreja',
    unico: true,
    logradouro: true,
    silhueta: {
      w: [1.1, 1.25], d: [0.85, 0.95], h: [0.05, 0.07], telhadoAltura: [0.01, 0.02],
      beiral: 0, ristela: false, chamines: 0,
      paletaParede: ['#6f6b58', '#6a6656'], paletaTelhado: ['#565243', '#514d40'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md §8 (adro murado, o único recinto público murado sempre aberto; churchways) e arquitetura-em-detalhe.md §7 (lychgate, lápides, teixo, lado norte evitado)',
  },
  patio_da_granja: {
    id: 'patio_da_granja',
    rotulo: 'O Pátio da Granja',
    unico: true,
    logradouro: true,
    silhueta: {
      w: [1.05, 1.2], d: [0.8, 0.9], h: [0.04, 0.06], telhadoAltura: [0.01, 0.02],
      beiral: 0, ristela: false, chamines: 0,
      paletaParede: ['#77694c', '#716448'], paletaTelhado: ['#5a5040', '#554b3c'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §6 (quintais ativos: poço, celeiro, anexos) e arquitetura-em-detalhe.md §5 (poço com tampa, chiqueiro do porco de outubro, monturo)',
  },
  caminho_do_acude: {
    id: 'caminho_do_acude',
    rotulo: 'O Caminho do Açude',
    unico: true,
    logradouro: true,
    silhueta: {
      w: [1.3, 1.45], d: [0.6, 0.7], h: [0.04, 0.06], telhadoAltura: [0.01, 0.02],
      beiral: 0, ristela: false, chamines: 0,
      paletaParede: ['#5e6650', '#59614c'], paletaTelhado: ['#4c5546', '#475041'],
    },
    proveniencia:
      'docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md §7 (moinho d’água: açude e levada, ruído constante) e §5 (a rede de footpaths, stiles e portões como segundo grafo da vila)',
  },
};

// ---------------------------------------------------------------------
// MOBÍLIA POR CLASSE — o vocabulário fechado doméstico (§2.5.2 da ordem).
// A mobília lê-se duas vezes: âncora de vestígio (Fase 3) e leitura
// social do morador. Cada item declara em que TIPOS DE CÔMODO pode ser
// posto. Três degraus de vocabulário cobrem as oito classes sociais
// (VOCABULARIO_DA_CLASSE, abaixo).
// ---------------------------------------------------------------------
export const MOBILIA_POR_CLASSE = {
  trabalhadora: {
    itens: [
      { id: 'range_de_ferro', rotulo: 'fogão de ferro a carvão', comodos: ['cozinha'] },
      { id: 'mesa_raspada', rotulo: 'mesa de tampo raspado', comodos: ['cozinha'] },
      { id: 'cadeiras_windsor', rotulo: 'cadeiras Windsor', comodos: ['cozinha'] },
      { id: 'sofa_velho', rotulo: 'sofá velho', comodos: ['cozinha'] },
      { id: 'tapete_de_retalhos', rotulo: 'tapete de retalhos', comodos: ['cozinha'] },
      { id: 'pia_de_copa', rotulo: 'pia da copa (a única torneira)', comodos: ['copa'] },
      { id: 'copper_de_ferver', rotulo: 'copper de ferver roupa', comodos: ['copa'] },
      { id: 'tina_e_tabua', rotulo: 'tina e tábua de lavar', comodos: ['copa'] },
      { id: 'cama_de_ferro', rotulo: 'cama de ferro', comodos: ['quarto'] },
      { id: 'bacia_e_jarro', rotulo: 'bacia e jarro', comodos: ['quarto'] },
      { id: 'bau', rotulo: 'baú de roupa', comodos: ['quarto'] },
      { id: 'relogio_da_familia', rotulo: 'o relógio da família', comodos: ['parlour', 'cozinha'] },
      { id: 'flores_de_cera', rotulo: 'flores de cera sob redoma', comodos: ['parlour'] },
      { id: 'retratos', rotulo: 'retratos emoldurados', comodos: ['parlour'] },
      { id: 'lareira_com_guarda_fogo', rotulo: 'lareira com guarda-fogo', comodos: ['cozinha', 'parlour'] },
      { id: 'aticador', rotulo: 'atiçador de lareira', comodos: ['cozinha', 'parlour'] },
      { id: 'castical_de_latao', rotulo: 'castiçal de latão', comodos: ['parlour', 'quarto'] },
      { id: 'ferro_de_engomar', rotulo: 'ferro de engomar', comodos: ['copa'] },
    ],
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (cottage: a vida na cozinha; copa suja; quartos de cama de ferro; a parlour como capital simbólico) e utensilios-e-objetos.md §3–§4 (ferros de passar; a lareira como arsenal; chamberstick — OS autobattler v2 B1/D6)',
  },
  media: {
    itens: [
      { id: 'range_de_ferro', rotulo: 'fogão de ferro a carvão', comodos: ['cozinha'] },
      { id: 'mesa_de_cozinha', rotulo: 'mesa de cozinha', comodos: ['cozinha'] },
      { id: 'pia_de_copa', rotulo: 'pia da copa', comodos: ['copa'] },
      { id: 'prateleiras_da_despensa', rotulo: 'prateleiras frias da despensa', comodos: ['copa'] },
      { id: 'piano_ou_harmonio', rotulo: 'piano (ou harmônio)', comodos: ['parlour'] },
      { id: 'louca_boa', rotulo: 'a louça boa no aparador', comodos: ['parlour', 'jantar'] },
      { id: 'retratos', rotulo: 'retratos emoldurados', comodos: ['parlour'] },
      { id: 'flores_de_cera', rotulo: 'flores de cera sob redoma', comodos: ['parlour'] },
      { id: 'relogio_da_familia', rotulo: 'o relógio da família', comodos: ['parlour', 'hall'] },
      { id: 'mesa_de_jantar', rotulo: 'mesa de jantar', comodos: ['jantar'] },
      { id: 'aparador', rotulo: 'aparador', comodos: ['jantar'] },
      { id: 'cama_de_madeira', rotulo: 'cama de armação de madeira', comodos: ['quarto'] },
      { id: 'lavatorio', rotulo: 'lavatório com bacia', comodos: ['quarto'] },
      { id: 'comoda', rotulo: 'cômoda', comodos: ['quarto'] },
      { id: 'escrivaninha', rotulo: 'escrivaninha', comodos: ['estudo'] },
      { id: 'estante_de_livros', rotulo: 'estante de livros', comodos: ['estudo'] },
      { id: 'lareira_com_guarda_fogo', rotulo: 'lareira com guarda-fogo', comodos: ['cozinha', 'parlour'] },
      { id: 'aticador', rotulo: 'atiçador de lareira', comodos: ['cozinha', 'parlour'] },
      { id: 'castical_de_latao', rotulo: 'castiçal de latão', comodos: ['parlour', 'quarto'] },
      { id: 'ferro_de_engomar', rotulo: 'ferro de engomar', comodos: ['copa'] },
    ],
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (casa de comerciante/classe média: hall, parlour, jantar, cozinha e copa; §5, eixo social × serviço) e utensilios-e-objetos.md §3–§4 (ferros de passar; a lareira como arsenal; chamberstick — OS autobattler v2 B1/D6)',
  },
  alta: {
    itens: [
      { id: 'range_de_ferro', rotulo: 'fogão de ferro a carvão', comodos: ['cozinha'] },
      { id: 'mesa_de_cozinha', rotulo: 'mesa da criadagem', comodos: ['cozinha'] },
      { id: 'regua_de_sinos', rotulo: 'régua de sinos etiquetados', comodos: ['cozinha'] },
      { id: 'pia_de_copa', rotulo: 'pia da copa', comodos: ['copa'] },
      { id: 'prateleiras_da_despensa', rotulo: 'prateleiras frias da despensa', comodos: ['copa'] },
      { id: 'relogio_de_pe', rotulo: 'relógio de pé', comodos: ['hall'] },
      { id: 'piano_ou_harmonio', rotulo: 'piano de cauda curta', comodos: ['parlour'] },
      { id: 'retratos', rotulo: 'retratos da linhagem', comodos: ['parlour', 'hall'] },
      { id: 'puxador_de_sino', rotulo: 'puxador de sino de criados', comodos: ['parlour', 'jantar'] },
      { id: 'mesa_de_jantar', rotulo: 'mesa de jantar comprida', comodos: ['jantar'] },
      { id: 'aparador', rotulo: 'aparador de mogno', comodos: ['jantar'] },
      { id: 'louca_boa', rotulo: 'a prataria e a louça', comodos: ['jantar'] },
      { id: 'cama_de_madeira', rotulo: 'cama de dossel curto', comodos: ['quarto'] },
      { id: 'lavatorio', rotulo: 'lavatório de mármore', comodos: ['quarto'] },
      { id: 'escrivaninha', rotulo: 'escrivaninha do estudo', comodos: ['estudo'] },
      { id: 'estante_de_livros', rotulo: 'estante envidraçada', comodos: ['estudo'] },
      { id: 'lareira_com_guarda_fogo', rotulo: 'lareira de mármore com guarda-fogo', comodos: ['cozinha', 'parlour'] },
      { id: 'aticador', rotulo: 'atiçador de lareira', comodos: ['cozinha', 'parlour'] },
      { id: 'castical_de_latao', rotulo: 'castiçal de latão', comodos: ['parlour', 'quarto'] },
      { id: 'ferro_de_engomar', rotulo: 'ferro de engomar', comodos: ['copa'] },
    ],
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (gradiente vertical, criadagem) e §6 (sinos de criados: puxador → arame → régua na cozinha); utensilios-e-objetos.md §3–§4 (ferros de passar; a lareira como arsenal; chamberstick — OS autobattler v2 B1/D6)',
  },
};

// Qual degrau de vocabulário mobília cada classe social usa.
export const VOCABULARIO_DA_CLASSE = {
  gentry: 'alta',
  clero: 'alta',
  profissional: 'media',
  comerciante: 'media',
  artesao: 'trabalhadora',
  lavrador: 'trabalhadora',
  criadagem: 'trabalhadora',
  servico_do_condado: 'trabalhadora',
};

// ---------------------------------------------------------------------
// MOBÍLIA DE OFÍCIO — vocabulário fechado dos cômodos de trabalho,
// chaveado pelo TIPO DE CÔMODO (não pela classe do morador): o balcão é
// do ofício de vender, não da classe de quem vende.
// ---------------------------------------------------------------------
export const MOBILIA_DE_OFICIO = {
  loja: {
    itens: [
      { id: 'balcao_de_loja', rotulo: 'balcão que barra o cliente' },
      { id: 'prateleiras_de_estoque', rotulo: 'prateleiras e gavetas de estoque' },
      { id: 'vitrine', rotulo: 'vitrine envidraçada' },
      { id: 'sineta_da_porta', rotulo: 'sineta da porta' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §5 (loja com moradia: sineta, balcão, estoque atrás)',
  },
  botica: {
    itens: [
      { id: 'balcao_de_loja', rotulo: 'balcão da botica' },
      { id: 'drug_run', rotulo: 'drug run (parede de gavetinhas rotuladas)' },
      { id: 'carboys', rotulo: 'carboys de vidro colorido na vitrine' },
      { id: 'balanca_de_botica', rotulo: 'balança de precisão' },
      { id: 'armario_de_venenos', rotulo: 'armário de venenos (venda em livro)' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §5 (botica: carboys, drug run, specie jars, balança, armário de venenos)',
  },
  salao: {
    itens: [
      { id: 'bancos_corridos', rotulo: 'bancos corridos sobre serragem' },
      { id: 'balcao_com_beer_engine', rotulo: 'balcão com beer engine' },
      { id: 'mesas_de_taverna', rotulo: 'mesas de taverna' },
      { id: 'snug', rotulo: 'o snug (cubículo com portinhola)' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §5 (taproom com serragem; beer engine da adega; o snug)',
  },
  oficina: {
    itens: [
      { id: 'bigorna', rotulo: 'bigorna' },
      { id: 'forja_de_carvao', rotulo: 'forja de carvão' },
      { id: 'cocho_dagua', rotulo: 'cocho d’água' },
      { id: 'bancada_de_ferreiro', rotulo: 'bancada de ferramentas' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (forja: porta larga, chaminé grande, cocho à frente)',
  },
  expediente: {
    itens: [
      { id: 'mesa_de_expediente', rotulo: 'mesa de expediente' },
      { id: 'arquivo_de_madeira', rotulo: 'arquivo de madeira' },
      { id: 'lampiao_de_parede', rotulo: 'lampião de parede' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (delegacia de vila: expediente sob o mesmo teto da moradia)',
  },
  cela: {
    itens: [{ id: 'tarimba', rotulo: 'tarimba de tábuas' }],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (delegacia de vila: cela(s) sob o mesmo teto)',
  },
  nave: {
    itens: [
      { id: 'bancos_de_igreja', rotulo: 'bancos de igreja' },
      { id: 'pulpito', rotulo: 'púlpito' },
      { id: 'pia_batismal', rotulo: 'pia batismal' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (igreja medieval; adro murado) — interior canônico de nave',
  },
  sala_de_aula: {
    itens: [
      { id: 'carteiras', rotulo: 'carteiras enfileiradas' },
      { id: 'quadro_de_ardosia', rotulo: 'quadro de ardósia' },
      { id: 'estufa_de_ferro', rotulo: 'estufa de ferro' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/demografia-e-sociedade.md §4 (escola de vila) e arquitetura-e-espacos.md §4 (calor: fogo aceso só onde se está)',
  },
  piso_do_moinho: {
    itens: [
      { id: 'ma_de_moinho', rotulo: 'mó de moinho' },
      { id: 'sacas_de_farinha', rotulo: 'sacas de farinha' },
      { id: 'guindaste_de_sacas', rotulo: 'guindaste de sacas' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (moinho: torre de trabalho vertical)',
  },
  paiol: {
    itens: [
      { id: 'ferramentas_de_lavoura', rotulo: 'ferramentas de lavoura' },
      { id: 'arreios', rotulo: 'arreios pendurados' },
      { id: 'sacas_de_grao', rotulo: 'sacas de grão' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §6 (quintais e anexos de trabalho como cenário ativo)',
  },
  espera: {
    itens: [
      { id: 'guiche', rotulo: 'guichê da bilheteria' },
      { id: 'banco_de_espera', rotulo: 'banco de espera' },
      { id: 'relogio_de_estacao', rotulo: 'relógio de estação' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (estação rural: bilheteria + espera padronizadas)',
  },
  // ----- MOBÍLIA DE LOGRADOURO (E2, Anel 1) — os "cantos" dos palcos -----
  // externos, chaveados pelo tipoComodo como todo cômodo de ofício.
  // Dossiê com fonte por peça: docs/os-palco-em-aneis-e2-dossie.md §1.
  quadra_de_lapides: {
    itens: [
      { id: 'lapides_enfileiradas', rotulo: 'lápides enfileiradas de leste a oeste' },
      { id: 'cova_recem_aberta', rotulo: 'cova recém-aberta com a pá fincada ao lado' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-em-detalhe.md §7 (sepulturas leste-oeste, os ricos junto ao caminho sul; adro de vila ativo)',
  },
  fundo_do_adro: {
    itens: [
      { id: 'teixo_velho', rotulo: 'teixo velho' },
      { id: 'lapide_tombada', rotulo: 'lápide tombada no mato' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-em-detalhe.md §7 (teixos mais velhos que a igreja; o lado norte evitado, covas sem nome)',
  },
  alameda_do_adro: {
    itens: [{ id: 'muro_baixo_de_pedra', rotulo: 'muro baixo de pedra' }],
    proveniencia: 'docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md §8 (adro murado) e §4 (lajões do adro, dos poucos trechos calçados)',
  },
  lychgate: {
    itens: [
      { id: 'banco_do_lychgate', rotulo: 'bancos laterais de carvalho' },
      { id: 'pedra_dos_caixoes', rotulo: 'pedra de pousar os caixões' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-em-detalhe.md §7 (lychgate: portal coberto de carvalho, bancos laterais, pedra ou cavaletes ao centro)',
  },
  terreiro: {
    itens: [
      { id: 'carroca_desatrelada', rotulo: 'carroça desatrelada' },
      { id: 'clamp_de_batata', rotulo: 'meda de batatas de terra fresca' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md §2 (a carroça no pacote-padrão da vila) e arquitetura-em-detalhe.md §5 (clamp de outubro: terra recém-mexida é normal)',
  },
  alpendre_do_feno: {
    itens: [
      { id: 'feno_empilhado', rotulo: 'feno empilhado' },
      { id: 'ferramentas_de_lavoura', rotulo: 'ferramentas de lavoura' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §5–§6 (palheiro e anexos de trabalho como cenário ativo; ferramentas do paiol)',
  },
  canto_do_poco: {
    itens: [
      { id: 'poco_com_tampa', rotulo: 'poço com tampa de madeira' },
      { id: 'cocho_de_gado', rotulo: 'cocho de gado' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-em-detalhe.md §5 (poço doméstico de 15–60 pés, com tampa) e urbanismo-e-morfologia.md §3 (cocho junto da bomba)',
  },
  chiqueiro: {
    itens: [
      { id: 'chiqueiro_do_porco', rotulo: 'porco gordo no cercado' },
      { id: 'monturo', rotulo: 'monturo' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-em-detalhe.md §5 (o porco de outubro; a matança iminente) e urbanismo-e-morfologia.md §4 (monturo junto de quase toda porta)',
  },
  vereda: {
    itens: [
      { id: 'stile_na_cerca', rotulo: 'degraus de transpor a cerca' },
      { id: 'fingerpost', rotulo: 'poste de braços indicadores' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md §5 (stiles e portões como checkpoints dos footpaths) e §3 (marcos e fingerposts)',
  },
  margem_do_acude: {
    itens: [
      { id: 'lamina_do_acude', rotulo: 'lâmina parada do açude' },
      { id: 'pranchao_de_travessia', rotulo: 'pranchão de travessia' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md §7 (moinho d’água: açude e levada; o pranchão é inferência da levada, dossiê E2 §1.3)',
  },
  comporta: {
    itens: [
      { id: 'comporta_de_engrenagem', rotulo: 'engrenagem da comporta' },
      { id: 'sacas_esquecidas', rotulo: 'sacas do moinho encostadas' },
    ],
    proveniencia: 'docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md §7 (a comporta do açude) e arquitetura-e-espacos.md §1 (sacas, mobília canônica do moinho)',
  },
};

// Proveniência das tabelas deste arquivo (uma linha por tabela, modelo
// de PROVENIENCIA_TABELAS dos arquétipos).
export const PROVENIENCIA_ESPACO = {
  tiposPredio:
    'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (tipologia dos edifícios) e "Implicações" (silhuetas para o 3D procedural; paleta tijolo + ardósia)',
  mobiliaPorClasse: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (interiores por classe)',
  mobiliaDeOficio: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 e §5 (plantas e circulação; loja, botica, estalagem)',
  logradouros:
    'docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md §2–§8 e arquitetura-em-detalhe.md §5/§7 (catálogo com fonte por peça no dossiê docs/os-palco-em-aneis-e2-dossie.md §1)',
  fisicaDaMobilia:
    'docs/kb-mundo-vitoriano/utensilios-e-objetos.md §3–§4, §5, §8 e "Implicações" (armas improvisadas por cômodo; a lareira como arsenal; o jarro de louça; o quintal de lavrador) — OS autobattler v2, B1',
};

// ---------------------------------------------------------------------
// FÍSICA DA MOBÍLIA (OS autobattler v2, B1) — affordances por ID de item.
// Tabela única chaveada por id (os vocabulários repetem ids entre degraus;
// uma entrada por id evita divergência, e o palco herda de graça).
//
// Semântica dos campos:
//   empunhavel   — a peça vira arma improvisada na batalha (B3); exige
//                  classeGolpe + assinatura com fonte (lint GB2).
//   duasMaos     — empunhável só com as duas mãos (peça de massa 'media').
//   classeGolpe  — 'contundente' | 'cortante' | 'perfurante'.
//   alcance      — 'curto' (à mão) | 'haste' (atiçador, forcado).
//   massa        — 'leve' (ergue-se com uma mão) | 'media' (arrasta-se;
//                  empunha-se só se duasMaos) | 'fixa' (imóvel — JAMAIS
//                  empunhável, lint).
//   bloqueia     — barra o passo no grid (BFS de B3, D1=a).
//   quinaPerigosa— aresta dura à altura de queda: célula elegível à lesão
//                  incidental (B2 §3.3) — jamais sinal de mecanismo.
//   ancora       — âncora espacial de método ('agua', 'fogo'); a tabela
//                  substitui a lista literal ITENS_COM_AGUA (derivada
//                  abaixo — elegibilidade do afogamento byte-idêntica).
//   assinatura   — { id, fonte }: a ferida que a peça produz, com
//                  arquivo+seção da KB (lint GB1). Candidatas registradas
//                  sem promover (mudariam elegibilidade — decisão futura):
//                  tina_e_tabua e pia_batismal como âncora d'água.
//
// Números de eficácia NÃO vivem aqui: ficam em CALIBRACAO_MOBILIA,
// marcados chute-calibrável (B5 os itera por Monte Carlo).
// ---------------------------------------------------------------------
export const FISICA_DA_MOBILIA = {
  // ----- doméstico: cozinha / copa -----
  range_de_ferro: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  mesa_raspada: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  cadeiras_windsor: {
    empunhavel: true, duasMaos: true, classeGolpe: 'contundente', alcance: 'curto', massa: 'media',
    bloqueia: false, quinaPerigosa: false,
    assinatura: {
      id: 'contusao_de_travessa',
      fonte: 'docs/kb-mundo-vitoriano/utensilios-e-objetos.md "Implicações" (mobília de assento como arma de ocasião — inferência declarada)',
    },
  },
  sofa_velho: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: false },
  tapete_de_retalhos: { empunhavel: false, massa: 'leve', bloqueia: false, quinaPerigosa: false },
  pia_de_copa: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  copper_de_ferver: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  tina_e_tabua: { empunhavel: false, massa: 'media', bloqueia: false, quinaPerigosa: false },
  mesa_de_cozinha: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  prateleiras_da_despensa: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  regua_de_sinos: { empunhavel: false, massa: 'fixa', bloqueia: false, quinaPerigosa: false },
  ferro_de_engomar: {
    empunhavel: true, classeGolpe: 'contundente', alcance: 'curto', massa: 'leve',
    bloqueia: false, quinaPerigosa: false,
    assinatura: {
      id: 'contusao_de_face_plana',
      fonte: 'docs/kb-mundo-vitoriano/utensilios-e-objetos.md §3 (ferros de passar: sad irons — arma contundente de 2–4 kg em toda casa; a dupla âncora do ferro quente)',
    },
  },
  // ----- doméstico: quarto / parlour / jantar / estudo / hall -----
  cama_de_ferro: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  cama_de_madeira: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: false },
  bacia_e_jarro: {
    empunhavel: true, classeGolpe: 'contundente', alcance: 'curto', massa: 'leve',
    bloqueia: false, quinaPerigosa: false,
    assinatura: {
      id: 'fragmentos_de_faianca',
      fonte: 'docs/kb-mundo-vitoriano/utensilios-e-objetos.md §5 (lavatório: jarro cheio ≈ 3–4 litros de louça — arma; e, quebrado, lâminas)',
    },
  },
  bau: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  lavatorio: { empunhavel: false, massa: 'media', bloqueia: false, quinaPerigosa: true },
  comoda: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  relogio_da_familia: { empunhavel: false, massa: 'leve', bloqueia: false, quinaPerigosa: false },
  flores_de_cera: { empunhavel: false, massa: 'leve', bloqueia: false, quinaPerigosa: false },
  retratos: { empunhavel: false, massa: 'leve', bloqueia: false, quinaPerigosa: false },
  piano_ou_harmonio: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  louca_boa: { empunhavel: false, massa: 'leve', bloqueia: false, quinaPerigosa: false },
  mesa_de_jantar: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  aparador: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  escrivaninha: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  estante_de_livros: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  relogio_de_pe: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  puxador_de_sino: { empunhavel: false, massa: 'fixa', bloqueia: false, quinaPerigosa: false },
  lareira_com_guarda_fogo: {
    empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true, ancora: 'fogo',
  },
  aticador: {
    empunhavel: true, classeGolpe: 'contundente', alcance: 'haste', massa: 'leve',
    bloqueia: false, quinaPerigosa: false,
    assinatura: {
      id: 'contusao_padrao_de_haste',
      fonte: 'docs/kb-mundo-vitoriano/utensilios-e-objetos.md §4 (a lareira como arsenal: o atiçador/poker — a arma improvisada canônica; a ausência do jogo de ferros é visível)',
    },
  },
  castical_de_latao: {
    empunhavel: true, classeGolpe: 'contundente', alcance: 'curto', massa: 'leve',
    bloqueia: false, quinaPerigosa: false,
    assinatura: {
      id: 'ferida_contusocortante_de_base',
      fonte: 'docs/kb-mundo-vitoriano/utensilios-e-objetos.md §4 (velas: chamberstick/castiçal — castiçal fora do par + pingos de cera = trilha)',
    },
  },
  // ----- ofício: loja / botica / salão -----
  balcao_de_loja: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  prateleiras_de_estoque: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  vitrine: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  sineta_da_porta: { empunhavel: false, massa: 'fixa', bloqueia: false, quinaPerigosa: false },
  drug_run: { empunhavel: false, massa: 'fixa', bloqueia: false, quinaPerigosa: false },
  carboys: { empunhavel: false, massa: 'leve', bloqueia: false, quinaPerigosa: false },
  balanca_de_botica: { empunhavel: false, massa: 'leve', bloqueia: false, quinaPerigosa: false },
  armario_de_venenos: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  bancos_corridos: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: false },
  balcao_com_beer_engine: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  mesas_de_taverna: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  snug: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  // ----- ofício: forja / expediente / cela / nave / escola / moinho / paiol / estação -----
  bigorna: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  forja_de_carvao: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  cocho_dagua: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true, ancora: 'agua' },
  bancada_de_ferreiro: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  mesa_de_expediente: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  arquivo_de_madeira: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  lampiao_de_parede: { empunhavel: false, massa: 'fixa', bloqueia: false, quinaPerigosa: false },
  tarimba: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  bancos_de_igreja: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  pulpito: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  pia_batismal: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  carteiras: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  quadro_de_ardosia: { empunhavel: false, massa: 'media', bloqueia: false, quinaPerigosa: false },
  estufa_de_ferro: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  ma_de_moinho: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  sacas_de_farinha: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: false },
  guindaste_de_sacas: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  ferramentas_de_lavoura: {
    empunhavel: true, classeGolpe: 'cortante', alcance: 'curto', massa: 'leve',
    bloqueia: false, quinaPerigosa: false,
    assinatura: {
      id: 'ferida_cortante_de_poda',
      fonte: 'docs/kb-mundo-vitoriano/utensilios-e-objetos.md §8 (ferramentas à mão: quintal de lavrador — billhook, foice, forcado, machadinha)',
    },
  },
  arreios: { empunhavel: false, massa: 'leve', bloqueia: false, quinaPerigosa: false },
  sacas_de_grao: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: false },
  guiche: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  banco_de_espera: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: false },
  relogio_de_estacao: { empunhavel: false, massa: 'fixa', bloqueia: false, quinaPerigosa: false },
  // ----- logradouros (E2, Anel 1) -----
  lapides_enfileiradas: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  cova_recem_aberta: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  teixo_velho: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  lapide_tombada: { empunhavel: false, massa: 'fixa', bloqueia: false, quinaPerigosa: true },
  muro_baixo_de_pedra: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  banco_do_lychgate: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  pedra_dos_caixoes: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  carroca_desatrelada: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: true },
  clamp_de_batata: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  feno_empilhado: { empunhavel: false, massa: 'media', bloqueia: true, quinaPerigosa: false },
  poco_com_tampa: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true, ancora: 'agua' },
  cocho_de_gado: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true, ancora: 'agua' },
  chiqueiro_do_porco: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  monturo: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false },
  stile_na_cerca: { empunhavel: false, massa: 'fixa', bloqueia: false, quinaPerigosa: false },
  fingerpost: { empunhavel: false, massa: 'fixa', bloqueia: false, quinaPerigosa: false },
  lamina_do_acude: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: false, ancora: 'agua' },
  pranchao_de_travessia: { empunhavel: false, massa: 'media', bloqueia: false, quinaPerigosa: false },
  comporta_de_engrenagem: { empunhavel: false, massa: 'fixa', bloqueia: true, quinaPerigosa: true },
  sacas_esquecidas: { empunhavel: false, massa: 'media', bloqueia: false, quinaPerigosa: false },
};

// Números de eficácia das peças empunháveis — TODOS chute-calibrável
// declarado (GB1); B5 os itera por Monte Carlo contra as bandas D3.
export const CALIBRACAO_MOBILIA = {
  aticador: { bonusDano: 1, chute: true },
  castical_de_latao: { bonusDano: 1, chute: true },
  ferro_de_engomar: { bonusDano: 1, chute: true },
  cadeiras_windsor: { bonusDano: 1, chute: true },
  bacia_e_jarro: { bonusDano: 1, chute: true },
  ferramentas_de_lavoura: { bonusDano: 2, chute: true },
};

// Itens de mobília que valem como âncora espacial de ÁGUA (E2 §3.3): a
// elegibilidade do afogamento lê esta lista, nunca o id literal — o açude
// e o poço quebram o quase-invariante "afogamento ⇒ forja". Desde B1 a
// lista é DERIVADA da física (fisica.ancora === 'agua'); o lint GB2
// garante igualdade com o conjunto canônico do E2 (elegibilidade
// byte-idêntica: cocho_dagua, lamina_do_acude, poco_com_tampa,
// cocho_de_gado).
export const ITENS_COM_AGUA = Object.keys(FISICA_DA_MOBILIA).filter(
  (id) => FISICA_DA_MOBILIA[id].ancora === 'agua'
);
