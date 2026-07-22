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
import { hashDecisao } from './hash_gerador.js';
import { ITENS_COM_AGUA } from './espaco.js';
import { sortearPonderado, derivarAtributosCompostos, amostrarForasteiro } from './amostragem.js';
import { SOBRENOMES } from './arquetipos.js';
import { quantizarComportamentos } from './quantizacao.js';
import { gerarMundo } from './mundo.js';
import { saoAdjacentes } from './cidade.js';
import { METODOS, metodosElegiveis } from './metodos.js';
import { resolverCrime } from './crime.js';
import { fatiaForenseDoCrime, HORAS_CHEGADA_INTERNO } from './ponte_caso.js';
import { sortearEsqueletoInterferencia, gerarInterferencias } from './interferencia.js';
import { derivarPsiqueDoCaso } from './vetores_psiquicos.js';
import { SINAL_POR_METODO, PROFISSAO_PARA_MARCA, MARCAS_INOCENTES_OFICIO, MARCAS_SITUACIONAIS } from './marcas_exigiveis.js';

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
// noite de 14/out; negativas = 13/out; chegada do perito às 13h).
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
//
// VARIÁVEIS DIRIGIDAS (opts.dirigido, OPCIONAL — modo réplica): permite
// cravar cenário, faixa, método e a escolha de vítima/assassino POR
// ARQUÉTIPO/MÓBIL, para aproximar um caso gerado de um caso de referência.
// Determinístico: os overrides são dados constantes e a resolução de
// empates continua saindo de hashString sobre a seed. Sem `dirigido`, o
// caminho é byte-idêntico ao de sempre (guarda de replay no qa.mjs).
//   dirigido = {
//     cenario?         : 'premeditado' | 'briga_escalada' (recua se impossível),
//     faixa?           : 'noite' | 'madrugada' (só no premeditado),
//     metodoId?        : id de METODOS (respeita elegibilidade INT/cenário),
//     vitimaArquetipo? : id de arquétipo preferido para a vítima,
//     assassinoArquetipo?: id de arquétipo preferido para o assassino,
//     assassinoMotivo? : móbil preferido do assassino (motivoPotencial),
//     fugaVitima?      : 'suprimida' | 'livre' (default 'livre') — a réplica
//                        usa 'suprimida' para o registro ficar idêntico em
//                        fatos ao roteiro canônico (OS confronto estendido §4.8),
//   }
export function gerarCasoBruto(seed, opts = {}) {
  const n = opts.n ?? 8;
  const dirigido = opts.dirigido || null;
  const morfologia = opts.morfologia || null; // só medição/QA (ver gerarMundo)
  const sal = `${salDaSeed(seed)}|caso`;

  // O mundo nasce primeiro (Fases 1–2); a cena elegível vem da escolha
  // abaixo, então o mundo definitivo é gerado após a seleção do local.
  const mundoBase = gerarMundo(seed, { n, morfologia });
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
  const querBriga = dirigido?.cenario
    ? dirigido.cenario === 'briga_escalada'
    : hashString(`${sal}|cenario`) % 3 === 0;
  let cenario = querBriga && paresCoabitantes.length > 0 ? 'briga_escalada' : 'premeditado';

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
    // Vítima: dirigida por arquétipo quando pedida E presente no elenco;
    // senão, a ponderação demográfica de sempre.
    const porArquetipo = dirigido?.vitimaArquetipo
      ? elenco.filter((p) => p.arquetipo === dirigido.vitimaArquetipo)
      : [];
    if (porArquetipo.length > 0) {
      vitima = porArquetipo[hashString(`${sal}|vitimaDirigida`) % porArquetipo.length];
    } else {
      const vitimaId = sortearPonderado(
        elenco.map((p) => ({ valor: p.id, peso: PESO_VITIMA_POR_CLASSE[p.classeSocial] ?? 1 })),
        `${sal}|vitima`
      );
      vitima = elenco.find((p) => p.id === vitimaId);
    }
    const candidatos = elenco.filter((p) => p.id !== vitima.id);
    // Assassino: dirigido por móbil e/ou arquétipo quando satisfazível.
    const preferidos = candidatos.filter(
      (p) =>
        (!dirigido?.assassinoMotivo || p.motivoPotencial === dirigido.assassinoMotivo) &&
        (!dirigido?.assassinoArquetipo || p.arquetipo === dirigido.assassinoArquetipo)
    );
    const bancoAssassino = dirigido && preferidos.length > 0 ? preferidos : candidatos;
    assassino =
      dirigido && preferidos.length > 0
        ? bancoAssassino[hashString(`${sal}|assassinoDirigido`) % bancoAssassino.length]
        : candidatos[hashString(`${sal}|assassino`) % candidatos.length];
    // O premeditado busca a vítima onde a rotina a deixa mais só (noite
    // ou madrugada — o assassino viaja até ela).
    faixa =
      dirigido?.faixa === 'noite' || dirigido?.faixa === 'madrugada'
        ? dirigido.faixa
        : hashString(`${sal}|faixa`) % 2 === 0
          ? 'noite'
          : 'madrugada';
  }

  // 3.5 E3 §4.5 — VÍTIMA-FORASTEIRO (o braço da pousada, moeda === 9,
  // ~10%): o carroceiro de rota hospedado na taverna, morto no quarto de
  // madrugada. A moeda é a MESMA do regime de palco (sal já contratado);
  // o forasteiro é injetado no elenco (namespace próprio de sais), o réu
  // vem do círculo do morto (a taverna à noite) com móbil de dinheiro, e
  // o caso segue o fluxo interno normal (chegada 13h; réu-forasteiro
  // segue vetado por construção — o forasteiro é sempre a vítima).
  const salBaseCasoCedo = salDaSeed(seed);
  const moedaPalco = hashDecisao(`${salBaseCasoCedo}|caso|regime-palco`) % 10;
  let pousada = false;
  let forasteiro = null;
  if (moedaPalco === 9 && !dirigido) {
    const pubPredio = mundoBase.cidade.predios.find((p) => p.tipo === 'pub');
    if (pubPredio) {
      forasteiro = amostrarForasteiro(seed, new Set(elenco.map((p) => p.nome)));
      forasteiro.pacoteEspacial = {
        moradia: pubPredio.id,
        trabalho: pubPredio.id,
        frequentados: [],
        rotina: { dia: pubPredio.id, noite: pubPredio.id, madrugada: pubPredio.id },
      };
      mundoBase.elenco.push(forasteiro);
      vitima = forasteiro;
      cenario = 'premeditado';
      faixa = 'madrugada';
      // Móbil de dinheiro primeiro (dívida de caderneta, de jogo, paga
      // retida — o que se deve a um carroceiro de rota); herança e afins
      // não colam contra quem é de fora. A busca desce: círculo com
      // móbil → vila com móbil → círculo → vila.
      const MOTIVOS_CONTRA_FORASTEIRO = ['divida_caderneta', 'divida_de_jogo', 'salario_atrasado'];
      const candidatosF = elenco.filter((p) => p.id !== forasteiro.id);
      const circuloPub = candidatosF.filter((p) => p.pacoteEspacial.rotina.noite === pubPredio.id);
      const bancoReu =
        [
          circuloPub.filter((p) => MOTIVOS_CONTRA_FORASTEIRO.includes(p.motivoPotencial)),
          candidatosF.filter((p) => MOTIVOS_CONTRA_FORASTEIRO.includes(p.motivoPotencial)),
          circuloPub,
          candidatosF,
        ].find((b) => b.length > 0) || candidatosF;
      assassino = bancoReu[hashDecisao(`${salBaseCasoCedo}|caso|forasteiro|reu`) % bancoReu.length];
      pousada = true;
    }
  }

  // 4. Local e hora: o crime acontece onde a rotina da vítima a põe.
  const localRotinaId = vitima.pacoteEspacial.rotina[faixa];
  const hora = horaDaFaixa(faixa, `${sal}|hora`);

  // 4.5 E2 (OS palco em anéis) — REGIME DE PALCO: moeda determinística por
  // caso (70% interno | 20% logradouro | 10% pousada — o terceiro braço só
  // ativa na E3 e recai em interno até lá). A rotina-base NUNCA muda: o
  // palco externo é o ANEXO do prédio da rotina (pátio↔granja,
  // açude↔moinho, adro↔igreja) ou o destino de um CHAMARIZ (variante do
  // premeditado; todo engodo deposita vestígio — GE6). Sem via possível, a
  // moeda recai em interno (salvaguarda §3.6): nenhum sal existente é
  // tocado e o caso interno permanece byte-idêntico ao de antes da E2.
  const LOGRADOURO_DO_PREDIO = { granja: 'patio_da_granja', moinho: 'caminho_do_acude', igreja: 'adro_da_igreja' };
  // Parecer do perito (E2, A3): a via de ROTINA só ativa em faixa cuja
  // descoberta ao amanhecer é plausível — um morto do meio-dia num pátio
  // ativo jazeria 18h sem ser achado. Pátio e adro (frequentação diurna)
  // ficam alcançáveis só por CHAMARIZ noturno; a descoberta no mesmo dia
  // para crime diurno externo fica registrada para OS futura (exige
  // recalendarizar a chegada do perito).
  const FAIXAS_DO_LOGRADOURO = {
    patio_da_granja: [], // diurno — só por chamariz (noite/madrugada, deserto)
    caminho_do_acude: ['noite'], // o moleiro fecha a comporta ao fim do dia (§1.3e)
    adro_da_igreja: [], // diurno — só por chamariz
  };
  const salBaseCaso = salBaseCasoCedo;
  let palco = null;
  if (!pousada && (moedaPalco === 7 || moedaPalco === 8)) {
    const predioRotina = mundoBase.cidade.predios.find((p) => p.id === localRotinaId);
    const anexo = predioRotina ? LOGRADOURO_DO_PREDIO[predioRotina.tipo] : null;
    if (anexo && FAIXAS_DO_LOGRADOURO[anexo].includes(faixa)) {
      palco = { logradouroId: anexo, via: 'rotina', chamariz: null };
    } else if (cenario === 'premeditado') {
      // Interceptação com chamariz (§3.4b): a vítima é atraída ao
      // logradouro — de noite/madrugada, todos estão desertos (dossiê §1e).
      const tipos = ['adro_da_igreja', 'patio_da_granja', 'caminho_do_acude'];
      const logradouroId = tipos[hashDecisao(`${salBaseCaso}|caso|chamariz|local`) % tipos.length];
      const engodo = ['bilhete', 'recado'][hashDecisao(`${salBaseCaso}|caso|chamariz|engodo`) % 2];
      const outrosDoChamariz = elenco.filter((p) => p.id !== vitima.id && p.id !== assassino.id);
      const portadorId =
        engodo === 'recado' && outrosDoChamariz.length > 0
          ? outrosDoChamariz[hashDecisao(`${salBaseCaso}|caso|chamariz|portador`) % outrosDoChamariz.length].id
          : null;
      palco = { logradouroId, via: 'chamariz', chamariz: { engodo, portadorId } };
    }
  }
  const localId = palco ? palco.logradouroId : localRotinaId;

  // 4.6 E2 — DESCOBERTA DO CORPO (só palco externo; o interno mantém a
  // chegada fixa às 13h — decisão do autor de 18/07, replay preservado).
  // Cena externa é achada ao clarear por quem madruga (dossiê §4: 6h–8h30);
  // o perito chega 2–4h depois da notificação, teto 13h.
  let descoberta = null;
  if (palco) {
    const salD = `${salBaseCaso}|caso|descoberta`;
    const horaDescoberta = 6 + (hashDecisao(`${salD}|hora`) % 11) * 0.25;
    const chegadaPerito = Math.min(13, horaDescoberta + 2 + (hashDecisao(`${salD}|perito`) % 9) * 0.25);
    const PREDIO_DO_LOGRADOURO = { patio_da_granja: 'granja', caminho_do_acude: 'moinho', adro_da_igreja: 'igreja' };
    const predioMae = PREDIO_DO_LOGRADOURO[palco.logradouroId];
    const descobridor = elenco.find(
      (p) =>
        p.id !== vitima.id &&
        p.id !== assassino.id &&
        (p.pacoteEspacial.rotina.dia === predioMae || p.pacoteEspacial.trabalho === predioMae)
    );
    descoberta = {
      hora: Math.round(horaDescoberta * 100) / 100,
      chegadaPerito: Math.round(chegadaPerito * 100) / 100,
      descobridorId: descobridor ? descobridor.id : null,
    };
  }

  // (A seleção do MÉTODO desceu para depois do interior: o afogamento só é
  // elegível quando a cena tem água alcançável — âncora lida do interior — D2.)

  // 5.1 Ouvintes potenciais do ruído (rotina × adjacência, §4.2.5): quem
  // partilha o teto na faixa ouve o abafado; o vizinho, só o audível.
  // Derivado de rotina (idêntica em mundoBase e no mundo definitivo).
  const outros = elenco.filter((p) => p.id !== vitima.id && p.id !== assassino.id);
  const ouvintes = {
    mesmoLocal: outros.filter((p) => p.pacoteEspacial.rotina[faixa] === localId).map((p) => p.id),
    adjacentes: outros
      .filter(
        (p) =>
          p.pacoteEspacial.rotina[faixa] !== localId &&
          saoAdjacentes(mundoBase.cidade, p.pacoteEspacial.rotina[faixa], localId)
      )
      .map((p) => p.id),
  };

  // 5.2 FASE 4 — esqueleto da interferência (pré-crime, só rotina): o
  // sorteio R5 de tipos/atores/faixas e — para `silenciar` — o local do
  // alvo, que entra em locaisElegiveis (LOD: local de interferência tem
  // interior). A materialização completa vem depois da fatia (passo 10).
  const esqueleto = sortearEsqueletoInterferencia({
    seed,
    mundoBase,
    vitimaId: vitima.id,
    assassinoId: assassino.id,
    faixaCrime: faixa,
    localCrimeId: localId,
    ouvintes,
  });

  // 6. O mundo definitivo: interior detalhado SÓ para os locais elegíveis
  // a cena (LOD por relevância — a cena do crime e os locais de
  // interferência sorteados no esqueleto).
  const locaisElegiveis = [...new Set([localId, ...esqueleto.locaisExtras])];
  const mundo = gerarMundo(seed, { n, locaisElegiveis, morfologia });
  if (pousada) mundo.elenco.push(forasteiro);

  // 6.1 P20 (playtest 19/07 r2): homônimo da vítima confunde — como o
  // elenco não modela parentesco, ninguém além dela porta o sobrenome
  // dela (a repetição de sobrenomes entre os DEMAIS segue livre, KB §6).
  // Roda sobre o MUNDO DEFINITIVO (o mundo-base é descartado acima) com
  // sal próprio: só quem colide re-sorteia o sobrenome; nenhum sorteio
  // existente se desloca (paridade preservada).
  const sobrenomeDe = (nomeCompleto) => nomeCompleto.split(' ').pop();
  const sobrenomeVitima = sobrenomeDe(vitima.nome);
  for (const p of mundo.elenco) {
    if (p.id === vitima.id || sobrenomeDe(p.nome) !== sobrenomeVitima) continue;
    const prenome = p.nome.slice(0, p.nome.length - sobrenomeVitima.length - 1);
    const usados = new Set(mundo.elenco.map((x) => x.nome));
    for (let t = 0; t < 50; t++) {
      const s = SOBRENOMES[hashDecisao(`${sal}|renome|${p.id}|${t}`) % SOBRENOMES.length];
      if (s === sobrenomeVitima || s === prenome || usados.has(`${prenome} ${s}`)) continue;
      p.nome = `${prenome} ${s}`;
      break;
    }
  }
  const interior = mundo.interiores[localId];
  const comodoId = comodoDoCrime(interior, faixa);

  // 6.5 Âncoras espaciais da cena (OS confronto estendido §4.3/§4.5, D2):
  // 'agua' existe quando o interior tem um cocho/tanque alcançável (só a
  // forja, e só quando a mobília o sorteou). Sem âncora, afogamento fica fora.
  const ancorasDisponiveis = new Set();
  // E2: 'agua' generaliza do cocho da forja para toda lâmina alcançável
  // (açude, poço, cocho de gado) — lista fechada em espaco.js.
  if (interior.mobilia.some((m) => ITENS_COM_AGUA.includes(m.item))) ancorasDisponiveis.add('agua');

  // 6.6 OS da camada psíquica — a segunda coluna do elenco (sorteio ortogonal
  // do catálogo v1, desencaixe do réu com falso-destoante garantido). Movida
  // para ANTES do crime porque o portão psíquico da vítima (§4.4) pesa
  // resistir × fugir × gritar no resolvedor. Rótulos só em psique.log (build).
  const coabitantesVitimaIds = elenco
    .filter(
      (p) =>
        p.id !== vitima.id &&
        p.id !== assassino.id &&
        ['dia', 'noite', 'madrugada'].some(
          (fx) => p.pacoteEspacial.rotina[fx] === vitima.pacoteEspacial.rotina[fx]
        )
    )
    .map((p) => p.id);
  const psique = derivarPsiqueDoCaso({
    seed,
    elenco: mundo.elenco,
    assassinoId: assassino.id,
    vitimaId: vitima.id,
    cenario,
    coabitantesVitimaIds,
  });

  // 6.7 CASCATA DE FORÇAMENTO (OS priors compostos §3.3, guarda G3):
  // quem teve o vetor forçado (réu sob limiar; falso-destoante) re-deriva
  // INT/WIS/CHA e a quantização pela via única derivarAtributosCompostos,
  // com o sufixo de sal `|forcado|t<k>` — nenhum resíduo pré-forçamento
  // sobrevive no caso (o replay byte a byte é a guarda natural). FOR fica:
  // não é jusante do vetor (N2). Traits e motivo pertencem ao arquétipo —
  // não mudam. Tudo a jusante (método por INT, autobattler, rolagens WIS
  // de interferência, comportamentos do diálogo) lê o elenco JÁ patchado.
  for (const r of psique.log.reamostragens) {
    const pessoa = mundo.elenco.find((p) => p.id === r.pessoaId);
    const dele = psique.log.porPessoa[r.pessoaId];
    const compostos = derivarAtributosCompostos(
      salDaSeed(seed),
      dele.indice,
      pessoa.arquetipo,
      dele.vetorId,
      `|forcado|t${r.tentativas}`
    );
    pessoa.atributos = { FOR: pessoa.atributos.FOR, ...compostos };
    pessoa.comportamentos = quantizarComportamentos(pessoa.atributos, pessoa.traits);
  }
  const assassinoDefinitivo = mundo.elenco.find((p) => p.id === assassino.id);

  // 7. Método: elegíveis por cenário × INT do assassino × âncora da cena
  // (a elaboração é INT; a higiene, WIS — §3.1/§3.2; a âncora é D2). O
  // INT é o PÓS-cascata (o elenco definitivo patchado acima).
  const elegiveis = metodosElegiveis(cenario, assassinoDefinitivo.atributos.INT, ancorasDisponiveis);
  const metodoId =
    dirigido?.metodoId && elegiveis.includes(dirigido.metodoId)
      ? dirigido.metodoId
      : elegiveis[hashString(`${sal}|metodo`) % elegiveis.length];

  // 8. O crime é cometido (autobattler sobre o grid da cena), agora com o
  // portão psíquico da vítima e a fuga dirigida. `fugaVitima: 'suprimida'`
  // (réplica, §4.8) cala a fuga para o registro permanecer idêntico em fatos.
  const fugaSuprimida = dirigido?.fugaVitima === 'suprimida';
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
    portaoPsiquico: psique.portaoVitima,
    fugaSuprimida,
  });

  // 9. Ponte: a fatia forense que o pacote de caso consumirá — com a
  // testemunha do visto-com-vida identificada (alvo possível da FASE 4).
  const fatiaForense = fatiaForenseDoCrime({
    seed,
    mundo,
    crime,
    testemunhaVistoVivoId: esqueleto.testemunhaVistoVivoId,
    // E2: chegada do perito variável no palco externo (descoberta + 2–4h,
    // teto 13h); interno usa a fonte única HORAS_CHEGADA_INTERNO — a mesma
    // hora que o pacote grava em parametrosCena.horasChegada (A3).
    horasChegada: descoberta ? descoberta.chegadaPerito : HORAS_CHEGADA_INTERNO,
    chamariz: palco ? palco.chamariz : null,
  });

  // 9b. MARCAS CORPORAIS EXIGÍVEIS (Inc. 6 do pivô Gabinete Ilustrado):
  // quando o crime teve luta (ferimento_do_agressor existe) E o método
  // tem sinal definido (venenos não têm), o réu carrega a marca-espelho
  // e ≥2 inocentes recebem marca plausível (ruído honesto — OS §4.3).
  // `marcasCorporais`: { [pessoaId]: { marca, descricaoClose, regiao, sede, origem } }
  // O motor JAMAIS lê — é dado de apresentação para o verbo no diálogo.
  const marcasCorporais = {};
  const temFerimentoReu = crime.vestigios.some((v) => v.classe === 'ferimento_do_agressor');
  // O sinal é do método FATAL (crime.metodoId), nunca do iniciado: com
  // troca de arma (B4), a carta gen_sinal_exigivel anuncia pelo fatal
  // (ponte_caso.js) e a marca do réu tem de casar com ela — senão o
  // circuito sinal→exigir→close descasa (diagnóstico 21/07, M1).
  const sinaiDoMetodo = SINAL_POR_METODO[crime.metodoId];
  if (temFerimentoReu && sinaiDoMetodo) {
    marcasCorporais[assassino.id] = {
      marca: sinaiDoMetodo.marca,
      descricaoClose: sinaiDoMetodo.descricaoClose,
      regiao: sinaiDoMetodo.regiao,
      sede: sinaiDoMetodo.sede,
      origem: 'crime',
    };
    const inocentes = mundo.elenco.filter((p) => p.id !== assassino.id && p.id !== vitima.id);
    // Via 1 — marca ocupacional: o arquétipo do inocente mapeia à profissão.
    let marcaOcupAtribuida = false;
    for (const p of inocentes) {
      const marcaId = PROFISSAO_PARA_MARCA[p.arquetipo];
      if (marcaId && MARCAS_INOCENTES_OFICIO[marcaId]) {
        const m = MARCAS_INOCENTES_OFICIO[marcaId];
        marcasCorporais[p.id] = {
          marca: m.marca,
          descricaoClose: m.descricaoClose,
          regiao: m.regiao,
          sede: m.sede,
          origem: 'oficio',
        };
        marcaOcupAtribuida = true;
        break;
      }
    }
    // Via 2 — marca situacional: um segundo inocente (diferente do ocupacional)
    // recebe um evento plausível recente, escolhido por hashString salgado.
    const idsComMarca = new Set(Object.keys(marcasCorporais));
    const candidatosSit = inocentes.filter((p) => !idsComMarca.has(p.id));
    if (candidatosSit.length > 0) {
      const idxPessoa = hashString(`${sal}|marca_sit_pessoa`) % candidatosSit.length;
      const idxMarca = hashString(`${sal}|marca_sit_tipo`) % MARCAS_SITUACIONAIS.length;
      const p = candidatosSit[idxPessoa];
      const m = MARCAS_SITUACIONAIS[idxMarca];
      marcasCorporais[p.id] = {
        marca: m.marca,
        descricaoClose: m.descricaoClose,
        regiao: m.regiao,
        sede: m.sede,
        origem: 'situacional',
      };
    }
    // Fallback: se nenhum ocupacional foi atribuído, o primeiro candidato
    // restante recebe uma situacional extra para atingir o mínimo de 2.
    if (!marcaOcupAtribuida) {
      const idsComMarca2 = new Set(Object.keys(marcasCorporais));
      const restantes = inocentes.filter((p) => !idsComMarca2.has(p.id));
      if (restantes.length > 0) {
        const idxP = hashString(`${sal}|marca_sit2_pessoa`) % restantes.length;
        const idxM = hashString(`${sal}|marca_sit2_tipo`) % MARCAS_SITUACIONAIS.length;
        const p = restantes[idxP];
        const m = MARCAS_SITUACIONAIS[idxM];
        marcasCorporais[p.id] = {
          marca: m.marca,
          descricaoClose: m.descricaoClose,
          regiao: m.regiao,
          sede: m.sede,
          origem: 'situacional',
        };
      }
    }
  }

  const escolha = {
    vitimaId: vitima.id,
    assassinoId: assassino.id,
    cenario,
    metodoId,
    metodo: { mecanismo: METODOS[metodoId].mecanismo, instrumento: METODOS[metodoId].instrumento },
    localId,
    comodoId,
    faixa,
    hora,
    // E2 (metadado gerador-facing; o motor jamais lê): o regime do palco.
    palco: palco
      ? { externo: true, logradouroId: palco.logradouroId, via: palco.via, chamariz: palco.chamariz, descoberta }
      : { externo: false, ...(pousada ? { pousada: true } : {}) },
  };

  // 10. FASE 4 — materialização da interferência: os pedidos do esqueleto
  // viram eventos contingentes completos (rolagem R1, redundância R2,
  // rota e gatilho R3, prenúncio R4), ou descartes com motivo.
  const interferencia = gerarInterferencias({ seed, mundo, crime, fatiaForense, escolha, esqueleto });

  return {
    seed: salDaSeed(seed),
    mundo,
    escolha,
    crime,
    fatiaForense,
    interferencia,
    psique,
    marcasCorporais,
  };
}
