import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import Overlay from './Overlay.jsx';

// Processador lógico reutilizável (§7): Evidência → Hipótese → Conclusão.
// Fluxo tese-primeiro: o jogador declara a hipótese ANTES de validá-la.
// O único retorno possível é "consistente/inconsistente com as evidências
// inseridas" — nunca um indicador de acerto. Conclusões podem ser desfeitas.
export default function GavetaBase({
  titulo,
  subtitulo,
  instrucao,
  cartasElegiveis,
  selecaoUnicaCarta = false,
  conclusoesElegiveis = null, // se presente, exige escolher 1 conclusão de apoio
  hipoteses,
  validar, // (hipotese, cartasSelecionadas, conclusaoSelecionada) → { consistente, motivo, conclusao }
  origem,
  filtroConclusoesGaveta, // (conclusao) → bool — quais conclusões listar como já registradas aqui
}) {
  const conclusoes = useJogo((s) => s.conclusoes);
  const registrarConclusao = useJogo((s) => s.registrarConclusao);
  const desfazerConclusao = useJogo((s) => s.desfazerConclusao);

  const [idsSelecionados, setIdsSelecionados] = useState([]);
  const [idConclusaoApoio, setIdConclusaoApoio] = useState(null);
  const [idHipotese, setIdHipotese] = useState(null);
  const [resultado, setResultado] = useState(null);

  const registradasAqui = conclusoes.filter(
    (c) => c.origem === origem && (!filtroConclusoesGaveta || filtroConclusoesGaveta(c))
  );

  function alternarCarta(id) {
    setResultado(null);
    setIdsSelecionados((atual) => {
      if (atual.includes(id)) return atual.filter((x) => x !== id);
      return selecaoUnicaCarta ? [id] : [...atual, id];
    });
  }

  function verificar() {
    const hipotese = hipoteses.find((h) => h.id === idHipotese);
    if (!hipotese) return;
    const cartas = cartasElegiveis.filter((c) => idsSelecionados.includes(c.id));
    const apoio = conclusoesElegiveis
      ? conclusoesElegiveis.find((c) => c.id === idConclusaoApoio) || null
      : null;
    setResultado(validar(hipotese, cartas, apoio));
  }

  function registrar() {
    if (!resultado?.consistente || !resultado.conclusao) return;
    registrarConclusao(resultado.conclusao);
    setIdsSelecionados([]);
    setIdConclusaoApoio(null);
    setIdHipotese(null);
    setResultado(null);
  }

  return (
    <Overlay titulo={titulo} subtitulo={subtitulo} largura="max-w-3xl">
      <div className="text-stone-500 text-sm mb-5">{instrucao}</div>

      {/* 1. Evidências */}
      <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">I. Evidências inseridas</h3>
      {cartasElegiveis.length === 0 ? (
        <p className="text-stone-600 text-sm mb-5">Nenhuma carta compatível repousa sobre a mesa.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-5">
          {cartasElegiveis.map((carta) => {
            const ativa = idsSelecionados.includes(carta.id);
            return (
              <button
                key={carta.id}
                onClick={() => alternarCarta(carta.id)}
                title={carta.descricao}
                className={`px-3 py-2 rounded-sm border text-sm text-left ${
                  ativa
                    ? 'border-amber-700 bg-stone-950 text-amber-200'
                    : 'border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {carta.termoCarimbo}
              </button>
            );
          })}
        </div>
      )}

      {/* 1b. Conclusão de apoio (quando a gaveta a exige) */}
      {conclusoesElegiveis && (
        <>
          <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">
            I·b. Conclusão de apoio
          </h3>
          {conclusoesElegiveis.length === 0 ? (
            <p className="text-stone-600 text-sm mb-5">Nenhuma conclusão registrada serve de apoio ainda.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-5">
              {conclusoesElegiveis.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setResultado(null);
                    setIdConclusaoApoio((atual) => (atual === c.id ? null : c.id));
                  }}
                  className={`px-3 py-2 rounded-sm border text-sm text-left ${
                    idConclusaoApoio === c.id
                      ? 'border-amber-700 bg-stone-950 text-amber-200'
                      : 'border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {c.titulo} — {c.resumo}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* 2. Hipótese (tese-primeiro) */}
      <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">II. Hipótese declarada</h3>
      <div className="space-y-2 mb-6">
        {hipoteses.map((h) => (
          <label
            key={h.id}
            className={`flex items-start gap-3 px-3 py-2 rounded-sm border cursor-pointer text-sm ${
              idHipotese === h.id
                ? 'border-amber-700 bg-stone-950 text-stone-200'
                : 'border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <input
              type="radio"
              name={`hipotese_${origem}`}
              className="mt-1 accent-amber-700"
              checked={idHipotese === h.id}
              onChange={() => {
                setResultado(null);
                setIdHipotese(h.id);
              }}
            />
            <span>{h.rotulo}</span>
          </label>
        ))}
      </div>

      {/* 3. Validação de consistência */}
      <div className="flex items-center gap-4">
        <button
          onClick={verificar}
          disabled={!idHipotese}
          className="px-5 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Verificar consistência
        </button>
        {resultado && (
          <p className={`text-sm ${resultado.consistente ? 'text-stone-300' : 'text-stone-500'}`}>
            {resultado.consistente
              ? 'Consistente com as evidências inseridas.'
              : `Inconsistente — ${resultado.motivo}`}
          </p>
        )}
      </div>

      {resultado?.consistente && (
        <div className="mt-4 border border-stone-800 rounded-sm px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-stone-300 text-sm">
            <span className="font-bold">{resultado.conclusao.titulo}:</span> {resultado.conclusao.resumo}
          </p>
          <button
            onClick={registrar}
            className="shrink-0 px-4 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800"
          >
            Registrar conclusão
          </button>
        </div>
      )}

      {/* Conclusões já registradas nesta gaveta */}
      {registradasAqui.length > 0 && (
        <div className="mt-8">
          <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">Registradas nesta gaveta</h3>
          <ul className="space-y-2">
            {registradasAqui.map((c) => (
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
