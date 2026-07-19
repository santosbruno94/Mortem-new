# OS — S1: Fair play do diálogo procedural (Bloco C da S2)

**Data:** 19/07/2026
**Branch:** `claude/executar-os-pr-qpn13w`
**Tipo:** OS de **execução** — os critérios já foram fixados na S2 (`os-fair-play-s2.md`,
Bloco C). Esta OS os traduz em fases de código sobre o derivador de árvores de diálogo,
aponta o que já está pronto, e para nos **[DECISÃO]** que a S2 deixou em aberto.
**Insumos normativos:** `docs/os-fair-play-s2.md` (Bloco C + §9), `docs/os-arvore-dialogo-procedural.md`,
`docs/kb-craft-narrativo/cliches-e-fair-play.md` (§4, §5, §7 + Van Dine nº 5),
`docs/biblia-de-vozes.md`, `docs/guia-de-estilo.md` (§8.4).
**Método:** cada ponto de código citado foi verificado contra o repositório vivo na data
(arquivos e símbolos existem — `derivarDialogos`, `perguntasParadeiro`, `confrontoDaCarta`,
`cartaDeAlibi`, `falaB2`, guardas do `qa.mjs`/`qa-ui.mjs`). Nada é citação de memória; as
linhas referem `src/gerador/dialogos_gerados.js` salvo indicação em contrário.

---

## 0. O que esta OS é (e o que não é)

A S2 fixou, no Bloco C, três critérios de fair play para o diálogo e mandou executá-los na
S1. Esta é a S1. **O motor segue cego** — a árvore é camada narrativa; `src/logic/` continua
lendo só `tagsOcultas`. Nada aqui toca veredicto/acusação. Toda variação continua saindo de
`hashString` salgado (ilha de build time — o runtime jamais importa `src/gerador`).

**A árvore nasce em `derivarDialogos(...)` (`:636-727`)**, é gravada no campo `dialogos` do
pacote por `montarPacoteGerado` (`pacote_gerado.js:1775`) e serializada em
`src/data/casos_gerados.js` por `scripts/gerar-casos.mjs`. Qualquer mudança aqui exige
**regenerar os casos** (`npm run gerar:casos`) e **replay byte a byte** verde (`qa.mjs`).

**O que esta OS NÃO faz:** não reabre as decisões da S2; não escreve prosa final sem o
pipeline (`redigir-prosa` + `revisar-prosa`, zero achados bloqueantes — `CLAUDE.md`); não
decide sozinha os pontos **[DECISÃO]** abaixo — o agente apresenta as opções cruzadas com o
KB, aponta custo e consequência, e para.

---

## 1. Fotografia: o que a S2 pediu × o que o código já faz

| Item da S2 (Bloco C + P6) | Critério fixado | Estado no código |
|---|---|---|
| **P21** — paradeiro universal | Todo interrogado declara paradeiro **quando perguntado**, nunca espontaneamente; o assassino mente **no mesmo beat** dos demais. | **✅ Já satisfeito** — ver §2. Nenhum código muda. |
| **P6 / item 11** — exposição contida | Se houver carta, o **negrito clicável carrega a informação** ("se recolheu às oito"), não o título opaco ("A Noite de X"). | ❌ `textoDisplay` opaco (`:449, :524`). Fase 1. |
| **P22** — confronto com ganho | Apresentar prova puxa **fala nova** (admissão parcial, detalhe, contradição), **em TODOS os confrontos** — nunca só repetição. | ◐ Parcial — inocente-com-segredo já tem 2ª camada (`:576, :581`); réu/testemunha só **reafirmam** (`:565, :607, :613`). Fase 2. |
| **P23** — deflexão plausível | A fala "veio de fora" só existe se a tese for **sustentável no elenco** (guarda de sustentação); o **preconceito é de inocente**, retratável, nunca do assassino validado. | ❌ Deflexão é exclusiva do **réu** e **sem referente** no elenco (`:372-375`). Fase 3. |

**Ordem das fases:** 1 (P6) → 2 (P22) → 3 (P23). Justificativa: P6 é a menor e autocontida
(um campo de prosa curto); P22 é o coração da sessão (toca a tabela de confrontos); P23
depende de decisão de arquitetura (mover a deflexão de camada) e cruza com P9 do gerador.
Cada fase é um **incremento jogável** e sai em commit próprio, com o pipeline de prosa e o QA
verde antes de avançar.

---

## 2. P21 — já satisfeito (verificação, não código)

**O que a S2 temia (P21):** o assassino declarar paradeiro que ninguém perguntou (confissão
espontânea proibida — Van Dine nº 5).

**O que o código faz hoje:**

- A **fala de abertura** (`falaAbertura`, `:229-248`) é só recepção/voz derivada — **não
  cita o álibi** nem carrega marcador `[[...]]`.
- O paradeiro só aparece nos nós `b1_<tom>`, alcançados por uma das quatro **perguntas do
  perito** (`perguntasParadeiro`, `:139-151`) — é sempre o **jogador** que puxa o beat.
- O assassino de cena mente com a **mesma redação** do inocente caseiro
  (`falaDeclarada` no ramo `mentiraDeCena`, `:500-505` — idêntica a `:509`): a mentira está
  no **lugar declarado**, não numa frase-assinatura, e **cai por confronto**.

**Conclusão:** P21 está atendido por construção. **Ação da S1:** registrar a verificação no
`historico-decisoes.md` (nenhuma linha de `src/` muda por P21) e manter a guarda que garante
que a abertura não vaza paradeiro — hoje implícita; **[DECISÃO menor]** vale endurecê-la no
`qa.mjs` (a fala de `noInicial` não pode conter marcador de carta de álibi)?

---

## 3. FASE 1 — P6: o rótulo da carta de álibi carrega a informação

- **Defeito (P6 / item 11):** a carta de paradeiro chega ao mural com `textoDisplay` **opaco**
  — `"A Noite de {nome}"` / `"A Madrugada de {nome}"` / `"A Tarde de {nome}"` (`:449, :524`).
  O dado que o jogador precisa **cruzar** (lugar declarado + faixa/hora) vive escondido no
  `carimboPadrao` (`:450, :525`) e na `descricao`. O negrito clicável não expõe o que se
  deve confrontar — é o defeito P6 do playtest.
- **O que a S2/KB dizem:** item 11 (Bloco C) — "o negrito clicável carrega a **informação**
  ('se recolheu às oito'), não o título opaco". §6 "plantio honesto": a pista pode existir e
  ainda pedir trabalho, mas **não pode se esconder** atrás de um título decorativo.
- **Ponto de código:** os dois `return` de `cartaDeAlibi` — ramo ausência (`:446-460`,
  `textoDisplay` em `:449`, `carimboPadrao` em `:450`) e ramo normal (`:521-534`,
  `textoDisplay` em `:524`, `carimboPadrao` em `:525`). O `rotulo`/`ctx.ausencia` (o lugar) e
  a `FAIXA_CURTA[faixa]` já estão calculados ali — é só levá-los ao `textoDisplay`.
- **[DECISÃO 1] — a fôrma do rótulo informativo.** Três graus, do mais discreto ao mais
  explícito:
  - **A) Lugar + faixa** — ex.: `"Paradeiro: {moradia} (noite)"`. Expõe o **lugar declarado**
    (o dado que cai por confronto), sem a hora. Mais fiel ao "carrega a informação" sem
    entregar a leitura pronta.
  - **B) Lugar + hora** — ex.: `"Recolhido {na moradia}, às oito"`. Expõe lugar **e** hora
    ("se recolheu às oito", o exemplo literal do item 11). Mais informativo; risco de soar
    como veredicto embalado se a hora for a chave.
  - **C) Nome + lugar** — ex.: `"{Nome}: {moradia}, à noite"`. Mantém o nome (que hoje ancora
    a carta no mural) e acrescenta o lugar.
  - **Leitura do agente:** A é a mais alinhada ao KB (informa o que cruzar sem pré-mastigar);
    B é a mais literal ao exemplo do item 11. A hora **é a mesma para todos** ("às oito",
    `:505/509`), então pô-la no rótulo não discrimina suspeito — é seguro, mas some com o
    trabalho de abrir a carta. **Recomendo A.**
- **Guardas tocadas:**
  - `qa-ui.mjs` — `textoDisplay` da carta é lido como texto de `.termo-clicavel`/`.termo-extraido`
    (`:729, :734`). Se o texto exato clicado mudar, **atualizar o QA no mesmo commit**
    (contrato intocável do `CLAUDE.md`).
  - `qa.mjs` — guarda de **vazamento de id** `gen_*` na superfície (`:2469-2482`): o rótulo
    novo não pode conter id interno. Guarda de **léxico de cartas** (`:2226-2227`): registro
    de época. O lugar já é `nomePredio(...)` (prosa de época), então o risco é baixo, mas o
    fiscal de continuidade confere.
- **Prosa:** rótulo curto, mas é **texto exibido** → passa por `revisar-prosa` +
  `anti-padrao-ia` antes do commit.
- **Pronto quando:** `textoDisplay` informativo nos dois ramos; `qa.mjs`/`qa-ui.mjs` verdes;
  casos regenerados; replay byte a byte.

---

## 4. FASE 2 — P22: segunda camada em TODOS os confrontos

- **Defeito (P22):** ao confrontar com prova, a reação **não vai além** do já sabido —
  confronto raso. **Estado atual, por papel:**
  - **Inocente com segredo** (`rastro_de_visita`, `:571-583`): **já tem 2ª camada** — a prova
    arranca a admissão parcial que o desonera ("À porta de {vítima} estive; à hora da morte,
    não" — `:576`; "Disso menti; do resto, não" — `:581`). Modelo do que se quer.
  - **Réu / testemunha** (`:547-566`, `:604-614`): só **reafirmam** — "Onde a acharam, não
    fui eu que a pus. A voz não muda do começo ao fim." (`:565`); "Disso não tiro uma linha."
    (`:607`); "Foi o que ouvi e foi o que declarei." (`:613`). **É o defeito P22.**
- **O que a S2/KB dizem:** decisão da S2 (§9) — "**2ª camada em TODOS os confrontos**". §7:
  cada confronto ganha uma segunda camada; "apresentar prova puxa fala nova — nunca só
  repetição". **Limite duro:** o réu **acomoda a prova sem confessar**; ninguém aponta o réu
  nem entrega conclusão que o jogador devia cruzar (cabeçalho do módulo, `:34-37`).
- **A tensão de design (o [DECISÃO] central):** para quem **não pode confessar**, o que é
  "ganho"? A 2ª camada não pode ser a confissão — mas também não pode ser vazia. E não pode
  virar **âncora única** (P9): uma contradição limpa demais grita o culpado.
- **[DECISÃO 2] — a natureza da 2ª camada do réu/testemunha.** As três fôrmas do KB
  ("admissão parcial, detalhe, contradição"), com o custo de fair play de cada uma:
  - **A) Detalhe verificável (novo dado a cruzar)** — a reação acrescenta um **fato novo
    checável** (uma hora, um nome, um lugar) que o jogador pode **cruzar com outra carta** —
    sem admitir culpa. Ex.: "Emprestei-a a fulano na terça" → há como conferir a terça. Vira
    **mais investigação**, não confissão. **Mais seguro contra P9** (é uma nova ponta, não
    uma âncora). Custo: garantir que o dado novo tenha onde ser cruzado (senão é ruído).
  - **B) Contradição fina** — a 2ª camada **atrita** com o álibi/outra fala do próprio réu (o
    jogador sente a rachadura). Custo alto: uma contradição forte é **âncora única**
    disfarçada (P9); tem de ser sutil e **não isolada** (herda o critério do P9 híbrido do
    gerador — não pode bastar sozinha).
  - **C) Admissão parcial de fato menor** — o réu cede um **fato lateral** (esteve perto,
    possuía a peça) sem ceder o crime, como o inocente-com-segredo já faz. Risco: aproximar a
    fala do réu da fala do inocente pode **borrar** a distância que hoje os separa (o réu
    reafirma; o inocente cede) — precisa manter a assimetria "réu acomoda / inocente desonera".
  - **Leitura do agente:** **A** é a mais coerente com o jogo (o confronto abre **nova
    frente de cruzamento**, o oposto de "resolver o caso na fala") e a mais segura contra P9,
    que a própria S2 decidiu combater no gerador (âncora híbrida). B só entra se subordinada
    ao critério do P9 (nunca basta sozinha). C exige régua fina para não colar réu e inocente.
    **Recomendo A como regra, com B pontual e subordinada ao P9.**
  - **Sub-ponto:** a 2ª camada é obrigatória em **todos** os confrontos (réu, testemunha,
    periférico) — a S2 diz "TODOS". Confirmar que **testemunha** também ganha 2ª camada
    (hoje reafirma), e não só o réu.
- **Ponto de código:** `confrontoDaCarta(...)` (`:542-617`) — cada `return { pergunta,
  reacao }`. A 2ª camada entra na `reacao` (a `pergunta` já cita a carta por `[${td}]`). O
  shape não muda; muda a prosa da `reacao` e, se A, o **dado novo** que ela cita (que precisa
  existir no mundo do caso — cruzar com `bruto.mundo.elenco`/`rotina` para o fato ser real,
  não inventado).
- **Guardas tocadas:**
  - `qa.mjs` — **bijeção `confrontos ↔ reacoesProva`** (`:2447-2457`) permanece (o shape não
    muda). Vazamento de id `gen_*` (`:2469-2482`): se a 2ª camada citar nome/lugar, usar a
    prosa de época, nunca id. Replay byte a byte.
  - `qa-ui.mjs` — confronto gated `[data-requer-carta]` (`:411, :436`) intocável.
  - **[DECISÃO menor]** se a opção A for adotada, vale uma guarda nova no `qa.mjs`: o "dado
    novo" citado na 2ª camada **tem de ter onde ser cruzado** (existir outra carta/fato que o
    confirme ou refute) — senão a 2ª camada é ruído honesto, mas ruído. Custo: guarda de
    sustentação da 2ª camada.
- **Prosa:** é o grosso da prosa da S1 — cada reação reescrita passa por `redigir-prosa`
  (voz por papel × tom × trait) + `revisar-prosa` (os três revisores) + `anti-padrao-ia`.
- **Pronto quando:** toda `reacao` de réu/testemunha tem 2ª camada conforme a [DECISÃO 2];
  assimetria réu/inocente preservada; `qa.mjs`/`qa-ui.mjs` verdes; casos regenerados; replay
  byte a byte; pipeline de prosa com zero achados bloqueantes.

---

## 5. FASE 3 — P23: guarda de sustentação da deflexão + preconceito de inocente

- **Defeito (P23):** a fala "quem fez isto veio de fora" **entrega** — hoje é exclusiva do
  **réu** (arremate `falaB2`, ramo `papel === 'reu'`, `:372-375`) e **não há forasteiro** no
  elenco a que ela aponte. Só o réu lucra com a tese → é um **tell** invertido (o jogador
  aprende que "quem culpa o forasteiro é o culpado").
- **O que a S2/KB dizem:** decisão da S2 (§9) — "**Guarda de sustentação**; preconceito de
  inocente permitido". §5 "o estrangeiro suspeito": sotaque/origem **nunca** são indício; a
  xenofobia da vila gera **falso testemunho retratável, nunca validado**. A deflexão só é
  honesta se a tese for **sustentável no mundo do caso**.
- **Duas mudanças, uma decisão cada:**

  **(a) Guarda de sustentação — a deflexão só existe se houver forasteiro plausível.**
  - **[DECISÃO 3a] — o que conta como "forasteiro plausível"?** As fontes de verdade
    disponíveis (verificadas no `pacote_gerado.js`): `vitima.forasteiro` (a vítima é de fora —
    `:1044, :1645`); `ausenteId` (o suspeito cujo paradeiro fica **fora do grafo da vila** —
    `:1731-1751`); `comarcaDoCaso.satelite` (`vila_mercado` — há trânsito de gente de fora).
    - **Opção:** a deflexão "veio de fora" **só é gerada** se ao menos uma dessas condições
      vale (há de fato um estranho plausível). Quando **nenhuma** vale, o arremate do réu usa
      uma fala **que não deflete** (fica no "trabalho e calo", como o ramo `obliquo` já faz em
      `:375`, sem apontar para fora).
    - **[DECISÃO 3a]** confirmar as três fontes como gatilho da guarda? Alguma a mais/a menos?

  **(b) O preconceito passa a ser de inocente, retratável — não do assassino.**
  - **[DECISÃO 3b] — mover ou só refutar?** A S2 diz "preconceito **de inocente** permitido".
    Duas leituras:
    - **A) Mover a deflexão para um inocente** — o réu **deixa de defletir** (arremate neutro);
      a xenofobia vira fala de um **periférico/testemunha inocente**, como **falso testemunho
      retratável** (§5: "névoa" — há o fato que a derruba, ex.: "não havia forasteiro naquela
      noite"). Corrige o defeito na raiz (o assassino não lucra com a tese). Custo: mexer no
      `falaB2` do réu **e** abrir um slot de deflexão no ramo inocente (feature nova pequena) +
      gerar o fato-refutação. **É um acréscimo de escopo — precisa da sua ordem expressa.**
    - **B) Só a guarda de sustentação (não mover)** — manter a deflexão no réu, mas só quando
      há forasteiro plausível (item a). Não adiciona preconceito de inocente; apenas impede a
      deflexão vazia. Menor custo; **não** realiza a metade "preconceito de inocente" da
      decisão da S2 — fica como pendência.
    - **Leitura do agente:** A é a leitura fiel da decisão da S2 e do KB (a deflexão só é
      honesta como falso testemunho de inocente, refutável), mas **é feature nova** (slot de
      deflexão no ramo inocente + fato-refutação) e o `CLAUDE.md` manda não criar feature sem
      ordem expressa. B é o incremento seguro e imediato. **Recomendo fasear: B agora
      (guarda), A como fase própria se você mandar** — para não embutir escopo sem ordem.
- **Ponto de código:** `falaB2`, ramo `reu` (`:370-376`) para a guarda/neutralização; se A,
  também o ramo inocente (`:384-406`) ganha o slot de deflexão condicionado, e o mundo do
  caso ganha o fato-refutação (fonte: `bruto.mundo.elenco` + flags `forasteiro`/`ausenteId`).
- **Guardas tocadas:** `qa.mjs` — determinismo (a guarda lê flags do pacote, não sorteia);
  replay byte a byte; se A, a deflexão de inocente **tem de ter** o fato-refutação no mesmo
  caso (guarda de sustentação, análoga à do §4). `qa-ui.mjs` — falas exibidas.
- **Prosa:** falas novas/reescritas → pipeline completo.
- **Pronto quando:** a deflexão do réu só sai sob a guarda de sustentação; a metade
  "preconceito de inocente" ou está feita (se A) ou registrada como pendência com gatilho (se
  B); QA verde; replay byte a byte.

---

## 6. Cruzamentos com o resto da rota

- **P22 × P9 (gerador):** a "contradição fina" (opção B da [DECISÃO 2]) **herda** o critério
  do P9 híbrido (nunca basta sozinha). Se você escolher A (detalhe verificável) para o P22, os
  dois ficam coerentes: nem o confronto nem a autoria repousam numa âncora só.
- **P23 × P9:** a deflexão sustentável é uma **contra-hipótese** — se P9 = contra-hipótese
  jogável (o híbrido da S2), a guarda de sustentação do P23 é a mesma máquina de "tese
  alternativa refutável". Vale alinhar as duas quando o lote do gerador (P9) rodar.
- **P6 × mural:** o rótulo informativo da carta de álibi conversa com a decisão do item 14
  (rótulo neutro no mural, lote próprio) — ambos mexem em como a carta se anuncia. Não
  colidem (um é a carta de paradeiro do diálogo; o outro, a estação de mentiras do mural),
  mas o mesmo princípio os rege: **o rótulo informa, não pré-julga**.

---

## 7. Saídas esperadas (o que fica versionado)

1. **Esta OS** commitada (design antes de build — como a S2).
2. Por fase executada: o commit de código em `src/gerador/dialogos_gerados.js` +
   `src/data/casos_gerados.js` regenerado + QA verde, e o pipeline de prosa registrado.
3. **`docs/historico-decisoes.md`** — entrada datada "S1 — fair play do diálogo": P21
   verificado (sem código); as [DECISÃO] respondidas; o que virou código por fase.
4. **`docs/plano-de-sessoes.md`** — S1 marcada concluída (ou parcial, se P23-A ficar para
   fase própria); linha de resultado; rota reordenada se preciso.

**Regra de parada:** a S1 fecha quando P6 e P22 estão em código com QA verde e P23 está ou
feito (guarda + preconceito de inocente) ou fechado como "guarda feita, preconceito de
inocente adiado com gatilho". As [DECISÃO] 1, 2, 3a, 3b são **do usuário** — o agente para
nelas e não as decide.

---

## 8. As decisões que travam a execução (resumo para o usuário)

| # | Decisão | Recomendação do agente |
|---|---|---|
| **1** | Fôrma do rótulo informativo da carta de álibi (P6): lugar+faixa (A) / lugar+hora (B) / nome+lugar (C) | **A** (informa o que cruzar sem pré-mastigar) |
| **2** | Natureza da 2ª camada do réu/testemunha (P22): detalhe verificável (A) / contradição fina (B) / admissão parcial (C) | **A** como regra, B pontual e subordinada ao P9 |
| **3a** | Fontes que sustentam a deflexão (P23): `vitima.forasteiro` + `ausenteId` + satélite? | confirmar as três |
| **3b** | Preconceito de inocente (P23): mover a deflexão para inocente com fato-refutação (A, feature nova) ou só a guarda de sustentação agora (B) | **B agora, A como fase própria sob sua ordem** |

Menores (posso decidir com sua anuência): endurecer no `qa.mjs` a guarda de "abertura não
vaza paradeiro" (P21); guarda de sustentação da 2ª camada (P22-A).

---

## 9. Decisões tomadas e execução (19/07/2026)

Sessão executada; detalhe e razões em `historico-decisoes.md` ("S1 — Fair play do diálogo").
Resumo de uma linha por item:

| Item | Decisão | Estado |
|---|---|---|
| P21 — paradeiro universal | (já satisfeito) | ✅ verificado, sem código |
| P6 — rótulo da carta | **Lugar + faixa** (A) | ✅ Fase 1 commitada |
| P22 — 2ª camada | **Detalhe verificável** (A), em todos os confrontos | ✅ Fase 2 commitada (pipeline: 1 bloqueante + 2 altos corrigidos) |
| P23 — deflexão | **Só a guarda de sustentação** (3b = B); fontes `vitima.forasteiro` + `ausencias` (3a) | ✅ Fase 3 commitada (bifurca 7/14) |

**Pendências abertas por esta OS** (com gatilho): P23-**preconceito de inocente** (falso
testemunho xenófobo retratável — feature nova, só sob ordem do usuário); a guarda menor
`qa.mjs` "abertura não vaza paradeiro" (não feita; vale por construção hoje).

**Verificação de fechamento:** `npm run gerar:casos` regenerado; `node scripts/qa.mjs` →
CASO VÁLIDO; `node scripts/qa-ui.mjs` → UI VÁLIDA; `npm run build` limpo.

— fim da OS S1 —
