# MORTEM — Bíblia de Vozes

> Cada personagem fala de um jeito só dele. O teste: **cubra o nome do falante e leia a
> fala; se não dá para adivinhar quem é, a voz falhou.** No texto anterior, todos —
> guarda, taverneiro, governanta, narrador — produziam o mesmo aforismo polido; esta é
> a correção. Cada verbete traz: registro, ritmo, tique verbal, léxico e uma amostra
> curta. A norma-mãe é `docs/guia-de-estilo.md`.

---

## O narrador (terceira pessoa)

- **Registro:** literário de época, sóbrio. Presente do indicativo; câmera fixa sobre a
  mesa e a cena.
- **Ritmo:** frases de comprimento variado; períodos que se fecham em **fato concreto**,
  não em ironia. Sensorial: cor, cheiro, textura, temperatura, som.
- **Regra dura:** observação pura (guia §2). Não conclui, não aponta, não estranha pelo
  jogador. Nenhum "curioso", "limpo demais", "de quem não tinha pressa".
- **Tique:** nenhum — o narrador é o mais invisível dos falantes. Sua assinatura é a
  ausência de assinatura.
- **Amostra:** *"O morto jaz de costas entre a escrivaninha e a estante, os braços ao
  longo do corpo, o colete abotoado."*

## O mestre / legista (a voz da dica — `vozMestre`, `falaDoMestre.js`)

- **Registro:** oral, de professor experiente a aprendiz. Técnico, mas sem pompa.
- **Ritmo:** afirmativo, curto, seguro. Enuncia a leitura e para.
- **Léxico:** os termos do laudo (rigor, livor, sulco, ligadura, família, assinatura),
  ditos com naturalidade de quem os usa há trinta anos.
- **Limite (crítico):** leitura **técnica** apenas — janela de horas, família e
  assinatura do sinal, estado do corpo. **Nunca** aponta pista ("guarde isso"), conclui
  autoria ("por mãos alheias"), liga vestígio a suspeito ou declara encenação (guia
  §2.4).
- **Tique:** pensa em faixas e ordens ("primeiro isto, depois aquilo"; "entre tantas e
  tantas horas").
- **Amostra:** *"Rígido dos maxilares aos joelhos: isto é de horas, não de minutos. Doze
  a vinte e quatro, eu diria."*

## Guarda Lemuel Wycliffe

- **Quem é:** policial de vila, honesto e fora de sua profundidade; quer o caso fechado
  para poder jantar. Confia no óbvio (a "história A": relógio das 08h45 + luz da
  madrugada = ladrão de fora).
- **Patente (lavrada):** de ofício é *constable* da *county constabulary*, destacado no
  posto de um homem de Briarstone (casa + expediente + cela) — a patente que a KB dá ao
  policial de vila (`demografia-e-sociedade.md` §3), que patrulha e prende mas quase não
  investiga e serve de *coroner's officer* (`inquerito-e-policia.md` §1–§2).
  **"Guarda" é a glosa vernácula da vila** (D11, revista na OS-R1, 25/07/2026): é a
  **Opção A** da tabela de tradução (`inquerito-e-policia.md` §5), e substituiu "Delegado",
  que soava a polícia brasileira do século XX. Ele **assina "guarda"**; o lugar chama-se
  **"o posto"**. A glosa é uniforme; a verdade da patente fica lavrada aqui. O idioleto
  abaixo não muda.
- **Por que não "condestável".** Foi a primeira escolha da D11 e caiu no parecer do
  `perito-forense`: em português, *condestável* nomeou o **Condestável do Reino** (1382, a
  segunda figura da hierarquia militar depois do rei) e depois o **chefe de artilharia**;
  o **Caldas Aulete**, dicionário contemporâneo a 1893, regista cinco acepções e **nenhuma
  policial**. O uso policial é calco moderno do inglês norte-americano. Sobre o homem que
  esta KB define como "o homem de ronda; a base da pirâmide", era inflação de patente.
- **Divergência assumida, e é pequena.** A tabela recomenda **B** (manter o posto inglês
  grifado), e o caso *gerado* obedece — diz *constable*. O caso-escola usa a Opção A da
  mesma tabela. As duas prosas divergem na superfície; unificá-las é da OS-R9.
- **Consequência a vigiar:** "guarda" passou a nomear só quem tem a patente — Wycliffe e
  Tobin. O homem posto à porta da relojoaria é "um homem", não "um guarda", para que a
  palavra não signifique duas coisas na mesma cena.
- **Resolvido na OS-R4 (25/07/2026):** o posto de Briarstone é de **um homem só**, e o homem
  é Wycliffe. **Tobin faz a ronda de Caulfield** e desce a High Street às oito, no ponto em
  que as duas rondas se encontram — de passagem, o que explica por que vê a vitrine e não
  fica. Martelo do utilizador entre as três opções da OS §5(b); é a única que não obriga a
  mexer em `dep_visto_vivo`, a carta que fixa o piso da janela (G4).
- **Registro:** cordial, prolixo, provinciano-formal. Adora uma frase que se ache
  espirituosa e às vezes tropeça nela.
- **Ritmo:** períodos que começam firmes e se desdizem no meio ("isto é… quero dizer…").
  Autocorreção é o tique dele.
- **Léxico:** burocrático de posto de vila (livro de ocorrências, diligência, arquivos),
  salpicado de ditados caseiros ("não temperar a sopa antes do cozinheiro").
- **Tique:** entrega a perícia ao perito com uma deferência que é meio alívio, meio
  covardia ("o palpite é meu, a perícia é sua").
- **Amostra:** *"Se o Pruitt a viu sobre o corpo à meia-noite, é prender a governanta e
  ir jantar. Mas o palpite é meu; a perícia, essa, é do senhor."*

## Silas Crane (o assassino — o artífice solícito)

- **Quem é:** primeiro-oficial da relojoaria, 47, doze anos de casa; achou o corpo.
  Trocava ouro dos consertos por metal vil; matou para calar a denúncia. A solicitude
  técnica é a máscara.
- **Registro:** manso, deferente, de bancada. Fala pouco de si e muito do ofício.
- **Ritmo:** medido, sem pressa; dá as horas do próprio álibi **sem procurá-las na
  memória** (a precisão é o defeito). As mãos, sempre quietas.
- **Léxico:** de oficina (corda, coroa, mola, entalhe, conserto); trata o perito com
  a cerimônia de quem serve há décadas ("com licença de dizer").
- **Tique:** oferece teoria sobre o ladrão a quem não pediu — e volta a ela, com
  variações, ao longo da conversa. Nunca pergunta o que a perícia achou.
- **Amostra:** *"Doze anos nesta casa. Fui eu que o achei, ontem às nove e vinte, e
  mandei o rapaz correr ao posto do guarda. Gente da estrada, digo eu — atrás do caixa."*

## Walter Arthurs (a isca — o herdeiro quebrado)

- **Quem é:** sobrinho e herdeiro único, 44, negociante de Moorford em ruína; implorou
  dinheiro ao tio na sexta, foi recusado aos gritos e pernoitou na estalagem
  escrevendo súplicas. Mente por humilhação, não por sangue.
- **Registro:** verboso, defensivo, digno-ofendido; explica-se antes de acusado.
- **Ritmo:** períodos longos que começam altivos e acabam em queixa; alisa o colarinho
  ao dar as horas.
- **Léxico:** de praça (credores, fazendas, juízo, diligência, adiantamento).
- **Tique:** cita credores e somas pelo nome, como quem confere uma lista; volta
  sempre a "disso nunca fiz segredo".
- **Amostra:** *"Os meus negócios vão mal, e disso nunca fiz segredo. Da herança
  falem os outros; eu falo do que devo, que ao menos é meu."*

## Sra. Agnes Rooke (a inocente que mente — o decoro)

- **Quem é:** viúva, 58, dona da loja e correio (postmistress da vila); noiva secreta
  da vítima (o casamento marcado revogaria o testamento). Ceou com ele às 20h de sexta
  e mente por decoro.
- **Motivo (ficha, não fala):** como postmistress, manuseia e vê a correspondência de
  toda a vila; quem vive do sigilo alheio é quem mais teme o falatório, e o ofício
  reforça o decoro. O idioleto não muda por causa disso.
- **Registro:** formal, econômico, de dona de loja que não deve satisfação.
- **Ritmo:** respostas exatas do tamanho da pergunta; nada de monossílabo servil —
  frase inteira, e ponto final.
- **Léxico:** de loja, de correio e de luto (papel de carta, tarja, encomenda, selo,
  franquia, serão).
- **Tique:** ao nome do morto, a mão procura a beira do balcão; a voz não muda. Alinha
  o que estiver ao alcance (cadernos, lombos de livro) enquanto responde.
- **Amostra:** *"Fechei a loja às seis e recolhi-me. Uma viúva não tem serões. Há mais
  alguma coisa?"*

## Caleb Grey (o ruído — a queixa legítima)

- **Quem é:** moleiro, 46; devolveu à loja um relógio de caça "mais leve" e lavrou
  queixa na véspera da morte. Não mente; o rancor dele é o registro público da fraude
  de outro homem.
- **Registro:** rústico, direto, de quem fala contando sacas.
- **Ritmo:** seco, sem rodeio; não para o serviço para responder.
- **Léxico:** de moinho e feira (sacas, jornal, carroceiro, pesagem); repete a soma do
  prejuízo sem errar um xelim.
- **Tique:** exige testemunha e papel para tudo ("os nomes, anote aí"); a honestidade
  agressiva o faz soar, no fundo, o mais limpo.
- **Amostra:** *"Fui roubado dentro da loja dele e ainda paguei o conserto adiantado.
  Se me perguntam se choro, não choro."*

## Davey Tull (o aprendiz — a resposta decorada)

- **Quem é:** aprendiz, 15, dois anos de oficina. O oficial lhe ensaiou o "saímos
  juntos às sete e meia"; mente por medo do gaffer, não por malícia.
- **Registro:** curto, obediente, de menino de ofício diante de gente grande.
- **Ritmo:** depressa e **sempre com as mesmas palavras, na mesma ordem** — a recitação
  é o defeito. Sobre qualquer outro assunto, fala solto e observador.
- **Léxico:** de aprendiz (o patrão, o Sr. Crane, a bancada, a marmita, a sopa da mãe).
- **Tique:** não ergue os olhos do serviço ao responder o ensaiado; ergue-os, curioso,
  para tudo o mais.
- **Amostra:** *"Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a
  estalagem, eu para casa. Minha mãe serviu a sopa às oito."*

## Sra. Potts (a senhoria de Caulfield)

- **Quem é:** dona da pensão miserável da abertura; curiosa, econômica, tagarela.
- **Registro:** popular, direto, de quem mede o hóspede pela conta atrasada.
- **Ritmo:** afirmações curtas e curiosidade mal contida; comenta o que não lhe pedem.
- **Léxico:** de pensão barata (xelins, vela, castiçal, o rapaz que veio a cavalo).
- **Tique:** demora-se um instante além do necessário, medindo a cena; a pergunta
  indiscreta disfarçada de comentário.
- **Amostra:** *"Veio a cavalo, de Briarstone. Urgente, disse o rapaz. Briarstone…
  então mataram alguém por lá."*

## Coroner Bramwell Foy (a autoridade que nunca entra em cena)

- **Quem é:** coroner de Sua Majestade para o condado, sob o Coroners Act 1887. É ele
  quem **ordena** o exame do corpo e quem o **paga** (£2 2s, Medical Witnesses Act
  1836), e é dele a data do inquérito. O guarda Wycliffe é o *coroner's officer*: o
  intermediário que notifica, nunca o contratante.
- **Regra dura (D12):** Foy **não tem cena, não fala e não aparece**. Existe em papel
  timbrado, e só. Quem o quiser em cena escreve uma OS para isso.
- **Registro:** o do impresso de repartição — texto de fôrma com claros preenchidos à
  mão. **Primeira pessoa de ofício**: o coroner declara em nome próprio, na fórmula do
  mandado ("Havendo eu…, e sendo meu ofício…, fica o Dr. Abbot requisitado a…"), com
  subordinadas longas de fórmula legal, nenhuma cortesia e nenhum adjetivo. Datas e
  quantias por extenso.
- **A lei que ele invoca é a de 1887, não a de 1836.** O Medical Witnesses Act 1836 foi
  revogado para Inglaterra e Gales pelo próprio **Coroners Act 1887**, que reeditou a
  matéria (ordem de exame e honorários, mantido o teto de £2 2s). Um médico podia
  continuar a chamar a tabela pelo nome antigo numa conversa; um **instrumento de
  fôrma**, não. Achado do `perito-forense` no gate da OS-R3.
- **Tique:** não ter nenhum. É a única voz do jogo sem idioleto, e **não o ter é o
  idioleto dela**: onde toda a vila hesita, se desdiz e tempera, o condado declara.
- **O que a voz carrega para o jogo:** o prazo (segunda-feira, 16 de outubro, às dez,
  no Wheatsheaf) e o nome que não é o do perito. Harlan atravessa o caso com uma
  autorização passada ao mestre — é o que dá peso à ordem "NAO ASSINE NADA" (D25).
- **Amostra:** *"Pelo exame e pelo depoimento serão pagas duas libras e dois xelins, na
  forma do mesmo Ato."* (A amostra dizia "do Ato de 1836" e contradizia o próprio verbete
  acima e o impresso embarcado; corrigida na OS-R4.)

## Amos Kell (o veraz sem crédito — o sineiro)

- **Quem é:** sineiro e zelador do relógio de S. Miguel, 63 anos. Deu corda ao relógio da
  torre na noite de sexta, depois das nove, e do portão do adro viu sair um homem pela boca
  do beco da relojoaria. Diz a verdade. Bebe, e a vila sabe — martelo do utilizador entre as
  três opções da OS-R4 §5(c).
- **A função mecânica É a voz (G6).** As cartas dele carregam **marca de insuficiência** nas
  tags, e o motor recusa-as como nexo e como álibi (`acusacao.js`, `ehInsuficiente`). Ele
  **aponta, nunca prova**. A prosa jamais o endossa nem o desmente: o crédito é juízo do
  jogador, e a lição do arquétipo é que uma testemunha pode estar certa e não servir.
- **Registro:** de ofício e de igreja. Conta o tempo por serviços e por toques ("depois das
  nove", "amanhã é domingo"), não por relógio de algibeira.
- **Ritmo:** frases curtas, com uma pausa antes do que já sabe que não vão acreditar.
  **Antecipa o descrédito em vez de o negar** — nunca se defende.
- **Léxico:** da torre (corda, manopla, cavalete, cabeçote, câmara dos sinos, repique, adro,
  a conserva do relógio). Numera os sinos do mais leve ao mais pesado, que é como se contam.
- **Tique:** responde sem largar o serviço, e diz ele próprio o que a vila diria dele.
- **Amostra:** *"O guarda perguntou-me primeiro quanto eu tinha bebido. Depois já não
  perguntou mais nada, e não escreveu."*

## As testemunhas de fundo (o moço do padeiro, a Sra. Wick, o guarda Tobin, o estalajadeiro)

- **Função:** produzir a alegação que o corpo desmente (a "luz do velho" às 05h15) ou
  o registro que sustenta (a vitrine fechada às 20h; o quarto às escuras às 21h; a
  senhora na viela). Aparecem citados no registro do guarda ou falam uma linha só.
- **Tobin, desde a OS-R4:** não é o segundo homem do posto de Briarstone — faz a **ronda de
  Caulfield** e desce a High Street às oito, no ponto em que as duas rondas se encontram.
  Passa e segue. É por isso que vê a vitrine correr-se e não fica.
- **A Sra. Wick, desde a OS-R4:** a declaração dela fica de pé como foi tomada, e o registro
  ganha o que veio depois — procurada outra vez antes do meio-dia, disse não ter visto nada
  e fechou a janela. O fio de coação da D16 **mostra-se; não se explica**.
- **Registro:** relato de terceiros, filtrado pela voz de quem conta (em geral
  Wycliffe). Convictos no que viram, prudentes no que não viram ("conhece o passo,
  diz, mas não jura").
- **Regra:** a alegação é dada como declarada, **nunca** endossada nem desmentida pelo
  narrador. A contradição é trabalho do jogador.

## O perito (o monólogo final — voz do jogador)

- **Quem é:** Harlan Blackwell, aprendiz de Dr. Abbot (a voz é "o perito"). Fala
  em primeira pessoa ao fim, recolhendo a cadeia que montou.
- **Registro:** sóbrio, introspectivo, de quem julga o próprio trabalho. Primeira pessoa.
- **Ritmo:** medido; **no máximo uma máxima por desfecho**, guardada para o fecho (guia
  §3–4). O corpo do monólogo é constatação específica do caso, não almanaque.
- **Léxico:** técnico quando nomeia o que fez (janela, nexo, mecanismo), humano quando
  mede o custo (a forca, o inocente, o erro).
- **Tique:** fala do gesto físico de encerrar (recolher instrumentos, guardar a
  caderneta) como quem fecha um luto.
- **Amostra (vitória):** *"Recolho as cartas em silêncio. A cadeia fechou-se elo a elo,
  e cada elo tem o peso do corpo por trás."*

---

## Aplicação

- O `escritor-prosa` consulta o verbete do personagem antes de escrever qualquer fala.
- O `editor-critico` aplica o teste do nome coberto e a proibição de voz uniforme.
- Quando uma cena tem só narrador (exame do corpo, cena do crime), vale o verbete do
  narrador: observação pura, sem a voz de ninguém interpretando.
