import { hashString } from '../logic/hash.js';

// =====================================================================
// FUNDO DE CENA — backdrop 2D paramétrico da localidade (gravura).
//
// Sistema 2 do pivô "Gabinete Ilustrado" (nota de design §5): cada
// localidade ganha um fundo determinístico — parede/piso na paleta
// madeira/vela/papel, uma fonte de luz (janela ou vela) e 2–3 elementos
// que identificam o lugar (prateleira de ferramentas na oficina, balcão
// na loja, arquivos na delegacia…), tudo sob a mesma hachura de gravura.
//
// APRESENTAÇÃO PURA: nenhuma regra lê o fundo. SVG procedural, zero
// arquivo de arte, zero Math.random (o ângulo da hachura vem de
// hashString). É a "primeira onda" (silhueta legível) — quando (e se)
// houver arte externa sob contrato, ela entra slot a slot com este
// fundo como fallback obrigatório.
// =====================================================================

const TINTA = '#0c0a09';
const OBJETO = '#2a231b';
const OBJETO2 = '#372c20';

// Deriva o tipo de cena a partir do id da localidade e do grupo do nó.
// Mapeamento de apresentação — nenhuma regra depende dele; o default
// 'gabinete' serve a qualquer cômodo fechado sem correspondência própria.
export function tipoCenaDe(localidadeId = '', grupo = '') {
  const id = String(localidadeId).toLowerCase();
  if (id.includes('corpo') || id.includes('saleta') || id.includes('gabinete')) return 'gabinete';
  if (id.includes('oficina') || id.includes('cena')) return 'oficina';
  if (id.includes('loja') || id.includes('correio') || id.includes('rooke') || id.includes('agnes')) return 'loja';
  if (id.includes('delegacia') || id.includes('wycliffe')) return 'delegacia';
  if (id.includes('estalagem') || id.includes('walter')) return 'estalagem';
  if (id.includes('moinho') || id.includes('grey') || id.includes('moleiro')) return 'moinho';
  if (grupo === 'relojoaria') return 'oficina';
  return 'gabinete';
}

const ELEMENTOS = {
  gabinete: (
    <g>
      {/* Estante de livros-razão ao fundo */}
      <rect x="24" y="40" width="120" height="96" fill={OBJETO} />
      {[54, 74, 94, 114].map((y) => (
        <line key={y} x1="24" y1={y} x2="144" y2={y} stroke={TINTA} strokeWidth="2" opacity="0.5" />
      ))}
      {[40, 60, 80, 100, 120].map((x) => (
        <rect key={x} x={x} y="44" width="8" height="88" fill={OBJETO2} opacity="0.7" />
      ))}
      {/* Escrivaninha */}
      <rect x="180" y="150" width="270" height="14" fill={OBJETO2} />
      <rect x="300" y="132" width="60" height="20" fill={OBJETO} />
    </g>
  ),
  oficina: (
    <g>
      {/* Bancada e painel de ferramentas penduradas */}
      <rect x="30" y="46" width="150" height="70" fill={OBJETO} />
      {[54, 70, 92].map((x, i) => (
        <line key={i} x1={x + 30} y1="50" x2={x + 30} y2={70 + i * 6} stroke={TINTA} strokeWidth="2.4" opacity="0.6" />
      ))}
      <circle cx="72" cy="58" r="9" fill="none" stroke={TINTA} strokeWidth="2.4" opacity="0.6" />
      <rect x="24" y="150" width="200" height="16" fill={OBJETO2} />
      <rect x="40" y="132" width="26" height="18" fill={OBJETO} />
    </g>
  ),
  loja: (
    <g>
      {/* Balcão e prateleira de potes/vidros */}
      <rect x="24" y="44" width="150" height="70" fill={OBJETO} />
      {[58, 84].map((y) => (
        <line key={y} x1="24" y1={y} x2="174" y2={y} stroke={TINTA} strokeWidth="2" opacity="0.5" />
      ))}
      {[40, 66, 92, 118, 144].map((x) => (
        <rect key={x} x={x} y={x % 2 ? 48 : 62} width="12" height="16" rx="3" fill={OBJETO2} opacity="0.8" />
      ))}
      <rect x="150" y="150" width="300" height="18" fill={OBJETO2} />
    </g>
  ),
  delegacia: (
    <g>
      {/* Arquivos e janela gradeada */}
      <rect x="24" y="40" width="96" height="100" fill={OBJETO} />
      {[62, 84, 106].map((y) => (
        <rect key={y} x="30" y={y} width="84" height="14" fill={OBJETO2} opacity="0.8" />
      ))}
      <rect x="150" y="44" width="70" height="60" fill="none" stroke={TINTA} strokeWidth="2.5" opacity="0.5" />
      <line x1="185" y1="44" x2="185" y2="104" stroke={TINTA} strokeWidth="2.5" opacity="0.5" />
      <rect x="260" y="150" width="200" height="16" fill={OBJETO2} />
    </g>
  ),
  estalagem: (
    <g>
      {/* Balcão de taberna e garrafas; brilho de lareira à direita */}
      <rect x="24" y="120" width="230" height="46" fill={OBJETO2} />
      {[40, 62, 84, 106, 128].map((x) => (
        <rect key={x} x={x} y="96" width="9" height="24" rx="3" fill={OBJETO} />
      ))}
      <ellipse cx="410" cy="120" rx="46" ry="40" fill="#7a3b16" opacity="0.35" />
      <rect x="386" y="112" width="48" height="40" fill={OBJETO} opacity="0.7" />
    </g>
  ),
  moinho: (
    <g>
      {/* Sacas empilhadas e a sombra de uma roda */}
      <ellipse cx="120" cy="86" rx="58" ry="58" fill="none" stroke={TINTA} strokeWidth="3" opacity="0.4" />
      <line x1="120" y1="30" x2="120" y2="142" stroke={TINTA} strokeWidth="2.4" opacity="0.4" />
      <line x1="64" y1="86" x2="176" y2="86" stroke={TINTA} strokeWidth="2.4" opacity="0.4" />
      {[300, 340, 380].map((x, i) => (
        <path key={x} d={`M ${x} 150 q 20 -34 40 0 Z`} fill={OBJETO2} opacity="0.85" />
      ))}
    </g>
  ),
};

export default function FundoCena({ tipo = 'gabinete', className = '' }) {
  const chave = ELEMENTOS[tipo] ? tipo : 'gabinete';
  const angulo = 40 + (hashString(`fundo_${chave}`) % 24);
  return (
    <svg viewBox="0 0 480 200" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`fundohach_${chave}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform={`rotate(${angulo})`}>
          <line x1="0" y1="0" x2="0" y2="6" stroke={TINTA} strokeWidth="0.8" opacity="0.35" />
        </pattern>
        <radialGradient id={`fundoluz_${chave}`} cx="72%" cy="20%" r="80%">
          <stop offset="0%" stopColor="rgba(217,140,60,0.28)" />
          <stop offset="55%" stopColor="rgba(60,40,22,0.55)" />
          <stop offset="100%" stopColor="rgba(12,9,6,0.92)" />
        </radialGradient>
      </defs>
      {/* Parede + piso + halo de luz */}
      <rect x="0" y="0" width="480" height="200" fill="#1a1510" />
      <rect x="0" y="0" width="480" height="200" fill={`url(#fundoluz_${chave})`} />
      <rect x="0" y="150" width="480" height="50" fill="#120d09" />
      <line x1="0" y1="150" x2="480" y2="150" stroke={TINTA} strokeWidth="1.5" opacity="0.5" />
      {/* Janela/fonte de luz ao alto à direita */}
      <rect x="360" y="20" width="86" height="66" fill="rgba(230,200,150,0.14)" stroke={TINTA} strokeWidth="1.5" opacity="0.7" />
      <line x1="403" y1="20" x2="403" y2="86" stroke={TINTA} strokeWidth="1.2" opacity="0.5" />
      <line x1="360" y1="53" x2="446" y2="53" stroke={TINTA} strokeWidth="1.2" opacity="0.5" />
      {/* Elementos que identificam o lugar */}
      {ELEMENTOS[chave]}
      {/* Trama de gravura por cima de tudo */}
      <rect x="0" y="0" width="480" height="200" fill={`url(#fundohach_${chave})`} opacity="0.5" />
      {/* Véu inferior: o texto pousa legível sob a cena */}
      <rect x="0" y="120" width="480" height="80" fill="url(#fundoveu)" opacity="0.9" />
      <linearGradient id="fundoveu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(18,13,9,0)" />
        <stop offset="100%" stopColor="rgba(18,13,9,0.85)" />
      </linearGradient>
    </svg>
  );
}
