# MORTEM — Relatório de Playtest do Vertical Slice

**Data:** 16 de julho de 2026
**Avaliador:** Playtest "isento" — perspectiva de jogador, sem considerar diretrizes internas do repositório
**Build analisada:** Branch principal do repositório `santosbruno94/Mortem-new`
**Escopo:** Os três modos de jogo — Tutorial, Réplica e Procedural

---

## Sumário Executivo

MORTEM é um jogo de investigação forense ambientado na Inglaterra vitoriana (1893), jogado inteiramente sobre uma escrivaninha vista de cima. O jogador assume o papel de um perito médico-legal e deve examinar evidências, interrogar suspeitos e construir uma acusação sustentada por provas físicas. O conceito é ambicioso e bem executado em seu modo principal (Tutorial), mas os dois modos procedurais apresentam lacunas significativas que reduzem a profundidade do jogo.

**Veredicto geral:**

- **Modo Tutorial ("A Hora Emprestada"):** Excelente. Caso bem construído, com múltiplas camadas de engano e uma solução que recompensa perícia genuína. 9/10.
- **Modo Réplica ("A Hora Refeita"):** Funcional, mas simplificado. Perde dois pilares de dificuldade (encenação e julgamento de inocentes). 5/10.
- **Modo Procedural ("Um Caso da Comarca"):** Mecânica sólida, prosa fraca, mesmos pilares ausentes da réplica. 4/10.

---

## PARTE I — MODO TUTORIAL: "A HORA EMPRESTADA"

### 1.1 Primeira impressão e onboarding

**Tela inicial:** O jogador escolhe entre três modos, mas só há um detetive jogável (Dr. Harlan Blackwell). A moldura "Quem atende ao chamado?" com apenas uma opção cria uma expectativa de escolha que não se cumpre — sensação de "falsa interatividade". O jogo deveria ou apresentar como convite direto ("O Dr. Blackwell atende ao chamado") ou reservar o enquadramento para quando houver mais personagens.

**Abertura (6 passos):** Prosa atmosférica e eficaz. A pensão miserável em Caulfield, a Sra. Potts entregando a carta, a transformação da mesa — tudo constrói a fantasia do perito itinerante. Porém, as **4 perguntas do briefing** são fáceis de perder: o texto avisando "Restam N perguntas" é discreto, e o jogador pode avançar sem perceber que deixou informação para trás. As perguntas plantam tanto informações úteis quanto iscas (a história do relógio das 08h45, os herdeiros, as queixas), e perdê-las empobrece a investigação.

**Problema de UX:** Não há como voltar a um passo anterior da abertura. Se o jogador clica rápido demais, perde prosa contextual que não retorna.

### 1.2 A investigação — o coração do jogo

**Chegada à cena (11h00 de 14/out/1893, IPM = 14h):** O jogador cai na escrivaninha com nós de localidade visíveis (8 de 9, sendo o 9º desbloqueável por lead). A mecânica central é clara na segunda visita, mas confusa na primeira: **termos em negrito são clicáveis e extraem cartas**, mas essa informação aparece apenas como texto pequeno no rodapé do overlay de localidade. Um jogador que não leia o rodapé pode demorar vários minutos para entender a mecânica de extração.

**O diorama 3D** é visualmente impressionante como maquete de papel sobre a mesa. A iluminação segue o relógio (tarde dourada → crepúsculo → noite com lampiões) e dá peso à passagem do tempo. O pino do perito deslizando no trajeto é um toque de polimento que comunica o custo da viagem. No entanto, **a alternância 3D/2D não é óbvia** — o toggle "Modo plano" está escondido na parte inferior da tela inicial como um link discreto.

#### 1.2.1 Localidades e cartas — simulação de jornada completa

Tentei seguir duas rotas distintas para testar todos os finais:

**ROTA A — O Jogador Metódico (rota ótima):**

1. **O Corpo** (11h00, custo 0h): Extraio rigor (pleno), livores (fixos), ferida (incisa no pescoço), reação vital, resíduo (pó vermelho de polimento). Meço temperatura: 23°C, sala a 11°C. Examino o relógio de bolso parado às 05h05. → 7 cartas extraídas.
2. **A Cena** (11h00, custo 0h — mesmo prédio): Examino a lareira — relógio esmagado às 08h45, conto os entalhes da roda (9ª batida = esmagamento entre 21-22h). Examino a escrivaninha — bilhete amassado de súplica (Walter). Examino a vitrine — arrombamento superficial, caixa vazada. Copa — cesta de ceia para dois, "A.R." → 6 cartas.
3. **A Oficina** (11h00, custo 0h): Prateleira — estojo de buril limpo (pertence a Silas). Púlpito — livro de ordens (3 queixas contra "S.C.", nota "pesar as caixas"). Gaveta — anel para gravar "G.A. & A.R." → 3 cartas + diálogo com Davey (hábito da corda às 23h, álibi corroborado) → 5 cartas.
4. **Interrogatório de Silas** (11h00, custo 0h): Escolho tom oblíquo no beat 1 → álibi (estalagem das 20h à manhã) + vidro do mostrador na bainha (exclusivo deste tom). Beat 2 → comportamento (insiste em ladrão de fora). → 3 cartas.
5. **A Delegacia** (12h00, custo 1h): Testamento (Walter herdeiro), dívidas, briga ouvida, queixa de Grey, Tobin viu vítima às 20h, padeiro viu luz às 05h15, senhora na viela. → 7 cartas. O testamento desbloqueia o gabinete Pettigrew.
6. **A Estalagem** (13h00, custo 1h): Registro — "W. Arthurs, 19h40, quarto 3". Estalajadeiro — quarto 5 (Silas) vazio às 21h, portão depois das 22h. Diálogo com Walter (álibi da diligência das 18h = mentira). → 3 cartas + diálogo.
7. **A Papelaria** (14h00, custo 1h): Diálogo com Agnes — álibi (em casa desde as 18h = mentira). Comportamento reservado. → 2 cartas.
8. **O Moinho** (15h00, custo 1h): Diálogo com Grey — álibi corroborado (moinho, 3 testemunhas). Hostil mas sem oportunidade. → 2 cartas.
9. **Gabinete Pettigrew** (18h00, custo 1h30 ida + 1h30 volta): Carta do morto com queixa contra empregado + planos de casamento. → 1 carta. (Opcional — alto custo, resultado redundante.)

**Total:** 18h00 de relógio, ~36 cartas. Tempo suficiente para tudo.

**Construção da Acusação:**
- **Réu:** Silas Crane
- **Janela:** -3 a -2 (21h-22h de 13/out) — sustentada pela roda de contagem
- **Causa:** ferida por arma branca — sustentada pela ferida incisa e resíduo de buril
- **Presença:** buril lavado pertencente a Silas (nexo instrumental)
- **Motivo:** livro de ordens (silenciamento)
- **Encenação exposta:** relógio da lareira refutado pela roda de contagem
- **Juízos:** Walter = inocente (segredo: súplica recusada, via registro da estalagem); Agnes = inocente (segredo: noivado secreto, via cesta); Caleb = inocente (álibi corroborado); Davey = inocente (álibi corroborado)

**Resultado: VITÓRIA ABSOLUTA.** O monólogo é poderoso — narrado em primeira pessoa pelo perito, reconstrói toda a cadeia dedutiva. O eco do título ("a hora que a mentira tomou emprestada de um relógio, o corpo cobrou de volta") aparece apenas quando a encenação foi exposta. O epílogo traz consequências para cada personagem e estatísticas da investigação.

---

**ROTA B — O Apressado (armadilha pedagógica):**

O jogador que segue a "história A" do delegado:
1. Aceita o relógio das 08h45 como hora da morte
2. Vê Walter com testamento + dívidas + mentira do álibi → "mentiu, logo matou"
3. Acusa Walter

**Resultado: ERRO JUDICIÁRIO.** O monólogo não revela quem é o verdadeiro culpado (a retentativa está de pé). As dicas de primeira pessoa sugerem o que faltou. Excelente design pedagógico.

---

**ROTA C — O Intuitivo (réu certo, provas insuficientes):**

O jogador que fareja Silas (achou o corpo, nervoso) mas não monta a cadeia:
1. Acusa Silas sem janela precisa, sem mecanismo cravado, sem buril
2. A acusação cai por falta de materialidade

**Resultado: IMPUNIDADE.** O assassino é solto por perícia insuficiente. Narrativamente devastador.

---

**ROTA D — Sucesso com Gafes:**

O jogador que acusa Silas corretamente mas:
- Janela imprecisa (>6h) OU
- Não expõe a encenação OU
- Julga um inocente como cúmplice OU
- Liga vestígio de terceiro à presença

**Resultado: SUCESSO COM GAFES.** Condenação sustentada, mas com lacunas expostas. O monólogo narra cada gafe.

---

### 1.3 Finais alcançados

| Final | Alcançável? | Rota | Observação |
|---|---|---|---|
| Vitória Absoluta | SIM | Metódica | Requer domínio de todos os pilares |
| Sucesso com Gafes | SIM | Parcialmente metódica | Réu certo com lacunas |
| Impunidade | SIM | Intuitiva | Réu certo sem provas |
| Erro Judiciário | SIM | Apressada | Réu errado condenado |

**Todos os 4 finais são alcançáveis no modo Tutorial sem bloqueios.**

### 1.4 Pontos fortes do Tutorial

1. **"Nem todo mentiroso é culpado"** funciona brilhantemente. Walter mente por vergonha (implorou dinheiro), Agnes mente por decoro (noiva secreta), Davey mente por medo (ensaiado por Silas). A armadilha de "mentiu = culpado" é natural e o descarte físico está sempre na mesma página da mentira.

2. **O relógio como pivô triplo** é o achado de design do caso: o mostrador forjado (08h45), a roda de contagem (21-22h) e o relógio de bolso (corda não dada às 23h) são três leituras do mesmo artefato que contam três histórias diferentes. Genial.

3. **Zero feedback durante a investigação** é corajoso e funciona. Não há "✓ correto!" nem guia de progresso. A tensão de não saber se a cadeia está certa até o veredicto é a experiência de dedução genuína prometida.

4. **A retentativa com custo** é elegante: pode tentar de novo, mas cada tentativa custa 2 horas (evidência perecível degrada). Não é punição gratuita — é consequência.

5. **A prosa** é excepcional. O tom vitoriano minimalista funciona: "O maxilar inferior sustenta a pressão dos dedos sem ceder. Os joelhos, idem." A observação pura (descreve sem interpretar) respeita a inteligência do jogador.

### 1.5 Problemas identificados no Tutorial

**P1 — Discoverability da mecânica de extração:** Os termos em negrito (âmbar) são o coração do jogo, mas um jogador novo pode não perceber que são clicáveis. A instrução aparece em texto pequeno no rodapé. Sugestão: na primeira visita a uma localidade, um tooltip ou animação sutil no primeiro termo negrito guiaria o olhar.

**P2 — O botão "Construir a Acusação" parece decorativo:** Está na "parede" acima da mesa, estilizado como placa de latão. Sem uma seta ou indicação de que é o passo final, o jogador pode varrer toda a mesa procurando como avançar.

**P3 — Diálogos irrecuperáveis sem aviso suficiente:** A advertência "a conversa desce e não volta" é texto itálico pequeno. Um jogador que clica rápido pode perder o tom oblíquo (que rende o vidro na bainha de Silas — o único cartão tone-gated) sem saber que descartou opções.

**P4 — O "Fechar o caderno" é destrutivo sem confirmação:** No epílogo, este botão apaga permanentemente o save e recarrega a página. O rótulo sugere fechar uma aba, não destruir o progresso.

**P5 — Stacking de z-index entre FichaEvidencia e Glossário:** Clicar no link "Rigor Mortis, no Glossário" dentro da ficha de evidência abre o glossário (z-40) atrás da ficha (z-50), criando confusão visual.

**P6 — Decisão de contradição na Caderneta:** Quando o jogador coleta tanto evidência corporal quanto o avistamento do padeiro, uma caixa de decisão irreversível aparece na Caderneta sem contexto prévio. Pode surpreender quem abre o caderno só para consultar.

**P7 — Carta tone-gated (ev_vidro_dobra):** O vidro na bainha de Silas só aparece no tom oblíquo do beat 1. Embora não seja necessário para nenhum veredicto (é reforço, não pilar), a exclusividade por tom não é sinalizada. O jogador pode jogar inteiros sem saber que perdeu uma evidência.

**P8 — Acessibilidade:** Os termos clicáveis são `<span>` sem `role="button"`, `tabIndex`, ou handler de teclado. O jogo é **inacessível por teclado** na sua mecânica central. Overlays não têm focus trap.

---

## PARTE II — MODO RÉPLICA: "A HORA REFEITA"

### 2.1 Conceito e expectativa

A descrição promete "o mesmo crime, refeito pela máquina". O jogador espera uma variação do caso tutorial com a mesma profundidade. A realidade é diferente.

### 2.2 O caso

- **Seed:** `a_hora_emprestada_replica_96`
- **Vítima:** Ada Thomas (merceeira)
- **Assassina:** Mary Walker, 24, criada, na Taverna
- **Método:** ferida por arma branca, 21h de 13/out, premeditado
- **Motivo:** character_negado (referência de caráter negada)
- **Encenação:** NENHUMA (cenaEncenada = false)
- **Hora forjada:** NENHUMA

### 2.3 Elenco

| Suspeito | Papel | Notas |
|---|---|---|
| John Wilson | Moleiro, 55 | Inocente |
| Mary Walker | Criada, 24 | **A ASSASSINA** |
| Thomas Jones | Pároco, 68 | Inocente |
| Walter Williams | Ferreiro, 35 | Inocente |
| William Smith | Lavrador, 27 | Inocente |

### 2.4 Diferenças críticas em relação ao Tutorial

**D1 — Sem encenação de cena:** O pilar "descuidos expostos" (refutar a peça forjada) é automaticamente satisfeito porque `cenaEncenada = false`. Não há relógio esmagado para refutar, não há arrombamento falso para identificar. A camada de engano da cena simplesmente não existe.

**D2 — Sem periféricos no veredito:** `verdadeDeOuro.perifericos = {}`. O sistema de julgamento de inocentes (marcar culpado/inocente/sem juízo para cada não-acusado) existe na UI mas **não tem impacto no veredito**. O jogador pode marcar todos como cúmplices e ainda conseguir Vitória Absoluta. Isso remove completamente a armadilha "mentiu = culpado" que é a alma do Tutorial.

**D3 — Sem voz do mestre:** Nenhuma carta tem `vozMestre`. O legista não fala. O jogador que vem do Tutorial sente a falta — perde-se a guia pedagógica. Para um jogador que já completou o Tutorial, isso é intencional (o perito agora é independente). Para alguém que começa pela Réplica, é desorientante.

**D4 — Sem ecos do mestre na retentativa:** Ao falhar, o jogador recebe apenas as dicas genéricas em primeira pessoa, sem o comentário progressivo do legista. A retentativa é quase cega.

**D5 — Prosa de template:** A qualidade da prosa cai visivelmente. Onde o Tutorial descreve "o maxilar inferior sustenta a pressão dos dedos sem ceder", a Réplica oferece descrições funcionais mas genéricas. As descrições de lesão são boas (5 variantes por método), mas a ambientação e os diálogos são repetitivos.

### 2.5 Tentativa de jornada completa

A investigação segue o mesmo loop: corpo → cena → delegacia → locais dos suspeitos. Com apenas 4-5 localidades (menos que as 9 do Tutorial) e nenhum lead de desbloqueio, a investigação é mais curta e linear.

**Construção da acusação:** Réu (Mary Walker) + janela + causa + nexo + motivo. Sem encenação para expor, sem periféricos para julgar. O mural da acusação fica com estações subutilizadas.

### 2.6 Finais alcançados

| Final | Alcançável? | Observação |
|---|---|---|
| Vitória Absoluta | SIM | Mais fácil — 2 pilares auto-satisfeitos |
| Sucesso com Gafes | SIM | Janela imprecisa ou motivo errado |
| Impunidade | SIM | Réu certo sem provas |
| Erro Judiciário | SIM | Réu errado |

**Problema fundamental:** A Vitória Absoluta é **significativamente mais fácil** que no Tutorial. A dificuldade cai de "dominar 6 pilares" para "dominar 4 pilares", e os 4 restantes são os mais mecânicos (janela + causa + nexo + motivo). A nuance de caráter (julgar inocentes corretamente, expor a encenação) desaparece.

### 2.7 Problemas específicos da Réplica

**R1 — Promessa vs. entrega:** "O mesmo crime, refeito pela máquina" sugere equivalência de experiência. O jogador espera um desafio comparável ao Tutorial. Recebe um caso mecanicamente funcional mas dramaticamente empobrecido.

**R2 — Nomes genéricos:** "John Wilson", "Mary Walker", "Thomas Jones" — nomes neutros que não carregam a personalidade dos nomes do Tutorial (Silas Crane, Agnes Rooke, Caleb Grey). A perda de caráter é tangível.

**R3 — Diálogos repetitivos:** Os 5 suspeitos têm diálogos gerados pelo mesmo template com diferenciação superficial. Dois podem compartilhar frases quase idênticas de comportamento.

**R4 — Sem diorama 3D:** O diorama 3D da maquete está presente (a cidade gera dados de posição), mas a experiência visual é menos polida que o caso artesanal.

**R5 — Sem planta da relojoaria:** A planta baixa do edifício é específica do Tutorial. Sem ela, a navegação entre cômodos é mais simples mas menos imersiva.

---

## PARTE III — MODO PROCEDURAL: "UM CASO DA COMARCA"

### 3.1 Conceito e estrutura

O pool contém 8 casos pré-gerados com seeds distintas. A seleção é aleatória na tela inicial (`Math.random()`). Cada caso traz: vítima, assassino, método, motivo, elenco de 5 suspeitos, evidências e mapa.

### 3.2 Variação entre casos

| Caso | Método | Motivo | Interferência |
|---|---|---|---|
| comarca_1 | estrangulamento (garrote) | herança | Não |
| comarca_2 | variado | variado | Não |
| comarca_3 | variado | variado | **SIM** — silenciar testemunha |
| comarca_4 | variado | variado | Não |
| comarca_5 | variado | variado | **SIM** |
| comarca_6 | variado | variado | Não |
| comarca_7 | variado | variado | **SIM** |
| comarca_8 | variado | variado | **SIM** |

A variação de métodos (arma branca, garrote, esganadura, contundente, veneno) é o ponto forte — cada caso exige leitura forense diferente. A interferência (em 4 de 8 casos) adiciona uma camada de tensão ausente no Tutorial e na Réplica.

### 3.3 Diferenças em relação ao Tutorial

Todas as diferenças D1–D5 da Réplica aplicam-se igualmente. Adicionalmente:

**D6 — Nenhum lead:** O array de leads é vazio. Todos os nós do mapa estão desbloqueados desde o início. Perde-se a sensação de progressão e descoberta que o Tutorial oferece ao revelar o gabinete Pettigrew como recompensa por seguir uma pista.

**D7 — Mapa menor e mais plano:** 4-5 localidades em dois grupos (cena_predio + vila), contra 9 em três grupos no Tutorial. Menos decisões de rota, menos pressão de tempo.

**D8 — Interferência (quando presente):** Em 4 dos 8 casos, o assassino age contra a investigação (destrói evidência, silencia testemunha). Isso adiciona urgência e é a feature mais promissora do modo procedural. O prenúncio (carta observável antes do evento) é um toque de fair play. Porém, como está pré-computado e não reativo às ações do jogador, pode sentir-se arbitrário.

### 3.4 Tentativa de jornada (comarca_1)

Caso com vítima Henry Brown, assassino James Jones (boticário), garrote, motivo herança.

A investigação é direta: corpo (rigor, livores, lesão por ligadura, resíduo), cena (evidência do garrote, pertences do assassino), delegacia (depoimentos, álibis). Sem leads, sem planta, sem encenação. O caso "resolve-se" em ~4 horas de relógio.

**Acusação:** Identificar o réu, fixar a janela pela convergência de indicadores, selecionar a causa correta (estrangulamento por ligadura), ligar o instrumento ao réu. Motivo direto.

**Resultado:** Vitória Absoluta na primeira tentativa. **Tempo total real: ~15 minutos de jogo.** O Tutorial levou ~45 minutos na primeira tentativa.

### 3.5 Finais alcançados

Mesma tabela da Réplica — todos alcançáveis, Vitória Absoluta significativamente mais fácil.

### 3.6 Problemas específicos do Procedural

**P1 — Muito fácil para Vitória Absoluta:** Sem periféricos e sem encenação, o jogador só precisa acertar réu + janela + causa + nexo + motivo. Dos 8 casos testados, nenhum ofereceu a profundidade de desafio do Tutorial.

**P2 — Prosa descartável:** As descrições das localidades são templates preenchidos com nomes de edifícios. "A delegacia é um sobrado de pedra na rua principal" vs. o Tutorial: "O delegado Wycliffe espera na soleira, de pé à frente do mapa do condado..." A diferença é palpável.

**P3 — Diálogos são o ponto mais fraco:** Todos os suspeitos falam com variações do mesmo registro. A "bíblia de vozes" (que dá a cada personagem do Tutorial um idioleto próprio) não existe aqui. Dois ferreiros em casos diferentes são indistinguíveis.

**P4 — Sem progressão entre casos:** Não há campanha, currículo, ou dificuldade escalante. O jogador 1 e o jogador do caso 8 enfrentam o mesmo nível de desafio.

**P5 — O erro judiciário não nomeia o culpado na retentativa:** Diferente do Tutorial (onde faz sentido manter o mistério), no Procedural o jogador não tem os mesmos recursos para deduzir. Pode ficar preso em ciclo de tentativa e erro.

**P6 — Apenas 8 casos no pool:** A rejogabilidade prometida ("um crime que nenhuma mão escreveu") é limitada a 8 variações. Para um modo que promete infinitude, é pouco.

---

## PARTE IV — ANÁLISE TRANSVERSAL DE UX

### 4.1 A filosofia "Tudo é mesa, tudo é carta"

**Funciona.** O jogador nunca sai da escrivaninha. Localidades, evidências, overlays — tudo mora sobre a mesa. A coerência material (madeira, pergaminho, couro, latão, cera, barbante) é consistente e cria uma estética imersiva rara em jogos web.

### 4.2 O mural de acusação

**O barbante é a melhor mecânica do jogo.** Ligar cartas com linhas SVG que pendem em catenária é satisfatório e intuitivo. O som de barbante ao ligar/desligar reforça o gesto. A progressão por estações (Corpo → Presença → Mentiras → Móbil → Juízos) guia sem forçar.

**Problema:** A interação de dois cliques (clique na carta fonte, depois na âncora destino) não tem estado visual intermediário suficiente. O jogador que espera arrastar uma linha fica confuso. Uma linha fantasma seguindo o cursor entre o primeiro e o segundo clique resolveria.

### 4.3 O sistema de tempo

**O relógio MOLE é uma decisão de design acertada.** Tempo corre apenas ao viajar; examinar é grátis. Sem fim de jogo por tempo. A pressão é de ROTA (vou a Pettigrew ou perco 3h?) e não arcade. No Tutorial, funciona perfeitamente. Nos procedurais, com mapas menores, a pressão de rota praticamente desaparece.

### 4.4 O glossário forense

**Excelente.** Referência de época com vocabulário técnico preciso. Contexto-sensitivo (pode abrir direto no verbete relevante). O fato de ser consulta gratuita incentiva o uso. O glossário **é** o tutorial do jogador para a medicina legal.

### 4.5 O painel de álibis

**Bem executado na neutralidade.** Lista declarações sem cruzar, sem marcar, sem sugerir. O cruzamento é ato do jogador no mural. Respeita a filosofia de "o jogo dá dados, o jogador produz a verdade".

### 4.6 A caderneta

**Funcional mas subutilizada.** O diário de investigação é útil para revisar o que foi feito, mas a leitura do mestre (quando presente) é o conteúdo mais valioso. No procedural, sem voz do mestre, a caderneta vira apenas um log.

### 4.7 Sons

**Eficazes mas escassos.** Cinco efeitos (papel, sino, pena, lacre, barbante) cobrem os gestos principais, mas o loop de investigação (examinar localidades, ler prosa, extrair termos) é silencioso. Um som ambiente sutil (crepitar de vela, tique de relógio) adicionaria atmosfera sem violar a regra de "som é apresentação".

### 4.8 Responsividade móvel

**Adequada.** Alvos de toque ≥44px, scroll gerenciado, grades adaptativas. A escrivaninha funciona em tela estreita, embora a experiência completa peça tela larga (o diorama 3D e a planta da relojoaria brilham em desktop).

---

## PARTE V — SUGESTÕES DE MELHORIA

### 5.1 Melhorias prioritárias (impacto alto, esforço viável)

**M1 — Periféricos no modo procedural.** O gerador precisa popular `verdadeDeOuro.perifericos` com veredictos esperados para cada não-acusado. Sem isso, o pilar de "julgar inocentes" — a alma do jogo — não existe fora do Tutorial. Cada suspeito gerado deveria ter um segredo ou um álibi corroborado, com o veredito esperado codificado.

**M2 — Encenação no modo procedural.** O gerador v2 deveria produzir cenas encenadas (pelo menos para assassinos com INT alta). O relógio forjado do Tutorial é o arco mais memorável do jogo; sua ausência nos procedurais empobrece a experiência.

**M3 — Tooltip/animação no primeiro termo clicável.** Na primeira localidade visitada, o primeiro termo em negrito deveria ter um pulso sutil ou tooltip "Clique para examinar" que desaparece após a primeira extração. Resolveria o problema de discoverability sem ser intrusivo.

**M4 — Confirmação para "Fechar o caderno".** Adicionar um modal: "Encerrar o caso apaga o progresso. Continuar?" Impede perda acidental de save.

**M5 — Focus trap em overlays + acessibilidade de teclado.** Adicionar `role="button"` e `tabIndex={0}` aos termos clicáveis. Implementar focus trap nos overlays. Sem isso, o jogo é inacessível para quem não usa mouse/touch.

### 5.2 Melhorias de médio prazo (aprofundamento)

**M6 — Leads no modo procedural.** O mapa deveria ter pelo menos 1 nó oculto revelado por lead. A descoberta de Pettigrew via livro de ordens é um dos melhores momentos do Tutorial — o procedural deveria emular isso.

**M7 — Linha fantasma no mural.** Ao clicar na carta fonte, uma linha SVG deveria seguir o cursor até o clique na âncora destino. Comunicaria visualmente o gesto de "puxar barbante".

**M8 — Ampliação do pool de casos.** 8 casos é insuficiente para "infinito". O gerador deveria produzir 20-30 casos com variação mais ampla de métodos, motivos e configurações de elenco.

**M9 — Dificuldade escalante.** Implementar a régua de escalada mencionada no design: primeiros casos procedurais com mestre (transição gradual), últimos sem; primeiros sem interferência, últimos com. A campanha mencionada no contexto (arco mestre/aprendiz) é a solução certa, mas mesmo sem ela, uma ordenação por dificuldade no pool melhoraria a experiência.

**M10 — Prosa dos diálogos gerados.** Os diálogos são o ponto mais fraco da geração. Investir em variantes de registro por classe social, idade e personalidade melhoraria dramaticamente a diferenciação entre suspeitos.

### 5.3 Melhorias de longo prazo (visão)

**M11 — Confronto com consequências (§7.3).** A semente de "o suspeito age após ser confrontado" já está nos dados. Implementar daria peso de tempo ao confronto, tensão real às entrevistas, e justificaria o relógio mole em cenas onde o assassino destrói evidência enquanto o perito viaja.

**M12 — Campanha com arco mestre/aprendiz.** O design completo está no documento de contexto. A morte do mestre como caso jogável seria o clímax narrativo. A campanha resolveria a progressão (do tutorial ao procedural) de forma orgânica.

**M13 — Segundo detetive jogável.** A infraestrutura de variação por hash salgado com o nome do perito já existe. Um segundo personagem com estilo diferente (mais intuitivo? mais técnico?) dobraria a rejogabilidade e justificaria a tela de seleção.

**M14 — Sons ambientes.** Crepitar de vela, vento de outubro, tique de relógio de bolso — loops sutis que acompanham a investigação sem interferir. Desligáveis pelo toggle existente.

**M15 — Sistema de reputação entre casos.** As consequências de erros (erro judiciário, impunidade) deveriam acumular e afetar como o perito é recebido em novos casos. O design já prevê ("a consequência pode endurecer").

---

## PARTE VI — TABELA DE BUGS E PROBLEMAS FUNCIONAIS

| # | Severidade | Descrição | Onde |
|---|---|---|---|
| B1 | Média | Esc fecha overlay E FichaEvidencia simultaneamente quando empilhados | Overlay.jsx + FichaEvidencia.jsx |
| B2 | Baixa | Link "no Glossário" dentro de FichaEvidencia abre glossário atrás da ficha (z-40 < z-50) | FichaEvidencia.jsx |
| B3 | Baixa | Texto "à esquerda" no glossário misleading em mobile (layout empilhado) | ModalGlossario.jsx |
| B4 | Média | Sem confirmação em "Fechar o caderno" — save destruído com 1 clique | MonologoFinal.jsx |
| B5 | Alta | Termos clicáveis inacessíveis por teclado (sem role, tabIndex, onKeyDown) | ProsaComTermos.jsx |
| B6 | Média | Sem focus trap em overlays — tab navega para elementos atrás do blur | Overlay.jsx |
| B7 | Baixa | `perifericos: {}` em todos os casos gerados — pilar de julgamento inerte | pacote_gerado.js / gerador |
| B8 | Baixa | `cenaEncenada: false` em todos os casos gerados — pilar de encenação inerte | pacote_gerado.js / gerador |
| B9 | Info | Sem React ErrorBoundary geral — crash de componente derruba o app | App.jsx |

---

## PARTE VII — CONCLUSÃO

MORTEM é um jogo de investigação com design de caso excepcional no modo Tutorial. "A Hora Emprestada" é um dos melhores casos de detetive que já vi em qualquer meio — a tríplice leitura do relógio, as armadilhas para o apressado, e a regra de que "a mentira do inocente é inconsistente com a moral, não com a física" são inovações reais no gênero.

O desafio está nos modos procedurais. A máquina monta casos jogáveis e internamente consistentes, mas faltam os dois pilares que tornam o Tutorial memorável: a encenação falsa e o julgamento de inocentes. Sem eles, a Vitória Absoluta é trivial, e o jogador perde exatamente a experiência que o Tutorial prometeu ensinar.

A recomendação central é clara: **antes de expandir o pool de casos, implementar periféricos e encenação no gerador procedural.** Esses dois sistemas já existem na arquitetura — precisam apenas ser ativados na geração. Com eles, cada caso gerado terá a profundidade mínima para funcionar como um verdadeiro desafio de dedução.

O jogo tem alma. A escrivaninha com seus materiais, o barbante no mural, o monólogo do detetive — tudo sustenta a fantasia de ser o perito que chega de fora. A questão é se os casos gerados conseguirão carregar essa alma tão bem quanto o caso artesanal. Com as melhorias sugeridas, acredito que sim.

---

*Relatório gerado em 16/07/2026. Avaliação isenta, sem consulta às diretrizes internas do repositório.*
