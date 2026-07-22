import { useRef } from 'react';
import { useJogo } from '../store/jogo.js';

// Invólucro arrastável de qualquer carta sobre a superfície da mesa.
// Arrastar custa zero. Um movimento abaixo do limiar conta como clique.
// Durante o arrasto a posição vive no DOM (ref): o store — que persiste
// o save inteiro a cada set — só é escrito no soltar (diagnóstico 21/07,
// M9; antes eram dezenas de serializações por segundo no pointermove).
const LIMIAR_ARRASTO = 6;

export default function CartaMesa({ id, pos, aoClicar, children }) {
  const moverCarta = useJogo((s) => s.moverCarta);
  const estadoArrasto = useRef(null);
  const elRef = useRef(null);

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
      x: pos.x,
      y: pos.y,
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
    if (a.moveu) {
      a.x = Math.min(a.maxX, Math.max(0, a.origemX + dx));
      a.y = Math.max(0, a.origemY + dy);
      const el = elRef.current;
      if (el) {
        el.style.left = `${a.x}px`;
        el.style.top = `${a.y}px`;
      }
    }
  }

  function aoSoltar() {
    const a = estadoArrasto.current;
    estadoArrasto.current = null;
    if (!a) return;
    if (a.moveu) moverCarta(id, a.x, a.y);
    else if (aoClicar) aoClicar();
  }

  return (
    <div
      ref={elRef}
      onPointerDown={aoPressionar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      className="carta-mesa absolute select-none touch-none cursor-grab active:cursor-grabbing active:z-30"
      style={{ left: pos.x, top: pos.y }}
    >
      {children}
    </div>
  );
}
