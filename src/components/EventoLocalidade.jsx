import { useJogo } from '../store/jogo.js';
import { obterLocalidade } from '../data/localidades.js';
import { obterDefinicaoCarta, resolverEstadoCarta } from '../data/cartas.js';
import { SEED_TUTORIAL } from '../data/seed.js';
import { ipmAtual } from '../logic/tempo.js';
import { interpolar } from '../logic/interpolar.js';
import Overlay from './Overlay.jsx';
import TermometroCorpo from './TermometroCorpo.jsx';

// Evento de localidade (§5): prosa imersiva com termos clicáveis em
// negrito. Clicar no termo extrai a carta com carimbo integrado (§6),
// custando o tempo da carta. O estado dos termos do corpo acompanha a
// degradação (IPM corrente) até o momento da extração.
export default function EventoLocalidade({ localidadeId }) {
  const detective = useJogo((s) => s.detective);
  const horasJogo = useJogo((s) => s.horasJogo);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const extrairCarta = useJogo((s) => s.extrairCarta);

  const localidade = obterLocalidade(localidadeId);
  if (!localidade) return null;
  const ipm = ipmAtual(horasJogo, SEED_TUTORIAL.horasMorteAntesChegada);

  function renderTermo(cartaId, chave) {
    const definicao = obterDefinicaoCarta(cartaId);
    if (!definicao) return <span key={chave}>{cartaId}</span>;
    const registrada = cartasRegistradas.some((c) => c.id === cartaId);
    const estado = resolverEstadoCarta(definicao, ipm);
    if (registrada) {
      return (
        <span key={chave} className="termo-extraido" title="Já registrado na mesa">
          {estado.textoDisplay.toLowerCase()}
        </span>
      );
    }
    return (
      <span
        key={chave}
        className="termo-clicavel"
        title={`Extrair e registrar (${definicao.custoTempo}h)`}
        onClick={() => extrairCarta(cartaId)}
      >
        {estado.textoDisplay.toLowerCase()}
      </span>
    );
  }

  function renderParagrafo(texto, indice) {
    const partes = interpolar(texto, detective).split(/(\[\[\w+\]\])/g);
    return (
      <p key={indice} className="text-stone-300 leading-relaxed">
        {partes.map((parte, i) => {
          const marcador = parte.match(/^\[\[(\w+)\]\]$/);
          return marcador ? renderTermo(marcador[1], `${indice}_${i}`) : <span key={`${indice}_${i}`}>{parte}</span>;
        })}
      </p>
    );
  }

  return (
    <Overlay titulo={interpolar(localidade.titulo, detective)} subtitulo={localidade.subtitulo}>
      <div className="space-y-4">{localidade.prosa.map(renderParagrafo)}</div>
      {localidade.acoesEspeciais.includes('termometro') && <TermometroCorpo />}
      <p className="mt-6 text-stone-600 text-xs tracking-wide">
        Termos em negrito podem ser extraídos para a mesa — a extração consome o tempo indicado.
      </p>
    </Overlay>
  );
}
