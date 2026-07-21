import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import PlantaRelojoaria from './PlantaRelojoaria.jsx';
import {
  obterCaso,
  obterVerdadeDeOuro,
  obterLocalidade,
  obterNo,
  obterDialogos,
  obterPersonagemDaLocalidade,
} from '../data/pacote_caso.js';
import { ipmAtual } from '../logic/tempo.js';
import { interpolar } from '../logic/interpolar.js';
import { lerCorpo, falaDoMestre } from '../logic/falaDoMestre.js';
import { verbeteParaCarta } from '../data/glossario.js';
import { modoDoCaso } from '../data/casos.js';
import { ParagrafoProsa } from './ProsaComTermos.jsx';
import Overlay from './Overlay.jsx';
import TermometroCorpo from './TermometroCorpo.jsx';
import CenaDialogo from './CenaDialogo.jsx';
import PranchaCorpo from './corpo3d/PranchaCorpo.jsx';

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
  const ipm = ipmAtual(horasJogo, obterVerdadeDeOuro().horasMorteAntesChegada);

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

// A leitura forense FALADA pelo mestre/legista (§4): some o mostrador das
// antigas gavetas; a interpretação vem por um personagem, em fala natural,
// e CRESCE conforme o jogador examina (pull — responde ao que foi visto).
// No procedural não há vozMestre nas cartas: este bloco fica vazio e o
// jogador, já perito, lê o corpo por conta própria.
// Visual: aparte com filete de latão à esquerda e fala em serif itálico.
// Micro-gesto pericial (Onda 7): botão-gesto no espírito do "Medir
// temperatura" — o clique É o gesto do perito e extrai a carta pelo MESMO
// extrairCarta dos termos (motor intocado). Feito = a carta está na mesa.
function GestoPericial({ gesto }) {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const extrairCarta = useJogo((s) => s.extrairCarta);
  const feito = cartasRegistradas.some((c) => c.id === gesto.cartaId);
  return (
    <button
      type="button"
      className={`gesto-pericial botao-mesa text-xs sm:text-sm ${feito ? 'botao-mesa--quieto' : ''}`}
      data-feito={feito ? '' : undefined}
      disabled={feito}
      onClick={() => extrairCarta(gesto.cartaId)}
    >
      {gesto.rotulo}
      {feito && <span className="text-stone-400"> · feito</span>}
    </button>
  );
}

// E3 §4.6 — o telegrama: consulta por fio ao registro distante, expedida
// da delegacia. Camada de apresentação pura: os dados (destino, latência,
// resposta) vêm do pacote; o botão só aparece depois que o lead revelou o
// nó da comarca (antes disso não há o que consultar). A resposta chega
// pelo relógio mole (store.viajarPara).
function BotaoTelegrafo() {
  const enviado = useJogo((s) => s.telegramaEnviado);
  const nosDesbloqueados = useJogo((s) => s.nosDesbloqueados);
  const telegrafar = useJogo((s) => s.telegrafar);
  const t = obterCaso().telegrama;
  if (!t) return null;
  if (!nosDesbloqueados.some((id) => id.startsWith('comarca_'))) return null;
  const feito = !!enviado;
  return (
    <div className="mt-4">
      <button
        type="button"
        className={`botao-mesa text-xs sm:text-sm ${feito ? 'botao-mesa--quieto' : ''}`}
        disabled={feito}
        onClick={telegrafar}
      >
        {feito
          ? enviado.entregue
            ? 'Telegrama respondido · na mesa'
            : 'Telegrama expedido · aguarda resposta'
          : `Telegrafar a ${t.destino}`}
      </button>
    </div>
  );
}

function FalaDoLegista({ cartas }) {
  // O mestre (Dr. Alcott) não veio: Harlan examina só, e a voz do mestre lhe
  // guia o olho por dentro (a mesma convenção do eco pós-falha — a voz de
  // Alcott na cabeça do aprendiz). Itens 7 e 2 do playtest de 19/07: os
  // apartes vozMestre são leitura técnica — observação, não conclusão; e
  // remetem ao Glossário ("o mestre já falou disso"), onde o tutorial ensina
  // a ler o sinal em vez de o entregar mastigado. O link vem UMA vez por
  // extenso (o resto é affordance curto), para a frase não virar papel de
  // parede. Modo purista (Onda 8): a SÍNTESE cala; os apartes ficam.
  const modoPurista = useJogo((s) => s.modoPurista);
  const casoId = useJogo((s) => s.casoId);
  const abrirGlossario = useJogo((s) => s.abrirGlossario);
  // Nos casos GERADOS não há mestre a ecoar (playtest de 19/07, P1): quem
  // examina é o próprio perito, sem voz de terceiro — nem aparte, nem síntese.
  if (modoDoCaso(casoId) !== 'tutorial') return null;
  const asides = cartas.filter((c) => c.localidade === 'corpo' && c.vozMestre);
  const primeiroComVerbete = asides.findIndex((c) => verbeteParaCarta(c.tagsOcultas));
  const { tempo, causa } = falaDoMestre(lerCorpo(cartas));
  const sintese = !modoPurista && (tempo || causa);
  if (asides.length === 0 && !sintese) return null;
  return (
    <div className="mt-5 border-l-2 border-latao/70 pl-4 space-y-2">
      <p className="text-rotulo uppercase text-latao-claro/70">A voz do mestre</p>
      {asides.map((c, i) => {
        const verbete = verbeteParaCarta(c.tagsOcultas);
        return (
          <div key={c.id} className="space-y-1">
            <p className="font-serif italic text-stone-200 text-sm leading-relaxed">“{c.vozMestre}”</p>
            {verbete && (
              <button
                type="button"
                onClick={() => abrirGlossario(verbete.id)}
                className="text-xs text-latao-claro/70 hover:text-latao-claro underline decoration-dotted underline-offset-2"
              >
                {i === primeiroComVerbete
                  ? '§ o mestre já falou disso — veja no Glossário'
                  : '§ ver no Glossário'}
              </button>
            )}
          </div>
        );
      })}
      {sintese && (
        <div className="pt-2 mt-1 border-t border-latao/30 space-y-1">
          {tempo && <p className="font-serif italic text-amber-100/90 text-sm leading-relaxed">“{tempo}”</p>}
          {causa && <p className="font-serif italic text-amber-100/90 text-sm leading-relaxed">“{causa}”</p>}
        </div>
      )}
    </div>
  );
}

// Legibilidade do perecível (telegrafia + anúncio): o corpo avisa, em fala
// concreta, que a leitura do tempo se esvai — antes de se perder, e no
// momento em que se perde. Calculado do IPM corrente; nenhuma regra depende.
// Visual: pequena etiqueta de pergaminho pousada sob a prosa.
function NotaFrescor({ ipm }) {
  let texto;
  if (ipm <= 24) {
    texto =
      'O corpo ainda guarda a hora com nitidez — mas não vai durar: a rigidez e o calor se desfazem com as horas. O que se quiser datar com precisão, date cedo.';
  } else if (ipm <= 36) {
    texto =
      'A rigidez já cede e o corpo esfria: a leitura do tempo perde o fio. Ainda dá para datar, porém com margem mais larga.';
  } else {
    texto =
      'O corpo afrouxou de todo e igualou o frio da sala: a hora da morte agora só se lê em dias, não em horas. A precisão, essa já se foi — mas o livor fixo ainda crava que foi há mais de meio dia.';
  }
  return (
    <div className="mt-4 carta-pergaminho rounded-sm px-3 py-2">
      <p className="text-tinta-clara text-sm font-serif italic leading-relaxed">{texto}</p>
    </div>
  );
}
