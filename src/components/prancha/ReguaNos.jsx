import { useJogo } from '../../store/jogo.js';
import { LOCALIDADES } from '../../data/localidades.js';
import {
  custoViagem,
  obterCaso,
  obterDialogo,
  obterLocalidades,
  obterMaquete,
  obterNo,
} from '../../data/pacote_caso.js';
import { POSICOES_DIORAMA, FORMAS_PREDIO, janelaAcesa } from '../../data/mapa_espacial.js';
import { formatDuracao, formatHora } from '../../logic/tempo.js';
import { tintaDaHora, vaosDaFachada } from '../../logic/prancha_vila.js';
import { horaDoAcrescimo } from '../../logic/desbloqueio.js';
import { resumoVisita } from '../../logic/resumoVisita.js';
import { textoLembreteVisita } from '../../logic/lembreteTexto.js';

// =====================================================================
// A RÉGUA DE FICHAS (E4 da OS Prancha da Vila) — a navegação do estreito.
//
// No celular a prancha é SÓ FIGURA: nenhuma etiqueta dentro do desenho
// (era o que obrigava o diorama 3D a carregar um desobstrutor de rótulos
// — aqui o problema deixa de existir). Cada nó vira uma ficha de toque,
// com alvo ≥44px, o mesmo verbo, o mesmo custo e as consequências da
// hora que a etiqueta traria.
//
// A ORDEM é a do hub (a do pacote), nunca por distância: reordenar por
// proximidade seria decidir a rota pelo jogador. O handler de viagem é o
// MESMO das outras vistas — paridade por construção.
// =====================================================================
export default function ReguaNos({ aoAbrirNo }) {
  const localidadeAtual = useJogo((s) => s.localidadeAtual);
  const nosDesbloqueados = useJogo((s) => s.nosDesbloqueados);
  const nosNovos = useJogo((s) => s.nosNovos);
  const nosVisitados = useJogo((s) => s.nosVisitados);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const horasJogo = useJogo((s) => s.horasJogo);
  const diario = useJogo((s) => s.log);

  const maquete = obterMaquete();
  const posicoes = maquete ? maquete.posicoes : POSICOES_DIORAMA;
  const formaDoNo = (pos) =>
    (maquete ? maquete.formas[pos.predio] : FORMAS_PREDIO[pos.predio]) || FORMAS_PREDIO.estalagem;
  const locsVisiveis = (maquete ? obterLocalidades() : LOCALIDADES).filter((loc) =>
    nosDesbloqueados.includes(loc.id)
  );
  const idsDeChegada = new Set(
    obterCaso().nosMapa.filter((n) => n.desbloqueadoInicio).map((n) => n.id)
  );
  const tinta = tintaDaHora(horasJogo);

  // As duas consequências da hora que a ficha declara — as MESMAS da
  // etiqueta da prancha: a casa sem lampião (do dado que acende a janela) e
  // o carimbo do adendo (da anotação que a Caderneta registrou).
  const semLuz = (id) => {
    if (tinta.chave !== 'noite') return false;
    const pos = posicoes[id];
    if (!pos) return false;
    const vaos = vaosDaFachada(formaDoNo(pos));
    return vaos.length > 0 && !vaos.some((v) => janelaAcesa(id, v.i, horasJogo));
  };
  const acrescido = (loc) => {
    if (idsDeChegada.has(loc.id)) return '';
    const no = obterNo(loc.id);
    const hora = horaDoAcrescimo(diario, no ? no.rotulo : loc.rotuloMesa);
    return hora === null ? '' : `acrescido ${formatHora(hora)}`;
  };

  return (
    <div className="regua-nos" data-regua-nos>
      {locsVisiveis.map((loc) => {
        const aqui = loc.id === localidadeAtual;
        const novo = nosNovos.includes(loc.id);
        const custo = localidadeAtual ? custoViagem(localidadeAtual, loc.id) : 0;
        const verbo = obterDialogo(loc.id) ? 'Interrogar' : 'Examinar';
        const lembrete =
          nosVisitados.includes(loc.id) && !aqui
            ? textoLembreteVisita(resumoVisita(loc.id, cartasRegistradas))
            : '';
        const marca = acrescido(loc);
        const notas = [
          aqui ? '— aqui —' : custo === 0 ? 'a um passo' : `viajar · ${formatDuracao(custo)}`,
          semLuz(loc.id) ? 'sem luz a esta hora' : '',
          novo && marca ? `novo · ${marca}` : novo ? 'novo' : marca,
        ].filter(Boolean);
        return (
          <button
            key={loc.id}
            onClick={() => aoAbrirNo(loc)}
            className={`regua-ficha ${aqui ? 'regua-ficha--aqui' : ''} ${novo ? 'regua-ficha--nova' : ''}`}
          >
            <span className="regua-ficha-nome">{loc.rotuloMesa}</span>
            <span className="regua-ficha-linha">
              {verbo} · {notas.join(' · ')}
            </span>
            {lembrete && <span className="regua-ficha-lembrete">visitado · {lembrete}</span>}
          </button>
        );
      })}
    </div>
  );
}
