# MORTEM — Fase 1: Conteúdo de Design (rascunho para aprovação)

> Este é o **portão de conteúdo**. Nada de lógica foi implementado. É o rascunho do material
> criativo (perecíveis, mapa, voz do mestre, currículo de hábitos, a mentira do tutorial)
> para **você aprovar ou ajustar** antes de eu tocar em qualquer código. Tudo em português,
> com os números propostos para você validar. Onde há escolha de design, marquei **[DECISÃO]**.

---

## 1. O que já existe e FICA (só vou documentar melhor)

- **Catálogo de causas** (`catalogo_causas.js`): o espaço-resposta universal — 27 sinais + 10 causas,
  com **sinal de família** (petéquias → asfixia) e **sinal de assinatura** (sulco horizontal →
  estrangulamento por ligadura). No tutorial, a família ativa é a asfixia e a assinatura é o sulco.
- **Modelo forense de tempo** (`tempo_morte.js`): algor (esfria 1 °C/h, margem ±2h), rigor
  (instala 2–12h, pleno 12–24h, dissolve 24–36h), livor (fixa por volta de 12h), e a triangulação
  por interseção de janelas. **Fica como está**, com uma única mudança (ver seção 4).

Conferência dos números do tutorial (batem com o `seed.js`): morte às **22h de 13/out**; chegada
do perito às **11h de 14/out**; logo, **13h de IPM** na chegada. Corpo a 24 °C, sala a 11 °C →
queda de 13 °C → ~13h, batendo com o resto.

---

## 2. Os dois andares: Durável × Perecível

| Andar | O que é | Cartas atuais do tutorial |
|---|---|---|
| **Durável** (sem relógio, sempre re-examinável) | Fatos centrais do corpo e traços fixos da cena | Livor fixo (`ev_livores`), sulco (`ev_sulco`), petéquias (`ev_petequias`), fibras no sulco (`ev_fibras_sulco`), relógio forjado (`ev_relogio`), gavetas (`ev_gavetas`), fechadura (`ev_fechadura`), fios de lã (`ev_fio_la`, `ev_xale`), testamento, dívidas, depoimentos/álibis |
| **Perecível** (degrada no relógio do mapa, perdendo precisão) | O que muda com o tempo no corpo | **Rigor** (`ev_rigor`), **Algor/temperatura** (gerada pelo termômetro) |

Regra de ouro: **examinar é de graça e congela o relógio**; o tempo só corre quando você **viaja**
(seção 5). O que você já observou fica gravado nas anotações para sempre; o relógio só pesa sobre
perecível **ainda não visto**.

---

## 3. A âncora durável e a garantia "o durável sempre resolve" — **[DECISÃO]**

Sua regra (relógio mole): o caso é **sempre** solucionável pela âncora durável; o perecível é só
atalho/corroboração. Hoje isso **não está 100% garantido**, e quero corrigir:

- O **livor fixo** (durável) só dá um **piso**: "morte há ≥12h" (antes das 23h de 13/out). Sem teto.
- O **teto** hoje vem do **rigor** — que é **perecível**. Se o jogador demora e o rigor degrada,
  o teto some, e o corpo sozinho passa a dizer só "morreu ontem ou antes" — janela aberta.

**Proposta:** adicionar **um fato durável de "visto por última vez com vida"** ao tutorial — por
exemplo, a governanta (ou um vizinho) serviu/avistou o Sr. Arthurs vivo no **jantar, por volta das
20h de 13/out**. Isso dá um **teto durável** que não degrada. Combinado com o livor:

> Durável puro = visto vivo às 20h (piso) **+** livor "≥12h, ou seja, antes das 23h" (teto)
> → **morte entre 20h e 23h de 13/out** (~3h), contendo as 22h reais, **em qualquer rota**.

O rigor e o algor continuam existindo como **perecíveis que apertam** essa janela quando frescos
(ex.: algor medido cedo → janela ±2h). Mas, se tudo degradar, o durável ainda fecha o caso.

**Decisão para você:** adiciono esse fato durável de "visto por última vez com vida"? (Recomendo
**sim** — é o que torna sua regra verdadeira.)

---

## 4. Perecível degrada perdendo PRECISÃO, nunca sumindo — números propostos

Hoje o rigor, ao degradar, vira **"Sinal Inconclusivo"** (perde todo o valor). Vou trocar por
leituras **mais vagas, porém ainda válidas**. Cada estado perecível ganha: a leitura (janela), uma
mensagem de **telegrafia** (aviso antes) e uma de **anúncio** (no instante da perda).

### Rigor (`ev_rigor`)
| Quando você examina | Leitura | Telegrafia / Anúncio |
|---|---|---|
| Rigor pleno (IPM até 24h) | "Rígido por inteiro — morte entre 12 e 24h atrás" | *(fresco)* |
| Em dissolução (IPM 24–36h) | "A rigidez já cede — morte entre 24 e 36h atrás" | **Telegrafia:** "a rigidez vai começar a ceder — não vai durar com essa precisão" |
| Flácido (IPM > 36h) | ~~"Inconclusivo"~~ → **"Corpo já frouxo — morto há mais de um dia"** (limite vago, **nunca nulo**) | **Anúncio:** "o rigor se desfez; agora só dá pra dizer que foi há mais de um dia" |

### Algor / temperatura (o mais sensível)
| Quando você mede | Leitura | Telegrafia / Anúncio |
|---|---|---|
| Corpo ainda esfriando (IPM até ~10h) | "Janela apertada, ±2h" | **Telegrafia:** "o corpo ainda perde calor — meça logo, isto não se repete" |
| Perto do equilíbrio com a sala (IPM > 10h) | "Já tão frio quanto o quarto — só dá um limite frouxo" | **Anúncio:** "o corpo igualou a temperatura da sala; não dá mais para datar com precisão" |

> No tutorial, a temperatura na chegada (13h de IPM) já está **no limite** — medir cedo, antes de
> sair viajando, é o que mantém o algor útil. É a pressão do relógio funcionando de forma diegética.

### Modelo de "sangue" (para casos futuros; opcional no tutorial)
Sangue na cena: **pegajoso** (≤1h, "sangrou na última hora") → **secando** (1–6h, "mais cedo hoje")
→ **seco e rachado** (>6h, "em algum momento de hoje"). Nunca some — só fica mais vago.

---

## 5. O mapa: o "dia do perito" (triagem de rota) — números propostos

Locais viram **nós** de um mapa; o relógio só anda ao **viajar** entre eles. Dentro de um nó, tempo
congelado. Proposta de topologia e custos do tutorial:

| Nó | Custo para chegar | Observação |
|---|---|---|
| **Corpo** + **Cena** | 0h entre si | É o mesmo prédio (fundos da relojoaria) — um nó só, na prática |
| **Delegacia** | 1h | Dentro da vila |
| **Casa / Sra. Hudson** | 1h | Dentro da vila |
| **The Crossed Keys / Blackwood** | 1h | Dentro da vila |
| **Clube de Moorford** | **3h cada trecho** | **Fora da vila.** Só aparece no mapa depois que você lê o álibi do Edgar ou as dívidas (ele "cita" Moorford) |

**Por que a rota continua sendo decisão viva:** ir a Moorford (6h ida e volta) para furar o álibi do
Edgar é caro — e, enquanto você viaja, o **algor** do corpo degrada. Mas, como o durável sempre
resolve (seção 3), Moorford é **atalho/corroboração**, nunca obrigatório. O mapa **cresce**: o álibi
cita Moorford, o corpo poderia apontar um médico, etc.

---

## 6. A mentira do tutorial: o que o jogador vai "cravar" — **[DECISÃO]**

O ato central do novo loop é **ligar, com a própria mão, uma afirmação ao fato físico que a
derruba**. No tutorial atual, a contradição mais limpa é o **relógio forjado às 09h** contra a
**janela do corpo (~20–23h de 13/out)**. Duas formas de entregar isso:

- **Opção A — sem conteúdo novo:** o jogador liga a **fala do Edgar** ("encontrei o corpo às 9h30,
  o relógio diz o resto") ao fato do corpo (morte às ~22h da véspera). A mentira é o Edgar se
  apoiando no relógio forjado.
- **Opção B — com um avistamento falso (recomendado):** adicionar uma testemunha que jura ter
  **visto o Sr. Arthurs vivo na manhã do dia 14** (coerente com o relógio das 09h). O corpo
  (morto desde as 22h da véspera) **derruba** esse avistamento de forma literal — o "momento Obra
  Dinn" puro. Ensina o hábito "cruze o que dizem com o que o corpo diz" no caso mais nítido possível.

**Decisão para você:** A ou B? (Recomendo **B** — é o gesto mais limpo e didático; custa uma fala
nova de testemunha.)

---

## 7. O currículo de hábitos do mestre — **[CONFIRMAR ordem]**

O mestre ensina **verbos e hábitos**, não tabelas. Esta lista **é o contrato de currículo**: o
gerador procedural só poderá usar tipos de pista que estes hábitos já ensinaram. Ordem proposta:

1. **"Cheque as mãos e o chão sob o corpo."** → procurar vestígios (fibras, marcas).
2. **"Leia o tempo por convergência, não por um sinal só."** → triangulação (livor + rigor + algor + visto-por-último).
3. **"Separe o sinal de família do sinal de assinatura."** → causa (petéquias = asfixia; sulco horizontal = ligadura).
4. **"Desconfie da cena arrumada."** → encenação / descuidos (relógio parado, gavetas, fechadura).
5. **"Cruze o que dizem com o que o corpo diz."** → o Confronto (depoimento ↔ janela da morte).
6. **"Significância: o chá frio dá a hora; o papel de parede não."** → filtrar sinal de ruído.

---

## 8. A voz do mestre (observação crua + interpretação falada)

- A **carta mostra só a observação crua** ("Articulações Rígidas", "Manchas violáceas no dorso") —
  some o carimbo técnico diegético ("Rigor Mortis Pleno").
- A **interpretação é falada por um personagem** (o mestre/legista), em fala natural. Exemplo para
  o rigor pleno:
  > *"Rígido dos maxilares aos joelhos, {detective.title}. Isto não é de uma hora: entre doze e
  > vinte e quatro horas atrás, eu diria. E ninguém o moveu depois."*
- No **procedural não há voz** — só a descrição física rica, gerada dos fatos; quem lê é o jogador,
  com a perícia já internalizada. A voz é um campo **opcional por carta** (`vozMestre`), então o
  gerador simplesmente a omite.

---

## Resumo das decisões que preciso de você (portão da Fase 1)

1. **[Seção 3]** Adicionar o fato durável "visto por última vez com vida" (~20h, 13/out)? *(recomendo sim)*
2. **[Seção 6]** A mentira do tutorial: Opção A (relógio forjado + fala do Edgar) ou B (avistamento falso novo)? *(recomendo B)*
3. **[Seções 4 e 5]** Os **números** (janelas de perecível, custos de viagem) — aprova como estão ou quer ajustar?
4. **[Seção 7]** A lista e a **ordem dos hábitos** — aprova ou ajusta?

Assim que você decidir, eu materializo isto nos arquivos de dados comentados e seguimos para a
Fase 2 (tempo e mapa). Nada de lógica até seu aval.
