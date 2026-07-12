# Desenvolvimento solo com agentes de IA — como projetos terminam (e por que não terminam)

> Por que jogos de desenvolvedor solitário morrem antes do lançamento, o que os
> postmortems de quem terminou ensinam sobre cortar, e como um **não-programador** conduz
> agentes de código sem se perder. Fontes: postmortems GDC/Game Developer, dados de
> vendas (Gamalytic, VG Insights, howtomarketagame) e literatura de IA-dev 2024–2026.

A regra soberana da produção solo: **um jogo lançado e imperfeito vale mais do que dez
perfeitos e inacabados.** Tudo abaixo é comentário a essa regra.

## 1. Por que solo devs não terminam

- **Scope creep.** Não é evento — é erosão: adições "inofensivas" acumuladas até o
  projeto virar inadministrável (caso documentado: 9 meses planejados, 27 gastos). O
  inimigo é a **ausência de fronteira definida**; o antídoto clássico, fixar a data e
  cortar o projeto para caber nela — nunca o contrário.
- **O "segundo sistema" e o perfeccionismo de engenharia.** Fred Brooks (1975): o sucesso
  de um sistema pequeno gera confiança para um segundo, inchado, que atrasa ou falha. Na
  versão solo: refatorar sem fim, reescrever o motor — perfeccionismo como adiamento de
  lançar. Sinal de alerta: "quando eu terminar a reescrita..." repetido por meses.
- **A regra 90–90** (Tom Cargill, Bell Labs): os primeiros 90% do código consomem 90% do
  tempo; os 10% restantes, os outros 90%. Polimento, casos de borda e bugs custam tanto
  quanto tudo o que veio antes — projetos morrem no "quase pronto" não orçado.
- **Burnout.** Correlaciona com escopo indefinido (grind sem fim à vista), projetos feitos
  "pelo desafio" e não por paixão pelo gênero, e comparação com devlogs alheios.
  Mitigação documentada: fim visível, incrementos celebráveis.

## 2. Os que terminaram: o que os postmortems dizem sobre cortar

- **Papers, Please (Lucas Pope, 2013)** — 9 meses, design-first. Pope cortou uma feature
  já implementada (confiscar e vender fotos) porque **desvalorizava um momento dramático
  do final** — corte por design, não por prazo. 1,8 mi de cópias em 3 anos; 5 mi em 10.
- **A Short Hike (Adam Robinson-Yu, 2019)** — o dev **engavetou o projeto grande** para
  fazer um jogo minúsculo em ~4 meses com prazo fixo; o postmortem GDC trata escopo
  pequeno como escolha estética, não derrota. Virou o sucesso da carreira dele.
- **Stardew Valley (Eric Barone, 2016)** — o contraexemplo que confirma: 4,5 anos, 10–12 h
  por dia, 7 dias por semana, escopo crescente; terminou por teimosia extraordinária e
  rede de apoio (Barone descreve ter odiado o jogo em fases). Não é modelo replicável.
- **Return of the Obra Dinn (Pope, 2018)** — 4,5 anos para **um único caso grande**: a
  demo com 4 personagens já estourava o pipeline; escalar para 60 custou quase um ano de
  ferramentas. O anúncio resume o critério de pronto: *"finally **done enough** to call"*.

Padrão comum: quem termina trata **corte como ferramenta de design**; quem não termina
trata cada corte como dívida a repor depois.

## 3. Definição de pronto: vertical slice e conteúdo mínimo shipável

- **Vertical slice**: trecho pequeno e completo do jogo com todos os sistemas principais
  em qualidade final (gameplay + arte + som + UI); prova que a direção merece o resto do
  investimento antes de escalar produção.
- **Quantos casos é um jogo lançável?** Precedentes: *Obra Dinn* lançou com **1 caso
  grande** (60 destinos entrelaçados, US$ 19,99, >1 mi de cópias); *Golden Idol* lançou
  com **12 cenários curtos** e depois vendeu DLCs de **3 casos** cada como produto
  autônomo; *Papers, Please* é 1 mecânica e 31 dias de campanha. O espectro real vai de
  1 caso profundo a ~12 curtos — ninguém esperou "temporada completa"; lançar pequeno e
  expandir é praticado e lucrativo no gênero.
- Definição operacional de pronto: escrever ANTES a lista do que a versão 1.0 contém
  (nº de casos, desfechos, telas) e do que fica de fora. Mudar a lista é decisão
  consciente, não deriva.

## 4. Desenvolvimento com agentes de IA sendo não-programador

A literatura 2025–2026 convergiu de "vibe coding" (Karpathy, fev/2025) para
**spec-driven development**: a spec escrita e versionada — não o código — é a fonte de
verdade; o agente deriva dela tarefas pequenas, testáveis, validadas uma a uma
(Thoughtworks, GitHub Spec Kit, Osmani). Práticas com melhor suporte para o
não-programador: **(1)** spec antes de código, em comportamento observável; **(2)** testes
automatizados que o não-dev PODE ler (não o diff, mas "perfil Apressado → Erro
Judiciário: OK"); **(3)** revisão por comportamento no navegador, nunca por leitura de
código; **(4)** normas no repositório — conhecimento em prompts se perde.

| Risco | Sinal de alerta | Mitigação |
|---|---|---|
| Código que "parece funcionar" (compila, passa teste raso, falha em borda) | Feature aceita sem ser exercitada de ponta a ponta | Testar o comportamento no navegador antes de aceitar; QA que percorre rotas completas |
| Regressão silenciosa (mudança em A quebra B) | "Só mexi na prosa, não precisa testar" | Suíte de regressão em TODO commit; separação de camadas que impede prosa de tocar lógica |
| Deriva da intenção (agente resolve o problema errado com convicção) | Diff enorme para pedido pequeno; "melhorias" não pedidas | Spec explícita do que NÃO deve mudar; proibição de features sem ordem expressa |
| Dependência de um único agente/modelo | Ninguém além do agente "entende" o sistema | Normas no repo (não no chat); arquitetura simples e determinística retomável por outro agente ou humano |
| Custo/token sem controle | Sessões longas de exploração sem incremento jogável | Iterações curtas com entregável definido; design fechado antes do build |
| Erosão das guardas (o agente edita a regra que o limitava) | Diff toca arquivos normativos ou de QA junto com a feature | Tratar normas e QA como intocáveis salvo ordem explícita; revisar qualquer diff que os toque |

## 5. Cadência, playtest e motivação

- **Iteração jogável curta**: cada ciclo termina em algo executável no navegador —
  antídoto simultâneo de burnout (progresso visível) e de regressão.
- **Playtest com estranhos, sem audiência**: recrutar em comunidades do GÊNERO
  (r/playtesting, Discords de Obra Dinn/Golden Idol/"thinky games", itch.io), oferecendo
  algo em troca (dinheiro/vale enviesa menos). Num jogo de dedução, estranhos são
  insubstituíveis: só eles medem se o caso é resolúvel sem o conhecimento do autor.
- **Devlog como disciplina**: registro público (itch.io, YouTube, Reddit) cria audiência
  e commit psicológico (caso citado: devlog desde o dia 1 → 4.000 wishlists no anúncio).
- **Quando mostrar**: anunciar 6–12 meses antes do lançamento, mas **nunca antes de
  existir página com botão de wishlist ativa** (consenso howtomarketagame e afins).

## 6. Lançamento mínimo: itch.io vs Steam e expectativas realistas

- **itch.io**: custo zero, corte configurável, publicação imediata, audiência pequena que
  busca o experimental — ideal para demo, playtest público e devlog. **Steam**: US$ 100
  por app (Steam Direct; recuperável após US$ 1.000 de receita ajustada) + papelada
  fiscal (W-8BEN para brasileiro) + corte de 30% — é onde está o comprador: wishlists são
  o maior motor de vendas, e ~5.000–10.000 é o patamar citado para visibilidade
  algorítmica. Estratégia praticada: playtest no itch durante a produção; lançamento
  comercial na Steam (e no itch no mesmo dia).
- **Números realistas**: o jogo indie mediano na Steam fatura **US$ 5.000–15.000 brutos
  na vida toda**; metade fatura menos, muitos quase nada. Os sucessos do gênero (Obra
  Dinn >US$ 13 mi; Golden Idol ~US$ 2,5 mi na Steam) são cauda direita, não expectativa.
  Dedução é nicho fiel, com boca-a-boca forte e pouca concorrência direta — mas planejar
  pelo mediano.

## 7. O gargalo dos jogos de caso: conteúdo, não código

No gênero, o motor é construído uma vez; cada caso é **autoria artesanal**: a Color Gray
levava **1–2 meses por cenário** do Golden Idol — com sistema pronto e equipe crescendo.
Consequências: (a) o custo marginal de um caso NÃO cai a zero depois do motor — escrita,
calibração de dificuldade e playtest dominam; (b) caso novo deve **reusar** sistemas,
nunca exigir sistema novo (senão cada caso paga imposto de motor); (c) validar
solvabilidade com estranhos é parte do custo do caso; (d) o primeiro caso feito DEPOIS
do motor é a medida honesta do custo dos seguintes.

---

## Implicações para o jogo

**O que o repositório já pratica e a literatura confirma** (não mexer — está certo):
design-doc como fonte de verdade (`MORTEM_CONTEXTO.md`) é spec-driven development avant
la lettre; `qa.mjs` (4 perfis → 4 desfechos) e `qa-ui.mjs` (rotas no navegador) são a
rede de segurança legível pelo não-dev e a revisão por comportamento; "design antes de
build", "não criar features sem ordem expressa" e "cada iteração é um incremento
jogável" atacam scope creep, deriva de agente e burnout; camada narrativa ≠ camada
lógica barateia casos futuros; o determinismo sem rede torna o projeto retomável.

**Riscos que restam:** (1) não existe definição escrita de "MORTEM 1.0" — quantos casos,
o que fica de fora — logo o scope creep segue possível por omissão; (2) o jogo nunca foi
testado por estranhos, e solvabilidade percebida só se mede assim; (3) o custo real por
caso é desconhecido até existir o caso 2 (o tutorial não conta: foi feito junto com o
motor); (4) não há página pública/devlog — o relógio de wishlists nem começou; (5) as
normas e o QA são a única guarda contra deriva: diff que os toque exige olho do criador.

**Cardápio de critérios de "pronto para lançar"** (decisão do criador):
- **Opção A — Obra Dinn:** 1 caso profundo e polido (o tutorial promovido a jogo), grátis
  ou barato no itch.io, como teste de mercado e recrutador de playtesters.
- **Opção B — Golden Idol mínimo:** 3–5 casos curtos + tutorial, lançamento comercial
  (itch.io e/ou Steam), casos extras como atualização/DLC se houver tração.
- **Opção C — temporada:** 8–12 casos com arco; só orçável depois de medir o custo do
  caso 2 (regra 90–90: dobrar a estimativa).
- Gates em qualquer opção: build limpo + QA verde; N estranhos terminam o caso sem ajuda;
  prosa aprovada no `revisar-prosa`; página com wishlist no ar antes do anúncio; lista
  escrita do que ficou FORA da versão 1.0.

## Fontes consultadas

- Jon Bentley/Tom Cargill — "Ninety–ninety rule" (1985) — https://en.wikipedia.org/wiki/Ninety%E2%80%93ninety_rule · Fred Brooks — "Second-system effect" (1975) — https://en.wikipedia.org/wiki/Second-system_effect
- Wayline — "Scope Creep: The Silent Killer of Solo Indie Game Development" (2024) — https://www.wayline.io/blog/scope-creep-solo-indie-game-development · Game Developer — "The Last Humble Bee postmortem: Staying sane in solo development" — https://www.gamedeveloper.com/business/the-last-humble-bee-postmortem-staying-sane-in-solo-development
- Game Developer — "How Stardew Valley creator Eric Barone coped with a four year dev cycle" (2016) — https://www.gamedeveloper.com/production/how-i-stardew-valley-i-creator-eric-barone-coped-with-a-four-year-dev-cycle
- Game Developer — "Road to the IGF: Lucas Pope's Papers, Please" (2014) — https://www.gamedeveloper.com/design/road-to-the-igf-lucas-pope-s-i-papers-please-i- · "For Lucas Pope, Return of the Obra Dinn was a bunch of appealing design problems" (2019) — https://www.gamedeveloper.com/design/for-lucas-pope-i-return-of-the-obra-dinn-i-was-a-bunch-of-appealing-design-problems · anúncio "done enough to call" (2018) — https://x.com/dukope/status/1050076169800839169
- Adam Robinson-Yu — "Crafting A Tiny Open World: A Short Hike Postmortem", GDC (2020) — https://gdcvault.com/play/1026613/Independent-Games-Summit-Crafting-A
- Thinky Games — "How The Case of the Golden Idol developers made one of the decade's best detective games, twice" (2024) — https://thinkygames.com/features/how-the-case-of-the-golden-idol-developers-made-one-of-the-decades-best-detective-games-twice/ · Wikipedia — "The Case of the Golden Idol" — https://en.wikipedia.org/wiki/The_Case_of_the_Golden_Idol
- Thoughtworks — "Spec-driven development: unpacking one of 2025's key new AI-assisted engineering practices" (2025) — https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices · Addy Osmani — "How to write a good spec for AI agents" (2025) — https://addyosmani.com/blog/good-spec/ · Kaspersky / Iterasec — riscos de "vibe coding" em produção (2025) — https://www.kaspersky.com/blog/vibe-coding-2025-risks/54584/
- howtomarketagame (Chris Zukowski) — "Benchmark: Itch.io traffic" e "Can itch.io success translate to Steam success?" (2025) — https://howtomarketagame.com/2025/05/12/benchmark-itch-io-traffic/ · Valve — "Steam Direct Fee" — https://partner.steamgames.com/doc/gettingstarted/appfee
- Steam Page Analyzer — "Indie Game Revenue Statistics" (mediana US$ 5–15 mil brutos) — https://www.steampageanalyzer.com/blog/indie-game-revenue-data · Gamalytic / VG Insights — vendas: Obra Dinn e Golden Idol — https://vginsights.com/game/return-of-the-obra-dinn
- Games User Research — "A simple process to find playtesters" — https://gamesuserresearch.com/a-simple-process-to-find-playtesters/ · presskit.gg — "How to Announce Your Indie Game" — https://presskit.gg/field-guides/how-to-announce-indie-game
