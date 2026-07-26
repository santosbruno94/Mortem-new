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
// Robustez (revisão 24/07): (a) a porta ocupada por OUTRO servidor é erro
// claro — sem isto, o fetch respondia e o QA rodava contra um build
// errado em silêncio; (b) o stderr do vite é capturado e impresso na
// falha — com stdio:'ignore', um vite morto virava só "não respondeu em
// 30s"; (c) o processo morto durante a espera aborta na hora.
// ---------------------------------------------------------------------
async function subirServidor() {
  try {
    await fetch(BASE);
    throw new Error(
      `A porta ${PORTA} já está ocupada por outro servidor — encerre-o antes de rodar o QA ` +
        '(senão as checagens correriam contra um build que não é o deste diretório).'
    );
  } catch (e) {
    if (!(e instanceof TypeError)) throw e; // TypeError = ninguém na porta (fetch falhou): ok
  }
  // detached: o npm cria um filho (vite) que sobreviveria ao kill do pai —
  // o grupo de processos permite matar os dois no encerramento.
  const proc = spawn('npm', ['run', 'dev', '--', '--port', String(PORTA), '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });
  let saidaServidor = '';
  proc.stdout.on('data', (d) => (saidaServidor += d));
  proc.stderr.on('data', (d) => (saidaServidor += d));
  let morto = false;
  proc.on('exit', () => (morto = true));
  for (let i = 0; i < 60; i++) {
    if (morto) break;
    try {
      const r = await fetch(BASE);
      if (r.ok) return proc;
    } catch {
      // servidor ainda subindo
    }
    await new Promise((res) => setTimeout(res, 500));
  }
  matarServidor(proc);
  throw new Error(
    `Servidor não respondeu em ${BASE}.` + (saidaServidor ? `\n--- saída do vite ---\n${saidaServidor.slice(-2000)}` : '')
  );
}

// Mata o GRUPO de processos (npm + vite): o kill simples matava só o npm e
// o vite órfão seguia segurando a porta — a rodada seguinte falhava.
function matarServidor(proc) {
  try {
    process.kill(-proc.pid);
  } catch {
    try {
      proc.kill();
    } catch {
      // já morto
    }
  }
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
  // Espera por CONDIÇÃO (o convite montado), não por tempo fixo: máquina
  // lenta estourava a espera; máquina rápida a desperdiçava.
  await page.waitForSelector(`text=${perito}`, { timeout: 15000 });
  await page.click(`text=${perito}`);
  await page.waitForSelector('text=→', { timeout: 15000 });
  // Abertura do CASO-ESCOLA: 8 avanços até o passo 9, depois entrar (sem as
  // perguntas). Eram 6 até a OS-R3, que somou o cold open da descoberta e a
  // ordem do coroner. A rota gerada tem contagem própria (6 passos), mais
  // abaixo — este helper só serve ao caso-escola.
  for (let i = 0; i < 8; i++) {
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

// OS-R2 (cena única) — andar DENTRO da relojoaria. O prédio é um nó só e a
// planta é a navegação entre os seus sub-locais: clicar um cômodo não viaja,
// troca de sala, e o relógio não se mexe. O alvo é o id do sub-local
// (`corpo`, `escritorio`, `loja`, `copa`, `oficina`) — contrato de
// src/data/planta_relojoaria.js.
async function andarNaPlanta(page, subLocal) {
  await page.locator(`[data-planta] [data-alvo="${subLocal}"]`).click();
  await espera(page, 500);
}

// Anda até um sub-local do prédio já aberto e varre-o inteiro.
async function varrerSubLocal(page, subLocal) {
  await andarNaPlanta(page, subLocal);
  await varrerLocalAberto(page);
}

// Viaja até um nó da mesa e extrai todos os termos em negrito do overlay.
// Cada extração abre a ficha de coleta, arquivada antes do próximo termo.
// Onde há pontos de interesse, revela todos antes de varrer os termos.
// Micro-gestos visíveis também são acionados (Onda 7).
async function visitarEExtrair(page, rotuloNo) {
  await abrirNo(page, rotuloNo);
  await varrerLocalAberto(page);
}

// A varredura de um local JÁ ABERTO (extraída para o bloco do beat da E3
// poder abrir o local à sua maneira e varrer com o mesmo gesto).
async function varrerLocalAberto(page) {
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
  let extraidos = 0;
  for (let i = 0; i < 10 && (await termos.count()) > 0; i++) {
    await termos.first().click();
    await espera(page, 150);
    await arquivarFicha(page);
    extraidos += 1;
  }
  return extraidos;
}

// Percorre um diálogo JÁ ABERTO (§7.2): a conversa DESCE e não volta. A cada
// beat escolhe um tom — o último do leque (oblíquo), que apanha a precisão
// quando há (ex.: a lasca na bainha de Silas) — e extrai os termos da resposta,
// até a conversa se encerrar. Os confrontos ficam de fora (canal lateral, só
// apresentando a prova). Só as falas do perito têm [data-tom].
async function percorrerDialogo(page) {
  // OS-R6: devolve quantos termos a descida inteira extraiu. Antes bastava
  // olhar a tela no fim, porque o último beat era o segundo e trazia carta;
  // com o beat 3 (que por desenho NÃO marca carta nenhuma — GR6-4) a tela
  // final está limpa, e contar nela mediria a coisa errada.
  let extraidos = await extrairTermosVisiveis(page); // a fala de abertura
  const seletorTom = '.opcao-dialogo[data-tom]';
  for (let guarda = 0; guarda < 6; guarda++) {
    const n = await page.locator(seletorTom).count();
    if (n === 0) break; // a conversa se encerrou (sem volta)
    await page.locator(seletorTom).last().click(); // tom oblíquo
    await espera(page, 250);
    extraidos += await extrairTermosVisiveis(page);
  }
  return extraidos;
}

// Interrogatório num nó do mapa (conversão integral: Silas, Agnes, Grey).
async function interrogarEExtrair(page, rotuloNo) {
  await abrirNo(page, rotuloNo);
  return percorrerDialogo(page);
}

// Diálogo EMBUTIDO (Onda 6): de dentro da localidade aberta, o botão
// .botao-dialogo-local abre a árvore (Walter na estalagem, Davey na oficina).
async function conversarEmbutido(page, rotuloBotao) {
  await page.getByRole('button', { name: rotuloBotao }).click();
  await espera(page, 400);
  return percorrerDialogo(page);
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
// helper atravessa o passo quando ele existe e DEVOLVE { texto, viuLacunas }
// — as rotas checam quem deve (e quem não deve) ver o passo. (Estado
// pendurado na função era frágil e não-óbvio; revisão 24/07.)
// (OS-R7) Entre o selo e o monólogo passa a RECONSTITUIÇÃO — peça de
// leitura, sem escolha, com um só botão de saída. O helper atravessa-a e
// DEVOLVE o texto dela em `reconstituicao`, para que as rotas possam
// cobrar o que a cena mostra (e o que ela se recusa a mostrar).
async function julgar(page) {
  await page.getByRole('button', { name: 'Levar a julgamento' }).click();
  await espera(page, 400);
  await page.getByRole('button', { name: 'Confirmar e julgar' }).click();
  await espera(page, 400);
  const selar = page.getByRole('button', { name: 'Selar assim mesmo' });
  const viuLacunas = (await selar.count()) > 0;
  if (viuLacunas) await selar.click();
  await espera(page, 900);
  const reconstituicao = await textoOverlay(page);
  const passos = await page.locator('[data-passo-reconstituicao]').count();
  await page.getByRole('button', { name: 'O que ficou por dizer' }).click();
  await espera(page, 700);
  return { texto: await textoOverlay(page), viuLacunas, reconstituicao, passosReconstituicao: passos };
}

// ---------------------------------------------------------------------
// As checagens acumulam em vez de abortar: o relatório sai inteiro.
// ---------------------------------------------------------------------
const resultados = [];
// A rota e a última checagem correntes: na falha dura (exceção), o relatório
// diz ONDE parou em vez de morrer mudo (revisão 24/07).
let rotaAtual = '(antes das rotas)';
function checar(rotulo, ok) {
  resultados.push([rotulo, !!ok]);
  checar.ultima = rotulo;
  console.log(`${ok ? 'OK ' : 'FALHA'} — ${rotulo}`);
}

// =====================================================================
async function main() {
  const servidor = await subirServidor();
  // O navegador sobe DEPOIS do servidor: se o launch falhar (Chromium
  // ausente/incompatível), o servidor não pode ficar órfão na porta.
  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    matarServidor(servidor);
    throw e;
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  const errosConsole = [];
  page.on('console', (m) => m.type() === 'error' && errosConsole.push(m.text()));
  page.on('pageerror', (e) => errosConsole.push(String(e.message)));

  // OS Prancha da Vila (E1): o chunk do three.js só pode descer se o
  // jogador PEDIR a maquete. A rede é a prova — nenhum caminho da sessão
  // padrão pode encostar no diorama.
  const chunksDe3D = [];
  page.on('request', (r) => {
    const url = r.url();
    if (/DioramaVila|\bthree\b|three\.module|@react-three/.test(url)) chunksDe3D.push(url);
  });

  try {
    // ============================================================
    // ROTA 1 — METÓDICO (Harlan): corpo cedo, tudo ligado.
    // Esperado: Vitória Absoluta.
    // ============================================================
    rotaAtual = '\n=== ROTA 1 — Metódico (Harlan) → Vitória Absoluta ===';
    console.log('\n=== ROTA 1 — Metódico (Harlan) → Vitória Absoluta ===');
    await novaPartida(page, 'Harlan Blackwell');

    // OS Prancha da Vila (E1): a PRANCHA de gravura é a vista padrão da
    // mesa — SVG puro, sem canvas e sem chunk de three. Os nós seguem
    // clicáveis por texto (as mesmas etiquetas de papel do diorama).
    await page.waitForSelector('[data-prancha]', { timeout: 15000 });
    checar('E1: a prancha da vila é a vista padrão da mesa ([data-prancha])', (await page.locator('[data-prancha]').count()) === 1);
    checar('E1: a sessão padrão não monta canvas 3D', (await page.locator('canvas').count()) === 0);
    checar('E1: a sessão padrão não baixa nenhum chunk de three', chunksDe3D.length === 0);
    // Fase 4: as etiquetas dos nós são tags de papel pendentes (HTML real,
    // clicáveis por texto), as MESMAS nas duas vistas. O rótulo do nó atual
    // pulsa/repousa; na maquete, a viagem com custo ganha o beat do pino.
    checar('Fase 4: etiquetas de papel presentes na prancha (.rotulo-papel)', (await page.locator('.rotulo-papel').count()) >= 1);

    // O alternador: a maquete 3D continua a um clique (e só aí o three
    // desce), e voltar à prancha não perde nem o relógio nem o estado.
    await page.getByRole('button', { name: 'A maquete' }).click();
    await page.waitForSelector('canvas', { timeout: 20000 });
    checar('E1: "A maquete" ainda sobe o diorama 3D (canvas)', (await page.locator('canvas').count()) >= 1);
    checar('E1: pedir a maquete baixa o chunk de three', chunksDe3D.length >= 1);
    checar('E1: a maquete mostra as mesmas etiquetas de nó', (await page.locator('.rotulo-papel').count()) >= 1);
    await page.getByRole('button', { name: 'A prancha' }).click();
    await espera(page, 500);
    checar('E1: voltar à prancha descarta o canvas', (await page.locator('canvas').count()) === 0);
    checar('E1: alternar não mexeu no relógio (13h00)', (await page.locator('body').innerText()).includes('13h00'));

    // ---- FASE 1 — A Ficha de Coleta (§6.2): a evidência se apresenta no ato ----
    // Extrair um termo abre a ficha (data-overlay="ficha") com a descrição
    // completa; arquivar devolve a carta à mesa; a carta da mesa reabre a
    // mesma ficha; e a Caderneta, rebaixada a diário, não traz mais a descrição.
    const DESC_RIGOR = 'não cedem quando se tenta dobrá-los'; // trecho da descrição de ev_rigor
    const CARIMBO_RIGOR = 'Rígido por inteiro; extremidades começando a ceder'; // carimboPadrao de ev_rigor no estado "Corpo Endurecido" (ipmAte 24)
    // OS-R2: o prédio é um nó só ("A Relojoaria") e abre no corpo — o
    // primeiro sub-local que a localidade declara.
    await abrirNo(page, 'A Relojoaria');
    checar('OS-R2: a relojoaria abre no corpo (primeiro sub-local)', (await textoOverlay(page)).includes('O Corpo — Escritório dos Fundos'));
    await page.locator('.termo-clicavel').first().click(); // ev_rigor é o primeiro termo
    await espera(page, 300);
    checar('Fase 1: a ficha de coleta abre ao extrair (data-overlay="ficha")', (await page.locator('div.fixed[data-overlay="ficha"]').count()) >= 1);
    const textoFicha = await page.locator('div.fixed[data-overlay="ficha"]').last().innerText();
    checar('Fase 1: a ficha mostra a descrição completa da evidência', textoFicha.includes(DESC_RIGOR));
    await page.getByRole('button', { name: 'Arquivar na mesa' }).click();
    await espera(page, 300);
    checar('Fase 1: "Arquivar na mesa" fecha a ficha', (await page.locator('div.fixed[data-overlay="ficha"]').count()) === 0);
    await fecharOverlay(page); // fecha o corpo → volta à mesa
    // P11: a carta já não pousa na superfície da mesa (agora vive dentro
    // da ficha de pessoa). A reabertura passa pela Caderneta.
    await page.click('text=Caderneta');
    await espera(page, 400);
    await page.locator('.carta-pergaminho', { hasText: CARIMBO_RIGOR }).first().click();
    await espera(page, 300);
    checar('Fase 1: a Caderneta reabre a mesma ficha', (await page.locator('div.fixed[data-overlay="ficha"]').last().innerText()).includes(DESC_RIGOR));
    await page.getByRole('button', { name: 'Arquivar na mesa' }).click();
    await espera(page, 400);
    const textoCaderneta = await textoOverlay(page);
    checar('Fase 1: a Caderneta lista o carimbo da observação', textoCaderneta.includes(CARIMBO_RIGOR));
    checar('Fase 1: a Caderneta (diário) não traz mais a descrição', !textoCaderneta.includes(DESC_RIGOR));
    // Onda 8: o modo purista cala a síntese do legista na Caderneta — e
    // religa sem perder nada (o dado continua consolidando por baixo).
    await page.getByRole('button', { name: 'Dispensar a leitura' }).click();
    await espera(page, 200);
    checar('Onda 8: purista dispensa a leitura do legista', (await page.locator('body').innerText()).includes('dispensou a leitura do mestre'));
    await page.getByRole('button', { name: 'Tornar a pedir a leitura' }).click();
    await espera(page, 200);
    checar('Onda 8: religar devolve a leitura', !(await page.locator('body').innerText()).includes('dispensou a leitura do mestre'));
    await fecharOverlay(page);
    // ---- fim do bloco da Fase 1 ----

    // ---- FASE 2 — A planta da relojoaria e os pontos de interesse (§5.1) ----
    // Andar entre cômodos pela planta (0h, mesmo prédio) e a coleta em
    // camadas: um ponto revela o parágrafo e os seus termos extraíveis.
    await abrirNo(page, 'A Relojoaria');
    checar('Fase 2: a planta da relojoaria aparece no nó (data-planta)', (await page.locator('[data-planta]').count()) >= 1);
    await andarNaPlanta(page, 'escritorio');
    checar('OS-R2: a planta leva ao escritório dos fundos', (await textoOverlay(page)).includes('A Cena — Escritório dos Fundos'));
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
    // Andar pela planta: clicar o cômodo "a oficina" troca de sub-local (0h).
    await andarNaPlanta(page, 'oficina');
    checar('Fase 2: clicar um cômodo da planta anda no prédio', (await page.locator('body').innerText()).includes('A Oficina de Consertos'));
    checar('Fase 2: andar entre cômodos não gasta o relógio (13h00)', (await page.locator('body').innerText()).includes('13h00'));
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
    checar('Onda 1: a mesa volta com as fichas de pessoa', mesaRetomada.includes('Silas Crane'));
    checar('Onda 1: o relógio retomado não andou (13h00)', mesaRetomada.includes('13h00'));
    // ---- fim do bloco da Onda 1 ----

    // OS-R2: uma entrada no prédio, cinco cômodos varridos pela planta —
    // corpo, escritório, loja da frente, copa e oficina —, e tudo a 0h.
    await abrirNo(page, 'A Relojoaria');
    await varrerSubLocal(page, 'corpo'); // extrai os demais termos do corpo
    // Onda 7: os micro-gestos do corpo (voltar o corpo, dar corda ao relógio
    // e — desde a OS-R4 — abrir o fundo da caixa) foram acionados e ficaram
    // marcados como feitos.
    checar('Onda 7: micro-gestos do corpo acionados e marcados', (await page.locator('.gesto-pericial[data-feito]').count()) === 3);
    await page.getByRole('button', { name: 'Medir temperatura' }).click();
    await espera(page, 400);
    await arquivarFicha(page); // defensivo: o algor pousa sozinho (Onda 4)
    // O contador de esgotamento do caso-escola: corpo esgotado = 8 de 8
    // (a OS-R4 acrescentou a gravação sob a tampa de dentro).
    checar('Rota 1: contador de observações da localidade (8 de 8 no corpo)', (await page.locator('body').innerText()).includes('8 de 8 observações registradas aqui'));
    await varrerSubLocal(page, 'escritorio');
    await varrerSubLocal(page, 'loja'); // a vitrine e a fechadura do beco (martelo §5: loja)
    checar('OS-R2: a loja da frente é sala própria e rende a vitrine', (await textoOverlay(page)).includes('A Loja da Frente'));
    await varrerSubLocal(page, 'copa');
    await varrerSubLocal(page, 'oficina'); // desbloqueia o Gabinete (lead do livro de ordens)
    // Onda 6: Davey conversa em diálogo embutido — o hábito da corda e o
    // álibi dele nascem das falas, não mais de um ponto de interesse. O
    // diálogo embutido segue o SUB-LOCAL onde a pessoa trabalha.
    const extraidasDavey = await conversarEmbutido(page, 'Conversar com Davey Tull');
    // §7.2: a conversa desce (o hábito da corda e o álibi nascem das falas).
    // OS-R6: conta a DESCIDA inteira — o beat 3 fecha a conversa sem carta.
    checar('Onda 6: a conversa embutida com o aprendiz extrai cartas', extraidasDavey >= 1);
    checar('OS-R2: o prédio inteiro se varre sem gastar o relógio (13h00)', (await page.locator('body').innerText()).includes('13h00'));
    await fecharOverlay(page);
    checar('Rota 1: Gabinete desbloqueado e destacado como novo', (await page.locator('body').innerText()).includes('· novo'));
    // E3: o nó revelado entra a bico de pena FORA do quadro gravado, com o
    // carimbo da hora em que o lead chegou — a mesma hora que a Caderneta
    // registrou para o desbloqueio.
    checar('E3: o adendo traz o carimbo da hora do lead', (await page.locator('.carimbo-acrescido').count()) >= 1);
    checar(
      'E3: o carimbo diz "Acrescido <hora>"',
      /^Acrescido \d\dh\d\d$/.test((await page.locator('.carimbo-acrescido').first().innerText()).trim())
    );
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
    const extraidasSilas = await percorrerDialogo(page);
    checar('Fase 3: extraiu carta de dentro do diálogo (álibi registrado)', extraidasSilas >= 1);
    checar('§7.2: a conversa se encerra sem volta ao hub', (await page.locator('[data-conversa-encerrada]').count()) === 1);
    // OS-R6: a conversa desce até o TERCEIRO beat (D7) e para lá. Antes da
    // R6 ela morria no segundo, e quem chegasse sem carta fazia duas
    // perguntas e saía.
    checar('OS-R6: a conversa desce até o beat 3', (await page.locator('[data-no-dialogo^="b3_"]').count()) === 1);
    // OS-R6: o nível de exposição é legível na tela, e diante do réu, com a
    // mesa quase vazia neste ponto da rota, ele é o piso.
    checar('OS-R6: o beat 3 declara o nível de exposição', (await page.locator('[data-exposicao]').count()) === 1);
    // OS-R6: nesta altura o perito varreu a relojoaria e não mais que isso —
    // tem parte do dossiê do réu, e longe dos dois terços. O nível é o do
    // meio, e é ele que paga a alfinetada pequena.
    checar(
      'OS-R6: com parte do dossiê na mesa, o beat 3 roda em E1',
      (await page.locator('[data-exposicao="E1"]').count()) === 1
    );
    await fecharOverlay(page);
    // ---- fim do bloco da Fase 3 ----
    // Etapa 1 (mapa): um local já visitado e que não é o atual recorda no
    // rótulo que o perito esteve lá (a relojoaria, deixada para trás quando
    // o perito passou à saleta).
    checar('Etapa 1: o mapa marca os locais visitados', (await page.locator('body').innerText()).includes('visitado ·'));
    // ---- E3 — O BEAT DA VIAGEM e o corte por toque ----
    // A primeira viagem com custo real da rota: a tacha corre a estrada
    // desenhada e a conta da hora se lê. Cortar o beat abre o local no ato
    // e NÃO muda o estado — quem paga a hora é o motor, no clique.
    await page.click('text=O Posto do Guarda');
    await espera(page, 240);
    checar('E3: o beat da viagem diz o preço (relógio, rigidez, perecível)', (await page.locator('[data-preco-viagem]').count()) === 1);
    const precoLido = await page.locator('[data-preco-viagem]').innerText();
    checar('E3: a conta traz o relógio de → para', /13h00.*14h00/s.test(precoLido));
    checar('E3: a conta traz a rigidez na chegada', /Rigidez na chegada/.test(precoLido));
    const relogioNoBeat = (await page.locator('body').innerText()).match(/\d\dh\d\d/)?.[0];
    await page.locator('.prancha-corta-beat').click();
    await page.waitForSelector('div.fixed[data-overlay]', { timeout: 8000 });
    await espera(page, 300);
    checar('E3: cortar o beat abre o local no ato', (await page.locator('div.fixed[data-overlay]').count()) >= 1);
    checar('E3: cortado, o beat some da prancha', (await page.locator('[data-preco-viagem]').count()) === 0);
    checar(
      'E3: cortar o beat produz o mesmo estado (o relógio já foi pago no clique)',
      relogioNoBeat === (await page.locator('body').innerText()).match(/\d\dh\d\d/)?.[0]
    );
    await varrerLocalAberto(page);
    // ---- fim do bloco da E3 ----
    await fecharOverlay(page);
    // ---- OS-R4 — A TORRE, E O QUE A CIFRA ABRE ----
    // A torre nasce aberta no mapa (G10). O esconderijo é que não se acha por
    // tropeço: o parágrafo da câmara dos sinos é prosa CONDICIONAL e só entra
    // com a gravação da tampa de dentro na mesa. Nesta rota ela já foi colhida
    // no corpo, pelo gesto — logo o parágrafo tem de estar de pé.
    await abrirNo(page, 'A Torre de S. Miguel');
    const torreTexto = await textoOverlay(page);
    checar('OS-R4: a torre recebe com o sineiro e conta os seis sinos', /seis cordas/.test(torreTexto));
    checar('OS-R4: com a cifra na mesa, a câmara dos sinos entra na prosa', /Meia-volta para a esquerda/.test(torreTexto));
    await varrerLocalAberto(page);
    checar(
      'OS-R4: o Livro II sai da câmara dos sinos',
      (await page.locator('.termo-extraido', { hasText: 'Caderno de Pesos' }).count()) === 1
    );
    checar(
      'OS-R4: o relato do sineiro sai da prosa base',
      (await page.locator('.termo-extraido', { hasText: 'Um Homem na Boca do Beco' }).count()) === 1
    );
    await fecharOverlay(page);
    // ---- fim do bloco da OS-R4 ----
    await visitarEExtrair(page, 'A Estalagem');
    // Onda 6: Walter conversa em diálogo embutido — o álibi nasce na fala; e
    // confrontá-lo com o registro (a própria assinatura das 19h40) desmorona a
    // álibi do carro das seis E anota a refutação do paradeiro no mural, sem barbante.
    await conversarEmbutido(page, 'Interrogar Walter Arthurs');
    checar('Onda 6: o botão da estalagem abre o diálogo de Walter', (await page.locator('[data-opcoes-dialogo]').count()) >= 1);
    await page.locator('[data-confrontos] [data-requer-carta="ev_registro_estalagem"]').click();
    await espera(page, 300);
    checar('Onda 6: o registro desmorona o álibi de Walter', (await page.locator('body').innerText()).includes('Não houve carro'));
    await page.locator('.opcao-dialogo--voltar').first().click();
    await espera(page, 200);
    // OS-R6 (D3): o SEGUNDO DEGRAU do confronto do testamento. A escada é
    // contador autoral (D8): com dois dos três papéis na mesa, o herdeiro
    // admite que soube da mudança e diz por que a omitiu. Rende prosa e
    // nenhuma carta — a cadeia física que o inocenta fica onde estava.
    checar(
      'OS-R6: a mesa autoriza o confronto do testamento',
      (await page.locator('[data-confrontos] [data-requer-carta="dep_testamento"]').count()) === 1
    );
    await page.locator('[data-confrontos] [data-requer-carta="dep_testamento"]').click();
    await espera(page, 300);
    const falaDoTestamento = await page.locator('body').innerText();
    checar('OS-R6: o primeiro degrau do testamento continua de pé', falaDoTestamento.includes('Herdeiro único'));
    checar('OS-R6 (D3): o segundo degrau cobra o que a mesa já tem, e Walter admite que soube', falaDoTestamento.includes('Sabia.'));
    await page.locator('.opcao-dialogo--voltar').first().click();
    await espera(page, 200);
    await fecharOverlay(page);
    // Segunda visita ao réu DEPOIS do registro da estalagem: agora a prova está
    // na mesa e a caixa de confronto abre a pergunta da estalagem; confrontá-la
    // rende a reação de Silas (observável, nunca confissão — o veredicto é do
    // mural) e ANOTA a refutação do paradeiro dele no mural (barbante removível).
    await abrirNo(page, 'A Saleta');
    // OS-R6: de volta ao réu DEPOIS da estalagem, o dossiê passou os dois
    // terços e o nível sobe. É a prova em tela de que a exposição é função
    // das cartas na mesa, e de mais nada: a mesma conversa, outro nível.
    checar(
      'OS-R6: colhida mais prova, a mesma conversa sobe a E2',
      (await page.locator('[data-exposicao="E2"]').count()) === 1
    );
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
    // Etapa 1 (mapa): o lembrete nomeia QUEM recebeu o perito — a estalagem,
    // visitada antes e agora não-atual, recorda Walter Arthurs.
    // OS-R2: a relojoaria fundida não tem anfitrião único (Davey recebe na
    // oficina, que virou sub-local), e o lembrete dela conta observações e
    // cala o nome — divergência registrada na ata.
    const mesaLembretes = await page.locator('body').innerText();
    checar('Etapa 1: o lembrete nomeia quem foi encontrado no local', mesaLembretes.includes('visitado · Walter Arthurs'));
    checar('OS-R2: o prédio sem anfitrião único conta as observações no lembrete', /visitado · \d+ observações/.test(mesaLembretes));
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
    // paradeiro do réu contestado, não só as horas.
    // OS-R8 §3.1: a string mudou de «paradeiro(s) desmentido(s)» para
    // «paradeiro(s) contestado(s)» — o vocabulário da estação inteira deixou
    // de concluir pelo jogador, e o contrato acompanha no mesmo commit.
    checar('Onda 2: Estação III conta o paradeiro contestado do réu', (await page.locator('body').innerText()).includes('paradeiro(s) contestado(s)'));
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

    let { texto, viuLacunas, reconstituicao, passosReconstituicao } = await julgar(page);
    checar('P0 §5: acusação completa sela sem passo extra', !viuLacunas);
    // OS-R7: a reconstituição corre ANTES do monólogo, e mostra só o que a
    // mesa desfaz. O Metódico colheu oito dos nove gestos da noite.
    checar('Rota 1: a reconstituição vem antes do monólogo', reconstituicao.includes('A Reconstituição'));
    checar('Rota 1: a cena situa-se no domingo, na relojoaria', /DOMINGO À NOITE, NA RELOJOARIA/i.test(reconstituicao));
    // Esta rota colhe a vila inteira: os nove gestos do catálogo caem, e a
    // cena roda por extenso. É o teto — nenhuma mesa desfaz mais do que isto.
    checar('Rota 1: a mesa completa desfaz os nove gestos da noite', passosReconstituicao === 9);
    checar('Rota 1: a cena refaz o mostrador posto num quarto para as nove', reconstituicao.includes('um quarto para as nove'));
    // O feixe da D16 dramatizado: a hora que passa de uma boca para a outra
    // antes de chegar ao papel, e a resposta que volta palavra por palavra.
    checar('Rota 1: a cena mostra a hora ensaiada antes de ser dita', reconstituicao.includes('volta palavra por palavra'));
    checar('Rota 1: a cena não nomeia autor de gesto nenhum', !/Silas Crane|Crane/.test(reconstituicao));
    checar('Rota 1: a cena sem id interno vazado', !/alibi_|ev_|dep_|comp_|corrob_/.test(reconstituicao));
    checar('Rota 1: desfecho Vitória Absoluta', texto.includes('Vitória Absoluta'));
    checar('Rota 1: monólogo sem id interno vazado', !/buril_gravador|vidro_mostrador|carta_suplica|assinatura_registro|cesta_ceia/.test(texto));
    checar('Rota 1: monólogo sem NaN/Infinity', !/NaN|Infinity/.test(texto));
    checar('Rota 1: monólogo narra o álibi do réu desmentido (Q4)', texto.includes('O registro desmente o paradeiro'));
    // OS-R7 §3.2: o desfecho contava a qualidade da cadeia e não contava a
    // noite. Agora conta — e mede, sem declarar fração, quanto dela a cadeia
    // alcançou.
    checar('Rota 1: o monólogo cita a noite que a cena refez', texto.includes('Refiz a noite quase gesto a gesto'));
    // Q5: o encerramento paga com epílogo + retrato da investigação.
    await page.getByRole('button', { name: 'Encerrar o caso' }).click();
    await espera(page, 700);
    const epilogo = await textoOverlay(page);
    checar('Rota 1: epílogo presente ao encerrar', epilogo.includes('Epílogo'));
    checar('Rota 1: retrato da investigação presente', /retrato da investiga/i.test(epilogo));
    // O encerramento paga a explicação da luz (a isca do padeiro refutada)
    // e o retrato nomeia o que ficou por abrir (o Gabinete, nesta rota — a
    // torre passou a ser visitada, desde a OS-R4).
    checar('Rota 1: epílogo paga a explicação da luz', epilogo.includes('lampião'));
    checar('Rota 1: retrato nomeia o que ficou por visitar', epilogo.includes('Ficou por visitar: Gabinete Pettigrew'));
    // O laço de playtest: o epílogo oferece "Novo caso" (sorteia outro caso da
    // comarca, sem voltar ao título) ao lado de "Fechar o caderno".
    checar('Rota 1: epílogo oferece "Novo caso"', (await page.getByRole('button', { name: 'Novo caso' }).count()) === 1);
    await page.getByRole('button', { name: 'Fechar o caderno' }).click();
    // Onda 1: fechar o caderno apaga o save — a página recarregada cai no
    // convite limpo, nunca no gate de retomada.
    await page.waitForSelector('text=O perito que atende ao chamado.', { timeout: 15000 });
    checar('Onda 1: fechar o caderno limpa o save (convite limpo)', (await page.getByRole('button', { name: 'Continuar o caso' }).count()) === 0);
    await espera(page, 400);

    // ============================================================
    // ROTA 2 — APRESSADO (Harlan): iscas primeiro, corpo tarde,
    // acusa a governanta. Esperado: Erro Judiciário.
    // ============================================================
    rotaAtual = '\n=== ROTA 2 — Apressado (Harlan) → Erro Judiciário ===';
    console.log('\n=== ROTA 2 — Apressado (Harlan) → Erro Judiciário ===');
    await novaPartida(page, 'Harlan Blackwell');

    // O Apressado entra no prédio e varre só a cena dos fundos — deixa o
    // corpo para depois, que é a armadilha da rota.
    await abrirNo(page, 'A Relojoaria');
    await varrerSubLocal(page, 'escritorio');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'O Posto do Guarda'); // o testamento desbloqueia o Gabinete
    await fecharOverlay(page);
    await page.click('text=Caderneta');
    await espera(page, 400);
    checar('Rota 2: diário anuncia o novo destino no mapa', (await page.locator('body').innerText()).includes('Novo destino no mapa'));
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Gabinete Pettigrew'); // a viagem-isca
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Estalagem');
    await fecharOverlay(page);
    await abrirNo(page, 'A Relojoaria');
    await varrerSubLocal(page, 'corpo'); // só agora, degradado
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
    ({ texto, viuLacunas, reconstituicao, passosReconstituicao } = await julgar(page));
    checar('P0 §5: acusação com lacunas exige "Selar assim mesmo"', viuLacunas);
    // G3/GR7-6: a cena é a mesma peça acuse-se quem se acusar. Esta rota
    // acusa o inocente, e a reconstituição continua sem nomear ninguém —
    // mostra o único gesto cujas cartas esta mesa tem (o assalto encenado).
    checar('Rota 2: a reconstituição corre também no erro judiciário', reconstituicao.includes('A Reconstituição'));
    checar('Rota 2: a cena mostra só os gestos que esta mesa desfaz', passosReconstituicao === 3);
    // G9 ao pé da letra: o que esta mesa não colheu não aparece. O buril e o
    // quarto da estalagem ficam de pé, e a cena não os insinua.
    checar('Rota 2: o gesto da oficina fica FORA da cena', !reconstituicao.includes('volta ao estojo'));
    checar('Rota 2: o gesto da estalagem fica FORA da cena', !reconstituicao.includes('quarto cinco'));
    checar('Rota 2: a cena não nomeia o acusado nem o culpado', !/Walter Arthurs|Silas Crane/.test(reconstituicao));
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
    ({ texto } = await julgar(page));
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
    rotaAtual = '\n=== ROTA 3 — Intuitivo (Harlan) → Impunidade ===';
    console.log('\n=== ROTA 3 — Intuitivo (Harlan) → Impunidade ===');
    await novaPartida(page, 'Harlan Blackwell');

    await interrogarEExtrair(page, 'A Saleta'); // §7.1: o interrogatório é diálogo
    await fecharOverlay(page);
    await visitarEExtrair(page, 'O Posto do Guarda'); // inclui o "visto com vida" (janela aberta)
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
    ({ texto, reconstituicao, passosReconstituicao } = await julgar(page));
    // OS-R7, martelo (c): sem carta para rebater, a cena roda CURTA e as
    // intervenções ficam de pé. O Intuitivo nunca colheu nada da noite —
    // e a cena não lhe entrega nada, que é o desenho e não um defeito.
    checar('Rota 3: a colheita magra dá cena magra (três gestos)', passosReconstituicao === 3);
    checar('Rota 3: a cena não refaz o mostrador que esta rota nunca leu', !/um quarto para as nove|nono entalhe/.test(reconstituicao));
    checar('Rota 3: a cena não refaz o assalto que esta rota nunca leu', !reconstituicao.includes('degrau do beco'));
    checar('Rota 3: o fecho declara a cena curta, sem dizer o que ficou de pé', reconstituicao.includes('ficou inteira no resto'));
    checar('Rota 3: desfecho Impunidade', texto.includes('Impunidade'));
    checar('Rota 3: o monólogo mede a noite pela colheita magra', texto.includes('não fui além deles'));

    // ============================================================
    // ROTA FLAT — a rota de escape 2D (?flat=1): sem WebGL/diorama,
    // a grade de localidades original precisa jogar igual.
    // ============================================================
    rotaAtual = '\n=== ROTA FLAT — grade 2D (?flat=1) ===';
    console.log('\n=== ROTA FLAT — grade 2D (?flat=1) ===');
    await novaPartida(page, 'Harlan Blackwell', '?flat=1');
    checar('Rota flat: sem canvas 3D', (await page.locator('canvas').count()) === 0);
    // E1: em ?flat=1 a prancha segue de pé (ela É o fallback) e o botão da
    // maquete fica desabilitado, com o motivo legível ao lado.
    checar('Rota flat: a prancha segue de pé', (await page.locator('[data-prancha]').count()) === 1);
    checar('Rota flat: "A maquete" fica desabilitada', await page.getByRole('button', { name: 'A maquete' }).isDisabled());
    checar('Rota flat: o motivo de não haver maquete é legível', (await page.locator('body').innerText()).includes('?flat=1 dispensa o 3D'));
    // §5.1: a planta é SVG 2D — funciona idêntico em ?flat=1. Abre o prédio,
    // confere a planta e anda para a cena dos fundos por ela (0h).
    await abrirNo(page, 'A Relojoaria');
    checar('Rota flat: a planta da relojoaria aparece (SVG 2D)', (await page.locator('[data-planta]').count()) >= 1);
    await andarNaPlanta(page, 'escritorio');
    checar('Rota flat: andar pela planta chega à cena', (await page.locator('body').innerText()).includes('A Cena — Escritório dos Fundos'));
    await varrerSubLocal(page, 'corpo');
    await page.getByRole('button', { name: 'Medir temperatura' }).click();
    await espera(page, 400);
    await arquivarFicha(page);
    checar('Rota flat: extração pela prosa funciona', (await page.locator('.termo-extraido').count()) >= 3);
    await fecharOverlay(page);
    await visitarEExtrair(page, 'O Posto do Guarda'); // viagem pela grade 2D (lead do Gabinete)
    await fecharOverlay(page);
    checar('Rota flat: Gabinete desbloqueado pela grade 2D', (await page.locator('body').innerText()).includes('Gabinete Pettigrew'));

    // ============================================================
    // ROTA GERADA — o caso PROCEDURAL jogável (FASE 6 do gerador):
    // carrega a réplica dirigida por ?caso=, atravessa a abertura
    // GERADA (6 passos, mesmo botão final), extrai pela prosa gerada,
    // mede a temperatura e abre o mural. Fumaça: a mecânica inteira
    // precisa jogar num pacote que nenhuma mão escreveu.
    // ============================================================
    rotaAtual = '\n=== ROTA GERADA — a réplica procedural (?caso=) ===';
    console.log('\n=== ROTA GERADA — a réplica procedural (?caso=) ===');
    await page.goto(BASE + `?caso=gerado_${SEED_REPLICA}`);
    // Esperar o seletor de modos MONTAR (em vez de um tempo fixo) — robusto
    // à latência de arranque, que varia com a carga da máquina.
    await page.waitForSelector('[data-modo]', { timeout: 15000 });
    checar('Rota gerada: os 4 modos aparecem na tela inicial', (await page.locator('[data-modo]').count()) === 4);
    checar(
      'Rota gerada: o modo réplica nasce selecionado pelo ?caso=',
      (await page.locator('[data-modo="replica"][aria-pressed="true"]').count()) === 1
    );
    await page.click('text=Harlan Blackwell');
    await espera(page, 600);
    for (let i = 0; i < 5; i++) {
      await page.locator('button, [role=button], a').filter({ hasText: '→' }).last().click();
      await espera(page, 200);
    }
    await page.click('text=Entrar — iniciar a investigação');
    await espera(page, 600);
    // OS da vila na mesa: o caso gerado traz a própria vila no pacote
    // (campo visual `maquete`). A prancha a estampa como no caso-escola —
    // mesmas posições, mesmas formas, nenhum campo novo (E1).
    await page.waitForSelector('[data-prancha]', { timeout: 15000 });
    checar('Rota gerada: a prancha da vila gerada monta ([data-prancha])', (await page.locator('[data-prancha]').count()) === 1);
    checar('Rota gerada: a vila gerada rende etiquetas de nó na prancha', (await page.locator('.rotulo-papel').count()) >= 1);
    checar(
      'Rota gerada: o ponto de encontro da vila está na mesa (A Taverna)',
      (await page.locator('body').innerText()).includes('A Taverna')
    );
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
    // E1 (OS Vila Viva): a planta gerada do prédio chega ao jogador (SVG 2D,
    // [data-planta]). Clicar um cômodo da planta abre o ponto do acordeão.
    checar('Rota gerada: a planta gerada aparece na cena (data-planta)', (await page.locator('[data-planta]').count()) >= 1);
    await page.locator('[data-planta] [data-alvo-comodo]').first().click();
    await espera(page, 250);
    checar('Rota gerada: clicar um cômodo da planta abre o ponto', (await page.locator('.ponto-corpo').count()) >= 1);
    await abrirPontos(page);
    // OS-R8 · Fase 4: esta checagem media `.ponto-corpo >= 1`, que a linha de
    // cima (clicar UM cômodo) já tinha estabelecido — abrir mais pontos não
    // pode baixar a conta, logo ela não podia falhar depois de a outra passar.
    // Passa a cobrar o que o seu rótulo promete: TODOS os pontos do acordeão
    // abriram, e cada um rendeu o seu corpo de prosa.
    const pontosDaCena = await page.locator('.ponto-interesse').count();
    checar(
      `Rota gerada: abrir os pontos revela a prosa dos ${pontosDaCena} cômodos`,
      pontosDaCena >= 1 && (await page.locator('.ponto-corpo').count()) === pontosDaCena
    );
    await extrairTermosVisiveis(page);
    await fecharOverlay(page);
    await visitarEExtrair(page, 'O Posto do Constable');
    // OS da vila na mesa: os interrogatórios saíram do posto — o constable
    // só guarda os papéis; ouvir os suspeitos é bater à porta de cada casa.
    checar(
      'Rota gerada: o posto do constable não interroga mais ninguém',
      (await page.locator('.botao-dialogo-local').count()) === 0
    );
    await fecharOverlay(page);
    // A casa partilhada (réplica: Cottage nº 4 abriga duas suspeitas):
    // quem partilha teto partilha nó — dois interrogatórios à mesma porta.
    // O beat de paradeiro sustenta a carta de álibi em qualquer tom, e a
    // conversa desce até se encerrar.
    await abrirNo(page, 'Cottage nº 4');
    checar(
      'Rota gerada: a casa partilhada oferece um interrogatório por moradora',
      (await page.locator('.botao-dialogo-local').count()) === 2
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
    // Esperar o gate de retomada MONTAR (em vez de um tempo fixo) — o botão
    // "Continuar o caso" surge quando o App reidrata o save.
    await page.getByRole('button', { name: 'Continuar o caso' }).waitFor({ timeout: 15000 });
    checar('Rota gerada: recarregar oferece a retomada', (await page.getByRole('button', { name: 'Continuar o caso' }).count()) === 1);
    await page.getByRole('button', { name: 'Continuar o caso' }).click();
    await espera(page, 600);
    // O rótulo do ponto de encontro (a taverna da vila gerada) só existe no
    // caso gerado — esperar o texto cobre a montagem assíncrona da maquete.
    await page.getByText('A Taverna').first().waitFor({ timeout: 15000 });
    checar(
      'Rota gerada: a retomada volta ao caso gerado (não ao caso-escola)',
      (await page.locator('body').innerText()).includes('A Taverna')
    );
    await page.evaluate(() => window.localStorage && window.localStorage.clear());

    // ============================================================
    // ROTA CELULAR — o estreito (390×844, E4 da OS Prancha da Vila): a
    // prancha é SÓ FIGURA e a navegação é a régua de fichas, com alvo de
    // toque ≥44px. A sessão de celular padrão também não baixa three.
    // ============================================================
    rotaAtual = '\n=== ROTA CELULAR — o estreito (390×844) ===';
    console.log('\n=== ROTA CELULAR — o estreito (390×844) ===');
    const ctxCelular = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const celular = await ctxCelular.newPage();
    celular.setDefaultTimeout(15000);
    celular.on('console', (m) => m.type() === 'error' && errosConsole.push(m.text()));
    celular.on('pageerror', (e) => errosConsole.push(String(e.message)));
    const chunks3DCelular = [];
    celular.on('request', (r) => {
      if (/DioramaVila|\bthree\b|three\.module|@react-three/.test(r.url())) chunks3DCelular.push(r.url());
    });
    await novaPartida(celular, 'Harlan Blackwell');
    await celular.waitForSelector('[data-regua-nos]', { timeout: 15000 });
    checar('E4: no estreito a navegação é a régua de fichas ([data-regua-nos])', (await celular.locator('[data-regua-nos]').count()) === 1);
    checar('E4: a prancha do estreito é só figura (nenhuma etiqueta no desenho)', (await celular.locator('.prancha-etiqueta').count()) === 0);
    checar('E4: a prancha continua de pé no estreito', (await celular.locator('[data-prancha]').count()) === 1);
    const alturasFicha = await celular.evaluate(() =>
      [...document.querySelectorAll('.regua-ficha')].map((el) => el.getBoundingClientRect().height)
    );
    checar('E4: a régua tem uma ficha por nó desbloqueado', alturasFicha.length >= 4);
    checar('E4: nenhum alvo de toque da régua abaixo de 44px', alturasFicha.every((h) => h >= 44));
    checar('E4: a ficha do nó atual traz "— aqui —"', (await celular.locator('.regua-ficha--aqui').first().innerText()).includes('— aqui —'));
    checar('E4: o alternador segue acessível no estreito', (await celular.getByRole('button', { name: 'A maquete' }).count()) === 1);
    // A ficha viaja pelo MESMO handler das outras vistas.
    await celular.locator('.regua-ficha', { hasText: 'O Posto do Guarda' }).click();
    await celular.waitForSelector('div.fixed[data-overlay]', { timeout: 15000 });
    await espera(celular, 300);
    checar('E4: tocar a ficha abre o local (mesmo handler de viagem)', (await celular.locator('body').innerText()).includes('14h00'));
    checar('E4: a sessão de celular padrão não baixa chunk de three', chunks3DCelular.length === 0);
    await celular.evaluate(() => window.localStorage && window.localStorage.clear());
    await ctxCelular.close();

    // ============================================================
    checar('Zero erros de console em todas as rotas', errosConsole.length === 0);
    if (errosConsole.length) console.error('Erros de console:', errosConsole);
  } catch (e) {
    // Falha dura (exceção de seletor/timeout): diz ONDE parou e tira um
    // retrato da tela — para um criador não-dev, "e.message" solto era o
    // pior modo de falha. O padrão scripts/_*.png já está no .gitignore.
    const retrato = 'scripts/_falha-qa-ui.png';
    console.error(`\nFALHA DURA na ${rotaAtual}`);
    console.error(`Última checagem concluída: ${checar.ultima || '(nenhuma)'}`);
    try {
      await page.screenshot({ path: retrato, fullPage: true });
      console.error(`Retrato da tela no momento da falha: ${retrato}`);
    } catch {
      // página já fechada — segue sem retrato
    }
    throw e;
  } finally {
    // O servidor morre SEMPRE, mesmo se fechar o navegador falhar — senão
    // um vite órfão segura a porta e a rodada seguinte já nasce falhando.
    try {
      await browser.close();
    } finally {
      matarServidor(servidor);
    }
  }

  const falhas = resultados.filter(([, ok]) => !ok);
  console.log(`\n${falhas.length === 0 ? 'UI VÁLIDA.' : `UI COM ${falhas.length} FALHA(S).`}`);
  process.exit(falhas.length === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('ERRO no QA de UI:', e.message);
  process.exit(1);
});
