import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useJogo } from '../../store/jogo.js';
import { LOCALIDADES } from '../../data/localidades.js';
import { custoViagem } from '../../data/mapa.js';
import {
  POSICOES_DIORAMA,
  FORMAS_PREDIO,
  ESTRADA_MOORFORD,
  MAQUETE,
  interpolarLuz,
} from '../../data/mapa_espacial.js';
import Predio from './Predio.jsx';
import PinoPerito from './PinoPerito.jsx';
import GuardaDelegacia from './GuardaDelegacia.jsx';

// =====================================================================
// O DIORAMA DA VILA — a maquete de papel pousada sobre a escrivaninha
// (§5). Cada nó do mapa é um prédio clicável; clicar VIAJA (o mesmo
// handler da grade 2D, recebido por prop). Câmera isométrica fixa,
// névoa baixa de outubro, e a LUZ QUE SEGUE O RELÓGIO (tarde dourada →
// crepúsculo → lampiões âmbar à noite). Frameloop sob demanda: a cena
// parada não gasta bateria; as transições invalidam enquanto correm.
// Tudo geometria procedural — zero assets, zero rede.
// =====================================================================

function CameraIsometrica({ moorfordVisivel }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    // A largura precisa cobrir a vila INTEIRA (corpo a −4,7 … moinho a +4,6,
    // mais os prédios): em tela estreita o zoom é limitado pela largura e um
    // enquadramento curto cortava O Moinho (P2 do playtest mobile).
    const larguraCena = moorfordVisivel ? 13.6 : 12.4;
    const alturaCena = moorfordVisivel ? 5.8 : 5.1;
    const centroX = moorfordVisivel ? MAQUETE.centroX : 0;
    camera.zoom = Math.min(size.width / larguraCena, size.height / alturaCena);
    camera.position.set(centroX + 2.5, 8.5, 11.5);
    camera.lookAt(centroX, 0.95, 0.1);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate, moorfordVisivel]);
  return null;
}

// A luz da maquete lida do relógio (estado derivado — leitura de
// apresentação, permitida). Interpola o ciclo de luz e faz a transição
// suave (lerp por frame) ao viajar; escreve luzRef.lamp para os lampiões.
function LuzDoDia({ luzRef }) {
  const horasJogo = useJogo((s) => s.horasJogo);
  const dirRef = useRef();
  const ambRef = useRef();
  const fogRef = useRef();
  const atual = useRef(interpolarLuz(horasJogo));
  const invalidate = useThree((s) => s.invalidate);

  // Nova hora (viajou) → dispara a transição.
  useEffect(() => {
    invalidate();
  }, [horasJogo, invalidate]);

  useFrame((_, dt) => {
    const alvo = interpolarLuz(horasJogo);
    const a = atual.current;
    const k = Math.min(1, dt * 3.2);
    const passo = (x, y) => x + (y - x) * k;
    a.luz = { r: passo(a.luz.r, alvo.luz.r), g: passo(a.luz.g, alvo.luz.g), b: passo(a.luz.b, alvo.luz.b) };
    a.amb = { r: passo(a.amb.r, alvo.amb.r), g: passo(a.amb.g, alvo.amb.g), b: passo(a.amb.b, alvo.amb.b) };
    a.fog = { r: passo(a.fog.r, alvo.fog.r), g: passo(a.fog.g, alvo.fog.g), b: passo(a.fog.b, alvo.fog.b) };
    a.iLuz = passo(a.iLuz, alvo.iLuz);
    a.iAmb = passo(a.iAmb, alvo.iAmb);
    a.fogNear = passo(a.fogNear, alvo.fogNear);
    a.fogFar = passo(a.fogFar, alvo.fogFar);
    a.lamp = passo(a.lamp, alvo.lamp);
    if (dirRef.current) {
      dirRef.current.color.setRGB(a.luz.r, a.luz.g, a.luz.b);
      dirRef.current.intensity = a.iLuz;
    }
    if (ambRef.current) {
      ambRef.current.color.setRGB(a.amb.r, a.amb.g, a.amb.b);
      ambRef.current.intensity = a.iAmb;
    }
    if (fogRef.current) {
      fogRef.current.color.setRGB(a.fog.r, a.fog.g, a.fog.b);
      fogRef.current.near = a.fogNear;
      fogRef.current.far = a.fogFar;
    }
    if (luzRef) luzRef.current = { lamp: a.lamp };
    // Continua invalidando enquanto não convergiu.
    const longe =
      Math.abs(a.iLuz - alvo.iLuz) + Math.abs(a.lamp - alvo.lamp) + Math.abs(a.luz.r - alvo.luz.r) > 0.002;
    if (longe) invalidate();
  });

  return (
    <>
      <fog attach="fog" ref={fogRef} args={['#b9a888', 9.5, 27]} />
      <directionalLight ref={dirRef} position={[4, 8, 6]} intensity={2.05} color="#ffe9c2" />
      <ambientLight ref={ambRef} intensity={1.12} color="#8a8172" />
    </>
  );
}

// A estrada de Moorford: traço de tinta pousado sobre o terreno, seguindo a
// polilinha do mapa espacial. Surge com o nó desbloqueado.
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

export default function DioramaVila({ aoAbrirNo, aoPerderContexto }) {
  const localidadeAtual = useJogo((s) => s.localidadeAtual);
  const nosDesbloqueados = useJogo((s) => s.nosDesbloqueados);
  const nosNovos = useJogo((s) => s.nosNovos);
  const overlayAberto = useJogo((s) => s.overlay) !== null;
  // Vida na maquete (Onda 9): o guarda da delegacia segue o turno do relógio.
  const horasJogo = useJogo((s) => s.horasJogo);

  // Objeto compartilhado do ciclo de luz (lido pelos lampiões dos prédios).
  const luzRef = useRef({ lamp: 0.2 });

  // Rastreio da viagem para o pino: guarda o nó anterior e a "viagemId" que
  // faz o pino recomeçar o deslize a cada troca com custo real.
  const noAnterior = useRef(localidadeAtual);
  const [viagem, setViagem] = useState({ id: 0, origem: null, custo: 0 });
  useEffect(() => {
    const anterior = noAnterior.current;
    if (anterior && anterior !== localidadeAtual) {
      const origem = POSICOES_DIORAMA[anterior] || null;
      const custo = custoViagem(anterior, localidadeAtual);
      setViagem((v) => ({ id: v.id + 1, origem, custo }));
    }
    noAnterior.current = localidadeAtual;
  }, [localidadeAtual]);

  const locsVisiveis = LOCALIDADES.filter((loc) => nosDesbloqueados.includes(loc.id));
  const moorfordVisivel = nosDesbloqueados.includes('gabinete_pettigrew');
  // O pino finca-se À FRENTE do prédio (deslocado para a câmera), não no
  // centro do nó (onde ficaria dentro da caixa, ocluso).
  const frente = (p) => (p ? { x: p.x - 0.12, z: p.z + 0.62 } : null);
  const posAtual = frente(POSICOES_DIORAMA[localidadeAtual]);
  const origemPino = frente(viagem.origem);

  return (
    <Canvas
      orthographic
      flat
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'low-power' }}
      camera={{ zoom: 90, position: [MAQUETE.centroX + 5, 8.5, 11], near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        // O contexto WebGL pode morrer após longa inatividade da aba (P3):
        // em vez de deixar a maquete preta, cede ao fallback 2D do
        // guarda-corpo (Cena3DBoundary).
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          aoPerderContexto?.();
        });
      }}
    >
      <CameraIsometrica moorfordVisivel={moorfordVisivel} />
      <LuzDoDia luzRef={luzRef} />

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
            luzRef={luzRef}
          />
        );
      })}

      {/* O guarda à porta da delegacia (dia) / a lanterna do umbral (noite) */}
      {nosDesbloqueados.includes('delegacia') && <GuardaDelegacia horasJogo={horasJogo} />}

      {/* O pino do perito: marca o nó atual e anima o trajeto na viagem */}
      {posAtual && (
        <PinoPerito alvo={posAtual} origem={origemPino} custo={viagem.custo} viagemId={viagem.id} />
      )}
    </Canvas>
  );
}
