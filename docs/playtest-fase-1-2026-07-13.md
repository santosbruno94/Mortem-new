# Nota de fase — FASE 1 do overhaul (13/07/2026)

A Ficha de Coleta: a evidência se apresenta no ato (ordem de serviço
`PROMPT-overhaul-mortem.md`). Mecânica nova em `MORTEM_CONTEXTO.md` §6.2;
decisões em `historico-decisoes.md` (seção "Fase 1 do overhaul").

## O que mudou (jogável)

- **Extrair mostra o que se coletou.** Ao clicar num termo em negrito (ou no
  corpo 3D/hotspots), a carta se registra e sobe uma **Ficha de Coleta** por
  cima do local — etiqueta de exposição/laudo com a observação crua, a
  **descrição completa**, a fala do legista em itálico (quando a carta a tem),
  o carimbo, a hora do registro e a ponte "§ … no Glossário". Botão único
  **"Arquivar na mesa"** devolve a carta à superfície. O som de papel toca na
  abertura da ficha, não mais na extração (um som por coleta).
- **Cartas da mesa consultáveis.** Clicar numa carta pousada reabre a mesma
  ficha (o arrasto continua livre — `CartaMesa` distingue clique de arrasto).
  Dentro do Mural da Acusação, um "§" discreto no canto da carta abre a ficha
  em leitura sem sair da estação.
- **Caderneta é lembrete, não revelação.** "Observações reunidas" virou diário
  compacto: carimbo + hora, cada linha reabrindo a ficha. A descrição e a voz
  do legista saíram da lista; "Leitura do legista" e o diário seguem como a
  função verdadeira da Caderneta.

## Verificação

- `npm run build` — limpo.
- `node scripts/qa.mjs` — **CASO VÁLIDO** (motor intocado; só camada de
  apresentação e store de UI).
- `node scripts/qa-ui.mjs` — **UI VÁLIDA** (3 rotas canônicas + rota flat,
  zero erros de console), com o bloco novo da Fase 1: a ficha abre ao extrair
  (`data-overlay="ficha"`), mostra a descrição, arquiva, reabre pela carta da
  mesa e a Caderneta (diário) não traz mais a descrição.
- Contrato do QA de UI atualizado no mesmo commit: novo rótulo intocável
  **"Arquivar na mesa"** e `data-overlay="ficha"`; o helper de extração passou
  a arquivar a ficha após cada termo. `.termo-clicavel`/`.termo-extraido`, os
  `data-overlay` existentes e os `<select>` do mural — intocados.
- **Sem prosa nova de jogo** (a ficha reusa campos de carta existentes): o
  pipeline `revisar-prosa` não se aplica nesta fase.

## Invioláveis mantidos

- Motor lê só `tagsOcultas` + seed; `fichaAberta` é id puro (sem
  `Math.random`/`Date.now` em `src/store`).
- Camada 3D segue apresentação pura com fallback `?flat=1` intacto (a rota
  flat do QA joga a extração pela prosa e passa).
- Marcadores `[[id]]` e interpolações `{g:…}`/`{detective.…}` preservados.

## Pendências para o usuário

- Nenhuma decisão de design ficou em aberto nesta fase (a única bifurcação —
  acesso à ficha dentro do mural — foi resolvida por você: ícone discreto).
- Próximo incremento (FASE 2 — a planta da relojoaria) aguarda sua ordem.
