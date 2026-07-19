// =====================================================================
// QA de fumaça da INTERFACE: joga as três rotas canônicas no navegador
// real (Chromium via Playwright), do clique na tela de seleção até o
// Monólogo Final. Complementa o QA estático (scripts/qa.mjs), que dirige
// o motor por baixo — este dirige o jogo por cima, como o jogador.
//
// Executar com: node scripts/qa-ui.mjs
// Requisito: Playwright com Chromium (local ao projeto ou global).
//   npm i -D playwright && npx playwright install chromium
//
// O que cobre (ângulos mortos do QA estático, apontados nos playtests de
// 11/07/2026 — docs/playtest-2026-07-11.md e docs/playtest-qualidade-2026-07-11.md):
//   • extração por clique nos termos em negrito das localidades;
//   • a planta da relojoaria (§5.1): andar entre cômodos pela planta (SVG
//     2D, [data-planta]/[data-alvo], custo 0) e os pontos de interesse
//     (.ponto-interesse) — os termos nascem escondidos e um ponto os revela;
//   • a Ficha de Coleta (§6.2): extrair apresenta a evidência no ato numa
//     ficha (data-overlay="ficha") com a descrição completa; "Arquivar na
//     mesa" a fecha; a carta da mesa reabre a ficha; a Caderneta, rebaixada
//     a diário, não traz mais a descrição (só carimbo + hora);
//   • o interrogatório em diálogo (§7.1): o nó de Silas abre em árvore
//     ([data-opcoes-dialogo], .opcao-dialogo/.opcao-dialogo--confronto/
//     --voltar); o confronto (opção requerCarta, "Apresentar: …") fica
//     OCULTO até a prova estar na mesa e, apresentado, rende a reação do réu;
//     as cartas de depoimento nascem de dentro da fala pelo mesmo [[id]];
//   • o Mural da Acusação inteiro (5 estações, barbantes, revisão final),
//     SEM o gabarito do legista no topo (Q3);
//   • as interpolações {detective.campo}/{g:...} resolvidas na prosa;
//   • o desbloqueio do Gabinete Pettigrew pelos dois leads, com anúncio no
//     diário, e o álibi do réu derrubado pelo registro da estalagem (Q4);
//   • a retentativa com preço (2h) e o mural reaberto na pendência (Q2/Q9);
//   • o Erro Judiciário sem nome do culpado até o epílogo, e o epílogo com
//     o retrato da investigação (Q2/Q5);
//   • REGRESSÕES: id interno vazando no monólogo ("buril_gravador") e
//     "NaN/Infinity" na leitura do legista com janela aberta (Caderneta);
//   • zero erros de console em todas as rotas.
// =====================================================================

import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
// B3.4 da OS autobattler v2: a rota gerada segue a seed da réplica
// vigente — a reseleção de seed não quebra mais este contrato.
import { SEED_REPLICA } from '../src/gerador/pacote_gerado.js';

const PORTA = 4173;
const BASE = `http://localhost:${PORTA}/`;

// ---------------------------------------------------------------------
// Playwright: primeiro o do projeto; senão, o global (npm root -g).
// ---------------------------------------------------------------------
function carregarPlaywright() {
  const require = createRequire(import.meta.url);
  try {
    return require('playwright');
  } catch {
    try {
      const raizGlobal = execSync('npm root -g', { encoding: 'utf8' }).trim();
      return require(path.join(raizGlobal, 'playwright'));
    } catch {
      console.error('FALHA — Playwright não encontrado.');
      console.error('Instale com: npm i -D playwright && npx playwright install chromium');
      process.exit(1);
    }
  }
}

const { chromium } = carregarPlaywright();

// ---------------------------------------------------------------------
// Sobe o servidor de desenvolvimento e espera responder.
// ---------------------------------------------------------------------
async function subirServidor() {
  const proc = spawn('npm', ['run', 'dev', '--', '--port', String(PORTA), '--strictPort'], {
    stdio: 'ignore',
    detached: false,
  });
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE);
      if (r.ok) return proc;
    } catch {
      // servidor ainda subindo
    }
    await new Promise((res) => setTimeout(res, 500));
  }
  proc.kill();
  throw new Error(`Servidor não respondeu em ${BASE}`);
}

// ---------------------------------------------------------------------
// Utilitários de jogo (os mesmos gestos do jogador).
// ---------------------------------------------------------------------
const espera = (page, ms = 250) => page.waitForTimeout(ms);

// Abre um nó do mapa e espera o local (overlay) surgir. Na maquete 3D, uma
// viagem com custo real ganha um BEAT (~0,7s): o pino desliza o trajeto e a
// luz vira com a hora ANTES de o overlay abrir (Fase 4). Esperar o overlay
// (em vez de um tempo fixo) é robusto a esse atraso — e instantâneo nas
// viagens de 0h e no modo 2D. `div.fixed[data-overlay]` só casa a moldura de
// overlay (não os rótulos HTML do diorama, que não têm data-overlay).
async function abrirNo(page, texto) {
  await page.click(`text=${texto}`);
  await page.waitForSelector('div.fixed[data-overlay]', { timeout: 8000 });
  await espera(page, 300);
}

async function novaPartida(page, perito, query = '') {
  await page.goto(BASE + query);
  await espera(page, 400);
  // O auto-save (P0) persiste entre rotas: limpa o caso salvo e recarrega,
  // para cada rota nascer do convite limpo, nunca do gate de retomada.
  await page.evaluate(() => window.localStorage && window.localStorage.clear());
  await page.reload();
  await espera(page, 800);
  await page.click(`text=${perito}`);
  await espera(page, 600);
  // Abertura: 5 avanços até o passo 6, depois entrar (sem as perguntas).
  for (let i = 0; i < 5; i++) {
    await page.locator('button, [role=button], a').filter({ hasText: '→' }).last().click();
    await espera(page, 200);
  }
  await page.click('text=Entrar — iniciar a investigação');
  await espera(page, 600);
}

// Fecha a Ficha de Coleta (§6.2), quando aberta. Desde a Onda 4 só a
// PRIMEIRA observação do caso abre ficha sozinha — nas demais este helper
// é um no-op defensivo (o botão não existe).
async function arquivarFicha(page) {
  const botao = page.getByRole('button', { name: 'Arquivar na mesa' });
  if (await botao.count()) {
    await botao.first().click();
    await espera(page, 150);
  }
}

// Abre todos os pontos de interesse fechados (§5.1): nos nós da relojoaria
// com pontos, os termos nascem escondidos e só surgem ao revelar o ponto.
async function abrirPontos(page) {
  const pontos = page.locator('.ponto-interesse');
  const n = await pontos.count();
  for (let i = 0; i < n; i++) {
    const p = pontos.nth(i);
    if ((await p.getAttribute('aria-expanded')) === 'false') {
      await p.click();
      await espera(page, 120);
    }
  }
}

// Micro-gestos periciais (Onda 7): aciona os botões-gesto ainda não feitos
// (voltar o corpo, dar corda, contar entalhes) — cada um extrai uma carta.
async function acionarGestos(page) {
  for (let i = 0; i < 5; i++) {
    const gesto = page.locator('.gesto-pericial:not([data-feito])');
    if ((await gesto.count()) === 0) break;
    await gesto.first().click();
    await espera(page, 150);
    await arquivarFicha(page);
  }
}

// Viaja até um nó da mesa e extrai todos os termos em negrito do overlay.
// Cada extração abre a ficha de coleta, arquivada antes do próximo termo.
// Onde há pontos de interesse, revela todos antes de varrer os termos.
// Micro-gestos visíveis também são acionados (Onda 7).
async function visitarEExtrair(page, rotuloNo) {
  await abrirNo(page, rotuloNo);
  await abrirPontos(page);
  const termos = page.locator('.termo-clicavel');
  for (let i = 0; i < 20 && (await termos.count()) > 0; i++) {
    await termos.first().click();
    await espera(page, 150);
    await arquivarFicha(page);
  }
  await acionarGestos(page);
}

// Extrai todos os termos em negrito visíveis no momento (cada extração abre
// a ficha de coleta, arquivada antes do próximo termo).
async function extrairTermosVisiveis(page) {
  const termos = page.locator('.termo-clicavel');
  for (let i = 0; i < 10 && (await termos.count()) > 0; i++) {
    await termos.first().click();
    await espera(page, 150);
    await arquivarFicha(page);
  }
}

// Percorre um diálogo JÁ ABERTO (§7.2): a conversa DESCE e não volta. A cada
// beat escolhe um tom — o último do leque (oblíquo), que apanha a precisão
// quando há (ex.: a lasca na bainha de Silas) — e extrai os termos da resposta,
// até a conversa se encerrar. Os confrontos ficam de fora (canal lateral, só
// apresentando a prova). Só as falas do perito têm [data-tom].
async function percorrerDialogo(page) {
  await extrairTermosVisiveis(page); // a fala de abertura
  const seletorTom = '.opcao-dialogo[data-tom]';
  for (let guarda = 0; guarda < 6; guarda++) {
    const n = await page.locator(seletorTom).count();
    if (n === 0) break; // a conversa se encerrou (sem volta)
    await page.locator(seletorTom).last().click(); // tom oblíquo
    await espera(page, 250);
    await extrairTermosVisiveis(page);
  }
}

// Interrogatório num nó do mapa (conversão integral: Silas, Agnes, Grey).
async function interrogarEExtrair(page, rotuloNo) {
  await abrirNo(page, rotuloNo);
  await percorrerDialogo(page);
}

// Diálogo EMBUTIDO (Onda 6): de dentro da localidade aberta, o botão
// .botao-dialogo-local abre a árvore (Walter na estalagem, Davey na oficina).
async function conversarEmbutido(page, rotuloBotao) {
  await page.getByRole('button', { name: rotuloBotao }).click();
  await espera(page, 400);
  await percorrerDialogo(page);
}

async function fecharOverlay(page) {
  await page.click('text=fechar ✕');
  await espera(page, 250);
}

// O seletor de janela é UM par de seletores (dia+hora combinados, Q9).
async function definirJanela(page, inicio, fim) {
  await page.locator('select').nth(0).selectOption({ label: inicio });
  await page.locator('select').nth(1).selectOption({ label: fim });
  await espera(page, 200);
}

const concluirParte = async (page) => {
  await page.getByRole('button', { name: 'Concluir esta parte →' }).click();
  await espera(page, 350);
};

// Texto do overlay mais ao topo (o monólogo/epílogo), sem a mesa ao fundo —
// a mesa contém nomes de nós ("Edgar Arthurs") que contaminariam checagens.
// O alvo é [data-overlay]: portais de bibliotecas (ex.: rótulos HTML do
// diorama 3D) também criam div.fixed, e não podem contaminar a leitura.
async function textoOverlay(page) {
  return page.locator('div.fixed[data-overlay]').last().innerText();
}

// Acusação com lacunas exige a confirmação explícita "Selar assim mesmo"
// antes do selo (P0 §5 do playtest de 17/07); a completa sela direto. O
// helper atravessa o passo quando ele existe e anota em `viuLacunas` se
// apareceu — as rotas checam quem deve (e quem não deve) vê-lo.
async function julgar(page) {
  await page.getByRole('button', { name: 'Levar a julgamento' }).click();
  await espera(page, 400);
  await page.getByRole('button', { name: 'Confirmar e julgar' }).click();
  await espera(page, 400);
  const selar = page.getByRole('button', { name: 'Selar assim mesmo' });
  julgar.viuLacunas = (await selar.count()) > 0;
  if (julgar.viuLacunas) await selar.click();
  await espera(page, 900);
  return textoOverlay(page);
}

// ---------------------------------------------------------------------
// As checagens acumulam em vez de abortar: o relatório sai inteiro.
// ---------------------------------------------------------------------
const resultados = [];
function checar(rotulo, ok) {
  resultados.push([rotulo, !!ok]);
  console.log(`${ok ? 'OK ' : 'FALHA'} — ${rotulo}`);
}

// =====================================================================
async function main() {
  const servidor = await subirServidor();
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  const errosConsole = [];
  page.on('console', (m) => m.type() === 'error' && errosConsole.push(m.text()));
  page.on('pageerror', (e) => errosConsole.push(String(e.message)));

  try {
    // ============================================================
    // ROTA 1 — METÓDICO (Harlan): corpo cedo, tudo ligado.
    // Esperado: Vitória Absoluta.
    // ============================================================
    console.log('\n=== ROTA 1 — Metódico (Harlan) → Vitória Absoluta ===');
    await novaPartida(page, 'Dr. Harlan Blackwell');

    // O diorama 3D da vila sobe (chunk lazy); os nós seguem clicáveis por texto.
    await page.waitForSelector('canvas', { timeout: 15000 });
    checar('Rota 1: diorama 3D presente (canvas)', (await page.locator('canvas').count()) >= 1);
    // Fase 4: as etiquetas dos nós são tags de papel pendentes (HTML real do
    // diorama, clicáveis por texto). O rótulo do nó atual pulsa/repousa; a
    // viagem com custo ganha o beat do pino (esperado por abrirNo, adiante).
    checar('Fase 4: etiquetas de papel do diorama presentes (.rotulo-papel)', (await page.locator('.rotulo-papel').count()) >= 1);

    // ---- FASE 1 — A Ficha de Coleta (§6.2): a evidência se apresenta no ato ----
    // Extrair um termo abre a ficha (data-overlay="ficha") com a descrição
    // completa; arquivar devolve a carta à mesa; a carta da mesa reabre a
    // mesma ficha; e a Caderneta, rebaixada a diário, não traz mais a descrição.
    const DESC_RIGOR = 'não cedem quando se tenta dobrá-los'; // trecho da descrição de ev_rigor
    const CARIMBO_RIGOR = 'Duro dos maxilares aos joelhos'; // termoCarimbo de ev_rigor
    await abrirNo(page, 'O Corpo');
    await page.locator('.termo-clicavel').first().click(); // ev_rigor é o primeiro termo
    await espera(page, 300);
    checar('Fase 1: a ficha de coleta abre ao extrair (data-overlay="ficha")', (await page.locator('div.fixed[data-overlay="ficha"]').count()) >= 1);
    const textoFicha = await page.locator('div.fixed[data-overlay="ficha"]').last().innerText();
    checar('Fase 1: a ficha mostra a descrição completa da evidência', textoFicha.includes(DESC_RIGOR));
    await page.getByRole('button', { name: 'Arquivar na mesa' }).click();
    await espera(page, 300);
    checar('Fase 1: "Arquivar na mesa" fecha a ficha', (await page.locator('div.fixed[data-overlay="ficha"]').count()) === 0);
    await fecharOverlay(page); // fecha o corpo → volta à mesa
    await page.locator('text=Corpo Endurecido').first().click(); // a carta pousada reabre a ficha
    await espera(page, 300);
    checar('Fase 1: a carta da mesa reabre a mesma ficha', (await page.locator('div.fixed[data-overlay="ficha"]').last().innerText()).includes(DESC_RIGOR));
    await page.getByRole('button', { name: 'Arquivar na mesa' }).click();
    await espera(page, 300);
    await page.click('text=Caderneta');
    await espera(page, 400);
    const textoCaderneta = await textoOverlay(page);
    checar('Fase 1: a Caderneta lista o carimbo da observação', textoCaderneta.includes(CARIMBO_RIGOR));
    checar('Fase 1: a Caderneta (diário) não traz mais a descrição', !textoCaderneta.includes(DESC_RIGOR));
    // Onda 8: o modo purista cala a síntese do legista na Caderneta — e
    // religa sem perder nada (o dado continua consolidando por baixo).
    await page.getByRole('button', { name: 'Dispensar a leitura' }).click();
    await espera(page, 200);
    checar('Onda 8: purista dispensa a leitura do legista', (await page.locator('body').innerText()).includes('dispensou a leitura do legista'));
    await page.getByRole('button', { name: 'Tornar a pedir a leitura' }).click();
    await espera(page, 200);
    checar('Onda 8: religar devolve a leitura', !(await page.locator('body').innerText()).includes('dispensou a leitura do legista'));
    await fecharOverlay(page);
    // ---- fim do bloco da Fase 1 ----

    // ---- FASE 2 — A planta da relojoaria e os pontos de interesse (§5.1) ----
    // Andar entre cômodos pela planta (0h, mesmo prédio) e a coleta em
    // camadas: um ponto revela o parágrafo e os seus termos extraíveis.
    await abrirNo(page, 'A Cena do Crime');
    checar('Fase 2: a planta da relojoaria aparece no nó (data-planta)', (await page.locator('[data-planta]').count()) >= 1);
    // Com pontos, os termos nascem escondidos: nenhum antes de abrir um ponto.
    checar('Fase 2: os pontos começam fechados (termos ocultos)', (await page.locator('.termo-clicavel').count()) === 0);
    await page.locator('.ponto-interesse', { hasText: 'A lareira' }).click();
    await espera(page, 250);
    checar('Fase 2: abrir um ponto revela seus termos', (await page.locator('.termo-clicavel').count()) >= 1);
    await page.locator('.termo-clicavel').first().click();
    await espera(page, 200);
    // Onda 4: só a PRIMEIRA observação do caso abre ficha; as demais pousam
    // sozinhas na mesa, anunciadas pelo aviso de pouso.
    checar('Onda 4: a extração seguinte NÃO abre ficha (pousa sozinha)', (await page.locator('div.fixed[data-overlay="ficha"]').count()) === 0);
    checar('Onda 4: o aviso de pouso anuncia a carta registrada', (await page.locator('[data-aviso-pousada]').count()) >= 1);
    await arquivarFicha(page); // defensivo: não há ficha a arquivar
    // Andar pela planta: clicar o cômodo "a oficina" viaja (0h) e abre a oficina.
    await page.locator('[data-planta] [data-alvo="oficina"]').click();
    await espera(page, 500);
    checar('Fase 2: clicar um cômodo da planta viaja para o nó', (await page.locator('body').innerText()).includes('A Oficina de Consertos'));
    checar('Fase 2: andar entre cômodos não gasta o relógio (11h00)', (await page.locator('body').innerText()).includes('11h00'));
    await fecharOverlay(page);
    // ---- fim do bloco da Fase 2 ----

    // ---- ONDA 1 — Persistência (P0): o caso sobrevive ao F5 ----
    // Recarregar no meio da investigação cai no gate de retomada; continuar
    // devolve a mesa com as cartas registradas e o relógio intactos.
    await page.reload();
    await espera(page, 800);
    checar('Onda 1: recarregar oferece a retomada do caso', (await page.getByRole('button', { name: 'Continuar o caso' }).count()) === 1);
    await page.getByRole('button', { name: 'Continuar o caso' }).click();
    await page.waitForSelector('.rotulo-papel', { timeout: 15000 });
    await espera(page, 400);
    const mesaRetomada = await page.locator('body').innerText();
    checar('Onda 1: a mesa volta com as cartas registradas', mesaRetomada.includes('Corpo Endurecido'));
    checar('Onda 1: o relógio retomado não andou (11h00)', mesaRetomada.includes('11h00'));
    // ---- fim do bloco da Onda 1 ----

    await visitarEExtrair(page, 'O Corpo'); // extrai os demais termos do corpo
    // Onda 7: os dois micro-gestos do corpo (voltar o corpo, dar corda ao
    // relógio) foram acionados e ficaram marcados como feitos.
    checar('Onda 7: micro-gestos do corpo acionados e marcados', (await page.locator('.gesto-pericial[data-feito]').count()) === 2);
    await page.getByRole('button', { name: 'Medir temperatura' }).click();
    await espera(page, 400);
    await arquivarFicha(page); // defensivo: o algor pousa sozinho (Onda 4)
    // O contador de esgotamento do caso-escola: corpo esgotado = 7 de 7.
    checar('Rota 1: contador de observações da localidade (7 de 7 no corpo)', (await page.locator('body').innerText()).includes('7 de 7 observações registradas aqui'));
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Cena do Crime');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Oficina'); // desbloqueia o Gabinete (lead do livro de ordens)
    // Onda 6: Davey conversa em diálogo embutido — o hábito da corda e o
    // álibi dele nascem das falas, não mais de um ponto de interesse.
    await conversarEmbutido(page, 'Conversar com Davey Tull');
    // §7.2: a conversa desce (o hábito da corda e o álibi nascem das falas).
    checar('Onda 6: a conversa embutida com o aprendiz extrai cartas', (await page.locator('.termo-extraido').count()) >= 1);
    await fecharOverlay(page);
    checar('Rota 1: Gabinete desbloqueado e destacado como novo', (await page.locator('body').innerText()).includes('· novo'));
    // Etapa 1 (mapa): um local já visitado e que não é o atual recorda no
    // rótulo que o perito esteve lá (corpo e cena, visitados antes da oficina).
    checar('Etapa 1: o mapa marca os locais visitados', (await page.locator('body').innerText()).includes('visitado ·'));

    // ---- FASE 3 — Interrogatório como diálogo (§7.1) ----
    // Interrogar é escolher e confrontar: o nó abre em diálogo. A CAIXA de
    // confronto (gated) só expõe as perguntas cujas provas já estão na mesa —
    // cada botão ancorado em [data-requer-carta] (estável; o rótulo é prosa).
    await abrirNo(page, 'A Saleta');
    checar('Fase 3: o interrogatório abre em diálogo (opções do perito)', (await page.locator('[data-opcoes-dialogo]').count()) >= 1);
    checar('Fase 3: retrato do interrogado presente', (await page.locator('svg[data-retrato]').count()) >= 1);
    // §7.2: cada beat oferece QUATRO falas do perito, cada uma num tom.
    checar('§7.2: o beat oferece quatro falas do perito (tons)', (await page.locator('.opcao-dialogo[data-tom]').count()) === 4);
    // Confronto gated: a prova da estalagem, ainda não colhida, NÃO abre pergunta
    // de confronto (a caixa só expõe o que a mesa autoriza — sem telégrafo).
    checar('Confronto gated: prova não colhida não abre pergunta de confronto', (await page.locator('[data-requer-carta="corrob_estalajadeiro"]').count()) === 0);
    // §7.2: a conversa desce (tom oblíquo em cada beat): a lasca na bainha e o
    // álibi saem no primeiro beat; a teoria do ladrão de fora, no segundo.
    await percorrerDialogo(page);
    checar('Fase 3: extraiu carta de dentro do diálogo (álibi registrado)', (await page.locator('.termo-extraido').count()) >= 1);
    checar('§7.2: a conversa se encerra sem volta ao hub', (await page.locator('[data-conversa-encerrada]').count()) === 1);
    await fecharOverlay(page);
    // ---- fim do bloco da Fase 3 ----
    await visitarEExtrair(page, 'A Delegacia');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Estalagem');
    // Onda 6: Walter conversa em diálogo embutido — o álibi nasce na fala; e
    // confrontá-lo com o registro (a própria assinatura das 19h40) desmorona a
    // álibi do carro das seis E anota a refutação do paradeiro no mural, sem barbante.
    await conversarEmbutido(page, 'Interrogar Walter Arthurs');
    checar('Onda 6: o botão da estalagem abre o diálogo de Walter', (await page.locator('[data-opcoes-dialogo]').count()) >= 1);
    await page.locator('[data-confrontos] [data-requer-carta="ev_registro_estalagem"]').click();
    await espera(page, 300);
    checar('Onda 6: o registro desmorona o álibi de Walter', (await page.locator('body').innerText()).includes('Não houve carro'));
    await fecharOverlay(page);
    // Segunda visita ao réu DEPOIS do registro da estalagem: agora a prova está
    // na mesa e a caixa de confronto abre a pergunta da estalagem; confrontá-la
    // rende a reação de Silas (observável, nunca confissão — o veredicto é do
    // mural) e ANOTA a refutação do paradeiro dele no mural (barbante removível).
    await abrirNo(page, 'A Saleta');
    checar('Rota 1: prova colhida abre a pergunta de confronto', (await page.locator('[data-confrontos] [data-requer-carta="corrob_estalajadeiro"]').count()) === 1);
    await page.locator('[data-confrontos] [data-requer-carta="corrob_estalajadeiro"]').click();
    await espera(page, 300);
    checar('Rota 1: confrontar a prova rende a reação do réu (nunca confissão)', (await page.locator('body').innerText()).includes('O estalajadeiro terá contado os quartos errados'));
    checar('Confronto: a linha conectiva pousa a prova entre os dois', (await page.locator('[data-prova-apresentada]').count()) === 1);
    // Canal lateral: "retomar a conversa" devolve ao beat e reabre a caixa; e a
    // caixa NÃO abre pergunta para prova alheia possuída (o rigor do corpo).
    await page.locator('.opcao-dialogo--voltar').first().click();
    await espera(page, 200);
    checar('Canal lateral: retomar reabre a caixa de confronto no beat', (await page.locator('[data-confrontos]').count()) === 1);
    checar('Confronto gated: prova alheia possuída não abre pergunta de confronto', (await page.locator('[data-requer-carta="ev_rigor"]').count()) === 0);
    await fecharOverlay(page);
    // Etapa 1 (mapa): o lembrete nomeia QUEM recebeu o perito — a oficina,
    // visitada antes e agora não-atual, recorda o aprendiz Davey Tull.
    checar('Etapa 1: o lembrete nomeia quem foi encontrado no local', (await page.locator('body').innerText()).includes('visitado · Davey Tull'));
    // Onda 6: Agnes e Grey agora recebem em DIÁLOGO (conversão integral) —
    // as cartas (álibi, comportamento) nascem das falas, pelos assuntos.
    await interrogarEExtrair(page, 'A Loja da Sra. Rooke');
    checar('Onda 6: a loja e correio abre em diálogo', (await page.locator('[data-opcoes-dialogo]').count()) >= 1);
    await fecharOverlay(page);
    await interrogarEExtrair(page, 'O Moinho');
    await fecharOverlay(page);

    await page.click('text=CONSTRUIR A ACUSAÇÃO');
    await espera(page, 500);
    // Q3: o mural não traz mais o gabarito do legista pendurado.
    checar('Rota 1: mural sem o lembrete do legista', !(await page.locator('body').innerText()).includes('LEMBRETE DO LEGISTA'));
    await definirJanela(page, 'dia 13 · 21h', 'dia 13 · 22h');
    await page.getByRole('button', { name: 'Ferida por arma branca', exact: true }).click();
    await concluirParte(page);
    await page.getByRole('button', { name: 'Silas Crane', exact: true }).click();
    await espera(page, 200);
    await page.getByRole('button', { name: /Buril Claro no Estojo/ }).click();
    await espera(page, 200);
    await page.locator('text=PRESENÇA — O RÉU NA CENA').click();
    await espera(page, 250);
    await concluirParte(page);
    // Mentiras: rigor e livores derrubam o padeiro E o mostrador forjado (Q1);
    // o registro da estalagem derruba o paradeiro do réu (Q4).
    for (const alvo of [/Luz Vista de Madrugada/, /Relógio de Lareira Esmagado/]) {
      for (const fato of [/Corpo Endurecido/, /Manchas Arroxeadas/]) {
        await page.getByRole('button', { name: fato }).last().click();
        await espera(page, 200);
        await page.getByRole('button', { name: alvo }).last().click();
        await espera(page, 250);
      }
    }
    await page.getByRole('button', { name: /O Quarto Cinco às Escuras/ }).last().click();
    await espera(page, 200);
    await page.getByRole('button', { name: /Recolhido à Estalagem às Oito/ }).last().click();
    await espera(page, 250);
    await concluirParte(page);
    // Onda 2 (P2): o rótulo da Estação III recolhida conta TAMBÉM o
    // paradeiro do réu desmentido, não só as mentiras de hora.
    checar('Onda 2: Estação III conta o paradeiro desmentido do réu', (await page.locator('body').innerText()).includes('paradeiro(s) desmentido(s)'));
    await page.getByRole('button', { name: 'Consertos reclamados na coluna de S.C.' }).click();
    await concluirParte(page);
    // Juízos: Walter e Agnes inocentes com as mentiras expostas; Grey e
    // Davey inocentes de paradeiro firmado.
    checar('Rota 1: retratos nos Juízos do mural', (await page.locator('svg[data-retrato]').count()) >= 2);
    await page.getByRole('button', { name: 'Inocente', exact: true }).first().click();
    await espera(page, 300);
    // Onda 6: o confronto feito EM CENA (registro apresentado a Walter)
    // dispensa o barbante manual — a lacuna dele nem chega a aparecer.
    checar('Onda 6: confronto em cena dispensa o barbante manual (Walter)', !(await page.locator('body').innerText()).includes('Paradeiro de Walter Arthurs por confrontar.'));
    await page.getByRole('button', { name: 'Inocente', exact: true }).nth(1).click();
    await espera(page, 300);
    // Onda 3 (P1): escolher "Inocente" com paradeiro por confrontar acrescenta
    // a linha neutra ao lembrete; o confronto (barbante manual) a apaga.
    checar('Onda 3: lembrete aponta o paradeiro por confrontar', (await page.locator('body').innerText()).includes('Paradeiro da Sra. Agnes Rooke por confrontar.'));
    await page.getByRole('button', { name: /Cesta de Ceia para Dois/ }).last().click();
    await espera(page, 200);
    checar('Onda 3: o confronto apaga a linha do lembrete', !(await page.locator('body').innerText()).includes('Paradeiro da Sra. Agnes Rooke por confrontar.'));
    await page.getByRole('button', { name: 'Inocente', exact: true }).nth(2).click();
    await espera(page, 200);
    await page.getByRole('button', { name: 'Inocente', exact: true }).nth(3).click();
    await espera(page, 200);

    let texto = await julgar(page);
    checar('P0 §5: acusação completa sela sem passo extra', !julgar.viuLacunas);
    checar('Rota 1: desfecho Vitória Absoluta', texto.includes('Vitória Absoluta'));
    checar('Rota 1: monólogo sem id interno vazado', !/buril_gravador|vidro_mostrador|carta_suplica|assinatura_registro|cesta_ceia/.test(texto));
    checar('Rota 1: monólogo sem NaN/Infinity', !/NaN|Infinity/.test(texto));
    checar('Rota 1: monólogo narra o álibi do réu desmentido (Q4)', texto.includes('O registro desmente o paradeiro'));
    // Q5: o encerramento paga com epílogo + retrato da investigação.
    await page.getByRole('button', { name: 'Encerrar o caso' }).click();
    await espera(page, 700);
    const epilogo = await textoOverlay(page);
    checar('Rota 1: epílogo presente ao encerrar', epilogo.includes('Epílogo'));
    checar('Rota 1: retrato da investigação presente', /retrato da investiga/i.test(epilogo));
    // O encerramento paga a explicação da luz (a isca do padeiro refutada)
    // e o retrato nomeia o que ficou por abrir (o Gabinete, nesta rota).
    checar('Rota 1: epílogo paga a explicação da luz', epilogo.includes('lampião'));
    checar('Rota 1: retrato nomeia o que ficou por visitar', epilogo.includes('Ficou por visitar: Gabinete Pettigrew'));
    await page.getByRole('button', { name: 'Fechar o caderno' }).click();
    // Onda 1: fechar o caderno apaga o save — a página recarregada cai no
    // convite limpo, nunca no gate de retomada.
    await page.waitForSelector('text=Quem atende ao chamado?', { timeout: 15000 });
    checar('Onda 1: fechar o caderno limpa o save (convite limpo)', (await page.getByRole('button', { name: 'Continuar o caso' }).count()) === 0);
    await espera(page, 400);

    // ============================================================
    // ROTA 2 — APRESSADO (Harlan): iscas primeiro, corpo tarde,
    // acusa a governanta. Esperado: Erro Judiciário.
    // ============================================================
    console.log('\n=== ROTA 2 — Apressado (Harlan) → Erro Judiciário ===');
    await novaPartida(page, 'Dr. Harlan Blackwell');

    await visitarEExtrair(page, 'A Cena do Crime');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Delegacia'); // o testamento desbloqueia o Gabinete
    await fecharOverlay(page);
    await page.click('text=Caderneta');
    await espera(page, 400);
    checar('Rota 2: diário anuncia o novo destino no mapa', (await page.locator('body').innerText()).includes('Novo destino no mapa'));
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Gabinete Pettigrew'); // a viagem-isca
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Estalagem');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'O Corpo'); // só agora, degradado
    const corpoTexto = await page.locator('body').innerText();
    checar('Rota 2: interpolações resolvidas na prosa (sem marcador cru)', !corpoTexto.includes('{g:') && !corpoTexto.includes('{detective.'));
    await page.getByRole('button', { name: 'Medir temperatura' }).click();
    await espera(page, 400);
    await arquivarFicha(page);
    await fecharOverlay(page);

    await page.click('text=CONSTRUIR A ACUSAÇÃO');
    await espera(page, 500);
    await definirJanela(page, 'dia 13 · 18h', 'dia 14 · 08h'); // larga
    await page.getByRole('button', { name: 'Ferida por arma branca', exact: true }).click();
    await concluirParte(page);
    await page.getByRole('button', { name: 'Walter Arthurs', exact: true }).click();
    await espera(page, 200);
    await page.getByRole('button', { name: /Carta Amassada em Bola/ }).click();
    await espera(page, 200);
    await page.locator('text=PRESENÇA — O RÉU NA CENA').click();
    await espera(page, 250);
    // "Mentiu, logo matou": sem mentiras confrontadas, sem móbil, sem juízos.
    texto = await julgar(page);
    checar('P0 §5: acusação com lacunas exige "Selar assim mesmo"', julgar.viuLacunas);
    checar('Rota 2: desfecho Erro Judiciário', texto.includes('Erro Judiciário'));
    checar('Rota 2: sem id interno vazado', !texto.includes('carta_suplica'));
    // Q2: com a retentativa de pé, o culpado NÃO é nomeado no monólogo.
    checar('Rota 2: erro não nomeia o culpado antes do encerramento', !texto.includes('Silas Crane'));
    // Q2: revisar custa horas — o relógio anda 2h (16h00 → 18h00).
    await page.getByRole('button', { name: /Revisar a acusação/ }).click();
    await espera(page, 700);
    checar('Rota 2: a retentativa adia a audiência (relógio a 18h00)', (await page.locator('body').innerText()).includes('18h00'));
    // Q9: o mural reaberto não volta à Estação I — abre na primeira pendência.
    const muralReaberto = await page.locator('body').innerText();
    checar('Rota 2: mural reaberto na pendência (móbil), não na Estação I', muralReaberto.includes('IV · O Móbil') && !muralReaberto.includes('QUANDO — A JANELA'));
    texto = await julgar(page);
    // Onda 3: na SEGUNDA queda no mesmo ponto (periférico), a cortesia do
    // tutorial escala — a dica nomeia o suspeito e ensina o confronto.
    checar('Onda 3: dica reincidente mais específica na segunda queda', texto.includes('pede um gesto a mais'));
    // Q5/Q2: o encerramento definitivo revela o culpado no epílogo.
    await page.getByRole('button', { name: 'Encerrar o caso' }).click();
    await espera(page, 700);
    const epilogoErro = await textoOverlay(page);
    checar('Rota 2: epílogo do erro revela o verdadeiro autor', epilogoErro.includes('Silas Crane'));
    await page.getByRole('button', { name: 'Fechar o caderno' }).click();
    await espera(page, 800);

    // ============================================================
    // ROTA 3 — INTUITIVO (Harlan): nunca examina o corpo, acusa
    // Edgar por faro. Esperado: Impunidade.
    // ============================================================
    console.log('\n=== ROTA 3 — Intuitivo (Harlan) → Impunidade ===');
    await novaPartida(page, 'Dr. Harlan Blackwell');

    await interrogarEExtrair(page, 'A Saleta'); // §7.1: o interrogatório é diálogo
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Delegacia'); // inclui o "visto com vida" (janela aberta)
    await fecharOverlay(page);

    // REGRESSÃO (agora na Caderneta — Q3 tirou a leitura do mural): com só a
    // âncora "visto com vida", a leitura do legista precisa formatar a janela
    // aberta ("depois de..."), nunca NaN/Infinity.
    await page.click('text=Caderneta');
    await espera(page, 400);
    const leitura = await page.locator('body').innerText();
    checar('Rota 3: leitura do legista sem NaN/Infinity com janela aberta', !/NaN|Infinity/.test(leitura));
    checar('Rota 3: leitura formata janela aberta ("depois de")', leitura.includes('depois de'));
    await fecharOverlay(page);

    await page.click('text=CONSTRUIR A ACUSAÇÃO');
    await espera(page, 500);
    await definirJanela(page, 'dia 13 · 20h', 'dia 14 · 08h'); // larga
    await page.getByRole('button', { name: 'Trauma contuso', exact: true }).click(); // chute
    await concluirParte(page);
    await page.getByRole('button', { name: 'Silas Crane', exact: true }).click();
    await espera(page, 200);
    await concluirParte(page); // sem vestígio
    await concluirParte(page); // sem mentiras
    await concluirParte(page); // sem carta de móbil ligada a este réu
    await page.getByRole('button', { name: 'Sem juízo', exact: true }).first().click();
    await espera(page, 150);
    await page.getByRole('button', { name: 'Sem juízo', exact: true }).nth(1).click();
    await espera(page, 150);
    await page.getByRole('button', { name: 'Sem juízo', exact: true }).nth(2).click();
    await espera(page, 150);
    await page.getByRole('button', { name: 'Sem juízo', exact: true }).nth(3).click();
    await espera(page, 150);
    texto = await julgar(page);
    checar('Rota 3: desfecho Impunidade', texto.includes('Impunidade'));

    // ============================================================
    // ROTA FLAT — a rota de escape 2D (?flat=1): sem WebGL/diorama,
    // a grade de localidades original precisa jogar igual.
    // ============================================================
    console.log('\n=== ROTA FLAT — grade 2D (?flat=1) ===');
    await novaPartida(page, 'Dr. Harlan Blackwell', '?flat=1');
    checar('Rota flat: sem canvas 3D', (await page.locator('canvas').count()) === 0);
    // §5.1: a planta é SVG 2D — funciona idêntico em ?flat=1. Abre o corpo,
    // confere a planta e anda para a cena por ela (0h).
    await abrirNo(page, 'O Corpo');
    checar('Rota flat: a planta da relojoaria aparece (SVG 2D)', (await page.locator('[data-planta]').count()) >= 1);
    await page.locator('[data-planta] [data-alvo="cena"]').click();
    await espera(page, 500);
    checar('Rota flat: andar pela planta viaja para a cena', (await page.locator('body').innerText()).includes('A Cena — Escritório dos Fundos'));
    await fecharOverlay(page);
    await visitarEExtrair(page, 'O Corpo');
    await page.getByRole('button', { name: 'Medir temperatura' }).click();
    await espera(page, 400);
    await arquivarFicha(page);
    checar('Rota flat: extração pela prosa funciona', (await page.locator('.termo-extraido').count()) >= 3);
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Delegacia'); // viagem pela grade 2D (lead do Gabinete)
    await fecharOverlay(page);
    checar('Rota flat: Gabinete desbloqueado pela grade 2D', (await page.locator('body').innerText()).includes('Gabinete Pettigrew'));

    // ============================================================
    // ROTA GERADA — o caso PROCEDURAL jogável (FASE 6 do gerador):
    // carrega a réplica dirigida por ?caso=, atravessa a abertura
    // GERADA (6 passos, mesmo botão final), extrai pela prosa gerada,
    // mede a temperatura e abre o mural. Fumaça: a mecânica inteira
    // precisa jogar num pacote que nenhuma mão escreveu.
    // ============================================================
    console.log('\n=== ROTA GERADA — a réplica procedural (?caso=) ===');
    await page.goto(BASE + `?caso=gerado_${SEED_REPLICA}`);
    await espera(page, 800);
    checar('Rota gerada: os 3 modos aparecem na tela inicial', (await page.locator('[data-modo]').count()) === 3);
    checar(
      'Rota gerada: o modo réplica nasce selecionado pelo ?caso=',
      (await page.locator('[data-modo="replica"][aria-pressed="true"]').count()) === 1
    );
    await page.click('text=Dr. Harlan Blackwell');
    await espera(page, 600);
    for (let i = 0; i < 5; i++) {
      await page.locator('button, [role=button], a').filter({ hasText: '→' }).last().click();
      await espera(page, 200);
    }
    await page.click('text=Entrar — iniciar a investigação');
    await espera(page, 600);
    checar('Rota gerada: a maquete 3D cede à grade 2D (nós fora do diorama)', (await page.locator('canvas').count()) === 0);
    await visitarEExtrair(page, 'O Corpo');
    await page.getByRole('button', { name: 'Medir temperatura' }).click();
    await espera(page, 400);
    await arquivarFicha(page);
    checar('Rota gerada: extração pela prosa gerada funciona', (await page.locator('.termo-extraido').count()) >= 2);
    await fecharOverlay(page);
    // E1 (OS palco em anéis): a cena gerada divide-se em pontos de
    // interesse — um por cômodo do grid. O acordeão nasce fechado; abrir
    // revela a prosa (com ou sem termo — pontos de ambiência existem).
    await abrirNo(page, 'A Cena do Crime');
    checar('Rota gerada: a cena expõe o acordeão de pontos', (await page.locator('.ponto-interesse').count()) >= 1);
    await abrirPontos(page);
    checar(
      'Rota gerada: abrir os pontos revela a prosa dos cômodos',
      (await page.locator('.ponto-corpo').count()) >= 1
    );
    await extrairTermosVisiveis(page);
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Delegacia');
    // Árvore de diálogo procedural (OS diálogo): a delegacia chama um a um
    // os suspeitos; o beat de paradeiro sustenta a carta de álibi em
    // qualquer tom, e a conversa desce até se encerrar.
    checar(
      'Rota gerada: a delegacia oferece um interrogatório por suspeito',
      (await page.locator('.botao-dialogo-local').count()) === 5
    );
    await page.locator('.botao-dialogo-local').first().click();
    await espera(page, 400);
    checar(
      'Rota gerada: o beat abre com os quatro tons',
      (await page.locator('.opcao-dialogo[data-tom]').count()) === 4
    );
    await page.locator('.opcao-dialogo[data-tom]').last().click(); // oblíquo
    await espera(page, 300);
    checar(
      'Rota gerada: o beat de paradeiro sustenta a carta de álibi',
      (await page.locator('[data-no-dialogo] .termo-clicavel').count()) >= 1
    );
    await extrairTermosVisiveis(page);
    checar(
      'Rota gerada: a fala extraiu a carta de álibi',
      (await page.locator('[data-no-dialogo] .termo-extraido').count()) >= 1
    );
    await percorrerDialogo(page);
    checar(
      'Rota gerada: a conversa desce e se encerra',
      (await page.locator('[data-conversa-encerrada]').count()) === 1
    );
    await fecharOverlay(page);
    await page.click('text=CONSTRUIR A ACUSAÇÃO');
    await espera(page, 500);
    const muralGerado = await textoOverlay(page);
    checar('Rota gerada: o mural abre na primeira estação', muralGerado.includes('O Corpo'));
    checar(
      'Rota gerada: nenhum id interno vazou para a tela',
      !(await page.locator('body').innerText()).match(/\bgen_\w+/)
    );
    await fecharOverlay(page);
    // Retomada: um F5 no meio do caso gerado reoferece a retomada e volta
    // ao MESMO caso (o save guarda o casoId; o App recarrega o pacote
    // certo antes do render — nunca se cai no caso-escola por engano).
    await page.goto(BASE);
    await espera(page, 800);
    checar('Rota gerada: recarregar oferece a retomada', (await page.getByRole('button', { name: 'Continuar o caso' }).count()) === 1);
    await page.getByRole('button', { name: 'Continuar o caso' }).click();
    await espera(page, 600);
    checar(
      'Rota gerada: a retomada volta ao caso gerado (não ao caso-escola)',
      (await page.locator('body').innerText()).includes('A Vizinhança')
    );
    await page.evaluate(() => window.localStorage && window.localStorage.clear());

    // ============================================================
    checar('Zero erros de console em todas as rotas', errosConsole.length === 0);
    if (errosConsole.length) console.error('Erros de console:', errosConsole);
  } finally {
    await browser.close();
    servidor.kill();
  }

  const falhas = resultados.filter(([, ok]) => !ok);
  console.log(`\n${falhas.length === 0 ? 'UI VÁLIDA.' : `UI COM ${falhas.length} FALHA(S).`}`);
  process.exit(falhas.length === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('ERRO no QA de UI:', e.message);
  process.exit(1);
});
