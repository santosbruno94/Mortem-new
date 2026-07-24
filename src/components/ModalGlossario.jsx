import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { DOMINIOS_GLOSSARIO, verbetesPorDominio, obterVerbete } from '../data/glossario.js';
import Overlay from './Overlay.jsx';

// Glossário Forense (§9): referência de época, navegação por domínio,
// consulta gratuita. É o material que permite interpretar os dados
// brutos — o jogo nunca interpreta pelo jogador. Pode abrir já num
// verbete (a ponte carta → glossário da Caderneta, Q9).
//
// Vive na camada própria `glossarioAberto` (não no slot `overlay`), no topo
// da pilha base < ficha < glossário: abrir por cima da Ficha não descarta o
// que estava por baixo (P0 §3 do playtest de 17/07). A `marca` mantém o
// data-overlay que o QA-UI usa para achar a raiz mais ao topo.
export default function ModalGlossario() {
  const glossarioAberto = useJogo((s) => s.glossarioAberto);
  const fecharGlossario = useJogo((s) => s.fecharGlossario);
  const inicial = obterVerbete(glossarioAberto ? glossarioAberto.verbeteId : null);
  const [dominioAtivo, setDominioAtivo] = useState(inicial ? inicial.dominio : DOMINIOS_GLOSSARIO[0].id);
  const [verbeteAtivo, setVerbeteAtivo] = useState(inicial ? inicial.id : null);

  const verbetes = verbetesPorDominio(dominioAtivo);
  const aberto = verbetes.find((v) => v.id === verbeteAtivo) || null;
  // A linha de classe do verbete, à maneira de dicionário: onde um léxico
  // poria "s.m.", este põe o domínio a que a matéria pertence. Só o nome do
  // domínio — a cauda pedagógica do rótulo ("Temporal — Quando") serve aos
  // botões, que ensinam; um léxico abrevia e não se explica.
  const dominio = aberto ? DOMINIOS_GLOSSARIO.find((d) => d.id === aberto.dominio) : null;
  const classe = dominio ? dominio.rotulo.split(' — ')[0] : null;

  return (
    <Overlay
      titulo="Glossário Forense"
      subtitulo="Referência de época — consultar não custa tempo"
      largura="max-w-3xl"
      marca="glossario"
      nivelZ="z-[60]"
      aoFechar={fecharGlossario}
    >
      {/* Domínios: fileira de botões de mesa; o ativo vira placa de latão quente */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DOMINIOS_GLOSSARIO.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setDominioAtivo(d.id);
              setVerbeteAtivo(null);
            }}
            className={
              d.id === dominioAtivo
                ? 'placa-latao px-3 py-1.5 rounded-sm font-serif text-xs tracking-wide'
                : 'botao-mesa botao-mesa--quieto !px-3 !py-1.5 !text-xs tracking-wide'
            }
          >
            {d.rotulo}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-5 sm:gap-6">
        {/* O índice do compêndio: entradas em letra de balcão, e a que está
            aberta emoldurada a latão — a lombada marcada com o dedo. */}
        <ul className="space-y-0.5">
          {verbetes.map((v) => (
            <li key={v.id}>
              <button
                onClick={() => setVerbeteAtivo(v.id)}
                className={`text-left w-full px-2.5 py-2 rounded-sm font-rotulo uppercase text-[10px] tracking-[0.12em] leading-snug border transition-colors duration-gesto ${
                  v.id === verbeteAtivo
                    ? 'bg-latao/15 text-latao-ouro border-latao/55'
                    : 'text-stone-400 hover:text-stone-200 border-transparent'
                }`}
              >
                {v.termo}
              </button>
            </li>
          ))}
        </ul>

        {/* A folha aberta: o verbete impresso — a entrada em egípcia de
            manchete, a classe em itálico e o corpo justificado, como sai
            de uma página de compêndio. */}
        <div className="carta-pergaminho carta-pergaminho--clara rounded-sm p-4 sm:p-6 min-h-[200px]">
          {aberto ? (
            <>
              <h3 className="font-titulo uppercase text-tinta text-base sm:text-lg leading-tight">
                {aberto.termo}
              </h3>
              {classe && (
                <p className="font-serif italic text-tinta-apagada text-xs mt-1 mb-3">{classe}</p>
              )}
              <p className="font-prosa text-tinta text-[13.5px] sm:text-[15px] leading-relaxed text-justify [hyphens:auto]">
                {aberto.definicao}
              </p>
              <div className="divisor-ornado divisor-ornado--tinta text-xs my-4" aria-hidden>
                §
              </div>
              <p className="font-rotulo uppercase text-rotulo text-tinta-apagada mb-1">Sinal observável</p>
              <p className="font-prosa text-tinta-clara text-[13.5px] sm:text-[15px] leading-relaxed text-justify [hyphens:auto]">
                {aberto.sinalObservavel}
              </p>
            </>
          ) : (
            <p className="text-tinta-apagada italic font-serif text-sm">Escolha um verbete da lista.</p>
          )}
        </div>
      </div>
    </Overlay>
  );
}
