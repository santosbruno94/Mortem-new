# Protocolo — Playtest de tell dirigido (Fase 3 do consumo de flags psíquicas)

**Criado em:** 20 de julho de 2026
**Responde ao:** gate escolhido para a Fase 3 (OS `os-flags-psiquicas-no-dialogo.md` §6) —
"guarda mecânica **+ playtest de tell dirigido**". A guarda mecânica (`qa.mjs`) já passa; este
protocolo fecha a paridade **perceptual**, que nenhuma máquina mede.
**Natureza:** sessão própria, conduzida por uma pessoa. Não é automatizável.

---

## 1. A pergunta que este teste responde

A Fase 3 deu boca a três flags de têmpera no diálogo gerado, todas **camada narrativa** (o
motor segue cego):

- `mente_com_calma` (réu) × `mente_com_calma_periferica` (inocente) → no **b1** (a entrega do
  álibi, só no tom ressonante), a mentira sai **serena**;
- `mente_sob_pressao` (réu ou isca) → a mesma entrega sai **tensa** (vacila, repete);
- `defende_demais_o_morto` (inocente) → no **b2 cordial**, o excesso de afeto pelo morto.

A guarda mecânica já provou a **distribuição** (calma: 77% inocentes; tensão partilhada réu/isca;
defende inocente-only). O que só um humano mede: **a têmpera na prosa deixa o jogador achar o
réu?** Se "quem entrega o álibi mais sereno/mais nervoso" ou "quem mostra têmpera" apontar o
culpado acima do acaso, a flag virou tell e a Fase 3 tem de recuar.

> **É um gate, não um relatório opcional.** Enquanto este teste não passar, a Fase 3 não deve
> ser dada por fechada (não mergear como "pronta").

---

## 2. Os três tells a caçar (o que o teste procura provar que NÃO acontece)

1. **O estreitamento "réu sempre com têmpera".** O réu **sempre** porta calma OU tensão (nunca
   é neutro); no tom ressonante, a entrega dele nunca é a variante `neutro`. Risco: o jogador
   que aprende "o culpado sempre mostra têmpera na entrega" estreita a lista aos "com têmpera".
   Mitigação embutida: só rende no **tom ressonante** (o jogador tem de escolher esse tom para
   cada suspeito) e o **trait** já dá textura calma/tensa a gente sem a flag. O teste mede se o
   estreitamento sobrevive a isso.
2. **Calma do réu × calma do inocente.** 77% dos calmos são inocentes; a prosa vem da MESMA
   tabela `[trait][calmo]`, sem ramo de papel. Risco: o jogador separar o réu-calmo do
   inocente-calmo pela textura. Não deveria dar.
3. **O reverse-tell do defende.** Super-defender o morto é inocente-only (o réu nunca o faz).
   Risco: o jogador aprende a **eliminar** quem super-defende. Isso é seguro (nunca acusa um
   inocente por isso), mas mede-se se estreita demais a lista.

---

## 3. Preparação (só o facilitador)

1. `npm run dev`, abra o navegador.
2. **Escolha 4 a 6 casos** com `?caso=<id>` (ex.: `?caso=gerado_comarca_3`). Prefira casos com
   têmpera realizada (a maioria tem).
3. **Leia o gabarito ANTES, longe do jogador:** `node scripts/gabarito-casos.mjs <id>` — dá
   vítima, **réu correto**, mecanismo, móbil e o juízo de cada inocente.
4. Jogue no padrão. Cada jogador começa do convite limpo.

---

## 4. Regras para o jogador (leia em voz alta)

- "Você é o perito. Resolva como achar melhor, **pensando em voz alta**."
- "Em cada interrogatório, experimente **os quatro tons** com cada suspeito ao menos uma vez."
- "Eu não ajudo nem digo se acertou."

O jogador **não** sabe que estamos medindo têmpera — senão o teste se contamina.

---

## 5. O que o facilitador anota — por caso

O truque do teste está no **palpite de têmpera ANTES do palpite de matéria**.

```
CASO: gerado_comarca____        Jogador: ______     Data: ______
Réu correto (gabarito): __________________   nº de suspeitos: ____

(A) PALPITE SÓ POR TÊMPERA — pergunte no meio do caso, ANTES da acusação:
    "Se tivesse de apontar alguém SÓ pelo JEITO de responder (não pelas provas),
     quem seria?"   → apontou: __________________
    Esse palpite bateu com o réu correto?         ( ) sim  ( ) não
    O jogador soube dizer POR QUÊ (que 'jeito')?  ____________________

(B) LEITURA DE TÊMPERA (facilitador anota, sem perguntar): quem, no tom ressonante,
    entregou o álibi SERENO, quem NERVOSO, quem super-defendeu o morto:
    - sereno(s):        __________________
    - nervoso(s):       __________________
    - super-defendeu:   __________________

(C) ACUSAÇÃO REAL (por matéria): acusou __________________
    Desfecho: ( ) Vitória ( ) Gafes ( ) Impunidade ( ) Erro Judiciário
    Acertou o réu? ( ) sim ( ) não

(D) O jogador MENCIONOU espontaneamente a têmpera ("ele estava nervoso", "calmo
    demais", "defendeu demais") como razão de suspeita?   ( ) sim  ( ) não
    Se sim, transcreva: ____________________________________________
```

---

## 6. Como ler o resultado (critério de decisão)

Some os casos de **todos** os jogadores. O que importa é o **palpite (A) só por têmpera**
comparado ao acaso (1 / nº de suspeitos ≈ 20–25%).

| Sinal | Leitura |
|---|---|
| Palpite (A) acerta o réu **≈ acaso** (ou o jogador nem consegue palpitar por têmpera) | ✅ **Sem tell.** A têmpera não aponta o culpado. Fase 3 fecha. |
| Jogador **quase nunca** cita têmpera como razão (D em minoria) e (A) ≈ acaso | ✅ Reforça: a têmpera é cor, não pista. |
| Palpite (A) acerta o réu **bem acima do acaso** (ex.: ≥ 2× em ≥ 4 casos) | ❌ **Tell.** A têmpera vaza. Recuar: postura C (têmpera mínima), ou tirar o `tenso` (o réu é tenso em 141/200 → o eixo tenso é o mais perigoso), ou só `neutro`. |
| Jogador **elimina** quem super-defende e isso encurta demais a lista | ⚠️ O reverse-tell do defende pesa; considerar segurar `defende_demais` (era a opção "segurar para lote próprio"). |

**Regra de parada:** mínimo **4 casos × 2 jogadores = 8 partidas**. Registre num relatório
datado em `docs/playtest/` (ex.: `2026-07-__-tell-fase3.md`). O resultado decide se a Fase 3
fica como está, recua de postura, ou perde uma das flags.

---

## 7. Ferramentas de apoio

| Ferramenta | Para quê |
|---|---|
| `?caso=<id>` na URL | Forçar um caso determinístico |
| `node scripts/gabarito-casos.mjs [id]` | Folha de correção (nunca ao jogador) |
| `node scripts/qa.mjs` (linha "TELEMETRIA") | Confere a distribuição das têmperas no lote |
