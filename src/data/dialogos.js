// =====================================================================
// Interrogatórios como diálogo (§7.1). CAMADA NARRATIVA: esta árvore pode
// referenciar ids de carta (`requerCarta`, marcadores `[[id]]`) — a
// restrição "só tags" vale para src/logic/. O motor JAMAIS lê este arquivo;
// as cartas de depoimento continuam nascendo pelo mesmo mecanismo `[[id]]`
// com as tags que já têm (src/data/cartas.js), e o veredicto não muda.
//
// Forma de cada suspeito:
//   { suspeitoId, noInicial, nos: { [noId]: { fala: [parágrafos], opcoes } } }
// Forma de cada opção (a escolha do perito):
//   { rotulo, vaiPara }                       — muda de nó (navegação livre)
//   { rotulo, vaiPara, requerCarta: 'id' }    — CONFRONTO: a opção só aparece
//                                               com a carta registrada na mesa
//
// A prosa admite `{detective.campo}` e a flexão `{g:masc|fem}`; os
// marcadores `[[id]]` na fala extraem a carta (carimbo integrado, §6).
// Navegar não custa tempo (relógio mole); reler nós já visitados é livre.
// =====================================================================

const OUTRO_ASSUNTO = { rotulo: '— outro assunto —', vaiPara: 'abertura' };

export const DIALOGOS = {
  interrogatorio_silas: {
    suspeitoId: 'silas_crane',
    noInicial: 'abertura',
    nos: {
      // O hub: Silas recebe o perito. A observação do narrador revela a lasca
      // de vidro na bainha (a carta de presença, sempre alcançável aqui).
      abertura: {
        fala: [
          'Silas Crane recebe na saleta, o avental de couro dobrado sobre o braço. Traz chá sem que se peça e senta-se na beira da cadeira, as mãos quietas sobre os joelhos. "Com licença de dizer, {detective.title}, o senhor há de perdoar a casa: doze anos de bancada e nunca a vi assim parada."',
          'Ao cruzar as pernas, deixa ver, presa à bainha esquerda, uma lasca que a luz do lampião acende: [[ev_vidro_dobra]].',
        ],
        opcoes: [
          { rotulo: 'A noite de sexta-feira', vaiPara: 'alibi' },
          { rotulo: 'Como encontrou o corpo', vaiPara: 'achado' },
          { rotulo: 'Quem faria uma coisa dessas', vaiPara: 'teoria' },
          // CONFRONTOS — ocultos até a prova estar na mesa (decisão do usuário).
          {
            rotulo: 'Apresentar: O Quarto Cinco às Escuras',
            requerCarta: 'corrob_estalajadeiro',
            vaiPara: 'confronto_estalagem',
          },
          {
            rotulo: 'Apresentar: Livro de Ordens de Serviço',
            requerCarta: 'ev_livro_ordens',
            vaiPara: 'confronto_livro',
          },
        ],
      },

      // O álibi: dá as horas de um fôlego, sem procurá-las (a precisão é o
      // defeito). A moldura desemboca na carta alibi_silas.
      alibi: {
        fala: [
          '"A sexta? Isso eu digo sem procurar." E diz: fecha a oficina, a ceia, o quarto, as horas em fila na ordem em que as viveu: [[alibi_silas]].',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Como achou o corpo (sem carta): doze anos de casa, a rotina da manhã.
      achado: {
        fala: [
          '"Doze anos nesta casa, {detective.title}. Abro eu a loja, sempre antes do rapaz: tiro as tábuas da vitrine, acendo o fogo da bancada, levo o livro do dia ao gabinete. Foi ali que o achei, esta manhã, às nove e vinte, caído entre a escrivaninha e a estante. Mandei o rapaz correr à delegacia e fiquei à porta; a oficina não se abriu hoje, pela primeira vez em doze anos."',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // A teoria não pedida (aqui, pedida): o ladrão de fora. Desemboca em comp_silas.
      teoria: {
        fala: [
          '"O senhor pergunta, mas eu já ia dizer de qualquer modo." As mãos continuam sobre os joelhos. "Gente da estrada, {detective.title}, atrás do troco do caixa; uma vila destas não tranca bem as portas à noite." E volta a ela, como quem retoma sempre a mesma peça na bancada: [[comp_silas]].',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Confronto pela estalagem (requer corrob_estalajadeiro): reação, nunca
      // confissão — o veredicto continua no mural.
      confronto_estalagem: {
        fala: [
          'Posto diante do que se conta na estalagem — o quarto às escuras às nove, o portão passado das dez —, Silas Crane pousa o bule sem ruído. "O estalajadeiro terá contado os quartos errados. A casa é grande, e a noite foi de movimento." Dá a resposta no mesmo passo das outras e torna a erguer o bule.',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Confronto pelo livro de ordens (requer ev_livro_ordens): reenquadra
      // como rotina de bancada; as mãos seguem quietas.
      confronto_livro: {
        fala: [
          'Posto diante do livro — os três consertos reentrados com queixa, a rubrica "S.C." em cada um, e na margem a letra do morto: "pesar as caixas. Pettigrew, segunda" —, Silas Crane não muda de posição. "Conserto que volta é o pão da bancada, {detective.title}. Uma coroa que emperra, uma mola que canta, o cliente traz de novo e a gente refaz. Três num outono é outono ruim, não é mais que isso." As mãos seguem sobre os joelhos. Quanto à nota do patrão, aproxima o livro do lampião, lê-a e devolve o livro aberto na mesma página.',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },
    },
  },
};

export function obterDialogo(localidadeId) {
  return DIALOGOS[localidadeId] || null;
}
