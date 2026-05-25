import { defineConfig } from 'vite'

export default async () => {
  const [tailwindcss, react] = await Promise.all([
    import('@tailwindcss/vite'),
    import('@vitejs/plugin-react'),
  ])
  
  return defineConfig({
    root: '.',
    plugins: [tailwindcss.default(), react.default()],
    resolve: {
      alias: {
        '@': '/src/renderer',
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: './pages/index.html',
          settings: './pages/settings.html',
        },
      },
      outDir: '.vite/build/renderer',
    },
  })
}
