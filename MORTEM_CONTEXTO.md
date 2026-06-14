# MORTEM — Documento de Contexto Completo

> Fonte única de verdade do design. Escrito para ser lido por humanos e por agentes de código (Claude Code). Consolida todas as decisões de design até a migração para a gramática de dedução universal (junho/2026). Em caso de conflito com qualquer outro documento, **este prevalece**.

---

## 1. O que é MORTEM

MORTEM é um jogo de investigação forense baseado em texto e cartas, ambientado na Inglaterra vitoriana (1893). O jogador é um perito médico-legal independente, chamado a vilarejos onde a polícia local não tem competência técnica para resolver homicídios. Toda a experiência acontece sobre uma **escrivaninha vista de cima**: evidências, depoimentos e conclusões são **cartas**; raciocinar é processar cartas em **gavetas lógicas**; acusar é redigir um **Libelo** e defendê-lo num tribunal que não perdoa lacunas.

**Referências de design:**
- *Cultist Simulator* — interface de mesa/cartas, tudo é arrastar, narrativa emergente da manipulação de objetos
- *Papers, Please* — rotina técnica sob pressão de tempo, com peso moral nas decisões
- *Return of the Obra Dinn* — dedução genuína: o jogo dá dados, o jogador produz a verdade

**Plataforma:** web app React. Sem engine de jogo. 100% determinístico.

---

## 2. O que diferencia MORTEM dos demais jogos de detetive

1. **"Nem todo mentiroso é culpado."** Inocentes mentem por razões próprias (vergonha, medo, autopreservação). A regra estrutural: *a mentira do assassino é inconsistente com a evidência FÍSICA; a mentira do inocente é inconsistente apenas com a MORAL*. O jogo pune pattern-matching preguiçoso ("mentiu → culpado") e recompensa perícia.

2. **O jogo nunca entrega conclusões.** O jogador recebe dados brutos ("articulações rígidas", "24°C corporal") e material de referência (Glossário Forense de época). A interpretação é dele. Não há personagem que resuma, não há highlight de "pista importante".

3. **Dedução contra uma gramática universal, anti força-bruta.** As gavetas não oferecem um menu de respostas do caso: o jogador **deduz** contra um espaço universal (catálogo de causas + modelo de tempo, §6.1), estreitando-o ao combinar pistas — triangula a hora, elimina causas pelos sinais. A gaveta registra o que ele afirma sem validar. Não existe vitória por tentativa e erro mecânico, nem menu curto a adivinhar.

4. **Zero feedback durante a investigação.** Nenhum ✓/✗, nenhum "correto!". Conclusões registradas nas gavetas são apenas registradas. A verdade só é revelada no tribunal final, de uma vez, com consequências.

5. **Errar é permitido — e tem consequência.** O jogo não bloqueia acusações fracas ou erradas. Existem 4 finais possíveis (Vitória Absoluta, Sucesso com Gafes, Impunidade, Erro Judiciário), e cada um narra o custo do que o jogador fez ou deixou de fazer.

6. **Camada narrativa ≠ camada lógica.** Toda carta carrega `tagsOcultas` (domínio, subdomínio, valores). As regras do jogo leem SOMENTE as tags, nunca nomes ou textos de cartas. É isso que torna a geração procedural de casos viável: trocar a narrativa não exige tocar no motor.

7. **Zero LLM em runtime.** Dados em JSON/JS, lógica em funções puras, monólogos finais gerados por templates universais com variáveis injetadas. O jogo roda offline e é totalmente reproduzível.

8. **Tempo como recurso forense.** O relógio avança com ações periciais (extrair, interrogar) — não com pensamento (gavetas, glossário, organizar a mesa custam zero). Evidências não coletadas degradam de forma medicamente realista (rigor mortis passa; livores fixam). A pressão é forense, não arcade.

9. **"Tudo é mesa. Tudo é carta. Tudo é arrastar."** Sem troca de telas, sem menus profundos, sem árvores de diálogo aninhadas. Eventos (cena do crime, interrogatórios) abrem como overlays sobre a escrivaninha — a mesa nunca sai do DOM.

---

## 3. A fantasia e o tom

O jogador é **o perito que chega de fora**: respeitado pela técnica, desconfiado pelos locais. O tom é **vitoriano minimalista** — prosa contida, sensorial, sem melodrama. A morte é tratada com a frieza profissional de um laudo e a gravidade de um luto.

Texto do jogo inteiramente em **português (PT-BR)**, sem anacronismos. Eventos de investigação são prosa imersiva com **termos clicáveis em negrito** inline (ex.: **articulações rígidas**, **sulco horizontal no pescoço**) — clicar extrai a carta correspondente.

**Estética visual:** mesa de madeira escura à luz de vela. Paleta base Tailwind: fundos `stone-950/900`, texto `stone-300/400/600`, acentos `amber-200` (títulos serif) e `amber-900` (lacres, avisos). Tipografia serifada para títulos e nomes; sem ícones modernos; ornamentos tipográficos discretos (§, ―).

---

## 4. O loop de jogo

1. **Abertura** — Escrivaninha vazia em Caulfield (pensão miserável: vela, garrafa, jornal). A Sra. Potts entrega uma carta do delegado de Briarstone. Aceitar transforma a escrivaninha no hub de investigação.
2. **Briefing** — Chegada a Briarstone. O Delegado Wycliffe apresenta o caso (custo zero de tempo). Perguntas ao delegado plantam informações e iscas.
3. **Investigação** — O relógio começa a contar (chegada às 11:00). O jogador alterna entre:
   - **Examinar** localidades (Corpo, Cena, Delegacia) — extrair cartas clicando nos negritos (custa tempo);
   - **Interrogar** suspeitos — depoimentos clicáveis viram cartas comportamentais (custa tempo);
   - **Raciocinar** nas gavetas, consultar Glossário, Caderneta e Painel de Álibis (custo zero).
4. **Libelo** — No Quadro de Revelações, o jogador redige a acusação formal preenchendo um formulário narrativo.
5. **Tribunal** — O motor compara o Libelo contra a Verdade de Ouro e gera o **Monólogo Final** correspondente a um dos 4 desfechos. Só aqui o jogador descobre o que acertou e errou.

---

## 5. A Escrivaninha (hub central)

O jogador nunca sai desta tela. Layout:

```
[      QUADRO DE REVELAÇÕES (parede)      ]

――――――――――――――――――――――――――――――――――――――――――
|                                [Relógio]|
|                                         |
|        SUPERFÍCIE LIVRE                 |
|        (cartas soltas + localidades)    |
|                                         |
|-----------------------------------------|
|     Cronos    |    Aitiov    |   Nexo   |
|-----------------------------------------|
[Caderneta]   [Painel de Álibis]  [Glossário]
```

- **Relógio de Bolso** (sup. direito): avança apenas com ações que custam tempo.
- **Superfície Livre** (centro): cartas arrastáveis e organizáveis, custo zero. **Localidades são cartas** na superfície — não sidebar. Ao clicar numa localidade, a mesa recebe `blur(6px)` + `opacity 0.3` e o evento abre como overlay centralizado (`position: fixed`). Ao fechar, cartas novas extraídas surgem na superfície. Não existe troca de tela.
- **3 Gavetas** (inferior): processadores lógicos. No tutorial, só Cronos visível no início; as demais desbloqueiam progressivamente.
- **Caderneta** (overlay, custo zero): log de tudo que foi extraído, registrado e concluído.
- **Glossário Forense** (overlay, custo zero): referência de época, contexto-sensitivo.
- **Painel de Álibis** (overlay, custo zero): ver §8.
- **Quadro de Revelações** (parede): abre o formulário do Libelo.

**Regras UX:** nenhuma ação exige mais de 2 cliques; feedback visual imediato; gavetas acendem (verde/escuro) quando carta compatível se aproxima; a interface ensina pela forma, não por texto tutorial.

---

## 6. Sistema de Cartas e Tags Ocultas (motor lógico)

Toda carta tem duas camadas:

```js
{
  id: 'evidencia_004_rigor_mortis',
  textoDisplay: 'Articulações Rígidas',        // camada narrativa (jogador vê)
  carimboPadrao: 'Rigor Mortis Pleno',
  custoTempo: 2,
  tagsOcultas: {                                // camada lógica (motor lê)
    dominio: 'temporal',
    subDominio: 'rigor_mortis',
    estadoRigor: 'pleno',                       // ESTADO observado bruto
    estadoDegradacao: 'ativo',
  },
}
```

A carta carrega o **estado observado bruto** (ex.: `estadoRigor: 'pleno'`, ou `temperaturaCorpo`/`temperaturaAmbiente` no algor, ou um `sinal` discriminante nas causais). Quem converte esse estado numa janela de horas ou numa causa é a **gramática universal** (§6.1), não a carta — é isso que permite gerar casos sem reescrever lógica.

**Domínios:** `temporal`, `causal`, `ambiental`, `comportamental`, `vestigio`.

**Extração com carimbo integrado:** clicar no termo em negrito avança o relógio pelo `custoTempo` e a carta já nasce registrada (`termoCarimbo = carimboPadrao`). Não existe estado intermediário "extraída mas não carimbada", não existe `ModalCarimbo`. Tudo vai direto para `cartasRegistradas`.

**Regra inviolável:** funções de gaveta e de veredicto leem apenas `tagsOcultas` (e a seed). Nunca decidem por `id` ou `textoDisplay` de carta.

### 6.1 Gramática Universal de Dedução (migração de junho/2026)

O caso (seed) **não contém alternativas**. Cada caso traz só a **Verdade de Ouro** + as **pistas físicas** (cartas com `tagsOcultas`). O espaço de respostas é **universal**, igual para todo caso, e mora no motor:

- **Catálogo universal de causas** (`src/data/catalogo_causas.js`): todas as causas que o jogo conhece (asfixias, intoxicações, traumas) e o vocabulário de **sinais**. Um sinal de *família* (ex.: petéquias → asfixia) aponta o gênero; um sinal de *assinatura* (ex.: sulco horizontal → ligadura) crava a espécie e descarta as parecidas. O jogador deduz por **eliminação**.
- **Modelo forense de tempo** (`src/logic/tempo_morte.js`): converte cada indicador (algor, rigor, livor, última-vez-visto) numa **janela de horas**, determinístico nos dois sentidos (gera estados a partir da hora real — a degradação; e reconstrói a janela a partir dos estados). A Janela da Morte é a **interseção** das janelas.

Consequência: dá para gerar infinitos casos sem escrever uma única "alternativa". A ambiguidade e a leitura-errada-coerente **emergem** do espaço universal — quem reúne poucas pistas fica com várias causas de pé e a janela larga.

---

## 7. As Três Gavetas (livro-caixa; migração de junho/2026)

Funções puras, custo zero de tempo, sem API. Cada gaveta corresponde a um pilar pericial e é um **livro-caixa**, não um oráculo: o jogador **deduz** (não escolhe de um menu do caso) e a gaveta apenas **registra** a conclusão que ele afirma — **sem avaliar e sem bloquear**. Não há feedback de "consistente/inconsistente"; a conclusão gravada reflete o que o jogador afirmou, mesmo que errada. **Toda validação vive só no tribunal** (§11). Conclusões podem ser desfeitas.

| Gaveta | Pilar | Entrada | Como o jogador deduz | Conclusão |
|---|---|---|---|---|
| **Cronos** | Quando | cartas `temporal` | **triangulação**: cada indicador vira uma janela (modelo de tempo); a hora é a interseção | **Janela da Morte** |
| **Aitiov** | Como | Seção 1: cartas `causal` · Seção 2: cartas `ambiental` | **eliminação** no catálogo universal pelos sinais discriminantes | **Mecanismo do Óbito** · **Estado da Cena** |
| **Nexo** | Presença | 1 carta `vestigio` + 1 Conclusão de apoio | liga o vestígio a uma pessoa do elenco | **Nexo de Presença** |

Não há mais listas de hipóteses por caso (`HIPOTESES_CRONOS`, `HIPOTESES_MECANISMO`): a Cronos calcula a janela e a Aitiov estreita o catálogo universal. As leituras de cena (Seção 2) e os suspeitos do Nexo são conjuntos universais/o elenco, não distratores escritos à mão.

Histórico: o jogo tinha 5 gavetas. **Dinâmica** foi absorvida pela Aitiov (Estado da Cena é sua segunda seção). **Confronto** foi extinta — o cruzamento álibi × janela da morte é raciocínio manual do jogador, apoiado pelo Painel de Álibis (§8). Arquivos `GavetaConfronto.jsx`, `GavetaDinamica.jsx`, `confronto.js`, `dinamica.js` não existem mais.

---

## 8. Painel de Álibis (Playtest 6)

Overlay de consulta intitulado **"Declarações de Paradeiro"**. Lista as cartas de depoimento de álibi já coletadas (`dominio: 'comportamental'`, `subDominio: 'alibi'`) de forma **estritamente neutra**: quem declarou, o que declarou, faixa horária declarada. **Sem marcadores de status** (válido/quebrado), sem cruzamento automático com o Cronos. O jogador compara mentalmente os horários declarados com a Janela da Morte que ele próprio calculou. Modelado sobre a estrutura do Glossário. Custo zero.

---

## 9. Glossário Forense

Referência de época, consulta gratuita, overlay com navegação por domínio (estrutura radial: 5 domínios → termos em leque → definição). Cada verbete: termo, definição tecnicamente precisa, domínio, sinal observável. É o material que permite ao jogador interpretar os dados brutos sem que o jogo interprete por ele. Abre filtrado por contexto quando pertinente.

---

## 10. Tempo e Degradação

- Relógio global em horas (`horasJogo`), início da investigação às **11:00** (`horasChegadaCena: 11`, imutável — base para cálculos retroativos).
- **Custa tempo:** extrair carta (clicar negrito), interrogar, medir temperatura (ação especial do Termômetro, gera carta de algor mortis).
- **Custo zero:** arrastar/organizar, gavetas, Glossário, Caderneta, Painel de Álibis, Quadro.
- **Degradação:** evidências não coletadas mudam de estado com o tempo, de forma medicamente realista ("Articulações Rígidas" → "Corpo Flácido" → carta Inconclusiva). Carta registrada no tempo certo fica segura para sempre. Pelo menos 1 evidência crítica por caso deve degradar se o jogador não priorizar o corpo.

---

## 11. O Libelo e o Monólogo Final

### Quadro de Revelações (formulário narrativo — redesign do Playtest 6)

A acusação é redigida como peça formal, não como slots mecânicos. Campos (estado `libelo`):

- **Réu** (`reuId`) — obrigatório
- **Evidências do corpo** (`evidenciasCorpoIds[]`) — obrigatório, ≥ 1
- **Quando** (`conclusaoCronosId`) — opcional, vem das conclusões Cronos
- **Como** (`conclusaoMecanismoId`) — opcional, conclusões Aitiov com tag `mecanismo`
- **Nexo** (`conclusaoNexoId`) — opcional, conclusões Nexo
- **Descuidos do acusado** (`descuidosIds[]`) — opcional: cartas `ambiental` + conclusões de Estado da Cena
- **Motivação** (`motivacaoId`) — opcional: carta `comportamental` ligada ao réu
- **Periféricos** (`perifericos: { [suspeitoId]: { tipo, cartaId } }`) — veredicto sobre cada não-acusado: `inocente_alibi` | `inocente_segredo` | `sem_info`

Pilares opcionais incompletos não bloqueiam a submissão — lacunas afetam o veredicto (a defesa as explora).

### Veredicto (`calcularVeredicto(libelo, conclusoes, cartasRegistradas, seed)`)

Função pura. Compara as **tags** das escolhas contra a **Verdade de Ouro** (seed). Retorna `{ tipo, acertos, falhas[], perifericos, dadosMonologo }`. Os 4 tipos:

1. **`vitoria_absoluta`** — réu certo, pilares sólidos, periféricos corretos.
2. **`sucesso_gafes`** — réu certo, condenação sustentada, mas com lacunas ou erros periféricos expostos.
3. **`impunidade`** — réu certo mas tese furada: a defesa explora as lacunas e o assassino sai livre.
4. **`erro_judiciario`** — réu errado condenado; o monólogo revela ao jogador, ironicamente, o verdadeiro culpado.

### Monólogo por templates universais

Gerado por **BLOCOS** parametrizados (`abertura` por tipo de final, `tese` montada com os dados reais escolhidos pelo jogador, `descuidos`, `lacunas` mapeadas das falhas, `perifericos`, fecho). Nunca há texto único por caso — os mesmos templates servem ao tutorial e a qualquer caso procedural. Nunca LLM.

---

## 12. Personagens jogáveis

Dois peritos, sobrenome compartilhado **Blackwell** (minimiza variações de texto):

- **Dr. Harlan Blackwell** — cirurgião do Exército; perito independente desde 1887. Frio, metódico; especialista em intervalo post-mortem.
- **Dr.ª Lenore Blackwell** — primeira perita licenciada da Inglaterra; sabe que cada prova precisa ser três vezes mais sólida quando o nome no libelo é feminino.

**Sistema de variáveis:**
```js
detective = { name, surname: 'Blackwell', pronoun: 'ele'|'ela', treatment: 'Sr.'|'Sra.', title: 'Dr.'|'Dr.ª' }
```
Textos usam interpolação `{detective.campo}` (~20–30 pontos de variação no tutorial). Seleção na tela inicial (`faseJogo: 'selecao' → 'abertura' → 'investigacao'`).

---

## 13. Estrutura de progressão

1. **Tutorial — "O Álibi de Corda"** (fixo): quatro armadilhas pedagógicas; gavetas desbloqueiam progressivamente; **resubmissão do Libelo permitida** — a falha mostra exatamente o que faltou (exceção exclusiva do tutorial).
2. **Campanha — "A Ascensão de Blackwell"**: 3–5 casos artesanais, complexidade crescente, sem assistência, falha definitiva.
3. **Modo roguelite** (casos procedurais): desbloqueado desde o início, recomendado após a campanha. Viável graças ao motor de tags.

---

## 14. Caso Tutorial: "O Álibi de Corda" (CONTÉM SPOILERS)

**Cenário:** Briarstone, outubro de 1893. Vítima: **Sr. Geoffrey Arthurs**, relojoeiro, encontrado morto no escritório dos fundos. Escritório revirado; relógio de lareira esmagado, parado às **09h00**.

### Verdade de Ouro (seed — lida apenas pelo motor, nunca exposta)
```js
SEED_TUTORIAL = {
  id: 'o_alibi_de_corda',
  vitima: 'Sr. Geoffrey Arthurs',
  reuCorreto: 'edgar_arthurs',
  horasMorteAntesChegada: 13,            // morte: 22:00 de 13/out; chegada: 11:00 de 14/out
  mecanismoCorreto: 'Estrangulamento por Ligadura',
  motivacaoCorreta: 'heranca',
  cenaEncenada: true,
  perifericos: {
    thomas_blackwood: { veredictoEsperado: 'inocente_alibi', segredo: null },
    sra_hudson: { veredictoEsperado: 'inocente_segredo', segredo: 'mentira_alibi' },
  },
}
```

**O que aconteceu:** Edgar matou o tio às 22h por estrangulamento (corda), voltou às 09h pela porta dos fundos (fechadura forçada por ele mesmo), revirou gavetas e quebrou o relógio para encenar hora e roubo, e então "descobriu" o corpo. Rigor mortis pleno + livores fixos + algor mortis (24°C corporal / 11°C ambiente → 11–15h) convergem para a janela real.

### Suspeitos
- **Edgar Arthurs** (38, sobrinho e único herdeiro) — **o assassino**. Cooperativo, polido, álibi perfeito *para as 09h* (jantar no Clube Comercial de Moorford, 20h–23h… que é exatamente o horário real da morte — armadilha dentro da armadilha: o álibi declarado não cobre o que ele pensa que cobre, e a perícia o destrói).
- **Sra. Mabel Hudson** (55, governanta) — **inocente que mente**. Declara ter ficado no quarto a noite toda; na verdade furtou o escritório à meia-noite. Mentira moral, fisicamente impossível como autoria: a hora não bate com a morte.
- **Thomas Blackwood** (42, taverneiro/desafeto) — **ruído**. Motivo público (dívida, briga na taverna), álibi verdadeiro e verificável (pub The Crossed Keys, 20h–00h).
- **Delegado Wycliffe** — fonte de informação, não suspeito. Briefing inicial e perguntas plantam dados e iscas (testamento, dívidas de Edgar, briga de Blackwood).

### As quatro armadilhas pedagógicas
1. **Relógio como isca** — assumir morte às 09h e não priorizar o corpo → evidências temporais degradam.
2. **Hudson como distração** — parece culpada (nervosa, mente), mas a perícia temporal a descarta.
3. **Blackwood como ruído** — motivo claro, álibi sólido. Motivo sem oportunidade não é prova.
4. **Edgar sem provas** — intuição certa com processo errado = **Impunidade**. Acusar exige materialidade.

---

## 15. Referência forense canônica (medicina legal de época)

Valores invioláveis — o jogo depende deles para ser resolúvel:

- **Rigor mortis:** surge 2–4h post-mortem, pico ~12h, desaparece 24–36h. Sequência céfalo-caudal.
- **Livor mortis:** surge 1–2h; fixa definitivamente após ~12h (antes disso, some sob pressão digital).
- **Algor mortis:** resfriamento ~1°C/h a partir de 37°C, até a temperatura ambiente.
- **IPM:** nenhum sinal isolado é definitivo; a convergência (sobreposição de intervalos) reduz a margem — é exatamente o que a gaveta Cronos faz.
- **Causa:** petéquias/cianose → asfixia; sulco cervical **horizontal** → ligadura; **oblíquo/ascendente** → enforcamento; escoriações/equimoses → reação vital; odor de amêndoas → cianeto; odor de alho → arsênico.
- **Dinâmica:** espasmo cadavérico, marcas de arrasto, livores incompatíveis com a posição, conteúdo estomacal, ausência de lesões de defesa.

---

## 16. Arquitetura técnica

**Stack:** React (JSX) + Vite + Tailwind CSS · estado global com **Zustand** (leve, sem Redux) · dados em módulos JS/JSON · lógica determinística em funções puras · zero chamadas de rede em runtime.

**Estrutura de pastas:**
```
src/
  data/         seed.js · catalogo_causas.js · glossario.js · localidades.js · (cartas, depoimentos, eventos)
  logic/        veredicto.js · tempo_morte.js (modelo forense universal) · cronos · aitiov · nexo
  store/        jogo.js (Zustand: fases, relógio, cartasRegistradas, conclusoes, log, detective)
  components/   Escrivaninha · GavetaBase · GavetaCronos · GavetaAitiov · GavetaNexo ·
                PainelAlibis · QuadroRevelacoes · MonologoFinal · ModalGlossario ·
                Caderneta · TelaPersonagem · TermometroCorpo
```

**Convenções:**
- Estado central: `faseJogo`, `detective`, `horasJogo`, `horasChegadaCena`, `cartasRegistradas`, `conclusoes`, `log`, `temperaturaMedida`.
- Conclusões são objetos com `origem` ('cronos' | 'aitiov' | 'nexo') e `tagsOcultas` próprias.
- `GavetaBase` é o componente reutilizável de registro (livro-caixa, com desfazer); Cronos e Aitiov§1 têm UI própria de dedução (triangulação / eliminação).
- Código e comentários em português.
- Repositório: `github.com/santosbruno94/mortem`. Commits entre cada incremento maior.

---

## 17. Decisões consolidadas (histórico de playtests)

| Playtest | Decisão |
|---|---|
| — | Carimbo integrado à extração: clique no negrito registra a carta direto; `ModalCarimbo` extinto |
| — | Localidades são cartas na mesa; eventos são overlays; nunca troca de tela |
| 5 | **5 gavetas → 3**: Dinâmica absorvida pela Aitiov; Confronto extinta |
| 6 | **Zero indicadores de acerto** (✓/✗) durante a investigação; verdade só no tribunal |
| 6 | **Painel de Álibis** ("Declarações de Paradeiro") substitui o confronto automático — consulta neutra, cruzamento é raciocínio do jogador |
| 6 | **Libelo como formulário narrativo** no Quadro de Revelações (réu, quando, como, evidências, nexo, descuidos, motivação, periféricos) gerando monólogo por templates universais |
| jun/2026 | **Gramática de dedução universal** (§6.1, §7): o caso vira só Verdade de Ouro + pistas; o motor ganha catálogo universal de causas e modelo forense de tempo. Gavetas viram livro-caixa (registram sem validar); Cronos triangula a hora, Aitiov elimina causas no catálogo. Fim das listas de alternativas por caso |

---

## 18. Regras de desenvolvimento

- **Perfil do criador:** advogado sem background em programação. Instruções devem ser executáveis sem conhecimento prévio de dev.
- **Não criar features nem gastar tokens sem ordem expressa.** Design antes de build; confirmação antes de execução.
- Cada iteração é um **incremento jogável**, não um redesign.
- Prioridade: jogabilidade > complexidade técnica > visual.
- Medicina legal tecnicamente precisa, sempre (§15).
- Toda feature testável no navegador antes de avançar.
- Edições direcionadas a documentos/código existentes; explicitar o que NÃO deve mudar.
- Critério de validação de casos: resolúvel pelo Jogador Metódico; com ao menos 1 armadilha para o Apressado; e Impunidade alcançável pelo Intuitivo (réu certo sem provas).
