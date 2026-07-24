import { useJogo } from '../../store/jogo.js';
import { obterCaso } from '../../data/pacote_caso.js';

// E3 §4.6 — o telegrama: consulta por fio ao registro distante, expedida
// da delegacia. Camada de apresentação pura: os dados (destino, latência,
// resposta) vêm do pacote; o botão só aparece depois que o lead revelou o
// nó da comarca (antes disso não há o que consultar). A resposta chega
// pelo relógio mole (store.viajarPara).
export default function BotaoTelegrafo() {
  const enviado = useJogo((s) => s.telegramaEnviado);
  const nosDesbloqueados = useJogo((s) => s.nosDesbloqueados);
  const telegrafar = useJogo((s) => s.telegrafar);
  const t = obterCaso().telegrama;
  if (!t) return null;
  if (!nosDesbloqueados.some((id) => id.startsWith('comarca_'))) return null;
  const feito = !!enviado;
  return (
    <div className="mt-4">
      <button
        type="button"
        className={`botao-mesa text-xs sm:text-sm ${feito ? 'botao-mesa--quieto' : ''}`}
        disabled={feito}
        onClick={telegrafar}
      >
        {feito
          ? enviado.entregue
            ? 'Telegrama respondido · na mesa'
            : 'Telegrama expedido · aguarda resposta'
          : `Telegrafar a ${t.destino}`}
      </button>
    </div>
  );
}
