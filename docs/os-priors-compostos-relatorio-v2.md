# Relatório v2 — o elenco depois da OS priors compostos (G8)

> Artefato de aceite da OS `docs/os-priors-compostos-e-variedade-do-elenco.md`
> (§5.3-G8). Data: 18/07/2026. Método: Monte Carlo determinístico com os DADOS
> FINAIS (pós-F4) — 200 mil elencos de 8 (`node scripts/auditoria-elenco.mjs
> 200000`, seeds `auditoria_*`) para as distribuições de elenco, e 200 casos
> COMPLETOS (`gerarCasoBruto`, seeds `comarca_1..200` — o mesmo lote fixo das
> guardas G4–G6) para as métricas de caso, que dependem de cenário e regime.
> Reproduzível byte a byte; nenhum número deste relatório é estimado à mão.

## 1. Tabela 1 regenerada — composição do elenco (18 arquétipos)

| arquétipo | média/elenco | presença ≥ 1 | | arquétipo | média/elenco | presença ≥ 1 |
|---|---|---|---|---|---|---|
| lavrador | 1,94 | 89,4% | | taverneiro | 0,33 | 32,5% |
| criada | 1,36 | 77,5% | | merceeiro | 0,33 | 32,7% |
| ferreiro | 0,58 | 45,5% | | carroceiro | 0,32 | 32,5% |
| costureira | 0,58 | 45,4% | | squire, pároco, médico, boticário, moleiro, professora, constable, guarda-caça, parteira | 0,18 cada | ~17,7% cada |
| lavadeira | 0,58 | 45,4% | | | | |
| pastor de ovelhas | 0,39 | 32,8% | | **gênero** | **65,3% M** | **34,7% F** |

Contra o estado anterior (2,26 lavradores; lavrador em 96,9% dos elencos): a
reclamação nº 9 da triagem cedeu — lavrador caiu a 1,94 e nenhum elenco é mais
"2,3 lavradores + 1,6 criadas" por padrão. O gênero moveu-se pouco (65,0 →
65,3/34,7: os 4 arquétipos novos somam 3 masculinos + 1 feminino — o efeito da
parteira foi compensado por pastor/carroceiro/guarda-caça). **Registro honesto:**
a meta de ~60/40 do dossiê §2.1 NÃO foi atingida; o alvo histórico rural é
~50/50, e o caminho restante é mexer nos `generos` dos arquétipos existentes —
fica anotado para calibração futura (dado, não sistema).

## 2. Norma N1 e os quadrantes (critério de aceite nº 2)

- **Painel A (violações de N1): VAZIO.** Nenhum arquétipo tem extremo de
  INT/WIS/CHA inalcançável — contra 13/14 arquétipos violando antes de F2.
- **Painel D (quadrantes INT × WIS): os 4 quadrantes vivos nos 18 arquétipos.**
  Antes: A/A morto em moleiro/merceeiro, B/A e B/B mortos em médico/boticário/
  professora (metade por prior, metade pelo acoplamento do hash — achado B✱).
  Agora, exemplos: lavadeira A/A = **9,4%** (a lavadeira pode ser gênio — o
  caso-teste da OS); médico B/B = 4,2% (o médico brutal e desleixado existe);
  moleiro A/A = 12,1%.

## 3. Matriz de afinidade e o móbil íntimo (critérios nº 3 e 4)

P(destoante nato) por pessoa, por ofício (painel B): **6,3–10,3%**, média
demográfica ~7,5% — contra 3,4–7,7% (média 5,0%) antes. Quatro ofícios ficam um
fio abaixo da banda "~7–11%" da OS (moleiro/merceeiro/lavadeira a 6,3%;
taverneiro/ferreiro/professora/costureira a 6,7%): desvio de −0,4 a −0,7 p.p.,
efeito aritmético de o catálogo ter crescido a 13 vetores (cada vetor novo em
degrau média dilui os raros). Registrado como aceitável dentro do "~" da OS; o
parafuso de correção, se o autor quiser, é um 3º raro nesses ofícios.

- **Isca forçada** (200 casos completos): 80 forçamentos em 135 casos de regime
  2 = **59,3%** — meta ≤ 60% batida (era ~73%).
- **Falha das 24 tentativas de reamostragem** (nota §4.6): de ~29% para
  ~5–17% conforme o ofício (recalculado no comentário de `forcarVetor`).
- **Mapa ofício-do-réu → móbil íntimo** (painel G): **18/18 ofícios com ≥ 2
  raros** (critério nº 4 pedia ≥ 2 em ≥ 12). No regime 2, o vetor do réu
  distribui-se entre 2–3 raros (ex.: criada — erudito 27,8%, justiceiro 22,2%,
  enraizado 20,2%: **a criada culpada deixou de ser sempre a Justiceira**); no
  regime 1 (~30% dos casos), o réu é modal e o vetor espalha-se pela cauda
  inteira — a determinização morreu nas duas pontas.

## 4. Regimes e o anti-tell estendido (critério nº 5)

Nos 200 casos completos:

| métrica | valor | guarda |
|---|---|---|
| casos em regime 1 | 65/200 = **32,5%** | G6: banda 30% ± 10 p.p. ✓ |
| briga escalada | 63/200 = 31,5% | (o ~1/3 de sempre) |
| réu forçado ao desencaixe (regime 2) | 126/135 = 93,3% | esperado: réu nato é raro |
| destoantes por caso (média, pós-forçamento) | 0,92 | piso fixo de "exatamente 2" desfeito |
| mentirosos-calmos: inocentes × réus | 198 × 58 | — |
| **precisão do tell calmo (fração inocente)** | **77,3%** | G5: ≥ 60% ✓ — "serena ⇒ réu" morreu |

Flags recalibradas (elenco de 200 mil, via premeditada): `mente_com_calma` do
réu 33,4% no premeditado (alvo 2/6; na briga, 1/6 — o acoplamento é o tell
novo, refutável); `omite_por_decoro` 24,2% médio, agora POR CLASSE (era 49,3%
plano — o decoro do clero ≠ o do lavrador).

## 5. Nomes (dossiê §2.6 realizado)

164 prenomes distintos em 1,6 M de personagens (eram 55); top-3 por gênero ≈
28% (ponderação de Galbi: em 1840 o top-3 real cobria ~40%; a mistura de
coortes e a poda do proxy-1904 explicam o resto); 50 sobrenomes com 40,7% dos
elencos repetindo um sobrenome internamente — o "2–3 sobrenomes repetem na
vila" da KB, agora emergente do sorteio verdadeiro (o número anterior, 21%, era
artefato do hash linear: os sorteios-irmãos de sobrenome eram uma progressão
correlacionada, não acaso).

## 6. Critérios de aceite da OS (§7), um a um

1. **G1–G8 verdes** + guardas herdadas (L1/L2, não-vazamento, determinismo,
   anti-tell regime-ciente, guarda de import, trava de menores): `qa.mjs` CASO
   VÁLIDO; `qa-ui.mjs` UI VÁLIDA; `npm run build` limpo. ✓
2. **Nenhum quadrante INT × WIS inalcançável** (a lavadeira pode ser gênio). ✓
3. **P(nato) ~7–11%** (6,3–10,3% — ressalva honesta do §3 acima); **isca
   forçada ≤ 60%** (59,3%). ✓ com registro
4. **≥ 2 destinos de móbil íntimo em ≥ 12 ofícios**: 18/18. ✓
5. **Tell calmo dentro da banda de G5**: 77,3% ≥ 60%. ✓
6. **Replay byte a byte no golden set novo** (guarda FASE 6 regenera e compara);
   **runtime sem import** de `arquetipos.js`/`vetores_psiquicos.js` (guarda de
   ilha). ✓
7. **Todos os 12 [DECISÃO] respondidos pelo autor** antes do merge das fases
   (dossiê F1 §D; recomendações aprovadas). ✓

— fim do relatório v2 —
