import { useJogo } from '../store/jogo.js';

// Ação especial do exame do corpo: medir a temperatura retal gera a
// carta de algor mortis correspondente ao momento da medição (custa 1h).
export default function TermometroCorpo() {
  const temperaturaMedida = useJogo((s) => s.temperaturaMedida);
  const medirTemperatura = useJogo((s) => s.medirTemperatura);

  if (temperaturaMedida !== null) {
    return (
      <div className="mt-6 border border-stone-800 rounded-sm px-4 py-3 text-sm text-stone-500">
        O termômetro já cumpriu seu ofício: <span className="text-stone-300">{temperaturaMedida}°C</span>,
        contra 11°C do ambiente. A leitura está na mesa.
      </div>
    );
  }

  return (
    <div className="mt-6 border border-amber-900/50 rounded-sm px-4 py-4 flex items-center justify-between gap-4">
      <p className="text-sm text-stone-400">
        O termômetro de mercúrio aguarda na maleta. O ambiente marca <span className="text-stone-300">11°C</span>.
      </p>
      <button
        onClick={medirTemperatura}
        className="shrink-0 px-4 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800"
      >
        Medir temperatura (1h)
      </button>
    </div>
  );
}
