import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { OPCOES_PERSONAGEM } from '../data/abertura.js';
import { obterCaso } from '../data/pacote_caso.js';
import { MODOS_DE_JOGO, modoDoCaso, pacoteDoModo, TAMANHO_POOL, TAMANHO_POOL_LUTA } from '../data/casos.js';
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

// O EMBLEMA DE CADA CHAMADO (1g). Desenho procedural, sem arquivo: o
// caso-escola traz um LACRE de cera — é o chamado escrito e selado à mão —,
// e os três casos que a máquina levanta trazem emblema gravado a buril.
// Nenhuma regra lê isto; é identidade de convite, e nada mais.
function EmblemaDoChamado({ modo }) {
  if (modo === 'tutorial') {
    return <span className="selo-lacre w-[22px] h-[22px] shrink-0" aria-hidden />;
  }
  const traco = { fill: 'none', stroke: '#54431f', strokeWidth: 1.5 };
  return (
    <svg viewBox="0 0 22 22" className="w-[22px] shrink-0" aria-hidden>
      {/* réplica: o mostrador com os raios das horas — a mesma hora, refeita */}
      {modo === 'replica' && (
        <g {...traco} strokeWidth={1.6}>
          <circle cx="11" cy="11" r="6" />
          <line x1="11" y1="1" x2="11" y2="4.6" />
          <line x1="11" y1="17.4" x2="11" y2="21" />
          <line x1="1" y1="11" x2="4.6" y2="11" />
          <line x1="17.4" y1="11" x2="21" y2="11" />
          <line x1="3.9" y1="3.9" x2="6.4" y2="6.4" />
          <line x1="15.6" y1="15.6" x2="18.1" y2="18.1" />
          <line x1="3.9" y1="18.1" x2="6.4" y2="15.6" />
          <line x1="15.6" y1="6.4" x2="18.1" y2="3.9" />
        </g>
      )}
      {/* comarca: a balança do tribunal de circuito */}
      {modo === 'procedural' && (
        <g {...traco}>
          <path d="M11 2 v16 M6 20 h10" />
          <path d="M4 6 h14 M4 6 l-2.6 5 a3 3 0 0 0 5.8 0 Z M18 6 l-2.6 5 a3 3 0 0 0 5.8 0 Z" strokeWidth={1.2} />
        </g>
      )}
      {/* luta: a mão que deixa a marca */}
      {modo === 'luta' && (
        <path
          d="M6 20 q-2 -6 0 -9 q1.4 -2 3 -2 l0 -4 q0 -1.6 1.4 -1.6 q1.2 0 1.2 1.6 l0 3 q.6 -4 2.2 -4 q1.4 0 1.2 2.2 l-.2 2.4 q1.6 -2 2.6 -.8 q1 1.2 -.4 3.4 q-1.8 3 -2 9 Z"
          {...traco}
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

// Tela inicial (§12): o cartaz da vila em wood type sobre a mesa de
// madeira à luz de vela, e sob ele os chamados — convites impressos
// pousados no tampo. Harlan Blackwell ergue o seu e atende.
//
// O wood type (font-cartaz) vive AQUI e nos carimbos de desfecho, e em
// mais lugar nenhum: dentro do caso a face de display é sempre a Bevan,
// menor. O cartaz é o que se lê da rua; o resto é papel de gabinete.
//
// Com um caso salvo (retomada), o convite cede lugar à decisão: continuar
// o caso deixado sobre a mesa ou recomeçar do zero (apaga o save).
export default function TelaPersonagem({ retomada = false, aoDecidirRetomada }) {
  const escolherDetective = useJogo((s) => s.escolherDetective);
  const iniciarInvestigacao = useJogo((s) => s.iniciarInvestigacao);
  const reiniciarCaso = useJogo((s) => s.reiniciarCaso);
  const carregarCaso = useJogo((s) => s.carregarCaso);
  const horasJogo = useJogo((s) => s.horasJogo);
  const modoPurista = useJogo((s) => s.modoPurista);
  const alternarModoPurista = useJogo((s) => s.alternarModoPurista);

  // O MODO DE JOGO escolhido (3 chamados na mesma mesa): nasce refletindo o
  // caso já carregado (?caso= ou save), com o caso-escola como default.
  const [modo, setModo] = useState(() => modoDoCaso(obterCaso().id));

  // Atender ao chamado: carrega o pacote do modo (se o caso corrente já não
  // é ele) e segue à abertura ou direto à investigação. Nos modos
  // procedurais (comarca e luta), o SORTEIO do caso do banco é desta
  // camada de apresentação (Math.random permitido fora de logic/data/
  // store); o caso sorteado é, em si, determinístico por seed.
  const pulaAbertura = modo === 'procedural' || modo === 'luta';
  // Assíncrono (Lote 5): pacoteDoModo puxa o banco de casos por import()
  // dinâmico na primeira vez — o clique espera o chunk chegar.
  const atenderChamado = async () => {
    const atualId = obterCaso().id;
    if (modo === 'procedural' || modo === 'luta') {
      const tamanho = modo === 'luta' ? TAMANHO_POOL_LUTA : TAMANHO_POOL;
      if (modoDoCaso(atualId) !== modo) {
        carregarCaso(await pacoteDoModo(modo, Math.floor(Math.random() * tamanho)));
      }
    } else {
      const alvo = await pacoteDoModo(modo);
      if (atualId !== alvo.id) carregarCaso(alvo);
    }
    escolherDetective();
    if (pulaAbertura) iniciarInvestigacao();
  };

  // Sorteia um caso NOVO do mesmo modo (≠ o atual) e pula direto à
  // investigação. Mesmo sorteio de apresentação do atenderChamado; serve o
  // laço de playtest a partir da retomada, sem precisar do título limpo.
  const jogarNovoCaso = async () => {
    const atualId = obterCaso().id;
    const modoAtual = modoDoCaso(atualId);
    const pool = modoAtual === 'luta' ? 'luta' : 'procedural';
    const tamanho = pool === 'luta' ? TAMANHO_POOL_LUTA : TAMANHO_POOL;
    let pacote = await pacoteDoModo(pool, Math.floor(Math.random() * tamanho));
    for (let i = 0; pacote.id === atualId && i < tamanho; i++) {
      pacote = await pacoteDoModo(pool, Math.floor(Math.random() * tamanho));
    }
    carregarCaso(pacote);
    escolherDetective();
    iniciarInvestigacao();
    if (aoDecidirRetomada) aoDecidirRetomada();
  };

  return (
    <div className="relative altura-tela-min mesa-madeira overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      {/* Halo de vela que respira sobre a mesa */}
      <div className="luz-de-vela" aria-hidden />

      {/* O conjunto pousa na mesa com o mesmo gesto dos overlays (≤320ms,
          cede ao prefers-reduced-motion via .overlay-surgir) */}
      <div className="relative overlay-surgir w-full max-w-5xl flex flex-col items-center">
        {/* O cartaz: wood type prensado, com o espaço entre letras que o
            tipógrafo dava ao tipo grande. A margem negativa à direita
            devolve o vão que o último caractere ganharia do tracking —
            sem ela a palavra fica descentrada por uma letra. */}
        <h1 className="font-cartaz text-[42px] sm:text-8xl tracking-[0.18em] sm:tracking-[0.22em] text-latao-ouro cartaz-gravado text-center select-none -mr-[0.18em] sm:-mr-[0.22em]">
          MORTEM
        </h1>

        <div className="divisor-ornado text-sm mt-6 w-full max-w-md" aria-hidden>
          §
        </div>
        {/* A linha de pé do cartaz: condensada de balcão, em caixa alta e
            bem espaçada — a praça e o ano, como o impressor os poria. */}
        <p className="mt-4 font-rotulo uppercase text-[9px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.34em] text-stone-400 text-center">
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
            {/* Os quatro chamados sobre a mesa (§13): o caso-escola, a
                réplica procedural, o caso da comarca e o caso com luta
                forçada. Escolher aqui não custa nada; o convite do perito
                é que abre o caso. */}
            <p className="mt-8 sm:mt-10 mb-3.5 font-serif italic text-lg sm:text-xl text-amber-200/90 text-center">
              Quatro chamados esperam sobre a mesa.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3.5 w-full max-w-5xl mb-8">
              {MODOS_DE_JOGO.map((m) => {
                const ativo = m.id === modo;
                return (
                  <button
                    key={m.id}
                    type="button"
                    data-modo={m.id}
                    aria-pressed={ativo}
                    onClick={() => setModo(m.id)}
                    className="carta-mesa flex-1 text-left"
                  >
                    <div
                      className={`carta-pergaminho rounded-sm px-3.5 py-3 sm:px-4 sm:py-3.5 h-full ${
                        ativo ? 'carta-pergaminho--acesa' : 'opacity-90'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5 sm:mb-2">
                        <EmblemaDoChamado modo={m.id} />
                        <p className="font-titulo text-[13px] sm:text-sm leading-tight text-tinta">{m.rotulo}</p>
                      </div>
                      {/* No celular a coluna é estreita e são quatro convites
                          empilhados: só o escolhido abre a letra miúda, para a
                          lista caber na tela sem rolar. No desktop os quatro
                          mostram a sua, lado a lado. */}
                      <p
                        className={`font-serif italic text-[11.5px] sm:text-[12.5px] leading-snug sm:leading-relaxed text-tinta-clara ${
                          ativo ? '' : 'hidden sm:block'
                        }`}
                      >
                        {m.descricao}
                      </p>
                      {/* A linha fica SEMPRE reservada nos quatro convites
                          (invisível nos três que não estão na mão): sem
                          isso a fileira mudava de altura a cada escolha,
                          e o papel pousado na mesa não se mexe sozinho. */}
                      <p
                        aria-hidden={!ativo}
                        className={`font-rotulo uppercase text-[7.5px] tracking-[0.2em] text-latao mt-2 ${
                          ativo ? '' : 'invisible hidden sm:block'
                        }`}
                      >
                        — o chamado na sua mão —
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mb-3.5 font-serif italic text-lg sm:text-xl text-amber-200/90 text-center">
              O perito que atende ao chamado.
            </p>

            {/* Um convite de pergaminho sobre a mesa: o papel se ergue
                sob o cursor (.carta-mesa cuida do gesto de hover). A placa
                de latão no pé é a chamada — mas quem clica é o convite
                inteiro, não a placa: o alvo é o papel todo, e não há botão
                dentro de botão. */}
            <div className="flex justify-center w-full max-w-md">
              {OPCOES_PERSONAGEM.map((opcao) => (
                <button
                  key={opcao.id}
                  onClick={atenderChamado}
                  className="carta-mesa text-left h-full w-full"
                >
                  <div className="carta-pergaminho rounded-sm p-5 sm:p-7 h-full">
                    <h2 className="font-serif text-xl sm:text-2xl text-tinta">{opcao.nome}</h2>
                    <div className="mt-2 mb-3 text-tinta-apagada" aria-hidden>
                      ―
                    </div>
                    <p className="font-prosa text-tinta-clara leading-relaxed text-[13px] sm:text-sm">
                      {opcao.descricao}
                    </p>
                    <span className="placa-latao mt-4 block w-full rounded-sm text-center font-serif text-[12.5px] sm:text-[13.5px] tracking-[0.14em] px-3 py-3">
                      ATENDER AO CHAMADO
                    </span>
                  </div>
                </button>
              ))}
            </div>

          </>
        )}

        {/* O rodapé do cartaz: os dois interruptores da casa, em letra de
            pé de página e sublinhado pontilhado — avisos afixados abaixo do
            cartaz, não botões. Lado a lado no desktop, empilhados no
            celular. O purista só aparece no convite limpo; na retomada o
            caso já corre com a escolha feita, e a Caderneta a espelha. */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-7 text-center">
          {/* Modo purista (Onda 8): silencia a síntese do legista — a
              Caderneta espelha o mesmo interruptor no meio do caso. */}
          {!retomada && (
            <button
              type="button"
              onClick={alternarModoPurista}
              className="text-stone-400 hover:text-stone-200 text-[11.5px] underline decoration-dotted underline-offset-4"
            >
              {modoPurista
                ? 'Modo purista: aceso — a lição do mestre fica só na sua cabeça'
                : 'Modo purista: apagado — a janela e o mecanismo já vêm lidos, como o mestre ensinou'}
            </button>
          )}

          {/* Rota de escape 2D visível (§UI): para hardware fraco ou sem WebGL,
              sem depender de descobrir o parâmetro ?flat=1 na URL. */}
          <button
            type="button"
            onClick={() => alternarModoLeve(!modoFlat())}
            className="text-stone-500 hover:text-stone-300 text-[11.5px] underline decoration-dotted underline-offset-4"
            data-toggle-flat
          >
            {modoFlat()
              ? 'Modo leve (2D): ativo — a mesa sem a maquete 3D'
              : 'Modo leve (2D) — para hardware sem WebGL ou lento'}
          </button>
        </div>
      </div>
    </div>
  );
}
