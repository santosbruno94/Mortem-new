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
   "relacao": "Moleiro; mora no Moinho",
   "descricao": "Cita dia e hora como quem lê de um livro de assentos."
  },
  {
   "id": "gen_1_criada",
   "nome": "Mary Walker",
   "idade": 24,
   "relacao": "Criada; mora na Taverna",
   "descricao": "Espera a pergunta acabar de todo antes de abrir a boca."
  },
  {
   "id": "gen_5_paroco",
   "nome": "Thomas Jones",
   "idade": 68,
   "relacao": "Pároco; mora no Presbitério",
   "descricao": "Cita dia e hora como quem lê de um livro de assentos."
  },
  {
   "id": "gen_2_ferreiro",
   "nome": "Walter Williams",
   "idade": 35,
   "relacao": "Ferreiro; mora no Cottage nº 1",
   "descricao": "Mede a noite por sinos e canecas, nunca pelo relógio."
  },
  {
   "id": "gen_0_lavrador",
   "nome": "William Smith",
   "idade": 27,
   "relacao": "Lavrador; mora no Cottage nº 4",
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
      "posicaoCompativel": false
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou. As manchas assentaram do lado que ora fica para cima.",
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
   "descricao": "As lesões mostram bordas afastadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
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
   "descricao": "Do registro da ronda consta Ada Thomas com vida às 19h00 de 13/out; depois dessa hora, linha nenhuma torna a nomeá-la.",
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
   "descricao": "Entre as coisas de ofício de Mary Walker, um vão limpo no meio do pó, do comprimento e do desenho da lesão da morta.",
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
   "descricao": "Ada Thomas negou a Mary Walker a carta de referência; sem ela, casa nenhuma a toma a serviço.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "character_negado",
    "ligadoA": "gen_1_criada"
   }
  },
  {
   "id": "gen_alibi_gen_3_moleiro",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de John Wilson",
   "carimboPadrao": "Paradeiro declarado: O Moinho (sexta à noite)",
   "descricao": "\"Recolhi-me ao Moinho às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_3_moleiro",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_1_criada",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Mary Walker",
   "carimboPadrao": "Paradeiro declarado: A Taverna (sexta à noite)",
   "descricao": "\"Recolhi-me à Taverna às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_1_criada",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_5_paroco",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Thomas Jones",
   "carimboPadrao": "Paradeiro declarado: A Escola (sexta à noite)",
   "descricao": "\"Estive na Escola das oito às onze; dali fui direto para o Presbitério, dormir.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_5_paroco",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_2_ferreiro",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Walter Williams",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 1 (sexta à noite)",
   "descricao": "\"Recolhi-me ao Cottage nº 1 às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_2_ferreiro",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_0_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de William Smith",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 4 (sexta à noite)",
   "descricao": "\"Recolhi-me ao Cottage nº 4 às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_0_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
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
    "A morta jaz no chão do cômodo a que a vila chama quarto do sobrado, vestida como andava em casa. O delegado pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ela: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} houver por bem medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Mercearia",
   "subtitulo": "Onde Ada Thomas foi achada",
   "acoesEspeciais": [],
   "prosa": [
    "A Mercearia guarda o dia em que a acharam. No cômodo, lavatório com bacia, cômoda, cama de armação de madeira; de um canto a outro, nada guarda o seu lugar; a madeira do assoalho cheira a soda cáustica; sob o pé de uma peça de mobília, um arranhão que escapa para fora dela."
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
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam da morta e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]].",
    "Um a um, ao chamado do delegado, os nomes dos papéis vêm à sala do expediente; a cadeira do interrogado espera de frente para a janela."
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
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua; entre uma casa e outra, um braço de distância."
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
 "dialogos": {
  "dialogo_gen_3_moleiro": {
   "suspeitoId": "gen_3_moleiro",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar John Wilson",
   "titulo": "Interrogatório — John Wilson",
   "subtitulo": "Moleiro, 55 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "John Wilson entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"O negócio espera trancado. Pergunte de uma vez, faça o favor.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha o que se lhe mostra como quem confere fatura alheia. \"Isto não passou pelo meu balcão. Do que passou, respondo com o livro na mão.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_moleiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não tenho que dar. Se Ada Thomas tinha desafeto, não foi freguês meu.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_moleiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Ada Thomas? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_moleiro]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos meus com ela, poucos e pagos. Se há soma pendente em algum livro, o livro que fale.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_moleiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_1_criada": {
   "suspeitoId": "gen_1_criada",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Mary Walker",
   "titulo": "Interrogatório — Mary Walker",
   "subtitulo": "Criada, 24 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_instrumento": "reacao_gen_instrumento"
   },
   "confrontos": [
    {
     "requerCarta": "gen_instrumento",
     "rotulo": "[O Lugar Vazio] Por que falta essa peça entre as suas coisas?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "Mary Walker entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Com licença de entrar. Respondo o que souber.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha depressa e baixa os olhos. \"Isso eu não sei o que é. Da casa e do serviço respondo; do resto não ponho palavra.\""
     ],
     "opcoes": []
    },
    "reacao_gen_instrumento": {
     "fala": [
      "Mary Walker olha o vão apontado no papel como se o visse de novo. \"Falta, e dou pela falta há dias. Ferramenta nesta vila empresta-se sem se pedir, e devolve-se quando lembra. Quem a levou não me deu o nome.\" As mãos ficam quietas enquanto responde."
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_1_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome nenhum me cabe dar, {detective.title}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_1_criada]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Ada Thomas era do trato de todos os dias; eu a conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_1_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_1_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_5_paroco": {
   "suspeitoId": "gen_5_paroco",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Thomas Jones",
   "titulo": "Interrogatório — Thomas Jones",
   "subtitulo": "Pároco, 68 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Thomas Jones entra na sala do expediente antes que o delegado acabe de chamar o nome, e toma a palavra junto com a cadeira. \"A paróquia está às ordens do inquérito. Pergunte.\" Acrescenta, antes da primeira pergunta: \"Na minha idade responde-se uma vez, e certo.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Examina o que se lhe apresenta e o devolve com as duas mãos. \"Disso não sei dar testemunho. Pergunte do rebanho, que do rebanho respondo.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_5_paroco]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nomes não aponto. Desafeto declarado de Ada Thomas, não me constou nenhum.\" Ergue-se e alisa a sobrecasaca. \"A paróquia fica às ordens.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_5_paroco]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Ada Thomas? Trato de cumprimento, e pontual no banco da igreja, ao que se via.\" Ergue-se e alisa a sobrecasaca. \"A paróquia fica às ordens.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_5_paroco]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os de vizinho de terra; nada em papel que um inquérito leia.\" Ergue-se e alisa a sobrecasaca. \"A paróquia fica às ordens.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_5_paroco]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz o que sempre disse; desta casa não sai eco.\" Ergue-se e alisa a sobrecasaca. \"A paróquia fica às ordens.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_2_ferreiro": {
   "suspeitoId": "gen_2_ferreiro",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Walter Williams",
   "titulo": "Interrogatório — Walter Williams",
   "subtitulo": "Ferreiro, 35 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; Walter Williams entra e senta-se de chapéu na mão. \"Serviço parado esfria. Pergunte.\" Ao citar a primeira hora, corrige-a no meio da frase."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha por cima, o tempo de dois fôlegos, e encolhe os ombros. \"Disso não entendo. Pergunte de ferramenta e de serviço, que disso dou conta.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_ferreiro]]. Posto contra a parede, alinha as horas com os dedos na tábua da mesa, uma a uma."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não tenho que dar. Se Ada Thomas tinha desafeto, não foi freguês meu.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\" Na despedida, cita a mesma hora de antes, e a hora vem diferente."
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Ada Thomas? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos meus com ela, poucos e pagos. Se há soma pendente em algum livro, o livro que fale.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_0_lavrador": {
   "suspeitoId": "gen_0_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar William Smith",
   "titulo": "Interrogatório — William Smith",
   "subtitulo": "Lavrador, 27 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; William Smith entra e senta-se de chapéu na mão. \"Vim assim que o guarda mandou. Diga lá, que a lida não espera.\" E emenda, sem pergunta, o frio que fez e o preço do pão."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_0_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Ada Thomas eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_0_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Ada Thomas? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_0_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_0_lavrador]]. No meio do rodeio, a mão pousa na mesa e a fala desacelera, como quem pisa chão conhecido."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Thomas. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Thomas, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Thomas? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Já na porta, ainda oferece o tempo que fez na sexta e o nome de quem passou tarde pela estrada."
     ],
     "opcoes": []
    }
   }
  }
 },
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
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio. A caderneta abre na primeira página em branco."
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
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Wrenfield. Isto passa do meu ofício, e não fingirei o contrário. Ada Thomas, merceeira desta vila, foi achada morta. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
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
     "A plataforma cheira a carvão e palha molhada. Wrenfield estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados.",
     "O delegado Roderick espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Roderick",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Ada Thomas, 39 anos, merceeira. Achada morta na Mercearia. Não toquei em nada e não prendi ninguém.\"",
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
    "resposta": "\"Mulher de poucas companhias. O que houver, a vila sabe antes de mim.\""
   },
   {
    "id": "desafetos",
    "pergunta": "A morta tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ela não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si.\""
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
   "relacao": "Criada; mora na Taverna",
   "descricao": "Responde de olhos no chão, uma palavra por vez."
  },
  {
   "id": "gen_2_lavrador",
   "nome": "George Evans",
   "idade": 43,
   "relacao": "Lavrador; mora no Cottage nº 1",
   "descricao": "Não há pergunta curta que devolva curta."
  },
  {
   "id": "gen_4_constable",
   "nome": "George Smith",
   "idade": 21,
   "relacao": "Constable do condado; mora na Delegacia",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_1_boticario",
   "nome": "James Jones",
   "idade": 57,
   "relacao": "Boticário; mora na Botica",
   "descricao": "Cita dia e hora como quem lê de um livro de assentos."
  },
  {
   "id": "gen_0_costureira",
   "nome": "Martha Roberts",
   "idade": 56,
   "relacao": "Costureira; mora no Cottage nº 4",
   "descricao": "Começa pela resposta e acaba na vida alheia."
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
   "descricao": "Um vinco uniforme corre horizontal em volta do pescoço, na mesma profundidade de ponta a ponta, sem subir rumo à nuca.",
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
   "descricao": "As lesões mostram bordas afastadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
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
   "descricao": "Do registro da ronda consta Henry Brown com vida às 01h00 de 14/out; depois dessa hora, linha nenhuma torna a nomeá-lo.",
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
  },
  {
   "id": "gen_alibi_gen_5_criada",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de Alice Thomas",
   "carimboPadrao": "Paradeiro declarado: A Taverna (madrugada de sábado)",
   "descricao": "\"Recolhi-me à Taverna às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_5_criada",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_2_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de George Evans",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 1 (madrugada de sábado)",
   "descricao": "\"Recolhi-me ao Cottage nº 1 às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_2_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_4_constable",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de George Smith",
   "carimboPadrao": "Paradeiro declarado: A Delegacia (madrugada de sábado)",
   "descricao": "\"Recolhi-me à Delegacia às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_4_constable",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_1_boticario",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de James Jones",
   "carimboPadrao": "Paradeiro declarado: A Botica (madrugada de sábado)",
   "descricao": "\"Recolhi-me à Botica às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_1_boticario",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_0_costureira",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de Martha Roberts",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 4 (madrugada de sábado)",
   "descricao": "\"Recolhi-me ao Cottage nº 4 às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_0_costureira",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
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
    "O morto jaz no chão do cômodo a que a vila chama quarto do sobrado, vestido como andava em casa. O delegado pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} houver por bem medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Mercearia",
   "subtitulo": "Onde Henry Brown foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Mercearia guarda o dia em que o acharam. No cômodo, cômoda, cama de armação de madeira, lavatório com bacia."
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
    "Entre os papéis recolhidos por precaução: [[gen_motivo]].",
    "Um a um, ao chamado do delegado, os nomes dos papéis vêm à sala do expediente; a cadeira do interrogado espera de frente para a janela."
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
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua; entre uma casa e outra, um braço de distância."
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
 "dialogos": {
  "dialogo_gen_5_criada": {
   "suspeitoId": "gen_5_criada",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Alice Thomas",
   "titulo": "Interrogatório — Alice Thomas",
   "subtitulo": "Criada, 20 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Alice Thomas entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Com licença de entrar. Respondo o que souber.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha depressa e baixa os olhos. \"Isso eu não sei o que é. Da casa e do serviço respondo; do resto não ponho palavra.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Henry Brown eu não conhecia.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_criada]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Henry Brown? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_2_lavrador": {
   "suspeitoId": "gen_2_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar George Evans",
   "titulo": "Interrogatório — George Evans",
   "subtitulo": "Lavrador, 43 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; George Evans entra e senta-se de chapéu na mão. \"Vim assim que o guarda mandou. Diga lá, que a lida não espera.\" E emenda, sem pergunta, o frio que fez e o preço do pão."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Henry Brown eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Henry Brown? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_lavrador]]. No meio do rodeio, a mão pousa na mesa e a fala desacelera, como quem pisa chão conhecido."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Já na porta, ainda oferece o tempo que fez na sexta e o nome de quem passou tarde pela estrada."
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_4_constable": {
   "suspeitoId": "gen_4_constable",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar George Smith",
   "titulo": "Interrogatório — George Smith",
   "subtitulo": "Constable do condado, 21 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; George Smith entra e senta-se de chapéu na mão. \"De serviço ou fora dele, respondo pelo livro. Pergunte.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Examina como quem preenche folha. \"Sem registro disto, não firmo nada. O que está lavrado, está lavrado; o resto se apura.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_4_constable]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Henry Brown eu não conhecia.\" Levanta-se e ajeita o cinturão. \"A ronda não espera.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_4_constable]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Henry Brown? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se e ajeita o cinturão. \"A ronda não espera.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_4_constable]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se e ajeita o cinturão. \"A ronda não espera.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_4_constable]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se e ajeita o cinturão. \"A ronda não espera.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_1_boticario": {
   "suspeitoId": "gen_1_boticario",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar James Jones",
   "titulo": "Interrogatório — James Jones",
   "subtitulo": "Boticário, 57 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_instrumento": "reacao_gen_instrumento"
   },
   "confrontos": [
    {
     "requerCarta": "gen_instrumento",
     "rotulo": "[O Instrumento Úmido] Por que a peça foi guardada lavada, com a junta ainda úmida?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "James Jones entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Deixei o negócio fechado por esta hora. Aproveitemo-la.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha o que se lhe mostra como quem confere fatura alheia. \"Isto não passou pelo meu balcão. Do que passou, respondo com o livro na mão.\""
     ],
     "opcoes": []
    },
    "reacao_gen_instrumento": {
     "fala": [
      "James Jones responde sem olhar a peça duas vezes. \"Lavei-a porque se lava ferramenta; ferrugem não espera inquérito. O feitio casa com a lesão, diz esse papel; casa também com metade das bancadas do condado.\" E devolve a resposta no mesmo passo das outras."
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_boticario]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome nenhum me cabe dar, {detective.title}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_boticario]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Henry Brown era do trato de todos os dias; eu o conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_boticario]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_boticario]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_0_costureira": {
   "suspeitoId": "gen_0_costureira",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Martha Roberts",
   "titulo": "Interrogatório — Martha Roberts",
   "subtitulo": "Costureira, 56 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; Martha Roberts entra, senta-se e ajeita as fitas da touca. \"Deixei serviço pela metade na bancada. Seja {g:direto|direta}, se puder ser.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" E emenda, sem pergunta, o frio que fez e o preço do pão."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha por cima, o tempo de dois fôlegos, e encolhe os ombros. \"Disso não entendo. Pergunte de ferramenta e de serviço, que disso dou conta.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_0_costureira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não tenho que dar. Se Henry Brown tinha desafeto, não foi freguês meu.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_0_costureira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Henry Brown? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_0_costureira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos meus com ele, poucos e pagos. Se há soma pendente em algum livro, o livro que fale.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_0_costureira]]. No meio do rodeio, a mão pousa na mesa e a fala desacelera, como quem pisa chão conhecido."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Brown. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Brown, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Brown? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\" Já na porta, ainda oferece o tempo que fez na sexta e o nome de quem passou tarde pela estrada."
     ],
     "opcoes": []
    }
   }
  }
 },
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
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio. A caderneta abre na primeira página em branco."
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
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Aldergate. Isto passa do meu ofício, e não fingirei o contrário. Henry Brown, merceeiro desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
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
     "A plataforma cheira a carvão e palha molhada. Aldergate estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados.",
     "O delegado Roderick espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Roderick",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Henry Brown, 47 anos, merceeiro. Achado morto na Mercearia. Não toquei em nada e não prendi ninguém.\"",
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
    "resposta": "\"Homem de poucas companhias. O que houver, a vila sabe antes de mim.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si.\""
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
   "relacao": "Criada; mora na Taverna",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_0_constable",
   "nome": "Ernest Jones",
   "idade": 31,
   "relacao": "Constable do condado; mora na Delegacia",
   "descricao": "Cita dia e hora como quem lê de um livro de assentos."
  },
  {
   "id": "gen_3_lavrador",
   "nome": "George Taylor",
   "idade": 44,
   "relacao": "Lavrador; mora no Cottage nº 2",
   "descricao": "Do serão, lembra a ordem das coisas; das horas, não se prende."
  },
  {
   "id": "gen_6_lavrador",
   "nome": "James Brown",
   "idade": 49,
   "relacao": "Lavrador; mora no Cottage nº 3",
   "descricao": "Responde de olhos no chão, uma palavra por vez."
  },
  {
   "id": "gen_1_medico",
   "nome": "William Roberts",
   "idade": 45,
   "relacao": "Médico rural; mora na Casa do Médico",
   "descricao": "Cita dia e hora como quem lê de um livro de assentos."
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
   "descricao": "As lesões mostram bordas afastadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
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
   "descricao": "Annie Thomas esteve com Ada Jones às 21h00 de 13/out, e o declara à ronda. Depois dessa hora, avistamento nenhum consta do registro.",
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
   "descricao": "Entre os pertences de James Brown, a peça guardada lavada — e a junta do cabo ainda úmida. O feitio casa com a lesão da morta.",
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
   "textoDisplay": "O Rastro de Gotas",
   "carimboPadrao": "Sangue afastado do corpo",
   "descricao": "Gotas redondas, a passos do corpo, espaçadas em fila até a porta. As feridas da morta não sangraram nesse caminho.",
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
   "descricao": "O segundo corpo tem rigor e manchas de poucas horas: morte posterior à primeira perícia. As lesões são largas, de bordas rasgadas, sem o desenho das que a primeira morta levou.",
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
  },
  {
   "id": "gen_alibi_gen_4_criada",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Annie Thomas",
   "carimboPadrao": "Paradeiro declarado: A Taverna (sexta à noite)",
   "descricao": "\"Recolhi-me à Taverna às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_4_criada",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_0_constable",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Ernest Jones",
   "carimboPadrao": "Paradeiro declarado: A Delegacia (sexta à noite)",
   "descricao": "\"Recolhi-me à Delegacia às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_0_constable",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_3_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de George Taylor",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 2 (sexta à noite)",
   "descricao": "\"Recolhi-me ao Cottage nº 2 às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_3_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_6_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de James Brown",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 3 (sexta à noite)",
   "descricao": "\"Recolhi-me ao Cottage nº 3 às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_6_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_1_medico",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de William Roberts",
   "carimboPadrao": "Paradeiro declarado: Casa do Médico (sexta à noite)",
   "descricao": "\"Recolhi-me à Casa do Médico às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_1_medico",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
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
    "A morta jaz no chão do cômodo a que a vila chama taproom, vestida como andava em casa. O delegado pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ela: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} houver por bem medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Taverna",
   "subtitulo": "Onde Ada Jones foi achada",
   "acoesEspeciais": [],
   "prosa": [
    "A Taverna guarda o dia em que a acharam. No cômodo, balcão com beer engine, mesas de taverna; de um canto a outro, nada guarda o seu lugar; há mobília por erguer do chão.",
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
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam da morta e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]].",
    "Um a um, ao chamado do delegado, os nomes dos papéis vêm à sala do expediente; a cadeira do interrogado espera de frente para a janela."
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
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua; entre uma casa e outra, um braço de distância.",
    "Uma porta se entreabre à passagem {g:do perito|da perita}: [[gen_intf_intf_1_prenuncio]]."
   ],
   "blocosContingentes": [
    {
     "eventoId": "intf_1",
     "quando": "nao_disparado",
     "paragrafos": [
      "De dentro do próprio prédio, quem dormia parede-meia conta: [[gen_ruido_ouvido]]."
     ]
    },
    {
     "eventoId": "intf_1",
     "quando": "disparado",
     "paragrafos": [
      "Na volta, o que a primeira visita não viu: [[gen_intf_intf_1_corpo]]"
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
 "dialogos": {
  "dialogo_gen_4_criada": {
   "suspeitoId": "gen_4_criada",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Annie Thomas",
   "titulo": "Interrogatório — Annie Thomas",
   "subtitulo": "Criada, 28 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_visto_vivo": "reacao_gen_visto_vivo",
    "gen_ruido_ouvido": "reacao_gen_ruido_ouvido"
   },
   "confrontos": [
    {
     "requerCarta": "gen_visto_vivo",
     "rotulo": "[Última Vez com Vida] A que horas, exatamente, viu a vítima com vida?"
    },
    {
     "requerCarta": "gen_ruido_ouvido",
     "rotulo": "[O Barulho na Vizinhança] O que exatamente a parede deixou passar naquela hora?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "Annie Thomas entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Com licença de entrar. Respondo o que souber.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha depressa e baixa os olhos. \"Isso eu não sei o que é. Da casa e do serviço respondo; do resto não ponho palavra.\""
     ],
     "opcoes": []
    },
    "reacao_gen_visto_vivo": {
     "fala": [
      "Annie Thomas responde sem pedir o termo para ler. \"Declarei à ronda e torno a declarar: vi quem vi, em pé e falando, à hora que dei. Disso não tiro uma linha.\" E deixa que o papel diga o resto."
     ],
     "opcoes": []
    },
    "reacao_gen_ruido_ouvido": {
     "fala": [
      "Annie Thomas conta de novo, na mesma ordem. \"Pancada primeiro, móvel no chão depois, e mais nada até a manhã. Foi o que ouvi e foi o que declarei. Em barulho eu não ponho nome de gente.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não ponho em ninguém. O que declarei à ronda, declarei; palavra dada não se tira.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_criada]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Ada Jones era das que se cumprimentam na rua. O que sei do resto está no livro do guarda, tal e qual.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Do que vi e ouvi já dei conta por termo, com hora. Fora disso, nada tenho que sirva a um inquérito.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala, e fala alto. Eu digo só o que passou pelos meus olhos e ouvidos; o resto morre comigo.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_0_constable": {
   "suspeitoId": "gen_0_constable",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Ernest Jones",
   "titulo": "Interrogatório — Ernest Jones",
   "subtitulo": "Constable do condado, 31 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Ernest Jones entra na sala do expediente antes que o delegado acabe de chamar o nome, e toma a palavra junto com a cadeira. \"Respondo como se lavra ocorrência: pelo certo. Pergunte.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Examina como quem preenche folha. \"Sem registro disto, não firmo nada. O que está lavrado, está lavrado; o resto se apura.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_0_constable]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Ada Jones eu não conhecia.\" Levanta-se e ajeita o cinturão. \"A ronda não espera.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_0_constable]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Ada Jones? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se e ajeita o cinturão. \"A ronda não espera.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_0_constable]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se e ajeita o cinturão. \"A ronda não espera.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_0_constable]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se e ajeita o cinturão. \"A ronda não espera.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_3_lavrador": {
   "suspeitoId": "gen_3_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar George Taylor",
   "titulo": "Interrogatório — George Taylor",
   "subtitulo": "Lavrador, 44 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; George Taylor entra e senta-se de chapéu na mão. \"Vim assim que o guarda mandou. Diga lá, que a lida não espera.\" Ao citar a primeira hora, corrige-a no meio da frase."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_3_lavrador]]. Posto contra a parede, alinha as horas com os dedos na tábua da mesa, uma a uma."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Ada Jones eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Na despedida, cita a mesma hora de antes, e a hora vem diferente."
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_3_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Ada Jones? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_3_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_3_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_6_lavrador": {
   "suspeitoId": "gen_6_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar James Brown",
   "titulo": "Interrogatório — James Brown",
   "subtitulo": "Lavrador, 49 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_instrumento": "reacao_gen_instrumento"
   },
   "confrontos": [
    {
     "requerCarta": "gen_instrumento",
     "rotulo": "[O Instrumento Úmido] Por que a peça foi guardada lavada, com a junta ainda úmida?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "James Brown entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"O guarda mandou, eu vim. Pergunte, que o campo não espera.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "reacao_gen_instrumento": {
     "fala": [
      "James Brown responde sem olhar a peça duas vezes. \"Lavei-a porque se lava ferramenta; ferrugem não espera inquérito. O feitio casa com a lesão, diz esse papel; casa também com metade das bancadas do condado.\" E devolve a resposta no mesmo passo das outras."
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_6_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome nenhum me cabe dar, {detective.title}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_6_lavrador]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Ada Jones era do trato de todos os dias; eu a conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_6_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_6_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_1_medico": {
   "suspeitoId": "gen_1_medico",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar William Roberts",
   "titulo": "Interrogatório — William Roberts",
   "subtitulo": "Médico rural, 45 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; William Roberts entra e senta-se de chapéu na mão. \"Tenho a manhã tomada, {detective.title}, mas isto passa à frente de tudo. Ao seu dispor.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Corre os olhos pelo que se lhe mostra e o devolve. \"Fora do meu ofício, não arrisco palavra. Pergunte do que é meu.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_medico]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nomes não aponto. Desafeto declarado de Ada Jones, não me constou nenhum.\" Toma o chapéu. \"O inquérito sabe onde me encontrar.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_medico]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Ada Jones? Trato de cumprimento, e pontual no banco da igreja, ao que se via.\" Toma o chapéu. \"O inquérito sabe onde me encontrar.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_medico]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os de vizinho de terra; nada em papel que um inquérito leia.\" Toma o chapéu. \"O inquérito sabe onde me encontrar.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_medico]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Ada Jones. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Ada Jones, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Ada Jones? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz o que sempre disse; desta casa não sai eco.\" Toma o chapéu. \"O inquérito sabe onde me encontrar.\""
     ],
     "opcoes": []
    }
   }
  }
 },
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
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio. A caderneta abre na primeira página em branco."
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
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Haversham. Isto passa do meu ofício, e não fingirei o contrário. Ada Jones, criada desta vila, foi achada morta. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
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
     "A plataforma cheira a carvão e palha molhada. Haversham estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados.",
     "O delegado Stanmore espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Stanmore",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Ada Jones, 18 anos, criada. Achada morta na Taverna. Não toquei em nada e não prendi ninguém.\"",
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
    "resposta": "\"Do dia a dia dela? Annie Thomas, James Brown — gente que partilhava teto, trabalho ou as mesmas noites. Os nomes estão nos meus papéis.\""
   },
   {
    "id": "desafetos",
    "pergunta": "A morta tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ela não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si.\""
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
   "relacao": "Ferreiro; mora no Cottage nº 1",
   "descricao": "Mede a noite por sinos e canecas, nunca pelo relógio."
  },
  {
   "id": "gen_3_merceeiro",
   "nome": "Frank Wilson",
   "idade": 35,
   "relacao": "Merceeiro; mora na Mercearia",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_0_lavrador",
   "nome": "Harry Evans",
   "idade": 23,
   "relacao": "Lavrador; mora no Cottage nº 5",
   "descricao": "Fala baixo e mede a porta antes de responder."
  },
  {
   "id": "gen_7_lavrador",
   "nome": "James Brown",
   "idade": 53,
   "relacao": "Lavrador; mora no Cottage nº 4",
   "descricao": "Responde de olhos no chão, uma palavra por vez."
  },
  {
   "id": "gen_6_lavrador",
   "nome": "John Evans",
   "idade": 15,
   "relacao": "Lavrador; mora no Cottage nº 3",
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
   "descricao": "Manchas roxas do tamanho de polpas de dedo dos dois lados da garganta, e meias-luas de unha impressas na pele.",
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
   "descricao": "As lesões mostram bordas afastadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
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
   "descricao": "Charles Williams esteve com Mary Walker às 01h00 de 14/out, e o declara à ronda. Depois dessa hora, avistamento nenhum consta do registro.",
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
   "descricao": "Na mão fechada da morta, um botão de casaco com fio e um triângulo de pano. O casaco de James Brown perdeu o segundo botão.",
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
   "descricao": "A ordem de despejo do cottage de James Brown veio no rasto de queixa que Mary Walker levou ao senhorio.",
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
   "carimboPadrao": "Dívidas quitadas na mesma semana",
   "descricao": "A caderneta de fiado amanheceu quitada, a soma cheia de uma vez, na mesma semana da nova versão.",
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
   "descricao": "Soberanos novos, contados à vista de todos, em mão que na semana passada comprava fiado. À pergunta de onde vieram, a resposta é sempre o mesmo nome: James Brown.",
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
  },
  {
   "id": "gen_alibi_gen_2_ferreiro",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de Charles Williams",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 1 (madrugada de sábado)",
   "descricao": "\"Recolhi-me ao Cottage nº 1 às oito. Mary Walker me bateu à porta à uma; do batente mesmo nos despedimos, e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_2_ferreiro",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_3_merceeiro",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de Frank Wilson",
   "carimboPadrao": "Paradeiro declarado: A Mercearia (madrugada de sábado)",
   "descricao": "\"Recolhi-me à Mercearia às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_3_merceeiro",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_0_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de Harry Evans",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 5 (madrugada de sábado)",
   "descricao": "\"Recolhi-me ao Cottage nº 5 às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_0_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_7_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de James Brown",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 4 (madrugada de sábado)",
   "descricao": "\"Recolhi-me ao Cottage nº 4 às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_7_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_6_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de John Evans",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 3 (madrugada de sábado)",
   "descricao": "\"Recolhi-me ao Cottage nº 3 às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_6_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
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
    "A morta jaz no chão do cômodo a que a vila chama quartos do sobrado, vestida como andava em casa. O delegado pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ela: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} houver por bem medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Taverna",
   "subtitulo": "Onde Mary Walker foi achada",
   "acoesEspeciais": [],
   "prosa": [
    "A Taverna guarda o dia em que a acharam. No cômodo, cama de ferro, bacia e jarro.",
    "Por abrir desde ontem, a mão fechada da morta: [[gen_pertence]]."
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
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam da morta e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]].",
    "Um a um, ao chamado do delegado, os nomes dos papéis vêm à sala do expediente; a cadeira do interrogado espera de frente para a janela."
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
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua; entre uma casa e outra, um braço de distância."
   ],
   "blocosContingentes": [
    {
     "eventoId": "intf_1",
     "quando": "disparado",
     "paragrafos": [
      "Na volta, o que a primeira visita não viu: [[gen_intf_intf_1_retratacao]] [[gen_intf_intf_1_dividas]] [[gen_intf_intf_1_soberanos]]"
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
 "dialogos": {
  "dialogo_gen_2_ferreiro": {
   "suspeitoId": "gen_2_ferreiro",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Charles Williams",
   "titulo": "Interrogatório — Charles Williams",
   "subtitulo": "Ferreiro, 34 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_visto_vivo": "reacao_gen_visto_vivo"
   },
   "confrontos": [
    {
     "requerCarta": "gen_visto_vivo",
     "rotulo": "[Última Vez com Vida] A que horas, exatamente, viu a vítima com vida?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "Charles Williams entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Serviço parado esfria. Pergunte.\" Ao citar a primeira hora, corrige-a no meio da frase."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha por cima, o tempo de dois fôlegos, e encolhe os ombros. \"Disso não entendo. Pergunte de ferramenta e de serviço, que disso dou conta.\""
     ],
     "opcoes": []
    },
    "reacao_gen_visto_vivo": {
     "fala": [
      "Charles Williams responde sem pedir o termo para ler. \"Declarei à ronda e torno a declarar: vi quem vi, em pé e falando, à hora que dei. Disso não tiro uma linha.\" E deixa que o papel diga o resto."
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_ferreiro]]. Posto contra a parede, alinha as horas com os dedos na tábua da mesa, uma a uma."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não ponho em ninguém. O que declarei à ronda, declarei; palavra dada não se tira.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\" Na despedida, cita a mesma hora de antes, e a hora vem diferente."
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Mary Walker era das que se cumprimentam na rua. O que sei do resto está no livro do guarda, tal e qual.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Do que vi e ouvi já dei conta por termo, com hora. Fora disso, nada tenho que sirva a um inquérito.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala, e fala alto. Eu digo só o que passou pelos meus olhos e ouvidos; o resto morre comigo.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_3_merceeiro": {
   "suspeitoId": "gen_3_merceeiro",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Frank Wilson",
   "titulo": "Interrogatório — Frank Wilson",
   "subtitulo": "Merceeiro, 35 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; Frank Wilson entra e senta-se de chapéu na mão. \"O negócio espera trancado. Pergunte de uma vez, faça o favor.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha o que se lhe mostra como quem confere fatura alheia. \"Isto não passou pelo meu balcão. Do que passou, respondo com o livro na mão.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_merceeiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não tenho que dar. Se Mary Walker tinha desafeto, não foi freguês meu.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_merceeiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Mary Walker? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_merceeiro]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos meus com ela, poucos e pagos. Se há soma pendente em algum livro, o livro que fale.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_merceeiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_0_lavrador": {
   "suspeitoId": "gen_0_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Harry Evans",
   "titulo": "Interrogatório — Harry Evans",
   "subtitulo": "Lavrador, 23 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Harry Evans entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Vim assim que o guarda mandou. Diga lá, que a lida não espera.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_0_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Mary Walker eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_0_lavrador]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Mary Walker? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_0_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_0_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_7_lavrador": {
   "suspeitoId": "gen_7_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar James Brown",
   "titulo": "Interrogatório — James Brown",
   "subtitulo": "Lavrador, 53 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_pertence": "reacao_gen_pertence",
    "gen_intf_intf_1_soberanos": "reacao_gen_intf_intf_1_soberanos"
   },
   "confrontos": [
    {
     "requerCarta": "gen_pertence",
     "rotulo": "[O Pertence Arrancado] Por que o par disto está entre as suas coisas?"
    },
    {
     "requerCarta": "gen_intf_intf_1_soberanos",
     "rotulo": "[Soberanos Novos] Por que soberanos novos, contados à vista de todos?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "James Brown entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"O guarda mandou, eu vim. Pergunte, que o campo não espera.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "reacao_gen_pertence": {
     "fala": [
      "James Brown vira o achado nos dedos uma vez e o pousa. \"Meu, ou do meu feitio; coisa de vestir perde-se onde o dono nem passou. Como foi parar na mão de quem morreu, isso pergunte a quem o pôs lá.\" E o empurra de volta pela mesa, devagar."
     ],
     "opcoes": []
    },
    "reacao_gen_intf_intf_1_soberanos": {
     "fala": [
      "James Brown não conta a moeda de novo. \"Contei-os à vista porque não devia nada a ninguém. Foi paga de serviço, e serviço pago não é crime. O nome de quem pagou, esse fica comigo até a lei o exigir por escrito.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_7_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome nenhum me cabe dar, {detective.title}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_7_lavrador]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Mary Walker era do trato de todos os dias; eu a conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_7_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_7_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_6_lavrador": {
   "suspeitoId": "gen_6_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar John Evans",
   "titulo": "Interrogatório — John Evans",
   "subtitulo": "Lavrador, 15 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "John Evans entra na sala do expediente antes que o delegado acabe de chamar o nome, e toma a palavra junto com a cadeira. \"Vim assim que o guarda mandou. Diga lá, que a lida não espera.\" A voz sai baixa, e cada resposta espera a pergunta acabar por inteiro. Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_6_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Mary Walker eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_6_lavrador]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Mary Walker? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_6_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_6_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Mary Walker. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Mary Walker, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Mary Walker? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  }
 },
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
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio. A caderneta abre na primeira página em branco."
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
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Colbrook. Isto passa do meu ofício, e não fingirei o contrário. Mary Walker, criada desta vila, foi achada morta. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
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
     "A plataforma cheira a carvão e palha molhada. Colbrook estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados.",
     "O delegado Bexley espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Bexley",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Mary Walker, 14 anos, criada. Achada morta na Taverna. Não toquei em nada e não prendi ninguém.\"",
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
    "resposta": "\"Do dia a dia dela? Charles Williams, John Evans — gente que partilhava teto, trabalho ou as mesmas noites. Os nomes estão nos meus papéis.\""
   },
   {
    "id": "desafetos",
    "pergunta": "A morta tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ela não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si.\""
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
   "relacao": "Ferreiro; mora no Cottage nº 2",
   "descricao": "Antes de assinar o termo, corrige nele uma miudeza."
  },
  {
   "id": "gen_3_squire",
   "nome": "Charles Williams",
   "idade": 53,
   "relacao": "Senhor de terras; mora no Solar",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  },
  {
   "id": "gen_7_criada",
   "nome": "Ethel Taylor",
   "idade": 19,
   "relacao": "Criada; mora na Casa do Médico",
   "descricao": "Cita dia e hora como quem lê de um livro de assentos."
  },
  {
   "id": "gen_0_moleiro",
   "nome": "James Brown",
   "idade": 70,
   "relacao": "Moleiro; mora no Moinho",
   "descricao": "Antes de assinar o termo, corrige nele uma miudeza."
  },
  {
   "id": "gen_2_lavrador",
   "nome": "William Evans",
   "idade": 18,
   "relacao": "Lavrador; mora no Cottage nº 4",
   "descricao": "Do serão, lembra a ordem das coisas; das horas, não se prende."
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
   "descricao": "Manchas roxas do tamanho de polpas de dedo dos dois lados da garganta, e meias-luas de unha impressas na pele.",
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
   "descricao": "As lesões mostram bordas afastadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
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
   "descricao": "Charles Jones esteve com Henry Smith às 19h00 de 13/out, e o declara à ronda. Depois dessa hora, avistamento nenhum consta do registro.",
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
   "textoDisplay": "O Rastro de Gotas",
   "carimboPadrao": "Sangue afastado do corpo",
   "descricao": "Gotas redondas, a passos do corpo, espaçadas em fila até a porta. As feridas do morto não sangraram nesse caminho.",
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
   "descricao": "Corre na vila um falatório em nome de Ethel Taylor; quem o repetia, de porta em porta, era Henry Smith.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "escandalo_gravidez",
    "ligadoA": "gen_7_criada"
   }
  },
  {
   "id": "gen_alibi_gen_6_ferreiro",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Charles Jones",
   "carimboPadrao": "Paradeiro declarado: A Taverna (sexta à noite)",
   "descricao": "\"Estive na Taverna das oito às onze; dali fui direto para o Cottage nº 2, dormir.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_6_ferreiro",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_3_squire",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Charles Williams",
   "carimboPadrao": "Paradeiro declarado: O Solar (sexta à noite)",
   "descricao": "\"Recolhi-me ao Solar às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_3_squire",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_7_criada",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Ethel Taylor",
   "carimboPadrao": "Paradeiro declarado: Casa do Médico (sexta à noite)",
   "descricao": "\"Recolhi-me à Casa do Médico às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_7_criada",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_0_moleiro",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de James Brown",
   "carimboPadrao": "Paradeiro declarado: O Moinho (sexta à noite)",
   "descricao": "\"Recolhi-me ao Moinho às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_0_moleiro",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_2_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de William Evans",
   "carimboPadrao": "Paradeiro declarado: A Mercearia (sexta à noite)",
   "descricao": "\"Estive na Mercearia das oito às onze; dali fui direto para o Cottage nº 4, dormir.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_2_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
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
    "O morto jaz no chão do cômodo a que a vila chama taproom, vestido como andava em casa. O delegado pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} houver por bem medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Taverna",
   "subtitulo": "Onde Henry Smith foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Taverna guarda o dia em que o acharam. No cômodo, balcão com beer engine, mesas de taverna; de um canto a outro, nada guarda o seu lugar; há mobília por erguer do chão.",
    "Por abrir desde ontem, a mão fechada do morto: [[gen_pertence]].",
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
    "Entre os papéis recolhidos por precaução: [[gen_motivo]].",
    "Um a um, ao chamado do delegado, os nomes dos papéis vêm à sala do expediente; a cadeira do interrogado espera de frente para a janela."
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
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua; entre uma casa e outra, um braço de distância.",
    "De dentro do próprio prédio, quem dormia parede-meia conta: [[gen_ruido_ouvido]]."
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
 "dialogos": {
  "dialogo_gen_6_ferreiro": {
   "suspeitoId": "gen_6_ferreiro",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Charles Jones",
   "titulo": "Interrogatório — Charles Jones",
   "subtitulo": "Ferreiro, 35 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_visto_vivo": "reacao_gen_visto_vivo",
    "gen_ruido_ouvido": "reacao_gen_ruido_ouvido"
   },
   "confrontos": [
    {
     "requerCarta": "gen_visto_vivo",
     "rotulo": "[Última Vez com Vida] A que horas, exatamente, viu a vítima com vida?"
    },
    {
     "requerCarta": "gen_ruido_ouvido",
     "rotulo": "[O Barulho na Vizinhança] O que exatamente a parede deixou passar naquela hora?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; Charles Jones entra e senta-se de chapéu na mão. \"Deixei serviço pela metade na bancada. Seja {g:direto|direta}, se puder ser.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha por cima, o tempo de dois fôlegos, e encolhe os ombros. \"Disso não entendo. Pergunte de ferramenta e de serviço, que disso dou conta.\""
     ],
     "opcoes": []
    },
    "reacao_gen_visto_vivo": {
     "fala": [
      "Charles Jones responde sem pedir o termo para ler. \"Declarei à ronda e torno a declarar: vi quem vi, em pé e falando, à hora que dei. Disso não tiro uma linha.\" E deixa que o papel diga o resto."
     ],
     "opcoes": []
    },
    "reacao_gen_ruido_ouvido": {
     "fala": [
      "Charles Jones conta de novo, na mesma ordem. \"Pancada primeiro, móvel no chão depois, e mais nada até a manhã. Foi o que ouvi e foi o que declarei. Em barulho eu não ponho nome de gente.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_6_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não ponho em ninguém. O que declarei à ronda, declarei; palavra dada não se tira.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_6_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Henry Smith era dos que se cumprimentam na rua. O que sei do resto está no livro do guarda, tal e qual.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_6_ferreiro]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Do que vi e ouvi já dei conta por termo, com hora. Fora disso, nada tenho que sirva a um inquérito.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_6_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala, e fala alto. Eu digo só o que passou pelos meus olhos e ouvidos; o resto morre comigo.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_3_squire": {
   "suspeitoId": "gen_3_squire",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Charles Williams",
   "titulo": "Interrogatório — Charles Williams",
   "subtitulo": "Senhor de terras, 53 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Charles Williams entra na sala do expediente antes que o delegado acabe de chamar o nome, e toma a palavra junto com a cadeira. \"Vim porque a lei pede, e esta casa atende ao que a lei pede. Diga em que sirvo.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" E emenda, sem pergunta, o frio que fez e o preço do pão."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha o que se lhe mostra o tempo de o reconhecer, e devolve. \"Disso a casa não sabe dar razão. Se há pergunta, faça-a por inteiro.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_3_squire]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nomes não aponto. Desafeto declarado de Henry Smith, não me constou nenhum.\" Levanta-se pelo próprio aviso. \"Se a lei precisar de mais, a casa sabe onde fica.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_3_squire]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Henry Smith? Trato de cumprimento, e pontual no banco da igreja, ao que se via.\" Levanta-se pelo próprio aviso. \"Se a lei precisar de mais, a casa sabe onde fica.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_3_squire]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os de vizinho de terra; nada em papel que um inquérito leia.\" Levanta-se pelo próprio aviso. \"Se a lei precisar de mais, a casa sabe onde fica.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_3_squire]]. No meio do rodeio, a mão pousa na mesa e a fala desacelera, como quem pisa chão conhecido."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz o que sempre disse; desta casa não sai eco.\" Levanta-se pelo próprio aviso. \"Se a lei precisar de mais, a casa sabe onde fica.\" Já na porta, ainda oferece o tempo que fez na sexta e o nome de quem passou tarde pela estrada."
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_7_criada": {
   "suspeitoId": "gen_7_criada",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Ethel Taylor",
   "titulo": "Interrogatório — Ethel Taylor",
   "subtitulo": "Criada, 19 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_pertence": "reacao_gen_pertence"
   },
   "confrontos": [
    {
     "requerCarta": "gen_pertence",
     "rotulo": "[O Pertence Arrancado] Por que o par disto está entre as suas coisas?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "Ethel Taylor entra na sala do expediente antes que o delegado acabe de chamar o nome, e toma a palavra junto com a cadeira. \"Com licença. Digo o que souber, e volto ao serviço.\" A voz sai baixa, e cada resposta espera a pergunta acabar por inteiro. Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha depressa e baixa os olhos. \"Isso eu não sei o que é. Da casa e do serviço respondo; do resto não ponho palavra.\""
     ],
     "opcoes": []
    },
    "reacao_gen_pertence": {
     "fala": [
      "Ethel Taylor vira o achado nos dedos uma vez e o pousa. \"Meu, ou do meu feitio; coisa de vestir perde-se onde o dono nem passou. Como foi parar na mão de quem morreu, isso pergunte a quem o pôs lá.\" E o empurra de volta pela mesa, devagar."
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_7_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome nenhum me cabe dar, {detective.title}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_7_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Henry Smith era do trato de todos os dias; eu o conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_7_criada]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_7_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_0_moleiro": {
   "suspeitoId": "gen_0_moleiro",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar James Brown",
   "titulo": "Interrogatório — James Brown",
   "subtitulo": "Moleiro, 70 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; James Brown entra e senta-se de chapéu na mão. \"O negócio espera trancado. Pergunte de uma vez, faça o favor.\" Acrescenta, antes da primeira pergunta: \"Na minha idade responde-se uma vez, e certo.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha o que se lhe mostra como quem confere fatura alheia. \"Isto não passou pelo meu balcão. Do que passou, respondo com o livro na mão.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_0_moleiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não tenho que dar. Se Henry Smith tinha desafeto, não foi freguês meu.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_0_moleiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Henry Smith? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_0_moleiro]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos meus com ele, poucos e pagos. Se há soma pendente em algum livro, o livro que fale.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_0_moleiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_2_lavrador": {
   "suspeitoId": "gen_2_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar William Evans",
   "titulo": "Interrogatório — William Evans",
   "subtitulo": "Lavrador, 18 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "William Evans entra na sala do expediente antes que o delegado acabe de chamar o nome, e toma a palavra junto com a cadeira. \"O guarda mandou, eu vim. Pergunte, que o campo não espera.\" A voz sai baixa, e cada resposta espera a pergunta acabar por inteiro. Ao citar a primeira hora, corrige-a no meio da frase."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_lavrador]]. Posto contra a parede, alinha as horas com os dedos na tábua da mesa, uma a uma."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Henry Smith eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Na despedida, cita a mesma hora de antes, e a hora vem diferente."
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Henry Smith? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Henry Smith. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Henry Smith, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Henry Smith? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  }
 },
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
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio. A caderneta abre na primeira página em branco."
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
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Dunmere. Isto passa do meu ofício, e não fingirei o contrário. Henry Smith, ferreiro desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
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
     "A plataforma cheira a carvão e palha molhada. Dunmere estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados.",
     "O delegado Quill espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Quill",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Henry Smith, 29 anos, ferreiro. Achado morto na Taverna. Não toquei em nada e não prendi ninguém.\"",
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
    "resposta": "\"Do dia a dia dele? Charles Jones — gente que partilhava teto, trabalho ou as mesmas noites. Os nomes estão nos meus papéis.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si.\""
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
   "relacao": "Criada; mora na Casa do Médico",
   "descricao": "Cita dia e hora como quem lê de um livro de assentos."
  },
  {
   "id": "gen_4_costureira",
   "nome": "Edith Taylor",
   "idade": 27,
   "relacao": "Costureira; mora no Cottage nº 4",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_2_lavadeira",
   "nome": "Elizabeth Smith",
   "idade": 70,
   "relacao": "Lavadeira; mora no Cottage nº 3",
   "descricao": "Do serão, lembra a ordem das coisas; das horas, não se prende."
  },
  {
   "id": "gen_3_paroco",
   "nome": "John Thomas",
   "idade": 56,
   "relacao": "Pároco; mora no Presbitério",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_1_lavrador",
   "nome": "Joseph Thomas",
   "idade": 36,
   "relacao": "Lavrador; mora no Cottage nº 2",
   "descricao": "Mede a noite por sinos e canecas, nunca pelo relógio."
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
   "descricao": "As lesões mostram bordas afastadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
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
   "descricao": "Do registro da ronda consta Thomas Roberts com vida às 11h00 de 13/out; depois dessa hora, linha nenhuma torna a nomeá-lo.",
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
   "descricao": "Ficou no chão, ao alcance do corpo. O feitio casa com a lesão do morto, e a vila dá o dono pelo nome: Joseph Thomas.",
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
   "textoDisplay": "O Rastro de Gotas",
   "carimboPadrao": "Sangue afastado do corpo",
   "descricao": "Gotas redondas, a passos do corpo, espaçadas em fila até a porta. As feridas do morto não sangraram nesse caminho.",
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
   "descricao": "Impressas em sangue, meias-solas do mesmo par, as pontas voltadas para a porta; entre uma e outra, um passo largo.",
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
  },
  {
   "id": "gen_alibi_gen_0_criada",
   "localidade": "delegacia",
   "textoDisplay": "A Tarde de Alice Taylor",
   "carimboPadrao": "Paradeiro declarado: Casa do Médico (sexta à tarde)",
   "descricao": "\"Do meio-dia às seis estive em casa, na Casa do Médico, e de porta para fora não pus o pé.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_0_criada",
    "horaInicioDeclarada": -12,
    "horaFimDeclarada": -6,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_4_costureira",
   "localidade": "delegacia",
   "textoDisplay": "A Tarde de Edith Taylor",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 4 (sexta à tarde)",
   "descricao": "\"Do meio-dia às seis estive em casa, no Cottage nº 4, e de porta para fora não pus o pé.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_4_costureira",
    "horaInicioDeclarada": -12,
    "horaFimDeclarada": -6,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_2_lavadeira",
   "localidade": "delegacia",
   "textoDisplay": "A Tarde de Elizabeth Smith",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 3 (sexta à tarde)",
   "descricao": "\"Do meio-dia às seis estive em casa, no Cottage nº 3, e de porta para fora não pus o pé.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_2_lavadeira",
    "horaInicioDeclarada": -12,
    "horaFimDeclarada": -6,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_3_paroco",
   "localidade": "delegacia",
   "textoDisplay": "A Tarde de John Thomas",
   "carimboPadrao": "Paradeiro declarado: A Igreja (sexta à tarde)",
   "descricao": "\"Do meio-dia às seis estive na Igreja, no serviço. Quem lá esteve me viu.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_3_paroco",
    "horaInicioDeclarada": -12,
    "horaFimDeclarada": -6,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_1_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Tarde de Joseph Thomas",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 2 (sexta à tarde)",
   "descricao": "\"Do meio-dia às seis estive em casa, no Cottage nº 2, e de porta para fora não pus o pé.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_1_lavrador",
    "horaInicioDeclarada": -12,
    "horaFimDeclarada": -6,
    "corroborado": false
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
    "O morto jaz no chão do cômodo a que a vila chama cozinha da granja, vestido como andava em casa. O delegado pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ele: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} houver por bem medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Granja",
   "subtitulo": "Onde Thomas Roberts foi achado",
   "acoesEspeciais": [],
   "prosa": [
    "A Granja guarda o dia em que o acharam. No cômodo, tapete de retalhos, o relógio da família, fogão de ferro a carvão; de um canto a outro, nada guarda o seu lugar; há mobília por erguer do chão.",
    "Junto do corpo, no chão: [[gen_instrumento]].",
    "A passos do corpo, fora do caminho dele: [[gen_sangue_alheio]]."
   ],
   "blocosContingentes": [
    {
     "eventoId": "intf_1",
     "quando": "disparado",
     "paragrafos": [
      "Na volta, o que a primeira visita não viu: [[gen_intf_intf_1_limpeza]] [[gen_intf_intf_1_meia_obra]]"
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
    "Entre os papéis recolhidos por precaução: [[gen_motivo]].",
    "Um a um, ao chamado do delegado, os nomes dos papéis vêm à sala do expediente; a cadeira do interrogado espera de frente para a janela."
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
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua; entre uma casa e outra, um braço de distância."
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
 "dialogos": {
  "dialogo_gen_0_criada": {
   "suspeitoId": "gen_0_criada",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Alice Taylor",
   "titulo": "Interrogatório — Alice Taylor",
   "subtitulo": "Criada, 15 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Alice Taylor entra na sala do expediente antes que o delegado acabe de chamar o nome, e toma a palavra junto com a cadeira. \"Com licença. Digo o que souber, e volto ao serviço.\" A voz sai baixa, e cada resposta espera a pergunta acabar por inteiro. Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à tarde? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à tarde, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à tarde: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"A que horas larga o serviço?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha depressa e baixa os olhos. \"Isso eu não sei o que é. Da casa e do serviço respondo; do resto não ponho palavra.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_0_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Thomas Roberts eu não conhecia.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à tarde vem contada do princípio, e as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_0_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Thomas Roberts? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_0_criada]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Quando a luz acaba.\" E a sexta à tarde acaba saindo por inteiro, enquanto as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_0_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_4_costureira": {
   "suspeitoId": "gen_4_costureira",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Edith Taylor",
   "titulo": "Interrogatório — Edith Taylor",
   "subtitulo": "Costureira, 27 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Edith Taylor entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Deixei serviço pela metade na bancada. Seja {g:direto|direta}, se puder ser.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à tarde? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à tarde, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à tarde: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"A que horas larga o serviço?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha por cima, o tempo de dois fôlegos, e encolhe os ombros. \"Disso não entendo. Pergunte de ferramenta e de serviço, que disso dou conta.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_4_costureira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não tenho que dar. Se Thomas Roberts tinha desafeto, não foi freguês meu.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à tarde vem contada do princípio, e as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_4_costureira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Thomas Roberts? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_4_costureira]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos meus com ele, poucos e pagos. Se há soma pendente em algum livro, o livro que fale.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Quando a luz acaba.\" E a sexta à tarde acaba saindo por inteiro, enquanto as horas saem em fila, sem que ela procure nenhuma: [[gen_alibi_gen_4_costureira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_2_lavadeira": {
   "suspeitoId": "gen_2_lavadeira",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Elizabeth Smith",
   "titulo": "Interrogatório — Elizabeth Smith",
   "subtitulo": "Lavadeira, 70 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Elizabeth Smith entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Com licença de entrar. Respondo o que souber.\" Acrescenta, antes da primeira pergunta: \"Na minha idade responde-se uma vez, e certo.\" Ao citar a primeira hora, corrige-a no meio da frase."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à tarde? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à tarde, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à tarde: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"A que horas larga o serviço?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha depressa e baixa os olhos. \"Isso eu não sei o que é. Da casa e do serviço respondo; do resto não ponho palavra.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem fora de ordem, e ela as corrige no meio: [[gen_alibi_gen_2_lavadeira]]. Posto contra a parede, alinha as horas com os dedos na tábua da mesa, uma a uma."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Thomas Roberts eu não conhecia.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\" Na despedida, cita a mesma hora de antes, e a hora vem diferente."
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à tarde vem contada do princípio, e as horas saem fora de ordem, e ela as corrige no meio: [[gen_alibi_gen_2_lavadeira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Thomas Roberts? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem fora de ordem, e ela as corrige no meio: [[gen_alibi_gen_2_lavadeira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Quando a luz acaba.\" E a sexta à tarde acaba saindo por inteiro, enquanto as horas saem fora de ordem, e ela as corrige no meio: [[gen_alibi_gen_2_lavadeira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_3_paroco": {
   "suspeitoId": "gen_3_paroco",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar John Thomas",
   "titulo": "Interrogatório — John Thomas",
   "subtitulo": "Pároco, 56 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "John Thomas entra na sala do expediente antes que o delegado acabe de chamar o nome, e toma a palavra junto com a cadeira. \"A paróquia está às ordens do inquérito. Pergunte.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à tarde? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à tarde, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à tarde: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"A que horas larga o serviço?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Examina o que se lhe apresenta e o devolve com as duas mãos. \"Disso não sei dar testemunho. Pergunte do rebanho, que do rebanho respondo.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_paroco]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nomes não aponto. Desafeto declarado de Thomas Roberts, não me constou nenhum.\" Ergue-se e alisa a sobrecasaca. \"A paróquia fica às ordens.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à tarde vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_paroco]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Thomas Roberts? Trato de cumprimento, e pontual no banco da igreja, ao que se via.\" Ergue-se e alisa a sobrecasaca. \"A paróquia fica às ordens.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_paroco]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os de vizinho de terra; nada em papel que um inquérito leia.\" Ergue-se e alisa a sobrecasaca. \"A paróquia fica às ordens.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Quando a luz acaba.\" E a sexta à tarde acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_3_paroco]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz o que sempre disse; desta casa não sai eco.\" Ergue-se e alisa a sobrecasaca. \"A paróquia fica às ordens.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_1_lavrador": {
   "suspeitoId": "gen_1_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Joseph Thomas",
   "titulo": "Interrogatório — Joseph Thomas",
   "subtitulo": "Lavrador, 36 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_instrumento": "reacao_gen_instrumento"
   },
   "confrontos": [
    {
     "requerCarta": "gen_instrumento",
     "rotulo": "[O Instrumento Abandonado] Por que o instrumento achado junto do corpo tem o seu nome na vila?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "Joseph Thomas entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"O guarda mandou, eu vim. Pergunte, que o campo não espera.\" Ao citar a primeira hora, corrige-a no meio da frase."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à tarde? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à tarde, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à tarde: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"A que horas larga o serviço?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "reacao_gen_instrumento": {
     "fala": [
      "Joseph Thomas olha a peça sem estender a mão. \"Do meu uso, quem o nega. Perde-se ferramenta como se perde chapéu, e quem a levou não ma pediu. Onde a acharam, não fui eu que a pus.\" A voz não muda do começo ao fim."
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_1_lavrador]]. Posto contra a parede, alinha as horas com os dedos na tábua da mesa, uma a uma."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome nenhum me cabe dar, {detective.title}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Na despedida, torna a citar a hora, devagar, como quem a confere pela primeira vez."
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à tarde vem contada do princípio, e as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_1_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Thomas Roberts era do trato de todos os dias; eu o conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_1_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Quando a luz acaba.\" E a sexta à tarde acaba saindo por inteiro, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_1_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Thomas Roberts. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que homem era Thomas Roberts, para quem lidava com ele todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Thomas Roberts? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  }
 },
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
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio. A caderneta abre na primeira página em branco."
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
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Wrenfield. Isto passa do meu ofício, e não fingirei o contrário. Thomas Roberts, lavrador desta vila, foi achado morto. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
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
     "A plataforma cheira a carvão e palha molhada. Wrenfield estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados.",
     "O delegado Harrow espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Harrow",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Thomas Roberts, 32 anos, lavrador. Achado morto na Granja. Não toquei em nada e não prendi ninguém.\"",
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
    "resposta": "\"Do dia a dia dele? Joseph Thomas — gente que partilhava teto, trabalho ou as mesmas noites. Os nomes estão nos meus papéis.\""
   },
   {
    "id": "desafetos",
    "pergunta": "O morto tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ele não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si.\""
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
   "relacao": "Ferreiro; mora no Cottage nº 2",
   "descricao": "Mede a noite por sinos e canecas, nunca pelo relógio."
  },
  {
   "id": "gen_1_medico",
   "nome": "George Williams",
   "idade": 48,
   "relacao": "Médico rural; mora na Casa do Médico",
   "descricao": "Dá horas e quantias de um fôlego, sem procurá-las."
  },
  {
   "id": "gen_0_criada",
   "nome": "Rose Wilson",
   "idade": 42,
   "relacao": "Criada; mora na Taverna",
   "descricao": "Responde de olhos no chão, uma palavra por vez."
  },
  {
   "id": "gen_2_lavrador",
   "nome": "Walter Walker",
   "idade": 32,
   "relacao": "Lavrador; mora no Cottage nº 1",
   "descricao": "Mede a noite por sinos e canecas, nunca pelo relógio."
  },
  {
   "id": "gen_4_lavrador",
   "nome": "William Brown",
   "idade": 14,
   "relacao": "Lavrador; mora no Cottage nº 3",
   "descricao": "Responde de olhos no chão, uma palavra por vez."
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
      "posicaoCompativel": false
     }
    },
    {
     "ipmAte": null,
     "textoDisplay": "Manchas Fixas",
     "carimboPadrao": "Manchas fixas, sem empalidecer",
     "descricao": "As manchas de sangue assentado já não cedem ao polegar: fixaram-se onde o corpo repousou. As manchas assentaram do lado que ora fica para cima.",
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
   "descricao": "Um vinco uniforme corre horizontal em volta do pescoço, na mesma profundidade de ponta a ponta, sem subir rumo à nuca.",
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
   "descricao": "As lesões mostram bordas afastadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
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
   "descricao": "Do registro da ronda consta Rose Evans com vida às 21h00 de 13/out; depois dessa hora, linha nenhuma torna a nomeá-la.",
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
   "descricao": "Ficou no chão, ao alcance do corpo. O feitio casa com a lesão da morta, e a vila dá o dono pelo nome: George Williams.",
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
   "textoDisplay": "O Rastro de Gotas",
   "carimboPadrao": "Sangue afastado do corpo",
   "descricao": "Gotas redondas, a passos do corpo, espaçadas em fila até a porta. As feridas da morta não sangraram nesse caminho.",
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
   "descricao": "Uma caderneta de dívidas soma o que George Williams deve a Rose Evans, vencido e cobrado por carta.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "divida_caderneta",
    "ligadoA": "gen_1_medico"
   }
  },
  {
   "id": "gen_alibi_gen_3_ferreiro",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Charles Evans",
   "carimboPadrao": "Paradeiro declarado: A Taverna (sexta à noite)",
   "descricao": "\"Estive na Taverna das oito às onze; dali fui direto para o Cottage nº 2, dormir.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_3_ferreiro",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_1_medico",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de George Williams",
   "carimboPadrao": "Paradeiro declarado: Casa do Médico (sexta à noite)",
   "descricao": "\"Recolhi-me à Casa do Médico às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_1_medico",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_0_criada",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Rose Wilson",
   "carimboPadrao": "Paradeiro declarado: A Taverna (sexta à noite)",
   "descricao": "\"Recolhi-me à Taverna às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_0_criada",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_2_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Walter Walker",
   "carimboPadrao": "Paradeiro declarado: A Taverna (sexta à noite)",
   "descricao": "\"Estive na Taverna das oito às onze; dali fui direto para o Cottage nº 1, dormir.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_2_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_4_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de William Brown",
   "carimboPadrao": "Paradeiro declarado: A Taverna (sexta à noite)",
   "descricao": "\"Estive na Taverna das oito às onze; dali fui direto para o Cottage nº 3, dormir.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_4_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
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
    "A morta jaz no chão do cômodo a que a vila chama cozinha, vestida como andava em casa. O delegado pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ela: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} houver por bem medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — Casa do Médico",
   "subtitulo": "Onde Rose Evans foi achada",
   "acoesEspeciais": [],
   "prosa": [
    "A Casa do Médico guarda o dia em que a acharam. No cômodo, fogão de ferro a carvão, mesa de cozinha; de um canto a outro, nada guarda o seu lugar; há mobília por erguer do chão.",
    "Junto do corpo, no chão: [[gen_instrumento]].",
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
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam da morta e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]].",
    "Um a um, ao chamado do delegado, os nomes dos papéis vêm à sala do expediente; a cadeira do interrogado espera de frente para a janela."
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
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua; entre uma casa e outra, um braço de distância."
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
 "dialogos": {
  "dialogo_gen_3_ferreiro": {
   "suspeitoId": "gen_3_ferreiro",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Charles Evans",
   "titulo": "Interrogatório — Charles Evans",
   "subtitulo": "Ferreiro, 44 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Charles Evans entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Serviço parado esfria. Pergunte.\" Ao citar a primeira hora, corrige-a no meio da frase."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha por cima, o tempo de dois fôlegos, e encolhe os ombros. \"Disso não entendo. Pergunte de ferramenta e de serviço, que disso dou conta.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_3_ferreiro]]. Posto contra a parede, alinha as horas com os dedos na tábua da mesa, uma a uma."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não tenho que dar. Se Rose Evans tinha desafeto, não foi freguês meu.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\" Na despedida, cita a mesma hora de antes, e a hora vem diferente."
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_3_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Rose Evans? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_3_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos meus com ela, poucos e pagos. Se há soma pendente em algum livro, o livro que fale.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_3_ferreiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_1_medico": {
   "suspeitoId": "gen_1_medico",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar George Williams",
   "titulo": "Interrogatório — George Williams",
   "subtitulo": "Médico rural, 48 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_instrumento": "reacao_gen_instrumento"
   },
   "confrontos": [
    {
     "requerCarta": "gen_instrumento",
     "rotulo": "[O Instrumento Abandonado] Por que o instrumento achado junto do corpo tem o seu nome na vila?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "George Williams entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Tenho a manhã tomada, {detective.title}, mas isto passa à frente de tudo. Ao seu dispor.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" Traz as datas prontas, como quem chega com a caderneta escrita."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Corre os olhos pelo que se lhe mostra e o devolve. \"Fora do meu ofício, não arrisco palavra. Pergunte do que é meu.\""
     ],
     "opcoes": []
    },
    "reacao_gen_instrumento": {
     "fala": [
      "George Williams olha a peça sem estender a mão. \"Do meu uso, quem o nega. Perde-se ferramenta como se perde chapéu, e quem a levou não ma pediu. Onde a acharam, não fui eu que a pus.\" A voz não muda do começo ao fim."
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_medico]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome nenhum me cabe dar, {detective.title}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora.\" Toma o chapéu. \"O inquérito sabe onde me encontrar.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_medico]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Rose Evans era do trato de todos os dias; eu a conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo.\" Toma o chapéu. \"O inquérito sabe onde me encontrar.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_medico]]. E acrescenta, por conta própria, o que ninguém pediu: o tempo que fazia àquela hora."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta.\" Toma o chapéu. \"O inquérito sabe onde me encontrar.\" Já de pé, corrige uma miudeza da própria resposta, para que o termo fique exato."
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem em fila, sem que ele procure nenhuma: [[gen_alibi_gen_1_medico]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo.\" Toma o chapéu. \"O inquérito sabe onde me encontrar.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_0_criada": {
   "suspeitoId": "gen_0_criada",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Rose Wilson",
   "titulo": "Interrogatório — Rose Wilson",
   "subtitulo": "Criada, 42 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; Rose Wilson entra, senta-se e ajeita as fitas da touca. \"Com licença de entrar. Respondo o que souber.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha depressa e baixa os olhos. \"Isso eu não sei o que é. Da casa e do serviço respondo; do resto não ponho palavra.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_0_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Rose Evans eu não conhecia.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_0_criada]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Rose Evans? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_0_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_0_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_2_lavrador": {
   "suspeitoId": "gen_2_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Walter Walker",
   "titulo": "Interrogatório — Walter Walker",
   "subtitulo": "Lavrador, 32 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; Walter Walker entra e senta-se de chapéu na mão. \"O guarda mandou, eu vim. Pergunte, que o campo não espera.\" Ao citar a primeira hora, corrige-a no meio da frase."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_lavrador]]. Posto contra a parede, alinha as horas com os dedos na tábua da mesa, uma a uma."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Rose Evans eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Na despedida, cita a mesma hora de antes, e a hora vem diferente."
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Rose Evans? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_4_lavrador": {
   "suspeitoId": "gen_4_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar William Brown",
   "titulo": "Interrogatório — William Brown",
   "subtitulo": "Lavrador, 14 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; William Brown entra e senta-se de chapéu na mão. \"O guarda mandou, eu vim. Pergunte, que o campo não espera.\" A voz sai baixa, e cada resposta espera a pergunta acabar por inteiro. Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Rose Evans eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_lavrador]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Rose Evans? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Rose Evans. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Rose Evans, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Rose Evans? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  }
 },
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
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio. A caderneta abre na primeira página em branco."
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
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Marlow Green. Isto passa do meu ofício, e não fingirei o contrário. Rose Evans, criada desta vila, foi achada morta. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
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
     "A plataforma cheira a carvão e palha molhada. Marlow Green estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados.",
     "O delegado Fenwick espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Fenwick",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Rose Evans, 17 anos, criada. Achada morta na Casa do Médico. Não toquei em nada e não prendi ninguém.\"",
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
    "resposta": "\"Do dia a dia dela? George Williams — gente que partilhava teto, trabalho ou as mesmas noites. Os nomes estão nos meus papéis.\""
   },
   {
    "id": "desafetos",
    "pergunta": "A morta tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ela não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si.\""
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
   "relacao": "Alfaiate; mora no Cottage nº 4",
   "descricao": "Começa pela resposta e acaba na vida alheia."
  },
  {
   "id": "gen_5_criada",
   "nome": "Emily Brown",
   "idade": 24,
   "relacao": "Criada; mora na Taverna",
   "descricao": "Responde de olhos no chão, uma palavra por vez."
  },
  {
   "id": "gen_1_taverneiro",
   "nome": "Frederick Wilson",
   "idade": 30,
   "relacao": "Taverneiro; mora na Taverna",
   "descricao": "Responde o perguntado e emenda três coisas que ninguém perguntou."
  },
  {
   "id": "gen_2_lavrador",
   "nome": "Joseph Roberts",
   "idade": 59,
   "relacao": "Lavrador; mora no Cottage nº 2",
   "descricao": "Não há pergunta curta que devolva curta."
  },
  {
   "id": "gen_3_lavrador",
   "nome": "Thomas Jones",
   "idade": 43,
   "relacao": "Lavrador; mora no Cottage nº 3",
   "descricao": "Começa pela resposta e acaba na vida alheia."
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
   "descricao": "As lesões mostram bordas afastadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
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
   "descricao": "Do registro da ronda consta Emily Williams com vida às 01h00 de 14/out; depois dessa hora, linha nenhuma torna a nomeá-la.",
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
   "descricao": "Ficou no chão, ao alcance do corpo. O feitio casa com a lesão da morta, e a vila dá o dono pelo nome: Thomas Jones.",
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
   "descricao": "Impressas em sangue, meias-solas do mesmo par, as pontas voltadas para a porta; entre uma e outra, um passo largo.",
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
   "descricao": "A ordem de despejo do cottage de Thomas Jones veio no rasto de queixa que Emily Williams levou ao senhorio.",
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
  },
  {
   "id": "gen_alibi_gen_4_costureira",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de Arthur Evans",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 4 (madrugada de sábado)",
   "descricao": "\"Recolhi-me ao Cottage nº 4 às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_4_costureira",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_5_criada",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de Emily Brown",
   "carimboPadrao": "Paradeiro declarado: A Taverna (madrugada de sábado)",
   "descricao": "\"Recolhi-me à Taverna às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_5_criada",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_1_taverneiro",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de Frederick Wilson",
   "carimboPadrao": "Paradeiro declarado: A Taverna (madrugada de sábado)",
   "descricao": "\"Recolhi-me à Taverna às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_1_taverneiro",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_2_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de Joseph Roberts",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 2 (madrugada de sábado)",
   "descricao": "\"Recolhi-me ao Cottage nº 2 às oito e não tornei a sair antes de clarear.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_2_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_3_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Madrugada de Thomas Jones",
   "carimboPadrao": "Paradeiro declarado: Cottage nº 3 (madrugada de sábado)",
   "descricao": "\"Recolhi-me ao Cottage nº 3 às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_3_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — A Escola",
   "subtitulo": "Emily Williams, mestra-escola, 25 anos",
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
    "A morta jaz no chão do cômodo a que a vila chama quarto, vestida como andava em casa. O delegado pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ela: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} houver por bem medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Escola",
   "subtitulo": "Onde Emily Williams foi achada",
   "acoesEspeciais": [],
   "prosa": [
    "A Escola guarda o dia em que a acharam. No cômodo, cama de armação de madeira, lavatório com bacia; de um canto a outro, nada guarda o seu lugar; há mobília por erguer do chão.",
    "Junto do corpo, no chão: [[gen_instrumento]]."
   ],
   "blocosContingentes": [
    {
     "eventoId": "intf_1",
     "quando": "disparado",
     "paragrafos": [
      "Na volta, o que a primeira visita não viu: [[gen_intf_intf_1_limpeza]] [[gen_intf_intf_1_meia_obra]]"
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
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam da morta e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]].",
    "Um a um, ao chamado do delegado, os nomes dos papéis vêm à sala do expediente; a cadeira do interrogado espera de frente para a janela."
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
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua; entre uma casa e outra, um braço de distância."
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
 "dialogos": {
  "dialogo_gen_4_costureira": {
   "suspeitoId": "gen_4_costureira",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Arthur Evans",
   "titulo": "Interrogatório — Arthur Evans",
   "subtitulo": "Alfaiate, 33 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Arthur Evans entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Deixei serviço pela metade na bancada. Seja {g:direto|direta}, se puder ser.\" E emenda, sem pergunta, o frio que fez e o preço do pão."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha por cima, o tempo de dois fôlegos, e encolhe os ombros. \"Disso não entendo. Pergunte de ferramenta e de serviço, que disso dou conta.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_4_costureira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não tenho que dar. Se Emily Williams tinha desafeto, não foi freguês meu.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_4_costureira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Emily Williams? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_4_costureira]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos meus com ela, poucos e pagos. Se há soma pendente em algum livro, o livro que fale.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_4_costureira]]. No meio do rodeio, a mão pousa na mesa e a fala desacelera, como quem pisa chão conhecido."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê.\" Levanta-se sem esperar licença. \"O serviço ficou aceso.\" Já na porta, ainda oferece o tempo que fez na sexta e o nome de quem passou tarde pela estrada."
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_5_criada": {
   "suspeitoId": "gen_5_criada",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Emily Brown",
   "titulo": "Interrogatório — Emily Brown",
   "subtitulo": "Criada, 24 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; Emily Brown entra, senta-se e ajeita as fitas da touca. \"Com licença de entrar. Respondo o que souber.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha depressa e baixa os olhos. \"Isso eu não sei o que é. Da casa e do serviço respondo; do resto não ponho palavra.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Emily Williams eu não conhecia.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_criada]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Emily Williams? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_criada]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se e alisa o avental. \"Com licença, que a casa não para.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_1_taverneiro": {
   "suspeitoId": "gen_1_taverneiro",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Frederick Wilson",
   "titulo": "Interrogatório — Frederick Wilson",
   "subtitulo": "Taverneiro, 30 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; Frederick Wilson entra e senta-se de chapéu na mão. \"O negócio espera trancado. Pergunte de uma vez, faça o favor.\" E emenda, sem pergunta, o frio que fez e o preço do pão."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha o que se lhe mostra como quem confere fatura alheia. \"Isto não passou pelo meu balcão. Do que passou, respondo com o livro na mão.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_1_taverneiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não tenho que dar. Se Emily Williams tinha desafeto, não foi freguês meu.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_1_taverneiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Emily Williams? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_1_taverneiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos meus com ela, poucos e pagos. Se há soma pendente em algum livro, o livro que fale.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_1_taverneiro]]. No meio do rodeio, a mão pousa na mesa e a fala desacelera, como quem pisa chão conhecido."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê.\" Levanta-se e abotoa o casaco. \"O negócio não se guarda sozinho.\" Já na porta, ainda oferece o tempo que fez na sexta e o nome de quem passou tarde pela estrada."
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_2_lavrador": {
   "suspeitoId": "gen_2_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Joseph Roberts",
   "titulo": "Interrogatório — Joseph Roberts",
   "subtitulo": "Lavrador, 59 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Joseph Roberts entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Vim assim que o guarda mandou. Diga lá, que a lida não espera.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" E emenda, sem pergunta, o frio que fez e o preço do pão."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Emily Williams eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Emily Williams? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_lavrador]]. No meio do rodeio, a mão pousa na mesa e a fala desacelera, como quem pisa chão conhecido."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Já na porta, ainda oferece o tempo que fez na sexta e o nome de quem passou tarde pela estrada."
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_3_lavrador": {
   "suspeitoId": "gen_3_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Thomas Jones",
   "titulo": "Interrogatório — Thomas Jones",
   "subtitulo": "Lavrador, 43 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_instrumento": "reacao_gen_instrumento"
   },
   "confrontos": [
    {
     "requerCarta": "gen_instrumento",
     "rotulo": "[O Instrumento Abandonado] Por que o instrumento achado junto do corpo tem o seu nome na vila?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; Thomas Jones entra e senta-se de chapéu na mão. \"O guarda mandou, eu vim. Pergunte, que o campo não espera.\" E emenda, sem pergunta, o frio que fez e o preço do pão."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na madrugada de sábado? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua madrugada de sábado, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na madrugada de sábado: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Tem o sono pesado?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "reacao_gen_instrumento": {
     "fala": [
      "Thomas Jones olha a peça sem estender a mão. \"Do meu uso, quem o nega. Perde-se ferramenta como se perde chapéu, e quem a levou não ma pediu. Onde a acharam, não fui eu que a pus.\" A voz não muda do começo ao fim."
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_3_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome nenhum me cabe dar, {detective.title}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A madrugada de sábado vem contada do princípio, e a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_3_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Emily Williams era do trato de todos os dias; eu a conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_3_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Pesado o bastante.\" E a madrugada de sábado acaba saindo por inteiro, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_3_lavrador]]. No meio do rodeio, a mão pousa na mesa e a fala desacelera, como quem pisa chão conhecido."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Emily Williams. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Emily Williams, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Emily Williams? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Já na porta, ainda oferece o tempo que fez na sexta e o nome de quem passou tarde pela estrada."
     ],
     "opcoes": []
    }
   }
  }
 },
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
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio. A caderneta abre na primeira página em branco."
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
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Aldergate. Isto passa do meu ofício, e não fingirei o contrário. Emily Williams, mestra-escola desta vila, foi achada morta. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
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
     "A plataforma cheira a carvão e palha molhada. Aldergate estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados.",
     "O delegado Roderick espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Roderick",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Emily Williams, 25 anos, mestra-escola. Achada morta na Escola. Não toquei em nada e não prendi ninguém.\"",
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
    "resposta": "\"Mulher de poucas companhias. O que houver, a vila sabe antes de mim.\""
   },
   {
    "id": "desafetos",
    "pergunta": "A morta tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ela não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si.\""
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
   "relacao": "Taverneira; mora na Taverna",
   "descricao": "Começa pela resposta e acaba na vida alheia."
  },
  {
   "id": "gen_0_lavrador",
   "nome": "James Thomas",
   "idade": 28,
   "relacao": "Lavrador; mora no Cottage nº 5",
   "descricao": "Do serão, lembra a ordem das coisas; das horas, não se prende."
  },
  {
   "id": "gen_3_lavrador",
   "nome": "Joseph Roberts",
   "idade": 25,
   "relacao": "Lavrador; mora no Cottage nº 1",
   "descricao": "Responde de olhos no chão, uma palavra por vez."
  },
  {
   "id": "gen_5_lavrador",
   "nome": "William Taylor",
   "idade": 52,
   "relacao": "Lavrador; mora no Cottage nº 3",
   "descricao": "Espera a pergunta acabar de todo antes de abrir a boca."
  },
  {
   "id": "gen_4_lavrador",
   "nome": "William Wilson",
   "idade": 36,
   "relacao": "Lavrador; mora no Cottage nº 2",
   "descricao": "Espera a pergunta acabar de todo antes de abrir a boca."
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
   "descricao": "Um vinco uniforme corre horizontal em volta do pescoço, na mesma profundidade de ponta a ponta, sem subir rumo à nuca.",
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
   "descricao": "As lesões mostram bordas afastadas e sangue coagulado por dentro: o coração ainda batia quando as recebeu.",
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
   "descricao": "Do registro da ronda consta Edith Taylor com vida às 21h00 de 13/out; depois dessa hora, linha nenhuma torna a nomeá-la.",
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
   "descricao": "Ficou no chão, ao alcance do corpo. O feitio casa com a lesão da morta, e a vila dá o dono pelo nome: William Taylor.",
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
   "descricao": "Uma caderneta de dívidas soma o que William Taylor deve a Edith Taylor, vencido e cobrado por carta.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "motivo",
    "motivo": "divida_caderneta",
    "ligadoA": "gen_5_lavrador"
   }
  },
  {
   "id": "gen_alibi_gen_2_taverneiro",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Alice Jones",
   "carimboPadrao": "Paradeiro declarado: A Taverna (sexta à noite)",
   "descricao": "\"Recolhi-me à Taverna às oito e não tornei a sair antes de clarear.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_2_taverneiro",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_0_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de James Thomas",
   "carimboPadrao": "Paradeiro declarado: A Taverna (sexta à noite)",
   "descricao": "\"Estive na Taverna das oito às onze; dali fui direto para o Cottage nº 5, dormir.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_0_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_3_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de Joseph Roberts",
   "carimboPadrao": "Paradeiro declarado: A Igreja (sexta à noite)",
   "descricao": "\"Estive na Igreja das oito às onze; dali fui direto para o Cottage nº 1, dormir.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_3_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_5_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de William Taylor",
   "carimboPadrao": "Paradeiro declarado: A Mercearia (sexta à noite)",
   "descricao": "\"Estive na Mercearia das oito às onze; dali fui direto para o Cottage nº 3, dormir.\" Tomado por termo na delegacia, pela mão do guarda.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_5_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  },
  {
   "id": "gen_alibi_gen_4_lavrador",
   "localidade": "delegacia",
   "textoDisplay": "A Noite de William Wilson",
   "carimboPadrao": "Paradeiro declarado: A Igreja (sexta à noite)",
   "descricao": "\"Estive na Igreja das oito às onze; dali fui direto para o Cottage nº 2, dormir.\" Declarado na sala do expediente, diante do delegado.",
   "tagsOcultas": {
    "dominio": "comportamental",
    "subDominio": "alibi",
    "declaranteId": "gen_4_lavrador",
    "horaInicioDeclarada": -4,
    "horaFimDeclarada": 7,
    "corroborado": false
   }
  }
 ],
 "localidades": [
  {
   "id": "corpo",
   "rotuloMesa": "O Corpo",
   "titulo": "O Corpo — A Escola",
   "subtitulo": "Edith Taylor, mestra-escola, 29 anos",
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
    "A morta jaz no chão do cômodo a que a vila chama sala de aula, vestida como andava em casa. O delegado pôs guarda à porta; até a chegada {g:do perito|da perita}, nada se tocou.",
    "Ao primeiro exame do tronco e dos membros, [[gen_rigor]].",
    "O exame de perto encontra a lesão que respondeu por ela: [[gen_lesao_fatal]]. Em volta dela, [[gen_reacao_vital]].",
    "A maleta de instrumentos espera aberta sobre uma cadeira; o termômetro de mercúrio fica à mão, se {detective.title} {detective.surname} houver por bem medir a temperatura do corpo."
   ]
  },
  {
   "id": "cena",
   "rotuloMesa": "A Cena do Crime",
   "titulo": "A Cena — A Escola",
   "subtitulo": "Onde Edith Taylor foi achada",
   "acoesEspeciais": [],
   "prosa": [
    "A Escola guarda o dia em que a acharam. No cômodo, quadro de ardósia, estufa de ferro, carteiras enfileiradas; de um canto a outro, nada guarda o seu lugar; há mobília por erguer do chão.",
    "Junto do corpo, no chão: [[gen_instrumento]]."
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
    "A delegacia é uma sala de armários abertos. O delegado põe sobre a mesa o que os papéis guardam da morta e da vila, e deixa {g:o senhor|a senhora} ler por si.",
    "No registro da ronda, na letra do guarda: [[gen_visto_vivo]].",
    "Entre os papéis recolhidos por precaução: [[gen_motivo]].",
    "Um a um, ao chamado do delegado, os nomes dos papéis vêm à sala do expediente; a cadeira do interrogado espera de frente para a janela."
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
    "As casas em volta da cena têm paredes finas e janelas que dão para a mesma rua; entre uma casa e outra, um braço de distância."
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
 "dialogos": {
  "dialogo_gen_2_taverneiro": {
   "suspeitoId": "gen_2_taverneiro",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Alice Jones",
   "titulo": "Interrogatório — Alice Jones",
   "subtitulo": "Taverneira, 41 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Alice Jones entra na sala do expediente antes que o delegado acabe de chamar o nome, e toma a palavra junto com a cadeira. \"O negócio espera trancado. Pergunte de uma vez, faça o favor.\" E emenda, sem pergunta, o frio que fez e o preço do pão."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Olha o que se lhe mostra como quem confere fatura alheia. \"Isto não passou pelo meu balcão. Do que passou, respondo com o livro na mão.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_taverneiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não tenho que dar. Se Edith Taylor tinha desafeto, não foi freguês meu.\" Ajeita o xale sobre os ombros. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_taverneiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Edith Taylor? Gente de conta certa, ao que me constou. Pagava em dia e não pedia fiado.\" Ajeita o xale sobre os ombros. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_taverneiro]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos meus com ela, poucos e pagos. Se há soma pendente em algum livro, o livro que fale.\" Ajeita o xale sobre os ombros. \"O negócio não se guarda sozinho.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto a resposta vem embrulhada em coisa que ninguém perguntou: [[gen_alibi_gen_2_taverneiro]]. No meio do rodeio, a mão pousa na mesa e a fala desacelera, como quem pisa chão conhecido."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila diz muita coisa, e metade se desdiz no dia seguinte. Eu fico com o que se vê.\" Ajeita o xale sobre os ombros. \"O negócio não se guarda sozinho.\" Já na porta, ainda oferece o tempo que fez na sexta e o nome de quem passou tarde pela estrada."
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_0_lavrador": {
   "suspeitoId": "gen_0_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar James Thomas",
   "titulo": "Interrogatório — James Thomas",
   "subtitulo": "Lavrador, 28 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; James Thomas entra e senta-se de chapéu na mão. \"O guarda mandou, eu vim. Pergunte, que o campo não espera.\" Ao citar a primeira hora, corrige-a no meio da frase."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_0_lavrador]]. Posto contra a parede, alinha as horas com os dedos na tábua da mesa, uma a uma."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Edith Taylor eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Na despedida, cita a mesma hora de antes, e a hora vem diferente."
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_0_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Edith Taylor? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_0_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto as horas saem fora de ordem, e ele as corrige no meio: [[gen_alibi_gen_0_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_3_lavrador": {
   "suspeitoId": "gen_3_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar Joseph Roberts",
   "titulo": "Interrogatório — Joseph Roberts",
   "subtitulo": "Lavrador, 25 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "Joseph Roberts entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Vim assim que o guarda mandou. Diga lá, que a lida não espera.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_3_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Edith Taylor eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_3_lavrador]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Edith Taylor? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_3_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_3_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_5_lavrador": {
   "suspeitoId": "gen_5_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar William Taylor",
   "titulo": "Interrogatório — William Taylor",
   "subtitulo": "Lavrador, 52 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {
    "gen_instrumento": "reacao_gen_instrumento"
   },
   "confrontos": [
    {
     "requerCarta": "gen_instrumento",
     "rotulo": "[O Instrumento Abandonado] Por que o instrumento achado junto do corpo tem o seu nome na vila?"
    }
   ],
   "nos": {
    "abertura": {
     "fala": [
      "William Taylor entra na sala do expediente, senta-se na beira da cadeira e espera que perguntem. \"Vim assim que o guarda mandou. Diga lá, que a lida não espera.\" Diz do ofício, sem que ninguém pergunte: \"É a vida inteira nisto.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "reacao_gen_instrumento": {
     "fala": [
      "William Taylor olha a peça sem estender a mão. \"Do meu uso, quem o nega. Perde-se ferramenta como se perde chapéu, e quem a levou não ma pediu. Onde a acharam, não fui eu que a pus.\" A voz não muda do começo ao fim."
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome nenhum me cabe dar, {detective.title}. O que penso é o que a vila pensa: casa com dinheiro chama olho de fora.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_lavrador]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Edith Taylor era do trato de todos os dias; eu a conhecia como se conhece vizinho. Quem fez isto veio de fora do costume, é o que digo.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, os do ofício, e pagos em dia. Papel contra mim ninguém há de achar. O resto é conversa de estrada, e estrada é por onde entra gente que ninguém conta.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_5_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"A vila fala o que sempre falou: cada um por si. De mim hão de dizer que trabalho e calo.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  },
  "dialogo_gen_4_lavrador": {
   "suspeitoId": "gen_4_lavrador",
   "origemLocalidade": "delegacia",
   "chamada": "Interrogar William Wilson",
   "titulo": "Interrogatório — William Wilson",
   "subtitulo": "Lavrador, 36 anos",
   "noInicial": "abertura",
   "noEvasiva": "evasiva",
   "reacoesProva": {},
   "confrontos": [],
   "nos": {
    "abertura": {
     "fala": [
      "O delegado chama o nome; William Wilson entra e senta-se de chapéu na mão. \"O guarda mandou, eu vim. Pergunte, que o campo não espera.\" Fala baixo e mede a porta antes de cada resposta."
     ],
     "opcoes": [
      {
       "rotulo": "\"Onde esteve na sexta à noite? Sem rodeios.\"",
       "vaiPara": "b1_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"A sua sexta à noite, como foi? Conte com calma.\"",
       "vaiPara": "b1_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"O seu paradeiro na sexta à noite: hora e lugar.\"",
       "vaiPara": "b1_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"Costuma recolher-se cedo?\"",
       "vaiPara": "b1_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "evasiva": {
     "fala": [
      "Chega o rosto para ver e faz que não com a cabeça. \"Disso não sei dizer, {detective.title}. Da terra e do dia, pergunte o que quiser.\""
     ],
     "opcoes": []
    },
    "b1_firme": {
     "fala": [
      "\"Sem rodeios, então.\" E o paradeiro vem, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_firme": {
     "fala": [
      "\"Nome não dou, que não o tenho. Desafeto declarado de Edith Taylor eu não conhecia.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_cordial": {
     "fala": [
      "A sexta à noite vem contada do princípio, e os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_lavrador]]. A voz firma-se um fio, e a resposta sai mais inteira do que qualquer outra da conversa."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_cordial": {
     "fala": [
      "\"Edith Taylor? Gente de trato certo, ao que me constou. Cruzávamos na rua e na igreja, como todos.\" Levanta-se devagar. \"Se é tudo, volto à lida.\" Antes de sair, detém-se meio passo na porta, como quem ainda tem uma palavra; e sai sem a dizer."
     ],
     "opcoes": []
    },
    "b1_tecnico": {
     "fala": [
      "\"Hora e lugar.\" E os dá, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_tecnico": {
     "fala": [
      "\"Tratos, poucos; paga e trabalho, quando havia. Papel entre nós nunca correu.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    },
    "b1_obliquo": {
     "fala": [
      "\"Cedo ou tarde, conforme o dia.\" E a sexta à noite acaba saindo por inteiro, enquanto os olhos vão à porta entre uma hora e outra: [[gen_alibi_gen_4_lavrador]]."
     ],
     "opcoes": [
      {
       "rotulo": "\"Alguém nesta vila queria mal a Edith Taylor. Diga um nome.\"",
       "vaiPara": "b2_firme",
       "tom": "firme"
      },
      {
       "rotulo": "\"Que mulher era Edith Taylor, para quem lidava com ela todos os dias?\"",
       "vaiPara": "b2_cordial",
       "tom": "cordial"
      },
      {
       "rotulo": "\"Que tratos tinha com Edith Taylor? Somas e datas, se as houver.\"",
       "vaiPara": "b2_tecnico",
       "tom": "tecnico"
      },
      {
       "rotulo": "\"O que anda dizendo a vila?\"",
       "vaiPara": "b2_obliquo",
       "tom": "obliquo"
      }
     ]
    },
    "b2_obliquo": {
     "fala": [
      "\"Dizem muito, e eu ouço pouco; o dia come as horas de quem trabalha.\" Levanta-se devagar. \"Se é tudo, volto à lida.\""
     ],
     "opcoes": []
    }
   }
  }
 },
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
     "Sobre essa mesa, {detective.title} {detective.surname} dispõe a lente e o termômetro de mercúrio. A caderneta abre na primeira página em branco."
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
     "\"{detective.title} {detective.surname} — Escrevo-lhe como delegado de Haversham. Isto passa do meu ofício, e não fingirei o contrário. Edith Taylor, mestra-escola desta vila, foi achada morta. Pus guarda à porta e mandei que nada se tocasse até a sua chegada. Venha pelo primeiro trem; a vila paga os seus honorários.\"",
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
     "A plataforma cheira a carvão e palha molhada. Haversham estende-se além dos trilhos, e a luz de outubro deita rasa sobre os telhados.",
     "O delegado Stanmore espera junto ao portão e aperta a mão {g:do perito|da perita} com as duas mãos. \"Agradeço a presteza. Venha; explico-me pelo caminho.\""
    ],
    "rotuloBotao": "Ouvir o delegado"
   },
   {
    "id": "briefing",
    "titulo": "O relato do delegado Stanmore",
    "briefing": true,
    "paragrafos": [
     "\"O essencial é isto: Edith Taylor, 29 anos, mestra-escola. Achada morta na Escola. Não toquei em nada e não prendi ninguém.\"",
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
    "resposta": "\"Mulher de poucas companhias. O que houver, a vila sabe antes de mim.\""
   },
   {
    "id": "desafetos",
    "pergunta": "A morta tinha desafetos declarados?",
    "resposta": "\"Queixa lavrada contra ela não guardo. O que se diz por baixo da voz, {g:o senhor|a senhora} há de ouvir por si.\""
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
