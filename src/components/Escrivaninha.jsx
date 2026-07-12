import { lazy, Suspense, useMemo } from 'react';
import { useJogo } from '../store/jogo.js';
import { custoViagem } from '../data/mapa.js';
import { webglDisponivel, modoFlat } from '../logic/webgl.js';
import { tocarSom } from '../som.js';
import RelogioBolso from './RelogioBolso.jsx';
import MesaLocalidades2D from './MesaLocalidades2D.jsx';
import Cena3DBoundary from './Cena3DBoundary.jsx';
import EventoLocalidade from './EventoLocalidade.jsx';
import Caderneta from './Caderneta.jsx';
import ModalGlossario from './ModalGlossario.jsx';
import PainelAlibis from './PainelAlibis.jsx';
import MuralAcusacao from './MuralAcusacao.jsx';
import MonologoFinal from './MonologoFinal.jsx';

// O diorama chega por chunk próprio (three.js pesa): a mesa nunca espera
// o 3D — enquanto o chunk baixa, a grade 2D já é jogável (fallback do
// Suspense), e sem WebGL a grade fica em definitivo.
const DioramaVila = lazy(() => import('./diorama/DioramaVila.jsx'));

// O hub permanente (§5). O jogador nunca sai desta tela: eventos,
// gavetas e painéis abrem como overlays e a mesa apenas se desfoca.
export default function Escrivaninha() {
  const overlay = useJogo((s) => s.overlay);
  const abrirOverlay = useJogo((s) => s.abrirOverlay);
  const viajarPara = useJogo((s) => s.viajarPara);
  const localidadeAtual = useJogo((s) => s.localidadeAtual);
  const somAtivo = useJogo((s) => s.somAtivo);
  const alternarSom = useJogo((s) => s.alternarSom);

  const mesaDesfocada = overlay !== null;

  // Um único handler de viagem serve à maquete 3D e à grade 2D —
  // paridade por construção (o QA joga pelos dois caminhos).
  const aoAbrirNo = (loc) => {
    const custo = localidadeAtual ? custoViagem(localidadeAtual, loc.id) : 0;
    if (custo > 0 && loc.id !== localidadeAtual) tocarSom('sino'); // a viagem tem sino (Q7)
    viajarPara(loc.id);
    abrirOverlay('localidade', loc.id);
  };

  // 3D só com WebGL e fora da rota de escape ?flat=1 (decisão única por sessão).
  const usar3D = useMemo(() => !modoFlat() && webglDisponivel(), []);

  const mesa2D = <MesaLocalidades2D aoAbrirNo={aoAbrirNo} />;

  return (
    <div className="altura-tela flex flex-col">
      {/* A parede: Quadro de Revelações */}
      <div
        className={`shrink-0 flex justify-center py-2 sm:py-3 bg-stone-950 border-b border-stone-900 transition-all duration-300 ${
          mesaDesfocada ? 'opacity-30 blur-[6px] pointer-events-none' : ''
        }`}
      >
        <button
          onClick={() => abrirOverlay('acusacao')}
          className="px-5 sm:px-8 py-2 border border-amber-900/60 bg-stone-900 rounded-sm text-amber-200 font-serif tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm transition-all duration-gesto hover:bg-stone-800 hover:border-amber-700 hover:shadow-vela"
        >
          CONSTRUIR A ACUSAÇÃO
        </button>
      </div>

      {/* A mesa (superfície livre + gavetas + painéis) */}
      <div
        className={`flex-1 min-h-0 flex flex-col transition-all duration-300 ${
          mesaDesfocada ? 'opacity-30 blur-[6px] pointer-events-none' : ''
        }`}
      >
        <div className="relative flex-1 min-h-0 mesa-madeira">
          <div className="luz-de-vela" aria-hidden />
          <RelogioBolso />

          {usar3D ? (
            <Cena3DBoundary fallback={mesa2D}>
              <Suspense fallback={mesa2D}>
                <div className="absolute inset-0 flex flex-col">
                  {/* A maquete da vila, pousada no alto da mesa */}
                  <div className="shrink-0 relative h-[44%] min-h-[210px] border-b border-black/40">
                    <DioramaVila aoAbrirNo={aoAbrirNo} />
                  </div>
                  {/* A bandeja de cartas, rolável, sob a maquete */}
                  <div className="relative flex-1 min-h-0">
                    <MesaLocalidades2D aoAbrirNo={aoAbrirNo} comDiorama />
                  </div>
                </div>
              </Suspense>
            </Cena3DBoundary>
          ) : (
            mesa2D
          )}
        </div>

        {/* Painéis de consulta — custo zero */}
        <div
          className="shrink-0 flex flex-wrap justify-center gap-2 sm:gap-3 px-2 py-2 sm:py-3 bg-stone-950 border-t border-stone-900"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          <BotaoPainel rotulo="Caderneta" aoClicar={() => abrirOverlay('caderneta')} />
          <BotaoPainel rotulo="Painel de Álibis" aoClicar={() => abrirOverlay('alibis')} />
          <BotaoPainel rotulo="Glossário" aoClicar={() => abrirOverlay('glossario')} />
          <BotaoPainel rotulo={somAtivo ? 'Som: aceso' : 'Som: apagado'} aoClicar={alternarSom} />
        </div>
      </div>

      {/* Overlays — a mesa nunca sai do DOM */}
      {overlay?.tipo === 'localidade' && <EventoLocalidade localidadeId={overlay.id} />}
      {overlay?.tipo === 'caderneta' && <Caderneta />}
      {overlay?.tipo === 'glossario' && <ModalGlossario />}
      {overlay?.tipo === 'alibis' && <PainelAlibis />}
      {overlay?.tipo === 'acusacao' && <MuralAcusacao />}
      {overlay?.tipo === 'monologo' && <MonologoFinal />}
    </div>
  );
}

function BotaoPainel({ rotulo, aoClicar }) {
  return (
    <button
      onClick={aoClicar}
      className="px-3 sm:px-4 py-2 border border-stone-800 rounded-sm text-stone-400 text-xs sm:text-sm transition-colors duration-gesto hover:text-amber-200 hover:border-amber-900 hover:bg-stone-900/60"
    >
      {rotulo}
    </button>
  );
}
