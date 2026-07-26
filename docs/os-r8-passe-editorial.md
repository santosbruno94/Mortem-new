# OS-R8 — Passe editorial e QA de fecho

**Mestra:** OS-R0. **Decisões:** nenhuma nova — a R8 executa o que sete OS deixaram.
**Guardas:** G1, G3, G4, G8, G9, G10, G11, G12.
**Pré-requisito:** OS-R7 com ata (fechada em 26/07/2026). **Não abre antes.**
**Namespace de sal:** nenhum. A R8 **não introduz variação** — é passe de texto e de
rótulo. Uma OS que precisasse de sal não seria editorial.

Escrita no fecho da OS-R7, contra a árvore real, como a OS-R0 §4 manda.

---

## 1. O que esta OS é, e o que ela não é

**É a última OS da reforma**, e a única cujo trabalho é inteiramente de acabamento. Sete OS
escreveram; esta relê. Não há sistema novo, não há carta nova, não há decisão de desenho a
tomar — e é isso que a torna perigosa de outra maneira: **uma OS sem invenção é uma OS em
que todo diff é gratuito se não fechar um item da fila.**

**Não é** o lugar de reabrir o que foi martelado. Três coisas estão fechadas e a R8 as
respeita sem discutir:

- o **`interrogatorio_silas` NÃO se normaliza** (martelado em 26/07/2026: o custo é mapa,
  diorama, horas e `qa-ui`, e a assimetria é fraca e já está declarada no próprio
  `dialogos.js`);
- o **prazo do inquérito continua ficção sem consequência mecânica** (martelado na R3;
  reabre depois desta OS, se reabrir);
- o **catálogo fecha em 42 de 46**. A R8 não gasta carta. Se um item da fila parecer exigir
  uma, o item está mal formulado — releia antes de pedir.

---

## 2. O orçamento

| | |
|---|---|
| Catálogo | **42** (41 em `cartas.js` + `ev_algor`) |
| Teto (G11) | **46** |
| Livre | **4 — e continua a ser o número final** |

A GR7-7 já cobra o número; a R8 herda a guarda e não a afrouxa.

---

## 3. Escopo — a fila, item a item

A fila está triada e cada item traz o que a investigação anterior já achou, para que a R8
**não reinvestigue**.

### 3.1 Os três rótulos da Estação III do mural (item 14 do playtest)

**Já investigado (26/07/2026): são três strings, não é redesenho.** O motor não vaza nada —
a gaveta lista *todas* as alegações de hora, inclusive as verdadeiras (o guarda Tobin
correndo as tampas da vitrine às 20h). O que conclui pelo jogador é o **nome**:

| Onde | String |
|---|---|
| `MuralAcusacao.jsx:47` | `III · As Mentiras` |
| `MuralAcusacao.jsx:47` | `depoimentos desmentidos` |
| `RevisaoFinal.jsx:47` | `Mentiras` |

O `qa-ui` **não** clica nenhuma das três — e é preciso confirmar isso por leitura antes de
mexer, não por memória desta OS.

### 3.2 O púlpito de cortiça (achado do perito na R5)

`pt_oficina_pulpito`: em PT, **púlpito** é o da igreja, e o caso já tem uma (S. Miguel). O
móvel de oficina de relojoeiro é outro. **Mexer no rótulo do ponto toca o `qa-ui`** — o
contrato do `CLAUDE.md` exige atualizar o QA no mesmo commit.

### 3.3 Os dois não-bloqueantes herdados da R6

- a rubrica «Puxa o colete para baixo, como quem se compõe para retrato» aparece **duas
  vezes** na árvore de Walter, em telas diferentes (prosa anterior à R6);
- a abertura de `interrogatorio_silas` diz «a bancada amanheceu sem lume», que puxa contra
  a abertura do caso pela mesma razão que o carvão de Silas puxava (ele acendeu o fogo no
  sábado de manhã, por `abertura.js`).

### 3.4 Os quatro achados novos da R7

- **A divergência «carrilhão»** — `MORTEM_CONTEXTO.md` chama carrilhão à peça que o
  glossário, o motor e a carta chamam **relógio de badalar**. Carrilhão é *chime*: soaria a
  cada quarto de hora e encolheria a janela do caso de uma hora para quinze minutos, e não
  convive com uma roda de contagem na mesma caixa. **A prosa do jogo já está correta** (a
  R7 não propagou o termo); o que está fora de passo é o documento de desenho.
  **É decisão do utilizador**, e a R8 só a executa se ele mandar.
- **O «vinco das nervuras» de `ev_cinza_livro`** — as nervuras são os nervos da **lombada**,
  não da pasta, e o livro-razão de papelaria dos 1890 é tipicamente de **lombo de mola**,
  que não tem nervos. Sobrevivente canónico e mais rico, que a KB já documenta: a **crosta
  curva e rígida, em camadas**, que nenhuma folha solta produz. É achado de carta, não de
  prosa nova.
- **A bíblia de vozes diz «antes do meio-dia»** onde a carta `dep_mulher_viela` diz **«ao
  meio-dia»**. A fonte de código vence a de doc; corrigir a bíblia.
- **A fila da R4 que nunca se esgotou** — releitura dos textos anteriores à reforma que as
  OS seguintes não tocaram.

### 3.5 O QA de fecho

Reler o `qa.mjs` e o `qa-ui.mjs` inteiros à procura de guarda que:

- **prometa mais do que prova** (a asserção que passa por construção e não por medida);
- **teste o que já não existe** (guarda órfã de uma decisão revertida);
- **duplique** outra sem acrescentar perna.

É o único item da R8 que pode **remover** código, e o único que exige justificar cada
remoção na ata.

### 3.6 Fora de escopo

- Qualquer carta nova, em qualquer domínio *(G9, G11)*.
- A normalização do `interrogatorio_silas` — **martelada como NÃO fazer**.
- O gerador herdar exposição, `apontadaPor`, móbil por aritmética de livro, intervenções da
  noite e a dívida de geografia de `reconstituicao.js` — **OS-R9**.
- A camada psíquica, o pivô visual, o bug de `reacao_vital` — fora da reforma *(OS-R0 §8)*.

---

## 4. Fases

**Fase 0 — O inventário, e desta vez ele é de texto.** Antes de mexer: listar, por arquivo,
cada item da fila com a linha exata e o que o `qa-ui` toca nele. As três OS anteriores
provaram que medir primeiro poupa uma fase; aqui a medida é *qual diff toca o contrato do
QA*, porque é essa a única maneira de esta OS quebrar alguma coisa.

**Fase 1 — Os rótulos que concluem pelo jogador** (§3.1). É o item de maior efeito e o de
menor risco: três strings.

**Fase 2 — O púlpito** (§3.2), com o `qa-ui` no mesmo commit.

**Fase 3 — Os ecos e as colisões de prosa** (§3.3, §3.4).

**Fase 4 — O QA de fecho** (§3.5).

**Fase 5 — Gate e ata**, e a ata desta fecha a reforma inteira.

---

## 5. Pontos de decisão

**Um só, e o utilizador pode fechá-lo no arranque em uma linha:**

### (a) A divergência «carrilhão» alinha-se, ou fica registada?

- **Alinhar** — trocar as duas linhas do `MORTEM_CONTEXTO.md` para «relógio de badalar».
  Custo: duas linhas. Ganho: o documento de desenho deixa de contradizer o glossário do
  próprio jogo, e a próxima auditoria não bate na mesma pedra.
- **Ficar registada** — a ata da R7 já a documenta, e o `CLAUDE.md` põe o CONTEXTO como
  fonte da verdade de design, o que faz de qualquer edição dele matéria do utilizador.

*Recomendação:* alinhar. Não é divergência de desenho — é um termo técnico errado num
documento que descreve corretamente tudo o resto do mecanismo.

---

## 6. Guardas

**GR8-1.** **Zero gasto.** O catálogo sai da R8 com os mesmos 42. *(G9, G11)*

**GR8-2.** **Nenhum rótulo conclui pelo jogador.** As gavetas do mural nomeiam o que
CONTÊM, não o que o jogador deve concluir delas. Provado por lista de strings, não por
leitura de tela. *(G3)*

**GR8-3.** **Contrato do `qa-ui` intacto ou atualizado no mesmo commit.** Todo rótulo que o
QA clica continua a existir com o texto que ele espera. *(CLAUDE.md)*

**GR8-4.** **Nenhuma rubrica de diálogo se repete verbatim** na mesma árvore. *(anti-padrão
nº 6)*

**GR8-5.** O gerador e o banco ficam fora do diff; `sha256` intacto. *(G12)*

**GR8-6.** **Toda guarda removida na Fase 4 tem justificação na ata**, com o motivo pelo
qual ela não protegia nada. Remover guarda sem ata é como gastar carta sem orçamento.

---

## 7. Gate

**Gate global** (OS-R0 §7): `npm run verificar`.

**Gate específico:**

1. **Pipeline `revisar-prosa`** com zero achados bloqueantes. *A R3, a R4 e a R5
   reprovaram na primeira passada; a R6 e a R7 passaram em duas rodadas — e na R7 um dos
   bloqueantes era o pivô do caso escrito ao contrário, achado por um só dos três
   revisores. **Numa OS que só relê texto, o pipeline não é formalidade: é o trabalho.***
2. **Contagem de cartas:** 42 antes, 42 depois.
3. **Os quatro perfis** continuam a dar os quatro desfechos, e as horas seguem
   **18h00 · 18h00 · 14h00 · 13h00** — confirmadas, não assumidas.
4. **Diff:** `src/gerador/`, `casos_gerados.js` e `casos_indice.js` fora dele.

---

## 8. Ata

Modelo em OS-R0 §9. Acrescentar:

- O item (a) do §5 e o que se fez por causa dele.
- **A fila, item a item, com o estado de cada um** — é a última OS da reforma, e a ata dela
  é o inventário de fecho: o que se fez, o que se decidiu não fazer, e por quê.
- O parecer do pipeline.
- **Toda guarda removida na Fase 4**, com justificação.
- **Aberto para a OS-R9:** a fila do gerador, agora completa (abertura testemunhal,
  `apontadaPor`, exposição, veraz sem crédito, móbil por aritmética de livro, escada de
  confronto por contador autoral, intervenções da noite, e a dívida de geografia de
  `reconstituicao.js`).
- **O balanço da reforma inteira**, que nenhuma outra ata pôde escrever: o que as oito OS
  mudaram no caso-escola, e quais dos padrões o gerador vai herdar.
