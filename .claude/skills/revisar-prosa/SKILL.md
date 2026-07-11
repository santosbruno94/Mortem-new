---
name: revisar-prosa
description: Pipeline de revisão da prosa de MORTEM - roda os três revisores (editor-critico, perito-forense, fiscal-continuidade) sobre um arquivo ou diff e consolida um parecer único. Usar após qualquer reescrita substancial e antes de commit de prosa.
---

# Revisar prosa (pipeline)

## Entrada

Um alvo: arquivo(s) de prosa, ou o diff da branch (`git diff main...HEAD -- src/data src/logic`).

## Passos

1. **Preparação.** Levantar o alvo e listar as cenas/cartas afetadas. Se o alvo é um
   diff, ler o "antes" também — a revisão compara, não só absolve.

2. **Fan-out — três revisores em paralelo** (Agent tool, um por papel; ver
   `.claude/agents/`):
   - `editor-critico` — anti-padrões de IA (via skill `anti-padrao-ia`), dosagem de
     brilho, voz por personagem, dedução vazada.
   - `perito-forense` — precisão técnica e vocabulário contra `docs/kb-medicina-legal/`;
     anacronismo médico e material.
   - `fiscal-continuidade` — datas, horas, dias da semana, distâncias, nomes, idades,
     somas e registro linguístico cruzados contra `seed.js`, `mapa.js`, `cartas.js` e o
     restante da prosa; integridade de `[[id]]` e `{g:…}`/`{detective.…}`.

3. **Consolidação.** Fundir os três pareceres num só, deduplicado, ordenado por
   gravidade:
   - **Bloqueante**: dedução vazada, erro forense, furo de continuidade, marcador
     quebrado.
   - **Alto**: anti-padrão acima do teto, voz fora da bíblia.
   - **Menor**: preferência de estilo com sugestão.

4. **Verificação objetiva.** Rodar os greps da skill `anti-padrao-ia` e comparar as
   contagens com a linha de base anterior (registrar no parecer).

5. **Aplicação.** Corrigir os bloqueantes e altos; menores a critério, anotando o que
   se decidiu não acatar e por quê.

6. **Fechamento.** Repetir o passo 4; o parecer final acompanha o commit
   (resumo na mensagem ou em `RELATORIO_QA.md` quando for o fechamento de fase).

## Regra

Nenhuma reescrita substancial de prosa entra em commit sem uma passada deste pipeline
com **zero achados bloqueantes**.
