import Planta from './Planta.jsx';
import { PLANTA_RELOJOARIA } from '../data/planta_relojoaria.js';

// A planta da relojoaria (§5.1) é hoje um caso particular da planta
// generalizada (Planta.jsx, OS Vila Viva E1): o MODO NÓ, em que cada
// cômodo tem `alvos`. Desde a OS-R2 quase todos esses alvos são SUB-LOCAIS
// do nó único `relojoaria` (andar dentro do prédio); só a saleta continua
// a ser viagem entre nós do grupo (custo 0). Este wrapper apenas amarra a
// planta estática do caso-escola; o desenho, o boil e a navegação vivem em
// Planta.jsx.
export default function PlantaRelojoaria({ localidadeAtual, subLocalAtual }) {
  return <Planta planta={PLANTA_RELOJOARIA} localidadeAtual={localidadeAtual} subLocalAtual={subLocalAtual} />;
}
