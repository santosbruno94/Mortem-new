/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // O CARDÁPIO TIPOGRÁFICO DE 1893 (pivô "Gabinete Ilustrado, edição de
        // imprensa"). Cinco vozes, todas OFL e embarcadas (sem rede em runtime),
        // cada uma com seu ofício — hierarquia por corpo, caixa e espaço.
        //
        // serif — a voz do documento antigo: mestre, cartas, anotações à mão.
        serif: ['"IM Fell English"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        // prosa — TODA a leitura longa (corpo ≥15px): a face de texto do jogo.
        prosa: ['"Libre Caslon Text"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        // titulo — egípcia de manchete: títulos de painel e cabeçalhos.
        titulo: ['"Bevan"', 'Georgia', 'Cambria', 'serif'],
        // rotulo — condensada de balcão: carimbos, tarjas, rótulos, horas.
        rotulo: ['"Oswald"', '"Arial Narrow"', 'system-ui', 'sans-serif'],
        // cartaz — wood type: a ÚNICA licença de display — título e desfechos.
        cartaz: ['"Rye"', 'Georgia', 'serif'],
      },
      // ---------------------------------------------------------------
      // TOKENS DE DESIGN (overhaul "vitoriano premium"). Paleta única
      // para 2D e 3D: os materiais do diorama e do corpo leem estes
      // mesmos valores. Fonte de verdade: MORTEM_CONTEXTO.md, § Estética.
      // ---------------------------------------------------------------
      colors: {
        // ---------------------------------------------------------------
        // A PALETA (edição de imprensa): cena escura, documento claro.
        // Mesmos nomes de sempre com valores evoluídos (mais contraste
        // dentro da época) + um único acento novo, o verde-garrafa. Paleta
        // única 2D/3D: os materiais do diorama e da prancha leem estes
        // mesmos valores. Fonte de verdade: MORTEM_CONTEXTO.md, § Estética.
        // ---------------------------------------------------------------
        // O breu: o preto mais fundo da cena — fundo de mesa e vinhetas.
        breu: '#070604',
        // A madeira da mesa e seus veios (também a base do diorama).
        madeira: { DEFAULT: '#161009', veio: '#573f26', clara: '#4a351f', borda: '#241a10' },
        // O couro dos painéis: a moldura escura dos overlays.
        couro: { DEFAULT: '#1c1512', borda: '#3d3020' },
        // A luz de vela: o acento quente da interface.
        vela: { DEFAULT: '#d97706', clara: '#f2b03d', halo: 'rgba(242, 176, 61, 0.08)' },
        // Papel de carta: o claro que pousa sobre o escuro. Agora com a
        // escala completa do pergaminho — face, dobra e fio da borda.
        papel: {
          DEFAULT: '#ecdfc3',
          claro: '#f4ecd9',
          dobra: '#d8c9a8',
          borda: '#a8946c',
          sombra: '#292524',
        },
        // Tinta ferrogálica: o escuro que escreve sobre o papel.
        // apagada #6b5c43: 4,81:1 sobre pergaminho (WCAG mín. 4,5:1)
        tinta: { DEFAULT: '#251b10', clara: '#54452f', apagada: '#6b5c43' },
        // Latão de época: plaquetas, fivelas e o botão que importa; ouro = o
        // fio vivo (fios, ids, destaques) — a face mais clara do metal.
        latao: { DEFAULT: '#8a6d3b', claro: '#c9a961', ouro: '#d3b06a', escuro: '#54431f' },
        // Cera de lacre: selos e avisos.
        cera: { DEFAULT: '#7f1d1d', clara: '#a13b2e' },
        // Verde-garrafa: o ÚNICO acento novo — confirmações e vivo discreto.
        garrafa: { DEFAULT: '#2f5243', clara: '#7fae91' },
        // Matéria forense (corpo e retratos): livores e sangue.
        equimose: '#4c1d43',
        sangue: '#7f1d1d',
      },
      textColor: {
        // A tinta de leitura padrão da cena: pergaminho apagado sobre o breu.
        cena: '#d8cfc0',
      },
      boxShadow: {
        // Objeto pousado sobre a mesa (cartas, etiquetas).
        pousado: '0 2px 6px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.25)',
        // Objeto erguido da mesa (carta sob o cursor, arrasto).
        erguido: '0 10px 24px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.3)',
        // Halo quente de vela em elementos em foco/destaque.
        vela: '0 0 24px rgba(217, 119, 6, 0.15)',
        // Halo de vela mais vivo (chamada principal).
        'vela-viva': '0 0 34px rgba(217, 119, 6, 0.3), 0 2px 10px rgba(0, 0, 0, 0.6)',
        // Painel elevado (overlays).
        overlay: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        // Relevo de placa de latão (luz em cima, sombra embaixo).
        placa:
          'inset 0 1px 0 rgba(255, 235, 190, 0.35), inset 0 -2px 3px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.6)',
      },
      fontSize: {
        // Rótulo de época: minúsculo, espaçado, sempre uppercase no uso.
        rotulo: ['0.625rem', { letterSpacing: '0.2em', lineHeight: '1rem' }],
      },
      transitionDuration: {
        // Duração padrão dos gestos da mesa (hover, surgimento de overlay).
        gesto: '220ms',
      },
      letterSpacing: {
        // Espaçamento de firma: títulos serifados em caixa-alta.
        firma: '0.18em',
      },
    },
  },
  plugins: [],
};
