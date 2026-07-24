import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { custoViagem, obterCaso, obterDialogo, obterMaquete } from '../data/pacote_caso.js';
import { POSICOES_DIORAMA } from '../data/mapa_espacial.js';
import { webglDisponivel, modoFlat } from '../logic/webgl.js';
import { BEAT_VIAGEM_MS } from '../logic/beat_viagem.js';
import { tocarSom } from '../som.js';
import RelogioBolso from './RelogioBolso.jsx';
import MesaLocalidades2D from './MesaLocalidades2D.jsx';
import PranchaVila from './prancha/PranchaVila.jsx';
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
// o 3D — enquanto o chunk baixa, a PRANCHA já é jogável (fallback do
// Suspense), e sem WebGL a prancha fica em definitivo. Desde a OS Prancha
// da Vila (E1) o import só acontece se o jogador PEDIR a maquete: numa
// sessão que nunca abre "A maquete", nenhum chunk de three baixa.
const DioramaVila = lazy(() => import('./diorama/DioramaVila.jsx'));

// A vista da mesa, lembrada entre sessões. Chave NOVA (nenhuma chave
// existente é tocada); ausente ou ilegível, o padrão é a prancha.
const CHAVE_VISTA = 'mortem-vista-da-mesa';
function lerVistaSalva() {
  try {
    return window.localStorage.getItem(CHAVE_VISTA) === 'maquete' ? 'maquete' : 'prancha';
  } catch {
    return 'prancha';
  }
}
function gravarVista(vista) {
  try {
    window.localStorage.setItem(CHAVE_VISTA, vista);
  } catch {
    // armazenamento indisponível (aba privada): a preferência vale só a sessão
  }
}

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

  // O ESPAÇO do caso é conhecido? A fonte é dupla (OS da vila na mesa): o
  // caso GERADO traz a própria vila no campo visual `maquete` do pacote; o
  // caso-escola usa o mapa espacial estático. Nó sem posição em qualquer
  // fonte ⇒ nem prancha nem maquete: a grade 2D de cartas, que segue sendo
  // o fallback derradeiro.
  const temEspaco = useMemo(() => {
    const posicoes = obterMaquete()?.posicoes || POSICOES_DIORAMA;
    return obterCaso().nosMapa.every((n) => posicoes[n.id]);
  }, []);

  // A maquete 3D DISPONÍVEL (deixou de decidir sozinha qual vista sobe —
  // OS Prancha da Vila, E1): só com WebGL, fora da rota de escape ?flat=1
  // e com o espaço do caso conhecido.
  const tresDDisponivel = useMemo(
    () => temEspaco && !modoFlat() && webglDisponivel(),
    [temEspaco]
  );
  const [vistaEscolhida, setVistaEscolhida] = useState(lerVistaSalva);
  // Contexto WebGL perdido em runtime: a maquete cai de vez nesta sessão e
  // a prancha assume — o alternador diz por quê, em vez de oferecer um
  // botão que não faz nada.
  const [contextoPerdido, setContextoPerdido] = useState(false);
  const maqueteAberta = tresDDisponivel && !contextoPerdido && vistaEscolhida === 'maquete';
  const escolherVista = useCallback((vista) => {
    setVistaEscolhida(vista);
    gravarVista(vista);
  }, []);
  const motivoSemMaquete = !temEspaco
    ? 'este caso não traz maquete'
    : modoFlat()
      ? 'a rota ?flat=1 dispensa o 3D'
      : contextoPerdido
        ? 'o 3D caiu nesta sessão'
        : 'sem WebGL neste navegador';

  // O beat da viagem 3D pendente: dois cliques rápidos em nós distintos não
  // podem enfileirar duas aberturas (o overlay do primeiro abriria e fecharia
  // por cima do segundo). O timeout corrente limpa-se no próximo clique e no
  // desmonte.
  const beatViagemRef = useRef(null);
  const destinoDoBeatRef = useRef(null);
  useEffect(() => () => clearTimeout(beatViagemRef.current), []);

  // Cortar o beat por toque (E3): abre o local no ato. Não decide nada — a
  // hora já foi paga no clique; cortar só antecipa a abertura, e o estado
  // final é idêntico ao de deixar o beat terminar.
  const cortarBeat = useCallback(() => {
    if (!beatViagemRef.current) return;
    clearTimeout(beatViagemRef.current);
    beatViagemRef.current = null;
    if (destinoDoBeatRef.current) abrirOverlay('localidade', destinoDoBeatRef.current);
  }, [abrirOverlay]);

  // Um único handler de viagem serve à prancha, à maquete 3D e à grade 2D —
  // paridade por construção (o QA joga pelos três caminhos). Na maquete 3D,
  // uma viagem com custo real ganha um BEAT (~0,7s): o pino desliza o
  // trajeto e a luz vira com a hora antes de o local abrir (a mesa só
  // desfoca ao abrir o overlay). Viagem de 0h e as vistas 2D abrem no ato.
  // useCallback: a referência estável permite o memo do DioramaVila —
  // sem ela, cada mudança de store re-renderizava a árvore r3f inteira.
  const aoAbrirNo = useCallback(
    (loc) => {
      const custo = localidadeAtual ? custoViagem(localidadeAtual, loc.id) : 0;
      const viagemReal = custo > 0 && loc.id !== localidadeAtual;
      if (viagemReal) tocarSom('sino'); // a viagem tem sino (Q7)
      viajarPara(loc.id);
      clearTimeout(beatViagemRef.current);
      // O beat só existe onde há mapa desenhado (prancha ou maquete): na
      // grade 2D de cartas não há trajeto a percorrer, e o local abre no ato.
      if (viagemReal && temEspaco) {
        destinoDoBeatRef.current = loc.id;
        beatViagemRef.current = setTimeout(() => {
          beatViagemRef.current = null;
          abrirOverlay('localidade', loc.id);
        }, BEAT_VIAGEM_MS);
      } else {
        abrirOverlay('localidade', loc.id);
      }
    },
    [localidadeAtual, temEspaco, viajarPara, abrirOverlay]
  );

  const mesa2D = <MesaLocalidades2D aoAbrirNo={aoAbrirNo} />;

  // A vista PADRÃO: a prancha de gravura no alto da mesa e a bandeja de
  // fichas por baixo — o mesmo desenho de banda que a maquete ocupava.
  const vistaPrancha = (
    <div className="absolute inset-0 flex flex-col">
      <div className="shrink-0 relative h-[54%] lg:h-[52%] min-h-[300px] border-b border-black/40 prancha-mesa-fundo">
        <PranchaVila aoAbrirNo={aoAbrirNo} aoCortarBeat={cortarBeat} />
      </div>
      <div className="relative flex-1 min-h-0">
        <div aria-hidden className="mesa-desk-atmosfera pointer-events-none absolute inset-0" />
        <MesaLocalidades2D aoAbrirNo={aoAbrirNo} comDiorama />
      </div>
    </div>
  );

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

          {!temEspaco ? (
            mesa2D
          ) : maqueteAberta ? (
            <Cena3DBoundary fallback={vistaPrancha} aoFalhar={() => setContextoPerdido(true)}>
              {(aoPerderContexto) => (
                <Suspense fallback={vistaPrancha}>
                  <div className="absolute inset-0 flex flex-col">
                    {/* A maquete da vila, pousada no alto da mesa. Em tela
                        larga, a maquete cresce (lg:h-[52%]) e come o vão
                        escuro do meio (P3). Em tela estreita a vila INTEIRA
                        cabe na largura (sem rolagem lateral, nada cortado): a
                        câmara enquadra a tábua toda e o desobstrutor de
                        rótulos (DioramaVila) afasta as etiquetas que se
                        sobreporiam (playtest mobile 24/07/2026). A banda cresce
                        um pouco no celular para o eixo isométrico espalhar os
                        nós na vertical. */}
                    <div className="shrink-0 relative h-[54%] lg:h-[52%] min-h-[300px] border-b border-black/40 diorama-mesa-fundo">
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="h-full w-full">
                          <DioramaVila aoAbrirNo={aoAbrirNo} aoPerderContexto={aoPerderContexto} />
                        </div>
                      </div>
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
            vistaPrancha
          )}
        </div>

        {/* Painéis de consulta — custo zero. A faixa de madeira mais
            escura sob a mesa, separada por um fio de latão sutil. */}
        <div
          className="shrink-0 flex flex-wrap justify-center gap-2 sm:gap-3 px-2 py-2 sm:py-3 bg-gradient-to-b from-[#12100d] to-[#0b0906] border-t border-latao/30"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          {/* O alternador de vista (OS Prancha da Vila, E1): a prancha é o
              padrão; a maquete 3D continua a um clique, e o chunk do three
              só desce se este botão for premido. Sem WebGL, em ?flat=1 ou
              depois de o contexto cair, o botão diz por que não pode. */}
          {temEspaco && (
            <span className="alternador-vista inline-flex items-center gap-1.5">
              <button
                onClick={() => escolherVista('prancha')}
                aria-pressed={!maqueteAberta}
                className={`botao-mesa text-xs sm:text-sm ${maqueteAberta ? 'botao-mesa--quieto' : ''}`}
              >
                A prancha
              </button>
              <button
                onClick={() => escolherVista('maquete')}
                aria-pressed={maqueteAberta}
                disabled={!tresDDisponivel || contextoPerdido}
                title={!tresDDisponivel || contextoPerdido ? `A maquete não pode subir: ${motivoSemMaquete}.` : undefined}
                className={`botao-mesa text-xs sm:text-sm ${maqueteAberta ? '' : 'botao-mesa--quieto'} ${
                  !tresDDisponivel || contextoPerdido ? 'opacity-45 cursor-not-allowed' : ''
                }`}
              >
                A maquete
              </button>
              {(!tresDDisponivel || contextoPerdido) && (
                <span className="text-[10px] text-stone-400 italic max-w-[16rem] leading-snug">
                  {motivoSemMaquete}
                </span>
              )}
            </span>
          )}
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
      {/* key por verbete: abrirGlossario(verbete) com o modal JÁ aberto
          remonta no verbete pedido (o estado interno nasce da prop só no
          mount — sem a key, ficaria preso no verbete antigo). */}
      {glossarioAberto !== null && <ModalGlossario key={glossarioAberto.verbeteId ?? 'livre'} />}

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
