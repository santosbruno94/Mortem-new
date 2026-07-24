import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useJogo } from '../../store/jogo.js';
import { LOCALIDADES } from '../../data/localidades.js';
// Custo do PACOTE CORRENTE (não do mapa.js estático do caso-escola): o
// rótulo 3D tem de mostrar o mesmo custo que o store cobra (M8).
import { custoViagem, obterMaquete, obterLocalidades } from '../../data/pacote_caso.js';
import {
  POSICOES_DIORAMA,
  FORMAS_PREDIO,
  ESTRADA_MOORFORD,
  MAQUETE,
  interpolarLuz,
} from '../../data/mapa_espacial.js';
import Predio from './Predio.jsx';
import PredioCenario from './PredioCenario.jsx';
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
//
// OS da vila na mesa: a FONTE da maquete é dupla. O caso-escola usa o
// mapa espacial estático (POSICOES_DIORAMA/FORMAS_PREDIO/ESTRADA); o
// caso GERADO traz a própria vila no campo visual `maquete` do pacote
// (posições dos nós, formas, o CASARIO de cenário e a tábua sob medida).
// Camada 100% visual — o motor jamais lê nada daqui; sem maquete válida,
// a Escrivaninha nem monta este componente (grade 2D, ?flat=1).
// =====================================================================

function CameraIsometrica({ enquadramento }) {
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

// A estrada do nó distante: traço de tinta pousado sobre o terreno,
// seguindo a polilinha (a de Moorford no caso-escola; a da comarca na
// maquete gerada). Surge com o nó desbloqueado.
function EstradaDistante({ pontos }) {
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

// =====================================================================
// DESOBSTRUTOR DE RÓTULOS — camada visual pura (não lê o motor).
//
// As etiquetas são <Html> de tamanho fixo em DOM: numa vila densa (ou em
// tela estreita, onde a vila inteira cabe na largura) elas se sobrepõem
// (playtest mobile 24/07/2026). Como a câmara é ortográfica FIXA e as
// posições dos nós são estáticas por caso, projeta-se cada âncora ao
// espaço de tela UMA vez (por tamanho/zoom) e afastam-se, na vertical, as
// etiquetas que colidiriam — inclusive o retângulo do relógio de bolso,
// tratado como obstáculo fixo no canto. O resultado é um deslocamento em
// px por nó, estável, aplicado ao pendão da etiqueta (o cordão alonga).
// Determinístico: mesma tela ⇒ mesmo layout; nenhuma escrita no motor.
// =====================================================================
function colide(a, b, folga) {
  return (
    Math.abs(a.sx - b.sx) < (a.w + b.w) / 2 &&
    Math.abs(a.sy - b.sy) < (a.h + b.h) / 2 + folga
  );
}

function DesobstruirRotulos({ anchors, aoCalcular }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useEffect(() => {
    if (!anchors.length) {
      aoCalcular({});
      return;
    }
    const estreito = size.width < 640;
    // Altura estimada da etiqueta (px em tela) — compacta no celular (a CSS
    // encolhe .rotulo-papel abaixo de 640px).
    const h = estreito ? 38 : 58;
    const folga = estreito ? 4 : 7;
    const passo = 8;
    const ponto3d = new THREE.Vector3();
    // A câmara foi reposicionada por CameraIsometrica NESTE mesmo ciclo de
    // efeitos; o matrixWorldInverse dela só se atualiza no próximo quadro. Sem
    // forçar as matrizes agora, project() usaria a posição ANTERIOR e as
    // etiquetas projetariam para lugares errados (cluster central não se
    // separava — playtest mobile 24/07). Recalcula antes de projetar.
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    // Projeção ortográfica fixa: âncora do mundo → px de tela do canvas. A
    // largura é estimada pelo texto do rótulo (nomes longos ocupam mais).
    const larguraDoRotulo = (a) => {
      const car = estreito ? 6.6 : 8.2;
      const nome = (a.rotulo || '').length * car + (estreito ? 22 : 30);
      return Math.min(estreito ? 210 : 260, Math.max(estreito ? 60 : 84, nome));
    };
    const projetar = (a) => {
      ponto3d.set(a.x, a.y, a.z).project(camera);
      return { id: a.id, sx: (ponto3d.x * 0.5 + 0.5) * size.width, sy: (-ponto3d.y * 0.5 + 0.5) * size.height };
    };
    const itens = anchors.map((a) => ({ ...projetar(a), w: larguraDoRotulo(a), h }));
    // O relógio de bolso, obstáculo fixo no canto superior direito (a mesma
    // âncora `top-2 right-2`): as etiquetas o contornam. A largura acompanha a
    // linha da data ("14 de outubro, 11h00"), o item mais largo do relógio.
    const relW = estreito ? 150 : 190;
    const relH = estreito ? 44 : 62;
    const obstaculos = [
      { sx: size.width - 8 - relW / 2, sy: 8 + relH / 2, w: relW, h: relH },
    ];
    // Limites da banda: a etiqueta não sai por cima nem por baixo do canvas.
    const topo = 4 + h / 2;
    const fundo = size.height - 4 - h / 2;
    // Processa de cima para baixo; cada etiqueta procura a FENDA LIVRE mais
    // próxima da sua âncora (para cima OU para baixo, o menor deslocamento),
    // sem colidir com as já pousadas nem com o relógio, e dentro da banda —
    // assim os rótulos de baixo não caem fora da tela (playtest mobile).
    const ordenados = itens.slice().sort((p, q) => p.sy - q.sy);
    const pousados = [...obstaculos];
    const offsets = {};
    const livre = (sy, it) => {
      if (sy < topo || sy > fundo) return false;
      const r = { sx: it.sx, sy, w: it.w, h: it.h };
      return !pousados.some((p) => colide(r, p, folga));
    };
    for (const it of ordenados) {
      let escolhido = it.sy;
      if (!livre(it.sy, it)) {
        for (let k = 1; k <= 80; k++) {
          const baixo = it.sy + k * passo;
          const cima = it.sy - k * passo;
          if (livre(baixo, it)) { escolhido = baixo; break; }
          if (livre(cima, it)) { escolhido = cima; break; }
        }
        // Nada livre dentro do teto de busca: prende dentro da banda.
        escolhido = Math.min(fundo, Math.max(topo, escolhido));
      }
      pousados.push({ sx: it.sx, sy: escolhido, w: it.w, h: it.h });
      offsets[it.id] = Math.round(escolhido - it.sy);
    }
    aoCalcular(offsets);
    // camera.zoom/position são fixados por CameraIsometrica no mesmo ciclo
    // de `size`; anchors muda ao desbloquear nó. Recalcula nessas trocas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, size.width, size.height, anchors, aoCalcular]);
  return null;
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

  // A fonte da maquete: o campo visual do pacote (caso gerado) ou o mapa
  // espacial estático (caso-escola). Resolução única por render — o pacote
  // não muda no meio de um caso.
  const maquete = obterMaquete();
  const posicoesNos = maquete ? maquete.posicoes : POSICOES_DIORAMA;
  const formaDoNo = (pos) =>
    (maquete ? maquete.formas[pos.predio] : FORMAS_PREDIO[pos.predio]) || FORMAS_PREDIO.estalagem;

  // Rastreio da viagem para o pino: guarda o nó anterior e a "viagemId" que
  // faz o pino recomeçar o deslize a cada troca com custo real.
  const noAnterior = useRef(localidadeAtual);
  const [viagem, setViagem] = useState({ id: 0, origem: null, custo: 0 });
  useEffect(() => {
    const anterior = noAnterior.current;
    if (anterior && anterior !== localidadeAtual) {
      const origem = posicoesNos[anterior] || null;
      const custo = custoViagem(anterior, localidadeAtual);
      setViagem((v) => ({ id: v.id + 1, origem, custo }));
    }
    noAnterior.current = localidadeAtual;
    // posicoesNos é estável por caso (módulo do pacote) — dependência omitida
    // de propósito: só a troca de nó dispara o pino.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localidadeAtual]);

  // As localidades vêm do PACOTE corrente (o caso gerado tem as suas); o
  // import estático de LOCALIDADES segue para o caso-escola.
  const locsVisiveis = (maquete ? obterLocalidades() : LOCALIDADES).filter((loc) =>
    nosDesbloqueados.includes(loc.id)
  );
  // O nó DISTANTE (fora da vila, na ponta da estrada): no caso-escola é o
  // gabinete de Moorford; na maquete gerada, qualquer nó com `distante`.
  const distanteVisivel = maquete
    ? nosDesbloqueados.some((id) => posicoesNos[id]?.distante)
    : nosDesbloqueados.includes('gabinete_pettigrew');
  const estrada = maquete ? maquete.estrada || null : ESTRADA_MOORFORD;

  // A tábua e o enquadramento: o caso-escola conserva os números afinados
  // nos playtests; a maquete gerada deriva da própria tábua (e alarga para
  // o nascente quando o nó distante entra em cena).
  const tabua = maquete
    ? {
        centroX: maquete.tabua.centroX + (distanteVisivel ? 1.2 : 0),
        larguraTabua: maquete.tabua.largura + (distanteVisivel ? 2.4 : 0),
        fundoTabua: maquete.tabua.fundo,
      }
    : { centroX: MAQUETE.centroX, larguraTabua: MAQUETE.larguraTabua, fundoTabua: MAQUETE.fundoTabua };
  const enquadramento = maquete
    ? {
        largura: maquete.tabua.largura + (distanteVisivel ? 4.2 : 1.0),
        altura: maquete.tabua.fundo + (distanteVisivel ? 0.5 : 0.1),
        centroX: maquete.tabua.centroX + (distanteVisivel ? 1.7 : 0),
      }
    : {
        largura: distanteVisivel ? 13.6 : 12.4,
        altura: distanteVisivel ? 5.8 : 5.1,
        centroX: distanteVisivel ? MAQUETE.centroX : 0,
      };
  // Deslocamentos de etiqueta calculados pelo desobstrutor (id → px). Estado
  // porque Predio precisa re-renderizar quando o layout muda; estável por
  // tela (a projeção é fixa).
  const [offsetsRotulo, setOffsetsRotulo] = useState({});
  // Âncoras das etiquetas no mundo (topo do pendão de cada nó visível), para
  // a projeção do desobstrutor. Mesma fórmula de `alturaRotulo` do Predio.
  const anchors = useMemo(
    () =>
      locsVisiveis
        .map((loc) => {
          const pos = posicoesNos[loc.id];
          if (!pos) return null;
          const forma = formaDoNo(pos);
          const alturaRotulo = forma.h + forma.telhadoAltura + (forma.rotuloAlto || 0.34);
          return { id: loc.id, rotulo: loc.rotuloMesa, x: pos.x, y: 0.11 + alturaRotulo, z: pos.z };
        })
        .filter(Boolean),
    // posicoesNos/formaDoNo são estáveis por caso; locsVisiveis muda ao
    // desbloquear nó — a dependência que importa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locsVisiveis]
  );

  // O pino finca-se À FRENTE do prédio (deslocado para a câmera), não no
  // centro do nó (onde ficaria dentro da caixa, ocluso).
  const frente = (p) => (p ? { x: p.x - 0.12, z: p.z + 0.62 } : null);
  const posAtual = frente(posicoesNos[localidadeAtual]);
  const origemPino = frente(viagem.origem);

  return (
    <Canvas
      orthographic
      flat
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'low-power' }}
      camera={{ zoom: 90, position: [tabua.centroX + 5, 8.5, 11], near: 0.1, far: 60 }}
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
      <CameraIsometrica enquadramento={enquadramento} />
      <DesobstruirRotulos anchors={anchors} aoCalcular={setOffsetsRotulo} />
      <LuzDoDia luzRef={luzRef} />

      {/* A tábua da maquete e o terreno */}
      <mesh position={[tabua.centroX, 0.0, 0]}>
        <boxGeometry args={[tabua.larguraTabua, 0.14, tabua.fundoTabua]} />
        <meshStandardMaterial color={MAQUETE.corTabua} flatShading />
      </mesh>
      <mesh position={[tabua.centroX, 0.075, 0]}>
        <boxGeometry args={[tabua.larguraTabua - 0.5, 0.07, tabua.fundoTabua - 0.4]} />
        <meshStandardMaterial color={MAQUETE.corTerreno} flatShading />
      </mesh>

      {/* O casario de cenário da vila gerada (OS da vila na mesa): a vila
          INTEIRA na tábua — só os nós têm etiqueta e clique. */}
      {maquete &&
        maquete.cenario.map((c) =>
          maquete.formas[c.predio] ? (
            <PredioCenario key={c.predio} forma={maquete.formas[c.predio]} x={c.x} z={c.z} />
          ) : null
        )}

      {/* A estrada e os prédios — só os nós desbloqueados existem */}
      {distanteVisivel && estrada && <EstradaDistante pontos={estrada} />}
      {locsVisiveis.map((loc) => {
        const pos = posicoesNos[loc.id];
        if (!pos) return null;
        const forma = formaDoNo(pos);
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
            offsetRotuloY={offsetsRotulo[loc.id] || 0}
          />
        );
      })}

      {/* O guarda à porta da delegacia (dia) / a lanterna do umbral (noite) */}
      {nosDesbloqueados.includes('delegacia') && (
        <GuardaDelegacia horasJogo={horasJogo} pos={posicoesNos.delegacia} />
      )}

      {/* O pino do perito: marca o nó atual e anima o trajeto na viagem */}
      {posAtual && (
        <PinoPerito alvo={posAtual} origem={origemPino} custo={viagem.custo} viagemId={viagem.id} />
      )}
    </Canvas>
  );
}
