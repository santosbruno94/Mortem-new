import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { interpolar } from '../logic/interpolar.js';
import { obterLocalidade } from '../data/localidades.js';
import { obterDialogo } from '../data/dialogos.js';
import { obterNo } from '../data/mapa.js';
import { ParagrafoProsa } from './ProsaComTermos.jsx';
import PlantaRelojoaria from './PlantaRelojoaria.jsx';
import RetratoPersonagem from './RetratoPersonagem.jsx';
import { PERSONAGEM_POR_LOCALIDADE } from '../data/aparencias.js';
import Overlay from './Overlay.jsx';

// Ordem de exibição das provas no seletor (a mesma da mesa, Q9).
const ORDEM_DOMINIO = { temporal: 0, causal: 1, vestigio: 2, ambiental: 3, comportamental: 4 };
const ROTULOS_DOMINIO = {
  temporal: 'Temporal',
  causal: 'Causal',
  ambiental: 'Ambiental',
  comportamental: 'Comportamental',
  vestigio: 'Vestígio',
};

// Interrogatório como DIÁLOGO (§7.1): substitui a prosa estática dos nós de
// interrogatório por uma árvore ramificada determinística. O perito escolhe
// o assunto (navegação livre — relógio mole) e, quando tem a prova na mesa,
// pode CONFRONTAR o suspeito. Desde a Onda 5 o confronto é UNIVERSAL: o
// seletor "Apresentar uma prova…" aceita QUALQUER carta registrada — as que
// tocam o interrogado levam a reações próprias (`reacoesProva`), o resto cai
// na evasiva da voz dele (`noEvasiva`). O seletor não telegrafa quais cartas
// "queimam": só marca as já apresentadas. As falas surgem cartas pelo mesmo
// mecanismo `[[id]]` das localidades; o motor não muda. O nó corrente é
// estado local (reabrir começa no início); o "já perguntado" persiste no
// store (nosVisitadosDialogo), o "já apresentada" em provasApresentadas.
// Duas portas de entrada (Onda 6): `localidadeId` quando o NÓ DO MAPA é o
// interrogatório (Silas, Agnes, Grey — conversão integral) e `dialogoId`
// quando a pessoa vive dentro de um lugar (Walter, Davey — a árvore traz
// `titulo`/`subtitulo` próprios e `origemLocalidade`).
export default function InterrogatorioDialogo({ localidadeId, dialogoId }) {
  const detective = useJogo((s) => s.detective);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const nosVisitadosDialogo = useJogo((s) => s.nosVisitadosDialogo);
  const visitarNoDialogo = useJogo((s) => s.visitarNoDialogo);
  const provasApresentadas = useJogo((s) => s.provasApresentadas);
  const apresentarProva = useJogo((s) => s.apresentarProva);

  const dialogo = obterDialogo(dialogoId || localidadeId);
  const localidade = localidadeId ? obterLocalidade(localidadeId) : null;
  const [noAtual, setNoAtual] = useState(dialogo?.noInicial);
  const [apresentando, setApresentando] = useState(false);
  const [cartaApresentada, setCartaApresentada] = useState(null);
  if (!dialogo || (localidadeId && !localidade)) return null;
  const titulo = localidade ? localidade.titulo : dialogo.titulo;
  const subtitulo = localidade ? localidade.subtitulo : dialogo.subtitulo;

  const no = dialogo.nos[noAtual];
  const visitados = nosVisitadosDialogo[dialogo.suspeitoId] || [];
  const apresentadas = provasApresentadas[dialogo.suspeitoId] || [];
  const temCarta = (id) => cartasRegistradas.some((c) => c.id === id);

  const irPara = (destino) => {
    setNoAtual(destino);
    setCartaApresentada(null);
    visitarNoDialogo(dialogo.suspeitoId, destino);
  };

  // O gesto de apresentar (Onda 5): registra no store (que anota ao mural o
  // confronto de paradeiro, quando é o caso) e navega — reação específica se
  // a árvore a tem, evasiva do personagem para todo o resto.
  const apresentar = (carta) => {
    apresentarProva(dialogo.suspeitoId, carta.id);
    const destino = (dialogo.reacoesProva || {})[carta.id] || dialogo.noEvasiva;
    setNoAtual(destino);
    setCartaApresentada(carta);
    visitarNoDialogo(dialogo.suspeitoId, destino);
    setApresentando(false);
  };

  // O retrato segue o interrogado (suspeitoId); nas conversões antigas o
  // mapa localidade→personagem continua valendo como reserva.
  const personagemDaCena = dialogo.suspeitoId || PERSONAGEM_POR_LOCALIDADE[localidade?.id];
  // A saleta é da relojoaria: a planta baixa (§5.1) também sobe aqui — só
  // nos nós de mapa (no diálogo embutido não se anda pela planta).
  const naRelojoaria = !!localidade && obterNo(localidade.id)?.grupo === 'relojoaria';

  // Confrontos autorais (`requerCarta`) seguem ocultos até a prova existir.
  const opcoesVisiveis = (no.opcoes || []).filter((op) => !op.requerCarta || temCarta(op.requerCarta));

  // O seletor só existe no hub da árvore, com evasiva definida e mesa não vazia.
  const podeApresentar =
    noAtual === dialogo.noInicial && !!dialogo.noEvasiva && cartasRegistradas.length > 0;

  const provasOrdenadas = [...cartasRegistradas].sort(
    (a, b) => (ORDEM_DOMINIO[a.tagsOcultas.dominio] ?? 9) - (ORDEM_DOMINIO[b.tagsOcultas.dominio] ?? 9)
  );

  return (
    <Overlay titulo={interpolar(titulo, detective)} subtitulo={subtitulo} marca="dialogo">
      {naRelojoaria && <PlantaRelojoaria localidadeAtual={localidade.id} />}

      {/* Retrato de quem o perito interroga — camada visual, decorativa */}
      {personagemDaCena && (
        <div className="float-right ml-4 mb-2 border border-latao/40 rounded-sm shadow-pousado">
          <RetratoPersonagem personagemId={personagemDaCena} tamanho={84} className="block" />
        </div>
      )}

      {/* A prova pousada diante do interrogado (linha conectiva do gesto) */}
      {cartaApresentada && (
        <p className="mb-3 text-stone-400 text-xs italic font-serif" data-prova-apresentada>
          Sobre a mesa, entre os dois: “{cartaApresentada.textoDisplay}”.
        </p>
      )}

      {/* A fala corrente do suspeito (com os termos extraíveis) */}
      <div data-no-dialogo={noAtual} className="space-y-3">
        {no.fala.map((t, i) => (
          <ParagrafoProsa key={`${noAtual}_${i}`} texto={t} />
        ))}
      </div>

      {/* As escolhas do perito: assuntos, confrontos e o seletor de provas */}
      <div className="mt-6 space-y-2" data-opcoes-dialogo>
        {opcoesVisiveis.map((op) => {
          const ehConfronto = !!op.requerCarta;
          const ehVoltar = op.vaiPara === dialogo.noInicial;
          const jaVisto = !ehConfronto && !ehVoltar && visitados.includes(op.vaiPara);
          return (
            <button
              key={op.rotulo}
              type="button"
              className={`opcao-dialogo ${ehConfronto ? 'opcao-dialogo--confronto' : ''} ${
                ehVoltar ? 'opcao-dialogo--voltar' : ''
              }`}
              data-confronto={ehConfronto ? '' : undefined}
              onClick={() => irPara(op.vaiPara)}
            >
              <span className="opcao-marca" aria-hidden>
                {ehConfronto ? '❦' : ehVoltar ? '↩' : jaVisto ? '§' : '›'}
              </span>
              <span className="opcao-rotulo-texto">{interpolar(op.rotulo, detective)}</span>
              {jaVisto && <span className="opcao-visto">já perguntado</span>}
            </button>
          );
        })}

        {podeApresentar && (
          <button
            type="button"
            className="opcao-dialogo opcao-dialogo--confronto"
            onClick={() => setApresentando((v) => !v)}
          >
            <span className="opcao-marca" aria-hidden>
              ❦
            </span>
            <span className="opcao-rotulo-texto">Apresentar uma prova…</span>
          </button>
        )}
      </div>

      {/* O seletor de provas (Onda 5): tudo o que está na mesa, sem
          telégrafo — só a marca de "já apresentada". */}
      {podeApresentar && apresentando && (
        <div className="mt-3 border border-latao/30 bg-stone-950/40 rounded-sm p-3" data-seletor-provas>
          <p className="text-stone-400 text-[11px] mb-2">O que apresentar:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {provasOrdenadas.map((carta) => {
              const jaApresentada = apresentadas.includes(carta.id);
              return (
                <button
                  key={carta.id}
                  type="button"
                  onClick={() => apresentar(carta)}
                  className="text-left rounded-sm px-2 py-1.5 border border-latao/30 bg-stone-900/70 hover:border-latao/60 transition-colors duration-gesto"
                  title={carta.descricao}
                >
                  <span className="block text-cera text-rotulo uppercase">
                    {ROTULOS_DOMINIO[carta.tagsOcultas.dominio]}
                    {jaApresentada && <span className="text-stone-500 normal-case"> · já apresentada</span>}
                  </span>
                  <span className="block font-serif text-stone-200 text-sm leading-snug">
                    {carta.textoDisplay}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setApresentando(false)}
            className="mt-2 text-stone-400 hover:text-stone-200 text-xs underline underline-offset-2"
          >
            guardar as provas
          </button>
        </div>
      )}

      <p className="mt-5 text-stone-400 text-xs italic font-serif tracking-wide">
        Apresentar uma prova exige tê-la registrado na mesa. Interrogar não custa tempo; o relógio
        só corre quando você viaja.
      </p>
    </Overlay>
  );
}
