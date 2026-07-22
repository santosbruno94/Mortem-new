import { useEffect, useState } from 'react';
import { useJogo } from './store/jogo.js';
import { carregarCaso as aplicarCasoNoModulo, obterCaso } from './data/pacote_caso.js';
import { obterPacotePorCasoId } from './data/casos.js';
import TelaPersonagem from './components/TelaPersonagem.jsx';
import Abertura from './components/Abertura.jsx';
import Escrivaninha from './components/Escrivaninha.jsx';

const params = new URLSearchParams(window.location.search);

// BOOT (Lote 5 do diagnóstico): obterPacotePorCasoId é assíncrono — o
// banco de casos gerados (~1,8 MB) saiu do chunk de arranque e chega por
// import() dinâmico só quando um caso gerado é pedido. O caminho comum
// (tutorial, sem save de caso gerado) resolve sem baixar o banco. O App
// segura o primeiro render até este boot terminar — a mesma ordem de
// sempre: caso certo carregado ANTES de qualquer tela.
async function prepararBoot() {
  // Atalho ?caso=<id>: carrega um caso do registro (tutorial, réplica ou um
  // do banco procedural) e recomeça dele — determinístico, usado pelo QA de
  // UI e como porta de depuração.
  if (params.has('caso')) {
    const pacote = await obterPacotePorCasoId(params.get('caso'));
    if (pacote) {
      aplicarCasoNoModulo(pacote);
      useJogo.getState().reiniciarCaso();
    }
  } else {
    // RETOMADA DE CASO: o save guarda o casoId; se o pacote carregado no
    // módulo (default: o caso-escola) não é o do save, recarrega-se o certo
    // antes do primeiro render. Save de caso que não existe mais no registro
    // (banco regenerado) recomeça limpo — nunca se joga o caso errado.
    const casoSalvoId = useJogo.getState().casoId;
    if (casoSalvoId && casoSalvoId !== obterCaso().id) {
      const pacote = await obterPacotePorCasoId(casoSalvoId);
      if (pacote) aplicarCasoNoModulo(pacote);
      else useJogo.getState().reiniciarCaso();
    }
  }

  // Atalho de desenvolvimento: ?direto pula a seleção e a abertura,
  // caindo direto na escrivaninha. Para ser determinístico, descarta
  // qualquer save antes de arrancar.
  if (params.has('direto')) {
    useJogo.getState().reiniciarCaso();
    useJogo.getState().escolherDetective();
    useJogo.getState().iniciarInvestigacao();
  }

  // Havia um caso salvo ao abrir a página? (O store hidrata do localStorage
  // de forma síncrona.) Se sim, o jogador decide entre retomar e recomeçar —
  // nunca se cai no meio do caso sem escolher.
  return !params.has('direto') && !params.has('caso') && useJogo.getState().faseJogo !== 'selecao';
}
const bootPromise = prepararBoot();

// Roteamento por fase de jogo: seleção → abertura → investigação.
export default function App() {
  const faseJogo = useJogo((s) => s.faseJogo);
  // null = boot em curso (frame(s) em branco; o caminho do tutorial resolve
  // em microtarefa, e o do caso gerado, ao chegar o chunk do banco).
  const [boot, setBoot] = useState(null);
  useEffect(() => {
    let vivo = true;
    bootPromise.then((retomada) => vivo && setBoot({ aguardandoRetomada: retomada }));
    return () => {
      vivo = false;
    };
  }, []);

  if (!boot) return <div className="min-h-screen bg-stone-950" aria-busy="true" />;
  if (boot.aguardandoRetomada) {
    return (
      <TelaPersonagem
        retomada
        aoDecidirRetomada={() => setBoot({ aguardandoRetomada: false })}
      />
    );
  }
  if (faseJogo === 'selecao') return <TelaPersonagem />;
  if (faseJogo === 'abertura') return <Abertura />;
  return <Escrivaninha />;
}
