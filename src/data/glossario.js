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
      'Articulações que resistem à flexão. Rigidez generalizada indica entre 12 e 24 horas de morte; rigidez que já cede, entre 24 e 36.',
  },
  {
    id: 'livor_mortis',
    termo: 'Livor Mortis',
    dominio: 'temporal',
    definicao:
      'Manchas violáceas formadas pelo sangue que, sem circulação, desce por gravidade às partes baixas do corpo. Surgem em 1 a 2 horas; tornam-se fixas — não esmaecem sob pressão — após cerca de 12 horas.',
    sinalObservavel:
      'Manchas vinhosas nas partes de apoio do corpo. Se não somem sob a pressão do dedo, a morte data de 12 horas ou mais.',
  },
  {
    id: 'algor_mortis',
    termo: 'Algor Mortis',
    dominio: 'temporal',
    definicao:
      'Resfriamento cadavérico: o corpo perde cerca de 1°C por hora a partir dos 37°C, até igualar a temperatura ambiente. Igualado o ambiente, o sinal nada mais informa.',
    sinalObservavel:
      'Temperatura retal medida ao termômetro. A diferença para os 37°C, em graus, aproxima as horas decorridas — com margem prudente de duas horas para mais e para menos.',
  },
  {
    id: 'ipm_convergencia',
    termo: 'Intervalo Post-Mortem (convergência)',
    dominio: 'temporal',
    definicao:
      'Nenhum sinal isolado data uma morte com segurança. A boa perícia sobrepõe os intervalos de cada sinal — rigor, livores, temperatura — e retém apenas o trecho comum a todos.',
    sinalObservavel:
      'A janela da morte é a interseção dos intervalos. Quanto mais sinais colhidos a tempo, mais estreita a janela.',
  },

  // ===================== CAUSAL =====================
  {
    id: 'petequias_cianose',
    termo: 'Petéquias e Cianose',
    dominio: 'causal',
    definicao:
      'Hemorragias puntiformes nas conjuntivas e coloração azulada da face, produzidas pela interrupção da respiração com o coração ainda em luta. Assinalam morte por asfixia, sem por si só indicar o meio.',
    sinalObservavel: 'Pontos vermelhos no branco dos olhos; face e lábios azulados.',
  },
  {
    id: 'sulco_horizontal',
    termo: 'Sulco Cervical Horizontal',
    dominio: 'causal',
    definicao:
      'Marca deixada por ligadura (corda, cinto, cordão) apertada em volta do pescoço por mãos alheias: o sulco corre em plano horizontal e uniforme. É a assinatura do estrangulamento por ligadura.',
    sinalObservavel: 'Sulco contínuo, de profundidade pareja, circundando o pescoço na horizontal.',
  },
  {
    id: 'sulco_obliquo',
    termo: 'Sulco Oblíquo Ascendente',
    dominio: 'causal',
    definicao:
      'No enforcamento, o peso do corpo suspenso puxa a ligadura para cima, em direção ao nó: o sulco sobe oblíquo e se interrompe. Distingue a suspensão — frequentemente voluntária — do estrangelamento por terceiros.',
    sinalObservavel: 'Sulco que ascende em diagonal rumo à nuca ou à orelha, mais fundo no lado oposto ao nó.',
  },
  {
    id: 'reacao_vital',
    termo: 'Reação Vital',
    dominio: 'causal',
    definicao:
      'Escoriações e equimoses só se formam em tecido vivo. Sua presença em torno de um ferimento prova que a vítima estava viva quando o recebeu; sua ausência denuncia lesão infligida após a morte.',
    sinalObservavel: 'Vermelhidão, inchaço e sangue infiltrado nas bordas de uma lesão.',
  },
  {
    id: 'odor_amendoas',
    termo: 'Odor de Amêndoas Amargas',
    dominio: 'causal',
    definicao: 'Exalação característica do envenenamento por cianeto, perceptível na boca e nas vísceras do cadáver.',
    sinalObservavel: 'Cheiro de amêndoas amargas ao exame da boca.',
  },
  {
    id: 'odor_alho',
    termo: 'Odor Aliáceo',
    dominio: 'causal',
    definicao: 'Hálito cadavérico com cheiro de alho, próprio do envenenamento por arsênico — o veneno predileto dos pacientes.',
    sinalObservavel: 'Cheiro de alho ao exame da boca e do conteúdo gástrico.',
  },

  // ===================== AMBIENTAL =====================
  {
    id: 'cena_encenada',
    termo: 'Encenação de Cena',
    dominio: 'ambiental',
    definicao:
      'Arranjo deliberado da cena para contar uma história falsa: desordem que poupa os valores, arrombamentos sem pressa, relógios quebrados em hora conveniente. A encenação se trai quando sua cronologia contradiz a perícia do corpo.',
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
    sinalObservavel: 'Mãos e antebraços feridos — ou intactos, o que também fala.',
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
      'Inocentes mentem — por vergonha, medo ou culpa alheia ao crime. A mentira do assassino choca-se com a evidência física; a do inocente, apenas com a moral. Nervosismo não é prova.',
    sinalObservavel: 'Depoimento falso cuja falsidade não o coloca na cena na hora da morte.',
  },
  {
    id: 'motivo_oportunidade',
    termo: 'Motivo e Oportunidade',
    dominio: 'comportamental',
    definicao:
      'Motivo sem oportunidade não é prova: odiar o morto não aproxima ninguém do pescoço dele. A acusação exige móbil, ocasião e materialidade reunidos.',
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
      'Sob a lente, cânhamo, lã, linho e algodão distinguem-se pela torção e pelo calibre. Fibras de corda incrustadas num sulco cervical identificam o instrumento; as mesmas fibras na roupa de alguém, a mão que o segurou.',
    sinalObservavel: 'Filamentos comparáveis à lente: mesma matéria, mesma torção, mesma origem.',
  },
];

export function verbetesPorDominio(dominio) {
  return GLOSSARIO.filter((v) => v.dominio === dominio);
}
