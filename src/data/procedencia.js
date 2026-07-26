// =====================================================================
// PROCEDÊNCIA DAS ALEGAÇÕES — o `apontadaPor` da D17, e a D16 realizada.
//
// Quem PÔS a alegação em circulação. Não é quem ela acusa: é de que boca
// ela saiu antes de chegar ao papel.
//
// POR QUE ISTO NÃO VIVE EM `tagsOcultas`. O `CLAUDE.md` já fixou o
// precedente para a aparência de personagem — camada narrativa JAMAIS entra
// em `tagsOcultas`, e a guarda do QA cobra. A razão é a mesma aqui: um
// campo dentro das tags é um campo que o motor PODE ler amanhã sem que
// ninguém repare. Fora delas, a cegueira é estrutural, e não uma promessa.
// O martelo (c) da OS-R6 escolheu explicitamente que o motor não lê; este
// arquivo é essa escolha escrita no lugar onde ela se sustenta sozinha.
//
// A D16 fixou a forma da cumplicidade como POSTERIOR: dois comprados com a
// mesma mentira, com fio de coação na Sra. Wick. As duas já estavam na
// ficção e nas cartas, sem que o jogo soubesse ligá-las:
//
//   • DAVEY TULL repete o «saímos juntos às sete e meia» que o oficial lhe
//     ensaiou — a própria carta regista que, perguntado outra vez, ele
//     devolve «as mesmas palavras, na mesma ordem». Não é dinheiro: é medo
//     do gaffer, e o rapaz tem quinze anos (G7).
//   • A SRA. WICK põe uma senhora de escuro na viela «pouco antes das
//     nove», e ao meio-dia diz não ter visto nada e fecha a janela. A
//     retratação está escrita na carta desde a R4.
//
// As duas alegações saem da mesma boca, e é isso que o sistema precisa
// saber: **duas testemunhas que apontam o mesmo dedo pela mesma razão não
// são duas corroborações — são uma.** Um perito que some as duas está
// somando o mesmo homem duas vezes.
//
// `forma` é lastro de prosa e de auditoria, nunca de mecânica:
//   'propria'  — a pessoa alega do que viu ou fez; a origem é ela mesma
//   'ensaio'   — repete o que lhe puseram na boca
//   'coacao'   — alega sob pressão de terceiro, e recua quando pode
//
// ---------------------------------------------------------------------
// OS-R9 · FASE 1 — O MAPA PASSA A SER DO CASO, E NÃO DESTE ARQUIVO
//
// Até aqui o mapa era único porque o caso era único. O gerador produz o
// seu (src/gerador/procedencia_gerada.js), e o pacote de caso passa a
// carregá-lo no campo `procedencia` — como já carrega `intervencoes`.
// Este arquivo continua a ser a fonte do mapa DO CASO-ESCOLA, e as
// funções abaixo recebem o mapa por parâmetro para que a mesma régua
// corra sobre qualquer caso. Quem resolve de que caso é o mapa é
// `contaminacao.js`, que o pede ao pacote carregado.
// =====================================================================

export const PROCEDENCIA_ALEGACOES = {
  // A cadeia contaminada: três papéis, uma só boca.
  alibi_silas: { apontadaPor: 'silas_crane', forma: 'propria' },
  alibi_davey: { apontadaPor: 'silas_crane', forma: 'ensaio' },
  dep_mulher_viela: { apontadaPor: 'silas_crane', forma: 'coacao' },

  // As demais alegações do caso, cada uma da sua própria fonte. Estão aqui
  // para que a contaminação se leia por CONTRASTE: sem o resto do mapa, um
  // punhado de cartas marcadas seria o próprio dedo apontado.
  alibi_agnes: { apontadaPor: 'agnes_rooke', forma: 'propria' },
  alibi_grey: { apontadaPor: 'caleb_grey', forma: 'propria' },
  alibi_walter: { apontadaPor: 'walter_arthurs', forma: 'propria' },
  dep_avistamento_padeiro: { apontadaPor: 'moco_padeiro', forma: 'propria' },
  dep_sineiro_beco: { apontadaPor: 'amos_kell', forma: 'propria' },
  corrob_estalajadeiro: { apontadaPor: 'estalajadeiro', forma: 'propria' },
  corrob_pettigrew: { apontadaPor: 'pettigrew', forma: 'propria' },

  // ---------------------------------------------------------------------
  // OS-S1 — AS DUAS BOCAS LIMPAS. Até aqui o caso ensinava `contarVozes` por
  // um lado só: três papéis de uma boca só (a cadeia contaminada acima). O
  // sexto homem traz o lado oposto — duas fontes INDEPENDENTES que se
  // corroboram de verdade, e é por elas que o jogador aprende que somar vila
  // às vezes soma mesmo.
  //
  // A briga na loja passa a ter boca com nome (PD-02): quem a ouviu do
  // degrau foi o recoveiro, e é ele quem a leva ao posto no sábado à tarde,
  // com medo de ter sido visto a rondar. A alegação continua verdadeira; o
  // que muda é que ela deixa de vir de um carroceiro sem rosto.
  // ---------------------------------------------------------------------
  dep_briga_walter: { apontadaPor: 'nathan_herrick', forma: 'propria' },
  alibi_herrick: { apontadaPor: 'nathan_herrick', forma: 'propria' },
  dep_cela_herrick: { apontadaPor: 'nathan_herrick', forma: 'propria' },
  dep_achado_cela: { apontadaPor: 'harlan', forma: 'propria' },

  // A retratação sai da MESMA boca que o relato que ela desdiz (a vizinha),
  // e pela mesma razão que a primeira versão foi recuada: `coacao`. Somar as
  // duas folhas é somar a mesma mulher duas vezes, e a segunda vez foi
  // comprada com o que o livro de empréstimos sabe dela.
  dep_retratacao_wick: { apontadaPor: 'silas_crane', forma: 'coacao' },
};

/**
 * A boca de onde saiu a alegação daquela carta, ou null se não há registro.
 * O mapa entra por parâmetro porque ele é DO CASO (o caso-escola declara o
 * seu acima; os gerados declaram o deles no pacote). Sem mapa, todo papel
 * é de boca desconhecida — e a regra de `contarVozes` cuida disso.
 */
export function apontadaPor(cartaId, mapa = PROCEDENCIA_ALEGACOES) {
  return (mapa || {})[cartaId]?.apontadaPor ?? null;
}
