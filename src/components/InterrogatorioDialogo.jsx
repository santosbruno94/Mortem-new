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

// Interrogatório como DIÁLOGO VIVO (§7.2): a árvore ramificada agora DESCE e
// NÃO VOLTA. Cada beat oferece quatro falas do perito, cada uma num tom
// (firme, cordial, técnico, oblíquo); escolher AVANÇA e descarta os irmãos —
// não há "outro assunto", não se volta ao hub. O nó corrente PERSISTE no
// store (noAtualDialogo): reabrir retoma onde parou, e a escolha é definitiva.
// A carta de sustentação de cada beat sai em qualquer tom (o caso é sempre
// acusável); o tom só muda a prosa do NPC. As falas surgem cartas pelo mesmo
// mecanismo `[[id]]` das localidades; o motor não muda.
// CONFRONTO (Onda 5): o seletor "Apresentar uma prova…" segue UNIVERSAL e é
// um CANAL LATERAL — apresentar rende a reação (`reacoesProva`) ou a evasiva
// (`noEvasiva`) TEMPORARIAMENTE, sem descer a árvore; "retomar a conversa"
// devolve o perito ao beat onde estava. A reação é transitória (não persiste).
// Duas portas de entrada (Onda 6): `localidadeId` quando o NÓ DO MAPA é o
// interrogatório (Silas, Agnes, Grey) e `dialogoId` quando a pessoa vive
// dentro de um lugar (Walter, Davey — a árvore traz `titulo`/`subtitulo`).
const MARCA_TOM = { firme: '‹', cordial: '◦', tecnico: '▪', obliquo: '~' };

export default function InterrogatorioDialogo({ localidadeId, dialogoId }) {
  const detective = useJogo((s) => s.detective);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const noAtualDialogo = useJogo((s) => s.noAtualDialogo);
  const definirNoDialogo = useJogo((s) => s.definirNoDialogo);
  const visitarNoDialogo = useJogo((s) => s.visitarNoDialogo);
  const provasApresentadas = useJogo((s) => s.provasApresentadas);
  const apresentarProva = useJogo((s) => s.apresentarProva);

  const dialogo = obterDialogo(dialogoId || localidadeId);
  const localidade = localidadeId ? obterLocalidade(localidadeId) : null;
  // A reação a uma prova apresentada é TRANSITÓRIA (não persiste): fica em
  // estado local e "retomar" a descarta. O beat corrente vem do store.
  const [reacaoAtual, setReacaoAtual] = useState(null);
  const [apresentando, setApresentando] = useState(false);
  const [cartaApresentada, setCartaApresentada] = useState(null);
  if (!dialogo || (localidadeId && !localidade)) return null;
  const titulo = localidade ? localidade.titulo : dialogo.titulo;
  const subtitulo = localidade ? localidade.subtitulo : dialogo.subtitulo;

  const suspeitoId = dialogo.suspeitoId;
  // Nó de PERGUNTA corrente (persistido). Reabrir retoma onde parou.
  const noPergunta = noAtualDialogo[suspeitoId] || dialogo.noInicial;
  // O nó em tela: a reação transitória tem prioridade sobre o beat.
  const noExibido = reacaoAtual || noPergunta;
  const no = dialogo.nos[noExibido] || dialogo.nos[dialogo.noInicial];
  const apresentadas = provasApresentadas[suspeitoId] || [];
  const temCarta = (id) => cartasRegistradas.some((c) => c.id === id);

  // Os nós de reação/evasiva não são posição de conversa: são resposta a uma
  // prova. Nunca persistem como beat, e neles a conversa "retoma".
  const nosReacao = new Set([...Object.values(dialogo.reacoesProva || {}), dialogo.noEvasiva]);
  const emReacao = !!reacaoAtual;

  // Escolher um tom: DESCE a árvore (definitivo) e persiste o novo beat.
  const irPara = (destino) => {
    setReacaoAtual(null);
    setCartaApresentada(null);
    definirNoDialogo(suspeitoId, destino);
    visitarNoDialogo(suspeitoId, destino);
  };

  // O gesto de apresentar (Onda 5): registra no store (que anota ao mural o
  // confronto de paradeiro, quando é o caso) e mostra a reação SEM descer a
  // árvore — canal lateral. "Retomar" devolve ao beat corrente.
  const apresentar = (carta) => {
    apresentarProva(suspeitoId, carta.id);
    const destino = (dialogo.reacoesProva || {})[carta.id] || dialogo.noEvasiva;
    setReacaoAtual(destino);
    setCartaApresentada(carta);
    setApresentando(false);
  };

  const retomarConversa = () => {
    setReacaoAtual(null);
    setCartaApresentada(null);
  };

  // O retrato segue o interrogado (suspeitoId); nas conversões antigas o
  // mapa localidade→personagem continua valendo como reserva.
  const personagemDaCena = suspeitoId || PERSONAGEM_POR_LOCALIDADE[localidade?.id];
  // A saleta é da relojoaria: a planta baixa (§5.1) também sobe aqui — só
  // nos nós de mapa (no diálogo embutido não se anda pela planta).
  const naRelojoaria = !!localidade && obterNo(localidade.id)?.grupo === 'relojoaria';

  // Confrontos autorais (`requerCarta`) seguem ocultos até a prova existir
  // (reservado; hoje o confronto é o seletor universal).
  const opcoesVisiveis = emReacao
    ? []
    : (no.opcoes || []).filter((op) => !op.requerCarta || temCarta(op.requerCarta));
  const conversaEncerrada = !emReacao && opcoesVisiveis.length === 0;

  // O seletor existe em qualquer nó de PERGUNTA (não na reação), com evasiva
  // definida e mesa não vazia — apresentar é canal lateral, sempre à mão.
  const podeApresentar = !emReacao && !!dialogo.noEvasiva && cartasRegistradas.length > 0;

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
      <div data-no-dialogo={noExibido} className="space-y-3">
        {no.fala.map((t, i) => (
          <ParagrafoProsa key={`${noExibido}_${i}`} texto={t} />
        ))}
      </div>

      {/* As escolhas do perito: as quatro falas do beat (tons) OU, na reação,
          o retomar da conversa. */}
      <div className="mt-6 space-y-2" data-opcoes-dialogo>
        {opcoesVisiveis.map((op) => {
          const ehConfronto = !!op.requerCarta;
          return (
            <button
              key={op.rotulo}
              type="button"
              className={`opcao-dialogo ${ehConfronto ? 'opcao-dialogo--confronto' : ''}`}
              data-confronto={ehConfronto ? '' : undefined}
              data-tom={op.tom || undefined}
              onClick={() => irPara(op.vaiPara)}
            >
              <span className="opcao-marca" aria-hidden>
                {ehConfronto ? '❦' : MARCA_TOM[op.tom] || '›'}
              </span>
              <span className="opcao-rotulo-texto">{interpolar(op.rotulo, detective)}</span>
            </button>
          );
        })}

        {/* Retomar: sai da reação transitória de volta ao beat corrente. */}
        {emReacao && (
          <button type="button" className="opcao-dialogo opcao-dialogo--voltar" onClick={retomarConversa}>
            <span className="opcao-marca" aria-hidden>
              ↩
            </span>
            <span className="opcao-rotulo-texto">— retomar a conversa —</span>
          </button>
        )}

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

      {conversaEncerrada && (
        <p className="mt-4 text-stone-500 text-xs italic font-serif tracking-wide" data-conversa-encerrada>
          O interrogatório se encerra; as perguntas feitas não se refazem.
        </p>
      )}

      <p className="mt-5 text-stone-400 text-xs italic font-serif tracking-wide">
        A conversa desce e não volta: cada pergunta escolhida descarta as outras. Apresentar uma prova
        exige tê-la na mesa e não gasta a vez. Interrogar não custa tempo; o relógio só corre quando
        você viaja.
      </p>
    </Overlay>
  );
}
