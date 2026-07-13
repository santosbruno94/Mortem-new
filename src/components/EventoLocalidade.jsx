import { lazy, Suspense } from 'react';
import { useJogo } from '../store/jogo.js';
import { webglDisponivel, modoFlat } from '../logic/webgl.js';
import Cena3DBoundary from './Cena3DBoundary.jsx';
import { obterLocalidade } from '../data/localidades.js';
import { obterDefinicaoCarta, resolverEstadoCarta } from '../data/cartas.js';
import { SEED_TUTORIAL } from '../data/seed.js';
import { ipmAtual } from '../logic/tempo.js';
import { interpolar } from '../logic/interpolar.js';
import { lerCorpo, falaDoMestre } from '../logic/falaDoMestre.js';
import { tocarSom } from '../som.js';
import Overlay from './Overlay.jsx';
import TermometroCorpo from './TermometroCorpo.jsx';
import RetratoPersonagem from './RetratoPersonagem.jsx';
import { PERSONAGEM_POR_LOCALIDADE } from '../data/aparencias.js';

// O exame 3D chega pelo mesmo chunk do three (lazy): a prosa nunca
// espera o canvas — ela É o caminho canônico de extração.
const CorpoCanvas = lazy(() => import('./corpo3d/CorpoCanvas.jsx'));

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
        <span key={chave} data-carta-id={cartaId} className="termo-extraido" title="Já registrado na mesa">
          {estado.textoDisplay}
        </span>
      );
    }
    return (
      <span
        key={chave}
        data-carta-id={cartaId}
        className="termo-clicavel"
        title="Examinar e registrar (não custa tempo)"
        onClick={() => {
          tocarSom('papel');
          extrairCarta(cartaId);
        }}
      >
        {estado.textoDisplay}
      </span>
    );
  }

  function renderParagrafo(texto, indice) {
    const partes = interpolar(texto, detective).split(/(\[\[\w+\]\])/g);
    return (
      // A prosa imersiva pousa sobre o couro escuro: serifada e legível.
      <p key={indice} className="font-serif text-stone-300 leading-relaxed">
        {partes.map((parte, i) => {
          const marcador = parte.match(/^\[\[(\w+)\]\]$/);
          return marcador ? renderTermo(marcador[1], `${indice}_${i}`) : <span key={`${indice}_${i}`}>{parte}</span>;
        })}
      </p>
    );
  }

  const personagemDaCena = PERSONAGEM_POR_LOCALIDADE[localidade.id];
  const ehCorpo = localidade.id === 'corpo';
  const corpo3D = ehCorpo && !modoFlat() && webglDisponivel();

  // Prosa condicional: parágrafos que só entram quando TODAS as cartas
  // exigidas já estão na mesa (ex.: o confronto da segunda visita ao réu,
  // depois de colhido o registro que o desmente). Camada narrativa — o
  // motor nunca lê; a condição usa só ids de carta registrada.
  const paragrafosCondicionais = (localidade.prosaCondicional || [])
    .filter((bloco) => bloco.requerCartas.every((id) => cartasRegistradas.some((c) => c.id === id)))
    .flatMap((bloco) => bloco.paragrafos);

  // Contador de esgotamento (regalia do caso-escola): quantas observações
  // esta localidade oferece e quantas já estão na mesa. O procedural pode
  // omitir — a contagem é leitura dos marcadores [[id]] da prosa, não regra.
  const idsExtraiveis = [
    ...new Set(
      localidade.prosa
        .flatMap((p) => [...p.matchAll(/\[\[(\w+)\]\]/g)].map((m) => m[1]))
        .concat(localidade.acoesEspeciais.includes('termometro') ? ['ev_algor'] : [])
    ),
  ];
  const nRegistradas = idsExtraiveis.filter((id) => cartasRegistradas.some((c) => c.id === id)).length;

  const prosaEExames = (
    <>
      {/* Retrato de quem recebe o perito — camada visual, decorativa */}
      {personagemDaCena && (
        <div className="float-right ml-4 mb-2 border border-latao/40 rounded-sm shadow-pousado">
          <RetratoPersonagem personagemId={personagemDaCena} tamanho={84} className="block" />
        </div>
      )}
      <div className="space-y-4">
        {localidade.prosa.map(renderParagrafo)}
        {paragrafosCondicionais.map((texto, i) => renderParagrafo(texto, `cond_${i}`))}
      </div>
      {ehCorpo && <FalaDoLegista cartas={cartasRegistradas} />}
      {ehCorpo && <NotaFrescor ipm={ipm} />}
      {localidade.acoesEspeciais.includes('termometro') && <TermometroCorpo />}
      {idsExtraiveis.length > 0 && (
        <p className="mt-6 text-stone-400 text-xs font-serif tracking-wide">
          § {nRegistradas} de {idsExtraiveis.length} observações registradas aqui.
        </p>
      )}
      <p className="mt-2 text-stone-400 text-xs italic font-serif tracking-wide">
        Termos em negrito são examinados e registrados na mesa — examinar não custa tempo; o relógio só corre quando você viaja.
      </p>
    </>
  );

  return (
    <Overlay
      titulo={interpolar(localidade.titulo, detective)}
      subtitulo={localidade.subtitulo}
      largura={corpo3D ? 'max-w-5xl' : 'max-w-2xl'}
    >
      {corpo3D ? (
        // O exame em dois painéis: a mesa de exame 3D acompanha a prosa.
        // O 3D é redundância deliberada — clicar no corpo extrai as
        // MESMAS cartas dos termos em negrito, que continuam valendo.
        <div className="lg:grid lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-6 lg:items-start">
          <div className="h-48 sm:h-56 lg:h-80 lg:sticky lg:top-2 mb-4 lg:mb-0 rounded-sm border border-stone-800 bg-stone-950/60 overflow-hidden">
            <Cena3DBoundary fallback={<div className="h-full grid place-items-center text-stone-400 text-xs italic font-serif">— a mesa de exame segue na prosa —</div>}>
              <Suspense fallback={<div className="h-full grid place-items-center text-stone-400 text-xs italic font-serif">a mesa de exame prepara-se…</div>}>
                <CorpoCanvas ipm={ipm} />
              </Suspense>
            </Cena3DBoundary>
          </div>
          <div>{prosaEExames}</div>
        </div>
      ) : (
        prosaEExames
      )}
    </Overlay>
  );
}

// A leitura forense FALADA pelo mestre/legista (§4): some o mostrador das
// antigas gavetas; a interpretação vem por um personagem, em fala natural,
// e CRESCE conforme o jogador examina (pull — responde ao que foi visto).
// No procedural não há vozMestre nas cartas: este bloco fica vazio e o
// jogador, já perito, lê o corpo por conta própria.
// Visual: aparte com filete de latão à esquerda e fala em serif itálico.
function FalaDoLegista({ cartas }) {
  const asides = cartas.filter((c) => c.localidade === 'corpo' && c.vozMestre);
  const { tempo, causa } = falaDoMestre(lerCorpo(cartas));
  if (asides.length === 0 && !tempo && !causa) return null;
  return (
    <div className="mt-5 border-l-2 border-latao/70 pl-4 space-y-2">
      <p className="text-rotulo uppercase text-latao-claro/70">O legista, examinando</p>
      {asides.map((c) => (
        <p key={c.id} className="font-serif italic text-stone-200 text-sm leading-relaxed">“{c.vozMestre}”</p>
      ))}
      {(tempo || causa) && (
        <div className="pt-2 mt-1 border-t border-latao/30 space-y-1">
          {tempo && <p className="font-serif italic text-amber-100/90 text-sm leading-relaxed">“{tempo}”</p>}
          {causa && <p className="font-serif italic text-amber-100/90 text-sm leading-relaxed">“{causa}”</p>}
        </div>
      )}
    </div>
  );
}

// Legibilidade do perecível (telegrafia + anúncio): o corpo avisa, em fala
// concreta, que a leitura do tempo se esvai — antes de se perder, e no
// momento em que se perde. Calculado do IPM corrente; nenhuma regra depende.
// Visual: pequena etiqueta de pergaminho pousada sob a prosa.
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
    <div className="mt-4 carta-pergaminho rounded-sm px-3 py-2">
      <p className="text-tinta-clara text-sm font-serif italic leading-relaxed">{texto}</p>
    </div>
  );
}
