// =====================================================================
// DEMONSTRAÇÃO DO RESOLVEDOR DE CRIME (FASE 3 do gerador por simulação).
//
// Imprime, legível, o caso bruto que o gerador comete para uma seed: a
// escolha (vítima, assassino, cenário, método, local, hora), a batalha
// (tentativas rejeitadas e a aceita), os eventos, os vestígios sobre o
// mapa ASCII do grid da cena e a fatia forense da ponte. É a inspeção
// de plausibilidade do portão da fase ("os vestígios, na planta
// explorável, contam a história do registro"). Nada aqui entra no jogo:
// é vitrine do build time.
//
// Uso:
//   npm run demo:crime                → as 3 seeds padrão do QA
//   node scripts/demo-crime.mjs xyz   → só a seed "xyz"
// =====================================================================

import { gerarCasoBruto } from '../src/gerador/caso.js';
import { METODOS, CENARIOS } from '../src/gerador/metodos.js';
import { CLASSES_VESTIGIO } from '../src/gerador/vestigios.js';

const seeds = process.argv[2]
  ? [process.argv[2]]
  : ['a_hora_emprestada', 'vila_do_moinho', 'caso_do_charco'];

// Hora absoluta → rótulo humano (0 = meia-noite de 14/out).
function horaLegivel(h) {
  const dia = h < 0 ? '13/out' : '14/out';
  const horas = ((h % 24) + 24) % 24;
  return `${String(horas).padStart(2, '0')}h de ${dia}`;
}

// Mapa ASCII da cena: letra do cômodo; '■' mobília; '†' corpo; '✱' vestígio.
function asciiDaCena(interior, crime) {
  const letras = {};
  interior.comodos.forEach((c, i) => {
    letras[c.id] = String.fromCharCode(97 + i);
  });
  const celulasVestigio = new Set(
    crime.vestigios
      .filter((v) => !v.removido && v.celula)
      .flatMap((v) => (v.celulas || [v.celula]).map((c) => `${c.col}|${c.fila}`))
  );
  const corpo = `${crime.posicaoCorpo.celula.col}|${crime.posicaoCorpo.celula.fila}`;
  const linhas = [];
  for (let fila = 0; fila < interior.grid.filas; fila++) {
    let linha = '';
    for (let col = 0; col < interior.grid.colunas; col++) {
      const chave = `${col}|${fila}`;
      const comodo = interior.comodos.find(
        (c) => col >= c.ret.col && col < c.ret.col + c.ret.colunas && fila >= c.ret.fila && fila < c.ret.fila + c.ret.filas
      );
      const peca = interior.mobilia.some((m) => m.celula.col === col && m.celula.fila === fila);
      linha +=
        chave === corpo ? '†' : celulasVestigio.has(chave) ? '✱' : peca ? '■' : comodo ? letras[comodo.id] : '·';
    }
    linhas.push(`      ${linha}`);
  }
  for (const c of interior.comodos) linhas.push(`      ${letras[c.id]} = ${c.rotulo}`);
  return linhas.join('\n');
}

for (const seed of seeds) {
  const caso = gerarCasoBruto(seed);
  const { mundo, escolha, crime, fatiaForense } = caso;
  const nome = (id) => mundo.elenco.find((p) => p.id === id)?.nome ?? id;
  const pessoa = (id) => {
    const p = mundo.elenco.find((x) => x.id === id);
    return `${p.nome} (${p.profissao}; FOR ${p.atributos.FOR} INT ${p.atributos.INT} WIS ${p.atributos.WIS} CHA ${p.atributos.CHA})`;
  };

  console.log(`\n${'='.repeat(70)}`);
  console.log(`=== O CRIME DA SEED "${seed}" ===`);
  console.log(`\n· Vítima:    ${pessoa(escolha.vitimaId)}`);
  console.log(`· Assassino: ${pessoa(escolha.assassinoId)} — quadrante ${crime.metadados.quadrante}`);
  console.log(`· Cenário:   ${CENARIOS[escolha.cenario].rotulo}`);
  console.log(`· Método:    ${METODOS[escolha.metodoId].rotulo}`);
  const predio = mundo.cidade.predios.find((p) => p.id === escolha.localId);
  console.log(`· Cena:      ${predio.rotulo} (${escolha.comodoId}), faixa ${escolha.faixa}, ${horaLegivel(escolha.hora)}`);
  console.log(`· Móbil:     ${mundo.elenco.find((p) => p.id === escolha.assassinoId).motivoPotencial}`);

  const b = crime.batalha;
  if (b.suprimida) {
    console.log(`\n· Batalha suprimida (veneno) — sem confronto.`);
  } else {
    console.log(
      `\n· Batalha: ${b.tentativasDescartadas.length} tentativa(s) rejeitada(s) ` +
        `[${b.tentativasDescartadas.map((t) => t.motivo).join(', ') || '—'}]; ` +
        `aceita a #${b.tentativaAceita} com ${b.rodadas} rodada(s)${b.desespero ? ' (DESESPERO)' : ''}.`
    );
  }

  console.log(`\n· Eventos (${crime.eventos.length}):`);
  for (const e of crime.eventos) {
    const onde = e.celula ? ` @(${e.celula.col},${e.celula.fila})` : '';
    const dep = e.vestigiosDepositados.length ? ` ⊕${e.vestigiosDepositados.join(',')}` : '';
    const rem = e.vestigiosRemovidos.length ? ` ⊖${e.vestigiosRemovidos.join(',')}` : '';
    console.log(`    ${String(e.ordem).padStart(2)}. ${nome(e.ator)} — ${e.acao}${onde}${dep}${rem}${e.detalhe ? ` (${e.detalhe})` : ''}`);
  }

  console.log(`\n· Vestígios (✱ sobrevive, ⊘ removido pela limpeza):`);
  for (const v of crime.vestigios) {
    const marca = v.removido ? '⊘' : '✱';
    const onde = v.celula ? ` @(${v.celula.col},${v.celula.fila})` : ' (fora da cena)';
    console.log(`    ${marca} ${v.id} ${CLASSES_VESTIGIO[v.classe].rotulo} [ordem ${v.ordem}]${onde} — ${v.detalhe}`);
  }

  console.log(`\n· Variáveis evidenciadas: ${JSON.stringify(crime.variaveis)}`);
  if (crime.metadados.variaveisInertes.length) {
    console.log(`· Variáveis inertes (sem testemunha física): ${crime.metadados.variaveisInertes.join('; ')}`);
  }
  console.log(`· Cena encenada (corpo movido): ${crime.cenaEncenada ? 'sim' : 'não'}`);

  console.log(`\n· A cena († corpo, ✱ vestígio, ■ mobília):`);
  console.log(asciiDaCena(mundo.interiores[escolha.localId], crime));

  console.log(`\n· Fatia forense (ponte): ${fatiaForense.cartas.length} cartas — ${fatiaForense.cartas.map((c) => c.id).join(', ')}`);
  console.log(
    `· Verdade de Ouro: réu ${nome(fatiaForense.verdadeDeOuro.reuCorreto)}, morte ${horaLegivel(
      fatiaForense.verdadeDeOuro.horaMorteAbsoluta
    )}, mecanismo ${fatiaForense.verdadeDeOuro.mecanismoCorreto}, móbil ${fatiaForense.verdadeDeOuro.motivacaoCorreta}`
  );
}
