// =====================================================================
// A PRANCHA DA VILA — a geometria da gravura, em funções PURAS.
//
// Camada 100% VISUAL (linhagem de src/data/mapa_espacial.js): nenhuma
// regra de motor, veredicto ou tempo lê coisa alguma daqui. O que este
// módulo faz é traduzir o MESMO dado espacial que o diorama 3D consome
// (posicoes {x,z} por nó + a tábua + o casario de cenário + a estrada)
// para coordenadas de uma prancha de gravura em SVG.
//
// Sem estado, sem hora de parede, sem sorteio: mesmo dado → mesma
// prancha, em qualquer máquina (a proibição de Math.random/Date.now em
// src/logic vale aqui como em todo o resto).
//
// Convenção de eixos: no mundo da maquete, x cresce para a direita e z
// para a FRENTE (para o observador). Na prancha, x vira o eixo
// horizontal e z vira profundidade: z maior desce na folha (mais perto)
// e cresce de escala. Desenhar por z crescente é desenhar de trás para
// diante — a oclusão do casario sai de graça.
// =====================================================================

// O quadro da prancha, em unidades de viewBox. Proporção de folha de
// atlas apaisada; o componente escala isto para o tamanho da mesa.
export const QUADRO = { largura: 560, altura: 240 };
// O fio gravado da moldura e o campo de desenho por dentro dele.
export const MOLDURA = { x: 5, y: 5, largura: 550, altura: 230 };
export const CAMPO = { x: 12, y: 12, largura: 536, altura: 216 };

// A linha do horizonte e a beira de baixo do terreno, como frações do
// campo: entre as duas moram TODAS as bases de prédio (o fundo da vila
// encosta no horizonte; a frente, na beira).
const HORIZONTE = 0.52;
const BEIRA = 0.9;
// A escala de profundidade: o prédio do fundo é menor que o da frente.
const ESCALA_FUNDO = 0.82;
const ESCALA_FRENTE = 1.18;
// Quanto do campo o quadro gravado cede quando há adendo na margem
// (o nó acrescido a bico de pena entra fora da gravura — E3 da OS).
const FRACAO_COM_MARGEM = 0.76;

const arred = (v) => Math.round(v * 100) / 100;

// Extremos de um conjunto de pontos {x,z}; devolve null se vier vazio.
function extremos(pontos) {
  if (!pontos.length) return null;
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const p of pontos) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z);
    maxZ = Math.max(maxZ, p.z);
  }
  return { minX, maxX, minZ, maxZ };
}

// ---------------------------------------------------------------------
// A PROJEÇÃO — mundo → prancha.
//
//   posicoes : { [noId]: { x, z, predio, distante? } } (mapa espacial ou
//              o campo visual `maquete` do pacote — as duas fontes que o
//              diorama já resolve)
//   tabua    : { centroX, larguraTabua, fundoTabua } (a peça sob a vila:
//              só entra como escala da folga em volta e como fundo de
//              profundidade quando a vila inteira mora num plano)
//   ids      : os nós a projetar DENTRO do quadro (os desbloqueados que
//              não vão para a margem)
//   cenario  : [{ predio, x, z, logradouro? }] — o casario sem nó
//   estrada  : polilinha [{x,z}] ou null
//   comMargem: reserva a faixa do poente para os adendos a bico de pena
//
// Devolve dado puro: o quadro, o campo gravado, a margem, a unidade
// (px de prancha por unidade de maquete, à escala 1) e os pontos já
// projetados, em ORDEM DE DESENHO (de trás para diante).
// ---------------------------------------------------------------------
export function projetarVila({ posicoes, tabua, ids = [], cenario = [], estrada = null, comMargem = false }) {
  const pontosMundo = [];
  for (const id of ids) {
    const p = posicoes[id];
    if (p) pontosMundo.push({ x: p.x, z: p.z });
  }
  for (const c of cenario) pontosMundo.push({ x: c.x, z: c.z });
  const ext = extremos(pontosMundo) || {
    minX: tabua.centroX - tabua.larguraTabua / 2,
    maxX: tabua.centroX + tabua.larguraTabua / 2,
    minZ: -tabua.fundoTabua / 2,
    maxZ: tabua.fundoTabua / 2,
  };
  // Folga em volta: proporcional à tábua (a vila gerada é maior ou menor
  // que a do caso-escola; a folga acompanha em vez de ser um número fixo).
  const folgaX = Math.max(0.9, tabua.larguraTabua * 0.07);
  const folgaZ = Math.max(0.5, tabua.fundoTabua * 0.09);
  const mundo = {
    minX: ext.minX - folgaX,
    maxX: ext.maxX + folgaX,
    minZ: ext.minZ - folgaZ,
    maxZ: ext.maxZ + folgaZ,
  };
  const larguraMundo = Math.max(0.01, mundo.maxX - mundo.minX);
  const fundoMundo = Math.max(0.01, mundo.maxZ - mundo.minZ);

  // O quadro gravado: o campo inteiro, ou o que sobra dele quando a
  // margem do poente é reservada para os adendos.
  const quadroLargura = CAMPO.largura * (comMargem ? FRACAO_COM_MARGEM : 1);
  const quadro = { x: CAMPO.x, y: CAMPO.y, largura: quadroLargura, altura: CAMPO.altura };
  const margem = comMargem
    ? { x: CAMPO.x + quadroLargura, y: CAMPO.y, largura: CAMPO.largura - quadroLargura, altura: CAMPO.altura }
    : null;

  // A unidade da prancha: px por unidade de maquete à escala 1. Sai da
  // largura útil descontada a escala do prédio mais À FRENTE — assim a
  // vila INTEIRA cabe na largura, sem nada cortado (o mesmo compromisso
  // do enquadramento do diorama, aqui resolvido na aritmética).
  const unidade = (quadro.largura - 10) / (larguraMundo * ESCALA_FRENTE);
  const horizonte = quadro.y + quadro.altura * HORIZONTE;
  const beira = quadro.y + quadro.altura * BEIRA;
  const centroX = (mundo.minX + mundo.maxX) / 2;
  const centroTela = quadro.x + quadro.largura / 2;

  const projetar = (x, z) => {
    const t = (z - mundo.minZ) / fundoMundo;
    const escala = ESCALA_FUNDO + (ESCALA_FRENTE - ESCALA_FUNDO) * t;
    return {
      sx: arred(centroTela + (x - centroX) * unidade * escala),
      sy: arred(horizonte + (beira - horizonte) * t),
      escala: arred(escala),
      z,
    };
  };

  const nos = ids
    .filter((id) => posicoes[id])
    .map((id) => ({ id, ...projetar(posicoes[id].x, posicoes[id].z) }))
    .sort((a, b) => a.z - b.z || a.sx - b.sx);
  const casario = cenario
    .map((c) => ({ chave: c.predio, logradouro: !!c.logradouro, ...projetar(c.x, c.z) }))
    .sort((a, b) => a.z - b.z || a.sx - b.sx);

  return {
    quadro,
    margem,
    horizonte,
    beira,
    unidade,
    mundo,
    projetar,
    nos,
    cenario: casario,
    estrada: estrada ? estrada.map((p) => projetar(p.x, p.z)) : null,
  };
}

// ---------------------------------------------------------------------
// A ESCALA GRÁFICA ("1H DE VILA") — o comprimento, na prancha, de uma
// hora de caminhada. Sai do dado que o jogo já tem: a distância de
// maquete entre dois nós dividida pelo custo em horas que o motor cobra
// pelo trecho. O MENOR quociente, não a média: o custo do jogo é por
// grupo, não por distância, e a média deixaria a régua inflada pelo
// trecho longo que custa o mesmo que o curto. A régua promete então o
// que é honesto — o percurso mais apertado que ainda custa uma hora.
// Devolve null quando não há par com custo real (nada a medir).
// ---------------------------------------------------------------------
export function escalaGrafica({ posicoes, ids, custoDe, unidade }) {
  let menor = null;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = posicoes[ids[i]];
      const b = posicoes[ids[j]];
      if (!a || !b) continue;
      const custo = custoDe(ids[i], ids[j]);
      if (!custo || custo <= 0) continue;
      const dist = Math.hypot(b.x - a.x, b.z - a.z);
      if (dist <= 0) continue;
      const razao = dist / custo;
      if (menor === null || razao < menor) menor = razao;
    }
  }
  return menor === null ? null : arred(menor * unidade);
}

// ---------------------------------------------------------------------
// O ESCALONAMENTO DAS ETIQUETAS — a única regra de arrumação da prancha.
//
// As etiquetas são HTML real (as mesmas do diorama), medidas em PIXELS
// de tela, não em unidades de prancha. Percorrendo da frente para o
// fundo (quem está mais perto tem prioridade de lugar), cada etiqueta
// que se sobreponha a uma já colocada SOBE em degraus fixos — o cordão
// só se alonga. Determinístico e sem estado: mesma entrada, mesmo
// arranjo (não há medição de DOM nem laço de re-render).
//
// A etiqueta procura lugar em ANEL em volta da fachada: primeiro sobe (o
// cordão estica), depois desce, e só então anda de lado — nessa ordem,
// porque um fio comprido lê melhor que um fio torto. Cada candidato é
// medido contra as etiquetas já postas; vence o primeiro livre, o mais
// perto do lugar natural. A folha tem beira: nenhum candidato sai dela.
//
// A vila gerada é mais povoada que a do caso-escola e tem nomes mais
// compridos — sem o anel inteiro, dois nós de mesma testada ficavam um
// por cima do outro, e o de baixo deixava de ser clicável.
//
//   itens   : [{ id, x, y, largura, altura }] em px, de trás para diante
//             (x é o centro; y é o PÉ da etiqueta, que cresce para cima)
//   limites : { topo, base, esquerda, direita } em px
// Devolve { [id]: { x, y } }.
// ---------------------------------------------------------------------
export function arrumarEtiquetas(itens, limites = {}) {
  const topo = typeof limites.topo === 'number' ? limites.topo : -Infinity;
  const base = typeof limites.base === 'number' ? limites.base : Infinity;
  const esquerda = typeof limites.esquerda === 'number' ? limites.esquerda : -Infinity;
  const direita = typeof limites.direita === 'number' ? limites.direita : Infinity;
  const colocadas = [];
  const saida = {};
  const livre = (item, x, y) =>
    !colocadas.some(
      (c) =>
        Math.abs(c.x - x) < (c.largura + item.largura) / 2 &&
        y - item.altura < c.y &&
        c.y - c.altura < y
    );
  // Da frente para o fundo: a etiqueta do nó mais próximo fica onde nasceu.
  for (const item of [...itens].reverse()) {
    const degrauY = Math.max(10, item.altura * 0.42);
    const degrauX = Math.max(24, item.largura * 0.5);
    const partidaX = Math.min(direita, Math.max(esquerda, item.x));
    const partidaY = Math.min(base, Math.max(topo, item.y));
    // Candidatos em anel, ordenados pelo quanto afastam a etiqueta da
    // fachada (o passo de lado pesa mais que o passo para cima).
    const candidatos = [];
    for (let ky = -14; ky <= 8; ky++) {
      for (let kx = -3; kx <= 3; kx++) {
        const x = partidaX + kx * degrauX;
        const y = partidaY + ky * degrauY;
        if (y < topo || y > base || x < esquerda || x > direita) continue;
        candidatos.push({ x, y, custo: Math.abs(ky) + Math.abs(kx) * 2.5 + (ky > 0 ? 0.5 : 0) });
      }
    }
    candidatos.sort((a, b) => a.custo - b.custo);
    const posto = candidatos.find((c) => livre(item, c.x, c.y)) || { x: partidaX, y: partidaY };
    colocadas.push({ x: posto.x, y: posto.y, largura: item.largura, altura: item.altura });
    saida[item.id] = { x: arred(posto.x), y: arred(posto.y) };
  }
  return saida;
}
