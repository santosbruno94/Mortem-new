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
//   • o Mural da Acusação inteiro (5 estações, barbantes, revisão final),
//     SEM o gabarito do legista no topo (Q3);
//   • a personagem Lenore (interpolações de gênero);
//   • o desbloqueio de Moorford pelos dois leads, com anúncio no diário,
//     e o álibi do réu derrubado pelo registro do clube (Q4);
//   • a retentativa com preço (2h) e o mural reaberto na pendência (Q2/Q9);
//   • o Erro Judiciário sem nome do culpado até o epílogo, e o epílogo com
//     o retrato da investigação (Q2/Q5);
//   • REGRESSÕES: id interno vazando no monólogo ("la_cinzenta") e
//     "NaN/Infinity" na leitura do legista com janela aberta (Caderneta);
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

async function novaPartida(page, perito, query = '') {
  await page.goto(BASE + query);
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

async function julgar(page) {
  await page.getByRole('button', { name: 'Levar a julgamento' }).click();
  await espera(page, 400);
  await page.getByRole('button', { name: 'Confirmar e julgar' }).click();
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
    checar('Rota 1: retrato do interrogado presente', (await page.locator('svg[data-retrato]').count()) >= 1);
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Sra. Hudson');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Thomas Blackwood');
    await fecharOverlay(page);
    await visitarEExtrair(page, 'Clube de Moorford');
    await fecharOverlay(page);

    await page.click('text=CONSTRUIR A ACUSAÇÃO');
    await espera(page, 500);
    // Q3: o mural não traz mais o gabarito do legista pendurado.
    checar('Rota 1: mural sem o lembrete do legista', !(await page.locator('body').innerText()).includes('LEMBRETE DO LEGISTA'));
    await definirJanela(page, 'dia 13 · 20h', 'dia 13 · 23h');
    await page.getByRole('button', { name: 'Estrangulamento por ligadura', exact: true }).click();
    await concluirParte(page);
    await page.getByRole('button', { name: 'Edgar Arthurs', exact: true }).click();
    await espera(page, 200);
    await page.getByRole('button', { name: /Fibras Claras no Punho do Casaco/ }).click();
    await espera(page, 200);
    await page.locator('text=PRESENÇA — O RÉU NA CENA').click();
    await espera(page, 250);
    await concluirParte(page);
    // Mentiras: rigor e livores derrubam a vizinha E o relógio forjado (Q1);
    // o registro de Moorford derruba o paradeiro do réu (Q4).
    for (const alvo of [/Vizinha Jura/, /Relógio de Lareira Esmagado/]) {
      for (const fato of [/Corpo Endurecido/, /Manchas Arroxeadas/]) {
        await page.getByRole('button', { name: fato }).last().click();
        await espera(page, 200);
        await page.getByRole('button', { name: alvo }).last().click();
        await espera(page, 250);
      }
    }
    await page.getByRole('button', { name: /Edgar Saiu do Clube/ }).last().click();
    await espera(page, 200);
    await page.getByRole('button', { name: /Jantar no Clube Comercial/ }).last().click();
    await espera(page, 250);
    await concluirParte(page);
    await page.getByRole('button', { name: 'Herdeiro Único: Edgar Arthurs' }).click();
    await concluirParte(page);
    // Juízos: Hudson inocente com a mentira exposta; Blackwood inocente.
    checar('Rota 1: retratos nos Juízos do mural', (await page.locator('svg[data-retrato]').count()) >= 2);
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
    checar('Rota 1: monólogo narra o álibi do réu desmentido (Q4)', texto.includes('O registro desmente o paradeiro'));
    // Q5: o encerramento paga com epílogo + retrato da investigação.
    await page.getByRole('button', { name: 'Encerrar o caso' }).click();
    await espera(page, 700);
    const epilogo = await textoOverlay(page);
    checar('Rota 1: epílogo presente ao encerrar', epilogo.includes('Epílogo'));
    checar('Rota 1: retrato da investigação presente', /retrato da investiga/i.test(epilogo));
    await page.getByRole('button', { name: 'Fechar o caderno' }).click();
    await espera(page, 800);

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
    await definirJanela(page, 'dia 13 · 18h', 'dia 14 · 08h'); // larga
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
    checar('Rota 2: sem id interno vazado', !texto.includes('la_cinzenta'));
    // Q2: com a retentativa de pé, o culpado NÃO é nomeado no monólogo.
    checar('Rota 2: erro não nomeia o culpado antes do encerramento', !texto.includes('Edgar Arthurs'));
    // Q2: revisar custa horas — o relógio anda 2h (16h00 → 18h00).
    await page.getByRole('button', { name: /Revisar a acusação/ }).click();
    await espera(page, 700);
    checar('Rota 2: a retentativa adia a audiência (relógio a 18h00)', (await page.locator('body').innerText()).includes('18h00'));
    // Q9: o mural reaberto não volta à Estação I — abre na primeira pendência.
    const muralReaberto = await page.locator('body').innerText();
    checar('Rota 2: mural reaberto na pendência (móbil), não na Estação I', muralReaberto.includes('IV · O Móbil') && !muralReaberto.includes('QUANDO — A JANELA'));
    texto = await julgar(page);
    // Q5/Q2: o encerramento definitivo revela o culpado no epílogo.
    await page.getByRole('button', { name: 'Encerrar o caso' }).click();
    await espera(page, 700);
    const epilogoErro = await textoOverlay(page);
    checar('Rota 2: epílogo do erro revela o verdadeiro autor', epilogoErro.includes('Edgar Arthurs'));
    await page.getByRole('button', { name: 'Fechar o caderno' }).click();
    await espera(page, 800);

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
    // ROTA FLAT — a rota de escape 2D (?flat=1): sem WebGL/diorama,
    // a grade de localidades original precisa jogar igual.
    // ============================================================
    console.log('\n=== ROTA FLAT — grade 2D (?flat=1) ===');
    await novaPartida(page, 'Dr. Harlan Blackwell', '?flat=1');
    checar('Rota flat: sem canvas 3D', (await page.locator('canvas').count()) === 0);
    await visitarEExtrair(page, 'O Corpo');
    await page.getByRole('button', { name: 'Medir temperatura' }).click();
    await espera(page, 400);
    checar('Rota flat: extração pela prosa funciona', (await page.locator('.termo-extraido').count()) >= 3);
    await fecharOverlay(page);
    await visitarEExtrair(page, 'A Delegacia'); // viagem pela grade 2D (lead de Moorford)
    await fecharOverlay(page);
    checar('Rota flat: Moorford desbloqueado pela grade 2D', (await page.locator('body').innerText()).includes('Clube de Moorford'));

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
