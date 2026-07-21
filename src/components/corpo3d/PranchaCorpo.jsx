import { useMemo, useRef, useState } from 'react';
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
// pergaminho, figura em contorno de gravura, numeração e legenda. O corpo
// deitado (cabeça à esquerda), a lente que segue o ponteiro e revela o
// detalhe, os hotspots que extraem AS MESMAS cartas dos termos em negrito.
//
// APRESENTAÇÃO PURA: nenhuma regra lê esta prancha. A pose (rigor) e as
// manchas (livor) são função do IPM, lendo as MESMAS faixas do modelo
// universal (tempo_morte.js) que o cadáver 3D lia — nenhum número novo.
// Toda a variação determinística vem de hashString salgado (é camada de
// apresentação: nem Math.random nem arquivo de arte; SVG por seed).
//
// É o placeholder que É o fallback: sem WebGL, sem arquivo, o jogo joga
// idêntico. O SVG (nunca <canvas>) preserva o contrato do ?flat=1.
// =====================================================================

// Paleta da gravura (duotone papel/tinta do EfeitoGravura), mais os tons
// forenses já tokenizados no cadáver 3D.
const COR_PAPEL = '#e7ddc8';
const COR_TINTA = '#2b2119';
const COR_LIVOR = '#4c1d43';
const COR_FERIDA = '#3d0f0f';
const COR_SANGUE = '#4a1a14';
const COR_PANO = '#cabfa6'; // o pano de decoro, mais claro que a tinta

// Projeção maquete → prancha: o corpo 3D deita com a cabeça em x negativo
// (-0.84) e os pés em x positivo (~0.99); z é a largura (esquerda/direita).
// A prancha é a vista dorsal (de cima): x vira o eixo horizontal da folha,
// z vira o vertical. Mesmas posições dos HOTSPOTS_CORPO, reaproveitadas.
const ORIGEM_X = 292;
const ESCALA_X = 235;
const CENTRO_Y = 172;
const ESCALA_Z = 228;
function projetarX(x) {
  return ORIGEM_X + x * ESCALA_X;
}
function projetarY(z) {
  return CENTRO_Y + z * ESCALA_Z;
}

// Rótulo humano da pose do rigor, para a legenda da figura (o rigor "anota-se
// na legenda e sugere-se no contorno" — nota de design §4).
const LEGENDA_RIGOR = {
  instalando: 'rigidez ainda subindo (parcial)',
  pleno: 'rígido por inteiro',
  resolucao: 'rigidez já cedendo',
  resolvido: 'rigidez desfeita',
};

export default function PranchaCorpo({ ipm }) {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const extrairCarta = useJogo((s) => s.extrairCarta);
  const svgRef = useRef(null);
  // Centro da lente em coordenadas de viewBox. Pousa sobre a ferida (o ponto
  // de maior detalhe) e segue o ponteiro no hover; ao sair, volta a pousar.
  const LENTE_POUSO = { x: 150, y: 172 };
  const [lente, setLente] = useState(LENTE_POUSO);

  const aparencia = obterAparencia('vitima');
  const f = aparencia.corpo === 'sobrepeso' ? 1.22 : aparencia.corpo === 'magro' ? 0.86 : 1;
  const pele = CORES_PELE[aparencia.pele] || CORES_PELE.palida;

  const rigor = estadoRigorPorIpm(ipm);
  const livor = estadoLivorPorIpm(ipm);
  const opacidadeLivor = livor === 'fixo' ? 0.82 : 0.32;
  // O rigor afrouxa a pose: no pleno o corpo é tábua (membros rentes); ao
  // resolver-se, braços afastam e pés tombam (espelha POSES_RIGOR do 3D).
  const afrouxa = rigor === 'resolvido' ? 1 : rigor === 'resolucao' ? 0.6 : rigor === 'instalando' ? 0.25 : 0.08;

  const anguloHachura = 32 + (hashString('prancha_vitima_hachura') % 20);

  // Contorno do corpo (meia-largura pela compleição). Um único path fechado,
  // cabeça à esquerda, ombros, braços rentes ao tronco, pano da cintura aos
  // pés. Os pés tombam para fora conforme o rigor cede (afrouxa).
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
  const idPapel = 'grao-prancha';
  const idLenteClip = 'lente-clip';

  const registrada = (cartaId) => cartasRegistradas.some((c) => c.id === cartaId);

  function moverLente(ev) {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ev.touches ? ev.touches[0].clientX : ev.clientX;
    const py = ev.touches ? ev.touches[0].clientY : ev.clientY;
    const vx = ((px - r.left) / r.width) * 620;
    const vy = ((py - r.top) / r.height) * 344;
    setLente({ x: vx, y: vy });
  }

  const K_LENTE = 2.1;
  const R_LENTE = 54;

  return (
    <div className="prancha-corpo carta-pergaminho rounded-sm p-3 sm:p-4" data-prancha="corpo">
      <svg
        ref={svgRef}
        viewBox="0 0 620 344"
        className="w-full h-auto select-none touch-none"
        role="img"
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
          <filter id={idPapel}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.05" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          <clipPath id={idLenteClip}>
            {lente && <circle cx={lente.x} cy={lente.y} r={R_LENTE} />}
          </clipPath>
        </defs>

        {/* Moldura da prancha e cabeçalho de figura */}
        <rect x="4" y="4" width="612" height="336" fill="none" stroke={COR_TINTA} strokeWidth="1.4" opacity="0.55" />
        <rect x="10" y="10" width="600" height="324" fill="none" stroke={COR_TINTA} strokeWidth="0.6" opacity="0.35" />
        <text x="22" y="30" fill={COR_TINTA} fontSize="13" fontStyle="italic" fontFamily="Georgia, serif" opacity="0.85">
          Fig. 1 — Decúbito dorsal
        </text>
        <line x1="22" y1="38" x2="598" y2="38" stroke={COR_TINTA} strokeWidth="0.5" opacity="0.3" />

        {/* A FIGURA: reaproveitável pela lente via <use>. */}
        <g id="prancha-figura">
          {/* Sombra de assentamento sob o corpo */}
          <ellipse cx="315" cy={CENTRO_Y + meia + 6} rx="230" ry="14" fill={COR_TINTA} opacity="0.06" />

          {/* Pano de decoro da cintura aos pés (necrotério) */}
          <rect x="300" y={CENTRO_Y - meia + 2} width="244" height={meia * 2 - 4} rx="6" fill={COR_PANO} opacity="0.9" />
          <line x1="300" y1={CENTRO_Y} x2="540" y2={CENTRO_Y} stroke={COR_TINTA} strokeWidth="0.4" opacity="0.25" />

          {/* Livor dorsal: faixa rente à borda inferior (o corpo tocou o chão
              de costas), mais densa quando fixa */}
          <path
            d={`M 150 ${CENTRO_Y + meia - 8} Q 300 ${CENTRO_Y + meia + 3} 300 ${CENTRO_Y + meia - 8} L 300 ${CENTRO_Y + meia} Q 220 ${CENTRO_Y + meia + 6} 150 ${CENTRO_Y + meia} Z`}
            fill={COR_LIVOR}
            opacity={opacidadeLivor}
          />
          <ellipse cx="210" cy={CENTRO_Y + meia - 6} rx="66" ry="9" fill={COR_LIVOR} opacity={opacidadeLivor * 0.7} />

          {/* Corpo: contorno preenchido de pele, sobreposto da hachura */}
          <path d={contorno} fill={pele} stroke={COR_TINTA} strokeWidth="1.5" strokeLinejoin="round" />
          <path d={contorno} fill={`url(#${idHachura})`} stroke="none" opacity="0.9" />

          {/* Cabeça */}
          <ellipse cx="112" cy={CENTRO_Y} rx="34" ry="30" fill={pele} stroke={COR_TINTA} strokeWidth="1.4" />
          <path
            d={`M 82 ${CENTRO_Y - 26} A 34 30 0 0 1 146 ${CENTRO_Y - 20}`}
            fill="none"
            stroke={COR_TINTA}
            strokeWidth="0.6"
            opacity="0.3"
          />

          {/* Linhas de traje/tronco (colete abotoado) */}
          <line x1="176" y1={CENTRO_Y} x2="298" y2={CENTRO_Y} stroke={COR_TINTA} strokeWidth="0.7" opacity="0.4" />
          {[200, 228, 256, 284].map((cx) => (
            <circle key={cx} cx={cx} cy={CENTRO_Y} r="2.1" fill={COR_TINTA} opacity="0.5" />
          ))}

          {/* Braços rentes (sugeridos por dois filetes ao longo do tronco);
              afastam-se de leve conforme o rigor cede */}
          <line
            x1="176"
            y1={CENTRO_Y - meia + 9 - afrouxa * 5}
            x2="300"
            y2={CENTRO_Y - meia + 9 - afrouxa * 5}
            stroke={COR_TINTA}
            strokeWidth="1"
            opacity="0.5"
          />
          <line
            x1="176"
            y1={CENTRO_Y + meia - 9 + afrouxa * 5}
            x2="300"
            y2={CENTRO_Y + meia - 9 + afrouxa * 5}
            stroke={COR_TINTA}
            strokeWidth="1"
            opacity="0.5"
          />

          {/* A FERIDA do caso: boca estreita sob o ângulo do maxilar, mancha
              que desceu à gola (arma branca; sem sulco, sem petéquias) */}
          <path d={`M 132 ${CENTRO_Y + 16} l 16 6 l -3 5 l -15 -6 Z`} fill={COR_FERIDA} />
          <path d={`M 146 ${CENTRO_Y + 24} q 18 8 30 6 l -2 8 q -16 0 -30 -8 Z`} fill={COR_SANGUE} opacity="0.7" />
        </g>

        {/* A LENTE: cópia ampliada da figura, recortada num círculo que segue
            o ponteiro — o detalhe de gravura a 2× (hachura mais fina) */}
        {lente && (
          <g aria-hidden="true">
            <g clipPath={`url(#${idLenteClip})`}>
              <rect
                x={lente.x - R_LENTE}
                y={lente.y - R_LENTE}
                width={R_LENTE * 2}
                height={R_LENTE * 2}
                fill={COR_PAPEL}
              />
              <use
                href="#prancha-figura"
                transform={`translate(${lente.x} ${lente.y}) scale(${K_LENTE}) translate(${-lente.x} ${-lente.y})`}
              />
            </g>
            <circle cx={lente.x} cy={lente.y} r={R_LENTE} fill="none" stroke={COR_TINTA} strokeWidth="3" opacity="0.7" />
            <circle cx={lente.x} cy={lente.y} r={R_LENTE + 3} fill="none" stroke="#78350f" strokeWidth="1.5" opacity="0.8" />
          </g>
        )}

        {/* HOTSPOTS: as regiões que extraem carta. Preservam data-carta-id
            (ponte de destaque recíproco com o termo em negrito da prosa). */}
        {HOTSPOTS_CORPO.map((h) => {
          const cx = projetarX(h.posicao[0]);
          const cy = projetarY(h.posicao[2]);
          const feito = registrada(h.cartaId);
          const raio = Math.max(15, Math.min(30, h.raio * 78));
          return (
            <g
              key={h.cartaId}
              data-carta-id={h.cartaId}
              className={feito ? 'prancha-hotspot prancha-hotspot--feito' : 'prancha-hotspot'}
              onClick={feito ? undefined : () => extrairCarta(h.cartaId)}
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
              {feito ? (
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fill="#78350f" opacity="0.8">
                  ✓
                </text>
              ) : (
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize="15" fill="#78350f" fontWeight="700">
                  +
                </text>
              )}
            </g>
          );
        })}

        {/* Legenda de figura: estado perecível anotado (rigor + livor) */}
        <text x="22" y="326" fill={COR_TINTA} fontSize="11" fontFamily="Georgia, serif" opacity="0.7">
          Rigor: {LEGENDA_RIGOR[rigor] || rigor}. Livores {livor === 'fixo' ? 'fixos' : 'ainda móveis'}.
        </text>
        <text x="598" y="326" textAnchor="end" fill={COR_TINTA} fontSize="10" fontStyle="italic" opacity="0.55">
          passe a lente sobre a figura
        </text>
      </svg>
    </div>
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
