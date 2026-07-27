// =====================================================================
// AS TRÊS INTERFERÊNCIAS DO CASO-ESCOLA (OS-S1 · Frente B).
//
// Até aqui o caso-escola era o único sem interferência: o oficial matava na
// sexta e ficava parado o resto do inquérito. Passa a agir, em três degraus,
// e todos eles obedecem às Regras de Justiça já escritas
// (docs/game-design-simulacao.md §5):
//
//   R1 — o improviso é MAIS GROSSEIRO que o crime original. O crime de sexta
//        deixou uma lasca de vidro numa bainha; o esconderijo violado deixa
//        quatro apoios na poeira e sebo que a poeira não pegou, e a cela
//        deixa dois sulcos e três dedadas de cera.
//   R2 — SALDO ≥ 0. Nenhuma carta destruída é pilar da acusação: a janela
//        fecha pelo corpo, a causa pelo corpo, o nexo pelo estojo, e o móbil
//        tem redundância tripla (ev_livro_ordens, ev_livro_ii, corrob_pettigrew).
//   R3 — o GATILHO é sempre ação OBSERVÁVEL do jogador: pôr o pé numa loja
//        que é também o correio da vila, ou pousar um papel diante de um
//        homem. A vila comenta; o oficial ouve.
//   R4 — quem chega primeiro não perde a peça. `evitada` quando o alvo já
//        está no caderno, e é assim que a G4 fica satisfeita: papel lavrado
//        não morre com a boca que o ditou.
//
// NENHUM `anuncio` NOMEIA NINGUÉM. O diário regista EFEITOS; a autoria é
// leitura do jogador, reconstruível de trás para frente. É a mesma disciplina
// do catálogo de intervenções da noite (src/data/intervencoes.js), aplicada
// ao que se move enquanto o perito vai e vem.
//
// O motor de veredicto jamais lê este arquivo (guarda no qa.mjs). O runtime
// não decide nada: verifica o gatilho e anota; os gates de `extrairCarta`
// aplicam o efeito.
// =====================================================================

export const INTERFERENCIAS_TUTORIAL = {
  eventos: [
    {
      // DEGRAU 1 — COAGIR. A retratação da Sra. Wick estava escrita dentro da
      // carta desde a OS-R4 («procurada outra vez ao meio-dia, disse não ter
      // visto nada»); aqui ela sai de dentro do papel e vira acontecimento.
      //
      // A moeda da coação é o que o livro sabe (PD-14): a linha "—W.", antiga
      // e riscada, está na folha que o perito pode ler antes de a perder.
      //
      // A DUPLA APOSTA: perder a Sra. Wick é perder quem DATA a saída de
      // Agnes da viela. A interferência feita pela hora cobra o preço em cima
      // da suspeita mais dolorosa do caso.
      id: 'coacao_wick',
      tipo: 'intimidar_testemunha',
      gatilho: {
        tipo: 'visita_local',
        noId: 'papelaria',
        comoSoube:
          'a loja da Sra. Rooke é também o correio da High Street; o que ali se pergunta corre a vila antes do fim da tarde',
      },
      efeito: { cartaDestruida: 'dep_mulher_viela', cartasNovas: ['dep_retratacao_wick'] },
      anuncio: 'Uma testemunha que já tinha falado mandou dizer ao posto que se enganara.',
    },
    {
      // DEGRAU 2 — DESTRUIR. O prenúncio já está plantado: a cifra sai do
      // corpo, no mesmo prédio em que o oficial recebe o perito, e a
      // alfinetada dele em E2 diz de viva voz que sabe o que se anda a
      // perguntar pela vila.
      //
      // O gatilho é o confronto: pousar um papel diante dele é o gesto mais
      // visível que o inquérito tem. Quem subiu à torre antes de confrontar
      // guarda o caderno de pesos; quem confrontou primeiro acha o vão aberto.
      id: 'corrida_a_torre',
      tipo: 'destruir_evidencia',
      gatilho: {
        tipo: 'prova_apresentada',
        suspeitoId: 'silas_crane',
        comoSoube: 'o papel pousado na saleta diz ao interrogado exatamente até onde a perícia já chegou',
      },
      efeito: { cartaDestruida: 'ev_livro_ii', cartasNovas: ['ev_esconderijo_vazio'] },
      anuncio: 'O adro de S. Miguel amanheceu destrancado, e a escada da torre tem barro fresco.',
    },
    {
      // DEGRAU 3 — SILENCIAR. Vivo, o recoveiro é a ruína da manhã: a porta
      // já estava forçada às cinco menos um quarto. Morto daquele jeito, é a
      // confissão que fecha o inquérito num forasteiro.
      //
      // Não se mata para esconder: mata-se para assinar o crime com o nome de
      // outro. É a segunda hora emprestada, agora a um morto.
      //
      // G4 — o termo PERSISTE. Quem tomou a deposição antes de o confrontar
      // guarda o papel, e o papel depõe sozinho no segundo inquérito.
      id: 'silenciar_herrick',
      tipo: 'silenciar',
      gatilho: {
        tipo: 'prova_apresentada',
        suspeitoId: 'nathan_herrick',
        comoSoube:
          'o corredor da cela é o mesmo do posto, e quem tem entrada franca nele ouve o que se pousa na tábua',
      },
      efeito: {
        cartaDestruida: 'dep_cela_herrick',
        cartasNovas: ['dep_achado_cela', 'ev_cera_tarimba'],
      },
      anuncio: 'O posto mandou chamar o legista para os fundos, e fechou o corredor da cela.',
    },
  ],
};

// =====================================================================
// OS ECOS DO CASO-ESCOLA — a nota que o perito faz na Caderneta, pós-caso,
// sobre o que se moveu enquanto ele ia e vinha.
//
// O caso-escola tem legista, e por isso os ecos genéricos do procedural
// (src/data/ecos_interferencia.js) não servem aqui: aqueles são do perito
// sozinho, num caso sem mestre. Estes são deste caso, desta vila e destes
// três degraus, e continuam presos ao limite do guia §2.4 — reconhecem o
// FATO da interferência e devolvem o olhar ao método, sem nomear ator nem
// concluir autoria.
// =====================================================================
export const ECOS_INTERFERENCIA_TUTORIAL = {
  titulo: 'O que se moveu enquanto eu ia e vinha',
  porChave: {
    intimidar_testemunha_ocorrida: [
      'A vizinha dos fundos do nº 9 desdisse-se entre a minha primeira volta e a segunda. Fica-me a data em que ela mudou de história.',
      'Perdi a única boca que datava uma saída pela viela. Ficam a folha antiga, a folha nova e o dia que corre entre as duas; e fica a linha "—W." no livro do credor, riscada muito antes disto.',
      'A retratação veio no dia seguinte à minha volta ao correio. Não a discuto de ouvido: ponho a primeira folha ao lado da segunda e leio as duas.',
    ],
    intimidar_testemunha_evitada: [
      'Foram calar a vizinha dos fundos, e o que ela sabia já estava lavrado no meu caderno.',
      'A janela do nº 9 fechou-se depois da folha assinada. Recolho primeiro o que pode recuar, e só depois o que fica no lugar.',
      'A retratação entrou no processo ao lado do primeiro relato, e não por cima dele.',
    ],
    destruir_evidencia_ocorrida: [
      'A câmara dos sinos foi visitada entre a minha pergunta e a minha subida. Sobrou o vão aberto: o sebo que a poeira não pegou, os riscos claros na trava, quatro apoios nas vigas.',
      'O que estava atrás daquela chapa saiu de lá antes de mim. Quem subiu ao quarto cabeçote deixou na poeira mais do que a noite de sexta deixou na sala.',
      'Cheguei tarde ao quarto cabeçote. A peça que se perdeu não volta; a subida que a levou ficou marcada de quatro apoios, e esses eu meço.',
    ],
    destruir_evidencia_evitada: [
      'Subiram à torre por causa do que eu perguntei, e o oleado já estava na minha mala.',
      'A chapa do quarto cabeçote foi aberta depois de mim. O que ela guardava consta do meu registro, com hora.',
      'Foram buscar o que eu já tinha. Fica a lição, e ela é de ordem: o que se esconde alto recolhe-se antes de se falar baixo na saleta.',
    ],
    silenciar_ocorrida: [
      'Perdi o preso antes do segundo termo. O corpo dele é morte de horas, não de dias, e os sinais frescos ainda apertam essa hora.',
      'Onde esperava uma voz achei um homem pendurado, e dois sulcos onde devia haver um.',
      'A testemunha faltou ao segundo inquérito. Tomo do que sobrou: a ordem dos sulcos, a margem viva de um e a margem morta do outro, e a cera de bancada numa cela que não tem nenhuma.',
    ],
    silenciar_evitada: [
      'O preso morreu com a deposição já lavrada.',
      'Cheguei primeiro à tábua da cela. O que ele me contou da madrugada de sábado sobreviveu a ele, e é isso que o coroner há de ler.',
      'Faltou-me o homem e ficou-me o termo. Fica o método com ele: tomar a fala antes de a pôr à prova.',
    ],
  },
};
