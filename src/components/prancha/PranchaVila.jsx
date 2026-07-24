import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useJogo } from '../../store/jogo.js';
import { LOCALIDADES } from '../../data/localidades.js';
// Custo do PACOTE CORRENTE (não do mapa.js estático do caso-escola): a
// etiqueta da prancha tem de mostrar o mesmo custo que o store cobra (M8).
import { custoViagem, obterMaquete, obterLocalidades } from '../../data/pacote_caso.js';
import { POSICOES_DIORAMA, FORMAS_PREDIO, ESTRADA_MOORFORD, MAQUETE } from '../../data/mapa_espacial.js';
import { projetarVila, escalaGrafica, arrumarEtiquetas, QUADRO, MOLDURA } from '../../logic/prancha_vila.js';
import RotuloNo from '../diorama/RotuloNo.jsx';

// =====================================================================
// A PRANCHA DA VILA — a vila do caso estampada como gravura de 1893, em
// SVG procedural, e a VISTA PADRÃO da escrivaninha (OS Prancha da Vila,
// E1). Cada nó do mapa é um prédio desenhado; a etiqueta de papel
// pendente sobre ele é a MESMA do diorama 3D (RotuloNo) e dispara o
// MESMO handler de viagem — paridade por construção.
//
// A fonte do espaço é a dupla que o diorama já resolve: o campo visual
// `maquete` do pacote (caso gerado) ou o mapa espacial estático (caso-
// escola). Nenhum dado novo, nenhum campo novo no pacote.
//
// Tudo é <pattern>, <path> e <rect> — nunca <canvas>: assim a prancha
// sobrevive ao ?flat=1, ao print e à ausência de WebGL. Ela É o fallback
// de todo ponto 3D, e por isso pôde virar o padrão.
//
// Camada 100% VISUAL: nenhuma regra de motor, veredicto ou tempo lê a
// prancha. Zero Math.random/Date.now — a geometria sai inteira das
// funções puras de src/logic/prancha_vila.js.
// =====================================================================

// A tinta e o papel da gravura (os mesmos tokens do sistema visual).
const TINTA = '#251b10';
const PAPEL_PAREDE = '#ecdfc3';
const PAPEL_VIDRO = '#f4ecd9';

// Caixa estimada de uma etiqueta de papel, em px de tela — só para o
// escalonamento (as etiquetas são HTML de tamanho fixo, não escalam com
// a folha). Medir o DOM aqui custaria um laço de re-render como o que o
// desobstrutor do 3D precisou domar; a estimativa basta e é estável.
const CAIXA_ETIQUETA = { largura: 132, altura: 46 };

// A margem de papel em volta da gravura (px): a cabeça impressa mora no
// alto, e o quadro fica recuado das tachas que prendem a folha à mesa.
const MARGEM_FOLHA = { x: 14, topo: 26, pe: 10 };

// Largura viva do palco da prancha (a folha acompanha a mesa).
function useCaixaViva(ref) {
  const [caixa, setCaixa] = useState({ largura: 0, altura: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const medir = () => setCaixa({ largura: el.clientWidth, altura: el.clientHeight });
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    medir();
    return () => observador.disconnect();
  }, [ref]);
  return caixa;
}

// O letreiro gravado na fachada — a tabuleta do comerciante, não o nome
// da etiqueta. Sai do rótulo do nó, sem o artigo e em caixa-alta; nomes
// longos ficam na primeira palavra (é fachada, não legenda).
//
// CONTRATO DO qa-ui: o QA clica os nós POR TEXTO visível. Um letreiro que
// CONTENHA o rótulo de um nó roubaria o clique da etiqueta de papel — nesse
// caso a fachada fica sem tabuleta (a etiqueta já diz o nome, e o desenho
// não perde nada).
export function letreiroDaFachada(rotulo, rotulosVisiveis) {
  const semArtigo = String(rotulo || '').replace(/^(a|o|as|os)\s+/i, '');
  const bruto = semArtigo.length > 12 ? semArtigo.split(/\s+/)[0] : semArtigo;
  const gravado = bruto.toUpperCase();
  if (gravado.length < 3 || gravado.length > 14) return null;
  const alvo = gravado.toLowerCase();
  if (rotulosVisiveis.some((r) => alvo.includes(String(r).toLowerCase()))) return null;
  return gravado;
}

// ---------------------------------------------------------------------
// A silhueta de um prédio, derivada da MESMA `forma` que o diorama usa:
// corpo + telhado de duas águas com beiral + chaminés + os acentos que a
// forma declara (a marquise da loja, as pás do moinho). Coordenadas em
// unidades de maquete multiplicadas pela unidade da prancha; o grupo já
// chega transladado e escalado pela profundidade.
// ---------------------------------------------------------------------
function Silhueta({ forma, u, cenario = false }) {
  const laje = forma.h < 0.2;
  const meia = (forma.w / 2) * u;
  const beiral = (forma.w / 2 + forma.beiral) * u;
  const alto = forma.h * u;
  const cume = (forma.h + forma.telhadoAltura) * u;
  const traco = cenario ? 0.75 : 1.25;
  const opacidade = cenario ? 0.62 : 1;
  if (laje) {
    // Logradouro: chão murado, sem fachada nem telhado (o pátio, o adro).
    return (
      <g opacity={opacidade}>
        <path
          d={`M${-meia} 0 L${meia} 0 L${meia * 0.8} ${-alto - 3} L${-meia * 0.8} ${-alto - 3} Z`}
          fill="url(#prancha-hachura-fina)"
          stroke={TINTA}
          strokeWidth={0.7}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    );
  }
  return (
    <g opacity={opacidade}>
      {/* Corpo */}
      <rect
        x={-meia}
        y={-alto}
        width={meia * 2}
        height={alto}
        fill={PAPEL_PAREDE}
        stroke={TINTA}
        strokeWidth={traco}
        vectorEffect="non-scaling-stroke"
      />
      {/* Telhado de duas águas com beiral — a água em hachura */}
      <path
        d={`M${-beiral} ${-alto} L0 ${-cume} L${beiral} ${-alto} Z`}
        fill="url(#prancha-hachura)"
        stroke={TINTA}
        strokeWidth={traco}
        vectorEffect="non-scaling-stroke"
      />
      {/* Chaminés */}
      {forma.chamines?.map((c, i) => (
        <rect
          key={i}
          x={(c.x - 0.055) * u}
          y={-(forma.h + c.alt) * u}
          width={0.11 * u}
          height={c.alt * u}
          fill={PAPEL_PAREDE}
          stroke={TINTA}
          strokeWidth={0.8}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {/* A marquise da loja (o toldo sobre a vitrine) */}
      {forma.marquise && (
        <path
          d={`M${-meia * 0.86} ${-alto * 0.52} L${meia * 0.86} ${-alto * 0.52} L${meia * 0.7} ${-alto * 0.3} L${-meia * 0.7} ${-alto * 0.3} Z`}
          fill="url(#prancha-hachura-fina)"
          stroke={TINTA}
          strokeWidth={0.8}
          vectorEffect="non-scaling-stroke"
        />
      )}
      {/* As pás do moinho, em cruz na fachada */}
      {forma.moinho && (
        <g
          stroke={TINTA}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          transform={`translate(0 ${-forma.h * 0.82 * u})`}
        >
          <path
            d={`M${-0.42 * u} ${-0.42 * u} L${0.42 * u} ${0.42 * u} M${0.42 * u} ${-0.42 * u} L${-0.42 * u} ${0.42 * u}`}
            fill="none"
          />
          <circle cx={0} cy={0} r={0.07 * u} fill={PAPEL_PAREDE} />
        </g>
      )}
      {/* Porta */}
      <rect
        x={(-forma.w * 0.22 - 0.08) * u}
        y={-0.32 * u}
        width={0.16 * u}
        height={0.3 * u}
        fill={TINTA}
        opacity={0.85}
      />
    </g>
  );
}

// As janelas da fachada, no MESMO arranjo do prédio 3D (uma na frente,
// uma segunda nos prédios largos) — a ordem dos índices importa: é ela
// que a hora usa para acender uma e não outra (E2).
function Janelas({ forma, u, acesa }) {
  if (forma.h < 0.2) return null;
  const vaos = [{ i: 0, cx: forma.w * 0.18 }];
  if (forma.w > 1.1) vaos.push({ i: 1, cx: -forma.w * 0.02 });
  return (
    <>
      {vaos.map(({ i, cx }) => (
        <rect
          key={i}
          x={(cx - 0.065) * u}
          y={-(forma.h * 0.55 + 0.08) * u}
          width={0.13 * u}
          height={0.16 * u}
          fill={acesa && acesa(i) ? '#f2b03d' : PAPEL_VIDRO}
          stroke={TINTA}
          strokeWidth={0.7}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------
export default function PranchaVila({ aoAbrirNo }) {
  const localidadeAtual = useJogo((s) => s.localidadeAtual);
  const nosDesbloqueados = useJogo((s) => s.nosDesbloqueados);
  const nosNovos = useJogo((s) => s.nosNovos);
  const overlayAberto = useJogo((s) => s.overlay) !== null;

  const refPalco = useRef(null);
  const caixa = useCaixaViva(refPalco);

  // As etiquetas são HTML de largura viva (o nome do nó é prosa, e a vila
  // gerada tem nomes compridos): o arranjo trabalha com a caixa MEDIDA de
  // cada uma. A medição corre a cada layout, mas o setter DEVOLVE A MESMA
  // REFERÊNCIA quando nada mudou — o mesmo cinto que domou o laço de
  // re-render do desobstrutor do diorama. Converge num render extra: a
  // caixa depende do texto, nunca da posição.
  const refsEtiqueta = useRef(new Map());
  const [medidas, setMedidas] = useState({});
  useLayoutEffect(() => {
    const novas = {};
    for (const [id, el] of refsEtiqueta.current) {
      if (el) novas[id] = { largura: el.offsetWidth, altura: el.offsetHeight };
    }
    setMedidas((atuais) => {
      const chaves = Object.keys(novas);
      const iguais =
        chaves.length === Object.keys(atuais).length &&
        chaves.every(
          (k) =>
            atuais[k] && atuais[k].largura === novas[k].largura && atuais[k].altura === novas[k].altura
        );
      return iguais ? atuais : novas;
    });
  });

  // A fonte da vila: o campo visual do pacote (caso gerado) ou o mapa
  // espacial estático (caso-escola) — a mesma dupla do diorama.
  const maquete = obterMaquete();
  const posicoes = maquete ? maquete.posicoes : POSICOES_DIORAMA;
  const formaDoNo = (pos) =>
    (maquete ? maquete.formas[pos.predio] : FORMAS_PREDIO[pos.predio]) || FORMAS_PREDIO.estalagem;

  const locsVisiveis = useMemo(
    () => (maquete ? obterLocalidades() : LOCALIDADES).filter((loc) => nosDesbloqueados.includes(loc.id)),
    [maquete, nosDesbloqueados]
  );
  const distanteVisivel = maquete
    ? nosDesbloqueados.some((id) => posicoes[id]?.distante)
    : nosDesbloqueados.includes('gabinete_pettigrew');
  const estrada = distanteVisivel ? (maquete ? maquete.estrada || null : ESTRADA_MOORFORD) : null;
  const tabua = maquete
    ? { centroX: maquete.tabua.centroX, larguraTabua: maquete.tabua.largura, fundoTabua: maquete.tabua.fundo }
    : { centroX: MAQUETE.centroX, larguraTabua: MAQUETE.larguraTabua, fundoTabua: MAQUETE.fundoTabua };

  const idsVisiveis = locsVisiveis.map((l) => l.id).filter((id) => posicoes[id]);
  const cenario = maquete ? maquete.cenario.filter((c) => maquete.formas[c.predio]) : [];

  const proj = useMemo(
    () => projetarVila({ posicoes, tabua, ids: idsVisiveis, cenario, estrada }),
    // posicoes/tabua/cenario são estáveis por caso (módulo do pacote); a
    // projeção só muda quando um nó novo entra em cena.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idsVisiveis.join('|'), !!estrada]
  );

  // A folha: a prancha inteira cabe no palco, sem distorção e sem corte.
  // A gravura é o miolo; em volta fica o papel, com a linha de cabeça
  // impressa no alto (o quadro é a estampa, a folha é o suporte).
  const proporcao = QUADRO.largura / QUADRO.altura;
  const larguraDisponivel = Math.max(0, caixa.largura - 16 - MARGEM_FOLHA.x * 2);
  const alturaDisponivel = Math.max(0, caixa.altura - 16 - MARGEM_FOLHA.topo - MARGEM_FOLHA.pe);
  const gravuraLargura = Math.min(larguraDisponivel, alturaDisponivel * proporcao);
  const gravuraAltura = gravuraLargura / proporcao;
  const escalaTela = gravuraLargura / QUADRO.largura;

  const rotulosVisiveis = locsVisiveis.map((l) => l.rotuloMesa);

  // As etiquetas: âncora no alto de cada prédio, em px de tela, e o
  // escalonamento puro que impede que uma pise na outra.
  // A moldura em que uma etiqueta pode cair: dentro da folha, sempre.
  const maiorCaixa = Object.values(medidas).reduce(
    (m, c) => ({ largura: Math.max(m.largura, c.largura), altura: Math.max(m.altura, c.altura) }),
    CAIXA_ETIQUETA
  );
  const limitesEtiqueta = {
    topo: maiorCaixa.altura + 2,
    base: Math.max(maiorCaixa.altura + 2, gravuraAltura - 6),
    esquerda: maiorCaixa.largura / 2 + 2,
    direita: Math.max(maiorCaixa.largura / 2 + 2, gravuraLargura - maiorCaixa.largura / 2 - 2),
  };
  const ancoras = proj.nos.map((n) => {
    const forma = formaDoNo(posicoes[n.id]);
    // Acima da cumeeira E do letreiro gravado na fachada: a etiqueta de
    // papel nunca cobre o desenho nem o nome que já está impresso nele.
    const cumeeira = (n.sy - (forma.h + forma.telhadoAltura) * proj.unidade * n.escala - 11) * escalaTela;
    const topo = Math.min(limitesEtiqueta.base, Math.max(limitesEtiqueta.topo, cumeeira));
    const caixa = medidas[n.id] || CAIXA_ETIQUETA;
    return {
      id: n.id,
      x: n.sx * escalaTela,
      y: topo - 10,
      topo,
      largura: caixa.largura + 10,
      altura: caixa.altura + 8,
    };
  });
  const postos = arrumarEtiquetas(ancoras, limitesEtiqueta);
  const ancoraPorId = new Map(ancoras.map((a) => [a.id, a]));
  // As ETIQUETAS saem no DOM na ordem do hub (a do pacote), não na ordem
  // de desenho (que é por profundidade). Contrato do qa-ui: o QA — e o
  // leitor de tela — alcançam os nós POR TEXTO, e dois rótulos podem
  // partilhar prefixo ("Cottage nº 4" e "Cottage nº 4 — a busca"); quem
  // vem primeiro no documento tem de ser sempre o mesmo nó.
  const porId = new Map(proj.nos.map((n) => [n.id, n]));
  const ordemDoHub = locsVisiveis.map((loc) => porId.get(loc.id)).filter(Boolean);

  // A escala gráfica: quanto de prancha uma hora de caminhada cobre.
  const regua = escalaGrafica({
    posicoes,
    ids: Object.keys(posicoes),
    custoDe: custoViagem,
    unidade: proj.unidade,
  });

  return (
    <div ref={refPalco} className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {gravuraLargura > 0 && (
        <div
          className="prancha-folha relative"
          data-prancha
          style={{
            width: gravuraLargura + MARGEM_FOLHA.x * 2,
            height: gravuraAltura + MARGEM_FOLHA.topo + MARGEM_FOLHA.pe,
            padding: `${MARGEM_FOLHA.topo}px ${MARGEM_FOLHA.x}px ${MARGEM_FOLHA.pe}px`,
          }}
        >
          {/* A cabeça impressa da folha. O NOME da vila não entra aqui: ele
              pertence ao pacote da seed, e cravá-lo acertaria um caso e
              erraria os outros trinta e um (sistema-visual §9). */}
          <p className="prancha-cabeca">
            A VILA <span className="prancha-cabeca-nota">— prancha do perito</span>
          </p>
          <div className="relative" style={{ width: gravuraLargura, height: gravuraAltura }}>
          <svg
            viewBox={`0 0 ${QUADRO.largura} ${QUADRO.altura}`}
            className="absolute inset-0 h-full w-full"
            aria-label="A vila do caso, em prancha de gravura"
          >
            <defs>
              {/* Hachura: a luz da gravura é traço, nunca cinza chapado. */}
              <pattern id="prancha-hachura" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
                <line x1="0" y1="0" x2="0" y2="5" stroke={TINTA} strokeWidth="0.62" opacity="0.5" />
              </pattern>
              <pattern id="prancha-hachura-fina" width="4.6" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
                <line x1="0" y1="0" x2="0" y2="4.6" stroke={TINTA} strokeWidth="0.55" opacity="0.36" />
              </pattern>
              <pattern id="prancha-ceu" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
                <line x1="0" y1="0" x2="0" y2="7" stroke={TINTA} strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>

            {/* A moldura do quadro gravado e o céu hachurado */}
            <rect
              x={MOLDURA.x}
              y={MOLDURA.y}
              width={MOLDURA.largura}
              height={MOLDURA.altura}
              fill="none"
              stroke={TINTA}
              strokeWidth="1.2"
              opacity="0.55"
            />
            <rect
              x={proj.quadro.x}
              y={proj.quadro.y}
              width={proj.quadro.largura}
              height={proj.quadro.altura}
              fill="url(#prancha-ceu)"
            />

            {/* A vila: horizonte, caminho de terra, casario e nós, de trás
                para diante (a ordem de desenho da projeção). */}
            <g>
              <line
                x1={proj.quadro.x + 2}
                y1={proj.horizonte}
                x2={proj.quadro.x + proj.quadro.largura - 2}
                y2={proj.horizonte}
                stroke={TINTA}
                strokeWidth="0.9"
                opacity="0.6"
              />
              <path
                d={`M${proj.quadro.x + 2} ${proj.beira + 14} Q ${proj.quadro.x + proj.quadro.largura / 2} ${proj.beira + 4} ${proj.quadro.x + proj.quadro.largura - 2} ${proj.beira + 12}`}
                fill="none"
                stroke={TINTA}
                strokeWidth="0.7"
                opacity="0.45"
              />
              {/* A estrada do nó distante, quando o lead já a abriu */}
              {proj.estrada && proj.estrada.length > 1 && (
                <path
                  d={proj.estrada.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx} ${p.sy}`).join(' ')}
                  fill="none"
                  stroke={TINTA}
                  strokeWidth="1.4"
                  opacity="0.7"
                  strokeLinecap="round"
                />
              )}
              {proj.cenario.map((c) => (
                <g key={`cen_${c.chave}`} transform={`translate(${c.sx} ${c.sy}) scale(${c.escala})`}>
                  <Silhueta forma={maquete.formas[c.chave]} u={proj.unidade} cenario />
                </g>
              ))}
              {proj.nos.map((n) => {
                const pos = posicoes[n.id];
                const forma = formaDoNo(pos);
                const loc = locsVisiveis.find((l) => l.id === n.id);
                const letreiro = letreiroDaFachada(loc?.rotuloMesa, rotulosVisiveis);
                return (
                  <g key={n.id} transform={`translate(${n.sx} ${n.sy}) scale(${n.escala})`}>
                    <Silhueta forma={forma} u={proj.unidade} />
                    <Janelas forma={forma} u={proj.unidade} />
                    {letreiro && forma.h >= 0.2 && (
                      <text
                        x={0}
                        y={-(forma.h + forma.telhadoAltura) * proj.unidade - 2}
                        textAnchor="middle"
                        fontFamily="Oswald, sans-serif"
                        fontSize={6.4}
                        letterSpacing="1.3"
                        fill={TINTA}
                        opacity="0.8"
                      >
                        {letreiro}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* A escala gráfica e a rosa dos ventos — a mobília da prancha */}
            {regua && (
              <g opacity="0.7">
                <line x1={20} y1={QUADRO.altura - 16} x2={20 + regua} y2={QUADRO.altura - 16} stroke={TINTA} strokeWidth="1.1" />
                <line x1={20} y1={QUADRO.altura - 20} x2={20} y2={QUADRO.altura - 12} stroke={TINTA} strokeWidth="1.1" />
                <line x1={20 + regua} y1={QUADRO.altura - 20} x2={20 + regua} y2={QUADRO.altura - 12} stroke={TINTA} strokeWidth="1.1" />
                <text
                  x={26 + regua}
                  y={QUADRO.altura - 13}
                  fontFamily="Oswald, sans-serif"
                  fontSize={7}
                  letterSpacing="1.6"
                  fill={TINTA}
                >
                  1H DE VILA
                </text>
              </g>
            )}
            <g opacity="0.65" transform={`translate(${QUADRO.largura - 30} ${QUADRO.altura - 30})`}>
              <circle cx="0" cy="0" r="10" fill="none" stroke={TINTA} strokeWidth="0.8" />
              <path d="M0 -13 L3 -3 L0 -6 L-3 -3 Z" fill={TINTA} />
              <path d="M0 8 L0 3 M-8 0 L-3 0 M8 0 L3 0" stroke={TINTA} strokeWidth="0.7" />
              <text x="0" y="-15" textAnchor="middle" fontFamily="Oswald, sans-serif" fontSize={6.5} fill={TINTA}>
                N
              </text>
            </g>
          </svg>

          {/* Os cordões: o fio que amarra cada etiqueta à sua fachada. Camada
              própria, em px de tela, porque a etiqueta pode ter sido empurrada
              para cima OU para baixo pelo arranjo — o fio segue nos dois
              sentidos, e o nó de latão fica sempre no telhado. */}
          <svg
            className="pointer-events-none absolute inset-0"
            width={gravuraLargura}
            height={gravuraAltura}
            aria-hidden
          >
            {ordemDoHub.map((n) => {
              const ancora = ancoraPorId.get(n.id);
              const posto = postos[n.id];
              return (
                <g key={`cordao_${n.id}`}>
                  <line
                    x1={posto.x}
                    y1={posto.y}
                    x2={ancora.x}
                    y2={ancora.topo + 4}
                    stroke="#5a4a2f"
                    strokeWidth="1"
                    opacity="0.75"
                  />
                  <circle cx={ancora.x} cy={ancora.topo + 4} r="2.4" fill="#8a6d3b" />
                </g>
              );
            })}
          </svg>

          {/* As etiquetas dos nós: HTML REAL sobre a gravura (nunca <text>)
              — mesmo texto, mesmo handler e mesmo alvo de toque do diorama.
              Ficam fora da silhueta, presas por cordão, para nunca cobrir a
              fachada nem o letreiro gravado. */}
          {ordemDoHub.map((n) => {
            const loc = locsVisiveis.find((l) => l.id === n.id);
            if (!loc) return null;
            const custo = localidadeAtual ? custoViagem(localidadeAtual, loc.id) : 0;
            return (
              <div
                key={n.id}
                ref={(el) => {
                  // Mede o PAPEL, não a tag inteira: medir o que o arranjo
                  // move realimentaria o arranjo com a própria saída.
                  if (el) refsEtiqueta.current.set(n.id, el.querySelector('.rotulo-papel'));
                  else refsEtiqueta.current.delete(n.id);
                }}
                className="prancha-etiqueta absolute"
                style={{
                  left: postos[n.id].x,
                  top: postos[n.id].y,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <RotuloNo
                  loc={loc}
                  aqui={loc.id === localidadeAtual}
                  novo={nosNovos.includes(loc.id)}
                  custo={custo}
                  interativo={!overlayAberto}
                  aoClicar={() => aoAbrirNo(loc)}
                />
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}
