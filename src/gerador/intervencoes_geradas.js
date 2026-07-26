// =====================================================================
// AS INTERVENÇÕES DA NOITE, GERADAS (OS-R9 · Fase 3) — o item de maior
// rendimento da fila, e o que destrava o fim de caso de trinta casos.
//
// Módulo GERADOR-FACING: o runtime jamais o importa. O que ele produz é
// DADO — os campos `intervencoes` e `cenaDaNoite` do pacote —, e quem os
// consome é `src/logic/reconstituicao.js`, fora do motor.
//
// ---------------------------------------------------------------------
// O QUE É UM GESTO, E O QUE NÃO É
//
// O catálogo do tutorial define a espécie numa linha, e ela vale aqui sem
// emenda: **não é a lista do que aconteceu; é a lista do que se fez para
// que o que aconteceu não se visse.** A distinção elimina de saída a maior
// parte do `RegistroDoCrime`: emboscada, golpe, queda, agarrão e mobília
// derrubada são a LUTA, e a luta não é arrumação de nada. Ninguém derruba
// uma cômoda para que a noite se leia de outra maneira.
//
// O que sobra são os atos POSTERIORES — a peça que passou pela água, o
// corpo que mudou de sítio, o mostrador recuado, a boca comprada, o recado
// que chamou a vítima. Cada um deles já deixa no caso a sua própria carta;
// o gesto é o outro lado dessa carta, e é por isso que o catálogo se deriva
// das CARTAS e não dos eventos da batalha.
//
// ---------------------------------------------------------------------
// AS QUATRO REGRAS DO CATÁLOGO, HERDADAS DO TUTORIAL SEM DESCONTO
//
//   • `exige` são TODAS as cartas que a mesa precisa de ter para o gesto se
//     desfazer. Faltando uma, o gesto não entra — nem encoberto, nem
//     insinuado (martelo (c) da R7);
//   • A PROSA DE UM GESTO NÃO AFIRMA O QUE OUTRO GESTO PROVA. Cada texto
//     fica dentro do que as suas próprias cartas sustentam;
//   • NENHUM GESTO TEM AUTOR. A prosa diz a mão, nunca o nome — e como não
//     há nome, a G3 vale por construção: não há por onde o texto ramificar
//     no bit `culpado`;
//   • A `hora` É AUTOSSUFICIENTE e nunca afirma relógio que as cartas não
//     dão. Aqui ela diz o CÔMODO e a FAIXA, que é o que o caso gerado sabe;
//     marcador relativo («depois disso») fica proibido por construção,
//     porque a cena é uma lista filtrada e o gesto de cima pode faltar.
//
// ---------------------------------------------------------------------
// O PISO É GATE, NÃO QUOTA (martelo (b) do utilizador, 26/07/2026)
//
// Teto nove, como o tutorial; piso três. E o piso não se preenche: um caso
// que só reúna dois gestos NÃO recebe catálogo, e o fim de caso dele vai
// direto ao monólogo, exatamente como ia antes desta OS. Inventar um
// terceiro gesto para alcançar o piso seria pôr na cena uma arrumação que a
// simulação não fez — o que a G9 proíbe pela raiz.
//
// E a medida diz que isto não é hipótese: oito dos 31 casos têm noite sem
// arrumação nenhuma. Não é defeito do gerador; é que naquelas noites
// ninguém arrumou coisa alguma depois. A cena existe onde houve o que
// desfazer.
// =====================================================================

import { hashString } from '../logic/hash.js';
import { formasDoLugar } from './dialogos_gerados.js';

// O cômodo e o prédio entram na prosa como SINTAGMA DE LUGAR, e não como
// rótulo cru: «cozinha» tem de virar «na cozinha» e «da cozinha», com o
// artigo certo. Sem isto sai «No cozinha», e o gerador denuncia-se numa
// preposição. O gênero lê-se da terminação, com as exceções que o
// vocabulário do gerador de facto usa.
const FEMININOS_IRREGULARES = new Set(['sala de estar', 'saleta', 'nave']);
function generoDoComodo(rotulo) {
  const r = String(rotulo || '').toLowerCase();
  if (FEMININOS_IRREGULARES.has(r)) return 'f';
  return /a(s)?$/.test(r.split(' ')[0]) ? 'f' : 'm';
}
function sintagmasDoComodo(rotulo) {
  if (!rotulo) return null;
  const f = generoDoComodo(rotulo) === 'f';
  return {
    em: `${f ? 'na' : 'no'} ${rotulo}`,
    de: `${f ? 'da' : 'do'} ${rotulo}`,
    o: `${f ? 'a' : 'o'} ${rotulo}`,
    meu: f ? 'minha' : 'meu',
  };
}

// Namespace de sal reservado no cabeçalho da OS-R9.
const SAL = 'gerador:r9:intervencao';

export const TETO_GESTOS = 9;
export const PISO_GESTOS = 3;

const FAIXA_NA_NOITE = {
  noite: 'na noite de sexta',
  madrugada: 'na madrugada de sábado',
  dia: 'na tarde de sexta',
};

// Sem artigo: quem a usa é que decide o determinante («a mesma noite de
// sexta», «naquela madrugada de sábado»).
const FAIXA_NUA = {
  noite: 'noite de sexta',
  madrugada: 'madrugada de sábado',
  dia: 'tarde de sexta',
};

// Uma variante por gesto, escolhida pelo hash salgado da seed. Duas saídas
// por gesto bastam: a cena mostra cada gesto UMA vez por partida, e o
// jogador não tem com que comparar — três seriam prosa escrita para
// ninguém ler. (A mesma conta que o tutorial faz com a alfinetada.)
function variante(pool, chave) {
  return pool[hashString(`${SAL}|${chave}`) % pool.length];
}

/**
 * O catálogo de gestos de um caso gerado, na ordem em que ocupam a noite.
 *
 * @param {object} p
 * @param {object} p.bruto o caso bruto (crime, escolha, mundo)
 * @param {Array<object>} p.cartas catálogo já realizado
 * @param {string} p.comodo rótulo do cômodo do crime, em voz de prosa
 * @param {string} p.predio rótulo do prédio do crime
 * @returns {Array<object>} de 0 a TETO_GESTOS gestos; [] quando não alcança
 *          o piso (e aí o caso não tem reconstituição)
 */
export function derivarIntervencoes({ bruto, cartas, comodo, predio }) {
  const { crime, escolha } = bruto;
  const ids = new Set(cartas.map((c) => c.id));
  const tem = (...req) => req.every((id) => ids.has(id));
  const faixa = escolha.faixa;
  const naNoite = FAIXA_NA_NOITE[faixa] || FAIXA_NA_NOITE.noite;
  const noiteNua = FAIXA_NUA[faixa] || FAIXA_NUA.noite;
  const lugar = sintagmasDoComodo(comodo);
  const alibiDoReu = `gen_alibi_${crime.assassinoId}`;
  const gestos = [];

  // 1. A HORA DADA. O paradeiro declarado ocupa a hora que declara, e é
  // contra a última vez em que se viu a vítima viva que ele se mede. As
  // duas cartas juntas, e nunca só o álibi: um paradeiro sozinho não é
  // arrumação nenhuma — toda gente dá o seu.
  if (tem(alibiDoReu, 'gen_visto_vivo')) {
    gestos.push({
      id: 'hora_declarada',
      hora: `À hora que se declarou, ${naNoite}`,
      rubrica: 'o paradeiro dado, contra a hora em que a vítima ainda falava',
      exige: [alibiDoReu, 'gen_visto_vivo'],
      prosa: variante(
        [
          `Uma hora e um lugar entram no termo do guarda, ditados de uma vez e sem que se peçam duas. A mesma ${noiteNua} tem outra hora escrita noutro papel, e nessa a vítima ainda está em pé e a falar com quem a cumprimenta.`,
          `O paradeiro é dado inteiro, com a hora de chegar e a de sair, e fica lavrado. Noutro assento da mesma ${noiteNua} há alguém a trocar palavra com a vítima, e essa hora não cabe dentro da primeira.`,
        ],
        `${bruto.seed}|hora_declarada`
      ),
    });
  }

  // 2. O RECADO. O engodo tira a vítima de onde ela estaria. Ocupa a hora
  // antes do fato, e é o primeiro gesto da noite quando existe.
  if (tem('gen_engodo')) {
    gestos.unshift({
      id: 'recado_mandado',
      hora: `Antes do fato, ${naNoite}`,
      rubrica: 'o recado que marcou o lugar e a hora',
      exige: ['gen_engodo'],
      prosa: variante(
        [
          `Um recado corre e marca lugar e hora, e quem o pediu não deixa nome. A vítima vai onde o papel diz, à hora que o papel diz, e é ali que a acham.`,
          `O chamado chega por boca de terceiro e traz lugar e hora escritos. Quem o mandou fica fora da luz. A vítima cumpre o encontro, e do encontro não volta.`,
        ],
        `${bruto.seed}|recado`
      ),
    });
  }

  // 3. O MOSTRADOR. A peça de hora forjada — o gesto que empresta ao caso o
  // nome do tutorial. Exige a peça E o corpo, porque é o corpo que a
  // desmente; a peça sozinha não é arrumação provada, é só um relógio.
  if (tem('gen_hora_forjada', 'gen_rigor')) {
    gestos.push({
      id: 'hora_forjada',
      hora: `${lugar ? lugar.em.charAt(0).toUpperCase() + lugar.em.slice(1) : 'Na sala'}, ${naNoite}`,
      rubrica: 'a hora posta a marcar o que não foi',
      exige: ['gen_hora_forjada', 'gen_rigor'],
      prosa: variante(
        [
          'Uma hora fica marcada onde toda gente há de a ler primeiro, e fica marcada com firmeza. O corpo, esse, conta a sua por conta própria, e as duas contas não se encontram em ponto nenhum.',
          'A hora é posta de modo a ser a primeira coisa que se lê ao entrar. O que o frio e a rigidez do corpo dão não bate com ela, e o corpo não se ajusta a papel nenhum.',
        ],
        `${bruto.seed}|hora_forjada`
      ),
    });
  }

  // 4. O CORPO MUDADO. As manchas assentam onde o corpo esteve, e não onde
  // ele foi achado: é o livor que desfaz este gesto, e só ele.
  if (crime.cenaEncenada && tem('gen_livores')) {
    gestos.push({
      id: 'corpo_mudado',
      hora: `${lugar ? `${lugar.de.charAt(0).toUpperCase() + lugar.de.slice(1)} para onde foi achado` : 'De onde caiu para onde foi achado'}`,
      rubrica: 'o corpo posto num sítio que não é o da queda',
      exige: ['gen_livores'],
      prosa: variante(
        [
          'O corpo é levado do sítio em que ficou para o sítio em que há de ser encontrado, e ali é composto. As manchas de baixo assentaram antes da mudança, e assentaram do lado que agora fica para cima.',
          'De um sítio para outro, e no segundo fica arrumado como quem cai fica. O sangue já se tinha deitado no fundo do primeiro, e ficou onde se deitou.',
        ],
        `${bruto.seed}|corpo_mudado`
      ),
    });
  }

  // 5. A PEÇA LAVADA. O instrumento que passa pela água e volta ao lugar —
  // ou que não volta. Duas classes distintas, dois gestos distintos.
  const vInstrumento = crime.vestigios.find((v) =>
    ['instrumento_guardado_umido', 'instrumento_faltando'].includes(v.classe)
  );
  if (vInstrumento && tem('gen_instrumento')) {
    const guardado = vInstrumento.classe === 'instrumento_guardado_umido';
    gestos.push({
      id: guardado ? 'peca_lavada' : 'peca_levada',
      hora: `Entre os pertences, depois do fato`,
      rubrica: guardado ? 'a peça lavada e recolhida ao lugar dela' : 'a peça que saiu com quem saiu',
      exige: ['gen_instrumento'],
      prosa: guardado
        ? variante(
            [
              'Uma peça passa pela água e volta ao lugar onde costuma estar, entre as outras do mesmo uso. A água tira o que está à vista e não entra na junta; o que a junta guarda fica lá, e a umidade demora a sair dali.',
              'A peça é lavada por alto e reposta no sítio de sempre, no meio das companheiras. A crosta sai; o que se meteu por baixo do encaixe não sai, e a junta continua úmida quando já devia estar seca.',
            ],
            `${bruto.seed}|peca_lavada`
          )
        : variante(
            [
              'Uma peça deixa de estar onde sempre esteve, e o vão dela fica aberto entre as outras. Nada mais falta na fileira, e o pó do tampo guarda o contorno do que se tirou.',
              'Do conjunto sai uma peça só, e sai inteira. As vizinhas ficam na ordem em que estavam, e o lugar vazio tem o feitio exato da que se levou.',
            ],
            `${bruto.seed}|peca_levada`
          ),
    });
  }

  // 6. A SALA RECOMPOSTA. A peça posta de volta no lugar — mas de volta
  // pelo lado errado, que é o que a denuncia.
  if (tem('gen_peca_deslocada')) {
    gestos.push({
      id: 'sala_recomposta',
      hora: `${lugar ? lugar.em.charAt(0).toUpperCase() + lugar.em.slice(1) : 'Na sala'}, antes de sair`,
      rubrica: 'a peça reposta no lugar, e reposta ao contrário',
      exige: ['gen_peca_deslocada'],
      prosa: variante(
        [
          'O que tinha ido ao chão volta ao lugar e fica de pé como estava. Volta virado de outro lado: a face que dava para a parede é a que agora dá para a sala.',
          'A peça é endireitada e reposta no sítio. O sítio é o mesmo; a frente dela não é, e a marca que o pé deixou no tapete ficou a um palmo de onde ela agora assenta.',
        ],
        `${bruto.seed}|sala_recomposta`
      ),
    });
  }

  // 7. A SUPERFÍCIE LIMPA fora de hora.
  if (tem('gen_peca_limpa')) {
    gestos.push({
      id: 'superficie_lavada',
      hora: `${lugar ? lugar.em.charAt(0).toUpperCase() + lugar.em.slice(1) : 'Na sala'}, antes de sair`,
      rubrica: 'a superfície esfregada, e só ela',
      exige: ['gen_peca_limpa'],
      prosa: variante(
        [
          'Uma superfície é esfregada até ficar mais limpa do que as vizinhas, e só ela. À roda, a poeira de dias continua onde estava, e a linha entre as duas coisas é reta.',
          'Passa-se pano numa peça só, com força, e o resto do cômodo fica como o cômodo estava. A madeira dali ficou clara de um modo que o uso não deixa.',
        ],
        `${bruto.seed}|superficie_lavada`
      ),
    });
  }

  // 8. O VESTÍGIO APAGADO pela interferência — o gesto de DEPOIS do perito
  // chegar, e o único do catálogo que ocorre com o inquérito já aberto.
  const cartaLimpeza = cartas.find((c) => c.id.endsWith('_limpeza'));
  if (cartaLimpeza) {
    gestos.push({
      id: 'vestigio_apagado',
      hora: 'Com o inquérito já aberto',
      rubrica: 'o rastro apagado depois de o perito o ter perguntado em público',
      exige: [cartaLimpeza.id],
      prosa: variante(
        [
          'O que estava no chão deixa de estar, e deixa de estar entre uma visita e outra. Fica no lugar dele uma faixa de assoalho de cor diferente do assoalho.',
          'Entre a primeira vez em que se olhou aquele canto e a segunda, o canto mudou. O que se tirou de lá levou consigo a camada de cima da madeira.',
        ],
        `${bruto.seed}|vestigio_apagado`
      ),
    });
  }

  // 9. A BOCA COMPRADA e 10. A BOCA FECHADA. As duas arrumações que se
  // fazem em gente, e não em coisa. Vêm por último porque ocupam os dias
  // seguintes, como a retratação do tutorial.
  const cartaRetratacao = cartas.find((c) => c.id.endsWith('_retratacao'));
  const cartaDividas = cartas.find((c) => c.id.endsWith('_dividas'));
  if (cartaRetratacao && cartaDividas) {
    gestos.push({
      id: 'boca_comprada',
      hora: 'Nos dias seguintes, na vizinhança',
      rubrica: 'o depoimento trocado por outro, e a caderneta quitada na mesma semana',
      exige: [cartaRetratacao.id, cartaDividas.id],
      prosa: variante(
        [
          'Um depoimento já tomado é contado outra vez, e da segunda vez conta outra coisa. Na mesma semana, uma caderneta de fiado que se arrastava há meses aparece quitada de uma assentada.',
          'A versão muda entre uma tomada e a seguinte, e muda inteira. Pela mesma altura, dívidas de fiado que vinham de trás ficam pagas todas no mesmo dia.',
        ],
        `${bruto.seed}|boca_comprada`
      ),
    });
  }
  const cartaRecusa = cartas.find((c) => c.id.endsWith('_recusa'));
  if (cartaRecusa) {
    gestos.push({
      id: 'boca_fechada',
      hora: 'Nos dias seguintes, na vizinhança',
      rubrica: 'a boca que se fechou depois das perguntas feitas em público',
      exige: [cartaRecusa.id],
      prosa: variante(
        [
          'Quem tinha contado o que viu deixa de contar, e deixa de contar a partir de um dia certo. O silêncio tem data, e a data é a das perguntas feitas à porta aberta.',
          'A porta que se abria à primeira batida passa a não se abrir. Antes daquela semana falava-se; depois dela, não, e ninguém explica o que mudou no meio.',
        ],
        `${bruto.seed}|boca_fechada`
      ),
    });
  }

  // Teto nove (o do tutorial), e piso três como GATE. Abaixo do piso o caso
  // não tem catálogo, e a reconstituição dele não existe.
  const catalogo = gestos.slice(0, TETO_GESTOS);
  return catalogo.length >= PISO_GESTOS ? catalogo : [];
}

/**
 * O texto que situa a cena da noite de um caso gerado — o que o tutorial
 * declara em `CENA_DA_NOITE_TUTORIAL`, e que até esta OS vivia cravado
 * dentro de `src/logic/reconstituicao.js`.
 *
 * A geografia sai do caso: o prédio onde o crime foi, e o cômodo. Nenhuma
 * frase aqui nomeia relojoaria, balcão nem bancada — era esse o vazamento.
 */
export function derivarCenaDaNoite({ bruto, comodo, predio }) {
  // O rótulo do prédio é NOME PRÓPRIO do caso («Cottage nº 3», «O moinho»),
  // e entra com o artigo que `formasDoLugar` já resolve para o resto do
  // gerador. Baixar a caixa à força daria «em cottage nº 3».
  const formas = predio ? formasDoLugar(predio) : null;
  const dentro = sintagmasDoComodo(comodo);
  return {
    // O domingo à noite é do desenho da D24, e vale para todo caso: a cena
    // corre depois de a acusação estar selada, e antes do monólogo.
    subtitulo: `Domingo à noite, ${formas ? formas.em : 'no lugar do fato'}`,
    aberturas: [
      `Domingo à noite. ${formas ? `A porta ficou aberta para mim ${formas.em}` : 'A porta ficou aberta para mim'} e o lume está apagado; o lampião de mão vai à frente. Sobre a mesa, em fila, o que trouxe comigo.`,
      `Domingo, passada a hora da ceia. O homem de guarda ficou à porta da rua, e ${dentro ? `${dentro.o} é ${dentro.meu}` : 'a sala é minha'} por uma hora. Refaço aquela noite com o que a mesa sustenta, e paro onde ela parar.`,
      'Domingo à noite, e a vila dorme cedo. Ando de um lado ao outro com o lampião baixo, e não há ninguém a quem perguntar. A noite volta em pedaços, e só nos pedaços que colhi.',
    ],
    fechos: {
      nenhuma:
        'Apago o lampião. Percorri tudo e ficou como estava: nada do que trouxe moveu coisa alguma aqui dentro. Saio como entrei.',
      poucas: 'Ponho o lampião de lado. O lugar cedeu nos pontos em que eu tinha com que o pressionar, e ficou inteiro no resto.',
      varias: 'Ponho o lampião de lado. A noite refez-se diante de mim na ordem em que foi feita, e parou onde a minha mesa parou.',
      quase_toda:
        'Ponho o lampião de lado e fico olhando o lugar. A noite voltou diante de mim uma arrumação de cada vez, e nenhuma delas se desfez sem papel meu por baixo.',
    },
  };
}
