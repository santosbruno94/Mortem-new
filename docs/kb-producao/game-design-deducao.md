# Game design de dedução — princípios do gênero

> Princípios de design de jogos de dedução genuína (o jogador produz a verdade, não a
> escolhe num menu), extraídos de postmortems, palestras de GDC e análises: Obra Dinn,
> Golden Idol, Her Story, Outer Wilds, Shadows of Doubt, Roottrees. Cobre o GÊNERO; a
> análise jogo-a-jogo fica em documento próprio.

A tensão fundadora, formulada por Mark Brown (GMTK): o design ruim ou faz perguntas que
já contêm a resposta (múltipla escolha adivinha-se), ou abandona o jogador sem nem
saber se há algo a deduzir. Todo o resto negocia entre esses dois abismos.

## 1. Sinalizar sem entregar

O espectro vai do **quest marker** (o jogo aponta, a dedução morre) ao **deserto sem
feedback** (o jogador não distingue "não achei ainda" de "não existe"). O meio-termo é
o **feedback indireto**: confirmar que uma linha EXISTE sem dizer se a leitura é certa.

- **Confirmar a existência da pergunta, não a resposta.** Obra Dinn lista os 60 nomes e
  marca cada rosto com 1–3 pontos de dificuldade: sabe-se O QUE falta, nunca COMO.
  Golden Idol expõe as lacunas da frase-solução: a forma é pública, o conteúdo não.
- **Sinalização ambiental em vez de marcador** (luz, cor, marco, migalha): em jogo de
  texto, prosa com peso desigual no que merece releitura, sem rotular "pista".
- **Knowledge-gating vs flag-gating.** Flag-gate: a porta abre porque o jogador CLICOU
  no gatilho certo. Knowledge-gate: abre porque ele SABE algo, sem nada mudar no mundo
  — Her Story (o banco inteiro está lá desde o início; a chave é a palavra que o
  jogador pensa em digitar), Outer Wilds (o final é executável em minutos por quem
  sabe). Não se destrava por acidente, e o "abrir" É o próprio momento aha.

## 2. Calibração de dificuldade

**O designer não consegue "desaber".** Os autores de Golden Idol: "uma vez que você
sabe a resposta, não pode desaprendê-la" — a autoavaliação de dificuldade vale quase
nada. Só o playtesting com jogadores virgens mede; cada testador serve UMA vez por
caso; observa-se ONDE travou e o que tentou, não "resolveu?".

**Curvas de dica que não humilham** (PostCurious; Golden Idol): (1) **graduação** — a
dica vem em camadas (material relevante → passo intermediário → solução) e o jogador
escolhe a profundidade; (2) a boa dica **aponta atenção, não conclusão** — preserva o
aha, o produto que o gênero vende; (3) **fricção deliberada** — Golden Idol põe um
mini-puzzle banal na frente do botão de dica; (4) **autosserviço** — dica não pedida
humilha.

**O muro de tijolos.** O jogador travado sem saída abandona. Válvulas honestas, em
ordem: várias linhas de investigação em paralelo (travar numa não trava o caso —
receita GMTK); confirmação parcial em etapas; dica gradual sob demanda; no limite,
aceitar a acusação imperfeita e narrar a consequência. A válvula desonesta é baixar a
exigência em silêncio — o jogador percebe.

## 3. Anti-frustração — taxonomia do gênero

| Frustração | Causa de design | Contramedida |
|---|---|---|
| Pixel-hunting | pista escondida na apresentação, não na lógica | interação exaustiva barata; esconder no SIGNIFICADO, nunca no clique |
| Moon logic | solução que não segue a lógica do mundo ficcional | contrato de coerência: solução verificável contra regras que o jogo ensinou (aqui: a ciência de época) |
| Backtracking vazio | revisita sem informação nova, só para acionar flag | knowledge-gate no lugar de flag-gate; revisita só quando novo saber ressignifica o lugar |
| Combinatória explosiva de acusação | acusação = produto cartesiano de N slots testáveis | validar só no desfecho; lote mínimo de acertos (§4); espaço de resposta universal, não menu do caso |
| "Eu sabia, mas o jogo não aceitou" | formulação exigida ≠ formulação do jogador | slots com semântica clara; aceitar qualquer evidência logicamente suficiente, não A evidência prevista |
| Soft-lock silencioso | perdível sem aviso que bloqueia horas depois | perda degrada precisão/acesso, nunca solvabilidade; o mundo telegrafa o que perece |
| Dedução falsa (o jogo deduz por mim) | juntar A+B dispara a conclusão automática | o jogador AFIRMA a conclusão e responde por ela; o jogo só registra fatos |
| Trial-and-error de contradição | só UMA evidência prevista quebra o depoimento (Ace Attorney) | derivar a refutação de relações lógicas (hora alegada × janela física), não de pares hardcoded |

## 4. Anti-chute (sem punir experimentação)

O chute só compensa quando custo × chance de acerto supera o custo de deduzir.

- **Validação em lotes (Obra Dinn, Roottrees)**: confirmar só a cada 3 acertos
  simultâneos de tuplas completas (nome+destino+autor) torna o chute combinatório —
  brute-force fica pior que pensar. Trade-off documentado: perto de fechar o lote, o
  terceiro palpite sai "de graça" — viés de confirmação embutido no remédio.
- **Custo diegético por erro (Ace Attorney)**: barra de confiança que sangra a cada
  evidência irrelevante, dano proporcional ao risco. Só é justo com validação
  semanticamente generosa (§3) — senão pune junto a formulação legítima.
- **Zero feedback até o desfecho (Sherlock C&P, Paradise Killer)**: nada valida antes;
  o chute não se calibra. O mais barato e o mais severo — exige as válvulas do §2.
- **Fricção mínima**: pequeno atrito ao submeter ou pedir dica (mini-puzzle,
  confirmação solene, custo de relógio) filtra o impulso sem taxar a tentativa honesta.

## 5. Validação de acusação — modelos

- **Slots estruturados** (Golden Idol, Obra Dinn): formulário com semântica fixa
  (quem/como/quando). Prós: input inequívoco, imune a parser. Contras: a forma vaza
  informação; combinatória em domínios pequenos. Golden Idol mitiga com o veredito
  agregado "duas ou menos lacunas erradas" — sinaliza quase-lá sem apontar qual.
- **Quadro de dedução com conclusões alternativas** (Sherlock C&P): a árvore aceita
  3–5 conclusões, inclusive a errada. Prós: interpretar vira mecânica; errar é
  legítimo. Contras: taxonomia frouxa ("prova de visita" × "de culpa") mina a
  convicção; sem consequência real, sem peso.
- **Júri que pesa evidência** (Paradise Killer): aceita QUALQUER acusação, mas só
  condena a sustentada; tese fraca absolve mesmo com o réu certo. Prós: separa
  convicção de prova — a essência da perícia. Contras: sem gabarito, falta catarse.
- **Confronto final** (Ace Attorney): a acusação é performada contra resistência. Prós:
  dramaticamente insuperável. Contras: roteirizado por caso (caro, não procedural);
  degenera em trial-and-error com uma só resposta aceita por etapa. Os modelos compõem:
  slots (entrada) + júri (julgamento) + monólogo (dramatização).

## 6. Rejogabilidade e procedural

**O problema mad-libs**: gerar mistério trocando substantivos num esqueleto fixo
produz, na segunda partida, um formulário — o jogador aprende "o clockwork do gerador"
e a tarefa vira matemática (pesquisa ClueGen). Shadows of Doubt, o experimento mais
ambicioso (cidade, rotinas e crimes procedurais), confirma na recepção: casos
repetitivos, textos idênticos, motivos rasos, estrutura previsível.

Michael Cook ("Generative Forensics", 2020) nomeia a razão: mistérios são *information
games* — o gerado é o CONHECIMENTO que o jogador vai extrair; o gerador deve garantir
não só solvabilidade, mas uma TRILHA de descoberta com ritmo. Dungeon mal gerada é
feia; mistério mal gerado é insolúvel ou trivial.

Divisão sugerida pela prática: **gerável** — quem/quando/onde/com quê, malha de álibis,
distribuição de vestígios, variação de superfície por seed; **autoral** — a GRAMÁTICA
de dedução (tipos de pista e relações lógicas: o motor, escrito uma vez), os motivos
humanos e as mentiras de inocente (o que Shadows of Doubt não gera e a crítica sente
faltar), e o esqueleto dramático que dá a cada caso UMA ideia própria. Obra Dinn, zero
procedural e amarrado à mão numa planilha, tem a densidade que gerador nenhum alcançou.

## 7. Onboarding da mecânica de dedução

O verbo do gênero (observar → hipotetizar → comprometer-se) não se ensina por texto.
George Fan (GDC 2012): aprender é FAZER em ambiente controlado; um conceito por vez,
espaçados pelo jogo; o tutorial é invisível — o jogador não nota que é ensinado.

- **O caso-tutorial ensina HÁBITOS, não fatos**: medir cedo o que perece, desconfiar da
  mentira moral, sustentar antes de afirmar. O fato descarta-se; o hábito transfere —
  contrato de currículo (cada caso introduz um verbo que os seguintes pressupõem).
- **A primeira dedução deve ser pequena, inteira e do jogador**: um aha barato nos
  primeiros minutos estabelece que aqui a conclusão é responsabilidade de quem joga.
- **Ajuda decrescente com desmame explícito**: o mentor que lê em voz alta no início e
  emudece depois formaliza a curva; o risco é terceirizar o raciocínio — a ajuda modela
  o MÉTODO ("meço, depois comparo"), nunca a leitura da pista decisiva.

## Implicações para o jogo

- **Mural**: é o modelo composto do §5 (slots + sustentação por ligação + monólogo).
  Riscos a vigiar: combinatória de acusação (mitigada pelo espaço universal e validação
  só no desfecho) e "eu sabia mas não aceitou" — a derivação por tags, não por pares
  previstos, é a contramedida exata; preservá-la.
- **Dica do mestre**: cumpre a curva do §2 — leitura técnica, nunca conclusão de
  autoria; autosserviço na hora de acusar; o procedural sem mestre é o desmame. Ponto
  cego: fora o mestre, há pouco feedback de EXISTÊNCIA de linha investigativa (§1).
- **4 desfechos**: a válvula honesta do §2 e o júri do §5 — Impunidade (réu certo, tese
  fraca) é a separação convicção/prova de Paradise Killer, com a catarse que lá falta;
  a retentativa tarifada do tutorial, a fricção mínima do §4 na dose certa.
- **Relógio**: "degrada precisão, nunca valor" + âncora durável elimina por construção
  o soft-lock silencioso (§3) — princípio a defender contra qualquer feature futura.
- **Princípios-guia para features futuras**: knowledge-gate antes de flag-gate;
  playtesting virgem como única medida de dificuldade; caso gerado exige gramática e
  motivo humano autorais (mad-libs é o modo de falha default); um hábito novo por
  caso, com ajuda decrescente; validação parcial só com custo que desarme o chute.

## Fontes consultadas

- Mark Brown — *What Makes a Great Detective Game?* (GMTK, 2022) — https://gmtk.substack.com/p/what-makes-a-great-detective-game
- Joel Couture — *Pursuing the "Aha!" moment with... The Case of the Golden Idol* (Game Developer, 2022) — https://www.gamedeveloper.com/design/case-of-the-golden-idol
- Intermittent Mechanism — *Confirmation in The Return of Obra Dinn* (2024) — https://intermittentmechanism.blog/2024/05/21/confirmation-in-the-return-of-obra-dinn/
- Alex Beachum & Loan Verneau — *Sparking Curiosity-Driven Exploration Through Narrative in Outer Wilds* (GDC 2021) — https://media.gdcvault.com/GDC+2021/beachum_gdc_2021(1).pdf
- Michael Cook — *Generative Forensics: Procedural Generation and Information Games* (arXiv, 2020) — https://arxiv.org/abs/2004.01768
- ColePowered Games — *Shadows of Doubt DevBlog 7* (2021) — https://colepowered.com/shadows-of-doubt-devblog-7-theres-been-a-procedurally-generated-murder/ (recepção: https://gamecritics.com/ryan-nalley/shadows-of-doubt-review/)
- Rita Orlov (PostCurious) — *What Makes a Good Hint System?* — https://www.getpostcurious.com/post/what-makes-a-good-hint-system
- George Fan — *How I Got My Mom to Play Through Plants vs. Zombies* (GDC 2012) — https://www.gamedeveloper.com/design/gdc-2012-10-tutorial-tips-from-i-plants-vs-zombies-i-creator-george-fan
- Mecânicas de validação (wikis): *Sherlock Holmes: C&P* — https://bakerstreet.fandom.com/wiki/Sherlock_Holmes:_Crimes_%26_Punishments ; *Paradise Killer/Trials* — https://paradisekiller.fandom.com/wiki/Trials ; *Ace Attorney/Penalty* — https://aceattorney.fandom.com/wiki/Penalty ; *The Roottrees are Dead* — https://en.wikipedia.org/wiki/The_Roottrees_are_Dead
