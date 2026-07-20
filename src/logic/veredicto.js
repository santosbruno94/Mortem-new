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
  // Cascata de falhas do pilar Quando, da mais grave à mais branda:
  // sem janela → janela que erra a hora → janela certa que CONTRADIZ as
  // próprias cartas ligadas (código próprio: o buraco é contradição, não
  // largura) → janela certa e sustentada, porém larga demais.
  if (!janela || sustentaQuando.length === 0) falhas.push({ codigo: 'sem_janela' });
  else if (!janelaCobre) falhas.push({ codigo: 'janela_nao_cobre' });
  else if (!janelaSustentada) falhas.push({ codigo: 'janela_sem_sustentacao' });
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
  // O vestígio INSTRUMENTAL (casa com a arma E pertence ao réu) é obrigatório:
  // ligá-lo firma o nexo mesmo que outros vestígios também estejam ligados.
  // Ligar um traço de TERCEIRO (que não é do réu) é GAFE — condena, mas custa
  // a Vitória Absoluta. Ligar só o errado (sem o instrumental) falha o nexo.
  const vestigiosLigados = sustentaPresenca.filter(
    (c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.tipoVestigio
  );
  const vestigioNexo = vestigiosLigados.find(
    (c) =>
      c.tagsOcultas.tipoVestigio === seed.instrumentoCorreto &&
      c.tagsOcultas.pertenceA === acusacao.reuId
  );
  const nexoOk = !!vestigioNexo && acusacao.reuId === seed.reuCorreto;
  const vestigioAcessorioErrado =
    nexoOk && vestigiosLigados.some((c) => c.tagsOcultas.pertenceA !== acusacao.reuId);
  if (vestigiosLigados.length === 0) falhas.push({ codigo: 'sem_nexo' });
  else if (!nexoOk) falhas.push({ codigo: 'nexo_errado' });
  if (nexoOk) acertos.push({ codigo: 'nexo' });
  if (vestigioAcessorioErrado) falhas.push({ codigo: 'nexo_acessorio' });

  // ---------- Descuidos (a encenação exposta por refutação de hora) ----------
  // A encenação só conta como exposta se o jogador refutou a PRÓPRIA peça
  // encenada (tag `encenado` na alegação de hora — o relógio forjado).
  // Desmentir uma testemunha equivocada é mérito narrativo, não encenação.
  // Certas alegações-isca carregam a tag `explicacao`: refutá-las dá ao
  // encerramento o direito de pagar a explicação do fato verdadeiro por trás
  // da leitura falsa (ex.: a luz de madrugada era o lampião esquecido). O
  // texto mora em ROTULOS_EXPLICACAO (camada narrativa); aqui só a tag.
  let encenacaoExposta = false;
  let testemunhasDesmentidas = 0;
  const explicacoesPagas = [];
  for (const { alegacao, fatos } of refutaHora.values()) {
    if (!refutacaoDeHoraEstabelecida(alegacao, fatos)) continue;
    if (alegacao.tagsOcultas.encenado) encenacaoExposta = true;
    else {
      testemunhasDesmentidas += 1;
      if (alegacao.tagsOcultas.explicacao) explicacoesPagas.push(alegacao.tagsOcultas.explicacao);
    }
  }
  const descuidosOk = !seed.cenaEncenada || encenacaoExposta;
  if (descuidosOk) acertos.push({ codigo: 'descuidos' });
  else falhas.push({ codigo: 'sem_descuidos' });

  // ---------- O álibi do próprio réu, desmentido (opcional — nunca pilar) ----------
  // Se o jogador refutou o paradeiro declarado do réu, o monólogo ganha o
  // direito de dizê-lo — e diz COMO caiu: por REGISTRO (a corroboração com
  // hora observada) ou por RASTRO (vestígio do próprio réu). A frase narrada
  // depende da base — o desfecho não afirma um registro que não existe.
  let alibiReuExposto = false;
  let alibiReuPorRegistro = false;
  for (const { alibi, vestigios } of refutaAlibi.values()) {
    if (
      alibi.tagsOcultas.declaranteId === acusacao.reuId &&
      refutacaoDeAlibiEstabelecida(alibi, vestigios)
    ) {
      alibiReuExposto = true;
      alibiReuPorRegistro = vestigios.some(
        (f) =>
          f.tagsOcultas.subDominio === 'corroboracao' &&
          f.tagsOcultas.ligadoA === alibi.tagsOcultas.declaranteId &&
          typeof f.tagsOcultas.horaFimObservada === 'number' &&
          typeof alibi.tagsOcultas.horaFimDeclarada === 'number' &&
          f.tagsOcultas.horaFimObservada < alibi.tagsOcultas.horaFimDeclarada
      );
      break;
    }
  }

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
    // O monólogo só pode afirmar "conferi o paradeiro" se o álibi do suspeito
    // está de fato na mesa — senão o juízo é convicção, não perícia.
    const alibiNaMesa = cartas.some(
      (c) =>
        c.tagsOcultas.dominio === 'comportamental' &&
        c.tagsOcultas.subDominio === 'alibi' &&
        c.tagsOcultas.declaranteId === suspeitoId
    );
    // P9 Via B: o acessor com acesso ao instrumento exige álibi na mesa
    // para que o "inocente" valha (o gesto que fecha a contra-hipótese).
    if (esperado.veredictoEsperado === 'inocente_acesso' && declarado === 'inocente') {
      ok = alibiNaMesa;
    }
    // O monólogo só pode dizer que "razões não faltavam" se uma carta de
    // móbil apontando este suspeito está na mesa — sem ela, afirmar motivo
    // seria inventar fato (contrato do desfecho).
    const temMotivoNaMesa = cartas.some(
      (c) => c.tagsOcultas.subDominio === 'motivo' && c.tagsOcultas.ligadoA === suspeitoId
    );
    perifericos[suspeitoId] = {
      esperado: esperado.veredictoEsperado,
      declarado,
      ok,
      alibiNaMesa,
      temMotivoNaMesa,
    };
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
  } else if (janelaPrecisa && motivacaoOk && descuidosOk && perifericosOk && !vestigioAcessorioErrado) {
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
      seedId: seed.id, // chave estável para a escolha determinística de variantes
      reuId: acusacao.reuId,
      reuCorretoId: seed.reuCorreto,
      vitima: seed.vitima,
      janela,
      janelaPrecisa,
      mecanismoDeclarado: causaId,
      // O instrumento narrado vem do sinal que CRAVOU a causa (a fibra no
      // sulco), nunca do vestígio de presença — o template não pode afirmar
      // um instrumento que contradiga a própria causa declarada.
      instrumentoDeclarado:
        (mecanismoOk && sustentaComo.find((c) => c.tagsOcultas.instrumento)?.tagsOcultas.instrumento) ||
        null,
      mecanismoCorreto: seed.mecanismoCorreto,
      instrumentoCorreto: seed.instrumentoCorreto,
      motivacaoOk,
      motivoCorreto: seed.motivacaoCorreta,
      descuidosOk,
      cenaEncenada: seed.cenaEncenada,
      horaForjada: seed.horaForjada,
      // A peça encenada (mostrador / temperatura do corpo): a fala do desfecho
      // ramifica por ela. Ausente (caso-escola) ⇒ 'relogio' (texto inalterado).
      encenacaoInstrumento: seed.encenacaoInstrumento || 'relogio',
      horaMorteAbsoluta: seed.horaMorteAbsoluta,
      sustentada,
      testemunhasDesmentidas,
      // Tags `explicacao` das alegações-isca refutadas: o epílogo troca cada
      // uma pelo texto de ROTULOS_EXPLICACAO — o "aha" pago no encerramento.
      explicacoesPagas,
      alibiReuExposto,
      alibiReuPorRegistro,
    },
  };
}
