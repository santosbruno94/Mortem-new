import { estadoRigorPorIpm, estadoLivorPorIpm } from '../../logic/tempo_morte.js';
import { obterAparencia } from '../../logic/aparencia.js';
import { CORES_PELE } from '../../data/aparencias.js';

// =====================================================================
// O CADÁVER LOW-POLY — apresentação pura do estado forense.
//
// A pose e as manchas são função do IPM, lendo as MESMAS faixas do
// modelo universal (tempo_morte.js): rigor → pose dos membros; livor →
// manchas dorsais (opacas quando fixas); sulco → meio-anel no pescoço;
// petéquias → pontos nos olhos. Algor não tem cara — o termômetro segue
// sendo o instrumento. Nenhum número novo, nenhuma regra: quem decide
// continua sendo o jogador, com a prosa e o glossário.
//
// As proporções e a pele vêm do genótipo de aparência da vítima.
// =====================================================================

const COR_PANO = '#7d7565';
const COR_COLETE = '#4b3a27';
const COR_BANCADA = '#54452f';
const COR_LIVOR = '#4c1d43';
const COR_FERIDA = '#3d0f0f';
const COR_SANGUE_SECO = '#4a1a14';

// Pose dos membros por estado do rigor: o corpo "tábua" do rigor pleno
// afrouxa aos poucos até o desalinho do rigor resolvido.
const POSES_RIGOR = {
  instalando: { bracoAfastado: 0.06, peDeitado: 0.15, elevacao: 0.01 },
  pleno: { bracoAfastado: 0.02, peDeitado: 0.0, elevacao: 0.03 },
  resolucao: { bracoAfastado: 0.1, peDeitado: 0.35, elevacao: 0.0 },
  resolvido: { bracoAfastado: 0.18, peDeitado: 0.6, elevacao: 0.0 },
};

function Membro({ posicao, comprimento, raio, rotacaoZ = 0, rotacaoX = 0, cor }) {
  return (
    <mesh position={posicao} rotation={[rotacaoX, 0, Math.PI / 2 + rotacaoZ]}>
      <cylinderGeometry args={[raio, raio * 0.82, comprimento, 8]} />
      <meshStandardMaterial color={cor} flatShading />
    </mesh>
  );
}

export default function CorpoModelo({ ipm }) {
  const aparencia = obterAparencia('vitima');
  // Compleição: alarga tronco e membros; a pele dá o tom base (empalidece
  // um passo — é um morto, não um vivo).
  const f = aparencia.corpo === 'sobrepeso' ? 1.25 : aparencia.corpo === 'magro' ? 0.85 : 1;
  const pele = CORES_PELE[aparencia.pele] || CORES_PELE.palida;

  const rigor = estadoRigorPorIpm(ipm);
  const livor = estadoLivorPorIpm(ipm);
  const pose = POSES_RIGOR[rigor] || POSES_RIGOR.instalando;
  const opacidadeLivor = livor === 'fixo' ? 0.85 : 0.35;

  const yCorpo = 0.3 + pose.elevacao;

  return (
    <group>
      {/* A bancada de exame (mesa de cavalete) */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.5, 0.08, 0.95]} />
        <meshStandardMaterial color={COR_BANCADA} flatShading />
      </mesh>
      <mesh position={[-0.95, 0.08, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.06, 0.26, 0.8]} />
        <meshStandardMaterial color={COR_BANCADA} flatShading />
      </mesh>
      <mesh position={[0.95, 0.08, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.06, 0.26, 0.8]} />
        <meshStandardMaterial color={COR_BANCADA} flatShading />
      </mesh>
      {/* O pano que cobre da cintura para baixo (decoro de necrotério) */}
      <mesh position={[0.52, yCorpo + 0.01, 0]}>
        <boxGeometry args={[0.85, 0.1 * f + 0.04, 0.44 * f + 0.08]} />
        <meshStandardMaterial color={COR_PANO} flatShading />
      </mesh>

      {/* O corpo, deitado de costas — cabeça à esquerda */}
      <group position={[0, yCorpo, 0]}>
        {/* Cabeça e pescoço */}
        <mesh position={[-0.84, 0.05, 0]} scale={[1, 0.92, 0.86]}>
          <sphereGeometry args={[0.15, 12, 10]} />
          <meshStandardMaterial color={pele} flatShading />
        </mesh>
        <Membro posicao={[-0.66, 0.02, 0]} comprimento={0.16} raio={0.06} cor={pele} />

        {/* A ferida do caso: boca estreita sob o ângulo esquerdo do
            maxilar, com a mancha escura que desceu à gola (seed: ferida
            por arma branca — nada de sulco nem petéquias, que são sinais
            de asfixia e não pertencem a este corpo). */}
        <mesh position={[-0.7, 0.065, 0.045]} rotation={[0.35, 0, 0.5]} scale={[1, 0.4, 0.7]}>
          <sphereGeometry args={[0.028, 8, 6]} />
          <meshStandardMaterial color={COR_FERIDA} flatShading />
        </mesh>
        <mesh position={[-0.63, 0.045, 0.05]} rotation={[0.3, 0, 0]} scale={[1.6, 0.5, 1]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <meshStandardMaterial color={COR_SANGUE_SECO} flatShading />
        </mesh>

        {/* Tronco (colete abotoado) e quadril */}
        <mesh position={[-0.25, 0.02, 0]}>
          <boxGeometry args={[0.66, 0.17 * f + 0.04, 0.36 * f]} />
          <meshStandardMaterial color={COR_COLETE} flatShading />
        </mesh>
        <mesh position={[0.18, 0.01, 0]}>
          <boxGeometry args={[0.24, 0.15 * f, 0.32 * f]} />
          <meshStandardMaterial color={COR_COLETE} flatShading />
        </mesh>

        {/* Braços ao longo do corpo (pose pelo rigor); mãos de pele */}
        <Membro posicao={[-0.28, 0, 0.2 * f + pose.bracoAfastado]} comprimento={0.6} raio={0.045} rotacaoZ={-pose.bracoAfastado} cor={COR_COLETE} />
        <Membro posicao={[-0.28, 0, -0.2 * f - pose.bracoAfastado]} comprimento={0.6} raio={0.045} rotacaoZ={pose.bracoAfastado} cor={COR_COLETE} />
        <mesh position={[0.06, 0, 0.22 * f + pose.bracoAfastado * 1.6]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color={pele} flatShading />
        </mesh>
        <mesh position={[0.06, 0, -0.22 * f - pose.bracoAfastado * 1.6]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color={pele} flatShading />
        </mesh>

        {/* Pernas sob o pano; pés à mostra, tombando com o rigor desfeito */}
        <Membro posicao={[0.62, 0, 0.1 * f]} comprimento={0.66} raio={0.055} cor={COR_PANO} />
        <Membro posicao={[0.62, 0, -0.1 * f]} comprimento={0.66} raio={0.055} cor={COR_PANO} />
        <mesh position={[0.99, 0.03, 0.1 * f]} rotation={[pose.peDeitado, 0, 0]}>
          <boxGeometry args={[0.1, 0.09, 0.07]} />
          <meshStandardMaterial color={pele} flatShading />
        </mesh>
        <mesh position={[0.99, 0.03, -0.1 * f]} rotation={[-pose.peDeitado, 0, 0]}>
          <boxGeometry args={[0.1, 0.09, 0.07]} />
          <meshStandardMaterial color={pele} flatShading />
        </mesh>

        {/* LIVOR: manchas na face POSTERIOR (o corpo tocou o chão de
            costas) — faixas roxas rentes à borda inferior, que ganham
            corpo quando o livor fixa (opacidade pela faixa do modelo) */}
        <mesh position={[-0.25, -0.09 * f - 0.035, 0]}>
          <boxGeometry args={[0.6, 0.035, 0.3 * f]} />
          <meshStandardMaterial color={COR_LIVOR} transparent opacity={opacidadeLivor} flatShading />
        </mesh>
        <mesh position={[0.6, -0.06, 0.1 * f]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.6, 8]} />
          <meshStandardMaterial color={COR_LIVOR} transparent opacity={opacidadeLivor * 0.8} flatShading />
        </mesh>
        <mesh position={[0.6, -0.06, -0.1 * f]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.6, 8]} />
          <meshStandardMaterial color={COR_LIVOR} transparent opacity={opacidadeLivor * 0.8} flatShading />
        </mesh>
      </group>
    </group>
  );
}
