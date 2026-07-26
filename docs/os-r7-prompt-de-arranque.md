# OS-R7 — Prompt de arranque para a sessão seguinte

Escrito no fecho da OS-R6, contra a árvore real, como a OS-R0 §4 manda
(«cada uma escreve-se no fecho da anterior»). Copiar o bloco do §1 como
primeira mensagem da sessão nova.

---

## 1. O prompt

> Executar a **OS-R7 — A reconstituição** (`docs/os-r7-a-reconstituicao.md`)
> do repositório MORTEM, do arranque ao fecho com ata.
>
> **Antes de tocar em qualquer ficheiro, ler nesta ordem:**
> 1. `docs/os-r0-mestra-reforma-hora-emprestada.md` — a ordem-mestra. Não se
>    executa; governa. Interessam a **G9** (que é o contrato inteiro desta OS
>    e cabe numa linha: *a cena dramatiza; não prova*), mais **G3, G4, G8,
>    G10, G11**, a matriz de colisão do §5 (a R7 é **dona** de `monologo.js`,
>    e é o único arquivo que possui) e o gate do §7.
> 2. `docs/os-r7-a-reconstituicao.md` — a OS a executar. Ler o **§1(c)
>    primeiro**: é o que a R6 acabou de tornar obrigatório, é barato, e não
>    depende da cena.
> 3. A ata da **OS-R6** no fim de `docs/historico-decisoes.md`.
> 4. `docs/guia-de-estilo.md` §3 — o teto de brilho. O monólogo é o lugar do
>    repositório onde ele é mais fácil de estourar, e onde o estouro mais
>    custa.
> 5. `CLAUDE.md` — regras invioláveis e o contrato com o `qa-ui.mjs`.
>
> ---
>
> ### Recolher os três martelos numa rodada só, antes da Fase 2
>
> São **três**, e estão no §5 da própria OS com o custo das alternativas
> escrito lá. Perguntar os três **de uma vez** (uma rodada de
> `AskUserQuestion`, com as recomendações em primeiro lugar) e **não parar
> mais** depois de respondidos, salvo se a execução revelar contradição
> entre uma decisão e uma guarda — caso em que se pergunta na hora, e só
> isso.
>
> **(a) A reconstituição é cena jogável ou peça de leitura?** Recomendação:
> **peça de leitura**, entre o mural e o monólogo — satisfaz a G9 por
> construção, não toca mapa nem horas, e não acrescenta superfície ao
> `qa-ui`.
>
> **(b) Onde entra a D25** (Harlan assina as mortes pequenas em nome de
> Abbot; nunca assinou uma grande). Recomendação: **no fecho do monólogo,
> uma variante por desfecho** — é onde o teto de máxima já é governado por
> construção.
>
> **(c) O que a cena faz com quem não tem carta nenhuma para rebater.**
> Recomendação: **roda curta, e a intervenção fica de pé** — é a G9 ao pé da
> letra, e é a leitura mais dura.
>
> ---
>
> ### Depois de respondidos: executar sem parar
>
> **Fase 0 primeiro, que é telemetria e não muda nada:** imprimir no
> `qa.mjs`, por perfil, quantas intervenções do réu o jogador tem carta para
> rebater, e quantas **vozes independentes** sustentam a tese de cada um. Os
> dois números dizem o tamanho que a cena pode ter. Na R5 a telemetria da
> Fase 0 dispensou uma fase de execução inteira; na R6 ela trocou o corte
> absoluto pelo relativo e evitou que o nível de exposição virasse delator.
> **Medir antes de arbitrar já é o método da casa.**
>
> **Fase 1 antes da cena.** O `blocoTestemunhas` do `monologo.js` conta
> papéis e devia contar bocas; `src/logic/contaminacao.js` já faz a conta
> (`contarVozesIndependentes`, `agruparPorOrigem`) e o feixe da D16 já está
> em `src/data/procedencia.js`. É barato, é independente da cena, e é o
> único ponto do jogo onde o erro sairia **na voz do perito, no fecho**.
>
> **Escrever a guarda antes do conteúdo, ao menos a GR7-1 e a GR7-2.** A
> reconstituição é a peça onde é mais fácil furar a G9 sem dar por isso: uma
> cena que mostra o que o jogador não colheu é uma cena que prova.
>
> **Seguir as fases pela ordem** (§4 da OS), **um commit por fase**, como as
> seis OS anteriores fizeram.
>
> **Toda prosa nova passa pelo pipeline `revisar-prosa`** com os três
> revisores, e o gate é **zero achados bloqueantes**. A R3, a R4 e a R5
> reprovaram na primeira passada, cada uma por revisor diferente. **Nesta OS
> o revisor mais provável é o editor-crítico**, porque o monólogo é onde o
> brilho estoura: o guia manda **no máximo uma máxima por desfecho**, e o
> arquivo já garante isso por construção (`maxima: true` nas variantes) —
> quem revozar tem de manter a garantia, não só a contagem.
>
> **Gate no fecho:** `npm run verificar`. Acresce o gate específico do §7.
> **Atenção à guarda rebaseada na R5:** a que prova que o monólogo não
> inventa móbil testa o **pool** do monólogo, nos dois sentidos e nos quatro
> perfis. Se esta OS mexer nos moldes de periférico, é ela que reprova
> primeiro — e reprova com razão.
>
> **Fechar com ata** em `docs/historico-decisoes.md`, no modelo da OS-R0 §9,
> acrescentando o que o §8 da R7 pede: os martelos, a contagem de cartas
> provando o zero, a telemetria da Fase 0, o parecer do pipeline e o aberto
> para a R8.
>
> **Escrever, no mesmo fecho, a OS-R8 e o seu prompt de arranque**, contra a
> árvore real.
>
> **Ramo próprio a partir do ramo designado da sessão**, depois de o PR da
> R6 estar integrado. Atualizar `MORTEM_CONTEXTO.md`, `README.md` e
> `docs/plano-de-sessoes.md` (frente SR) no commit final.

---

## 2. O que a R7 vai encontrar, e que a R6 mudou

**A conversa tem três beats agora, e o terceiro não dá carta.** Os cinco suspeitos
têm `b3_{firme|cordial|tecnico|obliquo}`, com eixo comum (o que a morte muda para quem
ficou). O beat 3 **não marca nenhum `[[id]]`** por desenho — é o que faz a G4 valer por
construção. Se a R7 precisar de superfície de conversa, é ali que ela está livre.

**A exposição existe, e é função pura** (`src/logic/exposicao.js`). Mede a fração do
dossiê de cada suspeito que o perito trouxe; E2 são dois terços. **O motor é cego a
ela** (GR6-6, por leitura de fonte), e a R7 não deve mudar isso: se o monólogo passar a
ler exposição, ela deixa de ser camada narrativa.

Os dossiês, para quem for medir: Silas **5**, Walter **5**, Agnes **4**, Davey **3**,
Grey **2**. O réu **empata** no topo em vez de reinar nele, e foi isso que a Fase 1 da
R6 comprou ao trocar o corte absoluto pelo relativo.

**A contaminação existe, e é a peça que mais interessa a esta OS.**
`src/data/procedencia.js` regista quem **pôs** cada alegação em circulação, e
`src/logic/contaminacao.js` faz a conta. O feixe da D16 são três papéis e uma boca:

| Carta | Forma |
|---|---|
| `alibi_silas` | própria |
| `alibi_davey` | **ensaio** — o oficial ensaiou o «saímos juntos às sete e meia» |
| `dep_mulher_viela` | **coação** — a Sra. Wick retrata-se ao meio-dia |

`contarVozesIndependentes(['alibi_silas','alibi_davey'])` devolve **1**. O
`blocoTestemunhas` de hoje devolveria «duas testemunhas».

**A escada de confronto ganhou forma, e é contador autoral (D8).** Um nó de reação
pode trazer `degraus: [{ contaEntre: [...], aPartirDe: n, fala: [...] }]`, e vale o
último degrau cuja contagem a mesa satisfaz. O segundo degrau do testamento de Walter
é o caso vivo (D3 fechada): com dois dos três papéis, ele admite que soube.

**As horas são 18h00 · 18h00 · 14h00 · 13h00**, inalteradas pela R6 — o martelo (e)
não criou nó.

**O `interrogatorio_silas` continua anómalo, e o desconforto está declarado no próprio
arquivo.** Só o réu tem nó de mapa próprio. Reabrir é **depois da R8**, com ata própria.

**O banco está em sincronia e a R7 não toca no gerador.** `gerar-casos.mjs` escreve
`casos_gerados.js` **e** `casos_indice.js` — se algum comando o correr por engano,
restaurar os dois.

---

## 3. As armadilhas próprias desta OS

**A G9 é fácil de furar por generosidade.** A tentação da cena de clímax é mostrar o
que aconteceu — e mostrar o que o jogador não provou é provar por ele. A reconstituição
só rebate a intervenção cuja carta está na mesa; **sem a carta, a intervenção fica de
pé**, e o réu sai inteiro da própria reconstituição. Quem achar isso duro está a
entender a decisão corretamente.

**O monólogo é onde o brilho estoura.** O guia manda uma máxima por desfecho, e o
arquivo garante isso por CONSTRUÇÃO: cada variante declara `maxima`, e quando a
abertura sorteada é máxima, só fechos sem máxima concorrem. Uma revozação que
acrescente variantes sem declarar `maxima` quebra a garantia sem quebrar teste nenhum
até alguém ler dois epigramas seguidos em jogo.

**A guarda do móbil no monólogo foi rebaseada na R5 e testa o pool inteiro.** Mexer nos
moldes de periférico reprova ali primeiro.

**O `qa-ui` cobre o fim de caso.** A fileira de carimbos percorre as chaves de `TITULOS`
em `monologo.js` — **a ordem das chaves é a ordem de exibição**, e a interface não
mantém lista própria. Reordenar aquele objeto muda a tela.

**A conta de bocas tem um lado que não é óbvio.** Trocar papéis por vozes torna o
monólogo mais honesto e **mais pobre em número**: onde ele dizia «duas testemunhas»,
passará a dizer «uma». Se a prosa do bloco não for reescrita junto, o desfecho fica
tecnicamente correto e narrativamente mais fraco. Reescrever os três casos do bloco
(1, 2, muitas) é parte da Fase 1, não um acabamento.

---

## 4. Estado do repositório no fecho da OS-R6

| | |
|---|---|
| Ramo | `claude/prompt-versionado-continuacao-corvhx` |
| Base | `claude/mortem-vertical-slice-zzrcto` |
| Gate | `npm run verificar` — a bateria inteira, verde |
| Cartas | **42 de 46**, **4 livres — e é o número final** |
| Horas | 18h00 · 18h00 · 14h00 · 13h00 |

**Aberto, por OS:**

- **OS-R8** (passe editorial): tudo o que a ata da R4 deixou; o **«púlpito de escrever
  forrado de cortiça»** de `pt_oficina_pulpito` (achado do perito na R5 — «púlpito» em
  PT é o da igreja, e o caso já tem uma); e a **normalização do `interrogatorio_silas`**,
  que a R6 deixou de pé com o desconforto declarado. Os dois tocam o contrato do
  `qa-ui`.
- **OS-R9** (o gerador herda os padrões): a fila da R4, mais o **arquétipo do veraz sem
  crédito**, o **móbil que se prova por aritmética de livro** (R5), e — novos desta OS —
  a **exposição** (E0/E1/E2 por fração de dossiê), o **`apontadaPor`** e a **escada de
  confronto por contador autoral**.
- **Camada de apresentação:** `FundoCena.jsx` desenha um armário de arquivo onde a prosa
  diz cômoda.
- **Sem dono, e é decisão de desenho:** o prazo do inquérito com consequência mecânica
  (o utilizador martelou «ficção só, por agora» na R3; reabrir **depois da R8**).
- **De KB, registado e não criado:** `CLASSES_VESTIGIO` não tem classe de **roupa
  queimada** nem de **documento queimado** — os dossiês existem, o gerador não sabe
  produzi-los.
