import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import PlantaRelojoaria from './PlantaRelojoaria.jsx';
import Planta from './Planta.jsx';
import { modoFlat } from '../logic/webgl.js';
import {
  obterVerdadeDeOuro,
  obterParametrosCena,
  obterLocalidade,
  obterNo,
  obterDialogos,
  obterPersonagemDaLocalidade,
} from '../data/pacote_caso.js';
import { ipmAtual } from '../logic/tempo.js';
import { interpolar } from '../logic/interpolar.js';
import { ParagrafoProsa } from './ProsaComTermos.jsx';
import Overlay from './Overlay.jsx';
import TermometroCorpo from './TermometroCorpo.jsx';
import CenaDialogo from './CenaDialogo.jsx';
import PranchaCorpo from './corpo3d/PranchaCorpo.jsx';
import FalaDoLegista from './localidade/FalaDoLegista.jsx';
import NotaFrescor from './localidade/NotaFrescor.jsx';
import BotaoTelegrafo from './localidade/BotaoTelegrafo.jsx';
import GestoPericial from './localidade/GestoPericial.jsx';

// O exame do corpo é PRANCHA de atlas em SVG (pivô "Gabinete Ilustrado"):
// a prancha é a vista padrão, aposentado o cadáver 3D (nota de design §8.1).
// SVG puro — joga sem WebGL, sem arquivo de arte, e o ?flat=1 segue sem
// canvas. A prosa continua sendo o caminho canônico de extração.

// Evento de localidade (§5): prosa imersiva com termos clicáveis em
// negrito. Clicar no termo extrai a carta com carimbo integrado (§6),
// custando o tempo da carta. O estado dos termos do corpo acompanha a
// degradação (IPM corrente) até o momento da extração.
export default function EventoLocalidade({ localidadeId }) {
  const detective = useJogo((s) => s.detective);
  const horasJogo = useJogo((s) => s.horasJogo);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const interferenciasDisparadas = useJogo((s) => s.interferenciasDisparadas);
  const abrirOverlay = useJogo((s) => s.abrirOverlay);
  // Quais pontos de interesse estão abertos (revelados). Estado local de UI:
  // a coleta em camadas é escolha do jogador, não muda o motor.
  const [pontosAbertos, setPontosAbertos] = useState({});

  const localidade = obterLocalidade(localidadeId);
  if (!localidade) return null;
  // Hora de chegada do pacote — mesmo IPM que o store computa (A3).
  const ipm = ipmAtual(horasJogo, obterVerdadeDeOuro().horasMorteAntesChegada, obterParametrosCena().horasChegada);

  // A prosa imersiva pousa sobre o couro escuro: serifada e legível. O
  // renderizador de [[id]]/interpolação é o util compartilhado (§7.1).
  const renderParagrafo = (texto, indice) => <ParagrafoProsa key={indice} texto={texto} />;

  const personagemDaCena = obterPersonagemDaLocalidade(localidade.id);
  const ehCorpo = localidade.id === 'corpo';
  // A planta baixa (§5.1) só aparece nos nós do mesmo prédio — o grupo
  // relojoaria de src/data/mapa.js. Camada visual: lê o grupo, nunca o motor.
  const naRelojoaria = obterNo(localidade.id)?.grupo === 'relojoaria';
  // Pontos de interesse (§5.1): quando existem, a prosa se divide em pontos
  // clicáveis (acordeão); senão, a prosa monolítica de sempre.
  const temPontos = Array.isArray(localidade.pontos) && localidade.pontos.length > 0;
  const alternarPonto = (id) => setPontosAbertos((s) => ({ ...s, [id]: !s[id] }));

  // A planta da cena procedural (§5.1 / OS Vila Viva E1): a planta gerada
  // (localidade.planta) desenha os cômodos e liga cada um ao ponto do
  // acordeão que dele deriva (pt_cena_<comodo> tem `comodo === c.id`).
  // Camada VISUAL: o motor não a lê. Fallback obrigatório — sem planta no
  // pacote OU em ?flat=1, o acordeão de sempre assume, idêntico.
  // A planta do prédio da cena aparece na cena E no corpo (ambos a têm no
  // pacote gerado — a `plantaLigada` com os alvos corpo↔cena): o perito anda
  // entre os dois pela planta, a 0h, como no caso-escola. O acordeão (modo
  // ponto) só existe onde há pontos (a cena); no corpo, a planta é só viagem.
  const mostrarPlantaCena = !!localidade.planta && !modoFlat();
  const pontoDoComodo = (comodoId) => (localidade.pontos || []).find((p) => p.comodo === comodoId);
  const comodosAtivos = (localidade.pontos || []).filter((p) => pontosAbertos[p.id]).map((p) => p.comodo);
  // Clicar um cômodo na planta abre o ponto correspondente e o traz à vista.
  const abrirComodoNaPlanta = (comodoId) => {
    const ponto = pontoDoComodo(comodoId);
    if (!ponto) return;
    setPontosAbertos((s) => ({ ...s, [ponto.id]: true }));
    if (typeof document !== 'undefined') {
      requestAnimationFrame(() =>
        document.querySelector(`[data-ponto="${ponto.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      );
    }
  };
  const idsDoTexto = (paragrafos) => [
    ...new Set(paragrafos.flatMap((p) => [...p.matchAll(/\[\[(\w+)\]\]/g)].map((m) => m[1]))),
  ];

  // Prosa condicional: parágrafos que só entram quando TODAS as cartas
  // exigidas já estão na mesa (ex.: o confronto da segunda visita ao réu,
  // depois de colhido o registro que o desmente). Camada narrativa — o
  // motor nunca lê; a condição usa só ids de carta registrada.
  const paragrafosCondicionais = (localidade.prosaCondicional || [])
    .filter((bloco) => bloco.requerCartas.every((id) => cartasRegistradas.some((c) => c.id === id)))
    .flatMap((bloco) => bloco.paragrafos);

  // Blocos CONTINGENTES da interferência (FASE 6 do gerador): prosa que
  // aparece/some conforme o evento do pacote já disparou. Camada de UI
  // pura — lê o estado de disparo (interferenciasDisparadas), nunca decide
  // nada; o efeito mecânico continua nos gates de extrairCarta.
  const eventosDisparados = new Set(interferenciasDisparadas.map((d) => d.id));
  const paragrafosContingentes = (localidade.blocosContingentes || [])
    .filter((bloco) =>
      bloco.quando === 'disparado'
        ? eventosDisparados.has(bloco.eventoId)
        : !eventosDisparados.has(bloco.eventoId)
    )
    .flatMap((bloco) => bloco.paragrafos);

  // Contador de esgotamento (regalia do caso-escola): quantas observações
  // esta localidade oferece e quantas já estão na mesa. O procedural pode
  // omitir — a contagem é leitura dos marcadores [[id]] da prosa, não regra.
  // Os micro-gestos (Onda 7) entram na união: gesto também é observação.
  const fonteProsa = [
    ...(temPontos ? localidade.pontos.flatMap((p) => p.prosa) : localidade.prosa || []),
    ...paragrafosContingentes,
  ];
  const idsGestos = [
    ...(localidade.gestos || []).map((g) => g.cartaId),
    ...(temPontos ? localidade.pontos.flatMap((p) => (p.gestos || []).map((g) => g.cartaId)) : []),
  ];
  const idsExtraiveis = [
    ...new Set(
      fonteProsa
        .flatMap((p) => [...p.matchAll(/\[\[(\w+)\]\]/g)].map((m) => m[1]))
        .concat(localidade.acoesEspeciais.includes('termometro') ? ['ev_algor'] : [])
        .concat(idsGestos)
    ),
  ];
  const nRegistradas = idsExtraiveis.filter((id) => cartasRegistradas.some((c) => c.id === id)).length;

  // Diálogos embutidos neste lugar (origemLocalidade): rendem um botão de
  // conversa ao pé da prosa. Camada narrativa — o motor não participa.
  const dialogosEmbutidos = Object.entries(obterDialogos()).filter(
    ([, d]) => d.origemLocalidade === localidade.id
  );

  const prosaEExames = (
    <>
      {/* A cena ilustrada de quem recebe o perito (Sistema 2): fundo 2D +
          sprite meio-corpo. No corpo não há anfitrião — a prancha ocupa o
          painel; aqui o componente se cala (personagemDaCena nulo). */}
      <CenaDialogo
        personagemId={personagemDaCena}
        localidadeId={localidade.id}
        grupo={obterNo(localidade.id)?.grupo}
      />
      {temPontos ? (
        <div className="space-y-3">
          {(localidade.introducao || []).map((t, i) => renderParagrafo(t, `intro_${i}`))}
          <div className="space-y-2">
            {localidade.pontos.map((ponto) => {
              const aberto = !!pontosAbertos[ponto.id];
              const idsPonto = [
                ...idsDoTexto(ponto.prosa),
                ...(ponto.gestos || []).map((g) => g.cartaId),
              ];
              const nReg = idsPonto.filter((id) => cartasRegistradas.some((c) => c.id === id)).length;
              return (
                <div key={ponto.id} data-ponto={ponto.id} className="ponto-bloco">
                  <button
                    type="button"
                    className="ponto-interesse"
                    aria-expanded={aberto}
                    onClick={() => alternarPonto(ponto.id)}
                  >
                    <span className="ponto-seta" aria-hidden>{aberto ? '▾' : '▸'}</span>
                    <span className="ponto-rotulo-texto">{ponto.rotulo}</span>
                    <span className="ponto-contador">{nReg}/{idsPonto.length}</span>
                  </button>
                  {aberto && (
                    <div className="ponto-corpo space-y-3">
                      {ponto.prosa.map((t, i) => renderParagrafo(t, `${ponto.id}_${i}`))}
                      {(ponto.gestos || []).map((g) => (
                        <GestoPericial key={g.id} gesto={g} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {paragrafosCondicionais.map((texto, i) => renderParagrafo(texto, `cond_${i}`))}
          {paragrafosContingentes.map((texto, i) => renderParagrafo(texto, `intf_${i}`))}
        </div>
      ) : (
        <div className="space-y-4">
          {localidade.prosa.map(renderParagrafo)}
          {paragrafosCondicionais.map((texto, i) => renderParagrafo(texto, `cond_${i}`))}
          {paragrafosContingentes.map((texto, i) => renderParagrafo(texto, `intf_${i}`))}
        </div>
      )}
      {/* Micro-gestos da localidade (Onda 7): o verbo encosta na ficção —
          voltar o corpo, dar corda — no espírito do termômetro. */}
      {(localidade.gestos || []).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {localidade.gestos.map((g) => (
            <GestoPericial key={g.id} gesto={g} />
          ))}
        </div>
      )}
      {ehCorpo && <FalaDoLegista cartas={cartasRegistradas} />}
      {ehCorpo && <NotaFrescor ipm={ipm} />}
      {localidade.acoesEspeciais.includes('termometro') && <TermometroCorpo />}
      {localidade.acoesEspeciais.includes('telegrafo') && <BotaoTelegrafo />}
      {/* Diálogo embutido (Onda 6): pessoas que vivem DENTRO de um lugar
          (Walter na estalagem, Davey na oficina) conversam por um botão —
          o overlay 'dialogo' abre a árvore por cima da mesa, custo zero. */}
      {dialogosEmbutidos.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {dialogosEmbutidos.map(([id, d]) => (
            <button
              key={id}
              type="button"
              className="botao-dialogo-local botao-mesa text-xs sm:text-sm"
              onClick={() => abrirOverlay('dialogo', id)}
            >
              {d.chamada}
            </button>
          ))}
        </div>
      )}
      {idsExtraiveis.length > 0 && (
        <p className="mt-6 text-stone-400 text-xs font-serif tracking-wide">
          § {nRegistradas} de {idsExtraiveis.length} observações registradas aqui.
        </p>
      )}
      <p className="mt-2 text-stone-400 text-xs italic font-serif tracking-wide">
        Termos em negrito são examinados e registrados na mesa — examinar não custa tempo; o relógio só corre quando você viaja.
      </p>
    </>
  );

  return (
    <Overlay
      titulo={interpolar(localidade.titulo, detective)}
      subtitulo={localidade.subtitulo}
      largura={ehCorpo ? 'max-w-5xl' : 'max-w-2xl'}
    >
      {/* A planta baixa (§5.1): andar entre os cômodos do mesmo prédio. */}
      {naRelojoaria && <PlantaRelojoaria localidadeAtual={localidade.id} />}
      {/* A planta da cena procedural (OS Vila Viva E1): desenha os cômodos
          do grid e liga cada um ao ponto do acordeão. Não é navegação de
          nós — é destaque do cômodo aberto. */}
      {mostrarPlantaCena && (
        <Planta
          planta={localidade.planta}
          localidadeAtual={localidade.id}
          comodosAtivos={temPontos ? comodosAtivos : undefined}
          onComodoClick={temPontos ? abrirComodoNaPlanta : undefined}
        />
      )}
      {ehCorpo ? (
        // O exame em dois painéis: a PRANCHA de atlas acompanha a prosa.
        // A prancha é redundância deliberada — clicar num hotspot extrai as
        // MESMAS cartas dos termos em negrito, que continuam valendo.
        <div className="lg:grid lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-6 lg:items-start">
          <div className="lg:sticky lg:top-2 mb-4 lg:mb-0">
            <PranchaCorpo ipm={ipm} />
          </div>
          <div>{prosaEExames}</div>
        </div>
      ) : (
        prosaEExames
      )}
    </Overlay>
  );
}
