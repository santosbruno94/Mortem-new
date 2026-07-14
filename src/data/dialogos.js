// =====================================================================
// Interrogatórios como diálogo (§7.1). CAMADA NARRATIVA: esta árvore pode
// referenciar ids de carta (`requerCarta`, marcadores `[[id]]`) — a
// restrição "só tags" vale para src/logic/. O motor JAMAIS lê este arquivo;
// as cartas de depoimento continuam nascendo pelo mesmo mecanismo `[[id]]`
// com as tags que já têm (src/data/cartas.js), e o veredicto não muda.
//
// Forma de cada suspeito:
//   { suspeitoId, noInicial, nos: { [noId]: { fala: [parágrafos], opcoes } },
//     noEvasiva, reacoesProva }
// Forma de cada opção (a escolha do perito):
//   { rotulo, vaiPara }                       — muda de nó (navegação livre)
//   { rotulo, vaiPara, requerCarta: 'id' }    — CONFRONTO autoral: a opção só
//                                               aparece com a carta na mesa
//
// APRESENTAR PROVA (Onda 5): o seletor "Apresentar uma prova…" do hub aceita
// QUALQUER carta registrada. `reacoesProva: { [cartaId]: noId }` leva às
// reações específicas; todo o resto cai em `noEvasiva` (a evasiva na voz do
// personagem — obrigatória quando há reacoesProva; guarda no qa.mjs).
// Apresentar a carta que desmente o paradeiro do PRÓPRIO interrogado anota a
// ligação no mural (ligacaoDeConfrontoEmCena — só tags; barbante removível).
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
    // Apresentar prova (Onda 5): reações próprias às cartas que o tocam;
    // o resto cai na evasiva. O rótulo "Apresentar: X" saiu do hub — a
    // gramática agora é uma só (o seletor).
    noEvasiva: 'evasiva',
    reacoesProva: {
      corrob_estalajadeiro: 'confronto_estalagem',
      ev_livro_ordens: 'confronto_livro',
      ev_vidro_dobra: 'confronto_vidro',
    },
    nos: {
      // O hub: Silas recebe o perito. A observação do narrador revela a lasca
      // de vidro na bainha (a carta de presença, sempre alcançável aqui).
      abertura: {
        fala: [
          'Silas Crane recebe na saleta, o avental de couro dobrado sobre o braço. Traz chá sem que se peça e senta-se na beira da cadeira, as mãos quietas sobre os joelhos. "Com licença de dizer, {detective.title}, {g:o senhor|a senhora} há de perdoar a casa: doze anos de bancada ao lado do Sr. Arthurs e nunca a vi assim parada. Acendia eu o fogo mal abria a loja, e ele descia ao cheiro do carvão; hoje a bancada amanheceu sem lume."',
          'Ao cruzar as pernas, deixa ver, presa à bainha esquerda, uma lasca que a luz do lampião acende: [[ev_vidro_dobra]].',
        ],
        opcoes: [
          { rotulo: 'A noite de sexta-feira', vaiPara: 'alibi' },
          { rotulo: 'Como encontrou o corpo', vaiPara: 'achado' },
          { rotulo: 'Quem faria uma coisa dessas', vaiPara: 'teoria' },
          // Os confrontos vivem no seletor "Apresentar uma prova…" (reacoesProva).
        ],
      },

      // O álibi: dá as horas de um fôlego, sem procurá-las (a precisão é o
      // defeito). A moldura desemboca na carta alibi_silas.
      alibi: {
        fala: [
          '"A sexta? Isso eu digo sem procurar; nesta casa a gente vive pelas horas." E diz: fecha a oficina, a ceia, o quarto, as horas em fila na ordem em que as viveu: [[alibi_silas]].',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Como achou o corpo (sem carta): doze anos de casa, a rotina da manhã.
      achado: {
        fala: [
          '"Doze anos nesta casa, {detective.title}. Abro eu a loja, sempre antes do rapaz: tiro as tábuas da vitrine, levo o livro do dia ao escritório dos fundos, acendo o fogo da bancada. O Sr. Arthurs descia depois, com os óculos na mão, e conferia o livro comigo. Foi no escritório que o achei, esta manhã, às nove e vinte, caído entre a escrivaninha e a estante. Mandei o rapaz correr à delegacia e fiquei à porta; a oficina não se abriu hoje, pela primeira vez em doze anos."',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // A teoria não pedida (aqui, pedida): o ladrão de fora. Desemboca em comp_silas.
      teoria: {
        fala: [
          '"{g:O senhor|A senhora} pergunta, mas eu já ia dizer de qualquer modo." As mãos continuam sobre os joelhos. "Gente da estrada, {detective.title}, atrás do troco do caixa; uma vila destas não tranca bem as portas à noite. Eu bem dizia ao Sr. Arthurs que recolhesse o caixa ao cofre, mas homem velho tem os seus costumes." E volta a ela, como quem retoma sempre a mesma peça na bancada: [[comp_silas]].',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Confronto pela estalagem (requer corrob_estalajadeiro): reação, nunca
      // confissão — o veredicto continua no mural.
      confronto_estalagem: {
        fala: [
          'Posto diante do que se conta na estalagem — o quarto às escuras às nove, o portão passado das dez —, Silas Crane pousa o bule sem ruído. "O estalajadeiro terá contado os quartos errados. A casa é grande, e a noite foi de movimento. Doze anos sem uma falta, {detective.title}; não é agora que hei de trocar as minhas horas." Dá a resposta no mesmo passo das outras e torna a erguer o bule.',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Confronto pelo livro de ordens (reação a ev_livro_ordens): reenquadra
      // como rotina de bancada; as mãos seguem quietas.
      confronto_livro: {
        fala: [
          'Posto diante do livro — os três consertos reentrados com queixa, a rubrica "S.C." em cada um, e na última entrada a letra do morto: "pesar as caixas. Pettigrew, segunda" —, Silas Crane não muda de posição. "Conserto que volta é o pão da bancada, {detective.title}. Uma coroa que emperra, uma mola que canta, o cliente traz de novo e a gente refaz. Três num outono é outono ruim, não é mais que isso." As mãos seguem sobre os joelhos. Quanto à nota do patrão, aproxima o livro do lampião e corre os olhos pela nota. "A mão dele, sim, miúda assim." Devolve o livro aberto na mesma página.',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Confronto pela lasca (reação a ev_vidro_dobra): a esquiva fria e
      // plausível de ofício — ele nem toca na prova.
      confronto_vidro: {
        fala: [
          'Silas Crane olha a lasca sem estender a mão. "Vidro de mostrador, {detective.title}, e dos finos. Numa oficina destas parte-se um por semana: a pinça escapa, o aro morde no encaixe, o chão fica com o resto. O rapaz varre toda noite; a bainha apanha o que a vassoura deixa."',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // A evasiva (qualquer prova sem reação própria): a cerimônia que
      // devolve nada e torna à teoria do ladrão.
      evasiva: {
        fala: [
          'Silas Crane inclina-se sobre a mesa o bastante para ver, e torna ao espaldar. "Com licença de dizer, {detective.title}, a minha parte é corda e mola; o que isso valha, sabe a perícia." As mãos não deixam os joelhos. "O que eu penso, já disse: gente da estrada, atrás do caixa."',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },
    },
  },

  papelaria: {
    suspeitoId: 'agnes_rooke',
    noInicial: 'abertura',
    // Apresentar prova: a cesta, o aro e o relato da viela têm reação própria;
    // todo o resto cai na evasiva dela (que não gasta palavras).
    noEvasiva: 'evasiva',
    reacoesProva: {
      ev_cesta_rooke: 'reacao_cesta',
      ev_anel_encomenda: 'reacao_anel',
      dep_mulher_viela: 'reacao_viela',
    },
    nos: {
      // O hub: a loja e a dona; ela atende de pé e espera a pergunta.
      abertura: {
        fala: [
          'A papelaria cheira a goma e a papel novo; o balcão reluz de cera. Sobre o mostrador, apartado do resto, papel de carta com tarja de luto. A Sra. Agnes Rooke atende de pé, do lado de dentro do balcão, e mede o visitante por cima dos óculos. "{detective.title}." Não oferece cadeira. Espera a pergunta.',
        ],
        opcoes: [
          { rotulo: 'A noite de sexta-feira', vaiPara: 'paradeiro' },
          { rotulo: 'O morto e a vila', vaiPara: 'morto' },
        ],
      },

      // O paradeiro: resposta do tamanho da pergunta; desemboca em alibi_agnes.
      paradeiro: {
        fala: [
          '"A sexta-feira." Devolve as palavras e responde: [[alibi_agnes]].',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // O morto: cliente de vinte anos e nem uma palavra além; desemboca em comp_agnes.
      morto: {
        fala: [
          '"O Sr. Arthurs comprava nesta casa o papel de escrituração. Homem pontual. O que a vila acrescente é assunto da vila." Atende, da primeira palavra à última, em [[comp_agnes]].',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Reação à cesta (a apresentação anota a ligação no mural, pelo código):
      // ela cede o mínimo, com dignidade — reação, nunca confissão.
      reacao_cesta: {
        fala: [
          'A Sra. Rooke olha o guardanapo bordado, depois o bilhete, e fica um momento sem falar. "A cesta é minha; o guardanapo também. Ceei com o Sr. Arthurs na sexta, às oito, e saí antes das nove. Estávamos ajustados para casar." Torna a dobrar o guardanapo pela dobra antiga. "Menti sobre a minha noite, {detective.title}; foi tudo o que menti."',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Reação ao aro de ouro: contida; o luto e o segredo se tocam num gesto.
      reacao_anel: {
        fala: [
          'Toma a ordem de serviço presa ao aro e lê. Lê outra vez. "Trinta de outubro." Devolve o aro com o papel por cima, dobrado pela dobra que trazia. "Não cheguei a vê-lo. As iniciais {g:o senhor|a senhora} leu; não precisam de mim." Volta-se para o mostrador e endireita, uma a uma, as folhas do papel com tarja de luto.',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Reação ao relato da Sra. Wick: confirma sem drama e encerra o assunto.
      reacao_viela: {
        fala: [
          'Ouve o relato até o fim sem mover as mãos. "A Sra. Wick não jura, e faz bem: daquela janela não se vê rosto. O passo era meu. Saí pela viela porque a High Street comenta." E depois: "Há mais alguma coisa?"',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // A evasiva: objeto não é pergunta; ela não gasta palavras com o que não se perguntou.
      evasiva: {
        fala: [
          'A Sra. Rooke olha o que se lhe apresenta, o tempo de o ler ou de o reconhecer, e torna a erguer os olhos. "Se nisso há pergunta, {detective.title}, faça-a."',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },
    },
  },

  moinho: {
    suspeitoId: 'caleb_grey',
    noInicial: 'abertura',
    // Apresentar prova: a queixa dele e o livro de ordens têm reação própria;
    // o resto recebe o dar de ombros sem largar a saca.
    noEvasiva: 'evasiva',
    reacoesProva: {
      dep_queixa_grey: 'reacao_queixa',
      ev_livro_ordens: 'reacao_livro',
    },
    nos: {
      // O hub: o moinho em dia de feira; Grey responde sem parar o serviço.
      abertura: {
        fala: [
          'O moinho trabalha em pleno sábado: sacas na rampa, poeira de farinha na luz da porta, o carroceiro do Finch à espera com a parelha. Caleb Grey passa com uma saca ao ombro e não a pousa para cumprimentar. "Pergunte andando, {detective.title}, que a feira não espera defunto."',
        ],
        opcoes: [
          { rotulo: 'A noite de sexta-feira', vaiPara: 'paradeiro' },
          { rotulo: 'O relojoeiro morto', vaiPara: 'queixa' },
        ],
      },

      // O paradeiro: dado no compasso das sacas, com testemunha à mão; desemboca em alibi_grey.
      paradeiro: {
        fala: [
          'A saca desce na carroça antes da resposta. "A sexta?" O vaivém não para enquanto ele a dá: [[alibi_grey]]. Aponta com o queixo o homem da carroça. "Um deles está ali. Pergunte agora, se quiser."',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // A queixa: o prejuízo sem errar um xelim; desemboca em comp_grey.
      queixa: {
        fala: [
          '"Morto, o homem me deve o mesmo que devia vivo." Enxuga a testa com as costas da mão. "O relógio caçador do meu pai entrou inteiro naquela loja e voltou mais leve. Quatro libras e dez xelins, e o conserto pago adiantado. Exigi pesagem diante de testemunhas e lavrei termo na delegacia, tudo antes de o homem morrer; as datas estão no papel." Sobre o que sente: [[comp_grey]].',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Reação à própria queixa: assume sem rodeio e mantém a soma de pé.
      reacao_queixa: {
        fala: [
          'Olha o termo de longe. "Minha. Lavrada na sexta à tarde, diante do próprio Wycliffe, e assino outra vez aqui na tábua da rampa, se for preciso." Faz sinal ao carroceiro que espere. "Quatro libras e dez xelins. A queixa fica de pé até se pesar aquele relógio diante de gente."',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // Reação ao livro de ordens: acha a própria linha e conta as vizinhas;
      // a raiva de quem pagou, sem nome para apontar.
      reacao_livro: {
        fala: [
          'Limpa a mão na perna antes de tocar o livro. O dedo, branco de farinha, desce a coluna e para. "Este é o meu. O relógio do meu pai, e o preço adiantado somado à margem, da letra do próprio velho." Corre os olhos pelas linhas vizinhas. "Mais dois com queixa no mesmo outono. Eu pensava que o azar era só meu." Empurra o livro de volta pela tábua. "Eu sei o que entrou e o que saiu, {detective.title}; quem pôs a mão nele, a loja que diga."',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },

      // A evasiva: encolhe os ombros sem soltar a saca; responde do que tem papel e testemunha.
      evasiva: {
        fala: [
          'Olha por cima da saca, o tempo de dois passos, e encolhe os ombros sem soltá-la. "Disso não sei, e sem papel nem testemunha não juro. Pergunte de farinha, de pesagem ou do que me devem."',
        ],
        opcoes: [OUTRO_ASSUNTO],
      },
    },
  },
};

export function obterDialogo(localidadeId) {
  return DIALOGOS[localidadeId] || null;
}
