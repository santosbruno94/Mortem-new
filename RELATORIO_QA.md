# Relatório de QA — "O Álibi de Corda"

QA estático conforme §17 do contexto: os perfis abaixo foram traçados pelos dados e pelo
motor (sem playtest interativo) com `node scripts/qa.mjs`, que dirige o store e as funções
puras exatamente como a interface o faria. Verdade de ouro: morte às 22h00 de 13/out
(hora absoluta −2); chegada às 11h00 de 14/out.

## (a) Jogador Metódico → **Vitória Absoluta** ✓

Corpo primeiro: mede a temperatura às 11h00 (**24°C → IPM 11–15h**, como fixa o §15),
extrai rigor pleno (12–24h), livores fixos (≥12h), sulco horizontal, petéquias e fibras no
sulco; depois cena, delegacia e os três interrogatórios. Relógio final: 08h00 de 15/out.

- **Cronos:** a isca "morte às 09h da manhã" é **rejeitada** (a convergência não a acomoda).
  A hipótese "noite de 13/out" registra a janela **20h00–00h00** (largura 4h, contém −2).
- **Aitiov:** sulco + petéquias + fibras → *Estrangulamento por Ligadura* (instrumento:
  corda de cânhamo). Relógio das 09h00 fora da janela → *Cena Encenada*.
- **Nexo:** o fio de lã da Sra. Hudson é **rejeitado** como nexo (não corresponde ao
  instrumento); as fibras de cânhamo na manga de Edgar fecham o nexo de presença.
- **Libelo completo** (réu Edgar, motivação herança, descuidos, periféricos:
  Blackwood `inocente_alibi`, Hudson `inocente_segredo`) → `vitoria_absoluta`, zero falhas.

## (b) Jogador Apressado → **Erro Judiciário** ✓ (armadilhas 1–3)

Vai à cena e aos três interrogatórios antes do corpo; só o examina 16h depois da chegada.

- **Armadilha 1 (degradação):** rigor já em dissolução (24–36h) e corpo em equilíbrio
  térmico (algor **inconclusivo**). A hipótese precisa "noite de 13/out" é **rejeitada**;
  resta a janela ampla 15h00 de 13/out–03h00 de 14/out (largura 12h → `janela_imprecisa`).
- **Armadilha 2 (Hudson):** seduzido pelo nervosismo e pela mentira da governanta, acusa-a
  sem mecanismo nem nexo → `erro_judiciario`; o monólogo revela Edgar na galeria.
- **Armadilha 3 (Blackwood):** o motivo público não vira acusação — o álibi corroborado
  (20h–00h, doze testemunhas) o mantém periférico.

Falhas registradas: `reu_errado, janela_imprecisa, sem_mecanismo, sem_nexo, sem_descuidos, sem_motivacao`.

## (c) Jogador Intuitivo → **Impunidade** ✓ (armadilha 4)

Acusa Edgar (réu certo) com rigor, livores e o testamento — **sem** janela registrada, sem
mecanismo e sem nexo. O tripé pericial não se sustenta → `impunidade`: a defesa explora as
lacunas (`sem_janela, sem_mecanismo, sem_nexo, …`) e Edgar agradece a lição de direito.

## (d) Quarto desfecho → **Sucesso com Gafes** ✓

Tripé completo (janela precisa + mecanismo + nexo em Edgar), mas libelo lacunoso (sem
motivação, sem descuidos, sem juízo periférico) → `sucesso_gafes`. Condenação sustentada;
as gafes nomeadas pelo monólogo.

## Verificações transversais

- Geração de monólogo testada para os 4 desfechos (blocos universais, sem texto exclusivo).
- Regras e veredicto leem somente `tagsOcultas` + seed; nenhum indicador de acerto é
  exibido antes do tribunal (gavetas devolvem apenas consistente/inconsistente).
- Painel de Álibis neutro, com formatação "manhã seguinte" para a declaração da Sra. Hudson.
- `npm run build` sem erros nem warnings de import; `npm run dev` serve o jogo.

**Furo encontrado e corrigido durante o QA:** os termos clicáveis eram rebaixados para
minúsculas na prosa, corrompendo nomes próprios ("moorford"); a renderização passou a
preservar o nome da carta.

## Overhaul da redação (jul/2026)

Reescrita integral da prosa do slice sob a nova infraestrutura de redação
(`docs/guia-de-estilo.md`, `docs/biblia-de-vozes.md`, `docs/kb-medicina-legal/`,
`.claude/`). O motor, as tags e os 4 desfechos permanecem inalterados — a mudança é só
de camada narrativa.

- **QA de motor reexecutado após a reescrita:** `node scripts/qa.mjs` mantém os 4
  perfis → 4 desfechos; `npm run build` limpo. Nenhuma `tagsOcultas`/`id`/marcador
  `[[id]]` foi alterado.
- **Observação pura:** deduções vazadas do narrador e das cartas removidas
  (grep de deduções clássicas — "guarde isso", "não tinha pressa", "limpo demais",
  "história curiosa" — passou de várias para **0**). A voz do mestre ficou restrita a
  leitura técnica (janela, família/assinatura), sem apontar autoria ou encenação.
- **Anti-padrões de IA:** a fórmula "não X — é Y" em prosa caiu de dezenas para
  ocorrências residuais (travessões de clarificação técnica, não aforismo); brilho
  racionado a ≤1 frase de efeito por cena.
- **Vozes diferenciadas:** Wycliffe (cordial-autocorretivo), Edgar (polido, rápido),
  Hudson (curta, evasiva), Blackwood (franco, sem eco do mecanismo), narrador invisível.
- **Continuidade corrigida:** 13/out/1893 = sexta (era "sábado"); Moorford = 1h30/trecho
  em `mapa.js` e em toda a prosa (amarrado à lógica: Edgar sai ~20h30, mata às 22h);
  `{g:sua|sua}` e o castelhanismo "pareja" eliminados.
- **Monólogo:** blocos reescritos em tom sóbrio + variantes determinísticas por hash da
  seed (2–3 aberturas/fechos por desfecho), sem `Math.random` — testado nos 4 desfechos.
- **Revisão:** diff final passado pelo pipeline `revisar-prosa` (editor-crítico,
  perito-forense, fiscal-continuidade).
