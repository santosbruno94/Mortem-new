# OS-R1 — Vocabulário e Postos

**Mestra:** OS-R0. **Decisões:** D11, D23. **Guardas:** G3, G4, G12.
**Pré-requisito:** nenhum. É a primeira.
**Namespace de sal:** nenhum. Esta OS não gera conteúdo.

---

## 0. Bloqueio de arranque

**Não começar sem resolver:** a grafia do nome do mestre. `Abbot` (martelo de
25/07) ou `Abbott` (KB do projeto). Uma renomeação mecânica precisa da string
exata; a diferença de um `t` invalida todo o mapa de ocorrências.

Confirmar, escrever a string escolhida no topo da ata, e só então avançar.
**Este documento assume `Abbot`.**

---

## 1. Escopo

Duas renomeações, feitas juntas porque partilham o mesmo mapa de ocorrências e
o mesmo gate:

| De | Para | Natureza |
|---|---|---|
| `Delegado Wycliffe` | `Condestável Wycliffe` | posto e tratamento |
| `delegado` (substantivo comum) | `condestável` | vocabulário |
| `delegacia` (lugar, em prosa) | `a casa do condestável` | lugar visível |
| `Dr. Alcott` / `Alcott` | `Dr. Abbot` / `Abbot` | nome próprio |

**Fora de escopo, explicitamente:**
- O **id** de localidade `delegacia` **não muda nesta OS.** É propriedade da
  OS-R2 (matriz de colisão, OS-R0 §5). Aqui muda-se o rótulo visível; o id fica.
- O campo `localidade` das cartas não se toca.
- Nenhuma prosa nova. Nenhuma carta nova. Nenhuma fala nova.

---

## 2. Alcance medido

Levantado no ramo, 25/07/2026:

```
257  src/data/casos_gerados.js      ← PRODUTO. Não editar (G12)
 28  src/gerador/pacote_gerado.js
 16  scripts/qa.mjs
 10  src/data/abertura.js
  8  src/data/cartas.js
  8  docs/historico-decisoes.md
  8  docs/biblia-de-vozes.md
  7  scripts/lint-prosa.mjs
  6  src/data/localidades.js
  5  src/gerador/espaco.js
  5  src/gerador/dialogos_gerados.js
  5  src/components/diorama/DioramaVila.jsx
  4  src/gerador/cidade.js
  4  src/gerador/arquetipos.js
  4  src/data/mapa_espacial.js
  4  src/data/aparencias.js
  4  scripts/qa-ui.mjs
```
mais `docs/playtest/*` e relatórios (histórico: **não se reescreve**).

**O achado que governa esta OS:** 257 das ocorrências estão no banco gerado.
Editá-las à mão destrói o replay byte a byte. Elas saem do gerador, e só de lá.

---

## 3. Fases

### Fase 1 — Mapa de ocorrências

Produzir `docs/os-r1-mapa-ocorrencias.md`, uma linha por ocorrência, com
classificação em três baldes:

- **V (visível)** — chega ao jogador como texto. Renomeia-se.
- **T (técnico)** — id, chave, nome de variável, nome de ficheiro. **Não se
  renomeia nesta OS.**
- **H (histórico)** — atas, playtests, relatórios datados. **Não se reescreve**;
  o histórico regista o que se disse na altura.

Sem este mapa aprovado, as fases seguintes não abrem.

### Fase 2 — Gerador

Renomear o balde V dentro de `src/gerador/` e nos moldes de prosa gerada:
`pacote_gerado.js`, `espaco.js`, `dialogos_gerados.js`, `cidade.js`,
`arquetipos.js`.

**Nada mais nesta fase.** Não tocar em `src/data/`.

### Fase 3 — Regeneração

```bash
node scripts/gerar-casos.mjs
```

E então o gate que prova que a determinismo se manteve — ver §5.

### Fase 4 — Prosa autoral

Balde V em `src/data/`: `abertura.js`, `cartas.js`, `localidades.js`,
`mapa_espacial.js`, `aparencias.js`, e `DioramaVila.jsx`.

Duas notas de redação, não mecânicas:

1. **`delegacia` não se substitui por decalque.** Onde o texto dizia "na
   delegacia", a frase reescreve-se para a coisa real: *a sala da frente da
   casa do condestável*, com os autos numa cómoda de cozinha. Isto está em D11
   e é a razão de a decisão existir — não se cumpre com um find-and-replace.
2. **`Dr. Alcott` → `Dr. Abbot` é mecânico**, mas a carta de Wycliffe
   (`abertura.js:59-60`) e a linha 49 ficam **como estão** quanto a conteúdo.
   A reescrita delas pertence à OS-R3.

### Fase 5 — Scripts e lint

`qa.mjs`, `qa-ui.mjs`, `lint-prosa.mjs`. Se a allowlist do lint tiver entradas
que citam o vocabulário antigo, atualizar. **Não aproveitar para mexer nas 21
exceções `TODO(revisão editorial)`** — pertencem à OS-R8.

### Fase 6 — Gate e ata

---

## 4. Guardas

**GR1-1.** Nenhuma edição manual em `src/data/casos_gerados.js`. Se o ficheiro
aparecer no diff com alterações que não vieram de `gerar-casos.mjs`, reverter
tudo. *(G12)*

**GR1-2.** Nenhum id, chave de objeto ou nome de ficheiro renomeado. O balde T
sai intacto. *(colisão com OS-R2)*

**GR1-3.** Nenhum documento em `docs/playtest/`, `docs/historico-decisoes.md`
ou relatório datado é reescrito. *(balde H)*

**GR1-4.** Zero prosa nova. O diff desta OS, em prosa autoral, deve ser
substituição de termos e a reescrita das frases de `delegacia` exigida por D11
— nada mais. Uma fala nova nesta OS é motivo de reversão.

**GR1-5.** Nenhuma alteração pode ramificar em `reuCorreto`. *(G3)*

**GR1-6.** Nenhuma carta muda de disponibilidade, de tom, ou de gesto. *(G4)*

---

## 5. Gate específico: a prova de determinismo

Este é o coração da OS e a razão de ela vir primeiro.

**Antes da Fase 2**, guardar o banco:

```bash
cp src/data/casos_gerados.js /tmp/banco-pre-r1.js
sha256sum /tmp/banco-pre-r1.js | tee /tmp/banco-pre-r1.sha
```

**Depois da Fase 3**, provar que a única diferença é o vocabulário:

```bash
# 1. O diff existe e é só de texto
diff <(sed 's/[Cc]ondestável/DELEGADO_TOKEN/g; s/Abbot/MESTRE_TOKEN/g' src/data/casos_gerados.js) \
     <(sed 's/[Dd]elegado/DELEGADO_TOKEN/g;  s/Alcott/MESTRE_TOKEN/g' /tmp/banco-pre-r1.js) \
  && echo "OK: banco idêntico a menos do vocabulário"

# 2. Regenerar duas vezes dá o mesmo ficheiro
node scripts/gerar-casos.mjs && sha256sum src/data/casos_gerados.js > /tmp/a
node scripts/gerar-casos.mjs && sha256sum src/data/casos_gerados.js > /tmp/b
diff /tmp/a /tmp/b && echo "OK: geração determinística"

# 3. Zero sobras
grep -rniI "delegad\|delegaci\|alcott" src/ scripts/ | grep -v docs/
```

O passo 1 é o que interessa: se o diff normalizado **não** for vazio, alguma
coisa além do vocabulário mudou no banco, e a OS falhou silenciosamente. É
exatamente a classe de erro que o incidente do zip ensinou a procurar.

O passo 3 deve sair vazio, salvo ids do balde T conscientemente preservados —
que devem então ser listados na ata, um a um, com a justificação.

**Gate global** (OS-R0 §7) por cima deste.

---

## 6. Ponto de decisão

Um só, e é o do §0: a grafia. Resolvido isso, esta OS não tem decisões — é
mecânica de fio a pavio, e é assim de propósito.

**Martelo do utilizador antes do merge:** ler três amostras da prosa reescrita
onde `delegacia` deixou de existir, e confirmar que a frase melhorou em vez de
apenas mudar de palavra. Se a frase só mudou de palavra, D11 não foi cumprida.

---

## 7. Ata

Modelo em OS-R0 §9. Acrescentar obrigatoriamente:

- A grafia escolhida do nome do mestre, em destaque.
- O resultado literal do passo 1 do gate de determinismo.
- A lista de ids do balde T preservados, com justificação.
- **Aberto para a OS seguinte:** o id de localidade `delegacia`, que a OS-R2
  renomeia para `casa_condestavel` junto com o remapeamento do campo
  `localidade`.
