// =====================================================================
// LINTER DE PROSA determinístico — controle de REGRESSÃO da norma de texto.
//
// A geração de prosa já é fiscalizada pelos agentes (editor-critico etc.) e
// pelo checklist do guia; este script protege o texto JÁ COMMITADO contra
// regressão mecânica. Só entra aqui o que é verificável por máquina — o
// julgamento semântico (voz, dedução vazada sutil, brilho) continua sendo
// trabalho do pipeline `revisar-prosa`.
//
// Executar: node scripts/lint-prosa.mjs   (ou npm run lint:prosa)
// Também roda ao final de scripts/qa.mjs, como uma das checagens.
//
// FONTES DOS TEXTOS: os módulos de dados são IMPORTADOS (como o qa.mjs faz)
// e percorridos recursivamente; toda string com mais de ~40 caracteres vira
// um "bloco" com o caminho (arquivo → chave) para o relatório. Um array de
// strings (parágrafos de localidade, falas de diálogo, variantes de eco)
// conta como UM bloco de N parágrafos. `tagsOcultas` e campos de registro
// (proveniência, licença, caminho, url) ficam de fora: não são prosa.
// Exceção de mecanismo: os templates do monólogo e do epílogo vivem em
// constantes NÃO exportadas de src/logic (que a Tarefa não pode tocar) —
// desses dois arquivos o linter extrai os literais de string da própria
// fonte, sem os comentários.
//
// CHEQUES (norma: docs/guia-de-estilo.md + skill anti-padrao-ia):
//   1. formula    — "não X — é Y" e variantes (negação + travessão +
//                   inversão; "que não é"): teto de 1 por ARQUIVO
//                   (proibição nº 1 da skill / guia §4.1).
//   2. travessao  — densidade por bloco: ~1 travessão a cada 2 parágrafos
//                   (guia §4.4); o teto do bloco é ceil(parágrafos / 2).
//   3. lexico     — vocabulário banido de scripts/lexico-banido.mjs
//                   (espelho do grep da skill, nº 9 "dedução vazada").
//   4. exclamacao — máximo de 1 exclamação por bloco (frase de efeito é
//                   racionada — guia §3).
//
// EXCEÇÕES ("decisão de mesa", prevista no guia): a allowlist EXCECOES
// abaixo registra ocorrências admitidas, com motivo. Cada entrada casa por
// arquivo + cheque e, opcionalmente, por prefixo de chave e/ou trecho.
// Regra da casa: exceção nova só entra com justificativa editorial — e as
// marcadas com TODO aguardam revisão humana, não são absolvição.
//
// Saída: relatório por violação (arquivo, chave, trecho) e exit 1 se
// houver qualquer violação não excetuada. Zero dependências novas.
// =====================================================================

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { LEXICO_BANIDO } from './lexico-banido.mjs';

import { PASSOS_ABERTURA, PERGUNTAS_BRIEFING, OPCOES_PERSONAGEM } from '../src/data/abertura.js';
import { CARTAS } from '../src/data/cartas.js';
import { DIALOGOS } from '../src/data/dialogos.js';
import { LOCALIDADES } from '../src/data/localidades.js';
import { ECOS_MESTRE_TUTORIAL } from '../src/data/ecos_mestre.js';
import { ECOS_INTERFERENCIA_PADRAO } from '../src/data/ecos_interferencia.js';
import { GLOSSARIO } from '../src/data/glossario.js';
import { SUSPEITOS } from '../src/data/seed.js';
import { SINAIS, CATALOGO_CAUSAS } from '../src/data/catalogo_causas.js';
import { HABITOS } from '../src/data/curriculo.js';
import { CONSEQUENCIAS_CONFRONTO } from '../src/data/confrontos.js';
import {
  ROTULOS_MECANISMO,
  ROTULOS_INSTRUMENTO,
  ROTULOS_VESTIGIO,
  ROTULOS_ESTADO_CENA,
  ROTULOS_MOTIVO,
  ROTULOS_PERIFERICO,
  ROTULOS_EXPLICACAO,
} from '../src/data/rotulos.js';
import { CATALOGO_INTERFERENCIA, PROSA_PRENUNCIO } from '../src/gerador/interferencia.js';
import { montarPacoteTutorial } from '../src/data/pacote_caso.js';

// ---------------------------------------------------------------------
// Fontes: arquivo → raízes exportadas. O pacote do caso-escola entra por
// último como REDE DE SEGURANÇA (agrega tudo o que o motor carrega): o que
// já foi coletado dos módulos crus é deduplicado por conteúdo, então só
// sobra dele o que nenhum módulo direto cobriu.
// ---------------------------------------------------------------------
const FONTES = [
  ['src/data/abertura.js', { PASSOS_ABERTURA, PERGUNTAS_BRIEFING, OPCOES_PERSONAGEM }],
  ['src/data/cartas.js', { CARTAS }],
  ['src/data/dialogos.js', { DIALOGOS }],
  ['src/data/localidades.js', { LOCALIDADES }],
  ['src/data/ecos_mestre.js', { ECOS_MESTRE_TUTORIAL }],
  ['src/data/ecos_interferencia.js', { ECOS_INTERFERENCIA_PADRAO }],
  ['src/data/glossario.js', { GLOSSARIO }],
  ['src/data/seed.js', { SUSPEITOS }],
  ['src/data/catalogo_causas.js', { SINAIS, CATALOGO_CAUSAS }],
  ['src/data/curriculo.js', { HABITOS }],
  ['src/data/confrontos.js', { CONSEQUENCIAS_CONFRONTO }],
  [
    'src/data/rotulos.js',
    {
      ROTULOS_MECANISMO,
      ROTULOS_INSTRUMENTO,
      ROTULOS_VESTIGIO,
      ROTULOS_ESTADO_CENA,
      ROTULOS_MOTIVO,
      ROTULOS_PERIFERICO,
      ROTULOS_EXPLICACAO,
    },
  ],
  ['src/gerador/interferencia.js', { CATALOGO_INTERFERENCIA, PROSA_PRENUNCIO }],
  ['src/data/pacote_caso.js', { pacoteTutorial: montarPacoteTutorial() }],
];

// Arquivos cuja prosa vive em constantes não exportadas (templates): os
// literais são extraídos da própria fonte.
const FONTES_POR_LITERAL = ['src/logic/monologo.js', 'src/logic/epilogo.js'];

const MIN_CARACTERES = 40;
const CHAVES_IGNORADAS = new Set(['tagsOcultas', 'proveniencia', 'licenca', 'caminho', 'url']);

// ---------------------------------------------------------------------
// ALLOWLIST — ocorrências admitidas por decisão de mesa.
// Campos: arquivo (exato), cheque (exato), chave (prefixo, opcional),
// trecho (substring do trecho relatado, opcional), motivo (obrigatório).
// TODO(revisão editorial): as entradas abaixo registram o estado da base em
// jul/2026 — foram LISTADAS, não absolvidas. Cada uma aguarda parecer do
// pipeline revisar-prosa; a que perder o parecer sai daqui e o texto é
// reescrito.
// ---------------------------------------------------------------------
const EXCECOES = [
  // --- Pares de travessões parentéticos (aposto), não muleta rítmica ---
  {
    arquivo: 'src/data/cartas.js',
    cheque: 'travessao',
    chave: 'CARTAS[ev_anel_encomenda].descricao',
    motivo: 'par de travessões citando a encomenda gravada — pontuação de citação',
  },
  {
    arquivo: 'src/data/dialogos.js',
    cheque: 'travessao',
    chave: 'DIALOGOS.interrogatorio_silas.nos.confronto_estalagem.fala',
    motivo: 'par parentético: a lista do que se conta na estalagem, dentro da rubrica',
  },
  {
    arquivo: 'src/data/dialogos.js',
    cheque: 'travessao',
    chave: 'DIALOGOS.interrogatorio_silas.nos.confronto_livro.fala',
    motivo: 'par parentético: a lista dos consertos reentrados, dentro da rubrica',
  },
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'travessao',
    chave: 'GLOSSARIO[livor_mortis]',
    motivo: 'aposto técnico entre travessões, registro de laudo (guia §5)',
  },
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'travessao',
    chave: 'GLOSSARIO[rotina_interrompida]',
    motivo: 'aposto técnico entre travessões, registro de laudo (guia §5)',
  },
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'travessao',
    chave: 'GLOSSARIO[registro_mecanico]',
    motivo: 'aposto técnico entre travessões, registro de laudo (guia §5)',
  },
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'travessao',
    chave: 'GLOSSARIO[ipm_convergencia]',
    motivo: 'aposto técnico entre travessões, registro de laudo (guia §5)',
  },
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'travessao',
    chave: 'GLOSSARIO[sulco_obliquo]',
    motivo: 'aposto técnico entre travessões, registro de laudo (guia §5)',
  },
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'travessao',
    chave: 'GLOSSARIO[ferida_incisa]',
    motivo: 'aposto técnico entre travessões, registro de laudo (guia §5)',
  },
  {
    arquivo: 'src/logic/epilogo.js',
    cheque: 'travessao',
    trecho: 'fórmula de costume',
    motivo: 'par parentético citando a fórmula do inquérito',
  },
  // --- Fórmula: apostos técnicos que o regex confunde com a inversão ---
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'formula',
    chave: 'GLOSSARIO[livor_mortis]',
    motivo: 'aposto técnico ("não esmaecem sob pressão" entre travessões), não fórmula retórica',
  },
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'formula',
    chave: 'GLOSSARIO[registro_mecanico]',
    motivo: 'condição técnica ("se roda e ponteiros não concordam — …"), não fórmula retórica',
  },
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'formula',
    chave: 'GLOSSARIO[espasmo_cadaverico]',
    motivo: 'negativa técnica sobre forja post-mortem, não fórmula retórica',
  },
  // --- Léxico banido: usos técnicos, voz do perito ou falso positivo ---
  {
    arquivo: 'src/data/dialogos.js',
    cheque: 'lexico:sem_pressa',
    chave: 'DIALOGOS.dialogo_davey.nos.b2_cordial.fala',
    motivo: 'gesto observável do aprendiz em cena presenciada (guia §2.1); manter sob vigia',
  },
  {
    arquivo: 'src/data/ecos_mestre.js',
    cheque: 'lexico:demais',
    chave: 'ECOS_MESTRE_TUTORIAL.porCodigo.janela_imprecisa',
    motivo: 'leitura técnica do mestre sobre a janela que o PRÓPRIO jogador firmou (guia §2.4)',
  },
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'lexico:forjado',
    chave: 'GLOSSARIO[espasmo_cadaverico]',
    motivo: 'uso técnico: o verbete NEGA a possibilidade de forja, não conclui encenação',
  },
  {
    arquivo: 'src/data/glossario.js',
    cheque: 'lexico:estranho',
    chave: 'GLOSSARIO[transferencia_vestigios]',
    motivo: '"estranhos um ao outro" = alheios entre si, sentido técnico do verbete',
  },
  {
    arquivo: 'src/logic/monologo.js',
    cheque: 'lexico:sem_pressa',
    trecho: 'Guardo os instrumentos sem pressa',
    motivo: 'voz do perito sobre o próprio gesto, não juízo sobre quem não está em cena',
  },
  {
    arquivo: 'src/logic/monologo.js',
    cheque: 'lexico:sem_pressa',
    trecho: 'sai da sala sem pressa',
    motivo: 'o perito descreve o réu saindo diante dele — cena presenciada',
  },
  {
    arquivo: 'src/logic/monologo.js',
    cheque: 'lexico:demais',
    trecho: 'larga demais para acusar alguém',
    motivo: 'o perito julga a PRÓPRIA janela no monólogo — autocrítica, não dedução vazada',
  },
  {
    arquivo: 'src/logic/epilogo.js',
    cheque: 'lexico:estranho',
    trecho: 'diante de estranhos',
    motivo: 'substantivo (desconhecidos), não adjetivo de juízo — falso positivo do radical',
  },
];

// ---------------------------------------------------------------------
// Coleta de blocos.
// ---------------------------------------------------------------------
const blocos = [];
const conteudosVistos = new Set();

function registrarBloco(arquivo, chave, paragrafos) {
  const conteudo = paragrafos.join('\n');
  if (conteudo.length <= MIN_CARACTERES || conteudosVistos.has(conteudo)) return;
  conteudosVistos.add(conteudo);
  blocos.push({ arquivo, chave, paragrafos });
}

function coletar(valor, arquivo, chave) {
  if (typeof valor === 'string') {
    registrarBloco(arquivo, chave, [valor]);
    return;
  }
  if (Array.isArray(valor)) {
    // Array só de strings = um bloco de N parágrafos (prosa de localidade,
    // falas, variantes de eco) — a densidade de travessão mede sobre ele.
    if (valor.length && valor.every((v) => typeof v === 'string')) {
      registrarBloco(arquivo, chave, valor.filter((v) => v.trim().length));
      return;
    }
    valor.forEach((v, i) => {
      const rotulo = v && typeof v === 'object' && typeof v.id === 'string' ? v.id : i;
      coletar(v, arquivo, `${chave}[${rotulo}]`);
    });
    return;
  }
  if (valor && typeof valor === 'object') {
    for (const [k, v] of Object.entries(valor)) {
      if (CHAVES_IGNORADAS.has(k)) continue;
      coletar(v, arquivo, chave ? `${chave}.${k}` : k);
    }
  }
}

// Extrai literais de string (aspas simples, duplas e template) da fonte de
// um arquivo, ignorando comentários — os templates do monólogo/epílogo não
// são exportados, e importar a lógica não alcançaria as strings dos moldes.
function coletarLiteraisDaFonte(caminhoRelativo) {
  const abs = fileURLToPath(new URL(`../${caminhoRelativo}`, import.meta.url));
  const fonte = readFileSync(abs, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ''))
    .replace(/\/\/.*$/gm, '');
  const reLiteral = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  for (const m of fonte.matchAll(reLiteral)) {
    const texto = m[1] ?? m[2] ?? m[3];
    if (!texto || texto.length <= MIN_CARACTERES) continue;
    const linha = fonte.slice(0, m.index).split('\n').length;
    registrarBloco(caminhoRelativo, `linha ${linha}`, [texto]);
  }
}

for (const [arquivo, raizes] of FONTES) coletar(raizes, arquivo, '');
for (const arquivo of FONTES_POR_LITERAL) coletarLiteraisDaFonte(arquivo);

// ---------------------------------------------------------------------
// Cheques.
// ---------------------------------------------------------------------
const RE_FORMULA_TRAVESSAO = /\b(?:não|nem)\b[^—.!?…;\n]{2,60}—/giu;
const RE_FORMULA_INVERSAO = /\bque não é\b/giu;

function trechoEm(texto, indice, raio = 45) {
  const inicio = Math.max(0, indice - raio);
  const fim = Math.min(texto.length, indice + raio);
  return `${inicio > 0 ? '…' : ''}${texto.slice(inicio, fim).replace(/\n/g, ' ')}${fim < texto.length ? '…' : ''}`;
}

const violacoes = []; // { arquivo, chave, cheque, trecho, detalhe }

// (1) Fórmula "não X — é Y": ocorrências coletadas por bloco, teto avaliado
// por ARQUIVO (a proibição é "máximo uma por arquivo").
const formulasPorArquivo = new Map();
for (const bloco of blocos) {
  const texto = bloco.paragrafos.join('\n');
  for (const re of [RE_FORMULA_TRAVESSAO, RE_FORMULA_INVERSAO]) {
    for (const m of texto.matchAll(re)) {
      const ocorrencia = {
        arquivo: bloco.arquivo,
        chave: bloco.chave,
        cheque: 'formula',
        trecho: trechoEm(texto, m.index),
        detalhe: 'negação + travessão + inversão (skill nº 1; teto: 1 por arquivo)',
      };
      if (!formulasPorArquivo.has(bloco.arquivo)) formulasPorArquivo.set(bloco.arquivo, []);
      formulasPorArquivo.get(bloco.arquivo).push(ocorrencia);
    }
  }
}

// (2–4) Cheques por bloco.
for (const bloco of blocos) {
  const texto = bloco.paragrafos.join('\n');

  const travessoes = (texto.match(/—/g) || []).length;
  const tetoTravessao = Math.ceil(bloco.paragrafos.length / 2);
  if (travessoes > tetoTravessao) {
    violacoes.push({
      arquivo: bloco.arquivo,
      chave: bloco.chave,
      cheque: 'travessao',
      trecho: trechoEm(texto, texto.indexOf('—')),
      detalhe: `${travessoes} travessões em ${bloco.paragrafos.length} parágrafo(s); teto ${tetoTravessao} (guia §4.4)`,
    });
  }

  for (const termo of LEXICO_BANIDO) {
    for (const m of texto.matchAll(new RegExp(termo.padrao, 'giu'))) {
      violacoes.push({
        arquivo: bloco.arquivo,
        chave: bloco.chave,
        cheque: `lexico:${termo.id}`,
        trecho: trechoEm(texto, m.index),
        detalhe: termo.motivo,
      });
    }
  }

  const exclamacoes = (texto.match(/!/g) || []).length;
  if (exclamacoes > 1) {
    violacoes.push({
      arquivo: bloco.arquivo,
      chave: bloco.chave,
      cheque: 'exclamacao',
      trecho: trechoEm(texto, texto.indexOf('!')),
      detalhe: `${exclamacoes} exclamações no bloco; teto 1 (guia §3)`,
    });
  }
}

// ---------------------------------------------------------------------
// Allowlist e teto da fórmula.
// ---------------------------------------------------------------------
const excecoesUsadas = new Set();
function excetuada(v) {
  for (const [i, e] of EXCECOES.entries()) {
    const casa =
      e.arquivo === v.arquivo &&
      e.cheque === v.cheque &&
      (!e.chave || v.chave.startsWith(e.chave)) &&
      (!e.trecho || v.trecho.includes(e.trecho));
    if (casa) {
      excecoesUsadas.add(i);
      return true;
    }
  }
  return false;
}

// A exceção da fórmula remove a ocorrência ANTES da conta do teto — é assim
// que a "melhor do arquivo" é mantida sem estourar a régua.
for (const [, ocorrencias] of formulasPorArquivo) {
  const restantes = ocorrencias.filter((o) => !excetuada(o));
  if (restantes.length > 1) violacoes.push(...restantes);
}

const violacoesFinais = violacoes.filter((v) => !excetuada(v));

// ---------------------------------------------------------------------
// Relatório.
// ---------------------------------------------------------------------
console.log(`lint-prosa: ${blocos.length} blocos de texto examinados em ${FONTES.length + FONTES_POR_LITERAL.length} fontes.`);
if (excecoesUsadas.size) {
  console.log(`lint-prosa: ${excecoesUsadas.size} exceção(ões) da allowlist aplicada(s) — pendentes de revisão editorial onde marcado TODO.`);
}
const excecoesMortas = EXCECOES.filter((_, i) => !excecoesUsadas.has(i));
if (excecoesMortas.length) {
  console.log('lint-prosa: exceções que não casam com nada (remover da allowlist):');
  for (const e of excecoesMortas) console.log(`  · ${e.arquivo} [${e.cheque}] ${e.chave || e.trecho || ''}`);
}

if (violacoesFinais.length) {
  console.log(`\nlint-prosa: ${violacoesFinais.length} violação(ões):\n`);
  for (const v of violacoesFinais) {
    console.log(`✖ ${v.arquivo} → ${v.chave} [${v.cheque}]`);
    console.log(`  ${v.detalhe}`);
    console.log(`  "${v.trecho}"\n`);
  }
  process.exit(1);
}
console.log('lint-prosa: nenhuma violação.');
process.exit(0);
