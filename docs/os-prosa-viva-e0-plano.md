# OS Prosa Viva — E0: plano contra a genericidade textual dos casos procedurais

Data: 2026-07-23. Origem: pedido do criador — "na última PR foi instituída uma vila
mais viva com variedade de locais; agora está na hora de olhar para a prosa do jogo e
gerar uma variedade de textos para não tornar o jogo muito genérico". Este documento é
PLANO (design antes de build): nada aqui autoriza implementação sem ordem expressa por
etapa. É a sequência natural da OS Vila Viva (PR #86): aquela resolveu a genericidade
**espacial**; esta ataca a **textual**.

---

## 1. Diagnóstico: onde a genericidade textual nasce

A Vila Viva (E1–E5) já fez a prosa da vizinhança, do corpo e do posto **beber da vila
gerada** — nomes, geografia, morfologia, mobília que lê o morador. O que ela não tocou
foi a **profundidade frásica** das superfícies que se repetem quase idênticas nos ~31
casos embarcados (1 réplica + 20 comarca + 10 luta). A raiz é uma só e é estrutural:
**bancos de fragmentos rasos — quase sempre 1 ou 2 variantes — selecionados por
`hashString`.** O determinismo está correto; o que falta é lastro. Seis causas
concretas, da mais visível para a menor:

| # | Causa | Evidência |
|---|---|---|
| 1 | **A abertura é um roteiro fixo único.** Os 6 passos (pensão da Sra. Potts em Caulfield → chamado → carta do constable → transformação da mesa → chegada → briefing) são prosa fixa, **sem pool de variante**. Só variam nome da vila (6 opções), sobrenome do constable (6) e a identidade da vítima. Todo caso abre com os mesmos ~8 parágrafos — é a **primeira impressão de todo caso**. O cartão de personagem (`OPCOES_PERSONAGEM_GERADO`, Harlan Blackwell) é byte-idêntico. | `pacote_gerado.js:2117` (`montarAbertura`), `:2218` |
| 2 | **Tabelas forenses de variante única.** `PROSA_LESAO`, `PROSA_RIGOR`, `PROSA_LIVOR`: exatamente uma string por estado. O corpo é examinado em **todo** caso — logo toda facada lê a mesma "A Ferida no Tórax", todo rigor pleno a mesma frase, todo livor as mesmas duas. | `pacote_gerado.js:734`, `:790`, `:797` |
| 3 | **A prosa do `corpo` não tem pool.** A abertura ("jaz… nada se tocou") e o fecho (maleta/termômetro) da localidade do corpo são frases fixas, só com ramo `femV`/`externo`/`pousada`. | `pacote_gerado.js:1460-1497` |
| 4 | **Móbil, instrumento e segredo: um molde por chave.** `PROSA_MOTIVO` (14 móbeis), `PROSA_SEGREDO` (2), `INSTRUMENTO_A_VISTA`/`ANCORA_SEM_LESAO`/`SUPERFICIE_RESPINGO`: uma forma de frase por chave, só troca de nome. Dois casos com o mesmo móbil dão o mesmo esqueleto. | `pacote_gerado.js:107`, `:256`, `:667`, `:685` |
| 5 | **Pools de baixa cardinalidade por toda parte.** Delegacia/posto (2), `INTRO_ENCONTRO` (2), linhas de cena externa (2), frames do `falaB1` (2 por tom); poucas de 3 (casas, `FRASE_TRAIT`). Lidas em muitos casos, ciclam à vista. | `pacote_gerado.js:1686`, `:1753`; `dialogos_gerados.js:330` |
| 6 | **Ecos e o frame do diálogo.** `ecos_interferencia.js` (2 por chave, ~14 strings) acompanha **todo** pacote gerado; o beat de diálogo repete o mesmo *frame* ("o paradeiro vem, enquanto…: [[id]]") entre suspeitos e casos, diferenciado quase só pelo nome interpolado e uma cláusula de trait. | `ecos_interferencia.js:30`; `dialogos_gerados.js:319` |

Corolário: um jogador que joga um caso não estranha; quem joga três ou quatro reconhece
o molde — a abertura idêntica, a mesma ferida, o mesmo eco. A variedade espacial da Vila
Viva realça o contraste: a vila muda de forma, mas as palavras ao redor não.

## 2. O que a pesquisa e a infra já oferecem e está ocioso

| Fonte | O que oferece | Estado |
|---|---|---|
| `hash_gerador.js` (`hashDecisao`, l.37) | Decorrelacionador: `hashString` **não tem avalanche** (chaves-irmãs viram picks rigidamente correlacionados — 18/81 quadrantes mortos medidos). `hashDecisao` re-hasha e liberta os slots. | Já usado nos picks novos (cena externa, casas, `INTRO_ENCONTRO`); os internos antigos seguem em `variante`/`hashString` por causa do golden byte-a-byte |
| Precedente Vila Viva E2 (composição por fragmentos) | Prosa da vizinhança montada de **slots independentes** (quarteirão × morfologia × encontro), não de lista de sinônimos — combinatória explode sem custo linear de revisão | Aplicado só à vizinhança; o molde do resto não foi combinatorizado |
| `docs/kb-medicina-legal/` (Taylor, Casper, Lacassagne) | Descreve o **mesmo** sinal forense por vários recortes (ordem de exame, sede, compleição) — variação legítima dentro da precisão | Consumido como verdade única; a folga de fraseado não é jogada |
| `docs/kb-mundo-vitoriano/` (cotidiano, clima, transporte, correio) | Textura de abertura: a manhã de outubro, o modo do chamado (telegrama × próprio a cavalo), a estação, a primeira vista da vila | Ociosa: a abertura não a lê |
| `docs/biblia-de-vozes.md` §8 (voz derivada) + `guia-de-estilo.md` | Norma fechada para fala de NPC gerado e para toda a prosa; o pipeline `redigir-prosa`/`revisar-prosa` lapida cada variante nova | Vigente — é o portão de qualidade, não um obstáculo |
| `monologo.js` (runtime) | Já tem **3 variantes por desfecho** (`ABERTURAS`/`FECHOS`) com restrição de máxima — o padrão de profundidade que falta ao build time | Bom modelo a espelhar |

## 3. Cercas — o que este plano NÃO propõe (rejeições já lavradas)

- **Zero geração de prosa em runtime; zero LLM; zero rede.** Toda variante é texto
  versionado, escolhido por `hashString`/`hashDecisao` salgado com a seed (CLAUDE.md).
- **Não mexer no motor.** Veredicto/acusação leem só `tagsOcultas` + seed; variedade é
  camada narrativa pura. Nenhuma variante cria informação nova nem vira pista (fair
  play): o cruzamento continua sendo do jogador.
- **Não variar o que a precisão forense fixa.** Um sulco de garrote é horizontal e
  uniforme em todo caso — muda-se o **recorte da observação**, nunca o sinal técnico que
  o glossário e o motor pressupõem. Cada variante forense passa pelo `perito-forense`.
- **Não inflar sinônimo por sinônimo.** Banco raso trocado por banco fundo de sinônimos
  ainda lê como molde e multiplica o custo de revisão. A alavanca é **combinatória de
  slots** (precedente E2), com teto de variantes por superfície.
- **Caso-escola intocado** (`localidades.js`, `cartas.js`, `dialogos.js` são artesanais)
  — regressão zero, como em toda OS do gerador.
- **Não reabrir fair play/psique/álibi** — a fôrma das mentiras, deflexões e tells já foi
  fechada (S1/S2). Esta OS é editorial e de textura, não mecânica.

## 4. O plano — Fase 0 + cinco etapas, cada uma um incremento jogável

Ordem por razão impacto ÷ esforço. Cada etapa é independente o bastante para ser uma OS
própria com playtest de leitura ao final. A regra de ouro de todas: **combinatória de
slots antes de profundidade de lista**, e todo pick novo por `hashDecisao` decorrelado.

### Fase 0 — Telemetria da monotonia (risco zero, sem tocar prosa)

**O que entrega:** um "índice de monotonia" medido de mesa (script fora do bundle, como
o `gabarito-casos.mjs`): para cada superfície de prosa gerada, **quantas strings
distintas** os 31 casos embarcados de fato produzem e **quanto reuso** há entre casos.
Transforma "parece repetitivo" em números por superfície, e dá a pauta de prioridade das
etapas seguintes com dado, não com palpite (espelha as Fases 0 das OSs de flags psíquicas
e priors compostos).

- **Guarda opcional no `qa.mjs`:** registrar o índice e travar regressão (uma etapa que
  aumente a repetição de uma superfície reprova).
- **Pronto quando:** relatório de mesa com o índice por superfície; decisão do usuário
  sobre o teto de variantes (D2) tomada com esse número à mão.

### E1 — A abertura procedural: cold open da descoberta *(maior impacto)*

> **Conceito fechado em 23/07/2026 (D1 resolvida).** A pensão da Sra. Potts fica sendo
> abertura **só do tutorial** (caso-escola). Os casos procedurais ganham abertura própria:
> um **cold open da descoberta** — o caso abre nos olhos de *quem achou o corpo*. A
> telemetria da Fase 0 provou que a raiz do problema é aqui: **4 dos 6 passos da abertura
> são byte-idênticos nos 31 casos** (`caulfield`, `chamado`, `transformacao`, `chegada`
> congelados; `docs/os-prosa-viva-fase-0-telemetria.md` §2).

**O que o jogador ganha:** o caso não abre sempre igual, e abre com tensão. Antes de o
perito entrar em cena, um vislumbre do *achado* — o menino do leite que estranha a porta, a
vizinha que bate e ninguém responde, o sacristão ao alvorecer. Varia por descobridor ×
lugar × hora × o que se reparou, e cai como uma luva no pivô de gravura (visual novel).

- **Por que é justo (a cerca inviolável):** o descobridor é **leigo** e viu **só o depois**
  — a mesma cena fria que o perito vai ler. O cold open **jamais** revela o que a cena deve
  provar: nada de mecanismo (um leigo não distingue garrote de esganadura), nada de hora da
  morte, nada do culpado, e **nunca confirma nem desmente a encenação** (`cenaEncenada`/
  `horaForjada`). Regra de ouro: *observação pura de leigo* — impressão, choque, frio,
  cheiro, o chamado por socorro; **zero informação nova** (guia §2). Todo detalhe concreto
  que entrar já é fato que a própria cena mostra — nunca uma dedução adiantada. Cada
  variante passa por `perito-forense` (não vaza sinal) e `fiscal-continuidade` (não
  contradiz as cartas).
- **Os fatos duros continuam na carta/briefing.** Identidade da vítima (nome, idade,
  profissão), o "nada se tocou", o "não sei datar defunto": tudo isso segue no chamado do
  constable — o portador fair-play de sempre. O cold open **acrescenta textura e drama**, a
  carta **carrega a informação**.
- **O que muda:** `montarAbertura` passa de roteiro fixo a **composição por slots**. Nova
  espinha dos passos procedurais (o tutorial mantém a sua): {descoberta: quem acha × onde ×
  quando × o que reparou} → {o constable assume: guarda à porta} → {o chamado ao perito:
  carta com os fatos} → {chegada: a primeira vista *desta* vila} → {briefing enxuto}. Cada
  slot por `hashDecisao` decorrelado; poucos fragmentos por slot explodem em combinações
  sem custo de revisão linear. Nenhum fragmento cria informação — só textura.
- **[D1 — assinatura] resolvida:** a assinatura recorrente **deixa de ser um lugar** (a
  pensão) e passa a ser o **método** — a maleta, a lente, o termômetro trincado, a primeira
  página em branco da caderneta que o perito abre ao chegar. Fecha o cold open sem prendê-lo
  a um cenário fixo (o perito é itinerante entre casos).
- **Fair play/continuidade:** clima e estação presos a 14/out/1893 (fiscal-continuidade); o
  descobridor, o modo do chamado e a chegada nunca antecipam fato do caso nem privilegiam o
  culpado.
- **Pronto quando:** 5 seeds produzem 5 aberturas textualmente distintas e coerentes, cada
  passo com `pior ≥ 3` na telemetria (nenhum passo procedural congelado); `qa-ui.mjs` verde
  (a abertura é texto visível e a rota clica-a); pipeline `revisar-prosa` com zero
  bloqueantes; o tutorial (caso-escola) segue byte-idêntico.

### E2 — O corpo ganha variação dentro da precisão *(perito-forense é o portão)*

**O que o jogador ganha:** o exame do corpo — presente em todo caso — deixa de ler
sempre a mesma frase. A **verdade forense é a mesma**; variam a **ordem de observação** e
o **recorte sensorial**, ancorados em fatos que o gerador já tem (sede da lesão,
compleição e idade da vítima, decúbito, IPM/estado do rigor e do livor).

- **O que muda:** `PROSA_LESAO`/`PROSA_RIGOR`/`PROSA_LIVOR` e a prosa da localidade
  `corpo` passam de string única a pequeno banco (teto D2), com variantes escritas contra
  a `kb-medicina-legal` e validadas uma a uma pelo `perito-forense`. A variante nunca
  altera o sinal técnico (o sulco horizontal continua horizontal); altera por onde o olho
  entra.
- **Guarda:** a família/assinatura do catálogo que o motor pressupõe permanece; o
  `perito-forense` reprova qualquer variante que embarace época ou precisão.
- **Pronto quando:** o `gabarito-casos.mjs` confirma os 4 desfechos dos 4 perfis; leitura
  de 5 seeds mostra corpos descritos com voz variada e forense idêntica; perito sem
  bloqueantes.

### E3 — Móbil, instrumento, segredo e as superfícies de 1–2 variantes sobem a banco combinatório

**O que o jogador ganha:** dois casos com o mesmo móbil, o mesmo instrumento ou o mesmo
tipo de local de encontro deixam de partilhar esqueleto de frase.

- **O que muda:** `PROSA_MOTIVO`, `PROSA_SEGREDO`, `INSTRUMENTO_A_VISTA`/
  `ANCORA_SEM_LESAO`/`SUPERFICIE_RESPINGO`, delegacia/posto, `INTRO_ENCONTRO`,
  `TEXTURA_POR_CLASSE` e a prosa de ponto da cena passam a **compor por slots** onde
  couber (ex.: móbil = {o documento} × {a cobrança} × {o que a morte destrava}), com teto
  de variantes por superfície para não estourar o custo de revisão.
- **Fair play:** o móbil corrobora, não prova; a variante mantém o fato e some com a
  conclusão (observação pura, guia §2).
- **Pronto quando:** o índice da Fase 0 sobe nas superfícies tocadas; `qa`/`qa-ui`/`lint`
  verdes; pipeline `revisar-prosa` zero bloqueantes.

### E4 — Ecos e o frame do diálogo

**O que o jogador ganha:** o eco pós-caso e a moldura da pergunta de interrogatório
deixam de soar decorados.

- **O que muda:** (a) `ecos_interferencia.js` sobe de 2 variantes por chave (com o
  `perito`/`fiscal` de praxe); (b) no diálogo, varia-se o **frame** repetido do beat — não
  só o cruzamento tom × trait —, além de expandir `ENTREGA_POR_TRAIT` e `TENTO_RESSONANTE`.
  Os `dialogos_gerados.js` já passaram pelo pipeline (Fase 4 da OS de diálogo): aqui é
  **expansão medida + achado residual**, não relapidação geral.
- **Guarda:** a voz derivada continua obedecendo à `biblia-de-vozes.md` §8 (teste do nome
  coberto: a CÉLULA classe × idade × trait ainda se reconhece).
- **Pronto quando:** índice da Fase 0 sobe nas superfícies de eco/diálogo; contrato do
  `qa-ui.mjs` intocado (rótulos clicáveis, `data-opcoes-dialogo`); `revisar-prosa` zero
  bloqueantes.

### E5 — Decorrelação e guarda anti-monotonia *(faz a variedade de fato aterrissar)*

**O que o jogador ganha:** a variedade escrita nas etapas anteriores não fica presa numa
"coluna" — dentro de um caso as superfícies não caem todas no mesmo índice, e entre casos
o reuso fica sob teto.

- **O que muda:** migrar os picks internos remanescentes de `variante`/`hashString` para
  `hashDecisao` (documentando o **bump do golden replay** — muda bytes dos casos
  embarcados, re-gera os 31 com `gerar:casos` no mesmo commit); guarda no `qa.mjs` que
  reprova quando um caso concentra superfícies na mesma coluna ou quando o reuso entre
  casos passa do teto; cobertura de variante órfã (variante que nenhuma seed embarcada
  materializa é revisada de mesa e anotada).
- **[DECISÃO D4] — aceitar o bump de golden.** O usuário confirma que os 31 casos serão
  re-gerados (byte novo) em troca da decorrelação.
- **Pronto quando:** a guarda anti-monotonia entra verde; `qa`/`qa-ui`/build verdes; os 31
  casos re-gerados.

## 5. Ordem, dependências e esforço relativo

```
Fase 0 (telemetria) ──► primeiro; dá a pauta e o teto com número
E1 (abertura) ────────► maior impacto; independente
E2 (corpo/forense) ──► independente; perito-forense é o gargalo
E3 (móbil/instr./cena)► independente; muitas superfícies, cada uma barata
E4 (ecos/diálogo) ────► independente; engine de diálogo é o mais pesado
E5 (decorrelação+guarda)─► por último; mede e trava o que E1–E4 escreveram
```

Esforço relativo: Fase 0 pequeno · E1 médio · E2 médio (perito-heavy) · E3 médio-grande
(muitas superfícies) · E4 grande (engine de diálogo) · E5 médio.

## 6. Decisões do usuário — TOMADAS em 23/07/2026 (com a telemetria à mão)

- **D1 — Abertura procedural:** ✅ **decidida.** A pensão da Sra. Potts fica **só no
  tutorial**; os casos procedurais abrem com um **cold open da descoberta** (POV de quem
  achou o corpo), e a assinatura recorrente migra do lugar para o **método** (a maleta, a
  caderneta em branco). A ideia de mostrar o crime/o assassino foi **rejeitada** por colidir
  com o núcleo forense: um prólogo do crime destrói a encenação (`cenaEncenada`/`horaForjada`
  — o assassino forja a cena para enganar o perito; mostrá-la mata a dedução). Detalhe do
  conceito e das cercas de fair-play na E1 revista (§4).
- **D2 — Teto de variantes por superfície:** ✅ **seguir recomendação** — 3–4 variantes por
  slot nas superfícies de banco raso (`reacao_vital`, `livores`, `cena`, `segredo`, `eco`),
  priorizando combinatória de slots; **não** perseguir número onde o banco já é fundo
  (`corpo`, `vizinhanca`, `dialogo:fala` — lá o trabalho é E5, sorteio).
- **D3 — Slots × listas:** ✅ **seguir recomendação** — combinatória de fragmentos sobre
  profundidade de sinônimos (a `vizinhanca`, feita por slots, tem teto 3828 contra 2–17 das
  listas rasas).
- **D4 — Bump de golden (E5):** ✅ **seguir recomendação** — aceita re-gerar os 31 casos
  (byte novo) em troca da decorrelação.

## 7. Tamanho honesto

O grosso é trabalho editorial pelo pipeline que já existe, sobre superfícies mapeadas com
linha e número (§1). O único risco de estouro é o de sempre nas OSs de prosa-molde: **cada
variante nova amplia o corpus que o `revisar-prosa` precisa lapidar.** A mitigação é
dupla e está no plano: (a) combinatória de slots multiplica a leitura sem multiplicar a
revisão na mesma proporção; (b) teto de variantes por superfície, fixado na Fase 0 com o
índice à mão. Se a pauta da Fase 0 apontar escala grande em muitas superfícies, o corte se
decide ali, com o número na mesa.

## 8. Regras invioláveis em todas as etapas

- Motor lê SOMENTE `tagsOcultas` + seed; toda variedade é camada narrativa — nenhuma regra
  nova de veredicto, nenhuma informação nova, fair play preservado.
- Determinismo total: toda seleção por `hashString`/`hashDecisao` salgado; guarda do
  `qa.mjs`. Picks novos usam `hashDecisao` (decorrelação).
- Precisão forense inegociável: variante forense só entra com o `perito-forense` sem
  bloqueantes (validação contra `docs/kb-medicina-legal/`).
- Prosa nova só entra por `redigir-prosa` + `revisar-prosa` com zero bloqueantes; marcadores
  `[[id]]` e interpolações `{detective.campo}`/`{g:masc|fem}` sobrevivem intactos.
- Replay byte a byte: template alterado ⇒ `npm run gerar:casos` no MESMO commit; `lint-prosa`
  já cobre `casos_gerados.js`.
- Contrato do `qa-ui.mjs` (rótulos clicáveis, `.termo-clicavel`/`.termo-extraido`,
  `data-overlay`, ordem dos selects) intocável sem atualizar o QA no mesmo commit.
- Caso-escola artesanal permanece byte-idêntico.
- Nenhuma etapa vira código sem ordem expressa do criador para AQUELA etapa.
