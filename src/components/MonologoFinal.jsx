import { useState } from 'react';
import { useJogo, CUSTO_REVISAO } from '../store/jogo.js';
import { gerarMonologo } from '../logic/monologo.js';
import { gerarEpilogo } from '../logic/epilogo.js';
import { LOCALIDADES } from '../data/localidades.js';
import { CARTAS } from '../data/cartas.js';
import { formatRelogio, formatHora, formatDuracao, HORAS_CHEGADA_CENA } from '../logic/tempo.js';
import { tocarSom } from '../som.js';
import Overlay from './Overlay.jsx';

// Frases universais de "o que faltou" — exceção pedagógica do tutorial
// (§13): após uma falha, o jogo mostra as lacunas e permite resubmissão.
const DICAS_TUTORIAL = {
  reu_errado: 'O réu apontado não resiste à perícia. Reexamine quem o corpo e os vestígios de fato acusam.',
  corpo_sem_substancia: 'Sustente a cadeia com evidências do corpo de valor pericial (sinais não inconclusivos).',
  sem_janela: 'Afirme a janela da morte e puxe até ela os indicadores (rigor, livor, algor, visto-vivo).',
  janela_nao_cobre: 'A janela afirmada erra a hora do óbito. Reúna sinais colhidos a tempo e refaça o juízo.',
  janela_imprecisa: 'A janela está larga. Mais sinais temporais colhidos cedo estreitam a convergência.',
  sem_mecanismo: 'Afirme a causa da morte e sustente-a com os sinais discriminantes do corpo.',
  mecanismo_errado: 'A causa afirmada contradiz os sinais do corpo. Reexamine o pescoço da vítima.',
  sem_nexo: 'Falta materialidade: puxe à âncora Presença o vestígio que põe o réu na cena.',
  nexo_errado: 'O vestígio ligado não casa com o instrumento do óbito.',
  nexo_acessorio: 'Um dos vestígios ligados à Presença não pertence ao réu — desfaça o barbante que sobra.',
  sem_motivacao: 'Aponte o móbil do réu — há papéis que falam por ele.',
  motivacao_erronea: 'O móbil apontado não é o que move o réu.',
  sem_descuidos: 'A cena tem descuidos a expor: confronte a hora que ela alega com a que o corpo dá.',
  periferico: 'Reveja o juízo sobre os não-acusados: cada um merece o veredicto que as cartas fundamentam.',
};

// Total de observações possíveis no caso: o catálogo + a carta de algor
// (gerada pela medição de temperatura).
const TOTAL_OBSERVACOES = CARTAS.length + 1;

export default function MonologoFinal() {
  const veredicto = useJogo((s) => s.veredicto);
  const detective = useJogo((s) => s.detective);
  const revisarAcusacao = useJogo((s) => s.revisarAcusacao);
  const horasJogo = useJogo((s) => s.horasJogo);
  const nosVisitados = useJogo((s) => s.nosVisitados);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const nSubmissoes = useJogo((s) => s.nSubmissoes);
  const [encerrando, setEncerrando] = useState(false);

  if (!veredicto) return null;
  const vitoria = veredicto.tipo === 'vitoria_absoluta';
  // Enquanto a retentativa está de pé, o Erro Judiciário NÃO nomeia o
  // verdadeiro autor — o nome só sai no encerramento definitivo (Q2).
  const monologo = gerarMonologo(veredicto, detective, { nomearCulpado: false });

  // Dicas únicas, na ordem das falhas
  const dicas = [...new Set(veredicto.falhas.map((f) => DICAS_TUTORIAL[f.codigo]).filter(Boolean))];

  // ---------------- O encerramento: epílogo + retrato (Q5) ----------------
  if (encerrando) {
    const epilogo = gerarEpilogo(veredicto);
    const duracao = horasJogo - HORAS_CHEGADA_CENA;
    return (
      <Overlay titulo={`${monologo.titulo} — Epílogo`} subtitulo="O caso, selado">
        <div className="space-y-4">
          {epilogo.blocos.map((b, i) => (
            <p key={i} className="text-stone-300 leading-relaxed">
              {b}
            </p>
          ))}
        </div>

        <div className="mt-8 border border-stone-800 rounded-sm px-4 py-3">
          <p className="text-amber-200/90 text-xs tracking-[0.25em] uppercase mb-2">
            O retrato da investigação
          </p>
          <ul className="space-y-1 text-sm text-stone-400">
            <li>― Chegada às {formatHora(HORAS_CHEGADA_CENA)}; caso selado em {formatRelogio(horasJogo)} — {formatDuracao(duracao)} de investigação.</li>
            <li>― {nosVisitados.length} de {LOCALIDADES.length} lugares visitados.</li>
            <li>― {cartasRegistradas.length} de {TOTAL_OBSERVACOES} observações registradas na mesa.</li>
            <li>― {nSubmissoes === 1 ? 'Uma acusação levada a julgamento.' : `${nSubmissoes} acusações levadas a julgamento.`}</li>
          </ul>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 border border-stone-800 text-stone-400 rounded-sm text-sm hover:text-stone-200"
          >
            Fechar o caderno
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay titulo={monologo.titulo} subtitulo="O monólogo do detetive">
      <div className="space-y-4">
        {monologo.blocos.map((b, i) => (
          <p key={i} className="text-stone-300 leading-relaxed">
            {b}
          </p>
        ))}
      </div>

      {!vitoria && dicas.length > 0 && (
        <div className="mt-8 border border-amber-900/50 rounded-sm px-4 py-3">
          <p className="text-amber-200/90 text-xs tracking-[0.25em] uppercase mb-2">
            O que faltou — cortesia do tutorial
          </p>
          <ul className="space-y-1">
            {dicas.map((d, i) => (
              <li key={i} className="text-stone-400 text-sm">― {d}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        {!vitoria && (
          <button
            onClick={revisarAcusacao}
            className="px-5 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800"
          >
            Revisar a acusação · adia a audiência em {formatDuracao(CUSTO_REVISAO)}
          </button>
        )}
        <button
          onClick={() => {
            tocarSom('lacre');
            setEncerrando(true);
          }}
          className="px-5 py-2 border border-stone-800 text-stone-400 rounded-sm text-sm hover:text-stone-200"
        >
          Encerrar o caso
        </button>
      </div>
    </Overlay>
  );
}
