# MORTEM — Plano de sessões (rota de trabalho)

**Atualizado em:** 20 de julho de 2026
**Marco de referência:** merge da PR #70 (`0f6b369`) — revisão de pendências + quick wins
do playtest humano de 19/07/2026.

## Papel deste documento

Este é o **plano de rota entre sessões**: diz *em que ordem* atacar o que falta, *com que
escopo* por sessão, *quais insumos* carregar e *qual o critério de pronto*. O plano de
ação detalhado (passo a passo por sessão, decisões pendentes do usuário) está em
[`relatorio-2026-07-19-proximos-passos.md`](./relatorio-2026-07-19-proximos-passos.md). O inventário
item a item do que falta continua sendo `docs/pendencias-status.md` — este documento não o
duplica; referencia. A numeração dos itens (§1.2, item 12 etc.) é a daquele mapa e do
relatório de playtest `docs/playtest/2026-07-19-conclusoes-humanas.md`.

**Regra de manutenção:** toda sessão que fechar uma frente daqui (ou abrir uma nova)
atualiza este arquivo **no mesmo commit** — marca a sessão como concluída, registra o
resultado em uma linha e reordena o que restou, se o resultado mudar a ordem.

---

## Fotografia do estado (pós-PR #70)

- **Vertical slice jogável**: caso-escola artesanal + casos procedurais gerados por
  simulação; QA verde (`qa.mjs` → CASO VÁLIDO; `qa-ui.mjs` → UI VÁLIDA; build limpo).
- **Quick wins do playtest de 19/07 entregues** (itens 18, 13, 15, 5, 6): detetive único
  (Harlan), hora-fim da janela nunca antes da início, ficha da carta com origem, ponteiro
  do glossário removido da carta, termo extraído vira link "visitado" que reabre a ficha.
- **Decisões de design da Seção 1 registradas** (`historico-decisoes.md`,
  `overhaul-2026-07-12.md`); barbante do mural com contraste corrigido.
- **Protocolo de playtest humano do procedural pronto**
  (`docs/playtest/protocolo-playtest-humano-procedural.md` + `scripts/gabarito-casos.mjs`)
  — aguardando o usuário rodar.

---

## Sessões, em ordem sugerida

A ordem parte da sequência registrada em `pendencias-status.md` ("rodar o playtest →
diálogo *ou* solubilidade → UI/arte por último") e das observações de triagem do relatório
de playtest (itens que se cruzam decidem-se juntos).

### S0 — Playtest humano do procedural *(gate — usuário roda)*

- **Objetivo:** medir a solubilidade dos casos gerados com jogador humano e às cegas.
- **Escopo:** item 4.11. Jogar conforme o protocolo, corrigir com o gabarito, registrar as
  conclusões em `docs/playtest/` (padrão dos relatórios datados).
- **Insumos:** `docs/playtest/protocolo-playtest-humano-procedural.md`,
  `scripts/gabarito-casos.mjs`, seleção de caso por `?caso=<id>`.
- **Pronto quando:** relatório de conclusões versionado e triado (mesmo fluxo do de 19/07).
- **Por que é gate:** o resultado decide o rumo de S1 — se os casos forem solúveis, a
  frente seguinte é diálogo; se não, a correção de solubilidade fura a fila.
- **✅ 2ª rodada jogada (19/07/2026):** relatório triado em
  [`docs/playtest/2026-07-19-conclusoes-procedural-r2.md`](./playtest/2026-07-19-conclusoes-procedural-r2.md).
  Lote A da rodada fechado (inteligibilidade dos vestígios sociais: móbeis sem frase,
  instrumento nomeado, nota/bilhete com assunto; homônimo da vítima eliminado). Ficam:
  o **canal de compleição física** (P16+P17 — características da vítima + pegadas
  descritas; desenhar com o fair play, junto de P9) e os itens de diálogo (P21–P24 →
  OS de diálogo).
- **✅ 1ª rodada jogada (19/07/2026):** relatório triado em
  [`docs/playtest/2026-07-19-conclusoes-procedural.md`](./playtest/2026-07-19-conclusoes-procedural.md).
  **Resultado central: o caso estava fácil demais porque o jogo ENTREGAVA conclusões**
  (legista falando o meio, carta rotulada "sinal de arma branca", "bordas vivas", mentira
  pré-rotulada, âncora única de autoria). O Lote A já removeu os canais de resposta
  (P1–P3) e adicionou o carimbo de coleta no mural (P7); as decisões de fair play
  (P8, P9) engrossam S2, e P4/P5/P6/P11 entram nas sessões abaixo. Vale nova rodada
  cega depois dessas correções.

### S1 — OS de diálogo *ou* correção de solubilidade *(conforme S0)*

**Ramo A — OS de diálogo** (itens 2.1 + 2.3):
- **Objetivo:** fazer o diálogo consumir o que o gerador já compila e hoje ninguém lê.
- **Escopo:** flags psíquicas (`mente_com_calma_periferica`, `acusa_com_fervor`,
  `omite_por_decoro`, `gatilho_de_complexo`), pools de encenação, ganchos de biografia da
  vítima. Item 11 do playtest (exposição contida no próprio diálogo) entra aqui se a
  decisão de design de S2 o confirmar.
- **Insumos:** `docs/os-arvore-dialogo-procedural.md`,
  `docs/os-camada-psiquica-do-elenco.md`, `docs/game-design-simulacao.md`,
  `docs/biblia-de-vozes.md`. Prosa nova passa por `redigir-prosa` + `revisar-prosa`.
- **Do playtest procedural entram:** P6 (o interrogatório fala em vez de empurrar carta;
  se ficar carta, o negrito carrega a informação — "se recolheu às oito" — e não o título
  opaco), P11 (repensar a Mesa: ficha por pessoa com resumo de conversas e provas
  ligadas, sem spoiler), P21 (a mentira do assassino não pode ser espontânea — o beat de
  paradeiro deve ser perguntado a todos), P22 (o confronto tem que puxar mais que o já
  dito) e a decisão de voz do eco de interferência pós-caso (hoje ainda fala pelo
  legista, que deixou de existir nos casos gerados).
- **Lembrete de arquitetura:** o motor segue cego a atributos — o diálogo lê flags
  pré-computadas do pacote de caso, nunca FOR/INT/WIS/CHA.

**Ramo B — correção de solubilidade:** escopo definido pelas conclusões de S0 (não há como
detalhar antes).

- **Pronto quando (ambos):** `qa.mjs` e `qa-ui.mjs` verdes; se prosa mudou, pipeline
  `revisar-prosa` com zero achados bloqueantes.
- **◐ Parcial (19/07/2026) — lote de fair play do Bloco C concluído** (OS
  `os-dialogo-s1-fair-play.md`, ata em `historico-decisoes.md` "S1 — Fair play do diálogo"):
  P21 (paradeiro universal) verificado como já satisfeito; **P6** (rótulo da carta de álibi
  informativo: lugar + faixa); **P22** (2ª camada de detalhe verificável em todos os
  confrontos — o réu aponta o paradeiro declarado, sem confessar; a testemunha dá um detalhe
  de percepção); **P23** (guarda de sustentação da deflexão "veio de fora" — só sai com
  forasteiro plausível; senão o réu não deflete). Três fases, um commit cada, pipeline de
  prosa com zero bloqueantes; `qa`/`qa-ui`/build verdes. **Segue pendente do Ramo A:** o
  consumo das flags psíquicas e pools de encenação, P11 (repensar a Mesa), o eco de
  interferência pós-caso, e a metade "preconceito de inocente" do P23 (fase própria, só sob
  ordem).
- **◐ Ramo A — consumo das flags psíquicas: OS + Fase 0 (19/07/2026).** OS em
  `os-flags-psiquicas-no-dialogo.md` (continua de onde a PR #73 parou). O derivador de diálogo
  passará a **ler as flags que o gerador já compila e nenhuma boca lê** (`acusa_com_fervor`,
  `omite_por_decoro`, `defende_demais_o_morto`, `mente_com_calma`/`_periferica`,
  `mente_sob_pressao`, `gatilho_de_complexo`) — camada narrativa pura, motor cego. **Fase 0
  (telemetria, risco zero)** no `qa.mjs`: 1661 flags compiladas em 1422 pessoas no lote de 200,
  **0 lidas** hoje; paridade do tell calmo saudável (77% inocentes, piso 60%); achado do
  `gatilho_de_complexo` (réu 200/200 × inocente 161/200 → tratar na Fase 1). **Realização em
  prosa (Fases 1–3) aguarda as decisões §8 da OS** (dose, boca do gatilho, ordem). Gatilho:
  ordem do usuário para abrir a Fase 1.
- **✅ Ramo A — Fase 1 do gatilho de complexo executada (19/07/2026).** Decisões do usuário:
  tento discreto, **nó de confronto sem carta** para o gatilho, ordem §6. O `gatilho_de_complexo`
  ganhou boca: mapa `GATILHO_POR_TEMA` (13 temas, biografia do medo central, jamais
  janela/causa/nexo), lido de `bruto.psique`, com **portão dos ≥2** (anti-tell dos ~20%
  fiscalizado no `qa.mjs`). Toca gerador + apresentação (`InterrogatorioDialogo.jsx`, caixa
  lateral nova) + QA; **motor intocado**. Pipeline `revisar-prosa`: perito sem bloqueantes,
  fiscal 1 bloqueante de gênero (corrigido com ramos `fem`), editor aprovado com reescritas
  (todas aplicadas). `qa`/`qa-ui`/`lint`/build verdes; casos re-gerados.
- **✅ Ramo A — Fase 2 (projeção/decoro) executada (20/07/2026).** Decisões do usuário: **Fase 2**
  primeiro; a projeção do `acusa_com_fervor` **aponta um nome do elenco**; o `omite_por_decoro`
  encosta na **evasiva + b2 oblíquo**. Duas flags antes lidas por boca nenhuma passam a **colorir
  beats existentes** (tento discreto, nenhum nó novo): `projecaoFervor` no b2 firme (o inocente
  ativo aponta **outro inocente**; o alvo é escolhido **excluindo o réu** — Knox nº6), decoro na
  evasiva + b2 oblíquo. **Fair play fiscalizado no `qa.mjs`** (o nome do réu não aparece em fala de
  outro suspeito: a projeção jamais acusa o culpado); verificação end-to-end **14 projeções, 0
  violações**. Só gerador + QA; **motor cego, contrato do `qa-ui` intocado**. Pipeline
  `revisar-prosa` com **zero bloqueantes** (perito aprovou; fiscal 1 achado MÉDIA de tratamento
  hardcoded → `{detective.treatment}`; editor aprovou com dois menores aplicados). `qa`/`qa-ui`/
  `lint`/build verdes; casos re-gerados.
- **✅ Ramo A — Fase 3 (par calma/tensão + defende_demais) executada; falta só o gate humano
  (20/07/2026).** Decisões do usuário: têmpera = **postura B** (modula o tento de trait no b1, não
  abre eixo novo); **defende_demais realizado**; **gate = guarda mecânica + playtest de tell
  dirigido**. `TENTO_RESSONANTE` virou `[trait][temperamento]` (calma assenta / tensão vacila, só no
  tom ressonante, **seleção cega ao papel**); `cordialDefende` no b2 cordial (por macrogrupo).
  **Achado:** `defende_demais` é **inocente-only** (réu 0/200 — vínculo nunca recai no assassino),
  logo um **reverse-tell como o fervor**; guarda ajustada. QA: anti-tell das têmperas (par cruzado;
  defende inocente-only). Pipeline `revisar-prosa` **zero bloqueantes** (perito aprovou; fiscal 1
  MÉDIA de gênero "Posto"→"Contra a parede", corrige bug pré-existente; editor 1 ALTO de registro
  de classe + 3 menores, todos aplicados). `qa`/`qa-ui`/`lint`/build verdes; casos re-gerados.
  **Gate pendente (ação do usuário):** o playtest de tell dirigido
  (`docs/playtest/protocolo-tell-fase3.md`) antes de dar a Fase 3 por fechada/mergeável.
  **Segue pendente do Ramo A:** P11 (Mesa); eco de interferência.

### S2 — Fair play do caso-escola *(decisões do usuário)*

- **Objetivo:** resolver as quatro decisões abertas sobre o quanto o caso-escola entrega a
  resposta, e destravar o item de UI que depende de prosa curta.
- **Escopo:** itens 12 (vidro na dobra da calça de Silas dá a pista máxima), 14 (cartas de
  "mentiras" já rotuladas no mural), 16 (móbil ligado ao réu; um móbil por suspeito),
  11 (exposição contida no diálogo — decisão aqui, execução na OS de diálogo) e 10
  (transcrição da carta amassada do sobrinho). Itens 8 (planta única navegável) e 9
  (suspeitos saem de cena) podem ser triados aqui, mas tocam dados espaciais/elenco —
  conversar com a camada 3D antes de prometer escopo. **Do playtest procedural entram:**
  P8 (mentira pré-rotulada — mesmo problema do item 14, agora nos dois modos), P9
  (âncora única de autoria: a marca de poeira sozinha liga a ré — âncora dupla ou
  contra-hipótese jogável), P16+P17 (canal de compleição física: vítima descrita,
  pegadas com tamanho — desenhar sem virar entrega de suspeito único), P23 (deflexões
  do diálogo plausíveis dentro do elenco) e P24 (variar a fôrma das mentiras — o
  "mente mas não matou" não pode ter assinatura reconhecível).
- **Insumos:** `docs/kb-craft-narrativo/cliches-e-fair-play.md`,
  `docs/playtest/2026-07-19-conclusoes-humanas.md`, `MORTEM_CONTEXTO.md`.
- **Regra:** a decisão é do usuário; o agente apresenta opções cruzadas com o KB de fair
  play, não decide sozinho.
- **Pronto quando:** cada item tem decisão registrada em `historico-decisoes.md` (mesmo
  que a decisão seja "manter como está"); o que virar mudança de código/prosa ganha lote
  próprio.
- **✅ Concluída (19/07/2026):** orquestrada e decidida via `docs/os-fair-play-s2.md`; os 9
  itens registrados em `historico-decisoes.md` ("S2 — Decisões de fair play"). Resultados:
  caso-escola (vidro **espalhado**, mural com **rótulo neutro**, **móbil por suspeito**);
  gerador (âncora **híbrida**, compleição **adiada**, **cardápio amplo** de fôrmas com
  culpado partilhando fôrma de inocente); diálogo → S1 (paradeiro universal, confronto com
  ganho em **todos** os confrontos, deflexão preconceituosa só de inocente); espacial
  (planta única navegável no caso-escola **e** na cena procedural → OS `palco-em-aneis`;
  suspeitos saem de cena; transcrição da carta amassada). **Reordenação:** o lote do gerador
  (P9 híbrido) re-gera os 21 casos e é o de maior custo; o item 8 estendido ao procedural
  entra na OS `palco-em-aneis` (E1/E2, hoje em S5). Próxima sessão ativa: **S1 (diálogo)**,
  que consome as decisões do Bloco C.
- **◐ P9 híbrido — Fase 0 feita; Via A parada; P9 → Via B (19/07/2026).** OS em
  `os-p9-ancora-hibrida.md` (§9). A telemetria da Fase 0 (`qa.mjs`, sem regressão) mostrou
  que a âncora física durável tem **teto de ~7/21** — 14/21 são mortes limpas que só a
  contra-hipótese cobre. Decisão do usuário: **não perseguir a Via A** (âncora dupla física;
  ganho marginal ante o risco de tocar o autobattler) e **consolidar o P9 na Via B**
  (contra-hipótese jogável, reaproveitando a guarda de sustentação do P23). **Gatilho da Via
  B:** ordem do usuário para abrir o lote.

### S3 — Prosa dedicada *(uma sessão por item, pipeline obrigatório)*

- **Objetivo:** as três reescritas grandes apontadas pelo playtest.
- **Escopo:** item 1 (refazer a abertura), item 2 (voz do mestre deixa de ser monólogo:
  tutorial guia ao glossário + "o mestre já falou disso" — design + prosa), item 7
  (reescrever "o legista, examinando").
- **Atenção ao acoplamento:** os itens 2, 5 e 6 se cruzam na experiência carta/glossário
  (o 5 e o 6 já foram feitos; o desenho do 2 deve respeitá-los para não retrabalhar).
- **Insumos:** skill `redigir-prosa` (carrega guia de estilo, bíblia de vozes e KB
  forense) e, antes do commit, `revisar-prosa` + `anti-padrao-ia`.
- **Pronto quando:** pipeline `revisar-prosa` com zero achados bloqueantes; `qa-ui.mjs`
  verde (abertura e monólogo são texto visível).

### S4 — UI/arte *(por último; decide-se em conjunto)*

- **Objetivo:** direção de leitura e arte, resolvida de uma vez.
- **Escopo:** §1.2(b) prosa imersiva serifada 16px, §1.2(c) corpo 12px das cartas do
  mural, §1.2(e) prosa longa claro×escuro, §4.3 espaço morto sob o diorama em telas
  largas; revisão futura dos carimbos "20h–23h" (§1.3) junto do menu de opções. Itens de
  triagem E do playtest (3 — glossário com cara de livro de época; 4 — recortes de imagem
  nas cartas, sob o contrato de asset 2D) entram aqui se o usuário os puxar.
- **Insumos:** `docs/kb-producao/` (UI/estética, assets e licenças), contrato de asset 2D
  no `CLAUDE.md`.
- **Pronto quando:** `qa-ui.mjs` verde (o contrato de textos/seletores do QA é intocável —
  qualquer mudança neles atualiza o QA no mesmo commit).

### S5 — Balanceamento e OSs restantes

- **Escopo:** §1.6 (GB7 + banda de fuga 20,9%) e §1.7/5.6 (asfixia externa 41,0% acima do
  teto Y=40%) — balanceamento do autobattler; OS marca-e-luva (§2.2 — M0, dossiê de
  traumas/datação, está livre; M2–M3 aguardam o documento); OS de priors compostos
  (decisões mapeadas em `os-priors-compostos-*.md`); §1.5 estratégia de produção/assets.
  **Do playtest procedural entram** (palco do procedural, com `os-palco-em-aneis-*.md` e
  o KB legal-policial): P4 (evidências e pessoas concentradas na delegacia — não é a
  visão do jogo) e P5 (o nome "delegacia" é impróprio; terminologia técnica de 1893).
- **Insumos:** `docs/game-design-simulacao.md`, `docs/os-autobattler-v2-*.md`,
  `docs/os-priors-compostos-*.md`, `docs/kb-producao/assets-e-como-obter.md`.
- **Pronto quando:** cada OS tem seu próprio critério; o comum é `qa.mjs` verde e as
  `[DECISÃO]` internas respondidas pelo usuário.

---

## Backlog sem sessão marcada

Tudo o que não está numa sessão acima permanece inventariado em
`docs/pendencias-status.md`:

- **Seção 2** — OS §2.4 (guarda de variante órfã no `qa.mjs`, opcional);
- **Seção 3** — allowlist de exceções do `lint-prosa` (polimento editorial);
- **Seção 4** — §4.5 (ritmo da investigação), §4.6 (tom de "O QUE FALTOU"), §4.7
  (code-splitting do chunk three.js — técnico, disponível quando o usuário ordenar),
  §4.8 (playtest em largura mobile);
- **Seções 5 e 6** — triagem futura e parâmetros "chute calibrável" (calibram-se com
  dados de partida, não antes).

Nada disso bloqueia S0–S5; entram na fila quando o usuário puxar.
