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
// REGRAS DE COMPILAÇÃO (OS §4.5, determinísticas, auditáveis):
//   • assassino → mente_com_calma (raro, 1 em 4: a sombra integrada do
//     culpado difícil) OU mente_sob_pressao; sempre gatilho_de_complexo
//     com o tema do medo central do vetor dele.
//   • não-assassino de polaridade passiva → omite_por_decoro.
//   • não-assassino de polaridade ativa → acusa_com_fervor em metade dos
//     sorteios (projeção: quem condena demais descreve a si).
//   • vetor de vínculo (zelador/amante/devoto) → defende_demais_o_morto
//     em metade dos sorteios.
//   • falso-destoante (magnitude ≥ T sem ser o réu) → mente_sob_pressao +
//     gatilho_de_complexo: ele tem o que esconder — só que não é o crime.
//   • tendências de vestígio v1: o pool da matriz de encenação (OS §8.4)
//     aplicado ao assassino conforme o tipo de crime; a realização física
//     dos itens novos é OS própria (válvula do §7 da OS).
//
// DESENCAIXE (OS §8.3): magnitude derivada do degrau de afinidade
// vetor × demográfico (alta=0, media=1, rara=2). T=2 para o assassino
// (reamostragem por rejeição com sal incremental, teto finito) e ≥1
// falso-destoante inocente garantido (prioridade: coabitantes da vítima).
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

// Os 14 arquétipos demográficos, na ordem de arquetipos.js (para a
// completude verificada no qa.mjs).
export const DEMOGRAFICOS = [
  'squire', 'paroco', 'medico', 'boticario', 'taverneiro', 'ferreiro', 'moleiro',
  'merceeiro', 'professora', 'costureira', 'lavadeira', 'lavrador', 'criada', 'constable',
];

// Os 6 papéis dramáticos (src/data/papeis.js), para afinidadePapeis.
export const PAPEIS_DRAMATICOS = [
  'assassino_encenador', 'isca_do_apressado', 'veu', 'ruido_pista_dupla',
  'mentiroso_por_medo', 'fonte',
];

// ---------------------------------------------------------------------
// O CATÁLOGO v1 — onze vetores (tabela 7.1 + emenda 7.4.1). Campos da
// OS §8.1. `afinidadeDemografica` em degraus (7.2); `afinidadePapeis`
// em pesos 0–4 (lógica de arquetipos-e-casting.md §4.1); `temaGatilho`
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
    afinidadePapeis: {
      assassino_encenador: 3, isca_do_apressado: 1, veu: 3,
      ruido_pista_dupla: 1, mentiroso_por_medo: 2, fonte: 1,
    },
    afinidadeDemografica: {
      squire: 'media', paroco: 'alta', medico: 'alta', boticario: 'media',
      taverneiro: 'media', ferreiro: 'media', moleiro: 'media', merceeiro: 'rara',
      professora: 'alta', costureira: 'media', lavadeira: 'media', lavrador: 'alta',
      criada: 'alta', constable: 'media',
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
    afinidadePapeis: {
      assassino_encenador: 4, isca_do_apressado: 2, veu: 1,
      ruido_pista_dupla: 1, mentiroso_por_medo: 1, fonte: 2,
    },
    afinidadeDemografica: {
      squire: 'alta', paroco: 'media', medico: 'rara', boticario: 'media',
      taverneiro: 'media', ferreiro: 'media', moleiro: 'media', merceeiro: 'alta',
      professora: 'media', costureira: 'media', lavadeira: 'media', lavrador: 'rara',
      criada: 'media', constable: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 2 e §7.2 (squire/merceeiro; raros: medico — reina pela receita — e lavrador — patriarca de cottage); desencaixe §7.3 (Soberano num merceeiro/moleiro)',
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
    afinidadePapeis: {
      assassino_encenador: 4, isca_do_apressado: 1, veu: 1,
      ruido_pista_dupla: 1, mentiroso_por_medo: 1, fonte: 3,
    },
    afinidadeDemografica: {
      squire: 'media', paroco: 'alta', medico: 'alta', boticario: 'alta',
      taverneiro: 'media', ferreiro: 'rara', moleiro: 'rara', merceeiro: 'media',
      professora: 'alta', costureira: 'rara', lavadeira: 'rara', lavrador: 'media',
      criada: 'media', constable: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 3 e §7.2 (paroco/medico/boticario/professora; raros: ferreiro/moleiro — autodidata sem letras — e costureira/lavadeira — inteligência sem porta); desencaixe §7.3 (Erudita numa costureira/criada)',
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
    afinidadePapeis: {
      assassino_encenador: 2, isca_do_apressado: 2, veu: 3,
      ruido_pista_dupla: 2, mentiroso_por_medo: 2, fonte: 1,
    },
    afinidadeDemografica: {
      squire: 'media', paroco: 'alta', medico: 'media', boticario: 'media',
      taverneiro: 'rara', ferreiro: 'media', moleiro: 'media', merceeiro: 'media',
      professora: 'alta', costureira: 'media', lavadeira: 'media', lavrador: 'media',
      criada: 'media', constable: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 4 e §7.2 (paroco/professora; raro: taverneiro — herdou o pub que a capela manda odiar); desencaixe §7.3 (Devoto num taverneiro; motivo rivalidade_capela_taverna); tempero médium: §7.4.2',
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
    afinidadePapeis: {
      assassino_encenador: 2, isca_do_apressado: 2, veu: 1,
      ruido_pista_dupla: 2, mentiroso_por_medo: 1, fonte: 1,
    },
    afinidadeDemografica: {
      squire: 'media', paroco: 'media', medico: 'media', boticario: 'alta',
      taverneiro: 'media', ferreiro: 'alta', moleiro: 'alta', merceeiro: 'media',
      professora: 'media', costureira: 'alta', lavadeira: 'alta', lavrador: 'rara',
      criada: 'media', constable: 'media',
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
    afinidadePapeis: {
      assassino_encenador: 3, isca_do_apressado: 2, veu: 4,
      ruido_pista_dupla: 1, mentiroso_por_medo: 2, fonte: 1,
    },
    afinidadeDemografica: {
      squire: 'media', paroco: 'media', medico: 'media', boticario: 'media',
      taverneiro: 'media', ferreiro: 'media', moleiro: 'media', merceeiro: 'media',
      professora: 'media', costureira: 'alta', lavadeira: 'media', lavrador: 'media',
      criada: 'alta', constable: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 6 (nota de nome: §7.4.3) e §7.2 (costureira/criada); desencaixe §7.3 (Amante numa esposa sem saída); papel veu: arquetipos-e-casting.md §4.1 (esconde o caso)',
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
    afinidadePapeis: {
      assassino_encenador: 2, isca_do_apressado: 4, veu: 1,
      ruido_pista_dupla: 3, mentiroso_por_medo: 3, fonte: 1,
    },
    afinidadeDemografica: {
      squire: 'media', paroco: 'media', medico: 'media', boticario: 'rara',
      taverneiro: 'alta', ferreiro: 'media', moleiro: 'media', merceeiro: 'alta',
      professora: 'media', costureira: 'alta', lavadeira: 'alta', lavrador: 'media',
      criada: 'alta', constable: 'alta',
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
    afinidadePapeis: {
      assassino_encenador: 2, isca_do_apressado: 2, veu: 2,
      ruido_pista_dupla: 1, mentiroso_por_medo: 2, fonte: 2,
    },
    afinidadeDemografica: {
      squire: 'rara', paroco: 'media', medico: 'media', boticario: 'media',
      taverneiro: 'media', ferreiro: 'media', moleiro: 'media', merceeiro: 'media',
      professora: 'rara', costureira: 'media', lavadeira: 'media', lavrador: 'alta',
      criada: 'media', constable: 'rara',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 8 e §7.2 (lavrador; raros: squire — herdeiro que odeia a herança —, professora — instrução como bilhete de fuga — e constable — o uniforme como jaula); desencaixe §7.3 (Errante em lavrador/constable, êxodo rural)',
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
    afinidadePapeis: {
      assassino_encenador: 2, isca_do_apressado: 4, veu: 1,
      ruido_pista_dupla: 2, mentiroso_por_medo: 1, fonte: 1,
    },
    afinidadeDemografica: {
      squire: 'alta', paroco: 'media', medico: 'media', boticario: 'media',
      taverneiro: 'media', ferreiro: 'alta', moleiro: 'alta', merceeiro: 'media',
      professora: 'media', costureira: 'media', lavadeira: 'media', lavrador: 'alta',
      criada: 'rara', constable: 'alta',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 9 e §7.2 (squire/ferreiro/moleiro/lavrador/constable; raro: criada — a que anota cada afronta); desencaixe §7.3 (Justiceiro numa criada/lavadeira, character negado)',
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
    afinidadePapeis: {
      assassino_encenador: 1, isca_do_apressado: 3, veu: 1,
      ruido_pista_dupla: 3, mentiroso_por_medo: 2, fonte: 2,
    },
    afinidadeDemografica: {
      squire: 'media', paroco: 'rara', medico: 'media', boticario: 'media',
      taverneiro: 'alta', ferreiro: 'media', moleiro: 'media', merceeiro: 'media',
      professora: 'media', costureira: 'media', lavadeira: 'media', lavrador: 'media',
      criada: 'media', constable: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.1 linha 10 e §7.2 (taverneiro; raro: paroco — o vigário engraçado, e leviano); papel ruído: arquetipos-e-casting.md §4.1 (Bobo solta sem querer)',
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
    afinidadePapeis: {
      assassino_encenador: 1, isca_do_apressado: 1, veu: 3,
      ruido_pista_dupla: 2, mentiroso_por_medo: 2, fonte: 4,
    },
    afinidadeDemografica: {
      squire: 'media', paroco: 'rara', medico: 'media', boticario: 'media',
      taverneiro: 'alta', ferreiro: 'media', moleiro: 'media', merceeiro: 'alta',
      professora: 'media', costureira: 'media', lavadeira: 'alta', lavrador: 'media',
      criada: 'alta', constable: 'media',
    },
    proveniencia:
      'sistemas-arquetipicos-alem-dos-12.md §7.4.1 (emenda da OS: lavadeira — a roupa conta segredos —, criada, merceeiro, taverneiro; raro: o pároco que cataloga o rebanho); segredo de inocente: kb-psique-e-crime/sexologia-e-perversoes.md §6 + kb-producao/parafilias-e-psicopatia-visao-atual.md §3',
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

// Reamostra o vetor de um personagem até magnitude ≥ LIMIAR_DESENCAIXE.
// Esgotado o teto, varredura determinística pela ordem do catálogo
// (jamais laço aberto). Devolve { vetorId, tentativas }.
function forcarDesencaixe(salBase, indice, arquetipoId) {
  for (let k = 1; k <= MAX_TENTATIVAS; k++) {
    const vetorId = sortearVetor(salBase, indice, arquetipoId, k);
    if (magnitudeDesencaixe(vetorId, arquetipoId) >= LIMIAR_DESENCAIXE) {
      return { vetorId, tentativas: k };
    }
  }
  const raro = Object.values(VETORES_PSIQUICOS).find(
    (v) => MAGNITUDE_POR_DEGRAU[v.afinidadeDemografica[arquetipoId] ?? 'media'] >= LIMIAR_DESENCAIXE
  );
  return { vetorId: raro.id, tentativas: MAX_TENTATIVAS + 1 };
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
  const log = { porPessoa: {}, reamostragens: [], falsoDestoanteId: null };
  elenco.forEach((pessoa, indice) => {
    const vetorId = sortearVetor(salBase, indice, pessoa.arquetipo);
    log.porPessoa[pessoa.id] = {
      indice,
      vetorId,
      polaridade: sortearPolaridade(salBase, indice),
      magnitude: magnitudeDesencaixe(vetorId, pessoa.arquetipo),
    };
  });

  // 2. Assassino: desencaixe obrigatório (magnitude ≥ T), por
  // reamostragem por rejeição (OS §8.3.2). A polaridade re-lê o próprio
  // sal sobre o vetor final (não muda).
  const doReu = log.porPessoa[assassinoId];
  const reu = elenco[doReu.indice];
  if (doReu.magnitude < LIMIAR_DESENCAIXE) {
    const { vetorId, tentativas } = forcarDesencaixe(salBase, doReu.indice, reu.arquetipo);
    log.reamostragens.push({ pessoaId: assassinoId, motivo: 'reu_sob_limiar', tentativas });
    doReu.vetorId = vetorId;
    doReu.magnitude = magnitudeDesencaixe(vetorId, reu.arquetipo);
  }

  // 3. Falso-destoante garantido (OS §8.3.3): ao menos um NÃO-assassino
  // com magnitude ≥ T. Prioridade: coabitantes da vítima (os
  // falsos-óbvios naturais), depois os demais; escolha determinística.
  const inocentes = elenco.filter((p) => p.id !== assassinoId && p.id !== vitimaId);
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
    const { vetorId, tentativas } = forcarDesencaixe(salBase, dele.indice, escolhido.arquetipo);
    log.reamostragens.push({ pessoaId: escolhido.id, motivo: 'falso_destoante', tentativas });
    dele.vetorId = vetorId;
    dele.magnitude = magnitudeDesencaixe(vetorId, escolhido.arquetipo);
    log.falsoDestoanteId = escolhido.id;
  }

  // 4. Encenação condicionada ao tipo de crime (OS §4.4/§8.4).
  const tipo = TIPO_ENCENACAO_POR_CENARIO[cenario];
  const matriz = MATRIZ_ENCENACAO[tipo];
  const encenacao = {
    tipo,
    qualidade: matriz.qualidade,
    pool: matriz.pool.map((item) => item.id),
  };

  // 5. Compilação de consequências (OS §4.5) — o rótulo fica no log.
  const porPessoa = {};
  for (const pessoa of elenco) {
    if (pessoa.id === vitimaId) continue;
    const dele = log.porPessoa[pessoa.id];
    const vetor = VETORES_PSIQUICOS[dele.vetorId];
    const flags = [];
    if (pessoa.id === assassinoId) {
      const calma = hashDecisao(`${salBase}|psique|flag_${dele.indice}_1`) % 4 === 0;
      flags.push(calma ? 'mente_com_calma' : 'mente_sob_pressao');
      flags.push(`gatilho_de_complexo:${vetor.temaGatilho}`);
    } else {
      if (dele.polaridade === 'passiva') flags.push('omite_por_decoro');
      if (dele.polaridade === 'ativa' && hashDecisao(`${salBase}|psique|flag_${dele.indice}_2`) % 2 === 0) {
        flags.push('acusa_com_fervor');
      }
      if (VETORES_DE_VINCULO.has(dele.vetorId) && hashDecisao(`${salBase}|psique|flag_${dele.indice}_3`) % 2 === 0) {
        flags.push('defende_demais_o_morto');
      }
      if (pessoa.id === log.falsoDestoanteId) {
        if (!flags.includes('mente_sob_pressao')) flags.push('mente_sob_pressao');
        flags.push(`gatilho_de_complexo:${vetor.temaGatilho}`);
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
