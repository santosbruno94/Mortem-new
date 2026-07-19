# MORTEM

Jogo de investigação forense em texto e cartas, ambientado na Inglaterra vitoriana (1893).
Este repositório contém o **vertical slice jogável** do caso **"A Hora Emprestada"** —
da tela de título ao Monólogo do Detetive, com os 4 desfechos possíveis.

A fonte única de verdade do design é o arquivo [`MORTEM_CONTEXTO.md`](./MORTEM_CONTEXTO.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [`MORTEM_CONTEXTO.md`](./MORTEM_CONTEXTO.md) | Design do jogo (estado atual) |
| [`docs/guia-de-estilo.md`](./docs/guia-de-estilo.md) | Norma de toda a prosa (língua de época, observação pura, anti-padrões) |
| [`docs/biblia-de-vozes.md`](./docs/biblia-de-vozes.md) | O idioleto de cada personagem |
| [`docs/kb-medicina-legal/`](./docs/kb-medicina-legal/) | Base de conhecimento forense de época (fontes: Taylor, Casper, Lacassagne) |
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
```

## Como se joga

1. **Atenda ao chamado** — Harlan Blackwell ergue o convite da mesa.
2. **Abertura** — da pensão em Caulfield ao briefing do Delegado Wycliffe (as perguntas ao
   delegado não custam tempo… mas plantam iscas).
3. **Investigação** — tudo acontece sobre a escrivaninha. Localidades são cartas: clique para
   **viajar** até lá (só a viagem gasta o relógio) e abrir o exame ou o interrogatório como
   sobreposição. **Termos em negrito** na prosa extraem cartas para a mesa — examinar **não**
   custa tempo. O legista vai **falando** a leitura do corpo (uma dica). O perecível (rigor,
   temperatura) **perde precisão** com as horas, mas nunca some — o durável sempre resolve.
4. **Construir a acusação** — o botão da parede abre o **mural com barbante**. Você **afirma**
   a cadeia nas âncoras (réu; janela da morte; causa; motivo; juízo sobre cada outro suspeito) e
   a **sustenta puxando barbantes** das cartas: indicadores → *Quando*, sinais → *Como*, vestígio
   → *Presença*, e fatos → depoimentos para **desmentir** uma mentira. Nada diz se você acertou.
5. **Monólogo do detetive** — "Levar a julgamento" gera o monólogo de um dos **4 desfechos**
   (Vitória Absoluta, Sucesso com Gafes, Impunidade, Erro Judiciário): cada elo ligado vira uma
   frase; cada elo faltante, um buraco. No caso-escola é permitido revisar a acusação e tentar de novo.

## Stack

Vite + React (JSX) + Tailwind CSS + Zustand. Sem TypeScript, sem engine, sem chamadas de
rede em runtime — dados em módulos JS e lógica determinística em funções puras.

```
src/
  data/         seed, catálogo de causas, cartas (com tagsOcultas), localidades, mapa, glossário, abertura, rótulos
  logic/        tempo, tempo_morte, cronos, acusacao (gramática das ligações), veredicto, falaDoMestre, monólogo, interpolação
  store/        jogo.js (Zustand: fases, relógio, mapa, cartas registradas, conclusões, acusação, log)
  components/   Escrivaninha, MuralAcusacao (o mural), EventoLocalidade, painéis, Caderneta, Monólogo do Detetive…
```
