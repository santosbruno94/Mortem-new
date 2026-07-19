# OS — Autobattler v2: a batalha por doutrinas, o corpo em regiões e a mobília com física

**Data:** 18 de julho de 2026 · **Uso:** esta OS é um prompt de sessão (pesquisa + design + implementação)
**Origem:** pedidos do autor em 18/07: (1) "cada parte toma sempre a mesma escolha" — política **determinística** de ação por estado (o garrote falha, a vítima se desvencilha: ataca? foge? defende?); (2) marcas da luta **em ambos os envolvidos e no ambiente**; (3) mobília como **arma improvisada balanceada** (a cadeira, o castiçal — eficaz a ponto de mudar a escolha da vítima ou o método do assassino); (4) verificar se **o grid precisa ser repensado** e até onde é possível; (5) preparar a **variedade de ambientes** para casos variáveis. Pano de fundo: auditoria de 18/07 (2.000 seeds: 23,8% de réus feridos sem observável; desespero 5%; fuga dominante 7,5%) e relatórios 3/6 e 4/6.
**Normas-mãe:** `docs/game-design-simulacao.md` §2 (autobattler, reamostragem §2.1, regra de existência §2.3), §3.1 (tabela viva de vestígios), §3.3 (conservação), §4.2 (espaço/LOD) · `MORTEM_CONTEXTO.md` §2 (fair play, motor cego) · `docs/kb-medicina-legal/` — `traumas.md` (§"capacidade de ação depois da lesão"; a tese de Taylor "ferida absolutamente mortal não é instantaneamente incapacitante" é a **licença doutrinária desta OS**), `asfixias.md`, `tanatologia.md`, `vestigios.md` · `docs/kb-mundo-vitoriano/` (interiores e objetos domésticos — a lista de época do que uma sala oferece à mão) · `src/gerador/vetores_psiquicos.js` (o canal `sobAtaque`/`portaoPsiquico` existente, que esta OS promove de peso a **causa**) · `docs/kb-craft-narrativo/cliches-e-fair-play.md` · OS palco em anéis (interface E2: `saidas`, `MOBILIA_DE_LOGRADOURO`) · OS marca-e-luva (absorção do M1; interface M2/M3)
**Artefatos-alvo:** `src/gerador/crime.js` (reescrita do resolvedor) · `espaco.js` (schema físico da mobília + itens novos) · `interiores.js` · `metodos.js` · `vestigios.js` · `caso.js` (âncoras generalizadas) · `ponte_caso.js` · `vetores_psiquicos.js` (doutrinas) · `src/data/catalogo_causas.js` (somente se B4 aprovada) · `scripts/qa.mjs` · `scripts/gerar-casos.mjs` · `scripts/demo-crime.mjs`

---

## §0 — Como executar esta OS

1. Ler primeiro, nesta ordem: esta OS inteira; `crime.js` vigente (todo o `simularBatalha` e a deposição); `interiores.js`/`espaco.js` (layouts, pools, `celulasDePerimetro`, o precedente `cocho_dagua → 'agua'` em `caso.js`); `traumas.md` §capacidade de ação; a OS palco §3.2 (o contrato futuro de `saidas`); a OS marca-e-luva (M1, que esta OS absorve).
2. Executar as fases em ordem (B0 → B5). Fases **B** (batalha), guardas **GB** — sem colisão com F/G (priors), E/GE (palco) e M/GM (marca-e-luva). Não pular B0.
3. Todo item **[DECISÃO]** é pergunta ao autor: opções numeradas + recomendação; aguardar resposta antes do merge da fase (tabela em §8).
4. Herdar como **invioláveis**:
   - Determinismo total por `hashString` salgado; zero `Math.random`, zero rede/LLM em runtime. **Esta OS aposenta o namespace de sais da batalha v1 inteiro** e declara o novo: `seed|batalha|t<T>|r<R>|…` (resolução: `acerto`, `dano`, `incidental`, `alvo-regiao`), `seed|batalha|t<T>|iniciativa`, `seed|batalha|arma|<peça>`. **A política de doutrina NÃO consome sal nenhum** — escolha é função pura do estado (§3); só a *resolução* rola dados. Todos os sais listados no cabeçalho do PR; proibido reusar sal entre decisões distintas.
   - **Replay:** esta OS quebra, declaradamente, o replay das batalhas (é a sua finalidade). Contrato de conteúdo pleno: bump + regeneração do golden set no mesmo commit; a **réplica dirigida ganha nova seleção de seed** entre ≥ 200 candidatas pelo processo já usado (perfil do vilão + identidade de fatos — critérios em D5).
   - Motor cego intacto: runtime jamais importa gerador; veredicto/solvência leem só `tagsOcultas`; **nenhum combate em runtime** (reafirmado).
   - Regra de existência (§2.3) como **portão de fase**: nenhuma ação, condição ou propriedade entra no catálogo sem declarar sua classe de vestígio diferencial (a matriz ação→vestígio de B2 é o entregável que abre B3).
   - Conservação (§3.3), proveniência (assinatura forense com fonte; **número de eficácia é sempre "chute calibrável" declarado**, jamais disfarçado de fato de KB), L1/L2, anti-tell vigente, lints de LOD/import, **trava dura de menores** (elenco adulto; a escola é palco de adultos), contrato do `qa-ui.mjs` (batalha é build-time — nenhuma superfície de UI muda nesta OS além das cartas-rótulo).
5. **Grid = fonte única de verdade espacial** permanece lei: tudo que esta OS acrescenta (posições, bloqueio, física de peça) vive NO grid e a planta SVG continua projeção 1:1 sem mudança de contrato.

---

## §1 — B0: auditoria espacial e o veredito do grid

Entregável primeiro desta OS: confirmar contra o código vigente o parecer abaixo (levantado em 18/07) e registrá-lo em doc. **Veredito: o grid NÃO precisa ser substituído — precisa de quatro extensões.** O que existe e o que falta:

| Capacidade | Estado atual (18/07) | Basta ao v2? | Extensão |
|---|---|---|---|
| Resolução e partição | 15 layouts, grids 5×4 a 8×6 (20–48 células), 1–4 cômodos por split ±1 | **Sim** — perseguição curta cabe; nada a mudar | declarar a escala semântica da célula (~1 jarda/passo) em doc [D7] |
| Posições na batalha | **só a vítima tem célula**; o assassino é implícito (sempre adjacente) | Não | estado com **as duas posições**; distância Chebyshev (já usada) entre atores e à saída |
| Movimento/colisão | `caminhoEmL` ignora tudo; **mobília não bloqueia**; cômodos sem parede interna — cruza-se a fronteira em qualquer célula | Parcial | BFS trivial (≤ 48 células) com `bloqueia: true` nas peças grandes; **portas internas derivadas** (célula média de cada fronteira compartilhada) — pacote opcional [D1] |
| Física da peça | schema `{id, item, rotulo, comodo, celula}` — **zero propriedades**; peças só ancoram vestígio e tombam (`danificarAoAlcance`) | Não | B1: schema de affordances |
| Âncora → método | precedente pronto: `cocho_dagua → 'agua' → afogamento` (`caso.js`) | Sim, como padrão | B1 generaliza a tabela |
| Saída | `portaExterna` recomputada em 3 pontos de `crime.js` | Não | B3 lê `interior.saidas` (default unitário = porta atual) — **entrega de graça o pré-requisito do E2 §3.2 do palco** |
| Planta/SVG e UI | projeção 1:1; batalha é build-time, invisível | **Sim** | nada — bloqueio/portas viram traço derivado, mesmo contrato |

Registrar também o que fica **rejeitado com justificativa** (§7): HP numérico por membro — duas trajetórias "3/5 vs 2/5" que terminam no mesmo mapa de feridas são indistinguíveis na evidência; tudo viraria `variaveisInertes`. A camada de membro entra como **condições discretas por região** (B2), cada bit observável no laudo.

**Entregável B0:** parecer confirmado + tabela acima atualizada + resposta do autor a D1/D7. **Regra de parada:** B1 procede independentemente de D1 (o schema não depende de colisão).

---

## §2 — B1: a mobília ganha física (espaco.js)

1. **Schema de affordances** em todo item de `MOBILIA_POR_CLASSE`/`MOBILIA_DE_OFICIO` (e, por herança, no futuro `MOBILIA_DE_LOGRADOURO` do palco — esta OS define; E2 consome):
   `fisica: { empunhavel: bool, duasMaos?: bool, classeGolpe?: 'contundente'|'cortante'|'perfurante', alcance?: 'curto'|'haste', massa: 'leve'|'media'|'fixa', bloqueia: bool, quinaPerigosa: bool, ancora?: 'agua'|…, assinatura?: <id com fonte> }`.
   `assinatura` liga a peça à ferida que ela produz (a contusão com padrão da haste do atiçador, a ferida contuso-cortante da base do castiçal, o padrão da quina da mesa) — **cada assinatura com arquivo+seção da KB; lacuna vira proposta de verbete no mesmo PR**. Os números de eficácia (dano, bônus) ficam num bloco separado `calibracao:` marcado chute-calibrável.
2. **Passe sobre os ~70 itens existentes** (a cadeira Windsor, o banco, as ferramentas de lavoura, a tina, a garrafa do pub…) + **itens novos canônicos de época**, com fonte: **lareira com guarda-fogo e atiçador** (cozinha/parlour — que de quebra dá âncora real à peça de hora forjada "corpo junto à lareira", fechando a incoerência apontada na auditoria de 18/07), castiçal de latão, ferro de engomar. Peça fixa (`massa: 'fixa'`) jamais empunhável — lint.
3. **Âncoras generalizadas:** a tabela `item → ancora` substitui o if isolado do cocho; `metodosElegiveis` passa a ler a tabela (comportamento idêntico hoje; extensível pelo E2).
4. Lint novo no `qa.mjs`: item sem `fisica`; empunhável sem `classeGolpe`/`assinatura`; assinatura sem fonte.

**Guardas de B1:** **GB1** (proveniência: toda assinatura com fonte; toda calibração marcada) · **GB2** (integridade do schema: lints acima verdes; âncoras de método preservadas — afogamento continua elegível exatamente onde era).
**Entregável B1:** PR próprio + bump + golden set (campos novos apenas — nenhuma batalha muda ainda).

---

## §3 — B2: estados, condições por região e as doutrinas

1. **Estado da batalha** (por rodada, os dois atores): posição de cada um; **condições por região** — `bracos | pernas | cabeca | tronco`, cada uma `integro | ferido | inutilizado` [conjunto em D2]; agarre (`presa | livre`, substituindo o `seguraAVitima` como sentença permanente — o desvencilhar existe); arma em mãos (método do assassino; peça improvisada de quem a tomou); fôlego/gravidade implícitos nas condições (nada de HP oculto além do letal existente).
2. **Catálogo fechado de ações**, cada uma com pré-condições e **classe de vestígio declarada** (a MATRIZ ação→vestígio é o portão desta fase — ação sem rastro diferencial não entra):
   golpear (método) · golpear (arma improvisada — exige peça empunhável ao alcance) · **armar-se** (tomar a peça: a peça sai do lugar — vestígio `peca_deslocada`, mais a assinatura no ferido) · **desvencilhar-se** (do agarre: escoriações ungueais no próprio pescoço + fibras/pele sob as unhas — o caso-escola do garrote falho) · **aparar** (ferimentos defensivos, agora com sede) · **interpor** (a mesa entre os dois — só com `bloqueia`; vestígio: a peça girada/arrastada) [entra com D1] · fugir (rumo à `saida` mais próxima; trilha/limiar/sítio posterior vigentes) · gritar (rolagem única vigente) · perseguir/reposicionar (do assassino).
3. **Lesão incidental de ambiente:** quando o deslocamento/queda passa por célula com `quinaPerigosa`, rolagem `|incidental` — a contusão com padrão da quina no corpo **+ cabelo/fibra na aresta da peça** na cena (o par que o E1 nomeará no ponto do cômodo). Fundamento "queda ou golpe?" a validar na KB (verbete se faltar). Banda de frequência apertada [D3], com trava dupla: a incidental **jamais** conta como sinal de mecanismo nem entra na solvência.
4. **Doutrinas — o coração do pedido:** função **pura** `doutrina(papel, estado) → ação`, publicada como tabela legível em doc (entregável). Entradas: papel (vítima/assassino), quadrante INT×WIS, polaridade e canal `sobAtaque` do vetor psíquico (que deixa de ser peso e vira **regra de desempate causal**), FOR relativa, condições próprias, distâncias (ao outro, à saída, à peça empunhável mais próxima), agarre. Zero sal: mesmo estado ⇒ mesma escolha, sempre — e portanto **reconstruível de trás para frente** pelo jogador ("ferida, porta longe, atiçador ao alcance: ela fez o que faria"). Exemplo normativo (o do autor): garrote premeditado, FOR da vítima alta → sobrevive à surpresa → `presa` → única ação legal: desvencilhar → sucesso (FOR×FOR) → sulco interrompido + ungueais no próprio pescoço → estado livre/ferida/ativa/atiçador a 1 célula → doutrina: **armar-se e golpear**, não fugir.
5. **Terminação garantida:** medida decrescente declarada (letalidade acumulada + teto de rodadas) — a reamostragem por rejeição continua cobrindo vitória da vítima; sem ciclos possíveis por construção.

**Guardas de B2:** **GB3** (pureza da política: fuzz sobre ≥ 10⁴ estados sintéticos — mesma entrada, mesma ação; nenhuma leitura de sal) · **GB4** (matriz completa: toda ação do catálogo com classe de vestígio; em lote, ação realizada deposita rastro sobrevivente em ≥ X% [D3]) · **GB5** (terminação: 200 mil batalhas sem estouro do teto fora do desespero recalibrado).
**Entregável B2:** doc `docs/os-autobattler-v2-doutrinas-tabela.md` (a tabela de doutrinas + a matriz ação→vestígio) aprovado pelo autor **antes** de B3.

---

## §4 — B3: a reescrita do resolvedor (crime.js)

1. Loop v2: turnos com as duas posições, doutrinas de B2, resolução sob os sais novos; pathing BFS com bloqueio e portas se D1 aprovada (senão, `caminhoEmL` mantido). Fuga mira `interior.saidas` (unitária por default — pré-requisito do E2 entregue).
2. Deposição: tudo do v1 preservado como classe (poça, trilha, limiar, mobília revirada, ruído, grito) **+ sede anatômica em todo vestígio de lesão** (absorve o M1 da marca-e-luva: `ferimento_do_agressor` com região por método/arma; defensivos → antebraços; sítio posterior → dorso; fatal → região-alvo) **+ os novos**: `peca_deslocada`, assinatura de arma improvisada (no corpo e na peça — o sangue no castiçal), ungueais-de-desvencilhamento, incidental + fibra na quina, interposição.
3. Reamostragem por rejeição mantida, com motivos novos (vítima venceu **armada** é rejeição nova e legítima); `MAX_RODADAS`/desespero recalibrados às bandas de D3 (hoje: desespero 5%, fuga 7,5% — as bandas-alvo do v2 são decisão do autor).
4. **Réplica dirigida:** seleção nova de seed (processo das ≥ 200 candidatas) por identidade de fatos [D5]; casos internos regenerados (contrato de conteúdo).

**Guardas de B3:** **GB6** (procedência total: todo vestígio aponta evento/ação de origem; trilhas contíguas; toda sede ∈ tabela da região; incidental só em célula `quinaPerigosa`) · **GB7** (réplica: identidade de fatos aprovada pelo autor — mesmo perfil de vilão, mesma família de método, encenação equivalente) · **GB8** (bandas de desfecho em 200 mil casos: fuga, armar-se, incidental, desespero, rejeições médias — dentro de D3; **nenhuma combinação método×layout degenerada**, ex.: "forja ⇒ vítima sempre armada").

---

## §5 — B4: a troca de método em luta (gated)

O prêmio máximo do pedido — o garrote falha e o assassino termina às mãos, ou com o castiçal que estava ao alcance dele. Entra **somente após GB8 verde**, atrás de flag, porque toca o cravar:

1. Doutrina do assassino ganha a transição (método falho + condição própria + peça ao alcance → troca); a Verdade de Ouro ganha `metodoIniciado` ao lado de `mecanismoCorreto` (o fatal).
2. **Assinatura sobreposta com honestidade de época:** o método abortado deposita o seu sinal **incompleto e marcado** (sulco interrompido *sem* os sinais gerais de asfixia consumada — Taylor distingue tentativa de consumação; validar/verbete). No catálogo de causas, o sinal de tentativa vive em domínio próprio que **não concorre** no `mecanismoCravado` — o fatal crava sozinho, a tentativa colore.
3. **Guardas de B4:** **GB9** (cravar intacto: 100% das seeds com troca cravam o mecanismo fatal) · **GB10** (anti-ambiguidade: nenhum conjunto de sinais de tentativa satisfaz, sozinho, um mecanismo; solvência byte-idêntica nos casos sem troca).
4. Frequência da troca por banda apertada [D4] — rara o bastante para ser assinatura de caso, não rotina.

---

## §6 — B5: consolidação, calibração e as pontes

1. **Balanceamento como processo, não palpite:** Monte Carlo ≥ 200 mil casos por iteração de `calibracao:`; alvos = as bandas de D3/D4 (o "quão efetiva é a cadeira" se responde medindo: a cadeira é eficaz o bastante quando a fração de vítimas que se armam em vez de fugir cai na banda que o autor aprovou). Relatório v1 com as distribuições completas (ação por rodada, desfechos, sedes, incidentais, armas usadas, trocas) — **artefato de aceite da OS inteira**.
2. **Pontes registradas no mesmo PR:** (a) E2 do palco herda o schema `fisica` pronto para `MOBILIA_DE_LOGRADOURO` — a variedade de ambientes externa nasce já com física; (b) marca-e-luva reordenada: M1 morre aqui dentro (B3); M0 vira dossiê compartilhado (traumas/datação servem às duas); M2–M3 correm depois de B3; (c) OS de prosa recebe a lista das superfícies novas (laudo com anatomia, arma improvisada, tentativa, desvencilhamento) — tudo em rótulo técnico até lá.
3. Varredura `lint-prosa` nos rótulos novos; `demo-crime.mjs` com três seeds de demonstração: a do garrote-desvencilhado, uma com arma improvisada, uma com incidental.

---

## §7 — Fora de escopo, com registro

1. **HP numérico por membro** — rejeitado (regra de existência; ver B0). As condições por região entregam a função sem o estado invisível.
2. **Queda fatal como mecanismo** (o ambiente que mata — a cabeça na quina como causa mortis) — v2 registrada: mexe no veredicto e nos quatro finais; forte demais para contrabando.
3. **Múltiplos agressores / terceiro em cena durante a batalha** — fora; o cúmplice segue sendo criatura da interferência.
4. **Dor/choque/hemorragia como sistema contínuo** — as condições discretas bastam; o contínuo é invisível.
5. **Combate ou agência em runtime** — inalterado, reafirmado.
6. **Clima e iluminação como variáveis de batalha** — candidato futuro sob regra de existência (registrar, não implementar).

---

## §8 — Ordem de execução, decisões e critérios de aceite

**Ordem:** B0 → B1 → B2 (tabela aprovada) → B3 → [B4 gated] → B5. **Sequência entre OSs:** E1 do palco é independente (apresentação; pode correr antes/em paralelo); **toda a série B precede E2** (a fuga/saídas e o schema de mobília nascem aqui); **M2–M3 da marca-e-luva correm após B3** (dependem do ferimento com região). Conflito previsível de merge em `crime.js`/`espaco.js`: janela única por fase, coordenada com a sessão do palco [D8].

| # | [DECISÃO] | Opções | Recomendação |
|---|---|---|---|
| D1 | Colisão + portas internas derivadas na v1 | (a) sim, pacote completo; (b) só `bloqueia` sem portas; (c) nada (caminhoEmL) | **(a)** — BFS em ≤ 48 células é trivial, e interpor/funil de fuga são metade do valor doutrinário |
| D2 | Conjunto de regiões | (a) braços/pernas/cabeça/tronco; (b) + mãos separadas de braços | **(a)** na v1; mãos ficam dentro de braços (o laudo de época raramente separa mais fino) |
| D3 | Bandas-alvo (fuga %, armar-se %, incidental %, desespero %, rastro-por-ação X%, rejeições médias) | bandas numéricas | ponto de partida: fuga 10–20%, armar-se 8–15% das batalhas, incidental 5–10%, desespero ≤ 5%, X ≥ 90% — calibráveis em B5 |
| D4 | Troca de método (B4) | (a) v1 desta OS, gated; (b) v1.1 imediata; (c) adiar | **(a)** — o autor a pediu; o gate GB9/GB10 protege o cravar |
| D5 | Critérios de identidade de fatos da nova réplica | lista fechada (perfil do vilão, família de método, encenação, presença/ausência de fuga) | herdar o precedente §4.8 da OS confronto + encenação por corpo |
| D6 | Itens novos de mobília | lista do dossiê B1 | mínimo: lareira+guarda-fogo+atiçador, castiçal, ferro de engomar (a lareira também sara a âncora da hora forjada) |
| D7 | Escala da célula | ~1 jarda / ~1 passo / não declarar | **~1 jarda**, só em doc (nenhum número de jogo depende) |
| D8 | Janela de merge com a sessão do palco | ordem fina B×E | B0–B3 fechados antes de E2 abrir `crime.js` |

**Critérios de aceite:**

1. GB1–GB10 verdes (GB9/GB10 só se D4=a), somadas às herdadas (determinismo, cegueira do motor, L1/L2, anti-tell, trava de menores, lints de LOD/import/proveniência).
2. Golden set regenerado; réplica nova aprovada pelo autor (GB7); `qa-ui.mjs` verde sem mudança de contrato.
3. Distribuições de B5 dentro das bandas de D3/D4; nenhuma combinação método×layout degenerada; nenhum tell novo ("peça deslocada ⇒ vítima venceu rodadas" etc. — auditar no relatório).
4. Matriz ação→vestígio publicada e completa; tabela de doutrinas publicada e aprovada antes de B3.
5. Todo [DECISÃO] respondido antes do merge da fase; sais novos listados por PR; namespace v1 da batalha declarado aposentado no primeiro PR de B3.

— fim da OS —
