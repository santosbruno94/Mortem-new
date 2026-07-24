import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
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
} from '../../data/mapa_espacial.js';
import Predio from './Predio.jsx';
import PredioCenario from './PredioCenario.jsx';
import PinoPerito from './PinoPerito.jsx';
import GuardaDelegacia from './GuardaDelegacia.jsx';
import DesobstruirRotulos from './DesobstruirRotulos.jsx';
import LuzDoDia from './LuzDoDia.jsx';
import { CameraIsometrica, EstradaDistante } from './apoio.jsx';

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

function DioramaVila({ aoAbrirNo, aoPerderContexto }) {
  const localidadeAtual = useJogo((s) => s.localidadeAtual);
  const nosDesbloqueados = useJogo((s) => s.nosDesbloqueados);
  const nosNovos = useJogo((s) => s.nosNovos);
  const overlayAberto = useJogo((s) => s.overlay) !== null;
  // Vida na maquete (Onda 9): o guarda da delegacia segue o turno do relógio.
  const horasJogo = useJogo((s) => s.horasJogo);

  // Objeto compartilhado do ciclo de luz (lido pelos lampiões dos prédios).
  const luzRef = useRef({ lamp: 0.2 });

  // A prop de perda de contexto, atualizada a cada render, para o listener
  // do canvas (registrado uma vez em onCreated) nunca ver closure obsoleta.
  const aoPerderContextoRef = useRef(aoPerderContexto);
  aoPerderContextoRef.current = aoPerderContexto;

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
  // import estático de LOCALIDADES segue para o caso-escola. MEMOIZADO por
  // referência: um array novo a cada render invalidava `anchors`, que
  // disparava o efeito do desobstrutor, que gravava offsets novos no estado
  // — um laço de re-render perpétuo e silencioso (mesmos valores, outra
  // identidade) enquanto a maquete estivesse na tela.
  const locsVisiveis = useMemo(
    () => (maquete ? obterLocalidades() : LOCALIDADES).filter((loc) => nosDesbloqueados.includes(loc.id)),
    // maquete é estável por caso (módulo do pacote); a lista só muda ao
    // desbloquear nó.
    [maquete, nosDesbloqueados]
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
  // tela (a projeção é fixa). O setter compara com o estado corrente e
  // DEVOLVE A MESMA REFERÊNCIA quando nada mudou — segundo cinto contra o
  // laço de re-render (o React ignora set com referência idêntica).
  const [offsetsRotulo, setOffsetsRotulo] = useState({});
  const aoCalcularOffsets = useCallback((novos) => {
    setOffsetsRotulo((atuais) => {
      const chavesAtuais = Object.keys(atuais);
      const chavesNovas = Object.keys(novos);
      const iguais =
        chavesAtuais.length === chavesNovas.length &&
        chavesNovas.every((k) => atuais[k] === novos[k]);
      return iguais ? atuais : novos;
    });
  }, []);
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
        // guarda-corpo (Cena3DBoundary). O listener lê a prop via ref (nunca
        // a closure do primeiro render); morre junto com o canvas no unmount.
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          aoPerderContextoRef.current?.();
        });
      }}
    >
      <CameraIsometrica enquadramento={enquadramento} />
      <DesobstruirRotulos anchors={anchors} aoCalcular={aoCalcularOffsets} />
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

// memo: a Escrivaninha re-renderiza a cada mudança de store que assina
// (overlay, ficha, glossário, som…) — sem o memo, cada uma re-renderizava a
// árvore r3f inteira da maquete. As props (aoAbrirNo em useCallback,
// aoPerderContexto estável) permitem o curto-circuito.
export default memo(DioramaVila);
