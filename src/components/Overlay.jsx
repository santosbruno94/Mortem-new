import { useJogo } from '../store/jogo.js';

// Moldura padrão dos eventos e painéis: overlay centralizado sobre a
// escrivaninha (position fixed). A mesa permanece no DOM, desfocada.
export default function Overlay({ titulo, subtitulo, children, largura = 'max-w-2xl', aoFechar }) {
  const fecharOverlay = useJogo((s) => s.fecharOverlay);
  const fechar = aoFechar || fecharOverlay;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-8">
      <div
        className={`${largura} w-full max-h-[90vh] overflow-y-auto bg-stone-900 border border-amber-900/60 rounded-sm shadow-2xl shadow-black`}
      >
        <div className="sticky top-0 bg-stone-900 border-b border-stone-800 px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-amber-200">{titulo}</h2>
            {subtitulo && <p className="text-stone-500 text-sm mt-1">{subtitulo}</p>}
          </div>
          <button
            onClick={fechar}
            className="text-stone-500 hover:text-amber-200 text-sm tracking-widest shrink-0 mt-1"
          >
            fechar ✕
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
