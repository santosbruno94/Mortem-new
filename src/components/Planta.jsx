import { useJogo } from '../store/jogo.js';

// =====================================================================
// PLANTA BAIXA GENERALIZADA (§5.1 do contexto / OS Vila Viva E1) — andar
// entre cômodos do mesmo prédio ou ler a cena procedural cômodo a cômodo.
//
// Recebe QUALQUER planta no schema de PLANTA_RELOJOARIA (titulo, viewBox,
// comodos[{id,rotulo,contorno,rotuloPos,alvos}], tracos, decorSalas,
// vitrine, rotulosDecor). Serve dois modos, escolhidos pelas props:
//
//   • MODO NÓ (caso-escola): `localidadeAtual` + `alvos` nos cômodos.
//     Clicar um alvo VIAJA para o nó (custo 0 — mesmo prédio, regra de
//     src/data/mapa.js) e reabre o overlay de localidade lá. É o
//     comportamento histórico da relojoaria, inalterado.
//   • MODO PONTO (caso procedural): `comodosAtivos` + `onComodoClick`. Os
//     cômodos não são nós, e sim pontos de interesse do acordeão da mesma
//     localidade; clicar um cômodo ABRE o ponto correspondente e o cômodo
//     do ponto aberto fica realçado. Nenhuma viagem, nenhum nó novo.
//
// É SVG 2D puro: funciona idêntico em ?flat=1. Em tela estreita, colapsa
// para uma régua horizontal. Camada de APRESENTAÇÃO — não lê o motor.
//
// BOIL (Tarefa 4): todo traço de tinta existe em três quadros com
// micro-perturbações FIXAS nas coordenadas (tabela cíclica de offsets —
// nada de Math.random() em render), alternados pelo CSS `.boil-quadro`
// (index.css) a ~13fps. As variantes são pré-computadas por path na carga;
// as áreas de clique (.planta-hit) não participam do boil — o alvo do
// toque fica parado.
// =====================================================================

// Tabela cíclica de offsets (unidades do viewBox; ~0,76px na tela). Cada
// coordenada do path recebe o offset do seu índice; o quadro desloca a
// fase, então os três quadros tremem em direções diferentes.
const AMPLITUDE_BOIL = [0.7, -0.5, 0.4, -0.7, 0.5, -0.4, 0.6, -0.6, 0.3, -0.5];

// Perturba SÓ coordenadas de um path SVG. No comando de arco (A), os cinco
// primeiros parâmetros (raios, rotação e as duas flags) ficam intactos —
// flag perturbada corromperia o desenho; só o ponto final treme.
function perturbarPath(d, quadro) {
  let n = 0;
  const desloca = (v) => {
    const off = AMPLITUDE_BOIL[(n++ + quadro * 4) % AMPLITUDE_BOIL.length];
    return Math.round((parseFloat(v) + off) * 10) / 10;
  };
  return d.replace(/([MLHVQTCSAZ])([^MLHVQTCSAZ]*)/gi, (tudo, cmd, corpo) => {
    if (cmd.toUpperCase() === 'Z') return cmd;
    const nums = corpo.match(/-?\d*\.?\d+/g) || [];
    if (cmd.toUpperCase() === 'A') {
      const grupos = [];
      for (let i = 0; i < nums.length; i += 7) {
        const g = nums.slice(i, i + 7);
        grupos.push([...g.slice(0, 5), desloca(g[5]), desloca(g[6])].join(' '));
      }
      return cmd + grupos.join(' ');
    }
    return cmd + nums.map(desloca).join(' ');
  });
}

// Variantes por path, calculadas uma vez (o quadro 0 é o traço original).
// Teto no cache: cada caso gerado traz paths próprios — numa sessão longa
// de vários casos, o Map crescia sem limite. Estourado o teto, esvazia-se
// (recalcular é barato; os paths do caso corrente repovoam na hora).
const TETO_CACHE_BOIL = 512;
const cacheBoil = new Map();
function quadrosDe(d) {
  if (!cacheBoil.has(d)) {
    if (cacheBoil.size >= TETO_CACHE_BOIL) cacheBoil.clear();
    cacheBoil.set(d, [d, perturbarPath(d, 1), perturbarPath(d, 2)]);
  }
  return cacheBoil.get(d);
}

// Um traço com boil: os três quadros empilhados; o CSS mostra um por vez.
function TracoBoil({ d, className }) {
  return quadrosDe(d).map((v, i) => (
    <path key={i} d={v} className={`${className} boil-quadro boil-quadro--${i}`} />
  ));
}

// Retângulo de clique derivado do contorno de um cômodo. Os contornos
// (estáticos e projetados do grid) têm sempre a forma "M x0 y0 H x1 V y1
// H x0 Z" — bastam os quatro primeiros números para o bounding box.
function hitDoContorno(d) {
  const n = (d.match(/-?\d*\.?\d+/g) || []).map(Number);
  const [x0 = 0, y0 = 0, x1 = 0, y1 = 0] = n;
  return { x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), h: Math.abs(y1 - y0) };
}

export default function Planta({ planta, localidadeAtual, comodosAtivos, onComodoClick }) {
  const viajarPara = useJogo((s) => s.viajarPara);
  const abrirOverlay = useJogo((s) => s.abrirOverlay);
  if (!planta) return null;
  const P = planta;
  const modoPonto = typeof onComodoClick === 'function';
  const ativos = new Set(comodosAtivos || []);

  // Andar de cômodo (modo nó) é a mesma viagem de custo 0 do grid/diorama:
  // viaja e reabre a localidade de destino. Ir para onde já se está não faz
  // nada.
  const irPara = (no) => {
    if (no === localidadeAtual) return;
    viajarPara(no);
    abrirOverlay('localidade', no);
  };

  // Cômodo realçado: no modo nó, o que contém o nó atual; no modo ponto,
  // qualquer cômodo cujo ponto esteja aberto.
  const comodoAtual = modoPonto
    ? null
    : P.comodos.find((c) => (c.alvos || []).some((a) => a.no === localidadeAtual));

  const rotulo = modoPonto ? 'Planta da cena — examinar cômodo a cômodo' : `${P.titulo} — andar entre cômodos`;

  return (
    <div data-planta className="carta-pergaminho rounded-sm px-3 pt-2 pb-3 mb-5">
      <p className="planta-titulo">{P.titulo}</p>

      {/* O desenho (telas médias para cima). */}
      <svg viewBox={P.viewBox} className="planta-svg hidden sm:block w-full" role="group" aria-label={rotulo}>
        {/* Cômodos decorativos (loja, corredor): traço mais claro. */}
        {(P.decorSalas || []).map((s, i) => (
          <TracoBoil key={`d${i}`} d={s.contorno} className="planta-decor" />
        ))}
        {(P.decorSalas || []).map(
          (s, i) =>
            s.rotulo && (
              <text key={`dr${i}`} x={s.rotuloPos.x} y={s.rotuloPos.y} className="planta-rotulo-decor">
                {s.rotulo}
              </text>
            )
        )}

        {/* Mobília e aberturas (balcão, lareira, porta dos fundos, escada). */}
        {(P.tracos || []).map((d, i) => (
          <TracoBoil key={`t${i}`} d={d} className="planta-traco" />
        ))}
        {P.vitrine && <TracoBoil d={P.vitrine} className="planta-vitrine" />}

        {/* Rótulos de papel do desenho. */}
        {(P.rotulosDecor || []).map((r, i) => (
          <text key={`rd${i}`} x={r.x} y={r.y} textAnchor="middle" className="planta-rotulo-decor planta-rotulo-decor--italico">
            {r.texto}
          </text>
        ))}

        {/* Cômodos, com o(s) cômodo(s) atual(is) realçado(s). Um cômodo pode
            trazer AMBOS: os alvos de VIAGEM entre nós (corpo↔cena — o hook
            `alvos` da planta gerada, ligado no pacote) e, no modo ponto, o
            gatilho do acordeão. No modo ponto só se mostra o alvo de OUTRO nó
            (a viagem útil é ir ao corpo); no modo nó mostram-se todos, com o
            atual marcado "aqui" (comportamento do caso-escola, intacto). */}
        {P.comodos.map((c) => {
          const temAlvoAtual = (c.alvos || []).some((a) => a.no === localidadeAtual);
          const aqui = modoPonto ? ativos.has(c.id) : temAlvoAtual || c === comodoAtual;
          const alvosViagem = modoPonto
            ? (c.alvos || []).filter((a) => a.no !== localidadeAtual)
            : c.alvos || [];
          return (
            <g key={c.id}>
              <TracoBoil d={c.contorno} className={`planta-comodo ${aqui ? 'planta-comodo--aqui' : ''}`} />
              <text x={c.rotuloPos.x} y={c.rotuloPos.y} textAnchor="middle" className="planta-rotulo">
                {c.rotulo}
              </text>
              {modoPonto &&
                // MODO PONTO: o cômodo inteiro abre o ponto do acordeão que
                // dele deriva (o ponto tem `comodo === c.id`).
                (() => {
                  const h = hitDoContorno(c.contorno);
                  return (
                    <g
                      data-alvo-comodo={c.id}
                      className="planta-alvo"
                      role="button"
                      tabIndex={0}
                      aria-label={`Examinar ${c.rotulo}`}
                      onClick={() => onComodoClick(c.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onComodoClick(c.id);
                        }
                      }}
                    >
                      <rect x={h.x} y={h.y} width={h.w} height={h.h} className="planta-hit" />
                      {aqui && (
                        <text x={c.rotuloPos.x} y={c.rotuloPos.y + 13} textAnchor="middle" className="planta-aqui">
                          — aberto —
                        </text>
                      )}
                    </g>
                  );
                })()}
              {/* Alvos de VIAGEM entre nós (corpo↔cena / relojoaria). */}
              {alvosViagem.map((a) => {
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

      {/* Régua horizontal (telas estreitas): a mesma navegação em botões. Os
          alvos de VIAGEM (corpo↔cena) entram em ambos os modos; no modo ponto,
          só o alvo de OUTRO nó (ir ao corpo). */}
      <div className="planta-regua sm:hidden">
        {(modoPonto ? P.comodos.flatMap((c) => (c.alvos || []).filter((a) => a.no !== localidadeAtual)) : P.comodos.flatMap((c) => c.alvos || [])).map(
          (a) => {
            const alvoAqui = a.no === localidadeAtual;
            return (
              <button
                key={`alvo_${a.no}`}
                onClick={() => irPara(a.no)}
                className={`planta-regua-item ${alvoAqui ? 'planta-regua-item--aqui' : ''}`}
              >
                {a.rotulo}
              </button>
            );
          }
        )}
        {modoPonto &&
          P.comodos.map((c) => (
            <button
              key={c.id}
              onClick={() => onComodoClick(c.id)}
              className={`planta-regua-item ${ativos.has(c.id) ? 'planta-regua-item--aqui' : ''}`}
            >
              {c.rotulo}
            </button>
          ))}
      </div>
    </div>
  );
}
