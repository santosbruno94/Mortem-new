// =====================================================================
// VERDADE DE OURO do caso "A Hora Emprestada".
// Lida APENAS pelo motor de veredicto. Jamais exposta ao jogador.
//
// Convenção de tempo do jogo inteiro:
//   HORA ABSOLUTA = horas contadas a partir da meia-noite de 14/out/1893.
//   Valores negativos pertencem ao dia 13/out (ex.: -3 = 21h00 de 13/out).
//   A chegada do perito à cena ocorre na hora absoluta 11 (11h00 de 14/out).
//
// O caso, em uma linha: o primeiro-oficial Silas Crane, com doze anos de
// casa, vinha trocando ouro dos consertos por metal vil; descoberto na
// sexta, matou o mestre às 21h com o próprio buril e encenou um roubo
// alheio — o relógio da lareira, RECUADO para 08h45 e esmagado, é a
// hora emprestada que dá nome ao caso.
// =====================================================================

export const SEED_TUTORIAL = {
  id: 'a_hora_emprestada',
  vitima: 'Sr. Geoffrey Arthurs',
  reuCorreto: 'silas_crane',
  horasMorteAntesChegada: 14, // morte às 21h00 de 13/out; chegada às 11h00 de 14/out
  horaMorteAbsoluta: -3, // 21h00 de 13/out na escala absoluta (derivada: 11 - 14)
  mecanismoCorreto: 'ferida_arma_branca',
  instrumentoCorreto: 'buril_gravador',
  motivacaoCorreta: 'silenciamento',
  cenaEncenada: true,
  horaForjada: 8.75, // o relógio esmagado aponta 08h45 de 14/out
  perifericos: {
    walter_arthurs: { veredictoEsperado: 'inocente_segredo', segredo: 'suplica_recusada' },
    agnes_rooke: { veredictoEsperado: 'inocente_segredo', segredo: 'noivado_secreto' },
    caleb_grey: { veredictoEsperado: 'inocente_alibi', segredo: null },
    davey_tull: { veredictoEsperado: 'inocente_alibi', segredo: null },
  },
};

// ---------------------------------------------------------------------
// Suspeitos do caso (camada narrativa; o motor só usa os ids)
// ---------------------------------------------------------------------
export const SUSPEITOS = [
  {
    id: 'silas_crane',
    nome: 'Silas Crane',
    idade: 47,
    relacao: 'Primeiro-oficial da relojoaria há doze anos; achou o corpo',
    descricao:
      'Mãos quietas, avental de couro, fala mansa de bancada. Oferece teoria sobre o ladrão a quem não pediu nenhuma.',
  },
  {
    id: 'walter_arthurs',
    nome: 'Walter Arthurs',
    idade: 44,
    relacao: 'Sobrinho e único herdeiro; negociante de Moorford',
    descricao:
      'Colarinho de negociante e botas gastas. Explica-se antes de acusado e cita credores pelo nome, como quem confere uma lista.',
  },
  {
    id: 'agnes_rooke',
    nome: 'Sra. Agnes Rooke',
    idade: 58,
    relacao: 'Viúva, dona da papelaria da High Street',
    descricao:
      'Meio-luto rigoroso, broche de azeviche. Responde o que se pergunta, nem uma palavra além, e mede o visitante por cima dos óculos.',
  },
  {
    id: 'caleb_grey',
    nome: 'Caleb Grey',
    idade: 46,
    relacao: 'Moleiro; na sexta-feira, devolveu à loja um conserto com queixa formal',
    descricao:
      'Pó de farinha nas costuras e a queixa na ponta da língua. Repete a soma do prejuízo sem errar um xelim.',
  },
  {
    id: 'davey_tull',
    nome: 'Davey Tull',
    idade: 15,
    relacao: 'Aprendiz da relojoaria há dois anos',
    descricao:
      'Magro, atento, o olho no que as mãos dos outros fazem. Responde depressa; perguntado de novo, não muda uma palavra.',
  },
];

export function obterSuspeito(id) {
  return SUSPEITOS.find((s) => s.id === id) || null;
}
