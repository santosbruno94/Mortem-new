# Playtest — FASE 4: Maquete e UI (a mesa ganha teatro) · 14/07/2026

Overhaul da apresentação do vertical slice, sem tocar o motor: a maquete da vila
ganha silhueta, luz que segue o relógio e a viagem animada; a interface ganha as
microinterações que faltavam. Camada de apresentação de ponta a ponta — `veredicto.js`
lê exatamente as mesmas `tagsOcultas` de antes, e o QA estático (`qa.mjs`) segue
`CASO VÁLIDO` sem alteração.

## O que mudou

### 4.1 — O diorama (`src/components/diorama/`, `src/data/mapa_espacial.js`)

- **Silhueta.** Os prédios trocaram o telhado piramidal (cone de 4 lados) por
  **telhado de duas águas com beiral** (prisma triangular procedural — `criarTelhado`
  em `Predio.jsx`), com **chaminés** (uma ou mais por prédio), a **marquise** da
  relojoaria e as **pás** do moinho. Tudo primitiva composta; nenhum asset externo.
- **Luz que segue o relógio.** `CICLO_LUZ` + `interpolarLuz(horasJogo)` (dado puro,
  sem `Math.random`/`Date.now`) pintam a maquete: **tarde dourada → crepúsculo → noite
  azulada com lampiões âmbar**. A transição é suave (lerp por frame em `LuzDoDia`),
  e a **névoa baixa de outubro** (fog do three) fecha com a hora. Decisão do usuário:
  ciclo **perceptível e contido** — a noite escurece sem apagar a leitura das etiquetas
  (ver `antes-diorama-noite.png` × `depois-diorama-noite.png`).
- **O pino do perito.** Um **alfinete de cabeça vermelha** (`PinoPerito.jsx`) marca o
  nó atual, fincado à frente do prédio, e **desliza o trajeto na viagem** com o custo
  em horas flutuando junto (`depois-diorama-viagem.png`). O progresso avança por `dt`
  (sem relógio de parede).
- **Beat de viagem.** Decisão do usuário: na maquete 3D, uma viagem com custo real
  ganha um **beat de ~0,7s** — o pino desliza e a luz vira ANTES de o local abrir (a
  mesa só desfoca ao abrir o overlay). Viagem de 0h (andar pela planta) e o modo
  `?flat=1` abrem no ato.
- **Etiquetas.** O `RotuloNo` virou **tag de papel pendente** (amarrada por cordão),
  tinta escura sobre pergaminho — de quebra, o contraste do "viajar · 1h" (antes
  stone-400 sobre escuro, no limite do §3; achado A5/13-07) some: agora é tinta sobre
  papel. O **pulso de "novo"** mudou do emissivo 3D para **CSS na própria tag** (não
  força o frameloop contínuo da maquete).
- **A7 pago.** As posições em `mapa_espacial.js` foram reespaçadas: o aglomerado
  central não atropela mais as etiquetas, e "A Cena" não cobre "O Corpo".
- **Estrada** como traço de tinta (plano fino) no tampo.

### 4.2 — UI geral

- **Barbante com catenária.** O fio do mural pende com barriga (Bézier quadrática) em
  vez de linha reta, mantido o desenho progressivo e a área de clique de remoção
  (`depois-mural-catenaria-selo.png`).
- **Selo carimbando.** Ao concluir uma estação, a ficha selada recebe um **lacre de
  cera que "bate"** ao surgir (`.selo-carimbando`, ver o mesmo screenshot, canto
  direito da Estação I).
- **A pena riscando** na abertura: ao pairar/focar o botão de avançar, um risco de
  tinta se desenha sob o rótulo.
- **Tipografia.** Auditados os títulos de overlay: já padronizados em `font-serif`
  (IM Fell English) + `.titulo-gravado`; o único fora (o termo do Glossário) é tinta
  sobre papel por contexto — mantido.
- **Passe mobile.** Alvos de toque ≥44px no Mural (`@media (pointer: coarse)`,
  escopado a `.mural-cortica` — o QA joga em desktop, sem mudança de layout de teste);
  a planta já garantia 44px.

Tudo cede a `prefers-reduced-motion` (pulso da tag, selo, pena, beat de luz).

## Gates (regra 5)

- `npm run build` — **limpo**.
- `node scripts/qa.mjs` — **CASO VÁLIDO** (os 4 desfechos intactos; motor não tocado).
- `node scripts/qa-ui.mjs` — **UI VÁLIDA** (todas as rotas + a rota `?flat=1`; zero
  erros de console). Contrato atualizado no mesmo commit: os pontos de abertura de nó
  agora esperam o overlay surgir (robusto ao beat de ~0,7s) em vez de tempo fixo, e
  uma checagem nova confere as tags de papel do diorama (`.rotulo-papel`).

## Contrato do `qa-ui.mjs` (o que mudou e por quê)

- Os textos de botão/rótulo (`O Corpo`, `A Cena do Crime`, `Silas Crane`, `· novo`,
  `CONSTRUIR A ACUSAÇÃO`, `fechar ✕`), as classes `.termo-clicavel`/`.termo-extraido`,
  o atributo `data-overlay` e os dois `<select>` do mural — **intocados**.
- Regressão pega e corrigida no mesmo passo: o `· novo` da tag herdava `text-transform:
  uppercase` do verbo e o `innerText` saía "· NOVO"; o `.rotulo-novo-marca` volta a
  caixa baixa (era `normal-case` no design antigo), casando o texto exato do QA.

## `?flat=1`

100% funcional: sem canvas 3D, a grade 2D original joga idêntico (a rota flat do
`qa-ui.mjs` confere planta SVG, viagem pela grade e desbloqueio do Gabinete). O beat,
o pino e a luz são exclusivos da maquete 3D; a grade abre no ato.

## Screenshots

`docs/playtest-fase-4-2026-07-14/`:
- `antes-diorama-dia.png` × `depois-diorama-dia.png` — silhueta, tags de papel, luz.
- `antes-diorama-noite.png` × `depois-diorama-noite.png` — o ciclo dia/noite.
- `depois-diorama-viagem.png` — o pino em trânsito com o custo flutuante (beat).
- `depois-mural-catenaria-selo.png` — a catenária do barbante e o selo carimbando.
