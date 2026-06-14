import { useJogo } from '../store/jogo.js';
import { HIPOTESES_CRONOS } from '../logic/cronos.js';
import { formatJanela } from '../logic/tempo.js';
import GavetaBase from './GavetaBase.jsx';

// Gaveta Cronos — o pilar "Quando" (§7).
// LIVRO-CAIXA (ETAPA 1): a gaveta registra a hora que o jogador AFIRMA
// (a faixa da hipótese declarada), sem confrontá-la com os sinais e sem
// bloquear. Uma janela que não cobre a hora real fica gravada assim mesmo
// — e será julgada no tribunal.
export default function GavetaCronos() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const temporais = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'temporal');

  function montarConclusao(hipotese) {
    const janela = { inicio: hipotese.inicio, fim: hipotese.fim };
    return {
      origem: 'cronos',
      titulo: 'Janela da Morte',
      resumo: `O óbito ocorreu ${formatJanela(janela)}.`,
      tagsOcultas: { tipo: 'janela', inicio: janela.inicio, fim: janela.fim },
    };
  }

  return (
    <GavetaBase
      titulo="Gaveta Cronos"
      subtitulo="Quando — raciocinar não custa tempo"
      instrucao="Reúna os sinais temporais sobre a mesa e declare a janela da morte. A gaveta apenas registra a sua leitura."
      cartasElegiveis={temporais}
      hipoteses={HIPOTESES_CRONOS}
      montarConclusao={montarConclusao}
      origem="cronos"
    />
  );
}
