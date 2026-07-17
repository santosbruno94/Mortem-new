# OS — Camada psíquica do elenco: vetores, desencaixe e encenação condicionada

> **Instruções de execução (agente de código).** Leia, nesta ordem: `CLAUDE.md`,
> `docs/game-design-simulacao.md` (§ do gerador e Regras R1–R6),
> `docs/kb-producao/arquetipos-e-casting.md`,
> `docs/kb-producao/sistemas-arquetipicos-alem-dos-12.md`,
> `docs/kb-producao/psicologia-pos-junguiana.md`,
> `docs/kb-producao/parafilias-e-psicopatia-visao-atual.md`, `src/data/papeis.js`,
> `src/gerador/arquetipos.js`, `src/gerador/amostragem.js`, `src/gerador/caso.js` e o
> `qa.mjs`. **Primeiro commit:** gravar esta OS em
> `docs/os-camada-psiquica-do-elenco.md`. Depois, executar as fases do §6 **em
> sequência**, um commit por fase, PR único, ata de fechamento ao fim desta OS.
> Pontos marcados **[DECISÃO DO USUÁRIO]** interrompem a execução: registrar a dúvida
> em ata parcial e parar. Divergência entre KB e necessidade do motor é decisão do
> usuário, nunca do agente (`CLAUDE.md`). Nada além do especificado entra em código:
> melhoria percebida vira nota na ata, não commit.

---

## 1. Objetivo

Dar ao elenco gerado a **segunda coluna** que a pesquisa do PR #49 propôs e a
discussão de design aprovou:

- **(a)** promover o catálogo de vetores psíquicos com sombra bipolar
  (`sistemas-arquetipicos-alem-dos-12.md` §7) de `[PROPOSTA]` a **catálogo v1**, com
  as emendas do §4.1 desta OS;
- **(b)** implementar o **desencaixe vocação × ofício** como motor de móbil do
  assassino **com falso-positivo garantido** (anti-tell, §4.3);
- **(c)** condicionar a **qualidade da encenação ao tipo de crime** — reativo →
  ocultação improvisada com erros de pânico; premeditado → limpa demais, e a
  perfeição vira pista (§4.4);
- **(d)** compilar tudo em **consequências** (flags de diálogo, tendências de
  vestígio, gatilhos) — o rótulo morre no log de build (§4.5);
- **(e)** aplicar os **reparos de fonte** apontados na revisão da pesquisa (§4.6).

## 2. Não-objetivos (v1 desta OS)

- **Nada muda no runtime do veredicto.** Condena-se por materialidade (janela +
  causa + nexo); psicologia jamais condena. As funções de lógica seguem lendo
  somente `tagsOcultas` + seed.
- **Nenhum vocabulário psicológico moderno** em prosa, `src/data`, glossário ou UI
  (guardas no §5).
- **Parafilias não viram conteúdo explícito.** Seguem como segredo/vergonha de
  época, expressas só pelo vocabulário de `kb-psique-e-crime/sexologia-e-perversoes.md`
  §6, com distribuição conforme `parafilias-e-psicopatia-visao-atual.md` §3
  (interesses comuns e majoritariamente inofensivos; jamais assinatura de culpado).
  **Trava dura e inviolável: nada envolvendo menores entra no espaço gerativo, em
  nenhuma camada, backend incluído.**
- **Sem "perfil psicológico" como mecânica** — anacrônico em 1893 e refutado hoje
  (Canter 2004, na KB).
- Os papéis dramáticos (`src/data/papeis.js`) não mudam: esta OS os alimenta, não os
  redesenha. Os 14 arquétipos demográficos e seus priors também não mudam.

## 3. Contrato com o que existe (não muda)

- **Duas colunas ortogonais:** arquétipo demográfico (`arquetipos.js`, matéria
  social) × vetor psíquico (esta OS, matéria íntima). Papel dramático vem antes de
  ambos (estrutura → cor, `arquetipos-e-casting.md` §4.2).
- **Regra de contraste** do casting: culpado de persona luminosa, isca turva
  (`arquetipos-e-casting.md` §4.1).
- **Regras de Justiça R1–R6** e os dois cenários de crime existentes ("briga
  escalada" / "premeditado").
- **Determinismo total:** toda variação por `hashString(seed + sal)`
  (`src/logic/hash.js`); zero `Math.random`/`Date.now` (guarda no `qa.mjs`).
- **Andaime:** tudo desta OS é gerador-facing; runtime jamais importa; o pacote de
  caso carrega só consequências.
- **Prosa** nova ou reescrita passa por `redigir-prosa` + `revisar-prosa`, zero
  achados bloqueantes.

## 4. Desenho proposto

### 4.1 Catálogo v1 (Fase 1 — docs)

Promover os 10 vetores do §7 com três emendas:

1. **11º vetor: Vigia.** Valor professado: saber o que se passa na vila; pertencer
   pela informação. Medo central: irrelevância, ficar de fora do que importa.
   Sombra ativa: **chantagista/difamador** — e candidato natural à segunda vítima
   clássica do gênero (quem viu e tentou lucrar). Sombra passiva: **o voyeur que
   testemunhou o essencial e não pode explicar por que estava à janela** — a
   materialização do "parafilia como segredo de inocente" da KB, sempre em
   vocabulário de época. Auto-justificação: "alguém tinha de saber". Afinidades
   demográficas a derivar da KB no padrão da tabela 7.2 (candidatas: lavadeira — a
   roupa conta segredos —, criada, merceeiro, taverneiro; encaixe raro e saboroso: o
   pároco que cataloga o rebanho). Afinidade forte com os papéis `fonte`,
   testemunha e `veu` — os mais magros da tabela atual.
2. **Médium/espiritismo dos 1890s:** entra como *tempero* do Devoto ou do Erudito
   (sombra ativa alternativa: o charlatão do além que silencia quem ia expô-lo), com
   proveniência na KB. **Se** a análise pelos critérios do §6 de
   `sistemas-arquetipicos-alem-dos-12.md` indicar que merece 12º vetor próprio,
   **[DECISÃO DO USUÁRIO]** — parar e perguntar.
3. **Nota "Amante":** registrar exceção consciente à regra "sem rótulos de Pearson"
   (colisão com o Lover), sem renomear.

Atualizar: tabela 7.2 (linha Vigia), afinidades vetor → papel, e as referências
cruzadas em `arquetipos-e-casting.md`.

### 4.2 Sorteio ortogonal (Fase 3)

Por personagem: vetor + polaridade da sombra via `hashString` com os pesos da 7.2
(§8.2 para os sais). Pesos de afinidade, jamais restrição dura: qualquer psique pode
calhar em qualquer ofício.

### 4.3 Desencaixe com falso-positivo garantido (Fases 2–3)

- **Magnitude de desencaixe** por tabela auditável (§8.3): afinidade alta = 0,
  média = 1, rara = 2.
- Sortear magnitude para **todos**; exigir do **assassino** magnitude ≥ T (T = 2);
  **garantir ≥ 1 não-assassino com magnitude ≥ T** (prioridade:
  `isca_do_apressado`), por reamostragem por rejeição com sal incremental — o mesmo
  padrão do resolvedor de crime.
- Racional (fair play): o desencaixe segue sendo a chave do móbil (tabela 7.3), mas
  deixa de ser prova — existe sempre um destoante inocente que engana o jogador
  apressado.

### 4.4 Encenação condicionada ao tipo de crime (Fases 2–3)

- **Reativo** ("briga escalada"): ocultação improvisada — pool enumerado de erros de
  pânico (§8.4), ancorado na KB forense.
- **Instrumental** ("premeditado"): limpa demais — a perfeição como pista (§8.4).
- **Base-rates, mundo × caso** (registrar em `game-design-simulacao.md`): a
  estatística do mundo (homicídio relacional, doméstico, raro —
  `estatisticas-do-crime.md` + `parafilias-e-psicopatia-visao-atual.md` §6) vive na
  **ambiência** (falas de coroner, inquérito, jornal); a distribuição dos **casos
  jogáveis** é do gênero (o jogador só vê a cauda que virou enigma). Invariante que
  permanece: **estrutura relacional sempre** — autor dentro do círculo social da
  vítima; é ela que fecha o círculo de suspeitos.

### 4.5 Compilação de consequências (Fase 3)

Cada personagem sai do gerador com: **flags de diálogo** (candidatas:
`acusa_com_fervor` [projeção], `defende_demais_o_morto`, `omite_por_decoro`,
`mente_sob_pressao`, `mente_com_calma` [sombra integrada — raro, reservado ao
culpado difícil], `gatilho_de_complexo:<tema>` [a única pergunta que desmonta a
compostura]); **tendências de vestígio** coerentes com vetor + polaridade +
desencaixe; **qualidade de encenação** conforme §4.4. Nenhum rótulo em `src/data`
nem no pacote; vetor/polaridade/magnitude ficam apenas no log de build.

### 4.6 Reparos de fonte na KB (Fase 0)

1. **MBTI:** substituir "o próprio manual reporta 35% de mudança de tipo em 4
   semanas" por dado verificado na fonte; a régua crítica canônica é Pittenger
   (~50% de mudança em 5 semanas, estudos independentes). Se a alegação sobre o
   manual não for verificável, remover e marcar `[conferir]`.
2. **BDSM 1,8% / 2,2% / 1,3%:** apontar a primária (Richters et al. 2008,
   *J Sex Med*, Austrália), mantendo Krueger et al. 2017 como via.
3. **CID-11 §2:** acrescentar as duas categorias residuais ("outro transtorno
   parafílico envolvendo indivíduos não-consentintes" e "…envolvendo comportamento
   solitário ou indivíduos consentintes").
4. **§6.1 de parafilias:** complementar FBI/UCR com o **Homicide Index do ONS
   (England & Wales)** — mesma jurisdição do jogo, elimina a ressalva geográfica.
   Regra da casa: nenhum dado quantitativo sem fonte e ano.

## 5. Guardas e QA (Fase 4)

- **Lint léxico em duas listas** (padrão da guarda de aparências no `qa.mjs`):
  - **L1 — banida em qualquer superfície do jogo** (prosa, `src/data`, glossário,
    UI): nosologia e jargão pós-1893 — `parafilia`, `transtorno parafílico`,
    `psicopata`/`psicopatia` (o construto moderno; *Psychopathia Sexualis* como
    título de obra é permitido nas bocas que a KB autoriza), `PCL`, `Big Five`,
    `triárquico`, `McAdams`, `arquétipo`, `Pearson`.
  - **L2 — banida em identificadores, chaves, `tagsOcultas` e glossário**, mas livre
    como palavra comum da língua na prosa: `sombra`, `persona`, `vetor`,
    `desencaixe`, `complexo`.
  - **Whitelist de época** (fora do lint; regida por `sexologia-e-perversoes.md` §6 e
    `vocabulario-de-epoca.md`): `sadismo`, `masoquismo`, `monomania`, *moral
    insanity* — só nas bocas autorizadas.
- **Guarda de import:** runtime jamais importa `src/gerador/vetores_psiquicos.js`
  (mesma guarda de `arquetipos.js`).
- **Teste de não-vazamento:** grep automatizado no pacote gerado (L1 em qualquer
  campo; L2 em chaves/ids).
- **Teste de determinismo:** mesma seed → elenco idêntico (vetores, polaridades,
  magnitudes, flags).
- **Teste anti-tell:** num lote de ≥ 50 seeds, 100% dos casos têm ≥ 1 não-assassino
  com desencaixe ≥ T.

## 6. Fases e ordem de serviço

| Fase | Entrega | Toca |
|---|---|---|
| 0 | Reparos de fonte (§4.6) | `docs/kb-producao/*.md` |
| 1 | Catálogo v1: Vigia, médium como tempero, nota Amante, 7.2 e refs atualizadas | `sistemas-arquetipicos-alem-dos-12.md`, `arquetipos-e-casting.md` |
| 2 | Spec normativa preenchida: desencaixe (§8.3), encenação (§8.4), mundo × caso | esta OS §8, `game-design-simulacao.md` |
| 3 | Implementação: `src/gerador/vetores_psiquicos.js`, sorteio, desencaixe, compilação de flags | `src/gerador/` |
| 4 | Guardas e testes (§5) | `qa.mjs`, testes |
| 5 | Regeneração dos casos embarcados afetados; prosa alterada passa pelo pipeline; playtest; ata | `src/data/casos_gerados.js`, `docs/playtest-*.md`, ata nesta OS |

Um commit por fase; parar nos **[DECISÃO DO USUÁRIO]**; nenhum vetor além do Vigia
sem ordem expressa.

## 7. Tamanho honesto

Fases 0–2 são edição de documentação (baratas). A Fase 3 é o núcleo: um módulo de
dados novo + dois pontos de integração (amostragem/inserção) + a compilação de
flags. **Se apertar:** a encenação condicionada (§4.4) destaca-se para OS própria
sem quebrar o resto — desencaixe + flags já valem esta OS sozinhos. A Fase 5 só
regenera o que a Fase 3 efetivamente mudou.

## 8. Spec normativa (a Fase 2 preenche o que faltar)

### 8.1 Formato do vetor (dados, espelhando `arquetipos.js`)

Campos por vetor: `id`, `valor`, `medo`, `sombraAtiva`, `sombraPassiva`,
`autoJustificacao`, `afinidadePapeis` (pesos para os 6 papéis),
`afinidadeDemografica` (pesos para os 14 demográficos), `proveniencia` (linha por
linha, apontando doc e §, na regra do manifesto).

### 8.2 Sais de sorteio

`vet_<id>`, `pol_<id>`, `desenc_<id>`, `flag_<id>_<n>` — todos
`hashString(seed + sal)`; rejeições re-hasheiam com sal incremental (`_r1`,
`_r2`, …), padrão do resolvedor.

**Preenchido na Fase 2 — forma concreta (convenção de `amostragem.js`):** `<id>` é o
ÍNDICE do personagem no elenco (estável por seed); o sal completo é
`` `${salDaSeed(seed)}|psique|vet_${indice}` `` (idem `pol_`, `desenc_`, `flag_`), e a
reamostragem por rejeição usa `` `…|vet_${indice}_r${k}` `` com `k` incremental e teto
finito (esgotado o teto, vale o último sorteio elegível por varredura determinística —
jamais laço aberto). A polaridade re-lê o próprio sal sobre o vetor final (não é
re-sorteada por tentativa). Nunca reusar sal entre decisões distintas (regra de ouro da
amostragem).

### 8.3 Magnitude de desencaixe

Derivada da tabela 7.2: afinidade **alta = 0**, **média = 1**, **rara = 2**.
T = 2 para o assassino; ≥ 1 inocente com magnitude ≥ 2 (prioridade isca). A
polaridade não altera a magnitude — altera as consequências (ativa → agressor
direto; passiva → cúmplice, omisso, mandante fraco — alimenta R1–R6).

**Preenchido na Fase 2 — a "prioridade isca" no fluxo gerado.** O papel
`isca_do_apressado` é taxonomia do caso-escola (`src/data/papeis.js`); o caso GERADO não
escala papéis nomeados. A realização equivalente:

1. **Tabela auditável:** a magnitude sai de `afinidadeDemografica` do vetor
   (`vetores_psiquicos.js`), que codifica a 7.2 em três degraus de peso — peso alto =
   afinidade natural (0), peso médio = neutra (1), peso baixo = rara (2). O QA verifica
   que todo par vetor × demográfico tem degrau definido.
2. **Assassino:** sorteado o elenco e escolhido o réu (caso.js), se a magnitude dele
   for < 2 o vetor é reamostrado com sal incremental até sair magnitude 2 (o desencaixe
   É o móbil íntimo — tabela 7.3).
3. **Falso-destoante garantido:** se nenhum não-assassino ficou com magnitude ≥ 2,
   força-se UM por reamostragem idêntica. Prioridade de escolha (determinística, sal
   `desenc_escolha`): primeiro os coabitantes de rotina da vítima que não são o réu —
   os falsos-óbvios naturais, que entram antes na lista de suspeitos do pacote —, depois
   os demais.
4. **A isca engana de fato:** a jusante, o montador (`pacote_gerado.js`,
   `derivarPerifericos`) passa a preferir o falso-destoante como portador do PRIMEIRO
   segredo (`inocente_segredo` + móbil-isca `gen_movel_*`), quando elegível pelas regras
   existentes — o destoante inocente ganha papel + mentira + móbil visível, e "mentiu,
   logo matou" volta a ser a armadilha. Sem elegibilidade, o sorteio atual permanece.

### 8.4 Matriz de encenação

Tipo de crime × qualidade de ocultação → pool de vestígios:
**reativo** {limpeza incompleta, objeto fora de lugar, álibi de última hora e
frágil, sinais de hesitação/defesa conforme KB forense};
**instrumental** {cena "arrumada" em excesso, álibi ensaiado com detalhe demais,
ausência anômala do vestígio esperado, hora encenada (mecânica existente)}.
Todo item cita a `kb-medicina-legal/` (regra de proveniência).

**Preenchido na Fase 2 — pools enumerados, com proveniência por item:**

| Tipo | Item do pool | Proveniência |
|---|---|---|
| reativo | `limpeza_incompleta` — o esfregado converte o óbvio em sutil, nunca em zero | `kb-medicina-legal/vestigios.md` (o que resta ao pano e à água) + `game-design-simulacao.md` §3.3 (conservação da evidência) |
| reativo | `objeto_fora_de_lugar` — deslocado no pânico, sem história que o explique | `kb-medicina-legal/protocolo-exame.md` §4 (incongruência de cena) |
| reativo | `alibi_de_ultima_hora` — paradeiro improvisado, sem testemunha firme, que quebra ao primeiro cruzamento | `kb-medicina-legal/inquerito-e-policia.md` (o depoimento diante do coroner) |
| reativo | `sinais_hesitacao_defesa` — lesões de defesa na vítima e reação vital plena: ninguém "preparou" a luta | `kb-medicina-legal/traumas.md` ("Lesões de defesa"; reação vital) |
| instrumental | `cena_arrumada_demais` — desordem seletiva, roubo que poupa valores | `kb-medicina-legal/protocolo-exame.md` §4 (roubo que poupa valores; arrombamento incongruente) |
| instrumental | `alibi_ensaiado_detalhado` — detalhe demais, repetido sem variação (o ensaio denuncia-se) | `kb-medicina-legal/inquerito-e-policia.md` + `src/data/papeis.js` (`mentiraEnsaiada`) |
| instrumental | `ausencia_anomala_de_vestigio` — falta o que deveria haver; "a leitura mais eloquente é frequentemente a ausência" | `kb-medicina-legal/traumas.md` (ausência de lesão de defesa) + `protocolo-exame.md` §4 (ausência de reação vital) |
| instrumental | `hora_encenada` — cronologia forjada que o corpo contradiz (mecânica existente: `gen_hora_forjada`) | `kb-medicina-legal/protocolo-exame.md` §4 (cronologia forjada) |

**Alcance na v1 (registro honesto, pela válvula do §7):** a matriz compila-se em
**consequência de dados** — o caso bruto sai com `qualidadeEncenacao` (tipo de crime →
qualidade → pool aplicável) por §4.5 —, e a peça física já existente (`gen_hora_forjada`)
fica subsumida ao item `hora_encenada`. A **realização física dos demais itens** no
`RegistroDoCrime`/montador (novas cartas de vestígio por item de pool) destaca-se para OS
própria, como o §7 prevê; nada nesta OS altera a deposição de vestígios do autobattler.

### 8.5 Fair play

O desencaixe vaza por **comportamento e vestígio**, nunca por narração onisciente;
deve ser perceptível o bastante para sustentar hipótese e insuficiente para
condenar — o veredicto segue material. O playtest da Fase 5 verifica: (a) o
falso-destoante existe e engana; (b) nenhuma superfície nomeia rótulo; (c) a
mentira do inocente continua distinguível da do culpado só por materialidade.

---

## Ata de fechamento — 17/07/2026

**Execução integral, fases 0–5, um commit por fase, nesta branch/PR.** Nenhum ponto
de parada se ativou; nenhuma divergência KB × motor surgiu que exigisse decisão do
usuário. Registro fase a fase:

- **Commit inicial:** esta OS gravada em `docs/os-camada-psiquica-do-elenco.md`.
- **Fase 0 (reparos de fonte):** MBTI — a alegação sobre o manual (35%/4 semanas) não
  se verificou na fonte primária; saiu do texto com marca `[conferir]` e entrou a
  régua de Pittenger (1993: reteste de 5 semanas, ~50% reclassificados em ≥1 escala;
  2005: 39–76% no tipo de 4 letras). BDSM 1,8%/2,2%/1,3% apontado à primária
  (Richters et al. 2008, *J Sex Med*). CID-11 §2 com as duas residuais. §6.1 com o
  Homicide Index do ONS (E&W, YE mar/2023: 590 homicídios; ~51% briga/vingança; 35%
  das mulheres adultas por parceiro/ex; 19% dos homens por estranho) — ressalva
  geográfica eliminada.
- **Fase 1 (catálogo v1):** §7 de `sistemas-arquetipicos-alem-dos-12.md` promovido a
  v1 com o 11º vetor **Vigia** (7.1, 7.2 e novo §7.4.1, proveniência na KB); médium
  analisado pelos critérios do §6 e decidido **tempero** do Devoto/Erudito (falha a
  ortogonalidade à profissão — §7.4.2; o [DECISÃO DO USUÁRIO] previsto NÃO se ativou
  porque a análise não indicou 12º vetor); nota "Amante" registrada (§7.4.3);
  referências cruzadas de `arquetipos-e-casting.md` atualizadas.
- **Fase 2 (spec):** §8.2–8.4 preenchidos (sais concretos; a "prioridade isca"
  traduzida ao fluxo gerado — prioridade aos coabitantes da vítima e preferência do
  destoante ao móbil-isca no montador; matriz de encenação com proveniência por item);
  `game-design-simulacao.md` ganhou a segunda coluna no §4.1 e o §4.3 "Base-rates:
  mundo × caso".
- **Fase 3 (implementação):** `src/gerador/vetores_psiquicos.js` (catálogo §8.1 +
  matriz §8.4 + sorteio + desencaixe + compilação §4.5); integração em `caso.js`
  (campo `psique` do caso bruto: `consequencias` + `log`) e em `pacote_gerado.js`
  (preferência §8.3.4). Regeneração de `casos_gerados.js` ANTECIPADA para este commit
  (precedente da OS de lapidação: fonte + `gerar:casos` juntos) para manter o portão
  byte a byte verde em todo commit — a Fase 5 conferiu que nada mais restava. Pool
  inalterado (mesmas 20 seeds).
- **Fase 4 (guardas):** seis guardas novas no `qa.mjs` (catálogo íntegro com degrau
  raro alcançável; lint L1; lint L2 por segmento de identificador; não-vazamento no
  pacote; determinismo da psique; anti-tell em 50 seeds). A L2 acusou e corrigiu um
  identificador real (`hexParaVetor` → `hexParaVec3`) na primeira execução.
- **Fase 5 (fechamento):** playtest mecânico em
  `docs/playtest-os-psiquica-2026-07-17.md` — §8.5(a) destoante em 20/20, portador da
  isca em 11/20 (demais inelegíveis pelas regras do montador, conforme spec); (b)
  não-vazamento verde; (c) 4 perfis → 4 desfechos no pool regenerado. Nenhuma prosa
  nova (templates lapidados reaproveitados) ⇒ `revisar-prosa` não exigível;
  `lint-prosa` verde. `npm run build`, `qa.mjs` e `qa-ui.mjs` verdes.

**Notas para OS futura (melhorias percebidas, NÃO implementadas — regra do cabeçalho):**

1. **Consumo das flags no diálogo gerado** (`dialogos_gerados.js`): `acusa_com_fervor`
   vazando projeção nos beats, `omite_por_decoro` no tom evasivo, `mente_com_calma`
   sem tell de repetição, e o `gatilho_de_complexo:<tema>` como a pergunta que
   desmonta a compostura — as flags já saem compiladas do gerador; falta a boca.
2. **Realização física dos pools de encenação** (§8.4) no `RegistroDoCrime`/montador
   (novas cartas por item de pool) — destacada pela válvula do §7 da OS.
3. **Calibragem da preferência do destoante:** quando existem vários destoantes natos,
   preferir o que estará na lista de suspeitos E é elegível a segredo elevaria os
   11/20 sem tocar nas regras do montador.
4. **Tempero médium:** realizar a sombra alternativa do Devoto/Erudito quando a camada
   de segredos ganhar catálogo próprio.
