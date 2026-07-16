import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { interpolar } from '../logic/interpolar.js';
import { obterAbertura } from '../data/pacote_caso.js';
import { tocarSom } from '../som.js';

// Sequência de abertura em 6 passos (§4.1–4.2). O último passo é o
// briefing do Delegado Wycliffe, cujas perguntas (custo zero) plantam
// informações e iscas antes de o relógio começar a contar.
// Apresentação: mesa de madeira à luz de vela; a prosa imersiva fica
// escura e legível (stone-300); só a carta escrita vira pergaminho.
export default function Abertura() {
  const { detective, passoAbertura, avancarAbertura, iniciarInvestigacao } = useJogo();
  const [perguntasFeitas, setPerguntasFeitas] = useState([]);

  // A abertura sai do PACOTE carregado (tutorial ou caso gerado) — mesmos
  // passos e perguntas de sempre quando o caso é o caso-escola.
  const { passos: PASSOS_ABERTURA, perguntas: PERGUNTAS_BRIEFING } = obterAbertura();
  const passo = PASSOS_ABERTURA[passoAbertura];
  const ultimo = passoAbertura === PASSOS_ABERTURA.length - 1;

  return (
    <div className="relative altura-tela-min mesa-madeira overflow-hidden flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Halo de vela que respira sobre a mesa */}
      <div className="luz-de-vela" aria-hidden />

      {/* A chave no passo faz cada página surgir com o gesto dos overlays
          (≤320ms; .overlay-surgir cede ao prefers-reduced-motion) */}
      <div key={passoAbertura} className="relative overlay-surgir max-w-2xl w-full">
        <p className="text-rotulo uppercase text-latao-claro/70 mb-2">
          {passoAbertura + 1} · {PASSOS_ABERTURA.length}
        </p>
        <h1 className="font-serif text-3xl text-amber-200 titulo-gravado">
          {interpolar(passo.titulo, detective)}
        </h1>
        <div className="my-5 divisor-ornado text-xs" aria-hidden>
          §
        </div>

        {/* A carta escrita pousa como pergaminho (tinta sobre papel);
            a prosa imersiva permanece escura, em stone-300 legível */}
        <div
          className={
            passo.carta
              ? 'carta-pergaminho rounded-sm p-6 sm:p-7 space-y-4 italic'
              : 'space-y-4'
          }
        >
          {passo.paragrafos.map((p, i) => (
            <p
              key={i}
              className={passo.carta ? 'leading-relaxed' : 'text-stone-300 leading-relaxed'}
            >
              {interpolar(p, detective)}
            </p>
          ))}
        </div>

        {passo.briefing && (
          <div className="mt-8 space-y-3">
            <p className="font-serif italic text-stone-400 text-sm tracking-wide">
              Perguntas ao Delegado <span className="text-latao-claro/70">(não custam tempo — o que não
              perguntar aqui, fica por saber)</span>:
            </p>
            {PERGUNTAS_BRIEFING.map((q) => {
              const feita = perguntasFeitas.includes(q.id);
              return (
                <div key={q.id}>
                  <button
                    onClick={() =>
                      setPerguntasFeitas((atual) => (feita ? atual : [...atual, q.id]))
                    }
                    className={`botao-mesa w-full text-left ${
                      feita ? 'botao-mesa--quieto cursor-default' : ''
                    }`}
                  >
                    § {interpolar(q.pergunta, detective)}
                  </button>
                  {feita && (
                    <p className="mt-2 ml-3 pl-3 border-l border-latao/40 text-stone-300 text-sm leading-relaxed">
                      {interpolar(q.resposta, detective)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex flex-col items-end gap-2">
          {passo.briefing && perguntasFeitas.length < PERGUNTAS_BRIEFING.length && (
            <p className="text-latao-claro/60 text-xs italic font-serif" data-perguntas-pendentes>
              {PERGUNTAS_BRIEFING.length - perguntasFeitas.length === 1
                ? 'Resta 1 pergunta por fazer; entrar a deixa para trás.'
                : `Restam ${PERGUNTAS_BRIEFING.length - perguntasFeitas.length} perguntas por fazer; entrar as deixa para trás.`}
            </p>
          )}
          <button
            onClick={() => {
              tocarSom('pena');
              (ultimo ? iniciarInvestigacao : avancarAbertura)();
            }}
            className="botao-mesa grupo-pena px-6 py-3 tracking-wide"
          >
            <span className="pena-tinta">{interpolar(passo.rotuloBotao, detective)}</span> →
          </button>
        </div>
      </div>
    </div>
  );
}
