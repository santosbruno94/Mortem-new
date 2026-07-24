import { useState, useEffect, useRef } from 'react';
import { useJogo } from '../../store/jogo.js';
import { ANCORAS } from '../../logic/acusacao.js';
import { tocarSom } from '../../som.js';
import { CarimboColeta } from './comuns.jsx';

// ---------------------------------------------------------------------
// AS ESPÉCIES DE BARBANTE — o que cada fio afirma.
//
// Cada espécie tem TRÊS marcas independentes: cor, textura do fio e uma
// etiqueta de papel pendurada no meio. Nunca a cor sozinha — quem não
// distingue os matizes lê a textura e o rótulo e chega ao mesmo lugar.
//
// APRESENTAÇÃO PURA: a espécie é DERIVADA dos extremos da ligação, no
// desenho. Nada disso é gravado no estado, e o motor continua lendo só a
// ligação crua (src/logic/acusacao.js) — trocar as cores não muda partida.
// ---------------------------------------------------------------------
export const ESPECIES = {
  quando: { rotulo: 'quando', cor: '#e0a63e', traco: null, torcido: false },
  como: { rotulo: 'como', cor: '#7fae91', traco: '9 6', torcido: false },
  presenca: { rotulo: 'presença', cor: '#c9553f', traco: null, torcido: true },
  desmente: { rotulo: 'desmente', cor: '#b7ab97', traco: '2 7', torcido: false },
};

// Um fio amarrado a uma âncora fala pela âncora; entre duas cartas, desmente.
const ESPECIE_POR_ANCORA = {
  [ANCORAS.quando]: 'quando',
  [ANCORAS.como]: 'como',
  [ANCORAS.presenca]: 'presenca',
};

export function especieDoBarbante(de, para) {
  return ESPECIES[ESPECIE_POR_ANCORA[de] || ESPECIE_POR_ANCORA[para] || 'desmente'];
}

// Geometria do fio pendurado entre dois centros: o ponto de controle da
// Bézier (a barriga, mais funda em fios longos) e o meio da curva, onde a
// etiqueta pende. Um só lugar calcula — o fio e a etiqueta não podem
// divergir de meio pixel.
function geometriaBarbante(a, b) {
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const barriga = Math.min(30, 10 + dist * 0.12);
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2 + barriga;
  // Meio da Bézier quadrática (t = ½).
  return { cx, cy, mx: 0.25 * a.x + 0.5 * cx + 0.25 * b.x, my: 0.25 * a.y + 0.5 * cy + 0.25 * b.y };
}

// Ponteiro grosso (dedo): sem hover, o atalho de ficha precisa ser botão
// explícito com área de toque ≥ 44px. Decisão única por sessão — camada
// visual, o motor não lê (e o dispositivo não muda no meio da partida).
const ponteiroGrosso =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: coarse)').matches;

// Geometria das estações de ligação (coordenadas conhecidas → barbante simples).
const CARD_W = 176;
const CARD_H = 92; // altura acomoda o carimbo de coleta (P7, playtest 19/07)
const ESPACO = 22;
const MARGEM = 16;
const VAO_LINHAS = 104; // respiro vertical entre a fileira de alvos e a de fontes
const ROTULO_H = 18; // faixa para o rótulo de cada fileira

// ---------------------------------------------------------------------
// Mesa de ligação: alvos em cima, fontes embaixo, em posições conhecidas;
// clique-clique liga (barbante do Estágio 1). Coordenadas fixas → sem medir.
// ---------------------------------------------------------------------
export default function MesaLigacao({ alvos, fontes, ligacoes, adicionarLigacao, removerLigacao, rotuloAlvos, rotuloFontes }) {
  const [origem, setOrigem] = useState(null);
  // Ícone discreto de leitura (§6.2): rever a ficha de uma carta sem sair da
  // estação. A ligação segue no clique do nó; a ficha, no "§" do canto.
  const abrirFicha = useJogo((s) => s.abrirFicha);

  // A mesa acompanha a largura real do painel (A6 do playtest de 13/07/2026):
  // com muitos fatos, a fileira única estourava a tela e cortava a última
  // carta. Acima do teto de colunas, as cartas QUEBRAM em nova fileira — os
  // barbantes seguem os centros, e nada fica fora do alcance do clique.
  const refMedida = useRef(null);
  const [larguraDisponivel, setLarguraDisponivel] = useState(() => window.innerWidth - 48);
  useEffect(() => {
    const el = refMedida.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observador = new ResizeObserver(() => el.clientWidth && setLarguraDisponivel(el.clientWidth));
    observador.observe(el);
    if (el.clientWidth) setLarguraDisponivel(el.clientWidth);
    return () => observador.disconnect();
  }, []);

  const colunasMax = Math.max(
    2,
    Math.floor((larguraDisponivel - MARGEM * 2 + ESPACO) / (CARD_W + ESPACO))
  );
  const VAO_FILEIRAS = 14; // respiro entre fileiras da MESMA banda (alvos ou fontes)
  const filaAltura = (n) => Math.ceil(Math.max(n, 1) / colunasMax) * (CARD_H + VAO_FILEIRAS) - VAO_FILEIRAS;

  const colunas = Math.min(Math.max(alvos.length, fontes.length, 1), colunasMax);
  const largura = MARGEM * 2 + colunas * (CARD_W + ESPACO) - ESPACO;
  const yAlvos = MARGEM + ROTULO_H;
  const yFontes = yAlvos + filaAltura(alvos.length) + VAO_LINHAS;
  const altura = yFontes + filaAltura(fontes.length) + MARGEM;

  const idx = {};
  alvos.forEach((a, i) => (idx[a.id] = { fila: 'alvo', i }));
  fontes.forEach((f, i) => (idx[f.id] = { fila: 'fonte', i }));

  function caixa(id) {
    const e = idx[id];
    if (!e) return null;
    const x = MARGEM + (e.i % colunasMax) * (CARD_W + ESPACO);
    const yBase = e.fila === 'alvo' ? yAlvos : yFontes;
    const y = yBase + Math.floor(e.i / colunasMax) * (CARD_H + VAO_FILEIRAS);
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
        className="absolute text-rotulo uppercase text-latao-claro/70"
        style={{ left: MARGEM, top: y - ROTULO_H + 2 }}
      >
        {texto}
      </span>
    ) : null;

  return (
    // O invólucro mede a largura viva do painel; a mesa interna usa a largura
    // calculada (nunca maior que a disponível, graças ao teto de colunas).
    <div ref={refMedida} className="w-full">
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
          return (
            <Barbante
              key={l.id}
              a={a}
              b={b}
              esp={especieDoBarbante(l.de, l.para)}
              aoRemover={() => removerLigacao(l.id)}
            />
          );
        })}
      </svg>

      {[...alvos.map((a) => ({ ...a, fila: 'alvo' })), ...fontes.map((f) => ({ ...f, fila: 'fonte' }))].map((n) => {
        const c = caixa(n.id);
        if (!c) return null;
        const sel = origem === n.id;
        // Âncoras seguem escuras (placas do mural); as cartas de prova são
        // pergaminho pregado. O pergaminho define a própria sombra, então o
        // estado selecionado/alvo usa OUTLINE (não é engolido pela cascata).
        const classeAncora = sel
          ? 'border-2 bg-stone-900 border-amber-400 ring-2 ring-amber-400 z-20 shadow-vela-viva'
          : conectando
          ? 'border-2 bg-stone-900 border-latao-claro/80 hover:border-amber-400 shadow-vela'
          : 'border-2 bg-stone-900 border-latao/70 hover:border-latao-claro';
        const classePergaminho = sel
          ? 'carta-pergaminho outline outline-2 outline-amber-400 z-20 -translate-y-0.5'
          : conectando
          ? 'carta-pergaminho hover:outline hover:outline-2 hover:outline-vela'
          : 'carta-pergaminho hover:-translate-y-0.5';
        return (
          // Invólucro posicionado: o atalho "§/ficha" é controle interativo
          // e não pode viver DENTRO do <button> da carta (HTML inválido,
          // leitura ruim em leitor de tela — diagnóstico 21/07, M12). O
          // botão preenche o invólucro; o atalho é irmão, no mesmo lugar.
          <div
            key={n.id}
            style={{ left: c.x, top: c.y, width: CARD_W, height: CARD_H }}
            className={`absolute ${sel ? 'z-20' : ''}`}
          >
          <button
            onClick={() => aoClicar(n.id)}
            title={n.ehAncora ? n.rotulo : n.descricao}
            className={`relative w-full h-full text-left rounded-sm px-3 pt-3 pb-2 overflow-hidden transition-all duration-150 ${
              n.ehAncora ? classeAncora : classePergaminho
            }`}
          >
            {/* A tacha que prega a carta/placa no mural */}
            <span
              className={`tacha-latao absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 ${sel ? 'brightness-125' : ''}`}
              aria-hidden="true"
            />
            {n.ehAncora ? (
              <p className="text-latao-claro text-[10px] tracking-[0.15em] uppercase leading-snug">{n.rotulo}</p>
            ) : (
              <>
                <p className="font-serif text-tinta text-xs leading-snug">{n.textoDisplay}</p>
                <CarimboColeta hora={n.horaRegistro} />
              </>
            )}
          </button>
            {/* Atalho de leitura: abre a ficha de coleta sem desfazer/criar
                ligação. Em ponteiro fino, o "§" discreto (hover evidente);
                em ponteiro grosso, botão explícito "ficha" com área de
                toque ≥ 44px (o ::after invisível estende o alvo além do
                rótulo). Acessível a leitor de tela nos dois modos (P0 §2
                do playtest de 17/07 — antes era aria-hidden e igual aos
                ornamentos "§" dos divisores). */}
            {!n.ehAncora && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Rever a ficha de coleta"
                title="Rever a ficha de coleta"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  abrirFicha(n.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    abrirFicha(n.id);
                  }
                }}
                className={
                  ponteiroGrosso
                    ? "absolute top-0.5 right-1 grid h-7 place-items-center rounded-sm px-2 bg-black/25 text-cera-clara text-[10px] uppercase tracking-widest leading-none cursor-pointer after:content-[''] after:absolute after:-inset-2.5"
                    : 'absolute top-0.5 right-1 grid h-5 w-5 place-items-center rounded-sm text-cera hover:text-cera-clara hover:bg-black/20 text-xs leading-none cursor-pointer'
                }
              >
                {ponteiroGrosso ? 'ficha' : '§'}
              </span>
            )}
          </div>
        );
      })}

      {/* As etiquetas dos fios, por cima das cartas pregadas (ver
          EtiquetaBarbante). Camada inerte: não intercepta clique nenhum. */}
      <svg
        className="absolute inset-0"
        width={largura}
        height={altura}
        style={{ pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {linhas.map((l) => {
          const a = centro(l.de);
          const b = centro(l.para);
          if (!a || !b) return null;
          return <EtiquetaBarbante key={l.id} a={a} b={b} esp={especieDoBarbante(l.de, l.para)} />;
        })}
      </svg>
    </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Um barbante já amarrado. Pende com leve CATENÁRIA (a barriga do fio sob
// o próprio peso) e "se desenha sozinho" ao surgir (avança da origem ao
// alvo). Depois vira um fio comum. A curva grossa invisível por cima é a
// área de clique para REMOVER o barbante.
//
// BOIL (Tarefa 4): o fio existe em três quadros com perturbações FIXAS
// (nada de aleatório em render) — leves nas pontas, maiores na barriga,
// onde um fio real balança mais — alternados pelo CSS `.boil-quadro`
// (index.css) a ~13fps. A área de clique é uma só e não treme.
// ---------------------------------------------------------------------
const QUADROS_BOIL = [
  { ax: 0, ay: 0, cx: 0, cy: 0, bx: 0, by: 0 },
  { ax: 0.6, ay: -0.5, cx: -2.4, cy: 1.8, bx: -0.5, by: 0.4 },
  { ax: -0.5, ay: 0.5, cx: 2.0, cy: -2.2, bx: 0.6, by: -0.4 },
];

function Barbante({ a, b, esp = ESPECIES.desmente, aoRemover }) {
  const refs = useRef([]);

  // Curva de Bézier quadrática: o ponto de controle no meio, empurrado para
  // baixo — a barriga do barbante pendurado (mais funda em fios longos).
  const { cx, cy } = geometriaBarbante(a, b);
  const d = (q, dx = 0, dy = 0) =>
    `M ${a.x + q.ax} ${a.y + q.ay + dy} Q ${cx + q.cx + dx} ${cy + q.cy + dy} ${b.x + q.bx} ${b.y + q.by + dy}`;

  // O desenhar-se aplica aos três quadros ao mesmo tempo: os comprimentos
  // diferem por frações de pixel, e o boil segue vivo durante o gesto.
  useEffect(() => {
    const els = refs.current.filter(Boolean);
    if (!els.length) return;
    els.forEach((el) => {
      const L = el.getTotalLength();
      el.style.transition = 'none';
      el.style.strokeDasharray = String(L);
      el.style.strokeDashoffset = String(L);
    });
    void els[0].getBoundingClientRect();
    els.forEach((el) => {
      el.style.transition = 'stroke-dashoffset 350ms ease-out';
      el.style.strokeDashoffset = '0';
    });
    const t = setTimeout(() => {
      refs.current.filter(Boolean).forEach((el) => {
        // Ao fim do gesto o fio volta à SUA textura (não a fio contínuo):
        // o traço é o que distingue a espécie de quem não lê a cor.
        el.style.strokeDasharray = esp.traco || 'none';
        el.style.transition = 'none';
      });
    }, 380);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a.x, a.y, b.x, b.y, esp.traco]);

  return (
    <g>
      {/* Acessível por teclado: o barbante é focável e remove-se com
          Enter/Espaço — desfazer uma ligação não pode exigir mouse. */}
      <path
        d={d(QUADROS_BOIL[0])}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label="Desfazer esta ligação"
        onClick={() => {
          tocarSom('barbante');
          aoRemover();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tocarSom('barbante');
            aoRemover();
          }
        }}
      />
      {/* O fio tem corpo (Q7): sombra por baixo, e — no fio torcido — a
          torção clara por cima. A cor vem da espécie; o barbante de presença
          guarda o rubro clareado (#c9553f), escolhido para seguir legível sob
          protanopia sem perder o tom de lacre na cortiça. */}
      {QUADROS_BOIL.map((q, i) => (
        <g key={i} className={`boil-quadro boil-quadro--${i}`}>
          <path
            d={d(q, 0, 2)}
            fill="none"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth={5}
            strokeDasharray={esp.traco || undefined}
          />
          <path
            ref={(el) => (refs.current[i] = el)}
            d={d(q)}
            fill="none"
            stroke={esp.cor}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeDasharray={esp.traco || undefined}
          />
          {esp.torcido && (
            <path
              d={d(q, 0, -0.7)}
              fill="none"
              stroke="rgba(240,180,150,0.5)"
              strokeWidth={1.2}
              strokeDasharray="5 7"
            />
          )}
        </g>
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------
// A ETIQUETA DE PAPEL pendurada no fio: diz, por escrito, o que aquele
// barbante afirma. É a marca que sobra quando a cor não chega — e por isso
// vive numa CAMADA POR CIMA das cartas: o fio pode passar por trás de uma
// carta pregada (e passa), mas a etiqueta não pode sumir com ele.
// Fica também fora dos quadros do boil — o papel não treme com o fio.
// ---------------------------------------------------------------------
function EtiquetaBarbante({ a, b, esp }) {
  const { mx, my } = geometriaBarbante(a, b);
  const largura = esp.rotulo.length * 5.4 + 12;
  return (
    <g transform={`translate(${mx} ${my})`}>
      <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.45)" strokeWidth="1" />
      <rect
        x={-largura / 2}
        y="6"
        width={largura}
        height="12"
        rx="1.5"
        fill="#ecdfc3"
        stroke="rgba(37,27,16,0.5)"
        strokeWidth="0.8"
      />
      <text
        x="0"
        y="14.6"
        textAnchor="middle"
        fill="#251b10"
        fontSize="7.5"
        letterSpacing="0.9"
        style={{ fontFamily: 'Oswald, "Arial Narrow", sans-serif', textTransform: 'uppercase' }}
      >
        {esp.rotulo}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------
// A LEGENDA DOS FIOS — a chave da estampa, pregada ao lado do mural.
//
// Só entram as espécies que o jogador de fato AMARRA. Quando e como o
// corpo declara por conta própria (a Estação I assinala os sinais sem
// fio), e a legenda diz isso em vez de fingir um barbante que não existe.
// ---------------------------------------------------------------------
function AmostraBarbante({ esp }) {
  return (
    <svg width="52" height="16" viewBox="0 0 52 16" aria-hidden="true" className="shrink-0">
      <path d="M 2 5 Q 26 15 50 5" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="4" strokeDasharray={esp.traco || undefined} transform="translate(0 1.5)" />
      <path d="M 2 5 Q 26 15 50 5" fill="none" stroke={esp.cor} strokeWidth="2.8" strokeLinecap="round" strokeDasharray={esp.traco || undefined} />
      {esp.torcido && (
        <path d="M 2 5 Q 26 15 50 5" fill="none" stroke="rgba(240,180,150,0.55)" strokeWidth="1" strokeDasharray="4 5" transform="translate(0 -0.6)" />
      )}
    </svg>
  );
}

const GLOSAS = [
  { esp: ESPECIES.presenca, glosa: 'o vestígio ou a marca do lugar que põe o réu na cena' },
  { esp: ESPECIES.desmente, glosa: 'o fato que derruba uma alegação' },
];

export function LegendaBarbantes() {
  return (
    <div className="carta-pergaminho relative rounded-sm px-3 pt-4 pb-3 rotate-[0.4deg]">
      <span className="tacha-latao absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5" aria-hidden="true" />
      <p className="text-rotulo uppercase text-tinta-apagada">Os fios do mural</p>
      <ul className="mt-2 space-y-2">
        {GLOSAS.map(({ esp, glosa }) => (
          <li key={esp.rotulo} className="flex items-center gap-2">
            <AmostraBarbante esp={esp} />
            <span className="min-w-0">
              <span className="block font-rotulo text-[10px] tracking-[0.16em] uppercase text-tinta">
                {esp.rotulo}
              </span>
              <span className="block text-tinta-clara text-[11px] leading-snug">{glosa}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 pt-2 border-t border-dotted border-tinta-apagada/40 text-tinta-clara text-[11px] leading-snug font-serif italic">
        Quando e como o corpo declara na parte I, sem fio a amarrar.
      </p>
    </div>
  );
}
