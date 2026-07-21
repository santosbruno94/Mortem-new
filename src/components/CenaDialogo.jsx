import RetratoPersonagem from './RetratoPersonagem.jsx';
import FundoCena, { tipoCenaDe } from './FundoCena.jsx';

// =====================================================================
// CENA DE DIÁLOGO — a composição ilustrada do interlocutor (Sistema 2).
//
// Fundo 2D da localidade (gravura paramétrica) + sprite meio-corpo do
// interrogado, derivado do MESMO genótipo de aparência. Estados de
// apresentação:
//   • "gravura que respira": micro-boil do traço (steps, baixa frequência;
//     congela sob prefers-reduced-motion) — o equivalente de época ao
//     tremido de quadros da referência;
//   • "reação observável": quando o perito confronta e o interrogado reage,
//     o sprite desvia de leve (gesto de gravura, NUNCA legenda acusatória —
//     a regra "reação observável, nunca confissão" continua valendo).
//
// APRESENTAÇÃO PURA: nada aqui é lido pelo motor. O sprite carrega
// data-retrato (contrato do qa-ui) como o medalhão de sempre.
// =====================================================================

export default function CenaDialogo({ personagemId, localidadeId, grupo, reacao = false }) {
  if (!personagemId) return null;
  const tipo = tipoCenaDe(localidadeId, grupo);
  return (
    <div
      className="cena-dialogo relative rounded-sm overflow-hidden border border-latao/30 mb-4 shadow-pousado"
      data-cena-dialogo
    >
      <div className="absolute inset-0">
        <FundoCena tipo={tipo} className="w-full h-full" />
      </div>
      <div className="relative flex items-end justify-end h-36 sm:h-44 pr-3 sm:pr-8">
        <div className={`cena-sprite ${reacao ? 'cena-sprite--reacao' : ''}`}>
          <div className="gravura-respira">
            <RetratoPersonagem personagemId={personagemId} variante="cena" tamanho={140} className="block" />
          </div>
        </div>
      </div>
    </div>
  );
}
