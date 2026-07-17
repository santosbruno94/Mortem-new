# Playtest mecânico — OS confronto estendido (17/07/2026)

Verificação mecânica das Fases 4–7 (PR-B) da OS `docs/os-confronto-estendido.md`,
no molde do playtest da OS psíquica: onde não há jogador humano, o QA determinístico
e a inspeção dos casos embarcados fazem as vezes do playtest, contra os critérios do
§8.5 da OS.

## Alcance dos métodos novos

- **Sufocação** — o piso garantido: coberta pelo catálogo (`sufocacao`/`oclusao_vias`),
  de interior, sem âncora especial. **Aparece 3× no pool embarcado** (comarca_1..20).
- **Láudano (D1)** — extensão do catálogo (`envenenamento_laudano`/`miose_opiacea`).
  **Aparece 1× no pool.** Suprime a batalha (veneno), premeditado.
- **Afogamento (D2, via cocho da forja)** — elegível só quando a cena tem água
  alcançável. Não caiu no pool das 20 seeds (raro por construção — exige a vítima na
  forja com o cocho sorteado), mas é **alcançável**: nas seeds `lote-223`, `lote-359`
  e outras de sondagem (2 em 400) o crime resolve por afogamento. Código não é morto.
- **Espingarda (D4)** — só dossiê de KB, fora do catálogo jogável, como decidido.
- **Precipitação** — permanece só na KB (sem escada representável; D2 não a autorizou).

## §8.5(a) — a cena de fuga é legível e conta a história certa

Dois casos do pool têm fuga da vítima, cada um deixando o rastro esperado:

- **comarca_5** (golpe contuso, briga escalada): `trilha_gotejamento` +
  `lesao_sitio_posterior`.
- **comarca_7** (arma branca, premeditado): `trilha_gotejamento` +
  `lesao_sitio_posterior`.

A fuga vaza por **cena** (a trilha de gotas rumo à porta) e **laudo** (as lesões que
alcançaram o dorso), como manda o §4.6 — nunca por narração onisciente. Nenhuma dessas
peças, sozinha, condena: o veredicto segue material (janela + causa + nexo).

## §8.5(b) — anti-bicondicional percebido no jogo, não só no teste

`comarca_7` é um **premeditado COM fuga dentro do pool jogável** — a "cena espalhada"
não é sinônimo de briga escalada. A guarda `qa.mjs` confirma a coexistência no lote
fixo `confronto_1..80` (há premeditado com fuga e briga escalada sem fuga). A surpresa
da rodada 1 premeditada consome só a primeira rodada; depois, a fuga volta a ser
possível — foi o que se verificou.

## §8.5(c) — nenhuma superfície nomeia mecânica

Varredura da prosa embarcada (réplica + pool): os termos de mecânica (`peso`, `portão`,
`rodada`, `mobilidade`, `sobAtaque`, `resistir`) **não** aparecem como exposição de
regra. As ocorrências de "peso" ("ao peso da mão", no teste do rigor) e "portão" ("junto
ao portão", a cancela física) são prosa diegética de 1893; "fuga_apressada" existe só
como **tag oculta** (o motor a lê; o jogador não a vê). A guarda de léxico garante que
"overdose" está fora de toda superfície — a língua diz "dose excessiva".

## §4.8 — a réplica permanece idêntica em fatos

Com `dirigido.fugaVitima: 'suprimida'`, o `RegistroDoCrime` da réplica
(`a_hora_emprestada_replica_96`) é **byte-idêntico** ao roteiro canônico (verificado por
diff contra a base e por guarda no `qa.mjs`). A arma branca não prende a vítima, mas a
trava da réplica cala a fuga — o registro não ganha trilha, sítio posterior nem grito.

## Prosa nova pelo pipeline

A prosa de lesão dos três métodos novos (`PROSA_LESAO`) passou por `perito-forense` e
`editor-critico`: **zero achados bloqueantes** em ambos. Ajuste de fidelidade adotado no
láudano — o ópio é **amargo**, não adocicado (a KB não lista odor doce), e "tintura"
quase nomeava a substância; a descrição virou "um resquício de amargor fica no hálito",
observação pura.

## Estatística do pool embarcado (comarca_1..20)

- Cenário: 15 premeditado, 5 briga escalada.
- Métodos: laminada 6, esganadura 4, garrote 3, sufocação 3, contuso 2, arsênico 1,
  láudano 1 (afogamento 0 — raro por âncora).
- Fuga 2 · grito 1 · trilha de gotejamento 2 · lesões de sítio posterior 2.

## Verificação

- `npm run build` — limpo.
- `node scripts/qa.mjs` — **CASO VÁLIDO**, com as 5 guardas novas do confronto verdes
  (determinismo com fuga/grito/trilhas; anti-bicondicional; coerência+existência;
  léxico; réplica §4.8) e os 4 perfis → 4 desfechos na réplica e no pool regenerado.
- `node scripts/qa-ui.mjs` — rotas canônicas e rota gerada exercitadas
  (Playwright/Chromium).

## Calibração de `MAX_RODADAS`

Mantido o default **6**. A taxa de rejeição por `vitima_escapou` mostrou-se baixa nas
sondagens (nenhum excesso de rejeições que justificasse subir a 8). Registro conforme a
proposta da ata parcial do PR-A.
