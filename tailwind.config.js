/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Tipografia serifada de época para títulos e nomes (Q7): IM Fell
        // English embarcada (licença OFL), com Georgia de reserva.
        serif: ['"IM Fell English"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      // ---------------------------------------------------------------
      // TOKENS DE DESIGN (overhaul "vitoriano premium"). Paleta única
      // para 2D e 3D: os materiais do diorama e do corpo leem estes
      // mesmos valores. Fonte de verdade: MORTEM_CONTEXTO.md, § Estética.
      // ---------------------------------------------------------------
      colors: {
        // A madeira da mesa e seus veios (também a base do diorama).
        madeira: { DEFAULT: '#12100d', veio: '#573f26', clara: '#4a351f', borda: '#241a10' },
        // A luz de vela: o acento quente da interface.
        vela: { DEFAULT: '#d97706', clara: '#fbbf24', halo: 'rgba(251, 191, 36, 0.07)' },
        // Papel de carta: o claro que pousa sobre o escuro. Agora com a
        // escala completa do pergaminho — face, dobra e fio da borda.
        papel: {
          DEFAULT: '#e7ddc8',
          claro: '#f2ead8',
          dobra: '#d8c9a8',
          borda: '#b3a17f',
          sombra: '#292524',
        },
        // Tinta ferrogálica: o escuro que escreve sobre o papel.
        tinta: { DEFAULT: '#2b2119', clara: '#54452f', apagada: '#7c6c50' },
        // Latão de época: plaquetas, fivelas e o botão que importa.
        latao: { DEFAULT: '#8a6d3b', claro: '#c9a961', escuro: '#54431f' },
        // Cera de lacre: selos e avisos.
        cera: { DEFAULT: '#7f1d1d', clara: '#a13b2e' },
        // Matéria forense (corpo 3D e retratos): livores e sangue.
        equimose: '#4c1d43',
        sangue: '#7f1d1d',
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
