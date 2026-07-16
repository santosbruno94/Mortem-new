# OS — Árvore de diálogo procedural para os casos gerados

**Status: executada (encomendada e entregue em 16/07/2026; Fases 0–5 na ata do
`docs/historico-decisoes.md`; parecer de lapidação no `RELATORIO_QA.md`).**
Origem: rejeição deliberada da
Fase 6 — "diálogos de interrogatório gerados (v1 sem árvore — depoimentos nascem como
prosa de localidade; árvore procedural é OS própria)" (`docs/historico-decisoes.md`).

## 1. Objetivo

Dar a qualquer suspeito de qualquer caso gerado a mesma experiência do caso-escola:
a conversa que desce e não volta (§7.2), quatro tons por beat (firme, cordial,
técnico, oblíquo), reações próprias a confronto de prova — tudo determinístico por
seed, jogável em replay byte a byte.

## 2. Não-objetivos (v1 desta OS)

- Nada de geração em runtime nem de LLM no bundle: o gerador segue ILHA; a árvore
  nasce em `scripts/gerar-casos.mjs` e chega ao jogo como dado commitado.
- Sem periféricos com segredo (rejeição própria da Fase 6, exigiria álibi + vestígio
  de segredo gerados — v2).
- Sem dente mecânico no tom: como no caso-escola, o tom ressonante rende prosa, não
  prova (o motor segue repousando no corpo e na cena).

## 3. Contrato com o que existe (não muda)

- **Shape de `DIALOGOS`** (`src/data/dialogos.js`): `{ suspeitoId, noInicial, nos:
  { [noId]: { fala, opcoes } }, noEvasiva, reacoesProva, confrontos }`; opções
  `{ rotulo, vaiPara, tom }`; confrontos gated por `requerCarta` com **bijeção
  obrigatória** `confrontos ↔ reacoesProva` (guarda já existente no qa.mjs).
- **Separação de camadas**: a árvore é camada narrativa; `src/logic/` continua lendo
  só tags. O veredicto não ganha nem perde nada com esta OS.
- **Runtime**: o store já persiste `noAtualDialogo` e já joga a árvore do
  caso-escola; os pacotes gerados hoje entregam `dialogos: {}` — a OS preenche esse
  campo, e a UI liga sozinha.

## 4. Desenho proposto

Derivação determinística por seed, suspeito a suspeito, em três camadas:

1. **Esqueleto** (mecânico): 3–4 beats por suspeito — abertura (quem é, tom de
   recepção derivado de `comportamentos`: `revela_facil` abre, `revela_sob_custo`
   cobra), paradeiro (o álibi nasce da `rotina` do `pacoteEspacial`, com hora e
   lugar que o fiscal pode cruzar), arremate (a saída, com a deixa do tom
   ressonante). Cada beat, quatro opções — uma por tom, sempre.
2. **Confrontos**: um por carta de confronto que EXISTE no caso e toca o suspeito —
   `pertenceA` (instrumento, pertence, rastro de dinheiro, fuga) e
   `origemTestemunha` (visto-com-vida, ruído) mapeiam carta → reação. Reação do réu
   ≠ reação de inocente (o réu acomoda a prova sem negá-la de todo; o inocente dá o
   fato que o desonera). `noEvasiva` permanece fallback defensivo.
3. **Realização de prosa**: templates de fala por (papel dramático × tom ×
   trait), com voz derivada pela regra da Seção 8.4 do guia (registro por profissão
   e idade, tique por trait — o `tagarela` emenda, o `preciso` dá horas de um
   fôlego). Regime mecânica-primeiro (rótulos provisórios), depois passe de
   lapidação pelo `revisar-prosa` — o mesmo caminho que `dialogos.js` e
   `pacote_gerado.js` já percorreram.

## 5. Guardas e QA novos

- Replay: mesma seed → mesma árvore, byte a byte (junto do cheque atual da Fase 6).
- Estrutura: nenhum nó órfão; toda opção `vaiPara` existe; 4 tons por beat;
  bijeção confrontos↔reacoesProva; toda `requerCarta` existe no caso.
- Armadilhas sintéticas embutidas (lição da Fase 5): árvore com beat de 3 tons,
  confronto sem reação e nó órfão TÊM de falhar.
- Fair play: nenhuma fala de NPC entrega conclusão que o jogador devia cruzar
  (lint-prosa cobre as falas geradas como cobre o resto).

## 6. Fases e ordem de serviço

| Fase | Entrega | Aceite |
| --- | --- | --- |
| 0 | Spec do derivador (papéis × comportamentos × cartas → esqueleto) | Revisão de mesa |
| 1 | Esqueleto mecânico + `dialogos` preenchido nos 9 casos | QA estrutural verde |
| 2 | Armadilhas + cheque de replay | `--self-test` verboso |
| 3 | Templates de fala por papel×tom | lint-prosa sem violação |
| 4 | Lapidação (`revisar-prosa`) | Parecer com zero bloqueantes |
| 5 | Ligar UI + playtest dirigido | Roteiro de playtest próprio |

## 7. Tamanho honesto

A ata da Fase 6 já avisou: é frente de trabalho do porte do próprio gerador, não
ajuste. A estimativa de mesa é comparável às Fases 3–6 somadas (derivador + QA +
prosa + lapidação). Abrir a OS é decisão de prioridade do usuário; este rascunho
existe para essa decisão ser tomada com o desenho na mão.

---

## 8. Spec do derivador (Fase 0 — normativa)

O derivador é `src/gerador/dialogos_gerados.js` (módulo GERADOR-FACING, ilha de
build time; o runtime jamais o importa — mesma guarda dos irmãos). Assinatura:
`derivarDialogos({ bruto, cartas, suspeitos })` → `{ dialogos, cartasAlibi }`.
Consome o caso bruto (elenco, crime, escolha), as cartas já realizadas (fatia +
interferência) e a lista de suspeitos do pacote. Toda escolha sai de `hashString`
salgado com `${seed}|dialogo|${suspeitoId}|…`.

### 8.1 Onde a conversa vive

Toda árvore gerada é diálogo EMBUTIDO (`origemLocalidade: 'delegacia'`): o delegado
manda chamar, um a um, os nomes dos papéis — a sala do expediente serve de sala de
inquérito (prática de 1893: depoimento se toma na presença do constable). Um botão
`Interrogar {nome}` por suspeito, na ordem (alfabética) da lista de suspeitos do
pacote. Rejeitado: nó de mapa por suspeito (poluiria o mapa e telegrafaria peso) e
interrogatório no local de rotina de cada um (o `oficio_do_reu` nem sempre existe).

### 8.2 O esqueleto: 3 beats, sempre

- **`abertura`** — a recepção. Fala derivada de `comportamentos` (`revela_facil`
  abre e adianta-se; `revela_sob_custo` cobra; sem os dois, recepção neutra de
  ofício), com o tique do trait (§8.3 do guia). As 4 opções perguntam o paradeiro
  na faixa do crime (uma por tom) → `b1_<tom>`.
- **`b1_<tom>`** (×4) — o paradeiro. Todo tom SUSTENTA a mesma carta de álibi
  `[[gen_alibi_<suspeitoId>]]` (solubilidade: o caso é acusável em qualquer tom).
  No tom ressonante, um tento a mais de prosa. As 4 opções perguntam do morto e
  da vila → `b2_<tom>`.
- **`b2_<tom>`** (×4) — o arremate. O que o suspeito dá do morto + a saída (a
  deixa do tom ressonante rende o tento). `opcoes: []` — a conversa se encerra.

### 8.3 A carta de álibi gerada

`gen_alibi_<suspeitoId>`, localidade `delegacia`, `tagsOcultas: { dominio:
'comportamental', subDominio: 'alibi', declaranteId, horaInicioDeclarada,
horaFimDeclarada, corroborado: false }` — o MESMO vocabulário de `alibi_silas`,
que já liga `ligacaoDeConfrontoEmCena`/`confrontoSemParadeiro` sem tocar o motor.
O paradeiro declarado nasce da `rotina` do `pacoteEspacial` na faixa do crime
(lugar com nome de prédio; janela declarada = envelope da faixa). Exceção do réu:
se a rotina o põe NA cena do crime (briga escalada/coabitante), declara a moradia
com recolhimento cedo — a mentira, como a de Silas, só cai por confronto.
`corroborado: false` para todos (v1 sem corroboração gerada).

### 8.4 Confrontos: carta → reação

Uma entrada de `confrontos` (e uma reação bijetiva em `reacoesProva`) por carta
do caso que TOCA o suspeito, na ordem do array `cartas` (replay estável):

| Carta | Chave | Quem toca | Reação |
| --- | --- | --- | --- |
| `gen_instrumento` | `tagsOcultas.pertenceA` | o réu | acomoda por ofício (não nega o objeto; explica-o) |
| `gen_pertence` | `tagsOcultas.pertenceA` | o réu | acomoda por costume |
| `…rastro_de_dinheiro` (soberanos) | `tagsOcultas.pertenceA` | réu ou cúmplice | acomoda por conta |
| `…fuga_apressada` (retalho) | `tagsOcultas.pertenceA` | réu ou cúmplice | acomoda por acaso |
| `gen_visto_vivo` | `origemTestemunha` | a testemunha | reafirma o que declarou (o fato que a desonera) |
| `gen_ruido_ouvido` | `origemTestemunha` | a testemunha | reafirma o que ouviu |

Fora da tabela (v1, deliberado): `pressao_sobre_testemunha` (a visita é vestígio
sobre terceiro, não prova que o dono explique), `prenuncio`, cartas de
`testemunha` (recusa/retratação — o alvo é a testemunha, não o dono), sangue
(1893: sem tipagem sanguínea nem prova de sangue humano — confronto de dono não
renderia reação honesta) e pegadas (o casamento pegada↔bota ERA técnica corrente
de 1893 — Gross, moldes de gesso, comparação de sola e cravos —, mas o catálogo
não modela dono de pegada: exclusão de desenho, não de época; lacuna de KB
registrada para caso futuro). Carta cujo dono não está na lista de suspeitos não
gera confronto. `noEvasiva` sempre presente (fallback defensivo).

### 8.5 Papel, tom ressonante e voz

- **Papel de diálogo** (só do derivador; NÃO gravado no pacote): `reu` (o
  `assassinoId`), `testemunha` (tem carta com `origemTestemunha`), `periferico`.
  Escolhe a família de templates do arremate e das reações.
- **Tom ressonante** por trait (tabela fechada): `medroso → cordial`, `preciso →
  tecnico`, `tagarela → obliquo`, `linha_tempo_nao_confiavel → firme`; sem trait,
  `revela_sob_custo → cordial`, `revela_facil → firme`, senão `tecnico`.
- **Voz**: regra de composição do guia §8.4 (registro por classe/profissão,
  têmpera de idade, um tique de trait). Falas nunca citam ids internos (nome de
  gente e rótulo de prédio, sempre); horas citadas vêm da faixa do crime e da
  rotina (fonte nos dados, guia §6).

### 8.6 Fair play (dureza da regra)

O réu nunca confessa nem se desmente em fala; o inocente nunca aponta o réu; a
testemunha reafirma o declarado sem concluir autoria. A fala entrega OBSERVAÇÃO e
ALEGAÇÃO; o cruzamento é do jogador. O lint-prosa cobre as falas geradas
(casos_gerados.js já é fonte do linter).

### 8.7 Guardas novas (Fase 2)

No `qa.mjs`, seção própria sobre TODOS os pacotes embarcados: árvore por
suspeito; `noInicial`/`noEvasiva` existem; toda `vaiPara` existe; nenhum nó
órfão; todo beat tem exatamente 4 tons (um de cada); bijeção
confrontos↔reacoesProva; toda `requerCarta` e todo destino de reação existem;
todo `b1_<tom>` sustenta a MESMA carta de álibi; fala não vaza id interno (fora
dos marcadores). Marcador em fala de diálogo conta como caminho de extração
(atualiza `marcadoresFecham` do gerar-casos.mjs e a higiene (b) do qa.mjs).
Armadilhas sintéticas embutidas em toda execução: beat de 3 tons, confronto sem
reação, nó órfão e `requerCarta` fantasma TÊM de falhar. Replay: o cheque (a) da
Fase 6 já compara o pacote inteiro byte a byte (a árvore vai junto); soma-se a
prova de determinismo chamada-a-chamada (`montarPacoteGerado` duas vezes → mesmo
`dialogos`).
