// =====================================================================
// DEMONSTRAÇÃO DO SISTEMA DE INTERFERÊNCIA (FASE 4 do gerador por
// simulação). Imprime, legível, os eventos contingentes que o gerador
// pré-computou para uma seed — e, para cada um, a reconstrução exigida
// pela R3: "ele só soube porque eu…" (gatilho observável) e "ele só
// chegou lá porque…" (rota espacial). Em seguida SIMULA, pelo próprio
// store do jogo, os dois destinos de um evento: o perito que lê o
// prenúncio e chega primeiro (evitada) e o que chega tarde (ocorrida).
// Nada aqui entra no jogo: é vitrine do build time + do runtime mínimo.
//
// Uso:
//   npm run demo:interferencia            → as seeds de cobertura do QA
//   node scripts/demo-interferencia.mjs xyz → só a seed "xyz"
// =====================================================================

import { gerarCasoBruto } from '../src/gerador/caso.js';
import { CATALOGO_INTERFERENCIA } from '../src/gerador/interferencia.js';
import { ECOS_INTERFERENCIA_PADRAO } from '../src/data/ecos_interferencia.js';
import { montarPacoteTutorial } from '../src/data/pacote_caso.js';
import { useJogo } from '../src/store/jogo.js';

const seeds = process.argv[2] ? [process.argv[2]] : ['intf_qa_0', 'intf_qa_3', 'intf_qa_10', 'intf_qa_44'];

for (const seed of seeds) {
  const caso = gerarCasoBruto(seed);
  const { mundo, escolha, interferencia } = caso;
  const nome = (id) => mundo.elenco.find((p) => p.id === id)?.nome ?? id;

  console.log(`\n${'='.repeat(70)}`);
  console.log(`=== A INTERFERÊNCIA DA SEED "${seed}" ===`);
  console.log(`· Assassino: ${nome(escolha.assassinoId)} | vítima: ${nome(escolha.vitimaId)} | cena: ${escolha.localId}`);
  console.log(`· Orçamento sorteado (R5): ${interferencia.esqueleto.orcamento} | eventos materializados: ${interferencia.eventos.length}`);
  if (interferencia.descartes.length) {
    console.log(`· Descartes: ${interferencia.descartes.map((d) => `${d.tipo} (${d.motivo})`).join('; ')}`);
  }

  for (const ev of interferencia.eventos) {
    const cat = CATALOGO_INTERFERENCIA[ev.tipo];
    console.log(`\n  [${ev.id}] ${cat.rotulo} — ator ${nome(ev.ator)} (${ev.atorPapel})`);
    if (ev.alvo.testemunhaId) console.log(`    · alvo: a testemunha ${nome(ev.alvo.testemunhaId)} (carta ${ev.alvo.cartaId}) em ${ev.alvo.localId}`);
    else console.log(`    · alvo: a carta ${ev.alvo.cartaId} em ${ev.alvo.localId}`);
    console.log(`    · R1 rolagem: WIS ${ev.rolagem.wis} − ${ev.rolagem.penalidade} → alvo ${ev.rolagem.alvo}, dado ${ev.rolagem.dado} ⇒ ${ev.rolagem.sucesso ? 'execução contida' : 'improviso grosseiro (vestígio extra)'}`);
    console.log(`    · R2 saldo: destrói ${ev.efeito.cartaDestruida ?? 'nada'}; deposita ${ev.efeito.cartasNovas.join(', ')}`);
    console.log(`    · R3 "ele só soube porque eu…": ${ev.gatilho.comoSoube}`);
    console.log(`    · R3 "ele só chegou lá porque…": ${ev.rota.comoChegou}`);
    if (ev.prenuncio) console.log(`    · R4 prenúncio (${ev.prenuncio.cartaId}): "${ev.prenuncio.texto}"`);
  }
}

// ---------------------------------------------------------------------
// O RUNTIME MÍNIMO EM AÇÃO (pacote sintético sobre o caso-escola): o
// mesmo evento, dois peritos — quem chega primeiro não perde a peça.
// ---------------------------------------------------------------------
function pacoteDemonstracao() {
  const p = JSON.parse(JSON.stringify(montarPacoteTutorial()));
  p.id = 'demo_interferencia';
  p.cartas.push({
    id: 'demo_cinzas',
    localidade: 'cena',
    textoDisplay: 'Cinzas Frescas',
    carimboPadrao: 'Cinzas frescas na lareira',
    descricao: 'Carta sintética da demonstração.',
    tagsOcultas: { dominio: 'vestigio', subDominio: 'limpeza_fresca' },
  });
  p.interferencias = {
    eventos: [
      {
        id: 'demo_1',
        tipo: 'destruir_evidencia',
        ator: 'silas_crane',
        atorPapel: 'assassino',
        gatilho: { tipo: 'extracao_carta', cartaId: 'dep_testamento', comoSoube: 'o testamento aberto no posto do constable correu a vila' },
        rota: { de: 'oficina', para: 'cena', faixa: 'noite', sustentacao: 'retorno_a_cena', comoChegou: 'refez o caminho do próprio crime' },
        rolagem: { wis: 3, penalidade: 2, alvo: 1, dado: 4, sucesso: false },
        efeito: { cartaDestruida: 'ev_suplica_cesto', cartasNovas: ['demo_cinzas'] },
        prenuncio: null,
        anuncio: 'Há sinais de que alguém esteve na cena desde a última visita.',
      },
    ],
  };
  p.ecosInterferencia = ECOS_INTERFERENCIA_PADRAO;
  return p;
}

const s = () => useJogo.getState();
console.log(`\n${'='.repeat(70)}`);
console.log('=== O RUNTIME MÍNIMO (dois peritos, o mesmo evento) ===');

s().carregarCaso(pacoteDemonstracao());
s().escolherDetective();
s().iniciarInvestigacao();
s().extrairCarta('dep_testamento'); // o gatilho dispara primeiro
s().extrairCarta('ev_suplica_cesto'); // tarde demais
s().extrairCarta('demo_cinzas');
s().definirReu('silas_crane');
s().submeterAcusacao();
const ecoTarde = s().conclusoes.find((c) => c.tagsOcultas?.tipo === 'eco_interferencia');
console.log('\n· Perito que chegou TARDE: a súplica do cesto perdeu-se?', !s().cartasRegistradas.some((c) => c.id === 'ev_suplica_cesto'));
console.log(`  Eco do legista: "${ecoTarde?.resumo}"`);

s().carregarCaso(pacoteDemonstracao());
s().escolherDetective();
s().iniciarInvestigacao();
s().extrairCarta('ev_suplica_cesto'); // o perito recolhe cedo o perecível
s().extrairCarta('dep_testamento'); // o gatilho dispara, mas o alvo já era do caderno
s().definirReu('silas_crane');
s().submeterAcusacao();
const ecoCedo = s().conclusoes.find((c) => c.tagsOcultas?.tipo === 'eco_interferencia');
console.log('\n· Perito que chegou PRIMEIRO: a súplica ficou no caderno?', s().cartasRegistradas.some((c) => c.id === 'ev_suplica_cesto'));
console.log(`  Eco do legista: "${ecoCedo?.resumo}"`);
