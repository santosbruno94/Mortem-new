import { useJogo } from '../store/jogo.js';
import { obterSuspeito, obterDialogos, obterDefinicaoCarta } from '../data/pacote_caso.js';
import { interpolar } from '../logic/interpolar.js';
import {
  todasCartasDaPessoa,
  cartasDaPessoa,
  cartasQueMencionam,
  cartasDeclaradas,
  cartasDeMotivo,
  falasVisitadas,
  oQueOutrosDizem,
  alibiDeclarado,
} from '../logic/fichaPessoa.js';
import { ROTULOS_DOMINIO } from '../data/rotulos.js';
import RetratoPersonagem from './RetratoPersonagem.jsx';
import Overlay from './Overlay.jsx';

// =====================================================================
// FICHA DE PESSOA (P11 — repensar a Mesa): o dossiê por suspeito. Abre
// como overlay ao clicar no cartão de pessoa na superfície da mesa. QOL
// puro: organiza o material JÁ COLHIDO sem entregar conclusão nenhuma.
//
// Seções (D2, todas): (i) álibi declarado, (ii) trechos do
// interrogatório, (iii) cartas extraídas durante o interrogatório,
// (iv) cartas que mencionam esta pessoa, (v) cartas de motivo se
// houver, (vi) o que outros suspeitos disseram sobre esta pessoa.
//
// Clicar numa carta abre a FichaEvidencia (z-50, empilha acima).
// Nenhuma prosa nova é introduzida (sem pipeline de revisão).
// =====================================================================

export default function FichaPessoa({ suspeitoId }) {
  const detective = useJogo((s) => s.detective);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const nosVisitadosDialogo = useJogo((s) => s.nosVisitadosDialogo);
  const abrirFicha = useJogo((s) => s.abrirFicha);

  const suspeito = obterSuspeito(suspeitoId);
  if (!suspeito) return null;

  const dialogos = obterDialogos();
  const alibi = alibiDeclarado(suspeitoId, cartasRegistradas);
  const falas = falasVisitadas(suspeitoId, nosVisitadosDialogo, dialogos);
  const pertence = cartasDaPessoa(suspeitoId, cartasRegistradas);
  const menciona = cartasQueMencionam(suspeitoId, cartasRegistradas);
  const declaradas = cartasDeclaradas(suspeitoId, cartasRegistradas);
  const motivos = cartasDeMotivo(suspeitoId, cartasRegistradas);
  const outrosDizem = oQueOutrosDizem(suspeitoId, nosVisitadosDialogo);
  const todas = todasCartasDaPessoa(suspeitoId, cartasRegistradas);
  const foiInterrogado = falas.length > 0;

  return (
    <Overlay
      titulo={suspeito.nome}
      subtitulo={`${suspeito.idade} anos · ${suspeito.relacao}`}
      marca="fichapessoa"
    >
      <div className="float-right ml-4 mb-2 border border-latao/40 rounded-sm shadow-pousado">
        <RetratoPersonagem personagemId={suspeitoId} tamanho={72} className="block" />
      </div>

      <p className="font-serif text-stone-400 text-sm leading-relaxed mb-6">
        {suspeito.descricao}
      </p>

      {/* (i) Álibi declarado */}
      {alibi && (
        <Secao titulo="Paradeiro declarado">
          <BotaoCarta carta={alibi} aoClicar={() => abrirFicha(alibi.id)} />
        </Secao>
      )}

      {/* (ii) Trechos do interrogatório */}
      {foiInterrogado && (
        <Secao titulo="Do interrogatório">
          <div className="space-y-3">
            {falas.map((f) => (
              <div key={f.noId} className="border-l-2 border-latao/30 pl-3">
                {f.fala.map((p, i) => (
                  <p key={i} className="text-stone-300 text-sm font-serif leading-relaxed">
                    {interpolar(limparMarcadores(p), detective)}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Secao>
      )}

      {/* (iii) Cartas extraídas durante o interrogatório (declaradas + pertence) */}
      {(declaradas.length > 0 || pertence.length > 0) && (
        <Secao titulo="Provas ligadas">
          <div className="space-y-1">
            {cartasSemDuplicata([...declaradas, ...pertence]).map((c) => (
              <BotaoCarta key={c.id} carta={c} aoClicar={() => abrirFicha(c.id)} />
            ))}
          </div>
        </Secao>
      )}

      {/* (iv) Cartas que mencionam esta pessoa */}
      {menciona.length > 0 && (
        <Secao titulo="Menções em outras provas">
          <div className="space-y-1">
            {menciona.map((c) => (
              <BotaoCarta key={c.id} carta={c} aoClicar={() => abrirFicha(c.id)} />
            ))}
          </div>
        </Secao>
      )}

      {/* (v) Cartas de motivo */}
      {motivos.length > 0 && (
        <Secao titulo="Possível móbil">
          <div className="space-y-1">
            {motivos.map((c) => (
              <BotaoCarta key={c.id} carta={c} aoClicar={() => abrirFicha(c.id)} />
            ))}
          </div>
        </Secao>
      )}

      {/* (vi) O que outros dizem */}
      {outrosDizem.length > 0 && (
        <Secao titulo="O que outros disseram">
          <div className="space-y-3">
            {outrosDizem.map((o) => (
              <div key={`${o.autorId}_${o.noId}`} className="border-l-2 border-stone-600/40 pl-3">
                <p className="text-rotulo uppercase text-stone-500 mb-1">{o.autorNome}</p>
                {o.fala.map((p, i) => (
                  <p key={i} className="text-stone-400 text-sm font-serif leading-relaxed">
                    {interpolar(limparMarcadores(p), detective)}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Secao>
      )}

      {todas.length === 0 && !foiInterrogado && (
        <p className="text-stone-500 text-xs italic font-serif mt-4">
          Nenhuma prova recolhida toca este nome até agora.
        </p>
      )}
    </Overlay>
  );
}

function Secao({ titulo, children }) {
  return (
    <div className="mb-5">
      <p className="text-rotulo uppercase text-latao-claro/60 mb-2 tracking-wider">{titulo}</p>
      {children}
    </div>
  );
}

function BotaoCarta({ carta, aoClicar }) {
  const dominio = ROTULOS_DOMINIO[carta.tagsOcultas?.dominio] || '';
  return (
    <button
      type="button"
      onClick={aoClicar}
      className="w-full text-left px-3 py-2 rounded-sm bg-stone-900/60 border border-latao/20 hover:border-latao/50 transition-colors duration-gesto"
      data-carta-pessoa={carta.id}
    >
      <span className="text-cera text-rotulo uppercase">{dominio}</span>
      <span className="ml-2 text-amber-200 text-sm font-serif">{carta.textoDisplay}</span>
    </button>
  );
}

// Achata marcadores [[id]] para exibição plana (a ficha não extrai): o
// marcador vira o textoDisplay da carta, como na prosa viva — apagá-lo
// mutilava a frase ("…sem procurar nenhuma: .") (diagnóstico 21/07, A4).
function limparMarcadores(texto) {
  return texto
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, (marcador, id) => {
      const def = obterDefinicaoCarta(id);
      return def?.textoDisplay || def?.estados?.[0]?.textoDisplay || '';
    });
}

// Deduplica cartas por id.
function cartasSemDuplicata(cartas) {
  const vistas = new Set();
  return cartas.filter((c) => {
    if (vistas.has(c.id)) return false;
    vistas.add(c.id);
    return true;
  });
}
