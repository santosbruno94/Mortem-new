# OS — Lapidação editorial da prosa dos casos gerados

**Status: EXECUTADA (16/07/2026).** Fases 0–4 entregues: parecer consolidado do
pipeline `revisar-prosa` sobre o corpus realizado dos 9 casos, reescrita na
fonte + regeneração no mesmo commit, segundo passe com zero achados
bloqueantes (três revisores: APROVADO), docs sem a ressalva "mecânica
primeiro", roteiro de leitura em `docs/playtest-leitura-prosa-gerada.md` e ata
em `docs/historico-decisoes.md`. Nenhuma exceção da allowlist do lint-prosa
pertencia às fontes desta OS; nenhuma exceção nova foi criada. Origem: decisão
registrada na Fase 6 — "Prosa de template em regime
'mecânica primeiro' (precedente de dialogos.js): funcional, sob lint-prosa; a
lapidação editorial passa pelo pipeline `revisar-prosa` em passo próprio"
(`docs/historico-decisoes.md`; anotada também em `MORTEM_CONTEXTO.md` §13 e em
`docs/game-design-simulacao.md`, bloco da Fase 6).

## 1. Objetivo

Elevar a prosa dos casos gerados do regime "mecânica primeiro" ao padrão
editorial do caso-escola: todo o corpus REALIZADO (os 9 casos embarcados —
réplica dirigida + pool de 8) passa pelo pipeline `revisar-prosa` e sai com
zero achados bloqueantes. A correção se faz sempre na FONTE (os templates de
`src/gerador/pacote_gerado.js`), nunca no dado embarcado: um achado lido num
caso conserta os nove.

## 2. Não-objetivos (v1 desta OS)

- **Nenhuma mudança de mecânica.** `tagsOcultas`, ids, estados, estrutura de
  cartas/localidades/abertura e tudo que o motor lê ficam intactos. O
  veredicto não ganha nem perde nada com esta OS.
- **Não relapidar as falas geradas** (`src/gerador/dialogos_gerados.js`) — a
  Fase 4 da OS da árvore de diálogo já as passou pelo pipeline. Achado
  residual em fala entra como correção pontual, não como frente.
- **Não relapidar o catálogo de interferência** (`src/gerador/interferencia.js`)
  — prenúncio e ecos já nasceram pelo pipeline de prosa (Fase 4 do gerador).
  Vale a mesma regra do residual. A carta de prenúncio conserva o TEXTO EXATO
  do evento (contrato R4/Fase 5): qualquer retoque ali mexe nos dois lados do
  contrato e exige a guarda correspondente verde no mesmo commit.
- **Nenhuma prosa nova de feature**: sem passos novos de abertura, sem
  localidade nova, sem carta nova. Lapidar é reescrever o que existe.
- **Caso-escola intocado** (regressão zero — como em toda OS do gerador).

## 3. Contrato com o que existe (não muda)

- **Marcadores e interpolações são estruturais**: `[[id_da_carta]]`,
  `{detective.campo}` e `{g:masc|fem}` sobrevivem a toda reescrita
  (CLAUDE.md); o fiscal-continuidade os confere.
- **Replay byte a byte da Fase 6**: o QA compara o embarcado
  (`src/data/casos_gerados.js`) com o montador de hoje. Template alterado ⇒
  `npm run gerar:casos` no MESMO commit, sempre.
- **Contrato com o `qa-ui.mjs`**: a ROTA GERADA clica e confere textos
  realizados (extração pela prosa, rótulos, retomada). Reescrita que altere
  texto que o QA procura exige atualizar o QA no mesmo commit (regra já
  vigente do CLAUDE.md).
- **lint-prosa já cobre a fonte**: `src/data/casos_gerados.js` está entre as
  17 fontes do linter (cheques 1–7). Esta OS não pode criar exceção NOVA de
  allowlist para prosa gerada — quem perde o parecer é reescrito.
- **Concordância pelo elenco**: a prosa realizada concorda com o gênero da
  vítima, do réu e das testemunhas caso a caso (padrão já estabelecido em
  `realizarCartas`/`montarLocalidades`); toda variante reescrita preserva os
  dois ramos.

## 4. O corpus (inventário das superfícies)

Tudo em `src/gerador/pacote_gerado.js`, salvo nota:

1. **Tabelas de prosa**: `PROSA_MOTIVO` (10 móbeis), `PROSA_LESAO` (5
   métodos), `PROSA_RIGOR` (4 estados), `PROSA_LIVOR` (2) +
   `NOTA_LIVOR_CONTRADITORIO`, `FRASE_TRAIT` (4), `FRASE_COMPORTAMENTO` (4).
2. **Cartas realizadas** (`realizarCartas`): variantes de instrumento (×3),
   pertence (×2), visto-com-vida (×2), ruído, móbil (frase + fallback),
   sangue alheio, pegadas, reação vital; cartas de interferência (recusa,
   pressão, retratação, rastro de dinheiro ×2, segunda morte, fuga, limpeza
   ×2). Inclui `textoDisplay` e `carimboPadrao`.
3. **Localidades** (`montarLocalidades`): corpo, cena, delegacia, vizinhança,
   ofício do réu — prosa, subtítulos e **blocos contingentes** (a frase-molde
   "Desde a última visita, alguma coisa mudou por aqui." é candidata óbvia).
4. **Abertura** (`montarAbertura`): 6 passos (pensão, chamado, carta do
   delegado, transformação, chegada, briefing), 3 perguntas do briefing e a
   descrição do perito da seleção.

Superfície realizada: 9 casos × (5 localidades + ~15 cartas + abertura). A
revisão LÊ o realizado (como o jogador lê) e CORRIGE o template.

## 5. Desenho proposto

1. **Extração do corpus realizado** (Fase 0): script de mesa (fora do bundle)
   que despeja a prosa dos 9 casos por superfície, com o mapa
   variante-de-template → casos que a materializam. Variante que nenhuma seed
   embarcada materializa é revisada de mesa sobre o template e anotada no
   inventário.
2. **Parecer antes da pena** (Fase 1): triagem pela skill `anti-padrao-ia` +
   passe do pipeline `revisar-prosa` (editor-crítico, perito-forense,
   fiscal-continuidade) sobre o corpus realizado. Cada achado é mapeado ao
   template de origem — o parecer é a pauta da reescrita, no molde do
   `docs/relatorio-qa-2026-07-13.md`.
3. **Reescrita na fonte** (Fase 2): skill `redigir-prosa` (agente
   `escritor-prosa`) sobre os templates apontados, com atenção aos riscos
   próprios de prosa-molde:
   - **monotonia entre casos** — a mesma frase-molde lida nove vezes muda de
     gosto; onde a repetição doer, variantes selecionadas por `hashString`
     salgado com a seed (nunca sorteio), como toda variação do jogo;
   - **costura com o injetado** — nomes de gente, rótulos de prédio (com as
     contrações de `formasDoLugar`), horas e faixas precisam assentar em
     qualquer combinação que o gerador produza;
   - **observação pura** — carta e localidade entregam o fato, nunca a
     conclusão (fair play; o cruzamento é do jogador).
4. **Regenerar e reler** (Fases 2–3): `npm run gerar:casos`, QAs verdes,
   segundo passe do `revisar-prosa` sobre o corpus regenerado até zero
   bloqueantes — a regra do CLAUDE.md ("nenhuma reescrita substancial entra
   em commit sem o pipeline com zero achados bloqueantes") vale por fase.
5. **Acerto de contas com a allowlist** (Fase 4): as exceções marcadas
   `TODO(revisão editorial)` no `lint-prosa.mjs` que pertençam às fontes
   desta OS recebem o parecer que aguardam — a que perder sai da lista e o
   texto é reescrito; a que ficar troca o TODO pela decisão lavrada.

## 6. Guardas e QA

- **Nada estrutural novo é obrigatório**: as guardas da Fase 6 (replay byte a
  byte, higiene de pacote, marcadores ↔ cartas, zero id/rótulo cru) e o
  lint-prosa já cercam esta OS por inteiro.
- **Opcional, a decidir na Fase 0**: guarda de variante órfã no `qa.mjs`
  (lista variantes de template que nenhum caso embarcado materializa), para a
  cobertura da revisão ficar provada em máquina e não em ata.
- **Regressão zero**: `npm run build`, `node scripts/qa.mjs` e
  `node scripts/qa-ui.mjs` verdes ao fim de cada fase; o caso-escola não é
  fonte desta OS e permanece byte-idêntico.

## 7. Fases e ordem de serviço

| Fase | Entrega | Aceite |
| --- | --- | --- |
| 0 | Inventário do corpus realizado + mapa variante→casos + triagem `anti-padrao-ia` | Revisão de mesa |
| 1 | Parecer consolidado do `revisar-prosa` sobre o corpus, achados mapeados a template | Parecer em mãos, pauta fechada |
| 2 | Reescrita dos templates (`redigir-prosa`) + `gerar:casos` + QAs | build + qa + qa-ui + lint verdes |
| 3 | Segundo passe do `revisar-prosa` sobre o corpus regenerado | Zero achados bloqueantes |
| 4 | Revisão das exceções TODO da allowlist (fontes desta OS) + docs (MORTEM_CONTEXTO §13, game-design Fase 6, ata) + playtest de leitura | Roteiro de playtest próprio; docs sem a ressalva "mecânica primeiro" |

## 8. Tamanho honesto

Menor que a OS da árvore de diálogo: não há derivador novo nem guarda
estrutural obrigatória — o grosso é trabalho editorial sobre ~40 superfícies
de template lidas em 9 realizações, pelo pipeline que já existe. Estimativa de
mesa: comparável às Fases 3–4 da OS de diálogo somadas. O risco de estouro é
um só: a monotonia entre casos pedir variantes novas em muitas superfícies —
cada variante nova amplia o corpus a revisar. Se o parecer da Fase 1 apontar
esse caminho em escala, o corte de escopo se decide ali, com o parecer na mão.

## 9. Dependência registrada: pontos da cena (OS palco em anéis, E1 — 18/07/2026)

A fase E1 da OS "Palco em anéis" dividiu a cena gerada em `introducao` +
`pontos` (um por cômodo do grid), com prosa mínima por template seedado em
`montarLocalidades` (`pacote_gerado.js`): a introdução do prédio, a abertura
de mobília por ponto (2 variantes), a nota do cômodo do corpo, as texturas de
vestígio por cômodo e as frases de carta com variante cômodo-neutra. **Essas
superfícies entram no corpus desta OS** (inventário da Fase 0 e passes 1–3).

Registro de decisão do autor (18/07/2026): os **micro-gestos gerados** nos
pontos da cena (extração por gesto, à la "contar os entalhes da roda") foram
adiados da v1 do E1 **para esta OS** — desenhar os gestos junto da lapidação
das frases de ponto, quando a prosa de cada cômodo tiver voz própria.
