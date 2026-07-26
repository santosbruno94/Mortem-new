# OS-R6 — Exposição e interrogatórios

**Mestra:** OS-R0. **Decisões:** D3, D7, D16, D17.
**Guardas:** G2, G3, G4, G5, G7, G8, G10, G11.
**Pré-requisito:** OS-R5 com ata (fechada em 25/07/2026). **Não abre antes.**
**Namespaces de sal:** `reforma:r6:exposicao` e `reforma:r6:alfinetada` (reservados na OS-R0 §6).

Escrita no fecho da OS-R5, contra a árvore real, como a OS-R0 §4 manda.

---

## 1. O que esta OS resolve

Cinco coisas. A segunda é a maior, e é a única da reforma inteira que ainda não tem
uma linha de código.

**(a) Não há beat 3, e a D7 manda que haja nos cinco.** A árvore de hoje tem exatamente
a mesma forma nas cinco conversas:

> `abertura` → `b1_{firme|cordial|tecnico|obliquo}` → `b2_{firme|cordial|tecnico|obliquo}`
> → nós de reação/confronto → `evasiva`

`grep -c "b3_" src/data/dialogos.js` devolve **0**. A conversa acaba no segundo beat, e o
que vem depois só existe se o jogador tiver a carta que abre um confronto. Quem chega sem
carta nenhuma faz duas perguntas e sai.

**(b) A exposição não existe — e é a lacuna mais cara da reforma.** A **G5** fixa o
contrato: *«os níveis de exposição (E0/E1/E2) são função pura das cartas possuídas;
determinístico, auditável, sem flag escondida»*. Hoje não há E0, não há E1, não há E2, e
não há função nenhuma. **O suspeito responde exatamente o mesmo ao perito que chega de mãos
vazias e ao que chega com a cadeia física inteira na mesa.** É o buraco que faz o
interrogatório parecer um formulário: o jogo não sabe o quanto o jogador sabe, logo não pode
reagir a isso.

**(c) O `apontadaPor` (D17) não existe em lugar nenhum.** `grep -rn "apontadaPor" src/`
devolve zero. A decisão diz **«entra como campo e como sistema»**, e as sete menções que
existem no repositório são todas de documento — nenhuma de código.

**(d) A D3 nunca foi executada.** *«Walter sabia da mudança do testamento e omite»*, e a
resolução diz que isso **«cai no 2.º degrau do confronto»**. A R5 registrou e não tocou
(§3.4), por decisão de mesa. O segundo degrau é desta OS, e a carta que ele cobra também.

**(e) Três formas diferentes para o mesmo ato.** Interrogar um suspeito acontece de três
maneiras incompatíveis:

| Suspeito | Como se chega |
|---|---|
| Silas Crane | `interrogatorio_silas` — **localidade própria no mapa** |
| Agnes Rooke · Caleb Grey | a localidade **é** o interrogatório (`papelaria`, `moinho`) |
| Walter Arthurs · Davey Tull | chave própria (`dialogo_walter`, `dialogo_davey`), aberta **de dentro** de outra localidade, por botão |

Só o réu tem nó de mapa próprio. Isso é assimetria visível ao jogador, e a **G3** existe
precisamente para impedir que o culpado receba marca que os inocentes não recebam. É ponto
de decisão (§5e), não de execução — normalizar tem custo espacial e toca o contrato do
`qa-ui`.

---

## 2. O orçamento — e a razão de ele ser mais apertado do que parece

| | |
|---|---|
| Catálogo hoje | **41** em `cartas.js` + `ev_algor` de runtime = **42** |
| Teto (G11) | **46** |
| Livre | **4** |

**A R6 é a última OS que pode gastar carta.** Não é ênfase, é o desenho da reforma:

- **OS-R7** (a reconstituição) está proibida de gastar pela **G9** — *«a cena nunca introduz
  evidência nova nem contorna o mural de acusação»*.
- **OS-R8** é passe editorial e QA de fecho.
- **OS-R9** é o gerador herdando os padrões, fora do caso-escola.

Logo: **as 4 cartas que sobram são as últimas do caso-escola**, e o que a R6 não gastar
morre por não ter quem gaste. Isso corta nos dois sentidos — gastar as quatro é legítimo, e
guardá-las «para depois» é gastá-las em nada. **A R6 declara no §3 o que gasta e sai com o
saldo declarado na ata**, mesmo que o saldo seja zero.

**Restrição de domínio herdada (G1):** nenhuma carta nova em `temporal` ou `causal`. A
guarda **GR4-2** congela o conjunto das oito cartas da cadeia física por id e reprova
sozinha.

---

## 3. Escopo

### 3.1 A exposição (G5, D7)

O contrato da G5 é a especificação inteira, e é curto: **função pura das cartas possuídas,
determinística, auditável, sem flag escondida.** O que a OS tem de produzir:

- uma função de leitura em `src/logic/` que receba as cartas na mesa e devolva o nível por
  suspeito, **sem estado próprio e sem `Math.random`/`Date.now`** (regra inviolável do
  `CLAUDE.md`);
- a auditoria dela no `qa.mjs`, com os três níveis exercitados;
- o consumo em `dialogos.js`, que é camada narrativa.

O **quanto** cada nível muda e **o que** exatamente ele mede é o martelo (a) do §5. O que a
OS fixa desde já, porque decorre de guardas e não de gosto:

- **A exposição não pode virar chave de solubilidade (G4).** Nenhuma carta que o veredicto
  leia pode depender do nível: toda prova decisiva sai em E0. O nível muda o que a conversa
  **rende a mais**, nunca o que ela deixa de dar.
- **A exposição não pode ser marca do réu (G3).** Se Silas endurece em E2 e os inocentes
  não, o nível vira delator. A paridade mede-se e prova-se, como a R5 provou a dos móbeis.
- **O motor continua cego.** Exposição é camada narrativa: `veredicto.js` e `acusacao.js`
  não a leem. Guarda no QA, como já existe para aparências, papéis e atributos.

### 3.2 O beat 3, nos cinco (D7)

Cinco nós, um terceiro beat em cada. O que ele **é** — se é o confronto promovido a beat
regular, se é um eixo novo de pergunta, ou se é onde a exposição se paga — é o martelo (b).

A restrição dura, essa não é negociável: **o beat 3 sai em qualquer tom** (G4) e **é
alcançável para os cinco** (G10). Um terceiro beat que só o tom ressonante abra é um beco.

Os tons ressonantes de hoje, para quem for escrever: Silas **oblíquo**; Agnes **cordial**;
Grey **técnico**; Walter **cordial**; Davey **cordial**. Três cordiais em cinco — se o beat
3 pendurar tento no tom ressonante, a distribuição já nasce torta e a OS tem de dizer o que
faz com isso.

### 3.3 O `apontadaPor` (D17)

**Campo e sistema**, diz a decisão. O campo é barato; o sistema é que precisa de desenho —
e o desenho é o martelo (c). As perguntas que a OS não responde sozinha: o campo vive na
carta ou na fala? Aponta uma pessoa ou uma alegação? E, sobretudo, **o motor lê?**

O que já se sabe pela ordem-mestra: a **D16** fixa a forma da cumplicidade como
**posterior** — *«dois comprados com a mesma mentira, com fio de coação na Sra. Wick»* —, e
é aí que o `apontadaPor` ganha função. Duas testemunhas que apontam o mesmo dedo pela mesma
razão comprada não são duas corroborações: são uma. Um sistema que registre **quem apontou
quem** é o que permite ao jogo (e ao jogador) distinguir as duas coisas.

**Aviso de guarda:** se o motor passar a ler `apontadaPor`, ele deixa de ser camada
narrativa e entra no contrato do veredicto — o que é decisão de mesa, com custo de QA e de
determinismo. Se não ler, o campo é lastro para a prosa e para o `qa.mjs`, e custa quase
nada. **A recomendação está no §5(c).**

### 3.4 A D3 e o segundo degrau de Walter

Walter **sabia** da mudança do testamento e **omite**. A R5 deixou-lhe dois móbeis
(`dep_testamento`, `dep_dividas_walter`) e três confrontos
(`ev_registro_estalagem`, `ev_suplica_cesto`, `dep_testamento`), e o material da mudança já
está plantado sem ninguém o colher: `corrob_pettigrew` diz, de memória do procurador, que o
morto *«pedia hora para tratar de mudanças no testamento, por razão de matrimônio»* — e a
R5 acabou de datar isso, com o bilhete do vigário que marca os proclamas para o domingo
seguinte à morte.

**Ou seja: a D3 pode não custar carta nenhuma.** O segundo degrau cobra o que já está na
mesa. Se custar, custa uma, e é a primeira das quatro a ser gasta. Ver §5(d).

### 3.5 Contaminação e alfinetadas

Os dois nomes vêm da linha da OS-R0 §4 e não têm documento próprio; ficam definidos aqui,
contra a árvore, para que a sessão que executar não os invente de novo:

- **Contaminação** é a D16 realizada: o depoimento comprado. Dois periféricos repetem a
  mesma mentira porque a mesma pessoa lha pôs na boca, e a Sra. Wick carrega o fio de
  coação (a carta `dep_mulher_viela` já traz a retratação dela — *«procurada outra vez ao
  meio-dia, disse não ter visto nada e fechou a janela»*). O sistema que a expõe é o
  `apontadaPor` do §3.3.
- **Alfinetadas** são o rendimento pequeno do interrogatório: o tento que a conversa dá
  quando o perito chega sabendo — a hesitação, o detalhe a mais, o deslize. É o consumo
  natural da exposição do §3.1, e é onde ela se paga em prosa em vez de em mecânica.

### 3.6 Fora de escopo

- Qualquer mudança em `temporal`/`causal`, no gerador ou no banco *(G1, G12)*.
- A reconstituição do clímax — **OS-R7** *(G9)*.
- O passe editorial, e com ele o «púlpito de escrever forrado de cortiça» que o
  perito-forense apanhou na R5 — **OS-R8**.
- O gerador herdar exposição, `apontadaPor` e o móbil por aritmética de livro — **OS-R9**.
- A camada psíquica, o pivô visual, o bug de `reacao_vital` — **fora da reforma** (OS-R0 §8).

---

## 4. Fases

**Fase 0 — Telemetria, e é o que a R5 provou valer.** Antes de escrever uma linha: imprimir
no `qa.mjs`, por suspeito e por perfil, quantas cartas o jogador tem na mesa ao entrar em
cada conversa. **É esse número que define os cortes de E0/E1/E2** — arbitrá-los antes de
medir é como a R5 quase mediu a paridade dos móbeis depois de a estragar. Risco zero.

**Fase 1 — A exposição.** A função pura, a auditoria e a paridade. Sem consumo ainda.

**Fase 2 — O beat 3 nos cinco.** Consome a exposição da Fase 1.

**Fase 3 — O `apontadaPor` e a contaminação.** Campo, sistema e a D16 realizada.

**Fase 4 — A D3, o segundo degrau de Walter.**

**Fase 5 — A anomalia do `interrogatorio_silas`**, conforme o martelo (e).

**Fase 6 — Gate e ata.**

---

## 5. Pontos de decisão — cinco, e todos antes da Fase 1

### (a) O que a exposição mede, e o que ela muda

- **(1) Mede cartas do próprio suspeito; muda o rendimento, nunca a disponibilidade.**
  *Recomendada.* E0/E1/E2 pelo número de cartas na mesa que apontem aquele suspeito
  (`ligadoA`/`pertenceA`/`declaranteId`). O nível não abre nem fecha nó nenhum: paga
  alfinetada, hesitação, um detalhe a mais. Satisfaz a G4 por construção, é auditável numa
  linha, e não pode virar beco.
- **(2) Mede a mesa inteira.** Mais simples de calcular e pior de jogar: o perito que
  encheu a mesa de vestígios do corpo chega «exposto» diante de quem não tem nada com o
  corpo, e o nível deixa de significar coisa nenhuma.
- **(3) Mede e abre nós.** O mais vistoso e o mais perigoso: põe conteúdo atrás do nível, e
  a primeira carta que o veredicto leia por trás dele fura a G4.

### (b) O que é o beat 3

- **(1) É o beat da pressão, e é onde a exposição se paga.** *Recomendada.* Um terceiro
  par de perguntas nos quatro tons, cujo rendimento varia com o nível do §5(a): em E0 o
  suspeito responde o perguntado; em E2 escorrega. Não pede carta nova, não abre nó, e dá à
  D7 exatamente o que ela pede — beat 3 nos cinco.
- **(2) É o confronto promovido a beat regular.** Elegante e caro: obrigaria a refazer os
  treze confrontos existentes e a sua superfície no `qa-ui`.
- **(3) É um eixo novo de pergunta** (o passado, a relação com o morto). Rende prosa e não
  rende mecânica; e a R8 é que é a OS de prosa.

### (c) O `apontadaPor` — o motor lê?

- **(1) Não lê; é lastro narrativo com guarda no QA.** *Recomendada.* O campo registra
  quem apontou quem; o `qa.mjs` prova que duas alegações com a mesma origem não contam como
  duas corroborações, e a prosa e o monólogo usam-no. O motor fica cego, como fica para
  aparências, papéis e atributos — que é o padrão desta base inteira.
- **(2) Lê, e vira contrato do veredicto.** Dá peso mecânico real à contaminação, e custa:
  determinismo, replay byte a byte, e um pedaço novo do motor a testar no fim da reforma.
  Se for esta, é **decisão de mesa e ata própria**.

### (d) A D3 custa carta?

- **(1) Não: o segundo degrau cobra o que já está na mesa.** *Recomendada.* O
  `corrob_pettigrew` já traz a mudança do testamento por razão de matrimônio, e o bilhete
  do vigário da R5 já a datou. Walter omitir isso é falha dele, e o jogo já tem com que a
  provar.
- **(2) Sim, uma carta.** Um documento que prove que Walter **soube** (bilhete, recado,
  testemunha do gabinete). Mais duro e mais caro: gasta 1 das 4 últimas do caso-escola.

### (e) A anomalia do `interrogatorio_silas`

- **(1) Deixar como está e registrar.** *Recomendada, com desconforto.* Normalizar toca
  `localidades.js`, `mapa.js`, `mapa_espacial.js`, o diorama e o contrato do `qa-ui` — e a
  R6 já é a maior OS que resta. A assimetria é real mas é fraca: o réu é também quem achou
  o corpo, e ter sido chamado a depor formalmente explica-se sozinho na ficção.
- **(2) Normalizar para cima:** todos ganham nó de mapa. Coerente e caro, e mexe em horas
  (nó novo custa hora, e as quatro horas do gate mudariam).
- **(3) Normalizar para baixo:** Silas perde o nó e passa a abrir de dentro da relojoaria,
  como Walter e Davey. Mais barato que (2) e ainda assim toca mapa, diorama e QA.

---

## 6. Guardas

**GR6-1.** Teto de cartas respeitado: o catálogo não passa de **46** com `ev_algor` contado.
A guarda **GR4-1** já existe e imprime a conta. *(G11)*

**GR6-2.** Nenhuma carta nova em `temporal` ou `causal`. A **GR4-2** já congela o conjunto
por id. *(G1)*

**GR6-3.** **A exposição é função pura.** Mesmas cartas na mesa ⇒ mesmo nível, em replay
byte a byte; sem estado próprio, sem `Math.random`/`Date.now`. *(G5)*

**GR6-4.** **A exposição não é chave de solubilidade.** Todo perfil que resolve em E2
continua a resolver em E0: nenhuma carta que o veredicto leia depende do nível. *(G4)*

**GR6-5.** **Paridade de exposição.** O réu não atinge nível que os inocentes não atinjam
com material equivalente, e nenhuma prosa de beat 3 chaveia no bit `culpado`. *(G3)*

**GR6-6.** **O motor continua cego.** `veredicto.js` e `acusacao.js` não leem exposição
nem — se o martelo (c) sair na opção 1 — `apontadaPor`. Guarda por leitura de fonte, como
as que já existem para aparências, papéis e atributos.

**GR6-7.** **Beat 3 nos cinco, em qualquer tom.** Os cinco nós têm terceiro beat, e ele
sai nos quatro tons. *(D7, G4, G10)*

**GR6-8.** **Contaminação legível.** Duas alegações com a mesma origem em `apontadaPor` não
contam como duas corroborações — provado por asserção. *(D16)*

**GR6-9.** **Menoridade.** O beat 3 de Davey é económico e só, em qualquer tom e em
qualquer nível de exposição. A R5 provou que o risco fino não é o óbvio: é dar-lhe
ressentimento em vez de facto. *(G7)*

**GR6-10.** O gerador e o banco ficam fora do diff; `sha256` intacto. *(G12)*

---

## 7. Gate

**Gate global** (OS-R0 §7): `npm run lint:prosa` · `node scripts/qa.mjs` ·
`node scripts/qa-ui.mjs` · `npm run build`. Ou, de uma vez, `npm run verificar`.

**Gate específico:**

1. **Pipeline `revisar-prosa`** com zero achados bloqueantes. Regra do `CLAUDE.md`. *A R3, a
   R4 e a R5 reprovaram na primeira passada, cada uma por revisor diferente — e na R5 os
   dois revisores que se contradisseram valeram mais do que qualquer dos pareceres
   isolados. Correr os três não é cerimónia.*
2. **Contagem de cartas** antes e depois, com o teto e o **saldo final** declarados. Como a
   R6 é a última que pode gastar, o saldo que ela deixar é o que o caso-escola leva para
   sempre.
3. **Telemetria da exposição** (Fase 0) publicada na ata, com os cortes que ela justificou.
4. **Os quatro perfis** continuam a dar os quatro desfechos. As horas de hoje são
   **18h00 · 18h00 · 14h00 · 13h00**; se o martelo (e) sair na opção 1 — e a recomendação é
   essa —, elas não mudam, e isso confirma-se em vez de se assumir.
5. **Contrato do `qa-ui`:** os textos de botões e rótulos que ele clica, as classes
   `.termo-clicavel`/`.termo-extraido`, o `data-overlay` e a ordem dos dois `<select>` do
   mural são intocáveis. **Esta OS mexe na árvore de diálogo, que é a superfície mais
   coberta pelo QA de interface** — qualquer mudança de rótulo entra no mesmo commit que a
   atualização do QA.
6. **Diff:** `src/gerador/`, `casos_gerados.js` e `casos_indice.js` fora dele.

---

## 8. Ata

Modelo em OS-R0 §9. Acrescentar:

- Os cinco martelos do §5 e o que se escreveu por causa deles.
- **O orçamento gasto e o saldo final** — em número, no corpo da ata, com a nota de que
  não há OS seguinte que possa gastá-lo.
- **A telemetria da exposição**, antes e depois, com a paridade provada.
- O parecer do pipeline, com os achados não-bloqueantes e a OS que os herda.
- **Aberto para a OS seguinte:** o que a R7 (reconstituição) herda; a fila da R8 (passe
  editorial, já com o púlpito de cortiça da R5) e da R9 (o gerador herda os padrões, agora
  também a exposição e o `apontadaPor`).
