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

export function variante(pool, chave) {
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
// As perguntas do perito (voz universal do jogador; iguais em todo caso).
// ---------------------------------------------------------------------
function perguntasParadeiro(faixa) {
  const obliqua = {
    noite: '"Costuma recolher-se cedo?"',
    madrugada: '"Tem o sono pesado?"',
    dia: '"A que horas larga o serviço?"',
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
  const ela = vitima.genero === 'feminino' ? 'ela' : 'ele';
  return [
    { rotulo: `"Alguém nesta vila queria mal a ${vitima.nome}. Diga um nome."`, vaiPara: 'b2_firme', tom: 'firme' },
    { rotulo: `"${quem}, para quem lidava com ${ela} todos os dias?"`, vaiPara: 'b2_cordial', tom: 'cordial' },
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
  gentry: [
    '"Vim porque a lei pede, e esta casa atende ao que a lei pede. Diga em que sirvo."',
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
    '"Vim assim que o guarda mandou. Diga lá, que a lida não espera."',
    '"O guarda mandou, eu vim. Pergunte, que o campo não espera."',
    '"A terra ficou por lavrar hoje. Pergunte, que eu respondo e volto."',
  ],
  criadagem: [
    '"Com licença de entrar. Respondo o que souber."',
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
  let entrada;
  if (pessoa.comportamentos.includes('revela_facil')) {
    entrada = `${pessoa.nome} entra na sala do expediente antes que o delegado acabe de chamar o nome, e toma a palavra junto com a cadeira.`;
  } else if (pessoa.comportamentos.includes('revela_sob_custo')) {
    entrada = `${pessoa.nome} entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem.`;
  } else {
    // Armação distinta da terceira entrada (contra a monotonia entre as
    // cinco conversas do caso) e gesto por gênero (KB vestuário: a touca
    // feminina fica atada; o chapéu na mão é gesto de homem).
    entrada =
      pessoa.genero === 'feminino'
        ? `O delegado chama o nome; ${pessoa.nome} entra, senta-se e ajeita as fitas da touca.`
        : `O delegado chama o nome; ${pessoa.nome} entra e senta-se de chapéu na mão.`;
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
  linha_tempo_nao_confiavel: ' Posto contra a parede, alinha as horas com os dedos na tábua da mesa, uma a uma.',
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
  const frames = {
    firme: [
      `"Sem rodeios, então." E o paradeiro vem, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
      `Um aceno curto, e o paradeiro sai por inteiro, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
    ],
    cordial: [
      `A ${FAIXA_CURTA[faixa]} vem contada do princípio, e ${entregaDela}: [[${idCartaAlibi}]].`,
      `A resposta toma o caminho comprido e chega inteira, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
    ],
    tecnico: [
      `"Hora e lugar." E os dá, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
      `Hora primeiro, lugar depois, sem que se peça duas vezes, e ${entregaDela}: [[${idCartaAlibi}]].`,
    ],
    obliquo: [
      `${abreObliqua} E a ${FAIXA_CURTA[faixa]} acaba saindo por inteiro, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
      `${abreObliqua} O resto vem atrás, sem mais pergunta, enquanto ${entregaDela}: [[${idCartaAlibi}]].`,
    ],
  }[tom];
  const frame = variante(frames, `${ctx.sal}|b1|${tom}`);
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
  const fem = pessoa.genero === 'feminino';
  // Duas saídas por classe (v2 — contra falas gêmeas entre suspeitos da
  // mesma classe no mesmo caso), sorteadas por suspeito.
  const SAIDAS = {
    gentry: [
      () => 'Levanta-se pelo próprio aviso. "Se a lei precisar de mais, a casa sabe onde fica."',
      () => 'Levanta-se pelo próprio aviso. "A casa fica a par do que se apurar. Passar bem, {detective.treatment}."',
    ],
    // KB vestuário: sobrecasaca clerical de pároco anglicano, não batina.
    clero: [
      () => 'Ergue-se e alisa a sobrecasaca. "A paróquia fica às ordens."',
      () => 'Ergue-se com as duas mãos no espaldar. "Que se apure tudo, e depressa. A paróquia reza por isso."',
    ],
    profissional: [
      (f) =>
        f
          ? 'Recolhe as luvas. "O inquérito sabe onde me encontrar."'
          : 'Toma o chapéu. "O inquérito sabe onde me encontrar."',
      (f) =>
        f
          ? 'Recolhe as luvas, um dedo por vez. "Qualquer papel que falte, mande buscar."'
          : 'Toma o chapéu da mesa. "Qualquer papel que falte, mande buscar."',
    ],
    comerciante: [
      (f) =>
        f
          ? 'Ajeita o xale sobre os ombros. "O negócio não se guarda sozinho."'
          : 'Levanta-se e abotoa o casaco. "O negócio não se guarda sozinho."',
      (f) =>
        f
          ? 'Prende o xale e ergue-se. "Se faltar soma ou data, o livro do balcão as tem."'
          : 'Abotoa o casaco e ergue-se. "Se faltar soma ou data, o livro do balcão as tem."',
    ],
    artesao: [
      () => 'Levanta-se sem esperar licença. "O serviço ficou aceso."',
      () => 'Limpa as mãos uma na outra e levanta-se. "Chamando, venho. O serviço fica onde ficou."',
    ],
    lavrador: [
      () => 'Levanta-se devagar. "Se é tudo, volto à lida."',
      () => 'Levanta-se e gira o chapéu uma volta nas mãos. "Deus ajude a achar quem foi. Passar bem."',
    ],
    criadagem: [
      () => 'Levanta-se e alisa o avental. "Com licença, que a casa não para."',
      () => 'Levanta-se e recolhe a cadeira ao lugar. "Se a casa puder servir em mais, é só mandar."',
    ],
    servico_do_condado: [
      () => 'Levanta-se e ajeita o cinturão. "A ronda não espera."',
      () => 'Levanta-se e confere o próprio termo com os olhos. "Fica lavrado. Ao dispor do inquérito."',
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
    corpo = {
      firme: `"Nome nenhum me cabe dar, ${'{detective.treatment}'}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora."`,
      cordial: `"${vitima.nome} era do trato de todos os dias; eu ${vitima.genero === 'feminino' ? 'a' : 'o'} conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo."`,
      tecnico: `"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta."`,
      obliquo: `"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo."`,
    }[tom];
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
  // O tento do réu com linha do tempo NÃO pode desmenti-lo (spec §8.6):
  // ganha versão que preserva o trait sem cruzamento feito pelo narrador.
  const tento =
    tom === ctx.tomRessonante
      ? {
          medroso: ' Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer.',
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
    const fechoAus = variante(
      ['Tomado por termo na delegacia, pela mão do guarda.', 'Declarado na sala do expediente, diante do delegado.'],
      `${sal}|alibi|fecho`
    );
    return {
      id: `gen_alibi_${pessoa.id}`,
      localidade: 'delegacia',
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

  const fecho = variante(
    // KB inquérito §2: quem escreve o termo na estação de vila é o próprio
    // guarda/delegado — não há escrevente civil lotado ali em 1893.
    ['Tomado por termo na delegacia, pela mão do guarda.', 'Declarado na sala do expediente, diante do delegado.'],
    `${sal}|alibi|fecho`
  );
  return {
    id: `gen_alibi_${pessoa.id}`,
    localidade: 'delegacia',
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
        reacao: `${pessoa.nome} olha o vão apontado no papel como se o visse de novo. "Falta, e dou pela falta há dias. Ferramenta nesta vila empresta-se sem se pedir, e devolve-se quando lembra. Quem a levou não me deu o nome; onde eu estava, dei por termo ao guarda, e lá está." As mãos ficam quietas enquanto responde.`,
      };
    }
    if (classe === 'instrumento_guardado_umido') {
      return {
        pergunta: `[${td}] Por que a peça foi guardada lavada, com a junta ainda úmida?`,
        reacao: `${pessoa.nome} responde sem olhar a peça duas vezes. "Lavei-a porque se lava ferramenta; ferrugem não espera inquérito. O feitio casa com a lesão, diz esse papel; casa também com metade das bancadas do condado. E o delegado lavrou de próprio punho o lugar em que me achei." E encosta a peça na mesa sem a olhar de novo.`,
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
      reacao: `${pessoa.nome} vira o achado nos dedos uma vez e o pousa. "Meu, ou do meu feitio; comprei o par em feira, e outros levaram igual. Como foi parar com quem morreu, isso pergunte a quem o pôs lá; àquela hora eu tinha onde estar, e disso há registro." E o empurra de volta pela mesa, devagar.`,
    };
  }
  if (t.pertenceA === pessoa.id && t.subDominio === 'rastro_de_dinheiro') {
    return {
      pergunta: `[${td}] Por que soberanos novos, contados à vista de todos?`,
      reacao: `${pessoa.nome} não conta a moeda de novo. "Contei-os à vista porque não devia nada a ninguém. Foi paga de serviço, e serviço pago não é crime. O nome de quem pagou, esse fica comigo até a lei o exigir por escrito; das minhas horas já dei conta, e constam do expediente."`,
    };
  }
  if (t.pertenceA === pessoa.id && t.subDominio === 'fuga_apressada') {
    return {
      pergunta: `[${td}] Por que o rasgo do seu casaco encaixa neste retalho?`,
      reacao: `${pessoa.nome} estende o braço e mostra a manga pelo avesso. "Rasguei-o num prego, e prego não falta nesta vila. Se o pano encaixa, encaixa; a porta onde o acharam eu não conheço. O meu paradeiro daquela hora está escrito na delegacia." Recolhe o braço e espera a pergunta seguinte.`,
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
// O DERIVADOR: uma árvore por suspeito do pacote + as cartas de álibi.
// Ordem estável: a dos próprios suspeitos (alfabética no pacote) e a do
// array de cartas para os confrontos — replay byte a byte.
// ---------------------------------------------------------------------
export function derivarDialogos({ bruto, cartas, suspeitos, segredos = {}, ausencias = {} }) {
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
      horaVistoVivo:
        cartaVisto && cartaVisto.origemTestemunha === pessoa.id ? cartaVisto.tagsOcultas.horaAvistamento : null,
      segredo: segredos[pessoa.id] || null,
      // E3 §4.5: rótulo da vila-mercado quando o paradeiro declarado é a
      // AUSÊNCIA (verificável só pelo livro de hóspedes a distância).
      ausencia: ausencias[pessoa.id] || null,
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
      subtitulo: `${profissaoExibida(pessoa.profissao).charAt(0).toUpperCase()}${profissaoExibida(pessoa.profissao).slice(1)}, ${pessoa.idade} anos`,
      noInicial: 'abertura',
      noEvasiva: 'evasiva',
      reacoesProva,
      confrontos,
      nos,
    };
  }

  return { dialogos, cartasAlibi };
}
