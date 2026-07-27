# OS-S2 — Prompt de arranque para a sessão seguinte

Escrito no fecho da sessão de triagem do playtest cego de 27/07/2026, contra a árvore
real. Copiar o bloco do §1 como primeira mensagem da sessão nova.

Esta sessão **não implementou nada** das três frentes abaixo, por ordem expressa do
usuário: consertou os sete itens do playtest que eram defeito, fechou o pipeline de prosa
e mediu o que faltava medir. As três frentes ficam **engatilhadas e já medidas** — o §2
traz, para cada uma, o número que esta sessão apurou, para que a sessão nova não
reinvestigue o que já foi contado.

**Duas das três não se executam sem decisão do usuário**, e o prompt diz onde parar e
perguntar. Só a Frente C é executável de arranque.

---

## 1. O prompt

> Executar a **OS-S2 — O mundo que não responde** no repositório MORTEM, do arranque ao
> fecho com ata. Nasce da triagem do playtest cego de 27/07/2026 e das pendências da
> OS-S1. **Confirmar que o ramo `claude/playtest-resultado-mhwm5a` está integrado antes de
> abrir ramo novo** — a triagem e as medidas vivem nele.
>
> **Antes de tocar em qualquer ficheiro, ler nesta ordem:**
> 1. `CLAUDE.md` — regras invioláveis. Aqui pesam **não criar features sem ordem
>    expressa**, **divergência KB × motor é decisão do usuário, não do agente**, e o
>    contrato intocável com o `qa-ui.mjs`.
> 2. `docs/pendencias-status.md`, secções **«Triagem do playtest cego de 27/07/2026»**,
>    **«Verificação das pendências da OS-S1»** e **«O que o pipeline `revisar-prosa` achou
>    e ficou por fazer»** — é lá que estão os cinco itens registados (P-1 a P-5) e as
>    medidas que fundam esta OS.
> 3. `docs/playtest/2026-07-27-playtest-cego.md` — o relatório integral. Ler **o item 7**
>    com atenção: ele é a Frente A vista de fora, pelos olhos de quem não sabia o que
>    estava a ver.
> 4. A ata da **OS-S1** em `docs/historico-decisoes.md` (26/07/2026) — as três
>    interferências, as Regras de Justiça que as governam e a disciplina do anúncio.
> 5. `docs/game-design-simulacao.md` §5 — as Regras R1–R6. A **R3** é a regra que esta OS
>    põe à prova: *a autoria tem de ser reconstruível de trás para frente.*
> 6. `docs/guia-de-estilo.md` e `docs/biblia-de-vozes.md` — se a Frente A gerar prosa.
>
> ---
>
> ### FRENTE A — as interferências que não se leem *(PARAR E PROPOR ANTES DE CONSTRUIR)*
>
> **O diagnóstico já está fechado e não precisa de ser refeito.** O playtest de 27/07
> respondeu à quarta pendência da OS-S1 sem saber que a respondia: o item 7 do relatório
> («fio solto: o esconderijo da torre») descreve «chapa presa para trás, vazio limpo, sebo
> na trava» — palavra por palavra o `carimboPadrao` de `ev_esconderijo_vazio`, carta que
> **só existe depois de `corrida_a_torre` disparar**. O jogador pôs um papel diante de
> Silas, Silas correu à torre, o jogador subiu depois e achou o vão limpo. E arquivou-o
> como «a única promessa que o caso faz e não paga».
>
> O mecanismo funcionou inteiro. Falhou a leitura, por três causas **já localizadas no
> código**:
>
> 1. `dispararInterferencias` (`src/store/jogo.js:669`) escreve o `anuncio` em `s.log`, e
>    o `log` só se lê no «Diário da investigação» — última secção da `Caderneta.jsx`, em
>    `text-sm text-stone-300`, misturado com um `Registrado: …` por carta extraída (~50
>    linhas numa partida). **Os dois usos de `log` na prancha da vila são
>    `horaDoAcrescimo`: nada do anúncio chega ao mapa ou à cena.**
> 2. Os `blocosContingentes` do posto e da torre trocam a prosa quando o evento dispara —
>    e estão bem desenhados: nunca sobra termo clicável para carta que já não se colhe.
>    Mas **quem visita o lugar uma só vez lê apenas o estado final** e nunca soube que
>    houve um anterior.
> 3. A ponte causal **existe e chega tarde demais**: `ECOS_INTERFERENCIA_TUTORIAL` tem a
>    frase que fecharia a leitura — «A retratação veio depois da minha volta ao correio, e
>    não antes» —, mas `derivarEcosInterferencia` só corre dentro de `submeterAcusacao`, e
>    o eco cai na Caderneta **depois de a partida acabar**, num painel que ninguém reabre.
>
> **O que não se faz:** nomear ninguém. A OS-S1 escolheu deliberadamente que o anúncio
> regista EFEITOS e que a autoria é leitura do jogador. Essa disciplina fica.
>
> **A hipótese de trabalho** (do fecho da sessão de 27/07, e é hipótese, não ordem): cada
> gatilho já carrega um campo `comoSoube` que diz **como a notícia andou** — «o papel
> pousado na saleta diz ao interrogado exatamente até onde a perícia já chegou». Esse
> campo é a ponte, ele não nomeia ninguém, e hoje **não chega ao jogador em momento
> nenhum**. Trazer o anúncio + `comoSoube` para o instante do disparo é a mudança mínima
> que transforma «que estranho, o esconderijo estava vazio» em «eu mostrei o papel e ele
> correu».
>
> **PARAR AQUI.** Antes de escrever uma linha: apresentar ao usuário a proposta de COMO o
> sinal aparece (momento, forma, dosagem), com o texto exato que o jogador leria, e
> esperar decisão. Mexe na dosagem que a OS-S1 martelou; não é conserto de defeito, é
> escolha de desenho.
>
> ---
>
> ### FRENTE B — o carimbo que mente ao metódico *(DECISÃO DO USUÁRIO)*
>
> `ev_rigor` (`src/data/cartas.js:30`) tem `carimboPadrao: 'Rígido por inteiro;
> extremidades começando a ceder'`. É o carimbo que viaja para a Caderneta e para o mural.
> O verbete do glossário (`src/data/glossario.js:25`) mapeia «a dureza já começa a ceder»
> à faixa de **24–36 h**; a carta está na de **12–24 h** (IPM real 16 h).
>
> **Quem cruza o carimbo com o verbete — que é o gesto que o jogo ensina a fazer —
> desloca o corpo uma faixa inteira.** Não quebra a solubilidade: as âncoras duráveis
> (20 h piso por `dep_visto_vivo`, 23 h teto por `ev_relogio_bolso`) resolvem sozinhas. Mas
> é o pior desenho possível de um erro — só machuca quem joga certo.
>
> A `descricao` da carta distingue bem os dois estados («cede **um ponto sob pressão
> firme**» ≠ «o maxilar **dobra**»); é só o **carimbo** que aplana a distinção.
>
> **PARAR E PERGUNTAR.** Por regra do `CLAUDE.md`, divergência KB × motor é decisão do
> usuário. Apresentar as saídas possíveis (reescrever o carimbo para não colidir com a
> formulação do verbete; ou ajustar o verbete; ou deixar como está e assumir a armadilha)
> com o custo de cada uma, e esperar.
>
> **Mais duas derivas da KB**, apuradas na mesma passada e igualmente decisão do usuário —
> nenhuma introduzida nesta sessão, ambas são a KB a envelhecer em relação ao código:
> o exemplo trabalhado de algor em `kb-medicina-legal/tanatologia.md` §1 usa morte às 22 h
> e IPM 13 h, contra as **21 h e IPM 16 h** do `seed.js`; e a mesma KB §4 atribui o teto de
> 23 h da janela durável ao **livor fixo**, quando hoje ele vem da **rotina interrompida**
> do relógio de bolso (`horaRotina: -1`).
>
> ---
>
> ### FRENTE C — o mundo que não reconhece o gesto *(EXECUTÁVEL DE ARRANQUE)*
>
> Esta é a única das três que já tem ordem e não pede decisão nova. São dois itens da
> mesma família, e a família é o **item 4 do playtest**: *o mundo não reconhece o que o
> perito acabou de fazer.*
>
> **C-1 · Os dois gestos que sobraram.** O conserto de 27/07 deu estado ao gesto do livor
> (campo `semCartas`, espelho de `requerCartas`, lido em `EventoLocalidade.jsx:136`). O
> sub-local `corpo` tem **três** gestos (`localidades.js:43-48`); os outros dois continuam
> sem. A prosa-base diz «pende um relógio de bolso **de tampa fechada, mudo**» e «o
> termômetro fica à mão, **se … julgar oportuno** medir» — e as duas frases ficam falsas
> depois de dar corda (a `descricao` de `ev_relogio_bolso` diz «**aberta a tampa**… o tique
> retoma») e depois de medir. **A máquina já existe; o conserto é de dados:**
> `semCartas: ['ev_relogio_bolso']` e `semCartas: ['ev_algor']`, com o par contingente de
> cada um. Não inventar prosa nova sem passar pelo `redigir-prosa`.
>
> **C-2 · A cela desenha-se como gabinete.** `tipoCenaDe('cela', 'posto')`
> (`src/components/FundoCena.jsx:30-37`) cai no default `'gabinete'` — estante de
> livros-razão e escrivaninha —, contra a prosa de `localidades.js:288`: «um cubículo de
> porta gradeada: enxerga, balde, e uma tábua de tarimba». **Pré-existente** (com
> `grupo: 'vila'` caía no mesmo default), mas o grupo `posto` criado em 27/07 torna a
> correção de **uma linha** possível: `if (grupo === 'posto') return 'delegacia';` antes do
> `:36`. Camada de apresentação; nenhuma regra a lê. Conferir que `'delegacia'` existe como
> tipo de cena antes de a usar.
>
> ---
>
> ### O que NÃO entra nesta OS
>
> - **Os anéis do Ato I e do Ato II** (PD-07 por inteiro). Continuam abertos e intactos.
>   Custo alto — reescreve o gate de QA da interface e transforma a topologia do caso —, e
>   **o playtest não deu sinal de que o mapa aberto atrapalhe**: o jogador visitou os nove
>   lugares e gostou da liberdade. Mudança grande sem evidência de necessidade.
> - **O relógio que nunca aperta** (item 6 do playtest). O prazo do inquérito é ficção
>   declarada em `abertura.js` («nenhuma regra o lê, nenhum desfecho muda por ele») e o
>   jogador leu certo. Mas **rodar antes o playtest do mural a 51 cartas** (ver §2): se a
>   partida completa já for longa e pesada a 51, apertar o relógio é outra conversa.
> - **A OS «Reação Vital Condicionante»**, ainda ausente do repositório. A proposta da
>   OS-S1 declarou-a «recomendada, não bloqueante», e nada desde então pediu por ela.
>
> ---
>
> ### Gate e fecho
>
> ```bash
> npm run verificar        # a bateria inteira: build + qa.mjs + lint:prosa + qa-ui.mjs
> ```
>
> Toda prosa nova passa pelo pipeline **`revisar-prosa`** com zero bloqueantes antes do
> commit — regra dura do `CLAUDE.md`. **Rodar os três revisores em primeiro plano**; na
> sessão de 27/07 a primeira passada em segundo plano perdeu-se sem retornar e teve de ser
> repetida.
>
> **Ramo próprio a partir do ramo designado da sessão.** Ata em `docs/historico-decisoes.md`
> e `docs/plano-de-sessoes.md` atualizado no commit final. Se houver pedido de PR,
> `MORTEM_CONTEXTO.md` e `README.md` entram no mesmo commit final (ordem permanente do
> usuário, 22/07/2026).

---

## 2. Estado do repositório no fecho da sessão de 27/07/2026

| | |
|---|---|
| Ramo entregue | `claude/playtest-resultado-mhwm5a` (4 commits) |
| Base | `965f128` (merge da PR #103, fecho da OS-S1) |
| Gate | `npm run verificar` — a bateria inteira, verde |
| `qa.mjs` | **CASO VÁLIDO**, **150 checagens**, **35 guardas numeradas** |
| Cartas do caso-escola | **50**; teto do `qa.mjs` a **51** (as 50 + `ev_algor`) |
| Nós do mapa | 9 · 7 abertos de início · 2 fechados (`cela`, `gabinete_pettigrew`), ambos com lead |
| Grupos do mapa | 4 (`relojoaria`, `posto` ← **novo**, `vila`, `fora`); matriz de 16 pares, completa e simétrica |
| Pipeline de prosa | 3 passadas, **zero bloqueantes remanescentes** |

### O que esta sessão entregou

Os sete itens do playtest cego de 27/07 triados; **cinco consertados**. O achado central:
as cartas que nascem dentro de diálogo perdiam-se em silêncio ao descer a árvore — **13
das 50 cartas do caso**, os seis paradeiros declarados entre elas —, o que tornava o
Painel de Álibis inerte e o juízo «Inocente» sobre os inocentes-com-segredo
**infazível por consequência**. Mais a conferência das quatro pendências da OS-S1 e o
fecho do pipeline `revisar-prosa`.

### Medidas já feitas — não repetir

| O que se mediu | Número |
|---|---|
| Cartas que nascem dentro de diálogo | **13** de 50 (todos os 6 paradeiros entre elas) |
| Mesa do jogador no playtest | **34** de 51 — 13 das 17 que faltaram eram as de diálogo |
| Confrontos que a trava do item 2 alcança | **6**, em 4 suspeitos; sobram 4 livres em Silas e 2 em Herrick |
| Opções de diálogo com `requerCarta` | **0** no caso-escola, **0** nas 155 árvores dos 31 gerados |
| `[[id]]` em `alfinetada`/`degraus` | **0** no tutorial e nos 31 gerados |
| Marcadores do caso-escola | 82 ocorrências sobre 46 ids (33 em localidade + 49 em diálogo) + 4 só por gesto |
| Células da matriz de custos alteradas | **1** — `cela ↔ posto_do_guarda`, de 1 h para 0 h |
| Provas que apontam Walter × Silas | **5 × 7** (o relatório diz «mais que o culpado»: verdadeiro da mesa daquele jogador, falso do catálogo) |

### Pendências da OS-S1, conferidas contra o código em 27/07

- **Anéis do Ato I e II** — 🔓 abertos, intactos. Só `cela` e `gabinete_pettigrew` nascem
  fechados; o conserto do item 5 tocou `mapa.js` mas **só o `grupo` da cela**.
- **OS «Reação Vital Condicionante»** — 🔓 ausente do repositório.
- **Playtest do mural a 51 cartas** — 🚫 **estava BLOQUEADO, e agora não está.** Não era
  «por fazer»: era infazível, porque 13 cartas se apagavam. **É o primeiro pedido de
  playtest da rodada seguinte**, e agora com sentido — medir se a Estação II satura com o
  dossiê inteiro na mesa.
- **As três interferências leem-se como autoria?** — ✅ **respondido: NÃO.** É a Frente A.

### Aberto, e por onde

- **OS-S2** (esta): Frentes A, B e C.
- **Playtest do usuário:** o mural a 51 cartas.
- **OS própria, sem data:** os anéis do Ato I e do Ato II.
- **Sem dono:** a OS «Reação Vital Condicionante».
