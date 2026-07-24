import { useJogo } from '../../store/jogo.js';

// Micro-gesto pericial (Onda 7): botão-gesto no espírito do "Medir
// temperatura" — o clique É o gesto do perito e extrai a carta pelo MESMO
// extrairCarta dos termos (motor intocado). Feito = a carta está na mesa.
export default function GestoPericial({ gesto }) {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const extrairCarta = useJogo((s) => s.extrairCarta);
  const feito = cartasRegistradas.some((c) => c.id === gesto.cartaId);
  return (
    <button
      type="button"
      className={`gesto-pericial botao-mesa text-xs sm:text-sm ${feito ? 'botao-mesa--quieto' : ''}`}
      data-feito={feito ? '' : undefined}
      disabled={feito}
      onClick={() => extrairCarta(gesto.cartaId)}
    >
      {gesto.rotulo}
      {feito && <span className="text-stone-400"> · feito</span>}
    </button>
  );
}
