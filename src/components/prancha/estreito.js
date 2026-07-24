import { useEffect, useState } from 'react';

// =====================================================================
// O ESTREITO — a tela de dedo, onde a prancha vira SÓ FIGURA e a
// navegação desce para a régua de fichas (E4 da OS Prancha da Vila).
//
// O limiar é o mesmo do desenho de referência: 430px de largura. Acima
// dele, as etiquetas de papel continuam pousadas sobre a gravura.
// =====================================================================
export const LIMITE_ESTREITO = 430;

export function useEstreito(limite = LIMITE_ESTREITO) {
  const [estreito, setEstreito] = useState(() => {
    try {
      return window.matchMedia(`(max-width: ${limite}px)`).matches;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    let consulta;
    try {
      consulta = window.matchMedia(`(max-width: ${limite}px)`);
    } catch {
      return undefined;
    }
    const aoMudar = (e) => setEstreito(e.matches);
    setEstreito(consulta.matches);
    consulta.addEventListener('change', aoMudar);
    return () => consulta.removeEventListener('change', aoMudar);
  }, [limite]);
  return estreito;
}
