import { useJogo } from '../store/jogo.js';
import { gerarMonologo } from '../logic/monologo.js';
import Overlay from './Overlay.jsx';

// Frases universais de "o que faltou" — exceção pedagógica do tutorial
// (§13): após uma falha, o jogo mostra as lacunas e permite resubmissão.
const DICAS_TUTORIAL = {
  reu_errado: 'O réu apontado não resiste à perícia. Reexamine quem o corpo e os vestígios de fato acusam.',
  corpo_sem_substancia: 'Inclua evidências do corpo com valor pericial (sinais não inconclusivos).',
  sem_janela: 'Registre uma Janela da Morte na gaveta Cronos e leve-a ao libelo.',
  janela_nao_cobre: 'A janela sustentada erra a hora do óbito. Reúna sinais colhidos a tempo e refaça o Cronos.',
  janela_imprecisa: 'A janela está larga. Mais sinais temporais colhidos cedo estreitam a convergência.',
  sem_mecanismo: 'Registre o Mecanismo do Óbito na gaveta Aitiov e leve-o ao libelo.',
  mecanismo_errado: 'O mecanismo sustentado contradiz os sinais do corpo. Reexamine o pescoço da vítima.',
  sem_nexo: 'Falta materialidade: ligue alguém ao instrumento do óbito na gaveta Nexo.',
  nexo_errado: 'O nexo sustentado não liga o réu ao instrumento do óbito.',
  sem_motivacao: 'Aponte o móbil do réu — há papéis que falam por ele.',
  motivacao_erronea: 'O móbil apontado não é o que move o réu.',
  sem_descuidos: 'A cena tem descuidos do assassino a expor. A gaveta Aitiov lê a cena à luz da janela.',
  periferico: 'Reveja o juízo sobre os não acusados: cada um merece o veredicto que as cartas fundamentam.',
};

export default function MonologoFinal() {
  const veredicto = useJogo((s) => s.veredicto);
  const detective = useJogo((s) => s.detective);
  const fecharVeredicto = useJogo((s) => s.fecharVeredicto);

  if (!veredicto) return null;
  const monologo = gerarMonologo(veredicto, detective);
  const vitoria = veredicto.tipo === 'vitoria_absoluta';

  // Dicas únicas, na ordem das falhas
  const dicas = [...new Set(veredicto.falhas.map((f) => DICAS_TUTORIAL[f.codigo]).filter(Boolean))];

  return (
    <Overlay titulo={`O Tribunal — ${monologo.titulo}`} subtitulo="Monólogo final" aoFechar={fecharVeredicto}>
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

      <div className="mt-8 flex justify-end gap-3">
        {!vitoria && (
          <button
            onClick={fecharVeredicto}
            className="px-5 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800"
          >
            Revisar o Libelo
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 border border-stone-800 text-stone-400 rounded-sm text-sm hover:text-stone-200"
        >
          Encerrar o caso
        </button>
      </div>
    </Overlay>
  );
}
