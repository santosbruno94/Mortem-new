// =====================================================================
// SEMENTE §7.3 (INERTE): a mecânica futura de "confrontar faz o personagem
// AGIR". HOJE não é lida por ninguém — sem executor, sem custo de tempo,
// sem mudança de disponibilidade de nós. Fica pronta para ligar quando o
// design amadurecer (ver MORTEM_CONTEXTO.md §7.3). O motor de veredicto
// (src/logic/) continua sem depender de nada disto.
//
// A visão do usuário para o futuro: apresentar certa prova a um suspeito
// pode fazê-lo mexer com as evidências no mapa — FORA do olhar do perito
// (o suspeito age enquanto o perito está noutro lugar) — ou chegar à CENA
// DO CRIME ao mesmo tempo que ele (concomitância). Isso passaria a dar
// PESO de tempo ao confronto, hoje de graça (relógio mole).
//
// Forma: por suspeito, quais provas o AGITAM e o efeito que PODERIAM
// disparar — ENUM, não prosa (a prosa da reação já vive em dialogos.js):
//   'agita'          — fica inquieto; nada muda ainda
//   'mexe_provas'    — poderia adulterar/remover um vestígio no mapa
//   'antecipa_cena'  — poderia ir à cena do crime (concomitância)
//   'foge'           — poderia tornar-se ausente/indisponível
// =====================================================================

export const ESTADO_SUSPEITO_INICIAL = 'presente'; // 'presente' | 'agitado' | 'ausente'

export const CONSEQUENCIAS_CONFRONTO = {
  // Silas (o réu): posto diante do que o toca, o oficial de doze anos de
  // casa poderia voltar à relojoaria "arrumar" a bancada antes do perito.
  silas_crane: {
    corrob_estalajadeiro: 'antecipa_cena',
    ev_livro_ordens: 'mexe_provas',
    ev_vidro_dobra: 'agita',
  },
  // Walter (herdeiro endividado): a assinatura das 19h40 o desmonta —
  // poderia deixar a estalagem antes de nova visita.
  walter_arthurs: {
    ev_registro_estalagem: 'foge',
  },
  // Agnes, Grey e Davey: confrontos hoje só rendem prosa; sem gatilho de
  // ação previsto (ficam registrados aqui para completude do elenco).
  agnes_rooke: {},
  caleb_grey: {},
  davey_tull: {},
  // OS-S1: o recoveiro preso não pode ir a lado nenhum, e é essa a ironia do
  // sexto homem — o único que a mecânica futura não conseguiria pôr em fuga é
  // aquele a quem a fuga faria mais falta.
  nathan_herrick: {
    ev_pegada_argila: 'agita',
  },
};
