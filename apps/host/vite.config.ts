import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite';
import envs from '../../packages/env/env-common';

// https://vite.dev/config/
export default defineConfig((({ mode }: any) => {
  const remote = (envs.remoteAppHost as any)[mode];
  const accKey = envs.remoteAccessKey;
  const filename = envs.mf_fileName;

  const remotes: any = {};
  //* RCA
  remotes[accKey.rca] = {
    type: "module",
    name: accKey.rca,
    entry: `${remote.rca}/${filename}`,
    shareScope: 'default'
  };

  return {
    publicDir: path.resolve(__dirname, './public'),
    build: {
      target: 'chrome89',
    },    
    plugins: [
      federation({
        name: 'vite_provider',
        manifest: true,
        remotes,
        shared: {
          react: { singleton: true },
        },
      }),
      react(),
      tailwindcss(),
    ],
    server: {
      port: 5000,
      proxy: {
        '/api': {
          target: 'http://192.168.8.111:9081/platform',
          changeOrigin: true,
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
      },
    },
    
  };
}))
