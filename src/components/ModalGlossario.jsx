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

  return (
    <Overlay
      titulo="Glossário Forense"
      subtitulo="Medicina legal de época — consultar não custa tempo"
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

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        {/* Índice de verbetes — o lado escuro do atril */}
        <ul className="space-y-1">
          {verbetes.map((v) => (
            <li key={v.id}>
              <button
                onClick={() => setVerbeteAtivo(v.id)}
                className={`text-left w-full px-3 py-2 rounded-sm text-sm font-serif border-l-2 transition-colors duration-gesto ${
                  v.id === verbeteAtivo
                    ? 'bg-stone-950/80 text-latao-claro border-latao'
                    : 'text-stone-400 hover:text-stone-200 border-transparent'
                }`}
              >
                § {v.termo}
              </button>
            </li>
          ))}
        </ul>

        {/* A folha aberta: o verbete escolhido, escrito a tinta sobre pergaminho */}
        <div className="carta-pergaminho rounded-sm p-5 min-h-[200px]">
          {aberto ? (
            <>
              <h3 className="font-serif text-xl text-tinta">{aberto.termo}</h3>
              <div className="my-2 text-tinta-apagada" aria-hidden="true">―</div>
              <p className="text-tinta text-sm leading-relaxed">{aberto.definicao}</p>
              <p className="mt-4 text-tinta-clara text-sm leading-relaxed">
                <span className="text-tinta font-bold">Sinal observável: </span>
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
