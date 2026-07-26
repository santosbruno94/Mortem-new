# OS-R9 · Fase 0 — A telemetria de lote

A Fase 0 das quatro OS anteriores mediu **um caso**: quantos gestos, quantas bocas,
quantas rubricas. Esta mede **um banco**: 31 casos, 155 árvores, 155 suspeitos.

A diferença não é de tamanho, é de natureza, e o §3 da OS já a tinha escrito: aqui um
achado é uma **distribuição**. Nenhuma das medidas abaixo é uma leitura; todas são
contagens sobre o banco embarcado (`src/data/casos_gerados.js`), com as **funções do
motor** onde havia função do motor a usar (`montarDossies`, `corteDeE2`) e com a
**guarda GR8-4 tal como o `qa.mjs` a escreve**, corrida sobre as árvores geradas.

**O lote:** 1 réplica + 20 do pool da comarca + 10 do lote de luta = **31 casos**, 5
suspeitos cada, **155 árvores**. Cartas por caso: **17 a 29**, média 21,5.

---

## 1. A fila do §2, item a item, com o número

| Item | Falta em | Matéria-prima que o pacote já traz |
|---|---|---|
| **2.1** procedência | **31/31 (100%)** | 185 alegações com boca identificável (6,0/caso); **20/31** já têm uma boca respondendo por 2+ |
| **2.2** exposição | **31/31 (100%)** | dossiê derivável em 154/155; mas **46% não alcançam E1** (§2 abaixo) |
| **2.3** veraz sem crédito | **31/31 (100%)** | zero cartas marcadas `insuficiente` no banco inteiro |
| **2.4** móbil por aritmética | **31/31 (100%)** | 31/31 têm carta de móbil; **9/31** já citam livro/conta no rótulo, nenhuma prova por soma |
| **2.5** degrau de confronto | **31/31 (100%)** | `confrontos` não-vazio em **102/155 árvores (66%)**, 111 nós `reacao_*` |
| **2.6** intervenções da noite | **31/31 (100%)** | `RegistroDoCrime.eventos`, com ordem, ator, cômodo, hora e vestígios por evento |
| **2.7** dívida de geografia | — | 3 aberturas cravadas em `src/logic/reconstituicao.js:54-58` |
| **2.8** durável do lavado | **34 classes, ausente** | `instrumento_guardado_umido` existe (o perecível) |
| **2.9** queimados | **34 classes, ambas ausentes** | dossiês de KB escritos; 20 tipos de vestígio em uso no banco |
| **2.10** GR8-4 | **11/31 (35%)** | uma frase, 165 nós `exigencia_*`, 137 sítios |

---

## 2. Os três achados que mudam o plano

### 2.1 A exposição degenera: 46% dos suspeitos gerados não alcançam E1

É o achado caro, e é o inverso do que a R6 mediu no tutorial. A régua da exposição é
relativa por construção — `corteDeE2(n) = ⌈2n/3⌉` —, e foi isso que salvou a paridade
no caso-escola. **No banco gerado o problema não é a paridade: é a granularidade.**

Histograma do dossiê externo dos 155 suspeitos gerados:

| Tamanho do dossiê | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|--:|--:|--:|--:|--:|--:|--:|
| Suspeitos | 1 | **70** | 61 | 12 | 6 | 2 | 3 |

Com dossiê de 1, `corteDeE2(1) = 1`: ter zero é E0, ter a única é E2, **e não há
nada entre as duas**. Somando o único suspeito de dossiê vazio, são **71 de 155
(46%) para quem o E1 não existe**. No tutorial os cinco dossiês são 5 · 4 · 2 · 5 · 3,
e os três níveis são alcançáveis por todos — que é exatamente o que a GR6-5 cobra.

A composição diz por que o dossiê é magro, e a conta fecha sem sobra: **todo suspeito
gerado tem exatamente uma carta que o aponta e nasce na própria árvore dele** (o
`gen_alibi_<id>`), e ela sai do dossiê por definição — álibi não é o perito chegando
sabendo. Das cartas que apontam cada suspeito, 92 dos 155 têm só duas; tiradas o
álibi, sobra uma. As chaves de `reacoesProva` não compensam: **53 árvores têm zero**,
93 têm uma, 9 têm duas.

> **Consequência para a Fase 2:** portar o beat 3 como está entregaria, em quase
> metade do elenco gerado, uma escada de dois degraus vestida de três. A GR9-2
> («paridade por construção, não por contagem») está satisfeita — material
> equivalente dá nível equivalente —, mas a GR6-5 do tutorial, que cobra **os três
> níveis alcançáveis por todos**, cai em 46% se for portada tal e qual. A Fase 2 tem
> de escolher, e é decisão de desenho, não de implementação: engrossar o dossiê
> gerado, ou declarar na guarda que o E1 exige dossiê ≥ 2 e provar que o beat não o
> promete onde ele não existe.

### 2.2 Um terço das árvores geradas não tem confronto nenhum

O §2.5 da OS diz que «as árvores geradas têm confrontos com segunda camada (a S1 pôs
detalhe verificável em todos)». **Contra a árvore real, em todos não é verdade:**

| | |
|---|---|
| Árvores com `confrontos` não-vazio | **102/155 (66%)** |
| Árvores com zero confrontos | **53/155 (34%)** |
| Nós `reacao_*` ao todo | 111 |
| Nós com `degraus` | **0** |

O confronto gerado é bijetivo com a carta (`confrontoDaCarta` só dispara para carta
que toca o suspeito), e um terço dos suspeitos não tem carta que os toque além do
próprio álibi. **Um degrau escrito sobre `confrontos` não existiria em 53 árvores** —
e um degrau que só aparece em dois terços do elenco é telégrafo, não escada: quem o
vir sabe que aquele suspeito tem dossiê.

> **Consequência para a Fase 2:** o degrau e a exposição não são dois itens que
> «andam juntos» por conveniência de agenda — são o **mesmo** item. Os dois padecem
> da mesma escassez, e a mesma matéria-prima os resolve ou não resolve. A Fase 2 é
> uma fase de **densidade de dossiê**, e o beat e o degrau são as duas coisas que ela
> paga depois.

### 2.3 A conta de 55 da R8 é de árvores; os sítios são 137

A R8 fechou dizendo «55 ocorrências, 11 casos, 1 frase». Corrida outra vez com a
guarda tal como o `qa.mjs` a escreve, a decomposição é esta:

| | |
|---|---|
| Casos com repetição verbatim entre nós co-alcançáveis | **11/31 (35%)** — confirma a R8 |
| **Árvores** com furo | **55** — é o número que a R8 publicou |
| Pares (árvore × frase) | **55** |
| **Sítios** (nós que imprimem a frase) | **137** |
| Frases distintas responsáveis | **1** — «Nada de nota.» |
| Nós responsáveis | `exigencia_botas` 55 · `exigencia_antebracos` 52 · `exigencia_maos` 30 |

Os 55 são as 55 árvores dos 11 casos (11 × 5 suspeitos): **todo suspeito de caso com
`gen_sinal_exigivel` tem o furo**. O sistema planta **165 nós `exigencia_*`** (55
árvores × 3 regiões: mãos, antebraços, botas), e **137 deles (83%) trazem a resposta
nula** — só 28 têm marca de verdade a descrever.

Fora da exigência, as 155 árvores saem **limpas**. A R8 estava certa no diagnóstico e
no dedo; o que a medida acrescenta é a escala do sítio, e ela reforça a decisão (a):
uniformizar 137 nós é uma linha isenta por nome; variá-los seria escrever 137
redações de «não há nada aqui» e transformar cada uma num sinal.

---

## 3. O que a medida confirmou sem emenda

- **§2.1:** zero mapas de procedência, como o §2.1 dizia. E a matéria-prima está toda
  lá: 20 dos 31 casos já têm uma boca que responde por duas ou mais alegações — o
  feixe da D16 existe de facto no banco e só não tem quem o registe. A regra de
  `contarVozes` («alegação sem procedência é voz própria») é hoje o *fallback* de
  31 casos em 31, exatamente como a R7 escreveu.
- **§2.3:** zero cartas `insuficiente`. O arquétipo não existe, nem por acidente.
- **§2.6:** zero catálogos de gestos, e o gate deliberado da R7 a funcionar —
  `montarReconstituicao` devolve `null` nos 31.
- **§2.8/§2.9:** 34 classes de vestígio; o perecível está lá, o durável e os dois
  queimados não.

---

## 4. A ordem das fases, depois de medir

A telemetria **não** desmente a ordem escrita, e desmente uma suposição dentro dela.

| Fase | Ordem | O que a medida diz |
|---|---|---|
| 1 — procedência | **mantém** | matéria-prima pronta em 20/31; é a fase mais barata da fila e a base das outras |
| 2 — exposição + degrau | **mantém, e cresce** | os dois itens colapsam num só, e o item é densidade de dossiê, não prosa de beat |
| 3 — intervenções + geografia | **mantém** (decisão (c) do utilizador) | `RegistroDoCrime.eventos` é matéria-prima farta; a dívida de geografia vaza no mesmo commit |
| 4 — arquétipos e classes | **mantém** | quatro capacidades, todas com dossiê de KB escrito; nenhuma depende das anteriores |
| 5 — gate, banco e ata | **mantém** | |

**O que muda é o custo relativo**, e é bom sabê-lo antes: a Fase 2 deixa de ser a
fase média da OS e passa a ser a segunda mais cara, porque a escassez de dossiê que
ela tem de resolver não estava na fila — estava debaixo dela.

---

## 5. Como reproduzir

As medidas saem de contagens diretas sobre `src/data/casos_gerados.js`, com
`montarDossies`/`corteDeE2` de `src/logic/exposicao.js` e a GR8-4 copiada verbatim de
`scripts/qa.mjs`. A Fase 5 leva as que viram **guarda** para o `qa.mjs`, em banda,
no molde das GE2/GE5/regime-palco — que é como este repositório prova coisa sobre
lote.
