import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { HalfFloatType, Vector2, Vector3, WebGLRenderTarget } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// =====================================================================
// O PASSE DE GRAVURA — pós-processamento que faz a mesa de exame ler
// como prancha anatômica vitoriana, não como render 3D moderno.
//
// Como: dithering ordenado de Bayer 4×4 em fragment shader, mapeando a
// luminância da cena para um duotone papel/tinta — as MESMAS cores do
// pergaminho do index.css (.carta-pergaminho: fundo #e7ddc8, tinta
// #2b2119), nunca preto/branco puros, que brigariam com a mesa quente.
// O meio-tom vira trama de pontos, como a retícula de uma litografia.
//
// Apresentação pura: nenhuma regra de jogo lê este passe; o raycasting
// dos HotspotCorpo acontece ANTES do pós-processamento e não é afetado.
// Determinístico: a trama de Bayer é função da posição do pixel — nada
// de ruído aleatório, nada de tempo.
//
// Stack: EffectComposer + ShaderPass de three/examples (three@0.169 +
// fiber v8 — o pipeline TSL/WebGPU exigiria fiber v9, fora de alcance).
// O useFrame com prioridade 1 assume o render no lugar do fiber; com
// frameloop="demand", ele só roda quando alguém chama invalidate() —
// nenhum loop contínuo nasce aqui.
//
// Passo futuro (se a gravura do corpo convencer): estender o mesmo
// passe ao DioramaVila — fora desta entrega por decisão registrada.
// =====================================================================

// Hex sRGB → vetor 0..1 SEM passar por THREE.Color: o gerenciador de
// cores do three converteria para o espaço linear, e estas cores devem
// chegar à tela exatamente como estão no index.css.
function hexParaVetor(hex) {
  const n = parseInt(hex.slice(1), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const COR_PAPEL = hexParaVetor('#e7ddc8'); // o pergaminho das cartas
const COR_TINTA = hexParaVetor('#2b2119'); // a tinta sobre o pergaminho

const GravuraShader = {
  uniforms: {
    tDiffuse: { value: null },
    corPapel: { value: COR_PAPEL },
    corTinta: { value: COR_TINTA },
    // Lado do ponto da trama em pixels FÍSICOS — segue o devicePixelRatio
    // para a retícula ter o mesmo corpo aparente em qualquer tela.
    escalaPonto: { value: 1 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec3 corPapel;
    uniform vec3 corTinta;
    uniform float escalaPonto;
    varying vec2 vUv;

    // Matriz de Bayer 4x4 na forma recursiva clássica (sem arrays, sem
    // branches): bayer2 dá o padrao 2x2 {0,2;3,1}/4; bayer4 o refina.
    float bayer2(vec2 a) {
      a = floor(a);
      return fract(a.x / 2.0 + a.y * a.y * 0.75);
    }
    float bayer4(vec2 a) {
      return bayer2(0.5 * a) * 0.25 + bayer2(a);
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      // O buffer intermediário do composer é linear; o olho, não —
      // devolve a luminância ao espaço perceptual antes de quantizar.
      float luma = dot(texel.rgb, vec3(0.2126, 0.7152, 0.0722));
      luma = pow(clamp(luma, 0.0, 1.0), 1.0 / 2.2);
      // Dithering ordenado: o limiar de Bayer empurra cada pixel para o
      // tom de cima ou de baixo — o degradê vira trama, como gravura.
      float limiar = bayer4(floor(gl_FragCoord.xy / escalaPonto));
      const float TONS = 5.0;
      float q = clamp(floor(luma * (TONS - 1.0) + limiar) / (TONS - 1.0), 0.0, 1.0);
      vec3 cor = mix(corTinta, corPapel, q);
      // O canvas é transparente (o fundo escuro é do contêiner) e o
      // compositor da página espera alfa pré-multiplicado: fora do corpo
      // (alfa 0), a cor precisa zerar junto, senão vira véu de tinta.
      gl_FragColor = vec4(cor * texel.a, texel.a);
    }
  `,
};

export default function EfeitoGravura() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  const { composer, passeGravura } = useMemo(() => {
    // Alvo multisample (WebGL2): o composer padrão não herda o antialias
    // do canvas, e as arestas do low-poly serrilhariam sob a trama.
    const tamanho = gl.getSize(new Vector2());
    const alvo = new WebGLRenderTarget(
      tamanho.width * gl.getPixelRatio(),
      tamanho.height * gl.getPixelRatio(),
      { type: HalfFloatType, samples: 4 }
    );
    const c = new EffectComposer(gl, alvo);
    c.addPass(new RenderPass(scene, camera));
    const passe = new ShaderPass(GravuraShader);
    c.addPass(passe);
    return { composer: c, passeGravura: passe };
  }, [gl, scene, camera]);

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    composer.setPixelRatio(dpr);
    composer.setSize(size.width, size.height);
    passeGravura.uniforms.escalaPonto.value = dpr;
    invalidate();
  }, [composer, passeGravura, gl, size, invalidate]);

  useEffect(() => () => composer.dispose(), [composer]);

  // Prioridade > 0 = este render substitui o do fiber. Sob demanda:
  // só executa nos quadros que alguém invalidou (câmera, hover, IPM).
  useFrame(() => composer.render(), 1);

  return null;
}
