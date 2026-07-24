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
      evasiva: {
        fala: [
          (EVASIVA_POR_CLASSE[pessoa.classeSocial] || EVASIVA_POR_CLASSE.lavrador) +
            (omitePorDecoro && papel !== 'reu' ? DECORO_EVASIVA_SUFIXO : ''),
        ],
        opcoes: [],
      },
      ...nosReacao,
    };
    for (const tom of TONS) {
      nos[`b1_${tom}`] = { fala: falaB1(ctx, tom), opcoes: perguntasArremate(vitima) };
      nos[`b2_${tom}`] = { fala: falaB2(ctx, tom), opcoes: [] };
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
