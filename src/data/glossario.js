// =====================================================================
// Glossário Forense de época (§9 e §15 do contexto).
// Referência que permite ao jogador interpretar os dados brutos.
// Cada verbete: termo, domínio, definição tecnicamente precisa e o
// sinal observável correspondente. Consulta gratuita (custo zero).
// =====================================================================

export const DOMINIOS_GLOSSARIO = [
  { id: 'temporal', rotulo: 'Temporal — Quando' },
  { id: 'causal', rotulo: 'Causal — Como' },
  { id: 'ambiental', rotulo: 'Ambiental — A Cena' },
  { id: 'comportamental', rotulo: 'Comportamental — As Pessoas' },
  { id: 'vestigio', rotulo: 'Vestígios — A Presença' },
];

export const GLOSSARIO = [
  // ===================== TEMPORAL =====================
  {
    id: 'rigor_mortis',
    termo: 'Rigor Mortis',
    dominio: 'temporal',
    definicao:
      'Enrijecimento muscular cadavérico. Surge de 2 a 4 horas após a morte, em sequência céfalo-caudal (mandíbula primeiro, membros por último); atinge o pleno por volta de 12 horas; desfaz-se, na mesma ordem, entre 24 e 36 horas.',
    sinalObservavel:
      'O corpo duro, os membros que não dobram: morte entre 12 e 24 horas. Quando a dureza já começa a ceder (o maxilar dobra, os joelhos ainda não), entre 24 e 36.',
  },
  {
    id: 'livor_mortis',
    termo: 'Livor Mortis',
    dominio: 'temporal',
    definicao:
      'Manchas violáceas formadas pelo sangue que, sem circulação, desce por gravidade às partes baixas do corpo. Surgem em 1 a 2 horas; tornam-se fixas — não esmaecem sob pressão — após cerca de 12 horas.',
    sinalObservavel:
      'Manchas arroxeadas nas partes de baixo do corpo. Se não empalidecem quando se aperta com o dedo, a morte data de 12 horas ou mais.',
  },
  {
    id: 'algor_mortis',
    termo: 'Algor Mortis',
    dominio: 'temporal',
    definicao:
      'Resfriamento cadavérico: o corpo perde cerca de 1°C por hora a partir dos 37°C, até igualar a temperatura ambiente. Igualado o ambiente, o sinal nada mais informa.',
    sinalObservavel:
      'O corpo ainda morno ao toque, medido ao termômetro. A diferença para os 37°C, em graus, aproxima as horas decorridas — com margem prudente de duas horas para mais e para menos.',
  },
  {
    id: 'ipm_convergencia',
    termo: 'Intervalo Post-Mortem (convergência)',
    dominio: 'temporal',
    definicao:
      'Nenhum sinal isolado data uma morte com segurança. Cada indicador — rigor, livores, temperatura, última vez visto com vida — admite uma faixa de horas. A boa perícia sobrepõe essas faixas e retém apenas o trecho comum a todas: a interseção.',
    sinalObservavel:
      'A janela da morte é a interseção das faixas. Cada sinal a mais, colhido a tempo, estreita a janela; um sinal só a deixa larga. Sinais já degradados (rigor desfeito, corpo frio como o ambiente) nada acrescentam.',
  },

  // ===================== CAUSAL =====================
  // O método discriminante: um sinal de FAMÍLIA (petéquias → asfixia) diz
  // o gênero da morte; um sinal de ASSINATURA (o tipo de sulco, o odor, o
  // tipo de ferida) crava a espécie e descarta as parecidas.
  {
    id: 'petequias_cianose',
    termo: 'Petéquias e Cianose',
    dominio: 'causal',
    definicao:
      'Hemorragias puntiformes nas conjuntivas e coloração azulada da face, produzidas pela interrupção da respiração com o coração ainda em luta. Assinalam a família da asfixia — sem, por si só, dizer o meio (ligadura, enforcamento, esganadura, sufocação ou afogamento).',
    sinalObservavel: 'Pontinhos de sangue no branco dos olhos; face e lábios azulados. Excluem veneno e trauma; não distinguem entre as asfixias.',
  },
  {
    id: 'sulco_horizontal',
    termo: 'Sulco Cervical Horizontal',
    dominio: 'causal',
    definicao:
      'Marca deixada por ligadura (corda, cinto, cordão) apertada em volta do pescoço por mãos alheias: o sulco corre em plano horizontal e uniforme. É a assinatura do estrangulamento por ligadura.',
    sinalObservavel: 'Marca contínua e funda, de profundidade constante, dando a volta no pescoço na horizontal, sem subir em diagonal. Sua presença afasta o enforcamento e a esganadura.',
  },
  {
    id: 'sulco_obliquo',
    termo: 'Sulco Oblíquo Ascendente',
    dominio: 'causal',
    definicao:
      'No enforcamento, o peso do corpo suspenso puxa a ligadura para cima, em direção ao nó: o sulco sobe oblíquo e se interrompe. Distingue a suspensão — frequentemente voluntária — do estrangulamento por terceiros.',
    sinalObservavel: 'Sulco que ascende em diagonal rumo à nuca ou à orelha, mais fundo no lado oposto ao nó.',
  },
  {
    id: 'esganadura',
    termo: 'Esganadura (Estrangulamento Manual)',
    dominio: 'causal',
    definicao:
      'Pressão direta das mãos sobre o pescoço, sem ligadura. Deixa equimoses arredondadas dos polegares e escoriações em meia-lua das unhas, mas nenhum sulco contínuo.',
    sinalObservavel: 'Dedadas e marcas de unha no pescoço, sem o sulco uniforme que uma corda deixaria.',
  },
  {
    id: 'sufocacao',
    termo: 'Sufocação',
    dominio: 'causal',
    definicao:
      'Obstrução mecânica de boca e narinas — por mão, pano ou travesseiro. Asfixia sem marca no pescoço; por vezes deixa escoriações ao redor da boca ou fibras nos lábios.',
    sinalObservavel: 'Pequenas escoriações em torno da boca e do nariz; ausência de sulco cervical.',
  },
  {
    id: 'afogamento',
    termo: 'Afogamento',
    dominio: 'causal',
    definicao:
      'Asfixia por submersão. A água aspirada com esforço respiratório produz espuma fina e persistente nas vias aéreas e distende os pulmões.',
    sinalObservavel: 'Cogumelo de espuma na boca e narinas; pulmões volumosos e encharcados.',
  },
  {
    id: 'reacao_vital',
    termo: 'Reação Vital',
    dominio: 'causal',
    definicao:
      'Escoriações e equimoses só se formam em tecido vivo. Sua presença em torno de um ferimento prova que a vítima estava viva quando o recebeu; sua ausência indica lesão infligida após a morte. Nada informa sobre a causa da morte; atesta somente que a lesão é perimortem.',
    sinalObservavel: 'Vermelhidão, inchaço e sangue infiltrado nas bordas de uma lesão.',
  },
  {
    id: 'odor_amendoas',
    termo: 'Odor de Amêndoas Amargas',
    dominio: 'causal',
    definicao: 'Exalação característica do envenenamento por cianeto, perceptível na boca e nas vísceras do cadáver. Veneno de ação rápida.',
    sinalObservavel: 'Cheiro de amêndoas amargas ao exame da boca. Afasta as asfixias e os traumas.',
  },
  {
    id: 'odor_alho',
    termo: 'Odor Aliáceo',
    dominio: 'causal',
    definicao: 'Hálito cadavérico com cheiro de alho, próprio do envenenamento por arsênico — veneno de ação lenta, frequente nos envenenamentos domésticos.',
    sinalObservavel: 'Cheiro de alho ao exame da boca e do conteúdo gástrico.',
  },
  {
    id: 'trauma_contuso',
    termo: 'Trauma Contuso',
    dominio: 'causal',
    definicao:
      'Golpe por objeto rombo: fraturas, afundamentos de crânio e contusões com bordas irregulares. Distingue-se do corte pela ausência de margens nítidas.',
    sinalObservavel: 'Afundamento ósseo, laceração de bordas irregulares, hematomas profundos.',
  },
  {
    id: 'ferida_arma_branca',
    termo: 'Ferida por Arma Branca',
    dominio: 'causal',
    definicao:
      'Lesão por instrumento cortante ou perfurante: bordas nítidas e regulares. A profundidade costuma exceder o comprimento da abertura nas perfurações.',
    sinalObservavel: 'Cortes de margens limpas e regulares; ferimentos perfurantes profundos.',
  },
  {
    id: 'arma_de_fogo',
    termo: 'Ferida por Arma de Fogo',
    dominio: 'causal',
    definicao:
      'Lesão por projétil: orifício de entrada arredondado, por vezes com orla de contusão e tatuagem de pólvora à queima-roupa, e eventual orifício de saída maior.',
    sinalObservavel: 'Orifício de entrada com orla escurecida; resíduos de pólvora na pele quando o tiro foi próximo.',
  },

  // ===================== AMBIENTAL =====================
  {
    id: 'cena_encenada',
    termo: 'Encenação de Cena',
    dominio: 'ambiental',
    definicao:
      'Arranjo deliberado da cena para contar uma história falsa: desordem que poupa os valores, arrombamentos superficiais, relógios parados numa hora que não coincide com a do óbito. Reconhece-se quando a cronologia sugerida pela cena contradiz a perícia do corpo.',
    sinalObservavel: 'Elementos da cena que apontam hora ou móbil incompatíveis com os sinais cadavéricos.',
  },
  {
    id: 'livores_incompativeis',
    termo: 'Livores Incompatíveis com a Posição',
    dominio: 'ambiental',
    definicao:
      'Se as manchas hipostáticas ocupam partes do corpo que não estão apoiadas, o cadáver foi movido depois que elas se fixaram.',
    sinalObservavel: 'Manchas fixas no dorso de um corpo encontrado de bruços, ou vice-versa.',
  },
  {
    id: 'marcas_arrasto',
    termo: 'Marcas de Arrasto',
    dominio: 'ambiental',
    definicao: 'Sulcos no assoalho, tapetes repuxados, poeira varrida pelo peso de um corpo deslocado da posição original.',
    sinalObservavel: 'Trilhas paralelas no chão; calcanhares do cadáver sujos ou escoriados.',
  },
  {
    id: 'espasmo_cadaverico',
    termo: 'Espasmo Cadavérico',
    dominio: 'ambiental',
    definicao:
      'Contração instantânea e definitiva da mão no momento exato da morte violenta: o cadáver retém firmemente o que segurava. Não pode ser forjado depois — dedos arrumados post-mortem seguram frouxo.',
    sinalObservavel: 'Objeto preso com força na mão do morto desde o instante da morte.',
  },
  {
    id: 'conteudo_estomacal',
    termo: 'Conteúdo Estomacal',
    dominio: 'ambiental',
    definicao:
      'A digestão cessa com a morte. Conhecida a hora da última refeição, o grau de digestão do que se acha no estômago baliza a hora do óbito.',
    sinalObservavel: 'Alimento pouco digerido: morte próxima da refeição; estômago vazio: horas depois dela.',
  },
  {
    id: 'lesoes_defesa',
    termo: 'Lesões de Defesa',
    dominio: 'ambiental',
    definicao:
      'Cortes e equimoses nas mãos e antebraços de quem tentou aparar o golpe. Sua ausência sugere ataque súbito, pelas costas, ou vítima incapaz de reagir.',
    sinalObservavel: 'Cortes e equimoses nas mãos e antebraços; a ausência deles, em vítima capaz de reagir, também se anota.',
  },

  // ===================== COMPORTAMENTAL =====================
  {
    id: 'declaracao_paradeiro',
    termo: 'Declaração de Paradeiro (Álibi)',
    dominio: 'comportamental',
    definicao:
      'O que cada um afirma sobre onde esteve. Vale o que valem suas testemunhas — e só exclui a autoria se cobrir a verdadeira hora da morte, não a hora que alguém quis fazer crer.',
    sinalObservavel: 'Faixa horária declarada, a cotejar com a janela da morte estabelecida pela perícia.',
  },
  {
    id: 'mentira_inocente',
    termo: 'A Mentira do Inocente',
    dominio: 'comportamental',
    definicao:
      'Inocentes mentem por vergonha, medo ou culpa alheia ao crime. A mentira do assassino contradiz a evidência física; a do inocente contradiz apenas a moral. O nervosismo ou a contradição de um depoimento, por si sós, não estabelecem autoria.',
    sinalObservavel: 'Depoimento falso cuja falsidade não o coloca na cena na hora da morte.',
  },
  {
    id: 'motivo_oportunidade',
    termo: 'Motivo e Oportunidade',
    dominio: 'comportamental',
    definicao:
      'O motivo, sem a oportunidade, não estabelece autoria: odiar a vítima não aproxima ninguém materialmente do crime. A acusação exige móbil, ocasião e materialidade reunidos.',
    sinalObservavel: 'Suspeito com razões públicas de rancor, porém com paradeiro firmado fora da janela da morte.',
  },

  // ===================== VESTÍGIO =====================
  {
    id: 'transferencia_vestigios',
    termo: 'Transferência de Vestígios',
    dominio: 'vestigio',
    definicao:
      'Todo contato deixa marca: fibras, fios e poeiras passam do instrumento a quem o maneja e da cena a quem a pisa. O vestígio liga pessoa, instrumento e lugar.',
    sinalObservavel: 'Material idêntico achado em dois pontos que se pretendem estranhos um ao outro.',
  },
  {
    id: 'fibras_texteis',
    termo: 'Fibras Têxteis e de Cordoaria',
    dominio: 'vestigio',
    definicao:
      'Sob a lente, cânhamo, lã, linho e algodão distinguem-se pela torção e pelo calibre. Fibras de corda incrustadas num sulco cervical identificam o instrumento; as mesmas fibras na roupa de alguém indicam contato com material da mesma espécie, não com aquela peça em particular.',
    sinalObservavel: 'Filamentos comparáveis à lente: mesma matéria, mesma torção — compatível, não exclusivo.',
  },
];

export function verbetesPorDominio(dominio) {
  return GLOSSARIO.filter((v) => v.dominio === dominio);
}

export function obterVerbete(id) {
  return GLOSSARIO.find((v) => v.id === id) || null;
}

// Ponte carta → verbete (Q9): uma observação registrada aponta o verbete
// que ensina a lê-la, quando existe correspondência de tag (subDominio ou
// sinal com o mesmo id do verbete). Apresentação apenas — nenhuma regra lê.
export function verbeteParaCarta(tagsOcultas) {
  const t = tagsOcultas || {};
  return GLOSSARIO.find((v) => v.id === t.subDominio || v.id === t.sinal) || null;
}
