// =====================================================================
// A LEITURA DO CORPO, FALADA PELO MESTRE/LEGISTA.
//
// No novo loop, o jogador NÃO opera gaveta para calcular a hora e a causa:
// um personagem (o mestre/legista) FALA a leitura forense, em linguagem
// natural, a partir do que o jogador examinou. Por baixo, a conta é a mesma
// gramática universal de sempre — só que reaproveitada aqui, sem mostrador:
//   • a janela da morte vem de calcularJanelaMorte (src/logic/cronos.js);
//   • o mecanismo vem de mecanismoCravado (src/data/catalogo_causas.js).
//
// Este módulo é puro. `lerCorpo` faz a conta; `falaDoMestre` traduz em fala (a
// DICA exibida no exame do corpo e no mural); `conclusoesDoMestre` empacota a
// leitura para a Caderneta. NÃO vincula o veredicto — quem afirma a cadeia, e
// responde por ela, é o jogador (ver src/logic/acusacao.js e veredicto.js).
//
// No modo PROCEDURAL não há mestre: a cena traz só a descrição física
// (sem vozMestre nas cartas) e o jogador, já perito, lê por conta própria.
// =====================================================================

import { calcularJanelaMorte } from './cronos.js';
import { mecanismoCravado, obterCausa } from '../data/catalogo_causas.js';
import { formatJanela } from './tempo.js';
import { ROTULOS_INSTRUMENTO } from '../data/rotulos.js';

// A conta que o mestre faz de cabeça: das cartas reunidas, devolve a janela
// da morte e o mecanismo cravado (ou nulos, se ainda falta sinal).
export function lerCorpo(cartas) {
  const temporais = (cartas || []).filter((c) => c.tagsOcultas.dominio === 'temporal');
  const causais = (cartas || []).filter((c) => c.tagsOcultas.dominio === 'causal');
  const { janela } = calcularJanelaMorte(temporais);
  const sinais = causais.map((c) => c.tagsOcultas.sinal).filter(Boolean);
  const causa = mecanismoCravado(sinais);
  const cartaInstrumento = causais.find((c) => c.tagsOcultas.instrumento);
  const instrumento = cartaInstrumento ? cartaInstrumento.tagsOcultas.instrumento : null;
  return { janela, causaId: causa ? causa.id : null, instrumento };
}

// Uma janela é "precisa" quando tem início e fim finitos e largura ≤ 6h —
// o mesmo limiar que o tribunal usa (veredicto.js).
function janelaPrecisa(janela) {
  return (
    !!janela &&
    janela.inicio !== -Infinity &&
    janela.fim !== Infinity &&
    janela.fim - janela.inicio <= 6
  );
}

// Traduz a leitura na fala do mestre. Devolve { tempo, causa } — cada um é
// uma frase pronta ou null (quando ainda falta sinal para aquela leitura).
export function falaDoMestre(leitura) {
  const { janela, causaId, instrumento } = leitura || {};

  let tempo = null;
  if (janela) {
    tempo = janelaPrecisa(janela)
      ? `Morto ${formatJanela(janela)}. E, pelos livores fixos nas costas, ninguém o moveu depois.`
      : `Morto ${formatJanela(janela)} — não dá para apertar mais que isso com o que o corpo ainda guarda.`;
  }

  let causa = null;
  if (causaId) {
    const c = obterCausa(causaId);
    const nome = c ? c.nome.toLowerCase() : causaId;
    const instr = instrumento ? ` — ${ROTULOS_INSTRUMENTO[instrumento] || instrumento}` : '';
    causa = `Quanto ao meio: ${nome}${instr}. Mãos alheias; isto não foi acidente.`;
  }

  return { tempo, causa };
}

// Empacota a leitura do mestre em conclusões de id ESTÁVEL (para reconsolidar
// a cada exame sem duplicar), exibidas na Caderneta como dica. `origem:'mestre'`.
export function conclusoesDoMestre(cartas) {
  const { janela, causaId, instrumento } = lerCorpo(cartas);
  const out = [];
  if (janela) {
    out.push({
      id: 'leitura_mestre_janela',
      origem: 'mestre',
      titulo: 'Janela da Morte',
      resumo: `O óbito ocorreu ${formatJanela(janela)}.`,
      tagsOcultas: { tipo: 'janela', inicio: janela.inicio, fim: janela.fim },
    });
  }
  if (causaId) {
    const c = obterCausa(causaId);
    const instr = instrumento ? ` — ${ROTULOS_INSTRUMENTO[instrumento] || instrumento}` : '';
    out.push({
      id: 'leitura_mestre_mecanismo',
      origem: 'mestre',
      titulo: 'Mecanismo do Óbito',
      resumo: `${c ? c.nome : causaId}${instr}.`,
      tagsOcultas: { tipo: 'mecanismo', mecanismo: causaId, instrumento },
    });
  }
  return out;
}
