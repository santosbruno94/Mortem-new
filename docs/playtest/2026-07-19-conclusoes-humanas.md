# Conclusões do playtest humano — 19 de julho de 2026

Lista de conclusões trazidas pelo usuário após jogar (foco no caso-escola artesanal, com
apontamentos para o procedural). Registrada conforme o protocolo
(`docs/playtest/protocolo-playtest-humano-procedural.md`). Triada em lotes; o estado de cada
item é mantido aqui.

## Triagem e estado

| # | Conclusão | Lote | Estado |
|---|---|---|---|
| 18 | Tirar "quem responde ao chamado?" — só Harlan é jogável | A | ✅ Feito |
| 13 | QOL: a hora-fim da janela nunca antes da hora-início | A | ✅ Feito |
| 15 | Ficha da carta: lembrete de onde foi extraída | A | ✅ Feito |
| 5 | Carta aberta não indicar o verbete do glossário (dá a resposta) | A | ✅ Feito |
| 6 | Extração: negrito→roxo (link "visitado") + reabrir a carta inline no texto | B | ⏭️ Próximo |
| 10 | Carta amassada do sobrinho: opção de ler a transcrição completa | B | ⏭️ |
| 12 | O vidro na dobra da calça de Silas dá a pista máxima → repensar | C | ⏭️ Decisão |
| 14 | Mural: cartas de "mentiras" já rotuladas como mentiras → repensar | C | ⏭️ Decisão |
| 16 | Móbil ligado ao réu selecionado; cada suspeito com um móbil | C | ⏭️ Decisão |
| 11 | Diálogos: exposição contida no próprio diálogo (ex.: "hábito da corda") | C | ⏭️ Decisão |
| 8 | Mapa: cômodos de um mesmo local → planta única navegável (não 4 casas) | C | ⏭️ Decisão |
| 9 | Silas e o aprendiz saem da cena para suas casas após a polícia cercar | C | ⏭️ Decisão |
| 1 | Refazer a abertura | D | ⏭️ Prosa (pipeline) |
| 2 | Voz do mestre → não monólogo; tutorial guia ao glossário + "o mestre já falou disso" | D | ⏭️ Design + prosa |
| 7 | "O legista, examinando" ficou artificial → reescrever | D | ⏭️ Prosa |
| 3 | Glossário com cara de livro de medicina legal de época | E | ⏭️ Futuro |
| 4 | Recortes de imagem nas cartas (feridas) | E | ⏭️ Futuro (asset 2D sob contrato) |
| 17 | Maquete 3D da vila nos casos procedurais | E | ⏭️ Futuro (paridade; = 4.3) |

## Lote A — o que foi feito (19/07/2026)

- **18 — Escolha de detetive removida.** `TelaPersonagem.jsx`: "Quem atende ao chamado?"
  (pergunta/escolha) → "O perito que atende ao chamado." (apresentação declarativa). Só
  Harlan segue jogável. Contrato do `qa-ui` atualizado no mesmo commit (o seletor que
  aguardava o texto antigo agora aguarda o novo).
- **13 — QOL da janela da morte.** `SeletorJanela` (`MuralAcusacao.jsx`): o seletor de
  **Fim** só oferece horas ≥ início; mover a início à frente de um fim já escolhido reseta o
  fim. Camada de UI; os dois `<select>` e sua ordem (contrato do `qa-ui`) permanecem.
- **15 — Origem na ficha.** `FichaEvidencia.jsx`: o rodapé passa a mostrar "extraído em:
  {localidade}", para o jogador não precisar voltar à mesa só para reencontrar de onde veio a
  carta. Vale em toda ficha, inclusive a aberta pelo mural.
- **5 — Ponteiro do glossário removido da carta.** `FichaEvidencia.jsx`: saiu o link
  "§ verbete, no Glossário" (entregava a dedução, ex.: "reação vital"). O Glossário segue
  acessível pela mesa; guiar até ele quando for hora é papel do tutorial (item 2), não um
  ponteiro fixo em toda carta.

Verificação: `npm run build` limpo, `qa.mjs` **CASO VÁLIDO**, `qa-ui` **UI VÁLIDA**.

## Observações para os lotes seguintes

- **Itens 5, 6 e 2 se cruzam** na experiência da carta/glossário — vale desenhá-los juntos no
  Lote B/D para não retrabalhar (o negrito "visitado" clicável do 6 muda como a carta reabre;
  o 2 muda como o glossário é alcançado no tutorial).
- **Itens 12, 14 e 16 são fair play** do caso-escola (o quanto uma prova entrega o réu) — a
  decisão do usuário rege, cruzada com `docs/kb-craft-narrativo/cliches-e-fair-play.md`.
- **Item 8 (planta única) e 9 (suspeitos saem da cena)** tocam os dados espaciais e o elenco
  do caso-escola; podem exigir a maquete/planta — conversar com a camada 3D antes.
