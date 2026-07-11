import { useRef } from 'react';
import { useJogo } from '../store/jogo.js';

// Invólucro arrastável de qualquer carta sobre a superfície da mesa.
// Arrastar custa zero. Um movimento abaixo do limiar conta como clique.
const LIMIAR_ARRASTO = 6;

export default function CartaMesa({ id, pos, aoClicar, children }) {
  const moverCarta = useJogo((s) => s.moverCarta);
  const estadoArrasto = useRef(null);

  function aoPressionar(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const el = e.currentTarget;
    // Limite horizontal: a carta não pode sumir para fora da mesa
    // (em tela estreita isso a tornaria inalcançável).
    const maxX = Math.max(0, (el.parentElement?.clientWidth || Infinity) - el.offsetWidth);
    estadoArrasto.current = {
      x0: e.clientX,
      y0: e.clientY,
      origemX: pos.x,
      origemY: pos.y,
      moveu: false,
      maxX,
    };
  }

  function aoMover(e) {
    const a = estadoArrasto.current;
    if (!a) return;
    const dx = e.clientX - a.x0;
    const dy = e.clientY - a.y0;
    if (Math.abs(dx) > LIMIAR_ARRASTO || Math.abs(dy) > LIMIAR_ARRASTO) a.moveu = true;
    if (a.moveu)
      moverCarta(id, Math.min(a.maxX, Math.max(0, a.origemX + dx)), Math.max(0, a.origemY + dy));
  }

  function aoSoltar() {
    const a = estadoArrasto.current;
    estadoArrasto.current = null;
    if (a && !a.moveu && aoClicar) aoClicar();
  }

  return (
    <div
      onPointerDown={aoPressionar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      className="absolute select-none touch-none cursor-grab active:cursor-grabbing active:z-30"
      style={{ left: pos.x, top: pos.y }}
    >
      {children}
    </div>
  );
}
