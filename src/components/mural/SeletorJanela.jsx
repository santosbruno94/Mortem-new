// Conversão da escala absoluta (horas desde a meia-noite de 14/out;
// negativas = 13/out) para o relógio humano (dia 13/14 + hora).
function deAbsoluto(abs) {
  return { dia: 14 + Math.floor(abs / 24), hora: ((abs % 24) + 24) % 24 };
}

// ---------------------------------------------------------------------
// Seletor de janela: DOIS seletores (início e fim), cada um com dia+hora
// combinados numa lista só (Q9 — menos burocracia que os quatro antigos).
// O intervalo oferecido é o que faz sentido no caso: da meia-noite de
// 13/out à chegada do perito (13h de 14/out) — a morte não pode ser
// posterior ao corpo achado.
// ---------------------------------------------------------------------
const HORA_MIN_JANELA = -24; // 00h de 13/out
const HORA_MAX_JANELA = 13; // 13h de 14/out (chegada à cena)

function rotuloHoraAbs(abs) {
  const { dia, hora } = deAbsoluto(abs);
  return `dia ${dia} · ${String(hora).padStart(2, '0')}h`;
}

export default function SeletorJanela({ acusacao, definirJanela }) {
  const opcoes = [];
  for (let h = HORA_MIN_JANELA; h <= HORA_MAX_JANELA; h++) opcoes.push(h);
  const classe = 'campo-vitoriano text-xs';
  const inicio = acusacao.janela.inicio;
  const linha = (rotulo, bound) => {
    // QOL: a hora-fim nunca vem antes da início — as horas inválidas somem do
    // seletor de Fim (rola direto para depois do início). Só camada de UI.
    const opcoesLinha = bound === 'fim' && inicio != null ? opcoes.filter((h) => h >= inicio) : opcoes;
    return (
      <div className="flex items-center gap-1">
        <span className="text-stone-400 text-[10px] w-10">{rotulo}</span>
        {/* aria-label associa o rótulo visual (um span solto) ao select para
            leitores de tela. A ORDEM dos dois selects é contrato do qa-ui —
            não reordenar. */}
        <select
          className={classe}
          aria-label={`${rotulo} da janela da morte`}
          value={acusacao.janela[bound] != null ? String(acusacao.janela[bound]) : ''}
          onChange={(e) => {
            if (e.target.value === '') return;
            const v = Number(e.target.value);
            // Mover a início para frente do fim já escolhido invalida-o: refazê-lo.
            if (bound === 'inicio' && acusacao.janela.fim != null && acusacao.janela.fim < v)
              definirJanela({ inicio: v, fim: null });
            else definirJanela({ [bound]: v });
          }}
        >
          <option value="">— escolher —</option>
          {opcoesLinha.map((h) => (
            <option key={h} value={h}>
              {rotuloHoraAbs(h)}
            </option>
          ))}
        </select>
      </div>
    );
  };
  return (
    <div className="space-y-1">
      {linha('Início', 'inicio')}
      {linha('Fim', 'fim')}
    </div>
  );
}
