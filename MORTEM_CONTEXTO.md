# MORTEM — Documento de Contexto

> Fonte única de verdade do design, escrita para humanos e para agentes de código.
> Descreve o **estado atual** do jogo — sem camadas históricas. O caminho até aqui está
> em [`docs/historico-decisoes.md`](./docs/historico-decisoes.md). A prosa é regida por
> [`docs/guia-de-estilo.md`](./docs/guia-de-estilo.md) e
> [`docs/biblia-de-vozes.md`](./docs/biblia-de-vozes.md); a verdade forense, por
> [`docs/kb-medicina-legal/`](./docs/kb-medicina-legal/).

---

## 1. O que é MORTEM

MORTEM é um jogo de investigação forense baseado em texto e cartas, ambientado na
Inglaterra vitoriana (1893). O jogador é um perito médico-legal independente, chamado a
vilarejos onde a polícia local não tem competência técnica para resolver homicídios.
Toda a experiência acontece sobre uma **escrivaninha vista de cima**: evidências,
depoimentos e conclusões são **cartas**; investigar é viajar num mapa que cresce e
examinar sem pressa; acusar é **construir uma cadeia no mural com barbante** e
sustentá-la ligando cartas. O desfecho é o **Monólogo do Detetive**, que mede a
qualidade da cadeia construída.

**Referências de design:**
- *Cultist Simulator* — interface de mesa/cartas, narrativa emergente da manipulação de objetos
- *Papers, Please* — rotina técnica sob pressão, com peso moral nas decisões
- *Return of the Obra Dinn* — dedução genuína: o jogo dá dados, o jogador produz a verdade

**Plataforma:** web app React. Sem engine de jogo. 100% determinístico.

---

## 2. O que diferencia MORTEM dos demais jogos de detetive

1. **"Nem todo mentiroso é culpado."** Inocentes mentem por razões próprias (vergonha,
   medo, autopreservação). A regra estrutural: *a mentira do assassino é inconsistente
   com a evidência FÍSICA; a mentira do inocente é inconsistente apenas com a MORAL*.
   O jogo pune pattern-matching preguiçoso ("mentiu → culpado") e recompensa perícia.

2. **O jogo nunca entrega conclusões.** O jogador recebe dados brutos ("articulações
   rígidas", "24°C corporal") e material de referência (Glossário Forense de época).
   A interpretação é dele. Não há highlight de "pista importante", e a prosa obedece à
   regra da **observação pura** (`docs/guia-de-estilo.md` §2). A única exceção
   controlada é a leitura técnica do mestre (§7), que é dica e não vincula nada.

3. **Dedução contra uma gramática universal, anti força-bruta.** Não há menu de
   respostas do caso: a leitura sai de um espaço universal (catálogo de causas + modelo
   de tempo, §6.1). Nada valida durante a investigação; só o desfecho. Sem vitória por
   tentativa e erro mecânico.

4. **Zero feedback durante a investigação.** Nenhum ✓/✗, nenhum "correto!". A verdade
   só é revelada no desfecho, de uma vez, com consequências.

5. **Errar é permitido — e tem consequência.** O jogo não bloqueia acusações fracas ou
   erradas. Existem 4 finais (Vitória Absoluta, Sucesso com Gafes, Impunidade, Erro
   Judiciário), e cada um narra o custo do que o jogador fez ou deixou de fazer.

6. **Camada narrativa ≠ camada lógica.** Toda carta carrega `tagsOcultas`. As regras
   leem SOMENTE as tags, nunca nomes ou textos de cartas. É isso que torna a geração
   procedural viável: trocar a narrativa não exige tocar no motor.

7. **Zero LLM em runtime.** Dados em JS, lógica em funções puras, monólogo final por
   templates universais com variáveis injetadas (e variação determinística por hash da
   seed salgado com o perito escolhido — §11). O jogo roda offline e é totalmente
   reproduzível.

8. **Tempo como recurso forense (relógio MOLE).** O relógio só avança ao **VIAJAR** no
   mapa (única exceção: a retentativa do tutorial custa 2h — §10/§11); dentro do local,
   congela. Sem fim de jogo por tempo. O perecível degrada perdendo **precisão**, nunca
   valor — o durável sempre resolve (§10). A pressão é de **rota**, não arcade.

9. **"Tudo é mesa. Tudo é carta."** Sem troca de telas, sem menus profundos. Eventos
   abrem como overlays sobre a escrivaninha — a mesa nunca sai do DOM.

---

## 3. A fantasia e o tom

O jogador é **o perito que chega de fora**: respeitado pela técnica, desconfiado pelos
locais. O tom é **vitoriano minimalista** — prosa contida, sensorial, sem melodrama. A
morte é tratada com a frieza profissional de um laudo e a gravidade de um luto.

Texto do jogo inteiramente em **português (PT-BR literário de época)**, sem
anacronismos. A norma completa (língua, observação pura, dosagem de brilho,
anti-padrões proibidos) está em `docs/guia-de-estilo.md`; o idioleto de cada personagem,
em `docs/biblia-de-vozes.md`. A verdade histórica do cenário (arquitetura, sociedade,
rotinas, vestuário de 1893) está em `docs/kb-mundo-vitoriano/` — prosa de ambientação e
elencos de casos novos nascem de lá. Eventos de investigação são prosa imersiva com
**termos clicáveis em negrito** inline — clicar extrai a carta correspondente.

**Estética visual:** mesa de madeira escura à luz de vela — e a matéria disso está na
tela: veios de madeira e grão procedurais (gradientes + ruído SVG, sem assets externos),
halo de vela que respira, papel com fibra e sombra nas cartas, barbante com corpo
(sombra + torção). Desde o overhaul "vitoriano premium" (jul/2026), a interface é feita
de **materiais**, definidos uma única vez em `src/index.css` e `tailwind.config.js`:
pergaminho claro escrito a tinta (`.carta-pergaminho` — provas, fichas, etiquetas),
couro escuro dos painéis (`.painel-couro` — moldura de todos os overlays), placa de
latão (`.placa-latao` — só as ações solenes: construir a acusação, levar a julgamento),
botão de mesa (`.botao-mesa` — todo botão comum), selo de cera (`.selo-cera` — marcador
de novidade), campo vitoriano (`.campo-vitoriano` — selects sem a cara do navegador),
mural de cortiça (`.mural-cortica`) e divisor ornado (`.divisor-ornado`). Tokens de
cor: `madeira`, `vela`, `papel`, `tinta`, `latao`, `cera` (+ `equimose`/`sangue`
forenses); os literais `stone/amber` sobrevivem como neutros de apoio, e **nenhum
texto informativo desce de `stone-400`** (contraste é regra — atmosfera não desculpa
ilegibilidade). Tipografia serifada de época embarcada (**IM Fell English**, licença
OFL, `src/assets/fontes/`) para títulos e nomes; sem ícones modernos; ornamentos
tipográficos discretos (§, ―, ❦).

**Camada 3D (apresentação pura):** a mesa ganha profundidade em dois pontos — o
**diorama da vila** (maquete low-poly pousada no alto da escrivaninha: prédios
procedurais com janelas à luz de vela; clicar num prédio VIAJA, e Moorford surge
crescendo com a estrada ao ser desbloqueado) e a **mesa de exame do corpo** (cadáver
low-poly ao lado da prosa, cuja pose/manchas refletem rigor e livor pelo IPM; os
hotspots extraem as MESMAS cartas dos termos em negrito). Regras da camada: geometria
100% procedural (proibido GLTF/textura externa — three.js + @react-three/fiber v8
pinados, chunk lazy próprio), dados espaciais em `src/data/mapa_espacial.js` e
`src/data/hotspots_corpo.js` (camada visual — o motor nunca lê), e **fallback 2D
obrigatório** (`?flat=1`, sonda WebGL, ErrorBoundary): sem 3D, a grade de localidades
original joga idêntico. Diálogos e pessoas permanecem 2D.

**Aparência dos personagens (camada narrativa):** genótipo com vocabulários fechados
(`corpo`, `pele`, `cabelo`, `pelosFaciais`, `idadeAparente`, `traje`) em
`src/data/aparencias.js`, CURADO por personagem no caso tutorial (seed fixa, sem
randomização); `src/logic/aparencia.js` expõe `obterAparencia` e
`derivarAparenciaDeSeed` (hash da seed salgado — pronto para o procedural). Alimenta
os **retratos 2D em gravura SVG** (`RetratoPersonagem.jsx`: interrogatórios,
delegacia, Painel de Álibis, Juízos do mural) e o corpo 3D da vítima. JAMAIS entra em
`tagsOcultas` nem é lida pelo veredicto (guarda no QA).

**Som:** cinco efeitos curtos, sintetizados offline e embarcados (`src/assets/sons/`,
tocados por `src/som.js`): papel (extrair carta), sino (viajar), barbante (ligar/
desfazer no mural), lacre (selar o julgamento), pena (avançar a abertura). O som é
apresentação — nenhuma regra depende dele — e desliga-se no rodapé da escrivaninha
("Som: aceso/apagado"). Zero rede em runtime segue valendo.

---

## 4. O loop de jogo

1. **Abertura** — Escrivaninha vazia em Caulfield (pensão miserável). A Sra. Potts
   entrega uma carta do delegado de Briarstone. Aceitar transforma a escrivaninha no
   hub de investigação.
2. **Briefing** — Chegada a Briarstone. O Delegado Wycliffe apresenta o caso (custo
   zero). Perguntas ao delegado plantam informações e iscas.
3. **Investigação** — Chegada às 11:00. O relógio só corre ao **VIAJAR** no mapa;
   dentro do local, congela. O jogador alterna entre:
   - **Viajar** entre nós do mapa (custa horas; o mapa cresce por leads);
   - **Examinar** localidades e **interrogar** suspeitos (clicar nos negritos extrai
     cartas; custo zero) — o legista vai falando a leitura do corpo;
   - Consultar Glossário, Caderneta e Painel de Álibis (custo zero).
4. **Construção da Acusação** — O botão da parede abre o **mural com barbante**: o
   jogador afirma a cadeia (réu, janela, causa, motivo, juízos) e a sustenta ligando
   cartas (§8).
5. **Monólogo do Detetive** — O motor compara a cadeia construída contra a Verdade de
   Ouro e gera o monólogo de um dos 4 desfechos. Só aqui o jogador descobre o que
   acertou e errou.

---

## 5. A Escrivaninha (hub central)

O jogador nunca sai desta tela. Layout:

```
[     CONSTRUIR A ACUSAÇÃO (parede)       ]

――――――――――――――――――――――――――――――――――――――――――
|                                [Relógio]|
|                                         |
|        SUPERFÍCIE LIVRE                 |
|        (cartas soltas + nós do mapa)    |
|                                         |
|-----------------------------------------|
[Caderneta]   [Painel de Álibis]  [Glossário]
```

- **Relógio de Bolso** (sup. direito): avança apenas ao **VIAJAR**; dentro do local,
  congela.
- **Superfície Livre** (centro): cartas arrastáveis, custo zero. **Localidades são nós
  do mapa**; clicar **VIAJA** (custa tempo, `src/data/mapa.js`) e abre o evento como
  overlay (`blur(6px)` + `opacity 0.3`, `position: fixed`). Só aparecem os nós
  **desbloqueados** (o mapa cresce por leads). Não existe troca de tela. Com WebGL, os
  nós vivem no **diorama 3D** no alto da mesa (rótulos em HTML real, mesmos textos);
  sem WebGL ou com `?flat=1`, na grade 2D original (`MesaLocalidades2D.jsx`) — o
  handler de viagem é um só para os dois modos.
- **A parede** (botão "Construir a Acusação"): abre o mural com barbante (§8).
- **Caderneta** (overlay, custo zero): log de tudo que foi extraído e concluído; exibe
  a leitura do mestre como dica.
- **Glossário Forense** (overlay, custo zero): referência de época, contexto-sensitivo.
- **Painel de Álibis** (overlay, custo zero): ver §9.

**Regras UX:** nenhuma ação exige mais de 2 cliques; feedback visual imediato; a
interface ensina pela forma, não por texto tutorial.

---

## 6. Sistema de Cartas e Tags Ocultas (motor lógico)

Toda carta tem duas camadas:

```js
{
  id: 'ev_rigor',
  textoDisplay: 'Corpo Endurecido',            // camada narrativa (jogador vê)
  carimboPadrao: 'Duro dos maxilares aos joelhos',
  descricao: '…',                              // exame próximo (guia de estilo §5)
  vozMestre: '…',                              // fala do legista (opcional; só campanha)
  tagsOcultas: {                               // camada lógica (motor lê)
    dominio: 'temporal',
    subDominio: 'rigor_mortis',
    estadoRigor: 'pleno',                      // ESTADO observado bruto
    estadoDegradacao: 'ativo',
  },
}
```

A carta carrega o **estado observado bruto**. Quem converte esse estado numa janela de
horas ou numa causa é a **gramática universal** (§6.1), não a carta.

**Domínios:** `temporal`, `causal`, `ambiental`, `comportamental`, `vestigio`.

**Extração:** clicar no termo em negrito (marcador `[[id]]` na prosa) registra a carta
direto em `cartasRegistradas`. Examinar não custa tempo. Na face da carta, a mesa
mostra só a **observação crua** (`textoDisplay`); o `carimboPadrao` é rótulo interno.
Cartas do corpo podem ter `estados` que degradam com o IPM e o campo opcional
`vozMestre` (a fala do legista, omitida no procedural).

**Regra inviolável:** as funções de lógica e de veredicto leem apenas `tagsOcultas`
(e a seed). Nunca decidem por `id` ou `textoDisplay`.

### 6.1 Gramática Universal de Dedução

O caso (seed) **não contém alternativas**. Cada caso traz só a **Verdade de Ouro** +
as **pistas físicas**. O espaço de respostas é **universal**, igual para todo caso, e
mora no motor:

- **Catálogo universal de causas** (`src/data/catalogo_causas.js`): todas as causas que
  o jogo conhece e o vocabulário de **sinais**. Um sinal de *família* (petéquias →
  asfixia) aponta o gênero; um sinal de *assinatura* (sulco horizontal → ligadura)
  crava a espécie e descarta as parecidas. O jogador deduz por **eliminação**.
- **Modelo forense de tempo** (`src/logic/tempo_morte.js`): converte cada indicador
  (algor, rigor, livor, última-vez-visto) numa **janela de horas**, determinístico nos
  dois sentidos. A Janela da Morte é a **interseção** das janelas.

Consequência: dá para gerar infinitos casos sem escrever uma única "alternativa". A
ambiguidade **emerge** do espaço universal — quem reúne poucas pistas fica com várias
causas de pé e a janela larga.

O **método de construção de casos** sobre essa gramática (verdade primeiro, pistas
depois, despistes honestos, truques de álibi e encenação, regras de fair play e a régua
de escalada da campanha) está em `docs/kb-craft-narrativo/` — leitura obrigatória antes
de desenhar uma Verdade de Ouro nova.

---

## 7. A leitura do mestre (a dica falada)

Não há gavetas nem mostradores: a leitura forense é **falada pelo mestre/legista**
(`src/logic/falaDoMestre.js`), em linguagem natural, a partir do que o jogador
examinou — a janela via `calcularJanelaMorte` (`cronos.js`), o mecanismo via
`mecanismoCravado` (`catalogo_causas.js`). A leitura é refeita a cada exame
(`consolidarLeituraMestre`, ids estáveis `leitura_mestre_janela`/`leitura_mestre_mecanismo`)
e guardada em `conclusoes` (`origem: 'mestre'`), exibida no exame do corpo e na
Caderneta.

**É DICA, não decisão**: não vincula o veredicto — quem afirma o quando/como na cadeia,
e responde por isso, é o jogador. Limites da voz do mestre no texto: leitura técnica
apenas (janela, família/assinatura, estado do sinal); nunca aponta pista, autoria ou
encenação (`docs/guia-de-estilo.md` §2.4).

**Onde a dica mora (e onde não mora):** a leitura fala no exame do corpo e fica
arquivada na Caderneta. Ela **não** aparece no Mural da Acusação — consultá-la na hora
de afirmar a cadeia é um gesto deliberado (abrir a Caderneta), não um gabarito
pendurado sobre a prova.

No modo **procedural** não há mestre: a cena traz só a descrição física (sem
`vozMestre`) e o jogador, já perito, lê por conta própria.

---

## 8. A Construção da Acusação (o mural com barbante)

O ato final do jogador (`src/components/MuralAcusacao.jsx`, aberto pelo botão
"Construir a Acusação"). A acusação é **construída, não preenchida**: o jogador
**AFIRMA** a cadeia nas âncoras e a **SUSTENTA puxando barbantes** das cartas (cada
carta tem um pino; a ligação é uma linha em SVG; o alvo sai de `elementFromPoint`).

**Dois verbos atômicos**, com significado **DERIVADO das tags**
(`src/logic/acusacao.js`; nunca escrito por caso):

- **Sustentação** — um fato apoia uma afirmação positiva: indicador temporal → âncora
  *Quando*; sinal → *Como*; vestígio → *Presença*.
- **Refutação** — um depoimento desmentido por fatos: a hora alegada cai **fora** da
  janela que os fatos físicos sustentam; o vestígio do próprio declarante o desmente
  (e, se revela um segredo, a mentira é de vergonha — inocente, não assassino); ou uma
  **corroboração de testemunho** registra o declarante saindo antes da hora que jurou
  (tag `horaFimObservada` — é assim que o registro de Moorford fura o álibi do réu).

**A encenação tem dono:** o crédito de "descuidos expostos" exige derrubar a **própria
peça forjada** (a alegação de hora com a tag `encenado` — o relógio esmagado).
Desmentir uma testemunha apenas equivocada é mérito narrado à parte, nunca crédito de
encenação. **O álibi do réu** entra na Estação III como alegação refutável quando o
réu está nomeado — derrubá-lo é opcional (corroboração nunca é pilar), mas o monólogo
ganha o direito de dizê-lo.

**O jogador afirma o "quando" e o "como".** A janela (início/fim no relógio dos dois
dias) e a causa (do catálogo universal) são **juízo dele**, sustentados pelas cartas
que ele ligar.

**A cadeia** soma: Quem · Quando · Como · Presença · Mentiras expostas · Motivo ·
Juízo sobre cada não-acusado (`culpado` | `inocente` | `sem_juizo`). A armadilha do
§2: quebrar a mentira do inocente e julgá-lo *culpado* → **Erro Judiciário**.

**Nexo de Presença:** o vestígio **instrumental** (casa com a arma E pertence ao réu) é
obrigatório para o nexo; ligar um traço de terceiro é **gafe** (condena, mas custa a
Vitória Absoluta); ligar só o errado falha o nexo. Um segundo vestígio do próprio réu
(não instrumental) reforça sem gafe.

**Estado:** `acusacao` = `{ reuId, janela:{inicio,fim}, causaId, motivacaoId,
juizos, ligacoes }`.

---

## 9. Painel de Álibis

Overlay de consulta intitulado **"Declarações de Paradeiro"**. Lista as cartas de
depoimento de álibi já coletadas (`dominio: 'comportamental'`, `subDominio: 'alibi'`)
de forma **estritamente neutra**: quem declarou, o que declarou, faixa horária
declarada. **Sem marcadores de status**, sem cruzamento automático. O cruzamento ativo
— desmentir uma alegação ligando-a aos fatos do corpo — é ATO do jogador no mural.

## 9.1 Glossário Forense

Referência de época, consulta gratuita, overlay com navegação por domínio (5 domínios →
termos → definição). Cada verbete: termo, definição tecnicamente precisa, domínio,
sinal observável. É o material que permite ao jogador interpretar os dados brutos sem
que o jogo interprete por ele. Abre filtrado por contexto quando pertinente. Conteúdo
validado contra `docs/kb-medicina-legal/`.

---

## 10. Tempo e Degradação (relógio MOLE)

- Relógio global em horas (`horasJogo`), chegada às **11:00** (`horasChegadaCena: 11`,
  imutável).
- **Custa tempo:** só **VIAJAR** entre nós do mapa (`viajarPara`; custos em
  `src/data/mapa.js` — dentro da vila 1h; Moorford 1h30 por trecho, 3h ida e volta).
  Dentro do local, o relógio congela.
- **Custo zero:** examinar (extrair), medir temperatura, interrogar, mural, Glossário,
  Caderneta, Painel de Álibis, arrastar/organizar.
- **Degradação = perda de PRECISÃO, nunca de valor.** Rigor e algor, ao degradar,
  viram leituras vagas mas válidas (rigor `resolvido` → janela larga `[36h, +∞)`;
  algor em equilíbrio → piso largo), jamais nulas. A carta registrada congela no estado
  em que foi vista. O corpo telegrafa e anuncia a perda (legibilidade).
- **Garantia de solvabilidade:** a âncora durável (livor fixo + "visto por última vez
  com vida", `dep_visto_vivo`) sempre fecha uma janela finita que contém a hora real,
  em qualquer rota; o perecível só aperta essa janela quando colhido fresco. Sem fim
  de jogo por tempo. A falha do apressado é de perícia, não de relógio.
- **Exceção do tutorial:** a **retentativa** custa relógio (2h por "Revisar a
  acusação" — §11): é o único gesto fora da viagem que move o ponteiro, e move-o por
  ser uma viagem institucional (a audiência adia-se).
- **Pressão de rota nos casos da campanha (decisão registrada — Q6):** o relógio mole
  do tutorial não morde por desenho; nos casos seguintes a pressão de rota virá de
  **janelas de disponibilidade** — testemunha que embarca, estabelecimento que fecha,
  enterro marcado que leva o corpo — e/ou de eventos que consomem horas. O perecível
  continua sem bloquear (perde precisão, não valor); o que se perde por chegar tarde é
  ACESSO a fontes, nunca a solvabilidade (a âncora durável segue garantida). Detalhe
  por caso, no desenho de cada caso.

---

## 11. O Veredicto e o Monólogo do Detetive

### Veredicto (`calcularVeredictoCadeia(acusacao, cartasRegistradas, seed)`)

Função pura (`src/logic/veredicto.js`). Lê a **cadeia construída** contra a Verdade de
Ouro (só tags e seed) e retorna `{ tipo, acertos, falhas[], perifericos,
dadosMonologo }`. Os 4 tipos:

1. **`vitoria_absoluta`** — réu certo, pilares sólidos (janela precisa ≤6h que cobre a
   hora real, mecanismo cravado, nexo instrumental), motivo, encenação exposta,
   periféricos corretos, sem gafes.
2. **`sucesso_gafes`** — réu certo, condenação sustentada, mas com lacunas ou erros
   expostos.
3. **`impunidade`** — réu certo mas tese furada: as lacunas soltam o assassino.
4. **`erro_judiciario`** — réu errado condenado. O nome do verdadeiro culpado **não**
   sai no monólogo enquanto a retentativa está de pé — só o **encerramento definitivo**
   (o epílogo) o revela.

### Monólogo por templates universais — e o CONTRATO do desfecho

Gerado por **BLOCOS** parametrizados (`src/logic/monologo.js`): abertura por tipo de
final, tese montada com o que o jogador ligou, o álibi do réu desmentido (se o foi),
as testemunhas derrubadas (se o foram), buracos mapeados das falhas, juízo dos
periféricos, fecho. Nunca há texto único por caso — os mesmos templates servem ao
tutorial e a qualquer caso procedural. Nunca LLM. Voz em primeira pessoa — o perito
pensa alto (tom: `docs/guia-de-estilo.md` §3–4).

**Contrato:** nenhuma frase do desfecho afirma gesto que o jogador não fez —
a encenação só entra se a peça forjada foi refutada; "o paradeiro que firmei" exige o
álibi do periférico na mesa (sem ele, o juízo é narrado como convicção); o instrumento
citado vem do sinal que cravou a causa, nunca de um vestígio avulso.

**Variação determinística:** as variantes de abertura e fecho saem de hash da seed
**salgado com o nome do perito** (nunca `Math.random`) — a mesma partida repete o
texto; Harlan e Lenore tendem a ler desfechos diferentes. O teto do guia §3 (no máximo
UMA máxima por desfecho) é garantido **por construção**: cada variante declara
`maxima`, e abertura-máxima só sorteia fechos sem máxima.

### Retentativa (regalia do caso-escola — com preço)

No desfecho, além do "O QUE FALTOU — cortesia do tutorial", o botão **"Revisar a
acusação"** devolve à investigação com a mesa intacta — mas **custa 2h de relógio**
(`CUSTO_REVISAO`, `src/store/jogo.js`): a audiência adia-se, e o perecível ainda não
colhido segue degradando. A resubmissão continua ilimitada (o caso-escola é uma aula),
porém nunca grátis, e o Erro Judiciário não entrega o nome do culpado enquanto se pode
tentar de novo. Nos casos seguintes da campanha, a consequência pode endurecer
(reputação do perito, ou submissão única) — decisão em aberto, registrada para os
próximos casos não herdarem a regalia por omissão.

### Epílogo e retrato (o encerramento paga o investimento)

"Encerrar o caso" não recarrega a página de imediato: abre o **Epílogo**
(`src/logic/epilogo.js`) — 2 a 4 parágrafos de consequência por templates universais
(o destino do réu conforme o desfecho; o periférico do segredo, exposto ou não; a
conta do perito) — seguido de **O retrato da investigação**: horas usadas, lugares
visitados, observações registradas, acusações levadas a julgamento. Só então "Fechar o
caderno" encerra de fato.

---

## 12. Personagens jogáveis

Dois peritos, sobrenome compartilhado **Blackwell** (minimiza variações de texto):

- **Dr. Harlan Blackwell** — cirurgião do Exército; perito independente desde 1887.
  Frio, metódico; especialista em intervalo post-mortem.
- **Dr.ª Lenore Blackwell** — primeira perita licenciada da Inglaterra; sabe que cada
  prova precisa ser três vezes mais sólida quando o nome no libelo é feminino.

**Sistema de variáveis:**
```js
detective = { name, surname: 'Blackwell', pronoun: 'ele'|'ela', treatment: 'Sr.'|'Sra.', title: 'Dr.'|'Dr.ª' }
```
Textos usam interpolação `{detective.campo}` e flexão `{g:masc|fem}` (~20–30 pontos de
variação no tutorial). Seleção na tela inicial (`faseJogo: 'selecao' → 'abertura' →
'investigacao'`).

---

## 13. Estrutura de progressão

1. **Tutorial — "O Álibi de Corda"** (fixo): quatro armadilhas pedagógicas;
   **resubmissão da acusação permitida** — a falha mostra o que faltou (exceção
   exclusiva do tutorial).
2. **Campanha — arco mestre/aprendiz** (esqueleto pendente): o jogador começa como
   assistente de um mestre, que ensina **verbos e hábitos** (não fatos) e dá menos
   ajuda com o tempo; ao fim, o mestre morre e o jogador assume o lugar. A campanha é
   o **currículo completo** (`src/data/curriculo.js`): tudo que o gerador um dia usará
   é ensinado antes da morte do mestre (contrato de currículo). *Em aberto:* a morte
   do mestre como caso jogável.
3. **Procedural** (sandbox): o assistente embrulha o modo infinito (traz casos, faz
   presença, **sem ensinar**); a cena vem só com descrição física (sem `vozMestre`).
   Viável graças ao motor de tags.

---

## 14. Caso Tutorial: "O Álibi de Corda" (CONTÉM SPOILERS)

**Cenário:** Briarstone, outubro de 1893. Vítima: **Sr. Geoffrey Arthurs**, relojoeiro,
61 anos, encontrado morto no escritório dos fundos. Escritório revirado; relógio de
lareira esmagado, parado às **09h00**.

**Calendário:** a morte ocorre às **22h de sexta-feira, 13/out/1893** (hora absoluta
−2); o corpo é achado na manhã de **sábado, 14/out**, às 09h30; o perito chega às
**11h00** (hora absoluta 11; IPM na chegada = 13h). Corpo a 24°C, sala a 11°C.

### Verdade de Ouro (`src/data/seed.js` — lida apenas pelo motor)
```js
SEED_TUTORIAL = {
  id: 'o_alibi_de_corda',
  vitima: 'Sr. Geoffrey Arthurs',
  reuCorreto: 'edgar_arthurs',
  horasMorteAntesChegada: 13,
  horaMorteAbsoluta: -2,
  mecanismoCorreto: 'estrangulamento_ligadura',
  instrumentoCorreto: 'fibra_canhamo',
  motivacaoCorreta: 'heranca',
  cenaEncenada: true,
  horaForjada: 9,
  perifericos: {
    thomas_blackwood: { veredictoEsperado: 'inocente_alibi', segredo: null },
    sra_hudson: { veredictoEsperado: 'inocente_segredo', segredo: 'mentira_alibi' },
  },
}
```

**O que aconteceu:** Edgar matou o tio às 22h por estrangulamento (corda de cânhamo),
voltou às 09h pela porta dos fundos (fechadura forçada por ele mesmo), revirou gavetas
e quebrou o relógio para encenar hora e roubo, e então "descobriu" o corpo.

### Suspeitos
- **Edgar Arthurs** (38, sobrinho e único herdeiro) — **o assassino**. Cooperativo,
  polido, álibi *para a noite de 13* (jantar no Clube Comercial de Moorford, 20h–23h)
  que é exatamente o horário real da morte — e que Moorford, se visitado, fura: saiu
  "lá pelas oito e meia".
- **Sra. Mabel Hudson** (55, governanta) — **inocente que mente**. Declara ter ficado
  no quarto a noite toda; na verdade furtou o escritório à meia-noite (o fio de lã na
  gaveta / o xale com fio puxado revelam o segredo `mentira_alibi`).
- **Thomas Blackwood** (42, taverneiro do The Crossed Keys, desafeto público) —
  **ruído**. Motivo público (dívida, briga registrada), álibi verdadeiro e corroborado
  (balcão, 20h–00h, doze fregueses).
- **Delegado Lemuel Wycliffe** — fonte de informação, não suspeito. Briefing e
  perguntas plantam dados e iscas (relógio das 09h, testamento, dívidas, briga).

### Cartas-chave além do corpo
- `dep_visto_vivo` — âncora durável: a governanta serviu a ceia às 20h de 13/out
  (piso da janela).
- `dep_avistamento_falso` — a Sra. Gale jura ter visto a vítima viva à janela às 08h
  de 14/out. Mentira literal, refutável pela janela do corpo (o "momento Obra Dinn").
- `dep_acusa_hudson` — o Sr. Pruitt jura ter visto a governanta sobre o corpo à
  meia-noite. Isca de Erro Judiciário; a janela (fecha ~23h) o refuta.
- `ev_lenco` — lenço com iniciais "E. A." atrás da estante: segundo vestígio de
  presença do réu (não instrumental — reforço sem gafe).
- `corrob_moorford` — nó distante (3h por trecho, desbloqueado por lead): o porteiro
  fura o álibi de Edgar. Corroboração opcional, nunca pilar.

### As quatro armadilhas pedagógicas
1. **Relógio como isca** — assumir morte às 09h e não priorizar o corpo → o perecível
   perde precisão (falha de perícia, não de relógio).
2. **Hudson como distração** — parece culpada (nervosa, mente), mas a perícia temporal
   a descarta.
3. **Blackwood como ruído** — motivo claro, álibi sólido. Motivo sem oportunidade não
   é prova.
4. **Edgar sem provas** — intuição certa com processo errado = **Impunidade**. Acusar
   exige materialidade.

---

## 15. Referência forense canônica

A base completa (com fontes de época) vive em `docs/kb-medicina-legal/`. **Valores
invioláveis do motor** — o jogo depende deles para ser resolúvel:

- **Rigor mortis:** surge 2–4h post-mortem, pleno ~12h, desaparece 24–36h. Sequência
  céfalo-caudal.
- **Livor mortis:** surge 1–2h; fixa definitivamente após ~12h (antes disso, some sob
  pressão digital).
- **Algor mortis:** resfriamento ~1°C/h a partir de 37°C, até a temperatura ambiente
  (margem ±2h no modelo).
- **IPM:** nenhum sinal isolado é definitivo; a convergência (interseção de janelas)
  reduz a margem.
- **Causa:** petéquias/cianose → asfixia (família); sulco cervical **horizontal** →
  ligadura; **oblíquo/ascendente** → enforcamento; escoriações/equimoses → reação
  vital; odor de amêndoas → cianeto; odor de alho → arsênico.
- **Dinâmica:** espasmo cadavérico, marcas de arrasto, livores incompatíveis com a
  posição, conteúdo estomacal, ausência de lesões de defesa.

Divergência entre a KB e estes valores é decisão do usuário — nunca de um agente.

O aparato **legal-policial** dentro do qual o perito opera (coroner e inquérito, polícia
de vila, murder × manslaughter, a cena sem cadeia de custódia) está em
`docs/kb-medicina-legal/inquerito-e-policia.md`; as lacunas temáticas mapeadas para
expansão futura, em `docs/kb-medicina-legal/lacunas.md` (expansão é decisão do usuário).

---

## 16. Arquitetura técnica

**Stack:** React (JSX) + Vite + Tailwind CSS · estado global com **Zustand** · dados em
módulos JS · lógica determinística em funções puras · zero chamadas de rede em runtime ·
3D com **three.js + @react-three/fiber v8 + drei v9** (versões EXATAS no package.json —
fiber v9/drei v10 exigem React 19), carregado por chunk lazy; do drei, só o `<Html>`.

**Estrutura de pastas:**
```
docs/           guia-de-estilo · biblia-de-vozes · kb-medicina-legal/ · historico-decisoes
.claude/        agents/ (escritor-prosa, editor-critico, perito-forense, fiscal-continuidade)
                skills/ (anti-padrao-ia, redigir-prosa, revisar-prosa)
src/
  assets/       fontes/ (IM Fell English, OFL) · sons/ (5 WAV sintetizados offline)
  data/         seed.js · catalogo_causas.js · cartas.js · localidades.js · mapa.js ·
                curriculo.js · glossario.js · rotulos.js · abertura.js ·
                aparencias.js (genótipo curado) · mapa_espacial.js (diorama) ·
                hotspots_corpo.js (exame 3D) — os três últimos: camada VISUAL
  logic/        veredicto.js (calcularVeredictoCadeia) · acusacao.js (gramática das
                ligações) · tempo_morte.js · cronos.js · falaDoMestre.js (dica) ·
                monologo.js · epilogo.js · tempo.js · interpolar.js ·
                hash.js (fonte única de sorteio) · aparencia.js · webgl.js (sonda)
  store/        jogo.js (Zustand: fases, relógio, mapa, cartasRegistradas, conclusoes,
                acusacao, log, detective, nosVisitados, nSubmissoes, somAtivo)
  som.js        efeitos sonoros da mesa (apresentação; nenhuma regra lê)
  components/   Escrivaninha · MesaLocalidades2D (grade/fallback) · EventoLocalidade ·
                MuralAcusacao · MonologoFinal · PainelAlibis · ModalGlossario ·
                Caderneta · TelaPersonagem · TermometroCorpo · Abertura · Overlay ·
                CartaMesa · RelogioBolso · RetratoPersonagem · Cena3DBoundary ·
                diorama/ (DioramaVila · Predio · RotuloNo) ·
                corpo3d/ (CorpoCanvas · CorpoModelo · HotspotCorpo)
```

**Convenções:**
- Estado central: `faseJogo`, `detective`, `horasJogo`, `horasChegadaCena`,
  `localidadeAtual`, `nosDesbloqueados`, `cartasRegistradas`, `conclusoes`, `acusacao`,
  `log`, `temperaturaMedida`.
- `conclusoes` guarda **só** a leitura do legista (`origem: 'mestre'`), exibida como
  dica — não vincula o veredicto.
- Determinismo: `Math.random()`/`Date.now()` proibidos em `src/logic|data|store`
  (guarda no `qa.mjs`); variação vem de `hashString` (`src/logic/hash.js`) salgado.
  O three.js usa `Math.random` em internos (uuid) — apresentação, exceção registrada.
- QA de UI: os textos de botões/rótulos clicados pelo `qa-ui.mjs`, as classes
  `.termo-clicavel`/`.termo-extraido`, o `data-overlay` e a ordem dos `<select>` do
  mural são intocáveis — mudar qualquer um exige atualizar o QA no mesmo commit.
- Código e comentários em português.
- Repositório: `github.com/santosbruno94/mortem-new`. Commits entre cada incremento
  maior.

---

## 17. Regras de desenvolvimento

- **Perfil do criador:** advogado sem background em programação. Instruções devem ser
  executáveis sem conhecimento prévio de dev.
- **Não criar features nem gastar tokens sem ordem expressa.** Design antes de build;
  confirmação antes de execução.
- Cada iteração é um **incremento jogável**, não um redesign.
- Prioridade: jogabilidade > complexidade técnica > visual.
- Medicina legal tecnicamente precisa, sempre (§15 + `docs/kb-medicina-legal/`).
- **Prosa segue o guia de estilo e passa pelo pipeline `revisar-prosa`** antes de
  commit (zero achados bloqueantes).
- Toda feature testável no navegador antes de avançar.
- Edições direcionadas a documentos/código existentes; explicitar o que NÃO deve mudar.
- Critério de validação de casos: resolúvel pelo Jogador Metódico; com ao menos 1
  armadilha para o Apressado; e Impunidade alcançável pelo Intuitivo (réu certo sem
  provas).
