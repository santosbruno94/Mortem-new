# OS Vila Viva — E0: plano contra a genericidade espacial dos casos procedurais

Data: 2026-07-22. Origem: queixa do criador — "todos os casos possuem a casa do
suspeito, o corpo, delegacia e a vizinhança; a pesquisa sobre estrutura da vila,
mobílias e sistema de grid pouco serve". Este documento é PLANO (design antes de
build): nada aqui autoriza implementação sem ordem expressa por etapa.

---

## 1. Diagnóstico: onde a genericidade nasce

A investigação do código e dos documentos corrige a premissa em um ponto importante:
**a pesquisa já é consumida pelo gerador — ela morre na última milha, antes de chegar
ao jogador.** Cinco causas concretas:

| # | Causa | Evidência |
|---|---|---|
| 1 | **Esqueleto fixo de 4 locais.** Todo caso gerado embrulha o mundo em `corpo`, `cena`, `delegacia`, `vizinhanca` (+ `oficio_do_reu` e `comarca_*` condicionais). Nunca há casa nomeada de vizinho, rua, adro, solar. | `src/gerador/pacote_gerado.js` (~l.1595, `montarLocalidades`) |
| 2 | **Prosa-molde com 2 variantes.** Delegacia, vizinhança, corpo e introdução da cena são frases fixas escolhidas entre duas opções por seed. A delegacia é sempre "uma sala de armários abertos"; a vizinhança, sempre "paredes finas e janelas que dão para a mesma rua". | `pacote_gerado.js` ~l.1281-1310, 1472-1477, 1492-1498, 1564-1570 |
| 3 | **A vila gerada não chega nem à prosa nem ao visual.** O `cidade.js` gera igreja, solar, cottages, adro, grafo de quem-ouve-quem — mas só o prédio da cena é nomeado; o resto vira insumo mecânico invisível (álibis, ouvintes). | `src/gerador/cidade.js` l.134-206 × `pacote_gerado.js` |
| 4 | **A planta interior é gerada em TODO caso e nunca mostrada.** `interior.planta` (grid + cômodos + mobília por célula, projeção SVG) existe em todo pacote, mas só o caso-escola renderiza planta (`PlantaRelojoaria`). O jogador do procedural recebe lista de pontos, não espaço. | `src/gerador/interiores.js` l.284 × `src/components/EventoLocalidade.jsx` l.217 |
| 5 | **O diorama procedural é órfão.** `cidade.js` exporta `diorama: {posicoes, formas}` que ninguém consome; o 3D em runtime lê apenas o `POSICOES_DIORAMA` hardcoded do caso-escola, então todo caso gerado cai na grade 2D fixa. | `cidade.js` l.199-205 × `src/data/mapa_espacial.js` l.20-40, `Escrivaninha.jsx` l.43-52 |

Corolário: a única variedade espacial que o jogador percebe hoje é **qual prédio é a
cena** (moinho/mercearia/taverna/granja…) e seus cômodos. Tudo o mais é invariante.

## 2. O que a pesquisa já oferece e está ociosa (ou sub-usada)

| Fonte | O que oferece | Estado |
|---|---|---|
| `kb-mundo-vitoriano/urbanismo-e-morfologia.md` §1 | 5 morfologias de vila (nucleada, linear, de green, de propriedade, de encruzilhada) | Só a nucleada existe: `TRACADO` único e hardcoded em `cidade.js` l.79-110 |
| `urbanismo-e-morfologia.md` §5 | O "segundo grafo" (back lanes/footpaths), "fonte de toda rota de crime plausível" | Logradouro `travessa_dos_fundos` já desenhado no dossiê E2 da palco-em-aneis, catalogado v2, não ativado |
| `mobiliario-por-classe.md` §Implicações | Assimetrias legíveis: piano em cottage pobre, feather bed herdado, monograma alheio na prataria, crepe de luto datando perda, dresser desfalcado | Só vocabulário decorativo + âncora de vestígio; a metade "leitura social do morador" (prometida em `game-design-simulacao.md` §4.2.6) não é jogada |
| `interiores.js` (grid) | Planta por tipo de prédio com mobília posicionada e SVG pronto | Consumida pelo autobattler e pelos pontos de cena; **nunca renderizada** no procedural |
| `cidade.js` (vila) | Vila completa com quarteirões, adjacência, vizinhos com endereço | Alimenta álibis/ouvintes; invisível na prosa e no visual |

## 3. Cercas — o que este plano NÃO propõe (rejeições já lavradas)

- **Grid espacial jogável / tabuleiro de salas** (Blue Prince): rejeitado,
  `historico-decisoes.md` l.55-66 e l.136-150 (grid é geometria de build time, nunca
  mecânica de posicionamento na mão do jogador).
- **Agenda por hora / rotina contínua** (Shadows of Doubt): rejeitado; três faixas
  bastam (`historico-decisoes.md` l.121-124, `game-design-simulacao.md` §6).
- **Interior detalhado para local não elegível a cena**: fora de escopo por LOD
  (`game-design-simulacao.md` §6).
- **Variedade de palco externo**: já entregue pela OS palco-em-aneis v1 (adro, pátio
  da granja, caminho do açude; regime comprovado por Monte Carlo 200k) — não refazer.

## 4. O plano — seis etapas, cada uma um incremento jogável

Ordem por razão imersão ÷ esforço. Cada etapa é independente o bastante para ser uma
OS própria com playtest ao final.

### E1 — A planta chega ao jogador (fechar a última milha)

**O que o jogador ganha:** ao abrir a cena de um caso procedural, vê a planta do
prédio (o mesmo traço de tinta do caso-escola), com os cômodos nomeados e os pontos
de interesse ancorados no cômodo onde de fato estão. O espaço deixa de ser lista.

- **O que muda:** generalizar o componente de planta (hoje `PlantaRelojoaria.jsx`
  amarrado a `planta_relojoaria.js`) para receber qualquer `interior.planta` do
  pacote; ligar `vestigio.comodo`/`celula` à planta (destaque do cômodo ao abrir o
  ponto). Nenhuma mudança no gerador: o dado já existe em todo pacote.
- **Guarda-corpos:** planta é camada visual — nenhuma regra lê; fallback textual
  atual permanece (`?flat=1` e ausência de planta ⇒ lista de hoje).
- **Já decidido a favor:** `plano-de-sessoes.md` S2 ("planta única navegável no
  caso-escola **e** na cena procedural"); `pendencias-status.md` item 8. Esta etapa
  só executa o que já foi lavrado.
- **Pronto quando:** 3 seeds distintas mostram 3 plantas distintas coerentes com os
  pontos; `qa-ui.mjs` atualizado no mesmo commit se algum rótulo/overlay mudar.

### E2 — A vizinhança ganha nome e parede (prosa bebe da vila gerada)

**O que o jogador ganha:** em vez de "paredes finas e janelas que dão para a mesma
rua", a localidade `vizinhanca` descreve a vila que o gerador de fato construiu: a
ruela onde a vítima morava, quem é parede-meia (nomes reais do elenco inserido pelos
`insercao.js`), o que se vê do adro, a que distância fica a granja. A `delegacia` e o
`corpo` também trocam o molde por composição de fragmentos.

- **O que muda:** `montarLocalidades` passa a compor a prosa a partir de fragmentos
  alimentados pelos dados que já existem (`mundo.cidade` — quarteirões, prédios,
  silhuetas; `insercao` — endereços do elenco; grafo de adjacência — quem ouve quem),
  selecionados por `hashString` salgado. O molde de 2 variantes vira banco de
  fragmentos por morfologia/quarteirão/classe, redigido pela skill `redigir-prosa` e
  revisado pelo pipeline `revisar-prosa` antes de qualquer commit.
- **Fair play:** os vizinhos nomeados na prosa são os mesmos que o motor já usa como
  ouvintes/álibis — a prosa passa a MOSTRAR o que a mecânica já computa, sem criar
  informação nova nem vazar `tagsOcultas`.
- **Absorve pendência:** P4 ("delegacia" é conceito impróprio para vila de 1893 —
  terminologia do constable/petty sessions, prevista para S5) entra aqui como parte
  da reescrita da localidade.
- **Pronto quando:** 5 seeds produzem 5 vizinhanças textualmente distintas, com nomes
  e geografia verificáveis contra o `mundo.cidade` da mesma seed (checagem no
  `fiscal-continuidade`); zero achados bloqueantes no `revisar-prosa`.

### E3 — A mobília lê o morador (a segunda leitura prometida)

**O que o jogador ganha:** o cômodo conta quem a pessoa é. Num caso, um piano num
cottage de aluguel de 13s; noutro, um dresser desfalcado (louça vendida peça a peça);
noutro, crepe de luto datando uma perda que o suspeito não menciona. Uma assimetria
por caso, sorteada deterministicamente do catálogo da KB e AMARRADA a um fato do
personagem que o gerador já computou (aperto econômico, herança, luto, motivo).

- **O que muda:** no build time, o gerador seleciona 1-2 "assimetrias legíveis" do
  catálogo (`mobiliario-por-classe.md` §Implicações, transcrito para
  `espaco.js`/dados) coerentes com os flags do personagem, e as injeta na prosa do
  cômodo e/ou numa carta de observação. O pacote carrega só a consequência (texto +
  carta); **o motor permanece cego** — a assimetria corrobora, não prova; nenhuma
  regra de veredicto a lê.
- **Fair play:** assimetria nunca é a única via para uma dedução essencial (mesma
  regra dos vestígios de chamariz); serve de textura e de corroboração de motivo já
  alcançável por outra rota.
- **Pronto quando:** gabarito (`gabarito-casos.mjs`) confirma que os 4 perfis de QA
  seguem produzindo os 4 desfechos; leitura de 5 seeds mostra assimetrias variadas e
  coerentes com o personagem (playtest de leitura).

### E4 — A vila muda de forma entre casos (morfologias)

**O que o jogador ganha:** casos em vilas estruturalmente diferentes. Uma vila linear
de estrada (High Street esticada, tudo se vê da rua) investiga-se diferente de uma
vila de green (todos os olhos para o centro comum) ou da nucleada atual.

- **O que muda:** parametrizar o `TRACADO` de `cidade.js` em 2-3 morfologias da KB
  (nucleada atual + linear + de green; as demais ficam para depois), escolhidas por
  seed. O grafo de adjacência e as distâncias derivam da morfologia — as
  consequências mecânicas (ouvintes, avistamentos, custo de deslocamento) fluem
  sozinhas pelo cano que já existe. A prosa da E2 lê a morfologia pelos mesmos
  fragmentos.
- **Risco maior do plano:** morfologia mexe na malha de avistamentos e pode
  desequilibrar as Regras de Justiça R1-R6. Obrigatório rodar
  `relatorio-espacial.mjs` (Monte Carlo) por morfologia ANTES de aceitar, como a
  palco-em-aneis fez.
- **Pronto quando:** relatório espacial mostra os regimes de palco e de justiça
  dentro das bandas atuais nas 3 morfologias; `qa.mjs` verde.

### E5 — O segundo grafo entra em cena (travessa dos fundos, v2 já desenhada)

**O que o jogador ganha:** crimes com rota discreta — o fundo dos lotes, o caminho
que não passa pela High Street. É a peça que faz "quem viu / quem não viu" virar
pergunta espacial de verdade.

- **O que muda:** ativar o logradouro `travessa_dos_fundos` conforme o dossiê
  E2 da palco-em-aneis (partição e pool já especificados lá; recomendação v2 era só
  sequenciamento, não rejeição). `plataforma_da_estacao` permanece v3.
- **Pronto quando:** mesmos critérios do relatório espacial v1 (bandas de regime,
  saturação do grafo de avistamentos controlada).

### E6 (futuro, opcional) — Paridade do diorama 3D

Consumir `cidade.diorama` para dar ao caso procedural a maquete que hoje é exclusiva
do caso-escola (`pendencias-status.md` item 17). É a etapa mais cara e a de menor
razão imersão÷esforço enquanto E1-E5 não existem — a grade 2D com fallback já cumpre.
Fica registrada como destino, não como compromisso.

## 5. Ordem, dependências e esforço relativo

```
E1 (planta) ──────────────► sozinha; maior ganho imediato, menor risco
E2 (prosa da vila) ───────► independente de E1; pipeline de prosa completo
E3 (mobília social) ──────► ideal após E2 (os fragmentos de prosa já existem)
E4 (morfologias) ─────────► após E2 (senão a variação estrutural fica invisível)
E5 (travessa, v2) ────────► após E4 rodar o relatório espacial (mesma bancada)
E6 (diorama) ─────────────► último, opcional
```

Esforço relativo: E1 pequeno · E5 pequeno-médio · E2 médio · E3 médio · E4 grande ·
E6 grande.

## 6. Regras que permanecem invioláveis em todas as etapas

- Motor lê SOMENTE `tagsOcultas` + seed; vila, planta, mobília-leitura-social e
  diorama são camadas narrativa/visual — nenhuma regra nova de veredicto.
- Determinismo total: toda seleção nova por `hashString` salgado; guarda do `qa.mjs`.
- Contrato do `qa-ui.mjs` (rótulos clicáveis, `.termo-clicavel`, `data-overlay`,
  ordem dos selects) intocável sem atualizar o QA no mesmo commit.
- Prosa nova só entra por `redigir-prosa` + `revisar-prosa` com zero bloqueantes.
- Nenhuma etapa vira código sem ordem expressa do criador para AQUELA etapa.
