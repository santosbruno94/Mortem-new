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

> **Estado (atualizado ao fim da sessão E1–E4):** E1–E4 estão ENTREGUES e no branch
> (planta procedural; prosa da vila + constable; mobília social; morfologias de vila).
> A bancada de balanço da E4 (Monte Carlo) está montada e as bandas v1 estão provadas.
> O prompt abaixo foi enriquecido com o mapa concreto de implementação levantado na
> investigação da E5.
>
> **Estado (E5 — sessão de implementação):** a travessa dos fundos está ATIVADA e no
> branch — 4º tipo de logradouro em todos os canos (espaço/mobília/física, interior
> 8×3, lote ancorado ao pub nas 3 morfologias, wiring de palco chamariz-only,
> superfície do respingo). A **adjacência curada** deixa a viela em ~2 vizinhos (pub +
> 1 cottage) nas 3 morfologias — o "grafo discreto" da KB, sem saturar 5–7. Balanço de
> 20 000: regime-palco 74,6/15,5/10,0 (nas bandas); tipos de logradouro ~25% cada
> (adro 23,3 · pátio 24,5 · açude 26,2 · travessa 26,0); afogamento externo 7,6%.
> Build, integridade espacial, casos embarcados byte-a-byte, GE4, GE6, lint-prosa e as
> demais 110 checagens do qa.mjs: VERDE.
>
> **PENDÊNCIA À ESPERA DE DECISÃO DO AUTOR — GE5.** O teto de 40% para a família
> asfixia nas cenas externas ficou VERMELHO no lote fixo de 150 seeds (asfixia 52% em
> só 23 cenas externas). NÃO é regressão da E5: a população segue em 41,6% (v1: 41,0% —
> a MESMA condição já registrada no relatório espacial v1 §3 e no registro #10.6). O
> guard de 150 seeds tem amostra minúscula; ao entrar o 4º tipo, reembaralhou quais
> seeds são externas e o lote saltou de 39% (v1) para 52%. Lotes maiores convergem à
> população: 500→39,7%, 1500→43,2%, 20 000→41,6%. Como asfixia agrupa 3 dos 8 métodos,
> o teto de 40% sempre foi apertado. Por ordem do plano E0 §4 ("banda fora ⇒ parar e
> reportar, não consertar sozinho"), a calibração do GE5 (ampliar o lote do guard e/ou
> subir Y para ~45%, vs. pesar a seleção de método) fica para o autor decidir; o código
> da travessa NÃO depende dessa decisão.

```text
Leia CLAUDE.md e docs/os-vila-viva-e0-plano.md (etapa E5) antes de tocar em código.
Ordem expressa: implementar a etapa E5 da OS Vila Viva — ativar o logradouro
travessa_dos_fundos (o "segundo grafo" de back lanes). Somente a E5.

Contexto e ESPECIFICAÇÃO:
- Partição/pool prontos no dossiê: docs/os-palco-em-aneis-e2-dossie.md §1.4
  (grid 8×3 linear: `viela` 8×1 fila 1; `fundos_do_pub` col 0 fila 0 3×1 — barris,
  escotilha da adega; `quintais` col 3 fila 0 5×1 — varais, monturos, privadas;
  `saidas` nas duas bocas da viela {col 0, fila 2} e {col 7, fila 2}). Mobília:
  barris/escotilha, monturo, varal+tina, privada externa, coal hole. Rotinas (§3):
  carroceiro dia → travessa (entregas de serviço); taverneiro manhã → fundos do pub.
  Fundamento: urbanismo-e-morfologia.md §2/§5 (toda loja da rua tem porta discreta na
  viela; é o "grafo discreto por excelência"). plataforma_da_estacao é v3 — NÃO ativar.

DESAFIO CENTRAL (o dossiê §1.4d marca): a travessa fica ENTRE prédios; por distância
ela satura o grafo de avistamentos (5–7 adjacências), o oposto do que um beco significa
(deve ser POUCO vigiado/ouvido). A ativação exige controlar isso — o dossiê dá a saída:
"posição mais excêntrica OU regra especial de adjacência". Recomendação da investigação:
uma REGRA ESPECIAL de adjacência CURADA (a travessa só é adjacente aos prédios cujos
fundos dão nela — o pub via fundos_do_pub e 1–2 cottages atrás —, não à malha de
distância inteira). Isso a faz o "grafo discreto" que a KB pede e casa a saturação com
a dos outros logradouros (~2 adjacências, como adro/pátio/açude).

MAPA DE IMPLEMENTAÇÃO (a infraestrutura de logradouro já existe; adicionar um 4º tipo):
1. src/gerador/espaco.js — TIPOS_PREDIO: novo `travessa_dos_fundos` com `logradouro:true`
   e silhueta (espelhar adro_da_igreja/patio_da_granja, ~l.215-245); a mobília do beco na
   seção "logradouros" (~l.685) e a classe do tipo no mapa (~l.198: adro→clero etc.).
2. src/gerador/interiores.js — LAYOUTS: novo layout `travessa_dos_fundos` (comodos +
   saidas do dossiê §1.4b), espelhando os logradouros existentes (~l.159-181).
3. src/gerador/cidade.js — adicionar o lote travessa ao TRACADO (nucleada) e às tabelas
   POS_LINEAR/POS_GREEN (E4), ANCORADO ao pub em cada morfologia (fundos do pub). E a
   REGRA ESPECIAL de adjacência curada (a travessa não entra na malha de distância comum;
   é adjacente só ao pub e a 1–2 cottages atrás). LIMIAR_ADJACENCIA e a ancoragem dos 3
   logradouros atuais (adro↔igreja, pátio↔granja, açude↔moinho) são o padrão a preservar.
4. src/gerador/caso.js — wiring de palco (~l.219-260): incluir 'travessa_dos_fundos' na
   lista de tipos do chamariz; LOGRADOURO_DO_PREDIO['pub']='travessa_dos_fundos' e
   PREDIO_DO_LOGRADOURO/FAIXAS_DO_LOGRADOURO para a via de rotina (carroceiro/taverneiro).
   Atenção: o pub pode ser opcional (checar TIPOS_PREDIO) — a via de rotina só vale quando
   o pub existe; o chamariz não depende disso.
5. Prosa: a prosa de palco externo (corpo/cena/vizinhança) já é genérica ("a céu aberto");
   avaliar se a travessa merece uma nota de traçado própria (beco/fundos) — se sim, é prosa
   nova e passa pelo pipeline redigir-prosa + revisar-prosa (zero bloqueantes).

BALANÇO (mesma bancada da E4, obrigatória ANTES de aceitar):
- node scripts/relatorio-espacial.mjs 20000 — o regime-palco (interno ~76% / logradouro
  na banda 10–30% / pousada ~10%) e magnitude/método/satélite devem ficar nas bandas do
  relatório v1 (docs/os-palco-em-aneis-relatorio-espacial-v1.md). Os TIPOS de logradouro
  passam de 3 para 4 (~25% cada) — isso é esperado, não é violação.
- Medir a adjacência da travessa por morfologia (forçar via gerarCidade(seed, morf) e
  montarPacoteGerado(seed, {morfologia})): deve ficar em ~2 (controlada), não 5–7.
- Se QUALQUER banda sair fora, PARAR e reportar ao criador — não "consertar" sozinho
  (ordem do plano E0 §4/E4).

Verificação final: npm run build limpo; node scripts/qa.mjs verde (4 perfis → 4
desfechos + guardas GE); node scripts/lint-prosa.mjs; node scripts/qa-ui.mjs verde;
npm run gerar:casos; jogar 2 seeds cujo palco caia na travessa (?caso=gerado_<id>).

Nota de processo (aprendido na E1–E4): NÃO rodar `npm run gerar:casos` enquanto o
qa-ui.mjs estiver servindo — o reload de HMR quebra o teste no meio. Regenere o banco
ANTES do qa-ui, não durante.

Desenvolver, commitar e dar push na branch designada da sessão. Não abrir PR sem ordem.
Explicar o resultado para leigo em programação.
```
