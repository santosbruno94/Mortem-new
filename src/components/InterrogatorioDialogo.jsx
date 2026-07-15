import { useState } from 'react';
import { useJogo, MAX_PERGUNTAS } from '../store/jogo.js';
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

// Interrogatório como DIÁLOGO (§7.1 + §7.2): árvore ramificada determinística
// com escolhas irreversíveis. O perito tem MAX_PERGUNTAS perguntas por
// interrogado (2 de 4); as que não faz se perdem. Apresentar prova (Onda 5) é
// ortogonal: o seletor aceita qualquer carta, sem limite. O nó corrente é
// estado local; as escolhas feitas persistem em escolhasDialogo no store.
export default function InterrogatorioDialogo({ localidadeId, dialogoId }) {
  const detective = useJogo((s) => s.detective);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const nosVisitadosDialogo = useJogo((s) => s.nosVisitadosDialogo);
  const visitarNoDialogo = useJogo((s) => s.visitarNoDialogo);
  const provasApresentadas = useJogo((s) => s.provasApresentadas);
  const apresentarProva = useJogo((s) => s.apresentarProva);
  const registrarConfronto = useJogo((s) => s.registrarConfronto);
  const escolhasDialogo = useJogo((s) => s.escolhasDialogo);
  const registrarEscolhaDialogo = useJogo((s) => s.registrarEscolhaDialogo);
  const fecharOverlay = useJogo((s) => s.fecharOverlay);

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

  // Estado de escolhas do interrogatório (§7.2): 2 de 4 perguntas por suspeito.
  const escolhas = escolhasDialogo[dialogo.suspeitoId] || [];
  const esgotado = escolhas.length >= MAX_PERGUNTAS;
  const noHub = noAtual === dialogo.noInicial;
  const perguntasRestantes = Math.max(0, MAX_PERGUNTAS - escolhas.length);

  const irPara = (destino) => {
    setNoAtual(destino);
    setCartaApresentada(null);
    visitarNoDialogo(dialogo.suspeitoId, destino);
  };

  // Escolher assunto no hub (§7.2): registra a escolha (irreversível) e navega.
  const escolherAssunto = (opcao) => {
    registrarEscolhaDialogo(dialogo.suspeitoId, opcao.id);
    irPara(opcao.vaiPara);
  };

  // O gesto de apresentar (Onda 5): registra no store (que anota ao mural o
  // confronto de paradeiro, quando é o caso) e navega — reação específica se
  // a árvore a tem, evasiva do personagem para todo o resto.
  const apresentar = (carta) => {
    apresentarProva(dialogo.suspeitoId, carta.id);
    const destino = (dialogo.reacoesProva || {})[carta.id] || dialogo.noEvasiva;
    const consequencia = (dialogo.consequencias || {})[carta.id] || null;
    registrarConfronto(dialogo.suspeitoId, carta.id, consequencia);
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

  // Opções visíveis: filtra confrontos sem carta E perguntas já consumidas.
  const opcoesVisiveis = (no.opcoes || []).filter((op) => {
    if (op.requerCarta && !temCarta(op.requerCarta)) return false;
    if (noHub && op.id && escolhas.includes(op.id)) return false;
    return true;
  });

  // No hub, separa perguntas (consomem slot, têm id, sem requerCarta) de confrontos autorais.
  const perguntasHub = noHub ? opcoesVisiveis.filter((op) => op.id && !op.requerCarta) : [];
  const confrontosHub = noHub ? opcoesVisiveis.filter((op) => !!op.requerCarta) : [];

  // Nó folha: fora do hub e sem opções próprias — renderiza navegação contextual.
  const ehFolha = !noHub && opcoesVisiveis.length === 0;

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
          Sobre a mesa, entre os dois: &ldquo;{cartaApresentada.textoDisplay}&rdquo;.
        </p>
      )}

      {/* A fala corrente do suspeito (com os termos extraíveis) */}
      <div data-no-dialogo={noAtual} className="space-y-3">
        {no.fala.map((t, i) => (
          <ParagrafoProsa key={`${noAtual}_${i}`} texto={t} />
        ))}
      </div>

      {/* Fala de esgotamento (§7.2): quando o perito já fez todas as perguntas,
          o personagem acrescenta uma frase de despedida. */}
      {noHub && esgotado && dialogo.falaEsgotada && (
        <div className="mt-4 space-y-3">
          {dialogo.falaEsgotada.map((t, i) => (
            <ParagrafoProsa key={`esgotada_${i}`} texto={t} />
          ))}
        </div>
      )}

      {/* Narrativa de consequência (semente — infraestrutura futura) */}
      {cartaApresentada && (dialogo.consequencias || {})[cartaApresentada.id]?.narrativa && (
        <p className="mt-3 text-stone-400 text-xs italic font-serif">
          {(dialogo.consequencias || {})[cartaApresentada.id].narrativa}
        </p>
      )}

      {/* As escolhas do perito: assuntos, confrontos e o seletor de provas */}
      <div className="mt-6 space-y-2" data-opcoes-dialogo>
        {/* Perguntas do hub (§7.2): cada clique consome 1 de MAX_PERGUNTAS */}
        {noHub && !esgotado && perguntasHub.map((op) => {
          const jaVisto = visitados.includes(op.vaiPara);
          return (
            <button
              key={op.id}
              type="button"
              className="opcao-dialogo"
              onClick={() => escolherAssunto(op)}
            >
              <span className="opcao-marca" aria-hidden>
                {jaVisto ? '§' : '›'}
              </span>
              <span className="opcao-rotulo-texto">{interpolar(op.rotulo, detective)}</span>
              {jaVisto && <span className="opcao-visto">já perguntado</span>}
            </button>
          );
        })}

        {/* Confrontos autorais do hub (requerCarta) — ortogonais ao limite */}
        {noHub && confrontosHub.map((op) => (
          <button
            key={op.rotulo}
            type="button"
            className="opcao-dialogo opcao-dialogo--confronto"
            data-confronto=""
            onClick={() => irPara(op.vaiPara)}
          >
            <span className="opcao-marca" aria-hidden>❦</span>
            <span className="opcao-rotulo-texto">{interpolar(op.rotulo, detective)}</span>
          </button>
        ))}

        {/* Opções de nós que não são o hub (respostas, confrontos etc.) */}
        {!noHub && opcoesVisiveis.map((op) => {
          const ehConfronto = !!op.requerCarta;
          const jaVisto = !ehConfronto && visitados.includes(op.vaiPara);
          return (
            <button
              key={op.rotulo}
              type="button"
              className={`opcao-dialogo ${ehConfronto ? 'opcao-dialogo--confronto' : ''}`}
              data-confronto={ehConfronto ? '' : undefined}
              onClick={() => irPara(op.vaiPara)}
            >
              <span className="opcao-marca" aria-hidden>
                {ehConfronto ? '❦' : jaVisto ? '§' : '›'}
              </span>
              <span className="opcao-rotulo-texto">{interpolar(op.rotulo, detective)}</span>
              {jaVisto && <span className="opcao-visto">já perguntado</span>}
            </button>
          );
        })}

        {/* Navegação contextual de folha: volta ao hub para outra pergunta ou
            para apresentar provas. */}
        {ehFolha && (
          <button
            type="button"
            className="opcao-dialogo opcao-dialogo--voltar"
            onClick={() => irPara(dialogo.noInicial)}
          >
            <span className="opcao-marca" aria-hidden>↩</span>
            <span className="opcao-rotulo-texto">
              {esgotado ? 'Voltar ao interrogatório' : 'Outra pergunta'}
            </span>
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

        {/* Encerrar: no hub quando esgotado e não há mais o que fazer */}
        {noHub && esgotado && (
          <button
            type="button"
            className="opcao-dialogo opcao-dialogo--voltar"
            onClick={() => fecharOverlay()}
          >
            <span className="opcao-marca" aria-hidden>↩</span>
            <span className="opcao-rotulo-texto">Encerrar o interrogatório</span>
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

      {/* Contador de perguntas restantes (só no hub, só antes de esgotar) */}
      {noHub && !esgotado && (
        <p className="mt-2 text-stone-500 text-[10px] tracking-wide">
          {perguntasRestantes === 1 ? '1 pergunta restante' : `${perguntasRestantes} perguntas restantes`}
        </p>
      )}

      <p className="mt-5 text-stone-400 text-xs italic font-serif tracking-wide">
        Apresentar uma prova exige tê-la registrado na mesa. Interrogar não custa tempo; o relógio
        só corre quando você viaja.
      </p>
    </Overlay>
  );
}
