import { useJogo } from './store/jogo.js';
import TelaPersonagem from './components/TelaPersonagem.jsx';
import Abertura from './components/Abertura.jsx';
import Escrivaninha from './components/Escrivaninha.jsx';

// Roteamento por fase de jogo: seleção → abertura → investigação.
export default function App() {
  const faseJogo = useJogo((s) => s.faseJogo);

  if (faseJogo === 'selecao') return <TelaPersonagem />;
  if (faseJogo === 'abertura') return <Abertura />;
  return <Escrivaninha />;
}
