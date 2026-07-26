# A Hora Emprestada — Roteiro Completo (Modo Tutorial / Vertical Slice)

> Documento **não normativo**: extração literal de todo o texto do caso-escola
> "A Hora Emprestada" a partir do código-fonte (`src/data/*.js`,
> `src/logic/monologo.js`, `src/logic/epilogo.js`, `src/components/MuralAcusacao.jsx`
> e componentes de `src/components/mural/`). Serve como roteiro de consulta —
> todos os diálogos, toda a prosa das localidades, todas as cartas, os quatro
> desfechos e o mural de acusação, palavra por palavra. Não rege o jogo; quem
> rege é o próprio código e `MORTEM_CONTEXTO.md`. Gerado em 26/07/2026.
>
> **Convenções preservadas do original:** `[[id_da_carta]]` marca o termo
> clicável cujo clique extrai a carta correspondente (o texto da carta está
> listado no Catálogo de Cartas, §7, pelo mesmo id); `{detective.campo}` e
> `{g:masculino|feminino}` são interpolações resolvidas em jogo pelo nome e
> pronome do detetive escolhido (neste tutorial, sempre Harlan Blackwell,
> tratamento "senhor").

---

## 1. Ficha do caso (a Verdade de Ouro — nunca mostrada ao jogador)

- **Vítima:** Sr. Geoffrey Arthurs, relojoeiro, 61 anos.
- **Réu correto:** Silas Crane.
- **Mecanismo:** ferida por arma branca.
- **Instrumento:** buril gravador.
- **Motivação:** silenciamento (a fraude do ouro descoberta).
- **Hora da morte:** 21h00 de sexta, 13 de outubro de 1893 (16 horas antes da chegada do perito, às 13h de sábado, 14 de outubro).
- **Cena encenada:** sim — o relógio da lareira foi recuado para 08h45 e esmagado, simulando um assalto de madrugada.
- **Resumo (uma linha):** o primeiro-oficial Silas Crane, com doze anos de casa, vinha trocando ouro dos consertos por metal vil; descoberto na sexta, matou o mestre às 21h com o próprio buril e encenou um roubo alheio — o relógio da lareira, recuado para 08h45 e esmagado, é a hora emprestada que dá nome ao caso.

**Periféricos (o veredicto esperado sobre cada um):**
| Suspeito | Veredicto esperado | Segredo |
|---|---|---|
| Walter Arthurs | Inocente — guarda segredo | súplica recusada (pediu adiantamento ao tio e foi recusado aos gritos) |
| Sra. Agnes Rooke | Inocente — guarda segredo | noivado secreto com a vítima |
| Caleb Grey | Inocente — paradeiro firmado | nenhum |
| Davey Tull | Inocente — paradeiro firmado | nenhum |

---

## 2. Elenco (suspeitos)

**Silas Crane** — 47 anos. *Primeiro-oficial da relojoaria há doze anos; achou o corpo.*
Mãos quietas, avental de couro, fala mansa de bancada. Oferece teoria sobre o ladrão a quem não pediu nenhuma.

**Walter Arthurs** — 44 anos. *Sobrinho e único herdeiro; negociante de Moorford.*
Colarinho de negociante e botas gastas. Explica-se antes de acusado e cita credores pelo nome, como quem confere uma lista.

**Sra. Agnes Rooke** — 58 anos. *Viúva, dona da loja e correio da High Street.*
Meio-luto rigoroso, broche de azeviche. Responde o que se pergunta, nem uma palavra além, e mede o visitante por cima dos óculos.

**Caleb Grey** — 46 anos. *Moleiro; na sexta-feira, devolveu à loja um conserto com queixa formal.*
Pó de farinha nas costuras e a queixa na ponta da língua. Repete a soma do prejuízo sem errar um xelim.

**Davey Tull** — 15 anos. *Aprendiz da relojoaria há dois anos.*
Magro, atento, o olho no que as mãos dos outros fazem. Responde depressa; perguntado de novo, não muda uma palavra.

---

## 3. Ato 0 — A Abertura (9 passos)

### Passo 1 — "Descoberta": Briarstone, sábado, 14 de outubro de 1893

A relojoaria Arthurs esteve fechada desde a noite de sexta. Na manhã de sábado é Silas Crane, o oficial da casa, quem abre: tira as tábuas da vitrine com o aprendiz, acende o fogo da bancada e põe-se ao serviço na oficina, como faz todas as manhãs. O Sr. Arthurs não desce.

Às nove e vinte, o oficial deixa a bancada e vai ao escritório dos fundos. Dá dois passos para dentro e para. Fica ali.

Volta ao corredor e diz, da soleira da rua: "Corre ao posto. Diz ao guarda Wycliffe que venha já."

O rapaz corre. O oficial senta-se no degrau da loja, de costas para dentro, as mãos sobre os joelhos, e ali fica até o guarda dobrar a esquina.

*(botão: "Caulfield, na mesma manhã")*

### Passo 2 — "Caulfield": sábado, 14 de outubro de 1893

A pensão da Sra. Potts cobra dois xelins por semana e entrega dois xelins: um quarto estreito, meia vela, uma garrafa vazia e o jornal de anteontem dobrado sobre a mesa.

Sobre essa mesa, {detective.surname} dispõe os instrumentos do Dr. Abbot: a lente e o termômetro de mercúrio com a trinca no vidro. A caderneta de capa rachada, essa é {g:dele|dela}; vem por último, aberta na última página usada: "Sra. Ellen Parry, 71 anos. Queda na escada. Fratura cervical. Morte natural." Fechada.

*(pensamento de Harlan):* Já imagino o velho dizendo: "Não era isso que queria, jovem?" E tenho de admitir, a raposa tem razão. Se soubesse jogar cartas como sabe fugir de usurários e de trabalho, não precisaria mandar aprendizes examinar mortos de aldeia.

*(botão: "A manhã avança")*

### Passo 3 — "Batem à porta"

A Sra. Potts não espera resposta: entra a limpar as mãos ao avental e, na outra, um formulário pardo dobrado sobre um envelope gordo. Pousa os dois sobre a mesa.

"Este veio da estação agora mesmo, do Dr. Abbot para {g:o senhor|a senhora}, urgente, disse o rapaz. O outro veio a cavalo, e o homem perguntou pelo Dr. Abbot na estação; mandaram-no cá." Fica onde está, o olhar nos dois papéis, no rosto {g:do hóspede|da hóspede}. Vira o de baixo entre os dedos, lendo o remetente. "Briarstone. Então mataram alguém por lá."

*(botão: "Ler o telegrama")*

### Passo 4 — "O telegrama do Dr. Abbot"

*(apresentado no impresso do Post Office, Form A1)*

O formulário pardo traz a letra do telegrafista da estação, copiada do fio: maiúsculas apertadas, o selo do Post Office no canto.

"SR BLACKWELL PENSAO POTTS CAULFIELD. CHAMADO DE BRIARSTONE. RELOJOEIRO MORTO LOJA REVIRADA. PROVAVELMENTE BRIGA DE TABERNA OU GATUNO. O CORONER HA DE ORDENAR O EXAME EM MEU NOME. VA OLHE O CORPO MANDE RESUMO PELO PRIMEIRO CORREIO. NAO ASSINE NADA. ABBOT"

*(pensamento):* Provavelmente. A palavra preferida do Dr. Abbot para tudo que lhe dá trabalho. Provavelmente não é nada, provavelmente é morte natural, provavelmente o rapaz resolve. A vila fica a uma estação daqui; ele, a quatro condados de distância, onde nenhum usurário o procure. Não era isto que eu queria, mas era o que estava no preço.

*(botão: "Abrir o envelope de Briarstone")*

### Passo 5 — "A ordem do coroner"

*(impresso do condado: texto de fôrma com os claros preenchidos à mão)*

O envelope traz dois papéis. O de cima é impresso, do condado: texto de fôrma com claros deixados em branco, e os claros preenchidos à mão, na letra que virá a assinar o outro papel.

CONDADO DE ——. INQUÉRITO SOBRE A MORTE DE Geoffrey Arthurs, relojoeiro, da vila de Briarstone.

Havendo eu, Bramwell Foy, coroner de Sua Majestade para este condado, recebido notícia de morte violenta ou não natural, e sendo meu ofício inquirir dela na forma do Ato dos Coroners de 1887, fica o Dr. Abbot, praticante legalmente habilitado e inscrito, requisitado a examinar o dito corpo e a comparecer perante mim e o júri para depor do que apurar.

Pelo exame e pelo depoimento serão pagas duas libras e dois xelins, na forma do mesmo Ato.

O inquérito abre na segunda-feira, dia dezesseis de outubro, às dez horas da manhã, na estalagem The Wheatsheaf, em Briarstone.

(assinado) Bramwell Foy, coroner. Cópia do telegrama, lavrada no posto de Briarstone.

*(pensamento):* Duas libras e dois xelins pelo exame e pelo depoimento. Quem paga é o coroner, e o coroner requisita o médico que lhe consta em lista: o Dr. Abbot, legalmente habilitado e inscrito. Quem vai pôr as mãos no corpo sou eu.

*(botão: "Ler a carta do guarda")*

### Passo 6 — "A carta do Guarda"

O segundo papel vem lacrado, com o brasão gasto de uma repartição prensado torto na cera vermelha. A cera racha sob o polegar. O papel é grosso, de bom fornecedor; a letra inclina-se para a direita, firme no começo de cada linha e mais corrida ao fim dela.

"Senhor — Escrevo-lhe na qualidade de guarda de Briarstone e na condição, que não me envergonho de confessar, de homem posto fora da sua profundidade. O Sr. Geoffrey Arthurs, relojoeiro desta vila e homem que nunca me deu trabalho, foi achado morto esta manhã no escritório dos fundos da sua loja, com a garganta aberta e a casa toda revirada."

"Cumpri o que me toca cumprir: não toquei em nada, mandei que nem uma cadeira saísse do lugar, pus um homem à porta e dei notícia da morte ao senhor coroner do condado, pelo telégrafo, na primeira hora. Ao senhor telegrafei também, e teve a bondade de me responder onde parava o seu assistente."

"O senhor coroner nomeou-o da lista dos médicos e baixou a ordem antes do meio-dia; a mim tocou lavrá-la no impresso e pô-la a caminho. O original virá por mão dele. É por isso que mando homem a cavalo a Caulfield, e não pelo correio de segunda-feira. Venha, peço-lhe, pelo primeiro trem que o traga a nós. Perdoe a letra: escrevo de pé, e a mão ainda não me voltou ao sossego."

"Sou, senhor, seu criado obediente. Obedientíssimo, devia eu escrever, que é o que se deve a um médico. — Lemuel Wycliffe, guarda de Briarstone."

*(pensamento):* A garganta aberta. Não é queda na escada, não é bêbado de taberna. O guarda escreveu ao Dr. Abbot, e o Dr. Abbot mandou a mim.

*(botão: "Aceitar o chamado")*

### Passo 7 — "A mesa se transforma"

A garrafa vai para o chão, o jornal para o fogo. A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta na primeira página em branco.

{detective.surname} veste o casaco ainda úmido da véspera e desce para a estação.

*(pensamento):* Segunda-feira às dez, no salão de uma estalagem, doze homens jurados hão de dizer de que morreu o Sr. Arthurs. Entre hoje e segunda há o resto de um sábado e um domingo.

O Dr. Abbot mandou não assinar nada. A garganta aberta, a loja revirada, o homem à porta: e o Dr. Abbot mandou não assinar nada. O trem não espera, e o velho não virá.

*(botão: "Tomar o trem")*

### Passo 8 — "Briarstone"

A plataforma cheira a carvão e a palha molhada de chuva. Além dos trilhos, Briarstone estende-se numa única rua, e a luz de outubro bate rasa nos telhados e deixa a calçada meio na sombra, meio no sol.

Os sinos da igreja dão a hora num extremo da rua; um cão responde do outro. A meia rua, uma vitrine tem a cortina corrida por dentro, e à porta dela um homem moço mantém-se de mãos cruzadas às costas, o rosto sem cor.

O guarda Wycliffe espera junto ao portão. Os olhos vão do rosto de {detective.surname} ao trem que se afasta, à plataforma que se esvazia. Ninguém mais desceu.

"O Dr. Abbot não pôde vir, então." "{g:O senhor|A senhora} é…"

"{detective.surname}. Assistente do Dr. Abbot."

Wycliffe mede {g:o rapaz|a moça} dos sapatos ao colarinho. Mas o corpo não espera. Aperta a mão com uma só, breve. "Pois bem, {detective.treatment} {detective.surname}. O Sr. Arthurs está como o encontramos ontem… esta manhã, quero dizer. Venha; explico-me pelo caminho, que a andar me saio melhor."

*(botão: "Ouvir o guarda")*

### Passo 9 — "O relato do guarda Wycliffe" (briefing)

"O essencial é isto: Sr. Geoffrey Arthurs, sessenta e um anos, relojoeiro. Achado morto no escritório dos fundos, sábado às nove e vinte da manhã, por Silas Crane — o oficial dele, homem de doze anos de casa. A porta do beco forçada, o troco do caixa levado, a loja fechada desde a noite de sexta, dia 13."

Detém-se diante da relojoaria e baixa a voz. "Pergunte o que quiser antes de entrarmos. O Dr. Abbot haveria de querer ver a cena primeiro; suponho que {g:o senhor|a senhora} saiba o que procurar."

*(botão: "Entrar — iniciar a investigação")*

### As quatro perguntas do briefing (custo zero)

**"O que se sabe sobre a hora da morte?"**
"Aí é que a sorte nos ajuda: na confusão, o relógio da lareira veio ao chão e parou num quarto para as nove. E o moço do padeiro viu luz na oficina às cinco e pouco da madrugada. Vivo às cinco, morto antes das nove e vinte — o ladrão mal teria virado a esquina. É o que eu penso, veja bem. O que {g:o senhor|a senhora} pensar, com o corpo à frente… bom, o que o Dr. Abbot pensaria."

**"Quem herda com essa morte?"**
"O sobrinho, Walter Arthurs, negociante em Moorford — parente único, herdeiro único. O testamento está nos meus arquivos, e junto dele umas cartas de cobrança que {g:o senhor|a senhora} talvez queira ler. Digo só isso; não me cabe temperar a sopa antes do cozinheiro. Ou do ajudante do cozinheiro, no caso."

**"O morto tinha desafetos declarados?"**
"De véspera, por sinal: Caleb Grey, o moleiro, esteve na loja sexta à tarde devolvendo um conserto, aos brados, e ainda me bateu à porta para lavrar queixa. E um carroceiro veio me contar de outros gritos na loja, ao cair da mesma tarde. Sexta movimentada, para um homem que morreu nela… isto é, que pode ter morrido no sábado, como diz o relógio. {g:O senhor|A senhora} me entende."

**"Quem vivia ou trabalhava com a vítima?"**
"Viúvo, sem filhos; morava sobre a própria loja. Na oficina, dois: Silas Crane, o oficial que o achou, e o aprendiz, o rapazinho Tull. Fora isso, a vila — e a Sra. Rooke, da loja e correio em frente, que era das poucas visitas que o velho recebia."

### Seleção de personagem

**Harlan Blackwell** — Assistente do Dr. Abbot há dois anos; sem registro, sem laudo próprio. O que tem é o olho treinado do mestre e um termômetro emprestado com uma trinca que "não afeta a leitura".

---

## 4. O mapa e o custo de viagem

Grupos: **a relojoaria** (a loja inteira e a saleta, mesmo prédio — 0h entre sub-locais), **a vila** (posto do guarda, estalagem, loja da Sra. Rooke, moinho, torre — 1h entre prédios), **fora** (Moorford — 1,5h por trecho, 3h ida e volta).

Nós abertos desde o início: A Relojoaria, A Saleta (interrogatório de Silas), O Posto do Guarda, A Estalagem, A Loja da Sra. Rooke, O Moinho, A Torre de S. Miguel.

Nó que só se revela por lead: **Gabinete Pettigrew** (Moorford) — desbloqueia ao extrair `dep_testamento` ou `ev_livro_ordens`.

---

## 5. As localidades — prosa completa

### 5.1 A Relojoaria — High Street, nº 7 (Sr. Geoffrey Arthurs, relojoeiro, 61 anos)

#### Sub-local: O Corpo (Escritório dos Fundos)

Gestos disponíveis: **Voltar o corpo** → extrai `ev_livores`; **Dar corda ao relógio do morto** → extrai `ev_relogio_bolso`; **Abrir o fundo da caixa do relógio** → extrai `ev_cuvette`.

O morto jaz de costas entre a escrivaninha e a estante, o colete abotoado, a gola dura manchada de escuro. O guarda Wycliffe mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.

Ao primeiro exame do tronco e dos membros, [[ev_rigor]]. O homem de guarda espera a ordem para voltar o corpo.

Sob o ângulo esquerdo do maxilar abre-se uma [[ev_ferida]]. Afastado o colarinho, mostram-se [[ev_reacao_vital]]; à lente, no fundo do canal, [[ev_residuo_ferida]].

Na corrente do colete pende um relógio de bolso de tampa fechada, mudo. A maleta de instrumentos está aberta sobre a cadeira; o termômetro de mercúrio fica à mão, se {detective.treatment} {detective.surname} julgar oportuno medir a temperatura do corpo.

#### Sub-local: A Cena do Crime (Escritório dos Fundos)

O escritório dos fundos guarda o revirado da manhã em que o acharam: papéis pelo assoalho, a poltrona de couro empurrada para longe da escrivaninha. A luz de outubro entra de esguelha pela janela alta e assenta na poeira em suspensão; cheira a óleo fino de relojoeiro e à cinza fria da lareira.

Num cabide atrás da porta estão pendurados um sobretudo escuro e um chapéu-coco. Sobre a repisa, um retângulo sem poeira marca o lugar onde alguma coisa esteve.

**Ponto: A lareira** (gesto: *Contar os entalhes da roda* → extrai `ev_maquinismo`)
No tapete, a meio caminho da lareira, o [[ev_relogio_lareira]] jaz de borco. Da porta, sem pôr o pé para dentro, Wycliffe aponta-o com o queixo: "A peça, {detective.treatment}. É dela que a vila inteira fala." A caixa cedeu de um lado e escancarou o mecanismo até a roda de contagem. Na repisa, um cachimbo de barro pousado de lado; na grelha por raspar, [[ev_cinza_livro]].

**Ponto: A escrivaninha**
A escrivaninha está de través, uma gaveta meio puxada, o tinteiro seco e a pena atravessada no mata-borrão. Um par de óculos de aros finos repousa dobrado sobre o livro-razão aberto, ao lado de uma lupa de relojoeiro presa a um cordão; a servir de marca de página, um [[ev_bilhete_vigario]]. Ao pé da escrivaninha, no cesto de vime, entre aparas e um sobrescrito rasgado, uma [[ev_suplica_cesto]].

#### Sub-local: A Loja da Frente

**Ponto: A vitrine e a porta do beco**
A loja da frente fica para além do vão do escritório. Ali, contra a parede, [[ev_vitrine]]. Junto à porta acanhada que dá para o beco, na moldura do trinco, [[ev_fechadura]].

#### Sub-local: A Copa

**Ponto: A copa**
Nos fundos, uma copa apertada: a chaleira fria no fogareiro, a pia com um resto de água parada, um pano de prato no gancho. Na bandeja estão duas xícaras: uma com o fundo de chá seco, a outra emborcada e limpa; a lata de chá aberta, a colher ainda dentro. Sobre a bancada de pedra, encostada à parede, uma [[ev_cesta_rooke]].

#### Sub-local: A Oficina (Davey Tull, aprendiz, 15 anos)

A oficina ocupa os fundos da loja: duas bancadas de tampo raspado, um torno pequeno aparafusado à ponta de uma delas, a parede coberta de ferramentas penduradas em ordem de tamanho. Sob a redoma, ao canto da bancada grande, a balança de fiel do ouro, com a caixinha dos pesos ao lado. A limalha de latão presa ao tampo e o gume das limas penduradas guardam o brilho raso da janela alta.

Junto à porta dos fundos, um cesto de vime guarda encomendas embrulhadas em papel pardo, cada uma com etiqueta de nome e vila de fora, para o carreteiro da semana. Um pêndulo comprido e rodas de mecanismo maior que os de sala esperam numa tábua à parte, ao lado de um bilhete da conserva anual do relógio da torre da paróquia.

No gancho da bancada grande, o lampião de bancada está apagado. O depósito, seco; a chaminé de vidro, fumada até a boca.

Na bancada menor, aberto para conserto, um relógio de lareira irmão do da cena mostra o trem das badaladas a descoberto; a cada hora que a máquina bate, a alavanca salta um entalhe da roda de contagem. Cheira a óleo e ao carvão frio do fogareiro.

**Ponto: A prateleira de gravar**
A prateleira das ferramentas de gravar corre sobre a bancada menor: buris de vários feitios, dois punções de letra, um vidro tampado de pó de polir. Ao canto, um frasco de óleo fino pela metade, a rolha ao lado e um pano de linho manchado de dedadas. No meio deles, de tampa fechada, o [[ev_estojo_buril]].

**Ponto: A escrivaninha das ordens**
A um canto, uma escrivaninha alta de tampo inclinado, o couro gasto onde o braço se apoia. No rebordo plano do topo, um tinteiro e um espeto de arame; no espeto, uma pilha de recibos furados, o de cima datado de sexta na mesma letra miúda. Na prateleira de baixo, entre o mata-borrão e a caixa de bicos de pena, o [[ev_livro_pagamentos]] está de capa fechada. Aberto sobre a inclinação, o [[ev_livro_ordens]].

**Ponto: A gaveta funda**
Sob a bancada grande corre uma fileira de gavetas; a mais funda range ao abrir e cheira a metal e a graxa velha. Dentro, sob um retalho de camurça, junto a molas soltas e a um envelope de peças, um [[ev_anel_encomenda]].

*(Davey conversa em diálogo próprio — ver §6.5)*

#### Sub-local: A Porta do Beco

Existe para a topologia do mapa; sem prosa própria (nó sem carta, sem sala clicável).

---

### 5.2 A Saleta — Interrogatório de Silas Crane

Nó de diálogo puro — ver §6.1.

---

### 5.3 O Posto do Guarda — A Sala da Frente (Guarda Lemuel Wycliffe)

O posto de Briarstone é a sala da frente da casa do guarda: mesa de tábua, duas cadeiras e uma cômoda de cozinha em que o arquivo da vila ocupa as gavetas da roupa. Cheira a tinta e a turfa. Wycliffe abre-as sem cerimônia: "O que é meu é {g:do senhor|da senhora}, {detective.treatment} {detective.surname}. Papel, aqui, nunca faltou; imaginação é que não temos."

Entre os papéis do morto, recolhidos por precaução, está o [[dep_testamento]] e, presas a ele por um alfinete, [[dep_dividas_walter]].

No livro de ocorrências, com a tinta de ontem, uma [[dep_queixa_grey]]; na página de sábado, os [[dep_briga_walter]] que um carroceiro veio contar por conta própria.

Do registro da ronda consta a [[dep_visto_vivo]], na letra redonda do guarda Tobin. "Tobin faz a ronda de Caulfield e desce a nossa rua às oito, que é onde as duas se encontram… isto é, onde a dele acaba e a minha ainda não começou. Passa e segue. O que vê pelo caminho lavra no livro dele e copia no meu, e eu faço o mesmo com o que vejo do meu."

Wycliffe guarda para o fim os relatos da manhã: a [[dep_avistamento_padeiro]] — "se havia luz àquela hora, havia homem aceso dentro dela, digo eu" — e o de uma vizinha, [[dep_mulher_viela]]. "A senhora da viela não me tira o sono. A luz das cinco, essa me arruma o caso: ladrão de madrugada, relógio parado nas quase nove, caixa vazada. O palpite é meu; a perícia, essa, é {g:do senhor|da senhora}."

---

### 5.4 A Torre de S. Miguel (Amos Kell, sineiro da paróquia, 63 anos)

S. Miguel fecha o extremo da rua, do lado oposto à estrada de Moorford. A porta da torre dá na câmara dos toques, caiada e de teto baixo: seis cordas descem por buracos no forro e ficam enroladas nos ganchos até domingo, as manoplas de lã ao alcance da mão.

Num prego, o registro dos toques; ao lado, a tabela da conserva do relógio, assinada de ano em ano em letra miúda. Amos Kell passa breu na ponta de uma corda e não ergue os olhos.

Perguntado da noite de sexta, prende a corda ao gancho e conta: [[dep_sineiro_beco]].

Da câmara sobe uma escada de caracol, primeiro ao maquinismo do relógio, com os pesos pendurados no poço, e depois à câmara dos sinos. São seis, na armação de carvalho, e Amos numera-os sem se voltar para a escada.

"Do mais leve ao mais pesado, senhor, que é como se contam. O primeiro abre o repique; o sexto dá a hora à rua. Os do meio, só quem toca os separa. Estão todos de boca para baixo até amanhã; amanhã é domingo, e estes seis trabalham desde as oito." A corda volta às mãos.

**Prosa condicional** (só entra se `ev_cuvette` já estiver na mesa):
Sobre a armação, de quatro sobre as vigas, alcança-se o quarto cabeçote. No barrote fronteiro, de frente para o vão que o cabeçote de olmo deixa livre, uma chapa de latão de charneira fecha um vazio do tamanho de uma mão, presa por uma trava de cabeça serrilhada. A trava não cede para a direita. Meia-volta para a esquerda, e a chapa gira; dentro, embrulhado em oleado, o [[ev_livro_ii]].

---

### 5.5 A Estalagem — The Wheatsheaf (Walter Arthurs, hóspede do quarto nº 3)

The Wheatsheaf tem pátio de carroças e um livro de hóspedes gordo de anos. Walter Arthurs está hospedado no quarto nº 3; desce à sala a um recado.

O estalajadeiro empresta o [[ev_registro_estalagem]] sem fazer perguntas, e responde às que lhe fazem: [[corrob_estalajadeiro]].

*(Walter conversa em diálogo próprio — ver §6.4)*

---

### 5.6 A Loja da Sra. Rooke — a Loja e Correio da High Street

Nó de diálogo puro — ver §6.2.

---

### 5.7 O Moinho de Briarstone (Caleb Grey, moleiro, 46 anos)

Nó de diálogo puro — ver §6.3.

---

### 5.8 Gabinete Pettigrew (Moorford — hora e meia de estrada)

Hora e meia de estrada, e o gabinete cheira a couro e lacre. O procurador Pettigrew já soube da morte; pousa os óculos e espera as perguntas de mãos cruzadas.

Sobre o relojoeiro, entrega o que tem: [[corrob_pettigrew]]. "Guardo papéis, {detective.treatment}; opiniões, procuro não guardar."

---

## 6. Diálogos de interrogatório — árvores completas

Cada suspeito tem um hub (abertura) com quatro opções de tom (firme, cordial, técnico, oblíquo) que levam ao Beat 1 (o álibi/paradeiro); do Beat 1 saem outras quatro opções de tom para o Beat 2 (o retrato/caracterização); do Beat 2 saem quatro opções de tom para o Beat 3 (a pressão — o que a morte muda para quem ficou), que é terminal (sem novas opções). Confrontar uma prova específica (quando coletada) abre uma reação própria fora da árvore principal, e a conversa retoma de onde estava. Qualquer termo fora do roteiro cai na "evasiva".

### 6.1 Silas Crane — A Saleta

**Abertura:**
Silas Crane recebe na saleta, o avental de couro dobrado sobre o braço. Traz chá sem que se peça e senta-se na beira da cadeira, as mãos quietas sobre os joelhos.

"Com licença de dizer, {detective.treatment}, {g:o senhor|a senhora} há de perdoar a casa: doze anos de bancada ao lado do Sr. Arthurs e nunca a vi assim parada. Acendia eu o fogo mal abria a loja, e ele descia ao cheiro do carvão; hoje acendi o fogo como sempre, e ninguém desceu."

Opções: *"Onde esteve na noite de sexta. Sem rodeios."* (firme) · *"Conte-me da sexta com calma; o senhor conhecia bem a casa."* (cordial) · *"A sexta-feira, os seus passos, hora a hora."* (técnico) · *"Ficou até tarde na oficina, na sexta?"* (oblíquo)

**Beat 1 — o álibi** (sustenta `alibi_silas` em todo tom; a lasca de vidro `ev_vidro_dobra` nasce nos quatro tons, com prosa própria):

- *Firme:* Silas Crane não se move na beira da cadeira. "Sem rodeios, então." "Fechei a oficina às sete e meia e saí com o rapaz até a esquina. Ceei pouco, subi ao quarto às oito e dali não tornei a sair. De manhã abri a loja, como abro sempre." As horas vêm em fila, na ordem em que as viveu, e ele não procura nenhuma: [[alibi_silas]]. Ditas as horas, ergue-se para tornar a encher a xícara e logo volta à beira da cadeira; no instante de pé, a luz do lampião acha na bainha esquerda uma lasca miúda: [[ev_vidro_dobra]].
- *Cordial:* "O {detective.treatment} é gentil, e eu respondo de bom grado; nesta casa a gente vive pelas horas." "Sete e meia, fechada a oficina, e saímos os dois. Ceei pouco e recolhi-me ao quarto às oito; do quarto não tornei a sair antes de clarear. De manhã abri a loja, como sempre." Devolve cada hora no seu lugar, com a cortesia de quem paga um favor: [[alibi_silas]]. Ajeita então a calça sobre o joelho, ao costume de quem se senta o dia inteiro; a bainha esquerda sobe da botina, e nela reluz uma lasca: [[ev_vidro_dobra]].
- *Técnico:* "Hora a hora eu digo, que é como se leva uma bancada." "Fechei às sete e meia, com o rapaz até a esquina. Ceei pouco e subi ao quarto às oito, e dali não desci mais, que dormi. A loja tornei a abri-la às sete, como abro sempre." As horas vêm sem que ele as procure: [[alibi_silas]]. A pedido, chega a cadeira para junto do lampião, para que as horas passem ao papel, e a ergue em vez de arrastá-la; à claridade de perto, antes que ele torne ao seu lugar, aparece na bainha esquerda uma lasca fina: [[ev_vidro_dobra]].
- *Oblíquo (ressonante):* "Até tarde, não; casa de relógio fecha cedo." "Sete e meia estava a oficina fechada e eu na rua com o rapaz. Ceei pouco e subi ao quarto às oito, e não tornei a descer. De manhã abri a loja." Responde sem se apressar, e as horas saem já postas, uma atrás da outra: [[alibi_silas]]. Ao cruzar as pernas para trás, deixa ver, presa à bainha esquerda, uma lasca que a luz do lampião acende: [[ev_vidro_dobra]].

Opções após o Beat 1 (as quatro, iguais em todos os tons): *"O senhor sabe quem fez isto. Diga."* (firme) · *"Quem, na vila, seria capaz de uma coisa assim?"* (cordial) · *"Aponte-me um nome, e a razão dele."* (técnico) · *"A loja guardava dinheiro à noite?"* (oblíquo)

**Beat 2 — a teoria do ladrão de fora** (sustenta `comp_silas` em todo tom):

- *Firme:* As mãos não deixam os joelhos. "Não sei nome, {detective.treatment}, e não hei de inventar um para agradar." "O que penso, penso desde esta manhã: gente de fora, da estrada, que forçou a porta do beco atrás do troco do caixa." Os dedos abrem-se um instante sobre o pano do joelho e tornam a fechar-se: [[comp_silas]].
- *Cordial:* "Doze anos nesta casa: abro eu a loja, tiro as tábuas da vitrine, acendo o fogo da bancada, e o Sr. Arthurs descia depois, com os óculos na mão. Foi no escritório dos fundos que o achei, às nove e vinte, caído entre a escrivaninha e a estante." Baixa a voz. "Gente da estrada, é o que eu penso; eu bem lhe dizia que recolhesse o caixa ao cofre, e ele ria de mim." E torna a erguê-la para o que vem depois: [[comp_silas]].
- *Técnico:* "Um nome eu não firmo sem prova, {detective.treatment}; a perícia é sua." "A razão, essa eu dou, que é de senso: uma vila destas não tranca bem as portas, e caixa aberto à noite chama gente da estrada. Entra pelo beco, que a porta dos fundos é fraca, e sai por onde entrou." Dá a razão de corrida, e a mão não larga o joelho: [[comp_silas]].
- *Oblíquo:* "O caixa? Ficava na loja, e eu bem dizia ao Sr. Arthurs que o recolhesse ao cofre — homem velho tem os seus costumes." As mãos seguem sobre os joelhos. "Quem passa na estrada sabe ler uma vitrine, {detective.treatment}, e sabe que loja de vila guarda o troco na gaveta. É por aí que eu penso a coisa." Ninguém lhe perguntou o que pensava: [[comp_silas]].

Opções do Beat 3 (perguntas fixas por suspeito): *"E o senhor, do que vive na segunda-feira?"* (firme) · *"Doze anos de casa. Como fica o senhor agora?"* (cordial) · *"O serviço atrasado da bancada: quem responde por ele?"* (técnico) · *"A loja reabre quando?"* (oblíquo)

**Beat 3 — a pressão** (sem carta nova; rende só a "alfinetada" abaixo):

- *Firme:* "Da bancada, como vivi até sexta. Há peça entregue por cobrar e peça por acabar; enquanto a casa não se resolver, é esse o serviço. O rapaz veio hoje de manhã, como vem sempre, e ficou comigo à porta."
- *Cordial:* "Doze anos, sim." Olha o avental dobrado sobre o braço antes de responder. "Fico com o que sei fazer e com uma loja que nunca foi minha. Há de vir o sobrinho mandar, e eu hei de esperar que mande."
- *Técnico:* "O atraso está no livro, e o livro está na bancada." Enumera sem procurar. "Enquanto não vier procurador dizer o contrário, responde o oficial da casa, que sou eu. O que sai daquela porta sai anotado."
- *Oblíquo:* "Reabrir depende de quem manda, e quem manda já chegou sem mandar nada. Por mim, abria na segunda: freguês que deixou peça não tem culpa do que houve. Mas casa de defunto tem os seus dias."

**Alfinetada de Silas** (rendimento por nível de exposição, não por tom):
- *E1:* Responde e não emenda. A xícara do visitante fica pelo meio, e ele não estende a mão ao bule.
- *E2:* "O {detective.treatment} andou perguntando de mim pela vila." Não é pergunta, e ele não espera resposta. As mãos deixam os joelhos, e ele alisa o avental dobrado sobre o braço, do vinco para fora. "Perguntem. A bancada está à vista de quem a queira conferir." E torna à teoria de sempre, mais curta desta vez: gente da estrada, atrás do caixa.

**Confrontos disponíveis** (só aparecem com a carta correspondente na mesa):
- *[O Quarto Cinco às Escuras] Por que a estalagem conta o seu quarto às escuras às nove?* (requer `corrob_estalajadeiro`) → Posto diante do que se conta na estalagem — o quarto às escuras às nove, o portão passado das dez —, Silas Crane pousa o bule sem ruído. "O estalajadeiro terá contado os quartos errados. A casa é grande, e a noite foi de movimento. Doze anos sem uma falta, {detective.treatment}; não é agora que hei de trocar as minhas horas." Dá a resposta no mesmo passo das outras e torna a erguer o bule.
- *[Livro de Ordens de Serviço] Por que três consertos voltaram com a sua rubrica?* (requer `ev_livro_ordens`) → Posto diante do livro — os três consertos reentrados com queixa, a rubrica "S.C." em cada um, e na última entrada a letra do morto: "pesar as caixas. Pettigrew, segunda" —, Silas Crane não muda de posição. "Conserto que volta é o pão da bancada, {detective.treatment}. Uma coroa que emperra, uma mola que canta, o cliente traz de novo e a gente refaz. Três num outono é outono ruim, não é mais que isso." Quanto à nota do patrão, aproxima o livro do lampião e corre os olhos pela linha. "A mão dele, sim, miúda assim." Devolve o livro aberto na mesma página.
- *[Vidro na Dobra da Calça] Por que traz vidro de mostrador preso à bainha?* (requer `ev_vidro_dobra`) → Silas Crane olha a lasca sem estender a mão. "Vidro de mostrador, {detective.treatment}, e dos finos. Numa oficina destas parte-se um por semana: a pinça escapa, o aro morde no encaixe, o chão fica com o resto. O rapaz varre toda noite; a bainha apanha o que a vassoura deixa."

**Evasiva** (qualquer carta fora do roteiro): Silas Crane inclina-se sobre a mesa o bastante para ver, e endireita-se. "Com licença de dizer, {detective.treatment}, a minha parte é corda e mola; o que isso valha, sabe a perícia. O que eu penso, já disse: gente da estrada, atrás do caixa."

---

### 6.2 Sra. Agnes Rooke — A Loja e Correio

**Abertura:**
A loja cheira a goma e a papel novo; o balcão reluz de cera. Ao fundo, o postigo do correio e a balança de cartas, com algumas por despachar. Sobre o mostrador, apartado do resto, papel de carta com tarja de luto.

A Sra. Agnes Rooke atende de pé, do lado de dentro do balcão, e mede o visitante por cima dos óculos. Alinha a pilha do papel com tarja sem olhar para ela. "{detective.treatment}." Não oferece cadeira. Espera a pergunta.

Opções: *"A senhora esconde a sua noite de sexta. Onde esteve?"* (firme) · *"Perdão pela hora, minha senhora. A sexta-feira, como a passou?"* (cordial) · *"Preciso do seu paradeiro na sexta à noite."* (técnico) · *"A senhora fecha a loja tarde?"* (oblíquo)

**Beat 1 — o paradeiro** (sustenta `alibi_agnes` em todo tom):

- *Firme:* Ergue o queixo uma linha. "Escondo o que não lhe compete, {detective.treatment}. Da sexta respondo, porque respondo a quem pergunta com direito." "Fechei a loja às seis, corri o ferrolho e subi. Não tornei a descer antes da manhã." Alinha a pilha de cadernos enquanto responde, o lombo de cada um à mesma altura: [[alibi_agnes]].
- *Cordial (ressonante):* Baixa os óculos um instante, e a voz cede um fio. "A hora não me incomoda; a casa está de portas para a lei." "Às seis a loja fecha, e na sexta fechou às seis. Recolhi-me, e uma viúva não tem serões." Responde mais devagar do que na abertura: [[alibi_agnes]].
- *Técnico:* "Paradeiro." Devolve a palavra como quem confere um recibo. "Seis horas: ferrolho corrido. Casa, e nada mais até a manhã de sábado." Nem uma sílaba além do que lhe pedem: [[alibi_agnes]].
- *Oblíquo:* "Fecho quando a rua esvazia; loja não é taberna." O olhar não larga o visitante. "Na sexta a rua esvaziou às seis, e às seis fechei. Subi, e em cima fiquei": [[alibi_agnes]]. Do outro lado da vitrine, a High Street segue com o movimento de sábado.

Opções após o Beat 1 (comuns aos quatro tons): *"O que a vila dizia do Sr. Arthurs?"* (firme) · *"A senhora o conhecia bem, o relojoeiro?"* (cordial) · *"Que negócios tinha com o morto?"* (técnico) · *"Esse papel de luto é para alguém?"* (oblíquo)

**Beat 2 — o morto e a vila** (sustenta `comp_agnes` em todo tom):

- *Firme:* "A vila que responda pela vila, {detective.treatment}; eu respondo pela minha loja." A resposta tem o tamanho exato da pergunta: [[comp_agnes]]. Os dedos ficam abertos sobre o balcão, sem tocar em nada.
- *Cordial:* "O Sr. Arthurs comprava nesta casa o papel de escrituração. Homem pontual." A mão pousa junto ao papel de tarja preta e retira-se logo. "O que a vila acrescente é assunto da vila." Ao nome dele, a voz fica na altura em que estava: [[comp_agnes]].
- *Técnico:* "Negócios: papel de escrituração, à vista, uma vez por mês. Conta paga em dia, vinte anos." Nada além do livro-caixa: [[comp_agnes]]. Ao fundo, o postigo do correio, e na balança de cartas as que ainda hão de sair hoje.
- *Oblíquo:* Segue-lhe o olhar até o papel de luto e endireita a pilha antes de responder. "É papel de venda, {detective.treatment}, como qualquer outro." Daí por diante responde mais seca do que antes: [[comp_agnes]]. Os óculos sobem, e ela mede o visitante por cima deles.

Opções do Beat 3 (fixas): *"O que a senhora perde com esta morte?"* (firme) · *"A vila há de comentar. A senhora tem quem a acompanhe?"* (cordial) · *"A loja abre na segunda?"* (técnico) · *"Esse meio-luto, minha senhora: é por quem?"* (oblíquo)

**Beat 3 — a pressão:**
- *Firme:* "Perco um freguês de vinte anos e o papel de escrituração que ele levava todo mês. Se a pergunta é de dinheiro, está respondida. Se é de outra coisa, faça-a."
- *Cordial:* "Comentar é ofício da vila, e a minha loja fica na rua dela." A mão procura a beira do balcão e ali fica. "Tenho a casa e tenho o balcão. Basta-me."
- *Técnico:* "Abre. Está aberta agora, esteve ontem, e abre na segunda." Confere o postigo do correio antes de continuar. "Encomenda que chega tem dia de sair, e o dia está marcado no livro do correio."
- *Oblíquo:* Ergue os olhos antes de responder. "Do Sr. Rooke, que enterrei. Devia ter deixado o azeviche no fim do prazo, e não deixei. {g:O senhor|A senhora} há de ter outra pergunta."

**Alfinetada de Agnes:**
- *E1:* A pilha fica por endireitar, e a mão pousa na beira do balcão sem tornar a mexer-se.
- *E2:* "{g:O senhor|A senhora} não veio saber a que horas eu fecho." Diz sem levantar a voz e sem largar o visitante dos olhos. "Pois pergunte o que veio perguntar. O que houver de meu nesta vila é meu, e ao Sr. Arthurs não devi xelim nem satisfação." E não torna a tocar no papel de luto.

**Reações a provas:**
- *[Cesta de Ceia para Dois] Por que uma ceia para dois, se a senhora diz que passou a noite só?* (requer `ev_cesta_rooke`) → A Sra. Rooke olha o guardanapo bordado, depois o bilhete, e fica um momento sem falar. "A cesta é minha; o guardanapo também. Ceei com o Sr. Arthurs na sexta, às oito, e saí antes das nove." Torna a dobrar o guardanapo pela dobra antiga. "Menti sobre a minha noite, {detective.treatment}. A razão de eu lá estar é minha, e comigo fica." *(Degrau — se pelo menos 2 de {`ev_anel_encomenda`, `ev_bilhete_vigario`, `dep_mulher_viela`} já estiverem na mesa):* Os papéis ficam onde os puseram, e ela não estende a mão para nenhum. "Então já não é razão minha; é papel de outra gente." Baixa os óculos e não torna a subi-los. "Estávamos ajustados para casar. O primeiro proclama estava marcado para amanhã, e o aro esperava gravação na bancada dele." "Uma viúva de cinquenta e oito anos que se casa com o relojoeiro dá a esta vila conversa para um ano. Preferi o luto ao falatório, e é essa a razão da minha mentira. Não há outra."
- *[Aro de Ouro por Gravar] Por que um aro por gravar com as suas iniciais?* (requer `ev_anel_encomenda`) → Toma a ordem de serviço presa ao aro e lê. Lê outra vez. "Trinta de outubro." Devolve o aro com o papel por cima, dobrado pela dobra que trazia. "Não cheguei a vê-lo. As iniciais {g:o senhor|a senhora} leu; não precisam de mim." Volta-se para o mostrador e endireita, uma a uma, as folhas do papel com tarja de luto.
- *[Uma Senhora na Viela] Por que a viram sair pela viela àquela hora?* (requer `dep_mulher_viela`) → Ouve o relato até o fim sem mover as mãos. "A Sra. Wick não jura, e faz bem: daquela janela não se vê rosto. O passo era meu. Saí pela viela porque a High Street comenta." E depois: "Há mais alguma coisa?"

**Evasiva:** A Sra. Rooke olha o que se lhe apresenta, o tempo de o ler ou de o reconhecer, e torna a erguer os olhos. "Se nisso há pergunta, {detective.treatment}, faça-a."

---

### 6.3 Caleb Grey — O Moinho

**Abertura:**
O moinho trabalha em pleno sábado: sacas na rampa, poeira de farinha na luz da porta, o carroceiro do Finch à espera com a parelha. Caleb Grey passa com uma saca ao ombro e não a pousa para cumprimentar. "Pergunte andando, {detective.treatment}, que a feira não espera defunto."

Opções: *"Pare a saca. Onde esteve na sexta à noite?"* (firme) · *"Sei que é dia de feira; só a sua sexta-feira, e sigo."* (cordial) · *"Sexta à noite: hora e testemunha, se tiver."* (técnico) · *"Trabalha até tarde no moinho?"* (oblíquo)

**Beat 1 — o paradeiro** (sustenta `alibi_grey` em todo tom; no técnico aponta o carroceiro por nome):

- *Firme:* Pousa a saca, mas só até responder. "Parada a saca, parada a feira; seja rápido, então." "Sexta é véspera de feira. Das sete às onze carreguei, com dois jornaleiros e o carroceiro do Finch. Os nomes, anote aí." Torna a erguer a saca antes que a resposta esfrie: [[alibi_grey]].
- *Cordial:* Não pousa a saca, mas afrouxa o passo. "Dia de feira é dia de feira, {detective.treatment}, mas a sexta eu dou." "Das sete às onze, no moinho, a carregar para hoje. Comigo, dois jornaleiros e o carroceiro do Finch, e nenhum deles saiu antes de mim." A resposta vem no vaivém das sacas, sem que ele pare uma vez: [[alibi_grey]].
- *Técnico (ressonante):* A saca desce na carroça antes da resposta. "A sexta?" "Das sete às onze, no moinho: véspera de feira. Comigo, dois jornaleiros e o carroceiro do Finch. Os nomes, anote aí." O vaivém não para enquanto ele dá as horas: [[alibi_grey]]. Aponta com o queixo o homem da carroça. "Um deles está ali. Pergunte agora, se quiser."
- *Oblíquo:* "Moinho fecha com a luz; farinha não mói no escuro." Encolhe o ombro que carrega a saca. "Carregar, isso carrega-se de lanterna, e na sexta carreguei até as onze, que hoje é feira. Estavam comigo dois jornaleiros e o carroceiro do Finch." A saca sobe outra vez ao ombro: [[alibi_grey]].

Opções após o Beat 1: *"O que o morto lhe devia? Diga o número."* (firme) · *"Teve alguma desavença com o relojoeiro?"* (cordial) · *"A sua queixa contra ele: do que se tratava?"* (técnico) · *"Confiava o seu relógio àquela loja?"* (oblíquo)

**Beat 2 — a queixa** (sustenta `comp_grey` em todo tom):

- *Firme:* "Quatro libras e dez xelins, e o conserto pago adiantado." Não pestaneja. "Morto, o homem me deve o mesmo que devia vivo; a queixa está lavrada e de pé." "E se me perguntam se choro, não choro." Diz de frente, e o carroceiro levanta a cabeça: [[comp_grey]].
- *Cordial:* Enxuga a testa com as costas da mão. "Desavença? O relógio caçador do meu pai entrou inteiro naquela loja e voltou mais leve. Não é desavença, {detective.treatment}, é conta." "Fui roubado dentro da loja do homem e ainda paguei o conserto adiantado. Chorar por ele, não choro." Volta às sacas sem esperar a pergunta seguinte: [[comp_grey]].
- *Técnico:* "Exigi pesagem diante de testemunhas e lavrei termo em casa do Wycliffe, tudo antes de o homem morrer; as datas estão no papel. Quatro libras e dez xelins, conserto pago adiantado." A soma sai sem um erro. "Roubado dentro da loja dele, e ainda adiantei o dinheiro. Chorar não choro; cobrar, cobro enquanto houver de quem." A mó troca de compasso atrás dele, e ele espera a pergunta seguinte: [[comp_grey]].
- *Oblíquo:* "Confiei uma vez, e paguei o conserto adiantado por cima." Passa a saca de um ombro ao outro. "Entrou pesado e voltou leve; o resto está em termo lavrado." "Se choro pelo homem? Fui roubado dentro da loja dele. Não choro." O carroceiro do Finch ouve da rampa e não se volta: [[comp_grey]].

Opções do Beat 3: *"O senhor cobra de um morto como cobrava de um vivo?"* (firme) · *"A queixa lhe custou o quê, até aqui?"* (cordial) · *"A queixa lavrada sobrevive ao morto?"* (técnico) · *"Quem pesa o ouro na vila, agora?"* (oblíquo)

**Beat 3 — a pressão** (correção do perito-forense: o processo criminal morre com o acusado; a dívida sobrevive contra quem responder pelos bens):
- *Firme:* "Cobro do espólio, que é o que a lei me deixa." Passa o peso ao outro pé, e a saca acompanha. "Quatro libras e dez xelins não morreram com ele. Quando houver quem responda pelos bens, é a esse que eu cobro."
- *Cordial:* "Custou o dia da lavratura e o caminho até a casa do Wycliffe." Atrás dele a mó troca de compasso. "E custou o relógio do meu pai, que não voltou nem inteiro nem pesado."
- *Técnico:* "Ao homem, já não. Guarda nenhum prende defunto, e disso eu já me fiz a razão." Desce a saca na carroça. "Mas quatro libras e dez xelins são dívida da casa, e dívida a casa paga antes de repartir. Quando houver quem responda pelo espólio, respondo-lhe eu com o papel na mão, e a pesagem que eu pedi continua por fazer."
- *Oblíquo:* "Na vila, ninguém. Pesava ele, e a balança é dele." A farinha assenta-lhe no antebraço. "Para pesar como se deve, é o ourives de Moorford, e Moorford é hora e meia de estrada. Faço o caminho no dia em que me disserem que aquela balança está livre."

**Alfinetada de Grey:**
- *E1:* Não torna à saca seguinte. O carroceiro do Finch chama uma vez, e ele não responde.
- *E2:* "{g:O senhor|A senhora} já sabe disso tudo, então." Bate a farinha de uma mão na outra. "Melhor. Gente que chega sabendo poupa o meu resto de dia." Larga o serviço e fica de frente para responder. "Pergunte o que ainda não sabe, que eu respondo de pé."

**Reações a provas:**
- *[Queixa do Relógio Mais Leve] Por que lavrou queixa contra o morto na véspera?* (requer `dep_queixa_grey`) → Olha o termo de longe. "Minha. Lavrada na sexta à tarde, diante do próprio Wycliffe, e assino outra vez aqui na tábua da rampa, se for preciso." Faz sinal ao carroceiro que espere. "Quatro libras e dez xelins. A queixa fica de pé até se pesar aquele relógio diante de gente."
- *[Livro de Ordens de Serviço] Por que o seu relógio consta neste livro de consertos?* (requer `ev_livro_ordens`) → Limpa a mão na perna antes de tocar o livro. O dedo, branco de farinha, desce a coluna e para. "Este é o meu. O relógio do meu pai, e o preço adiantado somado à margem, da letra do próprio velho." Corre os olhos pelas linhas vizinhas. "Mais dois com queixa no mesmo outono. Eu pensava que o azar era só meu." Empurra o livro de volta pela tábua. "Eu sei o que entrou e o que saiu, {detective.treatment}; quem pôs a mão nele, a loja que diga."

**Evasiva:** Olha por cima da saca, o tempo de dois passos, e encolhe os ombros sem soltá-la. "Disso não sei, e sem papel nem testemunha não juro. Pergunte de farinha, de pesagem ou do que me devem."

---

### 6.4 Walter Arthurs — dentro da Estalagem ("Interrogar Walter Arthurs")

**Abertura:**
Walter Arthurs desce à sala sem casaco, a barba de ontem por fazer, e fica de pé junto ao aparador.

"Soube esta manhã e estou aqui desde então, às ordens de quem as tiver. A casa do meu tio está lacrada; tomei o quarto três. Pergunte-se o que houver, {detective.treatment}, e pergunte-se logo, que negociante parado é dinheiro andando para trás." Enquanto fala, abotoa e desabotoa o botão alto do colete.

Opções: *"Onde esteve na sexta à noite? Pense antes de responder."* (firme) · *"Deve ter sido um dia duro. A sexta, como foi?"* (cordial) · *"O seu paradeiro na sexta, do fim da tarde à noite."* (técnico) · *"Dormiu bem, na sexta?"* (oblíquo)

**Beat 1 — o paradeiro** (sustenta `alibi_walter`, `corroborado: false` — a mentira do carro, em todo tom):

- *Firme:* O botão do colete para entre os dedos. "Pensado está." Endireita-se antes de responder. "Estive com meu tio de tarde, tratamos de negócios, e segui o meu caminho." "Tomei o carro das seis para Moorford e dormi no Station. Soube da desgraça esta manhã e vim no primeiro trem." Alisa o colarinho ao dar as horas: [[alibi_walter]].
- *Cordial (ressonante):* "Duro, {detective.treatment}, é a palavra." Por um instante o botão fica quieto. "Estive com meu tio de tarde, tratamos de negócios, e segui o meu caminho." "Carro das seis, Moorford, e o Station para dormir. Vim de manhã no primeiro trem, e um sobrinho sem casa aberta toma o quarto que houver." O botão volta a girar entre os dedos enquanto ele dá as horas: [[alibi_walter]].
- *Técnico:* "Do fim da tarde à noite. Sim." Conta pelos dedos, como quem alinha uma fatura. "Meu tio de tarde, negócios; depois, o meu caminho." "O carro das seis me pôs em Moorford; o Station lançou-me quarto e ceia na conta, que é como me conhecem lá. Vim no primeiro trem, esta manhã." A mão sobe ao colarinho quando as horas saem: [[alibi_walter]].
- *Oblíquo:* "Dormi o que se dorme numa noite dessas." O botão volta a girar. "Estive com meu tio de tarde, negócios, e segui o meu caminho." "O carro das seis me pôs em Moorford, e no Station me conhecem de outras vezes. Dormi o que se dorme numa cama de estalagem, e de manhã tomei o primeiro trem." Os olhos ficam na porta da sala enquanto as horas saem: [[alibi_walter]].

Opções após o Beat 1: *"Sabe o que a morte do tio lhe traz?"* (firme) · *"Que homem era o seu tio, para o senhor?"* (cordial) · *"Em que pé estão os seus negócios?"* (técnico) · *"Custa dormir a crédito num Station?"* (oblíquo)

**Beat 2 — o tio e os negócios** (sem carta; caracterização):

- *Firme:* "O que a morte me traz? Trabalho e credores, {detective.treatment}, na ordem que quiser. Herdeiro único, sim; e o que herdo é uma loja lacrada, um inventário e juízo pela frente." "Se isso me faz réu aos seus olhos, faça a conta inteira, que a minha lista de credores é mais longa do que qualquer herança."
- *Cordial:* "Meu tio era homem de uma peça. Recolheu-me quando meu pai morreu, pagou-me o colégio, e não me deixou esquecer nem uma coisa nem outra." O polegar corre a barba por fazer. "Achei-o como sempre: são, duro no dinheiro, senhor das suas horas. Quem lhe fez isto que responda, e hei de cobrar eu mesmo, que afinal é o que se espera de um herdeiro, não é assim que dizem?"
- *Técnico:* "Vão mal, e disso nunca fiz segredo. Devo às fazendas, devo ao armazém que anda em juízo, devo até ao Station de Moorford, onde durmo a crédito. A lista é pública e eu a sei de cor." A voz, alta no princípio, acaba quase para dentro. "Da herança falem os outros; eu falo do que devo, que ao menos é meu."
- *Oblíquo:* "Custa, {detective.treatment}, e não é o pior que custa." O botão para. "Um negociante de quarenta e quatro anos que dorme a crédito aprende a não reparar em certas coisas. Perguntou-me da cama; a cama eu tenho. Do resto, pergunte à minha lista de credores, que é longa e verdadeira."

Opções do Beat 3: *"O que o senhor faz com a loja, fechado o inventário?"* (firme) · *"O senhor tem para onde ir, depois disto?"* (cordial) · *"O inventário leva meses. Os seus credores esperam?"* (técnico) · *"Por quanto tempo o senhor paga o quarto três?"* (oblíquo)

**Beat 3 — a pressão:**
- *Firme:* "Vendo a loja, vendo a casa, pago o que devo e fico com o que sobrar. Não tenho mão para relógio nem paciência para bancada, e nunca fingi que tinha."
- *Cordial:* "Tenho Moorford, e em Moorford tenho um armazém em juízo. Meu tio me recolheu quando meu pai morreu. Agora não há quem recolha, e aos quarenta e quatro anos é que vou aprender a coisa."
- *Técnico:* "Não esperam. Nunca esperaram. Testamento a provar leva meses, e casa não se vende sem papel provado; a minha letra mais próxima vence antes do Natal. Hei de pedir prazo com papel de procurador na mão, e é o papel que o credor lê, não a minha cara."
- *Oblíquo:* "O quarto três eu pago com o que trouxe, e o que trouxe cabe no bolso do colete." Abotoa o botão alto e torna a desabotoá-lo. "Enquanto o estalajadeiro me fiar, durmo aqui."

**Alfinetada de Walter:**
- *E1:* O botão do colete para no meio da volta e fica preso entre os dedos até o fim da resposta.
- *E2:* "{g:O senhor|A senhora} já fez a conta antes de entrar." A voz sai alta e não se sustenta até o fim da frase. "Pois estude o resto: um homem que deve às três casas que lhe escreveram não precisa matar ninguém para ser a pior pessoa de uma sala." Larga o botão. "O meu paradeiro já dei. Do que mais {g:o senhor|a senhora} trouxer, respondo sentado."

**Reações a provas:**
- *[Registro da Estalagem] Por que o registro traz a sua assinatura às sete e quarenta?* (requer `ev_registro_estalagem`) → Walter Arthurs lê a própria assinatura e a linha das sete e quarenta. Puxa uma cadeira e senta-se antes de responder. "Não houve carro." A voz sai baixa, e depois as palavras vêm de uma vez. "Vim na sexta pedir dinheiro ao meu tio. Pedido, implorado, a juro de praça e com a palavra que me resta. Ele recusou aos gritos, com a loja ainda aberta." "Tomei este quarto porque àquela hora já não havia carro, e porque naquela noite eu não tinha ânimo de me apresentar em hotel nenhum. Fiquei no três a noite inteira, escrevendo: cartas a ele, cartas a credores. Pedi vela nova pela meia-noite; o caseiro que o diga." "Menti, {detective.treatment}, porque a verdade era esta: um negociante de quarenta e quatro anos à porta do tio, de chapéu na mão, ouvindo não. Depois dos gritos, na loja não tornei a pôr os pés." Depois cala-se, as mãos abertas sobre a mesa.
- *[Carta Amassada em Bola] Por que escreveu ao seu tio pedindo dinheiro?* (requer `ev_suplica_cesto`) → Walter desamassa a folha só até onde a letra aparece e torna a fechá-la pela mesma dobra. "A mão é minha; o pedido, também." Pousa-a na mesa com a escrita para baixo. "Um adiantamento entre parentes se propõe em toda parte, {detective.treatment}, e se lavra no gabinete de um procurador quando aceito. Escrevi-a como se escreve a um credor: com conta, prazo e juro." "Esperava-lhe destino melhor. Meu tio não era homem de responder papéis que o desagradassem."
- *[Testamento do Relojoeiro] Por que é o senhor o herdeiro único?* (requer `dep_testamento`) → "Herdeiro único. Sei o que se soma com isso: negócios em ruína de um lado, loja e casa do outro, e o meu nome no meio. É conta que qualquer credor meu já fez." Puxa o colete para baixo, como quem se compõe para retrato. "Pois faça-se a conta inteira, {detective.treatment}. Meu tio vivo valia-me um adiantamento assinado numa tarde; agora vale-me uma loja lacrada, um inventário e juízo pela frente. Diga-me qual dos dois convinha a um homem com credores à porta." *(Degrau — se pelo menos 2 de {`corrob_pettigrew`, `ev_bilhete_vigario`, `ev_suplica_cesto`} já estiverem na mesa):* Ouve o resto sem estender a mão para a folha que lhe puseram diante. O botão do colete fica onde está. "Sabia." Diz de uma vez, e o resto vem devagar. "Ele me contou na sexta, atrás do balcão, ao cair da tarde. Que ia casar, que ia lavrar tudo de novo na segunda-feira, e que eu me arranjasse. Foi por isso que gritei, e foi por isso que ele gritou. Quem passasse na rua ouviu os dois." "E omiti." Endireita-se na cadeira. "Omiti porque a vergonha do que ouvi naquela loja pesa mais do que a herança que se soma depois dela. Pois ponha no papel: eu soube, eu pedi, ele recusou, e saí de lá com o chapéu na mão."

**Evasiva:** Walter recebe o que se lhe mostra e devolve-o antes de o examinar, os dedos no colarinho. "E que tenho eu com isto? Entendo de fazendas e de letras de câmbio." "Já dei o meu paradeiro e o nome dos meus credores; se é para me mostrarem cada papel desta vila, mostrem também aos outros, que não sou o único nome escrito em Briarstone."

---

### 6.5 Davey Tull — dentro da Oficina ("Conversar com Davey Tull")

**Abertura:**
Davey Tull varre um chão que já não dá pó. Ao ver gente, encosta a vassoura no ombro e espera a pergunta de olhos erguidos. "O Sr. Crane disse pra eu tomar conta da oficina. Eu tomo conta e vou varrendo, que parado o serviço não rende."

Opções: *"Olha para mim, rapaz. Que costumes tinha o teu patrão?"* (firme) · *"Não tenhas receio. Fala-me do teu patrão."* (cordial) · *"Os hábitos do Sr. Arthurs, à noite. Descreve-os."* (técnico) · *"Aprendias a dar corda aos relógios?"* (oblíquo)

**Beat 1 — os costumes do patrão** (sustenta `dep_habito_corda` em todo tom):

- *Firme:* Os olhos sobem, depressa, e a vassoura aperta-se contra o ombro. "Costumes eu conto, senhor." "O patrão dava corda no relógio do bolso às onze, antes de subir pra deitar. Todas as noites, sem faltar uma." Conta curto, o que lhe perguntam e nada mais: [[dep_habito_corda]].
- *Cordial (ressonante):* A vassoura desce um pouco, e a voz solta-se. "O patrão punha o relógio consertado no meu ouvido, pra eu ouvir se o compasso saíra certo. Dizia que máquina bem posta respira. Eu já acerto o de parede sozinho; o de bolso ele ainda não deixava." "E de noite, antes de subir pra deitar, dava corda no de bolso. Às onze, sempre; nunca falhou uma — ele mesmo contava, de manhã, como quem confere lição. Dizia que aquele guarda trinta horas de corda, e que quem deixa a corda acabar não é homem de ofício." A vassoura torna ao chão enquanto ele fala: [[dep_habito_corda]].
- *Técnico:* "À noite, senhor, o patrão fechava sempre pela mesma ordem." A vassoura encosta no ombro. "Primeiro as tampas da vitrine, depois apagar o lampião da loja." Conta a ordem sem se enganar em nenhuma. "A corda do de bolso era mais tarde: onze horas, antes de subir pra deitar, e isso era todas as noites." Diz a hora e para nela: [[dep_habito_corda]].
- *Oblíquo:* "Aprendia, senhor, mas o de bolso ele ainda não deixava; só o de parede." O queixo desce um pouco. "No de bolso dava ele, e sempre à mesma hora: onze, antes de subir. Dizia que aquele aguenta trinta horas, e que quem deixa parar não merece o ofício." Diz e espera a pergunta seguinte, de olhos no serviço: [[dep_habito_corda]].

Opções após o Beat 1: *"E na sexta à noite, onde estavas? Sem gaguejar."* (firme) · *"E a tua sexta-feira, rapaz? Conta com calma."* (cordial) · *"A tua noite de sexta, do fecho da loja em diante."* (técnico) · *"Dormes aqui na oficina?"* (oblíquo)

**Beat 2 — a noite de sexta** (sustenta `alibi_davey` em todo tom; a fala é sempre idêntica, palavra por palavra — a "recitação" da resposta ensaiada):

- *Firme:* Os olhos descem para a vassoura e lá ficam. "Sem gaguejar, senhor; já contei mais de uma vez." "Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem, eu para casa. Minha mãe serviu a sopa às oito." As palavras saem sem tropeço, na ordem em que vêm sempre: [[alibi_davey]].
- *Cordial:* "A sexta eu conto certinho, que já contei mais de uma vez." A vassoura fica quieta. "Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem, eu para casa. Minha mãe serviu a sopa às oito." Conta sem pressa, de olhos na vassoura até o fim, e não acrescenta nada: [[alibi_davey]].
- *Técnico:* "Do fecho em diante, senhor." Os olhos descem para o serviço e lá ficam. "Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem, eu para casa. Minha mãe serviu a sopa às oito." Nem uma hora a mais nem uma a menos do que lhe pedem: [[alibi_davey]].
- *Oblíquo:* "Não, senhor; durmo em casa, com a minha gente. Da oficina saio quando o Sr. Crane tranca." "Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem, eu para casa. Minha mãe serviu a sopa às oito." A resposta vem inteira, e vem com as palavras da primeira vez: [[alibi_davey]].

Opções do Beat 3 (a pressão é econômica e só — o rapaz dá os números que sabe, e não faz a conta): *"O teu ordenado, rapaz. Quem te paga agora?"* (firme) · *"Quem responde pelo teu pagamento agora, Davey?"* (cordial) · *"Quanto te davam, e de quanto em quanto tempo?"* (técnico) · *"Levas alguma coisa para casa, ao fim da semana?"* (oblíquo)

**Beat 3 — a pressão:**
- *Firme:* Aperta o cabo da vassoura com as duas mãos. "O Sr. Crane disse que a casa paga quando a casa puder. Eu venho assim mesmo."
- *Cordial:* "O patrão pagava às sextas, antes de fechar. Sexta ele lançou o meu, como sempre, e escreveu no livro. Na outra sexta é que eu não sei quem escreve."
- *Técnico:* "Quatro xelins por semana, {detective.treatment}, às sextas, antes de fechar." Dá a quantia depressa. "Desde o fim de março nenhum deles vem comigo; ficam com a casa. O patrão anotava tudo no livro estreito da bancada."
- *Oblíquo:* "Levo a marmita, para a minha mãe tornar a enchê-la." Encosta a vassoura no ombro. "De dinheiro não levo nada desde o fim de março. Isso o patrão anotava no livro, todas as sextas."

**Alfinetada de Davey:**
- *E1:* Acaba a resposta e não torna logo ao serviço. A vassoura fica parada mais tempo do que precisa.
- *E2:* Os olhos sobem do serviço e ficam erguidos. "{g:O senhor|A senhora} já andou pela bancada, então." Espera, e ninguém lhe responde. Depois, mais baixo: "O Sr. Crane diz que é assim em toda oficina, e eu não conheço outra." A vassoura volta ao chão, e ele varre o que já está varrido.

**Reações a provas:**
- *[Relógio de Bolso Parado] Por que o relógio do patrão parou sem corda?* (requer `ev_relogio_bolso`) → Davey encosta a vassoura na parede e estende as duas mãos. "Posso ouvir?" Encosta o relógio do morto no ouvido, do jeito que o patrão fazia com ele, e fica assim um bom tempo, os olhos parados na parede. "Está no seu compasso. Bem posto." Antes de devolver, volta-o com o fundo para cima e passa a unha pela borda. "Este tem tampa de dentro: por baixo da tampa do fundo vem outra, que se levanta pela unha, no entalhe. O patrão chamava aquilo de cuvette, à francesa, e ria de mim quando eu errava a palavra." "Por dentro dela é que a fábrica grava o nome e a conta dos rubis. E o que o dono quiser pôr de seu." Devolve-o com as duas mãos. "A corda das onze, pro patrão, era coisa sagrada, que nem reza; dois anos de casa, e esse relógio nunca soube o que era ficar sem corda." E torna à vassoura sem que ninguém o mande.
- *[Buril Claro no Estojo] Por que um buril está mais limpo que os outros no estojo?* (requer `ev_estojo_buril`) → Davey chega sem que o chamem e para a um passo do estojo, as mãos atrás das costas. "Esse é do Sr. Crane. Ferramenta dele ninguém pega; a minha é a do caixote, de cabo de freixo." "Buril a gente limpa na flanela, com a cera da bancada, e é da cera que vem esse pardo todo nos cabos. Molhar não pode, que a água entra por baixo da virola e enferruja o espigão; isso o patrão me ensinou no primeiro mês. O de ponta é o de gravar miúdo, por dentro de tampa; um igual já me escapou e me abriu o dedo, no primeiro ano." O olho corre a fileira, cabo por cabo. "O Sr. Crane cuida do que é dele, senhor: passa a flanela em cada um antes de fechar o estojo, toda noite, e nunca o vi deixar ferramenta por limpar." Recua o passo que tinha dado.

**Evasiva:** Davey chega o rosto para ver de perto, a testa franzida, e faz que não com a cabeça. "Isso eu não sei dizer o que é, {detective.treatment}. Se fosse coisa de relógio, eu conhecia; do resto, quem sabia era o patrão."

---

## 7. Catálogo de cartas (evidências) — texto completo

Cada entrada: **id** · localidade · *texto de exibição* — carimbo padrão. Descrição (texto completo). Voz do mestre, quando existe.

### A Relojoaria · O Corpo

**`ev_rigor`** — *Corpo Endurecido / Rigidez Cedendo / Corpo Flácido* (a carta degrada com o IPM):
- Até 24h: **Corpo Endurecido** — "Rígido por inteiro; extremidades começando a ceder". Maxilar, pescoço e membros não cedem quando se tenta dobrá-los: o corpo enrijeceu por inteiro. Nos dedos e na mandíbula, porém, a resistência cede um ponto sob pressão firme. *Voz do mestre:* "Rígido por inteiro, mas repare nas mãos e na mandíbula: já cedem um ponto. Dezesseis horas, talvez dezoito; não menos de doze. Perto disto, o termômetro mente por omissão: cruze com o rigor antes de cravar a faixa."
- Até 36h: **Rigidez Cedendo** — "Maxilar já solto; joelhos ainda rígidos". O maxilar já dobra; os joelhos ainda resistem. A dureza some na mesma ordem em que chegou. *Voz do mestre:* "A rigidez já cede. Passou da véspera — e a hora exata começa a escapar entre os dedos."
- Além disso: **Corpo Flácido** — "Corpo mole, sem nenhuma rigidez". Os membros dobram sem nenhuma resistência: a dureza passou por completo. O rigor, neste ponto, já não aponta a hora. *Voz do mestre:* "Frouxo de todo. O rigor já não me serve: só posso jurar que faz mais de um dia."

**`ev_livores`** — *Manchas Arroxeadas nas Costas* — "Manchas fixas, sem empalidecer à pressão". Sob o polegar, as manchas não empalidecem; voltado o corpo, não migram. Onde ele pressiona o assoalho, a pele ficou pálida. *Voz do mestre:* "As manchas fixaram-se e não cedem ao polegar: morto há meia jornada, ao menos. E fixaram-se do lado em que ele está deitado."

**`ev_ferida`** — *Ferida Estreita no Pescoço* — "Ferida funda, de boca em losango, no pescoço". À esquerda do pescoço, abaixo do ângulo do maxilar, uma abertura de meia polegada escassa, de bordas nítidas, sem ponte de tecido. A sonda desce mais fundo do que a boca é comprida; as duas extremidades da fenda fecham em ângulo. *Voz do mestre:* "Bordas limpas, sem ponte de tecido: lâmina, não pancada. E mais funda que comprida — entrou de ponta e achou os vasos. Boca em losango é de haste de quatro faces; faca comum deixa uma ponta aguda e outra romba."

**`ev_reacao_vital`** — *Bordas Vivas na Ferida* — "Sangue infiltrado nas bordas da ferida". As bordas da fenda estão retraídas, afastadas uma da outra. O tecido em volta está empapado de sangue coagulado, que a esponja não desfaz. *Voz do mestre:* "O tecido reagiu: retraiu e deixou o sangue infiltrar os planos. Ferida de homem vivo. Sobre um morto, a mesma lâmina abriria uma boca frouxa e pálida."

**`ev_residuo_ferida`** — *Pó Vermelho na Ferida* — "Resíduo vermelho no canal da ferida". Na borda inferior do canal, a lente acha um traço de pó vermelho-tijolo, fino como poeira de lápis, preso ao coágulo. *Voz do mestre:* "Vermelho-de-polir. Pó de bancada de relojoeiro e de ourives: dá lustro ao ouro e ao aço. Estava dentro do canal, sob o coágulo."

**`ev_relogio_bolso`** — *Relógio de Bolso Parado* — "Relógio do morto parado às 05h05, corda no fim". Na corrente do colete, o relógio do morto: aberta a tampa, vidro inteiro, máquina sã, os ponteiros nas cinco e cinco — anotados antes de se tocar na coroa. A coroa resiste e vai-se enchendo; a poucas voltas, o tique retoma. *Voz do mestre:* "Mola vazia, não partida: parou por falta de corda. Estes guardam trinta horas de marcha — a hora do mostrador fica a trinta horas da última vez que uma mão lhe deu corda."

**`ev_cuvette`** — *Gravação na Tampa de Dentro* — "Gravado no relógio do morto: S. MIGUEL · IV · MEIA-VOLTA À ESQUERDA". Sob a tampa do fundo há ainda uma segunda tampa, de metal dourado, que se levanta pela unha num entalhe da borda. Por dentro correm as legendas da casa que a fez, gravadas em arco: 15 RUBIS, ANCRE LIGNE DROITE. Entre elas, na mesma altura de letra, três linhas curtas: S. MIGUEL · IV · MEIA-VOLTA À ESQUERDA. Os sulcos destas três estão claros e limpos; os das outras, carregados de escuro. *(sem voz do mestre — não é sinal forense, e comparar ferramenta é ciência de outro século)*

### A Relojoaria · A Cena do Crime

**`ev_relogio_lareira`** — *Relógio de Lareira Esmagado* — "Relógio Parado às 08h45". De perto, o vidro cedeu para dentro e a caixa abriu de um lado só; o rebordo do vidro leva um filete dourado, meio comido do uso. Os ponteiros descansam num quarto para as nove, sobre algarismos pintados a ouro.

**`ev_maquinismo`** — *Roda de Contagem das Badaladas* — "Roda de contagem pousada na nona batida". Pela caixa partida vê-se o trem das badaladas. Os entalhes da roda de contagem abrem-se em distâncias crescentes, um por hora, e nenhum vem rente a outro, como viria o da meia; a alavanca repousa no nono, e dali a roda não passou. O martelo está caído sobre a campainha, em descanso.

**`ev_cinza_livro`** — *Cinza de Papel Queimado* — "Cinza de papel, fio de costura e fecho de latão". A cinza sobe acima das barras: cinza pálida que se levanta ao mínimo sopro, lâminas negras encurvadas que estilhaçam em vez de vincar, uma crosta estreita e arqueada, em camadas. Posta a vela ao rés da grelha, as lâminas devolvem um brilho de linhas paralelas, e entre as linhas outras marcas de brilho, sem forma que se leia. No resto do leito, um fecho de latão com a sua chapa, escurecido e torto, um fio de linho preso a uma dobra de folhas queimadas e, de encontro às barras, um pedaço de pasta empenada. O pano do forro está carbonizado; por baixo dele, um carvão da grossura da própria pasta, que se descama em placas. Nas bordas frias do leito e sob a grelha, nenhuma folha apenas tostada.

**`ev_vitrine`** — *Balcão Revirado, Vitrine Fechada* — "Gavetas do balcão abertas; vitrine intacta". As gavetas do balcão estão puxadas e a caixa do troco, vazia. Na vitrine ao lado, sob tampas fechadas, dez relógios de ouro em fila, as etiquetas de preço voltadas para cima.

**`ev_fechadura`** — *Fechadura dos Fundos Forçada* — "Marcas de alavanca no batente externo". Os riscos na madeira são rasos e curtos, e param onde a lingueta cede. As lascas de tinta caíram para fora, sobre o degrau do beco.

**`ev_cesta_rooke`** — *Cesta de Ceia para Dois* — "Cesta de vime com louça para dois". Sob o guardanapo de cambraia, bordado a um canto com as iniciais A.R., dois cálices lavados e um bilhete a lápis: "Sexta, às oito, como sempre. — A."

**`ev_suplica_cesto`** — *Carta Amassada em Bola* — "Carta de súplica na letra de Walter Arthurs". Uma folha amassada em bola, sem envelope nem selo. A letra pede "um adiantamento sobre o que há de ser meu", promete juros de praça e fecha com "seu sobrinho, que espera à porta". Datada de sexta-feira, 13.

**`ev_bilhete_vigario`** — *Bilhete do Vigário de S. Miguel* — "Proclamas de G. Arthurs e da Sra. Agnes Rooke, três domingos de outubro". Meia folha com o timbre do presbitério de S. Miguel, dobrada em três. O vigário dá por recebida a nota do princípio do mês e marca os proclamas do Sr. Geoffrey Arthurs, viúvo, e da Sra. Agnes Rooke, viúva, ambos desta paróquia: o primeiro no domingo, 15 de outubro; os outros dois nos dois domingos seguintes.

### A Relojoaria · A Oficina

**`ev_livro_ordens`** — *Livro de Ordens de Serviço* — "Consertos reclamados na coluna de S.C.". O livro da bancada, aberto na semana. Três consertos reentrados com queixa no mesmo outono, todos rubricados "S.C." na coluna do executor. A letra do morto atravessa anos de páginas, miúda e firme, cada preço somado à margem e sublinhado. Na última entrada, a mesma letra, mais apertada: "pesar as caixas. Pettigrew, segunda."

**`ev_livro_pagamentos`** — *Livro de Pagamentos da Oficina* — "Salário do aprendiz Tull descontado por inteiro desde março". Livro estreito, três colunas: o salário da semana, o desconto e o que fica em dívida. Na linha de Davey Tull, quatro xelins entram e quatro xelins saem, todas as sextas desde o último dia de março; vinte e nove semanas ao todo. A margem daquele mês traz, na letra do morto, "adiantado à Sra. Tull, £2 8s". Ao pé da última linha, na mesma letra, a soma: £2 8s.

**`ev_estojo_buril`** — *Buril Claro no Estojo* — "Buril limpo entre ferramentas enceradas". O estojo traz o nome de Silas Crane a fogo na tampa. Os cabos vestem a mesma cera parda de uso; um único buril está claro, sem a cera dos outros, e a junta entre o aço e o cabo guarda uma linha escura de umidade.

**`ev_anel_encomenda`** — *Aro de Ouro por Gravar* — "Encomenda particular do relojoeiro". Sob o pano, um aro de ouro liso, estreito e ainda sem uso. A ordem de serviço vem presa a ele, no punho do morto e na mesma letra miúda: "gravar por dentro — G.A. & A.R. — pronto até 30 de outubro. Particular."

**`dep_habito_corda`** — *O Hábito da Corda* — "Corda ao relógio de bolso todas as noites, às 23h". Declara o aprendiz Tull que o patrão dava corda ao relógio de bolso às onze da noite, antes de subir para deitar, todas as noites e sem faltar uma. Acrescenta o que o ouviu repetir na bancada: que aquele relógio guarda trinta horas de corda, e que homem que deixa a corda acabar não merece o ofício. Tomado por termo na oficina, pela mão do guarda.

**`alibi_davey`** — *A Mesma Resposta Duas Vezes* — "Paradeiro declarado: saiu às 19h30; em casa às 20h". "Saímos juntos às sete e meia, o Sr. Crane e eu. Ele foi para a estalagem, eu para casa. Minha mãe serviu a sopa às oito." Perguntado de novo ao fim da visita, repete as mesmas palavras, na mesma ordem.

### Interrogatório: Silas Crane

**`alibi_silas`** — *Recolhido à Estalagem às Oito* — "Paradeiro declarado: 20h–manhã (estalagem)". Declara ter fechado a oficina às sete e meia e saído com o aprendiz; ter ceado pouco e recolhido ao quarto às oito, sem tornar a sair; e ter aberto a loja pela manhã, como de costume. Deu as horas de um fôlego, sem pausa entre elas. Tomado por termo na saleta, pela mão do guarda.

**`comp_silas`** — *Teorias sobre o Ladrão* — "Solicitude constante". Oferece a cadeira melhor, chega o lampião, e oferece também uma teoria: gente de fora, da estrada, atrás do troco do caixa. Volta a ela três vezes durante a conversa, com variações, sem que ninguém pergunte.

**`ev_vidro_dobra`** — *Vidro na Dobra da Calça* — "Lasca de vidro abaulado na bainha". Na bainha da calça de Silas, uma lasca de vidro do tamanho de meia unha. À lente, o caco é abaulado, fino como papel, e traz na borda um fio de tinta dourada.

### O Posto do Guarda

**`dep_testamento`** — *Testamento do Relojoeiro* — "Herdeiro Único: Walter Arthurs". Cópia lavrada há dois anos no gabinete do procurador Pettigrew, de Moorford: a loja, a casa e as economias do Sr. Arthurs passam por inteiro ao sobrinho, Walter Arthurs, "na falta de outros herdeiros".

**`dep_dividas_walter`** — *Cartas de Cobrança* — "Dívidas de praça de Walter Arthurs". Três cobranças com timbre de casas de Moorford, endereçadas a Walter Arthurs: fazendas por pagar, um armazém em juízo, e a soma crescendo de carta em carta. *Voz do mestre:* "Dívida vencida diz o aperto. De onde sairia o pagamento, isso a cobrança não diz."

**`dep_briga_walter`** — *Gritos Ouvidos da Rua* — "Altercação na loja, sexta ao anoitecer". Ocorrência tomada no sábado: um carroceiro que passava ouviu, pela porta da loja, vozes de homem em altura de briga — "prefere ver-me na miséria", e o resto perdido. Dá a hora por volta das sete da tarde de sexta.

**`dep_queixa_grey`** — *Queixa do Relógio Mais Leve* — "Queixa formal de Caleb Grey, sexta à tarde". Termo lavrado na sexta: Caleb Grey, moleiro, declara que o relógio caçador do pai, saído de conserto na loja de Arthurs, "voltou mais leve do que entrou", e exige pesagem diante de testemunhas. Anexa a soma do prejuízo: quatro libras e dez xelins.

**`dep_visto_vivo`** — *Vitrine Fechada às Oito* — "Visto com Vida às 20h (13/out)". Do registro da ronda: às oito em ponto da noite de sexta, o guarda Tobin viu o relojoeiro, de dentro da loja, correr as tampas da vitrine e acenar-lhe pelo vidro, como todas as noites.

**`dep_avistamento_padeiro`** — *Luz Vista de Madrugada* — "Avistamento declarado: 05h15 (14/out)". O moço do padeiro, ao registro: passou pela High Street às cinco e um quarto da madrugada de sábado e viu claridade na oficina do relojoeiro. "A luz do velho", disse. Jura que o Sr. Arthurs amanheceu vivo e trabalhando. *(Refutável — ver explicação no Epílogo, §12)*

**`dep_mulher_viela`** — *Uma Senhora na Viela* — "Relato: senhora deixou a viela ao anoitecer". A Sra. Wick, dos fundos do nº 9, declarou ter visto uma senhora de escuro deixar a viela da relojoaria "pouco antes das nove" da noite de sexta. Não lhe viu o rosto; conhece o passo, diz, mas não jura. Abaixo, em tinta mais nova: procurada outra vez ao meio-dia, disse não ter visto nada e fechou a janela.

### A Torre de S. Miguel

**`dep_sineiro_beco`** — *Um Homem na Boca do Beco* — "Avistamento declarado: depois das nove (13/out); fora do registro". "Dou corda ao relógio da torre nas sextas, depois das nove, que é quando fecho o adro. Desci com a lanterna e, do portão, vi sair um homem pela boca do beco da relojoaria. Subiu a rua. Conheço o andar do Sr. Crane: são doze anos de vê-lo passar." Espera que a pena pare. "O guarda perguntou-me primeiro quanto eu tinha bebido. Depois já não perguntou mais nada, e não escreveu."

**`ev_livro_ii`** — *Caderno de Pesos do Relojoeiro* — "Ouro pesado à entrada e à saída; diferença somada ao fim de cada mês". Um caderno de capa de oleado, do tamanho da palma. Cada linha traz a data, a peça, o peso do ouro à entrada e o peso à saída, e a coluna do executor rubricada. Ao pé de cada mês, a diferença somada na letra miúda do morto, e a soma do ano por baixo, sublinhada duas vezes.

### A Estalagem

**`alibi_walter`** — *O Carro das Seis* — "Paradeiro declarado: Moorford, a noite inteira". Declara ter tomado o carro das seis para Moorford e pernoitado no Station; ter sabido da morte pela manhã e regressado no primeiro trem; e ter tomado quarto na estalagem por estar lacrada a casa do tio. Não pediu para reler o que se lhe escreveu. Tomado por termo na sala da estalagem, pela mão do guarda.

**`ev_registro_estalagem`** — *Registro da Estalagem* — "Assinatura de sexta, 19h40, quarto nº 3". Na página de sexta-feira, 13: "W. Arthurs, nº 3", na linha das sete e quarenta da noite. Na coluna dos serviços, a letra do caseiro: água quente ao nº 3 às nove; vela nova à meia-noite.

**`corrob_estalajadeiro`** — *O Quarto Cinco às Escuras* — "Hóspede ausente às 21h; portão passado das 22h". O estalajadeiro conta pelos dedos: o Sr. Crane não desceu para a ceia; às nove, subindo água quente ao três, viu o cinco às escuras, a cama por desfazer; e o portão do pátio, só o ouviu bater "passado das dez".

### A Papelaria

**`alibi_agnes`** — *Em Casa desde as Seis* — "Paradeiro declarado: em casa desde as 18h". Declara ter fechado a loja às seis e recolhido a casa, sem tornar a sair até a manhã de sábado; e acrescenta que uma viúva não tem serões. Não deixou o balcão enquanto se escrevia. Tomado por termo ao balcão, pela mão do guarda.

**`comp_agnes`** — *Meio-Luto e Azeviche* — "Reserva constante". Veste cinza-escuro com broche de azeviche, o meio-luto de quem já cumpriu o inteiro. Ao nome do morto, a mão esquerda procura a beira do balcão; a voz não muda.

### O Moinho

**`alibi_grey`** — *Véspera de Feira no Moinho* — "Paradeiro declarado: moinho, 19h–23h, com três homens". Declara ter carregado o moinho das sete às onze da noite de sexta, véspera de feira, na companhia de dois jornaleiros e do carroceiro do Finch, cujos nomes ele próprio mandou anotar. Os três, ouvidos em separado, dão as mesmas horas. Tomado por termo na rampa, pela mão do guarda.

**`comp_grey`** — *Rancor Sem Rodeios* — "Hostilidade aberta". Fala da queixa a quem lhe pergunte e a quem não pergunte, sempre com a mesma soma e sem baixar a voz: o relógio do pai, o conserto pago adiantado, o peso que voltou menor. Da morte do relojoeiro fala só a soma. Bate a farinha do avental e volta às sacas.

### Gabinete Pettigrew

**`corrob_pettigrew`** — *Consulta ao Procurador* — "Carta do morto: denúncia com discrição". O procurador estende a carta, datada de quinta: "Preciso do seu conselho sobre como se lavra queixa contra pessoa a meu serviço, com a discrição que o caso pede. Vou-lhe segunda-feira." E acrescenta, de memória: na mesma carta, o relojoeiro pedia hora para tratar de mudanças no testamento, por razão de matrimônio.

---

## 8. A contradição de horas — o ponto a decidir da Caderneta

Quando `ev_rigor` + `ev_livores` (o corpo) e `dep_avistamento_padeiro` (o moço do padeiro) estão ambos na mesa, surge o aviso: *"Duas horas se contradizem: o corpo e o moço do padeiro. Há um ponto a decidir na caderneta."*

**Apresentação do ponto a decidir:**
"O moço do padeiro jura o Sr. Arthurs vivo e à bancada às cinco e um quarto da madrugada de sábado. O corpo já esfriara: o rigor e o livor põem a morte na véspera, antes da meia-noite. Só uma das duas horas pode reger a minha conta, e de qual parto muda o caminho daqui em diante."

Botões: **"Parto do relato do moço"** ou **"Parto do que o corpo diz"**.

- Se decidido pelo corpo — frase da Caderneta: "Firmei-me no corpo: parto do rigor e do livor; ao relato que os contrarie compete o ônus da prova." Linha do diário: "Firmei-me: parto do que o corpo diz; o relato que o desminta que se explique."
- Se decidido pelo relato — frase da Caderneta: "Firmei-me no relato do moço: parto da luz e da vida que ele jura ter visto na oficina; ao corpo compete então o ônus da prova." Linha do diário: "Firmei-me: parto do relato do moço do padeiro; que o corpo se explique depois."

---

## 9. Confrontos — consequências (semente inerte, hoje sem efeito de tempo)

Ao confrontar certas provas, cada suspeito TEM um efeito enumerado (a prosa da reação já está no §6; isto é só o rótulo do que a prova "agita"):

- **Silas Crane:** confrontar `corrob_estalajadeiro` → poderia antecipar a cena (voltar à relojoaria antes do perito); `ev_livro_ordens` → poderia mexer nas provas; `ev_vidro_dobra` → fica agitado.
- **Walter Arthurs:** confrontar `ev_registro_estalagem` → poderia fugir/tornar-se indisponível.
- **Agnes, Grey e Davey:** hoje só rendem prosa, sem gatilho de ação.

---

## 10. A reconstituição da noite (Domingo, na relojoaria)

### As intervenções (a lista do que se fez para que a noite não se visse — cada gesto só entra em cena se TODAS as suas cartas exigidas estiverem na mesa)

1. **A hora de sair, dada duas vezes** (`alibi_silas` + `alibi_davey`) — Às sete e meia: "A oficina fecha-se com dois do lado de fora, e a hora de sair passa de um para o outro antes de passar ao papel. Sai depois pela boca de ambos, a mesma hora e a mesma ordem de gestos; perguntada segunda vez, uma das duas respostas volta palavra por palavra."
2. **O recolhimento ao quarto** (`alibi_silas` + `corrob_estalajadeiro`) — Às oito, na estalagem: "O quarto cinco é o de quem declarou recolher-se às oito e não tornar a sair. Às nove o cinco está às escuras e a cama por desfazer; o portão do pátio bate passado das dez."
3. **Os ponteiros recuados** (`ev_relogio_lareira` + `ev_maquinismo`) — No escritório, passadas as nove: "Os ponteiros do relógio de lareira recuam até um quarto para as nove, com a máquina ainda viva. Logo depois a peça vem ao chão, e a alavanca das badaladas fica pousada no nono entalhe da roda, de onde não passou."
4. **O assalto encenado** (`ev_vitrine` + `ev_fechadura`) — Na loja, na noite de sexta: "As gavetas do balcão saem uma a uma e a caixa do troco esvazia-se. A vitrine dos dez relógios de ouro fica com as tampas por abrir e as etiquetas voltadas para cima. Na porta dos fundos a alavanca morde o batente pelo lado de fora, e as lascas de tinta caem para o degrau do beco."
5. **O buril lavado** (`ev_estojo_buril` + `ev_residuo_ferida`) — Na oficina, na noite de sexta: "Um buril passa pela água e volta ao estojo, entre os cabos vestidos da mesma cera parda. A umidade entra na junta do aço com o cabo e fica lá; o vermelho-de-polir que o canal da ferida guarda sob o coágulo ficou onde a água não chegava."
6. **O livro desmanchado** (`ev_cinza_livro`) — Na grelha do escritório: "O livro é desmanchado antes de ir ao lume: a costura cede, e as folhas descem aos punhados. O fogo não chega ao fim do que lhe deram. A capa grossa fica presa nas barras, e ali para."
7. **A bainha não sacudida** (`ev_vidro_dobra`) — Ao sair da sala: "A bainha de calça passa a porta sem ser sacudida, e leva presa uma lasca de vidro de mostrador do tamanho de meia unha, abaulada, com um fio de tinta dourada na borda."
8. **A janela fechada** (`dep_mulher_viela`) — Ao meio-dia de sábado: "Dos fundos do nº 9 vem o relato de que uma senhora de escuro deixou a viela pouco antes das nove da noite de sexta. Procurada outra vez, a testemunha diz não ter visto nada, e fecha a janela."
9. **A teoria do estranho** (`comp_silas`) — Na saleta, depois do achado: "A explicação vem antes da pergunta: gente de fora, da estrada, atrás do troco do caixa. Volta três vezes na mesma conversa, com variações."

### A cena da noite — texto de abertura (uma das três, por seed)

1. "Domingo à noite. A loja está fechada e o lume apagado; o lampião de mão vai à frente, do balcão à oficina e da oficina ao escritório. Sobre a bancada, em fila, o que trouxe comigo."
2. "Domingo, passada a hora da ceia. O homem de guarda ficou à porta da rua e a relojoaria é minha por uma hora. Refaço a noite de sexta com o que a mesa sustenta, e paro onde ela parar."
3. "Domingo à noite, e a vila dorme cedo. Ando pela sala com o lampião baixo, e não há ninguém a quem perguntar. A sexta-feira volta em pedaços, e só nos pedaços que colhi."

### Os fechos (por faixa de quanto foi colhido)

- **Nenhuma:** "Apago o lampião. Percorri a sala inteira e ela ficou como estava: nada do que trouxe moveu coisa alguma aqui dentro. Saio como entrei."
- **Poucas:** "Ponho o lampião na bancada. A sala cedeu nos pontos em que eu tinha com que a pressionar, e ficou inteira no resto."
- **Várias:** "Ponho o lampião na bancada. A noite refez-se diante de mim na ordem em que foi feita, e parou onde a minha mesa parou."
- **Quase toda:** "Ponho o lampião na bancada e fico olhando a sala. A noite de sexta voltou diante de mim uma arrumação de cada vez, e nenhuma delas se desfez sem papel meu por baixo."

---

## 11. Ecos do Mestre — a voz do Dr. Abbot (só na retentativa, ao errar)

**Título:** "A voz do mestre"

- **sem_janela:** "O senhor levou o caso a julgamento sem tirar do corpo a hora da morte. O corpo tinha o que dizer sobre isso, e ficou por ouvir." / "Faltou firmar a janela. Antes do nome e do meio, vem o quando — e o quando o senhor não prendeu a sinal nenhum."
- **janela_nao_cobre:** "A janela que o senhor firmou não abarca a hora que o corpo aponta. Uma das duas está fora do lugar." / "O senhor cravou uma faixa de horas anterior à morte. A conta do corpo fica de fora dela."
- **janela_sem_sustentacao:** "O senhor firmou a janela e não a prendeu a carta alguma. Falta o sinal do corpo que a sustente." / "A janela está lá, solta. Nenhuma carta do corpo a segura por baixo."
- **janela_imprecisa:** "A janela é larga demais. O corpo consente que o senhor a aperte; volte aos sinais e feche a faixa." / "O senhor deixou horas de sobra dos dois lados. Com o que o corpo guarda, dá para estreitar a conta."
- **sem_nexo:** "O senhor levou o acusado ao banco sem o pôr na cena. A cadeia abre um vão justo aí, entre o nome e o lugar." / "Falta a presença. Ter o nome não é tê-lo no sítio à hora certa; esse elo ficou por atar."
- **nexo_errado:** "O vínculo que o senhor firmou não põe o réu na cena. O que ligou aponta para outro lado que não o lugar do crime." / "A ligação da presença não pegou. O que o senhor amarrou ali não é o que põe o acusado no sítio."
- **nexo_acessorio:** "À presença o senhor juntou um vestígio que não é do meio da morte. Repare no que de fato o põe na cena, e separe o resto." / "Um dos cabos que o senhor atou à presença é de outra história. Guarde para a presença só o que a sustenta."
- **sem_descuidos:** "Há na cena uma leitura que não fecha com as outras. O senhor passou por ela sem a marcar." / "Dois sinais aqui contam horas diferentes. Onde as contas não batem, volte e confira antes de seguir."
- **reu_errado:** "O corpo não acusa o homem que o senhor levou ao banco. A leitura física e o nome que o senhor firmou não se encontram." / "O senhor fechou uma cadeia inteira sobre um nome que os sinais do corpo não amparam. Torne a conferir se a leitura ampara o nome que firmou."

---

## 12. Procedência das alegações (de que boca saiu cada uma)

A cadeia contaminada — três papéis, uma só boca (Silas Crane):
- `alibi_silas` — própria (ele mesmo).
- `alibi_davey` — ensaio (Davey repete o que Silas lhe ensinou).
- `dep_mulher_viela` — coação (a Sra. Wick, sob pressão, e recua na retratação).

As demais, cada uma da sua própria fonte: `alibi_agnes` (Agnes Rooke), `alibi_grey` (Caleb Grey), `alibi_walter` (Walter Arthurs), `dep_avistamento_padeiro` (o moço do padeiro), `dep_sineiro_beco` (Amos Kell), `corrob_estalajadeiro` (o estalajadeiro), `corrob_pettigrew` (o procurador Pettigrew).

---

## 13. O Mural da Acusação — texto completo da interface

### Cabeçalho

**Título:** "A Construção da Acusação"
**Subtítulo:** "A mesa se constrói por partes: conclua uma para a próxima aparecer. Para rever uma parte já feita, clique nela ou arraste-a de volta. Construir não custa tempo."
**Botão principal:** "Levar a julgamento" (habilita quando há réu nomeado)
**Botão de fechar:** "fechar ✕"

### As cinco estações (etapas)

| Etapa | Título | Subtítulo |
|---|---|---|
| I | O Corpo | quando e como |
| II | A Presença | o réu na cena |
| III | Os Depoimentos | hora e paradeiro declarados |
| IV | O Móbil | a razão do crime |
| V | Os Juízos | sobre cada não-acusado |

Botão ao fim de cada etapa: "Concluir esta parte →" (na última etapa: "Concluir").
Uma etapa concluída vira uma ficha resumida ("carta pregada" no mural); clicar ou arrastá-la reabre-a ("rever ⟲" / "solte para rever ⟲" durante o arrasto).

### Etapa I — O Corpo (quando e como)

Coluna "Quando — a janela": o jogador declara a janela de horas da morte (seletor); abaixo, "O que o corpo diz do tempo:" lista as cartas temporais coletadas, cada uma com a etiqueta "o corpo declara" (ligação automática à âncora "quando"). Sem cartas: "Nenhum indicador de tempo no corpo."

Coluna "Como — a causa": lista clicável de todas as causas do Catálogo Universal (ver §14); abaixo, "O que o corpo diz da causa:" lista as cartas causais coletadas (ligação automática à âncora "como" quando carregam sinal ou instrumento). Sem cartas: "Nenhum sinal de causa no corpo."

### Etapa II — A Presença (o réu na cena)

"Réu:" + lista clicável dos cinco suspeitos.
Instrução: "Ligue à Presença o(s) vestígio(s) que ligam o réu à arma do óbito (clique no vestígio, depois na âncora). Para desfazer uma ligação, clique no barbante."
Mesa de ligação: alvo único — placa "Presença — o réu na cena"; fontes — todos os vestígios coletados ("Vestígios coletados").

### Etapa III — Os Depoimentos (hora e paradeiro declarados)

Instrução: "Ligue um fato — do corpo ou dos registros — à alegação de hora ou de paradeiro que ele derruba (clique no fato, depois no depoimento). Para desfazer uma ligação, clique no barbante."
Mesa de ligação: alvos — "As alegações — hora e paradeiro" (as cartas de hora alegada, e — com o réu nomeado — o paradeiro que ele próprio declarou); fontes — "Os fatos — corpo e registros" (cartas temporais + corroborações).

### Etapa IV — O Móbil (a razão do crime)

Sem réu nomeado: "Nomeie o réu na etapa da Presença para apontar o móbil."
Sem carta de móbil ligada: "Nenhuma carta de móbil ligada a este réu."
Com cartas: "Aponte o móbil:" + lista clicável das cartas de motivo ligadas ao réu (rótulo = o carimbo da carta; sub-rótulo = hora da coleta).

### Etapa V — Os Juízos (culpado / inocente / sem juízo, por não-acusado)

Sem réu nomeado: "Nomeie o réu na etapa da Presença primeiro."
Uma ficha por suspeito não-acusado, com retrato, nome, e três opções: **Cúmplice** / **Inocente** / **Sem juízo**.

- Marcado **Inocente:** abre sub-painel — "Confronte o paradeiro declarado — ligue o vestígio que o conteste, se houver:" + o texto do álibi declarado ("Álibi: ..."). Sem vestígio disponível: "Nenhum vestígio na sua mesa confronta este paradeiro." Com vestígios: lista clicável para ligar ao álibi.
- Marcado **Cúmplice:** abre sub-painel — "Por que acusa de cúmplice:" + lista de cartas que ligam esse suspeito (clicáveis, é aposta narrativa sem efeito no motor). Sem cartas: "Nenhuma carta sustenta a aposta."

### O painel lateral — "Folha do inquérito" (`FormularioInquerito.jsx`)

Título: "Folha do inquérito"
Subtítulo: "Sobre a morte do Sr. Geoffrey Arthurs"
Quatro claros numerados (I–IV), cada um mostrando o que já foi afirmado ou "— por afirmar —":
- **I. O réu nomeado**
- **II. A janela afirmada**
- **III. A causa cravada**
- **IV. O móbil apontado**

Rodapé: "O que se afirmou até aqui." + selo de cera "MORTEM".

### A legenda dos fios (`LegendaBarbantes`, no painel lateral)

Título: "Os fios do mural"
- **presença** — "o vestígio ou a marca do lugar que põe o réu na cena" (fio torcido, vermelho-claro)
- **desmente** — "o fato que derruba uma alegação" (fio pontilhado, bege)

Nota final: "Quando e como o corpo declara na parte I, sem fio a amarrar." *(as espécies "quando" e "como" existem no motor mas não aparecem na legenda porque são automáticas, sem gesto de arrastar do jogador)*

### O aviso de lacunas (etiqueta pregada no mural, sempre neutra)

Rótulo: "Ainda falta" seguido da lista das pendências reais, entre:
"Falta afirmar a janela." · "Nenhum sinal sustenta a hora." · "Falta afirmar a causa." · "Nenhum sinal sustenta a causa." · "Falta nomear o réu." · "Nada põe o réu na cena." · "Nenhum depoimento contestado." · "O móbil não foi apontado." · "Há suspeitos sem juízo." · "Paradeiro [de fulano] por confrontar."

### A Revisão Final (antes de selar, `RevisaoFinal.jsx`)

Título: "A acusação, como você a montou"
Subtítulo: "Releia antes de selar. Nada aqui diz se está certo — isso é o julgamento."

Linhas mostradas: **Quem** · **Quando** · **Como** · **Presença** · **Contestados** · **Móbil** · **Juízos** (um por suspeito não-acusado, com o texto do vestígio que contestou o álibi dele, se houver).

Botões: "Voltar e revisar" / "Confirmar e julgar".

Se há lacunas ao confirmar, aparece a confissão explícita:
"A acusação não declara: [lista das lacunas]."
"O julgamento correrá com o que está na mesa. Selar assim mesmo?"
Botões: "Voltar ao mural" / "Selar assim mesmo".

---

## 14. Apêndice — rótulos e catálogo universal usados pelo mural

### Catálogo universal de causas de morte (o jogador crava por eliminação)

*Asfixia:* Estrangulamento por ligadura · Enforcamento · Estrangulamento manual (esganadura) · Sufocação · Afogamento
*Intoxicação:* Envenenamento por cianeto · Envenenamento por arsênico · Envenenamento por láudano (dose excessiva)
*Trauma:* Trauma contuso · **Ferida por arma branca** (a correta neste caso) · Ferida por arma de fogo

### Rótulos de mecanismo, instrumento e vestígio (vocabulário do caso-escola)

- Mecanismo correto: **ferida por arma branca**
- Instrumento correto: **buril de gravador**
- Vestígio de vidro: **vidro de mostrador**
- Motivo correto: **o silêncio sobre a fraude descoberta**
- Outros motivos em jogo no caso: **a herança** (Walter), **as dívidas** (Walter), **o rancor** (Grey), **o recasamento vigiado pela vila** (Agnes — móbil ambíguo, decidido pelas cartas que o jogador colhe)

### A explicação paga no encerramento (se a isca do padeiro foi refutada)

"A luz vista de madrugada teve explicação mais simples que um homem vivo: o lampião da bancada, aceso desde a véspera, queimou sozinho até secar o depósito. Era essa a claridade que o moço do padeiro tomou pelo velho a trabalhar."

---

## 15. Os quatro desfechos — o Monólogo do detetive

O monólogo é montado por blocos: **abertura** (variante determinística) → **a tese sustentada** (o que o jogador de fato provou) → o álibi do próprio réu desmentido, se for o caso → as testemunhas desmentidas, se houver → o bloco da noite (quanto da reconstituição a cadeia alcançou) → os buracos da cadeia (frase por falha) → o juízo sobre cada não-acusado → **fecho** (variante determinística, no máximo uma máxima por desfecho).

### Vitória Absoluta

**Aberturas** (uma escolhida por seed+detetive):
1. "Recolho as cartas em silêncio. A cadeia fechou-se elo a elo, e cada elo carrega atrás de si o peso do corpo." *(máxima)*
2. "Ponho a última carta sobre a mesa e recuo um passo. A cadeia está inteira: começa no corpo e não se solta em nenhum ponto."
3. "Fecho a caderneta devagar. Do primeiro sinal ao último nó, a acusação sustenta o próprio peso."

**Fechos:**
1. "Guardo os instrumentos sem pressa. [Réu] responderá pelo que fez, e um caso bem lido dispensa o aplauso." *(máxima)*
2. "[Réu] responderá pelo que fez. Fecho a maleta: o corpo disse tudo o que tinha a dizer, e foi ouvido." *(máxima)*
3. "Não há mais o que somar. [Réu] vai a julgamento, e a cadeia inteira vai junto."
4. "[Réu] responderá pelo que fez, e o laudo que sustenta o julgamento sai com a assinatura do Dr. Abbot, como saíram as mortes pequenas. Esta não era pequena." *(máxima)*

### Sucesso, com Gafes

**Aberturas:**
1. "A cadeia prendeu o acusado, mas não sem ranger. Amarrei alguns elos com mais pressa do que perícia, e quem é do ofício há de notá-los."
2. "A acusação segura, embora eu mesmo lhe veja os pontos frouxos. Prende — só não prende limpo." *(máxima)*
3. "O nó fechou-se sobre o culpado; ficaram, no caminho, alguns cabos mal atados que eu preferiria não ter deixado."

**Fechos:**
1. "[Réu] responderá assim mesmo. Mas fica o travo das gafes, e é nelas que se faz ou se perde a fama de um perito." *(máxima)*
2. "A condenação de [réu] está de pé. Guardo, para mim, a lista do que faria melhor numa segunda vez."
3. "[Réu] vai a julgamento. Levo comigo os pontos frouxos, que ninguém viu senão eu — por ora."
4. "[Réu] responderá assim mesmo. O laudo sai com a assinatura do Dr. Abbot, e os pontos frouxos ficam com o nome dele."

### Impunidade

**Aberturas:**
1. "Tenho o nome certo e as mãos vazias. O faro aponta o nome; a cadeia não o alcança." *(máxima)*
2. "Sei quem foi. Não provei que foi. Levo o nome na caderneta e nada com que o sustentar diante de um júri." *(máxima)*
3. "Aponto o culpado e não tenho com que o segurar: faltaram à cadeia os elos que o punham no lugar do crime."

**Fechos:**
1. "[Réu] sairá livre, e a lei nada terá a lhe dizer. Um culpado solto é um erro que continua a trabalhar." *(máxima)*
2. "[Réu] deixa a sala pela porta da frente. A certeza sem prova não prende ninguém, e eu que o diga." *(máxima)*
3. "[Réu] fica em liberdade por falta do que só eu deveria ter trazido. A intuição não assina laudo." *(máxima)*
4. "[Réu] sai da sala sem pressa, e ninguém lhe barra a porta. Fecho a caderneta sobre o nome que não pude sustentar."
5. "[Réu] sairá livre. As mortes pequenas que saíram em nome do Dr. Abbot pediam-me menos do que esta, e a esta eu não cheguei."

### Erro Judiciário

**Aberturas:**
1. "Montei uma cadeia coerente, e errada. Condenei quem não devia, e deixei o verdadeiro sem quem lhe pedisse contas."
2. "A acusação era firme e apontava para o lado errado. Condenei um nome que o corpo não acusava."
3. "Tudo se encaixava, menos o essencial: o nome. Levei à forca quem não cometeu o crime."

**Fechos (quando o nome do verdadeiro culpado É revelado — encerramento definitivo):**
1. "Enquanto se lê a sentença, [o correto] observa de longe, de mãos limpas. A forca de um inocente tem dois carrascos: quem ata o nó e quem assina o laudo." *(máxima)*
2. "A sentença cai sobre o nome errado, e [o correto] assiste sem pestanejar. O verdadeiro erro foi meu, e leva a minha assinatura."
3. "[O correto] sai da sala como quem cumpriu uma formalidade. Condenei a pessoa errada, e é isso que ficará no meu nome."
4. "A sentença cai sobre o nome errado, e [o correto] fica onde estava. O laudo que a sustenta sai, como todos os meus, em nome do Dr. Abbot: é a primeira morte grande que passa pelas minhas mãos, e passou errada." *(máxima)*

**Fechos anônimos (enquanto a retentativa do caso-escola está de pé, sem nomear o verdadeiro autor):**
1. "A sentença cai sobre o nome errado, e o verdadeiro autor a escuta de onde quer que esteja, calado. O erro leva a minha assinatura."
2. "Condenei quem não devia. Quem de fato matou segue à solta, sem nome na minha caderneta — e o meu laudo é hoje o seu melhor abrigo." *(máxima)*
3. "Assino uma cadeia coerente sobre um nome errado. O certo, esse, ainda está por escrever." *(máxima)*
4. "A sentença cai sobre o nome errado, e o laudo que a sustenta sai em nome do Dr. Abbot, como saem todos os meus. Nenhuma das mortes pequenas me custou isto." *(máxima)*

### Frases dos "buracos da cadeia" (uma por falha cometida)

- Corpo sem substância: "Levei a acusação adiante sem uma leitura do corpo que a sustentasse."
- Sem janela: "Não firmei a hora da morte em sinal algum do corpo, e sem ela não havia como medir os álibis."
- Janela não cobre: "A janela que afirmei erra a hora do óbito. Errei o relógio, e com ele o caso."
- Janela sem sustentação: "A janela que afirmei não é a que os meus próprios sinais sustentam: reuni provas de uma faixa de horas e assinei outra."
- Janela imprecisa: "A janela que afirmei ficou larga demais para acusar alguém com ela."
- Sem mecanismo: "Não afirmei como a vítima morreu."
- Mecanismo errado: "A causa que sustentei não se firma nos sinais do corpo; as lesões dizem outra coisa."
- Sem nexo: "Nada na minha cadeia pôs [réu] junto ao instrumento do crime."
- Nexo errado: "O vestígio que invoquei não liga o acusado ao instrumento do óbito."
- Nexo acessório: "Entre os vestígios que atei à presença há traço que não é do réu; carreguei a cadeia com marca de terceiro."
- Sem motivação: "Não apontei o móbil; apresentei uma acusação sem porquê."
- Motivação errônea: "O móbil que sustentei não é o que a cadeia prova."
- Sem descuidos: "Não apontei os descuidos da encenação, e a cena arrumada para mentir seguiu de pé."
- Periférico errado: "Sobre [suspeito], o meu juízo não correspondeu ao que as cartas de fato provam."

---

## 16. O Epílogo (o encerramento, depois do monólogo)

Sai como página de jornal: **manchete** + **decks** (linhas empilhadas) + **crédito**, seguida de **colunas** (o que o processo tornou público) e **margem** (o que só o perito sabe, a lápis).

### As manchetes, por desfecho

- **Vitória Absoluta:** "A morte do Sr. Geoffrey Arthurs" — decks: "Veredicto de culpa contra [réu]" · "Sentença de morte no tribunal de circuito" — crédito: "Do nosso correspondente".
- **Sucesso, com Gafes:** mesma manchete — decks: "Veredicto de culpa contra [réu]" · "Sentença de morte, sob protesto da defesa" — crédito: "Do nosso correspondente na sala do tribunal".
- **Impunidade:** mesma manchete — decks: "Inquérito encerrado" · "Homicídio doloso por pessoa ou pessoas desconhecidas" — crédito: "Do nosso correspondente na comarca".
- **Erro Judiciário:** manchete e decks IDÊNTICOS aos da Vitória Absoluta (a folha não distingue as duas) — "Veredicto de culpa contra [réu]" · "Sentença de morte no tribunal de circuito" — crédito: "Do nosso correspondente".

### O destino do réu (bloco central), por desfecho

- **Vitória Absoluta:** "O júri ouviu a cadeia inteira sem pedir que se repetisse um elo, e condenou [réu] na primeira sessão do tribunal de circuito do condado. A pena foi a que a lei reserva ao homicídio doloso: a forca."
- **Sucesso, com Gafes:** "[Réu] ouviu a condenação, mas não sem custo: a defesa leu em voz alta, um por um, os pontos frouxos da cadeia, e o júri deliberou até a madrugada antes de acompanhar o laudo."
- **Impunidade:** "Sem cadeia que o sustentasse, o caso não chegou a julgamento. O inquérito encerrou-se com a fórmula de costume — homicídio doloso por pessoa ou pessoas desconhecidas — e [réu] continua onde sempre esteve, com a vida que essa morte lhe deixou mais larga."
- **Erro Judiciário:** "O processo correu sem tropeço: o júri condenou [réu] sobre o meu laudo, e não houve, na sala, voz que soubesse o bastante para se levantar."

### Eco da hora emprestada (só se a peça forjada foi refutada)

"A hora que a mentira tomou emprestada de um relógio, o corpo cobrou de volta."

### A revelação final (só no Erro Judiciário)

"Ao verdadeiro autor, o processo nunca chegou: [o correto] acompanhou a sentença de fora dos autos."

### O destino dos periféricos (variantes por tipo de julgamento)

- **Segredo exposto (o jogador provou a inocência mostrando o segredo):** "A mentira de/da [suspeito] ficou nos autos pelo que era: vergonha, não sangue. Provou-se inocente, e o preço foi ter posto à vista, diante de estranhos, o que guardava para si." / "O que [suspeito] escondia entrou nos autos já explicado, e ninguém o tomou por crime. A inocência ficou provada; ficou também, escrito e público, aquilo que só a vergonha guardava."
- **Segredo oculto (nunca confrontado):** "A mentira de/da [suspeito] ficou nos autos sem explicação: o inquérito não a desfez, e também não a tomou por crime." / "Ninguém soube dizer por que [suspeito] mentiu; o segredo ficou inteiro, e a mentira, no arquivo."
- **Álibi confirmado na mesa:** "O processo guardou de/da [suspeito] apenas o paradeiro confirmado." / "[Suspeito] voltou ao próprio ofício; os autos não tornaram a citar esse nome."

### O perito fecha a conta (flexiona pela hora do selo — dia ou noite)

- **Vitória Absoluta (de dia):** "Os honorários foram pagos sem discussão da conta, com o dia ainda aberto sobre a vila. O próximo chamado, quando vier, virá mais cedo."
- **Vitória Absoluta (de noite):** "Os honorários foram pagos sem discussão da conta, já à luz dos lampiões. O próximo chamado, quando vier, virá mais cedo."
- **Sucesso com Gafes (de dia):** "Pagaram-me os honorários e pouparam-me os cumprimentos. Há de haver outro chamado, e menos pressa."
- **Sucesso com Gafes (de noite):** "Pagaram-me os honorários a horas em que a vila já dormia, e pouparam-me os cumprimentos. Há de haver outro chamado, e menos pressa."
- **Impunidade (de dia):** "Não se pagam honorários por um caso em aberto. Deixei os laudos em ordem: algum dia alguém os relerá."
- **Impunidade (de noite):** "Não se pagam honorários por um caso em aberto. Deixei os laudos em ordem e saí para a rua às escuras: algum dia alguém os relerá."
- **Erro Judiciário (de dia):** "Os honorários, recusei-os. O laudo, esse, não há como devolver."
- **Erro Judiciário (de noite):** "Os honorários, recusei-os já de noite. O laudo, esse, não há como devolver."

---

*Fim do roteiro. Total de fontes: `seed.js`, `abertura.js`, `localidades.js`, `mapa.js`, `cartas.js`, `dialogos.js`, `confrontos.js`, `intervencoes.js`, `ecos_mestre.js`, `procedencia.js`, `rotulos.js`, `catalogo_causas.js`, `MuralAcusacao.jsx` e componentes de `src/components/mural/`, `src/logic/monologo.js`, `src/logic/epilogo.js`.*
