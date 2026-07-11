---
name: redigir-prosa
description: Fluxo obrigatório para escrever ou reescrever qualquer prosa de MORTEM (localidades, cartas, abertura, monólogo, vozMestre, glossário, UI). Carrega o guia de estilo, a bíblia de vozes e a KB forense antes de escrever, e autochecagem antes de submeter.
---

# Redigir prosa de MORTEM

## Antes de escrever (leitura obrigatória)

1. `docs/guia-de-estilo.md` — norma de língua, observação pura, dosagem de brilho.
2. `docs/biblia-de-vozes.md` — o idioleto de cada personagem que fala na cena.
3. O arquivo de `docs/kb-medicina-legal/` pertinente ao conteúdo (tanatologia para
   sinais do corpo, asfixias para o caso tutorial, protocolo-exame para cenas de exame).
4. Os dados-fonte da cena: `src/data/seed.js` (verdade de ouro, nomes, horas),
   `src/data/mapa.js` (distâncias), `src/data/cartas.js` (tags e função mecânica de
   cada carta citada).

## Contrato de escrita

Cada peça de prosa nasce de uma **intenção mecânica** explícita — o que a cena precisa
entregar ao motor e ao jogador:

- Quais cartas (`[[id]]`) a prosa deve conter, e o que cada uma é mecanicamente
  (âncora, isca, vestígio, corroboração — ler `tagsOcultas`).
- O que a cena deve MOSTRAR sem concluir (a isca convincente por si, nunca anunciada
  como isca; a pista presente, nunca apontada).
- Quem fala, e com que idioleto.

Escreva a partir disso. A prosa serve à mecânica como um bom cenário serve à peça:
invisível quando funciona.

## Regras duras (resumo; a norma completa é o guia)

- Observação pura: nenhuma conclusão, nenhum "curioso/estranho/demais", nenhum dedo
  apontado. O mestre só faz leitura técnica.
- ≤ 1 frase de efeito por cena; travessões racionados; proibida a fórmula
  "não X — é Y" além de 1 por arquivo.
- `[[id_da_carta]]` intactos; a frase deve fluir com o `textoDisplay` no lugar do
  marcador. `{g:a|b}` sempre com lados diferentes.
- Horas, dias da semana (13/out/1893 = sexta), distâncias (Moorford = 3h) e nomes
  conferidos contra seed e mapa.
- Camadas não se repetem: a `descricao` da carta acrescenta exame próximo ao que a
  localidade mostrou de longe (guia §5).

## Depois de escrever

1. Rodar a autochecagem do guia (§7), item a item.
2. Invocar a skill `anti-padrao-ia` sobre o texto novo (greps + leitura monotemática).
3. Se a peça é substancial (localidade inteira, monólogo), submeter aos agentes
   `editor-critico` e `perito-forense` antes de dar por pronta.
