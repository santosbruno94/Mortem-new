import { useJogo } from '../store/jogo.js';
import { SUSPEITOS } from '../data/seed.js';
import { ROTULOS_PERIFERICO } from '../data/rotulos.js';
import Overlay from './Overlay.jsx';

// Quadro de Revelações (§11): o Libelo como formulário narrativo.
// Campos obrigatórios: réu e evidências do corpo. Os pilares opcionais
// incompletos geram AVISOS DE LACUNA que não bloqueiam a submissão —
// a defesa os explorará no tribunal.
export default function QuadroRevelacoes() {
  const libelo = useJogo((s) => s.libelo);
  const atualizarLibelo = useJogo((s) => s.atualizarLibelo);
  const submeterLibelo = useJogo((s) => s.submeterLibelo);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const conclusoes = useJogo((s) => s.conclusoes);

  const cartasCorpo = cartasRegistradas.filter((c) => c.localidade === 'corpo');
  const conclusoesJanela = conclusoes.filter((c) => c.tagsOcultas.tipo === 'janela');
  const conclusoesMecanismo = conclusoes.filter((c) => c.tagsOcultas.tipo === 'mecanismo');
  const conclusoesNexo = conclusoes.filter((c) => c.origem === 'nexo');
  const itensDescuido = [
    ...cartasRegistradas.filter((c) => c.tagsOcultas.dominio === 'ambiental'),
    ...conclusoes.filter((c) => c.tagsOcultas.tipo === 'estado_cena'),
  ];
  const cartasMotivo = cartasRegistradas.filter(
    (c) =>
      c.tagsOcultas.dominio === 'comportamental' &&
      c.tagsOcultas.subDominio === 'motivo' &&
      (!libelo.reuId || c.tagsOcultas.ligadoA === libelo.reuId)
  );
  const naoAcusados = SUSPEITOS.filter((s) => s.id !== libelo.reuId);

  // Cartas que dizem respeito a um suspeito (para fundamentar o juízo periférico)
  function cartasDoSuspeito(suspeitoId) {
    return cartasRegistradas.filter(
      (c) =>
        c.tagsOcultas.declaranteId === suspeitoId ||
        c.tagsOcultas.pertenceA === suspeitoId ||
        c.tagsOcultas.ligadoA === suspeitoId
    );
  }

  function alternarLista(campo, id) {
    const lista = libelo[campo];
    atualizarLibelo({
      [campo]: lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id],
    });
  }

  function definirPeriferico(suspeitoId, parcial) {
    const atual = libelo.perifericos[suspeitoId] || { tipo: 'sem_info', cartaId: null };
    atualizarLibelo({
      perifericos: { ...libelo.perifericos, [suspeitoId]: { ...atual, ...parcial } },
    });
  }

  const podeSubmeter = libelo.reuId && libelo.evidenciasCorpoIds.length >= 1;

  // Avisos de lacuna (não bloqueiam)
  const lacunas = [];
  if (!libelo.conclusaoCronosId) lacunas.push('O libelo não diz quando a vítima morreu.');
  if (!libelo.conclusaoMecanismoId) lacunas.push('O libelo não diz como a vítima morreu.');
  if (!libelo.conclusaoNexoId) lacunas.push('Nada liga materialmente o réu ao crime.');
  if (libelo.descuidosIds.length === 0) lacunas.push('Nenhum descuido do acusado é apontado.');
  if (!libelo.motivacaoId) lacunas.push('O libelo cala sobre o móbil.');
  if (libelo.reuId && naoAcusados.some((s) => !libelo.perifericos[s.id]))
    lacunas.push('Há pessoas sobre as quais o libelo não emite juízo.');

  return (
    <Overlay titulo="Quadro de Revelações" subtitulo="O Libelo Acusatório — redigir não custa tempo" largura="max-w-3xl">
      {/* Réu */}
      <Campo titulo="I. Do réu" obrigatorio>
        <div className="flex flex-wrap gap-2">
          {SUSPEITOS.map((s) => (
            <Opcao
              key={s.id}
              ativa={libelo.reuId === s.id}
              aoClicar={() => atualizarLibelo({ reuId: libelo.reuId === s.id ? null : s.id, motivacaoId: null })}
              rotulo={s.nome}
            />
          ))}
        </div>
      </Campo>

      {/* Evidências do corpo */}
      <Campo titulo="II. Das evidências do corpo" obrigatorio>
        {cartasCorpo.length === 0 ? (
          <Vazio texto="Nenhuma evidência do corpo foi registrada." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {cartasCorpo.map((c) => (
              <Opcao
                key={c.id}
                ativa={libelo.evidenciasCorpoIds.includes(c.id)}
                aoClicar={() => alternarLista('evidenciasCorpoIds', c.id)}
                rotulo={c.termoCarimbo}
              />
            ))}
          </div>
        )}
      </Campo>

      {/* Quando / Como / Nexo */}
      <Campo titulo="III. De quando se deu a morte">
        <Selecao
          itens={conclusoesJanela}
          selecionado={libelo.conclusaoCronosId}
          aoSelecionar={(id) => atualizarLibelo({ conclusaoCronosId: id })}
          vazio="Nenhuma Janela da Morte registrada no Cronos."
        />
      </Campo>
      <Campo titulo="IV. De como se deu a morte">
        <Selecao
          itens={conclusoesMecanismo}
          selecionado={libelo.conclusaoMecanismoId}
          aoSelecionar={(id) => atualizarLibelo({ conclusaoMecanismoId: id })}
          vazio="Nenhum Mecanismo do Óbito registrado na Aitiov."
        />
      </Campo>
      <Campo titulo="V. Do nexo de presença">
        <Selecao
          itens={conclusoesNexo}
          selecionado={libelo.conclusaoNexoId}
          aoSelecionar={(id) => atualizarLibelo({ conclusaoNexoId: id })}
          vazio="Nenhum Nexo de Presença registrado."
        />
      </Campo>

      {/* Descuidos */}
      <Campo titulo="VI. Dos descuidos do acusado">
        {itensDescuido.length === 0 ? (
          <Vazio texto="Nada registrado sobre o arranjo da cena." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {itensDescuido.map((item) => (
              <Opcao
                key={item.id}
                ativa={libelo.descuidosIds.includes(item.id)}
                aoClicar={() => alternarLista('descuidosIds', item.id)}
                rotulo={item.termoCarimbo || item.titulo}
              />
            ))}
          </div>
        )}
      </Campo>

      {/* Motivação */}
      <Campo titulo="VII. Da motivação">
        {!libelo.reuId ? (
          <Vazio texto="Aponte primeiro o réu." />
        ) : (
          <Selecao
            itens={cartasMotivo.map((c) => ({ id: c.id, titulo: c.termoCarimbo, resumo: c.textoDisplay }))}
            selecionado={libelo.motivacaoId}
            aoSelecionar={(id) => atualizarLibelo({ motivacaoId: id })}
            vazio="Nenhuma carta de móbil ligada ao réu foi registrada."
          />
        )}
      </Campo>

      {/* Periféricos */}
      <Campo titulo="VIII. Dos que não se acusam">
        {!libelo.reuId ? (
          <Vazio texto="Aponte primeiro o réu." />
        ) : (
          <div className="space-y-4">
            {naoAcusados.map((s) => {
              const resposta = libelo.perifericos[s.id] || { tipo: null, cartaId: null };
              const fundamentos = cartasDoSuspeito(s.id);
              return (
                <div key={s.id} className="border border-stone-800 rounded-sm px-4 py-3">
                  <p className="font-serif text-stone-200 mb-2">{s.nome}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Object.entries(ROTULOS_PERIFERICO).map(([tipo, rotulo]) => (
                      <Opcao
                        key={tipo}
                        ativa={resposta.tipo === tipo}
                        aoClicar={() => definirPeriferico(s.id, { tipo, cartaId: tipo === 'sem_info' ? null : resposta.cartaId })}
                        rotulo={rotulo}
                      />
                    ))}
                  </div>
                  {resposta.tipo && resposta.tipo !== 'sem_info' && (
                    <div>
                      <p className="text-stone-600 text-xs mb-1">Fundamento do juízo:</p>
                      <div className="flex flex-wrap gap-2">
                        {fundamentos.length === 0 ? (
                          <Vazio texto="Nenhuma carta diz respeito a esta pessoa." />
                        ) : (
                          fundamentos.map((c) => (
                            <Opcao
                              key={c.id}
                              ativa={resposta.cartaId === c.id}
                              aoClicar={() => definirPeriferico(s.id, { cartaId: c.id })}
                              rotulo={c.termoCarimbo}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Campo>

      {/* Avisos de lacuna — nunca bloqueiam */}
      {lacunas.length > 0 && (
        <div className="mt-6 border border-amber-900/50 rounded-sm px-4 py-3">
          <p className="text-amber-200/90 text-xs tracking-[0.25em] uppercase mb-2">Lacunas do libelo</p>
          <ul className="space-y-1">
            {lacunas.map((l, i) => (
              <li key={i} className="text-stone-400 text-sm">― {l}</li>
            ))}
          </ul>
          <p className="text-stone-600 text-xs mt-2">
            Lacunas não impedem a submissão. A defesa agradece cada uma delas.
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-end items-center gap-4">
        {!podeSubmeter && (
          <p className="text-stone-600 text-xs">O libelo exige um réu e ao menos uma evidência do corpo.</p>
        )}
        <button
          onClick={submeterLibelo}
          disabled={!podeSubmeter}
          className="px-6 py-3 bg-stone-950 border border-amber-900 text-amber-200 rounded-sm tracking-wide text-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submeter o Libelo ao Tribunal
        </button>
      </div>
    </Overlay>
  );
}

function Campo({ titulo, obrigatorio, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-2">
        {titulo} {obrigatorio && <span className="text-amber-900">· obrigatório</span>}
      </h3>
      {children}
    </div>
  );
}

function Opcao({ ativa, aoClicar, rotulo }) {
  return (
    <button
      onClick={aoClicar}
      className={`px-3 py-2 rounded-sm border text-sm text-left ${
        ativa ? 'border-amber-700 bg-stone-950 text-amber-200' : 'border-stone-800 text-stone-400 hover:text-stone-200'
      }`}
    >
      {rotulo}
    </button>
  );
}

function Selecao({ itens, selecionado, aoSelecionar, vazio }) {
  if (itens.length === 0) return <Vazio texto={vazio} />;
  return (
    <div className="flex flex-wrap gap-2">
      {itens.map((item) => (
        <Opcao
          key={item.id}
          ativa={selecionado === item.id}
          aoClicar={() => aoSelecionar(selecionado === item.id ? null : item.id)}
          rotulo={`${item.titulo}: ${item.resumo}`}
        />
      ))}
    </div>
  );
}

function Vazio({ texto }) {
  return <p className="text-stone-600 text-sm">{texto}</p>;
}
