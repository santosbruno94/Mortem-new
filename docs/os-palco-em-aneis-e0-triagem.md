# E0 — Caixa D, triagem coordenada e auditoria da última milha

> Entregável da fase E0 da OS "Palco em anéis" (`os-palco-em-aneis`).
> Data: 18/07/2026. Método: como o relatório 2/6 e o parecer espacial de 18/07
> **não estão no repositório** (a OS os cita como origem, mas só a própria OS foi
> anexada à sessão — mesmo caso do F0 da OS de priors), os achados foram
> **reverificados um a um contra o código vivo** (`src/gerador/`, `src/data/`,
> `scripts/`) na data da execução. Nada abaixo é citação de memória: cada linha
> tem lastro em arquivo e função nomeados.

## 1. A caixa D — monotonia de palco (registro formal)

Ao lado das caixas A (invariantes aprendíveis), B (estreiteza distribucional) e
C (dado sem boca) da triagem F0 (`os-priors-compostos-f0-triagem.md`), fica
registrada a **caixa D — monotonia de palco**: todo caso gerado é interno, no
prédio da rotina da vítima, achado com perito às 11h, apresentado como lista
chapada. Subdivisão:

- **D1. Apresentação (a última milha):** o dado espacial existe rico no
  `RegistroDoCrime` e morre na ponte — o jogador recebe a cena como parágrafos,
  sem os `pontos` que o caso-escola tem.
- **D2. Ontologia:** o palco é ontologicamente único — sempre `rotina[faixa]`,
  sempre prédio, sempre 11h, mapa de dois grupos; sem logradouro, sem comarca,
  sem forasteiro.

## 2. Tabela reclamação → caixa (coordenada com a F0)

A F0 triou 13 reclamações nas caixas A/B/C; **nenhuma delas é espacial** — não
há dupla contagem. As reclamações espaciais, reconstituídas da própria OS
(relatório 2/6, S2(b) do playtest de 17–18/07, parecer caixa D) e verificadas
contra o código:

| # | Reclamação (padrão sentido) | Verificação no estado atual | Caixa | Remédio |
|---|---|---|---|---|
| D-1 | A cena gerada é **lista chapada de marcadores**, sem os compartimentos do caso-escola | `pacote_gerado.js` → `montarLocalidades`: a localidade `cena` sai com `prosa: [...]` monolítica; só o caso-escola (`src/data/localidades.js`) tem `introducao` + `pontos`. O componente (`EventoLocalidade.jsx`) já renderiza `pontos` de qualquer localidade — a lacuna é só do montador | **D1** | E1 |
| D-2 | O jogador **nunca sabe em que cômodo** cada vestígio estava, embora o gerador saiba | `ponte_caso.js`: toda carta de vestígio nasce com `localidade: 'cena'` e **nenhum** campo `comodo`/`celula`/`mobilia`; o `RegistroDoCrime` (`crime.js`) carrega os três por vestígio | **D1** | E1 |
| D-3 | A mobília aparece como **inventário de uma frase** ("No cômodo, X, Y, Z") e só a do cômodo do corpo | `montarLocalidades`: `interior.mobilia.filter(comodo do corpo).slice(0, 3)` numa única frase de abertura | **D1** | E1 |
| D-4 | O acordeão do caso-escola telegrafa? Não — porque tem pontos **sem carta** (a copa com a chaleira fria); o gerado não tem nem acordeão | Caso-escola: 4 pontos na cena, nem todos com carta essencial. Gerado: zero pontos | **D1** | E1 (pontos de ambiência, GE2) |
| D-5 | **Local do crime = sempre prédio da rotina da vítima** | `caso.js` passo 4: `localId = vitima.pacoteEspacial.rotina[faixa]` — sem exceção; `comodoDoCrime` escolhe quarto (madrugada) ou maior cômodo | **D2** | E2 (§3.4, §3.6) |
| D-6 | **Chegada fixa às 11h**, descoberta do corpo inexistente como evento | `ponte_caso.js`: `const HORAS_CHEGADA = 11`; `pacote_gerado.js`: `parametrosCena.horasChegada: 11`. Quem achou o corpo, quando, jamais é gerado ou narrado | **D2** | E2 (§3.5) |
| D-7 | **Mapa gerado é binário**: `cena_predio` (0h) e `vila` (1h); nada distante, nada por lead além da diligência | `montarMapa`: dois grupos fixos, custos 0/1; um único lead (`gen_motivo` → `oficio_do_reu`). O caso-escola tem `fora` (Moorford, 1,5h/trecho) | **D2** | E3 |
| D-8 | **Sem forasteiro, sem comarca**: todos os 8 do elenco moram e trabalham na vila; nenhum nó fora dela | `mundo.js`/`insercao.js`: todo `pacoteEspacial` aponta prédios da cidade gerada; não existe `comarca.js` | **D2** | E3 |

## 3. Auditoria da última milha (D1) — campo a campo

O que o gerador **sabe** × o que o pacote **entrega** ao jogador, confirmado no
código vigente (commit `dec0940`):

| Dado | Onde nasce | Onde morre | Chega ao jogador? |
|---|---|---|---|
| `vestigio.comodo` | `crime.js` → `depositar()` (via `comodoDaCelula`) | `ponte_caso.js` não copia para a carta | **Não** |
| `vestigio.celula` / `celulas` (trilhas) | idem | idem | **Não** |
| `vestigio.mobilia` (peça-âncora) | idem (`mobilia_revirada`, `residuo_do_veneno`…) | idem | **Não** |
| `posicaoCorpo.{comodo,celula}` | `crime.js` (queda ou arrasto) | **Sobrevive parcialmente**: `montarLocalidades` usa `posicaoCorpo.comodo` para nomear o cômodo na prosa do corpo e filtrar a mobília citada | Só o nome do cômodo do corpo |
| `eventos[]` georreferenciados (golpe, recuo, limpeza, arrasto — com cômodo/célula/hora) | `crime.js` → `registrarEvento()` | nunca lidos pela ponte nem pelo montador | **Não** |
| `interior.comodos[]` (partição, rótulos) | `interiores.js` | só o cômodo do corpo é citado; os demais não existem na apresentação | **Quase não** |
| `interior.mobilia[]` (2–3 peças/cômodo, célula) | `interiores.js` | 3 peças do cômodo do corpo, numa frase | **Resumido** |
| `interior.planta` (SVG derivado do grid) | `interiores.js` → `plantaSvgDoInterior` | nenhum componente a renderiza para caso gerado (`PlantaRelojoaria` é só do caso-escola) | **Não** |
| `batalha.rodadasLog`, `caminho`, `rotaFuga` | `crime.js` | consolidados em vestígios (correto — regra de existência); as **âncoras espaciais** dos vestígios sobreviventes é que se perdem na ponte | Indireto, sem lugar |

Confirmação do desenho da OS: a correção de D1 é **na ponte e no montador**
(`comodo`/`celula`/`mobilia` como metadado gerador-facing na carta, na linhagem
de `suporteFisico`; `introducao` + `pontos` na localidade `cena`), com
`tagsOcultas` intactas e **zero** mudança de motor ou de componente — o
`EventoLocalidade.jsx` já renderiza `pontos`, contadores e gestos para qualquer
localidade que os declare, e `gerar-casos.mjs`/`qa.mjs` já leem
`introducao`/`pontos` na checagem de marcadores.

## 4. Sanidade combinatória: regime-palco × regime-magnitude

- **Regime-magnitude** (OS priors, F3 — implementado): moeda por caso, sal
  `seed|caso|regime-magnitude` via `hashDecisao` (hash decorrelacionado),
  fração 7/10 regime 2 (`vetores_psiquicos.js`).
- **Regime-palco** (esta OS, §3.6 — futuro E2): moeda por caso, sal
  `seed|caso|regime-palco`, bandas propostas 70/20/10.

São **moedas ortogonais por construção**: sais distintos sob o mesmo
`hashDecisao` decorrelacionado (a linearidade de `hashString` puro, achado
B✱ da F0, foi remediada na F2 da outra OS — o sorteio de regime já usa a via
decorrelacionada; o regime-palco deve nascer pela MESMA via). Nenhuma das duas
lê a outra; a distribuição conjunta (6 células: 2 magnitudes × 3 palcos) será
auditada em E4 por Monte Carlo ≥ 200 mil casos, com atenção à célula mais rara
(regime 1 × pousada/forasteiro, ~3%): rara é aceitável, **degenerada**
(invariante aprendível dentro da célula) não.

## 5. Regra de parada

E1 procede imediatamente (custo baixo, ganho imediato, zero risco de design) —
não depende de nada da OS de priors, cujo F0–F4 já mergeou. A ordem de E2–E3
frente às demais OSs em curso é [DECISÃO] do autor, levada junto com as
decisões de E1.

— fim de E0 —
