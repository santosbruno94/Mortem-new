# OS-R3 — A Abertura

**Mestra:** OS-R0. **Decisões:** D12, D13, D21 (coroner Bramwell Foy), D23 (Abbot).
**Guardas:** G2, G3, G4, G8, G10, G11, G12.
**Pré-requisito:** OS-R2 com ata (fechada em 25/07/2026).
**Estado: FECHADA em 25/07/2026.** Ata em `docs/historico-decisoes.md`. O pipeline
`revisar-prosa` reprovou na primeira passada com **três bloqueantes, um por revisor**;
todos corrigidos, segunda passada com o gate global verde.
**Namespace de sal:** nenhum. Esta OS escreve prosa fixa do caso-escola; não gera variação.

Escrita no fecho da OS-R2, contra a árvore real, como a OS-R0 §4 manda.

---

## 1. Por que esta OS existe

A abertura do caso-escola é a primeira coisa que um jogador lê, e hoje ela erra o
aparato legal da Inglaterra de 1893 num ponto que a KB do projeto trata como
estrutural: **quem manda examinar um corpo, e quem paga por isso.**

Três defeitos, todos já levantados e nenhum ainda corrigido:

**(a) A carta de Wycliffe assume autoridade que um constable não tinha.**
`abertura.js:60` diz *«Briarstone paga os seus honorários e, se o caso assim pedir, o
seu silêncio»*. Um constable rural é **coroner's officer** — o intermediário que
notifica —, não contratante. Quem **ordena** o exame e quem o **remunera** é o
**coroner**, pelo Medical Witnesses Act 1836, até £2 2s pela necrópsia e pelo
testemunho (`kb-medicina-legal/inquerito-e-policia.md` §1). Achado do
`perito-forense` no fecho da OS-R1, expressamente adiado para esta OS.

**(b) A forma epistolar é moderna.** O vocativo com travessão (*«Dr. Abbot —»*) e a
subscrição nua (*«— Lemuel Wycliffe, guarda»*) são de carta do século XX. A época
pedia *«Senhor —»* na abertura e uma fórmula de despedida (*«Sou, senhor, seu criado
obediente»*). Mesmo achado, mesma origem.

**(c) Falta o prazo.** O relógio de MORTEM só ganha peso porque alguma coisa acontece
quando ele acaba — e hoje nada acontece. A D12 põe o coroner em campo **fora de cena**
justamente para isto: o inquérito tem data, e a data é a pressão. Sem ela, "o dia do
perito" é uma convenção de jogo; com ela, é uma obrigação legal com hora marcada.

E uma quarta coisa, que não é defeito e sim promessa por cumprir: a **D13** manda que a
abertura testemunhal — hoje só dos casos gerados — vire **molde de todos os casos**. O
tutorial abre na pensão de Caulfield; o caso gerado abre nos olhos de quem achou o
corpo. A D13 diz que o segundo é o certo, e que o primeiro tem de o adotar sem perder o
que a pensão faz de bem (a pobreza de Harlan, o termômetro trincado, o mestre ausente).

---

## 2. Escopo

**Entra:**

| O quê | Onde |
|---|---|
| Passo novo de cold open testemunhal (D13) | `src/data/abertura.js` |
| A ordem do coroner Foy, com o prazo do inquérito (D12, D21) | `src/data/abertura.js` |
| Carta de Wycliffe: autoridade e forma epistolar corrigidas | `src/data/abertura.js` |
| Telegrama de Abbot: acompanha o novo aparato | `src/data/abertura.js` |
| Verbete de voz do coroner | `docs/biblia-de-vozes.md` |
| Bandeira de apresentação do suporte novo | `src/components/Abertura.jsx` |
| Contagem de passos da abertura | `scripts/qa-ui.mjs` |

**Não entra:**

- **Nenhuma carta nova, nenhuma tag nova, nenhuma mudança de veredicto.** O prazo do
  inquérito é **ficção e pressão narrativa**, não mecânica: nada no motor o lê, nenhum
  desfecho muda por causa dele. Ligá-lo ao relógio é decisão de desenho por tomar, e
  fica registrada em §7 como aberta.
- O coroner como **cena**. A D12 é explícita: prazo e autoridade, nunca uma cena. Foy
  não fala com o perito, não aparece, não tem retrato. Existe em papel timbrado.
- O elenco da OS-R4 (Amos Kell, a Sra. Wick, o estalajadeiro, a torre de S. Miguel).
- «lavrar termo» / «lavrar queixa» em `abertura.js:123` — é da **OS-R8**, registrada e
  não tocada, ainda que a linha fique ao lado do que esta OS mexe.
- A abertura dos casos **gerados** (`pacote_gerado.js`). O molde nasce aqui e o gerador
  o herda na **OS-R9**, como a OS-R0 §8 já fixou. Esta OS não toca no gerador, e
  portanto `casos_gerados.js` fica **fora do diff**. *(G12)*

---

## 3. A forma nova da abertura

Oito passos, contra sete. O que muda é a ordem de revelação: hoje o jogador sabe do
crime pela boca de quem o convoca; passa a saber **pelos olhos de quem o encontrou**.

| # | id | O que é | Estado |
|---|---|---|---|
| 1 | `descoberta` | **NOVO.** Cold open testemunhal: a manhã de sábado na High Street | escrever |
| 2 | `caulfield` | A pensão da Sra. Potts, Caulfield | conservar |
| 3 | `sra_potts` | Batem à porta: o formulário e a carta | rever (o maço passa a três papéis) |
| 4 | `telegrama` | O telegrama do Dr. Abbot | rever |
| 5 | `ordem_do_coroner` | **NOVO.** A ordem de Bramwell Foy, e a data do inquérito | escrever |
| 6 | `carta` | A carta do guarda Wycliffe | reescrever (autoridade + forma) |
| 7 | `transformacao` | A mesa vira escrivaninha de perícia | rever (o prazo entra no pensamento) |
| 8 | `briarstone` | A chegada e o encontro com Wycliffe | conservar |
| 9 | `briefing` | O relato do guarda, com as quatro perguntas | conservar |

*(São nove entradas porque `briefing` já era um passo à parte; a contagem de avanços que
o `qa-ui.mjs` faz passa de 6 para 8 — ver §6.)*

### 3.1 O cold open (passo 1)

**Regra da cerca, herdada do gerador e agora normativa.** O cold open é **observação
pura de leigo**: quem, a que hora chegou, o que fez. Nunca estado físico da cena (porta
trancada ou forçada, posição do corpo, sangue, temperatura, desordem), nunca mecanismo,
nunca hora da morte, nunca juízo. Os fatos duros ficam na carta e no briefing, que são
os portadores fair-play. *(G2, G4)*

**Cerca adicional, própria do caso-escola e que o gerador não precisa ter.** Quem achou
o corpo foi **Silas Crane**, o oficial da relojoaria — e Silas é o réu. Um cold open
pelos olhos dele é a coisa dramaticamente mais forte que esta abertura pode fazer (na
segunda leitura, tudo o que ele faz muda de sentido) e é também o lugar mais fácil do
jogo inteiro para quebrar a **G3**: *nenhum molde de texto pode ramificar em
`reuCorreto`; Silas não recebe marca textual que os inocentes não recebam.* O ponto de
decisão está em §5 — **o martelo é do utilizador**, e a OS não escolhe por ele.

Qualquer que seja o POV escolhido, valem estas três:

1. **Nada do que o descobridor faz é lido como suspeito nem como inocente.** Se o texto
   admite a leitura «este homem está a fingir», admite igualmente «este homem está em
   choque». Se só admite uma, está errado.
2. **Nenhuma hora da morte.** A hora da *descoberta* (9h20 de sábado) é fato público e
   pode entrar; a da morte é o que o jogador vai comprar com perícia.
3. **O relógio da lareira não é mencionado.** É a isca central do caso e tem de ser
   colhida na cena, não recebida de graça.

### 3.2 A ordem do coroner (passo 5)

Um **impresso**, não uma carta: papel do condado, campos preenchidos à mão sobre texto
de fôrma. É o que dá ao perito o direito de tocar no corpo, e é o que traz a data.

Tem de dizer, em substância e sem virar aula:

- **Quem ordena:** Bramwell Foy, coroner do condado, sob o Coroners Act 1887.
- **O que ordena:** exame do corpo de Geoffrey Arthurs e comparecimento a depor.
- **Quanto paga:** a tabela do Medical Witnesses Act 1836 — £2 2s pelo exame e pelo
  testemunho. É o dinheiro que Harlan não tem, e a KB dá o número.
- **Quando:** **o inquérito abre segunda-feira, 16 de outubro, às dez da manhã, no
  Wheatsheaf.** O pub é a sala de audiência natural de 1893 (a proibição só vem com o
  Licensing Act 1902), e a estalagem já existe no caso.
- **A quem se dirige:** aqui está o segundo martelo. O impresso nomeia **o Dr. Abbot** —
  é a ele que o coroner conhece e a ele que a lei paga —, e Harlan chega a Briarstone
  com uma autorização que **não tem o seu nome**. Ver §5.

**Foy nunca fala fora deste papel.** O registro é o do formulário: impessoal,
declarativo, sem uma única cortesia. É a única voz do jogo que não tem idioleto — e não
o ter *é* o idioleto dele. *(D12)*

### 3.3 A carta de Wycliffe (passo 6)

Reescrita em três pontos, e **só nestes três**:

1. **A autoridade sai.** Wycliffe não contrata e não paga: ele **notificou o coroner**,
   como é o seu ofício de *coroner's officer*, e escreve porque tem um corpo em casa e
   uma vila a olhar para ele. A frase dos honorários e do silêncio cai.
2. **A forma entra.** *«Senhor —»* na abertura; fórmula de despedida antes da
   assinatura. A subscrição de época é deferente e um pouco longa; a de Wycliffe pode
   tropeçar nela, que é o tique dele (a bíblia: *«adora uma frase que se ache
   espirituosa e às vezes tropeça nela»*).
3. **O que ele fez, ele conta.** Pôs um homem à porta, mandou que nada se tocasse,
   escreveu ao coroner. Este é o retrato certo do constable de 1893: *«ele guarda a
   porta; não conduz o raciocínio»* (`inquerito-e-policia.md` §2).

**O que NÃO muda:** os fatos que a carta carrega (o nome, o ofício, a garganta aberta, a
loja revirada, «não toquei em nada»). São portadores fair-play e o jogador conta com
eles. *(G4)*

### 3.4 O telegrama de Abbot (passo 4)

Mexe pouco, e por uma razão só: hoje Abbot despacha Harlan como quem manda um recado
(*«VA OLHE O CORPO MANDE RESUMO PELO PRIMEIRO CORREIO. NAO ASSINE NADA»*), e a partir
desta OS existe um papel do coroner com o nome de Abbot nele. O telegrama tem de
explicar por que o mestre não vem — e a **G8** vale mesmo aqui: *Abbot pode subestimar
suficiência; não pode afirmar facto falso sobre o corpo.* Ele não viu o corpo. Ele pode
achar que é briga de taberna; não pode dizer que é.

«NAO ASSINE NADA» ganha, de graça, o sentido que sempre quis ter: com o impresso do
coroner ao lado, deixa de ser mania e passa a ser instrução — **quem assina o exame
responde por ele, e Harlan não tem registro.** A D25 já dizia que Harlan assina as
mortes pequenas em nome de Abbot e nunca assinou uma grande. Esta é a grande.

---

## 4. Guardas

**GR3-1.** O cold open não revela mecanismo, hora da morte, estado da cena nem culpado,
e nada do que o descobridor faz admite uma leitura só. *(G2, G3, G4)*

**GR3-2.** Zero cartas novas, zero cartas removidas, zero tags tocadas. A abertura é
prosa: `cartas.js` **fora do diff**. *(G11)*

**GR3-3.** O prazo do inquérito é ficção. Nenhuma regra de `src/logic` o lê, nenhum
veredicto muda, os quatro perfis do `qa.mjs` devolvem os quatro desfechos **e as mesmas
horas** de hoje (17h00 · 18h00 · 14h00 · 13h00).

**GR3-4.** O aparato legal bate com a KB, ponto a ponto: coroner ordena e paga
(Medical Witnesses Act 1836, £2 2s); constable é *coroner's officer*; inquérito no
public house; Coroners Act 1887. Validação pelo `perito-forense`, no pipeline.

**GR3-5.** O gerador não se toca. `casos_gerados.js` e `casos_indice.js` fora do diff,
`sha256` intacto. *(G12)*

**GR3-6.** Todo marcador estrutural sobrevive: as interpolações `{detective.campo}` e
`{g:masc|fem}` da abertura são preservadas ou acrescidas, nunca perdidas.

---

## 5. Pontos de decisão — martelados em 25/07/2026

> **(a) Silas Crane.** O utilizador escolheu a opção mais perigosa e mais forte: o cold
> open é pelos olhos de quem achou o corpo, e quem achou o corpo é o réu. A **G3** passa
> a ser a guarda crítica desta OS, e o teste de cada frase é o do §3.1: *se o texto
> admite «este homem está a fingir», tem de admitir igualmente «este homem está em
> choque»; se só admite uma, está errado.*
>
> **(b) Só o Dr. Abbot.** O impresso do coroner nomeia o mestre, e ninguém mais. Harlan
> atravessa o caso com uma autorização que não tem o seu nome.
>
> **(c) O prazo é ficção.** Confirmado: nenhuma regra o lê, nenhum desfecho muda. O
> inquérito com consequência mecânica fica registrado como decisão em aberto (§7).

### (a) De quem são os olhos do cold open?

- **(1) Silas Crane, quem achou o corpo.** É o molde do gerador aplicado ao pé da
  letra, é o mais forte na releitura, e é o mais perigoso: exige que cada gesto dele
  admita as duas leituras. **Risco de G3 alto, recompensa alta.**
- **(2) Davey Tull, o aprendiz de 15 anos.** Chega para abrir a oficina e encontra a
  loja fechada e Silas à porta. Vê a manhã de fora, sem entrar. **Risco baixo** — e a
  **G7** (menoridade) obriga a que a cena seja de trabalho interrompido, nada mais.
- **(3) A Sra. Rooke, do outro lado da High Street.** A loja e correio em frente é o
  posto de observação natural da vila, e ela é o segundo alvo (D18). Vê a cortina
  corrida, o vaivém, o homem posto à porta. **Risco baixo, e planta o segundo alvo.**
- **(4) Ninguém — a rua.** Cold open sem POV: a vila acorda, a vitrine com a cortina
  corrida, o sino. **Risco nulo, força dramática menor.**

### (b) A ordem do coroner tem o nome de quem?

- **(1) Do Dr. Abbot.** Historicamente certo (o coroner conhece o médico do condado, não
  o aprendiz) e dramaticamente melhor: Harlan trabalha o caso inteiro com uma
  autorização alheia no bolso, o que dá a «NAO ASSINE NADA» um peso que ela nunca teve e
  arma a D25 e o clímax. **Recomendada.**
- **(2) Do Dr. Abbot, com Harlan nomeado por extenso como assistente.** Mais confortável
  para o jogador, mais frouxo para a ficção; desfaz a tensão de (1).

---

## 6. Gate

**Gate global** (OS-R0 §7): `npm run lint:prosa` · `node scripts/qa.mjs` ·
`node scripts/qa-ui.mjs` · `npm run build`.

**Gate específico:**

1. **Prosa (obrigatório, e é o gate real desta OS).** O pipeline `revisar-prosa` inteiro
   — `editor-critico` + `perito-forense` + `fiscal-continuidade` — com **zero achados
   bloqueantes**. É regra do `CLAUDE.md`, não desta OS: *nenhuma reescrita substancial de
   prosa entra em commit sem ele*. O `perito-forense` responde pela GR3-4; o
   `editor-critico`, pela dosagem e pelos anti-padrões de IA; o `fiscal-continuidade`,
   pelas datas (sexta 13, sábado 14, segunda 16 — e 14/10/1893 **foi** um sábado).

2. **Contrato do `qa-ui.mjs`.** `novaPartida()` avança a abertura por contagem fixa
   (`for (let i = 0; i < 6; i++)`, `qa-ui.mjs:159`) e depois clica
   `Entrar — iniciar a investigação`. **Dois passos novos ⇒ a contagem passa a 8**, no
   mesmo commit. O rótulo do botão final não muda. Cuidado: a contagem vale para o
   caso-escola **e** para os casos gerados, que têm 6 passos próprios e não mudam —
   conferir se o helper serve aos dois ou se precisa de contagem por caso.

3. **Horas intactas.** Os quatro perfis fecham em 17h00 · 18h00 · 14h00 · 13h00.
   *(GR3-3)*

4. **Diff.** `cartas.js`, `casos_gerados.js`, `casos_indice.js` e `src/gerador/` fora
   dele. *(GR3-2, GR3-5)*

---

## 7. Ata

Modelo em OS-R0 §9. Acrescentar:

- Os dois martelos do §5, e o que se escreveu por causa deles.
- O parecer do pipeline `revisar-prosa`, resumido, com os achados não-bloqueantes que
  ficaram por endereçar e a OS que os herda.
- **A decisão que esta OS deliberadamente não toma:** o prazo do inquérito é hoje
  ficção pura. Fazer o relógio bater nele — inquérito segunda às dez, e o que acontece
  se o perito lá chegar de mãos vazias — é **mecânica nova**, e mecânica nova precisa de
  ordem expressa. Registrar como aberta, para o utilizador decidir se vira OS própria.
- **Aberto para a OS seguinte:** OS-R4 (elenco e livros: o coroner ganha corpo de
  elenco? Amos Kell, a Sra. Wick, o estalajadeiro, a torre de S. Miguel; e o posto de um
  homem só — Wycliffe *e* Tobin). OS-R8 («lavrar queixa» em `abertura.js:123`, ao lado
  do que esta OS mexeu e propositadamente não tocado). OS-R9 (o gerador herda o molde da
  abertura testemunhal).
