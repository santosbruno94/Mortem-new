# Nota de fase — FASE 2 do overhaul (13/07/2026)

A planta da relojoaria (andar entre cômodos) + pontos de interesse (ordem de
serviço `PROMPT-overhaul-mortem.md`). Mecânica nova em `MORTEM_CONTEXTO.md`
§5.1; decisões em `historico-decisoes.md` (seção "Fase 2 do overhaul").

## O que mudou (jogável)

- **Andar pela relojoaria.** Ao abrir qualquer nó do mesmo prédio (corpo, cena,
  oficina, saleta), a visão pousa no topo uma **planta baixa** em traço de tinta
  sobre papel — loja com balcão e vitrine, corredor com a escada, escritório dos
  fundos e oficina ao fundo, a saleta, a porta do beco. Clicar num cômodo
  **viaja** para o nó (custo 0 — mesmo prédio) e reabre a localidade lá; o
  cômodo atual fica marcado "— aqui —". O escritório dos fundos é **uma sala com
  dois alvos** — "a cena" e "o corpo" (o corpo jaz na cena).
- **Coleta em camadas.** A prosa monolítica da **cena** e da **oficina** se
  dividiu em **pontos de interesse** (acordeão): uma introdução de ambientação e,
  abaixo, pontos clicáveis que revelam o parágrafo com os seus termos extraíveis.
  Cena — a lareira, a escrivaninha, a vitrine e a porta do beco, a copa. Oficina
  — a prateleira de gravar, o púlpito de ordens, a gaveta funda, o aprendiz. Cada
  ponto traz um contador `n/total`. Nenhuma carta ficou inalcançável.
- **Prosa mais densa, observação pura.** As introduções e os pontos foram
  expandidos com o material de época (luz de outubro de esguelha, óleo fino de
  relojoeiro, latão, cortiça, camurça, o carvão morno do fogareiro). O ambiente
  descreve; quem estranha é o jogador. A única voz que aponta o relógio de
  lareira é o delegado Wycliffe (o viés da história A), e o relógio irmão da
  oficina segue plantado como saber de graça — fair-play intacto.
- **Fallback e mobile.** A planta é SVG 2D: funciona idêntico em `?flat=1`. Em
  tela estreita, colapsa numa régua horizontal de cômodos (alvos ≥44px).

## Motor intocado

Nada aqui lê `tagsOcultas` de forma nova nem muda o veredicto: `planta_relojoaria.js`
é camada visual pura (como `mapa_espacial.js`), andar entre cômodos reusa
`viajarPara` (custo 0 já existente) e os pontos são reorganização da camada
narrativa. Zero `Math.random`/`Date.now` em `logic`/`data`/`store`.

## Verificação

- `npm run build` — limpo.
- `node scripts/qa.mjs` — **CASO VÁLIDO**, com a guarda estática nova: para toda
  localidade com pontos, as cartas do nó estão contidas na união dos `[[id]]` dos
  pontos (nenhuma carta órfã) e todo `[[id]]` de ponto é carta real.
- `node scripts/qa-ui.mjs` — **UI VÁLIDA** (3 rotas canônicas + rota flat, zero
  erros de console), com o bloco novo da Fase 2: a planta aparece no nó
  (`[data-planta]`), os pontos começam fechados (termos ocultos), abrir um ponto
  revela os termos, extrair abre a ficha, e clicar um cômodo (`[data-alvo]`)
  viaja sem gastar o relógio (11h00). A rota flat confere a planta em SVG 2D.
- **Contrato do QA de UI atualizado no mesmo commit:** `[data-planta]`,
  `[data-alvo="<no>"]` e `.ponto-interesse` entram nos seletores intocáveis; o
  helper de extração passou a abrir todos os pontos antes de varrer os termos.
  `.termo-clicavel`/`.termo-extraido`, os `data-overlay` existentes, os `<select>`
  do mural e os rótulos de botão — intocados.
- **Prosa nova pelo pipeline `revisar-prosa`** (`escritor-prosa` +
  `editor-critico` + `perito-forense` + `fiscal-continuidade`): zero achados
  bloqueantes antes do commit.
