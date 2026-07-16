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
