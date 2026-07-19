# Conclusões do playtest humano — modo procedural — 19 de julho de 2026

Primeira rodada humana no modo procedural (S0 do plano de sessões). Caso jogado: vila
gerada com vítima Albert Hall (lavrador, 30 anos, Cottage nº 3), ferida incisa no tórax;
ré ligada pela marca de poeira da arma ausente. Registrada conforme o protocolo
(`docs/playtest/protocolo-playtest-humano-procedural.md`); capturas fornecidas pelo
usuário. Triada em lotes; o estado de cada item é mantido aqui.

## Triagem e estado

| # | Conclusão | Lote | Estado |
|---|---|---|---|
| P1 | Retirar o legista do modo procedural | A | ✅ Feito |
| P2 | Carta já diz "sinal de arma branca" — tirar a conclusão, manter/melhorar a descrição | A | ✅ Feito |
| P3 | "Bordas vivas" entrega que a lesão foi em vida (reação vital) — mesma regra | A | ✅ Feito |
| P4 | Evidências e pessoas concentradas na delegacia — não é a visão do jogo | C | ⏭️ Decisão (design espacial do gerador) |
| P5 | Nome "delegacia" impróprio no procedural — terminologia técnica de 1893 (world building) | C | ⏭️ Decisão (com KB legal-policial) |
| P6 | Interrogatório gera carta em vez de falar; negrito opaco ("A Noite de Amy…") — se ficar carta, o negrito deve carregar a informação ("se recolheu às oito") | C | ⏭️ Design (cruza com OS de diálogo e itens 2/5/6 do caso-escola) |
| P7 | Construção da Acusação: exibir data/hora da coleta de cada prova, em todas as etapas (QOL, não é resposta dada) | A | ✅ Feito |
| P8 | "A Noite de Florence Cooper" já rotulada como mentira → entrega a provável ré | C | ⏭️ Decisão de fair play (= item 14 do caso-escola, agora confirmado no procedural) |
| P9 | A ré foi ligada pelo formato da poeira da arma ausente — e se outra pessoa tivesse levado a arma para incriminá-la? | C | ⏭️ Revisão de fair play do gerador (âncora única de autoria) |
| P10 | Tom genérico da prosa procedural | — | ⏭️ Adiado pelo usuário ("depois que o loop estiver redondo"; = lapidação, `os-lapidacao-prosa-gerada.md`) |
| P11 | A Mesa tem que ser repensada: cartas irem para ela não tem serventia (a Caderneta já registra tudo). Estudar: ficha por pessoa, com resumo de cada conversa e das provas que a ligam — sem spoiler (só o que saiu da boca dela, o que se fala sobre ela, móbeis possíveis) | C | ⏭️ Decisão (redesenho da mesa; cruza com P6 e com a OS de diálogo) |

## Notas de triagem

- **P1–P3 se reforçam:** a fala do legista no procedural ("os sinais fecham em ferida por
  arma branca") e o subtítulo da ficha ("SINAL DE ARMA BRANCA; SEDE: TÓRAX") entregam a
  mesma conclusão por dois canais. O corpo descritivo da carta ("Corte de bordas
  regulares, mais fundo onde começa…") já é observação pura — o problema é o rótulo e a
  voz que concluem por cima.
- **P4 e P5 são a mesma frente** (o palco do procedural): onde as pessoas e provas vivem
  e como o posto policial se chama. Decidem-se juntas, com o KB
  (`docs/kb-medicina-legal/` — aparato legal-policial de 1893) e o design espacial
  (`os-palco-em-aneis-*.md`).
- **P8 confirma no procedural** o que o item 14 do caso-escola já apontara: carta de
  mentira pré-rotulada elimina a dedução. A decisão (S2 do plano) agora vale para os dois
  modos.
- **P9 é fair play de autoria:** hoje a marca de poeira funciona como âncora única da ré.
  A revisão pede ou âncora dupla (segunda ligação independente) ou contra-hipótese
  jogável (alguém poderia ter levado a arma para incriminar).

## Lote A — o que foi feito (19/07/2026)

- **P1 — Legista removido dos casos gerados.** A trava é pelo modo do caso
  (`modoDoCaso(casoId) !== 'tutorial'`): some a síntese falada do exame
  (`FalaDoLegista`, `EventoLocalidade.jsx`), some a seção "Leitura do legista" da
  Caderneta (cabeçalho, alternador purista e vazios) e as conclusões `origem:'mestre'`
  de janela/mecanismo deixam de ser empacotadas (`consolidarLeituraMestre`,
  `store/jogo.js`). O caso-escola segue idêntico. **Ponto aberto registrado:** o eco de
  interferência pós-caso (`ecos_interferencia.js`, "O legista, sobre o que se moveu")
  ainda fala pelo legista e FOI MANTIDO — é debrief de método, não gabarito; decidir a
  troca de voz quando a OS de diálogo abrir.
- **P2 — Carimbo da lesão fatal descreve, não conclui.** `PROSA_LESAO`
  (`pacote_gerado.js`) ganhou carimbo descritivo por método ("Ferida incisa; sede:
  tórax", "Sulco horizontal; sede: pescoço", …) que o pipeline aplica sobre o rótulo
  técnico de build (`ponte_caso.js`). Nomear o meio ("arma branca") voltou a ser dedução
  do jogador. **Nota:** o carimbo da carta de TENTATIVA (`gen_tentativa`) ainda nomeia o
  método interrompido — revisar junto da lapidação (P10).
- **P3 — Reação vital sem veredicto.** Título "Bordas Vivas" → "As Bordas da Ferida";
  carimbo "Lesões sofridas em vida" → "Bordas afastadas, coágulo aderido"; a descrição
  perdeu a oração conclusiva ("o coração ainda batia…") e ganhou a observação do coágulo
  aderido que não se desprende à lavagem (Taylor). A leitura "em vida" é do jogador.
- **P7 — Carimbo de coleta em todas as estações do mural.** Componente `CarimboColeta`
  (`MuralAcusacao.jsx`): toda prova exibida declara "coleta: {data, hora}" a partir de
  `horaRegistro` — Estação I (leitura do corpo), II/III (cartas do barbante, altura do
  cartão ajustada), IV (móbil, via `Opcao.sub`) e V (juízos). Vale para os três modos.

Verificação: `npm run gerar:casos` (banco regenerado), `npm run build` limpo,
`qa.mjs` **CASO VÁLIDO**, `qa-ui.mjs` **UI VÁLIDA** (rotas do caso-escola com legista
intacto; rota gerada sem regressão). Rótulos forenses novos submetidos ao perito de
época (parecer registrado abaixo quando emitido).
