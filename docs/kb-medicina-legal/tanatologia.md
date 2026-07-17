# Tanatologia forense — os sinais do tempo da morte (1893)

> Como um perito da década de 1890 estabelecia o **intervalo post-mortem** (IPM), o
> tempo decorrido desde a morte. Ancorado nos tratados da época (ver `fontes.md`).
> Os valores marcados como **[MOTOR]** são os que `src/logic/tempo_morte.js` implementa
> e dos quais o jogo depende para ser resolúvel — não os altere sem decisão do usuário.

A regra soberana da datação forense, já firme em 1893: **nenhum sinal isolado data uma
morte com segurança.** Cada indicador dá uma FAIXA de horas larga; a perícia sobrepõe
as faixas e retém o trecho comum a todas — a **convergência** (interseção). É o método
que o modelo de tempo do jogo reproduz.

---

## 1. Algor mortis — o resfriamento

O corpo, cessada a circulação, perde calor até igualar o ambiente. A regra prática da
época, derivada da lei de resfriamento de Newton, é uma queda de aproximadamente
**1 °C por hora** a partir de 37 °C. **[MOTOR]** O modelo usa 1 °C/h com margem
**±2 h**.

| Diferença para 37 °C | IPM aproximado |
|---|---|
| 1–2 °C | 1–2 h |
| 6 °C | ~6 h |
| 13 °C (corpo a 24 °C) | ~13 h |
| corpo igual ao ambiente | ≥ (37 − Tambiente) h — só um **piso** |

**Limites conhecidos em 1893.** O resfriamento não é linear (há um platô inicial de
1–3 h, e a curva é sigmoide), mas a aproximação linear era a ferramenta de campo. O
perito atento já corrigia por: corpulência (magro esfria mais rápido), roupa e
cobertas, temperatura e correntes de ar do cômodo, superfície de apoio, imersão.
**O sinal morre com o equilíbrio térmico:** igualada a temperatura da sala, o algor
nada mais informa além de "ao menos tantas horas".

**No caso tutorial:** corpo a 24 °C, sala a 11 °C → queda de 13 °C → ~13 h de IPM,
convergindo com o rigor e o livor para a morte às 22 h da véspera. Medido cedo, o algor
**aperta** a janela (±2 h); deixado para depois, o corpo caminha para o equilíbrio e o
sinal perde precisão — a pressão diegética do relógio mole.

---

## 2. Rigor mortis — o enrijecimento

Enrijecimento muscular por consumo do glicogênio e coagulação das proteínas. Instala-se
em **sequência céfalo-caudal** (mandíbula e pescoço primeiro, membros e extremidades
por último) e desfaz-se na mesma ordem.

**[MOTOR]** Cronologia adotada:

| Fase | IPM | Leitura |
|---|---|---|
| Instalação | 2–4 h (início) a ~12 h | rigidez progride da mandíbula aos membros |
| Pleno | ~12 h a 24 h | corpo duro por inteiro |
| Resolução | 24 h a 36 h | a rigidez cede na ordem em que veio |
| Resolvido | > 36 h | corpo flácido — só diz "mais de um dia" |

**Fatores que aceleram ou retardam** (sabidos na época): temperatura ambiente alta
acelera; frio retarda (podendo confundir-se com rigidez); atividade muscular intensa
antes de morrer (luta, convulsão) antecipa o rigor; caquexia e infância o abreviam. O
**espasmo cadavérico** (contração instantânea e definitiva no momento da morte
violenta) é fenômeno distinto do rigor e não pode ser forjado depois — ver
`protocolo-exame.md`.

**Degradação no jogo:** o rigor é PERECÍVEL. Ao passar da janela plena, degrada, mas
**nunca some**: vira leitura vaga e ainda válida ("mais de um dia"), jamais nula. O que
garante solvabilidade é o par durável livor + última-vez-visto (§4).

---

## 3. Livor mortis — as hipóstases

Manchas violáceas do sangue que, sem circulação, desce por gravidade às partes baixas
do corpo (as não apoiadas — os pontos de pressão contra a superfície ficam pálidos).

- **Surgimento:** 1–2 h post-mortem, primeiro em pontos, depois confluente.
- **Fixação:** por volta de **12 h** as manchas tornam-se **fixas** — deixam de
  esmaecer sob a pressão do polegar (antes disso, empalidecem e migram se o corpo é
  virado). **[MOTOR]** livor fixo → morte de **≥ 12 h** (um **teto** de precisão pela
  base, sem limite superior próprio).

**Duplo valor probatório:**
1. **Tempo:** fixo = ao menos meia jornada de morte.
2. **Posição:** livores fixos numa face do corpo que não está apoiada denunciam que o
   cadáver **foi movido** depois da fixação (ver `livores incompatíveis`,
   `protocolo-exame.md`). No tutorial, os livores nas costas de um corpo deitado de
   costas são compatíveis — ninguém o moveu.

O livor é DURÁVEL: uma vez fixo, não se desfaz. É metade da âncora de solvabilidade.

---

## 4. A âncora durável e a convergência

O livor fixo dá o **piso** ("morreu há ≥ 12 h" → antes das 23 h de 13/out no tutorial).
Falta o **teto**. Num corpo fresco, o teto vem do rigor e do algor — perecíveis. Para
garantir que o caso feche **em qualquer rota**, o tutorial acrescenta uma âncora
durável não-corporal:

- **"Visto por última vez com vida"** (`dep_visto_vivo`): a ceia servida às 20 h de
  13/out. A morte não pode anteceder isso → **piso** durável.
- Combinado ao livor fixo (teto), fecha uma janela finita (20 h–23 h) que contém a
  hora real (22 h), sem depender de nenhum perecível.

O rigor e o algor, quando frescos, **apertam** essa janela; degradados, apenas param
de apertá-la. **O durável sempre resolve.**

**A convergência (interseção):** cada indicador é uma faixa; a Janela da Morte é a
sobreposição de todas. Quanto mais sinais colhidos a tempo, mais estreita — mas um só
sinal já a deixa aberta. Sinais degradados não a estreitam; também não a corrompem.

---

## 5. Outros marcadores (conhecidos na época, úteis a casos futuros)

- **Conteúdo estomacal:** a digestão cessa com a morte. Conhecida a última refeição, o
  grau de digestão baliza a hora. Impreciso, mas clássico.
- **Putrefação:** mancha verde na fossa ilíaca direita por volta de 24–48 h (a
  temperaturas moderadas), rede venosa, enfisema — para IPM longos, fora do escopo do
  tutorial.
- **Dessecação:** córneas turvas, manchas escleróticas (de Sommer/Larcher) — sinais
  finos, de valor auxiliar.
- **Intervalo de sobrevida (a hora do golpe × a hora da morte).** Nem toda ferida mortal
  mata no instante em que é recebida: a vítima com lesão cardíaca ou de grande vaso ainda
  age por segundos a minutos; a exsanguinação mata aos poucos (ver `traumas.md`, "capacidade
  de ação depois da lesão"). Os sinais desta seção datam a **morte**, não o **golpe** — e o
  intervalo entre um e outro é campo aberto para o álibi e para o relógio mole (a lacuna 7
  de `lacunas.md`). No confronto que se desloca, o corpo cai onde a sobrevida se esgota,
  não onde o golpe começou.

---

## Implicações para o jogo

- Os valores **[MOTOR]** batem com `src/logic/tempo_morte.js` e com o §15 do
  `MORTEM_CONTEXTO.md`. `src/data/glossario.js` (verbetes `rigor_mortis`,
  `livor_mortis`, `algor_mortis`, `ipm_convergencia`) deve refletir exatamente esta
  cronologia — é a referência que o jogador consulta para deduzir sozinho.
- A distinção **durável × perecível** é a espinha do relógio mole (§10 do contexto): o
  livor e o "visto com vida" resolvem sempre; o rigor e o algor são atalhos que
  degradam perdendo precisão, nunca valor.
- A prosa das cartas do corpo (`ev_rigor`, `ev_livores`) descreve o **estado
  observável** (dureza, cor, resposta à pressão) sem enunciar a janela — quem converte
  estado em horas é o modelo, e quem fala a leitura ao jogador é o mestre (dica), nunca
  a carta.
