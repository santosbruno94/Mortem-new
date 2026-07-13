import { useJogo } from '../store/jogo.js';
import { PLANTA_RELOJOARIA as P } from '../data/planta_relojoaria.js';

// =====================================================================
// A PLANTA DA RELOJOARIA (§5.1) — andar entre cômodos do mesmo prédio.
//
// Pousa no topo da visão de qualquer nó do grupo `relojoaria`: desenha a
// planta baixa (traço de tinta sobre papel) com o cômodo atual marcado.
// Clicar num cômodo VIAJA para o nó (custo 0 — mesmo prédio, regra de
// src/data/mapa.js) e reabre o overlay de localidade lá. É SVG 2D puro:
// funciona idêntico em ?flat=1. Em tela estreita, colapsa para uma régua
// horizontal de cômodos. Camada de APRESENTAÇÃO — não lê o motor.
// =====================================================================
export default function PlantaRelojoaria({ localidadeAtual }) {
  const viajarPara = useJogo((s) => s.viajarPara);
  const abrirOverlay = useJogo((s) => s.abrirOverlay);

  // Andar de cômodo é a mesma viagem de custo 0 do grid/diorama: viaja e
  // reabre a localidade de destino. Ir para onde já se está não faz nada.
  const irPara = (no) => {
    if (no === localidadeAtual) return;
    viajarPara(no);
    abrirOverlay('localidade', no);
  };

  const comodoAtual = P.comodos.find((c) => c.alvos.some((a) => a.no === localidadeAtual));

  return (
    <div data-planta className="carta-pergaminho rounded-sm px-3 pt-2 pb-3 mb-5">
      <p className="planta-titulo">{P.titulo}</p>

      {/* O desenho (telas médias para cima). */}
      <svg
        viewBox={P.viewBox}
        className="planta-svg hidden sm:block w-full"
        role="group"
        aria-label="Planta da relojoaria — andar entre cômodos"
      >
        {/* Cômodos decorativos (loja, corredor): traço mais claro. */}
        {P.decorSalas.map((s, i) => (
          <path key={`d${i}`} d={s.contorno} className="planta-decor" />
        ))}
        {P.decorSalas.map(
          (s, i) =>
            s.rotulo && (
              <text key={`dr${i}`} x={s.rotuloPos.x} y={s.rotuloPos.y} className="planta-rotulo-decor">
                {s.rotulo}
              </text>
            )
        )}

        {/* Mobília e aberturas (balcão, lareira, porta dos fundos, escada). */}
        {P.tracos.map((d, i) => (
          <path key={`t${i}`} d={d} className="planta-traco" />
        ))}
        <path d={P.vitrine} className="planta-vitrine" />

        {/* Rótulos de papel do desenho. */}
        {P.rotulosDecor.map((r, i) => (
          <text key={`rd${i}`} x={r.x} y={r.y} textAnchor="middle" className="planta-rotulo-decor planta-rotulo-decor--italico">
            {r.texto}
          </text>
        ))}

        {/* Cômodos clicáveis, com o cômodo atual realçado. */}
        {P.comodos.map((c) => {
          const aqui = c === comodoAtual;
          return (
            <g key={c.id}>
              <path d={c.contorno} className={`planta-comodo ${aqui ? 'planta-comodo--aqui' : ''}`} />
              <text x={c.rotuloPos.x} y={c.rotuloPos.y} textAnchor="middle" className="planta-rotulo">
                {c.rotulo}
              </text>
              {c.alvos.map((a) => {
                const alvoAqui = a.no === localidadeAtual;
                return (
                  <g
                    key={a.no}
                    data-alvo={a.no}
                    className="planta-alvo"
                    role="button"
                    tabIndex={0}
                    aria-label={`Ir para ${a.rotulo}`}
                    onClick={() => irPara(a.no)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        irPara(a.no);
                      }
                    }}
                  >
                    <rect x={a.hit.x} y={a.hit.y} width={a.hit.w} height={a.hit.h} className="planta-hit" />
                    <text
                      x={a.pos.x}
                      y={a.pos.y}
                      textAnchor="middle"
                      className={`planta-alvo-texto ${alvoAqui ? 'planta-alvo-texto--aqui' : ''}`}
                    >
                      {a.rotulo}
                    </text>
                    {alvoAqui && (
                      <text x={a.pos.x} y={a.pos.y + 13} textAnchor="middle" className="planta-aqui">
                        — aqui —
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Régua horizontal (telas estreitas): a mesma navegação em botões. */}
      <div className="planta-regua sm:hidden">
        {P.comodos
          .flatMap((c) => c.alvos)
          .map((a) => {
            const alvoAqui = a.no === localidadeAtual;
            return (
              <button
                key={a.no}
                onClick={() => irPara(a.no)}
                className={`planta-regua-item ${alvoAqui ? 'planta-regua-item--aqui' : ''}`}
              >
                {a.rotulo}
              </button>
            );
          })}
      </div>
    </div>
  );
}
