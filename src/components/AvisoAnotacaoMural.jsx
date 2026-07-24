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
      {/* Este aviso não vem da mesa: vem do mural, e por isso é escuro —
          fundo de cortiça no breu, filete de cera por fora, o carimbo de
          cera a dizer o que a cor promete no jogo inteiro (há novidade). */}
      <div className="aviso-pousada aviso-mural rounded-sm px-3 pt-3 pb-2 max-w-[16rem]">
        <span className="carimbo carimbo--cera block w-fit text-rotulo uppercase">Confronto</span>
        <span className="block font-serif text-papel text-sm leading-snug mt-1.5">
          A prova ficou anotada ao mural.
        </span>
      </div>
    </div>
  );
}
