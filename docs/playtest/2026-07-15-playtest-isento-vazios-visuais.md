# Playtest isento — MORTEM: "A Hora Emprestada" (vertical slice)

**Data:** 15/07/2026
**Método:** jogado ponta a ponta no navegador (Chromium via Playwright), como um jogador comum jogaria — sem consultar `MORTEM_CONTEXTO.md`, os guias de estilo ou os playtests anteriores do próprio repositório antes de formar opinião. Só depois de escrever as impressões abaixo é que os scripts de QA do projeto foram olhados, e só para confirmar mecanicamente os textos de vitória (nomes de botões, seletores) — nunca para copiar conclusões.
**Escopo:** 4 partidas completas, cada uma perseguindo um dos 4 desfechos possíveis. As quatro foram alcançadas. Screenshots e transcrições de cada tela de desfecho foram salvos junto com este relatório.

---

## 1. Veredicto rápido

Isto não parece um protótipo. Para ser um "vertical slice" — um caso só, um investigador só — a qualidade de prosa e a engenharia da dedução (a mecânica do mural com barbantes, os quatro desfechos graduados por quão *limpa* é a cadeia de raciocínio, não por acerto binário) já entregam uma experiência com identidade própria e nenhuma concorrente óbvia no mercado de jogos narrativos em português. O ponto fraco não é o texto nem o design da dedução — é a apresentação: há uma dissonância grande entre o cuidado investido na escrita e a superfície visual, que em vários momentos entrega telas com quase metade da altura vazia, sem nada nelas.

Os 4 finais foram alcançados sem travas de progresso. Nenhum bug impediu terminar o caso em nenhuma das quatro tentativas.

---

## 2. Os quatro desfechos — todos alcançados

| Desfecho | Estratégia usada | Resultado |
|---|---|---|
| **Vitória Absoluta** | Investigação completa: visitei todos os locais, extraí praticamente todas as evidências (35 de 36), interroguei os quatro periféricos, confrontei as duas mentiras de hora e o álibi forjado do réu, apontei o móbil e dei juízo sobre todo mundo. | Alcançado. Monólogo sem furos, epílogo com forca para o culpado. |
| **Erro Judiciário** | Ignorei o corpo, visitei só a cena e a delegacia, acusei o primeiro nome que apareceu (Walter Arthurs) com uma janela de tempo enorme e sem provas reais. | Alcançado na primeira tentativa. |
| **Impunidade** | Acusei o suspeito certo (Silas Crane) "no faro", sem nunca examinar o corpo — só o interrogatório e a delegacia — e sem vestígio de presença. | Alcançado na primeira tentativa. |
| **Sucesso, com Gafes** | Investiguei a cadeia central com cuidado (corpo, cena, oficina — réu certo, causa certa, janela certa, vestígio de presença certo), mas pulei de propósito a Estação III (mentiras), a Estação IV (móbil) e dei "Sem juízo" a todo mundo na Estação V. | Alcançado. |

Nenhum desfecho parece inacessível ou preso atrás de um bug. O jogo permite, em qualquer momento, levar uma acusação capenga a julgamento — "nada diz se você acertou" antes do monólogo, exatamente como o README promete — e o motor classifica o resultado com uma granularidade dos quatro finais que faz sentido e é justa: errar o réu é sempre Erro Judiciário; acertar o réu mas não sustentar a cadeia é Impunidade; sustentar a cadeia central mas deixar buracos periféricos (móbil, mentiras, juízos) é Gafes; e só a cadeia impecável ganha Vitória Absoluta. Essa escada de consequência é a melhor ideia de design do jogo.

Um detalhe que vale registrar: no Erro Judiciário e na Impunidade, o jogo oferece "Revisar a acusação" — uma segunda chance, cobrando 2h de relógio — antes de deixar fechar o caso em erro. É uma calibragem de dificuldade elegante: pune o descuido, mas não pune com a mesma dureza um erro de novato.

---

## 3. O que funciona bem (visão de jogador, não de dev)

**A escrita segura o jogo.** A prosa de época é consistente, econômica e nunca escorrega para o piegas ou para o clichê de "detetive genial" — o monólogo final é comovente sem ser piegas, e frases como "Tenho o nome certo e as mãos vazias. O faro aponta o nome; a cadeia não o alcança" (desfecho de Impunidade) fazem o fracasso do jogador doer sem humilhá-lo. Isso é difícil de acertar e o jogo acerta.

**A dedução é honesta com o jogador.** Puxar barbante de uma evidência até uma âncora do mural é fisicamente satisfatório e claro — dá para entender, sem tutorial nenhum, o que está sendo afirmado. O painel "AINDA FALTA" no topo do mural (ex.: *"Nenhuma mentira confrontada. O móbil não foi apontado. Há suspeitos sem juízo."*) é uma forma inteligente de dar rumo sem entregar a resposta: ele nomeia a lacuna estrutural, nunca "você errou o suspeito X".

**A abertura vende o tom em 6 telas rápidas.** A carta do delegado, a chegada a Briarstone, o guarda "de mãos cruzadas às costas, o rosto sem cor" — dá pra sentir o vilarejo antes mesmo de examinar o primeiro cadáver.

**O confronto embutido no diálogo (apresentar uma prova a um suspeito) é o melhor momento de jogo do slice.** Levar o registro da estalagem a Walter e ver o álibi dele desmoronar em tempo real, dentro da própria fala do personagem, é mais satisfatório do que qualquer barra de progresso.

**Zero erros de console em qualquer uma das quatro partidas jogadas até o fim** (fora um evento isolado de perda de contexto WebGL discutido abaixo, que o próprio jogo já sabe tratar). Nenhuma tela branca, nenhum travamento, nenhum estado do relógio ou do mural corrompido.

---

## 4. Problemas encontrados (funcionais e de qualidade)

### 4.1 Grandes vazios visuais — o achado mais consistente do playtest

Em pelo menos três telas centrais do jogo — a mesa/mapa do vilarejo, o mural da acusação e (em menor grau) as fichas de evidência — a área ocupada por conteúdo real termina por volta de 50–55% da altura da janela, e o resto é um retângulo escuro, sem textura, sem texto, sem nada. Isso acontece mesmo em telas de 900px de altura (não é um problema de "rolar para ver mais" — o conteúdo simplesmente não preenche o espaço reservado a ele).

- Na mesa vazia (início do jogo, antes de examinar qualquer coisa), o jogador vê o diorama do vilarejo ocupando a metade de cima e um vazio total embaixo, sem nenhuma pista de que ali é onde as cartas de evidência vão se acumular.
- No mural da acusação, cada vez que só as primeiras estações estão preenchidas, o resto da tela — que deveria conceitualmente ser "parede" — fica um retângulo preto liso.

Isso não quebra a jogabilidade, mas prejudica a primeira impressão exatamente no momento mais importante (a primeira tela depois da abertura) e faz um jogo com direção de arte muito cuidada parecer inacabado. **Sugestão:** ou redesenhar esses painéis para altura dinâmica (encolher a área reservada quando vazia), ou preencher o vazio com algo que pertença à cena — textura de madeira da escrivaninha, uma vinheta, uma dica textual sutil tipo "nenhuma carta na mesa ainda — clique em um termo em negrito para começar".

### 4.2 Perda de contexto WebGL observada em ambiente de recursos gráficos limitados

Durante o playtest, o console do navegador registrou, em determinado momento:
```
THREE.WebGLRenderer: Context Lost.
Contexto WebGL perdido — a mesa segue em 2D.
```
O jogo já tem um fallback gracioso para isso (a segunda linha é uma mensagem do próprio código do jogo, não um erro cru) — o que mostra que a equipe já sabe que essa é uma possibilidade real. Isso é bom. Mas o fato de ter acontecido espontaneamente numa sessão de teste comum (sem estresse deliberado, só navegando e extraindo cartas) sugere que o jogo cria mais contextos WebGL simultâneos do que talvez devesse (o diorama 3D do mapa + as renderizações 3D de cada card de evidência/corpo aparentam ser contextos separados). Em hardware modesto, notebooks corporativos com GPU integrada fraca, navegadores com muitas abas abertas, ou máquinas virtuais — isto é, uma fatia nada desprezível do público real de um jogo de texto acessado pelo navegador — isso pode acontecer com mais frequência do que em uma máquina de desenvolvimento. **Sugestão:** revisar quantos canvases/contextos WebGL distintos existem simultaneamente na tela da mesa e considerar reduzir para um único contexto compartilhado, ou testar deliberadamente em hardware de gama baixa antes do lançamento.

### 4.3 As "perguntas ao delegado" de custo zero são fáceis de perder

Na última tela da abertura, o jogo oferece 4 perguntas opcionais ao delegado, explicitamente sem custo de tempo, com o aviso "o que não perguntar aqui, fica por saber". É uma ideia ótima — recompensa curiosidade sem punir quem tem pressa fisicamente, só narrativamente. Mas nada nessa tela chama atenção especial para a oferta: o botão de avançar ("Entrar — iniciar a investigação") tem o mesmo peso visual dos botões de pergunta, e um jogador acostumado a "clicar para avançar diálogo" (o gesto mais automatizado que existe em jogos narrativos) tem tudo para pular direto para dentro da investigação sem perceber que estava desperdiçando pistas grátis. **Sugestão:** um microaviso ou destaque visual (ainda que sutil) na primeira vez que essa tela aparece, algo como "estas perguntas não custam tempo" com mais destaque do que hoje, ou desabilitar/atrasar o botão de entrar por um instante.

### 4.4 A economia de tempo não tem visão panorâmica

O jogador só descobre o preço de cada ação (viajar custa 1h; a planta interna do mesmo prédio não custa nada; revisar uma acusação capenga custa 2h) na hora, ação por ação. Isso é elegante como "aprender jogando", mas como não há nenhum resumo — nem mesmo opcional — do orçamento total de tempo do caso (quantas horas o jogador "tem" antes que o caso esfrie de verdade, se é que existe um teto assim), é difícil planejar uma rota. Isso não chegou a travar nenhuma das quatro partidas, mas um jogador mais estratégico (o tipo de jogador que este jogo claramente quer recompensar) vai sentir falta de conseguir errar por excesso de cautela: em nenhum momento ficou claro se investigar demais tem custo real (fora a degradação de precisão do rigor cadavérico, que é mencionada só uma vez, de passagem, na ficha do corpo).

### 4.5 Falta de reforço de identidade do investigador

O slice oferece só o Dr. Harlan Blackwell como investigador nesta versão (a tela de seleção mostrou um único card). O texto de abertura o caracteriza bem em duas frases ("Frio, metódico... trata os delegados com a cortesia exata de quem preferia não precisar deles"), mas essa caracterização não reaparece de forma perceptível durante a investigação — o texto do corpo do jogo (falas do legista, prosa das localidades) pareceu, aos meus olhos de jogador, indistinguível de como seria narrado por qualquer outro investigador hipotético. Se o objetivo final do jogo é ter vários peritos jogáveis (o código já trata gênero via `{g:masc|fem}`, sugerindo isso), vale planejar cedo como a personalidade do investigador vai se infiltrar na prosa central, não só na ficha de apresentação — senão o elenco de peritos vira só uma skin cosmética.

### 4.6 Nada sinaliza dano irreversível de uma decisão até o monólogo final

Isso é preferência de design (o "nada diz se você acertou" é proposital, e eu não vou brigar com a intenção), mas registro como jogador: ao montar a acusação, nunca fiquei com certeza de estar cometendo um erro grave — mesmo quando estava, de propósito, pulando estações inteiras. Um jogador de primeira viagem que não sabe que existem 4 finais pode achar, ao ver "Sucesso, com Gafes", que aquilo *é* o final bom, e nunca voltar para tentar a Vitória Absoluta. Isso é menos um bug e mais uma observação de retenção: talvez valha, só no epílogo (não no monólogo, para não estragar a tensão), uma frase muito discreta tipo "este não foi o único desfecho possível" para jogadores que não vêm de fora sabendo que há 4 finais — sem contradizer o tom do jogo, o epílogo já tem esse tipo de reflexão meta ("Fechar o caderno recomeça o caso do zero: outro caminho de perguntas pode alcançar a Vitória Absoluta") em três dos quatro finais, mas curiosamente **não** aparece no epílogo de Vitória Absoluta (o jogador que ganha de primeira nunca é informado de que existiam outros finais possíveis) nem no de Sucesso com Gafes — o que é uma pena, porque é justamente esse jogador (o que quase ganhou) que mais se beneficiaria de saber que valia a pena tentar de novo.

---

## 5. Sugestões de melhorias futuras (além dos itens acima)

Aqui vão ideias que não nasceram de um problema específico encontrado, mas de jogar o caso pensando "o que eu, como jogador pagando por isso, ia quatro pra escrever numa review":

1. **Um resumo pós-jogo comparável entre partidas.** O "Retrato da Investigação" no epílogo (locais visitados, observações registradas, horas gastas) é ótimo — daria um excelente cartão de resultado compartilhável (tipo Wordle) se ganhasse uma versão visual/exportável. Isso é pura oportunidade de marketing orgânico gratuito para um jogo de nicho.
2. **Indicador de progresso de "quanto da cadeia de evidências eu já tenho na mesa" durante a investigação**, não só dentro do mural. Hoje só se descobre o tamanho do buraco na Estação certa do mural, depois de já ter viajado tudo. Um contador ambiente e discreto (tipo "7 de 36 observações" que já aparece na Caderneta) ajudaria o jogador a decidir quando já investigou o suficiente para montar a acusação.
3. **Aproveitar melhor os vazios do diorama** (item 4.1) como oportunidade, não só como correção de bug: esse espaço vazio embaixo do mapa é terreno nobre — poderia crescer visualmente conforme o caso avança (mais luzes acesas nas casas visitadas, hora do dia refletida no céu do diorama), reforçando a passagem de tempo de um jeito que hoje só o relógio de bolso textual comunica.
4. **Testar em hardware fraco antes do lançamento**, dado o achado do item 4.2 — mesmo que o fallback 2D já exista, vale confirmar que ele preserva 100% da jogabilidade (o link "Modo leve (2D)" já disponível na tela de título sugere que a equipe já pensou nisso, o que é positivo — só reforço a prioridade).
5. **Onboarding mais explícito para a mecânica dos 4 finais** antes da primeira acusação (não necessariamente antes de jogar — só antes de clicar "Levar a julgamento" pela primeira vez), para que o jogador escolha deliberadamente arriscar uma acusação incompleta, e não caia nela por não saber que o jogo permite (e pune) isso.
6. **Considerar dar ao jogador uma forma de "salvar" ou nomear diferentes tentativas**, já que o próprio jogo incentiva rejogar em busca da Vitória Absoluta ("outro método, outra ordem de perguntas, e a vila responde diferente") — hoje, fechar o caderno apaga o save (por design, conforme o QA), o que é coerente com "um caso por vez", mas significa que comparar duas tentativas exige memória do jogador, não do jogo.

---

## 6. Nota metodológica e limites deste playtest

- Joguei só com o investigador Dr. Harlan Blackwell (único disponível na tela de seleção desta build). Não testei o "modo purista" (que silencia a leitura do legista) nem o modo 2D forçado (`?flat=1`) em profundidade — apenas verifiquei que ambos existem e carregam.
- As quatro partidas foram automatizadas via Playwright para permitir jogar o caso inteiro quatro vezes dentro do tempo do playtest, mas cada ação foi decidida a partir da leitura real do texto e das telas capturadas em cada etapa — não foi uma reexecução cega de um script pronto. Onde o roteiro de QA do próprio repositório foi usado como referência de *gestos* de interface (que botão clica o quê, que seletor abre o quê), ele serviu só de instrução de operação, nunca de critério de avaliação: a leitura crítica acima foi feita depois, e de forma independente, sobre os textos e screenshots capturados.
- Não fiz teste de carga, teste em dispositivo móvel/touch, nem teste de acessibilidade (leitor de tela, navegação por teclado) — vale considerar isso escopo de um próximo playtest, já que o jogo é 100% texto e teria muito a ganhar sendo acessível a leitores de tela.

---

## Anexos (na mesma pasta deste relatório)

- Screenshots numerados de cada uma das 4 partidas (`run1_*`, `run2_*`, `run3_*`, `run4_*`) e da tela de título/abertura (`geral_*`, `abertura_passo_*`).
- Transcrição de texto completo de cada monólogo e epílogo (`run1_monologo.txt`, `run1_epilogo.txt`, etc.).
- Log de erros de console coletados (`erros_console.json`, `erros_console_run4.json`) e captura do evento de perda de contexto WebGL (`check_mesa_erros.json`).
