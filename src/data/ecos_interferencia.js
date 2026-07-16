// =====================================================================
// ECOS DO MESTRE SOBRE A INTERFERÊNCIA (FASE 4) — camada de PROSA, dado puro.
//
// Variantes da fala curta que o legista dá na Caderneta, PÓS-CASO,
// reconhecendo as interferências que ocorreram ou foram evitadas — o
// mesmo mecanismo dos códigos de falha (FASE 6, src/data/ecos_mestre.js).
// A seleção (qual chave, qual variante) é determinística e vive em
// src/logic/ecoInterferencia.js; aqui moram SÓ as palavras.
//
// Campo OPCIONAL do pacote de caso (`ecosInterferencia`): ausente, não há
// eco (o tutorial não tem interferência). O motor jamais o lê.
//
// LIMITE (guia de estilo §2.4): leitura TÉCNICA e de MÉTODO. O eco
// reconhece o FATO da interferência (o jogador já o viu, já o perdeu ou
// já o disparou), nunca nomeia o ator nem conclui autoria do crime —
// devolve o olhar ao método: o que se data, o que se compara, o que se
// recolhe cedo.
// Registro do mestre: oral, curto, de professor a aprendiz; trata o
// perito por "o senhor". Ver docs/biblia-de-vozes.md.
//
// Chaves: `${tipo}_${desfecho}` — desfecho 'ocorrida' (o efeito se
// aplicou) ou 'evitada' (o gatilho disparou com o alvo já no caderno).
// `subornar_testemunha` não destrói nada, logo só existe 'ocorrida'.
// =====================================================================

export const ECOS_INTERFERENCIA_PADRAO = {
  titulo: 'O legista, sobre o que se moveu',
  porChave: {
    destruir_evidencia_ocorrida: [
      'Esfregaram a cena entre uma visita e outra; a madeira ainda estava úmida. A peça que se perdeu não volta, mas esfrega fresca também se data.',
      'Levaram da cena o que o senhor ainda não tinha recolhido. Ficou no lugar a limpeza recente, e limpeza recente se lê como qualquer outro sinal.',
    ],
    destruir_evidencia_evitada: [
      'Vieram limpar a cena; o que importava já estava no seu caderno.',
      'Quando esfregaram o assoalho, a peça já constava do seu registro. Guarde o método: primeiro o que pode sumir.',
    ],
    intimidar_testemunha_ocorrida: [
      'Aquela boca fechou depois que as suas perguntas correram a vila. Anote o dia em que fechou.',
      'A testemunha recuou antes de assinar o que sabia. Onde o depoimento faltar, procure o que sobrou em torno da recusa.',
    ],
    intimidar_testemunha_evitada: [
      'Tentaram calar quem já tinha falado ao senhor. O depoimento estava colhido; o medo chegou atrasado.',
      'A ameaça veio depois do registro, e contra registro feito o medo pode pouco.',
    ],
    subornar_testemunha_ocorrida: [
      'A mesma boca contou duas histórias, e a segunda veio na semana em que uma dívida antiga se quitou.',
      'Há dois depoimentos que não se encontram e uma dívida quitada entre um e outro. Ponha as três coisas lado a lado e meça as datas.',
    ],
    silenciar_ocorrida: [
      'Perdemos a testemunha antes do depoimento. O segundo corpo é morte de horas, não de dias; e o segundo serviço, mais grosseiro, se lê mais fácil que o primeiro.',
      'Quem ouviu aquela noite não chegou a depor. O segundo corpo se lia como o primeiro: rigor, livor, a conta das horas. O que o gesto teve de grosseiro ficou nos sinais.',
    ],
    silenciar_evitada: [
      'A testemunha morreu com o depoimento já no seu caderno. O senhor chegou primeiro; o que sabia, o tribunal ainda ouve.',
      'O aviso estava lá, para quem quisesse ler — e o depoimento sobreviveu a quem o deu.',
    ],
  },
};
