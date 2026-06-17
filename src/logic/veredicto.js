// =====================================================================
// O Tribunal — calcularVeredicto(libelo, conclusoes, cartasRegistradas, seed)
//
// Função pura. É a ÚNICA camada que valida: compara o que o jogador
// AFIRMOU (tagsOcultas das conclusões e cartas do Libelo) contra a Verdade
// de Ouro (seed). As afirmações chegam da gramática universal — a janela
// pela triangulação do Cronos, o mecanismo pela eliminação no catálogo da
// Aitiov — mas o motor não sabe disso: lê só tags. Julga:
//   • réu afirmado vs. réu real;
//   • janela afirmada vs. hora real (deve contê-la; largura ≤ 6h = precisa);
//   • mecanismo cravado vs. mecanismo real (+ instrumento, no Nexo).
// Devolve { tipo, acertos, falhas, perifericos, dadosMonologo } para os 4
// desfechos do §11. Nunca lê textos nem nomes: apenas tags e seed.
// =====================================================================

import { janelaDaCarta } from './cronos.js';
import { intersecaoJanelas } from './tempo_morte.js';
import { mecanismoCravado } from '../data/catalogo_causas.js';
import {
  analisarLigacoes,
  refutacaoDeHoraEstabelecida,
  refutacaoDeAlibiEstabelecida,
  segredoRevelado,
} from './acusacao.js';

const LARGURA_JANELA_PRECISA = 6; // horas: acima disso, a defesa fala em "estimativa frouxa"

function buscar(lista, id) {
  if (!id) return null;
  return lista.find((item) => item.id === id) || null;
}

export function calcularVeredicto(libelo, conclusoes, cartasRegistradas, seed) {
  const falhas = [];
  const acertos = [];

  // ---------- Réu ----------
  const reuCorreto = libelo.reuId === seed.reuCorreto;
  if (reuCorreto) acertos.push({ codigo: 'reu' });
  else falhas.push({ codigo: 'reu_errado' });

  // ---------- Evidências do corpo ----------
  const evidenciasCorpo = (libelo.evidenciasCorpoIds || [])
    .map((id) => buscar(cartasRegistradas, id))
    .filter(Boolean);
  const evidenciasValidas = evidenciasCorpo.filter(
    (c) =>
      ['temporal', 'causal'].includes(c.tagsOcultas.dominio) && !c.tagsOcultas.inconclusiva
  );
  const evidenciasOk = evidenciasValidas.length >= 1;
  if (evidenciasOk) acertos.push({ codigo: 'evidencias_corpo' });
  else falhas.push({ codigo: 'corpo_sem_substancia' });

  // ---------- Pilar Quando ----------
  const conclusaoCronos = buscar(conclusoes, libelo.conclusaoCronosId);
  const janela =
    conclusaoCronos && conclusaoCronos.tagsOcultas.tipo === 'janela'
      ? { inicio: conclusaoCronos.tagsOcultas.inicio, fim: conclusaoCronos.tagsOcultas.fim }
      : null;
  const janelaOk =
    !!janela && janela.inicio <= seed.horaMorteAbsoluta && seed.horaMorteAbsoluta <= janela.fim;
  const janelaPrecisa = janelaOk && janela.fim - janela.inicio <= LARGURA_JANELA_PRECISA;
  if (!janela) falhas.push({ codigo: 'sem_janela' });
  else if (!janelaOk) falhas.push({ codigo: 'janela_nao_cobre' });
  else if (!janelaPrecisa) falhas.push({ codigo: 'janela_imprecisa' });
  if (janelaOk) acertos.push({ codigo: 'janela' });

  // ---------- Pilar Como ----------
  const conclusaoMecanismo = buscar(conclusoes, libelo.conclusaoMecanismoId);
  const mecanismoDeclarado =
    conclusaoMecanismo && conclusaoMecanismo.tagsOcultas.tipo === 'mecanismo'
      ? conclusaoMecanismo.tagsOcultas.mecanismo
      : null;
  const mecanismoOk = mecanismoDeclarado === seed.mecanismoCorreto;
  if (!mecanismoDeclarado) falhas.push({ codigo: 'sem_mecanismo' });
  else if (!mecanismoOk) falhas.push({ codigo: 'mecanismo_errado' });
  if (mecanismoOk) acertos.push({ codigo: 'mecanismo' });

  // ---------- Pilar Presença (materialidade) ----------
  const conclusaoNexo = buscar(conclusoes, libelo.conclusaoNexoId);
  const nexoOk =
    !!conclusaoNexo &&
    conclusaoNexo.tagsOcultas.tipo === 'nexo' &&
    conclusaoNexo.tagsOcultas.suspeitoId === libelo.reuId &&
    conclusaoNexo.tagsOcultas.suspeitoId === seed.reuCorreto &&
    conclusaoNexo.tagsOcultas.instrumento === seed.instrumentoCorreto;
  if (!conclusaoNexo) falhas.push({ codigo: 'sem_nexo' });
  else if (!nexoOk) falhas.push({ codigo: 'nexo_errado' });
  if (nexoOk) acertos.push({ codigo: 'nexo' });

  // ---------- Descuidos (a encenação exposta) ----------
  const descuidos = (libelo.descuidosIds || [])
    .map((id) => buscar(cartasRegistradas, id) || buscar(conclusoes, id))
    .filter(Boolean);
  const descuidosOk =
    !seed.cenaEncenada ||
    descuidos.some(
      (d) => d.tagsOcultas.encenado === true || d.tagsOcultas.estado === 'cena_encenada'
    );
  if (descuidosOk) acertos.push({ codigo: 'descuidos' });
  else falhas.push({ codigo: 'sem_descuidos' });

  // ---------- Motivação ----------
  const cartaMotivacao = buscar(cartasRegistradas, libelo.motivacaoId);
  const motivacaoOk =
    !!cartaMotivacao &&
    cartaMotivacao.tagsOcultas.motivo === seed.motivacaoCorreta &&
    cartaMotivacao.tagsOcultas.ligadoA === seed.reuCorreto;
  if (motivacaoOk) acertos.push({ codigo: 'motivacao' });
  else falhas.push({ codigo: cartaMotivacao ? 'motivacao_erronea' : 'sem_motivacao' });

  // ---------- Periféricos (os não acusados) ----------
  const perifericos = {};
  let perifericosOk = true;
  for (const suspeitoId of Object.keys(seed.perifericos)) {
    if (suspeitoId === libelo.reuId) continue; // o acusado não é periférico
    const esperado = seed.perifericos[suspeitoId];
    const resposta = (libelo.perifericos || {})[suspeitoId] || { tipo: 'sem_info', cartaId: null };
    let ok = false;
    if (resposta.tipo === esperado.veredictoEsperado) {
      const carta = buscar(cartasRegistradas, resposta.cartaId);
      if (esperado.veredictoEsperado === 'inocente_alibi') {
        ok =
          !!carta &&
          carta.tagsOcultas.subDominio === 'alibi' &&
          carta.tagsOcultas.declaranteId === suspeitoId &&
          carta.tagsOcultas.corroborado === true;
      } else if (esperado.veredictoEsperado === 'inocente_segredo') {
        ok =
          !!carta &&
          carta.tagsOcultas.pertenceA === suspeitoId &&
          carta.tagsOcultas.revelaSegredo === esperado.segredo;
      } else {
        ok = true; // sem_info esperado e declarado
      }
    }
    perifericos[suspeitoId] = { esperado: esperado.veredictoEsperado, declarado: resposta.tipo, ok };
    if (!ok) {
      perifericosOk = false;
      falhas.push({ codigo: 'periferico', suspeitoId });
    }
  }
  if (perifericosOk) acertos.push({ codigo: 'perifericos' });

  // ---------- O desfecho ----------
  // A condenação só se sustenta sobre o tripé pericial: quando, como e presença.
  const sustentada = janelaOk && mecanismoOk && nexoOk && evidenciasOk;
  let tipo;
  if (!reuCorreto) {
    tipo = 'erro_judiciario';
  } else if (!sustentada) {
    tipo = 'impunidade';
  } else if (janelaPrecisa && motivacaoOk && descuidosOk && perifericosOk) {
    tipo = 'vitoria_absoluta';
  } else {
    tipo = 'sucesso_gafes';
  }

  return {
    tipo,
    acertos,
    falhas,
    perifericos,
    dadosMonologo: {
      reuId: libelo.reuId,
      reuCorretoId: seed.reuCorreto,
      vitima: seed.vitima,
      janela,
      janelaPrecisa,
      mecanismoDeclarado,
      instrumentoDeclarado:
        conclusaoMecanismo && conclusaoMecanismo.tagsOcultas.tipo === 'mecanismo'
          ? conclusaoMecanismo.tagsOcultas.instrumento
          : null,
      mecanismoCorreto: seed.mecanismoCorreto,
      instrumentoCorreto: seed.instrumentoCorreto,
      motivacaoOk,
      motivoCorreto: seed.motivacaoCorreta,
      descuidosOk,
      cenaEncenada: seed.cenaEncenada,
      horaForjada: seed.horaForjada,
      horaMorteAbsoluta: seed.horaMorteAbsoluta,
      sustentada,
    },
  };
}

// =====================================================================
// O Julgamento da CADEIA — calcularVeredictoCadeia(acusacao, cartas, seed)
//
// O novo ato final: o jogador AFIRMOU a cadeia (réu, janela, causa, motivo,
// juízos) e a sustentou LIGANDO cartas (src/logic/acusacao.js). Esta função
// lê a cadeia construída e a confronta com a Verdade de Ouro, produzindo os
// mesmos 4 desfechos e o mesmo formato de retorno que o tribunal antigo —
// por isso o monólogo (monologo.js) ainda a consome sem mudar.
//
// Diferença essencial: a dedução não é mais do motor. A janela e a causa são
// JUÍZO do jogador; o motor só verifica (a) se a afirmação cobre a verdade e
// (b) se as cartas que ele ligou de fato a sustentam / estabelecem o "não-X".
// Lê somente tags e seed.
// =====================================================================

// Duas janelas se sobrepõem?
function janelasIntersectam(a, b) {
  if (!a || !b) return false;
  return Math.max(a.inicio, b.inicio) <= Math.min(a.fim, b.fim);
}

// Encontra a refutação de álibi de um dado suspeito (pela tag declaranteId).
function refutaAlibiDoSuspeito(refutaAlibi, suspeitoId) {
  for (const v of refutaAlibi.values()) {
    if (v.alibi.tagsOcultas.declaranteId === suspeitoId) return v;
  }
  return null;
}

export function calcularVeredictoCadeia(acusacao, cartasRegistradas, seed) {
  const falhas = [];
  const acertos = [];
  const cartas = cartasRegistradas || [];
  const { sustentaQuando, sustentaComo, sustentaPresenca, refutaHora, refutaAlibi } =
    analisarLigacoes(acusacao, cartas);

  // ---------- Réu ----------
  const reuCorreto = acusacao.reuId === seed.reuCorreto;
  if (reuCorreto) acertos.push({ codigo: 'reu' });
  else falhas.push({ codigo: 'reu_errado' });

  // ---------- Evidências do corpo (substância pericial ligada) ----------
  const evidenciasOk = sustentaQuando.length + sustentaComo.length >= 1;
  if (evidenciasOk) acertos.push({ codigo: 'evidencias_corpo' });
  else falhas.push({ codigo: 'corpo_sem_substancia' });

  // ---------- Pilar Quando (janela afirmada + sustentada) ----------
  const j = acusacao.janela || {};
  const janela =
    typeof j.inicio === 'number' && typeof j.fim === 'number' ? { inicio: j.inicio, fim: j.fim } : null;
  // A interseção das janelas das cartas que o jogador LIGOU à âncora "Quando":
  // a afirmação não pode contradizer o que ele próprio invocou.
  const suporteJanela = intersecaoJanelas(sustentaQuando.map(janelaDaCarta).filter(Boolean));
  const janelaSustentada =
    !!janela && sustentaQuando.length >= 1 && janelasIntersectam(janela, suporteJanela);
  const janelaCobre =
    !!janela && janela.inicio <= seed.horaMorteAbsoluta && seed.horaMorteAbsoluta <= janela.fim;
  const janelaOk = janelaSustentada && janelaCobre;
  const janelaPrecisa =
    janelaOk &&
    janela.inicio !== -Infinity &&
    janela.fim !== Infinity &&
    janela.fim - janela.inicio <= LARGURA_JANELA_PRECISA;
  if (!janela || sustentaQuando.length === 0) falhas.push({ codigo: 'sem_janela' });
  else if (!janelaCobre) falhas.push({ codigo: 'janela_nao_cobre' });
  else if (!janelaPrecisa) falhas.push({ codigo: 'janela_imprecisa' });
  if (janelaOk) acertos.push({ codigo: 'janela' });

  // ---------- Pilar Como (causa afirmada + cravada por eliminação) ----------
  const sinais = sustentaComo.map((c) => c.tagsOcultas.sinal).filter(Boolean);
  const cravado = mecanismoCravado(sinais); // causa única após eliminação, ou null
  const causaId = acusacao.causaId || null;
  const mecanismoOk = !!causaId && !!cravado && cravado.id === causaId && causaId === seed.mecanismoCorreto;
  if (!causaId) falhas.push({ codigo: 'sem_mecanismo' });
  else if (!mecanismoOk) falhas.push({ codigo: 'mecanismo_errado' });
  if (mecanismoOk) acertos.push({ codigo: 'mecanismo' });

  // ---------- Pilar Presença (o vestígio que põe o réu na cena) ----------
  const vestigioNexo = sustentaPresenca.find(
    (c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.tipoVestigio
  );
  const nexoOk =
    !!vestigioNexo &&
    vestigioNexo.tagsOcultas.tipoVestigio === seed.instrumentoCorreto &&
    vestigioNexo.tagsOcultas.pertenceA === acusacao.reuId &&
    acusacao.reuId === seed.reuCorreto;
  if (!vestigioNexo) falhas.push({ codigo: 'sem_nexo' });
  else if (!nexoOk) falhas.push({ codigo: 'nexo_errado' });
  if (nexoOk) acertos.push({ codigo: 'nexo' });

  // ---------- Descuidos (a encenação exposta por refutação de hora) ----------
  let encenacaoExposta = false;
  for (const { alegacao, fatos } of refutaHora.values()) {
    if (refutacaoDeHoraEstabelecida(alegacao, fatos)) {
      encenacaoExposta = true;
      break;
    }
  }
  const descuidosOk = !seed.cenaEncenada || encenacaoExposta;
  if (descuidosOk) acertos.push({ codigo: 'descuidos' });
  else falhas.push({ codigo: 'sem_descuidos' });

  // ---------- Motivação ----------
  const cartaMotivacao = cartas.find((c) => c.id === acusacao.motivacaoId) || null;
  const motivacaoOk =
    !!cartaMotivacao &&
    cartaMotivacao.tagsOcultas.motivo === seed.motivacaoCorreta &&
    cartaMotivacao.tagsOcultas.ligadoA === seed.reuCorreto;
  if (motivacaoOk) acertos.push({ codigo: 'motivacao' });
  else falhas.push({ codigo: cartaMotivacao ? 'motivacao_erronea' : 'sem_motivacao' });

  // ---------- Juízo sobre os não-acusados ----------
  // 'inocente' acerta quem a seed espera inocente. Mas para a INOCENTE QUE
  // MENTE (inocente_segredo) o jogador precisa ter exposto a mentira-segredo
  // (refutar o álibi com o vestígio que revela a vergonha) — provando que
  // entendeu: mentiu, mas por outra razão. Acusar um inocente de "culpado"
  // (sobretudo após quebrar-lhe a mentira) é a armadilha.
  const perifericos = {};
  let perifericosOk = true;
  for (const suspeitoId of Object.keys(seed.perifericos)) {
    if (suspeitoId === acusacao.reuId) continue;
    const esperado = seed.perifericos[suspeitoId];
    const declarado = (acusacao.juizos || {})[suspeitoId] || 'sem_juizo';
    let ok = false;
    if (declarado === 'inocente') {
      if (esperado.veredictoEsperado === 'inocente_alibi') {
        ok = true;
      } else if (esperado.veredictoEsperado === 'inocente_segredo') {
        const ra = refutaAlibiDoSuspeito(refutaAlibi, suspeitoId);
        ok =
          !!ra &&
          refutacaoDeAlibiEstabelecida(ra.alibi, ra.vestigios) &&
          segredoRevelado(ra.alibi, ra.vestigios) === esperado.segredo;
      }
    }
    perifericos[suspeitoId] = { esperado: esperado.veredictoEsperado, declarado, ok };
    if (!ok) {
      perifericosOk = false;
      falhas.push({ codigo: 'periferico', suspeitoId });
    }
  }
  if (perifericosOk) acertos.push({ codigo: 'perifericos' });

  // ---------- O desfecho (mesmas regras dos 4 finais) ----------
  const sustentada = janelaOk && mecanismoOk && nexoOk && evidenciasOk;
  let tipo;
  if (!reuCorreto) {
    tipo = 'erro_judiciario';
  } else if (!sustentada) {
    tipo = 'impunidade';
  } else if (janelaPrecisa && motivacaoOk && descuidosOk && perifericosOk) {
    tipo = 'vitoria_absoluta';
  } else {
    tipo = 'sucesso_gafes';
  }

  return {
    tipo,
    acertos,
    falhas,
    perifericos,
    dadosMonologo: {
      reuId: acusacao.reuId,
      reuCorretoId: seed.reuCorreto,
      vitima: seed.vitima,
      janela,
      janelaPrecisa,
      mecanismoDeclarado: causaId,
      instrumentoDeclarado: vestigioNexo ? vestigioNexo.tagsOcultas.tipoVestigio : null,
      mecanismoCorreto: seed.mecanismoCorreto,
      instrumentoCorreto: seed.instrumentoCorreto,
      motivacaoOk,
      motivoCorreto: seed.motivacaoCorreta,
      descuidosOk,
      cenaEncenada: seed.cenaEncenada,
      horaForjada: seed.horaForjada,
      horaMorteAbsoluta: seed.horaMorteAbsoluta,
      sustentada,
    },
  };
}
