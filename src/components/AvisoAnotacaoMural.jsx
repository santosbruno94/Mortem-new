import { useEffect, useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { tocarSom } from '../som.js';

// =====================================================================
// O AVISO DE ANOTAÇÃO AO MURAL (P1 §7 do playtest de 17/07): quando o
// confronto em cena desmente o paradeiro do interrogado, a refuta_alibi
// nasce no mural sem o jogador tocá-la — antes, só o diário sabia. Este
// aviso é o irmão do AvisoCartaPousada (mesmo tom, mesma duração): a
// etiqueta surge no pé da tela e some sozinha. Camada de puro efeito —
// a ligação já aconteceu no store (ultimoConfrontoAnotado é transiente).
// =====================================================================
export default function AvisoAnotacaoMural() {
  const anotado = useJogo((s) => s.ultimoConfrontoAnotado);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!anotado) return undefined;
    setVisivel(true);
    tocarSom('barbante');
    const t = setTimeout(() => setVisivel(false), 2200);
    return () => clearTimeout(t);
  }, [anotado]);

  if (!visivel || !anotado) return null;
  return (
    <div data-aviso-mural className="fixed bottom-3 left-3 z-50 pointer-events-none">
      <div className="aviso-pousada carta-pergaminho rounded-sm px-3 py-2 shadow-pousado max-w-[16rem]">
        <span className="block text-cera text-rotulo uppercase">Confronto</span>
        <span className="block font-serif text-tinta text-sm leading-snug mt-0.5">
          A prova ficou anotada ao mural.
        </span>
      </div>
    </div>
  );
}
