import { useEffect, useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { tocarSom } from '../som.js';

// =====================================================================
// O AVISO DE POUSO (Onda 4): quando uma observação se registra sem abrir
// ficha (todas menos a primeira do caso), uma etiqueta surge no pé da
// tela e desliza em direção à mesa — flourish, não interrupção. Clicar
// nela abre a ficha para leitura; sozinha, some. Camada de puro efeito:
// o registro já aconteceu no store (ultimaCartaPousada é transiente).
// =====================================================================
export default function AvisoCartaPousada() {
  const ultimaCartaPousada = useJogo((s) => s.ultimaCartaPousada);
  const carta = useJogo((s) =>
    s.cartasRegistradas.find((c) => c.id === s.ultimaCartaPousada)
  );
  const abrirFicha = useJogo((s) => s.abrirFicha);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!ultimaCartaPousada) return undefined;
    setVisivel(true);
    tocarSom('papel');
    const t = setTimeout(() => setVisivel(false), 2200);
    return () => clearTimeout(t);
  }, [ultimaCartaPousada]);

  if (!visivel || !carta) return null;
  return (
    <div
      key={carta.id}
      data-aviso-pousada
      className="fixed bottom-3 right-3 z-50 pointer-events-none"
    >
      <button
        onClick={() => {
          setVisivel(false);
          abrirFicha(carta.id);
        }}
        className="aviso-pousada pointer-events-auto carta-pergaminho relative rounded-sm px-3 pt-3 pb-2 text-left shadow-pousado max-w-[16rem]"
        title="Abrir a ficha desta observação"
      >
        {/* A tacha que prende o papelucho: o aviso não flutua, foi espetado */}
        <span className="tacha-latao absolute -top-1 left-3.5 w-2 h-2" aria-hidden />
        {/* Tinta garrafa: no gabinete, é a cor do que já foi conferido e
            entrou para o registro. */}
        <span className="carimbo carimbo--garrafa block w-fit text-rotulo uppercase">
          Registrado na mesa
        </span>
        <span className="block font-serif text-tinta text-sm leading-snug mt-1.5">
          {carta.termoCarimbo}
        </span>
      </button>
    </div>
  );
}
