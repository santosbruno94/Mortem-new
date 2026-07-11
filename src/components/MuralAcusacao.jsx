import { useState, useEffect, useRef } from 'react';
import { useJogo } from '../store/jogo.js';
import { SUSPEITOS } from '../data/seed.js';
import { CATALOGO_CAUSAS } from '../data/catalogo_causas.js';
import { ANCORAS, analisarLigacoes, horaAlegada } from '../logic/acusacao.js';
import { formatJanela } from '../logic/tempo.js';
import { tocarSom } from '../som.js';

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

// Conversão da escala absoluta (horas desde a meia-noite de 14/out;
// negativas = 13/out) para o relógio humano (dia 13/14 + hora).
function deAbsoluto(abs) {
  return { dia: 14 + Math.floor(abs / 24), hora: ((abs % 24) + 24) % 24 };
}

// Predicados de categoria (camada visual; o motor lê as tags por conta própria).
const ehTemporal = (c) => c.tagsOcultas.dominio === 'temporal';
const ehCausal = (c) => c.tagsOcultas.dominio === 'causal';
const ehVestigioOuAmbiental = (c) =>
  c.tagsOcultas.dominio === 'vestigio' || c.tagsOcultas.dominio === 'ambiental';
const ehMotivo = (c) => c.tagsOcultas.subDominio === 'motivo';
const ehCorroboracao = (c) => c.tagsOcultas.subDominio === 'corroboracao';
const ehAlibiDe = (c, sid) => c.tagsOcultas.subDominio === 'alibi' && c.tagsOcultas.declaranteId === sid;

// Geometria das estações de ligação (coordenadas conhecidas → barbante simples).
const CARD_W = 176;
const CARD_H = 78;
const ESPACO = 22;
const MARGEM = 16;
const VAO_LINHAS = 104; // respiro vertical entre a fileira de alvos e a de fontes
const ROTULO_H = 18; // faixa para o rótulo de cada fileira

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
    cartas.forEach((c) => {
      if (c.tagsOcultas.dominio === 'temporal') adicionarLigacao(c.id, ANCORAS.quando);
      else if (c.tagsOcultas.dominio === 'causal' && (c.tagsOcultas.sinal || c.tagsOcultas.instrumento))
        adicionarLigacao(c.id, ANCORAS.como);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartas]);

  // Completude NEUTRA (nunca acerto/erro), para o lembrete "ainda falta".
  const { sustentaQuando, sustentaComo, sustentaPresenca, refutaHora, refutaAlibi } =
    analisarLigacoes(acusacao, cartas);
  const naoAcusados = SUSPEITOS.filter((sp) => sp.id !== acusacao.reuId);
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
      const reu = SUSPEITOS.find((s) => s.id === acusacao.reuId);
      return reu ? `Réu: ${reu.nome} · ${sustentaPresenca.length} vestígio(s)` : 'por concluir';
    }
    if (id === 'mentiras') {
      return refutaHora.size ? `${refutaHora.size} mentira(s) de hora exposta(s)` : 'por concluir';
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
    <div className="fixed inset-0 z-40 bg-stone-950 flex flex-col">
      {/* Animação de "a mesa enche": cada etapa surge ao ser revelada. */}
      <style>{`@keyframes mortemSurgir{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.mortem-surgir{animation:mortemSurgir 240ms ease-out}`}</style>
      {/* Cabeçalho */}
      <div className="shrink-0 flex flex-wrap items-start justify-between gap-3 px-3 sm:px-6 py-3 border-b border-amber-900/40 bg-stone-900">
        <div>
          <h2 className="font-serif text-xl text-amber-200">A Construção da Acusação</h2>
          <p className="text-stone-500 text-xs mt-0.5">
            A mesa se constrói por partes: conclua uma para a próxima aparecer. Para rever uma parte
            já feita, arraste-a de volta. Construir não custa tempo.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setRevisando(true)}
            disabled={!podeSubmeter}
            className="px-5 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Levar a julgamento
          </button>
          <button onClick={fecharOverlay} className="text-stone-500 hover:text-amber-200 text-sm tracking-widest">
            fechar ✕
          </button>
        </div>
      </div>

      {/* Faixa de apoio: só o checklist NEUTRO do que falta afirmar (Q3: a
          leitura do legista não fica pendurada sobre a prova — quem quiser
          consultá-la, que abra a Caderneta; é um gesto, não um gabarito). */}
      {lacunas.length > 0 && (
        <div className="shrink-0 px-3 sm:px-6 py-2 border-b border-stone-800 bg-stone-900/60 text-xs text-stone-500">
          <span className="tracking-[0.2em] uppercase mr-2">Ainda falta</span>
          {lacunas.join(' · ')}
        </div>
      )}

      {/* A mesa: pilha vertical de estações que cresce conforme se conclui */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-stone-950 via-stone-900/40 to-stone-950 p-3 sm:p-6 space-y-4">
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

      {revisando && (
        <RevisaoFinal
          acusacao={acusacao}
          cartas={cartas}
          sustentaPresenca={sustentaPresenca}
          refutaHora={refutaHora}
          refutaAlibi={refutaAlibi}
          naoAcusados={naoAcusados}
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
// A revisão final: o argumento inteiro, legível, antes de selar. Só lê o que
// o jogador afirmou — nunca diz se está certo (a verdade é o Monólogo).
// ---------------------------------------------------------------------
function RevisaoFinal({ acusacao, cartas, sustentaPresenca, refutaHora, refutaAlibi, naoAcusados, aoVoltar, aoConfirmar }) {
  const reu = SUSPEITOS.find((s) => s.id === acusacao.reuId);
  const causa = CATALOGO_CAUSAS.find((c) => c.id === acusacao.causaId);
  const temJanela = acusacao.janela.inicio != null && acusacao.janela.fim != null;
  const vestNexo = sustentaPresenca.find((c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.tipoVestigio);
  const motivo = cartas.find((c) => c.id === acusacao.motivacaoId);
  const horas = [...refutaHora.values()].map((v) => v.alegacao.termoCarimbo);
  const semCor = '— por afirmar —';

  const refutaAlibiDe = (sid) => {
    for (const v of refutaAlibi.values()) if (v.alibi.tagsOcultas.declaranteId === sid) return v.vestigios[0];
    return null;
  };
  const rotuloJuizo = (j) => (j === 'culpado' ? 'Cúmplice' : j === 'inocente' ? 'Inocente' : 'Sem juízo');

  return (
    <div className="absolute inset-0 z-50 bg-stone-950/80 flex items-center justify-center p-3 sm:p-6">
      <div className="mortem-surgir w-full max-w-2xl max-h-full overflow-auto rounded-sm border-2 border-amber-800/70 bg-stone-900 p-4 sm:p-6 shadow-2xl shadow-black/50">
        <h3 className="font-serif text-lg text-amber-200 mb-1">A acusação, como você a montou</h3>
        <p className="text-stone-500 text-xs mb-4">Releia antes de selar. Nada aqui diz se está certo — isso é o julgamento.</p>

        <dl className="space-y-2 text-sm">
          <LinhaRev rotulo="Quem" valor={reu ? reu.nome : semCor} />
          <LinhaRev rotulo="Quando" valor={temJanela ? formatJanela(acusacao.janela) : semCor} />
          <LinhaRev rotulo="Como" valor={causa ? causa.nome : semCor} />
          <LinhaRev rotulo="Presença" valor={vestNexo ? vestNexo.textoDisplay : '— nada liga o réu à cena —'} />
          <LinhaRev rotulo="Mentiras" valor={horas.length ? horas.join(' · ') : '— nenhuma mentira de hora exposta —'} />
          <LinhaRev rotulo="Móbil" valor={motivo ? motivo.termoCarimbo : semCor} />
          <div className="flex gap-3">
            <dt className="text-amber-200/70 text-[10px] tracking-[0.2em] uppercase w-24 shrink-0 pt-0.5">Juízos</dt>
            <dd className="text-stone-300 flex-1">
              {naoAcusados.length === 0 ? (
                <span className="text-stone-500">— sem outros suspeitos —</span>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {naoAcusados.map((sp) => {
                    const v = refutaAlibiDe(sp.id);
                    return (
                      <span key={sp.id}>
                        {sp.nome}: <span className="text-stone-200">{rotuloJuizo(acusacao.juizos[sp.id])}</span>
                        {acusacao.juizos[sp.id] === 'inocente' && v && (
                          <span className="text-stone-500"> — pelo {v.textoDisplay}</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
            </dd>
          </div>
        </dl>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={aoVoltar} className="px-4 py-2 text-stone-400 hover:text-amber-200 text-sm">
            Voltar e revisar
          </button>
          <button
            onClick={aoConfirmar}
            className="px-5 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800"
          >
            Confirmar e julgar
          </button>
        </div>
      </div>
    </div>
  );
}

function LinhaRev({ rotulo, valor }) {
  return (
    <div className="flex gap-3">
      <dt className="text-amber-200/70 text-[10px] tracking-[0.2em] uppercase w-24 shrink-0 pt-0.5">{rotulo}</dt>
      <dd className="text-stone-200 flex-1">{valor}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------
// Resumo de uma etapa concluída. Arrastá-lo de volta (> 24px) reabre a etapa.
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
    st.current = null;
    setPuxa(0);
  }
  return (
    <div
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      title="Arraste para rever esta parte"
      style={{ transform: puxa ? `translateX(${puxa}px)` : undefined }}
      className={`flex items-center justify-between gap-4 px-4 py-2 rounded-sm border bg-stone-900/70 cursor-grab active:cursor-grabbing select-none touch-none ${
        puxa ? 'border-amber-600 shadow-lg shadow-black/40' : 'border-stone-700 hover:border-amber-800/60'
      }`}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-amber-200/80 text-[11px] tracking-[0.2em] uppercase">{etapa.titulo}</span>
        <span className="text-stone-400 text-xs">{resumo}</span>
      </div>
      <span className={`text-[10px] tracking-widest uppercase ${puxa > 24 ? 'text-amber-300' : 'text-stone-600'}`}>
        {puxa > 24 ? 'solte para rever ⟲' : '⟵ puxe para rever'}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------
// A moldura de uma estação aberta + o rodapé "Concluir esta parte".
// O corpo varia conforme a etapa.
// ---------------------------------------------------------------------
function EstacaoAberta({ etapa, ultima, aoConcluir, ...p }) {
  return (
    <div className="rounded-sm border-2 border-amber-800/70 bg-stone-900/40">
      <div className="flex items-baseline justify-between px-4 pt-3">
        <div className="flex items-baseline gap-3">
          <span className="text-amber-200 font-serif">{etapa.titulo}</span>
          <span className="text-stone-500 text-xs">— {etapa.subtitulo}</span>
        </div>
      </div>

      <div className="px-4 py-3 overflow-x-auto">
        {etapa.id === 'corpo' && <EstacaoCorpo {...p} />}
        {etapa.id === 'presenca' && <EstacaoPresenca {...p} />}
        {etapa.id === 'mentiras' && <EstacaoMentiras {...p} />}
        {etapa.id === 'mobil' && <EstacaoMobil {...p} />}
        {etapa.id === 'juizos' && <EstacaoJuizos {...p} />}
      </div>

      <div className="flex justify-end px-4 pb-3">
        <button
          onClick={aoConcluir}
          className="px-4 py-1.5 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-xs transition-colors hover:bg-stone-800 hover:border-amber-700"
        >
          {ultima ? 'Concluir' : 'Concluir esta parte →'}
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// ESTAÇÃO I — O CORPO: as evidências são APRESENTADAS (leitura); o jogador
// calcula e DECLARA a janela e a causa. As evidências do corpo coletadas
// entram sozinhas como base (ver o useEffect no componente-mãe). Sem clique
// nas cartas — a dedução é ler e declarar.
// =====================================================================
function EstacaoCorpo({ acusacao, definirJanela, definirCausa, temporais, causais }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* QUANDO */}
      <div>
        <p className="text-amber-200/80 text-[10px] tracking-[0.2em] uppercase mb-2">Quando — a janela</p>
        <SeletorJanela acusacao={acusacao} definirJanela={definirJanela} />
        {acusacao.janela.inicio != null && acusacao.janela.fim != null && (
          <p className="text-amber-200/80 text-xs mt-2">{formatJanela(acusacao.janela)}</p>
        )}
        <p className="text-stone-500 text-[10px] mt-3 mb-2">O que o corpo diz do tempo:</p>
        <div className="flex flex-col gap-2">
          {temporais.map((c) => (
            <CartaLeitura key={c.id} carta={c} />
          ))}
          {temporais.length === 0 && <p className="text-stone-600 text-xs">Nenhum indicador de tempo no corpo.</p>}
        </div>
      </div>

      {/* COMO */}
      <div>
        <p className="text-amber-200/80 text-[10px] tracking-[0.2em] uppercase mb-2">Como — a causa</p>
        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
          {CATALOGO_CAUSAS.map((c) => (
            <Opcao key={c.id} ativa={acusacao.causaId === c.id} aoClicar={() => definirCausa(c.id)} rotulo={c.nome} />
          ))}
        </div>
        <p className="text-stone-500 text-[10px] mt-3 mb-2">O que o corpo diz da causa:</p>
        <div className="flex flex-col gap-2">
          {causais.map((c) => (
            <CartaLeitura key={c.id} carta={c} />
          ))}
          {causais.length === 0 && <p className="text-stone-600 text-xs">Nenhum sinal de causa no corpo.</p>}
        </div>
      </div>
    </div>
  );
}

// Carta de evidência só para leitura (o jogador lê e deduz; não se clica).
function CartaLeitura({ carta }) {
  return (
    <div
      title={carta.descricao}
      className="rounded-sm px-3 py-2 border border-stone-700 bg-stone-900 transition-colors hover:border-stone-600"
    >
      <p className="font-serif text-stone-200 text-xs leading-snug">{carta.textoDisplay}</p>
    </div>
  );
}

// =====================================================================
// ESTAÇÃO II — A PRESENÇA: nomear o réu e LIGAR (barbante) um vestígio à cena.
// =====================================================================
function EstacaoPresenca({ acusacao, definirReu, vestigios, estaLigada, adicionarLigacao, removerLigacao }) {
  const alvo = { id: ANCORAS.presenca, rotulo: 'Presença — o réu na cena', ehAncora: true };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-stone-500 text-xs">Réu:</span>
        {SUSPEITOS.map((sp) => (
          <Opcao key={sp.id} ativa={acusacao.reuId === sp.id} aoClicar={() => definirReu(sp.id)} rotulo={sp.nome} />
        ))}
      </div>
      <p className="text-stone-500 text-[10px] mb-2">
        Ligue à Presença o(s) vestígio(s) que ligam o réu à arma do óbito (clique no vestígio, depois
        na âncora). Para desfazer uma ligação, clique no barbante.
      </p>
      <MesaLigacao
        alvos={[alvo]}
        fontes={vestigios}
        ligacoes={acusacao.ligacoes}
        adicionarLigacao={adicionarLigacao}
        removerLigacao={removerLigacao}
        rotuloFontes="Vestígios coletados"
      />
    </div>
  );
}

// =====================================================================
// ESTAÇÃO III — AS MENTIRAS: LIGAR (barbante) um fato à alegação que ele
// derruba — o relógio encenado, o falso avistamento e, com o réu nomeado,
// o paradeiro que o próprio réu declarou (refutável pelo registro de
// testemunho — a corroboração de Moorford). Os álibis dos NÃO-acusados
// seguem na estação dos Juízos.
// =====================================================================
function EstacaoMentiras({ acusacao, mentirasAlvo, fontesMentiras, adicionarLigacao, removerLigacao }) {
  return (
    <div>
      <p className="text-stone-500 text-[10px] mb-2">
        Ligue um fato — do corpo ou dos registros — à alegação de hora ou de paradeiro que ele
        derruba (clique no fato, depois no depoimento). Para desfazer uma ligação, clique no barbante.
      </p>
      <MesaLigacao
        alvos={mentirasAlvo}
        fontes={fontesMentiras}
        ligacoes={acusacao.ligacoes}
        adicionarLigacao={adicionarLigacao}
        removerLigacao={removerLigacao}
        rotuloAlvos="As alegações — hora e paradeiro"
        rotuloFontes="Os fatos — corpo e registros"
      />
    </div>
  );
}

// ---------------------------------------------------------------------
// Mesa de ligação: alvos em cima, fontes embaixo, em posições conhecidas;
// clique-clique liga (barbante do Estágio 1). Coordenadas fixas → sem medir.
// ---------------------------------------------------------------------
function MesaLigacao({ alvos, fontes, ligacoes, adicionarLigacao, removerLigacao, rotuloAlvos, rotuloFontes }) {
  const [origem, setOrigem] = useState(null);

  const colunas = Math.max(alvos.length, fontes.length, 1);
  const largura = MARGEM * 2 + colunas * (CARD_W + ESPACO) - ESPACO;
  const yAlvos = MARGEM + ROTULO_H;
  const yFontes = yAlvos + CARD_H + VAO_LINHAS;
  const altura = yFontes + CARD_H + MARGEM;

  const idx = {};
  alvos.forEach((a, i) => (idx[a.id] = { fila: 'alvo', i }));
  fontes.forEach((f, i) => (idx[f.id] = { fila: 'fonte', i }));

  function caixa(id) {
    const e = idx[id];
    if (!e) return null;
    const x = MARGEM + e.i * (CARD_W + ESPACO);
    const y = e.fila === 'alvo' ? yAlvos : yFontes;
    return { x, y };
  }
  function centro(id) {
    const c = caixa(id);
    return c ? { x: c.x + CARD_W / 2, y: c.y + CARD_H / 2 } : null;
  }

  function aoClicar(id) {
    if (!origem) {
      setOrigem(id);
      return;
    }
    if (origem === id) {
      setOrigem(null);
      return;
    }
    adicionarLigacao(origem, id);
    tocarSom('barbante');
    setOrigem(null);
  }

  // Só desenhamos as ligações cujos DOIS extremos pertencem a esta mesa.
  const linhas = ligacoes.filter((l) => idx[l.de] && idx[l.para]);
  const conectando = !!origem; // uma carta "na mão" → os alvos acendem

  const rotulo = (texto, y) =>
    texto ? (
      <span
        className="absolute text-stone-500 text-[10px] tracking-[0.2em] uppercase"
        style={{ left: MARGEM, top: y - ROTULO_H + 2 }}
      >
        {texto}
      </span>
    ) : null;

  return (
    <div
      className="relative"
      style={{ width: largura, height: altura }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOrigem(null);
      }}
    >
      {rotulo(rotuloAlvos, yAlvos)}
      {rotulo(rotuloFontes, yFontes)}

      <svg className="absolute inset-0" width={largura} height={altura} style={{ pointerEvents: 'none' }}>
        {linhas.map((l) => {
          const a = centro(l.de);
          const b = centro(l.para);
          if (!a || !b) return null;
          return <Barbante key={l.id} a={a} b={b} aoRemover={() => removerLigacao(l.id)} />;
        })}
      </svg>

      {[...alvos.map((a) => ({ ...a, fila: 'alvo' })), ...fontes.map((f) => ({ ...f, fila: 'fonte' }))].map((n) => {
        const c = caixa(n.id);
        if (!c) return null;
        const sel = origem === n.id;
        return (
          <button
            key={n.id}
            onClick={() => aoClicar(n.id)}
            title={n.ehAncora ? n.rotulo : n.descricao}
            style={{ left: c.x, top: c.y, width: CARD_W, height: CARD_H }}
            className={`absolute text-left rounded-sm px-3 py-2 overflow-hidden transition-all duration-150 ${
              n.ehAncora ? 'border-2 bg-stone-900' : 'border bg-stone-900'
            } ${
              sel
                ? 'border-amber-400 ring-2 ring-amber-400 z-20 shadow-lg shadow-amber-900/30'
                : conectando
                ? n.ehAncora
                  ? 'border-amber-700/80 hover:border-amber-500'
                  : 'border-stone-600 hover:border-amber-600/70'
                : n.ehAncora
                ? 'border-amber-800/70 hover:border-amber-700'
                : 'border-stone-700 hover:border-stone-500'
            }`}
          >
            {n.ehAncora ? (
              <p className="text-amber-200/90 text-[10px] tracking-[0.15em] uppercase leading-snug">{n.rotulo}</p>
            ) : (
              <p className="font-serif text-stone-200 text-xs leading-snug">{n.textoDisplay}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}

// =====================================================================
// ESTAÇÃO IV — O MÓBIL: apontar a carta de móbil ligada ao réu.
// =====================================================================
function EstacaoMobil({ acusacao, motivos, definirMotivacao }) {
  if (!acusacao.reuId) {
    return <p className="text-stone-600 text-xs">Nomeie o réu na etapa da Presença para apontar o móbil.</p>;
  }
  if (motivos.length === 0) {
    return <p className="text-stone-600 text-xs">Nenhuma carta de móbil ligada a este réu.</p>;
  }
  return (
    <div className="flex flex-col gap-1 max-w-md">
      <p className="text-stone-600 text-[10px] mb-1">Aponte o móbil:</p>
      {motivos.map((c) => (
        <Opcao
          key={c.id}
          ativa={acusacao.motivacaoId === c.id}
          aoClicar={() => definirMotivacao(c.id)}
          rotulo={c.termoCarimbo}
        />
      ))}
    </div>
  );
}

// =====================================================================
// ESTAÇÃO V — OS JUÍZOS: Cúmplice / Inocente / Sem juízo por não-acusado.
// Inocente abre "confronte o paradeiro declarado": ligar o vestígio do
// suspeito ao álibi dele é a refuta_alibi que o motor lê (governanta →
// revela o segredo). Cúmplice abre "o porquê" (aposta do jogador; estado
// local, sem efeito no motor). Tudo opcional — só pesa na Vitória Absoluta.
// =====================================================================
function EstacaoJuizos({ acusacao, naoAcusados, definirJuizo, cartas, estaLigada, alternarLigacao }) {
  const [porque, setPorque] = useState({});
  function alternarPorque(sid, cid) {
    setPorque((p) => {
      const atual = { ...(p[sid] || {}) };
      if (atual[cid]) delete atual[cid];
      else atual[cid] = true;
      return { ...p, [sid]: atual };
    });
  }

  if (naoAcusados.length === 0) {
    return <p className="text-stone-600 text-xs">Nomeie o réu na etapa da Presença primeiro.</p>;
  }

  const alibiDe = (sid) =>
    cartas.find((c) => c.tagsOcultas.subDominio === 'alibi' && c.tagsOcultas.declaranteId === sid);
  const vestigiosDe = (sid) =>
    cartas.filter((c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.pertenceA === sid);
  const incriminamDe = (sid) =>
    cartas.filter(
      (c) => c.tagsOcultas.ligadoA === sid || (c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.pertenceA === sid)
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {naoAcusados.map((sp) => {
        const juizo = acusacao.juizos[sp.id];
        const alibi = alibiDe(sp.id);
        return (
          <div key={sp.id} className="rounded-sm border border-stone-700 bg-stone-900 px-3 py-2">
            <p className="text-amber-200/80 text-[10px] tracking-[0.2em] uppercase mb-2">{sp.nome}</p>
            <div className="flex flex-col gap-1">
              {[
                ['culpado', 'Cúmplice'],
                ['inocente', 'Inocente'],
                ['sem_juizo', 'Sem juízo'],
              ].map(([val, rot]) => (
                <Opcao key={val} ativa={juizo === val} aoClicar={() => definirJuizo(sp.id, val)} rotulo={rot} />
              ))}
            </div>

            {/* INOCENTE → confrontar o paradeiro declarado: o mesmo gesto serve
                ao álibi que se sustenta e ao álibi que quebra (mentira-segredo) */}
            {juizo === 'inocente' && (
              <div className="mt-2 border-t border-stone-800 pt-2">
                <p className="text-stone-600 text-[10px] mb-1">
                  Confronte o paradeiro declarado — ligue o vestígio que o desmente, se houver:
                </p>
                {alibi && <p className="text-stone-500 text-[11px] italic mb-1">Álibi: {alibi.textoDisplay}</p>}
                {vestigiosDe(sp.id).length === 0 ? (
                  <p className="text-stone-600 text-[10px]">Nenhum vestígio na sua mesa confronta este paradeiro.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {vestigiosDe(sp.id).map((v) => (
                      <CartaSelecionavel
                        key={v.id}
                        carta={v}
                        ativa={!!alibi && estaLigada(v.id, alibi.id)}
                        aoClicar={() => alibi && alternarLigacao(v.id, alibi.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CÚMPLICE → o porquê (aposta do jogador; narrativa) */}
            {juizo === 'culpado' && (
              <div className="mt-2 border-t border-stone-800 pt-2">
                <p className="text-stone-600 text-[10px] mb-1">Por que acusa de cúmplice:</p>
                {incriminamDe(sp.id).length === 0 ? (
                  <p className="text-stone-600 text-[10px]">Nenhuma carta sustenta a aposta.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {incriminamDe(sp.id).map((c) => (
                      <CartaSelecionavel
                        key={c.id}
                        carta={c}
                        ativa={!!(porque[sp.id] && porque[sp.id][c.id])}
                        aoClicar={() => alternarPorque(sp.id, c.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Carta selecionável (toggle), usada nos Juízos (a evidência / o porquê).
function CartaSelecionavel({ carta, ativa, aoClicar }) {
  return (
    <button
      onClick={aoClicar}
      title={carta.descricao}
      className={`text-left rounded-sm px-2 py-1 border text-xs transition-colors ${
        ativa
          ? 'border-amber-500 bg-stone-950 text-amber-200 ring-1 ring-amber-500/40'
          : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200 hover:border-stone-600'
      }`}
    >
      {carta.textoDisplay}
    </button>
  );
}

// ---------------------------------------------------------------------
// Um barbante já amarrado. Ao surgir, "se desenha sozinho" (a linha avança
// da origem ao alvo). Depois vira uma linha comum. A linha grossa invisível
// por cima é a área de clique para REMOVER o barbante.
// ---------------------------------------------------------------------
function Barbante({ a, b, aoRemover }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const L = el.getTotalLength();
    el.style.transition = 'none';
    el.style.strokeDasharray = String(L);
    el.style.strokeDashoffset = String(L);
    void el.getBoundingClientRect();
    el.style.transition = 'stroke-dashoffset 350ms ease-out';
    el.style.strokeDashoffset = '0';
    const t = setTimeout(() => {
      const cur = ref.current;
      if (cur) {
        cur.style.strokeDasharray = 'none';
        cur.style.transition = 'none';
      }
    }, 380);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <g>
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke="transparent"
        strokeWidth={14}
        style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
        onClick={() => {
          tocarSom('barbante');
          aoRemover();
        }}
      />
      {/* O fio tem corpo (Q7): sombra por baixo, torção clara por cima */}
      <line x1={a.x} y1={a.y + 1.5} x2={b.x} y2={b.y + 1.5} stroke="rgba(0,0,0,0.55)" strokeWidth={4} />
      <line ref={ref} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b45309" strokeWidth={3} strokeLinecap="round" />
      <line x1={a.x} y1={a.y - 0.6} x2={b.x} y2={b.y - 0.6} stroke="rgba(251,191,36,0.35)" strokeWidth={1} strokeDasharray="5 7" />
    </g>
  );
}

// ---------------------------------------------------------------------
// Seletor de janela: DOIS seletores (início e fim), cada um com dia+hora
// combinados numa lista só (Q9 — menos burocracia que os quatro antigos).
// O intervalo oferecido é o que faz sentido no caso: da meia-noite de
// 13/out à chegada do perito (11h de 14/out) — a morte não pode ser
// posterior ao corpo achado.
// ---------------------------------------------------------------------
const HORA_MIN_JANELA = -24; // 00h de 13/out
const HORA_MAX_JANELA = 11; // 11h de 14/out (chegada à cena)

function rotuloHoraAbs(abs) {
  const { dia, hora } = deAbsoluto(abs);
  return `dia ${dia} · ${String(hora).padStart(2, '0')}h`;
}

function SeletorJanela({ acusacao, definirJanela }) {
  const opcoes = [];
  for (let h = HORA_MIN_JANELA; h <= HORA_MAX_JANELA; h++) opcoes.push(h);
  const classe = 'bg-stone-950 border border-stone-700 rounded-sm text-stone-300 text-xs px-1 py-1';
  const linha = (rotulo, bound) => (
    <div className="flex items-center gap-1">
      <span className="text-stone-500 text-[10px] w-10">{rotulo}</span>
      <select
        className={classe}
        value={acusacao.janela[bound] != null ? String(acusacao.janela[bound]) : ''}
        onChange={(e) => {
          if (e.target.value === '') return;
          definirJanela({ [bound]: Number(e.target.value) });
        }}
      >
        <option value="">— escolher —</option>
        {opcoes.map((h) => (
          <option key={h} value={h}>
            {rotuloHoraAbs(h)}
          </option>
        ))}
      </select>
    </div>
  );
  return (
    <div className="space-y-1">
      {linha('Início', 'inicio')}
      {linha('Fim', 'fim')}
    </div>
  );
}

function Opcao({ ativa, aoClicar, rotulo }) {
  return (
    <button
      onClick={aoClicar}
      className={`px-2 py-1 rounded-sm border text-xs text-left transition-colors ${
        ativa
          ? 'border-amber-700 bg-stone-950 text-amber-200'
          : 'border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-600'
      }`}
    >
      {rotulo}
    </button>
  );
}
