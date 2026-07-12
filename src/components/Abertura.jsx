import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { interpolar } from '../logic/interpolar.js';
import { PASSOS_ABERTURA, PERGUNTAS_BRIEFING } from '../data/abertura.js';
import { tocarSom } from '../som.js';

// Sequência de abertura em 6 passos (§4.1–4.2). O último passo é o
// briefing do Delegado Wycliffe, cujas perguntas (custo zero) plantam
// informações e iscas antes de o relógio começar a contar.
export default function Abertura() {
  const { detective, passoAbertura, avancarAbertura, iniciarInvestigacao } = useJogo();
  const [perguntasFeitas, setPerguntasFeitas] = useState([]);

  const passo = PASSOS_ABERTURA[passoAbertura];
  const ultimo = passoAbertura === PASSOS_ABERTURA.length - 1;

  return (
    <div className="altura-tela-min flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl w-full">
        <p className="text-stone-600 text-xs tracking-[0.3em] uppercase mb-2">
          {passoAbertura + 1} · {PASSOS_ABERTURA.length}
        </p>
        <h1 className="font-serif text-3xl text-amber-200">{interpolar(passo.titulo, detective)}</h1>
        <div className="my-4 text-amber-900">――――</div>

        <div
          className={
            passo.carta
              ? 'bg-stone-900 border border-amber-900/60 rounded-sm p-6 space-y-4 italic'
              : 'space-y-4'
          }
        >
          {passo.paragrafos.map((p, i) => (
            <p key={i} className="text-stone-300 leading-relaxed">
              {interpolar(p, detective)}
            </p>
          ))}
        </div>

        {passo.briefing && (
          <div className="mt-8 space-y-3">
            <p className="text-stone-500 text-sm tracking-wide">Perguntas ao Delegado (não custam tempo):</p>
            {PERGUNTAS_BRIEFING.map((q) => {
              const feita = perguntasFeitas.includes(q.id);
              return (
                <div key={q.id} className="border border-stone-800 rounded-sm">
                  <button
                    onClick={() =>
                      setPerguntasFeitas((atual) => (feita ? atual : [...atual, q.id]))
                    }
                    className={`w-full text-left px-4 py-3 text-sm transition-colors duration-gesto ${
                      feita ? 'text-stone-500' : 'text-amber-200 hover:bg-stone-900'
                    }`}
                  >
                    § {interpolar(q.pergunta, detective)}
                  </button>
                  {feita && (
                    <p className="px-4 pb-4 text-stone-400 text-sm leading-relaxed">
                      {interpolar(q.resposta, detective)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <button
            onClick={() => {
              tocarSom('pena');
              (ultimo ? iniciarInvestigacao : avancarAbertura)();
            }}
            className="px-6 py-3 bg-stone-900 border border-amber-900 text-amber-200 rounded-sm transition-all duration-gesto hover:bg-stone-800 hover:shadow-vela tracking-wide text-sm"
          >
            {interpolar(passo.rotuloBotao, detective)} →
          </button>
        </div>
      </div>
    </div>
  );
}
