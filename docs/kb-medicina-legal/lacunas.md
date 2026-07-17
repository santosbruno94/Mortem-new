# Auditoria de lacunas — KB de medicina legal de MORTEM

> Comparação da KB existente (9 arquivos) com os índices dos tratados de época
> (Taylor, *Principles and Practice of Medical Jurisprudence*; Casper-Liman, *Handbuch*;
> Lacassagne). Mapa de lacunas temáticas relevantes a casos futuros — **só o mapa, não o
> conteúdo**. Cada lacuna: o que falta, onde caberia, por que importa. Ao final,
> divergências KB × conhecimento consolidado (sem propor mudar valores [MOTOR]).

## Cobertura atual da KB

Tanatologia (IPM), asfixias (5 espécies), venenos (4 espécies), traumas (contuso,
branca, fogo, reação vital, defesa), vestígios (fibras, cabelos, poeiras), protocolo de
exame, vocabulário, fontes. Base madura para **causa e tempo** da morte de adulto por
violência ou veneno. As lacunas abaixo são temas que os tratados cobrem e que o gerador
procedural de casos provavelmente pedirá.

## Lacunas priorizadas (até 10)

1. **Afogamento — capítulo próprio (não só a assinatura).** `asfixias.md` traz a espécie
   em cinco linhas. Taylor e Casper dedicam-lhe capítulo: submersão em vida × corpo
   lançado, maceração da pele (mãos de lavadeira) como relógio de imersão, espuma,
   distensão pulmonar. **Onde:** expandir seção em `asfixias.md`. **Por quê:** vila com
   rio/poço/tanque é cenário óbvio; o "morreu antes ou depois de cair n'água" é um belo
   nó de encenação.

2. **Queimaduras e morte pelo fogo.** Ausente. Taylor cobre graus de Dupuytren, reação
   vital em queimadura (vesículas com soro = vida), fuligem nas vias e carboxi-hemoglobina
   (cor rósea) como prova de que respirava nas chamas, corpo queimado para ocultar
   homicídio. **Onde:** arquivo novo `queimaduras-e-fogo.md` ou seção em `traumas.md`.
   **Por quê:** incêndio doloso para destruir cadáver é clássico; distinguir "morreu no
   fogo" de "queimado já morto" é puro MORTEM.

3. **Morte pelo frio (hipotermia).** Ausente. Conhecida na época: manchas vermelhas
   (Wischnewsky não, mas o eritema por frio sim), "paradoxical undressing", vulnerabilidade
   de bêbados e recém-nascidos. **Onde:** seção em `tanatologia.md` (interage com o algor!)
   ou arquivo curto. **Por quê:** outubro inglês, exposição noturna; e **complica o algor**
   — um corpo já frio à morte quebra a datação, tensão diegética rica.

4. **Infanticídio e morte de recém-nascido.** Ausente e delicado. Taylor/Casper dão
   capítulo extenso: docimasia pulmonar (o pulmão que flutua = respirou = nasceu vivo),
   maturidade fetal, cordão, o problema jurídico "nasceu vivo?". **Onde:** arquivo novo
   `infanticidio.md`. **Por quê:** crime doméstico vitoriano frequentíssimo; o teste da
   flutuação é uma mecânica de dedução autossuficiente e de época.

5. **Feridas por queda × golpe (contragolpe).** `traumas.md` tem trauma contuso, mas não
   a **discriminação queda/agressão**: distribuição das lesões (queda atinge saliências —
   cotovelo, occipício; agressão atinge zonas protegidas), fratura por contragolpe
   (contre-coup) no crânio, "hat-brim line". **Onde:** seção em `traumas.md`. **Por quê:**
   "caiu da escada ou foi empurrado/espancado?" é o coração de metade dos casos de dolo
   disfarçado de acidente.

6. **Sinais de identidade do corpo.** Ausente. Antes das digitais, identificava-se por
   estatura, dentes, cicatrizes, tatuagens, sinais de ofício, roupas; estimativa de idade
   e sexo pelo esqueleto; o sistema antropométrico de Bertillon (1880s, **de época**).
   **Onde:** arquivo novo `identificacao.md` ou seção em `vestigios.md`. **Por quê:** "de
   quem é o corpo?" é enredo inteiro; Bertillon é tecnologia legítima de 1893.

7. **Choque, hemorragia e a causa próxima da morte.** A KB dá o *mecanismo* (asfixia,
   veneno, trauma) mas pouco sobre a **causa imediata**: hemorragia fatal, choque
   traumático, embolia, sequência de eventos ("a facada não matou na hora; a hemorragia,
   horas depois"). **Onde:** seção em `traumas.md` ou `protocolo-exame.md`. **Por quê:**
   descola hora do golpe da hora da morte — ouro para álibis e para o relógio mole.

8. **Gases da putrefação e mortes tardias / exumação.** `tanatologia.md` §5 cita a mancha
   verde en passant. Falta o quadro de decomposição para IPM longo (adipocera, mumificação,
   fauna cadavérica — a entomologia de Mégnin é **de 1894**, no limite) e o valor da
   **exumação** (o arsênico persiste — já dito em `venenos.md`). **Onde:** expandir
   `tanatologia.md`. **Por quê:** caso de corpo achado semanas depois, ou reabertura por
   exumação, precisa desse relógio longo.

9. **Aborto criminoso e lesões dos órgãos internos femininos.** Ausente. Tema forense
   vitoriano recorrente (Taylor cobre): morte por manobra abortiva, sepse, perfuração.
   **Onde:** arquivo novo, ou seção em `infanticidio.md`. **Por quê:** crime de época com
   forte carga social; oferece móvel e rede de cumplicidade (parteira, boticário).

10. **Eletrocussão e raio — provável descartar; registrar a decisão.** Fulguração por raio
    (figuras de Lichtenberg) era conhecida; a eletrocussão industrial mal começava e não há
    rede elétrica na vila (ver `vocabulario-de-epoca.md`). **Onde:** nota em `traumas.md`.
    **Por quê:** listar para **excluir conscientemente** — evita que um caso futuro invente
    anacronismo elétrico.

## Cobertura acrescentada pela OS do confronto estendido (jul/2026)

A OS `docs/os-confronto-estendido.md` (Fases 1–2) fechou ou reduziu parte deste mapa:

- **Lacuna 1 (afogamento — capítulo próprio):** fechada. `asfixias.md` ganhou dossiê de
  método (submersão em vida × corpo lançado, mãos de lavadeira como relógio de imersão,
  espuma, distensão pulmonar).
- **Lacuna 5 (queda × golpe / contragolpe):** coberta pela via da **precipitação** —
  `traumas.md` ganhou a discriminação de queda de escada provocada × golpe, e a **capacidade
  de ação pós-lesão** e as **lesões de sítio posterior** (dinâmica do confronto).
- **Lacuna 7 (choque, hemorragia, causa próxima):** parcialmente coberta — `traumas.md`
  (capacidade de ação residual, exsanguinação progressiva) e a nota de **intervalo de
  sobrevida** em `tanatologia.md` §5 descolam a hora do golpe da hora da morte. O
  detalhamento clínico (choque traumático, embolia) segue aberto.
- **Aberto/revelado pela mesma OS:** o **láudano/opiáceo** como causa de runtime não está no
  catálogo do motor (só na KB — ver a decisão D1 da OS); e o **afogamento/precipitação como
  cena jogável** dependem de âncora espacial (água/escada) que a geração atual não modela
  (decisão D2). São lacunas de *motor/espaço*, não de KB.

## Cobertura acrescentada por `encenacao.md` e `supressao-de-vestigios.md` (jul/2026)

Os dois arquivos novos da KB fecham e engrossam este mapa:

- **Lacuna 2 (queimaduras e morte pelo fogo): fechada, pela via da encenação.** Não pelo arquivo
  dedicado que a lacuna sugeria, e sim pelo dossiê "corpo queimado (falso acidente de incêndio)"
  de `encenacao.md`: fuligem nas vias como prova de que respirava nas chamas, sangue cor de
  cereja (carboxi-hemoglobina) e sangue escuro se a morte foi anterior, queimadura sem halo
  eritematoso nem vesícula sobre cadáver, e a atitude de pugilista registrada como achado que
  **não prova nada** sobre vida ou morte. Cobre o que a lacuna pedia — distinguir "morreu no
  fogo" de "queimado já morto" — sob o ângulo do disfarce, que é o ângulo que MORTEM usa.
- **Novo, fora do mapa original:** `supressao-de-vestigios.md` cobre a limpeza e a queima de
  vestígios (não do corpo): os quatro reagentes de mancha de sangue (guaiaco de Van Deen, 1862;
  cristais de Teichmann, 1853; microespectroscopia de Sorby, 1865; azul da Prússia), a lacuna
  serológica sangue humano × animal (micrometria de Gulliver, 1875, prova de exclusão fraca; a
  precipitina de Uhlenhuth só chega em 1901), a datação grosseira da mancha por cor e
  solubilidade, e a supressão inocente (pudor, estigma do suicídio, reflexo da criada). É matéria
  que nenhuma das 10 lacunas acima nomeava à parte; complementa `vestigios.md` e dá a razão
  forense da cláusula §3.3 do gerador — limpar converte o óbvio em sutil, nunca em zero.

## Divergências / notas KB × conhecimento de época (sem tocar em [MOTOR])

- **Fusão incisa/perfurante** — já registrada honestamente em `traumas.md` (§ Divergências).
  Confirmo que Taylor as separa; a KB o reconhece. Sem ação; decisão do usuário.
- **Algor a 1 °C/h [MOTOR]** — a KB já anota o platô inicial e a não-linearidade. Fiel ao
  uso de campo da época; a lacuna 3 (frio) e a lacuna 7 (causa tardia) *interagem* com esse
  valor sem exigir alterá-lo. Apontado, não corrigido.
- **Ptomaínas** (`venenos.md`) — bem tratadas; se a lacuna 8 (putrefação) for expandida,
  convém referência cruzada, pois o alcaloide cadavérico nasce ali.
- **Docimasia pulmonar** (lacuna 4) — teste de época sólido (século XVIII), mas com reservas
  conhecidas já em 1893 (pulmão pode flutuar por putrefação, ou afundar em respiração
  débil); se entrar, registrar a reserva como a KB faz com Tardieu e ptomaínas.

**Prioridade sugerida ao usuário:** 1 (afogamento) e 5 (queda × golpe) rendem mais jogo com
menos texto novo, encaixam em arquivos existentes e casam com a mecânica de encenação já
central em MORTEM. 4 (infanticídio) e 6 (identificação) abrem *tipos de caso* inteiros, mas
pedem arquivo próprio.
