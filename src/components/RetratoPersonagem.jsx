import { memo } from 'react';
import { obterAparencia } from '../logic/aparencia.js';
import { comporRetrato } from '../logic/retrato.js';
import { CORES_PELE, CORES_CABELO, CORES_TRAJE } from '../data/aparencias.js';
import { hashString } from '../logic/hash.js';

// =====================================================================
// RETRATO DE PERSONAGEM — gravura procedural em SVG (placeholder oficial
// até haver arte). Camadas: moldura → fundo oval → busto/traje → pescoço
// → cabeça (tom de pele) → cabelo → pelos faciais → traços → hachura.
// Tudo deriva do genótipo de aparência (obterAparencia) e do hash do id
// (ângulo da hachura) — determinístico, zero assets, zero Math.random.
// =====================================================================

const TINTA = '#201a14';

// Fator de largura do rosto/busto por compleição.
const FATOR_CORPO = { magro: 0.88, medio: 1, sobrepeso: 1.16 };

function Cabelo({ estilo, cor, fr }) {
  const e1 = 60 - 19.5 * fr;
  const d1 = 60 + 19.5 * fr;
  // Coroa padrão: um crescente sobre a testa.
  const coroa = `M ${e1} 60 Q 60 36 ${d1} 60 Q 60 50 ${e1} 60 Z`;
  switch (estilo) {
    case 'curto':
      return <path d={coroa} fill={cor} />;
    case 'curto_ralo':
      return (
        <g>
          <path d={coroa} fill={cor} opacity="0.55" />
          <path d={`M ${e1 + 4} 55 Q 60 46 ${d1 - 4} 55`} stroke={cor} strokeWidth="1.4" fill="none" />
        </g>
      );
    case 'repartido':
      return (
        <g>
          <path d={coroa} fill={cor} />
          <path d="M 53 41 L 51 58" stroke="#241f1a" strokeWidth="1.6" fill="none" />
        </g>
      );
    case 'despenteado':
      return (
        <g>
          <path d={coroa} fill={cor} />
          <path
            d={`M ${e1} 60 L ${e1 - 3} 50 L ${e1 + 6} 48 L 56 38 L 62 44 L 70 37 L ${d1 - 4} 48 L ${d1 + 3} 52 L ${d1} 60`}
            fill={cor}
          />
        </g>
      );
    case 'coque':
      return (
        <g>
          <path d={coroa} fill={cor} />
          <circle cx="60" cy="37" r="6.5" fill={cor} />
        </g>
      );
    case 'calvo':
      return (
        <g>
          <ellipse cx={e1 + 1} cy="60" rx="4" ry="6" fill={cor} />
          <ellipse cx={d1 - 1} cy="60" rx="4" ry="6" fill={cor} />
        </g>
      );
    default:
      return null;
  }
}

function PelosFaciais({ tipo, cor, fr }) {
  switch (tipo) {
    case 'bigode':
      return <path d="M 48 79.5 Q 60 73.5 72 79.5 Q 60 84.5 48 79.5 Z" fill={cor} />;
    case 'barba':
      return (
        <g>
          <ellipse cx="60" cy="87" rx={15 * fr} ry="13" fill={cor} />
          <path d="M 48 80 Q 60 75 72 80 Q 60 84 48 80 Z" fill={cor} />
          <line x1="55" y1="82.5" x2="65" y2="82.5" stroke="#241f1a" strokeWidth="1.2" />
        </g>
      );
    case 'costeletas':
      return (
        <g>
          <rect x={60 - 19 * fr - 1.5} y="58" width="4" height="17" rx="2" fill={cor} />
          <rect x={60 + 19 * fr - 2.5} y="58" width="4" height="17" rx="2" fill={cor} />
        </g>
      );
    default:
      return null;
  }
}

function Traje({ traje, f }) {
  const corTraje = CORES_TRAJE[traje] || CORES_TRAJE.modesto;
  const busto = `M ${60 - 45 * f} 150 Q ${60 - 40 * f} 112 ${60 - 14} 105 L ${60 + 14} 105 Q ${60 + 40 * f} 112 ${60 + 45 * f} 150 Z`;
  return (
    <g>
      <path d={busto} fill={corTraje} />
      {(traje === 'burgues' || traje === 'luto' || traje === 'modesto') && (
        <g>
          <polygon points="52,106 60,121 68,106" fill="#cfc4ae" />
          <line x1="60" y1="121" x2="60" y2="134" stroke={TINTA} strokeWidth="2.4" />
        </g>
      )}
      {traje === 'servico' && <ellipse cx="60" cy="110" rx="15" ry="6.5" fill="#cfc4ae" opacity="0.92" />}
      {traje === 'taverneiro' && (
        <path d="M 46 108 Q 60 116 74 108 L 72 116 Q 60 122 48 116 Z" fill="#6b3a24" />
      )}
      {traje === 'uniforme' && (
        <g>
          <rect x="52" y="104" width="16" height="5" rx="1" fill="#3a4152" />
          <circle cx="60" cy="118" r="1.6" fill="#8a7a4a" />
          <circle cx="60" cy="128" r="1.6" fill="#8a7a4a" />
          <circle cx="60" cy="138" r="1.6" fill="#8a7a4a" />
        </g>
      )}
    </g>
  );
}

function RetratoPersonagem({ personagemId, tamanho = 88, className = '' }) {
  // Paper-doll de gravura (FASE 3): se o manifesto trouxer camadas para este
  // genótipo, empilha-as no MESMO viewBox 120×150; sem arte, comporRetrato
  // devolve [] e cai no SVG procedural abaixo (fallback integral, idêntico
  // ao de hoje). O data-retrato permanece na raiz nos dois ramos.
  const camadas = comporRetrato(personagemId);
  if (camadas.length) {
    return (
      <svg
        data-retrato={personagemId}
        viewBox="0 0 120 150"
        width={tamanho}
        height={tamanho * 1.25}
        className={className}
        role="img"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="120" height="150" fill="#241f1a" />
        {camadas.map((c) => (
          <image
            key={c.nome}
            href={c.url}
            x="0"
            y="0"
            width="120"
            height="150"
            preserveAspectRatio="xMidYMid meet"
          />
        ))}
        <rect x="1" y="1" width="118" height="148" fill="none" stroke="#78350f" strokeOpacity="0.5" strokeWidth="2" />
      </svg>
    );
  }

  const ap = obterAparencia(personagemId);
  const f = FATOR_CORPO[ap.corpo] ?? 1;
  const fr = ap.corpo === 'sobrepeso' ? 1.1 : ap.corpo === 'magro' ? 0.94 : 1;
  const pele = CORES_PELE[ap.pele] || CORES_PELE.clara;
  const cabelo = CORES_CABELO[ap.cabelo?.cor] || CORES_CABELO.castanho;
  const idHachura = `hachura-${hashString(personagemId)}`;
  const anguloHachura = 34 + (hashString(personagemId) % 22);
  const idosa = ap.idadeAparente === 'idosa';

  return (
    <svg
      data-retrato={personagemId}
      viewBox="0 0 120 150"
      width={tamanho}
      height={tamanho * 1.25}
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={idHachura}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${anguloHachura})`}
        >
          <line x1="0" y1="0" x2="0" y2="3" stroke="#0c0a09" strokeWidth="0.7" />
        </pattern>
      </defs>

      {/* Moldura e fundo oval de gravura */}
      <rect x="0" y="0" width="120" height="150" fill="#241f1a" />
      <ellipse cx="60" cy="74" rx="41" ry="54" fill="#2c2620" />

      {/* Busto e traje */}
      <Traje traje={ap.traje} f={f} />

      {/* Pescoço e cabeça */}
      <rect x={60 - 7 * fr} y="84" width={14 * fr} height="24" fill={pele} />
      <ellipse cx="60" cy="68" rx={19 * fr} ry="25" fill={pele} />
      <ellipse cx={60 - 19 * fr} cy="68" rx="2.6" ry="4.5" fill={pele} />
      <ellipse cx={60 + 19 * fr} cy="68" rx="2.6" ry="4.5" fill={pele} />

      {/* Cabelo e pelos faciais (mesma cor) */}
      <Cabelo estilo={ap.cabelo?.estilo} cor={cabelo} fr={fr} />
      <PelosFaciais tipo={ap.pelosFaciais} cor={cabelo} fr={fr} />

      {/* Traços a tinta: sobrancelhas, olhos, nariz, boca */}
      <line x1="48" y1="59.5" x2="56" y2="59" stroke={TINTA} strokeWidth="1.4" />
      <line x1="64" y1="59" x2="72" y2="59.5" stroke={TINTA} strokeWidth="1.4" />
      <ellipse cx="53" cy="64.5" rx="2" ry="1.2" fill={TINTA} />
      <ellipse cx="67" cy="64.5" rx="2" ry="1.2" fill={TINTA} />
      <polyline points="59,66 57.5,74 61.5,75" stroke={TINTA} strokeWidth="1.1" fill="none" />
      {ap.pelosFaciais !== 'barba' && (
        <line x1="54.5" y1="83" x2="65.5" y2="83" stroke={TINTA} strokeWidth="1.2" />
      )}
      {idosa && (
        <g stroke={TINTA} strokeWidth="0.7" opacity="0.65" fill="none">
          <path d="M 50 69 Q 51.5 71 53.5 70.5" />
          <path d="M 66.5 70.5 Q 68.5 71 70 69" />
          <path d="M 52 78 Q 50.5 82 51.5 86" />
          <path d="M 68 78 Q 69.5 82 68.5 86" />
        </g>
      )}

      {/* Hachura de gravura + vinheta oval */}
      <ellipse cx="60" cy="75" rx="52" ry="68" fill={`url(#${idHachura})`} opacity="0.5" />
      <ellipse cx="60" cy="74" rx="46" ry="60" fill="none" stroke="#0c0a09" strokeWidth="12" opacity="0.32" />
      <rect x="1" y="1" width="118" height="148" fill="none" stroke="#78350f" strokeOpacity="0.5" strokeWidth="2" />
    </svg>
  );
}

// A aparência é estática durante a partida: memo evita re-render do SVG.
export default memo(RetratoPersonagem);
