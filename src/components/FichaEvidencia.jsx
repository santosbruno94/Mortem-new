import { useEffect } from 'react';
import { useJogo } from '../store/jogo.js';
import { formatRelogio } from '../logic/tempo.js';
import { verbeteParaCarta } from '../data/glossario.js';
import { tocarSom } from '../som.js';
import { resolverAsset } from '../logic/assets.js';
import Overlay from './Overlay.jsx';

// Rótulo do domínio na tarja da etiqueta (mesma nomenclatura da mesa).
const ROTULOS_DOMINIO = {
  temporal: 'Temporal',
  causal: 'Causal',
  ambiental: 'Ambiental',
  comportamental: 'Comportamental',
  vestigio: 'Vestígio',
};

// A FICHA DE COLETA (§6.2): a evidência se apresenta no ato. Ao extrair um
// termo — ou ao clicar numa carta já pousada —, a ficha sobe por cima como
// uma etiqueta de exposição/laudo de época e mostra o que a carta É:
// a observação crua, o exame de perto, a fala do legista (quando houver),
// o carimbo, a hora do registro e a ponte para o Glossário. Fechar
// ("Arquivar na mesa") devolve a carta à superfície. Consulta — custo zero.
export default function FichaEvidencia({ cartaId }) {
  const carta = useJogo((s) => s.cartasRegistradas.find((c) => c.id === cartaId));
  const fecharFicha = useJogo((s) => s.fecharFicha);
  const abrirOverlay = useJogo((s) => s.abrirOverlay);
  // Só a primeira observação do caso abre ficha por conta própria (Onda 4):
  // esta linha-tutorial avisa que as próximas pousam sozinhas.
  const primeiraDoCaso = useJogo((s) => s.cartasRegistradas.length === 1);

  // Som de papel na ABERTURA da ficha (a extração já não o toca — sem duplicar).
  useEffect(() => {
    tocarSom('papel');
  }, [cartaId]);

  // Carta ainda não registrada (guarda defensiva): nada a exibir.
  if (!carta) return null;

  const verbete = verbeteParaCarta(carta.tagsOcultas);
  const dominio = ROTULOS_DOMINIO[carta.tagsOcultas?.dominio];
  // Slot decorativo "vinheta" (contrato de assets, FASE 2): ornamento por
  // domínio quando houver arte no manifesto; sem arte, resolve para null e a
  // ficha fica idêntica à de hoje (fallback procedural = nenhum enfeite).
  const vinheta = resolverAsset('vinheta', carta.tagsOcultas?.dominio);

  return (
    <Overlay
      titulo={carta.textoDisplay}
      subtitulo="Ficha de coleta"
      largura="max-w-lg"
      marca="ficha"
      nivelZ="z-50"
      aoFechar={fecharFicha}
    >
      <div className="ficha-laudo carta-pergaminho rounded-sm px-5 py-5">
        {/* Tarja de domínio + carimbo: o cabeçalho de laudo */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-tinta-apagada/40 pb-2">
          {dominio && <span className="text-cera text-rotulo uppercase">{dominio}</span>}
          <span className="flex items-baseline gap-2">
            {vinheta && (
              <img src={vinheta} alt="" aria-hidden="true" className="h-4 w-4 self-center opacity-80" />
            )}
            <span className="text-tinta-apagada text-rotulo uppercase">{carta.termoCarimbo}</span>
          </span>
        </div>

        {/* O exame de perto — a prosa que a Caderneta escondia */}
        <p className="text-tinta text-sm font-serif leading-relaxed mt-3">{carta.descricao}</p>

        {/* A fala do legista, quando a carta a tem (regra atual preservada) */}
        {carta.vozMestre && (
          <div className="mt-4 border-l-2 border-cera/60 pl-3">
            <p className="text-tinta-apagada text-rotulo uppercase mb-1">O legista</p>
            <p className="text-tinta-clara font-serif italic text-sm leading-relaxed">
              “{carta.vozMestre}”
            </p>
          </div>
        )}

        {/* Rodapé da etiqueta: a hora do registro e a ponte para o Glossário */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 mt-4 pt-2 border-t border-tinta-apagada/40">
          <p className="text-tinta-apagada text-rotulo uppercase">
            registrado em {formatRelogio(carta.horaRegistro)}
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
      </div>

      {/* Botão único: fechar arquiva a carta na mesa (transição curta) */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        {primeiraDoCaso ? (
          <p className="text-stone-400 text-xs italic font-serif">
            As próximas observações pousarão sozinhas na mesa; clique na carta pousada para
            reler.
          </p>
        ) : (
          <span />
        )}
        <button onClick={fecharFicha} className="botao-mesa text-xs sm:text-sm">
          Arquivar na mesa
        </button>
      </div>
    </Overlay>
  );
}
