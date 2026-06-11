import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import {
  HIPOTESES_MECANISMO,
  HIPOTESES_CENA,
  validarHipoteseMecanismo,
  validarHipoteseCena,
} from '../logic/aitiov.js';
import { formatHora } from '../logic/tempo.js';
import GavetaBase from './GavetaBase.jsx';

export const ROTULOS_MECANISMO = {
  enforcamento: 'Enforcamento',
  estrangulamento_ligadura: 'Estrangulamento por Ligadura',
  estrangulamento_manual: 'Estrangulamento Manual',
  envenenamento: 'Envenenamento',
};

export const ROTULOS_INSTRUMENTO = {
  fibra_canhamo: 'corda de cânhamo',
};

const ROTULOS_ESTADO_CENA = {
  cena_encenada: 'Cena Encenada',
  roubo_interrompido: 'Roubo Interrompido',
  crime_passional: 'Discussão Violenta',
};

// Gaveta Aitiov — o pilar "Como", em duas seções (§7):
// Seção 1 (causais → Mecanismo do Óbito) e Seção 2 (ambientais + Janela
// → Estado da Cena, ex.: Cena Encenada).
export default function GavetaAitiov() {
  const [secao, setSecao] = useState('mecanismo');
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);

  const causais = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'causal');
  const ambientais = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'ambiental');
  // A Seção 2 apoia-se na Janela da Morte mais recente registrada no Cronos
  const conclusaoJanela = [...conclusoes].reverse().find((c) => c.tagsOcultas.tipo === 'janela');
  const janela = conclusaoJanela
    ? { inicio: conclusaoJanela.tagsOcultas.inicio, fim: conclusaoJanela.tagsOcultas.fim }
    : null;

  function validarMecanismo(hipotese, cartas) {
    const r = validarHipoteseMecanismo(hipotese, cartas);
    if (!r.consistente) return r;
    const instrumento = r.instrumento ? ` — instrumento: ${ROTULOS_INSTRUMENTO[r.instrumento] || r.instrumento}` : '';
    return {
      ...r,
      conclusao: {
        origem: 'aitiov',
        titulo: 'Mecanismo do Óbito',
        resumo: `${ROTULOS_MECANISMO[r.mecanismo]}${instrumento}.`,
        tagsOcultas: { tipo: 'mecanismo', mecanismo: r.mecanismo, instrumento: r.instrumento },
      },
    };
  }

  function validarCena(hipotese, cartas) {
    const r = validarHipoteseCena(hipotese, cartas, janela);
    if (!r.consistente) return r;
    const detalhe =
      r.estado === 'cena_encenada' && r.horaForjada !== null
        ? ` — a cena finge uma cronologia (${formatHora(r.horaForjada)}) que a perícia desmente`
        : '';
    return {
      ...r,
      conclusao: {
        origem: 'aitiov',
        titulo: 'Estado da Cena',
        resumo: `${ROTULOS_ESTADO_CENA[r.estado]}${detalhe}.`,
        tagsOcultas: { tipo: 'estado_cena', estado: r.estado, horaForjada: r.horaForjada },
      },
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
        validar={validarMecanismo}
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
          Insira as evidências ambientais e declare o estado da cena.{' '}
          {janela
            ? 'A leitura apoia-se na Janela da Morte registrada no Cronos.'
            : 'Nenhuma Janela da Morte registrada: a cronologia da cena não terá contraponto.'}
        </>
      }
      cartasElegiveis={ambientais}
      hipoteses={HIPOTESES_CENA}
      validar={validarCena}
      origem="aitiov"
      filtroConclusoesGaveta={(c) => c.tagsOcultas.tipo === 'estado_cena'}
    />
  );
}
