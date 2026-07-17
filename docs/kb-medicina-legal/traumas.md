# Traumatologia Médico-Legal (1893)

> Base de conhecimento forense de MORTEM. Registro de tratado técnico impessoal, no
> estado da arte de um bom perito do fim do século XIX (Taylor, *Principles and Practice
> of Medical Jurisprudence*; Casper-Liman, *Handbuch*; Lacassagne, escola de Lyon). Onde a
> ciência de 1893 não alcançava, este documento o diz. Nenhum número é inventado: quando a
> fonte da época era imprecisa, a imprecisão fica registrada como tal.

A traumatologia médico-legal ocupa-se das lesões produzidas por ação mecânica sobre o
corpo. O perito de 1893 não dispõe de radiografia (os raios de Röntgen só se anunciam em
1895), de exame histológico de rotina nem de qualquer prova de individualização do
instrumento. Seu método é a inspeção atenta da ferida a olho nu e à lente, a dissecção por
planos e o raciocínio sobre a mecânica que a produziu. A ferida é o molde negativo do
gesto: dela se lê a natureza do instrumento, a direção do golpe e, com a reação vital, se a
vítima ainda vivia quando o recebeu.

## A divisão fundamental das feridas

Toda a matéria organiza-se por uma distinção de bordas, legível à lente sem instrumento
algum:

| Classe | Bordas | Fundo da ferida | Instrumento |
|---|---|---|---|
| Contusa | Irregulares, escoriadas, esmagadas | Pontes de tecido íntegro atravessando a ferida | Objeto rombo |
| Incisa | Nítidas, limpas, retas | Corte franco, sem pontes | Lâmina cortante |
| Perfurante | Nítidas, mas de abertura estreita | Trajeto profundo e afilado | Lâmina ou objeto pontiagudo |
| Por projétil | Orla de contusão circular | Trajeto de arma de fogo | Projétil |

A **ponte de tecido** — filetes de pele, vaso ou fáscia que cruzam intactos o leito da
ferida — é o sinal soberano do trauma contuso e não existe no corte de lâmina. É o critério
mais seguro de que dispõe o perito de 1893 para separar a laceração do talho.

## Trauma contuso

O objeto rombo não corta: esmaga, estira e rompe. Produz **contusões** (equimoses, a
infiltração do sangue no tecido), **lacerações** de bordas irregulares e escoriadas, e, sobre
o osso, **fraturas** e **afundamentos**. No crânio, o afundamento pode reproduzir grosseiramente
a forma da superfície que o causou — a aresta de um atiçador, o canto de um degrau —, mas o
perito prudente descreve a forma e se abstém de nomear o objeto: a correspondência é
sugestiva, não probatória.

Distingue-se do corte pela margem: onde a lâmina deixa aresta limpa, o corpo rombo deixa
bordo esfacelado, halo de escoriação e as pontes de tecido já ditas. A cor da equimose
acompanha a idade da lesão — do vermelho-arroxeado ao esverdeado e ao amarelo à medida que
o sangue extravasado se decompõe —, sequência conhecida da época e útil, com reservas, para
ordenar lesões de datas diferentes num mesmo corpo. No jogo, o sinal-assinatura correspondente
é `ferida_contusa`, que confirma a causa `trauma_contuso`.

## Ferida por arma branca

A lâmina divide os tecidos. A leitura da ferida repousa em duas medidas e uma geometria:

- **Comprimento × profundidade.** Na ferida **incisa** (golpe que desliza), a abertura é mais
  longa que funda. Na **perfurante** ou **perfuro-incisa** (golpe que penetra), a profundidade
  excede o comprimento da abertura na pele — e é aqui que mora a advertência clássica de
  Taylor: *o trajeto pode ser mais fundo que o comprimento da lâmina*, porque a parede
  abdominal cede sob a pressão. A profundidade do trajeto **não** mede com segurança o
  comprimento da arma.
- **Largura da abertura.** Aproxima a largura da lâmina, mas não a fixa: a elasticidade da
  pele e a direção das fibras cutâneas alargam ou encurtam a fenda conforme o eixo do talho.
- **Ângulos da ferida.** Uma lâmina de **um só gume** tende a deixar uma extremidade aguda e
  outra romba ou em cauda; a de **dois gumes**, ambas as extremidades agudas. É o melhor
  indício que a época oferece sobre o tipo de lâmina, sempre oferecido como probabilidade.

O motor reúne incisas e perfurantes sob um único sinal `ferida_incisa`, que confirma a causa
`ferida_arma_branca`. A medicina legal de 1893 as distinguiria (o corte que sangra em
superfície não é a punctura que mata em profundidade); ver a divergência ao fim.

## Ferida por arma de fogo

A ferida de projétil apresenta, no caso típico, dois orifícios de leitura oposta:

| | Orifício de entrada | Orifício de saída |
|---|---|---|
| Tamanho | Menor, arredondado | Maior, irregular, everso |
| Bordas | Voltadas para dentro | Voltadas para fora |
| Sinal próprio | **Orla de contusão** (anel de escoriação) | Ausente |

A **orla de contusão** — o anel escuro e escoriado que o projétil imprime ao vencer a pele —
é a marca cardinal da entrada e era conhecida e nomeada na literatura da época. A distância do
disparo lê-se pelos resíduos ao redor da entrada, matéria em que a escola de Lacassagne já
trabalhava com método:

- **Encostado ou à queima-roupa:** enegrecimento pela fumaça, chamuscamento dos pelos e, no
  contato firme, laceração estrelada das bordas pela expansão dos gases.
- **A curta distância:** **tatuagem de pólvora** — os grãos não queimados incrustam a pele em
  salpicos que não se lavam. Sua extensão gradua a distância em palmos.
- **A distância maior:** nem fumaça nem tatuagem; apenas o orifício e a orla.

O sinal do jogo é `orificio_projetil`, que confirma `arma_de_fogo`.

**O limite da balística de 1893.** O perito recupera o projétil, pesa-o, mede-lhe o calibre
grosseiro e conta as raias que a alma da arma nele imprimiu. Isso pode ser **compatível** com
certa classe de arma. Mas casar um projétil a **um cano** determinado — a balística
comparativa por estriamento — não existe: o microscópio de comparação de Goddard é de 1925.
Em 1893, o projétil prova a classe da arma, jamais a arma individual.

## Reação vital — o eixo de toda a traumatologia

É o conceito que atravessa e ordena tudo o que precede: **distinguir a lesão sofrida em vida
da infligida sobre o cadáver.** O tecido vivo reage; o morto, não.

| Sinal | Lesão em vida (perimortem) | Lesão após a morte |
|---|---|---|
| Hemorragia | Sangue **infiltrado** nos tecidos, coagulado, que não se lava | Ausente ou escoamento passivo, sem infiltração |
| Bordas | **Retraídas**, afastadas pela retração do tecido vivo | Frouxas, justapostas |
| Coloração | Equimose viva, com halo | Palidez, sem reação |

A infiltração hemorrágica é o critério mais firme: uma ferida que se abre num cadáver não
enche de sangue coagulado os planos vizinhos. Casper já assentara a distinção; o perito de
1893 a lê a olho nu e à lente. Registre-se a honestidade da época: a **janela agônica** —
os minutos em torno da morte, quando a reação vital é ambígua — permanece um campo cinzento
que a microscopia da época não resolve com precisão. Dizer "esta lesão é perimortem" é
legítimo; cravar o minuto exato, não. No motor, `reacao_vital` é sinal **modificador**: prova
que a lesão foi sofrida em vida, mas não elimina causa alguma nem aponta o meio.

## Lesões de defesa: ativas e passivas

Quem vê o golpe procura apará-lo. As lesões de defesa dividem-se em duas espécies, pela
atitude do corpo que as recebe:

- **Defesa ativa** — a mão que **agarra** a lâmina ou disputa a arma. Cortes na **palma** e
  nas faces de **flexão dos dedos**, por vezes um talho que atravessa a dobra dos dedos ao
  fechar-se sobre o gume. É a marca de quem enfrentou o instrumento de frente e tentou
  detê-lo com a mão.
- **Defesa passiva** — o antebraço **erguido** para escudar a cabeça e o tronco. Lesões na
  face **ulnar** (o bordo do dedo mínimo) do antebraço, no dorso das mãos, no cotovelo:
  cortes, equimoses, às vezes a fratura do cúbito. É a marca de quem apenas se cobriu.

A distinção tem valor de reconstituição: a defesa ativa supõe uma vítima que ainda avança
sobre a arma; a passiva, uma que já só se protege. As duas podem coexistir num mesmo corpo,
e a sua topografia — de frente, de lado, por cima — ajuda a ordenar a sequência do ataque.

**Nota de honestidade cronológica:** o perito de 1893 **observa** sem dificuldade o talho
palmar de quem agarrou a lâmina e a lesão ulnar de quem ergueu o braço — são achados de
lente e bom senso. O **par nomeado** "defesa ativa / defesa passiva" como categoria
sistemática, porém, cristaliza-se na literatura forense do século XX; aqui é conveniência de
reconstituição do tratado, não rótulo corrente na boca de um perito vitoriano. Mesmo regime
das notas Locard/Piotrowski em `vestigios.md`.

Sua leitura mais eloquente é, ainda assim, frequentemente a **ausência**. Não haver lesão de
defesa é compatível com ataque súbito, golpe pelas costas, vítima adormecida, embriagada,
contida ou já inconsciente. É um indício de circunstância, não de autoria — e, como todo
indício, admite mais de uma explicação. No jogo, corresponde ao verbete `lesoes_defesa`.

## Capacidade de ação depois da lesão

Uma pergunta que o tribunal fazia ao perito de 1893, e que Taylor discute com franqueza:
**depois de recebida a ferida mortal, por quanto tempo ainda pôde a vítima agir** — andar,
falar, revidar, fechar a mão sobre um objeto, arrastar-se para outro cômodo? A resposta muda
conforme o **sítio** e o **mecanismo**, e é matéria de circunstância (o que se conciliava com
a cena), não de cravar minutos. O que a época sabia, articulava-o em termos de sobrevida e de
ato voluntário; a fisiologia fina — a reserva de oxigênio do cérebro medida em segundos — é
leitura de bastidor, não fala de 1893.

| Mecanismo / sítio | Capacidade de ação residual | Leitura |
|---|---|---|
| Ferida do **coração ou de grande vaso** | Preservada por **segundos a poucos minutos** antes do colapso | A vítima ainda corre, luta, agarra: sangue e luta longe do ponto do golpe são compatíveis |
| **Exsanguinação** (hemorragia sem lesão nervosa central) | Degrada **progressivamente** com a perda de sangue | A ação enfraquece rodada a rodada; a trilha de gotas segue a marcha que definha |
| **Trauma craniano com perda de consciência** | **Suprimida** enquanto durar o desmaio | Cai onde é golpeada; nada de fuga, nada de defesa depois |
| **Compressão cervical mantida** (ligadura, esganadura, sufocação) | **Anulada enquanto o meio prende** | Não grita nem foge sob o laço ou a mão; a ação só existe antes de o meio firmar-se |
| **Veneno** | Latência conforme a espécie | Não há confronto; a ação cessa no colapso, não no ato do agressor |

O ponto médico-legal decisivo, e velho de Taylor: **uma ferida absolutamente mortal não é
uma ferida instantaneamente incapacitante.** Um homem com o coração transpassado pode
atravessar um cômodo antes de tombar — e essa sobrevida breve é o que torna legível, na cena,
a diferença entre o lugar do golpe e o lugar da queda. Os bastidores modernos que consolidam
o quadro (Karger, sobre a capacidade de ação após ferimentos cardíacos e cranianos; DiMaio,
*Gunshot Wounds*; Spitz & Fisher, *Medicolegal Investigation of Death*) apenas dão método ao
que o perito de 1893 já observava caso a caso.

## Lesões de sítio posterior — a assinatura do golpe recebido em fuga

A **topografia** da lesão fala da atitude do corpo no instante do golpe. Lesões na face
**anterior** — peito, rosto, palmas — supõem quem encara. Lesões no **dorso**, na **nuca**,
na face posterior dos ombros e das pernas, supõem quem **deu as costas**: vítima que fugia,
que se voltou para escapar, ou golpeada por trás. É a contraparte da defesa passiva: onde
esta marca o antebraço erguido de quem se cobre de frente, a lesão de sítio posterior marca
quem já não se cobre — apenas se afasta.

Como todo indício de circunstância, admite mais de uma leitura (o golpe pelas costas do
ataque súbito também as produz, sem fuga alguma) e **jamais aponta autoria**. Mas, somada à
trilha de gotas que se afasta do ponto inicial, à mobília tombada em mais de um cômodo e ao
corpo caído longe de onde o confronto começou, sustenta a reconstituição de uma vítima que
**correu antes de cair**. O coroner de 1893 podia legitimamente registrar que os golpes
alcançaram o dorso — descrição do que se vê, não conclusão sobre quem os desferiu.

## Implicações para o jogo

- **O motor de dedução** (`src/data/catalogo_causas.js`) coloca as três causas traumáticas
  numa mesma família: `trauma_contuso`, `ferida_arma_branca`, `arma_de_fogo`. Cada uma tem um
  sinal-**assinatura** (`ferida_contusa`, `ferida_incisa`, `orificio_projetil`) que a confirma
  isoladamente e descarta as demais — exatamente porque, na perícia real, a margem da ferida
  (esfacelada, nítida, com orla de contusão) já separa o instrumento.
- **A reação vital** é o único sinal traumático **modificador** do catálogo: não crava nem
  elimina, mas informa se a lesão foi em vida — o mesmo papel que exerce no laudo de época.
  No caso tutorial (`o_alibi_de_corda`), a família da morte é a asfixia por ligadura, não o
  trauma; ainda assim, a reação vital nas bordas do sulco cervical é o que prova que o laço
  apertou o pescoço **vivo**, e não sobre um corpo já morto.
- **As lesões de defesa** (`lesoes_defesa`, domínio ambiental do glossário) entram como leitura
  de circunstância: sua presença ou ausência estreita hipóteses sobre o modo do ataque, nunca
  aponta o autor. A prosa de cena deve descrever mãos feridas ou íntegras e calar a conclusão,
  conforme a regra de observação pura do guia de estilo.
- **A honestidade de época** é jogável: o perito pode dizer o **calibre compatível** de um
  projétil, jamais o cano que o disparou; pode datar a lesão por reação vital em faixa, jamais
  ao minuto agônico. Esses limites são recurso de desenho, não defeito.

## Dossiê de método — precipitação (queda provocada)

O empurrão que atira a vítima escada abaixo (ou de uma altura) mata por **trauma contuso** —
mecanismo já coberto pelo catálogo (`trauma_contuso`/`ferida_contusa`). O que faz dele um
método próprio não é a causa, e sim a **discrepância** entre a cena de queda encenada e o que
o corpo diz. Fecha, pela via da queda, a lacuna 5 de `lacunas.md`.

- **Lesões de queda × lesões de golpe.** A queda distribui as lesões pelas **saliências** que
  primeiro tocam o chão e o degrau — cotovelo, ombro, quadril, joelho, e sobretudo o
  **occipício** (a nuca) e a fronte. Uma queda por escada tende a lesões **múltiplas,
  escalonadas**, em pontos de choque sucessivos, com escoriações de arraste. O **golpe**
  desferido por mão alheia atinge zonas que uma queda pouparia — o alto e o lado do crânio, a
  face, zonas protegidas — e tende a ser **único e concentrado**, com a forma do instrumento.
  A soma "lesão de padrão de golpe + cena de queda" é a discrepância que trai a precipitação.
- **Contragolpe.** No crânio, a queda pode produzir fratura **por contragolpe** (a lesão do
  encéfalo no polo oposto ao impacto) — sinal de que a cabeça vinha em movimento contra uma
  superfície parada (queda), e não uma superfície em movimento contra a cabeça parada (golpe).
  Conhecido da época como leitura de mecânica, útil para separar os dois.
- **Sangramento externo:** conforme a lesão — a laceração de couro cabeludo **sangra** muito
  (governa poça e, se a vítima ainda se move, trilha). Reação vital nas bordas separa a queda
  em vida da encenação sobre corpo já morto.
- **Capacidade de ação residual:** a queda que não mata na hora (a hemorragia que se instala
  em minutos ou horas — o **intervalo de sobrevida** de `tanatologia.md`) permite que a vítima
  ainda se arraste, o que espalha a cena. A queda com trauma craniano e inconsciência a
  **suprime** de imediato.
- **Vestígios no agressor:** poucos, e é o atrativo do método — o empurrão pode não deixar
  marca de contato. Restam os de circunstância: presença na cena, o motivo, a incongruência.
- **Ruído:** o **tombo** — pancada e queda de corpo, alto e único, mais o eventual grito da
  queda; não a luta prolongada.
- **Exigências:** uma **escada ou altura** representável na cena. É a exigência que a geração
  espacial do jogo não modela hoje (grids de um só piso) — ver a decisão D2 da OS. Não exige
  força desmedida (a física faz o trabalho) nem, a rigor, premeditação (o empurrão da briga
  escalada também precipita).
- **Encenabilidade:** é dos métodos **mais encenáveis como acidente** ("caiu da escada"). A
  traem: o padrão de golpe entre as lesões de queda, a lesão única de forma definida, a
  ausência de lesões de defesa quando a queda foi "espontânea", e a posição final do corpo
  incompatível com a trajetória de uma queda livre.
- **Vocabulário de época:** *precipitação*, *queda de altura*, *lesões de contragolpe*.

## Dossiê de mundo — ferida por espingarda de caça

Dossiê **de mundo**, não jogável nesta OS (ver a decisão D4): não entra no catálogo de
métodos, mas o coroner de 1893 conhece bem o ferimento por projétil de caça, corrente numa
vila cercada de campo. Serve à ambiência e a casos futuros.

- **A carga de chumbo, não a bala única.** A espingarda de caça dispara **múltiplos bagos de
  chumbo** (a carga de *shot*). A curta distância, a carga entra **compacta**, abrindo um
  orifício único, grande e devastador, de bordas laceradas; à medida que a distância cresce,
  os bagos **espalham-se** e imprimem o padrão de dispersão — orifícios satélites em torno do
  central. **A extensão do espalhamento gradua a distância do disparo** — é a leitura de
  época mais útil da espingarda.
- **Bucha e resíduos.** Além dos bagos, a carga leva a **bucha** (o tampão de feltro ou papel
  que separa pólvora e chumbo), que a curta distância penetra a ferida e se recolhe como
  vestígio — indica a proximidade do tiro. Enegrecimento, chamuscamento e tatuagem de pólvora
  seguem a mesma leitura da arma de fogo (ver acima).
- **Sem individualização do cano.** Como toda arma de fogo em 1893, a espingarda prova a
  **classe** (calibre, tipo de carga), jamais o cano individual — a balística comparativa é
  posterior (Goddard, 1925).
- **Encenabilidade:** o **acidente de caça** e o **suicídio** são as encenações clássicas. A
  traem: a distância do disparo lida no espalhamento (um "suicídio" com padrão de tiro
  distante é impossível — ninguém alcança o próprio gatilho a três metros), o ângulo
  incompatível com a mão da própria vítima, e a ausência de fuligem de contato onde um
  suicídio a exigiria.
- **Vocabulário de época:** *espingarda*, *carga de chumbo*, *bagos*, *bucha*, *tiro de
  caça*.

## Divergências notadas (KB × código) — sem correção aplicada

- **`ferida_arma_branca` funde incisa e perfurante.** O catálogo e o glossário tratam sob uma
  só causa (`ferida_arma_branca`, sinal `ferida_incisa`) o que a medicina legal de 1893
  distinguiria: a ferida **incisa** (cortante, comprimento > profundidade) e a **perfurante**
  (punctura, profundidade > comprimento). O glossário reconhece a diferença na definição, mas o
  motor não a discrimina. Decisão de jogabilidade a cargo do usuário: manter a fusão (simplicidade)
  ou desdobrar em duas assinaturas.
