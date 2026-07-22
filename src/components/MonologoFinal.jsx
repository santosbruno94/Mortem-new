import { useState } from 'react';
import { useJogo, CUSTO_REVISAO } from '../store/jogo.js';
import { gerarMonologo, comArtigo } from '../logic/monologo.js';
import { gerarEpilogo } from '../logic/epilogo.js';
import { obterCartas, obterSuspeitos, obterLocalidades, obterCaso } from '../data/pacote_caso.js';
import { pacoteDoModo, TAMANHO_POOL } from '../data/casos.js';
import { formatRelogio, formatHora, formatDuracao, HORAS_CHEGADA_CENA } from '../logic/tempo.js';
import { tocarSom } from '../som.js';
import Overlay from './Overlay.jsx';

// A DÚVIDA DO PERITO — as lacunas do caso ditas na primeira pessoa do
// detetive (§13), não em lista de sistema: onde a conta dele ainda não
// fecha, após uma falha, com a resubmissão franqueada. Cada dica pode ter
// dois níveis: `primeira` (a de sempre) e `reincidencia`, quando o jogador
// cai no MESMO ponto pela segunda vez (falhasVistas). O marcador {nome}
// recebe o suspeito da falha, quando houver.
const DICAS_TUTORIAL = {
  reu_errado: {
    primeira: 'O réu que apontei não resiste à perícia; o corpo e os vestígios acusam outro. Devo reexaminar quem.',
  },
  corpo_sem_substancia: {
    primeira: 'A minha cadeia não se firma: falta ancorá-la em sinais do corpo de real valor pericial, não nos inconclusivos.',
  },
  sem_janela: {
    primeira: 'A hora da morte segue sem apoio nos sinais do corpo. Tenho de afirmar a janela e puxar a ela o rigor, o livor, o algor, o visto com vida.',
  },
  janela_nao_cobre: {
    primeira: 'Errei a hora do óbito: a janela que fixei não a alcança. Reúno os sinais colhidos a tempo e refaço a datação.',
  },
  janela_sem_sustentacao: {
    primeira:
      'A janela que afirmei contradiz os próprios sinais que puxei ao Quando. Corrijo a afirmação, ou revejo essas ligações.',
  },
  janela_imprecisa: {
    primeira: 'A minha janela ficou larga demais. Mais sinais temporais colhidos cedo a estreitariam.',
  },
  sem_mecanismo: {
    primeira: 'Não cravei a causa da morte. Devo afirmá-la e sustentá-la nos sinais discriminantes do corpo.',
  },
  mecanismo_errado: {
    primeira: 'Afirmei uma causa que os sinais do corpo desmentem; devo reler as lesões e repensar o que as fez.',
    reincidencia: 'Ainda não acertei a causa. Os sinais discriminantes do corpo — o aspecto da ferida, o que sangrou e o que não sangrou — dizem como, não apenas onde.',
  },
  sem_nexo: {
    primeira: 'Falta-me materialidade: nenhum vestígio põe o réu na cena. Devo puxar um à âncora Presença.',
  },
  nexo_errado: {
    primeira: 'Liguei um vestígio que não casa com o instrumento do óbito.',
  },
  nexo_acessorio: {
    primeira: 'Um dos vestígios que liguei à Presença não é do réu; devo desfazer o barbante que sobra.',
  },
  sem_motivacao: {
    primeira: 'Não apontei o móbil do réu — e há papéis que falam por ele.',
  },
  motivacao_erronea: {
    primeira: 'Apontei um móbil que não é o que move o réu.',
  },
  sem_descuidos: {
    primeira: 'A cena guarda descuidos que não expus: a hora que ela alega não bate com a que o corpo dá.',
  },
  periferico: {
    primeira: 'Devo rever o meu juízo sobre os não-acusados: cada um merece o veredicto que as cartas fundamentam.',
    reincidencia:
      'O meu juízo sobre {nome} caiu de novo. Firmar esse “inocente” pede um gesto a mais, ali mesmo na ficha do juízo: confrontar o paradeiro que declarou com o vestígio que o desmente, se esse vestígio estiver na minha mesa.',
  },
};

export default function MonologoFinal() {
  // Dados do caso corrente, lidos do PACOTE carregado no render (o caso
  // pode ter sido trocado por carregarCaso — modo procedural).
  const CARTAS = obterCartas();
  const SUSPEITOS = obterSuspeitos();
  const LOCALIDADES = obterLocalidades();
  // Total de observações possíveis no caso: o catálogo + a carta de algor
  // (gerada pela medição de temperatura).
  const TOTAL_OBSERVACOES = CARTAS.length + 1;
  const veredicto = useJogo((s) => s.veredicto);
  const detective = useJogo((s) => s.detective);
  const revisarAcusacao = useJogo((s) => s.revisarAcusacao);
  const reiniciarCaso = useJogo((s) => s.reiniciarCaso);
  const carregarCaso = useJogo((s) => s.carregarCaso);
  const escolherDetective = useJogo((s) => s.escolherDetective);

  // Sorteia um caso NOVO da comarca (≠ o atual) e cai direto na abertura dele
  // — o laço de playtest sem voltar ao título. O sorteio é da camada de
  // apresentação (Math.random permitido fora de logic/data/store); o caso
  // sorteado é, em si, determinístico por seed.
  const jogarNovoCaso = () => {
    const atualId = obterCaso().id;
    let pacote = pacoteDoModo('procedural', Math.floor(Math.random() * TAMANHO_POOL));
    for (let i = 0; pacote.id === atualId && i < TAMANHO_POOL; i++) {
      pacote = pacoteDoModo('procedural', Math.floor(Math.random() * TAMANHO_POOL));
    }
    tocarSom('lacre');
    carregarCaso(pacote);
    escolherDetective();
  };
  const horasJogo = useJogo((s) => s.horasJogo);
  const nosVisitados = useJogo((s) => s.nosVisitados);
  const nosDesbloqueados = useJogo((s) => s.nosDesbloqueados);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const nSubmissoes = useJogo((s) => s.nSubmissoes);
  const falhasVistas = useJogo((s) => s.falhasVistas);
  const [encerrando, setEncerrando] = useState(false);

  if (!veredicto) return null;
  const vitoria = veredicto.tipo === 'vitoria_absoluta';
  // Enquanto a retentativa está de pé, o Erro Judiciário NÃO nomeia o
  // verdadeiro autor — o nome só sai no encerramento definitivo (Q2).
  const monologo = gerarMonologo(veredicto, detective, { nomearCulpado: false });

  // Dicas únicas, na ordem das falhas. Na segunda queda no mesmo ponto
  // (falhasVistas), a dica escala para a versão mais específica; {nome}
  // recebe o suspeito da falha, quando a falha o traz.
  const dicas = [
    ...new Set(
      veredicto.falhas
        .map((f) => {
          const dica = DICAS_TUTORIAL[f.codigo];
          if (!dica) return null;
          const reincidiu = (falhasVistas[f.codigo] || 0) >= 2;
          const texto = reincidiu && dica.reincidencia ? dica.reincidencia : dica.primeira;
          if (!texto.includes('{nome}')) return texto;
          const sp = SUSPEITOS.find((s) => s.id === f.suspeitoId);
          // comArtigo: nome titulado pede artigo em meio de frase ("a Sra. …"),
          // mesma convenção do monólogo vizinho.
          return sp ? texto.replaceAll('{nome}', comArtigo(sp.nome)) : null;
        })
        .filter(Boolean)
    ),
  ];

  // ---------------- O encerramento: epílogo + retrato (Q5) ----------------
  if (encerrando) {
    const epilogo = gerarEpilogo(veredicto, { horasSelo: horasJogo });
    const duracao = horasJogo - HORAS_CHEGADA_CENA;
    // O que ficou por abrir: só nós que o jogador CHEGOU a desbloquear —
    // nomear um lugar nunca revelado entregaria conteúdo de graça.
    const porVisitar = LOCALIDADES.filter(
      (loc) => nosDesbloqueados.includes(loc.id) && !nosVisitados.includes(loc.id)
    ).map((loc) => loc.rotuloMesa);
    return (
      <Overlay titulo={`${monologo.titulo} — Epílogo`} subtitulo="O caso, selado">
        {/* O título do desfecho vive no header do Overlay (serif, gravado);
            aqui, só o ornamento de abertura e o epílogo em coluna de leitura */}
        <div className="divisor-ornado text-sm mb-6" aria-hidden="true">❦</div>
        <div className="max-w-prose mx-auto space-y-4">
          {epilogo.blocos.map((b, i) => (
            <p key={i} className="font-serif text-stone-200 text-lg leading-relaxed">
              {b}
            </p>
          ))}
        </div>

        {/* O retrato da investigação: etiquetas de balanço, rotuladas a latão */}
        <div className="mt-8 max-w-prose mx-auto border border-latao/40 bg-stone-950/40 rounded-sm px-4 py-3">
          <p className="text-rotulo uppercase text-latao-claro/70 mb-2">
            O retrato da investigação
          </p>
          <ul className="space-y-1.5 text-sm text-stone-300">
            <li><span className="text-latao-claro/60" aria-hidden="true">―</span> Chegada às {formatHora(HORAS_CHEGADA_CENA)}; caso selado em {formatRelogio(horasJogo)} — {formatDuracao(duracao)} de investigação.</li>
            <li><span className="text-latao-claro/60" aria-hidden="true">―</span> {nosVisitados.length} de {LOCALIDADES.length} lugares visitados.</li>
            {porVisitar.length > 0 && (
              <li><span className="text-latao-claro/60" aria-hidden="true">―</span> Ficou por visitar: {porVisitar.join(', ')}.</li>
            )}
            <li><span className="text-latao-claro/60" aria-hidden="true">―</span> {cartasRegistradas.length} de {TOTAL_OBSERVACOES} observações registradas na mesa.</li>
            <li><span className="text-latao-claro/60" aria-hidden="true">―</span> {nSubmissoes === 1 ? 'Uma acusação levada a julgamento.' : `${nSubmissoes} acusações levadas a julgamento.`}</li>
          </ul>
        </div>

        {/* O gancho de replay: o mesmo caso admite outra leitura. Convida a
            uma segunda tentativa — atrás da Vitória Absoluta, se o desfecho
            ficou aquém dela. */}
        <div className="mt-8 max-w-prose mx-auto text-center">
          <p className="font-serif italic text-stone-400 text-sm leading-relaxed" data-convite-replay>
            {vitoria
              ? 'O caso está selado sem uma falha. Fechar o caderno o devolve ao começo — outro método, outra ordem de perguntas, e a vila responde diferente.'
              : 'A verdade coube, mas não inteira. Fechar o caderno recomeça o caso do zero: outro caminho de perguntas pode alcançar a Vitória Absoluta.'}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button onClick={jogarNovoCaso} className="botao-mesa" data-novo-caso>
            Novo caso
          </button>
          <button
            onClick={() => {
              // O caderno fecha de vez: apaga o save antes do reload, para a
              // página recarregada cair no convite limpo (não na retomada).
              reiniciarCaso();
              window.location.reload();
            }}
            className="botao-mesa botao-mesa--quieto"
          >
            Fechar o caderno
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay titulo={monologo.titulo} subtitulo="O monólogo do detetive">
      {/* O clímax: o título gravado vem do header do Overlay; o monólogo
          desce em coluna de leitura serifada, confortável */}
      <div className="divisor-ornado text-sm mb-6" aria-hidden="true">❦</div>
      <div className="max-w-prose mx-auto space-y-4">
        {monologo.blocos.map((b, i) => (
          <p key={i} className="font-serif text-stone-200 text-lg leading-relaxed">
            {b}
          </p>
        ))}
      </div>

      {!vitoria && dicas.length > 0 && (
        <div className="mt-8 max-w-prose mx-auto border border-latao/40 bg-stone-950/40 rounded-sm px-4 py-3">
          <p className="text-rotulo uppercase text-latao-claro/80 mb-2">
            Onde a minha conta ainda não fecha
          </p>
          <ul className="space-y-1.5">
            {dicas.map((d, i) => (
              <li key={i} className="text-stone-300 text-sm leading-relaxed">
                <span className="text-latao-claro/60" aria-hidden="true">―</span> {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        {!vitoria && (
          <button
            onClick={revisarAcusacao}
            className="placa-latao px-5 py-2 rounded-sm font-serif text-sm tracking-wide"
          >
            Revisar a acusação · adia a audiência em {formatDuracao(CUSTO_REVISAO)}
          </button>
        )}
        <button
          onClick={() => {
            tocarSom('lacre');
            setEncerrando(true);
          }}
          className={vitoria ? 'botao-mesa' : 'botao-mesa botao-mesa--quieto'}
        >
          Encerrar o caso
        </button>
      </div>
    </Overlay>
  );
}
