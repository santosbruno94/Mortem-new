import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { formatDuracao } from '../../logic/tempo.js';
import { BEAT_VIAGEM_S } from '../../logic/beat_viagem.js';

// =====================================================================
// O PINO DO PERITO — o alfinete de cabeça vermelha que marca o nó atual
// na maquete e ANIMA O TRAJETO na viagem, com o custo em horas flutuando
// junto. Peça de apresentação pura: desliza entre as posições do mapa
// espacial (nunca lidas pelo motor). O progresso avança por dt (não por
// relógio de parede) — resolução independente e sem Date.now.
//
// A cada viagem (viagemId muda), parte de `origem` rumo a `alvo` num arco
// baixo; sem viagem, repousa no nó. O beat da abertura do local (~0,7s na
// Escrivaninha) deixa o trajeto visível antes de a mesa desfocar.
// =====================================================================
// Segundos do deslize: a MESMA constante que a prancha e o hub leem
// (src/logic/beat_viagem.js) — antes o número vivia em dois lugares.
const DURACAO = BEAT_VIAGEM_S;

export default function PinoPerito({ alvo, origem, custo, viagemId }) {
  const grupo = useRef();
  const prog = useRef(1); // 1 = parado no destino
  const de = useRef(alvo);
  const invalidate = useThree((s) => s.invalidate);
  const rotuloRef = useRef();

  // Nova viagem: recomeça o deslize da origem (se houver custo real).
  useEffect(() => {
    if (origem && custo > 0) {
      de.current = origem;
      prog.current = 0;
      invalidate();
    } else {
      de.current = alvo;
      prog.current = 1;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viagemId]);

  useFrame((_, dt) => {
    if (prog.current >= 1) {
      // Repouso no nó: garante a posição final (caso o alvo tenha mudado).
      if (grupo.current) {
        grupo.current.position.x = alvo.x;
        grupo.current.position.z = alvo.z;
      }
      return;
    }
    prog.current = Math.min(1, prog.current + dt / DURACAO);
    // Suavização ease-in-out e um arco baixo no meio do trajeto.
    const p = prog.current;
    const s = p * p * (3 - 2 * p);
    const x = de.current.x + (alvo.x - de.current.x) * s;
    const z = de.current.z + (alvo.z - de.current.z) * s;
    const arco = Math.sin(p * Math.PI) * 0.35;
    if (grupo.current) {
      grupo.current.position.set(x, 0.13 + arco, z);
    }
    if (rotuloRef.current) {
      rotuloRef.current.style.opacity = String(Math.sin(p * Math.PI));
    }
    invalidate();
  });

  const emViagem = prog.current < 1 && custo > 0;

  return (
    <group ref={grupo} position={[alvo.x, 0.13, alvo.z]}>
      {/* Haste do alfinete */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.38, 6]} />
        <meshStandardMaterial color="#d8d2c4" metalness={0.3} roughness={0.5} flatShading />
      </mesh>
      {/* Cabeça vermelha (lacada) */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#b1281f" emissive="#7f1d1d" emissiveIntensity={0.35} roughness={0.35} />
      </mesh>
      {/* O custo em horas, flutuando junto durante o deslize */}
      {emViagem && (
        <Html center position={[0, 0.62, 0]} zIndexRange={[20, 0]}>
          <span ref={rotuloRef} className="pino-custo">
            {formatDuracao(custo)}
          </span>
        </Html>
      )}
    </group>
  );
}
