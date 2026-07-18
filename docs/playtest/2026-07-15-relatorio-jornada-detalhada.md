# MORTEM — Relatório de Playtest do Vertical Slice

**Data:** 15 de julho de 2026
**Build:** Vertical Slice — "A Hora Emprestada" (tutorial)
**Stack:** Vite + React + Tailwind + Zustand
**Método:** Playtest isento (sem consulta às diretrizes internas do repositório); avaliação como jogador de primeira viagem, cobrindo fluxo qualitativo (narrativa, UX, atmosfera) e funcional (mecânicas, bugs, bloqueios). Simulação de jornada completa com tentativa de alcançar todos os finais.

---

## 1. Resumo Executivo

O vertical slice de MORTEM entrega uma proposta rara e ambiciosa: um jogo de investigação forense em que o jogador não escolhe a resposta de um menu — ele a constrói a partir de evidências físicas, raciocínio dedutivo e um modelo forense determinístico. A narrativa em prosa vitoriana é de qualidade literária acima da média do gênero, e o sistema de acusação por "barbantes" (ligações carta-a-âncora) é mecanicamente sólido. Todos os quatro finais são alcançáveis e verificados.

O principal risco, porém, é o mesmo que faz o jogo especial: a barreira de entrada. Um jogador que não entenda como as janelas temporais funcionam, como a roda de contagem traduz badaladas em horas, ou como a etapa V ("Os Juízos") espera que segredos sejam expostos antes do veredito de inocência — esse jogador vai ao final "Impunidade" ou "Sucesso com Gafes" sem entender o que faltou.

---

## 2. Jornada do Jogador — Simulação Passo a Passo

### 2.1 Tela Inicial → Abertura

A sequência de abertura em seis passos é exemplar. A pensão da Sra. Potts, a carta do delegado, a transformação da mesa: cada beat estabelece tom, planta o vocabulário da época e faz a transição de "leitor" para "perito" sem tutorial mecânico. O briefing do Delegado Wycliffe é especialmente bem desenhado — as quatro perguntas opcionais (hora da morte, herdeiro, desafetos, coabitantes) plantam iscas e dados reais sem que o jogador perceba que está sendo manipulado.

**Ponto de atrito:** não há indicação de que as perguntas do briefing são opcionais. Um jogador apressado pode clicar "Entrar — iniciar a investigação" sem perguntar nada e perder contexto que o jogo assume que ele tem.

### 2.2 A Escrivaninha (Hub)

A escrivaninha funciona como hub permanente: o jogador nunca "sai" dela. Locais, interrogatórios, caderneta e mural de acusação abrem como overlays. A maquete 3D da vila (lazy-loaded, com fallback 2D) é um charme visual, mas não altera a jogabilidade.

**Pontos de atrito:**
- O botão "CONSTRUIR A ACUSAÇÃO" (placa de latão no topo) é visualmente elegante, mas fica distante dos botões de ação na parte inferior (Caderneta, Painel de Álibis, Glossário, Som). Um jogador de primeira viagem pode não perceber que é clicável, ou confundi-lo com um título decorativo.
- O relógio de bolso no canto mostra a hora do jogo, mas não há explicação de que o tempo só avança ao viajar entre locais. O jogador pode ficar com medo de examinar evidências, achando que está "gastando tempo", quando na verdade examinar é gratuito.
- Os quatro botões do painel inferior (Caderneta, Álibis, Glossário, Som) não têm tooltip nem indicação de conteúdo novo. O jogador precisa abrir cada um para descobrir o que fazem.

### 2.3 Coleta de Evidências

Visitar cada local revela prosa imersiva com termos clicáveis em negrito (marcadores `[[id_da_carta]]`) que extraem cartas. Algumas cartas requerem micro-gestos (voltar o corpo, dar corda ao relógio, contar entalhes), que são mecânicas excelentes — fazem o jogador sentir-se perito.

**Pontos de atrito:**
- A diferença entre "cartas perecíveis" e "cartas duráveis" nunca é explicada ao jogador. O sistema funciona perfeitamente (o rigor degrada em três estados mas nunca vira nulo; o livor e o relógio de bolso são fixos), mas o jogador não sabe que chegar cedo ao corpo tem vantagem. A degradação é invisível para quem não percebe.
- A extração de cartas é irreversível e instantânea. Não há confirmação ("Examinar o corpo agora?") nem indicação do que foi coletado naquela visita versus o que resta por coletar.
- Em locais com pontos de interesse (cena, oficina), a divisão em sub-áreas (lareira, escrivaninha, vitrine, copa) é clara, mas o jogador não tem indicação visual de quais pontos já foram explorados e quais ainda têm conteúdo.

### 2.4 O Modelo Forense (Algor / Rigor / Livor)

O coração mecânico do jogo. O modelo é determinístico e correto:
- Algor: corpo esfria 1°C/h de 37°C até a temperatura ambiente (11°C), com margem de ±2h.
- Rigor: instalando (2–12h), pleno (12–24h), resolução (24–36h), resolvido (36h+).
- Livor: móvel até 12h, fixo após (com posição compatível confirmando que o corpo não foi movido).

**Ponto de atrito crítico:** o jogador nunca é ensinado a fazer essa conta. O legista/mestre FALA a leitura ("Morto entre X e Y"), mas só depois que o jogador coletou as cartas relevantes. Se o jogador não coletou a temperatura (que requer clicar no termômetro — ação especial, não negrito), a janela fica mais larga. O sistema funciona, mas o jogador pode não saber que medir a temperatura é uma ação disponível, e ainda menos que ela estreita a janela.

### 2.5 Interrogatórios e Diálogos

Cada suspeito tem uma árvore de diálogo com dois beats e quatro tons (firme, cordial, técnico, oblíquo). Os tons alteram o sabor narrativo mas todos convergem para a mesma informação — nenhum tom tranca conteúdo crítico, o que é uma decisão acertada.

A mecânica de "confronto" (apresentar uma carta durante o interrogatório, via `reacoesProva`) é a peça-chave narrativa: força a reação do suspeito e pode extrair cartas novas. É bem implementada — cada diálogo define quais cartas provocam reação e qual carta é extraída em resposta.

**Pontos de atrito:**
- A descida no diálogo é sequencial e sem retorno. Se o jogador avança para o beat 2, não pode voltar ao beat 1. Em si isso é uma decisão de design válida (simula o tempo de uma conversa real), mas não há indicação de que a descida é irreversível.
- O botão de confronto (apresentar evidência) não indica quais cartas são "relevantes" para aquele interrogatório. O jogador pode apresentar qualquer carta e receber "sem reação", sem saber que existe uma carta específica que provocaria confissão.
- Após encerrar um interrogatório, não é claro se o jogador pode voltar a interrogar o mesmo suspeito. A interface não indica se aquela conversa foi "consumida".

### 2.6 O Relógio e a Viagem

O tempo só avança ao viajar (0h dentro do mesmo grupo de locais, 1h entre vila e relojoaria, 1.5h para Moorford). Examinar é gratuito. Essa é possivelmente a regra mais importante para o jogador, e não é comunicada explicitamente em nenhum momento.

O custo de 2 horas para "Revisar a acusação" (reabrir o mural depois de submetida) é significativo — se o jogador erra a acusação e quer refazer, paga um preço temporal. Essa mecânica não é explicada antes de aparecer.

**Ponto funcional:** o gabinete de Pettigrew (em Moorford, fora da vila) custa 1.5h por trecho. Ele é desbloqueado por encontrar as cartas `dep_testamento` ou `ev_livro_ordens`. Um jogador que não visita a delegacia (e portanto não encontra o testamento) nem a oficina (e portanto não encontra o livro de ordens) nunca desbloqueia esse local — e perde acesso a cartas adicionais. Isso é intencional (faz parte do fair play do tutorial), mas pode frustrar.

### 2.7 O Mural de Acusação

Cinco estações progressivas:

**I. O Corpo (Quando e Como):** o jogador declara a janela de morte (hora de início e fim) e a causa do óbito (escolha de menu entre 10 causas forenses). Precisa ASSINALAR cartas temporais e causais.

**II. A Presença (O Réu na Cena):** nomeia o acusado e LIGA (barbante) um vestígio instrumental que o conecta à cena do crime.

**III. As Mentiras (Depoimentos Desmentidos):** LIGA um fato físico ao depoimento que ele contradiz — expõe a cena encenada e testemunhos falsos.

**IV. O Móbil:** aponta a motivação (seleciona uma carta de motivo).

**V. Os Juízos:** declara cada não-acusado como "culpado", "inocente" ou "sem juízo".

**Pontos de atrito críticos:**

- **A janela de morte (etapa I):** o jogador precisa traduzir os dados das cartas (rigor pleno = 12-24h IPM, livor fixo = ≥12h IPM, temperatura medida) em horas absolutas no relógio. Se a morte foi às 21h de 13/outubro e o exame é a partir de ~12h de 14/outubro, o IPM é ~15h. A conversão de "IPM de 12-24h" para "morreu entre as 12h e as 24h do dia 13" não é trivial, e o jogo não oferece uma calculadora ou guia. O mestre/legista enuncia a janela ao jogador ("Morto entre..."), o que ajuda — mas só se o jogador coletou as cartas e consultou a Caderneta.

- **O conceito de "cravar por eliminação" (etapa I, causa):** o jogador precisa ligar cartas causais suficientes para que o catálogo de causas reduza por eliminação a uma causa única. Com as cartas certas (ferida incisa + reação vital + instrumento buril), isso acontece naturalmente. Mas o jogador pode não entender POR QUE selecionou uma causa — o sistema não mostra o raciocínio de eliminação.

- **A ligação instrumental (etapa II):** o jogador precisa ligar o vestígio que É a arma (buril de Silas) ao réu E à cena. Ligar outro vestígio do réu (vidro da calça) junto funciona como reforço, mas ligar SÓ um vestígio de terceiro é gafe. O conceito de "vestígio instrumental" versus "vestígio acessório" nunca é explicado.

- **A etapa V (Os Juízos):** para que um inocente-com-segredo (Walter, Agnes) seja aceito como "inocente" pelo veredito, o jogador precisa ter EXPOSTO O SEGREDO — i.e., ter refutado o álibi desse suspeito usando o vestígio que revela a mentira (o registro da estalagem para Walter, a cesta de ceia para Agnes). Se o jogador simplesmente declara "inocente" sem ter feito esse trabalho, o jogo conta como erro. Essa exigência é tematicamente brilhante (o perito precisa ENTENDER por que o inocente mentiu), mas é a mecânica mais opaca de todo o jogo. O jogador não tem como adivinhar que "inocente" exige trabalho prévio de exposição de segredo.

### 2.8 O Veredito e os Finais

Após submeter a acusação ("Levar a julgamento"), o sistema calcula o veredito e gera o Monólogo do Detetive seguido do Epílogo.

---

## 3. Mapeamento dos Quatro Finais

### 3.1 Vitória Absoluta

**Requisitos:** réu correto (Silas Crane), cadeia sustentada (janela correta com cartas ligadas, causa cravada, nexo instrumental), janela precisa (≤6h de largura), motivação correta (silenciamento, via livro de ordens ligado a Silas), cena encenada exposta (relógio da lareira refutado), periféricos todos julgados corretamente (cada inocente com segredo exposto), nenhum vestígio acessório de terceiro ligado.

**Caminho do jogador:**
1. Examinar corpo completamente (rigor, livor, termômetro, ferida, resíduo, relógio de bolso)
2. Explorar cena (relógio da lareira, maquinismo, vitrine, fechadura, cesta Rooke, súplica Walter)
3. Visitar oficina (estojo buril, livro de ordens, hábito da corda, alibi Davey)
4. Interrogar Silas (alibi, comportamento, vidro na calça)
5. Visitar delegacia (testamento, dívidas, queixa Grey, visto vivo, avistamento padeiro, mulher na viela)
6. Visitar estalagem (alibi Walter, registro estalagem, corroboração estalajadeiro)
7. Visitar papelaria (alibi Agnes, cesta Agnes)
8. Visitar moinho (alibi Caleb)
9. Construir acusação perfeita: janela 20h-23h (IPM correto), causa ferida por arma branca, réu Silas, vestígio instrumental buril, refutar relógio da lareira (ligando maquinismo), refutar avistamento do padeiro, refutar álibi de Silas (ligando corroboração do estalajadeiro), motivação silenciamento, expor segredo de Walter (suplica + registro estalagem), expor segredo de Agnes (cesta + anel), julgar Caleb e Davey inocentes com álibi

**Status:** ALCANÇÁVEL. Verificado pelo código e pela validação QA. O caminho é exigente mas possível.

### 3.2 Sucesso com Gafes

**Requisitos:** réu correto, cadeia sustentada, mas com pelo menos uma falha não-fatal (janela imprecisa, motivação errada, encenação não exposta, periférico mal julgado, ou vestígio acessório ligado).

**Exemplo de caminho:**
- O jogador acerta o réu (Silas), acerta a causa e o nexo instrumental, mas declara a janela larga demais (ex: -6h a 0h, cobrindo a hora real mas com >6h de largura), ou esquece de refutar o relógio da lareira, ou julga Walter "inocente" sem ter exposto o segredo da súplica.

**Status:** ALCANÇÁVEL. É o final mais provável para um jogador competente mas não exaustivo.

### 3.3 Impunidade

**Requisitos:** réu correto, mas a cadeia NÃO é sustentada — falta janela, ou causa não cravada, ou nexo não estabelecido, ou nenhuma evidência do corpo ligada.

**Exemplo de caminho:**
- O jogador acerta "Silas é o culpado" mas não liga cartas suficientes aos pilares. Declara a janela sem assinalar cartas temporais, ou escolhe a causa sem ligar sinais causais, ou não liga o buril à âncora de presença.

**Status:** ALCANÇÁVEL. É o final do jogador que "sabe a resposta" mas não construiu a prova.

### 3.4 Erro Judiciário

**Requisitos:** réu ERRADO (qualquer suspeito que não seja Silas Crane).

**Exemplo de caminho:**
- O jogador acusa Walter Arthurs (herdeiro endividado, iscas abundantes) ou Caleb Grey (moleiro com queixa formal). As iscas do caso são deliberadamente desenhadas para atrair esse erro — Walter tem motivo (herança + dívidas), oportunidade aparente (briga na loja ao anoitecer), e a carta de súplica incrimina se lida sem cuidado.

**Status:** ALCANÇÁVEL. O epílogo revela o verdadeiro autor e o erro do perito.

---

## 4. Avaliação Qualitativa

### 4.1 Narrativa e Prosa

**Ponto forte principal.** A prosa é de qualidade literária consistente — vocabulário vitoriano sem ser pastiche, voz do narrador controlada, zero anacronismo detectado. As vozes dos personagens são diferenciadas (Wycliffe fala em orações longas e cheias de ressalvas; Silas é econômico e solícito; Agnes é cortante). O briefing do delegado é um modelo de como plantar pistas e iscas numa conversa natural.

O monólogo final do detetive é construído por blocos de template (zero LLM, totalmente determinístico) e funciona surpreendentemente bem — consegue soar como prosa autoral apesar de ser montagem. As variantes por hash salgado evitam repetição entre partidas.

O epílogo fecha com consequência: o destino do réu, dos periféricos e do perito em 2-4 parágrafos. A flexão pela hora do selo (dia/noite) é um detalhe fino.

### 4.2 Atmosfera e Ambientação

A ambientação em outubro de 1893, numa vila inglesa fictícia, é consistente e evocativa. Os detalhes materiais (cera de lacre, lampião de bancada, tinta dourada no vidro do mostrador) constroem verossimilhança sem explicar demais. A temperatura ambiente de 11°C (constante do modelo forense) casa com outubro na Inglaterra.

A pontuação sonora (sinos, passos) é mencionada no código mas não foi possível avaliar sem execução no navegador. O código usa um sistema de tocar som (`tocarSom`) com eventos nomeados.

### 4.3 Design de Pistas

O caso tutorial é excepcionalmente bem desenhado como máquina de fair play:

- **Iscas calibradas:** Walter Arthurs (herdeiro endividado, briga na loja) é a armadilha primária. Caleb Grey (queixa formal, rancor público) é a secundária. Ambos têm cartas de motivo marcadas como `isca: true`. O jogador atento percebe que os motivos deles são RUIDOSOS demais — o verdadeiro assassino (Silas) tem o motivo SILENCIOSO (fraude descoberta, a ser exposta pelo livro de ordens).

- **O relógio como mentira física:** o relógio da lareira (parado às 08h45, mas ESMAGADO entre 21h e 22h conforme a roda de contagem) é a peça-chave da encenação. O jogo planta a pista no relógio irmão da oficina (a roda de contagem à vista) e no verbete do Glossário. A conversão é do jogador — brilhante.

- **O avistamento do padeiro:** a "luz vista de madrugada" é real (um lampião esquecido), mas a leitura "vivo às 5h" é do rapaz. A impossibilidade (o corpo já estava morto desde ~21h) é detectável pela janela forense. A explicação é paga no epílogo se o jogador refutou esse depoimento.

- **Os inocentes que mentem:** Walter mente sobre a hora de chegada à vila (estava na estalagem, não em Moorford); Agnes mente sobre ter ficado em casa (estava jantando com o relojoeiro — o noivado secreto). Ambas as mentiras são por vergonha, não por sangue. A exposição desses segredos é o trabalho mais sofisticado que o jogo pede ao jogador.

### 4.4 Sistema de Acusação

O mural de cinco estações é mecanicamente elegante. A progressão (O Corpo → A Presença → As Mentiras → O Móbil → Os Juízos) espelha a construção lógica de um laudo pericial real. O "barbante" (ligação visual de Bézier entre carta e âncora) é uma metáfora que funciona — o jogador literalmente "costura" a cadeia probatória.

A tela de Revisão Final antes de submeter é uma boa rede de segurança.

---

## 5. Avaliação Funcional

### 5.1 Mecânicas Verificadas (Funcionais)

- **Degradação temporal:** o rigor mortis degrada corretamente em três estados pelo IPM. A carta nunca vira nula — o sinal perde precisão mas mantém valor. Verificado pelo código e pelo script QA.
- **Janela de morte por interseção:** a interseção de janelas (algor ± 2h, rigor, livor, visto-vivo, rotina interrompida, registro mecânico) funciona corretamente. `intersecaoJanelas` detecta contradições e retorna null.
- **Auto-save via localStorage:** o estado persiste entre sessões. O jogador pode fechar o navegador e retomar.
- **Fallback 2D:** sem WebGL, a grade 2D substitui o diorama 3D sem perda funcional. O `?flat=1` força o modo 2D.
- **Desbloqueio condicional de Moorford:** o gabinete Pettigrew só aparece após cartas específicas. Funcional.
- **Confronto em interrogatório:** apresentar uma carta relevante extrai reação e cartas novas. Funcional.

### 5.2 Pontos Funcionais de Atenção

- **Sem indicação de progresso na coleta:** não existe checklist nem indicador de "cartas coletadas / cartas totais" por local. O jogador não sabe se perdeu alguma coisa.
- **Sem "desfazer" na acusação:** uma vez que o jogador liga um barbante ou seleciona uma janela, a interface permite desfazer (reabrir a estação), mas não é óbvio como. "Arrastar um resumo de volta reabre a estação" é um padrão não-convencional.
- **A revisão custa 2h:** após submeter uma acusação fraca, o jogador pode "Revisar" (custo de 2h de relógio). Esse custo não é comunicado antes de aparecer, e pode surpreender.
- **Sem feedback de "o que faltou":** após o veredito, o monólogo do detetive e o epílogo comunicam narrativamente o resultado, mas não dizem MECANICAMENTE o que o jogador errou. Isso é deliberado (o jogo respeita a inteligência do jogador), mas pode frustrar quem quer entender por que não atingiu a Vitória Absoluta.

### 5.3 Testes e Validação

O repositório inclui um script QA (`scripts/qa_vertical_slice.js`) que verifica:
- 30+ condições de integridade (tags, localidades, diálogos, cartas, mapa, causas, veredito, seeds)
- Todas passam com "CASO VÁLIDO"
- Confirmação de que os 4 finais são mecanicamente alcançáveis

O build (Vite) compila sem erros nem warnings. Nenhum módulo fica sem importação; nenhuma dependência está faltando.

---

## 6. Bugs Encontrados

Nenhum bug bloqueante foi encontrado na análise de código. A build compila limpo, o QA passa integralmente, e a lógica é determinística e coberta por funções puras.

**Possíveis edge cases a monitorar:**

- Se o jogador medir a temperatura do corpo com IPM muito alto (corpo já em equilíbrio térmico com o ambiente), o algor retorna uma janela de piso sem teto (`[horasAteEquilibrio, Infinity]`). Isso é comportamento correto (o algor perdeu precisão), mas a janela muito larga pode confundir.
- Se nenhuma carta temporal for coletada, `calcularJanelaMorte` retorna `null` com motivo textual. A interface precisa tratar esse caso na etapa I do mural (e parece fazê-lo — a janela fica vazia e o jogador precisa preenchê-la manualmente).

---

## 7. Sugestões de Melhoria

### 7.1 Prioridade Alta (Impacto na Retenção do Jogador)

**7.1.1 — Tutorial da Mecânica Forense**
O jogo deveria incluir um breve tutorial contextual na PRIMEIRA VEZ que o jogador coleta uma carta temporal. Algo como: "O mestre anota na caderneta: a rigidez indica que a morte ocorreu entre 12 e 24 horas antes do exame." O jogador precisa entender que cada carta temporal gera uma janela, e que a interseção dessas janelas é a hora da morte. Sem isso, a etapa I do mural é opaca.

Formato sugerido: tooltip in-game ou nota na caderneta (não popup modal). O sistema já tem o legista/mestre falando — basta garantir que a fala apareça no momento certo e que a caderneta registre as conclusões do mestre de forma visível.

**7.1.2 — Indicação de "Cartas por Descobrir"**
Após visitar um local, o jogador deveria ter alguma indicação sutil de que ainda há conteúdo por explorar ali. Não precisa ser explícito ("faltam 2 cartas") — pode ser visual: o ícone do local na maquete muda de cor, ou os pontos de interesse já visitados ficam marcados. A imersão é compatível com esse feedback se ele for diegético (ex.: "o perito faz uma marca a lápis na caderneta para indicar que há mais a ver").

**7.1.3 — Explicar que Examinar Não Custa Tempo**
Em algum momento do início (talvez na transformação da mesa ou na chegada a Briarstone), o jogo deveria comunicar: "Examinar o corpo e a cena é o trabalho do perito — não aperta o relógio. Só a viagem entre localidades gasta horas." Sem essa informação, o jogador pode jogar apressadamente por medo de perder tempo.

**7.1.4 — Feedback Pós-Veredito**
Após o monólogo e epílogo, uma tela opcional de "Laudo do Caso" deveria listar os pilares (Quando, Como, Presença, Mentiras, Móbil, Juízos) com indicação de quais foram plenamente sustentados e quais tiveram falha. Não precisa revelar A resposta — apenas quais elos da cadeia estavam fracos. Isso transforma uma derrota em aprendizado e incentiva a repetição.

### 7.2 Prioridade Média (Qualidade de Vida)

**7.2.1 — Tooltip no Relógio de Bolso**
O relógio no canto da tela deveria, ao ser tocado/clicado, explicar brevemente a hora e o custo de viagem: "São 14h. Viajar para a vila custa 1 hora."

**7.2.2 — Indicador de "Nova Entrada" na Caderneta**
Quando uma nova carta é extraída ou o mestre faz uma leitura, o botão da Caderneta deveria piscar ou mostrar um ponto de notificação. O jogador precisa saber que há informação nova sem ter que abrir a caderneta a cada ação.

**7.2.3 — Confirmação antes de Avançar no Diálogo**
Antes de descer para o próximo beat de um interrogatório, uma linha como "Não há mais perguntas sobre este assunto — avançar?" ajudaria o jogador a entender que a descida é irreversível.

**7.2.4 — Indicação de Cartas Relevantes no Confronto**
Ao abrir a opção de confrontar um suspeito com evidência, as cartas que provocariam reação poderiam ter uma borda levemente diferente (sem revelar qual é a "certa" — apenas indicar que são cartas de tipo relevante para aquele contexto).

**7.2.5 — Miniatura de Resumo no Mural**
Quando uma estação do mural é concluída e vira resumo fixado, esse resumo deveria ser expandível com um clique para lembrar o jogador do que ele declarou, sem precisar reabrir a estação inteira.

### 7.3 Prioridade Baixa (Polish e Profundidade)

**7.3.1 — Animação de Degradação**
Quando o jogador chega tarde ao corpo e o rigor já cedeu, uma breve animação ou mudança visual no texto da carta (marca de "degradado") reforçaria a sensação de perda. O código já trata os estados degradados; a interface poderia refletir isso visualmente.

**7.3.2 — Segundo Caso de Contraste**
O tutorial é excepcional como primeiro caso, mas o jogador só vai internalizar as mecânicas ao jogar um SEGUNDO caso com dinâmica diferente (ex.: causa por asfixia em vez de arma branca, sem cena encenada, com álibi do réu verdadeiro). O catálogo de causas já suporta 10 mecanismos em 3 famílias — há espaço para casos radicalmente diferentes.

**7.3.3 — Modo Procedural**
O código já prevê um "modo procedural" (sem mestre, o jogador lê por conta própria). Esse modo deveria ser desbloqueado após completar o tutorial com sucesso, como recompensa e como desafio elevado.

**7.3.4 — Modo Noturno / Diurno na Vila**
O modelo de tempo já sabe se é dia ou noite (usado no epílogo). A maquete 3D poderia refletir isso — lampiões acesos à noite, luz amarela de outubro durante o dia. Reforça a passagem do tempo e a urgência.

**7.3.5 — Acessibilidade**
Não há suporte a leitores de tela nem alto contraste. Os textos longos em prosa podem ser difíceis em telas pequenas. Considerar tamanho de fonte ajustável e modo de alto contraste.

---

## 8. Parecer Final

MORTEM entrega o mais ambicioso sistema de investigação forense que já vi num jogo independente: determinístico, justo, e profundo o bastante para recompensar o raciocínio genuíno do jogador. O caso tutorial é uma máquina de relojoeiro (fittingly) — cada peça encaixa, cada isca tem contraponto, e o fair play é rigoroso.

O risco é a curva de aprendizado. A distância entre "jogador que entende as mecânicas" e "jogador que não entende" é enorme, e o jogo atual não faz o bastante para cruzar essa distância. As sugestões de prioridade alta (tutorial forense contextual, indicação de progresso, explicação do relógio, feedback pós-veredito) são intervenções relativamente pequenas que podem resolver isso sem comprometer a inteligência do design.

A build está limpa, sem bugs bloqueantes, com todos os quatro finais alcançáveis e verificados. O vertical slice está pronto para ser jogado — e, com os ajustes sugeridos, pronto para ser ENTENDIDO.

---

*Playtest realizado por análise de código-fonte completa (lógica, dados, componentes, store) com simulação de jornada do jogador. Build verificada: compilação sem erros, QA passando integralmente (30+ verificações, "CASO VÁLIDO"). Nenhum bug bloqueante encontrado.*
