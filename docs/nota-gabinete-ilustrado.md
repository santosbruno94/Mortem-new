# Nota de design — Pivô de apresentação: o Gabinete Ilustrado

> Nota aprovada em conceito (jul/2026) e **implementada** (Sistemas 1 e 2) na sessão de
> 21/07/2026. Rege o DESIGN da camada de apresentação; **não** rege motor, gerador ou
> prosa. A apresentação migra para o registro de **visual novel de gravura** — prancha de
> atlas de medicina legal para o corpo, cena ilustrada para as conversas —, inspirada na
> composição de *No, I'm Not a Human* traduzida para o vocabulário gráfico de 1893.

## Tese

O caso apresentado como a imprensa ilustrada de crime e o atlas forense de época o teriam
estampado. Importa-se da referência a **composição de cena**, o **corpo como documento a
escrutinar** e o circuito **sinal-anunciado → sinal-conferido**. Não se importa o dithering
de pixel, o sobrenatural nem a gestão de abrigo.

## Invariantes (herdados, não cedem)

1. Camada visual invisível ao motor — nenhuma regra lê prancha, sprite ou fundo.
2. Determinismo total — variação por `hashString` salgado; zero `Math.random`/`Date.now`
   fora da apresentação.
3. Zero rede, zero LLM em runtime.
4. Asset externo só sob contrato (embarcado, por hash, invisível ao motor, com fallback
   procedural, no manifesto sob guarda do `qa.mjs`).
5. Contrato do `qa-ui.mjs` intocável (textos de botão/rótulo, classes, `data-overlay`).
6. Contraste é regra (nada informativo abaixo de `stone-400`).
7. Acessibilidade de movimento (`prefers-reduced-motion` → quadro único).

## A regra do placeholder: "o placeholder É o fallback"

Tudo nasce procedural (SVG/CSS/`CanvasTexture` por seed); o procedural **nunca** é
descartado — quando a arte externa chegar, entra slot a slot e o procedural daquele slot
vira o fallback obrigatório. Critério de pronto de todo incremento: **joga completo e
idêntico com zero arquivos de arte no bundle.**

## Incrementos — estado

| # | Incremento | Estado |
|---|---|---|
| 1 | Prancha frontal com lupa e hotspots, em paridade com o exame | ✅ Feito (`PranchaCorpo.jsx`) |
| 2 | Verso ("Virar a prancha") + alternador Exame externo/Necropsia | ✅ Feito |
| 3 | Cena de conversa: sprite meio-corpo + caixa de prosa | ✅ Feito (`CenaDialogo.jsx`) |
| 4 | Fundos paramétricos por localidade | ✅ Feito (`FundoCena.jsx`) |
| 5 | "Gravura que respira" + estado de reação observável | ✅ Feito (CSS `.gravura-respira`/`.cena-sprite--reacao`) |
| 6 | Verbo "Exigir que mostre" | ⏭️ **Deferido — fase própria** (ver abaixo) |
| 7 | Slots de asset sob contrato | ✅ Feito (slots `prancha_corpo`/`fundo_cena` em `slots_assets.js`) |
| 8 | A vila do hub em gravura (OS Prancha da Vila) | ✅ Feito (`prancha/PranchaVila.jsx`) — **a prancha é a vista padrão; o diorama 3D é alternador opcional, intocado** |

### Sistema 1 — A Prancha (Inc. 1–2)

A mesa de exame do corpo deixa de ser cadáver 3D e vira **prancha de atlas** em SVG
procedural: folha de pergaminho, figura em contorno de gravura, lente circular que segue o
ponteiro (2×), hotspots que extraem **as mesmas cartas** dos termos em negrito. Pose (rigor)
e manchas (livor) são função do IPM, lendo as mesmas faixas de `tempo_morte.js` — nenhum
número novo, motor cego. Duas faces ("Virar a prancha": frente ↔ dorso, rotuladas pela FACE
e não pelo decúbito, para o livor dorsal não ler como corpo movido) e uma camada de
**necropsia** (dissecção do trajeto da ferida — ilustrativa, 0 hotspots, "não acrescenta ao
que o corpo já disse"). Placeholder que É o fallback: SVG (nunca `<canvas>`) preserva o
`?flat=1`. **O cadáver 3D foi aposentado; o diorama da vila continua no repositório e
intocado — mas desde a OS Prancha da Vila deixou de ser a vista padrão (ver Sistema 3).**

### Sistema 2 — A Cena (Inc. 3–5)

Interrogatórios e eventos de localidade compõem cena ilustrada: **fundo 2D paramétrico** da
localidade (`FundoCena` — oficina, loja, delegacia, estalagem, gabinete, moinho; SVG por
tipo derivado do nó) + **sprite meio-corpo** do interlocutor (`RetratoPersonagem` variante
`'cena'`, mesmo genótipo, sem moldura). "Gravura que respira" (micro-boil em `steps()`,
congela sob `prefers-reduced-motion`) e "reação observável" (o interrogado desvia de leve ao
ser confrontado — gesto, nunca legenda; a regra "reação, nunca confissão" segue valendo). O
contrato do `qa-ui` foi preservado (o sprite carrega `data-retrato`).

### Sistema 3 — A Prancha da Vila (Inc. 8)

O hub deixa de ser maquete 3D e passa a ser **prancha de gravura** em SVG procedural
(`src/components/prancha/PranchaVila.jsx`): moldura de quadro gravado, linha de horizonte,
casario hachurado, um prédio por nó desbloqueado (silhueta derivada da MESMA `forma` que o
diorama consome), escala gráfica e rosa dos ventos. As etiquetas dos nós continuam HTML real
(`RotuloNo`) sobre o desenho, com o mesmo texto e o mesmo handler de viagem — paridade por
construção. Nenhum dado novo: a fonte espacial é a dupla de sempre (campo visual `maquete` do
pacote, ou `mapa_espacial.js` no caso-escola).

**Estado das duas vistas:** a prancha é o PADRÃO; `DioramaVila` continua inteiro, atrás do
alternador de dois botões no pé da mesa ("A prancha" / "A maquete"), com a preferência em
`localStorage`. Sem WebGL, em `?flat=1` ou depois de o contexto 3D cair, "A maquete" fica
desabilitada com o motivo legível e a prancha segue de pé — ela É o fallback. O chunk do
three.js só desce se o jogador pedir a maquete.

## Decisões (§8 da nota original), tomadas nesta sessão

1. **Destino do `corpo3d/`** — **aposentado** para o exame (a prancha é a vista padrão);
   o diorama 3D da vila permanece intocado. (Os arquivos `corpo3d/CorpoCanvas` etc. ficam
   no repo, sem uso pelo exame; a prancha vive em `corpo3d/PranchaCorpo.jsx`.)
2. **Acesso à necropsia** — livre desde o exame (alternador "Abrir a necropsia"), sem gate.
3. **Economia do "Exigir"** — não resolvida (Inc. 6 deferido).
4. **Alcance do pivô** — limitado a exame + conversas nesta fase (Abertura e Monólogo não
   ganharam cena ilustrada; ficam para frente, sem ordem).
5. **Registro nos docs** — feito (esta nota; tabelas de `CLAUDE.md`; `plano-de-sessoes.md`;
   `pendencias-status.md`; `historico-decisoes.md`).

## Inc. 6 — "Exigir que mostre": por que fica para fase própria

A nota já o marcava como fase própria (toca gerador e UX de interrogatório). A implementação
confirmou o motivo de **design**: o circuito exige uma **marca-espelho de luta** no agressor
(ex.: "meias-luas de unha no antebraço"), anunciada por fonte legítima antes da checagem. O
**caso-escola é homicídio por arma branca sem luta** (a vítima foi surpreendida) — não há
marca-espelho a exibir, e forçá-la fabricaria um sinal que o caso não tem, furando o fair
play que a S2 fixou. O verbo pertence aos **casos gerados**, onde o autobattler produz a luta
como efeito colateral e se pode plantar **ruído honesto** nos inocentes (calos de ofício,
cicatriz antiga) para que "o único com marca" nunca seja "o réu". Requer: depósito de
marca no corpo do agressor + ruído nos inocentes (gerador), o verbo no interrogatório e o
close→carta (apresentação), e prosa das marcas no caso-escola sob `revisar-prosa` — com
guardas de solvabilidade/fair play novas no `qa.mjs`. **Abre-se só com ordem expressa.**

## O que este pivô NÃO muda

Motor e gramática da acusação; `tagsOcultas` como única leitura do veredicto; economia de
tempo; mural, monólogo e os 4 desfechos; a Caderneta como diário; o código do diorama 3D da
vila (que segue intocado, agora como vista alternativa) e a regra do 3D 100% procedural; a norma de prosa e o pipeline `revisar-prosa`; o contrato do
`qa-ui.mjs`.
