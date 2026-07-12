# Base de Conhecimento — Medicina Legal de Época (1893)

A verdade forense de MORTEM. Serve ao caso tutorial e ao futuro gerador procedural, e é
a referência do agente `perito-forense` e da revisão de prosa. Tudo aqui respeita o
horizonte de conhecimento de 1893 (ver `fontes.md`): o que os tratados da época sabiam,
o perito sabe; o que veio depois, ele ignora.

## Índice

| Arquivo | Conteúdo |
|---|---|
| [`tanatologia.md`](./tanatologia.md) | Sinais do tempo da morte: algor, rigor, livor, convergência (IPM). Os valores **[MOTOR]**. |
| [`asfixias.md`](./asfixias.md) | A família das asfixias e a distinção das espécies pelo sinal de assinatura. |
| [`venenos.md`](./venenos.md) | Toxicologia de época: cianeto, arsênico, estricnina, ópio; testes de Marsh e de Prússia. |
| [`traumas.md`](./traumas.md) | Trauma contuso, arma branca, arma de fogo; reação vital; lesões de defesa. |
| [`vestigios.md`](./vestigios.md) | Fibras à lente, transferência, cadeia pessoa↔instrumento↔lugar e seus limites. |
| [`protocolo-exame.md`](./protocolo-exame.md) | A ordem, os instrumentos e os gestos do exame; leitura de encenação; o que 1893 não alcançava. |
| [`inquerito-e-policia.md`](./inquerito-e-policia.md) | O aparato legal: coroner e inquérito (Coroners Act 1887), polícia de vila, murder × manslaughter, cena sem cadeia de custódia. |
| [`vocabulario-de-epoca.md`](./vocabulario-de-epoca.md) | Termos técnicos e material/mundo de 1893; anacronismos proibidos. |
| [`fontes.md`](./fontes.md) | Taylor, Casper, Lacassagne; datas dos marcos técnicos (o que existe e o que não). |
| [`lacunas.md`](./lacunas.md) | Auditoria: 10 lacunas temáticas mapeadas contra os tratados, priorizadas — expansão é decisão do usuário. |

## Regra de uso

- Os valores **[MOTOR]** (em `tanatologia.md`) espelham `src/logic/tempo_morte.js` e o
  §15 do `MORTEM_CONTEXTO.md`. **Divergência entre a KB e o motor é decisão do
  usuário** — o agente aponta, não corrige o código.
- O nome técnico vive aqui e no Glossário; a **prosa das cartas descreve o sinal sem
  nomeá-lo** (guia de estilo §5). Ver `vocabulario-de-epoca.md`.
- Nenhuma solução de caso pode depender de técnica posterior a 1893 (digitais como
  rotina, tipo sanguíneo, raio-X). A prova é temporal, causal, de vestígio comparado à
  lente, ou de contradição de depoimento.
