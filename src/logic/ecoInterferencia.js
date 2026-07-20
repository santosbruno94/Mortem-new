// =====================================================================
// O ECO SOBRE A INTERFERÊNCIA (FASE 4 do gerador por simulação).
//
// Nota determinística PÓS-CASO do PERITO (o jogador) reconhecendo as
// interferências que ocorreram ou foram evitadas — o mesmo mecanismo dos
// códigos de falha da FASE 6 (ecoMestre.js): variantes de prosa no pacote
// (`ecosInterferencia`, src/data/ecos_interferencia.js) + sorteio
// determinístico por hashString salgado. Sem Math.random/Date.now.
// No procedural não há legista (falaDoMestre.js): é o próprio perito quem
// relê o que se moveu na cena. A prosa vive em ecos_interferencia.js.
//
// Módulo de APRESENTAÇÃO, puro. Consome só a lista de eventos do pacote
// (ids/tipos) e o registro de disparos do store (nunca id de carta,
// textoDisplay ou tag) e devolve conclusões de id estável (origem
// 'mestre') para a Caderneta. NÃO vincula o veredicto — o motor jamais o
// lê (guarda no qa.mjs). Sem `ecosInterferencia` no pacote, não há eco.
//
// Desfechos reconhecidos por evento DISPARADO:
//   ocorrida — o efeito se aplicou (a evidência marcada perdeu-se);
//   evitada  — o gatilho disparou, mas o alvo já estava no caderno do
//              perito (quem chega primeiro não perde a peça — R4).
// Evento nunca disparado não gera eco: para o jogador, não aconteceu.
// =====================================================================

import { hashString } from './hash.js';

// Deriva as notas do perito sobre as interferências do caso encerrado.
//   eventos    : lista de `interferencias.eventos` do pacote (ou []).
//   disparadas : registro do store — [{ id, hora, evitada }].
//   ecos       : { titulo, porChave: { [`${tipo}_${desfecho}`]: string[] } }
//                do pacote (ou null/omitido — sem eco).
//   salga      : prefixo da chave de sorteio (ex.: `${casoId}|${perito}`).
// Devolve conclusões de id estável para a Caderneta (possivelmente []).
export function derivarEcosInterferencia(eventos, disparadas, ecos, salga = '') {
  if (!eventos || eventos.length === 0 || !ecos || !ecos.porChave) return [];
  const resultado = [];
  for (const disparo of disparadas || []) {
    const evento = eventos.find((e) => e.id === disparo.id);
    if (!evento) continue;
    const chave = `${evento.tipo}_${disparo.evitada ? 'evitada' : 'ocorrida'}`;
    const variantes = ecos.porChave[chave] || [];
    if (variantes.length === 0) continue;
    const resumo = variantes[hashString(`${salga}|eco_intf|${evento.id}|${chave}`) % variantes.length];
    resultado.push({
      id: `eco_interferencia_${evento.id}`,
      // `origem: 'mestre'` é o balde de canal das conclusões pós-caso na
      // Caderneta (consolidarLeituraMestre faz upsert por essa origem) —
      // NÃO é afirmação de quem fala. A voz é do perito (a prosa em
      // ecos_interferencia.js), que no procedural é quem relê a cena.
      origem: 'mestre',
      titulo: ecos.titulo,
      resumo,
      tagsOcultas: { tipo: 'eco_interferencia', chave },
    });
  }
  return resultado;
}
