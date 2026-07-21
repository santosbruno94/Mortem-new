import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { OPCOES_PERSONAGEM } from '../data/abertura.js';
import { obterCaso } from '../data/pacote_caso.js';
import { MODOS_DE_JOGO, modoDoCaso, pacoteDoModo, TAMANHO_POOL } from '../data/casos.js';
import { formatRelogio } from '../logic/tempo.js';
import { modoFlat } from '../logic/webgl.js';

// Liga/desliga a rota de escape 2D (?flat=1) e recarrega — a decisão 3D×2D
// é única por sessão (lida no arranque). Na tela de título não há jogo em
// curso; o recarregamento é inócuo (o save persiste no localStorage).
function alternarModoLeve(ativar) {
  const url = new URL(window.location.href);
  if (ativar) url.searchParams.set('flat', '1');
  else url.searchParams.delete('flat');
  window.location.href = url.toString();
}

// Tela inicial (§12): um único convite de papel pousa na mesa de madeira
// à luz de vela; Harlan Blackwell ergue-o e atende ao chamado.
//
// Com um caso salvo (retomada), o convite cede lugar à decisão: continuar
// o caso deixado sobre a mesa ou recomeçar do zero (apaga o save).
export default function TelaPersonagem({ retomada = false, aoDecidirRetomada }) {
  const escolherDetective = useJogo((s) => s.escolherDetective);
  const reiniciarCaso = useJogo((s) => s.reiniciarCaso);
  const carregarCaso = useJogo((s) => s.carregarCaso);
  const horasJogo = useJogo((s) => s.horasJogo);
  const modoPurista = useJogo((s) => s.modoPurista);
  const alternarModoPurista = useJogo((s) => s.alternarModoPurista);

  // O MODO DE JOGO escolhido (3 chamados na mesma mesa): nasce refletindo o
  // caso já carregado (?caso= ou save), com o caso-escola como default.
  const [modo, setModo] = useState(() => modoDoCaso(obterCaso().id));

  // Atender ao chamado: carrega o pacote do modo (se o caso corrente já não
  // é ele) e segue à abertura. No procedural, o SORTEIO do caso do banco é
  // desta camada de apresentação (Math.random permitido fora de logic/data/
  // store); o caso sorteado é, em si, determinístico por seed.
  const atenderChamado = () => {
    const atualId = obterCaso().id;
    if (modo === 'procedural') {
      if (modoDoCaso(atualId) !== 'procedural') {
        carregarCaso(pacoteDoModo('procedural', Math.floor(Math.random() * TAMANHO_POOL)));
      }
    } else {
      const alvo = pacoteDoModo(modo);
      if (atualId !== alvo.id) carregarCaso(alvo);
    }
    escolherDetective();
  };

  // Sorteia um caso NOVO da comarca (≠ o atual) e vai à abertura dele. Mesmo
  // sorteio de apresentação do atenderChamado; serve o laço de playtest a
  // partir da retomada, sem precisar do título limpo.
  const jogarNovoCaso = () => {
    const atualId = obterCaso().id;
    let pacote = pacoteDoModo('procedural', Math.floor(Math.random() * TAMANHO_POOL));
    for (let i = 0; pacote.id === atualId && i < TAMANHO_POOL; i++) {
      pacote = pacoteDoModo('procedural', Math.floor(Math.random() * TAMANHO_POOL));
    }
    carregarCaso(pacote);
    escolherDetective();
    if (aoDecidirRetomada) aoDecidirRetomada();
  };

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
          Inglaterra, 1893
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
              <button onClick={jogarNovoCaso} className="botao-mesa botao-mesa--quieto" data-novo-caso>
                Novo caso
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
            {/* Os três chamados sobre a mesa (§13): o caso-escola, a réplica
                procedural do caso-escola e o caso da comarca. Escolher aqui
                não custa nada; o convite do perito é que abre o caso. */}
            <p className="mt-10 sm:mt-12 mb-4 font-serif italic text-base sm:text-lg text-amber-200/90 text-center">
              Três chamados esperam sobre a mesa.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 w-full max-w-3xl mb-8">
              {MODOS_DE_JOGO.map((m) => {
                const ativo = m.id === modo;
                return (
                  <button
                    key={m.id}
                    type="button"
                    data-modo={m.id}
                    aria-pressed={ativo}
                    onClick={() => setModo(m.id)}
                    className={`flex-1 text-left rounded-sm border px-3 py-2.5 transition-colors ${
                      ativo
                        ? 'border-vela/70 bg-stone-900/80 shadow-vela'
                        : 'border-latao/30 bg-stone-950/40 hover:border-latao/70'
                    }`}
                  >
                    <p className={`font-serif ${ativo ? 'text-amber-200' : 'text-stone-300'}`}>{m.rotulo}</p>
                    <p className="mt-1 text-stone-400 text-xs leading-snug">{m.descricao}</p>
                  </button>
                );
              })}
            </div>

            <p className="mb-6 font-serif italic text-lg sm:text-xl text-amber-200/90 text-center">
              O perito que atende ao chamado.
            </p>

            {/* Um convite de pergaminho sobre a mesa: o papel se ergue
                sob o cursor (.carta-mesa cuida do gesto de hover) */}
            <div className="flex justify-center w-full max-w-md">
              {OPCOES_PERSONAGEM.map((opcao) => (
                <button
                  key={opcao.id}
                  onClick={atenderChamado}
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
                ? 'Modo purista: aceso — a lição do mestre fica só na sua cabeça'
                : 'Modo purista: apagado — a janela e o mecanismo já vêm lidos, como o mestre ensinou'}
            </button>
          </>
        )}

        {/* Rota de escape 2D visível (§UI): para hardware fraco ou sem WebGL,
            sem depender de descobrir o parâmetro ?flat=1 na URL. */}
        <button
          type="button"
          onClick={() => alternarModoLeve(!modoFlat())}
          className="mt-6 text-stone-500 hover:text-stone-300 text-xs underline underline-offset-2"
          data-toggle-flat
        >
          {modoFlat()
            ? 'Modo leve (2D): ativo — a mesa sem a maquete 3D'
            : 'Modo leve (2D) — para hardware sem WebGL ou lento'}
        </button>
      </div>
    </div>
  );
}
