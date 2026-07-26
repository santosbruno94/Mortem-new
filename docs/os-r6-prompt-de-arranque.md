# OS-R6 — Prompt de arranque para a sessão seguinte

Escrito no fecho da OS-R5, contra a árvore real, como a OS-R0 §4 manda
(«cada uma escreve-se no fecho da anterior»). Copiar o bloco do §1 como
primeira mensagem da sessão nova.

---

## 1. O prompt

> Executar a **OS-R6 — Exposição e Interrogatórios**
> (`docs/os-r6-exposicao-e-interrogatorios.md`) do repositório MORTEM, do
> arranque ao fecho com ata.
>
> **Antes de tocar em qualquer ficheiro, ler nesta ordem:**
> 1. `docs/os-r0-mestra-reforma-hora-emprestada.md` — a ordem-mestra. Não se
>    executa; governa. Interessam as guardas **G2, G3, G4, G5, G7, G8, G10,
>    G11**, a matriz de colisão do §5 (a R6 é **dona** de `dialogos.js`) e o
>    gate do §7. A **G5** é o contrato inteiro da exposição, e cabe em duas
>    linhas.
> 2. `docs/os-r6-exposicao-e-interrogatorios.md` — a OS a executar. Ler o
>    **§1(b) primeiro**: a exposição não existe, e é a única peça da reforma
>    que ainda não tem uma linha de código.
> 3. A ata da **OS-R5** no fim de `docs/historico-decisoes.md` (secção
>    «25/07/2026 — OS-R5»), e a do **lote de KB** logo a seguir.
> 4. `docs/kb-craft-narrativo/prosa-de-misterio.md` — é a OS do
>    interrogatório, e interrogatório é onde o depoimento se planta ou se
>    estraga.
> 5. `CLAUDE.md` — regras invioláveis do código e o **contrato com o
>    `qa-ui.mjs`**, que nesta OS é o risco número um.
>
> ---
>
> ### Recolher TODAS as decisões pendentes numa rodada só, antes da Fase 1
>
> São **sete**, e é o conjunto completo do que está aberto no repositório —
> não há outra pendência de desenho à espera. Perguntar as sete **de uma vez**
> (uma rodada de `AskUserQuestion`, com as recomendações em primeiro lugar), e
> **não parar mais** depois de respondidas: da Fase 0 ao fecho com ata, sem
> nova consulta, salvo se a execução revelar contradição entre uma decisão e
> uma guarda — caso em que se pergunta na hora, e só isso.
>
> As **seis primeiras** são os martelos do **§5 da própria OS**, cada uma com o
> custo das alternativas escrito lá. A **sétima** não é da OS: é uma divergência
> de KB que ficou registrada e por resolver, e é do utilizador.
>
> **(a) O que a exposição mede, e o que ela muda.** Recomendação: **medir as
> cartas do próprio suspeito e mudar só o rendimento**, nunca a
> disponibilidade — satisfaz a G4 por construção e não pode virar beco. As
> alternativas (medir a mesa inteira; medir e abrir nós) estão no §5(a).
>
> **(b) O que é o beat 3.** Recomendação: **o beat da pressão, onde a exposição
> se paga** — um terceiro par de perguntas nos quatro tons, sem carta nova e
> sem nó novo. As alternativas (promover o confronto a beat; eixo novo de
> pergunta) estão no §5(b).
>
> **(c) O motor lê o `apontadaPor`?** Recomendação: **não** — lastro narrativo
> com guarda no QA, como aparências, papéis e atributos. Se ler, vira contrato
> do veredicto e é **decisão de mesa com ata própria**.
>
> **(d) A D3 custa carta?** Recomendação: **não** — o segundo degrau de Walter
> cobra o que já está na mesa: `corrob_pettigrew` traz a mudança do testamento
> «por razão de matrimônio», e o `ev_bilhete_vigario` da R5 datou-a.
>
> **(e) A anomalia do `interrogatorio_silas`.** Só o réu tem nó de mapa próprio
> para ser interrogado; Agnes e Grey **são** a localidade, Walter e Davey abrem
> por botão de dentro de outra. Recomendação: **deixar como está e registrar**,
> com o desconforto declarado — normalizar toca mapa, diorama, horas e o
> contrato do `qa-ui`, e a R6 já é a maior OS que resta.
>
> **(f) O que fazer com as 4 cartas que sobram** (§5(f) da OS). É consequência
> dos martelos acima e é o único **irreversível**: a R6 é a última OS que pode
> gastar carta — a R7 está proibida pela G9, a R8 é passe editorial, a R9 é do
> gerador. Se (b), (c) e (d) saírem nas recomendações, **a R6 gasta zero**, e o
> caso-escola fecha para sempre com **4 de 46 por usar**. Três saídas:
> **(1)** aceitar o saldo 4 e declará-lo na ata como decisão consciente, não
> como sobra — *recomendada, porque carta que não tem função é ruído no mural,
> e o teto existe por jogabilidade medida em playtest*;
> **(2)** gastar 1 na D3, dando a Walter o documento que prova que ele **soube**
> da mudança do testamento — o único candidato com função já desenhada;
> **(3)** abrir uma fase de escopo próprio para gastar as quatro, o que é
> alargar a OS e pede ata à parte.
>
> **(g) A série do preço do trigo na KB** (independente das outras seis, e
> barata). `kb-mundo-vitoriano/economia-e-estrutura-social.md` §1 dá **~46s o
> *quarter* em 1870 → ~22s em 1894**; `demografia-e-sociedade.md` §2 dá **50s
> em 1871 → 23s em 1894**. Séries diferentes, nenhuma errada em si, mas os dois
> arquivos citam-se um ao outro e quem os cruzar encontra números que não
> batem. Está registrada em `kb-mundo-vitoriano/fontes.md` e por resolver.
> Recomendação: **fixar a série de `economia` (46s → 22s) e alinhar
> `demografia` a ela**, por ser a que traz a fonte nomeada; alternativa é o
> inverso, ou manter as duas com a divergência explicada no corpo dos dois
> arquivos.
>
> ---
>
> ### Depois de respondidas: executar sem parar
>
> **Fase 0 primeiro, que é telemetria e não muda nada:** imprimir, no `qa.mjs`,
> quantas cartas o jogador tem na mesa ao entrar em cada conversa, por suspeito
> e por perfil. **É esse número que define os cortes de E0/E1/E2**, e arbitrá-los
> antes de medir é o erro que a R5 quase cometeu com a paridade dos móbeis. Na
> R5 a telemetria da Fase 0 dispensou uma fase de execução inteira.
>
> **Escrever a guarda antes do conteúdo, ao menos a GR6-4.** A exposição é a
> peça onde é mais fácil furar a G4 sem dar por isso: a primeira carta que o
> veredicto leia e que só saia em E1 fura a solubilidade, e o furo só aparece
> no perfil que não subiu de nível.
>
> **Seguir as fases pela ordem** (§4 da OS: exposição → beat 3 → `apontadaPor`
> e contaminação → D3 → anomalia → gate e ata), **um commit por fase**, como as
> OS anteriores fizeram.
>
> **Toda prosa nova passa pelo pipeline `revisar-prosa`** com os três revisores,
> e o gate é **zero achados bloqueantes** — é o item 1 do §7 da OS e regra do
> `CLAUDE.md`. A R3, a R4 e a R5 reprovaram na primeira passada, cada uma por
> revisor diferente. Na R5 dois revisores contradisseram-se sobre a mesma conta
> e **ambos tinham razão sobre coisas diferentes**: o desenho estava certo e a
> legibilidade errada. A frase que ficou vale para esta OS inteira — *uma
> armadilha que se lê como engano não é armadilha.*
>
> **Gate no fecho:** `npm run verificar` corre a bateria toda (build + `qa.mjs`
> + `lint:prosa` + `qa-ui.mjs`). Acresce o gate específico do §7 da OS.
> **Atenção ao `qa-ui`:** a R6 é dona da árvore de diálogo, que é a superfície
> mais coberta por ele — qualquer rótulo que mude entra no mesmo commit que a
> atualização do QA. E não correr o `qa-ui` com outro processo a escrever na
> árvore: o hot-reload derruba o overlay e produz falha falsa.
>
> **Fechar com ata** em `docs/historico-decisoes.md`, no modelo da OS-R0 §9,
> acrescentando o que o §8 da R6 pede: os martelos e o que se escreveu por
> causa deles, **o orçamento gasto e o saldo final** (com a nota de que não há
> OS seguinte que possa gastá-lo), a **telemetria da exposição** antes e depois
> com a paridade provada, o parecer do pipeline, e o aberto para a R7.
>
> **Escrever, no mesmo fecho, a OS-R7 e o seu prompt de arranque**, como a
> OS-R0 §4 manda — contra a árvore real, não contra a de hoje.
>
> **Ramo próprio a partir de `claude/mortem-vertical-slice-zzrcto`** (ou o ramo
> designado da sessão), **depois de o PR #97 estar integrado**. Atualizar
> `MORTEM_CONTEXTO.md`, `README.md` e `docs/plano-de-sessoes.md` (frente SR) ao
> estado entregue, no commit final.

---

## 2. O que a R6 vai encontrar, e que a R5 mudou

**Todo suspeito tem agora carta de móbil, e há duas guardas novas a prová-lo.** A `GR5-3`
exige móbil por suspeito; a `GR5-4` exige que o réu **não seja o máximo em motivos
distintos**; a `GR5-6` exige `isca: true` nas cartas de móbil dos inocentes e a ausência
dela na do réu. **Carta de móbil nova que a R6 escreva tem de respeitar as três** — em
particular a GR5-4, que reprova sozinha se a R6 der um motivo distinto a mais ao réu.

**A coluna dos móbeis, para quem for escrever beat 3:**

| Suspeito | Cartas | Motivos distintos |
|---|:-:|:-:|
| Silas Crane (réu) | 3 | 1 (`silenciamento`) |
| Walter Arthurs | 2 | **2** (`heranca`, `dividas`) |
| Agnes Rooke | 1 | 1 (`recasamento_vigiado`) |
| Caleb Grey | 1 | 1 (`rancor`) |
| Davey Tull | 1 | 1 (`salario_atrasado`) |

**Duas cartas novas, e as duas interessam ao interrogatório:**

- **`ev_bilhete_vigario`** (escritório da relojoaria) — o vigário marca os proclamas do
  morto com a Sra. Rooke para **domingo, 15 de outubro**, dois dias depois da morte. É o
  móbil de Agnes e é **deliberadamente ambíguo** (D5): ao lado da cesta de ceia e do aro por
  gravar lê-se como noivado; sozinho, lê-se como o que a vila ia saber. **A R6 não deve
  desfazer essa ambiguidade pela boca de Agnes** — se ela explicar qual das duas é, o
  trabalho da R5 morre.
- **`ev_livro_pagamentos`** (oficina) — o salário de Davey descontado por inteiro contra uma
  dívida da mãe que **não anda**. A conta é exata e a agiotagem está lá sem a palavra. **Sob
  a G7, o beat 3 de Davey é económico e só**; e o rapaz não deve explicar a conta, porque
  quem a lê é o jogador.

**A agiotagem da vítima (D1) entrou, e entrou sem carta própria.** Vive na aritmética do
livro de pagamentos. Se a R6 quiser que alguém a mencione em fala, atenção: **nenhuma
personagem pode afirmar que reter salário contra dívida era de direito** — pelos Truck Acts
de 1831 e 1887 é dedução não autorizada, ainda que banal numa oficina de vila. O Ato de
1896 e o Moneylenders Act de 1900 são **posteriores** e ninguém os pode invocar. Está tudo
em `docs/kb-mundo-vitoriano/economia-e-estrutura-social.md` §8, escrito no fecho da R5.

**A KB ganhou três domínios no fecho da R5**, e dois tocam esta OS: o **regime de casamento**
(`demografia-e-sociedade.md` §7 — proclamas × licença, e o testamento que o casamento revoga
pelo Wills Act 1837 s.18, que é o relógio por trás do móbil de Walter) e o **dinheiro
emprestado e retido** (`economia-e-estrutura-social.md` §§7–8).

**Uma guarda do `qa.mjs` foi rebaseada, e é preciso saber porquê.** A que provava que o
monólogo não inventa móbil apoiava-se em **Davey não ter carta de móbil no catálogo** — o
que a R5 tornou falso. Passou a valer **nos dois sentidos e nos quatro perfis**, e a testar
o **pool** do monólogo em vez da string literal de uma das três variantes do molde. Se a R6
mexer nos moldes de periférico do `monologo.js`, é essa guarda que reprova primeiro.

**As horas são 18h00 · 18h00 · 14h00 · 13h00**, inalteradas pela R5. A R6 só as muda se
criar nó — o que o martelo (e) recomenda não fazer.

**O banco está em sincronia e a R6 não toca no gerador.** Atenção: `gerar-casos.mjs` escreve
`casos_gerados.js` **e** `casos_indice.js` — se algum comando o correr por engano, restaurar
os dois.

---

## 3. As armadilhas próprias desta OS

**O `qa-ui` é o risco número um, e não era nas OS anteriores.** A R6 é dona de
`dialogos.js`, e a árvore de diálogo é a superfície mais coberta pelo QA de interface: ele
joga as três rotas canónicas no navegador e clica rótulos por texto exato. **Qualquer rótulo
de opção que mude entra no mesmo commit que a atualização do QA** — é regra do `CLAUDE.md`,
não recomendação.

**E não correr o `qa-ui` com outra coisa a escrever na árvore.** Ele sobe o `vite` com
hot-reload; um ficheiro salvo por outro processo durante a corrida derruba o overlay e
produz falha falsa. Foi diagnosticado na R4 e custou uma investigação.

**A exposição é a peça onde é mais fácil furar a G4 sem dar por isso.** A tentação é pôr
conteúdo atrás do nível — é o que torna a mecânica vistosa. Mas a primeira carta que o
veredicto leia e que só saia em E1 fura a solubilidade, e o furo só aparece no perfil que
não subiu de nível. **A guarda GR6-4 existe para isso e deve ser escrita antes do conteúdo,
não depois.**

**Três dos cinco tons ressonantes são `cordial`** (Agnes, Walter, Davey; Silas é oblíquo e
Grey é técnico). Se o beat 3 pendurar o tento no tom ressonante, o jogador que jogar sempre
cordial colhe três dos cinco e o que jogar firme não colhe nenhum. A OS tem de dizer o que
faz com isso — é o §3.2.

**A paridade da exposição é o mesmo defeito da paridade dos móbeis, noutra roupa.** Se o
réu subir de nível mais depressa do que os inocentes, o nível vira delator, e quem contar
níveis acha o réu sem raciocinar. A R5 mostrou o método: **medir na Fase 0, antes de
escrever**, e ler a métrica honesta em vez da fácil.

**O orçamento é o último, e isso muda a decisão.** Não há OS depois da R6 que possa gastar
carta: a R7 está proibida pela G9, a R8 é editorial e a R9 é do gerador. Guardar as quatro
«para depois» é gastá-las em nada.

**A lição das cinco últimas OS, em uma linha:** o pipeline `revisar-prosa` reprovou a R3, a
R4 e a R5 na primeira passada, e em cada uma foi um revisor diferente que apanhou o
bloqueante. **Na R5 aconteceu o caso mais instrutivo: dois revisores contradisseram-se sobre
a mesma conta, e ambos tinham razão sobre coisas diferentes** — o desenho estava certo e a
legibilidade errada. A frase que ficou na ata vale para esta OS inteira: *uma armadilha que
se lê como engano não é armadilha.*

---

## 4. Estado do repositório no fecho da OS-R5

| | |
|---|---|
| Ramo | `claude/prompt-versionado-continuacao-35cktg` |
| Base | `claude/mortem-vertical-slice-zzrcto` |
| Gate | `npm run verificar` — a bateria inteira, verde |
| Cartas | **42 de 46** (41 no catálogo + `ev_algor`), **4 livres** |
| Horas | 18h00 · 18h00 · 14h00 · 13h00 |

**Aberto, por OS:**

- **OS-R7** (a reconstituição): a revozação do `monologo.js`; **não pode gastar carta** (G9).
- **OS-R8** (passe editorial): tudo o que a ata da R4 deixou, mais o **«púlpito de escrever
  forrado de cortiça»** de `pt_oficina_pulpito` — achado do perito-forense na R5: «púlpito»
  em PT é o da igreja (e o caso já tem uma), a KB verte o móvel como «escrivaninha alta de
  tampo inclinado», e cortiça como forro de tampo não está documentada. Mexer no rótulo do
  ponto toca o contrato do `qa-ui`.
- **OS-R9** (o gerador herda os padrões): a fila que a R4 deixou, mais o **arquétipo do
  veraz sem crédito**, o **móbil que se prova por aritmética de livro** (padrão que a R5
  estreou) e — se esta OS os construir — a **exposição** e o **`apontadaPor`**.
- **Camada de apresentação:** `FundoCena.jsx` desenha um armário de arquivo onde a prosa diz
  cômoda.
- **Sem dono, e é decisão de desenho:** o prazo do inquérito com consequência mecânica (o
  utilizador martelou «ficção só, por agora» na R3; reabrir **depois da R8**).
- **De KB, registado e não criado:** `CLASSES_VESTIGIO` não tem classe de **roupa queimada**
  nem de **documento queimado** — os dossiês existem, o gerador não sabe produzi-los.
