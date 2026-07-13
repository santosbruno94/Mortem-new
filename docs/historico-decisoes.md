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
