import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { interpolar } from '../logic/interpolar.js';
import { obterAbertura } from '../data/pacote_caso.js';
import { tocarSom } from '../som.js';

// Sequência de abertura em 7 passos (§4.1–4.2). O último passo é o
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

        {/* Cada passo vem no suporte que lhe cabe: a carta do delegado em
            pergaminho, o telegrama no formulário do Post Office, o resto em
            prosa escura sobre a mesa. */}
        {passo.telegrama ? (
          <FormularioTelegrafo passo={passo} detective={detective} />
        ) : (
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
        )}

        {passo.pensamento && (
          <div className="mt-4 space-y-3 border-l-2 border-amber-900/30 pl-4">
            {passo.pensamento.map((p, i) => (
              <p key={`t${i}`} className="text-stone-400 italic leading-relaxed">
                {interpolar(p, detective)}
              </p>
            ))}
          </div>
        )}

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

// O FORMULÁRIO DE TELÉGRAFO (1i). O impresso que o rapaz da estação
// entregava à porta: papel pardo de repartição, o timbre do serviço acima
// de um filete grosso e, abaixo, a mensagem em letra de balcão — só
// maiúsculas, espaçadas, sem uma vírgula que custe palavra.
//
// O primeiro parágrafo do passo é a olhada de fora (quem descreve o papel
// está do lado de cá); os seguintes são a cópia do fio e entram no corpo.
// As aspas que os cercam na prosa saem aqui: dentro do formulário a
// mensagem não é citação de ninguém — é o que está impresso.
//
// Do impresso de época ficou de fora o que este caso não sabe: a estação
// de origem (Alcott despacha de quatro condados daqui, não de Caulfield,
// que é onde o telegrama CHEGA) e a taxa por palavra (a mensagem tem o
// dobro das doze palavras que caberiam no preço).
function FormularioTelegrafo({ passo, detective }) {
  const [lede, ...corpo] = passo.paragrafos;
  return (
    <>
      <p className="text-stone-300 leading-relaxed mb-5">{interpolar(lede, detective)}</p>
      <div className="telegrama-form rounded-sm">
        <div className="telegrama-cabeca flex items-center justify-between gap-3 px-3 sm:px-4 py-2">
          {/* A roseta do fio: o círculo cortado que o serviço punha no
              timbre. Traço procedural, puro ornamento. */}
          <svg viewBox="0 0 30 22" className="w-6 shrink-0" aria-hidden="true">
            <circle cx="15" cy="11" r="9" fill="none" stroke="#251b10" strokeWidth="1.2" />
            <path d="M15 2 v18 M6 11 h18" stroke="#251b10" strokeWidth=".8" />
          </svg>
          <p className="font-rotulo uppercase text-[9px] sm:text-[10px] tracking-[0.28em] text-center leading-tight">
            Post Office Telegraphs
          </p>
          <p className="font-rotulo uppercase text-[8px] tracking-[0.16em] text-tinta-apagada shrink-0">
            Form A1
          </p>
        </div>
        <div className="telegrama-corpo px-3 sm:px-4 py-3 sm:py-4 space-y-3">
          {corpo.map((p, i) => (
            <p key={i} className="font-rotulo text-[11.5px] sm:text-[12.5px]">
              {semAspas(interpolar(p, detective))}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

// Tira as aspas que cercam a fala na prosa — só as das pontas, e só
// quando fecham o parágrafo inteiro. O texto de dado fica intacto.
function semAspas(texto) {
  return texto.replace(/^["“](.*)["”]$/s, '$1');
}
