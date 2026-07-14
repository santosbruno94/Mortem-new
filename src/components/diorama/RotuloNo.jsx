import { formatDuracao } from '../../logic/tempo.js';

// =====================================================================
// A etiqueta de maquete de um nó — uma TAG DE PAPEL PENDENTE (amarrada
// por um cordão), HTML REAL sobre o canvas (via <Html> do drei): o texto
// continua selecionável pelo QA (`text=O Corpo`) e o clique dispara O
// MESMO handler do prédio. Mesmo conteúdo da antiga carta de localidade:
// verbo, rótulo, custo. O destaque de "novo" pulsa em CSS na própria tag
// (não no emissivo 3D) — assim não força o frameloop contínuo da maquete.
// =====================================================================
export default function RotuloNo({ loc, aqui, novo, custo, interativo, destacado, aoClicar, aoEntrar, aoSair }) {
  const verbo = loc.id.startsWith('interrogatorio') ? 'Interrogar' : 'Examinar';
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
        {/* Em tela estreita a etiqueta encolhe para só o nome (menos colisão);
            o QA joga em desktop, onde tudo — inclusive o "· novo" — aparece. */}
        <span className="hidden sm:block rotulo-verbo">
          {verbo}
          {novo && <span className="rotulo-novo-marca"> · novo</span>}
        </span>
        <span className="block rotulo-nome">
          {loc.rotuloMesa}
          {novo && <span className="sm:hidden rotulo-novo-marca"> · novo</span>}
        </span>
        <span className="hidden sm:block rotulo-custo">
          {aqui ? '— aqui —' : custo === 0 ? 'a um passo' : `viajar · ${formatDuracao(custo)}`}
        </span>
      </button>
    </span>
  );
}
