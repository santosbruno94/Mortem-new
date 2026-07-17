# Arquitetura em detalhe fino (1893)

> O grão miúdo do edifício de vila: dimensões reais de cômodos e aberturas, fachadas,
> construção interna, anexos de quintal, tipos de prédio adicionais, a igreja e o adro
> por dentro, o pub por baixo, vidro e ferragem — e como um prédio envelhece. Desce ao
> detalhe onde `arquitetura-e-espacos.md` dá a tipologia; alimenta os grids e as
> silhuetas do gerador (`src/gerador/espaco.js`, `interiores.js`).

## 1. Dimensões reais — a régua do grid

| Elemento | Medida | Nota |
|---|---|---|
| Cômodo de casa operária (*two-up two-down*) | ~13×13 pés (4×4 m); mínimos de 10×10 | pré-regulamentação |
| Testada de terraced operária | 14–16 pés | planta térrea ~24×18 pés |
| Cottage-modelo de reforma (manuais de fazenda) | 5 cômodos: 3 quartos + sala + copa | o real segue sendo "dois embaixo, dois em cima" |
| Pé-direito, classe média | 10–14 pés (térreo mais alto) | sala de status ~13 pés |
| Pé-direito, cottage/operária | ~8 pés ou menos | sob viga de cottage velho: 6–7 pés — homem alto abaixa a cabeça |
| Porta vitoriana | ~6 pés 6 pol × 24–30 pol | cottage antigo: mais baixa, de tábuas |
| Janela habitável (byelaws pós-1875) | área ≥ 1/10 do piso do cômodo | só nas casas novas |

**Casa *byelaw* (pós-1875), a "casa nova" de 1893:** parede de tijolo de 9 pol,
**barreira contra umidade (*damp-proof course*)** obrigatória, quintal com beco de
serviço atrás para coleta noturna de dejetos. Em 1893 a vila mistura estoque velho
sem DPC e meia dúzia de casas novas em regra — a diferença se VÊ na parede (§10).

## 2. Fachada em detalhe

- **Guilhotina (*sash*) — o datador visual imediato:** georgiana 6/6 vidros (limite
  do vidro *crown*) → 1840s–60s 2/2 (imposto do vidro abolido em 1845; janela, em
  1851) → 1870s+ **1/1 com *sash horns*** (chifres de reforço no caixilho). Uma rua
  de vila exibe as três gerações lado a lado — idade e renda de cada casa à primeira
  vista. Contrapesos em caixas laterais, corda e roldana.
- **Cottage:** *casement* (batente) com vidrinhos em chumbo (*leaded lights*) ou
  caixilho de **ferro fundido barato** (Loudon, 1833: "muito adequadas a cottages...
  muito baratas"). No norte, a *Yorkshire sash* (guilhotina horizontal, sem pesos).
- **Postigos internos** dobráveis em caixas do vão = classe média; cortina grossa ou
  nada = cottage.
- **Porta de entrada vitoriana:** quatro almofadas (as de cima às vezes
  envidraçadas), bandeira (*fanlight*), aldrava de latão (a "doctor's knocker"
  discreta é assinatura de médico), **raspador de botas** de ferro junto à soleira
  (barro de outubro: raspador limpo ou sujo é vestígio), placa de carta, *rim lock*
  aparente. **Na vila, casa não tem número: tem nome ou é "a casa do ferreiro".**
- **Alpendres:** madeira com telhadinho no cottage; pórtico de alvenaria no
  presbitério e na casa de classe média.

## 3. Construção interna

- **Pisos:** térreo de cottage = **lajotas sobre cinza compactada, direto no solo**
  (frio, úmido; nos piores, terra batida ainda em 1893); andar de cima = tábua
  corrida sobre vigotas (**range e passos soam através**). Classe média: tábua de
  pinho com tapete central; hall de ladrilho geométrico.
- **Escada de cottage:** embutida entre paredes (*boxed stair*), atrás de porta
  junto à lareira; 3–4 degraus em leque e lance reto ÍNGREME (~50–60°; largura
  24–30 pol) — sobe-se quase de lado; impossível descer em silêncio ou carregar um
  corpo sem tocar as paredes.
- **Paredes:** cottage = caiação ou *distemper* (têmpera — **não se lava: esfregou,
  saiu** — limpeza de mancha deixa mancha maior); classe média = papel de parede e
  lambri pintado; rodapé alto e *picture rail*.
- **Papel de parede arsenical:** o verde de Scheele dominou meados do século
  (Limehouse, 1862: quatro irmãos mortos; pânico público nos 1870s; Morris ainda
  chamava o medo de "tolice" em 1885). **Em 1893, papel verde antigo segue nas
  paredes de casa não redecorada — quarto úmido + papel verde velho = fonte crônica
  de sintomas arsenicais que confunde o quadro tóxico** (validar uso mecânico com a
  KB forense).
- **Tetos:** vigas aparentes com o assoalho de cima à vista (cottage) vs. estuque
  com roseta e cornija (classe média).

## 4. Fogo e cocção em detalhe construtivo

- **Range:** *open range* (grelha aberta, mais barato, às vezes fundido pelo
  ferreiro local) = casa modesta; ***closed range* / *kitchener*** (fogo encerrado,
  dutos ao redor do forno, *dampers* ao nível dos olhos, boiler lateral de água
  quente) = classe média. Portinholas de fuligem para o limpador de chaminés.
  **Range fosco e sem grafite denuncia casa sem braços ou sem brio.**
- ***Inglenook*:** a lareira-alcova do cottage/farmhouse antigo (vão de 2–3 m sob
  viga *bressumer* de carvalho, bancos internos, nicho de sal, forno de pão na
  ilharga). No século XIX foi sendo TAPADA: em 1893 o cottage típico tem um range
  vitoriano dentro de um inglenook emparedado — **camadas de idade visíveis, e um
  vão morto atrás do tijolo** (esconderijo clássico).
- **Forno do padeiro como serviço público:** quem só tem trempe leva o assado de
  domingo à padaria por uns pence — deixa-o a caminho do culto, recolhe na volta.
  **O padeiro sabe quem assou o quê, e quem faltou no domingo.**
- **O *copper*** (ver `utensilios-e-objetos.md` §3): estrutura de tijolo com
  fornalha própria na copa, muitas vezes dividindo a chaminé com o range.

## 5. Anexos e quintal em detalhe

- **Privada externa:** cabine ~4×4 pés de tábua ou tijolo, telhado de uma água,
  recorte de ventilação na porta; assento de tábua com furo (às vezes dois, adulto
  e criança); jornal cortado em quadrados num barbante; cinza ou terra contra o
  cheiro. Sistemas: fossa; *pail closet* (balde padronizado, coleta noturna semanal
  em carroça selada); *earth closet* de Moule (o preferido de presbitérios e
  escolas). Fica no fundo do quintal, junto do chiqueiro e do monturo.
- **Chiqueiro:** quase todo cottage engorda um porco por ano; em **outubro de 1893 o
  porco está gordo e a matança é iminente** — facas afiadas, cordas e um evento
  doméstico sangrento no calendário de qualquer quintal.
- **Poço:** doméstico de 3–4 pés de diâmetro com tampa de madeira ou laje; comunal
  até 10 pés; revestimento de tijolo a seco (argamassado só nos 3 pés do topo);
  profundidade comum de vale 15–60 pés. **Perigosamente perto das fossas** — a
  contaminação era preocupação corrente. Cisterna de chuva captando do telhado.
- **Horta em outubro** (Loudon: metade do terreno em batata; "batatas, repolhos,
  favas e feijões"): arranca-se a batata tardia antes da geada e armazena-se em
  *clamp* (monte coberto de palha e terra — **terra recém-mexida no quintal de
  outubro é NORMAL**, álibi perfeito para cavador noturno); ficam couves de inverno
  e nabos no chão.

## 6. Tipos de prédio adicionais (expansão do vocabulário do gerador)

Uma vila de ~1.700 hab. (Henfield, 1874) sustentava relojoeiro, cervejeiro,
ferreiro, carroceiro, seleiro, moleiro, padeiro, sapateiro e *maltster*. Tipos além
dos 14 de `espaco.js`:

| Prédio | Silhueta e sinais | Posição |
|---|---|---|
| **Padaria** (*bakehouse*) | casa comum + forno de alvenaria nos fundos; chaminé robusta; entrega de lenha | rua principal |
| **Correio na loja** (*sub-post office*) | mercearia com placa esmaltada "Post Office", fenda de latão, balcão dividido, relógio oficial | a loja principal |
| **Oficina do carroceiro** (*wheelwright*) | galpão aberto, serragem, rodas encostadas, plataforma circular de ferro no pátio (*tyring platform*) | vizinho da forja (trabalham em dupla) |
| **Açougue** | janelas largas de guilhotina que abrem por alças, carne em trilhos com ganchos, bancada de mármore inclinada com drenos, azulejos, serragem trocada diária; **matadouro nos fundos** | rua principal (o abate, atrás) |
| ***Almshouses*** | fileira de portas idênticas mínimas, chaminés em série, placa do benfeitor; morada de velhos/viúvas sob um *warden* | perto da igreja |
| ***Reading room* / instituto** | prédio NOVO de tijolo são (onda de 1880s, movimento de temperança); jornais, jogos, retrato da Rainha; "nenhuma pessoa embriagada poderá entrar" | rua principal — o anti-pub |
| ***Tithe barn*** | celeiro medieval enorme (Abbotsbury: 272 pés) | fazenda; memória do poder da igreja |
| **Pombal** (*dovecote*) | torre circular/octogonal com lanternim de voo | relíquia de solar/fazenda grande |
| ***Malthouse*** | comprido e baixo, estufa de telhado piramidal com ventilador giratório (*cowl*) | borda |
| **Forja em detalhe** | madeira com parede-escudo de tijolo onde a forja encosta; *travis* (área de ferrar) de piso de tijolo destruído pelos cascos; foles em coração | (complementa `espaco.js`) |

## 7. A igreja e o adro em detalhe

- ***Lychgate*** (portão dos mortos, de *līc*, cadáver): portal coberto de carvalho
  na entrada do adro, bancos laterais, pedra ou cavaletes ao centro — **o caixão
  espera ali o pároco; a primeira parte do ofício fúnebre reza-se no portão**.
- **Teixos:** muitas vezes mais velhos que a própria igreja; **tóxicos para o gado**
  (mais um motivo do adro murado) — e uma fonte de veneno de época crescendo em
  público (validar mecânica com a KB forense).
- **Lápides:** sepulturas leste-oeste, cabeceira a oeste; **o lado norte do adro é
  historicamente evitado** (suicidas, não batizados); os ricos junto ao caminho sul
  e dentro da igreja.
- **Relógio de torre:** corda semanal (ou diária) içando pesos — **quem dá corda
  (sacristão, sineiro) tem acesso rotineiro e SOLITÁRIO à torre**, com vista da
  vila. Sineiros pagos por toque, despesa nas contas paroquiais; o *tolling* anuncia
  a morte (cruza com `vida-cotidiana.md` §8).
- **Sacristia (*vestry*):** guarda paramentos e **os registros de batismo, casamento
  e óbito em cofre de ferro** — e é a sala do *vestry meeting*, o governo civil de
  fato da paróquia em 1893 (os conselhos paroquiais do Local Government Act são de
  1894 — **ainda não existem**). Cripta acessível é rara; quando há, é abóbada de
  família senhorial.

## 8. O pub por baixo e por cima

- **Adega:** meio-enterrada, ~55 °F estáveis o ano todo (12–13 °C — **um corpo ali
  esfria em curva diferente**; ver KB forense); barris em *stillage* (berço),
  inclinados conforme esvaziam; entrega por escotilha (*trap door*) no pátio
  lateral. O *cellarman* (ou um moço) desce diariamente.
- **Licença e tabuleta:** sinal externo obrigatório desde 1393; licença dos juízes
  de paz desde 1552; fascia pintada com o nome do licenciado ("John Smith, licensed
  to sell ales, porter, wines, spirits & tobacco").
- **Quarto de hóspede (mobília mínima canônica):** cama de ferro ou madeira,
  lavatório com bacia e jarro, penico no armário da base, toalheiro, **castiçal com
  fósforos em posição conhecida**, espelho; porta com nome ou número pintado; água
  quente sobe com a criada — **que vê o hóspede a horas fixas**.
- ***Ostler*** (cavalariço): recebe o cavalo suado, lava, cobre, alimenta 3+ vezes
  ao dia — **sabe a que horas cada cavalo chegou e em que estado**. Em 1893,
  pós-ferrovia, o coaching inn decaiu: pátio, arco e 2–6 baias para os cavalos de
  comerciantes e do médico.

## 9. Vidro e ferragem — datadores de detalhe

- **Vidro:** *crown* (distorção concêntrica, painel abaulado, o *bullseye* central
  vendido barato aos humildes) = vidraça velha/pobre; *cylinder/sheet* (ondas
  paralelas) = vitoriana corrente; *plate* (plano perfeito, caríssimo) = vitrine
  próspera e espelhos. **Vidro estirado a máquina é do século XX — anacronismo.**
- **Trincos:** *Suffolk latch* (polegar, sem espelho, forjado) = porta pré-1840;
  *Norfolk latch* (chapa estampada, produção em massa) = mais nova; cottage tranca
  com ferrolho de correr e tramela (complementa `arquitetura-e-espacos.md` §6).
- **Dobradiças:** *butt hinges* embutidas nas portas almofadadas; gonzos longos em T
  nas portas de tábuas.
- **Campainha:** *bell pull* ligado por arames ao sino da cozinha = classe média com
  criadagem; cottage = aldrava ou o punho na madeira.

## 10. Patologias — como um prédio envelhece (e o que isso diz)

- **Umidade ascendente:** todo prédio pré-1875 não tem DPC — maré de sal e reboco
  esfarelado até ~1 m, lajotas que "suam", papel descolando embaixo.
- **Colmo:** palha de trigo dura 15–25 anos; junco 25–40; cumeeira refeita a cada
  10–15. Musgo e sombra aceleram o apodrecimento. Colmo afundado com rede de arame
  improvisada = dono sem os xelins do colmador; colmo dourado novo = dinheiro
  recente.
- **Cal e madeira:** caiação é sacrificial (demão periódica; parede "sarnenta" =
  manutenção atrasada); caixilho apodrece primeiro no peitoril.
- **Sequência de decadência legível** (estágios para o gerador): (1) cal manchada,
  cumeeira desgrenhada → (2) peitoril podre, vidro rachado remendado com papel →
  (3) colmo furado sob lona, porta empenada, horta no mato → abandono. **Nos
  cottages atrelados ao emprego (*tied cottages*), o estado do telhado acusa o
  fazendeiro, não o morador.**

## Implicações para o jogo

- **Réguas para os grids de `interiores.js`:** cômodo de cottage ≈ 4×4 m; pé-direito
  que muda o som (tábua de cima range; viga baixa colhe a testa do intruso alto);
  escada íngreme e encaixotada = gargalo sonoro e físico da casa inteira.
- **Datadores visuais por fachada** (prosa de localidade sem custo): geração da
  janela (6/6, 2/2, 1/1), tipo de vidro, trinco Suffolk × Norfolk, presença de DPC —
  cada prédio conta sua idade e renda.
- **Novos ganchos de cena:** o vão morto atrás do inglenook tapado; o forno do
  padeiro como registro de domingo; a adega fria do pub (curva de esfriamento
  anômala); a torre do relógio como posto de observação solitário; o lado norte do
  adro; o matadouro atrás do açougue; a matança do porco de outubro normalizando
  facas e sangue num quintal.
- **Tipos de prédio candidatos a expansão do `espaco.js` §TIPOS_PREDIO:** padaria,
  açougue (com fundos), reading room, almshouses, oficina do carroceiro — cada um já
  com silhueta e sinais distintivos na tabela do §6 (decisão de escopo é do dono).
- **Anacronismos a bloquear:** vidro estirado a máquina; conselho paroquial civil
  (é 1894); DPC em prédio velho.
- **Divergências KB × motor a apontar, nunca resolver sozinho:** papel arsenical e
  teixo como fontes tóxicas (exigem validação da KB forense antes de virarem
  mecânica); curva de esfriamento na adega (idem, `tempo_morte`).

## Fontes consultadas

- Wikipedia — *Pre-regulation terraced houses in the UK* (13×13 pés; flagstones sobre cinza); *Byelaw terraced house* (DPC, 1/10 de janela, beco de serviço); *Sash window*; *Pail closet*; *Lychgate*; *Pub* (sinal 1393; Alehouse Act 1552). https://en.wikipedia.org/wiki/Byelaw_terraced_house
- Isaacs — origem da regra de 1/10 de janela (Lighting Research & Technology, 2024). https://journals.sagepub.com/doi/10.1177/14771535231225363 ; Susanna Ives — *The Modern Victorian Farm Labourer's Cottage* (transcreve *The Farm Homesteads of England*). https://susannaives.com/wordpress/2021/10/the-modern-victorian-farm-labourers-cottages/
- Building Conservation — *Metal windows* (Loudon 1833); *Limewash and distempers*; *Plain glazing* (crown/cylinder/plate); *Churchyard yews*. https://www.buildingconservation.com/articles/glazing/glazing.htm
- Janelas sash (cronologia 6/6 → 2/2 → 1/1, sash horns): Wooden Windows (https://woodenwindows-online.co.uk/2026/03/12/victorian-sash-windows/); Ventrolla (https://www.ventrolla.co.uk/decoding-victorian-sash-windows/); Parsons Joinery (imposto do vidro 1845). https://parsonsjoinery.com/blog/victorian-sash-windows ; Gowercroft — *Yorkshire sliding sash*. https://www.gowercroft.co.uk/heritage-windows-and-doors/belton-heritage-horizontal-sliding-sash-window/
- Portas e ferragens: Old English Doors — *Victorian doors*. https://www.oldenglishdoors.co.uk/blog/doors-victorian-era ; The Victorian Emporium — *Door hardware and locks*. https://www.thevictorianemporium.com/publications/editorial/article/the-history-of-victorian-door-hardware-and-locks ; Suffolk Latch Company — *History of the Suffolk latch*. https://www.suffolklatchcompany.com/blogs/news/history-of-the-suffolk-latch ; Norfolk latch. https://old-doors.info/pdfs/norfolk.pdf
- Old House Online — *Early staircases: winder, box, spiral*. https://www.oldhouseonline.com/interiors-and-decor/early-staircases-winder-box-spiral/
- Papel arsenical: Journal of Victorian Culture — *Arsenic and Old Wallpapers* (2023; Limehouse 1862, Morris 1885). https://jvc.oup.com/2023/12/14/arsenic-and-old-wallpapers/ ; The Collector — *Victorian green wallpaper*. https://www.thecollector.com/why-victorian-green-wallpaper-deadly/
- Range e inglenook: Mr Victorian — *The cast iron range* (open × closed; ferreiro local). https://mrvictorian.co.uk/2021/02/16/cast-iron-range/ ; Osborne — *History of the kitchen range* (Bodley). https://www.osbornerestoration.co.uk/about/history-of-the-kitchen-range/ ; Artisan Fireplaces — *Inglenook* (2–3 m). https://artisanfireplaces.co.uk/inglenook-fireplace/ ; Village & Cottage — *Inglenook* (tapamento no séc. XIX). https://www.villageandcottage.com/cottages/inglenook-fireplace/
- Forno comunitário: Who Do You Think You Are — *History of baking* (assado de domingo no padeiro); Old & Interesting — *Communal bread ovens*. http://www.oldandinteresting.com/communal-bread-ovens.aspx
- Privada e quintal: 1900s.org.uk — *The outdoor privy* (dois furos; jornal no barbante). https://www.1900s.org.uk/outdoor-privy.htm ; horta de cottage: Tankard, "A garden to every cottage" (*Agricultural History Review* 67-II; Loudon 1838: metade em batata). https://www.bahs.org.uk/AGHR/ARTICLES/67_2_Tankard.pdf ; Fagus — *History of the cottage garden* (porco doméstico). https://fagusgardening.co.uk/2017/06/19/neil-lovesey-picket-nurseries-the-history-of-the-cottage-garden/
- Poços: Threapwood History — *Brick lined wells* (3–4 pés; steining). http://www.threapwoodhistory.org/Documents/bricklinedwells.pdf ; RuralHistoria — *The village well* (contaminação por fossa). https://ruralhistoria.com/2023/11/01/village-well/
- Tipos adicionais: Cuckfield Connections — *All the shops you need* (Henfield 1874). https://www.cuckfieldconnections.org.uk/post/19th-century-all-the-shops-you-need ; Building Our Past — *Historic butchers' shops* (mármore, azulejos, ~1.500 matadouros em Londres, 1873). https://buildingourpast.com/2016/11/28/a-spotters-guide-to-historic-butchers-shops/ ; Weald & Downland Living Museum — *Smithy from Southwater* (travis; foles). https://www.wealddown.co.uk/buildings/smithy-from-southwater/ ; Historic England — *Community centres* e *Temperance buildings* (reading rooms de 1880s). https://heritagecalling.com/2022/12/08/a-brief-history-of-community-centres-in-england/ ; FamilySearch — *Almshouses*. https://www.familysearch.org/en/wiki/England_Almshouses_-_International_Institute ; Ropley History — *Historic village shops* (sub-post office). https://www.ropleyhistory.org.uk/village-history/buildings-architecture-and-historic-houses/historic-village-shops
- Igreja: Ecclesiastical & Heritage World — *English church clocks* (corda paga). https://ecclesiasticalandheritageworld.co.uk/news/580-english-church-clocks-by-keith-scobie-youngs ; CCCBR — *History of ringing* (sineiros pagos). https://cccbr.org.uk/the-history-of-ringing/ ; St Mary's Walberton — *Churchyard* (vestry e contas). https://www.stmaryswalberton.org.uk/index.php/about-us/churchyard
- Pub: Craft Beer & Brewing — *Cellarmanship* (~55 °F; stillage). https://www.beerandbrewing.com/dictionary/KH4tG4Oe0R ; Building History — *Inns*. https://buildinghistory.org/buildings/inns.shtml ; St Ives 100 Years Ago — *Ostler*. https://stives100yearsago.blogspot.com/2024/09/ostler.html ; Britannica — *Washstand*. https://www.britannica.com/topic/washstand
- Colmo: Heart of England Thatchers — *How long should thatch last* (15–25/25–40 anos). https://heartofenglandthatchers.com/how-long-should-a-thatch-roof-last-for/ ; Thatch Advice Centre — *Maintenance*. https://www.thatchadvicecentre.co.uk/thatch-information/care-thatch/maintenance
- Pé-direito e portas (ordem de grandeza, fontes fracas): Architect Two Cents; calendar-uk; Bob Vila; JB Kind — usar como faixa, não como fato citável. https://architecttwocents.com/old-houses-high-ceiling/

**Notas de confiança:** dimensões de escada winder, privada (4×4 pés), chiqueiro,
alpendres e a distribuição de dobradiças são inferência construtiva (sem fonte
quantitativa); pé-direito por classe vem de fontes fracas (faixas, não fatos); a
data da patente de Moule (1860) está firmada na fonte já citada em
`arquitetura-e-espacos.md` (Old & Interesting). Testada de terraced (14–16 pés) vem
de fórum — ordem de grandeza. Papel arsenical e teixo tóxico NÃO entram em mecânica
sem validação do perito forense.
