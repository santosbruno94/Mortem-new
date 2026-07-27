# MORTEM — Status das Pendências (o que falta)

**Atualizado em:** 27 de julho de 2026 (triagem do playtest cego de 27/07 — 5 dos 7 itens
consertados; ver a seção no fim do arquivo)
**Branch da revisão:** `claude/pendencias-documento-86thrt`
**Fonte:** documento *"MORTEM — Pendências de Revisão do Usuário"* (varredura de 19/07/2026),
cruzado com o estado real do código nesta data.

Este arquivo é o **mapa vivo do que ainda falta** (inventário item a item). A **rota
entre sessões** — ordem, escopo e critério de pronto de cada sessão futura — vive em
[`docs/plano-de-sessoes.md`](./plano-de-sessoes.md). O que foi resolvido/decidido nesta
sessão de revisão está marcado ✅; o que fica para depois está marcado ⏭️ com o motivo e o
gatilho (sessão própria, polimento final, calibração por playtest ou triagem futura).

> **Achado central da revisão:** o documento de origem foi gerado por varredura e reproduziu
> sugestões antigas (playtests de 15/07) sem checar o código atual. **Oito** itens já
> estavam implementados. O trabalho real foi registrar as decisões de design do usuário,
> uma melhoria de acessibilidade (barbante) e a higiene dos docs.

---

## O que esta sessão fechou (Lotes A–C)

| Commit | Lote | Conteúdo |
|---|---|---|
| `820773b` | A | 8 decisões de design da Seção 1 registradas + barbante do mural mais legível (`#a13b2e`→`#c9553f`) |
| `084a313` | B | §4.1/4.2/4.4 verificados como já resolvidos; 4.3 marcado parcial |
| `718207d` | C | §4.9/4.10 verificados como já resolvidos |

**Única mudança visível no jogo:** o barbante do mural (contraste sob protanopia). Build
limpo; `qa.mjs` "CASO VÁLIDO".

---

## Conclusões do playtest humano (19/07/2026)

Relatório versionado: [`docs/playtest/2026-07-19-conclusoes-humanas.md`](./playtest/2026-07-19-conclusoes-humanas.md).
18 conclusões triadas. **Feito nesta rodada** (o que era fácil, em lote):

| # | Item | Estado |
|---|---|---|
| 18 | Remover a escolha de detetive (só Harlan) | ✅ Feito |
| 13 | QOL: hora-fim da janela nunca antes da início | ✅ Feito |
| 15 | Ficha da carta com lembrete de origem | ✅ Feito |
| 5 | Remover o ponteiro do glossário da carta | ✅ Feito |
| 6 | Termo extraído vira "link visitado" que reabre a ficha | ✅ Feito |

**Registrado como pendente** (não era fácil — segue para lote/sessão própria):

| # | Item | Trilha |
|---|---|---|
| 10 | Carta amassada do sobrinho: opção de ler a transcrição | ⏭️ **Lote de UI** — triado para fora da R8 em 26/07/2026: a S2 aprovou-o como «lote pequeno de UI» (QOL de leitura, não fair play), e exige componente novo + prosa nova de transcrição. Num passe de acabamento seria feature sem ordem expressa |
| 12 | Vidro na dobra da calça de Silas dá a pista máxima → repensar | ⏭️ **Calibração, não decisão** — triado em 26/07/2026 (ver abaixo) |
| 14 | Mural: cartas de "mentiras" já rotuladas → repensar | ✅ **Feito (OS-R8, Fase 1)**: `III · As Mentiras / depoimentos desmentidos` → `III · Os Depoimentos / hora e paradeiro declarados`; na revisão final, `Mentiras` → `Contestados`, e a mesma relação deixou de ser «desmentida» nas duas linhas da tela. O motor nunca vazou nada — era o nome da gaveta |
| 16 | Móbil ligado ao réu; cada suspeito com um móbil | ✅ **Feito (OS-R5)**: a guarda `GR5-3` exige carta de móbil por suspeito, réu e periféricos, e reprova sozinha se faltar. A `GR5-4` acrescenta a paridade (o réu não é o máximo em motivos distintos) e a `GR5-6`, a isca honesta |
| 11 | Diálogos: exposição contida no próprio diálogo | ✅ **Satisfeito, verificado na OS-R8**: executado na S1 (19/07) sobre o derivador — o `textoDisplay` das cartas de álibi deixou o título opaco e passou a carregar lugar + faixa, **espelhando o idioma que o caso-escola já tinha** (`Recolhido à Estalagem às Oito`). Nada a fazer no caso-escola; fecha por verificação |
| 8 | Mapa: cômodos de um local → planta única navegável | ✅ Feito (OS Vila Viva E1): planta generalizada (`Planta.jsx`) desenha a planta gerada do prédio na cena procedural; clicar o cômodo abre o ponto e o cômodo aberto realça. Fallback textual em `?flat=1`/sem planta |
| 9 | Silas e o aprendiz saem da cena após a polícia cercar | 🗄️ **Arquivado em 26/07/2026** (ver abaixo) |
| 1 | Refazer a abertura | ✅ Feito (S3, prosa) |
| 2 | Voz do mestre via glossário + "o mestre já falou disso" | ✅ Feito (S3): "A voz do mestre" + link ao Glossário |
| 7 | "O legista, examinando" ficou artificial → reescrever | ✅ Feito (S3): vira "A voz do mestre" (mestre ausente) |

---

## Triagem de 26/07/2026 (fecho da OS-R6)

Feita a pedido do usuário, sobre os itens que tinham ficado como «Decisão» sem dono.
Duas mudaram de natureza ao serem olhadas contra o código.

### Item 14 — o mural NÃO vaza quais depoimentos são mentira

A queixa do playtest dizia que as cartas de «mentiras» chegavam já rotuladas. **O motor não
vaza nada.** A Estação III lista, em `MuralAcusacao.jsx:114`, *todas* as alegações de hora
(`horaAlegada(c) !== null`) e — só depois de o réu ser nomeado — o paradeiro que ele próprio
declarou. Isso inclui as alegações **verdadeiras**: o guarda Tobin vendo o relojoeiro correr
as tampas da vitrine às 20h em ponto está na mesma gaveta que o moço do padeiro. E dentro da
estação o rótulo já é honesto: *«As alegações — hora e paradeiro»*.

O que vaza é **o nome da gaveta**, e são três strings:

| Onde | Hoje | Problema |
|---|---|---|
| `MuralAcusacao.jsx:47` (título) | `III · As Mentiras` | chama de mentira o que o jogador ainda não provou |
| `MuralAcusacao.jsx:47` (subtítulo) | `depoimentos desmentidos` | idem, e no pretérito |
| `RevisaoFinal.jsx:47` (rótulo) | `Mentiras` | idem, na revisão final |

**Decisão: corrigir, e é da OS-R8** (passe editorial). O rótulo deve dizer o que a gaveta
**é**, não o que ela conclui — no espírito do pilar nº 2 («o jogo nunca entrega conclusões»).
O `qa-ui` **não** clica nenhuma das três, então o custo é um commit pequeno; ainda assim,
conferir antes de mexer, porque é a regra do `CLAUDE.md`.

**✅ Feito na OS-R8, Fase 1 (26/07/2026).** `III · Os Depoimentos` / `hora e paradeiro
declarados`, e `Contestados` na revisão final. A conferência foi feita por leitura e confirmou
o que esta triagem supunha: nenhuma das três está no contrato do QA. O que ela **não** supunha,
e a Fase 0 mediu: as vizinhas estão — `IV · O Móbil` é cobrado em `qa-ui.mjs:851`, e
`paradeiro(s) desmentido(s)` (o resumo recolhido, que fica e é honesto porque conta o que o
barbante do jogador estabeleceu) em `qa-ui.mjs:717`.

### Item 12 — é calibração, e não se arbitra antes de medir

`ev_vidro_dobra` nasce no beat 1 de Silas em **todos os quatro tons**, e serve de âncora de
presença. A queixa é que entrega a pista máxima cedo demais. Contra o código, o quadro é
menos grave do que a queixa:

- **não é a única âncora de presença** — `ev_estojo_buril` também o é;
- **o próprio réu a desarma** de forma convincente em `confronto_vidro` («numa oficina destas
  parte-se um por semana; o rapaz varre toda noite»), que é exatamente o padrão que a R5
  fixou: *uma armadilha que se lê como engano não é armadilha* — e esta lê-se como inocência.

**Decisão: medir antes de mexer.** O próximo playtest humano registra se quem apanha o vidro
no beat 1 **abandona** o resto da investigação. Se abandonar, é problema de fair play e vira
OS; se não, o desenho está certo e a queixa era impressão. Mexer agora seria arbitrar antes de
medir — o erro que a Fase 0 da OS-R6 existiu para evitar, e que já se pagou duas vezes
(a paridade dos móbeis na R5, o corte de exposição na R6).

### Item 9 — arquivado

«Silas e o aprendiz saem da cena para suas casas após a polícia cercar.» Custa dados, mapa e
horas; o ganho é de verossimilhança marginal, e a cena única da R2 já resolveu o problema de
fundo (o prédio é um nó só). Arquivado — reabre só sob ordem expressa.

### O prazo do inquérito com consequência mecânica — segue fechado

O usuário martelou «ficção só, por agora» na R3, e a triagem confirma: pressão de prazo briga
de frente com o **relógio mole**, que é pilar de desenho (o relógio só anda ao viajar).
Reabrir continua sendo decisão de mesa, e continua prevista para **depois da R8**.
| 3 | Glossário com cara de livro de medicina legal de época | Futuro (UI) |
| 4 | Recortes de imagem nas cartas (feridas) | Futuro (asset 2D sob contrato) |
| 17 | Maquete 3D da vila nos casos procedurais | Futuro (paridade; = 4.3) |

> **Mudanças de prosa (itens 1, 2, 7) merecem sessões dedicadas** — passam pelo pipeline
> `redigir-prosa` + `revisar-prosa` e não entram junto de correções mecânicas.

---

## Seção 1 — Decisões de design

| Item | Decisão | Estado |
|---|---|---|
| 1.1 Relógio forjado × âncora Presença | Manter ambiguidade deliberada (a) | ✅ Registrado (`historico-decisoes.md`) |
| 1.2(a) Barbante contraste | Clarear para `#c9553f` | ✅ Feito (`MuralAcusacao.jsx`) |
| 1.2(d) Alvo de toque 44px | Já cumprido (`.opcao-dialogo`) | ✅ Ratificado |
| 1.2(f) Legista 14px itálico | Já cumprido (`FalaDoLegista`) | ✅ Ratificado |
| 1.2(b) Prosa imersiva serifada 16px | Já cumprido (ParagrafoProsa serif, corpo base 16px) | ✅ Ratificado (S4) |
| 1.2(c) Cartas do mural 12px | Já cumprido (.carta-pergaminho do mural em text-xs) | ✅ Ratificado (S4) |
| 1.2(e) Prosa longa claro×escuro | Sistema dual já vige (prosa clara sobre couro; documento escuro sobre pergaminho) | ✅ Ratificado (S4) |
| 1.3 Carimbos "20h–23h" | Convenção de UI + hipótese de troca (menu de opções / pipeline de traduções) | ✅ Registrado (`overhaul-2026-07-12.md`) |
| 1.4 Cadeia da manhã (Caulfield) | Aceitar como vila vizinha | ✅ Registrado |
| 1.8 Guaíaco (reagente de campo) | Não adicionar por ora | ✅ Registrado (`supressao-de-vestigios.md`) |
| 1.5 Produção/assets (marketplaces, comissão, áudio) | — | ⏭️ Sessão própria (estratégia de produção) |
| 1.6 GB7 + banda de fuga 20,9% | — | ⏭️ Sessão própria (balanceamento autobattler) |
| 1.7 Asfixia externa 41,0% (teto Y=40%) | — | ⏭️ Sessão própria (balanceamento; = item 5.6) |

---

## Seção 2 — OSs pendentes / dependências herdadas

Cada uma é uma **ordem de serviço própria**. Não executadas nesta sessão.

| Item | Do quê trata | Gatilho |
|---|---|---|
| 2.1 Consumo de flags pelo diálogo | `mente_com_calma_periferica` + 3 comportamentos; pools de encenação; ganchos de biografia da vítima | ⏭️ OS de diálogo |
| 2.2 OS marca-e-luva inexistente | M2–M3 aguardam o documento; M0 (dossiê de traumas/datação) livre | ⏭️ OS forense própria |
| 2.3 Realização de flags psíquicas no diálogo | Flags compiladas sem consumo (`acusa_com_fervor`, `omite_por_decoro`, `mente_com_calma`, `gatilho_de_complexo`) | ⏭️ OS de diálogo (natural seguinte) |
| 2.4 Guarda de variante órfã no `qa.mjs` | Listar variantes de template que nenhum caso embarcado materializa | ⏭️ Opcional (QA) |
| 2.5 Âncora de SUFOCAÇÃO incoerente | ~~O `pano de abafo` caía no ramo de lesão ("casa com a lesão da morta") — sufocação não deixa ferida moldável.~~ **✅ Feito (20/07/2026):** a âncora vira o **pano** ligado ao corpo pelo **fiapo** (a trama larga um fiapo claro = o "fiapo claro preso ao canto da boca" da carta do corpo; KB `asfixias.md` §fibras do pano), sem "casa com a lesão". `ANCORA_SEM_LESAO`/`FALA_SEM_LESAO` generalizam veneno+abafo; guarda do `qa.mjs` estendida a `sufocacao`. Pipeline `revisar-prosa` zero bloqueantes (perito confirmou fibra macroscópica de época; editor 1 ALTO de tautologia corrigido). 4 casos re-gerados. | ✅ Feito |
| 2.6 Arsênico "em qualquer venda" × livro de venenos | Vigilância (perito): a deflexão do réu diz que papel de arsênico se compra livremente (correto p/ mata-ratos/mata-moscas, cf. Maybrick 1889). Se algum caso plantar trilha de "livro de venenos" (Pharmacy Act 1868) como aquisição registrada, as duas pistas entram em atrito. Nenhum caso faz isso hoje. | ⏭️ Só se surgir a trilha de aquisição registrada |

---

## Seção 3 — TODOs de código / revisão editorial

| Item | Do quê trata | Gatilho |
|---|---|---|
| 3.1 Allowlist de exceções do `lint-prosa` | `EXCECOES` (linhas 146–238) registram o estado, não absolvem; cada uma aguarda parecer do pipeline `revisar-prosa` | ⏭️ Polimento editorial (pipeline dedicado) |
| 3.2 Documentação do status das exceções | Comentário que as exceções TODO aguardam revisão humana | ⏭️ Junto de 3.1 |

---

## Seção 4 — Sugestões de playtest

| Item | Prioridade (doc) | Estado |
|---|---|---|
| 4.1 Feedback ao "apresentar prova" sem confronto | Alta/Baixo | ✅ Já resolvido (`data-sem-paradeiro`) |
| 4.2 Destaque em seções recolhidas | Alta/Baixo | ✅ Já resolvido (`.ponto-interesse` seta ▸ + contador `n/total`) |
| 4.3 Espaço morto sob o diorama | Alta/Baixo | ✅ Feito (S4): atmosfera de vela na beira baixa do tampo (`.mesa-desk-atmosfera`) |
| 4.4 Expor `?flat=1` na tela-título | Alta/Baixo | ✅ Já resolvido (botão "Modo leve (2D)") |
| 4.5 Rebalancear ritmo da investigação | Médio | ⏭️ Sessão de design (decisão ativa no meio do jogo) |
| 4.6 Revisar tom do bloco "O QUE FALTOU" | Médio | ⏭️ Prosa (pipeline `revisar-prosa`) |
| 4.7 Code-splitting do chunk three.js (819 KB) | Médio | ✅ Feito (22/07/2026, diagnóstico Lote 5): o three.js já estava fora do arranque (chunk lazy do diorama); o peso real era o banco de casos (1,8 MB) embarcado no chunk inicial — agora chega por `import()` dinâmico (`casos.js` + índice leve `casos_indice.js`), arranque de 1.818→403 KB |
| 4.8 Playtest manual em largura mobile real | Baixa | ⏭️ Sessão própria (playtest humano) |
| 4.9 Destacar "Perguntas ao Delegado" | Baixa | ✅ Já resolvido (dica + `data-perguntas-pendentes`) |
| 4.10 Convite de replay ao fechar o caderno | Baixa | ✅ Já resolvido (`data-convite-replay`) |
| 4.11 Playtest humano de solubilidade no procedural | Questão em aberto | ⏭️ Sessão própria (playtest humano) — **protocolo pronto**: `docs/playtest/protocolo-playtest-humano-procedural.md` + `scripts/gabarito-casos.mjs` |

---

## Seção 5 — Itens registrados para triagem futura

Todos ⏭️ **triagem futura** (por definição). Registrados aqui só para não se perderem:

- 5.1 `hashString`: paridade trava variantes irmãs — migração para `hashDecisao` e bump separado
- 5.2 Ambiente térmico único (11 °C) ao ar livre — divergência de KB anotada
- 5.3 Descoberta no mesmo dia para crime externo diurno — reagendar chegada
- 5.4 "Carroceiro" com dois donos (wheelwright no KB × transportador no gerador)
- 5.5 Premeditado-com-fuga extremamente raro (~1/200)
- 5.6 Asfixia externa 41,0% (acima do teto Y=40%) — = item 1.7
- 5.7 `interferencia.js` ancora limpeza encenada no cômodo final do corpo
- 5.8 Propostas de KB: Pawnbrokers Act 1872; protesto × cobrança rural; telegrama manuscrito (1893) × colado (1927); registro de hóspedes obrigatório só em 1914
- 5.9 [DECISÃO futura] Sacristão-coveiro como arquétipo candidato (sustentado pelo KB; expansão pertence à OS priors)
- 5.10 [IDEIA do usuário, 20/07/2026] **Exame do corpo por região solicitada.** Hoje a cena do
  corpo entrega os sinais como cartas prontas (`gen_rigor`, `gen_livores`, `gen_lesao_fatal`,
  `gen_reacao_vital`) + `medirTemperatura`. A ideia: dar ao jogador uma forma de **pedir/apontar
  uma região do corpo** para examinar (boca e narinas, pescoço, pupilas, mãos, tronco…) e receber
  o achado daquela região — exame ativo, mais agência de perito, no espírito do seletor de partes
  do jogo *No, I'm Not a Human*. Casa naturalmente com o modelo: os sinais já são regionais
  (escoriações periorais + fiapo na sufocação; sulco no pescoço na ligadura; miose nas pupilas no
  veneno; feridas de defesa nas mãos). **Escopo:** UI/apresentação + talvez o gerador (mapa de
  regiões×achados por caso); o **motor segue cego**. **Cautela de fair play a resolver no design:**
  não pode virar um "qual parte clicar" que entregue a resposta — toda região relevante tem de
  estar acessível e o achado é o que está lá (nunca uma parte que só o culpado "pede"). Precisa de
  **OS própria** antes de qualquer build (cruzar com `kb-medicina-legal/protocolo-exame` e a
  camada 3D do corpo). Não bloqueia nada; aguarda ordem.

---

## Seção 6 — Parâmetros "chute calibrável"

Estimativas iniciais, a calibrar por playtest. ⏭️ **Calibração** (não é bug; é ajuste com
dados de partida). Os 5 do documento **mais** os que a varredura encontrou:

| Arquivo | Linha | Parâmetro |
|---|---|---|
| `src/gerador/crime.js` | 62 | `PASSO_PERSEGUICAO = 2` |
| `src/gerador/crime.js` | 63 | `ACERTO_METODO_OITAVOS = 7` |
| `src/gerador/crime.js` | 64 | `CHANCE_INCIDENTAL = 11` |
| `src/gerador/crime.js` | 510 | dorso não apara (+1 em fuga) — *não listado no doc original* |
| `src/gerador/espaco.js` | 567, 708 | eficácia de peças empunháveis (iteradas por Monte Carlo em B5) |
| `src/gerador/vetores_psiquicos.js` | 436 | constantes de vetores psíquicos (em sextos) |
| `src/gerador/arquetipos.js` | 82, 192, 205, 685 | faixas etárias / somas / pesos de profissão — *não listados no doc original* |

---

## Pendências ADICIONAIS encontradas na varredura (além do documento)

A verificação pedida ("há mais pendências?") encontrou marcadores `[DECISÃO]` e
`[DECISÃO DO USUÁRIO]` **dentro dos documentos de OS**. Não são pendências novas de tipo —
são as **decisões internas de cada OS**, que a Seção 2 já abstraiu como "sessão própria".
Ficam mapeadas aqui para quando cada OS for aberta:

| Documento de OS | Nº de `[DECISÃO]` | Observação |
|---|---|---|
| `os-priors-compostos-e-variedade-do-elenco.md` | 14 | tetos de arquétipos (18) e vetores (13), banda G4, razão 70/30 — OS priors/diálogo |
| `os-priors-compostos-f1-dossies.md` | 10 | dossiês por variável — mesma OS |
| `os-confronto-estendido.md` | 10 | D1/D2 **já respondidas** pelo usuário (láudano jogável; afogamento parcial); D3–D5 a conferir ao abrir a OS |
| `assets-e-como-obter.md` | 5 | = Seção 1.5 (marketplaces, comissão, áudio, cardápio) |
| `os-camada-psiquica-do-elenco.md` | 4 | OS psíquica (relacionada a 2.3) |
| `os-palco-em-aneis-e2/e3-dossie.md` | 4 | sacristão-coveiro (= 5.9) e recomendações de palco |
| `os-autobattler-v2-doutrinas.md` | 3 | balanceamento (relacionado a 1.6) |

**Conclusão da verificação:** nenhuma pendência nova *acionável agora* ficou de fora. Tudo o
que resta cai em: sessão própria de OS, polimento final, calibração por playtest ou triagem
futura — exatamente as categorias que o usuário pediu para não executar nesta rodada.

---

## Sessão de UI/arte — ✅ FEITA (S4, 21/07/2026) + pivô Gabinete Ilustrado

A direção de leitura/arte foi resolvida em duas frentes na sessão de 21/07:

- **S4 (tipografia + tampo):** 1.2(b) 16px serif, 1.2(c) mural 12px e 1.2(e) claro×escuro
  já cumpridos e ratificados; 4.3 espaço morto sob o diorama resolvido com a atmosfera de
  vela no tampo. Resta só 1.3 (futuro): rever os carimbos "20h–23h" para notação de época,
  junto do menu de opções / pipeline de traduções — sem ordem.
- **Pivô Gabinete Ilustrado** (`docs/nota-gabinete-ilustrado.md`): a apresentação migrou
  para visual novel de gravura — **A Prancha** do corpo (Sistema 1, aposenta o cadáver 3D)
  e **A Cena** de diálogo (Sistema 2). Itens 3 (glossário com cara de livro de época) e 4
  (recortes de imagem nas cartas/feridas) ganham lugar natural quando houver arte externa:
  os slots `prancha_corpo`/`fundo_cena` já estão no contrato de assets, com o procedural
  como fallback. O **verbo "Exigir que mostre"** (Inc. 6 da nota) fica deferido como fase
  própria (marca-espelho de luta → pertence ao gerador; ver a nota §Inc.6).

---

## Observação fora do documento — RESOLVIDA

A falha pré-existente do `scripts/qa-ui.mjs` — *"a Caderneta lista o carimbo da observação"* —
foi **corrigida em 19/07/2026**. Causa: a constante `CARIMBO_RIGOR` do teste ficou com a
string antiga (`Duro dos maxilares aos joelhos`, hoje só nos casos gerados); o carimbo do
caso-escola havia sido reescrito para `Rígido por inteiro; extremidades começando a ceder`.
Ajustada a constante ao texto real do jogo. **`qa-ui` agora: "UI VÁLIDA".**

## Próximos passos preparados nesta sessão

- **Playtest humano do procedural (4.11):** protocolo cego pronto em
  `docs/playtest/protocolo-playtest-humano-procedural.md`, com folha de correção via
  `scripts/gabarito-casos.mjs` e seleção de caso por `?caso=<id>`. **Falta o usuário rodar.**
- **Sequência sugerida a seguir:** rodar o playtest → conforme o resultado, abrir a **OS de
  diálogo** (consumo das flags psíquicas, itens 2.1 + 2.3) *ou* corrigir solubilidade → deixar
  a **sessão de UI/arte** (1.2 b/c/e, 4.3) por último.

---

## Triagem do playtest cego de 27/07/2026

Relatório versionado: [`docs/playtest/2026-07-27-playtest-cego.md`](./playtest/2026-07-27-playtest-cego.md).
Partida completa até o epílogo, desfecho **Sucesso com Gafes**. Sete itens levantados;
**cinco consertados nesta rodada**, por escolha do usuário.

### O achado central: uma causa, três sintomas

Os itens 1 e 3 do relatório eram **o mesmo defeito**, e maior do que o jogador pôde ver.
As cartas que nascem dentro de um diálogo viviam só no texto transitório de um beat:
escolher a pergunta seguinte substituía o nó e **destruía a carta em silêncio**, sem
segunda chance e sem aviso. A carta e o botão que a apagava dividiam a mesma tela.

São **13 das 50 cartas do caso** — todos os seis paradeiros declarados entre elas.
Reproduzido no navegador antes de qualquer conserto: descer a árvore de Silas sem clicar
nos termos deixava o Painel de Álibis vazio até o fim da partida.

A cascata que isso produziu:

| Sintoma relatado | Origem |
|---|---|
| Item 1 — o Painel de Álibis nunca registrou | nenhuma carta de álibi chegou à mesa; o painel estava correto |
| Item 1 — o monólogo cobrou juízo «sem paradeiro colhido» | `veredicto.js` lê a mesma mesa vazia |
| Item 3 — o «Inocente» não correspondeu ao que as cartas provam | `inocente_segredo` exige refutar o álibi pelo vestígio que revela o segredo; **sem a carta de álibi na mesa essa ligação é impossível de construir** — o jogador foi cobrado por um juízo que o defeito tornara infazível |

### O que se fez

| # | Item | Estado |
|---|---|---|
| 1 | Painel de Álibis nunca registrou | ✅ **O termo da conversa**: o que o interrogado já declarou fica escrito acima da fala corrente, com a pergunta que o perito fez, e os termos por colher continuam clicáveis. A conversa **continua a descer e a não voltar** — a escolha segue definitiva; o que deixa de acontecer é o dito se desdizer. Rodapé de aviso quando há coisa dita e não anotada |
| 2 | Confronto antes da declaração gera contradição | ✅ **A trava passou do depois para o antes**: a pergunta de confronto que desmentiria um paradeiro ainda não declarado vem **travada e legível** (a razão vai escrita no próprio botão), em vez de avisar que nada se anotaria e rodar a confissão assim mesmo. Colhido o paradeiro, a trava cai |
| 3 | Feedback dos juízos é opaco | ✅ **A lição do mestre** na Estação V, em voz de Abbot (tutorial só, como em `FalaDoLegista.jsx`): diz o que funda um juízo, sem entregar nada do caso — não reabre a porta que a Q3 fechou, que era o *gabarito*, não o critério. E o painel do «Inocente» sem paradeiro na mesa passa a nomear o que falta e onde se colhe, em vez de listar cartas e engolir o clique |
| 4 | «Voltar o corpo» sem efeito visível | ✅ **Parcial, e o relatório errou num ponto**: o botão *já* marcava «· feito» (verificado). O que procedia era o resto — a cena dizia que o guarda esperava a ordem muito depois de o corpo ter sido voltado, e a prancha não virava. Os dois estados da cena passam a alternar-se pela carta do livor (campo novo `semCartas`), e o gesto **vira a prancha para a Fig. 2** |
| 5 | A Cela cobra 1h estando no Posto | ✅ **Grupo `posto`**: a cela dos fundos e a sala da frente passam a ser o mesmo prédio, pelo precedente que a saleta de Silas já abrira na relojoaria — nó próprio, custo 0 entre os dois. Atravessar um corredor deixa de custar o mesmo que atravessar a vila |
| 6 | O relógio nunca apertou | ⏭️ **Decisão do usuário, não defeito**: o prazo do inquérito é ficção declarada em `abertura.js` («nenhuma regra o lê, nenhum desfecho muda por ele»). O jogador leu certo. Calibrar a pressão do relógio é mudança de design, e fica para ordem expressa |
| 7 | Fio solto: o esconderijo da torre | ⏭️ **Não é fio solto — é a Degrau 2 da OS-S1 a não se ler.** Ver a verificação abaixo. Fica aberto, mas com a pergunta trocada |

### Guardas e verificação

Nenhum contrato do `qa-ui.mjs` precisou mudar: a rota canônica colhe o álibi antes de
confrontar, e por isso a trava do item 2 não a alcança. `data-no-dialogo` continua a
marcar **só** a fala corrente (o registro usa `data-fala-registrada`), para os seletores
do QA seguirem casando um nó por vez.

**A trava do item 2 não fecha nenhum gatilho de interferência.** Verificado contra os
dados: ela alcança 6 confrontos em 4 suspeitos (`corrob_estalajadeiro` e `ev_vidro_dobra`
em Silas, `ev_cesta_rooke`, `ev_registro_estalagem`, `ev_suplica_cesto`,
`ev_pegada_argila`), e os gatilhos de `corrida_a_torre` e `silenciar_herrick` são
`prova_apresentada` sem carta fixa — sobram 4 confrontos livres em Silas e 2 em Herrick
mesmo com a mesa sem álibi nenhum.

### O que o pipeline `revisar-prosa` achou e ficou por fazer

As três passadas correram sobre a prosa nova (parecer resumido nas mensagens de commit
`8692e62` e no fecho desta rodada). Consertou-se tudo o que era bloqueante e alto. Estes
cinco ficaram, e cada um por um motivo:

| # | Achado | Por que ficou |
|---|---|---|
| P-1 | **Os outros dois gestos do corpo têm o defeito do item 4.** O conserto deu estado ao gesto do livor; o relógio de bolso e o termômetro continuam sem. A prosa-base diz «pende um relógio de bolso de tampa fechada, mudo» e «o termômetro fica à mão, se … julgar oportuno medir» — e as duas frases ficam falsas depois de dar corda e de medir, que é exatamente o defeito que o item 4 denunciou. A máquina já existe (`semCartas`/`requerCartas`) e o conserto é de dados | **Precisa de ordem expressa** — é estender uma feature a dois gestos que o playtest não citou |
| P-2 | **A cela desenha-se como gabinete.** `tipoCenaDe('cela', 'posto')` cai no default `'gabinete'` (estante de livros-razão + escrivaninha), contra a prosa: «um cubículo de porta gradeada: enxerga, balde, e uma tábua de tarimba». Pré-existente — com `grupo: 'vila'` caía no mesmo default —, mas o grupo `posto` novo torna a correção de uma linha possível (`if (grupo === 'posto') return 'delegacia';`) | Pré-existente e **fora do escopo do playtest**; camada de apresentação, nenhuma regra a lê. Fica à sua ordem |
| P-3 | **`carimboPadrao` de `ev_rigor` × faixa do glossário.** O carimbo que viaja para o mural diz «extremidades começando a ceder», e o verbete mapeia essa formulação à faixa de **24–36 h**, enquanto a carta está na de **12–24 h**. Um jogador metódico que cruze os dois desloca o corpo uma faixa inteira. Não quebra a solubilidade (as âncoras duráveis de 20 h/23 h resolvem sozinhas) | **Divergência KB × motor: decisão sua, não do agente** (regra do `CLAUDE.md`). É a que eu levaria a sério primeiro |
| P-4 | **Duas derivas da KB em relação ao código.** O exemplo trabalhado de algor em `tanatologia.md` §1 usa morte às 22 h e IPM 13 h, contra as 21 h e IPM 16 h do `seed.js`; e a KB atribui o teto de 23 h da janela durável ao livor fixo, quando hoje ele vem da rotina interrompida do relógio de bolso (`horaRotina: -1`) | Idem — **decisão sua**. Nenhuma foi introduzida nesta rodada |
| P-5 | **O relatório de 27/07 diz «Walter terminou com 5 provas contra si (mais que o culpado!)».** Verdadeiro da mesa daquele jogador (34 de 51); falso do catálogo, onde 5 apontam Walter e **7** apontam Silas | O relatório é versionado **verbatim** e não se corrige. Fica a ressalva aqui, para o número não fundar decisão de paridade de iscas |

**Atualização de 27/07/2026 — OS-S2 executada:** P-1 (os dois gestos, Frente C-1), P-2
(a cela, Frente C-2), P-3 (o carimbo do rigor, Frente B, decisão do usuário) e P-4 (as
duas derivas da KB, Frente B, decisão do usuário) estão **fechados**; ata em
`historico-decisoes.md`. Só o P-5 permanece, como ressalva de leitura.

---

## Verificação das pendências da OS-S1 (27/07/2026)

A OS-S1 («A Hora Emprestada», PR #103) deixou quatro itens em aberto, listados na ata de
`historico-decisoes.md`. Conferidos contra o código nesta data — **dois seguem abertos
intactos, um estava bloqueado sem que se soubesse, e um já tinha resposta e ninguém a
tinha lido.**

### 1. Os anéis do Ato I e do Ato II (PD-07 por inteiro) — 🔓 **aberto, intacto**

Verificado em `src/data/mapa.js`: dos nove nós, sete nascem com `desbloqueadoInicio:
true`; só `cela` e `gabinete_pettigrew` nascem fechados. O anel do Ato III (a cela, aberta
pela extração de `dep_avistamento_padeiro`) está lá e funciona; posto, estalagem,
papelaria, moinho e torre continuam abertos desde a primeira hora, como a ata declarou.

O conserto do item 5 do playtest tocou este arquivo, mas **só o `grupo` da cela** — o
estado de anel ficou inalterado. Continua sendo trabalho de OS própria, com o gate de
`qa-ui.mjs` refeito no mesmo commit, pela razão que a OS-S1 já registrou (G10 + `GR4-5`).

### 2. A OS «Reação Vital Condicionante» — 🔓 **aberto, intacto**

Ausente do repositório; a única menção em todo o `docs/` é a linha da ata que a declara
ausente. Continua «recomendada, não bloqueante», pelo motivo original: a cela entrou como
auto de exame.

### 3. Playtest do mural a 51 cartas — 🚫 **estava BLOQUEADO, e agora não está**

Não era «por fazer»: era **infazível**. O playtest de 27/07 parou em **34 de 51**
observações, e 13 das 17 que faltaram eram exatamente as cartas que nascem dentro de
diálogo — as que o defeito do item 1 apagava ao descer a árvore. Nenhuma partida podia
chegar a 51 enquanto o defeito existisse, e por isso a medida que a OS-S1 pediu não podia
ser tomada.

Corrigido o item 1, a medida passa a ser possível. **Fica como o primeiro pedido de
playtest da próxima rodada**, e agora com sentido: medir se a Estação II satura com o
dossiê inteiro na mesa.

### 4. As três interferências leem-se como AUTORIA? — ✅ **respondido, e a resposta é NÃO**

**O playtest de 27/07 já tinha respondido, sem saber.** O item 7 do relatório («fio solto:
o esconderijo da torre») descreve «chapa presa para trás, vazio limpo, sebo na trava» —
que é, palavra por palavra, o `carimboPadrao` de `ev_esconderijo_vazio`. Essa carta **só
existe depois de `corrida_a_torre` disparar**. O jogador pôs um papel diante de Silas,
Silas correu à torre, o jogador subiu depois e achou o vão limpo — e arquivou aquilo
como «a única promessa que o caso faz e não paga».

O mecanismo funcionou inteiro. O que falhou foi a leitura, e as três causas estão no
código:

- **O anúncio é uma linha no fim de uma lista comprida.** `dispararInterferencias`
  escreve em `s.log`, e o `log` só se lê no «Diário da investigação», última seção da
  Caderneta, em `text-sm text-stone-300`, misturado com um `Registrado: …` por carta
  extraída — ~50 linhas naquela partida. Os dois usos de `log` na prancha da vila são
  `horaDoAcrescimo`; **nada do anúncio chega ao mapa ou à cena**.
- **O mundo muda, mas só se vê o depois.** Os `blocosContingentes` do posto e da torre
  trocam a prosa quando o evento dispara (bem desenhado: nunca sobra termo clicável para
  carta que já não se colhe). Só que quem visita o lugar **uma vez** lê apenas o estado
  final e nunca soube que houve um anterior.
- **A ponte causal existe e chega tarde demais.** `ECOS_INTERFERENCIA_TUTORIAL` tem a
  frase que fecharia a leitura — «A retratação veio depois da minha volta ao correio, e
  não antes» —, mas `derivarEcosInterferencia` só corre dentro de `julgar`, e o eco cai
  na Caderneta **depois de a partida acabar**, num painel que ninguém reabre.

A R3 manda que a autoria seja reconstruível de trás para frente. A cadeia está toda
montada; o que falta é o jogador ter uma razão para percorrê-la enquanto ainda joga.
**Fica aberto como pergunta de desenho, não de medição** — a medição está feita.

Nota de escopo: `silenciar_herrick` não chegou a disparar naquela partida (o relatório
julga Herrick vivo), e `coacao_wick` não aparece no relatório de forma alguma. A amostra
é de um jogador e de um degrau; a conclusão que ela sustenta com firmeza é a do Degrau 2.
