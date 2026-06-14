import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração mínima do Vite para o MORTEM.
// No build de produção (GitHub Pages), o site é servido em
// /Mortem-new/ — daí o `base`. Em desenvolvimento local, fica na raiz.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Mortem-new/' : '/',
}));
