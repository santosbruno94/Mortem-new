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
- **0.6 — EM ABERTO (decisão do usuário):** ligar o relógio forjado (domínio
  `ambiental`) à âncora Presença é aceito e ignorado pelo nexo. Opções apresentadas:
  (a) manter e registrar como ambiguidade deliberada — coerente com "nada valida até o
  julgamento"; (b) restringir `sustenta_presenca` a cartas com tag de presença
  relevante — ensina no ato, mas mexe na gramática do motor e encolhe a armadilha;
  (c) feedback visual de "fio frouxo" — ensina sem bloquear, mas vaza o juízo do motor
  antes da submissão. Recomendação do agente: (a). Nada implementado.

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
