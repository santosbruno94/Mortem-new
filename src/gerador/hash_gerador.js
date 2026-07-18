// =====================================================================
// HASH DE DECISÃO DO GERADOR — decorrelação de chaves-irmãs (OS priors
// compostos, F2; achado B✱ da triagem F0 e dossiê F1 §2.3).
//
// Módulo GERADOR-FACING (o runtime jamais o importa; guarda no qa.mjs).
//
// POR QUE EXISTE: hashString (src/logic/hash.js) é o polinômio linear
// h = h·31 + c, SEM etapa de avalanche. Consequência aritmética: duas
// chaves com o mesmo prefixo e sufixos do MESMO comprimento diferem por
// uma CONSTANTE aditiva (ex.: 13298 entre `…|INT` e `…|WIS`), e quando
// os totais de peso dos dois sorteios coincidem, o resto módulo-total
// fica travado num subconjunto dos pares — sorteios "independentes"
// rigidamente correlacionados (medido: 18 de 81 pares alcançáveis,
// quadrantes INT × WIS permitidos pelos priors porém mortos na prática).
//
// O REMÉDIO: re-hashear a representação DECIMAL do primeiro hash,
// concatenada à própria chave. A passagem número → string decimal é
// não-linear (muda comprimento e dígitos), então a diferença constante
// entre chaves-irmãs vira diferença imprevisível entre as entradas do
// segundo passe — decorrelacionado na prática (guarda de independência
// no qa.mjs).
//
// ESCOPO: amostragem de elenco e psique (amostragem.js,
// vetores_psiquicos.js) e todo sorteio que passe por sortearPonderado.
// src/logic/hash.js NÃO muda: o runtime (variantes de monólogo, hachura
// de retratos) e os casos autorais ficam intactos. Módulos do gerador
// fora do namespace de elenco (cidade, crime, interferência) mantêm
// hashString direto — chaves de comprimento variado, sem par-irmão de
// mesmo comprimento identificado; migrá-los é decisão futura, não desta
// OS (registro no dossiê F1 §2.3).
//
// Determinismo intacto: função pura de string → inteiro ≥ 0.
// =====================================================================

import { hashString } from '../logic/hash.js';

export function hashDecisao(chave) {
  return hashString(`${hashString(chave)}#${chave}`);
}
