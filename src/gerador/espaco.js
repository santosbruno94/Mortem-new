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
    rotulo: 'A Delegacia',
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
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (forja: galpão baixo na borda da vila — risco de fogo —, porta larga, chaminé grande, cocho d’água à frente)',
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
    ],
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (cottage: a vida na cozinha; copa suja; quartos de cama de ferro; a parlour como capital simbólico)',
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
    ],
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (casa de comerciante/classe média: hall, parlour, jantar, cozinha e copa; §5, eixo social × serviço)',
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
    ],
    proveniencia:
      'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (gradiente vertical, criadagem) e §6 (sinos de criados: puxador → arame → régua na cozinha)',
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
};

// Proveniência das tabelas deste arquivo (uma linha por tabela, modelo
// de PROVENIENCIA_TABELAS dos arquétipos).
export const PROVENIENCIA_ESPACO = {
  tiposPredio:
    'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 (tipologia dos edifícios) e "Implicações" (silhuetas para o 3D procedural; paleta tijolo + ardósia)',
  mobiliaPorClasse: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §3 (interiores por classe)',
  mobiliaDeOficio: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md §1 e §5 (plantas e circulação; loja, botica, estalagem)',
};
