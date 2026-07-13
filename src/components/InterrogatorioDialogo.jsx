import { useState } from 'react';
import { useJogo } from '../store/jogo.js';
import { interpolar } from '../logic/interpolar.js';
import { obterLocalidade } from '../data/localidades.js';
import { obterDialogo } from '../data/dialogos.js';
import { obterNo } from '../data/mapa.js';
import { ParagrafoProsa } from './ProsaComTermos.jsx';
import PlantaRelojoaria from './PlantaRelojoaria.jsx';
import RetratoPersonagem from './RetratoPersonagem.jsx';
import { PERSONAGEM_POR_LOCALIDADE } from '../data/aparencias.js';
import Overlay from './Overlay.jsx';

// Interrogatório como DIÁLOGO (§7.1): substitui a prosa estática dos nós de
// interrogatório por uma árvore ramificada determinística. O perito escolhe
// o assunto (navegação livre — relógio mole) e, quando tem a prova na mesa,
// pode CONFRONTAR o suspeito (opção `requerCarta`, oculta até a carta existir).
// As falas surgem cartas pelo mesmo mecanismo `[[id]]` das localidades; o
// motor não muda. O nó corrente é estado local (reabrir começa no início);
// o "já perguntado" persiste no store (nosVisitadosDialogo, dado puro).
export default function InterrogatorioDialogo({ localidadeId }) {
  const detective = useJogo((s) => s.detective);
  const cartasRegistradas = useJogo((s) => s.cartasRegistradas);
  const nosVisitadosDialogo = useJogo((s) => s.nosVisitadosDialogo);
  const visitarNoDialogo = useJogo((s) => s.visitarNoDialogo);

  const localidade = obterLocalidade(localidadeId);
  const dialogo = obterDialogo(localidadeId);
  const [noAtual, setNoAtual] = useState(dialogo?.noInicial);
  if (!localidade || !dialogo) return null;

  const no = dialogo.nos[noAtual];
  const visitados = nosVisitadosDialogo[dialogo.suspeitoId] || [];
  const temCarta = (id) => cartasRegistradas.some((c) => c.id === id);

  const irPara = (destino) => {
    setNoAtual(destino);
    visitarNoDialogo(dialogo.suspeitoId, destino);
  };

  const personagemDaCena = PERSONAGEM_POR_LOCALIDADE[localidade.id];
  // A saleta é da relojoaria: a planta baixa (§5.1) também sobe aqui.
  const naRelojoaria = obterNo(localidade.id)?.grupo === 'relojoaria';

  // Confrontos ficam ocultos até a prova estar na mesa (decisão de design).
  const opcoesVisiveis = (no.opcoes || []).filter((op) => !op.requerCarta || temCarta(op.requerCarta));

  return (
    <Overlay
      titulo={interpolar(localidade.titulo, detective)}
      subtitulo={localidade.subtitulo}
      marca="dialogo"
    >
      {naRelojoaria && <PlantaRelojoaria localidadeAtual={localidade.id} />}

      {/* Retrato de quem o perito interroga — camada visual, decorativa */}
      {personagemDaCena && (
        <div className="float-right ml-4 mb-2 border border-latao/40 rounded-sm shadow-pousado">
          <RetratoPersonagem personagemId={personagemDaCena} tamanho={84} className="block" />
        </div>
      )}

      {/* A fala corrente do suspeito (com os termos extraíveis) */}
      <div data-no-dialogo={noAtual} className="space-y-3">
        {no.fala.map((t, i) => (
          <ParagrafoProsa key={`${noAtual}_${i}`} texto={t} />
        ))}
      </div>

      {/* As escolhas do perito: assuntos e confrontos */}
      <div className="mt-6 space-y-2" data-opcoes-dialogo>
        {opcoesVisiveis.map((op) => {
          const ehConfronto = !!op.requerCarta;
          const ehVoltar = op.vaiPara === dialogo.noInicial;
          const jaVisto = !ehConfronto && !ehVoltar && visitados.includes(op.vaiPara);
          return (
            <button
              key={op.rotulo}
              type="button"
              className={`opcao-dialogo ${ehConfronto ? 'opcao-dialogo--confronto' : ''} ${
                ehVoltar ? 'opcao-dialogo--voltar' : ''
              }`}
              data-confronto={ehConfronto ? '' : undefined}
              onClick={() => irPara(op.vaiPara)}
            >
              <span className="opcao-marca" aria-hidden>
                {ehConfronto ? '❦' : ehVoltar ? '↩' : jaVisto ? '§' : '›'}
              </span>
              <span className="opcao-rotulo-texto">{interpolar(op.rotulo, detective)}</span>
              {jaVisto && <span className="opcao-visto">já perguntado</span>}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-stone-400 text-xs italic font-serif tracking-wide">
        Apresentar uma prova exige tê-la registrado na mesa. Interrogar não custa tempo; o relógio
        só corre quando você viaja.
      </p>
    </Overlay>
  );
}
