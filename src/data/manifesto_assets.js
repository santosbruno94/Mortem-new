// =====================================================================
// MANIFESTO DE ASSETS — o registro único de todo asset 2D sob contrato.
//
// Cada entrada declara: id (único), slot (de slots_assets.js), caminho
// (relativo à raiz do repositório, dentro de DIR_BASE_ASSETS), dimensoes
// (que TÊM de casar com o slot) e licenca (os quatro campos obrigatórios:
// tipo, fonte, url, autor). A guarda do qa.mjs valida entrada por entrada:
// arquivo existe, mede-se e bate com o slot, licença completa.
//
// COMEÇA VAZIO de propósito: com zero arte, o resolvedor devolve sempre
// null e o jogo renderiza o procedural atual — pixel-a-pixel idêntico ao
// de hoje. Adicionar arte é acrescentar uma entrada aqui E o arquivo no
// caminho declarado; remover o arquivo faz o qa.mjs acusar e o runtime
// cair no fallback sem erro.
//
// Modelo de entrada (para quando houver arte):
//   {
//     id: 'retrato_teste',
//     slot: 'retrato',
//     caminho: 'src/assets/gravuras/retrato/teste.svg',
//     dimensoes: { largura: 320, altura: 320 },
//     licenca: {
//       tipo: 'Domínio Público',
//       fonte: 'British Library (Flickr Commons)',
//       url: 'https://www.flickr.com/photos/britishlibrary/…',
//       autor: 'desconhecido',
//     },
//   }
// =====================================================================

export const MANIFESTO_ASSETS = [];

// Consulta: a entrada do manifesto para um dado slot + chave (id do asset).
// Só leitura de dado; o resolvedor de runtime usa isto para achar o caminho.
export function entradaManifesto(slot, chave) {
  return MANIFESTO_ASSETS.find((a) => a.slot === slot && a.id === chave) || null;
}

// Todas as entradas de um slot (útil para camadas na FASE 3).
export function entradasDoSlot(slot) {
  return MANIFESTO_ASSETS.filter((a) => a.slot === slot);
}
