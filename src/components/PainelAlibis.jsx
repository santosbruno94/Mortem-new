import { useJogo } from '../store/jogo.js';
import { obterSuspeitos, obterParametrosCena } from '../data/pacote_caso.js';
import { formatDeclaracao, CALENDARIO_PADRAO } from '../logic/tempo.js';
import Overlay from './Overlay.jsx';

// Painel de Álibis (§8): "Declarações de Paradeiro".
// Lista ESTRITAMENTE NEUTRA dos depoimentos de álibi já coletados:
// quem declarou, o que declarou, faixa horária declarada. Sem status,
// sem cruzamento automático — comparar com a Janela da Morte é
// raciocínio do jogador. Consulta gratuita.
//
// A forma é a de um rol de declarações tomadas a escrito (1h): uma linha
// por declarante, na ordem do inquérito, dentro de uma pauta traçada à
// régua. Quem ainda não declarou ocupa a linha em branco: a pauta mostra o
// que falta colher tanto quanto o que já se colheu. É o único painel do
// jogo sem voz própria — só colunas, e nenhuma frase que conclua por quem
// lê. NÃO é livro-razão: escrituração lança quantias, e o morto já tem um
// livro-razão de verdade na escrivaninha (localidades.js).
export default function PainelAlibis() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const calendario = obterParametrosCena()?.calendario || CALENDARIO_PADRAO;
  const declaracoes = cartasRegistradas.filter(
    (c) => c.tagsOcultas.dominio === 'comportamental' && c.tagsOcultas.subDominio === 'alibi'
  );

  // Um suspeito pode declarar mais de uma vez (retificação, segunda visita):
  // todas as declarações dele ficam na mesma linha, empilhadas na ordem em
  // que foram colhidas.
  const porDeclarante = new Map();
  declaracoes.forEach((c) => {
    const id = c.tagsOcultas.declaranteId;
    if (!porDeclarante.has(id)) porDeclarante.set(id, []);
    porDeclarante.get(id).push(c);
  });

  const colunas = 'sm:grid sm:grid-cols-[8rem_1fr_11.5rem]';

  return (
    <Overlay titulo="Painel de Álibis" subtitulo="Declarações de paradeiro — consultar não custa tempo">
      {/* A folha: a pauta vive numa lâmina de papel pousada sobre o couro */}
      <div className="carta-pergaminho rounded-sm px-3 py-4 sm:px-5 sm:py-5">
        {declaracoes.length === 0 && (
          <p className="font-serif italic text-tinta-apagada text-xs text-center mb-3">
            Nenhuma declaração tomada até aqui. O paradeiro colhe-se no interrogatório.
          </p>
        )}

        <div className="pauta-rol">
          {/* No celular não há largura para as três colunas lado a lado: o
              cabeçalho some e cada linha se empilha — o nome em cima, o
              paradeiro no meio, as horas embaixo, cada um na sua letra. */}
          <div className={`rol-cabeca hidden ${colunas}`}>
            <p className="font-rotulo uppercase text-rotulo text-tinta px-2 py-1.5">Nome</p>
            <p className="font-rotulo uppercase text-rotulo text-tinta px-2 py-1.5 border-l border-papel-borda">
              Paradeiro declarado
            </p>
            <p className="font-rotulo uppercase text-rotulo text-tinta px-2 py-1.5 border-l border-papel-borda">
              Horas declaradas
            </p>
          </div>

          {obterSuspeitos().map((sp) => {
            const declaradas = porDeclarante.get(sp.id) || [];
            return (
              <div key={sp.id} className={`rol-linha ${colunas}`}>
                <p className="font-serif text-tinta text-sm px-2 pt-2 pb-1 sm:py-2">{sp.nome}</p>
                {declaradas.length === 0 ? (
                  <p className="font-serif italic text-tinta-apagada text-sm px-2 pb-2 sm:py-2 sm:col-span-2 sm:border-l sm:border-papel-borda">
                    nada declarado ainda
                  </p>
                ) : (
                  <>
                    <div className="px-2 pb-1 sm:py-2 sm:border-l sm:border-papel-borda space-y-1">
                      {declaradas.map((c) => (
                        <p key={c.id} className="font-prosa text-tinta text-[13px] leading-snug">
                          {c.textoDisplay}
                        </p>
                      ))}
                    </div>
                    <div className="px-2 pb-2 sm:py-2 sm:border-l sm:border-papel-borda space-y-1">
                      {declaradas.map((c) => (
                        <p key={c.id} className="font-rotulo text-[10.5px] tracking-[0.06em] text-tinta-clara leading-snug">
                          {formatDeclaracao(
                            c.tagsOcultas.horaInicioDeclarada,
                            c.tagsOcultas.horaFimDeclarada,
                            calendario
                          )}
                        </p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

      </div>

      <p className="mt-5 text-stone-400 italic font-serif text-xs leading-relaxed">
        Este painel registra o que foi declarado, tal como foi declarado. Cotejar cada faixa com a
        Janela da Morte é ofício de quem constrói a acusação.
      </p>
    </Overlay>
  );
}
