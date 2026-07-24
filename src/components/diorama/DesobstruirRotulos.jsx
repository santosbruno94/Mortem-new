import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

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

export default function DesobstruirRotulos({ anchors, aoCalcular }) {
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
