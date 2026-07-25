import { useJogo } from '../../store/jogo.js';
import { lerCorpo, falaDoMestre } from '../../logic/falaDoMestre.js';
import { verbeteParaCarta } from '../../data/glossario.js';
import { modoDoCaso } from '../../data/casos.js';

// A leitura forense FALADA pelo mestre/legista (§4): some o mostrador das
// antigas gavetas; a interpretação vem por um personagem, em fala natural,
// e CRESCE conforme o jogador examina (pull — responde ao que foi visto).
// No procedural não há vozMestre nas cartas: este bloco fica vazio e o
// jogador, já perito, lê o corpo por conta própria.
// Visual: aparte com filete de latão à esquerda e fala em serif itálico.
export default function FalaDoLegista({ cartas }) {
  // O mestre (Dr. Abbot) não veio: Harlan examina só, e a voz do mestre lhe
  // guia o olho por dentro (a mesma convenção do eco pós-falha — a voz de
  // Abbot na cabeça do aprendiz). Itens 7 e 2 do playtest de 19/07: os
  // apartes vozMestre são leitura técnica — observação, não conclusão; e
  // remetem ao Glossário ("o mestre já falou disso"), onde o tutorial ensina
  // a ler o sinal em vez de o entregar mastigado. O link vem UMA vez por
  // extenso (o resto é affordance curto), para a frase não virar papel de
  // parede. Modo purista (Onda 8): a SÍNTESE cala; os apartes ficam.
  const modoPurista = useJogo((s) => s.modoPurista);
  const casoId = useJogo((s) => s.casoId);
  const abrirGlossario = useJogo((s) => s.abrirGlossario);
  // Nos casos GERADOS não há mestre a ecoar (playtest de 19/07, P1): quem
  // examina é o próprio perito, sem voz de terceiro — nem aparte, nem síntese.
  if (modoDoCaso(casoId) !== 'tutorial') return null;
  const asides = cartas.filter((c) => c.localidade === 'corpo' && c.vozMestre);
  const primeiroComVerbete = asides.findIndex((c) => verbeteParaCarta(c.tagsOcultas));
  const { tempo, causa } = falaDoMestre(lerCorpo(cartas));
  const sintese = !modoPurista && (tempo || causa);
  if (asides.length === 0 && !sintese) return null;
  return (
    <div className="mt-5 border-l-2 border-latao/70 pl-4 space-y-2">
      <p className="text-rotulo uppercase text-latao-claro/70">A voz do mestre</p>
      {asides.map((c, i) => {
        const verbete = verbeteParaCarta(c.tagsOcultas);
        return (
          <div key={c.id} className="space-y-1">
            <p className="font-serif italic text-stone-200 text-sm leading-relaxed">“{c.vozMestre}”</p>
            {verbete && (
              <button
                type="button"
                onClick={() => abrirGlossario(verbete.id)}
                className="text-xs text-latao-claro/70 hover:text-latao-claro underline decoration-dotted underline-offset-2"
              >
                {i === primeiroComVerbete
                  ? '§ o mestre já falou disso — veja no Glossário'
                  : '§ ver no Glossário'}
              </button>
            )}
          </div>
        );
      })}
      {sintese && (
        <div className="pt-2 mt-1 border-t border-latao/30 space-y-1">
          {tempo && <p className="font-serif italic text-amber-100/90 text-sm leading-relaxed">“{tempo}”</p>}
          {causa && <p className="font-serif italic text-amber-100/90 text-sm leading-relaxed">“{causa}”</p>}
        </div>
      )}
    </div>
  );
}
