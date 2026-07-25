import { hashString } from '../logic/hash.js';

// =====================================================================
// FUNDO DE CENA — backdrop 2D paramétrico da localidade (gravura).
//
// Sistema 2 do pivô "Gabinete Ilustrado", edição de imprensa: cada
// localidade ganha um fundo determinístico desenhado como GRAVURA DE
// ATLAS — folha de pergaminho clara, mobília em contorno de tinta e
// hachura, uma fonte de luz (janela) e 2–3 elementos que identificam o
// lugar. Mesma língua da Prancha do corpo: o cenário é uma estampa de
// imprensa, não um cômodo à meia-luz.
//
// APRESENTAÇÃO PURA: nenhuma regra lê o fundo. SVG procedural, zero
// arquivo de arte, zero Math.random (o ângulo da hachura vem de
// hashString). É a "primeira onda" (silhueta legível) — quando (e se)
// houver arte externa sob contrato, ela entra slot a slot com este
// fundo como fallback obrigatório.
// =====================================================================

const COR_CENA = '#e7dcc2'; // o pergaminho da cena (base clara da gravura)
const INK = '#2a2014'; // a tinta do buril
const MOVEL = '#efe5cd'; // a face iluminada da mobília
const MOVEL2 = '#e0d2b2'; // a face em sombra da mobília

// Deriva o tipo de cena a partir do id da localidade e do grupo do nó.
// Mapeamento de apresentação — nenhuma regra depende dele; o default
// 'gabinete' serve a qualquer cômodo fechado sem correspondência própria.
export function tipoCenaDe(localidadeId = '', grupo = '') {
  const id = String(localidadeId).toLowerCase();
  if (id.includes('corpo') || id.includes('saleta') || id.includes('gabinete')) return 'gabinete';
  if (id.includes('oficina') || id.includes('cena')) return 'oficina';
  if (id.includes('loja') || id.includes('correio') || id.includes('rooke') || id.includes('agnes')) return 'loja';
  if (id.includes('delegacia') || id.includes('posto') || id.includes('wycliffe')) return 'delegacia';
  if (id.includes('estalagem') || id.includes('walter')) return 'estalagem';
  if (id.includes('moinho') || id.includes('grey') || id.includes('moleiro')) return 'moinho';
  if (grupo === 'relojoaria') return 'oficina';
  return 'gabinete';
}

// Cada elemento recebe o id da hachura densa da cena (fill de meia-luz).
const ELEMENTOS = {
  gabinete: (h) => (
    <g>
      {/* Estante de livros-razão ao fundo, em contorno de gravura */}
      <rect x="24" y="34" width="128" height="112" fill={MOVEL} stroke={INK} strokeWidth="1.4" />
      {[58, 82, 106, 130].map((y) => (
        <line key={y} x1="24" y1={y} x2="152" y2={y} stroke={INK} strokeWidth="1.1" opacity="0.7" />
      ))}
      {[38, 60, 82, 104, 126].map((x) => (
        <rect key={x} x={x} y="38" width="9" height="104" fill={`url(#${h})`} stroke={INK} strokeWidth="0.7" opacity="0.85" />
      ))}
      {/* Escrivaninha */}
      <rect x="176" y="150" width="278" height="14" fill={MOVEL2} stroke={INK} strokeWidth="1.2" />
      <rect x="300" y="130" width="62" height="20" fill={MOVEL} stroke={INK} strokeWidth="1.1" />
    </g>
  ),
  oficina: (h) => (
    <g>
      {/* Painel de ferramentas penduradas e a bancada */}
      <rect x="30" y="40" width="156" height="76" fill={MOVEL} stroke={INK} strokeWidth="1.4" />
      {[54, 82, 110].map((x, i) => (
        <line key={i} x1={x + 30} y1="46" x2={x + 30} y2={72 + i * 8} stroke={INK} strokeWidth="1.6" opacity="0.8" />
      ))}
      <circle cx="72" cy="60" r="9" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.8" />
      <path d="M104 48 l14 6 l-3 5 Z" fill={INK} opacity="0.6" />
      <rect x="24" y="150" width="210" height="16" fill={MOVEL2} stroke={INK} strokeWidth="1.2" />
      <rect x="40" y="130" width="28" height="20" fill={`url(#${h})`} stroke={INK} strokeWidth="1" />
    </g>
  ),
  loja: (h) => (
    <g>
      {/* Prateleira de potes/vidros e o balcão */}
      <rect x="24" y="40" width="156" height="76" fill={MOVEL} stroke={INK} strokeWidth="1.4" />
      {[62, 90].map((y) => (
        <line key={y} x1="24" y1={y} x2="180" y2={y} stroke={INK} strokeWidth="1.1" opacity="0.7" />
      ))}
      {[38, 66, 94, 122, 150].map((x) => (
        <rect key={x} x={x} y={x % 2 ? 46 : 66} width="12" height="18" rx="3" fill={`url(#${h})`} stroke={INK} strokeWidth="0.8" />
      ))}
      <rect x="150" y="150" width="304" height="18" fill={MOVEL2} stroke={INK} strokeWidth="1.2" />
    </g>
  ),
  delegacia: (h) => (
    <g>
      {/* Arquivos e a janela gradeada */}
      <rect x="24" y="36" width="100" height="110" fill={MOVEL} stroke={INK} strokeWidth="1.4" />
      {[60, 84, 108].map((y) => (
        <rect key={y} x="30" y={y} width="88" height="16" fill={`url(#${h})`} stroke={INK} strokeWidth="0.9" />
      ))}
      <rect x="150" y="42" width="72" height="62" fill="none" stroke={INK} strokeWidth="1.6" />
      <line x1="186" y1="42" x2="186" y2="104" stroke={INK} strokeWidth="1.4" />
      <line x1="150" y1="73" x2="222" y2="73" stroke={INK} strokeWidth="1.4" />
      <rect x="260" y="150" width="200" height="16" fill={MOVEL2} stroke={INK} strokeWidth="1.2" />
    </g>
  ),
  estalagem: (h) => (
    <g>
      {/* Balcão de taberna, garrafas e o brilho de lareira à direita */}
      <rect x="24" y="120" width="234" height="46" fill={MOVEL2} stroke={INK} strokeWidth="1.3" />
      {[40, 64, 88, 112, 136].map((x) => (
        <rect key={x} x={x} y="94" width="10" height="26" rx="3" fill={`url(#${h})`} stroke={INK} strokeWidth="0.8" />
      ))}
      <ellipse cx="410" cy="116" rx="48" ry="42" fill="#c9762f" opacity="0.22" />
      <rect x="384" y="108" width="52" height="44" fill={MOVEL} stroke={INK} strokeWidth="1.1" />
      <path d="M392 116 h36 M392 128 h36 M392 140 h36" stroke={INK} strokeWidth="0.8" opacity="0.6" />
    </g>
  ),
  moinho: (h) => (
    <g>
      {/* A roda e as sacas empilhadas, em traço de gravura */}
      <circle cx="120" cy="84" r="58" fill="none" stroke={INK} strokeWidth="2" opacity="0.7" />
      <circle cx="120" cy="84" r="44" fill="none" stroke={INK} strokeWidth="1" opacity="0.5" />
      <line x1="120" y1="26" x2="120" y2="142" stroke={INK} strokeWidth="1.6" opacity="0.6" />
      <line x1="62" y1="84" x2="178" y2="84" stroke={INK} strokeWidth="1.6" opacity="0.6" />
      <line x1="79" y1="43" x2="161" y2="125" stroke={INK} strokeWidth="1.2" opacity="0.5" />
      <line x1="161" y1="43" x2="79" y2="125" stroke={INK} strokeWidth="1.2" opacity="0.5" />
      {[300, 342, 384].map((x) => (
        <path key={x} d={`M ${x} 150 q 21 -36 42 0 Z`} fill={`url(#${h})`} stroke={INK} strokeWidth="1" />
      ))}
    </g>
  ),
};

export default function FundoCena({ tipo = 'gabinete', className = '' }) {
  const chave = ELEMENTOS[tipo] ? tipo : 'gabinete';
  const angulo = 40 + (hashString(`fundo_${chave}`) % 24);
  const idHach = `fundohach_${chave}`;
  const idMeiaLuz = `fundomeialuz_${chave}`;
  return (
    <svg viewBox="0 0 480 200" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Hachura fina da gravura (a trama por cima de tudo) */}
        <pattern id={idHach} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform={`rotate(${angulo})`}>
          <line x1="0" y1="0" x2="0" y2="6" stroke={INK} strokeWidth="0.6" opacity="0.28" />
        </pattern>
        {/* Hachura densa da mobília (para os planos em meia-luz) */}
        <pattern id={idMeiaLuz} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform={`rotate(${angulo + 50})`}>
          <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.55" opacity="0.5" />
        </pattern>
        {/* A luz da janela, quente e discreta, ao alto à direita */}
        <radialGradient id={`fundoluz_${chave}`} cx="74%" cy="12%" r="82%">
          <stop offset="0%" stopColor="rgba(255,240,205,0.5)" />
          <stop offset="55%" stopColor="rgba(255,240,205,0)" />
          <stop offset="100%" stopColor="rgba(120,90,50,0.14)" />
        </radialGradient>
      </defs>

      {/* A folha de pergaminho: parede clara, moldura de gravura e o rodapé */}
      <rect x="0" y="0" width="480" height="200" fill={COR_CENA} />
      <rect x="0" y="0" width="480" height="200" fill={`url(#fundoluz_${chave})`} />
      {/* Filete do teto e do rodapé (moldura da estampa) */}
      <line x1="0" y1="12" x2="480" y2="12" stroke={INK} strokeWidth="0.7" opacity="0.4" />
      <line x1="0" y1="150" x2="480" y2="150" stroke={INK} strokeWidth="1.4" opacity="0.65" />
      {/* Piso: hachura rasa sob a linha do chão */}
      <rect x="0" y="150" width="480" height="50" fill={`url(#${idHach})`} opacity="0.55" />

      {/* A janela/fonte de luz, em contorno de tinta */}
      <rect x="360" y="20" width="86" height="66" fill="rgba(255,246,220,0.6)" stroke={INK} strokeWidth="1.4" opacity="0.85" />
      <line x1="403" y1="20" x2="403" y2="86" stroke={INK} strokeWidth="1.1" opacity="0.6" />
      <line x1="360" y1="53" x2="446" y2="53" stroke={INK} strokeWidth="1.1" opacity="0.6" />

      {/* Os elementos que identificam o lugar */}
      {ELEMENTOS[chave](idMeiaLuz)}

      {/* A trama de gravura por cima de tudo (unifica a estampa) */}
      <rect x="0" y="0" width="480" height="200" fill={`url(#${idHach})`} opacity="0.4" />

      {/* Vinheta rasa nas bordas: assenta a folha sem escurecer o miolo, para
          o sprite tingido pousar legível sobre o pergaminho. */}
      <rect
        x="0"
        y="0"
        width="480"
        height="200"
        fill="url(#fundovinheta)"
        opacity="0.9"
        pointerEvents="none"
      />
      <radialGradient id="fundovinheta" cx="50%" cy="46%" r="72%">
        <stop offset="62%" stopColor="rgba(120,90,50,0)" />
        <stop offset="100%" stopColor="rgba(70,48,26,0.28)" />
      </radialGradient>
    </svg>
  );
}
