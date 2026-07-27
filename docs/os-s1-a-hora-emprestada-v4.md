# OS-S1 — "A Hora Emprestada", v4: o sexto homem e a mão do oficial

**Tipo:** ordem de serviço executável. Deriva da **Proposta Mestra v4** (26/07/2026),
que consolida e supersede as propostas v3, v3.1, o dossiê de elenco e teia e o
adendo de Agnes.
**Ramo:** `claude/case-change-proposal-7vwvd3`.
**Governa-se por:** `docs/os-r0-mestra-reforma-hora-emprestada.md` (invariantes G1–G12).

A proposta trouxe vinte e um pontos de decisão com recomendação. **O martelo desta
OS aceita as vinte e uma recomendações em bloco**, com uma divergência declarada
(§4). Reabrir qualquer uma exige ata própria.

---

## 1. O que muda, em uma linha

O caso deixa de ser uma estrela (todos ligados só à vítima) e passa a ser uma teia
tecida por dois teares: **o Livro dos Empréstimos** (a economia da dívida, que liga
cada nome a cada nome) e **a hora** (toda distorção de testemunho serve a empurrar
a atenção da noite de sexta para a manhã de sábado). Entra um sexto suspeito com
rosto — **Nathan Herrick, recoveiro** —, e o oficial deixa de ser um homem parado
no sábado: passa a agir durante o inquérito, em três degraus.

**A cadeia física do crime não se move um byte** (G1): hora 21h, buril,
vermelho-de-polir, lasca de vidro na bainha, roda de contagem, relógio de bolso,
rigor, livor, reação vital. Nenhuma carta nova entra em domínio `temporal` ou
`causal`.

---

## 2. Decisões marteladas (PD-01 a PD-21)

| # | Ponto | Resolução |
|---|---|---|
| PD-01 | Herrick no elenco e no veredicto | **Sim**, sexto suspeito, `inocente_segredo` (`penhor_recolhido`) |
| PD-02 | Herrick é a boca da briga de Walter | **Sim** — `dep_briga_walter` passa a ter procedência nomeada |
| PD-03 | Gatilho da prisão | **Extração de `dep_avistamento_padeiro`** — é o lead que abre a cela |
| PD-04 | Onde vive o registro da agiotagem | **Gaveta com chave da escrivaninha do escritório** |
| PD-05 | "L.W." no livro | **Sim** — iniciais e soma; a leitura é do jogador |
| PD-06 | A explicação da luz | **`luz_esquecida` fica**; o epílogo ganha `homem_da_madrugada` ao lado |
| PD-07 | Trilhos (anéis de ato) | **Parcial — divergência declarada em §4** |
| PD-08 | Origem da dívida de Silas | **A doença e o enterro da mulher** |
| PD-09 | O vestígio fresco da cela | **A cera parda na tábua da tarimba** |
| PD-10 | Teto de cartas | **Sobe de 42 para 51**; `GR7-7` recorta para o novo número |
| PD-11 | Autoria da morte de Herrick | **Silas, enforcamento encenado** |
| PD-12 | A reversão da loja (D4) em cena | **Sim, pela boca de Pettigrew** |
| PD-13 | Grey aprende que detonou os relógios | **Cena condicional** (o caderno de pesos + falar com Grey) |
| PD-14 | A moeda da coação de Wick | **Sim** — linha "—W." antiga e paga no livro |
| PD-15 | O tique dos tipos de Wycliffe | **Entra como regra de voz** (só Silas com nome e ofício inteiros) |
| PD-16 | A natureza do caso de Agnes | **O caso que ela terminava; a despedida no topo do maço** |
| PD-17 | O pretendente | **Sem nome e sem rosto: uma letra de Moorford** |
| PD-18 | Quando o jogador pode saber das cartas | **O fio nasce na cela; o maço aparece no confronto dela** |
| PD-19 | O delator é Walter | **Sim** — a delação é premeditada (veio com as duas cartas) |
| PD-20 | Arthurs citou a fonte na ceia | **Sim — "sangue meu", sem nome** |
| PD-21 | Mecânica da ponte E15 | **Estado de confronto** (`degraus` com `contaEntre` cruzando árvores), sem carta nova |

**Reaberturas declaradas:** R5 §5(d) (agiotagem sem carta própria), D5 (móbil de
Agnes ambíguo — a V2 preserva o espírito e eleva o teto da ambiguidade), G11 (teto
de 46 cartas).

---

## 3. Orçamento de cartas

| Peça | Cartas |
|---|---|
| Catálogo antes desta OS (com `ev_algor`) | 42 |
| Frente A: `ev_livro_emprestimos` | +1 |
| Herrick: `ev_pegada_argila`, `alibi_herrick`, `dep_cela_herrick` | +3 |
| Interferências: `dep_retratacao_wick`, `ev_esconderijo_vazio` | +2 |
| A cela: `dep_achado_cela`, `ev_cera_tarimba` | +2 |
| Agnes: `ev_cartas_do_passado` | +1 |
| **Total** | **51** |

`GR7-7` passa de `=== 42` para `=== 51`. O teto da G11 (46) **sobe para 51 por
decisão de mesa (PD-10)**, com o gate honesto declarado: o mural a 51 cartas foi
percorrido no `qa-ui.mjs`.

---

## 4. Divergência declarada — PD-07 (anéis de ato)

A proposta pede que o mapa endureça em anéis: Ato I só a relojoaria e a saleta; o
posto, a estalagem, a papelaria e o moinho só no Ato II; a torre e a cela no Ato III.

**Executa-se só o anel do Ato III.** A cela nasce fechada e abre pela extração de
`dep_avistamento_padeiro` (PD-03) — a prisão de Herrick é a dobradiça, e ela existe
em jogo. Os demais anéis **não** se implementam nesta OS, e a razão é dura:

> **A G10 ("sem beco sem saída") e a guarda `GR4-5` exigem que a torre nasça aberta
> e que nenhuma cadeia de descoberta dependa de ordem única.** Fechar o posto, a
> estalagem, a papelaria e o moinho atrás de leads do Ato I reescreve o gate de QA
> da interface inteira (as três rotas canônicas do `qa-ui.mjs` viajam a esses nós
> na primeira hora de jogo) e transforma a topologia do caso — trabalho de OS
> própria, com ata própria, e não efeito colateral desta.

A proposta já previa esta fricção («G10 ressalvada por ata»). A ata fica aqui, e o
anel do Ato I/II segue **aberto**, como hoje.

---

## 5. O elenco novo

### Nathan Herrick, 41 — recoveiro (`nathan_herrick`)

Papel dramático novo: **`bode_expiatorio`**. Recoveiro em terceira geração: as sacas
de Grey, os embrulhos da papelaria — e as cartas que não iam no saco —, as caixas
da relojoaria entregues à porta dos fundos. O inverno mau, o empréstimo sobre a
mula, o penhor de setembro; desde então pede as horas a quem passa.

- **Sexta, ~19h:** foi à porta pedir prazo e não chegou a bater — do degrau apanhou
  uma frase da briga de dentro (PD-02: é ele a boca de `dep_briga_walter`).
- **Sábado, ~4h45:** a corrida das sacas de Grey; achou a porta já forçada, o
  lampião aceso e o morto; recolheu **o próprio penhor** da gaveta puxada, deixou
  meia pegada de argila sobre as lascas e fugiu.
- **Sábado à tarde:** lavrou a ocorrência da briga — a autoinserção do homem com
  medo de ter sido visto.

`veredictoEsperado: 'inocente_segredo'`, `segredo: 'penhor_recolhido'`. O álibi dele
(a estrada, a carroça, a feira) cai pelo próprio rastro — `ev_pegada_argila`.

---

## 6. As três interferências (Regras de Justiça R1–R6)

Nenhum anúncio nomeia Silas: o diário registra efeitos; a autoria é leitura do
jogador (R3). Todas usam a máquina de interferência que o pacote já suporta
(`interferencias.eventos` + `ecosInterferencia`), sem uma linha nova de motor.

| Evento | Tipo | Gatilho observável | Efeito |
|---|---|---|---|
| `coacao_wick` | `intimidar_testemunha` | visita à papelaria | destrói `dep_mulher_viela`; nasce `dep_retratacao_wick` |
| `corrida_a_torre` | `destruir_evidencia` | prova apresentada a Silas | destrói `ev_livro_ii`; nasce `ev_esconderijo_vazio` |
| `silenciar_herrick` | `silenciar` | prova apresentada a Herrick | destrói `dep_cela_herrick`; nascem `dep_achado_cela` e `ev_cera_tarimba` |

**R2 (saldo ≥ 0):** nenhuma das três toca carta de que a acusação dependa. A janela
fecha pelo corpo, a causa pelo corpo, o nexo pelo estojo; `silenciamento` tem
redundância tripla (`ev_livro_ordens`, `ev_livro_ii`, `corrob_pettigrew`).

**R1 (o improviso é mais grosseiro que o crime original):** o esconderijo violado
traz riscos frescos e sebo novo; a cela traz o sulco horizontal com equimose viva
por baixo do oblíquo sem reação vital, e a cera parda na tábua.

**G4 (papel lavrado não morre com a boca):** quem tomou o termo de Herrick antes de
o confrontar guarda o papel; a morte não o apaga.

---

## 7. A cela é auto de exame, não segundo mural

Escopo contido, como a proposta manda: `dep_achado_cela` (o termo do achado, com a
leitura de Harlan no vocabulário que `catalogo_causas.js` já tem) e `ev_cera_tarimba`
(o vestígio fresco, PD-09). **Nenhum segundo inquérito em cena** — o veredicto sobre
Herrick é do segundo inquérito de Foy, fora de cena (D12).

---

## 8. Guardas novas e recortadas

- `GR7-7` — teto de cartas: `=== 51` (era `=== 42`), por PD-10.
- `GRS1-1` — **o sexto homem fecha o veredicto**: `nathan_herrick` está em
  `perifericos`, tem álibi, tem carta de móbil, e o rastro que o desmente revela
  o segredo esperado.
- `GRS1-2` — **as três interferências obedecem à R2**: nenhuma carta destruída é
  pilar da acusação do Metódico.
- `GRS1-3` — **a autoria não se anuncia**: nenhum `anuncio` de interferência nomeia
  suspeito algum.
- `GRS1-4` — **o motor continua cego**: `veredicto.js`/`acusacao.js` não citam
  interferência (extensão da GR6-6, já existente).
- `GR5-3`/`GR5-4`/`GR5-6`, `GR6-5`, `GR6-7`, `GR6-8`, `GR6-9` passam a correr sobre
  **seis** suspeitos.

---

## 9. Gate

```bash
npm run build
node scripts/qa.mjs        # os 4 perfis, os 4 desfechos
npm run lint:prosa         # zero achados bloqueantes
node scripts/qa-ui.mjs     # as rotas canônicas, com o mural a 51 cartas
```

Mais o gate específico da PD-10: **playtest do mural a 51 cartas** — coberto pela
rota do Metódico no `qa-ui.mjs`, que abre o mural com o dossiê inteiro na mesa.
