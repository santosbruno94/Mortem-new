import { formatRelogio } from '../../logic/tempo.js';

// Peças partilhadas entre as estações do mural (camada visual pura).

// QOL do playtest de 19/07 (P7): toda prova exibida no mural declara QUANDO
// foi coletada — a data/hora já viaja com a carta (horaRegistro); aqui só se
// mostra. Não é resposta dada: é o registro do próprio perito.
export function CarimboColeta({ hora, clara = false }) {
  if (hora == null) return null;
  return (
    <span className={`block text-[9px] leading-tight mt-0.5 ${clara ? 'opacity-70' : 'text-tinta-apagada'}`}>
      coleta: {formatRelogio(hora)}
    </span>
  );
}

// Ficha de opção clicável (causa, réu, juízo…). O estado escolhido tem de
// gritar na cortiça: fio de latão, halo de vela e um pingo de lacre.
export function Opcao({ ativa, aoClicar, rotulo, sub = null }) {
  return (
    <button
      onClick={aoClicar}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border font-serif text-xs text-left transition-all duration-gesto ${
        ativa
          ? 'border-latao-claro bg-amber-950/40 text-amber-100 ring-1 ring-latao-claro/60 shadow-vela'
          : 'border-stone-700 bg-stone-900/60 text-stone-300 hover:text-amber-100 hover:border-latao/70'
      }`}
    >
      {ativa && <span className="selo-cera shrink-0 w-2 h-2" aria-hidden="true" />}
      <span>
        {rotulo}
        {sub && <span className="block text-[9px] leading-tight opacity-70">{sub}</span>}
      </span>
    </button>
  );
}
