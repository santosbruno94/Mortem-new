# Protocolo — Playtest humano de solubilidade do modo procedural

**Criado em:** 19 de julho de 2026
**Responde ao item:** 4.11 do documento de pendências / §7 do playtest de 18/07/2026
**Natureza:** sessão própria, conduzida por uma pessoa (o *facilitador*). Não é automatizável.

---

## 1. A pergunta que este teste responde

O `qa.mjs` já prova que a **máquina** resolve todo caso gerado (os 4 desfechos são
atingíveis no pool). O que ninguém verificou é se uma **pessoa** resolve — e se **se
diverte** — jogando um caso da comarca às cegas, sem o andaime do tutorial (iscas plantadas,
cortesia das dicas, encenação "assinada").

> **É a decisão que destrava o resto do projeto.** Se um humano resolve com prazer → vale
> investir em profundidade (OS de diálogo, arte). Se se perde (o caso vira "preencher as 5
> estações") → o problema não é conteúdo, é o andaime de dedução, e construir mais em cima
> só afunda o custo.

---

## 2. Quem joga

- **1 a 3 jogadores**, um de cada vez. Ideal: quem **já entende os gestos** do jogo (jogou o
  caso-escola ao menos uma vez) mas **nunca viu** um caso da comarca nem leu os docs de design.
- **O facilitador** (você) observa, cronometra e anota. Não ajuda, não dá dica, não responde
  "tá quente?". Só garante que o jogador saiba os controles.

---

## 3. Preparação (só o facilitador)

1. Rode o jogo: `npm run dev` e abra o endereço no navegador.
2. **Escolha 3 a 5 casos** do banco (há 20). Para forçar um caso específico, abra a URL com
   `?caso=<id>` — por exemplo `http://localhost:5173/?caso=gerado_comarca_3`.
3. **Imprima/leia o gabarito ANTES, longe do jogador:**
   ```bash
   node scripts/gabarito-casos.mjs                    # todos
   node scripts/gabarito-casos.mjs gerado_comarca_3   # um caso (use o id completo)
   ```
   O gabarito dá, por caso: vítima, **réu correto** (nome), mecanismo, móbil, se a cena foi
   encenada, e o **juízo esperado de cada inocente** (álibi × segredo). É a sua folha de
   correção. **Nunca a exiba para quem vai jogar.**
4. **Não** mexa em configurações no meio do teste. Jogue com o padrão (o "modo purista"
   fica como está — desligado). Cada jogador começa do convite limpo.

> Dica: para dar um caso "novo" ao próximo jogador sem contaminar, use outro `?caso=<id>` ou
> feche o caderno ao fim (o save limpa).

---

## 4. Regras para o jogador (leia em voz alta antes de começar)

- "Você é o perito. Resolva o caso como achar melhor. **Pense em voz alta** — quero ouvir seu
  raciocínio, não só o resultado."
- "Eu **não vou ajudar** nem dizer se você está certo. O veredito é o monólogo do fim."
- "Não há tempo real cronometrado *no jogo* além do relógio de bolso da ficção; leve o tempo
  que precisar."
- "Pode desistir de um caso se travar de vez — isso também é um dado."

---

## 5. O que o facilitador anota — por caso

Use uma cópia da ficha abaixo para **cada** caso jogado.

```
CASO: gerado_comarca____          Jogador: ______      Data: ______

DESFECHO ALCANÇADO:  ( ) Vitória Absoluta  ( ) Sucesso c/ Gafes
                     ( ) Impunidade        ( ) Erro Judiciário   ( ) Desistiu

ACERTOU O RÉU?           ( ) sim  ( ) não  → acusou: __________________
CRAVOU O MECANISMO?      ( ) sim  ( ) não
ACERTOU O MÓBIL?         ( ) sim  ( ) não
JUÍZO DOS INOCENTES:     ____ de ____ corretos (confira no gabarito)

TEMPO até o monólogo (relógio real): ______ min

O "AHA" APARECEU?  ( ) sim  ( ) não
   Se sim, qual foi o momento de dedução saliente? ____________________
   Se não, o caso virou "preencher as 5 estações"?  ( ) sim  ( ) não

ONDE TRAVOU / HESITOU (transcreva as falas de dúvida):
   - ____________________________________________________________
   - ____________________________________________________________

CONFIANÇA declarada ANTES de "Levar a julgamento"
("você acha que vai acertar?"):  ( ) alta  ( ) média  ( ) baixa
   → bateu com o desfecho real?  ( ) sim  ( ) não

BUGS / VAZAMENTOS visuais (id cru, texto quebrado, tela vazia): _______
```

---

## 6. Perguntas pós-caso (30 s cada)

1. "Em uma frase, **por que** você acusou essa pessoa?"
2. "Teve algum momento em que **caiu a ficha**? Qual?"
3. "Teve algum momento em que você **não soube o que fazer**?"
4. "Se tivesse mais uma tentativa, o que faria diferente?"

## 7. Perguntas pós-sessão (ao fim de todos os casos)

1. "Comparando com o caso-escola, o caso da comarca pareceu **mais raso**, igual, ou só
   diferente?"
2. "Você **confiou** que dava para resolver, ou sentiu que estava chutando?"
3. "Jogaria outro por vontade própria?"

---

## 8. Como ler o resultado (critério de decisão)

Some os casos jogados por **todos** os jogadores.

| Sinal | Leitura |
|---|---|
| Maioria chega a **Vitória/Gafes** com o réu certo, sem gabarito | ✅ O procedural **é solúvel por humano** — pode investir em profundidade (OS de diálogo, arte). |
| "Aha" presente na **maioria** dos casos | ✅ Há dedução real, não preenchimento. |
| Réu certo mas **Impunidade** recorrente (não sustentam a cadeia) | ⚠️ Solúvel, mas o **elo prova↔suspeito** está obscuro → priorizar clareza de evidência decisiva (não mais conteúdo). |
| **Erro Judiciário** frequente / jogador "chutando" | ❌ O caso **não é deduzível** sem o andaime → corrigir solubilidade ANTES de qualquer expansão. |
| "Preencher as 5 estações" na maioria | ❌ Falta o "aha" garantido por caso (item 4.4 do playtest 18/07) → trabalhar saliência de dedução. |

**Regra de parada:** não decida com 1 caso nem 1 jogador. Mínimo recomendado: **3 casos ×
2 jogadores = 6 partidas**. O resultado aponta a **próxima OS** (profundidade × solubilidade).

---

## 9. Ferramentas de apoio (resumo)

| Ferramenta | Para quê |
|---|---|
| `?caso=<id>` na URL | Forçar um caso específico (determinístico) |
| `node scripts/gabarito-casos.mjs [id]` | Folha de correção do facilitador (nunca ao jogador) |
| Fechar o caderno ao fim | Limpa o save → próximo jogador começa limpo |

*Registre os resultados num relatório datado em `docs/playtest/` (ex.:
`2026-07-__-playtest-humano-procedural.md`) para alimentar a decisão da próxima sessão.*
