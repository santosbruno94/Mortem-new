# MORTEM — Relatório de Playtest do Vertical Slice

**Build:** `Mortem-new` (main) · **Data do teste:** 14/07/2026 · **Método:** playtest cego no navegador (Chromium, desktop 1280×720 e mobile 390×844), sem consultar as diretrizes do repositório. Duas campanhas completas + uma corrida de estresse ("jogador apressado"). Todos os quatro desfechos foram alcançados em jogo real.

---

## 1. Veredicto geral

O vertical slice **funciona de ponta a ponta** e já entrega o que promete: um mistério de dedução forense com identidade fortíssima. Em ~11h30 de tempo diegético percorri os 9 lugares, registrei as 36 observações, levei 4 acusações a julgamento e fechei o caso com a Vitória Absoluta. Nenhum crash, nenhum softlock, nenhum erro de runtime durante o jogo.

Como jogador, a impressão dominante é de **texto e desenho de caso acima da média do gênero** — o quebra-cabeça dos relógios é dos melhores que já vi em jogo de dedução — travados por **dois atritos reais**: a ausência de qualquer salvamento e a baixa sinalização da mecânica de "confrontar o paradeiro" dentro dos Juízos, que quase me custou o final bom.

---

## 2. O que funciona (verificado em jogo)

Seleção de personagem, prólogo em 6 páginas, perguntas opcionais ao delegado, hub com vila em 3D e relógio de bolso, viagem com custo de tempo (1h/1h30), exame de cena com termos clicáveis e fichas de coleta, medição de temperatura, interrogatório com tópicos e apresentação de prova, local desbloqueável (Gabinete Pettigrew), Caderneta com diário e leitura do legista, Painel de Álibis, Glossário forense, mural de acusação em 5 estações com barbante e tachas, revisão de partes por arrasto, julgamento com 4 desfechos graduados, ciclo de revisão custando 2h por audiência, epílogo com estatísticas da investigação e retorno limpo à tela de título.

Dois sistemas merecem elogio explícito por serem *simulados de verdade*, não cenografia:

- **Decaimento de evidência.** Medi o corpo às 11h00: 23°C. Numa segunda campanha, vadiei pela vila e medi às 16h00: **18°C** — exato 1°C por hora, como o glossário ensina. O aviso "o que se quiser datar com precisão, date cedo" é honesto: a ordem das ações do jogador tem consequência pericial real.
- **Feedback pós-julgamento.** O monólogo final é gerado a partir do que está de fato na mesa, e o bloco "O que faltou — cortesia do tutorial" diagnostica cada elo fraco. Na corrida de estresse (acusar Walter com mural vazio, causa e janela erradas) o jogo aceitou, condenou o inocente e devolveu um Erro Judiciário com 8 apontamentos corretos — e a frase mais cruel do jogo: *"o meu laudo é hoje o seu melhor abrigo"*.

---

## 3. Defeitos e atritos encontrados

**P0 — Sem persistência.** Não há salvamento algum (localStorage vazio; recarregar a página no meio do caso volta à tela de título e perde tudo). Numa sessão de 1–3 horas, um F5 acidental, uma queda de bateria ou o navegador mobile descartando a aba destroem a partida inteira. É o único item que eu chamaria de bloqueador para colocar a build na mão de testadores externos.

**P1 — A mecânica escondida dos Juízos.** Para o veredicto limpo, marcar Walter e Sra. Rooke como "Inocente" não basta: é preciso, dentro do sub-painel que se abre ao escolher Inocente, ligar o vestígio que desmente o paradeiro de cada um (registro da estalagem; cesta de ceia). Eu levei **três audiências** para descobrir isso, porque (a) escolher "Inocente" não gera nenhuma reação do checklist, (b) o sub-painel abre abaixo da dobra sem chamar atenção, e (c) a dica do tutorial repete o mesmo texto genérico ("cada um merece o veredicto que as cartas fundamentam") para qualquer combinação errada — testei Inocente, Sem juízo e Cúmplice e recebi a mesma frase três vezes. Uma dica progressiva (segunda falha → "escolher Inocente pede confrontar o paradeiro declarado com o vestígio que o desmente") resolveria sem entregar a resposta.

**P1 — "Puxe para rever" só funciona por arrasto.** Clicar na barra de uma estação concluída não faz nada; só o gesto de arrastar reabre. Descobri por tentativa e erro. Aceitar clique simples (além do arrasto) custaria pouco e ajudaria também acessibilidade e mobile.

**P2 — Rótulo da estação III ignora álibis.** Com três mentiras confrontadas (duas de hora, uma de paradeiro), a barra recolhida diz "2 mentira(s) de hora exposta(s)" e o resumo pré-julgamento lista só as duas de hora. A refutação do álibi do réu — que o motor conta e o monólogo cita — fica invisível no resumo, o que me fez achar que a ligação tinha falhado.

**P2 — Interrogatório sem estado "feito".** "Apresentar: Livro de Ordens de Serviço" continua disponível e idêntico depois de apresentado; tópicos esgotados somem, mas a apresentação não marca conclusão. E o vestígio mais incriminador que carrego (o vidro na dobra da calça do próprio Silas) não pode ser apresentado a ele — senti falta dessa confrontação.

**P2 — Mobile esconde o custo de viagem.** Em 390×844 o hub renderiza bem, mas os cartões dos lugares mostram só o nome — sem "EXAMINAR/INTERROGAR" nem "viajar · 1h". A economia de tempo, que é a decisão central do jogo, fica invisível justamente na tela onde se decide viajar. O mapa também vaza da tela à direita (O Moinho cortado) com affordance de rolagem muito sutil.

**P3 — Miudezas.** Favicon 404 no console; aviso `THREE.WebGLRenderer: Context Lost` após longa inatividade da aba (vale tratar restauração de contexto para não deixar o mapa preto); clicar em outro lugar do hub com um modal aberto é silenciosamente ignorado (correto, mas sem feedback); no desktop, a faixa central da tela do hub fica inteiramente vazia — o mapa ocupa o terço superior e os botões o rodapé, sobrando um vão escuro grande no meio.

---

## 4. Avaliação qualitativa (como jogador)

**Prosa e voz.** O texto é o grande trunfo da build. Período consistente, personagens com idioleto próprio (o delegado que "a andar me saio melhor", o Silas de mãos quietas nos joelhos, a Sra. Rooke que "responde o que se pergunta, nem uma palavra além"). As fichas de coleta são pequenas peças de observação pura que dão prazer de ler duas vezes. Em ~36 cartas e dezenas de telas não encontrei um typo.

**O caso.** Fair play exemplar. A pista central (roda de contagem pousada na nona batida × ponteiros em 8h45) é física, verificável e ensina o jogador a desconfiar de relógios; o relógio de bolso com 30 horas de corda amarra a janela por outro caminho independente; e o algor/rigor/livor fecham o triângulo. As pistas falsas (as dívidas de Walter, o rancor do moleiro, a luz das cinco da madrugada) são todas resolvidas honestamente no epílogo — a luz que era só o lampião queimando até secar é um detalhe de mestre. A teoria errada vem plantada da melhor forma possível: pela boca simpática do delegado.

**Dificuldade e ritmo.** A dedução principal (culpado, janela, causa, móbil) é de dificuldade média e muito satisfatória de montar. A economia "examinar é grátis, viajar custa hora" cria decisões reais sem estressar, e o decaimento do corpo dá urgência genuína à primeira hora. O pico de dificuldade está no lugar errado: não no raciocínio, mas em descobrir *a interface* dos Juízos (ver P1). A leitura automática do legista na Caderneta ("óbito entre 21h00 e 22h00 · buril de gravador") é generosa — jogadores puristas talvez preferissem chegar sozinhos a essa síntese; fica a sugestão de um modo sem essa ajuda.

**Interface e estética.** A linguagem visual (papel, latão, tachas, barbante vermelho) é coesa e charmosa; o mural de acusação em estações que se recolhem em tiras de papel é a melhor tela do jogo. O mapa 3D da vila cumpre o papel com simpatia, embora hoje seja mais um menu bonito do que um espaço — nada nele reage ao progresso da investigação.

**Fantasia cumprida.** O jogo promete "perito vitoriano" e entrega: eu medi temperatura, li lividez, desmontei uma encenação e paguei o preço moral de expor segredos de inocentes para inocentá-los. Esse último toque — a Vitória Absoluta custa constrangimento público a duas pessoas — é maturidade narrativa rara.

---

## 5. Sugestões de melhorias futuras

Em ordem de retorno por esforço:

1. **Auto-save contínuo** (localStorage a cada ação) + botão "Continuar o caso" na tela de título. Um caso é uma sessão longa; hoje o jogo aposta que nada dará errado no navegador do jogador.
2. **Sinalização progressiva nos Juízos**: escolher "Inocente" deveria acrescentar uma linha neutra ao checklist (ex.: "paradeiro de X por confrontar"), e a cortesia do tutorial deveria escalar a especificidade a cada audiência falhada no mesmo ponto.
3. **Clique além do arrasto** para reabrir estações do mural; e contar refutações de paradeiro no rótulo da estação III.
4. **Mobile:** custo de viagem visível nos cartões do hub e indicador claro de rolagem do mapa. O resto da experiência mobile já está surpreendentemente sólida.
5. **Mais confrontação no interrogatório:** permitir apresentar o vidro da calça (e outras cartas) a Silas, mesmo que a resposta seja evasiva — apresentar prova é o gesto mais "detetive" do jogo e hoje só existe uma vez. Marcar provas já apresentadas.
6. **Um "modo purista"** que silencie a síntese automática do legista (Janela da Morte / Mecanismo) até o jogador afirmá-las no mural — transforma a Caderneta de gabarito em bloco de notas.
7. **Vida no hub:** pequenas mudanças no mapa conforme o dia avança (luzes acendendo ao anoitecer, o guarda saindo da porta) fariam o custo de tempo ser *sentido*, não só contabilizado.
8. **Polimento técnico:** favicon, restauração de contexto WebGL, feedback visual quando um clique de viagem é ignorado por haver modal aberto.
9. **Pós-slice:** um segundo caso reaproveitando o motor provaria a tese do projeto; a estrutura de seed/cartas parece pronta para isso.

---

## 6. Registro da sessão

Campanha 1 (completista): chegada 11h00 → cena, corpo (23°C), oficina, interrogatório de Silas → Estalagem 12h → Delegacia 13h → Rooke 14h → Moinho 15h → Pettigrew 16h30 → 4 audiências (Impunidade → Gafes → Gafes → **Vitória Absoluta**), caso selado às 22h30 com 36/36 observações. Campanha 2 (verificação): perguntas ao delegado, decaimento térmico (18°C às 16h00), teste de recarga (progresso perdido), layout mobile. Corrida de estresse: acusação vazia → **Erro Judiciário** com feedback completo.
