# MORTEM — Documento de Contexto

> Fonte única de verdade do design, escrita para humanos e para agentes de código.
> Descreve o **estado atual** do jogo — sem camadas históricas. O caminho até aqui está
> em [`docs/historico-decisoes.md`](./docs/historico-decisoes.md). A prosa é regida por
> [`docs/guia-de-estilo.md`](./docs/guia-de-estilo.md) e
> [`docs/biblia-de-vozes.md`](./docs/biblia-de-vozes.md); a verdade forense, por
> [`docs/kb-medicina-legal/`](./docs/kb-medicina-legal/).

---

## 1. O que é MORTEM

MORTEM é um jogo de investigação forense baseado em texto e cartas, ambientado na
Inglaterra vitoriana (1893). O jogador é um perito médico-legal independente, chamado a
vilarejos onde a polícia local não tem competência técnica para resolver homicídios.
Toda a experiência acontece sobre uma **escrivaninha vista de cima**: evidências,
depoimentos e conclusões são **cartas**; investigar é viajar num mapa que cresce e
examinar sem pressa; acusar é **construir uma cadeia no mural com barbante** e
sustentá-la ligando cartas. O desfecho é o **Monólogo do Detetive**, que mede a
qualidade da cadeia construída.

**Referências de design:**
- *Cultist Simulator* — interface de mesa/cartas, narrativa emergente da manipulação de objetos
- *Papers, Please* — rotina técnica sob pressão, com peso moral nas decisões
- *Return of the Obra Dinn* — dedução genuína: o jogo dá dados, o jogador produz a verdade

**Plataforma:** web app React. Sem engine de jogo. 100% determinístico.

---

## 2. O que diferencia MORTEM dos demais jogos de detetive

1. **"Nem todo mentiroso é culpado."** Inocentes mentem por razões próprias (vergonha,
   medo, autopreservação). A regra estrutural: *a mentira do assassino é inconsistente
   com a evidência FÍSICA; a mentira do inocente é inconsistente apenas com a MORAL*.
   O jogo pune pattern-matching preguiçoso ("mentiu → culpado") e recompensa perícia.

2. **O jogo nunca entrega conclusões.** O jogador recebe dados brutos ("articulações
   rígidas", "24°C corporal") e material de referência (Glossário Forense de época).
   A interpretação é dele. Não há highlight de "pista importante", e a prosa obedece à
   regra da **observação pura** (`docs/guia-de-estilo.md` §2). A única exceção
   controlada é a leitura técnica do mestre (§7), que é dica e não vincula nada.

3. **Dedução contra uma gramática universal, anti força-bruta.** Não há menu de
   respostas do caso: a leitura sai de um espaço universal (catálogo de causas + modelo
   de tempo, §6.1). Nada valida durante a investigação; só o desfecho. Sem vitória por
   tentativa e erro mecânico.

4. **Zero feedback durante a investigação.** Nenhum ✓/✗, nenhum "correto!". A verdade
   só é revelada no desfecho, de uma vez, com consequências.

5. **Errar é permitido — e tem consequência.** O jogo não bloqueia acusações fracas ou
   erradas. Existem 4 finais (Vitória Absoluta, Sucesso com Gafes, Impunidade, Erro
   Judiciário), e cada um narra o custo do que o jogador fez ou deixou de fazer.

6. **Camada narrativa ≠ camada lógica.** Toda carta carrega `tagsOcultas`. As regras
   leem SOMENTE as tags, nunca nomes ou textos de cartas. É isso que torna a geração
   procedural viável: trocar a narrativa não exige tocar no motor.

7. **Zero LLM em runtime.** Dados em JS, lógica em funções puras, monólogo final por
   templates universais com variáveis injetadas (e variação determinística por hash da
   seed salgado com o perito escolhido — §11). O jogo roda offline e é totalmente
   reproduzível.

8. **Tempo como recurso forense (relógio MOLE).** O relógio só avança ao **VIAJAR** no
   mapa (única exceção: a retentativa do tutorial custa 2h — §10/§11); dentro do local,
   congela. Sem fim de jogo por tempo. O perecível degrada perdendo **precisão**, nunca
   valor — o durável sempre resolve (§10). A pressão é de **rota**, não arcade.

9. **"Tudo é mesa. Tudo é carta."** Sem troca de telas, sem menus profundos. Eventos
   abrem como overlays sobre a escrivaninha — a mesa nunca sai do DOM.

---

## 3. A fantasia e o tom

O jogador é **o perito que chega de fora**: respeitado pela técnica, desconfiado pelos
locais. O tom é **vitoriano minimalista** — prosa contida, sensorial, sem melodrama. A
morte é tratada com a frieza profissional de um laudo e a gravidade de um luto.

Texto do jogo inteiramente em **português (PT-BR literário de época)**, sem
anacronismos. A norma completa (língua, observação pura, dosagem de brilho,
anti-padrões proibidos) está em `docs/guia-de-estilo.md`; o idioleto de cada personagem,
em `docs/biblia-de-vozes.md`. A verdade histórica do cenário (arquitetura, sociedade,
rotinas, vestuário de 1893) está em `docs/kb-mundo-vitoriano/` — prosa de ambientação e
elencos de casos novos nascem de lá. Eventos de investigação são prosa imersiva com
**termos clicáveis em negrito** inline — clicar extrai a carta correspondente. Uma
localidade pode trazer **prosa condicional** (`prosaCondicional`: parágrafos que só
entram quando as cartas exigidas já estão na mesa — ex.: o confronto da segunda visita
ao réu depois do registro da estalagem; reação observável, nunca confissão), e o
overlay do caso-escola exibe o contador "N de M observações registradas aqui"
(regalia pedagógica — o procedural pode omitir).

**Estética visual:** mesa de madeira escura à luz de vela — e a matéria disso está na
tela: veios de madeira e grão procedurais (gradientes + ruído SVG, sem assets externos),
halo de vela que respira, papel com fibra e sombra nas cartas, barbante com corpo
(sombra + torção). Desde o overhaul "vitoriano premium" (jul/2026), a interface é feita
de **materiais**, definidos uma única vez em `src/index.css` e `tailwind.config.js`:
pergaminho claro escrito a tinta (`.carta-pergaminho` — provas, fichas, etiquetas),
couro escuro dos painéis (`.painel-couro` — moldura de todos os overlays), placa de
latão (`.placa-latao` — só as ações solenes: construir a acusação, levar a julgamento),
botão de mesa (`.botao-mesa` — todo botão comum), selo de cera (`.selo-cera` — marcador
de novidade), campo vitoriano (`.campo-vitoriano` — selects sem a cara do navegador),
mural de cortiça (`.mural-cortica`) e divisor ornado (`.divisor-ornado`). Tokens de
cor: `madeira`, `vela`, `papel`, `tinta`, `latao`, `cera` (+ `equimose`/`sangue`
forenses); os literais `stone/amber` sobrevivem como neutros de apoio, e **nenhum
texto informativo desce de `stone-400`** (contraste é regra — atmosfera não desculpa
ilegibilidade). Tipografia serifada de época embarcada (**IM Fell English**, licença
OFL, `src/assets/fontes/`) para títulos e nomes; sem ícones modernos; ornamentos
tipográficos discretos (§, ―, ❦).

**Camada 3D (apresentação pura):** a mesa ganha profundidade em dois pontos — o
**diorama da vila** (maquete de papel pousada no alto da escrivaninha: prédios
procedurais com **telhado de duas águas**, chaminés, marquise e pás — sempre primitivas
compostas; clicar num prédio VIAJA, e Moorford surge crescendo com a estrada ao ser
desbloqueado) e a **mesa de exame do corpo** (cadáver low-poly ao lado da prosa, cuja
pose/manchas refletem rigor e livor pelo IPM; os hotspots extraem as MESMAS cartas dos
termos em negrito). Regras da camada: geometria 100% procedural (proibido GLTF/textura
externa — three.js + @react-three/fiber v8 pinados, chunk lazy próprio), dados espaciais
em `src/data/mapa_espacial.js` e `src/data/hotspots_corpo.js` (camada visual — o motor
nunca lê), e **fallback 2D obrigatório** (`?flat=1`, sonda WebGL, ErrorBoundary): sem 3D,
a grade de localidades original joga idêntico. Diálogos e pessoas permanecem 2D.

**Asset 2D sob contrato (jul/2026):** a regra do 3D segue 100% procedural (proibido
GLTF/textura de arquivo); mas a camada **2D** passa a admitir asset externo sob
contrato — permitido desde que (a) embarcado no bundle (zero rede); (b) escolhido
deterministicamente por `hashString` salgado (nunca sorteio); (c) invisível ao motor;
(d) com **fallback procedural obrigatório** (ausente/inválido, o SVG/CSS atual assume e
o jogo joga idêntico); (e) inscrito no **manifesto de assets** com dimensões do slot e
proveniência de licença, sob guarda do `qa.mjs`. Textura gerada em canvas pela seed
continua permitida (é código, não arquivo). A abertura vale só para 2D; o diorama e o
corpo permanecem procedurais.

O diorama tem **teatro** (§5.2), tudo apresentação lendo estado derivado (nunca o
motor): a **luz segue o relógio** (`CICLO_LUZ` + `interpolarLuz(horasJogo)` — tarde
dourada → crepúsculo → noite com lampiões âmbar, com névoa baixa de outubro; puro,
sem `Math.random`/`Date.now`); o **pino do perito** (alfinete de cabeça vermelha) marca
o nó atual e desliza o trajeto na viagem com o custo flutuando junto; as **etiquetas**
dos nós são tags de papel pendentes (HTML real, mesmos textos e handler). O
`frameloop="demand"` segue de pé: a maquete parada não gasta frame (o pulso de "novo"
mora em CSS na tag, não no emissivo 3D; as pás do moinho são silhueta estática).

**Aparência dos personagens (camada narrativa):** genótipo com vocabulários fechados
(`corpo`, `pele`, `cabelo`, `pelosFaciais`, `idadeAparente`, `traje`) em
`src/data/aparencias.js`, CURADO por personagem no caso tutorial (seed fixa, sem
randomização); `src/logic/aparencia.js` expõe `obterAparencia` e
`derivarAparenciaDeSeed` (hash da seed salgado — pronto para o procedural). Alimenta
os **retratos 2D em gravura SVG** (`RetratoPersonagem.jsx`: interrogatórios,
delegacia, Painel de Álibis, Juízos do mural) e o corpo 3D da vítima. JAMAIS entra em
`tagsOcultas` nem é lida pelo veredicto (guarda no QA).

**Som:** cinco efeitos curtos, sintetizados offline e embarcados (`src/assets/sons/`,
tocados por `src/som.js`): papel (extrair carta), sino (viajar), barbante (ligar/
desfazer no mural), lacre (selar o julgamento), pena (avançar a abertura). O som é
apresentação — nenhuma regra depende dele — e desliga-se no rodapé da escrivaninha
("Som: aceso/apagado"). Zero rede em runtime segue valendo.

---

## 4. O loop de jogo

1. **Abertura** — Escrivaninha vazia em Caulfield (pensão miserável). A Sra. Potts
   entrega uma carta do delegado de Briarstone. Aceitar transforma a escrivaninha no
   hub de investigação.
2. **Briefing** — Chegada a Briarstone. O Delegado Wycliffe apresenta o caso (custo
   zero). Perguntas ao delegado plantam informações e iscas.
3. **Investigação** — Chegada às 11:00. O relógio só corre ao **VIAJAR** no mapa;
   dentro do local, congela. O jogador alterna entre:
   - **Viajar** entre nós do mapa (custa horas; o mapa cresce por leads);
   - **Examinar** localidades e **interrogar** suspeitos (clicar nos negritos extrai
     cartas; custo zero) — o legista vai falando a leitura do corpo;
   - Consultar Glossário, Caderneta e Painel de Álibis (custo zero).
4. **Construção da Acusação** — O botão da parede abre o **mural com barbante**: o
   jogador afirma a cadeia (réu, janela, causa, motivo, juízos) e a sustenta ligando
   cartas (§8).
5. **Monólogo do Detetive** — O motor compara a cadeia construída contra a Verdade de
   Ouro e gera o monólogo de um dos 4 desfechos. Só aqui o jogador descobre o que
   acertou e errou.

---

## 5. A Escrivaninha (hub central)

O jogador nunca sai desta tela. Layout:

```
[     CONSTRUIR A ACUSAÇÃO (parede)       ]

――――――――――――――――――――――――――――――――――――――――――
|                                [Relógio]|
|                                         |
|        SUPERFÍCIE LIVRE                 |
|        (cartas soltas + nós do mapa)    |
|                                         |
|-----------------------------------------|
[Caderneta]   [Painel de Álibis]  [Glossário]
```

- **Relógio de Bolso** (sup. direito): avança apenas ao **VIAJAR**; dentro do local,
  congela.
- **Superfície Livre** (centro): cartas arrastáveis, custo zero. **Localidades são nós
  do mapa**; clicar **VIAJA** (custa tempo, `src/data/mapa.js`) e abre o evento como
  overlay (`blur(6px)` + `opacity 0.3`, `position: fixed`). Só aparecem os nós
  **desbloqueados** (o mapa cresce por leads). Não existe troca de tela. Com WebGL, os
  nós vivem no **diorama 3D** no alto da mesa (rótulos em HTML real, mesmos textos);
  sem WebGL ou com `?flat=1`, na grade 2D original (`MesaLocalidades2D.jsx`) — o
  handler de viagem é um só para os dois modos.
- **A parede** (botão "Construir a Acusação"): abre o mural com barbante (§8).
- **Caderneta** (overlay, custo zero): log de tudo que foi extraído e concluído; exibe
  a leitura do mestre como dica.
- **Glossário Forense** (overlay, custo zero): referência de época, contexto-sensitivo.
- **Painel de Álibis** (overlay, custo zero): ver §9.

**Regras UX:** nenhuma ação exige mais de 2 cliques; feedback visual imediato; a
interface ensina pela forma, não por texto tutorial.

### 5.1 A planta da relojoaria e os pontos de interesse

Os quatro nós do **mesmo prédio** (grupo `relojoaria` de `src/data/mapa.js` — corpo,
cena, oficina e a saleta onde Silas recebe) ganham uma **planta baixa** que permite
**andar entre cômodos** sem tocar o motor. Ao abrir qualquer nó da relojoaria, a visão
pousa a planta no topo (`src/components/PlantaRelojoaria.jsx`, sobre o dado visual puro
`src/data/planta_relojoaria.js`): SVG procedural em **traço de tinta sobre papel** — a
loja com balcão e vitrine à frente, o corredor com a escada, o escritório dos fundos e a
oficina ao fundo, a saleta, a porta do beco. O **escritório dos fundos é uma sala só com
dois alvos** (o corpo jaz na cena): a sala tem os cliques "a cena" e "o corpo". Clicar num
cômodo **viaja** para o nó (custo 0 — mesmo prédio, a regra de `mapa.js`) e reabre a
localidade lá; o cômodo atual fica marcado "— aqui —". É SVG 2D puro: **funciona idêntico
em `?flat=1`**; em tela estreita, colapsa numa régua horizontal de cômodos.

Camada VISUAL: `planta_relojoaria.js` referencia os ids de nó pelos alvos, mas **nenhuma
regra o lê** — trocar a planta nunca toca o jogo.

**Pontos de interesse:** as localidades podem trazer o campo opcional
`pontos: [{ id, rotulo, prosa }]` (mais um `introducao` de ambientação sem carta). Quando
existem, a prosa monolítica se divide em **pontos clicáveis** (acordeão): clicar num ponto
revela o parágrafo com os seus termos extraíveis — **coleta em camadas**. Cada ponto exibe
um contador `n/total` das suas cartas. Restrição dura: **todo `[[id]]` extraível na
localidade continua alcançável em algum ponto** — guarda estática no `scripts/qa.mjs`
(cartas com `localidade === nó` ⊆ união dos `[[id]]` dos pontos). No vertical slice, a
**cena** (a lareira, a escrivaninha, a vitrine e a porta do beco, a copa) e a **oficina**
(a prateleira de gravar, o púlpito de ordens, a gaveta funda, o aprendiz) têm pontos; o
corpo (exame 3D) e a saleta seguem em prosa contínua. Observação pura (guia §2): o ambiente
descreve; quem estranha é o jogador.

### 5.2 A maquete e o teatro da mesa

A maquete do diorama não persegue realismo (a geometria procedural sem GLTF/textura torna
essa briga perdida): abraça **"maquete de papel sobre a escrivaninha"** — a vila é um modelo
que o perito montou para pensar. O teatro é 100% apresentação, lendo estado derivado (o
relógio, o custo de viagem, os nós novos) — nunca as `tagsOcultas` nem o veredicto.

- **Luz da hora.** `src/data/mapa_espacial.js` traz `CICLO_LUZ` (keyframes por hora) e
  `interpolarLuz(horasJogo)` — dado **puro** (sem `Math.random`/`Date.now`). `DioramaVila`
  interpola a luz por frame (`LuzDoDia`): tarde dourada → crepúsculo → noite azulada com
  os **lampiões âmbar** das janelas queimando (`luzRef.lamp`), sob **névoa baixa de
  outubro** (fog). Ciclo **perceptível e contido**: a noite escurece sem apagar a leitura.
- **Beat de viagem.** Na maquete 3D, uma viagem com **custo real** (>0h) ganha um beat de
  ~0,7s: o **pino do perito** (alfinete de cabeça vermelha, `PinoPerito.jsx`) desliza o
  trajeto com o custo em horas flutuando junto, e a luz vira com a hora — só então o local
  abre (a mesa desfoca ao abrir o overlay, não antes). Viagem de 0h (andar pela planta) e o
  modo `?flat=1` abrem no ato. O handler de viagem é o mesmo dos dois modos (paridade).
- **Silhueta e etiquetas.** Prédios com telhado de duas águas, chaminés, marquise e pás
  (silhueta estática); os rótulos são **tags de papel pendentes** (mesmos textos e handler),
  e o destaque de nó novo pulsa em **CSS** na tag — o `frameloop="demand"` da maquete segue
  intacto (parada = zero frame).
- **Microinterações da UI (§3).** O barbante do mural pende com **catenária**; concluir uma
  estação **carimba** o selo de cera; a pena **risca** ao avançar a abertura. Tudo cede a
  `prefers-reduced-motion`.

---

## 6. Sistema de Cartas e Tags Ocultas (motor lógico)

Toda carta tem duas camadas:

```js
{
  id: 'ev_rigor',
  textoDisplay: 'Corpo Endurecido',            // camada narrativa (jogador vê)
  carimboPadrao: 'Duro dos maxilares aos joelhos',
  descricao: '…',                              // exame próximo (guia de estilo §5)
  vozMestre: '…',                              // fala do legista (opcional; só campanha)
  tagsOcultas: {                               // camada lógica (motor lê)
    dominio: 'temporal',
    subDominio: 'rigor_mortis',
    estadoRigor: 'pleno',                      // ESTADO observado bruto
    estadoDegradacao: 'ativo',
  },
}
```

A carta carrega o **estado observado bruto**. Quem converte esse estado numa janela de
horas ou numa causa é a **gramática universal** (§6.1), não a carta.

**Domínios:** `temporal`, `causal`, `ambiental`, `comportamental`, `vestigio`.

**Extração:** clicar no termo em negrito (marcador `[[id]]` na prosa) registra a carta
direto em `cartasRegistradas`. Examinar não custa tempo. Na face da carta, a mesa
mostra só a **observação crua** (`textoDisplay`); o `carimboPadrao` é rótulo interno.
Cartas do corpo podem ter `estados` que degradam com o IPM e o campo opcional
`vozMestre` (a fala do legista, omitida no procedural).

**Regra inviolável:** as funções de lógica e de veredicto leem apenas `tagsOcultas`
(e a seed). Nunca decidem por `id` ou `textoDisplay`.

### 6.1 Gramática Universal de Dedução

O caso (seed) **não contém alternativas**. Cada caso traz só a **Verdade de Ouro** +
as **pistas físicas**. O espaço de respostas é **universal**, igual para todo caso, e
mora no motor:

- **Catálogo universal de causas** (`src/data/catalogo_causas.js`): todas as causas que
  o jogo conhece e o vocabulário de **sinais**. Um sinal de *família* (petéquias →
  asfixia) aponta o gênero; um sinal de *assinatura* (sulco horizontal → ligadura)
  crava a espécie e descarta as parecidas. O jogador deduz por **eliminação**.
- **Modelo forense de tempo** (`src/logic/tempo_morte.js`): converte cada indicador
  (algor, rigor, livor, última-vez-visto) numa **janela de horas**, determinístico nos
  dois sentidos. A Janela da Morte é a **interseção** das janelas.

Consequência: dá para gerar infinitos casos sem escrever uma única "alternativa". A
ambiguidade **emerge** do espaço universal — quem reúne poucas pistas fica com várias
causas de pé e a janela larga.

O **método de construção de casos** sobre essa gramática (verdade primeiro, pistas
depois, despistes honestos, truques de álibi e encenação, regras de fair play e a régua
de escalada da campanha) está em `docs/kb-craft-narrativo/` — leitura obrigatória antes
de desenhar uma Verdade de Ouro nova.

### 6.2 A Ficha de Coleta (a evidência se apresenta no ato)

Extrair uma evidência registra a carta; **só a primeira observação do caso** sobe em
**Ficha de Coleta** por cima do local (aprende-se o gesto — a ficha traz uma
linha-tutorial avisando da mudança). As demais **pousam sozinhas na mesa**, anunciadas
por um **aviso de pouso** no pé da tela (`AvisoCartaPousada.jsx`, `[data-aviso-pousada]`,
clicável para abrir a ficha; a carta recém-pousada ganha um anel de destaque na mesa).
Decisão do playtest de 14/07/2026: o "Arquivar na mesa" obrigatório somava ~72 cliques
mortos nas 36 observações.

A ficha em si não mudou (estilo etiqueta de exposição / laudo de época):
`textoDisplay`, a **descrição completa** (o exame de perto), a `vozMestre` em itálico
quando a carta a tem, o carimbo, a hora do registro (`formatRelogio`) e, quando existe,
a ponte "§ termo, no Glossário" (`verbeteParaCarta`). Botão único, **"Arquivar na
mesa"**, fecha a ficha e devolve a carta à superfície (o som de papel toca na abertura
da ficha e no aviso de pouso, não na extração).

A ficha é **consulta de custo zero** e reabre a qualquer momento: clicar numa carta
pousada na mesa a reabre; dentro do Mural da Acusação, um "§" discreto no canto da
carta a abre em leitura sem sair da estação. Implementação: `fichaAberta` no store
(id puro, serializável) e `src/components/FichaEvidencia.jsx`; empilha acima dos demais
overlays (`data-overlay="ficha"`, `z-50`).

Consequência para a **Caderneta** (§5): rebaixada a **diário** — a lista de observações
reunidas passa a ser compacta (carimbo + hora, cada linha reabrindo a ficha). A
descrição de perto e a fala do legista moram na ficha, não na Caderneta; "Leitura do
legista" e o diário da investigação seguem sendo a função verdadeira da Caderneta.

---

## 7. A leitura do mestre (a dica falada)

Não há gavetas nem mostradores: a leitura forense é **falada pelo mestre/legista**
(`src/logic/falaDoMestre.js`), em linguagem natural, a partir do que o jogador
examinou — a janela via `calcularJanelaMorte` (`cronos.js`), o mecanismo via
`mecanismoCravado` (`catalogo_causas.js`). A leitura é refeita a cada exame
(`consolidarLeituraMestre`, ids estáveis `leitura_mestre_janela`/`leitura_mestre_mecanismo`)
e guardada em `conclusoes` (`origem: 'mestre'`), exibida no exame do corpo e na
Caderneta.

**É DICA, não decisão**: não vincula o veredicto — quem afirma o quando/como na cadeia,
e responde por isso, é o jogador. Limites da voz do mestre no texto: leitura técnica
apenas (janela, família/assinatura, estado do sinal); nunca aponta pista, autoria ou
encenação (`docs/guia-de-estilo.md` §2.4).

**Onde a dica mora (e onde não mora):** a leitura fala no exame do corpo e fica
arquivada na Caderneta. Ela **não** aparece no Mural da Acusação — consultá-la na hora
de afirmar a cadeia é um gesto deliberado (abrir a Caderneta), não um gabarito
pendurado sobre a prova.

No modo **procedural** não há mestre: a cena traz só a descrição física (sem
`vozMestre`) e o jogador, já perito, lê por conta própria.

### 7.1 Interrogatórios como diálogo (a árvore + o confronto com provas)

Os nós de **interrogatório** deixam de ser prosa estática e passam a **diálogo
ramificado determinístico** (`src/components/InterrogatorioDialogo.jsx`, sobre o dado
narrativo puro `src/data/dialogos.js`).

**§7.2 — A conversa DESCE e não volta.** A árvore é **sequencial**, ao estilo de RPG.
Cada *beat* (rodada) oferece **quatro falas do perito**, cada uma num **tom**: firme
(pressão), cordial (brandura), técnico (o ofício), oblíquo (de esguelha). Escolher um
tom **avança** e **descarta os irmãos** — não há "outro assunto", não se volta ao hub. O
nó corrente **persiste** no store (`noAtualDialogo` por suspeito, dado puro que o motor
jamais lê): reabrir retoma onde parou, e **a escolha é definitiva**. Navegar não custa
tempo (relógio mole). O NPC responde no registro perguntado; a **carta de sustentação**
de cada beat sai em **qualquer** tom (o caso é **sempre acusável** — solubilidade), mas
o **tom ressonante** de cada personagem rende um tento a mais de prosa (a lasca na
bainha de Silas só se apanha de esguelha, no oblíquo). O peso da escolha é **narrativo
por ora**: nenhuma prova que o veredicto lê depende do tom — o motor repousa no corpo e
na cena (ver §7.3 para a evolução mecânica futura).

**A mecânica do confronto** é o elo entre a mesa e as pessoas — e é uma **caixa gated**,
não mais um seletor universal. Em qualquer nó de pergunta (e no encerramento), a caixa
de confronto expõe **só as perguntas que a mesa autoriza**: uma por prova de confronto
que o jogador de fato possui (`confrontos: [{ requerCarta, rotulo }]`, filtrado por
`temCarta`). Cada `rotulo` é a **pergunta autoral que explica por que o confronto está à
mão** (ex.: `[Vidro na Dobra da Calça] Por que traz vidro de mostrador preso à bainha?`).
É um **canal lateral**: confrontar rende a reação **sem descer a árvore** e a conversa
**retoma** de onde estava. O **destino** da reação vem de `reacoesProva: { [cartaId]: noId }`
(fonte única cartaId→noId; `confrontos` só carrega rótulo + ordem, em **bijeção** com
`reacoesProva`). Provas **irrelevantes não aparecem** — o caminho "carta alheia →
`noEvasiva`" some da interface, e `noEvasiva` permanece só como fallback defensivo. Cada
botão é ancorado por `data-requer-carta` (âncora estável do QA, independente da prosa do
rótulo) e marca as já apresentadas (`provasApresentadas` no store, por suspeito). Toda
reação é **observável, nunca confissão** — o veredicto continua no mural. A forma antiga
(`requerCarta` na opção) segue suportada para confrontos autorais que **descem** a árvore.
(Os `rotulo` do vertical slice são **provisórios**; a redação final passa pelo pipeline
`revisar-prosa`.)

**O confronto em cena anota o mural.** Apresentar ao declarante a carta que desmente o
próprio paradeiro (função pura `ligacaoDeConfrontoEmCena` em `src/logic/acusacao.js` —
só tags: vestígio `pertenceA` ou corroboração `ligadoA` × álibi `declaranteId`) cria a
**mesma ligação `refuta_alibi` do barbante**, que nasce **visível e removível** no
mural; os juízos seguem 100% manuais (ver §8). No vertical slice, Silas Crane (o réu)
tem três reações: o registro da estalagem (`corrob_estalajadeiro`), o livro de ordens
(`ev_livro_ordens`) e a lasca na bainha (`ev_vidro_dobra`), cada uma reenquadrada por
ele com a calma da bancada — e a evasiva que devolve nada.

**O motor não muda.** As falas surgem cartas pelo **mesmo mecanismo `[[id]]`** das
localidades (`ParagrafoProsa` de `src/components/ProsaComTermos.jsx`, o renderizador
único compartilhado com `EventoLocalidade`); as cartas de depoimento nascem com as tags
que já têm (`alibi`, `comportamento`, `fragmento`), e a extração pelo motor
(`extrairCarta`) segue idêntica — o diálogo é só a superfície de UI. Forma do dado:

```js
DIALOGOS.interrogatorio_silas = {
  suspeitoId: 'silas_crane', noInicial: 'abertura',
  noEvasiva: 'evasiva', reacoesProva: { corrob_estalajadeiro: 'confronto_estalagem', … },
  // A caixa gated: uma pergunta por chave de reacoesProva (bijeção). O destino
  // da reação vem de reacoesProva; `confrontos` só carrega rótulo autoral + ordem.
  confrontos: [
    { requerCarta: 'corrob_estalajadeiro', rotulo: '[O Quarto Cinco às Escuras] Por que…?' }, // (provisório)
    { requerCarta: 'ev_livro_ordens', rotulo: '[Livro de Ordens de Serviço] Por que…?' },
    { requerCarta: 'ev_vidro_dobra', rotulo: '[Vidro na Dobra da Calça] Por que…?' },
  ],
  nos: {
    abertura: { fala: ['Silas recebe na saleta…'], opcoes: [
      { rotulo: '"Onde esteve na noite de sexta. Sem rodeios."', vaiPara: 'b1_firme', tom: 'firme' },
      { rotulo: '"Conte-me da sexta com calma…"', vaiPara: 'b1_cordial', tom: 'cordial' },
      { rotulo: '"A sexta-feira, os seus passos, hora a hora."', vaiPara: 'b1_tecnico', tom: 'tecnico' },
      { rotulo: '"Ficou até tarde na oficina, na sexta?"', vaiPara: 'b1_obliquo', tom: 'obliquo' },
    ] },
    // A carta de sustentação (alibi_silas) sai em todo tom; a precisão
    // (ev_vidro_dobra, a lasca) só no oblíquo. Cada beat aponta ao próximo.
    b1_obliquo: { fala: ['…: [[alibi_silas]].', '…presa à bainha…: [[ev_vidro_dobra]].'],
      opcoes: [ /* as quatro falas do beat 2 */ ] },
    b2_obliquo: { fala: ['…: [[comp_silas]].'], opcoes: [] }, // terminal: sem volta
    confronto_estalagem: { fala: ['…'], opcoes: [] }, // reação; a conversa retoma
    …
  },
};
```

Restrição dura (guarda estática no `scripts/qa.mjs`): toda `requerCarta` referencia carta
existente; todo `vaiPara` aponta para nó real da mesma árvore; todo `[[id]]` de fala é
carta real **e nenhuma carta com `localidade === nó` fica órfã** (alcançável em alguma
fala) — espelho da guarda dos pontos de interesse (§5.1). Toda entrada de
`reacoesProva` referencia carta existente e nó da mesma árvore, e árvore com
`reacoesProva` tem `noEvasiva` válido; **bijeção** `confrontos` ↔ `reacoesProva` (cada
confronto referencia carta existente que é chave de `reacoesProva`, cada chave tem um só
confronto, rótulo não-vazio, sem duplicata); a guarda de motor confirma que a
apresentação anota `refuta_alibi` e que carta alheia não anota nada. **Guarda §7.2:** a árvore de
pergunta é um DAG que **só desce** (nenhuma opção reaponta ao nó inicial) e, em **toda
descida**, as cartas de sustentação saem — só a precisão (tom-dependente) pode faltar,
e ainda assim é alcançável em algum caminho (a Vitória Absoluta segue possível).
Observação pura (guia §2): a calma do suspeito é gesto observável; quem estranha é o
jogador.

### 7.3 Confronto que faz o suspeito agir (SEMENTE — mecânica futura)

Hoje o confronto rende **prosa** (a reação) e, quando é o caso, **anota o mural** — mas
não muda estado nem custa tempo. A evolução pretendida: apresentar certa prova pode
fazer o suspeito **AGIR** — mexer com as evidências no mapa **fora do olhar do perito**
(o suspeito age enquanto o perito está noutro lugar), ou chegar à **cena do crime ao
mesmo tempo** que ele (concomitância). Isso daria **peso de tempo** ao confronto (hoje
de graça, relógio mole) e complexidade à gestão do dia.

**Estado atual: só a semente, INERTE.** Nada disto executa ainda — sem executor, sem
custo de tempo, sem mudança de disponibilidade de nós; o motor de veredicto
(`src/logic/`) continua sem depender de nada disto. O que já existe, pronto para ligar:

- **Dados** (`src/data/confrontos.js`): `CONSEQUENCIAS_CONFRONTO` mapeia, por suspeito,
  quais provas o **agitam** e o efeito que **poderiam** disparar — enum, não prosa
  (`'agita' | 'mexe_provas' | 'antecipa_cena' | 'foge'`); e `ESTADO_SUSPEITO_INICIAL`.
- **Store** (`src/store/jogo.js`): campos persistidos `estadosSuspeito`
  (`'presente' | 'agitado' | 'ausente'`) e `eventosConfronto`; ação `registrarConfronto`
  (**stub**: só anota o evento, com a hora do relógio determinístico; ninguém a chama).

Pontos de injeção do executor futuro: `apresentarProva` (dar custo/efeito ao confronto),
`viajarPara`/`nosDesbloqueados` (disponibilidade dinâmica de nós), e a leitura de
`estadosSuspeito` na UI do mapa e dos interrogatórios. Regra a preservar: o veredicto
segue lendo **só `tagsOcultas` + seed** — a mecânica de ação mora em store/data/UI.

---

## 8. A Construção da Acusação (o mural com barbante)

O ato final do jogador (`src/components/MuralAcusacao.jsx`, aberto pelo botão
"Construir a Acusação"). A acusação é **construída, não preenchida**: o jogador
**AFIRMA** a cadeia nas âncoras e a **SUSTENTA puxando barbantes** das cartas (cada
carta tem um pino; a ligação é uma linha em SVG; o alvo sai de `elementFromPoint`).

**Dois verbos atômicos**, com significado **DERIVADO das tags**
(`src/logic/acusacao.js`; nunca escrito por caso):

- **Sustentação** — um fato apoia uma afirmação positiva: indicador temporal → âncora
  *Quando*; sinal → *Como*; vestígio → *Presença*.
- **Refutação** — um depoimento desmentido por fatos: a hora alegada cai **fora** da
  janela que os fatos físicos sustentam; o vestígio do próprio declarante o desmente
  (e, se revela um segredo, a mentira é de vergonha — inocente, não assassino); ou uma
  **corroboração de testemunho** registra o declarante saindo antes da hora que jurou
  (tag `horaFimObservada` — é assim que o registro de Moorford fura o álibi do réu).

**A encenação tem dono:** o crédito de "descuidos expostos" exige derrubar a **própria
peça forjada** (a alegação de hora com a tag `encenado` — o relógio esmagado).
Desmentir uma testemunha apenas equivocada é mérito narrado à parte, nunca crédito de
encenação. **O álibi do réu** entra na Estação III como alegação refutável quando o
réu está nomeado — derrubá-lo é opcional (corroboração nunca é pilar), mas o monólogo
ganha o direito de dizê-lo.

**O jogador afirma o "quando" e o "como".** A janela (início/fim no relógio dos dois
dias) e a causa (do catálogo universal) são **juízo dele**, sustentados pelas cartas
que ele ligar.

**Ligações anotadas em cena (Onda 5).** O confronto de paradeiro feito no
interrogatório (apresentar ao declarante a carta que o desmente, §7.1) **anota a
ligação `refuta_alibi` no mural** — decisão do pós-playtest de 14/07/2026: apresentar
a prova na cara do declarante É o gesto de confronto, mais "construído" que o checkbox
da Estação V, e o achado P1 mostrou que o confronto escondido nos Juízos não era
descoberto. Salvaguardas da autoria: o barbante nasce **visível e removível**; os
juízos (culpado/inocente/sem juízo) seguem **100% manuais**; e o precedente já
existia — os sinais do corpo se ligam sozinhos às âncoras ("o corpo é lido, não
selecionado").

**A cadeia** soma: Quem · Quando · Como · Presença · Mentiras expostas · Motivo ·
Juízo sobre cada não-acusado (`culpado` | `inocente` | `sem_juizo`). A armadilha do
§2: quebrar a mentira do inocente e julgá-lo *culpado* → **Erro Judiciário**.

**Nexo de Presença:** o vestígio **instrumental** (casa com a arma E pertence ao réu) é
obrigatório para o nexo; ligar um traço de terceiro é **gafe** (condena, mas custa a
Vitória Absoluta); ligar só o errado falha o nexo. Um segundo vestígio do próprio réu
(não instrumental) reforça sem gafe.

**Estado:** `acusacao` = `{ reuId, janela:{inicio,fim}, causaId, motivacaoId,
juizos, ligacoes }`.

---

## 9. Painel de Álibis

Overlay de consulta intitulado **"Declarações de Paradeiro"**. Lista as cartas de
depoimento de álibi já coletadas (`dominio: 'comportamental'`, `subDominio: 'alibi'`)
de forma **estritamente neutra**: quem declarou, o que declarou, faixa horária
declarada. **Sem marcadores de status**, sem cruzamento automático. O cruzamento ativo
— desmentir uma alegação ligando-a aos fatos do corpo — é ATO do jogador no mural.

## 9.1 Glossário Forense

Referência de época, consulta gratuita, overlay com navegação por domínio (5 domínios →
termos → definição). Cada verbete: termo, definição tecnicamente precisa, domínio,
sinal observável. É o material que permite ao jogador interpretar os dados brutos sem
que o jogo interprete por ele. Abre filtrado por contexto quando pertinente. Conteúdo
validado contra `docs/kb-medicina-legal/`.

---

## 10. Tempo e Degradação (relógio MOLE)

- Relógio global em horas (`horasJogo`), chegada às **11:00** (`horasChegadaCena: 11`,
  imutável).
- **Custa tempo:** só **VIAJAR** entre nós do mapa (`viajarPara`; custos em
  `src/data/mapa.js` — dentro da vila 1h; Moorford 1h30 por trecho, 3h ida e volta).
  Dentro do local, o relógio congela.
- **Custo zero:** examinar (extrair), medir temperatura, interrogar, mural, Glossário,
  Caderneta, Painel de Álibis, arrastar/organizar.
- **Degradação = perda de PRECISÃO, nunca de valor.** Rigor e algor, ao degradar,
  viram leituras vagas mas válidas (rigor `resolvido` → janela larga `[36h, +∞)`;
  algor em equilíbrio → piso largo), jamais nulas. A carta registrada congela no estado
  em que foi vista. O corpo telegrafa e anuncia a perda (legibilidade).
- **Garantia de solvabilidade:** a âncora durável (livor fixo + "visto por última vez
  com vida", `dep_visto_vivo`) sempre fecha uma janela finita que contém a hora real,
  em qualquer rota; o perecível só aperta essa janela quando colhido fresco. Sem fim
  de jogo por tempo. A falha do apressado é de perícia, não de relógio.
- **Exceção do tutorial:** a **retentativa** custa relógio (2h por "Revisar a
  acusação" — §11): é o único gesto fora da viagem que move o ponteiro, e move-o por
  ser uma viagem institucional (a audiência adia-se).
- **Pressão de rota nos casos da campanha (decisão registrada — Q6):** o relógio mole
  do tutorial não morde por desenho; nos casos seguintes a pressão de rota virá de
  **janelas de disponibilidade** — testemunha que embarca, estabelecimento que fecha,
  enterro marcado que leva o corpo — e/ou de eventos que consomem horas. O perecível
  continua sem bloquear (perde precisão, não valor); o que se perde por chegar tarde é
  ACESSO a fontes, nunca a solvabilidade (a âncora durável segue garantida). Detalhe
  por caso, no desenho de cada caso.

---

## 11. O Veredicto e o Monólogo do Detetive

### Veredicto (`calcularVeredictoCadeia(acusacao, cartasRegistradas, seed)`)

Função pura (`src/logic/veredicto.js`). Lê a **cadeia construída** contra a Verdade de
Ouro (só tags e seed) e retorna `{ tipo, acertos, falhas[], perifericos,
dadosMonologo }`. Os 4 tipos:

1. **`vitoria_absoluta`** — réu certo, pilares sólidos (janela precisa ≤6h que cobre a
   hora real, mecanismo cravado, nexo instrumental), motivo, encenação exposta,
   periféricos corretos, sem gafes.
2. **`sucesso_gafes`** — réu certo, condenação sustentada, mas com lacunas ou erros
   expostos.
3. **`impunidade`** — réu certo mas tese furada: as lacunas soltam o assassino.
4. **`erro_judiciario`** — réu errado condenado. O nome do verdadeiro culpado **não**
   sai no monólogo enquanto a retentativa está de pé — só o **encerramento definitivo**
   (o epílogo) o revela.

O pilar Quando falha em **cascata com código próprio por degrau**: sem janela afirmada
ou sem carta ligada (`sem_janela`); janela que erra a hora real (`janela_nao_cobre`);
janela que cobre a hora real mas **contradiz as próprias cartas ligadas** à âncora —
o suporte que o jogador invocou não intersecta o que afirmou (`janela_sem_sustentacao`;
o monólogo expõe contradição, nunca imprecisão); janela certa e sustentada, porém larga
demais (`janela_imprecisa`).

### Monólogo por templates universais — e o CONTRATO do desfecho

Gerado por **BLOCOS** parametrizados (`src/logic/monologo.js`): abertura por tipo de
final, tese montada com o que o jogador ligou, o álibi do réu desmentido (se o foi),
as testemunhas derrubadas (se o foram), buracos mapeados das falhas, juízo dos
periféricos, fecho. Nunca há texto único por caso — os mesmos templates servem ao
tutorial e a qualquer caso procedural. Nunca LLM. Voz em primeira pessoa — o perito
pensa alto (tom: `docs/guia-de-estilo.md` §3–4).

**Contrato:** nenhuma frase do desfecho afirma gesto que o jogador não fez —
a encenação só entra se a peça forjada foi refutada; "o paradeiro que firmei" exige o
álibi do periférico na mesa (sem ele, o juízo é narrado como convicção); o instrumento
citado vem do sinal que cravou a causa, nunca de um vestígio avulso.

**Variação determinística:** as variantes de abertura e fecho saem de hash da seed
**salgado com o nome do perito** (nunca `Math.random`) — a mesma partida repete o
texto; seeds diferentes tendem a ler desfechos diferentes. O teto do guia §3 (no máximo
UMA máxima por desfecho) é garantido **por construção**: cada variante declara
`maxima`, e abertura-máxima só sorteia fechos sem máxima. Os **blocos de periféricos**
também têm variantes (um pool por situação; a escolha desloca pela ordem de ocorrência
— dois periféricos vizinhos do mesmo tipo nunca repetem a frase), e a menção a
"razões contra a vítima" só entra quando uma carta de móbil apontando o periférico
está na mesa (`temMotivoNaMesa` no veredicto) — o contrato vale também para o que se
diz dos não-acusados.

### Retentativa (regalia do caso-escola — com preço)

No desfecho, além do "O QUE FALTOU — cortesia do tutorial", o botão **"Revisar a
acusação"** devolve à investigação com a mesa intacta — mas **custa 2h de relógio**
(`CUSTO_REVISAO`, `src/store/jogo.js`): a audiência adia-se, e o perecível ainda não
colhido segue degradando. A resubmissão continua ilimitada (o caso-escola é uma aula),
porém nunca grátis, e o Erro Judiciário não entrega o nome do culpado enquanto se pode
tentar de novo. Nos casos seguintes da campanha, a consequência pode endurecer
(reputação do perito, ou submissão única) — decisão em aberto, registrada para os
próximos casos não herdarem a regalia por omissão.

### Epílogo e retrato (o encerramento paga o investimento)

"Encerrar o caso" não recarrega a página de imediato: abre o **Epílogo**
(`src/logic/epilogo.js`) — parágrafos de consequência por templates universais
(o destino do réu conforme o desfecho; o **eco do título** — `blocoHoraTomada`, um
único verso pago só quando a cena foi encenada movendo um relógio E o jogador o
derrubou (`cenaEncenada && horaForjada && descuidosOk`): a hora emprestada só é
"cobrada de volta" quando o corpo de fato prevaleceu; genérico, sem citar o título;
o periférico do segredo, exposto ou não, com variantes anti-eco que carregam o **custo
moral** de expor um inocente (não troféu); as **explicações pagas** — alegações-isca refutadas cuja tag
`explicacao` vira o parágrafo de `ROTULOS_EXPLICACAO` que conta o fato verdadeiro por
trás da leitura falsa, ex.: a luz do padeiro era o lampião esquecido; a conta do
perito, que flexiona pela **hora do selo**) — seguido de **O retrato da investigação**:
horas usadas, lugares visitados (nomeando o que ficou por visitar entre os nós
desbloqueados — nunca os não revelados), observações registradas, acusações levadas a
julgamento. Só então "Fechar o caderno" encerra de fato.

---

## 12. Personagem jogável

Um único perito (decisão de jul/2026 — a perita Lenore foi removida do escopo):

- **Dr. Harlan Blackwell** — cirurgião do Exército; perito independente desde 1887.
  Frio, metódico; especialista em intervalo post-mortem.

**Sistema de variáveis (mantido — é estrutural):**
```js
detective = { name: 'Harlan', surname: 'Blackwell', pronoun: 'ele', treatment: 'Sr.', title: 'Dr.' }
```
Textos continuam usando interpolação `{detective.campo}` e flexão `{g:masc|fem}`
(sempre resolvida no masculino; o mecanismo fica para personagens futuros). A tela
inicial apresenta um único convite (`faseJogo: 'selecao' → 'abertura' →
'investigacao'`).

---

## 13. Estrutura de progressão

1. **Caso-escola — "A Hora Emprestada"** (fixo): cinco suspeitos, três mentirosos
   inocentes, o relógio como pivô da dedução; **resubmissão da acusação permitida** —
   a falha mostra o que faltou (exceção exclusiva do caso-escola).
2. **Campanha — arco mestre/aprendiz** (esqueleto pendente): o jogador começa como
   assistente de um mestre, que ensina **verbos e hábitos** (não fatos) e dá menos
   ajuda com o tempo; ao fim, o mestre morre e o jogador assume o lugar. A campanha é
   o **currículo completo** (`src/data/curriculo.js`): tudo que o gerador um dia usará
   é ensinado antes da morte do mestre (contrato de currículo). *Em aberto:* a morte
   do mestre como caso jogável.
3. **Procedural** (sandbox): o assistente embrulha o modo infinito (traz casos, faz
   presença, **sem ensinar**); a cena vem só com descrição física (sem `vozMestre`).
   Viável graças ao motor de tags.

---

## 14. Caso do vertical slice: "A Hora Emprestada" (CONTÉM SPOILERS)

**Cenário:** Briarstone, outubro de 1893. Vítima: **Sr. Geoffrey Arthurs**, relojoeiro,
61 anos, morto no escritório dos fundos por **ferida de buril no pescoço**. Cena
encenada como roubo de madrugada; relógio de lareira esmagado, parado às **08h45**.

**Calendário:** a morte ocorre às **21h de sexta-feira, 13/out/1893** (hora absoluta
−3); o corpo é achado na manhã de **sábado, 14/out**, às 09h20, por Silas Crane; o
perito chega às **11h00** (hora absoluta 11; IPM na chegada = 14h). Corpo a 23°C,
sala a 11°C.

### Verdade de Ouro (`src/data/seed.js` — lida apenas pelo motor)
```js
SEED_TUTORIAL = {
  id: 'a_hora_emprestada',
  vitima: 'Sr. Geoffrey Arthurs',
  reuCorreto: 'silas_crane',
  horasMorteAntesChegada: 14,
  horaMorteAbsoluta: -3,
  mecanismoCorreto: 'ferida_arma_branca',
  instrumentoCorreto: 'buril_gravador',
  motivacaoCorreta: 'silenciamento',
  cenaEncenada: true,
  horaForjada: 8.75,
  perifericos: {
    walter_arthurs: { veredictoEsperado: 'inocente_segredo', segredo: 'suplica_recusada' },
    agnes_rooke:    { veredictoEsperado: 'inocente_segredo', segredo: 'noivado_secreto' },
    caleb_grey:     { veredictoEsperado: 'inocente_alibi',   segredo: null },
    davey_tull:     { veredictoEsperado: 'inocente_alibi',   segredo: null },
  },
}
```

**O que aconteceu:** Silas Crane, primeiro-oficial há doze anos, trocava ouro dos
consertos por metal vil. Na sexta a fraude foi descoberta (a queixa do relógio "mais
leve" de Caleb Grey; a coluna "S.C." do livro de ordens; a nota do morto "pesar as
caixas. Pettigrew, segunda"). Às 21h, confrontado com a denúncia que viria na
segunda-feira, matou o mestre com o próprio buril de gravador e passou a hora seguinte
encenando um roubo de madrugada: porta do beco forçada por fora, troco do caixa
levado (a vitrine de ouro intocada — o descuido), buril lavado e devolvido ao estojo,
e o relógio da lareira **recuado** para 08h45 e esmagado — recuado, e não avançado,
porque avançar faria o carrilhão badalar na rua morta. O lampião da oficina ficou
aceso (a "luz do velho" que o moço do padeiro veria às 05h15).

### O relógio como pivô — três leituras
1. **O mostrador forjado** (`ev_relogio_lareira`, 08h45, `encenado`+`isca`): a base da
   falsa solução que Wycliffe defende (ladrão de madrugada). Refutá-lo credita a
   encenação.
2. **A roda de contagem** (`ev_maquinismo`, `registro_mecanico`, janela [−3,−2]): a
   segunda leitura da MESMA peça — a roda repousa na 9ª batida; os ponteiros marcam
   hora que o carrilhão não bateu → ponteiros recuados; esmagamento entre 21h e 22h.
   Refuta o mostrador sozinha E sustenta o Quando. Saber plantado: relógio irmão
   aberto na oficina + verbete "O Registro Mecânico" do Glossário.
3. **O relógio de bolso do morto** (`ev_relogio_bolso`, `rotina_interrompida`,
   teto −1): parado às 05h05 de corda esgotada; o hábito da corda às 23h (deposto por
   Davey) prova que a corda de sexta nunca foi dada. É o teto durável que **não
   afrouxa com o tempo** — o espelho do `dep_visto_vivo` (piso, 20h).

### Suspeitos (5)
- **Silas Crane** (47, primeiro-oficial; achou o corpo) — **o assassino**. Meio +
  motivo + oportunidade. Mente contra a física ("recolhi-me à estalagem às oito"):
  o estalajadeiro viu o quarto às escuras às 21h e ouviu o portão "passado das dez"
  (`corrob_estalajadeiro`, refutação por registro); o vidro do mostrador na bainha
  (`ev_vidro_dobra`) e o buril lavado (`ev_estojo_buril`, o nexo) o cravam.
- **Walter Arthurs** (44, sobrinho, herdeiro único, negociante quebrado) — a **isca
  do Apressado**: testamento + dívidas + gritos ouvidos da rua + "tomei a diligência
  das seis" desmentido pelo registro da estalagem. Mente por vergonha: implorou
  dinheiro às 18h45, foi recusado e pernoitou na vila (segredo `suplica_recusada`;
  o descarte físico está na mesma página — quarto às 19h40, água quente às 21h).
- **Sra. Agnes Rooke** (58, viúva, papelaria; noiva secreta da vítima) — a **isca
  secundária**: a última a vê-lo (ceia 20h05–20h45; a senhora na viela). Mente por
  decoro ("em casa desde as seis"); a cesta de ceia e o aro de ouro por gravar
  revelam o `noivado_secreto`. A morte a arruína — nada herda.
- **Caleb Grey** (46, moleiro) — **ruído que é pista dupla**: a queixa do relógio
  "mais leve" é o rancor mais barulhento do caso e, lida de perto, o registro da
  fraude de Silas. Álibi corroborado (moinho, véspera de feira, três homens).
- **Davey Tull** (15, aprendiz) — mente ensaiado pelo oficial ("saímos juntos às sete
  e meia"), por medo. Expô-lo é bônus, não pilar (`inocente_alibi`).
- **Delegado Lemuel Wycliffe** — fonte, não suspeito. Briefing planta a história A
  (relógio 08h45 + luz às 05h15 + caixa vazada = ladrão de madrugada) e as iscas.

### Cartas-chave além do corpo
- `dep_visto_vivo` — âncora durável de piso: o guarda Tobin viu a vitrine fechar às
  20h de sexta.
- `dep_avistamento_padeiro` — "a luz do velho" às 05h15: fato verdadeiro (o lampião
  esquecido), leitura falsa, refutável pela janela (o "momento Obra Dinn") — e o
  desfecho paga a explicação da luz.
- `dep_mulher_viela` — avistamento VERDADEIRO e irrefutável (sem hora nas tags): a
  lição inversa — nem todo depoimento é falso; este só pede o nome que a cesta dá.
- `ev_suplica_cesto` / `ev_registro_estalagem` — as duas rotas para o segredo de
  Walter; `ev_cesta_rooke` / `ev_anel_encomenda` — as rotas para o de Agnes.
- `corrob_pettigrew` — nó distante (1h30 por trecho, por lead): a carta do morto
  ("queixa contra pessoa a meu serviço, com discrição") + o casamento que revogaria
  o testamento. Segunda carta de móbil; reforça as duas iscas. Opcional, nunca pilar.

### As armadilhas pedagógicas
1. **A história A** — relógio das 08h45 + luz das 05h15 + caixa vazada: cada tijolo é
   um fato real com leitura errada. Confiar nela e não priorizar o corpo → o
   perecível perde precisão.
2. **Walter como distração** — motivo forte + mentira quebrada = "mentiu, logo matou"
   → Erro Judiciário. O descarte estava na mesma página do registro.
3. **Agnes como véu** — a última com o morto; mentira de decoro, não de sangue.
4. **Grey como ruído** — motivo público sem oportunidade; a queixa dele é o móbil de
   outro homem.
5. **Silas sem provas** — "quem acha o corpo" por faro, sem janela/causa/buril =
   **Impunidade**. Acusar exige materialidade.

---

## 15. Referência forense canônica

A base completa (com fontes de época) vive em `docs/kb-medicina-legal/`. **Valores
invioláveis do motor** — o jogo depende deles para ser resolúvel:

- **Rigor mortis:** surge 2–4h post-mortem, pleno ~12h, desaparece 24–36h. Sequência
  céfalo-caudal.
- **Livor mortis:** surge 1–2h; fixa definitivamente após ~12h (antes disso, some sob
  pressão digital).
- **Algor mortis:** resfriamento ~1°C/h a partir de 37°C, até a temperatura ambiente
  (margem ±2h no modelo). O ambiente padrão da cena (11°C) é a constante exportada
  `AMBIENTE_PADRAO` (`src/logic/tempo_morte.js`): carta de algor, termômetro e modelo
  de janela leem o mesmo ponto — ajuste num lugar só. Em prosa, a leitura do termômetro
  sai por `formatTemperatura` (`src/logic/tempo.js`): inteiro ou meio grau por extenso
  ("22°C e meio"), nunca ponto decimal.
- **IPM:** nenhum sinal isolado é definitivo; a convergência (interseção de janelas)
  reduz a margem.
- **Causa:** petéquias/cianose → asfixia (família); sulco cervical **horizontal** →
  ligadura; **oblíquo/ascendente** → enforcamento; escoriações/equimoses → reação
  vital; odor de amêndoas → cianeto; odor de alho → arsênico.
- **Dinâmica:** espasmo cadavérico, marcas de arrasto, livores incompatíveis com a
  posição, conteúdo estomacal, ausência de lesões de defesa.

Divergência entre a KB e estes valores é decisão do usuário — nunca de um agente.

O aparato **legal-policial** dentro do qual o perito opera (coroner e inquérito, polícia
de vila, murder × manslaughter, a cena sem cadeia de custódia) está em
`docs/kb-medicina-legal/inquerito-e-policia.md`; as lacunas temáticas mapeadas para
expansão futura, em `docs/kb-medicina-legal/lacunas.md` (expansão é decisão do usuário).

---

## 16. Arquitetura técnica

**Stack:** React (JSX) + Vite + Tailwind CSS · estado global com **Zustand** · dados em
módulos JS · lógica determinística em funções puras · zero chamadas de rede em runtime ·
3D com **three.js + @react-three/fiber v8 + drei v9** (versões EXATAS no package.json —
fiber v9/drei v10 exigem React 19), carregado por chunk lazy; do drei, só o `<Html>`.

**Estrutura de pastas:**
```
docs/           guia-de-estilo · biblia-de-vozes · kb-medicina-legal/ · historico-decisoes
.claude/        agents/ (escritor-prosa, editor-critico, perito-forense, fiscal-continuidade)
                skills/ (anti-padrao-ia, redigir-prosa, revisar-prosa)
src/
  assets/       fontes/ (IM Fell English, OFL) · sons/ (5 WAV sintetizados offline)
  data/         seed.js · catalogo_causas.js · cartas.js · localidades.js · mapa.js ·
                curriculo.js · glossario.js · rotulos.js · abertura.js ·
                aparencias.js (genótipo curado) · mapa_espacial.js (diorama) ·
                hotspots_corpo.js (exame 3D) — os três últimos: camada VISUAL
  logic/        veredicto.js (calcularVeredictoCadeia) · acusacao.js (gramática das
                ligações) · tempo_morte.js · cronos.js · falaDoMestre.js (dica) ·
                monologo.js · epilogo.js · tempo.js · interpolar.js ·
                hash.js (fonte única de sorteio) · aparencia.js · webgl.js (sonda)
  store/        jogo.js (Zustand: fases, relógio, mapa, cartasRegistradas, conclusoes,
                acusacao, log, detective, nosVisitados, nSubmissoes, somAtivo)
  som.js        efeitos sonoros da mesa (apresentação; nenhuma regra lê)
  components/   Escrivaninha · MesaLocalidades2D (grade/fallback) · EventoLocalidade ·
                MuralAcusacao · MonologoFinal · PainelAlibis · ModalGlossario ·
                Caderneta · TelaPersonagem · TermometroCorpo · Abertura · Overlay ·
                CartaMesa · RelogioBolso · RetratoPersonagem · Cena3DBoundary ·
                diorama/ (DioramaVila · Predio · RotuloNo) ·
                corpo3d/ (CorpoCanvas · CorpoModelo · HotspotCorpo)
```

**Convenções:**
- Estado central: `faseJogo`, `detective`, `horasJogo`, `horasChegadaCena`,
  `localidadeAtual`, `nosDesbloqueados`, `cartasRegistradas`, `conclusoes`, `acusacao`,
  `log`, `temperaturaMedida`.
- `conclusoes` guarda **só** a leitura do legista (`origem: 'mestre'`), exibida como
  dica — não vincula o veredicto.
- Determinismo: `Math.random()`/`Date.now()` proibidos em `src/logic|data|store`
  (guarda no `qa.mjs`); variação vem de `hashString` (`src/logic/hash.js`) salgado.
  O three.js usa `Math.random` em internos (uuid) — apresentação, exceção registrada.
- QA de UI: os textos de botões/rótulos clicados pelo `qa-ui.mjs`, as classes
  `.termo-clicavel`/`.termo-extraido`, o `data-overlay` e a ordem dos `<select>` do
  mural são intocáveis — mudar qualquer um exige atualizar o QA no mesmo commit.
- Código e comentários em português.
- Repositório: `github.com/santosbruno94/mortem-new`. Commits entre cada incremento
  maior.

**Direção arquitetural (jul/2026 — fundações do gerador procedural):** o caso, hoje
espalhado por `seed.js`/`cartas.js`/`localidades.js`/`mapa.js`/`dialogos.js`/etc. e com
valores de caso cravados no motor (`HORAS_CHEGADA_CENA`, `AMBIENTE_PADRAO`, calendário),
passará a ser UM **pacote de caso** serializável — objeto JSON único que o motor carrega,
contrato de saída do futuro gerador e prova de que "trocar a narrativa não toca o motor".
Sobre ele assentam: o **manifesto de assets** (asset 2D sob contrato, §3), retratos em
camadas, resource binding de prosa por slots tipados, taxonomia de **papéis dramáticos**
gerador-facing (nunca lida pelo veredicto) e o eco do mestre sobre falhas. Nada disso
altera as regras invioláveis: motor lê só `tagsOcultas` + seed; camada visual/narrativa
jamais lida pela lógica.

### 16.1 Gerador por simulação e interferência (jul/2026 — direção normativa)

O gerador procedural **comete o crime em vez de escrevê-lo**: a versão integral do
design vive em [`docs/game-design-simulacao.md`](./docs/game-design-simulacao.md)
(inclusive a tabela viva atributo → vestígio). O resumo normativo:

- **Autobattler de build time.** `resolverCrime(assassino, vitima, metodo, local,
  hora, seed)` simula o confronto rodada a rodada NA GERAÇÃO (RNG só de `hashString`
  salgado) e produz o `RegistroDoCrime` — sequência de eventos { ator, ação,
  célula/mobília, hora, vestígios_depositados[] }. O runtime só vê o registro; nada
  de batalha existe em jogo. **Reamostragem por rejeição:** batalha em que o assassino
  perde é descartada com sal incrementado — ele sempre vence, mas contra vítima forte
  as vitórias sobreviventes são as custosas (luta longa, ferimentos mútuos, ruído).
  Dois tipos de cenário: **premeditado** e **briga que escalou** (sem surpresa, sem
  vestígio de planejamento, motivo imediato).
- **Regra de existência de atributo.** Atributo só existe se mapeia para vestígio
  observável ou comportamento discreto de diálogo/interferência. Conjunto: **FOR**
  (STR+VIT fundidos), **INT** (elaboração do método), **WIS** (higiene de vestígios;
  nas testemunhas, acurácia), **CHA** (álibi; interlocutores). O quadrante **INT ×
  WIS** gera os fenótipos de assassino (do caso difícil ao brutal e desleixado); WIS
  governa a limpeza, INT só a complexidade. **Conservação da evidência:** limpar
  converte o óbvio em sutil, nunca em zero — toda limpeza deposita vestígio de
  segunda ordem. Variável de simulação sem vestígio diferencial = lint no QA. Sem
  ficha do detetive; sem grid de alinhamento.
- **Ordem de geração espacial:** cidade → elenco (**arquétipos** sorteados pela
  demografia de 1893, cada um com pacote espacial e priors com proveniência) →
  inserção espacial (endereços + rotina em 3 faixas → **grafo de avistamentos**, de
  onde saem álibis e ruído) → cena do crime → autobattler no grid da cena. Interior
  detalhado só para locais elegíveis a cena (LOD por relevância); o grid da batalha
  **é** a planta procedural que o jogador explora (proibida representação espacial
  paralela); todo vestígio nasce ancorado em célula/mobília.
- **Regras de Justiça da interferência (R1–R6):** interferência (ato do assassino/
  cúmplice contra a investigação) é **evento contingente pré-computado na geração** —
  nunca agência livre em runtime. R1: é um segundo crime sob pressão — resolve contra
  WIS com penalidade e deposita vestígio mais grosseiro. R2: saldo informacional ≥ 0 —
  só destrói evidência redundante (jamais a âncora durável ou o último caminho até
  ela) e sempre deposita vestígio novo. R3: causalidade diegética — gatilho é ação
  observável do jogador e o ator tem rota espacial plausível ("ele só soube porque
  eu…"; "ele só chegou lá porque…"). R4: interferência de alto impacto tem prenúncio
  legível. R5: orçamento de 2–3 eventos por caso, sorteados na geração. R6: catálogo
  fechado v1 (`destruir_evidencia`, `intimidar_testemunha`, `subornar_testemunha`,
  `silenciar`). O `qa.mjs` prova a âncora sob TODOS os ramos de eventos.
- **Atributos vivem apenas no gerador.** O pacote de caso carrega somente
  consequências (vestígios, flags de comportamento de diálogo, gatilhos de
  interferência); o motor é cego a atributos — mesma cegueira já garantida para
  aparências e papéis dramáticos.

---

## 17. Regras de desenvolvimento

- **Perfil do criador:** advogado sem background em programação. Instruções devem ser
  executáveis sem conhecimento prévio de dev.
- **Não criar features nem gastar tokens sem ordem expressa.** Design antes de build;
  confirmação antes de execução.
- Cada iteração é um **incremento jogável**, não um redesign.
- Prioridade: jogabilidade > complexidade técnica > visual.
- Medicina legal tecnicamente precisa, sempre (§15 + `docs/kb-medicina-legal/`).
- **Prosa segue o guia de estilo e passa pelo pipeline `revisar-prosa`** antes de
  commit (zero achados bloqueantes).
- Toda feature testável no navegador antes de avançar.
- Edições direcionadas a documentos/código existentes; explicitar o que NÃO deve mudar.
- Critério de validação de casos: resolúvel pelo Jogador Metódico; com ao menos 1
  armadilha para o Apressado; e Impunidade alcançável pelo Intuitivo (réu certo sem
  provas).
