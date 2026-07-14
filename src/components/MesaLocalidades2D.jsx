import { useCallback, useEffect, useRef, useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { LOCALIDADES } from '../data/localidades.js';
import { custoViagem } from '../data/mapa.js';
import { obterDialogo } from '../data/dialogos.js';
import { formatDuracao } from '../logic/tempo.js';
import CartaMesa from './CartaMesa.jsx';

// =====================================================================
// A SUPERFÍCIE 2D DA MESA — extraída da Escrivaninha para servir a dois
// modos: como a mesa completa (grade de localidades + cartas), que é o
// FALLBACK OBRIGATÓRIO quando não há WebGL (?flat=1, sonda falhou ou o
// 3D quebrou); e como a bandeja de cartas sob o diorama (comDiorama:
// as localidades moram na maquete 3D e aqui ficam só as cartas).
// Comportamento idêntico ao original: grade responsiva, arrasto livre.
// =====================================================================

const ROTULOS_DOMINIO = {
  temporal: 'Temporal',
  causal: 'Causal',
  ambiental: 'Ambiental',
  comportamental: 'Comportamental',
  vestigio: 'Vestígio',
};

// Ordem de repouso das cartas na mesa (Q9): agrupadas por domínio — o corpo
// primeiro, depois causa, vestígios, cena e pessoas. Estável dentro do grupo
// (ordem de coleta). Só muda o ARRUMO padrão; o arrasto continua livre.
const ORDEM_DOMINIO = { temporal: 0, causal: 1, vestigio: 2, ambiental: 3, comportamental: 4 };
function ordenarPorDominio(cartas) {
  return [...cartas].sort(
    (a, b) => (ORDEM_DOMINIO[a.tagsOcultas.dominio] ?? 9) - (ORDEM_DOMINIO[b.tagsOcultas.dominio] ?? 9)
  );
}

// Passos da grade de repouso (antes de o jogador arrastar). O número de
// colunas é derivado da largura real da mesa — em celular cabem menos.
const PASSO_LOC = { x: 170, y: 120 };
const PASSO_CARTA = { x: 190, y: 130 };
const MARGEM_MESA = 16;

// Largura viva de um elemento (a mesa), para a grade acompanhar a tela.
function useLarguraViva(ref) {
  const [largura, setLargura] = useState(() => window.innerWidth);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new ResizeObserver(() => setLargura(el.clientWidth));
    observador.observe(el);
    setLargura(el.clientWidth);
    return () => observador.disconnect();
  }, [ref]);
  return largura;
}

export default function MesaLocalidades2D({ aoAbrirNo, comDiorama = false }) {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const posicoesCartas = useJogo((s) => s.posicoesCartas);
  const localidadeAtual = useJogo((s) => s.localidadeAtual);
  const nosDesbloqueados = useJogo((s) => s.nosDesbloqueados);
  const nosNovos = useJogo((s) => s.nosNovos);
  const abrirFicha = useJogo((s) => s.abrirFicha);
  const ultimaCartaPousada = useJogo((s) => s.ultimaCartaPousada);

  // A grade de repouso acompanha a largura da mesa: em tela estreita as
  // cartas se arrumam em menos colunas, e a superfície rola na vertical.
  const refMesa = useRef(null);
  const larguraMesa = useLarguraViva(refMesa);
  const locsVisiveis = comDiorama ? [] : LOCALIDADES.filter((loc) => nosDesbloqueados.includes(loc.id));
  const colunasLoc = Math.max(1, Math.floor((larguraMesa - MARGEM_MESA) / PASSO_LOC.x));
  const colunasCarta = Math.max(1, Math.floor((larguraMesa - MARGEM_MESA) / PASSO_CARTA.x));
  const linhasLoc = Math.max(1, Math.ceil(locsVisiveis.length / colunasLoc));
  // Em tela estreita o relógio de bolso ocupa o canto superior — a grade
  // de repouso começa abaixo dele para nada nascer encoberto. Sob o
  // diorama o relógio fica sobre a maquete: as cartas nascem no topo.
  const yInicial = !comDiorama && larguraMesa < 480 ? 84 : 12;
  const yBaseCartas = comDiorama ? yInicial : yInicial + linhasLoc * PASSO_LOC.y + 18;

  const posicaoPadraoLocalidade = (i) => ({
    x: MARGEM_MESA + (i % colunasLoc) * PASSO_LOC.x,
    y: yInicial + Math.floor(i / colunasLoc) * PASSO_LOC.y,
  });
  const posicaoPadraoCarta = (i) => ({
    x: MARGEM_MESA + (i % colunasCarta) * PASSO_CARTA.x,
    y: yBaseCartas + Math.floor(i / colunasCarta) * PASSO_CARTA.y,
  });

  const posLoc = locsVisiveis.map(
    (loc, i) => posicoesCartas[`loc_${loc.id}`] || posicaoPadraoLocalidade(i)
  );
  const cartasOrdenadas = ordenarPorDominio(cartasRegistradas);
  const posCartas = cartasOrdenadas.map(
    (carta, i) => posicoesCartas[carta.id] || posicaoPadraoCarta(i)
  );
  // Altura rolável da superfície: alcança a carta mais baixa, com folga para
  // a última fileira respirar acima do rodapé da escrivaninha (achado A8).
  const alturaConteudo = Math.max(
    comDiorama ? 200 : 440,
    ...[...posLoc, ...posCartas].map((p) => p.y + 184)
  );

  // Afordância de rolagem (A8): quando há cartas abaixo da dobra, a borda
  // inferior esmaece — anuncia que a mesa continua. Puro efeito visual.
  const [maisAbaixo, setMaisAbaixo] = useState(false);
  const medirDobra = useCallback(() => {
    const el = refMesa.current;
    if (!el) return;
    setMaisAbaixo(el.scrollHeight - el.scrollTop - el.clientHeight > 16);
  }, []);
  useEffect(() => {
    medirDobra();
  }, [medirDobra, alturaConteudo, larguraMesa]);

  return (
    <div
      ref={refMesa}
      onScroll={medirDobra}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden"
    >
      {/* Localidades são nós do mapa (§5/§7) — no modo 2D. Clicar VIAJA
          até lá; só a viagem gasta o relógio. O mapa CRESCE: só aparecem
          os nós desbloqueados (Moorford surge ao ler um lead). */}
      {locsVisiveis.map((loc, i) => {
        const aqui = loc.id === localidadeAtual;
        const novo = nosNovos.includes(loc.id);
        const custo = localidadeAtual ? custoViagem(localidadeAtual, loc.id) : 0;
        return (
          <CartaMesa key={loc.id} id={`loc_${loc.id}`} pos={posLoc[i]} aoClicar={() => aoAbrirNo(loc)}>
            <div
              className={`carta-papel w-40 bg-stone-900 border rounded-sm px-3 py-3 ${
                novo
                  ? 'border-vela/70 hover:border-vela-clara shadow-vela'
                  : 'border-latao/40 hover:border-latao/80'
              } ${aqui ? 'ring-1 ring-latao/40' : ''}`}
            >
              <p className="text-latao-claro/80 text-[10px] tracking-[0.25em] uppercase">
                {obterDialogo(loc.id) ? 'Interrogar' : 'Examinar'}
                {novo && (
                  <span className="text-amber-200 normal-case tracking-normal">
                    {' '}
                    {/* Lacre de novidade: um pingo de cera ao lado do aviso */}
                    <span className="selo-cera w-2 h-2 inline-block align-baseline" aria-hidden />{' '}
                    novo
                  </span>
                )}
              </p>
              <p className="font-serif text-amber-200 mt-1 leading-snug">{loc.rotuloMesa}</p>
              <p className="text-stone-300 text-[10px] mt-2 tracking-wide">
                {aqui ? '— aqui —' : custo === 0 ? 'a um passo' : `viajar · ${formatDuracao(custo)}`}
              </p>
            </div>
          </CartaMesa>
        );
      })}

      {/* Cartas extraídas e registradas — agrupadas por domínio (Q9),
          com papel e chegada em viravolta (Q7) */}
      {cartasOrdenadas.map((carta, i) => (
        <CartaMesa key={carta.id} id={carta.id} pos={posCartas[i]} aoClicar={() => abrirFicha(carta.id)}>
          {/* A prova é papel escrito: pergaminho claro, tinta escura —
              o claro que pousa sobre a mesa escura. Clicar reabre a ficha
              de coleta (CartaMesa distingue clique de arrasto). */}
          <div
            className={`carta-surgir carta-pergaminho w-44 rounded-sm px-3 py-3 ${
              carta.id === ultimaCartaPousada ? 'outline outline-2 outline-vela' : ''
            }`}
            title="Rever esta ficha"
          >
            <p className="text-cera text-rotulo uppercase">
              {ROTULOS_DOMINIO[carta.tagsOcultas.dominio]}
            </p>
            {/* Só a observação CRUA na face da carta — a interpretação é
                falada pelo legista, não carimbada (§6 do redesign). */}
            <p className="font-serif text-tinta text-sm mt-1 leading-snug">{carta.textoDisplay}</p>
          </div>
        </CartaMesa>
      ))}

      {/* Espaçador: garante que a rolagem alcance a carta mais baixa */}
      <div aria-hidden style={{ height: alturaConteudo }} />

      {/* A borda esmaecida que anuncia mais cartas abaixo da dobra (A8):
          fica presa ao pé da janela de rolagem e some ao alcançar o fim. */}
      <div
        aria-hidden
        className={`pointer-events-none sticky bottom-0 -mt-14 h-14 bg-gradient-to-t from-[#0b0906] to-transparent transition-opacity duration-300 ${
          maisAbaixo ? 'opacity-90' : 'opacity-0'
        }`}
      />
    </div>
  );
}
