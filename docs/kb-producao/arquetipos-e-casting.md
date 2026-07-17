# Arquétipos junguianos como ferramenta de casting (build time)

> Consulta de planejamento (não rege prosa). Ferramenta de **construção** de personagem, meta,
> fora da diegese — insumo do gerador em build time, na mesma casta cega de FOR/INT/WIS/CHA e
> das aparências: computa-se, extrai-se dele consequências, e **descarta-se o rótulo** antes
> do pacote de caso. Alinha-se ao [`contrato-papeis-e-gerador.md`](./contrato-papeis-e-gerador.md)
> (a taxonomia de `src/data/papeis.js`) e ao `docs/game-design-simulacao.md` (o gerador por
> simulação).

---

## 0. Aviso de anacronismo — leia primeiro (inviolável)

Os arquétipos junguianos são **teoria do século XX**. Jung viveu de 1875 a 1961; cunhou o uso
psicológico de *archetype* em 1919; o vocabulário (persona, anima) se fixa em *Psychological
Types* (1921). Os "12 arquétipos" da tradição popular são ainda mais tardios (Pearson, 1991;
Mark & Pearson, 2001).

**Consequência dura para MORTEM (Inglaterra, 1893):**

- Nenhum personagem, narrador ou carta pode **conhecer, nomear ou raciocinar em termos de**
  arquétipo, "sombra", "persona junguiana", "inconsciente coletivo", "complexo" ou "self". Em
  1893 esse vocabulário **não existe**. Um detetive vitoriano fala em caráter, temperamento,
  humores, índole, natureza, vícios, paixões — não em arquétipos.
- O arquétipo é **andaime de obra**: usado por você e pelo gerador em build time para dar
  coerência psicológica ao elenco. Erguida a parede, o andaime é retirado; o jogador nunca o
  vê, e a prosa nunca o cita.
- Isto é exatamente análogo às regras já vigentes: atributos e aparências "vivem apenas no
  gerador; o motor é cego a eles". O arquétipo entra na **mesma casta** — insumo de build time
  que produz consequências (vestígios, flags de comportamento de diálogo, mentiras
  pré-computadas), nunca um dado que o runtime leia ou que a diegese nomeie.

> **Guarda:** se a palavra "arquétipo" (ou "sombra", "persona") vazar para `src/data`, prosa,
> glossário ou UI, é bug de vazamento de andaime. O rótulo só pode existir em documentação de
> design e em nomes internos do gerador (build time). Candidato natural a lint futuro no
> `qa.mjs`, como a guarda de aparências.

## 1. O que é Jung "puro" (o motor, não os rótulos)

O valor da ferramenta vem de entender o **motor psicológico**, não de decorar doze rótulos.

- **Persona** — a máscara social, "um compromisso entre o indivíduo e a sociedade sobre o que
  ele parece ser". Útil e necessária; patológica quando o sujeito se identifica *totalmente*
  com ela. **É o conceito mais diretamente útil para o mistério** (§3).
- **Sombra (shadow)** — tudo o que o ego recusa reconhecer em si e reprime; não "o mal" em
  abstrato, mas o material rejeitado de cada pessoa específica. O que não é trazido à
  consciência tende a ser **projetado no outro** e a **retornar como ato**. **É o gerador de
  móbil** (§2).
- **Anima / animus** — a imagem contrassexual interior, ligada a projeção amorosa e idealização.
  Matéria-prima de móveis passionais e obsessivos.
- **O Self** — o arquétipo da totalidade; para o gerador, menos um "papel de suspeito" e mais um
  **eixo de arco**: quem integrou a própria sombra mente com calma e é difícil de flagrar; quem
  a reprime **vaza** por vestígios (§3).

*(Proveniência, para citar com segurança: termo "archetype" em "Instinct and the Unconscious",
1919; persona/anima em *Psychological Types*, 1921; sombra/self/inconsciente coletivo maduros em
*The Archetypes and the Collective Unconscious*, ensaios de 1934–55, coletados em 1959.)*

## 2. A sombra como motor de móbil (o ouro do gerador)

**Um assassinato plausível é uma virtude levada à sua sombra.** O criminoso raramente age
contra o próprio caráter — age quando a **luz** do seu tipo (o valor que professa) é pressionada
até virar a **sombra** (a distorção que nega). Isso dá móveis que soam **inevitáveis em
retrospecto** — exatamente o que o *fair play* exige (o culpado tinha de ser aquele, dado quem
ele era).

**Fórmula do móbil:** valor professado + pressão/ameaça → sombra ativada → crime que "resolve" a
ameaça mantendo a autoimagem intacta. O último ponto é crucial: o assassino sombrio quase sempre
comete o ato **acreditando-se ainda virtuoso** — e é essa auto-justificação que produz as
**mentiras coerentes** (§3).

Os "12 arquétipos" (Mark & Pearson, 2001) servem de *starter kit* — mas são **elaboração
comercial pós-junguiana**, com listas que divergem entre si; o que importa é o vetor (motivo ×
medo × sombra), não o nome:

| Arquétipo | Sombra ativada | Móbil típico | A "verdade" que conta a si mesmo |
|---|---|---|---|
| Inocente | negação cúmplice | silencia a testemunha que ameaça a fachada de um lar "puro" | "só quis proteger o que era bom" |
| Órfão / Pessoa Comum | ressentimento | vingança contra quem o humilhou; nivelar por baixo | "ele merecia; eu nunca tive a chance dele" |
| Herói / Guerreiro | agressão, orgulho | honra ofendida, eliminar um "inimigo" fabricado | "foi uma luta justa; defendi minha honra" |
| **Cuidador** | mártir controlador | "veneno da misericórdia"; ou elimina quem ameaça tirar-lhe o objeto de cuidado | "foi um ato de amor; livrei-o do sofrimento" |
| Explorador | desapego frio | mata para não ser preso/ancorado; fuga por cima de vidas | "eu não podia ficar" |
| Rebelde / Fora-da-lei | destrutividade | golpe contra quem representa a ordem; sabotagem fatal | "as regras dele é que eram o crime" |
| **Amante** | ciúme, posse | crime passional: o rival, o infiel, o objeto que "não será de outro" | "se não podia ser meu…" |
| Criador | obsessão pela obra | mata quem ameaça arruinar/roubar/expor a criação | "a obra vale mais que uma vida medíocre" |
| Bobo / Jester | crueldade leviana | "brincadeira" que mata; negligência dolosa | "não era pra tanto; foi um acidente" |
| **Sábio** | frieza manipuladora | assassinato calculado e limpo; usa terceiros; envenenamento "perfeito" | "foi a solução racional" |
| Mago | charlatanismo, poder oculto | mata para manter uma fraude (falso médium, "cura" fatal); silencia quem ia expô-lo | "opero acima deles" |
| **Governante / Soberano** | tirania | elimina a ameaça ao patrimônio/nome: herdeiro incômodo, sócio, chantagista | "foi para preservar a ordem, a família, o meu mundo" |

A **sombra** gera o móbil; a **luz** (valor professado) gera o **álibi moral** e a **persona
pública** (§3). O mesmo arquétipo produz, de uma só fonte, o motivo *e* a fachada que o esconde
— coerência psicológica de graça.

## 3. Persona × verdade — a máquina de enganar do mistério

O encaixe mais limpo entre Jung e o gênero. Todo suspeito precisa de duas camadas, e o arquétipo
já as dá:

- **Persona (a máscara pública)** = o que a **luz** do arquétipo faz o personagem *parecer* —
  reputação, primeira impressão, testemunho dos vizinhos. O Cuidador *parece* devotado; o
  Governante, o pilar respeitável; o Sábio, o conselheiro desinteressado.
- **Sombra (o segredo)** = o que o mesmo arquétipo, sob pressão, *fez* — o móbil, a mentira, o
  vestígio abafado.

A investigação é o trabalho de **rasgar a persona até a sombra**. E há uma simetria útil: **a
persona forte é a melhor camuflagem da sombra correspondente** — ninguém suspeita do Cuidador
dedicado, e é por isso que o "veneno da misericórdia" funciona. Três alavancas de design:

1. **Falso-óbvio por persona negativa.** Um arquétipo cuja *luz já é antipática* (Rebelde, Órfão
   ressentido, Bobo) atrai suspeita sem ser culpado — o suspeito conveniente. O culpado real é o
   de persona impecável (Cuidador, Governante, Sábio).
2. **Vazamento controlado.** Quem **reprime** a sombra deixa projeções e lapsos — fala mal demais
   do morto, defende demais um álibi, "cuida" com zelo suspeito. Esses são os **vestígios de
   diálogo** que o gerador planta (§4). Quem **integrou** a sombra (raro, reservado ao culpado
   mais difícil) não vaza — mente com calma.
3. **Coerência do interrogatório.** Como a mentira nasce da auto-justificação, ela é **estável e
   internamente lógica**: o suspeito não diz "eu não fiz"; ele **reconta os fatos pela ótica da
   persona**. O jogador tem de achar a **fissura entre a fachada e o vestígio material**, não
   simplesmente "pegar a mentira".

## 4. O mapeamento aos papéis dramáticos e o pipeline determinístico

### 4.1 Arquétipo → papel dramático (afinidades)

Cruzando com os seis papéis de [`contrato-papeis-e-gerador.md`](./contrato-papeis-e-gerador.md)
(`src/data/papeis.js`):

| Papel (`papeis.js`) | Arquétipos/sombras que o alimentam bem | Por quê |
|---|---|---|
| `assassino_encenador` | Sábio (frieza), Governante (tirania), Mago (manipulação), Cuidador (mártir) | personas impecáveis + sombra que **planeja**; a auto-justificação sustenta o teatro |
| `isca_do_apressado` | Rebelde, Órfão ressentido, Bobo, Herói brigão | persona já antipática; "tinha motivo e temperamento", mas não fez |
| `veu` (mente por decoro) | Inocente (negação), Amante (esconde caso), Cuidador (protege alguém) | mente por **vergonha social**, não por culpa — móbil de mentira ≠ móbil de crime |
| `ruido_pista_dupla` | Órfão, Rebelde, Bobo maldoso | a sombra "nivela/ataca"; fornece pistas falsas *cridas verdadeiras* por quem as dá |
| `mentiroso_por_medo` | Órfão (medo de exclusão), Inocente (medo de punição) | o **medo central** do arquétipo é o motor da mentira; coerência direta medo→mentira |
| `fonte` | Sábio (luz), Explorador, Mago (por interesse), Bobo (solta sem querer) | arquétipos ligados a **saber/circular**; informam, cada um com seu viés |

**Princípio de casting:** um caso bem-formado precisa de **contraste de personas**, não de
variedade de rótulos. Regra de ouro: **culpado com persona luminosa, falso-óbvio com persona
turva.** O inverso (culpado antipático, todos os demais angelicais) trivializa o mistério.

### 4.2 Pipeline determinístico (build time)

Respeita as regras invioláveis do repositório: **zero `Math.random`/`Date.now`**; toda variação
vem de `hashString` (`src/logic/hash.js`) **salgada com a seed**. Cada escolha é
`hashString(seed + sal_do_campo) % N`; o produto que entra no pacote são **só as consequências**,
nunca o rótulo.

1. **Sortear a estrutura antes dos personagens.** Decida os papéis necessários (1 encenador, 1
   isca, N véu/ruído/medo, 1–2 fontes). O papel é **função**; o arquétipo é **cor**.
2. **Atribuir arquétipo por papel com pesos de afinidade** (tabela 4.1), não uniforme —
   `hashString(seed+"arq_"+id) % somaDosPesos`. Impede o culpado de cair num arquétipo que não
   sustenta encenação.
3. **Impor o contraste como *constraint*, não sorteio:** se o culpado saiu luminoso, force a
   isca ao pool turvo (rejeite e re-hashe com sal incrementado até satisfazer — determinístico e
   reprodutível, o mesmo padrão da reamostragem por rejeição do resolvedor de crime).
4. **Derivar (motivo, medo, sombra)** por *lookup* na tabela §2 — não é sorteio. O móbil vem da
   sombra (culpado) ou do medo (mentiroso por medo).
5. **Instanciar em particulares históricos de 1893** (o passo anti-mad-libs, §5): profissão,
   classe, relação com o morto e o objeto concreto da ameaça, de um pool curado por época e
   ancorado em [`../kb-mundo-vitoriano/`](../kb-mundo-vitoriano/).
6. **Compilar só as consequências** para o pacote: vestígios materiais coerentes com o móbil;
   **flags de comportamento de diálogo** (ex.: `defende_demais_o_morto`, `omite_por_decoro`,
   `mente_sob_pressao`) que o motor de diálogo lê **sem saber** que vieram de um arquétipo; e os
   gatilhos de interferência pré-computados (Regras de Justiça R1–R6 do
   `game-design-simulacao.md`).
7. **Descartar o andaime.** O rótulo "Cuidador/sombra mártir" não entra em `src/data`,
   `tagsOcultas`, prosa nem UI — fica no log do gerador (build time) e nesta documentação.

## 5. Crítica honesta — arquétipo é esqueleto, 1893 é a carne

Onde os arquétipos falham, e por que não podem ser a única fonte:

- **Estereótipo e redução.** A grade de 12 comprime a variação humana em caixas; crua, produz
  clichê ("a enfermeira devotada é a assassina" já é gasto). O arquétipo é **hipótese de
  partida**, não retrato.
- **Proveniência frágil.** Os 12 são ferramenta de marketing (Mark & Pearson, 2001), com listas
  divergentes; heurística, não taxonomia científica. Tratá-los como "verdade da psique" é erro
  de categoria.
- **Universalismo cego à época.** A grade é a-histórica; categorias como "Explorador/liberdade"
  ou "Rebelde/autenticidade" carregam valores do século XX que soam falsos em 1893, quando dever,
  honra, reputação e classe pesam de outro modo.

Como corrigir — cruzar o arquétipo com a verdade histórica de 1893:

- **Trocar "motivo universal" por "pressão de época".** O medo do Governante não é abstrato: é
  **deserdação, escândalo, falência, um nome sujo** (ver
  [`../kb-mundo-vitoriano/economia-e-estrutura-social.md`](../kb-mundo-vitoriano/economia-e-estrutura-social.md)).
  O ciúme do Amante opera dentro do **divórcio quase impossível e do adultério como ruína**
  (ver [`../kb-psique-e-crime/sexologia-e-perversoes.md`](../kb-psique-e-crime/sexologia-e-perversoes.md)).
  A misericórdia do Cuidador se ancora na **medicina real da época** (ver
  [`../kb-medicina-legal/`](../kb-medicina-legal/)). Isso dá **necessidade histórica** ao crime.
- **Deixar classe e gênero moldarem a sombra.** A mesma sombra "controle" é tirania doméstica
  respaldada por lei num patriarca e é **impotência amarga** numa esposa sem propriedade própria
  — móveis diferentes da mesma sombra, conforme a posição social. Isso mata o mad-libs.
- **Ancorar todo móbil num vestígio periciável.** A sombra dá o **porquê**; a KB forense dá o
  **como** e o **rastro**. Sem isso, o arquétipo é psicologia sem crime.
- **Contradição interna plantada.** Sorteie 1 traço dissonante por pessoa (o Governante tirano
  terno com um só neto) — a dissonância gera prosa não-robótica e ótimas pistas (o desvio revela
  o que ele protege).
- **A voz vem depois.** O gerador entrega o esqueleto mecânico; a carne narrativa é escrita e
  revisada pelo fluxo `redigir-prosa` + `revisar-prosa`. Isso mantém o arquétipo como andaime e
  afasta o texto da fórmula de IA.

**Ordem de autoridade:** o arquétipo é **andaime**; a KB vitoriana e a forense são **parede de
tijolo**. Onde divergirem, prevalece a verdade histórica/forense — e, como manda o `CLAUDE.md`,
"divergência KB × motor é decisão do usuário, não do agente".

## Fontes consultadas

- Jung, *Psychological Types* (CW vol. 6, 1921): [Princeton UP](https://press.princeton.edu/books/paperback/9780691018133/collected-works-of-c-g-jung-volume-6); *The Archetypes and the Collective Unconscious* (CW vol. 9.1): [Princeton UP](https://press.princeton.edu/books/hardcover/9780691097619/the-collected-works-of-c-g-jung-volume-9-part-1); [IAAP, abstract do vol. 9.1](https://iaap.org/resources/academic-resources/collected-works-abstracts/volume-9-1-archetypes-collective-unconscious/)
- "Instinct and the Unconscious" (1919, 1ª aparição do termo *archetype*): [Wiley, British J. Psychology](https://bpspsychub.onlinelibrary.wiley.com/doi/abs/10.1111/j.2044-8295.1919.tb00003.x); síntese de datas: [Jungian archetypes, Wikipedia](https://en.wikipedia.org/wiki/Jungian_archetypes); [Pacifica, guia de "Persona"](https://pacifica.libguides.com/Jung/persona)
- Os "12 arquétipos" (proveniência pós-junguiana): Mark & Pearson, *The Hero and the Outlaw* (2001): [página da autora](https://carolspearson.com/books-page/the-hero-and-the-outlaw-building-extraordinary-brands-through-the-power-of-archetypes); Pearson, *Awakening the Heroes Within* (1991): [página da autora](https://carolspearson.com/books-page/awakening-the-heroes-within-twelve-archetypes-to-help-us-find-ourselves-and-transform-our-world); [Carol S. Pearson, Wikipedia](https://en.wikipedia.org/wiki/Carol_S._Pearson)
