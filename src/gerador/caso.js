// =====================================================================
// GERAÇÃO DO CASO BRUTO — orquestrador da FASE 3 (design em
// docs/game-design-simulacao.md §2 e §4.2).
//
// Módulo GERADOR-FACING (o runtime jamais o importa; guarda no qa.mjs).
//
// ORDEM DE GERAÇÃO (normativa, §4.2): cidade → elenco → inserção →
// SELEÇÃO DA CENA DO CRIME → autobattler no grid da cena →
// RegistroDoCrime georreferenciado → fatia forense (ponte_caso.js).
//
// A seleção respeita a hierarquia de variedade entre seeds (§4.1):
// quadrante do assassino × tipo de cenário × output do autobattler ×
// composição do elenco. Toda escolha sai de hashString salgado; mesma
// seed → mesmo caso bruto, byte a byte (incluída a sequência de batalhas
// descartadas — guarda de replay no qa.mjs).
// =====================================================================

import { hashString } from '../logic/hash.js';
import { sortearPonderado } from './amostragem.js';
import { gerarMundo } from './mundo.js';
import { saoAdjacentes } from './cidade.js';
import { METODOS, metodosElegiveis } from './metodos.js';
import { resolverCrime } from './crime.js';
import { fatiaForenseDoCrime } from './ponte_caso.js';

function salDaSeed(seed) {
  return typeof seed === 'string' ? seed : seed?.id || 'caso';
}

// Quem tem o que tirar pesa mais como vítima (herança, cofre, salário
// devido): peso demográfico invertido da pirâmide social.
const PESO_VITIMA_POR_CLASSE = {
  gentry: 5,
  comerciante: 4,
  profissional: 3,
  clero: 2,
  artesao: 2,
  lavrador: 1,
  criadagem: 1,
  servico_do_condado: 1,
};

// Hora absoluta do crime por faixa de rotina (escala do jogo: 0 = meia-
// noite de 14/out; negativas = 13/out; chegada do perito às 11h).
function horaDaFaixa(faixa, chave) {
  if (faixa === 'noite') return -3 + (hashString(chave) % 3); // 21h–23h de 13/out
  if (faixa === 'madrugada') return 1 + (hashString(chave) % 3); // 1h–3h de 14/out
  return -12 + (hashString(chave) % 3); // dia de 13/out (12h–14h) — briga de trabalho
}

// O cômodo onde o confronto começa: de madrugada, o quarto (a vítima
// dorme); nas demais faixas, o maior cômodo (a vida acontece nele).
function comodoDoCrime(interior, faixa) {
  if (faixa === 'madrugada') {
    const quarto = interior.comodos.find((c) => c.tipoComodo === 'quarto');
    if (quarto) return quarto.id;
  }
  let maior = interior.comodos[0];
  for (const c of interior.comodos) {
    if (c.ret.colunas * c.ret.filas > maior.ret.colunas * maior.ret.filas) maior = c;
  }
  return maior.id;
}

// Gera o caso bruto de uma seed: mundo + escolha do crime + registro do
// autobattler + fatia forense consumível pelo motor.
export function gerarCasoBruto(seed, opts = {}) {
  const n = opts.n ?? 8;
  const sal = `${salDaSeed(seed)}|caso`;

  // O mundo nasce primeiro (Fases 1–2); a cena elegível vem da escolha
  // abaixo, então o mundo definitivo é gerado após a seleção do local.
  const mundoBase = gerarMundo(seed, { n });
  const elenco = mundoBase.elenco;

  // 1. Cenário: ~1/3 briga escalada. A briga exige um PAR coabitante —
  // dois que partilham lugar numa faixa de rotina (dia ou noite): o
  // motivo é imediato e nasce da convivência (§2.2), então o par é
  // sorteado JUNTO; sem par possível, o caso recua a premeditado.
  const paresCoabitantes = [];
  for (let i = 0; i < elenco.length; i++) {
    for (let j = i + 1; j < elenco.length; j++) {
      for (const fx of ['dia', 'noite']) {
        if (elenco[i].pacoteEspacial.rotina[fx] === elenco[j].pacoteEspacial.rotina[fx]) {
          paresCoabitantes.push({ a: elenco[i], b: elenco[j], faixa: fx });
        }
      }
    }
  }
  const querBriga = hashString(`${sal}|cenario`) % 3 === 0;
  const cenario = querBriga && paresCoabitantes.length > 0 ? 'briga_escalada' : 'premeditado';

  // 2–3. Vítima e assassino. Na briga, o par coabitante decide os dois
  // (quem morre é sorteio — o confronto era simétrico). No premeditado,
  // a vítima é ponderada por classe (quem tem o que tirar) e o assassino
  // é qualquer outro do elenco (o motivo potencial da Fase 1 é o móbil).
  let vitima;
  let assassino;
  let faixa;
  if (cenario === 'briga_escalada') {
    const par = paresCoabitantes[hashString(`${sal}|parBriga`) % paresCoabitantes.length];
    const morreuA = hashString(`${sal}|quemMorre`) % 2 === 0;
    vitima = morreuA ? par.a : par.b;
    assassino = morreuA ? par.b : par.a;
    faixa = par.faixa;
  } else {
    const vitimaId = sortearPonderado(
      elenco.map((p) => ({ valor: p.id, peso: PESO_VITIMA_POR_CLASSE[p.classeSocial] ?? 1 })),
      `${sal}|vitima`
    );
    vitima = elenco.find((p) => p.id === vitimaId);
    const candidatos = elenco.filter((p) => p.id !== vitima.id);
    assassino = candidatos[hashString(`${sal}|assassino`) % candidatos.length];
    // O premeditado busca a vítima onde a rotina a deixa mais só (noite
    // ou madrugada — o assassino viaja até ela).
    faixa = hashString(`${sal}|faixa`) % 2 === 0 ? 'noite' : 'madrugada';
  }

  // 4. Local e hora: o crime acontece onde a rotina da vítima a põe.
  const localId = vitima.pacoteEspacial.rotina[faixa];
  const hora = horaDaFaixa(faixa, `${sal}|hora`);

  // 5. Método: elegíveis por cenário × INT do assassino (a elaboração é
  // INT; a higiene, WIS — §3.1/§3.2).
  const elegiveis = metodosElegiveis(cenario, assassino.atributos.INT);
  const metodoId = elegiveis[hashString(`${sal}|metodo`) % elegiveis.length];

  // 6. O mundo definitivo: interior detalhado SÓ para a cena do crime
  // (LOD por relevância — a cena é o local elegível desta fase).
  const mundo = gerarMundo(seed, { n, locaisElegiveis: [localId] });
  const interior = mundo.interiores[localId];
  const comodoId = comodoDoCrime(interior, faixa);

  // 7. Ouvintes potenciais do ruído (rotina × adjacência, §4.2.5): quem
  // partilha o teto na faixa ouve o abafado; o vizinho, só o audível.
  const outros = mundo.elenco.filter((p) => p.id !== vitima.id && p.id !== assassino.id);
  const ouvintes = {
    mesmoLocal: outros.filter((p) => p.pacoteEspacial.rotina[faixa] === localId).map((p) => p.id),
    adjacentes: outros
      .filter(
        (p) =>
          p.pacoteEspacial.rotina[faixa] !== localId &&
          saoAdjacentes(mundo.cidade, p.pacoteEspacial.rotina[faixa], localId)
      )
      .map((p) => p.id),
  };

  // 8. O crime é cometido (autobattler sobre o grid da cena).
  const crime = resolverCrime({
    assassino: mundo.elenco.find((p) => p.id === assassino.id),
    vitima: mundo.elenco.find((p) => p.id === vitima.id),
    metodoId,
    cenario,
    interior,
    comodoId,
    hora,
    faixa,
    ouvintes,
    seed,
  });

  // 9. Ponte: a fatia forense que o pacote de caso consumirá.
  const fatiaForense = fatiaForenseDoCrime({ seed, mundo, crime });

  return {
    seed: salDaSeed(seed),
    mundo,
    escolha: {
      vitimaId: vitima.id,
      assassinoId: assassino.id,
      cenario,
      metodoId,
      metodo: { mecanismo: METODOS[metodoId].mecanismo, instrumento: METODOS[metodoId].instrumento },
      localId,
      comodoId,
      faixa,
      hora,
    },
    crime,
    fatiaForense,
  };
}
