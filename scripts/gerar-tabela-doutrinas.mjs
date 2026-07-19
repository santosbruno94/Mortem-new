// =====================================================================
// GERA docs/os-autobattler-v2-doutrinas-tabela.md A PARTIR DO DADO
// (src/gerador/doutrinas.js) — identidade código↔doc por construção:
// o doc-tabela que o autor aprova (portão de B2) é impressão fiel da
// tabela que o resolvedor executa. Reexecutar após qualquer mudança em
// doutrinas.js e commitar o doc junto.
//
// Executar: node scripts/gerar-tabela-doutrinas.mjs
// =====================================================================

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  CATALOGO_ACOES,
  DOUTRINA_VITIMA,
  DOUTRINA_ASSASSINO,
} from '../src/gerador/doutrinas.js';
import { CLASSES_VESTIGIO } from '../src/gerador/vestigios.js';

const L = [];
L.push('# OS Autobattler v2 — B2: a tabela de doutrinas e a matriz ação→vestígio');
L.push('');
L.push('**Gerado por `scripts/gerar-tabela-doutrinas.mjs` a partir de `src/gerador/doutrinas.js` — não editar à mão.**');
L.push('Entregável-portão da fase B2 (OS §3.4): a aprovação do autor sobre ESTE doc libera a B3.');
L.push('');
L.push('## 1. O contrato');
L.push('');
L.push('A escolha de ação é **função pura do estado** — zero sal (GB3: fuzz de ≥10⁴ estados,');
L.push('mesma entrada ⇒ mesma ação; lint estático: `doutrinas.js` não importa hash). Só a');
L.push('**resolução** rola dados (acerto, dano, alvo-região, incidental — sais de B3). As flags');
L.push('de réplica/desespero (`fugaSuprimida`/`forcarVitoria`) agem na **legalidade** das ações,');
L.push('nunca nas linhas de doutrina. Regiões (D2=b): `bracos | maos | pernas | cabeca | tronco`,');
L.push('cada uma `integro | ferido | inutilizado`; braços OU mãos inutilizados ⇒ não apara nem');
L.push('se arma; pernas inutilizadas ⇒ não foge; o agarre (`presa | livre`) substitui o');
L.push('`seguraAVitima`-como-sentença — **o desvencilhar existe**.');
L.push('');
L.push('## 2. Matriz ação → vestígio (o portão da regra de existência)');
L.push('');
L.push('| Ação | Papel | Pré-condições (resumo legível) | Classe de vestígio | Rastro diferencial |');
L.push('|---|---|---|---|---|');
const PRECONDICOES_LEGIVEIS = {
  golpear_metodo: 'adjacente; o método na mão',
  golpear_improvisado: 'peça na mão; adjacente; braços/mãos servem',
  armar_se: 'sem peça; peça empunhável a ≤1 célula; braços/mãos servem',
  desvencilhar: 'presa no agarre; braços/mãos servem',
  aparar: 'livre; adjacente; braços/mãos servem',
  interpor: 'livre; peça `bloqueia` interponível (D1=a); braços/mãos servem',
  fugir: 'livre; pernas servem; sem flag de réplica/desespero',
  gritar: 'grito não gasto; livre; sem flag — ROLAGEM PARALELA (não é escolha)',
  perseguir: 'fora de alcance',
};
for (const [id, a] of Object.entries(CATALOGO_ACOES)) {
  const classe = CLASSES_VESTIGIO[a.classeVestigio];
  L.push(
    `| \`${id}\`${a.rolagemParalela ? ' *(rolagem)*' : ''} | ${a.papel} | ${PRECONDICOES_LEGIVEIS[id]} | \`${a.classeVestigio}\` (${classe.rotulo.toLowerCase()}) | ${a.rastro} |`
  );
}
L.push('');
L.push('Toda ação declara classe EXISTENTE em `CLASSES_VESTIGIO` (lint GB4); ação sem rastro');
L.push('diferencial não entra no catálogo (regra de existência §2.3). As classes novas desta OS');
L.push('(`peca_deslocada`, `lesao_padrao_de_peca`, `residuo_na_peca`, `ungueais_de_desvencilhamento`,');
L.push('`lesao_incidental` + `fibra_na_aresta` — par `naoCausal` —, `ferimento_do_agressor` com');
L.push('sede) estão declaradas em `vestigios.js`; a deposição liga em B3.');
L.push('');

const imprimeTabela = (titulo, tabela) => {
  L.push(`## ${titulo}`);
  L.push('');
  L.push('A PRIMEIRA linha cuja condição casa E cuja ação é legal vence — sempre, para o mesmo');
  L.push('estado, a mesma linha. O jogador reconstrói de trás para frente.');
  L.push('');
  L.push('| # | Condição (código, literal) | Ação | Porquê (a linha que o jogador reconstrói) |');
  L.push('|---|---|---|---|');
  for (const linha of tabela) {
    const cond = linha.se
      .toString()
      .replace(/^\(?e?\)?\s*=>\s*/, '')
      .replace(/\s+/g, ' ');
    L.push(`| ${linha.id} | \`${cond === 'true' ? '(sempre, se legal)' : cond}\` | \`${linha.acao}\` | ${linha.porque} |`);
  }
  L.push('');
};

imprimeTabela('3. Doutrina da VÍTIMA', DOUTRINA_VITIMA);
imprimeTabela('4. Doutrina do ASSASSINO', DOUTRINA_ASSASSINO);

L.push('## 5. O caso-escola (exemplo normativo do autor)');
L.push('');
L.push('Garrote premeditado, FOR da vítima alta: sobrevive à surpresa → `presa` → **v1**');
L.push('desvencilhar → sucesso (FOR×FOR, sal de resolução) → sulco interrompido + ungueais no');
L.push('próprio pescoço → estado livre/ferida/polaridade ativa/atiçador a 1 célula → **v4**');
L.push('armar-se (`peca_deslocada`) → **v2** golpear (`lesao_padrao_de_peca` no assassino +');
L.push('`residuo_na_peca`) — **não fugir**. Cada passo é a primeira linha legal da tabela.');
L.push('');
L.push('## 6. Desempate causal (a promoção do vetor psíquico)');
L.push('');
L.push('`sobAtaque` deixa de ser peso somado a sorteio e vira **regra de desempate**: decide');
L.push('QUAL linha captura o estado ambíguo (v4×v6), nunca rola dado. Vetor explícito vence');
L.push('polaridade; polaridade desempata o vetor neutro; o corpo neutro escolhe o mais próximo');
L.push('(v7) e, na dúvida com a peça à mão, arma-se (v8 — o exemplo normativo).');
L.push('');
L.push('## 7. Terminação e inação');
L.push('');
L.push('O laço de B3 é `for r = 1..MAX_RODADAS` (teto duro — sem `while` sobre estado); a');
L.push('reamostragem por rejeição continua cobrindo vitória da vítima (motivos novos:');
L.push('`vitima_venceu_armada`, `assassino_incapacitado`). `doutrina()` devolve `null` quando');
L.push('nenhuma ação é legal (surpresa da rodada 1, braços e mãos inutilizados): inação não é');
L.push('ação do catálogo e não deposita rastro.');
L.push('');

const destino = fileURLToPath(new URL('../docs/os-autobattler-v2-doutrinas-tabela.md', import.meta.url));
writeFileSync(destino, L.join('\n'));
console.log(`gerar-tabela-doutrinas: escrito em docs/os-autobattler-v2-doutrinas-tabela.md (${L.length} linhas).`);
