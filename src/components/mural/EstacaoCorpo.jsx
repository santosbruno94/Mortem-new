import { CATALOGO_CAUSAS } from '../../data/catalogo_causas.js';
import { formatJanela } from '../../logic/tempo.js';
import SeletorJanela from './SeletorJanela.jsx';
import { CarimboColeta, Opcao } from './comuns.jsx';

// =====================================================================
// ESTAÇÃO I — O CORPO: as evidências são APRESENTADAS (leitura); o jogador
// calcula e DECLARA a janela e a causa. As evidências do corpo coletadas
// entram sozinhas como base (ver o useEffect no componente-mãe). Sem clique
// nas cartas — a dedução é ler e declarar.
// =====================================================================
export default function EstacaoCorpo({ acusacao, definirJanela, definirCausa, temporais, causais }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* QUANDO */}
      <div>
        <p className="text-rotulo uppercase text-latao-claro/70 mb-2">Quando — a janela</p>
        <SeletorJanela acusacao={acusacao} definirJanela={definirJanela} />
        {acusacao.janela.inicio != null && acusacao.janela.fim != null && (
          <p className="text-latao-claro font-serif text-xs mt-2">{formatJanela(acusacao.janela)}</p>
        )}
        <p className="text-stone-400 text-[11px] mt-3 mb-2">O que o corpo diz do tempo:</p>
        <div className="flex flex-col gap-2">
          {temporais.map((c) => (
            <CartaLeitura key={c.id} carta={c} declarada />
          ))}
          {temporais.length === 0 && (
            <p className="text-stone-400 italic font-serif text-xs">Nenhum indicador de tempo no corpo.</p>
          )}
        </div>
      </div>

      {/* COMO */}
      <div>
        <p className="text-rotulo uppercase text-latao-claro/70 mb-2">Como — a causa</p>
        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
          {CATALOGO_CAUSAS.map((c) => (
            <Opcao key={c.id} ativa={acusacao.causaId === c.id} aoClicar={() => definirCausa(c.id)} rotulo={c.nome} />
          ))}
        </div>
        <p className="text-stone-400 text-[11px] mt-3 mb-2">O que o corpo diz da causa:</p>
        <div className="flex flex-col gap-2">
          {causais.map((c) => (
            <CartaLeitura
              key={c.id}
              carta={c}
              declarada={!!(c.tagsOcultas.sinal || c.tagsOcultas.instrumento)}
            />
          ))}
          {causais.length === 0 && (
            <p className="text-stone-400 italic font-serif text-xs">Nenhum sinal de causa no corpo.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Carta de evidência só para leitura (o jogador lê e deduz; não se clica).
// É prova escrita: pergaminho claro, tinta escura. `declarada` marca as
// cartas que o useEffect do mural ligou SOZINHO às âncoras quando/como
// (P1 §7 do playtest de 17/07): a tese "o corpo é lido, não selecionado"
// vivia só em comentário de código — o micro-rótulo a mostra ao jogador.
function CartaLeitura({ carta, declarada = false }) {
  return (
    <div title={carta.descricao} className="carta-pergaminho rounded-sm px-3 py-2">
      {declarada && (
        <span className="block text-cera text-[9px] tracking-[0.18em] uppercase mb-0.5">
          o corpo declara
        </span>
      )}
      <p className="font-serif text-tinta text-xs leading-snug">{carta.textoDisplay}</p>
      <CarimboColeta hora={carta.horaRegistro} />
    </div>
  );
}
