# OS-R9 — O gerador herda os padrões

**Mestra:** OS-R0 — mas **esta OS sai da reforma**. A OS-R0 §8 escreveu-a para fora, e com
razão: «é trabalho real e fica para uma OS-R9, **depois de o tutorial provar os padrões**».
O tutorial provou-os em oito OS. É esta que os generaliza.
**Guardas herdadas:** G2, G3, G4, G5, G6, G7, G9, G10, **G12** (o banco não se edita à mão).
**Pré-requisito:** OS-R8 com ata (a reforma fechada). **Não abre antes.**
**Namespace de sal:** `gerador:r9:<eixo>` — reservados `gerador:r9:procedencia`,
`gerador:r9:exposicao`, `gerador:r9:veraz`, `gerador:r9:intervencao`, `gerador:r9:degrau`.

Escrita no fecho da OS-R8, contra a árvore real, como a OS-R0 §4 manda.

---

## 1. A mudança de frente, e o que ela muda no método

As oito OS da reforma tinham um alvo **único e artesanal**: um caso escrito à mão, com
nomes próprios, cuja verdade caberia num parágrafo. Podia-se ler o caso inteiro antes de
mexer nele. **A R9 não tem esse luxo.** O alvo são **31 casos embarcados** (1 réplica + o
pool + o lote de luta), **155 árvores de diálogo** e um banco de 2,3 MiB que **é produto**:
nada nele se edita à mão (G12) — muda-se o gerador e corre-se `node scripts/gerar-casos.mjs`.

Três consequências de método, e nenhuma é opinião:

1. **Toda mudança se mede em lote, não em leitura.** Na reforma, um achado era uma frase.
   Aqui é uma distribuição: «em quantos dos 31 isto acontece, e em que fração das seeds?»
   As guardas do `qa.mjs` que já medem em banda (GE2 em 40–60%, GE5 abaixo de 45%, o
   regime-palco em 10–30%) são o molde a seguir.
2. **O caso-escola passa a ser o GABARITO, não o alvo.** Cada padrão que a R9 porta tem,
   no tutorial, uma implementação de referência que o pipeline já aprovou. A pergunta
   deixa de ser «como se faz isto?» e passa a ser «o que este padrão pressupõe que o
   gerador não sabe produzir?».
3. **O replay byte a byte é o cinto de segurança e o carrasco.** Qualquer alteração no
   gerador muda `casos_gerados.js` **e** `casos_indice.js`; o `qa.mjs` cobra os dois por
   replay. Uma fase que mexa no gerador e não regenere o banco **reprova sozinha** — e é
   bom que reprove.

---

## 2. A fila, item a item, com o que já está medido

Sete itens vêm das atas da reforma; dois nasceram na R7; o último foi **medido no fecho da
R8** e é o mais bem delimitado de todos.

### 2.1 A procedência: `apontadaPor` (D17)

**Estado medido:** `apontadaPor` vive em `src/data/procedencia.js` — do caso-escola, e só —
e é lido por `src/logic/contaminacao.js`. **O gerador não emite mapa de procedência nenhum.**

**A prova de que isto já custou algo:** a R7 escreveu `contarVozes` com a regra
«**alegação sem procedência registada é voz própria**» precisamente porque a conta estrita
teria apagado o bloco das testemunhas de **todo** o banco gerado. A regra é honesta e fica;
mas hoje ela é o *fallback* de 31 casos em 31.

**O que a R9 tem de produzir:** o feixe da D16 no gerado — duas bocas compradas com a
mesma mentira, com o mapa a dizer de onde cada alegação veio. Sem isso o
`blocoTestemunhas` conta vozes que nunca se puderam somar.

### 2.2 A exposição E0/E1/E2 (G5)

**Estado medido:** **zero** ocorrências de `exposicao` em `src/gerador/`. A régua vive em
`src/logic/exposicao.js` (`montarDossies`, `corteDeE2`, `nivelDeExposicao`) e é **função
pura das cartas possuídas**, o que significa que ela já *corre* sobre um caso gerado — o
que não existe é o que a R6 construiu **em cima** dela: o beat 3 que declara o nível, e a
alfinetada que o nível paga.

**Ponto fino, e é o de sempre nesta casa:** a GR6-5 cobra **paridade** — a mesma régua para
os cinco suspeitos. Num caso gerado o elenco varia de tamanho. A régua tem de ser paridade
por *construção*, não por contagem fixa.

### 2.3 O veraz sem crédito (G6)

**Estado medido:** o arquétipo não existe no gerador. No tutorial é Amos Kell, o sineiro: diz
a hora verdadeira e **o motor recusa-o** como nexo e como álibi, pela MARCA de insuficiência
que a carta carrega (guarda GR4-3).

É o padrão mais fácil de portar mal: um veraz sem crédito que o motor aceitasse seria uma
prova de graça; um que ninguém pudesse ouvir seria ruído. A régua está escrita na GR4-3.

### 2.4 O móbil por aritmética de livro (padrão novo da R5)

**Estado medido:** os móbeis gerados provam-se por **depoimento** e por vestígio social. O
tutorial estreou outro caminho: o móbil que se prova **somando um livro** (o de pagamentos
contra o de ordens; o Livro II dos pesos). Aritmética é a prova mais limpa que este jogo
tem — não depende de ninguém dizer a verdade.

### 2.5 A escada de confronto por contador autoral (D8)

**Estado medido:** as árvores geradas têm confrontos com **segunda camada** (a S1 pôs
detalhe verificável em todos), mas **nenhuma tem `degraus`**. O tutorial tem um:
`confronto_testamento`, com `contaEntre` de três papéis e `aPartirDe: 2` — lista curada, e
o corte é uma contagem, não `requerTodas`.

### 2.6 As intervenções da noite (R7)

**Estado medido:** `montarReconstituicao` devolve `null` sem catálogo de gestos, e **nenhum
dos 31 casos tem catálogo**. É por isso que o fim de caso gerado vai direto ao monólogo —
e foi um gate deliberado da R7, não um esquecimento: sem ele, os trinta casos abririam uma
cena vazia que nada teria a refazer.

**O que a R9 tem de produzir:** gestos da noite derivados do `RegistroDoCrime`, que já
existe e já sabe a ordem dos fatos. É o item de maior rendimento da fila — a reconstituição
é a peça mais nova do fim de caso, e hoje só o tutorial a tem.

### 2.7 A dívida de geografia de `reconstituicao.js`

**Estado medido:** as três aberturas da cena cravam a relojoaria, o balcão, a oficina e o
escritório dentro de `src/logic/reconstituicao.js` — um módulo de lógica cujo irmão
`monologo.js` declara o contrato oposto (nenhum texto exclusivo de caso). Hoje **não vaza**,
porque sem catálogo a função devolve `null`. **No dia em que a 2.6 entrar, vaza no mesmo
commit** — aquelas três frases vão para o pacote, como as próprias `intervencoes` já foram.

**Logo: a 2.7 não é um item paralelo à 2.6. É a primeira alínea dela.**

### 2.8 O vestígio durável do instrumento lavado

**Estado medido:** existe `instrumento_guardado_umido` — o **perecível** (a umidade na junta,
que seca em um dia). O **durável** que a KB documenta — o coágulo sob a virola, que
sobrevive à lavagem e ao tempo — não tem classe.

**Registado em 26/07/2026, com a razão:** no caso-escola isto **não é defeito a corrigir** —
a carta observa a umidade ~16h depois do gesto, dentro da janela de secagem, e o durável
exigiria carta nova, vedada pela G9 e pelo número final de 42. **É capacidade do gerador**,
e é aqui que entra.

### 2.9 As duas classes de vestígio que a KB tem e o gerador não

`CLASSES_VESTIGIO` não tem **roupa queimada** nem **documento queimado**. Os dossiês estão
escritos e são dos melhores da KB (`docs/kb-medicina-legal/supressao-de-vestigios.md`) — e a
R8 acabou de os emendar, desacoplando o leito de cinza alto da duração da queima. O
gerador não sabe produzir nem um nem outro.

### 2.10 A GR8-4 nas árvores geradas — **medido no fecho da R8**

A guarda que a R8 escreveu cobre as cinco árvores do caso-escola. Corrida sobre as **155
árvores geradas** (só medida; nada se editou), a conta é esta:

| | |
|---|---|
| Casos medidos | **31** |
| Árvores | **155** |
| Casos com repetição verbatim entre nós co-alcançáveis | **11** |
| Ocorrências | **55** |
| Frases distintas responsáveis | **1** |

**A frase é «Nada de nota.», e as 55 ocorrências estão TODAS em nós `exigencia_*`** — o
sistema de exigir que mostre as mãos, os antebraços, as botas. Fora da exigência, as
árvores geradas saem **limpas**: o derivador varia as rubricas.

**E é por isso que este item é uma DECISÃO, não uma correção.** A resposta nula uniforme
pode ser a leitura mais honesta: se o «nada aqui» variasse de redação, a variação seria
**sinal** — e o jogador aprenderia a ler no floreado o que a marca não diz. Ou seja: o que
parece anti-padrão pode ser fair play. Está no §5.

---

## 3. O que NÃO é desta OS

- **O item 10 do playtest** (ler a transcrição completa da carta amassada): a S2 aprovou-o
  como **lote pequeno de UI**, e a R8 triou-o para fora do passe editorial. Não é do
  gerador; não entra aqui para «aproveitar a viagem».
- **A sala da `porta_beco`** (`src/data/localidades.js`): dar-lhe prosa e sala clicável é do
  caso-escola e toca o contrato do `qa-ui`. Lote próprio.
- **O prazo do inquérito com consequência mecânica:** ficção só, martelado na R3, e reabre
  — se reabrir — por decisão de mesa. Briga de frente com o relógio mole, que é pilar.
- **A camada psíquica, o pivô visual, o bug de `reacao_vital`:** fora, como sempre
  (OS-R0 §8).
- **Editar `casos_gerados.js` ou `casos_indice.js` à mão:** G12, e não tem exceção.

---

## 4. Fases

**Fase 0 — Medir o gerado, por lote.** A R5, a R6, a R7 e a R8 provaram, quatro vezes, que
medir primeiro poupa uma fase — e a R8 provou o caso extremo: a fila que ela herdou dizia
UMA rubrica repetida, e a medida disse OITO. Aqui a Fase 0 é: para cada item do §2, **em
quantos dos 31 casos o padrão falta, e o que o pacote já traz que sirva de matéria-prima.**
Sem isto, a OS escolhe a ordem das fases pelo palpite.

**Fase 1 — A procedência (§2.1).** É a base das outras: sem `apontadaPor`, a contaminação e
o feixe da D16 não têm de onde sair.

**Fase 2 — A exposição e o degrau (§2.2 e §2.5).** Andam juntos: os dois vivem no beat 3 e
no confronto, e a paridade da GR6-5 tem de valer por construção.

**Fase 3 — As intervenções da noite, e a dívida de geografia com elas (§2.6 + §2.7).** A
mais cara e a de maior rendimento. Fecha o fim de caso gerado.

**Fase 4 — Os arquétipos e as classes (§2.3, §2.4, §2.8, §2.9).** Quatro capacidades novas,
todas com dossiê de KB já escrito.

**Fase 5 — Gate, banco regenerado e ata.**

---

## 5. Pontos de decisão

**(a) A resposta nula da exigência (§2.10) — varia ou é uniforme?**
Uma frase, 55 ocorrências, 11 casos. **Recomendação: fica uniforme, e a guarda isenta-a por
nome.** Variar a redação do «nada aqui» transformaria estilo em informação, e o jogador
aprenderia a ler o floreado — que é exatamente o telégrafo que a GE2 e a GR5-6 existem para
matar. A alternativa honesta, se o utilizador quiser variedade, é variar por **personagem**
(o registo de quem responde), nunca pelo **resultado** do exame.

**(b) O tamanho do catálogo de gestos gerado (§2.6).** O tutorial tem nove, e a R7 mediu
que nove dá amplitude real (de moldura vazia a noite quase inteira). Num caso gerado, o
número sai do `RegistroDoCrime`. **Recomendação: teto igual ao do tutorial (nove) e piso de
três**, com a cena a rodar curta sem carta — que é o martelo (c) da R7, já medido.

**(c) A ordem das Fases 3 e 4.** A 3 é a mais cara; a 4 é a que mais depressa aparece no
jogo. **Recomendação: manter a ordem escrita**, porque a Fase 3 é a que arrisca vazar
geografia para `src/logic`, e essa dívida é melhor paga com a OS fresca.

Fora destes três, **não há decisão a recolher**: os nove primeiros itens do §2 são
capacidades que as atas já aprovaram, com implementação de referência no tutorial.

---

## 6. Guardas

**GR9-1.** **O banco é produto.** Nenhum commit desta OS altera `casos_gerados.js` ou
`casos_indice.js` sem que o replay byte a byte do `qa.mjs` passe com o gerador de hoje.
*(G12)*

**GR9-2.** **Paridade por construção, não por contagem.** Toda régua nova (exposição,
degrau, procedência) vale para elenco de qualquer tamanho, e a guarda prova-o em lote de
seeds, não no caso-escola. *(G5, e a lição da GR6-5)*

**GR9-3.** **Nenhum padrão portado entrega prova de graça.** O veraz sem crédito continua a
apontar e nunca a provar; a exposição não é chave de solubilidade; a reconstituição não
introduz evidência nova. *(G4, G5, G6, G9)*

**GR9-4.** **O motor continua cego.** Procedência, exposição, gestos e atributos ficam fora
de `veredicto.js`/`acusacao.js` e do fecho de imports deles. *(a GR6-6, estendida)*

**GR9-5.** **A GR8-4 passa a correr sobre as árvores geradas**, com a isenção que o §5(a)
decidir — declarada por nome no código da guarda, nunca por tolerância numérica.

**GR9-6.** **Toda classe de vestígio nova cita a KB por linha**, como a proveniência já
exige dos arquétipos e das tabelas auxiliares.

---

## 7. Gate

**Gate global** (OS-R0 §7): `npm run verificar`.

**Gate específico:**

1. **Pipeline `revisar-prosa`** com zero achados bloqueantes sobre a prosa gerada nova —
   e aqui a amostra tem de ser **de lote** (várias seeds), não de um caso só. *A R8 provou
   que a guarda automática não chega à matéria; e prosa gerada é matéria em série.*
2. **Replay byte a byte** dos 31 casos, mais o índice leve.
3. **Os quatro perfis** continuam a produzir os quatro desfechos na réplica, no pool e no
   lote de luta.
4. **O caso-escola sai intocado:** 42 cartas, horas **18h00 · 18h00 · 14h00 · 13h00**,
   diff sem `src/data/cartas.js` nem `src/data/dialogos.js` salvo ordem expressa.

---

## 8. Ata

Modelo em OS-R0 §9. Acrescentar:

- **A telemetria da Fase 0**, por item e por lote — é o que diz se a OS acertou a ordem.
- **As três decisões do §5** e o que se fez por causa delas.
- **O que o gerador passou a saber fazer**, e o que continua a não saber.
- **A distribuição depois**, contra a de antes: em quantos dos 31 cada padrão entrou.
