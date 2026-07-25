# OS-R1 — Mapa de ocorrências

**Produto da Fase 1.** Sem este mapa, as fases 2–6 não abrem (OS-R1 §3).
Levantado em 25/07/2026 contra a árvore do ramo, com varredura de
`delegad|delegaci|alcott|constable` em `src/**` e `scripts/**`
(`*.js`, `*.jsx`, `*.mjs`), mais o banco gerado contado à parte.

**Grafia martelada do nome do mestre: `Abbot`.** Confirmada pelo utilizador no
arranque desta OS. A premissa do §0 da OS — «a KB do projeto regista `Abbott`» —
**não se confirma nesta árvore**: o único acerto de `abbot` em `docs/` é
*Abbotsbury*, topónimo citado em `kb-mundo-vitoriano/arquitetura-em-detalhe.md`
como exemplo de *tithe barn*, e não o nome de uma pessoa. Não havia conflito a
resolver; havia uma string a fixar. Fixada.

---

## 1. Os baldes

A OS previa três. São quatro, porque a árvore tem uma classe que os três não
arrumam: comentários de código, que não chegam ao jogador mas descrevem o que
chega.

| Balde | O que é | Nesta OS |
|---|---|---|
| **V** | Texto que chega ao jogador | **Renomeia-se** |
| **T** | Id, chave de objeto, nome de variável, nome de ficheiro, sal de hash | **Não se toca** (GR1-2) |
| **C** | Comentário de código | Acompanha o balde V quando descreve texto visível; fica intacto quando descreve id do balde T |
| **H** | Atas, playtests, relatórios datados | **Não se reescreve** (GR1-3) |

---

## 2. O achado que corrige o §2 da OS

A OS-R1 §2 declara: *«O achado que governa esta OS: 257 das ocorrências estão no
banco gerado. Editá-las à mão destrói o replay byte a byte. Elas saem do gerador,
e só de lá.»* — e a G12 da mestra qualifica-as como «257 ocorrências **só de
vocabulário policial**».

**Contadas uma a uma, as 257 são a mesma string, e é um id.** Nenhuma é prosa.

```
$ node -e '…conta ocorrências de /delegad|delegaci|alcott/i em casos_gerados.js…'
total: 257   ·   todas: "delegacia"
```

Os contextos, agrupados:

| Contexto | n |
|---|---|
| `"localidade": "delegacia"` (campo de carta) | 105 |
| `{ "id": "delegacia", "rotulo": … }` (nó do mapa) | 31 |
| `{ "id": "delegacia", "rotuloMesa": … }` (localidade) | 31 |
| `"delegacia": { "w": …, "chamines": … }` (volume do diorama) | 30 |
| `"delegacia": { "x": …, "z": …, "predio": "delegacia" }` (posição) | 2 |
| restantes chaves e referências de id | 58 |

**Consequência.** O id `delegacia` está **fora de escopo por decisão expressa**
(OS-R1 §1: *«O id de localidade `delegacia` não muda nesta OS. É propriedade da
OS-R2»*). Logo as 257 ocorrências do banco estão fora de escopo, e a Fase 3
(regeneração) tem de produzir um banco **byte a byte idêntico**, não um banco
com vocabulário trocado.

Isto não esvazia o gate de determinismo do §5 — inverte-lhe o sinal. O passo 1
deixa de ser «prova que a única diferença é o vocabulário» e passa a ser a prova
mais forte disponível: **`sha256sum` idêntico**. Ver §6 deste mapa.

---

## 3. O segundo achado: o gerador já tem política de vocabulário, e é outra

O balde V dentro de `src/gerador/` é **vazio**. As 46 ocorrências de
`delegad|delegaci` nesses ficheiros são, sem exceção, id (`'delegacia'` como
localidade, acomodação e trabalho), nome de variável (`SOBRENOMES_DELEGADO`,
`delegaciaLoc`), string de proveniência de KB, comentário, ou — uma vez — **sal
de hash**.

O vocabulário policial que o gerador **mostra** é outro, e é deliberado:

```js
// src/gerador/dialogos_gerados.js:127-129
// … reservando "constable" ao oficial do caso (o que convoca o …
'constable do condado': 'guarda do condado',
```

`constable` (1 644×) e `Constable` (364×) no banco, `O Posto do Constable` como
rótulo de mesa, `A carta do Constable` como título. Essa escolha está lavrada em
`docs/kb-medicina-legal/inquerito-e-policia.md` §5, linha da tabela de tradução:

> | Constable / Superintendent | "guarda" / "delegado" | **manter posto inglês** | **B** — a hierarquia inglesa é específica; glosar |

E a `docs/biblia-de-vozes.md` §Wycliffe fecha o raciocínio: *«"Delegado" é a
**glosa vernácula** da vila; a tabela de tradução manda manter o posto inglês
grifado.»*

**Leitura adotada.** A D11 troca a **glosa vernácula** — `delegado`, que soa a
polícia brasileira do século XX. Não toca no **posto inglês lavrado**, que é
`constable` e que a KB manda preservar. O gerador só usa o posto inglês. Logo o
gerador não tem nada a renomear nesta OS.

**A glosa escolhida mudou a meio da OS, e o registo fica.** A primeira redação
desta OS escreveu **`condestável`**, e a prosa chegou a ser commitada assim
(`a38bcd9`, `2add757`). O parecer do `perito-forense` derrubou a escolha com
prova de época: em português, *condestável* nomeou o **Condestável do Reino**
(1382, a segunda figura da hierarquia militar depois do rei) e depois o **chefe
de artilharia**; o **Caldas Aulete**, dicionário contemporâneo a 1893, regista
cinco acepções e **nenhuma policial**. Sobre o homem que a KB define como «o
homem de ronda; a base da pirâmide», era inflação de patente. O utilizador
decidiu, com o parecer à frente: passa a **`guarda`**, que é a **Opção A** da
mesma tabela de tradução da KB, e o lugar passa a **`o posto`**.

**Divergência assumida e registada:** o caso-escola diz «guarda» onde o caso
gerado diz «constable». É a diferença entre a Opção A e a recomendação B da mesma
linha da tabela — divergência de superfície, não de facto. Não se resolve aqui: a
mestra põe a herança dos padrões da reforma pelo gerador na **OS-R9** (OS-R0 §8),
e uniformizar reescreveria ~2 000 strings de um produto de 2,3 MiB sob guarda da
G12. Fica **aberto para a OS-R9**.

**Consequência da escolha, a vigiar:** `guarda` passa a nomear **só quem tem a
patente** — Wycliffe e o guarda Tobin. O homem posto à porta da relojoaria passou
a ser «um homem», para que a palavra não signifique duas coisas na mesma cena
(`abertura.js:60,75,84`, `localidades.js:28`). Fica de pé a questão de fundo, que
o `perito-forense` levantou e esta OS não resolve: um posto de vila é de **um
homem só**, e Briarstone tem dois. **Aberto para a OS-R4.**

---

## 4. Balde V — o que se renomeia

44 ocorrências, em 8 ficheiros. Todas em `src/`.

### 4.1 `src/data/abertura.js` — 20 ocorrências

| Linha | De | Para | Nota |
|---|---|---|---|
| 20 | `Dr. Alcott` | `Dr. Abbot` | |
| 32 | `Dr. Alcott` | `Dr. Abbot` | |
| 38 | `O telegrama do Dr. Alcott` | `O telegrama do Dr. Abbot` | título |
| 46 | `ALCOTT` | `ABBOT` | assinatura do fio, em maiúsculas |
| 49 | `Dr. Alcott` | `Dr. Abbot` | conteúdo **intacto** (Fase 4, nota 2) |
| 51 | `Ler a carta do delegado` | `Ler a carta do guarda` | rótulo de botão |
| 55 | `A carta do Delegado` | `A carta do Guarda` | título |
| 59 | `Dr. Alcott`, `qualidade de delegado`, `a esta delegacia` | `Dr. Abbot`, `qualidade de guarda`, `a este posto` | conteúdo **intacto** (Fase 4, nota 2) |
| 60 | `Lemuel Wycliffe, Delegado` | `Lemuel Wycliffe, guarda` | assinatura |
| 63 | `O delegado escreveu ao Dr. Alcott, e o Dr. Alcott` | `O guarda escreveu ao Dr. Abbot, e o Dr. Abbot` | |
| 75 | `Dr. Alcott` ×2 | `Dr. Abbot` ×2 | |
| 85 | `O Delegado Wycliffe` | `O Guarda Wycliffe` | |
| 86 | `Dr. Alcott` | `Dr. Abbot` | |
| 87 | `Dr. Alcott` | `Dr. Abbot` | |
| 90 | `Ouvir o delegado` | `Ouvir o guarda` | rótulo de botão |
| 94 | `O relato do Delegado Wycliffe` | `O relato do Guarda Wycliffe` | título |
| 98 | `Dr. Alcott` | `Dr. Abbot` | |
| 111 | `Dr. Alcott` | `Dr. Abbot` | |
| 123 | `passou na delegacia para lavrar queixa` | **reescrita D11** | ver §5 |
| 139 | `Assistente do Dr. Alcott` | `Assistente do Dr. Abbot` | |

### 4.2 `src/data/localidades.js` — 5 ocorrências

| Linha | De | Para |
|---|---|---|
| 27 | `O Delegado Wycliffe mandou` | `O Guarda Wycliffe mandou` |
| 129 | `rotuloMesa: 'A Delegacia'` | `rotuloMesa: 'O Posto do Guarda'` |
| 130 | `titulo: 'Arquivos da Delegacia de Briarstone'` | **reescrita D11** — ver §5 |
| 131 | `subtitulo: 'Delegado Lemuel Wycliffe'` | `subtitulo: 'Guarda Lemuel Wycliffe'` |
| 134 | `A delegacia é uma sala única…` | **reescrita D11** — ver §5 |

O **id** da linha 128 fica `delegacia`. É da OS-R2.

### 4.3 Restantes

| Ficheiro:linha | De | Para |
|---|---|---|
| `src/data/mapa.js:32` | `— delegacia, estalagem, loja, moinho` | `— o posto do guarda, estalagem, loja, moinho` |
| `src/data/mapa.js:83` | `rotulo: 'A Delegacia'` | `rotulo: 'O Posto do Guarda'` |
| `src/data/aparencias.js:144` | `'Delegado Wycliffe'` | `'Guarda Wycliffe'` |
| `src/data/dialogos.js:420` | `lavrei termo na delegacia` | **reescrita D11** — ver §5 |
| `src/store/jogo.js:72` | `espera na delegacia` | **reescrita D11** — ver §5 |
| `src/components/Abertura.jsx:77` | `Perguntas ao Delegado` | `Perguntas ao Guarda` |
| `scripts/lint-prosa.mjs:553` | `aberto na delegacia` (fixture de autoteste) | `aberto em casa do Wycliffe` |
| `scripts/demo-interferencia.mjs:72` | `o testamento aberto na delegacia` | `o testamento aberto em casa do Wycliffe` |

As duas últimas não são prosa de jogo — são cordel de teste e de demonstração.
Renomeiam-se para que o passo 3 do gate (§5 da OS) saia limpo e para que
ninguém, daqui a três meses, leia o fixture como vocabulário vivo.

---

## 5. As cinco frases que a D11 obriga a reescrever

A D11 existe porque `delegacia` não se substitui por decalque. Onde o texto
dizia «na delegacia», a frase reescreve-se para a coisa real: a sala da frente
da casa do guarda, com o arquivo da vila numa cômoda de cozinha. Um
find-and-replace por «no posto do guarda» **não cumpre a D11** — cumpre a letra
e falha o motivo.

*(Nota de língua: a OS está escrita em português europeu; a prosa do jogo é
PT-BR por regra do `CLAUDE.md`. «cómoda» entra como **cômoda**.)*

| # | Onde | Antes | Depois (entregue) |
|---|---|---|---|
| 1 | `localidades.js` prosa | «A delegacia é uma sala única, com cheiro de tinta e turfa. Wycliffe abre os armários…» | «O posto de Briarstone é a sala da frente da casa do guarda: mesa de tábua, duas cadeiras e uma cômoda de cozinha em que o arquivo da vila ocupa as gavetas da roupa. Cheira a tinta e a turfa. Wycliffe abre-as…» |
| 2 | `localidades.js` título | «Arquivos da Delegacia de Briarstone» | «O Posto do Guarda — A Sala da Frente» |
| 3 | `abertura.js` (Wycliffe) | «…e ainda passou na delegacia para lavrar queixa.» | «…e ainda me bateu à porta para lavrar queixa.» |
| 4 | `dialogos.js` (Caleb Grey) | «…lavrei termo na delegacia…» | «…lavrei termo em casa do Wycliffe…» |
| 5 | `store/jogo.js` | «A resposta ao telegrama espera na delegacia…» | «…espera no posto do constable…» — **ver a correção abaixo** |

**Correção de classificação na frase 5.** O mapa arrumou `store/jogo.js:72` como
balde V *do caso-escola*. Está errado, e o `fiscal-continuidade` provou-o: a ação
`telegrafo` é acoplada pelo gerador (`pacote_gerado.js:2461`) e a localidade do
caso-escola tem `acoesEspeciais: []` — **a string só renderiza em caso gerado**,
onde o lugar chama-se «O Posto do Constable». Por isso ela recebe o vocabulário do
gerador, não o do caso-escola. Mesma razão para o cordel de
`demo-interferencia.mjs`.

Três dessas cinco frases foram ainda corrigidas no parecer do `editor-critico`:
a nº 1 dizia «o expediente é a sala» (expediente é o horário, não o cômodo) e «os
autos» (peça de processo judicial — vocabulário do foro brasileiro, e um constable
de vila não instrui processo); a nº 3 repetia `veio + infinitivo` em frases
seguidas; a nº 4 punha perífrase de repartição na boca de um moleiro que, doze
linhas abaixo, já nomeia o homem («diante do próprio Wycliffe»).

---

## 6. Balde T — o que fica, e porquê

Listado aqui para cumprir a exigência do §7 da OS («a lista de ids do balde T
preservados, com justificação»). Agrupado por razão.

### 6.1 O id `delegacia` e tudo que o referencia — **propriedade da OS-R2**

| Ficheiro | Linhas |
|---|---|
| `src/data/localidades.js` | 128 |
| `src/data/cartas.js` | 372, 387, 405, 419, 436, 451, 473 (campo `localidade`) |
| `src/data/mapa.js` | 82 |
| `src/data/mapa_espacial.js` | 31, 193 |
| `src/data/aparencias.js` | 155 |
| `src/store/jogo.js` | 63 |
| `src/components/FundoCena.jsx` | 33, 83 |
| `src/components/diorama/DioramaVila.jsx` | 228, 229 |
| `src/components/diorama/GuardaDelegacia.jsx` | 12 |
| `src/gerador/pacote_gerado.js` | 408, 597, 1453, 1454, 1790, 1820, 1835, 1969, 2091, 2460, 2461 |
| `src/gerador/ponte_caso.js` | 221, 509 |
| `src/gerador/espaco.js` | 125, 126 |
| `src/gerador/cidade.js` | 88, 143, 162 |
| `src/gerador/interiores.js` | 98, 211 |
| `src/gerador/arquetipos.js` | 672, 673 |
| `src/gerador/dialogos_gerados.js` | 1219, 1223 |
| `scripts/qa.mjs` | 163, 213, 242, 287, 312, 319, 370, 1374, 3545, 3734, 3736, 4061 |
| `scripts/lib/perfis.mjs` | 59, 68 |
| `scripts/lint-prosa.mjs` | 509 |
| `src/data/casos_gerados.js` | 257 ocorrências (produto — G12) |

### 6.2 Chave de personagem — `delegado_wycliffe`

`src/data/aparencias.js:112,155` · `src/data/papeis.js:141` ·
`scripts/qa.mjs:697,826`. É chave de objeto lida por `papeis.js` e por
`aparencias.js`; renomear é mudança de esquema, não de vocabulário.

### 6.3 Nome de ficheiro e de componente — `GuardaDelegacia.jsx`

`src/components/diorama/GuardaDelegacia.jsx` (ficheiro, e o
`export default function GuardaDelegacia`) · `DioramaVila.jsx:17` (o import).
A GR1-2 proíbe renomear nome de ficheiro nesta OS.

### 6.4 Sal de hash — o mais perigoso da lista

```js
// src/gerador/pacote_gerado.js:2233
const delegado = SOBRENOMES_DELEGADO[hashString(`${sal}|delegado`) % SOBRENOMES_DELEGADO.length];
```

A string literal `|delegado` é **entrada de `hashString`**. Trocá-la por
`|condestavel` mudaria o sobrenome sorteado do policial em **todas as seeds do
banco** — 2,3 MiB de produto a mexer-se sem que uma linha de vocabulário
mudasse. É a classe exata de erro que o §5 da OS manda procurar. **Não se toca,
nesta OS nem na R9.** Se algum dia o nome da variável mudar, o sal fica.

Pela mesma razão ficam `SOBRENOMES_DELEGADO` (`pacote_gerado.js:95`,
`scripts/lib/monotonia.mjs:15,27`) e `delegaciaLoc`
(`pacote_gerado.js:2460-2461`): nomes de variável não chegam ao jogador.

### 6.5 Falso positivo — `src/logic/veredicto.js:41`

```js
// Duas janelas se sobrepõem? (Delegado à interseção de tempo_morte.js —
```

Aqui `Delegado` é particípio do verbo **delegar**, não o posto policial. Uma
renomeação mecânica escreveria «Condestável à interseção» e produziria uma linha
sem sentido. **Fica.**

### 6.6 O vocabulário do gerador — `constable`

Todas as ocorrências de `constable` em `src/gerador/**`, `scripts/qa-ui.mjs:856,
857, 860` e no banco. Fundamentação no §3. **Aberto para a OS-R9.**

---

## 7. Balde C — comentários que acompanham

Renomeiam-se por descreverem texto visível: `abertura.js:3` ·
`Abertura.jsx:8,40,139` · `FalaDoLegista.jsx:13,15` · `ecos_mestre.js:4` ·
`aparencias.js:111` · `lint-prosa.mjs:46,494-495`.

Ficam intactos por descreverem o id do balde T: `cartas.js:369` ·
`DioramaVila.jsx:44,227` · `GuardaDelegacia.jsx:4` · `BotaoTelegrafo.jsx:5` ·
`mapa_espacial.js:189,206` · `pacote_caso.js:289,316` · `mapa.js:31` ·
`qa.mjs:2515,3540,4065` · `perfis.mjs:64` · todos os de `src/gerador/**`.

---

## 8. Balde H — o que não se reescreve

`docs/historico-decisoes.md` (8) · `docs/playtest/**` e `docs/playtest-*` ·
`docs/relatorio-*` · `docs/plano-de-sessoes.md` · `docs/sistema-visual.md` ·
`MORTEM_CONTEXTO.md` · `README.md`.

**Exceção deliberada:** `MORTEM_CONTEXTO.md` e `README.md` não são histórico —
são estado. A ordem permanente do utilizador de 22/07/2026 (`CLAUDE.md`) manda
atualizá-los ao estado entregue no commit final da branch. Recebem o
vocabulário novo **no fecho da reforma**, não a cada OS, para não versionar
oito vezes o mesmo parágrafo.

**Correção deste mapa, feita depois do parecer do `editor-critico`.** A primeira
versão arquivou `docs/biblia-de-vozes.md` (8 ocorrências) no balde H e adiou-a
para a OS-R8. **Errado.** A GR1-3 protege `docs/playtest/`,
`docs/historico-decisoes.md` e relatórios datados — a bíblia não está na lista, e
não é histórico: é **norma viva**, a que o `escritor-prosa` e o `editor-critico`
obedecem em toda OS seguinte. Deixá-la velha faria a próxima OS reintroduzir
`Delegado` e `Alcott` a partir da própria norma. Entra nesta OS: o verbete de
Wycliffe passa a `## Guarda Lemuel Wycliffe`, a linha da assinatura e o
léxico acompanham, a amostra de Silas deixa de dizer «correr à delegacia», e o
parágrafo «Patente (lavrada)» ganha um **registro de divergência assumida**
contra a decisão B da KB (ver §3). A única ocorrência de `Delegado` que fica é a
citação histórica que documenta o que a D11 substituiu.

---

## 9. Contagem de fecho

| Balde | Ocorrências | Ficheiros |
|---|---|---|
| V | 44 | 8 |
| T | 91 + 257 (banco) | 24 |
| C | 20 | 15 |
| H | ~30 | 12 |

O que o passo 3 do gate (`grep -rniI "delegad\|delegaci\|alcott" src/ scripts/`)
deve devolver depois da Fase 4: **apenas balde T e balde C**, e nenhuma
ocorrência de `alcott` de espécie alguma.
