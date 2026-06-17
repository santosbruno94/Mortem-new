// =====================================================================
// CURRÍCULO DE HÁBITOS DO MESTRE — o contrato de currículo.
//
// Este arquivo é DADO PURO. Ele lista, em ordem, os HÁBITOS que o mestre
// ensina ao aprendiz ao longo da campanha. O mestre não ensina FATOS
// forenses (não despeja tabelas); ensina VERBOS e HÁBITOS de investigação
// e a reconhecer SIGNIFICÂNCIA (o que importa e o que é ruído).
//
// CONTRATO DE CURRÍCULO (crítico):
//   O gerador procedural só pode usar tipos de pista / padrões forenses
//   que um hábito desta lista já tenha ensinado. O campo
//   `desbloqueiaVocabulario` diz exatamente quais domínios/sub-domínios de
//   tag (ver src/data/cartas.js e src/data/catalogo_causas.js) cada hábito
//   libera para o gerador. A morte do mestre é o checkpoint: tudo que o
//   gerador um dia usará precisa ter sido ensinado ANTES dela.
//
// A lógica que consome isto (o ensino socrático na campanha; a restrição
// do gerador) entra na Fase 6 — aqui só declaramos o currículo aprovado.
// =====================================================================

export const HABITOS = [
  {
    id: 'maos_e_chao',
    ordem: 1,
    licao: 'Cheque as mãos e o chão sob o corpo.',
    ensina: 'Procurar vestígios onde o olho preguiçoso não olha.',
    // Libera o domínio dos vestígios (fibras, fios, marcas).
    desbloqueiaVocabulario: { dominio: 'vestigio', subDominios: ['fibra_tecido'] },
  },
  {
    id: 'convergencia_do_tempo',
    ordem: 2,
    licao: 'Leia o tempo por convergência, não por um sinal só.',
    ensina: 'Triangular a hora da morte cruzando vários indicadores; um sozinho mente.',
    // Libera todo o vocabulário temporal: o que apura a janela da morte.
    desbloqueiaVocabulario: {
      dominio: 'temporal',
      subDominios: ['livor_mortis', 'rigor_mortis', 'algor_mortis', 'visto_por_ultimo'],
    },
  },
  {
    id: 'familia_e_assinatura',
    ordem: 3,
    licao: 'Separe o sinal de família do sinal de assinatura.',
    ensina: 'A família aponta o gênero (petéquias → asfixia); a assinatura crava a espécie (sulco horizontal → ligadura).',
    // Libera o vocabulário causal: causa e instrumento da morte.
    desbloqueiaVocabulario: {
      dominio: 'causal',
      subDominios: ['asfixia', 'sulco_cervical', 'instrumento'],
    },
  },
  {
    id: 'desconfie_da_cena_arrumada',
    ordem: 4,
    licao: 'Desconfie da cena arrumada.',
    ensina: 'Reconhecer encenação: o relógio quebrado na hora certa, o roubo que poupa os valores, a fechadura forçada por dentro do enredo.',
    // Libera o vocabulário ambiental: os descuidos de quem encenou.
    desbloqueiaVocabulario: {
      dominio: 'ambiental',
      subDominios: ['cronologia_aparente', 'desordem', 'arrombamento'],
    },
  },
  {
    id: 'cruze_a_fala_com_o_corpo',
    ordem: 5,
    licao: 'Cruze o que dizem com o que o corpo diz.',
    ensina: 'O Confronto: ligar um depoimento ao fato físico que o derruba. É aqui que se crava a mentira.',
    // Libera o vocabulário comportamental: álibis e avistamentos que o
    // corpo pode contradizer.
    desbloqueiaVocabulario: {
      dominio: 'comportamental',
      subDominios: ['alibi', 'avistamento'],
    },
  },
  {
    id: 'significancia',
    ordem: 6,
    licao: 'Significância: o chá frio dá a hora; o papel de parede não.',
    ensina: 'Filtrar o sinal do ruído. A maioria dos fatos é decoração ou isca; a perícia é saber os poucos que importam.',
    // Meta-hábito: não libera um domínio novo, mas ensina a lidar com as
    // iscas (tag `isca: true`) que o gerador espalha como ruído.
    desbloqueiaVocabulario: { meta: 'ruido', conceito: 'isca' },
  },
];

export function obterHabito(id) {
  return HABITOS.find((h) => h.id === id) || null;
}
