import { useJogo } from '../store/jogo.js';
import { formatTemperatura } from '../logic/tempo.js';
import { AMBIENTE_PADRAO } from '../logic/tempo_morte.js';

// Ação especial do exame do corpo: medir a temperatura retal gera a
// carta de algor mortis correspondente ao momento da medição. Como todo
// exame, não custa tempo — o relógio só corre ao viajar.
export default function TermometroCorpo() {
  const temperaturaMedida = useJogo((s) => s.temperaturaMedida);
  const medirTemperatura = useJogo((s) => s.medirTemperatura);

  // O resultado da medição vira etiqueta de pergaminho: leitura anotada a tinta.
  if (temperaturaMedida !== null) {
    return (
      <div className="mt-6 carta-pergaminho rounded-sm px-4 py-3">
        <p className="text-tinta-clara text-sm font-serif">
          O termômetro já cumpriu seu ofício:{' '}
          <span className="text-tinta font-bold">{formatTemperatura(temperaturaMedida)}</span>, contra{' '}
          {formatTemperatura(AMBIENTE_PADRAO)} do ambiente. A leitura está na mesa.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 border border-latao/40 bg-stone-950/40 rounded-sm px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p className="text-sm text-stone-300 font-serif">
        O termômetro de mercúrio aguarda na maleta. O ambiente marca{' '}
        <span className="text-amber-100">{formatTemperatura(AMBIENTE_PADRAO)}</span>.
      </p>
      <button onClick={medirTemperatura} className="shrink-0 botao-mesa">
        Medir temperatura
      </button>
    </div>
  );
}
