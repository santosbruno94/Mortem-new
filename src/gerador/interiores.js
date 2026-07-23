// =====================================================================
// INTERIORES COM GRID + MOBÍLIA — FASE 2 (LOD por relevância, design em
// docs/game-design-simulacao.md §4.2.3–4.2.4).
//
// Módulo GERADOR-FACING (o runtime jamais o importa; guarda no qa.mjs).
//
// REGRA DE EXISTÊNCIA ESPACIAL: interior detalhado só existe para local
// ELEGÍVEL a cena (cena do crime, interferência, interrogatório). O resto
// da cidade é fachada no diorama. Interior órfão = falha de lint no QA.
//
// FONTE ÚNICA DE VERDADE: o GRID é a representação canônica — o mesmo
// grid onde o autobattler da Fase 3 rodará e que o jogador explorará.
// A planta SVG (schema de PLANTA_RELOJOARIA, a linhagem de
// src/data/planta_relojoaria.js) é PROJEÇÃO derivada do grid, célula a
// célula — proibida representação espacial paralela. Os `alvos` dos
// cômodos nascem vazios: ligar cômodo a nó do mapa é papel da montagem
// do pacote de caso JOGÁVEL (Fase 4+; o resolvedor da Fase 3 só deposita
// vestígios georreferenciados no grid).
//
// MOBÍLIA LÊ-SE DUAS VEZES: âncora de vestígio (Fase 3) e leitura social
// do morador — o vocabulário doméstico vem da CLASSE de quem mora
// (espaco.js); o cômodo de ofício usa o vocabulário do ofício.
// =====================================================================

import { hashString } from '../logic/hash.js';
import { MOBILIA_POR_CLASSE, MOBILIA_DE_OFICIO, VOCABULARIO_DA_CLASSE } from './espaco.js';
import { obterPredio } from './cidade.js';

// ---------------------------------------------------------------------
// LAYOUTS POR TIPO DE PRÉDIO (KB arquitetura §3/§5): grid em células e
// partição em cômodos. `split` é o grau de liberdade seedado do layout
// (a parede mestra anda ±1 célula entre seeds); cada cômodo declara o
// retângulo em função do split S. Filas crescem para o fundo do prédio
// (fila 0 = fundos; última fila = frente/rua), como na planta da
// relojoaria (topo = beco, base = High Street).
// ---------------------------------------------------------------------
const LAYOUTS = {
  cottage: {
    colunas: 6, filas: 4, split: [3, 4],
    comodos: (S) => [
      { id: 'cozinha', rotulo: 'Cozinha', tipoComodo: 'cozinha', ret: { col: 0, fila: 0, colunas: S, filas: 4 } },
      { id: 'copa', rotulo: 'Copa', tipoComodo: 'copa', ret: { col: S, fila: 0, colunas: 6 - S, filas: 2 } },
      { id: 'quarto', rotulo: 'Quarto', tipoComodo: 'quarto', ret: { col: S, fila: 2, colunas: 6 - S, filas: 2 } },
    ],
  },
  botica: {
    colunas: 6, filas: 5, split: [3, 4],
    comodos: (S) => [
      { id: 'deposito', rotulo: 'Depósito', tipoComodo: 'copa', ret: { col: 0, fila: 0, colunas: S, filas: 3 } },
      { id: 'quarto', rotulo: 'Quarto (sobrado)', tipoComodo: 'quarto', ret: { col: S, fila: 0, colunas: 6 - S, filas: 3 } },
      { id: 'loja', rotulo: 'A Botica', tipoComodo: 'botica', ret: { col: 0, fila: 3, colunas: 6, filas: 2 } },
    ],
  },
  mercearia: {
    colunas: 6, filas: 5, split: [3, 4],
    comodos: (S) => [
      { id: 'deposito', rotulo: 'Depósito', tipoComodo: 'copa', ret: { col: 0, fila: 0, colunas: S, filas: 3 } },
      { id: 'quarto', rotulo: 'Quarto (sobrado)', tipoComodo: 'quarto', ret: { col: S, fila: 0, colunas: 6 - S, filas: 3 } },
      { id: 'loja', rotulo: 'A Loja', tipoComodo: 'loja', ret: { col: 0, fila: 3, colunas: 6, filas: 2 } },
    ],
  },
  pub: {
    colunas: 8, filas: 5, split: [4, 5],
    comodos: (S) => [
      { id: 'quartos', rotulo: 'Quartos (sobrado)', tipoComodo: 'quarto', ret: { col: 0, fila: 0, colunas: S, filas: 2 } },
      { id: 'cozinha', rotulo: 'Cozinha', tipoComodo: 'cozinha', ret: { col: S, fila: 0, colunas: 8 - S, filas: 2 } },
      { id: 'taproom', rotulo: 'Taproom', tipoComodo: 'salao', ret: { col: 0, fila: 2, colunas: S, filas: 3 } },
      { id: 'parlour', rotulo: 'Parlour', tipoComodo: 'parlour', ret: { col: S, fila: 2, colunas: 8 - S, filas: 3 } },
    ],
  },
  casa_do_medico: {
    colunas: 7, filas: 5, split: [3, 4],
    comodos: (S) => [
      { id: 'cozinha', rotulo: 'Cozinha', tipoComodo: 'cozinha', ret: { col: 0, fila: 0, colunas: S, filas: 2 } },
      { id: 'quarto', rotulo: 'Quarto', tipoComodo: 'quarto', ret: { col: S, fila: 0, colunas: 7 - S, filas: 2 } },
      { id: 'parlour', rotulo: 'Parlour', tipoComodo: 'parlour', ret: { col: 0, fila: 2, colunas: S, filas: 3 } },
      { id: 'consultorio', rotulo: 'Consultório', tipoComodo: 'estudo', ret: { col: S, fila: 2, colunas: 7 - S, filas: 3 } },
    ],
  },
  vicarage: {
    colunas: 7, filas: 5, split: [3, 4],
    comodos: (S) => [
      { id: 'cozinha', rotulo: 'Cozinha', tipoComodo: 'cozinha', ret: { col: 0, fila: 0, colunas: S, filas: 2 } },
      { id: 'quarto', rotulo: 'Quarto', tipoComodo: 'quarto', ret: { col: S, fila: 0, colunas: 7 - S, filas: 2 } },
      { id: 'parlour', rotulo: 'Parlour', tipoComodo: 'parlour', ret: { col: 0, fila: 2, colunas: S, filas: 3 } },
      { id: 'estudo', rotulo: 'Estudo', tipoComodo: 'estudo', ret: { col: S, fila: 2, colunas: 7 - S, filas: 3 } },
    ],
  },
  solar: {
    colunas: 8, filas: 6, split: [4, 5],
    comodos: (S) => [
      { id: 'jantar', rotulo: 'Sala de Jantar', tipoComodo: 'jantar', ret: { col: 0, fila: 0, colunas: S, filas: 3 } },
      { id: 'cozinha', rotulo: 'Cozinha', tipoComodo: 'cozinha', ret: { col: S, fila: 0, colunas: 8 - S, filas: 3 } },
      { id: 'parlour', rotulo: 'Parlour', tipoComodo: 'parlour', ret: { col: 0, fila: 3, colunas: S, filas: 3 } },
      { id: 'hall', rotulo: 'Hall', tipoComodo: 'hall', ret: { col: S, fila: 3, colunas: 8 - S, filas: 3 } },
    ],
  },
  delegacia: {
    colunas: 6, filas: 4, split: [3, 4],
    comodos: (S) => [
      { id: 'expediente', rotulo: 'Expediente', tipoComodo: 'expediente', ret: { col: 0, fila: 0, colunas: S, filas: 4 } },
      { id: 'cela', rotulo: 'Cela', tipoComodo: 'cela', ret: { col: S, fila: 0, colunas: 6 - S, filas: 2 } },
      { id: 'moradia', rotulo: 'Moradia', tipoComodo: 'cozinha', ret: { col: S, fila: 2, colunas: 6 - S, filas: 2 } },
    ],
  },
  forja: {
    colunas: 5, filas: 4, split: [0, 0],
    comodos: () => [
      { id: 'oficina', rotulo: 'A Oficina', tipoComodo: 'oficina', ret: { col: 0, fila: 0, colunas: 5, filas: 4 } },
    ],
  },
  moinho: {
    colunas: 5, filas: 5, split: [2, 3],
    comodos: (S) => [
      { id: 'cozinha', rotulo: 'Casa do Moleiro', tipoComodo: 'cozinha', ret: { col: 0, fila: 0, colunas: S, filas: 2 } },
      { id: 'quarto', rotulo: 'Quarto', tipoComodo: 'quarto', ret: { col: S, fila: 0, colunas: 5 - S, filas: 2 } },
      { id: 'piso_do_moinho', rotulo: 'Piso do Moinho', tipoComodo: 'piso_do_moinho', ret: { col: 0, fila: 2, colunas: 5, filas: 3 } },
    ],
  },
  escola: {
    colunas: 7, filas: 4, split: [4, 5],
    comodos: (S) => [
      { id: 'sala_de_aula', rotulo: 'Sala de Aula', tipoComodo: 'sala_de_aula', ret: { col: 0, fila: 0, colunas: S, filas: 4 } },
      { id: 'cozinha', rotulo: 'Alojamento', tipoComodo: 'cozinha', ret: { col: S, fila: 0, colunas: 7 - S, filas: 2 } },
      { id: 'quarto', rotulo: 'Quarto', tipoComodo: 'quarto', ret: { col: S, fila: 2, colunas: 7 - S, filas: 2 } },
    ],
  },
  granja: {
    colunas: 6, filas: 4, split: [3, 4],
    comodos: (S) => [
      { id: 'cozinha', rotulo: 'Cozinha da Granja', tipoComodo: 'cozinha', ret: { col: 0, fila: 0, colunas: S, filas: 4 } },
      { id: 'paiol', rotulo: 'Paiol', tipoComodo: 'paiol', ret: { col: S, fila: 0, colunas: 6 - S, filas: 4 } },
    ],
  },
  igreja: {
    colunas: 6, filas: 5, split: [0, 0],
    comodos: () => [
      { id: 'nave', rotulo: 'Nave', tipoComodo: 'nave', ret: { col: 0, fila: 0, colunas: 6, filas: 5 } },
    ],
  },
  capela: {
    colunas: 5, filas: 4, split: [0, 0],
    comodos: () => [
      { id: 'nave', rotulo: 'Nave', tipoComodo: 'nave', ret: { col: 0, fila: 0, colunas: 5, filas: 4 } },
    ],
  },
  estacao: {
    colunas: 6, filas: 3, split: [0, 0],
    comodos: () => [
      { id: 'espera', rotulo: 'Sala de Espera', tipoComodo: 'espera', ret: { col: 0, fila: 0, colunas: 6, filas: 3 } },
    ],
  },
  // ----- LOGRADOUROS (E2, Anel 1): pseudo-interiores no MESMO schema. -----
  // O "cômodo" é o CANTO (partições do dossiê E2 §1); `saidas` declara as
  // células de borda por onde se entra/foge — o interior de prédio declara
  // uma única (a porta computada de sempre; replay preservado por
  // construção). Escala: célula de logradouro lê ~3–5 m (maior que a
  // doméstica) — registro de design do dossiê §1.1(b).
  adro_da_igreja: {
    colunas: 7, filas: 5, split: [0, 0],
    saidas: [{ col: 3, fila: 4 }, { col: 6, fila: 0 }],
    comodos: () => [
      { id: 'quadra_sul', rotulo: 'A Quadra das Lápides', tipoComodo: 'quadra_de_lapides', ret: { col: 0, fila: 0, colunas: 2, filas: 5 } },
      { id: 'alameda', rotulo: 'A Alameda das Lajes', tipoComodo: 'alameda_do_adro', ret: { col: 2, fila: 0, colunas: 3, filas: 4 } },
      { id: 'lychgate', rotulo: 'O Portão Coberto', tipoComodo: 'lychgate', ret: { col: 2, fila: 4, colunas: 3, filas: 1 } },
      { id: 'fundo_norte', rotulo: 'O Fundo Evitado', tipoComodo: 'fundo_do_adro', ret: { col: 5, fila: 0, colunas: 2, filas: 5 } },
    ],
  },
  patio_da_granja: {
    colunas: 7, filas: 5, split: [0, 0],
    saidas: [{ col: 2, fila: 4 }, { col: 0, fila: 2 }, { col: 6, fila: 4 }],
    comodos: () => [
      { id: 'alpendre_do_feno', rotulo: 'O Alpendre do Feno', tipoComodo: 'alpendre_do_feno', ret: { col: 0, fila: 0, colunas: 3, filas: 2 } },
      { id: 'canto_do_poco', rotulo: 'O Poço e o Cocho', tipoComodo: 'canto_do_poco', ret: { col: 3, fila: 0, colunas: 2, filas: 2 } },
      { id: 'terreiro', rotulo: 'O Terreiro Batido', tipoComodo: 'terreiro', ret: { col: 0, fila: 2, colunas: 5, filas: 3 } },
      { id: 'chiqueiro', rotulo: 'O Chiqueiro e o Monturo', tipoComodo: 'chiqueiro', ret: { col: 5, fila: 0, colunas: 2, filas: 5 } },
    ],
  },
  caminho_do_acude: {
    colunas: 8, filas: 4, split: [0, 0],
    saidas: [{ col: 0, fila: 3 }, { col: 7, fila: 3 }],
    comodos: () => [
      { id: 'margem', rotulo: 'A Margem de Junco', tipoComodo: 'margem_do_acude', ret: { col: 0, fila: 0, colunas: 6, filas: 2 } },
      { id: 'comporta', rotulo: 'A Comporta do Açude', tipoComodo: 'comporta', ret: { col: 6, fila: 0, colunas: 2, filas: 2 } },
      { id: 'vereda', rotulo: 'A Vereda entre Sebes', tipoComodo: 'vereda', ret: { col: 0, fila: 2, colunas: 8, filas: 2 } },
    ],
  },
  // TRAVESSA DOS FUNDOS (E5, logradouro v2): grid 8×3 linear (dossiê E2
  // §1.4b). A viela é o corredor — cobre filas 1–2 até a borda de saída
  // (espelha a vereda do açude, que também alcança a fila de fuga), não a
  // única fila do dossiê, para não deixar a borda das saídas órfã de canto.
  // Fundos do pub e quintais correm no fundo (fila 0). Duas bocas: a viela
  // atravessa nos dois sentidos, como toda back lane.
  travessa_dos_fundos: {
    colunas: 8, filas: 3, split: [0, 0],
    saidas: [{ col: 0, fila: 2 }, { col: 7, fila: 2 }],
    comodos: () => [
      { id: 'fundos_do_pub', rotulo: 'Os Fundos do Pub', tipoComodo: 'fundos_do_pub', ret: { col: 0, fila: 0, colunas: 3, filas: 1 } },
      { id: 'quintais', rotulo: 'Os Quintais', tipoComodo: 'quintais', ret: { col: 3, fila: 0, colunas: 5, filas: 1 } },
      { id: 'viela', rotulo: 'A Viela', tipoComodo: 'viela', ret: { col: 0, fila: 1, colunas: 8, filas: 2 } },
    ],
  },
};

// Classe social presumida do interior quando nenhum morador do elenco o
// habita (a leitura social não fica órfã).
const CLASSE_PADRAO_DO_TIPO = {
  igreja: 'clero', capela: 'clero', vicarage: 'clero', solar: 'gentry',
  pub: 'comerciante', botica: 'comerciante', mercearia: 'comerciante', moinho: 'comerciante',
  casa_do_medico: 'profissional', escola: 'profissional', estacao: 'profissional',
  delegacia: 'servico_do_condado', forja: 'artesao', granja: 'lavrador', cottage: 'lavrador',
  // Logradouros (E2): a leitura social segue o prédio-mãe do anexo.
  adro_da_igreja: 'clero', patio_da_granja: 'lavrador', caminho_do_acude: 'comerciante',
  // Travessa dos fundos (E5): anexa ao pub — comerciante, como a mercearia/pub.
  travessa_dos_fundos: 'comerciante',
};

// Células do PERÍMETRO de um retângulo (mobília encosta na parede),
// em ordem determinística: fila de cima, coluna direita, fila de baixo,
// coluna esquerda — sem repetir cantos.
function celulasDePerimetro(ret) {
  const celulas = [];
  const colFim = ret.col + ret.colunas - 1;
  const filaFim = ret.fila + ret.filas - 1;
  for (let c = ret.col; c <= colFim; c++) celulas.push({ col: c, fila: ret.fila });
  for (let f = ret.fila + 1; f <= filaFim; f++) celulas.push({ col: colFim, fila: f });
  if (filaFim > ret.fila) for (let c = colFim - 1; c >= ret.col; c--) celulas.push({ col: c, fila: filaFim });
  if (colFim > ret.col) for (let f = filaFim - 1; f > ret.fila; f--) celulas.push({ col: ret.col, fila: f });
  return celulas;
}

// O vocabulário de mobília de um cômodo: doméstico (da classe do morador,
// filtrado pelo tipo de cômodo) + o de ofício do próprio cômodo.
function vocabularioDoComodo(tipoComodo, classeSocial) {
  const degrau = VOCABULARIO_DA_CLASSE[classeSocial];
  const domestico = (MOBILIA_POR_CLASSE[degrau]?.itens || []).filter((i) => i.comodos.includes(tipoComodo));
  const oficio = MOBILIA_DE_OFICIO[tipoComodo]?.itens || [];
  return [...oficio, ...domestico];
}

// Interior detalhado de UM prédio elegível a cena. Determinístico:
// mesma seed + mesmo prédio → mesmo interior, byte a byte.
//   classeSocial: a do morador (leitura social); null → padrão do tipo.
export function gerarInterior(cidade, predioId, seed, classeSocial = null) {
  const predio = obterPredio(cidade, predioId);
  if (!predio) return null;
  const layout = LAYOUTS[predio.tipo];
  const classe = classeSocial || CLASSE_PADRAO_DO_TIPO[predio.tipo];
  const salSeed = typeof seed === 'string' ? seed : seed?.id || 'caso';
  const sal = `${salSeed}|interior|${predioId}`;

  // A parede mestra anda entre seeds (grau de liberdade do layout).
  const [sMin, sMax] = layout.split;
  const S = sMax > sMin ? sMin + (hashString(`${sal}|split`) % (sMax - sMin + 1)) : sMin;
  const comodos = layout.comodos(S);

  // Mobília: 2–3 peças por cômodo, do vocabulário fechado, em células
  // distintas do perímetro (a peça encosta na parede, como na época).
  const mobilia = [];
  for (const comodo of comodos) {
    const vocabulario = vocabularioDoComodo(comodo.tipoComodo, classe);
    if (vocabulario.length === 0) continue;
    const celulas = celulasDePerimetro(comodo.ret);
    const quantas = Math.min(vocabulario.length, celulas.length, 2 + (hashString(`${sal}|${comodo.id}|n`) % 2));
    const inicioItem = hashString(`${sal}|${comodo.id}|itens`) % vocabulario.length;
    const inicioCelula = hashString(`${sal}|${comodo.id}|celulas`) % celulas.length;
    const passoCelula = 1 + (hashString(`${sal}|${comodo.id}|passo`) % 2);
    for (let k = 0; k < quantas; k++) {
      const item = vocabulario[(inicioItem + k) % vocabulario.length];
      const celula = celulas[(inicioCelula + k * passoCelula) % celulas.length];
      // Célula já tomada neste cômodo? Pula a peça (o vão respira).
      if (mobilia.some((m) => m.comodo === comodo.id && m.celula.col === celula.col && m.celula.fila === celula.fila))
        continue;
      mobilia.push({
        id: `${comodo.id}_${item.id}`,
        item: item.id,
        rotulo: item.rotulo,
        comodo: comodo.id,
        celula: { col: celula.col, fila: celula.fila },
      });
    }
  }

  const interior = {
    predioId,
    tipo: predio.tipo,
    classeSocialDoMorador: classe,
    // E2 (OS palco em anéis): logradouro = palco externo (pseudo-interior);
    // `saidas` são as células de borda por onde se entra e foge. O interior
    // de prédio declara UMA saída — idêntica à porta externa que crime.js
    // sempre computou (frente-centro): o replay fica preservado por
    // construção.
    logradouro: !!predio.logradouro,
    saidas: layout.saidas
      ? layout.saidas.map((s) => ({ ...s }))
      : [{ col: Math.floor(layout.colunas / 2), fila: layout.filas - 1 }],
    grid: { colunas: layout.colunas, filas: layout.filas },
    comodos: comodos.map((c) => ({ id: c.id, rotulo: c.rotulo, tipoComodo: c.tipoComodo, ret: c.ret })),
    mobilia,
  };
  interior.planta = plantaSvgDoInterior(interior, predio.rotulo);
  return interior;
}

// ---------------------------------------------------------------------
// PROJEÇÃO SVG: o grid vira planta no MESMO schema de PLANTA_RELOJOARIA
// (src/data/planta_relojoaria.js): titulo, viewBox, comodos com contorno
// e rotuloPos, tracos de mobília, rotulosDecor. Derivação 1:1 — cada
// cômodo vira um contorno, cada peça de mobília vira um traço; nada é
// desenhado que não exista no grid (fonte única de verdade espacial).
// Os `alvos` nascem vazios: o pacote de caso (Fase 3) liga cômodo a nó.
// ---------------------------------------------------------------------
const CELULA_PX = 26;
const MARGEM_PX = 24;

function plantaSvgDoInterior(interior, tituloPredio) {
  const px = (col) => MARGEM_PX + col * CELULA_PX;
  const py = (fila) => MARGEM_PX + fila * CELULA_PX;
  const comodos = interior.comodos.map((c) => {
    const x0 = px(c.ret.col);
    const y0 = py(c.ret.fila);
    const x1 = px(c.ret.col + c.ret.colunas);
    const y1 = py(c.ret.fila + c.ret.filas);
    return {
      id: c.id,
      rotulo: c.rotulo,
      contorno: `M${x0} ${y0} H${x1} V${y1} H${x0} Z`,
      rotuloPos: { x: Math.round((x0 + x1) / 2), y: y0 + 14 },
      alvos: [],
    };
  });
  const tracos = interior.mobilia.map((m) => {
    const x0 = px(m.celula.col) + 5;
    const y0 = py(m.celula.fila) + 5;
    const x1 = px(m.celula.col + 1) - 5;
    const y1 = py(m.celula.fila + 1) - 5;
    return `M${x0} ${y0} H${x1} V${y1} H${x0} Z`;
  });
  const largura = MARGEM_PX * 2 + interior.grid.colunas * CELULA_PX;
  const altura = MARGEM_PX * 2 + interior.grid.filas * CELULA_PX;
  return {
    titulo: tituloPredio,
    viewBox: `0 0 ${largura} ${altura}`,
    comodos,
    decorSalas: [],
    tracos,
    rotulosDecor: [{ texto: 'frente', x: Math.round(largura / 2), y: altura - 8 }],
  };
}
