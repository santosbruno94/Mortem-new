# MORTEM

Jogo de investigação forense em texto e cartas, ambientado na Inglaterra vitoriana (1893).
Este repositório contém o **vertical slice jogável** do caso tutorial **"O Álibi de Corda"** —
da tela de título ao Monólogo Final, com os 4 desfechos possíveis.

A fonte única de verdade do design é o arquivo [`MORTEM_CONTEXTO.md`](./MORTEM_CONTEXTO.md).

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
node scripts/qa.mjs  # QA estático: traça os perfis de jogador pelo motor
```

## Como se joga

1. **Escolha o perito** — Dr. Harlan ou Dr.ª Lenore Blackwell.
2. **Abertura** — da pensão em Caulfield ao briefing do Delegado Wycliffe (as perguntas ao
   delegado não custam tempo… mas plantam iscas).
3. **Investigação** — tudo acontece sobre a escrivaninha. Localidades são cartas: clique para
   abrir o exame ou o interrogatório como sobreposição. **Termos em negrito** na prosa extraem
   cartas para a mesa — e isso custa tempo. Evidências do corpo **degradam** se você demorar.
4. **Raciocínio** — as três gavetas (Cronos, Aitiov, Nexo) processam cartas em conclusões,
   sem custo de tempo. Declare a hipótese primeiro; a gaveta só diz se ela é *consistente*
   com as evidências inseridas — nunca se está "certa".
5. **Libelo** — no Quadro de Revelações, redija a acusação. Lacunas não bloqueiam a
   submissão; a defesa as explora.
6. **Tribunal** — o Monólogo Final revela, de uma vez, o que você acertou e errou. No
   tutorial é permitido revisar o Libelo e resubmeter.

## Stack

Vite + React (JSX) + Tailwind CSS + Zustand. Sem TypeScript, sem engine, sem chamadas de
rede em runtime — dados em módulos JS e lógica determinística em funções puras.

```
src/
  data/         seed, cartas (com tagsOcultas), localidades, glossário, abertura, rótulos
  logic/        tempo, cronos, aitiov, nexo, veredicto, monólogo, interpolação
  store/        jogo.js (Zustand: fases, relógio, cartas registradas, conclusões, log)
  components/   Escrivaninha, gavetas, painéis, Quadro de Revelações, Monólogo Final…
```
