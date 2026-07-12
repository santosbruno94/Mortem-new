import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração mínima do Vite para o MORTEM.
// Servido na raiz do domínio (Vercel) — sem `base` customizado.
export default defineConfig({
  plugins: [react()],
  // O chunk 3D chega por import() tardio: pré-otimizar as deps evita o
  // full-reload do dev server no meio de uma sessão (e do QA de UI)
  // quando o diorama é aberto pela primeira vez com o cache frio.
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
});
