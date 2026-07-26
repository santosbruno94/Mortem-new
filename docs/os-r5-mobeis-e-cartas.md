# OS-R5 — Móbeis e Cartas

**Mestra:** OS-R0. **Decisões:** D1, D3 (parte), D4, D5, D6.
**Guardas:** G1, G2, G3, G4, G7, G10, G11, G12.
**Pré-requisito:** OS-R4 com ata (fechada em 25/07/2026). **Não abre antes.**
**Namespace de sal:** `reforma:r5:mobeis` (reservado na OS-R0 §6).

Escrita no fecho da OS-R4, contra a árvore real, como a OS-R0 §4 manda.

---

## 1. O que esta OS resolve

Três coisas, e a terceira é a que ninguém tinha visto até a R4 fechar.

**(a) Dois suspeitos não têm móbil nenhum.** A sessão S2 decidiu **«móbil por suspeito, com
isca»** (19/07/2026) e a decisão nunca foi executada para **Agnes Rooke** e **Davey Tull**. O
jogo não mente por causa disso — o `veredicto.js` tem a guarda `temMotivoNaMesa`, e o
`qa.mjs` prova hoje que o monólogo **não inventa** razões para quem não as tem na mesa
(«Periférico sem móbil na mesa não ganha "razões contra a vítima"»). O jogo está correto e
**mudo**. Esta OS dá-lhes voz: a **D5** manda que o de Agnes seja **ambíguo**, decidido pelas
cartas que o jogador colher; a **D6** manda que o de Davey seja `salario_atrasado`, **e só
isso**, sob a guarda de menoridade (**G7**).

**(b) A agiotagem da vítima (D1) não existe no jogo.** A ordem-mestra chama-a **«a espinha do
caso»** e a marcou como *entra*. Hoje não há uma carta, uma fala ou uma linha de prosa que
diga que o Sr. Arthurs emprestava a juros. Sem ela, os móbeis dos periféricos ficam soltos:
não há razão estrutural para meia vila dever alguma coisa ao relojoeiro. É o buraco maior
desta OS, e é ele que torna plausível tudo o que o §3.1 vai pendurar.

**(c) O réu tem MAIS cartas de móbil do que qualquer outro suspeito — e a R4 piorou isso.**
Contagem de hoje, no catálogo:

| Suspeito | Cartas de móbil | Quais |
|---|:-:|---|
| **Silas Crane (o réu)** | **3** | `ev_livro_ordens` · `corrob_pettigrew` · `ev_livro_ii` |
| Walter Arthurs | 2 | `dep_testamento` · `dep_dividas_walter` |
| Caleb Grey | 1 | `dep_queixa_grey` |
| Agnes Rooke | 0 | — |
| Davey Tull | 0 | — |

Um jogador que conte cartas de móbil acha o réu sem raciocinar sobre o caso. Isso é **tell de
contagem**, e é o mesmo defeito que o gerador já combate com a paridade de iscas. A R4 pôs a
terceira carta de Silas (o Livro II) sem medir esta coluna — está registrado, e a conta é
desta OS.

---

## 2. O orçamento de cartas — a restrição que rege esta OS

| | |
|---|---|
| Catálogo hoje | **39** em `cartas.js` + `ev_algor` de runtime = **40** |
| Teto (G11) | **46** |
| Livre | **6** |
| A dividir entre | **R5** (esta) · **R6** (exposição e interrogatórios) |

**Seis cartas para duas OS.** A R5 declara o que gasta no §3 e não excede sem ata própria. Se
o desenho escolhido no §5 pedir mais do que sobra, **a decisão é de mesa, do utilizador** —
cortar carta velha ou subir o teto —, e não de execução. O teto existe por razão de
jogabilidade medida em playtest (acima dele o mural de acusação satura), não por
contabilidade.

**Restrição de domínio, herdada da G1:** *nenhuma carta nova entra em `temporal` ou `causal`*.
Móbeis são **`comportamental`**, subdomínio `motivo`. O `qa.mjs` já reprova o contrário —
a guarda **GR4-2** congela o conjunto das oito cartas da cadeia física por id.

---

## 3. Escopo

### 3.1 Os dois móbeis que faltam (D5, D6)

| Peça | De quem | Domínio | Cartas |
|---|---|---|---|
| O móbil ambíguo | Agnes Rooke | `comportamental` · `motivo` | 1 |
| O salário retido | Davey Tull | `comportamental` · `motivo` | 1 |

**O de Davey é o mais barato e o mais regrado.** O motivo `salario_atrasado` **já tem rótulo**
em `rotulos.js` (vocabulário do gerador: *«o salário retido»*), logo não há id novo a
registrar. A **G7** rege tudo o que se escrever: Davey tem 15 anos, o móbil é **económico e
só**, ele não é cúmplice nem suspeito de facto, e **nenhum conteúdo de outra natureza** entra
em nenhuma variante de tom. O que a carta precisa de mostrar é dinheiro retido — não
ressentimento adolescente, não ameaça, não segredo.

**O de Agnes é o mais delicado, porque a D5 pede ambiguidade genuína.** «Ambíguo, decidido
pelas cartas que o jogador colhe» significa que a mesma carta tem de suportar **duas leituras
opostas** conforme o que estiver ao lado dela na mesa: a cesta de ceia e o aro de ouro por
gravar dizem *afeto*; a carta de móbil, sozinha, diz *interesse*. Ver §5(a) — é ponto de
decisão, não de execução.

**Paridade de isca (S2).** Ambas nascem **como isca honesta**: a tag `isca: true` acompanha
as cartas de móbil dos inocentes (é o que `dep_testamento`, `dep_dividas_walter` e
`dep_queixa_grey` já fazem). Isca não é mentira — é razão verdadeira que não conduz ao crime.

### 3.2 A agiotagem (D1)

**A recomendação é que ela NÃO ganhe carta própria.** Uma carta que diga «o relojoeiro
emprestava a juros» é exposição: entrega ao jogador uma conclusão em vez de material. A
agiotagem deve **aparecer pelo que explica** — a caderneta de Agnes, o salário que Davey não
recebeu, a queixa de Grey, as cobranças de Walter — e viver na **prosa de localidade e nas
falas** já existentes, que não custam carta nenhuma. Ver §5(d).

O que ela ganha de graça, se entrar assim: a vila inteira passa a ter uma razão comum para
não chorar o morto, e o **móbil do réu deixa de ser o único que se explica sozinho** — que é
metade do problema do §1(c).

### 3.3 A paridade dos móbeis (o tell de contagem)

**Fase 0 obrigatória, e é telemetria pura: medir antes de mexer.** O `qa.mjs` passa a imprimir
duas colunas por suspeito — **cartas de móbil** e **motivos distintos** —, e a diferença entre
as duas é o coração da questão:

> Silas tem **três cartas** e **um só motivo** (`silenciamento`, documentado três vezes: o
> livro de ordens, a consulta ao procurador e o caderno de pesos). Walter tem **duas cartas**
> e **dois motivos** (`heranca` e `dividas`). Pela contagem de **motivos**, o réu não é o
> máximo — é Walter. Pela contagem de **cartas**, é o réu.

**A recomendação é medir a paridade por MOTIVOS DISTINTOS, não por cartas**, e nivelar só o
que a Fase 0 mostrar fora da banda. É a leitura honesta: três documentos da mesma fraude são
**um móbil contado três vezes**, não três móbeis. Com Agnes e Davey servidos, a coluna de
motivos fica **1 · 2 · 1 · 1 · 1**, e o réu deixa de ser o máximo em qualquer métrica que o
jogador consiga contar sem abrir as tags.

### 3.4 Fora de escopo

- **D3 (Walter sabia da mudança do testamento e omite).** A decisão diz que isso **«cai no
  2.º degrau do confronto»** — confronto é árvore de diálogo, e árvore de diálogo é **OS-R6**.
  Registar, não tocar. *(Se a R5 quiser plantar a carta que o segundo degrau vai cobrar,
  é decisão de mesa: ver §5(c).)*
- **D17 `apontadaPor`** — campo e sistema; **OS-R6**.
- `interrogatorio_silas` como localidade anómala — **OS-R6**.
- Qualquer mudança em `temporal`/`causal`, no gerador ou no banco. *(G1, G12)*
- A camada psíquica, o pivô visual, o bug de `reacao_vital` — **fora da reforma** (OS-R0 §8).

---

## 4. Fases

**Fase 0 — Telemetria da paridade.** Cartas de móbil e motivos distintos por suspeito,
impressos pelo `qa.mjs`. **Risco zero, e decide a Fase 3.**

**Fase 1 — O móbil de Davey.** O mais barato, o mais regrado (G7), e o que não depende de
nenhum martelo além do §5(b).

**Fase 2 — O móbil de Agnes, e a agiotagem que o sustenta.** As duas coisas nascem juntas: a
razão dela só é plausível dentro de um mundo em que o morto emprestava.

**Fase 3 — A paridade, conforme a Fase 0.** Se a banda estiver limpa pela métrica de motivos,
registar e não mexer; se não, nivelar pelo que o orçamento deixar.

**Fase 4 — Gate e ata.**

---

## 5. Pontos de decisão — quatro, e todos antes da Fase 1

### (a) Qual é o móbil de Agnes?

A **D5** fixa que é **ambíguo** e cala sobre o conteúdo.

- **(1) A caderneta da loja: ela devia ao morto, e o casamento apagava a dívida.**
  *Recomendada.* Amarra a **D1** (a agiotagem) à **D5** (a ambiguidade) com uma peça só, e é a
  única das três que faz o material já embarcado trabalhar mais: a cesta de ceia e o aro por
  gravar passam a ter **duas leituras** — noiva ou devedora —, e a escolha entre elas é do
  jogador, que é exatamente o que a D5 pede. Custa **1 carta**.
- **(2) A herança prometida em papel particular.** Mais forte como móbil e **pior** como
  desenho: aproxima Agnes de Walter (dois herdeiros) e apaga a ambiguidade — quem herda, quer
  a morte, e acabou.
- **(3) O escândalo: ele ameaçava tornar público o noivado.** Interessante e **caro**: pede
  história antiga contada em algum lugar, e colide com o `escandalo_gravidez` do gerador, que
  já toca essa nota.

### (b) Onde nasce a carta do salário retido de Davey?

- **(1) No púlpito de ordens da oficina, no livro de pagamentos.** *Recomendada.* O lugar já
  existe (`pt_oficina_pulpito`), a prosa dele já fala de recibos espetados no prego, e a carta
  nasce de papel — não da boca do menino. **Isso importa por causa da G7:** o móbil chega ao
  jogador por documento, e Davey não precisa de se queixar do patrão para o jogo o ter.
- **(2) Na boca de Davey, na árvore de diálogo.** Mais vivo e mais arriscado: põe o menino a
  falar do próprio móbil, o que a G7 desaconselha e a R6 (que é dona da árvore) teria de
  refazer.
- **(3) No posto, pela boca de Wycliffe.** Barato e frouxo: o guarda não teria por que saber
  do salário de um aprendiz.

### (c) A R5 planta a carta que o 2.º degrau do confronto de Walter vai cobrar (D3)?

- **(1) Não; a R6 planta e colhe.** *Recomendada.* A D3 é matéria de confronto, e o confronto
  é da R6. Plantar aqui obriga a R6 a herdar uma carta que ela não desenhou, e gasta orçamento
  que a R6 pode precisar.
- **(2) Sim, e a R6 só a lê.** Deixa a R6 mais leve, mas compromete uma das seis cartas antes
  de a R6 saber se precisa dela.

### (d) A agiotagem ganha carta própria?

- **(1) Não: entra pela prosa e pelos móbeis que ela explica.** *Recomendada.* Custa **zero
  cartas**, não entrega conclusão nenhuma, e faz os móbeis existentes ficarem melhores sem os
  tocar.
- **(2) Sim, uma carta de caderneta de empréstimos no posto.** Legível e cara: gasta 1 das 6 e
  arrisca virar exposição («o morto era agiota»), que é o que o guia de estilo §2 proíbe.

---

## 6. Guardas

**GR5-1.** Teto de cartas respeitado: o catálogo não passa de **46** com `ev_algor` contado.
Verificação automatizada no `qa.mjs` (a guarda **GR4-1** já existe e imprime a conta). *(G11)*
> *Emenda de 26/07/2026 (OS-R8, Fase 4): a **GR4-1 foi removida** — cobrava `<= 46`, que a
> GR7-7 implica ao cobrar `=== 42`. A conta impressa, que era o que a GR4-1 tinha de próprio,
> passou para o rótulo da GR7-7, e o teto da G11 continua com asserção própria lá.*

**GR5-2.** Nenhuma carta nova em `temporal` ou `causal`. A guarda **GR4-2** já congela o
conjunto por id — se a R5 acrescentar carta física, ela reprova sozinha. *(G1)*

**GR5-3.** **Todo suspeito tem carta de móbil.** Asserção nova: para cada id em
`seed.perifericos` mais o réu, existe ao menos uma carta com `subDominio: 'motivo'` e
`ligadoA` apontando-o. É a decisão S2 virando guarda.

**GR5-4.** **Paridade de móbil.** O réu **não é o máximo** em motivos distintos por suspeito.
Provado por asserção, com os números impressos. *(G3 — o culpado não recebe marca que os
inocentes não recebam)*

**GR5-5.** **Menoridade.** Davey não ganha conteúdo de outra natureza; o móbil dele é
económico e só, em qualquer tom e em qualquer variante. *(G7)*

**GR5-6.** As cartas de móbil dos inocentes carregam `isca: true`; a do réu, não. E nenhuma
prosa chaveia no bit `culpado`. *(G3, S2)*

**GR5-7.** O gerador e o banco ficam fora do diff; `sha256` intacto. *(G12)*

---

## 7. Gate

**Gate global** (OS-R0 §7): `npm run lint:prosa` · `node scripts/qa.mjs` ·
`node scripts/qa-ui.mjs` · `npm run build`.

**Gate específico:**

1. **Pipeline `revisar-prosa`** com zero achados bloqueantes. Regra do `CLAUDE.md`. *(A R3 e a
   R4 reprovaram na primeira passada, cada uma por revisor diferente. Correr os três não é
   cerimónia.)*
2. **Contagem de cartas** antes e depois, com o teto e o saldo declarados no relatório — é o
   dado que a **R6** vai ler primeiro.
3. **Telemetria da paridade** (Fase 0) publicada na ata, com as duas colunas.
4. **Os quatro perfis** continuam a dar os quatro desfechos. As horas de hoje são
   **18h00 · 18h00 · 14h00 · 13h00**; se a R5 não criar nó novo — e não deve —, elas não
   mudam, e isso confirma-se em vez de se assumir.
5. **Diff:** `src/gerador/`, `casos_gerados.js` e `casos_indice.js` fora dele.

---

## 8. Ata

Modelo em OS-R0 §9. Acrescentar:

- Os martelos do §5 e o que se escreveu por causa deles.
- **O orçamento gasto e o que sobra** para a R6 — em número, no corpo da ata.
- **As duas colunas da paridade**, antes e depois.
- O parecer do pipeline, com os achados não-bloqueantes e a OS que os herda.
- **Aberto para a OS seguinte:** o que a R6 herda de orçamento; a D3 e o `apontadaPor`; e a
  fila da R8 e da R9 tal como a ata da OS-R4 a deixou.
