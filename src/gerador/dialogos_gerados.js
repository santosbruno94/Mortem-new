// =====================================================================
// DERIVADOR DE ÁRVORES DE DIÁLOGO — a OS "árvore de diálogo procedural"
// (spec normativa em docs/os-arvore-dialogo-procedural.md §8; voz derivada
// pela regra do guia de estilo §8.4).
//
// Módulo GERADOR-FACING (ilha de build time; o runtime JAMAIS o importa —
// guarda no qa.mjs). Quem o consome é montarPacoteGerado, que grava as
// árvores prontas no campo `dialogos` do pacote e as cartas de álibi no
// catálogo `cartas`. Zero LLM, zero sorteio fora de hashString salgado
// (`${seed}|dialogo|${suspeitoId}|…`): mesma seed → mesma árvore, byte a
// byte (guarda de replay no qa.mjs).
//
// O QUE SAI, por suspeito do pacote:
//   • uma árvore EMBUTIDA no nó onde a pessoa é interrogada (OS da vila
//     na mesa: origemLocalidade = o nó da MORADIA do suspeito — o perito
//     bate à porta com o constable, como no caso-escola; 'delegacia' fica
//     só como fallback de pacote sem mapa de casas), no MESMO shape de
//     src/data/dialogos.js: { suspeitoId, noInicial, nos, noEvasiva,
//     reacoesProva, confrontos };
//   • o esqueleto de 3 beats (§7.2 — a conversa desce e não volta):
//     abertura (recepção por `comportamentos`) → b1_<tom> (o paradeiro;
//     todo tom sustenta a MESMA carta de álibi) → b2_<tom> (o arremate;
//     opcoes: [] encerra). Quatro opções por beat, uma por tom, sempre;
//   • a carta de álibi `gen_alibi_<suspeitoId>` (dominio comportamental /
//     subDominio alibi / declaranteId), no MESMO vocabulário de tags de
//     alibi_silas — o confronto em cena (ligacaoDeConfrontoEmCena) liga
//     sozinho, sem tocar o motor;
//   • confrontos ↔ reacoesProva em bijeção, um por carta do caso que TOCA
//     o suspeito (tabela fechada na spec §8.4: pertenceA para instrumento,
//     pertence, rastro de dinheiro e fuga; origemTestemunha para
//     visto-com-vida e ruído).
//
// REGRAS QUE NÃO CEDEM AQUI:
//   • camada narrativa pura: o motor não lê nada deste arquivo; o tom é
//     prosa, nunca prova (sem dente mecânico — não-objetivo da OS);
//   • fair play (spec §8.6): o réu acomoda a prova sem confessar; o
//     inocente dá o fato que o desonera; ninguém aponta o réu nem entrega
//     conclusão que o jogador devia cruzar;
//   • nenhuma fala cita id interno: nome de gente e rótulo de prédio,
//     sempre; horas citadas vêm da faixa do crime e da rotina (guia §6);
//   • voz derivada (guia §8.4): registro por classe social e profissão,
//     têmpera de idade, UM tique de trait; tom ressonante por trait
//     (MAPA_TRAIT_TOM abaixo) rende um tento a mais de prosa.
// =====================================================================

import { hashString } from '../logic/hash.js';
import { hashDecisao } from './hash_gerador.js';
import { REGIOES_EXIGIVEIS, SINAL_POR_METODO } from './marcas_exigiveis.js';
// O corte do E2 vem do MOTOR (src/logic/exposicao.js), e não de uma cópia
// aqui: o degrau só cai no mesmo ponto que o nível se as duas contas forem
// literalmente a mesma função (OS-R9 Fase 2).
import { corteDeE2 } from '../logic/exposicao.js';

// ---------------------------------------------------------------------
// Tom ressonante por trait (tabela fechada da spec §8.5). Sem trait, cai
// no comportamento; sem os dois, 'tecnico'.
// ---------------------------------------------------------------------
export const MAPA_TRAIT_TOM = {
  medroso: 'cordial',
  preciso: 'tecnico',
  tagarela: 'obliquo',
  linha_tempo_nao_confiavel: 'firme',
};

export const TONS = ['firme', 'cordial', 'tecnico', 'obliquo'];

// E5 (decorrelação): o pick de variante de prosa passa a hashDecisao — o
// hashString cru não tem avalanche, e chaves-irmãs (b1|firme × b1|cordial)
// caíam correlacionadas na mesma coluna. hashDecisao re-hasha e liberta os
// slots. Muda os bytes dos casos embarcados (bump de golden, D4) — re-gerar
// no mesmo commit. Só prosa; o motor jamais lê isto.
export function variante(pool, chave) {
  return pool[hashDecisao(chave) % pool.length];
}

function indicePorId(lista) {
  const m = new Map();
  for (const item of lista) m.set(item.id, item);
  return m;
}

// ---------------------------------------------------------------------
// Rótulos de faixa e de tempo (calendário do caso: 13/out/1893 = sexta;
// mesma convenção de rotuloDaFaixa em pacote_gerado.js).
// ---------------------------------------------------------------------
const FAIXA_TXT = {
  noite: 'na sexta à noite',
  madrugada: 'na madrugada de sábado',
  dia: 'na sexta à tarde',
};
export const FAIXA_CURTA = {
  noite: 'sexta à noite',
  madrugada: 'madrugada de sábado',
  dia: 'sexta à tarde',
};
// Janela declarada (envelope da faixa, escala absoluta de tempo.js:
// 0 = meia-noite de 14/out). Fonte dos números citados na prosa: o
// "recolhi-me às oito" da fala é a hora −4 da tag, sempre.
const JANELA_DECLARADA = {
  noite: { inicio: -4, fim: 7 }, // das 20h de sexta à manhã de sábado
  madrugada: { inicio: -4, fim: 7 }, // idem: quem dormia declara a noite inteira
  dia: { inicio: -12, fim: -6 }, // do meio-dia às seis de sexta
};

// Rótulos de prédio trazem artigo embutido ("O Solar", "A Taverna",
// "Cottage nº 2"): as contrações nascem aqui, para a fala nunca colar
// preposição em artigo cru ("a O Solar"). Exportada: o montador do pacote
// (pacote_gerado.js) usa as mesmas formas na abertura e nos suspeitos.
export function formasDoLugar(rotulo) {
  if (rotulo.startsWith('O ')) {
    const r = rotulo.slice(2);
    return { em: `no ${r}`, a: `ao ${r}`, para: `para o ${r}` };
  }
  if (rotulo.startsWith('A ')) {
    const r = rotulo.slice(2);
    return { em: `na ${r}`, a: `à ${r}`, para: `para a ${r}` };
  }
  if (/^Casa\b/.test(rotulo)) return { em: `na ${rotulo}`, a: `à ${rotulo}`, para: `para a ${rotulo}` };
  return { em: `no ${rotulo}`, a: `ao ${rotulo}`, para: `para o ${rotulo}` };
}

// ---------------------------------------------------------------------
// Exibição de profissão: o id narrativo fica no elenco (os ids de carta
// de álibi o carregam); só a SUPERFÍCIE traduz o anglicismo (parecer da
// OS de lapidação, fiscal 7). Exportada: o montador do pacote usa a mesma
// tradução em subtítulos, briefing e carta do delegado.
// ---------------------------------------------------------------------
const PROFISSAO_EXIBIDA = {
  squire: 'senhor de terras',
  // Desambiguação (OS Vila Viva E2): o morador-policial é "guarda do
  // condado", reservando "constable" ao oficial do caso (o que convoca o
  // perito) — casa com a glosa "o guarda da vila" da abertura.
  'constable do condado': 'guarda do condado',
  'senhora da propriedade (viúva do squire)': 'senhora da propriedade',
  'professor de vila': 'mestre-escola',
  'professora de vila': 'mestra-escola',
};
export function profissaoExibida(profissao) {
  return PROFISSAO_EXIBIDA[profissao] || profissao;
}

// Hora absoluta → boca de aldeia ("às nove", "à uma"), para fala que
// precise citar a hora de um avistamento registrado.
const NOME_HORA = ['meia-noite', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze'];
function horaFalada(h) {
  const H = ((h % 24) + 24) % 24;
  if (H === 0) return 'à meia-noite';
  if (H === 12) return 'ao meio-dia';
  const n = H % 12;
  return n === 1 ? 'à uma' : `às ${NOME_HORA[n]}`;
}

// ---------------------------------------------------------------------
// As perguntas do perito (a voz do jogador). O tom de cada uma é fixo (o
// mecanismo tom→nó não muda), mas a REDAÇÃO varia por caso e por suspeito
// (variante decorrelada por hashDecisao, salgada com a seed e o id da
// pessoa) — antes eram iguais em todo caso, a superfície de diálogo que
// mais "cansava" quem jogava vários (OS diálogos/escala/localização; a
// intenção de cada tom é preservada, só muda o fraseado). As interpolações
// {detective.*}/{g:} resolvem por DETECTIVE — nunca pelo interrogado —, daí
// as variantes não gênero o interrogado (só a vítima, resolvida aqui).
// ---------------------------------------------------------------------
function perguntasParadeiro(faixa, sal) {
  const V = (pool, chave) => variante(pool, `${sal}|pergP|${chave}`);
  const obliquaPool = {
    noite: ['"Costuma recolher-se cedo?"', '"A que horas costuma apagar a luz?"', '"É dos que se deitam cedo?"'],
    madrugada: ['"Tem o sono pesado?"', '"Acorda com facilidade, de noite?"', '"Dorme a noite toda, ou desperta?"'],
    dia: ['"A que horas larga o serviço?"', '"Quando é que encerra o dia?"', '"A tarde acaba a que horas?"'],
  }[faixa];
  return [
    {
      rotulo: V(
        [
          `"Onde esteve ${FAIXA_TXT[faixa]}? Sem rodeios."`,
          `"Diga-me onde esteve ${FAIXA_TXT[faixa]}, e diga direito."`,
          `"Comecemos pelo simples: onde esteve ${FAIXA_TXT[faixa]}?"`,
        ],
        'firme'
      ),
      vaiPara: 'b1_firme',
      tom: 'firme',
    },
    {
      rotulo: V(
        [
          `"A sua ${FAIXA_CURTA[faixa]}, como foi? Conte com calma."`,
          `"Conte-me da sua ${FAIXA_CURTA[faixa]}, a seu tempo."`,
          `"Fale-me da ${FAIXA_CURTA[faixa]} com liberdade, do começo ao fim."`,
        ],
        'cordial'
      ),
      vaiPara: 'b1_cordial',
      tom: 'cordial',
    },
    {
      rotulo: V(
        [
          `"O seu paradeiro ${FAIXA_TXT[faixa]}: hora e lugar."`,
          `"Vamos aos fatos: onde esteve ${FAIXA_TXT[faixa]}, e a que horas."`,
          `"Preciso das horas ${FAIXA_TXT[faixa]}: onde, e de quando a quando."`,
        ],
        'tecnico'
      ),
      vaiPara: 'b1_tecnico',
      tom: 'tecnico',
    },
    { rotulo: V(obliquaPool, 'obliquo'), vaiPara: 'b1_obliquo', tom: 'obliquo' },
  ];
}

function perguntasArremate(vitima, sal) {
  const V = (pool, chave) => variante(pool, `${sal}|pergA|${chave}`);
  const quem = vitima.genero === 'feminino' ? `Que mulher era ${vitima.nome}` : `Que homem era ${vitima.nome}`;
  const quemBaixo = quem.charAt(0).toLowerCase() + quem.slice(1);
  const ela = vitima.genero === 'feminino' ? 'ela' : 'ele';
  const dela = vitima.genero === 'feminino' ? 'dela' : 'dele';
  return [
    {
      rotulo: V(
        [
          `"Alguém nesta vila queria mal a ${vitima.nome}. Diga um nome."`,
          `"Um nome: quem, nesta vila, queria mal a ${vitima.nome}?"`,
          `"Não me poupe: quem tinha contas a acertar com ${vitima.nome}?"`,
        ],
        'firme'
      ),
      vaiPara: 'b2_firme',
      tom: 'firme',
    },
    {
      rotulo: V(
        [
          `"${quem}, para quem lidava com ${ela} todos os dias?"`,
          `"${quem}, aos olhos de quem convivia com ${ela}?"`,
          `"Fale-me ${dela} a seu tempo: ${quemBaixo}?"`,
        ],
        'cordial'
      ),
      vaiPara: 'b2_cordial',
      tom: 'cordial',
    },
    {
      rotulo: V(
        [
          `"Que tratos tinha com ${vitima.nome}? Somas e datas, se as houver."`,
          `"Que negócios tinha com ${vitima.nome}? Diga somas e datas."`,
          `"Contas, dívidas, ajustes com ${vitima.nome}: o que houver, com data."`,
        ],
        'tecnico'
      ),
      vaiPara: 'b2_tecnico',
      tom: 'tecnico',
    },
    {
      rotulo: V(
        ['"O que anda dizendo a vila?"', '"E a vila, o que murmura?"', '"Que se comenta por aí, de porta em porta?"'],
        'obliquo'
      ),
      vaiPara: 'b2_obliquo',
      tom: 'obliquo',
    },
  ];
}

// ---------------------------------------------------------------------
// O BEAT 3 GERADO (OS-R9 · Fase 2) — a pergunta da consequência.
//
// O tutorial estreou o terceiro beat como o beat do que esta morte CUSTA
// ou RENDE a quem responde: o ordenado do aprendiz, o inventário do
// sobrinho, a loja da governanta. É o beat em que a exposição se paga, e
// é por isso que ele é o último a descer.
//
// PARIDADE POR CONSTRUÇÃO (GR9-2, e é a razão de o beat não olhar o
// papel): `falaB2` ramifica em `papel === 'reu'` — com guarda própria e
// decisão registada. Este não ramifica em nada. A mesma grade de classe e
// de tom responde por réu e por inocente, e nenhuma célula existe só de
// um lado. A G3 vale aqui sem vigilância nenhuma.
// ---------------------------------------------------------------------
function perguntasFecho(vitima, pessoa, sal) {
  const V = (pool, chave) => variante(pool, `${sal}|pergF|${pessoa.id}|${chave}`);
  // A vítima e o interrogado têm gênero próprio, e nenhum dos dois é o do
  // perito: `{g:…}` flexiona pelo pronome do DETECTIVE e não serve aqui.
  const mortoA = vitima.genero === 'feminino' ? 'Morta ela' : 'Morto ele';
  const oSr = pessoa.genero === 'feminino' ? 'a senhora' : 'o senhor';
  return [
    {
      rotulo: V(
        ['"O que lhe muda, com esta morte?"', '"Diga o que esta morte lhe muda."', `"${mortoA}, o que muda para si?"`],
        'firme'
      ),
      vaiPara: 'b3_firme',
      tom: 'firme',
    },
    {
      rotulo: V(
        [
          `"E ${oSr}, como fica depois disto?"`,
          '"Como fica a sua vida, passado o enterro?"',
          `"Há de ser um baque. Como fica ${oSr}?"`,
        ],
        'cordial'
      ),
      vaiPara: 'b3_cordial',
      tom: 'cordial',
    },
    {
      rotulo: V(
        [
          '"Do que vive daqui para a frente? Diga a fonte."',
          '"De onde lhe vem o sustento, agora? Quero a fonte."',
          '"Quem lhe paga, a partir de agora, e de quanto em quanto tempo?"',
        ],
        'tecnico'
      ),
      vaiPara: 'b3_tecnico',
      tom: 'tecnico',
    },
    {
      rotulo: V(
        ['"A vila amanhece igual, depois disto?"', '"Amanhã a vila abre as portas na mesma hora?"', '"E a vila, perde o quê?"'],
        'obliquo'
      ),
      vaiPara: 'b3_obliquo',
      tom: 'obliquo',
    },
  ];
}

// A REGRA DE RUBRICA DESTE BEAT (guia §4.10, e é a lição da OS-R8). A fala
// base e a `alfinetada` imprimem-se na MESMA tela. Para que nunca haja duas
// mãos ocupadas ali, os dois textos ocupam partes diferentes do corpo por
// construção: a fala base fica na VOZ, no OLHAR e no TEMPO; a alfinetada
// fica nas MÃOS e no que elas seguram. Nenhuma célula desta grade toca a
// outra, e é assim que a colisão fica impossível em vez de improvável.
// A GRADE É DE CLASSE, E NÃO DE MACROGRUPO, e a razão é de conteúdo: este
// beat pergunta DE QUE SE VIVE, e disso cada ofício responde com as suas
// próprias palavras. O macrogrupo de três serve à `falaB2`, que abre a
// conversa; aqui ele punha renda de terra na boca de uma mestra-escola e
// gado na de uma lavadeira. Oito classes, quatro tons, duas saídas cada.
const FECHO_POR_CLASSE = {
  gentry: {
    firme: [
      'A resposta não vem de pronto. "Muda-me a vizinhança e o trato de anos. De renda, nada: o que me sustenta sustentava-me antes."',
      'Deixa a pergunta assentar antes de responder. "Perco um nome que se contava nesta vila. De haveres, não perco nem ganho."',
    ],
    cordial: [
      'A voz baixa um tom e demora nele. "Fica-se pior, {detective.treatment}. Não de bolso: de companhia. Nesta vila conta-se pelos dedos quem se pode receber sem cerimônia."',
      'Responde devagar, como quem escolhe. "Uma cadeira vazia à mesa, e o mesmo rendimento de sempre. Das duas, a primeira pesa mais."',
    ],
    tecnico: [
      'Dá a resposta na ordem em que foi pedida. "Rendas de terra e arrendamentos ao ano. Nada disso passava por quem morreu; o procurador confirma cada verba, se quiser."',
      'Responde sem procurar a palavra. "O sustento vem de renda, e vinha antes. Nem uma linha das minhas contas se lê diferente amanhã."',
    ],
    obliquo: [
      'Olha a rua para além da porta antes de responder. "Abre. A vila abre sempre. Há de abrir a falar disto, e daqui a um mês fala de outra coisa."',
      'Espera que passe uma carroça na rua e só então responde. "Amanhece igual, e aí está o que custa. Uma morte destas devia parar alguma coisa, e não para."',
    ],
  },
  clero: {
    firme: [
      'A resposta vem sem que o rosto mude. "Muda-me um banco vazio na nave e um nome a mais no livro dos óbitos. De côngrua, nada: quem a paga é a diocese."',
      'Junta as mãos e responde de uma vez. "Perco uma alma que me era dada a guardar. É o que muda, e não é pouco."',
    ],
    cordial: [
      'A voz desce ao registro com que se fala a quem chora. "Fica-se com o trabalho de consolar os que ficaram, {detective.treatment}, e esse é o mais pesado que a paróquia tem."',
      'Demora na resposta, e a voz não se levanta. "De luto com a freguesia inteira, é como se fica. Enterra-se, e depois é que a falta se aprende."',
    ],
    tecnico: [
      'Responde como quem já deu esta conta a um bispo. "Da côngrua, paga por trimestre, e do que a paróquia arrecada em ofertório. Nem uma coisa nem outra vinha de quem morreu."',
      'Dá a fonte antes que se peça. "A côngrua e a casa paroquial, ambas da diocese. Os livros da paróquia estão abertos a quem os quiser conferir."',
    ],
    obliquo: [
      'Olha o relógio da torre pela janela antes de falar. "Toca-se às sete, como se toca todos os dias. A vila levanta-se ao sino, e o sino não sabe de luto."',
      'Deixa a pergunta assentar. "Amanhece, e amanhã há de estar a igreja cheia. Uma morte destas enche igreja por três semanas."',
    ],
  },
  profissional: {
    firme: [
      'A resposta é curta e não se enfeita. "Muda-me um nome entre os que me procuravam. De honorários, o que se perde perde-se; havia outros nomes."',
      'Responde de pronto, e o rosto não acompanha. "Perco quem me buscava. Não é a primeira vez que perco assim, e não é disso que se vive."',
    ],
    cordial: [
      'A voz baixa, e a frase leva o seu tempo. "Fica-se pior, {detective.treatment}. Anos a atender a mesma vila criam coisa que não se lança em conta nenhuma."',
      'Responde como quem já respondeu a isto noutras casas. "Sobra-me o trabalho de dar a notícia aos que faltam saber. Faço-o hoje, e não é a primeira vez."',
    ],
    tecnico: [
      'Responde na ordem pedida, e não acrescenta. "De honorários, cobrados por serviço e lançados em livro próprio. O que aquela casa me tenha dado a lançar está lá, linha a linha, e o livro abre-se."',
      'Dá a resposta com a exatidão de quem a tem escrita. "Vivo do exercício, e o exercício não depende de uma casa só. O livro mostra quantas casas são."',
    ],
    obliquo: [
      'Volta-se um instante para a janela. "Abre. A vila há de precisar de mim amanhã como precisou ontem, e não escolhe a semana para isso."',
      'Espera, e a resposta vem inteira. "Amanhece igual. A vila fala disto uma semana e depois volta a falar de chuva."',
    ],
  },
  comerciante: {
    firme: [
      '"Muda-me a freguesia." Responde de pronto, sem enfeitar. "Quem morre leva o que comprava. Conta-se, e conta-se depressa."',
      '"Muda-me uma conta corrente." A resposta sai inteira, de uma vez. "O que se devia e o que se comprava fica em aberto, e aberto assim resolve-se mal."',
    ],
    cordial: [
      'Demora a responder, e a voz vem mais rouca. "Faz-se falta, {detective.treatment}. Não é só o que se comprava: é a conversa da hora de abrir, que agora não vem."',
      'A resposta vem contada com vagar. "Um freguês a menos, e uma hora do dia sem ninguém. A gente do balcão acostuma-se às caras."',
    ],
    tecnico: [
      'Responde com números, sem que se peça duas vezes. "Vivo do que passa pelo balcão, e o que passava por esta conta era pouco do total. Está escrito no livro; o livro está ali."',
      'Dá a fonte antes de dar o valor. "Do balcão, e do fiado que se cobra ao fim do mês. Se quiser conferir a soma, o caderno abre-se agora."',
    ],
    obliquo: [
      'Volta os olhos para o interior da loja antes de responder. "Amanhã não abre: é domingo. Segunda abre à hora de sempre, com enterro ou sem ele."',
      'Deixa a pergunta no ar um instante. "Amanhece igual. Perde uma casa que gastava, e disso a vila lembra-se por um tempo."',
    ],
  },
  artesao: {
    firme: [
      '"Muda-me uma encomenda." Responde sem largar o que tem entre mãos. "Ficou serviço começado que agora ninguém vem buscar. Paga-se com o inventário, dizem."',
      'A resposta sai curta, e a bancada continua a ser olhada. "Muda-me trabalho que estava ajustado. Ajusta-se outro; é o que há."',
    ],
    cordial: [
      'Limpa as mãos uma na outra antes de responder. "Faz-se falta, {detective.treatment}. Quem entra e sai pela porta da oficina acaba por virar quase gente da casa."',
      'A voz vem mais devagar do que o resto da conversa. "Perde-se quem sabia esperar pelo serviço bem feito. Isso não se substitui à pressa."',
    ],
    tecnico: [
      'Responde e volta o olho ao que estava a fazer. "Do serviço encomendado, e há encomenda ajustada até o Natal. Deste morto vinha uma parte pequena, e está anotada."',
      'Dá a conta sem procurar. "Vivo do que sai da bancada. O que esta casa devia está no caderno, com a data em que se ajustou."',
    ],
    obliquo: [
      'Olha para dentro da oficina antes de falar. "Amanhã é domingo. Na segunda a oficina abre-se antes de o sol nascer, como se abre sempre."',
      'Espera o tempo de dois fôlegos. "Amanhece. O serviço não se faz sozinho por causa de enterro nenhum."',
    ],
  },
  lavrador: {
    firme: [
      '"Muda pouco." A resposta é curta e não se alonga. "Quem anda no campo anda na mesma. O nome do patrão é que troca, e o meu não."',
      '"Muda o quê?" Repete a pergunta antes de a responder. "Trabalho havia antes e há de haver depois. Come-se do que se fizer."',
    ],
    cordial: [
      'A voz vem mais miúda, e {detective.treatment} {detective.surname} tem de se chegar para ouvir. "Fica-se com medo, é o que fica. Da lida não, que a lida continua. Do resto, sim."',
      'Responde baixo, e o chapéu gira uma volta nas mãos. "Como se estava, e com uma morte a mais para se pensar de noite."',
    ],
    tecnico: [
      'Responde o perguntado e para. "Do jornal do dia, pago ao sábado. Quem me paga é quem me pagava, e não era quem morreu."',
      'Dá a conta como lhe ensinaram a dar. "Tanto por dia, e a semana fecha ao sábado. Da casa do morto não me vinha nada, nem me vem."',
    ],
    obliquo: [
      'Olha o céu antes de responder, como quem mede o dia. "Amanhece. O gado sai à mesma hora, e recolhe-se à hora de sempre."',
      'Cala-se um instante, e a resposta vem depois disso. "Igual. Fala-se disso à porta da igreja amanhã, e na segunda cada um vai à sua lida."',
    ],
  },
  criadagem: {
    firme: [
      '"Muda-me uma porta onde me chamavam, se a fecharem." A resposta sai baixa e inteira. "Chamam-me noutras. Costumo ter com que me ocupar."',
      'Responde sem levantar os olhos. "Muda-me pouco. Quem trabalha por conta alheia trabalha onde a chamarem, e de mim ninguém se queixou."',
    ],
    cordial: [
      'A voz falha uma vez e recompõe-se. "Fica-se com pena, {detective.treatment}, com licença de o dizer. Era casa de bom trato, e disso já não há muitas."',
      'Responde miúdo, e os dedos prendem-se um no outro. "Sem esse ganho é que se fica, é o que se teme. E com aquela casa às escuras na cabeça, de noite."',
    ],
    tecnico: [
      'Responde o que se lhe pergunta, e nada além. "Do que me pagam pelo serviço que faço, e é pouco de cada vez. Quem me paga é quem me põe a trabalhar, e não era a casa do morto."',
      'Dá a conta com cuidado, como quem repete o que ouviu ler. "Tanto por vez, e mais nas semanas de mais serviço. Quem me paga há de dizer o mesmo, se lho perguntarem."',
    ],
    obliquo: [
      'Olha para o caminho antes de responder. "Abre. As casas acordam à mesma hora, com defunto ou sem ele. Há serviço posto antes das seis."',
      'Baixa a voz mais ainda. "Amanhece. Fala-se disto de cozinha em cozinha a manhã inteira, e depois mandam calar, e cala-se."',
    ],
  },
  servico_do_condado: {
    firme: [
      'Responde como quem lavra. "Muda-me um nome no livro de ocorrências. De soldo, nada: quem o paga é o condado."',
      'A resposta vem lavrada. "Muda-me serviço a mais até isto fechar. O soldo é o mesmo, com morte ou sem ela."',
    ],
    cordial: [
      'Tira o quepe antes de responder. "Fica-se pior, {detective.treatment}. Numa vila desta conta, a gente conhece todo mundo pelo nome."',
      'A voz sai mais baixa do que o uniforme faria supor. "A vila passa a olhar para a gente à espera. É o que mais pesa."',
    ],
    tecnico: [
      'Responde na ordem de folha. "Soldo do condado, pago ao mês, mais a fardeta ao ano. Nenhum dos dois passava por particular nenhum."',
      'Dá a resposta como quem preenche linha. "Do soldo, e do soldo só. Está tudo em folha, e a folha assina-se na sede."',
    ],
    obliquo: [
      'Confere a hora antes de responder. "Abre. A ronda sai à mesma hora, e há de sair amanhã, que é domingo, e nos domingos que vierem."',
      'Espera, e a resposta sai medida. "Amanhece. Por uns dias há de haver mais gente à porta da estalagem a comentar, e depois passa."',
    ],
  },
};

// A TÊMPERA DE IDADE (guia §8.2). Entra como acréscimo curto, e sempre em
// VOZ, OLHAR ou TEMPO — nunca em mão nem em objeto, que é o território da
// `alfinetada` que sai na mesma tela (§4.10). Sem isto, a grade responderia
// igual por um rapaz de catorze anos e por uma mulher de cinquenta e sete.
const TEMPERA_POR_IDADE = {
  jovem: [
    ' E acrescenta, mais baixo: "É o que me disseram em casa, {g:senhor|senhora}."',
    ' A resposta acaba antes do fôlego, e os olhos ficam à espera da pergunta seguinte.',
  ],
  plena: ['', ''],
  madura: [
    ' "São vinte e tantos anos disto", acrescenta, "e nunca vi ano nenhum mudar por causa de uma morte."',
    ' Acrescenta a credencial sem que se peça: os anos de casa, contados pelo nome de quem os viu.',
  ],
  velha: [
    ' Mede o presente por outro tempo: "Vi esta vila enterrar gente melhor, e no dia seguinte estava tudo de pé."',
    ' A memória longa entra como fato: "Já houve morte assim aqui, quando eu era moço, e a vila fez o mesmo que há de fazer agora."',
  ],
};

function faixaEtaria(idade) {
  if (idade <= 19) return 'jovem';
  if (idade <= 44) return 'plena';
  if (idade <= 59) return 'madura';
  return 'velha';
}

function falaB3(ctx, tom) {
  const { pessoa } = ctx;
  const grade = FECHO_POR_CLASSE[pessoa.classeSocial] || FECHO_POR_CLASSE.lavrador;
  const base = variante(grade[tom], `${ctx.sal}|b3|${tom}`);
  const faixa = faixaEtaria(pessoa.idade);
  let tempera = variante(TEMPERA_POR_IDADE[faixa], `${ctx.sal}|b3idade|${tom}`);
  // UMA têmpera traz palavra flexionada por quem FALA (a memória de quando
  // era moço/moça), e é só essa que passa por aqui. O tratamento ao perito
  // não entra: quem o flexiona é `{g:…}`, pelo pronome dele — foi assim que
  // a primeira versão pôs uma criada a chamar «senhora» a um perito homem.
  if (pessoa.genero === 'feminino') {
    tempera = tempera.replace('quando eu era moço', 'quando eu era moça');
  }
  return [base + tempera];
}

// A ALFINETADA — o que o beat 3 rende A MAIS conforme o perito chegou com
// mais ou menos dossiê na mesa (src/logic/exposicao.js).
//
// E1: a compostura falha UMA vez, num gesto. E2: {g:o suspeito|a suspeita}
// diz, à sua maneira, que o perito chegou sabendo. O acréscimo é CARÁTER,
// nunca fato novo do caso — nenhuma alfinetada cita carta, porque quem
// chega em E2 pode ter QUAISQUER dois terços do dossiê, e não um par certo.
//
// O eixo é o TIQUE (guia §8.3), e não a classe: a classe já responde pela
// fala base, e repetir o eixo faria o beat inteiro dizer a mesma coisa duas
// vezes. E não é por tom, pelo mesmo motivo do tutorial — o jogador desce
// um tom só por partida, e quatro cópias seriam peça escrita para ninguém
// comparar.
const ALFINETADA_POR_TRAIT = {
  preciso: {
    E1: ['Ao dar a última data, os dedos batem a contagem na coxa, e param no meio dela.'],
    E2: [
      'Pousa as duas mãos na madeira, abertas. "Metade disto {g:o senhor|a senhora} já traz escrito. Pergunte o que falta, que eu completo, e acabemos com a outra metade."',
    ],
  },
  medroso: {
    E1: ['A mão fecha-se na ombreira, e fica fechada até a frase acabar.'],
    E2: [
      'As mãos descem e ficam ao lado do corpo, quietas pela primeira vez. "{g:O senhor|A senhora} não veio perguntar: veio conferir. Confira, então, e me diga quando posso fechar esta porta."',
    ],
  },
  tagarela: {
    E1: ['A história seguinte começa, e desta vez não chega ao fim; a mão fica parada em cima do que ia mostrar.'],
    E2: [
      'Cala-se antes de acabar, e afasta com um dedo o que tinha na mão. "Estou a contar o que já lhe contaram, não estou? Pois pergunte de uma vez, {detective.treatment}, que eu poupo a saliva."',
    ],
  },
  linha_tempo_nao_confiavel: {
    E1: ['Levanta a mão para corrigir a hora que acabou de dar, e a deixa cair sem a corrigir.'],
    E2: [
      'Junta as mãos e desiste de contar pelos dedos. "As minhas horas {g:o senhor|a senhora} já tem de outra boca, e a outra há de as ter dado melhor. Fique com as dela."',
    ],
  },
};

// A alfinetada é do TIQUE, e o tique não tem gênero: nenhuma destas peças
// fala do corpo de quem responde em palavra flexionada. O que se flexiona é
// o tratamento ao perito, e isso é `{g:…}`, que já resolve sozinho.
function alfinetadaDe(ctx) {
  const bloco = ALFINETADA_POR_TRAIT[ctx.trait];
  if (!bloco) return null;
  return { E1: [...bloco.E1], E2: [...bloco.E2] };
}

// ---------------------------------------------------------------------
// A ESCADA DE CONFRONTO GERADA (D8) — contador autoral, nunca `requerTodas`.
//
// O tutorial curou a lista à mão: três papéis que, dois a dois, bastam para
// o perito pressionar Walter sobre o que ele sabia. Num banco de 31 casos
// não há quem cure lista nenhuma, e a lista tem de sair de uma REGRA — que
// é a lição da GR9-2: paridade por construção, não por contagem fixa.
//
// A regra é a mais curta que serve, e amarra o degrau à exposição em vez de
// inventar um segundo eixo: **a lista é o dossiê externo daquele suspeito,
// e o corte é o mesmo corte do E2** (`corteDeE2`, dois terços para cima).
// O degrau cai, portanto, exatamente quando a conversa chega ao nível mais
// fundo — o que faz do degrau a exposição DITA, e não um paralelo dela.
//
// Vale para dossiê de qualquer tamanho, que é o que a GR9-2 cobra: com dois
// papéis o corte é dois, com seis é quatro, e a fração é a mesma para o réu
// e para quem passava na rua.
//
// O degrau rende PROSA e mais nada (GR6-4): nenhum `[[id]]`, nenhum nó novo,
// nenhum fato do caso. O que ele acrescenta é o que a pessoa concede quando
// já não vale a pena poupar — e conceder não é confessar.
// O QUE O DEGRAU PODE CONCEDER, E O QUE NÃO PODE. Ele cai em 31 casos com
// elencos que o gerador sorteia, e por isso não pode afirmar FATO do caso:
// uma versão que dissesse «devia-se-me dinheiro» mentiria em todo caso onde
// não há dívida nenhuma entre aquela pessoa e a vítima. O que ele concede é
// o que vale para qualquer boca diante de um perito bem abastecido — que
// houve atrito, que houve palavra, e que se calou por conta própria.
// Conceder não é confessar, e é essa a linha.
const DEGRAU_POR_GRUPO = {
  alto: [
    'Espera que a última folha seja pousada e só então retoma, noutro tom. "Já que a casa está aberta assim, poupemos o rodeio: houve desavença entre nós, e houve mais de uma. Nenhuma que eu levasse à porta de ninguém, e todas que a vila sabe de cor."',
    'Recua na cadeira e cruza as mãos sobre o colete. "Vejo que não me poupa, e faço o mesmo: nem sempre nos tratámos bem, e da última vez separámo-nos mal. Omiti-o porque não me pareceu do inquérito. Ponha no papel, se lhe parecer."',
  ],
  oficio: [
    'Olha os papéis alinhados diante de si e recolhe as mãos da bancada. "Ponha então tudo à vista, que eu ponho o resto: houve palavra dura entre nós, e não foi uma só vez. Calei-a porque não fica bem falar assim de quem já não responde."',
    'Alinha o que lhe mostraram e não o devolve. "Com isso tudo na mesa, escusado é fingir bom trato: havia mágoa antiga, e a vila conhece-a melhor do que eu a conto. Não a trouxe primeiro por vergonha, e não por outra coisa."',
  ],
  chao: [
    'Deixa de olhar a porta e olha o que lhe puseram à frente. "Se {g:o senhor|a senhora} já tem isso tudo, então tem o que eu ia calar. Houve zanga entre nós, e houve quem ouvisse. Não me envergonho de o dizer agora que o dizem por mim."',
    'Baixa os ombros e responde de outro modo. "Pois seja. Andámos de mal, e disso não falei quando me perguntaram da primeira vez. Não falei por medo de que se virasse contra mim, e é a verdade toda que tenho."',
  ],
};

function degrauDoTrato(ctx, dossieExterno) {
  const lista = (dossieExterno || []).slice();
  if (lista.length < 2) return null;
  const grupo = ['gentry', 'clero', 'profissional'].includes(ctx.pessoa.classeSocial)
    ? 'alto'
    : ['comerciante', 'artesao'].includes(ctx.pessoa.classeSocial)
      ? 'oficio'
      : 'chao';
  return {
    contaEntre: lista,
    aPartirDe: corteDeE2(lista.length),
    fala: [variante(DEGRAU_POR_GRUPO[grupo], `${ctx.sal}|degrau`)],
  };
}

// ---------------------------------------------------------------------
// VOZ DERIVADA (guia §8.1–8.3): as primeiras palavras por classe social,
// a têmpera de idade e o tique por trait. Frases curtas, observação pura;
// a fala entre aspas é depoimento (alegação), nunca conclusão.
// ---------------------------------------------------------------------
const PRIMEIRAS_PALAVRAS = {
  gentry: [
    '"Recebo porque a lei pede, e esta casa atende ao que a lei pede. Diga em que sirvo."',
    '"A casa responde onde a lei pergunta. Vamos a isso."',
    '"A casa deve isto ao condado, e paga de bom grado. Ao que vem?"',
  ],
  clero: [
    '"A paróquia está às ordens do inquérito. Pergunte."',
    '"Entre um ofício e outro, o tempo é seu. Pergunte."',
    '"Deixei a sacristia aberta e o sineiro à espera. Diga do que precisa."',
  ],
  profissional: [
    '"Tenho a manhã tomada, {detective.treatment}, mas isto passa à frente de tudo. Ao seu dispor."',
    '"Adiei o que havia para adiar. Sirva-se do tempo."',
    '"Marquei as visitas para depois; o inquérito vem primeiro, e é o certo."',
  ],
  comerciante: [
    '"Deixei o negócio fechado por esta hora. Aproveitemo-la."',
    '"O negócio espera trancado. Pergunte de uma vez, faça o favor."',
    '"Pus gente de confiança no balcão, que freguês não espera. Diga o que falta saber."',
  ],
  artesao: [
    '"Deixei serviço pela metade na bancada. Seja {g:direto|direta}, se puder ser."',
    '"Serviço parado esfria. Pergunte."',
    '"Larguei ferramenta quente na bancada. O que for, seja curto."',
  ],
  lavrador: [
    '"O guarda avisou que viriam. Diga lá, que a lida não espera."',
    '"Pergunte daqui mesmo, que a tarde é curta."',
    '"A terra ficou por lavrar hoje. Pergunte, que eu respondo e volto."',
  ],
  criadagem: [
    '"Posso falar, com licença da casa. Respondo o que souber."',
    '"Com licença. Digo o que souber, e volto ao serviço."',
    '"A casa deu licença. Respondo o que souber, e depressa."',
  ],
  servico_do_condado: [
    '"De serviço ou fora dele, respondo pelo livro. Pergunte."',
    '"Respondo como se lavra ocorrência: pelo certo. Pergunte."',
    '"A folha do dia ficou com o colega. Pergunte pelo livro, que pelo livro respondo."',
  ],
};

// A têmpera de idade (guia §8.2): uma frase a mais, quando couber.
function temperaIdade(pessoa) {
  if (pessoa.idade <= 19) return ' A voz sai baixa, e cada resposta espera a pergunta acabar por inteiro.';
  if (pessoa.idade >= 60) return ' Acrescenta, antes da primeira pergunta: "Na minha idade responde-se uma vez, e certo."';
  if (pessoa.idade >= 45) return ' Diz do ofício, sem que ninguém pergunte: "É a vida inteira nisto."';
  return '';
}

// O tique por trait (guia §8.3), como observação de cena na abertura.
const TIQUE_ABERTURA = {
  medroso: ' Fala baixo e mede a porta antes de cada resposta.',
  tagarela: ' E emenda, sem pergunta, o frio que fez e o preço do pão.',
  preciso: ' Traz as datas prontas, como quem chega com a caderneta escrita.',
  linha_tempo_nao_confiavel: ' Ao citar a primeira hora, corrige-a no meio da frase.',
};

// A recepção (abertura) por comportamento de diálogo.
function falaAbertura(ctx) {
  const { pessoa, sal } = ctx;
  // OS da vila na mesa: o interrogatório corre à porta da pessoa — o
  // constable bate, o perito pergunta do batente. A recepção lê o
  // comportamento de diálogo, como antes; muda a moldura, não a mecânica.
  // Dois palcos especiais: quem MORA no posto (o guarda do condado) não
  // tem porta a bater — atende na própria sala; quem mora no prédio de
  // encontro (taverneiro, merceeiro, ferreiro) atende do serviço aberto.
  const palco = ctx.palcoDialogo || 'casa';
  let entrada;
  if (palco === 'posto') {
    entrada = pessoa.comportamentos.includes('revela_facil')
      ? `${pessoa.nome} atravessa a sala do posto e se apresenta antes que o chamem.`
      : `${pessoa.nome} deixa o que fazia no posto e fica de pé, à espera da pergunta.`;
  } else if (palco === 'encontro') {
    entrada = pessoa.comportamentos.includes('revela_facil')
      ? `${pessoa.nome} vem ao encontro antes que o constable chame, enxugando as mãos no avental.`
      : pessoa.comportamentos.includes('revela_sob_custo')
        ? `${pessoa.nome} deixa o serviço devagar e espera a pergunta da soleira.`
        : `O constable acena da porta; ${pessoa.nome} deixa o serviço e vem, limpando as mãos.`;
  } else if (pessoa.comportamentos.includes('revela_facil')) {
    entrada = `${pessoa.nome} abre antes que o constable acabe de bater, e toma a palavra do batente.`;
  } else if (pessoa.comportamentos.includes('revela_sob_custo')) {
    entrada = `${pessoa.nome} entreabre a porta e espera que perguntem, a mão ainda no trinco.`;
  } else {
    // Armação distinta da terceira entrada (contra a monotonia entre as
    // cinco conversas do caso) e gesto por gênero (KB vestuário: a touca
    // feminina fica atada; descobrir-se à porta é gesto de homem). Os dois
    // ficam no vão — o termo é tomado à porta, não na sala.
    entrada =
      pessoa.genero === 'feminino'
        ? `O constable bate; ${pessoa.nome} abre, ajeita as fitas da touca e fica no vão da porta.`
        : `O constable bate; ${pessoa.nome} abre e se descobre, o chapéu na mão.`;
  }
  const palavras = variante(PRIMEIRAS_PALAVRAS[pessoa.classeSocial] || PRIMEIRAS_PALAVRAS.lavrador, `${sal}|abertura`);
  const tique = TIQUE_ABERTURA[ctx.trait] || '';
  return [`${entrada} ${palavras}${temperaIdade(pessoa)}${tique}`];
}

// ---------------------------------------------------------------------
// BEAT 1 — o paradeiro. Todo tom sustenta a MESMA carta de álibi
// (solubilidade); o tom ressonante rende o tento a mais.
// ---------------------------------------------------------------------
// E4: pool de 2 por trait (pick por hashDecisao, keyed por suspeito). O "ele"
// mora sempre entre espaços, para a troca de gênero (replaceAll ' ele '→' ela ')
// funcionar; nunca inicia a locução.
const ENTREGA_POR_TRAIT = {
  preciso: [
    'as horas saem em fila, sem que ele procure nenhuma',
    'cada hora sai de pronto, sem que ele a vá buscar na memória',
  ],
  medroso: [
    'os olhos vão à porta entre uma hora e outra',
    'entre uma hora e outra, ele mede a porta com o olho',
  ],
  tagarela: [
    'a resposta vem embrulhada em coisa que ninguém perguntou',
    'cada hora vem com uma história atrás que ninguém pediu',
  ],
  linha_tempo_nao_confiavel: [
    'as horas saem fora de ordem, e ele as corrige no meio',
    'as horas trocam de lugar na boca, contadas por canecas e sinos, e ele remenda a conta andando',
  ],
};

// O tento do tom ressonante, por trait (prosa, nunca prova — spec §8.5).
// FASE 3 (OS os-flags-psiquicas-no-dialogo.md): a TÊMPERA psíquica da mentira
// MODULA este tento de trait (postura B, decisão do usuário) — não abre eixo
// novo. `mente_com_calma`/`_periferica` ⇒ a entrega assenta (serena);
// `mente_sob_pressao` ⇒ vacila e repete. Sem têmpera, fica o `neutro` (o texto
// de sempre). Paridade anti-tell (§3): a variante depende só de (trait,
// têmpera), NUNCA do papel — a mesma calma do réu é a do inocente-calmo, a
// mesma tensão do réu é a da isca. Rende SÓ no tom ressonante (esparso de
// propósito: não vira um eixo de têmpera legível para todo o elenco). Guarda de
// presença cruzada no qa.mjs; a paridade perceptual, pelo playtest de tell.
const TENTO_RESSONANTE = {
  medroso: {
    neutro: ' A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa.',
    calmo: ' A voz firma-se, e o paradeiro sai inteiro, de uma vez, sem o recomeço das outras respostas.',
    tenso: ' A voz vacila no meio da hora, recomeça, e só na segunda vez a deixa inteira.',
  },
  preciso: {
    neutro: ' E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora.',
    calmo: ' As horas saem em fila, sem tropeço, e ainda vem atrás o tempo que fazia àquela hora.',
    tenso: ' As horas saem certas, e torna a conferi-las, uma a uma, antes de as dar por fechadas.',
  },
  tagarela: {
    neutro: ' No meio do rodeio, a mão pousa na ombreira e a fala desacelera, como quem pisa chão conhecido.',
    calmo: ' No meio do rodeio, a fala desacelera e a mão sossega ao lado do corpo, e a volta que sempre repete, desta vez fecha na primeira.',
    tenso: ' O rodeio aperta o passo, a mesma volta vem duas vezes, e o paradeiro sai aos pedaços, uma volta de cada vez.',
  },
  linha_tempo_nao_confiavel: {
    neutro: ' Contra a parede, alinha as horas com os dedos na madeira da ombreira, uma a uma.',
    calmo: ' Contra a parede, alinha as horas com os dedos e não as desfaz depois.',
    tenso: ' Contra a parede, alinha as horas com os dedos, desfaz a conta e recomeça, e a segunda não bate com a primeira.',
  },
};

function falaB1(ctx, tom) {
  const { pessoa, idCartaAlibi, faixa } = ctx;
  const poolEntrega = ENTREGA_POR_TRAIT[ctx.trait];
  const entrega = poolEntrega
    ? poolEntrega[hashDecisao(`${ctx.sal}|entrega|${ctx.trait}|${pessoa.id}`) % poolEntrega.length]
    : 'a resposta sai do tamanho da pergunta';
  const genero = pessoa.genero === 'feminino';
  const entregaDela = genero ? entrega.replaceAll(' ele ', ' ela ') : entrega;
  const abreObliqua = {
    noite: '"Cedo ou tarde, conforme o dia."',
    madrugada: '"Pesado o bastante."',
    dia: '"Quando a luz acaba."',
  }[faixa];
  const frames = {
    firme: [
      `"Sem rodeios, então." E o paradeiro vem, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
      `Um aceno curto, e o paradeiro sai por inteiro, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
      `"Vou direto." Dá hora e lugar de um fôlego, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
    ],
    cordial: [
      `A ${FAIXA_CURTA[faixa]} vem contada do princípio, e ${entregaDela}: [[${idCartaAlibi}]].`,
      `A resposta toma o caminho comprido e chega inteira, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
      `Conta a ${FAIXA_CURTA[faixa]} com vagar, do começo ao fim, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
    ],
    tecnico: [
      `"Hora e lugar." E os dá, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
      `Hora primeiro, lugar depois, sem que se peça duas vezes, e ${entregaDela}: [[${idCartaAlibi}]].`,
      `Dá a hora, dá o lugar, e para; ${entregaDela}: [[${idCartaAlibi}]].`,
    ],
    obliquo: [
      `${abreObliqua} E a ${FAIXA_CURTA[faixa]} acaba saindo por inteiro, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
      `${abreObliqua} O resto vem atrás, sem mais pergunta, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
      `${abreObliqua} Passada a esquiva, hora e lugar vêm sem enfeite, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
    ],
  }[tom];
  const frame = variante(frames, `${ctx.sal}|b1|${tom}`);
  // Fase 3: no tom ressonante, a têmpera psíquica escolhe a variante do tento
  // de trait (calmo/tenso/neutro). A seleção ignora o papel (paridade §3).
  const beat = TENTO_RESSONANTE[ctx.trait];
  const tento = tom === ctx.tomRessonante && beat ? beat[ctx.temperamento] || beat.neutro : '';
  return [frame + tento];
}

// ---------------------------------------------------------------------
// FASE 2 (OS os-flags-psiquicas-no-dialogo.md): projeção e decoro. Duas
// flags que o gerador compila só em NÃO-assassino e que boca nenhuma lia —
// agora COLOREM beats que já existem (tento discreto; nenhum nó novo de
// mecânica). O motor segue cego: é prosa, nunca prova.
//
//   • acusa_com_fervor (inocente de polaridade ativa) → b2 FIRME: projeta e
//     aponta OUTRO inocente com fervor, para enganar o apressado. É víscera,
//     nunca dedução boa; o alvo (ctx.alvoFervor) é escolhido no derivador
//     EXCLUINDO o réu — apontar o culpado "resolveria" o caso (Knox nº6).
//     Jamais cita janela/causa/nexo (é alegação sobre a pessoa, não sobre o
//     crime).
//   • omite_por_decoro (inocente de polaridade passiva) → EVASIVA + b2
//     OBLÍQUO: recusa por pudor, nunca por culpa; jamais esconde matéria.
//
// Paridade anti-tell (§3 da OS): o que estas flags mudam é a COR (projeção,
// pudor), nunca o conteúdo probatório; NÃO-apontar segue partilhado pelo
// réu, pela testemunha e pelo periférico sem flag — o réu não é separável
// por aqui. Guarda no qa.mjs: o nome do réu não aparece em fala nenhuma (a
// projeção jamais acusa o culpado).
// ---------------------------------------------------------------------

// A leitura de uma flag psíquica compilada (build time; fora do pacote —
// mesma fonte do gatilho de complexo).
function temFlag(bruto, id, nome) {
  const flags = bruto.psique?.consequencias?.porPessoa?.[id]?.flags || [];
  return flags.includes(nome);
}

// Fase 3 — a calma periférica viaja com tema (`mente_com_calma_periferica:<t>`),
// então casa por prefixo.
function temFlagPrefixo(bruto, id, prefixo) {
  const flags = bruto.psique?.consequencias?.porPessoa?.[id]?.flags || [];
  return flags.some((f) => f.startsWith(prefixo));
}

// Fase 3 — o excesso de afeto pelo morto (defende_demais_o_morto): reescreve o
// b2 CORDIAL com afeto+defensividade, PARTILHADO por todo papel com vínculo
// (o vetor de vínculo alcança qualquer classe — daí a variante de macrogrupo,
// como projecaoFervor/OBLIQUO_DECORO). Afeto, nunca prova; nomeia a vítima uma
// vez; jamais janela/causa/nexo. `femV` = gênero da vítima.
function cordialDefende(vitimaNome, femV, grupo) {
  if (grupo === 'alto') {
    return `"${vitimaNome}? Rogo-lhe que não fale d${femV ? 'ela' : 'ele'} no pretérito ainda. Índole melhor não conheceu esta vila, e quem o contestar que o sustente na minha presença. A falta que nos faz não há medida nesta terra que a alcance."`;
  }
  return `"${vitimaNome}? Não me fale d${femV ? 'ela' : 'ele'} no passado ainda. Alma melhor não pisou esta vila, e quem disser o contrário há de o dizer na minha frente. Faz falta mais do que a vila sabe medir."`;
}

// A projeção do fervor: nomeia o alvo UMA vez (anti vocativo, §4.10 do guia),
// sem prova e sem matéria; a antítese "não trago prova, tenho a certeza"
// marca a fala como víscera (leitura errada de fatos, não pista boa — KB de
// fair play §4). Registro por macrogrupo de classe; gênero só onde a palavra
// o exige.
function projecaoFervor(alvo, grupo, fem) {
  return {
    alto: `"Se um nome hão de me arrancar, arranco-o eu: ${alvo}. Digo-o de viva voz e respondo pelo que digo. Prova, ninguém ma pediu; tenho a minha certeza, e ela não me falha desde ${fem ? 'moça' : 'moço'}."`,
    oficio: `"Nome {detective.treatment} quer, nome eu dou: ${alvo}. Isso me corre na cabeça desde o primeiro dia e não me larga. Papel que o firme, não tenho; dá-me o faro, que raramente me atraiçoou."`,
    chao: `"Um nome eu dou, já que {detective.treatment} o pede: ${alvo}. Por quê, não sei dizer; sei, e chega."`,
  }[grupo];
}

// O b2 oblíquo colorido pelo decoro: a recusa por pudor dobrada à fala da
// vila, num fraseado distinto do sufixo da evasiva (sem eco). Sem antítese
// "não X, por Y" aqui — a única sancionada do lote vive no sufixo da evasiva.
const OBLIQUO_DECORO = {
  alto: `"A vila diz o que sempre disse, e desta casa não sai eco. O mais que sei portas adentro, a boa educação manda guardar."`,
  oficio: `"A vila diz muita coisa, e metade se desdiz no dia seguinte. Do que corre no balcão, muito não se repete: ficaria mal na boca, e assim fica."`,
  chao: `"Dizem muito, e eu ouço pouco. O que não é de se dizer fica comigo, e não me leve a mal."`,
};

// O sufixo de decoro na evasiva: rubrica física (a voz baixa) e a recusa por
// pudor. Aqui mora a única antítese "não por culpa" do lote.
const DECORO_EVASIVA_SUFIXO = ' E emenda, mais baixo: "há o que se cala por pudor, não por culpa."';

// ---------------------------------------------------------------------
// BEAT 2 — o arremate, por papel de diálogo (réu, testemunha, periférico)
// × tom. O réu deflete sem confessar; a testemunha fica no declarado; o
// periférico dá a vila. A saída fecha a conversa (opcoes: []).
// ---------------------------------------------------------------------
function falaB2(ctx, tom) {
  const { pessoa, papel, vitima } = ctx;
  const eleVitimaTr = vitima.genero === 'feminino' ? 'a' : 'o';
  const eleVitima = vitima.genero === 'feminino' ? 'ela' : 'ele';
  const fem = pessoa.genero === 'feminino';
  // Duas saídas por classe (v2 — contra falas gêmeas entre suspeitos da
  // mesma classe no mesmo caso), sorteadas por suspeito. OS da vila na
  // mesa: o palco é o BATENTE da casa do interrogado — ninguém se levanta
  // de cadeira nem toma chapéu de mesa; quem encerra recua para dentro.
  const SAIDAS = {
    gentry: [
      () => 'Recolhe-se um passo, a mão já na porta. "Se a lei precisar de mais, sabe onde a casa fica."',
      () => 'Inclina a cabeça, medido. "A casa fica a par do que se apurar. Passar bem, {detective.treatment}."',
    ],
    // KB vestuário: sobrecasaca clerical de pároco anglicano, não batina.
    clero: [
      () => 'Alisa a sobrecasaca. "A paróquia fica às ordens."',
      () => 'Pousa a mão na ombreira, um instante. "Que se apure tudo, e depressa. A paróquia reza por isso."',
    ],
    profissional: [
      (f) =>
        f
          ? 'Recolhe as luvas. "O inquérito sabe onde me encontrar."'
          : 'Recua para dentro do vão. "O inquérito sabe onde me encontrar."',
      (f) =>
        f
          ? 'Recolhe as luvas, um dedo por vez. "Qualquer papel que falte, mande buscar."'
          : 'Ajeita o colarinho. "Qualquer papel que falte, mande buscar."',
    ],
    comerciante: [
      (f) =>
        f
          ? 'Ajeita o xale sobre os ombros. "O negócio não se guarda sozinho."'
          : 'Abotoa o casaco contra o frio da porta. "O negócio não se guarda sozinho."',
      (f) =>
        f
          ? 'Prende o xale. "Se faltar soma ou data, o livro do balcão as tem."'
          : 'Abotoa o casaco. "Se faltar soma ou data, o livro do balcão as tem."',
    ],
    artesao: [
      () => 'Volta-se para dentro sem esperar licença. "O serviço ficou aceso."',
      () => 'Limpa as mãos uma na outra. "Chamando, venho. O serviço fica onde ficou."',
    ],
    lavrador: [
      () => 'Assenta o chapéu de volta. "Se é tudo, volto à lida."',
      () => 'Gira o chapéu uma volta nas mãos. "Deus ajude a achar quem foi. Passar bem."',
    ],
    criadagem: [
      () => 'Alisa o avental. "Com licença, que a casa não para."',
      () => 'Recua com meia mesura. "Se a casa puder servir em mais, é só mandar."',
    ],
    servico_do_condado: [
      () => 'Ajeita o cinturão. "A ronda não espera."',
      () => 'Confere o próprio termo com os olhos. "Fica lavrado. Ao dispor do inquérito."',
    ],
  };
  const saida = variante(SAIDAS[pessoa.classeSocial] || SAIDAS.lavrador, `${ctx.sal}|saida`)(fem);

  // Macrogrupo de classe: o arranque do corpo varia por ele (a célula da
  // grade tem de ser reconhecível de nome coberto — guia §8.4).
  const grupo = ['gentry', 'clero', 'profissional'].includes(pessoa.classeSocial)
    ? 'alto'
    : ['comerciante', 'artesao'].includes(pessoa.classeSocial)
      ? 'oficio'
      : 'chao';
  let corpo;
  if (papel === 'reu') {
    // P23: com forasteiro plausível no caso, a deflexão "veio de fora" é uma
    // tese sustentável (há de fato estranho no mundo do caso); sem ele, o réu
    // não aponta para fora — recusa nomear e defere ao inquérito, sem o tell.
    const reuFala = ctx.deflexaoSustentavel
      ? {
          firme: `"Nome nenhum me cabe dar, ${'{detective.treatment}'}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora."`,
          cordial: `"${vitima.nome} era do trato de todos os dias; eu ${eleVitimaTr} conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo."`,
          tecnico: `"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta."`,
          obliquo: `"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo."`,
        }
      : {
          firme: `"Nome nenhum me cabe dar, ${'{detective.treatment}'}. O que penso, penso baixo; suspeita sem ter com quê eu não boto em ninguém."`,
          cordial: `"${vitima.nome} era do trato de todos os dias; eu ${eleVitimaTr} conhecia como se conhece vizinho. Quem fez isto, não sei, e não hei de fingir que sei."`,
          tecnico: `"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. Quem aponta é o inquérito; eu respondo o que me perguntam."`,
          obliquo: `"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo."`,
        };
    corpo = reuFala[tom];
  } else if (papel === 'testemunha') {
    corpo = {
      firme: `"Nome não ponho em ninguém. O que declarei à ronda, declarei; palavra dada não se tira."`,
      cordial: `"${vitima.nome} era d${vitima.genero === 'feminino' ? 'as' : 'os'} que se cumprimentam na rua. O que sei do resto está no livro do guarda, tal e qual."`,
      tecnico: `"Do que vi e ouvi já dei conta por termo, com hora. Fora disso, nada tenho que sirva a um inquérito."`,
      obliquo: `"A vila fala, e fala alto. Eu digo só o que passou pelos meus olhos e ouvidos; o resto morre comigo."`,
    }[tom];
  } else {
    corpo = {
      firme: {
        alto: `"Nomes não aponto. Desafeto declarado de ${vitima.nome}, não me constou nenhum."`,
        oficio: `"Nome não tenho que dar. Se ${vitima.nome} tinha desafeto, não foi freguês meu."`,
        chao: `"Nome não dou, que não o tenho. Desafeto declarado de ${vitima.nome} eu não conhecia."`,
      }[grupo],
      cordial: {
        alto: `"${vitima.nome}? Trato de cumprimento, e pontual no banco da igreja, ao que se via."`,
        oficio: `"${vitima.nome}? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado."`,
        chao: `"${vitima.nome}? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos."`,
      }[grupo],
      tecnico: {
        alto: `"Tratos, os de vizinho de terra; nada em papel que um inquérito leia."`,
        oficio: `"Tratos meus com ${eleVitima}, poucos e pagos. Se há soma pendente em algum livro, o livro que fale."`,
        chao: `"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu."`,
      }[grupo],
      obliquo: {
        alto: `"A vila diz o que sempre disse; desta casa não sai eco."`,
        oficio: `"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê."`,
        chao: `"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha."`,
      }[grupo],
    }[tom];
  }
  // P9 Via B — a contra-hipótese: o ACESSOR menciona familiaridade com o
  // instrumento. Aparece em NÃO-réu (periférico OU testemunha que também é
  // acessor — o papel depende de ter carta com origemTestemunha, mas o
  // acesso é ortogonal). firme e tecnico (2/4 tons). Ramificado por classe
  // de instrumento (físico / veneno / doméstico): "ferramenta" e "peguei
  // emprestada" não fazem sentido para venenos (consumíveis comprados na
  // botica) nem para pano/travesseiro (item doméstico). Os marcadores da
  // guarda do QA: "peguei emprestada", "conheço de mão", "já pus a mão"
  // ou "já comprei".
  if (papel !== 'reu' && ctx.ehAcessor) {
    const ehVeneno = ['papel_de_arsenico', 'frasco_de_laudano'].includes(ctx.instrumento);
    const ehDomestico = ctx.instrumento === 'travesseiro_ou_pano';
    if (tom === 'firme') {
      if (ehVeneno) {
        corpo = {
          alto: `"Nomes não aponto. O preparado, porém, eu conheço de mão: ficava à vista de quem visitava aquela casa."`,
          oficio: `"Nome não tenho que dar. Preparado daqueles, já comprei do mesmo boticário; não fui o primeiro nem o último."`,
          chao: `"Nome não dou, que não o tenho. Aquele preparado eu conheço de mão; ficava onde qualquer um via."`,
        }[grupo];
      } else if (ehDomestico) {
        corpo = {
          alto: `"Nomes não aponto. A peça, porém, eu conheço de mão: quem frequentava aquela casa via no mesmo lugar."`,
          oficio: `"Nome não tenho que dar. Coisa daquelas eu conheço de mão; quem entrava ali encontrava à vista, como eu encontrei."`,
          chao: `"Nome não dou, que não o tenho. Naquela coisa já pus a mão; ficava ali onde qualquer um via."`,
        }[grupo];
      } else {
        corpo = {
          alto: `"Nomes não aponto. Ferramenta daquelas, porém, eu conheço de mão: passa pela casa mais de uma vez ao mês."`,
          oficio: `"Nome não tenho que dar. Daquela ferramenta, sim, já me servi; peguei emprestada mais de uma vez."`,
          chao: `"Nome não dou, que não o tenho. A ferramenta eu conheço de vista; já peguei emprestada, como qualquer um."`,
        }[grupo];
      }
    } else if (tom === 'tecnico') {
      if (ehVeneno) {
        corpo = {
          alto: `"Tratos, os de vizinho de terra; nada em papel que um inquérito leia. O preparado eu conheço de mão; ficava ao alcance de qualquer visita."`,
          oficio: `"Tratos meus com ${eleVitima}, poucos e pagos. O preparado eu conheço: já comprei do mesmo balcão, e não fui o único."`,
          chao: `"Tratos, poucos; paga e trabalho, quando havia. Aquele preparado eu conheço de mão; ficava onde qualquer um alcançava."`,
        }[grupo];
      } else if (ehDomestico) {
        corpo = {
          alto: `"Tratos, os de vizinho de terra; nada em papel que um inquérito leia. A peça eu conheço de mão; mais de uma visita passou por aquele cômodo."`,
          oficio: `"Tratos meus com ${eleVitima}, poucos e pagos. A peça eu conheço de mão; ficava onde qualquer um que entrasse via."`,
          chao: `"Tratos, poucos; paga e trabalho, quando havia. Naquela coisa já pus a mão; quem entrava na casa via."`,
        }[grupo];
      } else {
        corpo = {
          alto: `"Tratos, os de vizinho de terra; nada em papel que um inquérito leia. A peça de ofício eu conheço de mão; passou por ali mais de uma vez."`,
          oficio: `"Tratos meus com ${eleVitima}, poucos e pagos. A ferramenta eu conheço: peguei emprestada do mesmo gancho, e devolvi."`,
          chao: `"Tratos, poucos; paga e trabalho, quando havia. Naquela ferramenta já pus a mão; ficava ao alcance de qualquer um."`,
        }[grupo];
      }
    }
  }
  // Fase 2 — a projeção (fervor) reescreve o b2 FIRME; o decoro reescreve o
  // b2 OBLÍQUO. Só em não-assassino (o réu nunca porta estas flags; a guarda
  // do qa.mjs fiscaliza). Tento discreto: colore o beat, não cria nó. Ver o
  // cabeçalho da Fase 2 acima.
  if (papel !== 'reu') {
    // O acesso (P9) prevalece sobre o fervor em firme (fair play > colorido);
    // fervor ainda vive nos outros tons se a flag existir.
    if (tom === 'firme' && ctx.acusaComFervor && ctx.alvoFervor && !ctx.ehAcessor) {
      corpo = projecaoFervor(ctx.alvoFervor, grupo, fem);
    } else if (tom === 'obliquo' && ctx.omitePorDecoro) {
      corpo = OBLIQUO_DECORO[grupo];
    }
  }
  // Fase 3 — defende_demais_o_morto reescreve o b2 CORDIAL, em QUALQUER papel
  // (réu com vínculo E inocente com vínculo dizem o mesmo — a presença cruzada
  // é o anti-tell). Substitui o corpo cordial pelo afeto partilhado.
  if (tom === 'cordial' && ctx.defendeDemais) {
    corpo = cordialDefende(vitima.nome, vitima.genero === 'feminino', grupo);
  }
  // O tento do réu com linha do tempo NÃO pode desmenti-lo (spec §8.6):
  // ganha versão que preserva o trait sem cruzamento feito pelo narrador.
  const tento =
    tom === ctx.tomRessonante
      ? {
          medroso: ' Já com a porta a meio fechar, detém-se, como quem ainda tem uma palavra; e a fecha sem a dizer.',
          preciso: ' Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato.',
          tagarela: ' Já na porta, ainda oferece o tempo que fez na sexta e o nome de quem passou tarde pela estrada.',
          linha_tempo_nao_confiavel:
            papel === 'reu'
              ? ' Na despedida, torna a citar a hora, devagar, como quem a confere pela primeira vez.'
              : ' Na despedida, cita a mesma hora de antes, e a hora vem diferente.',
        }[ctx.trait] || ''
      : '';
  return [`${corpo} ${saida}${tento}`];
}

// ---------------------------------------------------------------------
// A CARTA DE ÁLIBI (spec §8.3): o paradeiro declarado nasce da rotina do
// pacoteEspacial na faixa do crime; o réu posto NA cena pela rotina
// declara a moradia com recolhimento cedo (a mentira cai só por confronto).
// ---------------------------------------------------------------------
// O fecho do termo segue o PALCO do interrogatório (OS da vila na mesa):
// à porta da casa, no serviço do prédio de encontro, ou no próprio posto
// (o guarda que mora sob o teto dele — lá há mesa de tábua, não joelho).
const FECHOS_TERMO = {
  casa: ['Tomado por termo à porta, pela mão do constable.', 'Declarado do batente, o constable escrevendo sobre o joelho.'],
  encontro: ['Tomado por termo ali mesmo, pela mão do constable.', 'Declarado de pé, o serviço à espera, diante do constable.'],
  posto: ['Tomado por termo no próprio posto, pela mão do constable.', 'Declarado à mesa de tábua do posto, diante do constable.'],
};

function cartaDeAlibi(ctx) {
  const { pessoa, faixa, papel, nomePredio, cenaId, sal } = ctx;
  // E3 §4.5 — a AUSÊNCIA declarada: o paradeiro é a vila-mercado, fora do
  // grafo da vila. Fala verdadeira (o ausente é inocente); a corroboração
  // mora no livro de hóspedes, a hora e meia de estrada ou um telegrama.
  if (ctx.ausencia) {
    const janelaAus = JANELA_DECLARADA[faixa];
    // Só noite/madrugada chega aqui (o montador veta ausência na faixa
    // dia — o livro de hóspedes corrobora uma noite). O motivo do pernoite
    // ancora a plausibilidade (parecer do perito): negócio fechado tarde,
    // estrada de outubro escura desde as cinco e meia.
    const falaAus = `"Estive em ${ctx.ausencia} desde a véspera, que o negócio só se fechou ao escurecer; dormi na estalagem de lá e tomei a estrada de volta pela manhã."`;
    const fechoAus = variante(FECHOS_TERMO[ctx.palcoDialogo] || FECHOS_TERMO.casa, `${sal}|alibi|fecho`);
    return {
      id: `gen_alibi_${pessoa.id}`,
      localidade: ctx.localidadeInterrogatorio,
      // P6 (item 11): o rótulo clicável carrega a informação a cruzar — o
      // lugar declarado + a faixa —, não um título opaco ("A Noite de X").
      // O lugar (ctx.ausencia) é o que discrimina; a faixa é a mesma do caso.
      textoDisplay: `${ctx.ausencia} (${FAIXA_CURTA[faixa]})`,
      carimboPadrao: `Paradeiro declarado: ${ctx.ausencia} (${FAIXA_CURTA[faixa]})`,
      descricao: `${falaAus} ${fechoAus}`,
      tagsOcultas: {
        dominio: 'comportamental',
        subDominio: 'alibi',
        declaranteId: pessoa.id,
        horaInicioDeclarada: janelaAus.inicio,
        horaFimDeclarada: janelaAus.fim,
        corroborado: false,
      },
    };
  }
  const lugarReal = pessoa.pacoteEspacial.rotina[faixa];
  const moradia = pessoa.pacoteEspacial.moradia;
  const mentiraDeCena = papel === 'reu' && lugarReal === cenaId;
  // A mentira de VERGONHA (v2 — periféricos com segredo): quem esteve à
  // porta da vítima por razão inocente declara a casa e o recolhimento
  // cedo. A redação é a MESMA do inocente caseiro e do réu (nenhuma
  // assinatura tipográfica); a mentira cai pelo rastro, não pela frase.
  const mentiraDeVergonha = !!ctx.segredo;
  const lugarDeclarado = mentiraDeCena || mentiraDeVergonha ? moradia : lugarReal;
  const rotulo = nomePredio(lugarDeclarado);
  const forma = formasDoLugar(rotulo);
  const formaMoradia = formasDoLugar(nomePredio(moradia));
  const janela = JANELA_DECLARADA[faixa];

  // A testemunha do visto-com-vida declarou um avistamento DENTRO da
  // janela do próprio álibi: a fala assume o encontro à porta de casa —
  // sem isto, as duas declarações do mesmo nome se excluiriam (parecer
  // da OS de lapidação, bloqueante B-8). Só quando o encontro não cabe
  // no lugar declarado (quem partilha teto com a vítima já é coerente).
  const encontroNaJanela =
    papel !== 'reu' &&
    ctx.horaVistoVivo != null &&
    ctx.horaVistoVivo >= janela.inicio &&
    ctx.horaVistoVivo <= janela.fim &&
    ctx.vitima.pacoteEspacial.rotina[faixa] !== lugarDeclarado;
  const horaEncontro = encontroNaJanela ? horaFalada(ctx.horaVistoVivo) : null;

  let falaDeclarada;
  if (faixa === 'dia') {
    // Redação neutra de classe ("serviço de porta para dentro" é idioma
    // de criadagem) e partilhada entre inocente caseiro e réu — sem
    // assinatura de template.
    falaDeclarada =
      lugarDeclarado === moradia
        ? encontroNaJanela
          ? `"Do meio-dia às seis estive em casa, ${forma.em}. ${ctx.vitima.nome} me bateu à porta ${horaEncontro}; da porta mesmo nos despedimos, e de sair não saí."`
          : `"Do meio-dia às seis estive em casa, ${forma.em}, e de porta para fora não pus o pé."`
        : `"Do meio-dia às seis estive ${forma.em}, no serviço. Quem lá esteve me viu."`;
  } else if (mentiraDeCena) {
    // MESMA redação do ramo inocente-caseiro (abaixo): fraseado exclusivo
    // do réu seria assinatura tipográfica — o jogador acharia o réu
    // comparando as cinco cartas, não cruzando provas. A mentira está no
    // LUGAR declarado, e cai por confronto, como a de Silas.
    falaDeclarada = `"Recolhi-me ${formaMoradia.a} às oito e não tornei a sair antes de clarear."`;
  } else if (lugarDeclarado === moradia) {
    falaDeclarada = encontroNaJanela
      ? `"Recolhi-me ${forma.a} às oito. ${ctx.vitima.nome} me bateu à porta ${horaEncontro}; do batente mesmo nos despedimos, e não tornei a sair antes de clarear."`
      : `"Recolhi-me ${forma.a} às oito e não tornei a sair antes de clarear."`;
  } else {
    falaDeclarada = `"Estive ${forma.em} das oito às onze; dali fui direto ${formaMoradia.para}, dormir."`;
  }

  // KB inquérito §2: quem escreve o termo na vila é o próprio guarda/
  // constable — não há escrevente civil em 1893. OS da vila na mesa: o
  // termo é tomado onde a pessoa é ouvida (FECHOS_TERMO, por palco).
  const fecho = variante(FECHOS_TERMO[ctx.palcoDialogo] || FECHOS_TERMO.casa, `${sal}|alibi|fecho`);
  return {
    id: `gen_alibi_${pessoa.id}`,
    localidade: ctx.localidadeInterrogatorio,
    // P6 (item 11): rótulo informativo — o lugar declarado + a faixa. O
    // lugar (rotulo) é o dado que cai por confronto; a mesma composição do
    // carimbo, agora também no negrito clicável.
    textoDisplay: `${rotulo} (${FAIXA_CURTA[faixa]})`,
    carimboPadrao: `Paradeiro declarado: ${rotulo} (${FAIXA_CURTA[faixa]})`,
    descricao: `${falaDeclarada} ${fecho}`,
    tagsOcultas: {
      dominio: 'comportamental',
      subDominio: 'alibi',
      declaranteId: pessoa.id,
      horaInicioDeclarada: janela.inicio,
      horaFimDeclarada: janela.fim,
      corroborado: false,
    },
  };
}

// ---------------------------------------------------------------------
// CONFRONTOS (spec §8.4): a tabela fechada carta → pergunta → reação.
// Cada entrada devolve { pergunta, reacao } já com nomes e lugares postos.
// ---------------------------------------------------------------------
// A fala do réu ao ser confrontado com a âncora sem lesão (vaso de veneno ou
// pano de abafo): a paridade da deflexão vem de a peça ser de posse comum em
// 1893 — não singulariza o réu. Nunca fala em lâmina, ferrugem ou lesão. O
// fraseado do réu NÃO repete a legenda da carta (senão o suspeito parece
// recitá-la), e o "guardado" segue o gesto da peça: frasco se lava, papel se
// sacode (arsênico é papel a seco — não se lava), pano de cama se lava.
const FALA_SEM_LESAO = {
  frasco_de_laudano: {
    comum: 'Láudano toma-se contra a dor, e a botica o dá a quem pede',
    descarte: 'frasco vazio joga-se fora',
    guardadoPergunta: 'foi lavada, com resto ainda no gargalo',
    guardadoDefesa: 'Lavo o que é meu; não guardo vidro sujo em casa',
  },
  papel_de_arsenico: {
    comum: 'Papel de rato tem em toda venda, e em toda casa com celeiro',
    descarte: 'papel de rato usa-se e some',
    guardadoPergunta: 'foi sacudida e dobrada de novo, com pó ainda nas dobras',
    guardadoDefesa: 'Sacudo o que é meu; não guardo papel sujo em casa',
  },
  travesseiro_ou_pano: {
    comum: 'Pano de abafo há em todo leito, e a feira o vende por quase nada',
    descarte: 'pano velho gasta-se e troca-se',
    guardadoPergunta: 'foi lavada e guardada, ainda com fiapo na trama',
    guardadoDefesa: 'Lavo a roupa de cama; suja não se guarda',
  },
};

function confrontoDaCarta({ carta, pessoa, papel, bruto, nomePredio }) {
  const t = carta.tagsOcultas || {};
  const td = carta.textoDisplay;

  // pertenceA: instrumento, pertence, rastro de dinheiro, fuga.
  if (t.pertenceA === pessoa.id && t.subDominio === 'instrumento_oficio') {
    const classe = (bruto.crime.vestigios.find((v) =>
      ['instrumento_abandonado', 'instrumento_faltando', 'instrumento_guardado_umido'].includes(v.classe)
    ) || {}).classe;
    // Métodos sem lesão (veneno, sufocação): o confronto é sobre a peça
    // (vaso/pano), nunca a lâmina/lesão.
    const vf = FALA_SEM_LESAO[t.tipoVestigio];
    if (vf) {
      if (classe === 'instrumento_faltando') {
        return {
          pergunta: `[${td}] Por que falta essa peça entre as suas coisas?`,
          reacao: `${pessoa.nome} olha o vão apontado no papel como se o visse de novo. "Falta, e ${vf.descarte}; disso não guardo conta. ${vf.comum}. Onde eu estava, dei por termo ao guarda, e lá está." As mãos ficam quietas enquanto responde.`,
        };
      }
      if (classe === 'instrumento_guardado_umido') {
        return {
          pergunta: `[${td}] Por que a peça ${vf.guardadoPergunta}?`,
          reacao: `${pessoa.nome} responde sem olhar a peça duas vezes. "${vf.guardadoDefesa}. ${vf.comum}. E o constable lavrou de próprio punho o lugar em que me achei." E devolve a peça sem a olhar de novo.`,
        };
      }
      return {
        pergunta: `[${td}] Por que a peça achada junto do corpo tem o seu nome na vila?`,
        reacao: `${pessoa.nome} olha a peça sem estender a mão. "${vf.comum}; não sou só eu a tê-la. Onde a acharam, não fui eu que a pus; à ronda dei razão da minha hora, e razão ficou escrita." A voz não muda do começo ao fim.`,
      };
    }
    if (classe === 'instrumento_faltando') {
      return {
        pergunta: `[${td}] Por que falta essa peça entre as suas coisas?`,
        reacao: `${pessoa.nome} olha o vão apontado no papel como se o visse de novo. "Falta, e dou pela falta há dias. Ferramenta nesta vila empresta-se sem se pedir, e devolve-se quando lembra. Quem a levou não me deu o nome; onde eu estava, dei por termo ao guarda, e lá está." As mãos ficam quietas enquanto responde.`,
      };
    }
    if (classe === 'instrumento_guardado_umido') {
      return {
        pergunta: `[${td}] Por que a peça foi guardada lavada, com a junta ainda úmida?`,
        reacao: `${pessoa.nome} responde sem olhar a peça duas vezes. "Lavei-a porque se lava ferramenta; ferrugem não espera inquérito. O feitio casa com a lesão, diz esse papel; casa também com metade das bancadas do condado. E o constable lavrou de próprio punho o lugar em que me achei." E devolve a peça sem a olhar de novo.`,
      };
    }
    return {
      pergunta: `[${td}] Por que o instrumento achado junto do corpo tem o seu nome na vila?`,
      reacao: `${pessoa.nome} olha a peça sem estender a mão. "Do meu uso, quem o nega. Perde-se ferramenta como se perde chapéu, e assim se some, sem que ninguém peça licença. Onde a acharam, não fui eu que a pus; à ronda dei razão da minha hora, e razão ficou escrita." A voz não muda do começo ao fim.`,
    };
  }
  // rastro_de_visita (v2 — periféricos com segredo): apresentado ao
  // dono, o papel arranca a admissão que o desonera (spec §8.6: o
  // inocente dá o fato; a conclusão de inocência segue sendo do jogador).
  if (t.pertenceA === pessoa.id && t.subDominio === 'rastro_de_visita') {
    const vit = bruto.mundo.elenco.find((p) => p.id === bruto.crime.vitimaId);
    if (t.revelaSegredo === 'pedido_recusado') {
      return {
        pergunta: `[${td}] Este papel é da sua letra. O que foi pedir?`,
        reacao: `${pessoa.nome} lê as próprias linhas até o fim antes de falar. "Fui pedir, e o papel diz o quê. Saí com a recusa e com a vergonha, e das duas fiz segredo. À porta de ${vit.nome} estive; à hora da morte, não." E devolve o bilhete dobrado ao meio.`,
      };
    }
    return {
      pergunta: `[${td}] O seu nome está nesta nota. Que trato era esse?`,
      reacao: `${pessoa.nome} cobre a soma com a mão, devagar, e a descobre. "Trato havia, e era para se fechar calado; a vila come um nome em três dias. Estive lá para o assinar e voltei sem assinatura. Disso menti; do resto, não."`,
    };
  }
  if (t.pertenceA === pessoa.id && t.subDominio === 'objeto_pessoal') {
    return {
      pergunta: `[${td}] Por que o par disto está entre as suas coisas?`,
      reacao: `${pessoa.nome} vira o achado nos dedos uma vez e o pousa. "Meu, ou do meu feitio; comprei o par em feira, e outros levaram igual. Como foi parar com quem morreu, isso pergunte a quem o pôs lá; àquela hora eu tinha onde estar, e disso há registro." E o devolve à mão aberta, devagar.`,
    };
  }
  if (t.pertenceA === pessoa.id && t.subDominio === 'rastro_de_dinheiro') {
    return {
      pergunta: `[${td}] Por que soberanos novos, contados à vista de todos?`,
      reacao: `${pessoa.nome} não conta a moeda de novo. "Contei-os à vista porque não devia nada a ninguém. Foi paga de serviço, e serviço pago não é crime. O nome de quem pagou, esse fica comigo até a lei o exigir por escrito; das minhas horas já dei conta, e ficou por termo."`,
    };
  }
  if (t.pertenceA === pessoa.id && t.subDominio === 'fuga_apressada') {
    return {
      pergunta: `[${td}] Por que o rasgo do seu casaco encaixa neste retalho?`,
      reacao: `${pessoa.nome} estende o braço e mostra a manga pelo avesso. "Rasguei-o num prego, e prego não falta nesta vila. Se o pano encaixa, encaixa; a porta onde o acharam eu não conheço. Da minha hora dei razão ao constable, e ficou por termo." Recolhe o braço e espera a pergunta seguinte.`,
    };
  }

  // origemTestemunha: visto-com-vida e ruído — a testemunha reafirma.
  if (carta.origemTestemunha === pessoa.id && t.subDominio === 'ultima_vez_visto') {
    return {
      pergunta: `[${td}] A que horas, exatamente, viu a vítima com vida?`,
      reacao: `${pessoa.nome} responde sem pedir o termo para ler. "Declarei à ronda e torno a declarar: vi quem vi, em pé e falando, à hora que dei. Não foi de passagem: parei, troquei o cumprimento, e só então segui caminho. Disso não tiro uma linha." E deixa que o papel diga o resto.`,
    };
  }
  if (carta.origemTestemunha === pessoa.id && t.subDominio === 'ruido_ouvido') {
    return {
      pergunta: `[${td}] O que exatamente a parede deixou passar naquela hora?`,
      reacao: `${pessoa.nome} conta de novo, na mesma ordem. "Pancada primeiro, móvel no chão depois, e depois mais nada. A divisa ali é de tábua, e tábua deixa passar tudo; por isso ouvi. Foi o que ouvi e foi o que declarei. Em barulho eu não ponho nome de gente."`,
    };
  }
  return null;
}

// ---------------------------------------------------------------------
// O PISO DE CONFRONTO (OS-R9 · Fase 2) — e por que ele teve de existir.
//
// `confrontoDaCarta` só responde quando a carta É daquela pessoa, ou saiu
// da boca dela. A Fase 0 mediu o que isso custa em lote: 53 das 155
// árvores não tinham confronto NENHUM, e o dossiê externo mediano tinha
// UMA carta. Com dossiê de um, `corteDeE2(1) = 1` — ter zero é E0, ter a
// única é E2, e não existe nada entre as duas.
//
// E a medida seguinte é a que obrigou a agir: o réu alcança os três níveis
// em 31 casos de 31; os inocentes, em 43%. **Quantos degraus um suspeito
// tem passaria a ser um delator** — o mesmo defeito que a GR6-5 matou no
// tutorial, chegando pela porta do tamanho do dossiê em vez da do corte.
//
// O piso resolve-o na origem e sem carta nova: o perito pode pôr diante de
// QUALQUER pessoa do caso as duas peças que todo caso tem — o que o corpo
// mostra e a última hora em que se viu a vítima viva. Toda gente reage a
// isso, e reage no seu registro. Com o piso, nenhum dossiê fica abaixo de
// dois, e os três níveis passam a ser alcançáveis por construção.
//
// TRÊS REGRAS QUE O PISO NÃO PODE QUEBRAR:
//   • não entrega prova (GR9-3): a reação é caráter e recusa, jamais fato
//     novo do caso, e nenhuma delas traz marcador de carta;
//   • não sabe medicina: quem responde é leigo de 1893 diante de um papel
//     de perícia. Devolve o papel, benze-se, ou diz que disso não entende.
//     Nenhuma boca do piso lê lesão — quem lê é o mestre (G8);
//   • é a MESMA para todos (GR9-2): a grade é de classe, e não há célula
//     que só o réu ou só o inocente ocupe.
// ---------------------------------------------------------------------
const CARTAS_DO_PISO = ['gen_lesao_fatal', 'gen_visto_vivo'];

const PISO_CORPO = {
  alto: [
    (v) =>
      `Recebe o papel, lê duas linhas e o pousa virado para baixo. "Disto não sou ${v.leitorA} nem quero ser. Mandei o que havia a mandar à casa enlutada; do que está escrito aí, responde quem o escreveu."`,
    () =>
      'Segura o papel pela borda e devolve-o sem o virar. "Deixe isso com o médico do condado, faça o favor. O que a casa deve a esta morte já foi mandado, e não é leitura de papel."',
  ],
  oficio: [
    (v) =>
      `Enxuga a mão no avental antes de tocar o papel, e mesmo assim não o toma. "Não me ponha isso à frente. Servi àquela casa o que ela me encomendava; o que fizeram com ${v.eleVitima} depois disso é conta de outro."`,
    () => 'Olha o papel de onde está, sem chegar a mão. "Guarde. Uma coisa é saber que morreu; outra é ler como. Da primeira dou conta, da segunda não."',
  ],
  chao: [
    (v) =>
      `Faz o sinal da cruz depressa, e só depois olha o papel. "Deus ${v.oVitima} tenha. Do que aí está escrito não sou eu que hei de dar conta, {detective.treatment}. Diga-me o que quer perguntar, que eu respondo."`,
    () =>
      'Recua meio passo do papel estendido. "Isso é coisa de médico. Perguntou-me da minha hora, e da minha hora respondi. Do resto não ponho palavra."',
  ],
};

const PISO_ULTIMA_HORA = {
  alto: [
    'Confere a hora escrita no papel contra a própria memória antes de falar. "Àquela hora esta casa jantava, e jantava com gente à mesa. Se a hora é essa, é essa; não é a minha."',
    'Lê a hora e devolve o papel dobrado no mesmo vinco. "Não ponho em dúvida quem a deu. Digo apenas que a minha hora daquele dia está lavrada, e não é matéria de opinião."',
  ],
  oficio: [
    'Segue a hora com o dedo até o fim da linha. "Àquela hora eu fechava a porta do serviço, e fecho-a à mesma hora há anos. Quem passa na rua a essa hora vê-me fechá-la."',
    'Olha a hora e assente uma vez. "Pode ser. A essa hora estou onde estou todos os dias, e há quem passe e me veja lá."',
  ],
  chao: [
    'Repete a hora em voz alta, como quem a fixa. "Essa hora eu tinha o que fazer, e o que fazia não se larga no meio. Da minha, já está dito e lavrado."',
    'Ouve a hora e não a discute. "Se foi a essa hora, foi. Eu a essa hora estava na lida, e a lida tem quem a veja de longe."',
  ],
};

function confrontoDePiso({ carta, pessoa, vitima, sal }) {
  const grupo = ['gentry', 'clero', 'profissional'].includes(pessoa.classeSocial)
    ? 'alto'
    : ['comerciante', 'artesao'].includes(pessoa.classeSocial)
      ? 'oficio'
      : 'chao';
  // Três gêneros diferentes cruzam-se nestas duas linhas, e nenhum é o do
  // perito: quem responde, a vítima, e o tratamento. `{g:…}` só resolve o
  // terceiro — os outros dois flexionam-se aqui, com a ficha na mão.
  const femV = vitima.genero === 'feminino';
  const femP = pessoa.genero === 'feminino';
  const v = {
    eleVitima: femV ? 'ela' : 'ele',
    oVitima: femV ? 'a' : 'o',
    vistoA: femV ? 'vista' : 'visto',
    leitorA: femP ? 'leitora' : 'leitor',
  };
  const oSr = femP ? 'a senhora' : 'o senhor';
  const td = carta.textoDisplay;
  if (carta.id === 'gen_lesao_fatal') {
    return {
      pergunta: `[${td}] Olhe isto, e diga-me o que lhe ocorre.`,
      reacao: variante(PISO_CORPO[grupo], `${sal}|piso|corpo|${pessoa.id}`)(v),
    };
  }
  return {
    pergunta: `[${td}] Esta é a última hora em que ${vitima.nome} foi ${v.vistoA} com vida. Onde estava ${oSr}?`,
    reacao: variante(PISO_ULTIMA_HORA[grupo], `${sal}|piso|hora|${pessoa.id}`),
  };
}

// A evasiva (fallback defensivo), por classe social.
const EVASIVA_POR_CLASSE = {
  gentry: 'Olha o que se lhe mostra o tempo de o reconhecer, e devolve. "Disso a casa não sabe dar razão. Se há pergunta, faça-a por inteiro."',
  clero: 'Examina o que se lhe apresenta e o devolve com as duas mãos. "Disso não sei dar testemunho. Pergunte do rebanho, que do rebanho respondo."',
  profissional: 'Corre os olhos pelo que se lhe mostra e o devolve. "Fora do meu ofício, não arrisco palavra. Pergunte do que é meu."',
  comerciante: 'Olha o que se lhe mostra como quem confere fatura alheia. "Isto não passou pelo meu balcão. Do que passou, respondo com o livro na mão."',
  artesao: 'Olha por cima, o tempo de dois fôlegos, e encolhe os ombros. "Disso não entendo. Pergunte de ferramenta e de serviço, que disso dou conta."',
  lavrador: 'Chega o rosto para ver e faz que não com a cabeça. "Disso não sei dizer, {detective.treatment}. Da terra e do dia, pergunte o que quiser."',
  criadagem: 'Olha depressa e baixa os olhos. "Isso eu não sei o que é. Da casa e do serviço respondo; do resto não ponho palavra."',
  servico_do_condado: 'Examina como quem preenche folha. "Sem registro disto, não firmo nada. O que está lavrado, está lavrado; o resto se apura."',
};

// ---------------------------------------------------------------------
// O GATILHO DE COMPLEXO (OS `os-flags-psiquicas-no-dialogo.md`, Fase 1):
// a pergunta que desmonta a compostura. O gerador já compila
// `gatilho_de_complexo:<tema>` por pessoa (vetores_psiquicos.js); aqui ela
// ganha BOCA — um confronto SEM carta (canal lateral, camada de
// apresentação), cuja reação entrega BIOGRAFIA (o medo central do vetor),
// JAMAIS janela/causa/nexo. Fair play (spec §3 da OS): a mesma espécie de
// fala aparece no réu E em inocentes — nunca é assinatura de culpado. Por
// isso o portão dos ≥2 (derivarDialogos): o gatilho só se realiza quando
// há ao menos DOIS interrogáveis com gatilho no caso; senão (o réu seria o
// único a "perder a linha" — ~20% dos casos, telemetria da Fase 0) o
// gatilho fica mudo, para não virar tell.
//
// A pergunta é neutra de gênero do interrogado; a reação usa nome + gênero.
// Nenhum marcador [[carta]] entra aqui — é biografia, não prova (guarda no
// qa.mjs). Registro por época na kb-psique-e-crime (medo central de cada
// vetor) e na kb-mundo-vitoriano (asilo dos pobres, enterro de indigente,
// despejo e êxodo).
// ---------------------------------------------------------------------
const GATILHO_POR_TEMA = {
  inutilidade: {
    pergunta: '"Um dia ninguém mais há de precisar de si. Que lhe fica, nesse dia?"',
    reacao: (nome) =>
      `${nome} perde por um instante a compostura. "O senhor há de saber o que é ficar sem serventia para os seus. Vi acontecer com gente de bem: chega o dia em que ninguém lhe pede mais nada, e sobra à mesa um lugar que ninguém disputa. Um dia é o meu lugar. Não me sai da cabeça."`,
  },
  queda_de_status: {
    pergunta: '"E se o nome caísse na boca da vila, de uma tarde para a outra. Já temeu isso?"',
    reacao: (nome, fem) =>
      `Um músculo cede no rosto de ${nome}, e a voz baixa de tom. "Um nome leva três gerações para se firmar e uma tarde para virar assunto de taverna. Quem nunca o teve ignora o peso de o poder perder. Eu carrego esse peso desde ${fem ? 'menina' : 'menino'}, e durmo mal com ele."`,
  },
  erro_em_publico: {
    pergunta: '"Nunca lhe aconteceu errar diante de todos, e a vila inteira ver?"',
    reacao: (nome) =>
      `${nome} cala-se mais do que a pergunta pedia. "Uma vez, faz vinte anos, enganei-me diante da vila inteira. Ainda me lembro do silêncio da sala depois. Passei a conferir tudo três vezes, e ainda assim a mão treme quando sei que vão me ver trabalhar."`,
  },
  pecado_exposto: {
    pergunta: '"Todos guardam algo que não querem à luz. Qual é o seu?"',
    reacao: (nome) =>
      `As mãos de ${nome} apertam-se uma na outra. "Todos guardamos uma vergonha que só se confessa a Deus, ou nem a Ele. A minha não cabe num inquérito; hei de levá-la comigo à cova, se me for dada essa misericórdia."`,
  },
  obra_arruinada: {
    pergunta: '"Uma vida inteira de ofício, e um dia alguém a desfaz num gesto. Já imaginou?"',
    reacao: (nome) =>
      `${nome} olha as próprias mãos como quem confere uma ferramenta. "Ponho anos numa obra: o melhor da vista, o melhor dos dedos. Basta um que chegue depois e faça melhor, ou diga que faz, e o que levei a vida a erguer vira nada. Perder isso me tira o sono, e disso não me envergonho."`,
  },
  substituicao: {
    pergunta: '"Amar e ser trocado por outro. Passou por isso, alguma vez?"',
    reacao: (nome, fem) =>
      `A frase seguinte não vem; ${nome} desvia os olhos. "Estar ${fem ? 'trocada' : 'trocado'} por outro. Sim. A pessoa está ali, do nosso lado, e um dia olha por cima do nosso ombro. Não desejaria isso ao meu pior desafeto. Sei do que falo, e paro por aqui."`,
  },
  voltar_a_ser_ninguem: {
    pergunta: '"Custou a chegar aonde chegou. E se lhe tirassem tudo, e voltasse a não ser ninguém?"',
    reacao: (nome, fem) =>
      `${nome} endireita-se depressa demais. "Subi do nada, o senhor não imagina de que fundo. Tenho hoje casa, mesa posta, gente que me chama de ${fem ? 'senhora' : 'senhor'}. Voltar a ser o que fui é o que me acorda de noite."`,
  },
  ficar_preso: {
    pergunta: '"Nunca teve vontade de largar tudo e sumir por essa estrada afora?"',
    reacao: (nome, fem) =>
      `Algo se acende e logo se apaga no rosto de ${nome}. "Todo dia me dá essa vontade. Fico à janela, vejo a carroça do correio partir, e uma parte de mim vai junto. Mas há quem fique por minha conta, e a gente se amarra por eles. ${fem ? 'Presa' : 'Preso'}, é o que sou, e o senhor já sabe."`,
  },
  afronta_impune: {
    pergunta: '"Levar uma afronta e engolir calado, sem poder cobrar. Já lhe fizeram isso?"',
    reacao: (nome, fem) =>
      `O maxilar de ${nome} trava um instante antes da resposta. "Engoli afronta ${fem ? 'calada' : 'calado'}, mais de uma vez, e cada uma ficou entalada aqui. Bater, não bato; guardo, e guardo tudo. Pode lavrar isso, que vergonha não me dá."`,
  },
  invisibilidade: {
    pergunta: '"Já esteve numa sala cheia e sentiu que ninguém dava por si?"',
    reacao: (nome, fem) =>
      `${nome} ri ${fem ? 'sozinha' : 'sozinho'} um instante e para. "A vida inteira falei alto e fiz palhaçada para que reparassem em mim. Tire-me a graça e ninguém nesta vila torna a me ver. Dito assim parece pouca coisa; para mim é tudo."`,
  },
  irrelevancia: {
    pergunta: '"E quando a vila decide tudo sem lhe perguntar nada, como se não contasse?"',
    reacao: (nome) =>
      `${nome} inclina-se para a frente, e a voz ganha uma aresta. "Decidem tudo como se eu fosse parte da parede. Pois desta vila sei mais do que o vigário e o médico juntos; é o que me faz alguém. Tirem-me isso e fico do lado de fora, com o nariz no vidro."`,
  },
  miseria_a_vista: {
    pergunta: '"O asilo dos pobres, o enterro pago pela paróquia. Já teve medo de acabar assim?"',
    reacao: (nome, fem) =>
      `${nome} passa a mão pela roupa, devagar. "O asilo dos pobres. O caixão que a freguesia paga aos indigentes. Minha mãe temeu isso a vida toda, e o medo passou de mãe para ${fem ? 'filha' : 'filho'}. Guardo cada moeda por causa dele; quem me chama de ${fem ? 'avarenta' : 'avarento'} nunca sentiu esse frio."`,
  },
  perder_o_chao: {
    pergunta: '"Perder a casa, a terra, o chão onde os seus estão enterrados. Já lhe passou pela cabeça?"',
    reacao: (nome) =>
      `${nome} olha para além da parede, como quem vê outro lugar. "Os meus estão enterrados neste torrão: meu pai, o pai dele. Arrancar-me daqui seria arrancar raiz com terra e tudo, e o que se arranca assim não pega em canteiro nenhum. Já sonhei com a placa de vende-se ao portão, e acordo com o coração aos pulos."`,
  },
};

// O tema do gatilho de uma pessoa, lido das consequências psíquicas
// compiladas (build time; fora do pacote). Null se não há gatilho.
function temaDoGatilho(bruto, pessoaId) {
  const flags = bruto.psique?.consequencias?.porPessoa?.[pessoaId]?.flags || [];
  const f = flags.find((x) => x.startsWith('gatilho_de_complexo:'));
  return f ? f.slice('gatilho_de_complexo:'.length) : null;
}

// ---------------------------------------------------------------------
// O DERIVADOR: uma árvore por suspeito do pacote + as cartas de álibi.
// Ordem estável: a dos próprios suspeitos (alfabética no pacote) e a do
// array de cartas para os confrontos — replay byte a byte.
// ---------------------------------------------------------------------
export function derivarDialogos({ bruto, cartas, suspeitos, segredos = {}, ausencias = {}, acessorId = null, instrumento = null, marcasCorporais = {}, localidadeInterrogatorio = {} }) {
  const { mundo, crime, escolha } = bruto;
  const pessoas = indicePorId(mundo.elenco);
  const vitima = pessoas.get(crime.vitimaId);
  const nomePredio = (id) => {
    const p = mundo.cidade.predios.find((x) => x.id === id);
    return p ? p.rotulo : id;
  };

  const dialogos = {};
  const cartasAlibi = [];
  const cartaVisto = cartas.find((c) => c.id === 'gen_visto_vivo');
  // P23 (guarda de sustentação da deflexão): a fala "veio de fora" do réu só
  // é honesta se há forasteiro REAL no caso — a vítima de passagem
  // (vitima.forasteiro; o forasteiro é sempre a vítima, réu-forasteiro é
  // vetado). Um mero álibi fora da vila (ausencias: a vila-mercado satélite)
  // NÃO conta: é um aldeão que estava fora, não um forasteiro a acusar — a
  // deflexão apontaria um fantasma (playtest 20/07). Sem forasteiro real, o
  // réu não aponta para fora: recusa nomear e defere ao inquérito, sem o tell
  // (§5 do KB de fair play).
  const deflexaoSustentavel = !!vitima.forasteiro;

  // O gatilho de complexo (OS `os-flags-psiquicas-no-dialogo.md` §3): só se
  // realiza quando há ≥2 INTERROGÁVEIS com gatilho — senão o réu seria o
  // único a "perder a linha" e a compostura desmontada viraria tell (achado
  // da Fase 0: ~20% dos casos têm o réu como único portador). O portão vive
  // aqui, na camada de fala; o gerador de psique não muda.
  const interrogaveisComGatilho = suspeitos.filter((s) => temaDoGatilho(bruto, s.id)).length;
  const realizarGatilho = interrogaveisComGatilho >= 2;

  for (const s of suspeitos) {
    const pessoa = pessoas.get(s.id);
    if (!pessoa) continue;
    const sal = `${bruto.seed}|dialogo|${pessoa.id}`;
    const papel =
      pessoa.id === crime.assassinoId
        ? 'reu'
        : cartas.some((c) => c.origemTestemunha === pessoa.id)
          ? 'testemunha'
          : 'periferico';
    const trait = pessoa.traits[0] || null;
    const tomRessonante =
      MAPA_TRAIT_TOM[trait] ||
      (pessoa.comportamentos.includes('revela_sob_custo')
        ? 'cordial'
        : pessoa.comportamentos.includes('revela_facil')
          ? 'firme'
          : 'tecnico');

    // Fase 2 — o alvo da projeção (acusa_com_fervor): um OUTRO suspeito do
    // caso, NUNCA o réu (apontar o culpado "resolveria" — Knox nº6). Escolha
    // determinística por hashString salgado; null quando não há inocente além
    // de si (então o fervor não se realiza e o b2 firme fica no padrão).
    const acusaComFervor = temFlag(bruto, pessoa.id, 'acusa_com_fervor');
    let alvoFervor = null;
    if (acusaComFervor) {
      const candidatos = suspeitos.filter((x) => x.id !== pessoa.id && x.id !== crime.assassinoId);
      if (candidatos.length > 0) {
        const alvo = candidatos[hashString(`${bruto.seed}|fervor|${pessoa.id}`) % candidatos.length];
        alvoFervor = pessoas.get(alvo.id)?.nome || null;
      }
    }
    const omitePorDecoro = temFlag(bruto, pessoa.id, 'omite_por_decoro');
    // Fase 3 — a têmpera da mentira (postura B): calma (do réu ou periférica do
    // inocente) ⇒ 'calmo'; tensão (réu ou isca) ⇒ 'tenso'; senão 'neutro'. Só
    // modula o tento de trait no b1 (paridade §3, seleção cega ao papel).
    const calmo =
      temFlag(bruto, pessoa.id, 'mente_com_calma') ||
      temFlagPrefixo(bruto, pessoa.id, 'mente_com_calma_periferica:');
    const tenso = temFlag(bruto, pessoa.id, 'mente_sob_pressao');
    const temperamento = calmo ? 'calmo' : tenso ? 'tenso' : 'neutro';
    const defendeDemais = temFlag(bruto, pessoa.id, 'defende_demais_o_morto');

    const ctx = {
      pessoa,
      papel,
      trait,
      tomRessonante,
      vitima,
      faixa: escolha.faixa,
      cenaId: escolha.localId,
      nomePredio,
      sal,
      idCartaAlibi: `gen_alibi_${pessoa.id}`,
      deflexaoSustentavel,
      horaVistoVivo:
        cartaVisto && cartaVisto.origemTestemunha === pessoa.id ? cartaVisto.tagsOcultas.horaAvistamento : null,
      segredo: segredos[pessoa.id] || null,
      // E3 §4.5: rótulo da vila-mercado quando o paradeiro declarado é a
      // AUSÊNCIA (verificável só pelo livro de hóspedes a distância).
      ausencia: ausencias[pessoa.id] || null,
      // Fase 2: as flags de projeção/decoro (só em não-assassino; o réu
      // nunca as porta). Colorem b2 firme / evasiva + b2 oblíquo.
      acusaComFervor,
      alvoFervor,
      omitePorDecoro,
      // Fase 3: têmpera da mentira (modula o tento de trait no b1) e o excesso
      // de afeto pelo morto (reescreve o b2 cordial). Ambos partilhados por
      // papel — paridade anti-tell.
      temperamento,
      defendeDemais,
      ehAcessor: pessoa.id === acessorId,
      instrumento,
      // OS da vila na mesa: o nó onde ESTA pessoa é interrogada (a casa
      // dela, via montador); 'delegacia' só como fallback de pacote velho.
      localidadeInterrogatorio: localidadeInterrogatorio[pessoa.id] || 'delegacia',
      // O palco da conversa deriva do nó: quem mora no posto atende no
      // posto; quem mora no prédio de encontro, no serviço; o resto, à porta.
      palcoDialogo:
        (localidadeInterrogatorio[pessoa.id] || 'delegacia') === 'delegacia'
          ? 'posto'
          : localidadeInterrogatorio[pessoa.id] === 'vizinhanca'
            ? 'encontro'
            : 'casa',
    };

    cartasAlibi.push(cartaDeAlibi(ctx));

    // Confrontos: um por carta que toca o suspeito, na ordem das cartas —
    // mais o PISO da OS-R9 Fase 2, que vale para toda gente do caso e é o
    // que impede o número de degraus de exposição de delatar o réu.
    const confrontos = [];
    const reacoesProva = {};
    const nosReacao = {};
    const acrescentarConfronto = (carta, c) => {
      if (!c || reacoesProva[carta.id]) return;
      const noId = `reacao_${carta.id}`;
      confrontos.push({ requerCarta: carta.id, rotulo: c.pergunta });
      reacoesProva[carta.id] = noId;
      nosReacao[noId] = { fala: [c.reacao], opcoes: [] };
    };
    for (const carta of cartas) {
      acrescentarConfronto(carta, confrontoDaCarta({ carta, pessoa, papel, bruto, nomePredio }));
    }
    // O piso vem DEPOIS do confronto próprio, e o `acrescentarConfronto`
    // não sobrescreve: quem já tem a sua reação àquela carta fica com ela.
    for (const id of CARTAS_DO_PISO) {
      const carta = cartas.find((c) => c.id === id);
      if (carta) acrescentarConfronto(carta, confrontoDePiso({ carta, pessoa, vitima, sal }));
    }

    const nos = {
      abertura: { fala: falaAbertura(ctx), opcoes: perguntasParadeiro(escolha.faixa, sal) },
      evasiva: {
        fala: [
          (EVASIVA_POR_CLASSE[pessoa.classeSocial] || EVASIVA_POR_CLASSE.lavrador) +
            (omitePorDecoro && papel !== 'reu' ? DECORO_EVASIVA_SUFIXO : ''),
        ],
        opcoes: [],
      },
      ...nosReacao,
    };
    // O DOSSIÊ EXTERNO daquele suspeito, computado aqui com a MESMA régua
    // que `montarDossies` corre em runtime: carta que o aponta ou a que a
    // árvore reage, menos a que nasce na boca dele (o álibi, que entra no
    // catálogo depois deste ponto e por isso nem aparece nesta lista).
    // Serve ao degrau, e a nada mais — o nível continua a derivar-se dos
    // dados em runtime, nunca de um número gravado aqui (G5).
    const dossieExterno = cartas
      .filter((c) => {
        const t = c.tagsOcultas || {};
        return (
          t.ligadoA === pessoa.id ||
          t.pertenceA === pessoa.id ||
          t.declaranteId === pessoa.id ||
          reacoesProva[c.id]
        );
      })
      .map((c) => c.id);

    for (const tom of TONS) {
      nos[`b1_${tom}`] = { fala: falaB1(ctx, tom), opcoes: perguntasArremate(vitima, sal) };
      // O beat 3 alcança-se de QUALQUER tom do beat 2 (a régua da GR6-7 no
      // tutorial): o tom é cor, e nunca porta fechada.
      // O DEGRAU fica no beat 2 e a ALFINETADA no beat 3, em telas
      // separadas de propósito: as duas pagam-se do mesmo dossiê, e juntas
      // dariam três blocos de rubrica na mesma tela. O tutorial faz o
      // mesmo — o degrau dele mora num confronto, longe da alfinetada.
      nos[`b2_${tom}`] = {
        fala: falaB2(ctx, tom),
        opcoes: perguntasFecho(vitima, pessoa, sal),
        ...(degrauDoTrato(ctx, dossieExterno) ? { degraus: [degrauDoTrato(ctx, dossieExterno)] } : {}),
      };
      nos[`b3_${tom}`] = {
        fala: falaB3(ctx, tom),
        opcoes: [],
        ...(alfinetadaDe(ctx) ? { alfinetada: alfinetadaDe(ctx) } : {}),
      };
    }

    // O gatilho de complexo (só quando o portão dos ≥2 abre): um confronto
    // SEM carta, canal lateral. A reação é BIOGRAFIA (o medo central), nó
    // terminal (opcoes: []), transitório no runtime — o motor nunca o lê.
    const gatilhos = [];
    const tema = realizarGatilho ? temaDoGatilho(bruto, pessoa.id) : null;
    if (tema && GATILHO_POR_TEMA[tema]) {
      const g = GATILHO_POR_TEMA[tema];
      const fem = pessoa.genero === 'feminino';
      nos.gatilho = { fala: [g.reacao(pessoa.nome, fem)], opcoes: [] };
      gatilhos.push({ rotulo: g.pergunta, vaiPara: 'gatilho' });
    }

    // O verbo "Exigir que mostre" (Inc. 6 do pivô Gabinete Ilustrado):
    // gated na carta gen_sinal_exigivel (corpo da vítima anuncia a marca).
    // Uma entrada por região exigível. A reação depende da marca corporal
    // do suspeito (crime, ofício ou situacional) — ou da ausência de marca.
    // Canal lateral como o confronto: transitório, retoma sem descer.
    const exigencias = [];
    const marcaDaPessoa = marcasCorporais[pessoa.id] || null;
    const cartaSinal = cartas.find((c) => c.id === 'gen_sinal_exigivel');
    if (cartaSinal) {
      const regiaoDoSinal = cartaSinal.tagsOcultas.regiao;
      for (const [regId, reg] of Object.entries(REGIOES_EXIGIVEIS)) {
        const noId = `exigencia_${regId}`;
        const temMarcaNaRegiao = marcaDaPessoa && marcaDaPessoa.regiao === regId;
        if (temMarcaNaRegiao) {
          nos[noId] = { fala: [marcaDaPessoa.descricaoClose], opcoes: [] };
        } else {
          nos[noId] = { fala: [reg.descricaoNadaDeNota], opcoes: [] };
        }
        exigencias.push({
          requerCarta: 'gen_sinal_exigivel',
          regiao: regId,
          rotulo: reg.descricaoExigencia,
          vaiPara: noId,
          regiaoDoSinal,
        });
      }
    }

    dialogos[`dialogo_${pessoa.id}`] = {
      suspeitoId: pessoa.id,
      origemLocalidade: ctx.localidadeInterrogatorio,
      chamada: `Interrogar ${pessoa.nome}`,
      titulo: `Interrogatório — ${pessoa.nome}`,
      subtitulo: `${profissaoExibida(pessoa.profissao).charAt(0).toUpperCase()}${profissaoExibida(pessoa.profissao).slice(1)}, ${pessoa.idade} anos`,
      noInicial: 'abertura',
      noEvasiva: 'evasiva',
      reacoesProva,
      confrontos,
      ...(gatilhos.length ? { gatilhos } : {}),
      ...(exigencias.length ? { exigencias } : {}),
      nos,
    };
  }

  return { dialogos, cartasAlibi };
}
