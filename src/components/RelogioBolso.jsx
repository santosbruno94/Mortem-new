import { useJogo } from '../store/jogo.js';
import { formatRelogio } from '../logic/tempo.js';

// Relógio de bolso (§5): avança apenas com ações que custam tempo.
export default function RelogioBolso() {
  const horasJogo = useJogo((s) => s.horasJogo);

  return (
    // Objeto físico pousado na mesa: caixa escura com aro de latão em
    // relevo, rótulo gravado e a hora em serif âmbar, maior.
    // Compacto no celular (menos área sobre a maquete: o desobstrutor de
    // rótulos o trata como obstáculo fixo; quanto menor, menos etiqueta ele
    // empurra). Cresce em telas largas.
    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-stone-900/90 backdrop-blur-sm border border-latao/60 rounded-full px-2.5 py-1.5 sm:px-5 sm:py-3 text-center select-none shadow-placa">
      <p className="text-latao-claro/70 text-[8px] tracking-[0.2em] sm:text-rotulo uppercase leading-none">Relógio de Bolso</p>
      <p className="font-serif text-amber-200 text-xs sm:text-xl leading-tight">{formatRelogio(horasJogo)}</p>
    </div>
  );
}
