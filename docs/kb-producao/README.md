# Base de Conhecimento — Produção (game design, UI, assets, solo dev)

O conhecimento de produção de MORTEM: os princípios do gênero de dedução, o
vocabulário visual e sonoro de época aplicável à interface, os caminhos (e licenças)
para assets, e o que a literatura de desenvolvimento solo — e de desenvolvimento por
agentes de IA — ensina sobre **terminar** o jogo.

**Esta pasta é de consulta de planejamento.** Os agentes de prosa não a leem; quem a
lê é o criador (e o agente que o assessora) ao decidir features, escopo e produção.
Nada aqui é ordem: os arquivos terminam em **cardápios**, e a escolha é sempre do
criador (perfil no `../../CLAUDE.md`: design antes de build, nenhuma feature sem
ordem expressa).

## Índice

| Arquivo | Conteúdo |
|---|---|
| [`game-design-deducao.md`](./game-design-deducao.md) | Sinalizar sem entregar, calibração de dificuldade, taxonomia de frustrações do gênero, anti-chute, modelos de validação de acusação, o problema do procedural, onboarding. |
| [`ui-e-estetica.md`](./ui-e-estetica.md) | Tipografia e ephemera reais de 1893 como vocabulário de UI, interface diegética, painéis do gênero, legibilidade/acessibilidade, paleta escura, som. |
| [`assets-e-como-obter.md`](./assets-e-como-obter.md) | O que cabe na regra procedural (3D, som, tipografia, imagem DP) e o cardápio fora dela — marketplaces, licenças explicadas, comissionamento — tudo marcado **[DECISÃO DO USUÁRIO]**. |
| [`solo-dev-com-agentes.md`](./solo-dev-com-agentes.md) | Por que solo devs não terminam, o que os postmortems ensinam sobre cortar, spec-driven development com agentes, playtest, lançamento e o gargalo de conteúdo. |
| [`contrato-papeis-e-gerador.md`](./contrato-papeis-e-gerador.md) | Taxonomia de papéis dramáticos (casting), o casting do caso-escola e o contrato que o futuro gerador de casos terá de satisfazer (FASE 5 — sem código de gerador). |
| [`arquetipos-e-casting.md`](./arquetipos-e-casting.md) | Arquétipos junguianos como ferramenta de build time (andaime meta, não-diegético): sombra→móbil, persona→verdade, mapeamento aos papéis de `papeis.js` e pipeline determinístico. |
| [`fontes.md`](./fontes.md) | Regra epistemológica da pasta e notas de confiança. |

## Regra de uso

- **Marcador `[DECISÃO DO USUÁRIO]`:** tudo que exigiria alterar uma regra do repo
  (ex.: "camada 3D 100% procedural") está marcado assim e NÃO se executa sem ordem —
  análogo ao `[MOTOR]` da KB forense.
- **Princípios ≠ features.** As "Implicações para o jogo" avaliam os sistemas atuais
  e listam princípios-guia; não propõem implementar nada.
- Preços, licenças e números de mercado foram verificados em julho/2026 — **conferir
  a página oficial antes de qualquer compra ou adoção de licença**; esses termos
  mudam unilateralmente.
