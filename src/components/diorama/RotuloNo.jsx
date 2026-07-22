import { formatDuracao } from '../../logic/tempo.js';
// Lê do PACOTE CORRENTE (não do dialogos.js estático do caso-escola):
// se um caso gerado reutilizar ids de nó, o verbo sairia do caso errado
// (diagnóstico 21/07, M8).
import { obterDialogo } from '../../data/pacote_caso.js';
import { resumoVisita } from '../../logic/resumoVisita.js';
import { textoLembreteVisita } from '../../logic/lembreteTexto.js';
import { useJogo } from '../../store/jogo.js';

// =====================================================================
// A etiqueta de maquete de um nó — uma TAG DE PAPEL PENDENTE (amarrada
// por um cordão), HTML REAL sobre o canvas (via <Html> do drei): o texto
// continua selecionável pelo QA (`text=O Corpo`) e o clique dispara O
// MESMO handler do prédio. Mesmo conteúdo da antiga carta de localidade:
// verbo, rótulo, custo. O destaque de "novo" pulsa em CSS na própria tag
// (não no emissivo 3D) — assim não força o frameloop contínuo da maquete.
// =====================================================================
export default function RotuloNo({ loc, aqui, novo, custo, interativo, destacado, aoClicar, aoEntrar, aoSair }) {
  // O verbo segue a árvore de diálogo: nó com árvore própria é interrogatório
  // (camada visual lendo dado narrativo — o motor não participa).
  const verbo = obterDialogo(loc.id) ? 'Interrogar' : 'Examinar';
  // Lembrete de visita: se o perito já esteve aqui e não está aqui agora, a
  // etiqueta recorda quem o recebeu e quantas observações ficaram — para
  // decidir se vale voltar. Apresentação pura (não lê tagsOcultas).
  const visitado = useJogo((s) => s.nosVisitados.includes(loc.id));
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const lembrete = visitado && !aqui ? textoLembreteVisita(resumoVisita(loc.id, cartasRegistradas)) : '';
  return (
    <span className="rotulo-tag select-none">
      {/* O cordão que amarra a etiqueta à maquete (puro enfeite). */}
      <span className="rotulo-cordao" aria-hidden />
      <button
        onClick={interativo ? aoClicar : undefined}
        onPointerOver={interativo ? aoEntrar : undefined}
        onPointerOut={aoSair}
        className={`rotulo-papel ${novo ? 'rotulo-papel--novo' : destacado ? 'rotulo-papel--destaque' : ''} ${
          interativo ? 'cursor-pointer' : 'pointer-events-none'
        }`}
      >
        {/* Em tela estreita a etiqueta encolhe (menos colisão) mas o CUSTO
            fica: a economia de tempo é a decisão central do jogo e não pode
            sumir justo na tela onde se decide viajar (P2 do playtest). O
            verbo segue só em sm+; o QA joga em desktop, onde tudo aparece. */}
        <span className="hidden sm:block rotulo-verbo">
          {verbo}
          {novo && <span className="rotulo-novo-marca"> · novo</span>}
        </span>
        <span className="block rotulo-nome">
          {loc.rotuloMesa}
          {novo && <span className="sm:hidden rotulo-novo-marca"> · novo</span>}
        </span>
        <span className="block rotulo-custo">
          {aqui ? '— aqui —' : custo === 0 ? 'a um passo' : `viajar · ${formatDuracao(custo)}`}
        </span>
        {lembrete && <span className="block rotulo-lembrete">visitado · {lembrete}</span>}
      </button>
    </span>
  );
}
