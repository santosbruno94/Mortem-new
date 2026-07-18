# OS Autobattler v2 — B2: a tabela de doutrinas e a matriz ação→vestígio

**Gerado por `scripts/gerar-tabela-doutrinas.mjs` a partir de `src/gerador/doutrinas.js` — não editar à mão.**
Entregável-portão da fase B2 (OS §3.4): a aprovação do autor sobre ESTE doc libera a B3.

## 1. O contrato

A escolha de ação é **função pura do estado** — zero sal (GB3: fuzz de ≥10⁴ estados,
mesma entrada ⇒ mesma ação; lint estático: `doutrinas.js` não importa hash). Só a
**resolução** rola dados (acerto, dano, alvo-região, incidental — sais de B3). As flags
de réplica/desespero (`fugaSuprimida`/`forcarVitoria`) agem na **legalidade** das ações,
nunca nas linhas de doutrina. Regiões (D2=b): `bracos | maos | pernas | cabeca | tronco`,
cada uma `integro | ferido | inutilizado`; braços OU mãos inutilizados ⇒ não apara nem
se arma; pernas inutilizadas ⇒ não foge; o agarre (`presa | livre`) substitui o
`seguraAVitima`-como-sentença — **o desvencilhar existe**.

## 2. Matriz ação → vestígio (o portão da regra de existência)

| Ação | Papel | Pré-condições (resumo legível) | Classe de vestígio | Rastro diferencial |
|---|---|---|---|---|
| `golpear_metodo` | assassino | adjacente; o método na mão | `ferida_fatal` (lesão fatal) | a lesão do método, com sede na região-alvo (B3) |
| `golpear_improvisado` | ambos | peça na mão; adjacente; braços/mãos servem | `lesao_padrao_de_peca` (lesão com o padrão da peça improvisada) | a lesão com o padrão da peça no atingido + resíduo na peça (o sangue no castiçal) |
| `armar_se` | ambos | sem peça; peça empunhável a ≤1 célula; braços/mãos servem | `peca_deslocada` (peça fora do lugar (tomada ou interposta)) | a peça fora do lugar (o atiçador fora do jogo de ferros) + a assinatura dela em quem apanhar |
| `desvencilhar` | vitima | presa no agarre; braços/mãos servem | `ungueais_de_desvencilhamento` (escoriações ungueais de desvencilhamento) | escoriações ungueais no próprio pescoço + fibras/pele sob as unhas (o caso-escola do garrote falho) |
| `aparar` | vitima | livre; adjacente; braços/mãos servem | `ferimentos_defensivos` (ferimentos defensivos) | ferimentos defensivos com sede: antebraços (aparar) e palmas (agarrar a lâmina) — D2=b |
| `interpor` | vitima | livre; peça `bloqueia` interponível (D1=a); braços/mãos servem | `peca_deslocada` (peça fora do lugar (tomada ou interposta)) | a peça girada/arrastada fora do seu assento (detalhe: interposta) |
| `fugir` | vitima | livre; pernas servem; sem flag de réplica/desespero | `trilha_gotejamento` (trilha de gotejamento da fuga) | trilha de gotejamento + esfregaço de limiar + lesões de sítio posterior (o preço da fuga, vigente) |
| `gritar` *(rolagem)* | vitima | grito não gasto; livre; sem flag — ROLAGEM PARALELA (não é escolha) | `grito_ouvido` (grito ouvido na vizinhança) | grito com hora própria, audível aos adjacentes (regra de existência vigente) |
| `perseguir` | assassino | fora de alcance | `rastro_da_luta` (rastro da luta em mais de um ponto) | a luta que anda: rastro em mais de um ponto, mobília tombada no caminho |

Toda ação declara classe EXISTENTE em `CLASSES_VESTIGIO` (lint GB4); ação sem rastro
diferencial não entra no catálogo (regra de existência §2.3). As classes novas desta OS
(`peca_deslocada`, `lesao_padrao_de_peca`, `residuo_na_peca`, `ungueais_de_desvencilhamento`,
`lesao_incidental` + `fibra_na_aresta` — par `naoCausal` —, `ferimento_do_agressor` com
sede) estão declaradas em `vestigios.js`; a deposição liga em B3.

## 3. Doutrina da VÍTIMA

A PRIMEIRA linha cuja condição casa E cuja ação é legal vence — sempre, para o mesmo
estado, a mesma linha. O jogador reconstrói de trás para frente.

| # | Condição (código, literal) | Ação | Porquê (a linha que o jogador reconstrói) |
|---|---|---|---|
| v1 | `(sempre, se legal)` | `desvencilhar` | presa: soltar-se é a única ação que muda o estado — o desvencilhar existe |
| v2 | `(sempre, se legal)` | `golpear_improvisado` | armada e ao alcance: quem tomou a peça usa a peça |
| v3 | `armadaDePeca(e) && !adjacente(e) && prefereFugir(e)` | `fugir` | armada mas longe, e o corpo pede a porta: corre armada |
| v4 | `prefereResistir(e)` | `armar_se` | o vetor psíquico resolve o empate: quem resiste toma a peça (sobAtaque.resistir / polaridade ativa) |
| v5 | `forRelativaAlta(e) && !prefereFugir(e)` | `armar_se` | FOR relativa alta sem pendor de fuga: enfrenta com o que a sala oferece |
| v6 | `prefereFugir(e)` | `fugir` | o vetor psíquico resolve o empate: quem foge corre à saída (sobAtaque.fugir / polaridade passiva) |
| v7 | `saidaMaisPertoQuePeca(e)` | `fugir` | a porta está mais perto que a peça: o corpo neutro escolhe o mais próximo |
| v8 | `(sempre, se legal)` | `armar_se` | porta longe, atiçador ao alcance: ela fez o que faria — arma-se (o exemplo normativo) |
| v9 | `(sempre, se legal)` | `fugir` | default do corpo livre sem peça alcançável: a saída |
| v10 | `ferida(e)` | `interpor` | não alcança a porta nem peça de mão, mas há a mesa: interpõe e ganha rodadas |
| v11 | `(sempre, se legal)` | `aparar` | resta resistir: apara com antebraços e palmas |

## 4. Doutrina do ASSASSINO

A PRIMEIRA linha cuja condição casa E cuja ação é legal vence — sempre, para o mesmo
estado, a mesma linha. O jogador reconstrói de trás para frente.

| # | Condição (código, literal) | Ação | Porquê (a linha que o jogador reconstrói) |
|---|---|---|---|
| a1 | `(sempre, se legal)` | `golpear_improvisado` | trocou de arma (B4): termina com o que tem na mão |
| a2 | `e.trocaElegivel === true` | `armar_se` | B4 (gated): o método falhou, ele está ferido e a peça está ao alcance — troca |
| a3 | `(sempre, se legal)` | `perseguir` | fora de alcance: fecha a distância (a perseguição curta cabe no grid) |
| a4 | `(sempre, se legal)` | `golpear_metodo` | ao alcance, com o método na mão: golpeia |

## 5. O caso-escola (exemplo normativo do autor)

Garrote premeditado, FOR da vítima alta: sobrevive à surpresa → `presa` → **v1**
desvencilhar → sucesso (FOR×FOR, sal de resolução) → sulco interrompido + ungueais no
próprio pescoço → estado livre/ferida/polaridade ativa/atiçador a 1 célula → **v4**
armar-se (`peca_deslocada`) → **v2** golpear (`lesao_padrao_de_peca` no assassino +
`residuo_na_peca`) — **não fugir**. Cada passo é a primeira linha legal da tabela.

## 6. Desempate causal (a promoção do vetor psíquico)

`sobAtaque` deixa de ser peso somado a sorteio e vira **regra de desempate**: decide
QUAL linha captura o estado ambíguo (v4×v6), nunca rola dado. Vetor explícito vence
polaridade; polaridade desempata o vetor neutro; o corpo neutro escolhe o mais próximo
(v7) e, na dúvida com a peça à mão, arma-se (v8 — o exemplo normativo).

## 7. Terminação e inação

O laço de B3 é `for r = 1..MAX_RODADAS` (teto duro — sem `while` sobre estado); a
reamostragem por rejeição continua cobrindo vitória da vítima (motivos novos:
`vitima_venceu_armada`, `assassino_incapacitado`). `doutrina()` devolve `null` quando
nenhuma ação é legal (surpresa da rodada 1, braços e mãos inutilizados): inação não é
ação do catálogo e não deposita rastro.
