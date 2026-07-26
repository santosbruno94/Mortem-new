// =====================================================================
// Interrogatórios como diálogo VIVO (§7.2). CAMADA NARRATIVA: esta árvore
// pode referenciar ids de carta (`requerCarta`, marcadores `[[id]]`) — a
// restrição "só tags" vale para src/logic/. O motor JAMAIS lê este arquivo;
// as cartas de depoimento continuam nascendo pelo mesmo mecanismo `[[id]]`
// com as tags que já têm (src/data/cartas.js), e o veredicto não muda.
//
// §7.2 — A CONVERSA DESCE E NÃO VOLTA. Cada beat (rodada) oferece QUATRO
// falas do perito, cada uma num TOM: firme (pressão), cordial (brandura),
// técnico (o ofício), oblíquo (de esguelha). Escolher um tom AVANÇA e
// descarta os irmãos — não há "outro assunto", não se volta ao hub. O nó
// corrente persiste no store (noAtualDialogo): reabrir retoma onde parou.
// O NPC responde no registro perguntado; TODA carta de um beat sai em
// QUALQUER tom (o caso é sempre acusável — solubilidade; a lasca na bainha
// foi a última exceção, democratizada em 18/07/2026), mas o tom RESSONANTE
// de cada personagem rende, quando há, um tento a mais de prosa (uma
// hesitação, um deslize). O peso da escolha é NARRATIVO: nenhuma prova que o veredicto
// lê depende do tom (o motor repousa no corpo e na cena). Se um dia uma
// pista decisiva migrar para a conversa, o gate de tom ganha dente
// mecânico — decisão de design a registrar antes.
//
// Forma de cada suspeito:
//   { suspeitoId, noInicial, nos: { [noId]: { fala: [parágrafos], opcoes } },
//     noEvasiva, reacoesProva, confrontos }
// Forma de cada opção (a fala do perito):
//   { rotulo, vaiPara, tom }                  — desce a árvore (tom decorativo)
//   { rotulo, vaiPara, requerCarta: 'id' }    — reservado a confrontos autorais
//
// CONFRONTAR PROVA (caixa gated): não há mais seletor universal. A caixa de
// confronto só expõe as perguntas que a mesa AUTORIZA — uma por prova de
// confronto que o jogador de fato possui. Cada entrada é um par:
//   confrontos: [{ requerCarta: 'id', rotulo: '[Prova] Por que…?' }]
// O `rotulo` é a pergunta autoral que EXPLICA por que o confronto está à mão;
// só aparece quando `temCarta(requerCarta)`. O DESTINO da reação continua
// vindo de `reacoesProva: { [cartaId]: noId }` (fonte única cartaId→noId) —
// bijeção obrigatória com `confrontos` (guarda no qa.mjs). Provas irrelevantes
// não aparecem: o caminho "carta alheia → noEvasiva" some da interface, mas
// `noEvasiva` permanece como fallback defensivo (guarda estrutural). Confrontar
// a carta que desmente o paradeiro do PRÓPRIO interrogado anota a ligação no
// mural (ligacaoDeConfrontoEmCena — só tags; barbante removível). Confrontar é
// CANAL LATERAL: rende a reação e a conversa RETOMA de onde estava, sem descer
// a árvore.
//
// NB: os `rotulo` abaixo são PROVISÓRIOS (mecânica primeiro); a redação final
// passa pelo pipeline `revisar-prosa` num passo posterior.
//
// A prosa admite `{detective.campo}` e a flexão `{g:masc|fem}`; os
// marcadores `[[id]]` na fala extraem a carta (carimbo integrado, §6).
// Navegar não custa tempo (relógio mole).
//
// ---------------------------------------------------------------------
// BEAT 3 — O BEAT DA PRESSÃO (OS-R6, D7). Os cinco têm terceiro beat, nos
// quatro tons, e o eixo é o mesmo para todos: o que esta morte muda para
// quem ficou. Não pede carta, não abre nó, não marca nenhum [[id]] — e é
// por isso que a G4 fica satisfeita por construção: subir de nível não
// destranca prova nenhuma, e quem nunca subir resolve o caso igual.
//
// `alfinetada` é o rendimento do beat 3, e é o que a exposição paga
// (src/logic/exposicao.js). Em E0 o suspeito responde o perguntado e mais
// nada; em E1 a compostura falha uma vez, num gesto; em E2 ele diz, à sua
// maneira, que o perito chegou sabendo. O acréscimo é CARÁTER, nunca fato
// novo do caso — nenhuma alfinetada cita carta, porque o jogador em E2
// pode ter QUALQUER dois terços do dossiê, e não um par específico.
//
// A alfinetada é por suspeito e por nível, não por tom: os dois eixos são
// ortogonais de propósito, e a conversa desce sem voltar (o jogador vê um
// tom só por partida). Escrever quatro cópias por nível seria repetir a
// mesma peça para ninguém comparar.
//
// REGRA DE PROSA DO BEAT 3 (OS-R8, e a descoberta foi do pipeline). Quando a
// rubrica da fala base repete ou CONTRADIZ o adereço da `alfinetada` do mesmo
// nó, a fala base não a leva: nunca duas mãos ocupadas na mesma tela. Foi
// assim que a xícara que arrefece bateu de frente com a xícara «por servir»
// do E1 de Silas, e os braços cruzados com o botão «preso entre os dedos até
// o fim da resposta» do E1 de Walter — a alfinetada imprime-se logo abaixo da
// fala, e o segundo gesto ou nega o primeiro ou gasta de graça o rendimento
// que o nível existia para comprar.
//
// Rubrica que NÃO colide fica, e deve ficar: ambiente, olhar, tempo, ou um
// gesto de outra parte do corpo. Treze dos vinte nós com alfinetada levam a
// sua, e é por isso que o beat 3 tem corpo em E0 — nível em que a alfinetada
// não existe (só E1 e E2 estão definidos). Cortar por regra o que não colide
// deixaria a fala sem corpo justamente para quem chega de dossiê vazio.
// =====================================================================

// As alfinetadas de cada um. Cada suspeito escorrega no seu próprio
// registro — o artífice perde as mãos quietas, o moleiro AQUECE em vez de
// fechar-se, o rapaz ergue os olhos. Nenhum deles ganha marca que os
// outros não tenham: é a GR6-5 lida como prosa.
const ALFINETADA_SILAS = {
  E1: ['Responde e não emenda. A xícara do visitante fica pelo meio, e ele não estende a mão ao bule.'],
  E2: [
    '"O {detective.treatment} andou perguntando de mim pela vila." Não é pergunta, e ele não espera resposta. As mãos deixam os joelhos, e ele alisa o avental dobrado sobre o braço, do vinco para fora. "Perguntem. A bancada está à vista de quem a queira conferir." E torna à teoria de sempre, mais curta desta vez: gente da estrada, atrás do caixa.',
  ],
};

const ALFINETADA_AGNES = {
  E1: ['A pilha fica por endireitar, e a mão pousa na beira do balcão sem tornar a mexer-se.'],
  E2: [
    '"{g:O senhor|A senhora} não veio saber a que horas eu fecho." Diz sem levantar a voz e sem largar o visitante dos olhos. "Pois pergunte o que veio perguntar. O que houver de meu nesta vila é meu, e ao Sr. Arthurs não devi xelim nem satisfação." E não torna a tocar no papel de luto.',
  ],
};

const ALFINETADA_GREY = {
  E1: ['Não torna à saca seguinte. O carroceiro do Finch chama uma vez, e ele não responde.'],
  E2: [
    '"{g:O senhor|A senhora} já sabe disso tudo, então." Bate a farinha de uma mão na outra. "Melhor. Gente que chega sabendo poupa o meu resto de dia." Larga o serviço e fica de frente para responder. "Pergunte o que ainda não sabe, que eu respondo de pé."',
  ],
};

const ALFINETADA_WALTER = {
  E1: ['O botão do colete para no meio da volta e fica preso entre os dedos até o fim da resposta.'],
  E2: [
    '"{g:O senhor|A senhora} já fez a conta antes de entrar." A voz sai alta e não se sustenta até o fim da frase. "Pois estude o resto: um homem que deve às três casas que lhe escreveram não precisa matar ninguém para ser a pior pessoa de uma sala." Larga o botão. "O meu paradeiro já dei. Do que mais {g:o senhor|a senhora} trouxer, respondo sentado."',
  ],
};

const ALFINETADA_DAVEY = {
  E1: ['Acaba a resposta e não torna logo ao serviço. A vassoura fica parada mais tempo do que precisa.'],
  E2: [
    'Os olhos sobem do serviço e ficam erguidos. "{g:O senhor|A senhora} já andou pela bancada, então." Espera, e ninguém lhe responde. Depois, mais baixo: "O Sr. Crane diz que é assim em toda oficina, e eu não conheço outra." A vassoura volta ao chão, e ele varre o que já está varrido.',
  ],
};

// As perguntas do beat 3, por suspeito. O eixo é comum — o que a morte muda
// para quem ficou —, e cada tom o aborda pelo lado que lhe cabe.
const OPCOES_B3_SILAS = [
  { rotulo: '"E o senhor, do que vive na segunda-feira?"', vaiPara: 'b3_firme', tom: 'firme' },
  { rotulo: '"Doze anos de casa. Como fica o senhor agora?"', vaiPara: 'b3_cordial', tom: 'cordial' },
  { rotulo: '"O serviço atrasado da bancada: quem responde por ele?"', vaiPara: 'b3_tecnico', tom: 'tecnico' },
  { rotulo: '"A loja reabre quando?"', vaiPara: 'b3_obliquo', tom: 'obliquo' },
];

const OPCOES_B3_AGNES = [
  { rotulo: '"O que a senhora perde com esta morte?"', vaiPara: 'b3_firme', tom: 'firme' },
  { rotulo: '"A vila há de comentar. A senhora tem quem a acompanhe?"', vaiPara: 'b3_cordial', tom: 'cordial' },
  { rotulo: '"A loja abre na segunda?"', vaiPara: 'b3_tecnico', tom: 'tecnico' },
  { rotulo: '"Esse meio-luto, minha senhora: é por quem?"', vaiPara: 'b3_obliquo', tom: 'obliquo' },
];

const OPCOES_B3_GREY = [
  { rotulo: '"O senhor cobra de um morto como cobrava de um vivo?"', vaiPara: 'b3_firme', tom: 'firme' },
  { rotulo: '"A queixa lhe custou o quê, até aqui?"', vaiPara: 'b3_cordial', tom: 'cordial' },
  { rotulo: '"A queixa lavrada sobrevive ao morto?"', vaiPara: 'b3_tecnico', tom: 'tecnico' },
  { rotulo: '"Quem pesa o ouro na vila, agora?"', vaiPara: 'b3_obliquo', tom: 'obliquo' },
];

const OPCOES_B3_WALTER = [
  { rotulo: '"O que o senhor faz com a loja, fechado o inventário?"', vaiPara: 'b3_firme', tom: 'firme' },
  { rotulo: '"O senhor tem para onde ir, depois disto?"', vaiPara: 'b3_cordial', tom: 'cordial' },
  { rotulo: '"O inventário leva meses. Os seus credores esperam?"', vaiPara: 'b3_tecnico', tom: 'tecnico' },
  { rotulo: '"Por quanto tempo o senhor paga o quarto três?"', vaiPara: 'b3_obliquo', tom: 'obliquo' },
];

// OS-S1 — o sexto homem. O recoveiro escorrega no que é dele: a hora. Perde-a
// de vista quando a compostura falha, e reclama-a de volta em voz alta.
const ALFINETADA_HERRICK = {
  E1: ['Acaba a resposta e não torna a sentar-se. O casaco dobrado passa de um braço para o outro, e volta ao primeiro.'],
  E2: [
    '"{g:O senhor|A senhora} já falou com meia rua antes de descer a este corredor." Não é pergunta, e ele não espera resposta. Puxa o casaco contra o peito e senta-se na tábua. "Pois pergunte o que falta. Sou o único desta vila que não tem ofício nesta rua para responder por si, e disso já me fiz a razão." E, mais baixo, quase para dentro: "Que horas são agora?"',
  ],
};

const OPCOES_B3_HERRICK = [
  { rotulo: '"Quem lhe paga as corridas agora, com a loja lacrada?"', vaiPara: 'b3_firme', tom: 'firme' },
  { rotulo: '"O senhor tem quem responda por si nesta vila?"', vaiPara: 'b3_cordial', tom: 'cordial' },
  { rotulo: '"As entregas da relojoaria: quem as recebe daqui em diante?"', vaiPara: 'b3_tecnico', tom: 'tecnico' },
  { rotulo: '"O seu relógio, quando é que o senhor o resgata?"', vaiPara: 'b3_obliquo', tom: 'obliquo' },
];

const OPCOES_B2_HERRICK = [
  { rotulo: '"O moleiro diz que lhe devia a corrida de sábado. Devia?"', vaiPara: 'b2_firme', tom: 'firme' },
  { rotulo: '"Falaram-me das sacas da feira. Como foi essa madrugada?"', vaiPara: 'b2_cordial', tom: 'cordial' },
  { rotulo: '"A corrida das sacas do moinho: a que horas se carrega?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
  { rotulo: '"A feira de sábado abre cedo?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
];

const OPCOES_B3_DAVEY = [
  { rotulo: '"O teu ordenado, rapaz. Quem te paga agora?"', vaiPara: 'b3_firme', tom: 'firme' },
  { rotulo: '"Quem responde pelo teu pagamento agora, Davey?"', vaiPara: 'b3_cordial', tom: 'cordial' },
  { rotulo: '"Quanto te davam, e de quanto em quanto tempo?"', vaiPara: 'b3_tecnico', tom: 'tecnico' },
  { rotulo: '"Levas alguma coisa para casa, ao fim da semana?"', vaiPara: 'b3_obliquo', tom: 'obliquo' },
];

export const DIALOGOS = {
  // ASSIMETRIA REGISTRADA (OS-R6, martelo (e), 26/07/2026). Só o réu tem nó de
  // mapa próprio para ser interrogado: Agnes e Grey SÃO a localidade
  // (`papelaria`, `moinho`), e Walter e Davey abrem por botão de dentro de
  // outra. Três formas para o mesmo ato, e a G3 existe justamente para impedir
  // que o culpado receba marca que os inocentes não recebam.
  //
  // Fica como está, com o desconforto declarado. Normalizar toca
  // `localidades.js`, `mapa.js`, `mapa_espacial.js`, o diorama e o contrato do
  // `qa-ui`; normalizar PARA CIMA custaria hora (nó novo custa viagem) e
  // mudaria as quatro horas do gate, que são 18h00 · 18h00 · 14h00 · 13h00.
  // A assimetria é real mas fraca: o réu é também quem achou o corpo, e ter
  // sido chamado a depor formalmente explica-se sozinho na ficção.
  //
  // Quem reabrir isto, reabra depois da R8, e com ata própria.
  interrogatorio_silas: {
    suspeitoId: 'silas_crane',
    noInicial: 'abertura',
    // Apresentar prova (Onda 5): reações próprias às cartas que o tocam;
    // o resto cai na evasiva. Tom ressonante: OBLÍQUO. A lasca de vidro na
    // bainha nasce nos QUATRO tons do beat 1 (democratização, 18/07/2026),
    // com prosa própria por tom — o tom é cor, nunca chave.
    noEvasiva: 'evasiva',
    reacoesProva: {
      corrob_estalajadeiro: 'confronto_estalagem',
      ev_livro_ordens: 'confronto_livro',
      ev_vidro_dobra: 'confronto_vidro',
      // OS-S1 — as três arestas novas do oficial: a dívida dele (PD-08), o
      // aro que o gravador da casa conhecia antes da vila (E1), e o homem
      // da estrada que ele pôs na boca do guarda (E-Herrick).
      ev_livro_emprestimos: 'confronto_emprestimos',
      ev_anel_encomenda: 'confronto_anel',
      dep_cela_herrick: 'confronto_recoveiro',
    },
    // Perguntas de confronto (rótulos provisórios): uma por chave de reacoesProva.
    confrontos: [
      { requerCarta: 'corrob_estalajadeiro', rotulo: '[O Quarto Cinco às Escuras] Por que a estalagem conta o seu quarto às escuras às nove?' },
      { requerCarta: 'ev_livro_ordens', rotulo: '[Livro de Ordens de Serviço] Por que três consertos voltaram com a sua rubrica?' },
      { requerCarta: 'ev_vidro_dobra', rotulo: '[Vidro na Dobra da Calça] Por que traz vidro de mostrador preso à bainha?' },
      { requerCarta: 'ev_livro_emprestimos', rotulo: '[Livro de Empréstimos] Por que a sua linha nunca desce, se o senhor paga todas as sextas?' },
      { requerCarta: 'ev_anel_encomenda', rotulo: '[Aro de Ouro por Gravar] Por que a bancada do senhor tinha esta encomenda por gravar?' },
      { requerCarta: 'dep_cela_herrick', rotulo: '[O Que o Recoveiro Achou de Madrugada] Por que apontou o recoveiro ao guarda?' },
    ],
    nos: {
      // O hub: Silas recebe o perito. A lasca de vidro NÃO se anuncia aqui
      // (nasce no primeiro beat, em qualquer tom, cada um pelo gesto que
      // lhe é próprio).
      abertura: {
        fala: [
          'Silas Crane recebe na saleta, o avental de couro dobrado sobre o braço. Traz chá sem que se peça e senta-se na beira da cadeira, as mãos quietas sobre os joelhos.',
          '"Com licença de dizer, {detective.treatment}, {g:o senhor|a senhora} há de perdoar a casa: doze anos de bancada ao lado do Sr. Arthurs e nunca a vi assim parada. Acendia eu o fogo mal abria a loja, e ele descia ao cheiro do carvão; hoje acendi o fogo como sempre, e ninguém desceu."',
        ],
        // rotuloVars: a redação da pergunta varia pela identidade do perito
        // (a intenção do tom é a mesma). Ver InterrogatorioDialogo.
        opcoes: [
          { rotulo: '"Onde esteve na noite de sexta. Sem rodeios."', rotuloVars: ['"Onde esteve na noite de sexta. Sem rodeios."', '"A noite de sexta, sr. Crane: onde, e sem voltas."'], vaiPara: 'b1_firme', tom: 'firme' },
          { rotulo: '"Conte-me da sexta com calma; o senhor conhecia bem a casa."', rotuloVars: ['"Conte-me da sexta com calma; o senhor conhecia bem a casa."', '"A seu tempo: a sexta do senhor, do fechar da loja em diante."'], vaiPara: 'b1_cordial', tom: 'cordial' },
          { rotulo: '"A sexta-feira, os seus passos, hora a hora."', rotuloVars: ['"A sexta-feira, os seus passos, hora a hora."', '"Reconstitua-me a sexta: cada hora no seu lugar."'], vaiPara: 'b1_tecnico', tom: 'tecnico' },
          { rotulo: '"Ficou até tarde na oficina, na sexta?"', rotuloVars: ['"Ficou até tarde na oficina, na sexta?"', '"A bancada apaga-se a que horas?"'], vaiPara: 'b1_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 1 — o álibi (sustentação: alibi_silas em todo tom). A precisão
      // é o defeito: ele dá as horas de um fôlego, sem procurá-las.
      b1_firme: {
        fala: [
          'Silas Crane não se move na beira da cadeira. "Sem rodeios, então."',
          '"Fechei a oficina às sete e meia e saí com o rapaz até a esquina. Ceei pouco, subi ao quarto às oito e dali não tornei a sair. De manhã abri a loja, como abro sempre." As horas vêm em fila, na ordem em que as viveu, e ele não procura nenhuma: [[alibi_silas]].',
          'Ditas as horas, ergue-se para tornar a encher a xícara e logo volta à beira da cadeira; no instante de pé, a luz do lampião acha na bainha esquerda uma lasca miúda: [[ev_vidro_dobra]].',
        ],
        opcoes: [
          { rotulo: '"O senhor sabe quem fez isto. Diga."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Quem, na vila, seria capaz de uma coisa assim?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Aponte-me um nome, e a razão dele."', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"A loja guardava dinheiro à noite?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_cordial: {
        fala: [
          '"O {detective.treatment} é gentil, e eu respondo de bom grado; nesta casa a gente vive pelas horas."',
          '"Sete e meia, fechada a oficina, e saímos os dois. Ceei pouco e recolhi-me ao quarto às oito; do quarto não tornei a sair antes de clarear. De manhã abri a loja, como sempre." Devolve cada hora no seu lugar, com a cortesia de quem paga um favor: [[alibi_silas]].',
          'Ajeita então a calça sobre o joelho, ao costume de quem se senta o dia inteiro; a bainha esquerda sobe da botina, e nela reluz uma lasca: [[ev_vidro_dobra]].',
        ],
        opcoes: [
          { rotulo: '"O senhor sabe quem fez isto. Diga."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Quem, na vila, seria capaz de uma coisa assim?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Aponte-me um nome, e a razão dele."', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"A loja guardava dinheiro à noite?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_tecnico: {
        fala: [
          '"Hora a hora eu digo, que é como se leva uma bancada."',
          '"Fechei às sete e meia, com o rapaz até a esquina. Ceei pouco e subi ao quarto às oito, e dali não desci mais, que dormi. A loja tornei a abri-la às sete, como abro sempre." As horas vêm sem que ele as procure: [[alibi_silas]].',
          'A pedido, chega a cadeira para junto do lampião, para que as horas passem ao papel, e a ergue em vez de arrastá-la; à claridade de perto, antes que ele torne ao seu lugar, aparece na bainha esquerda uma lasca fina: [[ev_vidro_dobra]].',
        ],
        opcoes: [
          { rotulo: '"O senhor sabe quem fez isto. Diga."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Quem, na vila, seria capaz de uma coisa assim?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Aponte-me um nome, e a razão dele."', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"A loja guardava dinheiro à noite?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      // Tom RESSONANTE: de esguelha, enquanto ele cruza as pernas, a luz do
      // lampião apanha a lasca na bainha (ev_vidro_dobra).
      b1_obliquo: {
        fala: [
          '"Até tarde, não; casa de relógio fecha cedo."',
          '"Sete e meia estava a oficina fechada e eu na rua com o rapaz. Ceei pouco e subi ao quarto às oito, e não tornei a descer. De manhã abri a loja." Responde sem se apressar, e as horas saem já postas, uma atrás da outra: [[alibi_silas]].',
          'Ao cruzar as pernas para trás, deixa ver, presa à bainha esquerda, uma lasca que a luz do lampião acende: [[ev_vidro_dobra]].',
        ],
        opcoes: [
          { rotulo: '"O senhor sabe quem fez isto. Diga."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Quem, na vila, seria capaz de uma coisa assim?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Aponte-me um nome, e a razão dele."', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"A loja guardava dinheiro à noite?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 2 — a teoria do ladrão de fora (sustentação: comp_silas em todo
      // tom). No cordial, o retrato dos doze anos de casa vem por inteiro.
      b2_firme: {
        fala: [
          'As mãos não deixam os joelhos. "Não sei nome, {detective.treatment}, e não hei de inventar um para agradar."',
          '"O que penso, penso desde esta manhã: gente de fora, da estrada, que forçou a porta do beco atrás do troco do caixa." Os dedos abrem-se um instante sobre o pano do joelho e tornam a fechar-se: [[comp_silas]].',
        ],
        opcoes: OPCOES_B3_SILAS,
      },
      b2_cordial: {
        fala: [
          '"Doze anos nesta casa: abro eu a loja, tiro as tábuas da vitrine, acendo o fogo da bancada, e o Sr. Arthurs descia depois, com os óculos na mão. Foi no escritório dos fundos que o achei, às nove e vinte, caído entre a escrivaninha e a estante."',
          'Baixa a voz. "Gente da estrada, é o que eu penso; eu bem lhe dizia que recolhesse o caixa ao cofre, e ele ria de mim." E torna a erguê-la para o que vem depois: [[comp_silas]].',
        ],
        opcoes: OPCOES_B3_SILAS,
      },
      b2_tecnico: {
        fala: [
          '"Um nome eu não firmo sem prova, {detective.treatment}; a perícia é sua."',
          '"A razão, essa eu dou, que é de senso: uma vila destas não tranca bem as portas, e caixa aberto à noite chama gente da estrada. Entra pelo beco, que a porta dos fundos é fraca, e sai por onde entrou." Dá a razão de corrida, e a mão não larga o joelho: [[comp_silas]].',
        ],
        opcoes: OPCOES_B3_SILAS,
      },
      b2_obliquo: {
        fala: [
          '"O caixa? Ficava na loja, e eu bem dizia ao Sr. Arthurs que o recolhesse ao cofre — homem velho tem os seus costumes." As mãos seguem sobre os joelhos.',
          '"Quem passa na estrada sabe ler uma vitrine, {detective.treatment}, e sabe que loja de vila guarda o troco na gaveta. É por aí que eu penso a coisa." Ninguém lhe perguntou o que pensava: [[comp_silas]].',
        ],
        opcoes: OPCOES_B3_SILAS,
      },

      // BEAT 3 — a pressão: o que a morte muda para quem ficou. Sem carta,
      // sem nó novo. O rendimento é a `alfinetada`, que a exposição paga.
      b3_firme: {
        fala: [
          '"Da bancada, como vivi até sexta. Há peça entregue por cobrar e peça por acabar; enquanto a casa não se resolver, é esse o serviço. O rapaz veio hoje de manhã, como vem sempre, e ficou comigo à porta."',
        ],
        alfinetada: ALFINETADA_SILAS,
        opcoes: [],
      },
      b3_cordial: {
        fala: [
          '"Doze anos, sim." Olha o avental dobrado sobre o braço antes de responder. "Fico com o que sei fazer e com uma loja que nunca foi minha. Há de vir o sobrinho mandar, e eu hei de esperar que mande."',
        ],
        alfinetada: ALFINETADA_SILAS,
        opcoes: [],
      },
      b3_tecnico: {
        fala: [
          '"O atraso está no livro, e o livro está na bancada." Enumera sem procurar. "Enquanto não vier procurador dizer o contrário, responde o oficial da casa, que sou eu. O que sai daquela porta sai anotado."',
        ],
        alfinetada: ALFINETADA_SILAS,
        opcoes: [],
      },
      b3_obliquo: {
        fala: [
          '"Reabrir depende de quem manda, e quem manda já chegou sem mandar nada. Por mim, abria na segunda: freguês que deixou peça não tem culpa do que houve. Mas casa de defunto tem os seus dias."',
        ],
        alfinetada: ALFINETADA_SILAS,
        opcoes: [],
      },

      // Confronto pela estalagem (requer corrob_estalajadeiro): reação, nunca
      // confissão — o veredicto continua no mural. Sem opções: a conversa
      // RETOMA de onde estava (o componente oferece o retomar).
      confronto_estalagem: {
        fala: [
          'Posto diante do que se conta na estalagem — o quarto às escuras às nove, o portão passado das dez —, Silas Crane pousa o bule sem ruído.',
          '"O estalajadeiro terá contado os quartos errados. A casa é grande, e a noite foi de movimento. Doze anos sem uma falta, {detective.treatment}; não é agora que hei de trocar as minhas horas."',
          'Dá a resposta no mesmo passo das outras e torna a erguer o bule.',
        ],
        opcoes: [],
      },
      confronto_livro: {
        fala: [
          'Posto diante do livro — os três consertos reentrados com queixa, a rubrica "S.C." em cada um, e na última entrada a letra do morto: "pesar as caixas. Pettigrew, segunda" —, Silas Crane não muda de posição.',
          '"Conserto que volta é o pão da bancada, {detective.treatment}. Uma coroa que emperra, uma mola que canta, o cliente traz de novo e a gente refaz. Três num outono é outono ruim, não é mais que isso."',
          'Quanto à nota do patrão, aproxima o livro do lampião e corre os olhos pela linha. "A mão dele, sim, miúda assim." Devolve o livro aberto na mesma página.',
        ],
        opcoes: [],
      },
      confronto_vidro: {
        fala: [
          'Silas Crane olha a lasca sem estender a mão. "Vidro de mostrador, {detective.treatment}, e dos finos. Numa oficina destas parte-se um por semana: a pinça escapa, o aro morde no encaixe, o chão fica com o resto. O rapaz varre toda noite; a bainha apanha o que a vassoura deixa."',
        ],
        opcoes: [],
      },
      // OS-S1 (PD-08) — A DÍVIDA DO OFICIAL, e a única retenção do caso com
      // contradição findável (G3). Ele conta a origem inteira, sem se poupar,
      // e é a aritmética que o desmente: quem paga ao penny todas as sextas
      // devia ver a soma descer, e a soma dele é a mesma há doze anos. O
      // jogador que fizer a conta encontra a jaula; o texto não a nomeia.
      confronto_emprestimos: {
        fala: [
          'Silas Crane lê a página de longe. Depois estende a mão, volta as folhas para trás até as primeiras, e para numa delas.',
          '"A minha está aí, {detective.treatment}, e está desde o primeiro ano de casa. A minha mulher esteve doente onze meses, e enterrá-la custou o que custa a um homem de bancada. O patrão adiantou; eu aceitei."',
          '"Pago todas as sextas, ao penny, e nunca falhei uma." Devolve o livro fechado, com as duas mãos. "Homem justo, o Sr. Arthurs. Justo como balança: não perdoava fiel."',
        ],
        opcoes: [],
      },
      // OS-S1 (E1) — O ARO. O gravador da casa soube do casamento antes da
      // vila, pela própria ordem de serviço. A retenção é do tamanho da dos
      // inocentes (G3): ele responde tudo o que se lhe pergunta sobre o
      // serviço, e não menciona uma vez o que a ordem lhe ensinou.
      confronto_anel: {
        fala: [
          'Toma o aro pelo bordo, entre dois dedos, e lê a ordem de serviço sem a desdobrar por inteiro.',
          '"A letra é do patrão, e a mão que havia de gravar era a minha: gravar por dentro de aro é serviço de ponta fina, e nesta casa faço-o eu." Pousa o aro no pano, com o papel por cima, como o achou.',
          '"Encomenda particular é particular, {detective.treatment}. Gravo o que se me manda gravar, e o que está por gravar não se comenta ao balcão."',
        ],
        opcoes: [],
      },
      // OS-S1 — O HOMEM DA ESTRADA. Quem pôs o forasteiro na boca do guarda
      // fica dito por ele mesmo, e dito como se fosse zelo. A frase final é a
      // que o jogador há de reler depois de saber o que aconteceu na cela.
      confronto_recoveiro: {
        fala: [
          'Ouve o termo até o fim, as mãos nos joelhos. "O homem da estrada."',
          '"Eu disse ao guarda que ele rondava a porta dos fundos desde o verão, e disse-o porque é verdade: recebia-lhe eu as caixas, contava-lhe as peças à frente dele, e nunca o deixei pousar nada cá dentro." A xícara do visitante fica onde está. "Não me alegra ter dito."',
          '"Do que ele conta da madrugada, o senhor há de tirar o peso. Gente da estrada é a estrada: passa." E, depois de um momento: "Homem preso conta o que o solte."',
        ],
        opcoes: [],
      },
      evasiva: {
        fala: [
          'Silas Crane inclina-se sobre a mesa o bastante para ver, e endireita-se. "Com licença de dizer, {detective.treatment}, a minha parte é corda e mola; o que isso valha, sabe a perícia. O que eu penso, já disse: gente da estrada, atrás do caixa."',
        ],
        opcoes: [],
      },
    },
  },

  papelaria: {
    suspeitoId: 'agnes_rooke',
    noInicial: 'abertura',
    // Tom ressonante: CORDIAL — a brandura racha-lhe a reserva um fio; à
    // pressão ela devolve pergunta por pergunta e nada mais.
    noEvasiva: 'evasiva',
    reacoesProva: {
      ev_cesta_rooke: 'reacao_cesta',
      ev_anel_encomenda: 'reacao_anel',
      dep_mulher_viela: 'reacao_viela',
      // OS-S1 (PD-16, PD-18, E15) — o fio nasce na cela e o maço aparece aqui.
      dep_cela_herrick: 'reacao_cartas',
    },
    // Perguntas de confronto (rótulos provisórios): uma por chave de reacoesProva.
    confrontos: [
      { requerCarta: 'ev_cesta_rooke', rotulo: '[Cesta de Ceia para Dois] Por que uma ceia para dois, se a senhora diz que passou a noite só?' },
      { requerCarta: 'ev_anel_encomenda', rotulo: '[Aro de Ouro por Gravar] Por que um aro por gravar com as suas iniciais?' },
      { requerCarta: 'dep_mulher_viela', rotulo: '[Uma Senhora na Viela] Por que a viram sair pela viela àquela hora?' },
      { requerCarta: 'dep_cela_herrick', rotulo: '[O Que o Recoveiro Achou de Madrugada] Que cartas eram as que não iam no saco?' },
    ],
    nos: {
      abertura: {
        fala: [
          'A loja cheira a goma e a papel novo; o balcão reluz de cera. Ao fundo, o postigo do correio e a balança de cartas, com algumas por despachar. Sobre o mostrador, apartado do resto, papel de carta com tarja de luto.',
          'A Sra. Agnes Rooke atende de pé, do lado de dentro do balcão, e mede o visitante por cima dos óculos. Alinha a pilha do papel com tarja sem olhar para ela. "{detective.treatment}." Não oferece cadeira. Espera a pergunta.',
        ],
        opcoes: [
          { rotulo: '"A senhora esconde a sua noite de sexta. Onde esteve?"', rotuloVars: ['"A senhora esconde a sua noite de sexta. Onde esteve?"', '"A sua sexta à noite, minha senhora. Sem meias palavras."'], vaiPara: 'b1_firme', tom: 'firme' },
          { rotulo: '"Perdão pela hora, minha senhora. A sexta-feira, como a passou?"', rotuloVars: ['"Perdão pela hora, minha senhora. A sexta-feira, como a passou?"', '"Com sua licença, minha senhora: a sexta-feira, como decorreu?"'], vaiPara: 'b1_cordial', tom: 'cordial' },
          { rotulo: '"Preciso do seu paradeiro na sexta à noite."', rotuloVars: ['"Preciso do seu paradeiro na sexta à noite."', '"A sexta à noite: hora e lugar, se me faz o favor."'], vaiPara: 'b1_tecnico', tom: 'tecnico' },
          { rotulo: '"A senhora fecha a loja tarde?"', rotuloVars: ['"A senhora fecha a loja tarde?"', '"A que horas corre o ferrolho da loja?"'], vaiPara: 'b1_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 1 — o paradeiro (sustentação: alibi_agnes em todo tom).
      b1_firme: {
        fala: [
          'Ergue o queixo uma linha. "Escondo o que não lhe compete, {detective.treatment}. Da sexta respondo, porque respondo a quem pergunta com direito."',
          '"Fechei a loja às seis, corri o ferrolho e subi. Não tornei a descer antes da manhã." Alinha a pilha de cadernos enquanto responde, o lombo de cada um à mesma altura: [[alibi_agnes]].',
        ],
        opcoes: [
          { rotulo: '"O que a vila dizia do Sr. Arthurs?"', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"A senhora o conhecia bem, o relojoeiro?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Que negócios tinha com o morto?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Esse papel de luto é para alguém?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_cordial: {
        fala: [
          'Baixa os óculos um instante, e a voz cede um fio. "A hora não me incomoda; a casa está de portas para a lei."',
          '"Às seis a loja fecha, e na sexta fechou às seis. Recolhi-me, e uma viúva não tem serões." Responde mais devagar do que na abertura: [[alibi_agnes]].',
        ],
        opcoes: [
          { rotulo: '"O que a vila dizia do Sr. Arthurs?"', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"A senhora o conhecia bem, o relojoeiro?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Que negócios tinha com o morto?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Esse papel de luto é para alguém?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_tecnico: {
        fala: [
          '"Paradeiro." Devolve a palavra como quem confere um recibo.',
          '"Seis horas: ferrolho corrido. Casa, e nada mais até a manhã de sábado." Nem uma sílaba além do que lhe pedem: [[alibi_agnes]].',
        ],
        opcoes: [
          { rotulo: '"O que a vila dizia do Sr. Arthurs?"', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"A senhora o conhecia bem, o relojoeiro?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Que negócios tinha com o morto?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Esse papel de luto é para alguém?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_obliquo: {
        fala: [
          '"Fecho quando a rua esvazia; loja não é taberna." O olhar não larga o visitante.',
          '"Na sexta a rua esvaziou às seis, e às seis fechei. Subi, e em cima fiquei": [[alibi_agnes]]. Do outro lado da vitrine, a High Street segue com o movimento de sábado.',
        ],
        opcoes: [
          { rotulo: '"O que a vila dizia do Sr. Arthurs?"', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"A senhora o conhecia bem, o relojoeiro?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Que negócios tinha com o morto?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Esse papel de luto é para alguém?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 2 — o morto e a vila (sustentação: comp_agnes em todo tom). No
      // cordial e no oblíquo, o papel de luto pesa mais no ar.
      b2_firme: {
        fala: [
          '"A vila que responda pela vila, {detective.treatment}; eu respondo pela minha loja."',
          'A resposta tem o tamanho exato da pergunta: [[comp_agnes]]. Os dedos ficam abertos sobre o balcão, sem tocar em nada.',
        ],
        opcoes: OPCOES_B3_AGNES,
      },
      b2_cordial: {
        fala: [
          '"O Sr. Arthurs comprava nesta casa o papel de escrituração. Homem pontual." A mão pousa junto ao papel de tarja preta e retira-se logo.',
          '"O que a vila acrescente é assunto da vila." Ao nome dele, a voz fica na altura em que estava: [[comp_agnes]].',
        ],
        opcoes: OPCOES_B3_AGNES,
      },
      b2_tecnico: {
        fala: [
          '"Negócios: papel de escrituração, à vista, uma vez por mês. Conta paga em dia, vinte anos."',
          'Nada além do livro-caixa: [[comp_agnes]]. Ao fundo, o postigo do correio, e na balança de cartas as que ainda hão de sair hoje.',
        ],
        opcoes: OPCOES_B3_AGNES,
      },
      b2_obliquo: {
        fala: [
          'Segue-lhe o olhar até o papel de luto e endireita a pilha antes de responder. "É papel de venda, {detective.treatment}, como qualquer outro."',
          'Daí por diante responde mais seca do que antes: [[comp_agnes]]. Os óculos sobem, e ela mede o visitante por cima deles.',
        ],
        opcoes: OPCOES_B3_AGNES,
      },

      // BEAT 3 — a pressão. No oblíquo, o meio-luto é perguntado de frente, e
      // a resposta dela não desfaz a ambiguidade da D5: o broche é do viúvo
      // que ela enterrou, e do domingo que não chegou ela não diz palavra.
      b3_firme: {
        fala: [
          '"Perco um freguês de vinte anos e o papel de escrituração que ele levava todo mês. Se a pergunta é de dinheiro, está respondida. Se é de outra coisa, faça-a."',
        ],
        alfinetada: ALFINETADA_AGNES,
        opcoes: [],
      },
      b3_cordial: {
        fala: [
          '"Comentar é ofício da vila, e a minha loja fica na rua dela." A mão procura a beira do balcão e ali fica. "Tenho a casa e tenho o balcão. Basta-me."',
        ],
        alfinetada: ALFINETADA_AGNES,
        opcoes: [],
      },
      b3_tecnico: {
        fala: [
          '"Abre. Está aberta agora, esteve ontem, e abre na segunda." Confere o postigo do correio antes de continuar. "Encomenda que chega tem dia de sair, e o dia está marcado no livro do correio."',
        ],
        alfinetada: ALFINETADA_AGNES,
        opcoes: [],
      },
      b3_obliquo: {
        fala: [
          'Ergue os olhos antes de responder. "Do Sr. Rooke, que enterrei. Devia ter deixado o azeviche no fim do prazo, e não deixei. {g:O senhor|A senhora} há de ter outra pergunta."',
        ],
        alfinetada: ALFINETADA_AGNES,
        opcoes: [],
      },

      // A CEIA CONCEDIDA, O NOIVADO NÃO (item 5 do playtest de 26/07/2026). A
      // cesta punha-lhe a noite abaixo e o casamento na mesa no mesmo fôlego:
      // o segredo de uma vida inteira caía numa frase. Agora a prova cobra o
      // que prova — a ceia e a mentira do paradeiro — e o noivado fica no
      // DEGRAU, pela mesma escada de Walter (D8): contador autoral sobre a
      // lista curada dos três papéis do casamento, dois bastam. Sem a escada,
      // ela cala o motivo e o decoro segue de pé; nada disto toca o motor (o
      // veredicto lê as tags das cartas, nunca esta fala).
      reacao_cesta: {
        fala: [
          'A Sra. Rooke olha o guardanapo bordado, depois o bilhete, e fica um momento sem falar.',
          '"A cesta é minha; o guardanapo também. Ceei com o Sr. Arthurs na sexta, às oito, e saí antes das nove." Torna a dobrar o guardanapo pela dobra antiga.',
          '"Menti sobre a minha noite, {detective.treatment}. A razão de eu lá estar é minha, e comigo fica."',
        ],
        degraus: [
          {
            // A lista NÃO é a de Walter (que conta pettigrew + vigário +
            // súplica): partilhar dois papéis com corte 2 faria os dois
            // degraus abrirem sempre juntos, e o casamento cairia duas vezes
            // na mesma partida. Aqui contam os papéis que tocam ELA — o aro
            // com as iniciais, os proclamas, e a senhora vista na viela.
            contaEntre: ['ev_anel_encomenda', 'ev_bilhete_vigario', 'dep_mulher_viela'],
            aPartirDe: 2,
            fala: [
              'Os papéis ficam onde os puseram, e ela não estende a mão para nenhum.',
              '"Então já não é razão minha; é papel de outra gente." Baixa os óculos e não torna a subi-los. "Estávamos ajustados para casar. O primeiro proclama estava marcado para amanhã, e o aro esperava gravação na bancada dele."',
              '"Uma viúva de cinquenta e oito anos que se casa com o relojoeiro dá a esta vila conversa para um ano. Preferi o luto ao falatório, e é essa a razão da minha mentira. Não há outra."',
            ],
          },
        ],
        opcoes: [],
      },
      reacao_anel: {
        fala: [
          'Toma a ordem de serviço presa ao aro e lê. Lê outra vez. "Trinta de outubro."',
          'Devolve o aro com o papel por cima, dobrado pela dobra que trazia. "Não cheguei a vê-lo. As iniciais {g:o senhor|a senhora} leu; não precisam de mim."',
          'Volta-se para o mostrador e endireita, uma a uma, as folhas do papel com tarja de luto.',
        ],
        opcoes: [],
      },
      reacao_viela: {
        fala: [
          'Ouve o relato até o fim sem mover as mãos. "A Sra. Wick não jura, e faz bem: daquela janela não se vê rosto. O passo era meu. Saí pela viela porque a High Street comenta." E depois: "Há mais alguma coisa?"',
        ],
        opcoes: [],
      },
      // OS-S1 (PD-16, PD-17, PD-18) — A QUARTA LEITURA DA LINHA RISCADA, e a
      // PONTE E15. O recoveiro carregava cartas fora do saco, e é isso, e só
      // isso, que a faz abrir a gaveta funda. O pretendente fica sem nome e
      // sem rosto (PD-17); o que ela entrega, além do maço, é a CHAVE do
      // terceiro degrau de Walter: a fonte que o morto citou à ceia.
      //
      // A jaula dela fecha-se aqui e o texto não a explica: ela só pôde dizer
      // «sangue dele» depois de as cartas estarem sobre o mostrador. Não havia
      // como acusar sem confessar, e é por isso que ela calou três dias.
      reacao_cartas: {
        fala: [
          'Ouve o termo do recoveiro sem interromper. Quando a leitura chega às cartas que não iam no saco, a mão esquerda procura a beira do balcão e ali fica.',
          '"Pois veja-as {g:o senhor|a senhora} mesmo, que eu não as leio outra vez." Abre a gaveta funda, tira o maço e põe-no sobre o mostrador, atado como estava: [[ev_cartas_do_passado]].',
          '"Quatro anos de sobrescritos de Moorford. A de cima é de agosto, e é a resposta a uma minha: fui eu que pedi que se acabasse, e acabou-se antes de qualquer papel de igreja."',
          '"E já que se fala em cartas." Endireita a pilha do papel de luto, que não estava por endireitar. "Na sexta à noite o Sr. Arthurs pôs-me este maço diante dos olhos sem nunca o ter tido nas mãos. Sabia dos sobrescritos, sabia das datas, e fez questão de dizer que não o inventava: que quem lho contara era sangue dele. Sangue, na família que lhe resta, é um só."',
        ],
        opcoes: [],
      },
      evasiva: {
        fala: [
          'A Sra. Rooke olha o que se lhe apresenta, o tempo de o ler ou de o reconhecer, e torna a erguer os olhos. "Se nisso há pergunta, {detective.treatment}, faça-a."',
        ],
        opcoes: [],
      },
    },
  },

  moinho: {
    suspeitoId: 'caleb_grey',
    noInicial: 'abertura',
    // Tom ressonante: TÉCNICO — homem de papel e testemunha, responde melhor
    // ao que é seco e de conta; à brandura, dá de ombros sem largar a saca.
    noEvasiva: 'evasiva',
    reacoesProva: {
      dep_queixa_grey: 'reacao_queixa',
      ev_livro_ordens: 'reacao_livro',
      // OS-S1 (PD-13) — a cena condicional: o caderno de pesos na mão dele.
      ev_livro_ii: 'reacao_pesos',
    },
    // Perguntas de confronto (rótulos provisórios): uma por chave de reacoesProva.
    confrontos: [
      { requerCarta: 'dep_queixa_grey', rotulo: '[Queixa do Relógio Mais Leve] Por que lavrou queixa contra o morto na véspera?' },
      { requerCarta: 'ev_livro_ordens', rotulo: '[Livro de Ordens de Serviço] Por que o seu relógio consta neste livro de consertos?' },
      { requerCarta: 'ev_livro_ii', rotulo: '[Caderno de Pesos do Relojoeiro] O peso do seu relógio está aqui. Confere?' },
    ],
    nos: {
      abertura: {
        fala: [
          'O moinho trabalha em pleno sábado: sacas na rampa, poeira de farinha na luz da porta, o carroceiro do Finch à espera com a parelha. Caleb Grey passa com uma saca ao ombro e não a pousa para cumprimentar. "Pergunte andando, {detective.treatment}, que a feira não espera defunto."',
        ],
        opcoes: [
          { rotulo: '"Pare a saca. Onde esteve na sexta à noite?"', rotuloVars: ['"Pare a saca. Onde esteve na sexta à noite?"', '"Pouse a saca um instante. A sexta à noite: onde?"'], vaiPara: 'b1_firme', tom: 'firme' },
          { rotulo: '"Sei que é dia de feira; só a sua sexta-feira, e sigo."', rotuloVars: ['"Sei que é dia de feira; só a sua sexta-feira, e sigo."', '"Não lhe roubo a feira: a sua sexta-feira, e o deixo à lida."'], vaiPara: 'b1_cordial', tom: 'cordial' },
          { rotulo: '"Sexta à noite: hora e testemunha, se tiver."', rotuloVars: ['"Sexta à noite: hora e testemunha, se tiver."', '"A sexta à noite, ao certo: hora, lugar e quem o viu."'], vaiPara: 'b1_tecnico', tom: 'tecnico' },
          { rotulo: '"Trabalha até tarde no moinho?"', rotuloVars: ['"Trabalha até tarde no moinho?"', '"O moinho mói até que horas?"'], vaiPara: 'b1_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 1 — o paradeiro (sustentação: alibi_grey em todo tom). No técnico,
      // aponta o carroceiro à mão, com a testemunha por nome.
      b1_firme: {
        fala: [
          'Pousa a saca, mas só até responder. "Parada a saca, parada a feira; seja rápido, então."',
          '"Sexta é véspera de feira. Das sete às onze carreguei, com dois jornaleiros e o carroceiro do Finch. Os nomes, anote aí." Torna a erguer a saca antes que a resposta esfrie: [[alibi_grey]].',
        ],
        opcoes: [
          { rotulo: '"O que o morto lhe devia? Diga o número."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Teve alguma desavença com o relojoeiro?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"A sua queixa contra ele: do que se tratava?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Confiava o seu relógio àquela loja?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_cordial: {
        fala: [
          'Não pousa a saca, mas afrouxa o passo. "Dia de feira é dia de feira, {detective.treatment}, mas a sexta eu dou."',
          '"Das sete às onze, no moinho, a carregar para hoje. Comigo, dois jornaleiros e o carroceiro do Finch, e nenhum deles saiu antes de mim." A resposta vem no vaivém das sacas, sem que ele pare uma vez: [[alibi_grey]].',
        ],
        opcoes: [
          { rotulo: '"O que o morto lhe devia? Diga o número."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Teve alguma desavença com o relojoeiro?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"A sua queixa contra ele: do que se tratava?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Confiava o seu relógio àquela loja?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_tecnico: {
        fala: [
          'A saca desce na carroça antes da resposta. "A sexta?"',
          '"Das sete às onze, no moinho: véspera de feira. Comigo, dois jornaleiros e o carroceiro do Finch. Os nomes, anote aí." O vaivém não para enquanto ele dá as horas: [[alibi_grey]].',
          'Aponta com o queixo o homem da carroça. "Um deles está ali. Pergunte agora, se quiser."',
        ],
        opcoes: [
          { rotulo: '"O que o morto lhe devia? Diga o número."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Teve alguma desavença com o relojoeiro?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"A sua queixa contra ele: do que se tratava?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Confiava o seu relógio àquela loja?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_obliquo: {
        fala: [
          '"Moinho fecha com a luz; farinha não mói no escuro." Encolhe o ombro que carrega a saca.',
          '"Carregar, isso carrega-se de lanterna, e na sexta carreguei até as onze, que hoje é feira. Estavam comigo dois jornaleiros e o carroceiro do Finch." A saca sobe outra vez ao ombro: [[alibi_grey]].',
        ],
        opcoes: [
          { rotulo: '"O que o morto lhe devia? Diga o número."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Teve alguma desavença com o relojoeiro?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"A sua queixa contra ele: do que se tratava?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Confiava o seu relógio àquela loja?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 2 — a queixa (sustentação: comp_grey em todo tom).
      b2_firme: {
        fala: [
          '"Quatro libras e dez xelins, e o conserto pago adiantado." Não pestaneja. "Morto, o homem me deve o mesmo que devia vivo; a queixa está lavrada e de pé."',
          '"E se me perguntam se choro, não choro." Diz de frente, e o carroceiro levanta a cabeça: [[comp_grey]].',
        ],
        opcoes: OPCOES_B3_GREY,
      },
      b2_cordial: {
        fala: [
          'Enxuga a testa com as costas da mão. "Desavença? O relógio caçador do meu pai entrou inteiro naquela loja e voltou mais leve. Não é desavença, {detective.treatment}, é conta."',
          '"Fui roubado dentro da loja do homem e ainda paguei o conserto adiantado. Chorar por ele, não choro." Volta às sacas sem esperar a pergunta seguinte: [[comp_grey]].',
        ],
        opcoes: OPCOES_B3_GREY,
      },
      b2_tecnico: {
        fala: [
          '"Exigi pesagem diante de testemunhas e lavrei termo em casa do Wycliffe, tudo antes de o homem morrer; as datas estão no papel. Quatro libras e dez xelins, conserto pago adiantado." A soma sai sem um erro.',
          '"Roubado dentro da loja dele, e ainda adiantei o dinheiro. Chorar não choro; cobrar, cobro enquanto houver de quem." A mó troca de compasso atrás dele, e ele espera a pergunta seguinte: [[comp_grey]].',
        ],
        opcoes: OPCOES_B3_GREY,
      },
      b2_obliquo: {
        fala: [
          '"Confiei uma vez, e paguei o conserto adiantado por cima." Passa a saca de um ombro ao outro. "Entrou pesado e voltou leve; o resto está em termo lavrado."',
          '"Se choro pelo homem? Fui roubado dentro da loja dele. Não choro." O carroceiro do Finch ouve da rampa e não se volta: [[comp_grey]].',
        ],
        opcoes: OPCOES_B3_GREY,
      },

      // BEAT 3 — a pressão. Correção do perito-forense (26/07/2026): processo
      // criminal MORRE com o acusado — não há queixa que «corra contra o
      // espólio». O que sobrevive é a DÍVIDA, por contrato, e contra quem
      // responder pelos bens. Grey perde a vingança e fica com a conta, que é
      // o que a bíblia de vozes diz dele desde sempre.
      b3_firme: {
        fala: [
          '"Cobro do espólio, que é o que a lei me deixa." Passa o peso ao outro pé, e a saca acompanha. "Quatro libras e dez xelins não morreram com ele. Quando houver quem responda pelos bens, é a esse que eu cobro."',
        ],
        alfinetada: ALFINETADA_GREY,
        opcoes: [],
      },
      b3_cordial: {
        fala: [
          '"Custou o dia da lavratura e o caminho até a casa do Wycliffe." Atrás dele a mó troca de compasso. "E custou o relógio do meu pai, que não voltou nem inteiro nem pesado."',
        ],
        alfinetada: ALFINETADA_GREY,
        opcoes: [],
      },
      b3_tecnico: {
        fala: [
          '"Ao homem, já não. Guarda nenhum prende defunto, e disso eu já me fiz a razão." Desce a saca na carroça.',
          '"Mas quatro libras e dez xelins são dívida da casa, e dívida a casa paga antes de repartir. Quando houver quem responda pelo espólio, respondo-lhe eu com o papel na mão, e a pesagem que eu pedi continua por fazer."',
        ],
        alfinetada: ALFINETADA_GREY,
        opcoes: [],
      },
      b3_obliquo: {
        fala: [
          '"Na vila, ninguém. Pesava ele, e a balança é dele." A farinha assenta-lhe no antebraço. "Para pesar como se deve, é o ourives de Moorford, e Moorford é hora e meia de estrada. Faço o caminho no dia em que me disserem que aquela balança está livre."',
        ],
        alfinetada: ALFINETADA_GREY,
        opcoes: [],
      },

      reacao_queixa: {
        fala: [
          'Olha o termo de longe. "Minha. Lavrada na sexta à tarde, diante do próprio Wycliffe, e assino outra vez aqui na tábua da rampa, se for preciso." Faz sinal ao carroceiro que espere. "Quatro libras e dez xelins. A queixa fica de pé até se pesar aquele relógio diante de gente."',
        ],
        opcoes: [],
      },
      reacao_livro: {
        fala: [
          'Limpa a mão na perna antes de tocar o livro. O dedo, branco de farinha, desce a coluna e para. "Este é o meu. O relógio do meu pai, e o preço adiantado somado à margem, da letra do próprio velho."',
          'Corre os olhos pelas linhas vizinhas. "Mais dois com queixa no mesmo outono. Eu pensava que o azar era só meu."',
          'Empurra o livro de volta pela tábua. "Eu sei o que entrou e o que saiu, {detective.treatment}; quem pôs a mão nele, a loja que diga."',
        ],
        opcoes: [],
      },
      evasiva: {
        fala: [
          'Olha por cima da saca, o tempo de dois passos, e encolhe os ombros sem soltá-la. "Disso não sei, e sem papel nem testemunha não juro. Pergunte de farinha, de pesagem ou do que me devem."',
        ],
        opcoes: [],
      },
      // OS-S1 (PD-13, PD-14) — O DETONADOR QUE NÃO SOUBE. Grey é o único da
      // High Street fora do livro de empréstimos, e por isso a fraude o
      // queimou como a ninguém. A queixa dele acertou dois relógios: acordou
      // a desconfiança do patrão no outono e apressou a mão do oficial na
      // sexta. A cena não lhe diz isso; dá-lhe o número e o balcão, e a conta
      // é dele. A última frase é a única coisa que ele conclui, e é sobre si.
      reacao_pesos: {
        fala: [
          'Limpa as duas mãos na perna antes de tocar o caderno de oleado. O dedo, branco de farinha, desce a coluna dos pesos e para na linha de outubro.',
          '"Entrada, quatro onças e meia. Saída, quatro e um quarto." Fica no número mais tempo do que precisa. "Está aqui escrito. Estava aqui escrito antes de eu me queixar."',
          'Fecha o caderno e pousa-o na tábua da rampa. "Levei a queixa três vezes ao balcão daquela loja, {detective.treatment}, e três vezes fui atendido pelo oficial. À terceira exigi papel, e o papel lavrei-o em casa do guarda, diante de testemunhas."',
          'A mó troca de compasso atrás dele, e ele não se volta. "Chamei ladrão ao morto. O ladrão recebia-me ao balcão."',
        ],
        opcoes: [],
      },
    },
  },

  // Diálogo EMBUTIDO (Onda 6): Walter vive dentro da estalagem — o botão
  // "Interrogar…" da localidade abre esta árvore por overlay próprio.
  dialogo_walter: {
    suspeitoId: 'walter_arthurs',
    origemLocalidade: 'estalagem',
    chamada: 'Interrogar Walter Arthurs',
    titulo: 'Interrogatório — Walter Arthurs',
    subtitulo: 'Herdeiro, hóspede do quarto nº 3',
    noInicial: 'abertura',
    // Tom ressonante: CORDIAL — a vergonha responde à brandura; à pressão,
    // bravata de praça. A mentira do carro nasce em qualquer tom.
    noEvasiva: 'evasiva',
    reacoesProva: {
      ev_registro_estalagem: 'confronto_registro',
      ev_suplica_cesto: 'confronto_suplica',
      dep_testamento: 'confronto_testamento',
      // OS-S1 (PD-02, PD-19, PD-20, E14/E15) — a ocorrência-gangorra, e o
      // terceiro degrau da escada dele.
      dep_briga_walter: 'confronto_briga',
    },
    // Perguntas de confronto (rótulos provisórios): uma por chave de reacoesProva.
    confrontos: [
      { requerCarta: 'ev_registro_estalagem', rotulo: '[Registro da Estalagem] Por que o registro traz a sua assinatura às sete e quarenta?' },
      { requerCarta: 'ev_suplica_cesto', rotulo: '[Carta Amassada em Bola] Por que escreveu ao seu tio pedindo dinheiro?' },
      { requerCarta: 'dep_testamento', rotulo: '[Testamento do Relojoeiro] Por que é o senhor o herdeiro único?' },
      { requerCarta: 'dep_briga_walter', rotulo: '[Gritos Ouvidos da Rua] O que mais se disse naquela loja além do que a rua ouviu?' },
    ],
    nos: {
      abertura: {
        fala: [
          'Walter Arthurs desce à sala sem casaco, a barba de ontem por fazer, e fica de pé junto ao aparador.',
          '"Soube esta manhã e estou aqui desde então, às ordens de quem as tiver. A casa do meu tio está lacrada; tomei o quarto três. Pergunte-se o que houver, {detective.treatment}, e pergunte-se logo, que negociante parado é dinheiro andando para trás." Enquanto fala, abotoa e desabotoa o botão alto do colete.',
        ],
        opcoes: [
          { rotulo: '"Onde esteve na sexta à noite? Pense antes de responder."', rotuloVars: ['"Onde esteve na sexta à noite? Pense antes de responder."', '"A sexta à noite, sr. Arthurs. E pense bem no que diz."'], vaiPara: 'b1_firme', tom: 'firme' },
          { rotulo: '"Deve ter sido um dia duro. A sexta, como foi?"', rotuloVars: ['"Deve ter sido um dia duro. A sexta, como foi?"', '"Não deve ter sido fácil. Conte-me da sua sexta."'], vaiPara: 'b1_cordial', tom: 'cordial' },
          { rotulo: '"O seu paradeiro na sexta, do fim da tarde à noite."', rotuloVars: ['"O seu paradeiro na sexta, do fim da tarde à noite."', '"Do fim da tarde à noite de sexta: onde esteve, e quando."'], vaiPara: 'b1_tecnico', tom: 'tecnico' },
          { rotulo: '"Dormiu bem, na sexta?"', rotuloVars: ['"Dormiu bem, na sexta?"', '"A que horas se recolheu, na sexta?"'], vaiPara: 'b1_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 1 — o paradeiro (sustentação: alibi_walter, corroborado:false,
      // em todo tom — a mentira do carro).
      b1_firme: {
        fala: [
          'O botão do colete para entre os dedos. "Pensado está." Endireita-se antes de responder. "Estive com meu tio de tarde, tratamos de negócios, e segui o meu caminho."',
          '"Tomei o carro das seis para Moorford e dormi no Station. Soube da desgraça esta manhã e vim no primeiro trem." Alisa o colarinho ao dar as horas: [[alibi_walter]].',
        ],
        opcoes: [
          { rotulo: '"Sabe o que a morte do tio lhe traz?"', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Que homem era o seu tio, para o senhor?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Em que pé estão os seus negócios?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Custa dormir a crédito num Station?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_cordial: {
        fala: [
          '"Duro, {detective.treatment}, é a palavra." Por um instante o botão fica quieto. "Estive com meu tio de tarde, tratamos de negócios, e segui o meu caminho."',
          '"Carro das seis, Moorford, e o Station para dormir. Vim de manhã no primeiro trem, e um sobrinho sem casa aberta toma o quarto que houver." O botão volta a girar entre os dedos enquanto ele dá as horas: [[alibi_walter]].',
        ],
        opcoes: [
          { rotulo: '"Sabe o que a morte do tio lhe traz?"', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Que homem era o seu tio, para o senhor?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Em que pé estão os seus negócios?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Custa dormir a crédito num Station?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_tecnico: {
        fala: [
          '"Do fim da tarde à noite. Sim." Conta pelos dedos, como quem alinha uma fatura. "Meu tio de tarde, negócios; depois, o meu caminho."',
          '"O carro das seis me pôs em Moorford; o Station lançou-me quarto e ceia na conta, que é como me conhecem lá. Vim no primeiro trem, esta manhã." A mão sobe ao colarinho quando as horas saem: [[alibi_walter]].',
        ],
        opcoes: [
          { rotulo: '"Sabe o que a morte do tio lhe traz?"', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Que homem era o seu tio, para o senhor?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Em que pé estão os seus negócios?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Custa dormir a crédito num Station?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_obliquo: {
        fala: [
          '"Dormi o que se dorme numa noite dessas." O botão volta a girar. "Estive com meu tio de tarde, negócios, e segui o meu caminho."',
          '"O carro das seis me pôs em Moorford, e no Station me conhecem de outras vezes. Dormi o que se dorme numa cama de estalagem, e de manhã tomei o primeiro trem." Os olhos ficam na porta da sala enquanto as horas saem: [[alibi_walter]].',
        ],
        opcoes: [
          { rotulo: '"Sabe o que a morte do tio lhe traz?"', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"Que homem era o seu tio, para o senhor?"', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"Em que pé estão os seus negócios?"', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Custa dormir a crédito num Station?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 2 — o tio e os negócios (SEM carta: caracterização; a defesa
      // que responde ao que ninguém perguntou).
      b2_firme: {
        fala: [
          '"O que a morte me traz? Trabalho e credores, {detective.treatment}, na ordem que quiser. Herdeiro único, sim; e o que herdo é uma loja lacrada, um inventário e juízo pela frente."',
          '"Se isso me faz réu aos seus olhos, faça a conta inteira, que a minha lista de credores é mais longa do que qualquer herança."',
        ],
        opcoes: OPCOES_B3_WALTER,
      },
      b2_cordial: {
        fala: [
          '"Meu tio era homem de uma peça. Recolheu-me quando meu pai morreu, pagou-me o colégio, e não me deixou esquecer nem uma coisa nem outra." O polegar corre a barba por fazer.',
          '"Achei-o como sempre: são, duro no dinheiro, senhor das suas horas. Quem lhe fez isto que responda, e hei de cobrar eu mesmo, que afinal é o que se espera de um herdeiro, não é assim que dizem?"',
        ],
        opcoes: OPCOES_B3_WALTER,
      },
      b2_tecnico: {
        fala: [
          '"Vão mal, e disso nunca fiz segredo. Devo às fazendas, devo ao armazém que anda em juízo, devo até ao Station de Moorford, onde durmo a crédito. A lista é pública e eu a sei de cor." A voz, alta no princípio, acaba quase para dentro.',
          '"Da herança falem os outros; eu falo do que devo, que ao menos é meu."',
          // OS-S1 (E6) — a aresta Walter ↔ Silas. O negociante viu o que o
          // perito há de provar, disse-o ao tio, e o tio riu-se. A frase do
          // morto é a máscara dele inteira em nove palavras.
          '"De números eu percebo, e uma vez disse-lho: loja sempre cheia, caixa sempre magro, as somas não batiam. Riu-se de mim." Encolhe um ombro. "\'De números tratas tu, de horas trato eu\', foi o que ele me respondeu."',
        ],
        opcoes: OPCOES_B3_WALTER,
      },
      b2_obliquo: {
        fala: [
          '"Custa, {detective.treatment}, e não é o pior que custa." O botão para. "Um negociante de quarenta e quatro anos que dorme a crédito aprende a não reparar em certas coisas. Perguntou-me da cama; a cama eu tenho. Do resto, pergunte à minha lista de credores, que é longa e verdadeira."',
        ],
        opcoes: OPCOES_B3_WALTER,
      },

      // BEAT 3 — a pressão. O herdeiro faz a conta do que herda em voz alta,
      // que é o que ele faz desde o primeiro beat; a novidade é o tamanho da
      // voz, e ela encolhe.
      b3_firme: {
        fala: [
          '"Vendo a loja, vendo a casa, pago o que devo e fico com o que sobrar. Não tenho mão para relógio nem paciência para bancada, e nunca fingi que tinha."',
        ],
        alfinetada: ALFINETADA_WALTER,
        opcoes: [],
      },
      b3_cordial: {
        fala: [
          '"Tenho Moorford, e em Moorford tenho um armazém em juízo. Meu tio me recolheu quando meu pai morreu. Agora não há quem recolha, e aos quarenta e quatro anos é que vou aprender a coisa."',
        ],
        alfinetada: ALFINETADA_WALTER,
        opcoes: [],
      },
      b3_tecnico: {
        fala: [
          '"Não esperam. Nunca esperaram. Testamento a provar leva meses, e casa não se vende sem papel provado; a minha letra mais próxima vence antes do Natal. Hei de pedir prazo com papel de procurador na mão, e é o papel que o credor lê, não a minha cara."',
        ],
        alfinetada: ALFINETADA_WALTER,
        opcoes: [],
      },
      b3_obliquo: {
        fala: [
          '"O quarto três eu pago com o que trouxe, e o que trouxe cabe no bolso do colete." Abotoa o botão alto e torna a desabotoá-lo. "Enquanto o estalajadeiro me fiar, durmo aqui."',
        ],
        alfinetada: ALFINETADA_WALTER,
        opcoes: [],
      },

      confronto_registro: {
        fala: [
          'Walter Arthurs lê a própria assinatura e a linha das sete e quarenta. Puxa uma cadeira e senta-se antes de responder. "Não houve carro." A voz sai baixa, e depois as palavras vêm de uma vez.',
          '"Vim na sexta pedir dinheiro ao meu tio. Pedido, implorado, a juro de praça e com a palavra que me resta. Ele recusou aos gritos, com a loja ainda aberta."',
          '"Tomei este quarto porque àquela hora já não havia carro, e porque naquela noite eu não tinha ânimo de me apresentar em hotel nenhum. Fiquei no três a noite inteira, escrevendo: cartas a ele, cartas a credores. Pedi vela nova pela meia-noite; o caseiro que o diga."',
          '"Menti, {detective.treatment}, porque a verdade era esta: um negociante de quarenta e quatro anos à porta do tio, de chapéu na mão, ouvindo não. Depois dos gritos, na loja não tornei a pôr os pés."',
          'Depois cala-se, as mãos abertas sobre a mesa.',
        ],
        opcoes: [],
      },
      confronto_suplica: {
        fala: [
          'Walter desamassa a folha só até onde a letra aparece e torna a fechá-la pela mesma dobra. "A mão é minha; o pedido, também." Pousa-a na mesa com a escrita para baixo.',
          '"Um adiantamento entre parentes se propõe em toda parte, {detective.treatment}, e se lavra no gabinete de um procurador quando aceito. Escrevi-a como se escreve a um credor: com conta, prazo e juro."',
          '"Esperava-lhe destino melhor. Meu tio não era homem de responder papéis que o desagradassem."',
        ],
        opcoes: [],
      },
      // O SEGUNDO DEGRAU (D3, OS-R6 Fase 4). A D3 dizia «Walter sabia da
      // mudança do testamento e omite», e mandava que isso caísse no 2.º
      // degrau do confronto. O degrau cobra o que JÁ está na mesa e não custa
      // carta nova: o procurador guardou o pedido de tratar «mudanças no
      // testamento, por razão de matrimônio»; o bilhete do vigário datou-o,
      // marcando os proclamas para o domingo seguinte à morte; e a súplica
      // amassada põe o sobrinho à porta do tio na própria sexta.
      //
      // A escada é CONTADOR AUTORAL, não `requerTodas` (D8): a lista é
      // curada, o corte é uma contagem. Dois dos três bastam para o perito
      // pressionar — e nenhum deles, sozinho, prova que ele soube.
      //
      // O degrau rende PROSA e mais nada: nenhum [[id]], nenhum nó novo.
      // Aprofunda a isca sem tocar na cadeia física que o inocenta.
      confronto_testamento: {
        fala: [
          '"Herdeiro único. Sei o que se soma com isso: negócios em ruína de um lado, loja e casa do outro, e o meu nome no meio. É conta que qualquer credor meu já fez." Puxa o colete para baixo, como quem se compõe para retrato.',
          '"Pois faça-se a conta inteira, {detective.treatment}. Meu tio vivo valia-me um adiantamento assinado numa tarde; agora vale-me uma loja lacrada, um inventário e juízo pela frente. Diga-me qual dos dois convinha a um homem com credores à porta."',
        ],
        degraus: [
          {
            contaEntre: ['corrob_pettigrew', 'ev_bilhete_vigario', 'ev_suplica_cesto'],
            aPartirDe: 2,
            fala: [
              'Ouve o resto sem estender a mão para a folha que lhe puseram diante. O botão do colete fica onde está.',
              '"Sabia." Diz de uma vez, e o resto vem devagar. "Ele me contou na sexta, atrás do balcão, ao cair da tarde. Que ia casar, que ia lavrar tudo de novo na segunda-feira, e que eu me arranjasse. Foi por isso que gritei, e foi por isso que ele gritou. Quem passasse na rua ouviu os dois."',
              '"E omiti." Endireita-se na cadeira. "Omiti porque a vergonha do que ouvi naquela loja pesa mais do que a herança que se soma depois dela. Pois ponha no papel: eu soube, eu pedi, ele recusou, e saí de lá com o chapéu na mão."',
            ],
          },
        ],
        opcoes: [],
      },
      // O TERCEIRO DEGRAU (PD-19, PD-20, E14). A escada de Walter tinha dois:
      // a mentira do carro cai pelo registro, e o «sabia do testamento» cai no
      // degrau de `confronto_testamento`. Faltava o de cima, e ele não se paga
      // com papel da árvore dele: paga-se com o que a papelaria entrega depois
      // de a cela abrir a boca. É a primeira cadeia de confronto do jogo que
      // ATRAVESSA DUAS ÁRVORES (a ponte E15), e a mecânica é a que já havia —
      // contador autoral sobre uma lista curada (D8), sem carta nova (PD-21).
      //
      // A LEITURA DUPLA DO MÓBIL. Quem só vê dívida, herança e briga condena-o;
      // quem chega a este degrau descobre que às nove daquela noite ele se
      // julgava ganho SEM ter matado ninguém. O móbil não morre: muda de
      // temperatura, e o mural desempata pelo nexo, como o jogo quer.
      confronto_briga: {
        fala: [
          'Walter Arthurs lê a ocorrência e devolve-a pela beira, com dois dedos. "O recoveiro. Só podia ser o recoveiro."',
          '"Apanhou a minha pior hora do degrau da rua e vendeu-a ao guarda por um álibi." O botão do colete para no meio da volta. "Não o desminto, {detective.treatment}. Gritámos os dois, e eu gritei primeiro."',
        ],
        degraus: [
          {
            contaEntre: ['ev_cartas_do_passado', 'ev_cesta_rooke', 'dep_cela_herrick'],
            aPartirDe: 2,
            fala: [
              'Ouve o resto sem mexer as mãos, que ficam abertas sobre a mesa.',
              '"Uma frase o homem da estrada apanhou, e essa é minha. A outra não apanhou, e essa também é minha." Endireita-se na cadeira, e a voz sai sem altura nenhuma. "Fui eu que lhe contei das cartas de Moorford. Trouxe-as sabidas de casa, para o caso de o pedido falhar; o pedido falhou, e eu disse-lho da porta antes de sair."',
              '"Sabia o que o casamento fazia ao testamento e sabia o que aquilo fazia ao casamento. Às nove daquela noite eu julgava-me ganho sem ter posto a mão em ninguém." Cala-se, e o resto vem devagar. "Se aquilo pesou na ceia, é {g:o senhor|a senhora} que mo há de dizer. Eu não durmo para mo dizer sozinho."',
            ],
          },
        ],
        opcoes: [],
      },
      evasiva: {
        fala: [
          'Walter recebe o que se lhe mostra e devolve-o antes de o examinar, os dedos no colarinho. "E que tenho eu com isto? Entendo de fazendas e de letras de câmbio."',
          '"Já dei o meu paradeiro e o nome dos meus credores; se é para me mostrarem cada papel desta vila, mostrem também aos outros, que não sou o único nome escrito em Briarstone."',
        ],
        opcoes: [],
      },
    },
  },

  // Diálogo EMBUTIDO (Onda 6): Davey vive dentro da oficina — a conversa
  // com o aprendiz abre por botão, e as cartas dele nascem das falas.
  dialogo_davey: {
    suspeitoId: 'davey_tull',
    origemLocalidade: 'oficina',
    chamada: 'Conversar com Davey Tull',
    titulo: 'Conversa — Davey Tull',
    subtitulo: 'Aprendiz, dois anos de bancada',
    noInicial: 'abertura',
    // Tom ressonante: CORDIAL — o menino abre à brandura; à firmeza, encolhe
    // e responde só o que lhe perguntam, de olhos na vassoura.
    noEvasiva: 'evasiva',
    reacoesProva: {
      ev_relogio_bolso: 'reacao_relogio',
      ev_estojo_buril: 'reacao_estojo',
    },
    // Perguntas de confronto (rótulos provisórios): uma por chave de reacoesProva.
    confrontos: [
      { requerCarta: 'ev_relogio_bolso', rotulo: '[Relógio de Bolso Parado] Por que o relógio do patrão parou sem corda?' },
      { requerCarta: 'ev_estojo_buril', rotulo: '[Buril Claro no Estojo] Por que um buril está mais limpo que os outros no estojo?' },
    ],
    nos: {
      abertura: {
        fala: [
          'Davey Tull varre um chão que já não dá pó. Ao ver gente, encosta a vassoura no ombro e espera a pergunta de olhos erguidos. "O Sr. Crane disse pra eu tomar conta da oficina. Eu tomo conta e vou varrendo, que parado o serviço não rende."',
        ],
        opcoes: [
          { rotulo: '"Olha para mim, rapaz. Que costumes tinha o teu patrão?"', rotuloVars: ['"Olha para mim, rapaz. Que costumes tinha o teu patrão?"', '"Ergue os olhos, rapaz. Que homem era o teu patrão?"'], vaiPara: 'b1_firme', tom: 'firme' },
          { rotulo: '"Não tenhas receio. Fala-me do teu patrão."', rotuloVars: ['"Não tenhas receio. Fala-me do teu patrão."', '"Fica descansado. Conta-me do Sr. Arthurs."'], vaiPara: 'b1_cordial', tom: 'cordial' },
          { rotulo: '"Os hábitos do Sr. Arthurs, à noite. Descreve-os."', rotuloVars: ['"Os hábitos do Sr. Arthurs, à noite. Descreve-os."', '"Os costumes do teu patrão à noite: descreve-mos por ordem."'], vaiPara: 'b1_tecnico', tom: 'tecnico' },
          { rotulo: '"Aprendias a dar corda aos relógios?"', rotuloVars: ['"Aprendias a dar corda aos relógios?"', '"Sabias dar corda aos relógios da casa?"'], vaiPara: 'b1_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 1 — os costumes do patrão (sustentação: dep_habito_corda em todo
      // tom). No cordial, a fala vem mais solta, com o orgulho do ofício.
      b1_firme: {
        fala: [
          'Os olhos sobem, depressa, e a vassoura aperta-se contra o ombro. "Costumes eu conto, senhor."',
          '"O patrão dava corda no relógio do bolso às onze, antes de subir pra deitar. Todas as noites, sem faltar uma." Conta curto, o que lhe perguntam e nada mais: [[dep_habito_corda]].',
        ],
        opcoes: [
          { rotulo: '"E na sexta à noite, onde estavas? Sem gaguejar."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"E a tua sexta-feira, rapaz? Conta com calma."', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"A tua noite de sexta, do fecho da loja em diante."', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Dormes aqui na oficina?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_cordial: {
        fala: [
          'A vassoura desce um pouco, e a voz solta-se. "O patrão punha o relógio consertado no meu ouvido, pra eu ouvir se o compasso saíra certo. Dizia que máquina bem posta respira. Eu já acerto o de parede sozinho; o de bolso ele ainda não deixava."',
          '"E de noite, antes de subir pra deitar, dava corda no de bolso. Às onze, sempre; nunca falhou uma — ele mesmo contava, de manhã, como quem confere lição. Dizia que aquele guarda trinta horas de corda, e que quem deixa a corda acabar não é homem de ofício."',
          'A vassoura torna ao chão enquanto ele fala: [[dep_habito_corda]].',
        ],
        opcoes: [
          { rotulo: '"E na sexta à noite, onde estavas? Sem gaguejar."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"E a tua sexta-feira, rapaz? Conta com calma."', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"A tua noite de sexta, do fecho da loja em diante."', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Dormes aqui na oficina?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_tecnico: {
        fala: [
          '"À noite, senhor, o patrão fechava sempre pela mesma ordem." A vassoura encosta no ombro.',
          '"Primeiro as tampas da vitrine, depois apagar o lampião da loja." Conta a ordem sem se enganar em nenhuma.',
          '"A corda do de bolso era mais tarde: onze horas, antes de subir pra deitar, e isso era todas as noites." Diz a hora e para nela: [[dep_habito_corda]].',
        ],
        opcoes: [
          { rotulo: '"E na sexta à noite, onde estavas? Sem gaguejar."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"E a tua sexta-feira, rapaz? Conta com calma."', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"A tua noite de sexta, do fecho da loja em diante."', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Dormes aqui na oficina?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },
      b1_obliquo: {
        fala: [
          '"Aprendia, senhor, mas o de bolso ele ainda não deixava; só o de parede." O queixo desce um pouco.',
          '"No de bolso dava ele, e sempre à mesma hora: onze, antes de subir. Dizia que aquele aguenta trinta horas, e que quem deixa parar não merece o ofício." Diz e espera a pergunta seguinte, de olhos no serviço: [[dep_habito_corda]].',
        ],
        opcoes: [
          { rotulo: '"E na sexta à noite, onde estavas? Sem gaguejar."', vaiPara: 'b2_firme', tom: 'firme' },
          { rotulo: '"E a tua sexta-feira, rapaz? Conta com calma."', vaiPara: 'b2_cordial', tom: 'cordial' },
          { rotulo: '"A tua noite de sexta, do fecho da loja em diante."', vaiPara: 'b2_tecnico', tom: 'tecnico' },
          { rotulo: '"Dormes aqui na oficina?"', vaiPara: 'b2_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 2 — a noite de sexta (sustentação: alibi_davey em todo tom).
      b2_firme: {
        fala: [
          'Os olhos descem para a vassoura e lá ficam. "Sem gaguejar, senhor; já contei mais de uma vez."',
          '"Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem, eu para casa. Minha mãe serviu a sopa às oito." As palavras saem sem tropeço, na ordem em que vêm sempre: [[alibi_davey]].',
        ],
        opcoes: OPCOES_B3_DAVEY,
      },
      b2_cordial: {
        fala: [
          '"A sexta eu conto certinho, que já contei mais de uma vez." A vassoura fica quieta.',
          '"Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem, eu para casa. Minha mãe serviu a sopa às oito." Conta sem pressa, de olhos na vassoura até o fim, e não acrescenta nada: [[alibi_davey]].',
        ],
        opcoes: OPCOES_B3_DAVEY,
      },
      b2_tecnico: {
        fala: [
          '"Do fecho em diante, senhor." Os olhos descem para o serviço e lá ficam.',
          '"Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem, eu para casa. Minha mãe serviu a sopa às oito." Nem uma hora a mais nem uma a menos do que lhe pedem: [[alibi_davey]].',
        ],
        opcoes: OPCOES_B3_DAVEY,
      },
      b2_obliquo: {
        fala: [
          '"Não, senhor; durmo em casa, com a minha gente. Da oficina saio quando o Sr. Crane tranca."',
          '"Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem, eu para casa. Minha mãe serviu a sopa às oito." A resposta vem inteira, e vem com as palavras da primeira vez: [[alibi_davey]].',
        ],
        opcoes: OPCOES_B3_DAVEY,
      },

      // BEAT 3 — a pressão, e ela é ECONÔMICA E SÓ (G7, GR6-9). O rapaz dá os
      // números que sabe de cor e não faz a conta: quem a faz é o jogador, com
      // o livro na mão. Nada de ressentimento posto na boca dele — foi esse o
      // risco fino que a R5 apontou, e é por aqui que ele entraria.
      b3_firme: {
        fala: [
          'Aperta o cabo da vassoura com as duas mãos. "O Sr. Crane disse que a casa paga quando a casa puder. Eu venho assim mesmo."',
        ],
        alfinetada: ALFINETADA_DAVEY,
        opcoes: [],
      },
      b3_cordial: {
        fala: [
          '"O patrão pagava às sextas, antes de fechar. Sexta ele lançou o meu, como sempre, e escreveu no livro. Na outra sexta é que eu não sei quem escreve."',
        ],
        alfinetada: ALFINETADA_DAVEY,
        opcoes: [],
      },
      b3_tecnico: {
        fala: [
          '"Quatro xelins por semana, {detective.treatment}, às sextas, antes de fechar." Dá a quantia depressa. "Desde o fim de março nenhum deles vem comigo; ficam com a casa. O patrão anotava tudo no livro estreito da bancada."',
        ],
        alfinetada: ALFINETADA_DAVEY,
        opcoes: [],
      },
      b3_obliquo: {
        fala: [
          '"Levo a marmita, para a minha mãe tornar a enchê-la." Encosta a vassoura no ombro. "De dinheiro não levo nada desde o fim de março. Isso o patrão anotava no livro, todas as sextas."',
        ],
        alfinetada: ALFINETADA_DAVEY,
        opcoes: [],
      },

      reacao_relogio: {
        fala: [
          'Davey encosta a vassoura na parede e estende as duas mãos. "Posso ouvir?"',
          'Encosta o relógio do morto no ouvido, do jeito que o patrão fazia com ele, e fica assim um bom tempo, os olhos parados na parede. "Está no seu compasso. Bem posto."',
          'Antes de devolver, volta-o com o fundo para cima e passa a unha pela borda. "Este tem tampa de dentro: por baixo da tampa do fundo vem outra, que se levanta pela unha, no entalhe. O patrão chamava aquilo de cuvette, à francesa, e ria de mim quando eu errava a palavra."',
          '"Por dentro dela é que a fábrica grava o nome e a conta dos rubis. E o que o dono quiser pôr de seu." Devolve-o com as duas mãos.',
          '"A corda das onze, pro patrão, era coisa sagrada, que nem reza; dois anos de casa, e esse relógio nunca soube o que era ficar sem corda." E torna à vassoura sem que ninguém o mande.',
        ],
        opcoes: [],
      },
      reacao_estojo: {
        fala: [
          'Davey chega sem que o chamem e para a um passo do estojo, as mãos atrás das costas. "Esse é o do Sr. Crane. Ferramenta dele ninguém pega; a minha é a do caixote, de cabo de freixo."',
          '"Buril a gente limpa na flanela, com a cera da bancada, e é da cera que vem esse pardo todo nos cabos. Molhar não pode, que a água entra por baixo da virola e enferruja o espigão; isso o patrão me ensinou no primeiro mês. O de ponta é o de gravar miúdo, por dentro de tampa; um igual já me escapou e me abriu o dedo, no primeiro ano."',
          'O olho corre a fileira, cabo por cabo. "O Sr. Crane cuida do que é dele, senhor: passa a flanela em cada um antes de fechar o estojo, toda noite, e nunca o vi deixar ferramenta por limpar."',
          'Recua o passo que tinha dado.',
        ],
        opcoes: [],
      },
      evasiva: {
        fala: [
          'Davey chega o rosto para ver de perto, a testa franzida, e faz que não com a cabeça. "Isso eu não sei dizer o que é, {detective.treatment}. Se fosse coisa de relógio, eu conhecia; do resto, quem sabia era o patrão."',
        ],
        opcoes: [],
      },
    },
  },

  // OS-S1 — O SEXTO HOMEM. Diálogo EMBUTIDO na cela (origemLocalidade), e não
  // nó de conversa: o cubículo tem prosa própria, e é nela que o auto de exame
  // entra se o corredor se fechar. `someSeEvento` retira o botão quando isso
  // acontece — não se interroga quem o legista já lavrou.
  //
  // Tom ressonante: FIRME. É o único do elenco que responde melhor a quem o
  // empurra: doze anos de guardas a pará-lo na estrada ensinaram-lhe que quem
  // pergunta com jeito quer alguma coisa a mais.
  dialogo_herrick: {
    suspeitoId: 'nathan_herrick',
    origemLocalidade: 'cela',
    someSeEvento: 'silenciar_herrick',
    chamada: 'Interrogar Nathan Herrick',
    titulo: 'Interrogatório — Nathan Herrick',
    subtitulo: 'Recoveiro, preso na cela do posto',
    noInicial: 'abertura',
    noEvasiva: 'evasiva',
    reacoesProva: {
      ev_pegada_argila: 'reacao_pegada',
      ev_livro_emprestimos: 'reacao_livro',
      dep_briga_walter: 'reacao_briga',
    },
    confrontos: [
      { requerCarta: 'ev_pegada_argila', rotulo: '[Meia Pegada de Argila] Por que há argila da estrada no degrau do beco?' },
      { requerCarta: 'ev_livro_emprestimos', rotulo: '[Livro de Empréstimos] Por que o morto guardava um relógio seu em penhor?' },
      { requerCarta: 'dep_briga_walter', rotulo: '[Gritos Ouvidos da Rua] Por que foi o senhor quem levou a briga ao posto?' },
    ],
    nos: {
      abertura: {
        fala: [
          'O guarda abre o corredor com o joelho, que traz as duas mãos ocupadas de papel, e fica à porta. Nathan Herrick espera de pé junto à grade, o casaco de estrada dobrado sobre o braço, as botas cobertas de argila seca até o cano.',
          '"Que horas são, senhor? Não é por pressa." A pergunta vem antes de qualquer outra coisa, e a resposta ele recebe sem comentar. "Puseram-me aqui no sábado à tarde. Ninguém me disse por quanto tempo, e daqui não se ouve sino."',
        ],
        opcoes: [
          { rotulo: '"A sua noite de sexta. E deixe a história da estrada para depois."', rotuloVars: ['"A sua noite de sexta. E deixe a história da estrada para depois."', '"A sexta à noite, Herrick. Sem a estrada por cima."'], vaiPara: 'b1_firme', tom: 'firme' },
          { rotulo: '"Sente-se. Conte-me a sua sexta-feira do fim da tarde em diante."', rotuloVars: ['"Sente-se. Conte-me a sua sexta-feira do fim da tarde em diante."', '"Fique à vontade. A sua sexta-feira, do fim da tarde em diante."'], vaiPara: 'b1_cordial', tom: 'cordial' },
          { rotulo: '"A sexta: hora de partida, caminho e paragens."', rotuloVars: ['"A sexta: hora de partida, caminho e paragens."', '"Dê-me a sexta por partes: hora, caminho, paragens."'], vaiPara: 'b1_tecnico', tom: 'tecnico' },
          { rotulo: '"Faz esta estrada há muito tempo?"', rotuloVars: ['"Faz esta estrada há muito tempo?"', '"Há quanto tempo corre o senhor esta estrada?"'], vaiPara: 'b1_obliquo', tom: 'obliquo' },
        ],
      },

      // BEAT 1 — o paradeiro (sustentação: alibi_herrick em todo tom). A
      // estrada é a história que ele deu ao guarda no sábado, e é a que ele
      // repete aqui. Não se corrige a si mesmo neste beat, em nenhum tom.
      b1_firme: {
        fala: [
          'Endireita-se contra a grade e não desvia os olhos. "A estrada é a história porque é onde eu estava, senhor."',
          '"Saí da vila às sete, com a carroça vazia. Dormi sob a lona, à altura da ponte de Caulfield. Tornei a entrar já com a feira aberta, e pela High Street não passei." Dá as horas depressa, e ao fim de cada uma olha a porta do corredor: [[alibi_herrick]].',
        ],
        opcoes: OPCOES_B2_HERRICK,
      },
      b1_cordial: {
        fala: [
          'Senta-se na beira da tábua e põe o casaco sobre os joelhos. "É bom que alguém pergunte com jeito. Vou-lhe dizer como foi."',
          '"Sete horas, carroça vazia, estrada fora. A lona é o meu teto desde rapaz; a ponte de Caulfield tem abrigo do vento e água para a mula, e é ali que se dorme." Conta o caminho aos bocados, como quem o mede a pé: [[alibi_herrick]].',
          'E acrescenta o resto sem que se lhe peça: "Entrei outra vez com a feira já aberta."',
        ],
        opcoes: OPCOES_B2_HERRICK,
      },
      b1_tecnico: {
        fala: [
          '"Hora de partida, sete. Caminho, a estrada de Moorford até a ponte de Caulfield: três milhas e meia por vala funda."',
          '"Paragens, nenhuma, que carroça vazia não se para. Dormi sob a lona e vim com o dia." As milhas saem sem que ele as procure: [[alibi_herrick]].',
          'A meio da conta interrompe-se. "Desculpe. O senhor pode dizer-me as horas outra vez?"',
        ],
        opcoes: OPCOES_B2_HERRICK,
      },
      b1_obliquo: {
        fala: [
          '"Terceira geração, senhor. O meu avô fazia isto a pé, com o cesto às costas, e o meu pai já com a mula."',
          'Depois responde ao que ninguém lhe perguntou ainda, e no mesmo tom em que falava dos avós. "Na sexta saí às sete, com a carroça vazia. Dormi na estrada, sob a lona, e entrei com a feira aberta." As horas vêm já postas em fila: [[alibi_herrick]].',
        ],
        opcoes: OPCOES_B2_HERRICK,
      },

      // BEAT 2 — a corrida das sacas (sustentação: dep_cela_herrick em todo
      // tom). A aresta E8 é o que abre este beat: quem o pôs na vila antes de
      // clarear não foi a perícia, foi a dívida com o moleiro. E o segundo
      // termo derruba a manhã inteira do guarda — às cinco menos um quarto a
      // porta já estava mordida no batente.
      b2_firme: {
        fala: [
          'A resposta demora, e quando vem é mais baixa que as outras. "Devia. Devia-lhe a corrida, e fui buscá-la antes de clarear, que é como se faz na véspera de feira."',
          '"Vou dizer ao senhor o que não disse ao guarda. Chame quem escreve, que eu assino por baixo." E dá-o de uma vez, sem que se lhe torne a perguntar: [[dep_cela_herrick]].',
        ],
        opcoes: OPCOES_B3_HERRICK,
      },
      b2_cordial: {
        fala: [
          'Passa a mão pela barba por fazer e demora a olhar para cima. "As sacas eram minhas de dever, senhor. O Sr. Grey fia-me desde o tempo do meu pai, e quem fia cobra em serviço."',
          '"Fui buscá-las antes das cinco, que a feira não espera." Cala-se um momento e depois pede o papel. "Escreva o resto, faça favor, e escreva tudo, que eu não quero contar isto duas vezes": [[dep_cela_herrick]].',
        ],
        opcoes: OPCOES_B3_HERRICK,
      },
      b2_tecnico: {
        fala: [
          '"Carrega-se antes das cinco. Doze sacas de cento e quarenta libras, e a rampa do moinho é de tábua: com o dia claro já não se sobe sozinho."',
          '"Portanto às quatro e três quartos eu estava na vila, e não à hora que disse ao guarda." Diz a correção como quem corrige um peso, e pede que se lave o termo: [[dep_cela_herrick]].',
        ],
        opcoes: OPCOES_B3_HERRICK,
      },
      b2_obliquo: {
        fala: [
          '"Abre com o dia, senhor, mas quem vende monta antes. Feira de outubro é escura até as sete."',
          'Fica um momento a olhar a argila das próprias botas. "E eu montei a do Sr. Grey, o que quer dizer que estive na vila antes de clarear. Já que se escreve, escreva-se o resto": [[dep_cela_herrick]].',
        ],
        opcoes: OPCOES_B3_HERRICK,
      },

      // BEAT 3 — a pressão. O eixo é o de todos (o que a morte muda para quem
      // ficou), e o dele é aritmética de estrada: corridas por semana, libras
      // por saca, uma soma que não para de correr.
      b3_firme: {
        fala: [
          '"As corridas da relojoaria eram três por semana, e acabaram na sexta. Ficam-me as sacas do moinho e o que o correio mandar." Conta pelos dedos e para no terceiro. "Dá para a mula. Para a mula e para mim é que não dá."',
        ],
        alfinetada: ALFINETADA_HERRICK,
        opcoes: [],
      },
      b3_cordial: {
        fala: [
          '"Responder por mim?" Passa a mão pela barba. "O meu pai fez esta estrada, e o pai dele. Na vila isso não vale um papel assinado, e é papel que o guarda pede."',
          '"Quem me fiava o porte era a senhora do correio. Fiava."',
        ],
        alfinetada: ALFINETADA_HERRICK,
        opcoes: [],
      },
      b3_tecnico: {
        fala: [
          '"À porta dos fundos entregava-se ao oficial. Era ele quem contava as peças à minha frente e assinava por baixo do meu nome; dentro nunca me deixou pousar caixa nenhuma."',
          '"Enquanto a casa não abrir, o que vier de fora fica na estação de Moorford, e quem o quiser que o vá buscar."',
        ],
        alfinetada: ALFINETADA_HERRICK,
        opcoes: [],
      },
      b3_obliquo: {
        fala: [
          '"Resgatava-o no dia em que a soma parasse de correr, e ela não parava." Olha o pulso, que não tem nada, e deixa a mão cair. "Três libras em março. Em setembro eram três libras e o relógio. Pergunte-me pelo mês que vem, que a conta há de ser a mesma."',
        ],
        alfinetada: ALFINETADA_HERRICK,
        opcoes: [],
      },

      reacao_pegada: {
        fala: [
          'Olha o desenho da sola por cima do papel e não estende a mão. "É minha. Bota de recoveiro tem a sola cravejada em três fileiras, e argila da vala de Moorford não sai nem à escova."',
          '"Pisei o degrau depois de a porta estar aberta, e não antes. O senhor tem aí a ordem em que as coisas caíram: a tinta primeiro, a minha sola por cima." Torna a sentar-se. "Se eu tivesse aberto aquela porta, a argila estaria por baixo das lascas."',
        ],
        opcoes: [],
      },
      reacao_livro: {
        fala: [
          'Corre a linha com o dedo e para no seu nome antes de o encontrarem por ele. "Três libras, em março, pelo inverno mau. A mula esteve para morrer e eu não tinha com que a tratar."',
          '"Em setembro já não bastava, e ele tomou o relógio. De prata, do meu pai." Fecha o livro sem que lho peçam. "Na estrada dizia-se que o relojoeiro ajudava. Ajuda, aprendi a soletrar: são cinco letras e o juro corrido por baixo delas."',
          '"Desde setembro pergunto as horas a quem passa, senhor. Um recoveiro sem relógio é um homem a pedir a hora aos outros."',
        ],
        opcoes: [],
      },
      reacao_briga: {
        fala: [
          'Reconhece o termo pelo formato antes de o ler. "Fui eu que a levei ao posto, no sábado à tarde."',
          '"Estive à porta às sete, para pedir prazo, e não cheguei a bater: lá dentro havia dois homens aos gritos e não se pede prazo em casa de briga. Do degrau apanhei uma frase, e uma só."',
          '"Fui dizer o que ouvi para não me perguntarem o que fazia eu ali." Passa o casaco de um braço para o outro. "Grito de gente da família é pior que o de credor: credor quer o dinheiro, família quer razão."',
        ],
        opcoes: [],
      },
      evasiva: {
        fala: [
          'Chega o rosto à grade o tempo de ver, e recua. "Disso não sei, senhor, e não vou dizer que sei para agradar a ninguém. Pergunte-me de estrada, de porte ou do que eu devo, que dessas três eu respondo."',
        ],
        opcoes: [],
      },
    },
  },
};

/**
 * @deprecated Lê SÓ os diálogos do caso-escola. Em runtime use obterDialogos
 * de pacote_caso.js, que responde pelo caso CARREGADO (inclusive os gerados).
 * Este fica para o gerador/QA (ilhas de build).
 */
export function obterDialogo(localidadeId) {
  return DIALOGOS[localidadeId] || null;
}
