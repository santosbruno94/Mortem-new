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
//   • uma árvore EMBUTIDA na delegacia (origemLocalidade: 'delegacia' —
//     o delegado manda chamar, um a um, os nomes dos papéis), no MESMO
//     shape de src/data/dialogos.js: { suspeitoId, noInicial, nos,
//     noEvasiva, reacoesProva, confrontos };
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

function variante(pool, chave) {
  return pool[hashString(chave) % pool.length];
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
const FAIXA_CURTA = {
  noite: 'sexta à noite',
  madrugada: 'madrugada de sábado',
  dia: 'sexta à tarde',
};
// Janela declarada (envelope da faixa, escala absoluta de tempo.js:
// 0 = meia-noite de 14/out). Fonte dos números citados na prosa.
const JANELA_DECLARADA = {
  noite: { inicio: -4, fim: 7 }, // das 20h de sexta à manhã de sábado
  madrugada: { inicio: -2, fim: 7 }, // das 22h de sexta à manhã
  dia: { inicio: -12, fim: -6 }, // do meio-dia às seis de sexta
};

// ---------------------------------------------------------------------
// As perguntas do perito (voz universal do jogador; iguais em todo caso).
// ---------------------------------------------------------------------
function perguntasParadeiro(faixa) {
  const obliqua = {
    noite: '"Costuma recolher-se cedo?"',
    madrugada: '"Tem o sono pesado?"',
    dia: '"O serviço solta a que horas?"',
  }[faixa];
  return [
    { rotulo: `"Onde esteve ${FAIXA_TXT[faixa]}? Sem rodeios."`, vaiPara: 'b1_firme', tom: 'firme' },
    { rotulo: `"A sua ${FAIXA_CURTA[faixa]}, como foi? Conte com calma."`, vaiPara: 'b1_cordial', tom: 'cordial' },
    { rotulo: `"O seu paradeiro ${FAIXA_TXT[faixa]}: hora e lugar."`, vaiPara: 'b1_tecnico', tom: 'tecnico' },
    { rotulo: obliqua, vaiPara: 'b1_obliquo', tom: 'obliquo' },
  ];
}

function perguntasArremate(vitima) {
  const quem = vitima.genero === 'feminino' ? `Que mulher era ${vitima.nome}` : `Que homem era ${vitima.nome}`;
  return [
    { rotulo: `"Alguém nesta vila queria mal a ${vitima.nome}. Diga um nome."`, vaiPara: 'b2_firme', tom: 'firme' },
    { rotulo: `"${quem}, para quem convivia?"`, vaiPara: 'b2_cordial', tom: 'cordial' },
    { rotulo: `"Que tratos tinha com ${vitima.nome}? Somas e datas, se as houver."`, vaiPara: 'b2_tecnico', tom: 'tecnico' },
    { rotulo: '"O que anda dizendo a vila?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
  ];
}

// ---------------------------------------------------------------------
// VOZ DERIVADA (guia §8.1–8.3): as primeiras palavras por classe social,
// a têmpera de idade e o tique por trait. Frases curtas, observação pura;
// a fala entre aspas é depoimento (alegação), nunca conclusão.
// ---------------------------------------------------------------------
const PRIMEIRAS_PALAVRAS = {
  gentry: ['"Vim porque a lei pede, e esta casa atende ao que a lei pede. Diga em que sirvo."'],
  clero: ['"A paróquia está às ordens do inquérito. Pergunte."'],
  profissional: ['"Tenho a manhã tomada, {detective.title}, mas isto passa adiante de tudo. Ao seu dispor."'],
  comerciante: ['"Deixei o negócio fechado por esta hora. Aproveitemo-la, se faz favor."'],
  artesao: ['"Deixei serviço pela metade na bancada. Seja direto, se puder ser."'],
  lavrador: ['"Vim assim que o guarda mandou. Diga lá, que a lida não espera."'],
  criadagem: ['"Com licença de entrar. Respondo o que souber."'],
  servico_do_condado: ['"De serviço ou fora dele, respondo pela folha. Pergunte."'],
};

// A têmpera de idade (guia §8.2): uma frase a mais, quando couber.
function temperaIdade(pessoa) {
  if (pessoa.idade <= 19) return ' A voz sai baixa e termina cada frase num "{g:senhor|senhora}".';
  if (pessoa.idade >= 60) return ' Acrescenta, antes da primeira pergunta: "Na minha idade responde-se uma vez, e certo."';
  if (pessoa.idade >= 45) return ` Diz do ofício, sem que ninguém pergunte: "É a vida inteira nisto, ${'{detective.title}'}."`;
  return '';
}

// O tique por trait (guia §8.3), como observação de cena na abertura.
const TIQUE_ABERTURA = {
  medroso: ' Fala baixo e mede a porta antes de cada resposta.',
  tagarela: ' E emenda, sem pergunta, o frio que fez, o preço do pão e o nome de quem passou tarde pela rua.',
  preciso: ' Traz as datas prontas, como quem chega com a caderneta escrita.',
  linha_tempo_nao_confiavel: ' Ao citar a primeira hora, corrige-a no meio da frase.',
};

// A recepção (abertura) por comportamento de diálogo.
function falaAbertura(ctx) {
  const { pessoa, sal } = ctx;
  let entrada;
  if (pessoa.comportamentos.includes('revela_facil')) {
    entrada = `${pessoa.nome} entra na sala do expediente antes que o delegado acabe de o chamar, e toma a palavra junto com a cadeira.`;
  } else if (pessoa.comportamentos.includes('revela_sob_custo')) {
    entrada = `${pessoa.nome} entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem.`;
  } else {
    entrada = `${pessoa.nome} entra na sala do expediente ao chamado do delegado e senta-se de chapéu na mão.`;
  }
  const palavras = variante(PRIMEIRAS_PALAVRAS[pessoa.classeSocial] || PRIMEIRAS_PALAVRAS.lavrador, `${sal}|abertura`);
  const tique = TIQUE_ABERTURA[ctx.trait] || '';
  return [`${entrada} ${palavras}${temperaIdade(pessoa)}${tique}`];
}

// ---------------------------------------------------------------------
// BEAT 1 — o paradeiro. Todo tom sustenta a MESMA carta de álibi
// (solubilidade); o tom ressonante rende o tento a mais.
// ---------------------------------------------------------------------
const ENTREGA_POR_TRAIT = {
  preciso: 'as horas saem em fila, sem que ele procure nenhuma',
  medroso: 'os olhos vão à porta entre uma hora e outra',
  tagarela: 'a resposta vem embrulhada em coisa que ninguém perguntou',
  linha_tempo_nao_confiavel: 'as horas saem fora de ordem, e ele as corrige no meio',
};

// O tento do tom ressonante, por trait (prosa, nunca prova — spec §8.5).
const TENTO_RESSONANTE = {
  medroso: ' A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa.',
  preciso: ' E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora.',
  tagarela: ' No meio do rodeio, a mão pousa na mesa e a fala desacelera, como quem pisa chão conhecido.',
  linha_tempo_nao_confiavel: ' Posto contra a parede, alinha as horas com os dedos na tábua da mesa; ficam mais perto de fechar do que em qualquer outra resposta.',
};

function falaB1(ctx, tom) {
  const { pessoa, idCartaAlibi, faixa } = ctx;
  const entrega = ENTREGA_POR_TRAIT[ctx.trait] || 'a resposta sai do tamanho da pergunta';
  const genero = pessoa.genero === 'feminino';
  const entregaDela = genero ? entrega.replaceAll(' ele ', ' ela ') : entrega;
  const abreObliqua = {
    noite: '"Cedo ou tarde, conforme o dia."',
    madrugada: '"Pesado o bastante."',
    dia: '"Quando a luz acaba."',
  }[faixa];
  const frame = {
    firme: `"Sem rodeios, então." E o paradeiro vem, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
    cordial: `A ${FAIXA_CURTA[faixa]} vem contada do princípio, e ${entregaDela}: [[${idCartaAlibi}]].`,
    tecnico: `"Hora e lugar." E os dá, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
    obliquo: `${abreObliqua} E a ${FAIXA_CURTA[faixa]} acaba saindo por inteiro, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
  }[tom];
  const tento = tom === ctx.tomRessonante ? TENTO_RESSONANTE[ctx.trait] || '' : '';
  return [frame + tento];
}

// ---------------------------------------------------------------------
// BEAT 2 — o arremate, por papel de diálogo (réu, testemunha, periférico)
// × tom. O réu deflete sem confessar; a testemunha fica no declarado; o
// periférico dá a vila. A saída fecha a conversa (opcoes: []).
// ---------------------------------------------------------------------
function falaB2(ctx, tom) {
  const { pessoa, papel, vitima } = ctx;
  const eleVitima = vitima.genero === 'feminino' ? 'ela' : 'ele';
  const saida = {
    gentry: 'Levanta-se pelo próprio aviso. "Se a lei precisar de mais, a casa sabe onde fica."',
    clero: 'Ergue-se e alisa a batina. "A paróquia fica às ordens."',
    profissional: 'Toma o chapéu. "O inquérito sabe onde me encontrar."',
    comerciante: 'Toma o chapéu do joelho. "O negócio não se guarda sozinho."',
    artesao: 'Levanta-se sem esperar licença. "O serviço ficou aceso."',
    lavrador: 'Levanta-se devagar. "Se é tudo, a lida espera."',
    criadagem: 'Levanta-se e alisa o avental. "Com licença, que a casa não para."',
    servico_do_condado: 'Levanta-se e ajeita o cinturão. "A ronda não espera."',
  }[pessoa.classeSocial] || 'Levanta-se devagar e espera que o dispensem.';

  let corpo;
  if (papel === 'reu') {
    corpo = {
      firme: `"Nome eu não dou, ${'{detective.title}'}, que não o tenho. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora."`,
      cordial: `"${vitima.nome} era do trato de todos os dias; eu ${vitima.genero === 'feminino' ? 'a' : 'o'} conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo."`,
      tecnico: `"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta."`,
      obliquo: `"A vila fala o que sempre falou: cada um por si. De mim hão de dizer o que se diz de quem trabalha e cala."`,
    }[tom];
  } else if (papel === 'testemunha') {
    corpo = {
      firme: `"Nome não ponho em ninguém. O que declarei à ronda, declarei; palavra dada não se tira."`,
      cordial: `"${vitima.nome} era d${vitima.genero === 'feminino' ? 'as' : 'os'} que se cumprimentam na rua. O que sei do resto está na folha do guarda, tal e qual."`,
      tecnico: `"Do que vi e ouvi já dei conta por termo, com hora. Fora disso, nada tenho que sirva a um inquérito."`,
      obliquo: `"A vila fala, e fala alto. Eu digo só o que passou pelos meus olhos e ouvidos; o resto morre comigo."`,
    }[tom];
  } else {
    corpo = {
      firme: `"Nome não dou, que não o tenho. Desafeto declarado de ${vitima.nome} eu não conhecia."`,
      cordial: `"${vitima.nome}? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos."`,
      tecnico: `"Tratos meus com ${eleVitima}, poucos e pagos. Se há soma pendente em algum livro, o livro que fale."`,
      obliquo: `"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê."`,
    }[tom];
  }
  const tento =
    tom === ctx.tomRessonante
      ? {
          medroso: ' Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer.',
          preciso: ' Já de pé, corrige uma miudeza da própria resposta, para que a folha fique exata.',
          tagarela: ' Já na porta, ainda oferece o nome do padeiro, o preço da vela e a chuva da outra semana.',
          linha_tempo_nao_confiavel: ' Na despedida, cita a mesma hora de antes, e a hora vem diferente.',
        }[ctx.trait] || ''
      : '';
  return [`${corpo} ${saida}${tento}`];
}

// ---------------------------------------------------------------------
// A CARTA DE ÁLIBI (spec §8.3): o paradeiro declarado nasce da rotina do
// pacoteEspacial na faixa do crime; o réu posto NA cena pela rotina
// declara a moradia com recolhimento cedo (a mentira cai só por confronto).
// ---------------------------------------------------------------------
function cartaDeAlibi(ctx) {
  const { pessoa, faixa, papel, nomePredio, cenaId, sal } = ctx;
  const lugarReal = pessoa.pacoteEspacial.rotina[faixa];
  const moradia = pessoa.pacoteEspacial.moradia;
  const mentiraDeCena = papel === 'reu' && lugarReal === cenaId;
  const lugarDeclarado = mentiraDeCena ? moradia : lugarReal;
  const rotulo = nomePredio(lugarDeclarado);
  const rotuloMoradia = nomePredio(moradia);
  const janela = JANELA_DECLARADA[faixa];

  let falaDeclarada;
  if (faixa === 'dia') {
    falaDeclarada =
      lugarDeclarado === moradia
        ? `"Do meio-dia às seis estive em casa, ${rotulo}, no meu serviço de porta para dentro."`
        : `"Do meio-dia às seis, ${rotulo}, no serviço. Quem lá esteve me viu."`;
  } else if (mentiraDeCena) {
    falaDeclarada = `"Recolhi-me cedo a ${rotuloMoradia}, antes das oito, e de lá não saí até a manhã."`;
  } else if (lugarDeclarado === moradia) {
    falaDeclarada = `"Recolhi-me a ${rotulo} às oito e não tornei a sair antes de clarear."`;
  } else {
    falaDeclarada = `"Estive em ${rotulo} das oito às onze; dali fui direto para ${rotuloMoradia}, dormir."`;
  }

  const titulo = { noite: 'A Noite', madrugada: 'A Madrugada', dia: 'A Tarde' }[faixa];
  const fecho = variante(
    ['Tomado por termo na delegacia, na letra do escrevente.', 'Declarado na sala do expediente, diante do delegado.'],
    `${sal}|alibi|fecho`
  );
  return {
    id: `gen_alibi_${pessoa.id}`,
    localidade: 'delegacia',
    textoDisplay: `${titulo} de ${pessoa.nome}`,
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
function confrontoDaCarta({ carta, pessoa, papel, bruto, nomePredio }) {
  const t = carta.tagsOcultas || {};
  const td = carta.textoDisplay;

  // pertenceA: instrumento, pertence, rastro de dinheiro, fuga.
  if (t.pertenceA === pessoa.id && t.subDominio === 'instrumento_oficio') {
    const classe = (bruto.crime.vestigios.find((v) =>
      ['instrumento_abandonado', 'instrumento_faltando', 'instrumento_guardado_umido'].includes(v.classe)
    ) || {}).classe;
    if (classe === 'instrumento_faltando') {
      return {
        pergunta: `[${td}] Por que falta essa peça entre as suas coisas?`,
        reacao: `${pessoa.nome} olha o vão apontado no papel como se o visse de novo. "Falta, e dou pela falta há dias. Ferramenta nesta vila empresta-se sem se pedir, e devolve-se quando lembra. Quem a levou não me deu o nome." As mãos ficam quietas enquanto responde.`,
      };
    }
    if (classe === 'instrumento_guardado_umido') {
      return {
        pergunta: `[${td}] Por que a peça foi guardada lavada, com a junta ainda úmida?`,
        reacao: `${pessoa.nome} responde sem olhar a peça duas vezes. "Lavei-a porque se lava ferramenta; ferrugem não espera inquérito. O feitio casa com a lesão, diz a mesa; casa também com metade das bancadas do condado." E devolve a resposta no mesmo passo das outras.`,
      };
    }
    return {
      pergunta: `[${td}] Por que o instrumento achado junto do corpo tem o seu nome na vila?`,
      reacao: `${pessoa.nome} olha a peça sem estender a mão. "Do meu uso, quem o nega. Perde-se ferramenta como se perde chapéu, e quem a levou não ma pediu. Onde a acharam, não fui eu que a pus." A voz não muda do começo ao fim.`,
    };
  }
  if (t.pertenceA === pessoa.id && t.subDominio === 'objeto_pessoal') {
    return {
      pergunta: `[${td}] Por que o par disto está entre as suas coisas?`,
      reacao: `${pessoa.nome} vira o achado nos dedos uma vez e o pousa. "Meu, ou do meu feitio; casaco perde botão onde o dono nem passou. Como foi parar na mão do morto, isso pergunte a quem o pôs lá." E o empurra de volta pela mesa, devagar.`,
    };
  }
  if (t.pertenceA === pessoa.id && t.subDominio === 'rastro_de_dinheiro') {
    return {
      pergunta: `[${td}] Por que soberanos novos, contados à vista de todos?`,
      reacao: `${pessoa.nome} não conta a moeda de novo. "Dinheiro contado à vista tem menos vergonha que dinheiro escondido. Foi paga de serviço, e serviço pago não é crime. O nome de quem pagou, esse fica comigo até a lei o exigir por escrito."`,
    };
  }
  if (t.pertenceA === pessoa.id && t.subDominio === 'fuga_apressada') {
    return {
      pergunta: `[${td}] Por que o rasgo do seu casaco encaixa neste retalho?`,
      reacao: `${pessoa.nome} estende o braço e mostra a manga pelo avesso. "Rasguei-o num prego, e prego não falta nesta vila. Se o pano encaixa, encaixa; a porta onde o acharam eu não conheço." Recolhe o braço e espera a pergunta seguinte.`,
    };
  }

  // origemTestemunha: visto-com-vida e ruído — a testemunha reafirma.
  if (carta.origemTestemunha === pessoa.id && t.subDominio === 'ultima_vez_visto') {
    return {
      pergunta: `[${td}] A que horas, exatamente, viu a vítima com vida?`,
      reacao: `${pessoa.nome} repete a hora sem mudar uma palavra do termo. "Declarei à ronda e torno a declarar: vi quem vi, em pé e falando, à hora que dei. Disso não tiro uma linha." E deixa que o papel diga o resto.`,
    };
  }
  if (carta.origemTestemunha === pessoa.id && t.subDominio === 'ruido_ouvido') {
    return {
      pergunta: `[${td}] O que exatamente a parede deixou passar naquela hora?`,
      reacao: `${pessoa.nome} conta de novo, na mesma ordem. "Pancada primeiro, móvel arrastado depois, e mais nada até a manhã. Foi o que ouvi e foi o que declarei. Em barulho eu não ponho nome de gente."`,
    };
  }
  return null;
}

// A evasiva (fallback defensivo), por classe social.
const EVASIVA_POR_CLASSE = {
  gentry: 'Olha o que se lhe mostra o tempo de o reconhecer, e devolve. "Disso a casa não sabe dar razão. Se há pergunta, faça-a por inteiro."',
  clero: 'Examina o que se lhe apresenta e o devolve com as duas mãos. "Disso não sei dar testemunho. Pergunte do rebanho, que do rebanho respondo."',
  profissional: 'Corre os olhos pelo que se lhe mostra e o devolve. "Fora do meu ofício, não arrisco palavra. Pergunte do que é meu."',
  comerciante: 'Olha o que se lhe mostra como quem confere fatura alheia. "Isto não passou pelo meu balcão. Do que passou, respondo com o livro na mão."',
  artesao: 'Olha por cima, o tempo de dois fôlegos, e encolhe os ombros. "Disso não entendo. Pergunte de ferramenta e de serviço, que disso dou conta."',
  lavrador: 'Chega o rosto para ver e faz que não com a cabeça. "Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser."',
  criadagem: 'Olha depressa e baixa os olhos. "Isso eu não sei o que é. Da casa e do serviço respondo; do resto, quem sabia era a gente grande."',
  servico_do_condado: 'Examina como quem preenche folha. "Sem registro disto, não firmo nada. O que está lavrado, está lavrado; o resto se apura."',
};

// ---------------------------------------------------------------------
// O DERIVADOR: uma árvore por suspeito do pacote + as cartas de álibi.
// Ordem estável: a dos próprios suspeitos (alfabética no pacote) e a do
// array de cartas para os confrontos — replay byte a byte.
// ---------------------------------------------------------------------
export function derivarDialogos({ bruto, cartas, suspeitos }) {
  const { mundo, crime, escolha } = bruto;
  const pessoas = indicePorId(mundo.elenco);
  const vitima = pessoas.get(crime.vitimaId);
  const nomePredio = (id) => {
    const p = mundo.cidade.predios.find((x) => x.id === id);
    return p ? p.rotulo : id;
  };

  const dialogos = {};
  const cartasAlibi = [];

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
    };

    cartasAlibi.push(cartaDeAlibi(ctx));

    // Confrontos: um por carta que toca o suspeito, na ordem das cartas.
    const confrontos = [];
    const reacoesProva = {};
    const nosReacao = {};
    for (const carta of cartas) {
      const c = confrontoDaCarta({ carta, pessoa, papel, bruto, nomePredio });
      if (!c) continue;
      const noId = `reacao_${carta.id}`;
      confrontos.push({ requerCarta: carta.id, rotulo: c.pergunta });
      reacoesProva[carta.id] = noId;
      nosReacao[noId] = { fala: [c.reacao], opcoes: [] };
    }

    const nos = {
      abertura: { fala: falaAbertura(ctx), opcoes: perguntasParadeiro(escolha.faixa) },
      evasiva: { fala: [EVASIVA_POR_CLASSE[pessoa.classeSocial] || EVASIVA_POR_CLASSE.lavrador], opcoes: [] },
      ...nosReacao,
    };
    for (const tom of TONS) {
      nos[`b1_${tom}`] = { fala: falaB1(ctx, tom), opcoes: perguntasArremate(vitima) };
      nos[`b2_${tom}`] = { fala: falaB2(ctx, tom), opcoes: [] };
    }

    dialogos[`dialogo_${pessoa.id}`] = {
      suspeitoId: pessoa.id,
      origemLocalidade: 'delegacia',
      chamada: `Interrogar ${pessoa.nome}`,
      titulo: `Interrogatório — ${pessoa.nome}`,
      subtitulo: `${pessoa.profissao.charAt(0).toUpperCase()}${pessoa.profissao.slice(1)}, ${pessoa.idade} anos`,
      noInicial: 'abertura',
      noEvasiva: 'evasiva',
      reacoesProva,
      confrontos,
      nos,
    };
  }

  return { dialogos, cartasAlibi };
}
