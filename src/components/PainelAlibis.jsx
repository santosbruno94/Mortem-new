import { useJogo } from '../store/jogo.js';
import { obterSuspeito } from '../data/seed.js';
import { formatDeclaracao } from '../logic/tempo.js';
import Overlay from './Overlay.jsx';

// Painel de Álibis (§8): "Declarações de Paradeiro".
// Lista ESTRITAMENTE NEUTRA dos depoimentos de álibi já coletados:
// quem declarou, o que declarou, faixa horária declarada. Sem status,
// sem cruzamento automático — comparar com a Janela da Morte é
// raciocínio do jogador. Consulta gratuita.
export default function PainelAlibis() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const declaracoes = cartasRegistradas.filter(
    (c) => c.tagsOcultas.dominio === 'comportamental' && c.tagsOcultas.subDominio === 'alibi'
  );

  return (
    <Overlay titulo="Declarações de Paradeiro" subtitulo="Registro literal dos depoimentos — consultar não custa tempo">
      {declaracoes.length === 0 ? (
        <p className="text-stone-600 text-sm">
          Nenhuma declaração de paradeiro foi colhida até aqui. Interrogue quem tiver algo a declarar.
        </p>
      ) : (
        <ul className="space-y-3">
          {declaracoes.map((carta) => {
            const declarante = obterSuspeito(carta.tagsOcultas.declaranteId);
            return (
              <li key={carta.id} className="border border-stone-800 rounded-sm px-4 py-3">
                <p className="font-serif text-amber-200">{declarante ? declarante.nome : 'Declarante incerto'}</p>
                <p className="text-stone-300 text-sm mt-1">“{carta.textoDisplay}”</p>
                <p className="text-stone-500 text-sm mt-1">
                  Faixa declarada:{' '}
                  {formatDeclaracao(carta.tagsOcultas.horaInicioDeclarada, carta.tagsOcultas.horaFimDeclarada)}.
                </p>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-6 text-stone-600 text-xs leading-relaxed">
        Este painel registra o que foi declarado, tal como foi declarado. Cotejar cada faixa com a
        Janela da Morte é ofício de quem constrói a acusação.
      </p>
    </Overlay>
  );
}
