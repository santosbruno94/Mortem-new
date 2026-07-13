// =====================================================================
// PLANTA DA RELOJOARIA — camada 100% VISUAL (§5.1 do contexto).
//
// Geometria SVG procedural da planta baixa da relojoaria Arthurs (High
// Street, nº 7), desenhada como traço de tinta sobre papel — a mesma
// matéria da mesa. NENHUMA regra lê este arquivo: a topologia e os custos
// de viagem continuam em src/data/mapa.js (o motor). Cada cômodo clicável
// referencia o(s) id(s) de nó de NOS_MAPA pelos seus ALVOS — trocar a
// planta nunca toca o jogo. Por ser SVG 2D, funciona idêntico em ?flat=1.
//
// Orientação do desenho: o topo do quadro é o beco (os fundos); a base é
// a High Street (a frente). Coordenadas no viewBox declarado abaixo.
//
// O escritório dos fundos é uma sala só, mas guarda DOIS nós do mapa (o
// corpo jaz na cena): por isso tem dois alvos na mesma sala.
// =====================================================================

export const PLANTA_RELOJOARIA = {
  titulo: 'Relojoaria Arthurs — High Street, nº 7',
  viewBox: '0 0 380 250',

  // Cômodos CLICÁVEIS. Cada `alvo` é uma área de toque (hit) com rótulo,
  // que VIAJA para o nó indicado (custo 0 — mesmo prédio). O `hit` é o
  // retângulo sensível ao clique; `rotuloPos`, a âncora do texto.
  comodos: [
    {
      id: 'escritorio',
      rotulo: 'Escritório dos Fundos',
      contorno: 'M30 32 H178 V148 H30 Z',
      rotuloPos: { x: 104, y: 47 },
      alvos: [
        { no: 'cena', rotulo: 'a cena', hit: { x: 31, y: 33, w: 71, h: 114 }, pos: { x: 66, y: 96 } },
        { no: 'corpo', rotulo: 'o corpo', hit: { x: 104, y: 33, w: 73, h: 114 }, pos: { x: 140, y: 112 } },
      ],
    },
    {
      id: 'oficina',
      rotulo: 'Oficina de Consertos',
      contorno: 'M202 32 H350 V148 H202 Z',
      rotuloPos: { x: 276, y: 47 },
      alvos: [{ no: 'oficina', rotulo: 'a oficina', hit: { x: 203, y: 33, w: 146, h: 114 }, pos: { x: 276, y: 98 } }],
    },
    {
      id: 'saleta',
      rotulo: 'Saleta',
      contorno: 'M296 168 H350 V222 H296 Z',
      rotuloPos: { x: 323, y: 183 },
      alvos: [{ no: 'interrogatorio_silas', rotulo: 'a saleta', hit: { x: 297, y: 169, w: 52, h: 52 }, pos: { x: 323, y: 203 } }],
    },
  ],

  // Cômodos DECORATIVOS (sem nó — não clicáveis): a loja da frente e o
  // corredor que a liga aos fundos. Traço mais claro que o dos cômodos.
  decorSalas: [
    { rotulo: 'Loja', contorno: 'M30 168 H284 V222 H30 Z', rotuloPos: { x: 92, y: 197 } },
    { contorno: 'M178 148 H202 V168 H178 Z' }, // corredor (passagem, sem rótulo)
  ],

  // Traços de mobília e aberturas (tinta fina): o balcão em L da loja, a
  // lareira encostada no fundo do escritório (onde o relógio ficava), a
  // porta dos fundos para o beco (com o arco do batente), a escada.
  tracos: [
    'M52 212 H150 V192', // balcão em L, junto à vitrine
    'M60 32 H98 V41 H60 Z', // a lareira, contra a parede dos fundos
    'M148 32 A20 20 0 0 1 168 52', // arco da porta dos fundos (para o beco)
    'M181 152 H199 M181 158 H199 M181 164 H199', // degraus da escada, no corredor
  ],

  // A vitrine — a fachada envidraçada sobre a High Street (frente da loja).
  // Duas linhas paralelas rentes ao muro da rua.
  vitrine: 'M60 222 H150',

  // Etiquetas de papel do desenho (não clicáveis).
  rotulosDecor: [
    { texto: 'beco', x: 104, y: 22 },
    { texto: 'High Street', x: 157, y: 242 },
  ],
};

// Todos os ids de nó que a planta expõe (para a régua mobile e o QA).
export function nosDaPlanta() {
  return PLANTA_RELOJOARIA.comodos.flatMap((c) => c.alvos.map((a) => a.no));
}
