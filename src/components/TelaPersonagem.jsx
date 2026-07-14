import { useJogo } from '../store/jogo.js';
import { OPCOES_PERSONAGEM } from '../data/abertura.js';
import { formatRelogio } from '../logic/tempo.js';

// Tela inicial (§12): um único convite de papel pousa na mesa de madeira
// à luz de vela; o Dr. Harlan Blackwell ergue-o e atende ao chamado.
//
// Com um caso salvo (retomada), o convite cede lugar à decisão: continuar
// o caso deixado sobre a mesa ou recomeçar do zero (apaga o save).
export default function TelaPersonagem({ retomada = false, aoDecidirRetomada }) {
  const escolherDetective = useJogo((s) => s.escolherDetective);
  const reiniciarCaso = useJogo((s) => s.reiniciarCaso);
  const horasJogo = useJogo((s) => s.horasJogo);
  const modoPurista = useJogo((s) => s.modoPurista);
  const alternarModoPurista = useJogo((s) => s.alternarModoPurista);

  return (
    <div className="relative altura-tela-min mesa-madeira overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      {/* Halo de vela que respira sobre a mesa */}
      <div className="luz-de-vela" aria-hidden />

      {/* O conjunto pousa na mesa com o mesmo gesto dos overlays (≤320ms,
          cede ao prefers-reduced-motion via .overlay-surgir) */}
      <div className="relative overlay-surgir w-full max-w-4xl flex flex-col items-center">
        <h1 className="font-serif text-6xl sm:text-8xl tracking-[0.25em] sm:tracking-[0.35em] text-amber-200 titulo-gravado text-center select-none -mr-[0.25em] sm:-mr-[0.35em]">
          MORTEM
        </h1>

        <div className="divisor-ornado text-sm mt-6 w-full max-w-md" aria-hidden>
          §
        </div>
        <p className="mt-4 text-stone-400 text-sm tracking-[0.3em] text-center">
          A Hora Emprestada — Briarstone, 1893
        </p>

        {retomada ? (
          <>
            <p className="mt-14 sm:mt-16 mb-8 sm:mb-10 font-serif italic text-lg sm:text-xl text-amber-200/90 text-center">
              O caderno ficou aberto sobre a mesa. O relógio marca {formatRelogio(horasJogo)}.
            </p>
            <div className="flex flex-wrap justify-center gap-3 w-full max-w-md">
              <button onClick={() => aoDecidirRetomada()} className="botao-mesa">
                Continuar o caso
              </button>
              <button
                onClick={() => {
                  reiniciarCaso();
                  aoDecidirRetomada();
                }}
                className="botao-mesa botao-mesa--quieto"
              >
                Recomeçar do princípio
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-14 sm:mt-16 mb-8 sm:mb-10 font-serif italic text-lg sm:text-xl text-amber-200/90 text-center">
              Quem atende ao chamado?
            </p>

            {/* Um convite de pergaminho sobre a mesa: o papel se ergue
                sob o cursor (.carta-mesa cuida do gesto de hover) */}
            <div className="flex justify-center w-full max-w-md">
              {OPCOES_PERSONAGEM.map((opcao) => (
                <button
                  key={opcao.id}
                  onClick={() => escolherDetective()}
                  className="carta-mesa text-left h-full"
                >
                  <div className="carta-pergaminho rounded-sm p-5 sm:p-7 h-full">
                    <h2 className="font-serif text-2xl text-tinta">{opcao.nome}</h2>
                    <div className="mt-2 mb-3 text-tinta-apagada" aria-hidden>
                      ―
                    </div>
                    <p className="text-tinta-clara leading-relaxed text-sm">{opcao.descricao}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Modo purista (Onda 8): silencia a síntese do legista — a
                Caderneta espelha o mesmo interruptor no meio do caso. */}
            <button
              type="button"
              onClick={alternarModoPurista}
              className="mt-8 text-stone-400 hover:text-stone-200 text-xs underline underline-offset-2"
            >
              {modoPurista
                ? 'Modo purista: aceso — o legista guarda a síntese consigo'
                : 'Modo purista: apagado — o legista lê a janela e o mecanismo por você'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
