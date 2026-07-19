# OS — S2: Decisões de fair play (caso-escola + gerador)

**Data:** 19/07/2026
**Branch:** `claude/s2-documento-orquestracao-tyi946`
**Tipo:** OS de **decisões**, não de código. Nenhuma linha de `src/` muda nesta sessão.
**Insumos normativos:** `docs/kb-craft-narrativo/cliches-e-fair-play.md` (seções citadas item a
item), os três relatórios de 19/07 (`docs/playtest/2026-07-19-conclusoes-humanas.md`,
`…-procedural.md`, `…-procedural-r2.md`), `MORTEM_CONTEXTO.md`.
**Método:** cada ponto de código citado abaixo foi verificado contra o repositório vivo na
data (arquivos e símbolos nomeados existem — `ev_vidro_dobra`, `III · As Mentiras`,
`gen_movel_`/móbil-isca, `PROSA_MOTIVO`, `ponte_caso.js`, `aparencias.js`,
`PlantaRelojoaria.jsx`). Nada é citação de memória.

---

## 0. O que esta OS é (e o que não é)

A S2 resolve, **de uma vez**, o quanto o jogo entrega a resposta — no caso-escola e no
gerador. É a sessão que os playtests de 19/07 pediram: as rodadas 1–2 do procedural
mostraram que o jogo estava fácil porque **entregava conclusões** (legista, rótulos,
mentira pré-marcada, âncora única). Fechados os canais óbvios (Lote A), o que sobrou é
**decisão de design de fair play** — e decisão é do usuário.

**Regra de ouro desta sessão (do KB, linha 8–10):** *o jogador tem a mesma chance que o
detetive*; um caso que viola fair play é **injogável**. Toda opção abaixo é medida contra
isso: nem entregar a resposta (atalho), nem esconder a pista (injogável). O ponto-cego a
evitar tem nome no KB — a **âncora única** (uma só prova que grita o culpado) é o defeito
P9, e ele reaparece disfarçado em quase todos os itens.

**O que esta OS NÃO faz:** não decide por você; não escreve prosa; não toca motor. O
agente **apresenta 2–3 opções por item, cruzadas com o KB**, aponta custo e consequência,
e para. Você decide; a decisão é registrada; a implementação vira lote de outra sessão.

---

## 1. Como a sessão roda (protocolo passo a passo)

1. **Abrir os insumos** (o KB de fair play e os três relatórios de 19/07 abertos lado a
   lado). Este documento é o roteiro.
2. **Percorrer os itens na ordem dos blocos A → B → C → D** (justificada em §2). Para cada
   item, o agente lê em voz alta: **o defeito → o que o KB diz → as opções**. Você decide.
3. **Registrar cada decisão** em `docs/historico-decisoes.md` (uma entrada por bloco,
   datada, no formato do arquivo — ver §7), **mesmo que a decisão seja "manter como
   está"**. Decisão não registrada não aconteceu.
4. **Carimbar o lote de execução** de cada decisão que virar mudança: qual sessão a faz
   (S1 diálogo, S3 prosa, S5 palco, ou "lote próprio"). Nada se implementa na S2.
5. **Fechar** atualizando `plano-de-sessoes.md` **no mesmo commit** (marcar S2 concluída,
   registrar em uma linha, reordenar o que restou se a decisão mudar a rota).

**Definição de pronto da sessão inteira:** os 9 itens da pauta com decisão registrada em
`historico-decisoes.md`; cada mudança com sessão de execução carimbada; `plano-de-sessoes.md`
atualizado. `qa.mjs`/`qa-ui.mjs` **não** precisam rodar (nenhum código mudou) — mas o
commit de fechamento é só de docs, então basta `git status` limpo fora de `docs/`.

---

## 2. Mapa dos itens → bloco → gate

| Bloco | Itens | Natureza | Executa em |
|---|---|---|---|
| **A — Fair play do caso-escola** | 12 (vidro de Silas), 14/P8 (mentira rotulada), 16 (móbil por suspeito) | Peso de prova / rótulo do mural | Lote próprio ou S3 |
| **B — Fair play de autoria do gerador** | P9 (âncora única), P16+P17 (compleição física), P24 (fôrma das mentiras) | Solubilidade do procedural | Lote do gerador (pós-S2) |
| **C — Fair play do diálogo** *(decide aqui, executa na S1)* | 11/P21–P22 (exposição contida, paradeiro, confronto com ganho), P23 (deflexão plausível) | Encenação da fala | **S1 (OS de diálogo)** |
| **D — Triagem espacial/elenco** | 8 (planta única), 9 (suspeitos saem de cena) — e o QOL 10 (transcrição) | Só triar: fazer ou adiar | S4/S5 ou backlog |

**Por que esta ordem:** A e B são design puro e independente — decidem primeiro. C alimenta
diretamente a próxima sessão (S1) e depende de A16/B para não se contradizer (o móbil falado
no confronto herda a decisão do item 16; a deflexão de P23 herda a de P9). D é só triagem
(fazer/adiar), toca dados espaciais/3D e não deve prometer escopo — fica por último.

---

## 3. BLOCO A — Fair play do caso-escola

### Item 12 — O vidro na dobra da calça de Silas dá a pista máxima

- **Defeito (playtest humano, item 12):** a lasca de vidro na bainha de Silas entrega a
  pista máxima de uma vez. **Estado já resolvido em parte:** em 18/07 a carta
  `ev_vidro_dobra` (`src/data/dialogos.js`, refletida em `cartas.js`/`confrontos.js`) foi
  **democratizada** — sai nos quatro tons do beat, tom é cor e nunca chave
  (`historico-decisoes.md`, 18/jul). **O que sobra para a S2 é outro eixo:** não *se* a
  pista aparece, mas *quanto ela entrega sozinha* (peso de prova).
- **O que o KB diz:** §6 "plantio honesto" — enganar pela **ênfase**, nunca pela omissão;
  a pista pode existir e ainda exigir uma segunda ligação. §4 "red herring / prova sob
  medida": a boa prova é uma leitura que **ainda pede trabalho**, não um veredicto embalado.
- **Opções:**
  - **A) Rebaixar a pista** — o vidro vira **indício que exige segunda ligação** (só fecha
    cruzado com outra carta; sozinho, aponta sem cravar). Custo: revisar a cadeia de
    sustentação do caso-escola e o `qa.mjs` (a guarda de solubilidade lê a árvore).
  - **B) Espalhar o peso** — manter o vidro, mas distribuir a força entre 2–3 provas, de
    modo que nenhuma isolada baste. Custo: prosa nova nas provas irmãs (S3).
  - **C) Manter e aceitar o atalho** — é o caso-**escola**; ensinar com uma pista forte
    pode ser intencional. Custo: zero; registra-se a escolha consciente.
- **Leitura do agente (não decide):** o caso-escola é tutorial — um atalho didático é
  defensável (C); mas se ele ensina o hábito de "uma prova basta", contamina a leitura do
  jogador nos gerados, onde P9 é exatamente esse pecado. A) e C) são coerentes entre si
  conforme a resposta de P9 (Bloco B).
- **[DECISÃO]** Rebaixar (A), espalhar (B) ou manter (C)?
- **Executa em:** A/B → lote próprio + S3 (prosa); C → nada.
- **Guarda tocada:** `qa.mjs` (sustentação/solubilidade) se A ou B.

### Item 14 / P8 — Cartas de "mentira" já rotuladas como mentira

- **Defeito (item 14 + P8, nos dois modos):** cartas como "A Noite de Florence Cooper" /
  "A Noite de Amy…" chegam ao mural já **rotuladas como mentira** — entregam a provável
  ré. **Ponto de código:** a estação `III · As Mentiras — depoimentos desmentidos`
  (`MuralAcusacao.jsx`) já é onde o jogador LIGA um fato físico ao depoimento que ele
  desmente; o problema é o rótulo da carta-fonte pré-anunciar que ali há mentira.
- **O que o KB diz:** §7 (tropos de mentira inocente) — "a mentira detectada prova apenas
  que existe um segredo; descobrir QUAL é o trabalho". Rotular a carta como mentira **faz o
  trabalho pelo jogador** e mata a lição central do jogo ("nem todo mentiroso é culpado").
  Implicações §7, regra de design: cada caso tem ≥2 mentirosos inocentes desmascaráveis.
- **Opções:**
  - **A) Tirar o rótulo** — o jogador é quem liga o fato que desmente; a carta é depoimento
    neutro até ele provar a mentira. **É a mais fiel ao KB.** Custo: revisar rótulos e o
    contrato do `qa-ui` (o texto `III · As Mentiras` e os rótulos de estação são clicados
    pelo QA — atualizar no mesmo commit se mudarem).
  - **B) Rótulo neutro** — "depoimento" / "declaração de paradeiro" no lugar de "mentira";
    a natureza (verdade ou mentira) só emerge da ligação. Custo médio.
  - **C) Manter** — aceitar que o mural pré-classifica. Custo: zero, mas conflita com §7.
- **Leitura do agente:** A e B são quase o mesmo gesto (remover a pré-classificação); a
  diferença é se a carta perde qualquer rótulo (A) ou ganha um rótulo neutro (B). C é
  difícil de defender contra o KB. **Decide junto com o item 16** (ambos mexem no mural).
- **[DECISÃO]** Sem rótulo (A), rótulo neutro (B) ou manter (C)? Vale para os **dois modos**
  (o mesmo defeito é P8 no procedural).
- **Executa em:** lote próprio (UI/prosa) + atualização do contrato `qa-ui` no mesmo commit.
- **Guarda tocada:** `qa-ui.mjs` (rótulos de estação/`.termo-*` são contrato intocável).

### Item 16 — Móbil ligado ao réu selecionado; um móbil por suspeito

- **Defeito (item 16):** no caso-escola, o móbil está amarrado ao réu selecionado. Pergunta
  de arquitetura: **móbil por suspeito** (cada um com o seu, como o gerador já faz) ou
  **móbil único**? **Ponto de código:** o gerador **já** distribui móbil-por-suspeito com
  isca — `gen_movel_*` e o **móbil-isca** existem (`pacote_gerado.js`: "o móbil-isca do
  primeiro segredo… o papel que faz o mentiroso parecer" culpado). O caso-escola está
  atrás do gerador aqui.
- **O que o KB diz:** §4 "herança e testamento" / red herring — o motivo que sinaliza o
  culpado "por aritmética" é o clichê a evitar; a cura é **todo suspeito ter móbil
  plausível**, o real escondido entre iscas honestas. §7: cada mentiroso inocente tem
  segredo real descobrível — móbil é matéria-prima desse segredo.
- **Opções:**
  - **A) Móbil por suspeito** (paridade com o gerador) — cada suspeito carrega um móbil;
    o do réu não se destaca por ser o único. **Alinha caso-escola ao procedural.** Custo:
    prosa de móbil para os suspeitos que hoje não têm (S3) + revisar a Estação IV do mural.
  - **B) Móbil único** — manter a economia atual do caso-escola. Custo: zero, mas mantém a
    aritmética-que-entrega e diverge do gerador.
- **Leitura do agente:** A é o caminho de coerência (o jogador aprende no caso-escola a
  mesma gramática que o gerador usa). **Cruza com P19** (o móbil pode ser falado no
  confronto — Bloco C) e com o item 14 (a Estação IV do mural já mostra móbil via
  `Opcao.sub`).
- **[DECISÃO]** Móbil por suspeito (A) ou único (B)? Se A, quantos suspeitos ganham móbil
  novo e a isca fica explícita?
- **Executa em:** S3 (prosa dos móbeis) + lote de mural.
- **Guarda tocada:** `qa-ui.mjs` (Estação IV / rótulo de móbil).

---

## 4. BLOCO B — Fair play de autoria do gerador

> Os três itens deste bloco são a **mesma família**: o gerador não pode deixar **uma só
> coisa** apontar o culpado. É o defeito P9, e P16+P17 e P24 são reincidências dele.

### P9 — Âncora única de autoria (a poeira da arma sozinha liga a ré)

- **Defeito (P9):** a ré foi ligada pelo **formato da marca de poeira da arma ausente** —
  uma única âncora. E se outra pessoa tivesse levado a arma para incriminá-la? **Ponto de
  código:** o vestígio nasce no autobattler (`crime.js`/`vestigios.js`) e chega pela
  `ponte_caso.js`; hoje a marca resolve a autoria sozinha.
- **O que o KB diz:** §6 "solução dupla" (Berkeley) — todo caso deve suportar UMA falsa
  solução coerente e conter, visível, o fato que a refuta; a acusação errada tem de ser
  **racional, não burra**. §4 "pegadas/bilhetes convenientes": prova sob medida cheira a
  mão do autor; a cura é ou ambiguidade ou plantio detectável.
- **Opções:**
  - **A) Âncora dupla obrigatória** — todo caso exige **segunda ligação independente** por
    autoria (a marca + um segundo vestígio que só o culpado deixa). Custo: mudar a regra de
    existência no gerador; re-gerar os 21 casos; `qa.mjs` acompanha no mesmo commit.
  - **B) Contra-hipótese jogável** — a âncora fica única, mas o mundo admite "outra pessoa
    pode ter levado a arma" como tese **sustentável e refutável** (há quem tivesse acesso;
    há o fato que derruba a moldura). Custo: modelar acesso à arma + prosa da contra-tese.
  - **C) Híbrido** — âncora dupla nos casos onde a magnitude permite; contra-hipótese nos
    demais. Custo: o maior (duas vias no gerador).
- **Leitura do agente:** A é a garantia mais forte de solubilidade honesta e a mais cara; B
  é mais barata e mais "Golden Age" (a falsa solução coerente é o coração do Erro
  Judiciário, um pilar do jogo). **Esta decisão governa o item 12 e P16+P17** — se você
  escolher "nunca uma prova basta" aqui, o item 12 tende a A/B e P16+P17 herda o critério.
- **[DECISÃO]** Âncora dupla (A), contra-hipótese jogável (B) ou híbrido (C)?
- **Executa em:** lote do gerador (pós-S2), com re-geração dos 21 casos + `qa.mjs`.
- **Guarda tocada:** `qa.mjs` (guarda de solubilidade / âncora durável — inviolável).

### P16 + P17 — Canal de compleição física (vítima × força × pegadas)

- **Defeito (P16+P17):** faltam características físicas da vítima (alta? corpulenta?) e
  descrição das pegadas (tamanho, feitio) — sem isso não há dedução de força. **É um canal
  novo de dedução**, não um remendo. **Ponto de código:** o dado **FOR** já existe no
  gerador em build time (`docs/game-design-simulacao.md`); a camada narrativa é
  `aparencias.js` — que **JAMAIS** entra em `tagsOcultas` nem é lida por
  `veredicto.js`/`acusacao.js` (guarda de QA). O motor **permanece cego**.
- **O que o KB diz:** §6 "plantio honesto" + a regra dura de fair play: um canal só é justo
  se **discrimina sem entregar**. Se só um suspeito é corpulento, o canal vira P9 de novo
  (âncora única) — o próprio playtest crava isso (nota de triagem P16+P17).
- **Desenho do canal inteiro (decidir antes de realizar):**
  - (a) a vítima ganha descrição física (altura/compleição — do FOR, build time);
  - (b) a força exigida pelo método/lesão vira **observação do exame** (não conclusão);
  - (c) as pegadas ganham tamanho/feitio.
- **Regra de fair play (a decisão central):** o canal **só entra se ≥2 suspeitos
  partilharem a compleição compatível** — senão é entrega.
- **Opções:**
  - **A) Ativar sob guarda ≥2** — implementar o canal só quando o elenco tem ≥2 compatíveis;
    nos casos sem isso, o canal não aparece. Custo: guarda no gerador + `qa.mjs` conta os
    compatíveis.
  - **B) Sempre ativar, garantindo ≥2 na geração** — o gerador **força** ≥2 compatíveis ao
    montar o elenco, para o canal existir sempre. Custo: mexe na amostragem do elenco.
  - **C) Adiar** — não abrir o canal agora (fica no backlog do gerador).
- **Leitura do agente:** A é incremental e seguro (o canal aparece quando é justo); B é mais
  ambicioso (canal sempre presente, ao custo de constranger o elenco). Herda o critério de
  P9: se P9 for "âncora dupla", este canal é uma das segundas âncoras naturais.
- **[DECISÃO]** Ativar sob guarda ≥2 (A), forçar ≥2 na geração (B) ou adiar (C)? E o canal
  entra completo (a+b+c) ou por partes?
- **Executa em:** lote do gerador + S3 (prosa do exame/pegadas) + S4 se a pegada virar arte.
- **Guarda tocada:** `qa.mjs` (guarda de compleição×elenco + cegueira de `aparencias.js`).

### P24 — Variar a fôrma das mentiras

- **Defeito (P24):** "mentiu por vergonha, não por crime" tem **assinatura única
  reconhecível** — o jogador experiente lê a **fôrma**, não o caso (o padrão de Sarah Ward:
  paradeiro falso por causa do trato). **Ponto de código:** `PROSA_MOTIVO` e as frases de
  confronto (`dialogos_gerados.js`) hoje repetem a mesma cadência de mentira inocente.
- **O que o KB diz:** §7 lista as fôrmas canônicas de mentira inocente — **caso amoroso**,
  **dívida/ruína**, **pequeno furto**, **proteger terceiro**, **vergonha social**, **medo
  da polícia**, **fraude paralela**. O jogo hoje usa poucas; o KB dá o cardápio para variar.
- **Opções:**
  - **A) 2–3 fôrmas alternativas** — escolher e implementar 2–3 fôrmas do §7 além da atual,
    sorteadas por `hashString` salgado. Custo: prosa nova por fôrma (S3) + slot no gerador.
  - **B) Cardápio amplo** — mapear as 7 fôrmas do §7 e distribuí-las por demografia/segredo.
    Custo: o maior (7 famílias de prosa).
  - **C) Manter** — aceitar a assinatura única por ora. Custo: zero, conflita com §7.
- **Sub-decisão de fair play:** **o assassino pode usar fôrma igual à de um inocente?** Se
  sim, a fôrma deixa de ser sinal de culpa (bom para o KB); se não, a fôrma vira pista — o
  que é exatamente o defeito P24. **Recomendação implícita do KB: sim, pode** (a mentira
  aponta segredo, não crime).
- **[DECISÃO]** Quantas fôrmas (A 2–3 / B ampla / C manter)? E o assassino pode partilhar
  fôrma com inocente (sim/não)?
- **Executa em:** lote do gerador + S3 (prosa das fôrmas).
- **Guarda tocada:** `qa.mjs` (determinismo do sorteio de fôrma via `hashString` salgado).

---

## 5. BLOCO C — Fair play do diálogo *(decide aqui, executa na S1)*

> Estes itens **decidem-se agora** e **implementam-se na S1** (OS de diálogo). A S2 fixa o
> critério para a S1 não reabrir a discussão.

### Item 11 / P21–P22 — Exposição contida, paradeiro perguntado, confronto com ganho

- **Defeito (três em um):**
  - **P21** — o assassino declara paradeiro que **ninguém perguntou** (confissão
    espontânea): entrega a mentira.
  - **P22** — ao confrontar com o já respondido, a fala **não vai além** do que já se sabia
    (confronto raso).
  - **Item 11** — a exposição deve caber **no próprio diálogo** (ex.: "hábito da corda"),
    não em carta/legenda.
- **O que o KB diz:** Van Dine nº 5 (§2) e o catálogo §4 "a confissão que encerra" —
  dedução não pode virar teatro em que o culpado resolve o caso; **a confissão espontânea é
  proibida**. §7: a mentira do assassino deve viver **dentro do mesmo beat** dos inocentes
  (todos mentem sobre algo).
- **Critério a fixar (não é opção — é regra de design a validar):**
  - **Beat de paradeiro universal (P21):** todo interrogado declara paradeiro **quando
    perguntado**, nunca espontaneamente. O assassino mente **dentro do mesmo beat** dos
    demais.
  - **Confronto com ganho (P22):** apresentar prova puxa **fala nova** (admissão parcial,
    detalhe, contradição) — nunca só repetição. Cada confronto ganha uma "segunda camada".
  - **Exposição contida (item 11):** o que sai da boca vira **fala exibida**; se houver
    carta, o negrito clicável carrega a **informação** ("se recolheu às oito"), não o título
    opaco ("A Noite de X") — é P6, e o ponto de código é o `textoDisplay` da carta de álibi
    em `dialogos_gerados.js`.
- **[DECISÃO]** Confirmar os três critérios como regra da S1? Alguma exceção (ex.: um beat
  em que o paradeiro pode ser espontâneo sem entregar)? A "segunda camada" do confronto é
  obrigatória em **todos** os confrontos ou só nos do réu?
- **Executa em:** **S1** (OS de diálogo) — mapear os confrontos em `dialogos_gerados.js` e
  dar a cada um a segunda camada; `textoDisplay` informativo no negrito.
- **Guarda tocada (na S1):** `qa-ui.mjs` (`.opcao-dialogo`, `[data-no-dialogo]`, tons).

### P23 — Deflexões plausíveis ("veio de fora")

- **Defeito (P23):** o pároco dizer "quem fez isto veio de fora" **entrega** — não há
  forasteiro entre os suspeitos, então só ele lucra com a tese. Sarah Ward tem o mesmo
  problema. **Ponto de código:** falas de deflexão em `dialogos_gerados.js`.
- **O que o KB diz:** §5 "o estrangeiro suspeito" — sotaque/etnia/origem **nunca** são
  indício; a xenofobia da vila gera **falso testemunho retratável, nunca validado**. A
  deflexão "veio de fora" só é honesta se a tese for **sustentável no elenco**.
- **Critério a fixar:** a fala de desvio só existe se a tese for **sustentável no mundo do
  caso** — há forasteiro? há estranho plausível? Se não há, a deflexão não pode ser gerada
  (ou é gerada e **explicitamente refutável** como falso testemunho).
- **Opções:**
  - **A) Guarda de sustentação** — o gerador só emite a deflexão "veio de fora" se existe um
    forasteiro/estranho plausível no caso. Custo: guarda no gerador de diálogo.
  - **B) Deflexão sempre refutável** — a fala pode sair, mas o mundo sempre contém o fato
    que a derruba (não havia forasteiro naquela noite — fato verificável, §5 "névoa"). Custo:
    gerar o fato-refutação.
- **[DECISÃO]** Guarda de sustentação (A), deflexão sempre refutável (B) ou as duas? Cruza
  com P9 (a deflexão é uma contra-hipótese — se P9 = B, esta é a mesma máquina).
- **Executa em:** **S1** (OS de diálogo).
- **Guarda tocada (na S1):** `qa-ui.mjs` (falas exibidas).

---

## 6. BLOCO D — Triagem espacial/elenco *(só decidir: fazer ou adiar)*

> Estes tocam **dados espaciais/3D e elenco**. A regra do relatório é explícita: **só triar
> aqui** (fazer ou adiar), **sem prometer escopo** — conversar com a camada 3D antes.

### Item 8 — Planta única navegável (cômodos de um mesmo local)

- **Defeito (item 8):** os cômodos de um mesmo local aparecem como 4 casas separadas no
  mapa; deviam ser **planta única navegável**. **Ponto de código:** `PlantaRelojoaria.jsx`
  existe **só** para o caso-escola; o gerado não tem planta renderizada (auditoria D da
  `os-palco-em-aneis-e0-triagem.md`).
- **[DECISÃO]** Fazer agora, adiar para S4 (UI/arte) ou backlog? (Não prometer escopo — é
  camada 3D/apresentação.)

### Item 9 — Suspeitos saem de cena após o cerco

- **Defeito (item 9):** Silas e o aprendiz deviam **sair da cena** para suas casas depois
  que a polícia cerca. Toca elenco + dados espaciais do caso-escola (`localidades.js`).
- **[DECISÃO]** Fazer, adiar ou backlog?

### Item 10 (QOL) — Transcrição completa da carta amassada do sobrinho

- **Defeito (item 10):** a carta amassada do sobrinho poderia ter **opção de ler a
  transcrição completa**. É QOL de leitura, não fair play — triar aqui por conveniência.
- **[DECISÃO]** Fazer (lote pequeno de UI) ou backlog?

---

## 7. Saídas esperadas (o que fica versionado)

1. **`docs/historico-decisoes.md`** — uma entrada datada (19/07/2026) por bloco (A, B, C, D),
   no formato do arquivo: título curto, decisão, razão, e o lote/sessão de execução. Modelo:

   > **19/jul/2026 (S2 — fair play, Bloco A):** Item 12 → [decisão]; item 14/P8 → [decisão];
   > item 16 → [decisão]. Execução: [sessão/lote]. Guarda: [qa.mjs / qa-ui.mjs].

2. **`docs/plano-de-sessoes.md`** — S2 marcada concluída; linha de resultado; rota reordenada
   se alguma decisão mudar a ordem (ex.: se P9 = âncora dupla, o lote do gerador pode furar
   a fila por re-gerar os 21 casos).

3. **Este documento** — pode receber, ao fim, um bloco "## 8. Decisões tomadas" com o
   resumo de uma linha por item (espelho do `historico-decisoes.md`), para consulta rápida.

**Nenhum arquivo de `src/` muda nesta sessão.** As decisões viram lotes de código nas
sessões carimbadas.

---

## 8. Regra de parada

A S2 termina quando os **9 itens** têm decisão registrada e lote carimbado. Itens do Bloco D
podem sair como "adiado" — isso é decisão válida e encerra o item. Se um item de A/B ficar
**sem decisão** (você quiser jogar mais um caso antes), ele volta como pendência para a
próxima S0 (rodada 3 do playtest cego), **não** bloqueia o fechamento dos demais. O
diálogo (Bloco C) **não** se implementa aqui — sai como critério fixado para a S1.

---

## 9. Decisões tomadas (19/07/2026)

Sessão executada; detalhe e razões em `historico-decisoes.md` ("S2 — Decisões de fair
play"). Resumo de uma linha por item:

| Item | Decisão | Executa em |
|---|---|---|
| 12 — vidro de Silas | **Espalhar o peso** entre 2–3 provas | lote próprio + S3 |
| 14/P8 — mentira rotulada | **Rótulo neutro** no mural (dois modos) | lote UI + `qa-ui` |
| 16 — móbil | **Móbil por suspeito** com isca | S3 + Estação IV |
| P9 — âncora única | **Híbrido** (dupla onde cabe; contra-hipótese nos demais) | lote do gerador (fura fila) |
| P16+P17 — compleição | **Adiar** (backlog do gerador) | — |
| P24 — fôrma das mentiras | **Cardápio amplo** + culpado partilha fôrma | lote do gerador + S3 |
| 11/P21–P22 — diálogo | **Confirmado**; 2ª camada em TODOS os confrontos | S1 |
| P23 — deflexão | **Guarda de sustentação**; preconceito de inocente permitido | S1 |
| 8 — planta única | **Fazer** — caso-escola **e** cena procedural | palco-em-aneis E1/E2 + UI |
| 9 — suspeitos saem de cena | **Fazer** | lote do caso-escola |
| 10 — transcrição | **Fazer** (QOL) | lote pequeno de UI |

**Impacto na rota:** o P9 híbrido re-gera os 21 casos e é o lote de maior custo do gerador;
o item 8 estendido ao procedural entra na OS `palco-em-aneis` (E1/E2). Bloco C alimenta a S1.

— fim da OS S2 —
