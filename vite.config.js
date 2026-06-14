import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração mínima do Vite para o MORTEM.
// Servido na raiz do domínio (Vercel) — sem `base` customizado.
export default defineConfig({
  plugins: [react()],
});
