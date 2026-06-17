import { useJogo } from '../store/jogo.js';
import { formatRelogio } from '../logic/tempo.js';
import Overlay from './Overlay.jsx';

// Caderneta — o BANCO DE ANOTAÇÕES (§5): tudo que já foi observado fica
// gravado aqui para sempre, e reler não custa tempo (o relógio só pesa sobre
// o perecível AINDA não visto, lá fora). A observação fica congelada como
// foi vista — a degradação travou no momento da extração. Consulta gratuita.
export default function Caderneta() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);
  const log = useJogo((s) => s.log);
  const desfazerConclusao = useJogo((s) => s.desfazerConclusao);

  // Só o que o jogador cravou de própria mão é desfazível (Confronto);
  // a leitura do mestre se refaz sozinha a cada exame.
  const desfazivel = (c) => c.origem === 'confronto';

  return (
    <Overlay titulo="Caderneta" subtitulo="Banco de anotações — reler não custa tempo">
      {/* Observações reunidas — re-leitura livre */}
      <h3 className="font-serif text-amber-200 text-lg mb-3">Observações reunidas</h3>
      {cartasRegistradas.length === 0 ? (
        <p className="text-stone-600 text-sm">Nada foi observado ainda. Examine os locais.</p>
      ) : (
        <ul className="space-y-2 mb-8">
          {cartasRegistradas.map((c) => (
            <li key={c.id} className="border border-stone-800 rounded-sm px-4 py-3">
              <p className="text-stone-200 text-sm font-serif">{c.textoDisplay}</p>
              <p className="text-stone-500 text-sm mt-1">{c.descricao}</p>
              {c.vozMestre && (
                <p className="text-amber-200/70 text-xs italic mt-2">“{c.vozMestre}”</p>
              )}
              <p className="text-stone-700 text-[10px] tracking-widest uppercase mt-2">
                observado às {formatRelogio(c.horaRegistro)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Leituras do legista e ligações cravadas no Confronto */}
      <h3 className="font-serif text-amber-200 text-lg mb-3">Leituras e ligações cravadas</h3>
      {conclusoes.length === 0 ? (
        <p className="text-stone-600 text-sm">O legista ainda não cravou leitura, e nada foi ligado.</p>
      ) : (
        <ul className="space-y-2 mb-8">
          {conclusoes.map((c) => (
            <li
              key={c.id}
              className="flex items-start justify-between gap-4 border border-stone-800 rounded-sm px-4 py-3"
            >
              <div>
                <p className="text-stone-300 text-sm font-bold">{c.titulo}</p>
                <p className="text-stone-500 text-sm">{c.resumo}</p>
              </div>
              {desfazivel(c) && (
                <button
                  onClick={() => desfazerConclusao(c.id)}
                  className="text-stone-600 hover:text-amber-200 text-xs tracking-widest shrink-0"
                >
                  desfazer
                </button>
              )}
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
