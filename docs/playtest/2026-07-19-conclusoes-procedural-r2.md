# Conclusões do playtest humano — modo procedural, 2ª rodada — 19 de julho de 2026

Segunda rodada humana no procedural, já com o Lote A da 1ª rodada aplicado (sem legista,
carimbos descritivos, coleta no mural). Caso jogado: vítima Fanny Mills (Cottage nº 2);
elenco com Peter Roberts (pároco, 47 — o assassino), Sarah Ward (lavadeira, 59), Susan
Wilson, Joseph Mills (moleiro, 53) e William Davies. Capturas fornecidas pelo usuário.

## Triagem e estado

| # | Conclusão | Lote | Estado |
|---|---|---|---|
| P12 | "O Instrumento Abandonado": qual instrumento? E por que a vila dá Peter Roberts como dono? A carta não diz nem uma coisa nem outra | A | ✅ Feito |
| P13 | "A Nota por Assinar": qual trato? Só "soma, prazo e o nome por extenso" | A | ✅ Feito |
| P14 | "O Bilhete Amassado": também genérico ("um pedido") | A | ✅ Feito |
| P15 | Regra do usuário para P12–P14: **genérico tudo bem por enquanto, ininteligível não** — o texto tem que deixar claro do que se trata, mesmo sem detalhe fino | A | ✅ Adotada como critério |
| P16 | Faltam características físicas da vítima (alta? corpulenta?) — sem isso não há estimativa da força (ou falta dela) do assassino | B | ⏭️ Canal novo de dedução (compleição) — desenhar antes |
| P17 | Pegadas sem descrição (pequenas? grandes?) — "tem que ter algo" | B | ⏭️ Mesmo canal de P16 (desenhar junto) |
| P18 | "Papéis de Sarah Ward": *que* papéis ligam ela à morta? Ininteligível | A | ✅ Feito |
| P19 | Móbil de Peter Roberts (o réu de fato) nunca é falado — "falatório em nome dele" não diz o quê | A | ✅ Feito (inteligibilidade; o desenho móbil-por-suspeito é o item 16 do caso-escola / S2) |
| P20 | Joseph Mills não tem relação com a vítima Fanny Mills — homônimo sem parentesco confunde | A | ✅ Feito |
| P21 | O diálogo com o assassino já entrega a mentira: ele declara paradeiro que ninguém perguntou | C | ⏭️ OS de diálogo (beat de paradeiro para todos, não confissão espontânea) |
| P22 | Ao confrontar com o que foi respondido, a fala não vai além do que já se sabia — confronto raso | C | ⏭️ OS de diálogo |
| P23 | O pároco dizer "quem fez isto veio de fora" entrega: não há forasteiro entre os suspeitos → só ele lucra com a tese. Depoimento de Sarah Ward com o mesmo problema | C | ⏭️ Fair play do diálogo (deflexões têm que ser plausíveis dentro do elenco) |
| P24 | A mentira de Sarah Ward (paradeiro falso por causa do trato) já é *padrão reconhecível* de "mente mas não é o assassino" — o jogador experiente lê a fôrma, não o caso | C | ⏭️ Fair play do gerador (variar a fôrma das mentiras; cruza com P9/P24 ≠ réu) |

## Notas de triagem

- **P12–P15 + P18–P19 são o mesmo defeito:** a realização de prosa dos vestígios
  "sociais" (instrumento, nota, bilhete, papéis, falatório) parou no rótulo técnico. O
  gerador **sabe** o que cada coisa é (o instrumento do método, o tipo de móbil, o
  segredo periférico) — a carta é que não fala. Critério do usuário (P15): pode ficar
  genérico, não pode ficar ininteligível.
- **P16+P17 são um canal novo de dedução** (compleição física: vítima × força exigida ×
  pegadas). Não entra como remendo: se só um suspeito for corpulento, o canal vira
  entrega — exatamente o defeito de P9 (âncora única). Desenhar o canal (quem no elenco
  compartilha a compleição; o que a pegada diz e cala) e só então realizar. Vai para a
  fila de fair play do gerador, junto de P9.
- **P20 é regra de elenco:** sobrenome da vítima só para parentes de verdade (relação no
  grafo); homônimo não-parente confunde de graça.
- **P21–P24 são a OS de diálogo + fair play:** a mentira não pode ser espontânea (beat de
  paradeiro perguntado a todos), o confronto tem que puxar mais que o já dito, a deflexão
  tem que ser plausível dentro do elenco, e a fôrma das mentiras precisa variar para não
  virar assinatura de inocência/culpa.

## Lote A — o que foi feito (19/07/2026)

- **P20 — Homônimo da vítima eliminado.** Pós-passe em `caso.js` (após o mundo
  definitivo, § 6.1): quem partilha o sobrenome da vítima sem parentesco (parentesco não
  é modelado) re-sorteia o sobrenome com sal próprio (`|renome|`), sem deslocar nenhum
  sorteio existente. Verificação empírica: 0 violações nos 21 casos do banco; nomes
  citados na prosa coerentes com o elenco (0 inconsistências).
- **P18 (causa raiz) — Quatro móbeis sem frase.** A OS de priors (F4) adicionou
  `hipoteca_ou_arrendo`, `propriedade_da_esposa`, `divida_de_jogo` e `caridade_negada`
  ao catálogo, mas `PROSA_MOTIVO` não ganhou as frases — a carta caía no fallback mudo
  ("Papéis da delegacia ligam X..."). As quatro frases foram escritas (aritmética de
  época preservada) e os DOIS fallbacks (móbil real e móbil-isca) reescritos para algo
  inteligível (queixa registrada e retirada; o papel ficou). Fallback mudo restante no
  banco: 0.
- **P19 — Falatório com assunto.** `escandalo_gravidez` deixou o eufemismo vazio:
  a frase agora diz do que corre o falatório (criança por vir, nome atado ao caso) —
  genérico, mas inteligível (critério P15).
- **P12 — Instrumento nomeado.** A carta do instrumento abandonado diz O QUE ficou na
  cena (mapa `INSTRUMENTO_A_VISTA` por método: lâmina de ofício, cordão torcido, peça
  pesada de ocasião…) e POR QUE a vila dá o dono ("mais de uma boca reconhece a peça de
  uso").
- **P13/P14 — Nota e bilhete com assunto.** A nota diz que é acerto de dinheiro para
  correr em reserva; o bilhete, pedido de socorro em dinheiro — ambos coerentes com as
  admissões já escritas do confronto ("trato para se fechar calado"; "saí com a recusa
  e a vergonha").

Verificação: `npm run gerar:casos`, `npm run build` limpo, `qa.mjs` **CASO VÁLIDO**,
`qa-ui.mjs` **UI VÁLIDA**; checagens empíricas de homônimo (0/21) e de fallback mudo (0)
no banco regenerado.
