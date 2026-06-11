// =====================================================================
// VERDADE DE OURO do caso tutorial "O Álibi de Corda".
// Lida APENAS pelo motor de veredicto. Jamais exposta ao jogador.
//
// Convenção de tempo do jogo inteiro:
//   HORA ABSOLUTA = horas contadas a partir da meia-noite de 14/out/1893.
//   Valores negativos pertencem ao dia 13/out (ex.: -2 = 22h00 de 13/out).
//   A chegada do perito à cena ocorre na hora absoluta 11 (11h00 de 14/out).
// =====================================================================

export const SEED_TUTORIAL = {
  id: 'o_alibi_de_corda',
  vitima: 'Sr. Geoffrey Arthurs',
  reuCorreto: 'edgar_arthurs',
  horasMorteAntesChegada: 13, // morte às 22h00 de 13/out; chegada às 11h00 de 14/out
  horaMorteAbsoluta: -2, // 22h00 de 13/out na escala absoluta (derivada: 11 - 13)
  mecanismoCorreto: 'estrangulamento_ligadura',
  instrumentoCorreto: 'fibra_canhamo',
  motivacaoCorreta: 'heranca',
  cenaEncenada: true,
  horaForjada: 9, // o relógio esmagado aponta 09h00 de 14/out
  perifericos: {
    thomas_blackwood: { veredictoEsperado: 'inocente_alibi', segredo: null },
    sra_hudson: { veredictoEsperado: 'inocente_segredo', segredo: 'mentira_alibi' },
  },
};

// ---------------------------------------------------------------------
// Suspeitos do caso (camada narrativa; o motor só usa os ids)
// ---------------------------------------------------------------------
export const SUSPEITOS = [
  {
    id: 'edgar_arthurs',
    nome: 'Edgar Arthurs',
    idade: 38,
    relacao: 'Sobrinho e único herdeiro da vítima',
    descricao:
      'Polido, cooperativo, de luto impecável. Atende a cada pergunta antes que ela termine de ser feita.',
  },
  {
    id: 'sra_hudson',
    nome: 'Sra. Mabel Hudson',
    idade: 55,
    relacao: 'Governanta da casa há dezessete anos',
    descricao:
      'Mãos que não param quietas. Responde curto, olha para a porta, pede licença duas vezes por frase.',
  },
  {
    id: 'thomas_blackwood',
    nome: 'Thomas Blackwood',
    idade: 42,
    relacao: 'Taverneiro do The Crossed Keys; desafeto público da vítima',
    descricao:
      'Não finge pesar. Devia dinheiro ao morto e diz, sem que ninguém pergunte, que não chora por ele.',
  },
];

export function obterSuspeito(id) {
  return SUSPEITOS.find((s) => s.id === id) || null;
}
