# OS-R9 — Prompt de arranque para a sessão seguinte

Escrito no fecho da OS-R8 — **a última OS da reforma** —, contra a árvore real, como a
OS-R0 §4 manda. Copiar o bloco do §1 como primeira mensagem da sessão nova.

A R9 é **mudança de frente**: sai do caso-escola e entra no gerador. Este prompt é mais
longo do que os sete anteriores por uma razão só — nas outras OS, o contexto que o agente
precisava de carregar era um caso; nesta, é um banco.

---

## 1. O prompt

> Executar a **OS-R9 — O gerador herda os padrões**
> (`docs/os-r9-gerador-herda-os-padroes.md`) do repositório MORTEM, do arranque ao
> fecho com ata. **A reforma está fechada** (oito OS, ata da R8 em 26/07/2026);
> esta OS sai dela e muda de frente.
>
> **Antes de tocar em qualquer ficheiro, ler nesta ordem:**
> 1. `docs/os-r0-mestra-reforma-hora-emprestada.md` — a ordem-mestra. Não se
>    executa; governa. Nesta OS interessam a **G5** (estado derivado, nunca
>    oculto), a **G6** (o veraz sem crédito aponta e nunca prova), a **G9**, a
>    **G12** (o banco é produto e não se edita à mão) e o **§8**, que é onde esta
>    OS foi escrita para fora da reforma — e diz por quê.
> 2. `docs/os-r9-gerador-herda-os-padroes.md` — a OS a executar. O **§2 traz cada
>    item da fila com o estado MEDIDO** contra a árvore, precisamente para que
>    esta sessão não reinvestigue o que oito OS investigaram.
> 3. A ata da **OS-R8** no fim de `docs/historico-decisoes.md` — em especial o
>    **balanço da reforma inteira** e a secção do que o gerador herda. É a única
>    ata da série que olha para as oito de uma vez.
> 4. `docs/game-design-simulacao.md` — o design do gerador por simulação. Numa OS
>    que mexe no gerador, este documento é a especificação, e o
>    `MORTEM_CONTEXTO.md` é o do jogo que ele alimenta.
> 5. `CLAUDE.md` — regras invioláveis. Aqui pesam duas acima das outras: **zero
>    LLM em runtime / tudo determinístico** (proibido `Math.random`/`Date.now` em
>    `src/logic`, `src/data` e `src/store`; toda variação vem de `hashString`
>    salgado) e **o motor é cego a atributos**.
>
> ---
>
> ### Há TRÊS pontos de decisão, e todos cabem numa resposta curta
>
> Estão no §5 da OS, com recomendação para cada um. **Recolher os três de uma vez,
> no arranque**, e seguir sem parar mais — é o que fez a R6, a R7 e a R8 correrem
> do princípio à ata sem interrupção.
>
> - **(a) A resposta nula da exigência varia ou é uniforme?** Medido no fecho da
>   R8: uma frase — «Nada de nota.» — em 55 ocorrências, 11 dos 31 casos, **todas
>   em nós `exigencia_*`**. Recomendação: **uniforme**, com a guarda a isentá-la
>   por nome. Variar o «nada aqui» faria do estilo um sinal.
> - **(b) O tamanho do catálogo de gestos gerado.** Recomendação: **teto nove**
>   (como o tutorial, cujo número a R7 mediu) e **piso três**.
> - **(c) A ordem das Fases 3 e 4.** Recomendação: **manter**.
>
> ### A execução
>
> **Fase 0 primeiro, e nesta OS ela mede LOTE.** Não é uma leitura: é, para cada
> item do §2, em quantos dos **31 casos** o padrão falta e o que o pacote já traz
> de matéria-prima. Quatro OS seguidas provaram que medir primeiro poupa uma fase;
> a R8 provou o caso extremo — a fila que ela herdou dizia UMA rubrica repetida, e
> a medida disse OITO.
>
> **O caso-escola é GABARITO, não alvo.** Cada padrão desta fila tem no tutorial
> uma implementação que o pipeline já aprovou. A pergunta não é «como se faz?»; é
> «o que este padrão pressupõe que o gerador não sabe produzir?».
>
> **O banco é produto (G12).** Toda alteração no gerador exige
> `node scripts/gerar-casos.mjs`, que escreve `casos_gerados.js` **e**
> `casos_indice.js`. O `qa.mjs` cobra os dois por replay byte a byte: uma fase que
> mexa no gerador e não regenere reprova sozinha.
>
> **Seguir as fases pela ordem** (§4 da OS), **um commit por fase**, como as oito
> OS anteriores fizeram.
>
> **Toda prosa gerada nova passa pelo pipeline `revisar-prosa`** com os três
> revisores, e o gate é **zero achados bloqueantes** — com uma diferença desta
> OS: a amostra tem de ser **de lote**, várias seeds, não um caso só. Prosa gerada
> é matéria em série, e a guarda automática não chega à matéria.
>
> **Gate no fecho:** `npm run verificar`, mais o gate específico do §7.
>
> **Fechar com ata** em `docs/historico-decisoes.md`, no modelo da OS-R0 §9, com o
> que o §8 da R9 pede — e a telemetria da Fase 0 publicada, que é o que diz se a
> ordem das fases estava certa.
>
> **Ramo próprio a partir do ramo designado da sessão**, depois de o PR da R8
> estar integrado. Atualizar `MORTEM_CONTEXTO.md`, `README.md` e
> `docs/plano-de-sessoes.md` no commit final.

---

## 2. O que a R9 vai encontrar, e que a reforma deixou pronto

**O caso-escola está fechado, e é o gabarito.** 42 cartas de 46 — **número final**, e não há
mais quem gaste: a R6 foi a última OS que podia, e aceitou o saldo 4 como decisão. Horas
**18h00 · 18h00 · 14h00 · 13h00** nos quatro perfis, conferidas em cada uma das oito atas.

**Cada padrão da fila tem referência aprovada no tutorial:**

| Padrão | Onde está o gabarito |
|---|---|
| Procedência / o feixe da D16 | `src/data/procedencia.js` + `src/logic/contaminacao.js` (`contarVozes`) |
| Exposição E0/E1/E2 | `src/logic/exposicao.js` (função pura) + o beat 3 das cinco árvores |
| Veraz sem crédito | as cartas de Amos Kell, e a guarda **GR4-3** que as recusa como nexo |
| Móbil por aritmética | o livro de pagamentos contra o de ordens; o Livro II dos pesos |
| Degrau de confronto | `confronto_testamento` (`contaEntre` de três, `aPartirDe: 2`) |
| Intervenções da noite | `src/data/intervencoes.js` (nove gestos) + `src/logic/reconstituicao.js` |
| Rubrica que não se repete | a guarda **GR8-4**, com a isenção de nós do mesmo beat |

**A régua da exposição já corre sobre um caso gerado** — é função pura das cartas possuídas.
O que falta não é a régua: é o que a R6 construiu em cima dela (o beat que declara o nível, a
alfinetada que ele paga), e a **paridade** da GR6-5 num elenco de tamanho variável.

**A reconstituição está travada de propósito.** `montarReconstituicao` devolve `null` sem
catálogo, e nenhum dos 31 casos tem catálogo. Foi gate deliberado da R7: sem ele, os trinta
casos abririam uma cena vazia. **Destravá-lo é a Fase 3, e ela arrasta a dívida de
geografia** — as três aberturas da cena cravam a relojoaria dentro de `src/logic`, e no dia
em que houver catálogo gerado, aquelas frases vazam. Não são dois itens; é um.

**A GR8-4 já está medida contra o gerado:** 31 casos, 155 árvores, 11 casos com repetição,
55 ocorrências, **uma frase só** — e todas em `exigencia_*`. Fora dali, o derivador varia as
rubricas. É o item mais bem delimitado da fila, e é decisão antes de ser trabalho.

---

## 3. As armadilhas próprias desta OS

**A armadilha central é a escala.** Na reforma, um achado era uma frase e lia-se o caso
inteiro antes de mexer. Aqui um achado é uma **distribuição**, e nenhuma leitura cobre 31
casos. Quem tratar o banco como se fosse o tutorial vai corrigir um caso e chamar-lhe fila
fechada. A saída está escrita nas guardas em banda que o `qa.mjs` já tem (GE2 em 40–60%,
GE5 abaixo de 45%, regime-palco em 10–30%): **é assim que este repositório prova coisas
sobre lote.**

**O determinismo é mais fácil de quebrar aqui do que em qualquer OS anterior.** Toda
capacidade nova sorteia algo, e sortear com `hashString` mal salgado acopla chaves-irmãs —
o achado B✱ dos priors compostos, que já custou uma guarda de decorrelação. Namespace de
sal próprio, por eixo, declarado no cabeçalho da OS.

**Portar um padrão sem a sua guarda é entregar prova de graça.** O veraz sem crédito é o
caso óbvio: sem a MARCA de insuficiência que a GR4-3 cobra, uma testemunha veraz passa a
prova gratuita, e o fair play do caso gerado cai de uma vez em 31 casos.

**A tentação de «aproveitar a viagem».** A fila do §2 tem dez itens e o gerador tem vinte e
um módulos. O §3 da OS escreve para fora, por nome, o que **não** é desta OS — inclusive
duas coisas que outras atas rotearam para cá e que não são do gerador (o item 10 do
playtest e a sala da `porta_beco`).

**O `reacao_vital`.** Continua fora (OS-R0 §8), e continua a ser o bug mais antigo em
aberto. Não se conserta «de passagem» numa OS de gerador.

---

## 4. Estado do repositório no fecho da OS-R8

| | |
|---|---|
| Ramo | `claude/prompt-versionado-continuacao-xolmmh` |
| Base | `claude/mortem-vertical-slice-zzrcto` |
| Gate | `npm run verificar` — a bateria inteira, verde |
| Cartas | **42 de 46**, **4 livres — número final** |
| Horas | 18h00 · 18h00 · 14h00 · 13h00 |
| Guardas | GR4-2…GR4-6, GR5-3…GR5-6, GR6-3…GR6-9, GR7-1…GR7-7, **GR8-4** |
| Banco | 31 casos embarcados, 155 árvores, replay byte a byte verde |

**Aberto, e por onde:**

- **OS-R9** (esta): a fila do §2, dez itens, três decisões.
- **Lote de UI:** o item 10 do playtest (ler a transcrição completa da carta amassada) —
  aprovado pela S2 como lote pequeno, triado para fora do passe editorial pela R8.
- **Lote do caso-escola:** a sala da `porta_beco` (prosa nova + sala clicável na planta +
  contrato do `qa-ui`).
- **Para o playtest humano, com número:** os perfis **Intuitivo** e **Pericial Desatento**
  chegam à reconstituição com **0 de 9** gestos rebatíveis, e o segundo **condena**. Medir
  se a cena curta se lê como consequência da própria colheita ou como defeito. Se não se
  ler, o remédio é **de prosa**, nunca de mecânica.
- **Sem dono, e é decisão de mesa:** o prazo do inquérito com consequência mecânica
  (ficção só, martelado na R3); a normalização do `interrogatorio_silas` (martelada como
  **não fazer** em 26/07/2026).
- **Fora de toda esta série** (OS-R0 §8): a camada psíquica, o pivô visual de gravura, o
  bug de `reacao_vital`.
