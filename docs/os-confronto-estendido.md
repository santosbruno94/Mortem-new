# OS — Confronto estendido: fuga da vítima, métodos novos e o preço da desordem

> **Instruções de execução (agente de código).** Leia, nesta ordem: `CLAUDE.md`,
> `docs/game-design-simulacao.md` (§2 e §3), `docs/os-camada-psiquica-do-elenco.md`
> (a OS em curso — coordenação obrigatória, §0 desta OS),
> `docs/kb-medicina-legal/` (`README.md`, `traumas.md`, `asfixias.md`, `venenos.md`,
> `vestigios.md`, `tanatologia.md`, `protocolo-exame.md`, `vocabulario-de-epoca.md`,
> `fontes.md`, `lacunas.md`), `src/gerador/crime.js`, `src/gerador/metodos.js`,
> `src/gerador/vestigios.js`, `src/gerador/interiores.js`, `src/gerador/caso.js`,
> `src/data/catalogo_causas.js` e `scripts/qa.mjs`.
> **Primeiro commit:** gravar esta OS em `docs/os-confronto-estendido.md`.
> A execução se divide em **dois PRs** (§0 e §6): **PR-A** (Fases 0–3, só
> documentação) roda **desde já, em concomitância** com a OS psíquica; **PR-B**
> (Fases 4–7, código) **só nasce após o merge** do PR da OS psíquica, a partir de
> `main` atualizado. Um commit por fase; **ata parcial** ao fechar o PR-A; **ata de
> fechamento** ao fim do PR-B. Pontos **[DECISÃO DO USUÁRIO]** interrompem a
> execução: registrar a dúvida em ata parcial e parar. Divergência entre KB e
> necessidade do motor é decisão do usuário, nunca do agente (`CLAUDE.md`). Nada
> além do especificado entra em código: melhoria percebida vira nota na ata, não
> commit.

---

## 0. Coordenação com a OS em curso (regras de concomitância)

Marco de referência: **M-C = merge do PR da OS da camada psíquica**.

- **Território do PR-A desta OS (livre desde já):** `docs/os-confronto-estendido.md`
  e `docs/kb-medicina-legal/*` — arquivos que a OS psíquica **não** toca.
- **Proibido no PR-A:** editar `docs/game-design-simulacao.md`,
  `docs/kb-producao/*`, qualquer coisa em `src/**` e `scripts/*`. São território da
  OS psíquica ou arquivos compartilhados; toda edição neles fica para o PR-B.
- **PONTO DE ESPERA** entre as Fases 3 e 4: encerrar o PR-A, registrar ata parcial
  e **parar**. A retomada (PR-B) só ocorre por ordem expressa do usuário
  confirmando M-C; o branch do PR-B nasce de `main` já contendo a OS psíquica.
- Esta OS **consome** produtos da OS psíquica (vetor + polaridade da vítima) e faz
  uma única extensão de dados pós-merge (campo `sobAtaque` em
  `vetores_psiquicos.js`, §4.4). Ela não redesenha nada daquela OS.
- Se a OS psíquica destacar a encenação condicionada (§7 dela) para OS própria, o
  PR-B desta absorve a amarração do §4.6 na mesma Fase 5, registrando em ata.

## 1. Objetivo

- **(a)** Dar à vítima ações próprias no resolvedor de crime: **resistir × fugir ×
  gritar**. A fuga é **interna e dirigida** (cômodo a cômodo, rumo à porta
  externa); alcançar a rua permanece condição de **rejeição** da batalha — o crime
  sempre se consuma.
- **(b)** Condicionar essas ações a **dois portões**: o **físico** (método + lesões
  já sofridas — capacidade de ação pós-lesão, ancorada na KB) e o **psíquico**
  (vetor + polaridade da vítima, produto da OS em curso; pesos, jamais regra dura).
- **(c)** Fazer a desordem **custar**: rastros entre cômodos, esfregaço de limiar,
  mobília danificada em dois ambientes, lesões de sítio posterior, grito com hora
  própria, corpo caído longe do início — contra um orçamento de limpeza que **não
  cresce** com a bagunça.
- **(d)** Ampliar a KB de medicina legal: seção transversal de **dinâmica do
  confronto** + dossiês de **métodos novos** (sufocação, precipitação, afogamento,
  láudano; espingarda como dossiê de mundo).
- **(e)** Estender o catálogo `METODOS` com os campos novos e com os métodos cuja
  viabilidade o inventário da Fase 3 confirmar (§4.3).

## 2. Não-objetivos (v1 desta OS)

- **Nada muda no runtime do veredicto.** R1–R6 intactas; condena-se por
  materialidade (janela + causa + nexo); psicologia jamais condena.
- **A vítima nunca escapa de fato.** Fuga externa = batalha rejeitada e reamostrada
  (padrão vigente). Nenhum desfecho de caso com vítima sobrevivente.
- **Sem perseguição simulada.** O assassino permanece adjacente à vítima por
  construção, como hoje; nada de pathfinding de agente, iniciativa própria ou
  segundo grid de movimento.
- **Sem atributos novos de personagem.** FOR/INT/WIS existentes bastam; nada de
  agilidade, coragem ou similar.
- **Sem terceiro cenário de crime.** Seguem premeditado / briga escalada.
- **Vocabulário:** nada pós-1893 em superfície (lints L1/L2 da OS psíquica seguem
  valendo). Em particular: "overdose" é banida — a língua do jogo diz **"dose
  excessiva"**; jargão de reação de estresse moderno ("luta ou fuga" como termo
  técnico) fica fora até de identificadores.
- **Interiores não são redesenhados.** No máximo a convenção mínima de passagem do
  §4.5, e mesmo ela condicionada a decisão do usuário se exigir tocar a geração.
- **Espingarda de caça não entra no catálogo jogável** nesta OS (só dossiê de KB);
  ver [DECISÃO DO USUÁRIO] D4.

## 3. Contrato com o que existe (não muda)

- **Determinismo total:** toda variação por `hashString(seed + sal)`
  (`src/logic/hash.js`); rejeições reamostram com sal incremental; zero
  `Math.random`/`Date.now` (guarda no `qa.mjs`).
- **Reamostragem por rejeição** (§2.1 do game-design): o assassino sempre vence; a
  fuga externa vira apenas um **novo motivo de rejeição** (`vitima_escapou`) ao
  lado dos existentes (`assassino_ferido`, `vitima_resistiu`).
- **Regra de existência** (§2.3): variável de batalha só entra em
  `registro.variaveis` se evidenciada por vestígio/evento sobrevivente; senão,
  `metadados.variaveisInertes`. Vale para ação da vítima, rota e grito.
- **Conservação da evidência** (§3.3): toda limpeza remove um vestígio e deposita
  um de segunda ordem no mesmo ato. As classes novas declaram contraparte.
- **Andaime:** `crime.js`, `metodos.js`, `vestigios.js` seguem gerador-facing;
  o runtime só vê o `RegistroDoCrime` e o pacote (guardas existentes).
- A mecânica atual de **reação** (ferimento defensivo; chance de ferir o
  assassino; teto `MAX_FERIMENTOS_ASSASSINO`) e a **deriva** do confronto
  continuam existindo — a fuga soma-se a elas, não as substitui.
- **Réplica dirigida:** fatos do roteiro canônico são intocáveis (§4.8).
- **Prosa** nova ou alterada passa por `redigir-prosa` + `revisar-prosa`, zero
  achados bloqueantes. Proveniência linha a linha em todo dado novo.

## 4. Desenho proposto

### 4.1 KB transversal — dinâmica do confronto (Fase 1)

Novas seções, com fonte e ano por linha (regra da casa):

- Em `traumas.md`: **lesões de defesa ativas × passivas** (consolidar e expandir o
  que já existe); **capacidade de ação pós-lesão** por sítio e mecanismo — ferida
  cardíaca/grandes vasos ainda permite segundos a minutos de ação documentada;
  trauma craniano com inconsciência a suprime; compressão cervical mantida a anula
  enquanto durar; exsanguinação a degrada progressivamente. Bastidores com
  literatura moderna (Karger; DiMaio; Spitz & Fisher); época com Taylor
  (*Principles and Practice of Medical Jurisprudence* — jurisdição do jogo);
  **lesões de sítio posterior** como assinatura de golpe recebido em fuga.
- Em `vestigios.md`: **rastros em movimento** — gotejamento em trilha (espaçamento
  e sentido da marcha), esfregaços de limiar/batente/maçaneta, sequência de mobília
  tombada entre cômodos; **vestígios no agressor** (escoriações ungueais, roupa
  rasgada, sangue da vítima sobre ele — Gross 1893, já em `fontes.md`).
- **Nota de honestidade cronológica:** a leitura formal de padrões de manchas de
  sangue nasce com Piotrowski (1895) — pós-jogo. O mundo de 1893 articula apenas
  senso comum ("a trilha de gotas segue para a copa"); a coerência fina é dos
  bastidores do gerador. Mesmo padrão da nota Hans Gross em `fontes.md`.
- Atualizar `lacunas.md` (fechar o coberto, abrir o que se revelar) e `fontes.md`.

### 4.2 KB métodos — dossiês novos (Fase 2)

Dossiês no formato dos existentes, cada um cobrindo: lesões típicas e sinais ao
exame; sangramento externo (governa trilhas); lesões de defesa associadas;
**capacidade de ação residual da vítima**; vestígios prováveis no agressor; ruído;
exigências (premeditação, força relativa, preparo); encenabilidade
(acidente/suicídio) e as discrepâncias que a traem; vocabulário de época.

- **Sufocação** (oclusão de boca e nariz; travesseiro, mão) — `asfixias.md`.
  Doméstica, silenciosa, arma de ocasião.
- **Precipitação** (queda de escada provocada) — `traumas.md` (+ `tanatologia.md`
  se couber): lesões de queda × lesões de golpe; a discrepância como pista.
- **Afogamento** (poço, tanque, cocho) — `asfixias.md`.
- **Láudano em dose excessiva** — `venenos.md`: venda livre em 1893, encenável como
  excesso acidental; sinais (miose, depressão respiratória) em vocabulário de
  época.
- **Espingarda de caça** — dossiê **de mundo** (o coroner conhece ferimentos por
  projétil), sem entrada jogável nesta OS.
- `vocabulario-de-epoca.md`: termos dos métodos novos ("dose excessiva",
  "abafamento" etc.).

A KB é conhecimento do mundo: **todos** os dossiês entram, mesmo os de método que a
Fase 4 não implementar.

### 4.3 Inventário de viabilidade dos métodos (Fase 3; verificação prévia já feita)

Preparação desta OS já inspecionou `src/data/catalogo_causas.js`; a Fase 3
**reconfere** e registra em ata:

- **Cobertos pelo catálogo universal** (mecanismo + sinal já existem):
  sufocação (`sufocacao`/`oclusao_vias`), afogamento (`afogamento`/`agua_pulmoes`),
  precipitação (via `trauma_contuso`/`ferida_contusa` — a distinção queda × golpe é
  pista de KB, não mecanismo novo), espingarda (`arma_de_fogo`/`orificio_projetil`).
- **Não coberto:** láudano/opiáceo (o catálogo tem cianeto e arsênico). Implementar
  o láudano exige estender `src/data/catalogo_causas.js` — dado de **runtime**, com
  superfícies de prosa. **[DECISÃO DO USUÁRIO — D1]**: autorizar (ou não) a
  extensão do catálogo; sem ordem, o láudano fica só na KB.
- **Âncora espacial:** precipitação exige escada representável na cena; afogamento
  exige água (poço/tanque/cocho) alcançável pelo modelo de cena (o crime hoje
  ocorre no interior da rotina da vítima). A Fase 3 inventaria `interiores.js`,
  `espaco.js` e `cidade.js`: método **sem âncora representável fica fora do
  catálogo jogável** (permanece na KB) — registrar em ata qual caiu e por quê.
  Se houver âncora parcial que exija adaptação da geração espacial,
  **[DECISÃO DO USUÁRIO — D2]**.
- **Garantido para a Fase 4:** sufocação (coberta, sem âncora especial, de
  interior). O piso desta OS é: **fuga + grito + trilhas + sufocação**.

### 4.4 O modelo de fuga — dois portões (Fases 3 e 5)

Por rodada, após o golpe do assassino, se a vítima vive e não está sob a surpresa
(a rodada 1 premeditada continua suprimindo **qualquer** reação, inclusive fuga):

- Sorteia-se a **ação da vítima** ∈ {resistir, fugir} por pesos inteiros (§8.2);
  **gritar** é rolagem independente, no máximo 1× por batalha.
- **Portão físico** (método + estado), campos novos em `METODOS`:
  - `seguraAVitima` (bool): garrote, esganadura e sufocação = `true` — enquanto o
    método prende a vítima, **fugir e gritar têm peso 0** (o laço cala; a mão
    abafa); resta resistir.
  - `mobilidadeResidual` (0–2): fator de decaimento do peso de fugir conforme
    `ferimentosVitima` (§8.2) — laminada decai devagar (2), contuso decai rápido
    (0), sufocação intermediária (1). Veneno segue `suprimeBatalha`.
- **Portão psíquico** (vetor + polaridade da vítima, produto da OS psíquica):
  campo novo `sobAtaque: { resistir, fugir, gritar }` por vetor em
  `src/gerador/vetores_psiquicos.js`, com proveniência linha a linha. **Default
  estrutural:** polaridade ativa pende a resistir; passiva, a fugir/gritar;
  overrides por vetor definidos na Fase 3. Pesos de afinidade, **jamais regra
  dura**: qualquer vítima pode acabar resistindo ou fugindo. FOR continua pesando
  resistir (mecânica atual preservada).
- **Resistir** = comportamento vigente: ferimento defensivo, chance de ferir o
  assassino, deriva de 1 célula (o roll de deslocamento atual passa a viver dentro
  de resistir).
- **Fugir** = deslocamento **dirigido**: 1 célula por rodada rumo à passagem do
  cômodo atual na rota até a **porta externa** (rota determinística pela adjacência
  de cômodos, §8.3). Na rodada em que foge, a vítima **não** produz ferimento
  defensivo, e o golpe recebido é registrado como **lesão de sítio posterior**
  (contagem no registro; superfície no laudo, §4.6). Cruzar passagem interna gera
  evento `cruzou_limiar` (+ esfregaço, se o método sangra e há ferimento). Alcançar
  a célula da porta externa ⇒ **rejeição** `vitima_escapou`.
- **Gritar**: pico discreto de ruído (§8.2), evento com **hora própria** — âncora
  temporal que chega aos `ouvintes` pelo canal existente (`metadados.ouvintes`),
  audível aos adjacentes e não só a quem partilha o teto.
- `MAX_RODADAS` permanece o teto absoluto (`vitima_resistiu`); o valor (6 → 8?) é
  calibrado na Fase 3 com o lote de seeds, registrado em ata.

### 4.5 Passagens entre cômodos (Fase 3 inventaria)

A deriva atual já cruza fronteiras de cômodos sem modelo de porta interna
(`vizinhasDaCelula` ignora paredes). A Fase 3 inventaria `interiores.js`:

- Se houver portas/ligações internas modeladas, a rota de fuga as usa.
- Se não houver (estado aparente do módulo), adota-se **convenção mínima**: uma
  célula de passagem por par de cômodos adjacentes, **derivada deterministicamente
  do interior existente** (por exemplo, célula central da fronteira comum), sem
  alterar a geração espacial. Registrar a convenção no game-design §2 (no PR-B).
- **Se** a convenção exigir alterar a geração em `interiores.js` (novas células,
  novos campos), **[DECISÃO DO USUÁRIO — D3]** — parar e perguntar. A Fase 2
  espacial é fonte única de verdade e não se toca sem ordem.

### 4.6 O preço da desordem (Fases 3 e 5)

- **Classes de vestígio novas** em `vestigios.js`, cada uma com contraparte de 2ª
  ordem (conservação §3.3): `trilha_gotejamento` (celulas do caminho de fuga; só se
  `sangra` e `ferimentosVitima ≥ 1`; 2ª ordem: assoalho esfregado em faixa),
  `esfregaco_de_limiar` (2ª ordem: batente lavado ainda úmido). Métodos sem sangue
  deixam o rastro mobiliário e posicional — `danificarAoAlcance` já acompanha a
  célula e cobre o segundo cômodo sem mudança.
- **Lesões de sítio posterior:** contagem no registro; a superfície é o **laudo**
  (canal de `protocolo-exame.md` na prosa do pacote), sem tocar runtime. O coroner
  de 1893 pode dizer que os golpes alcançaram as costas — leitura de época
  legítima.
- **Corpo onde tombou:** `posicaoCorpo` já registra cômodo e célula; a encenação
  existente (arrasto) ganha o caso "trazer o corpo de volta ao cômodo esperado",
  depositando `trilha_arrasto` (classe existente). Deixar o corpo onde caiu = cena
  espalhada, legível.
- **Orçamento de limpeza inalterado** (função de WIS, como hoje) e explicitamente
  **não cresce com a bagunça** — é isso que converte a fuga em custo: dois cômodos
  sujos contra orçamento fixo ⇒ sobra vestígio de 1ª ordem ou sobra 2ª ordem.
  Registrar a regra no game-design §2 (PR-B).
- **Amarração com a OS psíquica §4.4:** no cenário reativo, "cômodo negligenciado
  na pressa" entra no pool de erros de pânico como variante **causal** (derivada da
  fuga), não sorteada.
- **Regra de existência:** ação da vítima, rota e grito só entram em
  `registro.variaveis` se evidenciados por vestígio/evento sobrevivente — a
  conservação garante que limpeza total ainda deixa 2ª ordem.

### 4.7 Fair play / anti-bicondicional (Fases 3 e 6)

Bagunça em dois cômodos **não pode** equivaler logicamente a briga escalada: no
premeditado, a surpresa consome só a rodada 1 — a fuga segue possível depois, e o
lote de QA verifica a sobreposição (§5). Ler o tipo de crime pela cena é dedução
legítima do detetive (é o gênero); distinta de psicologia condenatória. O veredicto
segue material; nada desta OS condena.

### 4.8 Réplica e casos dirigidos (Fases 5 e 7)

`dirigido` ganha `fugaVitima ∈ { 'suprimida', 'livre' }` (default `'livre'`),
seguindo o padrão dos campos existentes (`metodoId`, `faixa`, `vitimaArquetipo`…).
A réplica usa `'suprimida'`. A Fase 7 **asserta** que o `RegistroDoCrime` da
réplica permanece idêntico **em fatos** (verdade de ouro, vestígios do crime,
horas) ao roteiro canônico. Qualquer divergência é **[DECISÃO DO USUÁRIO — D5]** —
parar antes de regenerar por cima.

## 5. Guardas e QA (Fase 6)

- **Determinismo:** mesma seed → `RegistroDoCrime` byte-idêntico (teste existente
  estendido a fuga, grito e trilhas). Lote de seeds do QA fixo e versionado.
- **Anti-bicondicional:** em lote de ≥ 50 seeds, existir ≥ 1 caso premeditado
  **com** fuga e ≥ 1 briga escalada **sem** fuga (lote determinístico; se a
  distribuição natural não produzir os dois, recalibrar pesos na Fase 3 antes de
  ampliar o lote — registrar em ata).
- **Coerência de trilha:** `celulas` contíguas; travessia de cômodo apenas por
  passagem; campo `comodo` de cada vestígio consistente com `comodoDaCelula`.
- **Existência:** fuga ocorrida ⇒ ≥ 1 vestígio/evento sobrevivente a evidencia;
  grito ocorrido ⇒ evento com hora no registro; caso contrário, vão a
  `variaveisInertes` e o lint acusa se algo vazou como variável ativa.
- **Réplica:** assert de identidade de fatos (§4.8) rodando no build.
- **Léxico:** lints L1/L2 cobrem as superfícies novas; grep adicional para
  "overdose" e anacronismos dos métodos novos.
- **Import:** `crime.js`, `metodos.js`, `vestigios.js` seguem gerador-facing
  (guarda existente); nenhum import novo do runtime.

## 6. Fases, ordem e concomitância

| Fase | PR | Entrega | Toca | Início |
|---|---|---|---|---|
| 0 | A | Gravar esta OS | `docs/os-confronto-estendido.md` | **Já** — concomitante |
| 1 | A | KB transversal: dinâmica do confronto (§4.1) | `docs/kb-medicina-legal/{traumas,vestigios,tanatologia,fontes,lacunas}.md` | **Já** — concomitante |
| 2 | A | Dossiês de métodos novos (§4.2) | `docs/kb-medicina-legal/{asfixias,traumas,venenos,vocabulario-de-epoca,fontes}.md` | **Já** — concomitante |
| 3 | A | Spec normativa: preencher §8; inventários (catálogo §4.3, passagens §4.5, âncoras espaciais); calibrações propostas | esta OS (§8) — **nenhum outro arquivo** | **Já** — concomitante |
| — | — | **PONTO DE ESPERA: ata parcial, parar; aguardar M-C (merge da OS psíquica) e ordem do usuário** | — | — |
| 4 | B | Catálogo: campos novos (`seguraAVitima`, `mobilidadeResidual`), métodos aprovados no inventário, classes de trilha | `src/gerador/{metodos,vestigios}.js` (+ `src/data/catalogo_causas.js` **só** se D1 autorizar) | Após M-C |
| 5 | B | Resolvedor: ações da vítima, fuga dirigida, grito, portões; `sobAtaque` nos vetores; `dirigido.fugaVitima`; consolidação no game-design §2 | `src/gerador/{crime,caso,vetores_psiquicos}.js`, `docs/game-design-simulacao.md` | Após M-C |
| 6 | B | Guardas e testes (§5) | `scripts/qa.mjs`, testes | Após M-C |
| 7 | B | Regeneração dos casos; assert da réplica; prosa pelo pipeline; playtest; ata de fechamento | `src/data/casos_gerados.js`, `docs/playtest-*.md` | Após M-C |

**Resumo da concomitância:** Fases 0–3 (documentação) rodam em paralelo à OS
psíquica sem risco de merge, porque os territórios de arquivo são disjuntos (§0).
Fases 4–7 dependem de M-C por duas razões de fundo: o portão psíquico **lê o vetor
da vítima** (produto da Fase 3 daquela OS), e ambas as OSs **regeneram
`casos_gerados.js`** e tocam `caso.js` — dois PRs concorrentes ali é conflito
garantido.

**Decisões pendentes desta OS:** D1 (láudano → estensão do catálogo de causas),
D2 (âncora espacial de precipitação/afogamento, se exigir adaptação), D3
(passagens, se exigirem tocar a geração de interiores), D4 (espingarda jogável —
fora desta OS, registrar como pauta futura), D5 (qualquer divergência de fatos na
réplica).

## 7. Tamanho honesto

Fases 0–3 são edição de documentação (baratas, imediatas — e é exatamente por isso
que podem ser concomitantes). O núcleo é 4–5: dois módulos de dados estendidos +
uma cirurgia no loop do resolvedor (`simularBatalha`) + três pontos de integração
(`caso.js`, vetores, game-design). **Se apertar:** os métodos novos destacam-se
para OS própria sem quebrar nada (o piso garantido é sufocação); **fuga + grito +
trilhas valem esta OS sozinhos**. A Fase 7 só regenera o que 4–5 efetivamente
mudarem.

## 8. Spec normativa (a Fase 3 preenche e calibra; defaults abaixo)

### 8.1 Campos novos de método

| método | seguraAVitima | mobilidadeResidual | observação |
|---|---|---|---|
| laminada | false | 2 | sangra: trilha possível |
| garrote | true | — | fuga/grito 0 enquanto aplicado |
| esganadura | true | — | idem |
| contuso | false | 0 | fuga decai após o 1º golpe |
| arsênico | — | — | `suprimeBatalha` |
| sufocação (novo) | true | 1 | arma de ocasião; `sangra: false`; `exigePremeditacao: false`; `danoBase` e `ruidoPorRodada` baixos (Fase 3 calibra); `mecanismo: 'sufocacao'`, `sinalAssinatura: 'oclusao_vias'` |
| láudano (condicionado a D1) | — | — | `suprimeBatalha: true`; `exigePremeditacao: true`; mecanismo/sinal **novos** no catálogo |
| precipitação / afogamento (condicionados a D2) | false / — | n/a | golpe único contextual; exigem âncora espacial — Fase 3 especifica ou descarta |

Todos os métodos novos declaram o conjunto completo de campos existentes
(`surpresa`, `danoBase`, `ruidoPorRodada`, `suprimeBatalha`, `sangra`,
`exigePremeditacao`, `intMinima`, `instrumento`, `sinalAssinatura`, `mecanismo`,
`proveniencia`).

### 8.2 Sais e rolagens (defaults; inteiros, determinismo estrito)

- Ordem por rodada: golpe → checagem de morte → (rodada 1 premeditada: nada) →
  **ação**: `hashString(sal|r{n}|acao)` sobre pesos inteiros; → **grito**:
  `hashString(sal|r{n}|grito)`, no máximo 1× por batalha.
- `pesoResistir = 1 + FOR + sobAtaque.resistir + (polaridade ativa ? 1 : 0)`.
- `pesoFugir = seguraAVitima ? 0 : (1 + sobAtaque.fugir + (polaridade passiva ? 1 : 0)) × multMobilidade`.
- `multMobilidade` por tabela inteira (Fase 3 fecha): mobilidade 2 → {×1, ×1, ×1};
  mobilidade 1 → {×1, ×1, ×0}; mobilidade 0 → {×1, ×0, ×0}, indexada por
  `ferimentosVitima` (1º, 2º, 3º+).
- `pGrito` (se não `seguraAVitima`): base 1/8; +1/8 se `sobAtaque.gritar ≥ 1`;
  +1/8 se `pontosVida ≤ 2` (desespero). Ruído do grito: **+4**, marcado como
  evento com hora, audível aos `adjacentes`.
- Sais novos: `|acao`, `|grito`, `|rota` — todos sob o sal de batalha vigente;
  rejeições seguem o sal incremental padrão.

### 8.3 Rota de fuga

Rota de cômodos por busca determinística na adjacência (ordem de expansão = ordem
dos cômodos no interior) até o cômodo da porta externa; dentro do cômodo,
`caminhoEmL` até a célula de passagem (§4.5); 1 célula por rodada; o assassino
permanece adjacente (abstração vigente — golpe sempre alcança). Alcançar a célula
da porta externa ⇒ rejeição `vitima_escapou`. `MAX_RODADAS` default 6; subir a 8
apenas se o lote da Fase 3 mostrar excesso de rejeições (registrar em ata).

### 8.4 Vestígios novos e segunda ordem

| classe nova | 2ª ordem (conservação §3.3) | proveniência |
|---|---|---|
| `trilha_gotejamento` | assoalho esfregado em faixa | `vestigios.md` (rastros em movimento) |
| `esfregaco_de_limiar` | batente lavado, ainda úmido | idem |
| lesões de sítio posterior (registro/laudo) | — (canal de exame, não de cena) | `traumas.md` (capacidade de ação; sítio posterior) |
| grito (evento com hora) | — (canal de ouvintes) | `inquerito-e-policia.md` (testemunho auditivo) |

### 8.5 Fair play

A fuga vaza por **cena e laudo** (trilha, limiar, mobília em dois cômodos, sítios
posteriores, corpo deslocado), nunca por narração onisciente; deve sustentar a
leitura do tipo de crime sem jamais bastar para condenar — o veredicto segue
material. O playtest da Fase 7 verifica: (a) a cena de fuga é legível e conta a
história certa; (b) existe premeditado com fuga no lote (anti-bicondicional
percebido no jogo, não só no teste); (c) nenhuma superfície nomeia mecânica
("pesos", "portão", "rodada") — a língua é a de 1893.

---

## 9. Fase 3 — inventários, spec preenchida e calibrações (PR-A)

> Preenchimento e reconferência normativos da Fase 3. **Nenhum código é tocado**
> nesta fase (é PR-A, documentação); os inventários abaixo leem `src/**` apenas para
> registrar o estado e decidir o que a Fase 4 implementa. Os pontos **[DECISÃO DO
> USUÁRIO]** que se ativaram estão consolidados na ata parcial (§10).

### 9.1 Inventário de viabilidade dos métodos (reconfere §4.3)

Reconferência de `src/data/catalogo_causas.js` e `src/gerador/metodos.js`:

| Método | Mecanismo / sinal | Estado no catálogo universal | Veredicto Fase 4 |
|---|---|---|---|
| Sufocação | `sufocacao` / `oclusao_vias` | **Presente** (causa e sinal já no catálogo) | **Entra** — piso garantido |
| Afogamento | `afogamento` / `agua_pulmoes` | **Presente** | Condicionado a âncora espacial — **D2** |
| Precipitação | `trauma_contuso` / `ferida_contusa` | **Presente** (a distinção queda × golpe é pista de KB, não mecanismo novo) | Condicionado a âncora espacial — **D2** |
| Espingarda | `arma_de_fogo` / `orificio_projetil` | **Presente** | **Não entra** (só dossiê de mundo) — **D4** |
| Láudano | opiáceo | **Ausente** — o catálogo tem só `envenenamento_cianeto` e `envenenamento_arsenico` | Só com extensão do catálogo — **D1** |

Confirma-se o texto da OS: os quatro primeiros mecanismos já existem no catálogo; **só
o láudano exige estender** `src/data/catalogo_causas.js` (dado de runtime, com
superfícies de prosa). Sem a ordem D1, o láudano fica só na KB.

### 9.2 Inventário de âncoras espaciais (reconfere §4.3 e §4.5)

Leitura de `src/gerador/interiores.js`, `espaco.js` e `cidade.js`:

- **Modelo de interior:** grid de **um só piso** por prédio (`LAYOUTS` em
  `interiores.js`); os cômodos particionam um retângulo plano. **Não há célula de
  escada nem eixo vertical** — o "sobrado"/"duas escadas" existem só na proveniência
  de silhueta (`espaco.js`), nunca como célula alcançável pelo autobattler.
- **Água:** a única água modelada como **célula alcançável** é o `cocho_dagua` da
  oficina da forja (`MOBILIA_DE_OFICIO.oficina`, `espaco.js`). O **poço** da granja e
  o **açude** do moinho são citados na proveniência dos tipos de prédio, mas **não**
  entram como mobília/célula (não há item de poço em `MOBILIA_DE_OFICIO.paiol`).
- **Porta externa:** já convencionada em `crime.js` — a célula
  `{ col: ⌊colunas/2⌋, fila: filas−1 }` (frente-centro, última fila = frente/rua) já
  serve à lógica de pegada do WIS-baixo e ao arrasto. A rota de fuga (§8.3) **reusa
  essa convenção** sem criar nada.
- **Passagem entre cômodos:** `vizinhasDaCelula` (`crime.js`) **já ignora paredes** e
  `caminhoEmL` **já** compõe trajetos célula a célula que cruzam fronteiras de cômodo.
  Logo a "convenção mínima de passagem" do §4.5 (uma célula por par de cômodos) é
  **derivável da geometria existente** sem tocar a geração de `interiores.js`.

**Consequências para as decisões:**

- **Precipitação → [DECISÃO DO USUÁRIO — D2].** Exige escada representável; a geração
  atual não a modela. Implementá-la significaria adicionar células/eixo vertical em
  `interiores.js` (Fase 2 espacial, fonte única de verdade — não se toca sem ordem).
  **Sem D2, precipitação fica só na KB.**
- **Afogamento → [DECISÃO DO USUÁRIO — D2].** Âncora **parcial**: só há água alcançável
  na forja (o `cocho_dagua`), e apenas quando a rotina da vítima põe a cena ali (vítima
  ferreiro/ligada à forja). Duas saídas para o usuário decidir: **(a)** admitir
  afogamento **restrito à cena de forja** pela célula `cocho_dagua` já existente (sem
  tocar geração; o cocho é raso — afogamento forçado é plausível, mas marginal); **(b)**
  manter afogamento só na KB. **Sem D2, fica só na KB.**
- **Passagens → D3 NÃO se ativa (previsão).** A convenção mínima do §4.5 sai da
  geometria existente (porta-externa já convencionada; `vizinhasDaCelula` ignora
  paredes). A Fase 5 constrói a rota dirigida em `crime.js` sem alterar `interiores.js`.
  Só se a implementação revelar necessidade de novas células/campos é que D3 acorda —
  hoje não se prevê.

### 9.3 Spec §8 — preenchimento e confirmação

- **§8.1 (campos de método):** a tabela vigora como está. **Sufocação** entra na Fase 4
  com o conjunto completo de campos: `seguraAVitima: true`, `mobilidadeResidual: 1`,
  `surpresa: 2` (arma de ocasião, sem o esmagador do garrote), `danoBase: 1` (lenta,
  como a esganadura), `ruidoPorRodada: 1`, `suprimeBatalha: false`, `sangra: false`,
  `exigePremeditacao: false`, `intMinima: 1`, `instrumento: 'travesseiro_ou_pano'` (arma
  de ocasião doméstica; abandonável na cena), `mecanismo: 'sufocacao'`,
  `sinalAssinatura: 'oclusao_vias'`, `proveniencia` → `asfixias.md` (dossiê de
  sufocação, Fase 2). **Láudano** só se D1; **precipitação/afogamento** só se D2.
- **§8.2 (sais e rolagens):** confirmados os sais `|acao`, `|grito`, `|rota` sob o sal
  de batalha; a tabela `multMobilidade` fica: mobilidade 2 → {×1,×1,×1}; 1 → {×1,×1,×0};
  0 → {×1,×0,×0}, indexada por `ferimentosVitima` (1º/2º/3º+). `pGrito` base 1/8,
  +1/8 se `sobAtaque.gritar ≥ 1`, +1/8 se `pontosVida ≤ 2`; ruído do grito +4, evento
  com hora, audível aos `adjacentes`. Nada a recalibrar em PR-A.
- **§8.3 (rota de fuga):** rota de cômodos por busca determinística na adjacência do
  interior (ordem de expansão = ordem dos cômodos no layout) até o cômodo da porta
  externa; dentro do cômodo, `caminhoEmL` até a célula de passagem/porta; 1 célula por
  rodada; assassino adjacente por construção; alcançar a porta externa ⇒ rejeição
  `vitima_escapou`. Tudo compatível com a geometria de hoje.
- **§8.4 (vestígios novos):** `trilha_gotejamento` (2ª ordem: assoalho esfregado em
  faixa) e `esfregaco_de_limiar` (2ª ordem: batente lavado ainda úmido) declaram
  contraparte de conservação (§3.3); proveniência em `vestigios.md` ("Rastros em
  movimento", Fase 1). Lesões de sítio posterior e grito são canais de laudo/ouvintes,
  sem 2ª ordem de cena.

### 9.4 Calibração de `MAX_RODADAS`

A OS pede calibrar 6 → 8 "com o lote de seeds". **Ressalva honesta de PR-A:** a taxa
de rejeição por `vitima_escapou` só é mensurável **depois** de a fuga existir em código
(Fase 5). Em documentação pura não há o que medir. **Proposta registrada:** manter o
**default 6** e reavaliar no QA da Fase 6 (PR-B), subindo a 8 apenas se o lote
determinístico mostrar excesso de rejeições — decisão a lavrar em ata de fechamento do
PR-B, não aqui.

### 9.5 Fair play / anti-bicondicional (reconfere §4.7)

Confirmado como alvo de QA da Fase 6: em lote ≥ 50 seeds, exigir ≥ 1 premeditado **com**
fuga e ≥ 1 briga escalada **sem** fuga; recalibrar pesos antes de ampliar o lote se a
distribuição natural não os produzir. Nada a fazer em PR-A além de fixar o critério.
