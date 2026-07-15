import { useEffect } from 'react';
import { useJogo } from '../store/jogo.js';

// Moldura padrão dos eventos e painéis: overlay centralizado sobre a
// escrivaninha (position fixed). A mesa permanece no DOM, desfocada.
// Fecha no botão "✕" ou na tecla Esc.
// `marca` alimenta o atributo data-overlay (o QA de UI o usa para achar a
// raiz do overlay mais ao topo); default vazio preserva o contrato atual.
// `nivelZ` permite empilhar (a Ficha de Coleta sobe acima dos demais).
export default function Overlay({
  titulo,
  subtitulo,
  children,
  largura = 'max-w-2xl',
  aoFechar,
  marca = '',
  nivelZ = 'z-40',
}) {
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
    <div data-overlay={marca} className={`fixed inset-0 ${nivelZ} flex items-center justify-center p-3 sm:p-8`}>
      {/* O fundo escurece por trás do painel; clicar fora fecha (como Esc) */}
      <div className="overlay-fundo absolute inset-0 bg-black/40" onClick={fechar} aria-hidden />
      {/* A moldura de couro: capa escura de pasta de inquérito, com o
          fio de latão costurado por dentro (material .painel-couro). */}
      <div
        className={`${largura} overlay-surgir relative w-full max-h-[90vh] supports-[height:100dvh]:max-h-[90dvh] overflow-y-auto painel-couro rounded-sm`}
      >
        <div className="sticky top-0 z-10 bg-[#1a1613]/95 backdrop-blur-sm px-4 sm:px-6 pt-3 sm:pt-4 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif titulo-gravado text-xl sm:text-2xl text-amber-200">{titulo}</h2>
              {subtitulo && <p className="text-stone-400 text-sm mt-1">{subtitulo}</p>}
            </div>
            <button
              onClick={fechar}
              className="botao-fechar text-stone-400 hover:text-amber-200 transition-colors duration-gesto text-sm tracking-widest shrink-0 mt-1 px-3 py-2 -mr-2"
            >
              fechar ✕
            </button>
          </div>
          {/* O filete ornado que fecha o cabeçalho, discreto */}
          <div className="divisor-ornado text-xs mt-2" aria-hidden>
            §
          </div>
        </div>
        <div className="px-4 sm:px-6 py-5 sm:py-6">{children}</div>
      </div>
    </div>
  );
}
