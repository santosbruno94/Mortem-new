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
// âncoras e a SUSTENTA amarrando BARBANTES das cartas até onde elas se
// encaixam:
//   • carta temporal → âncora "Quando"   (sustenta a janela)
//   • carta causal    → âncora "Como"      (sustenta a causa)
//   • vestígio        → âncora "Presença"  (põe o réu na cena)
//   • fato → depoimento (refutação: a mentira/encenação exposta)
// O significado de cada barbante é DERIVADO das tags (src/logic/acusacao.js).
// Nada valida até "Levar a julgamento": só o desfecho julga.
//
// A ligação é por CLIQUE → CLIQUE: clica-se numa carta (ela fica "na mão"),
// depois no alvo (âncora ou outra carta), e o barbante se desenha sozinho.
// Não há arrasto de fio. Arrastar o CORPO da carta apenas a reposiciona.
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
  // posCartas guarda só as cartas JÁ espetadas na cortiça (id → {x,y}). Cartas
  // sem entrada aqui ainda estão na bandeja. A cortiça começa vazia.
  const [posCartas, setPosCartas] = useState({});
  // `origem`: id da carta na mão (vinda da bandeja ou já na cortiça), ou null.
  // `ghost`: coordenada do cursor, só para desenhar o fio-prévia.
  const [origem, setOrigem] = useState(null);
  const [ghost, setGhost] = useState(null);

  // Com uma carta na mão: o fio-prévia segue o cursor e Esc cancela a seleção.
  // O alvo do clique é tratado pelos próprios nós (cartas e âncoras), não por
  // escuta global — não há mais arrasto nem `elementFromPoint`.
  useEffect(() => {
    if (!origem) {
      setGhost(null);
      return;
    }
    function mover(e) {
      const r = canvasRef.current.getBoundingClientRect();
      setGhost({ x: e.clientX - r.left, y: e.clientY - r.top });
    }
    function tecla(e) {
      if (e.key === 'Escape') setOrigem(null);
    }
    window.addEventListener('pointermove', mover);
    window.addEventListener('keydown', tecla);
    return () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('keydown', tecla);
    };
  }, [origem]);

  // Uma carta está "na cortiça" quando já foi espetada (tem posição); senão,
  // está na bandeja.
  const naCortica = (id) => !!posCartas[id];

  // Pegar/soltar uma carta da bandeja (nunca amarra — só ergue para espetar).
  function pegarDaBandeja(id) {
    setOrigem((atual) => (atual === id ? null : id));
  }

  // Clique → clique entre nós da CORTIÇA: o 1º clique pega a carta; o 2º amarra
  // ao alvo (âncora ou outra carta). Clicar de novo na mesma cancela. Só amarra
  // se a carta na mão já está espetada (a da bandeja precisa ser espetada antes).
  function aoClicarNo(id) {
    if (!origem) {
      setOrigem(id);
      return;
    }
    if (origem === id) {
      setOrigem(null);
      return;
    }
    if (naCortica(origem)) {
      adicionarLigacao(origem, id);
      setOrigem(null);
    }
  }

  // Espeta/reposiciona uma carta na cortiça (clamp para dentro da superfície).
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
  // Carta da CORTIÇA na mão → as âncoras viram alvo de amarração.
  const amarrando = !!origem && naCortica(origem);
  // A bandeja mostra as cartas ainda não espetadas, na ordem de coleta.
  const cartasBandeja = cartasRegistradas.filter((c) => !posCartas[c.id]);

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
            Pegue uma carta na bandeja e espete-a num vão da cortiça; depois clique nela e numa âncora (ou noutra carta) para amarrar. Esc ou o fundo solta. Construir não custa tempo.
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
        <div
          ref={canvasRef}
          className="relative"
          style={{ width: 1360, height: 920 }}
          onClick={(e) => {
            if (e.target !== e.currentTarget) return; // só reage ao fundo da cortiça
            if (origem && !naCortica(origem)) {
              // Carta da bandeja na mão: espeta no ponto clicado (sem fio).
              const r = canvasRef.current.getBoundingClientRect();
              moverCartaLocal(origem, e.clientX - r.left - PINO, e.clientY - r.top - PINO);
              setOrigem(null);
            } else {
              setOrigem(null); // fundo vazio solta a seleção
            }
          }}
        >
          {/* Camada dos barbantes (não intercepta o ponteiro; as linhas, sim) */}
          <svg className="absolute inset-0" width={1360} height={920} style={{ pointerEvents: 'none' }}>
            {acusacao.ligacoes.map((l) => {
              const a = centro(l.de);
              const b = centro(l.para);
              if (!a || !b) return null;
              return <Barbante key={l.id} a={a} b={b} aoRemover={() => removerLigacao(l.id)} />;
            })}
            {origem &&
              ghost &&
              (() => {
                const a = centro(origem);
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

          <Box
            pos={BOXES[ANCORAS.quando]}
            dataNo={ANCORAS.quando}
            titulo="Quando — a janela"
            alvo
            conectando={amarrando}
            aoAmarrar={() => aoClicarNo(ANCORAS.quando)}
          >
            <SeletorJanela acusacao={acusacao} definirJanela={definirJanela} />
            {acusacao.janela.inicio != null && acusacao.janela.fim != null && (
              <p className="text-amber-200/80 text-xs mt-2">{formatJanela(acusacao.janela)}</p>
            )}
            <p className="text-stone-600 text-[10px] mt-2">Amarre aqui os indicadores (rigor, livor, algor, visto-vivo).</p>
          </Box>

          <Box
            pos={BOXES[ANCORAS.como]}
            dataNo={ANCORAS.como}
            titulo="Como — a causa"
            alvo
            conectando={amarrando}
            aoAmarrar={() => aoClicarNo(ANCORAS.como)}
          >
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
              {CATALOGO_CAUSAS.map((c) => (
                <Opcao key={c.id} ativa={acusacao.causaId === c.id} aoClicar={() => definirCausa(c.id)} rotulo={c.nome} />
              ))}
            </div>
            <p className="text-stone-600 text-[10px] mt-2">Amarre aqui os sinais do corpo.</p>
          </Box>

          <Box
            pos={BOXES[ANCORAS.presenca]}
            dataNo={ANCORAS.presenca}
            titulo="Presença — o réu na cena"
            alvo
            conectando={amarrando}
            aoAmarrar={() => aoClicarNo(ANCORAS.presenca)}
          >
            <p className="text-stone-500 text-xs">Amarre aqui o vestígio cujo material liga o réu à arma do óbito.</p>
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

          {/* ---------------- Cartas espetadas (arrastar reposiciona; clicar amarra) ---------------- */}
          {cartasRegistradas
            .filter((carta) => posCartas[carta.id])
            .map((carta) => (
              <CartaNoMural
                key={carta.id}
                carta={carta}
                pos={posCartas[carta.id]}
                mover={moverCartaLocal}
                selecionada={origem === carta.id}
                aoClicar={aoClicarNo}
              />
            ))}
        </div>
      </div>

      {/* A bandeja — o maço coletado (rodapé) */}
      <Bandeja cartas={cartasBandeja} origem={origem} aoClicar={pegarDaBandeja} />
    </div>
  );
}

// ---------------------------------------------------------------------
// A bandeja: o maço coletado, no rodapé. Mostra TODAS as cartas ainda não
// espetadas, na ordem de coleta — sem ordenar, filtrar ou destacar "relevância".
// Clicar numa carta a ergue (para depois espetá-la num vão da cortiça).
// ---------------------------------------------------------------------
function Bandeja({ cartas, origem, aoClicar }) {
  return (
    <div className="shrink-0 border-t border-amber-900/40 bg-stone-900/80 px-4 pt-2 pb-3">
      <div className="flex items-baseline gap-3 mb-1.5">
        <span className="text-amber-200/70 text-[10px] tracking-[0.2em] uppercase">A bandeja — o maço coletado</span>
        <span className="text-stone-600 text-[10px]">
          {cartas.length === 0
            ? 'tudo espetado no mural'
            : `${cartas.length} carta(s) — clique para pegar, depois clique num vão da cortiça`}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {cartas.map((carta) => {
          const sel = origem === carta.id;
          return (
            <button
              key={carta.id}
              onClick={() => aoClicar(carta.id)}
              title={carta.descricao}
              className={`shrink-0 w-44 text-left bg-stone-900 border rounded-sm px-3 py-2 ${
                sel ? 'border-amber-400 ring-2 ring-amber-400' : 'border-stone-700 hover:border-stone-500'
              }`}
            >
              <p className="font-serif text-stone-200 text-xs leading-snug">{carta.textoDisplay}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Um barbante já amarrado. Ao surgir, "se desenha sozinho" (a linha avança
// da origem ao alvo). Depois vira uma linha comum, que acompanha as cartas
// se elas forem reposicionadas. A linha grossa invisível por cima é a área
// de clique para REMOVER o barbante.
// ---------------------------------------------------------------------
function Barbante({ a, b, aoRemover }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const L = el.getTotalLength();
    el.style.transition = 'none';
    el.style.strokeDasharray = String(L);
    el.style.strokeDashoffset = String(L);
    void el.getBoundingClientRect(); // aplica o estado inicial antes de animar
    el.style.transition = 'stroke-dashoffset 350ms ease-out';
    el.style.strokeDashoffset = '0';
    const t = setTimeout(() => {
      const cur = ref.current;
      if (cur) {
        cur.style.strokeDasharray = 'none';
        cur.style.transition = 'none';
      }
    }, 380);
    return () => clearTimeout(t);
    // animação só na montagem (barbante recém-amarrado)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <g>
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke="transparent"
        strokeWidth={14}
        style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
        onClick={aoRemover}
      />
      <line ref={ref} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b45309" strokeWidth={2} />
    </g>
  );
}

// ---------------------------------------------------------------------
// Âncora fixa (não se arrasta). Quando há uma carta na mão (`conectando`) e a
// âncora é um destino (`alvo`), uma camada por cima captura o clique inteiro —
// amarrar — protegendo os controles internos (causas, seletor de hora).
// ---------------------------------------------------------------------
function Box({ pos, titulo, children, dataNo, alvo, conectando, aoAmarrar }) {
  return (
    <div
      data-no={dataNo}
      className={`absolute w-60 rounded-sm px-3 py-2 bg-stone-900 ${
        alvo ? 'border-2 border-amber-800/70' : 'border border-stone-700'
      } ${conectando ? 'ring-2 ring-amber-500/60' : ''}`}
      style={{ left: pos.x, top: pos.y }}
    >
      <p className="text-amber-200/80 text-[10px] tracking-[0.2em] uppercase mb-2">{titulo}</p>
      {children}
      {conectando && (
        <div
          onClick={aoAmarrar}
          title="Amarrar aqui"
          className="absolute inset-0 z-10 cursor-pointer rounded-sm bg-amber-500/5"
        />
      )}
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
// Carta na superfície. Arrastar o CORPO (mais que o limiar) reposiciona;
// um clique simples (sem arrasto) pega a carta ou a amarra ao alvo.
// O pino âmbar é apenas enfeite — o clique vale na carta inteira.
// ---------------------------------------------------------------------
const LIMIAR = 6;
function CartaNoMural({ carta, pos, mover, selecionada, aoClicar }) {
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
    const a = estado.current;
    estado.current = null;
    // Sem arrasto = clique: pega a carta (origem) ou amarra ao alvo.
    if (a && !a.moveu) aoClicar(carta.id);
  }

  return (
    <div
      data-no={carta.id}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      className={`absolute w-44 select-none touch-none cursor-grab active:cursor-grabbing ${
        selecionada ? 'z-30' : ''
      }`}
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        className={`bg-stone-900 border rounded-sm px-3 py-2 ${
          selecionada ? 'border-amber-400 ring-2 ring-amber-400' : 'border-stone-700 hover:border-stone-500'
        }`}
        title={carta.descricao}
      >
        <p className="font-serif text-stone-200 text-xs leading-snug pl-3">{carta.textoDisplay}</p>
      </div>
      {/* O pino: enfeite (o clique vale na carta inteira). */}
      <span className="absolute -left-1 -top-1 w-4 h-4 rounded-full bg-amber-500 border border-amber-200 pointer-events-none" />
    </div>
  );
}
