# Roteiro — "A Hora Emprestada"

Consolidação de toda a prosa do caso-escola de MORTEM, na ordem em que o
jogador a encontra, mais os textos de framework que servem a qualquer caso
(monólogo, epílogo, glossário, ecos). Documento de referência/leitura — não
rege motor nem substitui os arquivos-fonte, listados ao fim de cada seção.

**Convenções preservadas do original** (ver `CLAUDE.md`):
- `[[id_da_carta]]` marca o ponto da prosa onde uma carta de evidência é
  extraída ao clique; o texto em negrito na interface é o trecho entre
  colchetes.
- `{detective.campo}` interpola dados do detetive escolhido (nome, tratamento).
- `{g:forma masculina|forma feminina}` flexiona pelo gênero do detetive.
- `{suspeito:id.campo}` interpola dado de um suspeito (ex.: nome).

Este é o caso **"A Hora Emprestada"** — Briarstone, 14 de outubro de 1893: o
relojoeiro Geoffrey Arthurs, morto na noite anterior, e a loja revirada para
parecer roubo.

---

## 1. Os Quatro Chamados (tela de título)

*(fonte: `src/data/casos.js`)*

- **A Hora Emprestada** — "O caso-escola, escrito à mão. Briarstone, 1893: o
  relojoeiro morto e o relógio que mente."
- **A Hora Refeita** — "O mesmo crime, refeito pela máquina: a vila gerada
  tenta recriar o caso-escola com as suas próprias peças."
- **Um Caso da Comarca** — "Um crime que nenhuma mão escreveu: vila, elenco e
  vestígios nascem da simulação. Cada convite, um caso."
- **A Marca do Agressor** — "Um caso da comarca onde a luta corporal é certa:
  o corpo da vítima sempre anuncia a marca-espelho."

---

## 2. Abertura — de Caulfield a Briarstone

*(fonte: `src/data/abertura.js`)*

### Passo 1 — Caulfield, 14 de outubro de 1893

A pensão da Sra. Potts cobra dois xelins por semana e entrega dois xelins: um
quarto estreito, meia vela, uma garrafa vazia e o jornal de anteontem dobrado
sobre a mesa.

Sobre essa mesa, {detective.surname} dispõe os instrumentos do Dr. Alcott: a
lente e o termômetro de mercúrio com a trinca no vidro. A caderneta de capa
rachada, essa é {g:dele|dela}; vem por último, aberta na última página usada:
"Sra. Ellen Parry, 71 anos. Queda na escada. Fratura cervical. Morte natural."
Fechada.

> *Pensamento:* Já imagino o velho dizendo: "Não era isso que queria, jovem?"
> E tenho de admitir, a raposa tem razão. Se soubesse jogar cartas como sabe
> fugir de usurários e de trabalho, não precisaria mandar aprendizes examinar
> mortos de aldeia.

*(botão: "A vela queima")*

### Passo 2 — Batem à porta

A Sra. Potts não espera resposta: entra com o castiçal numa mão e, na outra,
um formulário pardo dobrado sobre uma carta lacrada. Pousa os dois sobre a
mesa.

"Veio da estação agora mesmo. O rapaz disse que era do Dr. Alcott para
{g:o senhor|a senhora}, urgente." Fica onde está, o olhar no formulário, no
rosto {g:do hóspede|da hóspede}. Vira a carta entre os dedos, lendo o
remetente. "Briarstone. Então mataram alguém por lá."

*(botão: "Ler o telegrama")*

### Passo 3 — O telegrama do Dr. Alcott

*(apresentado no impresso do Post Office, Form A1)*

O formulário pardo traz a letra do telegrafista da estação, copiada do fio:
maiúsculas apertadas, o selo do Post Office no canto.

> "SR BLACKWELL PENSAO POTTS CAULFIELD. CHAMADO DE BRIARSTONE. RELOJOEIRO
> MORTO LOJA REVIRADA. PROVAVELMENTE BRIGA DE TABERNA OU GATUNO. VA OLHE O
> CORPO MANDE RESUMO PELO PRIMEIRO CORREIO. NAO ASSINE NADA. ALCOTT"

> *Pensamento:* Provavelmente. A palavra preferida do Dr. Alcott para tudo que
> lhe dá trabalho. Provavelmente não é nada, provavelmente é morte natural,
> provavelmente o rapaz resolve. A vila fica a uma estação daqui; ele, a
> quatro condados de distância, onde nenhum usurário o procure. Não era isto
> que eu queria, mas era o que estava no preço.

*(botão: "Ler a carta do delegado")*

### Passo 4 — A carta do Delegado

A carta lacrada traz o brasão gasto de uma repartição, prensado torto no
lacre de cera vermelha. A cera racha sob o polegar. O papel é grosso, de bom
fornecedor; a letra inclina-se para a direita, firme no começo de cada linha
e mais corrida ao fim dela.

> "Dr. Alcott — Escrevo-lhe na qualidade de delegado de Briarstone e na
> condição, que não me envergonho de confessar, de homem posto fora da sua
> profundidade. O Sr. Geoffrey Arthurs, relojoeiro desta vila e homem que
> nunca deu trabalho a esta delegacia, foi achado morto esta manhã no
> escritório dos fundos da sua loja, com a garganta aberta e a casa toda
> revirada."
>
> "Não toquei em nada; mandei que nem uma cadeira saísse do lugar, e pus um
> guarda à porta até que o senhor chegue. Venha, peço-lhe, pelo primeiro trem
> que o traga a nós. Briarstone paga os seus honorários e, se o caso assim
> pedir, o seu silêncio; disso trataremos melhor com um copo na mão. Perdoe a
> letra: escrevo de pé, e a mão ainda não me voltou ao sossego. — Lemuel
> Wycliffe, Delegado."

> *Pensamento:* A garganta aberta. Não é queda na escada, não é bêbado de
> taberna. O delegado escreveu ao Dr. Alcott, e o Dr. Alcott mandou a mim.

*(botão: "Aceitar o chamado")*

### Passo 5 — A mesa se transforma

A garrafa vai para o chão, o jornal para o fogo. A mesa estreita da pensão
fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um
lado, o termômetro do outro, a caderneta aberta na primeira página em branco.

{detective.surname} veste o casaco ainda úmido da véspera e desce para a
estação.

> *Pensamento:* O Dr. Alcott mandou não assinar nada. A garganta aberta, a
> loja revirada, o guarda à porta: e o Dr. Alcott mandou não assinar nada. O
> trem não espera, e o velho não virá.

*(botão: "Tomar o trem")*

### Passo 6 — Briarstone

A plataforma cheira a carvão e a palha molhada de chuva. Além dos trilhos,
Briarstone estende-se numa única rua, e a luz de outubro bate rasa nos
telhados e deixa a calçada meio na sombra, meio no sol.

Os sinos da igreja dão a hora num extremo da rua; um cão responde do outro. A
meia rua, uma vitrine tem a cortina corrida por dentro, e à porta dela um
guarda moço mantém-se de mãos cruzadas às costas, o rosto sem cor.

O Delegado Wycliffe espera junto ao portão. Os olhos vão do rosto de
{detective.surname} ao trem que se afasta, à plataforma que se esvazia.
Ninguém mais desceu.

"O Dr. Alcott não pôde vir, então." "{g:O senhor|A senhora} é…"

"{detective.surname}. Assistente do Dr. Alcott."

Wycliffe mede {g:o rapaz|a moça} dos sapatos ao colarinho. Mas o corpo não
espera. Aperta a mão com uma só, breve. "Pois bem, {detective.treatment}
{detective.surname}. O Sr. Arthurs está como o encontramos ontem… esta manhã,
quero dizer. Venha; explico-me pelo caminho, que a andar me saio melhor."

*(botão: "Ouvir o delegado")*

### Passo 7 — O relato do Delegado Wycliffe (briefing)

"O essencial é isto: Sr. Geoffrey Arthurs, sessenta e um anos, relojoeiro.
Achado morto no escritório dos fundos, sábado às nove e vinte da manhã, por
Silas Crane — o oficial dele, homem de doze anos de casa. A porta do beco
forçada, o troco do caixa levado, a loja fechada desde a noite de sexta, dia
13."

Detém-se diante da relojoaria e baixa a voz. "Pergunte o que quiser antes de
entrarmos. O Dr. Alcott haveria de querer ver a cena primeiro; suponho que
{g:o senhor|a senhora} saiba o que procurar."

*(botão: "Entrar — iniciar a investigação")*

### As quatro perguntas do briefing (custo zero)

**"O que se sabe sobre a hora da morte?"**
> "Aí é que a sorte nos ajuda: na confusão, o relógio da lareira veio ao chão
> e parou num quarto para as nove. E o moço do padeiro viu luz na oficina às
> cinco e pouco da madrugada. Vivo às cinco, morto antes das nove e vinte — o
> ladrão mal teria virado a esquina. É o que eu penso, veja bem. O que
> {g:o senhor|a senhora} pensar, com o corpo à frente… bom, o que o Dr. Alcott
> pensaria."

**"Quem herda com essa morte?"**
> "O sobrinho, Walter Arthurs, negociante em Moorford — parente único,
> herdeiro único. O testamento está nos meus arquivos, e junto dele umas
> cartas de cobrança que {g:o senhor|a senhora} talvez queira ler. Digo só
> isso; não me cabe temperar a sopa antes do cozinheiro. Ou do ajudante do
> cozinheiro, no caso."

**"O morto tinha desafetos declarados?"**
> "De véspera, por sinal: Caleb Grey, o moleiro, esteve na loja sexta à
> tarde devolvendo um conserto, aos brados, e ainda passou na delegacia para
> lavrar queixa. E um carroceiro veio me contar de outros gritos na loja, ao
> cair da mesma tarde. Sexta movimentada, para um homem que morreu nela…
> isto é, que pode ter morrido no sábado, como diz o relógio.
> {g:O senhor|A senhora} me entende."

**"Quem vivia ou trabalhava com a vítima?"**
> "Viúvo, sem filhos; morava sobre a própria loja. Na oficina, dois: Silas
> Crane, o oficial que o achou, e o aprendiz, o rapazinho Tull. Fora isso, a
> vila — e a Sra. Rooke, da loja e correio em frente, que era das poucas
> visitas que o velho recebia."

### O perito

**Harlan Blackwell** — Assistente do Dr. Alcott há dois anos; sem registro,
sem laudo próprio. O que tem é o olho treinado do mestre e um termômetro
emprestado com uma trinca que "não afeta a leitura".

---

## 3. O Elenco

*(fonte: `src/data/seed.js`)*

- **Sr. Geoffrey Arthurs** (vítima) — relojoeiro, 61 anos.
- **Silas Crane**, 47 anos. Primeiro-oficial da relojoaria há doze anos;
  achou o corpo. Mãos quietas, avental de couro, fala mansa de bancada.
  Oferece teoria sobre o ladrão a quem não pediu nenhuma.
- **Walter Arthurs**, 44 anos. Sobrinho e único herdeiro; negociante de
  Moorford. Colarinho de negociante e botas gastas. Explica-se antes de
  acusado e cita credores pelo nome, como quem confere uma lista.
- **Sra. Agnes Rooke**, 58 anos. Viúva, dona da loja e correio da High
  Street. Meio-luto rigoroso, broche de azeviche. Responde o que se pergunta,
  nem uma palavra além, e mede o visitante por cima dos óculos.
- **Caleb Grey**, 46 anos. Moleiro; na sexta-feira, devolveu à loja um
  conserto com queixa formal. Pó de farinha nas costuras e a queixa na ponta
  da língua. Repete a soma do prejuízo sem errar um xelim.
- **Davey Tull**, 15 anos. Aprendiz da relojoaria há dois anos. Magro,
  atento, o olho no que as mãos dos outros fazem. Responde depressa;
  perguntado de novo, não muda uma palavra.
- **Delegado Lemuel Wycliffe** — recebe o perito e conduz o briefing.

---

## 4. As Localidades

*(fonte: `src/data/localidades.js`)*

### O Corpo — Escritório dos Fundos
*Sr. Geoffrey Arthurs, relojoeiro, 61 anos*

O morto jaz de costas entre a escrivaninha e a estante, o colete abotoado, a
gola dura manchada de escuro. O Delegado Wycliffe mandou que nada se tocasse
até a chegada {g:do perito|da perita}, e nada se tocou.

Ao primeiro exame do tronco e dos membros, [[ev_rigor]]. O guarda espera a
ordem para voltar o corpo.

Sob o ângulo esquerdo do maxilar abre-se uma [[ev_ferida]]. Afastado o
colarinho, mostram-se [[ev_reacao_vital]]; à lente, no fundo do canal,
[[ev_residuo_ferida]].

Na corrente do colete pende um relógio de bolso de tampa fechada, mudo. A
maleta de instrumentos está aberta sobre a cadeira; o termômetro de mercúrio
fica à mão, se {detective.treatment} {detective.surname} julgar oportuno
medir a temperatura do corpo.

*Gestos periciais:* voltar o corpo (extrai `ev_livores`) · dar corda ao
relógio do morto (extrai `ev_relogio_bolso`).

### A Cena — Escritório dos Fundos da Relojoaria
*Briarstone, High Street, nº 7*

O escritório dos fundos guarda o revirado da manhã em que o acharam: papéis
pelo assoalho, a poltrona de couro empurrada para longe da escrivaninha. A
luz de outubro entra de esguelha pela janela alta e assenta na poeira em
suspensão; cheira a óleo fino de relojoeiro e à cinza fria da lareira. Num
cabide atrás da porta estão pendurados um sobretudo escuro e um chapéu-coco.
Sobre a repisa, um retângulo sem poeira marca o lugar onde alguma coisa
esteve.

**A lareira** — No tapete, a meio caminho da lareira, o
[[ev_relogio_lareira]] jaz de borco. Da porta, sem pôr o pé para dentro,
Wycliffe aponta-o com o queixo: "A peça, {detective.treatment}. É dela que a
vila inteira fala." A caixa cedeu de um lado e escancarou o mecanismo até a
roda de contagem. Na repisa, um cachimbo de barro pousado de lado e a cinza
por raspar na grelha. *(gesto: contar os entalhes da roda → `ev_maquinismo`)*

**A escrivaninha** — A escrivaninha está de través, uma gaveta meio puxada,
o tinteiro seco e a pena atravessada no mata-borrão. Um par de óculos de
aros finos repousa dobrado sobre o livro-razão aberto, ao lado de uma lupa
de relojoeiro presa a um cordão. Ao pé dela, no cesto de vime, entre aparas e
um sobrescrito rasgado, uma [[ev_suplica_cesto]].

**A vitrine e a porta do beco** — A loja da frente fica para além do vão do
escritório. Ali, contra a parede, [[ev_vitrine]]. Junto à porta acanhada que
dá para o beco, na moldura do trinco, [[ev_fechadura]].

**A copa** — Nos fundos, uma copa apertada: a chaleira fria no fogareiro, a
pia com um resto de água parada, um pano de prato no gancho. Na bandeja
estão duas xícaras: uma com o fundo de chá seco, a outra emborcada e limpa; a
lata de chá aberta, a colher ainda dentro. Sobre a bancada de pedra, encostada
à parede, uma [[ev_cesta_rooke]].

### A Oficina de Consertos
*Os fundos da loja; Davey Tull, aprendiz, 15 anos*

A oficina ocupa os fundos da loja: duas bancadas de tampo raspado, um torno
pequeno aparafusado à ponta de uma delas, a parede coberta de ferramentas
penduradas em ordem de tamanho. A limalha de latão presa ao tampo e o gume
das limas penduradas guardam o brilho raso da janela alta. Junto à porta dos
fundos, um cesto de vime guarda encomendas embrulhadas em papel pardo, cada
uma com etiqueta de nome e vila de fora, para o carreteiro da semana. Um
pêndulo comprido e rodas de mecanismo maior que os de sala esperam numa
tábua à parte, ao lado de um bilhete da conserva anual do relógio da torre
da paróquia. No gancho da bancada grande, o lampião de bancada está apagado.
O depósito, seco; a chaminé de vidro, fumada até a boca. Na bancada menor,
aberto para conserto, um relógio de lareira irmão do da cena mostra o trem
das badaladas a descoberto; a cada hora que a máquina bate, a alavanca salta
um entalhe da roda de contagem. Cheira a óleo e ao carvão frio do fogareiro.

**A prateleira de gravar** — A prateleira das ferramentas de gravar corre
sobre a bancada menor: buris de vários feitios, dois punções de letra, um
vidro tampado de pó de polir. Ao canto, um frasco de óleo fino pela metade, a
rolha ao lado e um pano de linho manchado de dedadas. No meio deles, de
tampa fechada, o [[ev_estojo_buril]].

**O púlpito de ordens** — A um canto, um púlpito de escrever forrado de
cortiça gasta, com um tinteiro de bancada e um prego de espetar recibos. No
prego, uma pilha de recibos furados, o de cima datado de sexta na mesma
letra miúda. Aberto sobre a inclinação, o [[ev_livro_ordens]].

**A gaveta funda** — Sob a bancada grande corre uma fileira de gavetas; a
mais funda range ao abrir e cheira a metal e a graxa velha. Dentro, sob um
retalho de camurça, junto a molas soltas e a um envelope de peças, um
[[ev_anel_encomenda]].

*(Davey Tull conversa em diálogo próprio — ver seção 6.)*

### Interrogatório — Silas Crane
*Primeiro-oficial da relojoaria, 47 anos*

Este nó é interrogatório em diálogo — ver seção 6.

### Arquivos da Delegacia de Briarstone
*Delegado Lemuel Wycliffe*

A delegacia é uma sala única, com cheiro de tinta e turfa. Wycliffe abre os
armários sem cerimônia: "O que é meu é {g:do senhor|da senhora},
{detective.treatment} {detective.surname}. Papel, aqui, nunca faltou;
imaginação é que não temos."

Entre os papéis do morto, recolhidos por precaução, está o [[dep_testamento]]
e, presas a ele por um alfinete, [[dep_dividas_walter]].

No livro de ocorrências, com a tinta de ontem, uma [[dep_queixa_grey]]; na
página de sábado, os [[dep_briga_walter]] que um carroceiro veio contar por
conta própria.

Do registro da ronda consta a [[dep_visto_vivo]], na letra redonda do guarda
Tobin.

Wycliffe guarda para o fim os relatos da manhã: a [[dep_avistamento_padeiro]]
— "se havia luz àquela hora, havia homem aceso dentro dela, digo eu" — e o de
uma vizinha, [[dep_mulher_viela]]. "A senhora da viela não me tira o sono. A
luz das cinco, essa me arruma o caso: ladrão de madrugada, relógio parado nas
quase nove, caixa vazada. O palpite é meu; a perícia, essa, é
{g:do senhor|da senhora}."

### A Estalagem — The Wheatsheaf
*Walter Arthurs, hóspede do quarto nº 3*

The Wheatsheaf tem pátio de carroças e um livro de hóspedes gordo de anos.
Walter Arthurs está hospedado no quarto nº 3; desce à sala a um recado.

O estalajadeiro empresta o [[ev_registro_estalagem]] sem fazer perguntas, e
responde às que lhe fazem: [[corrob_estalajadeiro]].

*(Walter conversa em diálogo próprio — ver seção 6.)*

### A Loja e Correio da High Street
*Sra. Agnes Rooke, viúva, 58 anos*

Este nó é interrogatório em diálogo — ver seção 6.

### O Moinho de Briarstone
*Caleb Grey, moleiro, 46 anos*

Este nó é interrogatório em diálogo — ver seção 6.

### Gabinete do Procurador Pettigrew
*Moorford — hora e meia de estrada*

Hora e meia de estrada, e o gabinete cheira a couro e lacre. O procurador
Pettigrew já soube da morte; pousa os óculos e espera as perguntas de mãos
cruzadas.

Sobre o relojoeiro, entrega o que tem: [[corrob_pettigrew]]. "Guardo papéis,
{detective.treatment}; opiniões, procuro não guardar."

---

## 5. As Cartas — Catálogo de Evidências

*(fonte: `src/data/cartas.js` — `descricao` é o que o jogador lê; `vozMestre`,
quando existe, é a fala do Dr. Alcott na cabeça de Harlan sobre aquele
achado)*

### O Corpo

**Corpo Endurecido / Rigidez Cedendo / Corpo Flácido** (`ev_rigor`, degrada
por IPM)
- *Até 24h:* Maxilar, pescoço e membros não cedem quando se tenta dobrá-los:
  o corpo enrijeceu por inteiro. Nos dedos e na mandíbula, porém, a
  resistência cede um ponto sob pressão firme.
  > Voz do mestre: "Rígido por inteiro, mas repare nas mãos e na mandíbula:
  > já cedem um ponto. Dezesseis horas, talvez dezoito; não menos de doze.
  > Perto disto, o termômetro mente por omissão: cruze com o rigor antes de
  > cravar a faixa."
- *Até 36h:* O maxilar já dobra; os joelhos ainda resistem. A dureza some na
  mesma ordem em que chegou.
  > Voz do mestre: "A rigidez já cede. Passou da véspera — e a hora exata
  > começa a escapar entre os dedos."
- *Além de 36h:* Os membros dobram sem nenhuma resistência: a dureza passou
  por completo. O rigor, neste ponto, já não aponta a hora.
  > Voz do mestre: "Frouxo de todo. O rigor já não me serve: só posso jurar
  > que faz mais de um dia."

**Manchas Arroxeadas nas Costas** (`ev_livores`)
Sob o polegar, as manchas não empalidecem; voltado o corpo, não migram. Onde
ele pressiona o assoalho, a pele ficou pálida.
> Voz do mestre: "As manchas fixaram-se e não cedem ao polegar: morto há
> meia jornada, ao menos. E fixaram-se do lado em que ele está deitado."

**Ferida Estreita no Pescoço** (`ev_ferida`)
À esquerda do pescoço, abaixo do ângulo do maxilar, uma abertura de meia
polegada escassa, de bordas nítidas, sem ponte de tecido. A sonda desce mais
fundo do que a boca é comprida; as duas extremidades da fenda fecham em
ângulo.
> Voz do mestre: "Bordas limpas, sem ponte de tecido: lâmina, não pancada. E
> mais funda que comprida — entrou de ponta e achou os vasos. Boca em
> losango é de haste de quatro faces; faca comum deixa uma ponta aguda e
> outra romba."

**Bordas Vivas na Ferida** (`ev_reacao_vital`)
As bordas da fenda estão retraídas, afastadas uma da outra. O tecido em
volta está empapado de sangue coagulado, que a esponja não desfaz.
> Voz do mestre: "O tecido reagiu: retraiu e deixou o sangue infiltrar os
> planos. Ferida de homem vivo. Sobre um morto, a mesma lâmina abriria uma
> boca frouxa e pálida."

**Pó Vermelho na Ferida** (`ev_residuo_ferida`)
Na borda inferior do canal, a lente acha um traço de pó vermelho-tijolo,
fino como poeira de lápis, preso ao coágulo.
> Voz do mestre: "Vermelho-de-polir. Pó de bancada de relojoeiro e de
> ourives: dá lustro ao ouro e ao aço. Estava dentro do canal, sob o
> coágulo."

**Relógio de Bolso Parado** (`ev_relogio_bolso`)
Na corrente do colete, o relógio do morto: aberta a tampa, vidro inteiro,
máquina sã, os ponteiros nas cinco e cinco — anotados antes de se tocar na
coroa. A coroa resiste e vai-se enchendo; a poucas voltas, o tique retoma.
> Voz do mestre: "Mola vazia, não partida: parou por falta de corda. Estes
> guardam trinta horas de marcha — a hora do mostrador fica a trinta horas
> da última vez que uma mão lhe deu corda."

### A Cena do Crime

**Relógio de Lareira Esmagado** (`ev_relogio_lareira`)
De perto, o vidro cedeu para dentro e a caixa abriu de um lado só; o
rebordo do vidro leva um filete dourado, meio comido do uso. Os ponteiros
descansam num quarto para as nove, sobre algarismos pintados a ouro.

**Roda de Contagem das Badaladas** (`ev_maquinismo`)
Pela caixa partida vê-se o trem das badaladas. A alavanca repousa no nono
entalhe da roda de contagem; dali a roda não passou. O martelo está caído
sobre a campainha, em descanso.

**Balcão Revirado, Vitrine Fechada** (`ev_vitrine`)
As gavetas do balcão estão puxadas e a caixa do troco, vazia. Na vitrine ao
lado, sob tampas fechadas, dez relógios de ouro em fila, as etiquetas de
preço voltadas para cima.

**Fechadura dos Fundos Forçada** (`ev_fechadura`)
Os riscos na madeira são rasos e curtos, e param onde a lingueta cede. As
lascas de tinta caíram para fora, sobre o degrau do beco.

**Cesta de Ceia para Dois** (`ev_cesta_rooke`)
Sob o guardanapo de cambraia, bordado a um canto com as iniciais A.R., dois
cálices lavados e um bilhete a lápis: "Sexta, às oito, como sempre. — A."

**Carta Amassada em Bola** (`ev_suplica_cesto`)
Uma folha amassada em bola, sem envelope nem selo. A letra pede "um
adiantamento sobre o que há de ser meu", promete juros de praça e fecha com
"seu sobrinho, que espera à porta". Datada de sexta-feira, 13.

### A Oficina

**Livro de Ordens de Serviço** (`ev_livro_ordens`)
O livro da bancada, aberto na semana. Três consertos reentrados com queixa
no mesmo outono, todos rubricados "S.C." na coluna do executor. A letra do
morto atravessa anos de páginas, miúda e firme, cada preço somado à margem e
sublinhado. Na última entrada, a mesma letra, mais apertada: "pesar as
caixas. Pettigrew, segunda."

**Buril Claro no Estojo** (`ev_estojo_buril`)
O estojo traz o nome de Silas Crane a fogo na tampa. Os cabos vestem a mesma
cera parda de uso; um único buril está claro, sem a cera dos outros, e a
junta entre o aço e o cabo guarda uma linha escura de umidade.

**Aro de Ouro por Gravar** (`ev_anel_encomenda`)
Sob o pano, um aro de ouro liso, estreito e ainda sem uso. A ordem de
serviço vem presa a ele, no punho do morto e na mesma letra miúda: "gravar
por dentro — G.A. & A.R. — pronto até 30 de outubro. Particular."

**O Hábito da Corda** (`dep_habito_corda`)
Davey, os olhos erguidos do serviço: "O patrão dava corda no relógio do
bolso às onze, antes de subir pra deitar. Todas as noites, sem faltar uma.
Deixava eu ouvir o tique depois, dizia que o de bolso guarda trinta horas e
que homem que deixa a corda acabar não merece o ofício."

**A Mesma Resposta Duas Vezes** (`alibi_davey`)
"Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem,
eu para casa. Minha mãe serviu a sopa às oito." Perguntado de novo ao fim da
visita, repete as mesmas palavras, na mesma ordem.

### Interrogatório: Silas Crane

**Recolhido à Estalagem às Oito** (`alibi_silas`)
"Fechei a oficina às sete e meia e saí com o rapaz. Ceei pouco, recolhi-me
ao quarto às oito e não tornei a sair. De manhã abri a loja, como sempre."
Dá as horas de um fôlego, sem pausa entre elas.

**Teorias sobre o Ladrão** (`comp_silas`)
Oferece a cadeira melhor, chega o lampião, e oferece também uma teoria:
gente de fora, da estrada, atrás do troco do caixa. Volta a ela três vezes
durante a conversa, com variações, sem que ninguém pergunte.

**Vidro na Dobra da Calça** (`ev_vidro_dobra`)
Na bainha da calça de Silas, uma lasca de vidro do tamanho de meia unha. À
lente, o caco é abaulado, fino como papel, e traz na borda um fio de tinta
dourada.

### A Delegacia

**Testamento do Relojoeiro** (`dep_testamento`)
Cópia lavrada há dois anos no gabinete do procurador Pettigrew, de Moorford:
a loja, a casa e as economias do Sr. Arthurs passam por inteiro ao sobrinho,
Walter Arthurs, "na falta de outros herdeiros".

**Cartas de Cobrança** (`dep_dividas_walter`)
Três cobranças com timbre de casas de Moorford, endereçadas a Walter
Arthurs: fazendas por pagar, um armazém em juízo, e a soma crescendo de
carta em carta.
> Voz do mestre: "Dívida vencida diz o aperto. De onde sairia o pagamento,
> isso a cobrança não diz."

**Gritos Ouvidos da Rua** (`dep_briga_walter`)
Ocorrência tomada no sábado: um carroceiro que passava ouviu, pela porta da
loja, vozes de homem em altura de briga — "prefere ver-me na miséria", e o
resto perdido. Dá a hora por volta das sete da tarde de sexta.

**Queixa do Relógio Mais Leve** (`dep_queixa_grey`)
Termo lavrado na sexta: Caleb Grey, moleiro, declara que o relógio caçador
do pai, saído de conserto na loja de Arthurs, "voltou mais leve do que
entrou", e exige pesagem diante de testemunhas. Anexa a soma do prejuízo:
quatro libras e dez xelins.

**Vitrine Fechada às Oito** (`dep_visto_vivo`)
Do registro da ronda: às oito em ponto da noite de sexta, o guarda Tobin viu
o relojoeiro, de dentro da loja, correr as tampas da vitrine e acenar-lhe
pelo vidro, como todas as noites.

**Luz Vista de Madrugada** (`dep_avistamento_padeiro`)
O moço do padeiro, ao registro: passou pela High Street às cinco e um
quarto da madrugada de sábado e viu claridade na oficina do relojoeiro. "A
luz do velho", disse. Jura que o Sr. Arthurs amanheceu vivo e trabalhando.

**Uma Senhora na Viela** (`dep_mulher_viela`)
A Sra. Wick, dos fundos do nº 9, declarou ter visto uma senhora de escuro
deixar a viela da relojoaria "pouco antes das nove" da noite de sexta. Não
lhe viu o rosto; conhece o passo, diz, mas não jura.

### A Estalagem

**O Carro das Seis** (`alibi_walter`)
"Tomei o carro das seis para Moorford e dormi no Station. Soube da desgraça
esta manhã e vim no primeiro trem; tomei este quarto porque a casa do meu
tio está lacrada." Alisa o colarinho ao dar as horas.

**Registro da Estalagem** (`ev_registro_estalagem`)
Na página de sexta-feira, 13: "W. Arthurs, nº 3", na linha das sete e
quarenta da noite. Na coluna dos serviços, a letra do caseiro: água quente
ao nº 3 às nove; vela nova à meia-noite.

**O Quarto Cinco às Escuras** (`corrob_estalajadeiro`)
O estalajadeiro conta pelos dedos: o Sr. Crane não desceu para a ceia; às
nove, subindo água quente ao três, viu o cinco às escuras, a cama por
desfazer; e o portão do pátio, só o ouviu bater "passado das dez".

### A Papelaria

**Em Casa desde as Seis** (`alibi_agnes`)
"Fechei a loja às seis e recolhi-me. Uma viúva não tem serões." Diz e volta
a alinhar os cadernos da prateleira, o lombo de cada um à mesma altura.

**Meio-Luto e Azeviche** (`comp_agnes`)
Veste cinza-escuro com broche de azeviche, o meio-luto de quem já cumpriu o
inteiro. Ao nome do morto, a mão esquerda procura a beira do balcão; a voz
não muda.

### O Moinho

**Véspera de Feira no Moinho** (`alibi_grey`)
"Sexta é véspera de feira. Das sete às onze carreguei o moinho com dois
jornaleiros e o carroceiro do Finch; os nomes, anote aí." Os três, ouvidos
em separado, dão as mesmas horas.

**Rancor Sem Rodeios** (`comp_grey`)
"Fui roubado dentro da loja dele e ainda paguei o conserto adiantado. Se me
perguntam se choro, não choro." Bate a farinha do avental e volta às sacas.

### Gabinete Pettigrew

**Consulta ao Procurador** (`corrob_pettigrew`)
O procurador estende a carta, datada de quinta: "Preciso do seu conselho
sobre como se lavra queixa contra pessoa a meu serviço, com a discrição que
o caso pede. Vou-lhe segunda-feira." E acrescenta, de memória: na mesma
carta, o relojoeiro pedia hora para tratar de mudanças no testamento, por
razão de matrimônio.

---

## 6. A Contradição de Horas (o ponto a decidir)

*(fonte: `src/data/cartas.js` — `CONTRADICAO_HORAS`)*

Alegação em confronto: `dep_avistamento_padeiro` × as cartas do corpo
(`ev_rigor`, `ev_livores`).

**Aviso no diário**, ao completar-se o par na mesa: "Duas horas se
contradizem: o corpo e o moço do padeiro. Há um ponto a decidir na
caderneta."

**Apresentação na Caderneta:** "O moço do padeiro jura o Sr. Arthurs vivo e
à bancada às cinco e um quarto da madrugada de sábado. O corpo já esfriara:
o rigor e o livor põem a morte na véspera, antes da meia-noite. Só uma das
duas horas pode reger a minha conta, e de qual parto muda o caminho daqui em
diante."

Botões: **"Parto do relato do moço"** / **"Parto do que o corpo diz"**.

- Firmado no corpo (caderneta): "Firmei-me no corpo: parto do rigor e do
  livor; ao relato que os contrarie compete o ônus da prova."
- Firmado no relato (caderneta): "Firmei-me no relato do moço: parto da luz e
  da vida que ele jura ter visto na oficina; ao corpo compete então o ônus da
  prova."
- Firmado no corpo (diário): "Firmei-me: parto do que o corpo diz; o relato
  que o desminta que se explique."
- Firmado no relato (diário): "Firmei-me: parto do relato do moço do
  padeiro; que o corpo se explique depois."

---

## 7. Os Diálogos — Interrogatórios

*(fonte: `src/data/dialogos.js`. Cada interrogatório oferece, a cada rodada,
quatro tons — **firme**, **cordial**, **técnico**, **oblíquo** — que mudam a
prosa da resposta mas não a carta revelada. "Confrontar prova" é canal
lateral: mostra a reação do interrogado a uma carta específica e retoma a
conversa de onde parou.)*

### Silas Crane (na Saleta)

**Tom ressonante: oblíquo.**

Abertura: Silas Crane recebe na saleta, o avental de couro dobrado sobre o
braço. Traz chá sem que se peça e senta-se na beira da cadeira, as mãos
quietas sobre os joelhos. "Com licença de dizer, {detective.treatment},
{g:o senhor|a senhora} há de perdoar a casa: doze anos de bancada ao lado do
Sr. Arthurs e nunca a vi assim parada. Acendia eu o fogo mal abria a loja, e
ele descia ao cheiro do carvão; hoje a bancada amanheceu sem lume."

**Beat 1 — o álibi** (todo tom sustenta `alibi_silas`; a lasca de vidro
`ev_vidro_dobra` nasce em qualquer um dos quatro):

- *Firme:* "Sem rodeios, então." E dá as horas em fila, na ordem em que as
  viveu, sem procurar nenhuma: [[alibi_silas]]. As horas ditas, ergue-se para
  tornar a encher a xícara e logo volta à beira da cadeira; no instante de
  pé, a luz do lampião acha na bainha esquerda uma lasca miúda:
  [[ev_vidro_dobra]].
- *Cordial:* "O {detective.treatment} é gentil, e eu respondo de bom grado;
  nesta casa a gente vive pelas horas." E as recita como quem devolve um
  favor, cada uma no seu lugar: [[alibi_silas]]. Ajeita então a calça sobre o
  joelho, ao costume de quem se senta o dia inteiro; a bainha esquerda sobe
  da botina, e nela reluz uma lasca: [[ev_vidro_dobra]].
- *Técnico:* "Hora a hora eu digo, que é como se leva uma bancada." E leva:
  fecha a oficina, a ceia, o quarto, as horas em fila na ordem exata em que
  as viveu: [[alibi_silas]]. A pedido, chega a cadeira para junto do
  lampião, para que as horas passem ao papel, e a ergue em vez de arrastá-la;
  à claridade de perto, antes que ele torne ao seu lugar, aparece na bainha
  esquerda uma lasca fina: [[ev_vidro_dobra]].
- *Oblíquo (ressonante):* "Até tarde, não; casa de relógio fecha cedo."
  Responde sem se apressar, e as horas saem já postas, uma atrás da outra:
  [[alibi_silas]]. Ao cruzar as pernas para trás, deixa ver, presa à bainha
  esquerda, uma lasca que a luz do lampião acende: [[ev_vidro_dobra]].

**Beat 2 — a teoria do ladrão de fora** (todo tom sustenta `comp_silas`):

- *Firme:* As mãos não deixam os joelhos. "Não sei nome, {detective.treatment},
  e não hei de inventar um para agradar. O que penso, penso há muito." E
  volta a ela como quem retoma a mesma peça na bancada: [[comp_silas]].
- *Cordial:* "Doze anos nesta casa: abro eu a loja, tiro as tábuas da
  vitrine, acendo o fogo da bancada, e o Sr. Arthurs descia depois, com os
  óculos na mão. Foi no escritório dos fundos que o achei, às nove e vinte,
  caído entre a escrivaninha e a estante." Baixa a voz. "Gente da estrada, é
  o que eu penso; eu bem lhe dizia que recolhesse o caixa ao cofre." E torna
  a ela: [[comp_silas]].
- *Técnico:* "Um nome eu não firmo sem prova, {detective.treatment}; a
  perícia é sua. A razão, essa eu dou, que é de senso: uma vila destas não
  tranca bem as portas, e caixa aberto à noite chama gente da estrada." E a
  expõe inteira: [[comp_silas]].
- *Oblíquo:* "O caixa? Ficava na loja, e eu bem dizia ao Sr. Arthurs que o
  recolhesse ao cofre — homem velho tem os seus costumes." As mãos seguem
  sobre os joelhos. "É por aí que eu penso a coisa": [[comp_silas]].

**Confrontos** (canal lateral, reação — não confissão; conversa retoma):

- *[O Quarto Cinco às Escuras]* — Posto diante do que se conta na estalagem —
  o quarto às escuras às nove, o portão passado das dez —, Silas Crane pousa
  o bule sem ruído. "O estalajadeiro terá contado os quartos errados. A casa
  é grande, e a noite foi de movimento. Doze anos sem uma falta,
  {detective.treatment}; não é agora que hei de trocar as minhas horas." Dá a
  resposta no mesmo passo das outras e torna a erguer o bule.
- *[Livro de Ordens de Serviço]* — Posto diante do livro — os três consertos
  reentrados com queixa, a rubrica "S.C." em cada um, e na última entrada a
  letra do morto: "pesar as caixas. Pettigrew, segunda" —, Silas Crane não
  muda de posição. "Conserto que volta é o pão da bancada,
  {detective.treatment}. Uma coroa que emperra, uma mola que canta, o cliente
  traz de novo e a gente refaz. Três num outono é outono ruim, não é mais que
  isso." As mãos seguem sobre os joelhos. Quanto à nota do patrão, aproxima o
  livro do lampião e corre os olhos pela nota. "A mão dele, sim, miúda
  assim." Devolve o livro aberto na mesma página.
- *[Vidro na Dobra da Calça]* — Silas Crane olha a lasca sem estender a mão.
  "Vidro de mostrador, {detective.treatment}, e dos finos. Numa oficina
  destas parte-se um por semana: a pinça escapa, o aro morde no encaixe, o
  chão fica com o resto. O rapaz varre toda noite; a bainha apanha o que a
  vassoura deixa."

**Evasiva** (para qualquer carta sem reação própria): Silas Crane inclina-se
sobre a mesa o bastante para ver, e torna ao espaldar. "Com licença de dizer,
{detective.treatment}, a minha parte é corda e mola; o que isso valha, sabe a
perícia." As mãos não deixam os joelhos. "O que eu penso, já disse: gente da
estrada, atrás do caixa."

### Sra. Agnes Rooke (na Papelaria)

**Tom ressonante: cordial.**

Abertura: A loja cheira a goma e a papel novo; o balcão reluz de cera. Ao
fundo, o postigo do correio e a balança de cartas, com algumas por despachar.
Sobre o mostrador, apartado do resto, papel de carta com tarja de luto. A
Sra. Agnes Rooke atende de pé, do lado de dentro do balcão, e mede o
visitante por cima dos óculos. "{detective.treatment}." Não oferece cadeira.
Espera a pergunta.

**Beat 1 — o paradeiro** (todo tom sustenta `alibi_agnes`):

- *Firme:* Ergue o queixo uma linha. "Escondo o que não lhe compete,
  {detective.treatment}. Da sexta respondo, porque respondo a quem pergunta
  com direito." E responde, do tamanho da pergunta: [[alibi_agnes]].
- *Cordial (ressonante):* Baixa os óculos um instante, e a voz cede um fio.
  "A hora não me incomoda; a casa está de portas para a lei." Da sexta
  responde sem drama, mais devagar do que na abertura: [[alibi_agnes]].
- *Técnico:* "Paradeiro." Devolve a palavra como quem confere um recibo, e
  dá o seu, sem uma sílaba a mais: [[alibi_agnes]].
- *Oblíquo:* "Fecho quando a rua esvazia; loja não é taberna." O olhar não
  larga o visitante, mas a sexta ela dá, correta e curta: [[alibi_agnes]].

**Beat 2 — o morto e a vila** (todo tom sustenta `comp_agnes`):

- *Firme:* "A vila que responda pela vila, {detective.treatment}; eu
  respondo pela minha loja." Atende, da primeira palavra à última, em
  [[comp_agnes]].
- *Cordial:* "O Sr. Arthurs comprava nesta casa o papel de escrituração.
  Homem pontual." A mão pousa junto ao papel de tarja preta e retira-se
  logo. "O que a vila acrescente é assunto da vila." Diz tudo em
  [[comp_agnes]].
- *Técnico:* "Negócios: papel de escrituração, à vista, uma vez por mês.
  Conta paga em dia, vinte anos." Nada além do livro-caixa: [[comp_agnes]].
- *Oblíquo:* Segue-lhe o olhar até o papel de luto e endireita a pilha antes
  de responder. "É papel de venda, {detective.treatment}, como qualquer
  outro." Mas atende mais seca do que antes, em [[comp_agnes]].

**Confrontos:**

- *[Cesta de Ceia para Dois]* — A Sra. Rooke olha o guardanapo bordado,
  depois o bilhete, e fica um momento sem falar. "A cesta é minha; o
  guardanapo também. Ceei com o Sr. Arthurs na sexta, às oito, e saí antes
  das nove. Estávamos ajustados para casar." Torna a dobrar o guardanapo pela
  dobra antiga. "Menti sobre a minha noite, {detective.treatment}; foi tudo o
  que menti."
- *[Aro de Ouro por Gravar]* — Toma a ordem de serviço presa ao aro e lê. Lê
  outra vez. "Trinta de outubro." Devolve o aro com o papel por cima,
  dobrado pela dobra que trazia. "Não cheguei a vê-lo. As iniciais
  {g:o senhor|a senhora} leu; não precisam de mim." Volta-se para o
  mostrador e endireita, uma a uma, as folhas do papel com tarja de luto.
- *[Uma Senhora na Viela]* — Ouve o relato até o fim sem mover as mãos. "A
  Sra. Wick não jura, e faz bem: daquela janela não se vê rosto. O passo era
  meu. Saí pela viela porque a High Street comenta." E depois: "Há mais
  alguma coisa?"

**Evasiva:** A Sra. Rooke olha o que se lhe apresenta, o tempo de o ler ou de
o reconhecer, e torna a erguer os olhos. "Se nisso há pergunta,
{detective.treatment}, faça-a."

### Caleb Grey (no Moinho)

**Tom ressonante: técnico.**

Abertura: O moinho trabalha em pleno sábado: sacas na rampa, poeira de
farinha na luz da porta, o carroceiro do Finch à espera com a parelha. Caleb
Grey passa com uma saca ao ombro e não a pousa para cumprimentar. "Pergunte
andando, {detective.treatment}, que a feira não espera defunto."

**Beat 1 — o paradeiro** (todo tom sustenta `alibi_grey`; no técnico, aponta
o carroceiro como testemunha):

- *Firme:* Pousa a saca, mas só até responder. "Parada a saca, parada a
  feira; seja rápido, então." E dá a sexta no compasso de quem não a
  inventa: [[alibi_grey]].
- *Cordial:* Não pousa a saca, mas afrouxa o passo. "Dia de feira é dia de
  feira, {detective.treatment}, mas a sexta eu dou." E a dá, no vaivém das
  sacas: [[alibi_grey]].
- *Técnico (ressonante):* A saca desce na carroça antes da resposta. "A
  sexta?" O vaivém não para enquanto ele a dá: [[alibi_grey]]. Aponta com o
  queixo o homem da carroça. "Um deles está ali. Pergunte agora, se quiser."
- *Oblíquo:* "Moinho fecha com a luz; farinha não mói no escuro." Encolhe o
  ombro que carrega a saca. "A sexta, se é o que quer, foi esta":
  [[alibi_grey]].

**Beat 2 — a queixa** (todo tom sustenta `comp_grey`):

- *Firme:* "Quatro libras e dez xelins, e o conserto pago adiantado." Não
  pestaneja. "Morto, o homem me deve o mesmo que devia vivo; a queixa está
  lavrada e de pé." Sobre o que sente: [[comp_grey]].
- *Cordial:* Enxuga a testa com as costas da mão. "Desavença? O relógio
  caçador do meu pai entrou inteiro naquela loja e voltou mais leve. Não é
  desavença, {detective.treatment}, é conta." E do que isso lhe pesa:
  [[comp_grey]].
- *Técnico:* "Exigi pesagem diante de testemunhas e lavrei termo na
  delegacia, tudo antes de o homem morrer; as datas estão no papel. Quatro
  libras e dez xelins, conserto pago adiantado." A soma sai sem um erro, e
  por baixo dela: [[comp_grey]].
- *Oblíquo:* "Confiei uma vez, e paguei o conserto adiantado por cima."
  Passa a saca de um ombro ao outro. "Entrou pesado e voltou leve; o resto
  está em termo lavrado." E o que ficou por baixo do termo: [[comp_grey]].

**Confrontos:**

- *[Queixa do Relógio Mais Leve]* — Olha o termo de longe. "Minha. Lavrada
  na sexta à tarde, diante do próprio Wycliffe, e assino outra vez aqui na
  tábua da rampa, se for preciso." Faz sinal ao carroceiro que espere.
  "Quatro libras e dez xelins. A queixa fica de pé até se pesar aquele
  relógio diante de gente."
- *[Livro de Ordens de Serviço]* — Limpa a mão na perna antes de tocar o
  livro. O dedo, branco de farinha, desce a coluna e para. "Este é o meu. O
  relógio do meu pai, e o preço adiantado somado à margem, da letra do
  próprio velho." Corre os olhos pelas linhas vizinhas. "Mais dois com
  queixa no mesmo outono. Eu pensava que o azar era só meu." Empurra o livro
  de volta pela tábua. "Eu sei o que entrou e o que saiu, {detective.treatment};
  quem pôs a mão nele, a loja que diga."

**Evasiva:** Olha por cima da saca, o tempo de dois passos, e encolhe os
ombros sem soltá-la. "Disso não sei, e sem papel nem testemunha não juro.
Pergunte de farinha, de pesagem ou do que me devem."

### Walter Arthurs (na Estalagem — diálogo embutido)

**Tom ressonante: cordial.**

Abertura: Walter Arthurs desce à sala sem casaco, a barba de ontem por
fazer, e fica de pé junto ao aparador. "Soube esta manhã e estou aqui desde
então, às ordens de quem as tiver. A casa do meu tio está lacrada; tomei o
quarto três. Pergunte-se o que houver, {detective.treatment}, e pergunte-se
logo, que negociante parado é dinheiro andando para trás." Enquanto fala,
abotoa e desabotoa o botão alto do colete.

**Beat 1 — o paradeiro** (todo tom sustenta `alibi_walter`, corroborado:
false — a mentira do carro):

- *Firme:* O botão do colete para entre os dedos. "Pensado está."
  Endireita-se antes de responder. "Estive com meu tio de tarde, tratamos de
  negócios, e segui o meu caminho." E dá o paradeiro: [[alibi_walter]].
- *Cordial (ressonante):* "Duro, {detective.treatment}, é a palavra." Por um
  instante o botão fica quieto. "Estive com meu tio de tarde, tratamos de
  negócios, e segui o meu caminho." O botão do colete volta a girar enquanto
  ele dá o paradeiro: [[alibi_walter]].
- *Técnico:* "Do fim da tarde à noite. Sim." Conta pelos dedos, como quem
  alinha uma fatura. "Meu tio de tarde, negócios; depois, o meu caminho." E
  o paradeiro: [[alibi_walter]].
- *Oblíquo:* "Dormi o que se dorme numa noite dessas." O botão volta a
  girar. "Estive com meu tio de tarde, negócios, e segui o meu caminho." E
  dá o paradeiro: [[alibi_walter]].

**Beat 2 — o tio e os negócios** (sem carta; caracterização):

- *Firme:* "O que a morte me traz? Trabalho e credores, {detective.treatment},
  na ordem que quiser." Puxa o colete para baixo, como quem se compõe para
  retrato. "Herdeiro único, sim; e o que herdo é uma loja lacrada, um
  inventário e juízo pela frente. Se isso me faz réu aos seus olhos, faça a
  conta inteira, que a minha lista de credores é mais longa do que qualquer
  herança."
- *Cordial:* "Meu tio era homem de uma peça. Recolheu-me quando meu pai
  morreu, pagou-me o colégio, e não me deixou esquecer nem uma coisa nem
  outra." O polegar corre a barba por fazer. "Achei-o como sempre: são, duro
  no dinheiro, senhor das suas horas. Quem lhe fez isto que responda, e hei
  de cobrar eu mesmo, que afinal é o que se espera de um herdeiro, não é
  assim que dizem?"
- *Técnico:* "Vão mal, e disso nunca fiz segredo. Devo às fazendas, devo ao
  armazém que anda em juízo, devo até ao Station de Moorford, onde durmo a
  crédito. A lista é pública e eu a sei de cor." A voz, alta no princípio,
  acaba quase para dentro. "Da herança falem os outros; eu falo do que devo,
  que ao menos é meu."
- *Oblíquo:* "Custa, {detective.treatment}, e não é o pior que custa." O
  botão para. "Um negociante de quarenta e quatro anos que dorme a crédito
  aprende a não reparar em certas coisas. Perguntou-me da cama; a cama eu
  tenho. Do resto, pergunte à minha lista de credores, que é longa e
  verdadeira."

**Confrontos:**

- *[Registro da Estalagem]* — Walter Arthurs lê a própria assinatura e a
  linha das sete e quarenta. Puxa uma cadeira e senta-se antes de responder.
  "Não houve carro." A voz sai baixa, e depois as palavras vêm de uma vez.
  "Vim na sexta pedir dinheiro ao meu tio. Pedido, implorado, a juro de praça
  e com a palavra que me resta. Ele recusou aos gritos, com a loja ainda
  aberta. Tomei este quarto porque àquela hora já não havia carro, e porque
  naquela noite eu não tinha ânimo de me apresentar em hotel nenhum. Fiquei
  no três a noite inteira, escrevendo: cartas a ele, cartas a credores. Pedi
  vela nova pela meia-noite; o caseiro que o diga. Menti, {detective.treatment},
  porque a verdade era esta: um negociante de quarenta e quatro anos à porta
  do tio, de chapéu na mão, ouvindo não. Depois dos gritos, na loja não
  tornei a pôr os pés." Depois cala-se, as mãos abertas sobre a mesa.
- *[Carta Amassada em Bola]* — Walter desamassa a folha só até onde a letra
  aparece e torna a fechá-la pela mesma dobra. "A mão é minha; o pedido,
  também." Pousa-a na mesa com a escrita para baixo. "Um adiantamento entre
  parentes se propõe em toda parte, {detective.treatment}, e se lavra no
  gabinete de um procurador quando aceito. Escrevi-a como se escreve a um
  credor: com conta, prazo e juro. Esperava-lhe destino melhor. Meu tio não
  era homem de responder papéis que o desagradassem."
- *[Testamento do Relojoeiro]* — "Herdeiro único. Sei o que se soma com
  isso: negócios em ruína de um lado, loja e casa do outro, e o meu nome no
  meio. É conta que qualquer credor meu já fez." Puxa o colete para baixo,
  como quem se compõe para retrato. "Pois faça-se a conta inteira,
  {detective.treatment}. Meu tio vivo valia-me um adiantamento assinado numa
  tarde; agora vale-me uma loja lacrada, um inventário e juízo pela frente.
  Diga-me qual dos dois convinha a um homem com credores à porta."

**Evasiva:** Walter recebe o que se lhe mostra e devolve-o antes de o
examinar, os dedos no colarinho. "E que tenho eu com isto? Entendo de
fazendas e de letras de câmbio. Já dei o meu paradeiro e o nome dos meus
credores; se é para me mostrarem cada papel desta vila, mostrem também aos
outros, que não sou o único nome escrito em Briarstone."

### Davey Tull (na Oficina — diálogo embutido)

**Tom ressonante: cordial.**

Abertura: Davey Tull varre um chão que já não dá pó. Ao ver gente, encosta a
vassoura no ombro e espera a pergunta de olhos erguidos. "O Sr. Crane disse
pra eu tomar conta da oficina. Eu tomo conta e vou varrendo, que parado o
serviço não rende."

**Beat 1 — os costumes do patrão** (todo tom sustenta `dep_habito_corda`):

- *Firme:* Os olhos sobem, depressa, e a vassoura aperta-se contra o ombro.
  "Costumes eu conto, senhor." E conta, curto, o que lhe perguntam:
  [[dep_habito_corda]].
- *Cordial (ressonante):* A vassoura desce um pouco, e a voz solta-se. "O
  patrão punha o relógio consertado no meu ouvido, pra eu ouvir se o
  compasso saíra certo. Dizia que máquina bem posta respira. Eu já acerto o
  de parede sozinho; o de bolso ele ainda não deixava." E, dos costumes da
  noite, conta [[dep_habito_corda]].
- *Técnico:* "À noite, senhor, o patrão fechava sempre pela mesma ordem." A
  vassoura encosta no ombro e o menino conta, seguro, o que sabe de cor da
  bancada: [[dep_habito_corda]].
- *Oblíquo:* "Aprendia, senhor, mas o de bolso ele ainda não deixava; só o
  de parede." O queixo desce um pouco. "De dar corda, isso o patrão fazia
  sempre à mesma hora." E conta: [[dep_habito_corda]].

**Beat 2 — a noite de sexta** (todo tom sustenta `alibi_davey`):

- *Firme:* Os olhos descem para a vassoura e lá ficam. "Sem gaguejar,
  senhor; já contei mais de uma vez." E conta, a recitação de cor:
  [[alibi_davey]].
- *Cordial:* "A sexta eu conto certinho, que já contei mais de uma vez." A
  vassoura fica quieta, e ele conta sem pressa, de olhos erguidos até o fim:
  [[alibi_davey]].
- *Técnico:* "Do fecho em diante, senhor." Os olhos descem para o serviço e
  lá ficam até o fim das palavras: [[alibi_davey]].
- *Oblíquo:* "Não, senhor; durmo em casa, com a minha gente. Da oficina saio
  quando o Sr. Crane tranca." E, da sexta, conta o que lhe cabe:
  [[alibi_davey]].

**Confrontos:**

- *[Relógio de Bolso Parado]* — Davey encosta a vassoura na parede e estende
  as duas mãos. "Posso ouvir?" Encosta o relógio do morto no ouvido do jeito
  que o patrão fazia com ele, e fica assim um bom tempo, os olhos parados na
  parede. "Anda certo. Compasso bem posto." Devolve-o com as duas mãos. "A
  corda das onze, pro patrão, era coisa sagrada, que nem reza; dois anos de
  casa, e esse relógio nunca soube o que era ficar sem corda." E torna à
  vassoura sem que ninguém o mande.
- *[Buril Claro no Estojo]* — Davey chega sem que o chamem e para a um passo
  do estojo, as mãos atrás das costas. "Esse é o do Sr. Crane. Ferramenta
  dele ninguém pega; a minha é a do caixote, de cabo de freixo." O olho corre
  a fileira, cabo por cabo. "Buril a gente limpa na flanela, com a cera da
  bancada. Molhar não pode, que a água entra na junta e enferruja o
  espigão; isso o patrão me ensinou no primeiro mês. O de ponta é o de
  gravar miúdo, por dentro de tampa; um igual já me escapou e me abriu o
  dedo, no primeiro ano." Recua o passo que tinha dado.

**Evasiva:** Davey chega o rosto para ver de perto, a testa franzida, e faz
que não com a cabeça. "Isso eu não sei dizer o que é, {detective.treatment}.
Se fosse coisa de relógio, eu conhecia; do resto, quem sabia era o patrão."

---

## 8. Consequências do Confronto (semente inerte)

*(fonte: `src/data/confrontos.js` — mecânica reservada, ainda sem executor)*

- **Silas Crane** (o réu): `corrob_estalajadeiro` → poderia antecipar-se à
  cena; `ev_livro_ordens` → poderia mexer nas provas; `ev_vidro_dobra` →
  fica agitado.
- **Walter Arthurs**: `ev_registro_estalagem` → poderia fugir/tornar-se
  ausente.
- Agnes, Grey e Davey: sem gatilho de ação previsto.

---

## 9. Os Ecos do Mestre (a voz do Dr. Alcott sobre a falha)

*(fonte: `src/data/ecos_mestre.js` — falam quando o jogador erra um método;
nunca nomeiam o culpado)*

- **Sem janela:** "O senhor levou o caso a julgamento sem tirar do corpo a
  hora da morte. O corpo tinha o que dizer sobre isso, e ficou por ouvir." /
  "Faltou firmar a janela. Antes do nome e do meio, vem o quando — e o
  quando o senhor não prendeu a sinal nenhum."
- **Janela não cobre:** "A janela que o senhor firmou não abarca a hora que
  o corpo aponta. Uma das duas está fora do lugar." / "O senhor cravou uma
  faixa de horas anterior à morte. A conta do corpo fica de fora dela."
- **Janela sem sustentação:** "O senhor firmou a janela e não a prendeu a
  carta alguma. Falta o sinal do corpo que a sustente." / "A janela está lá,
  solta. Nenhuma carta do corpo a segura por baixo."
- **Janela imprecisa:** "A janela é larga demais. O corpo consente que o
  senhor a aperte; volte aos sinais e feche a faixa." / "O senhor deixou
  horas de sobra dos dois lados. Com o que o corpo guarda, dá para estreitar
  a conta."
- **Sem nexo:** "O senhor levou o acusado ao banco sem o pôr na cena. A
  cadeia abre um vão justo aí, entre o nome e o lugar." / "Falta a presença.
  Ter o nome não é tê-lo no sítio à hora certa; esse elo ficou por atar."
- **Nexo errado:** "O vínculo que o senhor firmou não põe o réu na cena. O
  que ligou aponta para outro lado que não o lugar do crime." / "A ligação
  da presença não pegou. O que o senhor amarrou ali não é o que põe o
  acusado no sítio."
- **Nexo acessório:** "À presença o senhor juntou um vestígio que não é do
  meio da morte. Repare no que de fato o põe na cena, e separe o resto." /
  "Um dos cabos que o senhor atou à presença é de outra história. Guarde
  para a presença só o que a sustenta."
- **Sem descuidos:** "Há na cena uma leitura que não fecha com as outras. O
  senhor passou por ela sem a marcar." / "Dois sinais aqui contam horas
  diferentes. Onde as contas não batem, volte e confira antes de seguir."
- **Réu errado:** "O corpo não acusa o homem que o senhor levou ao banco. A
  leitura física e o nome que o senhor firmou não se encontram." / "O senhor
  fechou uma cadeia inteira sobre um nome que os sinais do corpo não
  amparam. Torne a conferir se a leitura ampara o nome que firmou."

---

## 10. Os Ecos da Interferência (framework — casos procedurais)

*(fonte: `src/data/ecos_interferencia.js` — nota do próprio perito, na
Caderneta, pós-caso; o tutorial não tem interferência, mas o texto serve a
qualquer caso gerado)*

- **Destruir evidência (ocorrida):** "Esfregaram a cena entre uma visita e
  outra; quando voltei, a madeira ainda estava úmida. A peça que se perdeu
  não volta, mas esfrega fresca também se data." / "Levaram da cena o que eu
  ainda não tinha recolhido. Ficou no lugar a limpeza recente, e ela se lê
  como qualquer outro sinal." / "Faltava da cena o que eu deixara para
  recolher na volta. A esfrega recente não some sozinha: também ela guarda a
  sua hora."
- **Destruir evidência (evitada):** "Vieram limpar a cena; o que importava
  já estava no meu caderno." / "Quando esfregaram o assoalho, a peça já
  constava do meu registro. Guardo o método: primeiro o que pode sumir." /
  "Esfregaram tarde. O que podia sumir já tinha ido para o caderno, antes de
  tudo o mais."
- **Intimidar testemunha (ocorrida):** "Aquela boca fechou depois que as
  minhas perguntas correram a vila. Anoto o dia em que fechou." / "A
  testemunha recuou antes de assinar o que sabia. Onde o depoimento faltar,
  procuro o que sobrou em torno da recusa." / "Uma testemunha emudeceu no
  meio do inquérito. O silêncio dela vira marco: o caso mede-se pelo antes e
  pelo depois."
- **Intimidar testemunha (evitada):** "Tentaram calar quem já tinha falado
  comigo. O depoimento estava colhido; o medo chegou atrasado." / "A ameaça
  veio depois do registro, e contra registro feito o medo pode pouco." /
  "Ameaçaram quem já tinha assinado. A folha ficou onde estava, e o
  inquérito seguiu por ela."
- **Subornar testemunha (ocorrida):** "A mesma boca me contou duas
  histórias, e a segunda veio na semana em que uma dívida antiga se
  quitou." / "Tenho dois depoimentos que não se encontram e uma dívida
  quitada entre um e outro. Ponho as três coisas lado a lado e meço as
  datas." / "A segunda versão veio depois que um dinheiro trocou de mãos.
  Entre as duas, não decido de ouvido: confronto cada uma com o que o
  dinheiro não move — o corpo, a hora, o registro."
- **Silenciar (ocorrida):** "Perdi a testemunha antes do depoimento. O
  segundo corpo é morte de horas, não de dias, e sinais frescos ainda
  apertam essa conta." / "Quem ouviu aquela noite não chegou a depor. O
  segundo corpo se lia como o primeiro: rigor, livor, a conta das horas. O
  que o gesto teve de grosseiro ficou nos sinais." / "Onde esperava uma voz,
  achei um corpo. O que a testemunha já não diz, o estado do corpo ainda
  diz, e essa hora entra na conta."
- **Silenciar (evitada):** "A testemunha morreu com o depoimento já no meu
  caderno. Cheguei primeiro; o que sabia, o tribunal ainda ouve." / "O aviso
  estava lá, para quem quisesse ler, e o depoimento sobreviveu a quem o
  deu." / "A testemunha faltou ao tribunal; o depoimento, não. Assinado e
  datado, depõe sozinho."

---

## 11. O Glossário Forense

*(fonte: `src/data/glossario.js` — consulta gratuita, sempre disponível)*

### Temporal
- **Rigor Mortis** — Enrijecimento muscular cadavérico. Surge de 2 a 4 horas
  após a morte, em sequência céfalo-caudal (mandíbula primeiro, membros por
  último); atinge o pleno por volta de 12 horas; desfaz-se, na mesma ordem,
  entre 24 e 36 horas. *Sinal:* o corpo duro, os membros que não dobram:
  morte entre 12 e 24 horas; quando a dureza já começa a ceder, entre 24 e
  36.
- **Livor Mortis** — Manchas violáceas formadas pelo sangue que, sem
  circulação, desce por gravidade às partes baixas do corpo. Surgem em 1 a 2
  horas; tornam-se fixas — não esmaecem sob pressão — após cerca de 12
  horas. *Sinal:* manchas arroxeadas nas partes de baixo do corpo; se não
  empalidecem à pressão, morte de 12h ou mais.
- **Algor Mortis** — Resfriamento cadavérico: o corpo perde cerca de 1°C por
  hora a partir dos 37°C, até igualar o ambiente. Igualado o ambiente, o
  sinal nada mais informa. *Sinal:* o corpo ainda morno ao toque, medido ao
  termômetro; a diferença para 37°C aproxima as horas, com margem de duas
  horas para mais e para menos.
- **A Rotina Interrompida** — Um hábito invariável do morto vale por
  testemunha: cumprido, prova vida à sua hora; por cumprir, prova que a
  morte veio antes dela. O relógio de bolso comum guarda trinta horas de
  marcha; parado de corda solta, a hora do mostrador, contadas trinta horas
  para trás, dá a última vez que uma mão o armou. *Sinal:* relógio de bolso
  parado com a mola vazia e a máquina sã; a rotina que o alimentava fixa o
  teto da janela.
- **O Registro Mecânico (roda de contagem)** — Num relógio de badalar, a
  roda de contagem governa quantas vezes o martelo cai a cada hora vencida.
  Se roda e ponteiros não concordam, moveram os ponteiros à mão; a parada da
  máquina data-se entre a última batida dada e a seguinte, que não veio.
  *Sinal:* roda de contagem num entalhe que não concorda com os ponteiros —
  registro fixo, não degrada com o passar das horas.
- **Intervalo Post-Mortem (convergência)** — Nenhum sinal isolado data uma
  morte com segurança; a boa perícia sobrepõe as faixas de todos os
  indicadores e retém o trecho comum a todas. *Sinal:* a janela da morte é a
  interseção das faixas; sinais degradados nada acrescentam.
- **A Discórdia dos Sinais** — Os sinais tanatológicos não acompanham uns
  aos outros quando um é manipulado (retardar o resfriamento com garrafas de
  água quente, por exemplo). *Sinal:* um corpo morno de rigidez completa, ou
  frio sem sinal interno de tempo — a discórdia é o achado; descarta-se a
  temperatura, os sinais duráveis fecham a hora.

### Causal
- **Petéquias e Cianose** — Hemorragias puntiformes e face azulada por
  asfixia; assinalam a família, não o meio. *Sinal:* pontinhos de sangue nos
  olhos, face e lábios azulados; excluem veneno e trauma.
- **Sulco Cervical Horizontal** — Marca de ligadura apertada por mãos
  alheias: sulco horizontal e uniforme — assinatura do estrangulamento por
  ligadura.
- **Sulco Oblíquo Ascendente** — No enforcamento, o peso do corpo puxa a
  ligadura para cima: sulco ascendente que se interrompe — distingue a
  suspensão do estrangulamento por terceiros.
- **Esganadura (Estrangulamento Manual)** — Pressão direta das mãos: deixa
  equimoses de polegares e escoriações em meia-lua das unhas, sem sulco
  contínuo.
- **Sufocação** — Obstrução mecânica de boca e narinas; asfixia sem marca no
  pescoço, por vezes escoriações ao redor da boca.
- **Afogamento** — Asfixia por submersão; espuma fina nas vias aéreas,
  pulmões distendidos e encharcados.
- **Reação Vital** — Escoriações e equimoses só se formam em tecido vivo:
  presente, prova lesão perimortem em vida; ausente, lesão pós-morte. Não
  informa a causa.
- **Odor de Amêndoas Amargas** — Envenenamento por cianeto, ação rápida.
- **Odor Aliáceo** — Hálito de alho, envenenamento por arsênico, ação lenta.
- **Trauma Contuso** — Golpe por objeto rombo: fraturas, afundamentos,
  contusões de bordas irregulares.
- **Ferida por Arma Branca** — Lesão cortante ou perfurante: bordas nítidas
  e regulares.
- **Ferida Incisa e Perfuro-Incisa** — A lâmina divide sem esmagar: bordas
  nítidas sem ponte de tecido. Incisa: corte mais comprido que fundo.
  Perfuro-incisa: trajeto mais fundo que a boca é comprida. Lâmina de um
  gume deixa uma extremidade aguda e outra romba; haste de faces (gravar,
  cinzelar) deixa a boca em losango.
- **Ferida por Arma de Fogo** — Orifício de entrada arredondado, orla de
  contusão, tatuagem de pólvora à queima-roupa.

### Ambiental
- **Encenação de Cena** — Arranjo deliberado para contar história falsa:
  desordem que poupa valores, arrombamento superficial, relógio parado numa
  hora incompatível com a perícia do corpo.
- **Livores Incompatíveis com a Posição** — Manchas em partes não apoiadas
  indicam que o cadáver foi movido depois de fixarem.
- **Marcas de Arrasto** — Sulcos no chão, tapetes repuxados, poeira varrida
  pelo corpo deslocado.
- **Espasmo Cadavérico** — Contração instantânea e definitiva da mão no
  momento da morte violenta; não pode ser forjado depois.
- **Conteúdo Estomacal** — A digestão cessa com a morte; o grau de digestão
  baliza a hora do óbito, conhecida a última refeição.
- **Lesões de Defesa** — Cortes e equimoses de quem tentou aparar o golpe;
  a ausência sugere ataque súbito ou vítima incapaz de reagir.

### Comportamental
- **Declaração de Paradeiro (Álibi)** — Só exclui autoria se cobrir a
  verdadeira hora da morte, não a hora que alguém quis fazer crer.
- **A Mentira do Inocente** — Inocentes mentem por vergonha, medo ou culpa
  alheia; a mentira do assassino contradiz a evidência física, a do
  inocente contradiz só a moral.
- **Motivo e Oportunidade** — O motivo sem oportunidade não estabelece
  autoria; a acusação exige móbil, ocasião e materialidade reunidos.

### Vestígios
- **Transferência de Vestígios** — Todo contato deixa marca; o vestígio
  liga pessoa, instrumento e lugar.
- **Fibras Têxteis e de Cordoaria** — Cânhamo, lã, linho e algodão
  distinguem-se pela torção e pelo calibre à lente; identificam matéria
  compatível, não a peça exata.
- **Ensaio de Guaiaco (Reação de Van Deen)** — Prova de campo para sangue
  desde 1862: azul vivo em segundos é presuntivo, não conclusivo (ferrugem,
  saliva, batata crua dão o mesmo azul).
- **Cristais de Teichmann (Hemina)** — Confirmação microscópica de sangue
  desde 1853: cristais rômbicos castanho-escuros; não diz espécie nem
  pessoa.
- **Microespectroscopia (Sorby)** — Espectroscópio ao microscópio, desde
  1865: confirma sangue em mancha lavada ou antiga; prova de gabinete, exige
  laboratório.
- **Micrometria do Glóbulo (Gulliver)** — Mede o diâmetro do glóbulo
  vermelho reconstituído (1875): serve para excluir espécie, nunca para
  afirmar sangue humano perante um júri.
- **O que Vem Preso ao Coágulo** — Cabelo, escama de pele ou fibra
  amalgamados ao coágulo — o elo entre pessoa e pessoa, quando a espécie do
  sangue não se pode provar.

---

## 12. As Explicações do Encerramento

*(fonte: `src/data/rotulos.js` — `ROTULOS_EXPLICACAO`; pagas apenas se a
alegação-isca correspondente foi refutada, e só depois do caso selado)*

**Luz esquecida** (explica `dep_avistamento_padeiro`): "A luz vista de
madrugada teve explicação mais simples que um homem vivo: o lampião da
bancada, aceso desde a véspera, queimou sozinho até secar o depósito. Era
essa a claridade que o moço do padeiro tomou pelo velho a trabalhar."

---

## 13. O Monólogo do Detetive (moldes universais)

*(fonte: `src/logic/monologo.js` — servem a qualquer caso, tutorial ou
gerado; a escolha de variante é determinística por hash da seed + nome do
perito)*

### Aberturas, por desfecho

**Vitória Absoluta**
- "Recolho as cartas em silêncio. A cadeia fechou-se elo a elo, e cada elo
  carrega atrás de si o peso do corpo."
- "Ponho a última carta sobre a mesa e recuo um passo. A cadeia está
  inteira: começa no corpo e não se solta em nenhum ponto."
- "Fecho a caderneta devagar. Do primeiro sinal ao último nó, a acusação
  sustenta o próprio peso."

**Sucesso, com Gafes**
- "A cadeia prendeu o acusado, mas não sem ranger. Amarrei alguns elos com
  mais pressa do que perícia, e quem é do ofício há de notá-los."
- "A acusação segura, embora eu mesmo lhe veja os pontos frouxos. Prende —
  só não prende limpo."
- "O nó fechou-se sobre o culpado; ficaram, no caminho, alguns cabos mal
  atados que eu preferiria não ter deixado."

**Impunidade**
- "Tenho o nome certo e as mãos vazias. O faro aponta o nome; a cadeia não
  o alcança."
- "Sei quem foi. Não provei que foi. Levo o nome na caderneta e nada com
  que o sustentar diante de um júri."
- "Aponto o culpado e não tenho com que o segurar: faltaram à cadeia os
  elos que o punham no lugar do crime."

**Erro Judiciário**
- "Montei uma cadeia coerente, e errada. Condenei quem não devia, e deixei
  o verdadeiro sem quem lhe pedisse contas."
- "A acusação era firme e apontava para o lado errado. Condenei um nome que
  o corpo não acusava."
- "Tudo se encaixava, menos o essencial: o nome. Levei à forca quem não
  cometeu o crime."

### A tese sustentada (bloco central, parametrizado)

"Sustento que [o/a réu] deu morte a[o/a] [vítima][, na janela de horas],
mediante [mecanismo] ([instrumento]). Como móbil, [motivo]." — e, se o
jogador refutou a própria peça forjada: "E a encenação caiu pelo próprio
relógio [ou: pelo próprio corpo]: arrumado para marcar [hora forjada], hora
em que a vítima [ainda estava viva / já estava morta]."

### O buraco da cadeia (por código de falha, quando o veredicto falha)

- **corpo_sem_substancia:** "Levei a acusação adiante sem uma leitura do
  corpo que a sustentasse."
- **sem_janela:** "Não firmei a hora da morte em sinal algum do corpo, e sem
  ela não havia como medir os álibis."
- **janela_nao_cobre:** "A janela que afirmei erra a hora do óbito. Errei o
  relógio, e com ele o caso."
- **janela_sem_sustentacao:** "A janela que afirmei não é a que os meus
  próprios sinais sustentam: reuni provas de uma faixa de horas e assinei
  outra."
- **janela_imprecisa:** "A janela que afirmei ficou larga demais para
  acusar alguém com ela."
- **sem_mecanismo:** "Não afirmei como a vítima morreu."
- **mecanismo_errado:** "A causa que sustentei não se firma nos sinais do
  corpo; as lesões dizem outra coisa."
- **sem_nexo:** "Nada na minha cadeia pôs [o réu] junto ao instrumento do
  crime."
- **nexo_errado:** "O vestígio que invoquei não liga o acusado ao
  instrumento do óbito."
- **nexo_acessorio:** "Entre os vestígios que atei à presença há traço que
  não é do réu; carreguei a cadeia com marca de terceiro."
- **sem_motivacao:** "Não apontei o móbil; apresentei uma acusação sem
  porquê."
- **motivacao_erronea:** "O móbil que sustentei não é o que a cadeia
  prova."
- **sem_descuidos:** "Não apontei os descuidos da encenação, e a cena
  arrumada para mentir seguiu de pé."
- **periferico:** "Sobre [suspeito], o meu juízo não correspondeu ao que as
  cartas de fato provam."

### Juízo sobre os não-acusados (por padrão de prova, com variantes)

- **Álibi + motivo na mesa:** "Quanto a [suspeito], o paradeiro que firmei
  não cruza a janela da morte: razões contra a vítima não faltavam; faltou a
  ocasião de agir." (e variantes)
- **Álibi sem motivo:** "Quanto a [suspeito], o paradeiro que firmei não
  cruza a janela da morte, e nada mais prendia esse nome ao caso." (e
  variantes)
- **Álibi por convicção (sem carta colhida):** "Quanto a [suspeito], não
  colhi o paradeiro que alegava: dei-lhe a inocência por convicção, não por
  perícia, e a convicção acertou." (e variante)
- **Segredo exposto:** "Quanto a [suspeito], a mentira que quebrei encobria
  uma vergonha, e não o homicídio. Provei-o com o que estava na mesa; não é
  vitória expor o que um inocente calava." (e variantes)

### Fechos, por desfecho (parametrizados pelo nome do réu)

**Vitória Absoluta**
- "Guardo os instrumentos sem pressa. [O réu] responderá pelo que fez, e um
  caso bem lido dispensa o aplauso."
- "[O réu] responderá pelo que fez. Fecho a maleta: o corpo disse tudo o que
  tinha a dizer, e foi ouvido."
- "Não há mais o que somar. [O réu] vai a julgamento, e a cadeia inteira vai
  junto."

**Sucesso, com Gafes**
- "[O réu] responderá assim mesmo. Mas fica o travo das gafes, e é nelas que
  se faz ou se perde a fama de um perito."
- "A condenação de [réu] está de pé. Guardo, para mim, a lista do que faria
  melhor numa segunda vez."
- "[O réu] vai a julgamento. Levo comigo os pontos frouxos, que ninguém viu
  senão eu — por ora."

**Impunidade**
- "[O réu] sairá livre, e a lei nada terá a lhe dizer. Um culpado solto é um
  erro que continua a trabalhar."
- "[O réu] deixa a sala pela porta da frente. A certeza sem prova não prende
  ninguém, e eu que o diga."
- "[O réu] fica em liberdade por falta do que só eu deveria ter trazido. A
  intuição não assina laudo."
- "[O réu] sai da sala sem pressa, e ninguém lhe barra a porta. Fecho a
  caderneta sobre o nome que não pude sustentar."

**Erro Judiciário** (nomeando o culpado verdadeiro, quando o encerramento
definitivo o permite)
- "Enquanto se lê a sentença, [o culpado] observa de longe, de mãos limpas.
  A forca de um inocente tem dois carrascos: quem ata o nó e quem assina o
  laudo."
- "A sentença cai sobre o nome errado, e [o culpado] assiste sem pestanejar.
  O verdadeiro erro foi meu, e leva a minha assinatura."
- "[O culpado] sai da sala como quem cumpriu uma formalidade. Condenei a
  pessoa errada, e é isso que ficará no meu nome."

**Erro Judiciário, sem nomear** (retentativa do caso-escola ainda de pé):
- "A sentença cai sobre o nome errado, e o verdadeiro autor a escuta de onde
  quer que esteja, calado. O erro leva a minha assinatura."
- "Condenei quem não devia. Quem de fato matou segue à solta, sem nome na
  minha caderneta — e o meu laudo é hoje o seu melhor abrigo."
- "Assino uma cadeia coerente sobre um nome errado. O certo, esse, ainda
  está por escrever."

---

## 14. O Epílogo (moldes universais)

*(fonte: `src/logic/epilogo.js` — o encerramento pós-monólogo: o destino do
réu, dos periféricos e do perito, em formato de folha de jornal com coluna e
margem)*

### O destino do réu, por desfecho

- **Vitória Absoluta:** "O júri ouviu a cadeia inteira sem pedir que se
  repetisse um elo, e condenou [o réu] na primeira sessão do tribunal de
  circuito do condado. A pena foi a que a lei reserva ao homicídio doloso: a
  forca."
- **Sucesso, com Gafes:** "[O réu] ouviu a condenação, mas não sem custo: a
  defesa leu em voz alta, um por um, os pontos frouxos da cadeia, e o júri
  deliberou até a madrugada antes de acompanhar o laudo."
- **Impunidade:** "Sem cadeia que o sustentasse, o caso não chegou a
  julgamento. O inquérito encerrou-se com a fórmula de costume — homicídio
  doloso por pessoa ou pessoas desconhecidas — e [o réu] continua onde
  sempre esteve, com a vida que essa morte lhe deixou mais larga." *(a
  segunda metade só na margem — libelo se impressa com o nome)*
- **Erro Judiciário:** "O processo correu sem tropeço: o júri condenou [o
  réu] sobre o meu laudo, e não houve, na sala, voz que soubesse o bastante
  para se levantar." *(na coluna do jornal, sem a voz em 1ª pessoa: "...sobre
  o laudo do perito, e a defesa não arrolou quem o contestasse.")*

### O eco da hora tomada (só se a encenação caiu)

"A hora que a mentira tomou emprestada de um relógio, o corpo cobrou de
volta." *(ou, quando a peça forjada foi a temperatura do corpo: "...tomou
emprestada do termômetro...")*

### A revelação (só no Erro Judiciário)

"Ao verdadeiro autor, o processo nunca chegou: [o culpado] acompanhou a
sentença de fora dos autos."

### O destino dos periféricos

- **Segredo exposto:** "A mentira de [nome] ficou nos autos pelo que era:
  vergonha, não sangue. Provou-se inocente, e o preço foi ter posto à vista,
  diante de estranhos, o que guardava para si." (e variante)
- **Segredo não exposto:** "A mentira de [nome] ficou nos autos sem
  explicação: o inquérito não a desfez, e também não a tomou por crime." (e
  variante)
- **Álibi confirmado:** "O processo guardou de [nome] apenas o paradeiro
  confirmado." / "[Nome] voltou ao próprio ofício; os autos não tornaram a
  citar esse nome."

### O perito fecha a conta (flexiona pela hora do selo)

- **Vitória Absoluta (de dia):** "Os honorários foram pagos sem discussão da
  conta, com o dia ainda aberto sobre a vila. O próximo chamado, quando vier,
  virá mais cedo." *(de noite: "...já à luz dos lampiões...")*
- **Sucesso com Gafes:** "Pagaram-me os honorários e pouparam-me os
  cumprimentos. Há de haver outro chamado, e menos pressa."
- **Impunidade:** "Não se pagam honorários por um caso em aberto. Deixei os
  laudos em ordem: algum dia alguém os relerá."
- **Erro Judiciário:** "Os honorários, recusei-os. O laudo, esse, não há
  como devolver."

### A manchete do jornal (cabeça de página, estilo 1893)

- **Manchete** (qualquer desfecho): "A morte de [vítima]"
- **Vitória Absoluta / Erro Judiciário:** decks "Veredicto de culpa contra
  [réu]" / "Sentença de morte no tribunal de circuito" — crédito "Do nosso
  correspondente". *(A cabeça do Erro Judiciário é idêntica à da Vitória
  Absoluta — a folha não tem como distinguir os dois casos.)*
- **Sucesso com Gafes:** decks "Veredicto de culpa contra [réu]" /
  "Sentença de morte, sob protesto da defesa" — crédito "Do nosso
  correspondente na sala do tribunal".
- **Impunidade:** decks "Inquérito encerrado" / "Homicídio doloso por
  pessoa ou pessoas desconhecidas" — crédito "Do nosso correspondente na
  comarca".

---

## 15. A Verdade por Trás do Caso (nota autoral — spoiler)

*(fonte: `src/data/seed.js`, `SEED_TUTORIAL` — nunca exposta ao jogador; lida
só pelo motor de veredicto)*

O primeiro-oficial **Silas Crane**, com doze anos de casa, vinha trocando
ouro dos consertos por metal vil. Descoberto pelo Sr. Arthurs na sexta-feira
13 de outubro, matou o mestre às 21h com o próprio buril de gravar e encenou
um roubo alheio — o relógio da lareira, recuado para 08h45 e esmagado, é a
"hora emprestada" que dá nome ao caso.

Os demais suspeitos são inocentes, cada um por uma razão diferente:
- **Walter Arthurs** (sobrinho, herdeiro) — inocente, mas guarda um segredo:
  a súplica de dinheiro recusada.
- **Sra. Agnes Rooke** (vizinha) — inocente, mas guarda um segredo: o
  noivado secreto com a vítima.
- **Caleb Grey** (moleiro com queixa formal) — inocente, com álibi firmado
  no moinho.
- **Davey Tull** (aprendiz) — inocente, com álibi firmado em casa.

---

## Fontes

| Seção | Arquivo-fonte |
|---|---|
| 1 | `src/data/casos.js` |
| 2 | `src/data/abertura.js` |
| 3, 15 | `src/data/seed.js` |
| 4 | `src/data/localidades.js` |
| 5, 6 | `src/data/cartas.js` |
| 7 | `src/data/dialogos.js` |
| 8 | `src/data/confrontos.js` |
| 9 | `src/data/ecos_mestre.js` |
| 10 | `src/data/ecos_interferencia.js` |
| 11, 12 | `src/data/glossario.js`, `src/data/rotulos.js` |
| 13 | `src/logic/monologo.js` |
| 14 | `src/logic/epilogo.js` |

Não incluído neste roteiro (fora do escopo desta consolidação, por decisão
do usuário): o banco de casos gerados proceduralmente (`src/data/
casos_gerados.js`, ~80 mil linhas — a vila, o elenco e os vestígios de cada
caso da comarca nascem da simulação em tempo de build, não de prosa
autoral).
