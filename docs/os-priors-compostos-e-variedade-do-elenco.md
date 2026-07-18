# OS — Priors compostos, anti-tell estendido e expansão de variedade do elenco

**Data:** 18 de julho de 2026 · **Uso:** esta OS é um prompt de sessão (pesquisa + design + implementação)
**Origem:** relatório de design de 18/07/2026 (vetor de criação do elenco e camada psíquica) e discussão de calibração da mesma data
**Normas-mãe:** `docs/game-design-simulacao.md` §3–4 · `docs/os-camada-psiquica-do-elenco.md` (ata de 17/07) · KB de demografia · `kb-producao/sistemas-arquetipicos-alem-dos-12.md` · `kb-medicina-legal`
**Artefatos-alvo:** `src/gerador/amostragem.js` · `arquetipos.js` · `vetores_psiquicos.js` · `quantizacao.js` · `caso.js` · `qa.mjs` · pools embarcados

---

## §0 — Como executar esta OS

A sessão que receber esta OS deve:

1. Ler primeiro, nesta ordem: o relatório de 18/07, as normas-mãe e os arquivos-alvo.
2. Executar as fases em ordem (F0 → F4). Cada fase produz o entregável nomeado na própria seção. Não pular F0.
3. Tratar todo item marcado **[DECISÃO]** como pergunta ao autor, jamais como escolha unilateral: apresentar opções com números e uma recomendação, e aguardar resposta antes do merge da fase.
4. Herdar como **invioláveis**:
   - Determinismo total por `hashString` sobre chave salgada; zero `Math.random`, zero rede/LLM em runtime.
   - Convenção de sal `seed|elenco|indice|decisao[|tentativa]`; proibido reusar sal entre decisões distintas; toda decisão nova desta OS ganha sufixo de decisão novo, listado no PR.
   - Motor de runtime cego a rótulos: jamais importar `arquetipos.js` ou `vetores_psiquicos.js` em runtime; rótulos morrem no log de build; ao pacote só chegam consequências.
   - Lint L1 (nosologia pós-1893 banida de qualquer superfície de jogo) e L2 (sombra/persona/vetor/desencaixe/complexo banidos de identificadores, chaves e glossário) sobre tudo que nascer desta OS.
   - Proveniência: nenhum dado quantitativo novo sem fonte citada; separar explicitamente "tem fonte" de "chute calibrável".
   - Invariante do círculo social: o autor pertence sempre ao círculo da vítima.
   - **Trava dura: nada envolvendo menores entra no espaço gerativo, em nenhuma camada.**
5. **Contrato de conteúdo:** qualquer mudança de pool ou peso muda todos os casos gerados. Toda fase que tocar dado embarcado entrega, no mesmo commit: bump de versão de conteúdo, regeneração do golden set e a lista de sais novos no cabeçalho do PR.

Escopo dos lints: L1/L2 valem para superfícies de jogo, identificadores e glossário. Os dossiês internos de F1 podem usar vocabulário técnico livremente, como a KB de produção já faz.

---

## §1 — F0: triagem da "artificialidade" antes de refatorar

Hipótese de trabalho: a artificialidade sentida em playtest tem três origens distintas, com remédios distintos; refatorar sem triagem trata a errada.

| Caixa | Descrição | Remédio |
|---|---|---|
| **A. Invariantes aprendíveis** | Padrões fixos entre casos: piso de exatamente 2 destoantes; móbil do réu ≈ função do ofício (12/14 com um só raro); só 2 mentirosos por caso; mentira calma com precisão 100% (assinatura do réu); prioridade coabitante da isca | §4 (F3) |
| **B. Estreiteza distribucional** | Pools curtos (~35 prenomes, traits 1–3, motivos 2–4); moedas universais (50/25, 1/3 do segundo trait); valor 3 mudo na quantização; composição sempre ~2,5 lavradores | §2 (F1) e §5 (F4) |
| **C. Dado sem boca** | Flags psíquicas ainda não consumidas por `dialogos_gerados.js` (nota nº 1 da ata de 17/07): o dado viaja, o efeito dramático não | OS de diálogo (fora desta) |

**Entregável F0:** tabela reclamação-de-playtest → caixa → OS responsável, com uma linha de justificativa por item.

**Regra de parada:** se a maioria das reclamações cair na caixa C, recomendar formalmente priorizar a OS de diálogo antes de F2–F4 e aguardar **[DECISÃO]** sobre a ordem.

---

## §2 — F1: pesquisa aprofundada por variável

Para **cada** variável abaixo, o dossiê de F1 contém obrigatoriamente:
(a) auditoria estatística do estado atual (Monte Carlo ≥ 200 mil elencos, reproduzindo o método do relatório);
(b) levantamento histórico com fonte primária ou KB (censos de 1881/1891, registros paroquiais, dados salariais de época, `kb-medicina-legal`);
(c) proposta de expansão/reforma com pesos inteiros;
(d) impacto a jusante calculado (probabilidades novas, tabelas afetadas);
(e) rotulagem fonte × chute calibrável, item a item.

### §2.1 Arquétipos / profissões (14 → teto 18 **[DECISÃO]**)

Investigar no censo rural da jurisdição os candidatos: sacristão-coveiro, carroceiro, guarda-caça, parteira, pastor de ovelhas, estalajadeiro, jornaleiro itinerante, coadjutor — e outros que a fonte sustentar. Cada adição exige a coluna completa: peso de frequência com fonte, flag `unicoNaVila`, 20 inteiros de prior (sob a norma N1 do §3), pool de traits, pool de motivos com aritmética de época, linha inteira na matriz de afinidade (com raros sob §4.1). Atenção: a soma de pesos (hoje 40) muda; a Tabela 1 do relatório é regenerada. Avaliar também o equilíbrio de gênero do elenco resultante.

### §2.2 Vetores psíquicos (11 → teto 13 **[DECISÃO]**)

Todo candidato passa pelos mesmos filtros que reprovaram o médium: **ortogonalidade à profissão** (qualquer ofício pode hospedá-lo), mapeia exatamente **uma** ação sob ataque, sombra bipolar ativa/passiva definida, medo central + tema de gatilho, auto-justificação, e coluna completa na matriz de afinidade. F1 propõe 2–3 candidatos com ficha completa e recomendação fundamentada (aprovar/reprovar com motivo, como na ata do médium).

### §2.3 Priors de atributo e o mapa de tilt

Auditar os 280 inteiros atuais contra a norma §3.2 do design (quadrantes INT × WIS alcançáveis em qualquer arquétipo) — a lavadeira INT `[2,4,2,1,0]` é violação conhecida (INT 5 impossível) e caso-teste. Propor: (i) as novas 5-tuplas de acesso por arquétipo (INT/WIS achatados, FOR com pisos mantidos); (ii) o mapa completo de `tiltAtributos` por vetor (§3.2 desta OS), com justificativa por par vetor × atributo.

### §2.4 Traits (pools 1–3 → 3–5)

Restrição de arquitetura: cada trait novo = comportamento **nomeado** novo no catálogo fechado, mapeado 1-para-1 a efeito observável de interrogatório (nada de modificador contínuo). O custo real é boca + QA, não o sorteio. Teto de crescimento do catálogo de comportamentos: +2 a +4 **[DECISÃO]**. Avaliar variar por arquétipo a chance do segundo trait (hoje 1/3 universal).

### §2.5 Motivos potenciais (pools 2–4 → 4–6)

Expansão com a aritmética da KB citada por item (o que £2 fazem com quem). Manter o contrato: motivo é semente promovível a móbil, economicamente plausível para aquela vida.

### §2.6 Nomes

Prenomes: expandir as duas coortes de batismo (~35 → ~50–60 por coorte) a partir de listas de frequência do censo/registros paroquiais; avaliar **pesos de frequência** nos prenomes (nomes comuns mais prováveis) em vez de sorteio uniforme — mesmo formato inteiro, fonte citada. Sobrenomes: 30 → ~50, regionais à comarca da ambientação, mantendo a política de repetição (2–3 por vila) e os vetos existentes (par completo único por caso; anti-"Thomas Thomas").

### §2.7 Matriz de afinidade: os novos raros

Propor, com justificativa dramática por par (uma vocação estrangulada plausível para aquele ofício), um **segundo encaixe raro para todos os ofícios** e um terceiro onde couber, mantendo a razão 4:2:1 e o peso mínimo 1. Recalcular a matriz inteira (Apêndice B) e os efeitos do §4.1.

### §2.8 Constantes universais candidatas a virar dado

Pesquisar fundamento histórico para modular por classe/ofício: `omite_por_decoro` (50% plano — decoro e respeitabilidade eram performáticos por classe em 1893); chance do segundo trait (1/3); `mente_com_calma` (25% — ver §4.4). **Regra:** sem fonte ou razão dramática registrada, a constante fica como está — honestidade epistêmica acima de variedade cosmética.

### §2.9 Encenação — pesquisa sim, expansão bloqueada

Levantar na `kb-medicina-legal` candidatos a novos itens dos pools reativo/instrumental, **mas não expandir**: 6 dos 8 itens atuais ainda não têm realização física, e dado sem física é meio-sistema. A expansão fica bloqueada até a OS própria de realização (cartas de vestígio). Registrar lá a sobreposição conceitual WIS × qualidade de encenação como risco a vigiar.

### §2.10 A vítima

O vetor da vítima hoje só vira portão de reação e morre no log. Avaliar superfície barata da biografia íntima: ganchos de prosa do inquérito (coroner, vizinhança) alimentados pelas consequências do vetor da vítima — nunca o rótulo. Depende da OS de diálogo; registrar o achado aqui, decidir lá **[DECISÃO]**.

**Entregável F1:** um dossiê por variável (§2.1–§2.10), cada um com os itens (a)–(e), fechando com a lista consolidada de propostas e seus **[DECISÃO]** pendentes.

---

## §3 — F2: o prior composto (corpo do ofício, mente da psique)

### §3.1 Princípio causal (normativo)

Em 1893, o berço dita o ofício; a psique negocia com ele — a afinidade já modela seleção e retenção, e o desencaixe modela a negociação que falha. Portanto: **o corpo é do ofício; o acesso é do berço; a mente é da psique dentro do acesso.** Fica vetada a inversão completa (psique ditar profissão): contradiz a tese do desencaixe e o mundo histórico.

### §3.2 Mecânica

1. `arquetipos.js` — os priors passam a codificar **acesso e corpo**:
   - FOR mantém pisos duros via peso 0 onde o ofício forja o corpo (o ferreiro `[0,0,2,4,3]` permanece correto por construção).
   - INT e WIS viram curvas de acesso: modo deslocado conforme instrução/vida do ofício, cauda jamais zerada.
   - **Norma N1:** nenhum arquétipo pode ter peso 0 nos extremos de INT, WIS ou CHA (bandas 1–2 e 4–5). Os quatro fenótipos de assassino (§3.2 do design) devem ser alcançáveis em qualquer ofício; revelação fácil/custosa idem.
2. `vetores_psiquicos.js` — campo novo `tiltAtributos`: por vetor, multiplicadores **inteiros** por banda de valor, no mesmo formato de 5 posições. Exemplo de formato (o mapa completo vem de F1 §2.3): Erudito INT `[1,1,1,2,2]`; Vigia WIS `[1,1,1,2,2]`; Bufão CHA `[1,1,1,2,2]`.
   - **Norma N2:** o tilt jamais toca FOR — o corpo não é da psique.
   - **Norma N3:** todo multiplicador ≥ 1 — o tilt inclina, nunca proíbe (par com "afinidade, jamais restrição dura").
3. `amostragem.js` — peso efetivo do valor *i* = `peso_arquetipo[i] × tilt_vetor[i]`; sorteio pelo mesmo `hashString`, com sufixo de decisão novo (ex.: `atributo-composto:INT`).

### §3.3 Reordenação do pipeline e cascata de forçamento

Ordem nova por personagem: arquétipo → gênero → faixa → idade → nome → **vetor + polaridade** → atributos (compostos) → traits → motivo → quantização.

Quando o caso força vetor (réu com magnitude alvo; isca destoante), o forçamento dispara **re-derivação em cascata** de tudo a jusante do vetor: atributos, quantização e flags são re-derivados com componente de sal `…|forcado|tentativa`. Traits e motivo não mudam (pertencem ao arquétipo). Proibido qualquer resíduo pré-forçamento no pacote — o replay byte a byte é a guarda natural.

### §3.4 Guardas novas de F2

- **G1** (pré-tilt): para todo arquétipo, pesos de INT/WIS/CHA não-zero nas bandas 1–2 e 4–5. FOR isento.
- **G2** (pós-tilt): para todo par arquétipo × vetor, a distribuição composta respeita N1 (decorre de N3; verificar mesmo assim).
- **G3** (cascata): função de derivação pura + teste unitário de que o forçamento de vetor re-deriva atributos e quantização; replay cobre o resto.
- **G4** (simetria réu × isca): réu e isca passam pelas mesmas regras de derivação; em lote ≥ 50 seeds, a distribuição de INT alto entre destoantes inocentes e réus fica dentro de banda **[DECISÃO: definir banda em F1]** — atributo não pode virar tell fraco do réu.

**Entregável F2:** PR com priors reformados, `tiltAtributos`, pipeline reordenado, cascata, G1–G4 e bump de contrato.

---

## §4 — F3: desencaixe, regime do réu e anti-tell estendido

### §4.1 Implementar os novos raros da matriz

Aplicar a proposta aprovada de F1 §2.7. Efeitos esperados (recalcular com os pesos finais): P(destoante nato por pessoa) sobe de 3,4–7,7% para ~7–11%; forçamento da isca cai de ~73% para ~55–60%; o mapa "ofício do culpado → móbil íntimo" ganha ≥ 2 destinos em ≥ 12 ofícios — desfazendo a quase-determinização atual (a criada culpada deixa de ser sempre a Justiceira).

### §4.2 Regime de magnitude do réu

Moeda determinística por caso (sal `seed|caso|regime-magnitude`): **magnitude 2 em ~70% dos casos; magnitude 1 nos ~30% restantes** **[DECISÃO: a razão 70/30 é parâmetro de calibração]**.

- **Regime 1 (réu levemente deslocado):** o réu se esconde no estado modal da vila (o degrau médio é o mais comum, 40–65% conforme o ofício); **não há isca forçada** — destoantes natos permanecem se calharem (não remover, não forçar); o caso é carregado pelo móbil material promovido dos pools econômicos (aritmética de época). O jogo alterna assim crimes da alma com crimes de circunstância, e a tese autoral vira frequência dominante em vez de lei aprendível.
- **Regime 2:** tudo como hoje (T = 2, isca forçada). F1 avalia calibrar a prioridade coabitante quando há destoantes natos (nota registrada na ata).

### §4.3 Destoância como textura ≠ estrutura probatória

Destoantes adicionais (naturais, ou de qualquer expansão futura) recebem o `gatilho_de_complexo` do próprio vetor e **zero mentira sobre janela/causa/nexo**: quebram sob a pergunta certa e entregam biografia, não caso. No máximo **1 isca plena** por caso (segredo probatório + mentira). A mentira sobre o caso permanece escassa; o custo de prosa fica contido.

### §4.4 Mentiras periféricas calmas (anti-tell do `mente_com_calma`)

Flag nova `mente_com_calma_periferica:<tema>` para inocentes elegíveis (chance-alvo inicial ~15–20% **[DECISÃO]**); temas de segredos **refutáveis por matéria** (dívida escondida, ligação amorosa, desonestidade comercial miúda) que **jamais tocam janela/causa/nexo**. Quebra a precisão de 100% do tell "mentira serena ⇒ réu". F1 avalia ainda acoplar a chance do `mente_com_calma` do réu ao cenário do crime (premeditado/ensaiado ⇒ calma mais provável) **[DECISÃO]**.

### §4.5 Constantes → dados

Aplicar o que F1 §2.8 tiver fundamentado (decoro por classe etc.); o que não tiver fonte, permanece constante com o motivo registrado em comentário.

### §4.6 Guardas novas de F3

- **G5** (precisão do tell calmo): em lote ≥ 50 seeds, fração de mentirosos-calmos que são inocentes ≥ X% **[DECISÃO: F1 propõe X]**.
- **G6** (regimes): em lote, proporção de casos regime-1 dentro da banda aprovada; nesses casos existe móbil material promovido e não há isca forçada; a guarda anti-tell atual (≥ 1 destoante não-réu em 100% dos casos) passa a valer **só no regime 2**.
- Nota de engenharia: com p ≈ 7–11% por tentativa, falhar as 24 tentativas de reamostragem cai de ~37% para ~6–17%; manter teto 24 + varredura determinística, registrando o recálculo em comentário.

**Entregável F3:** PR com matriz nova, regimes, flags novas, G5–G6 e bump de contrato.

---

## §5 — F4: expansão dos pools e consolidação

1. Implementar as expansões aprovadas de F1: arquétipos (§2.1), vetores (§2.2), traits (§2.4), motivos (§2.5), nomes (§2.6). Cada item novo com fonte citada; encenação segue **bloqueada** (§2.9).
2. Decidir o destino de `afinidadePapeis` (reserva documentada, não consumida): consumir ou remover **[DECISÃO]** — dado que envelhece sem uso é passivo de manutenção.
3. **Guardas de F4:**
   - **G7** (integridade de pools): todo prior é array de 5 com soma > 0; toda linha nova da matriz de afinidade soma corretamente; fonte por item novo (lint de proveniência).
   - **G8** (relatório v2): regenerar por Monte Carlo **todas** as tabelas do relatório de 18/07 (Tabelas 1–3, Apêndices A–D) com os dados finais — o relatório v2 é o artefato de aceite da OS inteira.

**Entregável F4:** PRs de pools + relatório v2.

---

## §6 — Fora de escopo, com registro

1. **A escala de atributos permanece 1–5.** (Nota: a escala atual é 1–5, não 0–5 — arrays de 5 pesos, valor = índice + 1.) Decisão desta OS **contra** a mudança para 0–10, pelos motivos: (i) a resolução extra morre na quantização — os consumidores de diálogo são dois limiares por atributo e o princípio "nada de modificador contínuo invisível" é constitucional; WIS 6 e WIS 9 conversariam igual, como hoje 4 e 5; (ii) 280 inteiros mantidos à mão virariam 560; (iii) o portão da vítima **piora**: FOR em 1–10 num bolo onde a afinidade do vetor vale +1 torna a psique ainda mais invisível — agravando exatamente o contra registrado no §3.6 do relatório — e força renormalizar o autobattler inteiro; (iv) custo de contrato total (todos os casos, todos os priors, todo o golden set) sem resolver nenhum problema diagnosticável em F0 — estereótipo, tells e estreiteza não são problemas de resolução. **Condição de revisita registrada:** só se uma OS futura criar ≥ 3 degraus de comportamento de diálogo por atributo E aceitar renormalizar o resolvedor do confronto.
2. Base-rates e ambiência estatística (§4.3 do design): inalterados.
3. Consumo das flags por `dialogos_gerados.js`: pertence à OS de diálogo (nota nº 1 da ata); esta OS apenas sinaliza a dependência em F0 e em §2.10.

---

## §7 — Ordem de execução e critérios de aceite

**Ordem:** F0 (triagem) → F1 (dossiês; alimentam tudo) → F2 (prior composto) → F3 (desencaixe/anti-tell) → F4 (pools + relatório v2). F2 e F3 podem ser PRs separados; F4 só após aprovação dos dossiês correspondentes.

**Critérios de aceite** (lote ≥ 50 seeds para guardas; ≥ 200 mil elencos para distribuições):

1. G1–G8 verdes, somadas às guardas herdadas (L1/L2, não-vazamento, determinismo byte a byte, anti-tell no regime 2, guarda de import, trava de menores).
2. Nenhum arquétipo com quadrante INT × WIS inalcançável — caso-teste: a lavadeira pode ser gênio.
3. P(destoante nato por pessoa) na banda ~7–11%; forçamento da isca ≤ 60%.
4. Mapa ofício-do-réu → móbil íntimo com ≥ 2 destinos em ≥ 12 ofícios.
5. Precisão do tell calmo dentro da banda aprovada em G5.
6. Replay byte a byte no golden set novo; runtime sem import de `arquetipos.js`/`vetores_psiquicos.js`.
7. Todo item **[DECISÃO]** respondido pelo autor antes do merge da fase correspondente.

— fim da OS —

---

## Ata de fechamento — 18/07/2026

**Execução integral, F0 → F4, um commit por fase, nesta branch.** Os 12 pontos
**[DECISÃO]** foram apresentados ao autor com opções e recomendação e respondidos
antes de F2 (todas as recomendações aprovadas — registro no dossiê F1 §D).
Artefatos por fase:

- **F0** (`docs/os-priors-compostos-f0-triagem.md` + `scripts/auditoria-elenco.mjs`):
  13 reclamações trianguladas (5×A, 5×B, 3×C) — a regra de parada não se ativou.
  **Achado não previsto (B✱):** `hashString` linear acopla sorteios-irmãos de
  sufixo isométrico; quadrantes INT × WIS permitidos pelos priors estavam mortos
  na prática. Registro: o relatório de 18/07 citado como origem não estava no
  repositório; a auditoria nova reproduziu e confirmou todos os números que a OS
  lhe atribui, e passou a ser a referência auditável.
- **F1** (`docs/os-priors-compostos-f1-dossies.md`): dez dossiês (a)–(e) com
  Monte Carlo de 200 mil elencos, censo de 1891 com fontes por candidato,
  propostas de pesos inteiros e rotulagem fonte × chute. Pesquisas de campo:
  ocupações/nomes/sobrenomes (com lacunas declaradas — o top-200 de 1890 ficou
  inacessível ao ambiente; proxy ONS 1904 podado, com método registrado) e
  varredura da kb-medicina-legal (15 candidatos de encenação com falha
  detectável, para a OS futura de realização — expansão BLOQUEADA, como manda o
  §2.9).
- **F2** (prior composto): `hashDecisao` local do gerador (decisão 3);
  CURVAS_DE_ACESSO com N1 por construção (a lavadeira pode ser gênio);
  `tiltAtributos` (N2/N3); pipeline reordenado (vetor antes de atributos);
  cascata de forçamento `|forcado|t<k>`; guardas G1–G4 + decorrelação.
- **F3** (desencaixe e anti-tell): 2º raro em 14/14 ofícios (3º em pároco e
  lavrador); regimes 70/30 (decisão 9); destoância-textura; mentira periférica
  calma 1/6 (decisão 10) e calma do réu acoplada ao cenário (decisão 7); decoro
  por classe; G5 (piso 60%, decisão 11) e G6; anti-tell regime-ciente.
- **F4** (pools): 18 arquétipos (decisão 1), catálogo v2 de 13 vetores
  (decisão 2; Penitente reprovado com registro na KB §7.5), +3 comportamentos
  (decisão 5), +4 motivos com aritmética, nomes ponderados (Galbi) e sobrenomes
  50 com viés sul rural (decisão 6), `chanceSegundoTrait`, `afinidadePapeis`
  removida (decisão 12, registro em `historico-decisoes.md`); G7.
- **Relatório v2 (G8):** `docs/os-priors-compostos-relatorio-v2.md` — todas as
  tabelas regeneradas por Monte Carlo (200 mil elencos + 200 casos completos)
  com os dados finais; é o artefato de aceite, com os critérios do §7 conferidos
  um a um.

Sais novos, consolidados (contrato §0.5): `atributo-composto:FOR/INT/WIS/CHA`,
`|forcado|t<k>`, `|caso|regime-magnitude`, `flag_<i>_calma_cenario`,
`flag_<i>_decoro`, `flag_<i>_calma_periferica`, `flag_<i>_tema_periferico`,
`segundoTrait-v2` — e o re-hash integral do namespace `|elenco|`/`|psique|` por
`hashDecisao`. Golden set regenerado a cada fase; `npm run build`, `qa.mjs`
(CASO VÁLIDO) e `qa-ui.mjs` (UI VÁLIDA) verdes em todo commit.

**Pendências herdadas, fora desta OS (registro):** consumo das flags pelo
diálogo (OS de diálogo — caixa C da triagem; inclui `mente_com_calma_periferica`
e os 3 comportamentos novos, que já saem compilados); realização física dos
pools de encenação (inventário pronto no dossiê §2.9); ganchos de biografia da
vítima (decisão 8 — na OS de diálogo); playtest de mesa do autor sobre o pool
regenerado.
