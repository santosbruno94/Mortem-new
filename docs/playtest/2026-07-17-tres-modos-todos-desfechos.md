# MORTEM — Playtest do Vertical Slice

**Build:** produção (`vite build`, commit atual de `main`) · **Data do teste:** 17–18/07/2026
**Método:** playtest "isento", jogado como jogador — sem seguir as diretrizes internas do repositório e sem ler os relatórios de QA/playtests anteriores da equipe (para não contaminar o olhar). O jogo foi jogado de ponta a ponta num navegador Chromium (desktop 1280×800 e mobile 390×844), com sessões completas nos **3 modos de jogo** e caça a **todos os 4 desfechos**.

---

## 1. Sumário executivo

O vertical slice **cumpre o que promete e fecha inteiro**. Nos três modos foi possível ir da tela de título ao Monólogo do Detetive sem nenhum travamento, crash ou beco sem saída. Os **4 desfechos foram alcançados** (Vitória Absoluta, Sucesso com Gafes, Impunidade e Erro Judiciário), e a Vitória Absoluta foi obtida **nos três modos** — ou seja, todos os casos testados são resolvíveis de forma justa com o que o jogo entrega ao jogador.

O caso-escola ("A Hora Emprestada") é o coração da experiência e está num nível raro de acabamento: prosa de época consistente, dedução honesta com redundância de pistas, e um final que paga cada elo construído. Os modos gerados ("A Hora Refeita" e "Um Caso da Comarca") provam que **o motor procedural funciona de verdade** — veredicto, encenação, segredos e interferência operam — mas entregam hoje uma experiência mais rasa e textualmente repetitiva que a do caso artesanal. A distância entre os dois é o principal tema das sugestões deste relatório.

Nenhum bug bloqueante foi encontrado. Foram identificados **2 bugs reais** (concordância de gênero nos desfechos; toggle do Modo Purista que se perde silenciosamente) e um conjunto de atritos de UX de baixa gravidade.

---

## 2. Como o teste foi conduzido

Rodei `npm install`, `npm run build` e servi a build de produção com `vite preview`. A build compila em ~10,5s, com um único aviso: o chunk principal tem **1,23 MB** (min) — volto a isso nas sugestões.

Percurso realizado:

1. **A Hora Emprestada** — run completa "de jogador" (todas as 4 perguntas ao delegado, 9 localidades, 5 interrogatórios, 35/36 observações), terminando em **Vitória Absoluta**; depois runs adicionais para forçar **Erro Judiciário**, **Impunidade** (via fluxo de revisão, +2h) e **Sucesso com Gafes**.
2. **A Hora Refeita** — run completa até **Vitória Absoluta** (20/21 observações), incluindo o sistema de interferência.
3. **Um Caso da Comarca** — caso sorteado do banco (`gerado_comarca_15`, vila de Dunmere), run completa até **Vitória Absoluta** (19/19 observações).
4. Verificações transversais: save/retomada ao recarregar a página, revisão de acusação com custo de 2h, degradação do perecível com o passar das horas, Modo Purista, modo leve 2D, viewport mobile e console de erros (zero exceções de página em toda a sessão).

---

## 3. Modo 1 — "A Hora Emprestada" (caso-escola)

### 3.1 O arco, na experiência de quem joga

A abertura em 6 passos (pensão → carta → trem → Briarstone → relato do delegado) é curta, atmosférica e ensina o tom sem tutorial explícito. As **perguntas ao delegado Wycliffe** são um ótimo dispositivo: não custam tempo, mas quem entra sem perguntar perde contexto para sempre ("o que não perguntar aqui, fica por saber") — e o jogo cumpre a ameaça. A voz do Wycliffe é um destaque imediato ("não me cabe temperar a sopa antes do cozinheiro").

A escrivaninha com o diorama 3D da vila é legível: cada localidade anuncia o custo de viagem ("a um passo" grátis dentro da relojoaria; 1h–1h30 para os demais), e a regra **"examinar não custa tempo; só a viagem gasta o relógio"** se mantém coerente do início ao fim — conferi o relógio a cada ação. Essa regra é a melhor decisão de design do slice: elimina a ansiedade de "gastar cliques" e concentra a pressão onde ela é dramática (para onde ir, e em que ordem).

O exame do corpo é o momento mais forte do jogo. Os termos em negrito extraem cartas sem custo; o legista **fala** a leitura em apartes que ensinam medicina legal de época sem didatismo ("Rígido dos maxilares aos joelhos — isto é de horas, não de minutos"; "Boca em losango é de haste de quatro faces; faca comum deixa uma ponta aguda e outra romba"). A primeira carta abre em ficha para ensinar o gesto; as demais pousam sozinhas — detalhe de refinamento perceptível.

A cadeia dedutiva é **honesta e redundante**. A hora real da morte (21h de 13/out) é alcançável por pelo menos quatro linhas independentes: rigor/livores/algor; o relógio de bolso que não recebeu a corda ritual das 23h; a roda de contagem do relógio esmagado (a 9ª badalada desmentindo o mostrador em 8h45); e a ceia da Sra. Rooke. O jogador que só seguir o relógio de lareira cai na encenação — e o jogo pune sem trapacear, porque plantou os contra-indícios à vista.

Os **interrogatórios** têm personalidade: 4 tons de pergunta (firme ‹, cordial ◦, técnico ▪, oblíquo ~), árvore que "desce e não volta", e confrontos com provas que não gastam a vez. As vozes são distintas (Tull, o aprendiz que repete a resposta palavra por palavra; Crane, de mãos quietas; Walter, que se explica antes de acusado; Rooke, que responde o que se pergunta e nem uma palavra além). A armadilha central — **duas inocentes que mentem por vergonha** (Walter e a Sra. Rooke) — funciona: quebrar a mentira delas é obrigatório para a Vitória Absoluta, mas acusá-las é o erro que o jogo convida a cometer.

O **mural com barbantes** é tátil e bonito (cartas-pergaminho, tachas, fio vermelho). A construção por estações (Corpo → Presença → Mentiras → Móbil → Juízos) com a barra "AINDA FALTA" dá clareza sem entregar respostas — "Nada aqui diz se está certo — isso é o julgamento" é exatamente o contrato certo.

O **Monólogo do Detetive** é o payoff que o jogo promete: cada elo ligado vira uma frase; cada elo faltante, um buraco dito em voz alta. O epílogo ainda paga as iscas refutadas — a luz das 5h da madrugada ganha a explicação do lampião esquecido queimando até secar — um "aha" retroativo excelente. O Retrato da Investigação (tempo, lugares, observações, acusações) fecha com dignidade de boletim.

### 3.2 Achados funcionais específicos do modo

Tudo que testei funciona: relógio, extração, fichas, caderneta (com diário), painel de álibis, glossário, som, contradição corpo×padeiro (ver ressalva §7), confronto em cena criando barbante automático no mural (apresentei a Cesta à Sra. Rooke e o barbante `cesta → álibi` nasceu sozinho, removível), revisão pós-queda com custo de 2h e ecos do legista que **escalam de especificidade** a cada nova queda. A evidência dependente de tom existe e é real: a lasca de vidro na bainha de Crane **só aparece no tom oblíquo** — escolhi o técnico e a perdi para sempre naquela run, e ainda assim havia caminho para a Vitória Absoluta (o registro do estalajadeiro). Redundância bem dimensionada.

### 3.3 Ressalvas qualitativas

A principal: **apresentar uma prova antes de o interrogado declarar o paradeiro queima a apresentação para sempre**. Confrontei Walter com o Registro da Estalagem antes de perguntar sua noite; o jogo avisou ("Ainda não há paradeiro declarado para confrontar…"), mas o aviso vem **dentro da resposta, depois de gasta a vez**, e a opção fica "· já apresentada" permanentemente. A intenção (ensinar ordem de interrogatório) é legítima, mas a punição é silenciosa e desproporcional para um clique de curiosidade — ver sugestão S3.

A segunda: a **escolha da contradição** (corpo × avistamento do padeiro), anunciada no design como escolha ativa do meio do jogo, passou **completamente despercebida** na minha run de Vitória Absoluta — ela se manifesta como uma linha no diário e um item na caderneta, e nada puxa o olhar para lá. Terminei o caso perfeito sem nunca a ter visto.

---

## 4. Modo 2 — "A Hora Refeita" (réplica procedural)

### 4.1 A experiência

Wrenfield, Alice Wright morta, delegado Roderick. A abertura é uma variação enxuta da do caso-escola (6 passos, 3 perguntas ao delegado em vez de 4). A vila gerada é menor em nós (Corpo, Cena, Delegacia, Vizinhança + Taverna desbloqueável) e os **5 suspeitos são interrogados na delegacia**, não em seus lugares — funcional, mas a vila vira mais cenário e menos mundo.

O caso em si **é uma recriação competente da gramática do caso-escola**: morte às 21h, ferida por lâmina de ofício, ré que encena — e aqui a variação brilha: em vez do relógio recuado, **o corpo foi arrastado para junto da lareira para atrasar o esfriamento** (hora forjada pela temperatura, 9h45). O monólogo final entende a variante e a narra corretamente: *"a encenação caiu pelo próprio corpo: a temperatura, arranjada para dar 09h45, não moveu o rigor nem os livores"*. O motor de desfechos ramifica de verdade pelo instrumento da encenação — isso é arquitetura funcionando.

O **sistema de interferência (FASE 4) operou como projetado**: o pacote previa que a ré, ao saber do inquérito (extração do móbil na delegacia), voltaria à cena para esfregar o sangue das frestas. Coletei o "Sangue nas Frestas" **antes** de abrir o móbil — e a interferência foi registrada como *evitada*: quem chega primeiro não perde a prova. Funciona; a ressalva é que foi **invisível** — nada me disse que ganhei essa corrida (ver S8).

Os dois segredos periféricos (o pároco com o bilhete de súplica; o lavrador com a nota por assinar) e as duas corroborações de álibi fecham a mesma armadilha do tutorial, e o confronto em cena com a ré ("O Lugar Vazio" — o vão onde a lâmina dela deveria estar) criou o barbante de refutação automaticamente. **Vitória Absoluta alcançada com 20/21 observações, 4h de jogo interno.**

### 4.2 Onde a réplica fica atrás do caso-escola

A prosa gerada é limpa e sem anacronismos, mas **formulaica**: os cinco suspeitos respondem com moldes visivelmente repetidos ("Hora primeiro, lugar depois, sem que se peça duas vezes…", "E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora" — três vezes no mesmo caso; "Tratos meus com ela, poucos e pagos…" idêntico para dois suspeitos). As árvores de diálogo têm ~2 níveis contra 3+ do tutorial, sem os apartes físicos que dão vida (o Tull ouvindo o relógio no ouvido). A cena do crime não tem gavetas — é uma lista chapada de 4 termos contra os 4 compartimentos exploráveis do caso-escola. Nada disso quebra o jogo; tudo isso reduz a sensação de lugar.

---

## 5. Modo 3 — "Um Caso da Comarca" (banco procedural)

### 5.1 A experiência

O sorteio me deu `gerado_comarca_15`: Dunmere, George Roberts (ferreiro, 32) achado morto **na taverna**, com o pároco Thomas Wright como culpado — morte às 23h, **estrangulamento manual**, motivado por um escândalo de gravidez, e **sem encenação nenhuma** (o banco varia até a existência da armadilha central — ótimo para rejogabilidade, porque o jogador não pode assumir que "sempre há um relógio mentindo").

Dois detalhes me impressionaram na simulação forense: com a morte mais recente (23h–1h contra 21h dos outros casos), o corpo apresentou **"Rigidez Parcial" e "Manchas que Cedem ao Polegar"** — o gerador ajusta rigor e livores à hora real da morte, e o legista lê a janela correta (23h–01h). E a prova de presença era **"O Pertence Arrancado"** — fechado na mão do morto, um achado clássico de esganadura. A resposta do pároco ao confronto ("Meu, ou do meu feitio; coisa de vestir perde-se onde o dono nem passou") é a melhor fala gerada que encontrei.

**Vitória Absoluta com 19/19 observações em 2h de jogo interno.** O monólogo, sem encenação a expor, simplesmente omite a frase da encenação — correto.

### 5.2 Ressalvas

As mesmas do modo réplica, com um agravante de **repetição entre casos**: a fala do segredo do alfaiate Samuel Clarke é *palavra por palavra* a mesma do pároco Henry Jones no modo réplica ("Fui pedir, e o papel diz o quê. Saí com a recusa e com a vergonha, e das duas fiz segredo…"). Quem jogar os dois modos em sequência (o caminho natural da tela de título) vai notar na segunda vez. O banco tem 20 casos — variedade estrutural existe; a variedade **de superfície** é que precisa acompanhar.

Perdi as 3 perguntas ao delegado nesse modo por pressa (entrei sem perguntar) — e o jogo, coerente, não as reofereceu. A perda é permanente e silenciosa; registro como comportamento correto de design, mas vale um micro-aviso de confirmação no botão "Entrar" quando há perguntas por fazer.

---

## 6. Os 4 desfechos — como cheguei a cada um

| Desfecho | Como foi alcançado | Avaliação |
|---|---|---|
| **Vitória Absoluta** | Tutorial (run 1, 5h30 in-game): réu Crane; janela 21h–22h sustentada pela roda de contagem + corpo; causa cravada pelos 3 sinais; buril na Presença; móbil da denúncia; encenação exposta (roda × mostrador); álibi do réu desmentido pelo estalajadeiro; Walter e Rooke inocentados **com os segredos expostos**; padeiro desmentido (o epílogo pagou o lampião). Também obtida na réplica e na comarca. | O cume é exigente na medida certa: pede a cadeia inteira **e** os juízos periféricos, sem pedir nenhuma carta que o jogo não entregue. |
| **Sucesso, com Gafes** | Tutorial: cadeia sustentada (janela+causa+nexo) mas sem móbil, sem expor a encenação e com juízos vazios. | A degradação é proporcional e o texto muda de tom ("fica o travo das gafes"). O epílogo diferencia: o júri "deliberou até a madrugada". |
| **Impunidade** | Tutorial: réu certo (Crane) com cadeia vazia. | "Tenho o nome certo e as mãos vazias" — a frase de abertura já ensina o que faltou. |
| **Erro Judiciário** | Tutorial: acusei Walter sem sustentação. | O mais duro na leitura certa: "o meu laudo é hoje o seu melhor abrigo". |

O fluxo de **revisão** (permitido no vertical slice, +2h no relógio por tentativa) funcionou nas três quedas que forcei, e os ecos do legista ficam mais específicos na reincidência. Um detalhe a polir: após uma queda por **juízos em branco**, a dica da retentativa fala em "confrontar o paradeiro com o vestígio que o desmente" também para suspeitos que **não têm vestígio nenhum** (Grey, Tull — bastava marcá-los inocentes); o condicional "se esse vestígio estiver na minha mesa" salva a lógica, mas induz o jogador a procurar uma prova que não existe.

**Não há nenhum final travado.** O botão "Levar a julgamento" exige apenas réu nomeado (correto — impede o submit vazio acidental e nada mais), e a barra AINDA FALTA lista as lacunas sem dizer se o conteúdo está certo.

---

## 7. Bugs e atritos encontrados

Nenhum é bloqueante. Em ordem de prioridade:

| # | Gravidade | Onde | Descrição |
|---|---|---|---|
| B1 | **Média** | Desfechos (todos os modos) | **Concordância de gênero:** com ré mulher, o epílogo diz "Annie King foi **condenado**". Os templates de monólogo/epílogo não flexionam gênero do réu (nem de vítima, presumo). |
| B2 | **Média** | Tela de título | **Modo Purista se perde silenciosamente:** ligar o toggle **antes** de clicar no card do modo faz o jogo carregar com purista **desligado** (a troca de caso reseta o estado), embora o rótulo mostre "aceso". Ligado **depois** de escolher o modo, funciona (síntese do legista some, caderneta oferece "Tornar a pedir a leitura"). |
| B3 | Baixa | Interrogatórios | Ao fim de uma conversa encerrada não há "voltar à sala": é preciso fechar o overlay e reabrir a localidade para chamar o próximo interrogado — atrito repetido 5× por caso nos modos gerados, onde a delegacia é hub. |
| B4 | Baixa | Confronto em cena | Apresentar prova antes do paradeiro declarado consome a apresentação para sempre; o aviso chega depois do gasto (ver §3.3). |
| B5 | Baixa | Caderneta / evento #5 | A escolha da contradição (corpo × padeiro) é anunciada só por uma linha de diário; dá para platinar o caso sem nunca vê-la. |
| B6 | Baixa | Build | Chunk principal de 1,23 MB (o banco de casos gerados embarca inteiro no bundle inicial). Sem impacto em jogo local; pesa no primeiro load web. |
| B7 | Cosmético | Retentativa | Dica pós-queda sugere confronto de paradeiro para suspeitos sem vestígio correspondente (ver §6). |
| B8 | Cosmético | Persistência | O save usa uma única chave de storage para os três modos: trocar de modo descarta o caso em andamento do outro (o jogo avisa ao recomeçar, mas não há como manter dois casos em paralelo). |

**Estabilidade:** zero exceções de página no console em toda a sessão (horas de jogo, 3 modos, ~10 acusações). O fallback do WebGL para 2D disparou uma vez em ambiente de teste e o jogo seguiu sem perder estado — resiliência exemplar.

---

## 8. Sugestões de melhorias futuras

Em ordem do que eu faria primeiro:

**S1 — Flexão de gênero nos desfechos (B1).** Os pacotes já sabem o gênero dos personagens (o gerador tem elenco tipado); os templates do monólogo/epílogo precisam de `{condenado/condenada}`, `{o réu/a ré}` etc. É texto, é barato, e é o tipo de erro que quebra o encanto exatamente no clímax.

**S2 — Variedade de superfície nos casos gerados.** O maior salto de qualidade percebida por real investido: (a) banco de variantes por molde de fala (3–5 redações por template) com trava de não-repetição **dentro do mesmo caso** e, idealmente, um hash por caso para variar **entre** casos; (b) reaproveitar o gerador de interiores para dar gavetas/compartimentos às cenas geradas; (c) um aparte físico por suspeito (o equivalente ao Tull ouvindo o relógio), sorteado dos vetores psíquicos que o gerador já calcula.

**S3 — Confronto sem paradeiro: avisar antes, não depois (B4).** Uma confirmação leve ("Ele ainda não declarou onde esteve. Apresentar assim mesmo?") preserva a lição de design sem punir a curiosidade com perda permanente e silenciosa.

**S4 — Dar palco à escolha da contradição (B5).** Um selo na Caderneta ("um ponto a decidir") pulsando no botão da mesa, ou uma carta especial na mesa que abre a decisão. A mecânica existe, é boa, e hoje é invisível.

**S5 — Navegação entre interrogatórios (B3).** "↩ voltar à sala" ao fim de conversa encerrada, mantendo o overlay da localidade aberto.

**S6 — Corrigir o reset do Modo Purista (B2)** movendo `modoPurista` para fora do estado-de-caso (é preferência do jogador, não estado do caso), ou reaplicando o valor após `carregarCaso`.

**S7 — Code splitting do banco procedural (B6).** `import()` dinâmico de `casos_gerados.js` (só o modo escolhido precisa dele) deve tirar ~300 KB do bundle inicial e resolver o aviso do Vite.

**S8 — Tornar a interferência legível quando evitada.** Ganhei a corrida contra a ré sem saber que havia corrida. Um eco curto do legista na visita seguinte ("Alguém esteve aqui depois do senhor; chegou tarde — a peça já estava na sua mesa") transformaria o sistema mais sofisticado do slice em momento sentido, não só em linha de changelog.

**S9 — Micro-confirmação ao abandonar perguntas do delegado.** "Entrar deixa 3 perguntas para trás — entrar assim mesmo?" — uma vez só, na primeira. A perda permanente é boa; a perda por misclick, não.

**S10 — Painel de Álibis × Janela da Morte.** O painel já mostra as faixas declaradas; uma régua temporal fina com a janela afirmada sobreposta (sem dizer se está certa) tornaria o cotejo "ofício de quem constrói a acusação" menos mental e mais material — coerente com a filosofia do mural.

**S11 — Réplica com identidade.** "A Hora Refeita" é pedagogicamente interessante (ver a máquina recriar o caso), mas para o jogador comum é um caso gerado como outro qualquer. Vale um paratexto: uma linha final no epílogo comparando o que a máquina fez igual/diferente do caso-escola — é o único modo em que essa curadoria meta faria sentido.

**S12 — Acessibilidade dos termos clicáveis.** Os termos em negrito são `<span>` com cursor; falta `role="button"`/`tabIndex` para navegação por teclado. O mural já tem `role` e teclado nos resumos — estender o padrão.

---

## 9. Veredicto

O slice responde "sim" às duas perguntas que um vertical slice existe para responder. **O loop central diverte?** Diverte — a investigação sem custo de exame, a acusação por barbantes e o monólogo que paga elo por elo formam um arco completo com identidade própria e uma armadilha temática (a inocente que mente) que funciona mecânica e emocionalmente. **A tese procedural para?** Para de pé: o motor gera casos resolvíveis, com forense coerente à hora da morte, encenações variantes, segredos e interferência dinâmica — validei a Vitória Absoluta nos três modos.

O que separa o produto atual de "um Return of the Obra Dinn de vila inglesa" é quase todo de **superfície dos casos gerados** (repetição de moldes, cenas sem camadas, interrogatórios curtos) — e isso é uma ótima notícia, porque superfície é iterável sem tocar na arquitetura, que está sólida. Eu jogaria o jogo inteiro hoje; depois de S1–S5, eu o recomendaria sem ressalva.

---

*Anexos: capturas de tela das principais etapas (título, escrivaninha 3D, exame do corpo, mural com barbantes, confirmação da acusação, monólogo de Vitória Absoluta nos 3 modos, os 4 desfechos, mobile 2D).*
