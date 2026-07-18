# F0 — Triagem da "artificialidade" (OS priors compostos, §1)

> Entregável da fase F0 da OS `docs/os-priors-compostos-e-variedade-do-elenco.md`.
> Data: 18/07/2026. Método: como o relatório de design de 18/07 **não está no
> repositório** (a OS o cita como origem, mas só a própria OS foi anexada à sessão),
> as reclamações foram reconstituídas de três fontes verificáveis: (i) os padrões
> que a própria OS §1 enumera nas caixas A–C, cada um **reverificado contra o código
> vivo** (`src/gerador/`); (ii) a ata de 17/07 (`docs/os-camada-psiquica-do-elenco.md`,
> notas finais); (iii) a auditoria Monte Carlo nova de 200 mil elencos
> (`scripts/auditoria-elenco.mjs`), que reproduz e confirma os números que a OS
> atribui ao relatório. Nenhuma reclamação foi inventada: tudo abaixo tem lastro em
> código ou em documento do repo.

## A tabela de triagem

| # | Reclamação (padrão sentido em playtest) | Verificação no estado atual | Caixa | OS responsável |
|---|---|---|---|---|
| 1 | Todo caso tem **exatamente o mesmo piso de 2 destoantes** (réu + isca); destoância vira assinatura de importância | `vetores_psiquicos.js`: T=2 para o réu + 1 falso-destoante garantido; auditoria: 73,4% dos casos têm ZERO destoante nato entre inocentes — os 2 do piso são quase sempre fabricados por forçamento | **A** | Esta OS, F3 (§4.2 regimes + §4.1 raros novos) |
| 2 | **Móbil íntimo do réu é função do ofício** — a criada culpada é sempre a Justiceira | Auditoria painel B/G: 12/14 arquétipos têm UM só degrau raro; para eles o vetor do réu é determinístico dado o ofício (criada→justiceiro 100%, medico→soberano 100%…) | **A** | Esta OS, F1 §2.7 + F3 §4.1 |
| 3 | **Só 2 mentirosos por caso**, sempre os mesmos papéis (réu + portador da isca) | Compilação de flags: `mente_*` só nasce no réu e no falso-destoante; nenhum inocente comum mente | **A** | Esta OS, F3 §4.3–§4.4 |
| 4 | **Mentira serena ⇒ réu** (tell de precisão 100%) | `mente_com_calma` só existe no réu (1 em 4); nenhum inocente jamais a recebe — o tell é perfeito para quem o nota | **A** | Esta OS, F3 §4.4 |
| 5 | **A isca é previsivelmente o coabitante** da vítima | `derivarPsiqueDoCaso` passo 3: prioridade determinística aos coabitantes; com 73% de forçamento, o slot cai quase sempre no mesmo lugar social | **A** | Esta OS, F3 §4.2 (regime 1 sem isca) + F1 (calibrar prioridade) |
| 6 | **Pools curtos**: ~14–20 prenomes por coorte, 30 sobrenomes, traits 1–3, motivos 2–4 por arquétipo | `arquetipos.js`; auditoria painel E: 55 prenomes e 30 sobrenomes distintos em 1,6 M de personagens; top-5 prenomes cobrem ~20% | **B** | Esta OS, F1 §2.4–§2.6 + F4 |
| 7 | **Moedas universais**: omite_por_decoro 50% plano, mente_com_calma 25%, segundo trait 1/3 — iguais para squire e lavadeira | Constantes no código (`% 2`, `% 4`, `% 3`); auditoria painel F confirma 49,3% / 24,9% / 31,4% | **B** | Esta OS, F1 §2.8 + F3 §4.5 |
| 8 | **Valor 3 mudo** na quantização: a maioria do elenco não tem comportamento de atributo nenhum | `quantizacao.js`: só ≥4 e ≤2 geram comportamento; priors concentram massa no 3 | **B** | Esta OS, F1 §2.3 (achatamento de priors muda a massa nas bandas faladas) |
| 9 | **Composição repetitiva**: ~2,3 lavradores + ~1,6 criadas em todo elenco; 65% masculino | Auditoria painel C (Tabela 1 regenerada): lavrador presente em 97,2% dos elencos, média 2,27 | **B** | Esta OS, F1 §2.1 + F4 |
| 10 | **[NOVO — descoberto nesta triagem] Acoplamento estrutural de sorteios-irmãos**: INT × WIS (e outros pares de decisão com sufixo de mesmo comprimento) são rigidamente correlacionados | `hashString` é polinômio linear: chaves com mesmo prefixo e sufixos de mesmo comprimento diferem por CONSTANTE aditiva (medido: 13298 entre `…\|INT` e `…\|WIS`); com totais de peso iguais, só 18 dos 81 pares (mod 9) são alcançáveis. Auditoria painel D: quadrantes INT×WIS PERMITIDOS pelos priors, porém mortos na prática (moleiro e merceeiro A/A = 0,0%; boticario B/A e B/B = 0,0%…) | **B✱** | Esta OS, F2 (§3.2.3: o sorteio composto deve nascer com hash decorrelacionado no gerador; ver dossiê F1 §2.3) |
| 11 | **Flags psíquicas sem boca**: acusa_com_fervor, omite_por_decoro, gatilho_de_complexo etc. viajam no pacote e não mudam fala nenhuma | Ata de 17/07, nota nº 1; `dialogos_gerados.js` não lê as flags | **C** | OS de diálogo (fora desta) |
| 12 | **Vetor da vítima é portão e nada mais** — a biografia íntima do morto não aparece no inquérito | `derivarPsiqueDoCaso`: `portaoVitima` alimenta o autobattler; o rótulo morre no log | **C** | OS de diálogo (registro em F1 §2.10 desta) |
| 13 | **Encenação sem física**: 6 dos 8 itens dos pools não depositam carta/vestígio | Ata de 17/07, nota nº 2; só `hora_encenada` (gen_hora_forjada) tem realização | **C** | OS de realização da encenação (F1 §2.9 desta só pesquisa) |

## Contagem e regra de parada

- **Caixa A (invariantes aprendíveis): 5 reclamações** → remédio nesta OS, F3.
- **Caixa B (estreiteza distribucional): 4 + 1 nova (B✱): 5** → remédio nesta OS, F1/F2/F4.
- **Caixa C (dado sem boca): 3** → remédio na OS de diálogo.

**A maioria NÃO cai na caixa C** (3 de 13). A regra de parada do §1 **não se ativa**:
F2–F4 prosseguem nesta OS. Registro honesto, porém: as três reclamações da caixa C
são as de maior impacto dramático por unidade de esforço (a flag já existe; falta a
boca), e a OS de diálogo deve ser a **próxima** depois desta — o que esta OS
adiciona (mentiras periféricas, gatilhos por tema, regimes) só rende por inteiro
quando o diálogo consumir as flags.

## O achado novo (item 10) — por que entra na triagem

A OS §1 hipotetiza três origens da artificialidade. A auditoria encontrou uma
quarta, mecânica: o gerador **acredita** estar sorteando INT e WIS de forma
independente (sais distintos), mas a linearidade de `hashString`
(`h = h*31 + c`, sem avalanche) faz chaves-irmãs de mesmo comprimento diferirem por
constante — e o resto módulo-total fica travado em um subconjunto dos pares. O
efeito de jogo é direto: fenótipos de assassino que o design §3.2 declara
prioritários ("o gênio com erro idiota", "o streetwise") são **inalcançáveis em
vários ofícios** hoje, não por decisão de prior, e sim por artefato aritmético.
Nenhuma reescrita de pesos conserta isso; o remédio é decorrelacionar o hash das
decisões do gerador (proposta concreta no dossiê F1 §2.3), dentro do bump de
contrato que F2 já exige.

— fim de F0 —
