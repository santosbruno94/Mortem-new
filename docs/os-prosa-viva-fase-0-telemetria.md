# OS Prosa Viva — Fase 0: telemetria da monotonia (relatório de mesa)

Data: 2026-07-23. Companheiro do plano [`os-prosa-viva-e0-plano.md`](./os-prosa-viva-e0-plano.md)
(Fase 0). Este documento **não é design nem prosa**: é a leitura de mesa que transforma
"parece repetitivo" em número por superfície, para o autor decidir D1–D4 (§6 do plano)
com dado, não com palpite. Nada aqui altera um byte dos casos embarcados — a Fase 0 só
mede.

**Como reproduzir:**

```
npm run telemetria:monotonia            # mede os 31 casos embarcados
node scripts/telemetria-monotonia.mjs 4000     # + amostra o gerador (teto do pool)
node scripts/telemetria-monotonia.mjs --verbose  # mostra o esqueleto mais repetido
```

Determinístico (a amostra usa seeds `mc_1..N`); build time puro, jamais importado pelo
runtime; não usa `Math.random`/`Date.now`.

---

## 1. O método em uma página

O script lê os 31 casos embarcados (`src/data/casos_gerados.js`) e, para cada **superfície**
de prosa gerada, conta quantas frases **distintas** o lote produz de fato. O truque que
torna o número honesto é o **esqueleto**: antes de contar, mascaram-se os nomes próprios
(vítima, suspeitos, as 6 vilas, os 6 constables) e os números. Duas aberturas em que só
muda o nome da vítima **não são duas variantes — são o mesmo molde**, e passam a contar
como uma. Interpolações estruturais (`{detective.surname}`, `[[gen_lesao_fatal]]`) são
constantes entre casos e ficam intactas — não inflam a contagem.

Três números por superfície:

| Coluna | O que diz |
|---|---|
| **var/slot** | Esqueletos distintos por slot. ≈1 = molde de variante única. |
| **pior** | Variantes no slot mais congelado (revela um passo/estado fixo escondido numa média saudável). |
| **reúso** | Instâncias ÷ distintas: **quantas vezes, em média, cada frase escrita é relida** ao longo dos 31 casos. É a monotonia sentida por quem joga vários casos. |

A tabela é ordenada por **reúso decrescente** — o topo é a pauta de prioridade.

**Caveat de honestidade (o número erra para o lado seguro):** profissão e relação da
vítima/suspeitos **não** são mascaradas (são substantivos comuns), então dois casos com o
mesmo molde e profissões diferentes contam como 2 esqueletos. A monotonia real é **pelo
menos** a medida, nunca menor. Além disso, medir a prosa de uma localidade **inteira**
subestima uma frase de abertura congelada dentro dela (ver `localidade:corpo`, §3).

---

## 2. O retrato dos 31 casos embarcados

Recorte das superfícies de maior exposição (tabela completa no script):

```
SUPERFÍCIE                  slots     inst   dist  var/slot  pior    reúso  diagnóstico
dialogo:opcao                   4     3100     17       6.8     5    182.4  MUITO REPETIDO
abertura.titulo                 6      186      6       1.0     1     31.0  MUITO REPETIDO
carta:gen_rigor                 4      124      4       1.0     1     31.0  MUITO REPETIDO
carta:gen_reacao_vital          1       26      1       1.0     1     26.0  MUITO REPETIDO
carta:gen_segredo               1       48      2       2.0     2     24.0  MUITO REPETIDO
carta:gen_livores               2       62      3       1.5     1     20.7  MUITO REPETIDO
localidade:cena                 1       31      2       2.0     2     15.5  MUITO REPETIDO
eco                             7      210     14       2.0     2     15.0  MUITO REPETIDO
localidade:casa                 2      272     23      11.5     2     11.8  repetido
suspeito:descricao              1      155     17      17.0    17      9.1  repetido
carta:gen_lesao_fatal           1       31      7       7.0     7      4.4  moderado
carta:gen_movel                 1       31     11      11.0    11      2.8  moderado
localidade:delegacia            2       62     24      12.0     1      2.6  moderado
dialogo:fala                   51     1863    779      16.0     1      2.4  variado
carta:gen_instrumento           1       26     14      14.0    14      1.9  variado
localidade:vizinhanca           2       62     32      16.0     1      1.9  variado
localidade:corpo                2       62     38      19.0    13      1.6  variado
```

### Detalhe — a abertura passo a passo (é a E1, prioridade nº 1)

```
caulfield       1 dist · campeão 31× · CONGELADO (todo caso lê igual)
chamado         1 dist · campeão 31× · CONGELADO (todo caso lê igual)
carta          14 dist · campeão 11× · 14 variantes de esqueleto
transformacao   1 dist · campeão 31× · CONGELADO (todo caso lê igual)
chegada         1 dist · campeão 31× · CONGELADO (todo caso lê igual)
briefing       18 dist · campeão  8× · 18 variantes de esqueleto
```

**Quatro dos seis passos da abertura são byte-idênticos nos 31 casos.** Só variam o passo
`carta` (porque a profissão/forasteiro da vítima muda) e o `briefing`. Confirma com número
a causa nº 1 do plano: "todo caso abre com os mesmos ~8 parágrafos".

---

## 3. O teto do pool (amostra de 4000 casos do gerador)

O reúso alto nos 31 embarcados tem **duas origens diferentes**, e só o teto do pool as
separa — esta é a leitura que decide D2:

- **Banco raso na fonte** (o gerador **não sabe** dizer de outro jeito): escrever mais
  variante resolve. Tetos medidos:

  | Superfície | Teto do pool (distintas em 4000 casos) |
  |---|---|
  | `carta:gen_reacao_vital` | **1** (uma frase, sempre) |
  | `localidade:cena` | **2** |
  | `carta:gen_segredo` | **2** |
  | `carta:gen_livores` | **3** |
  | `carta:gen_rigor` | **4** (uma por estado fisiológico) |
  | `eco` | **14** (2 por chave × 7 chaves) |
  | `dialogo:opcao` | **17** (só 17 molduras de pergunta, jamais outra) |
  | `suspeito:descricao` | **17** |

- **Banco rico, subamostrado nos 31** (a fonte tem fôlego; faltou sorteio/decorrelação —
  alvo da E5, não de escrita nova):

  | Superfície | Teto do pool |
  |---|---|
  | `localidade:vizinhanca` | **3828** |
  | `dialogo:fala` | **3201** |
  | `localidade:corpo` | **425** (mas `pior=25`: a frase de abertura "jaz… nada se tocou" é rasa dentro do rico) |
  | `localidade:delegacia` | **332** |
  | `carta:gen_instrumento` | **28** · `carta:gen_movel` **18** · `carta:gen_motivo` **21** |

**Correções que a telemetria faz ao palpite do plano:** `PROSA_LESAO` (`gen_lesao_fatal`)
**não** é de variante única — tem teto 8 (a sede da ferida varia); e `FRASE_TRAIT`
(`suspeito:descricao`) tem 17, não 3. Os mártires forenses de verdade são `reacao_vital`
(1), `rigor` (4, um por estado), `livores` (3) e `cena` (2).

---

## 4. A pauta E1–E5, agora com número

A telemetria **confirma a ordem do plano** e afina o alvo dentro de cada etapa:

| Etapa | Superfícies-alvo (com o número que justifica) | Natureza do trabalho |
|---|---|---|
| **E1 — abertura** | `abertura`: 4 de 6 passos CONGELADOS (`pior=1`), reúso 5,2; `abertura.titulo` reúso 31 | Slots de fragmento (escrita + combinatória) |
| **E2 — corpo/forense** | `gen_reacao_vital` (teto 1), `gen_rigor` (4/estado), `gen_livores` (3), `localidade:corpo` frase de abertura (`pior=25`) | Escrita nova sob `perito-forense` |
| **E3 — móbil/instr./cena** | `localidade:cena` (teto 2, reúso 15,5); `gen_segredo` (teto 2, reúso 24); `gen_visto_vivo` (3); ampliar `gen_movel`/`gen_motivo`/`gen_instrumento` (já 18–28) | Combinatória de slots |
| **E4 — ecos/diálogo** | `eco` (2/chave, reúso 15); `dialogo:opcao` (teto 17, reúso 182 — **o campeão de reúso**) | Expansão medida do frame |
| **E5 — decorrelação+guarda** | `localidade:corpo`/`vizinhanca`/`dialogo:fala`/`delegacia`: banco rico (teto 300–3800) mas reúso ≥1,6 nos 31 → falta sorteio | Migrar picks para `hashDecisao` + guarda |

**Ponto de atenção do contrato:** `dialogo:opcao` são os **rótulos clicáveis** dos nós de
diálogo — o `qa-ui.mjs` clica textos exatos (CLAUDE.md, "Contrato com o qa-ui.mjs"). Mexer
neles na E4 exige atualizar o QA no mesmo commit.

---

## 5. Recomendações para D1–D4 (a decisão é do autor)

- **D1 — assinatura da abertura.** Os 4 passos congelados são justamente a assinatura de
  série (pensão da Sra. Potts, o chamado, a mesa que vira gabinete, a chegada). **Recomendo
  manter `caulfield` e `transformacao` como assinatura estável** e abrir slots em `chamado`
  (modo do chamado), `chegada` (a primeira vista da vila) e `briefing` — o lado da vila,
  que já muda de forma pela Vila Viva. Ganha-se variação sem perder o "221B" de Harlan.
- **D2 — teto de variantes por superfície.** Com os tetos do pool na mão, recomendo **3–4
  variantes por slot** nas superfícies de banco raso (`reacao_vital`, `livores`, `cena`,
  `segredo`, `eco`), priorizando **combinatória de slots** onde couber (o `briefing` e o
  `corpo` compõem-se; o `rigor` é preso ao estado, então 3–4 recortes por estado). Não
  perseguir número alto em `vizinhanca`/`corpo`/`dialogo:fala`: lá o banco já é fundo; o
  trabalho é E5 (sorteio), não escrita.
- **D3 — slots × listas.** A telemetria ratifica slots: `localidade:vizinhanca` (montada
  por slots na Vila Viva E2) tem teto 3828 contra os 2–17 das superfícies de lista rasa.
  **Recomendo slots.**
- **D4 — bump de golden (E5).** Sem novidade: a decorrelação re-gera os 31 casos (byte
  novo). A telemetria só reforça que o ganho existe (superfícies de banco rico com reúso
  ≥1,6 por falta de sorteio).

---

## 6. Guarda anti-regressão (opcional — a decidir com o autor)

O script já produz o índice que uma guarda no `qa.mjs` consumiria: registrar o **reúso
médio por superfície** como baseline e reprovar uma etapa futura que **aumente** o reúso de
uma superfície tocada (regressão de monotonia). **Não foi ligada** nesta Fase 0 — é decisão
D2-adjacente (define-se o teto antes de travar). Quando o autor quiser, liga-se em um commit
próprio, importando `medir()` do script e comparando contra um baseline versionado.

---

## 7. Pronto quando — checklist da Fase 0

- [x] Script de mesa (`scripts/telemetria-monotonia.mjs`) que reporta distintas e reúso por
      superfície dos 31 casos embarcados, cobrindo abertura, lesão/rigor/livor, corpo, móbil,
      segredo, instrumento/âncora, delegacia/posto, encontro, casas, ponto de cena, ecos e o
      frame do diálogo.
- [x] Relatório de mesa datado (este documento) com a tabela do índice e a pauta E1–E5.
- [x] `npm run build` limpo · `node scripts/qa.mjs` verde (nada em `src/` mudou).
- [ ] **Decisões D1–D4 tomadas pelo autor** com o número à mão (§5) — pendência humana.
- [ ] Guarda opcional no `qa.mjs` — a ligar depois de D2, se o autor quiser.
