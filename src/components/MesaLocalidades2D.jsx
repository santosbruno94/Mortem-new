import { useCallback, useEffect, useRef, useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { obterLocalidades, custoViagem, obterDialogo } from '../data/pacote_caso.js';
import { formatDuracao } from '../logic/tempo.js';
import { resumoVisita } from '../logic/resumoVisita.js';
import { textoLembreteVisita } from '../logic/lembreteTexto.js';
import { suspeitosComDialogo, todasCartasDaPessoa } from '../logic/fichaPessoa.js';
import CartaMesa from './CartaMesa.jsx';
import RetratoPersonagem from './RetratoPersonagem.jsx';

// =====================================================================
// A SUPERFÍCIE 2D DA MESA — extraída da Escrivaninha para servir a dois
// modos: como a mesa completa (grade de localidades + fichas de pessoa),
// que é o FALLBACK OBRIGATÓRIO quando não há WebGL (?flat=1, sonda
// falhou ou o 3D quebrou); e como a bandeja de fichas sob o diorama
// (comDiorama: as localidades moram na maquete 3D e aqui ficam só as
// fichas de pessoa). Grade responsiva, arrasto livre.
// =====================================================================

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
  const nosVisitados = useJogo((s) => s.nosVisitados);
  const abrirOverlay = useJogo((s) => s.abrirOverlay);

  // A grade de repouso acompanha a largura da mesa: em tela estreita as
  // cartas se arrumam em menos colunas, e a superfície rola na vertical.
  const refMesa = useRef(null);
  const larguraMesa = useLarguraViva(refMesa);
  const locsVisiveis = comDiorama
    ? []
    : obterLocalidades().filter((loc) => nosDesbloqueados.includes(loc.id));
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
  // Fichas de pessoa (P11): substituem os pergaminhos de evidência na mesa.
  // Só os suspeitos com árvore de diálogo (o elenco interrogável).
  const pessoas = suspeitosComDialogo();
  const posPessoas = pessoas.map(
    (p, i) => posicoesCartas[`pessoa_${p.id}`] || posicaoPadraoCarta(i)
  );
  // Altura rolável da superfície: alcança a carta mais baixa, com folga para
  // a última fileira respirar acima do rodapé da escrivaninha (achado A8).
  const alturaConteudo = Math.max(
    comDiorama ? 200 : 440,
    ...[...posLoc, ...posPessoas].map((p) => p.y + 184)
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
        // Lembrete de visita: um local já visitado (e que não é o atual)
        // recorda quem recebeu o perito e quantas observações ficaram.
        const lembrete =
          nosVisitados.includes(loc.id) && !aqui
            ? textoLembreteVisita(resumoVisita(loc.id, cartasRegistradas))
            : '';
        return (
          <CartaMesa key={loc.id} id={`loc_${loc.id}`} pos={posLoc[i]} aoClicar={() => aoAbrirNo(loc)}>
            {/* Etiqueta de atlas: cada nó é uma etiqueta de pergaminho pousada
                na prancha da vila — a mesma língua das tags do diorama 3D
                (edição de imprensa 1b). Tinta escura sobre creme; verbo em
                condensada, nome na voz do documento. Aqui = fio de cera;
                novo = pingo de lacre. */}
            <div
              className={`carta-pergaminho w-40 rounded-sm px-3 py-2.5 ${
                novo ? 'ring-1 ring-cera shadow-vela-viva' : aqui ? 'ring-1 ring-[#7a2e12]' : ''
              }`}
            >
              <p className="font-rotulo text-[10px] tracking-[0.2em] uppercase text-tinta-apagada">
                {obterDialogo(loc.id) ? 'Interrogar' : 'Examinar'}
                {novo && (
                  <span className="normal-case tracking-normal text-cera">
                    {' '}
                    {/* Lacre de novidade: um pingo de cera ao lado do aviso */}
                    <span className="selo-cera w-2 h-2 inline-block align-baseline" aria-hidden />{' '}
                    novo
                  </span>
                )}
              </p>
              <p className="font-serif text-tinta mt-1 leading-snug">{loc.rotuloMesa}</p>
              <p
                className={`text-[10px] mt-2 tracking-wide ${
                  aqui ? 'text-[#7a2e12] font-semibold' : 'text-tinta-apagada'
                }`}
              >
                {aqui ? '— aqui —' : custo === 0 ? 'a um passo' : `viajar · ${formatDuracao(custo)}`}
              </p>
              {lembrete && (
                <p className="rotulo-lembrete font-serif italic text-[10px] mt-1 leading-snug text-[#7a5c34]">
                  visitado · {lembrete}
                </p>
              )}
            </div>
          </CartaMesa>
        );
      })}

      {/* Fichas de pessoa (P11): cada suspeito interrogável tem um cartão
          na mesa. Clicar abre o dossiê (overlay fichapessoa). */}
      {pessoas.map((pessoa, i) => {
        const nCartas = todasCartasDaPessoa(pessoa.id, cartasRegistradas).length;
        return (
          <CartaMesa
            key={pessoa.id}
            id={`pessoa_${pessoa.id}`}
            pos={posPessoas[i]}
            aoClicar={() => abrirOverlay('fichapessoa', pessoa.id)}
          >
            {/* Carte de visite: a pessoa da vila num cartão de retrato — moldura
                de latão, gravura do genótipo, nome na voz do documento e a
                conta de provas em condensada (edição de imprensa 1b). */}
            <div
              className="carta-surgir w-44 rounded-sm px-3 py-3 bg-[#17110c] border border-latao/45 hover:border-latao shadow-pousado transition-colors"
              data-pessoa={pessoa.id}
              title="Abrir dossiê"
            >
              <div className="flex items-start gap-2.5">
                <RetratoPersonagem personagemId={pessoa.id} tamanho={36} className="shrink-0" />
                <div className="min-w-0">
                  <p className="font-serif text-[#f0dfb8] text-sm leading-snug">{pessoa.nome}</p>
                  <p className="text-[#9d907c] text-[10px] mt-0.5 leading-snug truncate">
                    {pessoa.relacao}
                  </p>
                </div>
              </div>
              {nCartas > 0 && (
                <p className="font-rotulo text-[9px] tracking-[0.12em] uppercase text-latao-claro mt-2">
                  {nCartas} {nCartas === 1 ? 'prova' : 'provas'}
                </p>
              )}
            </div>
          </CartaMesa>
        );
      })}

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
