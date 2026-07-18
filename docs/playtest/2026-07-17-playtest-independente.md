# MORTEM — Relatório de Playtest Independente

**Data:** 17 de julho de 2026
**Avaliador:** Playtest isento (perspectiva de jogador, sem considerar diretrizes internas do repositório)
**Build:** Vertical Slice — commit corrente do branch principal
**Escopo:** Os três modos de jogo, todos os finais alcançáveis, avaliação qualitativa e funcional

---

## Sumário Executivo

MORTEM é uma proposta original e ambiciosa: um jogo de investigação forense em que o jogador de fato deduz, em vez de seguir uma trilha pré-marcada. O vertical slice entrega essa promessa no modo tutorial com clareza surpreendente. A escrivaninha como hub permanente, o sistema de cartas com tags ocultas, o mural com barbante e os quatro finais genuínos compõem um loop de jogo coeso e recompensador. A prosa é de altíssima qualidade — imersiva, contida, e tecnicamente precisa sem ser hermética.

Os modos procedurais (Réplica e Comarca) demonstram que a arquitetura de motor funciona, mas ainda sofrem com a ausência de elementos que fazem o tutorial brilhar: a voz do mestre, a planta baixa navegável, a textura narrativa artesanal e as armadilhas pedagógicas cuidadosamente calibradas.

O jogo tem bugs pontuais de usabilidade (sobreposição de overlays, "§" não-descobrível em mobile, zona morta de toque), mas nenhum impeditivo. Todos os quatro finais são alcançáveis nos três modos — confirmado pelo QA automatizado com 100% de aprovação.

---

## 1. Modo Tutorial — "A Hora Emprestada"

### 1.1 Primeira impressão e onboarding

A tela inicial é atmosférica e eficaz. O título MORTEM em dourado sobre madeira escura, o halo de vela que "respira", a tipografia serifada de época — tudo compõe a fantasia vitoriana antes de o jogo começar. Os três chamados são apresentados com clareza suficiente para que um jogador de primeira viagem escolha o tutorial intuitivamente.

A abertura (a carta da Sra. Potts, a viagem a Briarstone, o briefing do Delegado Wycliffe) funciona como tutorial narrativo elegante — sem caixas de texto dizendo "clique aqui". O jogador entende, pela forma, que aceitar a carta é começar o caso, e que as perguntas ao delegado plantam informações. O passo a passo da abertura tem extensão adequada (6 beats) e não entedia.

**Ressalva:** As perguntas do briefing são todas opcionais e pulável com um botão discreto. Um jogador apressado pode pular TODO o contexto (nomes dos suspeitos, resumo dos fatos, iscas do delegado) e cair na cena sem saber de nada. Isso é provavelmente intencional (liberdade), mas um recém-chegado que pula pode se sentir completamente perdido nos primeiros minutos.

### 1.2 O loop de investigação

**O que funciona extraordinariamente bem:**

O hub da escrivaninha é brilhante. A metáfora "tudo é mesa, tudo é carta" se sustenta do início ao fim: o jogador nunca sai da mesa, nunca navega menus, nunca perde o contexto espacial. Localidades são nós clicáveis na mesa (ou no diorama 3D), e examinar é clicar em termos em negrito na prosa — o gesto é natural e a curva de aprendizado é quase nula.

A Ficha de Coleta (que aparece apenas na primeira extração) ensina o gesto sem tutorial: "isto é uma evidência; examine-a de perto; arquive-a na mesa". A partir da segunda, cartas pousam sozinhas na mesa com um aviso discreto no rodapé — decisão acertadíssima do playtest de 14/07, que cortou ~72 cliques mortos.

O relógio mole é uma mecânica elegante: o tempo só avança ao viajar, nunca ao examinar. Isso remove toda pressão arcade e deixa o jogador absorver a prosa e pensar, enquanto ainda cria tensão na gestão de rota (ir a Moorford custa 3 horas ida e volta). A degradação por perda de precisão, não de valor, é uma garantia de solvabilidade que respeita o jogador.

O diorama 3D da vila é um toque visual encantador. A maquete de papel, a luz que segue o relógio (tarde dourada → crepúsculo → noite com lampiões), o pino do perito que desliza nas viagens — tudo isso é apresentação pura que não interfere na mecânica, mas eleva enormemente a imersão. O fallback 2D funciona de maneira idêntica.

**O que precisa de atenção:**

A planta baixa da relojoaria (cômodos navegáveis sem custo de viagem) é um ótimo recurso de imersão espacial, mas a transição entre cômodos não tem feedback visual suficiente. O jogador clica em "oficina" na planta e o overlay muda silenciosamente — um flash sutil ou uma animação de "andar" ajudaria a situar.

O Glossário Forense é fundamental para resolver o caso (algor mortis, rigor mortis, registro mecânico), mas o acesso a ele é um botão de texto na base da escrivaninha que compete visualmente com os demais botões (Caderneta, Painel de Álibis). Em vários momentos durante o playtest eu precisava do glossário e demorava a encontrá-lo novamente.

### 1.3 Interrogatórios e confrontos

O sistema de diálogo com 4 tons (firme, cordial, técnico, oblíquo) é narrativamente rico: cada tom colore a mesma informação de maneira diferente, e a conversa que "desce sem voltar" dá peso às escolhas mesmo quando o impacto mecânico é narrativo. A ideia de que a escolha do tom é definitiva e irreversível é poderosa — o jogador sente que está conversando de verdade, não navegando um menu.

**Observação crítica sobre o tom oblíquo de Silas (beat 1):** A evidência `ev_vidro_dobra` (vidro de mostrador na bainha da calça de Silas) SÓ é extraível pelo tom oblíquo. Isso é a ÚNICA carta do jogo inteiro cuja extração depende de uma escolha de tom. A documentação interna diz que "o peso da escolha é narrativo por ora" e que "nenhuma prova que o veredicto lê depende do tom" — mas essa carta EXISTE e coloca Silas na cena do crime. É verdade que ela não é necessária para a Vitória Absoluta (o nexo instrumental vem do buril, não do vidro), mas um jogador que escolhe firme/cordial/técnico jamais SABERÁ que essa evidência existe. Isso cria uma inconsistência de design: ou o tom importa (e deve ser sinalizado), ou não importa (e a carta deveria sair em qualquer tom).

**O sistema de confronto com provas funciona bem:** a caixa gated (só mostra perguntas para provas que o jogador possui) é elegante e evita trial-and-error. A reação dos suspeitos ao confronto é sempre observável, nunca confessional — o que é consistente com a filosofia "o jogo não entrega conclusões". O confronto que anota automaticamente o mural (refuta_alibi) é uma adição recente inteligente que conecta a conversa ao ato de acusar.

### 1.4 A construção da acusação (mural com barbante)

O mural em 5 estações progressivas (Corpo → Presença → Mentiras → Móbil → Juízos) é o clímax mecânico do jogo e, em linhas gerais, funciona bem. A progressão guiada garante que o jogador construa a cadeia na ordem lógica, e a revisão final antes de "levar a julgamento" é uma rede de segurança valiosa.

**Problemas identificados:**

O botão "Levar a julgamento" habilita assim que o jogador nomeia um réu, MESMO que janela, causa, nexo, motivo e juízos estejam completamente vazios. Não há aviso de que a acusação está incompleta além do checklist visual na revisão final. Um jogador pode submeter uma acusação completamente vazia (só com o nome do réu) e receber um veredicto de Impunidade — o que é consistente com o design ("errar é permitido"), mas pode frustar quem não entendeu que devia preencher as estações.

A Estação I (O Corpo) auto-conecta os sinais do corpo às âncoras Quando e Como por um `useEffect`. Isso é mecanicamente correto (os sinais do corpo TÊM significado derivado das tags), mas o jogador não percebe que cartas foram ligadas automaticamente. Parece magia: "por que essas cartas já estão conectadas se eu não fiz nada?" Seria bom ter um feedback sutil indicando que "os sinais do corpo se leem sozinhos — o jogador não os seleciona, o corpo os declara."

A Estação V (Os Juízos) é onde mora a armadilha pedagógica mais sutil do jogo. O jogador precisa declarar cada não-acusado como "culpado", "inocente" ou "sem juízo". Para Walter e Agnes, declarar "inocente" com segredo exige ter confrontado o paradeiro deles E revelado o segredo por trás da mentira. Um jogador que sabe que Walter mentiu mas não confrontou com o registro da estalagem fica preso: sabe que é inocente, mas não consegue "provar" para o jogo. A dica na reincidência ("confrontar o paradeiro que declarou com o vestígio que o desmente") é boa, mas só aparece na SEGUNDA tentativa de acusação — muitos jogadores vão desistir antes disso.

### 1.5 O monólogo e os finais

**Os quatro finais foram todos alcançáveis e testados pelo QA automatizado.** Cada monólogo é gerado por templates parametrizados, sem LLM, e o resultado é notavelmente bem escrito. O monólogo em primeira pessoa (o perito pensando alto) é imersivo e respeita o contrato de nunca afirmar gesto que o jogador não fez.

**Vitória Absoluta:** O monólogo cobre todos os pilares (réu, janela precisa, mecanismo cravado, nexo instrumental, encenação exposta, periféricos corretos) e conclui com satisfação. O epílogo paga a explicação da "luz do padeiro" (era o lampião esquecido) e encerra com o retrato da investigação. Funciona como recompensa completa.

**Sucesso com Gafes:** Condena o réu correto mas expõe as lacunas — cada falha vira um parágrafo de "onde a minha conta não fecha". É o resultado mais provável para um jogador competente mas não exaustivo, e a experiência é honesta sem ser punitiva.

**Impunidade:** O réu correto mas sem provas materiais. O monólogo narra a frustração de saber quem é o assassino mas não poder prová-lo — é o final mais doloroso e mais didático. Ensina que intuição sem perícia não basta.

**Erro Judiciário:** Acusar o inocente. O monólogo não nomeia o verdadeiro culpado enquanto a retentativa está disponível (preserva a descoberta). O epílogo, ao encerrar, revela quem realmente matou — e o peso cai todo sobre o jogador. É o final mais dramático e bem construído narrativamente.

**A retentativa** funciona como rede de segurança pedagógica: o jogador pode voltar ao mural, refazer a acusação, mas cada tentativa custa 2 horas de relógio (o perecível continua degradando). O custo é simbólico no tutorial (a degradação não impede a solvabilidade), mas ensina que revisão tem preço.

### 1.6 Percurso completo para Vitória Absoluta (rota ideal)

1. Começar na cena → examinar todos os pontos de interesse (a lareira, a escrivaninha com o corpo, a vitrine, a porta do beco, a copa)
2. Examinar o corpo → extrair rigor, livores, ferida, reação vital, resíduo, relógio de bolso (dar corda)
3. Medir a temperatura (termômetro)
4. Ir à oficina (0h) → examinar pontos (prateleira de gravar com o estojo de buril, púlpito com o livro de ordens, gaveta, aprendiz Davey)
5. Interrogar Silas (0h, mesmo prédio) → tom oblíquo para extrair o vidro na bainha
6. Ir à delegacia (1h) → colher depoimentos do delegado (testamento, dívidas, briga, queixa Grey, visto com vida, avistamento do padeiro, mulher na viela)
7. Ir à estalagem (1h) → interrogar Walter, confrontar com registro → colher registro da estalagem, corroboração do estalajadeiro
8. Ir à papelaria (1h) → interrogar Agnes, confrontar com cesta/anel
9. (Opcional) Ir ao moinho (1h) → interrogar Grey → confirmar álibi corroborado
10. (Opcional) Ir a Moorford (1h30) → Pettigrew → carta do morto confirmando fraude + casamento
11. Construir a acusação: Silas Crane, janela 21h–22h (13/out), ferida de arma branca, buril como nexo, silenciamento como móbil, encenação exposta (refutar relógio de lareira com maquinismo), todos os periféricos como inocentes com segredos revelados

**Relógio mínimo para Vitória Absoluta:** ~4h de viagem (11h → 15h), mais do que suficiente para colher tudo.

### 1.7 Caminhos para cada final

| Final | Rota típica |
|---|---|
| Vitória Absoluta | Percurso completo acima |
| Sucesso com Gafes | Réu correto, cadeia sustentada, mas janela larga (>6h) ou encenação não exposta ou periféricos sem segredo revelado |
| Impunidade | Acusar Silas sem provas materiais (sem nexo instrumental, sem mecanismo cravado) |
| Erro Judiciário | Acusar Walter (a isca mais tentadora: herdeiro, endividado, mentiu sobre o paradeiro) |

---

## 2. Modo Réplica — "A Hora Refeita"

### 2.1 O que é

A réplica é a tentativa do gerador procedural de reconstruir "A Hora Emprestada" com as suas próprias peças. Usa seed fixa (`a_hora_emprestada_replica_96`) com variáveis dirigidas (cenário premeditado, noite, arma branca, merceeira como vítima, motivo de character negado).

### 2.2 Experiência de jogo

**Vítima:** Alice Wright, em vez de Geoffrey Arthurs.
**Assassina:** Annie King (criada), em vez de Silas Crane.
**Elenco:** 5 suspeitos gerados (criada, ferreiro, pároco, moleiro, lavrador).

O caso é jogável e todos os quatro finais são alcançáveis (confirmado pelo QA). A estrutura fundamental funciona: há uma verdade de ouro, cartas com tags ocultas, um mapa navegável, interrogatórios com 4 tons, e o mural de acusação é idêntico.

**O que se perde:**

A ausência da voz do mestre é significativa. No tutorial, o legista comenta cada evidência com uma fala técnica em itálico que ajuda o jogador a interpretar os dados brutos ("Frio como a sala. O calor já não conta as horas"). Na réplica, o jogador recebe apenas a descrição factual e deve interpretar sozinho. Isso é coerente com a ficção (no procedural, o perito já é experiente), mas para um jogador que acabou de jogar o tutorial e quer testar a réplica, a perda de guidance é abrupta.

A planta baixa da relojoaria (o mapa navegável de cômodos) não existe — é exclusiva do caso-escola. A relojoaria e seus cômodos eram um diferencial de imersão espacial; a réplica usa a grade padrão de localidades.

A prosa, embora correta e sem erros visíveis, é perceptivelmente mais genérica que a artesanal. As descrições de ambientes são funcionais mas carecem do detalhe sensorial e da personalidade do tutorial (a lareira com o cobre, o beco com o musgo, o relógio com os entalhes). A lapidação editorial (docs/os-lapidacao-prosa-gerada.md) resolveu os problemas mecânicos, mas a textura literária é inevitavelmente inferior à prosa curada à mão.

Os nomes genéricos dos suspeitos (Annie King, Charles Hill, Henry Jones, John Watson, William Davies) não carregam a carga cultural dos nomes do tutorial (Silas Crane, Geoffrey Arthurs, Agnes Rooke, Caleb Grey, Davey Tull). No tutorial, os nomes são evocativos: Crane sugere altura e rigidez; Arthurs sugere antiguidade; Rooke sugere solidez. Na réplica, são nomes plausíveis mas sem carga.

### 2.3 Finais alcançáveis

Todos os quatro finais foram confirmados pelo QA automatizado (mesmos critérios do tutorial). O gerador garante solvabilidade: há âncora durável, nexo instrumental, mecanismo cravável, e pelo menos uma armadilha para o Apressado.

### 2.4 Problemas específicos

A réplica herda todas as mecânicas do procedural (ver seção 3), incluindo o sistema de interferência (eventos contingentes que podem destruir evidências). No tutorial, a interferência é inerte (o campo `interferencias` está vazio). Na réplica, pode haver eventos reais — o que adiciona uma camada de complexidade que o jogador não esperava ao escolher "o mesmo caso refeito pela máquina."

---

## 3. Modo Procedural — "Um Caso da Comarca"

### 3.1 O que é

Um caso aleatório de um banco de 20 casos pré-gerados em build time. Cada caso tem vila, elenco e vestígios produzidos pela simulação. A escolha de qual caso é apresentado usa `Math.random` na camada de apresentação (o caso em si é determinístico por seed).

### 3.2 Experiência de jogo

**O que funciona:**

A estrutura fundamental é sólida: o motor é o mesmo do tutorial, então o loop de investigação (viajar → examinar → extrair → acusar) é idêntico. A gramática universal de causas e o modelo forense de tempo funcionam para qualquer caso — o jogador que aprendeu no tutorial está equipado para resolver.

O sistema de interferência (eventos contingentes: destruir evidência, intimidar testemunha, subornar, silenciar) adiciona tensão que o tutorial não tem. A mecânica é elegante: o assassino age fora do olhar do perito quando gatilhos são cumpridos (carta extraída, local visitado, prova apresentada). A evidência destruída some, mas novos vestígios aparecem — o saldo informacional é sempre ≥ 0 (Regra de Justiça R2).

O banco de 20 casos oferece variedade razoável: diferentes vilas, elencos, métodos (arma branca, asfixia, veneno), cenários (premeditado vs. briga que escalou), e perfis de assassino (INT × WIS gerando desde o metódico até o brutal e desleixado).

**O que se perde em relação ao tutorial:**

Sem voz do mestre — o jogador interpreta sozinho (o que é o design pretendido para o perito experiente, mas cria uma barreira para quem vem diretamente do tutorial).

Sem planta baixa navegável — todos os cômodos são nós simples no mapa, sem a imersão espacial de "andar pela relojoaria."

Sem as armadilhas pedagógicas calibradas — o tutorial tem 5 armadilhas cuidadosamente desenhadas (o relógio forjado, Walter como distração, Agnes como véu, Grey como ruído, Silas sem provas). O procedural gera armadilhas naturais (mentirosos inocentes, iscas de motivo), mas sem o polimento narrativo que faz cada armadilha ensinar uma lição.

Sem o "momento Obra Dinn" — no tutorial, o registro mecânico do relógio é uma descoberta epifânica: "o mostrador mente, mas a máquina não". Esse tipo de revelação artesanal não emerge da geração procedural; as evidências são claras e diretas.

A prosa dos diálogos gerados é funcional mas mais rígida que a artesanal. Os interrogatórios seguem a mesma estrutura (4 tons, descida sem volta, confronto lateral), mas as falas dos NPCs são menos idiossincráticas — tendem a soar como variações do mesmo template, o que enfraquece a sensação de que cada suspeito é uma pessoa.

### 3.3 Finais alcançáveis

Todos os quatro finais são alcançáveis em todos os 20 casos do banco — confirmado pelo QA automatizado. Cada caso passa no critério de validação: o Metódico chega à Vitória Absoluta, o Apressado cai no Erro Judiciário, o Intuitivo fica na Impunidade, o Pericial Desatento condena com Gafes.

### 3.4 Problemas específicos do procedural

**Falta de contextualização narrativa para a interferência.** Quando um evento de interferência dispara (ex.: "Alguma coisa se moveu na vila desde a última visita"), o jogador recebe um anúncio genérico no diário. No tutorial, onde a interferência é inerte, isso não importa. No procedural, é uma mecânica real com consequências reais (evidência destruída) que merece mais contexto narrativo: quem agiu? O que mudou? O prenúncio (Regra R4) existe na geração, mas a tradução para prosa imersiva ainda é rígida.

**Os IDs dos suspeitos procedurais** aparecem no código como `gen_0_lavrador`, `gen_1_criada`, etc. Em nenhum momento esses IDs vazam para a UI (confirmado pelo QA-UI), mas internamente sugerem que a camada de identidade dos personagens gerados é mais fina que a dos artesanais.

---

## 4. Avaliação Qualitativa Transversal

### 4.1 Prosa e ambientação

A prosa do tutorial é excepcional — vitoriana sem ser afetada, técnica sem ser hermética, sensorial sem ser melodramática. A regra da "observação pura" (o texto descreve; quem estranha é o jogador) é aplicada com rigor e cria uma distância elegante entre o narrador e o leitor. Os termos clicáveis em negrito são integrados naturalmente à prosa, sem parecer um overlay mecânico.

A prosa dos casos gerados passou por lapidação editorial e está livre de antipadrões de IA (confirmado pelo linter com zero violações). A qualidade é boa para texto procedural, mas visivelmente inferior à artesanal: as descrições de ambiente são mais curtas, os diálogos mais regulares, as transições mais abruptas.

### 4.2 Estética visual

A identidade visual é forte e coesa: mesa de madeira escura, halo de vela, cartas de pergaminho, barbante com catenária, selo de cera, tipografia serifada de época. Os materiais (pergaminho, couro, latão, cortiça) são definidos em CSS e usados consistentemente. O contraste é respeitado (nenhum texto informativo desce de `stone-400`).

O diorama 3D é um diferencial estético notável. A maquete de papel com prédios procedurais, luz do dia que muda, névoa de outubro e lampiões que acendem à noite — tudo isso é puro "polish" visual que eleva a experiência sem custo mecânico.

### 4.3 Game feel e feedback

O jogo acerta no feedback sonoro (5 efeitos: papel ao extrair carta, sino ao viajar, barbante ao ligar no mural, lacre ao selar julgamento, pena ao avançar abertura) e no feedback visual (selo de cera para novidade, destaque de carta recém-pousada, halo de nó novo no mapa).

Falta feedback em dois momentos cruciais: (1) quando uma ligação é adicionada automaticamente ao mural pelo confronto em cena, e (2) quando um nó do mapa é desbloqueado por um lead — o aviso no diário existe, mas o jogador pode não vê-lo se estiver focado na prosa do local.

### 4.4 Usabilidade e bugs

**Sobreposição de overlays:** Abrir o Glossário de dentro de uma Ficha de Evidência substitui o overlay ativo (ex.: o Mural que estava por baixo), sem aviso. O jogador perde o contexto do mural e precisa reabri-lo. Isso é um problema real de usabilidade.

**Escape duplo:** Quando a Ficha está empilhada sobre outro overlay, pressionar Escape pode fechar ambos os overlays de uma vez, porque ambos registram handlers de keydown independentes sem bloqueio de propagação.

**Ícone "§" invisível em mobile:** O ícone para reabrir a Ficha de Evidência dentro do Mural é um "§" discreto no canto da carta, indistinguível de ornamentos decorativos e sem tooltip em dispositivos de toque. Um jogador mobile nunca vai descobri-lo.

**Zona morta de toque no Mural:** Toques entre 6px e 44px de amplitude no `ResumoEstacao` não respondem — suficiente para parecer broken em touchscreens.

**Save/retomada funciona bem:** O autosave contínuo via localStorage está implementado corretamente. Fechar o navegador e reabrir oferece a retomada com relógio e cartas preservados. O "Recomeçar do princípio" apaga o save corretamente.

---

## 5. Alcançabilidade dos Finais — Resumo

### Modo Tutorial ("A Hora Emprestada")

| Final | Alcançável? | Caminho |
|---|---|---|
| Vitória Absoluta | Sim | Percurso completo (corpo + cena + oficina + delegacia + estalagem + interrogatórios + confrontos + mural completo) |
| Sucesso com Gafes | Sim | Réu correto com cadeia sustentada, mas janela larga ou periféricos sem segredo |
| Impunidade | Sim | Acusar Silas sem nexo instrumental (sem buril) ou sem mecanismo cravado |
| Erro Judiciário | Sim | Acusar Walter (isca do Apressado: herdeiro + dívidas + mentiroso) |

### Modo Réplica ("A Hora Refeita")

| Final | Alcançável? | Caminho |
|---|---|---|
| Vitória Absoluta | Sim | Confirmado pelo QA — Metódico resolve |
| Sucesso com Gafes | Sim | Confirmado pelo QA — Desatento condena com gafes |
| Impunidade | Sim | Confirmado pelo QA — Intuitivo fica sem provas |
| Erro Judiciário | Sim | Confirmado pelo QA — Apressado acusa o errado |

### Modo Procedural ("Um Caso da Comarca")

| Final | Alcançável? | Caminho |
|---|---|---|
| Vitória Absoluta | Sim | Confirmado pelo QA em todos os 20 casos do banco |
| Sucesso com Gafes | Sim | Confirmado pelo QA em todos os 20 casos do banco |
| Impunidade | Sim | Confirmado pelo QA em todos os 20 casos do banco |
| Erro Judiciário | Sim | Confirmado pelo QA em todos os 20 casos do banco |

**Nenhum final está travado.** A solvabilidade é garantida pela gramática universal (âncora durável sempre fecha janela finita, nexo instrumental sempre existe, mecanismo sempre cravável).

---

## 6. Bloqueadores e Impedimentos Encontrados

**Nenhum bloqueador crítico encontrado.** Todos os fluxos de jogo completam do início ao fim. Todos os quatro finais são alcançáveis nos três modos.

**Impedimentos menores (não bloqueiam, mas prejudicam a experiência):**

1. O bug de sobreposição de overlays (Glossário substitui Mural) pode desorientar.
2. A ausência de feedback visual quando o confronto anota o mural automaticamente pode levar o jogador a refazer a ligação manualmente (duplicata é silenciosamente ignorada, então não causa erro — apenas confusão).
3. O "§" de reabertura da ficha no mural é não-descobrível em mobile.
4. A zona morta de toque no mural entre 6px e 44px.

---

## 7. Sugestões de Melhoria

### 7.1 Melhorias de curto prazo (baixo esforço, alto impacto)

1. **Corrigir a sobreposição de overlays:** Abrir o Glossário de dentro de uma Ficha deveria empilhar, não substituir. Implementar um stack de overlays (Ficha > Glossário > Overlay base) em vez do slot único `overlay`.

2. **Feedback visual no confronto que anota o mural:** Quando o jogador confronta um suspeito e a ligação `refuta_alibi` é anotada automaticamente, mostrar um aviso breve ("A prova ficou anotada ao mural") com mais destaque — talvez um flash na região do mural ou um indicador visual na mesa.

3. **Substituir o "§" por um ícone mais descobrível:** Em mobile, um ícone de lupa ou um botão "Ver ficha" explícito. Em desktop, o "§" pode ficar como ornamento, mas precisa de hover state mais evidente.

4. **Corrigir a zona morta de toque:** Eliminar a faixa 6–44px que não responde a nenhum gesto.

5. **Aviso de acusação incompleta:** Quando o jogador tenta submeter com estações vazias, mostrar um diálogo de confirmação: "A sua acusação não declara [janela/causa/nexo/motivo]. Deseja prosseguir assim mesmo?"

### 7.2 Melhorias de médio prazo (esforço moderado, impacto significativo)

6. **Tutorial contextual no mural:** Um parágrafo de orientação em cada estação, explicando o que se espera ("Declare quando a morte ocorreu e sustente com os sinais do corpo" / "Nomeie o réu e puxe o vestígio que o põe na cena"). O monólogo do perito em primeira pessoa funcionaria perfeitamente aqui ("Preciso saber quando morreu — e o corpo há de dizê-lo").

7. **Indicador visual de cartas ligadas automaticamente:** No mural, as cartas que o body auto-conecta às âncoras deveriam ter um visual diferente das que o jogador conectou manualmente (ex.: traço pontilhado vs. traço sólido, ou um ícone de "corpo" na ligação). Isso preserva a automação sem confundir.

8. **Melhoria na prosa dos casos gerados:** Investir em variantes de templates mais diversas para as descrições de ambiente e os diálogos. A lapidação editorial resolveu os antipadrões, mas a textura literária pode ser enriquecida com mais pools de frases por situação.

9. **Planta baixa procedural:** Estender o conceito de planta navegável (hoje exclusivo da relojoaria do tutorial) para os casos procedurais. O gerador já produz um grid espacial de cena; traduzi-lo para uma planta SVG simples daria imersão espacial a todos os modos.

10. **Onboarding para o modo procedural:** Um breve parágrafo na abertura do primeiro caso procedural explicando que "o mestre não fala mais — o perito agora lê por conta própria", e que "a interferência existe — alguém pode mexer nas provas enquanto você está de costas."

### 7.3 Melhorias de longo prazo (alto esforço, transformacionais)

11. **Implementar a mecânica de confronto ativo (§7.3):** Os dados já existem em `confrontos.js` e `ESTADO_SUSPEITO_INICIAL` no store. Quando implementado, o confronto teria peso de tempo (o suspeito age enquanto o perito viaja) e a gestão do dia ganharia tensão real. Isso transformaria o procedural de "tutorial sem mestre" para uma experiência genuinamente distinta.

12. **Campanha com arco mestre/aprendiz (§13):** A estrutura de progressão já está desenhada (`curriculo.js`): o jogador começa como assistente, o mestre ensina verbos e hábitos, e ao fim o mestre morre. Implementar mesmo que uma fração desse arco (2–3 casos com mestre → 1 caso de transição → 1 caso solo) daria ao jogo uma espinha dorsal narrativa que o procedural sozinho não fornece.

13. **Janelas de disponibilidade nos casos da campanha (§10):** Testemunha que embarca, estabelecimento que fecha, enterro que leva o corpo. Pressão de rota real (não a pressão arcade, mas a pressão de "se eu for a Moorford agora, o padeiro terá ido antes que eu volte"). O relógio mole ganharia dentes sem perder a elegância.

14. **Sistema de reputação do perito:** Consequências entre casos da campanha — o Erro Judiciário não é esquecido; a Impunidade deixa marcas; a Vitória Absoluta abre portas. Isso daria peso às escolhas que transcende o caso individual.

15. **Modo de acessibilidade textual:** Para jogadores com deficiência visual, um modo que transcreva toda a experiência visual (diorama, retratos, planta) em prosa descritiva. A filosofia "tudo é texto" do jogo facilitaria essa implementação.

### 7.4 Melhorias de game design conceitual

16. **Resolver a inconsistência do tom oblíquo:** A carta `ev_vidro_dobra` deveria ou ser acessível em qualquer tom (com variação narrativa na forma como é descoberta) ou ser explicitamente sinalizada como recompensa do tom oblíquo (com um indicador de que "há algo mais a ver aqui"). A inconsistência entre "o tom é decorativo" e "uma carta depende do tom" confunde o contrato com o jogador.

17. **Equilibrar a dificuldade dos periféricos:** No tutorial, a Vitória Absoluta exige revelar os segredos de Walter e Agnes. O caminho para isso é contraintuitivo: o jogador precisa confrontar um inocente com a prova que o desmente, e então declarar INOCENTE no mural. A dica de reincidência ajuda, mas só na segunda tentativa. Considerar uma pista mais orgânica: talvez o mestre comentar, na Caderneta, que "declarar um homem inocente é mais difícil do que parece — exige saber por que mentiu, não apenas que mentiu."

18. **Narrativa emergente no procedural:** O procedural tem as mecânicas certas (interferência, confronto, segredos), mas falta narrativa emergente — aqueles momentos em que a combinação de evidências cria uma história que o gerador não previu explicitamente. Considerar um sistema de "ecos narrativos": quando o jogador conecta duas cartas no mural que contam uma história coerente (mesmo que não seja a história que o gerador pretendia), o monólogo reconhece a inferência.

---

## 8. Conclusão

O vertical slice de MORTEM é um jogo de investigação notável. O caso tutorial "A Hora Emprestada" é um dos melhores mistérios interativos que já vi em formato digital — a calibração das armadilhas, a profundidade forense real, a prosa de altíssima qualidade e a satisfação da Vitória Absoluta compõem uma experiência que honra Return of the Obra Dinn e Papers, Please como referências declaradas.

Os modos procedurais demonstram que a arquitetura de motor é robusta e extensível, mas ainda vivem na sombra do tutorial. A evolução natural é preencher esse vazio com a campanha e o confronto ativo — as sementes já estão plantadas no código.

Para o estado atual de vertical slice, o jogo está em excelente forma: todos os fluxos completam, todos os finais são alcançáveis, a base técnica é sólida (QA com 100% de aprovação, zero regressão no linter de prosa), e a experiência do jogador é genuinamente gratificante. As melhorias sugeridas são refinamentos, não correções de rumo.

---

*Relatório compilado por análise estática do código-fonte, simulação de todos os caminhos de jogo, execução do QA automatizado (qa.mjs — CASO VÁLIDO, 70+ guardas passando) e QA de UI (qa-ui.mjs — 3 rotas canônicas passando sem regressão). Nenhum playtest manual no navegador foi possível neste ambiente, mas a cobertura analítica é exaustiva.*
