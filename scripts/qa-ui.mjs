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
// O que cobre (ângulos mortos do QA estático, apontados no playtest de
// 11/07/2026 — docs/playtest-2026-07-11.md):
//   • extração por clique nos termos em negrito das localidades;
//   • o Mural da Acusação inteiro (5 estações, barbantes, revisão final);
//   • a personagem Lenore (interpolações de gênero);
//   • o desbloqueio de Moorford pelos dois leads, com anúncio no diário;
//   • REGRESSÕES: id interno vazando no monólogo ("la_cinzenta") e
//     "NaN/Infinity" no lembrete do legista com janela aberta;
//   • zero erros de console em todas as rotas.
// =====================================================================

import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

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

async function novaPartida(page, perito) {
  await page.goto(BASE);
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

// Viaja até um nó da mesa e extrai todos os termos em negrito do overlay.
async function visitarEExtrair(page, rotuloNo) {
  await page.click(`text=${rotuloNo}`);
  await espera(page, 500);
  const termos = page.locator('.termo-clicavel');
  for (let i = 0; i < 20 && (await termos.count()) > 0; i++) {
    await termos.first().click();
    await espera(page, 150);
  }
}

async function fecharOverlay(page) {
  await page.click('text=fechar ✕');
  await espera(page, 250);
}

async function definirJanela(page, iniDia, iniHora, fimDia, fimHora) {
  await page.locator('select').nth(0).selectOption({ label: iniDia });
  await page.locator('select').nth(1).selectOption({ label: iniHora });
  await page.locator('select').nth(2).selectOption({ label: fimDia });
  await page.locator('select').nth(3).selectOption({ label: fimHora });
  await espera(page, 200);
}

const concluirParte = async (page) => {
  await page.getByRole('button', { name: 'Concluir esta parte →' }).click();
  await espera(page, 350);
};

async function julgar(page) {
  await page.getByRole('button', { name: 'Levar a julgamento' }).click();
  await espera(page, 400);
  await page.getByRole('button', { name: 'Confirmar e julgar' }).click();
  await espera(page, 900);
  return page.locator('body').innerText();
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

    await visitarEExtrair(page, 'O Corpo');
    await page.getByRole('button', { name: 'Medir temperatura' }).click();
    await espera(page, 400);
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Cena do Crime');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Delegacia'); // desbloqueia Moorford (lead das dívidas)
    await fecharOverlay(page);
    checar('Rota 1: Moorford desbloqueado e destacado como novo', (await page.locator('body').innerText()).includes('· novo'));
    await visitarEExtrair(page, 'Edgar Arthurs');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Sra. Hudson');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Thomas Blackwood');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Clube de Moorford');
    await fecharOverlay(page);

    await page.click('text=CONSTRUIR A ACUSAÇÃO');
    await espera(page, 500);
    await definirJanela(page, 'dia 13', '20h', 'dia 13', '23h');
    await page.getByRole('button', { name: 'Estrangulamento por ligadura', exact: true }).click();
    await concluirParte(page);
    await page.getByRole('button', { name: 'Edgar Arthurs', exact: true }).click();
    await espera(page, 200);
    await page.getByRole('button', { name: /Fibras Claras no Punho do Casaco/ }).click();
    await espera(page, 200);
    await page.locator('text=PRESENÇA — O RÉU NA CENA').click();
    await espera(page, 250);
    await concluirParte(page);
    // Mentiras: rigor e livores derrubam o avistamento da vizinha.
    for (const fato of [/Corpo Endurecido/, /Manchas Arroxeadas/]) {
      await page.getByRole('button', { name: fato }).last().click();
      await espera(page, 200);
      await page.getByRole('button', { name: /Vizinha Jura/ }).last().click();
      await espera(page, 250);
    }
    await concluirParte(page);
    await page.getByRole('button', { name: 'Herdeiro Único: Edgar Arthurs' }).click();
    await concluirParte(page);
    // Juízos: Hudson inocente com a mentira exposta; Blackwood inocente.
    await page.getByRole('button', { name: 'Inocente', exact: true }).first().click();
    await espera(page, 300);
    await page.getByRole('button', { name: /Xale de Lã Cinzenta/ }).last().click();
    await espera(page, 200);
    await page.getByRole('button', { name: 'Inocente', exact: true }).nth(1).click();
    await espera(page, 200);

    let texto = await julgar(page);
    checar('Rota 1: desfecho Vitória Absoluta', texto.includes('Vitória Absoluta'));
    checar('Rota 1: monólogo sem id interno vazado', !/la_cinzenta|fibra_canhamo/.test(texto));
    checar('Rota 1: monólogo sem NaN/Infinity', !/NaN|Infinity/.test(texto));
    await page.getByRole('button', { name: 'Encerrar o caso' }).click();
    await espera(page, 600);

    // ============================================================
    // ROTA 2 — APRESSADO (Lenore): iscas primeiro, corpo tarde,
    // acusa a governanta. Esperado: Erro Judiciário.
    // ============================================================
    console.log('\n=== ROTA 2 — Apressado (Lenore) → Erro Judiciário ===');
    await novaPartida(page, 'Lenore Blackwell');

    await visitarEExtrair(page, 'A Cena do Crime');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Edgar Arthurs'); // desbloqueia Moorford (lead do álibi)
    await fecharOverlay(page);
    await page.click('text=Caderneta');
    await espera(page, 400);
    checar('Rota 2: diário anuncia o novo destino no mapa', (await page.locator('body').innerText()).includes('Novo destino no mapa'));
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Clube de Moorford'); // a viagem-isca
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Sra. Hudson');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Thomas Blackwood');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'O Corpo'); // só agora, degradado
    checar('Rota 2: interpolação de gênero (a perita)', (await page.locator('body').innerText()).includes('perita'));
    await page.getByRole('button', { name: 'Medir temperatura' }).click();
    await espera(page, 400);
    await fecharOverlay(page);

    await page.click('text=CONSTRUIR A ACUSAÇÃO');
    await espera(page, 500);
    await definirJanela(page, 'dia 13', '18h', 'dia 14', '08h'); // larga
    await page.getByRole('button', { name: 'Estrangulamento por ligadura', exact: true }).click();
    await concluirParte(page);
    await page.getByRole('button', { name: 'Sra. Mabel Hudson', exact: true }).click();
    await espera(page, 200);
    await page.getByRole('button', { name: /Fio de Lã Cinzenta na Gaveta/ }).click();
    await espera(page, 200);
    await page.locator('text=PRESENÇA — O RÉU NA CENA').click();
    await espera(page, 250);
    // "Mentiu, logo matou": sem mentiras confrontadas, sem móbil, sem juízos.
    texto = await julgar(page);
    checar('Rota 2: desfecho Erro Judiciário', texto.includes('Erro Judiciário'));
    checar('Rota 2: instrumento com rótulo legível (lã cinzenta)', texto.includes('lã cinzenta') && !texto.includes('la_cinzenta'));
    await page.getByRole('button', { name: 'Encerrar o caso' }).click();
    await espera(page, 600);

    // ============================================================
    // ROTA 3 — INTUITIVO (Harlan): nunca examina o corpo, acusa
    // Edgar por faro. Esperado: Impunidade.
    // ============================================================
    console.log('\n=== ROTA 3 — Intuitivo (Harlan) → Impunidade ===');
    await novaPartida(page, 'Dr. Harlan Blackwell');

    await visitarEExtrair(page, 'Edgar Arthurs');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Delegacia'); // inclui o "visto com vida" (janela aberta)
    await fecharOverlay(page);

    await page.click('text=CONSTRUIR A ACUSAÇÃO');
    await espera(page, 500);
    // REGRESSÃO: com só a âncora "visto com vida", o lembrete precisa
    // formatar a janela aberta ("depois de..."), nunca NaN/Infinity.
    const lembrete = await page.locator('body').innerText();
    checar('Rota 3: lembrete sem NaN/Infinity com janela aberta', !/NaN|Infinity/.test(lembrete));
    checar('Rota 3: lembrete formata janela aberta ("depois de")', lembrete.includes('depois de'));

    await definirJanela(page, 'dia 13', '20h', 'dia 14', '08h'); // larga
    await page.getByRole('button', { name: 'Enforcamento', exact: true }).click(); // chute
    await concluirParte(page);
    await page.getByRole('button', { name: 'Edgar Arthurs', exact: true }).click();
    await espera(page, 200);
    await concluirParte(page); // sem vestígio
    await concluirParte(page); // sem mentiras
    await page.getByRole('button', { name: 'Herdeiro Único: Edgar Arthurs' }).click();
    await concluirParte(page);
    await page.getByRole('button', { name: 'Sem juízo', exact: true }).first().click();
    await espera(page, 150);
    await page.getByRole('button', { name: 'Sem juízo', exact: true }).nth(1).click();
    await espera(page, 150);
    texto = await julgar(page);
    checar('Rota 3: desfecho Impunidade', texto.includes('Impunidade'));

    // ============================================================
    checar('Zero erros de console nas três rotas', errosConsole.length === 0);
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
