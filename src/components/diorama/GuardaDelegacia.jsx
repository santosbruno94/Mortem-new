import { POSICOES_DIORAMA, guardaNaPorta } from '../../data/mapa_espacial.js';

// =====================================================================
// O GUARDA À PORTA DA DELEGACIA (Onda 9) — camada visual pura, geometria
// procedural mínima (tronco + cabeça + capacete). No turno de dia (8h–20h)
// ele está à porta; à noite sai de cena e fica a lanterna acesa no umbral.
// Tudo determinístico pela hora do relógio; nada anima (frameloop demand).
// =====================================================================
export default function GuardaDelegacia({ horasJogo, pos: posProp }) {
  // OS da vila na mesa: a posição vem do chamador (maquete gerada) ou do
  // mapa espacial estático (caso-escola) — mesmo guarda, outra porta.
  const pos = posProp || POSICOES_DIORAMA.delegacia;
  if (!pos) return null;
  const presente = guardaNaPorta(horasJogo);
  return (
    <group position={[pos.x - 0.32, 0.11, pos.z + 0.72]}>
      {presente ? (
        <group>
          {/* Tronco (a farda escura), cabeça e o capacete de guarda */}
          <mesh position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.034, 0.05, 0.22, 6]} />
            <meshStandardMaterial color="#2c3550" flatShading />
          </mesh>
          <mesh position={[0, 0.255, 0]}>
            <sphereGeometry args={[0.036, 6, 6]} />
            <meshStandardMaterial color="#c9a27e" flatShading />
          </mesh>
          <mesh position={[0, 0.31, 0]}>
            <cylinderGeometry args={[0.018, 0.03, 0.07, 6]} />
            <meshStandardMaterial color="#1d2438" flatShading />
          </mesh>
        </group>
      ) : (
        /* A lanterna do umbral, acesa no lugar do guarda */
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.055, 0.09, 0.055]} />
          <meshStandardMaterial color="#f4c07a" emissive="#d97706" emissiveIntensity={1.6} />
        </mesh>
      )}
    </group>
  );
}
