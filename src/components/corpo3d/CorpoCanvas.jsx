import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useJogo } from '../../store/jogo.js';
import { HOTSPOTS_CORPO } from '../../data/hotspots_corpo.js';
import { tocarSom } from '../../som.js';
import CorpoModelo from './CorpoModelo.jsx';
import HotspotCorpo from './HotspotCorpo.jsx';

// =====================================================================
// A MESA DE EXAME EM 3D — companheira da prosa, nunca substituta.
// O modelo reflete o estado forense do IPM corrente; os hotspots
// extraem as MESMAS cartas dos termos em negrito (o clique no texto
// continua valendo — este canvas é redundância deliberada).
// Segundo canvas da sessão: também frameloop sob demanda.
// =====================================================================

function CameraExame() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    camera.zoom = Math.min(size.width / 2.85, size.height / 1.35);
    camera.position.set(0.5, 1.05, 2.7);
    camera.lookAt(0, 0.28, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}

export default function CorpoCanvas({ ipm }) {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const extrairCarta = useJogo((s) => s.extrairCarta);

  const aoExtrair = (cartaId) => {
    tocarSom('papel');
    extrairCarta(cartaId);
  };

  return (
    <Canvas
      orthographic
      flat
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'low-power' }}
      camera={{ zoom: 150, position: [0.4, 1.5, 2.6], near: 0.1, far: 30 }}
    >
      <CameraExame />

      {/* Luz de exame: fria e crua por cima (o ofício), com um resto de
          vela quente de canto (o lugar). */}
      <directionalLight position={[1, 4, 2]} intensity={1.7} color="#cdd6df" />
      <directionalLight position={[-3, 1.5, -1]} intensity={0.5} color="#f4c07a" />
      <ambientLight intensity={0.75} color="#8c8478" />

      <CorpoModelo ipm={ipm} />

      {HOTSPOTS_CORPO.map((h) => (
        <HotspotCorpo
          key={h.cartaId}
          hotspot={h}
          registrada={cartasRegistradas.some((c) => c.id === h.cartaId)}
          aoExtrair={aoExtrair}
        />
      ))}
    </Canvas>
  );
}
