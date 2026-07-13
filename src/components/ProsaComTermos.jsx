import { useJogo } from '../store/jogo.js';
import { SEED_TUTORIAL } from '../data/seed.js';
import { ipmAtual } from '../logic/tempo.js';
import { interpolar } from '../logic/interpolar.js';
import { obterDefinicaoCarta, resolverEstadoCarta } from '../data/cartas.js';

// =====================================================================
// renderProsa (§5, §7.1): o renderizador ÚNICO de prosa com termos
// clicáveis. Interpola {detective.campo}/{g:masc|fem} e troca cada
// marcador [[id]] pelo termo em negrito cujo clique extrai a carta
// (carimbo integrado, §6) — examinar não custa tempo (relógio mole).
//
// Compartilhado por EventoLocalidade (localidades/pontos) e
// InterrogatorioDialogo (falas do diálogo), para não duplicar o mesmo
// laço de marcadores em dois componentes. O estado degradável (IPM
// corrente) é resolvido aqui, no momento da renderização/extração.
// =====================================================================

// Um parágrafo de prosa. `className` mantém o estilo do chamador (a prosa
// das localidades pousa sobre o couro escuro em serif; o diálogo reusa).
export function ParagrafoProsa({
  texto,
  className = 'font-serif text-stone-300 leading-relaxed',
}) {
  const detective = useJogo((s) => s.detective);
  const horasJogo = useJogo((s) => s.horasJogo);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const extrairCarta = useJogo((s) => s.extrairCarta);
  const ipm = ipmAtual(horasJogo, SEED_TUTORIAL.horasMorteAntesChegada);

  const partes = interpolar(texto, detective).split(/(\[\[\w+\]\])/g);
  return (
    <p className={className}>
      {partes.map((parte, i) => {
        const marcador = parte.match(/^\[\[(\w+)\]\]$/);
        if (!marcador) return <span key={i}>{parte}</span>;
        const cartaId = marcador[1];
        return (
          <TermoCarta
            key={i}
            cartaId={cartaId}
            ipm={ipm}
            registrada={cartasRegistradas.some((c) => c.id === cartaId)}
            aoExtrair={extrairCarta}
          />
        );
      })}
    </p>
  );
}

// O termo em negrito: clicável enquanto não registrado; carimbado depois.
// Classes .termo-clicavel/.termo-extraido e data-carta-id são contrato do
// qa-ui.mjs (INTOCÁVEIS) — a extração vale igual na localidade e no diálogo.
function TermoCarta({ cartaId, ipm, registrada, aoExtrair }) {
  const definicao = obterDefinicaoCarta(cartaId);
  if (!definicao) return <span>{cartaId}</span>;
  const estado = resolverEstadoCarta(definicao, ipm);
  if (registrada) {
    return (
      <span data-carta-id={cartaId} className="termo-extraido" title="Já registrado na mesa">
        {estado.textoDisplay}
      </span>
    );
  }
  return (
    <span
      data-carta-id={cartaId}
      className="termo-clicavel"
      title="Examinar e registrar (não custa tempo)"
      onClick={() => aoExtrair(cartaId)}
    >
      {estado.textoDisplay}
    </span>
  );
}
