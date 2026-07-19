import { useState } from 'react';
import { useJogo } from './store/jogo.js';
import { carregarCaso as aplicarCasoNoModulo, obterCaso } from './data/pacote_caso.js';
import { obterPacotePorCasoId } from './data/casos.js';
import TelaPersonagem from './components/TelaPersonagem.jsx';
import Abertura from './components/Abertura.jsx';
import Escrivaninha from './components/Escrivaninha.jsx';

const params = new URLSearchParams(window.location.search);

// Atalho ?caso=<id>: carrega um caso do registro (tutorial, réplica ou um
// do banco procedural) e recomeça dele — determinístico, usado pelo QA de
// UI e como porta de depuração.
if (params.has('caso')) {
  const pacote = obterPacotePorCasoId(params.get('caso'));
  if (pacote) {
    aplicarCasoNoModulo(pacote);
    useJogo.getState().reiniciarCaso();
  }
}

// RETOMADA DE CASO: o save guarda o casoId; se o pacote carregado no
// módulo (default: o caso-escola) não é o do save, recarrega-se o certo
// ANTES do primeiro render. Save de caso que não existe mais no registro
// (banco regenerado) recomeça limpo — nunca se joga o caso errado.
if (!params.has('caso')) {
  const casoSalvoId = useJogo.getState().casoId;
  if (casoSalvoId && casoSalvoId !== obterCaso().id) {
    const pacote = obterPacotePorCasoId(casoSalvoId);
    if (pacote) aplicarCasoNoModulo(pacote);
    else useJogo.getState().reiniciarCaso();
  }
}

// Atalho de desenvolvimento: ?direto pula a seleção e a abertura,
// caindo direto na escrivaninha às 13h00 de 14/out. Para ser determinístico,
// descarta qualquer save antes de arrancar.
if (params.has('direto')) {
  useJogo.getState().reiniciarCaso();
  useJogo.getState().escolherDetective();
  useJogo.getState().iniciarInvestigacao();
}

// Havia um caso salvo ao abrir a página? (O store hidrata do localStorage de
// forma síncrona, antes deste módulo avaliar.) Se sim, o jogador decide entre
// retomar e recomeçar — nunca se cai no meio do caso sem escolher.
const casoSalvoAoAbrir =
  !params.has('direto') && !params.has('caso') && useJogo.getState().faseJogo !== 'selecao';

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
