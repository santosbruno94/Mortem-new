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
      {/* Observações reunidas — re-leitura livre, fichas de pergaminho */}
      <h3 className="font-serif text-latao-claro text-lg titulo-gravado mb-3">Observações reunidas</h3>
      {cartasRegistradas.length === 0 ? (
        <p className="text-stone-400 italic font-serif text-sm mb-8">Nada foi observado ainda. Examine os locais.</p>
      ) : (
        <ul className="space-y-3 mb-8">
          {cartasRegistradas.map((c) => {
            const verbete = verbeteParaCarta(c.tagsOcultas);
            return (
              <li key={c.id} className="carta-pergaminho rounded-sm px-4 py-3">
                <p className="text-tinta text-sm font-serif">{c.textoDisplay}</p>
                <p className="text-tinta-clara text-sm mt-1">{c.descricao}</p>
                {c.vozMestre && (
                  <p className="text-tinta-clara font-serif italic text-sm mt-2">“{c.vozMestre}”</p>
                )}
                <div className="flex flex-wrap items-baseline justify-between gap-2 mt-2">
                  <p className="text-tinta-apagada text-rotulo uppercase">
                    observado às {formatRelogio(c.horaRegistro)}
                  </p>
                  {verbete && (
                    <button
                      onClick={() => abrirOverlay('glossario', verbete.id)}
                      className="text-tinta-clara hover:text-tinta underline decoration-tinta-apagada/60 underline-offset-2 text-[11px] px-1 py-1.5 -my-1.5 transition-colors duration-gesto"
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
      <h3 className="font-serif text-latao-claro text-lg titulo-gravado mb-3">Leitura do legista</h3>
      {conclusoes.length === 0 ? (
        <p className="text-stone-400 italic font-serif text-sm mb-8">O legista ainda não tem leitura — examine o corpo.</p>
      ) : (
        <ul className="space-y-3 mb-8">
          {conclusoes.map((c) => (
            <li key={c.id} className="carta-pergaminho rounded-sm px-4 py-3">
              <p className="text-tinta text-sm font-serif font-bold">{c.titulo}</p>
              <p className="text-tinta-clara text-sm mt-1">{c.resumo}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Diário da investigação — meta do caso: permanece escuro, sobre o couro */}
      <h3 className="font-serif text-latao-claro text-lg titulo-gravado mb-3">Diário da investigação</h3>
      {log.length === 0 ? (
        <p className="text-stone-400 italic font-serif text-sm">A página aguarda a primeira anotação.</p>
      ) : (
        <ul className="space-y-1">
          {log.map((entrada, i) => (
            <li key={i} className="text-sm text-stone-300">
              <span className="text-latao-claro/70">{formatRelogio(entrada.hora)} —</span> {entrada.texto}
            </li>
          ))}
        </ul>
      )}
    </Overlay>
  );
}
