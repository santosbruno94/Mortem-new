// =====================================================================
// O PREÇO DA VIAGEM — a única despesa do relógio, dita numa linha lida.
//
// A maquete 3D só mostrava o pino andando. A prancha aproveita o mesmo
// beat para DIZER o que a hora custa, com três dados que o estado já
// tem — nenhum campo novo no save, nenhuma regra nova:
//
//   1. o relógio de → para (a hora de partida e a de chegada);
//   2. a rigidez do corpo na chegada (o mesmo estadoRigorPorIpm que o
//      exame e a gaveta Cronos leem);
//   3. o perecível em risco: as observações AINDA NÃO COLHIDAS cuja
//      leitura muda de estado entre esta hora e a da chegada.
//
// Camada de APRESENTAÇÃO (linhagem de resumoVisita.js): deriva de
// definições de carta e do relógio, e JAMAIS lê tagsOcultas — o motor de
// veredicto não participa. Puro: sem estado, sem hora de parede.
// =====================================================================

import { obterCartas, obterCaso, resolverEstadoCarta } from '../data/pacote_caso.js';
import { ipmAtual } from './tempo.js';
import { estadoRigorPorIpm } from './tempo_morte.js';

// Como se diz cada estado de rigor numa linha de etiqueta. As chaves são
// as de CONSTANTES_FORENSES.rigor — trocar a prosa aqui não toca no motor.
const RIGIDEZ_EM_PROSA = {
  instalando: 'a instalar-se',
  pleno: 'por inteiro',
  resolucao: 'a ceder',
  resolvido: 'já desfeita',
};

// A conta da viagem entre a hora corrente e a hora de chegada.
//   horasJogo : o relógio agora
//   custo     : as horas que o trecho cobra (0 = não há viagem a precificar)
//   registradas : ids das cartas já na mesa (só o não colhido corre risco)
// Devolve null quando não há custo — o beat não tem preço a dizer.
export function precoDaViagem(horasJogo, custo, registradas = []) {
  if (!custo || custo <= 0) return null;
  const caso = obterCaso();
  const chegada = horasJogo + custo;
  const ipmDe = ipmAtual(horasJogo, caso.verdadeDeOuro.horasMorteAntesChegada, caso.parametrosCena.horasChegada);
  const ipmPara = ipmAtual(chegada, caso.verdadeDeOuro.horasMorteAntesChegada, caso.parametrosCena.horasChegada);
  const naMesa = new Set(registradas);
  const pereciveis = [];
  for (const definicao of obterCartas()) {
    if (!definicao.estados || naMesa.has(definicao.id)) continue;
    const agora = resolverEstadoCarta(definicao, ipmDe);
    const depois = resolverEstadoCarta(definicao, ipmPara);
    if (agora !== depois) pereciveis.push(agora.textoDisplay || definicao.textoDisplay);
  }
  return {
    de: horasJogo,
    para: chegada,
    rigidez: RIGIDEZ_EM_PROSA[estadoRigorPorIpm(ipmPara)] || '',
    pereciveis,
  };
}
