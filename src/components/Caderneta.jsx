import { useJogo } from '../store/jogo.js';
import { formatRelogio } from '../logic/tempo.js';
import { verbeteParaCarta } from '../data/glossario.js';
import Overlay from './Overlay.jsx';

// Caderneta — o BANCO DE ANOTAÇÕES (§5): tudo que já foi observado fica
// gravado aqui para sempre, e reler não custa tempo (o relógio só pesa sobre
// o perecível AINDA não visto, lá fora). A observação fica congelada como
// foi vista — a degradação travou no momento da extração. Consulta gratuita.
export default function Caderneta() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);
  const log = useJogo((s) => s.log);
  const abrirOverlay = useJogo((s) => s.abrirOverlay);

  return (
    <Overlay titulo="Caderneta" subtitulo="Banco de anotações — reler não custa tempo">
      {/* Observações reunidas — re-leitura livre */}
      <h3 className="font-serif text-amber-200 text-lg mb-3">Observações reunidas</h3>
      {cartasRegistradas.length === 0 ? (
        <p className="text-stone-600 text-sm">Nada foi observado ainda. Examine os locais.</p>
      ) : (
        <ul className="space-y-2 mb-8">
          {cartasRegistradas.map((c) => {
            const verbete = verbeteParaCarta(c.tagsOcultas);
            return (
              <li key={c.id} className="border border-stone-800 bg-stone-950/40 rounded-sm px-4 py-3 transition-colors duration-gesto hover:border-stone-700">
                <p className="text-stone-200 text-sm font-serif">{c.textoDisplay}</p>
                <p className="text-stone-500 text-sm mt-1">{c.descricao}</p>
                {c.vozMestre && (
                  <p className="text-amber-200/70 text-xs italic mt-2">“{c.vozMestre}”</p>
                )}
                <div className="flex flex-wrap items-baseline justify-between gap-2 mt-2">
                  <p className="text-stone-700 text-[10px] tracking-widest uppercase">
                    observado às {formatRelogio(c.horaRegistro)}
                  </p>
                  {verbete && (
                    <button
                      onClick={() => abrirOverlay('glossario', verbete.id)}
                      className="text-amber-200/60 hover:text-amber-200 text-[11px]"
                      title="Abrir o verbete correspondente no Glossário"
                    >
                      § {verbete.termo}, no Glossário
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* A leitura do legista (a "dica"): refaz-se sozinha a cada exame */}
      <h3 className="font-serif text-amber-200 text-lg mb-3">Leitura do legista</h3>
      {conclusoes.length === 0 ? (
        <p className="text-stone-600 text-sm">O legista ainda não tem leitura — examine o corpo.</p>
      ) : (
        <ul className="space-y-2 mb-8">
          {conclusoes.map((c) => (
            <li key={c.id} className="border border-stone-800 bg-stone-950/40 rounded-sm px-4 py-3 transition-colors duration-gesto hover:border-stone-700">
              <p className="text-stone-300 text-sm font-bold">{c.titulo}</p>
              <p className="text-stone-500 text-sm">{c.resumo}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Diário da investigação */}
      <h3 className="font-serif text-amber-200 text-lg mb-3">Diário da investigação</h3>
      {log.length === 0 ? (
        <p className="text-stone-600 text-sm">A página aguarda a primeira anotação.</p>
      ) : (
        <ul className="space-y-1">
          {log.map((entrada, i) => (
            <li key={i} className="text-sm text-stone-400">
              <span className="text-stone-600">{formatRelogio(entrada.hora)} —</span> {entrada.texto}
            </li>
          ))}
        </ul>
      )}
    </Overlay>
  );
}
