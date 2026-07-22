import { useJogo } from '../store/jogo.js';
import { obterVerdadeDeOuro, obterParametrosCena, obterDefinicaoCarta, resolverEstadoCarta } from '../data/pacote_caso.js';
import { ipmAtual } from '../logic/tempo.js';
import { interpolar } from '../logic/interpolar.js';

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
  const abrirFicha = useJogo((s) => s.abrirFicha);
  // A hora de chegada vem do pacote (11h nos internos gerados; variável no
  // externo) — o default 13h de ipmAtual é só do caso-escola (A3).
  const ipm = ipmAtual(horasJogo, obterVerdadeDeOuro().horasMorteAntesChegada, obterParametrosCena().horasChegada);

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
            detective={detective}
            registrada={cartasRegistradas.some((c) => c.id === cartaId)}
            aoExtrair={extrairCarta}
            aoReabrir={abrirFicha}
          />
        );
      })}
    </p>
  );
}

// O termo em negrito: clicável enquanto não registrado; depois de extraído,
// vira "link visitado" (roxo) que REABRE a ficha da carta ali mesmo, sem
// obrigar a voltar à mesa. Classes .termo-clicavel/.termo-extraido e
// data-carta-id são contrato do qa-ui.mjs (INTOCÁVEIS) — a extração vale igual
// na localidade e no diálogo.
function TermoCarta({ cartaId, ipm, detective, registrada, aoExtrair, aoReabrir }) {
  const definicao = obterDefinicaoCarta(cartaId);
  if (!definicao) return <span>{cartaId}</span>;
  const estado = resolverEstadoCarta(definicao, ipm);
  // Resource binding (FASE 4): o termo em negrito resolve slots de caso como
  // qualquer prosa. Sem slots no textoDisplay do tutorial, byte-idêntico.
  const rotulo = interpolar(estado.textoDisplay, detective);
  if (registrada) {
    return (
      <span
        data-carta-id={cartaId}
        className="termo-extraido"
        title="Reabrir a carta"
        onClick={() => aoReabrir(cartaId)}
      >
        {rotulo}
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
      {rotulo}
    </span>
  );
}
