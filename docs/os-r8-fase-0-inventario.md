# OS-R8 · Fase 0 — O inventário de texto e o contrato do QA

A Fase 0 das três OS anteriores mediu jogo (quantos gestos, quantas bocas, quantos
perfis). Esta mede **texto**: por arquivo, cada item da fila do §3 com a linha exata, e
o que o `qa.mjs` / `qa-ui.mjs` toca nele.

A razão é a do §4 da OS: **numa OS que não inventa nada, a única maneira de quebrar
alguma coisa é mexer numa string que o QA clica.** Medir isso primeiro é, aqui, o
equivalente da telemetria.

---

## 1. A fila, por arquivo e por linha

| Item (§) | Arquivo : linha | String de hoje | O que o QA toca nela |
|---|---|---|---|
| 3.1 título | `src/components/MuralAcusacao.jsx:47` | `III · As Mentiras` | **nada** |
| 3.1 subtítulo | `src/components/MuralAcusacao.jsx:47` | `depoimentos desmentidos` | **nada** |
| 3.1 revisão | `src/components/mural/RevisaoFinal.jsx:47` | `Mentiras` e `— nenhuma mentira exposta —` | **nada** |
| 3.2 rótulo | `src/data/localidades.js:146` | `O púlpito de ordens` | **nada** |
| 3.2 prosa | `src/data/localidades.js:148` | `um púlpito de escrever forrado de cortiça gasta` | **nada** |
| 3.2 desenho | `MORTEM_CONTEXTO.md:380` | `o púlpito de ordens` | — (documento) |
| 3.3 rubrica | `src/data/dialogos.js` (8 sítios, §2 abaixo) | rubricas repetidas verbatim | **nada** |
| 3.3 colisão | `src/data/dialogos.js:187` | `hoje a bancada amanheceu sem lume` | **nada** |
| 3.4 nervuras | `src/data/cartas.js:248` | `ainda com o vinco das nervuras` | **nada** |
| 3.4 nervuras | `src/data/intervencoes.js:127` | `com o vinco das nervuras` | **nada** |
| 3.4 bíblia | `docs/biblia-de-vozes.md:226` | `procurada outra vez antes do meio-dia` | — (documento) |
| 3.4-bis KB | `docs/kb-medicina-legal/supressao-de-vestigios.md:197-200` | o leito alto ancorado em «uma hora» | — (documento) |

**Nenhum item da fila é lido por asserção de QA.** Confirmado por leitura, não por
memória, como o §3.1 da OS exige.

### O que passa PERTO e é intocável

O risco não está nas strings da fila: está nas vizinhas, na mesma tabela e no mesmo
arquivo.

| Arquivo : linha | String | Quem a cobra |
|---|---|---|
| `MuralAcusacao.jsx:48` | `IV · O Móbil` | `qa-ui.mjs:851` (o mural reaberto abre na pendência) |
| `MuralAcusacao.jsx:220` | `paradeiro(s) desmentido(s)` | `qa-ui.mjs:717` (a Estação III recolhida conta as duas espécies) |
| `MuralAcusacao.jsx:255` | `Levar a julgamento` | `qa-ui.mjs:330` |
| `RevisaoFinal.jsx:84` | `Confirmar e julgar` | `qa-ui.mjs:332` |
| `RevisaoFinal.jsx:103` | `Selar assim mesmo` | `qa-ui.mjs:334` |

A linha 47 do `MuralAcusacao.jsx` fica **imediatamente acima** de uma string do
contrato, e a linha 47 do `RevisaoFinal.jsx` a trinta e sete linhas de duas outras. É
o único perigo real da Fase 1, e é de edição, não de desenho.

**Os pontos de interesse não se abrem por rótulo.** O `abrirPontos` do `qa-ui`
(linhas 183–193) varre `.ponto-interesse` por classe e por `aria-expanded`; nenhuma
asserção lê o texto do rótulo. O `qa.mjs` menciona o púlpito num comentário
(linha 241) e opera por **id de carta** (`ev_livro_ordens`, `ev_livro_pagamentos`).

> **Divergência com a própria OS, e é a favor:** o §3.2 e o prompt de arranque dizem
> que mexer no rótulo do ponto **toca** o `qa-ui`. Contra a árvore real, **não toca** —
> nem o rótulo, nem a prosa. A regra do `CLAUDE.md` continua a valer como
> procedimento (conferir antes de mexer); o que cai é o custo suposto da Fase 2.

---

## 2. A GR8-4 medida: a fila era de um, e é de oito

O §3.3 herdou do pipeline da R6 **uma** rubrica repetida (o colete de Walter, em duas
telas). A GR8-4, porém, está escrita como guarda geral: *nenhuma rubrica de diálogo se
repete verbatim na mesma árvore.* Medida contra as cinco árvores do caso-escola —
narração fora das aspas, frases de mais de doze caracteres — a conta é outra:

| Árvore | Rubrica repetida | Nós |
|---|---|---|
| `interrogatorio_silas` | `As mãos não deixam os joelhos.` | `b2_firme:256` · `b3_obliquo:304` · `evasiva:333` |
| `interrogatorio_silas` | `As mãos seguem sobre os joelhos.` | `b2_obliquo:274` · `b3_firme:283` · `confronto_livro:321` |
| `moinho` | `Encolhe o ombro que carrega a saca.` | `b1_obliquo:567` · `b3_obliquo:631` |
| `moinho` | `Enxuga a testa com as costas da mão.` | `b2_cordial:586` · `b3_cordial:617` |
| `dialogo_walter` | `O botão do colete para entre os dedos.` | `b1_firme:698` · `b3_firme:773` |
| `dialogo_walter` | `Conta pelos dedos, como quem alinha uma fatura.` | `b1_tecnico:720` · `b3_tecnico:787` |
| `dialogo_walter` | `Puxa o colete para baixo, como quem se compõe para retrato.` | `b2_firme:745` · `confronto_testamento:830` |
| `dialogo_walter` | `O polegar corre a barba por fazer.` | `b2_cordial:751` · `b3_cordial:780` |

**Oito, e todas em nós CO-ALCANÇÁVEIS.** A conversa desce um beat por vez (um `b1`,
um `b2`, um `b3`) e os confrontos correm por canal lateral na mesma sessão — logo cada
par acima é **legível de seguida por um jogador só**, na trilha do tom respetivo. Não
é smell de autor: é repetição que se lê em jogo.

**Uma exceção, e é fair play, não defeito.** `E dá o paradeiro: [[alibi_walter]].`
aparece em `b1_firme:698` e `b1_obliquo:731` — **dois nós do mesmo beat**, alternativas
mutuamente exclusivas. Que o paradeiro saia com a mesma redação em qualquer tom é o
que a G4 (solubilidade) e o padrão da S1 exigem: o tom não muda o que ele declara. A
guarda tem de isentar nós do mesmo beat, ou passa a cobrar o contrário do desenho.

`papelaria` (Agnes) e `dialogo_davey` saem **limpas**: zero repetições.

---

## 3. A colisão do lume, medida contra a abertura

| Fonte | Linha | O que diz |
|---|---|---|
| `src/data/abertura.js:40` | passo 1 | «Na manhã de sábado é Silas Crane... **acende o fogo da bancada** e põe-se ao serviço na oficina, como faz todas as manhãs.» |
| `src/data/dialogos.js:187` | abertura do interrogatório | «Acendia eu o fogo mal abria a loja... hoje **a bancada amanheceu sem lume**.» |

A abertura é a **fonte de código** que o jogador lê primeiro, e o perito chega às
13h de sábado — depois de o fogo estar aceso há horas. A fala nega o que a abertura
mostrou. O que ela quer dizer (o mestre não desceu ao cheiro do carvão) sobrevive
sem negar o fogo.

---

## 4. Três itens que a fila do §3 não tem, e a triagem de cada um

O `docs/pendencias-status.md` roteia para a R8 dois itens do playtest que o §3 **não
lista**, e o `localidades.js` guarda um terceiro no comentário. Ficam triados aqui
para a ata os poder fechar em vez de os herdar por inércia:

- **Item 11 — «exposição contida no próprio diálogo» → já satisfeito, verificado.**
  Executado na S1 (19/07) sobre o derivador: o `textoDisplay` das cartas de álibi
  deixou o título opaco e passou a carregar lugar + faixa, **espelhando o idioma que o
  caso-escola já tinha** (`Recolhido à Estalagem às Oito`). Nada a fazer no
  caso-escola; o item fecha por verificação.
- **Item 10 — «ler a transcrição completa da carta amassada» → não é editorial.** A
  S2 aprovou-o como «lote pequeno de UI» (QOL de leitura, não fair play). Exige
  componente novo e prosa nova de transcrição; num passe de acabamento seria feature
  sem ordem expressa. **Sai da R8 e vai para lote de UI.**
- **`porta_beco` (`localidades.js:166`) → idem.** A R2 registou-a «aberta para o passe
  editorial», mas dar-lhe sala custa prosa nova, sala clicável na planta e contrato de
  `qa-ui`. **Não é acabamento.**

---

## 5. O que esta medida diz à execução

1. **A Fase 2 é mais barata do que a OS supôs** — nenhum contrato de QA a atravessa.
2. **A Fase 3 é maior do que a OS supôs**, e o número saiu de uma guarda, não de uma
   leitura: oito rubricas, não uma. A guarda que a Fase 3 escrever tem de isentar nós
   do mesmo beat, ou reprova o fair play do paradeiro.
3. **A Fase 1 é de bisturi:** as duas linhas a mexer têm vizinhas do contrato à
   distância de uma linha.
4. **Nenhum item da fila obriga a tocar em `src/logic`.** Confirmado: nem os rótulos
   (camada visual), nem as rubricas (camada narrativa), nem as cartas (prosa).
