# MORTEM — Relatório de Playtest Independente do *Vertical Slice*

**Data:** 18 de julho de 2026
**Build testada:** `main` @ commit `fa70f1b` (PR #60)
**Ambiente de teste:** *build de produção* (`vite build` → `vite preview`), navegador Chromium 1194 dirigido por Playwright, viewport 1440×900.
**Perspectiva:** jogador que chega ao jogo sem ler nenhum documento do repositório. Julguei o que a tela mostra, não o que o design pretende.

> **Nota de método.** Joguei a *build*, não o motor. Onde precisei de certeza sobre solubilidade (chegar a todos os finais nos casos gerados), cruzei o resultado do jogo com a bateria estática do próprio projeto (`node scripts/qa.mjs`). Sempre que uso essa fonte, digo. Tudo o mais é o que vi na tela.

---

## 1. Veredito em uma página

MORTEM é, neste *slice*, um jogo **funcional e coeso do início ao fim**, com uma direção de arte e uma prosa que raramente se veem num protótipo. Levei o caso-escola aos **quatro desfechos**; os dois modos gerados (réplica e procedural) **rodam inteiros até o Monólogo do Detetive** sem um único erro de console na *build* de produção. Não encontrei *nenhum travamento* que impedisse terminar uma partida.

O que separa o *slice* de "pronto" não são bugs — é **densidade e paridade**. O modo artesanal tem uma maquete 3D, sete localidades e um relógio que importa; os modos gerados caem numa grade 2D com quatro cartas no topo e **três quartos da tela vazios**, o que faz o mesmo motor parecer inacabado. E a tela de abertura promete uma escolha ("Quem atende ao chamado?") que hoje tem **um único nome**.

**Placar dos desfechos (caso-escola, jogados por mim na build):**

| Desfecho | Cheguei? | Como |
|---|---|---|
| Vitória Absoluta | ✅ | Cadeia completa, janela estreita (21h–22h), móbil, encenação exposta, todos os juízos certos |
| Sucesso, com Gafes | ✅ | Mesma cadeia, mas com **janela larga** (18h→08h) — o jogo detecta a imprecisão e degrada o final |
| Impunidade | ✅ | Réu certo (Silas), mas sem sustentar a cadeia (sem nexo/mecanismo cravado) |
| Erro Judiciário | ✅ | Acusei o homem errado (Walter) |

Nos modos gerados cheguei ao desfecho **Impunidade** jogando "às cegas" (réu e causa certos, sem completar as ligações). A bateria `qa.mjs` do projeto confirma que **os quatro desfechos são atingíveis na réplica e em todo o *pool* procedural** ("os 4 perfis produzem os 4 desfechos na réplica e no pool"). Ou seja: os casos gerados **são solúveis**; o que não pude verificar sozinho é o quão *deduzível* isso é para um humano (ver §7).

---

## 2. Do que o jogo trata (lido pela tela, não pelo design)

Você é um perito forense na Inglaterra de 1893. Tudo acontece sobre uma escrivaninha: localidades são cartas; clicar viaja até elas (só a viagem gasta o relógio de bolso). Você lê a cena, extrai **termos em negrito** que viram cartas de prova na mesa, interroga suspeitos em diálogo, e no fim monta uma acusação num **mural com barbante** de cinco estações (corpo → presença do réu → mentiras → móbil → juízo sobre cada inocente). "Levar a julgamento" gera o **Monólogo do Detetive**, que narra sua cadeia: cada elo ligado vira uma frase; cada buraco, uma confissão de fracasso. O jogo **nunca diz se você acertou** durante a montagem — o veredito é o monólogo.

É um jogo de *dedução*, não de *reflexo*. E a inteligência do design está aí: o motor não deduz por você. A janela da morte, a causa e o culpado são **juízo seu**; o jogo só confere se o que você afirmou bate com a verdade e se as cartas que você ligou sustentam a afirmação.

---

## 3. Modo 1 — *A Hora Emprestada* (o caso-escola, artesanal)

**O crime:** o relojoeiro Geoffrey Arthurs é achado morto; um relógio de lareira foi arrumado para marcar 08h45 e mentir sobre a hora. O culpado é Silas Crane, o primeiro-oficial, que matou por uma fraude descoberta.

### O que funciona muito bem

- **A abertura.** Seis passos de prosa (da pensão em Caulfield ao briefing) com um ritmo de romance vitoriano. "A pensão da Sra. Potts cobra dois xelins por semana e entrega dois xelins: um quarto estreito, meia vela, uma garrafa vazia..." — isto é escrita de verdade, não *flavour text* de protótipo.
- **A maquete 3D.** A vila sobe como um diorama de casinhas com etiquetas de papel pendendo de cada porta ("EXAMINAR — O Corpo — a um passo"; "INTERROGAR — A Saleta"). O relógio de bolso no canto ancora o tempo. Renderiza limpo via WebGL.
- **A perícia como gesto.** Extrair um termo abre uma **Ficha de Coleta** com a descrição completa; "Voltar o corpo", "Dar corda", "Medir temperatura" são micro-ações que rendem cartas. O corpo "fala" a leitura do legista. O perecível (rigor, temperatura) perde precisão com as horas — o jogo até avisa: *"date cedo"*.
- **Os interrogatórios.** Cada suspeito tem retrato, uma planta da relojoaria no topo, prosa de caracterização e **quatro falas em tons diferentes**. O confronto ("Por que três consertos voltaram com a sua rubrica?") fica **oculto até a prova estar na mesa** — nada de telegrafar a resposta.
- **O mural.** Cinco estações numeradas com selos de lacre e barbante; constrói-se por partes, não custa tempo, e deixa rever. É legível e tenso ao mesmo tempo.
- **Os monólogos.** São o ponto alto. A Vitória Absoluta encadeia réu → hora → causa → móbil → encenação → álibi desmentido → juízo sobre cada inocente, com frases como *"Uma testemunha jurava contra a hora que o corpo dá; o corpo prevaleceu."* Na versão *com Gafes*, o próprio detetive admite: *"A janela que afirmei ficou larga demais para acusar alguém com ela."* O jogo transforma a sua imprecisão em **texto**, não em tela de erro.

### Os quatro desfechos — como se sente chegar a cada um

- **Vitória Absoluta:** exige perfeição em cinco eixos. Satisfatório de montar, mas é o único caminho "sem asterisco".
- **Sucesso, com Gafes:** a rede mais generosa e a mais interessante de design — você prende o culpado mesmo tendo deixado "cabos mal atados". Cheguei a ela só afrouxando a janela; qualquer imperfeição (móbil errado, um juízo trocado, um vestígio de terceiro ligado à cena) leva aqui.
- **Impunidade:** você tem o nome certo e "as mãos vazias". Dói na medida certa.
- **Erro Judiciário:** acusar o inocente. Aqui o jogo **exige um passo extra** — um botão "Selar assim mesmo" — antes de deixar você cometer o erro com lacunas. Boa proteção contra o clique acidental; má notícia para quem quer errar de propósito e é barrado por um aviso.

### Atritos que senti (como jogador)

- **Meia tela vazia.** Mesmo no modo 3D, a metade inferior da escrivaninha fica preta até as cartas começarem a pousar. No começo do caso a composição parece "topo pesado".
- **Nada confirma acerto durante a investigação.** É intencional e eu gosto — mas um jogador de primeira viagem pode montar o mural inteiro sem noção de que a janela está larga demais, e só descobrir no monólogo. A seção *"ONDE A MINHA CONTA AINDA NÃO FECHA"* no fim ajuda, mas chega tarde.
- **A escolha de detetive é uma escolha de um.** "Quem atende ao chamado?" apresenta só o Dr. Harlan Blackwell. Ou é uma promessa não cumprida, ou deveria ser reescrito como "conheça o seu perito".

---

## 4. Modo 2 — *A Hora Refeita* (a réplica procedural)

**O que é:** o mesmo crime, remontado pela máquina — a vila gerada tenta recriar o caso-escola com peças próprias. Aqui a vítima é **Mary Taylor, merceeira, 31 anos**, e a ré é **Gertrude Baker**.

### Funciona?

Sim, inteiro. Joguei do convite ao monólogo. Extraí a cena, medi a temperatura, interroguei os cinco suspeitos na delegacia, montei a acusação e cheguei ao desfecho **Impunidade** (jogando com réu e causa certos, sem completar as ligações). **Zero erros de console.**

### Qualidade do conteúdo gerado — surpreendentemente alta

A prosa gerada **não parece gerada**. O exame do corpo:

> *"A morta jaz no chão do cômodo a que a vila chama depósito, vestida como andava em casa. O delegado pôs guarda à porta; até a chegada do perito, nada se tocou. Ao primeiro exame do tronco e dos membros, **Corpo Endurecido**. O exame de perto encontra a lesão que respondeu por ela: **A Ferida Incisa**. Em volta dela, **Bordas Vivas**."*

O interrogatório da criada Ada Robinson tem caracterização real:

> *"A voz sai baixa, e cada resposta espera a pergunta acabar por inteiro. Traz as datas prontas, como quem chega com a caderneta escrita."*

As cartas colhidas têm títulos coerentes e "de época": *Corpo Endurecido, Manchas Fixas, A Ferida Incisa, Bordas Vivas, O Instrumento Abandonado, A Nota por Assinar, Pegadas Rumo à Porta*. O monólogo interpola nomes e rótulos sem vazar nenhum id interno.

### Onde a réplica decepciona o olho

- **Sem a maquete 3D.** A réplica (e todo modo gerado) usa a **grade 2D**: quatro cartas de localidade num friso no topo e o resto da mesa vazio. É o mesmo motor, mas *parece* um jogo mais pobre que o tutorial. É a maior quebra de paridade do *slice*.
- **Menos localidades, menos textura.** Quatro nós (Corpo, Cena, Delegacia, Vizinhança) contra os sete do artesanal. O caso é mais "seco".

---

## 5. Modo 3 — *Um Caso da Comarca* (procedural puro)

**O que é:** "um crime que nenhuma mão escreveu" — vila, elenco e vestígios nascem da simulação. Há **20 casos pré-gerados** no banco; cada convite sorteia um. Testei `gerado_comarca_1`: vítima **Charles Harris**, réu **Maurice Martin**, morte por **estrangulamento manual (esganadura)**.

### Funciona?

Sim. Mesmo fluxo, mesma robustez, **zero erros de console**, cheguei ao monólogo (Impunidade). O motor de causa por eliminação reconhece a família certa (asfixia → esganadura pelas equimoses digitais), os cinco suspeitos têm árvores de diálogo próprias, e o monólogo se lê inteiro e coerente.

### O teste de fogo: dá para *vencer* um caso que ninguém escreveu?

- **Pelo motor: sim, comprovadamente.** A bateria do projeto verifica que "os 4 perfis produzem os 4 desfechos na réplica e no pool" e que cada caso gerado é *solúvel sob interferência* com âncora e caminho completos. A integridade dos pacotes gerados (marcadores↔cartas, sem id cru, slots) passa em 50 sementes.
- **Por um humano: é a pergunta em aberto.** Não consigo afirmar, só jogando um caso, que um jogador *deduza* o culpado sem o andaime fino do tutorial (as iscas plantadas, a cortesia das dicas, a encenação "assinada"). A prosa gerada é boa o bastante para sustentar a dedução; o risco é o caso procedural virar um exercício de *preencher as cinco estações* em vez de uma investigação com um "aha". Isto merece um playtest humano dedicado, não automatizável.

---

## 6. Achados funcionais (bugs, travas, saúde técnica)

**Nada bloqueia terminar o jogo.** Os pontos abaixo são de saúde e de experiência, não travas de progressão.

1. **[Só no servidor de desenvolvimento] Falha de carregamento do 3D.** Rodando via `npm run dev`, o Vite reotimizou dependências no meio da sessão e devolveu `504 (Outdated Optimize Dep)` ao buscar o *chunk* lazy `DioramaVila.jsx`/`CorpoCanvas.jsx`. A maquete 3D não subiu e o `Cena3DBoundary` capturou o erro e **caiu na grade 2D sem quebrar a partida** — que é o comportamento correto. **Na *build* de produção o problema não ocorre: zero erros.** Vale garantir que o dev-server não assuste quem for desenvolver (pré-otimizar deps ou fixar o *optimizeDeps*).
2. **Robustez do *error boundary* confirmada.** Quando o 3D falhou, o jogo seguiu jogável em 2D. Isso é um acerto de engenharia digno de nota.
3. **Aviso de *bundle*.** O *chunk* principal tem ~1,23 MB (e o `react-three-fiber`, ~820 KB) minificados. Não trava nada, mas o próprio `vite build` recomenda *code-splitting*. Em conexão lenta, o primeiro carregamento pesa.
4. **Captura de tela sobre overlays animados.** Detalhe de teste, não do jogo: alguns overlays com transição de *fade* prolongada seguram uma captura automatizada por vários segundos — sintoma de animações que não "assentam". Sem impacto para o jogador humano.
5. **Zero vazamento de dados internos.** Em todas as rotas, nenhum id cru (`gen_…`, `buril_gravador`, `NaN`, `Infinity`) apareceu na tela. Interpolações `{detective.campo}`/`{g:…}` sempre resolvidas.

---

## 7. Achados qualitativos

**Pontos altos**
- Escrita de época consistente e observacional, tanto no artesanal quanto no gerado. É o maior ativo do jogo.
- O monólogo como veredito narrativo é um design memorável: transforma imprecisão em prosa, não em "game over".
- A gramática do mural (afirmar + sustentar puxando barbante) é elegante e ensina dedução de verdade.
- Os quatro desfechos têm identidades emocionais distintas e legíveis.

**Riscos de experiência**
- **Paridade artesanal × gerado.** O abismo visual (3D vs. grade 2D com meia tela vazia) faz os modos gerados — que são o *futuro* do jogo — parecerem a versão pobre.
- **Curva de leitura.** O jogo não segura a mão durante a montagem. No tutorial, tudo bem (é caso-escola). No procedural, sem o mesmo andaime, o jogador pode se perder entre *investigar* e *deduzir*.
- **A promessa de escolha (detetive único).** Frustra a expectativa criada pela própria tela.
- **Feedback tardio.** A ausência total de confirmação durante a investigação é uma decisão de design defensável, mas o único *feedback* corretivo ("ONDE A MINHA CONTA AINDA NÃO FECHA") só aparece depois do julgamento.

---

## 8. Sugestões de melhorias futuras (priorizadas)

**Prioridade alta — fechar a paridade e a promessa**

1. **Dar aos modos gerados a dignidade visual do tutorial.** Ou estender a maquete 3D à vila procedural, ou redesenhar a grade 2D para ocupar a tela (cartas maiores, uma "mesa" com textura, o relógio e a caderneta preenchendo o vazio inferior). Hoje três quartos da tela ficam pretos.
2. **Resolver a escolha de detetive.** Entregar de fato os peritos alternativos que a mecânica sugere (o "frio e metódico" pede um contraponto — um impulsivo, um empático) **ou** reescrever a tela para "conheça o Dr. Blackwell" e remover a moldura de escolha.
3. **Playtest humano de solubilidade no procedural.** A prova de que a máquina *pode* resolver existe; falta a prova de que uma *pessoa* resolve com prazer. Recrutar jogadores para 3–5 casos do *pool* e medir taxa de Vitória/Gafes sem consulta a gabarito.

**Prioridade média — suavizar a curva sem trair o design**

4. **Um "aha" garantido por caso gerado.** Assegurar que todo caso do *pool* tenha ao menos um elo de dedução saliente (uma encenação assinada, uma mentira que desmorona com uma prova específica) — para o procedural não virar preenchimento de formulário.
5. **Feedback intermediário opcional e diegético.** Sem revelar a solução: por exemplo, a caderneta poderia refletir a *confiança* do perito ("a janela ainda me parece frouxa") como observação de personagem, não como validação mecânica. Deixar ligável/desligável (o "modo purista" já existe como precedente).
6. **Onboarding do procedural.** O tutorial ensina os gestos; o primeiro caso da comarca poderia ter uma linha de convite que reforça "aqui ninguém te guia" — administrar a expectativa.

**Prioridade baixa — polimento técnico**

7. **Code-splitting do *bundle*** (separar `three`/`react-three-fiber` em *chunk* próprio e carregá-lo só no modo 3D) para aliviar o primeiro carregamento, sobretudo porque os modos gerados nem usam WebGL.
8. **Blindar o dev-server** contra o `504 Outdated Optimize Dep` (fixar `optimizeDeps.include` para os módulos 3D lazy) — não afeta o jogador, mas atrapalha quem desenvolve.
9. **Assentar as animações de overlay** (garantir que fades terminem em tempo previsível) — melhora a percepção de responsividade e destrava automação de QA visual.

---

## 9. Conclusão

O *vertical slice* faz o que um *vertical slice* precisa fazer: prova que a ideia **funciona e é boa**. A mecânica de acusar-e-sustentar com veredito narrativo é original e satisfatória; a prosa — inclusive a gerada — está acima do que se espera de um protótipo; e a engenharia é sólida o suficiente para cair de pé quando o 3D falha. Os quatro desfechos estão todos ao alcance e cada um se sente diferente.

O trabalho que resta não é consertar o que quebrou — quase nada quebrou. É **elevar os modos gerados ao nível do artesanal** (visual e de guia ao jogador) e **cumprir a promessa da tela de abertura**. Feche essa distância e o que hoje é um *slice* impressionante vira um jogo que se sustenta sozinho — inclusive nos casos que nenhuma mão escreveu.

---

*Relatório produzido a partir de partidas reais na build de produção; solubilidade dos casos gerados cruzada com a bateria estática `scripts/qa.mjs` do próprio repositório.*
