# OS-R10 — Prompt de arranque para a sessão seguinte

Escrito no fecho da OS-R9, contra a árvore real, como a OS-R0 §4 manda. Copiar o bloco do
§1 como primeira mensagem da sessão nova.

A R9 abriu a frente do gerador e entregou seis dos dez itens da fila. Esta continua a
mesma frente — e o §2 traz, para cada item que sobrou, **o número que a R9 mediu**, para
que a sessão nova não reinvestigue o que já foi contado.

---

## 1. O prompt

> Executar a **OS-R10 — O que a ponte não mostra** no repositório MORTEM, do arranque ao
> fecho com ata. É a **segunda OS da frente do gerador** (a primeira foi a R9, com ata em
> 26/07/2026). **Confirmar que o PR da R9 está integrado antes de abrir ramo** — regra
> dura da OS-R0 §5, e a ata da R9 vive nele.
>
> **Antes de tocar em qualquer ficheiro, ler nesta ordem:**
> 1. `docs/os-r0-mestra-reforma-hora-emprestada.md` — a ordem-mestra. Não se executa;
>    governa. Aqui pesam a **G9** (o clímax dramatiza, não prova), a **G12** (o banco é
>    produto) e o **§3.3 do design**, a conservação da evidência: *toda ação de limpeza
>    remove um vestígio removível e deposita um de segunda ordem no mesmo ato — o óbvio
>    vira sutil, nunca zero.* É essa regra que esta OS vai fazer valer até o fim.
> 2. A ata da **OS-R9** no fim de `docs/historico-decisoes.md`, e em especial a secção «o
>    achado que fixa o teto da reconstituição» — é ela que dá nome a esta OS.
> 3. `docs/os-r9-fase-0-telemetria.md` — a telemetria de lote da R9. O molde de medição
>    desta OS é o mesmo, e vale a pena reler como ela mede antes de arbitrar.
> 4. `docs/game-design-simulacao.md` — a especificação do gerador.
> 5. `CLAUDE.md` — regras invioláveis. Aqui pesam **zero LLM em runtime / tudo
>    determinístico** e **o motor é cego a atributos**.
>
> ---
>
> ### O item central, e ele já vem medido
>
> **A ponte não realiza o que a simulação deposita.** O `crime.js` cumpre a conservação da
> evidência e deposita vestígios de segunda ordem; o `ponte_caso.js` não os transforma em
> carta; logo o jogo não os mostra, o jogador não os colhe e nenhum gesto da reconstituição
> os desfaz. Medido no fecho da R9, sobre os 31 casos:
>
> | Classe depositada | Ocorrências | Tem carta? |
> |---|--:|---|
> | `mobilia_recomposta` | **20** | não |
> | `assoalho_esfregado` | 5 | não |
> | `trilha_arrasto` | 2 | não |
> | `assoalho_esfregado_faixa` | 1 | não |
> | `louca_lavada_fora_de_hora` | 1 | não |
> | `trilha_gotejamento` | 1 | não |
>
> **É o melhor rendimento em aberto no repositório:** dar carta a `mobilia_recomposta`
> sobe a reconstituição de **12/31 para perto de 30/31**, sem escrever gesto novo — o
> catálogo da R9 já sabe produzi-lo assim que houver carta que o desfaça.
>
> ### Há UM ponto de decisão, e ele é de equilíbrio
>
> Carta nova mexe no que `metodicoResolve` e os quatro perfis validam em 31 casos. A
> pergunta é **quantas** das seis classes ganham carta nesta OS: só a de vinte
> ocorrências, ou as seis. Recomendação: **começar pela `mobilia_recomposta` sozinha**,
> medir o efeito no lote, e só então decidir sobre as outras cinco — porque uma carta a
> mais em vinte casos já é a maior mudança de equilíbrio que o banco sofreu desde que
> existe.
>
> ### O resto da fila da R9, com o número que ela mediu
>
> - **§2.3 o veraz sem crédito** — **0 cartas `insuficiente` em 31 casos**. O arquétipo não
>   existe no gerado nem por acidente. A régua está na GR4-3 do tutorial.
> - **§2.4 o móbil por aritmética de livro** — 31/31 provam móbil por depoimento e por
>   vestígio social; **nenhum** por soma. É a prova mais limpa que o jogo tem, porque não
>   depende de ninguém dizer a verdade.
> - **§2.9 roupa queimada e documento queimado** — as duas classes continuam ausentes das
>   35. Os dossiês de KB estão escritos (`docs/kb-medicina-legal/supressao-de-vestigios.md`,
>   secções «as roupas queimadas» e «o documento queimado») e são dos melhores do projeto.
>   **Atenção:** estas duas precisam de um ato que QUEIME, e o autobattler não tem nenhum —
>   é classe, deposição e carta, não só classe.
>
> ### A execução
>
> **Fase 0 primeiro, e mede LOTE.** Cinco OS seguidas provaram que medir primeiro poupa
> uma fase, e a R9 provou o caso extremo: a medida do dossiê mudou a fase inteira e achou
> um delator que nenhuma guarda via.
>
> **O banco é produto (G12).** Toda alteração no gerador exige `node scripts/gerar-casos.mjs`,
> que escreve `casos_gerados.js` **e** `casos_indice.js`. O `qa.mjs` cobra os dois por
> replay byte a byte.
>
> **Uma guarda pode medir ruído de amostragem e chamar-lhe tell** — é a primeira lição de
> método da R9. Com 31 casos, exigir que uma coincidência não aconteça reprova por sorte de
> seed. O que se prova é a PROPRIEDADE, por leitura de fonte; o que se mede é a BANDA, com o
> número publicado.
>
> **Guarda de fonte retira os literais antes de varrer** — segunda lição da R9, e ela custou
> uma reprovação: a prosa do derivador diz «ponha no papel» na boca de um suspeito, e a
> guarda acusou o gerador de consultar o papel dramático.
>
> **Toda prosa gerada nova passa pelo pipeline `revisar-prosa`**, com amostra **de lote**
> (várias seeds), e o gate é zero achados bloqueantes. **Contar com mais de duas passadas.**
>
> **Gate no fecho:** `npm run verificar`, e o caso-escola sai intocado (42 cartas, horas
> 18h00 · 18h00 · 14h00 · 13h00).
>
> **Fechar com ata** em `docs/historico-decisoes.md`, no modelo da OS-R0 §9, com a
> telemetria da Fase 0 publicada e a distribuição depois contra a de antes.
>
> **Ramo próprio a partir do ramo designado da sessão.** Atualizar `MORTEM_CONTEXTO.md`,
> `README.md` e `docs/plano-de-sessoes.md` no commit final.

---

## 2. Estado do repositório no fecho da OS-R9

| | |
|---|---|
| Ramo entregue | `claude/prompt-versionado-continuacao-j8y5x9` (6 commits) |
| Base | `claude/mortem-vertical-slice-zzrcto` |
| Gate | `npm run verificar` — a bateria inteira, verde |
| `qa.mjs` | **CASO VÁLIDO**, **145 checagens**, **30 guardas numeradas** |
| Cartas do caso-escola | **42 de 46**, 4 livres — número final, intocado |
| Horas | 18h00 · 18h00 · 14h00 · 13h00 |
| Guardas novas da R9 | GR9-1, GR9-2, GR9-3, GR9-5, GR9-6 |
| Banco | 31 casos, 155 árvores, replay byte a byte verde |
| Classes de vestígio | **35** (era 34) |

**O que o gerador passou a saber, com número:**

| | Antes | Depois |
|---|---|---|
| Procedência | 0/31 | **31/31**, 199 entradas |
| Feixe da D16 | 0/31 | **3/31** |
| Três níveis de exposição alcançáveis | réu 100%, inocente 43% | **100% e 100%** |
| Árvores com confronto | 102/155 | **155/155** |
| Beat 3 e degrau | 0 árvores | **155 árvores** |
| Reconstituição | 0/31 | **12/31** |

**Três guardas que a R10 herda e não pode supor mais fortes do que são:**

- a **GR9-2** prova a cegueira do beat 3 ao papel por **leitura de fonte**, não por
  amostra — se alguém acrescentar uma ramificação por `papel` noutro ponto do derivador, a
  guarda não a vê. O trecho varrido vai de `FECHO_POR_CLASSE` a `degrauDoTrato`;
- a **GR9-3** cobra que a prosa da cena não nomeie gente, e compara **nomes e ids do
  elenco daquele caso** — um apelido inventado na prosa passaria;
- a **GR9-5** isenta os nós `exigencia_*` **por prefixo de nome**. Se o derivador criar
  outra família de nó com resposta nula uniforme, ela reprova (e é para reprovar).

**Aberto, e por onde:**

- **OS-R10** (esta): a carta de `mobilia_recomposta` e as cinco irmãs; e o resto da fila
  da R9 (§2.3, §2.4, §2.9).
- **Lote de UI:** o item 10 do playtest (transcrição completa da carta amassada).
- **Lote do caso-escola:** a sala da `porta_beco`.
- **Para o playtest humano, com número novo:** a reconstituição existe em **12 dos 31**
  casos gerados. Medir se a ausência dela nos outros 19 se lê como fim de caso normal ou
  como peça que falta. O número antigo continua de pé: Intuitivo e Pericial Desatento
  chegam à cena do tutorial com **0 de 9** gestos rebatíveis.
- **Sem dono, e é decisão de mesa:** o prazo do inquérito com consequência mecânica; a
  normalização do `interrogatorio_silas` (martelada como **não fazer**).
- **Fora de toda a série** (OS-R0 §8): a camada psíquica, o pivô visual de gravura, o bug
  de `reacao_vital`.
