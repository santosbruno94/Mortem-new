import { useJogo } from '../store/jogo.js';
import { obterInterferencias } from '../data/pacote_caso.js';
import { formatHoraComDia } from '../logic/tempo.js';

// =====================================================================
// A NOTÍCIA DA VILA (OS-S2 · Frente A) — o sinal do disparo de uma
// interferência, na chegada seguinte do perito à mesa.
//
// O playtest cego de 27/07 provou que o mecanismo inteiro funcionava e o
// jogador não o lia: o anúncio era uma linha no fim do Diário, e a ponte
// causal (`comoSoube`) não chegava ao jogador em momento nenhum. Este
// bloco traz os dois para a mesa, UMA VEZ por evento: o anúncio (que já
// está no Diário, onde permanece) e, em itálico, como a notícia pôde
// andar. NENHUM texto nomeia o AUTOR da interferência — a disciplina da
// OS-S1 fica: o aviso registra efeitos, e a autoria é leitura do jogador
// (R3). Lugares e canais (a torre, o correio) podem ser nomeados.
//
// Camada de apresentação pura: lê o estado de disparo e os textos do
// pacote; nenhuma regra lê este componente nem o campo `noticiasLidas`.
// =====================================================================
export default function NoticiaVila() {
  const disparadas = useJogo((s) => s.interferenciasDisparadas);
  const lidas = useJogo((s) => s.noticiasLidas);
  const arquivarNoticias = useJogo((s) => s.arquivarNoticias);
  const eventos = obterInterferencias();
  const pendentes = disparadas
    .filter((d) => !(lidas || []).includes(d.id))
    .map((d) => ({ ...d, evento: eventos.find((e) => e.id === d.id) }))
    .filter((p) => p.evento && p.evento.anuncio);
  // O `comoSoube` do banco GERADO ainda é nota de reconstituição com ids
  // internos («gen_…»); à mesa só sobe o que é prosa (o caso-escola). Sem
  // isto, id interno vazaria para a tela — a guarda do qa-ui proíbe.
  const comoSoubeLegivel = (texto) => !!texto && !/\bgen_/.test(texto);
  // O comoSoube é prosa de meio de frase (nasce minúsculo); como parágrafo
  // autônomo em tela, ganha a maiúscula e o ponto na renderização — a
  // string revisada da OS-S1 fica intacta no dado.
  const comoFrase = (texto) => `${texto.charAt(0).toUpperCase()}${texto.slice(1)}.`;
  if (pendentes.length === 0) return null;
  return (
    <div
      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-[min(92%,36rem)] pointer-events-none"
      data-noticia-vila
      role="status"
    >
      <div className="pointer-events-auto bg-[#e9dfc6] text-stone-900 border border-black/50 rounded-sm shadow-lg px-3 py-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-serif text-[10px] tracking-widest uppercase text-stone-600">
            Correu palavra na vila
          </span>
          <button
            type="button"
            onClick={arquivarNoticias}
            className="text-[11px] font-serif underline text-stone-600 hover:text-stone-900"
          >
            ciente
          </button>
        </div>
        {pendentes.map((p) => (
          <div key={p.id} className="mt-1.5 first:mt-1">
            <p className="font-serif text-sm leading-snug">
              {p.evento.anuncio}{' '}
              {/* Com dia: o inquérito cruza a meia-noite, e «1h00» sem data
                  seria ambíguo (fiscal-continuidade, 27/07). */}
              <span className="text-stone-500 text-xs whitespace-nowrap">— {formatHoraComDia(p.hora)}</span>
            </p>
            {comoSoubeLegivel(p.evento.gatilho?.comoSoube) && (
              <p className="font-serif text-xs italic text-stone-600 mt-0.5">
                {comoFrase(p.evento.gatilho.comoSoube)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
