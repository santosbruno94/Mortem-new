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
import { REPLICA_ID, IDS_POOL, IDS_LUTA } from './casos_indice.js';

// O BANCO PESADO (~1,8 MB de pacotes prontos) fica FORA do chunk de
// arranque: chega por import() dinâmico na primeira vez que um caso
// gerado é pedido (diagnóstico 21/07, Lote 5 — mesmo mecanismo do
// diorama). A camada síncrona decide pelo ÍNDICE leve (casos_indice.js,
// gerado junto do banco; paridade guardada no qa.mjs). É asset do próprio
// bundle — zero rede externa em runtime, determinismo intacto.
let bancoPromise = null;
function carregarBanco() {
  if (!bancoPromise) bancoPromise = import('./casos_gerados.js');
  return bancoPromise;
}

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

// Pacote de um caso pelo ID (retomada de save e atalho ?caso=). ASSÍNCRONO
// desde o Lote 5: o caminho do tutorial resolve sem tocar o banco; um id
// desconhecido (save de banco antigo) devolve null SEM baixar o banco.
export async function obterPacotePorCasoId(casoId) {
  if (!casoId || casoId === 'a_hora_emprestada') return montarPacoteTutorial();
  if (casoId !== REPLICA_ID && !IDS_POOL.includes(casoId) && !IDS_LUTA.includes(casoId)) return null;
  const { CASO_REPLICA, CASOS_POOL, CASOS_LUTA } = await carregarBanco();
  if (casoId === CASO_REPLICA.id) return CASO_REPLICA;
  return CASOS_POOL.find((p) => p.id === casoId)
    || CASOS_LUTA.find((p) => p.id === casoId)
    || null;
}

// O modo a que um caso carregado pertence (para a tela inicial refletir
// o estado corrente sem recarregar nada). SÍNCRONO: decide pelo índice.
export function modoDoCaso(casoId) {
  if (!casoId || casoId === 'a_hora_emprestada') return 'tutorial';
  if (casoId === REPLICA_ID) return 'replica';
  if (IDS_LUTA.includes(casoId)) return 'luta';
  return 'procedural';
}

// Pacote-alvo de um modo (assíncrono — puxa o banco na primeira vez).
// Para o procedural, `indice` escolhe no banco — a tela inicial passa um
// índice sorteado (apresentação); qualquer número resolve por módulo,
// determinística e defensivamente.
export async function pacoteDoModo(modoId, indice = 0) {
  if (modoId !== 'replica' && modoId !== 'luta' && modoId !== 'procedural') {
    return montarPacoteTutorial();
  }
  const { CASO_REPLICA, CASOS_POOL, CASOS_LUTA } = await carregarBanco();
  if (modoId === 'replica') return CASO_REPLICA;
  if (modoId === 'luta') {
    const n = CASOS_LUTA.length;
    return CASOS_LUTA[((Math.floor(indice) % n) + n) % n];
  }
  const n = CASOS_POOL.length;
  return CASOS_POOL[((Math.floor(indice) % n) + n) % n];
}

export const TAMANHO_POOL = IDS_POOL.length;
export const TAMANHO_POOL_LUTA = IDS_LUTA.length;
