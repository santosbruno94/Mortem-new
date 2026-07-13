// =====================================================================
// Localidades do caso (§5 do contexto): cartas na superfície da mesa
// que, clicadas, abrem como overlay de prosa imersiva sobre a
// escrivaninha. Os marcadores [[id_da_carta]] são substituídos, na
// renderização, pelo termo clicável em negrito cujo clique extrai a
// carta correspondente (carimbo integrado, §6).
//
// A prosa admite interpolação {detective.campo} e a flexão de gênero
// {g:texto no masculino|texto no feminino} (resolvida pelo pronome).
// =====================================================================

export const LOCALIDADES = [
  {
    id: 'corpo',
    rotuloMesa: 'O Corpo',
    titulo: 'O Corpo — Escritório dos Fundos',
    subtitulo: 'Sr. Geoffrey Arthurs, relojoeiro, 61 anos',
    acoesEspeciais: ['termometro'],
    prosa: [
      'O morto jaz de costas entre a escrivaninha e a estante, os braços ao longo do corpo, o colete abotoado. O Delegado Wycliffe mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.',
      'Ao primeiro exame do tronco e dos membros, [[ev_rigor]]. Voltado o corpo com o auxílio do guarda, veem-se [[ev_livores]], espalhadas também pela face posterior das pernas.',
      'Sob o colarinho aberto corre uma [[ev_sulco]]; à lente de aumento, [[ev_fibras_sulco]]. Nos olhos entreabertos, [[ev_petequias]].',
      'A maleta de instrumentos está aberta sobre a cadeira. O termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar oportuno medir o que o corpo ainda tem a dizer.',
    ],
  },
  {
    id: 'cena',
    rotuloMesa: 'A Cena do Crime',
    titulo: 'A Cena — Escritório dos Fundos da Relojoaria',
    subtitulo: 'Briarstone, High Street, nº 7',
    acoesEspeciais: [],
    prosa: [
      'O escritório está revirado. Papéis cobrem o assoalho; sobre a lareira, um retângulo sem poeira marca onde estava o relógio.',
      '[[ev_relogio]] está agora no tapete, a caixa partida, os ponteiros imóveis. O Delegado aponta-o como a peça central do caso, e repete-o a quem entra.',
      'As [[ev_gavetas]] estão abertas, o conteúdo pelo assoalho. Na corrente do colete do morto pende um relógio de ouro; sobre a escrivaninha, uma caixa de soberanos de tampa fechada.',
      'O exame palmo a palmo recolhe lascas do verniz do relógio, um [[ev_fio_la]], um [[ev_lenco]], felpa solta do tapete. Na porta que dá para o beco, uma [[ev_fechadura]]: marcas de alavanca no lado de fora do batente.',
    ],
  },
  {
    id: 'delegacia',
    rotuloMesa: 'A Delegacia',
    titulo: 'Arquivos da Delegacia de Briarstone',
    subtitulo: 'Delegado Lemuel Wycliffe',
    acoesEspeciais: [],
    prosa: [
      'A delegacia é uma sala única, com cheiro de tinta e turfa. Wycliffe abre os armários sem cerimônia: "O que é meu é {g:do senhor|da senhora}, {detective.title} {detective.surname}. Fique à vontade. Aqui em Briarstone tudo acaba num papel, mais cedo ou mais tarde; imaginação nos falta, mas arquivo, isso não."',
      'Entre os papéis do morto, recolhidos por precaução, está o [[dep_testamento]], lavrado há dois anos em favor do sobrinho.',
      'Numa pasta à parte, [[dep_dividas]] endereçadas a Edgar Arthurs: somas, observa Wycliffe, "que um escrevente não junta em dez anos de vida honesta".',
      'E no livro de ocorrências, com a tinta ainda fresca de três semanas, uma [[dep_briga]]: Thomas Blackwood e o relojoeiro, ameaças trocadas diante de meia taverna.',
      'Num bilhete da primeira diligência, Wycliffe anotou a [[dep_visto_vivo]]: a governanta serviu-lhe a ceia e recolheu a louça antes de a casa adormecer.',
      'E dá fé, ainda, a uma vizinha: [[dep_avistamento_falso]]. "Se a Sra. Gale o viu à janela, o homem amanheceu vivo", repete ele, duas vezes.',
      'Por fim, um relato que lhe acende os olhos: [[dep_acusa_hudson]]. "Se o Pruitt a viu sobre o corpo à meia-noite, {detective.title}, é só prender a governanta e ir jantar."',
    ],
  },
  {
    id: 'interrogatorio_edgar',
    rotuloMesa: 'Edgar Arthurs',
    titulo: 'Interrogatório — Edgar Arthurs',
    subtitulo: 'Sobrinho e único herdeiro, 38 anos',
    acoesEspeciais: [],
    prosa: [
      'Edgar recebe {detective.title} {detective.surname} na saleta da relojoaria, chá já servido, o luto passado a ferro. "Fui eu quem o encontrou, às nove e meia. A porta dos fundos arrombada, o escritório naquele estado. O relógio no chão, parado nas nove — {g:o senhor|a senhora} há de tirar disso o que eu não sei tirar."',
      'Sobre a véspera, responde antes de a pergunta fechar: um [[alibi_edgar]] — "das oito às onze, à mesa do Clube, em Moorford. Voltei tarde, dormi até as oito." Serve o chá. "O Clube fica a boa hora e meia de estrada. Não é lugar de ir e vir na mesma noite."',
      'Em tudo o mais, uma [[comp_edgar]]: responde completo, oferece chá, lamenta o tio nas mesmas palavras cada vez.',
      'Ao estender a mão para a chaleira, Edgar deixa ver, contra o tecido escuro, [[ev_fibras_manga]].',
    ],
  },
  {
    id: 'interrogatorio_hudson',
    rotuloMesa: 'Sra. Hudson',
    titulo: 'Interrogatório — Sra. Mabel Hudson',
    subtitulo: 'Governanta da casa, 55 anos',
    acoesEspeciais: [],
    prosa: [
      'A Sra. Hudson recebe na cozinha da casa grande e não convida a sentar. Dezessete anos servindo ao morto, e diante {g:do perito|da perita} não gasta duas palavras onde uma serve. Em toda a conversa, [[comp_hudson]]: o avental vai e volta entre os dedos, sem achar onde parar.',
      'Sobre a noite do dia 13, a declaração vem inteira, rápida e sem tropeço, [[alibi_hudson]]: "Recolhi-me às nove, como sempre. Só desci às sete."',
      'O fogão de ferro está apagado. A governanta traz um [[ev_xale]] sobre os ombros.',
      '"Posso ir? Tenho a casa toda por fazer, e ninguém mais vai fazê-la." Já está de pé antes da resposta, a mão na aba do avental.',
    ],
  },
  {
    id: 'interrogatorio_blackwood',
    rotuloMesa: 'Thomas Blackwood',
    titulo: 'Interrogatório — Thomas Blackwood',
    subtitulo: 'Taverneiro do The Crossed Keys, 42 anos',
    acoesEspeciais: [],
    prosa: [
      'O The Crossed Keys cheira a cerveja velha e serragem. Blackwood não interrompe o serviço para responder: seca canecas enquanto fala, e fala alto.',
      '"Se veio me perguntar se eu odiava o velho, economize a viagem: odiava. Sangrava-me de juros havia seis anos, e cobrava na porta, aos gritos." Pousa a caneca sem baixar a voz. Em tudo, [[comp_blackwood]].',
      'Sobre a noite de 13, ele larga o pano: [[alibi_blackwood]]. "Das oito às dez, atrás deste balcão. Noite de sexta, véspera de feira: casa cheia até o fecho, meia Briarstone bebeu da minha mão. Das dez à meia-noite, fechei a casa. Contas, canecas, o moço que varre o salão. Quer os nomes? Tome doze, e me deixe trabalhar."',
      'Três fregueses, ouvidos em separado à porta, confirmam: até o fecho, o taverneiro não deixou o balcão.',
    ],
  },
  {
    id: 'clube_moorford',
    rotuloMesa: 'Clube de Moorford',
    titulo: 'Clube Comercial de Moorford',
    subtitulo: 'A hora e meia de estrada — onde Edgar diz ter passado a noite',
    acoesEspeciais: [],
    prosa: [
      'Hora e meia de estrada separam Briarstone do Clube Comercial, e o salão de carvalho e fumo recebe {detective.title} {detective.surname} com a cortesia de sempre. O porteiro lembra-se bem de Edgar Arthurs.',
      'Sobre a noite de 13, o livro de presença e a memória do porteiro contam a mesma coisa: [[corrob_moorford]]. O jantar terminou cedo, e a cadeira de Edgar esvaziou-se por volta das oito e meia.',
      'Depois dessa hora, diz o porteiro, ninguém tornou a vê-lo no salão.',
    ],
  },
];

export function obterLocalidade(id) {
  return LOCALIDADES.find((l) => l.id === id) || null;
}
