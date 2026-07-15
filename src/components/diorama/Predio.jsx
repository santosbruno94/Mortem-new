import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useJogo } from '../../store/jogo.js';
import { janelaAcesa, chamineFumega } from '../../data/mapa_espacial.js';
import RotuloNo from './RotuloNo.jsx';

// =====================================================================
// Um prédio da maquete de papel — caixa + TELHADO DE DUAS ÁGUAS com
// beiral + chaminés, e os acentos de silhueta de cada um (a marquise da
// relojoaria, as pás do moinho). Tudo primitiva procedural, zero asset.
// Clicar no prédio OU na etiqueta viaja (mesmo handler). O prédio recém-
// desbloqueado SURGE crescendo da tábua. Os lampiões das janelas queimam
// conforme a hora (luzRef.lamp, escrito pelo ciclo de luz do diorama).
// =====================================================================

// Geometria procedural do telhado de duas águas (prisma triangular). Com a
// cumeeira no eixo X, as faces de empena (o triângulo) olham para ±Z — a
// fachada da maquete ganha o bico de telhado clássico. `beiral` empurra a
// base além da parede (a aba que sombreia a fachada). DoubleSide dispensa
// a fé na ordem dos vértices; computeVertexNormals dá o flatShading.
function criarTelhado(larguraX, profundidadeZ, altura, cumeeiraEmX) {
  const ax = larguraX / 2;
  const az = profundidadeZ / 2;
  const g = new THREE.BufferGeometry();
  let pos;
  let idx;
  if (cumeeiraEmX) {
    // Base retangular (y=0) + cumeeira em z=0, correndo no eixo X.
    pos = [
      -ax, 0, -az, ax, 0, -az, ax, 0, az, -ax, 0, az, // 0..3 base
      -ax, altura, 0, ax, altura, 0, // 4,5 cumeeira
    ];
    idx = [3, 2, 5, 3, 5, 4, /*água +z*/ 1, 0, 4, 1, 4, 5, /*água -z*/ 0, 3, 4, /*empena -x*/ 2, 1, 5 /*empena +x*/];
  } else {
    // Cumeeira correndo no eixo Z (as empenas olham ±X).
    pos = [
      -ax, 0, -az, ax, 0, -az, ax, 0, az, -ax, 0, az, // 0..3 base
      0, altura, -az, 0, altura, az, // 4,5 cumeeira
    ];
    idx = [1, 2, 5, 1, 5, 4, /*água +x*/ 3, 0, 4, 3, 4, 5, /*água -x*/ 0, 1, 4, /*empena -z*/ 2, 3, 5 /*empena +z*/];
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function Telhado({ forma, emissiva, intensidade }) {
  const geo = useMemo(
    () => criarTelhado(forma.w + forma.beiral * 2, forma.d + forma.beiral * 2, forma.telhadoAltura, forma.ristela),
    [forma.w, forma.d, forma.beiral, forma.telhadoAltura, forma.ristela]
  );
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} position={[0, forma.h, 0]}>
      <meshStandardMaterial
        color={forma.corTelhado}
        emissive={emissiva}
        emissiveIntensity={intensidade * 0.6}
        side={THREE.DoubleSide}
        flatShading
      />
    </mesh>
  );
}

export default function Predio({ loc, pos, forma, aqui, novo, custo, interativo, aoClicar, luzRef, resumo }) {
  const grupo = useRef();
  const lampadas = useRef([]);
  const [hover, setHover] = useState(false);
  // A vila respira com a hora (Onda 9): janelas acendem por faixa horária
  // (determinístico, hash por prédio+índice) e a chaminé fumega nas horas
  // frias. Leitura de apresentação — o motor não participa.
  const horasJogo = useJogo((s) => s.horasJogo);
  const escala = useRef(novo ? 0.01 : 1);
  const alturaAtual = useRef(0.11);
  const invalidate = useThree((s) => s.invalidate);

  // Surgimento (nó revelado por lead) e a leitura inicial dos lampiões.
  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useFrame((_, dt) => {
    let precisa = false;
    // Surgimento: o nó cresce da tábua ao aparecer.
    if (escala.current < 1 && grupo.current) {
      escala.current = Math.min(1, escala.current + dt * 2.4);
      grupo.current.scale.setScalar(escala.current);
      precisa = true;
    }
    // Elevação sutil sob o cursor (o prédio se ergue como quem é apontado).
    if (grupo.current) {
      const alvo = 0.11 + (hover && interativo ? 0.08 : 0);
      const nova = alturaAtual.current + (alvo - alturaAtual.current) * Math.min(1, dt * 10);
      if (Math.abs(nova - alturaAtual.current) > 0.0004) {
        alturaAtual.current = nova;
        grupo.current.position.y = nova;
        precisa = true;
      }
    }
    // Os lampiões queimam conforme a hora (o ciclo de luz escreve luzRef.lamp)
    // — mas só nas janelas ACESAS àquela hora (Onda 9): de dia apagam, ao
    // crepúsculo acendem uma a uma, na madrugada a vila dorme.
    const lamp = luzRef?.current?.lamp ?? 0.2;
    for (let i = 0; i < lampadas.current.length; i++) {
      const m = lampadas.current[i];
      if (!m) continue;
      const alvo = janelaAcesa(loc.id, i, horasJogo) ? 0.5 + lamp * 1.7 : 0.04;
      if (Math.abs(m.emissiveIntensity - alvo) > 0.01) {
        m.emissiveIntensity = alvo;
        precisa = true;
      }
    }
    if (precisa) invalidate();
  });

  const alturaRotulo = forma.h + forma.telhadoAltura + 0.34;
  const emissiva = hover && interativo ? '#d97706' : novo ? '#6b3410' : '#000000';
  const intensidade = hover && interativo ? 0.3 : novo ? 0.16 : 0;

  // Janelas acesas (a vila vive à luz de vela): a principal, e uma segunda
  // nos prédios largos. Registram o material para o ciclo de luz regular.
  const registrarLampada = (i) => (m) => {
    if (m) lampadas.current[i] = m;
  };

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

      {/* Telhado de duas águas com beiral */}
      <Telhado forma={forma} emissiva={emissiva} intensidade={intensidade} />

      {/* Chaminés (uma ou mais, conforme o prédio) */}
      {forma.chamines?.map((c, i) => (
        <mesh key={i} position={[c.x, forma.h + c.alt / 2, c.z]}>
          <boxGeometry args={[0.11, c.alt, 0.11]} />
          <meshStandardMaterial color={forma.corParede} flatShading />
        </mesh>
      ))}

      {/* Fumaça nas horas frias (Onda 9): três novelos translúcidos e
          ESTÁTICOS sobre a primeira chaminé — nada anima (frameloop demand). */}
      {forma.chamines?.length > 0 && chamineFumega(loc.id, horasJogo) && (
        <group position={[forma.chamines[0].x, forma.h + forma.chamines[0].alt, forma.chamines[0].z]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[i * 0.025, 0.09 + i * 0.11, i * -0.01]}>
              <sphereGeometry args={[0.045 + i * 0.02, 6, 6]} />
              <meshStandardMaterial color="#9a9184" transparent opacity={0.3 - i * 0.08} flatShading />
            </mesh>
          ))}
        </group>
      )}

      {/* Marquise da relojoaria: o toldo sobre a vitrine (primitiva inclinada) */}
      {forma.marquise && (
        <mesh position={[0, forma.h * 0.52, forma.d / 2 + 0.14]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[forma.w * 0.86, 0.03, 0.34]} />
          <meshStandardMaterial color="#5a3e2a" flatShading />
        </mesh>
      )}

      {/* Pás do moinho: cubo + quatro pás finas em cruz, na fachada. Estáticas
          (a maquete parada não gasta frame — frameloop sob demanda). */}
      {forma.moinho && (
        <group position={[0, forma.h * 0.82, forma.d / 2 + 0.08]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 8]} />
            <meshStandardMaterial color="#4a3c26" flatShading />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2 + Math.PI / 4]} position={[0, 0, 0.02]}>
              <boxGeometry args={[0.055, 0.62, 0.02]} />
              <meshStandardMaterial color="#6b5636" flatShading />
            </mesh>
          ))}
        </group>
      )}

      {/* Porta (retângulo escuro) e janelas acesas na fachada +z */}
      <mesh position={[-forma.w * 0.22, 0.17, forma.d / 2 + 0.006]}>
        <planeGeometry args={[0.16, 0.3]} />
        <meshStandardMaterial color="#2a2118" />
      </mesh>
      <mesh position={[forma.w * 0.18, forma.h * 0.55, forma.d / 2 + 0.006]}>
        <planeGeometry args={[0.13, 0.16]} />
        <meshStandardMaterial ref={registrarLampada(0)} color="#f4c07a" emissive="#d97706" emissiveIntensity={0.85} />
      </mesh>
      {forma.w > 1.1 && (
        <mesh position={[-forma.w * 0.02, forma.h * 0.55, forma.d / 2 + 0.006]}>
          <planeGeometry args={[0.13, 0.16]} />
          <meshStandardMaterial ref={registrarLampada(1)} color="#f4c07a" emissive="#d97706" emissiveIntensity={0.85} />
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
          resumo={resumo}
          aoClicar={aoClicar}
          aoEntrar={() => setHover(true)}
          aoSair={() => setHover(false)}
        />
      </Html>
    </group>
  );
}
