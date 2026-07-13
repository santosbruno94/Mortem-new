# Nota de fase — FASE 0 do overhaul (13/07/2026)

Correções de dívida técnica, sem feature nova (ordem de serviço
`PROMPT-overhaul-mortem.md`). Decisões registradas em `historico-decisoes.md`
(seção "Fase 0 do overhaul").

## O que mudou (jogável)

- **Carta de algor e termômetro** leem o modelo forense num ponto só
  (`AMBIENTE_PADRAO` + `temperaturaPorIpm`); leitura fracionária sai
  "22°C e meio" — nunca "22.5°C" na prosa.
- **Desfecho novo no pilar Quando:** afirmar a janela certa e sustentá-la com
  cartas que dizem outra faixa agora produz `janela_sem_sustentacao` — o
  monólogo expõe a contradição ("reuni provas de uma faixa de horas e assinei
  outra") e a dica do caso-escola orienta corrigir a afirmação ou as ligações.
  Antes, caía no texto de "janela larga", que mentia sobre o buraco.
- **Nó revelado por lead no mesmo prédio** deixa de manter o brilho de "novo"
  depois de visitado (latente, sem efeito no caso corrente).

## Verificação

- `npm run build` — limpo.
- `node scripts/qa.mjs` — **CASO VÁLIDO** (23 checagens, incluindo o caso
  adversarial novo (m): janela que cobre mas contradiz o suporte gera código
  próprio e monólogo de contradição).
- `node scripts/qa-ui.mjs` — **UI VÁLIDA** (3 rotas canônicas + rota flat,
  zero erros de console). Contrato do QA de UI intocado: nenhum texto de
  botão/rótulo, `.termo-*`, `data-overlay` ou select do mural mudou.
- Pipeline `revisar-prosa` sobre a prosa nova (bloco do monólogo + dica):
  parecer resumido na mensagem do commit.

## Pendência para o usuário

- **0.6** — o fio ambiental (relógio forjado → âncora Presença) aceito e
  ignorado pelo nexo: as três opções (manter/registrar · restringir ·
  feedback visual) estão em `historico-decisoes.md`; recomendação (a).
  Nenhuma implementação feita sem a decisão.
- **0.2** — o formato "22°C e meio" foi aplicado por recomendação; trocar
  para "22,5°C" é ajuste de um ponto (`formatTemperatura`).
