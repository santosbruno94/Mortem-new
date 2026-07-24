import { useState } from 'react';
import { obterSuspeitos } from '../../data/pacote_caso.js';
import { CATALOGO_CAUSAS } from '../../data/catalogo_causas.js';
import { formatJanela } from '../../logic/tempo.js';

// ---------------------------------------------------------------------
// A revisão final: o argumento inteiro, legível, antes de selar. Só lê o que
// o jogador afirmou — nunca diz se está certo (a verdade é o Monólogo).
// ---------------------------------------------------------------------
export default function RevisaoFinal({ acusacao, cartas, sustentaPresenca, refutaHora, refutaAlibi, naoAcusados, lacunas, aoVoltar, aoConfirmar }) {
  // Selo com lacunas pede confissão explícita (P0 §5 do playtest de 17/07):
  // errar segue permitido — Erro Judiciário e Impunidade são finais
  // legítimos e pedagógicos, o botão nunca desabilita —, mas "revisei e
  // assumo o risco" precisa se distinguir de "não vi que faltava algo".
  // O jogador completo não vê este passo.
  const [confirmandoLacunas, setConfirmandoLacunas] = useState(false);
  const reu = obterSuspeitos().find((s) => s.id === acusacao.reuId);
  const causa = CATALOGO_CAUSAS.find((c) => c.id === acusacao.causaId);
  const temJanela = acusacao.janela.inicio != null && acusacao.janela.fim != null;
  const vestNexo = sustentaPresenca.find((c) => c.tagsOcultas.dominio === 'vestigio' && c.tagsOcultas.tipoVestigio);
  const motivo = cartas.find((c) => c.id === acusacao.motivacaoId);
  const semCor = '— por afirmar —';

  const refutaAlibiDe = (sid) => {
    for (const v of refutaAlibi.values()) if (v.alibi.tagsOcultas.declaranteId === sid) return v.vestigios[0];
    return null;
  };
  // As mentiras expostas do caso: as de hora E o paradeiro do réu desmentido
  // (P2 do playtest — a refutação do álibi do réu não pode ficar invisível).
  const mentiras = [...refutaHora.values()].map((v) => v.alegacao.termoCarimbo);
  const paradeiroReu = refutaAlibiDe(acusacao.reuId);
  if (paradeiroReu) mentiras.push(`paradeiro desmentido por “${paradeiroReu.textoDisplay}”`);
  const rotuloJuizo = (j) => (j === 'culpado' ? 'Cúmplice' : j === 'inocente' ? 'Inocente' : 'Sem juízo');

  return (
    <div className="absolute inset-0 z-50 bg-stone-950/80 overlay-fundo flex items-center justify-center p-3 sm:p-6">
      <div className="mortem-surgir painel-couro w-full max-w-2xl max-h-full overflow-auto rounded-sm p-4 sm:p-6">
        <h3 className="font-serif text-lg text-amber-200 titulo-gravado mb-1">A acusação, como você a montou</h3>
        <p className="text-stone-400 text-xs mb-3">Releia antes de selar. Nada aqui diz se está certo — isso é o julgamento.</p>
        <div className="divisor-ornado text-xs mb-4" aria-hidden="true">§</div>

        <dl className="space-y-2 text-sm">
          <LinhaRev rotulo="Quem" valor={reu ? reu.nome : semCor} />
          <LinhaRev rotulo="Quando" valor={temJanela ? formatJanela(acusacao.janela) : semCor} />
          <LinhaRev rotulo="Como" valor={causa ? causa.nome : semCor} />
          <LinhaRev rotulo="Presença" valor={vestNexo ? vestNexo.textoDisplay : '— nada liga o réu à cena —'} />
          <LinhaRev rotulo="Mentiras" valor={mentiras.length ? mentiras.join(' · ') : '— nenhuma mentira exposta —'} />
          <LinhaRev rotulo="Móbil" valor={motivo ? motivo.termoCarimbo : semCor} />
          <div className="flex gap-3">
            <dt className="text-rotulo uppercase text-latao-claro/70 w-24 shrink-0 pt-0.5">Juízos</dt>
            <dd className="text-stone-300 flex-1">
              {naoAcusados.length === 0 ? (
                <span className="text-stone-400 italic font-serif">— sem outros suspeitos —</span>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {naoAcusados.map((sp) => {
                    const v = refutaAlibiDe(sp.id);
                    return (
                      <span key={sp.id}>
                        {sp.nome}: <span className="text-stone-200">{rotuloJuizo(acusacao.juizos[sp.id])}</span>
                        {/* Forma neutra: o nome da carta tem gênero próprio
                            ("a Cesta…", "o Registro…") — nada de "pelo" fixo. */}
                        {acusacao.juizos[sp.id] === 'inocente' && v && (
                          <span className="text-stone-400"> — paradeiro desmentido por “{v.textoDisplay}”</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
            </dd>
          </div>
        </dl>

        {!confirmandoLacunas ? (
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={aoVoltar} className="botao-mesa botao-mesa--quieto !text-sm">
              Voltar e revisar
            </button>
            <button
              onClick={() => (lacunas.length > 0 ? setConfirmandoLacunas(true) : aoConfirmar())}
              className="placa-latao px-5 py-2 rounded-sm font-serif text-sm tracking-wide"
            >
              Confirmar e julgar
            </button>
          </div>
        ) : (
          <div className="mt-6 mortem-surgir">
            <div className="carta-pergaminho relative rounded-sm px-4 py-3">
              <span className="tacha-latao absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5" aria-hidden="true" />
              <p className="text-tinta text-sm">
                A acusação não declara: <span className="text-tinta-clara">{lacunas.join(' · ')}</span>
              </p>
              <p className="text-tinta text-sm mt-1">
                O julgamento correrá com o que está na mesa. Selar assim mesmo?
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={aoVoltar} className="botao-mesa botao-mesa--quieto !text-sm">
                Voltar ao mural
              </button>
              <button onClick={aoConfirmar} className="placa-latao px-5 py-2 rounded-sm font-serif text-sm tracking-wide">
                Selar assim mesmo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LinhaRev({ rotulo, valor }) {
  return (
    <div className="flex gap-3">
      <dt className="text-rotulo uppercase text-latao-claro/70 w-24 shrink-0 pt-0.5">{rotulo}</dt>
      <dd className="text-stone-200 flex-1">{valor}</dd>
    </div>
  );
}
