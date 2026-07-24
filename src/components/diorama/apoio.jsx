import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { MAQUETE } from '../../data/mapa_espacial.js';

// Peças de apoio do diorama: a câmara fixa e a estrada do nó distante.

export function CameraIsometrica({ enquadramento }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const { largura, altura, centroX } = enquadramento;
  useEffect(() => {
    // A largura precisa cobrir a vila INTEIRA: em tela estreita o zoom é
    // limitado pela largura e um enquadramento curto cortava a borda da
    // maquete (P2 do playtest mobile).
    camera.zoom = Math.min(size.width / largura, size.height / altura);
    camera.position.set(centroX + 2.5, 8.5, 11.5);
    camera.lookAt(centroX, 0.95, 0.1);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate, largura, altura, centroX]);
  return null;
}

// A estrada do nó distante: traço de tinta pousado sobre o terreno,
// seguindo a polilinha (a de Moorford no caso-escola; a da comarca na
// maquete gerada). Surge com o nó desbloqueado.
export function EstradaDistante({ pontos }) {
  const segmentos = [];
  for (let i = 0; i < pontos.length - 1; i++) {
    const a = pontos[i];
    const b = pontos[i + 1];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    segmentos.push({
      x: (a.x + b.x) / 2,
      z: (a.z + b.z) / 2,
      comprimento: Math.hypot(dx, dz) + 0.04,
      angulo: -Math.atan2(dz, dx),
    });
  }
  return (
    <group>
      {segmentos.map((s, i) => (
        <mesh key={i} position={[s.x, 0.114, s.z]} rotation={[-Math.PI / 2, 0, s.angulo]}>
          <planeGeometry args={[s.comprimento, 0.1]} />
          <meshStandardMaterial color={MAQUETE.corEstrada} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}
