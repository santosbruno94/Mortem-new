# OS-R4 — Elenco e Livros

**Mestra:** OS-R0. **Decisões:** D2, D6, D15, D16, D19, D21, D22.
**Guardas:** G1, G2, G4, G6, G7, G10, G11, G12.
**Pré-requisito:** OS-R3 com ata (fechada em 25/07/2026). **Não abre antes.**
**Namespace de sal:** `reforma:r4:elenco` · `reforma:r4:cifra` (reservados na OS-R0 §6).

Escrita no fecho da OS-R3, contra a árvore real, como a OS-R0 §4 manda.

---

## 1. O que esta OS resolve

Três coisas, e a ordem entre elas importa porque a terceira gasta o que as duas
primeiras deixarem.

**(a) O caso não tem prova documental do móbil.** O móbil de Silas é o silenciamento:
ele trocava ouro dos consertos por metal vil e foi descoberto. Hoje isso vive em
`ev_livro_ordens` e no que os interrogatórios sugerem. As decisões **D22** e **D2**
descrevem uma prova em dois tempos que ainda não existe no jogo: **o Livro I arde na
grelha do escritório, sob a cinza por raspar**, e **o Livro II está na câmara dos sinos
de S. Miguel, no quarto sino, rosca esquerda**. Um foi destruído por quem tinha razão
para o destruir; o outro sobreviveu porque o morto o escondeu onde só um relojoeiro
pensaria em esconder.

**(b) O elenco tem gente que existe só como linha de depoimento.** Amos Kell, o sineiro
(**D21**), não existe de todo — e é ele quem carrega o arquétipo do **veraz sem crédito**
(**G6**): diz a verdade e o motor recusa-o como nexo e como álibi. A Sra. Wick existe
como uma frase no registro do guarda (`dep_mulher_viela`) e a **D16** dá-lhe um fio de
coação que nada no jogo mostra. O estalajadeiro existe como corroboração
(`corrob_estalajadeiro`) e não tem boca.

**(c) O posto de Briarstone tem dois homens, e um posto de vila é de um homem só.**
Registado na ata da OS-R1, herdado pela R2 e pela R3, e sem dono até agora. Wycliffe é o
constable; **Tobin** assina o registro da ronda que produz `dep_visto_vivo` — uma carta
que o veredicto lê. Não é detalhe de cor: é a carta que fixa o piso da janela.

---

## 2. O orçamento de cartas — a restrição que rege esta OS

| | |
|---|---|
| Catálogo hoje | **35** em `cartas.js` + `ev_algor` de runtime = **36** |
| Teto (G11) | **46** |
| Livre | **10** |
| A dividir entre | **R4** (esta) · **R5** (móbeis e cartas) · **R6** (exposição) |

**Não há folga para generosidade.** O teto não é decorativo: acima dele o mural de
acusação satura, e o mural é onde o jogo é jogado. Esta OS declara o seu consumo no §3 e
**não o excede sem ata própria**. Se a R5 precisar de mais do que sobrar, a decisão é de
mesa — cortar carta velha ou subir o teto —, e é decisão do utilizador, não de execução.

**Restrição de domínio, herdada da G1 (a cadeia física é intocável):** *nenhuma carta
nova entra em `temporal` ou `causal`.* Os livros, a cifra e o elenco são
**`comportamental`**. A hora, a arma e o mecanismo do crime não se tocam nesta OS — nem
por acréscimo.

---

## 3. Escopo

### 3.1 Os livros (D22, D2, D19)

| Peça | Onde | Domínio | Cartas |
|---|---|---|---|
| **Livro I — o que ardeu** | Grelha do escritório, sob a cinza por raspar (sub-local `escritorio`) | `comportamental` | 1 |
| **A cifra** | Ver §5, ponto de decisão (a) | `comportamental` | 1 |
| **Livro II — o que sobreviveu** | Câmara dos sinos de S. Miguel, quarto sino, rosca esquerda | `comportamental` | 1 |

**A cinza já está plantada.** A prosa do sub-local `escritorio` diz, desde antes desta
reforma: *«Na repisa, um cachimbo de barro pousado de lado e a cinza por raspar na
grelha.»* O Livro I nasce **onde a prosa já apontou** — é fair play retroativo de graça,
e não custa uma linha de ambientação nova.

**O Livro I não prova; acusa a destruição.** O que sobra de um livro queimado é papel
carbonizado com fragmento de pauta e de letra. A carta diz que **houve** um registro e
que **alguém o queimou**; não diz o que ele registava. É a fome que manda o jogador
atrás do Livro II. *(Precisão do que se lê em papel carbonizado: validar com o
`perito-forense` contra `kb-medicina-legal/` — o que a época conseguia recuperar de um
documento queimado, e o que não conseguia.)*

**O Livro II prova.** É o registro paralelo do morto: consertos entrados, ouro pesado à
entrada e à saída, a diferença anotada mês a mês. É a carta de móbil que o caso não tem.

### 3.2 A torre de S. Miguel e Amos Kell (D21, G6)

A torre é **nó novo do mapa**, no grupo `vila`. O sineiro Amos Kell recebe ali.

**Amos é o veraz sem crédito (G6), e é aqui que o arquétipo nasce no jogo.** Ele viu
alguma coisa e diz a verdade; o motor **recusa as cartas dele como nexo e como álibi**,
por marca de insuficiência nas `tagsOcultas`. Não é bug, é desenho: o jogador aprende que
uma testemunha pode estar certa e não servir. A marca já tem precedente no catálogo — a
carta do moço do padeiro (`dep_avistamento_padeiro`) e a da Sra. Wick já vivem nessa
zona; o que a R4 acrescenta é o **arquétipo declarado**, com a marca legível.

**Por que ele tem crédito nenhum:** bebe, e a vila sabe. *(Ver §5, ponto (c): o motivo do
descrédito é decisão de desenho e tem consequência de tom.)*

### 3.3 A Sra. Wick e o estalajadeiro (D16)

**Nenhum dos dois vira nó de mapa, e nenhum dos dois ganha árvore de diálogo.** A D16 diz
que a cumplicidade é **posterior** — dois comprados com a mesma mentira, com fio de
coação na Sra. Wick. O que esta OS faz é **mostrar o fio**, não explicá-lo: a carta dela
que já existe (`dep_mulher_viela`) ganha o que lhe falta para o jogador sentir que aquela
senhora foi apertada por alguém. Custo pretendido: **0 a 1 carta**.

O estalajadeiro fica como está. Tem função (corrobora) e não precisa de boca.

### 3.4 O posto de um homem só

**O problema:** Briarstone tem Wycliffe e Tobin, e um posto de vila de 1893 é de um
constable. Ver §5, ponto (b) — é o martelo mais barato desta OS e o que mais prosa
toca.

**A carta que está em jogo:** `dep_visto_vivo` («Do registro da ronda: às oito em ponto
da noite de sexta, o guarda Tobin viu o relojoeiro… correr as tampas da vitrine e
acenar-lhe pelo vidro»). Ela fixa o **piso** da janela e o veredicto lê-a. Seja qual for
o martelo, a **carta não muda de função, de tags nem de disponibilidade** *(G4)* — muda,
quando muito, a letra de quem a lavrou.

### 3.5 Fora de escopo

- **O coroner não ganha cena.** A D12 é definitiva: prazo e autoridade, nunca uma cena.
  Foy continua a existir em papel timbrado, e a OS-R3 já lhe deu o papel.
- **Verbete de «coroner» no glossário** — entra aqui, de carona no pipeline (é a única
  peça de prosa de glossário desta OS). Não é carta e não conta no orçamento.
- `interrogatorio_silas` como localidade anómala — **OS-R6**. Registar, não tocar.
- Qualquer mudança em `temporal`/`causal`, no gerador ou no banco. *(G1, G12)*

---

## 4. Fases

**Fase 1 — A cinza e o Livro I.** A carta que nasce na grelha do escritório. Nenhuma
localidade nova; o sub-local já existe desde a OS-R2.

**Fase 2 — A cifra.** Onde ela está gravada e como se lê (§5a). A **G7** rege a parte de
Davey: a chave passa por ele como **conhecimento de ofício** — o que é uma cuvette, que
ela abre, que se grava por dentro —, e nada de outra natureza, em nenhum tom.

**Fase 3 — A torre, Amos e o Livro II.** Nó novo, custo de viagem, o sineiro e a carta
que prova. A **G10** manda: Amos é sempre alcançável e as cartas-chave da cifra saem em
qualquer tom.

**Fase 4 — O posto de um homem só, e a Sra. Wick.** Prosa, e só prosa.

**Fase 5 — Gate e ata.**

---

## 5. Pontos de decisão — três, e todos antes da Fase 1

### (a) Onde está gravada a cifra?

A **D19** fixa o texto — `S. MIGUEL · IV · MEIA-VOLTA À ESQUERDA` — e cala sobre o
suporte.

- **(1) Na cuvette do relógio de bolso do morto.** *Recomendada.* A cuvette é a tampa
  interna de guarda-pó de um relógio de bolso: abre-se com a unha, e é onde um gravador
  põe o que não quer à vista. O relógio já está no jogo (`ev_relogio_bolso`, na corrente
  do colete, com gesto próprio de dar corda). A cifra vira uma **segunda camada do mesmo
  objeto** — o jogador já o tem na mão e não sabe que ele tem fundo. Custa **1 carta** e
  nenhuma localidade. E fecha o tema do caso: o homem escondeu a prova dentro de um
  relógio, e o assassino emprestou uma hora a outro.
- **(2) No livro-razão aberto sobre a escrivaninha.** Mais fácil de achar, mais banal, e
  desperdiça o ofício da vítima.
- **(3) Num papel dobrado na carteira.** Barato e sem graça; nenhum relojoeiro faria
  assim.

### (b) O que se faz com o guarda Tobin?

- **(1) Tobin é o constable do beat vizinho.** *Recomendada.* Historicamente limpo: os
  beats de condado eram extensos e vizinhos cobriam-se. A ronda das oito da noite passa a
  ser dele **de passagem**, o que explica por que ele vê a vitrine e não fica. Custo:
  duas ou três frases de prosa; `dep_visto_vivo` mantém tudo.
- **(2) Tobin é *special constable*, juramentado às pressas.** Também de época, e
  acrescenta uma cor útil (a vila improvisa quando o caso a excede). Mas um special
  juramentado **depois** da morte não podia ter lavrado a ronda de sexta às oito — e a
  carta é de sexta. Exige mexer na carta, o que a G4 desaconselha.
- **(3) Tobin desaparece; a ronda é de Wycliffe.** O mais barato em prosa e o pior em
  ficção: Wycliffe passa a ser testemunha do próprio caso, o que enfraquece o papel dele
  de *coroner's officer* que a OS-R3 acabou de arrumar.

### (c) Por que Amos Kell não tem crédito na vila?

O arquétipo (G6) exige que ele seja **veraz** e **descartável**. O motivo escolhido tem
consequência de tom, e é escolha de autor, não de execução.

- **(1) Bebe, e a vila sabe.** *Recomendada.* Clássico, legível sem explicação, e dá ao
  jogador a tentação certa (descartá-lo cedo é o erro que a lição do arquétipo pune).
- **(2) É velho e confunde as horas.** Mais gentil, mas colide com
  `linha_tempo_nao_confiavel`, que já é um trait do gerador — repetiria uma nota já
  tocada.
- **(3) Mentiu uma vez, há anos, e a vila não esqueceu.** O mais interessante e o mais
  caro: precisa da história antiga contada em algum lugar, e isso é prosa que o
  orçamento desta OS não previu.

---

## 6. Guardas

**GR4-1.** Teto de cartas respeitado: o catálogo não passa de **46** com `ev_algor`
contado. Verificação automatizada no `qa.mjs`. *(G11)*

**GR4-2.** Nenhuma carta nova em `temporal` ou `causal`. A cadeia física — hora, buril,
vermelho-de-polir, lasca de vidro, roda de contagem, relógio de bolso, rigor, livor,
reação vital — sai desta OS byte a byte. *(G1)*

**GR4-3.** As cartas de Amos carregam marca de insuficiência, e o motor **recusa-as como
nexo e como álibi**. Provado por asserção no `qa.mjs`, não por leitura. *(G6)*

**GR4-4.** Davey não ganha conteúdo de outra natureza. A chave da cifra passa por ele
como conhecimento de ofício, em **qualquer tom**, e ele continua a não ser cúmplice nem
suspeito de facto. *(G7)*

**GR4-5.** Sem beco sem saída: a torre é alcançável, Amos é sempre alcançável, e as
cartas-chave da cifra saem em qualquer tom e em qualquer ordem de visita. *(G10, G4)*

**GR4-6.** `dep_visto_vivo` mantém id, tags, domínio e disponibilidade. *(G4)*

**GR4-7.** O gerador e o banco ficam fora do diff; `sha256` intacto. *(G12)*

---

## 7. Gate

**Gate global** (OS-R0 §7): `npm run lint:prosa` · `node scripts/qa.mjs` ·
`node scripts/qa-ui.mjs` · `npm run build`.

**Gate específico:**

1. **Pipeline `revisar-prosa`** com zero achados bloqueantes. Regra do `CLAUDE.md`. O
   `perito-forense` responde por dois pontos técnicos próprios desta OS: **o que se lê
   num documento queimado** em 1893 (§3.1) e **a anatomia da cuvette** (§5a).
2. **Contagem de cartas** antes e depois, com o teto declarado no relatório.
3. **Asserção do veraz sem crédito** no `qa.mjs`: uma acusação que se apoie **só** numa
   carta de Amos falha, e falha pelo código próprio da insuficiência — não por acaso.
4. **Os quatro perfis** continuam a dar os quatro desfechos. As horas **vão mudar**
   (a torre é nó novo com custo real): registar as novas na ata, com o antes e o depois.
5. **Diff:** `src/gerador/`, `casos_gerados.js` e `casos_indice.js` fora dele.

---

## 8. Ata

Modelo em OS-R0 §9. Acrescentar:

- Os três martelos do §5 e o que se escreveu por causa deles.
- **O orçamento de cartas gasto e o que sobra** para a R5 e a R6 — em número, no corpo da
  ata. É o dado que a OS seguinte vai precisar de ler primeiro.
- As horas novas dos quatro perfis, contra as de hoje (17h00 · 18h00 · 14h00 · 13h00).
- O parecer do pipeline, com os achados não-bloqueantes e a OS que os herda.
- **Aberto para a OS seguinte:** o que a R5 herda de orçamento; `interrogatorio_silas`
  (R6); e a fila da R8 e da R9 tal como a ata da OS-R3 a deixou.
