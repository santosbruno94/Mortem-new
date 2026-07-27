import { useState, useEffect, useRef } from 'react';
import { obterSuspeitos } from '../../data/pacote_caso.js';
import { ANCORAS } from '../../logic/acusacao.js';
import { modoDoCaso } from '../../data/casos.js';
import { useJogo } from '../../store/jogo.js';
import { formatRelogio } from '../../logic/tempo.js';
import { interpolar } from '../../logic/interpolar.js';
import RetratoPersonagem from '../RetratoPersonagem.jsx';
import MesaLigacao from './MesaLigacao.jsx';
import { CarimboColeta, Opcao } from './comuns.jsx';

// =====================================================================
// ESTAÇÃO II — A PRESENÇA: nomear o réu e LIGAR (barbante) um vestígio à cena.
// =====================================================================
export function EstacaoPresenca({ acusacao, definirReu, vestigios, adicionarLigacao, removerLigacao }) {
  const alvo = { id: ANCORAS.presenca, rotulo: 'Presença — o réu na cena', ehAncora: true };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-rotulo uppercase text-latao-claro/70">Réu:</span>
        {obterSuspeitos().map((sp) => (
          <Opcao key={sp.id} ativa={acusacao.reuId === sp.id} aoClicar={() => definirReu(sp.id)} rotulo={sp.nome} />
        ))}
      </div>
      <p className="text-stone-400 text-[11px] mb-2">
        Ligue à Presença o(s) vestígio(s) que ligam o réu à arma do óbito (clique no vestígio, depois
        na âncora). Para desfazer uma ligação, clique no barbante.
      </p>
      <MesaLigacao
        alvos={[alvo]}
        fontes={vestigios}
        ligacoes={acusacao.ligacoes}
        adicionarLigacao={adicionarLigacao}
        removerLigacao={removerLigacao}
        rotuloFontes="Vestígios coletados"
      />
    </div>
  );
}

// =====================================================================
// ESTAÇÃO III — AS MENTIRAS: LIGAR (barbante) um fato à alegação que ele
// derruba — o relógio encenado, o falso avistamento e, com o réu nomeado,
// o paradeiro que o próprio réu declarou (refutável pelo registro de
// testemunho — a corroboração de Moorford). Os álibis dos NÃO-acusados
// seguem na estação dos Juízos.
// =====================================================================
export function EstacaoMentiras({ acusacao, mentirasAlvo, fontesMentiras, adicionarLigacao, removerLigacao }) {
  return (
    <div>
      <p className="text-stone-400 text-[11px] mb-2">
        Ligue um fato — do corpo ou dos registros — à alegação de hora ou de paradeiro que ele
        derruba (clique no fato, depois no depoimento). Para desfazer uma ligação, clique no barbante.
      </p>
      <MesaLigacao
        alvos={mentirasAlvo}
        fontes={fontesMentiras}
        ligacoes={acusacao.ligacoes}
        adicionarLigacao={adicionarLigacao}
        removerLigacao={removerLigacao}
        rotuloAlvos="As alegações — hora e paradeiro"
        rotuloFontes="Os fatos — corpo e registros"
      />
    </div>
  );
}

// =====================================================================
// ESTAÇÃO IV — O MÓBIL: apontar a carta de móbil ligada ao réu.
// =====================================================================
export function EstacaoMobil({ acusacao, motivos, definirMotivacao }) {
  if (!acusacao.reuId) {
    return (
      <p className="text-stone-400 italic font-serif text-xs">
        Nomeie o réu na etapa da Presença para apontar o móbil.
      </p>
    );
  }
  if (motivos.length === 0) {
    return <p className="text-stone-400 italic font-serif text-xs">Nenhuma carta de móbil ligada a este réu.</p>;
  }
  return (
    <div className="flex flex-col gap-1 max-w-md">
      <p className="text-rotulo uppercase text-latao-claro/70 mb-1">Aponte o móbil:</p>
      {motivos.map((c) => (
        <Opcao
          key={c.id}
          ativa={acusacao.motivacaoId === c.id}
          aoClicar={() => definirMotivacao(c.id)}
          rotulo={c.termoCarimbo}
          sub={c.horaRegistro != null ? `coleta: ${formatRelogio(c.horaRegistro)}` : null}
        />
      ))}
    </div>
  );
}

// =====================================================================
// ESTAÇÃO V — OS JUÍZOS: Cúmplice / Inocente / Sem juízo por não-acusado.
// Inocente abre "confronte o paradeiro declarado": ligar o vestígio do
// suspeito ao álibi dele é a refuta_alibi que o motor lê (governanta →
// revela o segredo). Cúmplice abre "o porquê" (aposta do jogador; estado
// local, sem efeito no motor). Tudo opcional — só pesa na Vitória Absoluta.
// =====================================================================
export function EstacaoJuizos({ acusacao, naoAcusados, definirJuizo, cartas, estaLigada, alternarLigacao }) {
  const casoId = useJogo((s) => s.casoId);
  const detective = useJogo((s) => s.detective);
  const [porque, setPorque] = useState({});
  function alternarPorque(sid, cid) {
    setPorque((p) => {
      const atual = { ...(p[sid] || {}) };
      if (atual[cid]) delete atual[cid];
      else atual[cid] = true;
      return { ...p, [sid]: atual };
    });
  }

  if (naoAcusados.length === 0) {
    return <p className="text-stone-400 italic font-serif text-xs">Nomeie o réu na etapa da Presença primeiro.</p>;
  }

  // A LIÇÃO DO JUÍZO (playtest cego de 27/07/2026, item 3). O desfecho cobrava
  // do jogador um critério que a tela nunca enunciou: as três opções estavam
  // ali, o monólogo dizia depois que o «Inocente» não correspondia ao que as
  // cartas provam, e em lugar nenhum se dizia o que funda um juízo. A punição
  // era justa; a pedagogia, não.
  //
  // Isto NÃO reabre a porta que a Q3 fechou: o que a Q3 tirou do mural foi o
  // GABARITO (a leitura pronta do legista pendurada no topo). Aqui não se diz
  // nada do caso — nenhum nome, nenhuma carta, nenhuma resposta. Diz-se a
  // regra do instrumento, que é o que um mestre ensina a um aprendiz.
  // Tutorial só: nos casos gerados não há mestre a ecoar (mesma convenção de
  // FalaDoLegista.jsx), e ali o perito julga por conta própria.
  //
  // PIPELINE `revisar-prosa`, 27/07/2026 — BLOQUEANTE do editor-crítico, e
  // procedente: a primeira versão desta lição mandava responder «Sem juízo»
  // onde não houvesse em que fundar, e o motor faz o CONTRÁRIO. Em
  // `veredicto.js:210` o acerto do periférico exige `declarado === 'inocente'`
  // e só isso; qualquer outro valor — `sem_juizo` inclusive — empurra
  // `falhas.push({ codigo: 'periferico' })` e derruba a Vitória Absoluta. Pior:
  // o monólogo já tem prosa para a inocência dada SEM paradeiro colhido
  // (`PERIFERICO_ALIBI_CONVICCAO`) e trata-a como acerto com repreensão — «a
  // convicção acertou; não é método que eu assine duas vezes». Logo a regra
  // verdadeira é: juízo lavrado em todos, sempre; o paradeiro na mesa é o que
  // separa perícia de convicção; e o laço vestígio→álibi é o que se exige de
  // quem mentiu por segredo. Um painel que existe para ensinar o critério não
  // pode ensinar o lance que o motor pune.
  const licaoDoMestre = modoDoCaso(casoId) === 'tutorial' && (
    <div className="mb-4 border-l-2 border-latao/70 pl-4 space-y-2" data-licao-juizo>
      <p className="text-rotulo uppercase text-latao-claro/70">A voz do mestre</p>
      <p className="font-serif italic text-stone-200 text-sm leading-relaxed">
        {interpolar(
          '“Cada nome que {g:o senhor|a senhora} não levar a júri sai do inquérito com juízo lavrado. Deixar em branco conta como peça que faltou.”',
          detective
        )}
      </p>
      <p className="font-serif italic text-stone-200 text-sm leading-relaxed">
        “Inocência lavra-se com o paradeiro na mesa, tomado da própria boca. Havendo vestígio que o
        contrarie, ate um ao outro: o laço responde pelo que ficou escondido.”
      </p>
    </div>
  );

  const alibiDe = (sid) =>
    cartas.find((c) => c.tagsOcultas.subDominio === 'alibi' && c.tagsOcultas.declaranteId === sid);
  const vestigiosDe = (sid) =>
    cartas.filter((c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.pertenceA === sid);
  const incriminamDe = (sid) =>
    cartas.filter(
      (c) => c.tagsOcultas.ligadoA === sid || (c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.pertenceA === sid)
    );

  return (
    <>
      {licaoDoMestre}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {naoAcusados.map((sp) => {
        const juizo = acusacao.juizos[sp.id];
        const alibi = alibiDe(sp.id);
        return (
          <div key={sp.id} className="relative rounded-sm border border-latao/40 bg-stone-900/80 shadow-pousado px-3 py-2">
            {/* A tacha que prende a ficha do suspeito */}
            <span className="tacha-latao absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2" aria-hidden="true" />
            <div className="flex items-center gap-2 mb-2">
              <RetratoPersonagem personagemId={sp.id} tamanho={30} className="block rounded-sm border border-latao/40" />
              <p className="font-serif text-rotulo uppercase text-latao-claro/80">{sp.nome}</p>
            </div>
            <div className="flex flex-col gap-1">
              {[
                ['culpado', 'Cúmplice'],
                ['inocente', 'Inocente'],
                ['sem_juizo', 'Sem juízo'],
              ].map(([val, rot]) => (
                <Opcao key={val} ativa={juizo === val} aoClicar={() => definirJuizo(sp.id, val)} rotulo={rot} />
              ))}
            </div>

            {/* INOCENTE → confrontar o paradeiro declarado: o mesmo gesto serve
                ao álibi que se sustenta e ao álibi que quebra (mentira-segredo) */}
            {juizo === 'inocente' && (
              <SubPainelJuizo>
                {/* A rubrica só sai quando há paradeiro a confrontar: com a
                    mesa sem álibi ela mandava fazer o que a linha de baixo
                    declara impossível, e o guia §4.10 proíbe justamente isso —
                    rubrica que nega a que sai com ela (pipeline `revisar-prosa`
                    de 27/07/2026). */}
                {alibi && (
                  <>
                    <p className="text-stone-400 text-[11px] mb-1">
                      Confronte o paradeiro declarado — ligue o vestígio que o conteste, se houver:
                    </p>
                    <p className="text-stone-400 text-xs italic font-serif mb-1">Álibi: {alibi.textoDisplay}</p>
                  </>
                )}
                {/* Sem o paradeiro na mesa não há a que ligar o vestígio, e o
                    painel dizia-o pela metade: listava as cartas e engolia o
                    clique (playtest cego de 27/07/2026, item 3 — o jogador
                    ficou sem saber por que o juízo não pegava). Diz-se o que
                    falta e onde se colhe.
                    Sem pronome de terceira pessoa: o painel roda por
                    não-acusado, e a lista tem mulheres (a Sra. Rooke no
                    caso-escola, e suspeitas nos gerados). Este arquivo não
                    interpolava `{g:…}` até esta rodada, e o masculino cravado
                    imprimia-se para elas. */}
                {!alibi ? (
                  <p className="text-stone-400 italic font-serif text-xs">
                    O paradeiro ainda não está na sua mesa: colhe-se no interrogatório, antes de
                    haver o que confrontar.
                  </p>
                ) : vestigiosDe(sp.id).length === 0 ? (
                  <p className="text-stone-400 italic font-serif text-xs">
                    Nenhum vestígio na sua mesa confronta este paradeiro.
                  </p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {vestigiosDe(sp.id).map((v) => (
                      <CartaSelecionavel
                        key={v.id}
                        carta={v}
                        ativa={!!alibi && estaLigada(v.id, alibi.id)}
                        aoClicar={() => alibi && alternarLigacao(v.id, alibi.id)}
                      />
                    ))}
                  </div>
                )}
              </SubPainelJuizo>
            )}

            {/* CÚMPLICE → o porquê (aposta do jogador; narrativa) */}
            {juizo === 'culpado' && (
              <SubPainelJuizo>
                <p className="text-stone-400 text-[11px] mb-1">Por que acusa de cúmplice:</p>
                {incriminamDe(sp.id).length === 0 ? (
                  <p className="text-stone-400 italic font-serif text-xs">Nenhuma carta sustenta a aposta.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {incriminamDe(sp.id).map((c) => (
                      <CartaSelecionavel
                        key={c.id}
                        carta={c}
                        ativa={!!(porque[sp.id] && porque[sp.id][c.id])}
                        aoClicar={() => alternarPorque(sp.id, c.id)}
                      />
                    ))}
                  </div>
                )}
              </SubPainelJuizo>
            )}
          </div>
        );
      })}
      </div>
    </>
  );
}

// O sub-painel que se abre sob a ficha do suspeito (Inocente/Cúmplice) nasce
// abaixo da dobra nas fichas de baixo do grid (P1 do playtest): ao montar,
// rola o mural até ficar visível e surge com o gesto padrão da mesa.
function SubPainelJuizo({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);
  return (
    <div ref={ref} className="mt-2 border-t border-latao/25 pt-2 mortem-surgir">
      {children}
    </div>
  );
}

// Carta selecionável (toggle), usada nos Juízos (a evidência / o porquê).
function CartaSelecionavel({ carta, ativa, aoClicar }) {
  return (
    <button
      onClick={aoClicar}
      title={carta.descricao}
      className={`text-left rounded-sm px-2 py-1 border text-xs transition-all duration-gesto ${
        ativa
          ? 'border-latao-claro bg-amber-950/40 text-amber-100 ring-1 ring-latao-claro/60 shadow-vela'
          : 'border-stone-700 bg-stone-900 text-stone-400 hover:text-amber-100 hover:border-latao/70'
      }`}
    >
      {carta.textoDisplay}
      <CarimboColeta hora={carta.horaRegistro} clara />
    </button>
  );
}
