# OS — O verbo "Exigir que mostre" (Inc. 6 do pivô Gabinete Ilustrado)

> **Estado:** aberta, não iniciada. É a única frente do pivô "Gabinete Ilustrado" que ficou
> por fazer — deferida **por design**, não por falta de tempo. A nota de apresentação
> (`docs/nota-gabinete-ilustrado.md` §6) já a marcava como *fase própria, só com ordem
> expressa*. Esta OS reúne o que a sessão de 21/07/2026 apurou ao deferi-la, para que a
> próxima sessão parta pronta.

## 1. O que é (o circuito da referência)

Importado de *No, I'm Not a Human* e traduzido ao fair play do repositório:

1. **O sinal é anunciado por fonte legítima** — a voz do mestre ou uma carta de vestígio
   afirma a marca que o agressor carregaria ("quem a segurou levaria meias-luas de unha no
   antebraço direito"). **Sem anúncio prévio não há checagem** — conferir sinal é dedução,
   nunca pixel-hunting.
2. **O verbo no interrogatório** — "Exigir que mostre": mãos, antebraços, botas, colarinho…
   O suspeito exibe, hesita ou **recusa** — e a recusa é informação **ambígua por design** (o
   inocente ofendido também recusa).
3. **O close** — a exibição abre uma vinheta de gravura (2–3 quadros, mesma técnica do
   `.gravura-respira`): as mãos ocupando o quadro, como os dentes ocupam o quadro na
   referência.
4. **O que se vê vira carta** — com `tagsOcultas` próprias, ligável no mural como qualquer
   vestígio. O motor lê a carta; **jamais a imagem**.

## 2. Por que NÃO entrou no caso-escola (o achado que gatilhou o deferimento)

O circuito exige uma **marca-espelho de luta** no corpo do agressor. O caso-escola "A Hora
Emprestada" é **homicídio por arma branca com a vítima surpreendida** (sem luta, sem lesões
de defesa) — não há marca-espelho a exibir. Forjar uma ali **fabricaria um sinal que o caso
não tem** e furaria o fair play que a S2 fixou (`historico-decisoes.md`, "S2 — Decisões de
fair play"). Logo, o verbo **pertence aos casos gerados**, onde o autobattler produz a luta
como efeito colateral do crime.

## 3. Escopo (o que a OS toca) — e por que é fase própria

- **Gerador (`src/gerador/`):** estende o depósito de vestígios ao **corpo do agressor**
  (marcas-espelho da luta: escoriação de unha, hematoma de pega, corte de defesa recebido) e
  planta **ruído honesto nos inocentes** (calos de ofício, cicatriz antiga, mancha de tinta)
  — para que *"o único com marca"* **nunca** seja sinônimo de *"o réu"*. É a peça de fair
  play mais delicada da OS: requer guardas novas de solvabilidade no `qa.mjs` (ver §5).
- **Pacote de caso:** os sinais exigíveis pré-computados (sinal anunciado + quem o carrega +
  reação de exibição/recusa) — o motor segue cego a atributos; lê só as consequências.
- **Apresentação (interrogatório):** o verbo "Exigir que mostre" como canal lateral (como o
  confronto de prova e o gatilho de complexo já são), o close em vinheta, o resultado→carta.
- **Caso-escola:** só entra se um dia ganhar um caso com luta; por ora, os casos gerados são
  o veículo. Se algum dia for para o artesanal, a prosa das marcas passa por `revisar-prosa`.

## 4. Decisões abertas (do dono do projeto) — responder antes de codar

- **[DECISÃO 4.1] Economia da exigência** (nota §6/§8.3): exigir **não custa relógio** (como
  examinar), mas exigência **sem sinal anunciado planta isca** (paralelo às perguntas ao
  delegado)? *ou* **recusa progressiva** por suspeito após N exigências? Recomendação da nota:
  a primeira (isca por exigência infundada).
- **[DECISÃO 4.2] A exibição concedida consta na Caderneta** como diário (sim/não)?
- **[DECISÃO 4.3] Dose do ruído honesto:** quantos inocentes carregam marca plausível por
  caso, e com que distribuição, para o tell nunca fechar sozinho (cruzar com a telemetria do
  `qa.mjs`, como se fez nas flags psíquicas).
- **[DECISÃO 4.4] Vocabulário das marcas** por classe de método (arma branca / contusão /
  asfixia / veneno): que marca-espelho cada família de crime deixa no agressor, validada
  contra `docs/kb-medicina-legal/` (o perito-forense entra aqui).

## 5. Critério de pronto

- O verbo joga em pelo menos um caso gerado com luta: sinal anunciado → exigir → close →
  carta ligável no mural; recusa é ambígua.
- **Fair play fiscalizado no `qa.mjs`:** (a) todo caso com marca-espelho no réu tem ≥1
  inocente com marca honesta; (b) a marca do réu **nunca** é a única âncora de autoria (a Via
  B / contra-hipótese continua valendo); (c) nenhum id/tag interno vaza para a tela.
- Motor cego à imagem (guarda de que veredicto/acusação leem só a carta, não o sprite).
- `qa.mjs` **CASO VÁLIDO**, `qa-ui.mjs` **UI VÁLIDA**, `build` limpo; prosa nova (se houver)
  com `revisar-prosa` zero bloqueantes.
- Contrato do `qa-ui.mjs` preservado ou atualizado no mesmo commit.

## 6. Insumos

`docs/nota-gabinete-ilustrado.md` (§6), `docs/game-design-simulacao.md` (autobattler e
depósito de vestígios), `docs/kb-medicina-legal/` (marcas de luta por método),
`docs/kb-craft-narrativo/cliches-e-fair-play.md`, `docs/os-p9-ancora-hibrida.md` (a Via B de
contra-hipótese, que esta OS reaproveita para não deixar a marca ser âncora única),
`src/gerador/vestigios.js` e `src/gerador/comportamentos.js`.
