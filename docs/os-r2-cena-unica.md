# OS-R2 — Cena Única

> **EXECUTADA em 25/07/2026.** Ata em `docs/historico-decisoes.md`. Duas
> correções que a execução martelou e que o texto abaixo conserva como foi
> escrito: o id do posto é **`posto_do_guarda`**, não `casa_condestavel`
> (§1 é anterior à revisão da D11, que trocou `condestável` por `guarda`);
> e a `loja` do §1 **nasce com cartas**, porque o §5 resolveu a vitrine em
> favor dela — a linha «`loja` e `porta_beco` nascem sem cartas próprias»
> vale hoje só para `porta_beco`.

**Mestra:** OS-R0. **Decisões:** D11 (parte técnica), ponto 8 da revisão do
utilizador. **Guardas:** G1, G4, G10, G11.
**Pré-requisito:** OS-R1 com ata. **Não abre antes.**
**Namespace de sal:** nenhum. Esta OS é topologia, não conteúdo.

---

## 1. Escopo

O local do crime está partido em três localidades que são o mesmo prédio.
Funde-se numa só.

| Hoje | Cartas | Depois |
|---|---|---|
| `corpo` | 6 | `relojoaria` / subLocal `corpo` |
| `cena` | 6 | `relojoaria` / subLocal `escritorio` |
| `oficina` | 5 | `relojoaria` / subLocal `oficina` |

E, herdado da OS-R1, o id que ficou por mudar:

| Hoje | Cartas | Depois |
|---|---|---|
| `delegacia` | 7 | `casa_condestavel` |

**Sub-locais de `relojoaria`:** `corpo` · `escritorio` · `loja` · `oficina` ·
`copa` · `porta_beco`

`loja` e `porta_beco` nascem sem cartas próprias — existem para a navegação e
para o pivô visual. `copa` recebe o que hoje pende de `pt_cena_copa`.

**Fora de escopo:**
- A torre de S. Miguel (nasce na OS-R4).
- `interrogatorio_silas` como localidade — anomalia real (só Silas tem uma),
  mas é da OS-R6. **Registar, não tocar.**
- Qualquer carta nova, prosa nova ou gesto novo.

---

## 2. Fases

### Fase 1 — Esquema

Introduzir `subLocal` como campo opcional de carta e de ponto quente.
Definir a forma em `localidades.js`: uma localidade passa a poder declarar
`subLocais: [...]`, e cada ponto quente declara a que sub-local pertence.

Escrever o **contrato** em duas linhas no topo do ficheiro: uma carta resolve-se
por `localidade` + `subLocal`; `subLocal` ausente significa "raiz da
localidade" e continua válido para todas as localidades que não se fundiram.

### Fase 2 — Fusão

Fundir `corpo`, `cena` e `oficina` numa `relojoaria`. Preservar **integralmente**
os pontos quentes existentes e as suas ligações a carta:

```
pt_cena_lareira      → subLocal escritorio
pt_cena_escrivaninha → subLocal escritorio
pt_cena_vitrine      → subLocal loja
pt_cena_copa         → subLocal copa
pt_oficina_prateleira, pt_oficina_pulpito, pt_oficina_gaveta → subLocal oficina
```

Os três gestos de `corpo` — `gesto_voltar_corpo`, `gesto_corda_relogio` e o de
temperatura — mantêm id, rótulo e `cartaId` **byte a byte**. *(G1)*

`pt_cena_vitrine` passa a `loja` de propósito: é a vitrine da frente, e é o
sinal que refuta o roubo. A separação entre o que está à frente e o que está
nos fundos passa a ser navegável, o que a torna legível.

### Fase 3 — Remapeamento das cartas

17 cartas de cena + 7 da casa do condestável = **24 cartas** com `localidade`
alterado e `subLocal` acrescentado. Nada mais nas cartas: nem prosa, nem tags,
nem `vozMestre`. *(GR2-3)*

### Fase 4 — Planta e navegação

`planta_relojoaria.js` deixa de ser um ficheiro parado e passa a ser a planta
real de navegação da localidade única. `mapa_espacial.js` e `DioramaVila.jsx`
acompanham: onde havia três nós de vila para o mesmo prédio, passa a haver um.

### Fase 5 — Gate e ata

---

## 3. Guardas

**GR2-1.** Toda carta resolve para uma localidade **alcançável**. Nenhuma carta
fica órfã, nenhum sub-local fica inalcançável. Verificação automatizada — §4.
*(G10)*

**GR2-2.** Nenhuma carta muda de gesto, de tom de obtenção ou de
disponibilidade. Uma carta que era colhível em qualquer tom continua a sê-lo.
*(G4)*

**GR2-3.** Zero prosa alterada. O diff em `cartas.js` é **exclusivamente** nos
campos `localidade` e `subLocal`. Um `texto` no diff é motivo de reversão.

**GR2-4.** Zero cartas novas, zero cartas removidas. A contagem antes e depois
é idêntica. *(G11)*

**GR2-5.** Os gestos de `corpo` mantêm ids e ligações. *(G1)*

**GR2-6.** `interrogatorio_silas` não se toca. Registar a anomalia na ata como
aberto para a OS-R6.

---

## 4. Gate específico

**Antes**, guardar o inventário:

```bash
node -e "
  const {CARTAS}=await import('./src/data/cartas.js');
  console.log(Object.values(CARTAS).map(c=>[c.id,c.localidade].join('\t')).sort().join('\n'))
" > /tmp/cartas-pre-r2.tsv
```

**Depois**, três provas:

```bash
# 1. Contagem idêntica
[ $(wc -l < /tmp/cartas-pre-r2.tsv) -eq $(node -e "…" | wc -l) ] \
  && echo "OK: nenhuma carta perdida ou criada"

# 2. Nenhuma carta órfã: toda (localidade, subLocal) existe na topologia
node scripts/qa.mjs   # estender com a asserção de alcançabilidade

# 3. Prosa intacta — o diff de cartas.js não toca campos de texto
git diff src/data/cartas.js | grep '^[+-]' | grep -v '^[+-][+-]' \
  | grep -v "localidade:\|subLocal:" \
  && echo "FALHA: diff fora dos campos de topologia" || echo "OK: só topologia"
```

A prova 3 é a que importa: ela transforma GR2-3 de intenção em facto
verificável. Se sair alguma linha, a OS extravasou o escopo.

**Gate global** (OS-R0 §7) por cima. `qa.mjs` deve continuar a dar replay byte
a byte — esta OS não toca no gerador, portanto o banco não pode mexer-se.

---

## 5. Ponto de decisão

**Um, e precisa de martelo antes da Fase 2:**

A vitrine (`pt_cena_vitrine`) fica em `loja` ou em `escritorio`?

- **(a) `loja`** — é a vitrine da rua, e separá-la dos fundos torna legível a
  distância entre o que o ladrão teria levado e o que está revirado.
  **Recomendada**, e é o que este documento assume.
- **(b) `escritorio`** — menos passos de navegação até à prova que refuta o
  roubo.

Se (a) custar um clique a mais para chegar à prova mais importante do caso,
reconsiderar. É a única troca real desta OS.

---

## 6. Ata

Modelo em OS-R0 §9. Acrescentar:

- O resultado literal da prova 3 (diff só de topologia).
- A decisão sobre a vitrine.
- **Aberto para a OS seguinte:** `interrogatorio_silas` como localidade
  anómala (OS-R6); a torre de S. Miguel por criar (OS-R4).
