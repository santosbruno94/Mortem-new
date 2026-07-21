import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { interpolar } from '../logic/interpolar.js';
import {
  obterLocalidade,
  obterDialogo,
  obterNo,
  obterPersonagemDaLocalidade,
} from '../data/pacote_caso.js';
import { confrontoSemParadeiro } from '../logic/acusacao.js';
import { ParagrafoProsa } from './ProsaComTermos.jsx';
import PlantaRelojoaria from './PlantaRelojoaria.jsx';
import CenaDialogo from './CenaDialogo.jsx';
import Overlay from './Overlay.jsx';

// Interrogatório como DIÁLOGO VIVO (§7.2): a árvore ramificada agora DESCE e
// NÃO VOLTA. Cada beat oferece quatro falas do perito, cada uma num tom
// (firme, cordial, técnico, oblíquo); escolher AVANÇA e descarta os irmãos —
// não há "outro assunto", não se volta ao hub. O nó corrente PERSISTE no
// store (noAtualDialogo): reabrir retoma onde parou, e a escolha é definitiva.
// A carta de sustentação de cada beat sai em qualquer tom (o caso é sempre
// acusável); o tom só muda a prosa do NPC. As falas surgem cartas pelo mesmo
// mecanismo `[[id]]` das localidades; o motor não muda.
// CONFRONTO (caixa gated): não há seletor universal. A caixa de confronto só
// expõe as perguntas AUTORIZADAS pela mesa — uma por prova de confronto que o
// jogador possui (`dialogo.confrontos`, filtrado por `temCarta`). É um CANAL
// LATERAL: confrontar rende a reação (`reacoesProva`) TEMPORARIAMENTE, sem
// descer a árvore; "retomar a conversa" devolve o perito ao beat onde estava.
// A reação é transitória (não persiste). Provas irrelevantes não aparecem — o
// caminho "carta alheia → noEvasiva" some da interface (noEvasiva fica só como
// fallback defensivo). Duas portas de entrada (Onda 6): `localidadeId` quando
// o NÓ DO MAPA é o interrogatório (Silas, Agnes, Grey) e `dialogoId` quando a
// pessoa vive dentro de um lugar (Walter, Davey — a árvore traz `titulo`/`subtitulo`).
const MARCA_TOM = { firme: '‹', cordial: '◦', tecnico: '▪', obliquo: '~' };

export default function InterrogatorioDialogo({ localidadeId, dialogoId }) {
  const detective = useJogo((s) => s.detective);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const noAtualDialogo = useJogo((s) => s.noAtualDialogo);
  const definirNoDialogo = useJogo((s) => s.definirNoDialogo);
  const visitarNoDialogo = useJogo((s) => s.visitarNoDialogo);
  const provasApresentadas = useJogo((s) => s.provasApresentadas);
  const apresentarProva = useJogo((s) => s.apresentarProva);
  const exigenciasFeitas = useJogo((s) => s.exigenciasFeitas);
  const exigirQueMostre = useJogo((s) => s.exigirQueMostre);

  const dialogo = obterDialogo(dialogoId || localidadeId);
  const localidade = localidadeId ? obterLocalidade(localidadeId) : null;
  // A reação a uma prova apresentada é TRANSITÓRIA (não persiste): fica em
  // estado local e "retomar" a descarta. O beat corrente vem do store.
  const [reacaoAtual, setReacaoAtual] = useState(null);
  const [cartaApresentada, setCartaApresentada] = useState(null);
  // Aviso quando a prova DESMENTIRIA o paradeiro, mas o interrogado ainda
  // não o declarou — a reação joga, mas nenhuma ligação nasce no mural.
  const [semParadeiro, setSemParadeiro] = useState(false);
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
    setSemParadeiro(false);
    definirNoDialogo(suspeitoId, destino);
    visitarNoDialogo(suspeitoId, destino);
  };

  // O gesto de confrontar: registra no store (que anota ao mural o confronto
  // de paradeiro, quando é o caso) e mostra a reação SEM descer a árvore —
  // canal lateral. "Retomar" devolve ao beat corrente. A carta vem sempre de
  // uma entrada de `confrontos` (portanto tem reação em `reacoesProva`); o
  // `|| noEvasiva` fica só como fallback defensivo.
  const apresentar = (carta) => {
    // Detecta o no-op de mural ANTES de apresentar (o estado da mesa é o
    // mesmo): a prova toca o paradeiro do interrogado, mas o álibi dele
    // ainda não foi declarado — a reação joga, porém nada se anota.
    setSemParadeiro(confrontoSemParadeiro(carta, suspeitoId, cartasRegistradas));
    apresentarProva(suspeitoId, carta.id);
    const destino = (dialogo.reacoesProva || {})[carta.id] || dialogo.noEvasiva;
    setReacaoAtual(destino);
    setCartaApresentada(carta);
  };

  const retomarConversa = () => {
    setReacaoAtual(null);
    setCartaApresentada(null);
    setSemParadeiro(false);
  };

  // O gatilho de complexo (OS `os-flags-psiquicas-no-dialogo.md`): a pergunta
  // que desmonta a compostura. Confronto SEM carta — canal lateral, sempre à
  // mão, cuja reação é BIOGRAFIA (nunca prova). Transitório como o confronto:
  // "retomar" descarta; nada se anota ao mural, nada persiste no store (o
  // motor é cego a isto). Só existe nos diálogos gerados que o trazem.
  const desmontar = (destino) => {
    setSemParadeiro(false);
    setCartaApresentada(null);
    setReacaoAtual(destino);
  };

  const exigir = (regiao, destino) => {
    exigirQueMostre(suspeitoId, regiao);
    setSemParadeiro(false);
    setCartaApresentada(null);
    setReacaoAtual(destino);
  };

  // O retrato segue o interrogado (suspeitoId); nas conversões antigas o
  // mapa localidade→personagem continua valendo como reserva.
  const personagemDaCena = suspeitoId || obterPersonagemDaLocalidade(localidade?.id);
  // A saleta é da relojoaria: a planta baixa (§5.1) também sobe aqui — só
  // nos nós de mapa (no diálogo embutido não se anda pela planta).
  const naRelojoaria = !!localidade && obterNo(localidade.id)?.grupo === 'relojoaria';

  // Confrontos autorais (`requerCarta`) seguem ocultos até a prova existir
  // (reservado; hoje o confronto é o seletor universal).
  const opcoesVisiveis = emReacao
    ? []
    : (no.opcoes || []).filter((op) => !op.requerCarta || temCarta(op.requerCarta));
  const conversaEncerrada = !emReacao && opcoesVisiveis.length === 0;

  // A caixa de confronto (gated): só as perguntas cujas provas estão na mesa.
  // Fora da reação; canal lateral, sempre à mão enquanto houver o que confrontar.
  const confrontosVisiveis = emReacao
    ? []
    : (dialogo.confrontos || []).filter((c) => temCarta(c.requerCarta));

  // O gatilho é canal lateral sem carta: à mão fora da reação, some durante.
  const gatilhosVisiveis = emReacao ? [] : dialogo.gatilhos || [];

  // O verbo "Exigir que mostre" (Inc. 6): gated na carta gen_sinal_exigivel.
  // Canal lateral como o gatilho — transitório, retoma sem descer.
  const exigidasDeste = exigenciasFeitas[suspeitoId] || [];
  const exigenciasVisiveis = emReacao
    ? []
    : (dialogo.exigencias || []).filter((e) => temCarta(e.requerCarta));

  return (
    <Overlay titulo={interpolar(titulo, detective)} subtitulo={subtitulo} marca="dialogo">
      {naRelojoaria && <PlantaRelojoaria localidadeAtual={localidade.id} />}

      {/* A cena ilustrada de quem o perito interroga (Sistema 2): fundo 2D da
          localidade + sprite meio-corpo. Reage quando o perito confronta —
          gesto observável, nunca legenda. Camada visual: o motor não a lê. */}
      <CenaDialogo
        personagemId={personagemDaCena}
        localidadeId={localidade?.id || dialogoId || suspeitoId}
        grupo={localidade ? obterNo(localidade.id)?.grupo : undefined}
        reacao={emReacao}
      />

      {/* A prova pousada diante do interrogado (linha conectiva do gesto) */}
      {cartaApresentada && (
        <p className="mb-3 text-stone-400 text-xs italic font-serif" data-prova-apresentada>
          Sobre a mesa, entre os dois: “{cartaApresentada.textoDisplay}”.
        </p>
      )}

      {/* Confronto de paradeiro sem paradeiro declarado: a prova o desmentiria,
          mas ele ainda não deu a sua noite — nada se anota ao mural. */}
      {semParadeiro && (
        <p className="mb-3 text-amber-300/80 text-xs italic font-serif" data-sem-paradeiro>
          Ainda não há paradeiro declarado para confrontar: pergunte-lhe a noite de
          sexta antes de lhe pôr isto diante dos olhos.
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
      </div>

      {/* A caixa de confronto (gated): só as perguntas que a mesa autoriza —
          uma por prova de confronto que o jogador possui. Cada botão é a
          pergunta autoral que explica por que o confronto está à mão. É canal
          lateral: confrontar rende a reação e a conversa retoma. */}
      {confrontosVisiveis.length > 0 && (
        <div className="mt-3 space-y-2" data-confrontos>
          {confrontosVisiveis.map((c) => {
            const jaApresentada = apresentadas.includes(c.requerCarta);
            return (
              <button
                key={c.requerCarta}
                type="button"
                className="opcao-dialogo opcao-dialogo--confronto"
                data-requer-carta={c.requerCarta}
                onClick={() => apresentar(cartasRegistradas.find((k) => k.id === c.requerCarta))}
              >
                <span className="opcao-marca" aria-hidden>
                  ❦
                </span>
                <span className="opcao-rotulo-texto">
                  {interpolar(c.rotulo, detective)}
                  {jaApresentada && <span className="text-stone-500 italic"> · já apresentada</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* O gatilho de complexo (gerados): uma pergunta pessoal que desmonta a
          compostura. Canal lateral SEM carta; a reação é biografia, não prova,
          e a conversa retoma. Separado dos tons (sem data-tom) e dos confrontos. */}
      {gatilhosVisiveis.length > 0 && (
        <div className="mt-3 space-y-2" data-gatilhos-psique>
          {gatilhosVisiveis.map((g) => (
            <button
              key={g.vaiPara}
              type="button"
              className="opcao-dialogo opcao-dialogo--gatilho"
              data-gatilho=""
              onClick={() => desmontar(g.vaiPara)}
            >
              <span className="opcao-marca" aria-hidden>
                ⟡
              </span>
              <span className="opcao-rotulo-texto">{interpolar(g.rotulo, detective)}</span>
            </button>
          ))}
        </div>
      )}

      {exigenciasVisiveis.length > 0 && (
        <div className="mt-3 space-y-2" data-exigencias>
          {exigenciasVisiveis.map((e) => {
            const jaExigida = exigidasDeste.includes(e.regiao);
            return (
              <button
                key={e.regiao}
                type="button"
                className="opcao-dialogo opcao-dialogo--exigencia"
                data-exigencia={e.regiao}
                onClick={() => exigir(e.regiao, e.vaiPara)}
              >
                <span className="opcao-marca" aria-hidden>
                  ✋
                </span>
                <span className="opcao-rotulo-texto">
                  {interpolar(e.rotulo, detective)}
                  {jaExigida && <span className="text-stone-500 italic"> · já exigido</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {conversaEncerrada && (
        <p className="mt-4 text-stone-500 text-xs italic font-serif tracking-wide" data-conversa-encerrada>
          O interrogatório se encerra; as perguntas feitas não se refazem.
        </p>
      )}

      <p className="mt-5 text-stone-400 text-xs italic font-serif tracking-wide">
        A conversa desce e não volta: cada pergunta escolhida descarta as outras. Confrontar com uma
        prova só se abre quando ela está na mesa, e não gasta a vez. Interrogar não custa tempo; o
        relógio só corre quando você viaja.
      </p>
    </Overlay>
  );
}
