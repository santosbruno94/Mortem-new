import { useEffect, useMemo, useRef, useState } from 'react';
import { useJogo } from '../../store/jogo.js';
import { estadoRigorPorIpm, estadoLivorPorIpm } from '../../logic/tempo_morte.js';
import { obterAparencia } from '../../logic/aparencia.js';
import { CORES_PELE } from '../../data/aparencias.js';
import { hashString } from '../../logic/hash.js';
import { HOTSPOTS_CORPO } from '../../data/hotspots_corpo.js';

// =====================================================================
// A PRANCHA DO CORPO — atlas de medicina legal em SVG procedural.
//
// Pivô de apresentação (nota "Gabinete Ilustrado", jul/2026): a mesa de
// exame deixa de ser cadáver 3D e passa a ser PRANCHA de atlas — folha de
// pergaminho, figura em contorno de gravura, numeração e legenda.
//
//   • FRENTE E VERSO (Inc.2): "Virar a prancha" alterna Fig. 1 (o corpo em
//     decúbito dorsal, face anterior) e Fig. 2 (o MESMO corpo supino visto
//     por trás — o dorso, face posterior, onde os livores de fato pousam).
//     Rotula-se pela FACE (frente/dorso), não pelo decúbito: o corpo não
//     muda de posição, muda o lado que se ilustra — senão o livor dorsal
//     leria como "corpo movido", que este caso não tem. O verso tira o
//     livor dorsal da dependência de câmera 3D.
//   • EXAME EXTERNO / NECROPSIA (Inc.2): alternador de camada. A necropsia é
//     a figura de dissecção do atlas — ILUSTRA o dano interno (trajeto da
//     lesão) que a leitura e as cartas já dizem; NÃO cria canal novo de
//     informação (nenhum hotspot próprio, o motor segue cego à imagem).
//   • A LUPA: lente circular que segue o ponteiro e amplia o detalhe (2×).
//   • Os hotspots extraem AS MESMAS cartas dos termos em negrito da prosa.
//
// APRESENTAÇÃO PURA: nenhuma regra lê esta prancha. A pose (rigor) e as
// manchas (livor) são função do IPM, lendo as MESMAS faixas do modelo
// universal (tempo_morte.js). Toda variação determinística vem de hashString
// (camada de apresentação: nem Math.random nem arquivo de arte; SVG por seed).
//
// É o placeholder que É o fallback: sem WebGL, sem arquivo, joga idêntico.
// O SVG (nunca <canvas>) preserva o contrato do ?flat=1.
// =====================================================================

// Paleta da prancha ao "edição de imprensa" (mesmos nomes de token, faces
// evoluídas): pergaminho mais claro, tinta ferrogálica mais escura.
const COR_PAPEL = '#ecdfc3';
const COR_TINTA = '#251b10';
const COR_LIVOR = '#4c1d43';
const COR_FERIDA = '#3d0f0f';
const COR_SANGUE = '#4a1a14';
const COR_PANO = '#d8cbab';
// A voz do documento antigo (IM Fell) nas legendas do atlas; Georgia de reserva.
const FONTE_ATLAS = "'IM Fell English', Georgia, serif";

// Projeção maquete → prancha (mesma dos HOTSPOTS_CORPO 3D reaproveitados).
const ORIGEM_X = 292;
const ESCALA_X = 235;
const CENTRO_Y = 172;
const ESCALA_Z = 228;
const projetarX = (x) => ORIGEM_X + x * ESCALA_X;
const projetarY = (z) => CENTRO_Y + z * ESCALA_Z;

const LEGENDA_RIGOR = {
  instalando: 'rigidez ainda subindo (parcial)',
  pleno: 'rígido por inteiro',
  resolucao: 'rigidez já cedendo',
  resolvido: 'rigidez desfeita',
};

// Que hotspots aparecem em cada vista. A necropsia é ilustrativa: 0 hotspots.
const HOTSPOTS_POR_VISTA = {
  frente: ['ev_rigor', 'ev_ferida', 'ev_reacao_vital', 'ev_residuo_ferida', 'ev_relogio_bolso'],
  dorso: ['ev_livores'],
  necropsia: [],
};

const K_LENTE = 2.1;
const R_LENTE = 54;

export default function PranchaCorpo({ ipm }) {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const extrairCarta = useJogo((s) => s.extrairCarta);
  const svgRef = useRef(null);
  const LENTE_POUSO = { x: 150, y: 172 };
  const [lente, setLente] = useState(LENTE_POUSO);
  // Camada e face independentes (dois alternadores da nota §4).
  const [camada, setCamada] = useState('externo'); // 'externo' | 'necropsia'
  const [face, setFace] = useState('frente'); // 'frente' (Fig.1) | 'dorso' (Fig.2)
  const vista = camada === 'necropsia' ? 'necropsia' : face;

  // O GESTO VIRA A PRANCHA (playtest cego de 27/07/2026, item 4). Voltar o
  // corpo é o gesto que expõe o dorso; a prancha ficava na face anterior, e o
  // livor dorsal — a 8ª observação do exame — só se alcançava caçando um
  // hotspot pequeno na figura ou o outro botão, o de virar a folha. Quando a
  // carta do livor entra na mesa, a prancha passa à Fig. 2 sozinha: o perito
  // voltou o corpo, e o atlas mostra o lado que ele acabou de descobrir.
  // Só na TRANSIÇÃO — reabrir o exame com o livor já colhido não força a face,
  // e virar a folha de volta continua sendo do jogador.
  const tinhaLivores = useRef(cartasRegistradas.some((c) => c.id === 'ev_livores'));
  const temLivores = cartasRegistradas.some((c) => c.id === 'ev_livores');
  useEffect(() => {
    if (temLivores && !tinhaLivores.current) setFace('dorso');
    tinhaLivores.current = temLivores;
  }, [temLivores]);

  const aparencia = obterAparencia('vitima');
  const f = aparencia.corpo === 'sobrepeso' ? 1.22 : aparencia.corpo === 'magro' ? 0.86 : 1;
  const pele = CORES_PELE[aparencia.pele] || CORES_PELE.palida;

  const rigor = estadoRigorPorIpm(ipm);
  const livor = estadoLivorPorIpm(ipm);
  const opacidadeLivor = livor === 'fixo' ? 0.82 : 0.32;
  const afrouxa = rigor === 'resolvido' ? 1 : rigor === 'resolucao' ? 0.6 : rigor === 'instalando' ? 0.25 : 0.08;
  const anguloHachura = 32 + (hashString('prancha_vitima_hachura') % 20);

  const meia = 42 * f;
  const tombo = 10 * afrouxa;
  const contorno = useMemo(() => {
    const cima = CENTRO_Y - meia;
    const baixo = CENTRO_Y + meia;
    return [
      `M 96 ${CENTRO_Y}`,
      `C 96 ${CENTRO_Y - 30}, 132 ${cima - 4}, 168 ${cima}`,
      `L 300 ${cima}`,
      `C 380 ${cima}, 470 ${cima + 4}, 508 ${cima + 8}`,
      `L 540 ${cima + 12 + tombo}`,
      `L 540 ${baixo - 12 - tombo}`,
      `L 508 ${baixo - 8}`,
      `C 470 ${baixo - 4}, 380 ${baixo}, 300 ${baixo}`,
      `L 168 ${baixo}`,
      `C 132 ${baixo + 4}, 96 ${CENTRO_Y + 30}, 96 ${CENTRO_Y}`,
      'Z',
    ].join(' ');
  }, [meia, tombo]);

  const idHachura = 'hachura-prancha';
  const idLenteClip = 'lente-clip';
  const registrada = (cartaId) => cartasRegistradas.some((c) => c.id === cartaId);

  // A lente re-renderiza o SVG inteiro a cada atualização; o mousemove
  // dispara mais rápido que o quadro. Um rAF-throttle limita a UM render
  // por quadro sem mudar o comportamento (diagnóstico 21/07, M10).
  const lenteAlvo = useRef(null);
  const rafLente = useRef(0);
  useEffect(() => () => cancelAnimationFrame(rafLente.current), []);
  function moverLente(ev) {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ev.touches ? ev.touches[0].clientX : ev.clientX;
    const py = ev.touches ? ev.touches[0].clientY : ev.clientY;
    lenteAlvo.current = { x: ((px - r.left) / r.width) * 620, y: ((py - r.top) / r.height) * 344 };
    if (!rafLente.current) {
      rafLente.current = requestAnimationFrame(() => {
        rafLente.current = 0;
        if (lenteAlvo.current) setLente(lenteAlvo.current);
      });
    }
  }

  const tituloFigura =
    vista === 'necropsia'
      ? 'Necropsia — trajeto da lesão cervical'
      : vista === 'dorso'
      ? 'Fig. 2 — O dorso (face posterior)'
      : 'Fig. 1 — Decúbito dorsal (face anterior)';

  const legendaPerecivel =
    vista === 'necropsia'
      ? 'Ilustração de dissecção — não acrescenta ao que o corpo já disse.'
      : `Rigor: ${LEGENDA_RIGOR[rigor] || rigor}. Livores ${livor === 'fixo' ? 'fixos' : 'ainda móveis'}${
          vista === 'dorso' ? ', pousados no dorso' : ''
        }.`;

  const hotspotsVista = HOTSPOTS_CORPO.filter((h) => HOTSPOTS_POR_VISTA[vista].includes(h.cartaId));

  return (
    <div className="prancha-corpo carta-pergaminho rounded-sm p-3 sm:p-4" data-prancha="corpo">
      <svg
        ref={svgRef}
        viewBox="0 0 620 344"
        className="w-full h-auto select-none touch-none"
        role="group"
        aria-label="Prancha de exame do corpo — figura de atlas de medicina legal"
        onMouseMove={moverLente}
        onMouseLeave={() => setLente(LENTE_POUSO)}
        onTouchStart={moverLente}
        onTouchMove={moverLente}
        onTouchEnd={() => setLente(LENTE_POUSO)}
      >
        <defs>
          <pattern id={idHachura} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform={`rotate(${anguloHachura})`}>
            <rect width="6" height="6" fill="none" />
            <line x1="0" y1="0" x2="0" y2="6" stroke={COR_TINTA} strokeWidth="0.7" opacity="0.5" />
          </pattern>
          <clipPath id={idLenteClip}>
            <circle cx={lente.x} cy={lente.y} r={R_LENTE} />
          </clipPath>
        </defs>

        <rect x="4" y="4" width="612" height="336" fill="none" stroke={COR_TINTA} strokeWidth="1.4" opacity="0.55" />
        <rect x="10" y="10" width="600" height="324" fill="none" stroke={COR_TINTA} strokeWidth="0.6" opacity="0.35" />
        <text x="22" y="30" fill={COR_TINTA} fontSize="13" fontStyle="italic" fontFamily={FONTE_ATLAS} opacity="0.85">
          {tituloFigura}
        </text>
        <line x1="22" y1="38" x2="598" y2="38" stroke={COR_TINTA} strokeWidth="0.5" opacity="0.3" />

        <g id="prancha-figura">
          {vista === 'necropsia' ? (
            <FiguraNecropsia />
          ) : vista === 'dorso' ? (
            <FiguraDorso contorno={contorno} pele={pele} meia={meia} idHachura={idHachura} opacidadeLivor={opacidadeLivor} />
          ) : (
            <FiguraFrente contorno={contorno} pele={pele} meia={meia} f={f} afrouxa={afrouxa} idHachura={idHachura} opacidadeLivor={opacidadeLivor} />
          )}
        </g>

        {/* A LENTE: cópia ampliada da figura, recortada num círculo que segue
            o ponteiro — o detalhe de gravura a 2× */}
        <g aria-hidden="true" data-lente="">
          <g clipPath={`url(#${idLenteClip})`}>
            <rect x={lente.x - R_LENTE} y={lente.y - R_LENTE} width={R_LENTE * 2} height={R_LENTE * 2} fill={COR_PAPEL} />
            <use href="#prancha-figura" transform={`translate(${lente.x} ${lente.y}) scale(${K_LENTE}) translate(${-lente.x} ${-lente.y})`} />
          </g>
          <circle cx={lente.x} cy={lente.y} r={R_LENTE} fill="none" stroke={COR_TINTA} strokeWidth="3" opacity="0.7" />
          <circle cx={lente.x} cy={lente.y} r={R_LENTE + 3} fill="none" stroke="#78350f" strokeWidth="1.5" opacity="0.8" />
        </g>

        {/* HOTSPOTS da vista corrente (a necropsia não tem — é ilustração). */}
        {hotspotsVista.map((h) => {
          const cx = projetarX(h.posicao[0]);
          const cy = projetarY(h.posicao[2]);
          const feito = registrada(h.cartaId);
          const raio = Math.max(15, Math.min(30, h.raio * 78));
          return (
            // Acessível por teclado (o svg-pai é role="group", não "img", para
            // os filhos interativos existirem na árvore de acessibilidade):
            // Enter/Espaço extrai como o clique. As mesmas cartas também saem
            // pelos termos da prosa — este é o caminho redundante.
            <g
              key={h.cartaId}
              data-carta-id={h.cartaId}
              className={feito ? 'prancha-hotspot prancha-hotspot--feito' : 'prancha-hotspot'}
              role="button"
              tabIndex={feito ? -1 : 0}
              aria-label={feito ? 'Observação já registrada' : 'Registrar observação do corpo'}
              onClick={feito ? undefined : () => extrairCarta(h.cartaId)}
              onKeyDown={
                feito
                  ? undefined
                  : (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        extrairCarta(h.cartaId);
                      }
                    }
              }
              onMouseEnter={() => destacarTermo(h.cartaId, true)}
              onMouseLeave={() => destacarTermo(h.cartaId, false)}
              style={{ cursor: feito ? 'default' : 'pointer' }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={raio}
                fill={feito ? 'rgba(120,53,15,0.10)' : 'rgba(120,53,15,0.04)'}
                stroke="#78350f"
                strokeWidth={feito ? 1 : 1.4}
                strokeDasharray={feito ? '0' : '3 3'}
                opacity={feito ? 0.55 : 0.85}
              />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize={feito ? '13' : '15'} fill="#78350f" fontWeight={feito ? '400' : '700'} opacity={feito ? 0.8 : 1}>
                {feito ? '✓' : '+'}
              </text>
            </g>
          );
        })}

        <text x="22" y="326" fill={COR_TINTA} fontSize="11" fontFamily={FONTE_ATLAS} opacity="0.7">
          {legendaPerecivel}
        </text>
        <text x="598" y="326" textAnchor="end" fill={COR_TINTA} fontSize="10" fontStyle="italic" opacity="0.55">
          passe a lente sobre a figura
        </text>
      </svg>

      {/* Os dois alternadores da prancha (nota §4). Camada de apresentação:
          botões de mesa em miniatura; não custam tempo, não leem o motor. */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          data-prancha-camada={camada}
          onClick={() => setCamada((c) => (c === 'externo' ? 'necropsia' : 'externo'))}
          className="botao-mesa botao-mesa--quieto !px-3 !py-1.5 !text-xs tracking-wide"
        >
          {camada === 'externo' ? 'Abrir a necropsia' : 'Voltar ao exame externo'}
        </button>
        {camada === 'externo' && (
          <button
            type="button"
            data-prancha-face={face}
            onClick={() => setFace((v) => (v === 'frente' ? 'dorso' : 'frente'))}
            className="botao-mesa botao-mesa--quieto !px-3 !py-1.5 !text-xs tracking-wide"
          >
            Virar a prancha {face === 'frente' ? '→ dorso' : '→ frente'}
          </button>
        )}
      </div>
    </div>
  );
}

// --- Figuras por vista -------------------------------------------------

// Fig. 1 — a face anterior do corpo supino (decúbito dorsal).
function FiguraFrente({ contorno, pele, meia, f, afrouxa, idHachura, opacidadeLivor }) {
  return (
    <g>
      <ellipse cx="315" cy={CENTRO_Y + meia + 6} rx="230" ry="14" fill={COR_TINTA} opacity="0.06" />
      {/* Pano de decoro da cintura aos pés */}
      <rect x="300" y={CENTRO_Y - meia + 2} width="244" height={meia * 2 - 4} rx="6" fill={COR_PANO} opacity="0.9" />
      <line x1="300" y1={CENTRO_Y} x2="540" y2={CENTRO_Y} stroke={COR_TINTA} strokeWidth="0.4" opacity="0.25" />
      {/* Livor entrevisto na borda (o grosso dele está no dorso — vire a prancha) */}
      <path
        d={`M 150 ${CENTRO_Y + meia - 8} Q 300 ${CENTRO_Y + meia + 3} 300 ${CENTRO_Y + meia - 8} L 300 ${CENTRO_Y + meia} Q 220 ${CENTRO_Y + meia + 6} 150 ${CENTRO_Y + meia} Z`}
        fill={COR_LIVOR}
        opacity={opacidadeLivor * 0.6}
      />
      {/* Corpo */}
      <path d={contorno} fill={pele} stroke={COR_TINTA} strokeWidth="1.5" strokeLinejoin="round" />
      <path d={contorno} fill={`url(#${idHachura})`} stroke="none" opacity="0.9" />
      {/* Cabeça */}
      <ellipse cx="112" cy={CENTRO_Y} rx="34" ry="30" fill={pele} stroke={COR_TINTA} strokeWidth="1.4" />
      <path d={`M 82 ${CENTRO_Y - 26} A 34 30 0 0 1 146 ${CENTRO_Y - 20}`} fill="none" stroke={COR_TINTA} strokeWidth="0.6" opacity="0.3" />
      {/* Tronco (colete abotoado) */}
      <line x1="176" y1={CENTRO_Y} x2="298" y2={CENTRO_Y} stroke={COR_TINTA} strokeWidth="0.7" opacity="0.4" />
      {[200, 228, 256, 284].map((cx) => (
        <circle key={cx} cx={cx} cy={CENTRO_Y} r="2.1" fill={COR_TINTA} opacity="0.5" />
      ))}
      {/* Braços rentes (afastam-se de leve conforme o rigor cede) */}
      <line x1="176" y1={CENTRO_Y - meia + 9 - afrouxa * 5} x2="300" y2={CENTRO_Y - meia + 9 - afrouxa * 5} stroke={COR_TINTA} strokeWidth="1" opacity="0.5" />
      <line x1="176" y1={CENTRO_Y + meia - 9 + afrouxa * 5} x2="300" y2={CENTRO_Y + meia - 9 + afrouxa * 5} stroke={COR_TINTA} strokeWidth="1" opacity="0.5" />
      {/* A ferida do caso: boca estreita sob o maxilar, mancha à gola */}
      <path d={`M 132 ${CENTRO_Y + 16} l 16 6 l -3 5 l -15 -6 Z`} fill={COR_FERIDA} />
      <path d={`M 146 ${CENTRO_Y + 24} q 18 8 30 6 l -2 8 q -16 0 -30 -8 Z`} fill={COR_SANGUE} opacity="0.7" />
    </g>
  );
}

// Fig. 2 — o mesmo corpo supino visto por trás (face posterior).
function FiguraDorso({ contorno, pele, meia, idHachura, opacidadeLivor }) {
  // O dorso: mesma silhueta, superfície posterior à mostra. Aqui o livor
  // pousa de fato — mancha larga ao longo das costas (partes baixas do
  // corpo deitado de costas), mais densa quando fixo.
  return (
    <g>
      <ellipse cx="315" cy={CENTRO_Y + meia + 6} rx="230" ry="14" fill={COR_TINTA} opacity="0.06" />
      <rect x="300" y={CENTRO_Y - meia + 2} width="244" height={meia * 2 - 4} rx="6" fill={COR_PANO} opacity="0.9" />
      <path d={contorno} fill={pele} stroke={COR_TINTA} strokeWidth="1.5" strokeLinejoin="round" />
      {/* LIVOR dorsal: faixa larga rente à espinha, sobre ombros e nádegas */}
      <path
        d={`M 150 ${CENTRO_Y - 20} Q 250 ${CENTRO_Y - 30} 300 ${CENTRO_Y - 18} L 300 ${CENTRO_Y + 18} Q 250 ${CENTRO_Y + 30} 150 ${CENTRO_Y + 20} Z`}
        fill={COR_LIVOR}
        opacity={opacidadeLivor}
      />
      <ellipse cx="360" cy={CENTRO_Y} rx="40" ry="26" fill={COR_LIVOR} opacity={opacidadeLivor * 0.85} />
      <path d={contorno} fill={`url(#${idHachura})`} stroke="none" opacity="0.55" />
      {/* Cabeça (nuca) */}
      <ellipse cx="112" cy={CENTRO_Y} rx="34" ry="30" fill={pele} stroke={COR_TINTA} strokeWidth="1.4" />
      <ellipse cx="112" cy={CENTRO_Y} rx="16" ry="18" fill={COR_LIVOR} opacity={opacidadeLivor * 0.7} />
      {/* Linha da espinha */}
      <line x1="150" y1={CENTRO_Y} x2="300" y2={CENTRO_Y} stroke={COR_TINTA} strokeWidth="0.6" opacity="0.35" strokeDasharray="4 3" />
    </g>
  );
}

function FiguraNecropsia() {
  // Figura de dissecção: o pescoço ampliado com o trajeto da ferida incisa
  // (bordas nítidas, mais funda que comprida). Ilustração — não extrai nada.
  const cx = 250;
  const cy = CENTRO_Y;
  return (
    <g>
      {/* Bloco de tecido cervical em corte */}
      <rect x={cx - 150} y={cy - 70} width="300" height="150" rx="8" fill={COR_PANO} opacity="0.55" stroke={COR_TINTA} strokeWidth="0.8" />
      {/* Camadas (pele / subcutâneo / plano profundo), em hachura de atlas */}
      {[-46, -20, 6, 32].map((dy, i) => (
        <line key={i} x1={cx - 148} y1={cy + dy} x2={cx + 148} y2={cy + dy} stroke={COR_TINTA} strokeWidth="0.5" opacity="0.25" />
      ))}
      {/* O trajeto da lâmina: cunha nítida, mais funda que a boca */}
      <path d={`M ${cx - 40} ${cy - 44} L ${cx - 30} ${cy - 44} L ${cx + 34} ${cy + 40} L ${cx + 26} ${cy + 46} Z`} fill={COR_FERIDA} />
      <path d={`M ${cx - 40} ${cy - 44} L ${cx - 30} ${cy - 44} L ${cx + 34} ${cy + 40} L ${cx + 26} ${cy + 46} Z`} fill="none" stroke={COR_SANGUE} strokeWidth="1.2" opacity="0.8" />
      {/* Seta de leitura e rótulos de atlas */}
      <line x1={cx + 60} y1={cy - 30} x2={cx + 4} y2={cy - 6} stroke={COR_TINTA} strokeWidth="0.7" opacity="0.6" markerEnd="" />
      <text x={cx + 64} y={cy - 30} fill={COR_TINTA} fontSize="11" fontFamily={FONTE_ATLAS} opacity="0.8">
        bordas nítidas, sem ponte de tecido
      </text>
      <text x={cx + 40} y={cy + 60} fill={COR_TINTA} fontSize="11" fontFamily={FONTE_ATLAS} opacity="0.8">
        canal mais fundo que comprido
      </text>
      <text x={cx - 148} y={cy - 54} fill={COR_TINTA} fontSize="10" fontStyle="italic" opacity="0.6">
        Ferida cervical, ângulo esquerdo do maxilar
      </text>
    </g>
  );
}

// Ponte DOM entre a prancha e a coluna de prosa: em hover no hotspot, realça
// o termo em negrito correspondente (mesma técnica do HotspotCorpo 3D).
function destacarTermo(cartaId, ligar) {
  const termos = document.querySelectorAll(`[data-carta-id="${cartaId}"]`);
  termos.forEach((el) => {
    if (el.classList.contains('termo-clicavel') || el.classList.contains('termo-extraido')) {
      el.classList.toggle('termo-destacado', ligar);
    }
  });
}
