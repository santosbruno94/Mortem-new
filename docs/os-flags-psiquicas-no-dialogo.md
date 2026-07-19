# OS — Consumo das flags psíquicas no diálogo gerado (S1 Ramo A)

**Data:** 19/07/2026
**Branch:** `claude/continue-pr-73-rt6toz`
**Tipo:** OS de **design + execução faseada** de um lote **de camada narrativa** — o
derivador de árvores de diálogo (`src/gerador/dialogos_gerados.js`) passa a **ler as flags
psíquicas** que o gerador já compila (`bruto.psique.consequencias.porPessoa[id].flags`) e hoje
**nenhuma boca lê**. O motor segue cego (lê só `tagsOcultas` + seed). Continua de onde a PR #73
parou: fecha o **Ramo A da S1** (itens 2.1 + 2.3 do `pendencias-status.md`), que é a **próxima
sessão ativa** do `plano-de-sessoes.md`. A decisão de topo ("o diálogo consome o que o gerador
compila") já está no plano; esta OS a traduz em prosa possível, **mede o custo real** (Fase 0
de telemetria, risco zero) e **para nas sub-decisões de fair play**.

**Insumos normativos:** `docs/os-camada-psiquica-do-elenco.md` (ata §336, nota nº 1 — a origem
desta OS; §4.5 a compilação das flags; §8.5 o fair play do desencaixe),
`docs/os-arvore-dialogo-procedural.md` (§8 a spec do derivador; §8.6 a dureza do fair play do
diálogo), `docs/os-priors-compostos-e-variedade-do-elenco.md` (§4.3 destoante = biografia, não
caso; §4.4 anti-tell do `mente_com_calma`), `docs/kb-craft-narrativo/cliches-e-fair-play.md`,
`docs/guia-de-estilo.md` + `docs/biblia-de-vozes.md` (toda prosa nova), `CLAUDE.md` (regras
invioláveis). **Método:** cada ponto de código foi verificado no repositório vivo
(`vetores_psiquicos.js:614-676` a emissão das flags; `dialogos_gerados.js:653-752` o derivador
que as ignora; `pacote_gerado.js:1775` a chamada; `qa.mjs:3026-3066` a guarda G5/G6 que já lê as
flags no lote). Nada de memória.

---

## 0. Aviso de escopo (ler primeiro)

O gerador já faz o trabalho caro: sorteia vetor psíquico, polaridade e desencaixe, e **compila
flags de diálogo** por pessoa (OS psíquica, Fase 3). Elas **viajam no caso bruto** e são lidas
hoje **só pela guarda G5/G6 do `qa.mjs`** (anti-tell) — **nunca pela fala**. O diálogo gerado
deriva a voz de `traits` e `comportamentos` (`dialogos_gerados.js`), mas é **cego às flags
psíquicas**. Esta OS dá a boca que falta.

**O que muda:** só `src/gerador/dialogos_gerados.js` (build time) e a prosa que ele emite —
mais guardas no `qa.mjs`. **O que NÃO muda (regras invioláveis, `CLAUDE.md`):** o motor lê só
`tagsOcultas` + seed; zero LLM/rede/`Math.random` em `logic`/`data`/`gerador`; toda variação por
`hashString` salgado; o replay byte a byte do `qa.mjs`; o veredicto não ganha nem perde nada
(psicologia jamais condena — OS psíquica §2).

**A regra que domina esta OS (o risco real):** a flag psíquica **não pode virar um tell**. Se a
fala do réu ficar reconhecivelmente "mais calma" ou "mais defensiva", o jogador atento resolve
o caso pela textura da prosa, não pela matéria — exatamente o furo que a OS priors (§4.4) gastou
uma fase para fechar no plano dos dados (o `mente_com_calma` do réu é pareado por
`mente_com_calma_periferica` de inocentes; a guarda G5 exige ≥60% de portadores inocentes). **A
realização em prosa tem de preservar essa paridade**: o que a flag do culpado faz na fala, a
flag-irmã do inocente faz igual. Por isso o lote **para nas decisões §8** — o agente não decide
sozinho o quanto cada flag aparece.

---

## 1. Fotografia: as flags que o gerador compila e o diálogo ignora

**Onde nascem** (`vetores_psiquicos.js:614-676`, campo `porPessoa[id].flags`):

| Flag | Em quem | Gatilho de sorteio |
|---|---|---|
| `mente_com_calma` **ou** `mente_sob_pressao` | o réu | acoplada ao cenário (premeditado ⇒ calma mais provável) |
| `gatilho_de_complexo:<tema>` | o réu; a isca plena; todo destoante nato | `<tema>` = `vetor.temaGatilho` (medo central) |
| `omite_por_decoro` | não-assassino de polaridade **passiva** | chance por classe (decoro é performático por classe, 1893) |
| `acusa_com_fervor` | não-assassino de polaridade **ativa** | ½ (projeção) |
| `defende_demais_o_morto` | quem tem vetor de vínculo (zelador/amante/devoto) | ½ |
| `mente_sob_pressao` | a **isca plena** (`falsoDestoanteId`, só regime 2) | forçada (tem o que esconder — não o crime) |
| `mente_com_calma_periferica:<tema>` | inocente não-isca | ~1/6; `<tema>` refutável por matéria (dívida, ligação amorosa, desonestidade miúda) |

Os 13 `temaGatilho` são o medo central de cada vetor (`inutilidade`, `queda_de_status`,
`erro_em_publico`, `pecado_exposto`, `obra_arruinada`, `substituicao`, `voltar_a_ser_ninguem`,
`ficar_preso`, `afronta_impune`, `invisibilidade`, `irrelevancia`, `miseria_a_vista`,
`perder_o_chao`).

**Onde morrem hoje:** o pacote (`pacote_gerado.js:1799-1819`) **não** carrega as flags — elas
ficam no `bruto` (build time). O derivador roda em build time (`pacote_gerado.js:1775`,
`derivarDialogos({ bruto, … })`), então **tem o `bruto` na mão** e pode ler
`bruto.psique.consequencias.porPessoa[id].flags` **sem nenhum novo canal** — consome ao gerar,
emite prosa, e o pacote continua carregando **só prosa** (nenhuma flag em `src/data`, guarda de
não-vazamento intacta).

**A distinção que estrutura o consumo (OS priors §4.3):** o `gatilho_de_complexo` entrega
**biografia, não caso** — quebra a compostura e revela o medo central, **jamais** janela/causa/
nexo. É **fair-play-safe por construção**. As demais flags colorem beats existentes e pedem a
paridade do §0.

---

## 2. Mapa proposto: flag → superfície de diálogo

Cada flag tem uma **boca natural** já existente na árvore (abertura / b1 / b2 / evasiva /
confronto). O consumo é **aditivo e conservador**: um tento de prosa no beat que já existe,
nunca um nó novo de mecânica (o tom segue sem dente — não-objetivo da OS de diálogo).

| Flag | Boca proposta | O que a fala faz | Guarda de fair play |
|---|---|---|---|
| `gatilho_de_complexo:<tema>` | **nó de confronto novo, sem carta** (a "pergunta que desmonta a compostura") ou tento na evasiva | o suspeito perde a compostura e entrega **biografia** (o medo central em vocabulário de época) | entrega SÓ biografia; nunca toca janela/causa/nexo; presente no réu **e** em inocentes (não é tell) |
| `acusa_com_fervor` | tento no **b2 firme** ("diga um nome") | o inocente projeta e **aponta alguém** com fervor — engana o apressado | aponta um inocente qualquer, nunca "resolve"; o réu **não** tem esta flag, mas o jogador não sabe disso |
| `omite_por_decoro` | tento na **evasiva** / no b2 oblíquo | recusa por decoro ("isso não se diz"), não por culpa | omissão de decoro, não de caso; comum a vários; nunca esconde matéria |
| `defende_demais_o_morto` | tento no **b2 cordial** ("que homem/mulher era") | defende o morto além do pedido (vínculo) | excesso de afeto, não prova; distribuído por vetor de vínculo |
| `mente_com_calma` (réu) × `mente_com_calma_periferica` (inocente) | tento no **b1** (o paradeiro) e no confronto do álibi | a mentira sai **serena** — **e a do inocente também** | **paridade obrigatória (§0)**: a mesma têmpera de calma nas duas; a redação da mentira já é partilhada (`cartaDeAlibi`) |
| `mente_sob_pressao` (réu sem calma; isca plena) | tento no **b1** / confronto | a mentira sai **tensa** (hesita, repete) | também partilhada: inocentes sob pressão existem; nunca exclusiva do réu |

**Princípio-mestre:** **nenhuma flag muda a fala de um jeito que só o culpado teria.** Toda
têmpera que a flag do réu produz tem uma flag-irmã que a produz num inocente. O que a flag muda é
a **cor** (biografia, projeção, decoro, afeto, calma/tensão), nunca o **conteúdo probatório**.

---

## 3. A garantia de fair play (o núcleo — e o que trava a execução)

Três invariantes, herdadas da OS psíquica §8.5 e da OS priors §4.3/§4.4, que a prosa **tem de
provar**, não só respeitar:

1. **Biografia ≠ caso.** O `gatilho_de_complexo` e todo tento de flag entregam observação/
   alegação sobre a **pessoa** (medo, vergonha, afeto, projeção), nunca sobre janela, causa ou
   nexo. O `lint-prosa` já cobre as falas geradas; some-se guarda de que a fala do gatilho não
   cite hora/lugar/instrumento da morte.
2. **Paridade de têmpera (o anti-tell).** Se `mente_com_calma` (réu) rende calma na fala, então
   `mente_com_calma_periferica` (inocente) rende **a mesma** calma — o jogador não pode separar
   réu de inocente pela serenidade. A guarda G5 já garante a **distribuição** (≥60% dos
   portadores de calma são inocentes); esta OS acrescenta a guarda de que a **realização em
   prosa** é indistinguível entre as duas (mesma família de tentos).
3. **Presença cruzada.** Toda "cor" que aparece no réu tem de aparecer, no lote, em inocentes
   também — e vice-versa. Nenhuma flag é assinatura de papel.

**Por que isto trava a execução:** decidir *quanto* cada flag aparece (um tento discreto? uma
fala inteira? um nó próprio?) é decisão de **dosagem de fair play** — é do usuário (`CLAUDE.md`:
"a decisão é do usuário; o agente apresenta opções cruzadas com o KB de fair play, não decide
sozinho"). O agente recomenda em §8; não escolhe.

---

## 4. Guardas e QA novas (contrato que muda no mesmo commit)

- **Cobertura:** para toda pessoa com flag consumível, a fala correspondente existe na árvore
  (nenhuma flag compilada sem boca; nenhuma boca inventada sem flag).
- **Não-vazamento reforçado:** a fala do `gatilho_de_complexo` **não** cita
  janela/causa/nexo (lista de termos proibidos: hora da morte, nome do instrumento fatal, o
  cômodo do corpo) — grep automatizado, no espírito do lint L1 da OS psíquica.
- **Paridade de têmpera:** num lote de ≥50 seeds, a família de tentos usada por
  `mente_com_calma` (réu) é **a mesma** usada por `mente_com_calma_periferica` (inocente) —
  interseção não-vazia e nenhum tento exclusivo de um lado.
- **Replay:** mesma seed → mesma árvore, byte a byte (o cheque já existe; a árvore vai junto).
- **Estrutura intacta:** os cheques da OS de diálogo (`qa.mjs`) — 4 tons por beat, bijeção
  confrontos↔reacoesProva, nenhum nó órfão, toda `requerCarta` existe — continuam verdes com os
  nós/tentos novos.

---

## 5. Custo e risco

- **Re-geração obrigatória:** qualquer mudança em `dialogos_gerados.js` muda os bytes de cada
  pacote → **re-gerar os 21** (`npm run gerar:casos`) + re-commit `casos_gerados.js`, senão o
  replay byte a byte do `qa.mjs` falha. (A Fase 0, por ser só telemetria, **não** toca o gerador
  e **não** re-gera.)
- **Prosa nova = pipeline obrigatório:** todo tento/nó novo passa por `redigir-prosa` +
  `revisar-prosa` (editor-crítico + perito-forense + fiscal-continuidade), zero bloqueantes,
  antes do commit — é o caminho que `dialogos.js` e o próprio derivador já percorreram.
- **Risco de tell:** o maior. Mitigado pelas guardas §4 e pela paridade §3. Cada fase entrega
  **uma** família de flags, para o playtest medir o tell antes da seguinte.
- **`qa-ui.mjs`:** a superfície de diálogo procedural não é rota canônica do `qa-ui` hoje; se
  algum nó novo entrar numa rota checada, o contrato de textos/seletores exige atualizar o QA no
  mesmo commit.

---

## 6. Faseamento recomendado (incrementos jogáveis)

1. **Fase 0 — telemetria (risco zero, NÃO toca o gerador)** *(esta entrega)*: o `qa.mjs` **mede
   e reporta** a cobertura de cada flag no lote — quantos réus calmos × tensos, quantos inocentes
   com calma periférica, quantos `acusa_com_fervor`/`omite_por_decoro`/`defende_demais_o_morto`,
   quantas pessoas com `gatilho_de_complexo`, e **quantas flags viajam hoje sem boca**. Calibra as
   fases seguintes com número real. **Só leitura; nenhum byte de pacote muda.**
2. **Fase 1 — `gatilho_de_complexo`** *(a mais segura; biografia por construção)*: o nó/tento da
   pergunta que desmonta a compostura, presente no réu **e** em inocentes. Prosa pelo pipeline;
   re-gerar; replay; guarda de não-vazamento (biografia ≠ caso).
3. **Fase 2 — projeção e decoro** (`acusa_com_fervor`, `omite_por_decoro`): tentos no b2/evasiva.
   Pipeline; re-gerar; guarda de presença cruzada.
4. **Fase 3 — o par calma/tensão** (`mente_com_calma` × `mente_com_calma_periferica`;
   `mente_sob_pressao`; `defende_demais_o_morto`): **a mais delicada** — a paridade de têmpera é o
   coração do anti-tell. Pipeline; re-gerar; guarda de paridade + playtest dirigido de tell.

**Definição de pronto de cada fase:** `qa.mjs` verde (os 4 desfechos intactos), replay byte a
byte, `qa-ui` verde se a superfície mudar, build limpo; prosa nova pelo pipeline `revisar-prosa`
com zero bloqueantes.

---

## 7. Cruzamentos

- **× OS de diálogo (`os-arvore-dialogo-procedural.md`):** esta OS é a realização da "Realização
  de prosa" (§4.3) para a camada psíquica; usa o mesmo `variante(pool, sal)` e a mesma regra de
  voz (§8.5).
- **× OS priors (`os-priors-compostos-*`):** a paridade calma/tensão (§3) é o anti-tell que a F3
  dos priors construiu nos dados; esta OS o estende à prosa. A telemetria da Fase 0 conversa com
  a guarda G5.
- **× P11 (repensar a Mesa) e × eco de interferência pós-caso:** os outros dois pedaços do Ramo A
  da S1 — ficam para lotes próprios (o eco ainda fala pelo legista, que não existe no gerado;
  decisão registrada no plano). Não bloqueiam esta OS.
- **× P9 Via B (contra-hipótese):** independente; a Via B toca o gerador de vestígios, esta OS
  toca só a fala.

---

## 8. As decisões que travam a execução (resumo para o usuário)

| # | Decisão | Recomendação do agente |
|---|---|---|
| **FLAG-dose** | Dosagem: cada flag vira **um tento discreto** no beat que já existe, ou uma **fala/nó próprio** mais destacado? | **Tento discreto** (aditivo, menor risco de tell; o gatilho_de_complexo é a única exceção que pede nó próprio) |
| **FLAG-gatilho** | O `gatilho_de_complexo` entra como **nó de confronto sem carta** (uma pergunta clicável que quebra a compostura) ou como **tento na evasiva**? | **Nó de confronto sem carta** (dá agência ao jogador; é biografia, fair-play-safe; enriquece o interrogatório) |
| **FLAG-ordem** | Rodar as fases na ordem §6 (gatilho → projeção/decoro → par calma) ou priorizar outra? | **Ordem §6** (do mais seguro ao mais delicado; o par calma por último, com playtest de tell) |
| **FLAG-fase0** | Rodar antes a Fase 0 (telemetria: quanto de cada flag há no lote) sem tocar o gerador? | **Sim** (zero risco; calibra a dosagem com dado real — já executada nesta entrega) |
| **FLAG-escopo** | Esta OS cobre **só as flags de diálogo**, deixando P11 e o eco de interferência para lotes próprios do Ramo A? | **Sim** (um incremento jogável por vez; P11 e o eco têm decisões próprias) |

**Regra de parada:** nenhuma linha de `dialogos_gerados.js` que **emita prosa de flag** muda
antes de você responder FLAG-dose, FLAG-gatilho e FLAG-ordem. A Fase 0 (telemetria) já está
executada — não toca o gerador nem o desfecho.

---

## 9. Decisões e resultado

**Decisões do usuário:** *(a preencher quando o §8 for respondido — mesmo padrão do §9 da
`os-p9-ancora-hibrida.md`.)*

**Fase 0 executada** (telemetria no `qa.mjs`, commit próprio; risco zero, só mede; `CASO
VÁLIDO` sem regressão, build limpo). Lote de **200 casos**:

| Flag | Contagem | Leitura |
|---|---|---|
| réu `mente_com_calma` × `mente_sob_pressao` | **59 × 141** | a calma do réu é a minoria (acoplada ao cenário) |
| inocente `mente_com_calma_periferica` | **197** | **77,0% dos "mentirosos calmos" são inocentes** — folga confortável sobre o piso G5 de 60% |
| `acusa_com_fervor` | 300 | projeção farta — boca natural no b2 firme |
| `omite_por_decoro` | 301 | decoro farto — boca na evasiva |
| `defende_demais_o_morto` | 143 | vínculo — boca no b2 cordial |
| isca `mente_sob_pressao` (regime 2) | 135 | a isca plena |
| `gatilho_de_complexo` — réu / inocente | **200 / 185** | **161/200 casos têm ≥1 gatilho inocente** |
| total | **1661 flags em 1422 pessoas** | **0 lidas pelo `dialogos_gerados.js`** hoje |

**Achado que a telemetria impôs (e que a Fase 1 tem de tratar):** o `gatilho_de_complexo` está
no **réu em 200/200** casos, mas só **161/200** têm um gatilho **inocente** — logo em **~39
casos (20%) o réu é o ÚNICO com gatilho**. Se a Fase 1 realizar o gatilho como uma "compostura
que se desmonta" **visível**, esses 20% viram **tell parcial** ("só um perde a linha ⇒ é ele").
Duas saídas, a decidir na Fase 1: (a) realizar o gatilho **só quando há ≥2 no caso** (o portador
solitário fica mudo — perde-se cor, ganha-se fair play); ou (b) dar gatilho de **textura** a mais
inocentes na compilação (toca o gerador, re-gera — maior custo). Recomendação preliminar: **(a)**
— resolve na própria camada de fala, sem tocar o gerador, e é reversível. A paridade calma/tensão
(§3), por outro lado, **já vem saudável** dos dados (77% × 60% de piso).

**Estado do lote:**
- ✅ **Fase 0** (telemetria) — em código, `qa.mjs`, sem regressão.
- ⏸️ **Fases 1–3** (realização em prosa) — **aguardam as decisões §8** (FLAG-dose, FLAG-gatilho,
  FLAG-ordem). Gatilho: ordem do usuário para abrir a Fase 1.

— fim da OS (aberta nas decisões §8) —
