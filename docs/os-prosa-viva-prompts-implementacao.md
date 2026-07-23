# OS Prosa Viva — prompts de implementação (uma sessão por etapa)

Companheiro do plano [`os-prosa-viva-e0-plano.md`](./os-prosa-viva-e0-plano.md).
Cada bloco abaixo é um prompt **autossuficiente**: copie-o inteiro para uma sessão nova
do agente e ele ordena a implementação daquela etapa, e só dela. Ordem recomendada:
**Fase 0 → E1 → E2 → E3 → E4 → E5**. A Fase 0 não toca prosa (só mede) e fecha as
decisões D1–D4 do plano com número na mão; comece por ela. Entre etapas, leia o
incremento no navegador (`npm run dev`, `?caso=gerado_<id>`) antes de ordenar a próxima.

Regra que vale para todas: **combinatória de slots antes de listas de sinônimo**, e
todo pick novo por `hashDecisao` (não `hashString` cru — o `hashString` não tem
avalanche e trava os slots numa coluna só; `src/gerador/hash_gerador.js:37`).

---

## Prompt Fase 0 — Telemetria da monotonia (risco zero)

```text
Leia CLAUDE.md e docs/os-prosa-viva-e0-plano.md (Fase 0) antes de tocar em código.
Ordem expressa: implementar a Fase 0 da OS Prosa Viva — medir o "índice de monotonia"
da prosa gerada. NÃO tocar em prosa nem em template; só medir. Somente a Fase 0.

O que entregar:
1. Um script de mesa (fora do bundle, no padrão de scripts/gabarito-casos.mjs) que, para
   cada superfície de prosa dos 31 casos embarcados (src/data/casos_gerados.js), reporte:
   - quantas strings DISTINTAS a superfície produz no lote (a cardinalidade real);
   - o reuso entre casos (quantos casos partilham a mesma string).
   Superfícies a cobrir, no mínimo: abertura (6 passos), PROSA_LESAO/RIGOR/LIVOR, prosa
   do corpo, PROSA_MOTIVO, PROSA_SEGREDO, instrumento/âncora, delegacia/posto,
   INTRO_ENCONTRO, casas, prosa de ponto da cena, ecos_interferencia e os frames do beat
   de diálogo (dialogos_gerados.js).
2. Um relatório de mesa (docs/, datado) com a tabela do índice por superfície — a pauta
   de prioridade das etapas E1–E5 com dado, não palpite.
3. Guarda OPCIONAL no scripts/qa.mjs (a decidir com o autor): registrar o índice e travar
   regressão (etapa futura que aumente a repetição de uma superfície reprova).

Ao fim, apresentar ao autor as decisões D1–D4 do plano (§6) com o índice à mão:
assinatura da abertura, teto de variantes por superfície, slots × listas, bump de golden.

Guarda-corpos: nenhuma mudança em src/ que altere bytes dos casos embarcados (é só
medição); zero Math.random/Date.now em logic/data/store.

Verificação: npm run build limpo; node scripts/qa.mjs verde; o script roda e imprime o
índice sem erro.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem ordem.
Explicar o resultado para leigo em programação.
```

## Prompt E1 — A abertura deixa de ser um roteiro único

```text
Leia CLAUDE.md e docs/os-prosa-viva-e0-plano.md (etapa E1) antes de tocar em código.
Ordem expressa: implementar a E1 da OS Prosa Viva — a abertura dos casos procedurais
deixa de ser um roteiro fixo. Somente a E1 (pressupõe a Fase 0 e a decisão D1 tomadas).

Contexto técnico:
- montarAbertura (src/gerador/pacote_gerado.js, ~l.2117) monta os 6 passos (pensão da
  Sra. Potts em Caulfield → chamado → carta do constable → transformação da mesa →
  chegada → briefing) como prosa FIXA, sem pool de variante. Só variam vila
  (NOMES_DE_VILA ~l.94, 6 opções), constable (SOBRENOMES_DELEGADO ~l.95, 6) e a vítima.
- OPCOES_PERSONAGEM_GERADO (~l.2218, Harlan Blackwell) é byte-idêntico em todo caso.

O que entregar:
1. Trocar o roteiro fixo por COMPOSIÇÃO POR SLOTS independentes (não lista de sinônimo):
   ex. {detalhe da manhã na pensão} × {modo do chamado: telegrama / próprio a cavalo /
   bilhete} × {trajeto/chegada: plataforma / estrada / adro} × {abertura do relato}.
   Cada slot escolhido por hashDecisao decorrelado (chave salgada com a seed + o slot).
   Alvo: poucos fragmentos por slot rendendo muitas combinações.
2. Respeitar a decisão D1 do autor sobre a ASSINATURA estável (recomendação do plano:
   pensão/Harlan como âncora recorrente; variar o lado da vila — chamado, trajeto,
   chegada, briefing).
3. Textura de época pela KB (docs/kb-mundo-vitoriano/): manhã de outubro, correio,
   transporte, primeira vista da vila. Nenhum fragmento cria informação do caso.

Fair play/continuidade: clima e estação presos a 14/out/1893 (o fiscal-continuidade
confere); o modo do chamado e a chegada JAMAIS antecipam fato do caso.
Processo: toda prosa nova nasce pela skill redigir-prosa e passa pelo pipeline
revisar-prosa com zero achados bloqueantes antes do commit.

Verificação: npm run build; node scripts/qa.mjs; node scripts/lint-prosa.mjs; node
scripts/qa-ui.mjs verde (a abertura é texto visível e a rota a clica — atualizar o QA no
mesmo commit se algum texto de contrato mudar); npm run gerar:casos; ler 5 seeds no dev
mostrando 5 aberturas textualmente distintas.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem ordem.
Explicar o resultado para leigo em programação.
```

## Prompt E2 — O corpo ganha variação dentro da precisão

```text
Leia CLAUDE.md e docs/os-prosa-viva-e0-plano.md (etapa E2) antes de tocar em código.
Ordem expressa: implementar a E2 da OS Prosa Viva — o exame do corpo (presente em TODO
caso) deixa de ler sempre a mesma frase, sem perder precisão forense. Somente a E2.

Contexto técnico:
- PROSA_LESAO (src/gerador/pacote_gerado.js ~l.734), PROSA_RIGOR (~l.790), PROSA_LIVOR
  (~l.797): exatamente UMA string por estado. Toda facada lê "A Ferida no Tórax", todo
  rigor pleno a mesma frase.
- A prosa da localidade `corpo` (~l.1460-1497) é fixa (só ramo femV/externo/pousada).
- Fatos aos quais ancorar a variante (o gerador já os computa): sede da lesão,
  compleição e idade da vítima, decúbito, IPM/estado do rigor e do livor.

O que entregar:
1. Cada tabela e a prosa do corpo passam de string única a pequeno banco (respeitar o
   teto de variantes decidido na Fase 0, D2), variando a ORDEM DE OBSERVAÇÃO e o RECORTE
   SENSORIAL — a verdade forense é a MESMA (o sulco de garrote continua horizontal e
   uniforme; muda por onde o olho entra). Seleção por hashDecisao ancorado nos fatos do
   corpo (sede/compleição/IPM) para a variante casar com o caso.
2. Nenhuma variante altera o sinal técnico que o glossário e o motor pressupõem (a
   família/assinatura do catálogo permanece).

PORTÃO OBRIGATÓRIO: cada variante forense passa pelo agente perito-forense, validada
contra docs/kb-medicina-legal/. Achado de época/precisão = bloqueante. Depois, o pipeline
revisar-prosa completo (editor-crítico + perito + fiscal) com zero bloqueantes.

Verificação: npm run build; node scripts/qa.mjs (os 4 perfis seguem produzindo os 4
desfechos); node scripts/gabarito-casos.mjs sem regressão; node scripts/lint-prosa.mjs;
node scripts/qa-ui.mjs; npm run gerar:casos; ler 5 seeds mostrando corpos com voz variada
e forense idêntica.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem ordem.
Explicar o resultado para leigo em programação.
```

## Prompt E3 — Móbil, instrumento, segredo e as superfícies de 1-2 variantes

```text
Leia CLAUDE.md e docs/os-prosa-viva-e0-plano.md (etapa E3) antes de tocar em código.
Ordem expressa: implementar a E3 da OS Prosa Viva — subir a banco combinatório as
superfícies de 1-2 variantes. Somente a E3.

Contexto técnico (tudo em src/gerador/pacote_gerado.js, salvo nota):
- PROSA_MOTIVO (~l.107, 14 móbeis, uma frase-molde cada), PROSA_SEGREDO (~l.256, 2),
  INSTRUMENTO_A_VISTA (~l.667), ANCORA_SEM_LESAO (~l.685), SUPERFICIE_RESPINGO (~l.658):
  uma forma de frase por chave, só troca de nome.
- delegacia/posto (~l.1686, 2 variantes), INTRO_ENCONTRO (~l.1753, 2 por tipo de local),
  casas (~l.1844, 3), TEXTURA_POR_CLASSE (~l.1521), prosa de ponto da cena
  (escolherVariante ~l.1600, 2 opções).

O que entregar:
1. Onde couber, COMPOR POR SLOTS (ex.: móbil = {o documento} × {a cobrança} × {o que a
   morte destrava}) em vez de listas de sinônimo; onde não couber, subir a cardinalidade
   até o teto da Fase 0 (D2). Toda seleção por hashDecisao decorrelado.
2. Priorizar as superfícies com pior índice na telemetria da Fase 0.

Fair play: o móbil corrobora, nunca prova; a variante mantém o FATO e some com a
CONCLUSÃO (observação pura, guia de estilo §2). Nenhuma informação nova, nenhum
vazamento de tagsOcultas.
Processo: prosa nova pela skill redigir-prosa + pipeline revisar-prosa (zero bloqueantes).

Verificação: node scripts/qa.mjs; node scripts/lint-prosa.mjs; node scripts/qa-ui.mjs;
npm run build; npm run gerar:casos; reconferir o índice da Fase 0 subindo nas superfícies
tocadas; ler 5 seeds.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem ordem.
Explicar o resultado para leigo em programação.
```

## Prompt E4 — Ecos e o frame do diálogo

```text
Leia CLAUDE.md e docs/os-prosa-viva-e0-plano.md (etapa E4) antes de tocar em código.
Ordem expressa: implementar a E4 da OS Prosa Viva — expandir os ecos e variar o FRAME
repetido do beat de diálogo. Somente a E4.

Contexto técnico:
- src/data/ecos_interferencia.js (~l.30): 2 variantes por chave (~14 strings) — acompanha
  TODO pacote gerado; um jogador que vê vários casos reencontra as mesmas linhas.
- src/gerador/dialogos_gerados.js: o beat repete o mesmo FRAME entre suspeitos e casos.
  falaB1 (~l.319) tem só 2 phrasings por tom (frames ~l.330), variante() em ~l.62;
  ENTREGA_POR_TRAIT (~l.279) e TENTO_RESSONANTE (~l.296) com uma frase por célula.

O que entregar:
1. ecos_interferencia sobe de 2 variantes por chave (com perito/fiscal de praxe).
2. No diálogo, variar o FRAME do beat — não só o cruzamento tom × trait — além de
   expandir ENTREGA_POR_TRAIT e TENTO_RESSONANTE. Seleção por hashDecisao decorrelado.
   Os dialogos_gerados JÁ passaram pelo pipeline (Fase 4 da OS de diálogo): aqui é
   EXPANSÃO MEDIDA + achado residual, não relapidação geral.

Guarda de voz: a fala derivada continua obedecendo à docs/biblia-de-vozes.md §8 (teste do
nome coberto: a CÉLULA classe × idade × trait ainda se reconhece). Pipeline revisar-prosa
com zero bloqueantes.

Verificação: node scripts/qa.mjs; node scripts/lint-prosa.mjs; node scripts/qa-ui.mjs
verde (contrato intocado: rótulos clicáveis, .termo-clicavel, data-opcoes-dialogo — se
algum texto de contrato mudar, atualizar o QA no mesmo commit); npm run build; npm run
gerar:casos; ler 5 seeds jogando interrogatórios de suspeitos distintos.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem ordem.
Explicar o resultado para leigo em programação.
```

## Prompt E5 — Decorrelação e guarda anti-monotonia

```text
Leia CLAUDE.md e docs/os-prosa-viva-e0-plano.md (etapa E5) antes de tocar em código.
Ordem expressa: implementar a E5 da OS Prosa Viva — fazer a variedade aterrissar:
decorrelação dos picks e guarda anti-monotonia. Somente a E5 (pressupõe E1-E4 e a
decisão D4 — bump de golden — tomada).

Contexto técnico:
- src/logic/hash.js:12 hashString NÃO tem avalanche; src/gerador/hash_gerador.js:37
  hashDecisao é o decorrelacionador. Picks internos antigos (variante() em
  dialogos_gerados.js:62 e escolherVariante interno em pacote_gerado.js ~l.1600) seguem
  em hashString por causa do replay byte-a-byte do golden — ver a nota explícita em
  pacote_gerado.js ~l.1594-1599.

O que entregar:
1. Migrar os picks internos remanescentes de variante/hashString para hashDecisao. Isso
   MUDA bytes dos casos embarcados (bump de golden, decisão D4 do autor): npm run
   gerar:casos no MESMO commit, re-gerando os 31 casos.
2. Guarda no scripts/qa.mjs que reprova quando: (a) um caso concentra muitas superfícies
   na mesma "coluna" de variante (falta de decorrelação intracaso); (b) o reuso de uma
   superfície entre casos passa do teto (D2). Reaproveitar o índice da Fase 0.
3. Cobertura de variante órfã: variante que nenhuma seed embarcada materializa é revisada
   de mesa e anotada no inventário.

Guarda-corpos: motor cego (nenhuma regra nova de veredicto); determinismo total; a
migração é decorrelação de SELEÇÃO, não muda o CONJUNTO de variantes escritas em E1-E4.

Verificação: node scripts/qa.mjs verde (com a guarda anti-monotonia nova); node
scripts/lint-prosa.mjs; node scripts/qa-ui.mjs verde; npm run build limpo; npm run
gerar:casos (ANTES do qa-ui, nunca durante — o HMR quebra o teste no meio); ler 3 seeds
confirmando que superfícies de um mesmo caso não caem todas na mesma variante.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem ordem.
Explicar o resultado para leigo em programação.
```
