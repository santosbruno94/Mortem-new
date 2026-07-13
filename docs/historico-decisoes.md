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
