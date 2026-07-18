# F1 — Dossiês por variável (OS priors compostos, §2)

> Entregável da fase F1 da OS `docs/os-priors-compostos-e-variedade-do-elenco.md`.
> Data: 18/07/2026. Cada dossiê traz os itens (a)–(e) do §2 da OS. A auditoria (a)
> é `scripts/auditoria-elenco.mjs` (Monte Carlo determinístico, 200 mil elencos,
> seeds `auditoria_*`, sobre os módulos reais do gerador); os painéis A–G citados
> abaixo são os desse relatório. **Registro:** o relatório de design de 18/07 que a
> OS cita como origem não está no repositório; a auditoria nova REPRODUZ e confirma
> todos os números que a OS atribui a ele (P(nato) 3,4–7,7%; isca forçada ~73%;
> 12/14 ofícios com um só raro; ~2,3 lavradores por elenco), e passa a ser a
> referência estatística auditável desta OS.
>
> **Convenção de rotulagem (e):** cada dado quantitativo proposto leva a marca
> **[fonte]** (KB ou fonte primária citada) ou **[chute calibrável]** (estimativa
> de design, refinável sem contrato quebrado — problema de dados, não de sistema).
> Pontos que a OS reserva ao autor estão marcados **[DECISÃO]**, numerados no
> consolidado final (§D).

---

## §2.1 Arquétipos / profissões (14 → teto 18)

*(a) Auditoria.* Painel C: a composição média de um elenco de 8 é 2,26 lavradores +
1,58 criadas + 0,6–0,7 de ferreiro/costureira — 4 vagas em 8 vêm dos 3 arquétipos
mais pesados; lavrador aparece em 96,9% dos elencos. Gênero: 65% masculino / 35%
feminino. A soma de pesos de frequência hoje é 40.

*(b) Levantamento histórico.* Ver a seção de integração do censo abaixo (pesquisa
com fontes por candidato). Resumo do que o censo de 1891 e a KB sustentam sem
esforço: carroceiro, guarda-caça, parteira, pastor e coadjutor são ocupações de vila
documentadas; estalajadeiro sobrepõe-se ao taverneiro (o pub/coaching inn já
embarca a acomodação); jornaleiro itinerante colide com a invariante do círculo
social (autor sempre do círculo da vítima — o forasteiro de passagem é exatamente o
suspeito que o fair play do gênero proíbe de usar).

*(c) Proposta.* Adicionar **4 arquétipos** (14 → 18, no teto que a OS admite):

| id novo | classe | frequência proposta | único? | gênero | proveniência da frequência |
|---|---|---|---|---|---|
| `carroceiro` | artesao | 2 | não | M | censo 1891 (carrier/carter entre as ocupações masculinas numerosas) **[fonte]** — peso relativo **[chute calibrável]** |
| `guarda_caca` | criadagem (serviço da propriedade) | 1 | sim | M | censo 1891 (gamekeeper; ligado à gentry) **[fonte]** — peso **[chute calibrável]** |
| `parteira` | criadagem/ofício popular | 1 | sim | F | censo 1891 (midwife, pré-Midwives Act 1902) **[fonte]** — peso **[chute calibrável]** |
| `pastor_de_ovelhas` | lavrador | 2 | não | M | censo 1891 (shepherd, ocupação rural numerosa) **[fonte]** — peso **[chute calibrável]** |

Cada um com a coluna completa (piso FOR próprio; INT/WIS/CHA pelas curvas de acesso
do §2.3; pool de traits ≥ 3; motivos ≥ 4 com aritmética; linha inteira na matriz de
afinidade com 2 raros — proposta de linha no §2.7). **Rejeitados com motivo:**
sacristão-coveiro (função, não sustento — na vila é acúmulo do que já existe;
melhor como *cor* de um lavrador/artesão velho), estalajadeiro (duplica o
taverneiro), jornaleiro itinerante (quebra a invariante do círculo social),
coadjutor (só existe onde o pároco já é figura única; dois clérigos por vila
gerada é exceção, não regra — fica para OS futura se a vila ganhar capela com
pregador). **[DECISÃO 1]**: aprovar os 4, um subconjunto, ou outros.

Rebalanceio de frequência dos 14 atuais **[chute calibrável, direção com fonte]**:
lavrador 12 → **10** e criada 8 → **7** (o censo autoriza vários por vila, mas o
elenco de UM CASO é círculo social da vítima, não amostra do censo; a
sobre-representação atual é a reclamação nº 9 da triagem). Soma nova de pesos:
40 − 3 + 6 = **43**. **Gênero — avaliação pedida pela OS, com dado novo da
pesquisa:** os distritos RURAIS de 1891/1901 tinham ~1.011 mulheres por 1.000
homens (contra 1.086 nos urbanos; 23 condados com porção rural MENOS feminina
que masculina — as "surplus women" concentravam-se nas cidades, via serviço
doméstico; fonte na integração abaixo). O alvo histórico do elenco de vila é
portanto ~50/50, não o excedente feminino urbano; os 65/35 atuais continuam
masculinos demais, e a proposta (parteira + redução de lavradores) leva a ~60/40
**(projeção; medir no relatório v2)**. Nota de época que a pesquisa acrescenta:
solteironas IDOSAS e viúvas são críveis na vila; excesso de moças solteiras
jovens seria anacrônico (elas partiam para o serviço urbano).

*(d) Impacto a jusante.* Tabela 1 é regenerada (G8); a soma 43 muda TODAS as
probabilidades de composição; a matriz de afinidade ganha 4 linhas × 13 vetores; a
`PESO_VITIMA_POR_CLASSE` de `caso.js` já cobre as classes usadas (nenhuma classe
nova). Contrato de conteúdo: bump + golden set.

*(e) Rotulagem.* Presença e gênero das ocupações: **[fonte]** (censo/KB, tabela de
integração abaixo). Pesos de frequência relativos e priors: **[chute calibrável]**
com direção documentada.

### Integração da pesquisa de censo (fontes por candidato)

Pesquisa executada em 18/07/2026 (agente de pesquisa; URLs conferidas; lacunas
explícitas — nada inventado). Por candidato:

| candidato | presença/contagem (1891 ou proxy) | renda típica | gênero | 1 por vila? | veredito |
|---|---|---|---|---|---|
| carroceiro (carrier) | figura central da economia rural; Norwich servida por carriers de 363 aldeias, Leicester 220, Nottingham 143 (1894) — Everitt 1976, *J. Transport History*; Woodborough Heritage | sem valor típico documentado (**lacuna**); ocupação em geral combinada | maj. masculino (3–5 mulheres entre os de Nottingham) | 1 (aldeia grande: 2–3) | **APROVAR** — rotina de dias de mercado é ganchos de álibi prontos |
| guarda-caça (gamekeeper) | série censitária Inglaterra: 7.542 (1851) → 16.677 (1901); 1901 = +20,7% sobre 1891 ⇒ **1891 ≈ 13.800** (Cambridge *Rural History*; VoB 1901) | ~£1/semana (£30–50/ano) + casa, carvão, terno, gorjetas (Edwardian Promenade) | ~100% masculino | 1 head keeper (se há propriedade de caça) | **APROVAR** — vive isolado na mata; `unicoNaVila` |
| parteira (midwife) | censo 1891: >53.000 "nurses and midwives" (combinado; desagregado = **lacuna**); 50–90% dos partos pobres com parteira prática (Policy Navigator; Victorian Web) | ~5s por parto, pago em prestações; renda baixa e irregular | feminino; mulher madura/viúva | 1 reconhecida (+ eventual rival) | **APROVAR** — e a parteira também **amortalhava os mortos**: entra na cena do crime pela porta da frente |
| pastor de ovelhas (shepherd) | agrupado no censo: 756.557 "agricultural labourers, shepherds, or carters" (VoB 1891; desagregado = **lacuna**) | categoria superior do trabalho agrícola (> 13s 9d/semana; extras por cordeiro) | masculino | 1–3 em zona de criação | **APROVAR** — a solidão vigilante do pasto é textura nova |
| sacristão-coveiro (sexton) | cargo paroquial universal, 1 por paróquia (Wikipedia; Hull Minster); contagem censitária = **lacuna** | £19 18s/ano documentados (1877) + 1s por cova — **tempo parcial**, sempre acumulado com outro sustento (Mill Road Cemetery) | masculino | 1 | **REPROVAR como arquétipo**: função, não sustento — a fonte confirma; melhor como COR acumulada de um lavrador/artesão velho (nota para a camada narrativa) |
| estalajadeiro (innkeeper) | sem contagem separada de publicans (**lacuna**); a coaching inn de 1893 sobrevive como ponto do carrier e sala de inquérito do coroner | vive do negócio; valor típico = **lacuna** | padrão masculino; viúvas licenciadas comuns | 1 inn principal + 1–3 pubs | **REPROVAR**: duplica o taverneiro (o pub do jogo já embarca acomodação e balcão); a *sala de inquérito na estalagem* fica anotada para a prosa |
| jornaleiro itinerante | mal capturado pelo censo de abril; mão de obra volante de colheita (**lacuna** quantitativa — e é o ponto: o forasteiro indocumentado) | 12s–13s/semana quando empregado (Woburn 1892) | masculino | 0 no inverno, vários na colheita | **REPROVAR**: quebra a invariante do círculo social (o autor pertence ao círculo da vítima); o "vagabundo que passava" é exatamente a solução que o fair play proíbe |
| coadjutor (curate) | "muitos no século XIX", sem estabilidade (St George-in-the-East); contagem 1891 = **lacuna** | £81–150/ano — cavalheiro por educação, pobre por renda | masculino | 0–1 (só com vigário idoso/paróquia rica) | **REPROVAR na v1**: só existe condicionado ao pároco; a tensão "gentleman pobre" fica anotada para OS futura (capela/segundo clérigo) |

Fontes completas (URLs) no relatório da pesquisa, resumidas: Everitt 1976 (SAGE);
Woodborough Heritage (carriers); Cambridge Core *Rural History* (gamekeepers
1851–1921); visionofbritain.org.uk (censos 1891/1901, relatórios gerais); Policy
Navigator/Victorian Web/RCM (parteiras); Mill Road Cemetery/victorianlondon.org
(sexton); mkheritage.org.uk (salários Woburn 1892); St George-in-the-East +
Victorian Web (curates). Salário-âncora do lavrador confirmado: 13s 9d/semana em
1893 (*British Labour Statistics: Historical Abstract*).

---

## §2.2 Vetores psíquicos (11 → teto 13)

*(a) Auditoria.* Painel G: com 12/14 ofícios de um só degrau raro, o vetor do réu é
função determinística do ofício (criada→justiceiro 100%, medico→soberano 100%…);
só pároco e lavrador têm 2 destinos. Painel F: réu forçado ao desencaixe em 94,9%
dos casos.

*(b) Levantamento.* Critérios do §6 de `kb-producao/sistemas-arquetipicos-alem-dos-12.md`
(os mesmos que reprovaram o médium): vetor completo (valor→medo→sombra
bipolar→auto-justificação), persona e segredo da mesma fonte, ≥ 3 papéis,
pressão de época com rastro periciável, ortogonalidade à profissão, dissonância
interna. Acrescidos pela OS: mapear exatamente UMA ação `sobAtaque`, tema de
gatilho próprio, coluna completa de afinidade.

*(c) Proposta — três candidatos, com recomendação fundamentada:*

**1. PREVIDENTE — recomendação: APROVAR.**
- Valor professado: previdência, o pé-de-meia, nunca dever a ninguém.
- Medo central: a miséria à vista — a workhouse, o enterro de indigente
  (`kb-mundo-vitoriano/demografia-e-sociedade.md` §4: o pavor do enterro de
  indigente faz família passar fome pelo *penny policy*; economia §3: a Poor Law
  paira sobre toda família sem renda) **[fonte]**.
- Sombra ativa: o agiota da vila; elimina a boca a mais, mata pelo seguro — o
  móbil `seguro_de_enterro` já existente ganha o dono psíquico que faltava.
- Sombra passiva: o sovina que nega o socorro e deixa morrer de economia.
- Auto-justificação: "não podíamos sustentá-lo".
- Tema de gatilho: `miseria_a_vista`. `sobAtaque`: **fugir** (preserva-se; a
  prudência não enfrenta).
- Ortogonalidade: qualquer ofício pode hospedá-lo (do squire avarento — figura
  clássica — à criada que conta cada penny). Passa nos 6 critérios; ≥ 3 papéis
  (assassino por seguro, véu que esconde a avareza, fonte que anota tudo).
- Afinidade: alta = merceeiro, moleiro, lavadeira **[fonte: a caderneta, o
  estoque, a viúva provedora — demografia §3–4]**; rara = squire (a avareza
  inexplicável pela posição — a vocação de pobre num corpo de rico); resto media.

**2. ENRAIZADO — recomendação: APROVAR.**
- Valor professado: a terra, a casa, a continuidade ("os meus estão enterrados
  aqui").
- Medo central: o desenraizamento — despejo, venda da terra, o êxodo que esvazia a
  vila (economia §1: depressão agrícola, êxodo rural; demografia §2: a vila
  encolhe) **[fonte]**.
- Sombra ativa: mata para não ser arrancado — o senhorio que despeja, o herdeiro
  que quer vender, o parente que força a partida.
- Sombra passiva: o que apodrece no lugar e sabota a partida dos outros.
- Auto-justificação: "esta casa é o que somos".
- Tema de gatilho: `perder_o_chao`. `sobAtaque`: **resistir** (defende o chão).
- Par polar com o Errante (ficar preso × ser arrancado) — a tensão dramática
  nativa que a KB de sistemas arquetípicos §2 recomenda ("pares polares valem
  mais que rótulos").
- Afinidade: alta = lavrador, moleiro, squire **[fonte: cottage atado, moinho
  herdado, a terra como nome — demografia §1]**; rara = criada (serve na casa que
  já foi da família dela); resto media.

**3. PENITENTE — recomendação: REPROVAR (registro, como o médium).**
- Construível (valor: expiação; medo: a culpa antiga exposta; sombras:
  flagelador dos outros / o que se deixa destruir), MAS: o medo central colide
  com o `pecado_exposto` do Devoto (mesmo tema de gatilho na prática — falha a
  ortogonalidade interna do catálogo) e a sombra ativa não gera agressor
  distinto do Justiceiro. Dois vetores para a mesma pergunta de interrogatório
  é rótulo duplicado, não psique nova.

**[DECISÃO 2]**: aprovar Previdente e Enraizado (recomendado), só um, ou nenhum.

*(d) Impacto.* Com 13 vetores, cada ofício soma +4 de peso (2 medias) na matriz —
os P(nato) do §2.7 já estão calculados com os 13 (tabela lá). `tiltAtributos` dos
dois novos no §2.3. Flags: nenhum flag novo (compilação existente cobre); Previdente
e Enraizado entram em `VETORES_DE_VINCULO`? Não — vínculo é com pessoas, não com
patrimônio/chão (defende_demais_o_morto continua de zelador/amante/devoto).

*(e) Rotulagem.* Pressões de época: **[fonte]** (KB citada linha a linha). Degraus
de afinidade: **[fonte]** na direção, **[chute calibrável]** no degrau exato.

---

## §2.3 Priors de atributo e o mapa de tilt

*(a) Auditoria.* Painel A: os 280 inteiros atuais violam a norma N1 em massa —
**13 dos 14 arquétipos** têm INT 5 impossível ou INT 1 impossível; 8 têm WIS de
extremo zerado; 12 têm CHA de extremo zerado. A lavadeira INT `[2,4,2,1,0]`
(caso-teste da OS) é só a violação mais citada. Painel D: quadrantes INT × WIS
mortos em médico, boticário, moleiro, merceeiro e professora.

**Achado novo (além do previsto na OS): o acoplamento estrutural de
sorteios-irmãos.** O painel D mostra quadrantes mortos que os priors NÃO proíbem
(moleiro e merceeiro têm peso > 0 em INT ≥ 4 e WIS ≥ 4, e A/A = 0,0% em 200 mil
elencos). Causa, verificada por experimento: `hashString` é o polinômio linear
`h = h·31 + c` sem etapa de avalanche; duas chaves com o MESMO prefixo e sufixos
do MESMO comprimento diferem por uma constante aditiva (medida: 13298 entre
`…|atributo|INT` e `…|atributo|WIS`). Quando os totais de peso coincidem, o resto
módulo-total fica travado num subconjunto dos pares (18 de 81 no caso mod 9) — e
os sorteios "independentes" ficam rigidamente correlacionados. Afeta qualquer par
de decisões-irmãs de sufixo isométrico (FOR/INT/WIS/CHA entre si, `trait|1` ×
`trait|2` etc.).

**Remédio proposto (F2, dentro do bump de contrato):** o gerador ganha um
`hashDecisao(chave)` local (ex.: `hashString(String(hashString(chave)) + '#' +
chave)`) — o re-hash da representação decimal quebra a linearidade e decorrelaciona
chaves-irmãs. `src/logic/hash.js` NÃO muda (o runtime e os casos à mão não são
tocados); a troca vale só para o namespace do gerador, cujo golden set F2 já
regenera de qualquer forma. Guarda nova no QA: teste de independência qui-quadrado
grosseiro entre INT × WIS num lote de elencos (falha se |corr| > banda).
**[DECISÃO 3]**: aprovar o remédio do hash em F2 (recomendado — sem ele, o prior
composto herda o acoplamento e parte do esforço de F2 morre no artefato).

*(b) Levantamento.* A KB não dá distribuição de "inteligência por ofício" (nem
poderia); o que ela dá é direção de instrução/vida: instrução formal
(pároco/médico/professora), aritmética de balcão (comerciantes), ofício de corpo
(ferreiro/lavrador). Curvas de acesso são portanto **[chute calibrável]** com
direção **[fonte]**.

*(c) Proposta.*

**(i) Curvas de acesso canônicas** — em vez de 280 inteiros soltos, 4 curvas
nomeadas (soma 11–12, cauda jamais zerada, N1 por construção):

| curva | pesos | uso |
|---|---|---|
| `acesso_baixo` | `[2, 4, 3, 2, 1]` | modo 2 — a vida não deu porta (INT de lavrador/lavadeira) |
| `acesso_medio` | `[1, 3, 4, 3, 1]` | modo 3 — o comum |
| `acesso_alto` | `[1, 2, 3, 4, 2]` | modo 4 — instrução/vida puxa para cima |
| `acesso_muito_alto` | `[1, 1, 3, 4, 3]` | modo 4–5 — instrução formal plena (INT do médico) |

FOR fica FORA das curvas: os pisos duros por peso 0 permanecem (o ferreiro
`[0,0,2,4,3]` correto por construção — §3.2.1 da OS). Atribuição por arquétipo
(INT/WIS/CHA; 1 linha de justificativa cada, resumo):

| arquétipo | INT | WIS | CHA | justificativa (direção) |
|---|---|---|---|---|
| squire | alto | medio | alto | educado por tutor; comando social |
| paroco | muito_alto | medio | alto | Oxford/Cambridge; púlpito |
| medico | muito_alto | alto | medio | formação; olho clínico |
| boticario | alto | alto | medio | farmacopeia; balcão metódico |
| taverneiro | medio | alto | alto | o balcão lê gente |
| ferreiro | medio | medio | baixo | ofício de corpo, pouco verbo |
| moleiro | medio | medio | medio | comércio simples |
| merceeiro | medio | alto | medio | caderneta; miudeza atenta |
| professora | alto | medio | medio | instrução como ofício |
| costureira | medio | medio | medio | ofício fino, vida comum |
| lavadeira | baixo | medio | baixo | instrução negada (o caso-teste: INT 5 agora possível — a lavadeira pode ser gênio) |
| lavrador | baixo | medio | baixo | escola até os 10 |
| criada | medio | medio | baixo | jovem, subordinada |
| constable | medio | alto | medio | o ofício treina o olho |
| carroceiro* | medio | medio | medio | a estrada ensina gente |
| guarda_caca* | medio | alto | baixo | o mato treina o olho |
| parteira* | medio | alto | alto | ofício de mão e de confiança |
| pastor_de_ovelhas* | baixo | alto | baixo | solidão atenta |

(*se §2.1 aprovado.) **[chute calibrável]** por inteiro; o autor pode trocar
qualquer célula sem tocar sistema.

**(ii) Mapa completo de `tiltAtributos`** (multiplicadores inteiros por banda,
formato de 5 posições; N2: FOR jamais; N3: tudo ≥ 1):

| vetor | FOR | INT | WIS | CHA | justificativa |
|---|---|---|---|---|---|
| zelador | — | `[1,1,1,1,1]` | `[1,1,2,2,1]` | `[1,1,1,1,1]` | o cuidado repara no miúdo (leve) |
| soberano | — | `[1,1,1,1,1]` | `[1,1,1,1,1]` | `[1,1,1,2,2]` | comando; a presença que manda |
| erudito | — | `[1,1,1,2,2]` | `[1,1,1,1,1]` | `[1,1,1,1,1]` | o exemplo da OS |
| devoto | — | `[1,1,1,1,1]` | `[1,1,1,1,1]` | `[1,1,1,1,1]` | fé não é competência — sem tilt (registrado) |
| artifice | — | `[1,1,1,1,1]` | `[1,1,2,2,1]` | `[1,1,1,1,1]` | a mão que não erra (leve) |
| amante | — | `[1,1,1,1,1]` | `[1,1,1,1,1]` | `[1,1,2,2,1]` | o charme do vínculo (leve) |
| provador | — | `[1,1,1,1,1]` | `[1,1,1,1,1]` | `[1,1,2,2,1]` | o polimento social conquistado (leve) |
| errante | — | `[1,1,1,1,1]` | `[1,1,1,1,1]` | `[1,1,1,1,1]` | horizonte não é atributo — sem tilt |
| justiceiro | — | `[1,1,1,1,1]` | `[1,1,1,1,1]` | `[1,1,1,1,1]` | o que pesaria é FOR — vetado por N2; sem tilt (registrado) |
| bufao | — | `[1,1,1,1,1]` | `[1,1,1,1,1]` | `[1,1,1,2,2]` | a graça é performance |
| vigia | — | `[1,1,1,1,1]` | `[1,1,1,2,2]` | `[1,1,1,1,1]` | o exemplo da OS |
| previdente* | — | `[1,1,2,2,1]` | `[1,1,1,1,1]` | `[1,1,1,1,1]` | a aritmética do pé-de-meia (leve) |
| enraizado* | — | `[1,1,1,1,1]` | `[1,1,1,1,1]` | `[1,1,1,1,1]` | raiz não é atributo — sem tilt |

Três vetores sem tilt algum é desenho, não omissão: o tilt é tempero raro, ou o
composto vira novo estereótipo ("todo Erudito é INT 5"). **[chute calibrável]**.

*(d) Impacto.* Muda TODOS os atributos de TODOS os elencos (bump + golden set,
já exigido por F2); a massa nas bandas faladas (≥ 4, ≤ 2) cresce — o "valor 3
mudo" (reclamação nº 8) perde massa: nas curvas propostas o 3 detém 27–36% contra
30–44% hoje; G4 (réu × isca simétricos) mede se INT alto não vira tell fraco.
Proposta de banda para **G4 [DECISÃO 4]**: em lote ≥ 50 seeds, a diferença
absoluta entre P(INT ≥ 4 | destoante inocente) e P(INT ≥ 4 | réu) ≤ **10 pontos
percentuais** (recomendado; folga honesta para lote de 50).

*(e) Rotulagem.* Tudo em (c): **[chute calibrável]**; direções: **[fonte]** (KB
demografia §1/§3–4). O achado do hash: **[fonte: experimento reproduzível
documentado no painel D + teste de correlação]**.

---

## §2.4 Traits (pools 1–3 → 3–5)

*(a) Auditoria.* Painel E: segundo trait em 31,5% (a moeda universal 1/3);
catálogo atual: 4 traits / 8 comportamentos. Pools por arquétipo: 1 (médico,
constable) a 3.

*(b) Levantamento.* O custo real é boca + QA (restrição de arquitetura da OS):
cada trait novo = comportamento NOMEADO novo no catálogo fechado, mapeado 1-para-1
a efeito observável de interrogatório.

*(c) Proposta — +3 comportamentos (dentro do teto +2 a +4 da OS)*
**[DECISÃO 5: teto exato]**:

| trait novo | comportamento | efeito observável de interrogatório | falha detectável (fair play) |
|---|---|---|---|
| `rancoroso` | `vies_contra_desafeto` | o depoimento carrega contra UM desafeto nomeado; acusações dele vêm infladas | o viés é declarado por terceiros ("esses dois não se falam desde…") — cruzável |
| `servil` | `confirma_o_que_sugerem` | ecoa a hipótese que o perito insinua; confirmação vale pouco | perguntar o CONTRÁRIO produz eco contrário — o teste está nas mãos do jogador |
| `supersticioso` | `le_agouros` | mistura presságios à observação; causas não confiáveis, MAS horas ancoradas no sino/missa são precisas | a pepita temporal sobrevive ao ruído causal — instrumento enviesado, não inútil |

Distribuição proposta nos pools (todo arquétipo passa a pool ≥ 3): rancoroso →
ferreiro, moleiro, lavrador, criada, lavadeira; servil → criada, merceeiro,
boticario, costureira; supersticioso → lavadeira, lavrador, pastor_de_ovelhas*,
parteira*, taverneiro. **[chute calibrável]**; a plausibilidade de época:
superstição rural e deferência de criadagem são lugar-comum documentado da KB
(demografia §1/§5) **[fonte na direção]**.

**Chance do segundo trait por arquétipo** (hoje 1/3 universal): campo novo
`chanceSegundoTrait` em sextos — tagarelas/postos de escuta (taverneiro,
lavadeira, merceeiro) = 3/6; taciturnos de ofício (lavrador, pastor*, ferreiro)
= 1/6 (o vilão de poucas palavras é UMA nota, não duas); resto = 2/6 (o 1/3 de
hoje). **[chute calibrável]**.

*(d) Impacto.* +3 entradas em `comportamentos.js` (catálogo 8 → 11) + boca na OS
de diálogo (dependência C explícita: o efeito é spec declarativa consumível, como
os 8 atuais); QA: lint de trait órfão já cobre; `ORDEM_COMPORTAMENTOS` cresce (a
ordem canônica muda replay — dentro do bump).

*(e) Rotulagem.* Comportamentos e distribuição: **[chute calibrável]** com
direção **[fonte]**.

---

## §2.5 Motivos potenciais (pools 2–4 → 4–6)

*(a) Auditoria.* Pools atuais: 2 (médico, boticário, moleiro, merceeiro,
constable) a 4; catálogo de 10 motivos; o móbil do réu premeditado é o
`motivoPotencial` sorteado uniforme no pool do arquétipo.

*(b) Levantamento (aritmética da KB, item a item).* `demografia-e-sociedade.md`
§4 (renda/preços), `economia-e-estrutura-social.md` §1 (depressão agrícola), §5
(Married Women's Property Act 1882), §6 (caridade como coleira), demografia §5
(pub: apostas e crédito).

*(c) Proposta — 4 motivos novos no catálogo:*

| id novo | descrição com aritmética | fonte |
|---|---|---|
| `hipoteca_ou_arrendo` | A fazenda/oficina que não paga mais a hipoteca; a renda que o senhorio não baixa com o trigo a 22s o quarter — ruína lenta e documentada. | economia §1 **[fonte]** |
| `propriedade_da_esposa` | Desde 1882 a mulher casada possui e dispõe; o marido que perdeu o domínio legal sobre £100–500 da esposa — dinheiro que mudou de mãos por lei há onze anos. | economia §5 **[fonte]** |
| `divida_de_jogo` | Apostas do pub: 10–20s perdidos são semanas de salário; a dívida de jogo não tem instância — cobra-se ou apaga-se. | demografia §5 **[fonte na prática do pub; somas: chute calibrável]** |
| `caridade_negada` | A esmola, o socorro da paróquia ou o *character* dependem de quem dá; negado o socorro, a workhouse é o degrau seguinte. | economia §6 + demografia §1 **[fonte]** |

Distribuição para levar TODO pool a 4–6 (respeitando "economicamente plausível
para aquela vida"): squire +`propriedade_da_esposa` +`hipoteca_ou_arrendo`;
paroco +`caridade_negada`; medico +`propriedade_da_esposa` +`divida_de_jogo`;
boticario +`hipoteca_ou_arrendo` +`divida_de_jogo`; taverneiro +`divida_de_jogo`
+`propriedade_da_esposa` (a taverneira viúva!); ferreiro +`hipoteca_ou_arrendo`;
moleiro +`hipoteca_ou_arrendo` +`propriedade_da_esposa`; merceeiro
+`caridade_negada` +`divida_de_jogo`; professora +`caridade_negada`; costureira
+`propriedade_da_esposa`; lavadeira +`caridade_negada`; lavrador
+`divida_de_jogo`; criada +`caridade_negada`; constable +`divida_de_jogo`
+`caridade_negada`. **[fonte na aritmética; encaixe por arquétipo: chute
calibrável]**.

*(d) Impacto.* O mapa "ofício do réu → móbil material" sai de 2–4 destinos para
4–6 — soma-se ao §2.7 para desfazer a determinização (critério de aceite nº 4 da
OS conta o móbil ÍNTIMO; este dossiê alarga o material, que o regime 1 do §4.2
promove a protagonista). Templates de prosa das cartas de móbil precisam de
variantes novas (pipeline de prosa, F4).

*(e) Rotulagem.* Na tabela.

---

## §2.6 Nomes

*(a) Auditoria.* Painel E: 55 prenomes e 30 sobrenomes distintos em 1,6 M de
personagens; sorteio uniforme por coorte (top-5 de prenomes = ~20% do total, sem
peso de frequência real); 21,4% dos elencos repetem sobrenome internamente
(desejado pela KB); par completo único garantido por caso.

*(b) Levantamento.* Ver integração da pesquisa abaixo (listas de frequência
1890/1840 e sobrenomes 1881 com fontes).

*(c)–(e)* Ver integração abaixo. Nota prévia de ambientação: a vila do jogo não
crava condado; "regionais à comarca" traduz-se por **sul rural da Inglaterra,
excluindo sobrenomes marcadamente galeses/nortistas do acréscimo** — ou o autor
crava a comarca **[DECISÃO 6]**.

### Integração da pesquisa de nomes (fontes e lacunas)

*(b) O que a pesquisa confirmou:*

- **Concentração histórica real (Galbi 2002, arXiv physics/0511021, verificado):**
  coorte de 1840 — Mary = 18,7% de TODAS as meninas; William = 15,4% dos meninos;
  top-3 ≈ 40–43%; top-10 = 75–76%. Coorte de 1880 — Mary 10,6%, William 11,7%,
  top-10 = 54–59%. **O sorteio uniforme atual é, portanto, o anacronismo**: numa
  vila real de 1893, três nomes cobriam ~40% de cada sexo entre os velhos. Pesos
  de frequência não são cosmética — são a textura demográfica documentada.
- **Top-10 por coorte com percentuais (Galbi):** masc. c. 1825: William 16,3,
  John 13,5, George 9,4, James 8,6, Thomas 8,6, Henry 7,6, Charles 5,8, Joseph
  3,7, Edward 3,5, Robert 3,1; fem. c. 1825 (amostra norte): Mary 20,3, Jane
  13,5, Elizabeth 12,9, Ann 11,6, Margaret 9,4, Sarah 5,8, Hannah 3,6, Ellen
  3,3 (Isabella/Catherine são marcador do norte — podadas para o sul).
- **Lacuna declarada:** a lista top-200 de 1890 (britishbabynames.com) existe mas
  está inacessível deste ambiente (bloqueio de proxy); a alternativa oficial é o
  top-100 do ONS de 1904, verificado — utilizável para a coorte jovem DESDE QUE
  podados os modismos tardios (Doris, Gladys, Marjorie, Ivy, Reginald, Stanley,
  Leslie, Cyril etc., que nomeiam nascidos ≥ 1885 e não adultos de 1893).

*(c) Proposta.*

1. **Formato:** `NOMES` passa de array para lista ponderada
   `[{ nome, peso }]` por gênero × coorte — mesmo formato inteiro dos priors.
   **Pesos em 4 faixas** que reproduzem a concentração de Galbi:
   faixa A (top-3) peso **8**; faixa B (4º–10º) peso **4**; faixa C (11º–30º)
   peso **2**; faixa D (cauda regional/bíblica) peso **1**. Com ~55 nomes por
   coorte, isso dá top-3 ≈ 30% e top-10 ≈ 60% — entre a coorte 1840 e a 1880,
   adequado a um elenco que mistura as duas **[fonte: Galbi; calibragem exata
   das faixas: chute calibrável]**.
2. **Expansão para ~50–60 por coorte:** base = pools atuais (KB §6) + top-60
   ONS 1904 **podado** dos modismos pós-1885 (método documentado acima) para a
   coorte 1860–75 + clássicos de Galbi para a coorte 1820–50; diminutivos de uso
   diário (Bess, Polly, Nell, Maggie — KB §6) entram como VARIANTE DE PROSA,
   não como nome de batismo sorteável. **[fonte com método declarado]**
3. **Sobrenomes 30 → ~50:** manter os 30 atuais (contrato mínimo); acrescentar
   ~20 do topo nacional na ordem-proxy ONS 2002 (a pesquisa confirmou que a
   ordem do topo de 1881 é essencialmente a mesma; contagens de 1881 completas
   exigiriam o *Surname Atlas* — lacuna declarada), com viés SUL RURAL por
   Schürer 2004 (*Local Population Studies* 72, PDF verificado): excluir do
   acréscimo patronímicos em -son (Cumberland–Yorkshire; "raros ao sul da linha
   Mersey–Tâmisa") e o bloco galês além dos já presentes; preferir
   topográficos/ocupacionais do sul (ex.: Martin, Lee, Bennett, Webb, Chapman,
   Carter, Palmer, Mills, Barnes, **Fuller** — o dialetal do sudeste —, Read,
   Andrews, Gray, Marsh, Page, Parsons, Ellis, Knight, Saunders, Field)
   **[fonte na ordem e no viés regional; composição exata: chute calibrável]**.
   Política de repetição (2–3 por vila) e vetos (par único; anti-"Thomas
   Thomas") inalterados — e Schürer dá o lastro: bolsões de endogamia de
   sobrenome (Weald, Cornualha, East Anglia) tinham "meia dúzia de famílias com
   o mesmo sobrenome".
4. **Peso nos sobrenomes:** NÃO ponderar (uniforme como hoje). Motivo: a
   concentração de sobrenomes numa vila é local e familiar, não nacional — a
   política de repetição já a produz; ponderar pelo censo nacional só engordaria
   Smith/Jones sem ganho de textura **[decisão de design registrada]**.

*(d) Impacto.* Colisões de nome inter-casos caem (~55 → ~110+ nomes efetivos por
gênero); o par completo único por caso fica mais folgado (824 pares usados em
16.000 personagens hoje — painel E); a coorte de batismo por idade ganha
verossimilhança de frequência. Bump de conteúdo como o resto.

*(e) Rotulagem.* Concentrações e listas-fonte: **[fonte]** (Galbi 2002; ONS 1904;
Schürer 2004; KB §6). Faixas de peso e composição final das listas: **[chute
calibrável]** com método declarado. Pendência de fonte registrada: se o autor
acessar o top-200 de 1890 (URL no relatório de pesquisa), a lista da coorte
jovem troca o proxy-1904 pela fonte direta — troca de dados, não de sistema.

---

## §2.7 Matriz de afinidade: os novos raros

*(a) Auditoria.* Painéis B e G: 12/14 ofícios com 1 raro; P(nato) por pessoa
3,4–7,7%; isca forçada 72,8%; réu forçado 94,9%.

*(b) Justificativa dramática por par (a vocação estrangulada):*

| ofício | 2º raro proposto | a vocação estrangulada |
|---|---|---|
| squire | **amante** | a paixão abaixo da classe — o vínculo que o nome proíbe |
| paroco | **amante** (3º; já tem 2) | o coração que o púlpito não deixa — a paroquiana casada |
| medico | **devoto** | ciência × fé em 1893 — a batina que o bisturi calou |
| boticario | **justiceiro** | o balcão que anota cada afronta — o fiado não pago, o desprezo do médico |
| taverneiro | **erudito** | o autodidata atrás do balcão — lê de madrugada o que a vila bebe de dia |
| ferreiro | **soberano** | sonha a oficina com aprendizes, a dinastia de ofício que a depressão nega |
| moleiro | **errante** | herdou o moinho que o prende — e o moinho a vapor da cidade o mata devagar |
| merceeiro | **erudito** | a caderneta como único livro que a vida lhe deu |
| professora | **amante** | o vínculo que o posto proíbe — casar é perder a escola |
| costureira | **soberano** | veste a gentry e decora cada gesto — a classe alheia no espelho |
| lavadeira | **devoto** | lava a nódoa alheia e professa pureza — a vocação de freira que a pobreza negou |
| lavrador | **erudito** (3º; já tem 2) | o gênio sem letras da biblioteca da capela |
| criada | **erudito** | lê às escondidas os livros do patrão |
| constable | **soberano** | o uniforme sem mando — quem prende não manda |

*(c) Pesos.* Cada par acima: degrau `media → rara` (peso 2 → 1), razão 4:2:1 e
piso 1 mantidos. Linhas novas dos 4 arquétipos do §2.1 (se aprovados) nascem já
com 2 raros: carroceiro (alta: errante, vigia — a estrada vê tudo; raros:
soberano, erudito); guarda_caca (alta: vigia, justiceiro; raros: zelador,
amante); parteira (alta: zelador, vigia; raros: soberano — a que decide quem
nasce —, previdente*); pastor_de_ovelhas (alta: errante, zelador; raros:
erudito, bufao). **[chute calibrável na direção da 7.2]**.

*(d) Impacto (calculado, `projecao-matriz` sobre os módulos reais):*

| cenário | P(nato) por ofício | média demográfica | isca forçada ≈ (1−p)⁶ | falha das 24 tentativas |
|---|---|---|---|---|
| atual (11 vetores) | 3,4–7,7% | 5,0% | **73,5%** | 29,1% |
| só novos raros | 7,1–12,0% | 9,0% | **56,8%** | 10,4% |
| raros + Previdente/Enraizado | 6,3–10,3% | 8,2% | **59,7%** | 12,7% |

Ambos os cenários batem as metas da OS (P(nato) ~7–11%; isca ≤ 60%; critérios de
aceite nº 3). O mapa ofício→móbil íntimo ganha ≥ 2 destinos em **14/14** (com o
3º do pároco e do lavrador) — acima do critério nº 4 (≥ 2 em ≥ 12). A guarda de
"degrau raro alcançável" do QA continua satisfeita por construção.

*(e) Rotulagem.* Justificativas dramáticas: **[fonte]** onde citam KB (marriage
bar da professora, moinho a vapor, depressão) — em rigor: professora/casamento e
moinho a vapor são conhecimento histórico geral ainda NÃO lavrado na KB do repo;
lavrar 1 linha em `demografia-e-sociedade.md` §3 no commit de F3 (regra de
proveniência). Degraus: **[chute calibrável]**.

---

## §2.8 Constantes universais candidatas a virar dado

*(a) Auditoria.* Painel F: omite_por_decoro 49,3% (polaridade `% 2`),
mente_com_calma 24,8% (`% 4`), segundo trait 31,5% (`% 3`) — universais, sem
classe nem ofício.

*(b)–(c) Por constante:*

1. **`omite_por_decoro` por classe — TEM fundamento; virar dado.** Economia §2: a
   respeitabilidade é "a moeda da classe média"; a diferenciação por decoro
   atravessa as classes mas com intensidade desigual (roupa de domingo, fachada,
   *character*) **[fonte]**. Proposta (chance em sextos, por `classeSocial`):
   gentry 4/6 · clero 5/6 · profissional 4/6 · comerciante 4/6 · artesao 3/6 ·
   lavrador 2/6 · criadagem 3/6 (a criada cala pelo emprego, não pelo decoro — e
   `medroso` já cobre o calar por medo) · servico_do_condado 3/6. Números:
   **[chute calibrável]**; direção: **[fonte]**.
2. **Chance do segundo trait — SEM fonte própria; modular por arquétipo como
   textura (§2.4), não por classe.** Motivo registrado: não há dado histórico
   sobre "quantos traços marcantes tem uma pessoa"; a modulação proposta é
   dramática (tagarela × taciturno), honestamente rotulada **[chute calibrável]**.
3. **`mente_com_calma` 25% — acoplar ao cenário; manter a taxa global.**
   Fundamento dramático (não estatístico) registrado: a calma é ensaio, e ensaio
   é premeditação — a KB de encenação (inquerito-e-policia.md: o depoimento
   ensaiado que se denuncia pela repetição sem variação) dá a direção
   **[fonte na direção]**. Proposta: premeditado 2/6, briga escalada 1/6
   **[DECISÃO 7]** (média ponderada pelos ~2/3 premeditados ≈ 28% — próxima dos
   25% atuais; o tell novo é o ACOPLAMENTO, não a taxa).

*(d) Impacto.* Flags recompiladas para todo caso (bump); G5/G6 medem as novas
proporções.

*(e) Rotulagem.* Acima, por item. Regra da OS respeitada: o que não tem fonte nem
razão dramática registrada (nada restou nessa caixa) permanece constante.

---

## §2.9 Encenação — pesquisa sim, expansão bloqueada

*(a) Estado.* 8 itens nos pools; 6 sem realização física (só `hora_encenada` via
`gen_hora_forjada`; `sinais_hesitacao_defesa` parcialmente via autobattler).

*(b) Levantamento (varredura completa da `kb-medicina-legal/`, com arquivo+seção
por item).* Candidatos levantados para a futura OS de realização (cartas de
vestígio), com a falha detectável por construção de cada um:

| candidato | eixo | pool | falha detectável (a KB manda) |
|---|---|---|---|
| `suspensao_post_mortem` | causa | instrumental | sulco sem reação vital; sulco duplo; face congesta discordante (`encenacao.md`, dossiê "suspensão post-mortem") |
| `degola_post_mortem` | causa/autoria | instrumental | sangue não projetado; sem cortes de hesitação; a causa real sobrevive (`encenacao.md`, dossiê "degola post-mortem") |
| `arma_posta_na_mao` | autoria | instrumental | sem espasmo cadavérico a arma repousa frouxa/invertida (`encenacao.md`, dossiê "arma posta na mão") |
| `incendio_para_ocultar` | causa/identidade | instrumental | vias limpas de fuligem; sem carboxi-hemoglobina; queimadura sem reação vital (`encenacao.md`, dossiê "corpo queimado") |
| `manipulacao_do_resfriamento` | tempo | instrumental | os sinais não conspiram: livor fixo denuncia (`encenacao.md`; sub-tipo do `hora_encenada` existente, não duplicata) |
| `veneno_disfarcado_de_doenca` | causa | instrumental | quadro toxicológico sobrevive; arsênico retarda putrefação; o livro de venenos vive FORA da cena (`encenacao.md` + `venenos.md` "Arsênico") |
| `roubo_simulado` | autoria | reativo | gavetas abertas, ouro à vista intacto (`protocolo-exame.md` §4) |
| `arrombamento_forjado` | autoria/lugar | reativo | alavanca no sentido incompatível, marcas rasas (`protocolo-exame.md` §4) |
| `corpo_movido` | lugar | reativo | livor fixo contraditório; trilha de arrasto (já classe de vestígio no motor) |
| `lesoes_autoinfligidas_defesa` | autoria | instrumental | lesões superficiais, iguais, ao alcance da própria mão (`encenacao.md`, "a simetria artificial") |
| `queda_de_escada_forjada` | causa | instrumental | padrão de golpe entre lesões de queda; exige âncora espacial (escada) (`traumas.md`, dossiê precipitação) |
| `afogamento_encenado_acidente` | causa | instrumental | atordoamento sem explicação de queda; arrasto até a borda (`asfixias.md`, afogamento; âncora D2) |
| `sufocacao_como_morte_natural` | causa | reativo/instr. | escoriações periorais, fibras nos lábios, petéquias (`asfixias.md`, sufocação) |
| `bilhete_forjado` | — | instrumental | a cena que responde antes da pergunta (`encenacao.md`, "o erro do leigo") |
| `avistamento_falso` | tempo | instrumental | depoimento × convergência algor/rigor/livor (`protocolo-exame.md` §4 + `inquerito-e-policia.md` §4) |

**Expansão BLOQUEADA nesta OS**, como manda o §2.9 — a tabela acima é o
inventário de partida da OS de realização. Registro do risco a vigiar (pedido da
OS): a "qualidade de encenação" **se reparte** entre três atributos no design
vigente (estrutura → INT; limpeza → WIS; álibi → CHA — `game-design-simulacao.md`
§3.1/§3.2); a OS de realização deve amarrar cada item novo ao atributo certo,
sob pena de a encenação virar segundo emprego de WIS e apagar o quadrante.

---

## §2.10 A vítima

*(a) Estado.* O vetor da vítima vira `portaoVitima` (pesos resistir × fugir ×
gritar no autobattler) e morre no log; nenhuma superfície de inquérito conta quem
o morto era por dentro.

*(b)–(c) Achado registrado (a decisão é da OS de diálogo).* A superfície barata
existe e não toca o motor: o pacote já carrega prosa de localidades/cartas
geradas por template; a biografia íntima da vítima pode alimentar **ganchos de
prosa do inquérito** — a fala do coroner sobre a reputação do morto, o
comentário de vizinhança (ex.: vítima Previdente → "não devia um penny a
ninguém, e media o pão"; vítima Vigia → "sabia da vila inteira; à janela até
tarde") — SEMPRE consequência, jamais rótulo, pelo pipeline de prosa, com um
gancho POR CASO (orçamento mínimo). Anti-tell a projetar lá: o gancho não pode
correlacionar com o móbil real acima de banda (a vítima bisbilhoteira não pode
implicar chantagem-móbil em 100% dos casos). **[DECISÃO 8 — na OS de diálogo]**:
consumir os ganchos lá, com a banda anti-tell definida naquele QA.

---

## §D — Consolidado de propostas e decisões pendentes

Propostas desta F1, em resumo: 4 arquétipos novos (§2.1) · 2 vetores novos + 1
reprovado com motivo (§2.2) · curvas de acesso N1 + mapa de tilt + remédio do
hash (§2.3) · 3 traits/comportamentos novos + chance de 2º trait por arquétipo
(§2.4) · 4 motivos novos, pools a 4–6 (§2.5) · nomes com peso de frequência
(§2.6, integração) · 2º/3º raros para 14/14 ofícios (§2.7) · decoro por classe e
calma acoplada ao cenário (§2.8) · inventário de encenação para OS futura, sem
expansão (§2.9) · ganchos da vítima registrados para a OS de diálogo (§2.10).

| # | [DECISÃO] | Opções | Recomendação |
|---|---|---|---|
| 1 | §2.1 arquétipos novos (teto 18) | (a) os 4 propostos; (b) subconjunto; (c) nenhum | **(a)** — carroceiro, guarda-caça, parteira, pastor |
| 2 | §2.2 vetores novos (teto 13) | (a) Previdente + Enraizado; (b) só Previdente; (c) nenhum | **(a)** |
| 3 | §2.3 remédio do hash do gerador em F2 | (a) sim, `hashDecisao` local; (b) não (conviver com o acoplamento) | **(a)** — sem isso o prior composto herda o artefato |
| 4 | §3.4-G4 banda de simetria réu × isca | proposta: Δ ≤ 10 p.p. em INT ≥ 4, lote ≥ 50 | **Δ ≤ 10 p.p.** |
| 5 | §2.4 teto de comportamentos novos (+2 a +4) | +2 / +3 / +4 | **+3** (rancoroso, servil, supersticioso) |
| 6 | §2.6 comarca dos sobrenomes | (a) sul rural genérico (sem cravar condado); (b) cravar comarca | **(a)** |
| 7 | §4.4/§2.8 calma acoplada ao cenário | (a) premeditado 2/6, briga 1/6; (b) manter 1/4 universal | **(a)** |
| 8 | §2.10 ganchos da vítima | registrar aqui, decidir na OS de diálogo | **registrado** |
| 9 | §4.2 razão do regime de magnitude | 70/30 (proposta da OS) ou outra | **70/30**, sal `seed\|caso\|regime-magnitude` |
| 10 | §4.4 chance de `mente_com_calma_periferica` | 15–20%; proposta 1/6 ≈ 16,7% | **1/6** |
| 11 | §4.6-G5 piso de precisão do tell calmo | fração de mentirosos-calmos inocentes ≥ X | **X = 60%** (projeção com 1/6: ~75–80%) |
| 12 | §5-F4 destino de `afinidadePapeis` | (a) remover; (b) consumir | **(a) remover** — o fluxo gerado não escala papéis nomeados; dado que envelhece sem uso (registrar em historico-decisoes) |

Sais novos previstos para as fases F2–F4 (contrato do §0.5, consolidação prévia):
`atributo-composto:FOR/INT/WIS/CHA` (F2), sufixo `|forcado|tentativa<k>` da
cascata (F2), `regime-magnitude` (F3), `flag_<i>_calma_periferica` +
`flag_<i>_tema_periferico` (F3), `chanceSegundoTrait` reusa `temSegundoTrait`?
NÃO — sal novo `segundoTrait-v2` (regra: nunca reusar sal entre decisões
distintas; a decisão mudou de forma). Lista final no cabeçalho de cada PR.

— fim de F1 —
