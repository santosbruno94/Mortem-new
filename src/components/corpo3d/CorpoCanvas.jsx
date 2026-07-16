import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useJogo } from '../../store/jogo.js';
import { HOTSPOTS_CORPO } from '../../data/hotspots_corpo.js';
import CorpoModelo from './CorpoModelo.jsx';
import HotspotCorpo from './HotspotCorpo.jsx';
import EfeitoGravura from './EfeitoGravura.jsx';

// =====================================================================
// A MESA DE EXAME EM 3D — companheira da prosa, nunca substituta.
// O modelo reflete o estado forense do IPM corrente; os hotspots
// extraem as MESMAS cartas dos termos em negrito (o clique no texto
// continua valendo — este canvas é redundância deliberada).
// Segundo canvas da sessão: também frameloop sob demanda.
//
// GRAVURA (prop `gravura`, default ligada): um passe de pós-processamento
// (EfeitoGravura.jsx) traduz o render em prancha anatômica — dithering de
// Bayer 4×4 em duotone papel/tinta do pergaminho. Desligar a prop devolve
// o render cru (A/B e reversão baratas). Só AQUI, por ora: estender ao
// DioramaVila fica anotado como passo futuro se o corpo convencer.
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

export default function CorpoCanvas({ ipm, aoPerderContexto, gravura = true }) {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const extrairCarta = useJogo((s) => s.extrairCarta);

  // Extrair pelo corpo 3D é o MESMO gesto do termo em negrito: registra a
  // carta e abre a ficha de coleta (o som de papel toca na abertura da ficha).
  const aoExtrair = (cartaId) => extrairCarta(cartaId);

  return (
    <Canvas
      orthographic
      flat
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'low-power' }}
      camera={{ zoom: 150, position: [0.4, 1.5, 2.6], near: 0.1, far: 30 }}
      onCreated={({ gl }) => {
        // Contexto WebGL perdido (P3): a mesa de exame cede à prosa em vez
        // de ficar um retângulo preto (fallback do Cena3DBoundary).
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          aoPerderContexto?.();
        });
      }}
    >
      <CameraExame />
      {gravura && <EfeitoGravura />}

      {/* Luz de exame: fria e crua por cima (o ofício), com um resto de
          vela quente de canto (o lugar). Intensidades francas: a mesa de
          exame precisa LER, não só ambientar (achado A5 do playtest). */}
      <directionalLight position={[1, 4, 2]} intensity={2.6} color="#d6dde4" />
      <directionalLight position={[-3, 1.5, -1]} intensity={0.9} color="#f4c07a" />
      <ambientLight intensity={1.2} color="#9a9184" />

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
