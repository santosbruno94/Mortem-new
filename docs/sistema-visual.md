# Sistema visual — O Gabinete Ilustrado, edição de imprensa

Registro das escolhas visuais da interface: as cinco vozes tipográficas, a paleta
token a token, a matéria de que cada superfície é feita, o que cada tinta de carimbo
promete ao jogador e as regras que tudo isso obedece.

Vale para a camada de apresentação inteira — telas, painéis, fichas, cartazes,
avisos. Não rege prosa (`docs/guia-de-estilo.md`), nem motor, nem gerador. E não
substitui `docs/nota-gabinete-ilustrado.md`, que rege as duas superfícies ilustradas
do pivô (a Prancha do corpo e a Cena de diálogo); aqui está o vocabulário que aquelas
duas consomem junto com todo o resto.

**Fontes de verdade em código:** `tailwind.config.js` (tokens) e `src/index.css`
(matéria). Este documento explica as escolhas; os valores vivem lá, e divergência
entre os dois se resolve em favor do código.

---

## 1. A tese

O jogo se passa numa mesa de gabinete à luz de vela, e cada coisa que aparece na tela
é uma **coisa** — papel, couro, latão, cera, cortiça, madeira. Nada é "card",
"badge" ou "chip". A pergunta que decide qualquer elemento novo é sempre a mesma: em
1893, que objeto físico faria este trabalho? A resposta dá a forma, o material, a
letra e a cor de uma vez.

Daí duas consequências práticas que atravessam o documento inteiro:

- **A cena é escura, o documento é claro.** O breu da mesa por baixo; tudo o que se
  lê demoradamente pousa em papel claro por cima.
- **Cor nunca informa sozinha.** Toda distinção que o jogador precisa fazer também é
  dita por forma, textura ou palavra — barbante torcido contra pontilhado, etiqueta
  de papel ao lado do fio, carimbo com o nome escrito dentro.

---

## 2. O cardápio tipográfico

Cinco vozes, todas com licença OFL, todas embarcadas em `woff2` sob
`src/assets/fontes/` (zero rede em runtime), declaradas em `src/index.css` com
`font-display: swap` e registradas como tokens em `tailwind.config.js`.

| Token | Face | Arquivo | Ofício | Onde **não** entra |
|---|---|---|---|---|
| `font-prosa` | Libre Caslon Text | `librecaslontext-{regular,italico,bold}.woff2` | TODA leitura longa (corpo ≥ 15px). É a face de texto do jogo e o `font-family` do `body`. | Rótulos, carimbos, títulos |
| `font-serif` | IM Fell English | `imfell-english-{regular,italico}.woff2` | A voz do documento antigo: fala do mestre, cartas, anotações à mão, legendas do atlas, rótulos da planta | Blocos longos de leitura corrida |
| `font-titulo` | Bevan | `bevan-regular.woff2` | Egípcia de manchete: títulos de painel, cabeçalhos, manchete do epílogo | Corpo de texto |
| `font-rotulo` | Oswald (variável 200–700) | `oswald-variable.woff2` | Condensada de balcão: carimbos, tarjas, rótulos, horas, custos, a cópia do telegrama | Qualquer coisa que se leia por mais de uma linha |
| `font-cartaz` | Rye | `rye-regular.woff2` | Wood type — a única licença de display: a tela de título e os carimbos de desfecho | **Tudo o mais.** Dentro do caso a face de display é sempre a Bevan |

A regra do `font-cartaz` é deliberada e estreita: o cartaz é o que se lê da rua; o
resto é papel de gabinete. Wood type dentro do caso quebraria a escala.

Hierarquia se faz por **corpo, caixa e espaço**, não por peso. Daí os dois tokens de
espaçamento: `text-rotulo` (0,625rem / `letter-spacing` 0,2em / `line-height` 1rem —
sempre usado com `uppercase`) e `tracking-firma` (0,18em, para títulos serifados em
caixa-alta).

---

## 3. A paleta

Os nomes de token são os de sempre desde o overhaul "vitoriano premium"; o pivô de
imprensa evoluiu os valores (mais contraste dentro da época) e acrescentou **um único
acento novo**, o verde-garrafa. A paleta é única para 2D e 3D: os materiais do
diorama e da prancha leem estes mesmos valores.

### O escuro (a cena)

| Token | Hex | Papel |
|---|---|---|
| `breu` | `#070604` | O preto mais fundo: fundo de mesa, vinhetas |
| `madeira` | `#161009` | A tábua da escrivaninha |
| `madeira-veio` | `#573f26` | Os veios |
| `madeira-clara` | `#4a351f` | Tábua sob luz |
| `madeira-borda` | `#241a10` | Emenda e fio de borda |
| `couro` | `#1c1512` | A moldura de todos os overlays |
| `couro-borda` | `#3d3020` | O fio do couro |

O `body` assenta em `#0d0b08` — o breu com um grau de calor, para a mesa não parecer
um buraco.

### O claro (o documento)

| Token | Hex | Papel |
|---|---|---|
| `papel` | `#ecdfc3` | A face do pergaminho: cartas de prova, fichas, convites |
| `papel-claro` | `#f4ecd9` | Papel de tiragem recente: verbetes do glossário, carte de visite, convite aceso |
| `papel-dobra` | `#d8c9a8` | A dobra e o vinco |
| `papel-borda` | `#a8946c` | O fio da borda de todo papel e todo filete de latão fino |
| `papel-sombra` | `#292524` | A sombra que o papel projeta |

### A tinta

| Token | Hex | Papel |
|---|---|---|
| `tinta` | `#251b10` | Ferrogálica: o que se escreve sobre papel |
| `tinta-clara` | `#54452f` | Segunda voz sobre papel (fala do mestre, citação) |
| `tinta-apagada` | `#6b5c43` | Terciária: carimbos, rodapés, marginália. **4,81:1 sobre pergaminho** — acima do mínimo WCAG AA de 4,5:1. Este valor é um piso: não descer daqui |

A tinta de leitura da cena escura é `text-cena` = `#d8cfc0` (pergaminho apagado sobre
o breu).

### Os metais e as tintas de acento

| Token | Hex | Papel |
|---|---|---|
| `vela` | `#d97706` | A luz de vela: o acento quente da interface |
| `vela-clara` | `#f2b03d` | O halo vivo, âncora sob o cursor |
| `latao` | `#8a6d3b` | Latão de época: plaquetas, fivelas, tachas |
| `latao-claro` | `#c9a961` | Metal sob luz |
| `latao-ouro` | `#d3b06a` | **O fio vivo**: âncoras, ids, destaques, as âncoras do mural |
| `latao-escuro` | `#54431f` | Metal na sombra |
| `cera` | `#7f1d1d` | Cera de lacre: selos, novidade, confronto |
| `cera-clara` | `#a13b2e` | Cera sob luz |
| `garrafa` | `#2f5243` | **O único acento novo**: tinta verde-garrafa, o conferido |
| `garrafa-clara` | `#7fae91` | A mesma tinta sobre fundo escuro |

### A matéria forense

| Token | Hex | Papel |
|---|---|---|
| `equimose` | `#4c1d43` | Livores e equimoses na Prancha e nos retratos |
| `sangue` | `#7f1d1d` | Sangue |

Os literais `stone`/`amber` do Tailwind sobrevivem como neutros de apoio, com uma
regra rígida: **nenhum texto informativo desce de `stone-400`**. Atmosfera não
desculpa ilegibilidade.

---

## 4. A legenda das tintas de carimbo

Três tintas, três promessas. O jogador aprende a legenda sem rodapé explicativo,
porque cada tinta faz sempre a mesma coisa em todas as telas.

| Tinta | Token | Promete | Onde aparece |
|---|---|---|---|
| **Garrafa** | `garrafa` / `garrafa-clara` | Conferido e registrado — está nos autos, nada a fazer | Carimbo "Registrado na mesa" do aviso de pouso |
| **Cera** | `cera` / `cera-clara` | Confronto e novidade — há algo aqui que pede a sua mão | Carimbo "Confronto"; o pingo de lacre em "novo"; o ponto vermelho na vila; a anotação nova ao mural |
| **Latão** | `latao` / `latao-ouro` | A hora e o custo — o que a mesa cobra e o que ela liga | Custos de viagem, horas, âncoras do mural, tachas, placas |

A consequência mais visível dessa legenda é uma proibição: **cera nunca marca estado
gasto**. A opção de diálogo "· já apresentada" segue recuada, em `stone` itálico, e
não recebe carimbo. Carimbar de vermelho uma opção esgotada ensinaria a cor ao
contrário do que ela promete no jogo inteiro.

---

## 5. Sombra, gesto e relevo

| Token | Uso |
|---|---|
| `shadow-pousado` | Objeto pousado na mesa (carta, etiqueta, aviso) |
| `shadow-erguido` | Objeto erguido da mesa (carta sob o cursor, arrasto) |
| `shadow-vela` | Halo quente discreto em foco ou destaque |
| `shadow-vela-viva` | Halo forte: a chamada principal da tela |
| `shadow-overlay` | O painel elevado dos overlays |
| `shadow-placa` | O relevo da placa de latão (luz em cima, sombra embaixo) |
| `duration-gesto` | 220ms — a duração de **todo** gesto da mesa (hover, surgimento de overlay) |

---

## 6. Catálogo da matéria

Toda a matéria é **procedural**: gradientes, `repeating-linear-gradient`, ruído SVG
inline com `seed` fixo e `box-shadow`. Nenhum arquivo de imagem, nenhum ícone de
biblioteca, nenhuma chamada de rede. Tudo vive em `src/index.css`, **depois** de
`@tailwind utilities` — é o que dá a estas classes precedência sobre utilitárias de
mesma especificidade.

### Superfícies da mesa

| Classe | O que é |
|---|---|
| `.mesa-madeira` | A tábua: veios, emendas, dois halos de castiçal e vinheta funda |
| `.luz-de-vela` | A camada que respira por cima (7s, só opacidade) |
| `.mural-cortica` | A cortiça do mural da acusação |
| `.tacha-latao` | A tacha que espeta papel na cortiça ou na coluna |

### Papel

| Classe | O que é |
|---|---|
| `.carta-papel` | O verso escuro da carta na mesa: fibra e sombra pousada |
| `.carta-pergaminho` | A face clara escrita a tinta: fibra, mancha de guarda nos cantos, fio escuro na borda |
| `.carta-pergaminho--acesa` | O convite que está na mão do perito: folha mais clara, fio cor de vela, halo do castiçal (1g) |
| `.carta-pergaminho--clara` | Papel de tiragem recente, sem mancha de guarda: o verbete impresso (1h) |
| `.ficha-laudo` | A etiqueta de exposição/laudo da Ficha de Coleta |
| `.etiqueta-especime` | A ficha vira etiqueta amarrada: o lado que pende arredonda e abre a goteira do ilhó (1i) |
| `.etiqueta-cordao` | O ilhó de latão e o barbante, num só SVG (1i) |
| `.carte-visite` / `.carte-moldura` | O cartão do fotógrafo: cartão claro, filete de latão por dentro, campo de albumina um tom mais quente (1i) |
| `.telegrama-form` / `.telegrama-cabeca` / `.telegrama-corpo` | O Form A1 do Post Office: papel pardo, timbre sobre filete grosso, mensagem espaçada em letra de balcão (1i) |
| `.pauta-rol` / `.rol-cabeca` / `.rol-linha` | A pauta que o escrivão traça à régua para o rol de declarações (1h) |
| `.aviso-pousada` | O papelucho que cai na mesa |
| `.aviso-mural` | O avesso do anterior: o que ficou pregado no mural, no escuro da cortiça (1i) |

### Impresso

| Classe | O que é |
|---|---|
| `.coluna-jornal` | Coluna justificada de folha de condado |
| `.cabeca-materia` | A cabeça da matéria |
| `.filete-deck` | O filete sob a manchete, entre decks |
| `.abre-coluna` | A capitular de abertura (`::first-letter`) |
| `.divisor-ornado` (+ `--tinta`) | Filete — ornamento — filete. A variante `--tinta` existe porque o latão desaparece sobre papel claro |

### Metal, cera e madeira

| Classe | O que é |
|---|---|
| `.placa-latao` | O material da ação solene (construir a acusação, levar a julgamento) |
| `.botao-mesa` (+ `--quieto`) | Todo botão comum; a variante apagada para ações de menor peso |
| `.selo-cera` | Disco de lacre para acentos e novidades |
| `.selo-lacre` | O lacre prensado de verdade: pingo irregular, relevo de matriz, grão de cera |
| `.carimbo` (+ `--garrafa`, `--cera`) | Os dois tampões do gabinete, batidos tortos como carimbo batido à mão |
| `.painel-couro` | A moldura escura de todos os overlays |
| `.campo-vitoriano` | `select` sem a cara do navegador |

### Letreiro e prosa viva

| Classe | O que é |
|---|---|
| `.titulo-gravado` | Relevo gravado dos títulos |
| `.cartaz-gravado` | O mesmo relevo com sombra mais funda e segundo halo largo — a luz de vela alcançando a parede atrás do cartaz (1g) |
| `.termo-clicavel` / `.termo-extraido` / `.termo-destacado` | Os termos em negrito que extraem carta. **Nomes de classe intocáveis** (contrato do `qa-ui.mjs`) |
| `.opcao-dialogo` (+ `--confronto`, `--voltar`) | As opções da Cena de diálogo |
| `.rotulo-tag` / `.rotulo-papel` / `.rotulo-verbo` / `.rotulo-nome` / `.rotulo-custo` / `.rotulo-novo-marca` | As etiquetas de papel pendentes dos nós — no diorama 3D e na mesa 2D |
| `.planta-*` | A planta do prédio (cômodos, réguas, alvos, rótulos) |
| `.ponto-*` | Os pontos de interesse da localidade |
| `.overlay-surgir` / `.overlay-fundo` | O surgimento do overlay (220ms) |

---

## 7. As duas notações da hora

Regra firmada em 1h, registrada também em comentário em `Caderneta.jsx`. **O suporte
decide a notação:**

- **Documento** → forma por extenso, via `formatRelogio`: *"14 de outubro, 13h10"*.
  Ficha de Coleta, mural, relógio de bolso, monólogo final, tela de personagem.
- **Lista compacta** → forma curta, via `formatHoraComDia`: *"13h10 de 14/out"*.
  As duas listas da Caderneta.

**Dia da semana não se imprime em lugar nenhum.** `src/logic/tempo.js` não o formata e
o `calendario` do pacote não o carrega; inventá-lo erraria em quase todo caso gerado.
Onde a prosa precisa do dia (a feira de sábado), ela o diz por escrito, sem passar pelo
relógio.

---

## 8. Regras que a matéria obedece

1. **Procedural sempre.** Gradiente, ruído SVG com `seed` fixo, `box-shadow`. Sem
   arquivo de imagem, sem ícone de biblioteca, sem rede. Asset 2D externo só entra sob
   o contrato de assets (embarcado, escolhido por `hashString` salgado, invisível ao
   motor, com fallback procedural obrigatório e registro no manifesto sob guarda do
   `qa.mjs`).
2. **O motor é cego a tudo isto.** Nenhuma regra lê classe, emblema, moldura, fundo ou
   carimbo. As bandeiras de apresentação nos dados (como `telegrama: true` no passo de
   abertura do caso-escola) são exatamente isso: sem elas o passo volta a ser prosa
   corrida e o jogo é idêntico.
3. **Determinismo.** `Math.random()` e `Date.now()` seguem proibidos em `src/logic`,
   `src/data` e `src/store`. Nos `seed` dos filtros SVG os números são constantes
   escritas à mão, não sorteio.
4. **Contraste é regra.** Piso de `tinta-apagada` sobre pergaminho (4,81:1) e de
   `stone-400` sobre a cena. Nada informativo abaixo disso.
5. **Cor nunca sozinha.** Toda distinção tem forma ou palavra redundante.
6. **O contrato do `qa-ui.mjs` é intocável.** Textos exatos de botão e rótulo
   (`CONSTRUIR A ACUSAÇÃO`, `fechar ✕`, `Arquivar na mesa`, rótulos de nó), as classes
   `.termo-clicavel`/`.termo-extraido`, o atributo `data-overlay` e a ordem dos dois
   `<select>` do mural. Mexer neles exige atualizar o QA no mesmo commit.
7. **Troca de prosa nunca exige tocar no motor** — e troca de matéria nunca exige
   tocar na prosa. Quando as duas coisas se cruzaram (o epílogo em jornal), a prosa
   passou pelo pipeline `revisar-prosa` antes do commit.

---

## 9. Divergências deliberadas do desenho importado

O desenho de referência trouxe propostas que não entraram, cada uma por um motivo de
dado ou de época. Ficam registradas para que ninguém as reproponha por engano — e para
que o usuário possa derrubar qualquer uma delas.

| Proposta | Decisão | Razão |
|---|---|---|
| Carimbo "Registrado em **sáb** · 13h40" | Fora o dia da semana | O motor não carrega dia da semana e o pacote não o traz. Ver §7 |
| Crédito de fotógrafo no carte de visite ("T. Hollis, Photogr. — High Street, Briarstone") | Fora | Inventa uma pessoa e crava uma vila que é a errada em 31 dos 32 pacotes embarcados (30 gerados + a réplica + o caso-escola) |
| Telegrama com "Origem: Estação de Caulfield" | Fora | Caulfield é onde o telegrama **chega**; Alcott despacha de quatro condados dali |
| Telegrama com "Taxa: 6d. — doze palavras" e "Notice to the sender" | Fora | A mensagem tem o dobro das doze palavras do preço, e o aviso não sustenta nada no jogo |
| Carimbo de cera em "· já apresentada" | Fora | É estado gasto, e a cera promete novidade no jogo inteiro. Ver §4 |
| Rótulos de aviso "Pousou na mesa" / "Anotado ao mural" | Mantidos os existentes | Trocar palavra por palavra é reescrita de prosa sem ganho, e o `data-aviso-pousada` do QA depende do elemento |
| "O MENSAGEIRO DE **BRIARSTONE**" | Virou "DO CONDADO" | Uma vila de 300–800 almas não sustenta jornal (`kb-mundo-vitoriano`) |
| O retrato da investigação como "aviso pago" na folha | Fora da folha, na placa de latão | O jornal não teria como saber as horas e os lugares do perito |
| Data de publicação impressa no epílogo | Virou "Publicado aos sábados, dia de feira" | O circuito visitava o condado semanas depois; nenhuma folha da manhã seguinte noticia julgamento |
| Rótulo de origem "· o próprio / · a própria" no rol de álibis | Fora | Leria a tag oculta `corroborado` e flexionaria um gênero que o pacote não guarda |
| Colofão "conforme Taylor e Casper" no glossário | Fora | `transferencia_vestigios` não tem autor de 1893 e `epitelio_no_coagulo` se atribui a Gross; Casper ancora 5 dos 34 verbetes |

Duas armadilhas de dado que valem para qualquer trabalho futuro nesta camada:

- **Gênero.** O pacote não guarda sexo de personagem; `artigoDe()` só o deduz de um
  título, e os nomes gerados vêm sem título. Todo particípio ou adjetivo flexionado
  pelo nome de uma pessoa sai errado para metade do elenco. A saída é sempre
  construção invariável, nunca um helper de flexão.
- **Vila e calendário.** Nomes de rua, de vila e dias da semana pertencem ao pacote da
  seed. Escrever qualquer um deles na moldura fixa um caso e quebra todos os outros.

---

## 10. Onde cada incremento mexeu

A série foi entregue em nove incrementos jogáveis, cada um com build limpo,
`qa.mjs` e `qa-ui.mjs` verdes.

| | Incremento | Superfície |
|---|---|---|
| 1a | Fundação | `tailwind.config.js`, `src/index.css` — paleta, cardápio tipográfico, matéria |
| 1b | A Escrivaninha | Nós da mesa 2D como etiquetas de pergaminho; pessoas como cartes de visite |
| 1c | A Prancha do corpo | Paleta nomeada; as legendas do atlas na voz do documento |
| 1d | A Cena de diálogo | `FundoCena` como gravura de atlas; fio de tinta no sprite; sombra que pousa |
| 1e | O Mural | Folha do inquérito pregada a duas tachas; barbantes com espécie (textura + etiqueta) |
| 1f | O Epílogo | O Mensageiro do Condado: duas colunas, capitular, margem a lápis |
| 1g | A tela de título | O cartaz da vila em wood type; os quatro chamados como convites selados |
| 1h | Os painéis de consulta | Rol de declarações em pauta de escrivão; glossário em folha de compêndio; hora curta na Caderneta |
| 1i | Fichas e ephemera | Etiqueta de espécime com ilhó e barbante; carte de visite; Form A1; carimbos e avisos |
