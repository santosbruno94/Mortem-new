import { useJogo } from '../store/jogo.js';
import { formatRelogio } from '../logic/tempo.js';

// Relógio de bolso (§5): avança apenas com ações que custam tempo.
export default function RelogioBolso() {
  const horasJogo = useJogo((s) => s.horasJogo);

  return (
    <div className="absolute top-4 right-4 z-10 bg-stone-900 border border-amber-900/50 rounded-full px-5 py-3 text-center select-none">
      <p className="text-stone-600 text-[10px] tracking-[0.25em] uppercase">Relógio de Bolso</p>
      <p className="font-serif text-amber-200 text-lg">{formatRelogio(horasJogo)}</p>
    </div>
  );
}
