import { lazy, Suspense, useMemo } from 'react';
import { useJogo } from '../store/jogo.js';
import { custoViagem } from '../data/mapa.js';
import { webglDisponivel, modoFlat } from '../logic/webgl.js';
import { tocarSom } from '../som.js';
import RelogioBolso from './RelogioBolso.jsx';
import MesaLocalidades2D from './MesaLocalidades2D.jsx';
import Cena3DBoundary from './Cena3DBoundary.jsx';
import EventoLocalidade from './EventoLocalidade.jsx';
import InterrogatorioDialogo from './InterrogatorioDialogo.jsx';
import FichaEvidencia from './FichaEvidencia.jsx';
import { obterDialogo } from '../data/dialogos.js';
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
  const fichaAberta = useJogo((s) => s.fichaAberta);

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
      {/* A parede: reboco escuro acima da mesa, com o fio de latão onde
          ela encontra a madeira. A placa de latão aparafusada no centro
          é a peça que importa — CONSTRUIR A ACUSAÇÃO. */}
      <div
        className={`shrink-0 flex justify-center py-2 sm:py-3 bg-gradient-to-b from-[#1c1613] to-[#0f0c09] border-b border-latao/30 transition-all duration-300 ${
          mesaDesfocada ? 'opacity-30 blur-[6px] pointer-events-none' : ''
        }`}
      >
        <button
          onClick={() => abrirOverlay('acusacao')}
          className="placa-latao px-5 sm:px-8 py-2 sm:py-2.5 rounded-sm font-serif tracking-firma text-xs sm:text-sm"
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

        {/* Painéis de consulta — custo zero. A faixa de madeira mais
            escura sob a mesa, separada por um fio de latão sutil. */}
        <div
          className="shrink-0 flex flex-wrap justify-center gap-2 sm:gap-3 px-2 py-2 sm:py-3 bg-gradient-to-b from-[#12100d] to-[#0b0906] border-t border-latao/30"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          <BotaoPainel rotulo="Caderneta" aoClicar={() => abrirOverlay('caderneta')} />
          <BotaoPainel rotulo="Painel de Álibis" aoClicar={() => abrirOverlay('alibis')} />
          <BotaoPainel rotulo="Glossário" aoClicar={() => abrirOverlay('glossario')} />
          <BotaoPainel
            rotulo={somAtivo ? 'Som: aceso' : 'Som: apagado'}
            aoClicar={alternarSom}
            quieto
          />
        </div>
      </div>

      {/* Overlays — a mesa nunca sai do DOM */}
      {/* Nós de interrogatório com árvore de diálogo (§7.1) abrem o
          diálogo ramificado; os demais, a prosa de localidade de sempre. */}
      {overlay?.tipo === 'localidade' &&
        (obterDialogo(overlay.id) ? (
          <InterrogatorioDialogo localidadeId={overlay.id} />
        ) : (
          <EventoLocalidade localidadeId={overlay.id} />
        ))}
      {overlay?.tipo === 'caderneta' && <Caderneta />}
      {overlay?.tipo === 'glossario' && <ModalGlossario />}
      {overlay?.tipo === 'alibis' && <PainelAlibis />}
      {overlay?.tipo === 'acusacao' && <MuralAcusacao />}
      {overlay?.tipo === 'monologo' && <MonologoFinal />}

      {/* A Ficha de Coleta (§6.2) empilha ACIMA de qualquer overlay: a
          evidência se apresenta no ato da extração e ao ser reconsultada. */}
      {fichaAberta && <FichaEvidencia cartaId={fichaAberta} />}
    </div>
  );
}

// Botão da faixa inferior: o botão de mesa padrão. O de som é "quieto"
// (ação de menor peso — não abre painel, só acende e apaga).
function BotaoPainel({ rotulo, aoClicar, quieto = false }) {
  return (
    <button
      onClick={aoClicar}
      className={`botao-mesa ${quieto ? 'botao-mesa--quieto' : ''} text-xs sm:text-sm`}
    >
      {rotulo}
    </button>
  );
}
