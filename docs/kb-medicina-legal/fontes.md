# Fontes — a medicina legal disponível a um perito de 1893

> As obras e autores que definem o horizonte de conhecimento do jogo. MORTEM se passa
> em 1893: o que estes tratados sabiam, o perito sabe; o que veio depois, ele ignora.
> Esta lista fixa esse horizonte e serve de âncora aos números da base.

## Tratados de referência (o cânone da época)

**Alfred Swaine Taylor — *Principles and Practice of Medical Jurisprudence***
O tratado de língua inglesa da medicina legal vitoriana. Taylor (1806–1880) foi o pai
da disciplina na Inglaterra; sua obra teve edições sucessivas ao longo do século, e a
edição da década de 1890 (com revisões póstumas) era o manual em uso quando o jogo se
passa. Cobre tanatologia, asfixias, feridas, toxicologia e a prática do testemunho
pericial. É a referência primária de tudo o que envolve o **exame do corpo** e a
**toxicologia** no jogo.
*(Confirmado: uma edição americana revista de Taylor circulava em 1893.)*

**Johann Ludwig Casper — *Handbook of the Practice of Forensic Medicine***
A escola alemã, traduzida e influente na Grã-Bretanha. Casper sistematizou a
observação tanatológica — em especial a cronologia dos fenômenos cadavéricos — com o
rigor de quem baseava tudo em séries de necrópsias. Âncora da **datação da morte**
(rigor, livor, algor) e da distinção entre lesões vitais e post-mortem.

**Alexandre Lacassagne — a escola de Lyon**
Lacassagne (1843–1924) conduziu milhares de autópsias e fundou a criminologia
científica francesa. Contemporâneo vivo e atuante em 1893. Contribuições que o jogo
usa: a **reconstituição da cena**, a leitura da **encenação** e da incongruência entre
cena e corpo, e o cuidado com vestígios e a posição do cadáver. É o espírito da
mecânica de "desconfie da cena arrumada".

## Marcos técnicos e suas datas (o que existe e o que não em 1893)

| Técnica | Data | Disponível em 1893? |
|---|---|---|
| Teste de Marsh (arsênico) | 1836 | **Sim** — método toxicológico corrente |
| Sistema de datação por fenômenos cadavéricos | séc. XIX | **Sim** — Casper, Taylor |
| Reconstituição de cena / criminologia | 1880s | **Sim** — Lacassagne |
| Impressões digitais (Galton) | 1892 | Recém-publicado; **quase sem uso policial** |
| Sistema dactiloscópico (Henry) | ~1897–1900 | **Não** |
| Grupos sanguíneos ABO (Landsteiner) | 1901 | **Não** |
| Raios-X (Röntgen) | 1895 | **Não** |
| Princípio de troca (Locard) | ~1910 | **Não formalizado** — mas comparar fibras à lente já era prática |
| Precipitina (sangue humano, Uhlenhuth) | 1901 | **Não** |

## Como usar esta âncora

- **Números:** os valores de tanatologia (`tanatologia.md`) e o modelo de tempo
  (`src/logic/tempo_morte.js`) derivam de Taylor/Casper. Nenhum número novo entra na
  base sem uma destas fontes (ou pesquisa equivalente de época) por trás.
- **Limites:** o `perito-forense` reprova qualquer solução de caso que dependa de
  técnica posterior a 1893 (digital, tipo sanguíneo, raio-X). A prova em MORTEM é
  sempre temporal, causal, de vestígio comparado à lente, ou de contradição de
  depoimento.
- **Honestidade histórica:** quando o jogo precisar de algo no limite da época (ex.:
  comparação de fibras), a prosa e a KB reconhecem o que era prática real (lente,
  morfologia) e não atribuem ao perito um poder analítico que ele não tinha.

> Nota: esta é uma base de trabalho para um jogo, não um levantamento acadêmico. As
> datas dos marcos são de conhecimento consolidado; as edições exatas dos tratados
> podem ser refinadas se o projeto exigir precisão bibliográfica.
