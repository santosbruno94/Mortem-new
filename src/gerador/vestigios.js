// =====================================================================
// CLASSES DE VESTÍGIO E VARIÁVEIS DE BATALHA — a tabela viva da FASE 3
// (design em docs/game-design-simulacao.md §2.3 e §3.1) como dado
// versionado.
//
// Este arquivo é DADO PURO e GERADOR-FACING: vive em src/gerador/ e o
// runtime JAMAIS o importa (guarda no qa.mjs).
//
// REGRA DE EXISTÊNCIA (dupla, verificada por lint no qa.mjs):
//   • Variável de batalha só existe se depositar vestígio diferencial
//     observável — cada classe declara `evidenciaDe` (as variáveis que
//     ela prova) e o QA exige que toda variável ATIVA de um registro
//     tenha ao menos um vestígio SOBREVIVENTE que a evidencie.
//   • Atributo só existe se mapear a classe de vestígio ou a
//     comportamento de diálogo — cada classe declara `atributo` (o
//     governante da sua deposição) e o QA exige FOR/INT/WIS cobertos
//     aqui e CHA coberto no catálogo de comportamentos (Fase 1).
//
// CONSERVAÇÃO DA EVIDÊNCIA (§3.3): `ordem: 2` marca o vestígio de
// segunda ordem — o que a limpeza deposita ao converter o óbvio em
// sutil. `removivel: true` marca o que a limpeza PODE remover; o que é
// âncora (a ferida fatal, o que está no corpo, a memória alheia) jamais
// se remove.
// =====================================================================

// As variáveis que o autobattler pode registrar num crime. Toda variável
// presente em `registro.variaveis` tem de estar neste catálogo fechado.
export const VARIAVEIS_BATALHA = {
  duracao: { descricao: 'Rodadas de confronto até a morte.' },
  ruido: { descricao: 'Ruído do confronto, ouvível por quem partilha ou vizinha o local.' },
  deslocamento: { descricao: 'Células/cômodos que a luta atravessou.' },
  ferimentos_vitima: { descricao: 'Golpes sofridos pela vítima (o fatal e os demais).' },
  ferimentos_assassino: { descricao: 'Ferimentos que a vítima infligiu ao assassino.' },
  mobilia_danificada: { descricao: 'Peças de mobília reviradas/danificadas pela luta.' },
  arrasto: { descricao: 'Corpo movido da célula onde caiu (encenação).' },
  higiene: { descricao: 'O eixo WIS pós-fato: limpeza, neutralidade ou desleixo.' },
  planejamento: { descricao: 'Elaboração prévia do método (só premeditado, INT alta).' },
  // OS confronto estendido (§4.4, §8.4): a vítima ganha ação própria.
  acao_vitima: { descricao: 'A ação dominante da vítima sob ataque: resistir ou fugir.' },
  rota_fuga: { descricao: 'Células que a fuga dirigida atravessou rumo à porta externa.' },
  grito: { descricao: 'Pico de ruído com hora própria, audível aos adjacentes (1× por batalha).' },
  lesoes_sitio_posterior: { descricao: 'Golpes recebidos de costas, em fuga — contagem no registro, canal de laudo.' },
  // OS autobattler v2 (B2 §3): as variáveis das doutrinas — cada uma com
  // classe própria abaixo (a matriz ação→vestígio vive em doutrinas.js).
  arma_improvisada: { descricao: 'Peça de mobília empunhada em luta (por quem, qual peça).' },
  desvencilhamento: { descricao: 'A vítima soltou-se de um agarre (o garrote falho que a doutrina explora).' },
  lesao_incidental: { descricao: 'Lesão de ambiente: o corpo que passou/caiu contra quina perigosa (jamais sinal de mecanismo).' },
  interposicao: { descricao: 'Peça bloqueadora girada/arrastada entre os dois (D1=a).' },
  ferimento_reu_regiao: { descricao: 'Região do corpo do RÉU ferida na luta — o observável que faltava (B0: 0% no v1).' },
};

// ---------------------------------------------------------------------
// SEDES ANATÔMICAS POR REGIÃO (OS autobattler v2, D2=b: cinco regiões,
// mãos separadas de braços — o aparar de antebraço distingue-se do
// agarrar a lâmina, de palma). Toda `sede` estampada num vestígio de
// lesão (B3) tem de pertencer à lista da sua região (lint GB6).
// ---------------------------------------------------------------------
export const SEDES_POR_REGIAO = {
  bracos: ['antebracos', 'bracos', 'ombros'],
  maos: ['palmas', 'dorso_das_maos', 'sob_as_unhas'],
  pernas: ['coxas', 'canelas', 'joelhos'],
  cabeca: ['couro_cabeludo', 'fronte', 'tempora', 'face', 'pescoco', 'nuca'],
  tronco: ['torax', 'dorso', 'flancos', 'abdome'],
};

// ---------------------------------------------------------------------
// CLASSES DE VESTÍGIO v1. Campos:
//   rotulo      : nome técnico curto (camada de dado, não prosa final).
//   ordem       : 1 = deposição direta do crime; 2 = segunda ordem (o
//                 rastro que a própria limpeza/encenação deixa).
//   atributo    : o atributo que governa a deposição (tabela viva §3.1);
//                 null = governada pelo método/cenário, não por atributo.
//   evidenciaDe : variáveis de batalha que este vestígio prova.
//   removivel   : a limpeza pode removê-lo (sempre convertendo em 2ª ordem).
//   noCorpo     : vive no corpo da vítima (a perícia o acha; ninguém o limpa).
// ---------------------------------------------------------------------
export const CLASSES_VESTIGIO = {
  ferida_fatal: {
    rotulo: 'Lesão fatal',
    ordem: 1,
    atributo: 'FOR', // profundidade/tipo da lesão lê a força do assassino
    evidenciaDe: ['ferimentos_vitima', 'duracao'],
    removivel: false,
    noCorpo: true,
    proveniencia: 'docs/kb-medicina-legal/traumas.md e asfixias.md (a lesão fatal por meio)',
  },
  ferimentos_defensivos: {
    rotulo: 'Ferimentos defensivos',
    ordem: 1,
    atributo: 'FOR', // FOR da vítima: quem resiste apara com os antebraços
    evidenciaDe: ['ferimentos_vitima', 'duracao'],
    removivel: false,
    noCorpo: true,
    proveniencia: 'docs/kb-medicina-legal/traumas.md (feridas de aparar em antebraços e palmas)',
  },
  sangue_alheio: {
    rotulo: 'Sangue que não é da vítima',
    ordem: 1,
    atributo: 'FOR', // FOR da vítima: a chance de ferir quem a ataca
    evidenciaDe: ['ferimentos_assassino'],
    removivel: false, // respingo alto em parede/mobília: a esfrega do assoalho não o apanha
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (sangue do agressor na cena; distinção por posição do respingo)',
  },
  poca_sangue: {
    rotulo: 'Poça de sangue',
    ordem: 1,
    atributo: null,
    evidenciaDe: ['ferimentos_vitima'],
    removivel: true, // o alvo clássico da limpeza — redundante com a ferida
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (poça e coagulação no assoalho)',
  },
  rastro_da_luta: {
    rotulo: 'Rastro da luta em mais de um ponto',
    ordem: 1,
    atributo: 'FOR', // FOR da vítima: a luta que se desloca é a luta resistida
    evidenciaDe: ['deslocamento', 'duracao'],
    removivel: false,
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (vestígios em dois ambientes; leitura da cena)',
  },
  mobilia_revirada: {
    rotulo: 'Mobília revirada',
    ordem: 1,
    atributo: 'FOR', // idem: mobília cai onde houve resistência
    evidenciaDe: ['mobilia_danificada', 'duracao'],
    removivel: true, // recompor a peça é limpeza — e deixa 2ª ordem
    noCorpo: false,
    proveniencia: 'docs/kb-mundo-vitoriano/arquitetura-e-espacos.md (mobília por cômodo; a peça fora do lugar lê-se)',
  },
  ruido_ouvido: {
    rotulo: 'Ruído ouvido na vizinhança',
    ordem: 1,
    atributo: 'FOR', // FOR da vítima alonga a luta; luta longa é luta ouvida
    evidenciaDe: ['ruido', 'duracao'],
    removivel: false, // memória alheia não se esfrega
    noCorpo: false,
    semCelula: true, // vive nos ouvidos da vizinhança, não numa célula da cena
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (paredes finas, vizinhança que ouve; grafo de avistamentos)',
  },
  pertence_do_assassino: {
    rotulo: 'Pertence do assassino arrancado na luta',
    ordem: 1,
    atributo: 'FOR', // FOR da vítima: a mão que agarra leva botão e fio
    evidenciaDe: ['duracao', 'ferimentos_vitima'],
    removivel: false, // perdido sob pressão — o assassino não deu por falta
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (botão, fio e fibra na mão da vítima ou sob o corpo)',
  },
  instrumento_abandonado: {
    rotulo: 'Instrumento abandonado na cena',
    ordem: 1,
    atributo: 'WIS', // WIS baixa: o erro grosseiro do desleixado
    evidenciaDe: ['higiene'],
    removivel: false, // ninguém o removeu — ele É o desleixo
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (arma na cena; cadeia do achado)',
  },
  pegada_ensanguentada: {
    rotulo: 'Pegada ensanguentada',
    ordem: 1,
    atributo: 'WIS', // WIS baixa: sai pisando no que derramou
    evidenciaDe: ['higiene'],
    removivel: false,
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (pegadas e trilhas de saída)',
  },
  instrumento_guardado_umido: {
    rotulo: 'Instrumento lavado com coágulo sob o rebite',
    ordem: 2,
    atributo: 'WIS', // WIS mediana: lavou por alto, guardou no lugar
    evidenciaDe: ['higiene'],
    removivel: false,
    noCorpo: false,
    semCelula: true, // vive entre os pertences do assassino, fora da cena
    // A lavagem rudimentar falha por sistema (Gross): a crosta visível sai, mas
    // o sangue coagula sob a virola e as talas do cabo, em torno dos rebites, e
    // NÃO seca — Teichmann acha-o décadas depois. A umidade da junta seca em um
    // dia; o coágulo sob o rebite é o vestígio durável de que a umidade era só
    // o sinal perecível.
    proveniencia:
      'docs/kb-medicina-legal/supressao-de-vestigios.md ("a arma branca lavada": coágulo sob a virola e os rebites do cabo, confirmado por Teichmann; a umidade da junta é a versão perecível)',
  },
  instrumento_faltando: {
    rotulo: 'Instrumento que falta no seu lugar',
    ordem: 2,
    atributo: 'WIS', // WIS alta: levou a arma — e a ausência denuncia
    evidenciaDe: ['higiene'],
    removivel: false,
    noCorpo: false,
    semCelula: true, // a ausência lê-se onde o instrumento devia estar, fora da cena
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (o objeto ausente como vestígio negativo)',
  },
  assoalho_esfregado: {
    rotulo: 'Assoalho esfregado fora de hora',
    ordem: 2,
    atributo: 'WIS', // WIS alta: a limpeza que converte o óbvio em sutil
    evidenciaDe: ['higiene', 'ferimentos_vitima'],
    removivel: false,
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (soda cáustica e esfrega recente sobre madeira)',
  },
  mobilia_recomposta: {
    rotulo: 'Mobília recomposta com marca de queda',
    ordem: 2,
    atributo: 'WIS',
    evidenciaDe: ['higiene', 'mobilia_danificada'],
    removivel: false,
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (arranhão de arraste e pé lascado sob peça reposta)',
  },
  trilha_arrasto: {
    rotulo: 'Trilha de arrasto do corpo',
    ordem: 2,
    atributo: 'FOR', // FOR do assassino: mover um corpo pede braço
    evidenciaDe: ['arrasto'],
    removivel: false,
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (trilha de arrasto entre células; sulco de calcanhares)',
  },
  livor_contraditorio: {
    rotulo: 'Livor incompatível com a posição do corpo',
    ordem: 2,
    atributo: 'FOR',
    evidenciaDe: ['arrasto'],
    removivel: false,
    noCorpo: true,
    proveniencia: 'docs/kb-medicina-legal/tanatologia.md (livor fixo denuncia corpo movido)',
  },
  acesso_preparado: {
    rotulo: 'Acesso preparado com antecedência',
    ordem: 1,
    atributo: 'INT', // elaboração do método: a INT deixa rastro nos MEIOS
    evidenciaDe: ['planejamento'],
    removivel: false,
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/inquerito-e-policia.md (fechadura sem arrombamento; chave copiada; porta destrancada)',
  },
  aquisicao_do_meio: {
    rotulo: 'Aquisição registrada do meio',
    ordem: 1,
    atributo: 'INT',
    evidenciaDe: ['planejamento'],
    removivel: false, // o registro vive fora da cena — fora do alcance da esfrega
    noCorpo: false,
    semCelula: true, // vive no livro da botica/fornecedor, fora da cena
    proveniencia: 'docs/kb-medicina-legal/venenos.md (livro de venenos da botica; compra assinada)',
  },
  residuo_do_veneno: {
    rotulo: 'Resíduo do veneno no serviço de chá',
    ordem: 1,
    atributo: null,
    evidenciaDe: ['higiene'],
    removivel: true, // lavar a louça é a limpeza do envenenador
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/venenos.md (resíduo em xícara/garrafa; análise de Marsh)',
  },
  louca_lavada_fora_de_hora: {
    rotulo: 'Louça lavada fora de hora',
    ordem: 2,
    atributo: 'WIS',
    evidenciaDe: ['higiene'],
    removivel: false,
    noCorpo: false,
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (a rotina doméstica denuncia a exceção)',
  },

  // ===== OS confronto estendido — o preço da desordem (§4.6, §8.4) =====
  // Trilhas da fuga: só se o método sangra e ferimentosVitima ≥ 1. Cada
  // classe removível declara sua contraparte de 2ª ordem (conservação §3.3),
  // depositada pela limpeza no mesmo ato (crime.js).
  trilha_gotejamento: {
    rotulo: 'Trilha de gotejamento da fuga',
    ordem: 1,
    atributo: null, // governada por método (sangra) + fuga, não por atributo
    evidenciaDe: ['rota_fuga', 'acao_vitima', 'deslocamento'],
    removivel: true, // a esfrega converte a trilha em faixa lavada (2ª ordem)
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md ("Rastros em movimento": gotejamento em trilha, espaçamento e sentido da marcha)',
  },
  assoalho_esfregado_faixa: {
    rotulo: 'Assoalho esfregado em faixa ao longo do caminho',
    ordem: 2,
    atributo: 'WIS',
    evidenciaDe: ['rota_fuga', 'higiene'],
    removivel: false,
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (a esfrega converte o óbvio em sutil; faixa lavada no sentido da trilha)',
  },
  esfregaco_de_limiar: {
    rotulo: 'Esfregaço de sangue no limiar',
    ordem: 1,
    atributo: null,
    evidenciaDe: ['rota_fuga', 'acao_vitima'],
    removivel: true, // o batente lavado é a 2ª ordem
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md ("Rastros em movimento": esfregaços de limiar, batente, maçaneta)',
  },
  batente_lavado: {
    rotulo: 'Batente lavado, ainda úmido',
    ordem: 2,
    atributo: 'WIS',
    evidenciaDe: ['rota_fuga', 'higiene'],
    removivel: false,
    noCorpo: false,
    proveniencia: 'docs/kb-medicina-legal/vestigios.md (batente lavado fora de hora; umidade recente na madeira do umbral)',
  },
  lesao_sitio_posterior: {
    rotulo: 'Lesão de sítio posterior (golpe recebido em fuga)',
    ordem: 1,
    atributo: 'FOR', // topografia da lesão, como as demais lesões do confronto
    evidenciaDe: ['lesoes_sitio_posterior', 'acao_vitima'],
    removivel: false,
    noCorpo: true, // vive no corpo; a perícia a lê no laudo (canal de exame)
    proveniencia: 'docs/kb-medicina-legal/traumas.md ("Lesões de sítio posterior": dorso/nuca, assinatura do golpe recebido em fuga)',
  },
  grito_ouvido: {
    rotulo: 'Grito ouvido na vizinhança',
    ordem: 1,
    atributo: null, // a decisão de gritar sai dos portões, não de atributo
    evidenciaDe: ['grito'],
    removivel: false, // memória alheia não se esfrega
    noCorpo: false,
    semCelula: true, // vive nos ouvidos dos adjacentes, com hora própria
    proveniencia: 'docs/kb-medicina-legal/inquerito-e-policia.md (testemunho auditivo; o depoimento diante do coroner)',
  },

  // ===== OS autobattler v2 — a deposição das doutrinas (B2 §3/§4) =====
  // Classes declaradas em B2 (a matriz ação→vestígio de doutrinas.js as
  // referencia; portão GB4); a deposição em si liga em B3. `temSede`
  // marca lesão que carrega sede anatômica ∈ SEDES_POR_REGIAO (GB6);
  // `naoCausal` trava a classe fora de qualquer sinal de mecanismo e da
  // solvência (a lesão incidental jamais concorre no cravar).
  peca_deslocada: {
    rotulo: 'Peça fora do lugar (tomada ou interposta)',
    ordem: 1,
    atributo: null, // governada pela doutrina (estado), não por atributo
    evidenciaDe: ['arma_improvisada', 'interposicao'],
    removivel: true, // recompor a peça é limpeza — 2ª ordem: mobilia_recomposta
    noCorpo: false,
    proveniencia:
      'docs/kb-mundo-vitoriano/utensilios-e-objetos.md "Implicações" (a ausência no par/jogo é vestígio gratuito: poker fora do suporte, castiçal sem o irmão)',
  },
  lesao_padrao_de_peca: {
    rotulo: 'Lesão com o padrão da peça improvisada',
    ordem: 1,
    atributo: null, // a assinatura vem da física da peça (espaco.js), não de atributo
    evidenciaDe: ['arma_improvisada'],
    removivel: false,
    noCorpo: true,
    temSede: true,
    proveniencia:
      'docs/kb-medicina-legal/traumas.md (a lesão única de forma definida — o padrão de golpe que a queda não explica; assinatura por peça em espaco.js/FISICA_DA_MOBILIA)',
  },
  residuo_na_peca: {
    rotulo: 'Resíduo na peça improvisada (o sangue no castiçal)',
    ordem: 1,
    atributo: null,
    evidenciaDe: ['arma_improvisada'],
    removivel: true, // lavar a peça é limpeza — 2ª ordem: peca_limpa_fora_de_hora
    noCorpo: false,
    proveniencia:
      'docs/kb-medicina-legal/vestigios.md (a cadeia pessoa ↔ instrumento ↔ lugar; sangue no instrumento, confirmado por Teichmann)',
  },
  peca_limpa_fora_de_hora: {
    rotulo: 'Peça limpa fora de hora',
    ordem: 2,
    atributo: 'WIS',
    evidenciaDe: ['arma_improvisada', 'higiene'],
    removivel: false,
    noCorpo: false,
    proveniencia:
      'docs/kb-medicina-legal/supressao-de-vestigios.md (a lavagem rudimentar falha por sistema; a peça limpa onde tudo tem poeira denuncia-se)',
  },
  ungueais_de_desvencilhamento: {
    rotulo: 'Escoriações ungueais de desvencilhamento',
    ordem: 1,
    atributo: null, // nasce da doutrina (o agarre rompido), não de atributo
    evidenciaDe: ['desvencilhamento'],
    removivel: false,
    noCorpo: true,
    temSede: true,
    proveniencia:
      'docs/kb-medicina-legal/asfixias.md (escoriações em meia-lua — as marcas das unhas; no desvencilhar, as da PRÓPRIA vítima arrancando o laço, com fibras/pele sob as unhas)',
  },
  lesao_incidental: {
    rotulo: 'Lesão incidental de ambiente (a quina no caminho)',
    ordem: 1,
    atributo: null,
    evidenciaDe: ['lesao_incidental'],
    removivel: false,
    noCorpo: true,
    temSede: true,
    naoCausal: true, // trava dupla: jamais sinal de mecanismo, jamais solvência
    proveniencia:
      'docs/kb-medicina-legal/traumas.md ("Lesões de queda × lesões de golpe": a queda distribui pelas saliências; a lesão de forma definida na saliência lê a quina, não a mão alheia)',
  },
  fibra_na_aresta: {
    rotulo: 'Cabelo/fibra na aresta da peça',
    ordem: 1,
    atributo: null,
    evidenciaDe: ['lesao_incidental'],
    removivel: false, // ninguém repara na aresta — o par honesto da incidental
    noCorpo: false,
    naoCausal: true,
    proveniencia:
      'docs/kb-medicina-legal/vestigios.md (cabelos caídos × arrancados; transferência de contato entre corpo e superfície)',
  },
  ferimento_do_agressor: {
    rotulo: 'Ferimento no corpo do réu',
    ordem: 1,
    atributo: 'FOR', // FOR da vítima: quem resiste fere quem a ataca
    evidenciaDe: ['ferimentos_assassino', 'ferimento_reu_regiao'],
    removivel: false, // vive no corpo do réu — nenhuma esfrega o alcança
    noCorpo: false,
    semCelula: true, // fora da cena: o exame do agressor o encontra
    temSede: true,
    proveniencia:
      'docs/kb-medicina-legal/vestigios.md ("Vestígios no agressor": escoriações, roupa rasgada, o exame do suspeito defendido por Hans Gross — o observável que faltava ao v1 (B0: 23,6% de réus feridos sem canal no corpo))',
  },
};

// Proveniência das decisões transversais desta tabela (uma linha cada).
export const PROVENIENCIA_VESTIGIOS = {
  conservacao:
    'docs/kb-medicina-legal/vestigios.md (limpar converte o óbvio em sutil, nunca em zero — cláusula de justiça §3.3)',
  segundaOrdem:
    'docs/kb-medicina-legal/vestigios.md (vestígio negativo e vestígio de limpeza como classe própria)',
};
