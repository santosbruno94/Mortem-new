// =====================================================================
// ECOS DO MESTRE SOBRE A FALHA (FASE 6) — camada de PROSA, dado puro.
//
// A voz aqui é a do Dr. Alcott na cabeça de Harlan: o mestre que não está
// presente na cena, mas cujo ensino ecoa quando o aprendiz erra. A seleção
// (qual código, qual variante) é determinística e vive em src/logic/ecoMestre.js;
// aqui moram SÓ as palavras.
//
// Campo OPCIONAL do pacote de caso (`ecosDoMestre`): ausente, não há mestre e
// não há eco (modo procedural, coerente com §13). O motor jamais o lê.
//
// LIMITE INVIOLÁVEL (guia de estilo §2.4): leitura TÉCNICA e de MÉTODO, nunca
// pista, autoria ou encenação. A fala aponta ATENÇÃO ("a janela que o senhor
// firmou brigou com as próprias cartas"), nunca conclusão. Em erro_judiciário
// a fala JAMAIS nomeia nem sugere o culpado. Registro do mestre: oral, curto,
// de professor a aprendiz; trata o perito por "o senhor"; pensa em faixas de
// hora e em ordens (primeiro isto, depois aquilo). Ver docs/biblia-de-vozes.md.
//
// Cada código mapeia a um método que falhou; a fala devolve o olhar ao ponto,
// não a resposta.
// =====================================================================

export const ECOS_MESTRE_TUTORIAL = {
  titulo: 'A voz do mestre',
  porCodigo: {
    // Quando — hora não afirmada, ou afirmada sem carta que a prenda.
    sem_janela: [
      'O senhor levou o caso a julgamento sem tirar do corpo a hora da morte. O corpo tinha o que dizer sobre isso, e ficou por ouvir.',
      'Faltou firmar a janela. Antes do nome e do meio, vem o quando — e o quando o senhor não prendeu a sinal nenhum.',
    ],
    // Quando — a janela firmada não abarca a hora que o corpo aponta.
    janela_nao_cobre: [
      'A janela que o senhor firmou não abarca a hora que o corpo aponta. Uma das duas está fora do lugar.',
      'O senhor cravou uma faixa de horas anterior à morte. A conta do corpo fica de fora dela.',
    ],
    // Quando — janela afirmada sem carta que a amarre.
    janela_sem_sustentacao: [
      'O senhor firmou a janela e não a prendeu a carta alguma. Falta o sinal do corpo que a sustente.',
      'A janela está lá, solta. Nenhuma carta do corpo a segura por baixo.',
    ],
    // Quando — janela larga demais (o corpo permite apertá-la).
    janela_imprecisa: [
      'A janela é larga demais. O corpo consente que o senhor a aperte; volte aos sinais e feche a faixa.',
      'O senhor deixou horas de sobra dos dois lados. Com o que o corpo guarda, dá para estreitar a conta.',
    ],
    // Presença — o réu não foi posto na cena.
    sem_nexo: [
      'O senhor levou o acusado ao banco sem o pôr na cena. A cadeia abre um vão justo aí, entre o nome e o lugar.',
      'Falta a presença. Ter o nome não é tê-lo no sítio à hora certa; esse elo ficou por atar.',
    ],
    // Presença — o vínculo firmado não põe o réu no lugar.
    nexo_errado: [
      'O vínculo que o senhor firmou não põe o réu na cena. O que ligou aponta para outro lado que não o lugar do crime.',
      'A ligação da presença não pegou. O que o senhor amarrou ali não é o que põe o acusado no sítio.',
    ],
    // Presença — juntou-se vestígio que não é do instrumento (gafe).
    nexo_acessorio: [
      'À presença o senhor juntou um vestígio que não é do meio da morte. Repare no que de fato o põe na cena, e separe o resto.',
      'Um dos cabos que o senhor atou à presença é de outra história. Guarde para a presença só o que a sustenta.',
    ],
    // Encenação — há uma leitura física que não fecha, e o perito não a apontou.
    sem_descuidos: [
      'Há na cena uma leitura que não fecha com as outras. O senhor passou por ela sem a marcar.',
      'Dois sinais aqui contam horas diferentes. Onde as contas não batem, volte e confira antes de seguir.',
    ],
    // Réu — o corpo não sustenta o homem levado ao banco (nunca nomeia ninguém).
    reu_errado: [
      'O corpo não acusa o homem que o senhor levou ao banco. A leitura física e o nome que o senhor firmou não se encontram.',
      'O senhor fechou uma cadeia inteira sobre um nome que os sinais do corpo não amparam. Torne a conferir se a leitura ampara o nome que firmou.',
    ],
  },
};
