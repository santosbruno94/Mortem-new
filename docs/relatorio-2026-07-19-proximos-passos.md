# MORTEM — Relatório de próximos passos e planos de ação

**Data:** 19 de julho de 2026
**Branch:** `claude/planning-report-pr70-xm9gmy`
**Papel deste documento:** fotografia detalhada do dia + plano de ação passo a passo
para cada sessão futura. A rota viva (ordem resumida, atualizada a cada sessão) segue em
[`plano-de-sessoes.md`](./plano-de-sessoes.md); o inventário item a item, em
[`pendencias-status.md`](./pendencias-status.md). Este relatório é a versão executável:
o que fazer, em que ordem, com quais insumos, quais decisões cabem ao usuário e como
saber que ficou pronto.

---

## 1. Onde o projeto está (fim de 19/07/2026)

Três rodadas de trabalho fecharam hoje, todas nesta branch:

1. **Plano de rota criado** (`plano-de-sessoes.md`) — sessões S0–S5 ordenadas, após o
   merge da PR #70.
2. **Playtest procedural, 1ª rodada** (`playtest/2026-07-19-conclusoes-procedural.md`):
   o jogo entregava conclusões prontas. Corrigido no mesmo dia: legista removido dos
   casos gerados; carimbos das cartas de lesão viraram descrição (sem "sinal de arma
   branca" / "bordas vivas"), com parecer do perito de época (ferida perfuro-incisa);
   carimbo de data/hora de coleta em todas as estações do mural.
3. **Playtest procedural, 2ª rodada**
   (`playtest/2026-07-19-conclusoes-procedural-r2.md`): vestígios sociais ininteligíveis
   e homônimo da vítima. Corrigido no mesmo dia: quatro móbeis novos ganharam frase (a
   causa raiz do "papéis ligam X à morta"), fallbacks mudos reescritos, instrumento
   nomeado na carta, nota/bilhete com assunto, e ninguém mais partilha o sobrenome da
   vítima sem parentesco (0 violações nos 21 casos).

**Estado de verificação:** build limpo; `qa.mjs` CASO VÁLIDO; `qa-ui.mjs` UI VÁLIDA;
banco de casos regenerado e coerente (0 homônimos, 0 fallbacks mudos).

**Critério novo adotado (P15, vale para toda prosa gerada):** *genérico pode;
ininteligível não* — a carta pode calar o detalhe fino, mas tem que dizer do que trata.

---

## 2. Visão geral da rota

| Ordem | Sessão | Tema | Gate/dependência |
|---|---|---|---|
| 1º | **S0 (contínua)** | Playtest cego do procedural, rodada 3 | Nenhuma — protocolo pronto |
| 2º | **S2** | Decisões de fair play (caso-escola + gerador) | Melhor após S0-r3 |
| 3º | **S1** | OS de diálogo | Decisões de S2 (itens 11/P21–P24) |
| 4º | **S3** | Prosa dedicada (abertura, voz do mestre, legista) | Independente; melhor após S1 |
| 5º | **S4** | UI/arte | Por último entre as ativas |
| 6º | **S5** | Balanceamento, palco do procedural e OSs restantes | Sem pressa; itens independentes |

A inversão S2↔S1 em relação ao plano original é deliberada: os achados das rodadas 1–2
mostraram que **o diálogo depende das decisões de fair play** (mentira espontânea,
deflexões, fôrma das mentiras) — decidir primeiro, implementar depois.

---

## 3. Planos de ação por sessão

### S0 (contínua) — Playtest cego, rodada 3

**Objetivo:** medir a solubilidade REAL agora que os canais de resposta foram fechados
(sem legista, sem conclusão nas cartas, vestígios inteligíveis).

**Passos:**
1. Escolher um caso não jogado do banco (`?caso=gerado_comarca_<n>`; evitar o 9, já
   visto na r2).
2. Jogar às cegas até o veredicto, conforme
   `playtest/protocolo-playtest-humano-procedural.md`.
3. Corrigir com `node scripts/gabarito-casos.mjs` (folha de correção do caso).
4. Anotar as conclusões numeradas (P25+) e enviar — o agente registra o relatório r3,
   tria em lotes e executa o que for mecânico, como nas rodadas 1–2.

**Decisão do usuário:** nenhuma antecipada; as conclusões são a decisão.
**Pronto quando:** relatório r3 versionado e triado.
**Atenção:** o que sobrar de reclamação tende a ser diálogo/fair play — é o insumo que
calibra S2 e S1.

---

### S2 — Decisões de fair play (uma sessão de DECISÕES, não de código)

**Objetivo:** resolver, de uma vez, o quanto o jogo entrega a resposta — no caso-escola
e no gerador. Cada item sai com decisão registrada em `historico-decisoes.md`; a
implementação vira lotes pequenos nas sessões seguintes.

**Formato sugerido:** o agente apresenta, por item, 2–3 opções cruzadas com
`kb-craft-narrativo/cliches-e-fair-play.md`; o usuário decide; nada se implementa antes
de decidido.

**Pauta, item a item:**

1. **Item 12 (caso-escola)** — o vidro na dobra da calça de Silas dá a pista máxima.
   Opções típicas: rebaixar a pista (vidro → indício que exige segunda ligação),
   espalhar o peso entre outras provas, ou manter e aceitar o atalho.
2. **Item 14 / P8 (os dois modos)** — cartas de mentira já rotuladas como mentira.
   Decidir se o rótulo sai (o jogador é quem liga o fato que desmente), se vira rótulo
   neutro ("depoimento"), ou se fica. Impacto direto no mural (estação As Mentiras).
3. **Item 16 (caso-escola)** — móbil ligado ao réu selecionado; cada suspeito com um
   móbil. Decidir a arquitetura: móbil por suspeito (como o gerador já faz com a isca)
   ou móbil único. Cruza com P19 (móbil falado no diálogo).
4. **Item 11 / P21–P22 (decisão aqui, execução na S1)** — exposição contida no próprio
   diálogo; mentira do assassino não pode ser espontânea (beat de paradeiro perguntado a
   todos); confronto tem que puxar algo além do já dito.
5. **P9 — âncora única de autoria** (a poeira da arma sozinha liga a ré). Decidir:
   âncora dupla obrigatória (segunda ligação independente por caso) ou contra-hipótese
   jogável ("outra pessoa pode ter levado a arma").
6. **P16+P17 — canal de compleição física.** Desenhar o canal inteiro antes de realizar:
   (a) a vítima ganha descrição física (altura/compleição — dado FOR já existe no
   gerador, build time); (b) a força exigida pelo método/lesão vira observação do
   exame; (c) pegadas ganham tamanho/feitio. **Regra de fair play:** o canal só entra se
   ≥2 suspeitos partilharem a compleição compatível — senão vira entrega (o defeito P9
   de novo). O motor permanece cego (camada narrativa/consequências).
7. **P23 — deflexões plausíveis.** A fala de desvio ("veio de fora") só pode existir se
   a tese for sustentável no elenco (há forasteiro? há estranho plausível?). Definir o
   critério.
8. **P24 — variar a fôrma das mentiras.** O "mentiu por vergonha, não por crime" não
   pode ter assinatura única reconhecível. Decidir 2–3 fôrmas alternativas de mentira
   inocente (e se o assassino pode usar fôrma igual à de inocente).
9. **Itens 8 e 9 (caso-escola, triagem):** planta única navegável; Silas e o aprendiz
   saindo de cena após o cerco. Tocam dados espaciais/3D — só triar aqui (fazer ou
   adiar), sem prometer escopo.

**Insumos:** `kb-craft-narrativo/`, relatórios de playtest de 19/07 (as 3 listas),
`MORTEM_CONTEXTO.md`.
**Pronto quando:** cada item com decisão registrada em `historico-decisoes.md` e lote de
implementação definido (qual sessão executa).

---

### S1 — OS de diálogo

**Objetivo:** o diálogo consome o que o gerador já computa e as decisões de S2.

**Passos:**
1. **Reler as OSs**: `os-arvore-dialogo-procedural.md` + `os-camada-psiquica-do-elenco.md`
   (as `[DECISÃO]` internas — 4 na OS psíquica — vão ao usuário no início da sessão).
2. **Beat de paradeiro universal (P21):** todo interrogado declara paradeiro quando
   perguntado — nunca espontaneamente. O assassino mente DENTRO do mesmo beat dos
   demais.
3. **Confronto com ganho (P22):** apresentar prova puxa fala nova (admissão parcial,
   detalhe, contradição) — nunca só a repetição. Mapear os confrontos existentes
   (`dialogos_gerados.js`, seção de confrontos) e dar a cada um a "segunda camada".
4. **Consumo das flags psíquicas (itens 2.1+2.3):** `mente_com_calma_periferica`,
   `acusa_com_fervor`, `omite_por_decoro`, `gatilho_de_complexo` — cada flag muda a
   encenação da fala (não o conteúdo lógico). O motor segue cego a atributos.
5. **P6 — a informação no lugar do título:** o que sai da boca vira fala exibida; se
   carta houver, o negrito clicável carrega a informação ("se recolheu às oito"), não o
   título opaco ("A Noite de X"). Ponto de código: `textoDisplay` da carta de álibi em
   `dialogos_gerados.js` (o termo clicável herda o `textoDisplay` da carta destino).
6. **P19 (fala do móbil):** o móbil do interrogado pode ser posto à mesa no confronto —
   conforme a decisão do item 16/S2.
7. **Voz do eco de interferência:** o eco pós-caso ainda fala pelo legista, que não
   existe mais nos casos gerados — decidir a voz nova (delegado? registro escrito?) e
   reescrever `ecos_interferencia.js` (pipeline de prosa).
8. **Prosa nova** → `redigir-prosa` + `revisar-prosa` antes do commit; textos do
   contrato do `qa-ui` (tons, `.opcao-dialogo`, `[data-no-dialogo]`) intocáveis ou
   atualizados no mesmo commit.

**Pronto quando:** os quatro comportamentos observáveis (paradeiro perguntado, confronto
com ganho, flags encenadas, negrito informativo) jogáveis num caso da comarca;
`qa.mjs` + `qa-ui.mjs` verdes; nova rodada S0 (r4) para validar.

---

### S3 — Prosa dedicada (uma sub-sessão por item)

**Objetivo:** as três reescritas grandes do caso-escola, com pipeline completo.

**Passos (cada um em sub-sessão própria, na ordem):**
1. **Abertura (item 1):** refazer com `redigir-prosa`; a estrutura de 6 passos e o botão
   final são contrato do `qa-ui` (atualizar QA se mudar).
2. **Voz do mestre (item 2):** deixar de ser monólogo — o tutorial guia ao glossário
   ("o mestre já falou disso"). Design junto com prosa; respeitar itens 5/6 já feitos
   (sem ponteiro fixo na carta; termo extraído reabre ficha).
3. **"O legista, examinando" (item 7):** reescrever a moldura do caso-escola (nos
   gerados o bloco já não existe).
**Regra:** cada sub-sessão passa por `revisar-prosa` (editor-crítico + perito-forense +
fiscal-continuidade) com zero achados bloqueantes, e `anti-padrao-ia` antes de submeter.
**Pronto quando:** os três textos no jogo, pipeline limpo, `qa-ui` verde.

---

### S4 — UI/arte (decidir em conjunto, executar em um lote)

**Objetivo:** direção de leitura e arte, de uma vez.

**Pauta:**
1. §1.2(b) prosa imersiva serifada 16px; §1.2(c) corpo 12px das cartas do mural;
   §1.2(e) prosa longa claro×escuro — decidir a política tipográfica única e aplicar.
2. §4.3 — preencher o vão sob o diorama em telas largas.
3. §1.3 — carimbos "20h–23h" → notação de época, junto do menu de opções (se houver).
4. Item 3 (playtest caso-escola): glossário com cara de livro de medicina legal de época.
5. Item 4: recortes de imagem nas cartas (feridas) — **sob o contrato de asset 2D** do
   `CLAUDE.md` (embarcado, determinístico, invisível ao motor, fallback procedural,
   manifesto com licença).
6. P11 (repensar a Mesa — ficha por pessoa) pode ancorar aqui se a decisão de S2/S1
   pedir redesenho visual.
**Pronto quando:** decisões aplicadas, `qa-ui` verde (contrato de textos/seletores
respeitado ou atualizado no mesmo commit).

---

### S5 — Balanceamento, palco do procedural e OSs restantes

**Itens independentes, cada um com critério próprio:**
1. **Balanceamento do autobattler** (§1.6 GB7 + banda de fuga 20,9%; §1.7/5.6 asfixia
   externa 41% > teto 40%): rodar Monte Carlo dos casos, ajustar os "chutes
   calibráveis" (Seção 6 do `pendencias-status.md`), re-rodar até as bandas.
2. **Palco do procedural (P4+P5):** evidências/pessoas concentradas na "delegacia" e o
   próprio nome. Decidir com `os-palco-em-aneis-*.md` + KB legal-policial: como as
   provas se distribuem pela vila e qual o termo técnico de 1893 para o posto (o rótulo
   é `rotuloMesa`/`titulo` em `pacote_gerado.js`; os cliques do `qa-ui` em "A Delegacia"
   atualizam no mesmo commit; o id `delegacia` não muda).
3. **OS marca-e-luva** (§2.2): M0 (dossiê de traumas/datação) está livre; M2–M3
   aguardam documento.
4. **OS priors compostos**: as `[DECISÃO]` mapeadas (14 + 10 nos dossiês) vão ao
   usuário; inclui o sacristão-coveiro (§5.9).
5. **Estratégia de produção/assets** (§1.5): marketplaces, comissão, áudio — sessão de
   consulta com `kb-producao/assets-e-como-obter.md`.

---

## 4. Backlog sem sessão marcada

Permanece inventariado em `pendencias-status.md` (Seções 2–6): guarda de variante órfã
no QA (§2.4), allowlist do `lint-prosa` (§3.1–3.2), ritmo da investigação (§4.5), tom de
"O QUE FALTOU" (§4.6), code-splitting do three.js (§4.7 — disponível quando ordenado),
playtest mobile (§4.8), triagem futura (§5.1–5.9) e calibráveis (Seção 6). A divergência
KB × motor **incisa × perfurante** (parecer do perito de 19/07) fica registrada como
decisão em aberto do usuário.

---

## 5. Como retomar (para qualquer sessão nova)

1. Abrir `plano-de-sessoes.md` (rota viva) e este relatório (detalhe).
2. Escolher a sessão; carregar os insumos listados nela.
3. Decisões de design são do usuário; o agente apresenta opções com KB.
4. Toda prosa nova passa por `redigir-prosa`/`revisar-prosa`; todo commit fecha com
   `npm run build` + `qa.mjs` (+ `qa-ui.mjs` se tocar UI/prosa exibida).
5. Ao fechar a sessão, atualizar `plano-de-sessoes.md` no mesmo commit.
