import { useEffect } from 'react';
import { useJogo } from '../store/jogo.js';

// Moldura padrão dos eventos e painéis: overlay centralizado sobre a
// escrivaninha (position fixed). A mesa permanece no DOM, desfocada.
// Fecha no botão "✕" ou na tecla Esc.
export default function Overlay({ titulo, subtitulo, children, largura = 'max-w-2xl', aoFechar }) {
  const fecharOverlay = useJogo((s) => s.fecharOverlay);
  const fechar = aoFechar || fecharOverlay;

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') fechar();
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [fechar]);

  return (
    <div data-overlay className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-8">
      {/* O fundo escurece por trás do painel; clicar fora fecha (como Esc) */}
      <div className="overlay-fundo absolute inset-0 bg-black/40" onClick={fechar} aria-hidden />
      <div
        className={`${largura} overlay-surgir relative w-full max-h-[90vh] supports-[height:100dvh]:max-h-[90dvh] overflow-y-auto bg-stone-900 border border-amber-900/60 rounded-sm shadow-overlay`}
      >
        <div className="sticky top-0 z-10 bg-stone-900/95 backdrop-blur-sm border-b border-stone-800 px-4 sm:px-6 py-3 sm:py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-amber-200">{titulo}</h2>
            {subtitulo && <p className="text-stone-500 text-sm mt-1">{subtitulo}</p>}
          </div>
          <button
            onClick={fechar}
            className="text-stone-500 hover:text-amber-200 transition-colors duration-gesto text-sm tracking-widest shrink-0 mt-1 px-3 py-2 -mr-2"
          >
            fechar ✕
          </button>
        </div>
        <div className="px-4 sm:px-6 py-5 sm:py-6">{children}</div>
      </div>
    </div>
  );
}
