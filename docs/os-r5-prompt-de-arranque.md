# OS-R5 — Prompt de arranque para a sessão seguinte

Escrito no fecho da OS-R4, contra a árvore real, como a OS-R0 §4 manda
(«cada uma escreve-se no fecho da anterior»). Copiar o bloco do §1 como
primeira mensagem da sessão nova.

---

## 1. O prompt

> Executar a **OS-R5 — Móbeis e Cartas** (`docs/os-r5-mobeis-e-cartas.md`) do
> repositório MORTEM.
>
> **Antes de tocar em qualquer ficheiro, ler nesta ordem:**
> 1. `docs/os-r0-mestra-reforma-hora-emprestada.md` — a ordem-mestra. Não se
>    executa; governa. Interessam as guardas **G1, G2, G3, G4, G7, G10, G11,
>    G12**, a matriz de colisão do §5 (a R5 é **dona** de `cartas.js` na coluna
>    «prosa e tags») e o gate do §7.
> 2. `docs/os-r5-mobeis-e-cartas.md` — a OS a executar. Ler o **§1(c) primeiro**:
>    o eixo desta OS não são as duas cartas que faltam, é o **tell de contagem**
>    que elas corrigem.
> 3. A ata da **OS-R4** no fim de `docs/historico-decisoes.md` (secção «25/07/2026
>    — OS-R4»), e a do **lote de KB** logo a seguir. A R4 mudou o elenco, o mapa e
>    o orçamento, e a KB ganhou três domínios novos.
> 4. `docs/kb-craft-narrativo/cliches-e-fair-play.md` — é a OS de móbeis, e móbil
>    é onde o clichê mora.
> 5. `CLAUDE.md` — regras invioláveis do código e o contrato com o `qa-ui.mjs`.
>
> **Quatro martelos são precisos no arranque, e a OS não os tem resolvidos.**
> Estão no §5 do documento, cada um com recomendação e com o custo das
> alternativas. Confirmar os quatro com o utilizador **antes da Fase 1**:
>
> **(a) Qual é o móbil de Agnes** (a D5 manda que seja ambíguo e cala sobre o
> conteúdo). A recomendação é **a caderneta da loja** — ela devia ao morto, e o
> casamento apagava a dívida —, porque amarra a agiotagem da D1 à ambiguidade da
> D5 com uma peça só, e faz a cesta de ceia e o aro de ouro passarem a ter duas
> leituras.
>
> **(b) Onde nasce a carta do salário retido de Davey.** A recomendação é **o
> livro de pagamentos, no púlpito de ordens da oficina** — o móbil chega por
> documento, e o menino não precisa de se queixar do patrão para o jogo o ter
> (é a G7 a decidir).
>
> **(c) Se a R5 planta a carta que o 2.º degrau do confronto de Walter vai cobrar
> (D3).** A recomendação é **não**: confronto é da R6, e plantar aqui compromete
> orçamento que a R6 pode precisar.
>
> **(d) Se a agiotagem ganha carta própria.** A recomendação é **não** — ela entra
> pela prosa e pelos móbeis que explica, a custo zero, e uma carta que diga «o
> morto emprestava a juros» é exposição.
>
> **Começar pela Fase 0, que é telemetria e não muda nada:** imprimir, no
> `qa.mjs`, cartas de móbil **e** motivos distintos por suspeito. É esse número
> que decide a Fase 3.
>
> **Seguir as fases pela ordem**, com o gate global (OS-R0 §7) no fecho:
> `npm run lint:prosa`, `node scripts/qa.mjs`, `node scripts/qa-ui.mjs`,
> `npm run build`. Acresce o gate específico do §7 da própria OS — e note que o
> **item 1 desse gate é o pipeline `revisar-prosa` com zero achados bloqueantes**,
> que é o gate real de qualquer OS que escreva prosa. Fechar com ata em
> `docs/historico-decisoes.md` no modelo da OS-R0 §9, acrescentando o que o §8 da
> R5 pede: os martelos, **o orçamento gasto e o que sobra**, e as duas colunas da
> paridade, antes e depois.
>
> Trabalhar num ramo próprio a partir de `claude/mortem-vertical-slice-zzrcto`
> (ou do ramo designado da sessão), **depois de o PR da R4 estar integrado**.

---

## 2. O que a R5 vai encontrar e que as OS anteriores mudaram

**O elenco tem uma pessoa a mais e o mapa um nó a mais.** Amos Kell, sineiro, recebe na
**Torre de S. Miguel** (`torre_sino`, grupo `vila`, nó **aberto desde o início**). Ele não é
suspeito, não entra em `seed.perifericos` e **não precisa de móbil** — a GR5-3 fala dos
suspeitos, não de quem recebe o perito.

**Há um mecanismo novo, e a R5 pode querer usá-lo.** A localidade passou a admitir
**`prosaCondicional`** — blocos de parágrafo com `requerCartas`, que só entram quando as
cartas exigidas estão na mesa. A torre usa-o para a câmara dos sinos. É camada narrativa
pura: o motor não a lê, e o `qa.mjs` já a inclui na alcançabilidade (a guarda GR4-5 prova o
bloco da cifra). Se um móbil precisar de aparecer **depois** de outra carta, o campo existe e
está provado.

**O contador de esgotamento passou a contar a prosa condicional visível.** Se a R5 acrescentar
bloco condicional, a conta «N de N observações» acompanha sozinha.

**O motor ganhou uma marca nova, e ela é do elenco.** `tagsOcultas.insuficiente` faz o motor
**recusar** a carta como sustentação de qualquer âncora e como fato de refutação
(`acusacao.js`, `ehInsuficiente`). É o arquétipo do veraz sem crédito (G6). **Não pôr essa
marca numa carta de móbil sem pensar duas vezes:** móbil não sustenta âncora nenhuma de
qualquer modo, e a marca é para testemunho, não para documento.

**As horas são 18h00 · 18h00 · 14h00 · 13h00.** O Metódico ganhou uma hora na R4 porque a
torre é nó novo. A R5 **não deve criar nó**, logo as quatro horas ficam — mas confirme-se em
vez de se assumir.

**O banco está em sincronia, e deve continuar.** `sha256sum src/data/casos_gerados.js` =
`b96f9caf…b05a760b2`; `casos_indice.js` = `1fafae5c…b4038e29`. A R5 não toca no gerador.
Atenção: `gerar-casos.mjs` escreve **os dois** ficheiros — se algum comando o correr por
engano, restaurar os dois.

**A KB cresceu em três domínios no fecho da R4**, e um deles toca esta OS de perto:
`kb-mundo-vitoriano/utensilios-e-objetos.md` §11 ganhou a **balança de fiel do ourives** e as
unidades troy — que é o instrumento que dá lastro a qualquer prosa nova sobre o ouro dos
consertos, e portanto sobre a fraude que é o móbil do réu.

---

## 3. As armadilhas próprias desta OS

**O tell de contagem é o eixo, e é contra-intuitivo.** A tentação é ler «móbil por suspeito»
como uma tarefa de preenchimento — faltam dois, escrevem-se dois, fecha. Mas a coluna que
importa é a **outra**: hoje o réu tem três cartas de móbil e ninguém mais tem mais de duas.
Ler a paridade por **motivos distintos** (Silas tem **um** motivo documentado três vezes)
desfaz o problema sem gastar carta — e é por isso que a Fase 0 é telemetria antes de ser
escrita. **Medir antes de escrever, não depois.**

**A G7 rege a carta do Davey inteira, e o risco não é o óbvio.** Ninguém vai escrever nada
impróprio sobre um menino de 15 anos. O risco real é mais fino: dar-lhe **ressentimento** em
vez de **salário retido**. O móbil dele é económico e só. Se a carta fizer o jogador pensar
«este rapaz odiava o patrão», passou da conta; se fizer pensar «este rapaz não recebia há três
meses», está certa.

**A ambiguidade da D5 não se escreve na carta — escreve-se na MESA.** Uma carta que diga «ela
tanto podia amá-lo como dever-lhe» é o narrador a fazer o trabalho do jogador (guia §2.2). O
que se escreve é o **fato**: a caderneta, a quantia, a data. A ambiguidade nasce de a cesta de
ceia estar ao lado dela na mesa — e o jogador é que decide qual das duas manda.

**A agiotagem é matéria de exposição, e exposição é o vício que a R3 extirpou.** Se entrar,
entra pelo que explica. Nenhuma frase do tipo «o relojoeiro era conhecido por emprestar a
juros» — isso é a vila resumindo o caso para o jogador.

**Seis cartas para duas OS.** A R6 é a de exposição e interrogatórios (E0/E1/E2, beat 3,
contaminação, alfinetadas, `apontadaPor`) e pode precisar de mais do que parece. Gastar cinco
aqui é possível e é **decisão de mesa**, não de execução.

**A lição das quatro últimas OS, em uma linha:** o pipeline `revisar-prosa` reprovou a R3 e a
R4 na primeira passada, e em cada uma foi **um revisor diferente** que apanhou o bloqueante.
Na R4 o editor achou dedução vazada que os outros dois não viram; o perito achou duas
correções mecânicas de época; o fiscal achou uma pessoa inventada (um escrivão numa cena onde
o perito está sozinho) que a ronda anterior **tinha acabado de criar ao corrigir outra coisa**.
Correr os três não é cerimónia, e correr os três **outra vez depois de aplicar** não é
exagero.

**Não correr o `qa-ui` com outra coisa a escrever na árvore.** Ele sobe o `vite` com
hot-reload; um ficheiro salvo por outro processo durante a corrida derruba o overlay e produz
falha falsa. Foi diagnosticado na R4 e custou uma investigação.

---

## 4. Estado do repositório no fecho da OS-R4

| | |
|---|---|
| Ramo | `claude/os-continue-last-pr-4ap0rs` |
| Base | `claude/mortem-vertical-slice-zzrcto` |
| Commits | `7382cb4` · `b1e3de8` · `4812fa5` · `8b4863e` · `3ee3837` · `e244a63` |
| Gate | build ✓ · qa.mjs CASO VÁLIDO ✓ · lint:prosa sem violação ✓ · qa-ui.mjs UI VÁLIDA ✓ |
| Cartas | **40 de 46** (39 no catálogo + `ev_algor`), **6 livres** |
| Horas | 18h00 · 18h00 · 14h00 · 13h00 |

**Aberto, por OS:**

- **OS-R6** (exposição e interrogatórios): herda o orçamento que a R5 deixar; mais a **D3**
  (o 2.º degrau do confronto de Walter), o **`apontadaPor`** (D17) e
  `interrogatorio_silas` como localidade anómala.
- **OS-R8** (passe editorial): «lavrar termo»/«lavrar queixa» como procedimento
  luso-brasileiro sob nome inglês (`abertura.js`, `dialogos.js`, `cartas.js`); a prosa do
  ponto da vitrine, que se lê de dentro da loja desde a R2; a `porta_beco` declarada sem sala;
  a varredura de Davey na oficina contra o «nem uma cadeira saiu do lugar» de Wycliffe; três
  frases de efeito contra o teto de uma na cena do posto; e o «ontem» na amostra de Silas na
  bíblia de vozes.
- **OS-R9** (o gerador herda os padrões): a autoridade indevida que a R3 extirpou do
  caso-escola continua nos gerados; o vocativo epistolar moderno; `guarda` × `constable`; e
  agora também o **arquétipo do veraz sem crédito**, que passou a ter marca de tag
  (`insuficiente`) e guarda de motor — o gerador pode produzi-lo.
- **Camada de apresentação:** `FundoCena.jsx` desenha um armário de arquivo onde a prosa diz
  cômoda.
- **Sem dono, e é decisão de desenho:** o prazo do inquérito com consequência mecânica (o
  utilizador martelou «ficção só, por agora» na R3; reabrir **depois da R8**).
- **De KB, registado e não criado:** `CLASSES_VESTIGIO` não tem classe de **roupa queimada**
  nem de **documento queimado** — os dossiês existem, o gerador não sabe produzi-los.
