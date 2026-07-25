# OS-R0 — Ordem-Mestra: Reforma de "A Hora Emprestada"

**Tipo:** ordem-mestra. Não se executa; governa.
**Fontes de desenho:** `proposta-adensamento-a-hora-emprestada.md` (v1) e
`proposta-v2-a-hora-emprestada.md` (v2), ambas aceites em bloco, mais as
correções da sessão de 25/07/2026 (coroner, abertura, clímax).
**Ramo:** `claude/mortem-vertical-slice-zzrcto`.

Nenhuma OS-filha executa sem que esta esteja lida. Toda OS-filha cita, no
cabeçalho, as guardas de §3 que lhe são aplicáveis, pelo número.

---

## 1. Objetivo

Reformar o caso-escola em sete OS sequenciais, sem tocar na cadeia física do
crime, e extrair da reforma os padrões que o gerador vai herdar.

**Definição de pronto (global):** o caso-escola joga-se do princípio ao fim nos
três modos, `npm run lint:prosa` sai com zero achados bloqueantes, `qa.mjs` e
`qa-ui.mjs` passam, `npm run build` passa, e a ata está em
`docs/historico-decisoes.md`.

---

## 2. Decisões marteladas

Aceites em bloco pelo utilizador em 25/07/2026. **Fechadas.** Reabrir qualquer
uma exige ata própria.

| # | Decisão | Resolução |
|---|---|---|
| D1 | Agiotagem da vítima | **Entra.** É a espinha do caso. |
| D2 | Onde mora o Livro II | Câmara dos sinos de S. Miguel, quarto sino, rosca esquerda |
| D3 | Walter sabia da mudança do testamento | **Sabia e omite.** Cai no 2.º degrau do confronto |
| D4 | A loja é dele | **Não.** Veio da mulher e reverte. Instalada em Pettigrew |
| D5 | Móbil de Agnes | **Ambíguo**, decidido pelas cartas que o jogador colhe |
| D6 | Davey ganha móbil | **Sim**, `salario_atrasado`, com guarda de menoridade (G7) |
| D7 | Beat 3 | **Nos cinco** |
| D8 | Escada de confronto | **Contador autoral**, não `requerTodas` |
| D9 | O tom ganha peso narrativo | **Sim**, e só narrativo (G4) |
| D10 | Retratos viram carta | **Não.** Prosa e caderneta |
| D11 | Vocabulário policial | **Condestável** + "a casa do condestável". `delegacia` eliminada |
| D12 | O coroner entra | **Sim, fora de cena.** Prazo e autoridade; nunca uma cena |
| D13 | Abertura testemunhal | **Sim**, e vira molde de todos os casos |
| D14 | A caderneta riscada | **Sim, e por Harlan**, não por Abbot (autocensura) |
| D15 | Wycliffe está no livro | **Sim** |
| D16 | Forma da cumplicidade | **Posterior**, dois comprados com a mesma mentira, com fio de coação na Sra. Wick |
| D17 | `apontadaPor` | **Entra** como campo e como sistema |
| D18 | Segundo alvo | **Agnes Rooke** |
| D19 | A cifra | S. MIGUEL · IV · MEIA-VOLTA À ESQUERDA |
| D20 | "A Hora Refeita" | **Congela.** Assume-se a divergência; não bloqueia o tutorial |
| D21 | Nomes | Coroner **Bramwell Foy**; sineiro **Amos Kell** |
| D22 | Onde arde o Livro I | Grelha do escritório, sob a cinza por raspar |
| **D23** | Nome do mestre | **Abbot.** Substitui `Alcott` em toda a base |
| **D24** | Clímax | **Reconstituição**, domingo à noite, na relojoaria. Sem inquérito em cena |
| **D25** | Regra da assinatura | Harlan assina as mortes pequenas em nome de Abbot; nunca assinou uma grande |

**Pendência de execução, não de desenho (bloqueia OS-R1):** a grafia exata do
nome do mestre — `Abbot` ou `Abbott`. A KB do projeto regista `Abbott`; o
martelo desta sessão escreveu `Abbot`. Uma renomeação mecânica precisa da
string exata antes de começar. **Confirmar no arranque da OS-R1.**

---

## 3. Registro de invariantes

Numeradas. Toda OS-filha cita as que lhe tocam. Quebrar uma é motivo de
reversão, não de discussão.

**G1 — A cadeia física é intocável.**
Hora 21h, buril, vermelho-de-polir, lasca de vidro na bainha, roda de contagem,
relógio de bolso, rigor, livor, reação vital. Nenhuma carta nova entra em
domínio `temporal` ou `causal`. Os livros são `comportamental`.

**G2 — Fair-play da incriminação.**
Todo gesto prestável de Silas entra no mesmo lote que a sua refutação física
findável. Sem exceção, sem "na próxima OS".

**G3 — Prosa nunca chaveia no bit `culpado`.**
Nenhum molde de texto pode ramificar em `reuCorreto`. Silas não recebe marca
textual que os inocentes não recebam.

**G4 — Solubilidade.**
Nenhuma prova que o veredicto lê pode depender do tom escolhido, da ordem de
visita, ou de uma personagem opcional. Toda carta decisiva sai em qualquer tom.

**G5 — Estado derivado, nunca oculto.**
Os níveis de exposição (E0/E1/E2) são função pura das cartas possuídas.
Determinístico, auditável, sem flag escondida.

**G6 — O veraz sem crédito aponta, nunca prova.**
As cartas de Amos Kell carregam marca de insuficiência. O motor recusa-as como
nexo e como álibi.

**G7 — Menoridade.**
Davey Tull tem 15 anos. O móbil dele é económico e só. Não é cúmplice, não é
suspeito de facto, e a chave da cifra passa por ele como conhecimento de
ofício. Nenhum conteúdo de outra natureza, em nenhuma OS, em nenhuma variante
de tom.

**G8 — `vozMestre` nunca erra sobre facto físico.**
Abbot pode subestimar suficiência ("isto basta para o júri"). Não pode afirmar
facto falso sobre o corpo.

**G9 — O clímax dramatiza; não prova.**
A reconstituição só rebate a intervenção cuja carta o jogador possui. Sem a
carta, a intervenção fica de pé e alimenta os graus de falha. A cena **nunca**
introduz evidência nova nem contorna o mural de acusação.

**G10 — Sem beco sem saída.**
Davey e Amos são sempre alcançáveis; as cartas-chave da cifra saem em qualquer
tom; nenhuma cadeia de descoberta depende de uma ordem única.

**G11 — Teto de cartas.**
46. Acima disso o mural de acusação satura. Retratos são prosa (D10).

**G12 — O banco gerado não se edita à mão.**
`src/data/casos_gerados.js` (2,3 MiB, 257 ocorrências só de vocabulário
policial) é produto. Toda alteração passa pelo gerador e por
`node scripts/gerar-casos.mjs`.

---

## 4. Sequência, e por que esta ordem

**Revisão da ordem proposta na v2 §16.** A v2 punha a cena única em primeiro e
o vocabulário em segundo. **Inverte-se**, por uma razão técnica:

> Toda OS a partir da terceira escreve prosa nova. Se a renomeação vier depois,
> essa prosa nasce errada e o mapa de ocorrências da renomeação fica velho antes
> de ser usado. Renomear primeiro faz com que tudo o que se escreva a seguir
> nasça correto — e a renomeação é mecânica, verificável por `grep` e por replay,
> o que a torna um bom ensaio do gate de QA antes de começar o trabalho caro.

| Ordem | OS | Estado |
|---|---|---|
| 1.º | **OS-R1** — Vocabulário e nomes | escrita |
| 2.º | **OS-R2** — Cena única | escrita |
| 3.º | OS-R3 — Abertura (testemunhal + pensão + telegrama) | por escrever |
| 4.º | OS-R4 — Elenco e livros (coroner, Amos, Wick, estalajadeiro; Livro I, cuvette, cifra, torre) | por escrever |
| 5.º | OS-R5 — Móbeis e cartas (v1 §3 e §6) | por escrever |
| 6.º | OS-R6 — Exposição e interrogatórios (E0/E1/E2, beat 3, contaminação, alfinetadas, `apontadaPor`) | por escrever |
| 7.º | OS-R7 — A reconstituição (revozação do `monologo.js`) | por escrever |
| 8.º | OS-R8 — Passe editorial e QA de fecho | por escrever |

**Por que R3–R8 não estão escritas.** Não é adiamento: R1 e R2 alteram as
strings e a topologia de localidades que R3–R8 teriam de referenciar. Uma OS
escrita hoje contra a árvore de hoje citaria ids e linhas que R1 e R2 vão
mudar, e chegaria à execução já falsa. **Cada uma escreve-se no fecho da
anterior**, contra a árvore real. É a mesma disciplina que evitou o incidente
do zip, aplicada ao tempo em vez de ao espaço.

---

## 5. Matriz de colisão

Regra dura: **nenhuma OS abre enquanto a anterior não tiver ata.** Sem
paralelismo, em nenhuma circunstância, nesta reforma. As três primeiras linhas
são as perigosas.

| Arquivo | R1 | R2 | R3 | R4 | R5 | R6 | R7 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `casos_gerados.js` (produto) | ⚙ | | | | | | |
| `localidades.js` | ✎ | **✎** | | ✎ | | | |
| `cartas.js` (campo `localidade`) | | **✎** | | ✎ | ✎ | ✎ | |
| `cartas.js` (prosa e tags) | ✎ | | | ✎ | **✎** | ✎ | |
| `abertura.js` | ✎ | | **✎** | | | | |
| `dialogos.js` | ✎ | | | ✎ | | **✎** | |
| `monologo.js` | ✎ | | | | | | **✎** |
| `planta_relojoaria.js` | | **✎** | | | | | |
| `mapa_espacial.js` / `DioramaVila.jsx` | ✎ | **✎** | | ✎ | | | |
| gerador (`*.js` em `src/gerador/`) | **✎** | | | | | ✎ | |
| `lint-prosa.mjs` (allowlist) | ✎ | | ✎ | ✎ | ✎ | ✎ | ✎ |

⚙ = regenerado, nunca editado · ✎ = tocado · **negrito** = dono do arquivo
naquela OS

**Dono do campo `localidade`:** OS-R2, e só ela. R1 não toca ids; muda apenas
strings visíveis. Esta separação existe de propósito para que as duas OS
grandes não colidam.

---

## 6. Namespaces de sal

R1 e R2 não geram conteúdo: são renomeação e topologia. **Não declaram sal.**

A partir de R4, toda OS que introduza variação declara namespace próprio no
seu cabeçalho, no formato `reforma:<os>:<eixo>`. Reservados desde já, para que
nenhuma OS posterior os reutilize:

```
reforma:r4:elenco      reforma:r4:cifra
reforma:r5:mobeis      reforma:r6:exposicao
reforma:r6:alfinetada  reforma:r7:intervencao
```

---

## 7. Gate de QA global

Corre no fecho de **toda** OS desta reforma, sem exceção e sem "esta é pequena":

```bash
npm run lint:prosa          # zero achados bloqueantes
node scripts/qa.mjs         # replay byte a byte
node scripts/qa-ui.mjs
npm run build
```

Acresce, por OS, o gate específico declarado no documento respetivo.

---

## 8. O que NÃO está nesta reforma

Escrito para que nenhuma OS-filha se expanda para aqui sem ata própria:

- O caso gerado "A Hora Refeita" (D20: congelado).
- O pivô de apresentação visual / visual novel.
- A camada psíquica do elenco.
- O bug de `reacao_vital`.
- A reforma do backstory de Harlan além do que D14, D23 e D25 fixam.
- O gerador herdar os padrões (abertura testemunhal, `apontadaPor`, exposição,
  arquétipo do veraz sem crédito). **É trabalho real e fica para uma OS-R9**,
  depois de o tutorial provar os padrões.

---

## 9. Modelo de ata

Cada OS fecha com um bloco neste formato em `docs/historico-decisoes.md`:

```markdown
### <data> — OS-R<n>: <título>

**Decisões aplicadas:** D<n>, D<n>…
**Guardas verificadas:** G<n>, G<n>…
**Arquivos tocados:** <lista>
**Gate:** lint-prosa <resultado> · qa.mjs <resultado> · qa-ui.mjs <resultado> · build <resultado>
**Gate específico:** <resultado>
**Divergências assumidas:** <lista ou "nenhuma">
**Aberto para a OS seguinte:** <lista ou "nada">
```
