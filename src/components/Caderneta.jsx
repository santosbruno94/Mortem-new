import { useJogo } from '../store/jogo.js';
import { formatRelogio } from '../logic/tempo.js';
import Overlay from './Overlay.jsx';

// Caderneta — o BANCO DE ANOTAÇÕES (§5): tudo que já foi observado fica
// gravado aqui para sempre, e reler não custa tempo (o relógio só pesa sobre
// o perecível AINDA não visto, lá fora). A observação fica congelada como
// foi vista — a degradação travou no momento da extração. Consulta gratuita.
//
// A Caderneta é LEMBRETE, não revelação (§6.2): a lista de observações é um
// diário compacto (carimbo + hora) que reabre a Ficha de Coleta — o exame de
// perto e a fala do legista moram na ficha, não mais aqui.
export default function Caderneta() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);
  const log = useJogo((s) => s.log);
  const abrirFicha = useJogo((s) => s.abrirFicha);

  return (
    <Overlay titulo="Caderneta" subtitulo="Banco de anotações — reler não custa tempo">
      {/* Observações reunidas — diário compacto; clicar reabre a ficha */}
      <h3 className="font-serif text-latao-claro text-lg titulo-gravado mb-3">Observações reunidas</h3>
      {cartasRegistradas.length === 0 ? (
        <p className="text-stone-400 italic font-serif text-sm mb-8">Nada foi observado ainda. Examine os locais.</p>
      ) : (
        <ul className="space-y-2 mb-8">
          {cartasRegistradas.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => abrirFicha(c.id)}
                title="Rever a ficha de coleta"
                className="w-full text-left carta-pergaminho rounded-sm px-4 py-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 hover:outline hover:outline-1 hover:outline-cera/50 transition-all duration-gesto"
              >
                <span className="text-tinta text-sm font-serif">{c.termoCarimbo}</span>
                <span className="text-tinta-apagada text-rotulo uppercase shrink-0">
                  {formatRelogio(c.horaRegistro)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* A leitura do legista (a "dica"): refaz-se sozinha a cada exame */}
      <h3 className="font-serif text-latao-claro text-lg titulo-gravado mb-3">Leitura do legista</h3>
      {conclusoes.length === 0 ? (
        <p className="text-stone-400 italic font-serif text-sm mb-8">O legista ainda não tem leitura — examine o corpo.</p>
      ) : (
        <ul className="space-y-3 mb-8">
          {conclusoes.map((c) => (
            <li key={c.id} className="carta-pergaminho rounded-sm px-4 py-3">
              <p className="text-tinta text-sm font-serif font-bold">{c.titulo}</p>
              <p className="text-tinta-clara text-sm mt-1">{c.resumo}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Diário da investigação — meta do caso: permanece escuro, sobre o couro */}
      <h3 className="font-serif text-latao-claro text-lg titulo-gravado mb-3">Diário da investigação</h3>
      {log.length === 0 ? (
        <p className="text-stone-400 italic font-serif text-sm">A página aguarda a primeira anotação.</p>
      ) : (
        <ul className="space-y-1">
          {log.map((entrada, i) => (
            <li key={i} className="text-sm text-stone-300">
              <span className="text-latao-claro/70">{formatRelogio(entrada.hora)} —</span> {entrada.texto}
            </li>
          ))}
        </ul>
      )}
    </Overlay>
  );
}
