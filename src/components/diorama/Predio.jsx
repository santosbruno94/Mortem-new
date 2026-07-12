import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import RotuloNo from './RotuloNo.jsx';

// =====================================================================
// Um prédio da maquete: caixa + telhado de quatro águas + chaminé,
// tudo primitiva procedural. Clicar no prédio OU na etiqueta viaja
// (mesmo handler). O prédio recém-desbloqueado SURGE crescendo da tábua
// (a única animação — e é só apresentação).
// =====================================================================
export default function Predio({ loc, pos, forma, aqui, novo, custo, interativo, aoClicar }) {
  const grupo = useRef();
  const [hover, setHover] = useState(false);
  const escala = useRef(novo ? 0.01 : 1);
  const invalidate = useThree((s) => s.invalidate);

  // Surgimento: o nó revelado por lead cresce da tábua ao aparecer.
  useEffect(() => {
    if (escala.current < 1) invalidate();
  }, [invalidate]);
  useFrame((_, dt) => {
    if (escala.current < 1 && grupo.current) {
      escala.current = Math.min(1, escala.current + dt * 2.4);
      grupo.current.scale.setScalar(escala.current);
      invalidate();
    }
  });

  const raioTelhado = (Math.hypot(forma.w, forma.d) / 2) * 0.82;
  const alturaRotulo = forma.h + forma.telhado + 0.32;
  const emissiva = hover && interativo ? '#d97706' : novo ? '#78350f' : '#000000';
  const intensidade = hover && interativo ? 0.3 : novo ? 0.22 : 0;

  return (
    <group
      ref={grupo}
      position={[pos.x, 0.11, pos.z]}
      scale={escala.current}
      onClick={(e) => {
        e.stopPropagation();
        if (interativo) aoClicar();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!interativo) return;
        setHover(true);
        document.body.style.cursor = 'pointer';
        invalidate();
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = '';
        invalidate();
      }}
    >
      {/* Corpo do prédio */}
      <mesh position={[0, forma.h / 2, 0]}>
        <boxGeometry args={[forma.w, forma.h, forma.d]} />
        <meshStandardMaterial color={forma.corParede} emissive={emissiva} emissiveIntensity={intensidade} flatShading />
      </mesh>
      {/* Telhado de quatro águas (cone de 4 lados) */}
      <mesh position={[0, forma.h + forma.telhado / 2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[raioTelhado, forma.telhado, 4]} />
        <meshStandardMaterial color={forma.corTelhado} emissive={emissiva} emissiveIntensity={intensidade * 0.6} flatShading />
      </mesh>
      {/* Chaminé */}
      {forma.chamine && (
        <mesh position={[forma.w * 0.28, forma.h + forma.telhado * 0.75, -forma.d * 0.2]}>
          <boxGeometry args={[0.1, forma.telhado * 0.9, 0.1]} />
          <meshStandardMaterial color={forma.corParede} flatShading />
        </mesh>
      )}
      {/* Porta e janelas acesas (a vila vive à luz de vela) */}
      <mesh position={[-forma.w * 0.22, 0.17, forma.d / 2 + 0.005]}>
        <planeGeometry args={[0.16, 0.3]} />
        <meshStandardMaterial color="#2a2118" />
      </mesh>
      <mesh position={[forma.w * 0.18, forma.h * 0.55, forma.d / 2 + 0.005]}>
        <planeGeometry args={[0.13, 0.16]} />
        <meshStandardMaterial color="#f4c07a" emissive="#d97706" emissiveIntensity={0.85} />
      </mesh>
      {forma.w > 1.1 && (
        <mesh position={[-forma.w * 0.02, forma.h * 0.55, forma.d / 2 + 0.005]}>
          <planeGeometry args={[0.13, 0.16]} />
          <meshStandardMaterial color="#f4c07a" emissive="#d97706" emissiveIntensity={0.85} />
        </mesh>
      )}
      {/* Marco do "aqui": um pino discreto diante da porta */}
      {aqui && (
        <mesh position={[0, 0.06, forma.d / 2 + 0.14]}>
          <coneGeometry args={[0.06, 0.16, 6]} />
          <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.5} flatShading />
        </mesh>
      )}

      {/* A etiqueta da maquete: HTML real (clicável por texto — QA) */}
      <Html center position={[0, alturaRotulo, 0]} zIndexRange={[30, 0]}>
        <RotuloNo
          loc={loc}
          aqui={aqui}
          novo={novo}
          custo={custo}
          interativo={interativo}
          destacado={hover}
          aoClicar={aoClicar}
          aoEntrar={() => setHover(true)}
          aoSair={() => setHover(false)}
        />
      </Html>
    </group>
  );
}
