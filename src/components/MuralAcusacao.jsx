import { useState, useEffect, useRef } from 'react';
import { useJogo } from '../store/jogo.js';
import { SUSPEITOS } from '../data/seed.js';
import { CATALOGO_CAUSAS } from '../data/catalogo_causas.js';
import { ANCORAS, analisarLigacoes, horaAlegada } from '../logic/acusacao.js';
import { formatJanela } from '../logic/tempo.js';
import { lerCorpo, falaDoMestre } from '../logic/falaDoMestre.js';

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

// Conversão entre o relógio humano (dia 13/14 + hora) e a escala absoluta
// (horas desde a meia-noite de 14/out; negativas = 13/out).
function paraAbsoluto(dia, hora) {
  return (Number(dia) - 14) * 24 + Number(hora);
}
function deAbsoluto(abs) {
  return { dia: 14 + Math.floor(abs / 24), hora: ((abs % 24) + 24) % 24 };
}

// Predicados de categoria (camada visual; o motor lê as tags por conta própria).
const ehTemporal = (c) => c.tagsOcultas.dominio === 'temporal';
const ehCausal = (c) => c.tagsOcultas.dominio === 'causal';
const ehVestigioOuAmbiental = (c) =>
  c.tagsOcultas.dominio === 'vestigio' || c.tagsOcultas.dominio === 'ambiental';
const ehMotivo = (c) => c.tagsOcultas.subDominio === 'motivo';

// Geometria das estações de ligação (coordenadas conhecidas → barbante simples).
const CARD_W = 168;
const CARD_H = 72;
const ESPACO = 18;
const MARGEM = 16;
const VAO_LINHAS = 92; // distância vertical entre a fileira de alvos e a de fontes

const ETAPAS = [
  { id: 'corpo', titulo: 'I · O Corpo', subtitulo: 'quando e como' },
  { id: 'presenca', titulo: 'II · A Presença', subtitulo: 'o réu na cena' },
  { id: 'mentiras', titulo: 'III · As Mentiras', subtitulo: 'depoimentos desmentidos' },
  { id: 'mobil', titulo: 'IV · O Móbil', subtitulo: 'a razão do crime' },
  { id: 'juizos', titulo: 'V · Os Juízos', subtitulo: 'sobre cada não-acusado' },
];

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
  const [revelado, setRevelado] = useState(1);
  const [etapaAberta, setEtapaAberta] = useState(0);

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
  }

  // Cartas por categoria (sem ordenar/destacar relevância — só agrupar por tipo).
  const temporais = cartas.filter(ehTemporal);
  const causais = cartas.filter(ehCausal);
  const vestigios = cartas.filter(ehVestigioOuAmbiental);
  const mentirasAlvo = cartas.filter((c) => horaAlegada(c) !== null); // só as mentiras de HORA
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
      else if (c.tagsOcultas.dominio === 'causal' && c.tagsOcultas.sinal) adicionarLigacao(c.id, ANCORAS.como);
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

  const dica = falaDoMestre(lerCorpo(cartas));
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
      {/* Cabeçalho */}
      <div className="shrink-0 flex items-start justify-between gap-4 px-6 py-3 border-b border-amber-900/40 bg-stone-900">
        <div>
          <h2 className="font-serif text-xl text-amber-200">A Construção da Acusação</h2>
          <p className="text-stone-500 text-xs mt-0.5">
            A mesa se constrói por partes: conclua uma para a próxima aparecer. Para rever uma parte
            já feita, arraste-a de volta. Construir não custa tempo.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={submeterAcusacao}
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

      {/* Faixa de apoio: lembrete do legista (dica) + o que ainda falta */}
      <div className="shrink-0 flex flex-wrap items-start gap-x-8 gap-y-1 px-6 py-2 border-b border-stone-800 bg-stone-900/60 text-xs">
        <div className="max-w-xl">
          <span className="text-amber-200/70 tracking-[0.2em] uppercase mr-2">Lembrete do legista</span>
          <span className="text-stone-400 italic">
            {dica.tempo || dica.causa
              ? [dica.tempo, dica.causa].filter(Boolean).join(' ')
              : 'Examine o corpo para ouvir a leitura.'}
          </span>
        </div>
        {lacunas.length > 0 && (
          <div className="text-stone-500">
            <span className="tracking-[0.2em] uppercase mr-2">Ainda falta</span>
            {lacunas.join(' · ')}
          </div>
        )}
      </div>

      {/* A mesa: pilha vertical de estações que cresce conforme se conclui */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-stone-950 via-stone-900/40 to-stone-950 p-6 space-y-4">
        {ETAPAS.slice(0, revelado).map((et, i) =>
          etapaAberta === i ? (
            <EstacaoAberta
              key={et.id}
              etapa={et}
              ultima={i === ETAPAS.length - 1}
              aoConcluir={() => concluir(i)}
              // dados/ações compartilhados
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
              motivos={motivos}
              naoAcusados={naoAcusados}
            />
          ) : (
            <ResumoEstacao
              key={et.id}
              etapa={et}
              resumo={resumoDe(et.id)}
              aoReabrir={() => setEtapaAberta(i)}
            />
          )
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Resumo de uma etapa concluída. Arrastá-lo de volta (> 24px) reabre a etapa.
// ---------------------------------------------------------------------
function ResumoEstacao({ etapa, resumo, aoReabrir }) {
  const st = useRef(null);
  function down(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    st.current = { x0: e.clientX, y0: e.clientY };
  }
  function move(e) {
    const a = st.current;
    if (!a) return;
    if (Math.hypot(e.clientX - a.x0, e.clientY - a.y0) > 24) {
      st.current = null;
      aoReabrir();
    }
  }
  function up() {
    st.current = null;
  }
  return (
    <div
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      title="Arraste para rever esta parte"
      className="flex items-center justify-between gap-4 px-4 py-2 rounded-sm border border-stone-700 bg-stone-900/70 cursor-grab active:cursor-grabbing select-none touch-none hover:border-amber-800/60"
    >
      <div className="flex items-baseline gap-3">
        <span className="text-amber-200/80 text-[11px] tracking-[0.2em] uppercase">{etapa.titulo}</span>
        <span className="text-stone-400 text-xs">{resumo}</span>
      </div>
      <span className="text-stone-600 text-[10px] tracking-widest uppercase">arraste para rever ⟲</span>
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
          className="px-4 py-1.5 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-xs hover:bg-stone-800"
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
    <div className="grid grid-cols-2 gap-6">
      {/* QUANDO */}
      <div>
        <p className="text-amber-200/80 text-[10px] tracking-[0.2em] uppercase mb-2">Quando — a janela</p>
        <SeletorJanela acusacao={acusacao} definirJanela={definirJanela} />
        {acusacao.janela.inicio != null && acusacao.janela.fim != null && (
          <p className="text-amber-200/80 text-xs mt-2">{formatJanela(acusacao.janela)}</p>
        )}
        <p className="text-stone-600 text-[10px] mt-3 mb-2">O que o corpo diz do tempo:</p>
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
        <p className="text-stone-600 text-[10px] mt-3 mb-2">O que o corpo diz da causa:</p>
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
    <div title={carta.descricao} className="rounded-sm px-3 py-2 border border-stone-700 bg-stone-900">
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
      <div className="flex items-center gap-2 mb-3">
        <span className="text-stone-500 text-xs">Réu:</span>
        {SUSPEITOS.map((sp) => (
          <Opcao key={sp.id} ativa={acusacao.reuId === sp.id} aoClicar={() => definirReu(sp.id)} rotulo={sp.nome} />
        ))}
      </div>
      <p className="text-stone-600 text-[10px] mb-2">
        Pegue um vestígio e ligue-o à âncora da Presença (clique no vestígio, depois na âncora).
      </p>
      <MesaLigacao
        alvos={[alvo]}
        fontes={vestigios}
        ligacoes={acusacao.ligacoes}
        estaLigada={estaLigada}
        adicionarLigacao={adicionarLigacao}
        removerLigacao={removerLigacao}
      />
    </div>
  );
}

// =====================================================================
// ESTAÇÃO III — AS MENTIRAS: LIGAR (barbante) um fato físico do corpo à
// mentira de HORA que ele derruba (o relógio encenado / o falso avistamento).
// Os álibis foram para a estação dos Juízos (a evidência que inocenta).
// =====================================================================
function EstacaoMentiras({ acusacao, mentirasAlvo, temporais, adicionarLigacao, removerLigacao }) {
  return (
    <div>
      <p className="text-stone-600 text-[10px] mb-2">
        Ligue um fato físico do corpo à mentira de hora que ele derruba (clique no fato, depois no depoimento).
      </p>
      <MesaLigacao
        alvos={mentirasAlvo}
        fontes={temporais}
        ligacoes={acusacao.ligacoes}
        adicionarLigacao={adicionarLigacao}
        removerLigacao={removerLigacao}
      />
    </div>
  );
}

// ---------------------------------------------------------------------
// Mesa de ligação: alvos em cima, fontes embaixo, em posições conhecidas;
// clique-clique liga (barbante do Estágio 1). Coordenadas fixas → sem medir.
// ---------------------------------------------------------------------
function MesaLigacao({ alvos, fontes, ligacoes, adicionarLigacao, removerLigacao }) {
  const [origem, setOrigem] = useState(null);

  const colunas = Math.max(alvos.length, fontes.length, 1);
  const largura = MARGEM * 2 + colunas * (CARD_W + ESPACO) - ESPACO;
  const yAlvos = MARGEM;
  const yFontes = MARGEM + CARD_H + VAO_LINHAS;
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
    setOrigem(null);
  }

  // Só desenhamos as ligações cujos DOIS extremos pertencem a esta mesa.
  const linhas = ligacoes.filter((l) => idx[l.de] && idx[l.para]);

  return (
    <div
      className="relative"
      style={{ width: largura, height: altura }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOrigem(null);
      }}
    >
      <svg className="absolute inset-0" width={largura} height={altura} style={{ pointerEvents: 'none' }}>
        {linhas.map((l) => {
          const a = centro(l.de);
          const b = centro(l.para);
          if (!a || !b) return null;
          return <Barbante key={l.id} a={a} b={b} aoRemover={() => removerLigacao(l.id)} />;
        })}
      </svg>

      {[...alvos.map((a) => ({ ...a, fila: 'alvo' })), ...fontes.map((f) => ({ ...f, carta: f, fila: 'fonte' }))].map(
        (n) => {
          const c = caixa(n.id);
          if (!c) return null;
          const sel = origem === n.id;
          return (
            <button
              key={n.id}
              onClick={() => aoClicar(n.id)}
              title={n.ehAncora ? n.rotulo : n.descricao}
              style={{ left: c.x, top: c.y, width: CARD_W, height: CARD_H }}
              className={`absolute text-left rounded-sm px-3 py-2 overflow-hidden ${
                n.ehAncora
                  ? 'border-2 border-amber-800/70 bg-stone-900'
                  : 'border bg-stone-900'
              } ${sel ? 'border-amber-400 ring-2 ring-amber-400 z-20' : n.ehAncora ? '' : 'border-stone-700 hover:border-stone-500'}`}
            >
              {n.ehAncora ? (
                <p className="text-amber-200/80 text-[10px] tracking-[0.15em] uppercase leading-snug">{n.rotulo}</p>
              ) : (
                <p className="font-serif text-stone-200 text-xs leading-snug">{n.textoDisplay}</p>
              )}
            </button>
          );
        }
      )}
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
// Inocente abre "a evidência que o inocenta": ligar o vestígio do suspeito
// ao álibi dele é a refuta_alibi que o motor lê (governanta → revela o
// segredo). Cúmplice abre "o porquê" (aposta do jogador; estado local, sem
// efeito no motor). Tudo opcional — só pesa na Vitória Absoluta.
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
    <div className="grid grid-cols-2 gap-4">
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

            {/* INOCENTE → a evidência que o tira do crime */}
            {juizo === 'inocente' && (
              <div className="mt-2 border-t border-stone-800 pt-2">
                <p className="text-stone-600 text-[10px] mb-1">A evidência que o inocenta:</p>
                {alibi && <p className="text-stone-500 text-[11px] italic mb-1">Álibi: {alibi.textoDisplay}</p>}
                {vestigiosDe(sp.id).length === 0 ? (
                  <p className="text-stone-600 text-[10px]">Nada a quebrar — o paradeiro se sustenta.</p>
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
                <p className="text-stone-600 text-[10px] mb-1">Por que o acusa de cúmplice:</p>
                {incriminamDe(sp.id).length === 0 ? (
                  <p className="text-stone-600 text-[10px]">Nenhuma carta o aponta.</p>
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
      className={`text-left rounded-sm px-2 py-1 border text-xs ${
        ativa
          ? 'border-amber-500 bg-stone-950 text-amber-200 ring-1 ring-amber-500/40'
          : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
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
        onClick={aoRemover}
      />
      <line ref={ref} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b45309" strokeWidth={2} />
    </g>
  );
}

// ---------------------------------------------------------------------
// Seletor de janela (início/fim no relógio dos dois dias). Reuso do Estágio 1.
// ---------------------------------------------------------------------
function SeletorJanela({ acusacao, definirJanela }) {
  const ini = acusacao.janela.inicio != null ? deAbsoluto(acusacao.janela.inicio) : null;
  const fim = acusacao.janela.fim != null ? deAbsoluto(acusacao.janela.fim) : null;
  const [iniDia, setIniDia] = useState(ini ? String(ini.dia) : '13');
  const [iniHora, setIniHora] = useState(ini ? String(ini.hora) : '');
  const [fimDia, setFimDia] = useState(fim ? String(fim.dia) : '14');
  const [fimHora, setFimHora] = useState(fim ? String(fim.hora) : '');

  function aplicar(bound, dia, hora) {
    if (hora === '') return;
    definirJanela({ [bound]: paraAbsoluto(dia, hora) });
  }

  return (
    <div className="space-y-1">
      <LinhaHora
        rotulo="Início"
        dia={iniDia}
        hora={iniHora}
        setDia={(d) => {
          setIniDia(d);
          aplicar('inicio', d, iniHora);
        }}
        setHora={(h) => {
          setIniHora(h);
          aplicar('inicio', iniDia, h);
        }}
      />
      <LinhaHora
        rotulo="Fim"
        dia={fimDia}
        hora={fimHora}
        setDia={(d) => {
          setFimDia(d);
          aplicar('fim', d, fimHora);
        }}
        setHora={(h) => {
          setFimHora(h);
          aplicar('fim', fimDia, h);
        }}
      />
    </div>
  );
}

function LinhaHora({ rotulo, dia, hora, setDia, setHora }) {
  const classe = 'bg-stone-950 border border-stone-700 rounded-sm text-stone-300 text-xs px-1 py-1';
  return (
    <div className="flex items-center gap-1">
      <span className="text-stone-500 text-[10px] w-10">{rotulo}</span>
      <select className={classe} value={dia} onChange={(e) => setDia(e.target.value)}>
        <option value="13">dia 13</option>
        <option value="14">dia 14</option>
      </select>
      <select className={classe} value={hora} onChange={(e) => setHora(e.target.value)}>
        <option value="">—h</option>
        {Array.from({ length: 24 }, (_, h) => (
          <option key={h} value={h}>
            {String(h).padStart(2, '0')}h
          </option>
        ))}
      </select>
    </div>
  );
}

function Opcao({ ativa, aoClicar, rotulo }) {
  return (
    <button
      onClick={aoClicar}
      className={`px-2 py-1 rounded-sm border text-xs text-left ${
        ativa ? 'border-amber-700 bg-stone-950 text-amber-200' : 'border-stone-800 text-stone-400 hover:text-stone-200'
      }`}
    >
      {rotulo}
    </button>
  );
}
