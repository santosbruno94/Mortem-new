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
      'O morto jaz de costas entre a escrivaninha e a estante, os braços ao longo do corpo, o colete ainda abotoado. O Delegado Wycliffe mandou que nada se tocasse até a chegada {g:do perito|da perita}. Obedeceram a medo: até as moscas parecem aguardar licença.',
      'Ao primeiro exame, [[ev_rigor]]. Voltando o corpo com auxílio do guarda, notam-se [[ev_livores]], que não cedem à pressão do polegar.',
      'No pescoço, sob o colarinho desfeito, um [[ev_sulco]] — e, à lente de aumento, [[ev_fibras_sulco]]. Nos olhos entreabertos, [[ev_petequias]].',
      'A maleta de instrumentos aguarda aberta sobre a cadeira. O termômetro de mercúrio está à mão, se {detective.title} {detective.surname} julgar oportuno medir o que o corpo ainda tem a dizer.',
    ],
  },
  {
    id: 'cena',
    rotuloMesa: 'A Cena do Crime',
    titulo: 'A Cena — Escritório dos Fundos da Relojoaria',
    subtitulo: 'Briarstone, High Street, nº 7',
    acoesEspeciais: [],
    prosa: [
      'O escritório foi revirado por mãos que tinham um propósito. Papéis cobrem o assoalho; sobre a lareira, o lugar vazio onde por vinte anos marcou horas um relógio de família.',
      'Ele está agora no tapete: um [[ev_relogio]], a caixa partida, os ponteiros imóveis sobre as nove em ponto. O Delegado o considera a peça central do caso — e o diz a quem quiser ouvir.',
      'As [[ev_gavetas]] contam uma história curiosa: quem as revirou desprezou o relógio de ouro na corrente do morto e a caixa de soberanos à vista na escrivaninha.',
      'Na porta que dá ao beco, uma [[ev_fechadura]], com lascas de alavanca pelo lado de fora. Junto à gaveta mais funda, quase invisível contra a madeira escura, um [[ev_fio_la]].',
      'E atrás da estante, caído na sombra onde a vassoura não chega, [[ev_lenco]] — fino, limpo, esquecido com pressa por quem não morava ali.',
    ],
  },
  {
    id: 'delegacia',
    rotuloMesa: 'A Delegacia',
    titulo: 'Arquivos da Delegacia de Briarstone',
    subtitulo: 'Delegado Lemuel Wycliffe',
    acoesEspeciais: [],
    prosa: [
      'A delegacia é uma sala única com cheiro de tinta e turfa. Wycliffe abre os armários sem cerimônia: "O que é meu é {g:do senhor|da senhora}, {detective.title} {detective.surname}. Briarstone não tem segredos — tem gavetas."',
      'Entre os papéis do morto, recolhidos por precaução, está o [[dep_testamento]], lavrado há dois anos em favor do sobrinho.',
      'Numa pasta à parte, [[dep_dividas]] endereçadas a Edgar Arthurs — somas, observa Wycliffe, "que um escrevente não junta em dez anos de vida honesta".',
      'E no livro de ocorrências, com a tinta ainda fresca de três semanas, uma [[dep_briga]]: Thomas Blackwood e o relojoeiro, ameaças trocadas diante de meia taverna.',
      'Num bilhete da primeira diligência, Wycliffe anotou a [[dep_visto_vivo]]: a governanta serviu-lhe a ceia antes de a casa adormecer, e foi a última a vê-lo com vida.',
      'E dá fé, ainda, a uma vizinha — [[dep_avistamento_falso]]. "Se a Sra. Gale o viu à janela, o homem amanheceu vivo", repete ele, satisfeito com a sua cronologia.',
      'Por fim, um relato que lhe acende os olhos: [[dep_acusa_hudson]]. "Se o Pruitt a viu sobre o corpo à meia-noite, {detective.title}, é só prender a governanta e ir jantar." Wycliffe já se vê com o caso fechado.',
    ],
  },
  {
    id: 'interrogatorio_edgar',
    rotuloMesa: 'Edgar Arthurs',
    titulo: 'Interrogatório — Edgar Arthurs',
    subtitulo: 'Sobrinho e único herdeiro, 38 anos',
    acoesEspeciais: [],
    prosa: [
      'Edgar recebe {detective.title} {detective.surname} na saleta da relojoaria, chá já servido, o luto passado a ferro. "Fui eu quem o encontrou, às nove e meia. A porta dos fundos arrombada, o escritório naquele estado. O relógio no chão, parado nas nove — o senhor há de tirar disso o que eu não sei tirar."',
      'Sobre a véspera, responde antes de a pergunta fechar: um [[alibi_edgar]] — "das oito às onze, à mesa do Clube, em Moorford. Voltei tarde, dormi até as oito." Serve o chá. "O Clube fica a boa hora e meia de estrada. Não é lugar de ir e vir na mesma noite."',
      'Em tudo o mais, uma [[comp_edgar]]: responde completo, oferece chá, lamenta o tio nas mesmas palavras cada vez.',
      'Ao estender a mão para a chaleira, o punho direito do casaco passa sob o lampião. No tecido escuro, {detective.title} {detective.surname} distingue [[ev_fibras_manga]].',
    ],
  },
  {
    id: 'interrogatorio_hudson',
    rotuloMesa: 'Sra. Hudson',
    titulo: 'Interrogatório — Sra. Mabel Hudson',
    subtitulo: 'Governanta da casa, 55 anos',
    acoesEspeciais: [],
    prosa: [
      'A Sra. Hudson recebe na cozinha da casa grande, e não convida a sentar. Dezessete anos servindo ao morto e nem uma lágrima — apenas [[comp_hudson]], que ela não consegue esconder nem torcendo o avental.',
      'Sobre a noite do dia 13, a declaração sai decorada: [[alibi_hudson]] — "Recolhi-me às nove, como sempre. Só desci às sete, quando o Sr. Edgar já gritava no quintal."',
      'Faz frio na cozinha. Sobre os ombros dela, um [[ev_xale]] — lã cinzenta, fina, com um fio puxado na barra, da mesma cor de um certo fio achado no escritório.',
      '"Posso ir? Tenho a casa toda por fazer, e ninguém mais vai fazê-la." Os olhos, porém, não deixam a porta do corredor que leva ao escritório.',
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
      '"Se veio me perguntar se eu odiava o velho, economize a viagem: odiava. Ele me estrangulava de juros há seis anos." Pousa a caneca. Diante da palavra que escolheu, é o único na taverna que não se constrange. Em tudo, [[comp_blackwood]].',
      'Sobre a noite de 13, ri sem alegria: [[alibi_blackwood]] — "Das oito à meia-noite, atrás deste balcão. Sábado de feira: meia Briarstone bebeu da minha mão. Quer os nomes? Tome doze."',
      'Três fregueses, ouvidos em separado à porta, confirmam sem combinar: o taverneiro não deixou o balcão um minuto sequer.',
    ],
  },
  {
    id: 'clube_moorford',
    rotuloMesa: 'Clube de Moorford',
    titulo: 'Clube Comercial de Moorford',
    subtitulo: 'A três horas de estrada — onde Edgar diz ter passado a noite',
    acoesEspeciais: [],
    prosa: [
      'A estrada até Moorford é longa, e o salão de carvalho e fumo do Clube Comercial recebe {detective.title} {detective.surname} com a cortesia morna de quem nada tem a esconder. O porteiro, porém, lembra-se de Edgar Arthurs — e de mais do que ele gostaria.',
      'Sobre a noite de 13, o livro de presença e a memória do porteiro contam a mesma história: [[corrob_moorford]]. O jantar terminou cedo, e a cadeira de Edgar esfriou muito antes das onze que ele jura.',
      'Nada aqui prende ninguém. Mas a hora e meia de volta a Briarstone, essa, cabe de sobra entre o prato frio e a meia-noite.',
    ],
  },
];

export function obterLocalidade(id) {
  return LOCALIDADES.find((l) => l.id === id) || null;
}
