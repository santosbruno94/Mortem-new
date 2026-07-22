# MORTEM — Diagnóstico de código (21/07/2026)

**Escopo:** varredura de qualidade de todo o `src/` (logic, store, gerador, data,
components) e `scripts/`, mais dependências e build. **Nada foi alterado** — este
relatório inventaria achados e propõe próximos passos; toda correção aguarda ordem.

**Método:** verificações oficiais (`npm run build`, `qa.mjs`, `qa-ui.mjs`,
`lint-prosa.mjs`, `npm audit`) + três auditorias paralelas de leitura de código
(motor/store, gerador, componentes/scripts), com os achados de topo conferidos à mão.

---

## 1. Fotografia das verificações

| Verificação | Resultado |
|---|---|
| `npm run build` | ✅ Limpo (aviso esperado de chunk grande — ver §4) |
| `node scripts/qa.mjs` | ✅ `CASO VÁLIDO` (todas as guardas verdes) |
| `node scripts/qa-ui.mjs` | ❌ **`UI COM 1 FALHA(S)`** — ver achado A1 |
| `node scripts/lint-prosa.mjs` | ✅ Nenhuma violação (21 exceções da allowlist, já inventariadas em §3.1 das pendências) |
| `npm audit` | ⚠️ 4 vulnerabilidades (1 alta, 3 moderadas) — só ferramentas de build/render, ver §5 |

**Conformidade com as regras invioláveis: nenhuma violação encontrada.** Zero
`Math.random`/`Date.now` em `logic/data/store`; o motor lê só `tagsOcultas`; a
disciplina de sal do `hashString` está sólida no gerador inteiro; nenhum id interno
ou rótulo de gabarito vaza para texto exibível.

---

## 2. Achados ALTOS (corrigir primeiro)

### A1 — `qa-ui.mjs` está VERMELHO: contrato dos "3 modos" quebrado pelo 4º modo
- **Onde:** `scripts/qa-ui.mjs:684` exige exatamente 3 `[data-modo]`; o commit
  `cd73a78` (modo "A Marca do Agressor") elevou `MODOS_DE_JOGO` a 4 entradas
  (`src/data/casos.js:28`) **sem atualizar o QA no mesmo commit** — violação da
  regra do `CLAUDE.md` ("qualquer mudança neles exige atualizar o QA no mesmo
  commit"). Todo o resto da rota gerada passa; é a única falha.
- **Correção (1 linha):** trocar `=== 3` por `=== 4` e o texto do check.

### A2 — Diário abre com hora falsa em todo caso gerado
- **Onde:** `src/store/jogo.js:247` — `iniciarInvestigacao` grava o texto fixo
  *"Investigação iniciada na cena, às 13h00 de 14 de outubro"*, mas os casos
  gerados chegam às 11h (interno) ou horário variável (externo, até 8h–9h).
  Num jogo cuja mecânica central é deduzir horas, o diário afirma uma hora errada.
- **Correção:** derivar o texto de `horasJogo` + `parametrosCena.calendario`
  (o campo numérico `hora` do log já está certo; só a prosa mente).

### A3 — Três "horas de chegada" divergentes no gerador ⇒ duas leituras de IPM para o mesmo instante
- **Onde:** `src/gerador/ponte_caso.js:55` usa `HORAS_CHEGADA = 13` (convenção do
  caso-escola) para computar `horasMorteAntesChegada`; `pacote_gerado.js:1925`
  grava `horasChegada: 11` no pacote interno; `interferencia.js:48` usa outra
  constante própria `= 11`. Resultado: no palco interno o
  `horasMorteAntesChegada` sai inflado em 2h, e o runtime obtém **IPMs distintos**
  conforme o chamador (`store/jogo.js:474/589` passa a chegada do pacote;
  `ProsaComTermos.jsx:29` e `EventoLocalidade.jsx:44` usam o default 13) — perto
  dos limiares 12/24/36h isso pode resolver estados de carta diferentes para o
  mesmo momento. No palco externo está consistente.
- **Correção:** uma única fonte — a ponte e a interferência recebem a mesma hora
  gravada em `parametrosCena.horasChegada`; re-gerar os casos e conferir no
  `qa.mjs`.

### A4 — Ficha de pessoa mutila frases ao apagar marcadores `[[id]]`
- **Onde:** `src/components/FichaPessoa.jsx:183` — `limparMarcadores` **apaga** o
  marcador em vez de substituí-lo pelo texto da carta (como faz
  `ProsaComTermos.jsx`). Exemplo real: a fala de Silas termina *"…sem procurar
  nenhuma: ."* na seção "Do interrogatório".
- **Correção:** resolver `[[id]]` via a definição da carta (`textoDisplay`) na
  exibição plana da ficha.

---

## 3. Achados MÉDIOS

**Fair play / coerência mecânica (gerador):**
- **M1 — Marca-espelho pelo método errado na troca de arma (B4):**
  `caso.js:450` usa o método *iniciado* para `marcasCorporais`, mas a carta
  `gen_sinal_exigivel` (`ponte_caso.js:410`) anuncia pelo método *fatal* — com
  troca consumada, o circuito sinal→exigir→close deixa de casar. Decidir a fonte
  única (provavelmente o fatal) e travar no `qa.mjs`.
- **M2 — R2 julga redundância com hora fixa:** `interferencia.js:240`
  (`fatiaResolveSem(..., horaExame = 11)`) mesmo quando a chegada real é outra —
  carta temporal julgada "redundante" pode estar noutro estado na hora do exame.
  Propagar a chegada real (mesmo lote do A3).
- **M3 — Tell por ausência de corroboração:** em `pacote_gerado.js`
  (`derivarPerifericos`), se nenhum inocente ficar sem `gen_corrobora_*`/segredo,
  o réu pode virar o único suspeito "sem carta periférica" — identificável por
  eliminação de metadados. Adicionar guarda no `qa.mjs` (≥1 inocente também sem
  corroboração).
- **M4 — Forasteiro com duas psiques:** `amostragem.js:221` sorteia o vetor com
  um sal e `vetores_psiquicos.js:533` re-sorteia com outro — o `portaoVitima`
  (resistir/fugir/gritar) sai descorrelacionado dos atributos da vítima de
  passagem. Unificar o sal.

**Motor / desfecho:**
- **M5 — `sem_janela` nega gesto feito:** `veredicto.js:79` + `monologo.js:124` —
  quem afirmou a janela mas não ligou carta cai no código `sem_janela` e o
  monólogo diz "Não afirmei a hora da morte" (falso). Código próprio ou prosa
  que cubra os dois casos.
- **M6 — Gafe `nexo_acessorio` sem frase:** `veredicto.js:113` emite o código,
  `monologo.js` não tem `case` — um Sucesso com Gafes pode sair sem explicação
  da única gafe (e o procedural não tem eco do mestre para compensar).
- **M7 — Limiar de 6h duplicado:** `veredicto.js:25` e `falaDoMestre.js:45`
  repetem o `6` — ajustar um e esquecer o outro faz o mestre assinar janela que
  o tribunal rejeita. Exportar de um lugar só.
- **M8 — Diorama lê dados do caso-escola:** `diorama/RotuloNo.jsx:2` e
  `DioramaVila.jsx:5` importam `dialogos.js`/`mapa.js` estáticos em vez do
  pacote corrente (`pacote_caso.js`). Benigno hoje (o diorama só renderiza no
  caso-escola), bomba latente se ids de nó coincidirem.

**Apresentação / robustez:**
- **M9 — Save serializado a cada pixel:** o `persist` do zustand serializa o
  estado inteiro a **cada** `moverCarta` durante o arrasto no mural
  (`jogo.js` + `CartaMesa.jsx:34`). Mover a posição para estado local e gravar
  só no `pointerup`.
- **M10 — Lente da prancha re-renderiza o SVG inteiro a cada `mousemove`**
  (`PranchaCorpo.jsx:116`). Atualizar via `ref`/rAF-throttle.
- **M11 — Termos clicáveis sem teclado:** `ProsaComTermos.jsx:66` — a interação
  central (extrair carta) é `<span onClick>` sem `role`/`tabIndex`/`onKeyDown`.
  Corrigível sem tocar as classes do contrato do `qa-ui`.
- **M12 — HTML inválido no mural:** `MuralAcusacao.jsx:~857` — `<span
  role="button">` (atalho "§") aninhado dentro de `<button>`.
- **M13 — Código morto confirmado (cadáver 3D):** `corpo3d/CorpoCanvas.jsx`,
  `CorpoModelo.jsx`, `HotspotCorpo.jsx`, `EfeitoGravura.jsx` (~440 linhas) —
  ninguém importa após o pivô Gabinete Ilustrado. O tree-shaking já os exclui do
  bundle; remover por higiene. (`PranchaCorpo.jsx` e `diorama/` estão vivos.)
- **M14 — Ficha atribui menções da vítima ao suspeito homônimo:**
  `fichaPessoa.js:88` casa por sobrenome isolado e "Arthurs" é vítima **e**
  suspeito no caso-escola — menções ao morto entram no dossiê de Walter.

---

## 4. Bundle e arranque

O chunk inicial tem **1,8 MB** (410 KB gzip) e a causa não é o three.js (que já
fica fora do arranque, no chunk do diorama, 820 KB): é **`src/data/casos_gerados.js`
(1,8 MB de fonte — os 31 casos embarcados)**, importado estaticamente por
`casos.js` → `App.jsx` no boot. O jogador do tutorial baixa os 31 casos gerados
antes da primeira tela.

- Oportunidade compatível com as regras (mesmo mecanismo já aceito para o
  diorama): `import()` dinâmico do banco de casos com estado "carregando" — corta
  ~85% do JS de arranque. Exige tocar a retomada síncrona de save/`?caso=` em
  `App.jsx` e testar as 3 rotas do `qa-ui` no mesmo commit.
- Menor: o comentário do `vite.config.js:15` ficou desatualizado (diz que
  `corpo3d/*` chega por import tardio; a prancha atual é estática e sem three), e
  o teto de 900 KB do aviso já não reflete o chunk real.
- Isso **substitui/amplia** o item §4.7 das pendências (que mirava só o three.js —
  já resolvido na prática).

## 5. Dependências

`npm audit`: 4 vulnerabilidades — `vite`≤6.4.2/esbuild (moderada, só dev server),
`uuid` via `@react-three/drei` (moderada, runtime de apresentação). Nenhuma toca a
lógica do jogo nem dados do jogador (jogo 100% client-side, zero rede em runtime).
Major updates disponíveis (React 19, Vite 8, Tailwind 4, zustand 5, drei 10) — **não
recomendo** atualizar agora: custo de migração alto, ganho nulo para o jogável.
Registrar para uma sessão de manutenção futura, quando o jogo estabilizar.

## 6. Baixos (inventário resumido)

Higiene sem urgência, para aproveitar quando o arquivo já estiver aberto:
`horasChegadaCena` morto no save (`jogo.js:66`); `escolherDeterministico` morto e o
padrão "variante por hash" reimplementado 4× (`hash.js:22`); `revisarAcusacao` sem
guarda de reentrância; `ev_telegrama` sem `interpolar`; "13h60" teórico em
`tempo.js:41`; `delegado_wycliffe` cravado em `resumoVisita.js:14`; `var
metodoFatalId` içado em `crime.js:823`; entradas inalcançáveis em
`PROFISSAO_PARA_MARCA` (`marcas_exigiveis.js:278`); rótulo técnico "Marca-espelho
esperada (sede)" chegando à UI (`pacote_gerado.js:1115`); `salDaSeed` copiado em 7
arquivos; funções >150 linhas no gerador (`simularBatalha` ~440, `resolverCrime`
~510, `gerarCasoBruto` ~455, `montarLocalidades` ~400); `qa.mjs` monólito de 4028
linhas; cursor sem cleanup no `Predio.jsx`; `key={op.rotulo}` fraca no
`InterrogatorioDialogo.jsx:197`; porta fixa 4173 no `qa-ui.mjs`.

---

## 7. Próximos passos propostos (em ordem)

1. **Lote-relâmpago "QA vermelho + horas"** (A1, A2, A3, M2 juntos — mesmo tema:
   hora de chegada): conserta o `qa-ui`, o diário e unifica a chegada no gerador;
   re-gera os casos; tudo verificável por `qa`/`qa-ui`. É o único lote que devolve
   o repositório ao estado "todas as verificações verdes".
2. **Lote "desfecho justo"** (M5, M6, M7, A4, M14): as costuras
   veredicto↔monólogo e as duas mutilações de texto na ficha — tocam o contrato
   de fair play do desfecho; prosa nova (se houver) passa pelo pipeline
   `revisar-prosa`.
3. **Lote "guardas de fair play no gerador"** (M1, M3, M4): decisão de design
   pequena no M1 (marca do método fatal ou iniciado?) + guardas novas no `qa.mjs`.
4. **Lote "higiene de apresentação"** (M8–M13 + baixos oportunos): performance do
   arrasto/lente, teclado nos termos, remoção do cadáver 3D morto.
5. **Sessão técnica opcional: arranque** (§4): split do `casos_gerados.js` —
   ganho grande de primeiro carregamento; exige cuidado com a retomada de save.
6. **Continuar a rota do `plano-de-sessoes.md`** — nada deste diagnóstico bloqueia
   S5 (balanceamento) nem as OSs pendentes; os lotes 1–2 acima merecem passar na
   frente por tocarem QA e fair play do desfecho.

Nenhuma correção foi aplicada neste diagnóstico; cada lote acima aguarda ordem
expressa.

---

## 8. Execução (ordem do usuário de 22/07: "prosseguir com todas")

- **Lote 1 executado** — commit "Lote 1 do diagnóstico" (A1, A2, A3, M2; casos
  re-gerados; build/qa/qa-ui verdes).
- **Lote 2 executado** — M5, M6, M7, A4, M14. Pipeline `revisar-prosa` rodado
  sobre as frases novas: zero bloqueantes; 3 ALTOS corrigidos (eco "Faltou a
  janela" ainda negava o gesto; dica gêmea do monólogo na mesma tela; variante
  irmã com o mesmo vício) + menores aplicados.
- **Pendências NOVAS de prosa registradas pelo pipeline** (fora do diff, decisão
  do usuário; candidatas a uma sessão de prosa dos ecos):
  1. `ecos_mestre.js` (`janela_sem_sustentacao`): "não a prendeu a carta alguma"
     descreve o gesto errado — esse código só dispara com cartas ligadas que
     CONTRADIZEM a janela (zero cartas cai em `sem_janela`).
  2. `ecos_mestre.js` (`nexo_acessorio`): "vestígio que não é do meio da morte"
     ≠ critério real (`pertenceA !== reuId` — pode casar com o meio e ser de
     terceiro).
  3. `ecos_mestre.js` (`reu_errado`): "o homem que o senhor levou ao banco" — o
     acusado pode ser mulher já no tutorial.
  4. `monologo.js`: frases de falha abrem majoritariamente com "Não…" — em
     desfecho com 3+ falhas, monotonia de abertura (guia §4.9).
