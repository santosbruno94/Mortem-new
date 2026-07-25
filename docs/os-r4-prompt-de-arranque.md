# OS-R4 — Prompt de arranque para a sessão seguinte

Escrito no fecho da OS-R3, contra a árvore real, como a OS-R0 §4 manda
(«cada uma escreve-se no fecho da anterior»). Copiar o bloco do §1 como
primeira mensagem da sessão nova.

---

## 1. O prompt

> Executar a **OS-R4 — Elenco e Livros** (`docs/os-r4-elenco-e-livros.md`) do
> repositório MORTEM.
>
> **Antes de tocar em qualquer ficheiro, ler nesta ordem:**
> 1. `docs/os-r0-mestra-reforma-hora-emprestada.md` — a ordem-mestra. Não se
>    executa; governa. Interessam as guardas **G1, G2, G4, G6, G7, G10, G11, G12**
>    (todas citadas pela R4), a matriz de colisão do §5 e o gate do §7.
> 2. `docs/os-r4-elenco-e-livros.md` — a OS a executar. Ler o **§2 primeiro**:
>    o eixo desta OS é o orçamento de cartas, não o elenco.
> 3. As atas da **OS-R2** e da **OS-R3** no fim de `docs/historico-decisoes.md`
>    (secções «25/07/2026 — OS-R2» e «25/07/2026 — OS-R3»). Duas OS mudaram a
>    topologia e a abertura, e a R4 assume as duas.
> 4. `docs/kb-medicina-legal/inquerito-e-policia.md` — em especial o **§1**
>    (a lei de 1887, quem pode ser requisitado) e o **§4.1** (*covering* — a
>    assinatura emprestada), ambos escritos no fecho da R3.
> 5. `CLAUDE.md` — regras invioláveis do código e o contrato com o `qa-ui.mjs`.
>
> **Três martelos são precisos no arranque, e a OS não os tem resolvidos.**
> Estão no §5 do documento, cada um com recomendação e com o custo das
> alternativas. Confirmar os três com o utilizador **antes da Fase 1**:
>
> **(a) Onde está gravada a cifra** (`S. MIGUEL · IV · MEIA-VOLTA À ESQUERDA`, D19).
> A recomendação é a **cuvette do relógio de bolso do morto** — a tampa interna
> de guarda-pó, que o jogador já tem na mão sem saber que ela abre. Custa 1 carta
> e nenhuma localidade.
>
> **(b) O que se faz com o guarda Tobin.** Um posto de vila é de um homem só, e
> Briarstone tem Wycliffe *e* Tobin. Anotado desde a OS-R1 e sem dono há três OS.
> A recomendação é **Tobin como constable do beat vizinho**, porque é a única das
> três opções que não mexe em `dep_visto_vivo` — a carta que fixa o piso da janela
> e que o veredicto lê.
>
> **(c) Por que Amos Kell não tem crédito na vila.** A recomendação é **bebe, e a
> vila sabe**.
>
> **Seguir as cinco fases pela ordem**, com o gate global (OS-R0 §7) no fecho:
> `npm run lint:prosa`, `node scripts/qa.mjs`, `node scripts/qa-ui.mjs`,
> `npm run build`. Acresce o gate específico do §7 da própria OS — e note que o
> **item 1 desse gate é o pipeline `revisar-prosa` com zero achados bloqueantes**,
> que é o gate real de qualquer OS que escreva prosa. Fechar com ata em
> `docs/historico-decisoes.md` no modelo da OS-R0 §9, acrescentando o que o §8 da
> R4 pede: os três martelos, **o orçamento de cartas gasto e o que sobra**, e as
> horas novas dos quatro perfis.
>
> Trabalhar num ramo próprio a partir de `claude/mortem-vertical-slice-zzrcto`
> (ou do ramo designado da sessão), **depois de o PR da R2/R3 estar integrado**.

---

## 2. O que a R4 vai encontrar e que as OS anteriores mudaram

**A topologia é outra desde a OS-R2.** A relojoaria é **um nó** (`relojoaria`) com
sub-locais — `corpo`, `escritorio`, `loja`, `copa`, `oficina`, `porta_beco`. Uma carta
resolve-se por `localidade` + `subLocal`; sub-local ausente significa raiz. O posto
chama-se `posto_do_guarda`. **A cinza onde o Livro I nasce está no sub-local
`escritorio`**, e a prosa dela já existe desde antes da reforma («a cinza por raspar na
grelha») — o Livro I não precisa de ambientação nova.

**A planta é a navegação.** `planta_relojoaria.js` deixou de ser desenho parado: os
cômodos apontam sub-locais (`{ no, sub }`), e só a saleta continua a ser viagem entre
nós. **Se a torre de S. Miguel virar nó**, ela entra em `mapa.js` (grupo `vila`),
`mapa_espacial.js` (posição + forma de prédio) e é desenhada pela prancha e pelo
diorama sem trabalho extra — mas confirmar que `qa.mjs` («Diorama: todo nó do mapa tem
posição e forma na maquete») continua a passar.

**A abertura tem nove passos desde a OS-R3**, e o `novaPartida()` do `qa-ui.mjs` avança
**8** vezes (`qa-ui.mjs:159`). Se a R4 acrescentar ou tirar passo de abertura — não
deveria —, a contagem vai junto, no mesmo commit.

**O coroner existe e não tem cena.** A D12 é definitiva. A OS-R3 deu-lhe o impresso, o
prazo (segunda, 16/out, dez da manhã, no Wheatsheaf) e o verbete de voz. **O prazo é
ficção**: nenhuma regra o lê, e a R4 não o liga a nada.

**A KB ganhou duas coisas no fecho da R3**, e a R4 é a primeira OS a poder usá-las: a lei
que o coroner invoca é a de **1887** (a de 1836 foi revogada por ela), e o **§4.1** sobre
*covering* — que é o lastro de por que Harlan não assina. Atenção à ressalva de fonte do
próprio §4.1: descrever a consequência é seguro; **citar o instrumento do GMC, não**.

**O banco está em sincronia, e deve continuar.** `sha256sum src/data/casos_gerados.js` =
`b96f9caf…b05a760b2`; `casos_indice.js` = `1fafae5c…b4038e29`. A R4 não toca no gerador.
Atenção: `gerar-casos.mjs` escreve **os dois** ficheiros — se algum comando o correr por
engano, restaurar os dois.

---

## 3. As armadilhas próprias desta OS

**O teto de cartas é a restrição que rege tudo.** 36 usadas (35 no catálogo +
`ev_algor` de runtime), teto 46, **dez livres** para a R4, a R5 e a R6. A R4 declara o
que gasta no §3 e não excede sem ata própria. **Contar antes de escrever, não depois.**

**Nenhuma carta nova em `temporal` ou `causal`.** É a G1, e ela não admite acréscimo — a
cadeia física do crime sai desta OS byte a byte. Os livros, a cifra e o elenco são
`comportamental`. É a guarda mais fácil de quebrar sem perceber, porque uma carta de
cifra *parece* querer falar de horas.

**As horas dos quatro perfis VÃO mudar.** A torre é nó novo com custo real de viagem, e
esta é a primeira OS da sequência que não consegue prometer o relógio intacto. As de hoje
são **17h00 · 18h00 · 14h00 · 13h00**. Registar as novas na ata, com o antes e o depois,
e confirmar que os quatro desfechos continuam a sair (Metódico → Vitória Absoluta;
Apressado → Erro Judiciário; Intuitivo → Impunidade; o quarto → Sucesso com Gafes).

**A G6 tem de virar asserção, não leitura.** As cartas de Amos Kell carregam marca de
insuficiência e o motor **recusa-as como nexo e como álibi**. Uma acusação apoiada só
numa carta dele tem de falhar, e falhar pelo código próprio da insuficiência — não por
acaso. Isso prova-se no `qa.mjs`, não a olho.

**A G7 é inegociável.** Davey Tull tem 15 anos. A chave da cifra passa por ele como
conhecimento de ofício — o que é uma cuvette, que ela abre, que se grava por dentro — e
nada de outra natureza, em nenhum tom, em nenhuma variante.

**Dois pontos técnicos precisam do `perito-forense`**, e é melhor perguntar antes de
escrever do que corrigir depois: **o que se lia num documento queimado** em 1893 (o
Livro I é papel carbonizado — o que sobrevive de pauta e de letra?) e **a anatomia da
cuvette** (como abre, o que se grava nela, com que ferramenta).

**A lição das três últimas OS, em uma linha:** o pipeline `revisar-prosa` reprovou a R3
com **três bloqueantes, um por revisor**, e cada um apanhou o que os outros dois não
viram. Correr os três não é cerimônia.

---

## 4. Estado do repositório no fecho da OS-R3

| | |
|---|---|
| Ramo | `claude/pr-os-r2-continuation-f2crpx` |
| Base | `claude/mortem-vertical-slice-zzrcto` |
| Commits | `aaf6722` · `0349f75` · `ee15f2d` · `7e6ccc8` · `f540bac` · `769c4e8` |
| Gate | build ✓ · qa.mjs CASO VÁLIDO ✓ · lint:prosa sem violação ✓ · qa-ui.mjs UI VÁLIDA ✓ |
| Cartas | 36 de 46 |

**Aberto, por OS:**

- **OS-R5** (móbeis e cartas): herda o orçamento que a R4 deixar. Se não chegar, a
  decisão — cortar carta velha ou subir o teto — é de mesa, do utilizador.
- **OS-R6:** `interrogatorio_silas` como localidade anómala (só Silas tem uma).
- **OS-R8** (passe editorial): «lavrar termo»/«lavrar queixa» é procedimento
  luso-brasileiro sob nome inglês (`abertura.js`, `dialogos.js`, `cartas.js`); a prosa do
  ponto da vitrine, que se lê de dentro da loja desde a R2; a `porta_beco` declarada sem
  sala; a varredura de Davey na oficina, que contradiz o «nem uma cadeira saiu do lugar»
  de Wycliffe agora que a oficina é sub-local do mesmo nó; três frases de efeito contra o
  teto de uma na cena do posto; e o «ontem» na amostra de Silas na bíblia de vozes.
- **OS-R9** (o gerador herda os padrões): os casos gerados ainda trazem a **mesma
  autoridade indevida que a R3 extirpou do caso-escola** — «os que respondem pela vila
  pagam os seus honorários» — e o vocativo epistolar moderno, sem subscrição. Mais
  `guarda` × `constable`.
- **Camada de apresentação:** `FundoCena.jsx` desenha um armário de arquivo onde a prosa
  diz cômoda.
- **Sem dono, e é decisão de desenho:** o prazo do inquérito com consequência mecânica. O
  utilizador martelou «ficção só, por agora» na R3; o momento de reabrir é **depois da
  R8**, com o tutorial estável, para ver se o relógio mole já carrega pressão sozinho.
- **Glossário:** não há verbete de «coroner», embora a tabela de tradução da KB (§5) mande
  grifar e glosar na primeira ocorrência. A R4 leva-o de carona no pipeline (§3.5).
