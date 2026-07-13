# MORTEM — Guia de Estilo da Prosa

> Norma obrigatória para TODO texto do jogo: prosa de localidade, cartas (`textoDisplay`,
> `carimboPadrao`, `descricao`, `vozMestre`), abertura, glossário, monólogo, falas de
> personagem, strings de interface. Quem escreve, lê este guia antes; quem revisa, cobra
> por ele. Os exemplos "antes" vêm do próprio repositório (estado de jun/2026).

---

## 1. A norma de língua: PT-BR literário de época

O português de MORTEM é o **português brasileiro culto, com sabor oitocentista** — o
registro das boas traduções brasileiras de Conan Doyle e Machado de Assis lido em voz
alta. A época entra pela sintaxe levemente formal, pelo vocabulário e pelos objetos,
nunca pelo pastiche.

**Colocação pronominal.** Próclise e ênclise seguem a norma culta brasileira:

- Ênclise em início de oração e após pausa: *"Recolhi-me às nove."* ✓
- Próclise com partícula atratora (negação, pronome relativo, conjunção subordinativa):
  *"não me fizeram chorar"*, *"que se recolheu"*. ✓
- **Proibido** misturar registros na mesma boca: um personagem não diz *"Recolhi-me às
  nove"* numa cena e *"o senhor não vai me fazer chorar"* com sabor coloquial na outra.
  Na dúvida, formalize: *"o senhor não me fará chorar"*.
- Mesóclise (*"dir-lhe-ei"*): **não usar**. Soa a paródia.

**Tratamentos de 1893.** *O senhor / a senhora* entre adultos que não se conhecem;
*{detective.title} {detective.surname}* em contexto formal; criados tratam patrões por
*o patrão, o Sr. Arthurs*; o delegado trata o perito por *{detective.title}*. Ninguém se
tuteia. "Você" só na boca de personagem de baixa extração, e com parcimônia.

**Léxico.** Preferir o termo de época quando existir sem custo de clareza: *lampião,
castiçal, soberano (moeda), xelim, cambraia, escrevente, libelo, diligência*. **Proibido**
anacronismo: *ok, checar, estresse, time, chance* (no sentido de oportunidade), gírias
modernas. **Proibido** também o falso arcaísmo: palavras que ninguém entende sem
glossário ficam no Glossário Forense, não na prosa.

**Estrangeirismos e castelhanismos.** Só entra palavra estrangeira com função (nomes
próprios ingleses, *pub*). Cuidado com falsos cognatos: *pareja* é espanhol — em
português, *parelha* (e, para sulco de ligadura, prefira *uniforme, de profundidade
constante*).

**Ortografia**: Acordo de 1990, como o restante do repo. Nada de grafia arcaizante
(*pharmacia*) — a época está na frase, não na letra.

---

## 2. A regra de ouro: observação pura, dedução zero

O pilar de design nº 2 do jogo diz: **"O jogo nunca entrega conclusões."** A prosa
serve a esse pilar ou o trai. Regra dura:

**O narrador e as cartas descrevem apenas o observável** — o que uma lente, um
termômetro, um par de olhos e um nariz alcançam. **Toda inferência pertence ao
jogador.**

### 2.1 O que o narrador PODE

- Registrar fatos físicos com precisão sensorial: posição, cor, cheiro, textura,
  temperatura, som.
- Registrar o que personagens **dizem e fazem** (inclusive tiques: mãos que tremem,
  olhar que foge) — sem traduzir o que significam.
- Justapor fatos **sem conectá-los**: dizer que as gavetas estão abertas E que a caixa
  de soberanos está intacta é observação; dizer que "quem revirou desprezou os valores"
  já é tese.

### 2.2 O que o narrador NÃO PODE

- **Concluir**: motivo, autoria, encenação, pressa, hesitação de quem não está em cena.
- **Apontar**: sinalizar que um detalhe é pista ("guarde isso", "curioso", "estranho",
  "limpo demais").
- **Adjetivar juízo**: *hesitante, estudado, forjado, conveniente, suspeito* — adjetivos
  que embutem veredicto sobre intenção.
- **Estranhar pelo jogador**: "contam uma história curiosa" é o narrador cutucando com
  o cotovelo.

### 2.3 Antes / depois (exemplos do repo)

| Antes (dedução vazada) | Depois (observação pura) |
|---|---|
| "Os riscos são rasos, hesitantes, de quem não tinha pressa — ou não precisava entrar." | "Os riscos na madeira são rasos e curtos, e param onde a lingueta cede." |
| "Limpo demais para ser do morto; deixado às pressas." | "O linho está limpo; a cambraia, sem marca de uso." |
| "esquecido com pressa por quem não morava ali" | (cortar — o lenço, o lugar e as iniciais bastam) |
| "As gavetas contam uma história curiosa: quem as revirou desprezou o relógio de ouro…" | "Gavetas abertas, papéis pelo assoalho. O relógio de ouro segue na corrente do morto; a caixa de soberanos, fechada sobre a escrivaninha." |

### 2.4 O mestre/legista: leitura técnica, nunca dedo apontado

A `vozMestre` e a `falaDoMestre` têm licença **técnica**, não **detetivesca**. O mestre
pode traduzir um sinal em leitura forense (é o papel dele no tutorial); não pode fazer o
trabalho dedutivo do jogador.

**Pode:** janela de horas ("isto é de doze a vinte e quatro horas"), família e assinatura
do catálogo ("sulco horizontal é de ligadura; o oblíquo, de enforcamento"), estado do
sinal ("os livores já não cedem").

**Não pode:** apontar pista ("guarde isso"), concluir autoria ("por mãos alheias", "isto
não foi acidente"), ligar vestígio a suspeito, declarar encenação, mandar o jogador
olhar algo.

Nota fina: o catálogo distingue ligadura de enforcamento — dizer "ligadura" é leitura
técnica legítima. A diferença está em **como** se diz: *"o sulco horizontal é de
ligadura"* (técnico) ≠ *"alguém o estrangulou por trás"* (dedução dramatizada).

---

## 3. Dosagem de brilho: a frase de efeito é racionada

O texto anterior gastava um epigrama por parágrafo; o efeito era de máquina de máximas.
Regra nova:

- **No máximo UMA frase de efeito por cena** (localidade, passo de abertura, bloco de
  monólogo) — e de preferência nenhuma.
- Ela deve ter **função dramática**: fecho de ato, virada, primeira impressão de um
  personagem. Nunca decoração de parágrafo.
- Se duas candidatas disputam a cena, corte a mais bonita. A que sobra passa a valer.
- O restante da prosa é **contida e sensorial**: substantivo concreto, verbo exato,
  adjetivo raro e físico.

Teste prático: leia a cena em voz alta. Se duas frases pedem pausa para aplauso, uma
delas sai.

---

## 4. Anti-padrões formais (proibições)

Detalhados na skill `.claude/skills/anti-padrao-ia/` — resumo das proibições:

1. **A fórmula "não X — é Y"** (negação + travessão + inversão) e suas irmãs
   ("nem uma lágrima — apenas…", "algo que não é luto"): **máximo uma por arquivo**, e
   apenas se nenhuma vizinha existir. No texto antigo havia dezenas.
2. **Epigrama de fecho obrigatório**: parágrafo pode (e deve) terminar em fato.
3. **Tríades reflexas** ("a lente, o termômetro, a caderneta"): listas de três só quando
   os três itens importam; varie o ritmo com listas de dois e de quatro.
4. **Travessão como muleta**: o travessão é sinal raro de quebra real de pensamento.
   Teto de referência: ~1 travessão a cada 2 parágrafos. Prefira ponto, vírgula,
   dois-pontos.
5. **Metáfora encadeada de máxima** ("laudo sem cadáver é boato com selo"): no monólogo,
   no máximo uma máxima por desfecho, no fecho — e da voz do perito, não do almanaque.
6. **Simetria sintática em série**: períodos consecutivos com a mesma armação
   (sujeito–verbo–ironia final) denunciam gerador. Varie comprimento e ordem.
7. **Ecos temáticos on the nose**: personagem usando metáfora do mecanismo do crime
   ("me estrangulava de juros" num caso de estrangulamento) — proibido, salvo decisão
   deliberada e única de design.

---

## 5. As camadas de texto e o papel de cada uma

Cada informação aparece com textura própria em cada camada — **nunca copiar frase entre
camadas**:

| Camada | Papel | Registro |
|---|---|---|
| Prosa de localidade | O que se vê ao chegar; ambienta e contém os negritos `[[id]]` | Narrador: terceira pessoa, presente, sensorial |
| `textoDisplay` | Nome da carta na mesa: substantivo concreto, olhar leigo | Curto (2–6 palavras), capitalização de título |
| `carimboPadrao` | Rótulo interno/arquivo: telegráfico, de fichário | Sem verbo conjugado; frase nominal |
| `descricao` (carta) | **Exame próximo**: o detalhe que só aparece com a carta na mão — acrescenta, não repete a localidade | 1–3 frases, laudo sensorial |
| `vozMestre` | Leitura técnica falada (ver §2.4) | Oral, direta, de professor a aprendiz |
| Glossário | Referência de época | Laudo técnico impessoal, sem graça nem juízo |
| Monólogo | O perito pensa alto ao fim | Primeira pessoa, sóbria; ver §3 e §4.5 |

**Interpolação**: `{detective.title}`, `{detective.surname}`, `{g:masculino|feminino}`.
Toda `{g:…}` deve ter os dois lados **diferentes** (se são iguais, não é interpolação).
Os marcadores `[[id_da_carta]]` são estruturais: a reescrita os mantém intactos e o
texto ao redor deve fluir com o `textoDisplay` da carta no lugar deles.

---

## 6. Continuidade é prosa também

Num jogo que pune o jogador por não cruzar horários, o texto não pode falhar nos
próprios. Toda peça nova de prosa se verifica contra:

- **O calendário real**: o caso corre em 13–14/out/1893 — **sexta-feira e sábado**.
  (13/out/1893 caiu numa sexta.)
- **A escala absoluta de tempo** (`src/data/seed.js`): morte às 21h de 13/out (hora
  −3); chegada às 11h de 14/out (hora 11).
- **O mapa** (`src/data/mapa.js`): Moorford fica a **hora e meia** de estrada por
  trecho (3h ida e volta); dentro da vila, 1 hora. Este número é amarrado à lógica do
  caso (o álibi de Walter em Moorford e o gabinete do procurador Pettigrew dependem
  dessa distância).
- **Nomes, idades e relações** da seed.

Qualquer número citado em fala ou prosa (hora, distância, soma, idade) precisa de fonte
num arquivo de dados — ou não se cita.

---

## 7. Checklist de autorrevisão (antes de submeter prosa)

1. Alguma frase **conclui ou aponta** algo que o jogador devia deduzir? (§2)
2. Os dois lados de cada `{g:…}` diferem? Os `[[id]]` estão intactos?
3. Contei as frases de efeito da cena? (≤ 1) Os travessões? (§4.4)
4. Há "não X — é Y" ou eco de fórmula em frases vizinhas?
5. Cada personagem soa como **ele** (conferir `docs/biblia-de-vozes.md`)?
6. Horas, dias da semana e distâncias batem com seed e mapa? (§6)
7. Termos técnicos batem com `docs/kb-medicina-legal/`?
8. Li em voz alta: onde tropecei, reescrevi?
