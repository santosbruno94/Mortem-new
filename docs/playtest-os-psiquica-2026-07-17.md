# Playtest da OS "Camada psíquica do elenco" — 17/07/2026

> Verificação da Fase 5 contra o protocolo de fair play do §8.5 da OS
> (`docs/os-camada-psiquica-do-elenco.md`). Executado por agente: itens mecânicos
> verificados por script e QA; o playtest de MESA (jogar um caso do pool no navegador e
> sentir a armadilha) fica anotado para o dono do projeto — é juízo de jogo, não de
> máquina.

## O que o §8.5 exige, e o que se verificou

### (a) O falso-destoante existe e engana

- **Existe: 20/20** casos do pool (e 50/50 seeds do teste anti-tell do `qa.mjs`) têm
  ≥ 1 não-assassino com desencaixe ≥ T, além do réu sempre com desencaixe ≥ T — o
  desencaixe nunca aponta sozinho para o culpado.
- **Engana: 11/20** casos do pool têm o falso-destoante como portador do PRIMEIRO
  segredo (`inocente_segredo` + móbil-isca `gen_movel_*`): ele mente o paradeiro, deixa
  rastro na cena e tem móbil lavrado na delegacia — a armadilha completa do "mentiu,
  logo matou". Nos 9 restantes, o destoante não era elegível ao segredo pelas regras
  existentes (fora da lista de 5 suspeitos, testemunha de carta ou com a cena por
  rotina) e o sorteio anterior valeu — conforme a spec (§8.3.4: preferência "quando
  elegível", jamais quebra das regras do montador).
- Exemplo (comarca_1): réu `gen_1_boticario` (desencaixe forçado, vetor no log de
  build); falso-destoante `gen_5_criada` — é dela o bilhete na cena E o móbil na
  delegacia; quem condenar pela pilha dela comete o Erro Judiciário.

### (b) Nenhuma superfície nomeia rótulo

- Guarda de não-vazamento no `qa.mjs` (verde): pacotes embarcados sem L1 em campo
  algum; sem L2 (`sombra`/`persona`/`vetor`/`desencaixe`/`complexo`) nem `psique` em
  chave ou id.
- Lint L1/L2 sobre o código vivo de `src/data`, `src/logic`, `src/store`,
  `src/components` (verde). A guarda L2 provou-se na primeira execução: acusou
  `hexParaVetor` (helper de cor 3D), renomeado `hexParaVec3` no mesmo commit.
- `qa-ui.mjs` (verde): "nenhum id interno vazou para a tela" nas 3 rotas + rota gerada.

### (c) A mentira do inocente distingue-se da do culpado só por materialidade

- Guarda FASE 6 (verde) sobre o pool REGENERADO: os 4 perfis produzem os 4 desfechos —
  o Metódico crava o réu real (Vitória Absoluta: janela + causa + nexo); o Apressado,
  que condena o dono do móbil-isca pela mentira, colhe Erro Judiciário.
- O veredicto segue cego à psique: as funções de lógica leem somente `tagsOcultas` +
  seed (guardas de cegueira inalteradas e verdes); flag de diálogo nenhuma entra no
  motor.

## Regeneração e prosa

- `src/data/casos_gerados.js` regenerado no commit da Fase 3 (precedente da OS de
  lapidação: correção na fonte + `gerar:casos` no mesmo commit, QA byte a byte verde em
  todo commit). O pool manteve as MESMAS 20 seeds válidas; mudou apenas o portador do
  segredo onde o falso-destoante era elegível.
- **Nenhuma prosa nova foi escrita** nesta OS: as cartas de segredo/móbil-isca usam os
  templates já lapidados (OS de 16/07), apenas com outro portador interpolado — o
  pipeline `revisar-prosa` não era exigível; o `lint-prosa` (embutido no QA) segue
  verde.

## Pendências para o dono (juízo de mesa, não de máquina)

1. Jogar 1–2 casos do pool (ex.: `comarca_1`, em que a criada destoante carrega a isca
   completa) e sentir se a armadilha engana sem frustrar.
2. As flags compiladas (`acusa_com_fervor`, `omite_por_decoro`, `mente_com_calma`,
   `gatilho_de_complexo:<tema>`) estão no caso bruto, mas ainda não têm CONSUMO no
   diálogo gerado — a realização (falas que vazam projeção, o gatilho que desmonta a
   compostura) é a OS seguinte natural, junto com a realização física dos pools de
   encenação (§8.4, válvula do §7).
