import { lazy, Suspense, useMemo } from 'react';
import { useJogo } from '../store/jogo.js';
import { custoViagem, obterCaso, obterDialogo } from '../data/pacote_caso.js';
import { POSICOES_DIORAMA } from '../data/mapa_espacial.js';
import { webglDisponivel, modoFlat } from '../logic/webgl.js';
import { tocarSom } from '../som.js';
import RelogioBolso from './RelogioBolso.jsx';
import MesaLocalidades2D from './MesaLocalidades2D.jsx';
import Cena3DBoundary from './Cena3DBoundary.jsx';
import EventoLocalidade from './EventoLocalidade.jsx';
import InterrogatorioDialogo from './InterrogatorioDialogo.jsx';
import FichaEvidencia from './FichaEvidencia.jsx';
import AvisoCartaPousada from './AvisoCartaPousada.jsx';
import AvisoAnotacaoMural from './AvisoAnotacaoMural.jsx';
import Caderneta from './Caderneta.jsx';
import ModalGlossario from './ModalGlossario.jsx';
import PainelAlibis from './PainelAlibis.jsx';
import MuralAcusacao from './MuralAcusacao.jsx';
import MonologoFinal from './MonologoFinal.jsx';
import FichaPessoa from './FichaPessoa.jsx';

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
  const glossarioAberto = useJogo((s) => s.glossarioAberto);
  const abrirGlossario = useJogo((s) => s.abrirGlossario);

  const mesaDesfocada = overlay !== null || glossarioAberto !== null;

  // 3D só com WebGL e fora da rota de escape ?flat=1 (decisão única por
  // sessão) — e só quando a maquete CONHECE todos os nós do caso (o caso
  // gerado não tem posições no diorama do caso-escola: cai na grade 2D,
  // que é o fallback obrigatório de todo ponto 3D).
  const usar3D = useMemo(
    () =>
      !modoFlat() &&
      webglDisponivel() &&
      obterCaso().nosMapa.every((n) => POSICOES_DIORAMA[n.id]),
    []
  );

  // Um único handler de viagem serve à maquete 3D e à grade 2D —
  // paridade por construção (o QA joga pelos dois caminhos). Na maquete 3D,
  // uma viagem com custo real ganha um BEAT (~0,7s): o pino desliza o
  // trajeto e a luz vira com a hora antes de o local abrir (a mesa só
  // desfoca ao abrir o overlay). Viagem de 0h e o modo 2D abrem no ato.
  const aoAbrirNo = (loc) => {
    const custo = localidadeAtual ? custoViagem(localidadeAtual, loc.id) : 0;
    const viagemReal = custo > 0 && loc.id !== localidadeAtual;
    if (viagemReal) tocarSom('sino'); // a viagem tem sino (Q7)
    viajarPara(loc.id);
    if (usar3D && viagemReal) {
      setTimeout(() => abrirOverlay('localidade', loc.id), 720);
    } else {
      abrirOverlay('localidade', loc.id);
    }
  };

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
              {(aoPerderContexto) => (
                <Suspense fallback={mesa2D}>
                  <div className="absolute inset-0 flex flex-col">
                    {/* A maquete da vila, pousada no alto da mesa. Em tela
                        larga, a maquete cresce (lg:h-[52%]) e come o vão
                        escuro do meio (P3). Em tela estreita a maquete rola
                        na horizontal (largura mínima de 620px) com um
                        sombreado na borda como convite de rolagem (P2). */}
                    <div className="shrink-0 relative h-[44%] lg:h-[52%] min-h-[210px] border-b border-black/40 diorama-mesa-fundo">
                      <div className="absolute inset-0 overflow-x-auto overflow-y-hidden sm:overflow-hidden">
                        <div className="h-full min-w-[620px] sm:min-w-0">
                          <DioramaVila aoAbrirNo={aoAbrirNo} aoPerderContexto={aoPerderContexto} />
                        </div>
                      </div>
                      <div
                        className="sm:hidden pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/60 to-transparent"
                        aria-hidden
                      />
                    </div>
                    {/* A bandeja de cartas, rolável, sob a maquete. Em telas
                        altas sobra tampo (P3/4.3): uma atmosfera de vela na
                        beira baixa faz o vão ler como mesa acesa, não vazio. */}
                    <div className="relative flex-1 min-h-0">
                      <div aria-hidden className="mesa-desk-atmosfera pointer-events-none absolute inset-0" />
                      <MesaLocalidades2D aoAbrirNo={aoAbrirNo} comDiorama />
                    </div>
                  </div>
                </Suspense>
              )}
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
          <BotaoPainel rotulo="Glossário" aoClicar={() => abrirGlossario()} />
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
      {/* Diálogo embutido (Onda 6): pessoa dentro de um lugar — a árvore
          abre por chave própria (dialogo_walter, dialogo_davey), sem nó
          no mapa; fechar devolve à mesa (reabrir o lugar custa 0h). */}
      {overlay?.tipo === 'dialogo' && <InterrogatorioDialogo dialogoId={overlay.id} />}
      {overlay?.tipo === 'caderneta' && <Caderneta />}
      {overlay?.tipo === 'alibis' && <PainelAlibis />}
      {overlay?.tipo === 'acusacao' && <MuralAcusacao />}
      {overlay?.tipo === 'monologo' && <MonologoFinal />}
      {overlay?.tipo === 'fichapessoa' && <FichaPessoa suspeitoId={overlay.id} />}

      {/* A Ficha de Coleta (§6.2) empilha ACIMA de qualquer overlay: a
          primeira evidência do caso se apresenta nela; as demais, ao ser
          reconsultadas (clique na carta pousada ou no aviso de pouso). */}
      {fichaAberta && <FichaEvidencia cartaId={fichaAberta} />}

      {/* O Glossário (§9) é camada própria ACIMA da ficha (P0 §3 do playtest
          de 17/07): a pilha é sempre base < ficha < glossário — abrir o
          verbete pela ficha não descarta o overlay que estava por baixo. */}
      {glossarioAberto !== null && <ModalGlossario />}

      {/* O aviso de pouso (Onda 4): a etiqueta que anuncia a observação
          registrada deslizando para a mesa — clicável para abrir a ficha. */}
      <AvisoCartaPousada />

      {/* O aviso de anotação ao mural (P1 §7): o confronto em cena que
          desmente um paradeiro anota a ligação sozinho — a etiqueta no
          rodapé é a cerimônia que faltava (no canto oposto ao do pouso). */}
      <AvisoAnotacaoMural />
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
