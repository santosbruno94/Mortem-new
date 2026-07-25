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

**Hans Gross — *Handbuch für Untersuchungsrichter* (Manual do juiz de instrução)**
Gross (1847–1915), magistrado austríaco, publicou em **1893** — o próprio ano do jogo —
o manual que fundou a criminalística como disciplina. (O título da 1ª edição de 1893 é
*Handbuch für Untersuchungsrichter, Polizeibeamte, Gendarmen etc.*; o subtítulo célebre
*als System der Kriminalistik* só entra na 4ª edição, 1904 — usamos aqui a forma curta e
fiel ao cerne da obra.) Sistematizou o exame metódico da
cena e do suspeito: procurar no **agressor** o que a luta lhe deixou (arranhões, roupa
rasgada, sangue alheio), preservar e comparar vestígios, interrogar com método. É a
âncora de época para o **exame do agressor** e para a busca de vestígios de transferência
na pessoa, não só no lugar. Rigorosamente contemporâneo: um perito atento de 1893 podia
conhecê-lo.

## Marcos técnicos e suas datas (o que existe e o que não em 1893)

| Técnica | Data | Disponível em 1893? |
|---|---|---|
| Teste de Marsh (arsênico) | 1836 | **Sim** — método toxicológico corrente |
| Cristais de Teichmann (hemina, confirmação de sangue) | 1853 | **Sim** — de microscópio, ver `vestigios.md` e `supressao-de-vestigios.md` |
| Ensaio do guaiaco (Van Deen, presunção de sangue) | 1862 | **Sim** — de campo, presuntivo; ver `supressao-de-vestigios.md` |
| Microespectroscopia (Sorby, confirmação de sangue) | 1865 | **Sim** — de gabinete, não vai a campo; ver `supressao-de-vestigios.md` |
| Micrometria de Gulliver (diâmetro do eritrócito por espécie) | 1875 | **Sim** — prova de exclusão, fraca; ver `supressao-de-vestigios.md` |
| Sistema de datação por fenômenos cadavéricos | séc. XIX | **Sim** — Casper, Taylor |
| Reconstituição de cena / criminologia | 1880s | **Sim** — Lacassagne |
| Impressões digitais (Galton) | 1892 | Recém-publicado; **quase sem uso policial** |
| Sistema dactiloscópico (Henry) | ~1897–1900 | **Não** |
| Grupos sanguíneos ABO (Landsteiner) | 1901 | **Não** |
| Raios-X (Röntgen) | 1895 | **Não** |
| Princípio de troca (Locard) | ~1910 | **Não formalizado** — mas comparar fibras à lente já era prática |
| Precipitina (sangue humano, Uhlenhuth) | 1901 | **Não** |
| Criminalística sistemática (Gross, *Handbuch*) | 1893 | **Sim** — contemporâneo; exame do agressor e do vestígio |
| Leitura formal de padrões de mancha de sangue (Piotrowski) | 1895 | **Não** — a trilha lê-se só por senso comum em 1893 |
| Identificação de ferramenta por estrias (linhagem Waite/Goddard; microscópio de comparação) | anos 1920 | **Não** — lê-se o **gênero** do instrumento, nunca o exemplar; ver `vestigios.md` |
| Decifração de documento carbonizado (fotografia de imagem latente, *Nature*) | 1941 | **Não** — a luz rasante dá geometria de pauta, nunca uma sílaba; ver `supressao-de-vestigios.md` |

## Bastidores modernos (fora do horizonte de 1893 — só para o gerador)

A dinâmica do confronto (capacidade de ação pós-lesão, sítio das lesões, coerência das
trilhas) apoia-se, **nos bastidores do gerador**, em literatura forense moderna que dá
método ao que Taylor já observava caso a caso. Estas obras **não** são conhecimento do
perito de 1893 e jamais afloram na prosa ou na `vozMestre`; servem apenas para o gerador
depor cenas fisicamente consistentes:

- **B. Karger** — estudos sobre a **capacidade de ação** após ferimentos cardíacos,
  vasculares e cranianos (sobrevida e ato voluntário mensurados).
- **V. J. DiMaio — *Gunshot Wounds***; **Spitz & Fisher — *Medicolegal Investigation of
  Death*** — referência de topografia de lesões, sobrevida e reconstituição.

Regra da casa: o que entra na KB como **fala de época** cita Taylor/Casper/Lacassagne/Gross;
o que vem destes bastidores fica marcado como bastidor e nunca é atribuído ao perito.

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
