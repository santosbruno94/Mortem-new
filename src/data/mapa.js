// =====================================================================
// MAPA DO CASO — "o dia do perito" (triagem de rota).
//
// Este arquivo é DADO PURO (sem lógica de regra). Ele descreve a
// topologia do mapa: quais lugares existem, quanto custa (em horas)
// viajar entre eles, e quais leads desbloqueiam novos lugares durante
// a investigação.
//
// Princípio do loop (relógio mole):
//   - DENTRO de um local o relógio CONGELA: examinar e pensar é ilimitado.
//   - O tempo só passa quando o perito VIAJA de um nó a outro.
//   - O perecível (rigor, temperatura) perde precisão conforme o relógio
//     anda; o durável (livor, relógio de bolso, registros) nunca se perde.
//     Ir longe (Moorford, 3h ida e volta) é um ATALHO opcional, jamais
//     obrigatório.
//
// A lógica que CONSOME estes dados (avançar o relógio ao viajar, abrir o
// local, desbloquear nós) vive no store; aqui só declaramos o mundo.
//
// Os ids dos nós são iguais aos ids das localidades (src/data/localidades.js),
// para que abrir um nó reuse a prosa correspondente.
// =====================================================================

// Grupos geográficos. O custo de viagem depende do grupo de origem e de
// destino (ver CUSTO_ENTRE_GRUPOS).
export const GRUPOS = {
  // A relojoaria é um prédio só: o corpo e a cena no escritório dos fundos,
  // a oficina de consertos e a saleta onde Silas recebe o perito. Andar
  // entre eles não custa tempo.
  relojoaria: 'A relojoaria — corpo, cena do crime, oficina e a saleta (mesmo prédio)',
  // A vila de Briarstone: prédios diferentes, a um pulo de distância.
  vila: 'A vila de Briarstone — a casa do condestável, estalagem, loja, moinho',
  // Fora da vila: caro de alcançar.
  fora: 'Fora de Briarstone (Moorford)',
};

// Custo de viagem em HORAS entre grupos (simétrico).
//   - Dentro da relojoaria: 0h (é o mesmo prédio).
//   - Dentro da vila: 1h (prédios diferentes na mesma vila).
//   - Relojoaria <-> vila: 1h.
//   - Qualquer coisa <-> fora (Moorford): 1,5h por trecho (3h ida e volta).
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
    id: 'oficina',
    rotulo: 'A Oficina',
    grupo: 'relojoaria', // a oficina de consertos, nos fundos da loja; Davey trabalha aqui
    desbloqueadoInicio: true,
  },
  {
    id: 'interrogatorio_silas',
    rotulo: 'A Saleta',
    grupo: 'relojoaria', // recebe o perito na saleta da relojoaria
    desbloqueadoInicio: true,
  },
  {
    id: 'delegacia', // id do balde T — a OS-R2 renomeia-o
    rotulo: 'A Casa do Condestável',
    grupo: 'vila',
    desbloqueadoInicio: true,
  },
  {
    id: 'estalagem',
    rotulo: 'A Estalagem',
    grupo: 'vila', // The Wheatsheaf; Walter hospedado no nº 3, Silas no nº 5
    desbloqueadoInicio: true,
  },
  {
    id: 'papelaria',
    rotulo: 'A Loja da Sra. Rooke',
    grupo: 'vila', // a loja e correio da High Street (id `papelaria` mantido)
    desbloqueadoInicio: true,
  },
  {
    id: 'moinho',
    rotulo: 'O Moinho',
    grupo: 'vila', // na orla da vila; Caleb Grey
    desbloqueadoInicio: true,
  },
  {
    id: 'gabinete_pettigrew',
    rotulo: 'Gabinete Pettigrew',
    grupo: 'fora',
    desbloqueadoInicio: false, // só aparece quando um lead o cita (ver LEADS)
    // O procurador do morto, em Moorford. CORROBORAÇÃO: o caso já fecha
    // pelo corpo e pela oficina; isto é um atalho caro (3h ida e volta).
  },
];

// LEADS: quando o perito extrai certa carta, um novo nó se revela no mapa.
// É assim que o mapa de lugares relevantes CRESCE durante a investigação.
export const LEADS_DESBLOQUEIO = [
  {
    cartaId: 'dep_testamento',
    revelaNo: 'gabinete_pettigrew',
    nota: 'O testamento foi lavrado no gabinete do procurador Pettigrew, em Moorford.',
  },
  {
    cartaId: 'ev_livro_ordens',
    revelaNo: 'gabinete_pettigrew',
    nota: 'A última entrada do livro de ordens marca: "Pettigrew, segunda" — o procurador de Moorford.',
  },
];

// ---------------------------------------------------------------------
// Acessores de consulta (sem regra de jogo — apenas leitura de dado).
// ---------------------------------------------------------------------

/**
 * @deprecated Lê SÓ o mapa do caso-escola. Em runtime use o acessor
 * homônimo de pacote_caso.js, que responde pelo caso CARREGADO (inclusive
 * os gerados). Este fica para o gerador/QA (ilhas de build).
 */
export function obterNo(id) {
  return NOS_MAPA.find((n) => n.id === id) || null;
}

// Custo em horas para viajar de um nó a outro.
/** @deprecated Mesmo aviso de obterNo: use o de pacote_caso.js em runtime. */
export function custoViagem(idOrigem, idDestino) {
  const origem = obterNo(idOrigem);
  const destino = obterNo(idDestino);
  if (!origem || !destino) return 0;
  return CUSTO_ENTRE_GRUPOS[`${origem.grupo}|${destino.grupo}`] ?? 0;
}
