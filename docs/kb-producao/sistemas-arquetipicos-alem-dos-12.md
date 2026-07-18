# Sistemas arquetípicos além dos 12 — matéria-prima para um catálogo próprio

> Consulta de planejamento (não rege prosa). Responde a uma pergunta de design: **se os "12
> arquétipos" são limitantes e de proveniência comercial, de onde tirar (ou como construir)
> arquétipos melhores?** Mapeia a linhagem real dos 12, os sistemas alternativos (do próprio
> Jung a Moore & Gillette, Vogler e Hillman), extrai os critérios que fazem um arquétipo
> *funcionar* — e fecha com o **catálogo v1 de MORTEM (§7)**: promovido de `[PROPOSTA]` a
> catálogo vigente pela OS `docs/os-camada-psiquica-do-elenco.md` (jul/2026), com as
> emendas do §7.4. Mesmo estatuto de andaime de
> [`arquetipos-e-casting.md`](./arquetipos-e-casting.md) §0: build time, não-diegético,
> rótulo descartado antes do pacote (implementação em `src/gerador/vetores_psiquicos.js`).

---

## 0. Calibragem — dois "arquétipos" e uma correção de proveniência

- **Não confundir as duas colunas do projeto.** O **arquétipo demográfico**
  (`src/gerador/arquetipos.js`: squire, pároco, médico… — profissão + classe + priors) está
  implementado e é a *matéria social* da pessoa. O **arquétipo psicológico** (este arquivo e
  `arquetipos-e-casting.md`) é a *matéria íntima* — valor, medo, sombra — e hoje existe só em
  documentação. O catálogo do §7 propõe a segunda coluna como camada **ortogonal** à primeira:
  qualquer psique pode calhar em qualquer ofício — e o **desencaixe** entre as duas é motor
  de móbil (§7.3).
- **Correção de proveniência (a pesquisa refinou o que o §2 de `arquetipos-e-casting.md`
  resume).** A linhagem real: *The Hero Within* (Pearson, 1986) propõe **6** arquétipos;
  *Awakening the Heroes Within* (Pearson, 1991) expande para **12** e traz o instrumento
  *Heroic Myth Index*; *The Hero and the Outlaw* (Mark & Pearson, 2001) **aplica ao
  marketing** os 12 já existentes; o **PMAI** (Pearson & Marr, publicado pelo CAPT, 2002–06)
  os operacionaliza como teste. Ou seja: os 12 nascem como **programa de autoajuda** (1991),
  não de marketing (2001) — e muito menos de Jung.

## 1. A caixa dos 12 — o que ela é e por que aperta

- **Listas divergentes por construção.** O próprio corpus de Pearson trabalha com 6, 12 ou
  mais arquétipos conforme a obra; a lista de branding (Sábio, Inocente, Explorador,
  Governante, Criador, Cuidador, Mago, Herói, Fora-da-lei, Amante, Bobo, Pessoa Comum) é uma
  fotografia de 2001, não um resultado. Nenhuma validação empírica independente sustenta o
  corte em doze.
- **A raiz declarada é psicologia profunda** (Jung, Hillman, Campbell), não psicologia da
  personalidade empírica — coerente com o veredicto científico sobre tipologias em
  [`psicologia-pos-junguiana.md`](./psicologia-pos-junguiana.md) §3.
- **O que ela ainda tem de bom:** cada linha embute um **vetor** (valor × medo × sombra) — e
  é o vetor, não o rótulo nem o número doze, que gera móbil. A tabela de
  `arquetipos-e-casting.md` §2 continua útil como *starter kit*; este arquivo ensina a
  fabricar vetores novos.

## 2. As figuras do próprio Jung — uma lista aberta por princípio

Jung nunca propôs inventário fechado. As figuras que nomeou são poucas e exemplares — sombra,
velho sábio, criança, mãe (e a Grande Mãe de Neumann), donzela/Kore, anima/animus, Trickster,
*puer aeternus*/*senex* — e a teoria afirma que o número é **ilimitado**: arquétipos se
combinam, e uma lista exaustiva seria exercício fútil. Murray Stein os lê como **série
desenvolvimental** (criança divina → herói → *puer/puella* → rei/rainha → anciã/velho sábio):
menos "tipos de gente", mais **estações de um arco de vida**.

Duas consequências de design:

- **A caixa dos 12 é anti-junguiana até para Jung.** Criar arquétipos novos não é heresia; é
  o uso previsto.
- **Pares polares valem mais que rótulos isolados.** *Puer/senex* (o eterno jovem × o velho
  rígido), donzela/anciã, herói/sombra — o par carrega tensão dramática nativa; o rótulo
  sozinho, não.

## 3. Moore & Gillette — a sombra bipolar (o achado técnico mais útil)

*King, Warrior, Magician, Lover* (Moore & Gillette, 1990) organiza quatro arquétipos "maduros",
cada um num **triângulo**: a expressão plena no ápice e **duas sombras nos cantos — uma ativa
(grandiosa), outra passiva (deflacionada)**:

| Arquétipo | Plenitude | Sombra ativa | Sombra passiva |
|---|---|---|---|
| Rei | ordena e abençoa | **Tirano** | **Fraco** (abdica, terceiriza) |
| Guerreiro | age com disciplina | **Sádico** | **Masoquista** (engole afronta até explodir) |
| Mago | sabe e transforma | **Manipulador frio** | **"Inocente" que nega** (sabe e se omite) |
| Amante | vincula-se ao mundo | **Amante viciado** (possessivo) | **Amante impotente** (anulado, dependente) |

O mecanismo psicodinâmico declarado: **inflação do ego alimenta a sombra ativa; deflação
alimenta a passiva**. Ressalvas devidas: é pop-junguiano dos anos 90, recorte masculinista,
sem validação empírica — mesmo estatuto de andaime dos 12. Mas o desenho **sombra dupla** é
tecnicamente superior à sombra única da tabela de `arquetipos-e-casting.md` §2, porque um
mesmo arquétipo passa a gerar **dois fenótipos de suspeito**:

- a sombra **ativa** dá o agressor direto (o patriarca-Tirano que elimina a ameaça);
- a sombra **passiva** dá o cúmplice, o omisso e o **mandante fraco** — quem não mata, mas
  deixa matar, paga para matar ou "só não viu". É exatamente o elenco de que as Regras de
  Justiça R1–R6 precisam (ator de interferência, cúmplice-coabitante) e a matéria dos papéis
  `veu` e `mentiroso_por_medo`.

## 4. Campbell/Vogler — arquétipo como função, não como pessoa

A linhagem Jung → Campbell (*The Hero with a Thousand Faces*, 1949) → Vogler (*The Writer's
Journey*, 1992, nascido de um memorando de estúdio) converte figuras intrapsíquicas em
**funções narrativas**: Herói, Mentor, Guardião do Limiar, Arauto, Camaleão (*shapeshifter*),
Sombra, Aliado, Trickster. Três lições transferíveis:

- **Função ≠ identidade.** Em Vogler, arquétipo é **máscara que o personagem veste em relação
  ao protagonista**, e personagens trocam de máscara no meio da história (o Trickster "pode
  ser aliado, servir ao vilão ou agir por conta própria"). MORTEM já opera assim: os seis
  papéis de `src/data/papeis.js` são funções no drama, não almas. A separação
  papel dramático × arquétipo psicológico do projeto reproduz, correta e independentemente, a
  separação estrutura × personagem de Vogler.
- **Subtipos parametrizam.** Vogler subdivide cada função (seis variantes de herói, oito de
  mentor) — precedente direto para parametrizar arquétipos por sorteio determinístico em vez
  de multiplicar rótulos.
- **A Sombra narrativa é o espelho do detetive.** Na gramática de Vogler, a Sombra externa
  encena o material renegado do herói — no mistério, o assassino como espelho do
  investigador é o uso clássico (matéria para o monólogo, jamais nomeada).

## 5. Hillman — o politeísmo psíquico (a demolição da caixa por dentro)

A escola arquetípica de **James Hillman** (*Re-Visioning Psychology*, 1975) radicaliza: a
psique é **polizeísta** — habitada por muitas figuras simultâneas, sem hierarquia nem número;
os deuses são **ressonadores metafóricos**, não entidades; e o arquétipo é sempre
**fenomênico** (acessível como imagem), contra o arquétipo transcendente de Jung. No *The
Soul's Code* (1996), a imagem da **semente** (*acorn*): cada vida expressa um caráter que não
é causa mecânica, mas **tema que insiste em se manifestar**.

Tradução de design: um personagem não *é* um arquétipo; é um **campo** onde dois ou três
temas disputam (a viúva é Soberana do próprio luto, Amante do morto e Erudita do rancor). O
catálogo do §7 adota isso: **arquétipo dominante + traço dissonante**, nunca caixa exclusiva.

## 6. Critérios para construir arquétipos que funcionam

Síntese dos sistemas acima + a crítica de `arquetipos-e-casting.md` §5. Um arquétipo de
casting presta se, e só se:

1. **Carrega o vetor completo:** valor professado → medo central → sombra (nas **duas
   polaridades**, §3) → auto-justificação. Sem os quatro elos, é adjetivo, não arquétipo.
2. **Gera persona E segredo da mesma fonte** (a máquina de `arquetipos-e-casting.md` §3).
3. **Aceita qualquer papel dramático.** Se um arquétipo só serve para culpado, é rótulo de
   vilão, não psicologia — cada linha do catálogo precisa alimentar bem ao menos 3 dos 6
   papéis de `papeis.js`.
4. **Ancora na pressão de época, não no universal.** O medo se materializa em coisas de 1893
   com rastro periciável (deserdação, *character* negado, escândalo, despejo — os
   `MOTIVOS_POTENCIAIS` existentes são o cardápio).
5. **É ortogonal à profissão** — e o desencaixe é produtivo (§7.3).
6. **Admite dissonância interna** (Hillman, §5): um traço fora do eixo por pessoa, sorteado,
   para matar o mad-libs.

## 7. Catálogo v1 de MORTEM — onze vetores

> **Estatuto: catálogo v1**, promovido de `[PROPOSTA]` pela OS
> `docs/os-camada-psiquica-do-elenco.md` (§4.1, jul/2026), que dá a ordem expressa de
> implementação em `src/gerador/vetores_psiquicos.js`. Onze vetores construídos pelos
> critérios do §6, com sombra bipolar (§3), calibrados à vila inglesa de 1893 e nomeados
> sem reaproveitar os rótulos de Pearson (exceção consciente registrada no §7.4.3). O
> rótulo segue sendo andaime: morre no log de build, jamais em `src/data`, prosa ou UI.

### 7.1 Os onze vetores

| # | Arquétipo | Valor professado | Medo central | Sombra ativa | Sombra passiva | Auto-justificação típica |
|---|---|---|---|---|---|---|
| 1 | **Zelador** | cuidar dos seus | ser inútil, sobrar | mártir controlador; "veneno da misericórdia" | negligência ressentida ("ninguém cuida de mim") | "foi um ato de amor" |
| 2 | **Soberano** | ordem, nome, patrimônio | queda de status, escândalo | tirania; elimina a ameaça ao nome | fraqueza que terceiriza (manda, paga, finge não ver) | "preservei a família" |
| 3 | **Erudito** | saber, exatidão | errar em público, virar irrelevante | cálculo frio; o método perfeito | omissão pedante (sabia e calou) | "era a solução racional" |
| 4 | **Devoto** | pureza, fé, temperança | contaminação moral; o próprio pecado exposto | inquisidor que pune o pecador | hipócrita que abafa o que sabe | "cortei o mal pela raiz" |
| 5 | **Artífice** | a obra bem-feita, o ofício | a obra arruinada; o ofício desbancado | obsessão que sacrifica pessoas à obra | rancor surdo do preterido | "a obra vale mais que ele" |
| 6 | **Amante** | o vínculo, a paixão | perda, traição, substituição | posse ciumenta ("de mais ninguém") | anulação dependente (aceita tudo — até demais) | "se não podia ser meu…" |
| 7 | **Provador** | a respeitabilidade *conquistada* | voltar a ser ninguém | ressentimento nivelador; cobra a humilhação antiga | servilismo rancoroso (curva-se e odeia) | "eu nunca tive a chance dele" |
| 8 | **Errante** | horizonte, liberdade | ficar preso (à vila, à dívida, ao casamento) | fuga por cima de vidas | paralisia amarga do que não partiu | "eu não podia ficar" |
| 9 | **Justiceiro** | honra, a conta certa | afronta impune; passar por covarde | violência de honra; pena capital privada | submissão que acumula e explode | "foi uma luta justa" |
| 10 | **Bufão** | o riso, a leveza | ser invisível, não ter graça | crueldade leviana; a "brincadeira" fatal | bode expiatório que guarda rancor | "não era pra tanto" |
| 11 | **Vigia** | saber o que se passa na vila; pertencer pela informação | irrelevância, ficar de fora do que importa | chantagista/difamador — candidato natural à segunda vítima clássica (quem viu e tentou lucrar) | o voyeur que testemunhou o essencial e não pode explicar por que estava à janela | "alguém tinha de saber" |

Cada linha alimenta os dois lados do mistério (persona luminosa + segredo), aceita os seis
papéis dramáticos e tem sombra dupla — o **ativo** tende a `assassino_encenador` /
`isca_do_apressado`; o **passivo** tende a cúmplice de interferência, `veu`,
`mentiroso_por_medo`. A afinidade fina vetor → papel segue a lógica já tabelada em
`arquetipos-e-casting.md` §4.1 — com o acréscimo do Vigia, que alimenta com força os
papéis mais magros daquela tabela: `fonte` (quem sabe e circula), as testemunhas e o
`veu` (quem viu, mas mente o porquê de ter visto).

### 7.2 Afinidade com os 14 arquétipos demográficos (pesos de sorteio, não exclusividade)

Ortogonalidade com viés: qualquer vetor pode calhar em qualquer ofício, mas a época torna
alguns encaixes mais prováveis — pesos de afinidade para `hashString`, jamais restrição dura:

| Demográfico (`arquetipos.js`) | Afinidades naturais | Encaixes raros e saborosos |
|---|---|---|
| squire | Soberano, Justiceiro | Errante (o herdeiro que odeia a herança) |
| paroco | Devoto, Zelador, Erudito | Bufão (o vigário engraçado — e leviano); Vigia (o pároco que cataloga o rebanho) |
| medico | Erudito, Zelador | Soberano (o médico que reina pela receita) |
| boticario | Erudito, Artífice | Provador (o balcão como degrau de subida) |
| taverneiro | Bufão, Provador, Vigia (o balcão ouve a vila inteira) | Devoto (herdou o pub que a capela manda odiar) |
| ferreiro / moleiro | Artífice, Justiceiro | Erudito (o autodidata sem letras) |
| merceeiro | Provador, Soberano, Vigia (a caderneta sabe quem deve a quem) | Zelador (a caderneta como cuidado — e coleira) |
| professora | Erudito, Devota, Zeladora | Errante (a instrução como bilhete de fuga) |
| costureira / lavadeira | Artífice, Amante, Provadora, Vigia (a roupa conta segredos) | Erudita (a inteligência sem porta de saída) |
| lavrador | Zelador, Justiceiro, Errante | Soberano (o patriarca de cottage) |
| criada | Zeladora, Amante, Provadora, Vigia (a classe que serve vê tudo) | Justiceira (a que anota cada afronta) |
| constable | Justiceiro, Provador | Errante (o uniforme como jaula) |

### 7.3 O desencaixe arquétipo × profissão — o motor de móbil do assassino

A regra candidata central: **para o elenco em geral, sorteia-se com os pesos de afinidade;
para o assassino (e só para ele), o gerador pode *forçar* um desencaixe** — um vetor íntimo
que a posição social de 1893 não deixa exercer. O crime nasce da pressão acumulada entre o
que a pessoa é e o que a vila a deixa ser; a sombra é a válvula. Exemplos calibrados na KB:

| Desencaixe | Pressão de época (com fonte na KB) | Móbil que destrava |
|---|---|---|
| **Erudita** numa costureira/criada | instrução feminina sem porta: professora é o único degrau, e mal pago ([`../kb-mundo-vitoriano/economia-e-estrutura-social.md`](../kb-mundo-vitoriano/economia-e-estrutura-social.md) §5) | o método perfeito como única obra possível; elimina quem a humilha pelo saber |
| **Soberano** num merceeiro/moleiro | classe como teto; a gentry não o recebe (idem §2) | remove o degrau humano entre ele e o status (herança, dote, sócio) |
| **Errante** em lavrador/constable | êxodo rural: os jovens partem, ele ficou (idem §1) | mata para não ser ancorado — a dívida, o casamento, o chantagista que o prende |
| **Devoto** num taverneiro | temperança × pub; capela × igreja (idem §6; motivo `rivalidade_capela_taverna` já existente) | silencia quem pode expor o pecado que nega — no próprio balcão |
| **Amante** numa esposa sem saída | divórcio quase impossível; propriedade da mulher recém-conquistada (idem §5; [`../kb-psique-e-crime/sexologia-e-perversoes.md`](../kb-psique-e-crime/sexologia-e-perversoes.md) §4) | o cônjuge morto é a única porta que a lei deixa |
| **Justiceiro** numa criada/lavadeira | a afronta do patrão não tem instância: *character* negado é ruína sem apelação (motivo `character_negado`) | a "conta certa" cobrada por mão própria |
| **Artífice** num lavrador | o ofício sonhado atrás do balcão do outro; aprendizado negado por pobreza | destrói (ou rouba) a obra que não pôde assinar |

Para o **restante do elenco**, o mesmo eixo trabalha em intensidade menor: desencaixes
parciais gerariam o atrito assassino × vítima (dois Soberanos num só lugarejo), os motivos
de cúmplices (o passivo que serve a um ativo), e as mentiras de inocentes (o Devoto que
esconde o pecado, não o crime). E o **traço dissonante** (§6.6) continua obrigatório — o
Tirano terno com um neto — para que nenhuma linha do catálogo vire caixa.

### 7.4 Emendas do catálogo v1 (OS da camada psíquica, §4.1)

#### 7.4.1 O 11º vetor: Vigia

O elenco de 1893 é uma vila-panóptico — e faltava ao catálogo quem professa exatamente
esse valor: **saber o que se passa; pertencer pela informação**. O Vigia fecha os quatro
elos do §6.1:

- **Valor professado:** saber o que se passa na vila; ser quem liga as pontas.
- **Medo central:** irrelevância — ficar de fora do que importa, não ser consultado.
- **Sombra ativa:** o **chantagista/difamador** — a informação vira renda ou arma. É o
  candidato natural à **segunda vítima clássica do gênero**: quem viu e tentou lucrar
  (matéria direta para o evento `silenciar` das Regras R1–R6).
- **Sombra passiva:** o **voyeur que testemunhou o essencial e não pode explicar por que
  estava à janela** — a materialização exata do "interesse atípico como segredo de
  inocente" ([`parafilias-e-psicopatia-visao-atual.md`](./parafilias-e-psicopatia-visao-atual.md)
  §3: voyeurismo acima do limiar do estatisticamente incomum, majoritariamente
  inofensivo), sempre dito no vocabulário de época
  ([`../kb-psique-e-crime/sexologia-e-perversoes.md`](../kb-psique-e-crime/sexologia-e-perversoes.md)
  §6: eufemismo, nunca nosologia).
- **Auto-justificação:** "alguém tinha de saber".

Afinidades demográficas (incorporadas à tabela 7.2, derivadas da KB): **lavadeira** (a
roupa das casas conta segredos — sexologia §6, os "objetos falantes"), **criada** ("a
classe que serve vê tudo" — sexologia, Implicações), **merceeiro** e **taverneiro** (a
caderneta e o balcão como postos de escuta — demografia §5); encaixe raro e saboroso: o
**pároco** que cataloga o rebanho (sabe dos batismos ilegítimos — demografia §5).
Afinidade de papel: forte com `fonte`, testemunhas e `veu` — os papéis mais magros da
tabela de `arquetipos-e-casting.md` §4.1.

#### 7.4.2 Médium/espiritismo dos 1890s: tempero, não 12º vetor

Analisado pelos critérios do §6, o médium **não sustenta vetor próprio**:

1. *Vetor completo?* Construível (valor: o consolo/a ponte com os mortos; medo: exposição
   como fraude; sombra ativa: o charlatão do além que silencia quem ia expô-lo; passiva: o
   crente que se ilude e omite) — passa.
2. *Persona e segredo da mesma fonte?* Passa.
3. *Aceita ≥ 3 papéis?* No limite: serve a culpado, `veu` e `fonte` — mas sempre pela
   MESMA alavanca (a fraude), o que o aproxima de rótulo de situação, não de psique.
4. *Pressão de época?* Passa (o espiritismo é febre real dos 1890s; o clichê e seu uso
   honesto já estão mapeados em
   [`../kb-craft-narrativo/cliches-e-fair-play.md`](../kb-craft-narrativo/cliches-e-fair-play.md):
   a sessão fraudulenta como mentira de inocente, a "fraude paralela").
5. *Ortogonal à profissão?* **Falha.** Mediunidade é PRÁTICA — um ofício paralelo que
   qualquer psique pode exercer —, não matéria íntima; como vetor, colidiria com a coluna
   demográfica em vez de cruzá-la.

**Decisão registrada:** entra como *tempero* — sombra ativa alternativa do **Devoto** (o
consolo que vira fraude piedosa) ou do **Erudito** (o "investigador psíquico" que não pode
admitir o embuste), a realizar quando a camada de segredos o sortear. Como a análise NÃO
indicou 12º vetor, o ponto de parada previsto na OS (§4.1.2) não se ativou.

#### 7.4.3-bis — ver §7.5 para o catálogo v2 (13 vetores)

#### 7.4.3 Nota "Amante" — exceção consciente

A regra de nomenclatura do catálogo ("sem rótulos de Pearson") tem UMA exceção deliberada:
**Amante** colide com o *Lover* de Pearson/Moore & Gillette e fica assim mesmo — nenhum
sinônimo de época (galanteador? apaixonado?) carrega o par posse/anulação com a mesma
economia. Registra-se a exceção para que ninguém a "corrija" por zelo de consistência.

### 7.5 Catálogo v2 — os vetores 12 e 13 (OS priors compostos, jul/2026)

A OS `docs/os-priors-compostos-e-variedade-do-elenco.md` (F1 §2.2, decisão do autor)
promoveu o catálogo a **v2** com dois vetores novos, ambos aprovados pelos critérios
do §6 — e um terceiro candidato **reprovado** com registro (o Penitente: o medo
central colide com o `pecado_exposto` do Devoto; dois vetores para a mesma pergunta
de interrogatório é rótulo duplicado, não psique nova).

| # | Arquétipo | Valor professado | Medo central | Sombra ativa | Sombra passiva | Auto-justificação |
|---|---|---|---|---|---|---|
| 12 | **Previdente** | previdência, o pé-de-meia; nunca dever a ninguém | a miséria à vista — a workhouse, o enterro de indigente | o agiota da vila; mata pelo seguro (*penny policy*) | o sovina que nega o socorro e deixa morrer de economia | "não podíamos sustentá-lo" |
| 13 | **Enraizado** | a terra, a casa, a continuidade | o desenraizamento: despejo, venda, o êxodo | mata para não ser arrancado | apodrece no lugar e sabota a partida dos outros | "esta casa é o que somos" |

Ancoragem de época: o pavor da workhouse e do enterro de indigente
(`../kb-mundo-vitoriano/demografia-e-sociedade.md` §4; `economia-e-estrutura-social.md`
§3) dá ao Previdente o dono psíquico do móbil `seguro_de_enterro`; a depressão
agrícola e o êxodo (`economia` §1) fazem do Enraizado o **par polar** do Errante
(ficar preso × ser arrancado — §2: pares valem mais que rótulos). Afinidades
demográficas e a matriz completa (agora 13 vetores × 18 demográficos, com os
segundos raros de F3) vivem em `src/gerador/vetores_psiquicos.js`, sob as guardas
do `qa.mjs`; os números regenerados estão no relatório v2 da OS.

**Nota estrutural da mesma OS (decisão 12):** o campo `afinidadePapeis` saiu do
catálogo implementado — era reserva documentada que o fluxo gerado nunca consumiu
(o caso gerado não escala papéis nomeados). A afinidade vetor → papel permanece
como leitura de design nas tabelas deste doc, sem contraparte em código.

## Implicações para o jogo

- **O número doze era o problema errado.** O limite real dos 12 é serem rótulos sem sombra
  bipolar e sem ancoragem de época. Um catálogo próprio, menor ou maior, resolve mais que
  esticar a lista de Pearson.
- **Sombra dupla dobra o elenco.** Cada vetor gera agressor (ativo) e cúmplice/omisso
  (passivo) — casa com a arquitetura de interferência (R1–R6) e com os papéis de mentira
  moral existentes.
- **O desencaixe vetor × profissão é o motor de móbil do assassino** — com o
  **falso-positivo garantido** (sempre existe ao menos um destoante inocente), preservando
  a regra de contraste de `arquetipos-e-casting.md` §4.1 (culpado de persona luminosa) e o
  fair play: o desencaixe sustenta hipótese, nunca condena. Norma e implementação na OS
  `docs/os-camada-psiquica-do-elenco.md` (§4.3, §8.3).
- **O §7 é catálogo v1 vigente** (ordem expressa na OS citada): número de vetores (11),
  pesos da tabela 7.2, regra de desencaixe do assassino e compilação das consequências
  (flags, tendências de vestígio) sem vazamento de rótulo estão normatizados lá e
  implementados em `src/gerador/vetores_psiquicos.js`, sob as guardas do `qa.mjs`.

## Fontes consultadas

- Linhagem Pearson/PMAI: [*Awakening the Heroes Within* (1991), archive.org](https://archive.org/details/awakeningheroesw0000pear) (subtítulo e *Heroic Myth Index* conferidos no registro primário); [Carol S. Pearson, Wikipedia](https://en.wikipedia.org/wiki/Carol_S._Pearson); [*The Hero and the Outlaw* (2001), Google Books](https://books.google.com/books/about/The_Hero_and_the_Outlaw_Building_Extraor.html?id=l6qXGiTld1sC); Storywell (custódios do PMAI), "Roots of the Pearson-Marr Archetypes"
- Figuras e lista aberta de Jung: [Jungian archetypes, Wikipedia](https://en.wikipedia.org/wiki/Jungian_archetypes) ("o número de arquétipos é ilimitado"; lista de branding como aplicação posterior); Murray Stein, *Jung's Map of the Soul* (1998) — série desenvolvimental
- Moore & Gillette: *King, Warrior, Magician, Lover* (1990); estrutura triangular e sombras bipolares conforme [síntese de Scott Jeffrey](https://scottjeffrey.com/king-warrior-magician-lover-masculine-archetypes/) (fonte secundária; conferir na obra antes de citar em material público)
- Campbell/Vogler: [*The Writer's Journey*, Wikipedia](https://en.wikipedia.org/wiki/The_Writer%27s_Journey:_Mythic_Structure_for_Writers) (memorando de origem, 8 arquétipos, 12 estágios); [quadro de arquétipos de Vogler (PDF didático)](https://marcushumanities12.weebly.com/uploads/3/7/9/0/37903231/vogler_archetypes.doc.pdf) (funções psicológica/dramática; subtipos)
- Hillman: [Archetypal psychology, Wikipedia](https://en.wikipedia.org/wiki/Archetypal_psychology) (politeísmo psíquico, arquétipo fenomênico, *Re-Visioning Psychology* 1975, a "semente" de *The Soul's Code*)
- Crítica científica às tipologias (por que rótulo é ficção de superfície): ver [`psicologia-pos-junguiana.md`](./psicologia-pos-junguiana.md) §3 e fontes lá listadas
