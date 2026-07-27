# MORTEM — Histórico de Decisões (arquivo)

> Arqueologia do design: como o jogo chegou ao estado descrito em `MORTEM_CONTEXTO.md`.
> **Nada aqui é normativo** — se este arquivo contradisser o contexto, vale o contexto.
> Serve para entender POR QUE as coisas são como são antes de propor mudá-las.

## Linha do tempo dos redesigns

| Época | Decisão |
|---|---|
| — | Carimbo integrado à extração: clique no negrito registra a carta direto; `ModalCarimbo` extinto |
| — | Localidades são cartas na mesa; eventos são overlays; nunca troca de tela |
| Playtest 5 | **5 gavetas → 3**: Dinâmica absorvida pela Aitiov; gaveta Confronto extinta |
| Playtest 6 | **Zero indicadores de acerto** (✓/✗) durante a investigação; verdade só no desfecho |
| Playtest 6 | **Painel de Álibis** ("Declarações de Paradeiro") substitui o confronto automático — consulta neutra, cruzamento é raciocínio do jogador |
| Playtest 6 | **Libelo como formulário narrativo** no Quadro de Revelações, gerando monólogo por templates universais |
| jun/2026 | **Gramática de dedução universal**: o caso vira só Verdade de Ouro + pistas; o motor ganha catálogo universal de causas e modelo forense de tempo. Gavetas viram livro-caixa; fim das listas de alternativas por caso |
| jun/2026 (Redesign do Core Loop, ex-§1.1) | Relógio MOLE no mapa (tempo só na viagem; perecível perde precisão, durável sempre resolve); gavetas Cronos/Aitiov/Nexo **removidas** — o legista fala quando/como, o jogador crava nexo+mentira no **Confronto**; carta mostra observação crua; mapa cresce por leads |
| jun/2026 (Construção da Acusação, ex-§1.2) | O ato final deixa de ser formulário+tribunal e vira o **mural com barbante**: o jogador AFIRMA a cadeia (quem/quando/como/motivo/juízos) e a sustenta LIGANDO cartas. O legista vira **dica**; o desfecho vira o **Monólogo do Detetive**; `calcularVeredictoCadeia` lê a cadeia construída. Removidos: `QuadroRevelacoes`, `Confronto.jsx`, `confronto.js`, a antiga `calcularVeredicto` |
| jul/2026 (Overhaul da Redação) | Infraestrutura de redação (guia de estilo, bíblia de vozes, KB de medicina legal, skills/agentes revisores) e reescrita integral da prosa do slice: observação pura, vozes diferenciadas, brilho racionado, correções de continuidade (13/out/1893 = sexta; Moorford = 3h) |
| jul/2026 (Reescrita do caso) | **"O Álibi de Corda" → "A Hora Emprestada"**: mesma vítima e cenário, verdade de ouro nova. 3 → **5 suspeitos**, 1 → **3 mentirosos inocentes** (segredos de naturezas distintas: humilhação, decoro, medo), e o relógio quebrado deixa de ser isca passiva para virar **pivô estrutural** com três leituras (mostrador forjado / roda de contagem / relógio de bolso de corda esgotada). Motor ganhou duas travas temporais universais (`rotina_interrompida`, `registro_mecanico`); veredicto/acusação intocados. Removida a perita Lenore (fica só o Dr. Harlan Blackwell). Fecha as pendências 1, 2, 3 e 5 do overhaul de 12/07 (despiste com explicação plantada; ≥2 mentirosos; motivo composto arquivado — `silenciamento` é composto por natureza, único por id; `reacao_vital` em jogo) |
| jul/2026 (Fundações do gerador procedural, FASE 0) | Registro normativo das decisões de arquitetura do gerador: **pacote de caso** serializável, **asset 2D sob contrato**, **retratos em camadas**, **resource binding** por slots tipados, **papéis dramáticos** gerador-facing e **eco do mestre** sobre falhas (detalhe abaixo). Só documentos; nenhum código. |
| jul/2026 (Gerador por simulação e interferência, FASE 0) | Registro normativo do overhaul do gerador: o crime é **simulado na geração** por um **autobattler de build time** (`resolverCrime` → `RegistroDoCrime`), atributos sob **regra de existência** (FOR/INT/WIS/CHA; só existe o que deixa vestígio ou comportamento), **arquétipos × demografia 1893**, geração espacial cidade-primeiro com **grafo de avistamentos**, e **interferência** como evento contingente sob as **Regras de Justiça R1–R6**. Inclui a reconciliação com a rejeição anterior do grid espacial (detalhe abaixo). Só documentos; nenhum código. |
| 19/jul/2026 (S1 Ramo A — Fase 1: gatilho de complexo no diálogo) | Decisões do usuário: tento discreto; **nó de confronto sem carta** para o gatilho; ordem §6. O `gatilho_de_complexo:<tema>` (compilado pelo gerador e sem boca) ganhou realização: mapa `GATILHO_POR_TEMA` (13 temas — a pergunta que desmonta a compostura + a reação que vaza a BIOGRAFIA do medo central, **jamais** janela/causa/nexo), lido de `bruto.psique.consequencias.porPessoa`. **Anti-tell — portão dos ≥2:** o gatilho só se realiza quando há ≥2 interrogáveis com gatilho no caso (senão o réu seria o único a "perder a linha" — os ~20% medidos na Fase 0); fiscalizado no `qa.mjs` (por caso: 0 ou ≥2, nunca 1). **Nota de escopo honesta:** o "nó sem carta" **não é pura camada narrativa** — o runtime/QA exigem carta em todo confronto, então a Fase 1 adiciona uma **caixa de apresentação nova** (`InterrogatorioDialogo.jsx`), além do gerador e do QA; **o motor segue intocado** (transitório, nunca persiste, nunca vira carta). Pipeline `revisar-prosa`: **perito** sem bloqueantes (workhouse/enterro de indigente/penny→moeda/confissão neutra de denominação); **fiscal** 1 bloqueante de concordância de gênero ("desde menino" numa lavadeira) → corrigido com ramos `fem` em todos os temas gendrados; **editor** aprovado com reescritas obrigatórias (voz uniforme, máquina de máximas, narrador adjudicando intenção, psicologismo moderno) → todas aplicadas, reconfirmado zero bloqueantes. `qa`/`qa-ui`/`lint`/build verdes; 21 casos re-gerados. |
| 19/jul/2026 (S1 Ramo A — flags psíquicas no diálogo: OS + Fase 0) | Continua de onde a PR #73 parou. OS `os-flags-psiquicas-no-dialogo.md`: o derivador de diálogo passará a **ler as flags psíquicas** que o gerador já compila (`bruto.psique.consequencias.porPessoa[id].flags`) e que **nenhuma boca lê** hoje. Camada narrativa pura (motor cego). **Fase 0 (telemetria, risco zero, sem tocar o gerador)** no `qa.mjs`: no lote de 200, o gerador compila **1661 flags em 1422 pessoas, 0 lidas** pelo diálogo; a paridade do tell calmo já vem saudável (**77% dos mentirosos-calmos são inocentes**, piso G5 = 60%); o `gatilho_de_complexo` está no réu em **200/200** mas só **161/200** têm gatilho inocente — em ~20% o réu é o único, achado que a Fase 1 tem de tratar (realizar o gatilho só quando há ≥2, para não virar tell). **Realização em prosa (Fases 1–3) aguarda as decisões §8** (dose, boca do gatilho, ordem) — regra `CLAUDE.md`: dosagem de fair play é do usuário. `CASO VÁLIDO`, build limpo, sem regeneração (Fase 0 não muda byte de pacote). |
| 19/jul/2026 (S2 — decisões de fair play) | Sessão de DECISÕES (sem código; OS `os-fair-play-s2.md`). **Caso-escola:** vidro de Silas com peso espalhado entre 2–3 provas; mural com **rótulo neutro** ("depoimento") no lugar de "mentira"; **móbil por suspeito** com isca. **Gerador:** âncora de autoria **híbrida** (dupla independente onde a magnitude permite, contra-hipótese jogável nos demais); canal de compleição **adiado**; **cardápio amplo** de fôrmas de mentira, com o culpado podendo partilhar fôrma de inocente. **Diálogo (executa na S1):** paradeiro universal perguntado, confronto com ganho em **todos** os confrontos, exposição contida no negrito; deflexão "veio de fora" barrada ao culpado, **permitida como preconceito de inocente** (retratável). **Espacial:** planta única navegável no caso-escola **e** na cena procedural, suspeitos saem de cena após o cerco, transcrição da carta amassada. Detalhe abaixo. |
| 18/jul/2026 (Playtest independente — contratos P1) | **`ev_vidro_dobra` democratizada (Opção A)**: a lasca na bainha de Silas sai nos QUATRO tons do beat 1, com prosa distinta por tom — o tom segue **cor, nunca chave** (o contrato "nenhuma prova que o veredicto lê depende do tom" volta a valer sem exceção; `CARTAS_PRECISAO` esvazia no `qa.mjs` e a guarda de sustentação vira estrita). **Feedback das automações silenciosas**: a ligação automática das cartas do corpo às âncoras ganha o micro-rótulo "o corpo declara" na Estação I; o confronto em cena que anota `refuta_alibi` ao mural ganha aviso no rodapé (padrão do `AvisoCartaPousada`). Detalhe abaixo. |
| 17/jul/2026 (Reconciliação encenação→motor, Lotes 1 e 3) | Da pesquisa de encenação/supressão ao motor: **Lote 1** (zero `src/logic`) — 6 verbetes de glossário (guaiaco/Van Deen, Teichmann, Sorby, micrometria de Gulliver, epitélio no coágulo, discórdia tanatológica), `instrumento_guardado_umido` corrigido para o **coágulo durável sob o rebite** (a umidade era o sinal perecível), e a carta condicional `gen_frestas` (o sangue que a esfrega empurra para a fresta). **Lote 3** — a **fraude de tempo pelo corpo**: `cartaHoraForjada` ganha duas variantes térmicas (corpo aquecido junto à lareira / resfriado na corrente), a hora aparente do corpo refutável pelos relógios duráveis, como o mostrador forjado do caso-escola. **§5 decidido (b), não executado**: o sinal de ausência do eixo CAUSA passa a ser lido como *a assinatura só crava com reação vital presente* — registrado abaixo, implementação adiada para o Lote 2. |

## Fundações do gerador procedural (jul/2026 — detalhe)

**Origem.** Pesquisa de design cruzando Blue Prince × MORTEM com engenharia de sistemas
narrativos (QBN/storylets, World of Horror, Hades, Wildermyth, Starfreighter),
confrontada com o estado real do repositório. Lições operacionais: arte presa ao
catálogo e não ao caso (Blue Prince); composição por camadas com fallback (World of
Horror); reação da voz à derrota anterior (Hades); elenco dinâmico por papéis
(Wildermyth); resource binding de prosa autoral a entidades por tags (Starfreighter).

**Decidido** (a implementar em fases posteriores, uma por vez):
- **Pacote de caso** serializável — o caso vira um objeto JSON único que o motor
  carrega; desfaz o acoplamento caso→motor (valores de cena hoje cravados em `logic/`).
- **Asset 2D sob contrato** — asset externo 2D permitido sob 5 condições (embarcado;
  determinístico por `hashString`; invisível ao motor; fallback procedural obrigatório;
  no manifesto com dimensões e licença). O 3D segue 100% procedural. Textura gerada em
  canvas pela seed = permitida (código, não arquivo).
- **Retratos em camadas** (paper-doll) dirigidos pelos vocabulários fechados de
  `aparencias.js` — variedade visual por caso sem uma ilustração nova por caso.
- **Resource binding** — módulos de prosa com slots tipados de vocabulário fechado
  (nomes, horas, instrumentos), vinculados pelo gerador; nunca composição livre de frase.
- **Papéis dramáticos** — taxonomia de casting gerador-facing (isca do apressado, véu,
  ruído de pista dupla, etc.); dado puro, JAMAIS lido pelo veredicto.
- **Eco do mestre sobre a falha** — na retentativa, o mestre ganha fala curta na
  Caderneta, selecionada pelo código de falha anterior; aponta atenção, nunca conclusão.

**Rejeitado** (fora de escopo, decisão de design — não implementar nem propor):
- Medidor global de tensão tipo DOOM (World of Horror) ou métricas conflitantes tipo
  Reigns — violam o relógio mole e a verossimilhança.
- Economia de itens/moedas; grid espacial de posicionamento (Blue Prince 9×5) — alheios
  ao loop de perícia forense.
- RNG sobre acesso a evidência essencial — a garantia de solvabilidade (âncora durável)
  é inviolável.
- LLM como avaliador de triggers em runtime (Drama Llama) — LLM só em build time, com o
  `qa.mjs` como portão determinístico.
- GLTF/textura de arquivo na camada 3D — o diorama "maquete de papel" permanece 100%
  procedural; a abertura de assets é exclusivamente 2D.
- Reordenação/rejogo do mesmo caso — cada caso é one-shot.

## Gerador por simulação e sistema de interferência (jul/2026 — detalhe)

Ordem de serviço: "Gerador por Simulação e Sistema de Interferência", FASE 0 (registro
normativo; zero código). Versão integral do design: `docs/game-design-simulacao.md`.

**Origem.** Design de **simulação forward + investigação backward**: em vez de o
gerador escrever um caso e depois espalhar pistas, ele **comete o crime** numa
simulação determinística de build time e os vestígios nascem como efeito colateral
físico de cada ação — o jogador investiga o processo ao contrário. A justiça do
mistério (todo vestígio tem causa; todo evento relevante deixa rastro) vira
propriedade do processo, verificável por máquina, em vez de promessa autoral.

**Decidido** (a implementar nas Fases 1–5 da ordem, uma por vez, com portão de aceite):

- **Autobattler rudimentar de build time** — `resolverCrime(assassino, vitima, metodo,
  local, hora, seed)` → `RegistroDoCrime` { ator, ação, célula/mobília, hora,
  vestígios_depositados[] }; RNG só de `hashString` salgado; **reamostragem por
  rejeição** (o assassino sempre vence; contra vítima forte sobrevivem as vitórias
  custosas); iniciativa por premeditação × método; dois tipos de cenário
  (**premeditado** / **briga que escalou**); variável de batalha sem vestígio
  diferencial = lint.
- **Regra de existência de atributo** — só existe atributo que mapeia para vestígio
  observável ou comportamento discreto de diálogo/interferência. STR+VIT fundidos em
  **FOR**; conjunto FOR/INT/WIS/CHA; quadrante **INT × WIS** como gerador de fenótipos
  de assassino (WIS governa a limpeza, INT só a complexidade do método);
  **conservação da evidência** (limpeza converte óbvio em sutil, nunca em zero — todo
  ato de limpeza deposita vestígio de segunda ordem).
- **NPCs periféricos com comportamentos quantizados** — medroso, tagarela, preciso,
  linha do tempo não confiável; testemunha como instrumento de medição com margem de
  erro. Nada de modificador contínuo invisível.
- **Arquétipos × demografia de 1893** — arquétipo como pacote fechado (profissão →
  priors de atributos + traits + motivos potenciais + pacote espacial), sorteado pelas
  frequências demográficas; priors como dados versionados com proveniência por linha.
- **Espaço cidade-primeiro** — ordem: cidade → elenco → inserção espacial → cena →
  autobattler no grid; rotina em 3 faixas (dia/noite/madrugada); **grafo de
  avistamentos** derivado (fonte única de álibis e ruído); **LOD por relevância**
  (interior detalhado só em local elegível a cena); o grid da batalha É a planta
  procedural explorável (proibida representação paralela); vestígio nasce ancorado em
  célula/mobília.
- **Interferência sob as Regras de Justiça R1–R6** — evento contingente pré-computado
  na geração, nunca agência livre em runtime: segundo crime sob pressão (WIS com
  penalidade, vestígio mais grosseiro); saldo informacional ≥ 0 (só destrói
  redundância, sempre deposita vestígio novo); causalidade diegética (informação +
  acesso, com rota espacial plausível); prenúncio obrigatório para alto impacto;
  orçamento 2–3 eventos; catálogo fechado v1 (`destruir_evidencia`,
  `intimidar_testemunha`, `subornar_testemunha`, `silenciar`). O `qa.mjs` (Fase 5)
  prova a âncora durável sob todos os ramos de eventos.
- **Atributos vivem apenas no gerador** — o pacote de caso carrega só consequências;
  o motor é cego a atributos (regra permanente nova no `CLAUDE.md`).

**Rejeitado** (fora de escopo, uma linha de motivo cada):

- Agenda por hora / rotina contínua à la Shadows of Doubt — três faixas bastam para
  álibis e avistamentos.
- Interior detalhado para local não elegível a cena — custo sem vestígio (LOD por
  relevância).
- Grid de alinhamento D&D — redundante com motivo + traits.
- Batalha/rolagens em runtime — o autobattler existe só na geração; o motor consome o
  registro.
- Autobattler visível/jogável; combate envolvendo o detetive — MORTEM é perícia, não
  ação.
- Agência livre do assassino em runtime — quebra a validação de solvabilidade.
- `plantar_evidencia_falsa` — adiado para v2; entrará com falha detectável por
  construção, atada ao WIS do forjador.
- Ficha/atributos do detetive; jogador ferível — nada no jogo detecta atributos do
  perito (regra de existência).
- LLM avaliando gatilhos em runtime — gatilhos são condições materializadas no pacote.

**Reconciliação com a rejeição anterior do grid espacial (Fundações do gerador,
jul/2026).** Aquela entrada rejeitou o "grid espacial de posicionamento (Blue Prince
9×5)" como *alheio ao loop de perícia forense* — e segue rejeitado no que foi
rejeitado: um tabuleiro de POSICIONAMENTO em runtime, mecânica jogável de encaixar
peças/salas que o jogador manipula, à parte do exame de vestígios. O que esta ordem
adota é formalmente distinto: (a) o **grid de batalha vive em build time** — é
substrato da simulação que deposita vestígios, invisível como mecânica; o jogador
jamais joga sobre um grid; (b) a **inserção espacial do elenco** é dado de geração
(endereços, rotinas, grafo de avistamentos) que o motor de veredicto nunca lê; (c) em
runtime, o espaço continua sendo o que já era — a planta procedural explorável
(linhagem da planta da relojoaria, §5.1 do contexto) e o diorama, agora alimentados
pela cidade gerada. Em suma: lá se rejeitou um grid como MECÂNICA DE JOGO; aqui se
adota um grid como GEOMETRIA DE GERAÇÃO, a serviço do mesmo loop de perícia que
motivou a rejeição original. A rejeição anterior permanece válida nos seus próprios
termos.

## Fase 3 do gerador por simulação (16/07/2026) — o resolvedor de crime

Ordem de serviço "Gerador por Simulação e Sistema de Interferência", FASE 3.
Implementação em `src/gerador/` (crime.js, metodos.js, vestigios.js, caso.js,
ponte_caso.js); estado em `docs/game-design-simulacao.md` §2.3. Decisões novas ou
refinadas na execução:

- **Vitória de desespero (determinismo da âncora):** esgotadas 24 tentativas de
  reamostragem sem vitória (matchups extremos, ex.: esganadura de FOR 1 contra FOR 5),
  a batalha final é forçada à vitória com custo máximo e flag `desespero: true` no
  registro. Alternativa recusada: erro de geração (uma seed que não gera caso quebraria
  o contrato "toda seed produz caso solucionável").
- **Regra de existência aplicada ao ruído:** ruído sem ouvinte possível (rotina ×
  adjacência na faixa do crime) NÃO vira variável do registro — vai a
  `metadados.variaveisInertes`. O fato simulado sem testemunha física não existe para
  o jogo; o lint de variável órfã fica estrito.
- **A briga escalada sorteia o PAR, não a vítima:** com a vítima ponderada por classe
  sorteada primeiro, quase nunca havia coabitante de faixa e a briga não ocorria.
  O cenário de briga passa a sortear um par coabitante (dia/noite) inteiro — o motivo
  imediato nasce da convivência (§2.2); quem morre é sorteio (o confronto era
  simétrico). A ponderação por classe segue valendo no premeditado.
- **Resistência da vítima = 2 + 2×FOR:** com 2 + FOR, a emboscada premeditada matava
  em 1 rodada em quase toda seed e a rejeição nunca disparava — o custo da vitória
  (§2.1) não trabalhava. Com o dobro do peso em FOR, brigas duram 2–4 rodadas e as
  rejeições aparecem onde o design as quer (vítima forte, confronto simétrico).
- **Presença do réu garantida por construção:** todo fenótipo deixa âncora de
  presença — WIS baixa abandona o instrumento; WIS alta o leva (a ausência lê-se,
  2ª ordem); WIS mediana o guarda mal limpo; método sem instrumento (esganadura)
  deposita `pertence_do_assassino` (botão arrancado na luta). Simplificação v1
  aceita: para `arma_de_ocasiao` (contundente), a cadeia instrumento→réu é mais
  fraca — refinamento fica para a fase da prosa/diálogo.
- **Sangue alheio ilimpável (conservação):** o respingo do ferimento do assassino
  fica fora do alcance da esfrega do assoalho — a variável `ferimentos_assassino`
  nunca perde o seu único vestígio para a limpeza.
- **`alvos` da planta seguem vazios:** ligar cômodo a nó do mapa é papel da montagem
  do pacote JOGÁVEL (Fase 4+), não do resolvedor — comentários de interiores.js e
  qa.mjs atualizados (diziam "a Fase 3 liga os nós").
- **Prosa da fatia forense = rótulos técnicos:** as cartas geradas pela ponte carregam
  textos placeholder de camada de dado (como os rótulos de mobília da Fase 2); nada
  disso entra em tela nesta fase, e a prosa jogável nascerá pelo pipeline
  `redigir-prosa`/`revisar-prosa` quando o caso gerado virar pacote jogável.

## A evolução das gavetas (detalhe)

5 gavetas (Cronos, Aitiov, Nexo, Dinâmica, Confronto) → Playtest 5: Dinâmica absorvida
pela Aitiov, Confronto automático extinto → jun/2026: 3 gavetas viram livro-caixa da
gramática universal (registram sem validar) → Redesign do Core Loop: **0 gavetas** — a
leitura passa a ser falada pelo mestre (`falaDoMestre.js`) e o Confronto volta como ATO
do jogador → Construção da Acusação: o Confronto separado é absorvido pelo mural
(refutação e sustentação viram barbantes).

Arquivos removidos ao longo do caminho: `GavetaCronos/Aitiov/Nexo/Base.jsx`,
`logic/aitiov.js`, `logic/nexo.js`, `ModalCarimbo`, `QuadroRevelacoes.jsx`,
`Confronto.jsx`, `confronto.js`, `calcularVeredicto` (antiga).
Reaproveitados intactos em todos os redesigns: `logic/cronos.js`,
`logic/tempo_morte.js`, `data/catalogo_causas.js`, `logic/monologo.js`.

## Decisões de conteúdo do tutorial (Fase 1 de conteúdo, jun/2026)

- Adicionada a âncora durável **"visto por última vez com vida"** (`dep_visto_vivo`,
  ceia às 20h de 13/out) para garantir "o durável sempre resolve": livor fixo (teto)
  + última-vez-visto (piso) fecham janela finita em qualquer rota.
- Adicionado o **avistamento falso** (`dep_avistamento_falso`, Sra. Gale) como a
  mentira literal a refutar — o "momento Obra Dinn" do tutorial (Opção B aprovada).
- Adicionado o **testemunho falso contra a governanta** (`dep_acusa_hudson`, Sr.
  Pruitt) — isca de Erro Judiciário refutável pela janela.
- Adicionado o **lenço monogramado** (`ev_lenco`) como segundo vestígio de presença do
  réu (não instrumental — reforço sem gafe).
- Clube de Moorford virou nó distante desbloqueado por lead (corroboração opcional).
- Sob o relógio mole, a "armadilha do relógio" ficou branda: a falha do Apressado é de
  perícia (acusar sem materialidade), não de relógio.

## Overhaul visual "vitoriano premium" (jul/2026)

A estética "mesa à luz de vela" existia como intenção, mas a execução era tímida:
tokens definidos e não usados, cores `stone/amber` cravadas à mão em cada arquivo,
contraste abaixo do legível (`text-stone-600/700` informativo), selects nativos do
navegador no mural e dois sistemas de modal divergentes. Decisões:

- **Materiais em vez de classes soltas**: pergaminho (`.carta-pergaminho`), couro
  (`.painel-couro`), latão (`.placa-latao`, `.botao-mesa`), cera (`.selo-cera`),
  cortiça (`.mural-cortica`) e campo vitoriano (`.campo-vitoriano`) — definidos uma
  única vez em `src/index.css`, procedurais (gradiente + ruído SVG, zero assets).
- **O claro pousa sobre o escuro**: cartas de prova e fichas escritas viram pergaminho
  com tinta (`tinta`/`tinta-clara`); localidades permanecem escuras — prova ≠ lugar
  vira distinção material, não só de rótulo.
- **Latão é hierarquia**: `.placa-latao` reservada às ações solenes (CONSTRUIR A
  ACUSAÇÃO, Levar a julgamento); todo botão comum é `.botao-mesa`.
- **Contraste como norma**: nenhum texto informativo abaixo de `stone-400` sobre
  escuro; sobre pergaminho, escala `tinta`.
- Contrato de QA preservado na íntegra (textos exatos, `.termo-*`, `data-overlay`,
  ordem dos selects da janela); nenhuma lógica tocada — só camada de apresentação.

## Fase 0 do overhaul (13/07/2026) — dívida técnica, sem feature nova

Ordem de serviço: `PROMPT-overhaul-mortem.md` (overhaul do vertical slice), FASE 0.

- **0.1 — Fonte única do modelo de algor:** `medirTemperatura` reimplementava
  `Math.max(11, 37 - ipm)` em código; agora consome `temperaturaPorIpm(ipm,
  AMBIENTE_PADRAO)` e `CONSTANTES_FORENSES.temperaturaInicial`, com `AMBIENTE_PADRAO`
  exportada de `src/logic/tempo_morte.js` — inclusive nas `tagsOcultas` e nas strings
  da carta (o §15 promete ajuste num ponto só; agora cumpre).
- **0.2 — Temperatura fracionária em prosa:** com viagens de 1h30 a leitura pode sair
  meio grau. Formato escolhido: **"22°C e meio"** (meio grau por extenso; o decimal com
  ponto é anacrônico na prosa de 1893 e a vírgula tem cara de instrumento moderno).
  Implementado em `formatTemperatura` (`src/logic/tempo.js`), usado na carta de algor e
  no termômetro; arredonda ao meio grau (limite honesto do mercúrio). *Escolha aplicada
  pelo agente entre as opções da ordem (a decisão interativa não pôde ser colhida);
  trocar para "22,5°C" é ajuste de um ponto só.*
- **0.3 — `janela_sem_sustentacao`:** janela afirmada que cobre a hora real mas não
  intersecta o suporte ligado caía em `janela_imprecisa` (código enganoso). Ganhou
  código próprio na cascata do pilar Quando, bloco de monólogo que expõe contradição
  (não imprecisão), dica de tutorial e caso adversarial (m) no `qa.mjs`.
- **0.4 — Estado de módulo e destaque órfão:** id de ligação passa a ser derivado do
  par normalizado (`ligacao_<menor>__<maior>`, extremos em ordem lexicográfica) —
  fim do contador mutável de módulo. E o ramo de custo 0 de `viajarPara` também
  consome o destaque `nosNovos` (nó revelado por lead no mesmo grupo não fica aceso
  após visitado).
- **0.5 — Assinatura limpa:** `buildDetective`/`escolherDetective` perderam o parâmetro
  morto `opcao` (call sites em `TelaPersonagem`, `App.jsx ?direto` e `qa.mjs`
  ajustados). Se o multi-perito voltar, o parâmetro volta com ele.
- **0.6 — DECIDIDO (19/07/2026, usuário): opção (a).** Ligar o relógio forjado (domínio
  `ambiental`) à âncora Presença é aceito e ignorado pelo nexo. Opções apresentadas:
  (a) manter e registrar como ambiguidade deliberada — coerente com "nada valida até o
  julgamento"; (b) restringir `sustenta_presenca` a cartas com tag de presença
  relevante — ensina no ato, mas mexe na gramática do motor e encolhe a armadilha;
  (c) feedback visual de "fio frouxo" — ensina sem bloquear, mas vaza o juízo do motor
  antes da submissão. **Escolha: (a)** — a ligação segue como armadilha deliberada.
  Nada a implementar no motor.

## Fase 1 do overhaul (13/07/2026) — A Ficha de Coleta

Ordem de serviço: `PROMPT-overhaul-mortem.md` (overhaul do vertical slice), FASE 1.
Contexto: §6.2 novo. Problema resolvido: ao coletar, a carta pousava mostrando só o
título; `descricao`/`vozMestre` só viviam na Caderneta — o jogador coletava sem saber
o que coletara.

- **Camada de UI separada do overlay:** a ficha empilha *por cima* de qualquer overlay
  (local, mesa, caderneta, mural), então não podia ocupar o slot único `overlay`.
  Escolha: campo próprio `fichaAberta` (só o id da carta — dado puro, serializável,
  sem `Math.random`/`Date.now`) + `abrirFicha`/`fecharFicha`; a ficha lê a carta já
  registrada em `cartasRegistradas`, herdando o estado congelado na extração.
- **A ficha abre no motor, não no componente:** `extrairCarta` e `medirTemperatura`
  setam `fichaAberta` no mesmo `set`, então os dois caminhos de coleta (termo em
  negrito e corpo 3D/hotspots) a abrem por construção — sem duplicar lógica na UI.
- **Som:** o `tocarSom('papel')` saiu dos dois sítios de extração e passou para a
  *abertura da ficha* (`FichaEvidencia` no mount) — um som por coleta, como pede a
  ordem ("não duplicar o som da extração").
- **Acesso dentro do Mural:** decisão do usuário entre ícone discreto / pressionar-e-
  segurar / adiar → **ícone discreto** (um "§" `aria-hidden` no canto da carta, com
  `stopPropagation` para não criar/desfazer ligação). Menos invasivo no arquivo mais
  sensível ao contrato do QA; a mesma ficha continua alcançável pela mesa e pela
  Caderneta.
- **Caderneta rebaixada a diário:** "Observações reunidas" virou lista compacta
  (carimbo + hora, cada linha reabrindo a ficha); `descricao`/`vozMestre` saíram da
  lista. "Leitura do legista" e o diário seguem intactos.
- **Contrato do `qa-ui.mjs` atualizado no mesmo commit:** cada extração agora abre uma
  ficha que cobre o overlay, então o helper de extração passou a "Arquivar na mesa"
  após cada termo; rótulo **"Arquivar na mesa"** e `data-overlay="ficha"` entram nos
  textos intocáveis; novo bloco de checagem (extrai → confere ficha → arquiva → reabre
  pela carta da mesa → confere que a Caderneta não traz mais a descrição).
- **Sem prosa nova de jogo:** a ficha só reusa campos de carta existentes; o pipeline
  `revisar-prosa` não foi disparado (não há prosa nova/reescrita). Microcópia de UI
  ("Arquivar na mesa", "Ficha de coleta", "O legista") mantida em registro.

## Fase 2 do overhaul (13/07/2026) — A planta da relojoaria + pontos de interesse

Ordem de serviço: `PROMPT-overhaul-mortem.md`, FASE 2. Contexto: §5.1 novo. Objetivo:
transformar a visita à relojoaria em exploração espacial **sem tocar o motor** — os 4
nós do grupo `relojoaria` viram cômodos de uma planta baixa, e a prosa da cena e da
oficina se divide em pontos de interesse (coleta em camadas).

- **Decisão do usuário — o escritório dos fundos (corpo + cena numa sala só):** entre
  (a) sala única com dois alvos, (b) dois cômodos lado a lado, (c) só a cena com o corpo
  como ponto → **(a) sala única, dois alvos** ("a cena" / "o corpo"). Fiel à verdade
  física (o corpo jaz na cena) e resolve 2-nós-1-sala sem inventar geografia.
- **Decisão do usuário — quais nós ganham pontos nesta fase:** entre só a cena / cena +
  oficina / cena + oficina + corpo → **cena + oficina**. Densidade espacial nos dois
  cômodos que a comportam, sem invadir o exame do corpo (que o 3D já cobre) nem a saleta
  (que a Fase 3 reescreve como diálogo). A planta para andar entre cômodos vale para os
  4 nós em qualquer caso.
- **Camada visual pura:** `src/data/planta_relojoaria.js` é geometria SVG procedural
  (traço de tinta sobre papel), com os cômodos referenciando ids de nó pelos alvos —
  **nenhuma regra o lê**, como o `mapa_espacial.js`. Zero asset externo.
- **Andar = viajar de custo 0:** o clique no cômodo reusa `viajarPara` + `abrirOverlay`
  (o mesmo handler do grid/diorama), então a paridade é por construção; dentro da
  relojoaria o relógio não anda (regra de `mapa.js`, inalterada).
- **Fallback `?flat=1` de graça:** a planta é SVG 2D — funciona idêntico sem WebGL; em
  tela estreita colapsa numa régua horizontal de cômodos (alvos de toque ≥44px).
- **Modelo de dados dos pontos:** campo opcional `pontos: [{ id, rotulo, prosa }]` +
  `introducao` (ambientação sem carta) em `localidades.js`. `EventoLocalidade` renderiza
  acordeão quando há pontos; senão, a prosa contínua de sempre — nenhuma localidade da
  vila mudou. Estado de abertura é UI local (não toca o motor).
- **Restrição dura provada pelo QA:** guarda nova no `scripts/qa.mjs` — para toda
  localidade com pontos, as cartas com `localidade === nó` estão contidas na união dos
  `[[id]]` dos pontos (nenhuma carta órfã) e todo `[[id]]` de ponto é carta real.
- **Contrato do `qa-ui.mjs` atualizado no mesmo commit:** `[data-planta]`,
  `[data-alvo="<no>"]` e `.ponto-interesse` entram nos seletores intocáveis; helper de
  extração passa a abrir todos os pontos antes de varrer os termos; novo bloco (planta
  presente → ponto começa fechado → abrir revela termos → extrair → andar por cômodo
  não gasta relógio) e checagem da planta na rota flat.
- **Prosa nova pelo pipeline:** os pontos e as introduções da cena e da oficina foram
  redigidos pelo `escritor-prosa` e revisados por `editor-critico` + `perito-forense` +
  `fiscal-continuidade` (zero achados bloqueantes) antes do commit. Observação pura: a
  única voz que aponta o relógio de lareira é Wycliffe (viés da história A), fair-play;
  o relógio irmão da oficina segue plantado como saber de graça.

## Fase 3 do overhaul (13/07/2026) — Interrogatórios como diálogo

- **Escopo da leva (a):** só Silas Crane (o réu estreia), conforme a OS §3.3 — modelo de
  dados + árvore completa + componente + QA + prosa revisada. Os outros quatro suspeitos
  (leva b) ficam para a próxima sessão, com aprovação do usuário no meio.
- **Decisão do usuário — confronto rende carta?** Entre "confronto mina carta de
  depoimento nova" e "só reação em prosa" → **só reação em prosa**. A árvore reusa as três
  cartas que Silas já tem (`ev_vidro_dobra`, `alibi_silas`, `comp_silas`); os confrontos
  (estalagem, livro de ordens) mostram a reação observável sem nova carta. A superfície do
  motor fica idêntica — risco zero de continuidade/veredicto.
- **Decisão do usuário — descoberta do confronto:** entre "oculto até ter a prova" e
  "visível-porém-travado" → **oculto** (segue a OS ao pé da letra: "a opção só aparece com
  a carta registrada"). Sem spoiler; o jogador descobre o confronto ao colher a prova.
- **Camada narrativa pura:** `src/data/dialogos.js` pode referenciar ids de carta
  (`requerCarta`, `[[id]]`) — a restrição "só tags" vale para `src/logic/`. O motor não lê
  a árvore; a extração continua por `extrairCarta`, o veredicto não muda. `nosVisitadosDialogo`
  entra no store como dado puro serializável (só o "já perguntado" da UI).
- **Hub-and-spoke, navegação livre:** o nó corrente é estado local (reabrir começa no
  início — relógio mole); o confronto é opção `requerCarta` que reenquadra, nunca confessa.
  Os travessões dos confrontos emolduram a apresentação da prova (um par por cena, dentro
  do teto do guia §3).
- **`renderProsa` compartilhado:** o renderizador de `[[id]]`/interpolação saiu do
  `EventoLocalidade` para `src/components/ProsaComTermos.jsx` (`ParagrafoProsa`), usado
  pelas localidades E pelo diálogo — sem duplicar o laço de marcadores (OS §3.2).
- **`interrogatorio_silas` em `localidades.js`** perdeu `prosa`/`prosaCondicional` (migradas
  para a árvore); o dispatch da Escrivaninha abre `InterrogatorioDialogo` quando há diálogo
  para o nó, senão a prosa de localidade de sempre.
- **Guarda estática (qa.mjs):** toda `requerCarta` referencia carta existente; todo `vaiPara`
  aponta para nó real da mesma árvore; todo `[[id]]` de fala é carta real e nenhuma carta
  com `localidade === nó` fica órfã (espelho da guarda dos pontos, §5.1).
- **Contrato do qa-ui.mjs atualizado no mesmo commit:** `[data-opcoes-dialogo]`,
  `.opcao-dialogo`/`.opcao-dialogo--confronto`/`--voltar` entram nos seletores; a "segunda
  visita" ao réu migra de `prosaCondicional` para a opção `requerCarta` ("Apresentar: O
  Quarto Cinco às Escuras" → reação); novo bloco da Fase 3 (diálogo abre, confronto oculto
  sem a prova, extração de carta de dentro da árvore) e helper `interrogarEExtrair`.
- **Prosa nova pelo pipeline:** as falas de Silas foram redigidas pelo `escritor-prosa` e
  revisadas por `editor-critico` + `perito-forense` + `fiscal-continuidade` (zero achados
  bloqueantes) antes do commit.

## Fase 4 do overhaul (14/07/2026) — Maquete e UI (a mesa ganha teatro)

Overhaul de apresentação, zero motor: `veredicto.js`/`acusacao.js` leem as mesmas
`tagsOcultas`; `qa.mjs` segue `CASO VÁLIDO`. Ordem expressa: `PROMPT-overhaul-mortem.md`
Fase 4.

- **Direção de arte "maquete de papel":** não perseguir realismo (geometria procedural
  sem GLTF torna a briga perdida); a vila é um modelo que o perito montou para pensar.
- **Luz lida do relógio (decisão do usuário — "perceptível e contido"):** `CICLO_LUZ` +
  `interpolarLuz(horasJogo)` em `mapa_espacial.js` (dado PURO — sem `Math.random`/
  `Date.now`); `LuzDoDia` interpola por frame (tarde dourada → crepúsculo → noite com
  lampiões âmbar, névoa de outubro). A noite escurece sem apagar a leitura das etiquetas.
- **Beat de viagem (decisão do usuário — "beat curto e depois abre"):** só na maquete 3D
  e só com custo real (>0h), o overlay do local abre ~0,7s depois — o pino desliza o
  trajeto e a luz vira antes de a mesa desfocar. Viagem de 0h e `?flat=1` abrem no ato.
  Alternativa recusada: abertura instantânea (o pino ficaria escondido pelo overlay).
- **Pás do moinho (decisão do usuário — silhueta estática):** compõem a silhueta mas não
  giram — respeita o `frameloop="demand"` (maquete parada = zero frame). Alternativa
  recusada: giro contínuo (forçaria o canvas a renderizar sempre, gastando bateria).
- **Pulso de "novo" em CSS, não no emissivo 3D:** mora na tag HTML — não força o frameloop
  contínuo. Mesma razão do estático do moinho.
- **Pino à frente do prédio, não no centro do nó:** o alfinete fincado no centro ficaria
  DENTRO da caixa (ocluso); desloca-se para a câmera. O progresso avança por `dt`
  (resolução independente, sem relógio de parede).
- **Tags de papel (RotuloNo):** de quebra, o "viajar · 1h" sai de stone-400-sobre-escuro
  (no limite do §3; achado A5 do playtest 13/07) para tinta-sobre-papel — alto contraste
  por construção. A7 (rótulos atropelados) pago reespaçando as posições em `mapa_espacial.js`.
- **Microinterações da 4.2:** barbante com catenária (`<line>` → `<path>` Bézier, mantido o
  desenho progressivo e a área de clique de remoção); selo de cera "carimbando" ao concluir
  estação; a pena riscando na abertura. Tudo cede a `prefers-reduced-motion`.
- **Tipografia:** auditada — os títulos de overlay já eram `font-serif` (IM Fell) +
  `.titulo-gravado`; o termo do Glossário fica tinta-sobre-papel por contexto (mantido).
- **Passe mobile:** ≥44px no Mural via `@media (pointer: coarse)` escopado a `.mural-cortica`
  (o QA joga em desktop/`pointer:fine` — sem mudança de layout de teste); a planta já garantia.
- **Contrato do qa-ui.mjs atualizado no mesmo commit:** os pontos de abertura de nó passam a
  ESPERAR o overlay surgir (helper `abrirNo`) em vez de tempo fixo — robusto ao beat de ~0,7s;
  checagem nova das tags de papel (`.rotulo-papel`). Regressão pega no mesmo passo: o `· novo`
  herdava `text-transform: uppercase` do verbo (`innerText` = "· NOVO"); `.rotulo-novo-marca`
  volta a caixa baixa, casando o texto exato do QA. Textos de botão, `.termo-clicavel`/
  `.termo-extraido`, `data-overlay` e os `<select>` do mural — intocados.

## Fase 5 do overhaul (14/07/2026) — Passe de prosa e história do slice

Só camada narrativa (seed/tags/motor intocados). Toda prosa via `escritor-prosa` +
pipeline `revisar-prosa`; bloqueantes corrigidos antes do commit. Ver
`docs/playtest-fase-5-2026-07-14.md`.

- **A vítima viva por observação pura (5.1):** Geoffrey Arthurs chega por objeto e por
  fala/gesto — nunca bloco expositivo, nunca o narrador concluindo afeto (guia §2). A
  rotina interrompida (as duas xícaras na copa, a corda que não se deu, a aliança
  G.A. & A.R. por gravar) pesa sem ser nomeada. Alternativa recusada: uma **carta
  coletável nova** de memento — sairia da camada de prosa (mexeria em dados/QA), fora do
  escopo da fase.
- **Eco do título condicional (5.2 — decisão do usuário, 3 opções apresentadas):** o
  verso "A hora que a mentira tomou emprestada de um relógio, o corpo cobrou de volta"
  vive em `blocoHoraTomada` e dispara só com `cenaEncenada && horaForjada && descuidosOk`.
  Correção pós-revisão: o gatilho ganhou `descuidosOk` — sem a encenação derrubada, o
  corpo não cobrou nada, e o verso seria falso em Erro Judiciário/Impunidade. Alternativas
  recusadas: eco universal na fala do perito (soaria gasto em todo caso) e sem eco.
- **Segredos com peso (5.3):** `EPILOGO_SEGREDO_EXPOSTO` e `PERIFERICO_SEGREDO` reescritos
  para que expor um inocente custe — a armadilha do jogo é moral, não só mecânica.
  Universais (Walter=súplica, Agnes=decoro), sem sentimentalismo nem epigrama.
- **Abertura: reforço cirúrgico (5.4 — decisão do usuário, texto aprovado antes de trocar):**
  6 passos e o botão final preservados (contrato do qa-ui). A carta do delegado vira objeto
  físico (lacre, papel, "escrevo de pé, e a mão ainda não me voltou ao sossego"); a chegada
  a Briarstone troca a lista expositiva por três batidas sensoriais (cheiro→som→luz).
  Bloqueante do editor ("com um alívio que não disfarça") corrigido antes de aplicar:
  Wycliffe recebe "com as duas mãos, e não a solta logo" (mostra, não nomeia — §2.1).
  Alternativas recusadas: reestruturar o gancho (mudaria a contagem de passos/QA) e só
  apertar a chegada (deixava a carta genérica).
- **Contradição do fogo (achado do fiscal):** o depoimento de Silas se autocontradizia
  entre `abertura` e `achado`. Alinhado a `achado` (Silas acende, Arthurs desce ao cheiro
  do carvão); "carvão morno" → "carvão frio" (coerente com a oficina não aberta no sábado).
- **Aceite consciente de brilho:** onde o eco 5.2 dispara, o epílogo tem duas frases de
  efeito (eco + balanço do perito), separadas e em registros distintos — tolerável pelo
  editor; o gatilho condicional as torna raras.

## Fase 4 do gerador por simulação (16/07/2026) — Sistema de interferência

Entrega da Fase 4 da ordem "Gerador por Simulação e Sistema de Interferência":
eventos contingentes no pacote de caso sob as Regras de Justiça R1–R6 (design em
`docs/game-design-simulacao.md` §5, detalhe de implementação no bloco "Implementado
na Fase 4" do mesmo arquivo). Decisões de forma tomadas nesta fase:

- **Suborno não destrói o registro anterior.** A R6 exige contradição detectável
  (depoimento novo × registro anterior × evidência física); destruir o depoimento
  velho mataria o par. O gatilho do suborno é a extração do próprio depoimento —
  o perito sempre tem a primeira versão em mãos quando a segunda aparece.
- **Nenhum gatilho destrói a própria carta-gatilho** (lint no QA). Se o evento só
  dispara quando a carta é extraída e o efeito destruísse essa carta, o evento
  nasceria sempre "evitado" — contingência sem dente.
- **Alvos por tipo, amarrados ao que a Fase 3 já produz:** `destruir_evidencia`
  mira carta FÍSICA da cena redundante (a ponte passou a emitir gen_sangue_alheio
  e gen_pegadas como vias extras de presença — é sobre elas que a R2 admite
  destruição; a via instrumental e o corpo ficam intocáveis); `intimidar` mira a
  testemunha do visto-com-vida; `silenciar` mira a testemunha do ruído (escolhida
  PRÉ-crime entre os ouvintes potenciais, porque o local dela precisa de interior —
  LOD); `subornar` mira testemunha com preço (motivo econômico da Fase 1 ou CHA ≤ 2).
- **Redundância R2 computada com as funções do próprio motor** (`fatiaResolveSem`),
  inclusive no ramo pior (todas as destruições do caso juntas) — antecipa, por
  construção, a prova de âncora sob todos os ramos que a Fase 5 promoverá a
  invariante (os ramos parciais preservam supraconjuntos de cartas).
- **`retorno_a_cena` como sustentação de rota** só para o assassino voltando à cena
  do próprio crime: o trajeto que sustentou o crime sustenta o retorno. Qualquer
  outro alvo exige mesmo-local/adjacência/frequentado da rotina (R3 estrita).
- **"Evitada" = o gatilho disparou com o alvo já no caderno.** O silenciamento ainda
  mata a testemunha (v1 não tem ação de proteger — R4 dá o prenúncio para EXTRAIR a
  tempo); o que se salva é o depoimento. Eco pós-caso reconhece os dois desfechos;
  evento nunca disparado não gera eco (para o jogador, não aconteceu).
- **Runtime aplica-e-anota, nada decide:** `dispararInterferencias` verifica gatilhos
  materializados (extração de carta / visita / prova apresentada) e dois gates em
  `extrairCarta` fazem o efeito (vestígio novo não existe antes; evidência destruída
  perde-se depois). Tutorial sem os campos novos — regressão zero provada no QA.

Rejeições (uma linha cada): gatilho por relógio/tempo (não é ação observável do
jogador — feriria R3); destruição de carta já registrada (o que está no caderno do
perito é do perito — a corrida é ANTES); `plantar_evidencia_falsa` (segue adiado
para v2, decisão da ordem §2.7); agência livre em runtime (invariante da ordem).

## Fase 5 do gerador por simulação (16/07/2026) — QA da solvabilidade sob interferência

Entrega da Fase 5 da ordem "Gerador por Simulação e Sistema de Interferência": as
Regras de Justiça promovidas a invariantes verificados por máquina, só em `qa.mjs`
(zero mudança em gerador, motor ou dados — detalhe no bloco "Implementado na Fase 5"
de `docs/game-design-simulacao.md`). Decisões de forma tomadas nesta fase:

- **Ramo = subconjunto de eventos.** Em runtime, qualquer subconjunto dos eventos
  pode ter disparado (o jogador controla os gatilhos pela ordem em que investiga);
  a prova da âncora enumera TODOS os subconjuntos (2^n, n ≤ 3) e exige que a fatia
  resolva em cada um com as funções do próprio motor — substitui a aproximação
  "ramo pior" da Fase 4 pela enumeração completa (o ramo pior continua coberto:
  é o subconjunto cheio). Mais de 3 eventos = falha imediata, porque é a R5 que
  mantém a enumeração trivial.
- **Conjunto redundante como definição, não como teste pontual.** O QA computa o
  conjunto de cartas cuja remoção isolada preserva a solução e exige
  `cartaDestruida ∈ conjunto` — a redundância deixa de ser um predicado que o
  gerador consulta e vira um invariante que qualquer caso emitido tem de exibir.
- **Prova adversarial embutida (o aceite da fase).** O QA constrói casos-armadilha
  — clones de casos reais com UMA violação injetada (âncora destruível via
  `gen_motivo`, gatilho órfão, rota órfã, silenciar sem prenúncio, evento sem carta
  nova) — e falha se as guardas NÃO acusarem; o caso válido tem de passar nas mesmas
  provas. Guarda que não cai em armadilha é guarda morta — a detecção é testada, não
  presumida.
- **Prenúncio provado na prosa, não no metadado:** a carta de sinal tem de carregar
  o texto exato do evento, interpolado (sem `{slot}` residual), nomear a
  testemunha-alvo e viver fora do gate do disparo.
- **Replay estendido às seeds de interferência:** mesma seed → mesmo caso inteiro
  byte a byte (cidade, inserções, crime, fatia e eventos contingentes) também nas 4
  seeds fixas da Fase 4 — "mesmos eventos contingentes" agora é cláusula literal.
- **Regressão zero por construção:** o tutorial não tem `interferencias` — zero
  eventos, um único ramo (vazio), nenhuma guarda nova o toca; a suíte segue verde
  inalterada.

Rejeições (uma linha cada): enumerar ramos por ORDEM de disparo (permutações) — as
destruições comutam e o estado final só depende do conjunto, não da ordem; provar a
âncora com predicado próprio do QA divergente do motor — a réplica usa as MESMAS
funções (`janelaDaCarta`/`intersecaoJanelas`/`mecanismoCravado`), senão a prova
provaria outro jogo; armadilhas em arquivos de fixture separados — clones gerados
in-loco não desatualizam quando o gerador evolui.

## Quatro melhorias de engenharia (16/07/2026) — linter de prosa, Web Audio, gravura, boil

Quatro entregas de uma ordem só, todas fora do motor (nenhuma toca `src/logic/`,
`src/gerador/` ou o shape do estado): duas de infraestrutura de qualidade, duas de
apresentação. Justificativas em uma linha cada:

- **`scripts/lint-prosa.mjs` (+ `lexico-banido.mjs`)** — a norma de prosa era
  fiscalizada só na *geração* (agentes + checklist humano); o linter mecânico
  protege o texto já commitado contra *regressão*: fórmula "não X — é Y",
  densidade de travessão (§4.4), léxico banido espelhado da skill
  `anti-padrao-ia` e teto de frases de efeito. Roda ao fim do `qa.mjs` e como
  `npm run lint:prosa`; exceção deliberada via allowlist explícita no script.
- **`src/som.js` em Web Audio** — `new Audio()` recriava o elemento a cada gesto
  (efeito metralhadora na pena). Agora: `AudioContext` singleton acordado no
  primeiro gesto (autoplay), os cinco WAVs sintetizados decodificados uma vez em
  `AudioBuffer`, e cada toque é fonte nova com humanização (±4% de pitch, ±15%
  de ganho). API (`tocarSom`) e falha silenciosa intactas — nenhum outro arquivo
  mudou.
- **Gravura no `CorpoCanvas`** — o cadáver `meshStandardMaterial` destoava da mesa
  de papel; um passe de pós-processamento (dithering ordenado Bayer 4×4 →
  duotone papel/tinta da paleta quente do `index.css`) o lê como prancha
  anatômica. Atrás da prop `gravura` (default ligada) para A/B e reversão;
  respeita o `frameloop` sob demanda; `DioramaVila` fica como passo futuro
  anotado no cabeçalho.
- **Boil nos traços de mão** — barbantes do mural e traços da planta da
  relojoaria ganham a vibração de traço a lápis: três quadros por traço com
  micro-perturbações determinísticas (tabela fixa de offsets, zero
  `Math.random()` em render), alternados por CSS puro (`steps`/`step-end`,
  ciclo de 0.23s ≈ 13fps). Sem novos assets, sem JS por frame; as áreas de
  clique (barbante e `[data-alvo]` da planta) ficam paradas; cede a
  `prefers-reduced-motion`.

Rejeições (uma linha cada): reescrever textos que o linter acusou (revisão é
editorial, não do agente — ocorrências vão para allowlist com `TODO`); TSL/WebGPU
para a gravura (exigiria fiber v9 — o stack é `three@0.169` + fiber 8); boil por
SMIL `<animate>` ou JS por frame (CSS com quadros empilhados é mais barato e cede
a reduced-motion de graça).

## Cheques 5–7 do linter de prosa (16/07/2026) — filtro sensorial, monotonia de abertura, vocativo

Entrega da OS "Cheques 5–7 do linter de prosa": norma primeiro (guia §4.8–4.10 e
§7; skill anti-padrao-ia nº 10–12), linter como espelho. Decisões de forma:

- **Fala entre aspas é isenta do filtro sensorial POR CONSTRUÇÃO** (não por
  allowlist): depoimento é evidência do jogo; o cheque vale para a voz do
  narrador — o que sobra fora das aspas, rubricas incluídas.
- **Vocativo recuou ao critério inequívoco** previsto na própria OS: o mesmo
  nome do roster 2+ vezes na MESMA fala (a distinção mecânica vocativo ×
  menção em terceira pessoa é frágil em PT). Roster com proveniência de
  dados: SUSPEITOS da seed, vítima, delegado do subtítulo da delegacia.
- **Armadilhas sintéticas rodam embutidas em TODA execução** (lição da Fase 5:
  guarda que não cai em armadilha é guarda morta); `--self-test` verboseia.
- **Triagem do corpus: ZERO achados novos** — nenhuma reescrita, nenhuma
  exceção nova; o relatório ganhou a contagem bruta por cheque (cheque que
  nunca conta nada é cheque morto).

## Fase 6 do gerador por simulação (16/07/2026) — o caso gerado jogável e os 3 modos

Entrega da montagem do pacote jogável (a pendência "Fase 4+" anotada nos
comentários das Fases 2–4) e dos três modos de jogo da tela inicial (detalhe no
bloco "Implementado na Fase 6" de docs/game-design-simulacao.md). Decisões:

- **O gerador segue ilha**: os casos procedurais chegam ao runtime como DADO
  pré-gerado (`scripts/gerar-casos.mjs` → `src/data/casos_gerados.js`), com
  replay byte a byte no QA. Rejeitado gerar em runtime (feriria a guarda de
  ilha e poria o autobattler no bundle).
- **cenaEncenada = false no pacote gerado (v1)**: o catálogo não produz
  encenação de HORA (peça refutável); sem a peça, o pilar de descuidos seria
  inalcançável e a Vitória Absoluta, impossível. O arrasto do autobattler
  permanece como contradição narrativa (livor × posição).
- **instrumentoCorreto = tipoVestigio da carta de nexo**: métodos sem
  instrumento (esganadura) apontam o pertence arrancado — sem isso o pilar de
  presença não fecharia nesses casos.
- **Blocos contingentes** (`blocosContingentes` na localidade): a prosa da
  interferência aparece/some com o disparo do evento — camada de UI; os gates
  mecânicos continuam no store (Fase 4).
- **Réplica dirigida** (modo 2): `gerarCasoBruto(seed, { dirigido })` crava
  cenário/faixa/método e preferências de vítima/assassino; busca de 240 seeds
  escolheu `a_hora_emprestada_replica_96` (lojista morto na própria loja às
  21h de 13/out, arma branca premeditada, a criada com a referência negada,
  INT4/WIS4, corpo movido). O que o catálogo v1 não alcança do original:
  encenação de hora, móbil de silenciamento, periféricos com segredo.
- **Sorteio do modo aleatório na apresentação**: a tela inicial escolhe do
  banco com `Math.random` (camada de componente, fora da guarda de
  determinismo); o caso em si é determinístico por seed. `?caso=<id>` é a
  porta determinística (QA e depuração).
- **Prosa de template em regime "mecânica primeiro"** (precedente de
  dialogos.js): funcional, sob lint-prosa (inclusive cheques 5–7); a
  lapidação editorial passa pelo pipeline `revisar-prosa` em passo próprio.
- **Maquete 3D permanece do caso-escola**: nós gerados não têm posição no
  diorama; a mesa cai na grade 2D (o fallback obrigatório de todo ponto 3D).

Rejeições (uma linha cada): diálogos de interrogatório gerados (v1 sem árvore —
depoimentos nascem como prosa de localidade; árvore procedural é OS própria);
periféricos com segredo no caso gerado (exigiria álibi + vestígio de segredo
gerados — v2); nó do mapa nomeado pelo réu (telegrafaria; o nó leva o nome do
prédio).

## OS árvore de diálogo procedural (16/07/2026) — todo suspeito gerado conversa

Execução da OS aberta sobre a rejeição da Fase 6 (norma e spec em
`docs/os-arvore-dialogo-procedural.md`; guia de estilo ganhou a §8 — voz
derivada). Fases 0–5 entregues em sequência. Decisões:

- **Interrogatório mora na delegacia**: toda árvore gerada é diálogo EMBUTIDO
  (`origemLocalidade: 'delegacia'` — o delegado manda chamar, um a um).
  Rejeitado nó de mapa por suspeito (poluição + telegrafia de peso) e
  interrogatório no local de rotina (o `oficio_do_reu` nem sempre existe).
- **O paradeiro vira carta**: cada beat de paradeiro sustenta
  `gen_alibi_<suspeito>` em todo tom (solubilidade), no vocabulário de tags de
  `alibi_silas` — o confronto em cena (`ligacaoDeConfrontoEmCena`) liga sem
  tocar o motor. Marcador em fala de diálogo passou a contar como caminho de
  extração (gerar-casos + higiene do qa).
- **Réu posto na cena pela rotina declara a moradia** (a mentira de design, à
  Silas — cai só por confronto); todos os demais declaram a rotina, honesta.
- **Confrontos pela tabela fechada**: `pertenceA` (instrumento, pertence,
  soberanos, retalho) e `origemTestemunha` (visto-com-vida, ruído). Fora, com
  motivo: sangue e pegadas (1893 — sem tipagem nem casamento de bota no
  catálogo), pressão sobre testemunha e prenúncio (o alvo é terceiro), carta
  cujo dono não é suspeito do caso.
- **Tom ressonante por trait** (medroso→cordial, preciso→técnico,
  tagarela→oblíquo, linha-do-tempo→firme) rende prosa, nunca prova — sem dente
  mecânico, como no caso-escola.
- **Voz derivada por regra fechada** (guia §8.4): registro por classe social,
  têmpera de idade, um tique de trait; contrações de lugar para os rótulos com
  artigo embutido ("ao Moinho", "na Taverna").
- **Guardas novas** (qa.mjs): estrutura (4 tons por beat, nó órfão, bijeção,
  sustentação comum, id interno em fala), armadilhas sintéticas embutidas em
  toda execução (beat de 3 tons, confronto sem reação, nó órfão, requerCarta
  fantasma — `--self-test` verboseia) e replay chamada a chamada. `qa-ui.mjs`:
  a rota gerada agora interroga (4 tons, extração do álibi, encerramento).
- **Playtest dirigido**: roteiro próprio em `docs/playtest-arvore-dialogo.md`.

## OS lapidação editorial da prosa gerada (16/07/2026) — o corpus dos 9 casos sai do regime "mecânica primeiro"

Execução da OS elaborada em `docs/os-lapidacao-prosa-gerada.md` (rascunho da PR
#43). Fases 0–4 entregues em sequência: extração do corpus realizado (script de
mesa, fora do bundle) + mapa variante→casos, parecer consolidado do pipeline
`revisar-prosa` (3 revisores em paralelo), reescrita na FONTE
(`src/gerador/pacote_gerado.js` + residuais em `dialogos_gerados.js`,
`interferencia.js`, `espaco.js`) com `gerar:casos` no mesmo commit, e segundo
passe até zero bloqueantes (veredicto APROVADO dos três revisores). Decisões:

- **Dedução vazada era o grosso** (10 bloqueantes): fechos-conclusão de carta
  ("Alguém saiu dali ferido, e andando", "O passo é de saída, e é um só"),
  máximas de interferência ("Dívida velha não se paga sozinha", "Moeda graúda
  tem caminho — e o caminho sobe até X"), "mão mais grosseira", móbil com
  intenção do réu, e o título "Sangue que Não É da Vítima" (sorologia
  impossível em 1893 → "O Rastro de Gotas"). Tudo reduzido ao observável.
- **Livor contraditório só no estado FIXO** (erro forense: o móvel migra com o
  corpo e não testemunha postura anterior), sem o "porém" adversativo — a
  justaposição deixa o curto-circuito com o jogador. A raiz no modelo (arrasto
  no instante da morte em `crime.js`) fica LAVRADA para decisão do usuário.
- **O delegado deixou de ser aforista**: das cinco tiradas por abertura ficou
  uma ("papel meu não data defunto" — fórmula de ofício) + o fecho de handoff.
  Papel justifica registro comum entre os seis sobrenomes, não espírito comum.
- **Única ampliação de corpus aprovada**: 3 variantes de retrato por trait
  (armações variadas, `hashString` salgado) + dedup por varredura na ordem
  estável da tela — zero retrato repetido lado a lado nas 9 telas. O corte de
  escopo previsto na OS §8 não foi necessário em nenhuma outra superfície.
- **Costura com o injetado**: concordância "a/o acharam" pelo gênero da vítima;
  artigo do prédio (`sujeitoDoLugar`); mobília filtrada pelo cômodo do crime;
  "quarto(s) (sobrado)" → "quarto do sobrado"; dedup de textura de vestígios;
  moldura do ruído por posto de escuta (mora × frequentava × vizinha).
- **Anglicismos só na exibição**: `profissaoExibida` (squire→"senhor de
  terras", professora de vila→"mestra-escola" — ids de carta intactos);
  "range"→"fogão de ferro a carvão" (rotulo de mobília; id preservado).
  "Taproom"/"beer engine"/"estufa de ferro" ficam, lavrados (moldura diegética
  "a que a vila chama"); sugestão de verbete de glossário anotada.
- **Prenúncio neutro de gênero** (contrato R4 preservado: carta e evento
  derivam da mesma `PROSA_PRENUNCIO`; guarda verde) — a descrição de carta não
  passa por interpolação, então nada de "o senhor" fixo.
- **Álibi × visto-com-vida**: quando a testemunha do avistamento declara hora
  DENTRO da própria janela de álibi, a fala assume o encontro à porta
  (`encontroNaJanela` em `dialogos_gerados.js`) — as duas declarações do mesmo
  nome deixam de se excluir (comarca_3).
- **Allowlist do lint-prosa**: nenhuma das 21 exceções `TODO(revisão
  editorial)` pertence às fontes desta OS (todas são do caso-escola:
  cartas/diálogos/glossário/monólogo/epílogo) — nada a absolver nem reescrever
  aqui; zero exceção nova criada.
- **Achados de DADO lavrados para o usuário** (fora do escopo de prosa): gate
  método×força (esganadura de ferreiro por criada), dedup de nomes entre casos
  e prenome vítima×elenco, sobrenomes partilhados sem parentesco tratado,
  culto noturno como álibi, menino de 14 na taverna, colocação da testemunha
  do ruído no prédio da cena, custeio da perícia pela vila × coroner (Medical
  Witnesses Act 1836 — enquadramento estrutural do jogo).
- **Playtest de leitura**: roteiro próprio em
  `docs/playtest-leitura-prosa-gerada.md`.

## OS Briarstone em escala (17/07/2026) — a vila de ~500 desce as instituições à escala

Origem: auditoria de verossimilhança (pesquisa urbanística × caso-escola). Saída
**B** martelada pelo usuário: Briarstone permanece vila pequena (~500 hab., ~95
fogos) e as instituições descem à escala, em vez de subir a vila à classe Henfield
(~1.700). Racional (uma linha): reforça a fraude de alcance regional, preserva o
degrau vila → market town da campanha e maximiza o "todos se conhecem".

- **População canônica** lavrada no `MORTEM_CONTEXTO.md` §14: vila nucleada de ~500
  almas (~95 fogos; censo 1891, 5,32 ocupantes/casa). Aritmética conferida:
  95 × 5,32 ≈ 505.
- **Estação (correção de rota do pipeline, decisão do usuário):** a redação inicial
  "sem estação própria — o trem serve por estrada" contradizia a chegada exibida
  (plataforma em `abertura.js`), o template do gerador e a própria KB §6 (estação a
  0,5–1,5 milha do núcleo). Reconciliado para **estação de borda**, à moda da §6 —
  zero prosa exibida tocada.
- **Patente do Wycliffe (divergência KB × premissa da OS, decisão do usuário):** a OS
  presumia *sergeant*; a KB (`demografia-e-sociedade.md` §3, `inquerito-e-policia.md`
  §2) dá ao policial de vila a patente de **constable**. Canonizado **constable**
  (alinha a KB, zero emenda de KB). "Delegado" segue como **glosa** vernácula: ele
  **assina "Delegado"** e a verdade fica lavrada na bíblia de vozes — evitando que o
  leitor brasileiro leia troca de patente. Lição: decisão B da tabela de tradução é
  "manter o posto inglês", não "delegado" (que é a Opção A vernácula).
- **A loja e correio da Sra. Rooke:** a "papelaria" vira **a loja e correio** (id
  `papelaria` intocado; rótulo exibido "A Loja da Sra. Rooke"). Agnes é a
  *postmistress* — quem manuseia a correspondência de toda a vila é quem mais teme o
  falatório: **reforça o motivo do decoro** (na ficha, nunca na fala; idioleto
  preservado).
- **Alcance regional da relojoaria:** por observação pura (encomendas de fora pelo
  *carrier* semanal; conserva anual do relógio de torre da paróquia — fonte nova na
  KB: caso Charing/George Coppins), a fraude de Silas vivia de clientes **distantes**
  que não voltam para pesar a caixa; a queixa de Caleb Grey é a exceção **local**. A
  geografia explica por que a fraude durou.
- **A forja reconciliada (emenda de KB feita, decisão do usuário — CENTRAL):** a
  contradição interna da KB (`urbanismo-e-morfologia.md` §2/§7 central × `arquitetura-e-espacos.md`
  §1 borda) resolvida **a favor do centro** (mais documentada; a bigorna como relógio
  sonoro). O slot da forja no `TRACADO` do gerador (`cidade.js`) desceu da orla para o
  coração da High Street; a adjacência recomputa por distância. `arquitetura-e-espacos.md`
  §1 e as citações em `espaco.js`/`arquetipos.js` emendadas. Casos gerados regenerados
  (`gerar:casos`) — `qa.mjs` verde e byte-idêntico: **nenhum veredicto mudou**.
- **O carro das seis:** o veículo da mentira de Walter deixou de ser "a diligência das
  seis" (anacrônica/ambígua) e virou "o carro das seis"; a volta, "o primeiro trem".
- **Guarda das duas diligências (lição de vocabulário):** no corpus convivem o
  **veículo** (a mentira de Walter — só ele mudou) e o **ato policial/judicial**
  (intocável, de época). Busca-e-troca cega de "diligência" era falha bloqueante da OS;
  o léxico "de praça" do Walter (juízo/credores/diligência) é o sentido legal e ficou.

## Reconciliação encenação→motor (17/07/2026) — Lotes 1 e 3, e a decisão §5 adiada

**Origem.** Documento de decisão de escopo que mapeou ~37 "tags candidatas" da pesquisa de
encenação/supressão contra o vocabulário real do motor. Estado: 8 já existiam, 2 não devem
existir, 9 baratas (zero lógica), 11 pedem uma única decisão de motor, 7 pedem âncora
espacial (D2). O usuário selecionou **Lote 1** (as baratas) e **Lote 3** (fraude de tempo
pelo corpo); adiou o Lote 2 (o sinal de ausência) e a fila da âncora (Lote 4).

**Lote 1 — entregue (nenhuma linha de `src/logic`).**
- **6 verbetes de glossário** dão à `vozMestre` e ao jogador o vocabulário que a KB nova
  trouxe: `reacao_van_deen` (guaiaco, presuntivo), `cristais_teichmann` (hemina,
  confirmação), `microespectroscopia_sorby` (gabinete), `micrometria_gulliver` (exclusão
  de espécie, nunca afirmação de sangue humano — Uhlenhuth é 1901), `epitelio_no_coagulo`
  (a doutrina de Gross: prove o que veio preso no sangue) e `discordia_tanatologica` (a
  manipulação do resfriamento).
- **`instrumento_guardado_umido` corrigido**: a classe cobria só a umidade da junta (que
  seca em um dia); passa a nomear o **coágulo sob a virola e os rebites do cabo**, que não
  seca e Teichmann acha décadas depois — o vestígio durável de que a umidade era o sinal
  perecível. Proveniência apontada para `supressao-de-vestigios.md`.
- **`gen_frestas`** (carta condicional nova): quando a limpeza (WIS alta) esfregou a poça,
  o pigmento foi empurrado para o vão entre as tábuas (Gross); a área baça à luz oblíqua e
  o guaiaco positivo na fresta. Ambiental, sem `pertenceA` — o motor não a lê como nexo nem
  refutação; é a supressão tornada visível. A **incisão sem hesitação** entrou dobrada na
  prosa da lesão de arma branca (observação pura, sem sinal).

**Lote 3 — entregue (fraude de tempo pelo corpo).** `cartaHoraForjada` deixa de ter só as
duas variantes de relógio e ganha **duas variantes térmicas**: corpo **aquecido** junto à
lareira (parece morto há pouco → hora aparente tardia da manhã) e corpo **resfriado** na
corrente (parece morto há muito → hora aparente bem cedo). Mesmas tags do mostrador forjado
(`cronologia_aparente`, `encenado`, `isca`) → o motor as trata idênticas e o jogador as
refuta ligando o rigor e o livor duráveis, que o calor e o frio não desfazem. As horas
forjadas caem, por construção, fora da janela do corpo (provado: 0 falhas de descuidos em
200 seeds; 35 encenados — relógio, aquecido e resfriado ocorrem). Sem âncora espacial nova,
sem causa nova, sem tocar o motor de dedução.

**§5 — decisão tomada, execução ADIADA (é o Lote 2, não selecionado).** O sinal de ausência
do eixo CAUSA (o sulco sem reação vital, as bordas pálidas sem coágulo, a fratura seca)
destrava 11 tags de uma vez, e é a decisão de que forma o motor passa a saber dizer "não foi
isto". Das três formas (a: `excluiCausa`; b: assinatura condicionada pela reação vital;
c: contradição como pista), ficou decidida a **(b)**: `reacao_vital` deixa de ser inerte —
a assinatura só **crava** a causa se a reação vital estiver presente; **ausente**, ela
**abre** o leque em vez de fechá-lo. É a leitura forense correta (como Casper lia o sulco) e
a mais fiel à KB. **Custo conhecido** (razão do adiamento): mexe na semântica de um sinal que
20 cartas já usam, então os 21 casos regeneram e o `qa.mjs` (réplica byte a byte) acompanha
no mesmo commit — é o Lote 2, a ser executado sob ordem expressa.

## OS priors compostos e variedade do elenco (18/07/2026) — F0–F4

Execução da OS `docs/os-priors-compostos-e-variedade-do-elenco.md`, com os 12
pontos [DECISÃO] respondidos pelo autor (registro no dossiê F1 §D e nas capturas
da conversa). Decisões de arquivo permanente:

- **Remoção de `afinidadePapeis` (decisão 12).** O campo era reserva documentada
  desde a OS da camada psíquica e nunca foi consumido: o caso GERADO não escala
  papéis nomeados (a taxonomia de `src/data/papeis.js` rege o caso-escola). Dado
  que envelhece sem uso é passivo de manutenção — removido do catálogo
  implementado; a leitura vetor → papel permanece como andaime de design na KB
  (`sistemas-arquetipicos-alem-dos-12.md`).
- **Achado B✱ (triagem F0):** `hashString` linear acoplava sorteios-irmãos de
  sufixo isométrico (INT × WIS travados quando os totais de peso coincidiam —
  quadrantes permitidos pelos priors, porém mortos). Remédio: `hashDecisao`
  (re-hash decorrelacionante) LOCAL do gerador; `src/logic/hash.js` e o runtime
  intactos. Guarda de decorrelação no `qa.mjs`.
- **Escala de atributos permanece 1–5** (§6.1 da OS, contra 0–10) — condição de
  revisita registrada na própria OS.
- **Penitente reprovado** como 14º vetor (colide com o `pecado_exposto` do
  Devoto); sacristão-coveiro, estalajadeiro, jornaleiro itinerante e coadjutor
  reprovados como arquétipos (função-não-sustento; duplicata do taverneiro;
  quebra do círculo social; condicionado ao pároco) — fontes no dossiê F1 §2.1.
- **Sorteio de sobrenome segue uniforme** (ponderar pelo censo nacional só
  engordaria Smith/Jones; a concentração de vila é familiar e local — a política
  de repetição 2–3 já a produz).

## Correções do playtest independente (18/07/2026) — os dois contratos P1

**Origem.** Relatório `playtest-independente-2026-07-17.md` e a OS derivada dele. Os
cinco P0 (zona morta do `ResumoEstacao`, "§" da ficha em mobile, glossário empilhado,
Esc em pilha, confirmação de lacunas no selo) eram bugs de usabilidade sem decisão de
design; estes dois pediam registro antes de código.

**1. `ev_vidro_dobra` — a única carta dependente de tom (§7.4-16 do relatório).**
`src/data/dialogos.js` fazia a lasca de vidro na bainha de Silas aparecer só no tom
oblíquo do beat 1, contrariando o contrato documentado no próprio arquivo: "nenhuma
prova que o veredicto lê depende do tom". A carta não é necessária à Vitória Absoluta,
mas três em quatro jogadores jamais saberiam que ela existe. Decisão: **Opção A —
democratizar**. A lasca sai em qualquer tom, com prosa distinta por tom (no oblíquo,
Silas se trai ao cruzar as pernas — texto original; no firme, levanta-se para reencher
a xícara e a luz o apanha de pé; no técnico, chega a cadeira ao lampião a pedido do
exame; no cordial, afrouxado pela brandura, ajeita a calça sobre o joelho e a bainha
sobe da botina — o "estica as pernas" do esboço da OS caiu na revisão de voz, por
quebrar o corpo controlado de Silas). O tom segue sendo **cor, nunca chave** — o
peso da escolha permanece narrativo. A Opção B (assumir tom como mecânica de gate)
foi rejeitada para o slice: mudaria o contrato do jogo inteiro e pediria mais cartas
dependentes de tom para a regra valer o custo. Consequência de guarda: o conjunto
`CARTAS_PRECISAO` do `qa.mjs` esvazia — a verificação de solubilidade passa a exigir
TODA carta da árvore em TODA descida (a categoria "precisão tom-dependente" fica
registrada no código para um retorno futuro consciente, se a Opção B um dia vingar).

**2. Feedback das automações silenciosas (§4.3 e §1.4 do relatório).** Duas
automações agiam pelo jogador sem cerimônia. (a) O corpo auto-ligado às âncoras: o
`useEffect` do mural liga as cartas temporais/causais coletadas às âncoras
quando/como sem o jogador tocá-las — a tese de design ("o corpo é lido, não
selecionado") já vivia em comentário de código, invisível ao jogador. A Estação I
ganha o micro-rótulo **"o corpo declara"** junto às cartas auto-ligadas: distinção
visual, zero mudança de motor. (b) O confronto em cena que anota `refuta_alibi` ao
mural só avisava no diário. Ganha o aviso discreto no rodapé ("A prova ficou anotada
ao mural"), reutilizando o padrão do `AvisoCartaPousada` — mesmo tom, mesma duração,
camada transiente de UI fora do save.

## S2 — Decisões de fair play (19/07/2026)

**Origem.** OS `docs/os-fair-play-s2.md`, executada como sessão de decisões. Insumos:
`docs/kb-craft-narrativo/cliches-e-fair-play.md` (seções citadas por item) e os três
relatórios de playtest de 19/07. **Nenhum código mudou nesta sessão** — cada decisão vira
lote na sessão carimbada.

**Bloco A — caso-escola:**
- **Item 12 (vidro de Silas) → espalhar o peso.** A lasca deixa de bastar sozinha; a força
  se distribui entre 2–3 provas, nenhuma isolada cravando o réu (KB §6, plantio por
  ênfase). O tom já fora democratizado em 18/07 — esta decisão é sobre o peso, não o tom.
  *Execução:* lote próprio + S3 (prosa das provas irmãs). Guarda: `qa.mjs` (sustentação).
- **Item 14 / P8 (mentira rotulada) → rótulo neutro.** A estação `III · As Mentiras` deixa
  de anunciar a carta como mentira; o rótulo vira "depoimento"/"declaração de paradeiro" e a
  natureza só emerge quando o jogador liga o fato que a desmente (KB §7). Vale nos **dois
  modos**. *Execução:* lote de UI + contrato `qa-ui` no mesmo commit.
- **Item 16 (móbil) → móbil por suspeito, com isca.** Cada suspeito ganha móbil plausível, o
  real escondido entre iscas honestas (paridade com o gerador, que já faz `gen_movel_`/
  móbil-isca; KB §4+§7). *Execução:* S3 (prosa dos móbeis) + Estação IV do mural.

**Bloco B — gerador (fair play de autoria):**
- **P9 (âncora única) → híbrido.** Autoria por **âncora dupla independente** onde a magnitude
  permite; **contra-hipótese jogável** ("outra pessoa pode ter levado a arma", sustentável e
  refutável) nos demais (KB §6, solução dupla de Berkeley — a acusação errada tem de ser
  racional). *Execução:* lote do gerador (duas vias), re-geração dos 21 casos + `qa.mjs` no
  mesmo commit — **fura a fila do gerador** pelo custo.
- **P16+P17 (compleição física) → adiar.** O canal (vítima descrita × força do exame ×
  pegadas) fica no backlog do gerador. Como o P9 ficou híbrido, a âncora dupla usa o segundo
  vestígio que já existe — não depende da compleição para ser justa.
- **P24 (fôrma das mentiras) → cardápio amplo + culpado partilha fôrma.** As sete fôrmas do
  KB §7 (amor, dívida, furto miúdo, proteger terceiro, vergonha, medo da polícia, fraude
  paralela) distribuídas por demografia/segredo; **o assassino pode usar a mesma fôrma de um
  inocente** — a fôrma deixa de ser sinal de culpa. *Execução:* lote do gerador + S3 (prosa
  das fôrmas). Guarda: `qa.mjs` (sorteio determinístico por `hashString` salgado).

**Bloco C — diálogo (decisão aqui, execução na S1):**
- **Item 11 / P21–P22 → confirmado; segunda camada em TODOS os confrontos.** Paradeiro
  declarado só **quando perguntado** (nunca espontâneo — o assassino mente dentro do mesmo
  beat dos inocentes); o confronto **puxa fala nova** (admissão parcial, detalhe,
  contradição) em **todos** os confrontos, não só nos do réu; exposição contida no negrito
  informativo, não no título opaco (P6, `textoDisplay` de `dialogos_gerados.js`). KB §2
  (Van Dine nº5) / §4 / §7.
- **P23 (deflexão "veio de fora") → guarda de sustentação, refinada.** Proibida como
  **deflexão auto-interessada do culpado** quando não há forasteiro plausível (só ele lucra
  com a tese = tell). **Permitida como falso testemunho de um inocente preconceituoso** —
  retratável, nunca validada pelo jogo (KB §5, a xenofobia da vila como ruído, jamais
  indício). A guarda mira *quem* fala e *por quê*. *Execução:* S1.

**Bloco D — triagem espacial/elenco (aprovados para execução):**
- **Item 8 → fazer, e estender à cena procedural.** Planta única navegável no caso-escola
  **e** nos casos gerados — funde-se com a última milha da OS `palco-em-aneis` (E1:
  `comodo`/`celula`/`mobilia` como metadado na carta + render da planta no gerado; o
  `plantaSvgDoInterior` já existe em `interiores.js`, nenhum componente o desenha para o
  gerado — só o caso-escola tem `PlantaRelojoaria.jsx`). Camada de apresentação; motor cego.
  *Execução:* OS `palco-em-aneis` (E1/E2) + lote de UI do caso-escola.
- **Item 9 → fazer.** Silas e o aprendiz saem da cena para casa após o cerco da polícia
  (elenco + dados espaciais do caso-escola, `localidades.js`). *Execução:* lote do caso-escola.
- **Item 10 → fazer.** Opção de ler a **transcrição completa** da carta amassada do sobrinho
  (QOL de leitura, não fair play). *Execução:* lote pequeno de UI.

## S1 — Fair play do diálogo (execução, 19/07/2026)

Execução do Bloco C da S2 sobre o derivador de árvores de diálogo procedural
(`src/gerador/dialogos_gerados.js`), orquestrada pela OS `os-dialogo-s1-fair-play.md`.
Sub-decisões do usuário registradas; três fases, um commit cada; toda prosa gerada passou
pelo pipeline `revisar-prosa` com zero achados bloqueantes.

- **P21 (paradeiro universal) → já satisfeito, verificado.** Nenhum código mudou: a fala de
  abertura não cita o álibi (só recepção); o paradeiro só sai nos nós `b1_<tom>`, alcançados
  por uma pergunta do jogador; o assassino de cena mente com a **mesma redação** do inocente
  caseiro (`falaDeclarada`, ramo `mentiraDeCena`). A confissão espontânea (Van Dine nº5) já
  estava barrada por construção.
- **P6 / item 11 (rótulo informativo) → lugar + faixa** (DECISÃO 1 = opção A). O
  `textoDisplay` das cartas de álibi deixou o título opaco `"A Noite de {nome}"` e passou a
  carregar o lugar declarado + a faixa (`"A Escola (sexta à noite)"`), a mesma composição do
  `carimboPadrao`. O lugar é o dado que cai por confronto; a faixa dá o contexto. Espelha o
  idioma do caso-escola (`"Recolhido à Estalagem às Oito"`). *Fase 1.*
- **P22 (segunda camada em TODOS os confrontos) → detalhe verificável** (DECISÃO 2 = opção
  A). Cada reação de confronto (`confrontoDaCarta`) deixou de só reafirmar. Nas seis do réu,
  a 2ª camada aponta o **paradeiro declarado por termo** — gancho de cruzamento com a carta
  de álibi, a única sempre presente e cruzável —, sem confissão e sem apontar para si. Nas de
  testemunha, um detalhe de vantagem/percepção própria. Assimetria de fair play preservada
  (réu acomoda a prova; inocente-com-segredo dá o fato que o desonera). *Fase 2.* O perito
  barrou 1 bloqueante (a reação de ruído cravava enquadramento noturno que a faixa `dia`
  desmente) e o editor 2 altos (armadura de fecho repetida; corrente de máximas) — todos
  corrigidos antes do commit.
- **P23 (deflexão "veio de fora") → só a guarda de sustentação agora** (DECISÃO 3a: fontes =
  `vitima.forasteiro` + `ausencias`/satélite; DECISÃO 3b = opção B). A fala de deflexão do
  réu só é gerada quando há forasteiro plausível no caso (a vítima de passagem, ou um
  suspeito com paradeiro na vila-mercado satélite); sem isso, o arremate do réu cai em três
  falas novas que **não defletem** (recusa nomear, defere ao inquérito, sem apontar para fora
  nem para si). Guarda bifurca 7/21 (deflete) × 14/21 (não). **A metade "preconceito de
  inocente" (falso testemunho xenófobo, retratável) NÃO foi implementada** — fica como fase
  própria, gatilho: ordem expressa do usuário (é feature nova: slot de deflexão no ramo
  inocente + fato-refutação). *Fase 3.*
- **Rota:** S1 concluída (P6/P22/P23-guarda em código; P21 verificado). Próxima frente ativa
  segue a `plano-de-sessoes.md`. Pendências abertas por esta sessão: P23-preconceito de
  inocente (fase própria) e a [DECISÃO menor] de endurecer no `qa.mjs` a guarda "abertura não
  vaza paradeiro" (não feita — a propriedade vale por construção hoje).

## 21/07/2026 — S3/S4 e o pivô "Gabinete Ilustrado" (visual novel de gravura)

Sessão de continuação (ramo A). Fechou S3 (prosa dedicada) e S4 (UI/arte) e implementou os
Sistemas 1 e 2 do pivô de apresentação (`docs/nota-gabinete-ilustrado.md`). Autonomia
expressa do usuário (commit/PR/merge sem input humano). Só camada de apresentação/prosa; o
motor, o gerador e a gramática da acusação ficaram intocados. Gates verdes em cada commit.

- **S3 itens 2 e 7 — a voz do mestre.** Com o backstory novo (Dr. Alcott ausente; Harlan
  examina só), "a leitura do legista" (legista presente) soava artificial. Decisão: vira
  **"A voz do mestre"** — a convenção já registrada no eco pós-falha (a voz de Alcott na
  cabeça do aprendiz), que resolve a deixis sem reescrever os apartes `vozMestre`. Cada
  aparte recordado remete ao Glossário ("o mestre já falou disso — veja no Glossário"),
  preenchendo o ponteiro que o item 5 tirou da carta. Pipeline `revisar-prosa` zero
  bloqueantes (fiscal pegou "O legista" residual na Ficha; editor pediu de-duplicar o link).
- **S4 — tipografia já cumprida, ratificada; 4.3 resolvido.** 1.2(b/c/e) já vigiam no código
  (prosa 16px serif, mural 12px, sistema dual claro×escuro). O espaço morto sob o diorama
  ganhou uma atmosfera de vela na beira baixa do tampo (`.mesa-desk-atmosfera`).
- **Sistema 1 — A Prancha (decisão §8.1: aposentar o corpo3d).** O exame do corpo passa a ser
  prancha de atlas em SVG procedural (lupa, hotspots que extraem as mesmas cartas, pose/livor
  pelo IPM). Verso frente↔dorso **rotulado pela FACE** (perito ALTO: "decúbito ventral" com
  livor dorsal leria como corpo movido — sinal falso) e camada de necropsia ilustrativa (0
  hotspots). O cadáver 3D foi aposentado do exame; o diorama da vila segue 3D, intocado. SVG
  (nunca canvas) mantém o `?flat=1`.
- **Sistema 2 — A Cena.** Interrogatórios e eventos de localidade compõem cena ilustrada:
  fundo 2D paramétrico (`FundoCena`) + sprite meio-corpo (variante `'cena'` do retrato),
  "gravura que respira" e "reação observável" (gesto, nunca legenda). Contrato do `qa-ui`
  preservado (`data-retrato`, `data-opcoes-dialogo`).
- **Inc. 7 — slots de asset** `prancha_corpo`/`fundo_cena` registrados (contrato pronto;
  procedural é o fallback).
- **Inc. 6 — "Exigir que mostre": DEFERIDO (fase própria).** O circuito exige marca-espelho
  de luta no agressor; o caso-escola é homicídio por arma branca sem luta e não a suporta sem
  fabricar um sinal que fura o fair play. Pertence ao gerador (autobattler produz a luta +
  ruído honesto nos inocentes). Gatilho: ordem expressa. Detalhe na nota §Inc.6.

## 24/07/2026 — OS Prancha da Vila (E1): a gravura assume o hub

Ordem de serviço "Prancha da Vila", etapa E1. Só camada de apresentação: motor, gerador,
pacote e gramática da acusação intocados. Gates verdes (`npm run build`, `qa.mjs`, `qa-ui.mjs`).

- **A prancha de gravura passa a ser a vista PADRÃO da escrivaninha; o diorama 3D vira
  alternador opcional, intocado.** Motivo de design: depois do pivô do Gabinete Ilustrado,
  corpo e conversas são gravura de 1893 e o diorama era a única superfície falando outra
  língua. Motivo de custo: a vista 2D **já era o fallback obrigatório** (`?flat=1`, sonda de
  WebGL, perda de contexto) — promovê-la deixa **uma** superfície de nó a manter em vez de
  duas. `DioramaVila` não perdeu uma linha; só deixou de decidir sozinho qual vista sobe.
- **`usar3D` deixou de existir**; no lugar entraram `temEspaco` (o caso conhece a posição de
  todos os nós — a mesma dupla de fontes de sempre: campo visual `maquete` do pacote ou o
  mapa espacial estático) e `tresDDisponivel` ("a maquete PODE subir"). Sem espaço, a grade
  2D de cartas segue sendo o fallback derradeiro. Preferência do jogador em chave nova de
  `localStorage` (`mortem-vista-da-mesa`); nenhuma chave existente foi tocada.
- **O chunk do three.js só desce se o jogador pedir a maquete.** O `qa-ui.mjs` passou a
  vigiar isto pela REDE (nenhuma requisição de `DioramaVila`/three numa sessão que fica na
  prancha) — antes o import era lazy, mas subia sempre.
- **Etiquetas: as mesmas, no mesmo lugar do documento.** A prancha reaproveita `RotuloNo`
  (HTML real, nunca `<text>`), com o mesmo verbo, custo, "— aqui —" e lembrete de visita, e o
  MESMO `aoAbrirNo`. Duas consequências registradas em código: (a) a ordem do DOM das
  etiquetas é a **ordem do hub**, não a de profundidade — dois nós podem partilhar prefixo
  ("Cottage nº 4" e "Cottage nº 4 — a busca") e quem vem primeiro tem de ser sempre o mesmo;
  (b) o cordão saiu do CSS da tag e virou traço de SVG, porque o arranjo pode empurrar a
  etiqueta para cima, para baixo ou para o lado da fachada.
- **Arranjo de etiquetas: anel, não desobstrutor.** `arrumarEtiquetas` (pura, em
  `src/logic/prancha_vila.js`) procura lugar em volta da fachada — primeiro sobe, depois
  desce, por fim anda de lado — contra as caixas MEDIDAS das etiquetas já postas, e nunca
  sai da folha. Foi preciso: a vila gerada é mais povoada e de nomes mais compridos que a do
  caso-escola, e a primeira versão (só degrau para cima, caixa estimada única) deixava dois
  nós um sobre o outro — o de baixo deixava de ser clicável.
- **Divergências deliberadas do desenho de referência (turno 2 do documento de frontend):**
  1. **O nome da vila não entra na cabeça da folha** ("BRIARSTONE" no desenho). Nome de vila
     pertence ao pacote da seed; cravá-lo acertaria um caso e erraria os outros trinta e um
     (`sistema-visual.md` §9). A folha diz "A VILA — prancha do perito".
  2. **O letreiro gravado na fachada não repete o rótulo do nó.** Sai do rótulo sem o artigo,
     em caixa-alta e reduzido à primeira palavra quando longo — e é **suprimido** quando
     conteria o rótulo de algum nó visível, porque o `qa-ui` (e o leitor de tela) alcançam os
     nós por texto e o letreiro roubaria o clique da etiqueta.
  3. **A régua "1H DE VILA" mede o menor percurso que ainda custa uma hora**, não a média: o
     custo do jogo é por GRUPO, não por distância, e a média deixaria a régua prometendo uma
     hora onde ela não vale.

### E2 — a hora vira tinta

- **Três alavancas, e só três** (`tintaDaHora` em `src/logic/prancha_vila.js`): a densidade da
  hachura do céu (rala → densa → traço em azul-tinta), um véu retangular em `mix-blend-mode:
  multiply` sobre o quadro (nada → sépia .16 → frio .34) e as janelas em âmbar. A hora troca
  ATRIBUTOS; a figura da vila é a mesma a qualquer hora. Zero frame, zero rAF, zero transição
  por tick — e por isso `prefers-reduced-motion` não muda a leitura da hora: a hora é estado,
  não animação.
- **O acendimento não ganhou dono novo.** `janelaAcesa`/`chamineFumega` continuam em
  `src/data/mapa_espacial.js`, onde já eram funções puras consumidas pelo diorama; a prancha
  passou a consumi-las de lá. A OS mandava extrair para `src/logic/` **se** morassem dentro
  de um componente 3D — não moravam, e mudá-las de pasta só produziria churn em `Predio.jsx`,
  `GuardaDelegacia.jsx` e `mapa_espacial.js` sem ganhar dono nenhum. O que era duplicável (o
  arranjo dos vãos da fachada) virou uma fonte só: `vaosDaFachada`.
- **A hora diz INFORMAÇÃO, não só clima — mas só o que o dado sustenta.** O jogo não tem
  horário de funcionamento: nenhum nó fecha pelo relógio (o relógio só anda ao viajar, e a
  porta abre a qualquer hora). Inventar "fecha às 21h" seria inventar mecânica na etiqueta.
  O que existe é o lampião: da faixa da NOITE em diante, a etiqueta do nó sem janela acesa
  declara `sem luz a esta hora` — mesmo dado que acende o âmbar no desenho. Ao crepúsculo a
  nota fica calada de propósito (as janelas ainda estão acendendo uma a uma; anunciar "sem
  luz" na vila inteira seria ruído).
- **Contraste sob o véu:** as etiquetas são HTML ACIMA do SVG — o véu não as alcança, e a
  tinta sobre papel claro segue muito acima de AA. Os letreiros das fachadas, que são SVG,
  passaram a ser desenhados **depois** do véu, para não escurecerem com a hora.

### E3 — viagem e nó acrescido

- **O beat da viagem tem um dono só.** A duração vivia em dois lugares (0,7s no
  `PinoPerito`, 720ms na `Escrivaninha`) e podia divergir em silêncio; virou
  `src/logic/beat_viagem.js` (`BEAT_VIAGEM_S`/`BEAT_VIAGEM_MS`), lido pelo pino 3D, pela
  tacha da prancha e pelo hub que abre o overlay. O beat passou a valer para as duas
  vistas de mapa (antes só a maquete o tinha) e continua ausente na grade 2D de cartas,
  onde não há trajeto a percorrer.
- **Cortar o beat não muda nada, por construção.** `viajarPara` corre no clique; o beat só
  adia a abertura do local. O corte por toque (`.prancha-corta-beat`) limpa o timeout e
  abre o local no ato — o `qa-ui` compara o relógio durante o beat e depois do corte.
- **O beat DIZ o preço** (`src/logic/preco_da_viagem.js`, derivado, sem campo novo no save):
  relógio de → para, rigidez na chegada (o mesmo `estadoRigorPorIpm` do exame) e o perecível
  em risco — as observações ainda não colhidas cuja leitura muda de estado entre esta hora e
  a da chegada. É a única despesa do jogo; merecia uma linha lida.
- **O adendo a bico de pena** entra fora do quadro gravado quando o nó revelado fica FORA da
  vila (o quadro comprime e um fio pontilhado marca onde a estampa acaba). **Divergência
  deliberada do desenho:** o nó revelado DENTRO da vila (frequente nos casos gerados —
  vizinhança, busca, ofício do réu) fica no seu lugar geográfico, só que em tinta de pena.
  Mandá-lo para a margem porque foi descoberto mentiria a geografia, e a regra que importa —
  gravado × pena — continua legível no lugar certo.
- **Uma string, uma fonte** (`src/logic/desbloqueio.js`): o store escreve a linha do diário
  por `textoNovoDestino`, e a prancha reencontra a hora do carimbo pelo mesmo prefixo.
  Trocar a frase num lugar troca nos dois. Save antigo, sem a linha: o carimbo não sai (o
  adendo continua em pena vermelha).
- **Regra registrada** em `docs/kb-producao/ui-e-estetica.md` §8.

### E4 — o estreito e o fechamento da OS

- **No estreito (≤430px) a prancha é SÓ FIGURA.** Nenhuma etiqueta dentro do desenho: a
  navegação passa a ser uma **régua de fichas** (`ReguaNos.jsx`) abaixo da folha, com alvo
  de toque ≥44px, nome do nó, verbo, custo e as consequências da hora (a casa sem lampião;
  `novo · acrescido <hora>`). A ficha do nó atual traz "— aqui —", e a ORDEM é a do hub —
  reordenar por distância seria decidir a rota pelo jogador.
- **O desobstrutor de rótulos não deixou código morto.** A prancha nunca o usou: o arranjo
  dela é a função pura `arrumarEtiquetas`, e no estreito não há etiqueta a arrumar.
  `DesobstruirRotulos.jsx` continua onde sempre esteve, servindo apenas à maquete 3D — que
  ainda precisa dele e segue funcionando no celular onde há WebGL.
- **A folha no estreito perde a mobília** (régua gráfica, rosa dos ventos e a nota da hora
  na cabeça): a 150px de altura elas viravam ruído ilegível. A informação que elas davam
  está na régua de fichas, em corpo de leitura.
- **Fechamento:** `nota-gabinete-ilustrado.md` (prancha = padrão em desktop e celular),
  `kb-producao/ui-e-estetica.md` §8 (a regra do adendo), `MORTEM_CONTEXTO.md` e `README.md`
  ao estado entregue. Capturas do playtest curto do caso-escola em `docs/playtest-2026-07-24/`
  (desktop: as três horas, o beat de viagem e o adendo; celular: o crepúsculo com a régua).

---

## 25/07/2026 — OS-R1: Vocabulário e Postos

**Grafia martelada do nome do mestre: `Abbot`.** Confirmada pelo usuário no arranque.
A premissa do §0 da OS — "a KB do projeto regista `Abbott`" — não se confirmou: o único
acerto de `abbot` em `docs/` é *Abbotsbury*, topônimo citado como exemplo de *tithe barn*.
Não havia conflito; havia string a fixar.

**Decisões aplicadas:** D11, D23.
**Guardas verificadas:** G3, G4, G12 · GR1-1 a GR1-6.

**Arquivos tocados:** `src/data/abertura.js`, `localidades.js`, `dialogos.js`, `mapa.js`,
`aparencias.js`, `ecos_mestre.js`, `pacote_caso.js` · `src/store/jogo.js` ·
`src/components/Abertura.jsx`, `localidade/FalaDoLegista.jsx` · `scripts/lint-prosa.mjs`,
`qa-ui.mjs`, `demo-interferencia.mjs` · `docs/os-r1-mapa-ocorrencias.md` (novo),
`docs/biblia-de-vozes.md`, `docs/guia-de-estilo.md`,
`docs/kb-medicina-legal/inquerito-e-policia.md`.

**Gate:** lint-prosa nenhuma violação · qa.mjs CASO VÁLIDO · qa-ui.mjs UI VÁLIDA ·
build ✓.
**Gate específico (§5):** o banco saiu **byte a byte intacto** —
`sha256sum src/data/casos_gerados.js` = `600365a5…b5f93a7c2f`, igual ao commitado; e
`casos_indice.js` idem. O passo 1 do gate teve o sinal invertido (ver abaixo).

### As duas premissas do §2 que a árvore não confirmou

**1. As 257 ocorrências do banco não são vocabulário — são um id.** Contadas uma a uma,
as 257 são a mesma string: `"localidade": "delegacia"` (105), `"id": "delegacia"` (62),
chaves de volume e posição do diorama (32), e referências de id (58). Nenhuma é prosa.
Como o id está fora de escopo por decisão expressa do §1 (é propriedade da OS-R2), o banco
também está — e o passo 1 do gate deixou de ser "prova que a única diferença é o
vocabulário" para ser a prova mais forte disponível: `sha256sum` idêntico.

**2. O balde V de `src/gerador/` é vazio.** O vocabulário que o gerador *mostra* é
`constable` (1 644 ocorrências no banco, 364 capitalizadas), e a escolha está lavrada em
`inquerito-e-policia.md` §5 (decisão B: manter posto inglês) e reafirmada na
`biblia-de-vozes.md`: "Delegado" é a **glosa vernácula**. A D11 troca a glosa; não toca no
posto inglês. A Fase 2 não tinha o que renomear.

### Quatro baldes, não três

A OS previa V (visível), T (técnico) e H (histórico). A árvore exigiu um quarto: **C
(comentário)**, que acompanha o balde V quando descreve texto visível e fica intacto quando
descreve id do balde T. Mapa completo em `docs/os-r1-mapa-ocorrencias.md`.

**Balde T preservado, com justificação:** o id `delegacia` e as ~91 referências a ele
(OS-R2); a chave `delegado_wycliffe` (esquema, lido por `papeis.js` e `aparencias.js`);
`GuardaDelegacia.jsx` (nome de arquivo, GR1-2); `SOBRENOMES_DELEGADO` e `delegaciaLoc`
(variáveis); e — o mais perigoso — o **sal de hash** `` `${sal}|delegado` `` em
`pacote_gerado.js:2233`, cuja troca mudaria o sobrenome sorteado do policial em todas as
seeds do banco sem que uma linha de vocabulário mudasse. Falso positivo preservado:
`veredicto.js:41`, onde "Delegado" é particípio do verbo *delegar*.

### Divergências assumidas

1. **`constable` (gerado) × `condestável` (caso-escola).** Divergência real de superfície
   entre as duas prosas do mesmo build. Unificar reescreveria ~2 000 strings de um produto
   de 2,3 MiB sob guarda da G12. **Aberto para a OS-R9** (OS-R0 §8).
2. **A D11 contraria a recomendação B da própria KB.** Registrada em
   `inquerito-e-policia.md` §5, com a fundamentação histórica. Ver o achado abaixo.

### Achado do pipeline `revisar-prosa` que o usuário precisa decidir

Os dois revisores convergiram, independentemente, sobre a D11. O `perito-forense` trouxe
prova de época: em português, *condestável* nomeou o **Condestável do Reino** (1382, a
segunda figura da hierarquia militar depois do rei) e depois o **chefe de artilharia**; o
**Caldas Aulete**, dicionário contemporâneo a 1893, regista cinco acepções e **nenhuma
policial**. O uso policial é calco moderno do inglês norte-americano. O efeito é **inflação
de patente** sobre um homem que a KB define como "o homem de ronda; a base da pirâmide" —
e a prosa passa a ter duas glosas portuguesas para a mesma patente (*condestável* para
Wycliffe, *guarda* para Tobin), desenhando uma escada que o posto de um homem não tinha.

A D11 está **martelada e fechada** (OS-R0 §2); reabri-la exige ata própria, e é decisão do
usuário, não do agente (`CLAUDE.md`). **Não foi reaberta.** O registro da divergência
entrou na KB e na bíblia para que a prosa não contradiga em silêncio a sua fonte.

### Correções aplicadas a partir do parecer

`editor-critico`: colisão de homógrafo criada pela substituição (`a este posto` ao lado de
`homem posto fora da sua profundidade` → `homem que nunca me deu trabalho`); "o expediente
é a sala" (o expediente é o horário, não o cômodo → `O posto de Briarstone é a sala da
frente`); **"os autos"** — vocabulário do foro brasileiro, exatamente o registro que a D11
existe para expurgar, e factualmente errado para o que está nas gavetas (→ `o arquivo da
vila`); eco de `veio + infinitivo` em frases seguidas; repetição de "gavetas".
`perito-forense` confirmou o achado dos autos por via independente.

**O erro de classificação corrigido:** a primeira versão do mapa arquivou
`docs/biblia-de-vozes.md` no balde H e adiou-a para a OS-R8. Errado — a GR1-3 protege
`playtest/`, `historico-decisoes.md` e relatórios datados, e a bíblia não é histórico: é a
**norma viva** que o `escritor-prosa` e o `editor-critico` obedecem em toda OS seguinte.
Deixá-la velha faria a próxima OS reintroduzir `Delegado` e `Alcott` a partir da própria
norma. Entrou nesta OS, junto com `guia-de-estilo.md` §1.

### Aberto para as OS seguintes

- **OS-R2:** o id de localidade `delegacia` → `casa_condestavel`, com o remapeamento do
  campo `localidade` das 7 cartas e das ~91 referências.
- **OS-R3:** a carta de Wycliffe (`abertura.js:59-60`) — o `perito-forense` acusa que ela
  assume autoridade que um constable não tinha ("Briarstone paga os seus honorários e, se o
  caso assim pedir, o seu silêncio"): quem autoriza e remunera o perito é o **coroner**
  (Medical Witnesses Act 1836), e o constable é *coroner's officer*, não contratante. Acusa
  também forma epistolar moderna (o vocativo com travessão e a subscrição nua, onde a época
  pedia "Senhor —" e "Sou, senhor, seu criado obediente"). A D12 já põe o coroner em campo.
- **OS-R8 (passe editorial):** "lavrar termo" e "lavrar queixa" são instrumentos do direito
  luso-brasileiro — o constable inglês **anota no livro de ocorrências**, e o queixoso jura
  *information* perante o magistrado, de onde sai o *summons*. Atinge `abertura.js:123`,
  `dialogos.js:420,426,433` e o carimbo de `dep_queixa_grey` em `cartas.js:418-423`. É
  pré-existente à OS-R1, não introduzido por ela. Também: a cena da casa do condestável tem
  três frases de efeito contra o teto de uma (guia §3); e `vocabulario-de-epoca.md:63` e
  `demografia-e-sociedade.md:59` ainda listam "delegado".
- **OS de apresentação:** `FundoCena.jsx:83-95` desenha um armário de arquivo alto de três
  fileiras — a ilustração exata do antigo "Wycliffe abre **os armários**". A prosa agora diz
  cômoda de cozinha na sala da frente de uma casa. É a camada em que a D11 gasta o dinheiro
  dela.
- **Sem dono, e urgente:** ver a seção seguinte.

### O banco commitado está dessincronizado do gerador (fora do escopo, não corrigido)

O gate de determinismo apanhou-o no primeiro passo. A geração **é** determinística (dois
`sha256sum` consecutivos iguais), mas `node scripts/gerar-casos.mjs` hoje produz um banco
diferente do embarcado:

| | `CASOS_LUTA` |
|---|---|
| Banco commitado | 23, 45, 51, 59, 85, **99, 108, 119, 122, 131** |
| Gerador de hoje | 23, 45, 51, 59, 85, **3, 49, 54, 76, 81** |

27 577 linhas de diferença; os 20 casos de `comarca` são idênticos. A divergência foi datada
por bissecção: regerar na árvore de `238f4fb` reproduz o banco commitado byte a byte
(`600365a5…`); regerar em `HEAD` não (`b96f9caf…`). O responsável é **`bde4290`** (Revisão do
repositório — Lote E, 24/07), que unificou a coreografia dos quatro perfis em
`scripts/lib/perfis.mjs` e, ao fazê-lo, **corrigiu** a escolha do nexo do Metódico: passou a
exigir o vestígio *instrumental* (`tipoVestigio` casa com a arma **e** pertence ao réu) em vez
do primeiro vestígio do réu. O conserto é correto e está documentado no cabeçalho do próprio
arquivo; o que faltou foi rodar `gerar-casos.mjs`. A mensagem daquele commit afirma "Seleção
do gerador conferida: as mesmas sementes de antes do refactor" — verdadeiro para o pool
`comarca`, falso para o pool `luta`.

**Não foi regerado aqui.** Enterrar uma mudança de 27 mil linhas dentro de uma OS de
vocabulário viola a GR1-4, e a escolha — regerar e revalidar o pool `luta` novo, ou concluir
que o conserto do nexo mudou o critério de embarque mais do que se pretendia — é de desenho,
não de execução. **Bloqueia a OS-R2 na prática:** o gate global roda no fecho de toda OS, e
esta armadilha vai reaparecer em todas.

### Adendo à ata — a D11 revista no mesmo dia

O parecer do `perito-forense` derrubou `condestável`, e o usuário decidiu com o parecer
à frente: a glosa passa a **`guarda`**, e o lugar a **`o posto`** — `rotuloMesa: 'O Posto
do Guarda'`. Não é reabertura arbitrária da D11: é a mesma decisão, corrigida no ponto em
que a KB do projeto a contradizia, e a nova escolha é a **Opção A da própria tabela de
tradução** (`inquerito-e-policia.md` §5), não uma terceira via.

**Por que `posto` e não `a casa do guarda`.** A D11 fixara «a casa do condestável», e o
decalque seria «a casa do guarda» — mas em PT-BR isso lê-se como casa de porteiro ou de
guarda-florestal. `posto` é o termo que a KB e a bíblia já usavam («destacado no posto de
um homem de Briarstone») e o que o caso gerado já diz («O Posto do Constable»), o que
reduz a divergência entre as duas prosas em vez de aumentá-la. A materialidade que a D11
exigia — a sala da frente de uma casa, não uma repartição — fica na prosa, que é onde ela
importa: «O posto de Briarstone é a sala da frente da casa do guarda.»

**A colisão que a troca criou, e como se resolveu.** Com Wycliffe a chamar-se «guarda», a
palavra passou a chocar com «pus um guarda à porta», «um guarda moço» e «o guarda Tobin».
`guarda` passa a nomear **só quem tem a patente** (Wycliffe e Tobin); o homem posto à porta
da relojoaria é «um homem» (`abertura.js:60,75,84`, `localidades.js:28`). Isto também
desfaz a escada de patente falsa que o `perito-forense` acusava.

**Fica de pé, e é da OS-R4:** um posto de vila é de **um homem só**, e Briarstone tem
Wycliffe *e* Tobin. O correto de época seria o constable do beat vizinho ou um *special
constable* juramentado às pressas. É anterior a esta OS — a hierarquia falsa apenas a
mascarava.

### Achados do `fiscal-continuidade` (zero bloqueantes)

- **O letreiro da fachada.** `PranchaVila.jsx` grava na fachada a primeira palavra de
  rótulos com mais de 12 caracteres. Com «A Casa do Condestável» a tabuleta passou a ler
  **`CASA`** — a única fachada da vila sem significado, onde antes lia `DELEGACIA`.
  Resolvido pela escolha de `O Posto do Guarda`, que grava **`POSTO`**; nenhuma linha de
  código mudou.
- **`store/jogo.js:72` estava mal classificado por mim.** A ação `telegrafo` é acoplada
  pelo gerador (`pacote_gerado.js:2461`) e a localidade do caso-escola tem
  `acoesEspeciais: []` — a string **só renderiza em caso gerado**, onde o lugar é «O Posto
  do Constable». Passou a dizer «no posto do constable», com o vocabulário do gerador, e
  não o do caso-escola. Mesma correção no cordel de `demo-interferencia.mjs`.
- **Conferido e limpo:** `Alcott` = zero em `src/**` e `scripts/**`, inclusive no banco;
  os resíduos de `delegad|delegaci` são todos balde T ou C, um a um; o multiconjunto de
  `[[id]]`, `{g:…}` e `{detective.*}` é **byte a byte idêntico** ao estado pré-OS (32
  marcadores, 0 órfãos, 14 flexões com dois lados distintos); o roster do lint decapita
  «Guarda» com acento e **não** admite a palavra como nome próprio (`vocativo_repetido=0`);
  e as horas, dias, idades e distâncias batem com `seed.js` e `mapa.js`.
- **Aberto:** `cartas.js:369` (cabeçalho de seção `// A DELEGACIA`) sai com o id, na OS-R2.

---

## 25/07/2026 — OS-R2: Cena Única

**Decisões aplicadas:** D11 (parte técnica, na redação revista de 25/07), ponto 8 da revisão
do utilizador.
**Guardas verificadas:** G1, G4, G10, G11, G12 · GR2-1 a GR2-6.
**Arquivos tocados:** `src/data/localidades.js` · `src/data/cartas.js` · `src/data/mapa.js` ·
`src/data/mapa_espacial.js` · `src/data/planta_relojoaria.js` · `src/data/pacote_caso.js` ·
`src/data/aparencias.js` · `src/store/jogo.js` · `src/components/Planta.jsx` ·
`src/components/PlantaRelojoaria.jsx` · `src/components/EventoLocalidade.jsx` ·
`src/components/FundoCena.jsx` · `src/components/localidade/FalaDoLegista.jsx` ·
`src/components/diorama/DioramaVila.jsx` · `scripts/qa.mjs` · `scripts/qa-ui.mjs` ·
`scripts/lint-prosa.mjs`.
**Gate:** lint-prosa nenhuma violação · qa.mjs CASO VÁLIDO · qa-ui.mjs UI VÁLIDA · build limpo.
**Gate específico:** as três provas do §4, abaixo.
**Divergências assumidas:** quatro, abaixo.
**Aberto para a OS seguinte:** ao fim.

### Os dois martelos do arranque

**O id do posto: `posto_do_guarda`, não `casa_condestavel`.** A OS-R2 §1 fora escrita antes
da revisão da D11, quando o policial ainda era `condestável`. Escrever hoje um id que diz
`condestavel` seria pôr na topologia a palavra que a prosa acabara de perder. O utilizador
martelou `posto_do_guarda`, que é o id que alcança o que o jogador lê («O Posto do Guarda»,
guarda Lemuel Wycliffe).

**A vitrine fica na `loja`** — a opção (a) do §5, recomendada pelo documento e confirmada
pelo utilizador. **A ressalva do §5 materializou-se, e custa um clique:** para chegar a
`ev_vitrine` o perito faz agora mesa → relojoaria → *a loja* → abrir o ponto (três cliques),
onde antes fazia mesa → a cena → abrir o ponto (dois). Fica registado porque o §5 mandava
reconsiderar se isso acontecesse; o martelo do utilizador manteve (a) com o custo à vista, e
a troca é a que o documento previa: a loja da frente e o escritório revirado dos fundos
deixaram de ser o mesmo cômodo aos olhos do jogador. O clique não é uma hora — dentro do
prédio o relógio continua congelado, e o QA prova-o (13h00 depois de varrer os cinco cômodos).

### A prova 3, e a escolha que o arranque mandava registar

O prompt de arranque avisava que a prova 3 falharia como escrita, porque o cabeçalho de
secção `// ===================== A DELEGACIA =====================` (`cartas.js:386`) nomeia
o lugar que mudou de nome. **Não se relaxou a prova.** O cabeçalho saiu num commit à parte,
depois de a prova correr — o que a mantém como está escrita na OS, literal:

```
git diff src/data/cartas.js | grep '^[+-]' | grep -v '^[+-][+-]' \
  | grep -v "localidade:\|subLocal:"
→ (vazio)   OK: só topologia
```

`41` linhas acrescidas, `24` removidas: as 24 trocas de `localidade` e as 17 linhas novas de
`subLocal`. Nem um `texto`, nem uma `tag`, nem um `vozMestre`.

**Prova 1 (contagem):** 35 cartas antes, 35 depois, e o multiconjunto de ids é idêntico —
`diff` vazio. *(GR2-4)*
**Prova 2 (órfãs):** a asserção de alcançabilidade entrou no `qa.mjs` como a OS mandava —
«GR2-1 (cena única): toda carta resolve para localidade e sub-local que existem e se
alcançam». Ela verifica os dois sentidos: nenhuma carta aponta para lugar inexistente, e
nenhum sub-local **com carta** fica sem sala clicável na planta. *(GR2-1)*
**Extra, não pedido mas barato:** a prosa e os gestos de `localidades.js` foram comparados
com o estado pré-OS pelo conteúdo, não pelo diff — o conjunto ordenado de parágrafos e de
gestos é **byte a byte idêntico**. Fundir mexeu no continente, não no conteúdo. *(GR2-3, GR2-5)*

### O que o relógio disse

O melhor argumento de que a fusão não mexeu no jogo: os quatro perfis do `qa.mjs` fecham em
**17h00 · 18h00 · 14h00 · 13h00**, os mesmos minutos do estado pré-OS (medidos num worktree
de `01d67dc`), com os mesmos quatro desfechos. Andar entre corpo, cena e oficina custava 0h
como três nós do grupo `relojoaria`; custa 0h como três sub-locais do mesmo nó. O banco
gerado saiu fora do diff — `sha256` de `casos_gerados.js` intacto em `b96f9caf…b05a760b2`,
e `casos_indice.js` em `1fafae5c…b4038e29`. *(G12)*

### Divergências assumidas

1. **A prosa do ponto da vitrine lê-se de dentro da loja.** `pt_cena_vitrine` abre com «A loja
   da frente fica para além do vão do escritório» — escrita para quem estava no escritório, e
   agora lida por quem já está na loja. Corrigi-la seria escrever prosa nova, que a OS proíbe
   (§1, fora de escopo). **Fica para o passe editorial, OS-R8.**
2. **A relojoaria não tem anfitrião único.** `PERSONAGEM_POR_LOCALIDADE` dava a Davey Tull o
   papel de quem recebia o perito na oficina; a oficina virou sub-local, e o prédio inteiro
   não tem um dono de porta. O lembrete de visita do prédio conta as observações e cala o
   nome. Dar-lhe um anfitrião seria mentir sobre um prédio de cinco cômodos — o QA passou a
   provar as duas formas do lembrete (com nome, na estalagem; só contagem, na relojoaria).
3. **`porta_beco` fica declarado e sem sala.** A OS §1 lista o sub-local, e ele está em
   `localidades.js`. Não ganhou cômodo clicável na planta porque entrar nele mostraria uma
   sala vazia, e enchê-la exigiria prosa nova. A soleira continua desenhada na planta como o
   arco do batente. **Aberto para a OS-R8 ou para o pivô visual.**
4. **`ev_telegrama` continua a nascer em `delegacia`.** É mecânica de caso gerado (só existe
   com `telegrama` no pacote), e os gerados conservam o id antigo. O caso-escola não
   telegrafa. Renomear ali partiria os gerados sem ganho.

### O que mudou de contrato, e onde

- **`qa-ui.mjs`:** os pontos que clicavam `O Corpo`, `A Cena do Crime` e `A Oficina` clicam
  agora `A Relojoaria` e andam pela planta por `[data-alvo="<sub-local>"]` — `corpo`,
  `escritorio`, `loja`, `copa`, `oficina`. O alvo `[data-alvo="cena"]` da rota flat passou a
  `escritorio`. `O Posto do Guarda` não mudou de string (a OS-R1 já a tinha fixado).
- **`lint-prosa.mjs:512`:** `montarRosterDeNomes()` procurava a localidade pelo id
  `delegacia` para decapitar «Guarda» do subtítulo. Passou a `posto_do_guarda`. Era o ponto
  que o arranque marcou como o mais fácil de esquecer; se caísse, `vocativo_repetido` passaria
  a acusar falas legítimas — e não caiu (`vocativo_repetido=0`).
- **`Planta.jsx`:** um alvo pode agora declarar `sub` além de `no`. Com `sub`, o clique troca
  de sub-local (viajando antes, se o perito estiver noutro nó — é assim que se volta da saleta
  ao corpo); sem `sub`, é a viagem entre nós de sempre. O modo ponto dos casos gerados não foi
  tocado.
- **`parametrosCena.noChegada`:** o nó onde o perito põe o pé passou a sair do pacote. O
  caso-escola declara `relojoaria`; os gerados não declaram nada e continuam a chegar ao seu
  nó `cena`, que é o default.

### A fachada, conferida como o arranque pedia

`letreiroDaFachada` grava `RELOJOARIA` (10 caracteres, dentro da janela 3–14) para o rótulo
«A Relojoaria» — martelo do utilizador, escolhido também por isto. As fachadas de `CORPO`,
`CENA` e `OFICINA` desapareceram com os nós, como o arranque previu: onde havia três prédios
de maquete para o mesmo endereço da High Street, há um.

### Aberto para a OS seguinte

- **OS-R3 (abertura)** por escrever — a OS-R0 §4 manda escrevê-la contra a árvore real, que
  esta OS acabou de mudar.
- `interrogatorio_silas` como localidade anómala (só Silas tem uma) — **OS-R6**. Registada e
  não tocada, como a §1 mandava.
- A torre de S. Miguel por criar — **OS-R4**, junto com o posto de um homem só (Wycliffe *e*
  Tobin).
- A prosa da vitrine e a sala da `porta_beco` — **OS-R8**.
- `guarda` × `constable` (o caso gerado continua a dizer *constable*) — **OS-R9**.
- `FundoCena.jsx` desenha um armário de arquivo onde a prosa diz cômoda — camada de
  apresentação.

---

## 25/07/2026 — OS-R3: A Abertura

**Decisões aplicadas:** D12 (coroner, fora de cena), D13 (abertura testemunhal como
molde), D21 (Bramwell Foy), D23 (Abbot), D25 (Harlan não assina uma grande).
**Guardas verificadas:** G2, G3, G4, G8, G10, G11, G12 · GR3-1 a GR3-6.
**Arquivos tocados:** `src/data/abertura.js` · `src/components/Abertura.jsx` ·
`docs/biblia-de-vozes.md` · `scripts/qa-ui.mjs` · `docs/os-r3-abertura.md` (nova).
**Gate:** lint-prosa nenhuma violação · qa.mjs CASO VÁLIDO · qa-ui.mjs UI VÁLIDA ·
build limpo.
**Gate específico:** pipeline `revisar-prosa` com os três revisores — **reprovou na
primeira passada com três bloqueantes, um por revisor**; todos corrigidos, ver abaixo.
**Divergências assumidas e aberto:** ao fim.

### Os três martelos

**(a) O cold open é pelos olhos de Silas Crane** — quem achou o corpo, e o réu. O
utilizador escolheu a opção que a OS §5 classificava como a mais perigosa e a mais forte.
A G3 passou a ser a guarda crítica, e o teste de cada gesto foi o do §3.1: se admite «este
homem está a fingir», tem de admitir igualmente «este homem está em choque».

**(b) O impresso do coroner nomeia só o Dr. Abbot.** Harlan atravessa o caso com uma
autorização que não tem o seu nome — o que dá à ordem «NAO ASSINE NADA» o peso que ela
nunca teve, e arma a D25.

**(c) O prazo do inquérito é ficção.** Segunda-feira, 16 de outubro, às dez, no
Wheatsheaf. Nenhuma regra o lê; os quatro perfis fecham nas mesmas horas de sempre.

### O gate de prosa, que é o gate desta OS

Três revisores, três bloqueantes — e cada um apanhou o seu, o que é o argumento mais
forte a favor de correr os três em vez de um.

**Bloqueante do `editor-critico` (G3).** No cold open, Silas mandava o aprendiz chamar
Wycliffe «e que traga um homem consigo». Falha o teste das duas leituras: um homem em
choque diz «corra, chame o guarda», não faz gestão de efetivo. A cláusula ainda *inventava*
o homem à porta que a carta de Wycliffe depois reivindica, e caía na posição de acento do
parágrafo — onde o craft de mistério proíbe pôr pista. Sete dos oito gestos passaram; este
não. **Cortado.** O mesmo parecer desmentiu a contagem de frases de efeito (eram duas, não
uma) e mostrou que a que eu julgava melhor — «um tempo que o rapaz, depois, não soube
medir» — era o único verbo no passado de um bloco em presente e ancorava o foco em **Davey
Tull**, isto é, na opção de POV que o utilizador não escolheu. **Cortada.**

**Bloqueante do `perito-forense` (GR3-4).** O impresso citava «o Ato de 1836». O Medical
Witnesses Act 1836 foi **revogado para Inglaterra e Gales pelo próprio Coroners Act 1887**,
que reeditou a matéria nas s. 21 (ordem de exame) e s. 22 (honorários, mantido o teto de
£2 2s). Em 1893, papelaria de coroner — reimpressa por causa da consolidação de 1887 — não
cita 1836. Agravante: a minha própria OS §3.2 exigia «sob o Coroners Act 1887», e a lei não
aparecia no arquivo. **Corrigido**, com a qualificação estatutária junto («praticante
legalmente habilitado e inscrito»), que é justamente a que exclui Harlan e faz o papel
dizer, sem uma linha de aula, por que o nome não pode ser o do assistente.

**Bloqueante do `fiscal-continuidade` (G8).** O telegrama de Abbot afirmava «O CORONER JA
ORDENOU O EXAME EM MEU NOME» — um documento que nenhum canal lhe entregara: a abertura só
tinha dois canais para fora de Briarstone (o fio até o coroner e o cavalo até Caulfield), e
nenhum alcançava Abbot, a quatro condados. **Corrigido nas duas pontas:** o telegrama passa
a prever («HA DE ORDENAR»), que é o que um homem que conhece a máquina diria, e Wycliffe
abre o canal que faltava — telegrafou também ao médico da lista, e foi a resposta dele que
disse onde parava o assistente. Isso fecha de quebra o furo de por que o cavaleiro acaba na
pensão da Sra. Potts.

**Achados altos aplicados** (doze, entre os três pareceres). Os que valem nome:

- **A voz da Sra. Potts.** Eu pusera na boca da senhoria as palavras do narrador («o
  formulário», «o envelope») e apagara o «disse o rapaz» que a bíblia dá como marca dela —
  e, sem ele, ela declarava com autoridade o remetente de um telegrama dobrado que não
  leu. Restaurado o ouvir-dizer e o léxico dela.
- **O verbete de Foy contradizia o texto que autoriza.** Eu prescrevera «terceira pessoa
  de ofício» e ilustrara com primeira. O impresso está historicamente certo (o mandado do
  coroner fala em primeira pessoa); o verbete é que estava errado, e quem escrevesse a
  próxima peça de Foy pela letra dele escreveria contra o cânone. Corrigido na bíblia,
  junto com a nota da lei de 1887.
- **A batida do martelo (b) aparecia cinco vezes em cinco telas.** Reduzida ao pensamento
  do passo da ordem, que é o único lugar onde a informação vira consequência pessoal.
- **Autoridade residual por outra porta.** A frase que a OS-R1 acusara saíra sem resíduo,
  mas Wycliffe voltava a consultar a lista, eleger o médico e convocá-lo. Agora quem o
  nomeia da lista é o coroner; a Wycliffe toca lavrar a ordem no impresso e pô-la a
  caminho, que é o ofício de *coroner's officer*.
- **A cópia telegráfica não é a autorização.** Instrumentos de coroner eram escritos,
  assinados e servidos pelo officer; um transcrito de balcão não traz assinatura nem é
  título para reclamar os dois guinéus. O papel passou a dizer-se cópia, e o original vem
  por mão do coroner — o que aumenta a tensão em vez de a gastar.
- **A hora de abrir a loja.** O cold open punha Silas a abrir a relojoaria às nove e
  vinte; o próprio Silas, em `dialogos.js:153`, diz que abre a loja, tira as tábuas e
  acende o fogo da bancada, e só depois acha o corpo. O cold open contradizia o depoimento
  do seu próprio protagonista. Reescrito para bater com ele: Silas abre à hora de sempre,
  o Sr. Arthurs não desce, e às nove e vinte o oficial deixa a bancada e vai ao escritório.
  Resolveu junto a contradição das tábuas da vitrine (que ficavam no vão às 9h20 e não
  podiam estar lá às 13h, quando o perito vê o vidro com a cortina corrida por dentro).
- **A vela e o castiçal.** A cena de Caulfield vinha de quando a abertura não tinha hora;
  o cold open datou-a em meio da manhã de sábado, e senhoria não atravessa a casa de
  castiçal aceso ao meio-dia. A Sra. Potts entra agora a limpar as mãos ao avental.

### Divergências assumidas

1. **A KB está incompleta e não foi emendada.** `kb-medicina-legal/inquerito-e-policia.md`
   §1 imputa o poder de ordenar o exame e o honorário ao Ato de 1836 sem registar a
   revogação/reedição pelo Coroners Act 1887. A prosa foi corrigida; a KB não, porque o
   `CLAUDE.md` põe divergência de KB como decisão do utilizador. **A emenda está redigida
   e à espera de martelo.**
2. **Falta lastro de KB para o «NAO ASSINE NADA».** *Covering* — o médico registado que
   empresta o nome a quem o não é — era conduta infame perante o General Medical Council,
   com aviso próprio nos anos 1890. É a base histórica direta da D25 e do clímax, e não
   está em KB nenhuma. Proposta de verbete registada, não escrita.
3. **O glossário não tem verbete de «coroner».** A tabela de tradução da KB (§5) manda
   grifar e glosar na primeira ocorrência. O impresso glosa-o funcionalmente («sendo meu
   ofício inquirir dela»), o que resolve a compreensão, mas não há verbete.
4. **O prazo do inquérito não tem consequência mecânica.** É o martelo (c), e é
   deliberado. Fazer o relógio bater nele — o que acontece a quem chega ao Wheatsheaf de
   mãos vazias — é mecânica nova e precisa de ordem expressa.

### Aberto para a OS seguinte

- **OS-R4** (elenco e livros): a torre de S. Miguel, Amos Kell, a Sra. Wick, o
  estalajadeiro; e o posto de um homem só — Briarstone tem Wycliffe *e* Tobin.
- **OS-R8** (passe editorial): «lavrar queixa» em `abertura.js`, ao lado do que esta OS
  mexeu e propositadamente não tocou; a prosa do ponto da vitrine, que se lê de dentro da
  loja desde a OS-R2; e a varredura de Davey na oficina, que contradiz o «nem uma cadeira
  saiu do lugar» de Wycliffe agora que a oficina é sub-local do mesmo nó.
- **OS-R9** (o gerador herda os padrões): os casos gerados ainda trazem **a mesma
  autoridade indevida que esta OS extirpou do caso-escola** — «os que respondem pela vila
  pagam os seus honorários» (`src/gerador/pacote_gerado.js`) — e o vocativo epistolar
  moderno, sem subscrição. Registado e não tocado: o banco ficou fora do diff.
- Tirar o «ontem» da amostra de Silas na bíblia de vozes (o interrogatório corre no mesmo
  sábado; a prosa embarcada já está certa, a amostra é que não).

---

## 25/07/2026 — OS-R4: Elenco e Livros

**Decisões aplicadas:** D2 (onde mora o Livro II), D6 (o móbil de Davey, sob a guarda de
menoridade), D15, D16 (a forma da cumplicidade — o fio de coação na Sra. Wick), D19 (a
cifra), D21 (Amos Kell), D22 (onde arde o Livro I).
**Guardas verificadas:** G1, G2, G4, G6, G7, G10, G11, G12 · GR4-1 a GR4-7.
**Arquivos tocados:** `src/data/cartas.js` · `src/data/localidades.js` ·
`src/data/dialogos.js` · `src/data/glossario.js` · `src/data/mapa.js` ·
`src/data/mapa_espacial.js` · `src/data/aparencias.js` · `src/logic/acusacao.js` ·
`src/components/EventoLocalidade.jsx` · `scripts/qa.mjs` · `scripts/qa-ui.mjs` ·
`docs/biblia-de-vozes.md` · `docs/kb-medicina-legal/inquerito-e-policia.md`.
**Gate:** lint-prosa nenhuma violação · qa.mjs CASO VÁLIDO · qa-ui.mjs UI VÁLIDA ·
build limpo.
**Gate específico:** os cinco itens do §7, abaixo.
**Divergências assumidas e aberto:** ao fim.

### Os três martelos

**(a) A cifra vive na cuvette do relógio do morto** — a opção recomendada do §5. É a
segunda camada de um objeto que o jogador já tem na mão desde o exame do corpo, e custa
uma carta e nenhuma localidade. O parecer do `perito-forense` acrescentou o que a torna
boa de verdade: a legenda particular esconde-se **entre as de fábrica** (`15 RUBIS`,
`ANCRE LIGNE DROITE`), e a um leigo — ou a quem revistou o corpo — lê-se como mais jargão
de relojoaria. O corte fresco brilha contra a pátina dos outros sulcos, e isso o perito de
1893 pode dizer.

**(b) Tobin é o constable da ronda vizinha (Caulfield)**, de passagem pela High Street às
oito. É a única das três opções que não obriga a mexer em `dep_visto_vivo` (G4), e tem
nome de ofício: **conference point**, o ponto e a hora em que dois beats se conferem. A KB
foi emendada com o instituto, as fontes e a ressalva de época (o ponto fixo era criticado
justamente por ser previsível — as oito de Tobin são o ponto marcado daquela ronda, não um
relógio infalível da vila).

**(c) Amos Kell bebe, e a vila sabe.** O descrédito entra pela boca dele («O guarda
perguntou-me primeiro quanto eu tinha bebido») e pelo estado do registro («e não
escreveu») — o narrador não avalia em lugar nenhum.

### O orçamento de cartas — o dado que a OS seguinte lê primeiro

| | |
|---|---|
| Catálogo antes | 35 |
| Catálogo depois | **39** |
| Em jogo (com `ev_algor`, de runtime) | **40** |
| Teto (G11) | 46 |
| **Livre para a R5 e a R6** | **6** |

As quatro cartas: `ev_cinza_livro` (o Livro I, na grelha do escritório), `ev_cuvette` (a
cifra), `dep_sineiro_beco` (o veraz sem crédito) e `ev_livro_ii` (o caderno de pesos, na
câmara dos sinos). **Todas `comportamental`** — a G1 não admite acréscimo em `temporal`
nem em `causal`, e o `qa.mjs` passou a provar isso por asserção (GR4-2 congela o conjunto
das oito cartas da cadeia física). A Sra. Wick custou **zero**: a carta que já existia
ganhou o que lhe faltava.

### As horas dos quatro perfis

| Perfil | Antes | Depois | Desfecho |
|---|---|---|---|
| Metódico | 17h00 | **18h00** | Vitória Absoluta |
| Apressado | 18h00 | 18h00 | Erro Judiciário |
| Intuitivo | 14h00 | 14h00 | Impunidade |
| Pericial desatento | 13h00 | 13h00 | Sucesso com Gafes |

Só o Metódico andou, e andou exatamente a hora que a torre custa — ela é nó da vila como
qualquer outro. Os outros três não sobem lá. Os quatro desfechos de pé.

### O que a cifra abre não é o nó

A torre **nasce aberta** no mapa: a G10 manda que Amos seja sempre alcançável, e um nó
trancado atrás de uma carta não o seria. O que a cifra abre é um **parágrafo de prosa
condicional** (`prosaCondicional`, campo que a localidade já tinha e que ninguém usava),
com `requerCartas: ['ev_cuvette']`. Sem a cifra o perito sobe, conta seis sinos e desce de
mãos vazias; com ela entra o parágrafo da câmara dos sinos, e com ele o marcador do Livro
II. É camada narrativa pura — a condição lê ids de carta registrada, o motor não a lê.
**Efeito colateral consertado no mesmo lote:** o contador de esgotamento do lugar não
contava a prosa condicional, e um lugar anunciava-se «esgotado» com uma carta ainda por
colher.

### O veraz sem crédito, provado por asserção

A G6 pedia que as cartas de Amos fossem recusadas «como nexo e como álibi», e que isso se
provasse no `qa.mjs`, «não a olho». As tags dele carregam `insuficiente: true`, e
`acusacao.js` ganhou `ehInsuficiente`: a carta marcada não sustenta âncora nenhuma nem
entra como **fato** de refutação (continua podendo ser o alvo refutado — é alegação como
outra qualquer). A prova corre em dois tempos, porque um só não bastaria:

1. **End-to-end:** a acusação apoiada só no sineiro sai `impunidade`, com `sem_nexo` nas
   falhas e o paradeiro do réu de pé.
2. **Isolando a marca:** um gêmeo de controle com forma de vestígio do réu é **aceite** sem
   a marca e **recusado** com ela. Quem recusa é a marca, não o domínio — é isto que faz a
   falha ser pelo código próprio da insuficiência, e não por acaso.

Nota de desenho, para quem vier depois: ligar a carta dele a uma âncora **não é gafe** (não
custa a Vitória Absoluta), é inércia. A lição pune quem se apoia nela, não quem a recolhe.

### O gate de prosa, que é o gate desta OS

Três revisores; e outra vez cada um apanhou o que os outros dois não viram.

**`editor-critico` — 1 bloqueante e 11 altos, todos corrigidos.** O **bloqueante** era
dedução vazada, e da pior espécie: a prosa da torre dizia que a tabela da conserva do
relógio estava assinada «na mesma letra miúda que corre pelo livro de ordens da oficina» —
o narrador executando a identificação de duas escritas e entregando o resultado, que é
justamente o elo que explica por que o morto tinha acesso à câmara dos sinos. Cortado para
«em letra miúda»; o jogador cruza sozinho. Dos altos, os que valem nome: **duas frases de
efeito na cena da torre** (o teto é uma), e a segunda fechava a cena com uma cotovelada
(«o que estiver solto lá em cima, cai»); **o tique de Amos era de outros dois** — a
vassoura é de Davey e o «não para o serviço para responder» é de Caleb Grey, e o teste do
nome coberto falhava no eixo do tique (Amos passou a trabalhar a corda, e a bíblia
registra a divisão); **a voz de Wycliffe** na fala nova sobre Tobin não tinha nenhum dos
três marcadores do verbete dele (entrou a autocorreção, e só ela — o bloco do posto já tem
as duas frases espirituosas que o §3 permite); **o carimbo do sineiro afiava a hora além do
que a boca dele declara** (dizia 21h15; passou a «depois das nove», que é o que Amos diz —
a tag fica); e **o marcador não fluía com o `textoDisplay`**, que na tela dava «na grelha
por raspar, *Cinza de Papel na Grelha*».

**`perito-forense` — sem bloqueantes, 4 altos e duas correções mecânicas.** As três
proibições do parecer prévio foram respeitadas e ele verificou-as por varredura: a carta da
cinza não lê letra nenhuma, e em lugar nenhum a prosa insinua que o buril da cifra seja **o**
buril da ferida (comparar estrias de ferramenta é ciência do século XX; em 1893 lê-se o
gênero, nunca o exemplar). Os altos: faltava à cinza **a parte mais indestrutível do livro**
— a pasta e a lombada, que numa grelha doméstica empenam e sobram (entraram); o verbete do
glossário dizia **«praticante»** onde a lei diz *practitioner*, isto é, **médico em
exercício** — num caso cujo eixo é mestre inscrito × aprendiz sem registro, o verbete
mandava a ordem do coroner ao aprendiz (corrigido); e **o caderno de pesos não tinha
balança** em cena nenhuma — a oficina ganhou a balança de fiel do ouro com a caixinha dos
pesos, que é o instrumento sem o qual o registro não tem lastro material. Davey dizia
**«guarda-pó»**, que no ofício inglês é a *outra* peça (a calota do maquinismo): passou a
«tampa de dentro», e a piada do patrão («chamava aquilo de cuvette, à francesa») ficou.
**As duas correções mecânicas são as que mais importam:** o esconderijo estava no
**cabeçote**, que gira com o sino e daria a volta inteira no domingo — passou para o
**barrote da armação**, que é fixo; e meia-volta não solta um parafuso de fixação, solta uma
**trava** de cabeça serrilhada.

**`fiscal-continuidade` — sem bloqueantes, 1 alto e 6 menores, todos aplicados.** O **alto**
era uma correção da própria ronda anterior: para fechar um referente flutuante, o sineiro
passara a esperar «que a pena **do escrivão** pare» — e não há escrivão na torre. O perito
sobe sozinho, e a única pena em cena é a caderneta dele; pior, é justamente o contraste com
essa pena que faz o «e não escreveu» de Amos significar alguma coisa. Revertido. Dos
menores, os que mudaram fato: **a hora da tag do sineiro passou de 21h15 para 21h45** — com
a morte às 21h e o portão da estalagem a bater «passado das dez», um quarto de hora não
chega para matar, encenar o roubo, esmagar o relógio e desmanchar o Livro I na grelha aos
punhados; o número é invisível ao jogador (o carimbo diz o que Amos diz) e continua dentro
da janela mecânica da roda de contagem. **A razão do horário de Amos mudou**: dizia «quando
a igreja esvazia», e a prosa da torre acabara de estabelecer que as cordas ficam enroladas
até domingo — não há ensaio de repique na sexta que encha a igreja, e ofício de sexta que
esvaziasse às nove seria tarde para 1893. Passou a «quando fecho o adro», que de quebra
explica por que ele está ao portão quando vê o homem sair. E a Sra. Wick é procurada **ao
meio-dia**, não antes dele — a manhã de sábado já está lotada pela abertura.

O fiscal registrou ainda um **falso positivo de gate, e a explicação vale para a casa**: o
`qa-ui.mjs` falhou na árvore dele por concorrência, não por regressão — ele sobe o `vite`
com HMR, e o hot-reload de um arquivo salvo por outro agente durante a corrida derruba o
overlay e leva o botão embora. Duas corridas limpas depois, `UI VÁLIDA`. **Não rodar o
`qa-ui` com outra coisa a escrever na árvore.**

### Gate específico (§7 da OS)

1. **Pipeline `revisar-prosa`** — corrido; zero bloqueantes remanescentes.
2. **Contagem de cartas** — 35 → 39; 40 de 46 em jogo; 6 livres. Impressa pelo `qa.mjs` a
   cada corrida, para a OS seguinte não ter de a recalcular.
3. **Asserção do veraz sem crédito** — GR4-3, nos dois tempos descritos acima.
4. **Os quatro perfis** — os quatro desfechos, com as horas da tabela.
5. **Diff** — `src/gerador/`, `casos_gerados.js` e `casos_indice.js` fora dele; `sha256`
   dos dois ficheiros intacto (`b96f9caf…b05a760b2` e `1fafae5c…b4038e29`).

Guardas novas no `qa.mjs`: **GR4-1** (teto de cartas, com a conta impressa), **GR4-2**
(cadeia física congelada por conjunto de ids), **GR4-3** (o veraz sem crédito), **GR4-4** (o
Livro II vale como carta de móbil), **GR4-5** (sem beco sem saída: torre aberta, sineiro na
prosa base, cifra por gesto do corpo, Livro II só atrás da cifra) e **GR4-6**
(`dep_visto_vivo` intacta em id, tags, domínio e lugar).

**Contrato do `qa-ui` atualizado no mesmo commit,** como o `CLAUDE.md` exige: três
micro-gestos no corpo em vez de dois, contador do corpo em «8 de 8», e a rota 1 passou a
subir à torre — o que dá cobertura de navegador ao mecanismo novo (o parágrafo condicional
entra, e o Livro II sai dele).

### Divergências assumidas

1. **A prosa condicional não tem gate de teto.** Um lugar pode acumular blocos condicionais
   sem que nada avise; hoje é um só, e o `qa.mjs` prova que ele existe e o que exige. Se a
   R5 ou a R6 quiserem mais, convém guarda própria.
2. **O carimbo do sineiro diz «depois das nove» e a tag diz 21h45.** É deliberado: o carimbo
   é o que a testemunha declara, a tag é a hora que o motor lê. O padeiro tem 05h15 no
   carimbo porque a fala dele diz «cinco e um quarto»; Amos não dá hora de relógio, e não
   podia dar.
3. **A posição da torre na maquete mudou depois de ver a prancha.** Posta ao lado da
   relojoaria, a agulha comia a fachada dela; foi para a ponta e para a frente. Camada
   visual pura.

### Aberto para a OS seguinte

- **OS-R5** (móbeis e cartas): **escrita no fecho desta OS**
  (`docs/os-r5-mobeis-e-cartas.md`, com prompt de arranque próprio). Herda **6 cartas** de
  orçamento. Se não chegarem, a decisão — cortar carta velha ou subir o teto — é de mesa, do
  utilizador. **E herda um achado que esta OS agravou:** o réu tem hoje **três** cartas de
  móbil, Walter duas, Grey uma, e Agnes e Davey nenhuma — quem contar cartas de móbil acha o
  réu sem raciocinar. O Livro II é a terceira de Silas, e entrou aqui sem que ninguém medisse
  a coluna. A saída que a R5 recomenda não custa carta: medir a paridade por **motivos
  distintos**, e não por cartas — Silas tem **um** motivo documentado três vezes, e Walter
  tem **dois**.
- **OS-R6:** `interrogatorio_silas` como localidade anómala (só Silas tem uma).
- **OS-R8** (passe editorial): tudo o que a ata da OS-R3 deixou, mais o «ontem» da amostra
  de Silas na bíblia de vozes.
- **OS-R9** (o gerador herda os padrões): idem, mais o **arquétipo do veraz sem crédito**,
  que agora tem marca de tag e guarda de motor — o gerador pode passar a produzi-lo.
- **Propostas de KB do `perito-forense`: as quatro foram marteladas e aplicadas** (ordem do
  utilizador, 25/07/2026, logo após o fecho da OS). Ver a ata própria, abaixo.

---

## 25/07/2026 — Lote de KB: o que a OS-R4 passou a exigir da base

**Ordem do utilizador** no fecho da OS-R4, sobre as quatro propostas do `perito-forense`.
Não é OS: é lastro. Nenhuma linha de código foi tocada, nenhuma prosa embarcada mudou.

**Por que agora, e não «quando der».** A prosa da R4 passou a depender de três domínios em
que a base era **muda** — o que sobra de um livro queimado, a anatomia do relógio por
dentro, e o que 1893 podia dizer de uma marca de ferramenta. A pesquisa com fontes já
estava paga pelo parecer prévio do perito; adiar significaria pagá-la outra vez, ou (pior)
escrever de cabeça na próxima sessão que precisasse dela.

**Arquivos tocados:** `docs/kb-medicina-legal/vestigios.md` ·
`docs/kb-medicina-legal/supressao-de-vestigios.md` ·
`docs/kb-medicina-legal/vocabulario-de-epoca.md` · `docs/kb-medicina-legal/fontes.md` ·
`docs/kb-medicina-legal/README.md` · `docs/kb-mundo-vitoriano/utensilios-e-objetos.md`.

### O que entrou

1. **Marcas de ferramenta, em `vestigios.md`** — a peça mais importante das quatro, e a
   única que é **guarda-corpo**. Em 1893 lê-se o **gênero** do instrumento (a largura do
   gume que forçou o batente, a secção da haste que abriu a ferida); ler o **exemplar** —
   dizer que *aquele* buril fez *aquela* marca — é comparação de estrias, ciência dos anos
   1920 em diante. Vale a mesma exceção da fibra, e só ela: o **encaixe físico** de uma
   ponta partida. Registrada também a armadilha concreta: em «A Hora Emprestada» a arma é um
   buril e a cifra do morto está gravada a buril, e a primeira frase que as aproximar comete
   o anacronismo. O que a carta da cifra pode dizer, e diz, é que **o corte fresco brilha
   contra a pátina** — logo aquela linha foi cortada depois das outras. Isso é só olhar.
2. **Dossiê «O documento queimado», em `supressao-de-vestigios.md`** — irmão do que já
   existia sobre roupas queimadas, com a mesma arquitetura e a mesma lição: *o que a cinza
   guarda é a identidade da peça*. O achado que rege o dossiê é de física, e contraria o
   senso comum: **um livro fechado não arde** — o calor escoa para o miolo e a camada de
   carvão da capa sobe a temperatura de ignição, de modo que o volume sobrevive com o miolo
   legível. Destruir um registro numa lareira exige **desmanchá-lo e alimentá-lo aos
   punhados**, ao longo de uma hora — o que é gesto deliberado, não de pânico. A prova fica
   na **carcaça** (dobra e furos de costura com o fio de linho, cola animal, lombo de mola,
   pastas, cantos de couro retorcidos, fecho de latão), nunca nas folhas. E o limite é duro:
   **não se lê nada** — a decifração de carbonizado é de 1941 em diante; a luz rasante dá
   **geometria de pauta**, e mais nada.
3. **Relógio por dentro e balança de fiel, em `utensilios-e-objetos.md` §11** — a **cuvette**
   (*dome*, para o ofício inglês) é a tampa interna da caixa, aberta pela unha; o
   **guarda-pó** (*dust cap*) é a calota sobre o maquinismo, e são peças diferentes. O que se
   grava numa e a folga de campo que ela tem; a regra do ensaio inglês (o *dome* é parte da
   caixa e leva contraste; suíço e francês usam latão dourado, o que datou e nacionalizou o
   relógio do morto de graça). E a **balança de fiel do ourives** com as unidades troy — o
   instrumento sem o qual o caderno de pesos do Livro II não teria lastro material.
4. **Dois anacronismos novos em `vocabulario-de-epoca.md`** — «cubeta» (falso amigo: é o vaso
   de laboratório) e a marca de ferramenta pelo exemplar. Mais duas linhas na tabela de
   marcos técnicos de `fontes.md` (estrias, anos 1920; carbonizado, 1941).

### Verificação

O `perito-forense` releu as quatro peças contra o próprio parecer, com uma ordem explícita:
marcar como bloqueante qualquer ponto em que a redação tivesse **endurecido** a pesquisa —
transformado um «não consegui confirmar» em fato da base, ou uma inferência dele numa
asserção normativa. É a cautela que esta base impõe a si mesma desde a nota sobre Locard:
o valor dela está em distinguir o que 1893 sabia do que só veio depois, e uma KB que exagera
para o lado da certeza estraga a prosa de todas as OS seguintes.

**Veio sem bloqueantes e com cinco altos, todos aplicados — e todos eram endurecimento meu.**
Valem por si:

- **«Em 1893 não se lê o exemplar» era absoluto demais**, e tem contraexemplo inglês anterior
  ao jogo: em **1835**, o Bow Street Runner **Henry Goddard** ligou balas ao molde do mordomo
  por uma saliência do tamanho de uma cabeça de alfinete. O que 1893 não tem é a **estria
  microscópica**, não o exemplar em absoluto. A base passou a ter **duas portas** de olho
  armado — o encaixe físico e o defeito conspícuo —, e um aviso de homónimo: aquele Goddard
  não é o Calvin Goddard das estrias, de **1925**.
- **A luz rasante estava afirmada como se desse sempre.** O mecanismo é documentado; a
  garantia, não — a própria literatura que criou o método fotográfico de 1941 registra que a
  luz oblíqua **falhava** sobre a folha plenamente enegrecida, e foi por isso que se foi
  buscar a fotografia. A ressalva entrou onde faltava, no mesmo tom em que o dossiê já se
  recusava a afirmar cor.
- **A pesagem de entrada e saída estava atribuída a Gee (1892)** com mais firmeza do que se
  confirma no texto dele. O **fato sobrevive; a fonte é outra** — um registro de oficina do
  período, no acervo do Public Record Office Victoria. Gee fica com o que é dele (a coleta e
  o refino da limalha), e a citação passou a ser a verificável.
- **O verbete do relógio reabria, no fim, a confusão que abrira dizendo resolver:** dava
  *dust cover* à tampa de dentro, quando é nome da calota. A base agora **fixa os dois** e
  explica por que o ofício os embaralha.
- **O repertório de legendas é prática suíça e francesa**, não inglesa — e isso **decide o
  objeto do caso**: uma inscrição particular *esconde-se* no jargão de uma cuvette suíça e
  *salta* num dome inglês. O truque que a carta da cifra usa só funciona porque o relógio do
  morto é suíço, o que a própria carta já dizia sem saber (cuvette de metal dourado, legendas
  francesas).

Ficaram também três omissões que fariam falta a quem escrevesse depois, e entraram: o **leito
de cinzas anormalmente alto** (o tell mais robusto do dossiê, e eu não o tinha escrito), a
**placa de vidro** que estabiliza a escama antes do exame, e o precedente dos **papiros de
Herculano** com as tentativas químicas falhadas de Davy — que fixa o limite pelos dois lados.

**Aberto:** `CLASSES_VESTIGIO` continua sem classe de documento queimado, como já não tem de
roupa queimada — o dossiê serve a prosa autoral e o gerador ainda não sabe produzir nenhum
dos dois. Registrado nas divergências do próprio arquivo, não criado.

---

## 25/07/2026 — OS-R5: Móbeis e cartas

**Decisões aplicadas:** D1, D5, D6 · **Registradas e não tocadas:** D3, D17
**Guardas verificadas:** G1, G2, G3, G4, G7, G10, G11, G12 · **Novas:** GR5-3, GR5-4, GR5-6
**Arquivos tocados:** `src/data/cartas.js` · `src/data/localidades.js` · `scripts/qa.mjs` ·
`MORTEM_CONTEXTO.md` · `README.md` · este arquivo
**Gate:** lint-prosa sem violação ✓ · qa.mjs CASO VÁLIDO ✓ · qa-ui.mjs UI VÁLIDA ✓ · build ✓
**Gate específico:** pipeline `revisar-prosa` com os três revisores, zero bloqueantes em
aberto ✓ · contagem de cartas declarada ✓ · telemetria da paridade publicada ✓ · os quatro
perfis dão os quatro desfechos, com as horas inalteradas ✓ · gerador e banco fora do diff ✓
**Divergências assumidas:** o móbil de Agnes saiu pela opção **não recomendada** da OS
(ver os martelos, abaixo).

### Os martelos do §5, e o que se escreveu por causa deles

| Martelo | Decisão | Recomendação da OS |
|---|---|---|
| (a) Móbil de Agnes | **O escândalo do noivado** | era a caderneta da loja |
| (b) Carta de Davey | O livro de pagamentos, no púlpito de ordens | igual |
| (c) Carta do 2.º degrau de Walter (D3) | Não; a R6 planta e colhe | igual |
| (d) A agiotagem ganha carta própria | Não; entra pela prosa e pelos móbeis | igual |

**O martelo (a) teve consequência, e ela obrigou a trabalho que a OS não previa.** Era a
caderneta — a opção recomendada — que amarrava a agiotagem da **D1** ao móbil de Agnes.
Escolhido o escândalo, a D1 ficou sem suporte, e teve de encontrar outro. Encontrou-o onde
o próprio §3.2 já o nomeava: **o salário que Davey não recebeu**. É por isso que a carta do
rapaz carrega duas coisas nesta OS e não uma.

**Em compensação, o escândalo saiu mais barato do que a OS temia.** O §5(a) avisava que
essa via «pede história antiga contada em algum lugar». Não pediu nenhuma: os **proclamas**
são ato futuro, datado e documental. E o material já embarcado fechou o calendário sozinho
— a ordem de serviço do aro de ouro diz «pronto até 30 de outubro», que é a segunda-feira
imediatamente seguinte à terceira proclama, o primeiro dia em que o casamento seria lícito.
Ninguém tinha escrito isso de propósito.

**A ambiguidade que a D5 exige está na mesa, não na carta.** O bilhete traz o fato datado e
mais nada. Ao lado da cesta de ceia e do aro por gravar, lê-se como o noivado que ia ser
anunciado; sozinho, lê-se como o que a vila ia saber no domingo. A KB dá o peso da segunda
leitura sem que a prosa a enuncie: a viúva que recasa «herda suspeita», e Agnes vive do
balcão e do correio da High Street.

### As duas colunas da paridade, antes e depois

| Suspeito | Cartas (antes) | Motivos (antes) | Cartas (depois) | Motivos (depois) |
|---|:-:|:-:|:-:|:-:|
| **Silas Crane (réu)** | **3** | 1 | **3** | 1 |
| Walter Arthurs | 2 | **2** | 2 | **2** |
| Agnes Rooke | 0 | 0 | 1 | 1 |
| Caleb Grey | 1 | 1 | 1 | 1 |
| Davey Tull | 0 | 0 | 1 | 1 |

**O tell de contagem morreu por medição, não por gasto.** A Fase 0 — telemetria pura, antes
de tocar em nada — mostrou que pela métrica honesta o problema não existia: o réu tem **um**
motivo documentado três vezes (o livro de ordens, a consulta ao procurador, o caderno de
pesos), e Walter tem **dois**. Contar cartas acha o réu; contar razões acha Walter. A Fase 3
não custou carta nenhuma, e a lição fica registrada para a R6: **medir antes de mexer**.

### Orçamento

| | |
|---|---|
| Antes | 40 de 46 em jogo · 6 livres |
| Gasto pela R5 | **2** (`ev_bilhete_vigario`, `ev_livro_pagamentos`) |
| Depois | **42 de 46** em jogo · **4 livres** |
| Herda | **OS-R6** |

Ambas `comportamental`/`subDominio: motivo`, ambas com `isca: true` — a cadeia física sai
intacta (G1) e a marca de isca ficou onde devia (G3, GR5-6).

### O parecer do pipeline

Correram os três. **Zero bloqueantes do editor**, **um bloqueante do fiscal**, e o perito
contradisse o fiscal exatamente nesse ponto. A contradição valeu mais do que qualquer dos
pareceres isolados, e é o registro mais útil desta ata.

**A conta do livro de pagamentos, em três voltas.** Escrevi £2 adiantados à mãe de Davey,
quatro xelins descontados por semana durante vinte e nove semanas, e uma dívida remanescente
de £2 4s — com a intenção de que a dívida **crescesse enquanto era paga**, e que a agiotagem
aparecesse por aí, sem a palavra. O **fiscal** julgou a conta impossível: £2 são quarenta
xelins e quitam-se na décima semana. O **perito** mostrou que era possível *com* juro, e que
a taxa implícita cabia na faixa documentada da usura de rua vitoriana. Os dois tinham razão
sobre coisas diferentes: eu acertara o desenho e errara a legibilidade. **Um leitor cuja
função é conferir somas leu a carta como erro de aritmética — se ele leu assim, o jogador lê
também, e uma armadilha que se lê como engano não é armadilha.**

A saída foi do perito, e é melhor do que o que eu escrevera e do que a emenda do fiscal.
À taxa que a época **nomeava** (um penny por xelim por semana), um adiantamento de **£2 8s**
servido a quatro xelins semanais fica **exatamente parado**: 48 xelins vencem 48 pence de
juro por semana, que são os mesmos quatro xelins que se descontam. Por isso as duas somas do
livro são idênticas — £2 8s na margem de março, £2 8s na última linha — com **£5 16s pagos
entre uma e outra**. Quem não conferir vê um livro de contas; quem conferir encontra a
armadilha fechada. E as vinte e nove sextas correm de 31 de março a **13 de outubro**: a
última linha do livro é a noite da morte.

**Os outros achados aplicados.** O editor apanhou que `{suspeito:agnes_rooke.nome}` resolve
para «Sra. Agnes Rooke» — Agnes é o único suspeito cujo nome carrega título, e por isso o
defeito nunca tinha aparecido: as minhas frases diziam «de Sra. Agnes Rooke», sem artigo. O
fiscal apanhou que o carimbo dizia «Jornal de D. Tull», que em PT-BR se lê *Dona* Tull e
convidava a tomar o salário como o da mãe, que a mesma carta nomeia; e que o assento dos
proclamas tratava os dois nomes de forma assimétrica, o homem nu e a mulher titulada. Os
dois, independentemente, apanharam «jornal» como nome de coluna semanal: *jornal* é a paga
de **um dia**, e o mesmo jogo usa a palavra com o sentido de periódico. O perito confirmou o
procedimento inteiro contra o **Marriage Act 1823** (três domingos sucessivos, aviso escrito
sete dias antes, nulidade por nome errado, caducidade em três meses) e corrigiu o timbre:
papel de presbitério trazia o **endereço**, não a dedicação da igreja.

**Achado de desenho que o perito registrou e vale guardar:** tomar **proclamas** em vez de
**licença** (£2–£3, sem leitura pública) é caracterização legível para um relojoeiro de 61
anos que podia pagá-la. É a via que faz a vila saber no domingo — e é por isso que serve.

### Aberto para a OS seguinte

- **OS-R6** (exposição e interrogatórios): herda **4 cartas** de orçamento; mais a **D3**
  (o 2.º degrau do confronto de Walter), o **`apontadaPor`** (D17) e `interrogatorio_silas`
  como localidade anómala. **E herda uma lição de método:** a paridade dos móbeis mede-se por
  motivos distintos, não por cartas, e mede-se **antes** de escrever.
- **OS-R8** (passe editorial): tudo o que a ata da R4 deixou, mais o **«púlpito de escrever
  forrado de cortiça»** de `pt_oficina_pulpito` — prosa anterior a esta OS, e achado do
  perito: «púlpito» em PT é o da igreja (e o caso já tem uma), a KB verte o móvel como
  «escrivaninha alta de tampo inclinado», e cortiça como forro de tampo não está documentada
  (o atestado é couro). Mexer no rótulo do ponto toca o contrato do `qa-ui`.
- **OS-R9** (o gerador herda os padrões): idem, mais o móbil que se prova por **aritmética de
  livro** em vez de por depoimento — padrão novo que esta OS estreou.
- **Guarda rebaseada, e é preciso saber porquê.** A que provava que o monólogo não inventa
  móbil apoiava-se em **Davey não ter carta de móbil no catálogo**, o que esta OS tornou
  falso. Passou a valer nos dois sentidos e nos quatro perfis, e a testar o **pool** do
  monólogo em vez da string literal de uma das três variantes — a versão antiga, medida
  hoje, daria falso positivo.
- **De KB, registado e não criado** (falta ordem do utilizador): o regime de **proclamas e
  licença** (a KB do mundo vitoriano não cobre casamento); a **escala salarial do aprendiz**
  (a tabela desce a lavrador e a artesão, e para no rapaz — a calibragem dos quatro xelins
  repousa hoje num único *indenture* de relojoeiro de 1891); e os **Truck Acts** de 1831 e
  1887 com as taxas de usura de rua. Nota que vale por si: pelos Truck Acts o desconto
  integral do salário contra dívida da mãe é **dedução não autorizada**, ainda que banal numa
  oficina de vila — **nenhuma personagem pode afirmar que aquilo era de direito**. O Ato de
  1896 e o Moneylenders Act de 1900 são posteriores: em 1893 o saldo era exigível, e o rapaz
  não tem remédio.

---

## 25/07/2026 — Lote de KB: o que a OS-R5 passou a exigir da base

**Ordem do utilizador** no fecho da OS-R5, sobre as três lacunas que a OS registrou como
«aberto». Não é OS: é lastro. Nenhuma linha de código foi tocada, nenhuma prosa embarcada
mudou.

**Por que agora, e não «quando der».** É o mesmo argumento do lote da R4, e vale duas vezes
aqui: a prosa da R5 passou a depender de três domínios em que a base era **muda** — como se
casa em 1893, quanto ganha um aprendiz, e o que a lei deixava fazer a quem emprestava e a
quem retinha salário. A pesquisa com fontes **já estava paga** pelo parecer do
`perito-forense` sobre as duas cartas; adiar significaria pagá-la outra vez, ou (pior)
escrever de cabeça na próxima sessão que precisasse dela. E há um agravante que a R4 não
tinha: **essa pesquisa vivia só no parecer**, que é efémero.

**Arquivos tocados:** `docs/kb-mundo-vitoriano/demografia-e-sociedade.md` ·
`docs/kb-mundo-vitoriano/economia-e-estrutura-social.md` ·
`docs/kb-mundo-vitoriano/fontes.md` · `docs/kb-mundo-vitoriano/README.md`.

### O que entrou

1. **Casar em 1893, em `demografia-e-sociedade.md` §7** — o regime do **Marriage Act 1823**
   com as **três portas**: proclamas (três domingos sucessivos, aviso escrito sete dias
   antes, caducidade em três meses, 11s 6d–15s 6d), licença comum (£2–£3, sem leitura
   pública, quinze dias de residência) e o **certificado do superintendent registrar** do
   Ato de 1836 (aviso exposto vinte e um dias, cartório ou capela registada), que é a via do
   não-conformista. Mais o que os proclamas **não** dizem (idade), o peso assimétrico sobre
   a viúva, e o **Wills Act 1837 s. 18** — o casamento revoga o testamento, que é o relógio
   por trás de metade dos móbeis de herança.
2. **A aprendizagem, em `economia-e-estrutura-social.md` §7** — a escala documentada de um
   *indenture* de relojoeiro de 1891 (1s no 1.º ano a 6s no 7.º), a faixa por situação com a
   **origem de cada linha declarada**, e a idade de entrada.
3. **Dinheiro emprestado e retido, em `economia-e-estrutura-social.md` §8** — a peça mais
   importante das três, e a única que é **guarda-corpo**. Usura livre desde 1854; as taxas
   de rua na forma em que a época as dizia; a aritmética que faz uma dívida de £2 8s ficar
   **parada** sob pagamento de quatro xelins semanais (que é o livro de Davey, e é o que faz
   a agiotagem aparecer sem a palavra); e os **Truck Acts** de 1831 e 1887, com a
   consequência escrita como proibição de prosa.

### Verificação

O `perito-forense` releu as três peças contra o próprio parecer, com a ordem explícita que a
R4 inventou: **marcar como bloqueante qualquer ponto em que a redação tivesse endurecido a
pesquisa** — transformado um «não consegui confirmar» em fato da base, uma inferência numa
asserção normativa, uma ordem de grandeza numa tabela, ou uma faixa defensável numa regra.

**Veio com três bloqueantes e oito altos, todos aplicados, e todos eram endurecimento meu.**
A aritmética e as datas passaram intactas. Os que valem por si:

- **A s. 6 do Employers and Workmen Act 1875 não diz o que eu escrevi.** Ela manda o
  tribunal julgar a disputa entre mestre e aprendiz **como se** fosse entre patrão e
  trabalhador — equiparação **de foro**, não de definição. A definição que o Truck Act de
  1887 importa é a da **s. 10**, que não nomeia o aprendiz.
- **A criadagem está FORA dos Truck Acts** (a definição de 1875 exclui o *domestic or menial
  servant*), e o §4 da mesma pasta lista «salário atrasado da criada» como móbil padrão. O
  cruzamento descuidado das duas páginas produziria uma cena em que alguém ameaça queixa dos
  Truck Acts em nome de uma criada — erro jurídico de época, plantado pela própria KB. Já o
  *servant in husbandry* — o lavrador — está **dentro**, e é o único caso de vila em que a
  alavanca funciona.
- **Um único documento tinha virado tabela.** O *indenture* de 1891 documenta data, prazo e
  escala, e **nada** sobre alojamento; a minha explicação causal era leitura de desenhista
  apresentada como achado. Duas das três linhas da tabela não tinham fonte alguma. Passaram
  a declarar a origem, e a régua 3s/4s/5s passou a dizer de si mesma que é **convenção de
  MORTEM, não dado histórico**.
- **As taxas de 2d e 3d no xelim são de um debate dos Lordes de 1924**, e estavam sob o
  título «a forma em que a época as dizia» — atestação posterior em trinta anos, numa base
  cujo valor inteiro é separar 1893 do que veio depois. Só a de 1d é de época.
- **As duas fontes que eu citara para o §8.1 não sustentavam nenhum dos números.** Os fatos
  estavam certos e as fontes não os provavam, que é a pior combinação: quem reconferisse ou
  apagaria um fato correto ou perderia a confiança na página inteira.
- **Havia um remédio, e eu escrevera que não havia:** a equidade já reabria barganha com
  herdeiro expectante (*Earl of Aylesford v Morris*, 1873). Serve ao filho do squire; não ao
  lavrador.
- **Faltava a guarda contra o reflexo do direito moderno:** em 1893 não existe testamento
  «feito em contemplação do casamento» que escape à revogação — a exceção é da **Law of
  Property Act 1925, s. 177**.

Entraram ainda, por não estarem escritas: as **três portas** (eu tinha escrito duas, e
faltava justamente a do não-conformista, que a mesma pasta faz de peça de elenco); o **custo
real dos proclamas** (eu escrevera «gratuito», o que destruía a comparação de classe que a
seção existe para fazer); a correção do **meio-luto** (a viúva nele **não** cumpriu o prazo —
está nos meses 22 a 24 de 24 —, e «pode casar sem violar o código» não vem de fonte alguma,
porque os manuais legislam sobre traje e não sobre recasar); e a metade que faltava do
**nome falso** (o teste é *ambas* as partes, sabendo e de propósito — se só um sabia, o
casamento vale e a parte enganada fica casada).

**Aberto, e é decisão do utilizador:** os dois arquivos discordam sobre o preço do trigo —
`economia` §1 dá 46s (1870) → 22s (1894), `demografia` §2 dá 50s (1871) → 23s (1894) — e
citam-se um ao outro. Séries diferentes, nenhuma errada em si, mas quem cruzar as páginas
encontra números que não batem. Registrado em `fontes.md` e **não resolvido**: escolher a
série é do utilizador. Até lá, a prosa cita a ordem de grandeza e não o número.

---

## 26/07/2026 — OS-R6: Exposição e interrogatórios

**Decisões aplicadas:** D3, D7, D8, D16, D17 · **Registrada com desconforto:** a anomalia
do `interrogatorio_silas`
**Guardas verificadas:** G2, G3, G4, G5, G7, G8, G10, G11, G12 · **Novas:** GR6-3, GR6-4,
GR6-5, GR6-6, GR6-7, GR6-8, GR6-9
**Arquivos tocados:** `src/logic/exposicao.js` (novo) · `src/logic/contaminacao.js` (novo) ·
`src/data/procedencia.js` (novo) · `src/data/dialogos.js` ·
`src/components/InterrogatorioDialogo.jsx` · `scripts/qa.mjs` · `scripts/qa-ui.mjs` ·
`docs/kb-mundo-vitoriano/{economia-e-estrutura-social,demografia-e-sociedade,fontes}.md` ·
`docs/os-r7-a-reconstituicao.md` (novo) · `docs/os-r7-prompt-de-arranque.md` (novo) ·
`docs/plano-de-sessoes.md` · `docs/os-r0-mestra-reforma-hora-emprestada.md` ·
`MORTEM_CONTEXTO.md` · `README.md` · este arquivo
**Gate:** lint-prosa sem violação ✓ · qa.mjs CASO VÁLIDO ✓ · qa-ui.mjs UI VÁLIDA ✓ · build ✓
**Gate específico:** pipeline `revisar-prosa` com os três revisores ✓ · contagem de cartas e
saldo final declarados ✓ · telemetria da exposição publicada, com a paridade provada ✓ · os
quatro perfis dão os quatro desfechos, com as horas **conferidas** e inalteradas ✓ ·
contrato do `qa-ui` atualizado no mesmo commit que mexeu na árvore ✓ · gerador e banco fora
do diff ✓
**Divergências assumidas:** o `interrogatorio_silas` continua sendo o único suspeito com nó
de mapa próprio (martelo (e), opção recomendada, com o desconforto declarado no próprio
arquivo).

### Os sete martelos, e o que se escreveu por causa deles

Os sete saíram **nas recomendações** — o primeiro fecho da reforma em que isso acontece.

| Martelo | Decisão | O que se escreveu |
|---|---|---|
| (a) O que a exposição mede | Cartas do próprio suspeito; muda só o rendimento | `src/logic/exposicao.js`, e um corte **relativo** que a telemetria obrigou |
| (b) O que é o beat 3 | O beat da pressão, onde a exposição se paga | 20 nós `b3_*` e cinco `alfinetada` |
| (c) O motor lê `apontadaPor`? | **Não** — lastro narrativo com guarda no QA | `src/data/procedencia.js`, **fora de `tagsOcultas`** |
| (d) A D3 custa carta? | **Não** — o 2.º degrau cobra o que já está na mesa | o `degraus` de `confronto_testamento` |
| (e) A anomalia do `interrogatorio_silas` | Deixar como está e registrar | nota longa no próprio `dialogos.js`, com o custo de normalizar |
| (f) As 4 cartas que sobram | Aceitar o saldo 4 como decisão | zero gastas; o caso-escola fecha em 42 de 46 |
| (g) A série do preço do trigo | Fixar a de `economia` (46s → 22s) | `demografia` §2 alinhada; `fontes.md` passa a registrar a decisão |

### A telemetria da exposição, antes e depois

**Antes (Fase 0, cartas brutas que apontam o suspeito à entrada da conversa).** A medida
achou 0–4, e reprovou o corte absoluto por duas vias independentes: o réu tem o **maior**
teto bruto do caso (8 cartas o apontam), logo subiria de nível antes dos inocentes — o
nível viraria delator, e a GR6-5 cairia; e Grey e Davey, com **uma** carta de fora cada,
nunca alcançariam um corte alto — beco de exposição, contra a G10.

Descontado o que nasce da boca do próprio suspeito, o que vem de fora era 5 · 5 · 3 · 1 · 1.

**Depois (a régua do dossiê: o que aponta + o que a árvore reage − o que nasce na
conversa; E2 são dois terços).**

| Suspeito | Dossiê | E2 a partir de | Escada |
|---|:-:|:-:|---|
| **Silas Crane (réu)** | 5 | 4 | E0→E1→E1→E1→E2→E2 |
| Walter Arthurs | 5 | 4 | E0→E1→E1→E1→E2→E2 |
| Agnes Rooke | 4 | 3 | E0→E1→E1→E2→E2 |
| Davey Tull | 3 | 2 | E0→E1→E2→E2 |
| Caleb Grey | 2 | 2 | E0→E1→E2 |

**A paridade, provada e não prometida.** A GR6-5 caminha exaustivamente todo suspeito e
todo `k` de 0 ao tamanho do dossiê, e cobra a equivalência exata: **E0 ⟺ dossiê vazio,
E2 ⟺ `tem/total ≥ 2/3`**, a mesma régua para os cinco, sem exceção para o réu. Material
equivalente dá nível equivalente por construção. Os três níveis são alcançáveis pelos
cinco — nenhum beco.

O réu **empata** no topo com um inocente em vez de reinar nele, e não é sequer o mais
barato de levar a E2: em fração, Davey chega lá com 2/3 e Silas só com 4/5.

**O que a Fase 0, relida com a régua nova, mostrou** — e é o achado que vale por si:

| Perfil | Suspeito | Nível à entrada |
|---|---|---|
| Metódico | Davey | **E2** (3/3) |
| Metódico | Silas · Walter · Agnes · Grey | **E1** (2/5 · 2/5 · 2/4 · 1/2) |
| **Apressado** | **Walter** | **E2** (4/5) |
| Pericial Desatento | Davey | E2 (2/3) |
| Intuitivo | — | nenhuma conversa visitada |

O perfil que **acerta** entra em E1 em quatro dos cinco. Quem entra em E2 diante de
Walter é o **Apressado** — o perfil que erra o réu, diante do inocente que vai acusar. A
exposição mede o que se carrega, não o que se acertou, e a tabela prova isso sozinha.

### O orçamento, e o saldo é final

| | |
|---|---|
| Catálogo antes | **42** (41 em `cartas.js` + `ev_algor`) |
| Gasto pela R6 | **0** |
| Catálogo depois | **42** |
| Teto (G11) | 46 |
| **Saldo final** | **4** |

**Não há OS seguinte que possa gastá-lo.** A R7 está proibida pela G9, a R8 é passe
editorial e a R9 é do gerador. O caso-escola fecha para sempre com **4 de 46 por usar**, e
isso é decisão do martelo (f), não sobra: carta sem função é ruído no mural, e o teto dos
46 existe por jogabilidade medida em playtest, não por contabilidade.

Três peças que a OS previa poderem custar carta não custaram nenhuma:

- **O beat 3** não pede carta por desenho — é o que faz a G4 valer por construção.
- **A D3** cobrou o que já estava na mesa: `corrob_pettigrew` traz a mudança «por razão de
  matrimônio», `ev_bilhete_vigario` (da R5) datou-a, e `ev_suplica_cesto` põe o sobrinho à
  porta na própria sexta.
- **A D16** já estava escrita nas cartas sem que o jogo soubesse ligá-las.

### A contaminação: a D16 estava na ficção, e não no sistema

A decisão pedia «dois comprados com a mesma mentira, com fio de coação na Sra. Wick». Os
dois estavam lá desde a R4:

| Carta | Forma | O que a carta já dizia |
|---|---|---|
| `alibi_silas` | própria | «Fechei a oficina às sete e meia e saí com o rapaz» |
| `alibi_davey` | **ensaio** | «Perguntado de novo ao fim da visita, repete as mesmas palavras, na mesma ordem» |
| `dep_mulher_viela` | **coação** | «procurada outra vez ao meio-dia, disse não ter visto nada e fechou a janela» |

Três papéis, uma boca. `contarVozesIndependentes(['alibi_silas','alibi_davey'])` devolve
**1**, e a GR6-8 cobra isso por asserção, junto com a composição do feixe e a integridade
do mapa de procedência.

**O campo não entrou em `tagsOcultas`, e a razão é de arquitetura.** O `CLAUDE.md` já fixou
o precedente com a aparência de personagem: camada narrativa fora das tags, porque campo
dentro delas é campo que o motor pode ler amanhã sem que ninguém repare. Em
`src/data/procedencia.js` a cegueira é **estrutural**, e não uma promessa vigiada — que é
exatamente o que o martelo (c) escolheu.

### A anomalia do `interrogatorio_silas`, declarada

Só o réu tem nó de mapa próprio para ser interrogado: Agnes e Grey **são** a localidade,
Walter e Davey abrem por botão de dentro de outra. Três formas para o mesmo ato, e a G3
existe justamente para impedir marca que só o culpado receba.

Fica como está, e o desconforto está escrito **no próprio `dialogos.js`**, não só aqui.
Normalizar toca `localidades.js`, `mapa.js`, `mapa_espacial.js`, o diorama e o contrato do
`qa-ui`; normalizar para cima custaria hora, e as quatro horas do gate mudariam. Elas foram
**conferidas em vez de assumidas**, como o §7 da OS pede: seguem **18h00 · 18h00 · 14h00 ·
13h00**. A assimetria é real mas fraca — o réu é também quem achou o corpo, e ter sido
chamado a depor formalmente explica-se sozinho na ficção.

Reabrir é **depois da R8**, com ata própria.

### O parecer do pipeline

**Reprovado na primeira passada, e aprovado na segunda** — o mesmo destino da R3, da R4
e da R5. Desta vez os três revisores acharam coisas de naturezas diferentes, e **nenhum
sozinho teria bastado**.

**Dois bloqueantes, ambos do `editor-critico`:**

1. **O segundo degrau de Walter entregava de graça o pagamento do `confronto_registro`.**
   A cadeia de pretéritos acabava em «e eu fui dormir a crédito no quarto três» — que é
   exatamente o que `alibi_walter` nega e o que `ev_registro_estalagem` existe para
   desmentir. Como o degrau dispara com dois dos três papéis e **nenhum deles é da
   estalagem**, um jogador que nunca lá pisasse via a mentira do carro cair sozinha. O
   comentário de desenho dizia «aprofunda a isca sem tocar na cadeia física que o
   inocenta»; a frase tocava, e era justamente ela.
2. **Davey afirmava o falso contra a carta que carrega o móbil dele.** «Sexta ele pagou,
   como sempre» — e `ev_livro_pagamentos` diz que quatro xelins entram e quatro saem
   desde o fim de março. Como o jogador vê **um tom só por partida**, quem escolhesse o
   cordial levava para a mesa uma falsidade e depois leria a carta como se o menino
   tivesse mentido: contradição fantasma, sem função, num rapaz que na bíblia só mente
   sobre o álibi ensaiado.

**Do `perito-forense`, e é correção de direito, não de estilo:**

- **«A queixa corre contra o espólio» estava errado.** Processo criminal **morre com o
  acusado**: não se acusa, não se intima nem se pronuncia um defunto, e a queixa de Grey
  acabou na noite de sexta. O que sobrevive é a **dívida**, por contrato, e contra quem
  responder pelos bens. A correção melhora o personagem em vez de o encolher: Grey perde
  a vingança e fica com a conta, que é o que a bíblia de vozes diz dele desde sempre.
- **«Inventário com imóvel leva meses» é o mecanismo brasileiro.** Em 1893 o *freehold*
  não passava pelas mãos do testamenteiro — só a partir do Land Transfer Act **1897**. O
  que demora é **provar o testamento**, e o resultado prático que Walter quer (meses de
  espera, nenhum comprador antes do papel) continua verdadeiro pela via correta.
- «Queixado» não é substantivo em português (é *querelado*); «mola de fora» e «caseiro»
  também corrigidos.
- **Passou limpo, e é o que mais importava:** o rapaz **não** afirma direito nenhum sobre
  o desconto — dá três fatos e nomeia o registro, e a conta quem faz é o jogador. A
  guarda da R5 sobre os Truck Acts está cumprida.

**Do `fiscal-continuidade`, cinco furos que só aparecem cruzando dados:**

| O que a fala dizia | O que a fonte diz |
|---|---|
| Grey: «poupa a minha manhã» | o perito chega às **13h**, e o moinho custa viagem — nunca há manhã com ele |
| Silas: «abria amanhã» | amanhã é **domingo**, e o próprio jogo o diz na boca de Amos |
| Silas: «quem manda ainda está chegando» | Walter está na vila **desde a manhã de sábado**, no quarto 3 |
| Silas: «o carvão está onde ficou de sexta» | `abertura.js` narra que ele **acendeu o fogo** no sábado de manhã |
| Agnes: «Abriu ontem e abre na segunda» | a loja está aberta **agora**, e a frase saltava o dia em que ela fala |

Mais quatro **colisões de gesto** nas alfinetadas: como elas rendem sobre os quatro tons,
pressupunham um movimento que a fala já gastara — as mãos «voltavam» aos joelhos de onde
nunca tinham saído; a saca descia duas vezes, a dois lugares. Ficaram autossuficientes.

**O achado de maior peso foi de quantidade, e é o anti-padrão nº 2 do catálogo:
16 dos 20 nós fechavam em epigrama**, e três telas traziam **duas** máximas porque a
alfinetada é renderizada logo abaixo da fala. São **4** agora, e nenhuma tela tem duas.

**Dois revisores discordaram sobre a mesma linha, e ambos tinham razão sobre coisas
diferentes — outra vez.** O editor queria cortar o vínculo da dívida da mãe na boca de
Davey (o móbil chega por documento, e o rapaz não precisa entregá-lo); o fiscal apontou
que «livro da bancada» é a abertura literal da `descricao` de **outra** carta
(`ev_livro_ordens`) e mandaria o jogador à errada. Ficou **«livro estreito da bancada»**,
que é o adjetivo próprio de `ev_livro_pagamentos`: o vínculo sai e o ponteiro fica certo.
Na segunda passada o editor confirmou que a solução serve às duas razões — e **retirou**
um menor seu sobre a fala de Agnes, depois de o perito validar contra a KB que a viúva
além dos vinte e quatro meses devia ter voltado à cor.

**Segunda passada:** os dois bloqueantes caíram, e sobraram dois altos — o degrau tomava
emprestado o relógio de `dep_visto_vivo` («antes de correr as tampas da vitrine» é a ação
das 20h em ponto, e a hora da briga é do carroceiro, que diz «cair da tarde»), e a saca
de Grey ainda se largava duas vezes. Corrigidos. **Zero bloqueantes em aberto.**

**Não-bloqueantes herdados pela OS-R8** (passe editorial): a rubrica «Puxa o colete para
baixo, como quem se compõe para retrato» aparece duas vezes na árvore de Walter (prosa
anterior a esta OS, em telas diferentes); e a abertura de `interrogatorio_silas` diz «a
bancada amanheceu sem lume», que puxa contra a abertura do caso pela mesma razão que o
carvão de Silas puxava.

### Aberto para a OS seguinte

- **OS-R7** (a reconstituição): herda **zero cartas** de orçamento — está proibida de
  gastar pela G9, e não há saldo que lhe sirva. Herda a **D24** (a reconstituição, que não
  tem uma linha de código), a **D25** (a regra da assinatura, que nunca apareceu em prosa)
  e, sobretudo, **a conta de bocas**: o `blocoTestemunhas` do `monologo.js` diz «duas
  testemunhas juravam contra a hora que o corpo dá», e depois desta OS existe
  `contarVozesIndependentes`. É o **único ponto do jogo onde o erro sairia na voz do
  perito, no fecho do caso**. A OS e o prompt estão escritos
  (`docs/os-r7-a-reconstituicao.md`, `docs/os-r7-prompt-de-arranque.md`).
  **E herda uma lição de método:** medir antes de arbitrar já é o método da casa — na R5
  a telemetria dispensou uma fase inteira, e na R6 trocou o corte absoluto pelo relativo
  antes que o nível virasse delator.
- **OS-R8** (passe editorial): tudo o que a ata da R4 deixou; o **«púlpito de escrever
  forrado de cortiça»** de `pt_oficina_pulpito` (achado do perito na R5); a
  **normalização do `interrogatorio_silas`**, que esta OS deixou de pé com o desconforto
  declarado; e os dois não-bloqueantes do parecer acima. Os primeiros tocam o contrato do
  `qa-ui`.
- **OS-R9** (o gerador herda os padrões): a fila da R4, mais o **arquétipo do veraz sem
  crédito**, o **móbil que se prova por aritmética de livro** (R5) e — novos desta OS — a
  **exposição** (E0/E1/E2 por fração de dossiê), o **`apontadaPor`** e a **escada de
  confronto por contador autoral**.
- **De KB, registado e não criado:** `CLASSES_VESTIGIO` continua sem classe de **roupa
  queimada** nem de **documento queimado**. Registro novo do perito, para quando a cena da
  pesagem se escrever: £4 10s equivalem a cerca de 36 g de ouro de lei — a caixa inteira,
  não a raspa que um oficial tira sem que se veja. A soma da queixa é o valor da **peça**,
  não o do metal.

### Triagem de pendências e martelos antecipados da R7 (mesmo dia, a pedido do utilizador)

Fechada a OS-R6, o utilizador mandou triar as pendências sem dono e **martelar
antecipadamente os três pontos de decisão da R7**, para que a sessão seguinte execute sem
parar. O inventário está em `docs/pendencias-status.md` §«Triagem de 26/07/2026»; aqui fica
o que é decisão.

**Os três martelos da OS-R7, fechados sem esperar o arranque dela:** a reconstituição é
**peça de leitura** entre o mural e o monólogo; a **D25** entra **no fecho do monólogo**,
uma variante por desfecho; e, sem carta para rebater, **a cena roda curta e a intervenção
fica de pé**. O terceiro carrega um aviso registrado na OS: uma cena que não mostra nada
pode ler-se como bug em vez de consequência — **mede-se no playtest, não se suaviza antes
de ter o número**, e se um dia o remédio for preciso é de prosa, nunca de mecânica.

**Duas pendências mudaram de natureza ao serem olhadas contra o código:**

- **O item 14 não é desenho, são três strings.** A queixa dizia que o mural entregava as
  cartas «já rotuladas como mentiras». O motor não vaza nada: a Estação III lista *todas* as
  alegações de hora — inclusive as **verdadeiras**, como o guarda Tobin correndo as tampas
  da vitrine às 20h em ponto — e, só depois de o réu ser nomeado, o paradeiro dele. Dentro
  da estação o rótulo já é honesto. O que conclui pelo jogador é o **nome da gaveta**:
  `III · As Mentiras` / `depoimentos desmentidos`, e a linha `Mentiras` da revisão final.
  **Vai para a R8**, com as três linhas identificadas.
- **O item 12 é calibração, e não se arbitra antes de medir.** O vidro na dobra nasce no
  beat 1 em todos os tons, mas não é a única âncora de presença (`ev_estojo_buril` também
  é) e **o próprio réu a desarma** de forma convincente no `confronto_vidro`. Lê-se como
  inocência, que é o padrão que a R5 fixou. O próximo playtest humano mede se quem a apanha
  cedo **abandona** o resto; mexer antes seria arbitrar antes de medir — o erro que a Fase 0
  desta OS existiu para evitar, e que já se pagou duas vezes.

**Fechadas sem gastar sessão:** o **item 16** («cada suspeito com um móbil») estava feito
desde a R5 e o inventário não sabia — a `GR5-3` reprova sozinha se faltar; o **item 9**
(Silas e o aprendiz saindo de cena) foi **arquivado**, porque custa dados, mapa e horas por
verossimilhança marginal, e a cena única da R2 já resolveu o problema de fundo; e o **prazo
do inquérito com consequência mecânica** segue fechado — pressão de prazo briga de frente
com o **relógio mole**, que é pilar.

**Martelado também, e poupa uma investigação à R8:** o `interrogatorio_silas` **não se
normaliza**. Fica a assimetria, declarada no próprio `dialogos.js`.

---

## 26/07/2026 — OS-R7: A reconstituição

**Decisões aplicadas:** D24, D25, D14, D16 (herdada), D23
**Guardas verificadas:** G1, G3, G4, G8, **G9**, G10, G11, G12 · **Novas:** GR7-1, GR7-2,
GR7-3, GR7-4, GR7-5, GR7-6, GR7-7 · **Estendida:** GR6-6 (passa a cobrar que o motor
também não leia a reconstituição nem as intervenções)
**Arquivos tocados:** `src/data/intervencoes.js` (novo) · `src/logic/reconstituicao.js`
(novo) · `src/logic/monologo.js` · `src/logic/contaminacao.js` · `src/logic/veredicto.js` ·
`src/data/pacote_caso.js` · `src/components/MonologoFinal.jsx` · `scripts/qa.mjs` ·
`scripts/qa-ui.mjs` · `scripts/lint-prosa.mjs` · `docs/os-r8-*` (novos) ·
`docs/plano-de-sessoes.md` · `MORTEM_CONTEXTO.md` · `README.md` · este arquivo
**Gate:** lint-prosa sem violação ✓ · qa.mjs CASO VÁLIDO ✓ · qa-ui.mjs UI VÁLIDA ✓ · build ✓
**Gate específico:** pipeline `revisar-prosa` com os três revisores, em **duas passadas**,
zero bloqueantes em aberto ✓ · **42 cartas antes, 42 depois**, provado por guarda ✓ ·
telemetria da Fase 0 publicada ✓ · os quatro perfis dão os quatro desfechos, com as horas
**18h00 · 18h00 · 14h00 · 13h00** conferidas e inalteradas ✓ · contrato do `qa-ui`
atualizado no mesmo commit que mexeu na árvore ✓ · `src/gerador/`, `casos_gerados.js` e
`casos_indice.js` fora do diff ✓
**Divergências assumidas:** o `MORTEM_CONTEXTO.md` chama «carrilhão» à peça que o
glossário, o motor e as cartas chamam «relógio de badalar» (ver abaixo — a prosa nova não
propaga o termo, e alinhar as duas linhas é decisão do utilizador).

### Os três martelos, e o que se escreveu por causa deles

Fechados em 26/07/2026, no fecho da R6, **de propósito, para que esta sessão não parasse**.
A cláusula de consulta na hora foi usada **zero vezes**, como na R6.

| Martelo | Decisão | O que se escreveu |
|---|---|---|
| (a) Cena jogável ou peça de leitura | **Peça de leitura**, entre o mural e o monólogo | uma tela nova em `MonologoFinal.jsx`, sem escolha e com um só botão de saída |
| (b) Onde entra a D25 | **No fecho do monólogo**, uma variante por desfecho | cinco variantes (os quatro desfechos, mais o fecho anónimo do erro) |
| (c) Sem carta para rebater | **A cena roda curta, e a intervenção fica de pé** | a faixa `nenhuma` do fecho, e a Fase 0 mediu quantos perfis caem nela |

### A telemetria da Fase 0, e o tamanho que ela justificou

Nove gestos no catálogo da noite. Por perfil canónico:

| Perfil | Rebate | Desfecho |
|---|---|---|
| Metódico | **8 / 9** | vitoria_absoluta |
| Apressado | **1 / 9** | erro_judiciario |
| Intuitivo | **0 / 9** | impunidade |
| Pericial Desatento | **0 / 9** | **sucesso_gafes** |

**Duas leituras, e a segunda é a que interessa ao playtest.** A primeira: a cena tem
amplitude real — de moldura vazia a noite quase inteira —, e nove gestos é o tamanho certo
para essa amplitude. A segunda: **metade das rotas canónicas chega à reconstituição sem
carta nenhuma**, e uma delas **condena** — o Pericial Desatento fecha em `sucesso_gafes`
com o tripé inteiro e sem ter visto a noite. É exatamente o risco que o aviso do martelo (c)
antecipou, agora **medido em vez de suposto**. A decisão fica de pé como está: mede-se no
playtest humano se o jogador sem cartas entende que a cena foi curta **por culpa dele**, e
o remédio, se for preciso, é de prosa e nunca de mecânica.

Nas rotas do `qa-ui` (que colhem mais que os perfis do `qa.mjs`) a distribuição é 9 / 3 / 3
— a moldura vazia **não** aparece em nenhuma das três rotas de navegador, e por isso ela é
provada no `qa.mjs`, por asserção sobre a cena de mesa vazia.

A telemetria também achou o feixe da D16 **vivo na rota canónica**: no Metódico, a tese do
réu tem **dois papéis e uma boca só**. É esse número que a Fase 1 obrigou o monólogo a
contar.

### A contagem de cartas, e o zero

**42 antes, 42 depois** (41 em `cartas.js` + `ev_algor`), com a GR7-7 a cobrar. A R7 estava
proibida de gastar pela G9, e não gastou: as nove intervenções citam **dezoito referências
a cartas que já existiam**, e a guarda reprova `exige` órfão. O caso-escola fecha em 42 de
46, como a R6 decidiu.

### O que a cena é, e a decisão de desenho que a define

**Nenhum gesto tem autor nomeado.** A cena diz a mão, nunca o nome: nomear quem pôs os
ponteiros seria concluir por conta do jogador, que é o que a G9 proíbe. Quem nomeia é o
monólogo, depois, e só até onde a cadeia dele alcança. O efeito colateral é o melhor da OS
— **sem nome na cena, não há como o texto ramificar no bit `culpado`**, e a G3 passa a
valer ali por construção em vez de por vigilância.

**A distinção que a execução obrigou a escrever.** Cena **vazia** é colheita magra do
jogador (martelo (c), e mostra-se); **ausência** de cena é o caso não a suportar. O
catálogo de gestos é DO CASO, e os gerados não têm nenhum: sem o gate, os trinta casos do
banco abririam uma reconstituição vazia que nada teria a refazer. As intervenções passaram
a campo **opcional** do pacote, no padrão de `ecosDoMestre` e `contradicaoHoras`, e a GR7-1
ganhou a perna que prova o segundo caso contra um caso gerado de verdade.

### A conta de bocas, e o que ela custou em número

O `blocoTestemunhas` somava papéis. Passa a somar **vozes**: o motor entrega os ids das
alegações derrubadas como lastro narrativo — não lê nenhum para decidir coisa alguma — e
quem os agrupa por origem é a camada narrativa, onde a procedência mora de propósito.

`contarVozes` entra em `contaminacao.js` com a regra que a conta de auditoria não podia ter:
**alegação sem procedência registada é voz própria**. Os casos gerados não têm mapa de
procedência nenhum, e a conta estrita teria apagado o bloco das testemunhas de todo o banco.

Os três casos do bloco foram reescritos e ganharam um quarto: quando os papéis são mais que
as bocas, o bloco **diz** a corroboração que não existe. A conta mais honesta é também mais
pobre em número, e esconder a razão de o número ter encolhido deixaria o desfecho
tecnicamente correto e narrativamente mais fraco.

**Registrado para não se reinvestigar:** no caso-escola o bloco só chega a render o caso de
UMA testemunha. Só o moço do padeiro é alegação de hora refutável sem ser a peça encenada
(o sineiro diz a hora verdadeira e o motor recusa-o; a Sra. Wick não tem hora nas tags). A
GR7-4 prova a régua **por asserção**, como a OS mandou — é assim que ela se prova antes de
haver caso que a use, e o gerador vai usá-la.

### O parecer do pipeline — reprovou na primeira passada, e um dos furos era o pivô

**Primeira passada: cinco bloqueantes.** As contagens mecânicas foram as melhores que este
repositório já mediu (0,06 travessão por bloco de cena contra um teto de 0,5; zero filtro
sensorial, zero tríade, zero monotonia de abertura; **o perito não achou um anacronismo nos
três arquivos**). Todos os achados foram de **matéria** — que é precisamente onde a guarda
automática não chega.

**O mais grave foi do fiscal, e nenhum dos outros dois o viu.** A cena punha o relógio a
ser esmagado ANTES de os ponteiros recuarem. O `MORTEM_CONTEXTO.md` fixa o inverso e diz
por quê: recuado, e não avançado, porque avançar faria a peça badalar na rua morta. Era o
pivô do caso escrito ao contrário.

Na arbitragem, **o perito retirou o próprio parecer** (ele tinha validado a ordem original
por uma razão material) e deu ao cânone um argumento mais forte do que o que o cânone
escreve: **adiantar teria consertado a prova**. Cada hora batida avança a roda de contagem;
ao chegar ao mostrador das 08h45 a alavanca estaria no **oitavo** entalhe, em concordância
perfeita com a hora falsa, e não haveria caso nenhum. É recuar que produz a discórdia entre
o mostrador e a roda — a discórdia que dá nome a «A Hora Emprestada». E o esmagamento ganhou
prazo: com o mostrador correndo desde as 08h45, a peça bateria dez um quarto de hora depois,
e a carta acha o mostrador ainda onde foi posto. **A roda passa a datar os dois gestos.**

**O segundo foi visto pelos três: a D25 punha o perito a ASSINAR a morte grande.** O
telegrama da abertura diz «NAO ASSINE NADA», a própria D25 diz que ele nunca assinou uma, e
a KB é mais dura — o assistente sem registo que assina não está a fazer *covering*, está a
falsificar. Resolvia numa oração subordinada uma decisão de personagem que o jogo nunca deu
ao jogador. Fica o peso, sai o evento.

**Os outros três:** um clítico de género que saía errado na tela do desfecho com ré mulher;
a lasca de vidro afirmando «a sala fica arrumada para ser lida», que é a encenação inteira
entregue a quem pagou só pela lasca; e a hora ensaiada transplantada de um eixo para o
outro — as duas declarações não coincidem entre si, quem repete as mesmas palavras é o rapaz
consigo mesmo.

**Duas regras que o próprio arquivo não cumpria** ficaram escritas como são: `exige` é
«todas as que denunciam», não «o par»; e a ordem do array é a da hora que cada arrumação
OCUPA na noite (a dos álibis é a que eles alegam), não a dos fatos que os desfazem.

**Segunda passada: zero bloqueantes, e os achados foram das próprias correções.** O editor
apanhou o mais fino: a explicação que a correção pusera na cena («adiantá-los teria posto o
martelo a bater na rua vazia») era a **única oração explicativa dos nove gestos**, e
atribuía à mão um cálculo entre alternativas — motivo, que o guia §2.2 proíbe. O raciocínio
já morava no comentário, que é onde nenhum jogador o lê. Mais: o gesto do quarto
transcrevia a carta em cinco sintagmas em vez de a dramatizar; a cessão do eco anterior
trocara o eco de lugar em vez de o desfazer; e a abertura 1, ao perder a âncora de
sexta-feira, deixava «na mesma noite» a apontar para o domingo da própria reconstituição.

**Não acatado, com razão registrada e escrita no arquivo:** o «Saio como entrei.» do fecho
vazio. O editor pediu o corte por ser epigrama, e depois concordou em mantê-lo com um
argumento melhor do que o meu — é a única faixa em que o texto tem de comunicar
CONSEQUÊNCIA sem comunicar CONTEÚDO, e um fecho plano ali corre o risco maior, o de se ler
como defeito. O contrato de brilho do `reconstituicao.js` passa a declarar a exceção e a
data de medição.

### Divergências registadas, e NÃO criadas

1. **«Carrilhão» × «relógio de badalar».** `MORTEM_CONTEXTO.md` usa «carrilhão» em duas
   linhas; o glossário (`glossario.js`), o motor (`tempo_morte.js`) e a carta
   (`ev_maquinismo`: «o martelo caído sobre a campainha») dizem «relógio de badalar».
   Carrilhão é *chime*: soaria a cada quarto de hora — e encolheria a janela do caso de uma
   hora para quinze minutos — e praticamente todos os movimentos de quartos do período são
   de cremalheira e caracol, não de roda de contagem. **A prosa nova não propaga o termo.**
   Alinhar as duas linhas do documento de desenho é decisão do utilizador.
2. **A hora de queima do Livro I.** A KB põe a destruição de um livro-razão em lareira
   doméstica em «uma hora ou mais»; a janela canónica entre a morte (21h) e o sineiro
   (21h45) é de ~45 minutos, para cinco gestos. A prosa da cena **não declara duração**,
   logo não mente — mas é ela que põe a queima na sequência da noite pela primeira vez.
   Três saídas, todas do utilizador: alargar a hora do sineiro, aceitar a compressão, ou
   dizer em prosa que o fogo foi começado e não terminado.
3. **A janela de `ev_maquinismo` pressupõe batida só às horas.** Num movimento que batesse
   também a meia-hora, a alavanca no nono entalhe fecharia a janela às 21h30, não às 22h.
   É valor de motor e sustenta a resolubilidade; não se tocou.
4. **O vestígio do buril é o perecível.** A umidade na junta seca em um dia; o durável (o
   coágulo sob a virola) exigiria carta nova, vedada pela G9 e pela GR7-7.

### Aberto para a OS seguinte

- **OS-R8** (passe editorial): tudo o que já estava na fila — o «púlpito de escrever
  forrado de cortiça» de `pt_oficina_pulpito`, as três strings da Estação III do mural
  (item 14), os itens 10 e 11 do playtest, os dois não-bloqueantes da R6 — **mais quatro
  desta OS**: a divergência «carrilhão» (se o utilizador mandar alinhar); o «vinco das
  nervuras» de `ev_cinza_livro` (as nervuras são da lombada, e o livro-razão dos 1890 é de
  lombo de mola, sem nervos — sobrevivente canónico melhor: a crosta curva em camadas); a
  bíblia de vozes dizendo «antes do meio-dia» onde a carta diz «ao meio-dia»; e o
  `interrogatorio_silas`, que **não se normaliza** — martelado em 26/07/2026.
- **OS-R9** (o gerador herda os padrões): a fila que já existia, mais — novos desta OS — as
  **intervenções da noite** (o gerador não sabe produzir catálogo de gestos, e por isso os
  casos gerados não têm reconstituição) e a **dívida de geografia**: as três aberturas de
  `reconstituicao.js` cravam a relojoaria, o balcão, a oficina e o escritório num módulo de
  `src/logic`, cujo irmão `monologo.js` declara o contrato oposto. Hoje não vaza, porque sem
  catálogo a função devolve `null`; no dia em que o gerador produzir intervenções, aquelas
  três frases vão para o pacote, como as próprias `intervencoes` já foram.
- **Para o playtest humano, e é o item com número:** os dois perfis que chegam à cena com
  **0 de 9**. Medir se a cena curta se lê como consequência da própria colheita ou como
  defeito. É a única pergunta que esta OS deixou por responder de propósito.

### Adendo de decisão sobre as quatro divergências (mesmo dia, a pedido do utilizador)

Fechada a ata acima, o utilizador martelou **as quatro divergências que ela tinha
registado** e mandou executar as recomendações. Três eram executáveis e foram feitas **no
próprio fecho da R7**, para que a R8 abra sem decisão nenhuma pendente — é a mesma
disciplina com que a R6 martelou a R7 de antemão, agora com a execução junto.

| # | Divergência | Decisão | O que se fez |
|---|---|---|---|
| 1 | «Carrilhão» × «relógio de badalar» | **Alinhar o CONTEXTO** | duas linhas do `MORTEM_CONTEXTO.md` |
| 2 | A queima do Livro I (~45 min × «uma hora ou mais») | **Dizer em prosa que o fogo não terminou** | uma oração no gesto `livro_desmanchado` |
| 3 | A janela de `ev_maquinismo` | **Blindar a carta, sem mover o número** | uma oração na `descricao` |
| 4 | O vestígio perecível do buril | **Arquivar para a R9** | nada no código; entrou na fila do gerador |

**O argumento que decidiu a (1) não era de vocabulário.** «Carrilhão» é *chime*, e bate os
quartos de hora. O `CLAUDE.md` põe o `MORTEM_CONTEXTO.md` como fonte da verdade de design —
logo, o documento, como estava, **contradizia um valor do motor**: lido à letra, a janela do
caso encolheria de uma hora para quinze minutos e a janela `[−3,−2]` de `ev_maquinismo`
deixaria de fazer sentido. O glossário, o motor e a carta já diziam «badalar». A passagem
reescrita aproveitou para trocar a razão fraca pela forte, que a execução da R7 tinha
descoberto: **adiantar teria consertado a prova**, e não apenas feito barulho.

**A (2) recusou a saída cara.** Alargar a hora do sineiro mexeria num número que o fiscal da
R4 fixou de propósito para dar tempo aos gestos, e arrastaria o portão da estalagem atrás.
A prosa não declarava duração — logo não mentia —, mas dizer que o fogo foi começado e não
terminado fecha a divergência **sem mover número nenhum**, e é o que a própria carta já
sustentava: o que ela mostra é muita carcaça sobrevivente (o fecho de latão, o fio de linho,
a pasta empenada), que é o que sobra de uma queima interrompida.

**A (3) preferiu tornar observável o que era pressuposto.** A janela nunca esteve em risco
de partir o caso — um movimento que batesse as meias fecharia às 21h30, o que **estreita** e
continua a conter a morte às 21h. O que estava errado era a janela depender de uma suposição
que a carta não declarava. Agora a roda «traz um entalhe por hora, e nenhum dos curtos que
marcariam as meias», e o número deixou de ser assumido.

**A (4) não tinha defeito a corrigir.** A carta observa a umidade na junta ~16h depois do
gesto, dentro da janela de secagem que a KB dá. O vestígio durável (o coágulo sob a virola)
exigiria carta nova, vedada pela G9 e pelo número final de 42 — e é **capacidade do
gerador**, não dívida do caso-escola.

**O que ficou por decidir, e é o único:** os perfis **Intuitivo** e **Pericial Desatento**
chegam à reconstituição com **0 de 9**. Medido a mais no fecho: o Desatento está **a uma
carta de dois gestos** (tem `ev_maquinismo` e falta-lhe `ev_relogio_lareira`; tem
`ev_estojo_buril` e falta-lhe `ev_residuo_ferida`), e o Intuitivo está longe de tudo, com
três cartas na mesa e desfecho de impunidade. Ou seja: **o caso dissonante — condenar e não
ver nada — é um quase, e não um precipício**, o que reforça manter o martelo (c) como está.
Fica para o playtest humano, e a pergunta é uma só: a cena curta lê-se como culpa própria ou
como defeito?

**Registrada a tentação, e recusada:** dá para subir a taxa de acerto afrouxando os pares de
`exige`. Seria vender barato o «quem não colheu não vê» da G9, e transformaria a cena numa
que mostra o que o jogador não provou. **Não se faz** sem ata própria.

**O pipeline correu sobre os três ajustes, e apanhou um ALTO no que parecia o mais seguro.**
A blindagem de `ev_maquinismo` dizia «um entalhe por hora, e nenhum **dos curtos** que
marcariam as meias» — e numa roda de contagem **os entalhes são todos iguais**. O que conta
as pancadas é o **arco** que a alavanca percorre entre um entalhe e o seguinte, e uma roda
que batesse as meias traria um entalhe **rente** ao da hora, não um entalhe curto. A frase
encarregada de blindar o número negava a existência de uma coisa que não existe em roda
nenhuma. Corrigida para o espaçamento, que é o observável verdadeiro.

O fiscal apanhou, na mesma passagem que se editava, **um furo pré-existente do documento**:
a cópia da Verdade de Ouro no §14 dizia `horasMorteAntesChegada: 14` contra os **16** de
`seed.js` — e contra a própria linha do §14 que diz «IPM na chegada = 16h». Entrou em
17/07, quando a chegada passou de 11h para 13h, e ninguém a acompanhou. Corrigida. Mais
duas do mesmo fôlego: a encenação levava «a hora seguinte» onde a janela até o sineiro dá
**três quartos de hora**, e a razão do silêncio estava fundida com a da janela (o silêncio
vem de recuar; «bater só às horas» é o que faz a janela fechar às 22h em vez das 21h30).

E um achado que **cresceu** com o ajuste: o «vinco das nervuras» passou a viver em dois
arquivos, porque a reescrita do gesto herdou a frase da carta. A R8 corrige **aos pares**.
Fica registada também uma emenda à KB que o perito propôs e não aplicou — o leito de cinza
alto está ancorado em «uma hora de alimentação», e com a queima declarada interrompida o
tell precisa de ser desacoplado da duração. A física corre a favor da prosa (fogo abafado
carboniza mais e colapsa menos, logo o leito interrompido é **mais** volumoso), mas a KB,
como está escrita, deixou de justificar o que a carta afirma.

---

## 26/jul/2026 — OS-R8: Passe editorial e QA de fecho (**a reforma fecha aqui**)

**Decisões aplicadas:** nenhuma nova — a R8 executou o que sete OS deixaram, e abriu com o
§5 vazio (a primeira e única da série). Herdadas: D13 (o rótulo que não conclui), D24/D25
(as duas peças da R7 que a fila tocou), e os três martelos de 26/07/2026 que a R7 já tinha
executado.
**Guardas verificadas:** G1, G3, G4, G8, G9, G10, G11, G12 · **Novas:** GR8-2, GR8-4 ·
**Removidas, com justificação:** GR4-1 e a linha «P9 Fase 0» (§ próprio, abaixo)
**Arquivos tocados:** `src/components/MuralAcusacao.jsx` · `src/components/mural/RevisaoFinal.jsx` ·
`src/data/localidades.js` · `src/data/dialogos.js` · `src/data/cartas.js` ·
`src/data/intervencoes.js` · `scripts/qa.mjs` · `scripts/qa-ui.mjs` ·
`docs/kb-medicina-legal/supressao-de-vestigios.md` · `docs/biblia-de-vozes.md` ·
`docs/os-r8-fase-0-inventario.md` (novo) · `docs/os-r9-*` (novos) ·
`docs/os-fair-play-s2.md` e `docs/os-r5-mobeis-e-cartas.md` (emendas datadas) ·
`docs/plano-de-sessoes.md` · `docs/pendencias-status.md` · `MORTEM_CONTEXTO.md` · `README.md` ·
este arquivo
**Gate:** lint-prosa sem violação ✓ · qa.mjs CASO VÁLIDO (140 checagens) ✓ · qa-ui.mjs UI
VÁLIDA ✓ · build ✓
**Gate específico:** pipeline `revisar-prosa` com os três revisores, em **três passadas** —
reprovou na primeira (quatro bloqueantes), a segunda achou um em árvore que ninguém tinha
medido, e a terceira fechou com **zero nos dois revisores convocados** ✓ ·
**42 cartas antes, 42 depois**, provado pela GR7-7 ✓ · os quatro perfis dão os quatro
desfechos, com as horas **18h00 · 18h00 · 14h00 · 13h00** conferidas e inalteradas ✓ ·
contrato do `qa-ui` atualizado no mesmo commit que mexeu na string ✓ · `src/gerador/`,
`casos_gerados.js` e `casos_indice.js` fora do diff ✓
**Divergências assumidas:** nenhuma nova. Duas pré-existentes ficam **registadas e não
corrigidas**, por estarem fora da fila (§ próprio).

### A Fase 0, e o que ela mudou no plano antes de o plano começar

A Fase 0 das três OS anteriores mediu jogo; esta mediu **texto**: por arquivo, cada item da
fila com a linha exata e o que o QA toca nela (`docs/os-r8-fase-0-inventario.md`). Rendeu
três medidas, e duas mudaram a OS:

1. **O púlpito NÃO toca o `qa-ui`.** O §3.2 da própria OS e o prompt de arranque diziam que
   tocava; contra a árvore, os pontos abrem por classe (`.ponto-interesse`) e nenhuma
   asserção lê rótulo de ponto. Caiu o custo suposto da Fase 2. **A frase que criou a suposição
   foi encontrada:** `docs/os-fair-play-s2.md:116` afirmava que o QA clica os rótulos das
   estações — é falso, e fez o item 14 do playtest parecer caro em **três OS seguidas**. Ganhou
   emenda datada, porque quem abrir aquele documento primeiro continuaria a ser enganado.
2. **A GR8-4 não tinha um furo: tinha oito.** A fila herdou do pipeline da R6 **uma** rubrica
   repetida verbatim. Escrita como guarda geral em vez de lida como achado, a régua mediu
   **oito**, todas entre nós **co-alcançáveis** — a conversa desce um beat por vez e os
   confrontos correm por canal lateral na mesma sessão, logo cada par se lia de seguida numa
   trilha só. É a lição de método da OS: *uma guarda acha o que uma leitura não acha, e é mais
   barata de escrever do que a leitura é de repetir.*
3. **Dois itens do playtest que o `pendencias-status.md` roteava para cá não eram desta OS**,
   e ficam fechados por triagem em vez de herdados por inércia: o **item 11** já estava
   satisfeito desde a S1 (o `textoDisplay` das cartas de álibi carrega lugar + faixa, no idioma
   que o caso-escola já tinha) e fecha por verificação; o **item 10** (ler a transcrição
   completa da carta amassada) é **lote de UI** — componente novo e prosa nova —, e a S2 já o
   tinha aprovado assim. Num passe de acabamento seria feature sem ordem expressa. Mesmo
   destino para a sala da `porta_beco`, que a R2 tinha registado «para o passe editorial»: custa
   prosa nova, sala clicável na planta e contrato de `qa-ui`.

### A fila, item a item, com o estado de cada um

| Item | Estado |
|---|---|
| Os três rótulos da Estação III (item 14) | ✅ **feito, e por inteiro só na 2.ª passada** — ver abaixo |
| O púlpito de cortiça (achado da R5) | ✅ **feito** — «A escrivaninha das ordens», tampo inclinado e couro |
| A rubrica do colete repetida (não-bloqueante da R6) | ✅ **feito**, e com ela **sete** que ninguém tinha visto |
| «a bancada amanheceu sem lume» (não-bloqueante da R6) | ✅ **feito** — a fala passou a repetir a abertura em vez de a negar |
| O «vinco das nervuras» (achado da R7) | ✅ **feito aos pares**, carta e gesto, e a matéria mudou duas vezes (ver o pipeline) |
| «antes do meio-dia» na bíblia de vozes (achado da R7) | ✅ **feito** — a fonte de código vence a de doc |
| A emenda à KB do §3.4-bis | ✅ **feita, e cresceu** — três consertos em vez de um |
| O QA de fecho (§3.5) | ✅ **feito** — duas guardas removidas, duas tornadas honestas, uma duplicação medida e mantida |
| O `interrogatorio_silas` normalizado | ⛔ **não se fez, e é martelo** (26/07/2026) |
| Carta nova, em qualquer domínio | ⛔ **zero**, e o catálogo sai com os mesmos 42 |

### A Fase 1, e o erro que ela cometeu por lista feita à mão

O motor nunca vazou nada: a Estação III sempre listou **todas** as alegações de hora, as
verdadeiras junto das falsas — o guarda Tobin correndo as tampas da vitrine às 20h na mesma
gaveta que o moço do padeiro. O que concluía pelo jogador era o **nome da gaveta**:

- `III · As Mentiras` / `depoimentos desmentidos` → **`III · Os Depoimentos` / `hora e
  paradeiro declarados`**;
- na revisão final, `Mentiras` → **`Contestados`**, e a mesma relação deixou de ser
  «desmentida» nas duas linhas da tela.

**E ficou meio feita.** O pipeline apanhou três strings do MESMO defeito que sobreviveram na
mesma tela: `Nenhuma mentira confrontada.`, `N mentira(s) de hora exposta(s)` e
`N paradeiro(s) desmentido(s)`. Eu tinha justificado a última como *resultado* do barbante do
jogador, e não etiqueta prévia — o argumento cai, porque **a ligação pode estar errada** (a
Rota 2 do `qa-ui` liga errado e condena um inocente) e ali era o jogo a endossá-la antes do
julgamento. A GR8-2 pedia prova por **lista de strings**; uma lista feita à mão erra assim, e
um `grep` não. A guarda entrou no `qa.mjs`, varre as literais visíveis dos cinco arquivos do
mural, e o contrato do `qa-ui` mudou no mesmo commit.

**Fora do mural a palavra fica.** No monólogo e no epílogo o perito fala **depois** do
julgamento, e ali uma mentira provada é uma mentira.

### As oito repetições, as onze correções, e a regra que as resolveu

**Dois números, e não são o mesmo:** a **GR8-4 mediu oito repetições verbatim**; corrigi-las
mexeu em **dez rubricas** (as oito repetidas, mais o par «Passa a saca de um ombro ao
outro»/«Passa a saca ao outro ombro», que é a mesma rubrica com uma palavra mudada de lugar).
Na primeira passada do pipeline **nove** saíram por corte e uma foi reescrita; na segunda,
**duas voltaram** — as de Grey, que não colidiam com nada — e mais **quatro** caíram nas
árvores de Agnes e Davey, que a primeira passada nunca mediu. O que fica entregue: **onze
rubricas mexidas, sete cortadas.**

Onde eu tinha posto observável novo, entrou o **corte**. A razão é de desenho, e ficou escrita
em `dialogos.js` acima das alfinetadas, no `guia-de-estilo.md` §4.10 e no catálogo da skill
`anti-padrao-ia` (nº 13) — porque uma regra que vive só num comentário de código não é
herdada por OS nenhuma:

> **A fala base de um nó com `alfinetada` não leva rubrica de gesto.** A alfinetada
> imprime-se na MESMA tela, logo abaixo da fala, e é ela o gesto que a exposição paga. Um
> segundo gesto na prosa base ou **contradiz** o primeiro, ou gasta de graça o rendimento que
> o nível existia para comprar.

E contradizia mesmo, em dois sítios que o pipeline provou: «A xícara arrefece ao lado, sem
que a toque» contra o E1 de Silas, que diz que **a xícara do visitante fica por servir** (e a
xícara é do visitante, não dele); «Cruza os braços e não os desfaz até acabar» contra o E1 de
Walter, que põe o botão do colete **preso entre os dedos até o fim da resposta**.

**Um par não verbatim foi corrigido à mão e fica registado:** «Passa a saca de um ombro ao
outro» e «Passa a saca ao outro ombro» são a mesma rubrica com uma palavra mudada de lugar. A
guarda continua **estrita** de propósito — as mãos quietas de Silas e a saca de Grey são
adereços de personagem, e uma guarda difusa reprovaria a caracterização junto com o vício.

**A isenção da guarda é fair play, não conveniência:** nós do **mesmo beat** são alternativas
mutuamente exclusivas, e que o paradeiro de Walter saia com a mesma redação em qualquer tom é
o que a G4 exige — o tom é cor, nunca chave.

**Preço registado:** a limpeza tirou três das quatro plantações de «mãos nos joelhos» de
Silas. Numa trilha cordial ou técnica, o E2 dele («As mãos deixam os joelhos») passa a ser
pago por um plantio só, o da abertura — que é sempre lido. Fica de pé, e fica anotado.

### O QA de fecho: o que saiu, e por quê (GR8-6)

**Removida 1 — «P9 Fase 0 (telemetria da âncora dupla)».** A asserção comparava
`p9Telemetria.total` com `1 + CASOS_POOL.length + CASOS_LUTA.length`, e `total` é o
comprimento do **mesmo array** que a chamada monta com esses três termos: comparava um
comprimento consigo próprio. Não podia falhar, em árvore nenhuma, nunca. E não havia perna
honesta a acrescentar-lhe — a cobertura do banco já é do `indiceBancoOk`, e a classificação é
exaustiva por construção. **A medição fica inteira**, impressa acima, que é de onde a P9 a
leu. O rótulo dizia «só mede», e era verdade; o errado era ela figurar entre as guardas.

**Removida 2 — GR4-1 (teto de cartas).** Cobrava `<= 46`; a GR7-7 cobra `=== 42`, que o
implica. O que a GR4-1 tinha de próprio não era asserção: era a **conta impressa** para a OS
seguinte ler antes de gastar, e essa passou para o rótulo da GR7-7. **O teto da G11 continua
com asserção própria lá, e de propósito:** «=== 42» é o pino desta era, «> 46» é a invariante
permanente — no dia em que uma OS gastar carta com ata, é a segunda perna que continua a
segurar o mural. Na mesma passada, a GR7-7 passou a **contar e a cobrar pela mesma variável**:
imprimia por um nome e cobrava por outro, que é como uma OS futura conserta um e não o outro.

**Tornada honesta 1 — o contrato de assets.** A primeira perna varre o manifesto, e o
manifesto está **vazio**: passava por vacuidade. Quem lesse «manifesto válido» em verde
concluiria que houve arte conferida. O rótulo passa a dizer o número («0 asset(s)
conferido(s)»), e a perna viva — nenhuma arte importada por fora — continua a medir o que
sempre mediu.

**Tornada honesta 2 — os pontos da cena gerada (`qa-ui`).** A checagem media `.ponto-corpo >=
1` **depois** de a linha anterior já ter aberto um ponto e provado exactamente isso; abrir
mais pontos não baixa a conta. Passa a cobrar o que o rótulo promete: todos os pontos do
acordeão abertos, cada um com o seu corpo de prosa — e o rótulo diz o número medido (3, na
réplica).

**Medida e MANTIDA, com a razão escrita:** o `lint-prosa` corre **duas vezes** no
`npm run verificar` (uma por spawn dentro do `qa.mjs`, outra como passo próprio). É duplicação
real, mas compra uma coisa: `node scripts/qa.mjs` sozinho — que o `CLAUDE.md` documenta como
comando de mesa — continua a cobrir prosa. Custa um relatório impresso duas vezes. Fica.

### O parecer do pipeline — reprovou na primeira passada, e o furo era a minha própria Fase 1

**Primeira passada: quatro bloqueantes do editor, dois do fiscal (coincidentes), zero do
perito.** As contagens mecânicas ficaram na linha de base exacta de antes da OS (formula=5 ·
travessao=10 · lexico=8 · zero filtro sensorial, zero monotonia), e ainda assim **seis dos
onze textos novos eram piores do que os que substituíram** — o que é a prova mais dura de que
guarda automática não alcança matéria.

O mais instrutivo não foi uma frase: foi **a Fase 1 estar meio aplicada**, com o mesmo defeito
a sobreviver em três strings da mesma tela que eu tinha acabado de corrigir. O segundo mais
instrutivo foi o **único texto não-observável do lote** — «Deixa passar um instante antes do
resto», no nó da evasiva: hesitação etiquetada pelo narrador, e imediatamente antes de o
assassino repetir a teoria falsa. A KB do craft é expressa (a hesitação vai para a fala), e o
texto que ela substituía era observação pura. Saiu.

**Do perito, três consertos de matéria e um furo que a própria emenda abriu:**

- **«vários milímetros» é metrologia fora de época.** A Inglaterra de 1893 mede em polegadas —
  e a carta irmã do mesmo dossiê diz «meia polegada escassa». Passou a «um carvão da grossura
  da própria pasta», que diz a física da KB («a espessura é o argumento») sem unidade nenhuma.
- **«a pele torrada» → «o pano do forro torrado»** (a KB atesta pano ou meio-couro, e dá ao
  couro no fogo outra fenomenologia: encolhe e fica córneo); **«descasca» → «descama»**, que é
  o verbo de arte; e a **«crosta espessa em camadas» voltou a ser «curva e rígida»**, que é o
  discriminante do lombo de mola — sem ele, a carta passava a ter duas crostas grossas e nenhum
  modo de saber que eram duas peças distintas da carcaça. Este último defeito **foi criado pelo
  meu diff**: ao dar espessura à pasta, emprestei à crosta o argumento que era da capa.
- **O gesto da cena deixou de relistar o laudo** (guia §5, nunca copiar frase entre camadas) e
  passou a narrar o acto: a capa fica de encontro às barras, e ali para.
- **E o furo, que é o achado da OS:** com a queima declarada interrompida, o «**não se lê
  nada**» do dossiê deixou de se sustentar sozinho. O que a interrupção deixa nas bordas frias
  não é folha carbonizada: é folha **tostada** — castanha, retraída —, e essa **lê-se a olho
  nu em 1893**. Se existisse uma no caso, cairia o desenho inteiro da carta (a fome do que
  ardeu é o que manda o jogador à torre). A emenda 1, sozinha, tinha aberto isto.

### Segunda passada: zero bloqueantes, e os três achados foram das próprias correções

**O gate passou.** Os três revisores aprovaram sem bloqueante, e os achados que restaram são
das correções da primeira passada — que é o padrão desta série, e o sinal de que ela funciona.

**A regra que eu escrevi era mais forte do que a árvore.** O editor mediu: dos vinte nós com
`alfinetada`, **treze continuam a levar rubrica**, e dois dos meus nove cortes estavam em nós
**sem alfinetada nenhuma**. Lida à letra, a regra mandaria uma OS futura cortar os treze — e o
beat 3 ficaria sem corpo. Reescrita para o critério que realmente a decidiu: *rubrica que
REPETE ou CONTRADIZ o adereço da alfinetada do mesmo nó sai; rubrica que não colide fica.*

**E ficaria sem corpo justamente para quem tem menos.** As alfinetadas só existem em E1 e E2 —
em **E0 não há nada** —, logo um corte por regra deixaria a fala nua para quem chega de dossiê
vazio. Foi por aí que se viu que **Grey tinha perdido a marca que a bíblia lhe dá** («não para
o serviço para responder»): as duas rubricas dele que eu cortara não colidiam com nada, porque
eram ambiente e olhar. Voltaram, e voltaram **melhores** do que eram — a objeção da primeira
passada era que a mó identificava o lugar e não o falante, e agora ela identifica-o: «Atrás
dele a mó troca de compasso, **e ele não vira a cabeça**». Um homem que não volta a cara quando
o seu próprio moinho muda de ritmo é o moleiro.

**A GR8-2 era cega onde mais importava, e o defeito era o mesmo que a Fase 4 tinha ido caçar.**
A guarda varria literais entre aspas — e a cópia visível do mural mora, em boa parte, em
**texto JSX**, fora de qualquer aspa. Prova: sobreviveu à Fase 1 e à própria guarda a frase
`ligue o vestígio que o desmente, se houver`, na Estação V. Uma guarda que promete a lista
inteira e mede um terço dela é a irmã gémea do «manifesto válido» com o manifesto vazio, e eu
recriei-a duas secções abaixo de a ter consertado. Agora soma o texto JSX (com o descarte das
classes de estilo e das setas de função, que abrem o mesmo casamento que uma tag), **imprime
quantas strings mediu** — 101, em cinco arquivos — e foi provada por reintrodução: com a
palavra velha de volta, reprova.

**Do perito, três consertos, e um deles contra a minha própria emenda.** A frase «Quem para
antes do fim não salva o registro: deixa-o ilegível» — que eu tinha escrito no mesmo commit —
**contradizia frontalmente a emenda 3**, três parágrafos abaixo dela: quem para antes do fim
pode ter deixado folha tostada, e essa lê-se. Ganhou a ressalva. O mecanismo do livro fechado
estava errado desde antes da OS («a camada de carvão sobe a temperatura de ignição» — não
sobe: **isola e barra o ar**), e o «enegrece por inteiro» virou gradiente, que é o que a
matéria faz.

**E o fair play cobrou uma oração.** Com a KB a mandar procurar o fragmento tostado, a carta
passou a ter de mostrar a busca: *«Nas bordas frias do leito e na cinza da pá, nenhuma folha
escapou apenas tostada.»* É observação negativa, não custa carta, e é ela que autoriza o caso
a mandar o jogador atrás do Livro II sem flanco.

**E o fiscal foi buscar as duas árvores que ninguém tinha medido — e achou lá o bloqueante
da segunda passada.** A regra vale para as cinco árvores; a primeira passada só nomeou três,
e eu corrigi as três. Em **Agnes**, a prosa base endireitava a pilha em dois nós enquanto a
alfinetada de E1, no parágrafo imediatamente abaixo, dizia que **«a pilha fica por
endireitar»** — a mesma classe de contradição da xícara e dos braços, viva desde a R6. Em
**Davey**, o beat 3 técnico respondia «de olhos erguidos» e o E2 fazia-lhe os olhos
**subirem** do serviço; e «A vassoura fica quieta.» repetia-se entre o beat 2 e o beat 3, num
sítio que a GR8-4 não via porque a guarda compara **frases inteiras** e ali a oração vinha
dentro de uma maior. E em **Silas**, a alfinetada de E1 continuava a declarar a xícara «por
servir» depois de o beat 1 o ter posto a enchê-la duas vezes — a rubrica que a primeira
passada cortou era o sintoma; a causa estava na alfinetada, e passou a «não torna a
encher-se».

**Duas guardas ganharam perna por causa disto**, e as duas correções são do mesmo feitio da
Fase 4:

- a **GR8-4 passou a ler a `alfinetada`** do nó, e a isenção do mesmo beat exige agora
  também **nós diferentes** — repetição entre a fala e a alfinetada do próprio nó lê-se
  sempre de seguida, sem alternativa. Provada por injeção;
- a **GR8-2 deixou de varrer uma lista à mão.** Um arquivo do mural renomeado sairia da lista
  sem que nada reprovasse, e a guarda passaria a medir menos **e a continuar verde** — que é
  exatamente o defeito que esta OS foi caçar. Varre a pasta inteira (8 arquivos, 111 strings),
  e o número está no rótulo.

**Registada, e é uma cegueira que fica:** a GR8-4 compara frases inteiras, logo não apanha
oração repetida **dentro** de uma frase maior (foi assim que a vassoura de Davey passou). Fica
para o olho do pipeline, e fica escrito aqui para a R9 não a supor mais forte do que é.

**Não acatado, com razão registada:** restaurar «Bate a unha na madeira a cada prazo que diz»
no beat 3 técnico de Walter. O editor deu-o como restauro opcional, argumentando que unha e
botão são gestos sequenciais; mas o E1 dele diz que o botão fica preso entre os dedos **até o
fim da resposta**, e isso é simultaneidade declarada. Recriaria a colisão que a regra existe
para impedir.

### Terceira passada: zero bloqueantes nos dois revisores, e a regra nova a ser testada pelo uso

Correu-se uma **terceira passada focada** — só sobre as correções da segunda — porque a
segunda tinha fechado com um bloqueante, e o gate desta OS é zero. Os dois revisores
convocados devolveram **zero bloqueantes**, e o que acharam foi a regra nova a ser exercitada
contra a árvore pela primeira vez.

**A GR8-2 tinha um buraco provado por injeção, e era o meu descarte que o abria.** Ela
descartava «folha de estilo» pela **forma** — literal só de minúsculas sem acento —, e nessa
rede caíam três rótulos visíveis de verdade: `quando e como`, `hora e paradeiro declarados` e
`por concluir`. Ou seja: a guarda era cega **exatamente no subtítulo que a Fase 1 escreveu**, e
uma injeção de «hora e paradeiro falsos» passava verde. A frase que escapou à Fase 1 só era
apanhada por acidente, porque *vestígio* leva acento. O descarte passou a ser **posicional** —
o que está dentro de um `className=` é classe, e mais nada é —, a conta subiu de 111 para
**123 strings**, e a injeção agora reprova. Terceira vez nesta OS que o mesmo defeito
reaparece com outra roupa: **guarda que mede menos do que promete e continua verde.**

**A minha correção de E1 criou uma regressão no eixo em que o jogador compara.** Trocar «fica
por servir» por «não torna a encher-se» resolveu a contradição e pôs **quatro das cinco
alfinetadas de E1 na mesma perífrase** («não torna a», «sem tornar a», «não torna à», «não
torna logo») — e as cinco saem no mesmo lugar para quem pressiona os cinco suspeitos. Pior: a
falha de compostura perdeu o agente, porque quem falhava passou a ser a louça. Reescrita para
«A xícara do visitante fica pelo meio, e ele não estende a mão ao bule» — o gesto volta a ser
dele, e a perífrase morre.

**Duas rubricas minhas repetiam a FIGURA da alfinetada, não o adereço.** Em Grey, «a mó troca
de compasso, e ele não vira a cabeça» contra o E1 «o carroceiro chama uma vez, e ele não
responde»: dois períodos com a mesma armação (*estímulo, e ele não reage*), e o de cima
gastando o rendimento do de baixo. Cortou-se a segunda oração. Em Agnes, a rubrica nomeava o
papel de luto e o E2 fecha em «não torna a tocar no papel de luto» — o mesmo adereço, duas
designações, e a pressuposição do E2 pendurada. Ficou «Ergue os olhos antes de responder».

**E o achado que mais valia: os dois documentos normativos ensinavam o contrário da regra.**
O guia e a skill citavam como exemplo canónico «a xícara que arrefece contra a xícara que **não
torna a encher-se**» — mas esse par nunca existiu: «arrefece» nasceu e morreu na primeira
passada, e o que colidia com ela era «fica por servir». Quem lesse a norma concluiria que a
frase **aprovada** era a proibida. Corrigido nos dois, e a regra ganhou o que lhe faltava —
três testes que saíram dos achados desta passada:

1. **o mesmo adereço pode voltar se o segundo estado for CONSEQUÊNCIA do primeiro** na ordem
   em que a tela imprime (a farinha que assenta e depois é batida passa; o papel que só se
   olha, sob um «não torna a tocar», não);
2. **alfinetada que diz «não torna a X» pressupõe um X**, e esse planta-se num nó que toda
   partida atravessa — foi por isso que o tique de Agnes foi para a abertura;
3. **são DUAS telas, não uma:** E1 e E2 conferem-se à parte, e a rubrica tem de sobreviver às
   duas.

Acresce a ressalva que faltava no guia (a GR8-4 apanha **só verbatim**; a contradição é
leitura humana), a contenção que faltava na skill (treze dos vinte nós **mantêm** a rubrica —
cortar o que não colide é o defeito irmão), e um despejo executável de `fala` × `alfinetada`
por nó, para a leitura monotemática que o achado exige. A skill era a única do catálogo sem
ferramenta.

**Órfã da renumeração, e estava no pior lugar:** o `lint-prosa.mjs` mandava o autor a «guia
§4.10» quando apanhava vocativo repetido — e §4.10 passou a ser a regra da rubrica. Corrigido
nos dois sítios, incluída a string que o escritor lê na falha.

### A emenda à KB, que entrou como um conserto e saiu como três

O §3.4-bis pedia desacoplar o leito de cinza alto da duração da queima. Executado, o pipeline
mostrou que a emenda **arrastava duas dívidas**:

1. **O leito alto** mede a massa que entrou na grelha, não o tempo que levou a entrar; o
   atiçamento repetido desceu a **sinal acessório**, de queima levada ao fim. E ganhou o seu
   *ceteris paribus*, que faltava: **à mesma massa entregue ao fogo**, o leito interrompido é
   mais volumoso que o completo — sem essa cláusula a frase era falsa no caso trivial de quem
   para ao terceiro punhado. A via está escrita: fogo sobrecarregado abafa, carboniza sem
   consumir, e o que não se consome não colapsa em cinza fina. Daí um discriminante **de
   composição** antes de altura: leito completo é pálido e mineral; interrompido é negro,
   laminar, com carcaça reconhecível.
2. **A deliberação estava ancorada no relógio** («destruição demorada é gesto deliberado») — e
   a interrupção tirou-lhe o chão. Passou para onde sempre pertenceu: **o desmanche**. Ninguém
   desmancha um livro-razão em pânico; arrancar as pastas, romper a costura e separar os
   cadernos é trabalho de minutos com decisão tomada. É melhor física do que a redação antiga,
   porque amarra a intenção ao gesto que a própria física já exigia.
3. **A ilegibilidade ganhou a sua condição:** «não se lê nada» vale para o papel **plenamente
   carbonizado**, e o dossiê passa a exigir que quem se apoie nela declare que a busca do
   fragmento tostado saiu vazia. O exame ganhou um gesto novo — bordas frias, sob a grelha, na
   cinza da pá, atrás do guarda-fogo.

A **nota datada saiu do verbete doutrinário** e foi para a seção «No jogo», que é onde esta KB
guarda as decisões de projeto: o cabeçalho promete tratado técnico impessoal, e vocabulário de
bastidor no meio da matéria quebra a promessa.

### Registadas e NÃO corrigidas (fora da fila, e é decisão de método)

1. **As falas dizem que o livro de ordens está «na bancada»** (`dialogos.js`, Silas e Davey),
   quando as cartas o põem na escrivaninha. É **pré-existente** — era igualmente falso quando
   o móvel se chamava púlpito — e é fala de personagem, onde a linguagem é solta. Fora da fila.
2. **Formas de PT-PT em comentários de código** («utilizador», «registada»), contra a norma
   PT-BR do `CLAUDE.md`. Pré-existente e generalizado nos documentos da reforma; normalizar é
   varredura própria, não passe editorial.
3. **«O carvão frio do fogareiro»** na prosa da oficina, às 13h de sábado, com o fogo da
   bancada aceso naquela manhã. **Fecha** por duas razões que o fiscal verificou: a casa parou
   às 09h20 (ninguém tocou em nada) e «frio», nesta prosa, significa *queimado e apagado* — o
   mesmo arquivo usa «à cinza fria da lareira» para um fogo que certamente queimou.

### O balanço da reforma inteira — as oito OS

Nenhuma outra ata pôde escrever isto, e é o que a R8 deve à série.

| OS | O que entregou | Cartas |
|---|---|---|
| **R1** | Vocabulário policial (**guarda** Wycliffe, «O Posto do Guarda») e o nome do mestre (**Abbot**), por renomeação mecânica verificável | 0 |
| **R2** | A **cena única**: a relojoaria deixou de ser três nós do mapa e passou a **um nó com sub-locais**, com a planta baixa a virar navegação (andar o prédio custa 0h) | 0 |
| **R3** | A **abertura testemunhal** (D13), a pensão, o telegrama e o **coroner fora de cena** (D12) — prazo e autoridade, nunca uma cena | — |
| **R4** | Os **dois livros** do morto, a **cifra**, a torre de S. Miguel e o **veraz sem crédito** (Amos Kell, que aponta e nunca prova) | — |
| **R5** | Os **móbeis** de Agnes e Davey, a **agiotagem** pela aritmética de um livro, e o **tell de contagem** morto por medição em vez de gasto | 2 |
| **R6** | A **exposição** (E0/E1/E2) como função pura das cartas, o **beat 3** nos cinco, a **contaminação** e o `apontadaPor` | **0**, e por decisão: o saldo de 4 foi aceite como número, não como sobra |
| **R7** | A **reconstituição** (D24) entre o mural e o monólogo, sem autor nomeado em nenhum gesto; a **conta de bocas**; a **D25** nos cinco fechos | 0 |
| **R8** | O **passe editorial** e o **QA de fecho**: os rótulos que concluíam, o púlpito, oito repetições de rubrica (onze corrigidas), a KB emendada em três pontos, duas guardas removidas e duas tornadas honestas | 0 |

**O número final:** **42 de 46**, 4 livres. A R5 foi a última a gastar; a R6 podia e não gastou;
a R7 estava proibida pela G9; a R8 é editorial. **Não há mais quem gaste**, e o caso-escola
fecha assim.

**As guardas:** 25 guardas numeradas da reforma vivas no `qa.mjs` (GR2-1, GR4-2…GR4-6,
GR5-3/4/6, GR6-3…GR6-9, GR7-1…GR7-7, GR8-2, GR8-4), dentro de **140 checagens**. Duas
guardas removidas nesta OS, ambas com justificação — e é a única fase da reforma que o pôde
fazer.

**Três lições de método que a série provou, e que a R9 herda antes de herdar qualquer padrão:**

1. **Medir antes de escrever poupa uma fase, quatro vezes em quatro.** A paridade dos móbeis
   na R5, o corte de exposição na R6, o tamanho da cena na R7, a fila de rubricas na R8 — em
   todas, a Fase 0 desmentiu a suposição que teria guiado o trabalho.
2. **Guarda vale mais do que leitura, e é mais barata.** A GR8-4 achou oito onde três
   revisores tinham achado uma. Uma régua escrita mede sempre; um olho mede uma vez.
3. **O pipeline não é formalidade — é onde a matéria se decide.** Reprovou na primeira passada
   em R3, R4, R5 e R8; em R7 apanhou o pivô do caso escrito ao contrário, visto por **um** dos
   três; em R8 apanhou a minha própria Fase 1 meio feita e seis textos piores do que os que
   substituíam. As contagens automáticas estavam perfeitas em todas as passadas — o que elas
   medem nunca foi o que estava errado.
4. **Uma regra nova não fica pronta quando se escreve: fica pronta quando se usa.** A regra da
   rubrica nasceu na segunda passada, e a terceira mostrou-a larga em três pontos, com os dois
   documentos normativos a ensinar o exemplo invertido. Toda regra que a R9 herdar da reforma
   deve passar por uma passada de USO antes de se dar por escrita.

### Aberto para a OS seguinte

- **OS-R9 — o gerador herda os padrões** (`docs/os-r9-gerador-herda-os-padroes.md`, com prompt
  de arranque próprio). **Sai da reforma**: o alvo deixa de ser um caso à mão e passa a ser 31
  casos embarcados, 155 árvores de diálogo e um banco que é **produto** (G12). A fila tem dez
  itens, medidos contra a árvore: procedência (`apontadaPor` — hoje só o caso-escola a tem, e é
  por isso que a `contarVozes` da R7 trata alegação sem procedência como voz própria);
  exposição E0/E1/E2 (**zero** ocorrências em `src/gerador/`); o veraz sem crédito; o móbil por
  aritmética de livro; o degrau de confronto por contador autoral (**nenhuma** árvore gerada tem
  `degraus`); as **intervenções da noite** (sem catálogo, `montarReconstituicao` devolve `null`
  nos 31 — e destravá-lo arrasta a **dívida de geografia** de `reconstituicao.js` no mesmo
  commit, porque as três aberturas da cena cravam a relojoaria dentro de `src/logic`); o
  vestígio **durável** do instrumento lavado; as classes de **roupa queimada** e **documento
  queimado**, que a KB tem e o gerador não; e a **GR8-4 no gerado**.
- **A GR8-4 no gerado, já medida no fecho desta OS:** 31 casos, 155 árvores, **11 casos com
  repetição verbatim entre nós co-alcançáveis, 55 ocorrências — e uma frase só**, «Nada de
  nota.», todas em nós `exigencia_*`. Fora dali o derivador varia as rubricas. **É decisão
  antes de ser trabalho:** a resposta nula uniforme pode ser fair play, porque variar o «nada
  aqui» faria do estilo um sinal — e o jogador aprenderia a ler no floreado o que a marca não
  diz. A recomendação escrita na R9 é manter uniforme e isentar por nome na guarda.
- **Lote de UI:** o item 10 do playtest (ler a transcrição completa da carta amassada).
- **Lote do caso-escola:** a sala da `porta_beco` (prosa nova, sala clicável na planta,
  contrato de `qa-ui`).
- **Para o playtest humano, e continua a ser o item com número:** os perfis **Intuitivo** e
  **Pericial Desatento** chegam à reconstituição com **0 de 9** gestos rebatíveis, e o segundo
  **condena**. Medir se a cena curta se lê como consequência da própria colheita ou como
  defeito. Se não se ler, o remédio é **de prosa**, nunca de mecânica.
- **Sem dono, e é decisão de mesa:** o prazo do inquérito com consequência mecânica (ficção só,
  martelado na R3); a normalização do `interrogatorio_silas` (martelada como **não fazer**).
- **Fora de toda a série** (OS-R0 §8): a camada psíquica, o pivô visual de gravura, o bug de
  `reacao_vital`.

---

### 26/07/2026 — OS-R9: O gerador herda os padrões

**A primeira OS fora da reforma.** As oito anteriores tinham um alvo único e artesanal, e
podia-se ler o caso inteiro antes de mexer nele. Esta tem 31 casos embarcados, 155 árvores
de diálogo e um banco que é **produto** (G12). A consequência de método é toda: aqui um
achado não é uma frase, é uma **distribuição**, e nenhuma leitura cobre 31 casos.

**Decisões aplicadas:** D8 (contador autoral), D16, D17, D24. **Guardas verificadas:** G2, G3,
G4, G5, G6, G7, G9, G10, G12.

**Pontos de decisão do §5, recolhidos de uma vez no arranque, e os três pela recomendação:**
(a) a resposta nula da exigência fica **uniforme**, isenta por nome; (b) catálogo de gestos
com **teto nove e piso três**; (c) **mantém-se** a ordem das Fases 3 e 4.

#### A telemetria da Fase 0, e as três medidas que mudaram o plano

A Fase 0 mediu lote, item a item do §2. Sete medidas confirmaram a fila sem emenda. Três
não:

| | Antes |
|---|---|
| Casos com mapa de procedência | **0/31** |
| Casos cuja árvore declara nível de exposição | **0/31** |
| Suspeitos gerados que **não alcançam E1** | **71/155 (46%)** |
| Árvores **sem confronto nenhum** | **53/155 (34%)** |
| Casos com catálogo de gestos | **0/31** |
| Cartas marcadas `insuficiente` | **0** |

**A primeira é a que decidiu a OS.** O corte relativo da R6 protege o NÍVEL e não protege a
ESCADA: com dossiê de uma carta, `corteDeE2(1)` é um, e o suspeito salta de E0 a E2 sem nada
entre as duas. Medido em seguida: **o réu alcança os três níveis em 31 casos de 31; os
inocentes, em 43%.** Portar o beat 3 como estava teria posto um delator em 31 casos — e
nenhuma guarda o apanharia, porque todas olham o corte.

**A segunda desmentiu a própria OS.** O §2.5 supunha confronto com segunda camada em TODAS as
árvores geradas. São 102 de 155. Logo a exposição e o degrau não são dois itens que andam
juntos por agenda: são o mesmo item, e o item é **densidade de dossiê**.

**A terceira decompôs o número da R8 sem o contradizer.** Os «55» são ÁRVORES (11 casos × 5
suspeitos); os SÍTIOS são 137, de 165 nós `exigencia_*`. Uma frase só, e 83% dos nós de
exigência imprimem-na — o que reforça a decisão (a): variá-los seria escrever 137 redações
de «não há nada aqui», cada uma um sinal.

#### O que o gerador passou a saber fazer

| Padrão | Antes | Depois |
|---|---|---|
| Procedência (D17) | 0/31 | **31/31**, 199 entradas, feixe em 20 (65%) |
| Feixe da D16 (boca posta por terceiro) | 0/31 | **3/31** |
| Exposição: os três níveis alcançáveis | réu 100%, inocente 43% | **100% e 100%** |
| Árvores com confronto | 102/155 | **155/155** |
| Beat 3 (declara o nível, paga a alfinetada) | 0 árvores | **155 árvores × 4 tons** |
| Degrau de confronto (D8) | 0 árvores | **155 árvores**, corte = `corteDeE2` da própria lista |
| Reconstituição | 0/31 | **12/31**, 47 gestos, 3,9 por caso |
| Geografia da cena dentro de `src/logic` | 3 aberturas + 3 fechos | **nenhuma** |
| Classes de vestígio | 34 | **35** (o durável do instrumento lavado) |

**O feixe da D16 já estava gerado, e ninguém o registava.** O sistema de interferência faz o
ator subornar uma testemunha, e a carta de retratação que nasce dali é, literalmente, a
versão que ele pôs na boca dela — que junta ao álibi do próprio ator dá duas alegações e uma
boca. O desenho de Silas com Davey e a Sra. Wick, produzido pela simulação em vez de escrito
à mão.

**A exposição consertou-se na origem, e sem carta nova.** O confronto gerado só existia para
carta que fosse da pessoa ou tivesse saído da boca dela. Agora há um PISO: o perito pode pôr
diante de qualquer um as duas peças que todo caso tem — o que o corpo mostra e a última hora
em que se viu a vítima viva. Nenhum dossiê fica abaixo de dois, e os três níveis passam a ser
alcançáveis por construção.

**O degrau amarrou-se à exposição em vez de inventar um segundo eixo:** a lista é o dossiê do
próprio suspeito, e o corte é o próprio `corteDeE2`, importado do motor e não copiado. O
degrau cai exatamente quando a conversa chega ao nível mais fundo — é a exposição DITA.

**A dívida de geografia foi paga no commit que a faria vazar**, como a R7 previu. As três
aberturas e três dos quatro fechos cravavam a relojoaria, o balcão, a oficina e a BANCADA —
mobília de relojoeiro — dentro de um módulo de lógica. O texto saiu para o pacote
(`cenaDaNoite`); o módulo guarda a régua e não conhece mais nenhum cômodo.

#### O que o gerador continua a não saber fazer, e com número

- **§2.3 — o veraz sem crédito:** **0 cartas `insuficiente` em 31 casos.** O arquétipo não
  existe, nem por acidente.
- **§2.4 — o móbil por aritmética de livro:** 31/31 provam móbil por depoimento e por
  vestígio social; **nenhum** por soma de livro.
- **§2.9 — roupa queimada e documento queimado:** as duas classes continuam ausentes das 35.
  Os dossiês de KB estão escritos e são dos melhores que o projeto tem.

**Os três ficaram por fazer, e a razão é a mesma para os três:** cada um exige **família de
carta nova** em muitos dos 31 casos, e carta nova mexe no equilíbrio que `metodicoResolve` e
os quatro perfis validam. Não é trabalho de ajuste; é trabalho de OS, com Fase 0 própria.
Fazê-los à pressa no fim desta seria exatamente o «aproveitar a viagem» que o §3 escreveu
para fora.

#### O achado que fixa o teto da reconstituição, e não estava na fila

**O teto dos doze casos não está no catálogo: está na ponte.** Medido: `mobilia_recomposta` é
a arrumação mais comum do banco — **20 ocorrências** —, e a ponte não lhe dá carta nenhuma.
Idem `assoalho_esfregado` (5), `trilha_arrasto` (2), `louca_lavada_fora_de_hora` (1),
`assoalho_esfregado_faixa` (1). O `crime.js` deposita esses vestígios de segunda ordem — a
conservação da evidência do §3.3 do design manda —, o jogo não os mostra, logo o jogador não
os pode colher, logo nenhum gesto os pode desfazer.

É um furo da própria conservação: o óbvio vira sutil, e o sutil vira invisível. **Dar carta a
`mobilia_recomposta` subiria a reconstituição de doze para perto de trinta**, e é a coisa de
melhor rendimento que ficou em aberto neste repositório.

#### As guardas novas

**GR9-1** procedência no banco: cobertura dos álibis, lastro de carta e de boca, feixe em
banda 40–95%, e toda alegação de forma `ensaio`/`coacao` com o evento que a sustenta — a
perna que impede o mapa de saber o que o caso esconde.
**GR9-2** paridade de exposição em lote: os três níveis alcançáveis por todos os 155, a média
de níveis do réu igual à do inocente (qualquer diferença É o tell), e o derivador do beat 3
cego ao papel por leitura de fonte.
**GR9-3** a noite no banco: sem marcador de carta e sem nome de gente na prosa da cena, todo
`exige` existente, catálogo entre 3 e 9, e a geografia fora de `src/logic`.
**GR9-5** a GR8-4 sobre as 155 árvores, com a isenção **por nome** (165 nós de exigência) e
nunca por tolerância numérica.
**GR9-6** toda classe de vestígio cita a KB por arquivo e linha — exigência que já valia para
arquétipos e não valia para a matéria forense.

#### Três coisas que a execução ensinou

1. **Uma guarda pode medir ruído de amostragem e chamar-lhe tell.** A primeira versão da
   GR9-2 exigia que nenhuma fala de beat 3 fosse exclusiva do réu; com 256 textos possíveis,
   31 réus e 124 inocentes, isso é exigir que uma coincidência não aconteça. O que é
   verificável é a PROPRIEDADE (o derivador não lê o papel), e prova-se por fonte. O mesmo
   valeu para o ofício que calha só a réus: mede-se em banda, com o número publicado.
2. **Uma guarda de fonte tem de retirar os literais antes de varrer.** A prosa do derivador
   diz «ponha no papel» na boca de um suspeito, e a guarda acusou o gerador de consultar o
   papel dramático por causa de uma folha de papel. Mede-se código; a prosa mede-se noutro
   lugar. É a lição da GR8-2 da R8, noutra roupa.
3. **A quarta lição da R8 repetiu-se, e agora com número.** «Regra nova não fica pronta
   quando se escreve: fica pronta quando se usa.» Das cinco correções da 2.ª passada,
   **três foram causadas pelas correções da 1.ª** — a reescrita que estreitou uma célula
   de lavradores para vacas (a classe também tem pastores), a coordenação que a minha
   emenda do constable quebrou, e o vigário que passou a dizer «no domingo» depois de o
   comerciante ter passado a dizer «amanhã é domingo». Numa OS cujo produto é prosa que 31
   casos vão imprimir, uma passada só é meia passada.
4. **Um gerador denuncia-se numa preposição.** Saíam «No cozinha», «A mesma a noite de sexta»
   e «em cottage nº 3». Cômodo e prédio passaram a entrar como sintagma de lugar, com o
   artigo resolvido — o do prédio pelo mesmo `formasDoLugar` que o resto do gerador já usava.

**Arquivos tocados:** `src/gerador/procedencia_gerada.js` (novo),
`src/gerador/intervencoes_geradas.js` (novo), `src/gerador/dialogos_gerados.js`,
`src/gerador/pacote_gerado.js`, `src/gerador/vestigios.js`, `src/gerador/crime.js`,
`src/gerador/ponte_caso.js`, `src/data/procedencia.js`, `src/data/intervencoes.js`,
`src/data/pacote_caso.js`, `src/logic/contaminacao.js`, `src/logic/reconstituicao.js`,
`src/logic/monologo.js`, `scripts/qa.mjs`, `src/data/casos_gerados.js` (produto),
`src/data/casos_indice.js` (produto), `docs/os-r9-fase-0-telemetria.md` (novo).

**Gate:** lint-prosa **zero** · qa.mjs **CASO VÁLIDO** (145 checagens, **30 guardas
numeradas**) · qa-ui.mjs **UI VÁLIDA** · build **limpo** · banco regenerado byte a byte.
**Pipeline de prosa: três passadas, 28 correções** — e as guardas automáticas estavam
verdes em todas as três. A 1.ª achou cinco bloqueantes, e os três melhores são
estruturais: a classe `criadagem` cobre o guarda-caça, que é sempre homem, e a fala vinha
no feminino; o grupo `chao` do piso cobre o constable, que dizia «não sei ler nem o nome»
num arquivo onde as falas dele lavram o livro de ocorrências; e o inquérito corre no
sábado, logo «amanhã» é domingo — três células punham loja, oficina e ronda a abrir. A
2.ª achou cinco, e **três eram consequência das correções da primeira**. A 3.ª (perito)
não achou bloqueante nenhum no §2.8, e achou que **«coágulo» no rótulo da carta é
conclusão** — só Teichmann estabelece que a matéria é sangue —, que o anel de tintura na
cortiça é durável e não perecível, e que o pó de arsênico não tem física de secagem.
**Gate específico:** os 4 perfis produzem os 4 desfechos na réplica, no pool e no lote de
luta; o caso-escola sai intocado (42 cartas, horas 18h00 · 18h00 · 14h00 · 13h00).

**Divergências assumidas:** a Fase 4 entrega **um** dos quatro itens (§2.8); §2.3, §2.4 e
§2.9 ficam abertos com a razão medida acima.

### Aberto para a OS seguinte

- **A carta de `mobilia_recomposta`** — 20 ocorrências sem carta, e o melhor rendimento em
  aberto: sobe a reconstituição de 12/31 para perto de 30/31. Com ela vêm
  `assoalho_esfregado` e as três irmãs.
- **§2.3 o veraz sem crédito, §2.4 o móbil por aritmética, §2.9 os dois queimados** — os três
  restantes da fila da R9, cada um com família de carta nova e Fase 0 própria.
- **Lote de UI:** o item 10 do playtest (transcrição completa da carta amassada).
- **Lote do caso-escola:** a sala da `porta_beco`.
- **Para o playtest humano, agora com número novo:** a reconstituição existe em 12 dos 31
  casos gerados. Medir se a AUSÊNCIA dela nos outros 19 se lê como fim de caso normal ou como
  peça que falta.
- **Fora de toda a série** (OS-R0 §8): a camada psíquica, o pivô visual, o bug de
  `reacao_vital`.

---

### 26/07/2026 — OS-S1: A Proposta Mestra v4, "A Hora Emprestada"

**Fonte de desenho:** Proposta Mestra v4, que consolida e supersede a v3, a v3.1, o
dossiê de elenco e teia e o adendo de Agnes. A OS executável está em
`docs/os-s1-a-hora-emprestada-v4.md`.

**Decisões aplicadas:** PD-01 a PD-21, as vinte e uma recomendações aceites em bloco,
com **uma divergência declarada** (PD-07, abaixo).
**Guardas verificadas:** G1, G3, G4, G7, G9, G10, G11 (recortada), G12 · GR4-2, GR4-5,
GR4-6, GR5-3, GR5-4, GR5-6, GR6-4, GR6-5, GR6-7, GR6-8, GR6-9, GR7-3, GR7-7 (recortada).
**Guardas novas:** GRS1-1 a GRS1-4.

#### O diagnóstico que a proposta trouxe, e que o código confirmou

Três defeitos localizados, e uma causa estrutural por baixo dos três. **O assalto morria
sem rosto** (`ev_vitrine`/`ev_fechadura` carregavam a refutação à vista e nenhum ser
humano habitava a solução falsa). **A agiotagem fora contida por decisão** (R5 §5(d),
"sem carta própria"): a espinha do caso era invisível por desenho. **A D15 não tinha
livro em que morar** — "Wycliffe está no livro" e não havia registro de credor algum.

E a causa: **topologia em estrela.** Todo personagem ligava à vítima e a mais ninguém.
Um caso assim resolve-se por eliminação de raios; um caso em teia resolve-se por leitura
de vila.

#### O que entrou

**O sexto homem (PD-01/02/03).** Nathan Herrick, recoveiro, `inocente_segredo` com
segredo `penhor_recolhido`. Papel dramático novo, `bode_expiatorio`: móbil e acesso
verdadeiros, e uma passagem pela cena que ele esconde por medo do que fez lá — não do
crime. Árvore de diálogo completa (quatro tons, três beats, alfinetadas E1/E2, três
confrontos), e a **cela** como único nó que nasce fechado, aberto pela extração de
`dep_avistamento_padeiro`. A dobradiça do ato é um ATO DO INQUÉRITO, e não uma dedução
do jogador — é por isso que ela pode fechar um ato sem ferir a G4.

**A Frente A (PD-04/05).** `ev_livro_emprestimos`, na gaveta com chave. Reabre a R5 §5(d)
com ata. Aritmética primária, sem a palavra "juros": um penny por xelim por semana faz a
dívida ficar parada, e é a mesma armadilha que o livro de pagamentos já ensinava com o
salário do aprendiz. Traz "N.H." com o penhor, "L.W." vazia desde julho (a D15 enfim com
corpo), "S.C." com a soma repetida em cada fim de mês (PD-08), "A.R." riscada em setembro
e a "—W." antiga (a moeda da coação, PD-14).

**A Frente B — três interferências.** Na máquina da FASE 4, que estava pronta e inerte
desde o gerador por simulação: **nenhuma linha de motor mudou para isto.** Coagir a
testemunha da viela (gatilho: pôr o pé na papelaria, que é o correio da vila), correr à
torre (gatilho: pousar um papel diante do oficial) e silenciar o preso (gatilho: pousar
um papel diante dele). Nenhum anúncio nomeia ninguém. Papel lavrado não morre com a boca
que o ditou, e é essa a G4 realizada em mecânica: quem tomou o termo antes de confrontar
guarda-o.

**A teia.** As arestas E1–E15 em cena, e a primeira cadeia de confronto do jogo que
atravessa DUAS ÁRVORES: a papelaria entrega o maço de cartas e a chave que o morto citou
à ceia ("sangue meu"), e é ela que abre o terceiro degrau de Walter — a delação
premeditada (PD-19/20/21). A mecânica é a que já havia: contador autoral sobre lista
curada (D8), sem carta nova.

#### A divergência declarada — PD-07 (anéis de ato)

A proposta pedia que o mapa endurecesse em três anéis. **Executou-se só o anel do Ato
III** (a cela). Os demais não, e a razão é dura: a G10 e a `GR4-5` exigem que a torre
nasça aberta e que nenhuma cadeia dependa de ordem única; fechar posto, estalagem,
papelaria e moinho atrás de leads reescreve o gate de QA da interface inteira e
transforma a topologia do caso. É trabalho de OS própria, com ata própria, e não efeito
colateral desta. A proposta já previa a fricção ("G10 ressalvada por ata"); a ata é esta.

#### O defeito que a guarda achou

`apresentarProva` chamava `dispararInterferencias` DEPOIS de um `return` que só se
atravessa quando a prova rende ligação de mural. Logo, um confronto que só rendesse
reação nunca chegava à vila. Era silencioso enquanto nenhum caso usava o gatilho
`prova_apresentada` — os casos gerados usam `extracao_carta` —, e as três interferências
do caso-escola o tornaram visível na primeira execução da GRS1-4. O gatilho passou para
antes do return, que é onde o comentário da FASE 4 sempre disse que ele estava.

**Arquivos tocados:** `src/data/seed.js`, `cartas.js`, `dialogos.js`, `localidades.js`,
`mapa.js`, `mapa_espacial.js`, `aparencias.js`, `papeis.js`, `procedencia.js`,
`confrontos.js`, `rotulos.js`, `pacote_caso.js`, **`interferencias.js` (novo)** ·
`src/logic/veredicto.js` · `src/store/jogo.js` · `src/components/EventoLocalidade.jsx` ·
`scripts/qa.mjs`, `qa-ui.mjs`, `lint-prosa.mjs` · `MORTEM_CONTEXTO.md`, `README.md`.

**Gate:** build limpo · `qa.mjs` CASO VÁLIDO (os 4 perfis, os 4 desfechos, e os 31 casos
gerados intactos) · `lint:prosa` zero violações · `qa-ui.mjs` UI VÁLIDA.
**Gate específico (PD-10):** o teto de cartas subiu de 42 para 51, e o gate honesto foi
pago — a rota do Metódico no `qa-ui.mjs` percorre o mural com o dossiê inteiro na mesa,
incluindo os juízos dos cinco periféricos.

**Divergências assumidas:** PD-07 parcial (só o anel do Ato III), pela razão acima.
A OS "Reação Vital Condicionante", que a proposta punha entre as duas escadas, **não
foi escrita**: a proposta a declara "recomendada, não bloqueante na forma auto-de-exame",
e a cela entrou como auto de exame.

#### O pipeline `revisar-prosa` — o que os três acharam

Passada obrigatória (regra do `CLAUDE.md`), com os três revisores em paralelo.
**Resultado: seis bloqueantes, todos corrigidos, e o gate repetido a verde.**

O **`perito-forense`** não achou bloqueante e confirmou a leitura da cela contra
`kb-medicina-legal/encenacao.md`, cláusula a cláusula. Acataram-se quatro correções
de fundamentação, e a primeira é a que importa: **palidez e pergaminhamento não
discriminam** — ocorrem nos dois sulcos, e o que separa é a infiltração sob a pele,
que quer dissecção. O exame externo ficou com o que alcança (a margem que reagiu e a
que não reagiu, a largura frouxa da tira de fazenda), e o mestre passou a carregar a
reserva honesta em vez de a esconder. Entraram ainda a **tarimba presa** à parede
oposta (prova de peso maior que a geometria do sulco: não havia de onde se lançar), o
**encaixe da tira no rasgo da fralda** — uma das duas portas de individualização que
1893 tem — e o penhor dito «pelas três libras de março», que desfazia a leitura de um
segundo empréstimo.

O **`editor-critico`** reprovou com três, e os três eram de fair play, não de gosto:
a `vozMestre` do auto **concluía autoria** («quem o pendurou não sabia que a pele
guarda a conta»); `ev_pegada_argila` **reconstruía o trajeto** de quem não estava em
cena; e — o pior — **o segundo termo nunca era dito em cena**: os quatro b2 de Herrick
pediam que se escrevesse e marcavam a carta, e o jogador tinha de abrir a gaveta para
saber o que lhe haviam dito. É o §5.1 na letra, e a `GR10-1` não o apanhava por só
cobrir cartas de álibi. Mais: os **tiques emprestados** devolvidos aos donos (exigir
que se escreva é de Grey; dar as horas sem as procurar é a assinatura declarada de
Silas, e pô-la no recoveiro apagava o defeito que denuncia o oficial), treze fechos
epigramáticos aplainados, o vocativo «senhor» de oito para dois, e os ecos de
interferência reescritos onde eram paráfrase dos genéricos.

O **`fiscal-continuidade`** achou três bloqueantes de mundo. **O fio das «cartas que
não iam no saco» não existia no papel** — vivia só na proposta e nos comentários, e
o rótulo de confronto de Agnes citava um termo que nada dizia de correspondência.
**O preso estava na cela desde sábado**, e o prenúncio dizia que o oficial passara
por ali «desde a véspera», que é sexta. E **a prosa-base da cela era incondicional**:
disparado o silenciamento, lia-se o recoveiro sentado na tábua e, no parágrafo
seguinte, o auto de exame do enforcamento dele. O preso vivo passou a bloco
contingente, pelo mesmo padrão com que o posto troca o relato da Sra. Wick pela
retratação.

Aprovado por prova positiva, e vale registrar: o calendário fecha (13/out = sexta,
15/out = domingo, contra os proclamas e o aro «pronto até 30 de outubro»); as vinte e
nove sextas de 31/mar a 13/out conferem; a taxa de um penny por xelim governa os dois
livros com a mesma aritmética; e a noite fecha boca a boca — briga pouco antes das
sete, estalagem às 19h40, Tobin às 20h, a ceia, a saída de Agnes pouco antes das nove,
o buril às 21h.

### Aberto para a OS seguinte

- **Os anéis do Ato I e do Ato II** (PD-07 por inteiro), com o gate de QA da interface
  refeito no mesmo commit.
- **A OS "Reação Vital Condicionante"**, ainda ausente do repositório.
- **Playtest humano do mural a 51 cartas**: a máquina percorre-o; medir se a mesa a 51
  ainda se lê, ou se a Estação II satura.
- **Medir se as três interferências se leem como AUTORIA** ou como acaso: a R3 manda que
  a autoria seja reconstruível de trás para frente, e isso só um humano diz.
