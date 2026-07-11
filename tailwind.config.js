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
    },
  },
  plugins: [],
};
