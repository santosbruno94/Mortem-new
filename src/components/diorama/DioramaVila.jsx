import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useJogo } from '../../store/jogo.js';
import { LOCALIDADES } from '../../data/localidades.js';
import { custoViagem } from '../../data/mapa.js';
import { POSICOES_DIORAMA, FORMAS_PREDIO, ESTRADA_MOORFORD, MAQUETE } from '../../data/mapa_espacial.js';
import Predio from './Predio.jsx';

// =====================================================================
// O DIORAMA DA VILA — a maquete 3D pousada sobre a escrivaninha (§5).
// Substitui a grade de cartas de localidade quando há WebGL: cada nó do
// mapa é um prédio clicável; clicar VIAJA (o mesmo handler da grade 2D,
// recebido por prop — paridade por construção). Camera isométrica fixa,
// luz de vela, frameloop sob demanda (cena parada não gasta bateria).
// Tudo geometria procedural — zero assets, zero rede.
// =====================================================================

// Câmera ortográfica isométrica fixa, com zoom que acompanha o canvas
// (em celular a maquete inteira continua cabendo). Enquanto Moorford
// não existe, o enquadramento fecha sobre a vila; ao desbloquear, a
// câmera reenquadra para caber a estrada inteira (o mapa CRESCE).
function CameraIsometrica({ moorfordVisivel }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const larguraCena = moorfordVisivel ? 13.2 : 9.2;
    const alturaCena = moorfordVisivel ? 5.6 : 4.9;
    const centroX = moorfordVisivel ? MAQUETE.centroX : -0.8;
    camera.zoom = Math.min(size.width / larguraCena, size.height / alturaCena);
    camera.position.set(centroX + 2.5, 8.5, 11.5);
    camera.lookAt(centroX, 0.95, 0.1);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate, moorfordVisivel]);
  return null;
}

// A estrada de Moorford: segmentos finos pousados sobre o terreno,
// seguindo a polilinha do mapa espacial. Surge com o nó desbloqueado.
function EstradaMoorford() {
  const segmentos = [];
  for (let i = 0; i < ESTRADA_MOORFORD.length - 1; i++) {
    const a = ESTRADA_MOORFORD[i];
    const b = ESTRADA_MOORFORD[i + 1];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    segmentos.push({
      x: (a.x + b.x) / 2,
      z: (a.z + b.z) / 2,
      comprimento: Math.hypot(dx, dz) + 0.06,
      angulo: -Math.atan2(dz, dx),
    });
  }
  return (
    <group>
      {segmentos.map((s, i) => (
        <mesh key={i} position={[s.x, 0.115, s.z]} rotation={[0, s.angulo, 0]}>
          <boxGeometry args={[s.comprimento, 0.015, 0.16]} />
          <meshStandardMaterial color={MAQUETE.corEstrada} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export default function DioramaVila({ aoAbrirNo }) {
  const localidadeAtual = useJogo((s) => s.localidadeAtual);
  const nosDesbloqueados = useJogo((s) => s.nosDesbloqueados);
  const nosNovos = useJogo((s) => s.nosNovos);
  const overlayAberto = useJogo((s) => s.overlay) !== null;

  const locsVisiveis = LOCALIDADES.filter((loc) => nosDesbloqueados.includes(loc.id));
  const moorfordVisivel = nosDesbloqueados.includes('gabinete_pettigrew');

  return (
    <Canvas
      orthographic
      flat
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'low-power' }}
      camera={{ zoom: 90, position: [MAQUETE.centroX + 5, 8.5, 11], near: 0.1, far: 60 }}
    >
      <CameraIsometrica moorfordVisivel={moorfordVisivel} />

      {/* Luz de vela: direcional quente vinda do canto do relógio, com
          ambiente fraca para o verso não morrer no preto. */}
      <directionalLight position={[4, 8, 6]} intensity={2.1} color="#f4c07a" />
      <ambientLight intensity={1.15} color="#94897e" />

      {/* A tábua da maquete e o terreno */}
      <mesh position={[MAQUETE.centroX, 0.0, 0]}>
        <boxGeometry args={[MAQUETE.larguraTabua, 0.14, MAQUETE.fundoTabua]} />
        <meshStandardMaterial color={MAQUETE.corTabua} flatShading />
      </mesh>
      <mesh position={[MAQUETE.centroX, 0.075, 0]}>
        <boxGeometry args={[MAQUETE.larguraTabua - 0.5, 0.07, MAQUETE.fundoTabua - 0.4]} />
        <meshStandardMaterial color={MAQUETE.corTerreno} flatShading />
      </mesh>

      {/* A estrada e os prédios — só os nós desbloqueados existem */}
      {moorfordVisivel && <EstradaMoorford />}
      {locsVisiveis.map((loc) => {
        const pos = POSICOES_DIORAMA[loc.id];
        if (!pos) return null;
        const forma = FORMAS_PREDIO[pos.predio] || FORMAS_PREDIO.estalagem;
        const custo = localidadeAtual ? custoViagem(localidadeAtual, loc.id) : 0;
        return (
          <Predio
            key={loc.id}
            loc={loc}
            pos={pos}
            forma={forma}
            aqui={loc.id === localidadeAtual}
            novo={nosNovos.includes(loc.id)}
            custo={custo}
            interativo={!overlayAberto}
            aoClicar={() => aoAbrirNo(loc)}
          />
        );
      })}
    </Canvas>
  );
}
