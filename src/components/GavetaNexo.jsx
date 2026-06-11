import { useJogo } from '../store/jogo.js';
import { HIPOTESES_NEXO, validarHipoteseNexo } from '../logic/nexo.js';
import { obterSuspeito } from '../data/seed.js';
import { ROTULOS_INSTRUMENTO } from '../data/rotulos.js';
import GavetaBase from './GavetaBase.jsx';

// Gaveta Nexo — o pilar "Presença" (§7).
// 1 carta de vestígio + 1 Conclusão registrada → Nexo de Presença.
export default function GavetaNexo() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);

  const vestigios = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'vestigio');

  function validar(hipotese, cartas, apoio) {
    const vestigio = cartas[0] || null;
    const r = validarHipoteseNexo(hipotese, vestigio, apoio);
    if (!r.consistente) return r;
    if (r.tipo === 'nexo') {
      const suspeito = obterSuspeito(r.suspeitoId);
      return {
        ...r,
        conclusao: {
          origem: 'nexo',
          titulo: 'Nexo de Presença',
          resumo: `O vestígio liga ${suspeito ? suspeito.nome : 'pessoa incerta'} ao instrumento do óbito (${
            ROTULOS_INSTRUMENTO[r.instrumento] || r.instrumento
          }).`,
          tagsOcultas: { tipo: 'nexo', suspeitoId: r.suspeitoId, instrumento: r.instrumento },
        },
      };
    }
    return {
      ...r,
      conclusao: {
        origem: 'nexo',
        titulo: 'Vestígio Alheio',
        resumo: 'O vestígio inserido não corresponde ao mecanismo do óbito.',
        tagsOcultas: { tipo: 'nexo_alheio', suspeitoId: r.suspeitoId },
      },
    };
  }

  return (
    <GavetaBase
      titulo="Gaveta Nexo"
      subtitulo="Presença — raciocinar não custa tempo"
      instrucao="Insira um vestígio, apoie-o numa conclusão registrada e declare a quem o vestígio liga. A acusação sem materialidade morre no tribunal."
      cartasElegiveis={vestigios}
      selecaoUnicaCarta
      conclusoesElegiveis={conclusoes.filter((c) => c.origem !== 'nexo')}
      hipoteses={HIPOTESES_NEXO}
      validar={validar}
      origem="nexo"
    />
  );
}
