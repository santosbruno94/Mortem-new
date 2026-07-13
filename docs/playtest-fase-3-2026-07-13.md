# Nota de fase — FASE 3 do overhaul (13/07/2026)

Interrogatórios como diálogo — árvore ramificada + confronto com provas (ordem de
serviço `PROMPT-overhaul-mortem.md`). Leva **(a)**: só Silas Crane, o réu. Mecânica
nova em `MORTEM_CONTEXTO.md` §7.1; decisões em `historico-decisoes.md` (seção "Fase 3
do overhaul").

## O que mudou (jogável)

- **Interrogar é escolher.** O nó de Silas Crane deixou de ser um bloco de prosa e
  virou **diálogo**: o perito recebe um leque de assuntos (a noite de sexta, como
  achou o corpo, quem faria isso) e cada um abre uma fala, voltando ao leque. A fala
  de abertura já revela a lasca de vidro na bainha; o álibi e a teoria do ladrão de
  fora nascem de dentro dos assuntos, pelo mesmo termo em negrito das localidades.
- **Confrontar com a prova.** A opção **"Apresentar: …"** fica **oculta até a carta
  estar na mesa**. Com o registro da estalagem colhido, aparece "Apresentar: O Quarto
  Cinco às Escuras"; apresentá-lo rende a reação de Silas (o quarto errado, a casa
  cheia) — reação observável, **nunca confissão**: o veredicto segue no mural. O mesmo
  vale para o livro de ordens (a coluna "S.C."), que ele reenquadra como rotina de
  bancada. É o elo que faltava entre a mesa e as pessoas.
- **Navegação livre (relógio mole).** Interrogar não gasta o relógio; reler assuntos é
  livre. O "já perguntado" fica marcado, mas nada trava — reabrir o interrogatório
  começa de novo no leque.

## Motor intocado

`src/data/dialogos.js` é camada narrativa pura (o motor jamais a lê); as cartas de
depoimento continuam nascendo por `extrairCarta` com as tags que já têm, e o veredicto
não muda. `nosVisitadosDialogo` entra no store como dado puro serializável (só o
"já perguntado" da UI). O renderizador de `[[id]]`/interpolação saiu para o util
compartilhado `ProsaComTermos.jsx` — as localidades renderizam idêntico ao de antes.
Zero `Math.random`/`Date.now` em `logic`/`data`/`store`.

## Verificação

- `npm run build` — limpo.
- `node scripts/qa.mjs` — **CASO VÁLIDO**, com a guarda estática nova (§7.1): toda
  `requerCarta` referencia carta existente; todo `vaiPara` aponta para nó real da mesma
  árvore; todo `[[id]]` de fala é carta real e nenhuma carta com `localidade === nó`
  fica órfã.
- `node scripts/qa-ui.mjs` — **UI VÁLIDA** (3 rotas canônicas + rota flat, zero erros
  de console), com o bloco novo da Fase 3: o interrogatório abre em diálogo
  (`[data-opcoes-dialogo]`), o confronto fica oculto sem a prova, um assunto revela a
  fala com a carta extraível, extrai-se a carta de dentro da árvore, e a segunda visita
  ao réu traz o confronto disponível (a prova na mesa) com a reação de Silas.
- **Contrato do QA de UI atualizado no mesmo commit:** `[data-opcoes-dialogo]`,
  `.opcao-dialogo`/`--confronto`/`--voltar` entram nos seletores; o passo da "segunda
  visita" migra de `prosaCondicional` para a opção `requerCarta`; helper
  `interrogarEExtrair` novo. `.termo-clicavel`/`.termo-extraido`, os `data-overlay`
  existentes, os `<select>` do mural e os rótulos de botão do mural — intocados.
- **Prosa nova pelo pipeline `revisar-prosa`** (`escritor-prosa` + `editor-critico` +
  `perito-forense` + `fiscal-continuidade`): zero achados bloqueantes antes do commit.

## Escopo e próximo passo

Esta é a **leva (a)** da Fase 3 (a OS pede aprovação no meio). A **leva (b)** — os
demais suspeitos em diálogo — aguarda aprovação. Fica em aberto para a leva (b): quais
nós ganham árvore (Walter/estalagem, Agnes/papelaria, Grey/moinho e Davey — hoje dentro
dos pontos da oficina), e se Pettigrew/Wycliffe, sendo fontes e não suspeitos, entram.
