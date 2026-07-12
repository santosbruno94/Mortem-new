import { useJogo } from '../store/jogo.js';
import { formatRelogio } from '../logic/tempo.js';

// Relógio de bolso (§5): avança apenas com ações que custam tempo.
export default function RelogioBolso() {
  const horasJogo = useJogo((s) => s.horasJogo);

  return (
    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-stone-900/90 backdrop-blur-sm border border-amber-900/50 rounded-full px-3 py-2 sm:px-5 sm:py-3 text-center select-none shadow-pousado">
      <p className="text-stone-600 text-[8px] tracking-[0.25em] sm:text-rotulo uppercase">Relógio de Bolso</p>
      <p className="font-serif text-amber-200 text-sm sm:text-lg">{formatRelogio(horasJogo)}</p>
    </div>
  );
}
