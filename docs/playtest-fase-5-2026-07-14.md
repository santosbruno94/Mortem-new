# Playtest — FASE 5: Passe de prosa e história do slice · 14/07/2026

Passe de prosa do vertical slice, **só camada narrativa**: nenhuma `tagsOcultas`,
seed ou função de motor tocada; `veredicto.js` lê exatamente as mesmas tags de antes,
e o `qa.mjs` segue `CASO VÁLIDO`. Toda a prosa nova/reescrita passou pelo agente
`escritor-prosa` e pelo pipeline `revisar-prosa` (editor-crítico + perito-forense +
fiscal-continuidade) — os bloqueantes encontrados foram corrigidos antes do commit.

## O que mudou

### 5.1 — A vítima viva (`localidades.js`, `cartas.js`, `dialogos.js`)

Geoffrey Arthurs passa a existir por **objeto puro** e por **fala/gesto de personagem**
— nunca em bloco expositivo, nunca com o narrador concluindo afeto (guia §2).

- **Pontos da cena:** cabide atrás da porta com sobretudo escuro e chapéu-coco (o homem
  que não saiu); cachimbo de barro na repisa e cinza por raspar; óculos de aros finos
  dobrados sobre o livro-razão e a lupa de cordão na escrivaninha; na copa, a **rotina
  interrompida** que dói sem que o narrador o diga — a bandeja com as duas xícaras (uma
  de chá seco, a outra emborcada e limpa), a lata de chá aberta com a colher dentro.
- **Pontos da oficina:** adensamento sensorial (limalha de latão, gume das limas, óleo,
  carvão frio); o frasco de óleo pela metade, o pano manchado de dedadas; os recibos
  furados no prego, o de cima na letra miúda do morto.
- **Cartas:** a caligrafia do morto atravessando anos no `ev_livro_ordens`; o aro de
  ouro "estreito e ainda sem uso" (a própria aliança G.A. & A.R.) no `ev_anel_encomenda`;
  o afeto oblíquo de Davey no `dep_habito_corda` ("Deixava eu ouvir o tique depois").
- **Diálogo de Silas:** os doze anos de bancada ao lado do mestre, a solicitude como
  máscara ("Acendia eu o fogo mal abria a loja, e ele descia ao cheiro do carvão").

### 5.2 — Pagar o título (`epilogo.js`)

Eco único de "A Hora Emprestada" no epílogo (`blocoHoraTomada`), **condicional**:
dispara só com `cenaEncenada && horaForjada && descuidosOk` — o corpo só "cobra de
volta" a hora emprestada quando o jogador **de fato derruba o relógio forjado**. Sem
isso o verso seria falso (Erro Judiciário / Impunidade não pagam o título). Genérico
(serve a qualquer mostrador movido para mentir a hora); nenhuma personagem diz o título.
Decisão do usuário: eco condicional, entre as três opções apresentadas.

### 5.3 — Os segredos com peso (`epilogo.js`, `monologo.js`)

`EPILOGO_SEGREDO_EXPOSTO` (2 variantes) e `PERIFERICO_SEGREDO` (3 variantes) reescritos
para que expor um inocente carregue **custo moral, não troféu** — a armadilha do jogo é
moral. Universais: servem tanto à súplica humilhante de Walter quanto ao decoro de Agnes
("não é vitória expor o que um inocente calava"; "o peso de ter aberto o que não me cabia").

### 5.4 — A abertura mais forte (`abertura.js`)

Reforço cirúrgico (decisão do usuário, entre três escopos): 6 passos, ids, flags e o
rótulo final `Entrar — iniciar a investigação` **intocados** (contrato do qa-ui).
- **Carta do delegado** mais tátil como objeto físico: o lacre de cera que racha, o
  papel grosso, a letra que corre; Wycliffe fecha "escrevo de pé, e a mão ainda não me
  voltou ao sossego" (voz da bíblia — cordial, fora da própria profundidade).
- **Chegada a Briarstone** em três batidas sensoriais (cheiro → som → luz), sem a lista
  expositiva antiga; a cortina cerrada e o guarda pálido preservados. Wycliffe recebe
  "com as duas mãos, e não a solta logo" — o alívio pelo gesto, não pelo narrador (§2.1).

### 5.5 — Varredura anti-padrão

Contagem de anti-padrões na **prosa de jogo** (excluídos comentários), HEAD × pós-fase:

| arquivo | travessão | "não X — é Y" |
|---|---|---|
| `localidades.js` | 7 → 7 | 0 → 0 |
| `cartas.js` | 8 → 8 | 1 → 1 |
| `dialogos.js` | 6 → 6 | 0 → 0 |
| `monologo.js` | 3 → 3 | 1 → 1 |
| `epilogo.js` | 2 → 2 | 0 → 0 |
| `abertura.js` | 8 → 7 | 0 → 0 |

Nenhuma contagem piora; `abertura.js` melhora em 1 (a lista com travessão saiu). As
ocorrências de "não…—" remanescentes vivem em comentários `//`, não em texto de jogo.

## Pipeline de revisão — achados e conserto

- **perito-forense:** ZERO bloqueantes. Todos os objetos e falas novos com respaldo de
  época (chapéu-coco, cachimbo de barro, buris/pó de polir/limalha de latão, reserva de
  ~30h do relógio de bolso, lupa de cordão, livro-razão, espeto de recibos).
- **fiscal-continuidade:** 1 bloqueante — o fogo de Silas se autocontradizia (`abertura`
  atribuía a acesa a Arthurs; `achado` a Silas). Corrigido: Silas acende, Arthurs "descia
  ao cheiro do carvão"; agravante "carvão morno" × "sem lume" resolvido ("carvão frio").
  Datas conferidas: 30/out/1893 = segunda ✓; noivado G.A. & A.R. ✓; corda 23h/30h ✓.
- **editor-crítico:** diff aplicado ZERO bloqueantes; abertura com 1 bloqueante ("com um
  alívio que não disfarça" — narrador nomeava a emoção), corrigido antes de aplicar.
  Recomendações aplicadas: intro da oficina desespelhada da do gabinete; "reconhece a
  letra num relance" → "corre os olhos pela nota"; "e conferido" → "e sublinhado".
- **Nota de design (aceite consciente):** onde o eco 5.2 dispara, o epílogo tem duas
  frases de efeito (o eco + o balanço do perito), separadas por blocos e em registros
  distintos. Dentro do tolerável apontado pelo editor; o eco condicional o torna raro.

## Gates

- `npm run build` — limpo.
- `node scripts/qa.mjs` — **CASO VÁLIDO** (25 checagens; epílogo determinístico e
  periféricos sem eco verbatim inclusos — o gate `descuidosOk` não regrediu nada).
- `node scripts/qa-ui.mjs` — **UI VÁLIDA** (todas as rotas, `?flat=1`, zero erros de
  console). A abertura reforçada mantém os 6 passos e o botão final — sem mudança no QA.

## Fora de escopo (não feito, sem nova ordem)

Persistência, múltiplos peritos, gerador procedural, trilha sonora, novos nós,
mudanças no motor de veredicto além da Fase 0.3.
