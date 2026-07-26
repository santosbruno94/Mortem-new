# MORTEM

Jogo de investigação forense em texto e cartas, ambientado na Inglaterra vitoriana (1893).
Este repositório contém o **vertical slice jogável** — da tela de título ao Monólogo do
Detetive, com os 4 desfechos possíveis — hoje em **quatro modos** sobre a mesma mesa:

1. **A Hora Emprestada** — o caso-escola artesanal, escrito à mão.
2. **A Hora Refeita** — a réplica procedural do caso-escola (a máquina remonta o mesmo crime).
3. **Um Caso da Comarca** — um caso sorteado de um banco de **20 casos** que a simulação
   gera em build time (vila, elenco e vestígios que nenhuma mão escreveu).
4. **A Marca do Agressor** — um caso da comarca onde a luta corporal é certa: o corpo da
   vítima sempre anuncia a marca-espelho, garantindo o verbo "Exigir que mostre" (banco de
   **10 casos**).

O gerador é uma **ilha de build time**: em runtime o jogo só carrega pacotes prontos, nunca
importa `src/gerador`; tudo é determinístico, sem chamadas de rede.

Nos modos procedurais, a **OS Vila Viva** (etapas E1–E6) faz a vila que a simulação computa
chegar ao jogador — sempre camada narrativa/visual, com o motor cego: a **planta** do prédio
é desenhada na cena; a terminologia é a de 1893 (**constable**, "O Posto do Constable",
petty sessions); a **mobília** lê a classe da vítima; a vila nasce em **três morfologias por
seed** (nucleada, linear, de green), que mudam o grafo de quem-ouve-quem sem regra nova de
motor (balanço provado por Monte Carlo); e a **travessa dos fundos** (E5) abre o "segundo
grafo" de becos. Com a **OS da vila na mesa**, todo caso gerado traz a própria **maquete 3D**
no pacote (a vila inteira da seed na tábua — casario de cenário incluído), os testemunhos da
rua são ouvidos no **prédio de encontro** (a taverna; mercearia/forja quando a taverna é a
cena) e cada suspeito é interrogado **à porta da própria casa**, com o constable um passo
atrás — o posto fica só com os papéis e o telégrafo.

A **OS Prosa Viva** (Fase 0 + E1–E5) ataca a genericidade **textual**: os casos procedurais
abrem com um **cold open da descoberta** (o POV de quem achou o corpo; o tutorial mantém a
abertura da pensão), o exame do corpo e as superfícies de móbil/instrumento/segredo/cena/ecos
ganham **variação combinatória** dentro da precisão forense, e uma **guarda anti-monotonia**
no QA trava a regressão. A **OS Diálogos/Escala/Localização** somou a esta: as **perguntas do
perito variam** (por seed nos casos gerados; pela persona escolhida no tutorial), o **corpo e
a cena do crime ficam no mesmo lugar** — ligados pela planta do prédio nos casos gerados, como
já eram no tutorial — e a **maquete 3D não sobrepõe mais as etiquetas no celular** (a vila cabe
na largura e um desobstrutor determinístico afasta os rótulos).

A **OS Prancha da Vila** fechou o pivô visual no hub: a vila do caso deixou de ser maquete 3D
por padrão e passou a ser **prancha de gravura** em SVG procedural — a hora do relógio vira
tinta (o céu adensa, o papel esfria, as janelas acendem em âmbar), a viagem é uma tacha de
cera correndo a estrada desenhada, e o nó revelado por lead entra **a bico de pena vermelha**,
carimbado com a hora em que o lead chegou. No celular a prancha é só figura e a navegação
desce para uma régua de fichas. A maquete 3D continua inteira, a um clique no alternador.

A **reforma do caso-escola** (OS-R0 a R8) corre em paralelo, uma OS de cada vez. A **OS-R1**
acertou o vocabulário policial (o **guarda** Wycliffe, «O Posto do Guarda», o Dr. **Abbot**).
A **OS-R2** fundiu a cena: a relojoaria Arthurs era três nós de mapa para o mesmo endereço da
High Street e passou a ser **um nó com sub-locais** (o corpo, o escritório dos fundos, a loja
da frente, a copa, a oficina), onde a **planta baixa deixou de ser desenho e virou a
navegação** — andar o prédio inteiro não custa uma hora, como não custava antes. As cartas
resolvem-se agora por `localidade` + `subLocal`; ausente o sub-local, nada muda, e os casos
gerados seguem idênticos. A **OS-R3** refez a abertura: o jogo passa a abrir **pelos olhos
de quem achou o corpo**, e o aparato legal ficou o de 1893 — quem ordena o exame e quem o
paga é o **coroner**, não o guarda da vila, e a ordem dele traz a data do inquérito. O
prazo é ficção: nenhuma regra o lê. A **OS-R4** deu ao caso a prova documental do móbil e
a lição que faltava: o livro de pesos do morto ardeu na grelha do escritório, mas havia um
segundo, escondido na **câmara dos sinos de S. Miguel** — e a chave é uma cifra gravada por
dentro do relógio de bolso que o jogador já tinha na mão. Entrou também o **veraz sem
crédito**: o sineiro Amos Kell viu quem saiu pela boca do beco e diz a verdade, e o motor
recusa a palavra dele como prova. Não é bug: é a lição de que uma testemunha pode estar
certa e não servir. A **OS-R5** deu voz aos dois suspeitos que o jogo tinha mudos: a viúva
Rooke e o aprendiz de quinze anos passaram a ter razão contra a vítima, e a razão chega por
documento em vez de por queixa — o bilhete em que o vigário marca os proclamas do morto com
ela para o domingo seguinte à morte, e o livro em que o salário do rapaz é descontado por
inteiro contra uma dívida da mãe que não anda. É nessa conta que a **agiotagem da vítima**
entra no jogo, sem uma palavra sobre juros: quem conferir os números encontra a armadilha
fechada. E o **tell de contagem** — o réu tinha mais cartas de móbil que qualquer outro —
morreu por medição e não por gasto: a paridade lê-se por **motivos distintos**, e por essa
métrica o réu nunca foi o máximo.

A fonte única de verdade do design é o arquivo [`MORTEM_CONTEXTO.md`](./MORTEM_CONTEXTO.md);
o que ainda falta está em [`docs/pendencias-status.md`](./docs/pendencias-status.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [`MORTEM_CONTEXTO.md`](./MORTEM_CONTEXTO.md) | Design do jogo (estado atual) |
| [`docs/game-design-simulacao.md`](./docs/game-design-simulacao.md) | Design do gerador por simulação (autobattler de build time) e da interferência |
| [`docs/nota-gabinete-ilustrado.md`](./docs/nota-gabinete-ilustrado.md) | Pivô de apresentação (visual novel de gravura): a Prancha do corpo e a Cena de diálogo |
| [`docs/sistema-visual.md`](./docs/sistema-visual.md) | Sistema visual da interface: paleta token a token, cardápio tipográfico, catálogo da matéria, legenda das tintas de carimbo e as divergências deliberadas do desenho |
| [`docs/pendencias-status.md`](./docs/pendencias-status.md) | Mapa vivo do que ainda falta (o que foi feito, o que fica para sessão própria) |
| [`docs/os-vila-viva-e0-plano.md`](./docs/os-vila-viva-e0-plano.md) | Plano contra a genericidade espacial dos casos procedurais (etapas E1-E6; prompts de implementação em [`docs/os-vila-viva-prompts-implementacao.md`](./docs/os-vila-viva-prompts-implementacao.md)) |
| [`docs/os-prosa-viva-e0-plano.md`](./docs/os-prosa-viva-e0-plano.md) | Plano contra a genericidade **textual** dos casos procedurais — sequência da Vila Viva (Fase 0 de telemetria + etapas E1-E5; prompts de implementação em [`docs/os-prosa-viva-prompts-implementacao.md`](./docs/os-prosa-viva-prompts-implementacao.md)) |
| [`docs/guia-de-estilo.md`](./docs/guia-de-estilo.md) | Norma de toda a prosa (língua de época, observação pura, anti-padrões) |
| [`docs/biblia-de-vozes.md`](./docs/biblia-de-vozes.md) | O idioleto de cada personagem |
| [`docs/kb-medicina-legal/`](./docs/kb-medicina-legal/) | Verdade forense de época (Taylor, Casper, Lacassagne) + aparato legal-policial de 1893 |
| [`docs/kb-mundo-vitoriano/`](./docs/kb-mundo-vitoriano/) | Verdade histórica do cenário (arquitetura, sociedade, cotidiano, economia) |
| [`docs/kb-psique-e-crime/`](./docs/kb-psique-e-crime/) | Mente, desvio e crime de época (alienismo, criminologia, insanidade e lei) |
| [`docs/kb-craft-narrativo/`](./docs/kb-craft-narrativo/) | Craft do mistério (fair play, clichês, construção de caso) |
| [`docs/kb-producao/`](./docs/kb-producao/) | Consulta de planejamento (game design de dedução, UI/estética, assets) |
| [`docs/os-r0-mestra-reforma-hora-emprestada.md`](./docs/os-r0-mestra-reforma-hora-emprestada.md) | **Ordem-mestra** da reforma do caso-escola: 25 decisões marteladas, 12 invariantes, a sequência das oito OS e o gate global. Não se executa; governa |
| [`docs/os-r1-vocabulario-e-postos.md`](./docs/os-r1-vocabulario-e-postos.md) | OS-R1 — vocabulário policial e nome do mestre (**fechada**; mapa em [`docs/os-r1-mapa-ocorrencias.md`](./docs/os-r1-mapa-ocorrencias.md)) |
| [`docs/os-r2-cena-unica.md`](./docs/os-r2-cena-unica.md) | OS-R2 — fusão de corpo/cena/oficina na localidade `relojoaria` com sub-locais (**fechada**; ata em [`docs/historico-decisoes.md`](./docs/historico-decisoes.md)) |
| [`docs/os-r3-abertura.md`](./docs/os-r3-abertura.md) | OS-R3 — a abertura testemunhal, a ordem do coroner e a autoridade corrigida (**fechada**; ata em [`docs/historico-decisoes.md`](./docs/historico-decisoes.md)) |
| [`docs/os-r4-elenco-e-livros.md`](./docs/os-r4-elenco-e-livros.md) | OS-R4 — os dois livros do morto, a cifra, a torre de S. Miguel e o veraz sem crédito (**fechada**; ata em [`docs/historico-decisoes.md`](./docs/historico-decisoes.md)) |
| [`docs/os-r5-mobeis-e-cartas.md`](./docs/os-r5-mobeis-e-cartas.md) | OS-R5 — os móbeis de Agnes e Davey, a agiotagem da vítima e o tell de contagem dos móbeis (**fechada**; ata em [`docs/historico-decisoes.md`](./docs/historico-decisoes.md)) |
| [`docs/os-r6-exposicao-e-interrogatorios.md`](./docs/os-r6-exposicao-e-interrogatorios.md) | OS-R6 — a exposição (E0/E1/E2), o beat 3 nos cinco, a contaminação e o `apontadaPor` (**escrita, por executar**: cinco martelos abertos no §5; prompt de arranque em [`docs/os-r6-prompt-de-arranque.md`](./docs/os-r6-prompt-de-arranque.md)) |
| [`docs/historico-decisoes.md`](./docs/historico-decisoes.md) | Histórico de playtests e redesigns |

O repositório também traz agentes e skills de redação em [`.claude/`](./.claude/)
(escritor, editor-crítico anti-padrões de IA, perito forense, fiscal de continuidade).

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço indicado no terminal (normalmente `http://localhost:5173`).

Outros comandos:

```bash
npm run verificar    # a bateria inteira, na ordem — build + qa + lint:prosa + qa:ui.
                     # É o gate de commit.
npm run build        # build de produção (pasta dist/)
npm run preview      # serve o build de produção
npm run qa           # QA estático: os 4 perfis de jogador em TODOS os casos embarcados + guardas
npm run qa:ui        # QA de fumaça da interface (Playwright já vem nas devDependencies;
                     # na primeira vez: npx playwright install chromium)
npm run lint:prosa      # linter de prosa isolado: cheques mecânicos do guia de estilo
npm run gerar:casos     # regenera o banco de casos da comarca (src/data/casos_gerados.js)
npm run telemetria:monotonia  # índice de monotonia da prosa gerada (mesa; fora do bundle)
```

Ferramentas de inspeção do gerador (build time, imprimem no terminal):
`npm run demo:elenco`, `demo:cidade`, `demo:crime`, `demo:interferencia` — e as
auditorias `npm run gabarito`, `auditoria:elenco`, `relatorio:espacial`, `mc:batalha`,
`buscar:replica`.

## Como se joga

1. **Atenda ao chamado** — Harlan Blackwell ergue o convite da mesa e escolhe um dos **quatro
   chamados** (o caso-escola artesanal, a réplica procedural, um caso da comarca sorteado, ou
   um caso com luta corporal forçada).
2. **Abertura** — da pensão em Caulfield ao briefing do guarda Wycliffe (as perguntas ao
   guarda não custam tempo… mas plantam iscas). Nos modos procedurais (comarca e luta), a
   abertura é omitida e o perito segue direto à investigação.
3. **Investigação** — tudo acontece sobre a escrivaninha. A vila do caso está estampada na
   **Prancha da Vila** — uma gravura de 1893 no alto da mesa, onde cada nó é um prédio
   desenhado e a hora do relógio vira tinta (o céu adensa, o papel esfria, as janelas
   acendem em âmbar). Clique num prédio para **viajar** até lá (só a viagem gasta o relógio) e
   abrir o exame ou o interrogatório como sobreposição — nos casos gerados, interrogar é
   bater à porta da casa de cada suspeito. O exame do corpo é uma **prancha de atlas** (SVG, com lupa que segue o
   dedo, frente/dorso e necropsia); os interrogatórios compõem uma **cena ilustrada** (fundo
   da localidade + sprite do interlocutor), com **confronto** (pousar uma prova diante do
   suspeito) e **exigir que mostre** (mandar mostrar as mãos, os antebraços ou as botas —
   quando o corpo da vítima anuncia a marca-espelho). **Termos em negrito** na prosa extraem
   cartas para a mesa — examinar **não** custa tempo. A **voz do mestre** vai dando a leitura do
   corpo (uma dica; o Dr. Abbot, ausente, recordado pelo aprendiz). O perecível (rigor,
   temperatura) **perde precisão** com as horas, mas nunca some — o durável sempre resolve.
4. **Construir a acusação** — o botão da parede abre o **mural com barbante**. Você **afirma**
   a cadeia nas âncoras (réu; janela da morte; causa; motivo; juízo sobre cada outro suspeito) e
   a **sustenta puxando barbantes** das cartas: indicadores → *Quando*, sinais → *Como*, vestígio
   → *Presença*, e fatos → depoimentos para **desmentir** uma mentira. Nada diz se você acertou.
5. **Monólogo do detetive** — "Levar a julgamento" gera o monólogo de um dos **4 desfechos**
   (Vitória Absoluta, Sucesso com Gafes, Impunidade, Erro Judiciário): cada elo ligado vira uma
   frase; cada elo faltante, um buraco. No caso-escola é permitido revisar a acusação e tentar de novo.

## Stack

Vite + React (JSX) + Tailwind CSS + Zustand. Desde o pivô **"Gabinete Ilustrado"**
(jul/2026), a apresentação inteira é visual novel de gravura em **SVG procedural**: o exame
do corpo (A Prancha), as conversas (A Cena) e — desde a **OS Prancha da Vila** — a vila do
hub. A **maquete 3D** da vila (**three.js / react-three-fiber**, geometria 100% procedural)
continua no jogo como vista alternativa, a um clique no alternador "A prancha" / "A maquete"
no pé da mesa; sem WebGL ou em `?flat=1`, a prancha assume — ela é o fallback. A fonte
espacial é dupla: o caso-escola usa o mapa espacial estático, e cada caso gerado traz a
própria vila no campo visual `maquete` do pacote. Sem TypeScript, sem engine de jogo, sem
chamadas de rede em runtime — dados em módulos JS e lógica determinística em funções puras
(toda variação vem de `hashString` salgado com a seed). O banco de casos gerados e o diorama
3D são **chunks lazy**: o arranque (tela de título + tutorial) baixa ~400 KB de JS, e uma
sessão que fique na prancha nunca baixa o three.

A interface é feita de **materiais procedurais** — gradientes, ruído SVG de `seed` fixo e
sombra, definidos uma vez em `src/index.css` e `tailwind.config.js`: papel, couro, latão,
cera, cortiça e madeira, sem um único arquivo de imagem ou ícone de biblioteca. A
tipografia são cinco faces OFL embarcadas em `woff2` (Libre Caslon Text para toda leitura
longa, IM Fell English para a voz do documento, Bevan nos títulos, Oswald nos rótulos e
Rye só no cartaz da tela de título). As escolhas estão registradas em
[`docs/sistema-visual.md`](./docs/sistema-visual.md).

```
src/
  data/         seed, catálogo de causas, cartas (com tagsOcultas), localidades, mapa, glossário,
                abertura, rótulos, casos_gerados.js (banco de 30 casos: 20 comarca + 10 luta —
                chunk lazy, fora do arranque; casos_indice.js é o índice leve síncrono)
  logic/        tempo, tempo_morte, cronos, acusacao (gramática das ligações), veredicto, falaDoMestre, monólogo, interpolação
  store/        jogo.js (Zustand: fases, relógio, mapa, cartas registradas, conclusões, acusação, log)
  gerador/      ILHA de build time: autobattler do crime, cidade, elenco, vestígios, interferência
                — resolve o caso e emite um pacote pronto; o runtime nunca o importa
  components/   Escrivaninha, MuralAcusacao (orquestrador; as estações vivem em mural/),
                EventoLocalidade (apoios em localidade/), PranchaCorpo (exame do corpo em
                SVG), CenaDialogo/FundoCena (cena ilustrada), a vila do hub em gravura
                (prancha/) com o diorama 3D como vista alternativa (diorama/),
                painéis, Caderneta, Monólogo do Detetive…
scripts/        qa.mjs (QA estático) · qa-ui.mjs (QA de interface) · gerar-casos.mjs ·
                lib/ (coreografia dos 4 perfis, marcadores [[id]], núcleo de solvência da
                fatia, famílias de método, monotonia — fontes únicas dos scripts)
```
