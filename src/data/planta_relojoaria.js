// =====================================================================
// PLANTA DA RELOJOARIA — camada 100% VISUAL (§5.1 do contexto).
//
// Geometria SVG procedural da planta baixa da relojoaria Arthurs (High
// Street, nº 7), desenhada como traço de tinta sobre papel — a mesma
// matéria da mesa. NENHUMA regra lê este arquivo: a topologia e os custos
// de viagem continuam em src/data/mapa.js (o motor). Por ser SVG 2D,
// funciona idêntico em ?flat=1.
//
// OS-R2 — CENA ÚNICA. A planta deixou de ser um desenho parado e passou a
// ser a NAVEGAÇÃO real do prédio. Antes, os cômodos apontavam três nós do
// mapa (corpo, cena, oficina) e clicar um deles era viajar; hoje o prédio
// é um nó só (`relojoaria`) e cada cômodo aponta um SUB-LOCAL dele —
// `{ no, sub }`. O único alvo que continua a ser viagem entre nós é a
// saleta de Silas (`{ no: 'interrogatorio_silas' }`), que segue nó próprio
// no mesmo grupo (custo 0). Andar, aqui, nunca custa hora.
//
// Orientação do desenho: o topo do quadro é o beco (os fundos); a base é
// a High Street (a frente). Coordenadas no viewBox declarado abaixo.
//
// O escritório dos fundos é uma sala só, mas guarda DOIS sub-locais (o
// corpo jaz na cena): por isso tem dois alvos na mesma sala.
// =====================================================================

export const PLANTA_RELOJOARIA = {
  titulo: 'Relojoaria Arthurs — High Street, nº 7',
  viewBox: '0 0 380 250',

  // Cômodos CLICÁVEIS. Cada `alvo` é uma área de toque (hit) com rótulo.
  // `sub` = trocar de sub-local dentro do prédio; `no` sozinho = viajar
  // para outro nó do mesmo grupo (custo 0). O `hit` é o retângulo sensível
  // ao clique; `pos`, a âncora do texto do alvo.
  comodos: [
    {
      id: 'escritorio',
      rotulo: 'Escritório dos Fundos',
      contorno: 'M30 32 H168 V148 H30 Z',
      rotuloPos: { x: 99, y: 47 },
      alvos: [
        { no: 'relojoaria', sub: 'escritorio', rotulo: 'a cena', hit: { x: 31, y: 33, w: 66, h: 114 }, pos: { x: 64, y: 96 } },
        { no: 'relojoaria', sub: 'corpo', rotulo: 'o corpo', hit: { x: 99, y: 33, w: 68, h: 114 }, pos: { x: 133, y: 112 } },
      ],
    },
    {
      // A copa apertada dos fundos, entre o escritório e a oficina.
      id: 'copa',
      rotulo: 'Copa',
      contorno: 'M184 32 H222 V92 H184 Z',
      rotuloPos: { x: 203, y: 47 },
      alvos: [{ no: 'relojoaria', sub: 'copa', rotulo: 'a copa', hit: { x: 185, y: 33, w: 36, h: 58 }, pos: { x: 203, y: 72 } }],
    },
    {
      id: 'oficina',
      rotulo: 'Oficina de Consertos',
      contorno: 'M236 32 H350 V148 H236 Z',
      rotuloPos: { x: 293, y: 47 },
      alvos: [{ no: 'relojoaria', sub: 'oficina', rotulo: 'a oficina', hit: { x: 237, y: 33, w: 112, h: 114 }, pos: { x: 293, y: 98 } }],
    },
    {
      // A loja da frente deixou de ser decoração: desde a OS-R2 é sub-local
      // com carta própria (a vitrine que refuta o roubo).
      id: 'loja',
      rotulo: 'Loja',
      contorno: 'M30 172 H288 V226 H30 Z',
      rotuloPos: { x: 100, y: 187 },
      alvos: [{ no: 'relojoaria', sub: 'loja', rotulo: 'a loja', hit: { x: 31, y: 173, w: 256, h: 52 }, pos: { x: 190, y: 205 } }],
    },
    {
      id: 'saleta',
      rotulo: 'Saleta',
      contorno: 'M302 172 H350 V226 H302 Z',
      rotuloPos: { x: 326, y: 187 },
      alvos: [{ no: 'interrogatorio_silas', rotulo: 'a saleta', hit: { x: 303, y: 173, w: 46, h: 52 }, pos: { x: 326, y: 207 } }],
    },
  ],

  // Cômodos DECORATIVOS (sem alvo — não clicáveis): o corredor que liga a
  // loja aos fundos. Traço mais claro que o dos cômodos.
  decorSalas: [
    { contorno: 'M184 92 H222 V172 H184 Z' }, // corredor (passagem, sem rótulo)
  ],

  // Traços de mobília e aberturas (tinta fina): o balcão em L da loja, a
  // lareira encostada no fundo do escritório (onde o relógio ficava), a
  // porta dos fundos para o beco (com o arco do batente), a escada.
  tracos: [
    'M52 216 H150 V196', // balcão em L, junto à vitrine
    'M60 32 H98 V41 H60 Z', // a lareira, contra a parede dos fundos
    'M138 32 A20 20 0 0 1 158 52', // arco da porta dos fundos (para o beco)
    'M187 152 H219 M187 158 H219 M187 164 H219', // degraus da escada, no corredor
  ],

  // A vitrine — a fachada envidraçada sobre a High Street (frente da loja).
  // Duas linhas paralelas rentes ao muro da rua.
  vitrine: 'M60 226 H150',

  // Etiquetas de papel do desenho (não clicáveis). A porta do beco é o
  // sub-local `porta_beco` de src/data/localidades.js: declarado na
  // topologia, sem sala clicável enquanto não houver prosa para ele.
  rotulosDecor: [
    { texto: 'beco', x: 104, y: 22 },
    { texto: 'High Street', x: 157, y: 246 },
  ],
};

// Todos os ids de nó que a planta expõe (para a régua mobile e o QA).
export function nosDaPlanta() {
  return PLANTA_RELOJOARIA.comodos.flatMap((c) => c.alvos.map((a) => a.no));
}

// Todos os sub-locais que a planta expõe como sala clicável (QA de
// alcançabilidade — GR2-1).
export function subLocaisDaPlanta() {
  return PLANTA_RELOJOARIA.comodos.flatMap((c) => c.alvos.filter((a) => a.sub).map((a) => a.sub));
}
