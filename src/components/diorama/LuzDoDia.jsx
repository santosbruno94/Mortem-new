import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useJogo } from '../../store/jogo.js';
import { interpolarLuz } from '../../data/mapa_espacial.js';

// A luz da maquete lida do relógio (estado derivado — leitura de
// apresentação, permitida). Interpola o ciclo de luz e faz a transição
// suave (lerp por frame) ao viajar; escreve luzRef.lamp para os lampiões.
export default function LuzDoDia({ luzRef }) {
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
