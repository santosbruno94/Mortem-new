---
name: anti-padrao-ia
description: Detectar e eliminar anti-padrões de texto gerado por IA na prosa de MORTEM (fórmulas retóricas repetidas, aforismo em série, travessão como muleta, voz uniforme). Usar SEMPRE antes de submeter prosa nova e ao revisar prosa existente.
---

# Anti-padrões de IA na prosa

Texto gerado por IA tem tiques estatísticos: figuras que, uma a uma, são boas — e por
isso o modelo as repete até virarem papel de parede. Esta skill cataloga os tiques já
encontrados NESTE repositório, ensina a detectá-los (inclusive por grep) e a
reescrevê-los. A norma-mãe é `docs/guia-de-estilo.md` (§3 e §4).

## O princípio

O anti-padrão nunca é a frase — é a **frequência**. Uma antítese elegante é estilo;
doze são um gerador. Por isso a detecção é sempre **quantitativa** (contar ocorrências
por cena/arquivo) e a correção é sempre **seletiva** (manter a melhor, reescrever as
outras como fato plano).

## Catálogo (com exemplos reais do repo, estado jun/2026)

### 1. Negação + travessão + inversão ("não X — é Y")
A assinatura mais frequente. Variantes: "nem X — apenas Y", "X que não é Y".

> "Nada nele hesita — nem o luto." · "Algo nela treme que não é luto." ·
> "nem uma lágrima — apenas [[comp_hudson]]" · "Não é de forca — é de laço" ·
> "ri sem alegria" · "cortesia morna de quem nada tem a esconder"

**Detecção:** `grep -nE 'não [^.]{3,40} — |nem [^.]{3,40} — |que não é ' src/data/*.js src/logic/*.js`
e contar. **Teto: 1 por arquivo.**
**Reescrita:** afirme o fato positivo e deixe a ausência falar sozinha: *"Nada nele
hesita — nem o luto"* → *"Responde sem pausa, o luto engomado como o colarinho"* — ou
simplesmente descreva o gesto e corte o comentário.

### 2. Epigrama de fecho obrigatório
Todo parágrafo/cena terminando em frase de efeito, máxima ou ironia.

> "até as moscas parecem aguardar licença" · "como quem põe flores num túmulo" ·
> "Briarstone não tem segredos — tem gavetas." · "a perícia é {g:sua|sua}."

**Detecção:** ler só a ÚLTIMA frase de cada parágrafo do arquivo, em sequência. Se três
seguidas "pedem aplauso", é o padrão.
**Reescrita:** feche em fato concreto ou em gesto. O parágrafo que termina em "a caixa
de soberanos, fechada sobre a escrivaninha" confia no leitor.

### 3. Corrente de máximas (fortune cookie)
Máximas genéricas encadeadas, típicas de texto de template.

> "laudo sem cadáver é boato com selo" · "acusar sem o meio é apontar sem dedo" ·
> "a certeza mais firme morre na soleira" · "a forca de um inocente tem dois carrascos"
> (todas em sequência no mesmo monólogo)

**Detecção:** frases sem sujeito concreto da cena (nenhum nome, nenhum objeto do caso)
que enunciam verdade geral. Contar por bloco de saída.
**Teto:** 1 máxima por desfecho de monólogo, posicionada no fecho.
**Reescrita:** converta a máxima em constatação específica do caso: *"acusar sem o meio
é apontar sem dedo"* → *"Afirmei que Edgar matou; não soube dizer com o quê."*

### 4. Travessão como muleta rítmica
**Detecção:** `grep -o '—' <arquivo> | wc -l` ÷ número de parágrafos. Acima de ~0,5
travessão/parágrafo, revisar.
**Reescrita:** substituir por ponto (duas frases), dois-pontos (aposto explicativo) ou
vírgula. O travessão sobrevive apenas onde há quebra real de pensamento.

### 5. Tríades reflexas
Listas de três como ritmo default: "a lente, o termômetro, a caderneta"; "a igreja, a
taverna, a relojoaria".
**Detecção:** `grep -nE '(, [a-zà-ú]+ ?){2,} e [a-zà-ú]' —` e olho humano.
**Reescrita:** quando os itens importam, mantenha; quando são cadência, corte para dois
ou estenda com detalhe desigual (um item ganha oração própria).

### 6. Simetria sintática em série
Períodos consecutivos com a mesma armação (mesma ordem, mesmo comprimento, ironia no
mesmo lugar).
**Detecção:** ler 3 períodos seguidos em voz alta; se a melodia é idêntica, é o padrão.
**Reescrita:** variar comprimento (uma frase de 4 palavras ao lado de uma de 20),
começar pelo adjunto, quebrar com diálogo ou gesto.

### 7. Voz uniforme (todos falam como o autor)
Delegado, taverneiro, governanta e narrador produzindo a mesma retórica de aforismo.
**Detecção:** cubra o nome do falante e leia a fala. Se não dá para adivinhar quem é,
falhou. Conferir `docs/biblia-de-vozes.md`.
**Reescrita:** aplicar o idioleto do personagem (registro, comprimento de frase, tique).

### 8. Eco temático on the nose
Metáfora que repete o mecanismo do crime na boca de quem não deveria saber dele.
> "Ele me estrangulava de juros" (num caso de estrangulamento)
**Reescrita:** trocar o campo semântico da metáfora — ou tirar a metáfora.

### 9. Dedução vazada (anti-padrão de DESIGN, o mais grave)
O narrador/carta concluindo pelo jogador. Não é tique de IA, mas anda junto: o modelo
quer "ajudar" e entrega a inferência.
> "de quem não tinha pressa — ou não precisava entrar" · "Limpo demais para ser do
> morto" · "guarde isso"
**Detecção:** procurar verbos/advérbios de juízo: `grep -nE 'demais|hesitante|estudad|decorad|conveniente|curios|estranh|forjad|encenad|às pressas|sem pressa' src/data/*.js`
(na camada narrativa; nas `tagsOcultas` pode).
**Reescrita:** guia de estilo §2 — reduzir ao observável, justapor sem conectar.

## Procedimento de revisão

1. Rodar os greps do catálogo sobre os arquivos-alvo; anotar contagens.
2. Ler cada arquivo inteiro UMA vez só caçando um padrão por passada (a leitura
   monotemática enxerga o que a leitura corrida perdoa).
3. Para cada ocorrência acima do teto: propor reescrita mínima (a cirurgia preserva a
   informação e o tom; não "melhora" o que não está no diagnóstico).
4. Emitir parecer: padrão → ocorrências → teto → reescritas propostas.
5. Após aplicar: rodar os greps de novo e comparar contagens (métrica objetiva
   antes/depois).

## Regra final

Na dúvida entre a frase brilhante e a frase exata, MORTEM fica com a exata. O jogo é
sobre um perito que não se permite concluir além da evidência; a prosa imita o método.
