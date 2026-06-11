import { useJogo } from '../store/jogo.js';
import { LOCALIDADES } from '../data/localidades.js';
import CartaMesa from './CartaMesa.jsx';
import RelogioBolso from './RelogioBolso.jsx';
import EventoLocalidade from './EventoLocalidade.jsx';
import Caderneta from './Caderneta.jsx';
import ModalGlossario from './ModalGlossario.jsx';
import GavetaCronos from './GavetaCronos.jsx';
import GavetaAitiov from './GavetaAitiov.jsx';
import GavetaNexo from './GavetaNexo.jsx';
import PainelAlibis from './PainelAlibis.jsx';
import QuadroRevelacoes from './QuadroRevelacoes.jsx';
import MonologoFinal from './MonologoFinal.jsx';

const ROTULOS_DOMINIO = {
  temporal: 'Temporal',
  causal: 'Causal',
  ambiental: 'Ambiental',
  comportamental: 'Comportamental',
  vestigio: 'Vestígio',
};

const GAVETAS = [
  { id: 'cronos', nome: 'Cronos', pilar: 'Quando' },
  { id: 'aitiov', nome: 'Aitiov', pilar: 'Como' },
  { id: 'nexo', nome: 'Nexo', pilar: 'Presença' },
];

// Posições de repouso na superfície, antes de o jogador arrastar.
function posicaoPadraoLocalidade(indice) {
  return { x: 16 + (indice % 6) * 170, y: 12 + Math.floor(indice / 6) * 120 };
}
function posicaoPadraoCarta(indice) {
  return { x: 16 + (indice % 5) * 190, y: 150 + Math.floor(indice / 5) * 130 };
}

// O hub permanente (§5). O jogador nunca sai desta tela: eventos,
// gavetas e painéis abrem como overlays e a mesa apenas se desfoca.
export default function Escrivaninha() {
  const overlay = useJogo((s) => s.overlay);
  const abrirOverlay = useJogo((s) => s.abrirOverlay);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const posicoesCartas = useJogo((s) => s.posicoesCartas);
  const gavetasDesbloqueadas = useJogo((s) => s.gavetasDesbloqueadas);

  const mesaDesfocada = overlay !== null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* A parede: Quadro de Revelações */}
      <div
        className={`flex justify-center py-3 bg-stone-950 border-b border-stone-900 transition-all duration-300 ${
          mesaDesfocada ? 'opacity-30 blur-[6px] pointer-events-none' : ''
        }`}
      >
        <button
          onClick={() => abrirOverlay('quadro')}
          className="px-8 py-2 border border-amber-900/60 bg-stone-900 rounded-sm text-amber-200 font-serif tracking-[0.2em] text-sm hover:bg-stone-800"
        >
          QUADRO DE REVELAÇÕES
        </button>
      </div>

      {/* A mesa (superfície livre + gavetas + painéis) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          mesaDesfocada ? 'opacity-30 blur-[6px] pointer-events-none' : ''
        }`}
      >
        <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900/60 to-stone-950 min-h-[440px]">
          <RelogioBolso />

          {/* Localidades são cartas na superfície (§5) */}
          {LOCALIDADES.map((loc, i) => (
            <CartaMesa
              key={loc.id}
              id={`loc_${loc.id}`}
              pos={posicoesCartas[`loc_${loc.id}`] || posicaoPadraoLocalidade(i)}
              aoClicar={() => abrirOverlay('localidade', loc.id)}
            >
              <div className="w-40 bg-stone-900 border border-amber-900/60 rounded-sm px-3 py-3 hover:border-amber-700">
                <p className="text-amber-900 text-[10px] tracking-[0.25em] uppercase">
                  {loc.id.startsWith('interrogatorio') ? 'Interrogar' : 'Examinar'}
                </p>
                <p className="font-serif text-amber-200 mt-1 leading-snug">{loc.rotuloMesa}</p>
              </div>
            </CartaMesa>
          ))}

          {/* Cartas extraídas e registradas */}
          {cartasRegistradas.map((carta, i) => (
            <CartaMesa
              key={carta.id}
              id={carta.id}
              pos={posicoesCartas[carta.id] || posicaoPadraoCarta(i)}
            >
              <div
                className="w-44 bg-stone-900 border border-stone-700 rounded-sm px-3 py-3 hover:border-stone-500"
                title={carta.descricao}
              >
                <p className="text-stone-600 text-[10px] tracking-[0.2em] uppercase">
                  {ROTULOS_DOMINIO[carta.tagsOcultas.dominio]}
                </p>
                <p className="font-serif text-stone-200 text-sm mt-1 leading-snug">{carta.textoDisplay}</p>
                <p className="text-amber-200/80 text-xs mt-2 italic leading-snug">§ {carta.termoCarimbo}</p>
              </div>
            </CartaMesa>
          ))}
        </div>

        {/* As três gavetas (§7) */}
        <div className="grid grid-cols-3 border-t border-stone-900">
          {GAVETAS.map((g) => {
            const aberta = gavetasDesbloqueadas.includes(g.id);
            return (
              <button
                key={g.id}
                disabled={!aberta}
                onClick={() => abrirOverlay('gaveta', g.id)}
                className={`py-4 border-r border-stone-900 last:border-r-0 text-center ${
                  aberta ? 'bg-stone-900/60 hover:bg-stone-800' : 'bg-stone-950 cursor-not-allowed'
                }`}
              >
                <p className={`font-serif tracking-[0.2em] ${aberta ? 'text-amber-200' : 'text-stone-700'}`}>
                  {g.nome.toUpperCase()}
                </p>
                <p className={`text-xs mt-1 ${aberta ? 'text-stone-500' : 'text-stone-800'}`}>
                  {aberta ? g.pilar : '― cerrada ―'}
                </p>
              </button>
            );
          })}
        </div>

        {/* Painéis de consulta — custo zero */}
        <div className="flex justify-center gap-3 py-3 bg-stone-950 border-t border-stone-900">
          <BotaoPainel rotulo="Caderneta" aoClicar={() => abrirOverlay('caderneta')} />
          <BotaoPainel rotulo="Painel de Álibis" aoClicar={() => abrirOverlay('alibis')} />
          <BotaoPainel rotulo="Glossário" aoClicar={() => abrirOverlay('glossario')} />
        </div>
      </div>

      {/* Overlays — a mesa nunca sai do DOM */}
      {overlay?.tipo === 'localidade' && <EventoLocalidade localidadeId={overlay.id} />}
      {overlay?.tipo === 'caderneta' && <Caderneta />}
      {overlay?.tipo === 'glossario' && <ModalGlossario />}
      {overlay?.tipo === 'alibis' && <PainelAlibis />}
      {overlay?.tipo === 'gaveta' && overlay.id === 'cronos' && <GavetaCronos />}
      {overlay?.tipo === 'gaveta' && overlay.id === 'aitiov' && <GavetaAitiov />}
      {overlay?.tipo === 'gaveta' && overlay.id === 'nexo' && <GavetaNexo />}
      {overlay?.tipo === 'quadro' && <QuadroRevelacoes />}
      {overlay?.tipo === 'monologo' && <MonologoFinal />}
    </div>
  );
}

function BotaoPainel({ rotulo, aoClicar }) {
  return (
    <button
      onClick={aoClicar}
      className="px-4 py-2 border border-stone-800 rounded-sm text-stone-400 text-sm hover:text-amber-200 hover:border-amber-900"
    >
      {rotulo}
    </button>
  );
}
