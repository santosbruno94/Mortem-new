# DOSSIÊ DE PESQUISA — E3 da OS "Palco em anéis" (§4.1: a comarca)

> Fase E3: a vila gerada ganha uma COMARCA — 2–4 satélites por seed
> `{id, rotulo, distanciaHoras, meio: 'estrada'|'trilho', funcoes}`; satélite é
> FACHADA por padrão; interior de UM prédio de satélite só nasce se elegível (LOD);
> no mapa do caso, grupos `comarca_<id>` com custos reais; nós distantes nunca
> desbloqueados de início. Invariantes GE7/GE8/GE9. Data: 18/07/2026.
> **Nada do repositório foi editado** — este arquivo vive no scratchpad da sessão.

## 0. Método, proveniência e o contrato técnico verificado no código

- **Fontes lidas na íntegra:** `docs/kb-mundo-vitoriano/centros-urbanos-morfologia.md`,
  `centros-urbanos-instituicoes.md`, `centros-urbanos-vida-e-habitacao.md`,
  `economia-e-estrutura-social.md`, `vida-cotidiana.md`, `urbanismo-e-morfologia.md`.
  Código: `src/gerador/cidade.js`, `insercao.js`, `caso.js`, `pacote_gerado.js`,
  `arquetipos.js` (pacotes espaciais), `espaco.js` (TIPOS_PREDIO, ITENS_COM_AGUA);
  `src/data/mapa.js` (caso-escola). Dossiê E2 (`docs/os-palco-em-aneis-e2-dossie.md`)
  como precedente de formato e de decisões lavradas.
- **Regra de proveniência:** cada linha distingue **[KB]** (arquivo § seção) de
  **[CHUTE]** (chute calibrável de design). Horas de viagem são SEMPRE [CHUTE]
  calibrado pela régua da KB (milhas e velocidades documentadas), como as
  silhuetas de `espaco.js`.
- **Ressalva:** o texto integral da OS não está no repositório; §4.1–§4.6, GE7–GE9 e
  o vocabulário `{id, rotulo, distanciaHoras, meio, funcoes}` seguem o enunciado
  desta tarefa. Onde uma GE admite mais de uma leitura, o dossiê a declara.

### O que o código já fixa (verificado nesta data)

| Fato do código | Onde | Consequência para E3 |
|---|---|---|
| A cidade é lista plana de `predios` com `pos` e `adjacencias` por distância (limiar 1,9) | `cidade.js` | O satélite NÃO entra em `predios` (quebraria o grafo de avistamentos); entra como coleção nova `comarca: [...]` no objeto-cidade — fachada sem geometria de maquete obrigatória |
| Rotina = `{dia, noite, madrugada}` com ids de prédios da cidade; grafo de avistamentos deriva de `mesmo_local`/`adjacencia` | `insercao.js` | Um valor `fora:<id>` numa faixa casaria `mesmo_local` entre dois ausentes e criaria par coabitante fora da vila (ver §3.1 — vetar) |
| Briga escalada nasce de par coabitante (dia/noite); premeditado busca noite/madrugada; local = `rotina[faixa]` da vítima | `caso.js` passos 1–4 | Toda banda `fora:` mal desenhada vira cena de crime fora da vila — violação de GE8 e do LOD |
| Regime-palco 70/20/10; "o braço pousada (10%) recai em interno até a E3" | `caso.js` §4.5; decisão E2 §6.4 | O braço dos 10% é a porta NATURAL do caso-forasteiro da E3 (§3.4 abaixo) — sal já reservado |
| Mapa gerado é binário: `cena_predio`/`vila`, custos 0/1; nó oculto `oficio_do_reu` revelado por lead `gen_motivo` | `pacote_gerado.js` `montarMapa` | O padrão de extensão é aditivo: grupos `comarca_<id>` + entradas novas de custo + leads novos; nenhum custo existente muda |
| O caso-escola já tem o molde pronto: grupo `fora` (Moorford), 1,5h/trecho, nó `gabinete_pettigrew` oculto até lead, conteúdo = CORROBORAÇÃO (o caso fecha sem ir) | `src/data/mapa.js` | GE7 já está encarnada num caso jogado: satélite = atalho caro de registro, nunca gargalo. A E3 generaliza Moorford, não inventa |
| `NOMES_DE_VILA` = Wrenfield, Dunmere, Colbrook, Haversham, Aldergate, Marlow Green (padrão -field/-brook/-mere); Moorford é do caso-escola | `pacote_gerado.js`; `mapa.js` | O pool de nomes de satélite deve ser DISJUNTO desses sete (colisão vila = satélite seria absurdo diegético) |
| Estação é prédio opcional (~metade das seeds) | `espaco.js` estacao; `cidade.js` linha 141 | `meio: 'trilho'` e telégrafo-na-vila são CONDICIONAIS à seed — célula combinatória a vigiar (E0 §4) |

---

## 1. CATÁLOGO DE SATÉLITES

Três tipos, na escada de escala documentada: a vila (300–800 hab.) tem UM de cada
coisa e nenhum mercado; o degrau acima é a market town (1.000–3.000+), urbana por
função, não por tamanho [KB] `centros-urbanos-morfologia.md` §1. "A vila dos casos
atuais orbita uma market town (4–8 milhas)" é interpretação já lavrada na própria KB
[KB] morfologia §1, "Interpretação para MORTEM".

### 1.1 A vila-mercado (`vila_mercado`) — o satélite institucional

**(a) O que é e por que a vila gravita nele**

| Afirmação | Fonte |
|---|---|
| Raio de atração do mercado: 4–8 milhas — as vilas do entorno; nenhum ponto da Inglaterra a mais de ~8 milhas de um mercado já em 1300 | [KB] morfologia §7; urbanismo §6 |
| Dia de mercado semanal fixado por carta; traz os fazendeiros do raio, bancas, o grosso do movimento — "quando os dois mundos se misturam e o forasteiro passa despercebido" | [KB] instituições §1; morfologia §7 |
| "Mercado: semanal, na cidadezinha vizinha; meio dia de ausência justificável" — a vila JÁ frequenta a town por rotina | [KB] vida-cotidiana §5 |
| A justiça formal mora na town: magistrados (petty sessions semanais), coroner, county court mensal, delegacia com celas e sargento | [KB] urbanismo §9; instituições §3–4 |
| Profissionais residentes: advogado (procurador/solicitor), leiloeiro, veterinário; 1–2 agências bancárias | [KB] urbanismo §9; vida-e-habitação §2 |

**(b) Funções investigáveis — cada função entrega um REGISTRO durável (GE7)**

| Função (`funcoes`) | Registro/fato durável que entrega | Fonte |
|---|---|---|
| `gabinete_do_procurador` | testamento lavrado, escritura, partilha, papel de hipoteca — o precedente exato do gabinete Pettigrew | [KB] urbanismo §9 (advogado residente); instituições §4 (county court); precedente `mapa.js` |
| `penhorista` | o livro de penhores: "um raio-X datado da aflição financeira"; ciclo semanal documentado (penhora na segunda, resgate no sábado) | [KB] vida-e-habitação §2 |
| `hotel_comercial` (coaching inn reconvertida) | livro de hóspedes; a commercial room onde caixeiros-viajantes trocam fofoca de estrada; ônibus do hotel espera os trens | [KB] vida-e-habitação §3 |
| `lodging_house` | livro do dono, registrado e INSPECIONADO pela polícia (Acts 1851/53) — registro documental de forasteiros | [KB] vida-e-habitação §3 |
| `agencia_de_fio` | correio pleno com telégrafo (nacionalizado no Post Office desde 1870); o operador lê tudo o que passa | [KB] instituições §7 |
| `sessoes_dos_magistrados` | registro das petty sessions + o Police Court Report do semanário — o antecedente consultável | [KB] instituições §4; vida-e-habitação §4 |
| `tramp_ward` (workhouse da união) | livro de andarilhos: nome, origem e destino — "fonte documental de forasteiros que a vila não tem" | [KB] instituições §6 |
| `cobrador_de_toll` | "conhece todo vendedor forasteiro pelo nome e pela cara" — o fato falado que data presença em dia de mercado | [KB] instituições §1 |

Teto recomendado por seed: sortear 3–4 dessas funções (o resto existe mas não é
citado) — a vila-mercado nunca vira menu de tudo [CHUTE de dosagem].

**(c) Quem da vila o frequenta e com que recorrência**

| Quem | Recorrência | Fonte |
|---|---|---|
| Quem vende ou compra grosso (merceeiro, fazendeiro, moleiro) | dia de mercado semanal; meio dia de ausência | [KB] vida-cotidiana §5; instituições §1 |
| O *carrier*/carroceiro | circuito semanal à market town — o ônibus de carga da vila | [KB] urbanismo §2 (pacote-padrão) |
| Quem deve ou empenha | segunda (penhora) e sábado (resgate) | [KB] vida-e-habitação §2 |
| Quem litiga | county court ao menos mensal; petty sessions semanais | [KB] instituições §4 |
| Quinta = dia de mercado da semana doméstica ("quinta mercado") | semanal | [KB] vida-cotidiana §4 (a semana rígida) |

**(d) Distância em horas** — 4–8 milhas [KB] urbanismo §6; a pé 1h20–2h40, "menos de
1h de charrete" [KB] idem. Carroça de carga ~3 mph ≈ passo de pedestre [CHUTE
calibrável — a KB dá 3 mph como passo A PÉ; carroça rural carregada anda no mesmo
passo]. **Proposta: `distanciaHoras: 1.5`** por trecho, meio `estrada` — cravada no
precedente Moorford (1,5h, `mapa.js` CUSTO_ENTRE_GRUPOS) [CHUTE calibrado]. Em seed
com estação E vila-mercado servida pelo mesmo ramal: `meio: 'trilho'`,
`distanciaHoras: 1` (viagem curta + espera do trem — 4–5 trens/dia por sentido
[KB] morfologia §7) [CHUTE].

**(e) Nomes fictícios** (pool disjunto de `NOMES_DE_VILA` e de Moorford, mesmo
padrão -field/-brook/-mere; town soa um degrau "maior" que a vila):
`Ashmere`, `Netherfield`, `Ottersbrook`, `Kingsmere`, `Harefield`, `Redbrook`
[CHUTE onomástico no padrão já usado — cf. comentário de `pacote_gerado.js` sobre
o padrão dos topônimos rurais].

### 1.2 O entroncamento / halte ferroviário (`entroncamento`) — condicional à seed

**(a) O que é e por que a vila gravita nele**

| Afirmação | Fonte |
|---|---|
| A estação da vila fica 0,5–1,5 milha FORA do núcleo; Station Road reta e recente, Railway Inn ao lado — "o trecho mais moderno e menos vigiado" | [KB] urbanismo §6 |
| Ramal secundário: 4–5 trens por sentido/dia útil — o dia é pontuado pelos horários | [KB] morfologia §7 e §8 |
| O bairro de estação de town: goods yard, carvoarias, cattle market novo migrado para junto do trilho | [KB] morfologia §3 |
| Todo trajeto de trem passa pelo entroncamento onde o ramal encontra a linha-tronco — daí "junction" como topônimo | [CHUTE] leve — inferência direta da malha de ramal documentada (morfologia §7); a KB não nomeia o entroncamento |
| O telégrafo da companhia opera na estação | [KB] vida-cotidiana §6; instituições §7 |

**(b) Funções investigáveis**

| Função | Registro durável | Fonte |
|---|---|---|
| `bilheteria` | bilhete de trem emitido/recolhido — o rastro documental do forasteiro que dorme e viaja | [KB] vida-e-habitação §6 ("registro do hotel, livro da lodging house, tramp ward, bilhete de trem") |
| `telegrafo_da_companhia` | livro de telegramas datado ao minuto | [KB] vida-cotidiana §6 |
| `goods_yard` | livro de despacho de mercadoria (o caixote que veio, o volume que partiu) | [CHUTE] leve sobre morfologia §3 (goods yard documentado; o livro é inferência de prática ferroviária) |
| `chefe_da_estacao` | a grade de 4–5 trens como âncora de hora: quem embarcou/desembarcou em qual trem é fato datável | [KB] morfologia §7–8 ("sons datam e localizam"); vida-cotidiana "Implicações" |

**(c) Quem frequenta:** quem viaja (gentry, comerciante em dia de banco), quem
despacha (moleiro, granja), o carroceiro que busca frete — só nos horários de trem;
deserto no resto [KB] E2 dossiê §1.5e (plataforma); morfologia §8.

**(d) Distância** — só existe em seed COM estação (`meio: 'trilho'`). O
entroncamento fica ramal abaixo: **`distanciaHoras: 1`** (o trem corre rápido; a
latência é a espera de um dos 4–5 horários) [CHUTE calibrável; a KB não dá
velocidade de trem — o que dá é a frequência, que domina o custo].

**(e) Nomes:** `Cobfield Junction`, `Deanbrook Halt`, `Withymere Junction`
[CHUTE onomástico; "Junction"/"Halt" é vocabulário ferroviário de época — cf.
Brighton & Dyke Railway nas fontes de morfologia §7].

### 1.3 A granja/moinho isolado (`granja_isolada`) — o satélite mudo

**(a) O que é e por que existe**

| Afirmação | Fonte |
|---|---|
| A depressão agrícola esvaziou o campo: cottage fechado, colmo afundando, fazenda que não paga a hipoteca — a granja afastada meio-abandonada é paisagem canônica de 1893 | [KB] urbanismo, regra de ouro; economia §1 ("a fazenda que não paga mais a hipoteca") |
| Assentamentos periféricos ligados à igreja por *corpse roads*/*church paths* — o hamlet sem igreja (50–200 hab.) existe na taxonomia | [KB] urbanismo §5 e §6 (tabela: hamlet) |
| Moinho de vento em morro fora do casario, para vento limpo | [KB] urbanismo §7 |
| O lavrador caminha até 2–3 milhas até a fazenda | [KB] vida-cotidiana §1 (linha das 5h) |

**(b) Funções investigáveis** — o satélite POBRE em registro (deliberado: é o
candidato natural ao papel corroborativo da GE9):

| Função | O que entrega | Fonte |
|---|---|---|
| `arrendatario` | o papel de arrendamento/renda de Michaelmas (paga em 29/set — duas semanas antes do crime) | [KB] vida-cotidiana §5 (Michaelmas vira o ano agrário) |
| `celeiro_de_debulha` | fato falado: quem debulhava lá em dia de chuva (álibi de campo) | [KB] vida-cotidiana §5 |
| `contrato_anual` | o contrato de criado/lavrador renovado na feira de contratação (até o Velho Michaelmas, 10/out — dias antes do crime) | [KB] vida-cotidiana §5; instituições §1 |

**(c) Quem frequenta:** lavradores e pastor da vila (o campo deles pode SER o do
satélite — 2–3 milhas de caminhada documentadas [KB] vida-cotidiana §1); o
carroceiro em ronda de frete [KB] urbanismo §2.

**(d) Distância** — 1–2 milhas por estrada/senda: **`distanciaHoras: 0.5`**
[CHUTE calibrável sobre a régua de 3 mph de urbanismo §6]. É o satélite barato —
o degrau entre a vila (1h) e a town (1,5h).

**(e) Nomes:** `Thornfield` (granja de Thornfield), `Withybrook`, `Bramblemere`,
`Longfield` [CHUTE onomástico, mesmo padrão].

### 1.4 Composição por seed (antecipando §5a)

`vila_mercado` é OBRIGATÓRIA (a KB não admite vila sem town no raio de 8 milhas —
urbanismo §6); `granja_isolada` obrigatória (o satélite barato e mudo);
`entroncamento` condicional à estação; segunda granja/hamlet opcional. Resultado
natural: 2 satélites (seed sem estação, sem extra) a 4 (com estação + extra) —
exatamente a faixa 2–4 da OS, sem sorteio forçado.

---

## 2. A ESTRADA COMO LOGRADOURO-CORREDOR

### 2.1 O que a KB dá

| Afirmação | Fonte |
|---|---|
| Estrada rural = macadame com abaulamento escoando para VALETAS laterais; seca = poeira branca; chuva = lama e sulcos de roda | [KB] urbanismo §4 |
| Marcos miliários compulsórios nas estradas de pedágio desde 1766; *fingerposts* à altura de leitura de quem vai a cavalo | [KB] urbanismo §3 |
| Sebes dominam a terra baixa: ~200.000 milhas plantadas nos cercamentos; sebe grossa e sinuosa = limite antigo, reta e rala = campo novo | [KB] urbanismo §8 |
| *Stiles* e portões = os "checkpoints" onde alguém sentado vê quem passa | [KB] urbanismo §5 |
| Pegadas e rodados conservam-se bem no barro de outubro | [KB] vida-cotidiana §8 |
| Porteira de pedágio EM OPERAÇÃO em 1893: a KB só menciona pedágio no passado ("desde 1766"); os turnpike trusts estavam extintos na década de 1880 | [CHUTE historiográfico A VALIDAR — a KB não cobre a extinção; recomendação: bloquear porteira ativa; a CASA de pedágio desativada, morada de cottage, é mobília plausível |

### 2.2 Como o schema da E2 a modelaria

O molde é o `caminho_do_acude` (o único palco-corredor da E2, `espaco.js`
`caminho_do_acude` grid 8×4, saidas nas duas pontas). A estrada seria o segundo
corredor, grid 10×3 [CHUTE, convenção de escala de logradouro do dossiê E2 §1]:

| Canto | `ret` | Leitura |
|---|---|---|
| `pista` (A estrada de macadame) | col 0, fila 1, 10×1 | rodados, poeira/lama [KB urbanismo §4] |
| `valeta` (A valeta e a berma) | col 0, fila 2, 10×1 | o que rola da pista some da vista [KB §4] |
| `beira_da_sebe` (O pé da sebe alta) | col 0, fila 0, 10×1 | a sombra contínua; quem espera, espera aqui [KB §8] |

`saidas`: {col 0, fila 1} e {col 9, fila 1} — as duas bocas do corredor (fugir é
escolher direção, a morfologia do açude). Mobília: marco miliário [KB §3],
fingerpost [KB §3], porteira de campo com *stile* [KB §5], bueiro/pontilhão de
pedra [CHUTE leve], casa de pedágio desativada [CHUTE, ver acima].

### 2.3 Cena de crime na v1, ou só meio? — RECOMENDAÇÃO: só meio

A OS diz que a estrada "costura os dois anéis". Custo × ganho de ela ser CENA já
na E3:

- **Contra (pesa mais):** (i) a estrada não é anexa a prédio de rotina nenhum — o
  padrão da E2 (`LOGRADOURO_DO_PREDIO` em `caso.js`) não a alcança; a vítima só
  chegaria lá por chamariz OU por um regime novo ("emboscada no caminho de volta"),
  que é mecânica nova, não extensão; (ii) acoplaria à E3 uma célula combinatória
  extra (regime-palco × estrada × comarca) exatamente do tipo que a E0 §4 manda
  vigiar antes do Monte Carlo; (iii) a E3 já carrega comarca + forasteiro +
  telegrama — o incremento deixa de ser jogável se inchar.
- **A favor (registrar para v2):** a caminhada solitária de volta do campo no
  escuro é furo de álibi crível documentado [KB] vida-cotidiana "Implicações"; o
  corpo achado na estrada casa perfeitamente com a vítima-forasteiro ("quem era
  este homem", §3.4) e com descobridor-transeunte da banda 6h–8h30 já implementada
  (`caso.js` §4.6).
- **Na v1, a estrada existe como MEIO:** é o `meio: 'estrada'` dos satélites, a
  prosa de viagem ("a charrete toma a estrada de Ashmere; o marco miliário conta as
  milhas") e no máximo um ponto de ambiência na chegada. A partição de §2.2 fica
  catalogada, custo de ativação futura = só dado (mesma tática da travessa dos
  fundos na E2, §1.4 → decisão E2 §6.1).

---

## 3. VERIFICAÇÃO ASSIMÉTRICA E FORASTEIRO (§4.5)

### 3.1 A banda `fora:<satelite>` contra o código real de `insercao.js`

O que o código faz hoje (lido em `insercao.js`): rotina em 3 faixas com ids de
prédios da cidade; `derivarGrafoAvistamentos` casa `mesmo_local` por igualdade de
string e `adjacencia` por `saoAdjacentes` da cidade. E `caso.js` (passo 1) monta
`paresCoabitantes` por igualdade de `rotina[fx]` em dia/noite; (passo 4) crava
`localId = vitima.pacoteEspacial.rotina[faixa]`.

**Consequência: escrever `fora:ashmere` DENTRO de `rotina.dia` é armadilha
tripla** (verificado linha a linha):

1. Dois moradores com a mesma ausência virariam par coabitante "na feira" →
   briga escalada com `localId: 'fora:ashmere'` → cena fora da vila, sem interior,
   violando GE8 e quebrando `gerarMundo(locaisElegiveis)`;
2. A vítima de rotina-dia fora tornaria o satélite local de crime;
3. `saoAdjacentes(cidade, 'fora:x', ...)` devolve false silenciosamente — o
   ausente some do grafo de ouvintes sem registro de por quê.

**Desenho recomendado (cirúrgico, replay intacto):** a ausência NÃO entra em
`rotina`. Entra como campo paralelo do pacote espacial —
`ausencias: [{ faixa: 'dia', destino: 'fora:<sateliteId>', motivo: 'feira'|'frete'|'penhor' }]`
— sorteado em `inserirElenco` para uma fração seedada dos arquétipos elegíveis
(carroceiro sempre — o circuito é o ofício [KB] urbanismo §2; merceeiro/moleiro/
taverneiro com chance — quem compra grosso [KB] vida-cotidiana §5). O motor
continua cego: `rotina` intacta ⇒ `caso.js` byte-idêntico ⇒ nenhum sal existente
tocado (a mesma salvaguarda da E2). Quem LÊ `ausencias` é só a camada de álibi:
`derivarDialogos` (o paradeiro declarado vira "estava na feira de Ashmere") e
`derivarPerifericos`.

**Onde mora a assimetria (o ponto da OS):** hoje `derivarPerifericos`
(`pacote_gerado.js`) dá a todo `inocente_alibi` uma carta `gen_corrobora_<id>` na
localidade `vizinhanca` — corroboração barata, a um clique. Para o suspeito com
`ausencia` na faixa do crime, a carta de corroboração MUDA DE ENDEREÇO: vira
registro no satélite (grupo `comarca_<id>`, 1,5h por trecho) — o assento do toll
[KB] instituições §1, o livro do penhorista [KB] vida-e-habitação §2, o bilhete de
trem [KB] vida-e-habitação §6. Declarar o álibi é grátis; VERIFICÁ-LO custa meio
dia ou um telegrama (§4). GE7 respeitada por construção: a carta é registro
(durável) e é corroboração, nunca essencial — o caso fecha sem a viagem, mas o
Metódico que paga o custo fecha o álibi de vez.

### 3.2 Catálogo do forasteiro v1 (identidades, não arquétipos)

GE8 é taxativa: todos os interrogáveis moram na vila. O forasteiro v1 portanto NÃO
é arquétipo de elenco — é IDENTIDADE de vítima ou de testemunha-registro:

| Identidade | Lastro | Fonte |
|---|---|---|
| **Carreteiro de rota** (*carrier*) | figura do pacote-padrão da vila, circuito semanal à market town — conhecido de todos, de estrada | [KB] urbanismo §2 |
| **Caixeiro-viajante** | o hóspede profissional do hotel comercial; commercial room, praça trocada com colegas — deixa livro de hóspedes por onde passa | [KB] vida-e-habitação §3 |
| **Mascate** (*pedlar/packman*) | vendedor ambulante de porta em porta; a licença de mascate seria um registro durável ideal | [CHUTE] a validar — a KB NÃO o documenta (o pacote-padrão de urbanismo §2 não o lista; o Pedlars Act de 1871 é conhecimento fora da KB); usar só após verificação, ou rebaixar a v2 |
| **Recém-contratado de Michaelmas** | as feiras de contratação (até 10/out) trazem "gente recém-chegada à vila, sem passado local" — dias antes do crime | [KB] vida-cotidiana §5; instituições §1 |
| **Feirante quinzenal** | SEM lastro: a KB dá mercado SEMANAL na town e vila SEM mercado (morfologia §1); "feira quinzenal NA vila" não tem fonte | [CHUTE] não recomendado — substituir pelo dia de mercado semanal da town (o movimento é da vila PARA fora, não o contrário) |

**Recomendação v1:** carreteiro e caixeiro-viajante (ambos 100% [KB]) +
recém-contratado de Michaelmas como tempero sazonal. Mascate e feirante ficam
fora até validação.

### 3.3 A pessoa relevante a distância (o teto de GE8: no máximo 1)

Ela entrega registro/fato e NÃO vira sétimo suspeito — o molde é o procurador
Pettigrew (`mapa.js`: nó de corroboração, sem interrogatório). Candidatas, todas
donas de um livro:

| Figura | Livro que guarda | Fonte |
|---|---|---|
| procurador/solicitor | testamento, escritura, partilha | [KB] urbanismo §9; precedente caso-escola |
| hoteleiro/dona da lodging house | livro de hóspedes (inspecionado pela polícia) | [KB] vida-e-habitação §3 |
| penhorista | livro de penhores datado | [KB] vida-e-habitação §2 |
| telegrafista/agente do correio | livro de telegramas ao minuto | [KB] vida-cotidiana §6; instituições §7 |
| mestre do workhouse | tramp book (nome, origem, destino) | [KB] instituições §6 |

Implementação: a "pessoa" é a PROSA da localidade-satélite (quem abre o livro
diante do perito), nunca entrada em `suspeitos` nem em `dialogos` — o mesmo
tratamento que o caso-escola dá a Pettigrew.

### 3.4 A vítima-forasteiro ("quem era este homem") — cartas duráveis mínimas

Porta de entrada já reservada: o braço 10% da moeda regime-palco (decisão E2
§6.4 — "recai em interno até a E3"). O caso-forasteiro v1: a vítima é hóspede/de
passagem (dorme no pub — a hospedaria que a vila gerada tem; `TIPOS_PREDIO.pub`),
réu e todo o elenco interrogável seguem da vila (réu-forasteiro VETADO na v1).
O eixo novo do caso não é "onde", é "QUEM": a identidade é o que se investiga.

Cartas duráveis que a v1 precisaria (todas registro/documento — GE7):

| Carta | Conteúdo | Fonte do lastro |
|---|---|---|
| `gen_pertences_do_morto` | o bolso: bilhete de trem (de onde veio), carimbo postal numa carta, recibo de penhor — cada peça é um FIO ao satélite de origem | [KB] vida-e-habitação §6 (o rastro documental do forasteiro); vida-cotidiana §6 (carimbo postal como documento) |
| `gen_assento_hospede` | o quarto do pub/da estalagem: nome dado, noite de entrada, quem pagou | [KB] vida-e-habitação §3; o pub-hospedaria da vila é extrapolação do padrão de estalagem [CHUTE leve — o livro formal é da town; na vila, o taverneiro "assenta" informalmente] |
| `gen_registro_no_satelite` | o assento na origem: livro de hóspedes do hotel de Ashmere, ou tramp ward, ou livro do penhorista com o relógio empenhado do morto | [KB] vida-e-habitação §3/§2; instituições §6 |
| `gen_resposta_por_fio` | o telegrama de resposta que crava a identidade (só fato de registro — §4) | [KB] vida-cotidiana §6 |
| `gen_visto_na_estrada` | o carroceiro/portão: quem o viu chegar, por qual boca da vila, a que hora | [KB] urbanismo §5 (stiles e portões como checkpoints); banda de descoberta E2 |

Cadeia de leads: pertences (vila, 0h) → revela nó `comarca_<origem>` → o registro
de origem corrobora identidade e móbil. O caso FECHA sem viajar (a identidade
essencial sai dos pertences + resposta por fio); a viagem é o atalho do Metódico
— GE7 e a filosofia de `mapa.js` ("ir longe é um ATALHO opcional, jamais
obrigatório") preservadas literalmente.

---

## 4. TELEGRAMA (§4.6)

### 4.1 O que a KB sustenta

| Afirmação | Fonte |
|---|---|
| Telégrafo "no correio maior ou na estação ferroviária"; telegrama é caro, público (o telegrafista lê tudo) e DATADO AO MINUTO — "âncora e vazamento a um só tempo" | [KB] vida-cotidiana §6 |
| Nacionalizado no Post Office desde 1870; em 1893 a agência da town telegrafa — e a estação também (o telégrafo da companhia): "duas portas de saída para uma mensagem urgente" | [KB] instituições §7 |
| A sub-post office da vila funciona NA LOJA — correio, não telégrafo; a vila sem estação NÃO tem fio | [KB] vida-cotidiana §6; urbanismo §2 (correio embutido na loja) |
| Carta postada de manhã chega à cidade vizinha no mesmo dia (o piso de comparação: o fio só vale o preço se for mais rápido que isso) | [KB] vida-cotidiana §6 |

### 4.2 Pontos de fio na vila gerada

- **Seed COM estação (~metade, `espaco.js`):** o fio existe na vila — balcão do
  telégrafo da companhia [KB] instituições §7. Consulta parte da própria vila.
- **Seed SEM estação:** não há fio na vila [KB acima]. A consulta exige portador
  até a agência da vila-mercado (1,5h de estrada) OU pelo delegado, que manda o
  próprio recado na ronda [CHUTE de mecânica]. O telegrama continua possível,
  só mais lento — a assimetria vira textura de seed, não buraco.

### 4.3 Latência [CHUTE calibrável]

A transmissão é minutos; a latência real é humana — alguém na outra ponta precisa
ABRIR o livro e redigir a resposta [CHUTE apoiado em instituições §7, o operador
como pessoa única]:

| Situação | Latência proposta (pedir → resposta em mãos) |
|---|---|
| Vila com estação → agência da town | **2h** |
| Vila sem estação (portador à town, resposta pelo mesmo caminho) | **4h** |
| Consulta a registro no ENTRONCAMENTO (fio direto de companhia) | **1,5h** |

Regra de bolso: telegrama ≈ metade do custo da viagem correspondente ida e volta,
nunca menos de 1,5h — a viagem continua tendo razão de existir (ver o corpo do
livro com os próprios olhos = a carta de registro completa; o fio entrega só o
FATO). Teto diegético: consulta pedida depois das ~18h só responde de manhã (a
agência fecha) [CHUTE; coerente com vida-cotidiana §1].

### 4.4 O catálogo do CONSULTÁVEL por fio — lista fechada v1

Só fatos de REGISTRO (quem consulta pergunta a um livro, não a uma pessoa):

| # | Consulta | Livro de origem | Fonte |
|---|---|---|---|
| 1 | `assento_de_hospede` — "consta N. hospedado aí? que noites?" | livro de hóspedes do hotel; livro da lodging house (inspecionado pela polícia) | [KB] vida-e-habitação §3 |
| 2 | `assento_de_penhor` — "consta penhor em nome de N.? que peça, que data?" | livro do penhorista | [KB] vida-e-habitação §2 |
| 3 | `antecedente_na_comarca` — "consta N. perante os magistrados?" | registro das petty sessions / Police Court Report do semanário | [KB] instituições §4; vida-e-habitação §4 |
| 4 | `assento_do_tramp_ward` — "passou andarilho com esse nome? de onde, para onde?" | tramp book do workhouse da união | [KB] instituições §6 |

Fora da v1 (registrar): protesto de dívida no county court (existe [KB]
instituições §4, mas duplica o móbil de dívida que a delegacia já entrega — risco
de redundância); livro de venenos do químico da town (fortíssimo [KB]
vida-cotidiana §4, mas interage com o equilíbrio do método veneno — só com
parecer do perito-forense); consulta de identidade "descreva o homem" (NÃO é fato
de registro — é testemunho por fio; vetar por princípio).

**Contrato de forma:** a resposta chega como CARTA de suporte `registro`
(linhagem de `gen_motivo`/`suporteFisico: 'registro'`), com o minuto no carimbo
("Resposta de Ashmere, 14h22") [KB] vida-cotidiana §6 — datada ao minuto, e
PÚBLICA: o telegrafista leu [KB] idem — gancho de interferência gratuito para
OS futura (a consulta que vaza), registrado, não implementado.

---

## 5. RECOMENDAÇÕES PARA [DECISÃO]

**(a) Quantos e quais satélites por seed.** Pool v1 = 3 tipos: `vila_mercado`
(SEMPRE — a KB obriga: toda vila orbita uma town a 4–8 milhas, urbanismo §6),
`granja_isolada` (SEMPRE — o satélite barato/mudo, 0,5h), `entroncamento`
(condicional à seed com estação), + segunda `granja_isolada`/hamlet opcional
(moeda por seed). Composição resultante: 2–4 sem sorteio forçado; ids/nomes de
pool disjunto de `NOMES_DE_VILA` (§1.1e, §1.2e, §1.3e). Interior LOD: quando o
caso pede interior de satélite (raro), é UM prédio da vila-mercado (o hotel ou o
gabinete — os dois têm partição análoga a tipos já existentes em `espaco.js`).

**(b) Z% da GE9.** Recomendo **Z = 40%** [CHUTE calibrável], sal
`seed|caso|comarca-corroborativa` pela via decorrelacionada `hashDecisao` (o
contrato da E0 §4). Justificativa anti-tell nas duas direções: acima de ~60% de
seeds com satélite "quente", aprende-se "há satélite no lead ⇒ o segredo mora
lá" (o tell que a GE9 quer matar); abaixo de ~30%, aprende-se o tell inverso
("viajar nunca paga") e a comarca vira cenografia morta. 40% alinha com o
precedente Y=40% da GE5 (decisão E2 §6.4) e deixa a célula rara auditável no
Monte Carlo da E4 — mesma liturgia.

**(c) Telegrama: aprovar na v1 — SIM, em escopo mínimo.** Catálogo fechado de 4
consultas (§4.4), latência 2h/4h/1,5h (§4.3), resposta como carta de registro
datada ao minuto. Razão: é o mecanismo que mantém GE7 honesta SEM inflar o mapa —
o fato distante alcançável sem meio dia de estrada, pela metade do custo, com o
sabor de época inteiro ([KB] vida-cotidiana §6 dá a mecânica pronta: caro,
público, ao minuto). O que fica de fora da v1: vazamento da consulta
(interferência), consulta noturna, protesto de dívida e livro de venenos.

**(d) Estrada-cena: NÃO na v1 — só meio.** Fundamento em §2.3: sem via de chegada
da vítima que não seja mecânica nova, célula combinatória extra sob a vigilância
da E0 §4, e a E3 já é a maior fase da OS. A partição corredor (§2.2) e a mobília
([KB] §2.1) ficam catalogadas; ativação natural na v2 junto com o caso
"corpo na estrada" da vítima-forasteiro. Porteira de pedágio ATIVA: bloquear
(§2.1, [CHUTE historiográfico a validar]); casa de pedágio desativada: liberada
como mobília.

**(e) Forasteiro v1: vítima-forasteiro SIM; testemunha-forasteiro SÓ como
pessoa-registro; réu-forasteiro vetado (ordem da OS).** Mecanismos: (i) a
vítima-forasteiro entra pelo braço 10% da moeda regime-palco já reservado
(decisão E2 §6.4), com fallback interno quando a seed não hospeda; identidades do
catálogo §3.2 (carreteiro, caixeiro-viajante, recém-contratado de Michaelmas);
cartas duráveis de §3.4; (ii) a testemunha a distância é o guardião de livro de
§3.3 — prosa de localidade, jamais entrada em `suspeitos`/`dialogos` (GE8: máx.
1, entrega registro, não vira sétimo suspeito); (iii) a banda `fora:<satelite>`
implementada como `ausencias` paralela à rotina (§3.1) — motor cego, replay
byte-idêntico, e a corroboração do ausente muda de endereço para o satélite: a
verificação assimétrica nasce do custo do mapa, não de regra nova.

— fim do dossiê E3 —

## Decisões do autor (18/07/2026) — lavradas

1. **Satélites v1:** os 3 tipos do dossiê — vila-mercado (sempre, 1,5h/trecho),
   granja isolada (sempre, 0,5h), entroncamento (só com estação, 1h por trilho).
2. **Telegrama:** aprovado para a v1 — latências 2h (estação da vila), 4h (sem
   fio na vila), 1,5h (entroncamento); catálogo fechado de 4 consultas (assento
   de hóspede, penhor, antecedente em petty sessions, tramp ward).
3. **GE9:** Z = 40% (banda de guarda 30–50%); **estrada = só meio na v1**
   (cena-estrada casa com o corpo do forasteiro, v2).
4. **Forasteiro/assimetria:** tudo conforme o dossiê — `ausencias` como campo
   paralelo (rotina intacta, motor cego); vítima-forasteiro pelo braço de 10%
   da moeda de palco (carreteiro/caixeiro-viajante; mascate vetado por falta de
   lastro); testemunha a distância = guardião de livro, nunca em `suspeitos`;
   réu-forasteiro segue vetado.
