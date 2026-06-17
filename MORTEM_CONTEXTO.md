# MORTEM — Documento de Contexto Completo

> Fonte única de verdade do design. Escrito para ser lido por humanos e por agentes de código (Claude Code). Consolida as decisões de design até o **Redesign do Core Loop** (jun/2026+): relógio no mapa, voz do mestre no lugar das gavetas, e o Confronto. Em caso de conflito com qualquer outro documento, **este prevalece** — e, dentro deste, o **§1.1** prevalece sobre as seções escritas antes do redesign.

---

## 1. O que é MORTEM

MORTEM é um jogo de investigação forense baseado em texto e cartas, ambientado na Inglaterra vitoriana (1893). O jogador é um perito médico-legal independente, chamado a vilarejos onde a polícia local não tem competência técnica para resolver homicídios. Toda a experiência acontece sobre uma **escrivaninha vista de cima**: evidências, depoimentos e conclusões são **cartas**; raciocinar é processar cartas em **gavetas lógicas**; acusar é redigir um **Libelo** e defendê-lo num tribunal que não perdoa lacunas.

**Referências de design:**
- *Cultist Simulator* — interface de mesa/cartas, tudo é arrastar, narrativa emergente da manipulação de objetos
- *Papers, Please* — rotina técnica sob pressão de tempo, com peso moral nas decisões
- *Return of the Obra Dinn* — dedução genuína: o jogo dá dados, o jogador produz a verdade

**Plataforma:** web app React. Sem engine de jogo. 100% determinístico.

---

## 1.1 Redesign do Core Loop (jun/2026+) — prevalece sobre o que vem antes

Um redesign do loop central devolveu agência ao jogador. Onde as seções escritas antes (§5, §6, §7, §10…) descreverem as **gavetas**, o **relógio por exame** ou a **degradação que zera o sinal**, vale o que está aqui:

- **Tempo no mapa (relógio MOLE).** O relógio CONGELA dentro de um local — examinar e pensar é ilimitado — e só avança ao **VIAJAR** entre nós do mapa (`src/data/mapa.js`). Sem fim de jogo por tempo. O mapa **cresce**: leads desbloqueiam nós (ex.: o Clube de Moorford, ao ler o álibi/dívidas de Edgar).
- **Perecível perde PRECISÃO, nunca some.** Rigor e algor, ao degradar, viram leituras vagas mas válidas ("morto há mais de um dia"), jamais nulas. O caso é **sempre** solucionável pela âncora durável (livor fixo + "visto por última vez com vida", `dep_visto_vivo`), em qualquer rota — o perecível é só atalho/reforço. O corpo telegrafa e anuncia a perda (legibilidade). *Nota:* sob o relógio mole, a degradação é uma textura lenta — a falha do apressado é de perícia, não de relógio.
- **A leitura forense é FALADA por um personagem.** As gavetas **Cronos e Aitiov foram REMOVIDAS**. O mestre/legista fala o "quando" e o "como" em linguagem natural (`src/logic/falaDoMestre.js`), a partir do que o jogador examinou; a carta na mesa mostra só a **observação crua** (sem carimbo técnico "§"). Por baixo, a conta é a mesma gramática universal (§6.1) — só que dada por um personagem, sem mostrador.
- **O Confronto: o ato dedutivo do jogador** (`src/components/Confronto.jsx`, `src/logic/confronto.js`). O jogador LIGA, com a própria mão, uma fala ao fato físico que a derruba — cravando a **mentira** (uma alegação sobre a hora que o corpo desmente → expõe a encenação) e o **nexo** (o vestígio cujo material casa com a arma). Reintroduz, como ATO, o "Confronto" que o Playtest 6 havia automatizado. Sem feedback de acerto — só o tribunal julga. Substitui a gaveta Nexo.
- **O motor de julgamento NÃO mudou.** `calcularVeredicto` segue lendo as mesmas conclusões (`{tipo:'janela'|'mecanismo'|'nexo'|'estado_cena'}`) — mudou apenas QUEM as produz (o mestre, via `consolidarLeituraMestre`, e o Confronto, no lugar das gavetas).
- **Currículo (`src/data/curriculo.js`).** Os hábitos que o mestre ensina definem o vocabulário de pista que o gerador procedural poderá usar (contrato de currículo). Esqueleto da campanha mestre/aprendiz pendente.

---

## 2. O que diferencia MORTEM dos demais jogos de detetive

1. **"Nem todo mentiroso é culpado."** Inocentes mentem por razões próprias (vergonha, medo, autopreservação). A regra estrutural: *a mentira do assassino é inconsistente com a evidência FÍSICA; a mentira do inocente é inconsistente apenas com a MORAL*. O jogo pune pattern-matching preguiçoso ("mentiu → culpado") e recompensa perícia.

2. **O jogo nunca entrega conclusões.** O jogador recebe dados brutos ("articulações rígidas", "24°C corporal") e material de referência (Glossário Forense de época). A interpretação é dele. Não há personagem que resuma, não há highlight de "pista importante".

3. **Dedução contra uma gramática universal, anti força-bruta.** Não há menu de respostas do caso: a leitura sai de um espaço universal (catálogo de causas + modelo de tempo, §6.1). O legista **fala** a hora/causa (triangulação/eliminação por baixo) e o jogador **crava** o nexo e a mentira no Confronto (§1.1). Nada valida durante a investigação; só o tribunal. Sem vitória por tentativa e erro mecânico.

4. **Zero feedback durante a investigação.** Nenhum ✓/✗, nenhum "correto!". Conclusões registradas nas gavetas são apenas registradas. A verdade só é revelada no tribunal final, de uma vez, com consequências.

5. **Errar é permitido — e tem consequência.** O jogo não bloqueia acusações fracas ou erradas. Existem 4 finais possíveis (Vitória Absoluta, Sucesso com Gafes, Impunidade, Erro Judiciário), e cada um narra o custo do que o jogador fez ou deixou de fazer.

6. **Camada narrativa ≠ camada lógica.** Toda carta carrega `tagsOcultas` (domínio, subdomínio, valores). As regras do jogo leem SOMENTE as tags, nunca nomes ou textos de cartas. É isso que torna a geração procedural de casos viável: trocar a narrativa não exige tocar no motor.

7. **Zero LLM em runtime.** Dados em JSON/JS, lógica em funções puras, monólogos finais gerados por templates universais com variáveis injetadas. O jogo roda offline e é totalmente reproduzível.

8. **Tempo como recurso forense (relógio MOLE).** O relógio só avança ao **VIAJAR** no mapa; dentro do local, congela (examinar e pensar são ilimitados). Sem fim de jogo por tempo. O perecível degrada perdendo **precisão**, nunca valor — o durável sempre resolve (§1.1, §10). A pressão é de **rota**, não arcade.

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
3. **Investigação** — Chegada às 11:00. O relógio só corre ao **VIAJAR** no mapa (§1.1); dentro do local, congela. O jogador alterna entre:
   - **Viajar** entre nós do mapa (custa horas; o mapa cresce por leads);
   - **Examinar** localidades e **interrogar** suspeitos (clicar nos negritos extrai cartas; custo zero) — o legista vai falando a leitura do corpo;
   - **Confrontar** (cravar a mentira e o nexo) e consultar Glossário, Caderneta, Painel de Álibis (custo zero).
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
|        (cartas soltas + nós do mapa)    |
|                                         |
|-----------------------------------------|
|              [ CONFRONTO ]              |
|-----------------------------------------|
[Caderneta]   [Painel de Álibis]  [Glossário]
```

- **Relógio de Bolso** (sup. direito): avança apenas ao **VIAJAR** no mapa (§1.1); dentro do local, congela.
- **Superfície Livre** (centro): cartas arrastáveis e organizáveis, custo zero. **Localidades são nós do mapa** na superfície — não sidebar; clicar **VIAJA** até lá (custa tempo) e abre o evento como overlay (`blur(6px)` + `opacity 0.3`, `position: fixed`). Só aparecem os nós **desbloqueados** (o mapa cresce). Não existe troca de tela.
- **Confronto** (inferior): onde o jogador cruza a fala com o corpo e crava a mentira e o nexo (§1.1). As gavetas Cronos/Aitiov/Nexo não existem mais.
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

**Extração (§1.1):** clicar no termo em negrito registra a carta direto em `cartasRegistradas`. **Examinar NÃO custa tempo** (relógio mole) — `custoTempo` ficou dormente. Na face da carta, a mesa mostra só a **observação crua** (`textoDisplay`); o `carimboPadrao`/`termoCarimbo` virou rótulo interno (usado no Libelo), não mais um "§" diegético. As cartas do corpo ganham um campo opcional **`vozMestre`** — a fala do legista sobre aquela observação, exibida no exame (na campanha; omitido no procedural).

**Regra inviolável:** as funções de lógica e de veredicto leem apenas `tagsOcultas` (e a seed). Nunca decidem por `id` ou `textoDisplay` de carta.

### 6.1 Gramática Universal de Dedução (migração de junho/2026)

O caso (seed) **não contém alternativas**. Cada caso traz só a **Verdade de Ouro** + as **pistas físicas** (cartas com `tagsOcultas`). O espaço de respostas é **universal**, igual para todo caso, e mora no motor:

- **Catálogo universal de causas** (`src/data/catalogo_causas.js`): todas as causas que o jogo conhece (asfixias, intoxicações, traumas) e o vocabulário de **sinais**. Um sinal de *família* (ex.: petéquias → asfixia) aponta o gênero; um sinal de *assinatura* (ex.: sulco horizontal → ligadura) crava a espécie e descarta as parecidas. O jogador deduz por **eliminação**.
- **Modelo forense de tempo** (`src/logic/tempo_morte.js`): converte cada indicador (algor, rigor, livor, última-vez-visto) numa **janela de horas**, determinístico nos dois sentidos (gera estados a partir da hora real — a degradação; e reconstrói a janela a partir dos estados). A Janela da Morte é a **interseção** das janelas.

Consequência: dá para gerar infinitos casos sem escrever uma única "alternativa". A ambiguidade e a leitura-errada-coerente **emergem** do espaço universal — quem reúne poucas pistas fica com várias causas de pé e a janela larga.

---

## 7. A leitura do mestre e o Confronto (substituem as gavetas — §1.1)

As gavetas Cronos/Aitiov/Nexo foram **removidas**. O "quando" e o "como" deixaram de ser calculados pelo jogador num mostrador e passaram a ser **falados pelo mestre/legista**; o "nexo" e a "mentira" passaram a ser o **ato manual do jogador** no Confronto. O motor por baixo é o mesmo (gramática universal §6.1, funções puras, custo zero) — só mudou a interface, e nada valida durante a investigação (§11).

| Pilar | Antes (gaveta) | Agora |
|---|---|---|
| **Quando** | Cronos triangulava a janela | O legista **fala** a janela (`falaDoMestre.js` → `calcularJanelaMorte`); auto-consolidada em `{tipo:'janela'}` |
| **Como** | Aitiov eliminava no catálogo | O legista **fala** o mecanismo (`mecanismoCravado`); auto-consolidada em `{tipo:'mecanismo'}` |
| **Presença** | Nexo ligava vestígio→pessoa | O jogador crava o **nexo** no Confronto (vestígio cujo material casa com a arma) → `{tipo:'nexo'}` |
| **Encenação** | Aitiov §2 (Estado da Cena) | O jogador crava a **mentira** no Confronto (alegação sobre a hora que o corpo desmente) → `{tipo:'estado_cena'}` |

A leitura do mestre é refeita a cada exame (`consolidarLeituraMestre`, ids estáveis `leitura_mestre_janela`/`leitura_mestre_mecanismo`). O Confronto registra o que o jogador afirma **sem validar**. Continua valendo: nada de listas de hipóteses por caso — a janela vem da triangulação e o mecanismo da eliminação no catálogo universal.

**Histórico:** 5 gavetas (Playtest 5: Dinâmica absorvida pela Aitiov; a Confronto automática extinta) → 3 livro-caixa (gramática universal, jun/2026) → **0 gavetas** (Redesign do Core Loop, §1.1): a leitura é falada pelo mestre e o **Confronto volta como ATO do jogador** (`Confronto.jsx`, `confronto.js`). Removidos: `GavetaCronos/Aitiov/Nexo/Base.jsx` e `logic/aitiov.js`, `logic/nexo.js`. **Reaproveitados intactos** (a conta por baixo): `logic/cronos.js`, `logic/tempo_morte.js`, `data/catalogo_causas.js`, `logic/veredicto.js`, `logic/monologo.js`.

---

## 8. Painel de Álibis (Playtest 6)

Overlay de consulta intitulado **"Declarações de Paradeiro"**. Lista as cartas de depoimento de álibi já coletadas (`dominio: 'comportamental'`, `subDominio: 'alibi'`) de forma **estritamente neutra**: quem declarou, o que declarou, faixa horária declarada. **Sem marcadores de status** (válido/quebrado), sem cruzamento automático. O jogador compara mentalmente os horários declarados com a Janela da Morte. Modelado sobre a estrutura do Glossário. Custo zero.

**Atualização (§1.1):** o painel segue neutro como referência, mas o **cruzamento ativo** — cravar a mentira ligando uma alegação sobre a hora ao fato do corpo — passou a ser um ATO do jogador no **Confronto**.

---

## 9. Glossário Forense

Referência de época, consulta gratuita, overlay com navegação por domínio (estrutura radial: 5 domínios → termos em leque → definição). Cada verbete: termo, definição tecnicamente precisa, domínio, sinal observável. É o material que permite ao jogador interpretar os dados brutos sem que o jogo interprete por ele. Abre filtrado por contexto quando pertinente.

---

## 10. Tempo e Degradação (relógio MOLE — §1.1)

- Relógio global em horas (`horasJogo`), chegada às **11:00** (`horasChegadaCena: 11`, imutável).
- **Custa tempo:** só **VIAJAR** entre nós do mapa (`viajarPara`; custos em `src/data/mapa.js`). Dentro do local, o relógio congela.
- **Custo zero:** examinar (extrair), medir temperatura, interrogar, Confronto, Glossário, Caderneta (banco de anotações), Painel de Álibis, Quadro, arrastar/organizar.
- **Degradação = perda de PRECISÃO, nunca de valor.** Rigor e algor, ao degradar, viram leituras vagas mas válidas (rigor `resolvido` → janela larga `[36h, +∞)`; algor em equilíbrio → piso largo), jamais nulas. A carta registrada congela no estado em que foi vista. **Garantia de solvabilidade:** a âncora durável (livor fixo + "visto por última vez com vida", `dep_visto_vivo`) sempre fecha uma janela finita que contém a hora real, em qualquer rota; o perecível só aperta essa janela quando colhido fresco. Sem fim de jogo por tempo. *Decisão:* a degradação fica branda (coerente com o relógio mole) — a falha do apressado é de perícia, não de relógio.

---

## 11. O Libelo e o Monólogo Final

### Quadro de Revelações (formulário narrativo — redesign do Playtest 6)

A acusação é redigida como peça formal, não como slots mecânicos. Campos (estado `libelo`):

- **Réu** (`reuId`) — obrigatório
- **Evidências do corpo** (`evidenciasCorpoIds[]`) — obrigatório, ≥ 1
- **Quando** (`conclusaoCronosId`) — opcional, vem da leitura do mestre (`{tipo:'janela'}`)
- **Como** (`conclusaoMecanismoId`) — opcional, leitura do mestre (`{tipo:'mecanismo'}`)
- **Nexo** (`conclusaoNexoId`) — opcional, cravado no Confronto (`{tipo:'nexo'}`)
- **Descuidos do acusado** (`descuidosIds[]`) — opcional: cartas `ambiental` (`encenado:true`) + a contradição cravada no Confronto (`{tipo:'estado_cena'}`)
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

1. **Tutorial — "O Álibi de Corda"** (fixo): quatro armadilhas pedagógicas; **resubmissão do Libelo permitida** — a falha mostra exatamente o que faltou (exceção exclusiva do tutorial).
2. **Campanha — arco mestre/aprendiz** (esqueleto pendente, §1.1): o jogador começa como assistente de um detetive mestre, que ensina **verbos e hábitos** (não fatos) e dá menos ajuda com o tempo; ao fim, o mestre morre e o jogador assume o lugar, com seu próprio assistente. A campanha é o **currículo completo** (`curriculo.js`): tudo que o gerador um dia usará é ensinado antes da morte do mestre (contrato de currículo). *Em aberto:* a morte do mestre como caso jogável (ler o corpo dele).
3. **Procedural** (sandbox, casos gerados): o assistente embrulha o modo infinito (traz casos, faz presença, **sem ensinar**); a cena vem só com descrição física (sem `vozMestre`) — quem lê o corpo é o jogador, já perito. Viável graças ao motor de tags.

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

**Adições do Redesign (§1.1):** o tutorial ganhou a âncora durável **"visto por última vez com vida"** (`dep_visto_vivo` — a ceia das 20h, na delegacia) e a testemunha do **avistamento falso** (`dep_avistamento_falso` — a Sra. Gale jura tê-lo visto vivo na manhã do dia 14), a mentira literal a cravar no Confronto. O Clube de Moorford virou nó distante por lead (corroboração opcional). Sob o relógio mole, a "armadilha do relógio" (#1) ficou branda: a falha do Apressado passou a ser de perícia (acusar sem materialidade), não de relógio.

---

## 15. Referência forense canônica (medicina legal de época)

Valores invioláveis — o jogo depende deles para ser resolúvel:

- **Rigor mortis:** surge 2–4h post-mortem, pico ~12h, desaparece 24–36h. Sequência céfalo-caudal.
- **Livor mortis:** surge 1–2h; fixa definitivamente após ~12h (antes disso, some sob pressão digital).
- **Algor mortis:** resfriamento ~1°C/h a partir de 37°C, até a temperatura ambiente.
- **IPM:** nenhum sinal isolado é definitivo; a convergência (sobreposição de intervalos) reduz a margem — é exatamente o que a leitura do legista faz (triangulação por baixo, §1.1).
- **Causa:** petéquias/cianose → asfixia; sulco cervical **horizontal** → ligadura; **oblíquo/ascendente** → enforcamento; escoriações/equimoses → reação vital; odor de amêndoas → cianeto; odor de alho → arsênico.
- **Dinâmica:** espasmo cadavérico, marcas de arrasto, livores incompatíveis com a posição, conteúdo estomacal, ausência de lesões de defesa.

---

## 16. Arquitetura técnica

**Stack:** React (JSX) + Vite + Tailwind CSS · estado global com **Zustand** (leve, sem Redux) · dados em módulos JS/JSON · lógica determinística em funções puras · zero chamadas de rede em runtime.

**Estrutura de pastas:**
```
src/
  data/         seed.js · catalogo_causas.js · cartas.js · localidades.js · mapa.js · curriculo.js · glossario.js · rotulos.js · abertura.js
  logic/        veredicto.js · tempo_morte.js (modelo universal) · cronos.js · falaDoMestre.js · confronto.js · monologo.js · tempo.js · interpolar.js
  store/        jogo.js (Zustand: fases, relógio, mapa, cartasRegistradas, conclusoes, log, detective)
  components/   Escrivaninha · EventoLocalidade · Confronto · QuadroRevelacoes · MonologoFinal ·
                PainelAlibis · ModalGlossario · Caderneta · TelaPersonagem · TermometroCorpo ·
                Abertura · Overlay · CartaMesa · RelogioBolso
```

**Convenções:**
- Estado central: `faseJogo`, `detective`, `horasJogo`, `horasChegadaCena`, `localidadeAtual`, `nosDesbloqueados`, `cartasRegistradas`, `conclusoes`, `log`, `temperaturaMedida`.
- Conclusões são objetos com `origem` (`'mestre'` = leitura auto-consolidada do legista; `'confronto'` = nexo/mentira cravados pelo jogador) e `tagsOcultas` próprias (`tipo: 'janela'|'mecanismo'|'nexo'|'estado_cena'`).
- A leitura do mestre (`falaDoMestre.js`) e o Confronto (`confronto.js`) são puros e reaproveitam `cronos.js`/`catalogo_causas.js`; nenhuma gaveta sobrou.
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
| **Redesign Core Loop** (jun/2026+) | **§1.1**: relógio MOLE no mapa (tempo só na viagem; perecível perde precisão, durável sempre resolve); gavetas Cronos/Aitiov/Nexo **removidas** — o legista fala quando/como, o jogador crava nexo+mentira no **Confronto**; carta mostra observação crua; banco de anotações; mapa que cresce por leads. Veredicto/monólogo intactos |

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
