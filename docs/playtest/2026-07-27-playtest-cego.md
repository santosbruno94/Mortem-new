# MORTEM — Relatório de Playtest às Cegas

**Data:** 27/07/2026 · **Branch:** `claude/mortem-vertical-slice-zzrcto` (padrão) · **Caso jogado:** A Hora Emprestada (caso-escola)
**Método:** jogador cego, sem ler código, docs ou soluções — só o que a tela mostrou. Partida completa, do título ao epílogo.

---

## Resultado da partida

- **Desfecho:** SUCESSO, COM GAFES — acusei **Silas Crane**, janela **21h–22h de 13/out**, causa **ferida por arma branca (buril)**, móbil **a fraude descoberta**. O júri condenou.
- **Retrato:** 7h30 de investigação no jogo · 9 de 9 lugares visitados · 34 de 51 observações na mesa.
- As "gafes" vieram dos juízos sobre os não-acusados (dei "Inocente" a todos; o jogo cobrou veredictos fundamentados nas cartas).

O raciocínio que o jogo me *fez* fazer, sem me dar nada de graça: o rigor + livores + temperatura desmentiram o relógio parado às 08h45 e a "luz das cinco"; a roda de contagem pousada na **nona** batida entregou a encenação dos ponteiros; a corda das onze + reserva de 30h fechou a morte antes das 23h de sexta; o vermelho-de-polir no canal da ferida apontou a bancada; o vidro na dobra da calça, o quarto cinco às escuras às 21h e o "homem na boca do beco depois das nove" fecharam o nó no primeiro-oficial. **Eu cheguei ao culpado por dedução legítima — o caso joga limpo.** Isso é o maior elogio que um jogo de detetive pode receber.

---

## Veredito em uma frase

**A Hora Emprestada é um caso de detetive de qualidade rara — escrita excepcional, perícia que ensina de verdade e um mistério honesto — apoiado em sistemas que funcionam quase todos, mas com três arestas de UX/consistência que merecem conserto antes de qualquer coisa nova.**

---

## O que brilhou

**1. A prosa.** O texto é o melhor ativo do jogo, de ponta a ponta: o telegrama do Abbot ("provavelmente"), a carta do Wycliffe ("homem posto fora da sua profundidade"), o Davey Tull ouvindo o relógio do morto "do jeito que o patrão fazia com ele". Cada personagem tem voz própria e classe social audível. Nenhuma linha soou genérica.

**2. A perícia como mecânica, não como cenário.** A Voz do Mestre ensina método (cruzar rigor com termômetro; boca em losango = haste de quatro faces; ferida de homem vivo vs. morto) e o jogo depois **cobra** esse método no "ponto a decidir" (corpo × relato do moço do padeiro) e na montagem da acusação. O jogador termina sabendo mais forense do que começou.

**3. Economia de tempo elegante.** Examinar e interrogar de graça, viajar custa 1h, a vila escurece na prancha conforme a hora — legível, temático, sem microgestão.

**4. O interrogatório com descida sem volta.** Cada pergunta descarta as outras; confrontos com prova não gastam a vez. Gera tensão real de escolha e dá replay imediato ("que teria saído se eu apertasse?"). Os quatro tons (‹ ◦ ▪ ~) convidam a interpretar o personagem.

**5. Mundo vivo.** Enquanto eu viajava: a testemunha se retratou, o posto fechou o corredor da cela, o Gabinete Pettigrew surgiu no mapa a partir de uma anotação no livro de ordens. A vila reage — isso vende a simulação.

**6. Pistas falsas bem calibradas.** Walter terminou com **5 provas** contra si (mais que o culpado!), mentiu sobre o carro das seis, tinha móbil de herança — e é inocente. Herrick confessou entrada e furto na cena, e é inocente do homicídio. O painel de "provas por suspeito" seduz para o erro de contar cartas em vez de pesá-las. Excelente desenho.

**7. O epílogo fecha as contas.** O jornal explica a luz da madrugada (o lampião queimando até secar — detalhe plantado na oficina desde o início!) e o caminho do recoveiro. Nada ficou mágico.

---

## O que precisa de conserto (em ordem de prioridade)

**1. Painel de Álibis nunca registrou nada. [bug]** Colhi paradeiro declarado dos seis suspeitos — o jogo até nomeia as cartas ("Recolhido à Estalagem às Oito", "Em Casa desde as Seis", "A Estrada a Noite Inteira", "Véspera de Feira no Moinho", "O Carro das Seis", "A Mesma Resposta Duas Vezes") — e o painel exibiu "nada declarado ainda" até o fim. Pior: o monólogo final me acusou de julgar Grey e Tull "sem paradeiro colhido", quando eu colhi os dois. Ou o painel não está lendo as declarações, ou a condição de registro é outra e não está comunicada; nos dois casos, o instrumento central de cotejo hora×janela ficou morto a partida inteira.

**2. Confronto antes da declaração gera contradição narrativa. [consistência]** Confrontei Walter com o Registro da Estalagem antes de perguntar a noite dele. O jogo exibiu o aviso "ainda não há paradeiro declarado para confrontar" — mas rodou a cena inteira mesmo assim, com confissão completa ("Não houve carro… fiquei no três a noite inteira"). Logo depois, ao perguntar o paradeiro, ele reapresentou a mentira do carro das seis *que já tinha confessado ser falsa*. O mesmo aviso apareceu com Rooke e Herrick. Ou o confronto trava até haver declaração (o que o aviso sugere), ou a árvore precisa reconhecer a confissão anterior.

**3. Feedback dos juízos é opaco. [design]** O final diz que meu "Inocente" para Walter, Rooke e Herrick "não correspondeu ao que as cartas provam", mas as opções eram só Cúmplice/Inocente/Sem juízo, e o jogo não ensina o critério — fiquei sem saber o que deveria ter marcado (Sem juízo, por falta de fundamento? Contestar as mentiras deles na parte III primeiro?). A punição é justa; a pedagogia, não. Uma linha do Mestre sobre "o que funda um juízo" resolveria.

**4. "Voltar o corpo" sem efeito visível. [UX]** O botão não marca "· feito", o texto da cena não muda, e a virada da prancha é outro botão. A 8ª observação (livores no dorso) depende de caçar um "+" pequeno na figura — quase a perdi. Sugestão: "Voltar o corpo" vira a prancha e destaca o hotspot, ou os livores viram termo clicável no texto.

**5. A Cela cobra 1h de viagem estando no Posto. [economia]** A cela é "nos fundos do posto"; pagar 1h para atravessar o corredor quebra a lógica do custo = deslocamento pela vila. Se for intencional (burocracia do guarda?), o texto precisa dizer.

**6. O relógio nunca apertou. [tensão]** Cheguei 13h de sábado, selei o caso 20h30 do mesmo dia, com a audiência só segunda 10h. Para o caso-escola talvez seja o desejado, mas o jogador nunca sente a ameaça anunciada ("o corpo não vai durar", "o que quiser datar, date cedo"). Vale calibrar: janela de chegada mais tarde, ou degradação real das leituras no domingo.

**7. Fio solto: o esconderijo da torre.** A gravação na cuvette (S. MIGUEL · IV · MEIA-VOLTA À ESQUERDA) → chapa presa para trás, vazio limpo, sebo na trava, barro fresco na escada — e a partida terminou sem que nenhuma cena me deixasse perguntar *o que havia lá* ou *quem levou*. Se é gancho deliberado (para a Vitória Absoluta ou outro ramo), perfeito; se não, é a única promessa que o caso faz e não paga.

---

## Nota do jogador cego

Onboarding: impecável — em nenhum momento precisei de tutorial; os textos de rodapé ("examinar não custa tempo; o relógio só corre quando você viaja", "a conversa desce e não volta") ensinaram tudo no lugar certo. A tela de título com os quatro chamados comunica a proposta do produto em dez segundos. Rodou liso no Vite, sem erro de console visível, sem travar em nenhuma transição.

**Recomendação:** consertar os itens 1–3 antes de expandir conteúdo — os três tocam o mesmo músculo (declaração → cotejo → juízo), que é exatamente o clímax do jogo. O resto é polimento de um caso que já está, francamente, muito bom de jogar.
