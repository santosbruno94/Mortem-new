// =====================================================================
// PAPÉIS DRAMÁTICOS — a taxonomia de casting do gerador (FASE 5).
//
// Este arquivo é DADO PURO e GERADOR-FACING. Formaliza como DADO o que o §14
// do MORTEM_CONTEXTO.md já nomeia como "armadilhas pedagógicas": os papéis
// que o futuro gerador procedural escalará ao montar um caso. É o esqueleto
// do gerador — não o gerador (que não existe nesta fase).
//
// REGRA INVIOLÁVEL: o MOTOR de veredicto (src/logic/veredicto.js) e de
// acusação (src/logic/acusacao.js) JAMAIS lê este arquivo. Papel dramático é
// metadado de CONSTRUÇÃO de caso; o veredicto lê só tagsOcultas + a Verdade
// de Ouro. A guarda do qa.mjs vigia essa separação, como faz com aparências.
//
// Resposta ao problema "mad-libs" (design): motivos e mentiras de inocente
// são MÓDULOS AUTORAIS (prosa curada, escrita à mão pelo método de
// docs/kb-craft-narrativo/). O gerador não INVENTA drama — ele ESCALA módulos
// prontos nos papéis, respeitando o currículo de hábitos (src/data/curriculo.js).
//
// ---------------------------------------------------------------------
// SCHEMA DE UM PAPEL:
//   funcaoDramatica     : string. O que o papel FAZ no caso (descritor de
//                         design; NUNCA exibido ao jogador).
//   tipoMentira         : 'fisica' | 'moral' | null.
//                           fisica → mente contra o corpo/os fatos (só o
//                                    culpado real precisa disto).
//                           moral  → mente por vergonha/decoro/medo, não
//                                    contra a física do crime (o inocente).
//                           null   → não mente (ruído honesto; a fonte).
//   habitosPressupostos : [id de curriculo.js]. Hábitos que o papel exige já
//                         ENSINADOS antes de o gerador poder escalá-lo.
//   modulosMinimos      : objeto de flags declarativas — os módulos autorais
//                         que o papel exige do caso para funcionar. (Semântica
//                         de cada flag no comentário ao lado.)
// =====================================================================

export const PAPEIS = {
  // O culpado. Mata e ENCENA outra história sobre a cena (a "solução A" falsa).
  // Único papel que mente contra a FÍSICA — e o único que o nexo material crava.
  assassino_encenador: {
    funcaoDramatica:
      'O culpado. Comete o crime e encena uma segunda história sobre a cena (hora forjada, roubo simulado) para desviar a leitura. Só se crava pela materialidade: janela, causa e o instrumento com a assinatura dele.',
    tipoMentira: 'fisica',
    habitosPressupostos: [
      'convergencia_do_tempo',
      'familia_e_assinatura',
      'desconfie_da_cena_arrumada',
      'cruze_a_fala_com_o_corpo',
    ],
    modulosMinimos: {
      alibiRefutavel: true, // paradeiro que o corpo/registro derruba
      encenacao: true, // uma cena forjada (isca temporal + ambiental)
      nexoFisico: true, // vestígio-assinatura que o liga ao instrumento do óbito
      segredoDuasRotas: false,
    },
  },

  // A isca do Apressado: móbil forte e barulhento + mentira que quebra fácil.
  // "Mentiu, logo matou" → Erro Judiciário. O descarte que o inocenta está na
  // MESMA fonte que o incrimina — a lição é ler a página inteira.
  isca_do_apressado: {
    funcaoDramatica:
      'O falso óbvio. Motivo forte e visível (herança, dívida) e uma mentira de paradeiro que quebra ao primeiro cruzamento. Convida à condenação precoce; a prova que o descarta mora na mesma fonte que o incrimina.',
    tipoMentira: 'moral',
    habitosPressupostos: ['cruze_a_fala_com_o_corpo', 'significancia'],
    modulosMinimos: {
      mobilForte: true, // motivo público e barulhento
      alibiRefutavel: true, // mentira de paradeiro quebrável
      descarteNaMesmaFonte: true, // o álibi verdadeiro está na mesma fonte da isca
      segredoDuasRotas: false,
    },
  },

  // O véu: a última pessoa com a vítima com vida. Mente por DECORO, não por
  // sangue; o segredo, descoberto por duas rotas, explica a mentira sem culpa.
  veu: {
    funcaoDramatica:
      'A última pessoa com a vítima viva. Mente sobre o próprio paradeiro por decoro — não por culpa. Um segredo (descobrível por duas rotas independentes) explica a mentira e a inocenta.',
    tipoMentira: 'moral',
    habitosPressupostos: ['cruze_a_fala_com_o_corpo', 'significancia'],
    modulosMinimos: {
      ultimaComVitima: true, // avistamento que a coloca por último com a vítima
      alibiRefutavel: true, // paradeiro falso por decoro
      segredoDuasRotas: true, // segredo com duas rotas de descoberta
    },
  },

  // O ruído que é pista dupla: o rancor mais barulhento do caso que, lido de
  // perto, CODIFICA o móbil de outro. Álibi corroborado por terceiros — sem
  // oportunidade. Motivo público sem janela.
  ruido_pista_dupla: {
    funcaoDramatica:
      'O rancor mais barulhento do caso — e, lido de perto, o registro do móbil de OUTRO. Motivo público sem oportunidade: álibi corroborado por terceiros. Ensina a separar o barulho do sinal.',
    tipoMentira: null,
    habitosPressupostos: ['significancia'],
    modulosMinimos: {
      rancorPublico: true, // queixa/hostilidade aberta e registrada
      alibiCorroborado: true, // paradeiro confirmado por terceiros (sem oportunidade)
      codificaMobilDeOutro: true, // o mesmo fato, lido de perto, aponta o culpado
    },
  },

  // O mentiroso por medo: mente ENSAIADO por outro (o culpado), não por culpa.
  // Álibi verdadeiro; expô-lo é bônus, nunca pilar.
  mentiroso_por_medo: {
    funcaoDramatica:
      'Mente ensaiado por outro — por medo, não por culpa. Repete a mesma resposta na mesma ordem (o ensaio se denuncia). Álibi verdadeiro; expô-lo é bônus pedagógico, nunca pilar da acusação.',
    tipoMentira: 'moral',
    habitosPressupostos: ['cruze_a_fala_com_o_corpo'],
    modulosMinimos: {
      alibiCorroborado: true, // paradeiro verdadeiro (em casa, com testemunha)
      mentiraEnsaiada: true, // a mesma fala repetida sem variação (o ensaio)
    },
  },

  // OS-S1 — O BODE EXPIATÓRIO. Móbil e acesso reais, e o inquérito prende-o
  // primeiro por ser de fora. Mente sobre o paradeiro por causa do que fez NA
  // CENA (e não do crime); o segredo que o explica é o objeto que ele recolheu.
  // Distingue-se do `veu` por não ter estado com a vítima viva, e da
  // `isca_do_apressado` por ser o inquérito, e não o jogador, quem o elege.
  bode_expiatorio: {
    funcaoDramatica:
      'O forasteiro que o inquérito prende primeiro. Móbil e acesso verdadeiros, e uma passagem pela cena que ele esconde por medo. A mentira de paradeiro cai pelo próprio rastro, e o rastro é o que o inocenta: revela o que ele foi buscar, não o que ele fez.',
    tipoMentira: 'moral',
    habitosPressupostos: ['cruze_a_fala_com_o_corpo', 'significancia', 'convergencia_do_tempo'],
    modulosMinimos: {
      mobilForte: true, // dívida registrada e penhor tomado
      alibiRefutavel: true, // a estrada que ele jura, contra o rastro na sala
      // ROTA ÚNICA, e é desenho, não falta: o mesmo rastro que lhe derruba o
      // paradeiro é o que revela o que ele foi buscar. Não vira armadilha
      // porque quem quebra o álibi recebe o segredo no mesmo gesto — ao
      // contrário do véu e da isca, que têm duas rotas cada.
      segredoDuasRotas: false,
      presoPeloInquerito: true, // a prisão é ato da fonte, não conclusão do jogador
    },
  },

  // A fonte: não é suspeito. Planta a história A (a falsa solução que o
  // briefing defende) e as iscas. O aparato legal-policial de 1893 fala por ela.
  fonte: {
    funcaoDramatica:
      'Não é suspeito. Apresenta o caso e, sem má-fé, planta a "solução A" (a leitura falsa da cena encenada) e as iscas. É a boca do aparato policial — enquadra o caso que o perito terá de desmontar.',
    tipoMentira: null,
    habitosPressupostos: [],
    modulosMinimos: {
      plantaHistoriaFalsa: true, // enuncia a leitura errada da cena encenada
      plantaIscas: true, // aponta os falsos óbvios (móbeis barulhentos)
    },
  },
};

// ---------------------------------------------------------------------
// ELENCO DO CASO-ESCOLA "A Hora Emprestada": o casting anotado (§14). É a
// camada de METADADO do gerador — um mapa de id de entidade → id de papel.
// O motor não o lê; serve à documentação, à guarda do qa.mjs e, no futuro,
// à validação do pacote emitido pelo gerador.
// ---------------------------------------------------------------------
export const ELENCO_TUTORIAL = {
  silas_crane: 'assassino_encenador',
  walter_arthurs: 'isca_do_apressado',
  agnes_rooke: 'veu',
  caleb_grey: 'ruido_pista_dupla',
  davey_tull: 'mentiroso_por_medo',
  nathan_herrick: 'bode_expiatorio',
  delegado_wycliffe: 'fonte',
};

export function obterPapel(id) {
  return PAPEIS[id] || null;
}
