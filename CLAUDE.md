# MORTEM — regras do repositório

Jogo de investigação forense (Inglaterra vitoriana, 1893) em React. Texto 100% em
PT-BR. Este arquivo orienta agentes de código; a fonte única de verdade do design é
`MORTEM_CONTEXTO.md`.

## Documentos normativos

| Documento | O que rege |
|---|---|
| `MORTEM_CONTEXTO.md` | Design do jogo (estado atual) |
| `docs/historico-decisoes.md` | Arqueologia de playtests/redesigns (só consulta) |
| `docs/guia-de-estilo.md` | TODA a prosa: norma de língua, observação pura, dosagem de brilho |
| `docs/biblia-de-vozes.md` | Idioleto de cada personagem |
| `docs/kb-medicina-legal/` | Verdade forense de época (Taylor, Casper, Lacassagne) |

## Skills e agentes

- Escrever/reescrever prosa → skill `redigir-prosa` (agente `escritor-prosa`).
- Revisar prosa antes de commit → skill `revisar-prosa` (pipeline: `editor-critico` +
  `perito-forense` + `fiscal-continuidade`).
- Caçar tiques de texto de IA → skill `anti-padrao-ia`.

**Nenhuma reescrita substancial de prosa entra em commit sem o pipeline `revisar-prosa`
com zero achados bloqueantes.**

## Regras invioláveis do código

- As funções de lógica e veredicto leem SOMENTE `tagsOcultas` (e a seed) — nunca `id`,
  `textoDisplay` ou texto de carta.
- Zero LLM em runtime; zero chamadas de rede; tudo determinístico (proibido
  `Math.random()`/`Date.now()` na lógica de jogo — variação vem de hash da seed).
- Camada narrativa ≠ camada lógica: trocar prosa nunca exige tocar no motor.
- Código e comentários em português.
- Marcadores `[[id_da_carta]]` na prosa e interpolações `{detective.campo}` /
  `{g:masc|fem}` são estruturais — preservar na reescrita.
- Medicina legal tecnicamente precisa, sempre (validar contra `docs/kb-medicina-legal/`;
  divergência KB × motor é decisão do usuário, não do agente).

## Verificação

- `npm run build` — build limpo é obrigatório.
- `node scripts/qa.mjs` — QA estático: os 4 perfis de jogador devem produzir os 4
  desfechos (Metódico → Vitória Absoluta; Apressado → Erro Judiciário; Intuitivo →
  Impunidade; o quarto → Sucesso com Gafes).
- `node scripts/qa-ui.mjs` — QA de fumaça da interface: joga as 3 rotas canônicas no
  navegador (Playwright/Chromium) e checa regressões de texto visível; rodar antes de
  commit que toque UI, prosa exibida ou monólogo.
- `npm run dev` — toda feature testável no navegador antes de avançar.

## Perfil do criador

Advogado sem background em programação. Explicações executáveis sem conhecimento de
dev; design antes de build; **não criar features sem ordem expressa**; cada iteração é
um incremento jogável.
