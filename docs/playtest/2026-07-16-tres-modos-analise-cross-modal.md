# MORTEM — Relatório de Playtest do Vertical Slice

**Data:** 16 de julho de 2026
**Testador:** Playtest isento (perspectiva de jogador, sem consultar diretrizes do repositório)
**Build:** Commit atual do branch principal
**Escopo:** Os 3 modos de jogo — Tutorial, Réplica e Procedural — com foco em qualidade, funcionalidade e acessibilidade de todos os finais

---

## Sumário Executivo

O vertical slice de Mortem apresenta um motor de dedução forense funcional e robusto, com prosa de altíssima qualidade no caso tutorial e uma estética visual/sonora coesa. O modo Tutorial ("A Hora Emprestada") é um caso de mistério exemplar — justo, complexo e satisfatório. Os modos Réplica e Procedural, entretanto, sofrem de densidade de conteúdo significativamente inferior, com sistemas centrais do jogo desativados ou subutilizados. A distância de qualidade entre o caso autoral e os casos gerados é o principal risco do produto.

Todos os 4 finais são alcançáveis nos 3 modos de jogo. Nenhum bloqueio funcional impede a conclusão. Os problemas são qualitativos e estruturais.

---

## 1. MODO TUTORIAL — "A Hora Emprestada"

### 1.1 Primeira Impressão

A tela título é imediatamente atmosférica: madeira, vela pulsante, tipografia serifada IM Fell English, tom âmbar. O título "MORTEM" em letras enormes comunica o gênero sem ambiguidade. Os três modos aparecem como "chamados" sobre a mesa — metáfora elegante, mas um jogador de primeira viagem não tem como saber qual escolher. A descrição "o caso-escola" ajuda, mas uma indicação mais explícita de que é o modo recomendado para iniciantes seria bem-vinda.

A seleção de detetive apresenta apenas Dr. Harlan Blackwell — a "escolha" é um gesto temático, não uma decisão de gameplay. Funciona narrativamente, mas gera expectativa de que haverá outros personagens no futuro.

A sequência de abertura é bem marcada: 6 passos que vão da pensão de Caulfield até Briarstone. A carta do delegado, a transformação da mesa e a chegada à vila criam atmosfera progressiva. O briefing final com 4 perguntas ao delegado é um tutorial disfarçado de conversa — excelente design.

**Problema de onboarding:** Ao chegar à escrivaninha, o jogador vê o mapa 3D (ou 2D) com 8 locais desbloqueados, a placa "CONSTRUIR A ACUSAÇÃO" no topo, o relógio de bolso e 4 botões na barra inferior. Não há nenhum tooltip, seta ou destaque indicando por onde começar. Um jogador inexperiente pode ficar perdido por 30-60 segundos antes de clicar no primeiro local.

### 1.2 Fluxo de Investigação

O mapa tutorial oferece 9 locais em 3 grupos geográficos:

**Relojoaria (0h de viagem entre cômodos):**
O corpo, a cena do crime, a oficina e a saleta de Silas Crane. O jogador pode examinar livremente sem custo de tempo. A planta baixa SVG permite navegar entre cômodos com um clique. A separação corpo/cena no mesmo escritório é inicialmente confusa — por que são dois "locais" no mesmo aposento? — mas faz sentido mecânico (o corpo e a cena oferecem evidências de domínios diferentes).

**Vila de Briarstone (1h por viagem):**
Delegacia, estalagem, papelaria, moinho. Cada viagem avança o relógio e o diorama escurece, criando pressão atmosférica real. O guarda da delegacia troca de lugar com uma lanterna à noite — um toque visual fino.

**Fora — Moorford (1.5h por perna):**
Gabinete Pettigrew, trancado até extrair o testamento ou o livro de ordens. O selo de cera "novo" e o anúncio de desbloqueio são claros.

**Evidências e armadilhas:** O jogo distribui 35 cartas entre 10 locais. A delegacia é a "fábrica de iscas" — 4 dos 7 cartões do delegado Wycliffe são pistas falsas que apontam para Walter Arthurs (herança, dívidas, discussão, queixa de Grey). Apenas 1 (`dep_visto_vivo` — última vez visto com vida) é genuinamente crítico. A decisão de design é brilhante: o jogador que confia cegamente na autoridade é levado à armadilha do Erro Judiciário.

**Sistema de tempo:** O relógio SÓ avança com viagens. Examinar, interrogar e construir acusação são gratuitos. Para o tutorial, isso é o equilíbrio certo — recompensa exploração sem punir curiosidade. A degradação de evidências (rigor mortis muda de estado em IPM 24h e 36h; temperatura atinge equilíbrio em ~26h) raramente afeta uma jogada normal, mas cria uma rede de segurança contra brute force infinito.

### 1.3 Interrogatórios

Os 5 suspeitos têm árvores de diálogo descendentes com 4 tons por beat (firme, cordial, técnico, oblíquo). A conversa desce e não volta — cada escolha descarta as alternativas permanentemente.

**Silas Crane:** O interrogatório mais complexo. O tom oblíquo no primeiro beat é o ÚNICO caminho para obter `ev_vidro_dobra` (estilhaço de vidro na dobra da calça). Esta é a mecânica-assinatura do jogo — "olhar de lado e capturar algo". No entanto, nenhum texto in-game explica que tons "ressonantes" existem ou oferecem conteúdo exclusivo. O jogador só descobre por experimentação ou intuição. Para o tutorial, isso é aceitável como recompensa de atenção; seria injusto se fosse obrigatório (e não é — a cadeia de condenação funciona sem o estilhaço).

**Walter Arthurs:** A melhor confrontação do jogo. Apresentar o registro da estalagem força a confissão: "Não havia diligência nenhuma." Walter admite que veio mendigar dinheiro — e nesse momento o jogador deve perceber que ele é mentiroso, mas não assassino. Se não perceber, cai na armadilha.

**Agnes Rooke:** A confrontação com a cesta de ceia revela o noivado secreto. Satisfatória e narrativamente rica.

**Caleb Grey:** O mais direto — álibi corroborado por 3 homens, hostilidade aberta. Ele é o "ruído que codifica o motivo de outro" — sua queixa sobre o relógio leva ao livro de ordens, que leva a Silas.

**Davey Tull:** Fornece o testemunho mais elegante do jogo: o hábito de dar corda ao relógio de bolso às 23h. Combinado com o relógio parado às 05:05 (reserva de 30h), fecha o teto da janela de morte em 23h de 13/out. Um detalhe forense que vem de um aprendiz de 15 anos — perfeito.

**Avaliação do sistema de tons:** Para 4 dos 5 suspeitos, o tom não altera o resultado mecânico — apenas o sabor do texto. A diferenciação é narrativa, não funcional. Isso é elegante para um jogo de mistério (a informação está lá para quem sabe procurar), mas reduz o peso percebido da escolha de tom. Um jogador pode sentir que as opções são cosméticas.

### 1.4 Sistema de Acusação

O mural de acusação em 5 estações é o coração mecânico do jogo:

**Estação I — O Corpo:** Declarar janela temporal e causa da morte, ligar cartas temporais/causais às âncoras. O catálogo de causas com 10 opções e o sistema de eliminação por sinais são elegantes — o sinal `ferida_incisa` elimina 9 das 10 causas, deixando apenas `ferida_arma_branca`.

**Estação II — A Presença:** Nomear o réu, ligar um vestígio instrumental à âncora de presença. O barbante com catenária e animação "boil" é visualmente impecável.

**Estação III — As Mentiras:** Refutar evidências encenadas e álibis falsos ligando fato a alegação. A mecânica de contra-prova é satisfatória.

**Estação IV — O Móbil:** Apontar a carta de motivação ligada ao réu.

**Estação V — Os Juízos:** Julgar cada suspeito não-acusado. ESTE É O PONTO MAIS OBSCURO DO JOGO. Para `inocente_segredo` (Walter e Agnes), o jogador precisa não apenas declarar "inocente" mas também ligar o vestígio que revela o segredo ao álibi do suspeito. Essa mecânica não é explicada em lugar nenhum antes da primeira falha. As dicas do tutorial (`DICAS_TUTORIAL`) cobrem isso na reincidência, mas a experiência de primeira tentativa pode ser frustrante.

**Revisão e retry:** Após falha, o monólogo lista o que deu errado e o mestre do legista acrescenta um eco técnico no caderno. O custo de 2h por revisão é justo. O nome do verdadeiro culpado é ocultado durante retentativas e só revelado no encerramento final — impede brute force.

### 1.5 Finais

Os 4 finais são todos alcançáveis e bem calibrados:

**Vitória Absoluta:** Requer perfeição em todos os 9 pilares — réu correto, janela precisa (<=6h), mecanismo cravado, nexo instrumental, encenação exposta, motivação correta, juízos periféricos corretos, sem vestígio acessório ligado indevidamente. O monólogo reconstrói EXATAMENTE o que o jogador linkou. O epílogo mostra Silas condenado na primeira sessão e enforcado. Extremamente satisfatório.

**Sucesso com Gafes:** O final mais provável para um jogador cuidadoso mas imperfeito. Janela larga demais, motivação errada, encenação não exposta, ou juízos periféricos incompletos. O monólogo admite as falhas sem soar condescendente. O epílogo mostra o júri deliberando até o amanhecer. Motiva replay.

**Impunidade:** Réu correto mas cadeia probatória fraca. O caso nunca vai a julgamento. O delegado encerra como "homicídio por pessoa(s) desconhecida(s)". Frustrante por design — o jogador sabe quem é mas não pode provar.

**Erro Judiciário:** Réu errado. Um inocente é condenado. O epílogo revela o verdadeiro autor SOMENTE no encerramento. Este é o final mais sombrio e pedagogicamente mais importante — ensina que uma cadeia lógica construída sobre premissa errada condena um inocente.

### 1.6 Bugs e Problemas (Tutorial)

| # | Severidade | Descrição | Local |
|---|-----------|-----------|-------|
| T1 | Cosmético | Prefixo "§" nos termos do glossário aparece como caractere solto sem explicação | `ModalGlossario.jsx:52` |
| T2 | UX | Nenhum tooltip ou "comece aqui" ao chegar na escrivaninha pela primeira vez | `Escrivaninha.jsx` |
| T3 | UX | A escolha de contradição na Caderneta (relato vs corpo) é apresentada como irreversível mas tem ZERO efeito mecânico | `Caderneta.jsx:33-69` |
| T4 | Acessibilidade | Cartas da mesa não têm navegação por teclado nem labels para screen reader | `CartaMesa.jsx` |
| T5 | Defensivo | `ProsaComTermos.jsx:52` renderiza ID interno cru caso definição de carta esteja ausente | `ProsaComTermos.jsx:52` |
| T6 | UX | NPCs embutidos (Davey na oficina, Walter na estalagem) podem ser perdidos se jogador não rolar até o botão de diálogo | `EventoLocalidade.jsx` |
| T7 | UX | Estação V do mural requer gesto não-óbvio (ligar vestígio a álibi para inocente_segredo) sem explicação prévia | `MuralAcusacao.jsx` |
| T8 | UX | Visita a Pettigrew custa 3h (ida e volta) mas o card `corrob_pettigrew` não é estritamente necessário para Vitória Absoluta — pode gerar frustração | — |
| T9 | UX | Feedback de degradação de evidência é sutil; não há aviso explícito "examine o corpo antes de viajar muito" | `EventoLocalidade.jsx:289-306` |

### 1.7 Análise de Fairness (Tutorial)

O caso é **justo**. Toda informação necessária para Vitória Absoluta está disponível no jogo:

- **Janela temporal:** "visto vivo às 20h" + "hábito da corda às 23h" + "relógio parado às 05:05 (30h de reserva)" + maquinismo (21h-22h) + rigor/livor/temperatura convergem
- **Causa:** Sinal `ferida_incisa` elimina 9 de 10 causas
- **Presença:** Pó vermelho na ferida → buril → estojo com nome de Silas
- **Motivo:** Livro de ordens + carta a Pettigrew = silenciamento de fraude
- **Encenação:** Relógio da lareira a 08:45 contradiz janela de 21-23h; vitrine intacta com balcão revirado; fechadura forçada
- **Álibi:** Estalajadeiro viu quarto de Silas vazio às 21h e portão fechado depois das 22h

Cada pista falsa tem contra-prova acessível no jogo. O design é exemplar.

---

## 2. MODO RÉPLICA — "A Hora Refeita"

### 2.1 Visão Geral do Caso

- **Vítima:** Ada Thomas, merceeira, 39 anos, Wrenfield
- **Assassina:** Mary Walker (gen_1_criada), criada, 24 anos
- **Método:** ferida_arma_branca (lâmina de ofício)
- **Motivo:** character_negado (carta de referência negada)
- **Hora da morte:** -3 (21h de 13/out)
- **IPM na chegada:** 14 horas

### 2.2 Qualidade da Prosa

A prosa gerada é **funcionalmente boa mas emocionalmente rasa** comparada ao tutorial:

**Pontos fortes:**
- Descrições forenses precisas ("Corte de bordas regulares, mais fundo onde começa e raso onde termina. As margens são limpas, sem ponte de pele entre elas.")
- Perfis de personalidade em uma linha por suspeito ("Espera a pergunta acabar de todo antes de abrir a boca" para Mary Walker — perfeito para uma culpada que mede as palavras)
- Interpolação de templates sem falhas — zero `{suspeito:xxx}` ou IDs crus visíveis

**Pontos fracos:**
- A carta `gen_instrumento` ("O Lugar Vazio") nomeia a suspeita, identifica a arma E conecta ao ferimento em UMA ÚNICA frase. Não há mistério a resolver — a solução é entregue pela coleta de evidências, não pela dedução
- O motivo (`gen_motivo`) é igualmente direto: "Ada Thomas negou a Mary Walker a carta de referência; sem ela, casa nenhuma a toma a serviço"

### 2.3 Diálogos Gerados

**Problema crítico — duplicação cross-suspeito:** John Wilson (moleiro) e Walter Williams (ferreiro) compartilham os MESMOS 4 textos de beat-2 palavra por palavra. Um jogador que interrogue ambos em sequência ouvirá as mesmas falas duas vezes. Isso quebra a ilusão de personagens distintos.

**Problema — álibis uniformes:** Todos os 5 suspeitos declaram "Recolhi-me ao [local] às oito e não tornei a sair antes de clarear." Não há discrepância de horário, lacuna suspeita ou conflito entre testemunhos. O sistema de álibis — projetado para triangulação e refutação — não tem material para triangular.

**Problema — apenas 1 confrontação:** Somente Mary Walker pode ser confrontada com evidência (gen_instrumento). Os outros 4 suspeitos não têm confrontações. A mecânica mais interativa do jogo é usada 1 vez em 5 oportunidades.

**Problema — opções do jogador idênticas:** Todos os 5 diálogos apresentam as MESMAS 8 perguntas (4 por beat). Na terceira interrogação, o jogador já viu estas opções 3 vezes.

### 2.4 Sistemas Desativados

| Sistema | Tutorial | Réplica |
|---------|----------|---------|
| Cena encenada (staging) | Sim — relógio forjado, roubo simulado, fechadura | Não — `cenaEncenada: false` |
| Periféricos com segredo | 2 (Walter, Agnes) | 0 — `perifericos: {}` |
| Interferências | Inerte (sistema preparado) | Nenhuma |
| Confrontações | 5 suspeitos, múltiplas provas | 1 suspeito, 1 prova |
| Leads de desbloqueio | 2 (desbloqueiam Pettigrew) | 0 — `leads: []` |
| Isca do apressado (trap suspect) | Walter Arthurs | Nenhuma |

A Réplica joga com menos da metade dos sistemas que o Tutorial ativa. O resultado é um caso resolvível em ~15 minutos por um jogador que completou o tutorial, com zero desafio intelectual.

### 2.5 Contradição Narrativa (Livor vs Staging)

A carta de livor mortis tem `posicaoCompativel: false` e texto indicando que o corpo foi movido ("As manchas assentaram do lado que ora fica para cima"). A prosa da cena confirma: "sob o pé de uma peça de mobília, um arranhão que escapa para fora dela" (marca de arrasto). Porém, `cenaEncenada: false` — o jogo ignora mecanicamente a movimentação do corpo. O jogador vê evidência forense de que o corpo foi movido mas não pode agir sobre isso em nenhum pilar.

### 2.6 Localidade-armadilha

A "Vizinhança" custa 1h de viagem, contém ZERO cartas, ZERO ações e UMA frase de texto atmosférico. Um jogador que a visite desperdiça 1h sem qualquer retorno informacional. Não há sinal no jogo de que esta localidade é vazia.

### 2.7 Finais — Alcançabilidade

Todos os 4 finais são alcançáveis:

- **Vitória Absoluta:** Acusar Mary Walker + janela precisa [-5, -1] + mecanismo `ferida_arma_branca` + nexo `gen_instrumento` + motivação `gen_motivo`. `descuidosOk` e `perifericosOk` são automaticamente verdadeiros (nenhum pilar ativo)
- **Sucesso com Gafes:** Acusar Mary Walker com janela > 6h OU motivação errada
- **Impunidade:** Acusar Mary Walker sem sustentar a cadeia
- **Erro Judiciário:** Acusar qualquer outro suspeito

Nenhum bloqueio. Porém, a ausência de staging e periféricos significa que "Sucesso com Gafes" só pode ser atingido por janela imprecisa ou motivação errada — não há as 5-6 dimensões de falha que o tutorial oferece.

---

## 3. MODO PROCEDURAL — "Um Caso da Comarca"

### 3.1 Visão Geral dos 8 Casos

| # | Vítima | Assassino | Método | Motivo |
|---|--------|-----------|--------|--------|
| 1 | Henry Brown | James Jones (boticário) | Garrote | herança |
| 2 | Ada Jones | James Brown (lavrador) | Arma branca | seguro de enterro |
| 3 | Mary Walker | James Brown (lavrador) | Estrangulamento manual | despejo |
| 4 | Henry Smith | Ethel Taylor (criada) | Estrangulamento manual | escândalo/gravidez |
| 5 | Thomas Roberts | Joseph Thomas (lavrador) | Arma branca | seguro de enterro |
| 6 | Rose Evans | George Williams (médico) | Garrote | dívida de caderneta |
| 7 | Emily Williams | Thomas Jones (lavrador) | Golpe contuso | despejo |
| 8 | Edith Taylor | William Taylor (lavrador) | Garrote | dívida de caderneta |

### 3.2 Diversidade e Repetição

**Métodos:** 3 garrotes, 2 armas brancas, 2 estrangulamentos manuais, 1 golpe contuso. Envenenamento por arsênico — o método mais distintivo do catálogo — está **completamente ausente**. Nenhum caso exige dedução por família de sinais ou eliminação progressiva; um único card (`gen_lesao_fatal`) crava o mecanismo em todos os 8 casos.

**Motivos:** Apenas 5 dos 10 motivos do catálogo aparecem. `divida_caderneta`, `seguro_de_enterro` e `despejo` repetem-se 2 vezes cada. 5 motivos nunca são usados (dote, salário atrasado, rivalidade capela/taverna, recasamento vigiado, character_negado no pool).

**Nomes:** "James Brown" é o assassino nos casos 2 E 3 — mesmo nome, pessoas diferentes. Quebraria imersão para quem joga ambos.

**Vilas e delegados:** Aldergate/Roderick aparecem nos casos 1 e 7; Haversham/Stanmore nos casos 2 e 8.

### 3.3 Interferências

| Caso | Tipo | Alvo | Resultado |
|------|------|------|----------|
| 1 | Nenhuma | — | — |
| 2 | Silenciar testemunha | Annie Thomas | Sucesso — testemunha morta |
| 3 | Subornar testemunha | Charles Williams | Falhou — deposita evidência extra |
| 4 | Nenhuma | — | — |
| 5 | Destruir evidência | gen_pegadas | Falhou — deposita limpeza fresca |
| 6 | Nenhuma | — | — |
| 7 | Destruir evidência | gen_pegadas | Falhou — idêntico ao caso 5 |
| 8 | Nenhuma | — | — |

Apenas 4 dos 8 casos têm interferência. Os casos 5 e 7 têm interferências estruturalmente **idênticas** (destruir gen_pegadas, ambas falharam com os mesmos valores). Nenhum caso tem `intimidar_testemunha`. O sistema de interferência — uma das features mais sofisticadas do design — opera a meia capacidade.

### 3.4 Sistemas Desativados (em TODOS os 8 casos)

- **`cenaEncenada: false`** em todos — nenhum caso tem cena encenada ou hora forjada
- **`perifericos: {}`** em todos — nenhum julgamento periférico é necessário
- **`leads: []`** em todos — nenhum local é desbloqueado por extração de carta
- **`confrontos.consequencias: {}`** em todos — nenhuma consequência de confrontação
- **`isca_do_apressado`** ausente — nenhum "falso óbvio" existe nos casos gerados
- **Personagem:** Sempre e apenas Dr. Harlan Blackwell
- **Data:** Sempre 14 de outubro de 1893, 11h, 11°C

### 3.5 Qualidade de Conteúdo

**Prosa das localidades:** Funcional mas formulaica. A delegacia é sempre "uma sala de armários abertos". A vizinhança é sempre "casas com paredes finas e janelas que dão para a mesma rua". O corpo tem boa variação por método.

**Prosa de evidências:** Alta qualidade técnica. Cada método tem descrição forense única e precisa. Porém, `gen_lesao_fatal` e `gen_instrumento` repetem o texto exato quando o método é o mesmo entre casos. Um jogador que jogue os casos 1, 6 e 8 (todos garrote) lerá a mesma descrição de lesão 3 vezes.

**Diálogos:** Mesma estrutura de 3 beats × 4 tons. Mesmas 8 perguntas do jogador em todos os casos. Diferenciação de voz funciona no beat-1 (tics de abertura por classe social), mas colapsa no beat-2 com duplicação entre personagens de roles similares.

**Abertura:** Estruturalmente idêntica em todos os 8 casos: Sra. Potts, envelope, carta, transformação, chegada, briefing. Apenas mudam nome da vila, do delegado e da vítima. Um jogador que jogue 3+ casos reconhecerá o padrão.

### 3.6 Topologia dos Mapas

6 dos 8 casos têm exatamente 4 locais (corpo, cena, delegacia, oficio_do_reu OU vizinhança). Apenas os casos 1 e 2 têm 5 locais. A vizinhança (quando presente sem cartas) é uma armadilha de tempo. O mapa do tutorial com 9 locais em 3 clusters geográficos é dramaticamente mais rico.

### 3.7 Seleção do Pool

A seleção usa `Math.random()` sem rotação, deduplicação ou tracking de casos jogados. O paradoxo do aniversário garante repetição por volta do 4º-5º jogo. Não há mensagem ao jogador sobre isso.

### 3.8 Finais — Alcançabilidade (Pool)

Todos os 4 finais são alcançáveis em todos os 8 casos. A cadeia para Vitória Absoluta é sempre: réu + temporal (rigor + livores + visto_vivo) + causal (lesao_fatal) + nexo (instrumento/pertence) + motivação (motivo). A ausência de staging e periféricos reduz o "Sucesso com Gafes" a um destino que só ocorre por janela imprecisa ou motivação errada.

---

## 4. Análise Cross-Modal

### 4.1 Escala de Complexidade

| Dimensão | Tutorial | Réplica | Procedural |
|----------|----------|---------|------------|
| Locais no mapa | 9 | 5 | 4-5 |
| Cartas de evidência | 35 | ~12 | 10-14 |
| Confrontações possíveis | ~15 | 1 | 0-2 |
| Iscas/pistas falsas | 7 cartas `isca: true` | 0 | 0 |
| Cena encenada | Sim (3 elementos) | Não | Nunca |
| Periféricos com segredo | 2 | 0 | 0 |
| Interferências | Preparadas mas inertes | 0 | 0-2 |
| Desbloqueio de locais | Sim (Pettigrew) | Não | Nunca |
| Trap suspect | Walter Arthurs | Nenhum | Nunca |
| Dimensões de falha possíveis | ~9 | ~3 | ~3 |

A distância de complexidade entre o Tutorial e os modos gerados é o achado mais importante deste playtest.

### 4.2 Experiência do Jogador por Modo

**Tutorial:** 60-90 minutos de investigação densa. Múltiplas pistas falsas a descartar, 5 personagens distintos a interrogar, um mural de acusação com 5 estações significativas. Cada final conta uma história diferente. O jogador sai com a sensação de ter resolvido um caso real.

**Réplica:** 15-25 minutos. A solução é revelada pela coleta de 3-4 cartas. Não há armadilha, não há encenação, não há juízos periféricos. O mural é um exercício de ligar os pontos óbvios. O jogador pode se sentir subestimado.

**Procedural:** Similar à Réplica em cada caso individual, com a promessa de variedade via repetição. Porém, 3+ jogos revelam os padrões: mesma abertura, mesmas perguntas de diálogo, textos repetidos para métodos iguais, nomes duplicados. A replayability prometida se esgota rápido.

---

## 5. Sugestões de Melhoria

### 5.1 Prioridade Alta — Sistemas do Gerador

| # | Sugestão | Justificativa |
|---|----------|---------------|
| M1 | **Ativar `cenaEncenada` no gerador.** O motor do corpo arrastado já produz livor contraditório e marcas de arrasto. Falta criar a "hora forjada" (um objeto temporal encenado) para o jogador refutar. | O pilar de "descuidos" é um dos mais satisfatórios do tutorial e está ZERO nos modos gerados |
| M2 | **Ativar `perifericos` com ao menos 1 `inocente_segredo`.** O gerador já atribui papéis dramáticos (veu, isca). Conectar o papel ao campo `perifericos` do seed. | Os juízos periféricos adicionam profundidade moral e gameplay ao mural |
| M3 | **Implementar `isca_do_apressado` nos casos gerados.** Criar um suspeito com motivo visível, álibi quebrável mas inocente. | O "falso óbvio" é o mecanismo pedagógico central do jogo; sem ele, não há armadilha |
| M4 | **Diversificar diálogos do beat-2.** Eliminar duplicação cross-suspeito; parametrizar respostas por classe, motivo e traço. | Dois personagens com falas idênticas quebra imersão |
| M5 | **Diversificar opções do jogador nos diálogos.** Variar as 8 perguntas por caso ou ao menos por suspeito. | Repetição gera desengajamento após 3ª interrogação |
| M6 | **Gerar álibis com discrepâncias.** Ao menos 1 suspeito deve declarar horário conflitante ou lacuna que o jogador possa triangular. | Sistema de álibis sem material de triangulação é inerte |

### 5.2 Prioridade Alta — Pool e Variedade

| # | Sugestão | Justificativa |
|---|----------|---------------|
| M7 | **Incluir ao menos 1 caso com envenenamento por arsênico no pool.** | Método mais distintivo do catálogo, completamente ausente |
| M8 | **Eliminar colisões de nome entre assassinos.** "James Brown" em 2 casos é inaceitável. | Quebra imersão |
| M9 | **Eliminar repetição de vila/delegado.** Cada caso deveria ter vila e delegado únicos. | Aldergate/Roderick e Haversham/Stanmore repetem |
| M10 | **Implementar rotação ou shuffle no pool** em vez de seleção aleatória. Rastrear casos jogados e evitar repetição. | Paradoxo do aniversário causa repetição antes do 5º jogo |
| M11 | **Usar mais motivos do catálogo.** 5 dos 10 disponíveis nunca aparecem. | Reduz variedade percebida |
| M12 | **Variar a data base.** Todos os casos ocorrem em "14 de outubro de 1893, 11h, 11°C". Variar mês/hora/temperatura mudaria o ritmo da degradação e a atmosfera. | Cria sensação de "mesmo dia, mesma hora, outra vila" |

### 5.3 Prioridade Média — UX e Onboarding

| # | Sugestão | Justificativa |
|---|----------|---------------|
| M13 | **Adicionar tooltip de onboarding na escrivaninha.** "Clique em um local no mapa para começar a investigação" ao primeiro acesso. | Jogadores de primeira viagem ficam desorientados |
| M14 | **Sinalizar NPCs embutidos** com destaque visual no botão de diálogo ou na contagem de observações. | Davey e Walter podem ser perdidos |
| M15 | **Explicar a Estação V do mural** com um texto contextual antes da primeira submissão. "Para declarar inocência, ligue a evidência que desmente o álibi." | Mecânica não-óbvia causa frustração |
| M16 | **Indicar a escolha de contradição como hipótese de trabalho,** não como decisão irreversível, dado que não afeta o veredicto. | Gera ansiedade desnecessária |
| M17 | **Remover ou sinalizar localidades vazias.** A vizinhança na Réplica/Procedural custa tempo e não dá nada. | Punição injusta |
| M18 | **Advertir sobre degradação** na primeira visita ao corpo. "A evidência temporal se degrada com as horas. Examine o corpo antes de viajar." | Jogador pode não entender urgência |

### 5.4 Prioridade Média — Conteúdo Gerado

| # | Sugestão | Justificativa |
|---|----------|---------------|
| M19 | **Não entregar a solução numa única carta.** O `gen_instrumento` "abandonado" nomeia suspeito + arma + conexão. Separar em 2-3 observações que o jogador precise conectar. | No tutorial, são necessárias 3 cartas (pó na ferida → buril → estojo de Silas). No procedural, 1 carta resolve tudo |
| M20 | **Gerar cartas para detalhes da cena.** A prosa menciona chão esfregado, mobília deslocada, marcas de arrasto — mas não há cartas correspondentes. | Desconexão narrativa/mecânica |
| M21 | **Suprimir livor contraditório quando `cenaEncenada: false`.** Se o jogo não reconhece staging, o corpo não deveria mostrar evidência de movimentação. | Contradição interna |
| M22 | **Variar a prosa da abertura** para cada caso procedural. Pelo menos mudar a pensão, o meio de transporte, ou a hora da chegada. | 8 aberturas idênticas são notáveis |
| M23 | **Variar textos de `gen_lesao_fatal` por caso** mesmo quando o método é o mesmo. Localização da ferida, profundidade, detalhes circunstanciais. | Texto idêntico em casos de mesmo método é perceptível |
| M24 | **Converter detalhes atmosféricos da cena em cartas de vestígio.** O gerador já produz `rastro_da_luta`, `assoalho_esfregado`, `trilha_arrasto` — transformá-los em cartas coletáveis. | Profundidade mecânica da cena |

### 5.5 Prioridade Baixa — Polish e Acessibilidade

| # | Sugestão | Justificativa |
|---|----------|---------------|
| M25 | **Adicionar navegação por teclado** às cartas da mesa. Tab + Enter para abrir ficha; setas para reposicionar. | Acessibilidade |
| M26 | **Padronizar ornamentos tipográficos** (§, ¶, blackletter). Usar um vocabulário visual consistente. | Inconsistência sutil |
| M27 | **Renderizar placeholder estilizado** em vez de ID cru quando definição de carta está ausente em `ProsaComTermos`. | Bug defensivo |
| M28 | **Considerar um "modo campanha"** que encadeie tutorial → réplica → procedurais com dificuldade crescente. | Arco de progressão |
| M29 | **Implementar segundo personagem jogável** (o código já suporta nome/gênero/pronome dinâmicos via interpolar.js). | Replayability narrativa |
| M30 | **Adicionar trilha sonora ambiente** (tic-tac de relógio, chuva, lareira). Os 5 efeitos sonoros existentes são excelentes; música de fundo completaria a atmosfera. | Imersão |

---

## 6. Resumo dos Finais por Modo

### 6.1 Tutorial — "A Hora Emprestada"

| Final | Alcançável? | Caminho |
|-------|------------|---------|
| Vitória Absoluta | Sim | Acusar Silas, janela 21-22h, causa ferida_arma_branca, nexo buril, motivação silenciamento, encenação exposta, 4 periféricos corretos |
| Sucesso com Gafes | Sim | Acusar Silas com cadeia sustentada mas janela >6h, ou motivação errada, ou encenação não exposta, ou periféricos incompletos |
| Impunidade | Sim | Acusar Silas sem sustentar cadeia (falta janela, mecanismo ou nexo) |
| Erro Judiciário | Sim | Acusar Walter (a armadilha), Agnes, Grey ou Davey |

### 6.2 Réplica — "A Hora Refeita"

| Final | Alcançável? | Caminho |
|-------|------------|---------|
| Vitória Absoluta | Sim | Acusar Mary Walker + janela [-5,-1] + mecanismo + nexo + motivação |
| Sucesso com Gafes | Sim | Acusar Mary Walker com janela >6h ou motivação errada (únicas dimensões de falha) |
| Impunidade | Sim | Acusar Mary Walker sem cadeia sustentada |
| Erro Judiciário | Sim | Acusar qualquer dos 4 outros suspeitos |

### 6.3 Procedural — "Um Caso da Comarca" (todos os 8 casos)

| Final | Alcançável? | Bloqueio? |
|-------|------------|-----------|
| Vitória Absoluta | Sim, em todos os 8 | Nenhum |
| Sucesso com Gafes | Sim, em todos os 8 | Apenas 2 dimensões de falha (janela, motivação) |
| Impunidade | Sim, em todos os 8 | Nenhum |
| Erro Judiciário | Sim, em todos os 8 | Nenhum |

**Nenhum final está bloqueado em nenhum modo de jogo.** A cadeia de evidências é sempre completa e solvável. O problema dos modos gerados não é de alcançabilidade — é de profundidade. A Vitória Absoluta no procedural exige ~10 minutos de coleta mecânica; no tutorial, exige 60+ minutos de raciocínio dedutivo.

---

## 7. Veredito Final

Mortem tem um motor forense e um caso tutorial de qualidade excepcional. O "A Hora Emprestada" é um dos melhores casos de mistério dedutivo que já testei — justo, complexo, atmosférico, com prosa magistral e um sistema de acusação que recompensa pensamento genuíno.

O desafio do projeto está nos modos gerados. O gerador procedural é engenhosamente construído (autobattler, interferência com regras de justiça, inserção espacial, árvores de diálogo), mas os casos que produz ativam apenas uma fração dos sistemas disponíveis. O resultado é uma experiência que funciona mecanicamente mas carece da densidade intelectual e emocional que faz o tutorial brilhar.

As melhorias sugeridas (M1-M6) atacam diretamente esta lacuna: ativar staging, periféricos, iscas, diálogos variados e álibis conflitantes nos casos gerados. Com estes sistemas ligados, o gerador procedural tem potencial para produzir casos genuinamente desafiadores e replayáveis.

O vertical slice está **funcional e completo** como demonstração de conceito. Para se tornar um produto, precisa que o nível de qualidade do tutorial irradie para os modos gerados.

---

*Relatório gerado em 16/07/2026 — playtest isento, perspectiva de jogador.*
