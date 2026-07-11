import { useJogo } from '../store/jogo.js';
import { OPCOES_PERSONAGEM } from '../data/abertura.js';

// Tela inicial: escolha entre Dr. Harlan e Dr.ª Lenore Blackwell (§12)
export default function TelaPersonagem() {
  const escolherDetective = useJogo((s) => s.escolherDetective);

  return (
    <div className="altura-tela-min flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <h1 className="font-serif text-4xl sm:text-6xl tracking-[0.25em] sm:tracking-[0.35em] text-amber-200 text-center">MORTEM</h1>
      <p className="mt-3 text-stone-600 text-sm tracking-widest text-center">§ O Álibi de Corda — Briarstone, 1893 §</p>

      <p className="mt-12 mb-6 text-stone-400 text-sm tracking-wide">Quem atende ao chamado?</p>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        {OPCOES_PERSONAGEM.map((opcao) => (
          <button
            key={opcao.id}
            onClick={() => escolherDetective(opcao.id)}
            className="text-left bg-stone-900 border border-stone-800 hover:border-amber-900 rounded-sm p-4 sm:p-6 transition-colors group"
          >
            <h2 className="font-serif text-2xl text-amber-200 group-hover:text-amber-100">
              {opcao.nome}
            </h2>
            <div className="mt-2 mb-3 text-amber-900">―</div>
            <p className="text-stone-400 leading-relaxed text-sm">{opcao.descricao}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
