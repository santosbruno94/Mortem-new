// =====================================================================
// NÚCLEO DA TELEMETRIA DA MONOTONIA (OS Prosa Viva, Fase 0 + E5).
//
// Funções puras de medição, compartilhadas pelo relatório de mesa
// (scripts/telemetria-monotonia.mjs) e pela GUARDA anti-regressão do
// scripts/qa.mjs. Só LÊ os casos; não altera dado. Determinístico.
//
// O método (o "esqueleto"): mascaram-se os nomes próprios (vítima,
// suspeitos, as 6 vilas, os 6 constables) e os números antes de contar,
// para que duas frases de molde idêntico com só o nome trocado contem
// como UMA variante — a variedade real, não a ilusão da interpolação.
// =====================================================================

const NOMES_DE_VILA = ['Wrenfield', 'Dunmere', 'Colbrook', 'Haversham', 'Aldergate', 'Marlow Green'];
const SOBRENOMES_DELEGADO = ['Fenwick', 'Harrow', 'Quill', 'Bexley', 'Stanmore', 'Roderick'];

export function construirMascara(caso) {
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
  const lista = [...nomes].sort((a, b) => b.length - a.length);
  return (texto) => {
    let t = String(texto || '');
    for (const n of lista) t = t.split(n).join('§');
    t = t.replace(/\d+/g, '#');
    t = t.replace(/§+/g, '§');
    t = t.replace(/\s+/g, ' ').trim();
    return t;
  };
}

const normCarta = (id) => String(id || '').replace(/_gen_\d+_[a-zà-ú_]+$/i, '');
const normLoc = (id) => String(id || '').replace(/^(casa)[_-].*/i, '$1');
const normNo = (id) => String(id || '').replace(/_(firme|cordial|seco|brando|frio|morno)$/i, '');

export function extrairSuperficies(caso) {
  const out = [];
  const push = (superficie, slot, texto) => {
    if (texto && String(texto).trim()) out.push({ superficie, slot: String(slot), texto: String(texto) });
  };

  for (const passo of caso.abertura?.passos || []) {
    push('abertura', passo.id, (passo.paragrafos || []).join(' '));
    if (passo.titulo) push('abertura.titulo', passo.id, passo.titulo);
  }

  for (const carta of caso.cartas || []) {
    const tipo = normCarta(carta.id);
    if (Array.isArray(carta.estados) && carta.estados.length) {
      for (const est of carta.estados) {
        const slot = est.textoDisplay || est.tagsOcultas?.estadoRigor || est.tagsOcultas?.estadoLivor || String(est.ipmAte);
        push(`carta:${tipo}`, slot, [est.carimboPadrao, est.descricao].filter(Boolean).join(' | '));
      }
    } else {
      push(`carta:${tipo}`, 'descricao', [carta.textoDisplay, carta.carimboPadrao, carta.descricao].filter(Boolean).join(' | '));
    }
  }

  for (const loc of Object.values(caso.localidades || {})) {
    const tipo = normLoc(loc.id);
    push(`localidade:${tipo}`, 'prosa', (loc.prosa || []).join(' '));
    // E5: a introducao (linha de abertura da cena) entra na medição —
    // era ponto cego da Fase 0 (o telemetria lia só `prosa`).
    if (Array.isArray(loc.introducao) && loc.introducao.length) push(`localidade:${tipo}`, 'introducao', loc.introducao.join(' '));
    if (loc.subtitulo) push(`localidade:${tipo}`, 'subtitulo', loc.subtitulo);
  }

  for (const s of caso.suspeitos || []) {
    push('suspeito:descricao', 'trait', s.descricao);
    push('suspeito:relacao', 'relacao', s.relacao);
  }

  const porChave = caso.ecosInterferencia?.porChave || {};
  for (const [chave, arr] of Object.entries(porChave)) {
    for (const v of arr || []) push('eco', chave, v);
  }

  for (const dlg of Object.values(caso.dialogos || {})) {
    for (const [noId, no] of Object.entries(dlg.nos || {})) {
      const slot = normNo(noId);
      if (Array.isArray(no.fala)) push('dialogo:fala', slot, no.fala.join(' '));
      for (const op of no.opcoes || []) push('dialogo:opcao', slot, op.rotulo);
    }
  }

  return out;
}

export function medir(casos) {
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
    let piorSlot = Infinity;
    let reusoMax = 0;
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
      reusoMedio: instancias / distintas,
      reusoMax,
      topEsq,
    });
  }
  linhas.sort((a, b) => b.reusoMedio - a.reusoMedio || b.instancias - a.instancias);
  return { linhas, totalTextos };
}

// ---------------------------------------------------------------------
// GUARDA anti-monotonia (E5): pisos por superfície que E1–E4 conquistaram.
// Uma etapa futura que faça uma dessas superfícies regredir a molde raso
// reprova o qa.mjs. Os pisos são o piso ACORDADO (D2: teto 3–4), não o
// valor de pico — folga para variação legítima, trava para regressão.
// ---------------------------------------------------------------------
const PISOS = [
  { superficie: 'abertura', campo: 'piorSlot', min: 2, etapa: 'E1' }, // nenhum passo congelado
  { superficie: 'carta:gen_rigor', campo: 'piorSlot', min: 3, etapa: 'E2' },
  { superficie: 'carta:gen_livores', campo: 'piorSlot', min: 3, etapa: 'E2' },
  { superficie: 'carta:gen_reacao_vital', campo: 'distintas', min: 3, etapa: 'E2' },
  { superficie: 'carta:gen_segredo', campo: 'distintas', min: 4, etapa: 'E3' },
  { superficie: 'carta:gen_sangue_alheio', campo: 'distintas', min: 3, etapa: 'E3' },
  { superficie: 'eco', campo: 'piorSlot', min: 3, etapa: 'E4' },
];

export function guardaMonotonia(linhas) {
  const porNome = new Map(linhas.map((l) => [l.superficie, l]));
  const violacoes = [];
  for (const piso of PISOS) {
    const l = porNome.get(piso.superficie);
    if (!l) {
      violacoes.push(`${piso.superficie} (${piso.etapa}): superfície ausente da medição`);
      continue;
    }
    const valor = l[piso.campo];
    if (valor < piso.min) {
      violacoes.push(`${piso.superficie} (${piso.etapa}): ${piso.campo}=${valor} < piso ${piso.min}`);
    }
  }
  return { ok: violacoes.length === 0, violacoes, pisos: PISOS.length };
}
