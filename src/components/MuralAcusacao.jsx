import { useState, useEffect, useRef } from 'react';
import { useJogo } from '../store/jogo.js';
import { SUSPEITOS } from '../data/seed.js';
import { CATALOGO_CAUSAS } from '../data/catalogo_causas.js';
import { ANCORAS, analisarLigacoes } from '../logic/acusacao.js';
import { formatJanela } from '../logic/tempo.js';
import { lerCorpo, falaDoMestre } from '../logic/falaDoMestre.js';

// =====================================================================
// A MESA DE CONSTRUÇÃO — o mural com barbante (substitui o Libelo).
//
// O jogador AFIRMA a cadeia (réu, janela, causa, motivo, juízos) nas
// âncoras e a SUSTENTA puxando BARBANTES das cartas até onde elas se
// encaixam:
//   • carta temporal → âncora "Quando"   (sustenta a janela)
//   • carta causal    → âncora "Como"      (sustenta a causa)
//   • vestígio        → âncora "Presença"  (põe o réu na cena)
//   • fato → depoimento (refutação: a mentira/encenação exposta)
// O significado de cada barbante é DERIVADO das tags (src/logic/acusacao.js).
// Nada valida até "Levar a julgamento": só o desfecho julga.
// =====================================================================

// Conversão entre o relógio humano (dia 13/14 + hora) e a escala absoluta
// (horas desde a meia-noite de 14/out; negativas = 13/out).
function paraAbsoluto(dia, hora) {
  return (Number(dia) - 14) * 24 + Number(hora);
}
function deAbsoluto(abs) {
  return { dia: 14 + Math.floor(abs / 24), hora: ((abs % 24) + 24) % 24 };
}

// Posições FIXAS das âncoras na superfície (as cartas é que se arrastam).
const BOXES = {
  box_reu: { x: 24, y: 20 },
  [ANCORAS.quando]: { x: 24, y: 196 },
  [ANCORAS.como]: { x: 24, y: 438 },
  box_motivo: { x: 24, y: 700 },
  [ANCORAS.presenca]: { x: 300, y: 20 },
};
SUSPEITOS.forEach((sp, i) => {
  BOXES[`box_juizo_${sp.id}`] = { x: 300, y: 170 + i * 156 };
});

const PINO = 14; // deslocamento do ponto de amarração (canto superior-esquerdo)
function posPadraoCarta(i) {
  return { x: 580 + (i % 4) * 186, y: 20 + Math.floor(i / 4) * 118 };
}

export default function MuralAcusacao() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const acusacao = useJogo((s) => s.acusacao);
  const definirReu = useJogo((s) => s.definirReu);
  const definirJanela = useJogo((s) => s.definirJanela);
  const definirCausa = useJogo((s) => s.definirCausa);
  const definirMotivacao = useJogo((s) => s.definirMotivacao);
  const definirJuizo = useJogo((s) => s.definirJuizo);
  const adicionarLigacao = useJogo((s) => s.adicionarLigacao);
  const removerLigacao = useJogo((s) => s.removerLigacao);
  const submeterAcusacao = useJogo((s) => s.submeterAcusacao);
  const fecharOverlay = useJogo((s) => s.fecharOverlay);

  const canvasRef = useRef(null);
  const [posCartas, setPosCartas] = useState(() => {
    const p = {};
    cartasRegistradas.forEach((c, i) => (p[c.id] = posPadraoCarta(i)));
    return p;
  });
  const [conexaoDe, setConexaoDe] = useState(null);
  const [ghost, setGhost] = useState(null);

  // Garante posição para cartas que apareçam depois (caso o mural seja
  // reaberto com novas cartas extraídas no intervalo).
  useEffect(() => {
    setPosCartas((atual) => {
      const p = { ...atual };
      let n = Object.keys(atual).length;
      for (const c of cartasRegistradas) if (!p[c.id]) p[c.id] = posPadraoCarta(n++);
      return p;
    });
  }, [cartasRegistradas]);

  // Puxar o barbante: escuta o ponteiro na janela enquanto a conexão está ativa.
  useEffect(() => {
    if (!conexaoDe) return;
    function mover(e) {
      const r = canvasRef.current.getBoundingClientRect();
      setGhost({ x: e.clientX - r.left, y: e.clientY - r.top });
    }
    function soltar(e) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const noEl = el && el.closest('[data-no]');
      const para = noEl ? noEl.getAttribute('data-no') : null;
      if (para && para !== conexaoDe) adicionarLigacao(conexaoDe, para);
      setConexaoDe(null);
      setGhost(null);
    }
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
    return () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
    };
  }, [conexaoDe, adicionarLigacao]);

  function iniciarConexao(e, id) {
    e.stopPropagation();
    e.preventDefault();
    const r = canvasRef.current.getBoundingClientRect();
    setGhost({ x: e.clientX - r.left, y: e.clientY - r.top });
    setConexaoDe(id);
  }

  function moverCartaLocal(id, x, y) {
    setPosCartas((p) => ({ ...p, [id]: { x: Math.max(0, x), y: Math.max(0, y) } }));
  }

  function centro(id) {
    const p = posCartas[id] || BOXES[id];
    if (!p) return null;
    return { x: p.x + PINO, y: p.y + PINO };
  }

  // Estado da cadeia (apenas COMPLETUDE neutra — nunca acerto/erro).
  const { sustentaQuando, sustentaComo, sustentaPresenca, refutaHora, refutaAlibi } = analisarLigacoes(
    acusacao,
    cartasRegistradas
  );
  const naoAcusados = SUSPEITOS.filter((sp) => sp.id !== acusacao.reuId);
  const lacunas = [];
  if (!acusacao.reuId) lacunas.push('Aponte o réu.');
  if (acusacao.janela.inicio == null || acusacao.janela.fim == null)
    lacunas.push('Afirme a janela da morte (início e fim).');
  if (sustentaQuando.length === 0) lacunas.push('Nenhuma carta sustenta a hora.');
  if (!acusacao.causaId) lacunas.push('Afirme a causa da morte.');
  if (sustentaComo.length === 0) lacunas.push('Nenhum sinal sustenta a causa.');
  if (sustentaPresenca.length === 0) lacunas.push('Nada põe o réu na cena.');
  if (refutaHora.size === 0 && refutaAlibi.size === 0) lacunas.push('Nenhuma mentira foi confrontada.');
  if (!acusacao.motivacaoId) lacunas.push('O móbil não foi apontado.');
  if (naoAcusados.some((sp) => !acusacao.juizos[sp.id])) lacunas.push('Há suspeitos sem juízo.');

  const dica = falaDoMestre(lerCorpo(cartasRegistradas));
  const podeSubmeter = !!acusacao.reuId;

  const cartasMotivo = cartasRegistradas.filter(
    (c) =>
      c.tagsOcultas.dominio === 'comportamental' &&
      c.tagsOcultas.subDominio === 'motivo' &&
      (!acusacao.reuId || c.tagsOcultas.ligadoA === acusacao.reuId)
  );

  return (
    <div className="fixed inset-0 z-40 bg-stone-950 flex flex-col">
      {/* Cabeçalho */}
      <div className="shrink-0 flex items-start justify-between gap-4 px-6 py-3 border-b border-amber-900/40 bg-stone-900">
        <div>
          <h2 className="font-serif text-xl text-amber-200">A Construção da Acusação</h2>
          <p className="text-stone-500 text-xs mt-0.5">
            Afirme nas âncoras; puxe um barbante (o ponto âmbar de cada carta) até onde ela se encaixa. Construir não custa tempo.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={submeterAcusacao}
            disabled={!podeSubmeter}
            className="px-5 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Levar a julgamento
          </button>
          <button onClick={fecharOverlay} className="text-stone-500 hover:text-amber-200 text-sm tracking-widest">
            fechar ✕
          </button>
        </div>
      </div>

      {/* Faixa de apoio: lembrete do legista (dica) + o que ainda falta */}
      <div className="shrink-0 flex flex-wrap items-start gap-x-8 gap-y-1 px-6 py-2 border-b border-stone-800 bg-stone-900/60 text-xs">
        <div className="max-w-xl">
          <span className="text-amber-200/70 tracking-[0.2em] uppercase mr-2">Lembrete do legista</span>
          <span className="text-stone-400 italic">
            {dica.tempo || dica.causa
              ? [dica.tempo, dica.causa].filter(Boolean).join(' ')
              : 'Examine o corpo para ouvir a leitura.'}
          </span>
        </div>
        {lacunas.length > 0 && (
          <div className="text-stone-500">
            <span className="tracking-[0.2em] uppercase mr-2">Ainda falta</span>
            {lacunas.join(' · ')}
          </div>
        )}
      </div>

      {/* A superfície (rolável) */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-stone-950 via-stone-900/40 to-stone-950">
        <div ref={canvasRef} className="relative" style={{ width: 1360, height: 920 }}>
          {/* Camada dos barbantes (não intercepta o ponteiro; as linhas, sim) */}
          <svg className="absolute inset-0" width={1360} height={920} style={{ pointerEvents: 'none' }}>
            {acusacao.ligacoes.map((l) => {
              const a = centro(l.de);
              const b = centro(l.para);
              if (!a || !b) return null;
              return (
                <g key={l.id}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="transparent"
                    strokeWidth={14}
                    style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                    onClick={() => removerLigacao(l.id)}
                  />
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b45309" strokeWidth={2} />
                </g>
              );
            })}
            {conexaoDe &&
              ghost &&
              (() => {
                const a = centro(conexaoDe);
                if (!a) return null;
                return (
                  <line x1={a.x} y1={a.y} x2={ghost.x} y2={ghost.y} stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
                );
              })()}
          </svg>

          {/* ---------------- Âncoras (afirmações) ---------------- */}
          <Box pos={BOXES.box_reu} titulo="Quem — o réu">
            <div className="flex flex-col gap-1">
              {SUSPEITOS.map((sp) => (
                <Opcao key={sp.id} ativa={acusacao.reuId === sp.id} aoClicar={() => definirReu(sp.id)} rotulo={sp.nome} />
              ))}
            </div>
          </Box>

          <Box pos={BOXES[ANCORAS.quando]} dataNo={ANCORAS.quando} titulo="Quando — a janela" alvo>
            <SeletorJanela acusacao={acusacao} definirJanela={definirJanela} />
            {acusacao.janela.inicio != null && acusacao.janela.fim != null && (
              <p className="text-amber-200/80 text-xs mt-2">{formatJanela(acusacao.janela)}</p>
            )}
            <p className="text-stone-600 text-[10px] mt-2">Puxe os indicadores (rigor, livor, algor, visto-vivo) para cá.</p>
          </Box>

          <Box pos={BOXES[ANCORAS.como]} dataNo={ANCORAS.como} titulo="Como — a causa" alvo>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
              {CATALOGO_CAUSAS.map((c) => (
                <Opcao key={c.id} ativa={acusacao.causaId === c.id} aoClicar={() => definirCausa(c.id)} rotulo={c.nome} />
              ))}
            </div>
            <p className="text-stone-600 text-[10px] mt-2">Puxe os sinais do corpo para cá.</p>
          </Box>

          <Box pos={BOXES[ANCORAS.presenca]} dataNo={ANCORAS.presenca} titulo="Presença — o réu na cena" alvo>
            <p className="text-stone-500 text-xs">Puxe para cá o vestígio cujo material liga o réu à arma do óbito.</p>
            {sustentaPresenca.length > 0 && (
              <p className="text-amber-200/70 text-[10px] mt-2">{sustentaPresenca.length} vestígio(s) ligado(s).</p>
            )}
          </Box>

          <Box pos={BOXES.box_motivo} titulo="Motivo">
            {!acusacao.reuId ? (
              <p className="text-stone-600 text-xs">Aponte primeiro o réu.</p>
            ) : cartasMotivo.length === 0 ? (
              <p className="text-stone-600 text-xs">Nenhuma carta de móbil ligada ao réu.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {cartasMotivo.map((c) => (
                  <Opcao
                    key={c.id}
                    ativa={acusacao.motivacaoId === c.id}
                    aoClicar={() => definirMotivacao(c.id)}
                    rotulo={c.termoCarimbo}
                  />
                ))}
              </div>
            )}
          </Box>

          {naoAcusados.map((sp) => (
            <Box key={sp.id} pos={BOXES[`box_juizo_${sp.id}`]} titulo={`Juízo — ${sp.nome}`}>
              <div className="flex flex-col gap-1">
                {[
                  ['culpado', 'Culpado também'],
                  ['inocente', 'Inocente'],
                  ['sem_juizo', 'Sem juízo'],
                ].map(([val, rot]) => (
                  <Opcao
                    key={val}
                    ativa={acusacao.juizos[sp.id] === val}
                    aoClicar={() => definirJuizo(sp.id, val)}
                    rotulo={rot}
                  />
                ))}
              </div>
            </Box>
          ))}

          {/* ---------------- Cartas (arrastáveis, com pino de barbante) ---------------- */}
          {cartasRegistradas.map((carta) => (
            <CartaNoMural
              key={carta.id}
              carta={carta}
              pos={posCartas[carta.id] || { x: 580, y: 20 }}
              mover={moverCartaLocal}
              aoIniciarConexao={iniciarConexao}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Âncora fixa (não se arrasta; suas opções recebem clique normalmente).
// `alvo` marca-a como destino de barbante (data-no).
// ---------------------------------------------------------------------
function Box({ pos, titulo, children, dataNo, alvo }) {
  return (
    <div
      data-no={dataNo}
      className={`absolute w-60 rounded-sm px-3 py-2 bg-stone-900 ${
        alvo ? 'border-2 border-amber-800/70' : 'border border-stone-700'
      }`}
      style={{ left: pos.x, top: pos.y }}
    >
      <p className="text-amber-200/80 text-[10px] tracking-[0.2em] uppercase mb-2">{titulo}</p>
      {children}
    </div>
  );
}

function SeletorJanela({ acusacao, definirJanela }) {
  const ini = acusacao.janela.inicio != null ? deAbsoluto(acusacao.janela.inicio) : null;
  const fim = acusacao.janela.fim != null ? deAbsoluto(acusacao.janela.fim) : null;
  const [iniDia, setIniDia] = useState(ini ? String(ini.dia) : '13');
  const [iniHora, setIniHora] = useState(ini ? String(ini.hora) : '');
  const [fimDia, setFimDia] = useState(fim ? String(fim.dia) : '14');
  const [fimHora, setFimHora] = useState(fim ? String(fim.hora) : '');

  function aplicar(bound, dia, hora) {
    if (hora === '') return;
    definirJanela({ [bound]: paraAbsoluto(dia, hora) });
  }

  return (
    <div className="space-y-1">
      <LinhaHora
        rotulo="Início"
        dia={iniDia}
        hora={iniHora}
        setDia={(d) => {
          setIniDia(d);
          aplicar('inicio', d, iniHora);
        }}
        setHora={(h) => {
          setIniHora(h);
          aplicar('inicio', iniDia, h);
        }}
      />
      <LinhaHora
        rotulo="Fim"
        dia={fimDia}
        hora={fimHora}
        setDia={(d) => {
          setFimDia(d);
          aplicar('fim', d, fimHora);
        }}
        setHora={(h) => {
          setFimHora(h);
          aplicar('fim', fimDia, h);
        }}
      />
    </div>
  );
}

function LinhaHora({ rotulo, dia, hora, setDia, setHora }) {
  const classe = 'bg-stone-950 border border-stone-700 rounded-sm text-stone-300 text-xs px-1 py-1';
  return (
    <div className="flex items-center gap-1">
      <span className="text-stone-500 text-[10px] w-10">{rotulo}</span>
      <select className={classe} value={dia} onChange={(e) => setDia(e.target.value)}>
        <option value="13">dia 13</option>
        <option value="14">dia 14</option>
      </select>
      <select className={classe} value={hora} onChange={(e) => setHora(e.target.value)}>
        <option value="">—h</option>
        {Array.from({ length: 24 }, (_, h) => (
          <option key={h} value={h}>
            {String(h).padStart(2, '0')}h
          </option>
        ))}
      </select>
    </div>
  );
}

function Opcao({ ativa, aoClicar, rotulo }) {
  return (
    <button
      onClick={aoClicar}
      className={`px-2 py-1 rounded-sm border text-xs text-left ${
        ativa ? 'border-amber-700 bg-stone-950 text-amber-200' : 'border-stone-800 text-stone-400 hover:text-stone-200'
      }`}
    >
      {rotulo}
    </button>
  );
}

// ---------------------------------------------------------------------
// Carta arrastável na superfície, com o PINO de barbante no canto.
// Arrastar o corpo move; pressionar o pino puxa um barbante.
// ---------------------------------------------------------------------
const LIMIAR = 6;
function CartaNoMural({ carta, pos, mover, aoIniciarConexao }) {
  const estado = useRef(null);

  function down(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    estado.current = { x0: e.clientX, y0: e.clientY, ox: pos.x, oy: pos.y, moveu: false };
  }
  function move(e) {
    const a = estado.current;
    if (!a) return;
    const dx = e.clientX - a.x0;
    const dy = e.clientY - a.y0;
    if (Math.abs(dx) > LIMIAR || Math.abs(dy) > LIMIAR) a.moveu = true;
    if (a.moveu) mover(carta.id, a.ox + dx, a.oy + dy);
  }
  function up() {
    estado.current = null;
  }

  return (
    <div
      data-no={carta.id}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      className="absolute w-44 select-none touch-none cursor-grab active:cursor-grabbing active:z-30"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="bg-stone-900 border border-stone-700 rounded-sm px-3 py-2 hover:border-stone-500" title={carta.descricao}>
        <p className="font-serif text-stone-200 text-xs leading-snug pl-3">{carta.textoDisplay}</p>
      </div>
      {/* O pino: pressionar aqui puxa o barbante */}
      <span
        onPointerDown={(e) => aoIniciarConexao(e, carta.id)}
        title="Puxar um barbante até onde esta carta se encaixa"
        className="absolute -left-1 -top-1 w-4 h-4 rounded-full bg-amber-500 border border-amber-200 cursor-crosshair hover:bg-amber-300"
      />
    </div>
  );
}
