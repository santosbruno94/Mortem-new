// =====================================================================
// Interrogatórios como diálogo (§7.1 + §7.2). CAMADA NARRATIVA: esta
// árvore pode referenciar ids de carta (`requerCarta`, marcadores `[[id]]`)
// — a restrição "só tags" vale para src/logic/. O motor JAMAIS lê este
// arquivo; as cartas de depoimento continuam nascendo pelo mesmo mecanismo
// `[[id]]` com as tags que já têm (src/data/cartas.js), e o veredicto não
// muda.
//
// Forma de cada suspeito:
//   { suspeitoId, noInicial, nos: { [noId]: { fala: [parágrafos], opcoes } },
//     noEvasiva, reacoesProva, falaEsgotada }
// Forma de cada opção (a escolha do perito):
//   { id, rotulo, vaiPara }                   — pergunta (consome 1 de MAX_PERGUNTAS)
//   { rotulo, vaiPara, requerCarta: 'id' }    — CONFRONTO autoral: a opção só
//                                               aparece com a carta na mesa
//
// Escolhas irreversíveis (§7.2): o perito faz MAX_PERGUNTAS perguntas por
// interrogado (2 de 4); as demais somem. `falaEsgotada` é dita quando as
// perguntas se esgotam. Apresentar prova (Onda 5) é ortogonal: sem limite.
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

export const DIALOGOS = {
  interrogatorio_silas: {
    suspeitoId: 'silas_crane',
    noInicial: 'abertura',
    noEvasiva: 'evasiva',
    reacoesProva: {
      corrob_estalajadeiro: 'confronto_estalagem',
      ev_livro_ordens: 'confronto_livro',
      ev_vidro_dobra: 'confronto_vidro',
    },
    consequencias: {},
    falaEsgotada: [
      'Silas Crane endireita a xícara na borda da mesa. "Não vejo em que mais possa servir, {detective.title}. A oficina está parada e eu aqui, às ordens."',
    ],
    nos: {
      abertura: {
        fala: [
          'Silas Crane recebe na saleta, o avental de couro dobrado sobre o braço. Traz chá sem que se peça e senta-se na beira da cadeira, as mãos quietas sobre os joelhos. "Com licença de dizer, {detective.title}, {g:o senhor|a senhora} há de perdoar a casa: doze anos de bancada ao lado do Sr. Arthurs e nunca a vi assim parada. Acendia eu o fogo mal abria a loja, e ele descia ao cheiro do carvão; hoje a bancada amanheceu sem lume."',
          'Ao cruzar as pernas, deixa ver, presa à bainha esquerda, uma lasca que a luz do lampião acende: [[ev_vidro_dobra]].',
        ],
        opcoes: [
          { id: 'alibi', rotulo: 'A noite de sexta-feira', vaiPara: 'alibi' },
          { id: 'achado', rotulo: 'Como encontrou o corpo', vaiPara: 'achado' },
          { id: 'teoria', rotulo: 'Quem faria uma coisa dessas', vaiPara: 'teoria' },
          { id: 'oficio', rotulo: 'Os doze anos de bancada', vaiPara: 'oficio' },
        ],
      },

      alibi: {
        fala: [
          '"A sexta? Isso eu digo sem procurar; nesta casa a gente vive pelas horas." E diz: fecha a oficina, a ceia, o quarto, as horas em fila na ordem em que as viveu: [[alibi_silas]].',
        ],
        opcoes: [],
      },

      achado: {
        fala: [
          '"Doze anos nesta casa, {detective.title}. Abro eu a loja, sempre antes do rapaz: tiro as tábuas da vitrine, levo o livro do dia ao escritório dos fundos, acendo o fogo da bancada. O Sr. Arthurs descia depois, com os óculos na mão, e conferia o livro comigo. Foi no escritório que o achei, esta manhã, às nove e vinte, caído entre a escrivaninha e a estante. Mandei o rapaz correr à delegacia e fiquei à porta; a oficina não se abriu hoje, pela primeira vez em doze anos."',
        ],
        opcoes: [],
      },

      teoria: {
        fala: [
          '"{g:O senhor|A senhora} pergunta, mas eu já ia dizer de qualquer modo." As mãos continuam sobre os joelhos. "Gente da estrada, {detective.title}, atrás do troco do caixa; uma vila destas não tranca bem as portas à noite. Eu bem dizia ao Sr. Arthurs que recolhesse o caixa ao cofre, mas homem velho tem os seus costumes." E volta a ela, como quem retoma sempre a mesma peça na bancada: [[comp_silas]].',
        ],
        opcoes: [],
      },

      oficio: {
        fala: [
          '"Com licença de dizer, {detective.title}, doze anos é o que se leva para desmontar e montar um movimento de bolso sem deixar risco na platina. Nos primeiros, eu limpava caixa e polia vidro; o Sr. Arthurs não me deixava pôr a pinça em mola nem em coroa. Depois vieram os de parede, que são peça franca, e por fim o de bolso, que é trabalho fino, de lupa. Hoje ele me confiava o conserto inteiro: o cliente trazia, eu desmontava, trocava o que houvesse de trocar, punha a corda e conferia o compasso. O Sr. Arthurs passava a unha pela peça pronta e só então ela voltava ao balcão." As mãos continuam sobre os joelhos. "O rapaz tem dois anos de casa; limpa, varre, já desmonta parede sozinho, mas bolso o Sr. Arthurs ainda não lhe confiava." Passa o polegar pela asa da xícara sem levantá-la.',
        ],
        opcoes: [],
      },

      confronto_estalagem: {
        fala: [
          'Posto diante do que se conta na estalagem — o quarto às escuras às nove, o portão passado das dez —, Silas Crane pousa o bule sem ruído. "O estalajadeiro terá contado os quartos errados. A casa é grande, e a noite foi de movimento. Doze anos sem uma falta, {detective.title}; não é agora que hei de trocar as minhas horas." Dá a resposta no mesmo passo das outras e torna a erguer o bule.',
        ],
        opcoes: [],
      },

      confronto_livro: {
        fala: [
          'Posto diante do livro — os três consertos reentrados com queixa, a rubrica "S.C." em cada um, e na última entrada a letra do morto: "pesar as caixas. Pettigrew, segunda" —, Silas Crane não muda de posição. "Conserto que volta é o pão da bancada, {detective.title}. Uma coroa que emperra, uma mola que canta, o cliente traz de novo e a gente refaz. Três num outono é outono ruim, não é mais que isso." As mãos seguem sobre os joelhos. Quanto à nota do patrão, aproxima o livro do lampião e corre os olhos pela nota. "A mão dele, sim, miúda assim." Devolve o livro aberto na mesma página.',
        ],
        opcoes: [],
      },

      confronto_vidro: {
        fala: [
          'Silas Crane olha a lasca sem estender a mão. "Vidro de mostrador, {detective.title}, e dos finos. Numa oficina destas parte-se um por semana: a pinça escapa, o aro morde no encaixe, o chão fica com o resto. O rapaz varre toda noite; a bainha apanha o que a vassoura deixa."',
        ],
        opcoes: [],
      },

      evasiva: {
        fala: [
          'Silas Crane inclina-se sobre a mesa o bastante para ver, e torna ao espaldar. "Com licença de dizer, {detective.title}, a minha parte é corda e mola; o que isso valha, sabe a perícia." As mãos não deixam os joelhos. "O que eu penso, já disse: gente da estrada, atrás do caixa."',
        ],
        opcoes: [],
      },
    },
  },

  papelaria: {
    suspeitoId: 'agnes_rooke',
    noInicial: 'abertura',
    noEvasiva: 'evasiva',
    reacoesProva: {
      ev_cesta_rooke: 'reacao_cesta',
      ev_anel_encomenda: 'reacao_anel',
      dep_mulher_viela: 'reacao_viela',
    },
    consequencias: {},
    falaEsgotada: [
      'A Sra. Rooke endireita os cadernos no mostrador. "Há mais alguma coisa, {detective.title}?"',
    ],
    nos: {
      abertura: {
        fala: [
          'A papelaria cheira a goma e a papel novo; o balcão reluz de cera. Sobre o mostrador, apartado do resto, papel de carta com tarja de luto. A Sra. Agnes Rooke atende de pé, do lado de dentro do balcão, e mede o visitante por cima dos óculos. "{detective.title}." Não oferece cadeira. Espera a pergunta.',
        ],
        opcoes: [
          { id: 'paradeiro', rotulo: 'A noite de sexta-feira', vaiPara: 'paradeiro' },
          { id: 'morto', rotulo: 'O morto e a vila', vaiPara: 'morto' },
          { id: 'clientes', rotulo: 'A loja e os seus clientes', vaiPara: 'clientes' },
          { id: 'sobrinho', rotulo: 'O sobrinho do relojoeiro', vaiPara: 'sobrinho' },
        ],
      },

      paradeiro: {
        fala: [
          '"A sexta-feira." Devolve as palavras e responde: [[alibi_agnes]].',
        ],
        opcoes: [],
      },

      morto: {
        fala: [
          '"O Sr. Arthurs comprava nesta casa o papel de escrituração. Homem pontual. O que a vila acrescente é assunto da vila." Atende, da primeira palavra à última, em [[comp_agnes]].',
        ],
        opcoes: [],
      },

      clientes: {
        fala: [
          '"Vendo papel, tinta, lacre e cadernos de escrituração." Corre a mão pela fileira de cadernos no mostrador. "Compra quem escreve, e nesta vila escrevem poucos. O vigário encomenda envelopes duas vezes ao ano; a escola pede cadernos em setembro; o resto é tarja de luto ou papel de embrulho, conforme a estação. De manhã há movimento; à tarde, quem entra já sabe o que veio buscar."',
        ],
        opcoes: [],
      },

      sobrinho: {
        fala: [
          '"O sobrinho vem uma ou duas vezes ao ano. Não é cliente desta loja." A mão direita pousa na beira do balcão e ali fica. "Na sexta passou pela High Street de tarde, andando depressa. Não entrou aqui nem noutro lugar. Vai à relojoaria e volta, sempre assim."',
        ],
        opcoes: [],
      },

      reacao_cesta: {
        fala: [
          'A Sra. Rooke olha o guardanapo bordado, depois o bilhete, e fica um momento sem falar. "A cesta é minha; o guardanapo também. Ceei com o Sr. Arthurs na sexta, às oito, e saí antes das nove. Estávamos ajustados para casar." Torna a dobrar o guardanapo pela dobra antiga. "Menti sobre a minha noite, {detective.title}; foi tudo o que menti."',
        ],
        opcoes: [],
      },

      reacao_anel: {
        fala: [
          'Toma a ordem de serviço presa ao aro e lê. Lê outra vez. "Trinta de outubro." Devolve o aro com o papel por cima, dobrado pela dobra que trazia. "Não cheguei a vê-lo. As iniciais {g:o senhor|a senhora} leu; não precisam de mim." Volta-se para o mostrador e endireita, uma a uma, as folhas do papel com tarja de luto.',
        ],
        opcoes: [],
      },

      reacao_viela: {
        fala: [
          'Ouve o relato até o fim sem mover as mãos. "A Sra. Wick não jura, e faz bem: daquela janela não se vê rosto. O passo era meu. Saí pela viela porque a High Street comenta." E depois: "Há mais alguma coisa?"',
        ],
        opcoes: [],
      },

      evasiva: {
        fala: [
          'A Sra. Rooke olha o que se lhe apresenta, o tempo de o ler ou de o reconhecer, e torna a erguer os olhos. "Se nisso há pergunta, {detective.title}, faça-a."',
        ],
        opcoes: [],
      },
    },
  },

  moinho: {
    suspeitoId: 'caleb_grey',
    noInicial: 'abertura',
    noEvasiva: 'evasiva',
    reacoesProva: {
      dep_queixa_grey: 'reacao_queixa',
      ev_livro_ordens: 'reacao_livro',
    },
    consequencias: {},
    falaEsgotada: [
      '"Tenho carga pra acabar, {detective.title}." Caleb Grey passa com outra saca e aponta o portão com o queixo.',
    ],
    nos: {
      abertura: {
        fala: [
          'O moinho trabalha em pleno sábado: sacas na rampa, poeira de farinha na luz da porta, o carroceiro do Finch à espera com a parelha. Caleb Grey passa com uma saca ao ombro e não a pousa para cumprimentar. "Pergunte andando, {detective.title}, que a feira não espera defunto."',
        ],
        opcoes: [
          { id: 'paradeiro', rotulo: 'A noite de sexta-feira', vaiPara: 'paradeiro' },
          { id: 'queixa', rotulo: 'O relojoeiro morto', vaiPara: 'queixa' },
          { id: 'outros', rotulo: 'Os outros da vila', vaiPara: 'outros' },
          { id: 'relogio_pai', rotulo: 'O relógio do pai', vaiPara: 'relogio_pai' },
        ],
      },

      paradeiro: {
        fala: [
          'A saca desce na carroça antes da resposta. "A sexta?" O vaivém não para enquanto ele a dá: [[alibi_grey]]. Aponta com o queixo o homem da carroça. "Um deles está ali. Pergunte agora, se quiser."',
        ],
        opcoes: [],
      },

      queixa: {
        fala: [
          '"Morto, o homem me deve o mesmo que devia vivo." Enxuga a testa com as costas da mão. "O relógio caçador do meu pai entrou inteiro naquela loja e voltou mais leve. Quatro libras e dez xelins, e o conserto pago adiantado. Exigi pesagem diante de testemunhas e lavrei termo na delegacia, tudo antes de o homem morrer; as datas estão no papel." Sobre o que sente: [[comp_grey]].',
        ],
        opcoes: [],
      },

      outros: {
        fala: [
          'Grey ajeita a saca no ombro. "Relojoeiro entre daqui e Moorford só havia o velho Arthurs; quem tinha engrenagem ia àquela porta ou mandava pelo carroceiro. O Crane fazia o serviço, doze anos na mesma bancada; o rapaz varria e carregava." A saca desce na carroça e ele volta para a seguinte. "Da vila ia gente de todo lado: a Sra. Rooke toda semana, papel e tinta; o pessoal do Finch com relógio de fazenda; até o vigário mandava o do púlpito pelo Natal. O sobrinho, o de Moorford, vi na sexta de tarde quando eu saía da delegacia com o meu termo. Daquela loja se ouviu na rua, {detective.title}; não sei o assunto, e não perguntei, que bastava o meu."',
        ],
        opcoes: [],
      },

      relogio_pai: {
        fala: [
          '"Caçador de tampa lavrada, ouro de lei." Grey não larga a saca. "Meu pai comprou em Moorford no ano em que casou; carregou trinta e tantos anos no bolso do colete, e dava corda à mesa toda noite. Quando morreu, ficou comigo." O passo não muda. "A mola andava mole e a tampa não fechava direito; levei ao conserto em setembro e paguei adiantado, como se faz entre gente." Descarrega e volta. "Voltou andando certo e mais leve. Pesei diante de testemunha: ouro da tampa e do fundo trocado por metal ordinário. Quatro libras e dez xelins de diferença, {detective.title}." Bate a farinha das mãos e pega a saca seguinte.',
        ],
        opcoes: [],
      },

      reacao_queixa: {
        fala: [
          'Olha o termo de longe. "Minha. Lavrada na sexta à tarde, diante do próprio Wycliffe, e assino outra vez aqui na tábua da rampa, se for preciso." Faz sinal ao carroceiro que espere. "Quatro libras e dez xelins. A queixa fica de pé até se pesar aquele relógio diante de gente."',
        ],
        opcoes: [],
      },

      reacao_livro: {
        fala: [
          'Limpa a mão na perna antes de tocar o livro. O dedo, branco de farinha, desce a coluna e para. "Este é o meu. O relógio do meu pai, e o preço adiantado somado à margem, da letra do próprio velho." Corre os olhos pelas linhas vizinhas. "Mais dois com queixa no mesmo outono. Eu pensava que o azar era só meu." Empurra o livro de volta pela tábua. "Eu sei o que entrou e o que saiu, {detective.title}; quem pôs a mão nele, a loja que diga."',
        ],
        opcoes: [],
      },

      evasiva: {
        fala: [
          'Olha por cima da saca, o tempo de dois passos, e encolhe os ombros sem soltá-la. "Disso não sei, e sem papel nem testemunha não juro. Pergunte de farinha, de pesagem ou do que me devem."',
        ],
        opcoes: [],
      },
    },
  },

  dialogo_walter: {
    suspeitoId: 'walter_arthurs',
    origemLocalidade: 'estalagem',
    chamada: 'Interrogar Walter Arthurs',
    titulo: 'Interrogatório — Walter Arthurs',
    subtitulo: 'Herdeiro, hóspede do quarto nº 3',
    noInicial: 'abertura',
    noEvasiva: 'evasiva',
    reacoesProva: {
      ev_registro_estalagem: 'confronto_registro',
      ev_suplica_cesto: 'confronto_suplica',
      dep_testamento: 'confronto_testamento',
    },
    consequencias: {},
    falaEsgotada: [
      'Walter Arthurs alisa a barba por fazer. "Já dei conta de tudo o que sei, {detective.title}. Se houver mais que perguntar, que me procurem na estalagem, que é onde estou."',
    ],
    nos: {
      abertura: {
        fala: [
          'Walter Arthurs desce à sala sem casaco, a barba de ontem por fazer, e fica de pé junto ao aparador. "Soube esta manhã e estou aqui desde então, às ordens de quem as tiver. A casa do meu tio está lacrada; tomei o quarto três. Pergunte-se o que houver, {detective.title}, e pergunte-se logo, que negociante parado é dinheiro andando para trás." Enquanto fala, abotoa e desabotoa o botão alto do colete.',
        ],
        opcoes: [
          { id: 'paradeiro', rotulo: 'A noite de sexta-feira', vaiPara: 'paradeiro' },
          { id: 'negocios', rotulo: 'Os negócios', vaiPara: 'negocios' },
          { id: 'tio', rotulo: 'O tio', vaiPara: 'tio' },
          { id: 'empregados', rotulo: 'A oficina e os empregados', vaiPara: 'empregados' },
        ],
      },

      paradeiro: {
        fala: [
          '"A sexta-feira. Sim. Naturalmente." Endireita-se antes de responder. "Estive com meu tio de tarde, tratamos de negócios, e segui o meu caminho." E dá o paradeiro: [[alibi_walter]].',
        ],
        opcoes: [],
      },

      negocios: {
        fala: [
          '"Os meus negócios vão mal, e disso nunca fiz segredo. Devo às fazendas, devo ao armazém que anda em juízo, devo até ao Station de Moorford, onde durmo a crédito. A lista é pública e eu a sei de cor. Da herança falem os outros; eu falo do que devo, que ao menos é meu." A voz, alta no princípio, acaba quase para dentro.',
        ],
        opcoes: [],
      },

      tio: {
        fala: [
          '"Meu tio era homem de uma peça. Recolheu-me quando meu pai morreu, pagou-me o colégio, e não me deixou esquecer nem uma coisa nem outra." O polegar corre a barba por fazer. "Estive com ele na sexta; negócios, de que já dei conta. Achei-o como sempre: são, duro no dinheiro, senhor das suas horas. Quem lhe fez isto que responda, e hei de cobrar eu mesmo, que afinal é o que se espera de um herdeiro, não é assim que dizem?"',
        ],
        opcoes: [],
      },

      empregados: {
        fala: [
          '"A oficina não é da minha conta, e nunca foi; quem visita o tio passa pelo escritório, não pela bancada." Puxa a barra do colete com as duas mãos. "O Crane conheço de anos, como se conhece quem já está no lugar toda vez que a gente chega. Homem quieto, de avental, sempre com uma peça aberta diante de si; meu tio falava dele como se fala de móvel bom: está ali, serve. Comigo trocava o cumprimento da porta e voltava à lupa. O rapaz é mais novo, dois anos de casa se tanto, magro, de vassoura; não sei se o nome é Tull ou outro, que meu tio chamava de rapaz e eu fiz o mesmo."',
          'Puxa o punho da camisa para baixo. "Não me peça opinião de patrão, {detective.title}, que nunca fui patrão de oficina; entendo de fazendas, de peso e de medida. Se há pergunta sobre eles, façam-na a eles, que a oficina se governava sozinha e eu lá dentro era visita."',
        ],
        opcoes: [],
      },

      confronto_registro: {
        fala: [
          'Walter Arthurs lê a própria assinatura e a linha das sete e quarenta. Puxa uma cadeira e senta-se antes de responder.',
          '"Não houve diligência." A voz sai baixa, e depois as palavras vêm de uma vez. "Vim na sexta pedir dinheiro ao meu tio. Pedido, implorado, a juro de praça e com a palavra que me resta. Ele recusou aos gritos, com a loja ainda aberta. Tomei este quarto porque àquela hora já não havia carro, e porque naquela noite eu não tinha ânimo de me apresentar em hotel nenhum. Fiquei no três a noite inteira, escrevendo: cartas a ele, cartas a credores. Pedi vela nova pela meia-noite; o caseiro que o diga. Menti, {detective.title}, porque a verdade era esta: um negociante de quarenta e quatro anos à porta do tio, de chapéu na mão, ouvindo não. Depois dos gritos, na loja não tornei a pôr os pés."',
          'Depois cala-se, as mãos abertas sobre a mesa.',
        ],
        opcoes: [],
      },

      confronto_suplica: {
        fala: [
          'Walter desamassa a folha só até onde a letra aparece e torna a fechá-la pela mesma dobra. "A mão é minha; o pedido, também." Pousa-a na mesa com a escrita para baixo. "Um adiantamento entre parentes se propõe em toda parte, {detective.title}, e se lavra no gabinete de um procurador quando aceito. Escrevi-a como se escreve a um credor: com conta, prazo e juro. Esperava-lhe destino melhor. Meu tio não era homem de responder papéis que o desagradassem."',
        ],
        opcoes: [],
      },

      confronto_testamento: {
        fala: [
          '"Herdeiro único. Sei o que se soma com isso: negócios em ruína de um lado, loja e casa do outro, e o meu nome no meio. É conta que qualquer credor meu já fez." Puxa o colete para baixo, como quem se compõe para retrato. "Pois faça-se a conta inteira, {detective.title}. Meu tio vivo valia-me um adiantamento assinado numa tarde; agora vale-me uma loja lacrada, um inventário e juízo pela frente. Diga-me qual dos dois convinha a um homem com credores à porta."',
        ],
        opcoes: [],
      },

      evasiva: {
        fala: [
          'Walter recebe o que se lhe mostra e devolve-o antes de o examinar, os dedos no colarinho. "E que tenho eu com isto? Entendo de fazendas e de letras de câmbio. Já dei o meu paradeiro e o nome dos meus credores; se é para me mostrarem cada papel desta vila, mostrem também aos outros, que não sou o único nome escrito em Briarstone."',
        ],
        opcoes: [],
      },
    },
  },

  dialogo_davey: {
    suspeitoId: 'davey_tull',
    origemLocalidade: 'oficina',
    chamada: 'Conversar com Davey Tull',
    titulo: 'Conversa — Davey Tull',
    subtitulo: 'Aprendiz, dois anos de bancada',
    noInicial: 'abertura',
    noEvasiva: 'evasiva',
    reacoesProva: {
      ev_relogio_bolso: 'reacao_relogio',
      ev_estojo_buril: 'reacao_estojo',
    },
    consequencias: {},
    falaEsgotada: [
      'Davey torna à vassoura e varre o mesmo canto. "Se precisar de mais alguma coisa, {detective.title}, eu estou aqui."',
    ],
    nos: {
      abertura: {
        fala: [
          'Davey Tull varre um chão que já não dá pó. Ao ver gente, encosta a vassoura no ombro e espera a pergunta de olhos erguidos. "O Sr. Crane disse pra eu tomar conta da oficina. Eu tomo conta e vou varrendo, que parado o serviço não rende."',
        ],
        opcoes: [
          { id: 'costumes', rotulo: 'Os costumes do patrão', vaiPara: 'costumes' },
          { id: 'sexta', rotulo: 'A noite de sexta-feira', vaiPara: 'sexta' },
          { id: 'crane', rotulo: 'O Sr. Crane', vaiPara: 'crane' },
          { id: 'clientes_loja', rotulo: 'A gente que vinha à loja', vaiPara: 'clientes_loja' },
        ],
      },

      costumes: {
        fala: [
          'A vassoura para, e os olhos sobem. "O patrão punha o relógio consertado no meu ouvido, pra eu ouvir se o compasso saíra certo. Dizia que máquina bem posta respira. Eu já acerto o de parede sozinho; o de bolso ele ainda não deixava." E, dos costumes da noite, conta [[dep_habito_corda]].',
        ],
        opcoes: [],
      },

      sexta: {
        fala: [
          '"A sexta eu conto certinho, que já contei mais de uma vez." Os olhos descem para a vassoura e lá ficam até o fim das palavras: [[alibi_davey]].',
        ],
        opcoes: [],
      },

      crane: {
        fala: [
          'A vassoura para. "O Sr. Crane? Ele me ensinou tudo que eu sei de bancada." Davey olha para a bancada do oficial, vazia. "Dois anos que estou aqui e nunca vi o Sr. Crane erguer a voz, nem quando o patrão erguia a dele. Chega antes de mim, sai depois; eu varro a oficina pra ir embora e ele ainda fica, com o lampião de bancada aceso, debruçado sobre as caixas. Conserto de caixa de ouro é coisa dele; o patrão mandava pelo livro e o Sr. Crane fazia sozinho, do começo à soldagem. A gente trabalha sem conversa; às vezes o dia inteiro sem uma voz, só o tique-taque. Quando eu errava a ponta, ele parava, vinha e guiava a minha mão até acertar. Nunca me deu puxão de orelha."',
        ],
        opcoes: [],
      },

      clientes_loja: {
        fala: [
          'Davey encosta a vassoura na parede, cruza as mãos atrás das costas e ergue os olhos. "Varrendo a gente vê todo mundo que entra. O Sr. Walter apareceu na sexta de tarde. Eu estava na porta da oficina e ouvi o patrão e ele no escritório, a porta fechada; daqui a gente ouve o tom, não as palavras. O patrão estava com voz alta. O Sr. Walter saiu pela porta da frente sem passar pela oficina. A dona da papelaria aparecia de vez em quando, sempre de tarde; trazia coisa embrulhada, e o patrão recebia nos fundos. O Sr. Grey veio na sexta também, por causa do relógio caçador dele; falou alto na própria loja, e o patrão mandou tratar na delegacia, que ali era casa de trabalho." Desencosta a vassoura da parede. "Eu varria e via, mas espiar não é coisa minha."',
        ],
        opcoes: [],
      },

      reacao_relogio: {
        fala: [
          'Davey encosta a vassoura na parede e estende as duas mãos. "Posso ouvir?" Encosta o relógio do morto no ouvido do jeito que o patrão fazia com ele, e fica assim um bom tempo, os olhos parados na parede. "Anda certo. Compasso bem posto." Devolve-o com as duas mãos. "A corda das onze, pro patrão, era coisa sagrada, que nem reza; dois anos de casa, e esse relógio nunca soube o que era ficar sem corda." E torna à vassoura sem que ninguém o mande.',
        ],
        opcoes: [],
      },

      reacao_estojo: {
        fala: [
          'Davey chega sem que o chamem e para a um passo do estojo, as mãos atrás das costas. "Esse é o do Sr. Crane. Ferramenta dele ninguém pega; a minha é a do caixote, de cabo de freixo." O olho corre a fileira, cabo por cabo. "Buril a gente limpa na flanela, com a cera da bancada. Molhar não pode, que a água entra na junta e enferruja o espigão; isso o patrão me ensinou no primeiro mês. O de ponta é o de gravar miúdo, por dentro de tampa; um igual já me escapou e me abriu o dedo, no primeiro ano." Recua o passo que tinha dado.',
        ],
        opcoes: [],
      },

      evasiva: {
        fala: [
          'Davey chega o rosto para ver de perto, a testa franzida, e faz que não com a cabeça. "Isso eu não sei dizer o que é, {detective.title}. Se fosse coisa de relógio, eu conhecia; do resto, quem sabia era o patrão."',
        ],
        opcoes: [],
      },
    },
  },
};

export function obterDialogo(localidadeId) {
  return DIALOGOS[localidadeId] || null;
}
