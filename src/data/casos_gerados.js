// =====================================================================
// CASOS GERADOS — ARQUIVO ESCRITO POR scripts/gerar-casos.mjs. NÃO EDITAR
// À MÃO: qualquer ajuste se faz no gerador (src/gerador/) ou no script, e
// regenera-se com `npm run gerar:casos`. O qa.mjs regenera e compara
// byte a byte (guarda de replay da FASE 6).
//
// DADO PURO de runtime: pacotes de caso completos (contrato de
// src/data/pacote_caso.js), pré-gerados em build time porque o gerador é
// ilha (o runtime jamais importa src/gerador).
//   • CASO_REPLICA: seed a_hora_emprestada_replica_96 + variáveis dirigidas
//     (a tentativa procedural de recriar "A Hora Emprestada").
//   • CASOS_POOL: o banco do modo "caso da comarca" (aleatório).
// =====================================================================

export const CASO_REPLICA = {
 "id": "gerado_a_hora_emprestada_replica_96",
 "verdadeDeOuro": {
  "id": "gerado_a_hora_emprestada_replica_96",
  "vitima": "Ada Thomas",
  "reuCorreto": "gen_1_criada",
  "horasMorteAntesChegada": 14,
  "horaMorteAbsoluta": -3,
  "mecanismoCorreto": "ferida_arma_branca",
  "instrumentoCorreto": "lamina_de_oficio",
  "motivacaoCorreta": "character_negado",
  "cenaEncenada": false,
  "horaForjada": null,
  "perifericos": {}
 },
 "suspeitos": [
  {
   "id": "gen_3_moleiro",
   "nome": "John Wilson",
   "idade": 55,
   "relacao": "Moleiro; mora em O Moinho",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_1_criada",
   "nome": "Mary Walker",
   "idade": 24,
   "relacao": "Criada; mora em A Taverna",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_5_paroco",
   "nome": "Thomas Jones",
   "idade": 68,
   "relacao": "Pároco; mora em O Presbitério",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_2_ferreiro",
   "nome": "Walter Williams",
   "idade": 35,
   "relacao": "Ferreiro; mora em Cottage nº 1",
   "descricao": "Conta a noite por canecas, e as horas não fecham entre si."
  },
  {
   "id": "gen_0_lavrador",
   "nome": "William Smith",
   "idade": 27,
   "relacao": "Lavrador; mora em Cottage nº 4",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  }
 ],
 "cartas": [
  {
   "id": "gen_rigor",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Rigidez Parcial",
     "carimboPadrao": "Maxilar duro; membros ainda cedem",
     "descricao": "O maxilar não cede ao polegar; os cotovelos ainda dobram ao peso da mão. A rigidez sobe pelo corpo e não o tomou inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "instalando",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 24,
     "textoDisplay": "Corpo Endurecido",
     "carimboPadrao": "Duro dos maxilares aos joelhos",
     "descricao": "Duro do maxilar aos joelhos. O corpo fixou-se na postura em que a morte o encontrou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "pleno",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 36,
     "textoDisplay": "Rigidez Cedendo",
     "carimboPadrao": "Maxilar solto; joelhos rígidos",
     "descricao": "O maxilar volta a ceder; os joelhos seguem presos. A rigidez que o tomou começa a desfazer-se.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolucao",
      "estadoDegradacao": "degradado"
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Corpo Flácido",
     "carimboPadrao": "Corpo mole, sem rigidez",
     "descricao": "Junta nenhuma resiste ao exame. A rigidez veio e já passou por inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolvido",
      "estadoDegradacao": "resolvido"
     }
    }
   ]
  },
  {
   "id": "gen_livores",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Manchas que Cedem ao Polegar",
     "carimboPadrao": "Manchas que empalidecem à pressão",
     "descricao": "As manchas de sangue assentado empalidecem sob o polegar e tornam à cor quando a pressão cessa. As manchas, porém, guardam o desenho de outra postura: assentaram do lado que ora fica para cima.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "movel",
      "posicaoCompativel": false
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou. As manchas, porém, guardam o desenho de outra postura: assentaram do lado que ora fica para cima.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "fixo",
      "posicaoCompativel": false
     }
    }
   ]
  },
  {
   "id": "gen_lesao_fatal",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "A Ferida Incisa",
   "carimboPadrao": "Sinal de arma branca",
   "descricao": "Corte de bordas regulares, mais fundo onde começa e raso onde termina. As margens são limpas, sem ponte de pele entre elas.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "ferida",
    "sinal": "ferida_incisa"
   }
  },
  {
   "id": "gen_reacao_vital",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "Bordas Vivas",
   "carimboPadrao": "Lesões sofridas em vida",
   "descricao": "As lesões mostram bordas inchadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "reacao_vital",
    "sinal": "reacao_vital"
   }
  },
  {
   "id": "gen_visto_vivo",
   "localidade": "delegacia",
   "suporteFisico": "testemunho",
   "origemTestemunha": null,
   "textoDisplay": "Última Vez com Vida",
   "carimboPadrao": "Vítima com vida às 19h00 de 13/out",
   "descricao": "Do registro da ronda consta Ada Thomas com vida às 19h00 de 13/out. Depois dessa hora, ninguém mais o encontrou em pé.",
   "tagsOcultas": {
    "dominio": "temporal",
    "subDominio": "ultima_vez_visto",
    "horaAvistamento": -5
   }
  },
  {
   "id": "gen_instrumento",
   "localidade": "oficio_do_reu",
   "suporteFisico": "pertences_do_reu",
   "textoDisplay": "O Lugar Vazio",
   "carimboPadrao": "Instrumento que falta no seu lugar",
   "descricao": "Entre as coisas de ofício de Mary Walker, um vão limpo no meio do pó: falta ali a peça cujo feitio casa com a lesão do morto.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "instrumento_oficio",
    "tipoVestigio": "lamina_de_oficio",
    "pertenceA": "gen_1_criada"
   }
  },
  {
   "id": "gen_motivo",
   "localidade": "delegacia",
   "suporteFisico": "registro",
   "textoDisplay": "Os Papéis do Móbil",
   "carimboPadrao": "Móbil de Mary Walker",
   "descricao": "Ada Thomas negou a Mary Walker a carta de referência; sem ela, casa nenhuma o toma a serviço.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "character_negado",
    "ligadoA": "gen_1_criada"
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — A Mercearia",
   "subtitulo": "Ada Thomas, merceeira, 39 anos",
   "acoesEspeciais": [
    "termometro"
   ],
   "gestos": [
    {
     "id": "gesto_voltar_corpo",
     "rotulo": "Voltar o corpo",
     "cartaId": "gen_livores"
    }
   ],
   "prosa": [
    "O morto jaz no chão do cômodo a que a vila chama quarto (sobrado), vestido como andava em casa. O delegado mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar de medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Mercearia",
   "subtitulo": "Onde Ada Thomas foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Mercearia guarda o dia em que o acharam. No cômodo, prateleiras frias da despensa, pia da copa, lavatório com bacia; o desarrumado corre de um canto a outro; a madeira do assoalho cheira a soda cáustica; uma peça de mobília repousa sobre o próprio arranhão."
   ],
   "blocosContingentes": []
  },
  {
   "id": "delegacia",
   "rotuloMesa": "A Delegacia",
   "titulo": "A Delegacia",
   "subtitulo": "Os papéis do caso",
   "acoesEspeciais": [],
   "prosa": [
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam do morto e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "vizinhanca",
   "rotuloMesa": "A Vizinhança",
   "titulo": "A Vizinhança da Cena",
   "subtitulo": "As casas em volta, as janelas que dão para a rua",
   "acoesEspeciais": [],
   "prosa": [
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua. O que uma noite faz de barulho, a vizinhança guarda de memória."
   ],
   "blocosContingentes": []
  },
  {
   "id": "oficio_do_reu",
   "rotuloMesa": "A Taverna",
   "titulo": "A Taverna — a diligência",
   "subtitulo": "Busca autorizada pelo delegado",
   "acoesEspeciais": [],
   "prosa": [
    "A diligência corre com o delegado à porta e o dono das coisas a um canto. Entre bancada e caixas, o que a busca encontra: [[gen_instrumento]]."
   ],
   "blocosContingentes": []
  }
 ],
 "nosMapa": [
  {
   "id": "corpo",
   "rotulo": "O Corpo",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "cena",
   "rotulo": "A Cena do Crime",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "delegacia",
   "rotulo": "A Delegacia",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "vizinhanca",
   "rotulo": "A Vizinhança",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "oficio_do_reu",
   "rotulo": "A Taverna",
   "grupo": "vila",
   "desbloqueadoInicio": true
  }
 ],
 "leads": [],
 "custos": {
  "cena_predio|cena_predio": 0,
  "cena_predio|vila": 1,
  "vila|cena_predio": 1,
  "vila|vila": 1
 },
 "dialogos": {},
 "confrontos": {
  "estadoInicial": "presente",
  "consequencias": {}
 },
 "abertura": {
  "passos": [
   {
    "id": "caulfield",
    "titulo": "Caulfield, 14 de outubro de 1893",
    "paragrafos": [
     "A pensão da Sra. Potts amanhece como sempre: o quarto estreito, a meia vela, o jornal de anteontem dobrado sobre a mesa.",
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio, e abre a caderneta na primeira página em branco."
    ],
    "rotuloBotao": "A vela queima"
   },
   {
    "id": "chamado",
    "titulo": "Batem à porta",
    "paragrafos": [
     "A Sra. Potts entra com o castiçal numa mão e um envelope na outra. \"Veio a cavalo, de Wrenfield. O rapaz disse que o delegado de lá manda dizer que é urgente.\""
    ],
    "rotuloBotao": "Abrir o envelope"
   },
   {
    "id": "carta",
    "titulo": "A carta do Delegado",
    "carta": true,
    "paragrafos": [
     "O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.",
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Wrenfield, e como homem que sabe o tamanho do que não sabe. Ada Thomas, merceeira desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
     "\"Roderick, Delegado.\""
    ],
    "rotuloBotao": "Aceitar o chamado"
   },
   {
    "id": "transformacao",
    "titulo": "A mesa se transforma",
    "paragrafos": [
     "A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta.",
     "{detective.title} {detective.surname} desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer."
    ],
    "rotuloBotao": "Tomar o trem"
   },
   {
    "id": "chegada",
    "titulo": "Wrenfield",
    "paragrafos": [
     "A plataforma cheira a carvão e palha molhada. Wrenfield estende-se além dos trilhos, e a luz de outubro alonga as sombras rua adentro.",
     "O delegado Roderick espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Roderick",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Ada Thomas, 39 anos, merceeira. Achado morto em A Mercearia. Não toquei em nada e não prendi ninguém.\"",
     "Detém-se à porta e baixa a voz. \"Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}.\""
    ],
    "rotuloBotao": "Entrar — iniciar a investigação"
   }
  ],
  "perguntas": [
   {
    "id": "sobre_a_hora",
    "pergunta": "O que se sabe da hora da morte?",
    "resposta": "\"De horas não me arrisco: papel meu não data defunto. O corpo está como o achamos; {g:o senhor|a senhora} dirá por ele.\""
   },
   {
    "id": "quem_convive",
    "pergunta": "Quem convivia com a vítima?",
    "resposta": "\"Homem de poucas companhias. O que a vila souber, a vila conta melhor que eu.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si — a vizinhança fala mais comigo fora do expediente que dentro dele.\""
   }
  ],
  "opcoesPersonagem": [
   {
    "id": "harlan",
    "nome": "Dr. Harlan Blackwell",
    "descricao": "Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem."
   }
  ]
 },
 "parametrosCena": {
  "horasChegada": 11,
  "ambiente": 11,
  "calendario": {
   "diaBase": 14,
   "mesAbrev": "out",
   "mesExtenso": "outubro",
   "ano": 1893
  }
 }
};

export const CASOS_POOL = [
{
 "id": "gerado_comarca_1",
 "verdadeDeOuro": {
  "id": "gerado_comarca_1",
  "vitima": "Henry Brown",
  "reuCorreto": "gen_1_boticario",
  "horasMorteAntesChegada": 8,
  "horaMorteAbsoluta": 3,
  "mecanismoCorreto": "estrangulamento_ligadura",
  "instrumentoCorreto": "cordao_torcido",
  "motivacaoCorreta": "heranca",
  "cenaEncenada": false,
  "horaForjada": null,
  "perifericos": {}
 },
 "suspeitos": [
  {
   "id": "gen_5_criada",
   "nome": "Alice Thomas",
   "idade": 20,
   "relacao": "Criada; mora em A Taverna",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_2_lavrador",
   "nome": "George Evans",
   "idade": 43,
   "relacao": "Lavrador; mora em Cottage nº 1",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  },
  {
   "id": "gen_4_constable",
   "nome": "George Smith",
   "idade": 21,
   "relacao": "Constable do condado; mora em A Delegacia",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_1_boticario",
   "nome": "James Jones",
   "idade": 57,
   "relacao": "Boticário; mora em A Botica",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_0_costureira",
   "nome": "Martha Roberts",
   "idade": 56,
   "relacao": "Costureira; mora em Cottage nº 4",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  }
 ],
 "cartas": [
  {
   "id": "gen_rigor",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Rigidez Parcial",
     "carimboPadrao": "Maxilar duro; membros ainda cedem",
     "descricao": "O maxilar não cede ao polegar; os cotovelos ainda dobram ao peso da mão. A rigidez sobe pelo corpo e não o tomou inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "instalando",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 24,
     "textoDisplay": "Corpo Endurecido",
     "carimboPadrao": "Duro dos maxilares aos joelhos",
     "descricao": "Duro do maxilar aos joelhos. O corpo fixou-se na postura em que a morte o encontrou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "pleno",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 36,
     "textoDisplay": "Rigidez Cedendo",
     "carimboPadrao": "Maxilar solto; joelhos rígidos",
     "descricao": "O maxilar volta a ceder; os joelhos seguem presos. A rigidez que o tomou começa a desfazer-se.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolucao",
      "estadoDegradacao": "degradado"
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Corpo Flácido",
     "carimboPadrao": "Corpo mole, sem rigidez",
     "descricao": "Junta nenhuma resiste ao exame. A rigidez veio e já passou por inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolvido",
      "estadoDegradacao": "resolvido"
     }
    }
   ]
  },
  {
   "id": "gen_livores",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Manchas que Cedem ao Polegar",
     "carimboPadrao": "Manchas que empalidecem à pressão",
     "descricao": "As manchas de sangue assentado empalidecem sob o polegar e tornam à cor quando a pressão cessa.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "movel",
      "posicaoCompativel": true
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "fixo",
      "posicaoCompativel": true
     }
    }
   ]
  },
  {
   "id": "gen_lesao_fatal",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "O Sulco no Pescoço",
   "carimboPadrao": "Sinal de garrote (ligadura)",
   "descricao": "Um sulco uniforme corre horizontal em volta do pescoço, na mesma profundidade de ponta a ponta, sem subir rumo à nuca.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "ferida",
    "sinal": "sulco_horizontal"
   }
  },
  {
   "id": "gen_reacao_vital",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "Bordas Vivas",
   "carimboPadrao": "Lesões sofridas em vida",
   "descricao": "As lesões mostram bordas inchadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "reacao_vital",
    "sinal": "reacao_vital"
   }
  },
  {
   "id": "gen_visto_vivo",
   "localidade": "delegacia",
   "suporteFisico": "testemunho",
   "origemTestemunha": null,
   "textoDisplay": "Última Vez com Vida",
   "carimboPadrao": "Vítima com vida às 01h00 de 14/out",
   "descricao": "Do registro da ronda consta Henry Brown com vida às 01h00 de 14/out. Depois dessa hora, ninguém mais o encontrou em pé.",
   "tagsOcultas": {
    "dominio": "temporal",
    "subDominio": "ultima_vez_visto",
    "horaAvistamento": 1
   }
  },
  {
   "id": "gen_instrumento",
   "localidade": "oficio_do_reu",
   "suporteFisico": "pertences_do_reu",
   "textoDisplay": "O Instrumento Úmido",
   "carimboPadrao": "Instrumento guardado ainda úmido",
   "descricao": "Entre os pertences de James Jones, a peça guardada lavada — e a junta do cabo ainda úmida. O feitio casa com a lesão do morto.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "instrumento_oficio",
    "tipoVestigio": "cordao_torcido",
    "pertenceA": "gen_1_boticario"
   }
  },
  {
   "id": "gen_motivo",
   "localidade": "delegacia",
   "suporteFisico": "registro",
   "textoDisplay": "Os Papéis do Móbil",
   "carimboPadrao": "Móbil de James Jones",
   "descricao": "Papéis de partilha: com a morte de Henry Brown, o que era dele passa às mãos de James Jones.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "heranca",
    "ligadoA": "gen_1_boticario"
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — A Mercearia",
   "subtitulo": "Henry Brown, merceeiro, 47 anos",
   "acoesEspeciais": [
    "termometro"
   ],
   "gestos": [
    {
     "id": "gesto_voltar_corpo",
     "rotulo": "Voltar o corpo",
     "cartaId": "gen_livores"
    }
   ],
   "prosa": [
    "O morto jaz no chão do cômodo a que a vila chama quarto (sobrado), vestido como andava em casa. O delegado mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar de medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Mercearia",
   "subtitulo": "Onde Henry Brown foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Mercearia guarda o dia em que o acharam. No cômodo, prateleiras frias da despensa, pia da copa, cômoda."
   ],
   "blocosContingentes": []
  },
  {
   "id": "delegacia",
   "rotuloMesa": "A Delegacia",
   "titulo": "A Delegacia",
   "subtitulo": "Os papéis do caso",
   "acoesEspeciais": [],
   "prosa": [
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam do morto e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "vizinhanca",
   "rotuloMesa": "A Vizinhança",
   "titulo": "A Vizinhança da Cena",
   "subtitulo": "As casas em volta, as janelas que dão para a rua",
   "acoesEspeciais": [],
   "prosa": [
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua. O que uma noite faz de barulho, a vizinhança guarda de memória."
   ],
   "blocosContingentes": []
  },
  {
   "id": "oficio_do_reu",
   "rotuloMesa": "A Botica",
   "titulo": "A Botica — a diligência",
   "subtitulo": "Busca autorizada pelo delegado",
   "acoesEspeciais": [],
   "prosa": [
    "A diligência corre com o delegado à porta e o dono das coisas a um canto. Entre bancada e caixas, o que a busca encontra: [[gen_instrumento]]."
   ],
   "blocosContingentes": []
  }
 ],
 "nosMapa": [
  {
   "id": "corpo",
   "rotulo": "O Corpo",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "cena",
   "rotulo": "A Cena do Crime",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "delegacia",
   "rotulo": "A Delegacia",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "vizinhanca",
   "rotulo": "A Vizinhança",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "oficio_do_reu",
   "rotulo": "A Botica",
   "grupo": "vila",
   "desbloqueadoInicio": true
  }
 ],
 "leads": [],
 "custos": {
  "cena_predio|cena_predio": 0,
  "cena_predio|vila": 1,
  "vila|cena_predio": 1,
  "vila|vila": 1
 },
 "dialogos": {},
 "confrontos": {
  "estadoInicial": "presente",
  "consequencias": {}
 },
 "abertura": {
  "passos": [
   {
    "id": "caulfield",
    "titulo": "Caulfield, 14 de outubro de 1893",
    "paragrafos": [
     "A pensão da Sra. Potts amanhece como sempre: o quarto estreito, a meia vela, o jornal de anteontem dobrado sobre a mesa.",
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio, e abre a caderneta na primeira página em branco."
    ],
    "rotuloBotao": "A vela queima"
   },
   {
    "id": "chamado",
    "titulo": "Batem à porta",
    "paragrafos": [
     "A Sra. Potts entra com o castiçal numa mão e um envelope na outra. \"Veio a cavalo, de Aldergate. O rapaz disse que o delegado de lá manda dizer que é urgente.\""
    ],
    "rotuloBotao": "Abrir o envelope"
   },
   {
    "id": "carta",
    "titulo": "A carta do Delegado",
    "carta": true,
    "paragrafos": [
     "O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.",
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Aldergate, e como homem que sabe o tamanho do que não sabe. Henry Brown, merceeiro desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
     "\"Roderick, Delegado.\""
    ],
    "rotuloBotao": "Aceitar o chamado"
   },
   {
    "id": "transformacao",
    "titulo": "A mesa se transforma",
    "paragrafos": [
     "A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta.",
     "{detective.title} {detective.surname} desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer."
    ],
    "rotuloBotao": "Tomar o trem"
   },
   {
    "id": "chegada",
    "titulo": "Aldergate",
    "paragrafos": [
     "A plataforma cheira a carvão e palha molhada. Aldergate estende-se além dos trilhos, e a luz de outubro alonga as sombras rua adentro.",
     "O delegado Roderick espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Roderick",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Henry Brown, 47 anos, merceeiro. Achado morto em A Mercearia. Não toquei em nada e não prendi ninguém.\"",
     "Detém-se à porta e baixa a voz. \"Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}.\""
    ],
    "rotuloBotao": "Entrar — iniciar a investigação"
   }
  ],
  "perguntas": [
   {
    "id": "sobre_a_hora",
    "pergunta": "O que se sabe da hora da morte?",
    "resposta": "\"De horas não me arrisco: papel meu não data defunto. O corpo está como o achamos; {g:o senhor|a senhora} dirá por ele.\""
   },
   {
    "id": "quem_convive",
    "pergunta": "Quem convivia com a vítima?",
    "resposta": "\"Homem de poucas companhias. O que a vila souber, a vila conta melhor que eu.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si — a vizinhança fala mais comigo fora do expediente que dentro dele.\""
   }
  ],
  "opcoesPersonagem": [
   {
    "id": "harlan",
    "nome": "Dr. Harlan Blackwell",
    "descricao": "Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem."
   }
  ]
 },
 "parametrosCena": {
  "horasChegada": 11,
  "ambiente": 11,
  "calendario": {
   "diaBase": 14,
   "mesAbrev": "out",
   "mesExtenso": "outubro",
   "ano": 1893
  }
 }
},
{
 "id": "gerado_comarca_2",
 "verdadeDeOuro": {
  "id": "gerado_comarca_2",
  "vitima": "Ada Jones",
  "reuCorreto": "gen_6_lavrador",
  "horasMorteAntesChegada": 12,
  "horaMorteAbsoluta": -1,
  "mecanismoCorreto": "ferida_arma_branca",
  "instrumentoCorreto": "lamina_de_oficio",
  "motivacaoCorreta": "seguro_de_enterro",
  "cenaEncenada": false,
  "horaForjada": null,
  "perifericos": {}
 },
 "suspeitos": [
  {
   "id": "gen_4_criada",
   "nome": "Annie Thomas",
   "idade": 28,
   "relacao": "Criada; mora em A Taverna",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_0_constable",
   "nome": "Ernest Jones",
   "idade": 31,
   "relacao": "Constable do condado; mora em A Delegacia",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_3_lavrador",
   "nome": "George Taylor",
   "idade": 44,
   "relacao": "Lavrador; mora em Cottage nº 2",
   "descricao": "Conta a noite por canecas, e as horas não fecham entre si."
  },
  {
   "id": "gen_6_lavrador",
   "nome": "James Brown",
   "idade": 49,
   "relacao": "Lavrador; mora em Cottage nº 3",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_1_medico",
   "nome": "William Roberts",
   "idade": 45,
   "relacao": "Médico rural; mora em Casa do Médico",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  }
 ],
 "cartas": [
  {
   "id": "gen_rigor",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Rigidez Parcial",
     "carimboPadrao": "Maxilar duro; membros ainda cedem",
     "descricao": "O maxilar não cede ao polegar; os cotovelos ainda dobram ao peso da mão. A rigidez sobe pelo corpo e não o tomou inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "instalando",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 24,
     "textoDisplay": "Corpo Endurecido",
     "carimboPadrao": "Duro dos maxilares aos joelhos",
     "descricao": "Duro do maxilar aos joelhos. O corpo fixou-se na postura em que a morte o encontrou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "pleno",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 36,
     "textoDisplay": "Rigidez Cedendo",
     "carimboPadrao": "Maxilar solto; joelhos rígidos",
     "descricao": "O maxilar volta a ceder; os joelhos seguem presos. A rigidez que o tomou começa a desfazer-se.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolucao",
      "estadoDegradacao": "degradado"
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Corpo Flácido",
     "carimboPadrao": "Corpo mole, sem rigidez",
     "descricao": "Junta nenhuma resiste ao exame. A rigidez veio e já passou por inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolvido",
      "estadoDegradacao": "resolvido"
     }
    }
   ]
  },
  {
   "id": "gen_livores",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Manchas que Cedem ao Polegar",
     "carimboPadrao": "Manchas que empalidecem à pressão",
     "descricao": "As manchas de sangue assentado empalidecem sob o polegar e tornam à cor quando a pressão cessa.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "movel",
      "posicaoCompativel": true
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "fixo",
      "posicaoCompativel": true
     }
    }
   ]
  },
  {
   "id": "gen_lesao_fatal",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "A Ferida Incisa",
   "carimboPadrao": "Sinal de arma branca",
   "descricao": "Corte de bordas regulares, mais fundo onde começa e raso onde termina. As margens são limpas, sem ponte de pele entre elas.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "ferida",
    "sinal": "ferida_incisa"
   }
  },
  {
   "id": "gen_reacao_vital",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "Bordas Vivas",
   "carimboPadrao": "Lesões sofridas em vida",
   "descricao": "As lesões mostram bordas inchadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "reacao_vital",
    "sinal": "reacao_vital"
   }
  },
  {
   "id": "gen_visto_vivo",
   "localidade": "delegacia",
   "suporteFisico": "testemunho",
   "origemTestemunha": "gen_4_criada",
   "textoDisplay": "Última Vez com Vida",
   "carimboPadrao": "Vítima com vida às 21h00 de 13/out",
   "descricao": "Annie Thomas esteve com Ada Jones às 21h00 de 13/out, e o declara à ronda. Depois dessa hora, ninguém mais o encontrou em pé.",
   "tagsOcultas": {
    "dominio": "temporal",
    "subDominio": "ultima_vez_visto",
    "horaAvistamento": -3
   }
  },
  {
   "id": "gen_instrumento",
   "localidade": "oficio_do_reu",
   "suporteFisico": "pertences_do_reu",
   "textoDisplay": "O Instrumento Úmido",
   "carimboPadrao": "Instrumento guardado ainda úmido",
   "descricao": "Entre os pertences de James Brown, a peça guardada lavada — e a junta do cabo ainda úmida. O feitio casa com a lesão do morto.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "instrumento_oficio",
    "tipoVestigio": "lamina_de_oficio",
    "pertenceA": "gen_6_lavrador"
   }
  },
  {
   "id": "gen_sangue_alheio",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "Sangue que Não É da Vítima",
   "carimboPadrao": "Sangue afastado do corpo",
   "descricao": "Gotas de sangue a passos do corpo, num caminho que o morto não fez. Alguém saiu dali ferido, e andando.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "sangue_do_agressor",
    "tipoVestigio": "sangue_alheio",
    "pertenceA": "gen_6_lavrador"
   }
  },
  {
   "id": "gen_ruido_ouvido",
   "localidade": "vizinhanca",
   "suporteFisico": "testemunho",
   "origemTestemunha": "gen_4_criada",
   "textoDisplay": "O Barulho na Vizinhança",
   "carimboPadrao": "Barulho ouvido na noite de 13",
   "descricao": "Annie Thomas conta o que a parede deixou passar na noite de 13: \"Pancada, e móvel no chão, e depois mais nada.\"",
   "tagsOcultas": {
    "dominio": "testemunho",
    "subDominio": "ruido_ouvido",
    "faixa": "noite"
   }
  },
  {
   "id": "gen_motivo",
   "localidade": "delegacia",
   "suporteFisico": "registro",
   "textoDisplay": "Os Papéis do Móbil",
   "carimboPadrao": "Móbil de James Brown",
   "descricao": "Uma apólice de enterro em nome de Ada Jones paga a James Brown quando a morte vier.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "seguro_de_enterro",
    "ligadoA": "gen_6_lavrador"
   }
  },
  {
   "id": "gen_intf_intf_1_prenuncio",
   "localidade": "vizinhanca",
   "textoDisplay": "A Testemunha Inquieta",
   "carimboPadrao": "Testemunha que pede sigilo",
   "descricao": "Annie Thomas diz que não viu nada; depois, que viu pouco; depois, que era tarde. Na despedida, segura a manga do perito: \"O senhor vai embora quando isso acabar. Eu fico.\"",
   "tagsOcultas": {
    "dominio": "testemunho",
    "subDominio": "prenuncio",
    "testemunha": "gen_4_criada"
   }
  },
  {
   "id": "gen_intf_intf_1_corpo",
   "localidade": "vizinhanca",
   "textoDisplay": "O Segundo Corpo",
   "carimboPadrao": "Corpo da testemunha (morte de horas, não de dias)",
   "descricao": "O segundo corpo tem rigor e manchas de poucas horas: morte posterior à primeira perícia, e de mão mais grosseira que a primeira.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "segunda_morte",
    "tipoVestigio": "corpo_da_testemunha"
   },
   "vestigioInterferencia": {
    "classe": "segunda_morte",
    "frescor": "fresco",
    "localId": "pub",
    "comodo": "quartos",
    "celula": {
     "col": 0,
     "fila": 0
    },
    "mobilia": "quartos_bacia_e_jarro"
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — A Taverna",
   "subtitulo": "Ada Jones, criada, 18 anos",
   "acoesEspeciais": [
    "termometro"
   ],
   "gestos": [
    {
     "id": "gesto_voltar_corpo",
     "rotulo": "Voltar o corpo",
     "cartaId": "gen_livores"
    }
   ],
   "prosa": [
    "O morto jaz no chão do cômodo a que a vila chama taproom, vestido como andava em casa. O delegado mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar de medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Taverna",
   "subtitulo": "Onde Ada Jones foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Taverna guarda o dia em que o acharam. No cômodo, bacia e jarro, baú de roupa, cama de ferro; o desarrumado corre de um canto a outro; há mobília por erguer do chão.",
    "A passos do corpo, fora do caminho dele: [[gen_sangue_alheio]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "delegacia",
   "rotuloMesa": "A Delegacia",
   "titulo": "A Delegacia",
   "subtitulo": "Os papéis do caso",
   "acoesEspeciais": [],
   "prosa": [
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam do morto e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "vizinhanca",
   "rotuloMesa": "A Vizinhança",
   "titulo": "A Vizinhança da Cena",
   "subtitulo": "As casas em volta, as janelas que dão para a rua",
   "acoesEspeciais": [],
   "prosa": [
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua. O que uma noite faz de barulho, a vizinhança guarda de memória.",
    "Uma porta se entreabre à passagem {g:do perito|da perita}: [[gen_intf_intf_1_prenuncio]]."
   ],
   "blocosContingentes": [
    {
     "eventoId": "intf_1",
     "quando": "nao_disparado",
     "paragrafos": [
      "De uma janela vizinha, quem ouviu conta: [[gen_ruido_ouvido]]."
     ]
    },
    {
     "eventoId": "intf_1",
     "quando": "disparado",
     "paragrafos": [
      "Desde a última visita, alguma coisa mudou por aqui. [[gen_intf_intf_1_corpo]]"
     ]
    }
   ]
  },
  {
   "id": "oficio_do_reu",
   "rotuloMesa": "A Granja",
   "titulo": "A Granja — a diligência",
   "subtitulo": "Busca autorizada pelo delegado",
   "acoesEspeciais": [],
   "prosa": [
    "A diligência corre com o delegado à porta e o dono das coisas a um canto. Entre bancada e caixas, o que a busca encontra: [[gen_instrumento]]."
   ],
   "blocosContingentes": []
  }
 ],
 "nosMapa": [
  {
   "id": "corpo",
   "rotulo": "O Corpo",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "cena",
   "rotulo": "A Cena do Crime",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "delegacia",
   "rotulo": "A Delegacia",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "vizinhanca",
   "rotulo": "A Vizinhança",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "oficio_do_reu",
   "rotulo": "A Granja",
   "grupo": "vila",
   "desbloqueadoInicio": true
  }
 ],
 "leads": [],
 "custos": {
  "cena_predio|cena_predio": 0,
  "cena_predio|vila": 1,
  "vila|cena_predio": 1,
  "vila|vila": 1
 },
 "dialogos": {},
 "confrontos": {
  "estadoInicial": "presente",
  "consequencias": {}
 },
 "abertura": {
  "passos": [
   {
    "id": "caulfield",
    "titulo": "Caulfield, 14 de outubro de 1893",
    "paragrafos": [
     "A pensão da Sra. Potts amanhece como sempre: o quarto estreito, a meia vela, o jornal de anteontem dobrado sobre a mesa.",
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio, e abre a caderneta na primeira página em branco."
    ],
    "rotuloBotao": "A vela queima"
   },
   {
    "id": "chamado",
    "titulo": "Batem à porta",
    "paragrafos": [
     "A Sra. Potts entra com o castiçal numa mão e um envelope na outra. \"Veio a cavalo, de Haversham. O rapaz disse que o delegado de lá manda dizer que é urgente.\""
    ],
    "rotuloBotao": "Abrir o envelope"
   },
   {
    "id": "carta",
    "titulo": "A carta do Delegado",
    "carta": true,
    "paragrafos": [
     "O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.",
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Haversham, e como homem que sabe o tamanho do que não sabe. Ada Jones, criada desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
     "\"Stanmore, Delegado.\""
    ],
    "rotuloBotao": "Aceitar o chamado"
   },
   {
    "id": "transformacao",
    "titulo": "A mesa se transforma",
    "paragrafos": [
     "A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta.",
     "{detective.title} {detective.surname} desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer."
    ],
    "rotuloBotao": "Tomar o trem"
   },
   {
    "id": "chegada",
    "titulo": "Haversham",
    "paragrafos": [
     "A plataforma cheira a carvão e palha molhada. Haversham estende-se além dos trilhos, e a luz de outubro alonga as sombras rua adentro.",
     "O delegado Stanmore espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Stanmore",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Ada Jones, 18 anos, criada. Achado morto em A Taverna. Não toquei em nada e não prendi ninguém.\"",
     "Detém-se à porta e baixa a voz. \"Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}.\""
    ],
    "rotuloBotao": "Entrar — iniciar a investigação"
   }
  ],
  "perguntas": [
   {
    "id": "sobre_a_hora",
    "pergunta": "O que se sabe da hora da morte?",
    "resposta": "\"De horas não me arrisco: papel meu não data defunto. O corpo está como o achamos; {g:o senhor|a senhora} dirá por ele.\""
   },
   {
    "id": "quem_convive",
    "pergunta": "Quem convivia com a vítima?",
    "resposta": "\"Do dia a dia dele? Annie Thomas, James Brown — gente que partilhava teto ou trabalho. Os nomes estão nos meus papéis.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si — a vizinhança fala mais comigo fora do expediente que dentro dele.\""
   }
  ],
  "opcoesPersonagem": [
   {
    "id": "harlan",
    "nome": "Dr. Harlan Blackwell",
    "descricao": "Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem."
   }
  ]
 },
 "parametrosCena": {
  "horasChegada": 11,
  "ambiente": 11,
  "calendario": {
   "diaBase": 14,
   "mesAbrev": "out",
   "mesExtenso": "outubro",
   "ano": 1893
  }
 },
 "interferencias": {
  "eventos": [
   {
    "id": "intf_1",
    "tipo": "silenciar",
    "ator": "gen_6_lavrador",
    "atorPapel": "assassino",
    "alvo": {
     "tipo": "testemunha",
     "testemunhaId": "gen_4_criada",
     "cartaId": "gen_ruido_ouvido",
     "localId": "pub"
    },
    "gatilho": {
     "tipo": "extracao_carta",
     "cartaId": "gen_visto_vivo",
     "comoSoube": "o perito perguntou em público quem viu a vítima por última vez (extração de gen_visto_vivo); o ator entendeu que a vizinhança seria ouvida em seguida"
    },
    "rota": {
     "de": "pub",
     "para": "pub",
     "faixa": "noite",
     "sustentacao": "mesmo_local",
     "comoChegou": "a rotina da faixa noite já o punha em pub — não precisou de trajeto"
    },
    "rolagem": {
     "wis": 3,
     "penalidade": 2,
     "alvo": 1,
     "dado": 0,
     "sucesso": true
    },
    "efeito": {
     "cartaDestruida": "gen_ruido_ouvido",
     "cartasNovas": [
      "gen_intf_intf_1_corpo"
     ]
    },
    "prenuncio": {
     "cartaId": "gen_intf_intf_1_prenuncio",
     "texto": "Annie Thomas diz que não viu nada; depois, que viu pouco; depois, que era tarde. Na despedida, segura a manga do perito: \"O senhor vai embora quando isso acabar. Eu fico.\""
    },
    "anuncio": "A testemunha que tinha o que contar foi encontrada morta."
   }
  ]
 },
 "ecosInterferencia": {
  "titulo": "O legista, sobre o que se moveu",
  "porChave": {
   "destruir_evidencia_ocorrida": [
    "Esfregaram a cena entre uma visita e outra; a madeira ainda estava úmida. A peça que se perdeu não volta, mas esfrega fresca também se data.",
    "Levaram da cena o que o senhor ainda não tinha recolhido. Ficou no lugar a limpeza recente, e limpeza recente se lê como qualquer outro sinal."
   ],
   "destruir_evidencia_evitada": [
    "Vieram limpar a cena; o que importava já estava no seu caderno.",
    "Quando esfregaram o assoalho, a peça já constava do seu registro. Guarde o método: primeiro o que pode sumir."
   ],
   "intimidar_testemunha_ocorrida": [
    "Aquela boca fechou depois que as suas perguntas correram a vila. Anote o dia em que fechou.",
    "A testemunha recuou antes de assinar o que sabia. Onde o depoimento faltar, procure o que sobrou em torno da recusa."
   ],
   "intimidar_testemunha_evitada": [
    "Tentaram calar quem já tinha falado ao senhor. O depoimento estava colhido; o medo chegou atrasado.",
    "A ameaça veio depois do registro, e contra registro feito o medo pode pouco."
   ],
   "subornar_testemunha_ocorrida": [
    "A mesma boca contou duas histórias, e a segunda veio na semana em que uma dívida antiga se quitou.",
    "Há dois depoimentos que não se encontram e uma dívida quitada entre um e outro. Ponha as três coisas lado a lado e meça as datas."
   ],
   "silenciar_ocorrida": [
    "Perdemos a testemunha antes do depoimento. O segundo corpo é morte de horas, não de dias; e o segundo serviço, mais grosseiro, se lê mais fácil que o primeiro.",
    "Quem ouviu aquela noite não chegou a depor. O segundo corpo se lia como o primeiro: rigor, livor, a conta das horas. O que o gesto teve de grosseiro ficou nos sinais."
   ],
   "silenciar_evitada": [
    "A testemunha morreu com o depoimento já no seu caderno. O senhor chegou primeiro; o que sabia, o tribunal ainda ouve.",
    "O aviso estava lá, para quem quisesse ler — e o depoimento sobreviveu a quem o deu."
   ]
  }
 }
},
{
 "id": "gerado_comarca_3",
 "verdadeDeOuro": {
  "id": "gerado_comarca_3",
  "vitima": "Mary Walker",
  "reuCorreto": "gen_7_lavrador",
  "horasMorteAntesChegada": 9,
  "horaMorteAbsoluta": 2,
  "mecanismoCorreto": "estrangulamento_manual",
  "instrumentoCorreto": "pertence_arrancado",
  "motivacaoCorreta": "despejo",
  "cenaEncenada": false,
  "horaForjada": null,
  "perifericos": {}
 },
 "suspeitos": [
  {
   "id": "gen_2_ferreiro",
   "nome": "Charles Williams",
   "idade": 34,
   "relacao": "Ferreiro; mora em Cottage nº 1",
   "descricao": "Conta a noite por canecas, e as horas não fecham entre si."
  },
  {
   "id": "gen_3_merceeiro",
   "nome": "Frank Wilson",
   "idade": 35,
   "relacao": "Merceeiro; mora em A Mercearia",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_0_lavrador",
   "nome": "Harry Evans",
   "idade": 23,
   "relacao": "Lavrador; mora em Cottage nº 5",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_7_lavrador",
   "nome": "James Brown",
   "idade": 53,
   "relacao": "Lavrador; mora em Cottage nº 4",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_6_lavrador",
   "nome": "John Evans",
   "idade": 15,
   "relacao": "Lavrador; mora em Cottage nº 3",
   "descricao": "Fala baixo e mede a porta antes de responder."
  }
 ],
 "cartas": [
  {
   "id": "gen_rigor",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Rigidez Parcial",
     "carimboPadrao": "Maxilar duro; membros ainda cedem",
     "descricao": "O maxilar não cede ao polegar; os cotovelos ainda dobram ao peso da mão. A rigidez sobe pelo corpo e não o tomou inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "instalando",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 24,
     "textoDisplay": "Corpo Endurecido",
     "carimboPadrao": "Duro dos maxilares aos joelhos",
     "descricao": "Duro do maxilar aos joelhos. O corpo fixou-se na postura em que a morte o encontrou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "pleno",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 36,
     "textoDisplay": "Rigidez Cedendo",
     "carimboPadrao": "Maxilar solto; joelhos rígidos",
     "descricao": "O maxilar volta a ceder; os joelhos seguem presos. A rigidez que o tomou começa a desfazer-se.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolucao",
      "estadoDegradacao": "degradado"
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Corpo Flácido",
     "carimboPadrao": "Corpo mole, sem rigidez",
     "descricao": "Junta nenhuma resiste ao exame. A rigidez veio e já passou por inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolvido",
      "estadoDegradacao": "resolvido"
     }
    }
   ]
  },
  {
   "id": "gen_livores",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Manchas que Cedem ao Polegar",
     "carimboPadrao": "Manchas que empalidecem à pressão",
     "descricao": "As manchas de sangue assentado empalidecem sob o polegar e tornam à cor quando a pressão cessa.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "movel",
      "posicaoCompativel": true
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "fixo",
      "posicaoCompativel": true
     }
    }
   ]
  },
  {
   "id": "gen_lesao_fatal",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "As Marcas no Pescoço",
   "carimboPadrao": "Sinal de estrangulamento manual",
   "descricao": "Equimoses do tamanho de polpas de dedo dos dois lados da traqueia, e meias-luas de unha impressas na pele.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "ferida",
    "sinal": "equimoses_digitais"
   }
  },
  {
   "id": "gen_reacao_vital",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "Bordas Vivas",
   "carimboPadrao": "Lesões sofridas em vida",
   "descricao": "As lesões mostram bordas inchadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "reacao_vital",
    "sinal": "reacao_vital"
   }
  },
  {
   "id": "gen_visto_vivo",
   "localidade": "delegacia",
   "suporteFisico": "testemunho",
   "origemTestemunha": "gen_2_ferreiro",
   "textoDisplay": "Última Vez com Vida",
   "carimboPadrao": "Vítima com vida às 01h00 de 14/out",
   "descricao": "Charles Williams esteve com Mary Walker às 01h00 de 14/out, e o declara à ronda. Depois dessa hora, ninguém mais o encontrou em pé.",
   "tagsOcultas": {
    "dominio": "temporal",
    "subDominio": "ultima_vez_visto",
    "horaAvistamento": 1
   }
  },
  {
   "id": "gen_pertence",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "O Pertence Arrancado",
   "carimboPadrao": "Botão com fio na mão da vítima",
   "descricao": "Na mão fechada do morto, um botão de casaco com fio e um triângulo de pano. O casaco de James Brown perdeu o segundo botão.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "objeto_pessoal",
    "tipoVestigio": "pertence_arrancado",
    "pertenceA": "gen_7_lavrador"
   }
  },
  {
   "id": "gen_motivo",
   "localidade": "delegacia",
   "suporteFisico": "registro",
   "textoDisplay": "Os Papéis do Móbil",
   "carimboPadrao": "Móbil de James Brown",
   "descricao": "A ordem de despejo do cottage de James Brown leva a assinatura de Mary Walker.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "despejo",
    "ligadoA": "gen_7_lavrador"
   }
  },
  {
   "id": "gen_intf_intf_1_retratacao",
   "localidade": "vizinhanca",
   "textoDisplay": "O Depoimento que Mudou",
   "carimboPadrao": "Depoimento novo que desmente o anterior",
   "descricao": "Charles Williams conta agora outra versão da mesma noite — palavra nova contra o que consta do primeiro registro.",
   "tagsOcultas": {
    "dominio": "testemunho",
    "subDominio": "retratacao",
    "testemunha": "gen_2_ferreiro",
    "desmente": "gen_visto_vivo"
   },
   "vestigioInterferencia": {
    "classe": "depoimento_contraditorio",
    "frescor": "fresco",
    "localId": null,
    "comodo": null,
    "celula": null,
    "mobilia": null
   }
  },
  {
   "id": "gen_intf_intf_1_dividas",
   "localidade": "vizinhanca",
   "textoDisplay": "A Caderneta Quitada",
   "carimboPadrao": "Dívidas quitadas de repente",
   "descricao": "A caderneta de fiado amanheceu quitada, na mesma semana da nova versão. Dívida velha não se paga sozinha.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "rastro_de_dinheiro",
    "tipoVestigio": "dividas_quitadas"
   },
   "vestigioInterferencia": {
    "classe": "dividas_quitadas",
    "frescor": "fresco",
    "localId": null,
    "comodo": null,
    "celula": null,
    "mobilia": null
   }
  },
  {
   "id": "gen_intf_intf_1_soberanos",
   "localidade": "vizinhanca",
   "textoDisplay": "Soberanos Novos",
   "carimboPadrao": "Soberanos novos, contados à vista de todos",
   "descricao": "Soberanos novos, contados à vista de todos. Moeda graúda tem caminho — e o caminho sobe até James Brown.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "rastro_de_dinheiro",
    "pertenceA": "gen_7_lavrador"
   },
   "vestigioInterferencia": {
    "classe": "soberanos_novos",
    "frescor": "fresco",
    "localId": null,
    "comodo": null,
    "celula": null,
    "mobilia": null
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — A Taverna",
   "subtitulo": "Mary Walker, criada, 14 anos",
   "acoesEspeciais": [
    "termometro"
   ],
   "gestos": [
    {
     "id": "gesto_voltar_corpo",
     "rotulo": "Voltar o corpo",
     "cartaId": "gen_livores"
    }
   ],
   "prosa": [
    "O morto jaz no chão do cômodo a que a vila chama quartos (sobrado), vestido como andava em casa. O delegado mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar de medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Taverna",
   "subtitulo": "Onde Mary Walker foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Taverna guarda o dia em que o acharam. No cômodo, cama de ferro, bacia e jarro, cadeiras Windsor.",
    "Na mão fechada do morto, por abrir desde ontem: [[gen_pertence]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "delegacia",
   "rotuloMesa": "A Delegacia",
   "titulo": "A Delegacia",
   "subtitulo": "Os papéis do caso",
   "acoesEspeciais": [],
   "prosa": [
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam do morto e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "vizinhanca",
   "rotuloMesa": "A Vizinhança",
   "titulo": "A Vizinhança da Cena",
   "subtitulo": "As casas em volta, as janelas que dão para a rua",
   "acoesEspeciais": [],
   "prosa": [
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua. O que uma noite faz de barulho, a vizinhança guarda de memória."
   ],
   "blocosContingentes": [
    {
     "eventoId": "intf_1",
     "quando": "disparado",
     "paragrafos": [
      "Desde a última visita, alguma coisa mudou por aqui. [[gen_intf_intf_1_retratacao]] [[gen_intf_intf_1_dividas]] [[gen_intf_intf_1_soberanos]]"
     ]
    }
   ]
  }
 ],
 "nosMapa": [
  {
   "id": "corpo",
   "rotulo": "O Corpo",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "cena",
   "rotulo": "A Cena do Crime",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "delegacia",
   "rotulo": "A Delegacia",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "vizinhanca",
   "rotulo": "A Vizinhança",
   "grupo": "vila",
   "desbloqueadoInicio": true
  }
 ],
 "leads": [],
 "custos": {
  "cena_predio|cena_predio": 0,
  "cena_predio|vila": 1,
  "vila|cena_predio": 1,
  "vila|vila": 1
 },
 "dialogos": {},
 "confrontos": {
  "estadoInicial": "presente",
  "consequencias": {}
 },
 "abertura": {
  "passos": [
   {
    "id": "caulfield",
    "titulo": "Caulfield, 14 de outubro de 1893",
    "paragrafos": [
     "A pensão da Sra. Potts amanhece como sempre: o quarto estreito, a meia vela, o jornal de anteontem dobrado sobre a mesa.",
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio, e abre a caderneta na primeira página em branco."
    ],
    "rotuloBotao": "A vela queima"
   },
   {
    "id": "chamado",
    "titulo": "Batem à porta",
    "paragrafos": [
     "A Sra. Potts entra com o castiçal numa mão e um envelope na outra. \"Veio a cavalo, de Colbrook. O rapaz disse que o delegado de lá manda dizer que é urgente.\""
    ],
    "rotuloBotao": "Abrir o envelope"
   },
   {
    "id": "carta",
    "titulo": "A carta do Delegado",
    "carta": true,
    "paragrafos": [
     "O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.",
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Colbrook, e como homem que sabe o tamanho do que não sabe. Mary Walker, criada desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
     "\"Bexley, Delegado.\""
    ],
    "rotuloBotao": "Aceitar o chamado"
   },
   {
    "id": "transformacao",
    "titulo": "A mesa se transforma",
    "paragrafos": [
     "A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta.",
     "{detective.title} {detective.surname} desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer."
    ],
    "rotuloBotao": "Tomar o trem"
   },
   {
    "id": "chegada",
    "titulo": "Colbrook",
    "paragrafos": [
     "A plataforma cheira a carvão e palha molhada. Colbrook estende-se além dos trilhos, e a luz de outubro alonga as sombras rua adentro.",
     "O delegado Bexley espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Bexley",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Mary Walker, 14 anos, criada. Achado morto em A Taverna. Não toquei em nada e não prendi ninguém.\"",
     "Detém-se à porta e baixa a voz. \"Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}.\""
    ],
    "rotuloBotao": "Entrar — iniciar a investigação"
   }
  ],
  "perguntas": [
   {
    "id": "sobre_a_hora",
    "pergunta": "O que se sabe da hora da morte?",
    "resposta": "\"De horas não me arrisco: papel meu não data defunto. O corpo está como o achamos; {g:o senhor|a senhora} dirá por ele.\""
   },
   {
    "id": "quem_convive",
    "pergunta": "Quem convivia com a vítima?",
    "resposta": "\"Do dia a dia dele? Charles Williams, John Evans — gente que partilhava teto ou trabalho. Os nomes estão nos meus papéis.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si — a vizinhança fala mais comigo fora do expediente que dentro dele.\""
   }
  ],
  "opcoesPersonagem": [
   {
    "id": "harlan",
    "nome": "Dr. Harlan Blackwell",
    "descricao": "Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem."
   }
  ]
 },
 "parametrosCena": {
  "horasChegada": 11,
  "ambiente": 11,
  "calendario": {
   "diaBase": 14,
   "mesAbrev": "out",
   "mesExtenso": "outubro",
   "ano": 1893
  }
 },
 "interferencias": {
  "eventos": [
   {
    "id": "intf_1",
    "tipo": "subornar_testemunha",
    "ator": "gen_7_lavrador",
    "atorPapel": "assassino",
    "alvo": {
     "tipo": "testemunha",
     "testemunhaId": "gen_2_ferreiro",
     "cartaId": "gen_visto_vivo",
     "localId": "pub"
    },
    "gatilho": {
     "tipo": "extracao_carta",
     "cartaId": "gen_visto_vivo",
     "comoSoube": "o depoimento de gen_2_ferreiro foi tomado em público (extração de gen_visto_vivo); o ator soube o que a testemunha contou"
    },
    "rota": {
     "de": "cottage_4",
     "para": "pub",
     "faixa": "noite",
     "sustentacao": "frequentado",
     "comoChegou": "pub é parada habitual dele (frequentados da ficha); foi na faixa noite sem chamar atenção"
    },
    "rolagem": {
     "wis": 3,
     "penalidade": 2,
     "alvo": 1,
     "dado": 4,
     "sucesso": false
    },
    "efeito": {
     "cartaDestruida": null,
     "cartasNovas": [
      "gen_intf_intf_1_retratacao",
      "gen_intf_intf_1_dividas",
      "gen_intf_intf_1_soberanos"
     ]
    },
    "prenuncio": null,
    "anuncio": "Uma testemunha mudou a própria história."
   }
  ]
 },
 "ecosInterferencia": {
  "titulo": "O legista, sobre o que se moveu",
  "porChave": {
   "destruir_evidencia_ocorrida": [
    "Esfregaram a cena entre uma visita e outra; a madeira ainda estava úmida. A peça que se perdeu não volta, mas esfrega fresca também se data.",
    "Levaram da cena o que o senhor ainda não tinha recolhido. Ficou no lugar a limpeza recente, e limpeza recente se lê como qualquer outro sinal."
   ],
   "destruir_evidencia_evitada": [
    "Vieram limpar a cena; o que importava já estava no seu caderno.",
    "Quando esfregaram o assoalho, a peça já constava do seu registro. Guarde o método: primeiro o que pode sumir."
   ],
   "intimidar_testemunha_ocorrida": [
    "Aquela boca fechou depois que as suas perguntas correram a vila. Anote o dia em que fechou.",
    "A testemunha recuou antes de assinar o que sabia. Onde o depoimento faltar, procure o que sobrou em torno da recusa."
   ],
   "intimidar_testemunha_evitada": [
    "Tentaram calar quem já tinha falado ao senhor. O depoimento estava colhido; o medo chegou atrasado.",
    "A ameaça veio depois do registro, e contra registro feito o medo pode pouco."
   ],
   "subornar_testemunha_ocorrida": [
    "A mesma boca contou duas histórias, e a segunda veio na semana em que uma dívida antiga se quitou.",
    "Há dois depoimentos que não se encontram e uma dívida quitada entre um e outro. Ponha as três coisas lado a lado e meça as datas."
   ],
   "silenciar_ocorrida": [
    "Perdemos a testemunha antes do depoimento. O segundo corpo é morte de horas, não de dias; e o segundo serviço, mais grosseiro, se lê mais fácil que o primeiro.",
    "Quem ouviu aquela noite não chegou a depor. O segundo corpo se lia como o primeiro: rigor, livor, a conta das horas. O que o gesto teve de grosseiro ficou nos sinais."
   ],
   "silenciar_evitada": [
    "A testemunha morreu com o depoimento já no seu caderno. O senhor chegou primeiro; o que sabia, o tribunal ainda ouve.",
    "O aviso estava lá, para quem quisesse ler — e o depoimento sobreviveu a quem o deu."
   ]
  }
 }
},
{
 "id": "gerado_comarca_4",
 "verdadeDeOuro": {
  "id": "gerado_comarca_4",
  "vitima": "Henry Smith",
  "reuCorreto": "gen_7_criada",
  "horasMorteAntesChegada": 14,
  "horaMorteAbsoluta": -3,
  "mecanismoCorreto": "estrangulamento_manual",
  "instrumentoCorreto": "pertence_arrancado",
  "motivacaoCorreta": "escandalo_gravidez",
  "cenaEncenada": false,
  "horaForjada": null,
  "perifericos": {}
 },
 "suspeitos": [
  {
   "id": "gen_6_ferreiro",
   "nome": "Charles Jones",
   "idade": 35,
   "relacao": "Ferreiro; mora em Cottage nº 2",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_3_squire",
   "nome": "Charles Williams",
   "idade": 53,
   "relacao": "Squire; mora em O Solar",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  },
  {
   "id": "gen_7_criada",
   "nome": "Ethel Taylor",
   "idade": 19,
   "relacao": "Criada; mora em Casa do Médico",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_0_moleiro",
   "nome": "James Brown",
   "idade": 70,
   "relacao": "Moleiro; mora em O Moinho",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_2_lavrador",
   "nome": "William Evans",
   "idade": 18,
   "relacao": "Lavrador; mora em Cottage nº 4",
   "descricao": "Conta a noite por canecas, e as horas não fecham entre si."
  }
 ],
 "cartas": [
  {
   "id": "gen_rigor",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Rigidez Parcial",
     "carimboPadrao": "Maxilar duro; membros ainda cedem",
     "descricao": "O maxilar não cede ao polegar; os cotovelos ainda dobram ao peso da mão. A rigidez sobe pelo corpo e não o tomou inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "instalando",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 24,
     "textoDisplay": "Corpo Endurecido",
     "carimboPadrao": "Duro dos maxilares aos joelhos",
     "descricao": "Duro do maxilar aos joelhos. O corpo fixou-se na postura em que a morte o encontrou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "pleno",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 36,
     "textoDisplay": "Rigidez Cedendo",
     "carimboPadrao": "Maxilar solto; joelhos rígidos",
     "descricao": "O maxilar volta a ceder; os joelhos seguem presos. A rigidez que o tomou começa a desfazer-se.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolucao",
      "estadoDegradacao": "degradado"
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Corpo Flácido",
     "carimboPadrao": "Corpo mole, sem rigidez",
     "descricao": "Junta nenhuma resiste ao exame. A rigidez veio e já passou por inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolvido",
      "estadoDegradacao": "resolvido"
     }
    }
   ]
  },
  {
   "id": "gen_livores",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Manchas que Cedem ao Polegar",
     "carimboPadrao": "Manchas que empalidecem à pressão",
     "descricao": "As manchas de sangue assentado empalidecem sob o polegar e tornam à cor quando a pressão cessa.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "movel",
      "posicaoCompativel": true
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "fixo",
      "posicaoCompativel": true
     }
    }
   ]
  },
  {
   "id": "gen_lesao_fatal",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "As Marcas no Pescoço",
   "carimboPadrao": "Sinal de estrangulamento manual",
   "descricao": "Equimoses do tamanho de polpas de dedo dos dois lados da traqueia, e meias-luas de unha impressas na pele.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "ferida",
    "sinal": "equimoses_digitais"
   }
  },
  {
   "id": "gen_reacao_vital",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "Bordas Vivas",
   "carimboPadrao": "Lesões sofridas em vida",
   "descricao": "As lesões mostram bordas inchadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "reacao_vital",
    "sinal": "reacao_vital"
   }
  },
  {
   "id": "gen_visto_vivo",
   "localidade": "delegacia",
   "suporteFisico": "testemunho",
   "origemTestemunha": "gen_6_ferreiro",
   "textoDisplay": "Última Vez com Vida",
   "carimboPadrao": "Vítima com vida às 19h00 de 13/out",
   "descricao": "Charles Jones esteve com Henry Smith às 19h00 de 13/out, e o declara à ronda. Depois dessa hora, ninguém mais o encontrou em pé.",
   "tagsOcultas": {
    "dominio": "temporal",
    "subDominio": "ultima_vez_visto",
    "horaAvistamento": -5
   }
  },
  {
   "id": "gen_pertence",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "O Pertence Arrancado",
   "carimboPadrao": "Botão com fio na mão da vítima",
   "descricao": "Na mão fechada do morto, um botão de casaco com fio e um triângulo de pano. O casaco de Ethel Taylor perdeu o segundo botão.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "objeto_pessoal",
    "tipoVestigio": "pertence_arrancado",
    "pertenceA": "gen_7_criada"
   }
  },
  {
   "id": "gen_sangue_alheio",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "Sangue que Não É da Vítima",
   "carimboPadrao": "Sangue afastado do corpo",
   "descricao": "Gotas de sangue a passos do corpo, num caminho que o morto não fez. Alguém saiu dali ferido, e andando.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "sangue_do_agressor",
    "tipoVestigio": "sangue_alheio",
    "pertenceA": "gen_7_criada"
   }
  },
  {
   "id": "gen_ruido_ouvido",
   "localidade": "vizinhanca",
   "suporteFisico": "testemunho",
   "origemTestemunha": "gen_6_ferreiro",
   "textoDisplay": "O Barulho na Vizinhança",
   "carimboPadrao": "Barulho ouvido na noite de 13",
   "descricao": "Charles Jones conta o que a parede deixou passar na noite de 13: \"Pancada, e móvel no chão, e depois mais nada.\"",
   "tagsOcultas": {
    "dominio": "testemunho",
    "subDominio": "ruido_ouvido",
    "faixa": "noite"
   }
  },
  {
   "id": "gen_motivo",
   "localidade": "delegacia",
   "suporteFisico": "registro",
   "textoDisplay": "Os Papéis do Móbil",
   "carimboPadrao": "Móbil de Ethel Taylor",
   "descricao": "Corre na vila o falatório que Ethel Taylor queria enterrado — e Henry Smith era quem o repetia.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "escandalo_gravidez",
    "ligadoA": "gen_7_criada"
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — A Taverna",
   "subtitulo": "Henry Smith, ferreiro, 29 anos",
   "acoesEspeciais": [
    "termometro"
   ],
   "gestos": [
    {
     "id": "gesto_voltar_corpo",
     "rotulo": "Voltar o corpo",
     "cartaId": "gen_livores"
    }
   ],
   "prosa": [
    "O morto jaz no chão do cômodo a que a vila chama taproom, vestido como andava em casa. O delegado mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar de medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Taverna",
   "subtitulo": "Onde Henry Smith foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Taverna guarda o dia em que o acharam. No cômodo, cômoda, cama de armação de madeira, lavatório com bacia; o desarrumado corre de um canto a outro; há mobília por erguer do chão; há mobília por erguer do chão.",
    "Na mão fechada do morto, por abrir desde ontem: [[gen_pertence]].",
    "A passos do corpo, fora do caminho dele: [[gen_sangue_alheio]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "delegacia",
   "rotuloMesa": "A Delegacia",
   "titulo": "A Delegacia",
   "subtitulo": "Os papéis do caso",
   "acoesEspeciais": [],
   "prosa": [
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam do morto e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "vizinhanca",
   "rotuloMesa": "A Vizinhança",
   "titulo": "A Vizinhança da Cena",
   "subtitulo": "As casas em volta, as janelas que dão para a rua",
   "acoesEspeciais": [],
   "prosa": [
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua. O que uma noite faz de barulho, a vizinhança guarda de memória.",
    "De uma janela vizinha, quem ouviu conta: [[gen_ruido_ouvido]]."
   ],
   "blocosContingentes": []
  }
 ],
 "nosMapa": [
  {
   "id": "corpo",
   "rotulo": "O Corpo",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "cena",
   "rotulo": "A Cena do Crime",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "delegacia",
   "rotulo": "A Delegacia",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "vizinhanca",
   "rotulo": "A Vizinhança",
   "grupo": "vila",
   "desbloqueadoInicio": true
  }
 ],
 "leads": [],
 "custos": {
  "cena_predio|cena_predio": 0,
  "cena_predio|vila": 1,
  "vila|cena_predio": 1,
  "vila|vila": 1
 },
 "dialogos": {},
 "confrontos": {
  "estadoInicial": "presente",
  "consequencias": {}
 },
 "abertura": {
  "passos": [
   {
    "id": "caulfield",
    "titulo": "Caulfield, 14 de outubro de 1893",
    "paragrafos": [
     "A pensão da Sra. Potts amanhece como sempre: o quarto estreito, a meia vela, o jornal de anteontem dobrado sobre a mesa.",
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio, e abre a caderneta na primeira página em branco."
    ],
    "rotuloBotao": "A vela queima"
   },
   {
    "id": "chamado",
    "titulo": "Batem à porta",
    "paragrafos": [
     "A Sra. Potts entra com o castiçal numa mão e um envelope na outra. \"Veio a cavalo, de Dunmere. O rapaz disse que o delegado de lá manda dizer que é urgente.\""
    ],
    "rotuloBotao": "Abrir o envelope"
   },
   {
    "id": "carta",
    "titulo": "A carta do Delegado",
    "carta": true,
    "paragrafos": [
     "O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.",
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Dunmere, e como homem que sabe o tamanho do que não sabe. Henry Smith, ferreiro desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
     "\"Quill, Delegado.\""
    ],
    "rotuloBotao": "Aceitar o chamado"
   },
   {
    "id": "transformacao",
    "titulo": "A mesa se transforma",
    "paragrafos": [
     "A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta.",
     "{detective.title} {detective.surname} desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer."
    ],
    "rotuloBotao": "Tomar o trem"
   },
   {
    "id": "chegada",
    "titulo": "Dunmere",
    "paragrafos": [
     "A plataforma cheira a carvão e palha molhada. Dunmere estende-se além dos trilhos, e a luz de outubro alonga as sombras rua adentro.",
     "O delegado Quill espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Quill",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Henry Smith, 29 anos, ferreiro. Achado morto em A Taverna. Não toquei em nada e não prendi ninguém.\"",
     "Detém-se à porta e baixa a voz. \"Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}.\""
    ],
    "rotuloBotao": "Entrar — iniciar a investigação"
   }
  ],
  "perguntas": [
   {
    "id": "sobre_a_hora",
    "pergunta": "O que se sabe da hora da morte?",
    "resposta": "\"De horas não me arrisco: papel meu não data defunto. O corpo está como o achamos; {g:o senhor|a senhora} dirá por ele.\""
   },
   {
    "id": "quem_convive",
    "pergunta": "Quem convivia com a vítima?",
    "resposta": "\"Do dia a dia dele? Charles Jones — gente que partilhava teto ou trabalho. Os nomes estão nos meus papéis.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si — a vizinhança fala mais comigo fora do expediente que dentro dele.\""
   }
  ],
  "opcoesPersonagem": [
   {
    "id": "harlan",
    "nome": "Dr. Harlan Blackwell",
    "descricao": "Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem."
   }
  ]
 },
 "parametrosCena": {
  "horasChegada": 11,
  "ambiente": 11,
  "calendario": {
   "diaBase": 14,
   "mesAbrev": "out",
   "mesExtenso": "outubro",
   "ano": 1893
  }
 }
},
{
 "id": "gerado_comarca_5",
 "verdadeDeOuro": {
  "id": "gerado_comarca_5",
  "vitima": "Thomas Roberts",
  "reuCorreto": "gen_1_lavrador",
  "horasMorteAntesChegada": 22,
  "horaMorteAbsoluta": -11,
  "mecanismoCorreto": "ferida_arma_branca",
  "instrumentoCorreto": "lamina_de_oficio",
  "motivacaoCorreta": "seguro_de_enterro",
  "cenaEncenada": false,
  "horaForjada": null,
  "perifericos": {}
 },
 "suspeitos": [
  {
   "id": "gen_0_criada",
   "nome": "Alice Taylor",
   "idade": 15,
   "relacao": "Criada; mora em Casa do Médico",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_4_costureira",
   "nome": "Edith Taylor",
   "idade": 27,
   "relacao": "Costureira; mora em Cottage nº 4",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_2_lavadeira",
   "nome": "Elizabeth Smith",
   "idade": 70,
   "relacao": "Lavadeira; mora em Cottage nº 3",
   "descricao": "Conta a noite por canecas, e as horas não fecham entre si."
  },
  {
   "id": "gen_3_paroco",
   "nome": "John Thomas",
   "idade": 56,
   "relacao": "Pároco; mora em O Presbitério",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_1_lavrador",
   "nome": "Joseph Thomas",
   "idade": 36,
   "relacao": "Lavrador; mora em Cottage nº 2",
   "descricao": "Conta a noite por canecas, e as horas não fecham entre si."
  }
 ],
 "cartas": [
  {
   "id": "gen_rigor",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Rigidez Parcial",
     "carimboPadrao": "Maxilar duro; membros ainda cedem",
     "descricao": "O maxilar não cede ao polegar; os cotovelos ainda dobram ao peso da mão. A rigidez sobe pelo corpo e não o tomou inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "instalando",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 24,
     "textoDisplay": "Corpo Endurecido",
     "carimboPadrao": "Duro dos maxilares aos joelhos",
     "descricao": "Duro do maxilar aos joelhos. O corpo fixou-se na postura em que a morte o encontrou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "pleno",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 36,
     "textoDisplay": "Rigidez Cedendo",
     "carimboPadrao": "Maxilar solto; joelhos rígidos",
     "descricao": "O maxilar volta a ceder; os joelhos seguem presos. A rigidez que o tomou começa a desfazer-se.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolucao",
      "estadoDegradacao": "degradado"
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Corpo Flácido",
     "carimboPadrao": "Corpo mole, sem rigidez",
     "descricao": "Junta nenhuma resiste ao exame. A rigidez veio e já passou por inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolvido",
      "estadoDegradacao": "resolvido"
     }
    }
   ]
  },
  {
   "id": "gen_livores",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Manchas que Cedem ao Polegar",
     "carimboPadrao": "Manchas que empalidecem à pressão",
     "descricao": "As manchas de sangue assentado empalidecem sob o polegar e tornam à cor quando a pressão cessa.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "movel",
      "posicaoCompativel": true
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "fixo",
      "posicaoCompativel": true
     }
    }
   ]
  },
  {
   "id": "gen_lesao_fatal",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "A Ferida Incisa",
   "carimboPadrao": "Sinal de arma branca",
   "descricao": "Corte de bordas regulares, mais fundo onde começa e raso onde termina. As margens são limpas, sem ponte de pele entre elas.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "ferida",
    "sinal": "ferida_incisa"
   }
  },
  {
   "id": "gen_reacao_vital",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "Bordas Vivas",
   "carimboPadrao": "Lesões sofridas em vida",
   "descricao": "As lesões mostram bordas inchadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "reacao_vital",
    "sinal": "reacao_vital"
   }
  },
  {
   "id": "gen_visto_vivo",
   "localidade": "delegacia",
   "suporteFisico": "testemunho",
   "origemTestemunha": null,
   "textoDisplay": "Última Vez com Vida",
   "carimboPadrao": "Vítima com vida às 11h00 de 13/out",
   "descricao": "Do registro da ronda consta Thomas Roberts com vida às 11h00 de 13/out. Depois dessa hora, ninguém mais o encontrou em pé.",
   "tagsOcultas": {
    "dominio": "temporal",
    "subDominio": "ultima_vez_visto",
    "horaAvistamento": -13
   }
  },
  {
   "id": "gen_instrumento",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "O Instrumento Abandonado",
   "carimboPadrao": "Instrumento deixado na cena",
   "descricao": "Ficou onde a mão o largou. O feitio casa com a lesão do morto, e o dono tem nome na vila: Joseph Thomas.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "instrumento_oficio",
    "tipoVestigio": "lamina_de_oficio",
    "pertenceA": "gen_1_lavrador"
   }
  },
  {
   "id": "gen_sangue_alheio",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "Sangue que Não É da Vítima",
   "carimboPadrao": "Sangue afastado do corpo",
   "descricao": "Gotas de sangue a passos do corpo, num caminho que o morto não fez. Alguém saiu dali ferido, e andando.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "sangue_do_agressor",
    "tipoVestigio": "sangue_alheio",
    "pertenceA": "gen_1_lavrador"
   }
  },
  {
   "id": "gen_pegadas",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "Pegadas Rumo à Porta",
   "carimboPadrao": "Meias-solas impressas em sangue",
   "descricao": "Meias-solas impressas em sangue, espaçadas rumo à porta. O passo é de saída, e é um só.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "pegadas",
    "tipoVestigio": "pegada_ensanguentada",
    "pertenceA": "gen_1_lavrador"
   }
  },
  {
   "id": "gen_motivo",
   "localidade": "delegacia",
   "suporteFisico": "registro",
   "textoDisplay": "Os Papéis do Móbil",
   "carimboPadrao": "Móbil de Joseph Thomas",
   "descricao": "Uma apólice de enterro em nome de Thomas Roberts paga a Joseph Thomas quando a morte vier.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "seguro_de_enterro",
    "ligadoA": "gen_1_lavrador"
   }
  },
  {
   "id": "gen_intf_intf_1_limpeza",
   "localidade": "cena",
   "textoDisplay": "Esfrega Fresca na Cena",
   "carimboPadrao": "Esfrega fresca, posterior à primeira perícia",
   "descricao": "A madeira da cena, esfregada de fresco — ainda úmida ao tato, dias depois do crime e horas depois da primeira perícia.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "limpeza_fresca",
    "tipoVestigio": "esfrega_fresca"
   },
   "vestigioInterferencia": {
    "classe": "esfrega_fresca_pos_pericia",
    "frescor": "fresco",
    "localId": "granja",
    "comodo": "cozinha",
    "celula": {
     "col": 3,
     "fila": 2
    },
    "mobilia": null
   }
  },
  {
   "id": "gen_intf_intf_1_meia_obra",
   "localidade": "cena",
   "textoDisplay": "Serviço pela Metade",
   "carimboPadrao": "Serviço de limpeza pela metade",
   "descricao": "A esfrega para no meio do gesto: a mancha arrastada até a metade e abandonada ali.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "limpeza_fresca",
    "tipoVestigio": "limpeza_interrompida"
   },
   "vestigioInterferencia": {
    "classe": "limpeza_interrompida",
    "frescor": "fresco",
    "localId": "granja",
    "comodo": "cozinha",
    "celula": {
     "col": 3,
     "fila": 2
    },
    "mobilia": null
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — A Granja",
   "subtitulo": "Thomas Roberts, lavrador, 32 anos",
   "acoesEspeciais": [
    "termometro"
   ],
   "gestos": [
    {
     "id": "gesto_voltar_corpo",
     "rotulo": "Voltar o corpo",
     "cartaId": "gen_livores"
    }
   ],
   "prosa": [
    "O morto jaz no chão do cômodo a que a vila chama cozinha da granja, vestido como andava em casa. O delegado mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar de medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Granja",
   "subtitulo": "Onde Thomas Roberts foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Granja guarda o dia em que o acharam. No cômodo, tapete de retalhos, o relógio da família, range de ferro a carvão; o desarrumado corre de um canto a outro; há mobília por erguer do chão; há mobília por erguer do chão; há mobília por erguer do chão.",
    "Junto do corpo, deixado onde caiu, o achado que a vila inteira comenta: [[gen_instrumento]].",
    "A passos do corpo, fora do caminho dele: [[gen_sangue_alheio]]."
   ],
   "blocosContingentes": [
    {
     "eventoId": "intf_1",
     "quando": "disparado",
     "paragrafos": [
      "Desde a última visita, alguma coisa mudou por aqui. [[gen_intf_intf_1_limpeza]] [[gen_intf_intf_1_meia_obra]]"
     ]
    },
    {
     "eventoId": "intf_1",
     "quando": "nao_disparado",
     "paragrafos": [
      "Do meio do cômodo até a porta: [[gen_pegadas]]."
     ]
    }
   ]
  },
  {
   "id": "delegacia",
   "rotuloMesa": "A Delegacia",
   "titulo": "A Delegacia",
   "subtitulo": "Os papéis do caso",
   "acoesEspeciais": [],
   "prosa": [
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam do morto e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "vizinhanca",
   "rotuloMesa": "A Vizinhança",
   "titulo": "A Vizinhança da Cena",
   "subtitulo": "As casas em volta, as janelas que dão para a rua",
   "acoesEspeciais": [],
   "prosa": [
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua. O que uma noite faz de barulho, a vizinhança guarda de memória."
   ],
   "blocosContingentes": []
  }
 ],
 "nosMapa": [
  {
   "id": "corpo",
   "rotulo": "O Corpo",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "cena",
   "rotulo": "A Cena do Crime",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "delegacia",
   "rotulo": "A Delegacia",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "vizinhanca",
   "rotulo": "A Vizinhança",
   "grupo": "vila",
   "desbloqueadoInicio": true
  }
 ],
 "leads": [],
 "custos": {
  "cena_predio|cena_predio": 0,
  "cena_predio|vila": 1,
  "vila|cena_predio": 1,
  "vila|vila": 1
 },
 "dialogos": {},
 "confrontos": {
  "estadoInicial": "presente",
  "consequencias": {}
 },
 "abertura": {
  "passos": [
   {
    "id": "caulfield",
    "titulo": "Caulfield, 14 de outubro de 1893",
    "paragrafos": [
     "A pensão da Sra. Potts amanhece como sempre: o quarto estreito, a meia vela, o jornal de anteontem dobrado sobre a mesa.",
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio, e abre a caderneta na primeira página em branco."
    ],
    "rotuloBotao": "A vela queima"
   },
   {
    "id": "chamado",
    "titulo": "Batem à porta",
    "paragrafos": [
     "A Sra. Potts entra com o castiçal numa mão e um envelope na outra. \"Veio a cavalo, de Wrenfield. O rapaz disse que o delegado de lá manda dizer que é urgente.\""
    ],
    "rotuloBotao": "Abrir o envelope"
   },
   {
    "id": "carta",
    "titulo": "A carta do Delegado",
    "carta": true,
    "paragrafos": [
     "O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.",
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Wrenfield, e como homem que sabe o tamanho do que não sabe. Thomas Roberts, lavrador desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
     "\"Harrow, Delegado.\""
    ],
    "rotuloBotao": "Aceitar o chamado"
   },
   {
    "id": "transformacao",
    "titulo": "A mesa se transforma",
    "paragrafos": [
     "A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta.",
     "{detective.title} {detective.surname} desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer."
    ],
    "rotuloBotao": "Tomar o trem"
   },
   {
    "id": "chegada",
    "titulo": "Wrenfield",
    "paragrafos": [
     "A plataforma cheira a carvão e palha molhada. Wrenfield estende-se além dos trilhos, e a luz de outubro alonga as sombras rua adentro.",
     "O delegado Harrow espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Harrow",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Thomas Roberts, 32 anos, lavrador. Achado morto em A Granja. Não toquei em nada e não prendi ninguém.\"",
     "Detém-se à porta e baixa a voz. \"Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}.\""
    ],
    "rotuloBotao": "Entrar — iniciar a investigação"
   }
  ],
  "perguntas": [
   {
    "id": "sobre_a_hora",
    "pergunta": "O que se sabe da hora da morte?",
    "resposta": "\"De horas não me arrisco: papel meu não data defunto. O corpo está como o achamos; {g:o senhor|a senhora} dirá por ele.\""
   },
   {
    "id": "quem_convive",
    "pergunta": "Quem convivia com a vítima?",
    "resposta": "\"Do dia a dia dele? Joseph Thomas — gente que partilhava teto ou trabalho. Os nomes estão nos meus papéis.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si — a vizinhança fala mais comigo fora do expediente que dentro dele.\""
   }
  ],
  "opcoesPersonagem": [
   {
    "id": "harlan",
    "nome": "Dr. Harlan Blackwell",
    "descricao": "Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem."
   }
  ]
 },
 "parametrosCena": {
  "horasChegada": 11,
  "ambiente": 11,
  "calendario": {
   "diaBase": 14,
   "mesAbrev": "out",
   "mesExtenso": "outubro",
   "ano": 1893
  }
 },
 "interferencias": {
  "eventos": [
   {
    "id": "intf_1",
    "tipo": "destruir_evidencia",
    "ator": "gen_1_lavrador",
    "atorPapel": "assassino",
    "alvo": {
     "tipo": "carta",
     "cartaId": "gen_pegadas",
     "localId": "granja"
    },
    "gatilho": {
     "tipo": "extracao_carta",
     "cartaId": "gen_motivo",
     "comoSoube": "o perito abriu o móbil do réu na delegacia (extração de gen_motivo); o inquérito em público correu a vila até o ator"
    },
    "rota": {
     "de": "capela",
     "para": "granja",
     "faixa": "noite",
     "sustentacao": "retorno_a_cena",
     "comoChegou": "refez, na faixa noite, o caminho do próprio crime até granja"
    },
    "rolagem": {
     "wis": 1,
     "penalidade": 2,
     "alvo": 0,
     "dado": 2,
     "sucesso": false
    },
    "efeito": {
     "cartaDestruida": "gen_pegadas",
     "cartasNovas": [
      "gen_intf_intf_1_limpeza",
      "gen_intf_intf_1_meia_obra"
     ]
    },
    "prenuncio": null,
    "anuncio": "Há sinais de que alguém esteve na cena desde a última visita."
   }
  ]
 },
 "ecosInterferencia": {
  "titulo": "O legista, sobre o que se moveu",
  "porChave": {
   "destruir_evidencia_ocorrida": [
    "Esfregaram a cena entre uma visita e outra; a madeira ainda estava úmida. A peça que se perdeu não volta, mas esfrega fresca também se data.",
    "Levaram da cena o que o senhor ainda não tinha recolhido. Ficou no lugar a limpeza recente, e limpeza recente se lê como qualquer outro sinal."
   ],
   "destruir_evidencia_evitada": [
    "Vieram limpar a cena; o que importava já estava no seu caderno.",
    "Quando esfregaram o assoalho, a peça já constava do seu registro. Guarde o método: primeiro o que pode sumir."
   ],
   "intimidar_testemunha_ocorrida": [
    "Aquela boca fechou depois que as suas perguntas correram a vila. Anote o dia em que fechou.",
    "A testemunha recuou antes de assinar o que sabia. Onde o depoimento faltar, procure o que sobrou em torno da recusa."
   ],
   "intimidar_testemunha_evitada": [
    "Tentaram calar quem já tinha falado ao senhor. O depoimento estava colhido; o medo chegou atrasado.",
    "A ameaça veio depois do registro, e contra registro feito o medo pode pouco."
   ],
   "subornar_testemunha_ocorrida": [
    "A mesma boca contou duas histórias, e a segunda veio na semana em que uma dívida antiga se quitou.",
    "Há dois depoimentos que não se encontram e uma dívida quitada entre um e outro. Ponha as três coisas lado a lado e meça as datas."
   ],
   "silenciar_ocorrida": [
    "Perdemos a testemunha antes do depoimento. O segundo corpo é morte de horas, não de dias; e o segundo serviço, mais grosseiro, se lê mais fácil que o primeiro.",
    "Quem ouviu aquela noite não chegou a depor. O segundo corpo se lia como o primeiro: rigor, livor, a conta das horas. O que o gesto teve de grosseiro ficou nos sinais."
   ],
   "silenciar_evitada": [
    "A testemunha morreu com o depoimento já no seu caderno. O senhor chegou primeiro; o que sabia, o tribunal ainda ouve.",
    "O aviso estava lá, para quem quisesse ler — e o depoimento sobreviveu a quem o deu."
   ]
  }
 }
},
{
 "id": "gerado_comarca_6",
 "verdadeDeOuro": {
  "id": "gerado_comarca_6",
  "vitima": "Rose Evans",
  "reuCorreto": "gen_1_medico",
  "horasMorteAntesChegada": 12,
  "horaMorteAbsoluta": -1,
  "mecanismoCorreto": "estrangulamento_ligadura",
  "instrumentoCorreto": "cordao_torcido",
  "motivacaoCorreta": "divida_caderneta",
  "cenaEncenada": false,
  "horaForjada": null,
  "perifericos": {}
 },
 "suspeitos": [
  {
   "id": "gen_3_ferreiro",
   "nome": "Charles Evans",
   "idade": 44,
   "relacao": "Ferreiro; mora em Cottage nº 2",
   "descricao": "Conta a noite por canecas, e as horas não fecham entre si."
  },
  {
   "id": "gen_1_medico",
   "nome": "George Williams",
   "idade": 48,
   "relacao": "Médico rural; mora em Casa do Médico",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_0_criada",
   "nome": "Rose Wilson",
   "idade": 42,
   "relacao": "Criada; mora em A Taverna",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_2_lavrador",
   "nome": "Walter Walker",
   "idade": 32,
   "relacao": "Lavrador; mora em Cottage nº 1",
   "descricao": "Conta a noite por canecas, e as horas não fecham entre si."
  },
  {
   "id": "gen_4_lavrador",
   "nome": "William Brown",
   "idade": 14,
   "relacao": "Lavrador; mora em Cottage nº 3",
   "descricao": "Fala baixo e mede a porta antes de responder."
  }
 ],
 "cartas": [
  {
   "id": "gen_rigor",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Rigidez Parcial",
     "carimboPadrao": "Maxilar duro; membros ainda cedem",
     "descricao": "O maxilar não cede ao polegar; os cotovelos ainda dobram ao peso da mão. A rigidez sobe pelo corpo e não o tomou inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "instalando",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 24,
     "textoDisplay": "Corpo Endurecido",
     "carimboPadrao": "Duro dos maxilares aos joelhos",
     "descricao": "Duro do maxilar aos joelhos. O corpo fixou-se na postura em que a morte o encontrou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "pleno",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 36,
     "textoDisplay": "Rigidez Cedendo",
     "carimboPadrao": "Maxilar solto; joelhos rígidos",
     "descricao": "O maxilar volta a ceder; os joelhos seguem presos. A rigidez que o tomou começa a desfazer-se.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolucao",
      "estadoDegradacao": "degradado"
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Corpo Flácido",
     "carimboPadrao": "Corpo mole, sem rigidez",
     "descricao": "Junta nenhuma resiste ao exame. A rigidez veio e já passou por inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolvido",
      "estadoDegradacao": "resolvido"
     }
    }
   ]
  },
  {
   "id": "gen_livores",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Manchas que Cedem ao Polegar",
     "carimboPadrao": "Manchas que empalidecem à pressão",
     "descricao": "As manchas de sangue assentado empalidecem sob o polegar e tornam à cor quando a pressão cessa. As manchas, porém, guardam o desenho de outra postura: assentaram do lado que ora fica para cima.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "movel",
      "posicaoCompativel": false
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou. As manchas, porém, guardam o desenho de outra postura: assentaram do lado que ora fica para cima.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "fixo",
      "posicaoCompativel": false
     }
    }
   ]
  },
  {
   "id": "gen_lesao_fatal",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "O Sulco no Pescoço",
   "carimboPadrao": "Sinal de garrote (ligadura)",
   "descricao": "Um sulco uniforme corre horizontal em volta do pescoço, na mesma profundidade de ponta a ponta, sem subir rumo à nuca.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "ferida",
    "sinal": "sulco_horizontal"
   }
  },
  {
   "id": "gen_reacao_vital",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "Bordas Vivas",
   "carimboPadrao": "Lesões sofridas em vida",
   "descricao": "As lesões mostram bordas inchadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "reacao_vital",
    "sinal": "reacao_vital"
   }
  },
  {
   "id": "gen_visto_vivo",
   "localidade": "delegacia",
   "suporteFisico": "testemunho",
   "origemTestemunha": null,
   "textoDisplay": "Última Vez com Vida",
   "carimboPadrao": "Vítima com vida às 21h00 de 13/out",
   "descricao": "Do registro da ronda consta Rose Evans com vida às 21h00 de 13/out. Depois dessa hora, ninguém mais o encontrou em pé.",
   "tagsOcultas": {
    "dominio": "temporal",
    "subDominio": "ultima_vez_visto",
    "horaAvistamento": -3
   }
  },
  {
   "id": "gen_instrumento",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "O Instrumento Abandonado",
   "carimboPadrao": "Instrumento deixado na cena",
   "descricao": "Ficou onde a mão o largou. O feitio casa com a lesão do morto, e o dono tem nome na vila: George Williams.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "instrumento_oficio",
    "tipoVestigio": "cordao_torcido",
    "pertenceA": "gen_1_medico"
   }
  },
  {
   "id": "gen_sangue_alheio",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "Sangue que Não É da Vítima",
   "carimboPadrao": "Sangue afastado do corpo",
   "descricao": "Gotas de sangue a passos do corpo, num caminho que o morto não fez. Alguém saiu dali ferido, e andando.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "sangue_do_agressor",
    "tipoVestigio": "sangue_alheio",
    "pertenceA": "gen_1_medico"
   }
  },
  {
   "id": "gen_motivo",
   "localidade": "delegacia",
   "suporteFisico": "registro",
   "textoDisplay": "Os Papéis do Móbil",
   "carimboPadrao": "Móbil de George Williams",
   "descricao": "Uma caderneta de fiado soma a dívida de George Williams para com Rose Evans, vencida e cobrada por carta.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "divida_caderneta",
    "ligadoA": "gen_1_medico"
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — Casa do Médico",
   "subtitulo": "Rose Evans, criada, 17 anos",
   "acoesEspeciais": [
    "termometro"
   ],
   "gestos": [
    {
     "id": "gesto_voltar_corpo",
     "rotulo": "Voltar o corpo",
     "cartaId": "gen_livores"
    }
   ],
   "prosa": [
    "O morto jaz no chão do cômodo a que a vila chama cozinha, vestido como andava em casa. O delegado mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar de medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — Casa do Médico",
   "subtitulo": "Onde Rose Evans foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "Casa do Médico guarda o dia em que o acharam. No cômodo, range de ferro a carvão, mesa de cozinha, cama de armação de madeira; o desarrumado corre de um canto a outro; há mobília por erguer do chão; há mobília por erguer do chão.",
    "Junto do corpo, deixado onde caiu, o achado que a vila inteira comenta: [[gen_instrumento]].",
    "A passos do corpo, fora do caminho dele: [[gen_sangue_alheio]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "delegacia",
   "rotuloMesa": "A Delegacia",
   "titulo": "A Delegacia",
   "subtitulo": "Os papéis do caso",
   "acoesEspeciais": [],
   "prosa": [
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam do morto e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "vizinhanca",
   "rotuloMesa": "A Vizinhança",
   "titulo": "A Vizinhança da Cena",
   "subtitulo": "As casas em volta, as janelas que dão para a rua",
   "acoesEspeciais": [],
   "prosa": [
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua. O que uma noite faz de barulho, a vizinhança guarda de memória."
   ],
   "blocosContingentes": []
  }
 ],
 "nosMapa": [
  {
   "id": "corpo",
   "rotulo": "O Corpo",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "cena",
   "rotulo": "A Cena do Crime",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "delegacia",
   "rotulo": "A Delegacia",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "vizinhanca",
   "rotulo": "A Vizinhança",
   "grupo": "vila",
   "desbloqueadoInicio": true
  }
 ],
 "leads": [],
 "custos": {
  "cena_predio|cena_predio": 0,
  "cena_predio|vila": 1,
  "vila|cena_predio": 1,
  "vila|vila": 1
 },
 "dialogos": {},
 "confrontos": {
  "estadoInicial": "presente",
  "consequencias": {}
 },
 "abertura": {
  "passos": [
   {
    "id": "caulfield",
    "titulo": "Caulfield, 14 de outubro de 1893",
    "paragrafos": [
     "A pensão da Sra. Potts amanhece como sempre: o quarto estreito, a meia vela, o jornal de anteontem dobrado sobre a mesa.",
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio, e abre a caderneta na primeira página em branco."
    ],
    "rotuloBotao": "A vela queima"
   },
   {
    "id": "chamado",
    "titulo": "Batem à porta",
    "paragrafos": [
     "A Sra. Potts entra com o castiçal numa mão e um envelope na outra. \"Veio a cavalo, de Marlow Green. O rapaz disse que o delegado de lá manda dizer que é urgente.\""
    ],
    "rotuloBotao": "Abrir o envelope"
   },
   {
    "id": "carta",
    "titulo": "A carta do Delegado",
    "carta": true,
    "paragrafos": [
     "O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.",
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Marlow Green, e como homem que sabe o tamanho do que não sabe. Rose Evans, criada desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
     "\"Fenwick, Delegado.\""
    ],
    "rotuloBotao": "Aceitar o chamado"
   },
   {
    "id": "transformacao",
    "titulo": "A mesa se transforma",
    "paragrafos": [
     "A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta.",
     "{detective.title} {detective.surname} desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer."
    ],
    "rotuloBotao": "Tomar o trem"
   },
   {
    "id": "chegada",
    "titulo": "Marlow Green",
    "paragrafos": [
     "A plataforma cheira a carvão e palha molhada. Marlow Green estende-se além dos trilhos, e a luz de outubro alonga as sombras rua adentro.",
     "O delegado Fenwick espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Fenwick",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Rose Evans, 17 anos, criada. Achado morto em Casa do Médico. Não toquei em nada e não prendi ninguém.\"",
     "Detém-se à porta e baixa a voz. \"Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}.\""
    ],
    "rotuloBotao": "Entrar — iniciar a investigação"
   }
  ],
  "perguntas": [
   {
    "id": "sobre_a_hora",
    "pergunta": "O que se sabe da hora da morte?",
    "resposta": "\"De horas não me arrisco: papel meu não data defunto. O corpo está como o achamos; {g:o senhor|a senhora} dirá por ele.\""
   },
   {
    "id": "quem_convive",
    "pergunta": "Quem convivia com a vítima?",
    "resposta": "\"Do dia a dia dele? George Williams — gente que partilhava teto ou trabalho. Os nomes estão nos meus papéis.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si — a vizinhança fala mais comigo fora do expediente que dentro dele.\""
   }
  ],
  "opcoesPersonagem": [
   {
    "id": "harlan",
    "nome": "Dr. Harlan Blackwell",
    "descricao": "Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem."
   }
  ]
 },
 "parametrosCena": {
  "horasChegada": 11,
  "ambiente": 11,
  "calendario": {
   "diaBase": 14,
   "mesAbrev": "out",
   "mesExtenso": "outubro",
   "ano": 1893
  }
 }
},
{
 "id": "gerado_comarca_7",
 "verdadeDeOuro": {
  "id": "gerado_comarca_7",
  "vitima": "Emily Williams",
  "reuCorreto": "gen_3_lavrador",
  "horasMorteAntesChegada": 8,
  "horaMorteAbsoluta": 3,
  "mecanismoCorreto": "trauma_contuso",
  "instrumentoCorreto": "arma_de_ocasiao",
  "motivacaoCorreta": "despejo",
  "cenaEncenada": false,
  "horaForjada": null,
  "perifericos": {}
 },
 "suspeitos": [
  {
   "id": "gen_4_costureira",
   "nome": "Arthur Evans",
   "idade": 33,
   "relacao": "Alfaiate; mora em Cottage nº 4",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  },
  {
   "id": "gen_5_criada",
   "nome": "Emily Brown",
   "idade": 24,
   "relacao": "Criada; mora em A Taverna",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_1_taverneiro",
   "nome": "Frederick Wilson",
   "idade": 30,
   "relacao": "Taverneiro; mora em A Taverna",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  },
  {
   "id": "gen_2_lavrador",
   "nome": "Joseph Roberts",
   "idade": 59,
   "relacao": "Lavrador; mora em Cottage nº 2",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  },
  {
   "id": "gen_3_lavrador",
   "nome": "Thomas Jones",
   "idade": 43,
   "relacao": "Lavrador; mora em Cottage nº 3",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  }
 ],
 "cartas": [
  {
   "id": "gen_rigor",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Rigidez Parcial",
     "carimboPadrao": "Maxilar duro; membros ainda cedem",
     "descricao": "O maxilar não cede ao polegar; os cotovelos ainda dobram ao peso da mão. A rigidez sobe pelo corpo e não o tomou inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "instalando",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 24,
     "textoDisplay": "Corpo Endurecido",
     "carimboPadrao": "Duro dos maxilares aos joelhos",
     "descricao": "Duro do maxilar aos joelhos. O corpo fixou-se na postura em que a morte o encontrou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "pleno",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 36,
     "textoDisplay": "Rigidez Cedendo",
     "carimboPadrao": "Maxilar solto; joelhos rígidos",
     "descricao": "O maxilar volta a ceder; os joelhos seguem presos. A rigidez que o tomou começa a desfazer-se.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolucao",
      "estadoDegradacao": "degradado"
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Corpo Flácido",
     "carimboPadrao": "Corpo mole, sem rigidez",
     "descricao": "Junta nenhuma resiste ao exame. A rigidez veio e já passou por inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolvido",
      "estadoDegradacao": "resolvido"
     }
    }
   ]
  },
  {
   "id": "gen_livores",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Manchas que Cedem ao Polegar",
     "carimboPadrao": "Manchas que empalidecem à pressão",
     "descricao": "As manchas de sangue assentado empalidecem sob o polegar e tornam à cor quando a pressão cessa.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "movel",
      "posicaoCompativel": true
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "fixo",
      "posicaoCompativel": true
     }
    }
   ]
  },
  {
   "id": "gen_lesao_fatal",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "A Fratura no Crânio",
   "carimboPadrao": "Sinal de golpe contuso",
   "descricao": "Sob o cabelo, o couro cede ao tato num afundamento de bordas irregulares; o osso acompanha a depressão.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "ferida",
    "sinal": "ferida_contusa"
   }
  },
  {
   "id": "gen_reacao_vital",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "Bordas Vivas",
   "carimboPadrao": "Lesões sofridas em vida",
   "descricao": "As lesões mostram bordas inchadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "reacao_vital",
    "sinal": "reacao_vital"
   }
  },
  {
   "id": "gen_visto_vivo",
   "localidade": "delegacia",
   "suporteFisico": "testemunho",
   "origemTestemunha": null,
   "textoDisplay": "Última Vez com Vida",
   "carimboPadrao": "Vítima com vida às 01h00 de 14/out",
   "descricao": "Do registro da ronda consta Emily Williams com vida às 01h00 de 14/out. Depois dessa hora, ninguém mais o encontrou em pé.",
   "tagsOcultas": {
    "dominio": "temporal",
    "subDominio": "ultima_vez_visto",
    "horaAvistamento": 1
   }
  },
  {
   "id": "gen_instrumento",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "O Instrumento Abandonado",
   "carimboPadrao": "Instrumento deixado na cena",
   "descricao": "Ficou onde a mão o largou. O feitio casa com a lesão do morto, e o dono tem nome na vila: Thomas Jones.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "instrumento_oficio",
    "tipoVestigio": "arma_de_ocasiao",
    "pertenceA": "gen_3_lavrador"
   }
  },
  {
   "id": "gen_pegadas",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "Pegadas Rumo à Porta",
   "carimboPadrao": "Meias-solas impressas em sangue",
   "descricao": "Meias-solas impressas em sangue, espaçadas rumo à porta. O passo é de saída, e é um só.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "pegadas",
    "tipoVestigio": "pegada_ensanguentada",
    "pertenceA": "gen_3_lavrador"
   }
  },
  {
   "id": "gen_motivo",
   "localidade": "delegacia",
   "suporteFisico": "registro",
   "textoDisplay": "Os Papéis do Móbil",
   "carimboPadrao": "Móbil de Thomas Jones",
   "descricao": "A ordem de despejo do cottage de Thomas Jones leva a assinatura de Emily Williams.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "despejo",
    "ligadoA": "gen_3_lavrador"
   }
  },
  {
   "id": "gen_intf_intf_1_limpeza",
   "localidade": "cena",
   "textoDisplay": "Esfrega Fresca na Cena",
   "carimboPadrao": "Esfrega fresca, posterior à primeira perícia",
   "descricao": "A madeira da cena, esfregada de fresco — ainda úmida ao tato, dias depois do crime e horas depois da primeira perícia.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "limpeza_fresca",
    "tipoVestigio": "esfrega_fresca"
   },
   "vestigioInterferencia": {
    "classe": "esfrega_fresca_pos_pericia",
    "frescor": "fresco",
    "localId": "escola",
    "comodo": "quarto",
    "celula": {
     "col": 6,
     "fila": 3
    },
    "mobilia": null
   }
  },
  {
   "id": "gen_intf_intf_1_meia_obra",
   "localidade": "cena",
   "textoDisplay": "Serviço pela Metade",
   "carimboPadrao": "Serviço de limpeza pela metade",
   "descricao": "A esfrega para no meio do gesto: a mancha arrastada até a metade e abandonada ali.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "limpeza_fresca",
    "tipoVestigio": "limpeza_interrompida"
   },
   "vestigioInterferencia": {
    "classe": "limpeza_interrompida",
    "frescor": "fresco",
    "localId": "escola",
    "comodo": "quarto",
    "celula": {
     "col": 6,
     "fila": 3
    },
    "mobilia": null
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — A Escola",
   "subtitulo": "Emily Williams, professora de vila, 25 anos",
   "acoesEspeciais": [
    "termometro"
   ],
   "gestos": [
    {
     "id": "gesto_voltar_corpo",
     "rotulo": "Voltar o corpo",
     "cartaId": "gen_livores"
    }
   ],
   "prosa": [
    "O morto jaz no chão do cômodo a que a vila chama quarto, vestido como andava em casa. O delegado mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar de medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Escola",
   "subtitulo": "Onde Emily Williams foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Escola guarda o dia em que o acharam. No cômodo, carteiras enfileiradas, quadro de ardósia, range de ferro a carvão; o desarrumado corre de um canto a outro; há mobília por erguer do chão; há mobília por erguer do chão; há mobília por erguer do chão.",
    "Junto do corpo, deixado onde caiu, o achado que a vila inteira comenta: [[gen_instrumento]]."
   ],
   "blocosContingentes": [
    {
     "eventoId": "intf_1",
     "quando": "disparado",
     "paragrafos": [
      "Desde a última visita, alguma coisa mudou por aqui. [[gen_intf_intf_1_limpeza]] [[gen_intf_intf_1_meia_obra]]"
     ]
    },
    {
     "eventoId": "intf_1",
     "quando": "nao_disparado",
     "paragrafos": [
      "Do meio do cômodo até a porta: [[gen_pegadas]]."
     ]
    }
   ]
  },
  {
   "id": "delegacia",
   "rotuloMesa": "A Delegacia",
   "titulo": "A Delegacia",
   "subtitulo": "Os papéis do caso",
   "acoesEspeciais": [],
   "prosa": [
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam do morto e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "vizinhanca",
   "rotuloMesa": "A Vizinhança",
   "titulo": "A Vizinhança da Cena",
   "subtitulo": "As casas em volta, as janelas que dão para a rua",
   "acoesEspeciais": [],
   "prosa": [
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua. O que uma noite faz de barulho, a vizinhança guarda de memória."
   ],
   "blocosContingentes": []
  }
 ],
 "nosMapa": [
  {
   "id": "corpo",
   "rotulo": "O Corpo",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "cena",
   "rotulo": "A Cena do Crime",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "delegacia",
   "rotulo": "A Delegacia",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "vizinhanca",
   "rotulo": "A Vizinhança",
   "grupo": "vila",
   "desbloqueadoInicio": true
  }
 ],
 "leads": [],
 "custos": {
  "cena_predio|cena_predio": 0,
  "cena_predio|vila": 1,
  "vila|cena_predio": 1,
  "vila|vila": 1
 },
 "dialogos": {},
 "confrontos": {
  "estadoInicial": "presente",
  "consequencias": {}
 },
 "abertura": {
  "passos": [
   {
    "id": "caulfield",
    "titulo": "Caulfield, 14 de outubro de 1893",
    "paragrafos": [
     "A pensão da Sra. Potts amanhece como sempre: o quarto estreito, a meia vela, o jornal de anteontem dobrado sobre a mesa.",
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio, e abre a caderneta na primeira página em branco."
    ],
    "rotuloBotao": "A vela queima"
   },
   {
    "id": "chamado",
    "titulo": "Batem à porta",
    "paragrafos": [
     "A Sra. Potts entra com o castiçal numa mão e um envelope na outra. \"Veio a cavalo, de Aldergate. O rapaz disse que o delegado de lá manda dizer que é urgente.\""
    ],
    "rotuloBotao": "Abrir o envelope"
   },
   {
    "id": "carta",
    "titulo": "A carta do Delegado",
    "carta": true,
    "paragrafos": [
     "O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.",
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Aldergate, e como homem que sabe o tamanho do que não sabe. Emily Williams, professora de vila desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
     "\"Roderick, Delegado.\""
    ],
    "rotuloBotao": "Aceitar o chamado"
   },
   {
    "id": "transformacao",
    "titulo": "A mesa se transforma",
    "paragrafos": [
     "A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta.",
     "{detective.title} {detective.surname} desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer."
    ],
    "rotuloBotao": "Tomar o trem"
   },
   {
    "id": "chegada",
    "titulo": "Aldergate",
    "paragrafos": [
     "A plataforma cheira a carvão e palha molhada. Aldergate estende-se além dos trilhos, e a luz de outubro alonga as sombras rua adentro.",
     "O delegado Roderick espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Roderick",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Emily Williams, 25 anos, professora de vila. Achado morto em A Escola. Não toquei em nada e não prendi ninguém.\"",
     "Detém-se à porta e baixa a voz. \"Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}.\""
    ],
    "rotuloBotao": "Entrar — iniciar a investigação"
   }
  ],
  "perguntas": [
   {
    "id": "sobre_a_hora",
    "pergunta": "O que se sabe da hora da morte?",
    "resposta": "\"De horas não me arrisco: papel meu não data defunto. O corpo está como o achamos; {g:o senhor|a senhora} dirá por ele.\""
   },
   {
    "id": "quem_convive",
    "pergunta": "Quem convivia com a vítima?",
    "resposta": "\"Homem de poucas companhias. O que a vila souber, a vila conta melhor que eu.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si — a vizinhança fala mais comigo fora do expediente que dentro dele.\""
   }
  ],
  "opcoesPersonagem": [
   {
    "id": "harlan",
    "nome": "Dr. Harlan Blackwell",
    "descricao": "Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem."
   }
  ]
 },
 "parametrosCena": {
  "horasChegada": 11,
  "ambiente": 11,
  "calendario": {
   "diaBase": 14,
   "mesAbrev": "out",
   "mesExtenso": "outubro",
   "ano": 1893
  }
 },
 "interferencias": {
  "eventos": [
   {
    "id": "intf_1",
    "tipo": "destruir_evidencia",
    "ator": "gen_3_lavrador",
    "atorPapel": "assassino",
    "alvo": {
     "tipo": "carta",
     "cartaId": "gen_pegadas",
     "localId": "escola"
    },
    "gatilho": {
     "tipo": "extracao_carta",
     "cartaId": "gen_motivo",
     "comoSoube": "o perito abriu o móbil do réu na delegacia (extração de gen_motivo); o inquérito em público correu a vila até o ator"
    },
    "rota": {
     "de": "igreja",
     "para": "escola",
     "faixa": "noite",
     "sustentacao": "retorno_a_cena",
     "comoChegou": "refez, na faixa noite, o caminho do próprio crime até escola"
    },
    "rolagem": {
     "wis": 2,
     "penalidade": 2,
     "alvo": 0,
     "dado": 2,
     "sucesso": false
    },
    "efeito": {
     "cartaDestruida": "gen_pegadas",
     "cartasNovas": [
      "gen_intf_intf_1_limpeza",
      "gen_intf_intf_1_meia_obra"
     ]
    },
    "prenuncio": null,
    "anuncio": "Há sinais de que alguém esteve na cena desde a última visita."
   }
  ]
 },
 "ecosInterferencia": {
  "titulo": "O legista, sobre o que se moveu",
  "porChave": {
   "destruir_evidencia_ocorrida": [
    "Esfregaram a cena entre uma visita e outra; a madeira ainda estava úmida. A peça que se perdeu não volta, mas esfrega fresca também se data.",
    "Levaram da cena o que o senhor ainda não tinha recolhido. Ficou no lugar a limpeza recente, e limpeza recente se lê como qualquer outro sinal."
   ],
   "destruir_evidencia_evitada": [
    "Vieram limpar a cena; o que importava já estava no seu caderno.",
    "Quando esfregaram o assoalho, a peça já constava do seu registro. Guarde o método: primeiro o que pode sumir."
   ],
   "intimidar_testemunha_ocorrida": [
    "Aquela boca fechou depois que as suas perguntas correram a vila. Anote o dia em que fechou.",
    "A testemunha recuou antes de assinar o que sabia. Onde o depoimento faltar, procure o que sobrou em torno da recusa."
   ],
   "intimidar_testemunha_evitada": [
    "Tentaram calar quem já tinha falado ao senhor. O depoimento estava colhido; o medo chegou atrasado.",
    "A ameaça veio depois do registro, e contra registro feito o medo pode pouco."
   ],
   "subornar_testemunha_ocorrida": [
    "A mesma boca contou duas histórias, e a segunda veio na semana em que uma dívida antiga se quitou.",
    "Há dois depoimentos que não se encontram e uma dívida quitada entre um e outro. Ponha as três coisas lado a lado e meça as datas."
   ],
   "silenciar_ocorrida": [
    "Perdemos a testemunha antes do depoimento. O segundo corpo é morte de horas, não de dias; e o segundo serviço, mais grosseiro, se lê mais fácil que o primeiro.",
    "Quem ouviu aquela noite não chegou a depor. O segundo corpo se lia como o primeiro: rigor, livor, a conta das horas. O que o gesto teve de grosseiro ficou nos sinais."
   ],
   "silenciar_evitada": [
    "A testemunha morreu com o depoimento já no seu caderno. O senhor chegou primeiro; o que sabia, o tribunal ainda ouve.",
    "O aviso estava lá, para quem quisesse ler — e o depoimento sobreviveu a quem o deu."
   ]
  }
 }
},
{
 "id": "gerado_comarca_8",
 "verdadeDeOuro": {
  "id": "gerado_comarca_8",
  "vitima": "Edith Taylor",
  "reuCorreto": "gen_5_lavrador",
  "horasMorteAntesChegada": 13,
  "horaMorteAbsoluta": -2,
  "mecanismoCorreto": "estrangulamento_ligadura",
  "instrumentoCorreto": "cordao_torcido",
  "motivacaoCorreta": "divida_caderneta",
  "cenaEncenada": false,
  "horaForjada": null,
  "perifericos": {}
 },
 "suspeitos": [
  {
   "id": "gen_2_taverneiro",
   "nome": "Alice Jones",
   "idade": 41,
   "relacao": "Taverneira; mora em A Taverna",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  },
  {
   "id": "gen_0_lavrador",
   "nome": "James Thomas",
   "idade": 28,
   "relacao": "Lavrador; mora em Cottage nº 5",
   "descricao": "Conta a noite por canecas, e as horas não fecham entre si."
  },
  {
   "id": "gen_3_lavrador",
   "nome": "Joseph Roberts",
   "idade": 25,
   "relacao": "Lavrador; mora em Cottage nº 1",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_5_lavrador",
   "nome": "William Taylor",
   "idade": 52,
   "relacao": "Lavrador; mora em Cottage nº 3",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_4_lavrador",
   "nome": "William Wilson",
   "idade": 36,
   "relacao": "Lavrador; mora em Cottage nº 2",
   "descricao": "Fala baixo e mede a porta antes de responder."
  }
 ],
 "cartas": [
  {
   "id": "gen_rigor",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Rigidez Parcial",
     "carimboPadrao": "Maxilar duro; membros ainda cedem",
     "descricao": "O maxilar não cede ao polegar; os cotovelos ainda dobram ao peso da mão. A rigidez sobe pelo corpo e não o tomou inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "instalando",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 24,
     "textoDisplay": "Corpo Endurecido",
     "carimboPadrao": "Duro dos maxilares aos joelhos",
     "descricao": "Duro do maxilar aos joelhos. O corpo fixou-se na postura em que a morte o encontrou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "pleno",
      "estadoDegradacao": "ativo"
     }
    },
    {
     "ipmAte": 36,
     "textoDisplay": "Rigidez Cedendo",
     "carimboPadrao": "Maxilar solto; joelhos rígidos",
     "descricao": "O maxilar volta a ceder; os joelhos seguem presos. A rigidez que o tomou começa a desfazer-se.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolucao",
      "estadoDegradacao": "degradado"
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Corpo Flácido",
     "carimboPadrao": "Corpo mole, sem rigidez",
     "descricao": "Junta nenhuma resiste ao exame. A rigidez veio e já passou por inteiro.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "rigor_mortis",
      "estadoRigor": "resolvido",
      "estadoDegradacao": "resolvido"
     }
    }
   ]
  },
  {
   "id": "gen_livores",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "estados": [
    {
     "ipmAte": 12,
     "textoDisplay": "Manchas que Cedem ao Polegar",
     "carimboPadrao": "Manchas que empalidecem à pressão",
     "descricao": "As manchas de sangue assentado empalidecem sob o polegar e tornam à cor quando a pressão cessa.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "movel",
      "posicaoCompativel": true
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou.",
     "tagsOcultas": {
      "dominio": "temporal",
      "subDominio": "livor_mortis",
      "estadoLivor": "fixo",
      "posicaoCompativel": true
     }
    }
   ]
  },
  {
   "id": "gen_lesao_fatal",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "O Sulco no Pescoço",
   "carimboPadrao": "Sinal de garrote (ligadura)",
   "descricao": "Um sulco uniforme corre horizontal em volta do pescoço, na mesma profundidade de ponta a ponta, sem subir rumo à nuca.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "ferida",
    "sinal": "sulco_horizontal"
   }
  },
  {
   "id": "gen_reacao_vital",
   "localidade": "corpo",
   "suporteFisico": "corpo",
   "textoDisplay": "Bordas Vivas",
   "carimboPadrao": "Lesões sofridas em vida",
   "descricao": "As lesões mostram bordas inchadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
   "tagsOcultas": {
    "dominio": "causal",
    "subDominio": "reacao_vital",
    "sinal": "reacao_vital"
   }
  },
  {
   "id": "gen_visto_vivo",
   "localidade": "delegacia",
   "suporteFisico": "testemunho",
   "origemTestemunha": null,
   "textoDisplay": "Última Vez com Vida",
   "carimboPadrao": "Vítima com vida às 21h00 de 13/out",
   "descricao": "Do registro da ronda consta Edith Taylor com vida às 21h00 de 13/out. Depois dessa hora, ninguém mais o encontrou em pé.",
   "tagsOcultas": {
    "dominio": "temporal",
    "subDominio": "ultima_vez_visto",
    "horaAvistamento": -3
   }
  },
  {
   "id": "gen_instrumento",
   "localidade": "cena",
   "suporteFisico": "cena",
   "textoDisplay": "O Instrumento Abandonado",
   "carimboPadrao": "Instrumento deixado na cena",
   "descricao": "Ficou onde a mão o largou. O feitio casa com a lesão do morto, e o dono tem nome na vila: William Taylor.",
   "tagsOcultas": {
    "dominio": "vestigio",
    "subDominio": "instrumento_oficio",
    "tipoVestigio": "cordao_torcido",
    "pertenceA": "gen_5_lavrador"
   }
  },
  {
   "id": "gen_motivo",
   "localidade": "delegacia",
   "suporteFisico": "registro",
   "textoDisplay": "Os Papéis do Móbil",
   "carimboPadrao": "Móbil de William Taylor",
   "descricao": "Uma caderneta de fiado soma a dívida de William Taylor para com Edith Taylor, vencida e cobrada por carta.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "divida_caderneta",
    "ligadoA": "gen_5_lavrador"
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — A Escola",
   "subtitulo": "Edith Taylor, professora de vila, 29 anos",
   "acoesEspeciais": [
    "termometro"
   ],
   "gestos": [
    {
     "id": "gesto_voltar_corpo",
     "rotulo": "Voltar o corpo",
     "cartaId": "gen_livores"
    }
   ],
   "prosa": [
    "O morto jaz no chão do cômodo a que a vila chama sala de aula, vestido como andava em casa. O delegado mandou que nada se tocasse até a chegada {g:do perito|da perita}, e nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} julgar de medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Escola",
   "subtitulo": "Onde Edith Taylor foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Escola guarda o dia em que o acharam. No cômodo, quadro de ardósia, estufa de ferro, carteiras enfileiradas; o desarrumado corre de um canto a outro; há mobília por erguer do chão.",
    "Junto do corpo, deixado onde caiu, o achado que a vila inteira comenta: [[gen_instrumento]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "delegacia",
   "rotuloMesa": "A Delegacia",
   "titulo": "A Delegacia",
   "subtitulo": "Os papéis do caso",
   "acoesEspeciais": [],
   "prosa": [
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam do morto e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]]."
   ],
   "blocosContingentes": []
  },
  {
   "id": "vizinhanca",
   "rotuloMesa": "A Vizinhança",
   "titulo": "A Vizinhança da Cena",
   "subtitulo": "As casas em volta, as janelas que dão para a rua",
   "acoesEspeciais": [],
   "prosa": [
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua. O que uma noite faz de barulho, a vizinhança guarda de memória."
   ],
   "blocosContingentes": []
  }
 ],
 "nosMapa": [
  {
   "id": "corpo",
   "rotulo": "O Corpo",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "cena",
   "rotulo": "A Cena do Crime",
   "grupo": "cena_predio",
   "desbloqueadoInicio": true
  },
  {
   "id": "delegacia",
   "rotulo": "A Delegacia",
   "grupo": "vila",
   "desbloqueadoInicio": true
  },
  {
   "id": "vizinhanca",
   "rotulo": "A Vizinhança",
   "grupo": "vila",
   "desbloqueadoInicio": true
  }
 ],
 "leads": [],
 "custos": {
  "cena_predio|cena_predio": 0,
  "cena_predio|vila": 1,
  "vila|cena_predio": 1,
  "vila|vila": 1
 },
 "dialogos": {},
 "confrontos": {
  "estadoInicial": "presente",
  "consequencias": {}
 },
 "abertura": {
  "passos": [
   {
    "id": "caulfield",
    "titulo": "Caulfield, 14 de outubro de 1893",
    "paragrafos": [
     "A pensão da Sra. Potts amanhece como sempre: o quarto estreito, a meia vela, o jornal de anteontem dobrado sobre a mesa.",
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio, e abre a caderneta na primeira página em branco."
    ],
    "rotuloBotao": "A vela queima"
   },
   {
    "id": "chamado",
    "titulo": "Batem à porta",
    "paragrafos": [
     "A Sra. Potts entra com o castiçal numa mão e um envelope na outra. \"Veio a cavalo, de Haversham. O rapaz disse que o delegado de lá manda dizer que é urgente.\""
    ],
    "rotuloBotao": "Abrir o envelope"
   },
   {
    "id": "carta",
    "titulo": "A carta do Delegado",
    "carta": true,
    "paragrafos": [
     "O lacre de cera racha sob o polegar. A letra corre inclinada, firme no começo de cada linha.",
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Haversham, e como homem que sabe o tamanho do que não sabe. Edith Taylor, professora de vila desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
     "\"Stanmore, Delegado.\""
    ],
    "rotuloBotao": "Aceitar o chamado"
   },
   {
    "id": "transformacao",
    "titulo": "A mesa se transforma",
    "paragrafos": [
     "A mesa estreita da pensão fica sendo, enquanto durar o caso, uma escrivaninha de perícia: a lente de um lado, o termômetro do outro, a caderneta aberta.",
     "{detective.title} {detective.surname} desce para a estação antes que a Sra. Potts encontre uma pergunta para fazer."
    ],
    "rotuloBotao": "Tomar o trem"
   },
   {
    "id": "chegada",
    "titulo": "Haversham",
    "paragrafos": [
     "A plataforma cheira a carvão e palha molhada. Haversham estende-se além dos trilhos, e a luz de outubro alonga as sombras rua adentro.",
     "O delegado Stanmore espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Stanmore",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Edith Taylor, 29 anos, professora de vila. Achado morto em A Escola. Não toquei em nada e não prendi ninguém.\"",
     "Detém-se à porta e baixa a voz. \"Pergunte o que quiser antes de entrarmos. Lá dentro, a perícia é {g:do senhor|da senhora}.\""
    ],
    "rotuloBotao": "Entrar — iniciar a investigação"
   }
  ],
  "perguntas": [
   {
    "id": "sobre_a_hora",
    "pergunta": "O que se sabe da hora da morte?",
    "resposta": "\"De horas não me arrisco: papel meu não data defunto. O corpo está como o achamos; {g:o senhor|a senhora} dirá por ele.\""
   },
   {
    "id": "quem_convive",
    "pergunta": "Quem convivia com a vítima?",
    "resposta": "\"Homem de poucas companhias. O que a vila souber, a vila conta melhor que eu.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si — a vizinhança fala mais comigo fora do expediente que dentro dele.\""
   }
  ],
  "opcoesPersonagem": [
   {
    "id": "harlan",
    "nome": "Dr. Harlan Blackwell",
    "descricao": "Cirurgião do Exército em duas campanhas; perito independente desde 1887. Frio, metódico, conhecido nos tribunais do condado pela precisão com que fixa o intervalo post-mortem."
   }
  ]
 },
 "parametrosCena": {
  "horasChegada": 11,
  "ambiente": 11,
  "calendario": {
   "diaBase": 14,
   "mesAbrev": "out",
   "mesExtenso": "outubro",
   "ano": 1893
  }
 }
}
];
