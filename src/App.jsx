import { useJogo } from './store/jogo.js';
import TelaPersonagem from './components/TelaPersonagem.jsx';
import Abertura from './components/Abertura.jsx';
import Escrivaninha from './components/Escrivaninha.jsx';

// Atalho de desenvolvimento: ?direto pula a seleção e a abertura,
// caindo direto na escrivaninha às 11h00 de 14/out.
const params = new URLSearchParams(window.location.search);
if (params.has('direto')) {
  useJogo.getState().escolherDetective('harlan');
  useJogo.getState().iniciarInvestigacao();
}

// Roteamento por fase de jogo: seleção → abertura → investigação.
export default function App() {
  const faseJogo = useJogo((s) => s.faseJogo);

  if (faseJogo === 'selecao') return <TelaPersonagem />;
  if (faseJogo === 'abertura') return <Abertura />;
  return <Escrivaninha />;
}
