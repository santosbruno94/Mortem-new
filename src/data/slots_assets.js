// =====================================================================
// SLOTS DE ASSET — o contrato visual do "asset 2D sob contrato" (FASE 2).
//
// Um slot é um TIPO de encaixe visual com dimensões FIXAS. O manifesto
// (manifesto_assets.js) só admite assets que declarem um destes slots e
// batam com a dimensão dele; o resolvedor (src/logic/assets.js) devolve o
// asset quando existe e é válido, e NULL caso contrário — e aí o
// componente cai no procedural atual (SVG/CSS). Nenhuma regra do motor lê
// isto: é camada de APRESENTAÇÃO pura (invariante do CLAUDE.md).
//
// Regra de ouro: dado, nunca função. Dimensões em PIXELS lógicos; o slot
// é quadrado, paisagem ou ornamento, com UMA dimensão canônica cada.
// Formato preferencial SVG (escala sem custo); PNG admitido SOMENTE na
// dimensão exata do slot (a guarda do qa.mjs recusa fora da medida).
// =====================================================================

// -----------------------------------------------------------------
// RESTRIÇÃO DE PALETA (normativa — vale para toda arte que entrar num slot)
// -----------------------------------------------------------------
// Estilo: gravura/xilogravura de época (Inglaterra vitoriana, 1893),
// coerente com a mesa à luz de vela. A arte reduz-se aos tokens de
// material abaixo — sem cor saturada, sem gradiente fotográfico; tinta
// sobre papel, com latão só como acento (relojoaria, uniforme, selo).
//
//   tinta  #201a14  — traço, hachura, sombra (a "tinta" da gravura)
//   papel  #cfc4ae  — fundo/luz, o creme envelhecido da folha
//   latao  #8a7a4a  — acento metálico contido (mecanismo, botão, selo)
//
// Proveniência preferencial: acervos de DOMÍNIO PÚBLICO — British Library
// (Flickr Commons), NYPL Digital Collections, Old Book Illustrations.
// Ver docs/kb-producao/assets-e-como-obter.md §4 (gravuras DP admitidas
// como asset 2D de UI sob este contrato). Toda proveniência é registrada,
// asset a asset, no campo `licenca` do manifesto (guarda no qa.mjs).
export const PALETA_GRAVURA = {
  tinta: '#201a14',
  papel: '#cfc4ae',
  latao: '#8a7a4a',
};

// Acervos de domínio público recomendados (para o campo licenca.fonte).
export const ACERVOS_DOMINIO_PUBLICO = [
  'British Library (Flickr Commons)',
  'NYPL Digital Collections',
  'Old Book Illustrations',
];

// -----------------------------------------------------------------
// TIPOS DE SLOT — dimensão canônica fixa por tipo.
//   retrato          : quadrado — ficha de personagem (retrato de gravura).
//   ilustracao_local : paisagem — vista de um local no evento de cena.
//   vinheta          : ornamento — enfeite pequeno da ficha de evidência.
// `formatos` lista as extensões aceitas; SVG primeiro (preferencial).
// -----------------------------------------------------------------
export const SLOTS_ASSETS = {
  retrato: {
    id: 'retrato',
    // Proporção 4:5 (o retrato é renderizado numa moldura de busto, viewBox
    // 120×150, altura = tamanho×1.25); 480×600 = viewBox ×4. As CAMADAS do
    // paper-doll (camadas_retrato.js) são autoradas nesta caixa.
    descricao: 'Retrato de personagem (ficha) — gravura de busto, 4:5.',
    dimensoes: { largura: 480, altura: 600 },
    formatos: ['svg', 'png'],
  },
  ilustracao_local: {
    id: 'ilustracao_local',
    descricao: 'Vista de um local — gravura em paisagem no evento de cena.',
    dimensoes: { largura: 640, altura: 384 },
    formatos: ['svg', 'png'],
  },
  vinheta: {
    id: 'vinheta',
    descricao: 'Ornamento de ficha de evidência — vinheta pequena.',
    dimensoes: { largura: 96, altura: 96 },
    formatos: ['svg', 'png'],
  },
};

// Diretório-base (relativo à raiz do repositório) onde a arte é embarcada.
// O resolvedor de runtime faz o glob deste diretório; o qa.mjs valida os
// caminhos declarados no manifesto contra o disco. Começa inexistente —
// com manifesto vazio, nenhuma arte é necessária.
export const DIR_BASE_ASSETS = 'src/assets/gravuras';

// Extensões cujo cabeçalho a guarda sabe medir (para casar com o slot).
export const FORMATOS_SUPORTADOS = ['svg', 'png'];

// Um slot é válido se existe na tabela acima.
export function obterSlot(id) {
  return SLOTS_ASSETS[id] || null;
}
