# MORTEM

Jogo de investigação forense em texto e cartas, ambientado na Inglaterra vitoriana (1893).
Este repositório contém o **vertical slice jogável** — da tela de título ao Monólogo do
Detetive, com os 4 desfechos possíveis — hoje em **três modos** sobre a mesma mesa:

1. **A Hora Emprestada** — o caso-escola artesanal, escrito à mão (com a maquete 3D da vila).
2. **A Hora Refeita** — a réplica procedural do caso-escola (a máquina remonta o mesmo crime).
3. **Um Caso da Comarca** — um caso sorteado de um banco de **21 casos** que a simulação
   gera em build time (vila, elenco e vestígios que nenhuma mão escreveu).

O gerador é uma **ilha de build time**: em runtime o jogo só carrega pacotes prontos, nunca
importa `src/gerador`; tudo é determinístico, sem chamadas de rede.

A fonte única de verdade do design é o arquivo [`MORTEM_CONTEXTO.md`](./MORTEM_CONTEXTO.md);
o que ainda falta está em [`docs/pendencias-status.md`](./docs/pendencias-status.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [`MORTEM_CONTEXTO.md`](./MORTEM_CONTEXTO.md) | Design do jogo (estado atual) |
| [`docs/game-design-simulacao.md`](./docs/game-design-simulacao.md) | Design do gerador por simulação (autobattler de build time) e da interferência |
| [`docs/nota-gabinete-ilustrado.md`](./docs/nota-gabinete-ilustrado.md) | Pivô de apresentação (visual novel de gravura): a Prancha do corpo e a Cena de diálogo |
| [`docs/pendencias-status.md`](./docs/pendencias-status.md) | Mapa vivo do que ainda falta (o que foi feito, o que fica para sessão própria) |
| [`docs/guia-de-estilo.md`](./docs/guia-de-estilo.md) | Norma de toda a prosa (língua de época, observação pura, anti-padrões) |
| [`docs/biblia-de-vozes.md`](./docs/biblia-de-vozes.md) | O idioleto de cada personagem |
| [`docs/kb-medicina-legal/`](./docs/kb-medicina-legal/) | Verdade forense de época (Taylor, Casper, Lacassagne) + aparato legal-policial de 1893 |
| [`docs/kb-mundo-vitoriano/`](./docs/kb-mundo-vitoriano/) | Verdade histórica do cenário (arquitetura, sociedade, cotidiano, economia) |
| [`docs/kb-psique-e-crime/`](./docs/kb-psique-e-crime/) | Mente, desvio e crime de época (alienismo, criminologia, insanidade e lei) |
| [`docs/kb-craft-narrativo/`](./docs/kb-craft-narrativo/) | Craft do mistério (fair play, clichês, construção de caso) |
| [`docs/kb-producao/`](./docs/kb-producao/) | Consulta de planejamento (game design de dedução, UI/estética, assets) |
| [`docs/historico-decisoes.md`](./docs/historico-decisoes.md) | Histórico de playtests e redesigns |

O repositório também traz agentes e skills de redação em [`.claude/`](./.claude/)
(escritor, editor-crítico anti-padrões de IA, perito forense, fiscal de continuidade).

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço indicado no terminal (normalmente `http://localhost:5173`).

Outros comandos:

```bash
npm run build        # build de produção (pasta dist/)
npm run preview      # serve o build de produção
node scripts/qa.mjs     # QA estático: traça os perfis de jogador pelo motor (inclui o linter de prosa)
node scripts/qa-ui.mjs  # QA de fumaça da interface (requer Playwright + Chromium)
npm run lint:prosa      # linter de prosa isolado: cheques mecânicos do guia de estilo
npm run gerar:casos     # regenera o banco de casos da comarca (src/data/casos_gerados.js)
```

Ferramentas de inspeção do gerador (build time, imprimem no terminal):
`npm run demo:elenco`, `demo:cidade`, `demo:crime`, `demo:interferencia`.

## Como se joga

1. **Atenda ao chamado** — Harlan Blackwell ergue o convite da mesa e escolhe um dos **três
   chamados** (o caso-escola artesanal, a réplica procedural, ou um caso da comarca sorteado).
2. **Abertura** — da pensão em Caulfield ao briefing do Delegado Wycliffe (as perguntas ao
   delegado não custam tempo… mas plantam iscas).
3. **Investigação** — tudo acontece sobre a escrivaninha. Localidades são cartas: clique para
   **viajar** até lá (só a viagem gasta o relógio) e abrir o exame ou o interrogatório como
   sobreposição. O exame do corpo é uma **prancha de atlas** (SVG, com lupa que segue o
   dedo, frente/dorso e necropsia); os interrogatórios compõem uma **cena ilustrada** (fundo
   da localidade + sprite do interlocutor), com **confronto** (pousar uma prova diante do
   suspeito) e **exigir que mostre** (mandar mostrar as mãos, os antebraços ou as botas —
   quando o corpo da vítima anuncia a marca-espelho). **Termos em negrito** na prosa extraem
   cartas para a mesa — examinar **não** custa tempo. A **voz do mestre** vai dando a leitura do
   corpo (uma dica; o Dr. Alcott, ausente, recordado pelo aprendiz). O perecível (rigor,
   temperatura) **perde precisão** com as horas, mas nunca some — o durável sempre resolve.
4. **Construir a acusação** — o botão da parede abre o **mural com barbante**. Você **afirma**
   a cadeia nas âncoras (réu; janela da morte; causa; motivo; juízo sobre cada outro suspeito) e
   a **sustenta puxando barbantes** das cartas: indicadores → *Quando*, sinais → *Como*, vestígio
   → *Presença*, e fatos → depoimentos para **desmentir** uma mentira. Nada diz se você acertou.
5. **Monólogo do detetive** — "Levar a julgamento" gera o monólogo de um dos **4 desfechos**
   (Vitória Absoluta, Sucesso com Gafes, Impunidade, Erro Judiciário): cada elo ligado vira uma
   frase; cada elo faltante, um buraco. No caso-escola é permitido revisar a acusação e tentar de novo.

## Stack

Vite + React (JSX) + Tailwind CSS + Zustand, com **three.js / react-three-fiber** para a
maquete 3D da vila (geometria 100% procedural, com fallback 2D via `?flat=1`). Desde o pivô
**"Gabinete Ilustrado"** (jul/2026), a apresentação é visual novel de gravura: o exame do
corpo (A Prancha) e as conversas (A Cena) são **SVG procedural** — o 3D remanescente é só o
diorama da vila. Sem TypeScript, sem engine de jogo, sem chamadas de rede em runtime — dados
em módulos JS e lógica determinística em funções puras (toda variação vem de `hashString`
salgado com a seed).

```
src/
  data/         seed, catálogo de causas, cartas (com tagsOcultas), localidades, mapa, glossário,
                abertura, rótulos, casos_gerados.js (banco de 21 casos da comarca)
  logic/        tempo, tempo_morte, cronos, acusacao (gramática das ligações), veredicto, falaDoMestre, monólogo, interpolação
  store/        jogo.js (Zustand: fases, relógio, mapa, cartas registradas, conclusões, acusação, log)
  gerador/      ILHA de build time: autobattler do crime, cidade, elenco, vestígios, interferência
                — resolve o caso e emite um pacote pronto; o runtime nunca o importa
  components/   Escrivaninha, MuralAcusacao (o mural), EventoLocalidade, PranchaCorpo (exame
                do corpo em SVG), CenaDialogo/FundoCena (cena ilustrada), diorama 3D da vila,
                painéis, Caderneta, Monólogo do Detetive…
```
