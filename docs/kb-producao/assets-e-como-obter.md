# Assets e como obtê-los — arte, som e tipografia sob a regra procedural

> Como produzir (ou adquirir) arte 3D, imagem 2D, som e tipografia para MORTEM.
> Verificado na web em julho/2026 contra páginas oficiais de licença e preço.
> **Regra vigente:** camada 3D 100% procedural (proibido GLTF, textura externa, asset
> importado); fontes OFL; sons WAV sintetizados. Tudo o que exigiria alterar a regra
> está marcado com **[DECISÃO DO USUÁRIO]**.

A pergunta soberana da produção solo por agentes: **o asset pode ser descrito em
código?** Se sim, cabe na regra — versionável, revisável em diff, regenerável por
seed. Se não, entra como binário e a pergunta vira jurídica: quem fez, sob que licença.

---

## 1. Arte 3D dentro da regra — o que o código faz bem

Técnicas comprovadas em three.js **sem nenhuma textura**, todas geráveis por agente:

- **Flat shading + vertex colors** (`flatShading: true`, `vertexColors: true`): o
  low-poly facetado clássico; a paleta vive no código, não num PNG. **Gradientes por
  vértice** (cor interpolada no eixo Y) substituem textura de ambiente inteira.
- **Iluminação como material:** ambiente fraca (~0,3) + direcional lateral (~0,7)
  fazem as facetas "estalarem" — em low-poly, a luz é metade da arte.
- **Ruído determinístico na geometria** (noise salgado pela seed, nunca
  `Math.random`) quebra a simetria de terrenos, panos, madeira empenada.
- **Silhueta antes de detalhe:** um castiçal são 3 cilindros e 1 cone bem
  proporcionados, não 200 polígonos. **Toon barato:** `MeshToonMaterial` com
  `gradientMap` de 3–4 tons gerado em canvas dá cel-shading sem asset (ver §2).

Limite honesto: rostos, mãos e drapeado ficam ruins em procedural por agente — o
jogo já contorna (aparência de personagem é camada narrativa, em texto).

## 2. Padrões 2D gerados em canvas/SVG — a zona cinzenta da regra

Papel envelhecido, marmorizado e linhas de gravura são geráveis por código: Perlin/
FBM para fibra e manchas via `getImageData`, hachura em SVG simulando buril.

**Ponto de interpretação:** um `CanvasTexture` gerado em runtime pela seed não é
"textura externa" — não há arquivo importado; é determinístico e versionado como
código. Mas a regra escrita não distingue origem. Formalizar a leitura *gerada por
código = permitida; arquivo = proibida* é **[DECISÃO DO USUÁRIO]** (só de redação).

## 3. Som e música por síntese — dentro da regra

- **SFX:** jsfxr (porta JS do sfxr) gera efeitos por parâmetros serializáveis em JSON
  — o "asset" vira 20 números em git. Bom para cliques, papéis, sinos; foley realista
  é o limite duro: soa sintético mesmo com esforço.
- **Web Audio puro:** o caminho atual (WAV por script) escala para dezenas de sons
  curtos; ruído filtrado + envelopes cobrem vento, fogo, chuva.
- **Música:** Tone.js (MIT) dá transport, sintetizadores e loops; com Tonal.js,
  música processual em escala fixa. Alcançável: ambiência esparsa, drones, "caixa de
  música", sino — convincente para atmosfera; **não** alcança piano de salão crível.

## 4. Tipografia e imagem de época com licença livre

Fontes OFL podem ser embutidas e vendidas com o jogo (vedado revender a fonte em si).
As coleções de imagem abaixo são de **domínio público** (DP): uso comercial livre.

| Fonte | Tipo | Licença | Custo | Regra |
|---|---|---|---|---|
| Google Fonts: IM Fell (atual), EB Garamond, Cormorant, Playfair Display, Special Elite (datilografia), UnifrakturMaguntia (gótica), Rye/Smokum (madeira vitoriana) | fontes | OFL | 0 | dentro |
| British Library no Flickr (~1 M imagens de livros séc. XVII–XIX) | gravuras 2D | DP ("no known copyright restrictions") | 0 | ver nota |
| Old Book Illustrations | gravuras restauradas | DP (aviso: "conforme sua lei local") | 0 | idem |
| NYPL Digital Collections (filtro "public domain") | gravuras, mapas | DP, "no permission required" | 0 | idem |
| Biodiversity Heritage Library | gravuras naturalistas | DP/CC0 na maioria | 0 | idem |
| Rawpixel (seção Public Domain) | scans tratados | CC0 (conta grátis) | 0 | idem |

**Nota-chave:** gravura DP como *referência* para o agente modelar já é permitida.
Como *asset 2D de UI* (vinheta, ornamento) não toca o 3D, mas quebra o espírito "tudo
gerado" — **[DECISÃO DO USUÁRIO]**, juridicamente segura; a alternativa dentro da
regra é redesenhá-la como SVG autoral.

## 5. Mercados de assets prontos **[DECISÃO DO USUÁRIO]**

| Fonte | Tipo | Licença | Custo típico | Regra |
|---|---|---|---|---|
| Kenney.nl (30 000+ assets: kits 3D, UI, áudio) | 2D/3D/som | **CC0** | 0 (doação opcional) | fora |
| Quaternius (1 400+ modelos low-poly) | 3D | **CC0** ("sem atribuição, comercial ok") | 0 | fora |
| Poly Pizza (agregador; ex-Google Poly) | 3D | CC0 **ou** CC-BY — conferir por modelo | 0 | fora |
| OpenGameArt.org | tudo | CC0/CC-BY/CC-BY-SA/OGA-BY/GPL — todas admitem comercial, mas BY-SA e GPL contaminam (§6) | 0 | fora |
| itch.io (asset packs) | 2D/3D/som | licença de cada autor — ler página a página | US$ 0–20/pack; há "Victorian/steampunk" a ~US$ 4 | fora |
| Unity Asset Store | 3D/som | EULA: uso **permitido fora da Unity** (three.js incluso); vedada redistribuição extraível; evitar itens "restricted" | US$ 5–60 | fora |
| Fab (Epic; absorveu Sketchfab/Quixel) | 3D | Standard License: **qualquer engine**; tier Personal grátis sob teto de receita | 0–US$ 50 | fora |

Tema vitoriano dedicado é raro nos acervos CC0 (Kenney/Quaternius são genéricos); a
busca real é "furniture/interior/medieval" + troca de paleta, ou itch.io pago.

## 6. Licenças explicadas para um advogado

- **CC0** — renúncia (waiver) máxima: uso, alteração e revenda livres, sem atribuição.
  Risco residual: não cobre direitos de terceiros embutidos nem garante que o
  depositante era o titular.
- **CC-BY 4.0** — condicionada a atribuição (nome, fonte, menção de alterações — tela
  de créditos basta). Descumprir resolve a licença; a 4.0 dá 30 dias de cura.
- **CC-BY-SA / GPL** — virais: o derivado herda os termos. Evitar para arte em jogo
  fechado. **CC-BY-NC** — proibida em jogo vendido; "não comercial" afere-se pelo uso.
- **OFL** — embutir e vender com o software é expresso; vender a fonte isolada, não.
- **EULAs de marketplace (Unity/Fab)** — não são CC: direito de *incorporar*, nunca
  de redistribuir em forma extraível; termos alteráveis unilateralmente.
- **Armadilhas:** (a) "royalty-free" ≠ grátis nem DP — só "sem pagamento por cópia";
  cada site define o resto. (b) **Asset gerado por IA:** para o US Copyright Office
  (jan/2025), output sem autoria humana suficiente **não tem copyright** — o vendedor
  pode não ter o que licenciar e a cadeia de treino pode carregar infração. (c) DP é
  territorial — para obra de 1893, risco prático nulo.

## 7. Comissionar artistas **[DECISÃO DO USUÁRIO]**

- **Onde:** itch.io (fóruns de freelance; barato, informal), ArtStation (portfólio
  verificável, faixa mais alta), Fiverr (rápido; qualidade e direitos variáveis).
- **Preços verificados (2025/26):** modelo low-poly simples US$ 20–100 (Fiverr);
  personagem low-poly US$ 50–500; ilustração/ícone US$ 30–150 por peça; estúdios
  US$ 25–60/h. Um cenário de MORTEM (20–30 props): US$ 400–1500.
- **Brief que funciona:** 1 referência de estilo + polycount alvo + lista fechada de
  itens + formato (GLTF) + **cessão de direitos patrimoniais por escrito** +
  proibição de ferramenta generativa.

## 8. Áudio pronto **[DECISÃO DO USUÁRIO]**

- **Freesound.org:** licença por som — CC0 (livre), CC-BY (creditar) ou CC-BY-NC
  (**inutilizável** em jogo vendido); filtrar antes de baixar. Foley vitoriano
  (relógio, porta, lareira) existe em CC0. Outras bibliotecas: Kenney (packs de
  áudio CC0), Sonniss GDC bundles (royalty-free próprio, comercial ok).
- **Música de época — a distinção jurídica central:** valsa de 1880 tem a
  **composição** em DP, mas cada **gravação** tem direito conexo próprio (nos EUA:
  fonogramas até 1922 em DP desde 2022; 1923–1946 entram em DP em 2024–2047). Um MP3
  de valsa DP achado na web pode infringir o direito do intérprete/gravadora. Seguro:
  gravações declaradamente CC0/DP (Musopen — conferir item a item; o site não garante)
  ou **sintetizar a partitura DP** (IMSLP) via Tone.js — de volta a DENTRO da regra.

## Implicações para o jogo

**Caminho recomendado dentro da regra (custo zero, nada a decidir):** flat shading +
vertex colors + gradientes e noise determinístico no 3D; silhueta antes de polígono;
SFX por síntese Web Audio (jsfxr como gerador de parâmetros); ambiência esparsa em
Tone.js a partir de partitura DP; ampliar o cardápio OFL (EB Garamond, Special Elite,
UnifrakturMaguntia pontual); gravuras DP só como **referência** de modelagem/paleta.

**Cardápio [DECISÃO DO USUÁRIO], em ordem crescente de ruptura:**
1. Registrar a interpretação "textura gerada em canvas pela seed = permitida" (§2).
2. Admitir gravuras/ornamentos DP como assets 2D de UI (§4) — juridicamente limpo.
3. Admitir GLTF de acervo **CC0 apenas** (Kenney/Quaternius) na camada 3D (§5).
4. Comprar packs (itch.io/Fab/Unity — licenças valem fora das engines) (§5).
5. Comissionar artista com cessão de direitos e cláusula anti-IA (§7).
6. Áudio pronto CC0/CC-BY do Freesound e gravações DP verificadas (§8).

Transversal: nunca CC-BY-NC nem CC-BY-SA/GPL para arte em jogo fechado; desconfiar
de "royalty-free" vago e de origem IA sem cadeia documentada.

## Fontes consultadas

- three.js docs, "Material.flatShading" — https://threejs.org/docs/#api/en/materials/Material.flatShading · J. Marinacci, "Low Poly style Terrain Generation", Medium (2018) — https://medium.com/@joshmarinacci/low-poly-style-terrain-generation-8a017ab02e7b
- chr15m, jsfxr — https://sfxr.me/ · Tone.js — https://tonejs.github.io/ · Clockwork Chilli, "Procedural Textures in JavaScript" — https://clockworkchilli.com/blog/6_procedural_textures_in_javascript
- British Library Digital Scholarship Blog, "Curious about using 'public domain' British Library Flickr images?" (2024) — https://blogs.bl.uk/digital-scholarship/2024/04/curious-about-using-public-domain-british-library-flickr-images.html
- Old Book Illustrations — https://www.oldbookillustrations.com/ · NYPL, "Public Domain Collections" — https://www.nypl.org/research/resources/public-domain-collections
- Kenney, Support — https://kenney.nl/support · Quaternius, FAQ — https://quaternius.com/faq.html · Poly Pizza — https://poly.pizza/ · OpenGameArt, FAQ — https://opengameart.org/content/faq
- Unity Support, "Can I use assets from the Asset Store with other engines?" — https://support.unity.com/hc/en-us/articles/34387186019988 · Epic, "Licenses and Pricing in Fab" — https://dev.epicgames.com/documentation/fab/licenses-and-pricing-in-fab
- Freesound, FAQ — https://freesound.org/help/faq/ · IMSLP, "Public domain" — https://imslp.org/wiki/public_domain · Musopen, FAQ — https://musopen.org/faq/
- U.S. Copyright Office, "Copyright and AI", Parte 2: Copyrightability (2025) — https://copyright.gov/ai/ · SIL, OFL-FAQ — https://openfontlicense.org/ofl-faq/
- RocketBrush, "Game Art Outsourcing Prices 2025" — https://rocketbrush.com/blog/game-art-outsourcing-prices-complete-2025-pricing-breakdown · Fiverr, "How Much Does a 3D Artist Cost?" — https://www.fiverr.com/resources/guides/costs/3d-artist
- itch.io, assets "3D + Victorian" — https://itch.io/game-assets/free/tag-3d/tag-victorian
