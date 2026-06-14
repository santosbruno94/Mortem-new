import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { HIPOTESES_MECANISMO, HIPOTESES_CENA } from '../logic/aitiov.js';
import { formatHora } from '../logic/tempo.js';
import {
  ROTULOS_MECANISMO,
  ROTULOS_INSTRUMENTO,
  ROTULOS_ESTADO_CENA,
} from '../data/rotulos.js';
import GavetaBase from './GavetaBase.jsx';

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Gaveta Aitiov — o pilar "Como", em duas seções (§7):
// Seção 1 (causais → Mecanismo do Óbito) e Seção 2 (ambientais → Estado
// da Cena, ex.: Cena Encenada).
// LIVRO-CAIXA (ETAPA 1): registra o mecanismo e o estado da cena que o
// jogador AFIRMA, sem confrontar com as evidências e sem bloquear.
export default function GavetaAitiov() {
  const [secao, setSecao] = useState('mecanismo');
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);

  const causais = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'causal');
  const ambientais = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'ambiental');

  function montarConclusaoMecanismo(hipotese, cartas) {
    // O instrumento, se alguma carta inserida o identifica, integra a afirmação.
    const cartaInstrumento = cartas.find((c) => c.tagsOcultas.instrumento);
    const instrumento = cartaInstrumento ? cartaInstrumento.tagsOcultas.instrumento : null;
    const sufixo = instrumento
      ? ` — instrumento: ${ROTULOS_INSTRUMENTO[instrumento] || instrumento}`
      : '';
    return {
      origem: 'aitiov',
      titulo: 'Mecanismo do Óbito',
      resumo: `${capitalizar(ROTULOS_MECANISMO[hipotese.id] || hipotese.id)}${sufixo}.`,
      tagsOcultas: { tipo: 'mecanismo', mecanismo: hipotese.id, instrumento },
    };
  }

  function montarConclusaoCena(hipotese, cartas) {
    // Se o jogador afirma encenação, a hora forjada é a cronologia aparente
    // de uma carta ambiental inserida (a afirmação dele, não uma correção).
    const cartaHora = cartas.find((c) => typeof c.tagsOcultas.horaAparente === 'number');
    const horaForjada =
      hipotese.id === 'cena_encenada' && cartaHora ? cartaHora.tagsOcultas.horaAparente : null;
    const detalhe =
      horaForjada !== null
        ? ` — a cena finge uma cronologia (${formatHora(horaForjada)}) que a perícia desmente`
        : '';
    return {
      origem: 'aitiov',
      titulo: 'Estado da Cena',
      resumo: `${capitalizar(ROTULOS_ESTADO_CENA[hipotese.id] || hipotese.id)}${detalhe}.`,
      tagsOcultas: { tipo: 'estado_cena', estado: hipotese.id, horaForjada },
    };
  }

  const abas = (
    <div className="flex gap-2 mb-2">
      <button
        onClick={() => setSecao('mecanismo')}
        className={`px-3 py-1.5 rounded-sm text-xs tracking-wide border ${
          secao === 'mecanismo'
            ? 'border-amber-900 text-amber-200 bg-stone-950'
            : 'border-stone-800 text-stone-500 hover:text-stone-300'
        }`}
      >
        Seção 1 · Mecanismo do Óbito
      </button>
      <button
        onClick={() => setSecao('cena')}
        className={`px-3 py-1.5 rounded-sm text-xs tracking-wide border ${
          secao === 'cena'
            ? 'border-amber-900 text-amber-200 bg-stone-950'
            : 'border-stone-800 text-stone-500 hover:text-stone-300'
        }`}
      >
        Seção 2 · Estado da Cena
      </button>
    </div>
  );

  if (secao === 'mecanismo') {
    return (
      <GavetaBase
        key="mecanismo"
        titulo="Gaveta Aitiov"
        subtitulo="Como — raciocinar não custa tempo"
        instrucao={
          <>
            {abas}
            Insira as evidências causais do corpo e declare o mecanismo do óbito.
          </>
        }
        cartasElegiveis={causais}
        hipoteses={HIPOTESES_MECANISMO}
        montarConclusao={montarConclusaoMecanismo}
        origem="aitiov"
        filtroConclusoesGaveta={(c) => c.tagsOcultas.tipo === 'mecanismo'}
      />
    );
  }

  return (
    <GavetaBase
      key="cena"
      titulo="Gaveta Aitiov"
      subtitulo="Como — raciocinar não custa tempo"
      instrucao={
        <>
          {abas}
          Insira as evidências ambientais e declare o estado da cena. A gaveta
          apenas registra a sua leitura — o cotejo com a hora da morte é seu.
        </>
      }
      cartasElegiveis={ambientais}
      hipoteses={HIPOTESES_CENA}
      montarConclusao={montarConclusaoCena}
      origem="aitiov"
      filtroConclusoesGaveta={(c) => c.tagsOcultas.tipo === 'estado_cena'}
    />
  );
}
