// =====================================================================
// Gaveta Nexo — o pilar "Presença".
// Entrada: 1 carta de vestígio + 1 Conclusão já registrada.
// Liga uma pessoa ao instrumento/circunstância do óbito.
// Funções puras: leem SOMENTE tagsOcultas das cartas e das conclusões.
// =====================================================================

import { SUSPEITOS } from '../data/seed.js';

// Hipóteses tese-primeiro: uma por suspeito + a hipótese de vestígio
// alheio ao crime. (Os rótulos vêm do catálogo narrativo; a validação,
// só das tags.)
export const HIPOTESES_NEXO = [
  ...SUSPEITOS.map((s) => ({
    id: `liga_${s.id}`,
    suspeitoId: s.id,
    rotulo: `O vestígio liga ${s.nome} ao instrumento do óbito.`,
  })),
  {
    id: 'alheio',
    suspeitoId: null,
    rotulo: 'O vestígio é estranho ao mecanismo do óbito.',
  },
];

export function validarHipoteseNexo(hipotese, vestigio, conclusao) {
  if (!vestigio || vestigio.tagsOcultas.dominio !== 'vestigio') {
    return { consistente: false, motivo: 'É preciso inserir uma carta de vestígio.' };
  }
  if (!conclusao) {
    return { consistente: false, motivo: 'É preciso apoiar o vestígio numa conclusão registrada.' };
  }

  const tagsV = vestigio.tagsOcultas;
  const tagsC = conclusao.tagsOcultas;
  const instrumentoConhecido = tagsC.tipo === 'mecanismo' ? tagsC.instrumento : null;

  if (hipotese.id === 'alheio') {
    if (!instrumentoConhecido) {
      return {
        consistente: false,
        motivo: 'Sem instrumento identificado na conclusão, nada há a que o vestígio ser alheio.',
      };
    }
    if (tagsV.tipoVestigio === instrumentoConhecido) {
      return {
        consistente: false,
        motivo: 'O vestígio coincide com o instrumento do óbito — não é alheio a ele.',
      };
    }
    return {
      consistente: true,
      motivo: null,
      tipo: 'nexo_alheio',
      suspeitoId: tagsV.pertenceA || null,
    };
  }

  // Hipóteses que ligam um suspeito ao instrumento
  if (!instrumentoConhecido) {
    return {
      consistente: false,
      motivo: 'A conclusão apoiada não identifica instrumento algum.',
    };
  }
  if (tagsV.tipoVestigio !== instrumentoConhecido) {
    return {
      consistente: false,
      motivo: 'O vestígio inserido não corresponde ao instrumento do óbito.',
    };
  }
  if (tagsV.pertenceA !== hipotese.suspeitoId) {
    return {
      consistente: false,
      motivo: 'O vestígio inserido não foi colhido junto à pessoa declarada.',
    };
  }
  return {
    consistente: true,
    motivo: null,
    tipo: 'nexo',
    suspeitoId: hipotese.suspeitoId,
    instrumento: instrumentoConhecido,
  };
}
