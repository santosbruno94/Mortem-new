// =====================================================================
// TELEMETRIA DA MONOTONIA — OS Prosa Viva, Fase 0 (só mede; não escreve).
//
// Executar:
//   node scripts/telemetria-monotonia.mjs            → mede os 31 casos embarcados
//   node scripts/telemetria-monotonia.mjs 20000      → + amostra o gerador (teto do pool)
//   node scripts/telemetria-monotonia.mjs --verbose  → mostra o esqueleto mais repetido
//
// O QUE ELE RESPONDE
//   Para cada SUPERFÍCIE de prosa gerada (a abertura, a ferida, o rigor, o
//   móbil, os ecos, o frame do diálogo…), transforma "parece repetitivo" em
//   número: quantas frases DISTINTAS o lote produz de fato e quanto se
//   repetem entre casos. É a pauta de prioridade das etapas E1–E5 com dado,
//   não com palpite (docs/os-prosa-viva-e0-plano.md, Fase 0).
//
// O TRUQUE METODOLÓGICO — o "esqueleto"
//   Duas aberturas idênticas em que só muda o nome da vítima e da vila NÃO
//   são duas variantes: são o MESMO molde. Antes de contar, mascaram-se os
//   nomes próprios (vítima, suspeitos, as 6 vilas, os 6 constables) e os
//   números. O que sobra é o esqueleto da frase. Contar esqueletos distintos
//   é medir a variedade REAL, não a ilusão dada pela interpolação de nomes.
//   (Interpolações estruturais como {detective.surname} e marcadores [[id]]
//   são constantes entre casos — não inflam a contagem, ficam intactos.)
//
// O ÍNDICE — "variantes por slot" (var/slot)
//   Cada superfície tem "slots" (o passo da abertura, o estado do rigor, a
//   chave do eco…). var/slot = média de esqueletos distintos por slot.
//     var/slot ≈ 1  → MOLDE DE VARIANTE ÚNICA (todo caso lê igual) — alvo.
//     var/slot ≥ 3  → superfície com fôlego.
//   Ranqueia-se a tabela por var/slot crescente: o topo é a prioridade.
//
// CAVEAT HONESTO (o índice é conservador)
//   Profissão/relação da vítima e dos suspeitos NÃO são mascaradas (são
//   substantivos comuns). Logo, dois casos com o mesmo molde mas profissões
//   diferentes contam como 2 esqueletos. Ou seja: a monotonia REAL é pelo
//   menos a medida — nunca menor. O número erra para o lado seguro.
//
// Build time puro: jamais importado pelo runtime. Só LÊ os casos embarcados;
// não altera um byte de src/. Determinístico (a amostra usa seeds mc_1..N).
// =====================================================================

import { CASO_REPLICA, CASOS_POOL, CASOS_LUTA } from '../src/data/casos_gerados.js';

// Pools de nomes próprios a mascarar (espelham pacote_gerado.js:94-95).
const NOMES_DE_VILA = ['Wrenfield', 'Dunmere', 'Colbrook', 'Haversham', 'Aldergate', 'Marlow Green'];
const SOBRENOMES_DELEGADO = ['Fenwick', 'Harrow', 'Quill', 'Bexley', 'Stanmore', 'Roderick'];

const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const N_AMOSTRA = Number(args.find((a) => /^\d+$/.test(a)) || 0);

const CASOS = [CASO_REPLICA, ...CASOS_POOL, ...CASOS_LUTA];

// ---------------------------------------------------------------------
// Máscara de nomes próprios → esqueleto da frase.
// ---------------------------------------------------------------------
function construirMascara(caso) {
  const nomes = new Set();
  const add = (nome) => {
    if (!nome || typeof nome !== 'string') return;
    nomes.add(nome);
    nome.split(/\s+/).forEach((p) => { if (p.length >= 3) nomes.add(p); });
  };
  add(caso.verdadeDeOuro?.vitima);
  (caso.suspeitos || []).forEach((s) => add(s.nome));
  NOMES_DE_VILA.forEach(add);
  SOBRENOMES_DELEGADO.forEach(add);
  // Substituir nomes completos antes das partes (mais longos primeiro).
  const lista = [...nomes].sort((a, b) => b.length - a.length);
  return (texto) => {
    let t = String(texto || '');
    for (const n of lista) t = t.split(n).join('§');
    t = t.replace(/\d+/g, '#');       // qualquer número → #
    t = t.replace(/§+/g, '§');         // colapsa nomes adjacentes mascarados
    t = t.replace(/\s+/g, ' ').trim();
    return t;
  };
}

// ---------------------------------------------------------------------
// Normalizadores de chave (agrupam sub-superfícies equivalentes).
// ---------------------------------------------------------------------
// gen_alibi_gen_0_professora → gen_alibi   (tira o sufixo do suspeito;
// o papel pode ser composto: gen_1_pastor_de_ovelhas, gen_5_guarda_caca)
const normCarta = (id) => String(id || '').replace(/_gen_\d+_[a-zà-ú_]+$/i, '');
// casa_escola / casa_cottage_2 → casa      (agrupa todas as moradas)
const normLoc = (id) => String(id || '').replace(/^(casa)[_-].*/i, '$1');
// b1_firme / b1_cordial → b1               (agrupa o beat por tom)
const normNo = (id) => String(id || '').replace(/_(firme|cordial|seco|brando|frio|morno)$/i, '');

// ---------------------------------------------------------------------
// Extrator de superfícies: recebe um caso, devolve [{superficie, slot, texto}].
// "slot" é a sub-chave dentro da superfície (o passo, o estado, a chave do eco).
// ---------------------------------------------------------------------
function extrairSuperficies(caso) {
  const out = [];
  const push = (superficie, slot, texto) => {
    if (texto && String(texto).trim()) out.push({ superficie, slot: String(slot), texto: String(texto) });
  };

  // --- Abertura (os 6 passos) ---
  for (const passo of caso.abertura?.passos || []) {
    push('abertura', passo.id, (passo.paragrafos || []).join(' '));
    if (passo.titulo) push('abertura.titulo', passo.id, passo.titulo);
  }

  // --- Cartas (forenses e narrativas), agrupadas por tipo ---
  for (const carta of caso.cartas || []) {
    const tipo = normCarta(carta.id);
    if (Array.isArray(carta.estados) && carta.estados.length) {
      // Cartas de estado (rigor, livor…): um slot por estado.
      for (const est of carta.estados) {
        const slot = est.textoDisplay || est.tagsOcultas?.estadoRigor || est.tagsOcultas?.estadoLivor || String(est.ipmAte);
        push(`carta:${tipo}`, slot, [est.carimboPadrao, est.descricao].filter(Boolean).join(' | '));
      }
    } else {
      push(`carta:${tipo}`, 'descricao', [carta.textoDisplay, carta.carimboPadrao, carta.descricao].filter(Boolean).join(' | '));
    }
  }

  // --- Localidades (corpo, cena, posto, taverna, casas…) ---
  for (const loc of Object.values(caso.localidades || {})) {
    const tipo = normLoc(loc.id);
    push(`localidade:${tipo}`, 'prosa', (loc.prosa || []).join(' '));
    if (loc.subtitulo) push(`localidade:${tipo}`, 'subtitulo', loc.subtitulo);
  }

  // --- Suspeitos: a frase de traço (descricao) e a relação ---
  for (const s of caso.suspeitos || []) {
    push('suspeito:descricao', 'trait', s.descricao);
    push('suspeito:relacao', 'relacao', s.relacao);
  }

  // --- Ecos de interferência: cada chave é um slot ---
  const porChave = caso.ecosInterferencia?.porChave || {};
  for (const [chave, arr] of Object.entries(porChave)) {
    for (const v of arr || []) push('eco', chave, v);
  }

  // --- Diálogos: o frame de cada nó (fala) e as opções (rótulos clicáveis) ---
  for (const dlg of Object.values(caso.dialogos || {})) {
    for (const [noId, no] of Object.entries(dlg.nos || {})) {
      const slot = normNo(noId);
      if (Array.isArray(no.fala)) push('dialogo:fala', slot, no.fala.join(' '));
      for (const op of no.opcoes || []) push('dialogo:opcao', slot, op.rotulo);
    }
  }

  return out;
}

// ---------------------------------------------------------------------
// Agrega uma coleção de casos numa tabela de índices por superfície.
// ---------------------------------------------------------------------
function medir(casos) {
  // superficie → slot → Map<esqueleto, contagem>
  const dados = new Map();
  let totalTextos = 0;

  for (const caso of casos) {
    const mascarar = construirMascara(caso);
    for (const { superficie, slot, texto } of extrairSuperficies(caso)) {
      totalTextos++;
      const esq = mascarar(texto);
      if (!dados.has(superficie)) dados.set(superficie, new Map());
      const slots = dados.get(superficie);
      if (!slots.has(slot)) slots.set(slot, new Map());
      const contagem = slots.get(slot);
      contagem.set(esq, (contagem.get(esq) || 0) + 1);
    }
  }

  const linhas = [];
  for (const [superficie, slots] of dados) {
    let instancias = 0;
    const esqueletosUnion = new Set();
    let somaVarPorSlot = 0;
    let piorSlot = Infinity;   // menor nº de variantes entre os slots (slot congelado)
    let reusoMax = 0;          // maior contagem de um único esqueleto num slot
    let topEsq = '';
    for (const [, contagem] of slots) {
      let instSlot = 0;
      for (const [esq, n] of contagem) {
        instSlot += n;
        esqueletosUnion.add(esq);
        if (n > reusoMax) { reusoMax = n; topEsq = esq; }
      }
      instancias += instSlot;
      somaVarPorSlot += contagem.size;
      if (contagem.size < piorSlot) piorSlot = contagem.size;
    }
    const nSlots = slots.size;
    const distintas = esqueletosUnion.size;
    linhas.push({
      superficie,
      slots: nSlots,
      instancias,
      distintas,
      varPorSlot: somaVarPorSlot / nSlots,
      piorSlot,
      reusoMedio: instancias / distintas,   // quantas vezes cada frase escrita é relida
      reusoMax,
      topEsq,
    });
  }

  // Ordena por REÚSO MÉDIO decrescente: o topo é a frase mais reciclada do
  // lote — a pauta de prioridade. Desempate por exposição (instâncias).
  linhas.sort((a, b) => b.reusoMedio - a.reusoMedio || b.instancias - a.instancias);
  return { linhas, totalTextos };
}

// ---------------------------------------------------------------------
// Impressão.
// ---------------------------------------------------------------------
// Diagnóstico pelo reúso médio: quantas vezes, em média, cada frase escrita
// é relida ao longo do lote. É a monotonia sentida pelo jogador de vários casos.
function classificar(reusoMedio) {
  if (reusoMedio >= 12) return 'MUITO REPETIDO';
  if (reusoMedio >= 5) return 'repetido';
  if (reusoMedio >= 2.5) return 'moderado';
  return 'variado';
}

const MIN_INST = 3;  // superfícies com <3 instâncias são cauda rara (baixa exposição)

function imprimirTabela(titulo, { linhas, totalTextos }, nCasos) {
  const principais = linhas.filter((l) => l.instancias >= MIN_INST);
  const cauda = linhas.length - principais.length;
  console.log(`\n${'='.repeat(86)}`);
  console.log(`${titulo}  (${nCasos} casos · ${totalTextos} textos medidos)`);
  console.log('='.repeat(86));
  console.log(
    'SUPERFÍCIE'.padEnd(26) +
    'slots'.padStart(7) +
    'inst'.padStart(9) +
    'dist'.padStart(7) +
    'var/slot'.padStart(10) +
    'pior'.padStart(6) +
    'reúso'.padStart(9) +
    '  diagnóstico'
  );
  console.log('-'.repeat(90));
  for (const l of principais) {
    console.log(
      l.superficie.padEnd(26) +
      String(l.slots).padStart(7) +
      String(l.instancias).padStart(9) +
      String(l.distintas).padStart(7) +
      l.varPorSlot.toFixed(1).padStart(10) +
      String(l.piorSlot).padStart(6) +
      l.reusoMedio.toFixed(1).padStart(9) +
      '  ' + classificar(l.reusoMedio)
    );
    if (verbose && l.reusoMedio >= 5) {
      const amostra = l.topEsq.length > 100 ? l.topEsq.slice(0, 100) + '…' : l.topEsq;
      console.log('    ↳ esqueleto campeão (' + l.reusoMax + '×): ' + amostra);
    }
  }
  console.log('-'.repeat(86));
  console.log(`(+${cauda} superfícies de cauda com <${MIN_INST} instâncias — baixa exposição, omitidas)`);
  console.log('Colunas: pior = variantes no slot mais congelado · reúso = instâncias ÷ distintas.');
}

// Detalhe da abertura passo a passo (E1 é a prioridade nº 1 do plano).
function detalharAbertura(casos) {
  const porPasso = new Map();  // passoId → Map<esqueleto, n>
  for (const caso of casos) {
    const mascarar = construirMascara(caso);
    for (const passo of caso.abertura?.passos || []) {
      const esq = mascarar((passo.paragrafos || []).join(' '));
      if (!porPasso.has(passo.id)) porPasso.set(passo.id, new Map());
      const m = porPasso.get(passo.id);
      m.set(esq, (m.get(esq) || 0) + 1);
    }
  }
  console.log(`\n${'-'.repeat(86)}`);
  console.log('DETALHE — a abertura passo a passo (E1):');
  for (const [passo, m] of porPasso) {
    const distintas = m.size;
    const reusoMax = Math.max(...m.values());
    const tag = distintas === 1 ? 'CONGELADO (todo caso lê igual)' : `${distintas} variantes de esqueleto`;
    console.log(`  ${passo.padEnd(14)} ${String(distintas).padStart(2)} dist · campeão ${reusoMax}× · ${tag}`);
  }
}

// ---------------------------------------------------------------------
// Execução.
// ---------------------------------------------------------------------
console.log('\nTELEMETRIA DA MONOTONIA — OS Prosa Viva, Fase 0');
console.log('Legenda: var/slot = esqueletos distintos por slot (≈1 = molde único, alvo das etapas).');
console.log('         reusoMax = quantas vezes o esqueleto campeão se repete no lote.');

const embarcados = medir(CASOS);
imprimirTabela('CASOS EMBARCADOS (o que o jogador de fato recebe)', embarcados, CASOS.length);
detalharAbertura(CASOS);

if (N_AMOSTRA > 0) {
  // Amostra o gerador para revelar o TETO do pool (var/slot no mundo, não só
  // nos 31 sorteados). Informa a decisão D2 (teto de variantes por superfície).
  console.log(`\n… gerando ${N_AMOSTRA} casos para medir o teto do pool (aguarde) …`);
  const { montarPacoteGerado } = await import('../src/gerador/pacote_gerado.js');
  const amostra = [];
  for (let i = 1; i <= N_AMOSTRA; i++) amostra.push(montarPacoteGerado(`mc_${i}`));
  const pool = medir(amostra);
  imprimirTabela(`TETO DO POOL (amostra de ${N_AMOSTRA} casos do gerador)`, pool, N_AMOSTRA);
  console.log('\nLeitura da 2ª tabela: se o teto do pool também é baixo, o banco é raso na');
  console.log('fonte (escrever mais variantes resolve). Se o teto é alto mas os embarcados');
  console.log('são baixos, faltou sorteio/decorrelação (alvo da E5).');
}

console.log('\nPróximo passo (plano §6): com estes números, o autor decide D1–D4');
console.log('(assinatura da abertura, teto de variantes, slots × listas, bump de golden).\n');
