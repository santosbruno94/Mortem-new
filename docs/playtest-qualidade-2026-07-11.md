# Playtest de Qualidade — "O Álibi de Corda"

**Data:** 11 de julho de 2026 (mesmo dia, sessão posterior ao diagnóstico funcional)
**Método:** playtest crítico de DESIGN, não de funcionamento. O diagnóstico da manhã
(`docs/playtest-2026-07-11.md`) perguntou "o jogo funciona?" — e, com as decisões
D1–D8 aplicadas, funciona: build limpo, `qa.mjs` CASO VÁLIDO, `qa-ui.mjs` UI VÁLIDA
13/13, zero erros de console em todas as rodadas desta sessão. A pergunta de agora é
outra: **o jogo é bom?** O que falta para ser *realmente* bom?

Foram jogadas quatro rodadas completas pela interface real, cada uma encarnando um
jogador diferente, com transcrição integral do que aparece na tela:

- **Rodada A — o jogador honesto de primeira viagem** (Harlan): lê tudo, pergunta
  tudo, corpo primeiro, rota completa incluindo Moorford, acusação correta.
  Resultado: Vitória Absoluta na primeira submissão; 87 cliques; relógio 11h00→16h30.
- **Rodada B — o min-maxer adversarial** (Harlan): **não lê uma linha de prosa**;
  extrai os negritos mecanicamente e tenta vencer só com o lembrete do legista, a
  caixa "O que faltou" e a retentativa grátis. Resultado: **Vitória Absoluta na 5ª
  submissão, sem exercer nenhuma dedução**.
- **Rodada C — os desfechos ruins como experiência** (Lenore/Harlan): cair de
  propósito, mas honestamente, em Erro Judiciário (acreditar no caseiro, acusar a
  governanta) e em Sucesso com Gafes (tripé sólido, cadeia lacunosa).
- **Rodada D — a segunda jogada** (Lenore): rejogar sabendo a resposta. Resultado:
  Vitória Absoluta com 54 cliques e 3h de relógio, **pulando a cena do crime,
  Blackwood e Moorford** — e um monólogo final palavra por palavra idêntico ao da
  Rodada A.

**Nenhuma linha do jogo foi alterada.** Screenshots citados em
`docs/playtest-qualidade-2026-07-11/`.

---

## 1. Veredicto do crítico

O que o jogo promete de único — observação pura, zero feedback, "nem todo mentiroso
é culpado", acusação construída com as próprias mãos — está de pé e **é sentido**
nos melhores dez minutos da experiência: a leitura do legista crescendo sinal a
sinal sobre o corpo, a prosa das localidades (a melhor coisa do jogo hoje), a
armadilha do fio de lã que aponta para a governanta errada, o instante em que o
jogador percebe que a janela do corpo desmente a vizinha.

Mas o playtest adversarial mostrou que **o tutorial atualmente trai três dos seus
próprios pilares**:

1. **"O jogo nunca entrega conclusões"** — entrega. O lembrete do legista, fixo no
   topo do mural, dita janela, causa e instrumento; a Estação I é um exercício de
   transcrição (§3.1).
2. **"Dedução anti força-bruta" + "errar tem consequência"** — não no tutorial. Com
   retentativa grátis, dicas que nomeiam a peça exata a corrigir e um monólogo de
   erro que **revela o nome do culpado**, um jogador que não leu nada venceu em 5
   submissões (§3.2).
3. **"O desfecho mede a cadeia construída"** — nem sempre. O monólogo credita ao
   jogador deduções que ele não fez: encenação "exposta" sem nunca refutar o relógio
   forjado, paradeiro de Blackwood "conferido" sem nunca tê-lo interrogado (§3.3).

Nada disso é bug de código — o motor faz exatamente o que foi mandado. São decisões
de generosidade pedagógica que, somadas, **desligam o desafio que o design promete**.
O segundo bloco de achados é de superfície: o ato final recompensa pouco (150
palavras e um reload), a atmosfera visual entrega uma fração da fantasia declarada
("mesa de madeira à luz de vela" virou retângulos cinza sobre fundo escuro, sem som,
sem textura), e a seed fixa faz a segunda jogada ser um reencontro literal, idêntico
até na pontuação.

A fundação é boa. O que falta para "realmente bom" não é conteúdo novo — é devolver
o desafio ao jogador e pagar o investimento dele no final.

---

## 2. O que já é bom (e não se deve mexer)

- **A prosa e as vozes.** Wycliffe que se desculpa pela própria prolixidão, Hudson
  de monossílabos, Blackwood que "fala alto e seca canecas", Edgar de polidez
  passada a ferro. O teste do nome coberto passa. A observação pura aguenta o peso:
  o jogo mostra lascas de tinta caídas para fora e chaves nas fechaduras e **nunca
  diz "encenado"**.
- **A fala do legista que cresce.** Extrair sinal por sinal no corpo e ouvir a
  leitura se montando ("A família, isto dá; a espécie, só a assinatura crava") é o
  melhor loop momento-a-momento do jogo — didático, diegético, com autoridade.
- **A caderneta.** Carimbos "OBSERVADO ÀS", diário de viagens, leitura do legista
  arquivada. Memória externa completa, custo zero, sem opinar.
- **O Painel de Álibis** e sua última linha ("Cotejar cada faixa com a Janela da
  Morte é ofício de quem constrói a acusação") — o tom exato do jogo inteiro.
- **As armadilhas funcionam contra o jogador honesto.** Na Rodada C, acreditar no
  caseiro e acusar a governanta produziu um Erro Judiciário *justo e legível*: o
  monólogo enumera cada furo da cadeia com precisão e sem burocracia.
- **A refutação do relógio esmagado dentro da mesma gramática das testemunhas**
  (uma "mentira de hora" como as outras) é uma elegância de design que merece
  sobreviver a qualquer refatoração.

---

## 3. Os três achados estruturais

### 3.1 A dedução central é delegada ao legista (Rodadas A e B)

O caso pede duas deduções-mestras: *quando* (interseção de rigor + livor + algor +
visto-vivo) e *como* (assinatura do sulco horizontal elimina o enforcamento). O
motor sabe fazer as duas pela gramática universal — e **faz, e conta a resposta**:

> LEMBRETE DO LEGISTA — *Morto entre 20h00 e 23h00 de 13/out. […] Quanto ao meio, os
> sinais fecham em estrangulamento por ligadura, com corda de cânhamo.*

Isso fica fixo no topo do mural (`a-mural-lembrete-dita.png`), três centímetros
acima dos dropdowns onde o jogador "afirma" a janela e da lista onde "afirma" a
causa. As ligações das cartas às âncoras Quando/Como nem existem como gesto: são
auto-criadas ao abrir o mural (`MuralAcusacao.jsx:107-113`). O glossário, o catálogo
de causas e o modelo de tempo — o coração intelectual do jogo — nunca precisam ser
usados. Na Rodada B, o min-maxer que jamais leu o corpo copiou o lembrete e acertou
janela e causa na segunda tentativa.

O §7 do contexto diz que a dica é deliberada no caso-escola e que o procedural não
terá mestre. Mas o caso-escola é 100% do jogo jogável hoje — e nele o pilar nº 2
("a interpretação é do jogador") não é exercido nas duas perguntas centrais do
ofício do perito.

### 3.2 O ato final é força-brutável com oráculo (Rodada B)

Três decisões, cada uma defensável isolada, empilham-se num exploit:

1. **"O que faltou — cortesia do tutorial"** nomeia a peça e o gesto: "puxe à âncora
   Presença o vestígio que põe o réu na cena", "o móbil apontado não é o que move o
   réu", "reexamine o pescoço da vítima".
2. **Retentativa infinita e grátis** (relógio congelado no mural, mesa intacta).
3. **O monólogo do Erro Judiciário revela o culpado**: "…e Edgar Arthurs assiste sem
   pestanejar". Após o primeiro erro, o "quem" está entregue.

Sequência real da Rodada B: T1 acusação-lixo (Hudson, afogamento, janela da manhã) →
T2 copia o lembrete + réu seguinte → T3 Edgar → T4 vestígio certo → T5 remove um
barbante espúrio → **Vitória Absoluta**, com o mesmo monólogo triunfal do jogador
metódico da Rodada A. Vazamentos menores ajudam: a Estação IV filtra móbeis por réu
(escolher Hudson exibe "Nenhuma carta de móbil ligada a este réu" — o jogo confessa
de graça que ela não tem motivo).

O §11 já registra a retentativa como regalia do caso-escola com consequência "em
aberto" para os próximos casos. Este playtest mostra que o problema não espera os
próximos casos: **no único caso que existe, o desafio anunciado pode ser contornado
em dez minutos**, e o jogador que o contorna recebe exatamente a mesma recompensa.

### 3.3 O monólogo credita deduções não feitas (Rodadas A, C e D)

O contrato do desfecho — "o monólogo mede a cadeia construída" — quebra em três
pontos observados:

- **Encenação.** Basta refutar *qualquer* mentira de hora (a vizinha, o caseiro)
  para `descuidosOk` valer (`veredicto.js:110-118`) e o monólogo declamar: "E
  apontei, um a um, os descuidos da encenação: a cena arrumada para marcar 09h00" —
  na Rodada D isso foi dito a um perito que **nunca visitou a cena do crime**. Na
  Rodada C, foi dito a uma perita cuja tese (governanta à meia-noite) nem envolvia
  a encenação.
- **Juízo sobre Blackwood.** Declarar "Inocente" sobre `inocente_alibi` é aceito
  incondicionalmente (`veredicto.js:144-146`) — sem nunca ter interrogado o homem
  nem coletado o álibi dele. O monólogo então afirma: "o paradeiro que firmei não
  cruza a janela da morte" — paradeiro que não está na mesa.
- **Instrumento contraditório.** Acusando Blackwood com o fio de lã ligado, o
  monólogo abre com "mediante estrangulamento por ligadura **(lã cinzenta)**" e dois
  parágrafos depois admite "o vestígio que invoquei não liga o acusado ao
  instrumento" (o template injeta o `tipoVestigio` do primeiro vestígio ligado,
  mesmo quando ele contradiz a tese). E "apontei, **um a um**, os descuidos" sai
  com uma única refutação feita.

Para um jogo cuja alma é "cada frase do desfecho corresponde a um gesto seu", esses
créditos falsos corroem exatamente o que diferencia MORTEM de um quiz.

---

## 4. Diagnóstico por dimensão

### 4.1 Dedução — *profunda no meio, rasa nas pontas*
As deduções genuínas que restam ao jogador honesto: (1) refutar o avistamento da
vizinha com a janela do corpo — o "momento Obra Dinn", e funciona; (2) o fio de lã ↔
xale da governanta — ótima, com pista visual e recompensa dupla (armadilha se mal
lida, absolvição fundamentada se bem lida); (3) as fibras de cânhamo no punho de
Edgar. As duas perguntas centrais (quando/como) são ditadas (§3.1); o motivo é um
formulário de 2 opções; os juízos periféricos, botões. **O caso tem exatamente uma
dedução difícil (Hudson) e ela é a melhor coisa do design do caso.**

### 4.2 O furo do álibi de Edgar não tem onde ser dito
A viagem mais cara do jogo (3h ida-e-volta a Moorford) rende a prova mais
incriminadora — o porteiro desmente o álibi do réu. E **não existe lugar no mural
para afirmá-la**: a Estação III só aceita mentiras de hora da morte (relógio,
vizinha, caseiro); a Estação V só confronta paradeiro de *não-acusados* — o réu fica
de fora por definição. O monólogo da vitória não menciona Moorford. O contexto (§14)
chama isso de "corroboração opcional, nunca pilar" — mas na experiência é o "aha"
mais forte da investigação terminando em anticlímax: o jogador descobre que o álibi
do assassino é mentira e a acusação não tem uma linha para dizê-lo.

### 4.3 Economia e desafio — *o relógio mole não morde*
Rota completa: 5h30 de relógio. Rota vencedora mínima: 3h. O perecível só perde
precisão de verdade depois de ~24h de IPM — inalcançável numa primeira jogada
razoável. Não há evento que consuma tempo, nada compete com nada, a ordem quase não
importa. A única decisão econômica real (ir ou não a Moorford) não tem consequência
mecânica (§4.2). Resultado: a "pressão de rota" prometida (§2.8) não é sentida em
nenhum momento. O Apressado da Rodada C falhou por **crença errada**, não por
gestão de tempo — a armadilha funciona, mas o *tempo* nunca foi o vilão.

### 4.4 Payoff — *150 palavras e um reload*
A Vitória Absoluta paga 5 parágrafos e um botão "Encerrar o caso" que recarrega a
página. Sem epílogo (o que acontece a Edgar? à governanta e seu segredo exposto? a
Wycliffe, que jurava pelo relógio?), sem balanço da investigação (horas gastas,
o que ficou por ver, com o que se venceu), sem cerimônia. *Papers, Please* fecha
cada dia com contas e consequências; *Obra Dinn* fecha cada tríade com o caderno se
preenchendo. MORTEM fecha com `window.location.reload()`.

### 4.5 Atmosfera — *a fantasia declarada não está na tela*
O §3 promete "mesa de madeira escura à luz de vela". A tela entrega retângulos
`stone-900` chapados sobre fundo escuro (`a-mesa-cheia.png`), tipografia Georgia de
sistema, uma única animação (fade de 240ms no mural), **nenhum som** e barbante de
1px (`a-mural-barbantes.png`). É legível e disciplinado — e genérico. Nada envelhece
o papel, nada tremula, nada pesa. Do trio de referências, *Cultist Simulator* vive
80% do seu encanto no tato das cartas; MORTEM hoje entrega talvez 20% da própria
direção de arte escrita. (Consciente de que a prioridade declarada é jogabilidade >
visual — registrado como a maior dívida de *superfície*, não como a mais urgente.)

### 4.6 Rejogabilidade — *zero por construção*
Seed fixa + variantes por hash da seed = **o mesmo texto, sempre**: o monólogo da
vitória da Rodada D (Lenore) é caractere por caractere o da Rodada A (Harlan). A
troca de perito altera pronomes e tratamentos, nada mais. A segunda jogada leva ~10
minutos e não revela nada novo. Aceitável para um tutorial de campanha; fatal
enquanto o tutorial for o produto inteiro. (As duas máximas empilhadas na
Impunidade — "Sei quem foi. Não provei que foi." + "A certeza sem prova não prende
ninguém, e eu que o diga" — são, pela mesma razão, determinísticas: *todo* jogador
de Impunidade lê as duas juntas, acima do teto do guia §4.5.)

### 4.7 Clareza e fricções menores
A interface ensina bem pela forma (custos anunciados nos nós, "examinar não custa
tempo" no rodapé, estados vazios corretos). Fricções observadas:
- Mesa final com 26 cartas em grade uniforme, sem agrupamento por domínio/local —
  busca visual custosa (`a-mesa-cheia.png`).
- Na retentativa, o mural **sempre reabre na Estação I** (dados preservados,
  navegação não — `MuralAcusacao.jsx:75`): 4 cliques de "Concluir esta parte" para
  voltar ao ponto.
- A gafe do vestígio acessório é a única falha **sem dica** no "O que faltou"
  (`nexo_acessorio` não consta de `DICAS_TUTORIAL`) — o único momento em que o
  tutorial abandona o aluno.
- A carta do termômetro entrega a conta pronta ("11 a 15 horas decorridas") — o
  jogador nem precisa do 1°C/h do glossário.
- Dropdowns de hora com 25 opções ×4 na Estação I: burocrático.
- Não há ponte carta→glossário (ex.: "Corpo Endurecido" → verbete Rigor Mortis).

---

## 5. Benchmark contra as referências declaradas

| Referência | O que ela entrega | Onde MORTEM está |
|---|---|---|
| *Obra Dinn* | Validação em lotes de 3 (confirma sem apontar qual); dedução nunca ditada; caderno que se preenche como recompensa | Zero validação durante o jogo (fiel ao pilar), mas o legista dita as respostas centrais e o desfecho credita o não-feito |
| *Papers, Please* | Pressão econômica real; cada dia fecha com consequência narrada | Relógio sem dentes; desfecho fecha com reload |
| *Cultist Simulator* | Tato, som, cartas com peso e verso; a mesa é um lugar | Mesa legível porém sem matéria; sem som; 1 animação |

O desenho de MORTEM tem uma ideia que nenhuma das três referências tem — a acusação
construída peça a peça com barbante — e é nela que o jogo menos investe produção
(estética e narrativa) hoje.

---

## 6. Recomendações — decisões para o criador (Q1–Q9)

Nenhuma foi aplicada. Ordenadas por impacto na qualidade percebida; custo estimado
em tamanho de mudança, não em promessa de prazo.

**Q1 — Restaurar o contrato do monólogo (correção, custo baixo).** O desfecho só
narra o que foi ligado: (a) encenação exposta exige refutação de hora *do relógio
forjado* (tag própria), senão o bloco fala genericamente da mentira desmontada sem
citar os 09h00; (b) o bloco de Blackwood só afirma "o paradeiro não cruza a janela"
se o álibi dele estiver na mesa — senão, "não vi razão para o acusar" (juízo sem
prova continua aceito, mas narrado como opinião, não como perícia); (c) instrumento
no template sai do *mecanismo cravado*, não do primeiro vestígio ligado; (d) "um a
um" só com ≥2 refutações. É o conserto mais barato com o maior efeito sobre a alma
do jogo.

**Q2 — Dar preço à retentativa (design, custo baixo).** Manter a resubmissão no
caso-escola, mas: cada "Revisar a acusação" custa horas no relógio (a audiência se
adia) e o monólogo do Erro Judiciário **não nomeia o culpado** enquanto houver
retentativa disponível (o nome só sai no encerramento definitivo). Com isso a força
bruta deixa de ser grátis e o "quem" volta a ser trabalho do jogador. Alternativa
mais dura: 3 submissões e o caso sela.

**Q3 — Tirar o ditado do legista do mural (design, custo baixo).** A leitura falada
continua no exame do corpo e na caderneta (é a melhor cena do jogo), mas o topo do
mural perde a síntese pronta: no lugar, só o checklist neutro. Quem quiser copiar a
resposta ainda pode ir à caderneta — mas agora é um gesto consciente de consulta,
não um gabarito pendurado sobre a prova. Opção complementar (mais ambiciosa): o
legista fala as *leituras por sinal* e cala a síntese (a interseção vira conta do
jogador, com o glossário).

**Q4 — Dar voz ao álibi furado do réu (design, custo médio).** A Estação III passa
a aceitar também o álibi *do réu* como alegação de hora refutável (pelo
`corrob_moorford` ou pelos fatos do corpo), e o monólogo ganha um bloco condicional
("E a noite de clube que ele jurou, o livro de presença desjurou"). Moorford deixa
de ser beco sem saída narrativo e a viagem mais cara do jogo passa a pagar no ato
final. ("Corroboração nunca é pilar" se preserva: refutar o álibi do réu não é
exigido para nada — só passa a *poder ser dito*.)

**Q5 — Epílogo e balanço (conteúdo, custo médio).** Após o monólogo, um fecho por
desfecho: 2–3 parágrafos de consequência (o julgamento de Edgar; o destino da
governanta — sobretudo se o jogador expôs o segredo dela; Wycliffe e o seu relógio)
+ um retrato da investigação (horas usadas, locais visitados/ignorados, cartas
coletadas/total, gafes). Barato em motor (os dados já existem em `veredicto` e no
store) e transforma o reload num encerramento.

**Q6 — Dar dentes ao relógio nos próximos casos (design, registrar agora).** O
tutorial pode continuar mole; mas o contexto deve registrar desde já o mecanismo
que fará a pressão de rota existir de verdade na campanha: janelas de
disponibilidade (testemunha que sai, clube que fecha, enterro marcado), evento que
consome tempo, ou perecível mais rápido. Sem isso, o pilar §2.8 seguirá sendo
apenas texto.

**Q7 — A superfície da fantasia (visual/som, custo alto, prioridade média).** Uma
passada de direção de arte com alvo pequeno e concreto: textura de madeira na mesa
e papel nas cartas, uma fonte serifada de época (licença livre), verso de carta,
barbante com espessura/sombra, 4–5 sons (papel, sino de viagem, arranhar de pena,
lacre no selo, vela). Não é redesign: é dar matéria ao que já está desenhado.

**Q8 — Variação de texto entre partidas (prosa/motor, custo médio).** Hoje o hash é
só da seed → mesma partida, mesmo texto, sempre. Salgar a escolha de variantes com
o perito escolhido (`detective.name`) já faria Harlan e Lenore soarem diferentes na
segunda jogada sem quebrar o determinismo (mesma escolha + mesmo perito = mesmo
texto). Resolver junto o P6 residual: proibir por construção máxima na abertura E
no fecho do mesmo desfecho (a Impunidade atual serve as duas, deterministicamente).

**Q9 — Fricções de mesa e mural (UX, custo baixo, lote único).** Agrupar a mesa por
domínio (ou por local de coleta); retentativa reabre o mural na estação da primeira
pendência; dica para `nexo_acessorio` ("Um dos vestígios ligados não é do réu —
solte o barbante que sobra"); carta→verbete do glossário; dropdowns de hora mais
curtos (janela por faixas de 1h já cobertas pelos sinais); carta do termômetro sem
a conta pronta (só a leitura, a aritmética é do glossário).

---

## 7. Nota final

O diagnóstico da manhã terminou com "o que falta é acabamento de superfície — nada
estrutural". Esta sessão, jogando contra o design em vez de a favor, encontrou o
que aquele ângulo não podia ver: **o tutorial, hoje, permite vencer sem jogar o
jogo que o MORTEM_CONTEXTO descreve**. A boa notícia é que a distância entre "o
que o jogo é" e "o que o jogo diz que é" está quase toda em quatro pontos baratos
(Q1–Q4): nenhum exige conteúdo novo, motor novo ou prosa nova em escala — exigem
tirar ajudas que se acumularam e deixar o desenho original respirar. Feito isso,
o caso-escola já seria um jogo de dedução exigente e justo; com Q5 e Q7, seria
também um jogo *bonito de terminar*.

---

## Adendo (11/07/2026, mesma data): decisões Q1–Q9 aplicadas

Por ordem do criador, as nove recomendações foram executadas no mesmo dia:

- **Q1 — contrato do monólogo restaurado.** A encenação só é creditada se o jogador
  refutou a própria peça forjada (tag `encenado` no relógio — `veredicto.js`); derrubar
  testemunhas vira mérito narrado à parte ("o corpo prevaleceu"). O bloco de Blackwood
  só afirma "o paradeiro que firmei" com o álibi dele na mesa (senão: "foi convicção
  minha, não perícia"). O instrumento narrado sai do sinal que cravou a causa, nunca
  do vestígio avulso. O "um a um" morreu com a frase antiga.
- **Q2 — retentativa com preço.** "Revisar a acusação" custa 2h (`CUSTO_REVISAO`);
  a audiência adia-se, com linha no diário. O Erro Judiciário não nomeia o culpado
  enquanto há retentativa — o nome sai só no encerramento definitivo.
- **Q3 — o gabarito saiu do mural.** O lembrete do legista não existe mais; ficou o
  checklist neutro. A leitura segue no exame do corpo e na Caderneta (consulta é gesto).
- **Q4 — o álibi do réu tem voz.** A Estação III aceita o paradeiro do réu como
  alegação refutável; a corroboração de Moorford (`horaFimObservada`) o derruba; o
  monólogo diz: "o paradeiro que jurou caiu pelo próprio registro". Opcional, nunca pilar.
- **Q5 — epílogo e retrato.** "Encerrar o caso" abre o Epílogo (templates universais:
  destino do réu, dos periféricos e do perito — `src/logic/epilogo.js`) + "O retrato
  da investigação" (horas, lugares, observações, julgamentos); só "Fechar o caderno"
  encerra.
- **Q6 — dentes do relógio registrados.** `MORTEM_CONTEXTO.md` §10: pressão de rota
  na campanha virá de janelas de disponibilidade/eventos; perder tempo custa ACESSO,
  nunca solvabilidade.
- **Q7 — a fantasia na tela.** Madeira, grão e luz de vela procedurais; papel e sombra
  nas cartas; carta que chega virando do verso; barbante com corpo; fonte de época
  IM Fell English embarcada (OFL); 5 sons sintetizados offline (papel, sino, barbante,
  lacre, pena) com interruptor "Som" no rodapé. Zero rede em runtime.
- **Q8 — variação por perito + teto de máximas.** O hash das variantes é salgado com
  o nome do perito (Harlan e Lenore leem desfechos diferentes); cada variante declara
  `maxima` e abertura-máxima só sorteia fecho sem máxima — o P6 residual morreu por
  construção (novo fecho sóbrio na Impunidade).
- **Q9 — fricções limadas.** Mesa agrupada por domínio; mural de retentativa reabre
  na primeira pendência; dica para a gafe do vestígio acessório; ponte carta→verbete
  na Caderneta (Glossário abre no verbete); seletor de janela em 2 controles (dia+hora
  combinados, limitado ao intervalo plausível do caso); termômetro sem a conta pronta.

**Verificação:** build limpo; `qa.mjs` CASO VÁLIDO (11/11, com 2 checagens novas:
contrato da encenação e álibi do réu); `qa-ui.mjs` UI VÁLIDA (22/22, cobrindo o mural
sem gabarito, o custo da retentativa, o culpado oculto até o epílogo e o retrato).
Prosa nova validada pelo pipeline `revisar-prosa` (parecer no commit).
