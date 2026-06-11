import { useState } from 'react';
import { DOMINIOS_GLOSSARIO, verbetesPorDominio } from '../data/glossario.js';
import Overlay from './Overlay.jsx';

// Glossário Forense (§9): referência de época, navegação por domínio,
// consulta gratuita. É o material que permite interpretar os dados
// brutos — o jogo nunca interpreta pelo jogador.
export default function ModalGlossario() {
  const [dominioAtivo, setDominioAtivo] = useState(DOMINIOS_GLOSSARIO[0].id);
  const [verbeteAtivo, setVerbeteAtivo] = useState(null);

  const verbetes = verbetesPorDominio(dominioAtivo);
  const aberto = verbetes.find((v) => v.id === verbeteAtivo) || null;

  return (
    <Overlay titulo="Glossário Forense" subtitulo="Medicina legal de época — consultar não custa tempo" largura="max-w-3xl">
      <div className="flex flex-wrap gap-2 mb-6">
        {DOMINIOS_GLOSSARIO.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setDominioAtivo(d.id);
              setVerbeteAtivo(null);
            }}
            className={`px-3 py-1.5 rounded-sm text-xs tracking-wide border ${
              d.id === dominioAtivo
                ? 'border-amber-900 text-amber-200 bg-stone-950'
                : 'border-stone-800 text-stone-500 hover:text-stone-300'
            }`}
          >
            {d.rotulo}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <ul className="space-y-1">
          {verbetes.map((v) => (
            <li key={v.id}>
              <button
                onClick={() => setVerbeteAtivo(v.id)}
                className={`text-left w-full px-3 py-2 rounded-sm text-sm ${
                  v.id === verbeteAtivo
                    ? 'bg-stone-950 text-amber-200'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                § {v.termo}
              </button>
            </li>
          ))}
        </ul>

        <div className="border border-stone-800 rounded-sm p-5 min-h-[200px]">
          {aberto ? (
            <>
              <h3 className="font-serif text-xl text-amber-200">{aberto.termo}</h3>
              <div className="my-2 text-amber-900">―</div>
              <p className="text-stone-300 text-sm leading-relaxed">{aberto.definicao}</p>
              <p className="mt-4 text-stone-500 text-sm leading-relaxed">
                <span className="text-stone-400 font-bold">Sinal observável: </span>
                {aberto.sinalObservavel}
              </p>
            </>
          ) : (
            <p className="text-stone-600 text-sm">Escolha um verbete à esquerda.</p>
          )}
        </div>
      </div>
    </Overlay>
  );
}
