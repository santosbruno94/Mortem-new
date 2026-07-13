# Relatório de QA — "A Hora Emprestada"

QA estático conforme §17 do contexto: os perfis abaixo são traçados por
`node scripts/qa.mjs`, que dirige o store e as funções puras exatamente como a
interface o faria. Verdade de ouro: morte às **21h00 de sexta, 13/out/1893** (hora
absoluta −3), por ferida de buril no pescoço; chegada do perito às 11h00 de 14/out
(IPM 14h). O QA de interface (`node scripts/qa-ui.mjs`) joga as mesmas rotas no
navegador real. Relatório regravado em 13/07/2026 — a versão anterior descrevia o
caso substituído ("O Álibi de Corda") e está preservada no histórico do git.

## (a) Jogador Metódico → **Vitória Absoluta** ✓

Corpo primeiro: mede a temperatura às 11h00 (**23°C → algor 12–16h**), extrai rigor
pleno (12–24h), livores fixos (≥12h), a ferida de boca em losango, a reação vital e o
vermelho-de-polir no canal; depois cena, oficina, interrogatórios e registros.

- **Janela:** afirma 21h00–22h00 de 13/out e a sustenta com rigor, livores, algor,
  relógio de bolso (rotina interrompida), roda de contagem e visto-com-vida.
- **Causa:** os sinais cravam *Ferida por arma branca* (instrumento: buril de gravador).
- **Nexo:** o buril claro no estojo de Silas (instrumental); o vidro na dobra da calça
  reforça sem gafe.
- **Encenação:** o mostrador forjado (08h45) cai pela própria roda de contagem; o
  avistamento do padeiro (05h15) cai pelo corpo.
- **Periféricos:** Walter e Agnes inocentes com as mentiras-segredo expostas (registro
  da estalagem; cesta de ceia); Grey e Davey inocentes de paradeiro firmado.
- → `vitoria_absoluta`, zero falhas.

## (b) Jogador Apressado → **Erro Judiciário** ✓ (armadilhas 1–2)

Persegue as iscas (testamento, dívidas, briga), gasta a tarde na estrada de Moorford e
só examina o corpo degradado; conclui "mentiu, logo matou" contra Walter Arthurs.

- **Armadilha 1 (degradação):** o perecível colhido tarde só sustenta janela larga —
  `janela_imprecisa`.
- **Armadilha 2 (Walter):** motivo forte + mentira quebrada ≠ autoria. Réu errado →
  `erro_judiciario`; com a retentativa de pé o monólogo cala o nome do culpado — só o
  epílogo do encerramento revela Silas Crane.

## (c) Jogador Intuitivo → **Impunidade** ✓ (armadilha 5)

Acusa Silas (réu certo) por faro — sem janela sustentada, sem mecanismo cravado, sem
nexo. O tripé pericial não se sustenta → `impunidade`: acusar exige materialidade.

## (d) Pericial Desatento → **Sucesso com Gafes** ✓

Tripé completo (janela precisa + mecanismo + nexo em Silas), mas libelo lacunoso (sem
móbil, sem encenação exposta, juízos por fazer) → `sucesso_gafes`.

## Verificações transversais (todas no `qa.mjs`)

- Degradação perde **precisão**, nunca valor (rigor resolvido segue válido); a âncora
  durável fecha janela finita que cobre a verdade em qualquer rota.
- O avistamento falso é refutável pela janela do corpo; a crença cega na última visita
  (acusar a Sra. Rooke) dá `erro_judiciario`.
- Contrato do desfecho: refutar só a testemunha equivocada **não** credita a encenação;
  o crédito exige derrubar a peça forjada (o relógio da lareira).
- O álibi do réu cai por **registro** (o quarto cinco às escuras) — opcional, nunca pilar.
- Rotina interrompida trava o teto da janela; registro mecânico tem janela fixa que não
  degrada e refuta o mostrador forjado.
- Periférico sem carta de móbil na mesa **não** recebe "razões contra a vítima" no
  monólogo; blocos de periféricos têm variantes sem eco verbatim (monólogo e epílogo).
- A explicação da luz do padeiro é paga **no epílogo**, e só quando a alegação foi
  refutada; o epílogo é determinístico e a conta do perito lê a hora do selo.
- Determinismo: sem `Math.random`/`Date.now` em `src/logic|data|store`; aparência fora
  do motor; diorama e hotspots íntegros.

## QA de interface (`qa-ui.mjs`)

As 3 rotas canônicas + rota `?flat=1`, no Chromium: extração por clique, mural inteiro
(5 estações, barbantes, revisão final), contador de observações do caso-escola,
confronto da segunda visita ao réu, retentativa com preço (2h), erro sem nome do
culpado até o epílogo, explicação da luz e "ficou por visitar" no encerramento,
interpolações resolvidas, zero ids internos vazados, zero erros de console.

## Como rodar

```
npm run build          # build limpo obrigatório
node scripts/qa.mjs    # motor: 4 perfis → 4 desfechos + transversais
node scripts/qa-ui.mjs # interface: rotas canônicas no navegador
```
