# Roteiro de playtest dirigido — árvore de diálogo procedural

Aceite da Fase 5 da OS (`docs/os-arvore-dialogo-procedural.md`). Rodar com
`npm run dev` e abrir o navegador no endereço indicado. Tempo estimado: 20–30
minutos. Anotar cada achado com o número do passo.

## Preparação

1. Abrir o jogo com `?caso=gerado_a_hora_emprestada_replica_96` na URL (a
   réplica dirigida — determinística, boa para comparar anotações).
2. Atravessar a abertura (6 passos) até "Entrar — iniciar a investigação".

## Parte A — a porta dos interrogatórios

3. Viajar até **A Delegacia**. Conferir: a prosa menciona os chamados à sala
   do expediente, e ao pé da prosa há **cinco botões "Interrogar …"** — um por
   suspeito, em ordem alfabética.
4. Nenhum botão deve citar id interno (`gen_…`); só nome de gente.

## Parte B — a conversa que desce e não volta

5. Abrir o primeiro interrogatório. Conferir a abertura: quem recebe bem
   (adianta-se) e quem cobra (espera a pergunta) deve soar diferente entre os
   cinco suspeitos.
6. O beat oferece **quatro falas do perito** (firme ◦ cordial ▪ técnico ~
   oblíquo). Escolher UMA. Conferir: não há como voltar; a conversa avança.
7. No beat do paradeiro, a resposta traz **um termo em negrito** (a carta de
   álibi). Extraí-lo e conferir na mesa: nome do lugar e hora declarada
   ("recolhi-me às oito…", "do meio-dia às seis…") coerentes com a faixa do
   crime (noite/madrugada/tarde de sexta, 13/out).
8. Escolher um tom no segundo beat e conferir que a conversa **se encerra**
   ("as perguntas feitas não se refazem").
9. Fechar e reabrir o mesmo interrogatório: deve **retomar onde parou**
   (encerrado), não recomeçar.
10. Interrogar um segundo suspeito escolhendo tons DIFERENTES dos do passo
    6–8 e conferir que a carta de álibi sai do mesmo jeito (o caso é acusável
    em qualquer tom).

## Parte C — o confronto de prova

11. Antes de ter provas: abrir um interrogatório e conferir que **nenhuma
    caixa de confronto** aparece (ela é gated pela carta na mesa).
12. Extrair a carta de nexo do caso (o instrumento/pertence — na cena ou na
    diligência ao ofício do réu) e o móbil na delegacia.
13. Voltar ao interrogatório do dono da prova. A caixa de confronto agora
    oferece a pergunta "[Nome da Carta] Por que …?". Confrontar. Conferir:
    - a reação é própria (o interrogado acomoda a prova sem confessar);
    - a conversa **retoma de onde estava** (canal lateral, sem descer);
    - se o paradeiro dele **já** estava na mesa, o mural ganha a ligação
      vestígio→álibi (barbante removível); se **não** estava, aparece o aviso
      de que não há paradeiro declarado para confrontar.
14. Apresentar a MESMA prova de novo: o rótulo marca "· já apresentada".

## Parte D — tom ressonante e voz

15. Num caso do modo "caso da comarca" (aleatório), interrogar os cinco
    suspeitos variando os tons. Procurar o **tento a mais** do tom ressonante
    (uma hesitação, um deslize, um detalhe que os outros tons não pagam) —
    ele deve existir em ao menos um beat de cada suspeito.
16. Teste do nome coberto (guia §8.4): ler duas aberturas sem olhar o nome —
    a classe (comerciante × lavrador × criadagem…) deve ser reconhecível.

## Parte E — regressão

17. Jogar o caso-escola ("A Hora Emprestada") e conferir que os
    interrogatórios autorais (Silas, Agnes, Grey, Walter, Davey) seguem
    idênticos — a OS não os toca.
18. `node scripts/qa.mjs` e `node scripts/qa-ui.mjs` verdes.

## O que anotar

- Fala que soe a conclusão pronta (fair play ferido) — bloqueante.
- Reação de confronto que não case com a prova apresentada — bloqueante.
- Voz uniforme entre classes distintas — alto.
- Frase dura de ler em voz alta — menor, com a frase copiada.
