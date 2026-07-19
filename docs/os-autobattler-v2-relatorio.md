# OS Autobattler v2 — relatório de aceite (B5)

**Data:** 19 de julho de 2026 · **Artefato de aceite da OS inteira** (§6.1)
**Comparando:** linha de base v1 no parecer B0 (`os-autobattler-v2-b0-parecer.md`)
**Medição:** `node scripts/mc-batalha.mjs 200000` — 200.000 casos, 215s, determinístico.

## 1. As bandas D3/D4 (GB8 pleno, 200k)

| Métrica | v1 (B0) | v2 (aceite) | Banda D3 | Veredito |
|---|---|---|---|---|
| Desespero | 5,5% | **4,1%** | ≤ 5% | ✓ |
| Fuga realizada | 7,5% | **20,9%** | 10–20% | **0,9 p.p. acima — decisão do autor** |
| Armar-se | 0% | **13,8%** | 8–15% | ✓ |
| Incidental | 0% | **5,2%** | 5–10% | ✓ |
| Rastro-por-ação | — | **92,0%** | ≥ 90% | ✓ |
| Réu ferido com observável no CORPO | **0%** | **100%** | (a remedição do B0) | ✓ — o furo central fechou |
| Troca de método (B4) | — | **< 5% (rara)** | banda apertada D4 | ✓ GB10 |
| Desvencilhamento | — | 34% das travadas | — | o garrote abriu (era batalha selada) |
| Interposição | — | 8,6% | — | D1=a entregue |

Alavancas usadas (todas chute-calibrável declarado, commit `8be84b5`): acerto do
método 6/8→7/8; incidental 1/16→1/11; a topologia da vítima bloqueia a célula do
assassino (a emboscada corta a retirada de fato); o golpe em quem foge mira
pernas/dorso com +1 de dano (a caçada derruba — traumas.md). Registro de método:
o desespero do v2 era **loop determinístico** (FOR 5 × método fraco × porta perto),
não cauda probabilística — subir `MAX_TENTATIVAS` (24→40) não moveu nada e foi
revertido; a solução foi física.

## 2. Auditoria de tells (§8.3 da OS)

- **"Peça deslocada ⇒ vítima venceu rodadas?"** — P(réu ferido | peça deslocada) =
  42% vs 13% na base. Correlação real e **honesta**: é inferência de fair play (quem
  vê a peça fora do lugar procura o ferimento do réu — e a carta
  `gen_ferimento_reu` existe para ser achada), não vazamento de informação oculta.
  Nenhuma variável lida pelo veredicto deriva dela.
- **Método × layout:** nenhuma célula degenerada; garrote com 2% de fuga é a
  assinatura do desvencilhar (pós-soltura), não zero estrutural; asfixias manuais
  zeraram o desespero (0,0–0,1%) — o agarre dinâmico resolveu o que o peso
  `MULT_MOBILIDADE` maquiava.
- Sinais de tentativa: GB10 prova que não cravam sozinhos (nem com `reacao_vital`);
  o motor não lê `metodoIniciado`.

## 3. Réplica dirigida (GB7)

Nova seleção pela busca versionada (`scripts/buscar-replica.mjs`, 240 candidatas,
placar D5): **`a_hora_emprestada_replica_105`** (corpo movido, quadrante INT4+/WIS4+,
palco interno, trava de fuga íntegra; 4 desfechos jogáveis). O autor não registrou
preferência entre as 8 empatadas de 7 pontos — _105 vale como escolha de trabalho,
**trocável a custo zero** por qualquer empatada (GB7 formal em aberto).

## 4. Vitrines (`npm run demo:crime`)

`mc_8` garrote desvencilhado (o caso-escola do pedido) · `mc_37` vítima armada fere
o réu (ferimento com sede) · `mc_19` incidental + fibra na aresta · `mc_448` troca
de método consumada (fatal contuso, sulco interrompido colorindo).

## 5. Pontes registradas (§6.2)

- **(a) Palco/E-série:** `FISICA_DA_MOBILIA` cobre por id TODO o vocabulário —
  inclusive os grupos de logradouro do E2, que herdam física sem tradução; o E2 já
  entregara `interior.saidas`, e o v2 o consome como fonte única (as 3 recomputações
  de porta morreram).
- **(b) Marca-e-luva:** M1 absorvido aqui (sede anatômica em toda lesão +
  `ferimento_do_agressor`); a OS marca-e-luva não existe no repositório — M2–M3
  aguardam o documento; M0 (dossiê de traumas/datação) segue livre.
- **(c) OS de prosa — superfícies novas para lapidação:** `gen_ungueais`,
  `gen_incidental`, `gen_peca_deslocada`, `gen_fibra_aresta`, `gen_peca_limpa`,
  `gen_residuo_peca`, `gen_ferimento_reu`, `gen_tentativa`, sede no carimbo de
  `gen_lesao_fatal` (hoje em prosa sóbria de observação, lint-prosa verde; a
  lapidação fina e a passada `revisar-prosa` completa ficam com a OS de prosa).

## 6. Critérios de aceite (§8 da OS) — estado

1. GB1–GB10 verdes ✓ (+ herdadas: determinismo, motor cego, L1/L2, anti-tell,
   trava de menores, LOD/import/proveniência — placar do `qa.mjs` integral).
2. Golden set regenerado ✓; réplica nova validada (GB7 formal em aberto — §3);
   `qa-ui.mjs` verde sem mudança de contrato (a rota gerada agora segue
   `SEED_REPLICA` por import).
3. Distribuições nas bandas, exceto fuga 20,9% (0,9 p.p.) — decisão do autor:
   aceitar a banda estendida OU encomendar ajuste (que tocaria a tabela de
   doutrinas aprovada, com nova aprovação).
4. Matriz ação→vestígio e tabela de doutrinas publicadas e aprovadas (portão B2) ✓.
5. Decisões respondidas: D1=a, D2=b, D3=ponto de partida da OS, D4=a, D6=mínimo,
   D7=~1 jarda, D8=resolvida de fato (palco fechou E4 antes da série B tocar
   `crime.js`); D5=placar herdado do §4.8 + encenação por corpo ✓. Sais por
   commit ✓; namespace v1 aposentado no commit de B3 ✓.
