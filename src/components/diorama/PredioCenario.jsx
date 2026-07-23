import { Telhado } from './Predio.jsx';

// =====================================================================
// PRÉDIO DE CENÁRIO (OS da vila na mesa) — o casario da vila gerada que
// NÃO é nó do mapa: igreja, cottages, granja… A maquete deixa de mostrar
// só os lugares clicáveis e passa a mostrar a vila inteira. Não clicável,
// sem etiqueta, janela a meia-luz fixa (nada anima — frameloop demand).
// Logradouro (h rasa) rende como laje de chão, sem fachada nem telhado.
// Geometria 100% procedural, como todo o diorama — zero asset, zero rede.
// =====================================================================
export default function PredioCenario({ forma, x, z }) {
  const laje = forma.h < 0.2;
  return (
    <group position={[x, 0.11, z]}>
      <mesh position={[0, forma.h / 2, 0]}>
        <boxGeometry args={[forma.w, forma.h, forma.d]} />
        <meshStandardMaterial color={forma.corParede} flatShading />
      </mesh>
      {!laje && (
        <>
          <Telhado forma={forma} emissiva="#000000" intensidade={0} />
          {forma.chamines?.map((c, i) => (
            <mesh key={i} position={[c.x, forma.h + c.alt / 2, c.z]}>
              <boxGeometry args={[0.1, c.alt, 0.1]} />
              <meshStandardMaterial color={forma.corParede} flatShading />
            </mesh>
          ))}
          <mesh position={[forma.w * 0.18, forma.h * 0.55, forma.d / 2 + 0.006]}>
            <planeGeometry args={[0.11, 0.14]} />
            <meshStandardMaterial color="#e8c79a" emissive="#b97c2a" emissiveIntensity={0.22} />
          </mesh>
        </>
      )}
    </group>
  );
}
