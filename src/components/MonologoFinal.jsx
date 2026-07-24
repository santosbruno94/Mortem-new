import { useState } from 'react';
import { useJogo, CUSTO_REVISAO } from '../store/jogo.js';
import { gerarMonologo, comArtigo, TITULOS } from '../logic/monologo.js';
import { gerarEpilogo } from '../logic/epilogo.js';
import {
  obterCartas,
  obterSuspeitos,
  obterLocalidades,
  obterCaso,
  obterParametrosCena,
} from '../data/pacote_caso.js';
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

// =====================================================================
// A FILEIRA DE CARIMBOS — os quatro desfechos são carimbos da mesma
// prensa; só o que se alcançou sai entintado em cera, os outros ficam em
// contorno apagado. Apresentação pura: nenhuma regra lê esta fileira, e
// os nomes vêm do próprio motor (TITULOS), na ordem em que ele os declara.
// =====================================================================
function CarimbosDesfecho({ tipo }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 mb-4">
      {Object.entries(TITULOS).map(([chave, rotulo]) => {
        const alcancado = chave === tipo;
        return (
          <span
            key={chave}
            className={`font-rotulo uppercase text-[8.5px] rounded-[2px] px-2.5 py-1 leading-none ${
              alcancado
                ? 'tracking-[0.22em] bg-cera border border-cera-clara text-[#e8c9b0] shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
                : 'tracking-[0.18em] border border-[#4a4238] text-[#6f6455]'
            }`}
          >
            {rotulo}
          </span>
        );
      })}
    </div>
  );
}

// =====================================================================
// A FOLHA DO JORNAL — o epílogo diagramado como o semanário do condado o
// noticiaria. Custo zero de motor: o texto é o mesmo do epílogo, só que
// repartido em duas vozes que a diagramação já separava por natureza —
// as COLUNAS (o que os autos tornaram público, terceira pessoa) e a
// MARGEM (o que o perito anotou a lápis na folha que guardou).
//
// Vila sem mercado não sustenta jornal: a folha é DO CONDADO, e a cabeça
// de página fala por toda a comarca — vocabulário que o epílogo já usa.
//
// A cabeça NÃO traz data, de propósito. O tribunal de circuito visitava o
// condado semanas depois do inquérito, e a coluna narra a sessão
// cumprida: qualquer data derivada do relógio do jogo dataria a folha na
// véspera de um julgamento que ela já noticia. Sem dado de assizes no
// pacote, o lugar da data fica com a periodicidade, que é verdade sempre.
//
// O dia é SÁBADO porque é o que a prosa do jogo já fixou: "Sexta é véspera
// de feira" (cartas.js) e o moinho carregando "em pleno sábado, que a feira
// não espera defunto" (dialogos.js) — e 14 de outubro de 1893 caiu mesmo
// num sábado. O semanário sai no dia de feira, quando a comarca inteira
// está na praça para comprá-lo.
// =====================================================================

// Milhar com ponto, sem depender de ICU: 1728 → "1.728".
function comMilhar(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function FolhaDeJornal({ epilogo }) {
  return (
    <div className="carta-pergaminho relative rounded-sm max-w-[660px] mx-auto px-4 sm:px-7 pt-5 pb-5">
      {/* O lacre do arquivo, prensado no canto: as letras são RELEVO na
          cera, não tinta — a mesma convenção da folha do inquérito. */}
      <span
        className="selo-lacre absolute -top-3.5 right-4 w-[52px] h-[52px] grid place-items-center rotate-[9deg]"
        aria-hidden="true"
      >
        <span
          className="font-rotulo text-[6px] tracking-[0.16em]"
          style={{ color: 'rgba(255,218,188,0.45)', textShadow: '0 1px 0 rgba(0,0,0,0.5)' }}
        >
          SELADO
        </span>
      </span>

      <p className="font-serif text-center text-[19px] sm:text-[27px] tracking-[0.06em] leading-none text-tinta pr-12 sm:pr-0">
        O MENSAGEIRO DO CONDADO
      </p>
      <div className="flex items-center justify-between gap-2 border-y-[1.5px] border-tinta mt-2 mb-3 py-[3px]">
        <p className="font-rotulo uppercase text-[7.5px] tracking-[0.2em] text-tinta-clara">
          Nº {comMilhar(epilogo.numeroEdicao)}
        </p>
        <p className="font-rotulo uppercase text-[7.5px] tracking-[0.2em] text-tinta-clara text-center">
          Publicado aos sábados, dia de feira
        </p>
        <p className="font-rotulo uppercase text-[7.5px] tracking-[0.2em] text-tinta-clara">Preço: um pêni</p>
      </div>

      {/* O corpo da folha: uma coluna no celular, duas no papel largo. O
          corpo desce de 15px para 14px ao repartir em duas — a medida da
          coluna encurta, e a linha continua na conta de leitura.
          A cabeça da matéria entra DENTRO do fluxo: em 1893 ela cabe na
          medida de uma coluna, e é a rotativa do fim do século que lhe dá
          licença de atravessar a página. */}
      <div className="coluna-jornal font-prosa text-[15px] sm:text-[14px] leading-[1.7] border-t border-papel-borda pt-2.5">
        {epilogo.manchete && (
          <header className="cabeca-materia text-center mb-3">
            <h3 className="font-titulo uppercase text-[13px] sm:text-[14px] leading-tight text-tinta">
              {epilogo.manchete}
            </h3>
            {epilogo.decks.map((d, i) => (
              <div key={i}>
                <div className="filete-deck" aria-hidden="true" />
                <p className="font-rotulo uppercase text-[8.5px] tracking-[0.09em] leading-snug text-tinta-clara">
                  {d}
                </p>
              </div>
            ))}
            {epilogo.credito && (
              <p className="font-serif italic text-[11px] leading-snug text-tinta-apagada mt-1.5">
                {epilogo.credito}
              </p>
            )}
          </header>
        )}
        {epilogo.colunas.map((b, i) => (
          <p key={i} className={`mb-2.5 last:mb-0${i === 0 ? ' abre-coluna' : ''}`}>
            {b}
          </p>
        ))}
      </div>
    </div>
  );
}

// A MARGEM DA FOLHA — o que o perito escreveu a lápis no exemplar que
// guardou: a hora que o corpo cobrou, o autor a quem o processo nunca
// chegou, a conta dos honorários. A imprensa não podia imprimir nada
// disto; a folha dele carrega assim mesmo.
function MargemDoPerito({ blocos }) {
  return (
    <div className="max-w-[660px] mx-auto mt-5 pl-4 border-l border-dashed border-latao/45">
      <p className="text-rotulo uppercase text-latao-claro/60 mb-1.5">A lápis, na margem</p>
      <div className="space-y-2">
        {blocos.map((b, i) => (
          <p key={i} className="font-serif italic text-stone-400 text-[14px] leading-relaxed">
            {b}
          </p>
        ))}
      </div>
    </div>
  );
}

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
  const jogarNovoCaso = async () => {
    const atualId = obterCaso().id;
    let pacote = await pacoteDoModo('procedural', Math.floor(Math.random() * TAMANHO_POOL));
    for (let i = 0; pacote.id === atualId && i < TAMANHO_POOL; i++) {
      pacote = await pacoteDoModo('procedural', Math.floor(Math.random() * TAMANHO_POOL));
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
    // A hora de chegada é do CASO, não do motor: `HORAS_CHEGADA_CENA` é o
    // default do caso-escola (13h), e os casos gerados chegam às 9h ou 11h.
    // Imprimir 13h em todos punha o retrato a mentir a hora e a somar errado
    // a duração — a verdade está em `parametrosCena.horasChegada`.
    const horasChegada = obterParametrosCena()?.horasChegada ?? HORAS_CHEGADA_CENA;
    const duracao = horasJogo - horasChegada;
    // O que ficou por abrir: só nós que o jogador CHEGOU a desbloquear —
    // nomear um lugar nunca revelado entregaria conteúdo de graça.
    const porVisitar = LOCALIDADES.filter(
      (loc) => nosDesbloqueados.includes(loc.id) && !nosVisitados.includes(loc.id)
    ).map((loc) => loc.rotuloMesa);
    return (
      <Overlay
        titulo={`${monologo.titulo} — Epílogo`}
        subtitulo="O caso, selado"
        largura="max-w-3xl"
        climax
      >
        <CarimbosDesfecho tipo={veredicto.tipo} />
        <div className="divisor-ornado text-sm mb-5" aria-hidden="true">❦</div>

        <FolhaDeJornal epilogo={epilogo} />
        {epilogo.margem.length > 0 && <MargemDoPerito blocos={epilogo.margem} />}

        {/* O retrato da investigação: o balanço fica FORA da folha, na
            placa de latão de sempre — o jornal noticia o caso, não a
            perícia de quem o fechou. Rediagramado em duas colunas,
            neutro, sem nota e sem estrelas. */}
        <div className="mt-6 max-w-[660px] mx-auto border border-latao/40 bg-stone-950/50 rounded-sm px-4 py-3">
          <p className="text-rotulo uppercase text-latao-claro/70 mb-2">
            O retrato da investigação
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-[12.5px] text-stone-300 leading-relaxed">
            <p><span className="text-latao-claro/60" aria-hidden="true">―</span> Chegada às {formatHora(horasChegada)}; caso selado em {formatRelogio(horasJogo)}.</p>
            <p><span className="text-latao-claro/60" aria-hidden="true">―</span> {formatDuracao(duracao)} de investigação.</p>
            <p>
              <span className="text-latao-claro/60" aria-hidden="true">―</span> {nosVisitados.length} de {LOCALIDADES.length} lugares visitados.
              {porVisitar.length > 0 && ` Ficou por visitar: ${porVisitar.join(', ')}.`}
            </p>
            <p><span className="text-latao-claro/60" aria-hidden="true">―</span> {cartasRegistradas.length} de {TOTAL_OBSERVACOES} observações na mesa · {nSubmissoes === 1 ? 'uma acusação levada' : `${nSubmissoes} acusações levadas`} a julgamento.</p>
          </div>
        </div>

        {/* O gancho de replay: o mesmo caso admite outra leitura. Convida a
            uma segunda tentativa — atrás da Vitória Absoluta, se o desfecho
            ficou aquém dela. */}
        <div className="mt-6 max-w-[660px] mx-auto text-center">
          <p className="font-serif italic text-stone-400 text-sm leading-relaxed" data-convite-replay>
            {vitoria
              ? 'O caso está selado sem uma falha. Fechar o caderno o devolve ao começo — outro método, outra ordem de perguntas, e a vila responde diferente.'
              : 'A verdade coube, mas não inteira. Fechar o caderno recomeça o caso do zero: outro caminho de perguntas pode alcançar a Vitória Absoluta.'}
          </p>
        </div>

        <div className="mt-5 max-w-[660px] mx-auto flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-3">
          <button onClick={jogarNovoCaso} className="botao-mesa min-h-[44px]" data-novo-caso>
            Novo caso
          </button>
          <button
            onClick={() => {
              // O caderno fecha de vez: apaga o save antes do reload, para a
              // página recarregada cair no convite limpo (não na retomada).
              reiniciarCaso();
              window.location.reload();
            }}
            className="botao-mesa botao-mesa--quieto min-h-[44px]"
          >
            Fechar o caderno
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay titulo={monologo.titulo} subtitulo="O monólogo do detetive" climax>
      {/* O clímax: o desfecho gravado vem do header do Overlay; aqui, a
          fileira de carimbos, o ornamento e o monólogo em coluna de
          leitura sóbria — nada compete com o texto. */}
      <CarimbosDesfecho tipo={veredicto.tipo} />
      <div className="divisor-ornado text-sm mb-6" aria-hidden="true">❦</div>
      <div className="max-w-[600px] mx-auto space-y-3.5">
        {monologo.blocos.map((b, i) => (
          <p key={i} className="font-prosa text-stone-200 text-[15px] sm:text-[16.5px] leading-[1.85]">
            {b}
          </p>
        ))}
      </div>

      {!vitoria && dicas.length > 0 && (
        <div className="mt-8 max-w-[600px] mx-auto border border-latao/40 bg-stone-950/50 rounded-sm px-4 py-3">
          <p className="text-rotulo uppercase text-latao-claro/80 mb-2">
            Onde a minha conta ainda não fecha
          </p>
          <ul className="space-y-2">
            {dicas.map((d, i) => (
              <li key={i} className="text-stone-300 text-[13px] sm:text-sm leading-relaxed">
                <span className="text-latao-claro/60" aria-hidden="true">―</span> {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 max-w-[600px] mx-auto flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-3">
        {!vitoria && (
          <button
            onClick={revisarAcusacao}
            className="placa-latao px-5 py-2 min-h-[48px] rounded-sm font-serif text-sm tracking-wide"
          >
            Revisar a acusação · adia a audiência em {formatDuracao(CUSTO_REVISAO)}
          </button>
        )}
        <button
          onClick={() => {
            tocarSom('lacre');
            setEncerrando(true);
          }}
          className={`min-h-[44px] ${vitoria ? 'botao-mesa' : 'botao-mesa botao-mesa--quieto'}`}
        >
          Encerrar o caso
        </button>
      </div>
    </Overlay>
  );
}
