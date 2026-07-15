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
  build: {
    // O ecossistema three/r3f (~820 KB min) já fica FORA do carregamento
    // inicial: só o alcançam os módulos lazy (diorama/*, corpo3d/*), por
    // import() dinâmico dentro da investigação — o index.html do arranque
    // (título + abertura) não referencia three nem r3f, que só chegam ao
    // abrir a maquete/o corpo 3D. NÃO forçamos manualChunks: isolar o three
    // num chunk vendor fazia o Vite injetar um <link modulepreload> dele no
    // index.html, ou seja, baixá-lo no arranque — o oposto do desejado. O
    // aviso de tamanho desse chunk deferido é esperado; subimos o teto para
    // não mascarar regressões do chunk inicial (o index).
    chunkSizeWarningLimit: 900,
  },
});
