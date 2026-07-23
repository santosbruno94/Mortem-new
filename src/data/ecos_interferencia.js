// =====================================================================
// ECOS DA INTERFERÊNCIA (FASE 4) — camada de PROSA, dado puro.
//
// Variantes da nota curta que o PERITO (o jogador) faz na Caderneta,
// PÓS-CASO, reconhecendo as interferências que ocorreram ou foram
// evitadas — o mesmo mecanismo dos códigos de falha (FASE 6,
// src/data/ecos_mestre.js). A seleção (qual chave, qual variante) é
// determinística e vive em src/logic/ecoInterferencia.js; aqui moram SÓ
// as palavras.
//
// Campo OPCIONAL do pacote de caso (`ecosInterferencia`): ausente, não há
// eco (o tutorial não tem interferência). O motor jamais o lê.
//
// LIMITE (guia de estilo §2.4): leitura TÉCNICA e de MÉTODO. O eco
// reconhece o FATO da interferência (o jogador já o viu, já o perdeu ou
// já o disparou), nunca nomeia o ator nem conclui autoria do crime —
// devolve o olhar ao método: o que se data, o que se compara, o que se
// recolhe cedo.
// Registro do perito: 1ª pessoa, sóbria e técnica, do perito consigo
// mesmo (o precedente é a contradição firmada na Caderneta, "Firmei-me
// no corpo: parto do rigor e do livor"). No procedural não há mestre nem
// legista (falaDoMestre.js): é o próprio perito quem relê o que se moveu.
// Ver docs/biblia-de-vozes.md.
//
// Chaves: `${tipo}_${desfecho}` — desfecho 'ocorrida' (o efeito se
// aplicou) ou 'evitada' (o gatilho disparou com o alvo já no caderno).
// `subornar_testemunha` não destrói nada, logo só existe 'ocorrida'.
// =====================================================================

export const ECOS_INTERFERENCIA_PADRAO = {
  titulo: 'O que se moveu enquanto eu ia e vinha',
  porChave: {
    destruir_evidencia_ocorrida: [
      'Esfregaram a cena entre uma visita e outra; quando voltei, a madeira ainda estava úmida. A peça que se perdeu não volta, mas esfrega fresca também se data.',
      'Levaram da cena o que eu ainda não tinha recolhido. Ficou no lugar a limpeza recente, e ela se lê como qualquer outro sinal.',
      'Faltava da cena o que eu deixara para recolher na volta. A esfrega recente não some sozinha: também ela guarda a sua hora.',
    ],
    destruir_evidencia_evitada: [
      'Vieram limpar a cena; o que importava já estava no meu caderno.',
      'Quando esfregaram o assoalho, a peça já constava do meu registro. Guardo o método: primeiro o que pode sumir.',
      'Esfregaram tarde. O que podia sumir já tinha ido para o caderno, antes de tudo o mais.',
    ],
    intimidar_testemunha_ocorrida: [
      'Aquela boca fechou depois que as minhas perguntas correram a vila. Anoto o dia em que fechou.',
      'A testemunha recuou antes de assinar o que sabia. Onde o depoimento faltar, procuro o que sobrou em torno da recusa.',
      'Uma voz que respondia parou de responder no meio do inquérito. Guardo a data em que emudeceu, e leio em volta dela.',
    ],
    intimidar_testemunha_evitada: [
      'Tentaram calar quem já tinha falado comigo. O depoimento estava colhido; o medo chegou atrasado.',
      'A ameaça veio depois do registro, e contra registro feito o medo pode pouco.',
      'O susto bateu à porta de quem já assinara. Depoimento firmado não recua por ameaça tardia.',
    ],
    subornar_testemunha_ocorrida: [
      'A mesma boca me contou duas histórias, e a segunda veio na semana em que uma dívida antiga se quitou.',
      'Tenho dois depoimentos que não se encontram e uma dívida quitada entre um e outro. Ponho as três coisas lado a lado e meço as datas.',
      'Duas versões saíram da mesma boca, e entre uma e outra uma conta velha se pagou. Alinho as datas antes de crer em qualquer das duas.',
    ],
    silenciar_ocorrida: [
      'Perdi a testemunha antes do depoimento. O segundo corpo é morte de horas, não de dias, e sinais frescos ainda apertam essa conta.',
      'Quem ouviu aquela noite não chegou a depor. O segundo corpo se lia como o primeiro: rigor, livor, a conta das horas. O que o gesto teve de grosseiro ficou nos sinais.',
      'A testemunha calou-se num segundo corpo. Esse eu li pela mesma régua do primeiro, rigor e livor, e a pressa do gesto deixou os seus sinais.',
    ],
    silenciar_evitada: [
      'A testemunha morreu com o depoimento já no meu caderno. Cheguei primeiro; o que sabia, o tribunal ainda ouve.',
      'O aviso estava lá, para quem quisesse ler, e o depoimento sobreviveu a quem o deu.',
      'Cheguei antes do silêncio: o depoimento estava firmado quando faltou quem o dera. O tribunal ouve o que o caderno guardou.',
    ],
  },
};
