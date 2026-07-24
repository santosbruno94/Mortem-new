import { obterSuspeitos, obterVerdadeDeOuro } from '../../data/pacote_caso.js';
import { CATALOGO_CAUSAS } from '../../data/catalogo_causas.js';
import { formatJanela } from '../../logic/tempo.js';
import { deQuem } from '../../logic/monologo.js';

// =====================================================================
// A FOLHA DO INQUÉRITO — o formulário do inquérito pregado no mural.
//
// Espelho de leitura: mostra, em quatro claros numerados, as quatro coisas
// que a acusação AFIRMA (réu, janela, causa, móbil). Não julga, não sugere,
// não valida — o que ainda não foi dito aparece como claro por preencher.
//
// APRESENTAÇÃO PURA: só lê o objeto `acusacao` que o mural já tem em mão;
// nenhuma regra depende desta folha, e nada aqui escreve no estado.
// =====================================================================

// Um claro do formulário: numeral, o que se pede e o que foi afirmado.
function Lacuna({ numeral, pedido, valor }) {
  const dito = !!valor;
  return (
    <li className="flex items-baseline gap-2">
      <span className="font-rotulo text-[10px] tracking-widest text-tinta-apagada w-6 shrink-0 text-right">
        {numeral}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-rotulo uppercase text-tinta-apagada">{pedido}</span>
        <span
          className={`block border-b border-dotted border-tinta-apagada/70 pb-0.5 font-serif italic text-sm leading-snug ${
            dito ? 'text-tinta' : 'text-tinta-apagada'
          }`}
        >
          {dito ? valor : '— por afirmar —'}
        </span>
      </span>
    </li>
  );
}

export default function FormularioInquerito({ acusacao, cartas }) {
  const reu = obterSuspeitos().find((s) => s.id === acusacao.reuId);
  const janelaFechada = acusacao.janela.inicio != null && acusacao.janela.fim != null;
  const causa = CATALOGO_CAUSAS.find((c) => c.id === acusacao.causaId);
  const mobil = cartas.find((c) => c.id === acusacao.motivacaoId);

  return (
    <div className="carta-pergaminho relative rounded-sm px-4 pt-5 pb-4 -rotate-[0.3deg]">
      {/* As duas tachas que pregam a folha na cortiça */}
      <span className="tacha-latao absolute -top-1 left-4 w-2.5 h-2.5" aria-hidden="true" />
      <span className="tacha-latao absolute -top-1 right-4 w-2.5 h-2.5" aria-hidden="true" />

      <p className="text-rotulo uppercase text-tinta-apagada">Folha do inquérito</p>
      {/* `deQuem` contrai a preposição com o artigo do nome titulado:
          "do Sr. Arthurs", mas "de Albert Hall". */}
      <h3 className="font-titulo text-[15px] leading-tight text-tinta mt-0.5">
        Sobre a morte {deQuem(obterVerdadeDeOuro().vitima)}
      </h3>
      <div className="divisor-ornado divisor-ornado--tinta text-[10px] mt-1" aria-hidden="true">§</div>

      <ol className="mt-2 space-y-2.5">
        <Lacuna numeral="I" pedido="O réu nomeado" valor={reu ? reu.nome : null} />
        <Lacuna
          numeral="II"
          pedido="A janela afirmada"
          valor={janelaFechada ? formatJanela(acusacao.janela) : null}
        />
        <Lacuna numeral="III" pedido="A causa cravada" valor={causa ? causa.nome : null} />
        <Lacuna numeral="IV" pedido="O móbil apontado" valor={mobil ? mobil.termoCarimbo : null} />
      </ol>

      <div className="flex items-end justify-between gap-3 mt-4">
        <p className="text-tinta-clara text-[11px] leading-snug font-serif italic max-w-[74%]">
          O que se afirmou até aqui.
        </p>
        {/* O lacre prensado: as letras são RELEVO, não tinta — luz fraca por
            cima da cera, como a matriz deixaria. */}
        <span
          className="selo-lacre shrink-0 w-11 h-11 grid place-items-center font-rotulo text-[7px] tracking-[0.14em] -rotate-6"
          style={{ color: 'rgba(255,218,188,0.42)', textShadow: '0 1px 0 rgba(0,0,0,0.5)' }}
          aria-hidden="true"
        >
          MORTEM
        </span>
      </div>
    </div>
  );
}
