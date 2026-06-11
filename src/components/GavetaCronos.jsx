import { useJogo } from '../store/jogo.js';
import { HIPOTESES_CRONOS, validarHipoteseCronos } from '../logic/cronos.js';
import { formatJanela } from '../logic/tempo.js';
import GavetaBase from './GavetaBase.jsx';

// Gaveta Cronos — o pilar "Quando" (§7).
// 2+ cartas temporais → Janela da Morte por sobreposição de intervalos.
export default function GavetaCronos() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const temporais = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'temporal');

  function validar(hipotese, cartas) {
    const r = validarHipoteseCronos(hipotese, cartas);
    if (!r.consistente) return r;
    return {
      ...r,
      conclusao: {
        origem: 'cronos',
        titulo: 'Janela da Morte',
        resumo: `O óbito ocorreu ${formatJanela(r.janela)}.`,
        tagsOcultas: { tipo: 'janela', inicio: r.janela.inicio, fim: r.janela.fim },
      },
    };
  }

  return (
    <GavetaBase
      titulo="Gaveta Cronos"
      subtitulo="Quando — raciocinar não custa tempo"
      instrucao="Insira ao menos dois sinais temporais e declare uma hipótese sobre a hora da morte. A gaveta confronta a hipótese com a convergência dos intervalos."
      cartasElegiveis={temporais}
      hipoteses={HIPOTESES_CRONOS}
      validar={validar}
      origem="cronos"
    />
  );
}
