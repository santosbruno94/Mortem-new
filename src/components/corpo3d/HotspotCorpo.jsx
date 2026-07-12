import { useState } from 'react';
import { useThree } from '@react-three/fiber';

// =====================================================================
// Região clicável do cadáver. Clicar = extrair a MESMA carta do termo
// em negrito (um só gesto, uma só fonte de verdade). Passar o cursor
// acende a região e DESTACA o termo correspondente na prosa ao lado
// (via data-carta-id — puro efeito visual).
// =====================================================================
export default function HotspotCorpo({ hotspot, registrada, aoExtrair }) {
  const [hover, setHover] = useState(false);
  const invalidate = useThree((s) => s.invalidate);

  function destacarTermo(ligado) {
    document
      .querySelectorAll(`[data-carta-id="${hotspot.cartaId}"]`)
      .forEach((el) => el.classList.toggle('termo-destacado', ligado));
  }

  // Já registrada: fica só um alfinete discreto de "examinado".
  if (registrada) {
    return (
      <mesh position={hotspot.posicao}>
        <coneGeometry args={[0.018, 0.06, 6]} />
        <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.4} flatShading />
      </mesh>
    );
  }

  return (
    <mesh
      position={hotspot.posicao}
      onClick={(e) => {
        e.stopPropagation();
        destacarTermo(false);
        document.body.style.cursor = '';
        aoExtrair(hotspot.cartaId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        destacarTermo(true);
        document.body.style.cursor = 'pointer';
        invalidate();
      }}
      onPointerOut={() => {
        setHover(false);
        destacarTermo(false);
        document.body.style.cursor = '';
        invalidate();
      }}
    >
      <sphereGeometry args={[hotspot.raio, 12, 10]} />
      <meshStandardMaterial
        color="#fbbf24"
        transparent
        opacity={hover ? 0.22 : 0.07}
        emissive="#d97706"
        emissiveIntensity={hover ? 0.5 : 0.12}
        depthWrite={false}
      />
    </mesh>
  );
}
