# MORTEM — Plano de sessões (rota de trabalho)

**Atualizado em:** 26 de julho de 2026 (fecho da OS-R8 — a reforma do caso-escola encerrada,
e a frente SG aberta no lugar dela)
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
- **✅ Ramo B — âncora de autoria coerente com veneno + deflexão P23 apertada (20/07/2026).**
  Bug achado pelo playtest de tell da Fase 3 (caso `gerado_comarca_13`, ré Dora Saunders): num
  **envenenamento** (láudano/arsênico), a âncora de autoria mostrava uma **lâmina "que casa com
  a lesão da morta"** — ferida que veneno não produz —, tornando o caso incoerente/insolúvel
  (fura "medicina legal precisa, sempre" + fair play). Afetava **5/21 casos** (todos os venenos).
  **Correção (decisão do usuário — opção C, prosa agora):** a âncora passa a ser o **VASO** do
  veneno (frasco de láudano com fio de tintura no gargalo; papel de arsênico com pó nas dobras),
  sem lesão — carta (`VASO_VENENO` em `pacote_gerado.js`) e confronto (`VASO_FALA` em
  `dialogos_gerados.js`), com a paridade da deflexão pela venda livre. O motor já lia o
  `tipoVestigio` correto; era furo de prosa. **P23 apertado:** a deflexão "veio de fora" deixa de
  contar mero álibi fora da vila; só sai com **forasteiro real** (vítima de passagem) — antes
  apontava um fantasma. **Guardas novas no `qa.mjs`:** veneno sem prosa de arma branca; deflexão
  ⟺ forasteiro real. Pipeline `revisar-prosa` **zero bloqueantes** (perito aprovou época/coerência;
  fiscal 1 ALTO de gênero "o dono"→"a dona" corrigido nos 6 pontos; editor 2 ALTOs — arsênico não
  se "lava" e eco carta×fala — corrigidos). `qa`/`qa-ui`/`lint`/build verdes; 21 casos re-gerados.
- **✅ Ramo B — âncora de SUFOCAÇÃO estendida (20/07/2026, commit seguinte).** O perito, no lote
  de veneno, achou o **mesmo bug para a sufocação**: o "pano de abafo" caía no ramo de lesão
  ("casa com a lesão da morta"), e sufocação não faz ferida moldável. Sob ordem do usuário, o
  conserto foi estendido: `VASO_VENENO` virou `ANCORA_SEM_LESAO` (veneno + abafo); a âncora do
  pano liga-se ao corpo pelo **fiapo** (a trama larga um fiapo claro = o "fiapo claro preso ao
  canto da boca" da carta do corpo, plantio honesto, KB `asfixias.md`), sem lesão; confronto e
  guarda do `qa.mjs` estendidos. Pipeline `revisar-prosa` **zero bloqueantes** (perito aprovou a
  fibra macroscópica de época; fiscal limpo; editor 1 ALTO de tautologia + 1 menor corrigidos).
  `qa`/`qa-ui`/`lint`/build verdes; 4 casos de sufocação re-gerados. `pendencias-status.md` 2.5
  fechado.
- **✅ QOL — botão "Novo caso" (20/07/2026, a pedido do usuário para o playtest sem terminal).**
  O epílogo (`MonologoFinal`) e a retomada (`TelaPersonagem`) ganham um botão que sorteia um caso
  novo da comarca (≠ o atual) e cai direto na abertura dele, sem voltar ao título nem recarregar.
  Só apresentação: reusa `carregarCaso`+`escolherDetective`; o sorteio (`Math.random`) fica na
  camada de componente (permitido fora de logic/data/store), e o caso é determinístico por seed.
  **O runtime NÃO gera casos do zero** (regra de zero-geração em runtime); "novo" = outro caso do
  lote de 21 já validado pelo `qa.mjs`. Novo check no `qa-ui` trava o botão. build/`qa`/`qa-ui`
  verdes.
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
  **Gate humano CUMPRIDO (20/07/2026):** o playtest de tell dirigido
  (`docs/playtest/protocolo-tell-fase3.md`, kit em `kit-tell-fase3-2026-07-20.md`) foi rodado e
  **passou** — o usuário reportou que a têmpera não vaza (palpite só-por-têmpera no acaso). **A
  Fase 3 e todo o Ramo A das flags psíquicas estão fechados**, sem recuo. (A PR #75, Fases 2–3, já
  fora mergeada em 20/07, `c59def2`.)
- **✅ Ramo A — eco de interferência: voz do perito executada (20/07/2026).** Decisão do usuário:
  o eco pós-caso das interferências (`ecos_interferencia.js`, hoje só no procedural, que **não tem
  legista** — `falaDoMestre.js:16`) troca a boca do **legista** para o **perito em 1ª pessoa**
  (opção 1 de 3: perito / delegado / narrador de método). Fair play já era *safe* (guia §2.4: eco
  reconhece o FATO da interferência, devolve ao método, jamais nomeia ator/autoria/nexo da morte);
  o lote foi **decisão de voz**, não de fair play. Só camada narrativa/apresentação: título + 12
  variantes reescritas (2ª→1ª pessoa) + comentários; `origem: 'mestre'` mantida (balde de canal da
  Caderneta, não a voz — documentado). **Motor cego; contrato do `qa-ui` intocado** (o eco é
  pós-caso na Caderneta, fora das rotas checadas; os strings "leitura do legista" do tutorial ficam
  intactos). Pipeline `revisar-prosa` **zero bloqueantes**: fiscal aprovou (gênero neutro,
  marcadores íntegros); perito 1 bloqueante-limítrofe §2.4 ("se lê mais fácil que o primeiro"
  arrastava a morte principal) **corrigido**; editor 1 ALTO (série de fecho reflexo "se lê/se data")
  **corrigido** na mesma linha + 1 menor de anadiplose. `qa.mjs` `CASO VÁLIDO`, `qa-ui.mjs`
  `UI VÁLIDA`, `lint:prosa` limpo, build limpo; os 21 casos re-gerados.
  **Ramo A fechado.** P11 (repensar a Mesa) concluído em 20/07/2026: a superfície da mesa
  deixa de exibir pergaminhos de evidência e passa a mostrar **fichas de pessoa** (um cartão
  por suspeito interrogável). Clicar abre o dossiê (`FichaPessoa`): álibi declarado, trechos
  do interrogatório, provas ligadas, menções em outras provas, possível móbil e o que outros
  disseram — tudo QOL, nenhuma conclusão entregue. Contrato do `qa-ui` atualizado (a
  reabertura de ficha agora passa pela Caderneta; a persistência verifica fichas de pessoa na
  mesa em vez de pergaminhos). `qa.mjs` CASO VÁLIDO, `qa-ui.mjs` UI VÁLIDA, build limpo.

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
- **✅ Concluída (21/07/2026).** Item 1 (abertura) refeito em sessão anterior; itens 2 e 7
  fechados nesta: a "leitura do legista" (legista presente, artificial) vira **"A voz do
  mestre"** — a convenção do eco pós-falha (Alcott ausente, a voz na cabeça de Harlan) — e
  cada aparte recordado remete ao Glossário ("o mestre já falou disso — veja no Glossário"),
  preenchendo o ponteiro que o item 5 tirou da carta. Pipeline `revisar-prosa` zero
  bloqueantes (editor: deixis resolvida pela convenção de voz interna + link de-duplicado;
  fiscal: resíduo "O legista" na Ficha corrigido; perito: limpo). `qa`/`qa-ui`/build verdes.

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
- **✅ Concluída (21/07/2026).** A tipografia já cumpria o pedido — prosa imersiva serifada
  16px (1.2b), cartas do mural 12px (1.2c), sistema dual claro×escuro (1.2e) — e foi
  ratificada. O único item aberto, 4.3 (espaço morto sob o diorama em telas altas), ganhou
  uma **atmosfera de vela na beira baixa do tampo** (glow quente + aterramento sutil): o vão
  passa a ler como mesa acesa, não como vazio. Puro enfeite, sem tocar o contrato do QA.

### Gabinete Ilustrado — pivô de apresentação (visual novel de gravura)

- **Objetivo:** migrar a apresentação para o registro de *visual novel de gravura* — prancha
  de atlas para o corpo, cena ilustrada para as conversas. **Só camada de apresentação**;
  motor, gerador e prosa intocados. Nota normativa: `docs/nota-gabinete-ilustrado.md`.
- **✅ Sistemas 1 e 2 entregues (21/07/2026)**, um commit por incremento:
  - **Inc. 1–2 — A Prancha (`PranchaCorpo.jsx`):** o exame do corpo vira prancha de atlas em
    SVG procedural (lupa que segue o ponteiro, hotspots que extraem as mesmas cartas, pose
    e livor pelo IPM via `tempo_morte.js`). Verso ("Virar a prancha": frente ↔ dorso,
    rotulado pela FACE) e camada de necropsia (dissecção ilustrativa, 0 hotspots). **Cadáver
    3D aposentado; diorama da vila intocado.** SVG (nunca canvas) mantém o `?flat=1`.
  - **Inc. 3–5 — A Cena (`CenaDialogo.jsx`, `FundoCena.jsx`):** interrogatórios e eventos de
    localidade compõem cena ilustrada — fundo 2D paramétrico + sprite meio-corpo (variante
    `'cena'` do retrato), "gravura que respira" e "reação observável". Contrato do `qa-ui`
    preservado (`data-retrato`, `data-opcoes-dialogo` etc.).
  - **Inc. 7 — Slots de asset:** `prancha_corpo` e `fundo_cena` registrados em
    `slots_assets.js` (contrato para arte externa; procedural é o fallback obrigatório).
  - Pareceres do perito-forense aplicados (rótulo da Fig. 2 pela face, não pelo decúbito;
    "ferida cervical"). `qa`/`qa-ui`/build verdes em cada incremento.
- **⏭️ Inc. 6 — verbo "Exigir que mostre": DEFERIDO (fase própria, só com ordem expressa).**
  Precisa de marca-espelho de luta no agressor; o caso-escola é homicídio por arma branca
  sem luta e não a suporta sem furar o fair play. Pertence ao **gerador** (autobattler produz
  a luta + ruído honesto nos inocentes). **Plano pronto em `docs/os-exigir-que-mostre.md`**
  (design, escopo, decisões abertas, critério de pronto); gatilho: ordem expressa.

### SR — A reforma do caso-escola *(frente **FECHADA** em 26/07/2026, com a ata da R8)*

Registrada aqui em 25/07/2026, no fecho da OS-R5: esta frente abriu **depois** da última
atualização deste plano e correu cinco sessões sem constar dele, contra a regra de
manutenção do topo. Ficou corrigido — e agora fica **encerrada**: as oito OS têm ata, e a
da R8 traz o balanço das oito. O que sai desta frente e continua vivo é a **OS-R9**, que já
não é reforma: é o gerador a herdar os padrões que o tutorial provou.

- **Objetivo:** reformar «A Hora Emprestada» em oito OS sequenciais, sem tocar na cadeia
  física do crime, e extrair da reforma os padrões que o gerador vai herdar.
- **Governo:** [`docs/os-r0-mestra-reforma-hora-emprestada.md`](./os-r0-mestra-reforma-hora-emprestada.md)
  — 25 decisões marteladas, 12 invariantes, a matriz de colisão e o gate global. **Não se
  executa; governa.**
- **Regra dura:** nenhuma OS abre enquanto a anterior não tiver ata, e **cada OS escreve-se
  no fecho da anterior**, contra a árvore real (OS-R0 §4). Sem paralelismo, em nenhuma
  circunstância.
- **Cada OS fecha com:** `npm run verificar` verde **e** pipeline `revisar-prosa` com zero
  achados bloqueantes.

| Ordem | OS | Estado |
|---|---|---|
| 1.º | R1 — Vocabulário e nomes | ✅ fechada |
| 2.º | R2 — Cena única | ✅ fechada |
| 3.º | R3 — Abertura | ✅ fechada |
| 4.º | R4 — Elenco e livros | ✅ fechada |
| 5.º | R5 — Móbeis e cartas | ✅ fechada (25/07/2026) |
| 6.º | R6 — Exposição e interrogatórios | ✅ fechada (26/07/2026) — os sete martelos saíram nas recomendações |
| 7.º | R7 — A reconstituição | ✅ fechada (26/07/2026) — os três martelos estavam fechados de antemão e a sessão correu do arranque à ata sem parar |
| 8.º | R8 — Passe editorial e QA de fecho | ✅ **fechada (26/07/2026)** — abriu com o §5 vazio, correu do arranque à ata sem consultar, e **fecha a reforma**. Inventário da Fase 0 em [`os-r8-fase-0-inventario.md`](./os-r8-fase-0-inventario.md) |
| — | R9 — O gerador herda os padrões | **escrita e por executar**, e já **fora da reforma** — [`os-r9-gerador-herda-os-padroes.md`](./os-r9-gerador-herda-os-padroes.md), com a fila medida item a item; prompt em [`os-r9-prompt-de-arranque.md`](./os-r9-prompt-de-arranque.md). **Três pontos de decisão**, todos com recomendação |

- **Orçamento de cartas (G11, teto 46):** **42 em jogo, 4 livres — e é o número final.**
  A R6 era a última OS que podia gastar, e gastou **zero**: o martelo (f) aceitou o saldo 4
  como decisão, não como sobra. A R7 está proibida pela G9, a R8 é editorial e a R9 é do
  gerador; **não há mais quem gaste**, e o caso-escola fecha assim.
- **Próxima sessão desta frente: não há.** A frente fechou. A sessão seguinte é da **R9**,
  pelo prompt de arranque dela, e é mudança de frente: sai do caso-escola e entra no
  gerador. **Três decisões a recolher no arranque**, todas com recomendação escrita.
- **O que a R8 entregou:** os três rótulos da Estação III que concluíam pelo jogador (a
  gaveta passou a dizer o que CONTÉM); o púlpito de cortiça, que era o da igreja e virou a
  escrivaninha alta que a KB atesta; **oito** rubricas repetidas verbatim — a fila dizia uma,
  e a **GR8-4**, escrita como guarda em vez de lida como achado, mediu oito; a colisão do
  lume na abertura do interrogatório; o «vinco das nervuras» corrigido **aos pares** (carta e
  gesto) e a emenda à KB que o desacopla da duração da queima; o «ao meio-dia» da bíblia; e
  o **QA de fecho**, com duas guardas removidas e justificadas e duas tornadas honestas. O
  `interrogatorio_silas` **não** se normalizou — martelado.
- **Triado para fora do passe editorial pela R8:** o **item 10** do playtest (ler a
  transcrição completa da carta amassada) é **lote de UI**, não acabamento — a S2 já o tinha
  aprovado assim; o **item 11** já estava **satisfeito** desde a S1, e fecha por verificação;
  a sala da **`porta_beco`** custa prosa nova, sala clicável e contrato de `qa-ui`, e é lote
  do caso-escola.
- **Executado no fecho da R7, a mando do utilizador (26/07/2026):** a divergência
  «carrilhão» **alinhada** no `MORTEM_CONTEXTO.md`; a janela de `ev_maquinismo` **blindada
  sem mover o número**; e a hora de queima do Livro I **resolvida em prosa** (o fogo não
  chegou ao fim), em vez de na hora do sineiro, que era a saída cara. O vestígio durável do
  buril foi **arquivado para a R9** — exigiria carta nova, e 42 é o número final.
- **O que a R7 entregou:** a **reconstituição** (D24) como peça de leitura entre o mural e o
  monólogo, com nenhum gesto nomeando autor — é isso que faz a G3 valer ali por construção;
  a **conta de bocas** no `blocoTestemunhas`; a **D25** nos cinco pools de fecho do monólogo;
  e sete guardas novas. **Zero cartas gastas**, como a G9 obrigava.
- **Para o playtest humano, com número:** os perfis **Intuitivo** e **Pericial Desatento**
  chegam à reconstituição com **0 de 9** gestos rebatíveis — e o segundo **condena**. Medir
  se a cena curta se lê como consequência da própria colheita ou como defeito. É a única
  pergunta que a R7 deixou por responder de propósito.

### SG — O gerador herda os padrões *(frente nova, aberta no fecho da R8)*

Sucede a SR e **não é a SR**: a reforma tinha um caso à mão; esta tem 31 casos embarcados,
155 árvores de diálogo e um banco que é **produto** (G12 — muda-se o gerador, corre-se
`node scripts/gerar-casos.mjs`, e o `qa.mjs` cobra os dois arquivos por replay).

- **Objetivo:** o gerador passar a produzir os padrões que o tutorial provou em oito OS.
- **OS:** [`os-r9-gerador-herda-os-padroes.md`](./os-r9-gerador-herda-os-padroes.md); prompt
  em [`os-r9-prompt-de-arranque.md`](./os-r9-prompt-de-arranque.md).
- **A fila, medida contra a árvore (dez itens):** procedência (`apontadaPor`) — hoje só o
  caso-escola a tem, e é por isso que a `contarVozes` da R7 trata alegação sem procedência
  como voz própria; exposição E0/E1/E2 — **zero** ocorrências em `src/gerador/`; o veraz sem
  crédito; o móbil por aritmética de livro; o degrau de confronto por contador autoral —
  nenhuma árvore gerada tem `degraus`; as **intervenções da noite** — sem catálogo,
  `montarReconstituicao` devolve `null` nos 31 casos, e destravá-lo arrasta a **dívida de
  geografia** de `reconstituicao.js` no mesmo commit; o vestígio **durável** do instrumento
  lavado (o coágulo sob a virola, que a KB documenta); as classes de **roupa queimada** e
  **documento queimado**, que a KB tem e o gerador não; e a **GR8-4 no gerado**.
- **A GR8-4 no gerado, já medida no fecho da R8:** 31 casos, 155 árvores, **11 casos com
  repetição verbatim, 55 ocorrências — e uma frase só**, «Nada de nota.», todas em nós
  `exigencia_*`. Fora dali o derivador varia as rubricas. **É decisão antes de ser trabalho:**
  a resposta nula uniforme pode ser fair play, porque variar o «nada aqui» faria do estilo
  um sinal.
- **Mede-se em lote, nunca em leitura.** Nenhuma leitura cobre 31 casos; o molde é o das
  guardas em banda que o `qa.mjs` já tem (GE2 em 40–60%, GE5 abaixo de 45%, regime-palco em
  10–30%).
- **Pronto quando:** `npm run verificar` verde, pipeline `revisar-prosa` com zero
  bloqueantes **sobre amostra de lote**, replay byte a byte dos 31 casos e do índice leve, e
  o caso-escola intocado (42 cartas, horas inalteradas).

### S5 — Balanceamento e OSs restantes

- **Escopo:** §1.6 (GB7 + banda de fuga 20,9%) e §1.7/5.6 (asfixia externa 41,0% acima do
  teto Y=40%) — balanceamento do autobattler; OS marca-e-luva (§2.2 — M0, dossiê de
  traumas/datação, está livre; M2–M3 aguardam o documento); OS de priors compostos
  (decisões mapeadas em `os-priors-compostos-*.md`); §1.5 estratégia de produção/assets.
  **Do playtest procedural entram** (palco do procedural, com `os-palco-em-aneis-*.md` e
  o KB legal-policial): P4 (evidências e pessoas concentradas na delegacia — não é a
  visão do jogo) e P5 (o nome "delegacia" é impróprio; terminologia técnica de 1893).
  **P5 resolvido na OS Vila Viva E2** (renome completo "delegado/delegacia" →
  "constable"/"O Posto do Constable", com glosa e petty sessions, validado pelo
  perito-forense contra o KB legal-policial).
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
