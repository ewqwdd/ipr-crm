import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [tsconfigPaths(), react(), svgr()],
    clearScreen: false,
    base: env.VITE_BASE_URL,
    define: {
      'process.env': env,
    },
  };
});
