import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api/steam': {
          target: 'https://api.steampowered.com',
          changeOrigin: true,
          rewrite: (path) => {
            const apiKey = env.VITE_STEAM_API_KEY;
            const newPath = path.replace('/api/steam', '');
            return `${newPath}${newPath.includes('?') ? '&' : '?'}key=${apiKey}`;
          },
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
            });
          }
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
