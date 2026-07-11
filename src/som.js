// =====================================================================
// Efeitos sonoros da mesa (Q7). Assets WAV sintetizados offline e
// embarcados no bundle — zero rede em runtime. O som é APRESENTAÇÃO:
// nenhuma regra de jogo depende dele, e o jogador pode desligá-lo
// (`somAtivo`, no rodapé da escrivaninha).
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
const cache = {};

export function tocarSom(nome) {
  const url = URLS[nome];
  if (!url) return;
  try {
    if (!useJogo.getState().somAtivo) return;
    // Um Audio por som, reiniciado a cada toque (gestos não se sobrepõem
    // rápido o bastante para exigir pool).
    const audio = cache[nome] || (cache[nome] = new Audio(url));
    audio.volume = VOLUME;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    // Sem áudio disponível (navegador restrito): o jogo segue mudo.
  }
}
