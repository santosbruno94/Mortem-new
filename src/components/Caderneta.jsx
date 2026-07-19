import { useJogo } from '../store/jogo.js';
import { formatRelogio } from '../logic/tempo.js';
import { modoDoCaso } from '../data/casos.js';
import Overlay from './Overlay.jsx';

// Caderneta — o BANCO DE ANOTAÇÕES (§5): tudo que já foi observado fica
// gravado aqui para sempre, e reler não custa tempo (o relógio só pesa sobre
// o perecível AINDA não visto, lá fora). A observação fica congelada como
// foi vista — a degradação travou no momento da extração. Consulta gratuita.
//
// A Caderneta é LEMBRETE, não revelação (§6.2): a lista de observações é um
// diário compacto (carimbo + hora) que reabre a Ficha de Coleta — o exame de
// perto e a fala do legista moram na ficha, não mais aqui.
export default function Caderneta() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);
  const log = useJogo((s) => s.log);
  const abrirFicha = useJogo((s) => s.abrirFicha);
  const modoPurista = useJogo((s) => s.modoPurista);
  const alternarModoPurista = useJogo((s) => s.alternarModoPurista);
  const escolhaContradicao = useJogo((s) => s.escolhaContradicao);
  const resolverContradicao = useJogo((s) => s.resolverContradicao);
  const casoId = useJogo((s) => s.casoId);
  // Nos casos GERADOS não há legista (playtest de 19/07, P1): a seção da
  // leitura some por inteiro — cabeçalho, alternador purista e vazios. As
  // conclusões que restarem (ecos pós-caso) exibem-se por conta própria.
  const temLegista = modoDoCaso(casoId) === 'tutorial';
  // No purista só a leitura DO MESTRE cala; conclusões de outra origem
  // (se um dia existirem) continuam à vista.
  const conclusoesVisiveis = modoPurista ? conclusoes.filter((c) => c.origem !== 'mestre') : conclusoes;

  // #5 — a escolha ativa: só aparece quando as DUAS horas contraditórias
  // estão na mesa (o corpo e o avistamento do padeiro). Firmá-la é o gesto
  // de decisão do meio do caso; a decisão é definitiva e NÃO rege o veredicto.
  const temPadeiro = cartasRegistradas.some((c) => c.id === 'dep_avistamento_padeiro');
  const temCorpoHora = cartasRegistradas.some((c) => c.id === 'ev_rigor' || c.id === 'ev_livores');
  const contradicaoNaMesa = temPadeiro && temCorpoHora;

  return (
    <Overlay titulo="Caderneta" subtitulo="Banco de anotações — reler não custa tempo">
      {/* #5 — O ponto a decidir: duas horas que não cabem juntas. Escolher
          é firmar a hipótese de trabalho, para valer; o mural, no fim, é que
          dá o veredicto. */}
      {contradicaoNaMesa && (
        <div
          className="mb-8 border border-vela/60 bg-stone-950/50 rounded-sm px-4 py-3 shadow-vela"
          data-ponto-decidir
        >
          <p className="text-rotulo uppercase text-amber-300/80 mb-2">Um ponto a decidir</p>
          {escolhaContradicao ? (
            <p className="text-stone-300 text-sm leading-relaxed font-serif italic" data-decisao-firmada>
              {escolhaContradicao === 'corpo'
                ? 'Firmei-me no corpo: parto do rigor e do livor; ao relato que os contrarie compete o ônus da prova.'
                : 'Firmei-me no relato do moço: parto da luz e da vida que ele jura ter visto na oficina; ao corpo compete então o ônus da prova.'}
            </p>
          ) : (
            <>
              <p className="text-stone-300 text-sm leading-relaxed mb-3">
                O moço do padeiro jura o Sr. Arthurs vivo e à bancada às cinco e um quarto da madrugada
                de sábado. O corpo já esfriara: o rigor e o livor põem a morte na véspera, antes da
                meia-noite. Só uma das duas horas pode reger a minha conta, e de qual parto muda o
                caminho daqui em diante.
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="botao-mesa text-sm" onClick={() => resolverContradicao('relato')}>
                  Parto do relato do moço
                </button>
                <button type="button" className="botao-mesa text-sm" onClick={() => resolverContradicao('corpo')}>
                  Parto do que o corpo diz
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Observações reunidas — diário compacto; clicar reabre a ficha */}
      <h3 className="font-serif text-latao-claro text-lg titulo-gravado mb-3">Observações reunidas</h3>
      {cartasRegistradas.length === 0 ? (
        <p className="text-stone-400 italic font-serif text-sm mb-8">Nada foi observado ainda. Examine os locais.</p>
      ) : (
        <ul className="space-y-2 mb-8">
          {cartasRegistradas.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => abrirFicha(c.id)}
                title="Rever a ficha de coleta"
                className="w-full text-left carta-pergaminho rounded-sm px-4 py-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 hover:outline hover:outline-1 hover:outline-cera/50 transition-all duration-gesto"
              >
                <span className="text-tinta text-sm font-serif">{c.termoCarimbo}</span>
                <span className="text-tinta-apagada text-rotulo uppercase shrink-0">
                  {formatRelogio(c.horaRegistro)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* A leitura do legista (a "dica"): refaz-se sozinha a cada exame.
          Modo purista (Onda 8): a síntese cala — a Caderneta vira bloco de
          notas, não gabarito; religar não perde nada (o dado continua). */}
      {temLegista && (
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <h3 className="font-serif text-latao-claro text-lg titulo-gravado">Leitura do legista</h3>
          <button
            type="button"
            onClick={alternarModoPurista}
            className="text-stone-400 hover:text-stone-200 text-xs underline underline-offset-2"
          >
            {modoPurista ? 'Tornar a pedir a leitura' : 'Dispensar a leitura'}
          </button>
        </div>
      )}
      {temLegista && modoPurista && (
        <p className="text-stone-400 italic font-serif text-sm mb-8">
          Você dispensou a leitura do legista: a janela e o mecanismo correm por sua conta.
        </p>
      )}
      {temLegista && !modoPurista && conclusoesVisiveis.length === 0 && (
        <p className="text-stone-400 italic font-serif text-sm mb-8">O legista ainda não tem leitura — examine o corpo.</p>
      )}
      {conclusoesVisiveis.length > 0 && (
        <ul className="space-y-3 mb-8">
          {conclusoesVisiveis.map((c) => (
            <li key={c.id} className="carta-pergaminho rounded-sm px-4 py-3">
              <p className="text-tinta text-sm font-serif font-bold">{c.titulo}</p>
              <p className="text-tinta-clara text-sm mt-1">{c.resumo}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Diário da investigação — meta do caso: permanece escuro, sobre o couro */}
      <h3 className="font-serif text-latao-claro text-lg titulo-gravado mb-3">Diário da investigação</h3>
      {log.length === 0 ? (
        <p className="text-stone-400 italic font-serif text-sm">A página aguarda a primeira anotação.</p>
      ) : (
        <ul className="space-y-1">
          {log.map((entrada, i) => (
            <li key={i} className="text-sm text-stone-300">
              <span className="text-latao-claro/70">{formatRelogio(entrada.hora)} —</span> {entrada.texto}
            </li>
          ))}
        </ul>
      )}
    </Overlay>
  );
}
