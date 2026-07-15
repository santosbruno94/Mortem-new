# Contrato de papéis dramáticos e do gerador de casos

> Registro normativo da FASE 5 da ordem de serviço do gerador procedural
> (jul/2026). Descreve a taxonomia de casting (`src/data/papeis.js`) e o
> contrato que o futuro gerador terá de satisfazer. **Não há código de gerador
> nesta fase** — aqui só se declara o esqueleto e o portão de validação.

## O que é um papel dramático

Um **papel** é a função que uma entidade cumpre na dramaturgia do caso — não a
sua identidade narrativa (essa é a camada de `suspeitos`/prosa), nem a sua
verdade lógica (essa é `tagsOcultas` + a Verdade de Ouro, que só o motor lê). O
papel é **metadado de construção de caso**: diz ao gerador que módulos escalar e
que hábitos do currículo o caso pressupõe.

Origem: o §14 do `MORTEM_CONTEXTO.md` ("As armadilhas pedagógicas") já nomeava
esses papéis em prosa. A FASE 5 os formaliza como dado.

### Os seis papéis (ver `src/data/papeis.js`)

| Papel | Função | Mentira |
|---|---|---|
| `assassino_encenador` | O culpado; encena a "solução A" falsa | **física** |
| `isca_do_apressado` | Falso óbvio: móbil forte + mentira quebradiça | moral |
| `veu` | A última com a vítima; mente por decoro | moral |
| `ruido_pista_dupla` | Rancor barulhento que codifica o móbil de outro | — (ruído honesto) |
| `mentiroso_por_medo` | Mente ensaiado por outro, por medo | moral |
| `fonte` | Não-suspeito; planta a história A e as iscas | — |

**A distinção que segura o fair play:** só o `assassino_encenador` mente contra
a **física** (o corpo, os registros mecânicos). Todos os inocentes mentem por
razões **morais** (vergonha, decoro, medo) — e o motor nunca condena por mentira
moral, só por materialidade (janela + causa + nexo). É isso que torna o Erro
Judiciário do Apressado uma armadilha honesta, e não uma pegadinha.

## Casting do caso-escola

`ELENCO_TUTORIAL` (em `papeis.js`) anota "A Hora Emprestada":

- `silas_crane` → `assassino_encenador`
- `walter_arthurs` → `isca_do_apressado`
- `agnes_rooke` → `veu`
- `caleb_grey` → `ruido_pista_dupla`
- `davey_tull` → `mentiroso_por_medo`
- `delegado_wycliffe` → `fonte`

O pacote de caso carrega isso em `papeisDramaticos` (campo OPCIONAL — um caso
sem anotação joga idêntico; o motor nunca o lê).

## O contrato do gerador (direção — sem código nesta fase)

O gerador, quando existir, seguirá este laço:

1. **Sorteia a Verdade de Ouro** (determinística, salgada pela seed): quem matou,
   com quê, quando, e qual a encenação.
2. **Escala módulos de suspeito nos papéis**: para cada papel do caso, escolhe um
   MÓDULO AUTORAL pronto (motivo, mentira, segredo — prosa curada, escrita à mão
   pelo método de `docs/kb-craft-narrativo/`). O gerador **não inventa drama**;
   recombina módulos. É a resposta ao problema "mad-libs".
3. **Respeita o currículo** (`src/data/curriculo.js`): o `habitosPressupostos` de
   cada papel só pode usar tipos de pista que um hábito já ensinou
   (`desbloqueiaVocabulario`). Nada de exigir do jogador uma leitura que o mestre
   ainda não deu.
4. **Emite um pacote de caso** (FASE 1) e o submete ao **`scripts/qa.mjs`**, que é
   o portão determinístico: se as guardas passam (4 perfis → 4 desfechos,
   solvabilidade, slots, casting íntegro), o caso é aceito; senão, é rejeitado.

## O que o `qa.mjs` já valida (FASE 5)

- **Motor cego aos papéis**: `veredicto.js`/`acusacao.js` não citam papéis — a
  separação camada-de-caso × motor é vigiada, como a de aparências.
- **Casting íntegro**: todo id do elenco mapeia a um papel conhecido; os cinco
  suspeitos + Wycliffe têm papel; todo `habitosPressupostos` referencia um hábito
  real do currículo.

## Fora do escopo da FASE 5 (registrado)

- **Validar que as cartas do tutorial satisfazem cada `modulosMinimos`.** Isso é
  território do gerador: casar módulos exigidos com módulos presentes. A prova de
  que a arquitetura sustenta os papéis virá na **FASE 7** — o Caso 2 escrito
  inteiramente como pacote, com papéis e slots, sem tocar `src/logic/`. Se rodar,
  a alegação está provada; se exigir tocar o motor, o acoplamento descoberto é o
  achado mais valioso.
- **Qualquer código de gerador.** Esta fase entrega dado e contrato, não motor de
  geração.
