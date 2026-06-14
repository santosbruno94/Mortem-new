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
