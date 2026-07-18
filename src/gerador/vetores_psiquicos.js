// =====================================================================
// VETORES PSÍQUICOS — catálogo v1 e sorteio da camada íntima do elenco
// (OS docs/os-camada-psiquica-do-elenco.md; catálogo normativo em
// docs/kb-producao/sistemas-arquetipicos-alem-dos-12.md §7).
//
// Este módulo é DADO PURO e GERADOR-FACING: vive em src/gerador/ e o
// runtime JAMAIS o importa (guarda no qa.mjs, a mesma de arquetipos.js).
// É a SEGUNDA COLUNA do personagem — a matéria íntima (valor × medo ×
// sombra bipolar × auto-justificação), ortogonal ao arquétipo demográfico
// (arquetipos.js, a matéria social). O rótulo do vetor morre no log de
// build: o que sai daqui para o caso são CONSEQUÊNCIAS (flags de diálogo,
// tendências de vestígio, qualidade de encenação) — nunca o nome.
//
// REGRAS DE COMPILAÇÃO (OS psíquica §4.5; F3 da OS priors compostos §4,
// determinísticas, auditáveis):
//   • assassino → mente_com_calma ACOPLADA ao cenário (premeditado 2/6,
//     briga 1/6 — o ensaio dá a calma) OU mente_sob_pressao; sempre
//     gatilho_de_complexo com o tema do medo central do vetor dele.
//   • não-assassino de polaridade passiva → omite_por_decoro conforme a
//     classe (DECORO_POR_CLASSE — a respeitabilidade é performática por
//     degrau, não 50% plano).
//   • não-assassino de polaridade ativa → acusa_com_fervor em metade dos
//     sorteios (projeção: quem condena demais descreve a si).
//   • vetor de vínculo (zelador/amante/devoto) → defende_demais_o_morto
//     em metade dos sorteios.
//   • falso-destoante (a ISCA PLENA, só regime 2) → mente_sob_pressao +
//     gatilho_de_complexo: ele tem o que esconder — só que não é o crime.
//   • destoante nato que NÃO é a isca → só gatilho_de_complexo (textura:
//     quebra sob a pergunta certa e entrega biografia, não caso).
//   • inocente (não-isca) → mente_com_calma_periferica:<tema> em ~1/6 —
//     segredo refutável por matéria (dívida, ligação amorosa,
//     desonestidade miúda), jamais janela/causa/nexo: mata a precisão
//     100% do tell "mentira serena ⇒ réu".
//   • tendências de vestígio v1: o pool da matriz de encenação (OS §8.4)
//     aplicado ao assassino conforme o tipo de crime; a realização física
//     dos itens novos é OS própria (válvula do §7 da OS).
//
// DESENCAIXE E REGIMES (OS §8.3; F3 §4.2): magnitude derivada do degrau
// de afinidade vetor × demográfico (alta=0, media=1, rara=2). Moeda por
// caso (sal `|caso|regime-magnitude`): regime 2 (~70%) exige réu com
// magnitude ≥ T=2 e garante 1 falso-destoante (prioridade: coabitantes
// da vítima); regime 1 (~30%) põe o réu no degrau MODAL (magnitude 1),
// sem isca forçada — o caso é de circunstância, carregado pelo móbil
// material, e a destoância deixa de ser lei aprendível.
//
// DETERMINISMO: toda decisão sai de hashDecisao (hash_gerador.js — o
// hash decorrelacionado da OS priors compostos F2) sobre chave salgada
// no namespace `|psique|` (sais da OS §8.2: vet_/pol_/desenc_/flag_ por
// índice de personagem; rejeições com sufixo _r<k>).
// =====================================================================

import { hashDecisao } from './hash_gerador.js';

// TILT DE ATRIBUTO (OS priors compostos, F2 §3.2): por vetor,
// multiplicadores INTEIROS por banda de valor (formato de 5 posições,
// como os priors). O peso efetivo do valor i na amostragem composta é
// peso_arquetipo[i] × tilt_vetor[i] (amostragem.js).
//   N2: o tilt JAMAIS toca FOR — o corpo é do ofício, não da psique.
//   N3: todo multiplicador ≥ 1 — o tilt inclina, nunca proíbe.
// Três vetores sem tilt algum (devoto, errante, justiceiro) é desenho,
// não omissão: tilt é tempero raro, ou o composto vira estereótipo novo
// ("todo Erudito é INT 5"). Justificativas no dossiê F1 §2.3.
export const TILT_NEUTRO = [1, 1, 1, 1, 1];

// Degrau de afinidade → peso de sorteio e magnitude de desencaixe.
// A tabela AFINIDADE_DEMOGRAFICA codifica a 7.2: 'alta' = afinidade
// natural listada; 'rara' = encaixe raro-e-saboroso listado; tudo o mais
// é 'media'. Auditável linha a linha contra o doc.
export const DEGRAU_PESO = { alta: 4, media: 2, rara: 1 };
export const MAGNITUDE_POR_DEGRAU = { alta: 0, media: 1, rara: 2 };

// Limiar de desencaixe do assassino (e do falso-destoante), OS §8.3.
export const LIMIAR_DESENCAIXE = 2;

// Teto de reamostragem por rejeição (padrão do resolvedor de crime).
const MAX_TENTATIVAS = 24;

// Os 18 arquétipos demográficos, na ordem de arquetipos.js (para a
// completude verificada no qa.mjs). F4 da OS priors compostos: +4.
export const DEMOGRAFICOS = [
  'squire', 'paroco', 'medico', 'boticario', 'taverneiro', 'ferreiro', 'moleiro',
  'merceeiro', 'professora', 'costureira', 'lavadeira', 'lavrador', 'criada', 'constable',
  'carroceiro', 'guarda_caca', 'parteira', 'pastor_de_ovelhas',
];

// NOTA (F4, decisão 12): o campo afinidadePapeis foi REMOVIDO — era
// reserva documentada que o fluxo gerado nunca consumiu (o caso gerado
// não escala papéis nomeados); dado que envelhece sem uso é passivo de
// manutenção. Registro em docs/historico-decisoes.md.

// ---------------------------------------------------------------------
// O CATÁLOGO v2 — treze vetores (tabela 7.1 + emendas 7.4.1 e 7.5).
// Campos da OS §8.1 (menos afinidadePapeis — decisão 12). `afinidade
// Demografica` em degraus (7.2 + raros novos de F3 §4.1); `temaGatilho`
// é o tema do gatilho_de_complexo (o medo central como pergunta que
// desmonta a compostura). Proveniência por linha, regra do manifesto.
// ---------------------------------------------------------------------
export const VETORES_PSIQUICOS = {
  zelador: {
    id: 'zelador',
    valor: 'cuidar dos seus',
    medo: 'ser inútil, sobrar',
    sombraAtiva: 'mártir controlador; "veneno da misericórdia"',
    sombraPassiva: 'negligência ressentida ("ninguém cuida de mim")',
    autoJustificacao: 'foi um ato de amor',
    temaGatilho: 'inutilidade',
    // Portão psíquico (OS confronto estendido §4.4/§8.2): pesos de afinidade
    // de ação sob ataque, jamais regra dura. O cuidador clama por socorro.
    sobAtaque: { resistir: 0, fugir: 0, gritar: 1 }, // valor "cuidar dos seus": chama ajuda
    tiltAtributos: { INT: TILT_NEUTRO, WIS: [1, 1, 2, 2, 1], CHA: TILT_NEUTRO }, // o cuidado repara no miúdo (leve)
    afinidadeDemografica: {
      squire: 'media', paroco: 'alta', medico: 'alta', boticario: 'media',
      taverneiro: 'media', ferreiro: 'media', moleiro: 'media', merceeiro: 'rara',
      professora: 'alta', costureira: 'media', lavadeira: 'media', lavrador: 'alta',
      criada: 'alta', constable: 'media',
      carroceiro: 'media', guarda_caca: 'rara', parteira: 'alta', pastor_de_ovelhas: 'alta',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 1 e §7.2 (paroco/medico/professora/lavrador/criada; raro: merceeiro — a caderneta como coleira); papel: arquetipos-e-casting.md §4.1 (Cuidador)',
  },

  soberano: {
    id: 'soberano',
    valor: 'ordem, nome, patrimônio',
    medo: 'queda de status, escândalo',
    sombraAtiva: 'tirania; elimina a ameaça ao nome',
    sombraPassiva: 'fraqueza que terceiriza (manda, paga, finge não ver)',
    autoJustificacao: 'preservei a família',
    temaGatilho: 'queda_de_status',
    sobAtaque: { resistir: 1, fugir: 0, gritar: 0 }, // "ordem, nome": não foge — impõe-se
    tiltAtributos: { INT: TILT_NEUTRO, WIS: TILT_NEUTRO, CHA: [1, 1, 1, 2, 2] }, // a presença que manda
    afinidadeDemografica: {
      squire: 'alta', paroco: 'media', medico: 'rara', boticario: 'media',
      taverneiro: 'media', ferreiro: 'rara', moleiro: 'media', merceeiro: 'alta',
      professora: 'media', costureira: 'rara', lavadeira: 'media', lavrador: 'rara',
      criada: 'media', constable: 'rara',
      carroceiro: 'rara', guarda_caca: 'media', parteira: 'rara', pastor_de_ovelhas: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 2 e §7.2 (squire/merceeiro; raros: medico — reina pela receita — e lavrador — patriarca de cottage); OS priors compostos F3 §4.1/dossiê §2.7 (raros novos: ferreiro — a dinastia de ofício que a depressão nega; costureira — veste a gentry e decora cada gesto; constable — o uniforme sem mando)',
  },

  erudito: {
    id: 'erudito',
    valor: 'saber, exatidão',
    medo: 'errar em público, virar irrelevante',
    sombraAtiva: 'cálculo frio; o método perfeito',
    sombraPassiva: 'omissão pedante (sabia e calou)',
    autoJustificacao: 'era a solução racional',
    temaGatilho: 'erro_em_publico',
    sobAtaque: { resistir: 0, fugir: 1, gritar: 0 }, // "exatidão": calcula a saída
    tiltAtributos: { INT: [1, 1, 1, 2, 2], WIS: TILT_NEUTRO, CHA: TILT_NEUTRO }, // o exemplo da OS §3.2
    afinidadeDemografica: {
      squire: 'media', paroco: 'alta', medico: 'alta', boticario: 'alta',
      taverneiro: 'rara', ferreiro: 'rara', moleiro: 'rara', merceeiro: 'rara',
      professora: 'alta', costureira: 'rara', lavadeira: 'rara', lavrador: 'rara',
      criada: 'rara', constable: 'media',
      carroceiro: 'rara', guarda_caca: 'media', parteira: 'media', pastor_de_ovelhas: 'rara',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 3 e §7.2 (paroco/medico/boticario/professora; raros: ferreiro/moleiro — autodidata sem letras — e costureira/lavadeira — inteligência sem porta); OS priors compostos F3 §4.1/dossiê §2.7 (raros novos: taverneiro — lê de madrugada o que a vila bebe de dia; merceeiro — a caderneta como único livro; lavrador — o gênio sem letras da biblioteca da capela; criada — lê às escondidas os livros do patrão)',
  },

  devoto: {
    id: 'devoto',
    valor: 'pureza, fé, temperança',
    medo: 'contaminação moral; o próprio pecado exposto',
    sombraAtiva: 'inquisidor que pune o pecador',
    sombraPassiva: 'hipócrita que abafa o que sabe',
    autoJustificacao: 'cortei o mal pela raiz',
    temaGatilho: 'pecado_exposto',
    sobAtaque: { resistir: 1, fugir: 0, gritar: 0 }, // "pureza, fé": enfrenta o mal de pé
    tiltAtributos: { INT: TILT_NEUTRO, WIS: TILT_NEUTRO, CHA: TILT_NEUTRO }, // fé não é competência — sem tilt
    afinidadeDemografica: {
      squire: 'media', paroco: 'alta', medico: 'rara', boticario: 'media',
      taverneiro: 'rara', ferreiro: 'media', moleiro: 'media', merceeiro: 'media',
      professora: 'alta', costureira: 'media', lavadeira: 'rara', lavrador: 'media',
      criada: 'media', constable: 'media',
      carroceiro: 'media', guarda_caca: 'media', parteira: 'media', pastor_de_ovelhas: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 4 e §7.2 (paroco/professora; raro: taverneiro — herdou o pub que a capela manda odiar); desencaixe §7.3 (Devoto num taverneiro; motivo rivalidade_capela_taverna); tempero médium: §7.4.2; OS priors compostos F3 §4.1/dossiê §2.7 (raros novos: medico — ciência × fé, a batina que o bisturi calou; lavadeira — lava a nódoa alheia e professa pureza)',
  },

  artifice: {
    id: 'artifice',
    valor: 'a obra bem-feita, o ofício',
    medo: 'a obra arruinada; o ofício desbancado',
    sombraAtiva: 'obsessão que sacrifica pessoas à obra',
    sombraPassiva: 'rancor surdo do preterido',
    autoJustificacao: 'a obra vale mais que ele',
    temaGatilho: 'obra_arruinada',
    sobAtaque: { resistir: 1, fugir: 0, gritar: 0 }, // "o ofício": defende o que é seu
    tiltAtributos: { INT: TILT_NEUTRO, WIS: [1, 1, 2, 2, 1], CHA: TILT_NEUTRO }, // a mão que não erra (leve)
    afinidadeDemografica: {
      squire: 'media', paroco: 'media', medico: 'media', boticario: 'alta',
      taverneiro: 'media', ferreiro: 'alta', moleiro: 'alta', merceeiro: 'media',
      professora: 'media', costureira: 'alta', lavadeira: 'alta', lavrador: 'rara',
      criada: 'media', constable: 'media',
      carroceiro: 'media', guarda_caca: 'media', parteira: 'media', pastor_de_ovelhas: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 5 e §7.2 (boticario/ferreiro/moleiro/costureira/lavadeira); desencaixe §7.3 (Artífice num lavrador — o ofício sonhado atrás do balcão do outro)',
  },

  amante: {
    id: 'amante',
    valor: 'o vínculo, a paixão',
    medo: 'perda, traição, substituição',
    sombraAtiva: 'posse ciumenta ("de mais ninguém")',
    sombraPassiva: 'anulação dependente (aceita tudo — até demais)',
    autoJustificacao: 'se não podia ser meu…',
    temaGatilho: 'substituicao',
    sobAtaque: { resistir: 0, fugir: 0, gritar: 1 }, // "a paixão": o desespero que clama
    tiltAtributos: { INT: TILT_NEUTRO, WIS: TILT_NEUTRO, CHA: [1, 1, 2, 2, 1] }, // o charme do vínculo (leve)
    afinidadeDemografica: {
      squire: 'rara', paroco: 'rara', medico: 'media', boticario: 'media',
      taverneiro: 'media', ferreiro: 'media', moleiro: 'media', merceeiro: 'media',
      professora: 'rara', costureira: 'alta', lavadeira: 'media', lavrador: 'media',
      criada: 'alta', constable: 'media',
      carroceiro: 'media', guarda_caca: 'rara', parteira: 'media', pastor_de_ovelhas: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 6 (nota de nome: §7.4.3) e §7.2 (costureira/criada); desencaixe §7.3 (Amante numa esposa sem saída); papel veu: arquetipos-e-casting.md §4.1 (esconde o caso); OS priors compostos F3 §4.1/dossiê §2.7 (raros novos: squire — a paixão abaixo da classe; paroco — o coração que o púlpito não deixa; professora — casar é perder a escola, kb demografia §3)',
  },

  provador: {
    id: 'provador',
    valor: 'a respeitabilidade conquistada',
    medo: 'voltar a ser ninguém',
    sombraAtiva: 'ressentimento nivelador; cobra a humilhação antiga',
    sombraPassiva: 'servilismo rancoroso (curva-se e odeia)',
    autoJustificacao: 'eu nunca tive a chance dele',
    temaGatilho: 'voltar_a_ser_ninguem',
    sobAtaque: { resistir: 0, fugir: 1, gritar: 0 }, // "respeitabilidade": foge da exposição
    tiltAtributos: { INT: TILT_NEUTRO, WIS: TILT_NEUTRO, CHA: [1, 1, 2, 2, 1] }, // o polimento conquistado (leve)
    afinidadeDemografica: {
      squire: 'media', paroco: 'media', medico: 'media', boticario: 'rara',
      taverneiro: 'alta', ferreiro: 'media', moleiro: 'media', merceeiro: 'alta',
      professora: 'media', costureira: 'alta', lavadeira: 'alta', lavrador: 'media',
      criada: 'alta', constable: 'alta',
      carroceiro: 'media', guarda_caca: 'media', parteira: 'media', pastor_de_ovelhas: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 7 e §7.2 (taverneiro/merceeiro/costureira/lavadeira/criada/constable; raro: boticario — o balcão como degrau); papel isca: arquetipos-e-casting.md §4.1 (Órfão ressentido)',
  },

  errante: {
    id: 'errante',
    valor: 'horizonte, liberdade',
    medo: 'ficar preso (à vila, à dívida, ao casamento)',
    sombraAtiva: 'fuga por cima de vidas',
    sombraPassiva: 'paralisia amarga do que não partiu',
    autoJustificacao: 'eu não podia ficar',
    temaGatilho: 'ficar_preso',
    sobAtaque: { resistir: 0, fugir: 1, gritar: 0 }, // "liberdade": o fujão por excelência
    tiltAtributos: { INT: TILT_NEUTRO, WIS: TILT_NEUTRO, CHA: TILT_NEUTRO }, // horizonte não é atributo — sem tilt
    afinidadeDemografica: {
      squire: 'rara', paroco: 'media', medico: 'media', boticario: 'media',
      taverneiro: 'media', ferreiro: 'media', moleiro: 'rara', merceeiro: 'media',
      professora: 'rara', costureira: 'media', lavadeira: 'media', lavrador: 'alta',
      criada: 'media', constable: 'rara',
      carroceiro: 'alta', guarda_caca: 'media', parteira: 'media', pastor_de_ovelhas: 'alta',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 8 e §7.2 (lavrador; raros: squire — herdeiro que odeia a herança —, professora — instrução como bilhete de fuga — e constable — o uniforme como jaula); desencaixe §7.3 (Errante em lavrador/constable, êxodo rural); OS priors compostos F3 §4.1/dossiê §2.7 (raro novo: moleiro — herdou o moinho que o prende, e o moinho a vapor o mata devagar, kb demografia §3)',
  },

  justiceiro: {
    id: 'justiceiro',
    valor: 'honra, a conta certa',
    medo: 'afronta impune; passar por covarde',
    sombraAtiva: 'violência de honra; pena capital privada',
    sombraPassiva: 'submissão que acumula e explode',
    autoJustificacao: 'foi uma luta justa',
    temaGatilho: 'afronta_impune',
    sobAtaque: { resistir: 1, fugir: 0, gritar: 0 }, // "honra": fugir é a covardia que ele teme
    tiltAtributos: { INT: TILT_NEUTRO, WIS: TILT_NEUTRO, CHA: TILT_NEUTRO }, // o que pesaria é FOR — vetado por N2; sem tilt
    afinidadeDemografica: {
      squire: 'alta', paroco: 'media', medico: 'media', boticario: 'rara',
      taverneiro: 'media', ferreiro: 'alta', moleiro: 'alta', merceeiro: 'media',
      professora: 'media', costureira: 'media', lavadeira: 'media', lavrador: 'alta',
      criada: 'rara', constable: 'alta',
      carroceiro: 'media', guarda_caca: 'alta', parteira: 'media', pastor_de_ovelhas: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 9 e §7.2 (squire/ferreiro/moleiro/lavrador/constable; raro: criada — a que anota cada afronta); desencaixe §7.3 (Justiceiro numa criada/lavadeira, character negado); OS priors compostos F3 §4.1/dossiê §2.7 (raro novo: boticario — o balcão que anota cada afronta, o fiado não pago)',
  },

  bufao: {
    id: 'bufao',
    valor: 'o riso, a leveza',
    medo: 'ser invisível, não ter graça',
    sombraAtiva: 'crueldade leviana; a "brincadeira" fatal',
    sombraPassiva: 'bode expiatório que guarda rancor',
    autoJustificacao: 'não era pra tanto',
    temaGatilho: 'invisibilidade',
    sobAtaque: { resistir: 0, fugir: 0, gritar: 1 }, // "não ser invisível": faz barulho, chama atenção
    tiltAtributos: { INT: TILT_NEUTRO, WIS: TILT_NEUTRO, CHA: [1, 1, 1, 2, 2] }, // a graça é performance
    afinidadeDemografica: {
      squire: 'media', paroco: 'rara', medico: 'media', boticario: 'media',
      taverneiro: 'alta', ferreiro: 'media', moleiro: 'media', merceeiro: 'media',
      professora: 'media', costureira: 'media', lavadeira: 'media', lavrador: 'media',
      criada: 'media', constable: 'media',
      carroceiro: 'media', guarda_caca: 'media', parteira: 'media', pastor_de_ovelhas: 'rara',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 10 e §7.2 (taverneiro; raro: paroco — o vigário engraçado, e leviano); papel ruído: arquetipos-e-casting.md §4.1 (Bobo solta sem querer); F4: pastor raro (a graça sem plateia)',
  },

  vigia: {
    id: 'vigia',
    valor: 'saber o que se passa na vila; pertencer pela informação',
    medo: 'irrelevância, ficar de fora do que importa',
    sombraAtiva: 'chantagista/difamador — candidato natural à segunda vítima (viu e tentou lucrar)',
    sombraPassiva: 'o voyeur que testemunhou o essencial e não pode explicar por que estava à janela',
    autoJustificacao: 'alguém tinha de saber',
    temaGatilho: 'irrelevancia',
    sobAtaque: { resistir: 0, fugir: 0, gritar: 1 }, // "que se saiba": alerta a vila
    tiltAtributos: { INT: TILT_NEUTRO, WIS: [1, 1, 1, 2, 2], CHA: TILT_NEUTRO }, // o exemplo da OS §3.2
    afinidadeDemografica: {
      squire: 'media', paroco: 'rara', medico: 'media', boticario: 'media',
      taverneiro: 'alta', ferreiro: 'media', moleiro: 'media', merceeiro: 'alta',
      professora: 'media', costureira: 'media', lavadeira: 'alta', lavrador: 'media',
      criada: 'alta', constable: 'media',
      carroceiro: 'alta', guarda_caca: 'alta', parteira: 'alta', pastor_de_ovelhas: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.4.1 (emenda da OS: lavadeira — a roupa conta segredos —, criada, merceeiro, taverneiro; raro: o pároco que cataloga o rebanho); segredo de inocente: kb-psique-e-crime/sexologia-e-perversoes.md §6 + kb-producao/parafilias-e-psicopatia-visao-atual.md §3',
  },

  // -------------------------------------------------------------------
  // 12º e 13º VETORES (F4 da OS priors compostos; dossiê F1 §2.2,
  // decisão 2 aprovada; catálogo normativo: sistemas-arquetipicos-
  // alem-dos-12.md §7.5). O Penitente foi analisado e REPROVADO (colide
  // com o pecado_exposto do Devoto) — registro no dossiê, como o médium.
  // -------------------------------------------------------------------
  previdente: {
    id: 'previdente',
    valor: 'previdência, o pé-de-meia; nunca dever a ninguém',
    medo: 'a miséria à vista — a workhouse, o enterro de indigente',
    sombraAtiva: 'o agiota da vila; elimina a boca a mais, mata pelo seguro',
    sombraPassiva: 'o sovina que nega o socorro e deixa morrer de economia',
    autoJustificacao: 'não podíamos sustentá-lo',
    temaGatilho: 'miseria_a_vista',
    sobAtaque: { resistir: 0, fugir: 1, gritar: 0 }, // a prudência preserva-se: não enfrenta
    tiltAtributos: { INT: [1, 1, 2, 2, 1], WIS: TILT_NEUTRO, CHA: TILT_NEUTRO }, // a aritmética do pé-de-meia (leve)
    afinidadeDemografica: {
      squire: 'rara', paroco: 'media', medico: 'media', boticario: 'media',
      taverneiro: 'media', ferreiro: 'media', moleiro: 'alta', merceeiro: 'alta',
      professora: 'media', costureira: 'media', lavadeira: 'alta', lavrador: 'media',
      criada: 'media', constable: 'media',
      carroceiro: 'media', guarda_caca: 'media', parteira: 'rara', pastor_de_ovelhas: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.5 (F4 da OS priors compostos, dossiê §2.2); medo de época: kb-mundo-vitoriano/demografia-e-sociedade.md §4 (penny policy, pavor do enterro de indigente) e economia-e-estrutura-social.md §3 (Poor Law/workhouse); altas: merceeiro/moleiro/lavadeira (caderneta, estoque, a viúva provedora); raros: squire (a avareza inexplicável pela posição), parteira (a que cobra em prestações e conta cada penny)',
  },

  enraizado: {
    id: 'enraizado',
    valor: 'a terra, a casa, a continuidade — "os meus estão enterrados aqui"',
    medo: 'o desenraizamento: despejo, venda da terra, o êxodo que esvazia a vila',
    sombraAtiva: 'mata para não ser arrancado — o senhorio que despeja, o herdeiro que quer vender',
    sombraPassiva: 'o que apodrece no lugar e sabota a partida dos outros',
    autoJustificacao: 'esta casa é o que somos',
    temaGatilho: 'perder_o_chao',
    sobAtaque: { resistir: 1, fugir: 0, gritar: 0 }, // defende o chão de pé
    tiltAtributos: { INT: TILT_NEUTRO, WIS: TILT_NEUTRO, CHA: TILT_NEUTRO }, // raiz não é atributo — sem tilt
    afinidadeDemografica: {
      squire: 'alta', paroco: 'media', medico: 'media', boticario: 'media',
      taverneiro: 'media', ferreiro: 'alta', moleiro: 'alta', merceeiro: 'media',
      professora: 'media', costureira: 'media', lavadeira: 'media', lavrador: 'alta',
      criada: 'rara', constable: 'media',
      carroceiro: 'media', guarda_caca: 'media', parteira: 'media', pastor_de_ovelhas: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.5 (F4 da OS priors compostos, dossiê §2.2); par polar com o Errante (§2: pares valem mais que rótulos); pressão de época: economia-e-estrutura-social.md §1 (depressão agrícola, êxodo) e demografia-e-sociedade.md §1-§2 (cottage atado, a vila que encolhe); altas: squire/ferreiro/moleiro/lavrador (a terra como nome, a forja do pai, o moinho herdado); raro: criada (serve na casa que já foi da família dela)',
  },
};

// ---------------------------------------------------------------------
// MATRIZ DE ENCENAÇÃO (OS §8.4) — pools enumerados, proveniência por
// item na kb-medicina-legal. v1: consequência de dados (a realização
// física dos itens novos é OS própria; gen_hora_forjada já realiza
// `hora_encenada`).
// ---------------------------------------------------------------------
export const MATRIZ_ENCENACAO = {
  reativo: {
    qualidade: 'improvisada',
    pool: [
      { id: 'limpeza_incompleta', proveniencia: 'kb-medicina-legal/vestigios.md + game-design-simulacao.md §3.3 (o esfregado converte o óbvio em sutil, nunca em zero)' },
      { id: 'objeto_fora_de_lugar', proveniencia: 'kb-medicina-legal/protocolo-exame.md §4 (incongruência de cena)' },
      { id: 'alibi_de_ultima_hora', proveniencia: 'kb-medicina-legal/inquerito-e-policia.md (o depoimento diante do coroner)' },
      { id: 'sinais_hesitacao_defesa', proveniencia: 'kb-medicina-legal/traumas.md (lesões de defesa; reação vital)' },
    ],
  },
  instrumental: {
    qualidade: 'limpa_demais',
    pool: [
      { id: 'cena_arrumada_demais', proveniencia: 'kb-medicina-legal/protocolo-exame.md §4 (roubo que poupa valores; arrombamento incongruente)' },
      { id: 'alibi_ensaiado_detalhado', proveniencia: 'kb-medicina-legal/inquerito-e-policia.md + src/data/papeis.js (mentiraEnsaiada)' },
      { id: 'ausencia_anomala_de_vestigio', proveniencia: 'kb-medicina-legal/traumas.md (a leitura mais eloquente é a ausência) + protocolo-exame.md §4 (ausência de reação vital)' },
      { id: 'hora_encenada', proveniencia: 'kb-medicina-legal/protocolo-exame.md §4 (cronologia forjada) — realizada por gen_hora_forjada (mecânica existente)' },
    ],
  },
};

// Cenário do gerador → tipo da matriz (§4.4: reativo = briga escalada;
// instrumental = premeditado).
export const TIPO_ENCENACAO_POR_CENARIO = {
  briga_escalada: 'reativo',
  premeditado: 'instrumental',
};

// Vetores de vínculo: os que amam/cuidam demais do morto (flag
// defende_demais_o_morto).
const VETORES_DE_VINCULO = new Set(['zelador', 'amante', 'devoto']);

// ---------------------------------------------------------------------
// F3 DA OS PRIORS COMPOSTOS — regimes, decoro por classe e mentira
// periférica (docs/os-priors-compostos-e-variedade-do-elenco.md §4).
// ---------------------------------------------------------------------

// Regime de magnitude do réu (§4.2, decisão 9 aprovada: 70/30):
// regime 2 (~70%) = como sempre (réu magnitude ≥ T, isca garantida);
// regime 1 (~30%) = réu LEVEMENTE deslocado (magnitude 1, o degrau modal
// da vila), SEM isca forçada — destoantes natos permanecem se calharem,
// e o caso é carregado pelo móbil material (que o gerador já promove).
// A tese autoral vira frequência dominante, não lei aprendível.
export const FRACAO_REGIME_2 = 7; // em décimos; sal `|caso|regime-magnitude`

// Decoro por classe (§4.5; dossiê §2.8, decisão do pacote §D): a chance
// de `omite_por_decoro` (dado polaridade passiva) deixa de ser 50% plano
// e segue a respeitabilidade performática de cada degrau — a "moeda da
// classe média" (kb-mundo-vitoriano/economia-e-estrutura-social.md §2;
// números: chute calibrável registrado no dossiê). Em sextos.
export const DECORO_POR_CLASSE = {
  gentry: 4,
  clero: 5,
  profissional: 4,
  comerciante: 4,
  artesao: 3,
  lavrador: 2,
  criadagem: 3, // a criada cala pelo emprego (trait medroso), não pelo decoro
  servico_do_condado: 3,
};

// Mentira periférica calma (§4.4, decisões 10–11): inocentes elegíveis
// ganham `mente_com_calma_periferica:<tema>` em ~1/6 dos sorteios —
// segredos REFUTÁVEIS POR MATÉRIA que jamais tocam janela/causa/nexo.
// Quebra a precisão de 100% do tell "mentira serena ⇒ réu".
export const CHANCE_CALMA_PERIFERICA = 1; // em sextos
export const TEMAS_PERIFERICOS = ['divida_escondida', 'ligacao_amorosa', 'desonestidade_miuda'];

// Calma do réu acoplada ao cenário (§4.4, decisão 7): premeditado 2/6
// (o ensaio dá a calma), briga escalada 1/6 — média global ≈ os 25%
// antigos; o que muda é o ACOPLAMENTO, não a taxa.
export const CALMA_REU_POR_CENARIO = { premeditado: 2, briga_escalada: 1 };

// ---------------------------------------------------------------------
// SORTEIO (OS §4.2 e §8.2). `salBase` é salDaSeed(seed); `indice` é a
// posição do personagem no elenco (estável por seed).
// ---------------------------------------------------------------------

function sortearPonderadoLocal(opcoes, chave) {
  const total = opcoes.reduce((soma, o) => soma + o.peso, 0);
  if (total <= 0) return null;
  let alvo = hashDecisao(chave) % total;
  for (const opcao of opcoes) {
    alvo -= opcao.peso;
    if (alvo < 0) return opcao.valor;
  }
  return opcoes[opcoes.length - 1].valor;
}

export function magnitudeDesencaixe(vetorId, arquetipoId) {
  const degrau = VETORES_PSIQUICOS[vetorId]?.afinidadeDemografica?.[arquetipoId];
  return degrau == null ? null : MAGNITUDE_POR_DEGRAU[degrau];
}

// Sorteia o vetor de um personagem pelos pesos de afinidade do arquétipo
// dele (jamais restrição dura: qualquer psique pode calhar em qualquer
// ofício). `tentativa` > 0 usa o sal incremental `_r<k>` (reamostragem).
export function sortearVetor(salBase, indice, arquetipoId, tentativa = 0) {
  const sufixo = tentativa > 0 ? `_r${tentativa}` : '';
  const chave = `${salBase}|psique|vet_${indice}${sufixo}`;
  const opcoes = Object.values(VETORES_PSIQUICOS).map((v) => ({
    valor: v.id,
    peso: DEGRAU_PESO[v.afinidadeDemografica[arquetipoId] ?? 'media'],
  }));
  return sortearPonderadoLocal(opcoes, chave);
}

export function sortearPolaridade(salBase, indice) {
  return hashDecisao(`${salBase}|psique|pol_${indice}`) % 2 === 0 ? 'ativa' : 'passiva';
}

// Reamostra o vetor de um personagem até `aceita(magnitude)` — usado
// pelo regime 2 (magnitude ≥ T) e pelo regime 1 (magnitude === 1, o
// estado modal). Esgotado o teto, varredura determinística pela ordem do
// catálogo (jamais laço aberto). Devolve { vetorId, tentativas }.
// Nota de engenharia (OS priors compostos §4.6): com os raros novos,
// P(magnitude ≥ 2 por tentativa) subiu de ~3,4–7,7% para ~7–12%; falhar
// as 24 tentativas caiu de ~37% para ~5–17% conforme o ofício — o teto
// 24 + varredura permanece.
function forcarVetor(salBase, indice, arquetipoId, aceita) {
  for (let k = 1; k <= MAX_TENTATIVAS; k++) {
    const vetorId = sortearVetor(salBase, indice, arquetipoId, k);
    if (aceita(magnitudeDesencaixe(vetorId, arquetipoId))) {
      return { vetorId, tentativas: k };
    }
  }
  const varrido = Object.values(VETORES_PSIQUICOS).find((v) =>
    aceita(MAGNITUDE_POR_DEGRAU[v.afinidadeDemografica[arquetipoId] ?? 'media'])
  );
  return { vetorId: varrido.id, tentativas: MAX_TENTATIVAS + 1 };
}

// ---------------------------------------------------------------------
// A PSIQUE DO CASO (integração chamada por caso.js). Devolve:
//   consequencias : porPessoa (id → { flags, tendenciasVestigio }) +
//                   encenacao do caso — o que o pacote PODE consumir;
//   log           : rótulos de build (vetor/polaridade/magnitude por
//                   pessoa, falso-destoante, reamostragens) — NUNCA
//                   entram em src/data nem no pacote.
// `coabitantesVitimaIds` dá a prioridade do falso-destoante (§8.3.3).
// ---------------------------------------------------------------------
export function derivarPsiqueDoCaso({ seed, elenco, assassinoId, vitimaId, cenario, coabitantesVitimaIds = [] }) {
  const salBase = typeof seed === 'string' ? seed : seed?.id || 'caso';

  // 1. Sorteio ortogonal por personagem (OS §4.2).
  const log = { porPessoa: {}, reamostragens: [], falsoDestoanteId: null, regime: null };
  elenco.forEach((pessoa, indice) => {
    const vetorId = sortearVetor(salBase, indice, pessoa.arquetipo);
    log.porPessoa[pessoa.id] = {
      indice,
      vetorId,
      polaridade: sortearPolaridade(salBase, indice),
      magnitude: magnitudeDesencaixe(vetorId, pessoa.arquetipo),
    };
  });

  // 1b. Regime de magnitude do réu (F3 §4.2): moeda determinística por
  // caso. Regime 2 = crime da alma (desencaixe forte + isca garantida);
  // regime 1 = crime de circunstância (réu no degrau modal, sem isca).
  const regime = hashDecisao(`${salBase}|caso|regime-magnitude`) % 10 < FRACAO_REGIME_2 ? 2 : 1;
  log.regime = regime;

  // 2. Assassino, conforme o regime. A polaridade re-lê o próprio sal
  // sobre o vetor final (não muda).
  const doReu = log.porPessoa[assassinoId];
  const reu = elenco[doReu.indice];
  if (regime === 2 && doReu.magnitude < LIMIAR_DESENCAIXE) {
    const { vetorId, tentativas } = forcarVetor(
      salBase, doReu.indice, reu.arquetipo, (m) => m >= LIMIAR_DESENCAIXE
    );
    log.reamostragens.push({ pessoaId: assassinoId, motivo: 'reu_sob_limiar', tentativas });
    doReu.vetorId = vetorId;
    doReu.magnitude = magnitudeDesencaixe(vetorId, reu.arquetipo);
  } else if (regime === 1 && doReu.magnitude !== 1) {
    // O réu se esconde no estado modal da vila (magnitude 1 — o degrau
    // médio é o mais comum em todo ofício; convergência rápida).
    const { vetorId, tentativas } = forcarVetor(
      salBase, doReu.indice, reu.arquetipo, (m) => m === 1
    );
    log.reamostragens.push({ pessoaId: assassinoId, motivo: 'reu_fora_do_modal', tentativas });
    doReu.vetorId = vetorId;
    doReu.magnitude = magnitudeDesencaixe(vetorId, reu.arquetipo);
  }

  // 3. Falso-destoante (a ISCA PLENA — segredo probatório + mentira; no
  // máximo 1 por caso, §4.3): SÓ NO REGIME 2 (OS §8.3.3). Prioridade:
  // coabitantes da vítima, depois os demais; escolha determinística.
  // No regime 1 não há isca forçada: destoantes natos permanecem se
  // calharem (não remover, não forçar) e viram TEXTURA (§4.3) — o
  // gatilho_de_complexo deles entra na compilação, mentira não.
  const inocentes = elenco.filter((p) => p.id !== assassinoId && p.id !== vitimaId);
  if (regime === 2) {
    const destoantesNatos = inocentes.filter(
      (p) => log.porPessoa[p.id].magnitude >= LIMIAR_DESENCAIXE
    );
    if (destoantesNatos.length > 0) {
      const prioridade =
        destoantesNatos.find((p) => coabitantesVitimaIds.includes(p.id)) || destoantesNatos[0];
      log.falsoDestoanteId = prioridade.id;
    } else {
      const fila = [
        ...inocentes.filter((p) => coabitantesVitimaIds.includes(p.id)),
        ...inocentes.filter((p) => !coabitantesVitimaIds.includes(p.id)),
      ];
      const escolhido = fila[hashDecisao(`${salBase}|psique|desenc_escolha`) % fila.length];
      const dele = log.porPessoa[escolhido.id];
      const { vetorId, tentativas } = forcarVetor(
        salBase, dele.indice, escolhido.arquetipo, (m) => m >= LIMIAR_DESENCAIXE
      );
      log.reamostragens.push({ pessoaId: escolhido.id, motivo: 'falso_destoante', tentativas });
      dele.vetorId = vetorId;
      dele.magnitude = magnitudeDesencaixe(vetorId, escolhido.arquetipo);
      log.falsoDestoanteId = escolhido.id;
    }
  }

  // 4. Encenação condicionada ao tipo de crime (OS §4.4/§8.4).
  const tipo = TIPO_ENCENACAO_POR_CENARIO[cenario];
  const matriz = MATRIZ_ENCENACAO[tipo];
  const encenacao = {
    tipo,
    qualidade: matriz.qualidade,
    pool: matriz.pool.map((item) => item.id),
  };

  // 5. Compilação de consequências (OS §4.5; F3 §4.3–§4.5) — o rótulo
  // fica no log.
  const porPessoa = {};
  for (const pessoa of elenco) {
    if (pessoa.id === vitimaId) continue;
    const dele = log.porPessoa[pessoa.id];
    const vetor = VETORES_PSIQUICOS[dele.vetorId];
    const flags = [];
    if (pessoa.id === assassinoId) {
      // Calma acoplada ao cenário (F3 §4.4, decisão 7): o ensaio dá a
      // calma. Sal NOVO `flag_<i>_calma_cenario` (a decisão mudou de
      // forma; o antigo flag_<i>_1 aposenta-se — regra de ouro dos sais).
      const calma =
        hashDecisao(`${salBase}|psique|flag_${dele.indice}_calma_cenario`) % 6 <
        (CALMA_REU_POR_CENARIO[cenario] ?? 1);
      flags.push(calma ? 'mente_com_calma' : 'mente_sob_pressao');
      flags.push(`gatilho_de_complexo:${vetor.temaGatilho}`);
    } else {
      // Decoro por classe (F3 §4.5): a omissão respeitável é mais
      // provável onde a respeitabilidade é a moeda. Sal novo
      // `flag_<i>_decoro` (antes era incondicional na polaridade).
      if (
        dele.polaridade === 'passiva' &&
        hashDecisao(`${salBase}|psique|flag_${dele.indice}_decoro`) % 6 <
          (DECORO_POR_CLASSE[pessoa.classeSocial] ?? 3)
      ) {
        flags.push('omite_por_decoro');
      }
      if (dele.polaridade === 'ativa' && hashDecisao(`${salBase}|psique|flag_${dele.indice}_2`) % 2 === 0) {
        flags.push('acusa_com_fervor');
      }
      if (VETORES_DE_VINCULO.has(dele.vetorId) && hashDecisao(`${salBase}|psique|flag_${dele.indice}_3`) % 2 === 0) {
        flags.push('defende_demais_o_morto');
      }
      if (pessoa.id === log.falsoDestoanteId) {
        // A isca plena (só regime 2): mentira + o que esconder.
        if (!flags.includes('mente_sob_pressao')) flags.push('mente_sob_pressao');
        flags.push(`gatilho_de_complexo:${vetor.temaGatilho}`);
      } else if (dele.magnitude >= LIMIAR_DESENCAIXE) {
        // Destoância como TEXTURA (F3 §4.3): o destoante nato que não é
        // a isca quebra sob a pergunta certa e entrega biografia, não
        // caso — gatilho sim, mentira sobre janela/causa/nexo jamais.
        flags.push(`gatilho_de_complexo:${vetor.temaGatilho}`);
      }
      // Mentira periférica calma (F3 §4.4): segredo refutável por
      // matéria, nunca janela/causa/nexo — mata o tell "serena ⇒ réu".
      // A isca plena está fora (já mente o paradeiro dela).
      if (
        pessoa.id !== log.falsoDestoanteId &&
        hashDecisao(`${salBase}|psique|flag_${dele.indice}_calma_periferica`) % 6 <
          CHANCE_CALMA_PERIFERICA
      ) {
        const tema =
          TEMAS_PERIFERICOS[
            hashDecisao(`${salBase}|psique|flag_${dele.indice}_tema_periferico`) %
              TEMAS_PERIFERICOS.length
          ];
        flags.push(`mente_com_calma_periferica:${tema}`);
      }
    }
    porPessoa[pessoa.id] = {
      flags,
      tendenciasVestigio: pessoa.id === assassinoId ? [...encenacao.pool] : [],
    };
  }

  // Portão psíquico da vítima (OS confronto estendido §4.4): o resolvedor
  // lê sobAtaque + polaridade da vítima para pesar resistir × fugir × gritar.
  // A vítima recebeu vetor+polaridade no sorteio (passo 1); o rótulo fica no
  // log, só os pesos e a polaridade atravessam para o resolvedor.
  const daVitima = log.porPessoa[vitimaId];
  const vetorVitima = VETORES_PSIQUICOS[daVitima?.vetorId];
  const portaoVitima = {
    sobAtaque: { ...(vetorVitima?.sobAtaque || { resistir: 0, fugir: 0, gritar: 0 }) },
    polaridade: daVitima?.polaridade || 'ativa',
  };

  return { consequencias: { porPessoa, encenacao }, portaoVitima, log };
}

export function obterVetorPsiquico(id) {
  return VETORES_PSIQUICOS[id] || null;
}
