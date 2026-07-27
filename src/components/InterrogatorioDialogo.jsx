import { useMemo, useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { interpolar } from '../logic/interpolar.js';
import { escolherDeterministico } from '../logic/hash.js';
import { montarDossies, exposicaoDiante } from '../logic/exposicao.js';
import {
  obterLocalidade,
  obterDialogo,
  obterNo,
  obterPersonagemDaLocalidade,
  obterCartas,
  obterDialogos,
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

// A tela da conversa respira mais que a da localidade (item 3 do playtest de
// 26/07/2026): entrelinha larga e parágrafos afastados, porque aqui se lê
// fala — e fala em bloco fechado cansa antes de acabar. A prosa das
// localidades fica como está; quem muda é o interrogatório.
const CLASSE_FALA = 'font-serif text-stone-300 leading-loose';
// O que já se disse fica escrito, e escrito lê-se mais apagado que o que se
// diz agora — mas lê-se. O termo por colher continua clicável no registro:
// é a única diferença que importa (playtest cego de 27/07/2026, item 1).
const CLASSE_FALA_REGISTRADA = 'font-serif text-stone-400/90 leading-loose text-[0.94em]';

// Número por extenso dentro de período corrido: os contadores do jogo usam
// algarismo porque SÃO contadores («3 de 8 observações»), mas em frase de prosa
// o repositório escreve por extenso («doze anos», «duas libras e dois xelins»).
// Acima de seis o algarismo volta — não há tela que chegue lá.
const POR_EXTENSO = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis'];

export default function InterrogatorioDialogo({ localidadeId, dialogoId }) {
  const detective = useJogo((s) => s.detective);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const noAtualDialogo = useJogo((s) => s.noAtualDialogo);
  const nosVisitadosDialogo = useJogo((s) => s.nosVisitadosDialogo);
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
  const emReacao = !!reacaoAtual;

  // ---------------------------------------------------------------------
  // O TERMO DA CONVERSA (playtest cego de 27/07/2026, item 1).
  //
  // A descida sem volta apagava o beat anterior da tela, e com ele o termo em
  // negrito que ainda não se tinha colhido: 13 das 50 cartas do caso nascem
  // dentro de diálogo, e todas se perdiam em silêncio ao escolher a pergunta
  // seguinte — a carta e o botão que a destruía dividiam a mesma tela. A
  // conversa continua a DESCER e a não voltar (a escolha segue definitiva);
  // o que deixa de acontecer é o dito se desdizer. O que ele já declarou fica
  // escrito, como num termo tomado a escrito, e o termo por colher continua
  // ao alcance da mão.
  //
  // A trilha sai do store (`nosVisitadosDialogo`, na ordem em que se desceu),
  // com o nó de abertura à frente — `visitarNoDialogo` só regista o DESTINO
  // de cada escolha, e a abertura não é destino de nenhuma.
  //
  // Reações de confronto NÃO entram no termo: são canal lateral transitório
  // por desenho, e o botão que as produz continua à mão (reapresentar a prova
  // devolve a mesma cena). O que entra é a fala dos beats — e é só nela que
  // vivem os 49 marcadores [[id]] das árvores.
  //
  // A `alfinetada` e o `degrau` também ficam de fora, e por razão mais dura
  // (fiscal-continuidade, 27/07/2026): os dois são função da MESA NO INSTANTE
  // DO RENDER — a alfinetada pelo nível de exposição, o degrau pela contagem
  // da lista curada. Reimprimi-los num beat passado mostraria o que diriam
  // AGORA, não o que disseram então: seria inventar um passado que o jogador
  // não viveu. Nenhuma carta se perde por isso (zero [[id]] em `alfinetada` e
  // `degraus`, no caso-escola e nos 31 casos gerados). O rodapé promete «o
  // que ele DECLAROU fica escrito», que é exatamente o que persiste.
  const trilha = [dialogo.noInicial, ...(nosVisitadosDialogo[suspeitoId] || [])];
  // Em reação, o beat corrente também já é passado: quem ocupa a tela é a
  // cena da prova. Fora dela, o último da trilha É a tela — e não se repete.
  const registro = emReacao ? trilha : trilha.slice(0, -1);
  // A pergunta que levou a cada resposta, reconstruída da árvore: a opção do
  // nó anterior que aponta para este. O índice indexa `opcoes` INTEIRO, e a
  // renderização passou a fazer o mesmo (`indexOf` sobre `no.opcoes`) — é o
  // que garante que o termo repita palavra por palavra a pergunta que o perito
  // fez, e não a redação de outro tom.
  const perguntaQueLevouA = (indice) => {
    if (indice <= 0) return null;
    const anterior = dialogo.nos[trilha[indice - 1]];
    if (!anterior) return null;
    const i = (anterior.opcoes || []).findIndex((op) => op.vaiPara === trilha[indice]);
    if (i < 0) return null;
    const op = anterior.opcoes[i];
    const base = op.rotuloVars
      ? escolherDeterministico(op.rotuloVars, `${detective.surname || ''}|${suspeitoId}|${trilha[indice - 1]}|${i}`)
      : op.rotulo;
    return interpolar(base, detective);
  };
  // Quantos termos em negrito estão em tela sem ter ido para a mesa. Serve
  // só ao aviso de rodapé — o motor não lê isto, e nada trava por causa dele:
  // o perito segue livre para não anotar o que ouviu, desde que saiba que não
  // anotou.
  const idsEmTela = [
    ...new Set(
      [...registro, noExibido]
        .map((id) => dialogo.nos[id])
        .filter(Boolean)
        .flatMap((n) => n.fala)
        .flatMap((t) => [...t.matchAll(/\[\[(\w+)\]\]/g)].map((m) => m[1]))
    ),
  ];
  const porColher = idsEmTela.filter((id) => !temCarta(id)).length;

  // EXPOSIÇÃO (OS-R6, G5): quanto do dossiê daquele suspeito o perito trouxe
  // para a sala. É função pura das cartas na mesa — o nível não abre nem
  // fecha nó nenhum; só paga a `alfinetada` do beat 3. Camada narrativa: o
  // veredicto continua sem saber que isto existe.
  const dossies = useMemo(() => montarDossies(obterCartas(), obterDialogos()), []);
  const exposicao = exposicaoDiante(
    cartasRegistradas.map((c) => c.id),
    dossies[suspeitoId] || []
  );
  const alfinetada = (no.alfinetada || {})[exposicao.nivel] || [];

  // A ESCADA DE CONFRONTO (D8): contador autoral, nunca `requerTodas`. Cada
  // degrau traz a sua lista curada e o corte; vale o ÚLTIMO degrau cuja
  // contagem a mesa satisfaz. Rende prosa e mais nada — o degrau não abre nó
  // nem marca carta.
  const degrau = (no.degraus || [])
    .filter((d) => (d.contaEntre || []).filter(temCarta).length >= (d.aPartirDe ?? 1))
    .slice(-1)[0];

  // Escolher um tom: DESCE a árvore (definitivo) e persiste o novo beat.
  const irPara = (destino) => {
    setReacaoAtual(null);
    setCartaApresentada(null);
    definirNoDialogo(suspeitoId, destino);
    visitarNoDialogo(suspeitoId, destino);
  };

  // O gesto de confrontar: registra no store (que anota ao mural o confronto
  // de paradeiro, quando é o caso) e mostra a reação SEM descer a árvore —
  // canal lateral. "Retomar" devolve ao beat corrente. A carta vem sempre de
  // uma entrada de `confrontos` (portanto tem reação em `reacoesProva`); o
  // `|| noEvasiva` fica só como fallback defensivo.
  const apresentar = (carta) => {
    // Guarda de ordem (playtest cego de 27/07/2026, item 2): a prova que
    // desmente um paradeiro NÃO DECLARADO não se põe diante dos olhos de
    // ninguém — a pergunta fica travada até ele dar a noite dele. Antes o
    // jogo avisava que nada se anotaria e rodava a cena assim mesmo: o
    // interrogado confessava a mentira e, perguntado depois do paradeiro,
    // reapresentava a mentira já confessada. O aviso passou do depois para o
    // antes, que é onde ele serve para alguma coisa.
    if (confrontoSemParadeiro(carta, suspeitoId, cartasRegistradas)) return;
    apresentarProva(suspeitoId, carta.id);
    const destino = (dialogo.reacoesProva || {})[carta.id] || dialogo.noEvasiva;
    setReacaoAtual(destino);
    setCartaApresentada(carta);
  };

  const retomarConversa = () => {
    setReacaoAtual(null);
    setCartaApresentada(null);
  };

  // O gatilho de complexo (OS `os-flags-psiquicas-no-dialogo.md`): a pergunta
  // que desmonta a compostura. Confronto SEM carta — canal lateral, sempre à
  // mão, cuja reação é BIOGRAFIA (nunca prova). Transitório como o confronto:
  // "retomar" descarta; nada se anota ao mural, nada persiste no store (o
  // motor é cego a isto). Só existe nos diálogos gerados que o trazem.
  const desmontar = (destino) => {
    setCartaApresentada(null);
    setReacaoAtual(destino);
  };

  const exigir = (regiao, destino) => {
    exigirQueMostre(suspeitoId, regiao);
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
  // A pergunta que desmente um paradeiro ainda não declarado vem TRAVADA (e
  // não escondida): quem a lê aprende a ordem do ofício — primeiro toma-se o
  // termo, depois se lhe põe a prova diante dos olhos.
  const confrontosVisiveis = emReacao
    ? []
    : (dialogo.confrontos || [])
        .filter((c) => temCarta(c.requerCarta))
        .map((c) => ({
          ...c,
          carta: cartasRegistradas.find((k) => k.id === c.requerCarta),
        }))
        .map((c) => ({
          ...c,
          travado: confrontoSemParadeiro(c.carta, suspeitoId, cartasRegistradas),
        }));

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

      {/* O TERMO DA CONVERSA: o que ele já declarou, na ordem em que o
          declarou, com a pergunta que o perito fez antes de cada resposta.
          Os termos em negrito que ficaram por colher continuam clicáveis
          aqui — descer a árvore deixa de apagar a prova. */}
      {registro.length > 0 && (
        <div className="registro-conversa space-y-4 mb-6" data-registro-conversa>
          {registro.map((noId, indice) => {
            const noPassado = dialogo.nos[noId];
            if (!noPassado) return null;
            const pergunta = perguntaQueLevouA(indice);
            return (
              <div key={noId} data-fala-registrada={noId} className="space-y-3">
                {pergunta && <p className="pergunta-registrada">{pergunta}</p>}
                {noPassado.fala.map((t, i) => (
                  <ParagrafoProsa key={`${noId}_${i}`} texto={t} className={CLASSE_FALA_REGISTRADA} />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* A fala corrente do suspeito (com os termos extraíveis) */}
      {!emReacao && perguntaQueLevouA(trilha.length - 1) && (
        <p className="pergunta-registrada pergunta-registrada--corrente">
          {perguntaQueLevouA(trilha.length - 1)}
        </p>
      )}
      <div data-no-dialogo={noExibido} data-exposicao={exposicao.nivel} className="space-y-5">
        {no.fala.map((t, i) => (
          <ParagrafoProsa key={`${noExibido}_${i}`} texto={t} className={CLASSE_FALA} />
        ))}

        {/* A alfinetada: o que o beat da pressão rende A MAIS quando o perito
            chega sabendo. Nunca traz carta (guarda GR6-4) — é a compostura
            que falha, e só. Em E0 não há nada aqui. */}
        {alfinetada.map((t, i) => (
          <ParagrafoProsa key={`${noExibido}_alf_${i}`} texto={t} className={CLASSE_FALA} />
        ))}

        {/* O degrau do confronto: o que a mesa cobra a mais quando os papéis
            se juntam. Prosa, nunca carta. */}
        {(degrau?.fala || []).map((t, i) => (
          <ParagrafoProsa key={`${noExibido}_deg_${i}`} texto={t} className={CLASSE_FALA} />
        ))}
      </div>

      {/* As escolhas do perito: as quatro falas do beat (tons) OU, na reação,
          o retomar da conversa. */}
      <div className="mt-6 space-y-2" data-opcoes-dialogo>
        {opcoesVisiveis.map((op) => {
          const ehConfronto = !!op.requerCarta;
          // A chave determinística indexa a lista COMPLETA, nunca a filtrada
          // (fiscal-continuidade, 27/07/2026). Duas razões, e a segunda é a
          // grave: (a) o registro da conversa reconstrói o índice por
          // `findIndex` sobre `no.opcoes` inteiro, e se algum dia uma opção
          // trouxer `requerCarta` os dois lados divergem — a pergunta escrita
          // no termo passa a ser a redação de outro tom; (b) `opcoesVisiveis`
          // é filtrada por `temCarta`, que muda DURANTE a partida, e indexar
          // por ela faria a redação do beat corrente mudar sozinha quando o
          // jogador colhesse uma carta. A variação é da IDENTIDADE DO PERITO,
          // e de mais nada. Hoje byte-idêntico (nenhuma opção usa
          // `requerCarta`, no caso-escola e nas 155 árvores dos gerados).
          const i = (no.opcoes || []).indexOf(op);
          // Variação da PERGUNTA (caso-escola): quando a opção traz um pool
          // `rotuloVars`, a redação varia pela IDENTIDADE DO PERITO (o único
          // eixo determinístico do tutorial — seed fixa) — cada persona ouve
          // as próprias perguntas, a intenção do tom intacta. Sem pool, o
          // rótulo de sempre. Os diálogos gerados já variam no build.
          const rotuloBase = op.rotuloVars
            ? escolherDeterministico(op.rotuloVars, `${detective.surname || ''}|${suspeitoId}|${noExibido}|${i}`)
            : op.rotulo;
          return (
            <button
              key={`${i}-${op.tom || op.rotulo}`}
              type="button"
              className={`opcao-dialogo ${ehConfronto ? 'opcao-dialogo--confronto' : ''}`}
              data-confronto={ehConfronto ? '' : undefined}
              data-tom={op.tom || undefined}
              onClick={() => irPara(op.vaiPara)}
            >
              <span className="opcao-marca" aria-hidden>
                {ehConfronto ? '❦' : MARCA_TOM[op.tom] || '›'}
              </span>
              <span className="opcao-rotulo-texto">{interpolar(rotuloBase, detective)}</span>
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
                className={`opcao-dialogo opcao-dialogo--confronto ${c.travado ? 'opcao-dialogo--travado' : ''}`}
                data-requer-carta={c.requerCarta}
                data-travado={c.travado ? '' : undefined}
                disabled={c.travado}
                onClick={() => apresentar(c.carta)}
              >
                <span className="opcao-marca" aria-hidden>
                  ❦
                </span>
                <span className="opcao-rotulo-texto">
                  {interpolar(c.rotulo, detective)}
                  {jaApresentada && !c.travado && (
                    <span className="text-stone-500 italic"> · já apresentada</span>
                  )}
                  {c.travado && (
                    <span className="block mt-1 text-stone-400 italic text-[0.8rem] leading-snug">
                      Tome-lhe primeiro o paradeiro: ainda não declarou onde passou a noite.
                    </span>
                  )}
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

      {porColher > 0 && (
        <p className="mt-5 text-amber-300/70 text-xs italic font-serif tracking-wide" data-por-colher={porColher}>
          {porColher === 1
            ? 'Ficou um termo por anotar: em negrito na fala, vai para a mesa só quando se clica nele.'
            : `Ficaram ${POR_EXTENSO[porColher] || porColher} termos por anotar: em negrito na fala, vão para a mesa só quando se clica neles.`}
        </p>
      )}

      {/* O rodapé permanente dizia «e o que ficou por anotar continua ao
          alcance da mão», que é palavra por palavra o aviso contingente logo
          acima — mesma tela, mesma camada, mesma informação. Fica o aviso, que
          é o que traz a contagem; sai a duplicata (e com ela o travessão da
          fórmula «não X — mas Y»). Pipeline `revisar-prosa` de 27/07/2026. */}
      <p className="mt-5 text-stone-400 text-xs italic font-serif tracking-wide">
        A conversa desce e não volta: cada pergunta escolhida descarta as outras, mas o que ele
        declarou fica escrito. Confrontar com uma prova só se abre quando ela está na mesa, e não
        gasta a vez. Interrogar não custa tempo; o relógio só corre quando você viaja.
      </p>
    </Overlay>
  );
}
