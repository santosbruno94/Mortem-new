// =====================================================================
// REGISTRO DE CASOS E MODOS DE JOGO — a porta única entre a tela inicial
// e os pacotes de caso disponíveis.
//
// DADO + acessores de leitura (nenhuma regra de jogo). Os quatro modos:
//   1. tutorial   — "A Hora Emprestada", o caso-escola artesanal, como
//                   sempre foi (pacote default do módulo pacote_caso).
//   2. replica    — a tentativa de recriar o caso-escola pela mecânica
//                   procedural: seed fixa + variáveis dirigidas (pacote
//                   pré-gerado em src/data/casos_gerados.js).
//   3. procedural — "um caso da comarca": um caso aleatório do banco
//                   pré-gerado (CASOS_POOL). A ESCOLHA de qual caso sai
//                   do banco é da camada de apresentação (tela inicial);
//                   o caso em si é determinístico por seed.
//   4. luta       — "A Marca do Agressor": um caso da comarca onde a
//                   luta corporal é forçada (CASOS_LUTA) — a carta
//                   gen_sinal_exigivel existe sempre, garantindo o
//                   verbo "Exigir que mostre".
//
// O gerador é ilha de build time: os pacotes chegam aqui como dado
// versionado (scripts/gerar-casos.mjs), nunca por import de src/gerador.
// =====================================================================

import { montarPacoteTutorial } from './pacote_caso.js';
import { CASO_REPLICA, CASOS_POOL, CASOS_LUTA } from './casos_gerados.js';

// Os modos oferecidos na tela inicial, na ordem de apresentação.
export const MODOS_DE_JOGO = [
  {
    id: 'tutorial',
    rotulo: 'A Hora Emprestada',
    descricao: 'O caso-escola, escrito à mão. Briarstone, 1893: o relojoeiro morto e o relógio que mente.',
  },
  {
    id: 'replica',
    rotulo: 'A Hora Refeita',
    descricao:
      'O mesmo crime, refeito pela máquina: a vila gerada tenta recriar o caso-escola com as suas próprias peças.',
  },
  {
    id: 'procedural',
    rotulo: 'Um Caso da Comarca',
    descricao: 'Um crime que nenhuma mão escreveu: vila, elenco e vestígios nascem da simulação. Cada convite, um caso.',
  },
  {
    id: 'luta',
    rotulo: 'A Marca do Agressor',
    descricao: 'Um caso da comarca onde a luta corporal é certa: o corpo da vítima sempre anuncia a marca-espelho.',
  },
];

// Pacote de um caso pelo ID (retomada de save e atalho ?caso=). Devolve
// null quando o id não é conhecido (save de banco antigo → recomeço).
export function obterPacotePorCasoId(casoId) {
  if (!casoId || casoId === 'a_hora_emprestada') return montarPacoteTutorial();
  if (casoId === CASO_REPLICA.id) return CASO_REPLICA;
  return CASOS_POOL.find((p) => p.id === casoId)
    || CASOS_LUTA.find((p) => p.id === casoId)
    || null;
}

// O modo a que um caso carregado pertence (para a tela inicial refletir
// o estado corrente sem recarregar nada).
export function modoDoCaso(casoId) {
  if (!casoId || casoId === 'a_hora_emprestada') return 'tutorial';
  if (casoId === CASO_REPLICA.id) return 'replica';
  if (CASOS_LUTA.some((p) => p.id === casoId)) return 'luta';
  return 'procedural';
}

// Pacote-alvo de um modo. Para o procedural, `indice` escolhe no banco —
// a tela inicial passa um índice sorteado (apresentação); qualquer número
// resolve por módulo, determinística e defensivamente.
export function pacoteDoModo(modoId, indice = 0) {
  if (modoId === 'replica') return CASO_REPLICA;
  if (modoId === 'luta') {
    const n = CASOS_LUTA.length;
    return CASOS_LUTA[((Math.floor(indice) % n) + n) % n];
  }
  if (modoId === 'procedural') {
    const n = CASOS_POOL.length;
    return CASOS_POOL[((Math.floor(indice) % n) + n) % n];
  }
  return montarPacoteTutorial();
}

export const TAMANHO_POOL = CASOS_POOL.length;
export const TAMANHO_POOL_LUTA = CASOS_LUTA.length;
