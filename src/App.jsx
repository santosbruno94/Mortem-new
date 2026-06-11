import { useJogo } from './store/jogo.js';
import TelaPersonagem from './components/TelaPersonagem.jsx';
import Abertura from './components/Abertura.jsx';

// Roteamento por fase de jogo: seleção → abertura → investigação.
// A escrivaninha (hub permanente) entra na etapa 6.
export default function App() {
  const faseJogo = useJogo((s) => s.faseJogo);

  if (faseJogo === 'selecao') return <TelaPersonagem />;
  if (faseJogo === 'abertura') return <Abertura />;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-stone-600 tracking-widest text-sm">— a escrivaninha aguarda a próxima etapa —</p>
    </div>
  );
}
