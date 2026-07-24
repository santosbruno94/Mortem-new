# MORTEM — regras do repositório

Jogo de investigação forense (Inglaterra vitoriana, 1893) em React. Texto 100% em
PT-BR. Este arquivo orienta agentes de código; a fonte única de verdade do design é
`MORTEM_CONTEXTO.md`.

## Documentos normativos

| Documento | O que rege |
|---|---|
| `MORTEM_CONTEXTO.md` | Design do jogo (estado atual) |
| `docs/game-design-simulacao.md` | Design do gerador por simulação (autobattler de build time) e do sistema de interferência (Regras de Justiça R1–R6) |
| `docs/nota-gabinete-ilustrado.md` | Design da camada de apresentação (pivô visual novel de gravura): a Prancha do corpo (Sistema 1) e a Cena de diálogo (Sistema 2); não rege motor, gerador nem prosa |
| `docs/sistema-visual.md` | Sistema visual da interface inteira: paleta token a token, cardápio tipográfico (5 faces), catálogo da matéria procedural, legenda das tintas de carimbo, notação da hora e divergências deliberadas do desenho — não rege motor, gerador nem prosa |
| `docs/historico-decisoes.md` | Arqueologia de playtests/redesigns (só consulta) |
| `docs/guia-de-estilo.md` | TODA a prosa: norma de língua, observação pura, dosagem de brilho |
| `docs/biblia-de-vozes.md` | Idioleto de cada personagem |
| `docs/kb-medicina-legal/` | Verdade forense de época (Taylor, Casper, Lacassagne) + aparato legal-policial de 1893 |
| `docs/kb-mundo-vitoriano/` | Verdade histórica do cenário: arquitetura, sociedade, cotidiano, vestuário, economia e estrutura social (1893) |
| `docs/kb-psique-e-crime/` | Verdade de época sobre mente, desvio e crime: psiquiatria/alienismo, criminologia, insanidade e lei, sexologia/perversões, estatísticas do crime (1893) |
| `docs/kb-craft-narrativo/` | Craft do mistério: fair play, clichês, construção de caso, prosa de mistério, jogos de referência |
| `docs/kb-producao/` | Consulta de planejamento: game design de dedução, UI/estética, assets e licenças, produção solo — não rege prosa |
| `docs/plano-de-sessoes.md` | Rota de trabalho entre sessões (ordem, escopo e critério de pronto); inventário item a item em `docs/pendencias-status.md` — não rege prosa |

## Skills e agentes

- Escrever/reescrever prosa → skill `redigir-prosa` (agente `escritor-prosa`).
- Revisar prosa antes de commit → skill `revisar-prosa` (pipeline: `editor-critico` +
  `perito-forense` + `fiscal-continuidade`).
- Caçar tiques de texto de IA → skill `anti-padrao-ia`.

**Nenhuma reescrita substancial de prosa entra em commit sem o pipeline `revisar-prosa`
com zero achados bloqueantes.**

## Regras invioláveis do código

- As funções de lógica e veredicto leem SOMENTE `tagsOcultas` (e a seed) — nunca `id`,
  `textoDisplay` ou texto de carta.
- Zero LLM em runtime; zero chamadas de rede; tudo determinístico (proibido
  `Math.random()`/`Date.now()` em `src/logic`, `src/data` e `src/store` — guarda
  automática no `qa.mjs`; toda variação vem de `hashString` em `src/logic/hash.js`,
  salgado com a seed). Exceção registrada: o three.js usa `Math.random` em
  internos (uuid) — é camada de APRESENTAÇÃO, fora da lógica de jogo.
- Camada 3D é apresentação pura: geometria **100% procedural (proibido GLTF/textura
  de arquivo)** — inalterado. Dados espaciais são camada visual (nunca lidos pelo
  motor), e todo ponto 3D tem fallback 2D (`?flat=1`).
- Asset **2D sob contrato** (permitido): asset externo 2D é admitido desde que
  (a) embarcado no bundle (zero rede em runtime); (b) selecionado
  deterministicamente (`hashString` salgado, nunca sorteio); (c) invisível ao motor
  (nenhuma regra o lê); (d) com **fallback procedural obrigatório** — ausente ou
  inválido, a renderização SVG/CSS atual assume e o jogo joga idêntico; (e) registrado
  no **manifesto de assets** com dimensões do slot e proveniência de licença, sob
  guarda do `qa.mjs`. Interpretação registrada: *textura/`CanvasTexture` gerada em
  código pela seed = permitida* (não é arquivo importado; é determinística e
  versionada como código).
- Aparência de personagens é camada narrativa (`src/data/aparencias.js`) — JAMAIS
  entra em `tagsOcultas` nem é lida por `veredicto.js`/`acusacao.js` (guarda no QA).
- **Atributos de personagem (FOR/INT/WIS/CHA) vivem apenas no gerador** (build time);
  o pacote de caso carrega somente as consequências (vestígios, flags de comportamento
  de diálogo, gatilhos de interferência pré-computados); **o motor é cego a
  atributos** — nenhuma regra de runtime os lê (mesma cegueira de aparências/papéis;
  design em `docs/game-design-simulacao.md`).
- Camada narrativa ≠ camada lógica: trocar prosa nunca exige tocar no motor.
- Código e comentários em português.
- Marcadores `[[id_da_carta]]` na prosa e interpolações `{detective.campo}` /
  `{g:masc|fem}` são estruturais — preservar na reescrita.
- Medicina legal tecnicamente precisa, sempre (validar contra `docs/kb-medicina-legal/`;
  divergência KB × motor é decisão do usuário, não do agente).

## Verificação

- `npm run build` — build limpo é obrigatório.
- `node scripts/qa.mjs` — QA estático: os 4 perfis de jogador devem produzir os 4
  desfechos (Metódico → Vitória Absoluta; Apressado → Erro Judiciário; Intuitivo →
  Impunidade; o quarto → Sucesso com Gafes).
- `node scripts/qa-ui.mjs` — QA de fumaça da interface: joga as 3 rotas canônicas no
  navegador (Playwright/Chromium) e checa regressões de texto visível; rodar antes de
  commit que toque UI, prosa exibida ou monólogo.
- `npm run dev` — toda feature testável no navegador antes de avançar.
- **Contrato com o `qa-ui.mjs`:** os textos exatos de botões/rótulos que ele clica
  (ex.: `CONSTRUIR A ACUSAÇÃO`, `fechar ✕`, rótulos dos nós), as classes
  `.termo-clicavel`/`.termo-extraido`, o atributo `data-overlay` nas raízes de
  overlay e a ordem dos dois `<select>` da janela no mural são INTOCÁVEIS —
  qualquer mudança neles exige atualizar o QA no mesmo commit.

## Antes de abrir PR (ordem permanente do usuário, 22/07/2026)

Toda solicitação de abrir PR inclui, **automaticamente e no mesmo commit final**,
atualizar `MORTEM_CONTEXTO.md` e `README.md` ao estado entregue pela branch
(seções tocadas pelo trabalho: modos, arquitetura, horas, pastas, comandos).

## Perfil do criador

Advogado sem background em programação. Explicações executáveis sem conhecimento de
dev; design antes de build; **não criar features sem ordem expressa**; cada iteração é
um incremento jogável.
