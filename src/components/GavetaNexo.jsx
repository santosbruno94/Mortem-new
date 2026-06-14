import { useJogo } from '../store/jogo.js';
import { HIPOTESES_NEXO } from '../logic/nexo.js';
import { obterSuspeito } from '../data/seed.js';
import { ROTULOS_INSTRUMENTO } from '../data/rotulos.js';
import GavetaBase from './GavetaBase.jsx';

// Gaveta Nexo — o pilar "Presença" (§7).
// 1 carta de vestígio + 1 Conclusão registrada → Nexo de Presença.
// LIVRO-CAIXA (ETAPA 1): registra a ligação que o jogador AFIRMA entre o
// vestígio e uma pessoa, sem checar se o vestígio de fato corresponde ao
// instrumento. O tribunal é que julga a materialidade.
export default function GavetaNexo() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);

  const vestigios = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'vestigio');

  function montarConclusao(hipotese, cartas, apoio) {
    const vestigio = cartas[0] || null;
    // O instrumento conhecido vem da conclusão de mecanismo usada como apoio.
    const instrumento =
      apoio && apoio.tagsOcultas.tipo === 'mecanismo' ? apoio.tagsOcultas.instrumento : null;

    if (hipotese.id === 'alheio') {
      return {
        origem: 'nexo',
        titulo: 'Vestígio Alheio',
        resumo: 'O vestígio inserido é estranho ao mecanismo do óbito.',
        tagsOcultas: { tipo: 'nexo_alheio', suspeitoId: vestigio ? vestigio.tagsOcultas.pertenceA || null : null },
      };
    }

    const suspeito = obterSuspeito(hipotese.suspeitoId);
    const sufixo = instrumento ? ` (${ROTULOS_INSTRUMENTO[instrumento] || instrumento})` : '';
    return {
      origem: 'nexo',
      titulo: 'Nexo de Presença',
      resumo: `O vestígio liga ${suspeito ? suspeito.nome : 'pessoa incerta'} ao instrumento do óbito${sufixo}.`,
      tagsOcultas: { tipo: 'nexo', suspeitoId: hipotese.suspeitoId, instrumento },
    };
  }

  return (
    <GavetaBase
      titulo="Gaveta Nexo"
      subtitulo="Presença — raciocinar não custa tempo"
      instrucao="Insira um vestígio, apoie-o numa conclusão registrada e declare a quem o vestígio liga. A gaveta apenas registra a sua afirmação; a acusação sem materialidade morre no tribunal."
      cartasElegiveis={vestigios}
      selecaoUnicaCarta
      conclusoesElegiveis={conclusoes.filter((c) => c.origem !== 'nexo')}
      hipoteses={HIPOTESES_NEXO}
      montarConclusao={montarConclusao}
      origem="nexo"
    />
  );
}
