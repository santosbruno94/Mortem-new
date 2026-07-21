// =====================================================================
// MARCAS EXIGÍVEIS — o vocabulário do verbo "Exigir que mostre" (Inc. 6
// do pivô Gabinete Ilustrado; design em docs/os-exigir-que-mostre.md).
//
// DADO PURO e GERADOR-FACING (o runtime JAMAIS o importa — guarda no
// qa.mjs). Validado contra docs/kb-medicina-legal/ pelo perito-forense.
//
// O CIRCUITO (OS §1): sinal anunciado → exigir → close → carta.
//   1. A vítima carrega vestígio que ANUNCIA a marca-espelho no agressor.
//   2. O perito exige que o suspeito mostre a região.
//   3. O close (vinheta de gravura) mostra o que há.
//   4. A observação vira carta com tagsOcultas próprias.
//
// RUÍDO HONESTO (OS §3, decisão 4.3): todo caso com marca-espelho no réu
// tem ≥2 inocentes com marca plausível (1 ocupacional + 1 situacional).
// A marca NUNCA é âncora única de autoria (Via B, os-p9-ancora-hibrida.md).
//
// VENENO: nenhuma marca corporal confiável — o verbo é INÚTIL contra
// envenenador (design intencional: ensina que o veneno se investiga pela
// cadeia circunstancial).
// =====================================================================

import { SEDE_LEGIVEL } from './vestigios.js';

// ---------------------------------------------------------------------
// Regiões exigíveis — as partes do corpo que o perito pode mandar
// mostrar. Subconjunto semântico das SEDES_POR_REGIAO de vestigios.js,
// agrupado pela granularidade do gesto ("mostre as mãos" cobre palmas
// e dorso; "mostre os antebraços" cobre o antebraço inteiro).
// ---------------------------------------------------------------------
export const REGIOES_EXIGIVEIS = {
  maos: {
    rotulo: 'as mãos',
    descricaoExigencia: 'Exigir que mostre as mãos',
    sedes: ['palmas', 'dorso_das_maos', 'sob_as_unhas'],
    descricaoNadaDeNota: 'As mãos não trazem marca fresca: calos do ofício, a pele do dia-a-dia. Nada de nota.',
  },
  antebracos: {
    rotulo: 'os antebraços',
    descricaoExigencia: 'Exigir que mostre os antebraços',
    sedes: ['antebracos'],
    descricaoNadaDeNota: 'Os antebraços não trazem arranhão fresco nem equimose recente. Nada de nota.',
  },
  botas: {
    rotulo: 'as botas',
    descricaoExigencia: 'Exigir que mostre as botas',
    sedes: ['canelas'], // a bota cobre até a canela; a lama está ali
    descricaoNadaDeNota: 'As botas trazem a poeira comum da estrada, sem lama de margem nem mancha fora de hora. Nada de nota.',
  },
};

// ---------------------------------------------------------------------
// Sinal e marca-espelho por família de método (decisão 4.4, validada
// contra docs/kb-medicina-legal/ pelo perito-forense).
//
// `sinal` — o que a perícia do corpo da vítima anuncia (texto da vozMestre
//   na carta-sinal); gate do verbo "Exigir que mostre".
// `marca` — o que o réu carrega; `regiao` é a REGIOES_EXIGIVEIS que o
//   gesto demanda; `sede` é a sede anatômica de SEDE_LEGIVEL.
// `descricaoClose` — o que o close (vinheta) mostra ao perito.
// `descricaoNadaDeNota` — o que se vê quando NÃO há marca.
//
// Métodos com `suprimeBatalha: true` (veneno) NÃO produzem marca —
// ausência intencional; entry `null`.
// ---------------------------------------------------------------------
export const SINAL_POR_METODO = {
  laminada: {
    sinal: 'Quem empunhou a lâmina contra resistência teria a palma da mão marcada — o gume escorrega sobre os dedos quando encontra osso.',
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Corte inciso na palma, limpo, na base dos dedos — a marca de quem escorregou sobre o gume.',
    descricaoClose: 'Na palma, um corte inciso limpo, transversal, na base dos dedos. A borda é nítida: lâmina, não queda.',
    descricaoNadaDeNota: 'Palmas calosas, sem corte recente. Nada de nota.',
    proveniencia: 'docs/kb-medicina-legal/traumas.md (feridas de defesa ativa; a simetria no agressor)',
  },
  contundente: {
    sinal: 'A lesão contusa é compatível com murro contra osso — quem desferiu o golpe teria os nós dos dedos inchados.',
    regiao: 'maos',
    sede: 'dorso_das_maos',
    marca: 'Equimoses frescas nos nós dos dedos, circunscritas — a mão que bateu em osso.',
    descricaoClose: 'Nos nós dos dedos, equimoses frescas, circunscritas, com inchaço que os dias do crime explicam. Não é calo de ofício.',
    descricaoNadaDeNota: 'O dorso das mãos tem os calos de sempre, sem equimose fresca. Nada de nota.',
    proveniencia: 'docs/kb-medicina-legal/traumas.md (fratura do metacarpo por soco; a marca no agressor)',
  },
  esganadura: {
    sinal: 'As equimoses digitais no pescoço mostram que a vítima arrancou as mãos do agressor — quem a esganou teria meias-luas de unha no dorso das mãos.',
    regiao: 'maos',
    sede: 'dorso_das_maos',
    marca: 'Escoriações ungueais em meia-lua no dorso das mãos — onde a vítima tentou arrancar a preensão.',
    descricaoClose: 'No dorso de ambas as mãos, escoriações em arco, rasas, com halo avermelhado. Meias-luas de unha — de quem tinha as mãos presas e se debatia.',
    descricaoNadaDeNota: 'O dorso das mãos está limpo, sem arranhão fresco. Nada de nota.',
    proveniencia: 'docs/kb-medicina-legal/asfixias.md (escoriações ungueais no dorso — correspondência topográfica da esganadura)',
  },
  garrote: {
    sinal: 'O sulco da ligadura mostra força sustentada — quem puxou a corda teria as palmas escoriadas pelo atrito.',
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Escoriação de atrito nas palmas, em faixa — a marca da corda puxada com força.',
    descricaoClose: 'Nas palmas, uma escoriação em faixa, por atrito, com o padrão da corda trançada. A marca tem os dias do crime.',
    descricaoNadaDeNota: 'Palmas calosas, sem escoriação de atrito. Nada de nota.',
    proveniencia: 'docs/kb-medicina-legal/asfixias.md (sulco horizontal de ligadura; a contrapressão nas palmas)',
  },
  sufocacao: {
    sinal: 'As escoriações periorais indicam que a vítima se debateu — quem a abafou teria arranhões nos antebraços.',
    regiao: 'antebracos',
    sede: 'antebracos',
    marca: 'Arranhões lineares, paralelos, nos antebraços — as unhas de quem se debatia sob a mão.',
    descricaoClose: 'Nos antebraços, arranhões lineares, paralelos, frescos. As unhas que os fizeram vinham de baixo — de quem se debate deitado.',
    descricaoNadaDeNota: 'Os antebraços têm os arranhões do ofício, sem marca fresca de luta. Nada de nota.',
    proveniencia: 'docs/kb-medicina-legal/asfixias.md (sufocação; escoriações ungueais nos antebraços do agressor)',
  },
  afogamento: {
    sinal: 'Houve submersão forçada — quem segurou a vítima sob a água teria as botas enlameadas e as mãos arranhadas.',
    regiao: 'botas',
    sede: 'canelas',
    marca: 'Botas enlameadas com lama da margem, fora de hora — e arranhões frescos nas mãos.',
    descricaoClose: 'As botas trazem lama da margem, barro escuro com limo. A lama está fresca — não é sujeira de estrada seca.',
    descricaoNadaDeNota: 'Botas sujas de terra comum, sem lama de margem. Nada de nota.',
    proveniencia: 'docs/kb-medicina-legal/asfixias.md (afogamento; roupas molhadas e enlameadas do agressor)',
  },
  veneno_arsenico: null,
  laudano: null,
};

// ---------------------------------------------------------------------
// Marcas inocentes por ofício (decisão 4.3, via ocupacional). O gerador
// cruza o arquétipo do personagem com esta tabela para plantar ruído
// honesto que mimetiza a marca-espelho do réu.
// Cada entrada declara as regiões que cobre (quais REGIOES_EXIGIVEIS
// activaria como falso positivo).
// ---------------------------------------------------------------------
export const MARCAS_INOCENTES_OFICIO = {
  ferreiro: {
    regiao: 'maos',
    sede: 'dorso_das_maos',
    marca: 'Calos grossos e endurecidos nos nós dos dedos; queimaduras antigas de fagulha nos antebraços.',
    descricaoClose: 'Nós dos dedos calosos e engrossados — o martelo faz isto, ano após ano. Há queimaduras antigas de fagulha, redondas, cicatrizadas.',
    proveniencia: 'docs/kb-mundo-vitoriano/utensilios-e-objetos.md (ofícios e marcas de trabalho)',
  },
  carpinteiro: {
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Calos de formão e plaina; cortes cicatrizados nos dedos.',
    descricaoClose: 'Palmas de quem segura formão há anos. Cortes cicatrizados nos dedos — nenhum fresco, todos da madeira.',
    proveniencia: 'docs/kb-mundo-vitoriano/utensilios-e-objetos.md',
  },
  acougueiro: {
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Cortes cicatrizados nos dedos; sangue de animal sob as unhas.',
    descricaoClose: 'Mãos de quem corta carne: cicatrizes antigas nos dedos, a pele avermelhada do sangue de sempre. Nada de fresco.',
    proveniencia: 'docs/kb-medicina-legal/supressao-de-vestigios.md (o álibi do sangue de porco)',
  },
  cozinheira: {
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Queimaduras de fogão a lenha nos antebraços; cortes de faca nos dedos.',
    descricaoClose: 'Cortes de faca de cozinha nos dedos, cicatrizados. Queimaduras lineares no antebraço — o fogão a lenha marca quem cozinha.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (a rotina doméstica)',
  },
  lavadeira: {
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Mãos vermelhas e rachadas pela soda de lavagem.',
    descricaoClose: 'Mãos vermelhas, esfoladas, rachadas — a soda cáustica e a esfrega do tanque. Nenhum corte, só castigo.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (a lavadeira)',
  },
  lavrador: {
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Calos de enxada e foice; arranhões de cerca e espinheiro.',
    descricaoClose: 'Palmas grossas de enxada, arranhões de cerca de arame nas costas das mãos. A terra está sob as unhas — sempre está.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (o lavrador)',
  },
  cocheiro: {
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Calos de rédea nas palmas; contusões de arreio.',
    descricaoClose: 'Calos de rédea em faixa nas palmas, endurecidos. Arranhões de arreio nos dorsos. Trabalho, não luta.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (o cocheiro)',
  },
  jardineiro: {
    regiao: 'maos',
    sede: 'dorso_das_maos',
    marca: 'Arranhões de roseira e espinheiro; terra sob as unhas.',
    descricaoClose: 'Arranhões lineares, superficiais, paralelos — o padrão da roseira. Terra sob as unhas, sem pressa.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (o jardineiro)',
  },
  merceeiro: {
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Manchas de tinta nos dedos de anotar o fiado; calos de caixas.',
    descricaoClose: 'Manchas de tinta no indicador e no médio da mão direita — da pena do balcão. Calos de caixa nas palmas.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (o lojista)',
  },
  criada: {
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Mãos avermelhadas de esfrega; arranhões de grelha de fogão.',
    descricaoClose: 'Mãos vermelhas de quem esfrega assoalho de joelhos. Arranhões finos da grelha do fogão — trabalho, não luta.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (a criadagem)',
  },
  pescador: {
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Calos de remo e linha; mãos cheirando a peixe.',
    descricaoClose: 'Calos de remo e linha nas palmas; cortes de anzol cicatrizados nos dedos. Cheiro de peixe que não sai.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md',
  },
  // Ofícios com botas enlameadas (relevante para afogamento).
  moço_de_estrebaria: {
    regiao: 'botas',
    sede: 'canelas',
    marca: 'Botas permanentemente enlameadas de estrume e barro.',
    descricaoClose: 'Botas de quem pisa em barro e estrume todo dia. A lama é antiga e nova misturadas — nunca secam de todo.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (o estábulo)',
  },
};

// ---------------------------------------------------------------------
// Marcas situacionais (decisão 4.3, via situacional): eventos plausíveis
// recentes que qualquer habitante de vila poderia ter. O gerador sorteia
// uma por seed para o segundo inocente.
// ---------------------------------------------------------------------
export const MARCAS_SITUACIONAIS = [
  {
    id: 'arranhao_de_gato',
    regiao: 'maos',
    sede: 'dorso_das_maos',
    marca: 'Arranhões paralelos de gato.',
    descricaoClose: 'Arranhões finos, paralelos, superficiais — garra de gato, sem dúvida. Frescos.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (a vida doméstica com animais)',
  },
  {
    id: 'queda_recente',
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Escoriações de queda recente nas palmas.',
    descricaoClose: 'Escoriações nas palmas, com cascão — queda de mãos abertas. A crosta tem os dias do fim de semana.',
    proveniencia: 'docs/kb-medicina-legal/traumas.md (lesão de queda × lesão de golpe)',
  },
  {
    id: 'corte_de_cozinha',
    regiao: 'maos',
    sede: 'palmas',
    marca: 'Corte de faca de cozinha, recente.',
    descricaoClose: 'Um corte inciso no dedo indicador — a faca da cozinha, diz. Recente, com a crosta do fim de semana.',
    proveniencia: 'docs/kb-medicina-legal/traumas.md (ferida incisa acidental)',
  },
  {
    id: 'queimadura_de_lareira',
    regiao: 'antebracos',
    sede: 'antebracos',
    marca: 'Queimadura recente de brasa no antebraço.',
    descricaoClose: 'Uma queimadura em salpico no antebraço — brasa saltou da lareira, diz. A marca tem os dias do crime.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (lareiras e acidentes domésticos)',
  },
  {
    id: 'arranhao_de_cerca',
    regiao: 'antebracos',
    sede: 'antebracos',
    marca: 'Arranhão linear de cerca de arame no antebraço.',
    descricaoClose: 'Um arranhão longo, linear, no antebraço — a cerca de arame da pastagem, diz. Fresco.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (cercas e pastagens)',
  },
  {
    id: 'lama_de_chuva',
    regiao: 'botas',
    sede: 'canelas',
    marca: 'Botas enlameadas da chuva de outubro.',
    descricaoClose: 'Botas com barro seco da estrada. Outubro inglês — quem andou a pé voltou sujo.',
    proveniencia: 'docs/kb-mundo-vitoriano/vida-cotidiana.md (o clima de outubro)',
  },
];

// Tabela de profissão → id de MARCAS_INOCENTES_OFICIO. Nem toda profissão
// tem marca mapeada; sem mapeamento, o gerador usa só a via situacional.
export const PROFISSAO_PARA_MARCA = {
  ferreiro: 'ferreiro',
  carpinteiro: 'carpinteiro',
  acougueiro: 'acougueiro',
  cozinheira: 'cozinheira',
  lavadeira: 'lavadeira',
  lavrador: 'lavrador',
  cocheiro: 'cocheiro',
  jardineiro: 'jardineiro',
  merceeiro: 'merceeiro',
  criada: 'criada',
  criado: 'criada',
  pescador: 'pescador',
  moço_de_estrebaria: 'moço_de_estrebaria',
  // Ofícios de mão: caem no default ocupacional (palmas calejadas genéricas).
};

export const PROVENIENCIA_MARCAS_EXIGIVEIS = {
  decisao_4_1: 'OS §4.1 — isca por exigência infundada (paralelo às perguntas ao delegado)',
  decisao_4_2: 'OS §4.2 — a exibição concedida consta na Caderneta',
  decisao_4_3: 'OS §4.3 — ≥2 inocentes com marca honesta (1 ocupacional + 1 situacional)',
  decisao_4_4: 'OS §4.4 — vocabulário validado contra docs/kb-medicina-legal/ pelo perito-forense',
  veneno: 'docs/kb-medicina-legal/venenos.md — nenhuma marca corporal confiável no envenenador',
};
