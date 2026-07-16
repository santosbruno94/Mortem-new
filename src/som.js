// =====================================================================
// Efeitos sonoros da mesa (Q7). Assets WAV sintetizados offline e
// embarcados no bundle — zero rede em runtime. O som é APRESENTAÇÃO:
// nenhuma regra de jogo depende dele, e o jogador pode desligá-lo
// (`somAtivo`, no rodapé da escrivaninha).
//
// Reprodução via Web Audio API (antes: `new Audio()` reiniciado por
// gesto). Motivos da troca:
//   - retrigger sem latência: cada toque cria um `AudioBufferSourceNode`
//     descartável sobre um `AudioBuffer` decodificado uma única vez;
//   - humanização: pitch (±4%) e ganho (±15%) variam a cada toque,
//     eliminando o efeito "metralhadora" da pena/papel em gestos
//     repetidos. A variação usa `Math.random()` — permitido aqui porque
//     som é camada de apresentação (mesma exceção do three.js), fora
//     da guarda de determinismo de `src/logic`/`src/data`/`src/store`.
// O `AudioContext` é singleton criado/retomado preguiçosamente no
// primeiro gesto (política de autoplay dos navegadores). O `fetch` dos
// WAVs aponta para as mesmas URLs embarcadas pelo bundler — continua
// zero rede externa em runtime.
//
// Sons e gestos:
//   papel    — extrair uma carta (o negrito vira papel na mesa)
//   sino     — viajar entre nós do mapa (o relógio anda)
//   barbante — amarrar/desfazer um barbante no mural
//   lacre    — selar o julgamento ("Confirmar e julgar" / encerrar)
//   pena     — avançar a abertura (a carta escreve-se)
// =====================================================================

import { useJogo } from './store/jogo.js';
import papelUrl from './assets/sons/papel.wav';
import sinoUrl from './assets/sons/sino.wav';
import barbanteUrl from './assets/sons/barbante.wav';
import lacreUrl from './assets/sons/lacre.wav';
import penaUrl from './assets/sons/pena.wav';

const URLS = {
  papel: papelUrl,
  sino: sinoUrl,
  barbante: barbanteUrl,
  lacre: lacreUrl,
  pena: penaUrl,
};

const VOLUME = 0.22;

// Contexto único de áudio. Criado no primeiro `tocarSom` (que sempre
// acontece dentro de um gesto do jogador) e retomado se o navegador o
// suspendeu — é o que a política de autoplay exige.
let contexto = null;

// AudioBuffers decodificados uma única vez por som.
const buffers = {};
// Promises de decodificação em andamento — evita fetch/decode duplicado
// quando o mesmo som é pedido duas vezes antes da primeira decodificação
// terminar.
const decodificacoes = {};

function obterContexto() {
  if (!contexto) {
    const Contexto = window.AudioContext || window.webkitAudioContext;
    if (!Contexto) return null;
    contexto = new Contexto();
  }
  if (contexto.state === 'suspended') {
    contexto.resume().catch(() => {});
  }
  return contexto;
}

function obterBuffer(nome, ctx) {
  if (buffers[nome]) return Promise.resolve(buffers[nome]);
  if (!decodificacoes[nome]) {
    decodificacoes[nome] = fetch(URLS[nome])
      .then((resposta) => resposta.arrayBuffer())
      .then((dados) => ctx.decodeAudioData(dados))
      .then((buffer) => {
        buffers[nome] = buffer;
        return buffer;
      })
      .catch(() => {
        // Falhou (formato, navegador restrito): libera para nova
        // tentativa num gesto futuro e segue mudo.
        delete decodificacoes[nome];
        return null;
      });
  }
  return decodificacoes[nome];
}

export function tocarSom(nome) {
  const url = URLS[nome];
  if (!url) return;
  try {
    if (!useJogo.getState().somAtivo) return;
    const ctx = obterContexto();
    if (!ctx) return;
    obterBuffer(nome, ctx).then((buffer) => {
      if (!buffer) return;
      try {
        const fonte = ctx.createBufferSource();
        fonte.buffer = buffer;
        // Humanização: nenhum toque soa idêntico ao anterior.
        fonte.playbackRate.value = 1 + (Math.random() * 2 - 1) * 0.04;
        const ganho = ctx.createGain();
        ganho.gain.value = VOLUME * (1 + (Math.random() * 2 - 1) * 0.15);
        fonte.connect(ganho);
        ganho.connect(ctx.destination);
        fonte.start();
      } catch {
        // Reprodução falhou: o jogo segue mudo.
      }
    });
  } catch {
    // Sem áudio disponível (navegador restrito): o jogo segue mudo.
  }
}
