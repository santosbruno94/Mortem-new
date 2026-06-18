// =====================================================================
// O Julgamento da CADEIA — calcularVeredictoCadeia(acusacao, cartas, seed)
//
// Função pura. É a ÚNICA camada que valida: o jogador AFIRMOU a cadeia (réu,
// janela, causa, motivo, juízos) e a sustentou LIGANDO cartas (os barbantes,
// ver src/logic/acusacao.js). Esta função lê a cadeia construída e a confronta
// com a Verdade de Ouro (seed), produzindo os 4 desfechos do §11 e o formato
// { tipo, acertos, falhas, perifericos, dadosMonologo } que o monólogo consome.
//
// A dedução não é do motor: a janela e a causa são JUÍZO do jogador. O motor
// só verifica (a) se a afirmação cobre a verdade e (b) se as cartas ligadas a
// sustentam / estabelecem o "não-X". Nunca lê textos nem nomes: só tags e seed.
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

const LARGURA_JANELA_PRECISA = 6; // horas: acima disso, a janela é "estimativa frouxa"

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
