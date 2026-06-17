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
          {estado.textoDisplay}
        </span>
      );
    }
    return (
      <span
        key={chave}
        className="termo-clicavel"
        title="Examinar e registrar (não custa tempo)"
        onClick={() => extrairCarta(cartaId)}
      >
        {estado.textoDisplay}
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
      {localidade.id === 'corpo' && <NotaFrescor ipm={ipm} />}
      {localidade.acoesEspeciais.includes('termometro') && <TermometroCorpo />}
      <p className="mt-6 text-stone-600 text-xs tracking-wide">
        Termos em negrito são examinados e registrados na mesa — examinar não custa tempo; o relógio só corre quando você viaja.
      </p>
    </Overlay>
  );
}

// Legibilidade do perecível (telegrafia + anúncio): o corpo avisa, em fala
// concreta, que a leitura do tempo se esvai — antes de se perder, e no
// momento em que se perde. Calculado do IPM corrente; nenhuma regra depende.
function NotaFrescor({ ipm }) {
  let texto;
  if (ipm <= 24) {
    texto =
      'O corpo ainda guarda a hora com nitidez — mas não vai durar: a rigidez e o calor se desfazem com as horas. O que se quiser datar com precisão, date cedo.';
  } else if (ipm <= 36) {
    texto =
      'A rigidez já cede e o corpo esfria: a leitura do tempo perde o fio. Ainda dá para datar, porém com margem mais larga.';
  } else {
    texto =
      'O corpo afrouxou de todo e igualou o frio da sala: a hora da morte agora só se lê em dias, não em horas. A precisão, essa já se foi — mas o livor fixo ainda crava que foi há mais de meio dia.';
  }
  return (
    <p className="mt-4 text-amber-200/70 text-xs italic leading-relaxed border-l border-amber-900/40 pl-3">
      {texto}
    </p>
  );
}
