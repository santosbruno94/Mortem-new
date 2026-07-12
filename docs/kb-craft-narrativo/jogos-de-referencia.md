# Jogos de referência — como cada um estrutura a dedução

> Engenharia reversa dos jogos de dedução que informam MORTEM: como a informação chega
> ao jogador, como (e se) a dedução é validada, como o chute é bloqueado e como a
> interface evita entregar a solução. Fontes: devlogs e postmortems (Lucas Pope), GDC
> talks, entrevistas de designers e análises longas — lista em "Fontes consultadas".

A pergunta que atravessa todos os casos é a de Klavins (Golden Idol): **como o jogador
comunica ao jogo que deduziu, sem que o canal de comunicação vire gabarito ou máquina
de chute?** Cada jogo abaixo é uma resposta diferente.

---

## Return of the Obra Dinn

- **Informação:** cenas de morte congeladas, fora de ordem, indexadas num livro que é ao
  mesmo tempo linha do tempo, catálogo da tripulação e formulário de resposta; os 60
  destinos agrupados em 10 "desastres" para dar capítulos ao material acronológico.
- **Validação:** catálogo FECHADO (60 nomes, lista finita de causas), confirmação **em
  trincas** — qualquer conjunto de 3 destinos corretos trava as páginas com fanfarra.
  Pope queria feedback imediato, mas registrou no devlog que "feedback imediato pode ser
  trapaceado"; a trinca é o compromisso (os últimos destinos validam em pares).
- **Anti-chute / UI:** em trincas, o jogador nunca sabe QUAL das três acertou — varrer
  combinações deixa de compensar (ainda assim jogadores "farmavam trincas" com
  identidades fáceis, tensão que Pope admitiu não fechar de todo). O livro só mostra o
  testemunhado; retratos ficam desfocados até haver informação bastante para o rosto
  (tiers fácil/médio/difícil-só-por-eliminação): a UI sinaliza *resolubilidade*, nunca
  *solução* — e até isso vaza.
- **Lição:** validar só em lote, no veredicto. **Armadilha:** o desfoque é metadado que
  entrega ("clareou = dá pra resolver"); nenhum estado visual de carta pode ser
  termômetro da solução.

## The Case of the Golden Idol (e The Rise of the Golden Idol)

- **Informação:** cenas estáticas exploráveis; cada nome/substantivo clicado vira termo
  num banco de palavras. A resposta são frases lacunadas ("X matou Y com Z porque W"),
  estilo Mad Libs, que descrevem o enredo da vinheta.
- **Validação:** por CENA, ao preencher tudo. O certo/errado imediato das primeiras
  versões frustrava (não se sabia qual lacuna errou); a solução foi o indicador **"2 ou
  menos lacunas erradas"** + subpuzzles intermediários (identificar pessoas) como
  progresso parcial. Klavins registra o custo: "isso reduziu a dificuldade e a duração".
- **Anti-chute / UI:** a combinatória do banco (milhares de permutações por cena) mata o
  chute; o indicador vago impede varredura lacuna a lacuna. Escopo POR CENA: o banco só
  contém termos daquela vinheta — a existência de uma palavra é pista, nunca aponta a
  lacuna.
- **Lição:** a acusação precisa de graus de liberdade que tornem o acerto por sorte
  desprezível — o mural é um "banco de palavras" espacial. **Armadilha:** feedback de
  proximidade ("quase lá") barateia o final: vira ajuste fino, não convicção.

## Her Story / Immortality

- **Informação:** Her Story: 271 clipes de interrogatório buscáveis por palavra, mas só
  os 5 primeiros resultados aparecem — exaustão inviável, consulta criativa é o verbo.
  Immortality troca a busca pelo **match cut** (clicar num rosto/objeto corta para cena
  com imagem afim; >1 milhão de cortes gerados por dados, camada secreta gated por
  "progress value").
- **Validação:** NENHUMA. Barlow chama de "quebrar o jogo": qualquer ordem de descoberta
  deve dar experiência válida; "a imaginação faz o trabalho pesado". Her Story só
  pergunta num chat, ao final, se o jogador entendeu — e aceita qualquer resposta.
- **Anti-chute / UI:** sem formulário não há chute; o limite de 5 resultados e o gating
  por progresso impedem que exaustão substitua curiosidade. Interface diegética e burra
  por design: não marca clipes importantes, não conta o que falta, não ordena.
- **Lição:** o pilar "o jogo nunca entrega conclusões" no extremo — a prosa das cartas
  deve sustentar leituras que o motor jamais comenta. **Armadilha:** sem validação
  alguma, parte dos jogadores termina sem saber que terminou; o veredicto de MORTEM
  existe para não herdar essa deriva.

## Paradise Killer

- **Informação:** mundo aberto em qualquer ordem; evidências caem em "casefiles" por
  crime. Designers: "nunca usamos truques narrativos — os fatos são postos diante do
  jogador e cabe a ele interpretá-los".
- **Validação:** julgamento final onde se pode **acusar qualquer um**, com qualquer
  subconjunto de evidência (inclusive nenhuma). O tribunal julga a *sustentação* do
  argumento, não a "verdade"; há distinção explícita entre fato provado e convicção
  íntima — dá para condenar quem se sabe inocente, e viver com isso.
- **Anti-chute / UI:** fraco de propósito — chutar é permitido, mas rende julgamento
  visivelmente raso; o custo é retórico e moral. Casefiles agrupam sem hierarquizar;
  nada marca "evidência decisiva"; diálogo em menu aberto, sem opção "certa".
- **Lição:** separar "o que você prova" de "o que você acha" — julgar a acusação
  construída no mural, não um nome num menu. **Armadilha:** evidência 100% opcional
  deixa o desfecho mole; em MORTEM a falta de prova custa caro (Erro Judiciário).

## Ace Attorney (série)

- **Informação:** investigação apontar-e-clicar alimenta o Court Record; nos
  julgamentos, depoimentos em frases numeradas que se pode "pressionar" ou confrontar
  com evidência.
- **Validação:** IMEDIATA e binária, frase a frase: a evidência certa na frase certa
  avança; a errada desconta uma barra de penalidades. Só existe UMA contradição aceita
  por vez.
- **Anti-chute / onde falha:** a barra taxa a tentativa-e-erro (em Dual Destinies, 3
  penalidades seguidas liberam um botão "Consult" que aponta a frase — dica escalonada).
  Quebra em dois pontos documentados: pixel-hunting na investigação (vasculhar até o
  jogo liberar) e o "adivinhe o designer" — depoimentos com vários furos reais onde só
  um é aceito, punindo dedução correta por não ser A esperada; Mark Brown critica
  exatamente essa degeneração em tentativa-e-erro.
- **Lição:** contradição depoimento × evidência é verbo central — e prova a MENTIRA,
  não a culpa ("nem todo mentiroso é culpado"). **Armadilha:** validação imediata de
  cada ligação do mural recriaria o "adivinhe o designer"; toda leitura sustentada pelas
  `tagsOcultas` deve valer.

## Sherlock Holmes: Crimes & Punishments / Consulting Detective

- **Informação:** C&P: pistas viram nós numa **árvore de dedução explícita** (pares
  combinam em "neurônios"; vários nós admitem duas interpretações alternáveis).
  Consulting Detective (tabuleiro, 1981): caderno do caso, diretório de Londres e jornal
  do dia — o jogador escolhe quais endereços visitar.
- **Validação:** C&P: cada caso fecha em 3–5 conclusões possíveis (+ escolha
  condenar/absolver); o jogo aceita qualquer uma **sem sinalizar erro** — só um botão
  opcional, após fechar o caso, revela o acerto. Consulting Detective: perguntas finais
  + solução de Holmes; o placar desconta 5 pontos por pista visitada, premiando indução
  ("soluções brilhantes por observação aguda, não trabalho de formiga" — Erik Twice).
- **Anti-chute / UI:** C&P: fraco — a árvore afunila e dá para ligar tudo; o custo do
  erro é narrativo (inocente preso). Pior: a árvore mostra quantos nós faltam e quais
  têm interpretação dupla — a estrutura conta quando a dedução está "completa". No
  tabuleiro, a exaustão é derrota no placar e não há UI que vaze.
- **Lição:** finais errados aceitos sem alarme e com consequência — o jogador suporta e
  lembra. **Armadilha:** mural que exiba "quantas ligações faltam" ou marque nós
  ambíguos vira a árvore de C&P: a topologia da UI entrega o que a prosa escondeu.

## Pentiment

- **Informação:** investigação com **tempo limitado por design** — dias divididos em
  blocos (as refeições marcam o relógio); cada bloco comporta uma linha de investigação;
  parte das pistas fica necessariamente para trás.
- **Validação:** NUNCA. Não há assassino canônico: "desde o início eu disse que não pode
  haver resposta certa" (Sawyer). O jogador convence um arquidiácono deliberadamente
  parcial (acusar o prior custa mais que acusar a viúva) e vive as consequências por
  décadas: "isto foi o que você descobriu, esta foi sua escolha, eis as consequências".
- **Anti-chute / UI:** o protótipo tinha álibis e Sawyer os REMOVEU: "álibi só exclui
  suspeitos, e queremos incluir pessoas no quadro, não excluí-las" — sem eliminação
  limpa, não há o que brute-forçar. Nenhum medidor de suspeita nem lista "completa" de
  evidências; o jogador não sabe o que perdeu.
- **Lição:** o relógio mole (sinais perecíveis, rotas que se fecham) é parente direto:
  escolher o que investigar É a mecânica. **Armadilha:** MORTEM tem verdade canônica e
  veredicto — importar o "sem resposta certa" desrecompensaria o Metódico; importa a
  *textura* da dúvida, não a ausência de gabarito.

## Disco Elysium (contraexemplo)

- **Informação:** 24 perícias são VOZES internas que comentam tudo; checks passivos
  disparam sozinhos no diálogo e entregam leituras prontas ("ele mente", "repare no
  sapato").
- **Validação / por que funciona lá:** o jogo entrega conclusões o tempo todo — e
  funciona porque as vozes são personagens falíveis e contraditórias (Inland Empire
  alucina, Drama vê mentira em tudo) e checks falhados geram conteúdo tão bom quanto os
  passados. A dedução vira curadoria: em qual voz confiar. O caso, aliás, resolve-se
  sozinho no enredo — DE é sobre o detetive, não sobre a dedução.
- **Por que não serve ao MORTEM:** as conclusões são caracterização de um protagonista
  quebrado; MORTEM tem detetive neutro e pilar de dedução real — qualquer voz que diga
  "ele mente" mata o trabalho do jogador. **Lição:** a dica do mestre pode falar como
  personagem, com viés e hesitação, lendo o estado observável sem enunciar a inferência
  — a mesma divisão que a KB forense impõe às cartas do corpo. **Armadilha:** dica que
  acerta sempre ensina a terceirizar o raciocínio; se o mestre opina, que opine falível.

## Outer Wilds

- **Informação:** dedução puramente ambiental; o ÚNICO progresso é conhecimento. Regra
  de distribuição de Beachum: cada "Curiosidade" tem ~3 pistas e **nunca duas pistas da
  mesma Curiosidade no mesmo planeta** — a triangulação é forçada pela geografia.
- **Validação:** o diário de bordo registra fatos e rumores (mapa de rumores com fios —
  um mural automático), mas nunca sintetiza a conclusão; "informação acionável" sem
  paternalismo, nas palavras de Beachum.
- **Anti-chute / UI:** a "resposta" não é formulário, é um ato no mundo — só quem
  entendeu consegue executar; chute não tem onde ser digitado. O metadado mais agressivo
  que o jogo se permite é o marcador "há mais para descobrir aqui" no diário.
- **Lição:** duas evidências que sustentam a mesma inferência-chave nunca na mesma
  localidade/carta — a convergência da Janela da Morte já segue esse espírito.
  **Armadilha:** o marcador "há mais aqui", num jogo de acusação, vira detector de pista
  faltante; MORTEM não deve contar o que o jogador não viu.

---

## Tabela-síntese

| Jogo | Validação | Anti-chute | Lição para MORTEM |
|---|---|---|---|
| Obra Dinn | em trincas, catálogo fechado | combinatória da trinca | validar só em lote, no veredicto |
| Golden Idol | por cena, "≤2 lacunas erradas" | permutação do banco de palavras | lacunas bastantes p/ sorte não bastar |
| Her Story / Immortality | nenhuma | sem formulário; busca limitada | prosa sustenta leituras que o motor não comenta |
| Paradise Killer | julga o argumento, não a verdade | custo retórico, não mecânico | provar ≠ achar; evidência ausente tem preço |
| Ace Attorney | imediata, frase a frase | barra de penalidades | contradição prova mentira, não culpa |
| SH: Crimes & Punishments | aceita conclusão errada sem avisar | fraco (árvore afunila) | erro judiciário silencioso é potente |
| SH: Consulting Detective | perguntas finais + solução de Holmes | custo por pista visitada | premiar indução, taxar exaustão |
| Pentiment | nunca; sem assassino canônico | sem álibis → sem eliminação limpa | tempo limitado como mecânica de escolha |
| Disco Elysium | entrega conclusões (vozes falíveis) | n/a | mestre com voz e viés; nunca a inferência |
| Outer Wilds | registra fatos, nunca sintetiza | resposta é ato, não formulário | pistas da mesma conclusão nunca juntas |

---

## Implicações para o jogo

1. **Veredicto valida só em lote (Obra Dinn):** nenhuma ligação do mural recebe
   certo/errado individual; o julgamento cai sobre a acusação inteira, uma vez.
2. **Mural mudo (C&P às avessas):** o mural jamais exibe contagem de ligações esperadas,
   nós faltantes ou "completude" — a topologia da UI não pode ser gabarito.
3. **Cartas sem estado-termômetro (Obra Dinn):** nenhum tratamento visual de carta pode
   correlacionar com "esta importa" ou "agora dá para resolver".
4. **Acusação com lacunas bastantes (Golden Idol):** o formulário do veredicto (quem,
   como, quando, por quê) precisa de graus de liberdade que tornem o acerto por sorte
   estatisticamente desprezível — o anti-chute estrutural de MORTEM.
5. **Sem feedback de proximidade (Golden Idol, lição negativa):** o veredicto não
   sinaliza "quase" antes de julgar; proximidade anunciada converte convicção em
   tentativa-e-erro.
6. **Contradição ≠ culpa (Ace Attorney + pilar próprio):** cartas de depoimento devem
   render contradições REAIS de inocentes, para que desmascarar um mentiroso continue
   não fechando o caso — e o motor segue lendo só `tagsOcultas`.
7. **Erro silencioso e digno (C&P, Pentiment):** o Erro Judiciário é aceito com a mesma
   cerimônia da acusação certa; a consequência, não o alarme, é o ensinamento.
8. **Taxar exaustão pelo tempo, não por pontos (Consulting Detective → relógio mole):**
   MORTEM já converte o custo-por-pista do tabuleiro em degradação dos sinais
   perecíveis; manter essa pressão como único imposto sobre a investigação exaustiva.
9. **Dica do mestre = voz falível, nunca inferência (Disco Elysium):** o mestre lê o
   estado observável ("o corpo está duro por inteiro"), com idioleto e hesitação, e para
   antes do "portanto" — a conversão estado→horas é do jogador com o glossário.
10. **Distribuir tags como Curiosidades (Outer Wilds):** duas evidências da mesma
    inferência-chave nunca na mesma localidade/carta; a triangulação obriga a cruzar o
    mapa e o mural.
11. **Prosa que sobrevive a qualquer ordem (Her Story):** cada carta legível e sugestiva
    em qualquer ordem de descoberta; nenhuma pressupõe outra já lida.
12. **Nada de metadado de ausência (Outer Wilds/Pentiment, lição negativa):** o jogo
    nunca informa "há evidência não coletada"; a incompletude só se revela no veredicto
    e nas gafes.

---

## Fontes consultadas

- Lucas Pope — *Return of the Obra Dinn* Development Logs (TIGSource, 2014–2019) — https://dukope.com/devlogs/obra-dinn/
- GDC — *Live Q&A: Lucas Pope and Return of the Obra Dinn* (2020) — https://www.youtube.com/watch?v=eTUMnE6gzoE
- Bryant Francis — *For Lucas Pope, Return of the Obra Dinn was a bunch of appealing design problems* (Game Developer, 2020) — https://www.gamedeveloper.com/design/for-lucas-pope-i-return-of-the-obra-dinn-i-was-a-bunch-of-appealing-design-problems
- Wikipedia — *Return of the Obra Dinn*, seção Development — https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn
- Joel Couture — *Pursuing the "Aha!" moment with The Case of the Golden Idol* (Game Developer, 2023) — https://www.gamedeveloper.com/design/case-of-the-golden-idol
- Thinky Games — *How the Golden Idol developers made one of the decade's best detective games, twice* (2024) — https://thinkygames.com/features/how-the-case-of-the-golden-idol-developers-made-one-of-the-decades-best-detective-games-twice/
- Mark Brown — *What Makes a Great Detective Game?* (GMTK Substack, 2023) — https://gmtk.substack.com/p/what-makes-a-great-detective-game
- Mark Brown — *How Return of the Obra Dinn Turns You Into a Detective* (GMTK, YouTube, 2019) — https://www.youtube.com/watch?v=V0qxLrFycrc
- Joystick — *Interview with Sam Barlow, creator of Her Story, Telling Lies and IMMORTALITY* — https://joystick.com.gr/interview-with-sam-barlow-creator-of-her-story-telling-lies-and-immortality-on-joystick/
- Unity Blog — *How Half Mermaid designed IMMORTALITY's match cut mechanic* (2022) — https://blog.unity.com/games/how-half-mermaid-designed-immortalitys-match-cut-mechanic
- Bryant Francis — *Inside the fantastic murder-mystery design of Paradise Killer* (Game Developer, 2020) — https://www.gamedeveloper.com/design/inside-the-fantastic-murder-mystery-design-of-i-paradise-killer-i-
- Wikipedia — *Sherlock Holmes: Crimes & Punishments* (conclusões múltiplas por caso) — https://en.wikipedia.org/wiki/Sherlock_Holmes:_Crimes_%26_Punishments
- Erik Twice — *Sherlock Holmes Consulting Detective: The aesthetics of scoring and murder* (2021) — https://eriktwice.com/en/2021/03/19/sherlock-holmes-consulting-detective-aesthethics-scoring/
- Ozzie Mejia — *Pentiment's creator intentionally designed it so 'there cannot be a right answer'* (Shacknews, 2022) — https://www.shacknews.com/article/146276/pentiment-josh-sawyer-no-correct-answer
- Game Developer — *Making Pentiment's most macabre murder mysteries* (2023) — https://www.gamedeveloper.com/design/making-pentiment-s-most-macabre-murder-mysteries
- Gabriel Chauri — *Disco Elysium RPG System Analysis* — https://www.gabrielchauri.com/disco-elysium-rpg-system-analysis/
- Cordial Kobold — *Interview with Alex Beachum, creative director of Outer Wilds* (Medium) — https://medium.com/@cordialkobold/interview-with-alex-beachum-creative-director-of-outer-wilds-a01bb9631e20
- Kelsey Beachum — *Sparking Curiosity-Driven Exploration Through Narrative in Outer Wilds* (GDC 2021, slides) — https://media.gdcvault.com/GDC+2021/beachum_gdc_2021(1).pdf
- Ace Attorney Wiki — *Trial* (penalidades, botão Consult) — https://aceattorney.fandom.com/wiki/Trial
