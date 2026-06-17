import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { ehAlegacaoDeHora, contradicaoDeAlegacao, nexoDeVestigio } from '../logic/confronto.js';
import Overlay from './Overlay.jsx';

// O Confronto (§6) — o ato dedutivo do jogador: cruzar o que DIZEM com o que
// o CORPO diz. Some o mostrador das gavetas; aqui o jogador LIGA, com a
// própria mão, a fala ao fato que lhe dá sentido, e CRAVA — sem o jogo
// dizer se acertou. Duas ligações: a mentira na hora (expõe a encenação) e
// o nexo (o vestígio que liga o dono à arma). Substitui a gaveta Nexo.
export default function Confronto() {
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);
  const registrarConclusao = useJogo((s) => s.registrarConclusao);
  const desfazerConclusao = useJogo((s) => s.desfazerConclusao);

  const [alegacaoSel, setAlegacaoSel] = useState(null);
  const [vestigioSel, setVestigioSel] = useState(null);

  // Os fatos que o legista já cravou (leitura do mestre).
  const fatoJanela = conclusoes.find((c) => c.id === 'leitura_mestre_janela') || null;
  const fatoMecanismo = conclusoes.find((c) => c.id === 'leitura_mestre_mecanismo') || null;

  // O que está sobre a mesa para confrontar.
  const alegacoes = cartasRegistradas.filter(ehAlegacaoDeHora);
  const vestigios = cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'vestigio');

  // O que o jogador já cravou aqui.
  const contradicoes = conclusoes.filter(
    (c) => c.origem === 'confronto' && c.tagsOcultas.tipo === 'estado_cena'
  );
  const nexos = conclusoes.filter((c) => c.origem === 'confronto' && c.tagsOcultas.tipo === 'nexo');

  function cravarContradicao() {
    const carta = cartasRegistradas.find((c) => c.id === alegacaoSel);
    const conclusao = contradicaoDeAlegacao(carta);
    if (conclusao) registrarConclusao(conclusao);
    setAlegacaoSel(null);
  }

  function cravarNexo() {
    const carta = cartasRegistradas.find((c) => c.id === vestigioSel);
    const conclusao = nexoDeVestigio(carta);
    if (conclusao) registrarConclusao(conclusao);
    setVestigioSel(null);
  }

  return (
    <Overlay titulo="O Confronto" subtitulo="Cruzar a fala com o corpo — raciocinar não custa tempo" largura="max-w-3xl">
      {/* ---------------- A mentira na hora ---------------- */}
      <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">I. A mentira na hora</h3>
      <p className="text-stone-500 text-sm mb-3">
        Uma fala sobre a hora que o corpo desmente é uma mentira — e toda mentira foi plantada por
        alguém. Ligue-a ao que o legista cravou.
      </p>

      <div className="border border-stone-800 rounded-sm px-4 py-3 mb-3">
        <p className="text-stone-600 text-[10px] tracking-[0.25em] uppercase">O que o corpo diz</p>
        {fatoJanela ? (
          <p className="text-amber-200 text-sm mt-1">{fatoJanela.resumo}</p>
        ) : (
          <p className="text-stone-500 text-sm mt-1">O legista ainda não cravou a hora — examine o corpo primeiro.</p>
        )}
      </div>

      {alegacoes.length === 0 ? (
        <p className="text-stone-600 text-sm mb-5">Nenhuma alegação sobre a hora repousa sobre a mesa.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-3">
          {alegacoes.map((c) => (
            <Opcao
              key={c.id}
              ativa={alegacaoSel === c.id}
              aoClicar={() => setAlegacaoSel(alegacaoSel === c.id ? null : c.id)}
              titulo={c.textoDisplay}
              subtitulo={c.termoCarimbo}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={cravarContradicao}
          disabled={!alegacaoSel || !fatoJanela}
          className="px-5 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cravar a contradição
        </button>
        <p className="text-stone-600 text-xs">O Confronto só registra o que você cravou — quem julga é o tribunal.</p>
      </div>

      {contradicoes.length > 0 && (
        <ListaCravada itens={contradicoes} aoDesfazer={desfazerConclusao} />
      )}

      <div className="border-t border-stone-900 my-6" />

      {/* ---------------- O nexo ---------------- */}
      <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">II. O nexo de presença</h3>
      <p className="text-stone-500 text-sm mb-3">
        O corpo diz qual foi a arma. Ligue a ela o vestígio cujo material a denuncia — e a pessoa que
        o deixou. Escolha o vestígio certo.
      </p>

      <div className="border border-stone-800 rounded-sm px-4 py-3 mb-3">
        <p className="text-stone-600 text-[10px] tracking-[0.25em] uppercase">A arma do óbito</p>
        {fatoMecanismo ? (
          <p className="text-amber-200 text-sm mt-1">{fatoMecanismo.resumo}</p>
        ) : (
          <p className="text-stone-500 text-sm mt-1">O legista ainda não cravou a arma — examine o corpo.</p>
        )}
      </div>

      {vestigios.length === 0 ? (
        <p className="text-stone-600 text-sm mb-5">Nenhum vestígio repousa sobre a mesa.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-3">
          {vestigios.map((c) => (
            <Opcao
              key={c.id}
              ativa={vestigioSel === c.id}
              aoClicar={() => setVestigioSel(vestigioSel === c.id ? null : c.id)}
              titulo={c.textoDisplay}
              subtitulo={c.termoCarimbo}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={cravarNexo}
          disabled={!vestigioSel || !fatoMecanismo}
          className="px-5 py-2 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm text-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cravar o nexo
        </button>
        <p className="text-stone-600 text-xs">A acusação sem materialidade morre no tribunal.</p>
      </div>

      {nexos.length > 0 && <ListaCravada itens={nexos} aoDesfazer={desfazerConclusao} />}
    </Overlay>
  );
}

function Opcao({ ativa, aoClicar, titulo, subtitulo }) {
  return (
    <button
      onClick={aoClicar}
      className={`px-3 py-2 rounded-sm border text-sm text-left ${
        ativa ? 'border-amber-700 bg-stone-950 text-amber-200' : 'border-stone-800 text-stone-400 hover:text-stone-200'
      }`}
    >
      <span className="block">{titulo}</span>
      {subtitulo && <span className="block text-stone-600 text-xs mt-0.5">§ {subtitulo}</span>}
    </button>
  );
}

function ListaCravada({ itens, aoDesfazer }) {
  return (
    <div className="mt-3">
      <ul className="space-y-2">
        {itens.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-4 border border-stone-800 rounded-sm px-4 py-2">
            <p className="text-stone-300 text-sm">
              <span className="font-bold">{c.titulo}:</span> {c.resumo}
            </p>
            <button
              onClick={() => aoDesfazer(c.id)}
              className="text-stone-600 hover:text-amber-200 text-xs tracking-widest shrink-0"
            >
              desfazer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
