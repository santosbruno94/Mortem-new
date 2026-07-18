# OS Autobattler v2 — B0: parecer espacial e linha de base medida

**Data:** 18 de julho de 2026 · **Fase:** B0 (auditoria; zero mudança de produto)
**Norma-mãe:** `docs/os-autobattler-v2-doutrinas.md` §1 · **Harness:** `scripts/mc-batalha.mjs`

## 1. Veredito do grid — confirmado

**O grid NÃO precisa ser substituído — precisa de quatro extensões.** A tabela da OS §1,
conferida contra o código vigente (base pós-merge do E4 do palco, PR #66), com as
correções apuradas:

| Capacidade | Estado vigente (confirmado no código) | Basta ao v2? | Extensão |
|---|---|---|---|
| Resolução e partição | 15 layouts + 3 logradouros, grids 5×4 a 8×6 (15–48 células), split ±1 (`interiores.js`) | **Sim** | declarar a escala semântica da célula (~1 jarda/passo) em doc [D7] |
| Posições na batalha | só a vítima tem célula (`crime.js:179`); o assassino é implícito, sempre acerta (`crime.js:226-228`) | Não | estado com as duas posições; Chebyshev (já usada em `mobiliasAoAlcance`) entre atores e à saída |
| Movimento/colisão | `caminhoEmL` (`crime.js:140`) ignora tudo; mobília não bloqueia; fronteira de cômodo cruzável em qualquer célula | Parcial | BFS ≤48 células com `bloqueia: true` + portas internas derivadas — **aprovado [D1=a]** |
| Física da peça | schema `{id, item, rotulo, comodo, celula}` — zero propriedades; peça só ancora vestígio e tomba (`danificarAoAlcance`, `crime.js:194-201`) | Não | B1: `FISICA_DA_MOBILIA` por id de item |
| Âncora → método | **já generalizada além do parecer original:** `ITENS_COM_AGUA` (`espaco.js`, 4 itens, E2) alimenta `ancorasDisponiveis` (`caso.js`) → `metodosElegiveis` | Sim, como padrão | B1 deriva a lista do campo `fisica.ancora` (mesmos 4 itens; elegibilidade byte-idêntica) |
| Saída | **`interior.saidas` JÁ EXISTE** (`interiores.js:277-279`, entregue pelo E2: logradouro 2–4 células de borda; prédio, a unitária frente-centro) — mas `crime.js` ainda recomputa a porta em 3 pontos (fuga l.176/265/276; acesso preparado l.588; fuga desleixada l.633) via `saidasDoPalco`/fallback próprio | Parcial | B3 passa a ler `interior.saidas` como fonte única e aposenta as recomputações |
| Planta/SVG e UI | projeção 1:1 derivada do grid; batalha é build time, invisível | **Sim** | nada — bloqueio/portas viram traço derivado, mesmo contrato |

Correções à OS (o texto de 18/07 previa entregar o que o palco entregou primeiro):
o pré-requisito E2 §3.2 (`saidas`) **já está na base**, e não existe constante
`MOBILIA_DE_LOGRADOURO` — a mobília de logradouro vive em `MOBILIA_DE_OFICIO`
chaveada por tipoComodo. O schema `fisica` de B1 cobre ambas as estruturas por
**id de item**, e o palco o herda sem tradução.

## 2. Rejeitado com justificativa (OS §7.1)

**HP numérico por membro — rejeitado pela regra de existência** (`game-design-simulacao.md`
§2.3): duas trajetórias "3/5 vs 2/5" que terminam no mesmo mapa de feridas são
indistinguíveis na evidência; tudo viraria `variaveisInertes`. A camada de membro
entra como **condições discretas por região** — decisão do autor **[D2=b]: cinco
regiões** (`bracos | maos | pernas | cabeca | tronco`), mãos separadas de braços
(o aparar de antebraço distingue-se do agarrar a lâmina, de palma), cada bit
observável no laudo.

## 3. Linha de base medida (v1, pré-reescrita)

`node scripts/mc-batalha.mjs 200000` — 200.000 casos (seeds `mc_1..mc_200000`),
determinístico, 121s. Números do resolvedor **vigente**:

| Métrica | Valor | Nota |
|---|---|---|
| Batalha suprimida (venenos) | 15,5% | sem confronto físico |
| Desespero (24 tentativas esgotadas) | **5,5%** das travadas | referência externa dizia 5% — confirmada |
| Fuga realizada pela vítima | **7,5%** das travadas | referência externa 7,5% — batida na vírgula |
| Réu ferido na batalha aceita | 28,0% das travadas = **23,6% de todos os casos** | **reconcilia o 23,8% externo** (a auditoria media sobre todos os casos) |
| … com observável no CORPO do réu | **0%** | a classe não existe no v1 — o furo que `ferimento_do_agressor` (B3) fecha; a única via é a carta de cena `gen_sangue_alheio` (100% de cobertura de cena) |
| Grito rolado / ouvido | 9,5% / 4,4% | regra de existência silencia o resto |
| Mobília revirada | 66,7% dos casos, 2,27 peças | via drift, não via ação |
| Rodadas da batalha aceita (média) | 3,22 | teto 6 |
| Tentativas de reamostragem (média) | 1,45 | 15,5% dos casos com ≥1 rejeição |

Motivos de rejeição (agregado): `assassino_ferido` 192.498 · `vitima_resistiu`
50.634 · `vitima_escapou` 2.228. **Leitura:** o teto de 2 ferimentos no assassino é
o motor dominante da reamostragem — as batalhas aceitas censuram o ferimento do réu
para ≤1, e ainda assim 28% delas o ferem, sem nenhum observável corporal.

Recortes que a reescrita deve vigiar (sementes das bandas D3 e da guarda GB8):

- **Por método:** garrote nunca foge nem fere o réu em rejeição aceita (0,03
  tentativas médias — `seguraAVitima` sela a batalha); sufocação/esganadura
  concentram TODO o desespero (12,4%/12,6%); laminada concentra a fuga (21,8%).
  O v2 troca essas assimetrias de sorteio por assimetrias de doutrina — e o
  desvencilhar abre o garrote.
- **Por palco:** fuga no logradouro é 0,8% contra 7,9% no interno — **anomalia**:
  o palco com 2–4 saídas foge dez vezes menos que o de saída única (mistura de
  métodos do palco externo domina o efeito das saídas). Registrar e reexaminar
  quando a fuga do v2 mirar `interior.saidas`.
- **Variáveis inertes:** ruído órfão em 51.039 casos e grito órfão em 8.574 — o
  custo natural da regra de existência, inalterado por esta OS.

## 4. Decisões registradas

| # | Decisão | Resposta do autor |
|---|---|---|
| D1 | Colisão + portas internas derivadas | **(a) pacote completo** — BFS com bloqueio + portas derivadas; habilita interpor e funil de fuga |
| D2 | Conjunto de regiões | **(b) cinco regiões** — mãos separadas de braços |
| D4 | Troca de método (B4) | **(a)** nesta OS, gated por GB8 + flag, com GB9/GB10 |
| — | OS marca-e-luva (referenciada, inexistente no repo) | o texto desta OS basta; `ferimento_do_agressor` nasce em B3; M2–M3 aguardam a OS própria |
| D7 | Escala da célula | **pendente** — recomendação: ~1 jarda, só em doc |
| D6 | Itens novos de mobília | **pendente** — recomendação: lareira+guarda-fogo+atiçador, castiçal de latão, ferro de engomar |

D3 (bandas-alvo) vence antes do fechamento de B2; D5 (identidade de fatos da
réplica) antes de B3.4; D8 (janela de merge) resolvida de fato: o palco fechou E4 e
mergeou — a série B é dona de `crime.js`/`espaco.js` até B3.

## 5. Regra de parada

B1 procede independentemente de D1 (o schema de física não depende de colisão).
A linha de base acima é o comparando obrigatório do relatório de aceite (B5).
