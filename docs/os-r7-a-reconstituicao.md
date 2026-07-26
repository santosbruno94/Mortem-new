# OS-R7 — A reconstituição

**Mestra:** OS-R0. **Decisões:** D24, D25, D14, D23.
**Guardas:** G3, G4, G8, **G9**, G10, G11.
**Pré-requisito:** OS-R6 com ata (fechada em 26/07/2026). **Não abre antes.**
**Namespace de sal:** `reforma:r7:intervencao` (reservado na OS-R0 §6).

Escrita no fecho da OS-R6, contra a árvore real, como a OS-R0 §4 manda.

---

## 1. O que esta OS resolve

**(a) A D24 não tem uma linha de código.** «Clímax: **reconstituição**, domingo à
noite, na relojoaria. Sem inquérito em cena.» `grep -rn "reconstitui" src/` devolve
zero. O que existe hoje chama-se clímax e não é a D24: é o **monólogo** — um overlay
com `climax` no `Overlay.jsx`, alimentado por `gerarMonologo`. O caso acaba com o
perito pensando alto, e não com a cena que a decisão pediu.

**(b) O monólogo fala do jogador, não do caso.** `src/logic/monologo.js` monta o
desfecho por **blocos universais** (abertura, tese, álibi desmentido, testemunhas,
buracos, juízo sobre os não-acusados, fecho), e é isso que o torna reusável pelo
gerador. A revozação é a metade que falta: o desfecho conta a QUALIDADE DA CADEIA e
não conta a **noite**. A reconstituição é onde a noite entra — e é a única peça da
reforma que pode dramatizar sem provar.

**(c) O `blocoTestemunhas` conta papéis, e a R6 acabou de mostrar que a conta é de
bocas.** Hoje o bloco diz «Duas testemunhas juravam contra a hora que o corpo dá; o
corpo prevaleceu sobre ambas». Depois da R6 existe `src/logic/contaminacao.js`, e
existe o feixe da D16: o álibi do réu, a lição que Davey repete e a senhora da viela
da Sra. Wick saem **da mesma boca**. Um perito que diga «duas testemunhas» sobre um
feixe contaminado está somando o mesmo homem duas vezes — **na voz dele, no fecho do
caso**, que é o pior lugar possível para esse erro.

**(d) A D25 nunca apareceu em prosa.** «Harlan assina as mortes pequenas em nome de
Abbot; nunca assinou uma grande.» É a régua do personagem no desfecho, e o desfecho
é o único lugar onde ela pode pesar sem virar exposição.

---

## 2. O orçamento — e é zero

**A R7 está PROIBIDA de gastar carta pela G9:** *«a cena nunca introduz evidência nova
nem contorna o mural de acusação»*. Não é aperto de teto; é regra de desenho, e é a
razão de a R6 ter sido a última a poder gastar.

| | |
|---|---|
| Catálogo | **42** (41 em `cartas.js` + `ev_algor`) |
| Teto (G11) | **46** |
| Livre | **4 — e é o número final** |

O saldo 4 foi **decisão** da R6 (martelo (f)), não sobra. A R7 não o gasta, a R8 é
editorial e a R9 é do gerador: **o caso-escola fecha com 42 de 46**, e esta OS é a
primeira que já nasce sabendo disso.

---

## 3. Escopo

### 3.1 A reconstituição (D24, G9)

Domingo à noite, na relojoaria. **Sem inquérito em cena** — o coroner é prazo e
autoridade, nunca uma cena (D12).

O contrato da G9 é a especificação inteira e é curto: **a cena dramatiza; não prova.**
Do que decorre, sem depender de gosto:

- **Nenhuma carta nova, nenhum vestígio novo, nenhum nó novo.** O mural de acusação já
  aconteceu quando a cena roda; ela não o contorna nem o corrige.
- **A cena só rebate a intervenção cuja carta o jogador POSSUI.** Sem a carta, a
  intervenção fica de pé e alimenta os graus de falha. É o inverso exato de uma cena
  de revelação: aqui, quem não colheu não vê.
- **Nada do que a cena mostra entra no veredicto**, que já está calculado.

### 3.2 A revozação do `monologo.js`

O arquivo é da R7 pela matriz de colisão (OS-R0 §5), e é o único que ela possui por
inteiro. A revozação tem três frentes, e a terceira é a que a R6 obriga:

- **Voz.** O monólogo é primeira pessoa e sóbria (guia §3–4: **no máximo uma máxima por
  desfecho**, garantida por construção — cada variante declara `maxima: true` e o
  sorteio de fecho respeita a abertura). A revozação não afrouxa esse teto.
- **A noite.** Os blocos contam a cadeia; falta o que aconteceu. A reconstituição dá a
  matéria, e o monólogo passa a poder citá-la — **sem nunca afirmar facto físico falso**
  (G8 vale para o mestre; a mesma disciplina aplica-se ao perito no fecho).
- **A conta de bocas (herança direta da R6).** `blocoTestemunhas` recebe hoje um
  número de papéis. Deve passar a receber **vozes independentes** —
  `contarVozesIndependentes` de `src/logic/contaminacao.js` já faz a conta, e a
  `agruparPorOrigem` já dá o feixe. Duas testemunhas da mesma boca são uma.

**Aviso de guarda, e é o mesmo da R5:** a guarda que prova que o monólogo não inventa
móbil foi rebaseada na R5 e passou a testar o **pool** do monólogo, nos dois sentidos
e nos quatro perfis. **Se a R7 mexer nos moldes de periférico, é essa guarda que
reprova primeiro** — e reprova com razão.

### 3.3 A D25 — a regra da assinatura

Harlan assina as mortes pequenas em nome de Abbot; nunca assinou uma grande. Entra
como **peso no desfecho**, não como explicação: o que a régua faz é dar ao fecho de
cada um dos quatro desfechos um significado diferente para o mesmo homem. A OS não
resolve sozinha **onde** ela entra — é o martelo (b) do §5.

### 3.4 Fora de escopo

- Qualquer carta nova, em qualquer domínio *(G9, G11)*.
- O passe editorial e o **«púlpito de escrever forrado de cortiça»** de
  `pt_oficina_pulpito` — **OS-R8**, e mexer no rótulo do ponto toca o `qa-ui`.
- O gerador herdar a exposição, o `apontadaPor` e o móbil por aritmética de livro —
  **OS-R9**.
- A **normalização do `interrogatorio_silas`**, que a R6 registrou e deixou de pé com
  o desconforto declarado: reabre **depois da R8**, e com ata própria.
- A camada psíquica, o pivô visual, o bug de `reacao_vital` — fora da reforma
  *(OS-R0 §8)*.

---

## 4. Fases

**Fase 0 — Telemetria, e já é tradição.** Antes de escrever: imprimir no `qa.mjs`,
por perfil, **quantas intervenções do réu o jogador possui carta para rebater** e
**quantas vozes independentes** sustentam a tese de cada um. São esses dois números
que dizem o tamanho que a cena pode ter — a R5 dispensou uma fase inteira medindo, e
a R6 trocou o corte absoluto pelo relativo por causa da medida.

**Fase 1 — A conta de bocas no monólogo.** É a mais barata e a mais urgente: o
`blocoTestemunhas` passa a contar vozes. Não depende da cena.

**Fase 2 — A reconstituição.** A cena, com a G9 escrita como guarda antes do conteúdo.

**Fase 3 — A revozação.** Os blocos, com o teto de máxima intacto.

**Fase 4 — A D25**, conforme o martelo (b).

**Fase 5 — Gate e ata.**

---

## 5. Pontos de decisão — três, e todos antes da Fase 2

### (a) A reconstituição é cena jogável ou peça de leitura?

- **(1) Peça de leitura, entre o mural e o monólogo.** *Recomendada.* A cena corre
  como prosa, e o que ela mostra depende só das cartas que o jogador tem. Satisfaz a
  G9 por construção (não há o que jogar, logo não há o que contornar), não toca o mapa
  nem as horas, e não acrescenta superfície ao `qa-ui`.
- **(2) Cena jogável, com escolhas.** Vistosa e cara: escolha no clímax é escolha
  depois do veredicto calculado, e cada uma delas pede resposta à pergunta «e se o
  jogador escolher o contrário do que provou?».
- **(3) Cena com o elenco presente.** Bonita e proibida pela D24, que manda a
  reconstituição sem inquérito em cena.

### (b) Onde entra a D25 (a regra da assinatura)

- **(1) No fecho do monólogo, uma variante por desfecho.** *Recomendada.* É o lugar
  onde o teto de máxima já é governado por construção, e onde a régua pesa sem
  explicar-se.
- **(2) Na reconstituição.** Mistura o que a cena é (a noite) com o que ela não é (a
  biografia do perito).
- **(3) No epílogo (`epilogo.js`).** Fica longe do desfecho e perde o peso.

### (c) O que a cena faz quando o jogador não tem carta nenhuma para rebater

- **(1) A cena roda curta, e a intervenção fica de pé.** *Recomendada.* É a G9 lida ao
  pé da letra, e é a leitura mais dura: quem não colheu vê o réu sair inteiro da
  própria reconstituição.
- **(2) A cena não roda.** Mais simples e pior: esconde do jogador que havia o que
  rebater, e transforma a ausência de prova em ausência de cena.

---

## 6. Guardas

**GR7-1.** **A cena não prova.** Nenhuma carta nasce na reconstituição; o conjunto de
marcadores `[[id]]` da cena é **vazio**. *(G9)*

**GR7-2.** **A cena não contorna o mural.** O veredicto calculado antes da cena é
byte a byte igual ao de depois; a cena não lê nem escreve estado de acusação. *(G9)*

**GR7-3.** **Rebate só o que a mesa tem.** Toda intervenção rebatida na cena tem carta
correspondente na mesa do jogador; sem a carta, a intervenção fica de pé. *(G9)*

**GR7-4.** **A conta é de bocas.** O monólogo não diz «duas testemunhas» sobre
alegações que compartilham origem em `procedencia.js`. Provado por asserção sobre o
feixe da D16. *(D16, herança da R6)*

**GR7-5.** **Teto de máxima intacto.** No máximo uma máxima por desfecho, nos quatro,
em todas as combinações de abertura e fecho. *(guia §3)*

**GR7-6.** **Prosa nunca chaveia no bit `culpado`.** Nenhum molde da cena nem do
monólogo ramifica em `reuCorreto`. *(G3)*

**GR7-7.** **Teto de cartas: zero gasto.** O catálogo sai da R7 com os mesmos 42.
*(G9, G11)*

**GR7-8.** O gerador e o banco ficam fora do diff; `sha256` intacto. *(G12)*

---

## 7. Gate

**Gate global** (OS-R0 §7): `npm run verificar`.

**Gate específico:**

1. **Pipeline `revisar-prosa`** com zero achados bloqueantes. *A R3, a R4 e a R5
   reprovaram na primeira passada; a R6 passou em duas rodadas, e a primeira delas
   trouxe dois achados de léxico do próprio `lint-prosa` antes de qualquer revisor.*
2. **Contagem de cartas:** 42 antes, 42 depois. A R7 não pode gastar.
3. **Telemetria da Fase 0** publicada na ata.
4. **Os quatro perfis** continuam a dar os quatro desfechos, e as horas seguem
   **18h00 · 18h00 · 14h00 · 13h00** — confirmadas, não assumidas.
5. **Contrato do `qa-ui`:** a superfície de fim de caso (`data-overlay`, a fileira de
   carimbos, os rótulos que ele clica) é intocável sem atualizar o QA no mesmo commit.
6. **Diff:** `src/gerador/`, `casos_gerados.js` e `casos_indice.js` fora dele.

---

## 8. Ata

Modelo em OS-R0 §9. Acrescentar:

- Os três martelos do §5 e o que se escreveu por causa deles.
- **A contagem de cartas**, provando o zero.
- **A telemetria da Fase 0**, com o tamanho que ela justificou para a cena.
- O parecer do pipeline.
- **Aberto para a OS seguinte:** a fila da R8 (passe editorial, com o púlpito de
  cortiça da R5 e a normalização do `interrogatorio_silas` da R6) e a da R9 (o gerador
  herda a exposição, o `apontadaPor` e o móbil por aritmética de livro).
