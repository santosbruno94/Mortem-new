# OS Vila Viva — prompts de implementação (uma sessão por etapa)

Companheiro do plano [`os-vila-viva-e0-plano.md`](./os-vila-viva-e0-plano.md).
Cada bloco abaixo é um prompt **autossuficiente**: copie-o inteiro para uma sessão
nova do agente e ele ordena a implementação daquela etapa, e só dela. Ordem
recomendada: E1 → E2 → E3 → E4 → E5 (E6 fica sem prompt por ser futuro opcional).
Entre etapas, jogue o incremento no navegador antes de ordenar a próxima.

---

## Prompt E1 — A planta chega ao jogador

```text
Leia CLAUDE.md e docs/os-vila-viva-e0-plano.md (etapa E1) antes de tocar em código.
Ordem expressa: implementar a etapa E1 da OS Vila Viva — renderizar a planta gerada
nos casos procedurais. Somente a E1; nenhuma outra etapa do plano.

Contexto técnico:
- Todo pacote procedural já carrega `interior.planta` (SVG projetado do grid, no
  schema de PLANTA_RELOJOARIA) — gerado em src/gerador/interiores.js (~l.284,
  plantaSvgDoInterior ~l.299). Hoje ninguém renderiza isso: EventoLocalidade.jsx
  (~l.217) só mostra planta no caso-escola, via PlantaRelojoaria.jsx amarrado ao
  estático src/data/planta_relojoaria.js.
- As cartas/pontos já têm `comodo`/`celula` (ver montarLocalidades em
  src/gerador/pacote_gerado.js).

O que entregar:
1. Generalizar o componente de planta para receber qualquer planta no schema
   (o caso-escola continua usando a dele, sem regressão visual).
2. Na localidade da cena dos casos procedurais, exibir a planta com os cômodos
   nomeados; ao abrir um ponto/vestígio, destacar o cômodo correspondente.
3. Fallback obrigatório: sem planta no pacote (ou ?flat=1), a apresentação atual
   (lista de pontos) permanece idêntica.

Guarda-corpos invioláveis: planta é camada VISUAL — nenhuma regra de motor/veredicto
a lê; zero Math.random/Date.now em src/logic, src/data, src/store; o contrato do
qa-ui.mjs (rótulos clicáveis, .termo-clicavel, data-overlay, ordem dos selects) só
muda se o QA for atualizado no mesmo commit.

Verificação antes de commitar: npm run build limpo; node scripts/qa.mjs verde;
node scripts/qa-ui.mjs verde; conferir no npm run dev pelo menos 3 seeds/casos da
comarca com plantas distintas e coerentes com os pontos.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem
ordem. Explicar o resultado para leigo em programação.
```

## Prompt E2 — A vizinhança ganha nome e parede

```text
Leia CLAUDE.md e docs/os-vila-viva-e0-plano.md (etapa E2) antes de tocar em código.
Ordem expressa: implementar a etapa E2 da OS Vila Viva — a prosa das localidades
dos casos procedurais passa a beber da vila gerada. Somente a E2.

Contexto técnico:
- Hoje montarLocalidades (src/gerador/pacote_gerado.js, ~l.1224-1620) monta
  delegacia/vizinhanca/corpo/introdução da cena como frases-molde de 2 variantes.
- Os dados para prosa específica JÁ existem no build time: mundo.cidade
  (quarteirões, prédios, silhuetas — src/gerador/cidade.js), endereços e rotinas do
  elenco (src/gerador/insercao.js) e o grafo de adjacência (quem ouve/avista quem).

O que entregar:
1. Substituir os moldes por composição de fragmentos selecionados por hashString
   salgado com a seed, alimentados pela cidade gerada: a ruela onde a vítima
   morava, vizinhos parede-meia NOMEADOS (os mesmos que o motor usa como
   ouvintes/álibis), o que se vê do adro, distâncias reais.
2. Fair play: a prosa só MOSTRA o que a mecânica já computa — nenhuma informação
   nova, nenhum vazamento de tagsOcultas.
3. Absorver a pendência P4: "delegacia" é conceito impróprio para vila de 1893 —
   adotar a terminologia correta (constable, petty sessions) validando contra
   docs/kb-medicina-legal/ (aparato legal-policial) e docs/kb-mundo-vitoriano/.

Processo obrigatório: toda prosa nova nasce pela skill redigir-prosa e passa pelo
pipeline revisar-prosa com zero achados bloqueantes antes do commit. O
fiscal-continuidade deve conferir 5 seeds: nomes e geografia da prosa batem com o
mundo.cidade da mesma seed.

Verificação: npm run build; node scripts/qa.mjs; node scripts/qa-ui.mjs (atualizar
no mesmo commit se algum texto de contrato mudar); leitura de 5 seeds no npm run
dev mostrando 5 vizinhanças textualmente distintas.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem
ordem. Explicar o resultado para leigo em programação.
```

## Prompt E3 — A mobília lê o morador

```text
Leia CLAUDE.md e docs/os-vila-viva-e0-plano.md (etapa E3) antes de tocar em código.
Ordem expressa: implementar a etapa E3 da OS Vila Viva — assimetrias legíveis de
mobília como leitura social do morador. Somente a E3 (pressupõe E2 entregue).

Contexto:
- Catálogo-fonte: docs/kb-mundo-vitoriano/mobiliario-por-classe.md, seção
  Implicações (piano em cottage pobre, feather bed herdado, monograma alheio na
  prataria, crepe de luto datando a perda, dresser desfalcado etc.).
- O gerador já computa os fatos aos quais amarrar cada assimetria (aperto
  econômico, herança, luto, motivo) — ver src/gerador/caso.js e espaco.js
  (MOBILIA_POR_CLASSE/MOBILIA_DE_OFICIO).

O que entregar:
1. No build time, selecionar deterministicamente 1-2 assimetrias coerentes com os
   flags do personagem e injetá-las na prosa do cômodo e/ou numa carta de
   observação.
2. O motor permanece CEGO: assimetria corrobora, nunca prova; nenhuma regra de
   veredicto/acusação a lê; nunca é a única via para dedução essencial.
3. Prosa pela skill redigir-prosa + pipeline revisar-prosa (zero bloqueantes).

Verificação: npm run build; node scripts/qa.mjs (os 4 perfis seguem produzindo os
4 desfechos); node scripts/gabarito-casos.mjs sem regressão; leitura de 5 seeds
mostrando assimetrias variadas e coerentes com o personagem.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem
ordem. Explicar o resultado para leigo em programação.
```

## Prompt E4 — A vila muda de forma (morfologias)

```text
Leia CLAUDE.md e docs/os-vila-viva-e0-plano.md (etapa E4) antes de tocar em código.
Ordem expressa: implementar a etapa E4 da OS Vila Viva — morfologias de vila
variáveis por seed. Somente a E4 (pressupõe E2 entregue).

Contexto:
- Hoje src/gerador/cidade.js tem UM traçado hardcoded (TRACADO, l.79-110): vila
  nucleada. A KB documenta 5 morfologias em
  docs/kb-mundo-vitoriano/urbanismo-e-morfologia.md §1.

O que entregar:
1. Parametrizar o traçado em 3 morfologias escolhidas por seed: nucleada (atual),
   linear/de estrada e de green — as outras duas ficam fora por ora.
2. Grafo de adjacência, distâncias e quarteirões derivam da morfologia; as
   consequências mecânicas (ouvintes, avistamentos, custo de viagem) fluem pelos
   canos existentes, sem regra nova de motor.
3. Os fragmentos de prosa da E2 leem a morfologia (a vila linear se descreve
   diferente da de green).

ATENÇÃO — risco central: morfologia mexe na malha de avistamentos e pode
desequilibrar as Regras de Justiça R1-R6 (docs/game-design-simulacao.md). Antes de
aceitar, rodar node scripts/relatorio-espacial.mjs por morfologia e comparar com as
bandas do relatório v1 (docs/os-palco-em-aneis-relatorio-espacial-v1.md). Fora da
banda = parar e reportar ao criador, não "consertar" sozinho.

Verificação: relatório espacial dentro das bandas nas 3 morfologias; npm run
build; node scripts/qa.mjs; node scripts/qa-ui.mjs; npm run gerar:casos e conferir
o banco regenerado; 3 seeds de morfologias distintas no npm run dev.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem
ordem. Explicar o resultado para leigo em programação.
```

## Prompt E5 — O segundo grafo (travessa dos fundos)

```text
Leia CLAUDE.md e docs/os-vila-viva-e0-plano.md (etapa E5) antes de tocar em código.
Ordem expressa: implementar a etapa E5 da OS Vila Viva — ativar o logradouro
travessa_dos_fundos (o "segundo grafo" de back lanes). Somente a E5 (pressupõe E4
entregue e relatório espacial em dia).

Contexto:
- A especificação já existe: docs/os-palco-em-aneis-e2-dossie.md §1.4 (partição,
  pool, risco de saturação do grafo de avistamentos; a recomendação "v2" era
  sequenciamento, não rejeição). Fundamento: docs/kb-mundo-vitoriano/
  urbanismo-e-morfologia.md §5. plataforma_da_estacao segue v3 — NÃO ativar.

O que entregar:
1. Ativar travessa_dos_fundos no regime de palco conforme o dossiê E2, com a
   partição/pool lá especificados.
2. Controlar a saturação do grafo de avistamentos apontada no dossiê.

Verificação: node scripts/relatorio-espacial.mjs com regimes dentro das bandas
(interno/logradouro/pousada) e saturação controlada; npm run build; node
scripts/qa.mjs; node scripts/qa-ui.mjs; npm run gerar:casos; jogar 2 seeds cujo
palco caia na travessa.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem
ordem. Explicar o resultado para leigo em programação.
```
