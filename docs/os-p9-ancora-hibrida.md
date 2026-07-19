# OS — P9: fair play de autoria do gerador (âncora híbrida)

**Data:** 19/07/2026
**Branch:** `claude/executar-os-pr-qpn13w`
**Tipo:** OS de **design + execução faseada** de um lote que toca o **motor** (`veredicto.js`)
e a **guarda de solubilidade inviolável** (`qa.mjs`). A decisão de topo (híbrido) já é da
S2; esta OS a traduz em código possível, mede o custo real, e **para nas sub-decisões**.
**Insumos normativos:** `docs/os-fair-play-s2.md` (Bloco B, P9 + §9), `docs/game-design-simulacao.md`
(§ do gerador, Regras R1–R6, framing adiado ~503), `docs/kb-craft-narrativo/cliches-e-fair-play.md`
(§6 solução dupla de Berkeley, §4 prova sob medida), `CLAUDE.md` (regras invioláveis do motor).
**Método:** cada ponto de código foi verificado no repositório vivo (`pertenceA`, `veredicto.js`
nexo, três guardas de solubilidade do `qa.mjs`, `gerar-casos.mjs`). Nada de memória.

---

## 0. Aviso de escopo (ler primeiro)

A S2 decidiu **híbrido**: âncora **dupla** onde a magnitude permite; **contra-hipótese
jogável** nos demais. O mapa do código revela que **as duas vias pedem maquinário que hoje
não existe**, e que o gancho natural de uma delas está **adiado por design**:

- **Não há segunda âncora de espécie independente.** Todas as provas de autoria são a mesma
  espécie lógica — "traço físico do assassino na/perto da cena" (`pertenceA === assassinoId`).
  São 2–4 cartas, mas **caem juntas** se o traço foi plantado. É exatamente o P9.
- **Não há modelagem de acesso de terceiros à arma** (a matéria-prima da contra-hipótese).
- **`plantar_evidencia_falsa` está adiado para v2** (`game-design-simulacao.md:~503`: "quando
  entrar, nasce com falha detectável por construção, atada ao WIS de quem forjou").

**Consequência honesta:** implementar o híbrido "completo" (dupla independente + contra-tese
+ guarda endurecida + re-geração) é o **maior e mais arriscado lote da rota**, e encosta na
regra inviolável do motor. Por isso esta OS **fatia** o híbrido em incrementos jogáveis e
recomenda começar pelo de **menor risco**, que reusa maquinário existente (§6). O que vira
código depende das suas decisões (§8) — o agente não decide sozinho um lote que toca o motor.

**O que NÃO muda (regras invioláveis, `CLAUDE.md`):** o motor lê só `tagsOcultas` + seed;
zero LLM/rede/`Math.random` em `logic`/`data`/`gerador`; toda variação por `hashString`
salgado; o replay byte a byte do `qa.mjs`.

---

## 1. Fotografia: como a autoria é ancorada hoje

**A âncora primária (o "nexo instrumental").** A carta `gen_instrumento` grava
`pertenceA: assassino.id` e `tipoVestigio: metodo.instrumento` (o formato da arma —
`ponte_caso.js:246-251`). A forma nasce no autobattler pelo WIS do assassino: arma **levada**
(`instrumento_faltando`, `crime.js:1103`), **abandonada** (`crime.js:1109`) ou **guardada
úmida** (`crime.js:1122`); sem instrumento (mãos), um `pertence_do_assassino` (`crime.js:877`).

**O que o veredicto crava.** `veredicto.js:102-107` exige **especificamente** a carta
instrumental: `tipoVestigio === seed.instrumentoCorreto && pertenceA === reuId`. É o pilar
Presença/Nexo; sem ele, `impunidade` (`veredicto.js:229`). Ligar traço de terceiro é gafe
(`nexo_acessorio`, `veredicto.js:108-113`). O **móbil** é pilar à parte
(`motivo === seed.motivacaoCorreta && ligadoA === reuCorreto`, `veredicto.js:164-170`) — aponta
*intenção*, não *presença*.

**A redundância que existe (e por que não basta).** Além do instrumental, o assassino pode
deixar `objeto_pessoal`, `sangue_do_agressor`, `pegadas`, `ferimento_do_agressor` — todas com
`pertenceA === réu`. **Mas são a mesma espécie** (traço físico de presença): se a hipótese é
"plantaram para incriminá-la", todas caem juntas. **É o furo P9.** A única prova de espécie
*diferente* que aponta o réu é o **móbil** (intenção, não presença).

**As três guardas de solubilidade do `qa.mjs` (o predicado hoje é FRACO).** Todas exigem só
*qualquer* vestígio com `pertenceA === reuCorreto` sobrevivente:
- ponte forense: `qa.mjs:1641` ("nenhum vestígio de presença pertence ao réu");
- réplica R2 / âncora durável: `qa.mjs:1701-1717` (janela + mecanismo + **≥1 `pertenceA`** + móbil);
- solvabilidade sob ramos de interferência: `qa.mjs:2008-2035` (a âncora sobrevive em **todo**
  subconjunto de eventos R1–R6; o "conjunto redundante" é o que pode cair).

**Discrepância registrada:** o *pool* já é selecionado por predicado mais forte
(`metodicoResolve` exige o nexo **instrumental**, `gerar-casos.mjs:87-92`), mas as guardas de
solubilidade sob interferência só garantem *qualquer* `pertenceA`. A âncora durável garantida
é **mais fraca** que a que o veredicto cobra para Vitória Absoluta.

**Interferência (R1–R6) e durabilidade.** `destruir_evidencia` só remove carta
`suporteFisico === 'cena'` **e** dentro do conjunto redundante (`interferencia.js:473-488`); o
`qa.mjs` re-verifica adversarialmente (`qa.mjs:2031-2032`). O instrumental fica **fora** do
alcance da R2 nas variantes WIS alta/média (`oficio_do_reu`/`pertences_do_reu`,
`ponte_caso.js:238-239`); as vias destrutíveis são `sangue`/`pegadas` (`ponte_caso.js:279-281`).

---

## 2. As duas vias do híbrido, contra o código

### Via A — âncora dupla independente

Exige uma **segunda âncora de espécie lógica independente** da presença física, que **sobreviva
junto** com o instrumental em todo ramo de interferência. Três materiais possíveis:

- **A-i) Reusar o traço do CORPO do agressor** *(menor risco — maquinário já existe)*. O
  `ferimento_do_agressor` (`ponte_caso.js:401`) e o `sangue_do_agressor` nascem do corpo do
  atacante, não da cena — o `ferimento` fica no `oficio_do_reu` (fora da cena, **não
  plantável em terceiro**: não se forja uma ferida de defesa no corpo alheio). É **espécie
  independente** do "traço na cena": mesmo que a arma tenha sido plantada, a marca que a
  vítima deixou no agressor liga a ré por outra lógica. **Limite:** hoje é **condicional**
  (só há em luta com desvencilhamento), então "dupla" só cabe *onde a magnitude permite* — é
  o próprio critério da S2.
- **A-ii) Construir aquisição/acesso rastreável** *(médio risco — maquinário novo)*. Uma
  carta de proveniência: a ré adquiriu/teve acesso exclusivo àquele instrumento (registro de
  compra, posse exclusiva). Independe do traço na cena. Custo: modelar posse/aquisição no
  gerador; nova espécie de tag.
- **A-iii) Antecipar o framing (`plantar_evidencia_falsa`)** *(maior risco — sai do v2)*. A
  prova plantada por terceiro nasce com **falha detectável por construção** (o design já
  prevê); a "falha" é a segunda âncora que distingue autoria de incriminação. Custo: puxa uma
  feature inteira do v2 para cá — **expansão de escopo que exige sua ordem expressa**.

**[DECISÃO P9-A]** Qual material da segunda âncora? Recomendo **A-i** como primeiro
incremento (reusa o corpo-do-agressor, já existente e durável; a "dupla" aparece onde a luta a
produz — casando com "magnitude permite"). A-ii e A-iii ficam como fases próprias.

### Via B — contra-hipótese jogável

Nos casos **sem** segunda âncora, o mundo admite a tese "outra pessoa pode ter levado a arma"
como **sustentável e refutável** (KB §6, solução dupla de Berkeley: a acusação errada tem de
ser *racional*, e o mundo contém, visível, o fato que a refuta). Exige o que **não existe
hoje**: modelar **acesso de terceiros ao instrumento** (quem mais poderia tê-lo pegado) + o
**fato-refutação** (o que derruba a moldura). Custo alto; nova modelagem de oportunidade.

**[DECISÃO P9-B]** A Via B entra agora, vira fase própria, ou fica adiada? Recomendo **fase
própria depois da Via A** — a Via A já resolve o P9 nos casos com luta; a Via B cobre o
resto, mas é a metade cara e depende de modelar oportunidade (que hoje inexiste, ponto 5 do
mapa). Sem ela, os casos sem segunda âncora ficam como pendência explícita, não como furo
silencioso.

---

## 3. O portão — "onde a magnitude permite"

O híbrido precisa de um critério que decida, por caso, **dupla (Via A)** vs **contra-hipótese
(Via B)**. Com A-i, o portão é natural e barato: **há segunda âncora durável independente?**
(o corpo-do-agressor foi produzido pela luta e sobrevive à interferência). Se sim → o caso é
de âncora dupla; a guarda cobra as duas. Se não → o caso cai na Via B (ou fica pendente, se
B for adiada).

**[DECISÃO P9-portão]** O portão é "existe traço-do-corpo durável?" (A-i) ou um critério de
magnitude do crime (ex.: métodos violentos geram dupla; discretos caem na contra-tese)?
Recomendo o primeiro (é observável no pacote, determinístico, e não inventa um eixo novo).

---

## 4. A guarda de solubilidade endurecida (o contrato que muda)

Hoje as guardas pedem "≥1 `pertenceA` sobrevivente" (§1). Para a Via A, passam a pedir, **nos
casos de dupla**: "**≥2 âncoras de espécie independente** sobrevivem em **todo** ramo de
interferência" — o instrumental (durável por construção) **e** a segunda âncora (o
corpo-do-agressor, também durável por ficar fora da cena). Pontos a tocar, **no mesmo commit**
(contrato do `CLAUDE.md`):
- `qa.mjs:1701-1717` (`fatiaResolveSemQa`) e `qa.mjs:2008-2035` (solvabilidade sob ramos) —
  o predicado de autoria ganha a exigência de segunda espécie onde o caso é de dupla;
- `qa.mjs:1641` (ponte) — idem;
- **veredicto:** decidir se o motor passa a **exigir** a segunda âncora para Vitória Absoluta
  ou se ela é **corroboração** que só fecha a contra-hipótese. **[DECISÃO P9-motor]** — mexer
  no `veredicto.js:102-107` é tocar a regra de desfecho; a alternativa conservadora é a
  segunda âncora **não** mudar o veredicto (o motor segue cravando pelo instrumental), e a
  dupla existir só para **fechar o fair play** (o jogador tem como refutar "plantaram"). A
  conservadora é a mais segura (não altera os 4 desfechos que o `qa.mjs` exige).

**Guarda de espécie independente:** o `qa.mjs` precisa saber que duas âncoras são de
*espécies diferentes* (não duas cartas da mesma). Definir o predicado "espécie de âncora"
(instrumental × corpo-do-agressor × aquisição) como tabela fechada, sob guarda.

---

## 5. Custo e risco

- **Re-geração obrigatória:** qualquer mudança em `crime.js`/`ponte_caso.js` muda os bytes de
  cada pacote → **re-gerar os 21** (`npm run gerar:casos`) + re-commit `casos_gerados.js`,
  senão o replay byte a byte do `qa.mjs` falha.
- **Pool pode encolher:** se `metodicoResolve` e as guardas passarem a exigir dupla, menos das
  120 primeiras seeds qualificam (`POOL INSUFICIENTE`, `gerar-casos.mjs:177-180`) — talvez
  ampliar `CANDIDATAS_POOL`.
- **Motor:** os 4 perfis → 4 desfechos (guarda central do `qa.mjs`) **não podem regredir**. A
  opção conservadora (§4) protege isso.
- **Determinismo/replay:** a segunda âncora e o portão saem de tags do pacote + `hashString`,
  nunca de sorteio novo.

---

## 6. Faseamento recomendado (incrementos jogáveis)

1. **Fase 0 — endurecer só a GUARDA (sem tocar o gerador)** *(o menor passo, e o mais
   informativo)*: fazer o `qa.mjs` **medir e reportar** quantos dos 21 casos já têm, hoje,
   uma segunda âncora durável independente (o corpo-do-agressor sobrevivente) — sem falhar
   ainda. Diz, com número, quanto do pool já é de "dupla" e quanto cairia na Via B. **Zero
   risco** (só leitura/telemetria), e calibra as fases seguintes com dado real.
2. **Fase 1 — Via A-i (âncora dupla pelo corpo-do-agressor)**: garantir, onde a luta a produz,
   que a segunda âncora durável exista e sobreviva; guarda de solubilidade cobra as duas nesses
   casos; veredicto **conservador** (não muda desfecho). Re-gerar; replay.
3. **Fase 2 — Via B (contra-hipótese)** *(só sob decisão)*: modelar acesso de terceiros +
   fato-refutação nos casos sem dupla. Maior custo; fase própria.
4. **A-ii / A-iii** (aquisição rastreável; framing do v2): backlog, só sob ordem.

**Definição de pronto de cada fase:** `qa.mjs` verde (os 4 desfechos intactos), replay byte a
byte, `qa-ui` verde se a superfície mudar, build limpo; prosa nova (se houver carta nova) pelo
pipeline `revisar-prosa`.

---

## 7. Cruzamentos

- **P9 × P16+P17 (compleição, adiada na S2):** se a compleição voltar, é uma **terceira**
  espécie de âncora natural — a Via A ganharia mais material. Não bloqueia; anota-se.
- **P9 × P23 (deflexão, feita na S1):** a contra-hipótese da Via B é a **mesma máquina** da
  deflexão sustentável ("outra pessoa / gente de fora") — se a Via B entrar, reaproveita a
  guarda de sustentação do P23.
- **P9 × interferência (R1–R6):** a segunda âncora tem de ser **durável** (fora do conjunto
  redundante) ou a R2 a derruba e a dupla vira single de novo. O corpo-do-agressor (A-i) já é
  durável por ficar no `oficio_do_reu`.

---

## 8. As decisões que travam a execução (resumo para o usuário)

| # | Decisão | Recomendação do agente |
|---|---|---|
| **P9-A** | Material da 2ª âncora: corpo-do-agressor (A-i) / aquisição rastreável (A-ii) / framing do v2 (A-iii) | **A-i** (reusa o existente e durável; casa com "magnitude permite") |
| **P9-B** | Contra-hipótese jogável: agora / fase própria depois da Via A / adiar | **Fase própria depois da Via A** |
| **P9-portão** | Critério dupla×contra-tese: "há traço-do-corpo durável?" / magnitude do método | **"há traço-do-corpo durável?"** (observável, determinístico) |
| **P9-motor** | A 2ª âncora **muda o veredicto** (exigida p/ Vitória) ou é **corroboração** que fecha o fair play sem mexer no desfecho? | **Corroboração** (conservador; não regride os 4 desfechos) |
| **P9-fase0** | Rodar antes a Fase 0 (telemetria: quanto do pool já é dupla) sem tocar o gerador? | **Sim** (zero risco; calibra o resto com dado real) |

**Regra de parada:** nenhuma linha de `crime.js`/`ponte_caso.js`/`veredicto.js`/`qa.mjs` de
autoria muda antes de você responder P9-A, P9-motor e P9-fase0. A Fase 0 (telemetria) posso
executar assim que você disser "sim" — ela não toca o gerador nem o desfecho.

— fim da OS P9 —
