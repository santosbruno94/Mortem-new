import { useState } from 'react';
import { useJogo, CUSTO_REVISAO } from '../store/jogo.js';
import { gerarMonologo, comArtigo } from '../logic/monologo.js';
import { gerarEpilogo } from '../logic/epilogo.js';
import { LOCALIDADES } from '../data/localidades.js';
import { CARTAS } from '../data/cartas.js';
import { formatRelogio, formatHora, formatDuracao, HORAS_CHEGADA_CENA } from '../logic/tempo.js';
import { SUSPEITOS } from '../data/seed.js';
import { tocarSom } from '../som.js';
import Overlay from './Overlay.jsx';

// Frases universais de "o que faltou" — exceção pedagógica do tutorial
// (§13): após uma falha, o jogo mostra as lacunas e permite resubmissão.
// Cada dica pode ter dois níveis: `primeira` (a de sempre) e `reincidencia`,
// exibida quando o jogador cai no MESMO ponto pela segunda vez (falhasVistas
// no store). O marcador {nome} recebe o suspeito da falha, quando houver.
const DICAS_TUTORIAL = {
  reu_errado: {
    primeira: 'O réu apontado não resiste à perícia. Reexamine quem o corpo e os vestígios de fato acusam.',
  },
  corpo_sem_substancia: {
    primeira: 'Sustente a cadeia com evidências do corpo de valor pericial (sinais não inconclusivos).',
  },
  sem_janela: {
    primeira: 'Afirme a janela da morte e puxe até ela os indicadores (rigor, livor, algor, visto-vivo).',
  },
  janela_nao_cobre: {
    primeira: 'A janela afirmada erra a hora do óbito. Reúna sinais colhidos a tempo e refaça o juízo.',
  },
  janela_sem_sustentacao: {
    primeira:
      'A janela afirmada contradiz os sinais puxados à âncora Quando. Corrija a afirmação ou reveja essas ligações.',
  },
  janela_imprecisa: {
    primeira: 'A janela está larga. Mais sinais temporais colhidos cedo estreitam a convergência.',
  },
  sem_mecanismo: {
    primeira: 'Afirme a causa da morte e sustente-a com os sinais discriminantes do corpo.',
  },
  mecanismo_errado: {
    primeira: 'A causa afirmada contradiz os sinais do corpo. Reexamine o pescoço da vítima.',
  },
  sem_nexo: {
    primeira: 'Falta materialidade: puxe à âncora Presença o vestígio que põe o réu na cena.',
  },
  nexo_errado: {
    primeira: 'O vestígio ligado não casa com o instrumento do óbito.',
  },
  nexo_acessorio: {
    primeira: 'Um dos vestígios ligados à Presença não pertence ao réu — desfaça o barbante que sobra.',
  },
  sem_motivacao: {
    primeira: 'Aponte o móbil do réu — há papéis que falam por ele.',
  },
  motivacao_erronea: {
    primeira: 'O móbil apontado não é o que move o réu.',
  },
  sem_descuidos: {
    primeira: 'A cena tem descuidos a expor: confronte a hora que ela alega com a que o corpo dá.',
  },
  periferico: {
    primeira: 'Reveja o juízo sobre os não-acusados: cada um merece o veredicto que as cartas fundamentam.',
    reincidencia:
      'O juízo sobre {nome} voltou a cair. Escolher “Inocente” pede um gesto a mais, ali mesmo na ficha do juízo: confrontar o paradeiro declarado com o vestígio que o desmente, se esse vestígio estiver na sua mesa.',
  },
};

// Total de observações possíveis no caso: o catálogo + a carta de algor
// (gerada pela medição de temperatura).
const TOTAL_OBSERVACOES = CARTAS.length + 1;

export default function MonologoFinal() {
  const veredicto = useJogo((s) => s.veredicto);
  const detective = useJogo((s) => s.detective);
  const revisarAcusacao = useJogo((s) => s.revisarAcusacao);
  const reiniciarCaso = useJogo((s) => s.reiniciarCaso);
  const horasJogo = useJogo((s) => s.horasJogo);
  const nosVisitados = useJogo((s) => s.nosVisitados);
  const nosDesbloqueados = useJogo((s) => s.nosDesbloqueados);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const nSubmissoes = useJogo((s) => s.nSubmissoes);
  const falhasVistas = useJogo((s) => s.falhasVistas);
  const [encerrando, setEncerrando] = useState(false);

  if (!veredicto) return null;
  const vitoria = veredicto.tipo === 'vitoria_absoluta';
  // Enquanto a retentativa está de pé, o Erro Judiciário NÃO nomeia o
  // verdadeiro autor — o nome só sai no encerramento definitivo (Q2).
  const monologo = gerarMonologo(veredicto, detective, { nomearCulpado: false });

  // Dicas únicas, na ordem das falhas. Na segunda queda no mesmo ponto
  // (falhasVistas), a dica escala para a versão mais específica; {nome}
  // recebe o suspeito da falha, quando a falha o traz.
  const dicas = [
    ...new Set(
      veredicto.falhas
        .map((f) => {
          const dica = DICAS_TUTORIAL[f.codigo];
          if (!dica) return null;
          const reincidiu = (falhasVistas[f.codigo] || 0) >= 2;
          const texto = reincidiu && dica.reincidencia ? dica.reincidencia : dica.primeira;
          if (!texto.includes('{nome}')) return texto;
          const sp = SUSPEITOS.find((s) => s.id === f.suspeitoId);
          // comArtigo: nome titulado pede artigo em meio de frase ("a Sra. …"),
          // mesma convenção do monólogo vizinho.
          return sp ? texto.replaceAll('{nome}', comArtigo(sp.nome)) : null;
        })
        .filter(Boolean)
    ),
  ];

  // ---------------- O encerramento: epílogo + retrato (Q5) ----------------
  if (encerrando) {
    const epilogo = gerarEpilogo(veredicto, { horasSelo: horasJogo });
    const duracao = horasJogo - HORAS_CHEGADA_CENA;
    // O que ficou por abrir: só nós que o jogador CHEGOU a desbloquear —
    // nomear um lugar nunca revelado entregaria conteúdo de graça.
    const porVisitar = LOCALIDADES.filter(
      (loc) => nosDesbloqueados.includes(loc.id) && !nosVisitados.includes(loc.id)
    ).map((loc) => loc.rotuloMesa);
    return (
      <Overlay titulo={`${monologo.titulo} — Epílogo`} subtitulo="O caso, selado">
        {/* O título do desfecho vive no header do Overlay (serif, gravado);
            aqui, só o ornamento de abertura e o epílogo em coluna de leitura */}
        <div className="divisor-ornado text-sm mb-6" aria-hidden="true">❦</div>
        <div className="max-w-prose mx-auto space-y-4">
          {epilogo.blocos.map((b, i) => (
            <p key={i} className="font-serif text-stone-200 text-lg leading-relaxed">
              {b}
            </p>
          ))}
        </div>

        {/* O retrato da investigação: etiquetas de balanço, rotuladas a latão */}
        <div className="mt-8 max-w-prose mx-auto border border-latao/40 bg-stone-950/40 rounded-sm px-4 py-3">
          <p className="text-rotulo uppercase text-latao-claro/70 mb-2">
            O retrato da investigação
          </p>
          <ul className="space-y-1.5 text-sm text-stone-300">
            <li><span className="text-latao-claro/60" aria-hidden="true">―</span> Chegada às {formatHora(HORAS_CHEGADA_CENA)}; caso selado em {formatRelogio(horasJogo)} — {formatDuracao(duracao)} de investigação.</li>
            <li><span className="text-latao-claro/60" aria-hidden="true">―</span> {nosVisitados.length} de {LOCALIDADES.length} lugares visitados.</li>
            {porVisitar.length > 0 && (
              <li><span className="text-latao-claro/60" aria-hidden="true">―</span> Ficou por visitar: {porVisitar.join(', ')}.</li>
            )}
            <li><span className="text-latao-claro/60" aria-hidden="true">―</span> {cartasRegistradas.length} de {TOTAL_OBSERVACOES} observações registradas na mesa.</li>
            <li><span className="text-latao-claro/60" aria-hidden="true">―</span> {nSubmissoes === 1 ? 'Uma acusação levada a julgamento.' : `${nSubmissoes} acusações levadas a julgamento.`}</li>
          </ul>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              // O caderno fecha de vez: apaga o save antes do reload, para a
              // página recarregada cair no convite limpo (não na retomada).
              reiniciarCaso();
              window.location.reload();
            }}
            className="botao-mesa"
          >
            Fechar o caderno
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay titulo={monologo.titulo} subtitulo="O monólogo do detetive">
      {/* O clímax: o título gravado vem do header do Overlay; o monólogo
          desce em coluna de leitura serifada, confortável */}
      <div className="divisor-ornado text-sm mb-6" aria-hidden="true">❦</div>
      <div className="max-w-prose mx-auto space-y-4">
        {monologo.blocos.map((b, i) => (
          <p key={i} className="font-serif text-stone-200 text-lg leading-relaxed">
            {b}
          </p>
        ))}
      </div>

      {!vitoria && dicas.length > 0 && (
        <div className="mt-8 max-w-prose mx-auto border border-latao/40 bg-stone-950/40 rounded-sm px-4 py-3">
          <p className="text-rotulo uppercase text-latao-claro/80 mb-2">
            O que faltou — cortesia do tutorial
          </p>
          <ul className="space-y-1.5">
            {dicas.map((d, i) => (
              <li key={i} className="text-stone-300 text-sm leading-relaxed">
                <span className="text-latao-claro/60" aria-hidden="true">―</span> {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        {!vitoria && (
          <button
            onClick={revisarAcusacao}
            className="placa-latao px-5 py-2 rounded-sm font-serif text-sm tracking-wide"
          >
            Revisar a acusação · adia a audiência em {formatDuracao(CUSTO_REVISAO)}
          </button>
        )}
        <button
          onClick={() => {
            tocarSom('lacre');
            setEncerrando(true);
          }}
          className={vitoria ? 'botao-mesa' : 'botao-mesa botao-mesa--quieto'}
        >
          Encerrar o caso
        </button>
      </div>
    </Overlay>
  );
}
