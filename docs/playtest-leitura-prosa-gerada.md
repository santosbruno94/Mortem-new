# Roteiro de playtest de leitura — prosa dos casos gerados

Aceite da Fase 4 da OS de lapidação editorial (`docs/os-lapidacao-prosa-gerada.md`).
É um playtest de LEITURA: joga-se devagar, lendo em voz alta o que a mesa mostra.
Rodar com `npm run dev`. Tempo estimado: 30–40 minutos (dois casos). Anotar cada
achado com o número do passo e a frase copiada.

## Preparação

1. Abrir o jogo com `?caso=gerado_a_hora_emprestada_replica_96` (a réplica —
   determinística, boa para comparar anotações).
2. Ter à mão o teste do guia (§7): frase que conclui pelo jogador = bloqueante;
   duas frases pedindo aplauso na mesma cena = uma sobra.

## Parte A — a abertura (6 passos)

3. Ler os 6 passos em voz alta. O delegado deve soar a homem de expediente, não a
   aforista: além de "papel meu não data defunto" (que fica — fórmula de ofício)
   e do fecho "a perícia é {do senhor|da senhora}", nenhuma outra tirada.
4. As 3 perguntas do briefing: as respostas dão fato ou encaminham; nenhuma
   conclui pelo perito.
5. Conferir a carta do delegado: nome, idade e profissão da vítima batem com o
   briefing e, depois, com o subtítulo do corpo. Profissão sempre em PT
   ("mestra-escola", "senhor de terras" — nunca "professora de vila desta vila",
   nunca "Squire").

## Parte B — as localidades

6. **O Corpo**: a moldura fala do cômodo em voz de vila ("quarto do sobrado",
   "cozinha da granja" — sem parêntese técnico). Rigor e livores descrevem sem
   concluir; nos casos de corpo movido, a nota das manchas "do lado que ora fica
   para cima" aparece SÓ no estado fixo, sem "porém".
7. **A Cena**: a primeira frase concorda com o gênero da vítima ("guarda o dia em
   que a/o acharam"); a mobília citada é do cômodo do crime (quarto não lista pia
   de copa); nenhuma frase de textura repetida no mesmo parágrafo.
8. Ler as cartas extraíveis na mesa: cada descrição acrescenta exame próximo ao
   que a localidade mostrou de longe (não repete a moldura); nenhuma entrega a
   inferência ("alguém saiu ferido", "o passo é de saída" NÃO devem existir — o
   observável fica, a conclusão é do jogador).
9. **A Vizinhança / A Delegacia**: molduras fecham em fato, sem máxima de fecho
   ("O que uma noite faz de barulho…" não existe mais).

## Parte C — a tela de suspeitos

10. Ler os cinco retratos em sequência: nenhum repetido na mesma tela; nenhum
    entrega laudo de fiabilidade ("as horas não fecham entre si" não existe —
    "conta a noite por canecas, não por horas" é o teto).

## Parte D — um caso com interferência

11. Jogar `?caso=gerado_comarca_3` (retratação + rastro de dinheiro). Deixar o
    evento disparar (gastar ações) e reler a vizinhança: o bloco contingente abre
    com "Na volta, o que a primeira visita não viu:" — inventário, não
    sobrancelha erguida.
12. As cartas de dinheiro: a caderneta quitada e os soberanos dão fato datado e
    nome declarado — sem "Dívida velha não se paga sozinha", sem "o caminho sobe
    até".
13. O álibi de Charles Williams e a carta do avistamento (01h00): as duas
    declarações do mesmo homem fecham entre si (o encontro à porta consta do
    álibi).
14. Em `?caso=gerado_comarca_2`, a testemunha inquieta (prenúncio): a fala não
    trata o perito no masculino (vale para detetive mulher).

## Parte E — monotonia entre casos

15. Jogar um segundo caso da comarca em seguida e reler abertura + localidades:
    o ritual (pensão, trem, chegada) repete por design; o que NÃO pode repetir é
    tirada de efeito. Anotar onde a repetição doer de verdade (candidata a
    variante futura, decisão de mesa).

## Parte F — regressão

16. Jogar a abertura do caso-escola ("A Hora Emprestada"): intocada.
17. `node scripts/qa.mjs`, `node scripts/qa-ui.mjs` e `node scripts/lint-prosa.mjs`
    verdes.

## O que anotar

- Frase que conclui ou aponta pelo jogador (guia §2) — bloqueante.
- Erro de costura (gênero, artigo, nome fora do elenco, hora que não fecha) —
  bloqueante.
- Máxima/epigrama acima do teto (≤1 por cena) — alto.
- Frase dura de ler em voz alta — menor, com a frase copiada.
