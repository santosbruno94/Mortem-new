import { useJogo } from '../store/jogo.js';
import { formatRelogio } from '../logic/tempo.js';
import Overlay from './Overlay.jsx';

// Caderneta (custo zero): o log de tudo que foi extraído, registrado e
// concluído, e a lista de conclusões com a opção de desfazer.
export default function Caderneta() {
  const log = useJogo((s) => s.log);
  const conclusoes = useJogo((s) => s.conclusoes);
  const desfazerConclusao = useJogo((s) => s.desfazerConclusao);

  return (
    <Overlay titulo="Caderneta" subtitulo="Anotações de campo — consultar não custa tempo">
      <h3 className="font-serif text-amber-200 text-lg mb-3">Conclusões registradas</h3>
      {conclusoes.length === 0 ? (
        <p className="text-stone-600 text-sm">Nenhuma conclusão registrada nas gavetas até aqui.</p>
      ) : (
        <ul className="space-y-2">
          {conclusoes.map((c) => (
            <li
              key={c.id}
              className="flex items-start justify-between gap-4 border border-stone-800 rounded-sm px-4 py-3"
            >
              <div>
                <p className="text-stone-300 text-sm font-bold">{c.titulo}</p>
                <p className="text-stone-500 text-sm">{c.resumo}</p>
              </div>
              <button
                onClick={() => desfazerConclusao(c.id)}
                className="text-stone-600 hover:text-amber-200 text-xs tracking-widest shrink-0"
              >
                desfazer
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3 className="font-serif text-amber-200 text-lg mt-8 mb-3">Diário da investigação</h3>
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
