# DOSSIÊ DE PESQUISA — E2 da OS "Palco em anéis" (§3.1 e §3.4a)

> Fase E2: logradouros (cenas externas na vila, Inglaterra rural, 1893) como
> pseudo-interiores no schema `{grid, comodos ("cantos"), mobilia}` + campo novo
> `saidas` (2–4 células de borda). Data: 18/07/2026. **Nada do repositório foi
> editado** — este arquivo vive no scratchpad da sessão.

## 0. Método e regra de proveniência

- **Fontes lidas na íntegra:** `docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md`,
  `arquitetura-e-espacos.md`, `arquitetura-em-detalhe.md`, `vida-cotidiana.md`,
  `economia-e-estrutura-social.md`; `docs/kb-medicina-legal/inquerito-e-policia.md`,
  `tanatologia.md`; trechos dirigidos de `asfixias.md` e `traumas.md`. Código:
  `src/gerador/cidade.js`, `espaco.js`, `interiores.js`, `metodos.js`, `caso.js`,
  `insercao.js`, `arquetipos.js`.
- **Verificado e posto de lado:** `centros-urbanos-*.md` regem a **market town**,
  não a vila (bairro da estação, cemitério de *burial board* etc. são fenômenos
  urbanos — na vila de 1893 o adro paroquial segue ativo; os Burial Acts de
  1852–53 fecharam adros **urbanos** lotados, `centros-urbanos-instituicoes.md`
  §"Cemitério"). Nenhum dado de vila novo ali.
- **Regra de proveniência (a mesma de `espaco.js`/`arquetipos.js`):** cada linha
  distingue **[KB]** (fonte em arquivo § seção) de **[CHUTE]** (chute calibrável de
  design, refinável sem tocar sistema). Dimensões de grid são SEMPRE [CHUTE]
  calibrado pela régua da KB, como já são as silhuetas de `espaco.js`.
- **Ressalva sobre a OS:** o texto integral da OS "Palco em anéis" **não está no
  repositório** — só o entregável E0 (`docs/os-palco-em-aneis-e0-triagem.md`), que
  cita §3.4, §3.5, §3.6 e as bandas 70/20/10. Referências a §3.x e à GE5 abaixo
  seguem o enunciado desta tarefa; onde o teor exato da GE5 importa (§5), o dossiê
  o declara e condiciona a recomendação.

### O contrato técnico que este dossiê assume (verificado no código)

| Fato do código | Onde | Consequência para E2 |
|---|---|---|
| Interior = `{grid{colunas,filas}, comodos[{id,rotulo,tipoComodo,ret}], mobilia[{item,rotulo,comodo,celula}], planta}` | `interiores.js` (`gerarInterior`) | O logradouro entra IDÊNTICO + `saidas: [{col,fila}]` (2–4 células de borda); a planta SVG deriva 1:1, sem código novo de projeção |
| Local do crime = `vitima.pacoteEspacial.rotina[faixa]`; faixas dia/noite/madrugada; noite é o único grau de liberdade (2/3 frequentado, 1/3 casa) | `caso.js` passo 4; `insercao.js` §4 | Vítima só morre num logradouro se (a) uma banda de rotina apontar para ele (§3.4a) ou (b) um chamariz a levar (§3.4b) |
| Âncora espacial: `ancorasDisponiveis` = Set montado da mobília (`hoje só cocho_dagua ⇒ 'agua'`) | `caso.js` linhas 212–215 | Âncoras novas = novas peças de mobília numa lista de itens-âncora; zero mudança de motor |
| Métodos e elegibilidade (`exigeAncora`, `exigePremeditacao`, `intMinima`) | `metodos.js` (`metodosElegiveis`) | Auditoria da §2 abaixo é executável contra esse filtro |
| Adjacência da cidade: pares de lotes a ≤ 1,9 unidades (`LIMIAR_ADJACENCIA`) | `cidade.js` | Logradouro = LOTE novo no `TRACADO`, com posição calculada para as adjacências desejadas (distâncias conferidas abaixo) |
| Chegada do perito fixa às 11h (`HORAS_CHEGADA = 11`) | `ponte_caso.js` (auditado na E0, D-6) | A §4 propõe substituí-la por descoberta + deslocamento |

---

## 1. CATÁLOGO DE TIPOS DE LOGRADOURO

Candidatos da OS: adro/cemitério da igreja; pátio da granja; travessa dos fundos da
High Street; caminho do moinho/açude; plataforma da estação (só em seeds com
estação — `espaco.js`: `estacao.opcional: true`, presente em ~metade das seeds,
`cidade.js` linha 133).

### 1.1 O adro da igreja (`adro_da_igreja`)

**(a) Verossimilhança e morfologia**

| Afirmação | Fonte |
|---|---|
| O adro murado é "o único recinto público murado e sempre aberto da vila", com *lychgate* e atalhos legais (*churchways*) que o atravessam | [KB] `urbanismo-e-morfologia.md` §8 |
| *Lychgate* (portão dos mortos): portal coberto de carvalho, bancos laterais, pedra/cavaletes ao centro; o caixão espera ali o pároco | [KB] `arquitetura-em-detalhe.md` §7 |
| Lápides: sepulturas leste-oeste; o **lado norte é historicamente evitado** (suicidas, não batizados); os ricos junto ao caminho sul | [KB] `arquitetura-em-detalhe.md` §7 |
| Teixos, muitas vezes mais velhos que a igreja; tóxicos (motivo do muro contra o gado) | [KB] `arquitetura-em-detalhe.md` §7 — uso MECÂNICO como veneno vetado sem validação do perito forense (nota do próprio arquivo) |
| Lajões (*flagstones*) no adro — dos poucos trechos calçados da vila | [KB] `urbanismo-e-morfologia.md` §4 |
| Igreja no ponto mais antigo; adro é palco de sociabilidade dominical e "terminal da fofoca" junto com o pub | [KB] `urbanismo-e-morfologia.md` §2; `vida-cotidiana.md` §6 |

**(b) Partição em cantos** — grid 7×5 [CHUTE, calibrado pela convenção de
`interiores.js`: fila 0 = fundo, última fila = frente/caminho; célula de logradouro
representa ~3–5 m, escala maior que a doméstica — decisão de design a registrar no
cabeçalho do módulo]:

| Canto | `ret` | Leitura |
|---|---|---|
| `lychgate` (O portão coberto) | col 2, fila 4, 3×1 | a boca do adro; bancos [KB §7] |
| `alameda` (O caminho das lajes) | col 2, fila 0, 3×4 | o *churchway* que atravessa [KB urbanismo §8] |
| `quadra_sul` (As lápides do caminho) | col 0, fila 0, 2×5 | os enterros "de respeito" [KB §7] |
| `fundo_norte` (O fundo evitado) | col 5, fila 0, 2×5 | mato, teixo, as covas sem nome [KB §7] |

`saidas`: {col 3, fila 4} (lychgate) e {col 6, fila 0} (o portão do *churchway* que
segue ao campo) — 2 saídas; a travessia legal do adro dá as duas de graça [KB
urbanismo §8].

**(c) Pool de mobília** (vocabulário fechado novo, `MOBILIA_DE_LOGRADOURO`):

| Peça | Cantos | Fonte |
|---|---|---|
| lápides enfileiradas | quadra_sul | [KB] arquitetura-em-detalhe §7 |
| lápide tombada no mato | fundo_norte | [CHUTE] derivado de §7 (lado evitado) + urbanismo §8 (cerca quebrada = decadência) |
| teixo velho | fundo_norte | [KB] arquitetura-em-detalhe §7 |
| banco do lychgate | lychgate | [KB] arquitetura-em-detalhe §7 |
| pedra dos caixões | lychgate | [KB] arquitetura-em-detalhe §7 ("pedra ou cavaletes ao centro") |
| muro baixo de pedra | perímetro (qualquer canto de borda) | [KB] urbanismo §8 (adro murado) |
| cova recém-aberta com pá | quadra_sul | [CHUTE] plausível por §7 (adro de vila ativo); forte âncora de vestígio (terra revirada) |

**(d) Posição no traçado** — lote novo no quarteirão `adro` (que já existe em
`cidade.js`, `ROTULOS_QUARTEIRAO.adro`): proposta `{quarteirao: 'adro', tipo:
'adro_da_igreja', x: -4.3, z: -0.6}`. Adjacências resultantes (limiar 1,9):
igreja (dist ≈ 1,08 ✓), vicarage (≈ 0,98 ✓), solar (≈ 1,72 ✓), capela (≈ 2,38 ✗).
Ouvintes plausíveis: pároco no presbitério e a criadagem do solar — grafo de
avistamentos rico sem saturar. [KB] posição: urbanismo §2 (igreja + presbitério
juntos; pub "defronte à igreja" ficou longe demais no traçado atual — aceitável).

**(e) Quem frequenta e quando**

| Faixa | Quem | Fonte |
|---|---|---|
| Dia | pároco (trabalho = igreja); enterros; fofoca à porta | [KB] `arquetipos.js` paroco.pacoteEspacial; vida-cotidiana §6 |
| Domingo (denso) | a vila inteira, *matins* e *evensong*; quem falta é notado | [KB] vida-cotidiana §7 |
| Noite | deserto — e **evitado** (superstição do lado norte); só o sineiro/sacristão sobe à torre | [KB] arquitetura-em-detalhe §7; a figura do sacristão NÃO existe como arquétipo (lacuna anotada em §3) |
| Madrugada | ninguém — o palco do encontro que não quer testemunha | [CHUTE] inferência direta de tudo acima |

### 1.2 O pátio da granja (`patio_da_granja`)

**(a) Verossimilhança e morfologia**

| Afirmação | Fonte |
|---|---|
| Quintais ativos da granja: poço, celeiro, privada externa | [KB] arquitetura-e-espacos §6 (já citado pela proveniência de `espaco.js`/granja) |
| Monturo junto de quase toda porta; poço doméstico com tampa (15–60 pés) "perigosamente perto das fossas" | [KB] urbanismo §4; arquitetura-em-detalhe §5 |
| Chiqueiro: quase todo cottage/granja engorda um porco; **em outubro de 1893 o porco está gordo e a matança é iminente — facas afiadas, cordas e um evento doméstico sangrento no calendário** | [KB] arquitetura-em-detalhe §5 |
| Outubro no campo: arar, estercar, semear; **debulha nos celeiros em dia de chuva**; terra recém-mexida (clamp de batata) é NORMAL — "álibi perfeito para cavador noturno" | [KB] vida-cotidiana §5; arquitetura-em-detalhe §5 |
| O lavrador trabalha das 6h ao cair da luz (~17h–18h30 em outubro) | [KB] vida-cotidiana §1 e §8 |

**(b) Partição** — grid 7×5 [CHUTE]:

| Canto | `ret` | Leitura |
|---|---|---|
| `terreiro` (O terreiro batido) | col 0, fila 2, 5×3 | o chão de trabalho, rodados de carroça |
| `alpendre_do_feno` (O alpendre) | col 0, fila 0, 3×2 | feno, ferramentas, as cordas da matança |
| `canto_do_poco` (O poço e o cocho) | col 3, fila 0, 2×2 | a água do pátio |
| `chiqueiro` (O chiqueiro e o monturo) | col 5, fila 0, 2×5 | o porco de outubro; o monturo |

`saidas`: {col 2, fila 4} (o portão da estrada), {col 0, fila 2} (a cancela do
campo), {col 6, fila 4} (o vão do chiqueiro para a horta) — 3.

**(c) Pool de mobília**

| Peça | Cantos | Fonte |
|---|---|---|
| carroça desatrelada | terreiro | [KB] urbanismo §2 (carroceiro no pacote-padrão) e §3 (rodas de carroça na lagoa) |
| meda/feno empilhado | alpendre_do_feno | [CHUTE] leve — palheiro é canônico no pátio de estalagem (arquitetura-e-espacos §5); extensão à granja é inferência |
| forcado e ferramentas de lavoura | alpendre_do_feno | [KB] `espaco.js` MOBILIA_DE_OFICIO.paiol (peça já existente, reusável) |
| poço com tampa de madeira | canto_do_poco | [KB] arquitetura-em-detalhe §5 |
| cocho de gado | canto_do_poco | [CHUTE] leve — cocho documentado junto de pub/bomba (urbanismo §3) e na forja (espaco.js); gado da granja pede cocho |
| chiqueiro com o porco gordo | chiqueiro | [KB] arquitetura-em-detalhe §5 |
| monturo | chiqueiro | [KB] urbanismo §4 |
| clamp de batata (terra fresca) | terreiro | [KB] arquitetura-em-detalhe §5 |

**(d) Posição** — `{quarteirao: 'orla', tipo: 'patio_da_granja', x: 4.0, z: 0.9}`.
Adjacências: granja (≈ 0,67 ✓), estação quando existe (≈ 1,61 ✓), os últimos
cottages da ruela (o de x≈3,9/z≈1,8 dista ≈ 0,9 ✓); moinho ✗, escola ✗. O pátio
gruda na granja e na ponta pobre da ruela — exatamente quem o frequenta.

**(e) Quem frequenta e quando** — dia: lavradores, pastor, moço de lavoura,
o fazendeiro (6h–18h; pico de gente, crime diurno = briga de trabalho, coerente
com `horaDaFaixa` 12h–14h de `caso.js`); noite: quase vazio (o lavrador está no
pub ou em casa — vida-cotidiana §1); madrugada: ninguém, mas a matança iminente
normaliza faca e sangue num quintal [KB] arquitetura-em-detalhe §5, "Implicações".

### 1.3 O caminho do moinho e o açude (`caminho_do_acude`)

**(a) Verossimilhança e morfologia**

| Afirmação | Fonte |
|---|---|
| Moinho d'água com açude e levada (*leat*): **ruído constante de água e mó** na borda d'água | [KB] urbanismo §7 |
| A rede de *footpaths* é o "segundo grafo" da vila — toda rota de crime plausível o prefere; *stiles* e portões são os checkpoints onde alguém sentado vê quem passa | [KB] urbanismo §5 |
| Marcos miliários e *fingerposts* na rede de caminhos | [KB] urbanismo §3 |
| O moinho é o volume mais alto fora a igreja; a casa do moleiro é anexa ao ofício | [KB] `espaco.js` moinho (arquitetura-e-espacos §1) |

**(b) Partição** — grid 8×4, morfologia LINEAR (o único palco-corredor) [CHUTE]:

| Canto | `ret` | Leitura |
|---|---|---|
| `vereda` (A vereda entre sebes) | col 0, fila 2, 8×2 | o caminho de barro; pegadas de outubro conservam-se [KB vida-cotidiana §8] |
| `margem` (A margem de junco) | col 0, fila 0, 6×2 | a beira d'água — a âncora 'agua' |
| `comporta` (A comporta do açude) | col 6, fila 0, 2×2 | a engrenagem do moleiro |

`saidas`: {col 0, fila 3} e {col 7, fila 3} — o caminho continua nos dois sentidos
(morfologia de corredor: fugir é escolher direção); opcional {col 0, fila 2} como
*stile* para o campo. 2–3.

**(c) Pool de mobília**

| Peça | Cantos | Fonte |
|---|---|---|
| açude/represa (lâmina d'água) | margem | [KB] urbanismo §7 — **item-âncora 'agua'** (ver §2) |
| comporta com engrenagem | comporta | [KB] urbanismo §7 (açude e levada) |
| pranchão de travessia | margem | [CHUTE] inferência da levada |
| *stile* (degraus na cerca) | vereda | [KB] urbanismo §5 |
| fingerpost | vereda | [KB] urbanismo §3 |
| sacas esquecidas do moinho | comporta | [CHUTE] leve — sacas são mobília canônica do moinho (`espaco.js` piso_do_moinho) |
| sebe grossa e sinuosa (limite antigo) | vereda (borda) | [KB] urbanismo §8 |

**(d) Posição** — `{quarteirao: 'orla', tipo: 'caminho_do_acude', x: 4.6, z: -1.6}`.
Adjacências: SÓ o moinho (≈ 0,76 ✓; granja ≈ 2,2 ✗, estação ✗, escola ✗).
**Nota de design:** é o palco mais surdo da vila — um único ouvinte possível
(o moleiro), e o ruído constante da água [KB urbanismo §7] justifica narrativamente
até esse ouvinte não ouvir. Combinação deliberada: o palco do crime "seguro".

**(e) Quem frequenta e quando** — dia: moleiro e freguês do grão; passantes do
*footpath*; noite: o moleiro fecha a comporta [CHUTE — a KB não dá o horário do
moleiro; banda de rotina proposta em §3]; madrugada: ninguém. O ruído d'água
mascara grito e debate na água [KB] `asfixias.md` §"Afogamento" ("ruído médio, mas
ao ar livre" — aqui, abafado pela levada: nota a validar com o perito-forense).

### 1.4 A travessa dos fundos da High Street (`travessa_dos_fundos`) — candidata v2

**(a)** A KB é fortíssima: *back lanes* correm atrás da fita de lotes, "o acesso de
serviço — **todo prédio da rua principal tem duas portas: a pública na rua e a
discreta na viela**" [KB urbanismo §2]; é o grafo discreto por excelência [§5];
piso de terra e barro, iluminação ZERO [§4]; a porta dos fundos é menos vigiada e
menos trancada [KB arquitetura-e-espacos §5]; coleta noturna de dejetos pelo
*night soil man* [§6]; encontros furtivos de criada na porta dos fundos ("no
followers") [KB vida-cotidiana §7]; escotilha da adega do pub no pátio lateral
[KB arquitetura-em-detalhe §8].

**(b)** Grid 8×3 linear [CHUTE]: `viela` (8×1, fila 1), `fundos_do_pub` (col 0,
fila 0, 3×1 — barris, escotilha), `quintais` (col 3, fila 0, 5×1 — varais, monturos,
privadas). `saidas`: as duas bocas da viela {col 0, fila 2} e {col 7, fila 2}.

**(c)** Mobília: barris vazios e escotilha da adega [KB arq-em-detalhe §8], monturo
[KB urbanismo §4], varal e tina [KB vida-cotidiana §4 — a segunda de lavar], privada
externa [KB arquitetura-e-espacos §6], carvoeira/*coal hole* [idem].

**(d)** Posição: entre High Street sul e a ruela — `{x: -0.5, z: 1.1}`; adjacente a
pub (≈ 1,56 ✓), casa do médico (≈ 0,63 ✓), forja (≈ 1,71 ✓) e 2–3 cottages ✓.
**Problema:** satura o grafo de avistamentos (5–7 adjacências) — o contrário do
que a viela significa. Exigiria ou posição mais excêntrica ou regra especial.

**(e)** Manhã: entregas e serviço; 22h: a saída do pub [KB vida-cotidiana §1];
noite: night soil man, casais furtivos [§6–7]. **Recomendação: v2** — riquíssima,
mas a geometria "entre prédios" briga com o modelo de lote discreto e o custo de
adjacência é o maior dos cinco.

### 1.5 A plataforma da estação (`plataforma_da_estacao`) — candidata v3

**(a)** Estação rural: bloco térreo padronizado, plataforma, beiral fundo [KB
arquitetura-e-espacos §1]; fica 0,5–1,5 milha FORA do núcleo, com a "Station Road"
— "o trecho mais moderno e menos vigiado da vila" [KB urbanismo §6]; telégrafo na
estação, telegrama datado ao minuto [KB vida-cotidiana §6].

**(b)** Grid 8×3 [CHUTE]: `plataforma` (8×1), `beiral` (junto ao prédio, 8×1),
`via` (8×1 — borda proibida/perigosa). `saidas`: rampa da Station Road + fim da
plataforma.

**(c)** Mobília: banco de espera, relógio de estação [KB — já existem em
`espaco.js` MOBILIA_DE_OFICIO.espera], lampião a óleo da companhia [CHUTE leve —
estação é dos poucos pontos com luz], carrinho de bagagem [CHUTE], caixa do
telégrafo [KB vida-cotidiana §6].

**(d)** Já existe o lote `estacao` (5.4, 1.7) — o logradouro grudaria nele
(adjacente à estação e ao pátio da granja proposto). A KB pede posição EXCÊNTRICA
(urbanismo §6, "Implicações") — o traçado atual já a põe na ponta.

**(e)** Só nos horários de trem (4–5 chegadas/dia numa town — `centros-urbanos-
morfologia.md` §"sons"; para vila, menos); deserta no resto. **Recomendação: v3**
— só existe em ~metade das seeds (`espaco.js` opcional) ⇒ célula rara do produto
regime-palco × presença-de-estação; a E0 §4 manda vigiar exatamente esse tipo de
célula contra degenerescência. Não antes do Monte Carlo da E4.

### 1.6 Recomendação de teto v1

**Teto v1 = 3 tipos: `adro_da_igreja`, `patio_da_granja`, `caminho_do_acude`.**

Justificativa (variedade por custo):
1. **Três quarteirões distintos** (adro no poente; orla nascente em dois lotes) —
   o palco externo não vira sinônimo de um canto do mapa.
2. **Três assinaturas de método** (§2): adro = ligadura/lâmina no recinto murado;
   granja = lâmina "da matança" + contuso de ferramenta + água do poço/cocho;
   açude = o ÚNICO afogamento em água corrente — hoje afogamento é quase-invariante
   da forja (só `cocho_dagua` ativa 'agua', `caso.js:215`), e o açude quebra isso.
3. **Três rotinas distintas** (§3): clero/domingo; o degrau demográfico mais pesado
   do elenco (lavrador+pastor+moço, freq. 10+2+7); o moleiro solitário.
4. Travessa (v2) e plataforma (v3) ficam catalogadas acima com partição e pool
   prontos — custo de ativação futura é só dado.

---

## 2. AUDITORIA MÉTODOS × ÂNCORAS (§3.3)

Base: `metodosElegiveis(cenario, INT, ancorasDisponiveis)` em `metodos.js` —
filtra por `exigePremeditacao` (briga escalada), `intMinima` e `exigeAncora`.
Famílias: **lâmina** (laminada), **asfixia** (garrote, esganadura, sufocacao),
**contuso** (contundente), **afogamento**, **veneno** (arsenico, laudano).

| Método | Exigência | adro | granja | açude | travessa (v2) | plataforma (v3) |
|---|---|---|---|---|---|---|
| laminada | — | ✓ | ✓ (a faca da matança à mão — arq-em-detalhe §5) | ✓ | ✓ | ✓ |
| garrote | premeditado, INT≥2 | ✓ (emboscada no recinto murado) | ✓ | ✓ | ✓ (a emboscada clássica da viela) | ✓ |
| esganadura | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| contundente | — | ✓ (lápide/pedra como arma de ocasião) | ✓ (ferramenta de lavoura) | ✓ | ✓ | ✓ |
| sufocacao | — | ✓ | ✓ (o feno/pano) | ✓ | ✓ | ✓ |
| afogamento | âncora 'agua' | ✗ | **✓ se poço/cocho virarem itens-âncora** | **✓ (açude)** | ✗ | ✗ |
| veneno_arsenico / laudano | premeditado, INT alto | (✓ por código) | (✓) | (✓) | (✓) | (✓) |

**Conclusões:**
- **Meta "≥ 2 famílias por tipo" é batida com folga em todos** — "cena externa ⇒
  contuso" não vira invariante. O risco real é o inverso: tudo elegível em toda
  parte ⇒ o palco não assina nada. O que diferencia é a **âncora + o instrumento
  contextual** (abaixo).
- **Venenos ao ar livre:** o código os permite (sem âncora), e é DEFENSÁVEL — o
  veneno é administrado antes e a vítima "cai onde a rotina a põe"; arsênico e
  láudano agem em horas, o colapso no caminho é clínico e plausível. **Validar a
  janela de ação com o perito-forense (`venenos.md`) antes de ativar**; se validar,
  é o melhor antídoto contra "externa ⇒ morte violenta".

**Âncoras novas propostas:**

| Âncora | Como nasce | Fonte | Veredicto |
|---|---|---|---|
| `'agua'` generalizada | trocar o teste literal `item === 'cocho_dagua'` (`caso.js:215`) por lista `ITENS_COM_AGUA = ['cocho_dagua', 'acude', 'poco']` | [KB] `asfixias.md`: afogamento = "asfixia por submersão em **meio líquido**" — qualquer lâmina d'água serve; poço: a queda/cabeça no poço é submersão | **v1 — a única âncora nova necessária** |
| `'altura'` (precipitação) | via/borda da plataforma; escada do moinho | [KB] `traumas.md` §"Dossiê de método — precipitação": método completo já documentado, mas "exige escada ou altura representável — a exigência que a geração espacial não modela hoje (grids de um só piso)" | **v2+** — método `precipitacao` nem existe em `metodos.js`; abrir junto com plataforma/escadas |
| `'corda'` no adro (a corda do sino) | mobília da torre | [KB] `asfixias.md` §Enforcamento: a dúvida honesta de 1893 é o "cadáver suspenso após a morte para simular" — enforcamento NÃO é método do catálogo; a corda serviria a ENCENAÇÃO, não a método | **Não criar âncora** — registrar como candidato futuro de encenação (`encenacao.md`), fora do escopo E2 |

**Instrumento contextual (recomendação lateral, custo zero de motor):** o vestígio
de instrumento (`instrumento: 'arma_de_ocasiao'`) pode ser rotulado pelo palco na
PONTE (a lápide lascada, o forcado, o malho da comporta) — camada narrativa, tags
intactas, na linhagem da regra "camada narrativa ≠ camada lógica" do CLAUDE.md.

---

## 3. ROTINA EXTERNA (§3.4a) — bandas de logradouro para arquétipos EXISTENTES

Mecânica assumida: `insercao.js` resolve `rotina = {dia, noite, madrugada}`; a
banda externa entraria como **resolução alternativa de uma faixa** (fração seedada)
apontando o id do logradouro adjacente ao trabalho/moradia. Madrugada permanece
SEMPRE moradia (ninguém "mora" num logradouro — invariante são).

| Arquétipo | Banda proposta | Plausibilidade histórica | Fonte | v1? |
|---|---|---|---|---|
| moleiro | fim de dia/noite → `caminho_do_acude` (fechar a comporta, vistoriar a levada) | o açude é o ofício; a casa é anexa ao moinho | [KB] urbanismo §7 (açude e levada); `espaco.js` moinho | **SIM** |
| lavrador | dia → `patio_da_granja` (fração da faixa dia; o resto segue no prédio granja) | 6h–18h no campo/pátio; outubro = debulha no celeiro, trato do porco | [KB] vida-cotidiana §1, §5; arq-em-detalhe §5 | **SIM** |
| pastor_de_ovelhas | dia → `patio_da_granja` | mesma economia da granja; "categoria superior do trabalho agrícola" | [KB] `arquetipos.js` (demografia §3) | **SIM** (herda a mesma banda do lavrador — custo zero) |
| criada (variante moço de lavoura) | dia → `patio_da_granja` quando a casa servida é a granja | o serviço de fora é do moço | [CHUTE] leve sobre vida-cotidiana §1 | opcional |
| paroco | dia → `adro_da_igreja` (fração; enterros, o caminho ao presbitério) | trabalho = igreja; o adro é a antessala | [KB] `arquetipos.js` paroco; arq-em-detalhe §7 | **SIM** |
| guarda_caca | noite → logradouro de borda (ronda contra caça furtiva) | o ofício é o bosque; isolamento noturno documentado | [KB] `arquetipos.js` guarda_caca (dossiê F1 §2.1) | v2 — pede logradouro de mata que não existe; NÃO forçar no açude |
| constable | noite → ronda (beat) por logradouros | "patrulhava a pé um beat extenso" | [KB] `inquerito-e-policia.md` §2 | v2 — melhor como TESTEMUNHA móvel do que como banda fixa; mexe no grafo de avistamentos |
| carroceiro | dia → `travessa_dos_fundos` (entregas de serviço) | toda loja recebe pela porta discreta | [KB] urbanismo §2 | junto com a travessa (v2) |
| taverneiro | manhã → fundos do pub (barris, escotilha) | o *cellarman* desce diariamente | [KB] arq-em-detalhe §8 | junto com a travessa (v2) |

**Lacuna anotada (não é E2):** o exemplo "sacristão→adro" da OS pede um arquétipo
que NÃO existe em `arquetipos.js`. A KB o sustenta com sobras (sacristão dá corda
ao relógio, acesso rotineiro e SOLITÁRIO à torre — urbanismo §7, arq-em-detalhe
§7), mas arquétipo novo é escopo da OS de priors, não desta. Registrar para
[DECISÃO] futura.

**Ativar na v1: moleiro, lavrador, pastor_de_ovelhas, paroco** (4 arquétipos, 3
logradouros — cada tipo v1 com ao menos um frequentador nativo; a vítima pode
morrer lá por rotina, e o assassino pode sabê-la lá pelo mesmo grafo).

---

## 4. DESCOBERTA DO CORPO (§3.5) — bandas de hora por tipo de palco

O que a KB sustenta:

| Fato | Fonte |
|---|---|
| Criada levanta 5h–6h e acende o fogão; lavrador caminha ao campo às 5h–6h; comerciante "levanta; abre a loja cedo" 6h–6h30; carteiro entrega **antes das 8h** | [KB] vida-cotidiana §1 e §6 |
| Nascer do sol em outubro: 6h04 (dia 1º) a 6h56 (dia 31); antes disso anda-se de lanterna — o transeunte madrugador pode PASSAR sem ver | [KB] arquitetura-e-espacos §4 (tabela de efemérides) |
| O *cellarman* do pub desce à adega diariamente | [KB] arquitetura-em-detalhe §8 |
| Notificada a morte, o coroner é obrigado a abrir inquérito; a notificação corre por *parochial officers*/coroner's officer; o constable "assegura a cena (…) e **espera** o médico" | [KB] inquerito-e-policia §1–2 |
| O *passing bell* anuncia a morte à vila no instante em que ocorre — a descoberta é EVENTO público imediato | [KB] vida-cotidiana §8 |
| Crime noturno (21h–23h) + descoberta 6h–8h ⇒ IPM 7h–11h: rigor em instalação/quase pleno, livor AINDA NÃO fixo (fixa ~12h) — sinais mais frescos que os do padrão atual de 11h | [KB] tanatologia §2–3 (valores [MOTOR]) |

**Bandas propostas** (hora sorteada na banda, `hashDecisao` salgado):

| Palco | Banda de descoberta | Quem descobre | Fonte |
|---|---|---|---|
| Cena externa (logradouro) | **6h–8h30** | transeunte a caminho do trabalho; no adro, quem corta pelo *churchway*; na granja, o primeiro lavrador (6h–6h30 — a banda mais apertada); no açude, o moleiro na comporta | [KB] vida-cotidiana §1/§6 + efemérides (a luz é o gatilho); hora do moleiro: [CHUTE] |
| Loja (botica, mercearia) | **6h30–8h** | o próprio lojista ao abrir; ou o carteiro que ninguém atende (antes das 8h) | [KB] vida-cotidiana §1, §6 |
| Pub | **~7h** | o moço que desce à adega / abre o salão | [KB] arq-em-detalhe §8; hora exata: [CHUTE] |
| Casa com criadagem (solar, vicarage, casa do médico) | **6h–7h** | a criada que desce para acender o *range* | [KB] vida-cotidiana §1; arquitetura-e-espacos §5 |
| Cottage / casa sem criadagem | **7h–9h** | família, vizinha da segunda de lavar, ou a ausência notada (o lavrador que não apareceu ao campo) | [CHUTE] calibrável sobre vida-cotidiana §1/§4 |
| Crime na faixa DIA (briga de trabalho) | descoberta quase imediata (mesma faixa) | quem partilha o local | [CHUTE] coerente com `caso.js` (ouvintes `mesmoLocal`) |

**Chegada do perito:** substituir `HORAS_CHEGADA = 11` fixa por
**descoberta + 2h a 4h** (notificação → coroner's officer → perito), teto 11h para
não quebrar contratos existentes do QA. A cadeia notificação→perito é [KB]
inquerito-e-policia §1; a duração do trajeto é [CHUTE] calibrável (a vila
atravessa-se em 5–8 min — urbanismo §6 — mas o perito pode vir de fora).
**Bônus forense de graça:** as bandas acima produzem IPMs variados (7–11h no crime
noturno externo; ~30h se o corpo da madrugada só é achado no dia seguinte à tarde)
— o leque de estados de rigor/livor/algor que `tanatologia.md` documenta e o motor
já sabe ler.

---

## 5. RECOMENDAÇÕES PARA [DECISÃO]

1. **Tipos v1 (teto 2–3):** `adro_da_igreja`, `patio_da_granja`,
   `caminho_do_acude` (justificativa em §1.6). `travessa_dos_fundos` fica pronta
   no papel para v2; `plataforma_da_estacao` para v3 (condicional à seed; esperar
   o Monte Carlo da E4 vigiar a célula rara — E0 §4).
2. **Frequentadores a ativar (§3.4a):** moleiro→açude; lavrador e
   pastor_de_ovelhas→pátio da granja; paroco→adro. Madrugada nunca aponta
   logradouro. Sacristão (arquétipo novo) e constable-em-ronda: registrar, não
   ativar.
3. **Âncora nova:** só `'agua'` generalizada (`acude`, `poco` além de
   `cocho_dagua`) — quebra o quase-invariante "afogamento ⇒ forja". `'altura'`
   espera o método precipitação (dossiê pronto em `traumas.md`).
4. **Chamariz (§3.4b): SIM na E2** — sem ele, "palco externo" dependeria só das
   bandas de rotina e a vítima elegível viraria previsível (o moleiro morre no
   açude, sempre). Chamariz implica premeditação (briga escalada NUNCA usa).
   **Catálogo fechado de engodos, cada um depositando ≥ 1 vestígio** (regra da
   OS; alinha com R1–R6 — todo desvio deixa trilha):
   | Engodo | Vestígio depositado | Fonte de plausibilidade |
   |---|---|---|
   | bilhete de encontro sem assinatura | o papel no corpo/na casa da vítima (vestígio material) | [KB] vida-cotidiana §6 (correio rural; carta no mesmo dia); prova documental: validar alcance com perito-forense |
   | recado levado por terceiro | o portador vira testemunha (carta de depoimento) | [KB] vida-cotidiana §6 (a rede de fofoca) |
   | convite combinado no pub | a mesa ouviu (testemunho; "perder às cartas é registrado pela mesa inteira") | [KB] vida-cotidiana §7 |
   | telegrama (só seeds com estação) | o impresso + o registro do telegrafista ("datado ao minuto, o telegrafista lê tudo") | [KB] vida-cotidiana §6 |
   | falso chamado de ofício (parto à parteira, doente ao médico, cavalo ao ferreiro) | a contradição verificável: ninguém mandou chamar (testemunho negativo) | [KB] vida-cotidiana §4; `arquetipos.js` parteira ("entra em toda casa pela porta da frente") |
5. **Bandas de descoberta (§3.5):** as da tabela do §4; perito = descoberta +
   2–4h (teto 11h). Externa 6h–8h30; loja 6h30–8h; casa com criadagem 6h–7h;
   cottage 7h–9h; pub ~7h.
6. **Regime-palco 70/20/10 (§3.6):** endossar — 70% interior-rotina / 20%
   logradouro / 10% reservado à E3 (pousada/forasteiro). Moeda por caso com sal
   `seed|caso|regime-palco` pela via decorrelacionada `hashDecisao` (contrato já
   fixado na E0 §4). **Salvaguarda:** a moeda "logradouro" só se consuma se houver
   vítima com banda externa OU chamariz elegível (premeditado); senão, fallback
   determinístico para interior — o regime nunca trava um caso.
7. **Y% da GE5:** o texto integral da GE5 não está no repositório (só a E0 foi
   committada). Sob a leitura "GE5 = fração dos casos de palco externo em que a
   vítima chega por CHAMARIZ (vs. rotina)": recomendar **Y = 50%**, [CHUTE]
   calibrável, aplicado só aos premeditados — abaixo disso o chamariz vira
   raridade aprendível ("se há bilhete, é caso raro"); acima, as bandas de rotina
   externa (item 2) deixam de importar. Auditar na E4 junto com o produto
   regime-palco × regime-magnitude. Se a GE5 significar outra coisa, esta
   recomendação volta a [DECISÃO] com o texto da OS à vista.

— fim do dossiê E2 —

## 6. Decisões do autor (18/07/2026) — lavradas

Correção prévia à consolidação: o item 7 do §5 foi escrito sem o texto da OS à
vista; a **GE5 real** é "em lote ≥ 50 seeds, nenhuma família de método > Y% das
cenas externas". A recomendação de Y foi refeita sob essa leitura e aprovada
abaixo; a fração de chamariz × rotina do antigo item 7 vira calibração livre,
auditada na E4.

1. **Tipos v1:** `adro_da_igreja`, `patio_da_granja`, `caminho_do_acude`
   (teto 3). Travessa dos fundos = v2; plataforma da estação = v3 — catalogadas
   neste dossiê, sem código.
2. **Chegada da vítima:** rotina externa (moleiro→açude; lavrador e
   pastor_de_ovelhas→pátio; pároco→adro; madrugada nunca aponta logradouro)
   **e** chamariz na E2 (variante do premeditado, catálogo fechado de engodos
   do §5.4, todo engodo com ≥ 1 vestígio).
3. **Descoberta:** bandas só no palco externo (externa 6h–8h30; perito =
   descoberta + 2–4h, teto 11h); **palco interno mantém 11h fixo na v1** —
   preserva o replay dos casos internos, critério de aceite 2 da OS.
4. **Regime-palco:** 70/20/10, sal `seed|caso|regime-palco` pela via
   decorrelacionada; o braço pousada (10%) recai em interno até a E3.
   Salvaguarda: a moeda "logradouro" só se consuma com vítima de banda externa
   ou chamariz elegível. **GE5: Y = 40%.**
