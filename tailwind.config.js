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
      // TOKENS DE DESIGN (overhaul "vitoriano refinado"). Paleta única
      // para 2D e 3D: os materiais do diorama e do corpo leem estes
      // mesmos valores. Aditivos — as classes stone/amber continuam
      // valendo onde ainda não houve refino.
      // ---------------------------------------------------------------
      colors: {
        // A madeira da mesa e seus veios (também a base do diorama).
        madeira: { DEFAULT: '#12100d', veio: '#573f26', clara: '#4a351f' },
        // A luz de vela: o acento quente da interface.
        vela: { DEFAULT: '#d97706', clara: '#fbbf24', halo: 'rgba(251, 191, 36, 0.07)' },
        // Papel de carta: o claro que pousa sobre o escuro.
        papel: { DEFAULT: '#e7ddc8', sombra: '#292524' },
        // Matéria forense (corpo 3D e retratos): livores e sangue.
        equimose: '#4c1d43',
        sangue: '#7f1d1d',
      },
      boxShadow: {
        // Objeto pousado sobre a mesa (cartas, etiquetas).
        pousado: '0 2px 6px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.25)',
        // Halo quente de vela em elementos em foco/destaque.
        vela: '0 0 24px rgba(217, 119, 6, 0.15)',
        // Painel elevado (overlays).
        overlay: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
      },
      fontSize: {
        // Rótulo de época: minúsculo, espaçado, sempre uppercase no uso.
        rotulo: ['0.625rem', { letterSpacing: '0.2em', lineHeight: '1rem' }],
      },
      transitionDuration: {
        // Duração padrão dos gestos da mesa (hover, surgimento de overlay).
        gesto: '220ms',
      },
    },
  },
  plugins: [],
};
