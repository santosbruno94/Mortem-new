# Relatório Espacial v1 — artefato de aceite da OS "Palco em anéis"

> Entregável da fase E4 (§5.2 da OS). Data: 18/07/2026.
> Método: Monte Carlo de **200.000 casos completos** (nível de pacote — o que o
> jogador recebe, com todos os fallbacks e gates de apresentação contando),
> seeds `mc_1..mc_200000`, determinístico e reexecutável:
> `node scripts/relatorio-espacial.mjs 200000` (363s). Guardas de lote (GE1–GE9)
> verificadas à parte pelo `qa.mjs` (CASO VÁLIDO, 101 checagens).

## 1. Regime de palco realizado (moeda 70/20/10 com salvaguardas)

| Palco | Casos | Fração |
|---|---|---|
| interno | 152.856 | 76,4% |
| logradouro | 27.346 | 13,7% |
| pousada (vítima-forasteiro) | 19.798 | 9,9% |

O desenho previa 70/20/10 na moeda; o realizado desloca ~6 p.p. do logradouro
para o interno porque a **salvaguarda** recai em interno quando não há via
(briga sem anexo compatível; o chamariz exige premeditado). Dentro da banda de
guarda (10–30%).

- **Vias do externo:** chamariz 97,9% × rotina 2,1%. A via de rotina ficou
  estrutural­mente rara após o veto do palco diurno (parecer do perito, E2 A3):
  só o açude-noite a alcança. *Candidata a calibração futura:* devolver pátio e
  adro à rotina exige descoberta no mesmo dia (recalendarizar a chegada).
- **Tipos de logradouro:** adro 32,7% · açude 35,1% · pátio 32,2% — equilíbrio
  quase uniforme (o chamariz sorteia entre os três).
- **Engodos:** bilhete 13.256 × recado 13.508 — a moeda binária não envieza.

## 2. Conjunta palco × regime-magnitude (E0 §4 — moedas ortogonais)

| Célula | Fração |
|---|---|
| interno × r2 | 53,6% |
| interno × r1 | 22,9% |
| logradouro × r2 | 9,6% |
| logradouro × r1 | 4,1% |
| pousada × r2 | 6,9% |
| pousada × r1 | 3,0% |

Magnitude marginal: r1 29,9% / r2 70,1% (a banda da G6). **Nenhuma célula
degenera**; a mais rara (pousada × r1, 3,0%) é exatamente a prevista na nota de
sanidade da E0 §4 — rara e sã: dentro dela os métodos e funções variam como nas
demais (verificação por recorte do mesmo lote).

## 3. Famílias de método por palco (GE5 em população)

| Família | Interno | Logradouro | Pousada |
|---|---|---|---|
| asfixia (garrote, esganadura, sufocação) | 47,3% | **41,0%** | 45,6% |
| contuso | 19,3% | 14,6% | 16,5% |
| lâmina | 19,4% | 14,6% | 16,1% |
| veneno | 13,9% | 20,4% | 21,8% |
| afogamento | 0,2% | **9,4%** | — |

- **O objetivo da E2 §3.3 está comprovado:** "cena externa ⇒ contuso" não
  existe (contuso externo 14,6%), e o **afogamento saiu do quase-invariante da
  forja** (0,2% interno → 9,4% externo, via açude/poço/cocho).
- **Registro honesto:** a asfixia externa marca **41,0% em população — 1 p.p.
  acima do teto Y=40%** aprovado para a GE5 (a guarda usa o lote fixo de 150
  seeds, onde marca 39%, e segue verde). Causa: a família agrupa 3 dos 8
  métodos. *Candidata a calibração:* pesar a seleção de método por família, ou
  aceitar o teto como "banda de lote" — decisão do autor, não desta fase.

## 4. Descoberta e IPM no palco externo (E2 §3.5)

- Descoberta: 6h (36%), 7h (37%), 8h (27%) — a banda 6h–8h30 povoada por igual.
- IPM à chegada do perito: espalhado de 4h a 16h (moda 8–10h), contra o IPM
  quase-fixo do interno (chegada 11h). O leque de estados de rigor/livor/algor
  que `tanatologia` documenta agora aparece de fato nos casos externos — a
  variação só entrou porque muda estado observável (regra de existência ✓).

## 5. Funções de satélite realizadas (E3; GE9 em população)

| Função | Fração dos casos | Fração dos casos com nó |
|---|---|---|
| sem nó | 50,8% | — |
| móbil (cobrança/partilha no procurador) | 21,3% | 43,3% |
| penhor da vítima | 10,9% | 22,1% |
| ausência (livro de hóspedes) | 7,2% | 14,5% |
| origem do forasteiro | 9,9% | 20,1% |

**Leitura da GE9:** a fração *corroborativa de álibi/cronologia* (penhor +
ausência) sobre os casos com nó **excluída a pousada** — cuja função "origem"
é identidade, não álibi, e nem passa pela moeda de função — dá **45,8%**,
dentro da banda 30–50% do Z=40% aprovado (a guarda do `qa.mjs` espelha
exatamente essa leitura e segue verde). Somando a origem, a fração "não aponta
o réu" sobe a 56,7%: em qualquer leitura, **"há satélite ⇒ o segredo mora lá"
não é lei aprendível** — 43,3% dos nós apontam o réu, 56,7% não.

## 6. Pontos da cena (GE2 em população)

664.256 pontos gerados; **56,1% sem carta** (ambiência pura) — dentro da banda
40–60% do autor, na metade alta: o acordeão não telegrafa.

## 7. Prédios novos (E4 §5.1)

A lista herdada do dossiê F1 §2.1 da OS de priors está **vazia**: os 4
arquétipos aprovados lá (carroceiro, guarda-caça, parteira, pastor) foram
ligados a prédios EXISTENTES pela F4 — varredura mecânica confirmou que nenhum
`pacoteEspacial` dos 18 arquétipos referencia tipo de prédio fora do catálogo.
Zero prédios a implementar nesta fase; a relojoaria segue hipótese de OS
futura.

## 8. Varredura de prosa (E4 §5.3)

O pipeline `revisar-prosa` (editor-crítico + perito-forense +
fiscal-continuidade) rodou **por fase, antes de cada merge** — E1, E2, E3
(núcleo, telegrama, ausências e forasteiro) — com todos os bloqueantes e altos
aplicados e greps de reverificação zerados nos commits correspondentes;
`lint-prosa` sem violação em todas as baterias. Não há superfície de prosa da
OS sem passada de pipeline.

## 9. Critérios de aceite da OS (§7), um a um

1. **GE1–GE9 verdes** + herdadas (determinismo, cegueira do motor, L1/L2,
   anti-tell, trava de menores, LOD, imports): `qa.mjs` CASO VÁLIDO, 101
   checagens. ✓
2. **Replay byte a byte no golden set novo; internos idênticos após E2**:
   provado no PR da E2 (réplica + 17 internos byte-idênticos) e reprovado a
   cada regeneração. ✓
3. **Regime-palco nas bandas; conjunta sem célula degenerada**: §1–§2 acima. ✓
4. **Nenhuma carta essencial perecível fora da vila; todo caso fecha sem
   viajar**: GE7 estrutural (só registro durável a distância, nunca classe
   temporal/causal/vestígio) + solvabilidade Metódica validada pacote a pacote
   no `gerar-casos.mjs`. ✓
5. **Cena externa com ≥ 2 famílias; chamariz sempre com vestígio alcançável**:
   §3 (5 famílias externas) + GE6. ✓ (ressalva honesta do teto Y em população,
   §3.)
6. **`qa-ui.mjs` verde nas rotas canônicas e numa rota gerada com pontos;
   contrato de UI intocado**: UI VÁLIDA em todas as baterias; o acordeão da
   cena gerada é exercitado pela rota gerada. ✓
7. **Todo [DECISÃO] respondido pelo autor antes do merge da fase**: E1 (2),
   E2 (4), E3 (4) — todas lavradas nos dossiês; as duas da E4 resolvidas por
   fato verificado (lista de prédios vazia) e por este relatório. ✓

## 10. Registros para triagem futura (consolidado da OS)

1. Paridade do `hashString` trava variantes irmãs — migração integral de
   `variante()` para `hashDecisao` é bump próprio (muda golden interno).
2. Ambiente térmico único (11°C) ao relento — divergência KB × motor anotada.
3. Descoberta no mesmo dia para crime diurno externo (recalendarizar chegada)
   — reabriria pátio/adro à via de rotina (§1).
4. "Carroceiro" com dois donos (wheelwright na KB × carrier no gerador).
5. Premeditado-com-fuga raríssimo (~1/200) — estreiteza pré-existente.
6. Asfixia externa 41,0% em população (§3) — teto Y por família.
7. `interferencia.js` ancora a limpeza encenada no cômodo final do corpo.
8. Propostas de KB do perito: Pawnbrokers Act 1872; protest × cobrança rural;
   telegrama manuscrito (1893) × fita colada (1927); registro de hóspedes
   compulsório só em 1914.

— fim do relatório espacial v1 —
