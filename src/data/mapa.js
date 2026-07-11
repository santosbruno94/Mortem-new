// =====================================================================
// MAPA DO CASO — "o dia do perito" (triagem de rota).
//
// Este arquivo é DADO PURO (sem lógica de regra). Ele descreve a
// topologia do mapa: quais lugares existem, quanto custa (em horas)
// viajar entre eles, e quais leads desbloqueiam novos lugares durante
// a investigação.
//
// Princípio do novo loop (relógio mole):
//   - DENTRO de um local o relógio CONGELA: examinar e pensar é ilimitado.
//   - O tempo só passa quando o perito VIAJA de um nó a outro.
//   - O perecível (rigor, temperatura) perde precisão conforme o relógio
//     anda; o durável (livor, sulco, cena) nunca se perde. Por isso ir
//     longe (Moorford, 3h ida e volta) é um ATALHO opcional, jamais obrigatório.
//
// A lógica que CONSOME estes dados (avançar o relógio ao viajar, abrir o
// local, desbloquear nós) entra na Fase 2 — aqui só declaramos o mundo.
//
// Os ids dos nós são iguais aos ids das localidades (src/data/localidades.js),
// para que abrir um nó reuse a prosa já existente.
// =====================================================================

// Grupos geográficos. O custo de viagem depende do grupo de origem e de
// destino (ver CUSTO_ENTRE_GRUPOS).
export const GRUPOS = {
  // A relojoaria é um prédio só: o corpo, a cena e a saleta onde Edgar
  // recebe o perito ficam todos ali. Andar entre eles não custa tempo.
  relojoaria: 'A relojoaria — corpo, cena do crime e a saleta de Edgar (mesmo prédio)',
  // A vila de Briarstone: prédios diferentes, a um pulo de distância.
  vila: 'A vila de Briarstone — delegacia, casa da governanta, taverna',
  // Fora da vila: caro de alcançar.
  fora: 'Fora de Briarstone',
};

// Custo de viagem em HORAS entre grupos (simétrico).
//   - Dentro da relojoaria: 0h (é o mesmo prédio).
//   - Dentro da vila: 1h (prédios diferentes na mesma vila).
//   - Relojoaria <-> vila: 1h.
//   - Qualquer coisa <-> fora (Moorford): 1,5h por trecho (3h ida e volta).
//     Este número é AMARRADO à lógica do caso: Edgar deixa o Clube por volta
//     das 20h30 (corrob_moorford) e precisa chegar a Briarstone para matar às
//     22h — só fecha com ~1,5h de estrada. Ver docs/historico-decisoes.md.
export const CUSTO_ENTRE_GRUPOS = {
  'relojoaria|relojoaria': 0,
  'vila|vila': 1,
  'relojoaria|vila': 1,
  'vila|relojoaria': 1,
  'relojoaria|fora': 1.5,
  'fora|relojoaria': 1.5,
  'vila|fora': 1.5,
  'fora|vila': 1.5,
  'fora|fora': 0,
};

// NÓS DO MAPA. `desbloqueadoInicio: true` = visível desde o começo da
// investigação. Os demais aparecem quando um lead os revela (ver LEADS).
export const NOS_MAPA = [
  {
    id: 'corpo',
    rotulo: 'O Corpo',
    grupo: 'relojoaria',
    desbloqueadoInicio: true,
  },
  {
    id: 'cena',
    rotulo: 'A Cena do Crime',
    grupo: 'relojoaria',
    desbloqueadoInicio: true,
  },
  {
    id: 'interrogatorio_edgar',
    rotulo: 'Edgar Arthurs',
    grupo: 'relojoaria', // recebe o perito na saleta da relojoaria
    desbloqueadoInicio: true,
  },
  {
    id: 'delegacia',
    rotulo: 'A Delegacia',
    grupo: 'vila',
    desbloqueadoInicio: true,
  },
  {
    id: 'interrogatorio_hudson',
    rotulo: 'Sra. Hudson',
    grupo: 'vila', // na casa grande da vítima
    desbloqueadoInicio: true,
  },
  {
    id: 'interrogatorio_blackwood',
    rotulo: 'Thomas Blackwood',
    grupo: 'vila', // na taverna The Crossed Keys
    desbloqueadoInicio: true,
  },
  {
    id: 'clube_moorford',
    rotulo: 'Clube de Moorford',
    grupo: 'fora',
    desbloqueadoInicio: false, // só aparece quando um lead o cita (ver LEADS)
    // Aqui o perito pode tentar furar o álibi de Edgar. É CORROBORAÇÃO:
    // o caso já fecha pelo corpo; isto é um atalho caro (3h ida e volta).
  },
];

// LEADS: quando o perito extrai certa carta, um novo nó se revela no mapa.
// É assim que o mapa de lugares relevantes CRESCE durante a investigação.
export const LEADS_DESBLOQUEIO = [
  {
    cartaId: 'alibi_edgar',
    revelaNo: 'clube_moorford',
    nota: 'Edgar diz ter jantado no Clube Comercial de Moorford — vale conferir.',
  },
  {
    cartaId: 'dep_dividas',
    revelaNo: 'clube_moorford',
    nota: 'As cartas de cobrança vêm de um clube de Moorford.',
  },
];

// ---------------------------------------------------------------------
// Acessores de consulta (sem regra de jogo — apenas leitura de dado).
// ---------------------------------------------------------------------

export function obterNo(id) {
  return NOS_MAPA.find((n) => n.id === id) || null;
}

// Custo em horas para viajar de um nó a outro.
export function custoViagem(idOrigem, idDestino) {
  const origem = obterNo(idOrigem);
  const destino = obterNo(idDestino);
  if (!origem || !destino) return 0;
  return CUSTO_ENTRE_GRUPOS[`${origem.grupo}|${destino.grupo}`] ?? 0;
}
