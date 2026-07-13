import { formatDuracao } from '../../logic/tempo.js';

// =====================================================================
// A etiqueta de maquete de um nó do diorama — HTML REAL sobre o canvas
// (via <Html> do drei): o texto continua selecionável pelo QA
// (`text=O Corpo`) e o clique dispara O MESMO handler do prédio.
// Mesmo conteúdo da antiga carta de localidade: verbo, rótulo, custo.
// =====================================================================
export default function RotuloNo({ loc, aqui, novo, custo, interativo, destacado, aoClicar, aoEntrar, aoSair }) {
  const verbo = loc.id.startsWith('interrogatorio') ? 'Interrogar' : 'Examinar';
  return (
    <button
      onClick={interativo ? aoClicar : undefined}
      onPointerOver={interativo ? aoEntrar : undefined}
      onPointerOut={aoSair}
      className={`block select-none whitespace-nowrap text-left px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-sm border bg-stone-900/95 shadow-pousado transition-colors duration-gesto ${
        novo
          ? 'border-amber-500/80'
          : destacado
            ? 'border-amber-700'
            : 'border-amber-900/60'
      } ${interativo ? 'cursor-pointer' : 'pointer-events-none'}`}
    >
      {/* Em tela estreita a etiqueta encolhe para só o nome (menos colisão);
          o QA joga em desktop, onde tudo — inclusive o "· novo" — aparece. */}
      <span className="hidden sm:block text-amber-900 text-[8px] tracking-[0.25em] uppercase leading-tight">
        {verbo}
        {novo && <span className="text-amber-400 normal-case tracking-normal"> · novo</span>}
      </span>
      <span className="block font-serif text-amber-200 text-[10px] sm:text-xs leading-snug">
        {loc.rotuloMesa}
        {novo && <span className="sm:hidden text-amber-400"> · novo</span>}
      </span>
      {/* Piso de contraste do §3: texto informativo nunca abaixo de stone-400;
          aqui sobe a stone-300 (achado M5 do playtest de 13/07/2026). */}
      <span className="hidden sm:block text-stone-300 text-[9px] tracking-wide leading-tight mt-0.5">
        {aqui ? '— aqui —' : custo === 0 ? 'a um passo' : `viajar · ${formatDuracao(custo)}`}
      </span>
    </button>
  );
}
