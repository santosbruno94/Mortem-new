import { useState, useEffect, useRef } from 'react';
import { useJogo } from '../store/jogo.js';
import { obterSuspeitos } from '../data/pacote_caso.js';
import { CATALOGO_CAUSAS } from '../data/catalogo_causas.js';
import { ANCORAS, analisarLigacoes, horaAlegada } from '../logic/acusacao.js';
import { formatJanela } from '../logic/tempo.js';
import { deQuem } from '../logic/monologo.js';
import { tocarSom } from '../som.js';
import EstacaoCorpo from './mural/EstacaoCorpo.jsx';
import { EstacaoPresenca, EstacaoMentiras, EstacaoMobil, EstacaoJuizos } from './mural/Estacoes.jsx';
import RevisaoFinal from './mural/RevisaoFinal.jsx';
import FormularioInquerito from './mural/FormularioInquerito.jsx';
import { LegendaBarbantes } from './mural/MesaLigacao.jsx';


// =====================================================================
// A MESA DE CONSTRUÇÃO — agora em ESTAÇÕES que crescem uma na outra.
//
// A acusação é construída aos poucos, na MESMA mesa. Cada estação mostra só
// as cartas da sua categoria; ao CONCLUIR, ela vira um resumo fixado e a
// próxima aparece. Arrastar um resumo de volta reabre a estação.
//
//   1. O Corpo      — declara janela e causa e ASSINALA os sinais (sem fio).
//   2. A Presença   — nomeia o réu e LIGA (barbante) o vestígio à cena.
//   3. As Mentiras  — LIGA (barbante) um fato físico ao depoimento que ele desmente.
//   4. O Móbil      — aponta o móbil.
//   5. Os Juízos    — culpado / inocente / sem juízo para cada não-acusado.
//
// O significado de cada vínculo é DERIVADO das tags (src/logic/acusacao.js).
// "Assinalar um sinal" é, por baixo, a MESMA ligação que o barbante criava
// (carta → âncora) — só muda o visual (um selo, não um fio). O motor lê igual.
// Nada valida até "Levar a julgamento": só o desfecho julga.
// =====================================================================

// Predicados de categoria (camada visual; o motor lê as tags por conta própria).
const ehTemporal = (c) => c.tagsOcultas.dominio === 'temporal';
const ehCausal = (c) => c.tagsOcultas.dominio === 'causal';
const ehVestigioOuAmbiental = (c) =>
  c.tagsOcultas.dominio === 'vestigio' || c.tagsOcultas.dominio === 'ambiental';
const ehMotivo = (c) => c.tagsOcultas.subDominio === 'motivo';
const ehCorroboracao = (c) => c.tagsOcultas.subDominio === 'corroboracao';
const ehAlibiDe = (c, sid) => c.tagsOcultas.subDominio === 'alibi' && c.tagsOcultas.declaranteId === sid;

const ETAPAS = [
  { id: 'corpo', titulo: 'I · O Corpo', subtitulo: 'quando e como' },
  { id: 'presenca', titulo: 'II · A Presença', subtitulo: 'o réu na cena' },
  { id: 'mentiras', titulo: 'III · As Mentiras', subtitulo: 'depoimentos desmentidos' },
  { id: 'mobil', titulo: 'IV · O Móbil', subtitulo: 'a razão do crime' },
  { id: 'juizos', titulo: 'V · Os Juízos', subtitulo: 'sobre cada não-acusado' },
];

// Estado de navegação ao montar o mural: primeira visita começa do zero
// (revelação progressiva); numa retentativa (a acusação já tem substância),
// tudo aparece e abre-se a primeira parte estruturalmente por concluir (Q9).
function estadoInicialNavegacao(acusacao) {
  const virgem =
    !acusacao.reuId &&
    acusacao.janela.inicio == null &&
    acusacao.janela.fim == null &&
    !acusacao.causaId;
  if (virgem) return { revelado: 1, etapaAberta: 0 };
  let aberta = 4; // juízos, quando o resto está de pé
  if (acusacao.janela.inicio == null || acusacao.janela.fim == null || !acusacao.causaId) aberta = 0;
  else if (!acusacao.reuId) aberta = 1;
  else if (!acusacao.motivacaoId) aberta = 3;
  return { revelado: ETAPAS.length, etapaAberta: aberta };
}

export default function MuralAcusacao() {
  const cartas = useJogo((s) => s.cartasRegistradas);
  const acusacao = useJogo((s) => s.acusacao);
  const definirReu = useJogo((s) => s.definirReu);
  const definirJanela = useJogo((s) => s.definirJanela);
  const definirCausa = useJogo((s) => s.definirCausa);
  const definirMotivacao = useJogo((s) => s.definirMotivacao);
  const definirJuizo = useJogo((s) => s.definirJuizo);
  const adicionarLigacao = useJogo((s) => s.adicionarLigacao);
  const removerLigacao = useJogo((s) => s.removerLigacao);
  const submeterAcusacao = useJogo((s) => s.submeterAcusacao);
  const fecharOverlay = useJogo((s) => s.fecharOverlay);

  // `revelado`: quantas estações já apareceram (começa em 1 — só o Corpo).
  // `etapaAberta`: qual estação está aberta para edição (ou null = todas recolhidas).
  // Numa RETENTATIVA (a acusação já tem corpo), o mural reabre inteiro e na
  // primeira pendência — não força o jogador a re-percorrer as estações (Q9).
  const [{ revelado, etapaAberta }, setNavegacao] = useState(() => estadoInicialNavegacao(acusacao));
  const setRevelado = (v) => setNavegacao((n) => ({ ...n, revelado: v }));
  const setEtapaAberta = (v) => setNavegacao((n) => ({ ...n, etapaAberta: v }));
  const [revisando, setRevisando] = useState(false); // a revisão final, antes de julgar

  // Ligações: helpers usados tanto pelo "assinalar" do Corpo quanto pelo barbante.
  function ligacaoEntre(a, b) {
    return acusacao.ligacoes.find(
      (l) => (l.de === a && l.para === b) || (l.de === b && l.para === a)
    );
  }
  function estaLigada(a, b) {
    return !!ligacaoEntre(a, b);
  }
  function alternarLigacao(a, b) {
    const existe = ligacaoEntre(a, b);
    if (existe) removerLigacao(existe.id);
    else adicionarLigacao(a, b);
    tocarSom('barbante');
  }

  // Cartas por categoria (sem ordenar/destacar relevância — só agrupar por tipo).
  const temporais = cartas.filter(ehTemporal);
  const causais = cartas.filter(ehCausal);
  const vestigios = cartas.filter(ehVestigioOuAmbiental);
  const corroboracoes = cartas.filter(ehCorroboracao);
  // Alvos da Estação III: as alegações de HORA (relógio encenado, avistamentos)
  // e — com o réu nomeado — o paradeiro que ele próprio declarou (Q4).
  const mentirasAlvo = [
    ...cartas.filter((c) => horaAlegada(c) !== null),
    ...(acusacao.reuId ? cartas.filter((c) => ehAlibiDe(c, acusacao.reuId)) : []),
  ];
  // Fontes da Estação III: os fatos do corpo e os registros de testemunho
  // (a corroboração de Moorford derruba o paradeiro do réu).
  const fontesMentiras = [...temporais, ...corroboracoes];
  const motivos = cartas.filter(
    (c) => ehMotivo(c) && (!acusacao.reuId || c.tagsOcultas.ligadoA === acusacao.reuId)
  );

  // O CORPO é lido, não selecionado: as evidências do corpo que o jogador
  // COLETOU entram automaticamente como base (a mesma ligação que o motor lê),
  // para o motor seguir julgando a hora/causa. A dedução continua sendo declarar
  // a janela e a causa certas — e, sem o sinal que distingue a causa, ela não crava.
  useEffect(() => {
    // Filtra ANTES de ligar (não confiar só na dedupe de adicionarLigacao,
    // que mora noutro arquivo): o efeito roda a cada mount do mural e não
    // pode depender da idempotência remota para não duplicar ligações.
    const jaLigada = (cartaId, ancora) =>
      useJogo
        .getState()
        .acusacao.ligacoes.some(
          (l) => (l.de === cartaId && l.para === ancora) || (l.de === ancora && l.para === cartaId)
        );
    cartas.forEach((c) => {
      if (c.tagsOcultas.dominio === 'temporal') {
        if (!jaLigada(c.id, ANCORAS.quando)) adicionarLigacao(c.id, ANCORAS.quando);
      } else if (c.tagsOcultas.dominio === 'causal' && (c.tagsOcultas.sinal || c.tagsOcultas.instrumento)) {
        if (!jaLigada(c.id, ANCORAS.como)) adicionarLigacao(c.id, ANCORAS.como);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartas]);

  // Completude NEUTRA (nunca acerto/erro), para o lembrete "ainda falta".
  const { sustentaQuando, sustentaComo, sustentaPresenca, refutaHora, refutaAlibi } =
    analisarLigacoes(acusacao, cartas);
  const naoAcusados = obterSuspeitos().filter((sp) => sp.id !== acusacao.reuId);
  const lacunas = [];
  if (acusacao.janela.inicio == null || acusacao.janela.fim == null)
    lacunas.push('Falta afirmar a janela.');
  if (sustentaQuando.length === 0) lacunas.push('Nenhum sinal sustenta a hora.');
  if (!acusacao.causaId) lacunas.push('Falta afirmar a causa.');
  if (sustentaComo.length === 0) lacunas.push('Nenhum sinal sustenta a causa.');
  if (!acusacao.reuId) lacunas.push('Falta nomear o réu.');
  if (sustentaPresenca.length === 0) lacunas.push('Nada põe o réu na cena.');
  if (refutaHora.size === 0 && refutaAlibi.size === 0) lacunas.push('Nenhuma mentira confrontada.');
  if (!acusacao.motivacaoId) lacunas.push('O móbil não foi apontado.');
  if (naoAcusados.some((sp) => !acusacao.juizos[sp.id])) lacunas.push('Há suspeitos sem juízo.');
  // "Inocente" com paradeiro por confrontar (P1 do playtest): há álibi do
  // suspeito e vestígio dele na mesa, mas nenhum barbante entre eles — a
  // linha é NEUTRA (aponta um confronto disponível, nunca o gabarito).
  for (const sp of naoAcusados) {
    if (acusacao.juizos[sp.id] !== 'inocente') continue;
    const alibi = cartas.find((c) => ehAlibiDe(c, sp.id));
    if (!alibi) continue;
    // Nome próprio (não `vestigios`): sombrear a lista do componente
    // (linha acima, os vestígios da Estação II) convida a erro.
    const vestigiosDoSuspeito = cartas.filter(
      (c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.pertenceA === sp.id
    );
    if (vestigiosDoSuspeito.length === 0) continue;
    const confrontado = vestigiosDoSuspeito.some((v) =>
      acusacao.ligacoes.some(
        (l) => (l.de === v.id && l.para === alibi.id) || (l.de === alibi.id && l.para === v.id)
      )
    );
    // deQuem: contrai com o artigo do nome titulado ("da Sra. …"), como no epílogo.
    if (!confrontado) lacunas.push(`Paradeiro ${deQuem(sp.nome)} por confrontar.`);
  }

  const podeSubmeter = !!acusacao.reuId;

  // Concluir a etapa aberta: revela a próxima (se for a fronteira) ou recolhe.
  function concluir(i) {
    if (i === revelado - 1 && revelado < ETAPAS.length) {
      setRevelado(revelado + 1);
      setEtapaAberta(i + 1);
    } else {
      setEtapaAberta(null);
    }
  }

  // Resumo de uma etapa concluída (texto neutro do que foi afirmado).
  function resumoDe(id) {
    if (id === 'corpo') {
      const partes = [];
      if (acusacao.janela.inicio != null && acusacao.janela.fim != null)
        partes.push(formatJanela(acusacao.janela));
      const causa = CATALOGO_CAUSAS.find((c) => c.id === acusacao.causaId);
      if (causa) partes.push(causa.nome);
      return partes.length ? partes.join(' · ') : 'por concluir';
    }
    if (id === 'presenca') {
      const reu = obterSuspeitos().find((s) => s.id === acusacao.reuId);
      return reu ? `Réu: ${reu.nome} · ${sustentaPresenca.length} vestígio(s)` : 'por concluir';
    }
    if (id === 'mentiras') {
      // A Estação III também derruba o paradeiro do RÉU (refuta_alibi) — o
      // rótulo conta as duas espécies de mentira, não só as de hora (P2).
      const paradeirosReu = [...refutaAlibi.values()].filter(
        (v) => v.alibi.tagsOcultas.declaranteId === acusacao.reuId
      ).length;
      const partes = [];
      if (refutaHora.size) partes.push(`${refutaHora.size} mentira(s) de hora exposta(s)`);
      if (paradeirosReu) partes.push(`${paradeirosReu} paradeiro(s) desmentido(s)`);
      return partes.length ? partes.join(' · ') : 'por concluir';
    }
    if (id === 'mobil') {
      const m = cartas.find((c) => c.id === acusacao.motivacaoId);
      return m ? m.termoCarimbo : 'por concluir';
    }
    if (id === 'juizos') {
      const n = naoAcusados.filter((sp) => acusacao.juizos[sp.id]).length;
      return `${n}/${naoAcusados.length} julgado(s)`;
    }
    return '';
  }

  return (
    <div data-overlay className="fixed inset-0 z-40 mural-cortica flex flex-col">
      {/* A vela respira sobre a cortiça (puro efeito, não intercepta nada) */}
      <div className="luz-de-vela" aria-hidden="true" />
      {/* Animação de "a mesa enche": cada etapa surge ao ser revelada. */}
      <style>{`@keyframes mortemSurgir{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.mortem-surgir{animation:mortemSurgir 240ms ease-out}`}</style>
      {/* Cabeçalho: a moldura alta do mural, com a placa solene à direita */}
      <div className="relative shrink-0 flex flex-wrap items-start justify-between gap-3 px-3 sm:px-6 py-3 border-b border-latao/40 bg-stone-950/60">
        <div>
          <h2 className="font-titulo text-xl sm:text-2xl text-amber-200 titulo-gravado">A Construção da Acusação</h2>
          <p className="text-stone-400 text-xs mt-0.5">
            A mesa se constrói por partes: conclua uma para a próxima aparecer. Para rever uma parte
            já feita, clique nela ou arraste-a de volta. Construir não custa tempo.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setRevisando(true)}
            disabled={!podeSubmeter}
            className="placa-latao px-5 py-2 rounded-sm font-serif text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Levar a julgamento
          </button>
          <button onClick={fecharOverlay} className="botao-mesa botao-mesa--quieto !text-xs tracking-widest">
            fechar ✕
          </button>
        </div>
      </div>

      {/* Faixa de apoio: só o checklist NEUTRO do que falta afirmar (Q3: a
          leitura do legista não fica pendurada sobre a prova — quem quiser
          consultá-la, que abra a Caderneta; é um gesto, não um gabarito).
          Visual: uma etiqueta de pergaminho pregada de leve no mural. */}
      {lacunas.length > 0 && (
        <div className="relative shrink-0 px-3 sm:px-6 pt-3 pb-1">
          <div className="carta-pergaminho relative inline-block max-w-full rounded-sm px-4 py-2 text-xs -rotate-[0.4deg]">
            <span className="tacha-latao absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5" aria-hidden="true" />
            <span className="text-rotulo uppercase text-tinta-clara mr-2">Ainda falta</span>
            <span className="text-tinta">{lacunas.join(' · ')}</span>
          </div>
        </div>
      )}

      {/* O mural: a folha do inquérito ao lado da pilha de estações. Em tela
          larga a folha fica fixa à esquerda, sempre à vista, enquanto as
          estações rolam; no celular ela desce para o pé, como material de
          consulta. Uma rolagem só para as duas colunas. */}
      <div className="relative flex-1 overflow-auto p-3 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* A coluna de leitura: o que já foi afirmado e a chave dos fios */}
          <aside className="order-last lg:order-first w-full lg:w-[320px] lg:shrink-0 lg:sticky lg:top-0 space-y-3">
            <FormularioInquerito acusacao={acusacao} cartas={cartas} />
            <LegendaBarbantes />
          </aside>

          <div className="min-w-0 flex-1 space-y-4">
        {ETAPAS.slice(0, revelado).map((et, i) => (
          <div key={et.id} className="mortem-surgir">
            {etapaAberta === i ? (
              <EstacaoAberta
                etapa={et}
                ultima={i === ETAPAS.length - 1}
                aoConcluir={() => concluir(i)}
                acusacao={acusacao}
                definirReu={definirReu}
                definirJanela={definirJanela}
                definirCausa={definirCausa}
                definirMotivacao={definirMotivacao}
                definirJuizo={definirJuizo}
                adicionarLigacao={adicionarLigacao}
                removerLigacao={removerLigacao}
                estaLigada={estaLigada}
                alternarLigacao={alternarLigacao}
                cartas={cartas}
                temporais={temporais}
                causais={causais}
                vestigios={vestigios}
                mentirasAlvo={mentirasAlvo}
                fontesMentiras={fontesMentiras}
                motivos={motivos}
                naoAcusados={naoAcusados}
              />
            ) : (
              <ResumoEstacao etapa={et} resumo={resumoDe(et.id)} aoReabrir={() => setEtapaAberta(i)} />
            )}
          </div>
        ))}
          </div>
        </div>
      </div>

      {revisando && (
        <RevisaoFinal
          acusacao={acusacao}
          cartas={cartas}
          sustentaPresenca={sustentaPresenca}
          refutaHora={refutaHora}
          refutaAlibi={refutaAlibi}
          naoAcusados={naoAcusados}
          lacunas={lacunas}
          aoVoltar={() => setRevisando(false)}
          aoConfirmar={() => {
            tocarSom('lacre');
            setRevisando(false);
            submeterAcusacao();
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Resumo de uma etapa concluída. Qualquer toque/clique reabre a etapa; o
// arrasto (> 44px) é floreio opcional — quem completa o gesto ainda o vê,
// mas soltar no meio do caminho reabre igual (P0 do playtest de 17/07:
// solturas entre 6 e 44px caíam numa zona morta).
// ---------------------------------------------------------------------
function ResumoEstacao({ etapa, resumo, aoReabrir }) {
  const st = useRef(null);
  const [puxa, setPuxa] = useState(0); // deslocamento visual enquanto se arrasta
  function down(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    st.current = { x0: e.clientX, y0: e.clientY };
  }
  function move(e) {
    const a = st.current;
    if (!a) return;
    const dx = e.clientX - a.x0;
    setPuxa(Math.max(0, Math.min(dx, 48)));
    if (Math.hypot(dx, e.clientY - a.y0) > 44) {
      st.current = null;
      setPuxa(0);
      aoReabrir();
    }
  }
  function up() {
    const a = st.current;
    st.current = null;
    setPuxa(0);
    // Se chegou aqui, o arrasto não completou (>44 dispara no move e
    // anula st). Qualquer soltura conta como clique — o arrasto é
    // gesto opcional, nunca pré-requisito.
    if (a) aoReabrir();
  }
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          aoReabrir();
        }
      }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      title="Clique ou arraste para rever esta parte"
      style={{ transform: puxa ? `translateX(${puxa}px)` : undefined }}
      className={`carta-pergaminho relative flex items-center justify-between gap-4 px-4 py-2 rounded-sm -rotate-[0.25deg] cursor-grab active:cursor-grabbing select-none touch-none ${
        puxa ? 'outline outline-2 outline-vela' : ''
      }`}
    >
      {/* A tacha que prega a ficha concluída no mural */}
      <span className="tacha-latao absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5" aria-hidden="true" />
      {/* O selo de cera que "carimba" a parte concluída (bate ao surgir) */}
      <span
        className="selo-cera selo-carimbando absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-[11px] leading-none text-cera-clara/90 -rotate-6"
        aria-hidden="true"
      >
        ❦
      </span>
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-tinta text-[11px] tracking-[0.2em] uppercase">{etapa.titulo}</span>
        <span className="text-tinta-clara text-xs">{resumo}</span>
      </div>
      <span className={`text-[10px] tracking-widest uppercase ${puxa > 24 ? 'text-cera-clara' : 'text-tinta-apagada'}`}>
        {puxa > 24 ? 'solte para rever ⟲' : 'rever ⟲'}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------
// A moldura de uma estação aberta + o rodapé "Concluir esta parte".
// O corpo varia conforme a etapa. Cada estação recebe SÓ as props que usa
// (explicitadas na decomposição — nada de espalhar o pacote inteiro).
// ---------------------------------------------------------------------
function EstacaoAberta({ etapa, ultima, aoConcluir, ...p }) {
  return (
    <div className="painel-couro relative rounded-sm">
      {/* A tacha que prende o painel aberto ao mural */}
      <span className="tacha-latao absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3" aria-hidden="true" />
      <div className="flex items-baseline justify-between px-4 pt-3">
        <div className="flex items-baseline gap-3">
          <span className="text-amber-200 font-serif text-lg titulo-gravado">{etapa.titulo}</span>
          <span className="text-stone-400 text-xs italic font-serif">— {etapa.subtitulo}</span>
        </div>
      </div>
      <div className="divisor-ornado text-[10px] px-4 mt-1" aria-hidden="true">―</div>

      <div className="px-4 py-3 overflow-x-auto">
        {etapa.id === 'corpo' && (
          <EstacaoCorpo
            acusacao={p.acusacao}
            definirJanela={p.definirJanela}
            definirCausa={p.definirCausa}
            temporais={p.temporais}
            causais={p.causais}
          />
        )}
        {etapa.id === 'presenca' && (
          <EstacaoPresenca
            acusacao={p.acusacao}
            definirReu={p.definirReu}
            vestigios={p.vestigios}
            adicionarLigacao={p.adicionarLigacao}
            removerLigacao={p.removerLigacao}
          />
        )}
        {etapa.id === 'mentiras' && (
          <EstacaoMentiras
            acusacao={p.acusacao}
            mentirasAlvo={p.mentirasAlvo}
            fontesMentiras={p.fontesMentiras}
            adicionarLigacao={p.adicionarLigacao}
            removerLigacao={p.removerLigacao}
          />
        )}
        {etapa.id === 'mobil' && (
          <EstacaoMobil
            acusacao={p.acusacao}
            motivos={p.motivos}
            definirMotivacao={p.definirMotivacao}
          />
        )}
        {etapa.id === 'juizos' && (
          <EstacaoJuizos
            acusacao={p.acusacao}
            naoAcusados={p.naoAcusados}
            definirJuizo={p.definirJuizo}
            cartas={p.cartas}
            estaLigada={p.estaLigada}
            alternarLigacao={p.alternarLigacao}
          />
        )}
      </div>

      <div className="flex justify-end px-4 pb-3">
        {/* O halo de vela vem do invólucro: .botao-mesa define a própria sombra */}
        <span className="inline-block rounded-sm shadow-vela-viva">
          <button onClick={aoConcluir} className="botao-mesa !text-sm">
            {ultima ? 'Concluir' : 'Concluir esta parte →'}
          </button>
        </span>
      </div>
    </div>
  );
}
