import { useJogo } from '../store/jogo.js';
import { OPCOES_PERSONAGEM } from '../data/abertura.js';

// Tela inicial (§12): um único convite de papel pousa na mesa de madeira
// à luz de vela; o Dr. Harlan Blackwell ergue-o e atende ao chamado.
export default function TelaPersonagem() {
  const escolherDetective = useJogo((s) => s.escolherDetective);

  return (
    <div className="relative altura-tela-min mesa-madeira overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      {/* Halo de vela que respira sobre a mesa */}
      <div className="luz-de-vela" aria-hidden />

      {/* O conjunto pousa na mesa com o mesmo gesto dos overlays (≤320ms,
          cede ao prefers-reduced-motion via .overlay-surgir) */}
      <div className="relative overlay-surgir w-full max-w-4xl flex flex-col items-center">
        <h1 className="font-serif text-6xl sm:text-8xl tracking-[0.25em] sm:tracking-[0.35em] text-amber-200 titulo-gravado text-center select-none -mr-[0.25em] sm:-mr-[0.35em]">
          MORTEM
        </h1>

        <div className="divisor-ornado text-sm mt-6 w-full max-w-md" aria-hidden>
          §
        </div>
        <p className="mt-4 text-stone-400 text-sm tracking-[0.3em] text-center">
          A Hora Emprestada — Briarstone, 1893
        </p>

        <p className="mt-14 sm:mt-16 mb-8 sm:mb-10 font-serif italic text-lg sm:text-xl text-amber-200/90 text-center">
          Quem atende ao chamado?
        </p>

        {/* Um convite de pergaminho sobre a mesa: o papel se ergue
            sob o cursor (.carta-mesa cuida do gesto de hover) */}
        <div className="flex justify-center w-full max-w-md">
          {OPCOES_PERSONAGEM.map((opcao) => (
            <button
              key={opcao.id}
              onClick={() => escolherDetective(opcao.id)}
              className="carta-mesa text-left h-full"
            >
              <div className="carta-pergaminho rounded-sm p-5 sm:p-7 h-full">
                <h2 className="font-serif text-2xl text-tinta">{opcao.nome}</h2>
                <div className="mt-2 mb-3 text-tinta-apagada" aria-hidden>
                  ―
                </div>
                <p className="text-tinta-clara leading-relaxed text-sm">{opcao.descricao}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
