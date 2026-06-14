import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { HIPOTESES_CENA } from '../logic/aitiov.js';
import { CATALOGO_CAUSAS, causasCompativeis, obterSinal } from '../data/catalogo_causas.js';
import { formatHora } from '../logic/tempo.js';
import { ROTULOS_INSTRUMENTO, ROTULOS_ESTADO_CENA } from '../data/rotulos.js';
import GavetaBase from './GavetaBase.jsx';
import Overlay from './Overlay.jsx';

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const FAMILIAS = [
  { id: 'asfixia', rotulo: 'Asfixias' },
  { id: 'intoxicacao', rotulo: 'Intoxicações' },
  { id: 'trauma', rotulo: 'Traumas' },
];

// Abas comuns às duas seções.
function Abas({ secao, setSecao }) {
  return (
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
}

// Seção 1 — Mecanismo por ELIMINAÇÃO contra o catálogo universal.
// O jogador reúne os sinais discriminantes que extraiu; o catálogo inteiro
// (sempre o mesmo) é exibido, e as causas incompatíveis com os sinais vão
// sendo riscadas. O jogador crava uma das causas que sobram. Reunir poucos
// sinais deixa várias causas de pé — daí pode nascer uma leitura errada,
// mas coerente. Registrar grava a afirmação; o tribunal é que a julga.
function SecaoMecanismo({ secao, setSecao }) {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);
  const registrarConclusao = useJogo((s) => s.registrarConclusao);
  const desfazerConclusao = useJogo((s) => s.desfazerConclusao);

  const causais = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'causal');
  const [idsCartas, setIdsCartas] = useState([]);
  const [idCausa, setIdCausa] = useState(null);

  const selecionadas = causais.filter((c) => idsCartas.includes(c.id));
  const sinais = selecionadas.map((c) => c.tagsOcultas.sinal).filter(Boolean);
  const compativeisIds = causasCompativeis(sinais).map((c) => c.id);

  // Causa efetivamente declarada: só vale se ainda estiver de pé (não foi
  // eliminada pelos sinais reunidos). Derivada — sem mexer no estado.
  const causaEscolhida = idCausa && compativeisIds.includes(idCausa) ? idCausa : null;

  const cartaInstrumento = selecionadas.find((c) => c.tagsOcultas.instrumento);
  const instrumento = cartaInstrumento ? cartaInstrumento.tagsOcultas.instrumento : null;
  const registradas = conclusoes.filter((c) => c.tagsOcultas.tipo === 'mecanismo');

  function alternarCarta(id) {
    setIdsCartas((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
    );
  }

  function registrar() {
    if (!causaEscolhida) return;
    const causa = CATALOGO_CAUSAS.find((c) => c.id === causaEscolhida);
    const sufixo = instrumento
      ? ` — instrumento: ${ROTULOS_INSTRUMENTO[instrumento] || instrumento}`
      : '';
    registrarConclusao({
      origem: 'aitiov',
      titulo: 'Mecanismo do Óbito',
      resumo: `${causa.nome}${sufixo}.`,
      tagsOcultas: { tipo: 'mecanismo', mecanismo: causaEscolhida, instrumento },
    });
    setIdsCartas([]);
    setIdCausa(null);
  }

  return (
    <Overlay titulo="Gaveta Aitiov" subtitulo="Como — raciocinar não custa tempo" largura="max-w-3xl">
      <div className="text-stone-500 text-sm mb-5">
        <Abas secao={secao} setSecao={setSecao} />
        Reúna os sinais que extraiu do corpo. Cada sinal descarta causas do catálogo;
        crave o mecanismo entre as que sobrarem. Poucos sinais deixam o leque aberto.
      </div>

      {/* Sinais reunidos */}
      <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">Sinais reunidos</h3>
      {causais.length === 0 ? (
        <p className="text-stone-600 text-sm mb-5">Nenhuma evidência causal repousa sobre a mesa.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-5">
          {causais.map((carta) => {
            const ativa = idsCartas.includes(carta.id);
            return (
              <button
                key={carta.id}
                onClick={() => alternarCarta(carta.id)}
                title={carta.descricao}
                className={`px-3 py-2 rounded-sm border text-sm text-left ${
                  ativa
                    ? 'border-amber-700 bg-stone-950 text-amber-200'
                    : 'border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {carta.termoCarimbo}
              </button>
            );
          })}
        </div>
      )}

      {/* Catálogo universal — causas vão sendo eliminadas */}
      <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">
        Catálogo de causas — {compativeisIds.length} de {CATALOGO_CAUSAS.length} ainda de pé
      </h3>
      <div className="space-y-4 mb-6">
        {FAMILIAS.map((familia) => (
          <div key={familia.id}>
            <p className="text-stone-600 text-xs uppercase tracking-widest mb-1">{familia.rotulo}</p>
            <div className="flex flex-wrap gap-2">
              {CATALOGO_CAUSAS.filter((c) => c.familia === familia.id).map((causa) => {
                const viva = compativeisIds.includes(causa.id);
                const escolhida = causaEscolhida === causa.id;
                return (
                  <button
                    key={causa.id}
                    disabled={!viva}
                    onClick={() => setIdCausa(escolhida ? null : causa.id)}
                    title={causa.descricao}
                    className={`px-3 py-2 rounded-sm border text-sm text-left ${
                      !viva
                        ? 'border-stone-900 text-stone-700 line-through cursor-not-allowed'
                        : escolhida
                        ? 'border-amber-700 bg-stone-950 text-amber-200'
                        : 'border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {causa.nome}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={registrar}
          disabled={!causaEscolhida}
          className="px-5 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cravar mecanismo
        </button>
        <p className="text-stone-600 text-xs">
          {instrumento
            ? `Instrumento identificado: ${ROTULOS_INSTRUMENTO[instrumento] || instrumento}.`
            : 'A gaveta apenas registra o mecanismo que você cravou.'}
        </p>
      </div>

      {registradas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">Registradas nesta gaveta</h3>
          <ul className="space-y-2">
            {registradas.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 border border-stone-800 rounded-sm px-4 py-2"
              >
                <p className="text-stone-300 text-sm">
                  <span className="font-bold">{c.titulo}:</span> {c.resumo}
                </p>
                <button
                  onClick={() => desfazerConclusao(c.id)}
                  className="text-stone-600 hover:text-amber-200 text-xs tracking-widest shrink-0"
                >
                  desfazer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Overlay>
  );
}

// Gaveta Aitiov — o pilar "Como" (§7). Seção 1: mecanismo por eliminação
// contra o catálogo universal. Seção 2: Estado da Cena (livro-caixa).
export default function GavetaAitiov() {
  const [secao, setSecao] = useState('mecanismo');
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const ambientais = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'ambiental');

  function montarConclusaoCena(hipotese, cartas) {
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

  if (secao === 'mecanismo') {
    return <SecaoMecanismo secao={secao} setSecao={setSecao} />;
  }

  return (
    <GavetaBase
      key="cena"
      titulo="Gaveta Aitiov"
      subtitulo="Como — raciocinar não custa tempo"
      instrucao={
        <>
          <Abas secao={secao} setSecao={setSecao} />
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
