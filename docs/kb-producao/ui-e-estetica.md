# UI e estética — o design gráfico da década de 1890 e a interface diegética

> O design gráfico real da Inglaterra de 1893 (tipografia, ephemera, formulários) como
> vocabulário de interface, e o que o gênero de investigação já resolveu em UI diegética,
> painéis de dedução, legibilidade, paleta escura e som. Fontes: arquivos de ephemera,
> análises de UI de jogos e diretrizes de acessibilidade (lista ao final).

---

## 1. A tipografia que 1893 realmente usava

- **Texto corrido (livro/jornal):** old styles da linhagem **Caslon** — o catálogo da
  fundição H. W. Caslon & Co. dos anos 1890 ainda vendia o Caslon Old Face original.
  Jornal de vila: corpo miúdo, colunas estreitas, filetes e fios duplos entre seções.
- **Display (cartaz, playbill, anúncio):** **wood type** — tipos de madeira, baratos em
  corpos grandes; condensados extremos (gênero "Playbill"), egípcias e grotescas
  misturados, trocando de face a cada linha — o caos organizado é a assinatura da época.
  O impressor rural (*jobbing printer*) fazia bilhetes de leilão, faturas com cabeçalho
  gravado (*billheads*) e avisos de paróquia — o registro visual de Briarstone.
- **O que a IM Fell evoca:** os Fell Types são de ~1670–86 (legado do bispo John Fell à
  Oxford University Press) — **dois séculos ANTES de 1893**: impressão antiga, tinta
  irregular, erudição de arquivo. Como "voz de documento venerável" funciona; um impresso
  novo de 1893 (telegrama, jornal do dia) seria mais verossímil em Caslon/egípcia/grotesca.
- **Hierarquia sem negrito moderno:** o impressor vitoriano hierarquizava por corpo,
  CAIXA-ALTA, espacejamento e filetes — raramente por peso; o token `text-rotulo` já
  reproduz esse gesto.

## 2. Catálogo de ephemera vitoriana como widgets diegéticos

| Peça de época | Uso possível como UI | Exemplo em jogo |
|---|---|---|
| **Telegrama (Post Office Form A1)** — impresso com mensagem à mão; 6d por 12 palavras (tarifa de 1885); "NOTICE TO THE SENDER" no verso | Mensagem urgente de fora da vila; notificação lacônica | Comunicados oficiais de Papers, Please |
| **Papel de luto** — tarja preta na carta/envelope; largura proporcional à proximidade do morto e ao tempo decorrido | Correspondência da família da vítima; marcador de luto | — (pouco explorado; oportunidade) |
| **Carte de visite** (~6,4×10,5 cm, retrato colado em cartão com nome do estúdio) | Ficha compacta de suspeito: retrato + nome + ocupação | Índice de personagens de Pentiment |
| **Trade card / billhead** — cabeçalho gravado do comerciante, fatura à mão | Identidade visual de cada estabelecimento; recibo como pista | Documentos de Shadows of Doubt |
| **Rótulo de botica / frasco de veneno** — "POISON — NOT TO BE TAKEN", vidro azul-cobalto, nervuras táteis | Evidência toxicológica; codificar por forma além de cor é acessibilidade de 1890 | — |
| **Formulário de inquérito do coroner** — impresso com lacunas, juramento, veredicto do júri | O ato final como formulário oficial preenchido pelo jogador | O caderno de lacunas do Obra Dinn |
| **Jornal de vila** — colunas, avisos pagos, o inquest noticiado | Epílogo como notícia impressa; plantio de boato | Recorte de jornal no Obra Dinn |
| **Etiqueta de espécime amarrada com barbante** | Rótulo pendurado em evidência física — o "tag" literal | — |
| **Selos, carimbos, heráldica** — carimbo datador postal, brasão, chancela, lacre de cera | Estados e confirmações: "REGISTRADO", data de viagem, selar | O carimbo é o verbo central de Papers, Please |

## 3. UI diegética — princípios e limites

- **Definição:** o elemento diegético existe DENTRO da ficção — o personagem também o
  vê e manuseia. MORTEM já nasce diegético ("tudo é mesa, tudo é carta").
- **Bem resolvidos no gênero:** *Obra Dinn* — o caderno é objeto do mundo (tripulação,
  esboços, mapa, lacunas; valida só em lotes de 3 — feedback sem guia). *Pentiment* —
  mapa, diário e glossário como manuscrito; o glossário abre sobre a cena sem tirar o
  jogador dela (a filosofia dos overlays de MORTEM). *Her Story* — a interface É um
  terminal policial noventista; a fricção da busca por palavra-chave É o jogo.
  *Papers, Please* — carimbar como verbo mecânico.
- **Quando o diegético vira fricção** (trade-off autenticidade × usabilidade): mapa
  "bonito de época" sem hierarquia de leitura; texto pequeno e de baixo contraste; o
  objeto que obstrui o que importa; consulta que custa mais gestos que um menu. Fricção
  intencional (Her Story) só se paga em significado; quebrar a legibilidade é a falha
  mais citada da UI diegética.

## 4. Como o gênero resolve os painéis clássicos

- **Caderno de pistas:** padrão Obra Dinn — registro automático e neutro, por entidade
  (pessoa/lugar), nunca por "importância". A Caderneta de MORTEM segue o princípio.
- **Mural de cordas:** o trope "String Theory" é invenção de direção de arte de
  Hollywood — icônico, não funcional por si. *Bom:* o jogador constrói as ligações e
  elas têm semântica mecânica; Shadows of Doubt dá três canais à corda (cor
  branco→vermelho = incriminação; espessura = confiabilidade; animação = fluxo).
  *Ruim:* mural que o jogo preenche sozinho (cutscene) ou que aceita qualquer ligação
  sem consequência (enfeite). O de MORTEM está no campo bom: a ligação tem semântica.
- **Linha do tempo:** o gênero a faz emergir das anotações do jogador; entregá-la
  preenchida é concluir por ele. **Mapa:** Pentiment usa mapa-ilustração com rótulos
  escritos; a função mora no clique do rótulo, não na precisão cartográfica.
- **Fichas de suspeito:** o formato de época natural é a carte de visite — retrato,
  nome, ocupação; identificação, nunca julgamento. O Painel de Álibis ("estritamente
  neutro") é a versão correta do padrão: organizar sem concluir.
- **Padrão anti-carga-cognitiva:** agrupar por entidade estável; reencontrar tudo em ≤2
  gestos; jamais ranquear por relevância — ranquear é deduzir pelo jogador.

## 5. Legibilidade e acessibilidade com estética de época

- **Contraste (WCAG 2.x):** 4,5:1 para texto normal; 3:1 para ≥24 px (ou ≥18,7 px
  bold). Tinta `#2b2119` sobre pergaminho `#e7ddc8` passa com folga; os candidatos a
  falha são `tinta-apagada` e stones médios sobre couro escuro.
- **Serifada de época em tela:** IM Fell tem olho pequeno e contorno irregular — em
  corpo pequeno vira textura. O padrão Pentiment: face histórica para VOZ (títulos,
  nomes), face regular para VOLUME (leitura), e opção "easy read" sem quebrar a ficção.
- **Toque (mobile):** alvo mínimo 24×24 px (WCAG 2.5.8 AA), ideal 44×44 px. O ponto
  crítico são os termos clicáveis inline em prosa densa.
- **Daltonismo (barbantes!):** regra nº 1 dos Game Accessibility Guidelines — nenhuma
  informação essencial por cor fixa isolada. Cor de barbante com semântica pede código
  dobrado: textura (contínua/tracejada/torcida), espessura, etiqueta no pino — o frasco
  de veneno já codificava por cor E forma E textura tátil. Teste: simulador COBLIS.

## 6. Paleta e luz — escuro à vela sem ilegibilidade

- **Darkest Dungeon (Bourassa):** nada de cinza morto ou preto puro fora das linhas de
  tinta; paleta terrosa sempre aquecida (até os frios são amarelados); o traço preto
  grosso (xilogravura/Mignola) permite cor sem perder leitura — o contorno carrega a
  forma, a cor carrega o clima.
- **Obra Dinn (Pope):** legibilidade acima do estilo — tudo tem contorno (preto sobre
  branco e vice-versa); o dithering foi reescrito para acompanhar a câmera (evitar
  cintilação) e a resolução subiu quando a tela cheia cansava. Lição: quando a estética
  briga com o conforto de leitura, a estética cede.
- **Padrão comum (incl. Pentiment):** o escuro é atmosfera, nunca superfície de leitura;
  o quente (vela) marca foco. Cena escura, documento claro — o contrato de MORTEM.

## 7. Som de UI de época

- **Vocabulário do gênero:** papel (extrair), pena (escrever), carimbo/lacre (confirmar),
  sino (transição), passos/porta (viagem), tique-taque (tempo). Os cinco sons de MORTEM
  já cobrem os verbos atuais.
- **Skeuomórfico × abstrato:** som skeuomórfico (o objeto real da ação) é reconhecido de
  imediato e reforça a diegese — a escolha certa para interface-objeto; foley dá
  organicidade, síntese dá controle e peso mínimo (o caminho atual). Prática da área
  (Audiokinetic): o som confirma o GESTO, não decora; um som por verbo, curto, com
  variação sutil contra a fadiga; o solene soa mais pesado que o custo zero.

## Implicações para o jogo

Cardápio — nada aqui é decisão; itens independentes para o criador escolher ou ignorar.

**Legibilidade (compatível com a estética atual):**
- Auditar contraste dos textos sobre `painel-couro` (candidatos: `tinta-apagada`, stones médios).
- IM Fell só em títulos/nomes e nunca abaixo de ~18 px; se houver queixa, o precedente
  Pentiment é uma opção "leitura fácil" diegeticamente aceitável.
- Padding de toque nos `.termo-clicavel` até 24–44 px de alvo efetivo, sem mudar o visual.
- Barbantes com cor semântica: dobrar o código (textura/espessura/etiqueta); testar no COBLIS.

**Widgets diegéticos possíveis (catálogo, não plano):** telegrama Form A1 para
mensagens urgentes de fora da vila; papel de luto (tarja preta) na correspondência da
família da vítima; ficha de suspeito em formato carte de visite (retrato SVG existente
+ nome + ocupação); o ato final emoldurado como formulário de inquérito do coroner;
epílogo/retrato da investigação diagramado como jornal de vila; etiqueta de espécime
amarrada como rótulo de evidência física; carimbo datador no log de viagem.

**Tipografia:** hierarquizar como o impressor de 1893 (corpo, caixa-alta, espacejamento,
filetes) onde hoje se usa negrito puro; para um impresso "novo de 1893" (jornal, cartaz),
uma condensada tipo Playbill ou egípcia distinguiria o impresso do dia da voz antiga da
IM Fell.

**Som:** candidatos se surgirem verbos novos: carimbo (registro), tique-taque discreto
(viajar), porta/passos (chegada).

## Fontes consultadas

- Bodleian Libraries — *A Nation of Shopkeepers: Trade Ephemera* (John Johnson Collection). https://bodleian.ox.ac.uk/johnson/online-exhibitions/a-nation-of-shopkeepers/the-ephemera-of-trade
- Telegraph Stamps of Great Britain — *The Post Office Telegraph stationery* (Form A1, tarifas). http://telstamps.org.uk/Telegraphs/PO_Stat.html
- Wikipedia — *Mourning stationery*. https://en.wikipedia.org/wiki/Mourning_stationery
- Care Typography — *Historical Literary Fonts: The Fell Fonts*. https://www.caretypography.com/historical-literary-fonts-the-fell-fonts
- James Mosley (Typefoundry) — *Recasting Caslon Old Face*, 2009. http://typefoundry.blogspot.com/2009/01/recasting-caslon-old-face.html
- Eye Magazine — *Play and playbill*. https://eyemagazine.com/feature/article/play-and-playbill
- APHA — *Archiving as a Tool for Rural Jobbing Printers in Late 1800s Great Britain*. https://printinghistory.org/archiving-as-a-tool/
- Lettermatic — *Pentiment* (case study das fontes; 2.700+ glifos, opção acessível), 2022. https://lettermatic.com/custom/pentiment
- PC Gamer — *Lucas Pope on the challenge of creating Obra Dinn's 1-bit aesthetic*, 2018. https://www.pcgamer.com/lucas-pope-on-the-challenge-of-creating-obra-dinns-1-bit-aesthetic/
- Point'n Think — *The Art of Darkest Dungeon* (entrevistas com Chris Bourassa). https://www.pointnthink.fr/en/the-art-of-darkest-dungeon/
- BFI — *Her Story: 10 years of playing desktop detective*, 2025. https://www.bfi.org.uk/features/her-story-10-years
- ColePowered Games — *Shadows of Doubt DevBlog 4: Case Folders & Cork Boards*. https://colepowered.com/shadows-of-doubt-devblog-4-case-folders-cork-boards/
- TV Tropes — *String Theory*. https://tvtropes.org/pmwiki/pmwiki.php/Main/StringTheory
- IndieKlem — *The Diegetic Dilemma* (benefícios e fricções da UI diegética). https://indieklem.substack.com/p/19-the-diegetic-dilemma-benefits
- W3C — *Understanding SC 1.4.3: Contrast (Minimum)*, WCAG 2.2. https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Game Accessibility Guidelines — *No essential information by a fixed colour alone*. https://gameaccessibilityguidelines.com/ensure-no-essential-information-is-conveyed-by-a-fixed-colour-alone/
- Audiokinetic — *Approaching UI Audio from a UI Design Perspective, Part 2*. https://blog.audiokinetic.com/approaching-ui-audio-ui-design-perspective-2/
