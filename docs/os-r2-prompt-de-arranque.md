# OS-R2 — Prompt de arranque para a sessão seguinte

Escrito no fecho da OS-R1, contra a árvore real, como a OS-R0 §4 manda
(«cada uma escreve-se no fecho da anterior»). Copiar o bloco do §1 como
primeira mensagem da sessão nova.

---

## 1. O prompt

> Executar a **OS-R2 — Cena Única** (`docs/os-r2-cena-unica.md`) do repositório
> MORTEM.
>
> **Antes de tocar em qualquer ficheiro, ler nesta ordem:**
> 1. `docs/os-r0-mestra-reforma-hora-emprestada.md` — a ordem-mestra. Não se
>    executa; governa. Interessam as guardas **G1, G4, G10, G11** (que a R2 cita),
>    a **G12** (banco gerado é produto), a matriz de colisão do §5 e o gate do §7.
> 2. `docs/os-r2-cena-unica.md` — a OS a executar.
> 3. A **ata da OS-R1** no fim de `docs/historico-decisoes.md` (secção
>    «25/07/2026 — OS-R1», com o adendo e os achados do fiscal) e
>    `docs/os-r1-mapa-ocorrencias.md`. A R1 mudou coisas que a R2 assume.
> 4. `CLAUDE.md` — regras invioláveis do código e o contrato com o `qa-ui.mjs`.
>
> **Dois martelos são precisos no arranque, e a OS não os tem resolvidos:**
>
> **(a) O nome do id novo da localidade.** A OS-R2 §1 escreve
> `delegacia → casa_condestavel`. Essa redação é **anterior à revisão da D11**:
> a glosa do policial já não é `condestável`, é **`guarda`**, e o lugar chama-se
> **«O Posto do Guarda»** (`rotuloMesa`). O id coerente é **`posto_do_guarda`**.
> Confirmar com o utilizador antes de renomear — é renomeação mecânica em ~91
> pontos, e a string exata tem de estar fixada antes de começar.
>
> **(b) A vitrine.** OS-R2 §5: `pt_cena_vitrine` fica em `loja` ou em
> `escritorio`? O documento recomenda **(a) `loja`** e assume-a. Confirmar, com a
> ressalva que o próprio §5 levanta: se `loja` custar um clique a mais para chegar
> à prova que refuta o roubo, reconsiderar.
>
> **Uma correção ao gate específico da OS (§4, prova 3), a fazer antes de o
> correr.** A prova 3 exige que o diff de `cartas.js` só toque `localidade:` e
> `subLocal:`. **Vai falhar como está escrita**, e legitimamente: o cabeçalho de
> secção `// ===================== A DELEGACIA =====================`
> (`cartas.js:369`) sai no mesmo commit, porque nomeia o lugar que acabou de
> mudar de nome — a ata da R1 deixou-o expressamente para a R2. Ajustar a prova
> para tolerar linhas de comentário, ou tratar o cabeçalho num commit à parte, e
> **registar a escolha na ata**. Não relaxar a prova para além disso: ela é o que
> transforma a GR2-3 («zero prosa alterada») de intenção em facto.
>
> **Seguir as cinco fases da OS pela ordem**, com o gate global (OS-R0 §7) no
> fecho: `npm run lint:prosa`, `node scripts/qa.mjs`, `node scripts/qa-ui.mjs`,
> `npm run build`. Fechar com ata em `docs/historico-decisoes.md` no modelo da
> OS-R0 §9, acrescentando o que o §6 da R2 pede: o resultado literal da prova 3,
> a decisão sobre a vitrine, e o que fica aberto.
>
> Trabalhar num ramo próprio a partir de `claude/mortem-vertical-slice-zzrcto`
> (ou do ramo designado da sessão), **depois de o PR #94 estar integrado**.

---

## 2. O que a OS-R1 mudou e a OS-R2 precisa de saber

**Vocabulário, para não escrever prosa velha.** O policial é **o guarda
Wycliffe**; o lugar dele é **«O Posto do Guarda»** (`rotuloMesa` e `rotulo` do
nó), com título «O Posto do Guarda — A Sala da Frente» e subtítulo «Guarda
Lemuel Wycliffe». O mestre é **Dr. Abbot**. O caso *gerado* continua a dizer
*constable* — divergência assumida, aberta para a OS-R9; **não uniformizar**.

**O contrato do `qa-ui.mjs` mudou de string.** Os cinco pontos que clicavam
`A Delegacia` clicam agora **`O Posto do Guarda`** (`qa-ui.mjs:518, 666, 731,
792, 957`). Se a R2 mudar o `rotuloMesa` outra vez, os cinco vão junto, no mesmo
commit.

**O `lint-prosa.mjs` lê o subtítulo desta localidade.** `montarRosterDeNomes()`
decapita o posto por `/^Guarda\s+/u` (`lint-prosa.mjs:501`) e procura a
localidade **pelo id** `delegacia` (`:510`). **Renomear o id parte esta linha** —
é o ponto mais fácil de esquecer da OS-R2. Se o roster deixar de decapitar, a
palavra «Guarda» entra como nome próprio e o cheque `vocativo_repetido` passa a
acusar falas legítimas.

**A fachada da prancha grava a primeira palavra do rótulo.**
`letreiroDaFachada` (`PranchaVila.jsx:94`) corta rótulos com mais de 12
caracteres na primeira palavra e devolve `null` fora da janela 3–14. Hoje grava
`POSTO`. Se a R2 fundir três nós num só chamado «A Relojoaria», a fachada passa a
gravar `RELOJOARIA` (10 caracteres — passa), mas **as fachadas de `CORPO`,
`CENA` e `OFICINA` desaparecem com os nós**. Vale conferir o desenho da prancha
depois da fusão, e não só o QA.

**O banco está em sincronia, e deve continuar.** `sha256sum
src/data/casos_gerados.js` = `b96f9caf…b05a760b2`. A OS-R2 **não toca no
gerador**, portanto `casos_gerados.js` e `casos_indice.js` têm de sair **fora do
diff**. Atenção: `gerar-casos.mjs` escreve **os dois** ficheiros — se algum
comando o correr por engano, restaurar os dois.

**Anomalias registadas, que a R2 encontra mas não resolve.**
`interrogatorio_silas` como localidade (só Silas tem uma) — é da OS-R6, a própria
R2 §1 manda registar e não tocar. E o campo `localidade` das cartas é propriedade
da R2, e só dela.

---

## 3. Estado do repositório no fecho da OS-R1

| | |
|---|---|
| Ramo | `claude/versionamento-documentos-os-uk0dkg` |
| PR | **#94**, para `claude/mortem-vertical-slice-zzrcto` |
| Commits | `5d86798` · `a38bcd9` · `2add757` · `a1c9ec4` · `b5ce2f9` · `5800778` |
| Gate | build ✓ · qa.mjs CASO VÁLIDO ✓ · lint:prosa sem violação ✓ · qa-ui.mjs UI VÁLIDA ✓ |

**Dívida técnica que não é da reforma, e não tem dono:** nenhuma. A
dessincronização entre o banco e o gerador, herdada de `bde4290` (24/07), foi
consertada em `a1c9ec4` — o produto voltou a derivar da sua fonte, e os 5 casos
novos do pool `luta` passaram os 4 perfis antes de embarcar.

**Aberto, por OS:** OS-R3 (a carta de Wycliffe assume autoridade que um constable
não tinha — quem paga o perito é o coroner) · OS-R4 (um posto de vila é de um
homem só, e Briarstone tem Wycliffe *e* Tobin) · OS-R8 («lavrar termo»/«lavrar
queixa» é procedimento luso-brasileiro sob nome inglês; três frases de efeito
contra o teto de uma na cena do posto) · OS-R9 (`guarda` × `constable`) · camada
de apresentação (`FundoCena.jsx` desenha um armário de arquivo onde a prosa diz
cômoda).
