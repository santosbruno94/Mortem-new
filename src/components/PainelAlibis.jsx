import { useJogo } from '../store/jogo.js';
import { obterSuspeito } from '../data/pacote_caso.js';
import { formatDeclaracao } from '../logic/tempo.js';
import Overlay from './Overlay.jsx';
import RetratoPersonagem from './RetratoPersonagem.jsx';

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
        <p className="text-stone-400 italic font-serif text-sm">
          Nenhuma declaração de paradeiro foi colhida até aqui. Interrogue quem tiver algo a declarar.
        </p>
      ) : (
        <ul className="space-y-3">
          {declaracoes.map((carta) => {
            const declarante = obterSuspeito(carta.tagsOcultas.declaranteId);
            return (
              // Cada depoimento é uma ficha de pergaminho: retrato ao lado,
              // a citação escrita a tinta, tal como foi declarada.
              <li key={carta.id} className="carta-pergaminho rounded-sm px-4 py-3 flex gap-4 items-start">
                <div className="shrink-0 border border-tinta-apagada/60 rounded-sm shadow-pousado">
                  <RetratoPersonagem personagemId={carta.tagsOcultas.declaranteId} tamanho={52} className="block" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-tinta">{declarante ? declarante.nome : 'Declarante incerto'}</p>
                  <p className="text-tinta font-serif italic text-sm mt-1 leading-relaxed">“{carta.textoDisplay}”</p>
                  <p className="text-tinta-clara text-sm mt-1">
                    Faixa declarada:{' '}
                    {formatDeclaracao(carta.tagsOcultas.horaInicioDeclarada, carta.tagsOcultas.horaFimDeclarada)}.
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-6 text-stone-400 italic font-serif text-xs leading-relaxed">
        Este painel registra o que foi declarado, tal como foi declarado. Cotejar cada faixa com a
        Janela da Morte é ofício de quem constrói a acusação.
      </p>
    </Overlay>
  );
}
