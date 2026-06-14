import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { calcularJanelaMorte, janelaDaCarta } from '../logic/cronos.js';
import { formatJanela } from '../logic/tempo.js';
import Overlay from './Overlay.jsx';

// Gaveta Cronos — o pilar "Quando" (§7).
// O jogador CALCULA a hora: escolhe os indicadores temporais que reuniu e
// a gaveta mostra, ao vivo, a Janela da Morte resultante (interseção das
// janelas de cada indicador, pelo modelo forense universal). Não há menu
// de horas. Registrar grava exatamente a janela calculada — é o que o
// jogador afirma; o tribunal é que a julga.
export default function GavetaCronos() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);
  const registrarConclusao = useJogo((s) => s.registrarConclusao);
  const desfazerConclusao = useJogo((s) => s.desfazerConclusao);

  const temporais = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'temporal');
  const [idsSelecionados, setIdsSelecionados] = useState([]);

  const selecionadas = temporais.filter((c) => idsSelecionados.includes(c.id));
  const { janela, motivo } = calcularJanelaMorte(selecionadas);
  const amplitude =
    janela && janela.inicio !== -Infinity && janela.fim !== Infinity
      ? Math.round(janela.fim - janela.inicio)
      : null;

  const registradas = conclusoes.filter((c) => c.origem === 'cronos');

  function alternar(id) {
    setIdsSelecionados((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
    );
  }

  function registrar() {
    if (!janela) return;
    registrarConclusao({
      origem: 'cronos',
      titulo: 'Janela da Morte',
      resumo: `O óbito ocorreu ${formatJanela(janela)}.`,
      tagsOcultas: { tipo: 'janela', inicio: janela.inicio, fim: janela.fim },
    });
    setIdsSelecionados([]);
  }

  return (
    <Overlay titulo="Gaveta Cronos" subtitulo="Quando — raciocinar não custa tempo" largura="max-w-3xl">
      <div className="text-stone-500 text-sm mb-5">
        Reúna os sinais temporais que colheu. Cada um admite uma faixa de horas; a hora
        da morte é a sobreposição delas. Quanto mais sinais (colhidos a tempo), mais
        estreita a janela.
      </div>

      {/* Indicadores reunidos */}
      <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">
        Indicadores temporais
      </h3>
      {temporais.length === 0 ? (
        <p className="text-stone-600 text-sm mb-5">Nenhum sinal temporal repousa sobre a mesa.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-5">
          {temporais.map((carta) => {
            const ativa = idsSelecionados.includes(carta.id);
            const inconclusiva = !janelaDaCarta(carta);
            return (
              <button
                key={carta.id}
                onClick={() => alternar(carta.id)}
                title={carta.descricao}
                className={`px-3 py-2 rounded-sm border text-sm text-left ${
                  ativa
                    ? 'border-amber-700 bg-stone-950 text-amber-200'
                    : 'border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {carta.termoCarimbo}
                {inconclusiva && <span className="text-stone-600"> — inconclusivo</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Janela resultante — calculada ao vivo */}
      <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">Janela da morte</h3>
      <div className="border border-stone-800 rounded-sm px-4 py-3 mb-5">
        {selecionadas.length === 0 ? (
          <p className="text-stone-600 text-sm">Selecione ao menos um indicador.</p>
        ) : janela ? (
          <p className="text-stone-300 text-sm">
            O óbito ocorreu <span className="text-amber-200">{formatJanela(janela)}</span>
            {amplitude !== null && (
              <span className="text-stone-500"> (amplitude de {amplitude}h)</span>
            )}
            .
          </p>
        ) : (
          <p className="text-stone-500 text-sm">{motivo}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={registrar}
          disabled={!janela}
          className="px-5 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Registrar Janela da Morte
        </button>
        <p className="text-stone-600 text-xs">
          A gaveta apenas registra a janela que você calculou — quem a julga é o tribunal.
        </p>
      </div>

      {/* Conclusões já registradas nesta gaveta */}
      {registradas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">
            Registradas nesta gaveta
          </h3>
          <ul className="space-y-2">
            {registradas.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 border border-stone-800 rounded-sm px-4 py-2"
              >
                <p className="text-stone-300 text-sm">
                  <span className="font-bold">{c.titulo}:</span> {c.resumo}
                </p>
                <button
                  onClick={() => desfazerConclusao(c.id)}
                  className="text-stone-600 hover:text-amber-200 text-xs tracking-widest shrink-0"
                >
                  desfazer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Overlay>
  );
}
