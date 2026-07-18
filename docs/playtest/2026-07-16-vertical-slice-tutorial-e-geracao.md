# MORTEM — Relatório de Playtest do Vertical Slice

**Data:** 16 de julho de 2026  
**Avaliador:** Playtest qualitativo e funcional (perspectiva de jogador)  
**Build:** Vite + React (build limpa, sem erros, sem warnings)  
**Escopo:** Caso tutorial "A Hora Emprestada" + sistemas gerados proceduralmente

---

## 1. Impressões Gerais — O Que Se Sente Ao Jogar

MORTEM é um jogo de investigação forense vitoriana onde o jogador, no papel do Dr. Harlan Blackwell, examina um cadáver, percorre uma vila, interroga suspeitos e monta uma acusação formal. O caso tutorial gira em torno do assassinato de um relojoeiro em Briarstone, Inglaterra, outubro de 1893.

A primeira sensação é de **imersão forte**. O tema visual — madeira escura, pergaminho, lacre de cera, gravura vitoriana — é extraordinariamente coeso. Tudo é procedural (texturas em SVG inline, sem imagens externas), e ainda assim parece artesanal. A fonte IM Fell English, a paleta âmbar/pedra, as animações "boil" nas linhas desenhadas à mão e a iluminação do diorama 3D que acompanha a hora do jogo criam um ambiente que se sustenta sozinho.

O som é mínimo (5 efeitos) mas bem escolhido — papel, sino, barbante, lacre, pena — todos reforçam a metáfora física da mesa de trabalho. A humanização aleatória de pitch e gain evita repetição mecânica.

A sensação de **ser um perito forense real** é o ponto mais alto. O jogo não diz o que fazer — apresenta o corpo, os locais, os depoimentos, e espera que o jogador construa a tese. A cadeia de acusação em 5 estações (Corpo, Presença, Mentiras, Móbil, Juízos) é progressiva e intuitiva.

---

## 2. Teste Funcional — Build e Estabilidade

| Item | Status | Observação |
|------|--------|------------|
| npm install | OK | 209 pacotes, 2 deprecation warnings (uuid, three-mesh-bvh) |
| Build (vite) | OK | Zero erros, zero warnings |
| Bundle principal | 481 KB (gzip 131 KB) | Razoável |
| Chunk Three.js/R3F | 819 KB (lazy-loaded) | Limite de 900 KB configurado intencionalmente |
| Fallback 2D quando WebGL falha | OK | Error Boundary + `?flat=1` como escape hatch |
| Persistência de save (localStorage) | OK | Chave hardcoded `mortem-caso-tutorial` |
| Reduced motion | OK | 5 blocos @media distintos |
| Mobile | Parcial | Touch targets 44px, safe-area, dvh — mas diorama 3D requer scroll horizontal |
| Vulnerabilidades npm | 4 (3 moderadas, 1 alta) | Em dependências transitivas |

**Nenhum bug crítico encontrado no código.** Imports corretos, referências válidas, lógica do veredito consistente.

---

## 3. Fluxo de Jogo Completo — Passo a Passo

### Fase 1: Seleção
Tela com "MORTEM — Inglaterra, 1893". Seleção de modo (tutorial, réplica procedural, caso de comarca) e confirmação do único personagem jogável. Toggle de modo purista e escape 2D. Se há save, mostra hora atual com opções Continuar/Reiniciar.

### Fase 2: Abertura
Sequência narrativa de 6 passos — carta-convocação em pergaminho, viagem, briefing do Delegado Wycliffe com perguntas expansíveis sem custo de tempo. O botão "Entrar" inicia a investigação.

### Fase 3: Investigação
Hub permanente: a escrivaninha. Tudo acontece em overlays empilhados. O jogador navega pelo mapa (3D diorama ou grade 2D), examina locais, extrai evidências clicando em termos em negrito no texto, interroga suspeitos escolhendo tons de diálogo (firme/cordial/técnico/oblíquo), consulta a caderneta, e constrói a acusação no mural.

**Relógio mole:** Só viajar custa tempo. Examinar, interrogar, pensar — tudo gratuito. Evidências perecíveis (rigor mortis, temperatura) degradam com o tempo, mas evidências duráveis (livores, relógio de bolso, registros) nunca degradam.

### Fase 4: Acusação
5 estações progressivas no mural de cortiça:
1. **O Corpo** — janela de morte e causa
2. **A Presença** — nomear réu e ligar vestígios
3. **As Mentiras** — ligar evidências que refutam declarações
4. **O Móbil** — selecionar carta de motivação
5. **Os Juízos** — classificar cada não-acusado (inocente/cúmplice/sem juízo)

Sistema de barbantes (SVG com catenária e animação boil) conecta cartas a âncoras.

### Fase 5: Monólogo e Epílogo
Após submissão, o detetive reflete em primeira pessoa. Nunca nomeia o culpado verdadeiro em caso de erro. Dicas tutorial escalam em reincidência. O jogador pode revisar (custo: 2 horas) ou encerrar o caso.

---

## 4. Todos os Finais Possíveis — Acessibilidade

### Final 1: Vitória Absoluta
**Condição:** Todos os 7 pilares corretos + janela precisa (≤6h) + motivação + encenação exposta + juízos periféricos + sem vestígio acessório errado.

**Como chegar:**
- Réu: Silas Crane
- Quando: Ligar ev_maquinismo (registro mecânico, janela [-3, -2]) → janela de 1 hora cobrindo 21:00
- Como: Ligar ev_ferida (ferida incisa) → crava ferida_arma_branca
- Presença: Ligar ev_estojo_buril (buril de Silas)
- Motivação: ev_livro_ordens ou corrob_pettigrew (silenciamento)
- Encenação: Ligar ev_relogio_lareira ao temporal → refuta hora forjada 08:45
- Juízos: Walter (inocente + refutar alibi com ev_suplica_cesto ou ev_registro_estalagem), Agnes (inocente + refutar com ev_cesta_rooke), Caleb e Davey (inocente — basta declarar)

**Acessível?** SIM. Todas as cartas necessárias estão em locais desbloqueados desde o início. Agnes tem um único caminho (ev_cesta_rooke é a única carta que revela seu segredo), o que é um ponto de atenção de design — mas funciona.

### Final 2: Sucesso com Gafes
**Condição:** Réu correto + cadeia sustentada, mas com imperfeições (janela imprecisa, motivação errada, encenação não exposta, juízo periférico errado, ou vestígio acessório).

**Como chegar (exemplo):** Acusar Silas corretamente, ligar ev_ferida + ev_estojo_buril + ev_maquinismo, mas não expor a encenação do relógio da lareira.

**Acessível?** SIM. Múltiplos caminhos fáceis.

### Final 3: Impunidade
**Condição:** Réu correto, mas cadeia não sustentada (faltam links de tempo, causa, ou presença).

**Como chegar:** Nomear Silas mas não ligar evidências suficientes aos âncoras.

**Acessível?** SIM. Trivialmente.

### Final 4: Erro Judiciário
**Condição:** Réu errado.

**Como chegar:** Acusar Walter (a isca do apressado — herdeiro endividado), Agnes, Caleb ou Davey.

**Acessível?** SIM. O jogo deliberadamente planta Walter como armadilha convincente.

### Resumo de Finais

| Final | Acessível | Dificuldade para o jogador | Risco de travamento |
|-------|-----------|---------------------------|---------------------|
| Vitória Absoluta | SIM | Alta (exige coleta meticulosa) | Nenhum |
| Sucesso com Gafes | SIM | Média | Nenhum |
| Impunidade | SIM | Baixa | Nenhum |
| Erro Judiciário | SIM | Nenhuma (qualquer réu errado) | Nenhum |

**Nenhum final está travado. Nenhuma evidência é inacessível. O jogador nunca fica sem opções.**

---

## 5. Análise Qualitativa — Perspectiva de Jogador

### 5.1 O Que Funciona Muito Bem

**Narrativa e ambientação.** O caso "A Hora Emprestada" é brilhantemente construído. O título é uma pista (a hora emprestada é a hora forjada no relógio da lareira). Cada suspeito tem uma função narrativa precisa: Silas é o assassino que encenou a cena, Walter é a isca do apressado, Agnes esconde um noivado por decoro, Caleb é ruído que codifica a pista real (sua queixa revela a fraude de Silas), e Davey é o mentiroso por medo (treinado por Silas, repete as mesmas palavras).

**O sistema de evidências com duas camadas.** O jogador vê texto narrativo; a máquina lê tagsOcultas. Isso significa que o jogo nunca "engana" — a lógica é separada da apresentação. É um design elegante.

**A degradação temporal.** Evidências perecíveis que pioram conforme o jogador perde tempo viajando criam tensão real sem um timer explícito. O rigor mortis tem 4 estados com janelas temporais cada vez mais imprecisas. A temperatura corporal converge para o ambiente. O relógio de bolso e os livores são âncoras duráveis que recompensam exame precoce do corpo.

**Os interrogatórios com 4 tons.** A escolha entre firme/cordial/técnico/oblíquo não é cosmética — cada personagem tem um tom ressonante que revela informação bônus. Silas só entrega o caco de vidro no tom oblíquo. Agnes só abre a guarda com cordialidade. A árvore desce e nunca retorna, então cada escolha tem peso.

**O mural de acusação progressivo.** As 5 estações que se revelam uma a uma previnem sobrecarga cognitiva. O sistema de barbantes com catenária e animação boil é satisfatório de usar. A revisão final antes da submissão é neutra (não indica certo/errado).

**O fallback 2D.** Impressionantemente robusto. Se WebGL falha, o jogo continua sem perda de funcionalidade. O Error Boundary captura tanto exceções de render quanto perda de contexto WebGL. Lazy loading com Suspense mostra a grade 2D enquanto Three.js carrega.

### 5.2 Pontos de Fricção (O Que Incomoda Como Jogador)

**Sem onboarding.** Um jogador novo não sabe que termos em negrito são clicáveis, que clicar extrai evidências, o que o relógio de bolso significa, ou como funciona o sistema de tons nos interrogatórios. O jogo assume literacia com suas metáforas desde o primeiro segundo. As perguntas no briefing de Wycliffe ajudam, mas não cobrem mecânicas de interface.

**A caderneta é uma lista plana.** Com 28+ evidências possíveis, rolar uma lista cronológica sem filtro, busca ou categorização é trabalhoso. O mural de acusação organiza por tipo (temporal, causal, vestígio), mas a caderneta não espelha essa organização. Para um jogo que exige cruzar informações, essa é a maior fricção prática.

**A escolha de contradição é irrevogável sem confirmação.** Quando o relato do padeiro e as evidências do corpo entram em conflito, a caderneta apresenta uma escolha binária ("Parto do relato do moço" vs. "Parto do que o corpo diz"). É irreversível, sem "tem certeza?", e — como descobri — puramente narrativa (não afeta o veredito). A irreversibilidade pode causar ansiedade desnecessária; a irrelevância mecânica pode causar decepção.

**O toast de extração de evidência desaparece em 2.2 segundos.** Para um leitor mais lento ou alguém absorto no texto, o aviso de que uma carta foi registrada pode passar despercebido.

**Sem indicador de urgência.** O relógio de bolso mostra a hora, mas não há barra de tempo, aviso de "evidência degradando", ou qualquer comunicação de que o tempo importa. O jogador só descobre a consequência (evidência menos precisa) ao examinar — ou pior, no veredito. Isso pode ser intencional (descoberta orgânica), mas também pode frustrar.

**Hotspots 3D são puramente visuais.** Não há contagem de "regiões restantes" no exame do corpo, nem tooltip, nem indicação de quantas áreas existem. O jogador precisa varrer o mouse pela tela para encontrar esferas semi-transparentes.

**Sem acesso por teclado aos hotspots 3D.** A planta baixa tem `role="button"` e handlers de teclado. O corpo 3D não tem equivalente — é pointer-only. Jogadores usando teclado ou screen readers ficam sem acesso a essa mecânica.

**Sem leitor de tela para eventos dinâmicos.** Extração de evidência, passagem de tempo, conclusão de estação — nenhum recebe anúncio ARIA. O toast é visual-only.

**O linking do mural não tem "cancelar" explícito.** Ao clicar uma carta para iniciar um barbante, não há botão de cancelar — é preciso clicar a mesma carta de novo ou no vazio. Pouco intuitivo.

---

## 6. Bugs e Problemas Técnicos

| Severidade | Item | Detalhe |
|-----------|------|---------|
| Baixa | `registrarConfronto()` é stub inerte | Método existe no store mas não faz nada. Código morto. |
| Baixa | Save em slot único | Chave `mortem-caso-tutorial` é hardcoded — jogar outro modo sobrescreve o save anterior |
| Baixa | `?direto` pula a abertura | Atalho de dev que, se vazar para produção, permite bypass do setup narrativo |
| Info | Personagem único na tela de seleção | UI de seleção existe mas só há Dr. Blackwell. Vestigial para o momento |
| Info | Fumaça estática nas chaminés | Demand frameloop impede animação contínua — esferas congeladas simulam fumaça |
| Info | 4 vulnerabilidades npm | Em dependências transitivas; não afetam o jogo diretamente |

**Nenhum bug que impeça gameplay, corrompa save ou trave a aplicação.**

---

## 7. Sugestões de Melhorias Futuras

### 7.1 Prioridade Alta (Impacto direto na experiência)

**Tutorial contextual para primeira partida.** Não precisa ser um tutorial separado — tooltips contextuais bastam. Na primeira vez que o jogador vê um termo em negrito: "Termos em negrito são pistas. Clique para registrar." Na primeira viagem: "Viajar custa tempo. Evidências perecíveis degradam." No primeiro interrogatório: "O tom que você escolher influencia o que o suspeito revela. A conversa não retorna." Depois da primeira partida, nunca mais aparecem.

**Organização da caderneta por domínio.** Adicionar abas ou filtros: Temporal, Causal, Ambiental, Comportamental, Vestígio. Permitir busca textual. Mostrar tags extraídas por carta. Isso transformaria a caderneta de "depósito de cartas" em "ferramenta de dedução".

**Indicador sutil de degradação temporal.** Não precisa ser uma barra vermelha piscante — pode ser o pergaminho do corpo ficando levemente amarelado, ou o relógio de bolso ganhando uma marca sutil quando evidências perecíveis existem sem ter sido examinadas. Algo que comunique "o corpo está mudando" sem quebrar a imersão.

**Confirmação na escolha de contradição.** Adicionar um "Tem certeza? Esta escolha é definitiva." antes de selar a decisão do padeiro vs. corpo. Ou, se a intenção é que seja uma decisão sob pressão, comunicar isso melhor.

### 7.2 Prioridade Média (Melhorias de polish)

**Contagem de hotspots no corpo.** Algo como "3 regiões por examinar" discretamente no canto do painel 3D. Não revela quais — só quantas. Reduz a frustração de "será que perdi algo?".

**Toast de evidência com duração ajustável ou persistente até clicar.** 2.2 segundos é pouco. Alternativa: o toast fica até o jogador clicar nele ou em qualquer outro lugar.

**Affordance de cancelamento no mural.** Quando o jogador inicia um barbante, mostrar um "X Cancelar" discreto no canto, ou mudar o cursor para indicar "selecionando destino".

**Acessibilidade do corpo 3D.** Adicionar navegação por teclado (Tab entre hotspots) e aria-labels ("Região: pescoço — clique para examinar").

**Save slots múltiplos.** Pelo menos separar por modo (tutorial vs. procedural). Idealmente, permitir 2-3 saves.

**Música ambiente.** Um drone sutil ou loop de cordas que reforce a atmosfera sem distrair. Com toggle (já existe infraestrutura de toggle de som).

### 7.3 Prioridade Baixa (Futuro / Conteúdo)

**Segundo personagem jogável.** A infraestrutura de seleção existe. Um segundo detetive com voz narrativa diferente (talvez uma mulher forense, rara mas não impossível em 1893) ampliaria a rejogabilidade.

**Modo escuro vs. claro.** O jogo é todo escuro — uma opção de "mesa de dia" poderia atender jogadores sensíveis a telas escuras prolongadas.

**Pontuação ou ranking.** O "retrato da investigação" no epílogo mostra estatísticas (locais visitados, cartas registradas, submissões), mas não há score. Um sistema de estrelas ou ranking (ouro/prata/bronze baseado em eficiência temporal + completude) incentivaria replay.

**Log de pistas cruzadas.** Quando o jogador extrai duas cartas que se contradizem ou se complementam, uma nota automática na caderneta ("Esta informação conflita com X" ou "Isso reforça Y") ajudaria a construir conexões sem entregar respostas.

**Efeitos sonoros adicionais.** Sons de interrogatório (murmúrio distante quando abre o diálogo), ambiente de localidade (vento no moinho, sinos na delegacia), feedback tátil para ações inválidas no mural.

**Acessibilidade expandida.** High-contrast mode, screen reader completo para eventos dinâmicos, support para daltonismo (as cores âmbar/pedra são relativamente seguras, mas os hotspots 3D dependem de matiz âmbar vs. ouro).

**Sistema de interferência expandido.** Os casos gerados já têm uma infraestrutura de "interferência" onde o assassino reage à investigação (destruindo evidências, intimidando testemunhas). No caso tutorial isso não está ativo — ativá-lo adicionaria tensão e rejogabilidade significativas.

---

## 8. Avaliação da Geração Procedural

O sistema de geração (pasta `src/gerador/`) é ambicioso: um autobattler simula o crime, gera a "verdade de ouro", e distribui evidências com base no currículo forense progressivo do jogador. Os 3 casos gerados encontrados no pool (gerado_comarca_1 a 3) mostram variedade (estrangulamento por ligadura, facada, estrangulamento manual) com motivos distintos (herança, seguro de sepultamento, despejo).

O caso gerado_comarca_2 inclui interferência (o assassino silencia uma testemunha, criando potencialmente um segundo corpo) — um sistema sofisticado que adiciona dinamismo, mas que precisa de mais testes com jogadores para validar se a comunicação narrativa acompanha a complexidade mecânica.

A réplica procedural do tutorial (CASO_REPLICA) recria "A Hora Emprestada" com personagens diferentes (Ada Thomas como vítima, Mary Walker como assassina) — um teste de generalização do gerador.

**Risco:** O cap de 24 tentativas no autobattler antes de forçar vitória do assassino pode produzir distribuições estatísticas incomuns em edge cases. Recomendo logging e validação probabilística.

---

## 9. Resumo Executivo

### O jogo está pronto para teste com jogadores?
**Sim, com ressalvas.** O caso tutorial é completo, todos os finais são acessíveis, a build é limpa, e não há bugs que impeçam gameplay. A identidade visual e narrativa são pontos fortíssimos.

### O que falta para shipping?
1. Onboarding para novos jogadores (tooltip contextual)
2. Organização da caderneta (filtros por domínio)
3. Feedback de degradação temporal
4. Testes com jogadores reais para validar:
   - O jogador encontra os hotspots 3D sem orientação?
   - O jogador entende que o tom no interrogatório importa?
   - O jogador descobre a encenação do relógio da lareira?
   - Agnes tem um único caminho para o juízo periférico — isso frustra ou recompensa?

### Nota qualitativa (como jogador)
MORTEM é um dos projetos de investigação mais bem pensados que já analisei. A separação entre camada narrativa e camada lógica, o relógio mole, a degradação temporal, e a acusação em 5 estações criam um sistema onde *pensar como perito* é genuinamente recompensado. O maior risco é perder jogadores no primeiro contato por falta de onboarding — o jogo é denso e assume muito do jogador. Com um tutorial contextual mínimo e uma caderneta organizada, este vertical slice tem qualidade de produto comercial.

---

*Relatório gerado via análise exaustiva do código-fonte (95 arquivos JS/JSX, 900 linhas CSS, dados de caso, lógica de veredito, geração procedural). Todos os caminhos de evidência foram traçados e verificados. Nenhum final está inacessível. Nenhum estado de travamento foi identificado.*
