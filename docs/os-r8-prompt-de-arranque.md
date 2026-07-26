# OS-R8 — Prompt de arranque para a sessão seguinte

Escrito no fecho da OS-R7, contra a árvore real, como a OS-R0 §4 manda
(«cada uma escreve-se no fecho da anterior»). Copiar o bloco do §1 como
primeira mensagem da sessão nova.

---

## 1. O prompt

> Executar a **OS-R8 — Passe editorial e QA de fecho**
> (`docs/os-r8-passe-editorial.md`) do repositório MORTEM, do arranque ao
> fecho com ata. **É a última OS da reforma**, e a ata dela fecha as oito.
>
> **Antes de tocar em qualquer ficheiro, ler nesta ordem:**
> 1. `docs/os-r0-mestra-reforma-hora-emprestada.md` — a ordem-mestra. Não se
>    executa; governa. Interessam a **G3** (nenhum rótulo marca o réu que os
>    inocentes não recebam), a **G9** e a **G11** (que juntas proíbem gastar
>    carta), a matriz de colisão do §5 e o gate do §7.
> 2. `docs/os-r8-passe-editorial.md` — a OS a executar. Ler o **§3 inteiro
>    antes da Fase 0**: a fila está triada item a item, com a linha exata de
>    cada um, precisamente para que esta sessão **não reinvestigue** o que
>    três OS já investigaram.
> 3. A ata da **OS-R7** no fim de `docs/historico-decisoes.md` — em especial
>    a secção «Divergências registadas, e NÃO criadas» e o adendo de decisão
>    que a fecha — três das quatro já estão executadas, e a ata diz como.
> 4. `docs/guia-de-estilo.md` inteiro. Numa OS que só relê texto, o guia não
>    é consulta: é a especificação.
> 5. `CLAUDE.md` — regras invioláveis e o contrato com o `qa-ui.mjs`, que
>    esta OS toca mais do que qualquer outra da reforma.
>
> ---
>
> ### NÃO HÁ RODADA DE PERGUNTAS. Não sobrou decisão nenhuma.
>
> A R8 é a **primeira OS da reforma a abrir com o §5 vazio**. O único ponto
> de decisão que ela tinha — a divergência «carrilhão» — foi martelado pelo
> utilizador em **26/07/2026**, junto com as outras três divergências que a
> ata da R7 tinha registado, e **as três executáveis foram executadas no
> fecho da própria R7**. Não reabrir:
>
> - **«carrilhão» → alinhado.** O `MORTEM_CONTEXTO.md` já usa o termo do
>   glossário e ganhou a razão mais forte (adiantar teria **consertado a
>   prova**, porque cada hora batida avança a roda de contagem).
> - **A janela de `ev_maquinismo` → blindada sem mover o número.** A
>   `descricao` passou a dizer que a roda traz um entalhe por hora e nenhum
>   dos curtos das meias, e a janela `[−3,−2]` deixou de ser pressuposto.
> - **A queima do Livro I → resolvida em prosa.** O gesto diz agora que o
>   fogo não chegou ao fim, o que explica a carcaça sobrevivente sem tocar
>   na hora do sineiro (a saída cara, que se recusou).
> - **O vestígio do buril → arquivado para a R9.** O durável exigiria carta
>   nova, e 42 é o número final. Não há defeito a corrigir.
>
> **Executar do arranque ao fecho sem nova consulta**, salvo se a execução
> revelar contradição entre uma decisão e uma guarda — caso em que se
> pergunta na hora, e só isso. Na R6 e na R7 essa cláusula foi usada **zero
> vezes**: nas duas, **reler resolveu o que parecia exigir decisão**.
>
> ### A execução
>
> **Fase 0 primeiro, e a medida desta é outra.** Não é telemetria de jogo: é
> listar, por arquivo, cada item da fila com a linha exata **e o que o
> `qa-ui` toca nele**. Esta OS não inventa nada, logo a única maneira de ela
> quebrar alguma coisa é mexer numa string que o QA clica. Medir isso antes é
> o equivalente, aqui, do que a telemetria foi na R5, na R6 e na R7.
>
> **Numa OS sem invenção, todo diff é gratuito se não fechar um item da
> fila.** Cortar uma vírgula porque ficou mais bonito não é passe editorial;
> é churn. Cada mudança aponta para um item do §3.
>
> **Seguir as fases pela ordem** (§4 da OS), **um commit por fase**, como as
> sete OS anteriores fizeram.
>
> **A Fase 4 é a única que pode REMOVER código**, e a única cujo produto tem
> de ser justificado item a item na ata (GR8-6). Guarda que promete mais do
> que prova, guarda órfã de decisão revertida, guarda duplicada. Remover
> guarda sem ata é como gastar carta sem orçamento.
>
> **Toda prosa tocada passa pelo pipeline `revisar-prosa`** com os três
> revisores, e o gate é **zero achados bloqueantes**. **Nesta OS o pipeline
> não é formalidade: é o trabalho.** Na R7 um dos cinco bloqueantes era o
> pivô do caso escrito ao contrário — o relógio esmagado antes de os
> ponteiros recuarem — e foi visto por **um só** dos três revisores, depois
> de os outros dois terem lido a mesma linha. Um deles chegou a validar a
> versão errada, e retirou o parecer na segunda passada.
>
> **Gate no fecho:** `npm run verificar`. Acresce o gate específico do §7.
>
> **Fechar com ata** em `docs/historico-decisoes.md`, no modelo da OS-R0 §9,
> acrescentando o que o §8 da R8 pede — e mais o que nenhuma outra ata pôde
> escrever: **o balanço da reforma inteira**, as oito OS, e quais dos padrões
> o gerador vai herdar na R9.
>
> **Escrever, no mesmo fecho, a OS-R9 e o seu prompt de arranque**, contra a
> árvore real. A R9 sai da reforma e entra no gerador: é mudança de frente, e
> merece o cuidado que a OS-R0 §4 exige.
>
> **Ramo próprio a partir do ramo designado da sessão**, depois de o PR da
> R7 estar integrado. Atualizar `MORTEM_CONTEXTO.md`, `README.md` e
> `docs/plano-de-sessoes.md` (frente SR — e nesta OS a frente **fecha**) no
> commit final.

---

## 2. O que a R8 vai encontrar, e que a R7 mudou

**A reconstituição existe, e é peça de leitura entre o mural e o monólogo.**
`src/logic/reconstituicao.js` monta a cena; `src/data/intervencoes.js` traz os nove gestos
da noite. **Nenhum gesto tem autor nomeado**, de propósito: é o que faz a G3 valer ali por
construção. Se a R8 revozar um gesto, o nome não entra — e a GR7-6 reprova se entrar.

**O fim de caso tem uma tela a mais.** O helper `julgar` do `qa-ui` atravessa-a e devolve o
texto dela em `reconstituicao`; três rotas cobram o que a cena mostra (9 gestos na mesa
completa, 3 nas magras) e o que ela se recusa a mostrar. **Mexer na cena mexe nessas
asserções.**

**O `blocoTestemunhas` conta bocas, não papéis.** `contarVozes` (em `contaminacao.js`) tem
a regra que a conta de auditoria não podia ter: alegação sem procedência registada é voz
própria — sem ela, o bloco desapareceria de todo o banco gerado. No caso-escola o bloco só
chega a render o caso de **uma** testemunha, e a GR7-4 prova a régua por asserção. **Isto
está investigado; não reinvestigar.**

**A D25 está nos cinco pools de fecho do monólogo**, uma variante por desfecho mais o fecho
anónimo do erro. Nenhuma põe o perito a assinar coisa nenhuma — a ordem «NAO ASSINE NADA»
do telegrama está intacta, e o assistente sem registo que assinasse não estaria a fazer
*covering*, estaria a falsificar. **Se a R8 revozar um fecho, a GR7-5 reprova variante que
não declare `maxima`**, e é o furo que não quebra teste nenhum até alguém ler dois
epigramas seguidos em jogo.

**As intervenções são campo OPCIONAL do pacote**, no padrão de `ecosDoMestre` e
`contradicaoHoras`. Sem catálogo, `montarReconstituicao` devolve `null` e o fim de caso vai
direto ao monólogo — é o que impede os trinta casos gerados de abrirem uma cena vazia.

**As horas são 18h00 · 18h00 · 14h00 · 13h00**, inalteradas pela R7 — e pelos três ajustes
do fecho, que de propósito **não moveram número nenhum**: o do relógio blindou a janela em
vez de a mudar, e o do Livro I resolveu-se em prosa em vez de na hora do sineiro.

**O banco está em sincronia e a R8 não toca no gerador.** `gerar-casos.mjs` escreve
`casos_gerados.js` **e** `casos_indice.js` — se algum comando o correr por engano,
restaurar os dois.

---

## 3. As armadilhas próprias desta OS

**A armadilha central é a natureza do trabalho.** Sete OS construíram; esta relê. Sem
critério, uma OS de acabamento vira uma passada de gosto sobre prosa que três revisores já
aprovaram — e cada linha mexida é uma linha que perde o parecer que tinha. **O critério é o
§3: cada diff fecha um item da fila, ou não existe.**

**Os rótulos do mural são o item de maior efeito e menor risco, e é fácil inverter isso.**
São três strings (`III · As Mentiras`, `depoimentos desmentidos`, `Mentiras`), e o motor já
é honesto: a gaveta lista as alegações verdadeiras junto com as falsas. Quem for «arrumar a
Estação III» em vez de trocar três nomes vai mexer em mecânica que não tem defeito.

**O púlpito toca o `qa-ui`.** Mexer no rótulo do ponto exige atualizar o QA no mesmo commit
— e é a regra do `CLAUDE.md`, não uma recomendação.

**A Fase 4 é a que pode fazer estrago silencioso.** Remover uma guarda que «não protege
nada» é exatamente o gesto que, meses depois, deixa passar a regressão que ela existia para
apanhar. A GR8-6 obriga a justificar cada remoção na ata; se a justificação não sair fácil
em duas linhas, a guarda fica.

**As divergências da R7 já não estão abertas, e é preciso não as reabrir por hábito.** A
hora de queima do Livro I e a janela de `ev_maquinismo` foram decididas e executadas no
fecho da R7 — a primeira em prosa (o fogo não chegou ao fim), a segunda blindando a carta
sem mover o número. Um revisor que releia a KB vai reencontrá-las; a resposta está na ata,
e **nenhuma das duas se reabre sem ata própria**.

---

## 4. Estado do repositório no fecho da OS-R7

| | |
|---|---|
| Ramo | `claude/prompt-versionado-continuacao-x18hom` |
| Base | `claude/mortem-vertical-slice-zzrcto` |
| Gate | `npm run verificar` — a bateria inteira, verde |
| Cartas | **42 de 46**, **4 livres — e é o número final** |
| Horas | 18h00 · 18h00 · 14h00 · 13h00 |
| Guardas da R7 | GR7-1 … GR7-7, mais a GR6-6 estendida |

**Aberto, por OS:**

- **OS-R8** (esta): a fila do §3. Dos quatro achados da R7, **três já foram executados** no
  fecho dela (o «carrilhão», a janela de `ev_maquinismo` e a queima do Livro I); sobram o
  **«vinco das nervuras»** de `ev_cinza_livro` e o **«antes do meio-dia»** da bíblia de
  vozes, mais o **QA de fecho**, que é a única fase da reforma que pode REMOVER guarda.
- **OS-R9** (o gerador herda os padrões): a fila que já existia — abertura testemunhal,
  `apontadaPor`, exposição (E0/E1/E2), arquétipo do veraz sem crédito, móbil por aritmética
  de livro, escada de confronto por contador autoral — mais os **dois novos desta OS**: as
  **intervenções da noite** (sem catálogo, os casos gerados não têm reconstituição) e a
  **dívida de geografia** das três aberturas de `reconstituicao.js`, que cravam a
  relojoaria num módulo cujo irmão declara não ter texto exclusivo de caso. Acresce, do
  martelo de 26/07/2026, o **vestígio durável do instrumento lavado** (o coágulo sob a
  virola, que a KB documenta e o caso-escola não pode comprar): é capacidade do gerador,
  não dívida do tutorial.
- **Para o playtest humano, com número:** os perfis **Intuitivo** e **Pericial Desatento**
  chegam à reconstituição com **0 de 9** gestos rebatíveis, e o segundo **condena**. Medir
  se a cena curta se lê como consequência da própria colheita ou como defeito. Se não se
  ler, o remédio é **de prosa** (a cena dizer que houve o que não se rebateu, sem dizer o
  quê), nunca de mecânica.
- **Sem dono, e é decisão de desenho:** o prazo do inquérito com consequência mecânica
  (ficção só, martelado na R3).
- **De KB, registado e não criado:** `CLASSES_VESTIGIO` não tem classe de **roupa
  queimada** nem de **documento queimado** — os dossiês existem, o gerador não sabe
  produzi-los.
