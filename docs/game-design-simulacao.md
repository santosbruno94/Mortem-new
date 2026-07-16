# Game design — gerador por simulação e sistema de interferência

> Documento normativo do overhaul aprovado em jul/2026 (ordem de serviço "Gerador por
> Simulação e Sistema de Interferência"). Rege o DESIGN do gerador procedural de casos:
> como o crime é simulado na geração, como personagens e espaço nascem, e sob que
> regras o assassino pode reagir à investigação. A implementação é faseada (Fases 1–5
> da ordem); este documento descreve o alvo. Onde ele contradisser o estado do repo em
> matéria de implementação, vale o repo; em matéria de design, vale este documento —
> divergência é decisão do dono do projeto.
>
> Complementos: `MORTEM_CONTEXTO.md` §16 (resumo normativo), `docs/historico-decisoes.md`
> (arqueologia e reconciliações), `docs/kb-producao/game-design-deducao.md` (princípios
> do gênero), `docs/kb-producao/contrato-papeis-e-gerador.md` e `src/data/papeis.js`
> (taxonomia de papéis dramáticos — o casting que o gerador escala).

---

## 1. A tese: simulação para a frente, investigação para trás

O gerador não "escreve" um caso: ele **comete o crime**. Uma simulação simples e
determinística executa o assassinato em tempo de geração (build time), depositando
vestígios como efeito colateral físico de cada ação — e o jogador, em runtime, percorre
o caminho inverso: dos vestígios à reconstrução. A justiça do mistério deixa de ser
promessa autoral e vira propriedade do processo: todo vestígio existe porque um evento
o depositou, e todo evento que importa depositou vestígio.

Invariantes herdados do repositório (não cedem em nenhuma fase):

1. **Determinismo total** — toda escolha deriva de `hashString` (`src/logic/hash.js`)
   salgado sobre a seed; mesma seed → mesmo caso, byte a byte; zero `Math.random()`.
2. **Âncora durável inviolável** — todo caso permanece solucionável em qualquer estado
   alcançável; `scripts/qa.mjs` é o portão determinístico dessa garantia.
3. **Separação de camadas** — o motor nunca lê a camada de geração; a camada visual
   nunca é lida por regra de jogo (modelo: a guarda de `aparencias.js` no QA).
4. **Zero LLM em runtime** — LLM só em build time, via agentes/skills existentes.
5. **Pipeline de prosa** (`revisar-prosa`) com zero achados bloqueantes antes de
   commit; contrato de texto do `scripts/qa-ui.mjs` preservado.
6. **Um caso é one-shot** — sem rejogo/reordenação do mesmo caso.

---

## 2. O resolvedor: um autobattler rudimentar de build time

O crime é resolvido **em tempo de geração**, deterministicamente, pela função:

```
resolverCrime(assassino, vitima, metodo, local, hora, seed) → RegistroDoCrime
```

Internamente, um **autobattler rudimentar**: simulação simples de confronto, rodada por
rodada, com RNG derivado exclusivamente de `hashString` salgado sobre a seed. Nada
disso existe em runtime — o jogo carrega apenas o `RegistroDoCrime` resultante:
sequência de eventos `{ ator, ação, célula/mobília, hora, vestigios_depositados[] }`,
consumida pelo pacote de caso (`src/data/pacote_caso.js`).

### 2.1 Reamostragem por rejeição (o assassino sempre vence)

Se a batalha simulada termina com o assassino derrotado, ela é descartada e reamostrada
com sal incrementado, até produzir uma vitória. Determinismo preservado: mesma seed →
mesma sequência de batalhas descartadas e mesma batalha aceita. O efeito de design é o
ponto: contra vítima de FOR alta, as vitórias que sobrevivem à rejeição são
estatisticamente as **custosas** — mais rodadas, ferimentos defensivos na vítima,
ferimento no assassino (sangue que não é da vítima), mobília revirada, ruído audível
por vizinhos. O assassino sempre vence, mas carrega o preço da vitória amostrada.

### 2.2 Iniciativa e surpresa; os dois tipos de cenário

Premeditação × método definem o modificador de iniciativa. Veneno suprime a batalha
(ou a torna trivial); garrote/faca pelas costas dá primeiro golpe esmagador. A **briga
que escalou** é confronto simétrico sem surpresa — e constitui um *tipo de cenário*
próprio (não premeditado), sem vestígios de planejamento e com motivo imediato,
alterando a textura do caso inteiro.

### 2.3 Regra de existência para variáveis de batalha

Toda variável da simulação (duração, ruído, deslocamento do confronto entre cômodos,
ferimentos mútuos, objetos danificados, precisão da hora da morte) **só existe se
depositar vestígio diferencial observável**. Variável de batalha órfã = falha de lint
no QA (Fase 3).

**Implementado na Fase 3 (jul/2026)** — tudo em `src/gerador/` (ilha de build time):
`resolverCrime(...)` em `crime.js` (autobattler por rodadas sobre o grid da Fase 2:
PV da vítima = 2 + 2×FOR; surpresa por premeditação × método; reação e ferimento do
assassino contra FOR da vítima; deslocamento entre células; mobília ao alcance
danificada; reamostragem por rejeição com descartes REGISTRADOS no
`RegistroDoCrime.batalha.tentativasDescartadas`; esgotadas 24 tentativas, vitória
forçada com custo máximo e flag `desespero` — o determinismo da âncora não depende
da sorte); catálogo fechado de métodos e cenários em `metodos.js` (laminada,
garrote, esganadura, contundente, veneno-arsênico × premeditado/briga escalada,
proveniência por linha); a tabela viva como dado em `vestigios.js`
(`CLASSES_VESTIGIO` com `atributo`, `evidenciaDe`, `ordem` 1/2, `removivel`,
`noCorpo`; `VARIAVEIS_BATALHA` fechadas); seleção de vítima/assassino/cenário/
método/local/hora em `caso.js` (`gerarCasoBruto(seed)`; briga escalada sorteia o
PAR coabitante de faixa — o motivo imediato nasce da convivência); ponte em
`ponte_caso.js` (`fatiaForenseDoCrime`: Verdade de Ouro + cartas no vocabulário de
tagsOcultas que o motor JÁ lê — rigor/livor com estados por IPM pela via direta de
`tempo_morte.js`, sinal causal de assinatura do método, visto-com-vida, presença
por `pertenceA`, móbil; prosa = rótulos técnicos, a prosa jogável nasce nas fases
seguintes pelo pipeline). A regra de existência é construtiva: variável sem
vestígio sobrevivente vai a `metadados.variaveisInertes` (ruído sem ouvinte na
faixa não existe para o jogo). Guardas novas no `qa.mjs`: replay do caso bruto
byte a byte (com a sequência de rejeições), crimes distintos, rejeição íntegra,
tabela viva sem atributo órfão, lints do registro (variável órfã, limpeza sem 2ª
ordem, coerência espacial: célula/cômodo/mobília existentes, trilhas contíguas,
arrasto terminando no corpo, livor × arrasto) e ponte consumível pelo motor
intocado (janela cobre a hora real; `mecanismoCravado` = mecanismo; presença e
móbil apontam o réu). Vitrine em `scripts/demo-crime.mjs` (`npm run demo:crime`).

---

## 3. Regra de existência de atributo

**Um atributo só existe se mapeia para pelo menos (a) uma classe de vestígio observável
ou (b) um comportamento discreto de diálogo/interferência.** O que não deixa rastro
detectável pelo detetive não entra no modelo. Consequências:

- **STR e VIT fundidos em FOR** (compleição/força) — nenhum vestígio os distingue na
  prática; um atributo a menos, mesma expressividade.
- **Sem grid de alinhamento** (lawful/chaotic × good/evil) — motivo + traits fazem o
  trabalho.
- **Sem ficha do detetive** — o jogador não luta, não é ferido, não tem atributos.

Conjunto aprovado: **FOR**, **INT**, **WIS**, **CHA**. Validado contra a taxonomia de
papéis de `src/data/papeis.js` na Fase 1 (jul/2026): os seis papéis dramáticos se
expressam com o conjunto + traits — encenação/planejamento → INT, higiene de
vestígios → WIS, qualidade de álibi e resistência do interlocutor → CHA,
mentiroso-por-medo → trait *medroso*, ruído barulhento → trait *tagarela*. Nenhum
quinto atributo se mostrou necessário.

### 3.1 Tabela viva: atributo → vestígio / comportamento

Esta tabela é o contrato da regra de existência. Cada linha nova de atributo ou de
variável de simulação DEVE preencher ao menos uma das duas colunas de consequência;
linha vazia = atributo órfão = lint do QA. Atualizá-la a cada fase que tocar o modelo.

| Atributo (portador) | Governa na simulação | Classe de vestígio observável | Comportamento de diálogo/interferência |
|---|---|---|---|
| FOR (vítima) | resistência ao confronto; duração da luta; chance de ferir o assassino | ferimentos defensivos; sangue que não é da vítima; mobília revirada; ruído no grafo de avistamentos | — |
| FOR (assassino) | profundidade/tipo de ferimento; capacidade de arrastar o corpo | profundidade e ângulo de ferida; trilha de arrasto × livor; ausência de arrasto (corpo pesado movido = cúmplice ou força alta) | — |
| INT (assassino) | elaboração e planejamento do método | complexidade do método legível nos meios (aquisição do veneno, preparo do acesso, encenação estruturada) | — |
| WIS (assassino) | higiene de vestígios; improviso sob pressão; rolagens de interferência (com penalidade, R1) | limpeza que converte óbvio em sutil (§3.3); erros frescos sob pressão | decide quão bem executa interferências (§5) |
| WIS (testemunha) | — | — | acurácia do que observou (instrumento de medição com margem de erro) |
| CHA (suspeito/NPC) | qualidade do álibi construído | — | disposição/resistência do interlocutor; quanto revela e a que custo |

Traits de NPC periférico são **comportamentos discretos quantizados** (nada de
modificador contínuo invisível), autoráveis e testáveis:

- *medroso* → omite informação até ganhar confiança/proteção;
- *tagarela* → mistura ruído com pepitas verdadeiras;
- *preciso* → horários e detalhes exatos (instrumento de medição confiável);
- *linha do tempo não confiável* (ex.: embriaguez) → depoimento com erro sistemático.

A fantasia-alvo: o jogador aprende a tratar pessoas como instrumentos de medição com
margens de erro diferentes.

**Implementado na Fase 1 (jul/2026)** — catálogo fechado em
`src/gerador/comportamentos.js`, quantização em `src/gerador/quantizacao.js`,
arquétipos e priors em `src/gerador/arquetipos.js`, amostragem em
`src/gerador/amostragem.js`. Ids reais do catálogo v1 (8 comportamentos):

- por trait: `medroso → omite_ate_confianca`, `tagarela → ruido_com_pepitas`,
  `preciso → instrumento_confiavel`,
  `linha_tempo_nao_confiavel → erro_sistematico_tempo`;
- por limiar de atributo (3 é neutro): WIS ≥ 4 → `observacao_precisa`,
  WIS ≤ 2 → `observacao_vaga`, CHA ≥ 4 → `revela_facil`,
  CHA ≤ 2 → `revela_sob_custo`.

FOR e INT não geram comportamento de diálogo — mapeiam à coluna de vestígio,
realizada na Fase 3 (jul/2026) por `src/gerador/vestigios.js`: cada classe de
vestígio declara o atributo que a governa, e o lint de atributo órfão pleno
(qa.mjs) exige FOR/INT/WIS cobertos por classe de vestígio e CHA por
comportamento de diálogo.

### 3.2 O quadrante INT × WIS: gerador de fenótipos de assassino

Prioridade de preservação — é a principal fonte de variedade de "sabor" entre casos:

| | WIS alta | WIS baixa |
|---|---|---|
| **INT alta** | método elaborado, execução limpa — o caso difícil | o gênio com erro idiota embutido |
| **INT baixa** | *streetwise*: método simples, execução limpa (o zelador esperto) | brutal e desleixado — o caso fácil |

Nota normativa: **INT baixa não implica vestígios abundantes.** É WIS que governa a
limpeza; INT governa apenas a complexidade do método.

### 3.3 Conservação da evidência (cláusula de justiça do crime original)

Limpar nunca é de graça. Remoção de vestígio **converte o óbvio em sutil — nunca em
zero**: cheiro de soda cáustica no assoalho esfregado, corpo movido contradizendo o
livor, objeto faltando, panos queimados na lareira. O quadrante regula **quão fundo**
o jogador precisa cavar, jamais **se** existe algo a achar. O `qa.mjs` verifica que
toda ação de limpeza no `RegistroDoCrime` deposita ao menos um vestígio de segunda
ordem (lint da Fase 3).

---

## 4. Arquétipos, demografia e espaço

### 4.1 Arquétipo: a unidade estrutural de geração de personagem

Um arquétipo é um pacote fechado: `profissão → priors de atributos + pool de traits +
pool de motivos potenciais + pacote espacial (§4.2)`. A amostragem de elenco sorteia
arquétipos pelas **frequências demográficas de 1893** (profissão × gênero × idade), e
só então amostra atributos e traits dentro dos priors do arquétipo sorteado —
produzindo personagens correlacionados e plausíveis, não ruído uniforme.

Tabelas embarcadas como dados versionados; problema de dados, não de sistemas —
começar com priors grosseiros e refinar depois. Fonte de cada prior documentada em uma
linha (proveniência, como no manifesto de assets). Validação histórica contra
`docs/kb-mundo-vitoriano/`.

**Fontes de variedade entre seeds, em ordem de peso:** quadrante do assassino × tipo de
cenário (premeditado / briga escalada) × output do autobattler × composição de
arquétipos do elenco. O ruído fino de atributos é a última camada, não a primeira.

Arquétipo ≠ papel dramático: o **papel** (`src/data/papeis.js`) é a função no drama do
caso (assassino-encenador, isca do apressado, véu…); o **arquétipo** é a matéria social
da pessoa (profissão, classe, endereço, atributos prováveis). O gerador escala papéis
EM personagens nascidos de arquétipos.

### 4.2 Ordem de geração espacial: a cidade nasce primeiro

**Ordem:** cidade → elenco (arquétipos × demografia) → **inserção espacial** → seleção
da cena do crime → autobattler no grid da cena → `RegistroDoCrime` georreferenciado.

1. **Inserção espacial pela ficha.** O arquétipo carrega um **pacote espacial**: padrão
   de acomodação por profissão/classe (cortiço, quarto sobre a loja, sobrado), local de
   trabalho, 2–3 locais frequentados e vocabulário fechado de mobília por classe.
   Rotina **grosseira** — três faixas (dia / noite / madrugada) por NPC — suficiente
   para ancorar álibis, avistamentos e quem-ouviu-o-quê. Sem simulação de agenda por
   hora.
2. **Grafo de avistamentos derivado:** de rotina × adjacência espacial deriva quem pode
   ter visto/ouvido quem, onde e em que faixa. Álibis e depoimentos de ruído são
   gerados a partir desse grafo, nunca de texto solto.
3. **LOD por relevância (regra de existência espacial):** interior detalhado (grid +
   mobília) só existe para locais elegíveis a cena (cena do crime, locais de
   interferência, interrogatório). O resto da cidade é fachada no diorama. Interior
   órfão = falha de lint.
4. **Fonte única de verdade espacial:** o grid onde o autobattler roda **é** a planta
   procedural que o jogador explora (a linhagem de `src/data/planta_relojoaria.js` /
   `PlantaRelojoaria.jsx`); ponto de interesse = célula de mobília. Todo vestígio nasce
   ancorado em célula/mobília (sangue na cômoda, cadeira virada na célula, trilha de
   arrasto entre células contradizendo o livor). **Proibida representação espacial
   paralela.**
5. **Variáveis espaciais da batalha** obedecem à regra de existência (§2.3):
   deslocamento do confronto entre células/cômodos (vestígios em dois ambientes),
   proximidade de mobília (o que quebra, o que mancha), rota de fuga (o que se derruba
   ou leva no caminho), arrasto do corpo (trilha + livor), propagação de ruído por
   adjacência grosseira (alimenta o grafo de avistamentos).
6. **Mobília lê-se duas vezes:** âncora de vestígio e leitura social do morador — o
   cômodo conta quem a pessoa é. A cidade gerada alimenta o diorama "maquete de papel"
   existente, que permanece 100% procedural.

**Implementado na Fase 2 (jul/2026)** — tudo em `src/gerador/` (ilha de build time):
dados espaciais em `espaco.js` (14 tipos de prédio com silhueta no schema de
`FORMAS_PREDIO`; mobília doméstica em três degraus de classe + mobília de ofício por
cômodo, proveniência por linha); pacote espacial preenchido em cada arquétipo de
`arquetipos.js`; cidade seedada em `cidade.js` (adro, solar, High Street, orla de
trabalho, ruela de 4–6 cottages; capela e estação opcionais por seed; adjacência
grosseira por distância; projeção `diorama` no contrato de
`POSICOES_DIORAMA`/`FORMAS_PREDIO`); inserção e grafo de avistamentos em
`insercao.js` (rotina em três faixas; grafo DERIVADO de rotina × adjacência, sem
sorteio próprio — o QA o recomputa e exige igualdade byte a byte); interiores LOD em
`interiores.js` (grid canônico + mobília em células de perímetro; planta SVG no
schema de `PLANTA_RELOJOARIA` como projeção 1:1 do grid, `alvos` vazios até a
montagem do pacote jogável, Fase 4+); orquestrador `mundo.js` (`gerarMundo(seed)`), vitrine em
`scripts/demo-cidade.mjs` (`npm run demo:cidade`). Guardas novas no `qa.mjs`: replay
do mundo, mundos distintos, integridade espacial (lint de interior órfão incluso) e
completude dos pacotes espaciais.

---

## 5. Sistema de interferência — as Regras de Justiça

Interferência = ação do assassino ou cúmplice contra a investigação, **pré-computada na
geração como evento contingente** dentro do pacote de caso ("se o jogador fizer X antes
do momento Y, ocorre Z"). Nunca agência livre em runtime. (É a versão adulta e regrada
da semente §7.3 do `MORTEM_CONTEXTO.md` — o confronto que faz o suspeito agir.)

- **R1 — Todo ato de interferência é um segundo crime, e crime sob pressão é mais
  malfeito que o primeiro.** O assassinato original teve planejamento; a interferência
  é improviso: resolve contra WIS **com penalidade**, e o vestígio depositado é mais
  fresco e mais grosseiro que os do crime original.
- **R2 — Saldo informacional ≥ 0.** Interferência só pode destruir evidência
  **redundante** (nunca a âncora durável, nunca o último caminho até ela) e deve
  depositar **pelo menos um vestígio novo**. O jogador perde um caminho e ganha outro;
  a tensão vem da troca, não do roubo.
- **R3 — Causalidade diegética (informação + acesso).** O gatilho é sempre ação
  **observável** do jogador (interrogatório em público, perguntas espalhadas, cobertura
  de jornal). O assassino só reage ao que poderia plausivelmente saber — e o ator da
  interferência precisa de **rota espacial plausível** até o alvo (endereço, rotina e
  adjacência do grafo de avistamentos sustentam o trajeto). Olhando para trás, o
  jogador deve conseguir reconstruir "ele só soube porque eu…" e "ele só chegou lá
  porque…".
- **R4 — Prenúncio obrigatório para interferência de alto impacto.** Antes de uma
  testemunha morrer, existe sinal legível (a testemunha nervosa: "não devia estar
  falando com o senhor"). Quem lê o sinal pode proteger ou extrair o depoimento a
  tempo; quem não lê, entende depois por que perdeu.
- **R5 — Orçamento.** Máximo de 2–3 eventos de interferência por caso, sorteados na
  **geração** (a "baixa probabilidade" vira variedade entre seeds, não caos dentro do
  caso).
- **R6 — Catálogo fechado de tipos** (v1): `destruir_evidencia`,
  `intimidar_testemunha`, `subornar_testemunha`, `silenciar` (matar
  testemunha/cúmplice). Cada tipo declara: gatilho observável, ator (assassino ou
  cúmplice), rolagem WIS com penalidade, vestígios depositados, delta informacional.
  Suborno deve produzir contradição detectável (depoimento novo × registro anterior ×
  evidência física) e rastro de dinheiro de época (dívidas quitadas de repente).

Em runtime, o motor apenas **verifica condições de gatilho já materializadas no
pacote** e aplica o evento (remover evidência redundante marcada + inserir vestígios
novos) — nenhuma decisão nova em runtime, nenhum LLM. As Regras de Justiça são
promovidas a invariantes verificados por máquina na Fase 5 (prova da âncora sob todos
os ramos da árvore de eventos; saldo informacional; causalidade; prenúncio; replay).

**Implementado na Fase 4 (jul/2026)** — gerador em `src/gerador/interferencia.js`
(ilha de build time): catálogo fechado v1 em `CATALOGO_INTERFERENCIA` (os 4 tipos da
R6, cada um com gatilho observável, penalidade WIS, vestígios de sucesso/falha e
delta informacional, proveniência por linha) + `CLASSES_VESTIGIO_INTERFERENCIA`
(extensão da tabela viva §3.1: todas WIS, todas FRESCAS — datáveis como posteriores
à 1ª perícia). Sorteio em duas passadas dentro de `gerarCasoBruto` (caso.js):
o **esqueleto** pré-crime (orçamento 0–3 ponderado, tipos em rotação, ator com
cúmplice-coabitante em probabilidade menor, faixa de ação; o local do `silenciar`
entra em `locaisElegiveis` — LOD) e a **materialização** pós-fatia (rolagem R1
`dado < max(0, WIS−2)`; redundância R2 recomputada com as funções do MOTOR —
`fatiaResolveSem`: janela cobre, mecanismo crava, presença e móbil apontam o réu —
inclusive no RAMO PIOR com todas as destruições juntas; rota R3 sustentada por
rotina/adjacência/frequentados, mais `retorno_a_cena` só para o assassino voltar à
própria cena; `comoSoube`/`comoChegou` reconstituíveis por evento). A ponte
(ponte_caso.js) passou a emitir as cartas de REDUNDÂNCIA que o crime deixa
(gen_sangue_alheio e gen_pegadas como 2ª/3ª vias de presença; gen_ruido_ouvido como
testemunho da vizinhança com `origemTestemunha`) e cada carta declara
`suporteFisico` ('corpo' | 'cena' | 'registro' | 'testemunho' | 'pertences_do_reu') —
só 'cena' é destrutível; o corpo e o registro policial ficam fora do alcance de
interferência. Decisões de forma: **suborno não destrói o registro anterior** (a
contradição detectável da R6 exige o par depoimento novo × registro velho — o
gatilho é a extração do próprio depoimento, então o par está sempre nas mãos do
perito) e **nenhum gatilho destrói a própria carta-gatilho** (senão o evento nasceria
sempre evitado). Prenúncio R4 com prosa REAL (`PROSA_PRENUNCIO`, pipeline
revisar-prosa), interpolada com o nome da testemunha no build. Runtime mínimo em
`store/jogo.js` (`dispararInterferencias` + dois gates em `extrairCarta`: vestígio
novo não existe antes do disparo; evidência destruída perde-se depois — salvo
`evitada`, quando o perito a registrou primeiro) e eco pós-caso em
`logic/ecoInterferencia.js` sobre a prosa de `data/ecos_interferencia.js` (mesmo
mecanismo dos códigos de falha da Fase 6). Pacote de caso ganhou os campos OPCIONAIS
`interferencias` e `ecosInterferencia` (tutorial sem eles — regressão zero, provada
no QA). Guardas novas no `qa.mjs`: catálogo íntegro, lints por evento (R1–R5, gatilho
órfão, rota órfã, prenúncio, LOD do local do silenciamento), cobertura dos 4 tipos +
cúmplice em seeds fixas, runtime sintético (gate/perda/evitada/eco/tutorial inerte) e
cegueira do motor. Vitrine em `scripts/demo-interferencia.mjs`
(`npm run demo:interferencia`).

**Implementado na Fase 5 (jul/2026)** — as Regras de Justiça viraram invariantes
verificados por máquina no `qa.mjs` (seção "FASE 5"), sobre as seeds da Fase 3 e as
seeds fixas de interferência da Fase 4:

- **Prova da âncora sob todos os ramos:** a árvore de combinações de eventos é
  enumerada (todo subconjunto é estado alcançável — o jogador controla os gatilhos
  pela ordem em que investiga; orçamento ≤ 3 ⇒ ≤ 8 ramos) e, em cada ramo, a fatia
  resolve com as mesmas funções do motor (janela cobre a morte, mecanismo cravado,
  presença e móbil do réu). Mais de 3 eventos = falha imediata (é a R5 que mantém a
  enumeração trivial).
- **Saldo informacional explícito (R2):** o conjunto redundante é computado carta a
  carta (a remoção isolada ainda resolve) e todo evento destrói dentro dele, além de
  depositar ≥ 1 carta nova — pertencer ao conjunto é a definição de "destrutível";
  o evento nunca decide sozinho.
- **Causalidade (R3):** gatilho órfão e rota órfã já eram falha na guarda da Fase 4;
  a Fase 5 acrescenta a prova adversarial (abaixo) de que essas guardas caem.
- **Prenúncio na prosa (R4):** todo `silenciar` publica carta de sinal cuja prosa é
  idêntica ao texto do evento, interpolada (sem `{slot}` residual), nomeia a
  testemunha-alvo e fica fora do gate do disparo.
- **Replay:** mesma seed → mesmo caso inteiro byte a byte (cidade, inserções, crime,
  fatia e eventos contingentes), agora também nas seeds fixas de interferência.
- **Casos-armadilha (o aceite da fase):** clones de casos reais com uma violação
  injetada — âncora destruível (o evento passa a destruir `gen_motivo`), gatilho
  órfão, rota órfã, silenciar sem prenúncio, evento sem carta nova — têm de ser
  DETECTADOS pelas guardas, e o caso válido tem de passar nas mesmas provas (sem
  falso positivo). O QA falha se qualquer armadilha escapar.

O tutorial (sem `interferencias`) segue passando inalterado — zero ramos, zero
eventos, regressão zero.

---

## 6. Fora de escopo (rejeitado nesta ordem, com motivo)

- **Simulação de agenda por hora / rotina contínua** à la Shadows of Doubt — três
  faixas horárias bastam para álibis e avistamentos.
- **Interior detalhado para locais não elegíveis a cena** — LOD por relevância; interior
  sem função investigativa é custo sem vestígio.
- **Grid de alinhamento D&D** — redundante com motivo + traits.
- **Batalha/rolagens em runtime** — o autobattler existe exclusivamente na geração; o
  motor consome apenas o `RegistroDoCrime`.
- **Autobattler visível ou jogável; qualquer combate envolvendo o detetive** — MORTEM é
  perícia, não ação; o jogador não luta nem é ferido.
- **Agência livre do assassino em runtime** — quebra a validação de solvabilidade
  (âncora durável só é provável sobre eventos enumeráveis).
- **`plantar_evidencia_falsa`** — adiado para v2; quando entrar, nasce com falha
  detectável por construção, atada ao WIS de quem forjou.
- **Ficha/atributos do detetive** — regra de existência (§3): nada no jogo detecta
  atributos do perito.
- **LLM avaliando gatilhos em runtime** — invariante 4; gatilhos são condições
  materializadas no pacote.

---

## 7. Roteiro de implementação (referência)

| Fase | Entrega | Portão |
|---|---|---|
| 1 | Modelo de personagem no gerador: priors 1893 com proveniência, amostragem determinística, quantização em comportamentos de diálogo, teste de replay | build + QAs verdes; 3 seeds → 3 elencos plausíveis |
| 2 | Geração espacial: cidade seedada, pacote espacial por arquétipo, inserção + grafo de avistamentos, interiores LOD, lint de interior órfão | build + QAs verdes; 3 seeds → 3 cidades; inspeção do diorama |
| 3 | `resolverCrime(...)`: autobattler no grid, `RegistroDoCrime` georreferenciado, mapeamento atributo→vestígio, ponte para o pacote de caso, lints (atributo órfão, variável órfã, limpeza sem 2ª ordem, coerência espacial), replay da rejeição | `qa.mjs` "CASO VÁLIDO" num caso gerado de ponta a ponta; playtest do dono |
| 4 | Interferência: catálogo v1, sorteio determinístico 0–3 eventos, prenúncio via pipeline de prosa, runtime mínimo de gatilhos, eco do mestre | playtest com 1 evento de cada tipo; verificação manual de R3 |
| 5 | QA da solvabilidade sob interferência: prova da âncora em todos os ramos, saldo informacional, causalidade, prenúncio, replay byte a byte | `qa.mjs` falha nos casos-armadilha e passa no válido; tutorial inalterado (regressão zero) |

Cada fase exige plano pré-código aprovado pelo dono; nenhuma fase começa sem a anterior
aceita. O caso tutorial (seed fixa) permanece inalterado em comportamento durante toda a
ordem.
