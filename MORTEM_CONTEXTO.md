# MORTEM — Documento de Contexto

> Fonte única de verdade do design, escrita para humanos e para agentes de código.
> Descreve o **estado atual** do jogo — sem camadas históricas. O caminho até aqui está
> em [`docs/historico-decisoes.md`](./docs/historico-decisoes.md); o que ainda falta, em
> [`docs/pendencias-status.md`](./docs/pendencias-status.md). A prosa é regida por
> [`docs/guia-de-estilo.md`](./docs/guia-de-estilo.md) e
> [`docs/biblia-de-vozes.md`](./docs/biblia-de-vozes.md); o sistema visual (tokens de
> cor, cardápio tipográfico, matéria e legenda dos carimbos), por
> [`docs/sistema-visual.md`](./docs/sistema-visual.md); a verdade forense, por
> [`docs/kb-medicina-legal/`](./docs/kb-medicina-legal/), e o restante do mundo, da psique
> e do craft do mistério pelas demais bases (`docs/kb-mundo-vitoriano/`,
> `docs/kb-psique-e-crime/`, `docs/kb-craft-narrativo/`, `docs/kb-producao/`). O design do
> gerador por simulação vive em [`docs/game-design-simulacao.md`](./docs/game-design-simulacao.md);
> o plano contra a genericidade espacial dos casos procedurais (OS Vila Viva), em
> [`docs/os-vila-viva-e0-plano.md`](./docs/os-vila-viva-e0-plano.md) — **etapas E1–E4
> entregues** (planta procedural, prosa da vila + constable, mobília social, morfologias
> de vila por seed); E5 (a travessa dos fundos) pendente, com prompt em
> [`docs/os-vila-viva-prompts-implementacao.md`](./docs/os-vila-viva-prompts-implementacao.md).
> A genericidade **textual** dos casos procedurais foi atacada pela **OS Prosa Viva**
> ([`docs/os-prosa-viva-e0-plano.md`](./docs/os-prosa-viva-e0-plano.md)) — **Fase 0 + E1–E5
> entregues** (cold open da descoberta, corpo/forense variados dentro da precisão, banco
> combinatório de móbil/instrumento/segredo/cena/ecos, decorrelação + guarda anti-monotonia
> no QA). A **OS Diálogos/Escala/Localização** somou: a **variação das perguntas do perito**
> (casos gerados e tutorial), o **corpo e a cena no mesmo lugar** pela planta nos casos
> gerados, e a **maquete 3D sem sobreposição de etiquetas no celular**. A **OS Prancha da
> Vila** fechou o pivô visual no hub: a vila do caso é agora **prancha de gravura** (vista
> padrão em desktop e celular), com a hora em tinta, o beat de viagem em tacha de cera e o
> nó revelado a bico de pena; a maquete 3D fica como vista alternativa, intocada.

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

**Estética visual (`docs/sistema-visual.md` — registro completo das escolhas):** mesa de
madeira escura à luz de vela, e a matéria disso está na tela — veios e grão procedurais
(gradientes + ruído SVG de `seed` fixo, sem assets externos), halo de vela que respira,
papel com fibra e sombra, barbante com corpo (sombra + torção). A pergunta que decide
qualquer elemento novo é sempre a mesma: em 1893, que objeto físico faria este trabalho?
A cena é escura; o documento, claro.

*Tipografia — cinco vozes OFL embarcadas em woff2* (`src/assets/fontes/`, zero rede):
`prosa` **Libre Caslon Text** (TODA leitura longa ≥15px — a face de texto do jogo e do
`body`), `serif` **IM Fell English** (a voz do documento antigo: mestre, cartas,
anotações, legendas do atlas), `titulo` **Bevan** (egípcia de manchete: títulos de
painel), `rotulo` **Oswald** (condensada de balcão: carimbos, tarjas, horas, custos) e
`cartaz` **Rye** (wood type — a única licença de display, confinada à tela de título e
aos carimbos de desfecho). Hierarquia por corpo, caixa e espaço, não por peso.

*Materiais*, definidos uma única vez em `src/index.css` (depois de `@tailwind
utilities`) e `tailwind.config.js`: pergaminho escrito a tinta (`.carta-pergaminho`, com
as variantes `--acesa` do convite na mão e `--clara` do impresso recente), couro dos
painéis (`.painel-couro` — moldura de todos os overlays), placa de latão
(`.placa-latao` — só as ações solenes), botão de mesa (`.botao-mesa`), lacre prensado
(`.selo-lacre`) e selo de cera (`.selo-cera`), campo vitoriano (`.campo-vitoriano`),
mural de cortiça (`.mural-cortica`), coluna de jornal (`.coluna-jornal`), pauta do rol
(`.pauta-rol`), etiqueta de espécime com ilhó e barbante (`.etiqueta-especime`), carte
de visite (`.carte-visite`), formulário de telégrafo (`.telegrama-form`) e divisor
ornado (`.divisor-ornado`, com variante `--tinta` para papel claro).

*Cor:* `breu`, `madeira`, `couro`, `vela`, `papel`, `tinta`, `latao`, `cera` e
`garrafa` — este o único acento novo do pivô de imprensa — mais `equimose`/`sangue`
forenses; a mesma paleta serve 2D e 3D. Três tintas carimbam e cada uma promete sempre a
mesma coisa: **garrafa = conferido e registrado · cera = confronto e novidade · latão =
a hora e o custo** (daí a proibição de carimbar de cera um estado gasto). Os literais
`stone/amber` sobrevivem como neutros de apoio; **nenhum texto informativo desce de
`stone-400`**, e `tinta.apagada` (#6b5c43, 4,81:1 sobre pergaminho) é piso de contraste
— atmosfera não desculpa ilegibilidade. **Cor nunca informa sozinha**: toda distinção
tem forma, textura ou palavra redundante (o barbante torcido contra o pontilhado, a
etiqueta de papel ao lado do fio). Sem ícones modernos; ornamentos tipográficos
discretos (§, ―, ❦).

*Notação da hora — o suporte decide:* documento vai por extenso (`formatRelogio` — "14
de outubro, 13h10": ficha, mural, relógio de bolso, monólogo); lista compacta vai curta
(`formatHoraComDia` — "13h10 de 14/out": as duas listas da Caderneta). **Dia da semana
não se imprime**: `tempo.js` não o formata e o `calendario` do pacote não o carrega.

**A vila do hub — a Prancha e a maquete (OS Prancha da Vila, jul/2026):** a vista PADRÃO
da escrivaninha é a **Prancha da Vila** (`src/components/prancha/PranchaVila.jsx`): a vila
do caso estampada como **gravura de 1893** em SVG procedural — moldura de quadro gravado,
horizonte, casario hachurado, um prédio por nó desbloqueado (silhueta derivada da MESMA
`forma` que o diorama consome), escala gráfica e rosa dos ventos. As etiquetas dos nós são
as MESMAS do diorama (`RotuloNo`, HTML real sobre o desenho, com o mesmo handler de
viagem). A **hora vira tinta** em três alavancas — densidade da hachura do céu, véu em
`multiply` sobre o quadro, e as janelas em âmbar pela mesma `janelaAcesa` do 3D —, o **beat
de viagem** é a tacha de cera correndo a estrada desenhada (com a conta da hora numa linha
lida) e o **nó revelado por lead** entra a **bico de pena vermelha**, com o carimbo
`Acrescido <hora>`: gravado = estava lá desde a chegada; pena = você descobriu, e quando.
No **estreito** (≤430px) a prancha é só figura e a navegação desce para a **régua de
fichas** (alvo ≥44px). A **maquete 3D continua inteira**, a um clique no alternador
"A prancha" / "A maquete" no pé da mesa (preferência em `localStorage`); sem WebGL, em
`?flat=1` ou depois de o contexto cair, o botão diz por que não pode subir e a prancha
segue — ela É o fallback. O chunk do three.js só desce se o jogador pedir a maquete.

**Camada 3D (apresentação pura):** a profundidade 3D da mesa concentra-se hoje num único
ponto — o **diorama da vila** (maquete de papel pousada no alto da escrivaninha: prédios
procedurais com **telhado de duas águas**, chaminés, marquise e pás — sempre primitivas
compostas; clicar num prédio VIAJA, e o nó distante surge crescendo com a estrada ao ser
desbloqueado). A fonte da maquete é **dupla** (OS da vila na mesa): o caso-escola usa o
mapa espacial estático (`src/data/mapa_espacial.js`); o caso **gerado** traz a própria
vila no campo visual `maquete` do pacote (posições dos nós, formas, a tábua sob medida e
o **casario de cenário** — a vila inteira da seed na tábua, só os nós com etiqueta e
clique; nós que dividem prédio viram **anexos** escalonados, na linhagem da
relojoaria_fundos). Regras da camada 3D: geometria 100% procedural (proibido
GLTF/textura externa — three.js + @react-three/fiber v8 pinados, chunk lazy próprio),
dados espaciais como camada visual que o motor nunca lê (guarda GE3 cobre `maquete`), e
**fallback 2D obrigatório** (`?flat=1`, sonda WebGL, ErrorBoundary): sem 3D, a prancha
assume; sem espaço conhecido, a grade de localidades original joga idêntico.

**Pivô "Gabinete Ilustrado" (jul/2026 — `docs/nota-gabinete-ilustrado.md`):** a
apresentação migrou para o registro de **visual novel de gravura**. O exame do corpo
deixou de ser cadáver 3D e passou a ser **A Prancha** — figura de atlas de medicina legal
em SVG procedural (`PranchaCorpo.jsx`: lente que segue o ponteiro, frente/dorso e camada
de necropsia; pose/livor pelo IPM; hotspots que extraem as MESMAS cartas dos termos em
negrito, via `hotspots_corpo.js`). Diálogos e localidades compõem **A Cena** ilustrada
(`CenaDialogo.jsx`/`FundoCena.jsx`: fundo 2D paramétrico por localidade + sprite meio-corpo
do genótipo de aparência, com "gravura que respira" e reação observável). Tudo procedural —
o placeholder É o fallback (slots `prancha_corpo`/`fundo_cena` prontos para arte externa
sob contrato). O código do diorama da vila segue intocado — desde a OS Prancha da Vila,
como vista alternativa (ver acima).

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
posto do guarda, Painel de Álibis, Juízos do mural, e o sprite meio-corpo da Cena de diálogo) e
a compleição/tom da **Prancha** do corpo da vítima. JAMAIS entra em `tagsOcultas` nem é
lida pelo veredicto (guarda no QA).

**Som:** cinco efeitos curtos, sintetizados offline e embarcados (`src/assets/sons/`,
tocados por `src/som.js`): papel (extrair carta), sino (viajar), barbante (ligar/
desfazer no mural), lacre (selar o julgamento), pena (avançar a abertura). O som é
apresentação — nenhuma regra depende dele — e desliga-se no rodapé da escrivaninha
("Som: aceso/apagado"). Zero rede em runtime segue valendo.

---

## 4. O loop de jogo

1. **Abertura** (nove passos, OS-R3) — O jogo abre **pelos olhos de quem achou o
   corpo**, na manhã de sábado em Briarstone (D13: a abertura testemunhal é o molde de
   todos os casos), e só então corta para a escrivaninha vazia de Caulfield (pensão
   miserável). A Sra. Potts entrega o maço: o telegrama do Dr. Abbot, a **ordem do
   coroner** Bramwell Foy — quem manda examinar o corpo e quem paga por ele, £2 2s do
   Medical Witnesses Act 1836, com a data do inquérito — e a carta do guarda de
   Briarstone, que é *coroner's officer* e notifica, nunca contrata. Aceitar transforma
   a escrivaninha no hub de investigação. **O prazo do inquérito é ficção**: nenhuma
   regra o lê (D12).
2. **Briefing** — Chegada a Briarstone. O guarda Wycliffe apresenta o caso (custo
   zero). Perguntas ao guarda plantam informações e iscas.
3. **Investigação** — Chegada às 13:00. O relógio só corre ao **VIAJAR** no mapa;
   dentro do local, congela. O jogador alterna entre:
   - **Viajar** entre nós do mapa (custa horas; o mapa cresce por leads);
   - **Examinar** localidades e **interrogar** suspeitos (clicar nos negritos extrai
     cartas; custo zero) — na prancha do corpo, a **voz do mestre** dá a leitura (o Dr.
     Abbot, ausente, recordado pelo aprendiz);
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
[A prancha | A maquete]  [Caderneta]  [Painel de Álibis]  [Glossário]
```

- **Relógio de Bolso** (sup. direito): avança apenas ao **VIAJAR**; dentro do local,
  congela.
- **Superfície Livre** (centro): cartas arrastáveis, custo zero. **Localidades são nós
  do mapa**; clicar **VIAJA** (custa tempo, `src/data/mapa.js`) e abre o evento como
  overlay (`blur(6px)` + `opacity 0.3`, `position: fixed`). Só aparecem os nós
  **desbloqueados** (o mapa cresce por leads). Não existe troca de tela. Por padrão os
  nós vivem na **Prancha da Vila** no alto da mesa (gravura em SVG; rótulos em HTML real,
  mesmos textos); a **maquete 3D** é vista alternativa, a um clique no alternador do pé da
  mesa; sem espaço conhecido no caso, a grade 2D original (`MesaLocalidades2D.jsx`) segue
  como fallback derradeiro — o handler de viagem é **um só para as três vistas**.
- **A parede** (botão "Construir a Acusação"): abre o mural com barbante (§8).
- **Caderneta** (overlay, custo zero): log de tudo que foi extraído e concluído; exibe
  a leitura do mestre como dica.
- **Glossário Forense** (overlay, custo zero): referência de época, contexto-sensitivo.
- **Painel de Álibis** (overlay, custo zero): ver §9.

**Regras UX:** nenhuma ação exige mais de 2 cliques; feedback visual imediato; a
interface ensina pela forma, não por texto tutorial.

### 5.1 A cena única, a planta da relojoaria e os pontos de interesse

**Um prédio, um nó (OS-R2 — Cena Única).** A relojoaria Arthurs era três nós de mapa para
o mesmo endereço (`corpo`, `cena`, `oficina`). Passou a ser **um**: `relojoaria`, com
**sub-locais** — `corpo`, `escritorio`, `loja`, `copa`, `oficina` e `porta_beco`. A saleta
onde Silas recebe continua nó próprio, no mesmo grupo. O contrato do esquema: **uma carta
resolve-se por `localidade` + `subLocal`**; `subLocal` ausente significa "raiz da
localidade" e continua válido para tudo o que não se fundiu — os casos gerados não
declaram sub-locais e jogam idêntico. Uma localidade que se divide declara
`subLocais: [...]`, e **cada sub-local carrega o que a sua antiga localidade carregava**
(título, subtítulo, ações especiais, introdução, prosa, gestos, pontos quentes). O
sub-local corrente vive em `subLocalAtual` no store — dado de UI, que nem o veredicto nem
a acusação leem. O nó de chegada do perito sai do pacote (`parametrosCena.noChegada`): o
caso-escola chega à `relojoaria`; os gerados, ao seu nó `cena`.

Os nós do **mesmo prédio** (grupo `relojoaria` de `src/data/mapa.js`) ganham uma **planta
baixa** que permite **andar entre cômodos** sem tocar o motor. Ao abrir a relojoaria ou a
saleta, a visão pousa a planta no topo (`src/components/PlantaRelojoaria.jsx`, sobre o dado
visual puro `src/data/planta_relojoaria.js`): SVG procedural em **traço de tinta sobre
papel** — a loja com balcão e vitrine à frente, o corredor com a escada, o escritório dos
fundos, a copa apertada e a oficina ao fundo, a saleta, a porta do beco. O **escritório dos
fundos é uma sala só com dois alvos** (o corpo jaz na cena): a sala tem os cliques "a cena"
e "o corpo". Um alvo que declara `sub` **troca de sub-local** (viajando antes, se o perito
estiver noutro nó — é assim que se volta da saleta ao corpo); um alvo só com `no` **viaja**
para o nó (custo 0 — mesmo prédio, a regra de `mapa.js`). Em qualquer dos casos o cômodo
sob os pés fica marcado "— aqui —". É SVG 2D puro: **funciona idêntico em `?flat=1`**; em
tela estreita, colapsa numa régua horizontal de cômodos.

O posto policial chama-se `posto_do_guarda` desde a OS-R2 (era `delegacia`), em acordo com
a D11 revista: a glosa do policial é **guarda**, e o lugar, «O Posto do Guarda».

**A torre, e o que a cifra abre (OS-R4).** O mapa ganhou o nó `torre_sino` («A Torre de S.
Miguel», grupo `vila`), onde recebe o sineiro **Amos Kell**. O nó **nasce aberto** — a G10
proíbe beco sem saída, e Amos tem de ser sempre alcançável. O que a cifra abre não é o nó:
é um **parágrafo de prosa condicional** (`prosaCondicional`, campo já existente da
localidade, com `requerCartas`). Sem a gravação da tampa de dentro na mesa, o perito sobe,
conta seis sinos e desce de mãos vazias; com ela, entra o parágrafo da câmara dos sinos, e
com ele o marcador do Livro II. É **camada narrativa pura**: a condição lê ids de carta
registrada, o motor não a lê, e a extração continua a ser a de sempre. O contador de
esgotamento do lugar passou a contar também a prosa condicional já visível — sem isso, um
lugar anunciava-se esgotado com uma carta ainda por colher.

Camada VISUAL: `planta_relojoaria.js` referencia os ids de nó pelos alvos, mas **nenhuma
regra o lê** — trocar a planta nunca toca o jogo.

**A planta chega aos casos procedurais (OS Vila Viva E1).** O componente foi
generalizado em `src/components/Planta.jsx` (o `PlantaRelojoaria.jsx` virou um wrapper
fino), com dois modos: o **modo nó** do caso-escola (alvos que viajam entre nós, custo 0)
e o **modo ponto** dos casos gerados — a planta projetada do grid do prédio
(`interior.planta`, já no schema de `planta_relojoaria.js`, viaja no pacote na localidade
`cena`) desenha os cômodos e liga cada um ao ponto do acordeão que dele deriva: clicar um
cômodo **abre e realça** o ponto correspondente. Fallback obrigatório — sem planta no
pacote ou em `?flat=1`, o acordeão de pontos de sempre assume, idêntico.

**Corpo e cena no mesmo lugar (procedural — OS Diálogos/Escala/Localização).** No
caso-escola a planta já unia o corpo e a cena (os dois alvos do escritório dos fundos);
nos casos gerados faltava o elo, porque a localidade do `corpo` não trazia planta e nada a
ligava à `cena`. A montagem do pacote agora **liga o cômodo do corpo aos dois nós** — o
gancho `alvos`, que nasce vazio na projeção do grid (`interiores.js`) e é preenchido na
Fase 4 (`pacote_gerado.js`): o cômodo onde jaz o corpo ganha os alvos "a cena" e "o corpo".
A **mesma planta ligada** viaja nas duas localidades (`corpo` e `cena`), e o perito anda
entre elas a 0h pela planta — como no tutorial. O `Planta.jsx` é **híbrido**: o modo ponto
(acordeão da cena) segue intacto, e sobre ele entra o **alvo de viagem** entre nós (na cena
mostra "o corpo"; no corpo, "a cena"). Camada visual — o motor jamais lê a planta.

**Pontos de interesse:** as localidades (e os sub-locais) podem trazer o campo opcional
`pontos: [{ id, rotulo, prosa }]` (mais um `introducao` de ambientação sem carta). Quando
existem, a prosa monolítica se divide em **pontos clicáveis** (acordeão): clicar num ponto
revela o parágrafo com os seus termos extraíveis — **coleta em camadas**. Cada ponto exibe
um contador `n/total` das suas cartas. Restrição dura: **todo `[[id]]` extraível continua
alcançável em algum ponto** — guarda estática no `scripts/qa.mjs`, que varre a localidade e
os seus sub-locais (cartas do lugar ⊆ união dos `[[id]]` dos pontos). Uma segunda guarda,
a **GR2-1**, prova a topologia nos dois sentidos: nenhuma carta aponta para localidade ou
sub-local que não exista, e nenhum sub-local **com carta** fica sem sala clicável na planta.
No vertical slice têm pontos o **escritório** (a lareira, a escrivaninha), a **loja** (a
vitrine e a porta do beco), a **copa** e a **oficina** (a prateleira de gravar, o púlpito
de ordens, a gaveta funda, o aprendiz); o corpo (exame em prancha) e a saleta seguem em
prosa contínua. Observação pura (guia §2): o ambiente descreve; quem estranha é o jogador.

### 5.2 As duas vistas da vila e o teatro da mesa

A vila do caso tem duas superfícies, e o teatro é 100% apresentação nas duas, lendo estado
derivado (o relógio, o custo de viagem, os nós novos) — nunca as `tagsOcultas` nem o
veredicto. A **Prancha da Vila** é o padrão: a vila estampada como gravura de 1893, tinta
sobre papel, onde nome, custo, tacha e carimbo cabem nativamente. A **maquete 3D** é o
diorama de sempre, agora atrás do alternador: não persegue realismo (a geometria procedural
sem GLTF/textura torna essa briga perdida) e abraça **"maquete de papel sobre a
escrivaninha"** — a vila é um modelo que o perito montou para pensar.

**Na prancha (OS Prancha da Vila):**

- **A hora vira tinta**, em três alavancas e só três (`tintaDaHora` em
  `src/logic/prancha_vila.js`): a densidade da hachura do céu (rala → densa → traço em
  azul-tinta), um véu em `mix-blend-mode: multiply` sobre o quadro (nada → sépia → frio) e
  as **janelas em âmbar**, pela MESMA `janelaAcesa` que o 3D consome. A hora troca
  atributos, nunca geometria: zero frame, zero rAF — e por isso `prefers-reduced-motion`
  não muda a leitura da hora (a hora é estado, não animação). Da noite em diante, a etiqueta
  do nó sem lampião declara `sem luz a esta hora`.
- **O beat de viagem** é a **tacha de cera** correndo a estrada desenhada, com rasto
  pontilhado, sob um véu de papel que esmaece o resto; a tarja do relógio mostra a hora de
  partida → a de chegada, e a conta da hora se lê numa linha (`precoDaViagem`): relógio,
  **rigidez na chegada** e o **perecível em risco**. Um toque **corta** o beat: o local abre
  no ato e o estado final é idêntico (quem paga a hora é o motor, no clique).
- **O nó acrescido.** Numa prancha impressa não cresce nada: **acrescenta-se**. O nó
  revelado por lead entra **a bico de pena vermelha** — fora do quadro gravado quando fica
  fora da vila (o quadro comprime e um fio pontilhado marca onde a estampa acaba), no seu
  lugar geográfico quando é da própria vila —, com o carimbo `Acrescido <hora>`. **Gravado =
  estava lá desde a chegada; pena = você descobriu, e quando** (regra em
  `docs/kb-producao/ui-e-estetica.md` §8). A hora do carimbo sai da MESMA anotação que a
  Caderneta registra para o desbloqueio (`src/logic/desbloqueio.js`).
- **No estreito (≤430px)** a prancha é SÓ FIGURA e a navegação desce para a **régua de
  fichas** (`ReguaNos.jsx`, alvo ≥44px, ordem do hub). Sem etiqueta no desenho, o
  desobstrutor de rótulos deixa de ser preciso neste caminho.
- **O arranjo das etiquetas** é a função pura `arrumarEtiquetas`: cada etiqueta procura
  lugar em anel em volta da fachada (sobe, desce, por fim anda de lado), contra as caixas
  medidas das vizinhas, e nunca sai da folha. O cordão é traço de SVG e segue nos dois
  sentidos.

**Na maquete 3D:**

- **Luz da hora.** `src/data/mapa_espacial.js` traz `CICLO_LUZ` (keyframes por hora) e
  `interpolarLuz(horasJogo)` — dado **puro** (sem `Math.random`/`Date.now`). `DioramaVila`
  interpola a luz por frame (`LuzDoDia`): tarde dourada → crepúsculo → noite azulada com
  os **lampiões âmbar** das janelas queimando (`luzRef.lamp`), sob **névoa baixa de
  outubro** (fog). Ciclo **perceptível e contido**: a noite escurece sem apagar a leitura.
- **Beat de viagem.** Uma viagem com **custo real** (>0h) ganha um beat de ~0,7s: o **pino
  do perito** (alfinete de cabeça vermelha, `PinoPerito.jsx`) desliza o trajeto com o custo
  em horas flutuando junto, e a luz vira com a hora — só então o local abre (a mesa desfoca
  ao abrir o overlay, não antes). A **duração vive num lugar só**
  (`src/logic/beat_viagem.js`), lida pelo pino, pela tacha da prancha e pelo hub. Viagem de
  0h (andar pela planta) e a grade 2D de cartas abrem no ato. O handler de viagem é o mesmo
  das três vistas (paridade).
- **Silhueta e etiquetas.** Prédios com telhado de duas águas, chaminés, marquise e pás
  (silhueta estática); os rótulos são **tags de papel pendentes** (mesmos textos e handler),
  e o destaque de nó novo pulsa em **CSS** na tag — o `frameloop="demand"` da maquete segue
  intacto (parada = zero frame).
- **Etiquetas sem sobreposição no celular (OS Diálogos/Escala/Localização).** Em tela
  estreita a vila inteira **cabe na largura** (sem rolagem lateral, nada cortado) e um
  **desobstrutor determinístico** projeta cada âncora ao espaço de tela (câmara ortográfica
  fixa) e **afasta na vertical** as etiquetas que colidiriam — inclusive o retângulo do
  relógio de bolso, tratado como obstáculo fixo. O deslocamento (px por nó) é estável por
  tela e **sem `Math.random`**; só o cordão da tag alonga (o clique fica intacto).
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

A ficha (estilo etiqueta de exposição / laudo de época) traz: `textoDisplay`, a
**descrição completa** (o exame de perto), a `vozMestre` em itálico quando a carta a
tem, o carimbo, a hora do registro (`formatRelogio`) e o **lembrete de origem**
("extraído em: {localidade}", `[data-origem-carta]`) — para reencontrar de onde a carta
veio sem voltar à mesa. **A ponte "§ termo, no Glossário" foi removida** (jul/2026, item 5
do playtest humano): apontar o verbete entregava a dedução (ex.: "reação vital"); o
Glossário segue acessível pela mesa e o tutorial guia até ele quando é hora. Botão único,
**"Arquivar na mesa"**, fecha a ficha e devolve a carta à superfície (o som de papel toca
na abertura da ficha e no aviso de pouso, não na extração).

A ficha é **consulta de custo zero** e reabre a qualquer momento: clicar numa carta
pousada na mesa a reabre; **o próprio termo já extraído na prosa** vira um "link
visitado" (roxo, `.termo-extraido` clicável) que reabre a ficha ali no texto, sem voltar
à mesa (item 6 do playtest humano); e dentro do Mural da Acusação a carta abre em leitura
sem sair da estação. Implementação: `fichaAberta` no store (id puro, serializável) e
`src/components/FichaEvidencia.jsx`; empilha acima dos demais overlays
(`data-overlay="ficha"`, `z-50`).

Consequência para a **Caderneta** (§5): rebaixada a **diário** — a lista de observações
reunidas passa a ser compacta (carimbo + hora, cada linha reabrindo a ficha). A
descrição de perto e a voz do mestre moram na ficha, não na Caderneta; a "Leitura do
mestre" e o diário da investigação seguem sendo a função verdadeira da Caderneta.

---

## 7. A leitura do mestre (a dica falada)

Não há gavetas nem mostradores: a leitura forense é **a voz do mestre**
(`src/logic/falaDoMestre.js`) — o Dr. Abbot, ausente da cena (reforma da abertura,
jul/2026), recordado pelo aprendiz Harlan enquanto examina. Em linguagem natural, a partir
do que o jogador examinou — a janela via `calcularJanelaMorte` (`cronos.js`), o mecanismo
via `mecanismoCravado` (`catalogo_causas.js`). A leitura é refeita a cada exame
(`consolidarLeituraMestre`, ids estáveis `leitura_mestre_janela`/`leitura_mestre_mecanismo`)
e guardada em `conclusoes` (`origem: 'mestre'`), exibida no exame do corpo (ao lado da
Prancha) e na Caderneta. Cada aparte recordado remete ao **Glossário** ("o mestre já falou
disso"), onde o tutorial ensina a ler o sinal em vez de o entregar mastigado.

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

**São TRÊS beats, e o terceiro é o da pressão (OS-R6, D7).** Até 26/07/2026 a conversa
morria no segundo, e quem chegasse sem carta nenhuma fazia duas perguntas e saía. O beat
3 existe nas cinco árvores, nos quatro tons, e o eixo é comum: **o que esta morte muda
para quem ficou**. Ele **não pede carta, não abre nó e não marca nenhum `[[id]]`** — é
por esse desenho que a solubilidade fica satisfeita por construção.

**A exposição (E0/E1/E2) — `src/logic/exposicao.js`.** Função **pura** das cartas na
mesa, sem estado e sem flag escondida: mede **quanto do dossiê daquele suspeito o perito
trouxe para a sala**, e paga com isso a `alfinetada` do beat 3 — em E0 o suspeito
responde o perguntado; em E1 a compostura falha num gesto; em E2 ele diz, do seu jeito,
que o perito chegou sabendo. O acréscimo é **caráter, nunca fato novo do caso**.

O dossiê de um suspeito é o que se acha **fora** da conversa dele: as cartas que o
apontam (`ligadoA`/`pertenceA`/`declaranteId`), mais as que a árvore dele está escrita
para reagir (`reacoesProva`), **menos** as que nascem da própria boca dele. O corte de E2
são **dois terços do próprio dossiê** — relativo, e não absoluto, porque o réu tem o
maior dossiê do caso (5, empatado com Walter) e um corte absoluto o faria subir de nível
antes dos inocentes, transformando o nível em delator. Com a régua relativa, **material
equivalente dá nível equivalente**, e os cinco alcançam os três níveis.

O **motor é cego** à exposição: `veredicto.js` e `acusacao.js` não a leem, e o `qa.mjs`
cobra por leitura de fonte.

**A escada de confronto (D8) é contador autoral.** Um nó de reação pode trazer `degraus`:
cada degrau declara uma **lista curada** (`contaEntre`) e um **corte** (`aPartirDe`), e
vale o último degrau cuja contagem a mesa satisfaz — nunca `requerTodas`. O segundo
degrau do testamento de Walter é o caso vivo: com dois dos três papéis na mesa, ele
admite que soube da mudança e diz por que a omitiu. Degrau rende **prosa e nada mais**.

**A procedência das alegações (`apontadaPor`, D17) — `src/data/procedencia.js`.** Quem
**pôs** a alegação em circulação, que não é quem ela acusa. Vive **fora de
`tagsOcultas`**, pela mesma razão que a aparência de personagem vive: campo dentro das
tags é campo que o motor pode ler amanhã sem que ninguém repare.
`src/logic/contaminacao.js` faz a conta que a D16 pedia — **papéis somam-se, bocas é que
corroboram**: o álibi do réu, a lição que Davey repete e a senhora da viela da Sra. Wick
saem da mesma boca, e valem **uma** voz, não três.

**A pergunta do perito varia (OS Diálogos/Escala/Localização).** A redação das perguntas
do perito era fixa — nos casos gerados, **igual em todo caso** (a superfície de diálogo que
mais cansava quem jogava vários). Agora cada tom tem um **pool de fraseados**, escolhido
deterministicamente, **preservando a intenção do tom** (e o mecanismo tom→nó): nos casos
gerados, por `hashDecisao` salgado com a seed e o suspeito, baked no pacote; no caso-escola
(seed fixa), pelo **eixo da persona do perito** — `op.rotuloVars` resolvido em render por
`escolherDeterministico` (chave = perito|suspeito|nó|índice), de modo que cada perito ouve
as próprias perguntas. As **respostas** dos NPCs gerados já variavam (OS Prosa Viva); esta
frente fecha o alcance às **falas do jogador**. O contrato do QA fica intacto: as opções
seguem clicadas por **tom** (`data-tom`), não pelo texto.

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
    b2_obliquo: { fala: ['…: [[comp_silas]].'], opcoes: OPCOES_B3_SILAS },
    // O beat da pressão: sem carta, sem nó novo. `alfinetada` é o que a
    // exposição paga (E1/E2); em E0 não há acréscimo. Terminal: sem volta.
    b3_obliquo: { fala: ['…'], alfinetada: ALFINETADA_SILAS, opcoes: [] },
    confronto_estalagem: { fala: ['…'], opcoes: [] }, // reação; a conversa retoma
    // Escada de confronto (D8): contador autoral, nunca `requerTodas`.
    confronto_testamento: { fala: ['… o 1.º degrau …'], opcoes: [],
      degraus: [{ contaEntre: ['corrob_pettigrew', 'ev_bilhete_vigario', 'ev_suplica_cesto'],
                  aPartirDe: 2, fala: ['… o 2.º degrau: "Sabia." …'] }] },
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

### 7.2.1 O verbo "Exigir que mostre" (Inc. 6 — marcas corporais)

O perito pode **exigir que o suspeito mostre** uma região do corpo (mãos, antebraços,
botas) durante o interrogatório. O verbo é um **canal lateral** como o confronto e o
gatilho de complexo: transitório, a conversa retoma sem descer a árvore.

**O circuito:** (1) a perícia do corpo da vítima anuncia um **sinal** que implica marca-
espelho no agressor (carta `gen_sinal_exigivel`, `localidade: 'corpo'`); (2) a carta
na mesa **desbloqueia** os botões ✋ nos interrogatórios; (3) exigir mostra um close —
a marca do culpado ou "nada de nota" para os inocentes; (4) a reação é transitória
(não persiste, não desce a árvore).

**Ruído honesto (decisão 4.3, guarda no QA):** todo caso com marca-espelho no réu
tem **≥2 inocentes com marca plausível** (1 ocupacional, por ofício — ferreiro,
lavadeira, etc.; 1 situacional — arranhão de gato, queda, lama de outubro). A marca
nunca é âncora única de autoria (Via B, `os-p9-ancora-hibrida.md`).

**Frequência:** o autobattler só produz `ferimento_do_agressor` quando a vítima fere o
assassino na luta (~15% das seeds). Em casos sem ferimento, o verbo não existe — não
há sinal para anunciar. Veneno não produz marca corporal (design intencional).

**Dados:** vocabulário em `src/gerador/marcas_exigiveis.js` (métodos, regiões, marcas
inocentes); depósito em `src/gerador/caso.js` (`marcasCorporais`); nós de diálogo em
`src/gerador/dialogos_gerados.js`; estado no store (`exigenciasFeitas`). O motor é
cego — nenhuma regra em `src/logic` lê a marca ou o gesto.

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

**A folha do inquérito e a espécie do barbante (apresentação pura).** Na coluna
esquerda do mural — fixa em tela larga, ao pé no celular — pende um pergaminho pregado
com duas tachas (`mural/FormularioInquerito.jsx`) que mostra em quatro claros numerados
o que a acusação **afirma** (réu, janela, causa, móbil) e o que ainda está por afirmar,
fechando com o lacre prensado. Lê só o objeto `acusacao` que o mural já tem em mão e não
escreve nada. Cada barbante diz o que afirma por **textura e etiqueta de papel, nunca
por cor sozinha** — presença é fio torcido, desmente é pontilhado; as etiquetas vivem
numa camada de SVG acima das cartas (o fio pode passar por trás de uma carta pregada, a
etiqueta não pode sumir com ele), e a `LegendaBarbantes` mostra só as espécies que o
jogador de fato amarra, dizendo que *quando* e *como* o corpo declara sem fio.

---

## 9. Painel de Álibis

Overlay de consulta intitulado **"Declarações de Paradeiro"**. A forma é a de um **rol
de declarações tomadas a escrito** (pauta traçada à régua, três colunas: Nome ·
Paradeiro declarado · Horas declaradas): **uma linha por suspeito**, na ordem do
inquérito, alimentada pelas cartas de álibi já coletadas (`dominio: 'comportamental'`,
`subDominio: 'alibi'`). Quem ainda não declarou ocupa a **linha em branco** — a pauta
mostra o que falta colher tanto quanto o que já se colheu. O elenco vem de
`obterSuspeitos()`, que a mesa já expõe por inteiro: listar os nomes não revela nada.
Um mesmo declarante que retifique o paradeiro empilha as declarações na própria linha,
na ordem em que foram colhidas. No celular a pauta empilha (cabeçalho some; nome,
paradeiro e horas em três alturas).

Segue **estritamente neutro**: **sem marcadores de status**, sem cruzamento automático,
sem rótulo de origem da corroboração (leria a tag oculta `corroborado`). É o único
painel do jogo sem voz própria — só colunas, nenhuma frase que conclua por quem lê. O
cruzamento ativo — desmentir uma alegação ligando-a aos fatos do corpo — é ATO do
jogador no mural.

## 9.1 Glossário Forense

Referência de época, consulta gratuita, overlay com navegação por domínio (5 domínios →
termos → definição). Cada verbete: termo, definição tecnicamente precisa, domínio,
sinal observável. É o material que permite ao jogador interpretar os dados brutos sem
que o jogo interprete por ele. Abre filtrado por contexto quando pertinente. Conteúdo
validado contra `docs/kb-medicina-legal/`.

A forma é a de uma **folha de compêndio impresso** (papel de tiragem recente,
`.carta-pergaminho--clara`, sem a mancha de guarda das cartas que correram a cena):
entrada em egípcia de manchete, linha de classe à maneira de léxico, corpo justificado,
divisor § e o "Sinal observável" abaixo; o índice em letra de balcão, com a entrada
aberta emoldurada a latão. Sem colofão de autoridade — o acervo mistura fontes e
nenhum par de nomes o cobre.

---

## 10. Tempo e Degradação (relógio MOLE)

- Relógio global em horas (`horasJogo`). A **hora de chegada vem do pacote**
  (`parametrosCena.horasChegada` — fonte única desde o diagnóstico de 21/07): **13h00**
  no caso-escola, **11h00** nos casos gerados de palco interno
  (`HORAS_CHEGADA_INTERNO`, `src/gerador/ponte_caso.js`), variável no palco externo
  (descoberta + 2–4h, teto 13h).
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
a encenação só entra se a peça forjada foi refutada (a peça pode ser o mostrador da
lareira ou, nos casos gerados, a temperatura do corpo — aquecida ou resfriada; mesmas
tags, mesma refutação pelos relógios duráveis do corpo, §16.1); "o paradeiro que
firmei" exige o álibi do periférico na mesa (sem ele, o juízo é narrado como
convicção); o instrumento citado vem do sinal que cravou a causa, nunca de um
vestígio avulso.

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
horas usadas (contadas a partir de `parametrosCena.horasChegada`, não de um 13h fixo),
lugares visitados (nomeando o que ficou por visitar entre os nós desbloqueados — nunca
os não revelados), observações registradas, acusações levadas a julgamento. Só então
"Fechar o caderno" encerra de fato.

**A forma é impressa: O MENSAGEIRO DO CONDADO** — cabeça de página com nº de edição,
periodicidade ("Publicado aos sábados, dia de feira") e preço; manchete nominal em caixa
alta com decks empilhados sob filete; crédito de correspondente; a matéria em duas
colunas justificadas com capitular. Ao lado, **"A lápis, na margem"**: o que o perito
sabe e a folha não podia imprimir. A divisão não é estética — o que é insinuação sobre
quem o inquérito não acusou, juízo moral sobre quem mentiu ou fala em primeira pessoa
do perito vai à margem; a coluna fica com o fato dos autos. A cabeça do **Erro
Judiciário é idêntica à da Vitória Absoluta**, palavra por palavra: a imprensa não tinha
como distinguir as duas, e é esse o ponto. O retrato da investigação fica **fora** da
folha, na placa de latão (o jornal não teria como saber as horas e os lugares do
perito). `epilogo.js` emite `colunas` e `margem` sem perder `blocos`, a ordem de sempre
que o `qa.mjs` lê. **Nenhum particípio flexiona pelo réu** — o pacote não guarda gênero
(§ Divergências em `docs/sistema-visual.md`).

---

## 12. Personagem jogável

Um único perito (decisão de jul/2026 — a perita Lenore foi removida do escopo):

- **Harlan Blackwell** — aprendiz de Dr. Abbot, 24 anos.
  Frio, metódico; especialista em intervalo post-mortem.

**Sistema de variáveis (mantido — é estrutural):**
```js
detective = { name: 'Harlan', surname: 'Blackwell', pronoun: 'ele', treatment: 'Sr.', title: '' }
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

**Estado (jul/2026) — os quatro chamados da tela inicial.** A seleção de caso
oferece quatro modos: (1) **A Hora Emprestada**, o caso-escola artesanal, intocado;
(2) **A Hora Refeita**, a réplica procedural do caso-escola (seed fixa + variáveis
dirigidas — ver `src/gerador/pacote_gerado.js`); (3) **Um Caso da Comarca**, um caso
aleatório de um banco de **20 casos** pré-gerados em build time
(`src/data/casos_gerados.js`, regenerável por `npm run gerar:casos` e conferido byte a
byte pelo QA; o banco fica **fora do chunk de arranque** — chega por `import()`
dinâmico via `src/data/casos.js`, com o índice leve `casos_indice.js` respondendo a
camada síncrona); (4) **A Marca do Agressor**, um caso da comarca onde a luta corporal é
certa — o corpo da vítima sempre anuncia a marca-espelho, garantindo o verbo "Exigir
que mostre" (banco de **10 casos**, namespace `luta_*`, filtrado por presença de
`gen_sinal_exigivel` e validado tanto estática quanto interativamente). Nos modos
procedurais (comarca e luta), a abertura é omitida e o perito segue direto à
investigação. O gerador segue ILHA de build time: o runtime carrega pacotes prontos,
nunca importa `src/gerador`. Casos gerados jogam sem mestre (sem `vozMestre`, sem ecos
do tutorial) e, desde a OS da vila na mesa, com **maquete 3D própria** (o campo visual
`maquete` do pacote — a vila gerada inteira na tábua; sem WebGL, a grade 2D de sempre).
A prosa dos templates passou pela OS de lapidação
editorial (`docs/os-lapidacao-prosa-gerada.md`, 16/07/2026): pipeline
`revisar-prosa` sobre o corpus realizado dos 9 casos embarcados, correção sempre
na fonte (`src/gerador/pacote_gerado.js`) e regeneração no mesmo commit —
segundo passe com zero achados bloqueantes; roteiro de leitura em
`docs/playtest-leitura-prosa-gerada.md`. A frente seguinte — a **variedade** frásica
dessas superfícies — foi **entregue** pela **OS Prosa Viva** (`docs/os-prosa-viva-e0-plano.md`,
Fase 0 de telemetria + E1–E5): o **cold open da descoberta** substitui a abertura fixa dos
casos procedurais (o POV de quem achou o corpo — e, desde a **OS-R3**, o tutorial adotou o
mesmo molde, com a pensão da Sra. Potts a seguir ao cold open em vez de o substituir);
o corpo, a lesão, o rigor e o livor variam **dentro da precisão** (cada variante pelo
perito-forense); móbil, instrumento, segredo, cena e ecos sobem a **banco combinatório**; e
a **decorrelação** (`hashDecisao`) mais uma **guarda anti-monotonia** no `qa.mjs` — com a
telemetria de mesa `npm run telemetria:monotonia` — travam a regressão a molde raso. A
**variação das perguntas do perito** (§7.1), da OS Diálogos/Escala/Localização, fecha o
alcance às falas do jogador. Nenhuma etapa vira código sem ordem expressa do criador.

---

## 14. Caso do vertical slice: "A Hora Emprestada" (CONTÉM SPOILERS)

> **Em reforma (jul/2026).** O caso-escola está a ser reformado em oito OS sequenciais,
> governadas por `docs/os-r0-mestra-reforma-hora-emprestada.md` (ordem-mestra: 25 decisões
> marteladas D1–D25, 12 invariantes G1–G12, matriz de colisão e gate global). **A cadeia
> física do crime é intocável** (G1): hora 21h, buril, vermelho-de-polir, lasca de vidro,
> roda de contagem, rigor, livor, reação vital — nada disso muda em nenhuma OS.
>
> **Fechada: OS-R1** (vocabulário e postos, 25/07/2026) — `Dr. Alcott` → **`Dr. Abbot`**;
> a glosa vernácula do policial passa de `delegado` para **`guarda`** (Opção A da tabela de
> tradução da KB) e o lugar, de `delegacia` para **"O Posto do Guarda"**.
>
> **Fechada: OS-R2** (cena única, 25/07/2026) — `corpo`, `cena` e `oficina` fundiram-se na
> localidade `relojoaria` com sub-locais, e o id do posto passou a `posto_do_guarda`.
>
> **Fechada: OS-R3** (a abertura, 25/07/2026) — o jogo abre pelos olhos de quem achou o
> corpo; o coroner Bramwell Foy entra fora de cena, com o impresso e o prazo.
>
> **Fechada: OS-R4** (elenco e livros, 25/07/2026) — os **dois livros do morto**, a
> **cifra** e o **veraz sem crédito**. Quatro cartas novas (catálogo 35 → 39; **40 de 46**
> em jogo com o `ev_algor` de runtime, **6 livres** para R5 e R6), todas
> `comportamental`: a cadeia física do crime sai intacta, byte a byte (G1, com guarda
> própria no `qa.mjs`). Um nó novo — **A Torre de S. Miguel** —, e uma pessoa nova, o
> sineiro **Amos Kell**.
>
> **Fechada: OS-R5** (móbeis e cartas, 25/07/2026) — todo suspeito passa a ter carta de
> móbil. Duas cartas novas (catálogo 39 → 41; **42 de 46** em jogo com o `ev_algor`,
> **4 livres** para a R6), ambas `comportamental`/`motivo`: o **bilhete do vigário** que
> marca os proclamas do morto com a Sra. Rooke para o domingo seguinte à morte, e o
> **livro de pagamentos** em que o salário do aprendiz é descontado por inteiro contra
> uma dívida da mãe que não anda. A **agiotagem da vítima** (D1) entra pela aritmética
> desse livro, sem uma palavra sobre juros. O **tell de contagem** morreu por medição, não
> por gasto: a paridade lê-se por **motivos distintos** e não por cartas, e por essa
> métrica o réu (1) nunca foi o máximo — é Walter (2).
>
> **Próxima: OS-R6** — exposição e interrogatórios, com as 4 cartas que a R5 deixou.

**Cenário:** Briarstone, outubro de 1893. Vítima: **Sr. Geoffrey Arthurs**, relojoeiro,
61 anos, morto no escritório dos fundos por **ferida de buril no pescoço**. Cena
encenada como roubo de madrugada; relógio de lareira esmagado, parado às **08h45**.

**Calendário:** a morte ocorre às **21h de sexta-feira, 13/out/1893** (hora absoluta
−3); o corpo é achado na manhã de **sábado, 14/out**, às 09h20, por Silas Crane; o
perito chega às **13h00** (hora absoluta 13; IPM na chegada = 16h). Corpo a ~21°C,
sala a 11°C.

**Escala e cenário (fato canônico):** Briarstone é vila nucleada de **~500 almas
(~95 fogos)**, com **estação de borda** — a plataforma a 0,5–1,5 milha do núcleo, à
moda da §6 de `docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md`; o perito chega pelo
primeiro trem. A relojoaria de Arthurs vive da **redondeza, não da vila**: consertos
chegam e partem pelo *carrier* semanal — o carreteiro que faz o circuito à *market
town* —, o que sustenta três postos de bancada onde a vila sozinha não sustentaria um.
A polícia é um **posto** da *county constabulary* — casa do policial, expediente e a
cela — sob o *constable* Lemuel Wycliffe ("guarda", na boca da vila). A loja da Sra.
Rooke **acumula o correio**. O inquérito formal, quando vier, instala-se na sala da
estalagem (`docs/kb-medicina-legal/inquerito-e-policia.md` §1).

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
  do Apressado**: testamento + dívidas + gritos ouvidos da rua + "tomei o carro
  das seis" desmentido pelo registro da estalagem. Mente por vergonha: implorou
  dinheiro às 18h45, foi recusado e pernoitou na vila (segredo `suplica_recusada`;
  o descarte físico está na mesma página — quarto às 19h40, água quente às 21h).
- **Sra. Agnes Rooke** (58, viúva, loja e correio, postmistress da vila; noiva secreta da vítima) — a **isca
  secundária**: a última a vê-lo (ceia 20h05–20h45; a senhora na viela). Mente por
  decoro ("em casa desde as seis"); a cesta de ceia e o aro de ouro por gravar
  revelam o `noivado_secreto`. A morte a arruína — nada herda.
- **Caleb Grey** (46, moleiro) — **ruído que é pista dupla**: a queixa do relógio
  "mais leve" é o rancor mais barulhento do caso e, lida de perto, o registro da
  fraude de Silas. Álibi corroborado (moinho, véspera de feira, três homens).
- **Davey Tull** (15, aprendiz) — mente ensaiado pelo oficial ("saímos juntos às sete
  e meia"), por medo. Expô-lo é bônus, não pilar (`inocente_alibi`).
- **Guarda Lemuel Wycliffe** (de ofício, *constable* da *county constabulary* no
  posto de um homem de Briarstone — a patente que a KB dá ao policial de vila,
  `demografia-e-sociedade.md` §3; a tabela de tradução de `inquerito-e-policia.md` §5
  recomenda, na decisão B, **manter o posto inglês** grifado — o caso-escola adota a
  **Opção A** da mesma tabela, e **"guarda"** é a glosa vernácula que a vila põe por
  cima, enquanto o caso gerado diz *constable*; D11, OS-R1, 25/07/2026) — fonte, não
  suspeito. Briefing planta a história A
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
Desde a OS Prancha da Vila o 3D **não é mais o padrão do hub**: o chunk só desce se o
jogador pedir "A maquete" — a sessão que fica na prancha nunca baixa three.
O **banco de casos gerados** também é chunk lazy (diagnóstico 21/07, Lote 5): o arranque
carrega só o índice leve (`casos_indice.js`); os pacotes chegam por `import()` na
primeira vez que um caso gerado é pedido (arranque de 1.818 → 403 KB).

**QA dos embarcados (revisão 24/07):** o `qa.mjs` joga os 4 perfis de jogador em **todos
os 31 casos embarcados** (antes só o primeiro de cada pool), com a coreografia única de
`scripts/lib/perfis.mjs` (compartilhada com o `gerar-casos.mjs`, que agora valida
interativamente também o pool da comarca). Nota registrada: o filtro de seleção antigo
rejeitava sementes de luta jogáveis por um bug da própria coreografia (o nexo ligava o
primeiro vestígio do réu, não o instrumental); com o filtro corrigido, a **próxima**
regeneração (`npm run gerar:casos`) trocará 5 dos 10 casos de luta — o banco commitado
segue o antigo até o autor decidir regenerar.

**Estrutura de pastas:**
```
docs/           guia-de-estilo · biblia-de-vozes · sistema-visual · kb-medicina-legal/ ·
                nota-gabinete-ilustrado · historico-decisoes
.claude/        agents/ (escritor-prosa, editor-critico, perito-forense, fiscal-continuidade)
                skills/ (anti-padrao-ia, redigir-prosa, revisar-prosa)
src/
  assets/       fontes/ (5 faces OFL em woff2: IM Fell English, Libre Caslon Text,
                Bevan, Oswald, Rye) · sons/ (5 WAV sintetizados offline)
  data/         seed.js · catalogo_causas.js · cartas.js · localidades.js · mapa.js ·
                curriculo.js · glossario.js · rotulos.js · abertura.js ·
                aparencias.js (genótipo curado) · mapa_espacial.js (diorama) ·
                hotspots_corpo.js (exame 3D) — os três últimos: camada VISUAL ·
                procedencia.js (o `apontadaPor` da D17: quem pôs a alegação em
                circulação — camada NARRATIVA, fora de tagsOcultas de propósito)
  logic/        veredicto.js (calcularVeredictoCadeia) · acusacao.js (gramática das
                ligações) · tempo_morte.js · cronos.js · falaDoMestre.js (dica) ·
                monologo.js · epilogo.js · tempo.js · interpolar.js ·
                hash.js (fonte única de sorteio) · aparencia.js · webgl.js (sonda) ·
                prancha_vila.js (projeção da gravura, a hora em tinta, o arranjo das
                etiquetas) · beat_viagem.js (a duração do beat, um dono só) ·
                preco_da_viagem.js · desbloqueio.js — os quatro últimos: camada VISUAL ·
                exposicao.js (E0/E1/E2, função pura das cartas na mesa) ·
                contaminacao.js (papéis somam-se, bocas é que corroboram) — os dois
                últimos: camada NARRATIVA, e o motor é cego a eles (GR6-6)
  store/        jogo.js (Zustand: fases, relógio, mapa, cartasRegistradas, conclusoes,
                acusacao, log, detective, nosVisitados, nSubmissoes, somAtivo)
  som.js        efeitos sonoros da mesa (apresentação; nenhuma regra lê)
  components/   Escrivaninha · MesaLocalidades2D (grade/fallback) · EventoLocalidade
                (apoios em localidade/: FalaDoLegista · NotaFrescor · BotaoTelegrafo ·
                GestoPericial) · MuralAcusacao (orquestrador; estações em mural/:
                EstacaoCorpo · Estacoes · MesaLigacao · SeletorJanela · RevisaoFinal ·
                comuns) · MonologoFinal · PainelAlibis · ModalGlossario ·
                Caderneta · TelaPersonagem · TermometroCorpo · Abertura · Overlay ·
                CartaMesa · RelogioBolso · RetratoPersonagem · Cena3DBoundary ·
                prancha/ (PranchaVila · ReguaNos · estreito — a vila em gravura, a
                vista PADRÃO; a régua de fichas serve o celular) ·
                diorama/ (DioramaVila · Predio · RotuloNo · DesobstruirRotulos ·
                LuzDoDia · apoio) ·
                corpo3d/ (PranchaCorpo — a prancha de atlas em SVG; o cadáver 3D
                foi aposentado pelo pivô Gabinete Ilustrado e os arquivos removidos)
scripts/        qa.mjs · qa-ui.mjs · gerar-casos.mjs · lint-prosa.mjs · demos/auditorias ·
                lib/ (perfis.mjs — os 4 perfis, fonte única · marcadores.mjs ·
                fatia.mjs — núcleo de solvência · familias.mjs · monotonia.mjs)
```

**Convenções:**
- Estado central: `faseJogo`, `detective`, `horasJogo`,
  `localidadeAtual`, `nosDesbloqueados`, `cartasRegistradas`, `conclusoes`, `acusacao`,
  `log`, `temperaturaMedida`. (A hora de chegada vive no pacote —
  `parametrosCena.horasChegada`.)
- `conclusoes` guarda **só** a leitura do legista (`origem: 'mestre'`), exibida como
  dica — não vincula o veredicto.
- Determinismo: `Math.random()`/`Date.now()` proibidos em `src/logic|data|store|gerador`
  (guarda no `qa.mjs` — que também pega as variantes `new Date()` sem argumento,
  `Math["random"]`, `performance.now` e `crypto` aleatório); variação vem de
  `hashString` (`src/logic/hash.js`) salgado. As guardas de cegueira do motor valem
  para o fecho transitivo de imports de `veredicto.js`/`acusacao.js`.
  O three.js usa `Math.random` em internos (uuid) — apresentação, exceção registrada.
- Gate de commit: **`npm run verificar`** — a bateria inteira, na ordem (build + `qa.mjs`,
  que inclui a auditoria de determinismo, + `lint:prosa` + `qa-ui.mjs`).
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
- **A vítima age: resistir × fugir × gritar** (OS confronto estendido, 17/jul/2026).
  Por rodada, fora da surpresa da rodada 1 premeditada, dois portões **pesam, nunca
  determinam** a ação: o **físico** (`seguraAVitima` zera fuga/grito enquanto o
  método prende — garrote, esganadura, sufocação, afogamento; `mobilidadeResidual`
  decai a fuga conforme o ferimento) e o **psíquico** (`sobAtaque` por vetor +
  polaridade, produto da camada psíquica — ativa pende a resistir, passiva a
  fugir/gritar). **Resistir** é o comportamento vigente (ferimento defensivo, chance
  de ferir o assassino); **fugir** é deslocamento dirigido à porta externa — alcançá-la
  é **rejeição** `vitima_escapou` (a vítima nunca escapa de fato; a batalha reamostra,
  ao lado de `assassino_ferido`/`vitima_resistiu`); **gritar** é evento com hora
  própria, audível aos ouvintes adjacentes. A desordem deposita `trilha_gotejamento`,
  `esfregaco_de_limiar` e lesões de sítio posterior contra o orçamento de limpeza
  (WIS) que **não cresce com a bagunça** — dois cômodos sujos sempre deixam vestígio
  de 1ª ou 2ª ordem. Fair play: a fuga também ocorre no premeditado (a surpresa só
  consome a rodada 1), então cena espalhada nunca equivale a briga escalada — o
  veredicto segue material (R1–R6 intactas). Métodos novos no catálogo: **sufocação**
  (piso garantido, de interior), **afogamento** (restrito à cena da forja, pela
  célula `cocho_dagua` já existente) e **láudano em dose excessiva**
  (`envenenamento_laudano` + `miose_opiacea`, extensão autorizada do catálogo
  universal); precipitação e espingarda ficam só na KB (sem âncora espacial/fora de
  escopo). Réplica: `dirigido.fugaVitima` = `'suprimida'` mantém o registro do
  caso-escola idêntico em fatos. Norma completa em `docs/os-confronto-estendido.md`
  e `docs/game-design-simulacao.md` §2.4.
- **Encenação e supressão reconciliadas ao motor** (17/jul/2026, Lotes 1 e 3 da
  pesquisa de encenação/supressão). A peça de hora forjada (`cartaHoraForjada`) ganha,
  além do mostrador da lareira, duas variantes **térmicas**: corpo aquecido junto ao
  fogo (finge morte recente) ou resfriado na corrente (finge morte antiga) — mesmas
  tags (`cronologia_aparente`, `encenado`, `isca`), refutadas pelos mesmos relógios
  duráveis do corpo (rigor, livor); monólogo e epílogo ramificam pela peça e pelo
  sentido via `encenacaoInstrumento` no pacote gerado (o caso-escola permanece
  byte-idêntico: campo ausente → `'relogio'`). Seis verbetes novos de glossário
  (reação de Van Deen, cristais de Teichmann, microespectroscopia de Sorby,
  micrometria de Gulliver, epitélio no coágulo, discórdia tanatológica) e a carta
  condicional `gen_frestas` (sangue empurrado para a fresta do assoalho pela limpeza —
  ambiental, sem `pertenceA`, o motor não a lê como nexo) dão vocabulário à supressão
  sem tocar o motor de dedução. `instrumento_guardado_umido` corrigido: o sinal
  durável é o coágulo sob a virola e os rebites (Teichmann acha décadas depois), não a
  umidade da junta (sinal perecível, era o erro). Decisão adiada: o sinal de ausência
  do eixo CAUSA (Lote 2) — registrado em `docs/historico-decisoes.md`, não executado.
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
- **OS Vila Viva (E1–E4): a pesquisa espacial chega ao jogador.** Quatro etapas
  fecham a "última milha" entre o mundo que o gerador computa e o que o jogador vê,
  toda camada narrativa/visual (o motor segue lendo só `tagsOcultas` + seed):
  **E1** — a planta projetada do grid é desenhada na cena procedural (§5.1). **E2** —
  a prosa das localidades bebe da vila gerada: a `vizinhanca` nomeia o vizinho
  parede-meia (o mesmo elenco que o motor conta como ouvinte/álibi) e situa a cena no
  quarteirão; e a terminologia legal-policial de 1893 substitui "delegado/delegacia"
  por **constable** (glosado) e **"O Posto do Constable"**, com as petty sessions como
  etapa dos magistrados (validado contra a KB legal-policial). **E3** — a mobília lê a
  classe da vítima na sua casa (uma frase de leitura social por seed, observação pura,
  ancorada em `classeSocial` + móbil de herança; catálogo de
  `kb-mundo-vitoriano/mobiliario-por-classe.md`). **E4** — a vila nasce em três
  morfologias por seed (**nucleada**, **linear**, **de green**, de
  `kb-mundo-vitoriano/urbanismo-e-morfologia.md` §1): só as coordenadas de `cidade.js`
  mudam — tipo, quarteirão e ancoragem de logradouro são invariantes, então o grafo de
  avistamentos (ouvintes, álibis, distâncias) deriva da forma sem regra nova de motor.
  Prova de balanço por Monte Carlo (`relatorio-espacial.mjs`): as bandas moeda-dirigidas
  (regime-palco, magnitude, método por palco, satélite) ficam idênticas ao relatório v1
  nas três morfologias; `qa.mjs` verde mantém os 4 perfis → 4 desfechos e as guardas de
  fair play. Toda prosa nova passou pelo pipeline `revisar-prosa` (zero bloqueantes).
  **E5** (entregue): a `travessa_dos_fundos` ativa como 4º logradouro — o "segundo
  grafo" de becos, com **adjacência curada** (só o pub e a cottage dos fundos) para não
  saturar o grafo de avistamentos; guarda GE5 calibrada pelo autor.
- **OS da vila na mesa (E6 + interrogatório à porta): a vila gerada vira lugar.**
  Três entregas, toda camada narrativa/visual (motor cego; guardas no `qa.mjs`):
  (1) **a maquete 3D do caso gerado** — o pacote ganha o campo visual `maquete`
  (derivado de `cidade.diorama`: posições dos nós, formas, casario de cenário, tábua sob
  medida, estrada da comarca), consumido por `DioramaVila`/`Escrivaninha` com o fallback
  2D intacto; era a etapa E6 do plano Vila Viva ("o diorama procedural é órfão").
  (2) **o fim da "Vizinhança" abstrata** — o nó de testemunhos difusos (id `vizinhanca`
  preservado: encanamento de cartas/interferência/QA) apresenta-se como o **prédio de
  encontro** da vila (a taverna; mercearia/forja quando a taverna é a própria cena),
  onde o ruído, as corroborações e o recado do engodo são ouvidos.
  (3) **interrogatório à porta das casas** — cada suspeito é ouvido na própria moradia
  (nós `casa_<predio>`; quem partilha teto partilha nó; morador do prédio de encontro
  responde no serviço; morador do posto, no posto), com o constable um passo atrás — o
  procedimento plausível de 1893 (KB legal-policial: o inquérito de vila anda de porta
  em porta); o Posto do Constable fica só com os papéis do caso e o telégrafo, e as
  cartas de álibi nascem no nó da conversa. Molduras de fala, saídas e fechos de termo
  reescritos para o palco de porta; pipeline `revisar-prosa` completo (editor-crítico +
  perito-forense + fiscal-continuidade) com os bloqueantes corrigidos e re-verificados.

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
