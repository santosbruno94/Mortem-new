import { useState } from 'react';
import { useJogo } from './store/jogo.js';
import TelaPersonagem from './components/TelaPersonagem.jsx';
import Abertura from './components/Abertura.jsx';
import Escrivaninha from './components/Escrivaninha.jsx';

// Atalho de desenvolvimento: ?direto pula a seleção e a abertura,
// caindo direto na escrivaninha às 11h00 de 14/out. Para ser determinístico,
// descarta qualquer save antes de arrancar.
const params = new URLSearchParams(window.location.search);
if (params.has('direto')) {
  useJogo.getState().reiniciarCaso();
  useJogo.getState().escolherDetective();
  useJogo.getState().iniciarInvestigacao();
}

// Havia um caso salvo ao abrir a página? (O store hidrata do localStorage de
// forma síncrona, antes deste módulo avaliar.) Se sim, o jogador decide entre
// retomar e recomeçar — nunca se cai no meio do caso sem escolher.
const casoSalvoAoAbrir = !params.has('direto') && useJogo.getState().faseJogo !== 'selecao';

// Roteamento por fase de jogo: seleção → abertura → investigação.
export default function App() {
  const faseJogo = useJogo((s) => s.faseJogo);
  const [aguardandoRetomada, setAguardandoRetomada] = useState(casoSalvoAoAbrir);

  if (aguardandoRetomada) {
    return <TelaPersonagem retomada aoDecidirRetomada={() => setAguardandoRetomada(false)} />;
  }
  if (faseJogo === 'selecao') return <TelaPersonagem />;
  if (faseJogo === 'abertura') return <Abertura />;
  return <Escrivaninha />;
}
