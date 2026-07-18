# MORTEM — Sugestões consolidadas (playtest isento + verificação da Vitória Absoluta)

Consolida em um único documento tudo que resultou das duas rodadas de playtest de
15/07/2026: a avaliação qualitativa/funcional isenta do vertical slice e a verificação
guiada de que "Vitória Absoluta" é alcançável. Organizado por prioridade e esforço
estimado, com o arquivo/área de código relevante quando aplicável.

## Alto impacto / baixo esforço

1. **Dar feedback quando "Apresentar uma prova…" não encontra nada para confrontar.**
   Achado da verificação da Vitória Absoluta: em `apresentarProva` (`src/store/jogo.js`),
   se o álibi do interrogado ainda não estiver registrado na mesa, a função simplesmente
   não faz nada — mas a tela mostra a reação narrativa do personagem normalmente, como se
   tivesse funcionado. Isso mascara o silêncio: um jogador (ou um QA) pode achar que
   confrontou o paradeiro quando na verdade nenhuma ligação foi criada no mural. Caso
   concreto: apresentar o "Registro da Estalagem" a Walter Arthurs *antes* da primeira
   pergunta do interrogatório (o álibi dele só nasce na resposta ao beat 1, não na fala de
   abertura) é um no-op silencioso. Sugestão: quando não houver álibi para confrontar,
   exibir algo como "ainda não há paradeiro declarado para confrontar" em vez de (ou além
   de) só a reação narrativa.

2. **Dar destaque visual às seções recolhidas que escondem evidência mecanicamente
   decisiva.** Achado do playtest original: o vínculo entre a arma do crime e o suspeito
   certo (o "Buril Claro no Estojo") mora dentro de uma seção recolhida ("A prateleira de
   gravar", na Oficina) sem nenhum destaque visual que a diferencie de seções de
   ambientação pura. Um jogador atento pode terminar o caso inteiro sem essa prova e nunca
   descobrir onde faltou olhar — o resultado é "Impunidade" sem pista alguma do motivo. Não
   é preciso entregar qual seção importa, só sinalizar visualmente "isto abre algo" (ícone,
   borda diferente, leve brilho) de forma consistente em toda seção recolhida do jogo.

3. **Resolver o espaço morto sob o diorama 3D em telas largas.** Em viewport desktop
   widescreen (1440×900), a câmera isométrica da maquete da vila deixa quase a metade
   inferior da tela como fundo preto liso — sem textura, sem elemento. Pode ser
   intencional (mesa escura sob um "spot" de luz), mas lê como espaço desperdiçado, não
   como atmosfera. Preencher (reflexo, textura de mesa, vinheta mais forte) ou reenquadrar
   câmera/canvas para não deixar metade da tela vazia.

4. **Expor a rota `?flat=1` (fallback 2D sem WebGL) como opção visível na tela de título**,
   não só como parâmetro de URL escondido. Jogadores em hardware fraco ou com WebGL
   desabilitado não têm hoje como descobrir essa rota sozinhos.

## Médio prazo

5. **Rebalancear o ritmo da investigação.** Hoje quase todo o tempo de jogo é coleta de
   baixo risco — tudo que se clica "dá certo", nada é uma escolha errada — e toda a tensão
   de decisão real fica concentrada nos últimos minutos, no mural da acusação. Vale
   estudar introduzir pelo menos um momento intermediário de escolha ativa durante a
   investigação (duas pistas que se contradizem e pedem que o jogador escolha em qual
   confiar antes de prosseguir), em vez de deixar toda decisão para o fim.

6. **Revisar o tom do bloco "O QUE FALTOU — CORTESIA DO TUTORIAL"** nos desfechos abaixo do
   ideal. Funcionalmente é ótimo (ninguém fica travado sem saber o que fazer), mas é o único
   momento em que a voz do jogo muda de registro — de detetive vitoriano em primeira pessoa
   para lista de tutorial — bem no clímax emocional do caso. Entregar a mesma informação na
   voz do próprio detetive (a dúvida dele, não uma lista de sistema) manteria a imersão.

7. **Code-splitting mais agressivo do chunk de three.js/react-three-fiber** (o build atual
   avisa sobre um chunk de 819 KB minificado). Carregá-lo só depois da abertura — que não
   usa o diorama — melhoraria o carregamento inicial, especialmente em conexões móveis.

## Baixa prioridade / polimento

8. **Passe manual de playtest em largura de celular real** antes de expandir o público do
   slice. O viewport meta tag está correto e há pelo menos um ajuste de alvo de toque (44px
   no mural), mas nem o QA automatizado do projeto nem os playtests realizados testaram
   numa largura de telefone de verdade.

9. **Dar leve destaque às "Perguntas ao Delegado"** opcionais no fim da abertura. Não
   custam tempo e é conteúdo de graça, mas o botão "Entrar — iniciar a investigação" tem o
   mesmo peso visual logo abaixo, e nada sinaliza que pular as perguntas descarta prosa já
   escrita.

10. **Convite explícito a jogar de novo ao fechar o caderno.** O gancho de replay é forte
    (tentar alcançar "Vitória Absoluta" depois de um desfecho parcial), mas hoje o
    encerramento é só "Fechar o caderno", sem nenhum gesto que convide a uma segunda
    tentativa com outro estilo de investigação.

---

*Consolidado a partir de duas sessões de playtest em 15/07/2026: uma avaliação isenta
jogada como jogador comum (dois desfechos testados: "Sucesso, com Gafes" e "Impunidade") e
uma verificação guiada, informada pela leitura do código-fonte, de que "Vitória Absoluta" é
alcançável (confirmado via `scripts/qa.mjs`, `scripts/qa-ui.mjs` e uma playthrough
independente). Nenhuma destas sugestões aponta bug que impeça terminar o caso ou alcançar
qualquer um dos 4 desfechos — são todas de polimento, ritmo ou clareza de interface.*
